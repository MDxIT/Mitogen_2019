import com.uniconnect.uniflow as uniflow
import csv
from java.sql import SQLException
from csv_functions import *
from endRun import EndRun

class GroupingContainer(object):
    
    def __init__(self, switchboard, contId):
        self.switchboard = switchboard
        self._container_id = contId
        self._run_ids = []
        self._control_runs = []
        self.setRunIds()
        self.setControlRunIds()

    @property 
    def container_id(self):
        return self._container_id

    @property
    def run_ids(self):
        return self._run_ids

    @property
    def control_runs(self):
        return self._control_runs

    def getRunIds(self):
        return self._run_ids

    def getControlRunIds(self):
        return self._control_runs

    def setRunIds(self):
        containerId = self.container_id
        runIdArr = []
        try:
            gcQuery = '''
                SELECT runId
                FROM specimenRuns
                WHERE currentParentId = ?
                    AND (completedResult <> 'rework' OR completedResult IS NULL)
              ''' 
            
            gcQueryStmt = self.switchboard.connection.prepareStatement(gcQuery)
            gcQueryStmt.setString(1, containerId)


            gcRs = gcQueryStmt.executeQuery()

            while gcRs.next():
                gcRunId = gcRs.getString(1)
                runIdArr.append(gcRunId)
            
            self._run_ids = runIdArr
            gcQueryStmt.close()

            self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'true')

        except SQLException as e:
            self.switchboard.log("---*** SQLException ***----")
            self.switchboard.log("ERROR MESSAGE: " + str(e.message))
            self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')
            raise
            return
        except BaseException as e:
            self.switchboard.log("---*** PYTHON EXCEPTION ***---")
            self.switchboard.log("ERROR MESSAGE: " + str(e.message))
            self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')
            raise
            return
    
    def setControlRunIds(self):
        containerId = self.container_id
        conRunIdArr = []
        try:
            crQuery = '''
                SELECT controlRunId
                FROM controlRuns
                WHERE currentParentId = ?
            '''

            crStmt = self.switchboard.connection.prepareStatement(crQuery)
            crStmt.setString(1, containerId)
            crRs = crStmt.executeQuery()

            while crRs.next():
                crRunId = crRs.getString(1)
                conRunIdArr.append(crRunId)
            
            self._control_runs = conRunIdArr 
            crStmt.close()

            self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'true')
            return True

        except SQLException as e:
            self.switchboard.log("---*** SQLException ***----")
            self.switchboard.log("ERROR MESSAGE: " + str(e.message))
            self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')
            raise
            return
        except BaseException as e:
            self.switchboard.log("---*** PYTHON EXCEPTION ***---")
            self.switchboard.log("ERROR MESSAGE: " + str(e.message))
            self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')
            raise
            return
    

    def endRuns(self, result, eventId):
        try:
            for run in self.run_ids:
                er = EndRun(self.switchboard, run)
                er.endRun(result, eventId)
            self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'true')
            return True

        except BaseException as e:
            self.switchboard.log("---*** PYTHON EXCEPTION ***---")
            self.switchboard.log("ERROR MESSAGE: " + str(e.message))
            self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')
            raise
            return
       
    def endAnalysisRuns(self, eventId):
        try:
            for run in self.run_ids:
                er = EndRun(self.switchboard, run)
                er.endAnalysisRun(eventId)

            self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'true')
            return True

        except SQLException as e:
          self.switchboard.log("---*** SQLException ***----")
          self.switchboard.log("ERROR MESSAGE: " + str(e.message))
          self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')
          raise
          return
        except BaseException as e:
          self.switchboard.log("---*** PYTHON EXCEPTION ***---")
          self.switchboard.log("ERROR MESSAGE: " + str(e.message))
          self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')
          raise
          return
