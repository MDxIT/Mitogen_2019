import com.uniconnect.uniflow as uniflow
from java.sql import SQLException
class Run(object):
    """Run object class
    Args:
        switchboard
        runId

    Attributes:
        switchboard: sitchboard object
        runId: run id
        curCon: current container id
        curPar: current parent id
        curPos: current parent position
        methId: specimen methods id
        status: completed result
        wrkFlowRunId: workflow parent(run) id - specimenRuns id not runId
    """
    def __init__(self, switchboard, runId):
        self.switchboard = switchboard
        self.runId = runId
        self._table_id = None
        self.curCon = None
        self.curPar = None
        self.curPos = None
        self.methId = None
        self.status = None
        self.wrkFlowRunId = None

        # Set values
        self.setRunValues()

    def __repr__(self):
        return 'RUN(RunId: {}, CurCon: {}, CurPar{}, CurRes: {})'.format(self.runId, self.curCon, self.curPar, self.status)

    @property
    def run_id(self):
        return self.runId
    @property
    def table_id(self):
        return self._table_id

    @property
    def current_container(self):
        return self.curCon

    @property
    def current_parent(self):
        return self.curPar

    @property
    def current_position(self):
        return self.curPos

    @property
    def result(self):
        return self.status

    def setRunValues(self):
        """Sets object values based on passed run id
        """
        runId = self.runId
        tblId = None
        cCon  = None
        cPar  = None
        cPos  = None
        mhId  = None
        cRes  = None
        pRun  = None
        try:
            cQuery = '''
                SELECT
                    id,
                    currentContainerId, 
                    currentParentId,
                    currentParentPosition,
                    specimenMethodsId,
                    completedResult,
                    parentWorkflowSpecimenRunId
                FROM specimenRuns
                WHERE runId = ?
            '''
            cQueryStmt = self.switchboard.connection.prepareStatement(cQuery)
            cQueryStmt.setString(1, runId)
            cRs = cQueryStmt.executeQuery()
            while cRs.next():
                cCon = cRs.getString('currentContainerId')
                cPar = cRs.getString('currentParentId')
                cPos = cRs.getString('currentParentPosition')
                mhId = cRs.getString('specimenMethodsId')
                cRes = cRs.getString('completedResult')
                pRun = cRs.getString('parentWorkflowSpecimenRunId')
                self._table_id = cRs.getString('id')
                self.curCon = cCon
                self.curPar = cPar
                self.curPos = cPos
                self.methId = mhId
                self.status = cRes
                self.wrkFlowRunId = pRun

            self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'true')
            return True

        except SQLException as e:
            self.switchboard.log("---*** SQLException AT SETRUNVALUES ***----")
            self.switchboard.log("ERROR MESSAGE: " + str(e.message))
            self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')
            raise
            return
        except BaseException as e:
            self.switchboard.log("---*** PYTHON EXCEPTION AT SETRUNVALUES ***---")
            self.switchboard.log("ERROR MESSAGE: " + str(e.message))
            self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')
            raise
            return
        finally:
            cQueryStmt.close()
    
    @property
    def commentHistory(self):
        """Returns comment history
        """
        comment_history = ''
        h_query = '''
            SELECT IFNULL(GROUP_CONCAT(DISTINCT(note) SEPARATOR '<br><br>'), '') AS 'commentHistory' 
            FROM containerNotes
            WHERE containerId = ?
        '''
        try:
            stmt = self.switchboard.connection.prepareStatement(h_query)
            stmt.setString(1, self.runId)
            rs = stmt.executeQuery()

            if rs.next():
                comment_history = rs.getString(1)

            self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'true')
            return comment_history
        except SQLException as e:
            self.switchboard.log("---*** SQLException AT COMMENTHISTORY ***----")
            self.switchboard.log("ERROR MESSAGE: " + str(e.message))
            self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')
            raise
            return
        except BaseException as e:
            self.switchboard.log("---*** PYTHON EXCEPTION AT COMMENTHISTORY ***---")
            self.switchboard.log("ERROR MESSAGE: " + str(e.message))
            self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')
            raise
            return
        finally:
            stmt.close()

    @property
    def sampleDetails(self):
        """Retrives sample details for the run
        """
        s_query = '''
            SELECT
              IFNULL(rs.receivedDate, '') AS 'specimenReceiveDate',
              IFNULL(CONCAT( p.lastName, ', ', p.firstName, ' ', p.middleName ), '') AS 'patientName',
              IFNULL(vv.displayValue, '') AS 'orderPriority',
              IFNULL(rf.mrnFacility, '') AS 'mrnFacility',
              IFNULL(rf.mrn, '') AS 'mrn',
              IFNULL(rs.specimenType, '') AS 'specimenType',
              IFNULL(p.dob, '') AS 'dob',
              CONCAT(pan.name, ' ', IFNULL(t.name,''), ' ', IFNULL(m.name,'')) AS 'testAndMethod',
              IFNULL(ui.name, '') AS 'queuedBy',
              IFNULL(os.name, '') AS 'customerName'
            FROM queues q
              LEFT JOIN poolRuns pr
                ON pr.currentContainerId = ?
              INNER JOIN specimenRuns sr
                ON q.containerId = sr.runId
                OR (q.containerId = sr.currentParentId AND q.containerId = ?)
                OR ( sr.currentParentId = ? AND pr.currentContainerId IS NOT NULL )
              INNER JOIN events e 
                ON q.eventId = e.eventId
              INNER JOIN userInfo ui 
                ON e.userId = ui.userId 
              INNER JOIN contents c 
                ON sr.currentContainerId = c.containerId 
                AND c.contentType = 'requestId' 
              INNER JOIN requestForms rf 
                ON c.content = rf.requestId
              LEFT JOIN validValues vv
                ON vv.value = rf.priority
                AND vv.setName = 'priority'
              INNER JOIN patients p 
                ON rf.patientId = p.patientId
              INNER JOIN organizationSites os 
                ON rf.physicianSiteId = os.siteId
              INNER JOIN specimenMethods sm 
                ON sr.specimenMethodsId = sm.id
              INNER JOIN panels pan
                ON sm.panelCode = pan.panelCode
              LEFT JOIN methods m 
                ON sm.methodCode = m.methodCode
              LEFT JOIN tests t 
                ON sm.testCode = t.testCode
              INNER JOIN contents c2
                ON sr.currentContainerId = c2.containerId
                AND c2.contentType = 'specimenId'
              INNER JOIN requestSpecimens rs 
                ON rf.requestId = rs.requestId 
                AND rs.specimenId = c2.content
            WHERE sr.runId = ?
                AND q.step = ?
        '''
        try:
            stmt = self.switchboard.connection.prepareStatement(s_query)
            stmt.setString(1, self.curPar)
            stmt.setString(2, self.curPar)
            stmt.setString(3, self.curPar)
            stmt.setString(4, self.runId)
            stmt.setString(5, self.switchboard.stepName)
            rs = stmt.executeQuery()

            if rs.next():
                sample_details = {
                    'specimenReceiveData': rs.getString('specimenReceiveDate'),
                    'patientName': rs.getString('patientName'),
                    'dob': rs.getString('dob'),
                    'mrnFacility': rs.getString('mrnFacility'),
                    'mrn': rs.getString('mrn'),
                    'specimenType': rs.getString('specimenType'),
                    'orderPriority': rs.getString('orderPriority'),
                    'testAndMethod': rs.getString('testAndMethod'),
                    'queuedBy': rs.getString('queuedBy'),
                    'customerName': rs.getString('customerName'),
                }
                self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'true')
                return sample_details
            else:
                self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'true')
                return {}

        except SQLException as e:
            self.switchboard.log("---*** SQLException AT SAMPLEDETAILS ***----")
            self.switchboard.log("ERROR MESSAGE: " + str(e.message))
            self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')
            raise
            return
        except BaseException as e:
            self.switchboard.log("---*** PYTHON EXCEPTION AT SAMPLEDETAILS ***---")
            self.switchboard.log("ERROR MESSAGE: " + str(e.message))
            self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')
            raise
            return
        finally:
            stmt.close()


    def getRunId(self):
        return self.runId

    def getCurrentContainer(self):
        return self.curCon

    def getCurrentParent(self):
        return self.curPar

    def getCurrentPosition(self):
        return self.curPos

    def getMethodId(self):
        return self.methId

    def getCurStatus(self):
        return self.status

    def setCurrentContainer(self, newCurCon):
        self.curCon = newCurCon

    def setCurrentParent(self, newCurPar):
        self.curPar = newCurPar

    def setCurrentPosition(self, newCurPos):
        self.curPos = newCurPos

    def setMethodId(self, newMethId):
        self.methId = newMethId

    def setCurStatus(self, newStatus):
        self.status = newStatus

    def getAnalysisRes(self):
        """Returns the last analysis result for the run
        """
        runId = self.getRunId()
        try: 
            curRes = ''
            resQuery = '''
                SELECT adr.result AS 'curRes'
                FROM specimenRuns sr
                INNER JOIN analysisDataRuns adr 
                    ON adr.specimenRunsId = sr.id
                WHERE sr.runId = ?
            '''
            resQueryStmt = self.switchboard.connection.prepareStatement(resQuery)
            resQueryStmt.setString(1, runId)
            resRs = resQueryStmt.executeQuery()

            while resRs.next():
                curRes = resRs.getString('curRes')

            self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'true')
            return curRes

        except Exception as e:
            self.switchboard.log("---*** EXCEPTION AT GETANALYSISRES ***---")
            self.switchboard.log("ERROR MESSAGE: " + str(e.message))
            self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')
            raise
            return
        except SQLException as e:
            self.switchboard.log("---*** SQLException AT GETANALYSISRES ***----")
            self.switchboard.log("ERROR MESSAGE: " + str(e.message))
            self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')
            raise
            return
        except BaseException as e:
            self.switchboard.log("---*** PYTHON EXCEPTION AT GETANALYSISRES ***---")
            self.switchboard.log("ERROR MESSAGE: " + str(e.message))
            self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')
            raise
            return
        finally:
            resQueryStmt.close()
