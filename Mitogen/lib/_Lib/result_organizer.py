from operator import itemgetter
class ResultOrganizer(object):
  ''' Base class for organizing results.
  Used for report creation

  Attributes:
    associatedSpecimens
    associatedPanels
    AssociatedTests
  '''

  def __init__(self, specimens, panels, tests):
    self.associatedSpecimens = specimens
    self.associatedPanels = panels
    self.associatedTests = tests

  ### SET MAPPERS

  def specimenMap(self):
    specDict = {}

    for spec in self.associatedSpecimens:
      specDict[spec] = []

    return specDict
  
  def panelMap(self):

    panelDict = {}

    for panel in self.associatedPanels:
      panelDict[panel] = []

    return panelDict

  def testMap(self):

    testDict = {}

    for test in self.associatedTests:
      testDict[test] = []

    return testDict

  ### DICTIONARY DEFINITIONS

  def createResDict(self):

    resDict = {}
    resDict['reportResultDataId'] = ''
    resDict['resultLabel'] = ''
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
    resDict['runInterpretation'] = ''
    resDict['wording'] = ''
    resDict['analysisDataId'] = ''
    resDict['resultCode'] = ''

    return resDict

  def createSpecimenDict(self, specimenId):
    specimen = {}
    specimen['specimen'] = specimenId
    specimen['panels'] = []

    return specimen

  def createPanelDict(self, panelCode, panelName='', analysisMethodId='', analysisMethodName=''):

    panel = {}
    panel['name'] = panelName
    panel['code'] = panelCode
    panel['analysisMethodId'] = analysisMethodId
    panel['analysisMethodName'] = analysisMethodName
    panel['overallResult'] = ''
    panel['overallInterpretation'] = ''
    panel['overallWording'] = ''
    panel['tests'] = []

    return panel

  def createTestDict(self, testCode, testName):
    test = {}
    test['name'] = testName
    test['code'] = testCode
    test['results'] = []

    return test

  def createResultDict(self):

    result = {}
    result['reportable'] = 'REPORTABLE'
    result['resultLabel'] = 'RESULT LABEL'
    result['limit'] = 'LIMIT'
    result['units'] = 'UNITS'
    result['dataType'] = 'RESULT DATATYPE'
    result['result'] = 'RESULT'
    result['interpretation'] = 'INTERPRETATION'
    result['wording'] = 'WORDING'
    result['analysisDataId'] = 'ANALYSISDATAID'

    return result

  def createLimitDict(self, upper, lower, discrete):

      limitDict = {}

      limitDict['upperLimit'] = upper
      limitDict['lowerLimit'] = lower
      limitDict['discreteLimit'] = discrete

      return limitDict

  def createWordingDict(self, equalDiscreteWording, notEqualDiscreteWording, belowLowerWording, equalLowerWording, betweenLowerUpperWording, equalUpperWording, aboveUpperWording):

    resultWordingDict = {}
    resultWordingDict['equalDiscreteWording'] = equalDiscreteWording
    resultWordingDict['notEqualDiscreteWording'] = notEqualDiscreteWording
    resultWordingDict['belowLowerWording'] = belowLowerWording 
    resultWordingDict['equalLowerWording'] = equalLowerWording 
    resultWordingDict['betweenLowerUpperWording'] = betweenLowerUpperWording 
    resultWordingDict['equalUpperWording'] = equalUpperWording
    resultWordingDict['aboveUpperWording'] = aboveUpperWording

    return resultWordingDict

  def organizeBySpec(self, rawData):
    ''' Organizes a list of result objects by spec

    Returns:
      specimens: List of organized results
    '''
    specMap =  self.specimenMap()

    for result in rawData:
      specimen = result.get('specimen')
      specMap[specimen].append(result)

    specimens = []
    for spec in specMap:
      if len(specMap[spec]) > 0:
        specObj = self.createSpecimenDict(spec)
        specObj['panels'] = self.organizeByPanel(specMap[spec])
        specimens.append(specObj)
    return specimens

  def organizeByPanel(self, panelList):
    ''' Organizes a list of result objects by panel

    Returns:
      pnlObjLst: List of organized results
    '''

    pnlMap = self.panelMap()
    for panel in panelList:
      pnlCode = panel['panelCode']
      pnlMap[pnlCode].append(panel)

    pnlObjLst = []
    for pnl in pnlMap:
      if len(pnlMap[pnl]) > 0:
        pnlName = pnlMap[pnl][0]['panelName']
        aMethodId = pnlMap[pnl][0]['analysisMethodId']
        aMethodName = pnlMap[pnl][0]['analysisMethodName']
        pnlObj = self.createPanelDict(pnl, pnlName, aMethodId, aMethodName)
        pnlObjLst.append(pnlObj)
        pnlObj['tests'] = self.organizeByTest(pnlMap[pnl])

    return pnlObjLst

  def organizeByTest(self, testList):
    ''' Organizes a list of result objects by test

    Returns:
      tstObjLst: List of organized results
    '''

    tstMap = self.testMap()
    for test in testList:
      tstCode = test['testCode']
      tstMap[tstCode].append(test)

    tstObjList = []
    for tst in tstMap:
      if len(tstMap[tst]) > 0:
        tstName = tstMap[tst][0]['testName']
        tstObj = self.createTestDict(tst, tstName)
        organizedTests = self.organizeByResult(tstMap[tst])
        tstObj['results'] = organizedTests
        tstObjList.append(tstObj)
    return tstObjList

  def sortListByKey(self, listToSort, keyToSortBy):
    return sorted(listToSort, key=itemgetter(keyToSortBy))

  def organizeByResult(self, resultList):
    ''' Organizes a list of result objects by result

    Returns:
      sortedResultList: List of organized results
    '''

    resList = []
    for res in resultList:
      resultDict = self.createResultDict()
      resultDict['reportable'] = res['reportable']
      resultDict['resultLabel'] = res['resultLabel']
      resultDict['limit'] = res['referenceRange']
      resultDict['units'] = res['limitUnits']
      resultDict['dataType'] = res['dataType']
      resultDict['result'] = res['result']
      resultDict['interpretation'] = res['interpretation']
      resultDict['wording'] = res['wording']
      resultDict['testName'] = res['testName']
      resultDict['methodCode'] = res['methodCode']
      resultDict['analysisDataId'] = res['analysisDataId']
      resultDict['reportResultDataId'] = res['reportResultDataId']
      resList.append(resultDict)

    sortedResultList = self.sortListByKey(resList, keyToSortBy='resultLabel') 
    return sortedResultList



  ## HL7 ORGANIZE BY'S

  def organizeBySpecHL7(self, rawData):
    specMap =  self.specimenMap()

    for result in rawData:
      specimen = result.get('specimen')
      specMap[specimen].append(result)

    specimens = []
    for spec in specMap:
      if len(specMap[spec]) > 0:
        specObj = self.createSpecimenDict(spec)
        specObj['panels'] = self.organizeByPanelHL7(specMap[spec])
        specimens.append({'specimen': specObj})
    return specimens


  def organizeByPanelHL7(self, panelList):

    pnlMap = self.panelMap()
    for panel in panelList:
      pnlCode = panel['panelCode']
      pnlMap[pnlCode].append(panel)

    pnlObjLst = []
    for pnl in pnlMap:
      if len(pnlMap[pnl]) > 0:
        pnlName = pnlMap[pnl][0]['panelName']
        aMethodId = pnlMap[pnl][0]['analysisMethodId']
        aMethodName = pnlMap[pnl][0]['analysisMethodName']
        pnlObj = self.createPanelDict(pnl, pnlName, aMethodId, aMethodName)
        pnlObj['tests'] = self.organizeByTestHL7(pnlMap[pnl])
        pnlObjLst.append({'panel': pnlObj})

    return pnlObjLst


  def organizeByTestHL7(self, testList):

    tstMap = self.testMap()
    for test in testList:
      tstCode = test['testCode']
      tstMap[tstCode].append(test)

    tstObjList = []
    for tst in tstMap:
      if len(tstMap[tst]) > 0:
        tstName = tstMap[tst][0]['testName']
        tstObj = self.createTestDict(tst, tstName)
        organizedTests = self.organizeByResultHL7(tstMap[tst])
        tstObj['results'] = organizedTests
        tstObjList.append({'test': tstObj})
    return tstObjList


  def organizeByResultHL7(self, resultList):

    resList = []
    for res in resultList:
      resultDict = self.createResultDict()
      resultDict['reportable'] = res['reportable']
      resultDict['resultLabel'] = res['resultLabel']
      resultDict['limit'] = res['referenceRange']
      resultDict['units'] = res['limitUnits']
      resultDict['dataType'] = res['dataType']
      resultDict['result'] = res['result']
      resultDict['interpretation'] = res['interpretation']
      resultDict['wording'] = res['wording']
      resultDict['testName'] = res['testName']
      resultDict['methodCode'] = res['methodCode']
      resultDict['analysisDataId'] = res['analysisDataId']
      if 'resultCode' in res:
        resultDict['resultCode'] = res['resultCode']
      else:
        resultDict['resultCode'] = ''

      resList.append({'result': resultDict})
    return resList


##### TESTING #####
if __name__== "__main__":

  specLen = 5000
  panlLen = 1000000 
  testLen = 1000000  

  def blankList(i):
    lst = []
    for n in range(i):
      lst.append(n)
    return lst
  
  lst0 = blankList(specLen)
  lst1 = blankList(panlLen)
  lst2 = blankList(testLen)

  organizer = ResultOrganizer(lst0, lst1, lst2)

  ## TEST IN RANGE OF SPECIMEN LIST
  def resLst(s, p, t):
    rLst = []
    for n in range(s):
      rawRes = organizer.createResDict()
      rawRes['specimen'] = s-1
      rawRes['panelCode'] = p-1
      rawRes['testCode']  = t-1
      rLst.append(rawRes)

    return rLst

  rawResLst = resLst(specLen, panlLen, testLen)

  resultsBySpec = organizer.organizeBySpec(rawResLst)

  organizedResults = {'results':resultsBySpec}

  print organizedResults







