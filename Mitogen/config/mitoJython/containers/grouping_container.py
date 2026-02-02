import com.uniconnect.uniflow as uniflow
import csv
from java.sql import SQLException
from csv_functions import *
from endRun import EndRun
from string import ascii_uppercase

class GroupingContainer(object):
    
    def __init__(self, switchboard, contId):
        self.switchboard = switchboard
        self._container_id = contId
        self._container_type = ''
        self._run_ids = []
        self._control_runs = []
        self._wells = []
        self.setContainerType()
        self.setRunIds()
        self.setControlRunIds()
        self.setWells()

    @property 
    def container_id(self):
        return self._container_id

    @property 
    def container_type(self):
        return self._container_type

    @property
    def run_ids(self):
        return self._run_ids

    @property
    def control_runs(self):
        return self._control_runs

    @property
    def wells(self):
        return self._wells

    def getContainerType(self):
        return self._container_type

    def getRunIds(self):
        return self._run_ids

    def getControlRunIds(self):
        return self._control_runs

    def getWells(self):
        return self._wells

    def setContainerType(self):
        containerId = self.container_id
        ctype = ''     
        try:
            gcQuery = '''
                SELECT containerType
                FROM containers
                WHERE containerId = ?
              ''' 
            
            gcQueryStmt = self.switchboard.connection.prepareStatement(gcQuery)
            gcQueryStmt.setString(1, containerId)


            gcRs = gcQueryStmt.executeQuery()

            while gcRs.next():
                gcContainerType = gcRs.getString(1)
                ctype = (gcContainerType)
            
            self._container_type = ctype
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

    def setRunIds(self):
        containerId = self.container_id
        runIdArr = []       
        try:
            gcQuery = '''
                SELECT runId
                FROM specimenRuns
                WHERE currentParentId = ?
                    AND (completedResult <> 'rework' OR completedResult IS NULL)
                ORDER BY currentContainerId
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
                
    def setWells(self):

        containerId = self.container_id
        containerType = self.container_type
        trayType = ''
        wellArr = []
        rows = ''
        columns = ''

        try:

            if containerType == "trayId":
                crQuery = '''
                    SELECT 
                        cp1.value AS "trayType",
                        cp2.value AS "rows",
                        cp3.value AS "columns"
                    FROM containers c
                        INNER JOIN containerProperties cp1 ON c.containerId = cp1.containerId AND cp1.property = "trayType"
                        INNER JOIN containerProperties cp2 ON c.containerId = cp2.containerId AND cp2.property = "trayRowNumber"
                        INNER JOIN containerProperties cp3 ON c.containerId = cp3.containerId AND cp3.property = "trayColumnNumber"
                    WHERE c.containerId = ?
                '''

                crStmt = self.switchboard.connection.prepareStatement(crQuery)
                crStmt.setString(1, containerId)
                crRs = crStmt.executeQuery()

                while crRs.next():
                    trayType = crRs.getString('trayType')
                    rows = crRs.getString('rows')
                    columns = crRs.getString('columns')

                crStmt.close()


                #creating array of order and well
                if rows is not None and columns is not None:
                    well_total = int(rows) * int(columns)

                    if trayType == "Grid":
                        for x in range(well_total):
                            wellArr.append(str(x))
                    elif trayType == "Plate":
                        for x in range(int(rows)):
                            alphabet = ascii_uppercase
                            row = alphabet[x]
                            for y in range(int(columns)):
                                column = y + 1
                                column = ('%02d' % column)
                                well = row + str(column)
                                wellArr.append(well)

            
            self._wells = wellArr 


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
