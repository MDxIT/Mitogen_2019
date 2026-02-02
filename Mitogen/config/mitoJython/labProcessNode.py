from java.sql import SQLException
from buildInformationObject import infoObject
from analysis import AnalysisMethod
from run import Run
from containers import ControlRun
class LabProcess(infoObject):
    """Class for adding analysis data definition to result tree
        
    Attributes:
        switchboard: uniflow switchboard
        runId: sample/control/pool run id
        runIndex: unsure what this is for, possibly deprecated
        steps: current step (could be replaced with analysis method version id)
        containerType: container type (runId/controlRunId/poolRunId)

    TODO:
        add logic for pool tubes
        possibly replace the infoObject with new Run/ControlRun/PoolRun objects
    """
    import java.sql.ResultSetMetaData
    import com.uniconnect.uniflow as uniflow
    def __init__(self, switchboard, runId, runIndex, steps, containerType):
        self.switchboard = switchboard
        self.runId = runId
        self.runIndex = runIndex
        self.steps = steps
        self.containerType = containerType
        self.query =    """ SELECT
                            sr.runId,
                            sr.runType,
                            IFNULL(sr.currentContainerId, '') AS "currentContainerId",
                            IFNULL(sr.currentParentId, '') AS "currentParentId",
                            IFNULL(sr.currentParentPosition, '') AS "currentParentPosition",
                            IFNULL(sr.completedResult, 'In Lab') AS "status",
                            IFNULL(e.eventDate, '') AS "statusDate"
                        FROM specimenRuns sr
                        INNER JOIN events e
                            ON sr.lastUpdatedEventId = e.eventId
                        WHERE sr.runId = '%s' 
                        UNION
                        SELECT
                            cr.controlRunId,
                            cr.runType,
                            IFNULL(cr.currentContainerId, '') AS "currentContainerId",
                            IFNULL(cr.currentParentId, '') AS "currentParentId",
                            IFNULL(cr.currentParentPosition, '') AS "currentParentPosition",
                            IFNULL(cr.completedResult, 'In Lab') AS "status",
                            IFNULL(e.eventDate, '') AS "statusDate"
                        FROM controlRuns cr
                        INNER JOIN events e
                            ON cr.lastUpdatedEventId = e.eventId
                        WHERE cr.controlRunId = '%s' """ % (self.runId, self.runId)

        self.udQuery = """ SELECT '' FROM dual WHERE 1 = 0 """

    def buildRunNode(self, specimenIdx=None):

        dataObject = self.getData(self.query, self.udQuery)
        objectNode = self.buildNode('run', dataObject, self.runIndex, self.query, self.udQuery)
        objectNode.add('specimen_link', str(specimenIdx))
        objectNode.add('runData', '')
        objectNode.get('runData').add(self.runMethods(self.steps))

        return objectNode

    def runMethods(self, step):

        try:
            query = """ SELECT am.methodName, amv.id
                        FROM analysisMethods am
                        INNER JOIN analysisMethodVersions amv
                            ON am.id = amv.analysisMethodsId
                        WHERE am.analysisStepName = '%s'
                            AND amv.active = 1  """ % step

            stmt = self.switchboard.connection.createStatement()
            rs = stmt.executeQuery(query)

            while rs.next():
                analysisMethod = rs.getString('methodName')
                analysisMethodTree = self.Node('analysisMethod', analysisMethod)

                resultData =    self.makeResultNode(rs.getString('id'))
                analysisMethodTree.add(resultData)

            rs.close()

            self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'true')

        except Exception as e:
            self.switchboard.log("---*** EXCEPTION ***---")
            self.switchboard.log("ERROR MESSAGE: " + str(e.message))
            self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')
            analysisMethodTree = self.uniflow.Node("ERROR", '---*** EXCEPTION ***---')

        except StandardError as e:
            self.switchboard.log("---*** STANDRAD PYTHON ERROR ***---")
            self.switchboard.log("ERROR MESSAGE: " + str(e.message))
            self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')
            analysisMethodTree = self.uniflow.Node("ERROR", '---*** Standard Py Error *** ')

        except SQLException as e:
            self.switchboard.log("---*** SQLException ***---")
            self.switchboard.log(str(e.message))
            self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')

        except BaseException as e:
            self.switchboard.log("---*** PYTHON EXCEPTION ***---")
            self.switchboard.log("ERROR MESSAGE: " + str(e.message))
            self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')
            analysisMethodTree = self.uniflow.Node("ERROR", '---*** PYTHON EXCEPTION ***---')

        except TypeError as e:
            self.switchboard.log("---*** TYPE ERROR ***---")
            self.switchboard.log("ERROR MESSAGE: " + str(e.message))
            self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')
            analysisMethodTree = self.uniflow.Node("ERROR", '---*** TYPE ERROR ***----')

        except:
            self.switchboard.log("---*** UNSPECIFIED ERROR ***---")
            self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')
            analysisMethodTree = self.uniflow.Node("ERROR", "---*** UNSPECIFIED ERRROR ***---")

        return analysisMethodTree

    def getSampleDatum(self, methodVersion, resultNode):
        """Adds field to result node if associated panels match
        Args:
            field: field dict from associated analysis method
            resultNode: uniflow node
        """
        run = Run(self.switchboard, self.runId)
        am = AnalysisMethod(self.switchboard, methodVersion)
        for field in am.method_config:
            field_name = field.get('field_name', '')
            result_code = field.get('result_code', '')
            field_panels = field.get('panels')
            if field_panels:
                if run.panel in field_panels:
                    self.switchboard.log('ADDING {} TO TREE FOR {}'.format(field_name, self.runId))
                    sampleDatum = resultNode.add('resultDatum', '')
                    sampleDatum.add('name', field_name)
                    sampleDatum.add('resultCode', result_code)
                else:
                    self.switchboard.log('PANELS DO NOT MATCH. SKIPPING {} FOR {}'.format(field_name, self.runId))

            else:
                sampleDatum = resultNode.add('resultDatum', '')
                sampleDatum.add('name', field_name)
                sampleDatum.add('resultCode', result_code)
                self.switchboard.log('ADDING {} TO TREE FOR {}'.format(field_name, self.runId))

    def getControlDatum(self, methodVersion, resultNode):
        #TODO method_config will be replaced with control_config
        #TODO logic will be added to only apply fields for the control type
        """Adds field to node structure
        Args:
            field: field dict from associated analysis method
            resultNode: uniflow node
        """
        #ctrl_run = ControlRun(self.switchboard, self.runId)
        am = AnalysisMethod(self.switchboard, methodVersion)
        for field in am.method_config:
            sampleDatum = resultNode.add('resultDatum', '')
            sampleDatum.add('name', field.get('field_name', ''))
            sampleDatum.add('resultCode', field.get('result_code', ''))

    def makeResultNode(self, methodVersion):
        """Creates node with analysis field (data definition) info
        Args:
            analysisMethod: DEPRECATED
            step: DEPRECATED
            methodVersion: analysis method version id
        Returns:
            resultNode: uniflow node with analysis field info
        """
        resultNode = self.uniflow.Node('resultData', '')

        if self.containerType == 'runId':
            self.getSampleDatum(methodVersion, resultNode)
        elif self.containerType == 'controlRunId':
            self.getControlDatum(methodVersion, resultNode)
        
        return resultNode
