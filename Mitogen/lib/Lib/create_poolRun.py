import com.uniconnect.uniflow as uniflow
from com.uniconnect.uniflow.exception import SystemException
from java.sql import SQLException
from poolRun import PoolRun
from general_functions import *

## CLASS
class CreatePoolRun(PoolRun):
  def __init__(self, switchboard, poolRunId, runType,
               currentContainerId, currentParentId,
               currentParentPosition, parentWorkflowPoolRunId,
               currentParentRun,
               eventId, lastUpdatedEventId):

    ## INHERITANCE
    PoolRun.__init__(self, switchboard, poolRunId)

    self.curCon = currentContainerId
    self.curPar = currentParentId
    self.curPos = currentParentPosition

    self.runType = runType
    self.parPool = parentWorkflowPoolRunId
    self.parPoolRun = currentParentRun
    self.lEventId = lastUpdatedEventId
    self._eventId = eventId


  ## GETTERS
  def getEventId(self):
    return self._eventId

  def getRunType(self):
    return self.runType

  def getParentWorkflowPoolRunId(self):
    return self.parPool

  def getCurrentParentRun(self):
    return self.parPoolRun

  def getLastUpdatedEventId(self):
    return self.lEventId


  ## Setters
  def setPoolRunId(self, newPoolRunId):
    self.poolRunId = newPoolRunId

  def setEventId(self, newEventId):
    self._eventId = newEventId

  def setRunType(self, newRunType):
    self.runType = newRunType

  def setParentWorkflowPoolRunId(self, newParentPoolRunId):
    self.parPool = newParentPoolRunId

  def setParentPoolRunId(self, newParentPoolRun):
    self.parPoolRun = newParentPoolRun

  def setLastUpdatedEventId(self, newLastEventId):
    self.lEventId = newLastEventId


  # other definitions
  def saveCreatePoolRun(self):
    try:
      errorLocation = '<<<<< BEGIN: saveCreatePoolRun >>>>>'
      self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'true')

      errorLocation = '<<<<< BEGIN: saveCreatePoolRun get poolRunId >>>>>'
      poolRunId = self.getPoolRunId()

      errorLocation = '<<<<< BEGIN: saveCreatePoolRun get runType>>>>>'
      runType = self.getRunType()

      errorLocation = '<<<<< BEGIN: saveCreatePoolRun get processContainerId >>>>>'
      processContainerId = self.getCurrentContainer()

      errorLocation = '<<<<< BEGIN: saveCreatePoolRun get currentParentId >>>>>'
      currentParentId = self.getCurrentParent()

      errorLocation = '<<<<< BEGIN: saveCreatePoolRun get currentParentPosition >>>>>'
      currentParentPosition = self.getCurrentPosition()

      errorLocation = '<<<<< BEGIN: saveCreatePoolRun get parentId >>>>>'
      parentId = self.getParentWorkflowPoolRunId()

      currentParentPoolRun = self.getCurrentParentRun();

      errorLocation = '<<<<< BEGIN: saveCreatePoolRun >>>>>'
      eventId = self.getEventId()
      lEventId = self.getLastUpdatedEventId()

      print 'saveCreatePoolRun function - runType in create run is ' + runType
      print 'saveCreatePoolRun function - parentId in create run is ' + parentId

      errorLocation = '<<<<< begin saveCreatePoolRun: insertContainer query >>>>>'
      ## insertContainer also assigns containerHistory and self content record
      insertContainer(self.switchboard, poolRunId, 'poolRunId', eventId, True, True)


      errorLocation = '<<<<< begin saveCreatePoolRun: insertContent query >>>>>'
      insertContent(self.switchboard, processContainerId, 'run', 'poolRunId', poolRunId, eventId)

      errorLocation = '<<<<< begin saveCreatePoolRun: insertSpecimenRuns query >>>>>'
      insertPoolRuns(self.switchboard, poolRunId, runType, processContainerId, currentParentId, currentParentPosition, parentId, eventId, lEventId)

      errorLocation = '<<<<< begin saveCreatePoolRun: insertPrevChildContent query >>>>>'
      insertPrevChildContent(self.switchboard, poolRunId, 'run', eventId, currentParentPoolRun)

      print '<<<< NEW RUN FOR ' + processContainerId + ' CREATED: ' + poolRunId
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


### Other general create run definitions

def getPoolRunType(switchboard, originalRun):
  try:
    errorLocation = '<<<<< BEGIN: getPoolRunType >>>>>'

    getRunTypeQuery = '''
      SELECT runType AS "runType"
      FROM poolRuns
      WHERE poolRunId = ?
    '''

    getRunTypeQueryStmt = switchboard.connection.prepareStatement(getRunTypeQuery)
    getRunTypeQueryStmt.setString(1, originalRun)

    errorLocation = '<<<<< getPoolRunType: Set Select Values >>>>>'

    runTypeRs = getRunTypeQueryStmt.executeQuery()

    errorLocation = '<<<<< getPoolRunType: run query >>>>>'
    while runTypeRs.next():
      origRunType = runTypeRs.getString('runType')

    runTypeRs.close()
    getRunTypeQueryStmt.close()

    switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'true')
    return origRunType
  except Exception as e:
    switchboard.log("---*** EXCEPTION ***---")
    switchboard.log("ERROR LOCATION: " + errorLocation)
    switchboard.log("ERROR MESSAGE: " + str(e.message))
    switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')
    raise
    return
  except StandardError as e:
    switchboard.log("---*** STANDRAD PYTHON ERROR ***---")
    switchboard.log("ERROR LOCATION: " + errorLocation)
    switchboard.log("ERROR MESSAGE: " + str(e.message))
    switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')
    raise
    return
  except SystemException as e:
    switchboard.log("---*** UNIFlow SystemException ***----")
    switchboard.log("ERROR LOCATION: " + errorLocation)
    switchboard.log("ERROR MESSAGE: " + str(e.message))
    switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')
    raise
    return
  except SQLException as e:
    switchboard.log("---*** SQLException ***----")
    switchboard.log("ERROR LOCATION: " + errorLocation)
    switchboard.log("ERROR MESSAGE: " + str(e.message))
    switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')
    raise
    return
  except BaseException as e:
    switchboard.log("---*** PYTHON EXCEPTION ***---")
    switchboard.log("ERROR LOCATION: " + errorLocation)
    switchboard.log("ERROR MESSAGE: " + str(e.message))
    switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')
    raise
    return
  except TypeError as e:
    switchboard.log("---*** TYPE ERROR ***----")
    switchboard.log("ERROR LOCATION: " + errorLocation)
    switchboard.log("ERROR MESSAGE: " + str(e.message))
    switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')
    raise
    return
  except:
    switchboard.log("---*** UNSPECIFIED ERROR ***---")
    switchboard.log("ERROR LOCATION: " + errorLocation)
    switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')
    raise
    return



def getProcessPoolRunWorkflowParentRunId(switchboard, originalRun):
  try:
    errorLocation = '<<<<< BEGIN: getProcessPoolRunWorkflowParentRunId >>>>>'

    getParentIdQuery = '''
      SELECT id AS "poolParentId"
      FROM poolRuns
      WHERE poolRunId = ?
    '''
    getParentIdQueryStmt = switchboard.connection.prepareStatement(getParentIdQuery)
    getParentIdQueryStmt.setString(1, originalRun)

    print getParentIdQuery
    errorLocation = '<<<<< getProcessPoolRunWorkflowParentRunId: Set Select Values >>>>>'

    parentIdRs = getParentIdQueryStmt.executeQuery()

    errorLocation = '<<<<< getProcessPoolRunWorkflowParentRunId: run query >>>>>'
    while parentIdRs.next():
      errorLocation = '<<<<< getProcessPoolRunWorkflowParentRunId: while loop >>>>>'
      poolParentId = parentIdRs.getString('poolParentId')
      print poolParentId
      return poolParentId

    errorLocation = '<<<<< getProcessPoolRunWorkflowParentRunId: close >>>>>'
    parentIdRs.close()
    getParentIdQueryStmt.close()


    switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'true')
    return True
  except Exception as e:
    switchboard.log("---*** EXCEPTION ***---")
    switchboard.log("ERROR LOCATION: " + errorLocation)
    switchboard.log("ERROR MESSAGE: " + str(e.message))
    switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')
    raise
    return
  except StandardError as e:
    switchboard.log("---*** STANDRAD PYTHON ERROR ***---")
    switchboard.log("ERROR LOCATION: " + errorLocation)
    switchboard.log("ERROR MESSAGE: " + str(e.message))
    switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')
    raise
    return
  except SystemException as e:
    switchboard.log("---*** UNIFlow SystemException ***----")
    switchboard.log("ERROR LOCATION: " + errorLocation)
    switchboard.log("ERROR MESSAGE: " + str(e.message))
    switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')
    raise
    return
  except SQLException as e:
    switchboard.log("---*** SQLException ***----")
    switchboard.log("ERROR LOCATION: " + errorLocation)
    switchboard.log("ERROR MESSAGE: " + str(e.message))
    switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')
    raise
    return
  except BaseException as e:
    switchboard.log("---*** PYTHON EXCEPTION ***---")
    switchboard.log("ERROR LOCATION: " + errorLocation)
    switchboard.log("ERROR MESSAGE: " + str(e.message))
    switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')
    raise
    return
  except TypeError as e:
    switchboard.log("---*** TYPE ERROR ***----")
    switchboard.log("ERROR LOCATION: " + errorLocation)
    switchboard.log("ERROR MESSAGE: " + str(e.message))
    switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')
    raise
    return
  except:
    switchboard.log("---*** UNSPECIFIED ERROR ***---")
    switchboard.log("ERROR LOCATION: " + errorLocation)
    switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')
    raise
    return


def insertPoolRuns(switchboard, poolRunId, runType, currentContainerId, currentParentId, currentParentPosition, parentWorkflowPoolRunId, eventId, lastUpdatedEventId):
  try:
    errorLocation = '<<<<< BEGIN: insertPoolRuns >>>>>'

    insertPoolRuns = '''
      INSERT INTO poolRuns (poolRunId, runType, currentContainerId, currentParentId, currentParentPosition, parentWorkflowPoolRunId, eventId, lastUpdatedEventId)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    '''

    insertPoolRunsQueryStmt = switchboard.connection.prepareStatement(insertPoolRuns)
    insertPoolRunsQueryStmt.setString(1, poolRunId)
    insertPoolRunsQueryStmt.setString(2, runType)
    insertPoolRunsQueryStmt.setString(3, currentContainerId)
    insertPoolRunsQueryStmt.setString(4, currentParentId)
    insertPoolRunsQueryStmt.setString(5, currentParentPosition)
    insertPoolRunsQueryStmt.setString(6, parentWorkflowPoolRunId)
    insertPoolRunsQueryStmt.setLong(7, eventId)
    insertPoolRunsQueryStmt.setLong(8, lastUpdatedEventId)

    print 'insertPoolRuns insertPoolRunsQueryStmt ' + str(insertPoolRunsQueryStmt)
    insertPoolRunsQueryStmt.executeUpdate()
    insertPoolRunsQueryStmt.close()

    switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'true')
    return True
  except Exception as e:
    switchboard.log("---*** EXCEPTION ***---")
    switchboard.log("ERROR LOCATION: " + errorLocation)
    switchboard.log("ERROR MESSAGE: " + str(e.message))
    switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')
    raise
    return
  except StandardError as e:
    switchboard.log("---*** STANDRAD PYTHON ERROR ***---")
    switchboard.log("ERROR LOCATION: " + errorLocation)
    switchboard.log("ERROR MESSAGE: " + str(e.message))
    switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')
    raise
    return
  except SystemException as e:
    switchboard.log("---*** UNIFlow SystemException ***----")
    switchboard.log("ERROR LOCATION: " + errorLocation)
    switchboard.log("ERROR MESSAGE: " + str(e.message))
    switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')
    raise
    return
  except SQLException as e:
    switchboard.log("---*** SQLException ***----")
    switchboard.log("ERROR LOCATION: " + errorLocation)
    switchboard.log("ERROR MESSAGE: " + str(e.message))
    switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')
    raise
    return
  except BaseException as e:
    switchboard.log("---*** PYTHON EXCEPTION ***---")
    switchboard.log("ERROR LOCATION: " + errorLocation)
    switchboard.log("ERROR MESSAGE: " + str(e.message))
    switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')
    raise
    return
  except TypeError as e:
    switchboard.log("---*** TYPE ERROR ***----")
    switchboard.log("ERROR LOCATION: " + errorLocation)
    switchboard.log("ERROR MESSAGE: " + str(e.message))
    switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')
    raise
    return
  except:
    switchboard.log("---*** UNSPECIFIED ERROR ***---")
    switchboard.log("ERROR LOCATION: " + errorLocation)
    switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')
    raise
    return




