from buildInformationObject import *
class LabProcess(infoObject):
  import java.sql.ResultSetMetaData
  import com.uniconnect.uniflow as uniflow
  from com.uniconnect.uniflow.exception import SystemException
  from java.sql import SQLException

  errorLocation = ""

  def __init__(self, switchboard, runId, runIndex, steps):
    self.switchboard = switchboard
    self.runId = runId
    self.runIndex = runIndex
    self.steps = steps

    self.query =  """ SELECT
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

  def getRun(self):

    runObject = self.getData(self.query, self.udQuery)
    return runObject

  def buildRunNode(self, specimenIdx=None):

    dataObject = self.getData(self.query, self.udQuery)
    objectNode = self.buildNode('run', dataObject, self.runIndex, self.query, self.udQuery)
    objectNode.add('specimen_link', str(specimenIdx))
    objectNode.add('runData', '')
    objectNode.get('runData').add(self.runMethods(self.steps))

    return objectNode

  def runMethods(self, step):

    try:
      errorLocation = "runMethods - creating query"
      query = """ SELECT am.methodName
                  FROM analysisMethods am
                  INNER JOIN analysisMethodVersions amv
                    ON am.id = amv.analysisMethodsId
                  WHERE am.analysisStepName = '%s'
                    AND amv.active = 1  """ % step

      errorLocation = "runMethods - executing query"
      stmt = self.switchboard.connection.createStatement()
      rs = stmt.executeQuery(query)

      errorLocation = "runMethods - looping result set"
      while rs.next():
        analysisMethod = rs.getString('methodName')
        analysisMethodTree = self.Node('analysisMethod', analysisMethod)

        errorLocation = "runMethods - running loadData methods for analysis method: " + analysisMethod
        loadData =  self.getLoadData(analysisMethod, step)
        analysisMethodTree.add(loadData)

        errorLocation = "runMethods - running resultData methods for analysis method: " + analysisMethod
        resultData =  self.getResultData(analysisMethod, step)
        analysisMethodTree.add(resultData)

      errorLocation = "runMethods - closing result set"
      rs.close()

      self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'true')

    except Exception as e:
      self.switchboard.log("---*** EXCEPTION ***---")
      self.switchboard.log("ERROR LOCATION: " + errorLocation)
      self.switchboard.log("ERROR MESSAGE: " + str(e.message))
      self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')
      analysisMethodTree = self.uniflow.Node("ERROR", '---*** EXCEPTION ***---')

    except StandardError as e:
      self.switchboard.log("---*** STANDRAD PYTHON ERROR ***---")
      self.switchboard.log("ERROR LOCATION: " + errorLocation)
      self.switchboard.log("ERROR MESSAGE: " + str(e.message))
      self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')
      analysisMethodTree = self.uniflow.Node("ERROR", '---*** Standard Py Error *** ')

    except SystemException as e:
      self.switchboard.log("---*** UNIFlow SystemException ***---")
      self.switchboard.log("ERROR LOCATION: " + errorLocation)
      self.switchboard.log(str(e.message))
      self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')

    except SQLException as e:
      self.switchboard.log("---*** SQLException ***---")
      self.switchboard.log("ERROR LOCATION: " + errorLocation)
      self.switchboard.log(str(e.message))
      self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')

    except BaseException as e:
      self.switchboard.log("---*** PYTHON EXCEPTION ***---")
      self.switchboard.log("ERROR LOCATION: " + errorLocation)
      self.switchboard.log("ERROR MESSAGE: " + str(e.message))
      self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')
      analysisMethodTree = self.uniflow.Node("ERROR", '---*** PYTHON EXCEPTION ***---')

    except TypeError as e:
      self.switchboard.log("---*** TYPE ERROR ***---")
      self.switchboard.log("ERROR LOCATION: " + errorLocation)
      self.switchboard.log("ERROR MESSAGE: " + str(e.message))
      self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')
      analysisMethodTree = self.uniflow.Node("ERROR", '---*** TYPE ERROR ***----')

    except:
      self.switchboard.log("---*** UNSPECIFIED ERROR ***---")
      self.switchboard.log("ERROR LOCATION: " + errorLocation)
      self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')
      analysisMethodTree = self.uniflow.Node("ERROR", "---*** UNSPECIFIED ERRROR ***---")

    return analysisMethodTree


  def getResultData(self, analysisMethod, step):

    try:
      resultData = self.uniflow.Node("resultData", "")

      errorLocation = "getResultData - creating query"
      query = """ SELECT
                    adef.value AS "name",
                    IFNULL(adef.resultCode, '') AS "resultCode"
                  FROM analysisDataDefinition adef
                  INNER JOIN analysisMethodVersions aver
                    ON adef.analysisMethodVersionsId = aver.id
                  INNER JOIN analysisMethods am
                    ON aver.analysisMethodsId = am.id
                  WHERE am.analysisStepName = '%s'
                    AND adef.definerType = 'data'
                    AND aver.active = 1
                    AND am.methodName = '%s' """ % (step, analysisMethod)

      errorLocation = "getResultData - executing query"
      stmt = self.switchboard.connection.createStatement()
      rs = stmt.executeQuery(query)

      errorLocation = "getResultData - looping result set"
      while rs.next():

        resultDatum = resultData.add("resultDatum", "")

        errorLocation = "getResultData - adding results to load tree"
        resultDatum.add("name", rs.getString('name'))
        resultDatum.add("resultCode", rs.getString('resultCode'))

      errorLocation = "getResultData - closing loop"
      rs.close()

      self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'true')

    except Exception as e:
      self.switchboard.log("---*** EXCEPTION ***---")
      self.switchboard.log("ERROR LOCATION: " + errorLocation)
      self.switchboard.log("ERROR MESSAGE: " + str(e.message))
      self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')
      analysisMethodTree = self.uniflow.Node("ERROR", '---*** EXCEPTION ***---')

    except StandardError as e:
      self.switchboard.log("---*** STANDRAD PYTHON ERROR ***---")
      self.switchboard.log("ERROR LOCATION: " + errorLocation)
      self.switchboard.log("ERROR MESSAGE: " + str(e.message))
      self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')
      analysisMethodTree = self.uniflow.Node("ERROR", '---*** Standard Py Error *** ')

    # except SystemException as e:
    #   switchboard.log("---*** UNIFlow SystemException ***----")
    #   switchboard.log(str(e.message))
    #   switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')

    # except java.sql.SQLException as e:
    #   switchboard.log("---*** SQLException ***----")
    #   switchboard.log(str(e.message))
    #   switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')

    except BaseException as e:
      self.switchboard.log("---*** PYTHON EXCEPTION ***---")
      self.switchboard.log("ERROR LOCATION: " + errorLocation)
      self.switchboard.log("ERROR MESSAGE: " + str(e.message))
      self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')
      analysisMethodTree = self.uniflow.Node("ERROR", '---*** PYTHON EXCEPTION ***---')

    except TypeError as e:
      self.switchboard.log("---*** TYPE ERROR ***----")
      self.switchboard.log("ERROR LOCATION: " + errorLocation)
      self.switchboard.log("ERROR MESSAGE: " + str(e.message))
      self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')
      analysisMethodTree = self.uniflow.Node("ERROR", '---*** TYPE ERROR ***----')

    except:
      self.switchboard.log("---*** UNSPECIFIED ERROR ***---")
      self.switchboard.log("ERROR LOCATION: " + errorLocation)
      self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')
      analysisMethodTree = self.uniflow.Node("ERROR", "---*** UNSPECIFIED ERRROR ***---")

    return resultData


  def getLoadData(self,analysisMethod, step):

    try:

      loadData = self.uniflow.Node("loadData", "")

      errorLocation = "getLoadData - creating query"
      query = """ SELECT
                    ld.value AS "name",
                    IFNULL(ld.resultCode, '') AS "resultCode"
                  FROM analysisDataDefinition adef
                  INNER JOIN analysisMethodVersions aver
                    ON adef.analysisMethodVersionsId = aver.id
                  INNER JOIN analysisDataDefinition ld
                    ON adef.loadDataAnalysisDataDefinitionId = ld.id
                  INNER JOIN analysisMethods am
                    ON aver.analysisMethodsId = am.id
                  WHERE am.analysisStepName = '%s'
                    AND adef.definerType = 'loadData'
                    AND aver.active = 1
                    AND am.methodName = '%s' """ % (step, analysisMethod)

      errorLocation = "getLoadData - executing query"
      stmt = self.switchboard.connection.createStatement()
      rs = stmt.executeQuery(query)

      errorLocation = "getLoadData - looping result set"
      while rs.next():

        loadDatum = loadData.add("loadDatum", "")

        errorLocation = "getLoadData - adding results to load tree"
        loadDatum.add("name", rs.getString('name'))
        loadDatum.add("resultCode", rs.getString('resultCode'))


      errorLocation = "getLoadData - closing loop"
      rs.close()

      self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'true')

    except Exception as e:
      self.switchboard.log("---*** EXCEPTION ***---")
      self.switchboard.log("ERROR LOCATION: " + errorLocation)
      self.switchboard.log("ERROR MESSAGE: " + str(e.message))
      self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')
      analysisMethodTree = self.uniflow.Node("ERROR", '---*** EXCEPTION ***---')

    except StandardError as e:
      self.switchboard.log("---*** STANDRAD PYTHON ERROR ***---")
      self.switchboard.log("ERROR LOCATION: " + errorLocation)
      self.switchboard.log("ERROR MESSAGE: " + str(e.message))
      self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')
      analysisMethodTree = self.uniflow.Node("ERROR", '---*** Standard Py Error *** ')

    # except SystemException as e:
    #   switchboard.log("---*** UNIFlow SystemException ***----")
    #   switchboard.log(str(e.message))
    #   switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')

    # except java.sql.SQLException as e:
    #   switchboard.log("---*** SQLException ***----")
    #   switchboard.log(str(e.message))
    #   switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')

    except BaseException as e:
      self.switchboard.log("---*** PYTHON EXCEPTION ***---")
      self.switchboard.log("ERROR LOCATION: " + errorLocation)
      self.switchboard.log("ERROR MESSAGE: " + str(e.message))
      self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')
      analysisMethodTree = self.uniflow.Node("ERROR", '---*** PYTHON EXCEPTION ***---')

    except TypeError as e:
      self.switchboard.log("---*** TYPE ERROR ***----")
      self.switchboard.log("ERROR LOCATION: " + errorLocation)
      self.switchboard.log("ERROR MESSAGE: " + str(e.message))
      self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')
      analysisMethodTree = self.uniflow.Node("ERROR", '---*** TYPE ERROR ***----')

    except:
      self.switchboard.log("---*** UNSPECIFIED ERROR ***---")
      self.switchboard.log("ERROR LOCATION: " + errorLocation)
      self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')
      analysisMethodTree = self.uniflow.Node("ERROR", "---*** UNSPECIFIED ERRROR ***---")


    return loadData
