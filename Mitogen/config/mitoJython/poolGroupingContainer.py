'''
  #
  # Grouping container class
  #   Implements csv_functions to write configured results to file
  #
'''

import com.uniconnect.uniflow as uniflow
import csv
from java.sql import SQLException
from csv_functions import *
from endPoolRun import EndPoolRun

class PoolGroupingContainer:

  '''
    # Class variable used for logging the error location
  '''
  errorLocation = ''

  '''
    # Init function
  '''
  def __init__(self, switchboard, poolRunId, parentPoolContentId):
    self.switchboard = switchboard
    self.poolRunId = poolRunId
    self.parentPoolContentId = parentPoolContentId
    self.poolRunIds = []
    self.setPoolRunIds()

  ## Getters
  def getPoolRunId(self):
    return self.poolRunId

  ## Getters
  def getPoolContentId(self):
    return self.parentPoolContentId

  def getPoolRunIds(self):
    return self.poolRunIds

  '''
    # Sets PoolGroupingContainer object poolRunIds based on container id
    #
  '''
  def setPoolRunIds(self):
    containerId = self.getPoolContentId()
    runIdArr = []
    try:
      errorLocation = 'setPoolRunIds - creating gcQuery'
      gcQuery = '''
        SELECT poolRunId
        FROM poolRuns
        WHERE currentParentId = ?
          AND (completedResult <> 'rework' OR completedResult IS NULL)
      '''

      errorLocation = 'setPoolRunIds - prepare query'
      gcQueryStmt = self.switchboard.connection.prepareStatement(gcQuery)
      gcQueryStmt.setString(1, containerId)
      print gcQueryStmt
      errorLocation = '<<<<< setPoolRunIds - execute query>>>>>'
      gcRs = gcQueryStmt.executeQuery()

      errorLocation = 'setRunIds - loop through res rows'
      while gcRs.next():
        gcRunId = gcRs.getString(1)

        runIdArr.append(gcRunId)
      self.poolRunIds = runIdArr
      gcRs.close()
      gcQueryStmt.close()

      self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'true')
      return True

    except Exception as e:
      self.switchboard.log("---*** EXCEPTION ***---")
      self.switchboard.log("ERROR LOCATION: " + errorLocation)
      self.switchboard.log("ERROR MESSAGE: " + str(e.message))
      self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')
      raise
      return
    except StandardError as e:
      self.switchboard.log("---*** STANDRAD PYTHON ERROR ***---")
      self.switchboard.log("ERROR LOCATION: " + errorLocation)
      self.switchboard.log("ERROR MESSAGE: " + str(e.message))
      self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')
      raise
      return
    except SystemException as e:
      self.switchboard.log("---*** UNIFlow SystemException ***----")
      self.switchboard.log("ERROR LOCATION: " + errorLocation)
      self.switchboard.log("ERROR MESSAGE: " + str(e.message))
      self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')
      raise
      return
    except SQLException as e:
      self.switchboard.log("---*** SQLException ***----")
      self.switchboard.log("ERROR LOCATION: " + errorLocation)
      self.switchboard.log("ERROR MESSAGE: " + str(e.message))
      self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')
      raise
      return
    except BaseException as e:
      self.switchboard.log("---*** PYTHON EXCEPTION ***---")
      self.switchboard.log("ERROR LOCATION: " + errorLocation)
      self.switchboard.log("ERROR MESSAGE: " + str(e.message))
      self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')
      raise
      return
    except TypeError as e:
      self.switchboard.log("---*** TYPE ERROR ***----")
      self.switchboard.log("ERROR LOCATION: " + errorLocation)
      self.switchboard.log("ERROR MESSAGE: " + str(e.message))
      self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')
      raise
      return
    except:
      self.switchboard.log("---*** UNSPECIFIED ERROR ***---")
      self.switchboard.log("ERROR LOCATION: " + errorLocation)
      self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')
      raise
      return

  '''
    # Ends all runs in the grouping container with passed result
    #
    # @param<string> result
    # @param<long>   eventId
    #
    # @return<bool>
    #
  '''
  def endPoolRuns(self, result, eventId):
    errorLocation = '<<<<< BEGIN: endPoolRuns >>>>>'
    PoolRuns = self.getPoolRunIds()
    try:
      for run in PoolRuns:
        errorLocation = '<<<<< CREATE: EndRun >>>>>'
        er = EndPoolRun(self.switchboard, run)
        errorLocation = '<<<<< CALL: endPoolRun IN endPoolRuns >>>>>'
        er.endPoolRun(result, eventId)
      self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'true')
      return True

    except Exception as e:
      self.switchboard.log("---*** EXCEPTION ***---")
      self.switchboard.log("ERROR LOCATION: " + errorLocation)
      self.switchboard.log("ERROR MESSAGE: " + str(e.message))
      self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')
      raise
      return
    except StandardError as e:
      self.switchboard.log("---*** STANDRAD PYTHON ERROR ***---")
      self.switchboard.log("ERROR LOCATION: " + errorLocation)
      self.switchboard.log("ERROR MESSAGE: " + str(e.message))
      self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')
      raise
      return
    except SystemException as e:
      self.switchboard.log("---*** UNIFlow SystemException ***----")
      self.switchboard.log("ERROR LOCATION: " + errorLocation)
      self.switchboard.log("ERROR MESSAGE: " + str(e.message))
      self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')
      raise
      return
    except SQLException as e:
      self.switchboard.log("---*** SQLException ***----")
      self.switchboard.log("ERROR LOCATION: " + errorLocation)
      self.switchboard.log("ERROR MESSAGE: " + str(e.message))
      self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')
      raise
      return
    except BaseException as e:
      self.switchboard.log("---*** PYTHON EXCEPTION ***---")
      self.switchboard.log("ERROR LOCATION: " + errorLocation)
      self.switchboard.log("ERROR MESSAGE: " + str(e.message))
      self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')
      raise
      return
    except TypeError as e:
      self.switchboard.log("---*** TYPE ERROR ***----")
      self.switchboard.log("ERROR LOCATION: " + errorLocation)
      self.switchboard.log("ERROR MESSAGE: " + str(e.message))
      self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')
      raise
      return
    except:
      self.switchboard.log("---*** UNSPECIFIED ERROR ***---")
      self.switchboard.log("ERROR LOCATION: " + errorLocation)
      self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')
      raise
      return
