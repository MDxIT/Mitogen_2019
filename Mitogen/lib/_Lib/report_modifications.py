from java.sql import SQLException
from com.uniconnect.uniflow.exception import SystemException
from report import Report

class ReportMod(Report):
  ''' Extends report to be used for modifications (cancel/reject/amend/addend)

  Used to insert modification text and get report data
  '''

  def __init__(self, switchboard, reportId):
    Report.__init__(self, switchboard, reportId)

  def insertModText(self, changeText):
    ''' Inserts modification text for report

    Args:
      changeText: String of text to be saved

    Returns: 
      True is succesful
    '''

    reportDetailsId = self.getReportDetailsId()
    reportType = self.getReportType()
    eventId = self.getEventId()

    self.switchboard.log('<<<<<< INSERTING ' + reportType.upper() + ' TEXT FOR REPORT: ' + self.reportId + ' >>>>>>' )

    try:
      iQuery = '''
        INSERT INTO reportModifications (reportDetailsId, changeText, reportType, eventId, lastUpdatedEventId)
          VALUES (?,?,?,?,?)
      '''

      iStmt = self.switchboard.connection.prepareStatement(iQuery)
      iStmt.setString(1, reportDetailsId)
      iStmt.setString(2, changeText)
      iStmt.setString(3, reportType)
      iStmt.setLong(4, eventId)
      iStmt.setLong(5, eventId)
      iStmt.executeUpdate()
      iStmt.close()
    
      self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'true')
      return True

    except SQLException as e:
      self.switchboard.log("---*** SQLEXCEPTION AT REPORTMOD INSERTMODTEXT ***----")
      self.switchboard.log("ERROR MESSAGE: " + str(e.message))
      self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')
      raise
      return