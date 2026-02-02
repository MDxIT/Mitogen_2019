import com.uniconnect.uniflow as uniflow
from com.uniconnect.uniflow.exception import SystemException
from java.sql import SQLException
from run import Run
from general_functions import *

## CLASS
class CreateRun(Run):
  def __init__(self, switchboard, runId,
               specimenMethodsId, runType,
               currentContainerId, currentParentId,
               currentParentPosition, parentWorkflowSpecimenRunId,
               eventId, lastUpdatedEventId):

    ## INHERITANCE
    Run.__init__(self, switchboard, runId)

    self.curCon = currentContainerId
    self.curPar = currentParentId
    self.curPos = currentParentPosition
    self.methId = specimenMethodsId

    self.runType = runType
    self.parSpec = parentWorkflowSpecimenRunId
    self.lEventId = lastUpdatedEventId
    self._eventId = eventId


  ## GETTERS
  def getEventId(self):
    return self._eventId

  def getRunType(self):
    return self.runType

  def getParentWorkflowSpecimenRunId(self):
    return self.parSpec

  def getLastUpdatedEventId(self):
    return self.lEventId


  ## Setters
  def setRunId(self, newRunId):
    self.runId = newRunId

  def setEventId(self, newEventId):
    self._eventId = newEventId

  def setRunType(self, newRunType):
    self.runType = newRunType

  def setParentWorkflowSpecimenRunId(self, newParentSpecRunId):
    self.parSpec = newParentSpecRunId

  def setLastUpdatedEventId(self, newLastEventId):
    self.lEventId = newLastEventId


  # other definitions
  def saveCreateRun(self):
    try:
      errorLocation = '<<<<< BEGIN: saveCreateRun >>>>>'
      self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'true')
      
      errorLocation = '<<<<< saveCreateRun get runId >>>>>'
      runId = self.getRunId()

      errorLocation = '<<<<< saveCreateRun get specMethId>>>>>'
      specMethId = self.getMethodId()

      errorLocation = '<<<<< saveCreateRun get runType>>>>>'
      runType = self.getRunType()

      errorLocation = '<<<<< saveCreateRun get processContainerId >>>>>'
      processContainerId = self.getCurrentContainer()

      errorLocation = '<<<<<  saveCreateRun get currentParentId >>>>>'
      currentParentId = self.getCurrentParent()

      errorLocation = '<<<<<  saveCreateRun get currentParentPosition >>>>>'
      currentParentPosition = self.getCurrentPosition()

      errorLocation = '<<<<<  saveCreateRun get parentId >>>>>'
      parentId = self.getParentWorkflowSpecimenRunId()


      errorLocation = '<<<<<  saveCreateRun eventIds >>>>>'
      eventId = self.getEventId()
      lEventId = self.getLastUpdatedEventId()

      print 'saveCreateRun: Get values - runType is ' + runType + '- parentId is ' + parentId

      ## insertContainer also assigns containerHistory and self content record
      errorLocation = '<<<<< begin saveCreateRun: insertContainer query >>>>>'
      insertContainer(self.switchboard, runId, 'runId', eventId, True, True)

      errorLocation = '<<<<< begin saveCreateRun: insertContent query >>>>>'
      insertContent(self.switchboard, processContainerId, 'run', 'runId', runId, eventId)

      errorLocation = '<<<<< begin saveCreateRun: insertSpecimenRuns query >>>>>'
      insertSpecimenRuns(self.switchboard, runId, specMethId, runType, processContainerId, currentParentId, currentParentPosition, parentId, eventId, lEventId)

      if(runType == 'workflow'):

        ### update specimenMethods set runCount to runcount +1, set status to "In Process" and set status eventId to current eventId
        errorLocation = '<<<<< begin saveCreateRun: updateSpecimenMethodCreateRun query >>>>>'
        updateSpecimenMethodCreateRun(self.switchboard, specMethId, eventId)


        ### UPDATE SPCIEMEN STATUS
        ### Get specimenId for the process container
        errorLocation = '<<<<< begin saveCreateRun: getSpecimenId query >>>>>'
        specimenId = getSpecimenId(self.switchboard, processContainerId)
        errorLocation = '<<<<< begin saveCreateRun: checkUpdateStatus query >>>>>'
        inLabStatus = hasInLabStatus(self.switchboard, specimenId)

        ### if specimenId does not have a status of "In Lab" set the status to "In Lab" and set status eventId to current eventId
        if inLabStatus:
          errorLocation = '<<<<< begin saveCreateRun: checkUpdateStatus query ' + str(inLabStatus) + ' >>>>>'
          updateReqSpecCreateRun(self.switchboard, specimenId, eventId)

      print '<<<< NEW RUN FOR ' + processContainerId + ' CREATED: ' + runId
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

def getRunType(switchboard, originalRun):
  try:
    errorLocation = '<<<<< BEGIN: getRunType >>>>>'

    getRunTypeQuery = '''
      SELECT runType AS "runType"
      FROM specimenRuns
      WHERE runId = ?
    '''

    getRunTypeQueryStmt = switchboard.connection.prepareStatement(getRunTypeQuery)
    getRunTypeQueryStmt.setString(1, originalRun)

    errorLocation = '<<<<< getRunType: Set Select Values >>>>>'

    runTypeRs = getRunTypeQueryStmt.executeQuery()

    errorLocation = '<<<<< getRunType: run query >>>>>'
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



def getProcessRunWorkflowParentRunId(switchboard, originalRun):
  try:
    errorLocation = '<<<<< BEGIN: getProcessRunWorkflowParentRunId >>>>>'

    getParentIdQuery = '''
      SELECT id AS "parentId"
      FROM specimenRuns
      WHERE runId = ?
    '''

    getParentIdQueryStmt = switchboard.connection.prepareStatement(getParentIdQuery)
    getParentIdQueryStmt.setString(1, originalRun)

    errorLocation = '<<<<< getProcessRunWorkflowParentRunId: Set Select Values >>>>>'

    parentIdRs = getParentIdQueryStmt.executeQuery()

    errorLocation = '<<<<< getProcessRunWorkflowParentRunId: run query >>>>>'
    while parentIdRs.next():
      parentId = parentIdRs.getString('parentId')

    parentIdRs.close()
    getParentIdQueryStmt.close()

    switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'true')
    return parentId
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


def getSpecimenId(switchboard, processContainerId):
  try:
    errorLocation = '<<<<< BEGIN: getSpecimenId >>>>>'

    getSpecimenIdQuery = '''
      SELECT content AS "specimenId"
      FROM contents
      WHERE containerId = ?
      AND contentType = 'specimenId'
    '''

    getSpecimenIdQueryStmt = switchboard.connection.prepareStatement(getSpecimenIdQuery)
    getSpecimenIdQueryStmt.setString(1, processContainerId)
    specimenIdRs = getSpecimenIdQueryStmt.executeQuery()

    errorLocation = '<<<<< getSpecimenId: loop through query results >>>>>'
    while specimenIdRs.next():
      specimenId = specimenIdRs.getString('specimenId')

    specimenIdRs.close()
    getSpecimenIdQueryStmt.close()

    switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'true')
    return specimenId
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



def getOrderId(switchboard, queueItem):
  try:
    errorLocation = '<<<<< BEGIN: getOrderId >>>>>'
    getOrderIdQuery = '''
      SELECT DISTINCT c1.content AS "orderId"
      FROM contents c
      INNER JOIN contents c1 ON c.containerId = c1.containerId
      WHERE c.content  = ?
      AND c1.contentType = 'requestId'
    '''

    getOrderIdQueryStmt = switchboard.connection.prepareStatement(getOrderIdQuery)
    getOrderIdQueryStmt.setString(1, queueItem)

    errorLocation = '<<<<< getOrderId: Set Select Values >>>>>'
    orderIdRs = getOrderIdQueryStmt.executeQuery()

    errorLocation = '<<<<< getOrderId: run query >>>>>'
    while orderIdRs.next():
      orderId = orderIdRs.getString('orderId')

    orderIdRs.close()
    getOrderIdQueryStmt.close()

    switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'true')
    return orderId
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


def getOrderRunIds(switchboard, orderContainerId):
  try:
    errorLocation = '<<<<< BEGIN: getOrderRunIds >>>>>'
    getRunIdsQuery = '''
      SELECT DISTINCT c1.content AS "runId"
      FROM contents c
      INNER JOIN contents c1 ON c.containerId = c1.containerId
      WHERE c.content  = ?
      AND c1.contentType = 'runId'
    '''

    getRunsQueryStmt = switchboard.connection.prepareStatement(getRunIdsQuery)
    getRunsQueryStmt.setString(1, orderContainerId)

    errorLocation = '<<<<< getOrderRunIds: Set Select Values >>>>>'
    runIdRs = getRunsQueryStmt.executeQuery()
    orderRunIdList = []

    errorLocation = '<<<<< getOrderRunIds: run query >>>>>'
    while runIdRs.next():
      runId = runIdRs.getString('runId')
      orderRunIdList.append(runId)

    runIdRs.close()
    getRunsQueryStmt.close()

    switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'true')
    return orderRunIdList
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



def hasInLabStatus(switchboard, specimenId):
  try:
    errorLocation = '<<<<< BEGIN: hasInLabStatus >>>>>'
    statQuery = '''
      SELECT 1 AS "inLabStatus"
      FROM requestSpecimens
      WHERE specimenId = ?
      AND status = 'In Lab'
      Limit 1
    '''

    statQueryStmt = switchboard.connection.prepareStatement(statQuery)
    statQueryStmt.setString(1, specimenId)

    errorLocation = '<<<<< hasInLabStatus: Set Select Values >>>>>'
    statusRs = statQueryStmt.executeQuery()

    errorLocation = '<<<<< hasInLabStatus: run query >>>>>'
    while statusRs.next():
      inLabStatus = statusRs.getString('inLabStatus')
      # if inlab status is true than set to false so the update doesn't occur
      if inLabStatus == 1:
        return False

    statusRs.close()
    statQueryStmt.close()

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



def insertSpecimenRuns(switchboard, runId, specimenMethodsId, runType, currentContainerId, currentParentId, currentParentPosition, parentWorkflowSpecimenRunId, eventId, lastUpdatedEventId):
  try:
    errorLocation = '<<<<< BEGIN: insertSpecimenRuns >>>>>'
    insertSpecimenRuns = '''
      INSERT INTO specimenRuns (runId, specimenMethodsId, runType, currentContainerId, currentParentId, currentParentPosition, parentWorkflowSpecimenRunId, eventId, lastUpdatedEventId)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    '''

    insertSpecimenRunsQueryStmt = switchboard.connection.prepareStatement(insertSpecimenRuns)
    insertSpecimenRunsQueryStmt.setString(1, runId)
    insertSpecimenRunsQueryStmt.setString(2, specimenMethodsId)
    insertSpecimenRunsQueryStmt.setString(3, runType)
    insertSpecimenRunsQueryStmt.setString(4, currentContainerId)
    insertSpecimenRunsQueryStmt.setString(5, currentParentId)
    insertSpecimenRunsQueryStmt.setString(6, currentParentPosition)
    insertSpecimenRunsQueryStmt.setString(7, parentWorkflowSpecimenRunId)
    insertSpecimenRunsQueryStmt.setLong(8, eventId)
    insertSpecimenRunsQueryStmt.setLong(9, lastUpdatedEventId)
    print insertSpecimenRunsQueryStmt
    errorLocation = '<<<<< insertSpecimenRuns execute update >>>>>'
    insertSpecimenRunsQueryStmt.executeUpdate()
    insertSpecimenRunsQueryStmt.close()

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


def updateSpecimenMethodCreateRun(switchboard, specMethId, eventId):
  errorLocation = '<<<<< BEGIN: updateSpecimenMethodCreateRun >>>>>'
  try:
    upSpMethQuery = '''
      UPDATE specimenMethods
        SET
          runCount = runCount + 1,
          status = 'In Process',
          statusEventId = ?
      WHERE id = ?
    '''

    upSpMethQueryStmt = switchboard.connection.prepareStatement(upSpMethQuery)
    upSpMethQueryStmt.setLong(1, eventId)
    upSpMethQueryStmt.setString(2, specMethId)
    errorLocation = '<<<<< updateSpecimenMethodCreateRun execute update >>>>>'
    upSpMethQueryStmt.executeUpdate()
    upSpMethQueryStmt.close()

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


def updateReqSpecCreateRun(switchboard, reqSpecId, eventId):
  errorLocation = '<<<<< BEGIN: updateReqSpecCreateRun >>>>>'
  try:
    upReqSpecQuery = '''
      UPDATE requestSpecimens
        SET status = 'In Lab',
          statusEventId = ?
      WHERE specimenId = ?
    '''

    upReqSpecQueryStmt = switchboard.connection.prepareStatement(upReqSpecQuery)
    upReqSpecQueryStmt.setLong(1, eventId)
    upReqSpecQueryStmt.setString(2, reqSpecId)
    errorLocation = '<<<<< updateReqSpecCreateRun execute update >>>>>'
    print upReqSpecQueryStmt
    upReqSpecQueryStmt.executeUpdate()
    upReqSpecQueryStmt.close()

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





