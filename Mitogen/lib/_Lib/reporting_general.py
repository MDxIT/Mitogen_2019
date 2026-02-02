from com.uniconnect.uniflow.exception import SystemException
from java.sql import SQLException

def fileTypeExists(switchboard, containerId, fileType):
  try:
    errorLocation = '<<<<< BEGIN: fileTypeExists >>>>>'
    switchboard.log('<<<<<< BEGIN: fileTypeExists >>>>>>')

    getQuery = '''
      SELECT DISTINCT 1 AS "fileRecordExists"
      FROM containerFiles
      WHERE containerId = ?
      AND fileType = ?
    '''

    getQueryStmt = switchboard.connection.prepareStatement(getQuery)
    errorLocation = '<<<<< fileTypeExists: Set Select Values >>>>>'
    getQueryStmt.setString(1, containerId)
    getQueryStmt.setString(2, fileType)

    errorLocation = '<<<<< fileTypeExists: run query >>>>>'
    print getQueryStmt
    fileRs = getQueryStmt.executeQuery()

    errorLocation = '<<<<< fileTypeExists: loop through query results >>>>>'
    ifExists = False
    while fileRs.next():
      errorLocation = '<<<<< fileTypeExists: get fileRecordExists >>>>>'
      fileRecordExists = fileRs.getString('fileRecordExists')
      print fileRecordExists
      if fileRecordExists:
        ifExists = True

    errorLocation = '<<<<< fileTypeExists: close statements >>>>>'
    fileRs.close()
    getQueryStmt.close()

    switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'true')
    return ifExists
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


def updateContainerFiles(switchboard, fileName, location, eventId, containerId, fileType ):
  errorLocation = '<<<<< BEGIN: updateContainerFiles >>>>>'
  switchboard.log('<<<<<< Update container files')
  try:
    updateQuery = '''
      UPDATE containerFiles
      SET fileName = ?,
          location = ?,
          eventId = ?
      WHERE containerId = ?
      AND fileType = ?
    '''

    updateQueryStmt = switchboard.connection.prepareStatement(updateQuery)
    updateQueryStmt.setString(1, fileName)
    updateQueryStmt.setString(2, location)
    updateQueryStmt.setLong(3, eventId)
    updateQueryStmt.setString(4, containerId)
    updateQueryStmt.setString(5, fileType)
    print updateQueryStmt
    errorLocation = '<<<<< updateContainerFiles execute statement >>>>>'
    updateQueryStmt.executeUpdate()
    updateQueryStmt.close()

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



def updateReportData(switchboard, active, pdfFilePath, lastUpdatedEventId, reportDetailsId):
  errorLocation = '<<<<< BEGIN: updateReportData >>>>>'
  switchboard.log('<<<<<< Update reportData')
  try:
    updateReportDataQuery = '''
      UPDATE reportedData
      SET active = ?,
          pdfFilePath = ?,
          lastUpdatedEventId = ?
      WHERE reportDetailsId = ?
      AND active = 1
    '''

    updateReportDataQueryStmt = switchboard.connection.prepareStatement(updateReportDataQuery)
    updateReportDataQueryStmt.setInt(1, active)
    updateReportDataQueryStmt.setString(2, pdfFilePath)
    updateReportDataQueryStmt.setLong(3, lastUpdatedEventId)
    updateReportDataQueryStmt.setString(4, reportDetailsId)
    print updateReportDataQueryStmt
    errorLocation = '<<<<< updateReportData execute statement >>>>>'
    updateReportDataQueryStmt.executeUpdate()
    updateReportDataQueryStmt.close()

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


def insertReportModifications(switchboard, reportDetailsId, changeText, reportType, modStatus, eventId):
  errorLocation = '<<<<< BEGIN: insertReportModifications >>>>>'
  switchboard.log('<<<<<< Insert into Report Modifications: ' + reportDetailsId + ' >>>>>>')
  try:
    insertQuery = '''
      INSERT INTO reportModifications ( reportDetailsId, changeText, reportType, modStatus, eventId, lastUpdatedEventId)
        VALUES (?,?,?,?,?,?)
    '''

    insertQueryStmt = switchboard.connection.prepareStatement(insertQuery)
    insertQueryStmt.setString(1, reportDetailsId)
    insertQueryStmt.setString(2, changeText)
    insertQueryStmt.setString(3, reportType)
    insertQueryStmt.setInt(4, modStatus)
    insertQueryStmt.setLong(5, eventId)
    insertQueryStmt.setLong(6, eventId)
    errorLocation = '<<<<< insertReportModifications: End query definition, Begin execute update >>>>>'
    insertQueryStmt.executeUpdate()
    errorLocation = '<<<<< insertReportModifications: End execute update, Begin close statement >>>>>'
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


