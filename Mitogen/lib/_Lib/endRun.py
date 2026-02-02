'''
  # EndRun class
  #
'''
from java.sql import SQLException
from run import Run
from com.uniconnect.uniflow.exception import SystemException

## CLASS
class EndRun(Run):

  '''
    # Class variable used for logging the error location
  '''
  errorLocation = ''

  '''
    # Init function
    #
  '''
  def __init__(self, switchboard, runId):
    Run.__init__(self, switchboard, runId)

  ## GETTERS
  def getRunId(self):
    return self.runId

  def getEventId(self):
    return self.switchboard.eventId

  '''
    # Ends the run and calls cascading function for ending the specMethod
    #
    # @param<string> result
    # @param<long>   eventId
    #
    # @return<bool>
  '''
  def endRun(self, result, eventId):
    runId = self.getRunId()
    specMethId = int(self.getMethodId())
    self.switchboard.log('<<<<<< ENDING RUN: ' + runId + ' >>>>>>')
    try:
      endQuery = '''
        UPDATE specimenRuns
          SET
            completedResult = ?,
            completedEventId = ?,
            lastUpdatedEventId = ?
        WHERE runId = ?
      '''

      endQueryStmt = self.switchboard.connection.prepareStatement(endQuery)
      endQueryStmt.setString(1, result)
      endQueryStmt.setLong(2, eventId)
      endQueryStmt.setLong(3, eventId)
      endQueryStmt.setString(4, runId)
      endQueryStmt.executeUpdate()
      endQueryStmt.close()

      currentParentWorkflowRunState = self.getWorkflowRunState()

      if ifExists(currentParentWorkflowRunState) and isComplete(currentParentWorkflowRunState):
        self.switchboard.log('<<<<<< ENDING PARENT WORKFLOW RUN FOR RUN WITH ID: ' + self.wrkFlowRunId + ' >>>>>>')
        self.endParentWorkflowRun(result, eventId)

      currentMethodState = getMethState(self.switchboard, runId)

      if isComplete(currentMethodState):
        errorLocation = '<<<<<< CALL: updateSpecimenMethod IN endRun >>>>>>'
        updateSpecimenMethod(self.switchboard, specMethId, 'Complete', eventId)

        reportDetailsState = getRepDetailsState(self.switchboard, specMethId)

        if isComplete(reportDetailsState):
          errorLocation = '<<<<<< CALL: updateReportStatus IN endRun >>>>>>'
          updateReportStatus(self.switchboard, 'data ready', reportDetailsState[0], eventId)

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
    # Ends the run and calls cascading function for ending the specMethod
    #
    # @param<string> result
    # @param<long>   eventId
    #
    # @return<bool>
  '''
  def endAnalysisRun(self, eventId):
    result = self.getAnalysisRes()
    runId = self.getRunId()
    self.switchboard.log('<<<<< ENDING ANALYSIS RUN: ' + runId + ' ANALYSIS RESULT:' + result + ' >>>>>')
    self.endRun(result, eventId)

  '''
    # Ends the workflow parent run
    #
    # @param<string> result
    # @param<long>   eventId
    #
    # @return<bool>
  '''
  def endParentWorkflowRun(self, result, eventId):
    try:
      endQuery = '''
            UPDATE specimenRuns
              SET
                completedResult = ?,
                completedEventId = ?,
                lastUpdatedEventId = ?
            WHERE id = ?
          '''
      endQueryStmt = self.switchboard.connection.prepareStatement(endQuery)
      endQueryStmt.setString(1, result)
      endQueryStmt.setLong(2, eventId)
      endQueryStmt.setLong(3, eventId)
      endQueryStmt.setString(4, self.wrkFlowRunId)
      endQueryStmt.executeUpdate()
      endQueryStmt.close()

      self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'true')
      return True

    except SQLException:
      self.switchboard.log('---*** SQL EXCEPTION ENDING PARENT WORKFLOW ***---')
      self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')
    except:
      self.switchboard.log('---*** GENERAL EXCEPTION ENDING PARENT WORKFLOW ***---')
      self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')

  '''
    # Gets state of all runs that share associated parentWorkflowRunId
    #
    # @return<list> pWStatus
  '''
  def getWorkflowRunState(self):

    pWRunId = self.wrkFlowRunId

    pWStatus = []

    try:
      wQuery = '''
        SELECT 
          IFNULL(completedResult, 'In Process') AS completedResult
        FROM specimenRuns 
        WHERE parentWorkflowSpecimenRunId = ?
        AND 
          (SELECT 1 
           FROM specimenRuns 
           WHERE id = ?
           AND runType = 'workflow'
           AND completedResult IS NULL
           AND currentParentId IS NULL)
      ''' 
      wStmt = self.switchboard.connection.prepareStatement(wQuery)
      wStmt.setString(1, pWRunId)
      wStmt.setString(2, pWRunId)
      wRs = wStmt.executeQuery()
      while wRs.next():
        status = wRs.getString('completedResult')
        pWStatus.append(status)
      wRs.close()
      wStmt.close()

      self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'true')
      return pWStatus

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



##
### GET STATE FUNCTIONS
##

def getMethState(switchboard, runId):
  errorLocation = '<<<<< BEGIN: getMethState >>>>>'
  curState = []
  try:
    statusQuery = '''
      SELECT 
        IFNULL(sr1.completedResult, 'In Process') AS completedResult, 
        sr1.specimenMethodsId
      FROM specimenRuns sr
      INNER JOIN specimenRuns sr1 ON sr.specimenMethodsId = sr1.specimenMethodsId
      WHERE sr.runId = ?
    '''
    statusQueryStmt = switchboard.connection.prepareStatement(statusQuery)
    statusQueryStmt.setString(1, runId)
    statusRs = statusQueryStmt.executeQuery()

    while statusRs.next():
      thisStatus = statusRs.getString('completedResult')
      curState.append(thisStatus)
    statusRs.close()
    statusQueryStmt.close()

    switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'true')
    return curState

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



'''
  # Returns the state of all methods that share a common requestSpecimenId (item 0 of returned list) with the passed method id
  #
  # @param<object> switchboard
  # @param<int>    specMethId
  #
  # @return<list>  curState
  #
'''
def getReqSpecState(switchboard, specMethId):
  errorLocation = '<<<<< BEGIN: getReqSpecState >>>>>'
  curState = []
  specMethId = int(specMethId)
  try:
    statusQuery = '''
      SELECT IFNULL(sm1.status, 'In Process') AS 'status', sm1.requestSpecimensId
      FROM specimenMethods sm
      INNER JOIN specimenMethods sm1
        ON sm1.requestSpecimensId = sm.requestSpecimensId
      WHERE sm.id = ?
    '''
    statusQueryStmt = switchboard.connection.prepareStatement(statusQuery)
    statusQueryStmt.setInt(1, specMethId)
    statusRs = statusQueryStmt.executeQuery()
    while statusRs.next():
      thisStatus = statusRs.getString('status')
      thisReqSpec = statusRs.getInt('requestSpecimensId')
      curState.append(thisStatus)
    curState.insert(0, thisReqSpec)
    statusRs.close()
    statusQueryStmt.close()

    switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'true')
    return curState

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



'''
  # Returns the state of all the request specimens that share a common requestId (item 0 of returned list) with the passed requestSpecimenId
  #
  # @param<object> switchboard
  # @param<int>    reqSpecId
  #
  # @return<list>  curState
  #
'''
def getReqFormsState(switchboard, reqSpecId):
  errorLocation = '<<<<< BEGIN: getReqFormsState >>>>>'
  curState = []
  try:
    statusQuery = '''
      SELECT rs1.status, rs1.requestId
      FROM requestSpecimens rs
      INNER JOIN requestSpecimens rs1 ON rs.requestId = rs1.requestId
      WHERE rs.id = ?
    '''
    statusQueryStmt = switchboard.connection.prepareStatement(statusQuery)
    statusQueryStmt.setInt(1, reqSpecId)
    statusRs = statusQueryStmt.executeQuery()

    while statusRs.next():
      thisStatus = statusRs.getString('status')
      thisReqForm = statusRs.getString('requestId')
      curState.append(thisStatus)
    curState.insert(0, thisReqForm)
    statusRs.close()
    statusQueryStmt.close()

    switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'true')
    return curState

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



'''
  # Returns the state of all the report specimens that share a common reportId (item 0 of returned list) with the passed requestSpecimenId
  #
  # @param<object> switchboard
  # @param<int>    reqSpecId
  #
  # @return<list>  curState
  #
'''
def getRepDetailsState(switchboard, specMethId):
  errorLocation = '<<<<< BEGIN: getRepDetailsState >>>>>'
  curState = []
  try:

    thisReport = ''
    statusQuery = '''
      SELECT IFNULL(sm1.status, 'In Process') AS 'status', rd.reportId
      FROM specimenMethods sm 
      INNER JOIN specimenMethods sm1 
        ON sm.requestSpecimensId = sm1.requestSpecimensId
      INNER JOIN reportSpecimens rs 
        ON rs.requestSpecimensId = sm.requestSpecimensId
      INNER JOIN reportDetails rd 
        ON rd.id = rs.reportDetailsId
      WHERE sm.id = ?
    '''

    statusQueryStmt = switchboard.connection.prepareStatement(statusQuery)
    statusQueryStmt.setInt(1, specMethId)
    errorLocation = '<<<<< getRepDetailsState execute query >>>>>'
    statusRs = statusQueryStmt.executeQuery()

    while statusRs.next():
      thisStatus = statusRs.getString('status')
      thisReport = statusRs.getString('reportId')
      curState.append(thisStatus)

    curState.insert(0, thisReport)
    statusRs.close()
    statusQueryStmt.close()

    switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'true')
    return curState

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






'''
  # Returns true if the passed list does not contain a process state
  #
  # @param<list> curState
  #
  # @return<bool>
  #
'''
def isComplete(curState):

  if 'In Process' in curState:
    return False
  elif 'In Lab' in curState:
    return False
  else:
    return True

'''
  # Returns the current queues for reportId
  #
  # @param<object> switchboard
  # @param<int>    reportId
  #
  # @return<list>  curState
  #
'''
def getReportQueue(switchboard, reportId):
  errorLocation = '<<<<< BEGIN: getReportQueue >>>>>'
  curState = []
  try:
    statusQuery = '''
      SELECT step
      FROM queues
      WHERE containerid = ?
    '''
    statusQueryStmt = switchboard.connection.prepareStatement(statusQuery)
    statusQueryStmt.setString(1, reportId)
    statusRs = statusQueryStmt.executeQuery()
    while statusRs.next():
      reportStep = statusRs.getString('step')
      curState.append(reportStep)
    statusRs.close()
    statusQueryStmt.close()

    switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'true')
    return curState

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




##
### UPDATE STATUS FUNCTIONS
##

'''
  # Updated the specimen method status associated with the run
  #   **Used in endRun**
  #
  # @param<long> eventId
  #
'''
def updateSpecimenMethod(switchboard, specMethId, result, eventId):
  errorLocation = ''
  switchboard.log('<<<<<< ENDING SPECIMEN METHOD: ' + str(specMethId) + ' >>>>>>')
  try:
    upSpMethQuery = '''
      UPDATE specimenMethods
        SET
          status = ?,
          statusEventId = ?,
          eventId = ?
      WHERE id = ?
    '''
    upSpMethQueryStmt = switchboard.connection.prepareStatement(upSpMethQuery)
    upSpMethQueryStmt.setString(1, result)
    upSpMethQueryStmt.setLong(2, eventId)
    upSpMethQueryStmt.setLong(3, eventId)
    upSpMethQueryStmt.setInt(4, specMethId)
    upSpMethQueryStmt.executeUpdate()
    upSpMethQueryStmt.close()

    currentReqSpecState = getReqSpecState(switchboard, specMethId)

    if isComplete(currentReqSpecState):
      errorLocation = '<<<<<< CALL: updateReqSpec IN updateSpecimenMethod >>>>>>'
      updateReqSpec(switchboard, 'Complete', currentReqSpecState[0], eventId)

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



'''
  # Updates the status of the request specimen
  #   ** To be used if spec meth state is complete
  #
  # @param<int>  reqSpecId
  # @param<long> eventId
  #
'''
def updateReqSpec(switchboard, result, reqSpecId, eventId):
  errorLocation = '<<<<< BEGIN: updateReqSpec >>>>>'
  switchboard.log('<<<<<< ENDING REQUEST SPECIMEN: ' + str(reqSpecId) + ' >>>>>>')
  try:
    upReqSpecQuery = '''
      UPDATE requestSpecimens
        SET
          status = ?,
          statusEventId = ?,
          eventId = ?
      WHERE id = ?
    '''
    upReqSpecQueryStmt = switchboard.connection.prepareStatement(upReqSpecQuery)
    upReqSpecQueryStmt.setString(1, result)
    upReqSpecQueryStmt.setLong(2, eventId)
    upReqSpecQueryStmt.setLong(3, eventId)
    upReqSpecQueryStmt.setInt(4, reqSpecId)
    upReqSpecQueryStmt.executeUpdate()
    upReqSpecQueryStmt.close()

    errorLocation = '<<<<< updateReqSpec : get reqFormState >>>>>'
    reqFormState = getReqFormsState(switchboard, reqSpecId)
    errorLocation = '<<<<< updateReqSpec : get reportDetailsState >>>>>'


    if isComplete(reqFormState):
      errorLocation = '<<<<<< CALL: updateReqForms IN updateReqSpec >>>>>>'
      updateReqForms(switchboard, 'Complete', reqFormState[0], eventId)

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



def updateReqForms(switchboard, result, requestId, eventId):
  errorLocation = '<<<<< BEGIN: updateReqForms>>>>>'
  switchboard.log('<<<<<< ENDING REQUEST FORM: ' + requestId + ' >>>>>>')
  try:
    upReqFormQuery = '''
      UPDATE requestForms
        SET
          status = ?,
          statusEventId = ?
      WHERE requestId = ?
    '''
    upReqFormQueryStmt = switchboard.connection.prepareStatement(upReqFormQuery)
    upReqFormQueryStmt.setString(1, result)
    upReqFormQueryStmt.setLong(2, eventId)
    upReqFormQueryStmt.setString(3, requestId)
    upReqFormQueryStmt.executeUpdate()
    upReqFormQueryStmt.close()

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


def updateReportStatus(switchboard, result, reportId, eventId):
  errorLocation = '<<<<< BEGIN: updateReportStatus>>>>>'
  switchboard.log('<<<<<< REPORT QUEUEING AND STATUS: ' + reportId + ' >>>>>>')
  try:
    upReqFormQuery = '''
      UPDATE reportDetails
        SET
          status = ?,
          statusEventId = ?
      WHERE reportId = ?
    '''

    upReqFormQueryStmt = switchboard.connection.prepareStatement(upReqFormQuery)
    upReqFormQueryStmt.setString(1, result)
    upReqFormQueryStmt.setLong(2, eventId)
    upReqFormQueryStmt.setString(3, reportId)
    upReqFormQueryStmt.executeUpdate()
    upReqFormQueryStmt.close()


    errorLocation = '<<<<< queue report to review from pending >>>>>'
    reportSteps = getReportQueue(switchboard, reportId)

    if 'Report Data Pending' in reportSteps:
      if 'Result Data Review' not in reportSteps:
        queueReport = '''
          INSERT INTO queues (containerId, step, eventId)
          VALUES (?, 'Result Data Review', ?)
        '''
        queueReportStmt = switchboard.connection.prepareStatement(queueReport)
        queueReportStmt.setString(1, reportId)
        queueReportStmt.setLong(2, eventId)
        queueReportStmt.executeUpdate()
        queueReportStmt.close()

        errorLocation = '<<<<< dequeue report from  Report Data Pending >>>>>'
        dequeueReport = '''
          DELETE FROM queues
          WHERE containerId = ?
          AND step = 'Report Data Pending'
        '''
        dequeueReportStmt = switchboard.connection.prepareStatement(dequeueReport)
        dequeueReportStmt.setString(1, reportId)
        dequeueReportStmt.executeUpdate()
        dequeueReportStmt.close()

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

def ifExists(lst):
  if len(lst) > 0:
    return True
  else:
    return False
