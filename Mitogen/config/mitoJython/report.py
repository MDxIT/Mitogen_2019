
from java.sql import SQLException
from com.uniconnect.uniflow.exception import SystemException

class Report(object):
  ''' Report base class.

  Base class for a report
  Sets data if reportId exist

  Attributes:
    switchboard: switchboard object
    reportId: String of report id
    status: String of report status (created/data ready/data saved/reviewed/released/inEdit/canceled)
    reportDetailsId: Int of associated reportDetailsId if one exists
    reportType: String of report type (new/interim/final/amended/corrected/addended/rejected/qns/calnceled)
    title: String report title
    description: String report description
    associatedSpecimen: List of associated specimenIds
    associatedRuns: List of associated runIds
  '''

  def __init__(self, switchboard, reportId):
    self.switchboard = switchboard
    self.reportId = reportId

    reportData = self.getReportData()

    self.status = reportData['status']
    self.repDefVer = reportData['version']
    self.reportDetailsId = reportData['reportDetailsId']
    self.reportType = reportData['reportType']
    self.title = reportData['reportTitle']
    self.description = reportData['reportDescription']
    self.associatedRuns = reportData['Runs']
    self.associatedSpecimens = reportData['Specimens']

  def getReportId(self):
    return self.reportId

  def getStatus(self):
    return self.status

  def getReportDefVer(self):
    return self.repDefVer

  def getReportDetailsId(self):
    return self.reportDetailsId

  def getReportType(self):
    return self.reportType

  def getAssociatedRuns(self):
    return self.associatedRuns

  def getSpecimens(self):
    return self.associatedSpecimens

  def getEventId(self):
    return self.switchboard.eventId


  def getReportData(self):
    '''Retreives basic information about the report
    Returns:
      dataDict: Dictionary of report data
    '''    

    reportId = self.reportId
    dataDict = {}
    Runs = []
    Specimens = []
    status = None
    version = None
    repDetId = None
    repType = None
    repDesc = None
    repTitle = None

    self.switchboard.log('<<<<<< GETTING REPORT DATA FOR: ' + reportId + ' >>>>>>')
    try:
      rQuery = '''
        SELECT
          IFNULL(sr.runId, 'NO_RUNS') AS 'runId',
          IFNULL(reqSpec.specimenId, 'NO_SPECIMENS') AS 'specimenId',
          rd.reportDefinitionVersionId,
          rd.status,
          rd.id AS 'reportDetailsId',
          rd.reportType,
          repSet.title,
          repSet.reportDescription
        FROM reportDetails rd
        INNER JOIN reportSettings repSet 
          ON repSet.reportDefinitionVersionId = rd.reportDefinitionVersionId
        LEFT JOIN reportSpecimens rs
          ON rd.id = rs.reportDetailsId
        LEFT JOIN requestSpecimens reqSpec 
          ON reqSpec.id = rs.requestSpecimensId
        LEFT JOIN specimenMethods sm
          ON rs.specimenMethodsId = sm.Id
        LEFT JOIN specimenRuns sr
          ON sm.Id = sr.specimenMethodsId
        WHERE rd.reportId = ?
      '''

      rStmt = self.switchboard.connection.prepareStatement(rQuery)
      rStmt.setString(1, reportId)
      rRs = rStmt.executeQuery()

      while rRs.next():
        run = rRs.getString('runId')
        specimen = rRs.getString('specimenId')
        status = rRs.getString('status')
        version = rRs.getString('reportDefinitionVersionId')
        repDetId = rRs.getString('reportDetailsId')
        repType = rRs.getString('reportType')
        repTitle = rRs.getString('title')
        repDesc = rRs.getString('reportDescription')
        if run != 'NO_RUNS': 
          Runs.append(run)
        if specimen != 'NO_SPECIMENS':
          Specimens.append(specimen)

      dataDict['Runs'] = Runs
      dataDict['Specimens'] = Specimens
      dataDict['status'] = status
      dataDict['version'] = version
      dataDict['reportDetailsId'] = repDetId
      dataDict['reportType'] = repType
      dataDict['reportDescription'] = repDesc
      dataDict['reportTitle'] = self.assignTitle(repTitle, repType)

      rRs.close()
      rStmt.close()

      self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'true')
      return dataDict

    except SQLException as e:
      self.switchboard.log("---*** SQLEXCEPTION AT GET REPORT DATA ***----")
      self.switchboard.log("ERROR MESSAGE: " + str(e.message))
      self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')
      raise
      return


  def assignTitle(self, reportTitle, reportType):
    ''' Adds the type to title if in corrected/amended/addended/rejected/canceled

    Args:
      reportTitle: String of the report title
      reportType: String of the report type

    Returns:
      reportTitle: String of the report title concatenated with type if in corrected/amended/addended/rejected/canceled
    '''

    if reportType == 'corrected':
      return reportTitle + ' - Corrected'
    elif reportType == 'amended':
      return reportTitle + ' - Amended'
    elif reportType == 'addended':
      return reportTitle + ' - Addended'
    elif reportType == 'rejected':
      return reportTitle + ' - Rejected'
    elif reportType == 'canceled':
      return reportTitle + ' - Canceled'
    else:
      return reportTitle

  def getModificationTextHL7(self, reportDict):
    keys = ['correctedText', 'amendedText', 'addendedText', 'rejectedText', 'canceledText']
    output = [];
    for k in keys:
        for text in reportDict[k]:
          if text:
            output.append({k: text})
    return output

  def getModificationText(self, modType):
    ''' Retreives the text associated with a modification type

    Args:
      modType: String in corrected/amended/addended/rejected/canceled

    Returns:
      textList: List of strings(modification text)
    '''

    textList = []

    try:
      mQuery = '''
        SELECT
          changeText
        FROM reportModifications
        WHERE reportDetailsId = ? AND reportType = '%s' AND modStatus = 1
      ''' % modType
      mStmt = self.switchboard.connection.prepareStatement(mQuery)
      mStmt.setString(1, self.reportDetailsId)
      mRs = mStmt.executeQuery()

      while mRs.next():
        text = mRs.getString('changeText')
        textList.append(text)

      mRs.close()
      mStmt.close()

      self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'true')
      return textList

    except SQLException as e:
      self.switchboard.log("---*** SQLEXCEPTION AT GET REPORT DATA ***----")
      self.switchboard.log("ERROR MESSAGE: " + str(e.message))
      self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')
      raise
      return


  def getAllRuns(self, runList):

    rQuery = '''
      SELECT sr1.runId
      FROM specimenRuns sr
        INNER JOIN specimenRuns sr1 
          ON sr.id = sr1.parentWorkflowSpecimenRunId
      WHERE sr.runId = ?
    '''
    rStmt = self.switchboard.connection.prepareStatement(rQuery)

    thisRunList = []
    for run in runList:
      rStmt.setString(1, run)
      rRs = rStmt.executeQuery()
      while rRs.next():
        runId = rRs.getString('runId')
        thisRunList.append(runId)

      if thisRunList:
        allRuns = self.associatedRuns + thisRunList
        allRuns = set(allRuns)
        allRuns = list(allRuns)
        self.associatedRuns = allRuns
        self.getAllRuns(thisRunList)
    return self.associatedRuns





