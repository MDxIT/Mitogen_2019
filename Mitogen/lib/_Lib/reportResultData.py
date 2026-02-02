'''
  #
  # NOTES: Run analysis result can be retrived from run obj with getAnalysisRes()
  #
  #
'''

from labProcessNode import LabProcess
from run import Run
from csv_functions import *
from buildInformationObject import *

class ReportResultData(infoObject):
  def __init__(self, switchboard, reportId):
    self.switchboard = switchboard
    self.reportId = reportId
    self.repDefVer = self.initResportVer()
    self.analysisResults = []

    self.setResultsByRun()

  def __repr__(self):
    return 'ReportMetaData({!r}, {!r})'.format(self.reportId, self.repDefVer)

  def getReportId(self):
    return self.reportId

  def getRepDefVer(self):
    return self.repDefVer

  def getAnalysisResults(self):
    return self.analysisResults

  def initResportVer(self):
    verId = None

    vQuery = '''
      SELECT reportDefinitionVersionId 
      FROM reportDetails 
      WHERE reportId = ?
    '''

    vStmt = self.switchboard.connection.prepareStatement(vQuery)
    vStmt.setString(1, self.reportId)
    # print 'VSTMT: ', vStmt
    vRs = vStmt.executeQuery()

    while vRs.next():
      verId = vRs.getString(1)
      # print 'VERID: ', verId

    return verId

  '''
    #
    #
    #
  '''
  def getAssocRuns(self):
    
    reportId = self.reportId
    Runs = []

    rQuery = '''
      SELECT
        sr.runId
      FROM reportDetails rd
      INNER JOIN reportSpecimens rs
        ON rd.id = rs.reportDetailsId
      INNER JOIN specimenMethods sm
        ON rs.specimenMethodsId = sm.Id
      INNER JOIN specimenRuns sr
        ON sm.Id = sr.specimenMethodsId
      WHERE rd.reportId = ?
    '''

    rStmt = self.switchboard.connection.prepareStatement(rQuery)
    rStmt.setString(1, reportId)
    rRs = rStmt.executeQuery()

    while rRs.next():
      run = rRs.getString('runId')
      Runs.append(run)
    return Runs

  '''
    #
    #
    #
  '''
  def getAssocRunObjs(self):

    Runs = self.getAssocRuns()
    RunObjs = []

    for run in Runs:
      runObj = Run(self.switchboard, run)
      RunObjs.append(runObj)

    return RunObjs

  '''
    #
    #
    #
  '''
  def getAssocPanels(self):

    reportId = self.reportId
    Panels = []

    pQuery = '''
      SELECT rptDefPan.panelCode
      FROM reportDetails rptDet
      INNER JOIN reportDefinitionPanels rptDefPan
        ON rptDefPan.reportDefinitionVersionId = rptDet.reportDefinitionVersionId
      WHERE rptDet.reportId = ?
    '''
    pStmt = self.switchboard.connection.prepareStatement(pQuery)
    pStmt.setString(1, reportId)
    pRs = pStmt.executeQuery()

    while pRs.next():
      panel = pRs.getString('panelCode')
      Panels.append(panel)
    return Panels

  '''
    #
    #
    #
  '''
  def setResultsByRun(self):
    Runs = self.getAssocRuns()

    for run in Runs:
      self.getAnalysisResultsByRun(run)

  def getAllAnalysisData(self):
    runs = self.getAssocRuns()
    print runs

    for run in runs:
      print run

  '''
    #
    #
    #
  '''
  def getAnalysisResultsByRun(self, runId):

    runResult = ''

    resDict = {}

    resDict['RESULT'] = {}

    resultList = []

    resQuery = '''
      SELECT
        sr.currentContainerId,
        addef.value,
        CASE addef.dataType
          WHEN 'decimal' THEN
            CASE addef.sigFig
              WHEN 0 THEN ROUND(ad.decimalResult, 0)
              WHEN 1 THEN ROUND(ad.decimalResult, 1)
              WHEN 2 THEN ROUND(ad.decimalResult, 2)
              WHEN 3 THEN ROUND(ad.decimalResult, 3)
              WHEN 4 THEN ROUND(ad.decimalResult, 4)
              WHEN 5 THEN ROUND(ad.decimalResult, 5)
              WHEN 6 THEN ROUND(ad.decimalResult, 6)
            END
          WHEN 'varchar' THEN ad.varcharResult
          WHEN 'dateTime' THEN ad.dateTimeResult
        END AS "result",
        addef.dataType AS 'type',
        ad.referenceRange,
        ad.calculatedInterpretation,
        ad.actualInterpretation,
        ad.units,
        amv.analysisMethodsId,
        sm.panelCode,
        sm.testCode,
        addef.report AS 'reportable',
        addef.id AS 'analysisDataDefId',
        adl.discrete,
        adl.upperLimit,
        adl.lowerLimit,
        addef.units AS 'limitUnits',
        addef.resultCode AS 'resultCode' 
      FROM analysisData ad
        INNER JOIN analysisDataRuns adr
          ON ad.analysisDataRunsId = adr.id
        INNER JOIN specimenRuns sr
          ON adr.specimenRunsId = sr.id
        INNER JOIN specimenMethods sm 
          ON sm.id = sr.specimenMethodsId
        INNER JOIN analysisDataDefinition addef
          ON ad.analysisDataDefinitionId = addef.id
        INNER JOIN analysisMethodVersions amv
          ON addef.analysisMethodVersionsId = amv.id
        LEFT JOIN analysisDataLimits adl 
          ON adl.analysisDataDefinitionId = addef.id
        LEFT JOIN analysisDataInterpretation adi 
          ON adi.analysisDataLimitsId = adl.id
      WHERE sr.runId = ?
      AND addef.definerType IN ('data', 'loadData')
    ''' 

    resStmt = self.switchboard.connection.prepareStatement(resQuery)
    resStmt.setString(1, runId)
    resRs = resStmt.executeQuery()

    resIdx = 1

    while resRs.next():

      resDict['RESULT'][resIdx] = {}
      curCont = resRs.getString('currentContainerId')
      result = resRs.getString('result')
      print 'RESULT: ', result
      resultList.append(result)
      resType =  resRs.getString('type')
      aMeth = resRs.getString('analysisMethodsId')
      panelCode =  resRs.getString('panelCode')
      testCode = resRs.getString('testCode')
      print 'TESTCODE: ', testCode
      refRange = resRs.getString('referenceRange')
      calcInterp = resRs.getString('calculatedInterpretation')
      actlInterp = resRs.getString('actualInterpretation')
      units = resRs.getString('units')
      reportable = resRs.getString('reportable')
      discreteLimit = resRs.getString('discrete')
      upperLimit = resRs.getString('upperLimit')
      lowerLimit = resRs.getString('lowerLimit')
      limitUnits = resRs.getString('limitUnits')

      resDict['RESULT'][resIdx]['runId'] = runId
      resDict['RESULT'][resIdx]['currentContainer'] = curCont
      resDict['RESULT'][resIdx]['result'] = result
      resDict['RESULT'][resIdx]['type'] = resType
      resDict['RESULT'][resIdx]['analysisMethod'] = aMeth
      resDict['RESULT'][resIdx]['panelCode'] = panelCode
      resDict['RESULT'][resIdx]['testCode'] = testCode
      resDict['RESULT'][resIdx]['referenceRange'] = refRange
      resDict['RESULT'][resIdx]['calculatedInterpretation'] = calcInterp
      resDict['RESULT'][resIdx]['actualInterpretation'] = actlInterp
      resDict['RESULT'][resIdx]['units'] = units
      resDict['RESULT'][resIdx]['reportable'] = reportable
      resDict['RESULT'][resIdx]['discreteLimit'] = discreteLimit
      resDict['RESULT'][resIdx]['upperLimit'] = upperLimit
      resDict['RESULT'][resIdx]['lowerLimit'] = lowerLimit
      resDict['RESULT'][resIdx]['limitUnits'] = limitUnits
      resIdx += 1

    self.analysisResults.append(resDict)
    print resDict
    print resultList


  '''
    #
    #
    #
  '''
  def getDict(self):

    repDict = dict()

    repDict['reportId'] = self.reportId
    repDict['analysisResults'] = self.analysisResults
    repDict['reportVer'] = self.repDefVer

    return repDict

  def getReportableResults(self):
    Results = self.analysisResults
    ReportableResults = []

    for result in Results:
      thisResult = result['RESULT']
      reportingType = thisResult['reportable']

      if reportingType == 'reportBoth':
        ReportableResults.append(thisResult)

    print len(ReportableResults)
    return ReportableResults

  def getWording(self):
    print 'toDo: Get wording based on addef id'

  '''
    #
    #
    #
  '''
  # @overrides the buildNode function inherited from infoObject
  def buildNode(self, nodeName, resultDict):

    resIdx = 1
    reportId = self.getReportId()
    dataTree = self.Node(nodeName, reportId)

    for result in resultDict['analysisResults']:
      thisResNode = dataTree.add('result', str(resIdx))

      thisRes = result['RESULT']

      runResIdx = 1
      while runResIdx <= len(thisRes):
        print 'TESTHERE', runResIdx
        print 'THISRESULT:', thisRes[runResIdx]
        runResIdx += 1

      # reportable = thisRes['reportable']

      # print 'REPORTABLE: ', reportable
      print '--START'

      # ## VARS
      # curCon = thisRes['currentContainer']
      # curRes = thisRes['result']
      # cRsTyp = thisRes['type']
      # anMeth = thisRes['analysisMethod']
      # panlCd = thisRes['panelCode']
      # testCd = thisRes['testCode']
      # refRng = thisRes['referenceRange']
      # cInter = thisRes['calculatedInterpretation']
      # aInter =  thisRes['actualInterpretation']
      # units = thisRes['units']

      # ## TEST VARS
      # print curCon
      # print curRes
      # print cRsTyp
      # print anMeth
      # print panlCd
      # print testCd
      # # print cInter
      # # print refRng
      # # print aInter
      # # print units

      # if reportable in ['reportBoth']:

      #   ## ADD TO TREE
      #   thisResNode.add('containerId', curCon)
      #   thisResNode.add('result', curRes)
      #   thisResNode.add('type', cRsTyp)
      #   thisResNode.add('analysisMethod', anMeth)
      #   thisResNode.add('panel', panlCd)
      #   thisResNode.add('test', testCd)      
      #   addIfExists(thisResNode, 'referenceRange', refRng)
      #   addIfExists(thisResNode, 'calculatedInterpretation', cInter)
      #   addIfExists(thisResNode, 'actualInterpretation', aInter)
      #   addIfExists(thisResNode, 'units', units)

      # print '--END'
      resIdx += 1

    print dataTree

def addIfExists(parentNode, nodeName, value):
  if value not in ['', None]:
    parentNode.add(nodeName, value)


























