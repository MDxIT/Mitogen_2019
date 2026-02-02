'''
  #
  #   ######## General FUNCTIONS ########
  #
'''

import json
from com.uniconnect.uniflow.exception import SystemException
from java.sql import SQLException
from dateFormatter import DateFormatter

errorLocation = ''
## for history make more general and allow containerHistory and resourceHistory

def insertContainer(switchboard, containerId, containerType, eventId, addHistory = True, addContent = True):
  errorLocation = '<<<<< BEGIN: InsertContainer >>>>>'
  switchboard.log('<<<<<< Insert into containers: ' + containerId + ' >>>>>>')

  try:
    insertCon = '''
      INSERT INTO containers (containerId, containerType, eventId) VALUES (?, ?, ?)
    '''

    insertContainerQueryStmt = switchboard.connection.prepareStatement(insertCon)
    insertContainerQueryStmt.setString(1, containerId)
    insertContainerQueryStmt.setString(2, containerType)
    insertContainerQueryStmt.setLong(3, eventId)
    errorLocation = '<<<<< insertContainer execute statement >>>>>'
    insertContainerQueryStmt.executeUpdate()
    insertContainerQueryStmt.close()

    if addHistory:
      errorLocation = '<<<<<< CALL: add History IN insertContainer >>>>>>'
      insertContainerHistory(switchboard, containerId, eventId)

    if addContent:
      errorLocation = '<<<<<< CALL: add Content IN insertContainer >>>>>>'
      insertContent(switchboard, containerId, 'self', containerType, containerId, eventId)

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


def insertContainerHistory(switchboard, containerId, eventId):
  errorLocation = '<<<<< BEGIN: InsertContainerHistory >>>>>'
  switchboard.log('<<<<<< Insert into containerHistory: ' + containerId + ' >>>>>>')
  try:
    dup_check = '''
        SELECT 1 FROM containerHistory WHERE containerId = ? AND eventId = ?
    '''
    insertConHist = '''
      INSERT INTO containerHistory (containerId, eventId) VALUES (?, ?)
    '''

    stmt = switchboard.connection.prepareStatement(dup_check)
    stmt.setString(1, containerId)
    stmt.setLong(2, eventId)
    rs = stmt.executeQuery()
    if rs.next():
        switchboard.log('CONTAINER HISTORY SAVED')
    else:

        insertContainerHistQueryStmt = switchboard.connection.prepareStatement(insertConHist)
        insertContainerHistQueryStmt.setString(1, containerId)
        insertContainerHistQueryStmt.setLong(2, eventId)
        errorLocation = '<<<<< insertContainerHistory execute statement >>>>>'
        insertContainerHistQueryStmt.executeUpdate()
        insertContainerHistQueryStmt.close()

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


def insertContent(switchboard, containerId, attribute, contentType, content, eventId):
  errorLocation = '<<<<< BEGIN: insertContent >>>>>'
  switchboard.log('<<<<<< Insert into contents: ' + containerId + ' >>>>>>')
  try:
    insertContent = '''
      INSERT INTO contents (containerId, attribute, contentType, content, eventId) VALUES (?, ?, ?, ?, ?)
    '''

    insertContentQueryStmt = switchboard.connection.prepareStatement(insertContent)
    insertContentQueryStmt.setString(1, containerId)
    insertContentQueryStmt.setString(2, attribute)
    insertContentQueryStmt.setString(3, contentType)
    insertContentQueryStmt.setString(4, content)
    insertContentQueryStmt.setLong(5, eventId)
    errorLocation = '<<<<< insertContent execute statement >>>>>'
    insertContentQueryStmt.executeUpdate()
    insertContentQueryStmt.close()

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


def insertPrevChildContent(switchboard, origRunId, attribute, eventId, previousChildContainerId):
  errorLocation = '<<<<< BEGIN: insertPrevChildContent >>>>>'
  switchboard.log('<<<<<< Insert into contents previous child content: ' + origRunId + ' >>>>>>')
  try:

    errorLocation = '<<<<< insertPrevChildContent getPrevChildContent >>>>>'
    getPrevChildContentQuery = '''
      SELECT contentType AS 'childContentType', content AS 'childContent' FROM contents WHERE containerId = ?
    '''

    getPrevChildContentQueryStmt = switchboard.connection.prepareStatement(getPrevChildContentQuery)
    getPrevChildContentQueryStmt.setString(1, previousChildContainerId)
    print 'getPrevChildContentQueryStmt'
    print getPrevChildContentQueryStmt
    errorLocation = '<<<<< insertPrevChildContent getPrevChildContent execute query >>>>>'
    childContent = getPrevChildContentQueryStmt.executeQuery()

    errorLocation = '<<<<< insertPrevChildContent while loop: childContent >>>>>'
    while childContent.next():
      contentType = childContent.getString('childContentType')
      content = childContent.getString('childContent')
      errorLocation = '<<<<< insertPrevChildContent insertContent >>>>>'
      insertContent(switchboard, origRunId, attribute, contentType, content, eventId)

    childContent.close()
    getPrevChildContentQueryStmt.close()

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


def insertQueue(switchboard, containerId, stepName, eventId):
  errorLocation = '<<<<< BEGIN: insertQueue >>>>>'
  switchboard.log('<<<<<< Insert into queues: ' + containerId + ' >>>>>>')
  try:
    insertQueue = '''
      INSERT INTO queues (containerId, step, eventId)
      VALUES (?, ?, ?)
    '''

    insertQueueQueryStmt = switchboard.connection.prepareStatement(insertQueue)
    insertQueueQueryStmt.setString(1, containerId)
    insertQueueQueryStmt.setString(2, stepName)
    insertQueueQueryStmt.setLong(3, eventId)
    errorLocation = '<<<<< insertQueue execute statement >>>>>'
    insertQueueQueryStmt.executeUpdate()
    insertQueueQueryStmt.close()

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


def deleteQueueByStepAndContainer(switchboard, containerId, stepName):
  errorLocation = '<<<<< BEGIN: deleteQueue >>>>>'
  switchboard.log('<<<<<< delete from queues: ' + containerId + ' >>>>>>')
  try:
    deleteQueue = '''
      DELETE FROM queues
      WHERE containerId = ?
      AND step = ?
    '''

    deleteQueueQueryStmt = switchboard.connection.prepareStatement(deleteQueue)
    deleteQueueQueryStmt.setString(1, containerId)
    deleteQueueQueryStmt.setString(2, stepName)
    errorLocation = '<<<<< deleteQueueByStepAndContainer execute statement >>>>>'
    deleteQueueQueryStmt.executeUpdate()
    deleteQueueQueryStmt.close()

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


def deleteQueueByContainer(switchboard, containerId):
  errorLocation = '<<<<< BEGIN: deleteQueue >>>>>'
  switchboard.log('<<<<<< delete from queues: ' + containerId + ' >>>>>>')
  try:
    deleteQueue = '''
      DELETE FROM queues
      WHERE containerId = ?
    '''

    deleteQueueQueryStmt = switchboard.connection.prepareStatement(deleteQueue)
    deleteQueueQueryStmt.setString(1, containerId)
    errorLocation = '<<<<< deleteQueueByContainer execute statement >>>>>'
    deleteQueueQueryStmt.executeUpdate()
    deleteQueueQueryStmt.close()

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


def getNewRunId(switchboard):
  errorLocation = '<<<<< BEGIN: getNewRunId >>>>>'
  try:
    runIdQuery = '''
      CALL sp_getNextSequence('runId','runId')
    '''

    runIdQueryQueryStmt = switchboard.connection.prepareStatement(runIdQuery)
    curRunId = runIdQueryQueryStmt.executeQuery()

    errorLocation = '<<<<< while loop: getNewRunId >>>>>'
    while curRunId.next():
      runId = curRunId.getString('runId')
    curRunId.close()
    runIdQueryQueryStmt.close()

    switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'true')
    return runId

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


def getNewPoolRunId(switchboard):
  errorLocation = '<<<<< BEGIN: getNewRunId >>>>>'
  try:
    runIdQuery = '''
      CALL sp_getNextSequence('poolRunId','poolRunId')
    '''

    runIdQueryQueryStmt = switchboard.connection.prepareStatement(runIdQuery)
    curRunId = runIdQueryQueryStmt.executeQuery()

    errorLocation = '<<<<< while loop: getNewRunId >>>>>'
    while curRunId.next():
      poolRunId = curRunId.getString('poolRunId')
    curRunId.close()
    runIdQueryQueryStmt.close()

    switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'true')
    return poolRunId

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

def getValidValues(switchboard, setName):
  try:
    validValuesQuery = '''
      SELECT
        '' AS "displayValue",
        '' AS "value"
      UNION
      SELECT 
        displayValue,
        value
      FROM validValues
      WHERE setname = ?
    '''

    validValuesStmt = switchboard.connection.prepareStatement(validValuesQuery)
    validValuesStmt.setString(1, setName)
    validValuesRs = validValuesStmt.executeQuery()

    valid_values = []
    while validValuesRs.next():
      display = validValuesRs.getString('displayValue')
      value = validValuesRs.getString('value')
      valid_val = {
          'value': value,
          'display': display
      }

      valid_values.append(valid_val)

    switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'true')
    return valid_values

  except SQLException as e:
    switchboard.log("---*** SQLException AT GETVALIDVALUES ***----")
    switchboard.log("ERROR LOCATION: " + errorLocation)
    switchboard.log("ERROR MESSAGE: " + str(e.message))
    switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')
    raise
    return
  except BaseException as e:
    switchboard.log("---*** PYTHON EXCEPTION AT GET VALID VALUES ***---")
    switchboard.log("ERROR LOCATION: " + errorLocation)
    switchboard.log("ERROR MESSAGE: " + str(e.message))
    switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')
    raise
    return



def insertContainerNotes(switchboard, containerId, noteType, note, eventId):
  errorLocation = '<<<<< BEGIN: insertContainerNotes >>>>>'
  switchboard.log('<<<<<< Insert into containerNotes: ' + containerId + ' >>>>>>')
  try:
    insertQuery = '''
      INSERT INTO containerNotes (containerId, noteType, note, eventId)
      VALUES (?, ?, ?, ?)
    '''

    insertQueryStmt = switchboard.connection.prepareStatement(insertQuery)
    insertQueryStmt.setString(1, containerId)
    insertQueryStmt.setString(2, noteType)
    insertQueryStmt.setString(3, note)
    insertQueryStmt.setLong(4, eventId)
    errorLocation = '<<<<< insertContainerNotes: End query definition, Begin execute update >>>>>'
    insertQueryStmt.executeUpdate()
    errorLocation = '<<<<< insertContainerNotes: End execute update, Begin close statement >>>>>'
    insertQueryStmt.close()

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


def insertContainerFiles(switchboard, containerId, fileType, fileName, location, eventId):
  errorLocation = '<<<<< BEGIN: insertContainerFiles >>>>>'
  switchboard.log('<<<<<< Insert into insertContainerFiles: ' + containerId + ' >>>>>>')
  try:
    insertQuery = '''
      INSERT INTO containerFiles (containerId, fileType, fileName, location, eventId)
      VALUES (?, ?, ?, ?, ?)
    '''

    insertQueryStmt = switchboard.connection.prepareStatement(insertQuery)
    insertQueryStmt.setString(1, containerId)
    insertQueryStmt.setString(2, fileType)
    insertQueryStmt.setString(3, fileName)
    insertQueryStmt.setString(4, location)
    insertQueryStmt.setLong(5, eventId)
    errorLocation = '<<<<< insertContainerFiles: End query definition, Begin execute update >>>>>'
    print insertQueryStmt
    insertQueryStmt.executeUpdate()
    errorLocation = '<<<<< insertContainerFiles: End execute update, Begin close statement >>>>>'
    insertQueryStmt.close()

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


def getContainerType(switchboard, containerId):
  try:
    errorLocation = '<<<<< BEGIN: getContainerType >>>>>'
    switchboard.log('<<<<<< BEGIN: getContainerType >>>>>>')

    getContainerTypeQuery = '''
      SELECT containerType AS "containerType"
      FROM containers
      WHERE containerId = ?
    '''

    getContainerTypeQueryStmt = switchboard.connection.prepareStatement(getContainerTypeQuery)
    errorLocation = '<<<<< getContainerType: Set Select Values >>>>>'
    getContainerTypeQueryStmt.setString(1, containerId)

    errorLocation = '<<<<< getContainerType: run query >>>>>'
    conTypeRs = getContainerTypeQueryStmt.executeQuery()

    errorLocation = '<<<<< getContainerType: loop through query results >>>>>'
    while conTypeRs.next():
      errorLocation = '<<<<< getContainerType: get containertype >>>>>'
      origContainerType = conTypeRs.getString('containerType')

    errorLocation = '<<<<< getContainerType: close statements >>>>>'
    conTypeRs.close()
    getContainerTypeQueryStmt.close()

    switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'true')
    return origContainerType
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


def checkNULL(value):
  if value == None:
    return ''
  else:
    return value


def insertReportResultDataNoSpecimen(switchboard, reportDetailsId, panelCode, varcharResult, interpretation, wording, isOverall, isPanelOverall, eventId):
  errorLocation = '<<<<< BEGIN: insertReportResultDataNoSpecimen >>>>>'
  switchboard.log('<<<<<< Insert into reportResultData with no specimen')
  try:
 
    if panelCode == '':
      panelCode = None

    if varcharResult == '':
      varcharResult = None

    if interpretation == '':
      interpretation = None

    if wording == '':
      wording = None

    insertReportResultData = '''
      INSERT INTO reportResultData (reportDetailsId, panelCode, varcharResult, interpretation, wording, isOverall, isPanelOverall, lastUpdatedEventId, eventId)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    '''

    insertReportResultDataQueryStmt = switchboard.connection.prepareStatement(insertReportResultData)
    insertReportResultDataQueryStmt.setString(1, reportDetailsId)
    insertReportResultDataQueryStmt.setString(2, panelCode)
    insertReportResultDataQueryStmt.setString(3, varcharResult)
    insertReportResultDataQueryStmt.setString(4, interpretation)
    insertReportResultDataQueryStmt.setString(5, wording)
    insertReportResultDataQueryStmt.setInt(6, isOverall)
    insertReportResultDataQueryStmt.setInt(7, isPanelOverall)
    insertReportResultDataQueryStmt.setLong(8, eventId)
    insertReportResultDataQueryStmt.setLong(9, eventId)
    print insertReportResultDataQueryStmt  
    errorLocation = '<<<<< insertReportResultDataNoSpecimen execute statement >>>>>'
    insertReportResultDataQueryStmt.executeUpdate()
    insertReportResultDataQueryStmt.close()

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


def insertReportResultData(switchboard, reportDetailsId, specimenId, panelCode, testCode, methodCode, analysisDataId, varcharResult, decimalResult, dateTimeResult, imageResult, interpretation, wording, isOverall, isPanelOverall, limits, reportableUnits, eventId):
  errorLocation = '<<<<< BEGIN: insertReportResultData >>>>>'
  switchboard.log('<<<<<< Insert into reportResultData')
  try:

    if specimenId == '':
      specimenId = None

    if panelCode == '':
      panelCode = None

    if testCode == '':
      testCode = None

    if methodCode == '':
      methodCode = None

    if analysisDataId == '':
      analysisDataId = None

    if varcharResult == '':
      varcharResult = None

    if decimalResult == '':
      decimalResult = None

    if dateTimeResult == '':
      dateTimeResult = None

    if imageResult == '':
      imageResult = None

    if interpretation == '':
      interpretation = None

    if wording == '':
      wording = None

    if limits == '':
      limits = None

    if reportableUnits == '':
      reportableUnits = None

    insertReportResultData = '''
      INSERT INTO reportResultData (reportDetailsId, specimenId, panelCode, testCode, methodCode, analysisDataId, varcharResult, decimalResult, dateTimeResult, imageResult, interpretation, wording, isOverall, isPanelOverall, limits, reportableUnits, lastUpdatedEventId, eventId)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    '''

    insertReportResultDataQueryStmt = switchboard.connection.prepareStatement(insertReportResultData)
    insertReportResultDataQueryStmt.setString(1, reportDetailsId)
    insertReportResultDataQueryStmt.setString(2, specimenId)
    insertReportResultDataQueryStmt.setString(3, panelCode)
    insertReportResultDataQueryStmt.setString(4, testCode)
    insertReportResultDataQueryStmt.setString(5, methodCode)
    insertReportResultDataQueryStmt.setString(6, analysisDataId)
    insertReportResultDataQueryStmt.setString(7, varcharResult)
    insertReportResultDataQueryStmt.setString(8, decimalResult)
    insertReportResultDataQueryStmt.setString(9, dateTimeResult)
    insertReportResultDataQueryStmt.setString(10, imageResult)
    insertReportResultDataQueryStmt.setString(11, interpretation)
    insertReportResultDataQueryStmt.setString(12, wording)
    insertReportResultDataQueryStmt.setInt(13, isOverall)
    insertReportResultDataQueryStmt.setInt(14, isPanelOverall)
    insertReportResultDataQueryStmt.setString(15, limits)
    insertReportResultDataQueryStmt.setString(16, reportableUnits)
    insertReportResultDataQueryStmt.setLong(17, eventId)
    insertReportResultDataQueryStmt.setLong(18, eventId)
    print insertReportResultDataQueryStmt  
    errorLocation = '<<<<< insertReportResultData execute statement >>>>>'
    insertReportResultDataQueryStmt.executeUpdate()
    insertReportResultDataQueryStmt.close()

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


def insertReportResultDataAmend(switchboard, reportDetailsId, specimenId, panelCode, testCode, methodCode, analysisDataId, newValueType, newResult, interpretation, wording, isOverall, isPanelOverall, limits, reportableUnits, previousReportResultDataId, eventId):
  errorLocation = '<<<<< BEGIN: insertReportResultDataAmend >>>>>'
  switchboard.log('<<<<<< Insert into reportResultData for amend reporting')
  try:

    if specimenId == '':
      specimenId = None

    if panelCode == '':
      panelCode = None

    if testCode == '':
      testCode = None

    if methodCode == '':
      methodCode = None

    if analysisDataId == '':
      analysisDataId = None


    varcharResult = None
    decimalResult = None
    dateTimeResult = None
    imageResult = None

    if newValueType == 'varchar':
      varcharResult = newResult
      if varcharResult == '':
        varcharResult = None

    if newValueType == 'decimal':
      decimalResult = newResult
      if decimalResult == '':
        decimalResult = None

    if newValueType == 'image':
      imageResult = newResult
      if imageResult == '':
        imageResult = None

    if newValueType == 'dateTime':
      dateTimeResult = newResult
      if dateTimeResult == '':
        dateTimeResult = None
      else:
        dateObj = DateFormatter(switchboard, dateTimeResult)
        dateTimeResult = dateObj.shortFormToDataBaseStr()

    if interpretation == '':
      interpretation = None

    if wording == '':
      wording = None

    if limits == '':
      limits = None

    if reportableUnits == '':
      reportableUnits = None

    if previousReportResultDataId == '':
      previousReportResultDataId = None

    insertReportResultData = '''
      INSERT INTO reportResultData (reportDetailsId, specimenId, panelCode, testCode, methodCode, analysisDataId, varcharResult, decimalResult, dateTimeResult, imageResult, interpretation, wording, isOverall, isPanelOverall, limits, reportableUnits, previousReportResultDataId, lastUpdatedEventId, eventId)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    '''

    insertReportResultDataQueryStmt = switchboard.connection.prepareStatement(insertReportResultData)
    insertReportResultDataQueryStmt.setString(1, reportDetailsId)
    insertReportResultDataQueryStmt.setString(2, specimenId)
    insertReportResultDataQueryStmt.setString(3, panelCode)
    insertReportResultDataQueryStmt.setString(4, testCode)
    insertReportResultDataQueryStmt.setString(5, methodCode)
    insertReportResultDataQueryStmt.setString(6, analysisDataId)
    insertReportResultDataQueryStmt.setString(7, varcharResult)
    insertReportResultDataQueryStmt.setString(8, decimalResult)
    insertReportResultDataQueryStmt.setString(9, dateTimeResult)
    insertReportResultDataQueryStmt.setString(10, imageResult)
    insertReportResultDataQueryStmt.setString(11, interpretation)
    insertReportResultDataQueryStmt.setString(12, wording)
    insertReportResultDataQueryStmt.setInt(13, isOverall)
    insertReportResultDataQueryStmt.setInt(14, isPanelOverall)
    insertReportResultDataQueryStmt.setString(15, limits)
    insertReportResultDataQueryStmt.setString(16, reportableUnits)
    insertReportResultDataQueryStmt.setString(17, previousReportResultDataId)
    insertReportResultDataQueryStmt.setLong(18, eventId)
    insertReportResultDataQueryStmt.setLong(19, eventId)
    print insertReportResultDataQueryStmt  
    errorLocation = '<<<<< insertReportResultDataAmend execute statement >>>>>'
    insertReportResultDataQueryStmt.executeUpdate()
    insertReportResultDataQueryStmt.close()

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



def updateReportResultData(switchboard, varcharResult, decimalResult, dateTimeResult, imageResult, interpretation, wording, lastUpdatedEventId, reportResultDataId):
  errorLocation = '<<<<< BEGIN: updateReportResultData >>>>>'
  switchboard.log('<<<<<< Update reportResultData')
  try:
    updateReportResultData = '''
      UPDATE reportResultData 
      SET varcharResult = ?, 
          decimalResult = ?, 
          dateTimeResult = ?,
          imageResult = ?,
          interpretation = ?, 
          wording = ?,
          lastUpdatedEventId = ?
      WHERE id = ?
    '''

    updateReportResultDataQueryStmt = switchboard.connection.prepareStatement(updateReportResultData)
    updateReportResultDataQueryStmt.setString(1, varcharResult)
    updateReportResultDataQueryStmt.setString(2, decimalResult)
    updateReportResultDataQueryStmt.setString(3, dateTimeResult)
    updateReportResultDataQueryStmt.setString(4, imageResult)
    updateReportResultDataQueryStmt.setString(5, interpretation)
    updateReportResultDataQueryStmt.setString(6, wording)
    updateReportResultDataQueryStmt.setLong(7, lastUpdatedEventId)
    updateReportResultDataQueryStmt.setString(8, reportResultDataId)
    print updateReportResultDataQueryStmt
    errorLocation = '<<<<< updateReportResultData execute statement >>>>>'
    updateReportResultDataQueryStmt.executeUpdate()
    updateReportResultDataQueryStmt.close()

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


def updateReportDetailsStatus(switchboard, reportId, status, statusEventId):
  errorLocation = '<<<<< BEGIN: updateReportDetailsStatus >>>>>'
  switchboard.log('<<<<<< updateReportDetailsStatus')
  try:
    updateReportDetailsQuery = '''
      UPDATE reportDetails
      SET status = ?, 
          statusEventId = ?
      WHERE reportId = ?
    '''

    updateReportDetailsQueryStmt = switchboard.connection.prepareStatement(updateReportDetailsQuery)
    updateReportDetailsQueryStmt.setString(1, status)
    updateReportDetailsQueryStmt.setLong(2, statusEventId)
    updateReportDetailsQueryStmt.setString(3, reportId)
    print updateReportDetailsQueryStmt
    errorLocation = '<<<<< updateReportDetailsStatus execute statement >>>>>'
    updateReportDetailsQueryStmt.executeUpdate()
    updateReportDetailsQueryStmt.close()

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


def updateReportDetailsStatusAndType(switchboard, reportId, status, reportType, statusEventId):
  errorLocation = '<<<<< BEGIN: updateReportDetailsStatusAndType >>>>>'
  switchboard.log('<<<<<< UPDATING REPORT STATUS AND TYPE FOR REPORT: ' + reportId + ' >>>>>>')
  try:
    updateReportDetailsQuery = '''
      UPDATE reportDetails
      SET status = ?,
          reportType = ?, 
          statusEventId = ?
      WHERE reportId = ?
    '''

    updateReportDetailsQueryStmt = switchboard.connection.prepareStatement(updateReportDetailsQuery)
    updateReportDetailsQueryStmt.setString(1, status)
    updateReportDetailsQueryStmt.setString(2, reportType)
    updateReportDetailsQueryStmt.setLong(3, statusEventId)
    updateReportDetailsQueryStmt.setString(4, reportId)
    print updateReportDetailsQueryStmt
    errorLocation = '<<<<< updateReportDetailsStatusAndType execute statement >>>>>'
    updateReportDetailsQueryStmt.executeUpdate()
    updateReportDetailsQueryStmt.close()

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


def updateReportResultDataCurrentResult(switchboard, currentResult, lastUpdatedEventId, reportResultDataId):
  errorLocation = '<<<<< BEGIN: updateReportResultDataCurrentResult >>>>>'
  switchboard.log('<<<<<< Update reportResultData for current result')
  try:
    updateReportResultData = '''
      UPDATE reportResultData 
      SET currentResult = ?, 
          lastUpdatedEventId = ?
      WHERE id = ?
    '''

    updateReportResultDataQueryStmt = switchboard.connection.prepareStatement(updateReportResultData)
    updateReportResultDataQueryStmt.setInt(1, currentResult)
    updateReportResultDataQueryStmt.setLong(2, lastUpdatedEventId)
    updateReportResultDataQueryStmt.setString(3, reportResultDataId)
    print updateReportResultDataQueryStmt
    errorLocation = '<<<<< updateReportResultDataCurrentResult execute statement >>>>>'
    updateReportResultDataQueryStmt.executeUpdate()
    updateReportResultDataQueryStmt.close()

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


def get_containers_on_queue(switchboard, step):
    containers = []
    r_query = '''
        SELECT containerId AS 'run'
        FROM queues
        WHERE step = ?
    '''
    try:
        stmt = switchboard.connection.prepareStatement(r_query)
        stmt.setString(1, step)
        rs = stmt.executeQuery()

        while rs.next():
            containers.append(rs.getString(1))
        stmt.close()

        return containers
    except SQLException as e:
        switchboard.log("---*** SQL EXCEPT AT GET_CONTAINERS_ON_QUEUE ***---")
        switchboard.log("ERROR MESSAGE: " + str(e.message))
        switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')
    except BaseException as e:
        switchboard.log("---*** PYTHON EXCEPTION AT GET_CONTAINERS_ON_QUEUE  ***---")
        switchboard.log("ERROR MESSAGE " + str(e.message))
        switchboard.formResuls.put('PROCESSINGSUCCESSFUL', 'false')

def insert_comments(switchboard, container, comments):
    insert = '''
        INSERT INTO containerNotes(containerId, noteType, note, eventId) VALUES(?,'Analysis Comment', ?,?)
    '''
    try:
        stmt = switchboard.connection.prepareStatement(insert)
        stmt.setString(1, container)
        stmt.setString(2, comments)
        stmt.setLong(3, switchboard.eventId)
        switchboard.log(str(stmt))
        stmt.executeUpdate()
        stmt.close()
    
    except SQLException as e:
        switchboard.log("---*** SQL EXCEPT AT GET_CONTAINERS_ON_QUEUE ***---")
        switchboard.log("ERROR MESSAGE: " + str(e.message))
        switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')
    except BaseException as e:
        switchboard.log("---*** PYTHON EXCEPTION AT GET_CONTAINERS_ON_QUEUE  ***---")
        switchboard.log("ERROR MESSAGE " + str(e.message))
        switchboard.formResuls.put('PROCESSINGSUCCESSFUL', 'false')








