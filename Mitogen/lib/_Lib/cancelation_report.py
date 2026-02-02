from reportingJsonBuilder import ReportingBuilder
class CancelationReport(ReportingBuilder):
  def __init__(self, switchboard, reportId):
    ReportingBuilder.__init__(self, switchboard, reportId)

  def createResDict(self):

    resDict = {}
    resDict['reportResultDataId'] = ''
    resDict['resultName'] = ''
    resDict['runId'] = ''
    resDict['specimen'] = ''
    resDict['result'] = ''
    resDict['dataType'] = ''
    resDict['analysisMethodId'] = ''
    resDict['analysisMethodName'] = ''
    resDict['panelCode'] = ''
    resDict['panelName'] = ''
    resDict['testCode'] = ''
    resDict['testName'] = ''
    resDict['methodCode'] = ''
    resDict['methodName'] = ''
    resDict['referenceRange'] = ''
    resDict['calculatedInterpretation'] = ''
    resDict['interpretation'] = ''
    resDict['limitUnits'] = ''
    resDict['reportable'] = ''
    resDict['discreteLimit'] = ''
    resDict['upperLimit'] = ''
    resDict['lowerLimit'] = ''
    resDict['limitUnits'] = ''
    resDict['interpretation'] = ''
    resDict['wording'] = ''
    resDict['analysisDataId'] = ''
    resDict['resultCode'] = ''

    return resDict

  def getCancelationData(self):
    runs = self.getAssociatedRuns()
    resList = []

    cQuery = '''
      SELECT 
        sr.currentContainerId AS 'specimen',
        IFNULL(sm.panelCode, '') AS 'panelCode',
        IFNULL(pan.name, '') AS 'panelName',
        IFNULL(sm.testCode, '') AS 'testCode',
        IFNULL(test.name, '') AS 'testName',
        IFNULL(sm.methodCode, '') AS 'methodCode',
        IFNULL(meth.name, '') AS 'methodName'
      FROM specimenRuns sr
      INNER JOIN specimenMethods sm
        ON sm.id = sr.specimenMethodsId
      INNER JOIN panels pan 
        ON pan.panelCode = sm.panelCode
      LEFT JOIN tests test 
        ON test.testCode = sm.testCode
      LEFT JOIN methods meth 
        ON meth.methodCode = sm.methodCode
      WHERE runId = ?
    '''
    cStmt = self.switchboard.connection.prepareStatement(cQuery)
    for run in runs:
      resDict = self.createResDict()
      cStmt.setString(1, run)
      cRs = cStmt.executeQuery()

      while cRs.next():
        specimen  = cRs.getString('specimen')
        self.associatedSpecimens.add(specimen)
        panelCode = cRs.getString('panelCode')
        self.associatedPanels.add(panelCode)
        panelName = cRs.getString('panelName')
        testCode = cRs.getString('testCode')
        self.associatedTests.add(testCode)
        testName  = cRs.getString('testName')
        methodCode = cRs.getString('methodCode')
        self.associatedMethods.add(methodCode)
        methodName = cRs.getString('methodName')
        
        resDict['specimen'] = specimen
        resDict['panelCode'] = panelCode
        resDict['panelName'] = panelName
        resDict['testCode'] = testCode
        resDict['testName'] = testName
        resDict['methodCode'] = methodCode
        resDict['methodName'] = methodName

      resList.append(resDict)
      
    return resList


  def makeCancelationReportObj(self):

    reportDict = self.createReportDict()
    rawData = self.getCancelationData()


    reportDict['report']['overallResult'] = ''
    reportDict['report']['overallInterpretation'] = ''
    reportDict['report']['overallWording'] = ''
    reportDict['report']['reportResultDataId'] = ''
    reportDict['report']['reportTitle'] = self.title
    reportDict['report']['reportDescription'] = self.description
    reportDict['report']['reportDate'] = ''
    reportDict['report']['reportDetailsId'] = self.reportDetailsId
    reportDict['report']['specimens'] = self.orderBySpec(rawData)
    reportDict['report']['specimensHL7'] = self.orderBySpecHL7(rawData)

    return reportDict
    
