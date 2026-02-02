'''
  # EndRun class
  #
'''
from java.sql import SQLException
from poolRun import PoolRun
from com.uniconnect.uniflow.exception import SystemException

## CLASS
class EndPoolRun:

  '''
    # Class variable used for logging the error location
  '''
  errorLocation = ''

  '''
    # Init function
    #
  '''
  def __init__(self, switchboard, poolRunId):
    self.switchboard = switchboard
    self.poolRunId = poolRunId
    self.runObj = PoolRun(self.switchboard, poolRunId)

  ## GETTERS
  def getPoolRunId(self):
    return self.poolRunId

  def getRunObj(self):
    return self.runObj

  '''
    # Ends the run and calls cascading function for ending the specMethod
    #
    # @param<string> result
    # @param<long>   eventId
    #
    # @return<bool>
  '''
  def endPoolRun(self, result, eventId):
    errorLocation = 'endPoolRun'
    poolRunId = self.getPoolRunId()
    self.switchboard.log('<<<<<< ENDING POOL RUN: ' + poolRunId + ' >>>>>>')
    try:
      errorLocation = 'endPoolRun - update query'
      endQuery = '''
        UPDATE poolRuns
          SET
            completedResult = ?,
            completedEventId = ?,
            lastUpdatedEventId = ?
        WHERE poolRunId = ?
      '''

      endQueryStmt = self.switchboard.connection.prepareStatement(endQuery)
      endQueryStmt.setString(1, result)
      endQueryStmt.setLong(2, eventId)
      endQueryStmt.setLong(3, eventId)
      endQueryStmt.setString(4, poolRunId)
      errorLocation = '<<<<< endPoolRun execute update >>>>>'
      endQueryStmt.executeUpdate()
      endQueryStmt.close()

      return True
      self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'true')
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


