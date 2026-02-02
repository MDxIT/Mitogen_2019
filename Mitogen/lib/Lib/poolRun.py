import com.uniconnect.uniflow as uniflow
from java.sql import SQLException

class PoolRun:
    '''Creates a run with needed attributes
           * See endRun.py for example implementation 
       
        toDo: make attributes private(@property decorator), add setters(@{attr_name}.setter decorator)
  
    '''
    def __init__(self, switchboard, poolRunId):
        self.switchboard = switchboard
        self.poolRunId = poolRunId
        self._table_id = None
        self.curCon = None
        self.curPar = None
        self.curPos = None
        self.status = None

        # Set values
        self.setPoolRunValues()

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

    @property
    def panel(self):
        return ''

    def setPoolRunValues(self):
        try:
            cQuery = '''
                SELECT
                  id,
                  currentContainerId, 
                  currentParentId,
                  currentParentPosition,
                  completedResult
                FROM poolRuns
                WHERE poolRunId = ?
            '''
            cQueryStmt = self.switchboard.connection.prepareStatement(cQuery)
            cQueryStmt.setString(1, self.poolRunId)
            cRs = cQueryStmt.executeQuery()
            while cRs.next():
                self._table_id = cRs.getString('id')
                self.curCon = cRs.getString('currentContainerId')
                self.curPar = cRs.getString('currentParentId')
                self.curPos = cRs.getString('currentParentPosition')
                self.status = cRs.getString('completedResult')

            self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'true')
            return True

        except SQLException as e:
            self.switchboard.log("---*** SQLException ***----")
            self.switchboard.log("ERROR MESSAGE: " + str(e.message))
            self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')
        except BaseException as e:
            self.switchboard.log("---*** PYTHON EXCEPTION ***---")
            self.switchboard.log("ERROR MESSAGE: " + str(e.message))
            self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')
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
            stmt.setString(1, self.poolRunId)
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
        query= '''
            SELECT 
                IFNULL(vv.displayValue, '') AS 'orderPriority',
                IFNULL(ui.name, '') AS 'queuedBy'
            FROM queues q
            INNER JOIN poolRuns pr
                ON q.containerId = pr.poolRunId
                OR (q.containerId = pr.currentParentId AND q.containerId = ?)
            INNER JOIN events e 
                ON q.eventId = e.eventId
            INNER JOIN userInfo ui 
                ON e.userId = ui.userId  
            LEFT JOIN containerProperties cp1
                ON pr.currentContainerId = cp1.containerId
                AND property = 'Container Priority'
            LEFT JOIN validValues vv
                ON vv.value = cp1.value
                AND vv.setName = 'priority'
            WHERE pr.poolRunId = ?
                AND q.step = ?
        '''
        stmt = self.switchboard.connection.prepareStatement(query)
        stmt.setString(1, self.current_parent)
        stmt.setString(2, self.poolRunId)
        stmt.setString(3, self.switchboard.stepName)
        rs = stmt.executeQuery()

        if rs.next():
            sample_details = {
                    'orderPriority': rs.getString('orderPriority'),
                    'queuedBy': rs.getString('queuedBy')
            }
            return sample_details
        else:
            return {}

    ## GETTERS
    def getPoolRunId(self):
        return self.poolRunId

    def getCurrentContainer(self):
        return self.curCon

    def getCurrentParent(self):
        return self.curPar

    def getCurrentPosition(self):
        return self.curPos

    def getCurStatus(self):
        return self.status


    ## Setters
    def setCurrentContainer(self, newCurCon):
        self.curCon = newCurCon

    def setCurrentParent(self, newCurPar):
        self.curPar = newCurPar

    def setCurrentPosition(self, newCurPos):
        self.curPos = newCurPos

    def setCurStatus(self, newStatus):
        self.status = newStatus



