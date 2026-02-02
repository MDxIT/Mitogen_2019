from com.uniconnect.uniflow.exception import SystemException
from java.sql import SQLException
from containers import GroupingContainer
from analysis_functions import getRunMetaData
import csv
import json

class ManualDownload(GroupingContainer):

  def __init__(self, switchboard, containerId):
    GroupingContainer.__init__(self, switchboard, containerId)

  def writeCsv(self, methodVer, filePath):

    listToWrite = self.processCSV(methodVer)

    try:
      with open(filePath, 'w') as f:
        writer = csv.writer(f, dialect='excel')
        writer.writerows(listToWrite)

      self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'true')
    except:
      self.switchboard.log("---*** UNSPECIFIED ERROR AT WRITECSV ***---")
      self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')

  def processCSV(self, methodVer):
    
    run_ids = self.getRunIds()
    ctl_ids = self.getControlRunIds()
    csv_arr = []

    for ctl_run in ctl_ids:
      ctl_config = self.getConfigByCtlRun(ctl_run, methodVer)
      ctl_row = self.makeCtlRow(ctl_config, ctl_run)
      csv_arr.append(ctl_row)

    for run in run_ids:
      run_config = self.getConfigByRun(run, methodVer)
      run_row = self.makeRow(run_config, run)
      csv_arr.append(run_row)

    return csv_arr

  def getConfigByRun(self, runId, methodVer):
    jsonQuery = '''
      SELECT
        CASE andd.definerType
          WHEN 'metaData' 
            THEN JSON_OBJECT('order', andd.sequence, 'value', fcp.inputName, 'valType', 'metaData') 
          WHEN 'loadData'
            THEN JSON_OBJECT('order', andd.sequence, 'value', andd.dataType, 'valType', 'loadData', 'loadDataDefId', andd.loadDataAnalysisDataDefinitionId)
          WHEN 'specimenColumn'
            THEN JSON_OBJECT('order', andd.sequence, 'value', sr.currentContainerId, 'valType', 'specimenId')
          WHEN 'locationColumn'
            THEN JSON_OBJECT('order', andd.sequence, 'value', sr.currentParentPosition, 'valType', 'specimenLocation')
          END AS 'thisJSON'
      FROM analysisDataDefinition andd
      INNER JOIN specimenRuns sr ON sr.runId = ?
      LEFT JOIN formInputSettings fis ON fis.id = andd.formInputSettingsId
      LEFT JOIN formConfigurableParts fcp ON fcp.id = fis.formConfigurablePartsId
      LEFT JOIN analysisData ad ON ad.analysisDataDefinitionId = andd.id
      WHERE andd.analysisMethodVersionsId = ?
      ORDER BY andd.sequence
    ''' 

    try:
      jsonQueryStmt = self.switchboard.connection.prepareStatement(jsonQuery)
      jsonQueryStmt.setString(1, runId)
      jsonQueryStmt.setString(2, methodVer)

      jsonRs = jsonQueryStmt.executeQuery()

      runConfig = []

      while jsonRs.next():

        config = json.loads(jsonRs.getString('thisJSON'))

        runConfig.append(config)

      self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'true')
      return runConfig   

    except SQLException as e:
      self.switchboard.log("---*** SQLException AT GETCONFIGBYRUN ***----")
      self.switchboard.log("ERROR MESSAGE: " + str(e.message))
      self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')
      raise
      return
  
  def getConfigByCtlRun(self, ctlRunId, methodVer):

    ctlConfig = []

    jsonQuery = '''
      SELECT
        CASE andd.definerType
          WHEN 'metaData' 
            THEN JSON_OBJECT('order', andd.sequence, 'value', fcp.inputName, 'valType', 'metaData') 
          WHEN 'loadData'
            THEN JSON_OBJECT('order', andd.sequence, 'value', andd.dataType, 'valType', 'loadData', 'loadDataDefId', andd.loadDataAnalysisDataDefinitionId)
          WHEN 'specimenColumn'
            THEN JSON_OBJECT('order', andd.sequence, 'value', cr.currentContainerId, 'valType', 'specimenId')
          WHEN 'locationColumn'
            THEN JSON_OBJECT('order', andd.sequence, 'value', cr.currentParentPosition, 'valType', 'specimenLocation')
          END AS 'thisJSON'
      FROM analysisDataDefinition andd
      INNER JOIN controlRuns cr ON cr.controlRunId = ?
      LEFT JOIN formInputSettings fis ON fis.id = andd.formInputSettingsId
      LEFT JOIN formConfigurableParts fcp ON fcp.id = fis.formConfigurablePartsId
      LEFT JOIN analysisData ad ON ad.analysisDataDefinitionId = andd.id
      WHERE andd.analysisMethodVersionsId = ?
      ORDER BY andd.sequence
    '''
    try:
      jsonStmt = self.switchboard.connection.prepareStatement(jsonQuery)
      jsonStmt.setString(1, ctlRunId)
      jsonStmt.setString(2, methodVer)
      jsonRs = jsonStmt.executeQuery()

      while jsonRs.next():
        config = json.loads(jsonRs.getString('thisJSON'))
        ctlConfig.append(config)

      jsonRs.close()
      jsonStmt.close()

      self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'true')
      return ctlConfig

    except SQLException as e:
      self.switchboard.log("---*** SQLException AT GETCONFIGBYCTLRUN ***----")
      self.switchboard.log("ERROR MESSAGE: " + str(e.message))
      self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')
      raise
      return

  def makeRow(self, passedJson, runId):
    rowArr = []

    try:
      for item in passedJson:
        if item['valType'] == 'specimenId':
          specId = item['value']
          rowArr.append(specId)
        elif item['valType'] == 'specimenLocation':
          specLoc = item['value']
          rowArr.append(specLoc)
        elif item['valType'] == 'loadData':
          loadDataType = item['value']
          loadDataDefId = item['loadDataDefId']
          loadVal = self.getLoadVal(loadDataDefId, runId)
          rowArr.append(loadVal)
        elif item['valType'] == 'metaData':
          metaDataField = item['value']
          metaDataVal = getRunMetaData(self.switchboard, metaDataField, runId)
          rowArr.append(metaDataVal)

      self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'true')
      return rowArr

    except KeyError as e:
      self.switchboard.log("---*** KEY ERROR AT MAKEROW ***---")
      self.switchboard.log("ERROR MESSAGE: " + str(e.message))
      self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')
      raise
      return
    except TypeError as e:
      self.switchboard.log("---*** TYPE ERROR AT MAKEROW ***----")
      self.switchboard.log("ERROR MESSAGE: " + str(e.message))
      self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')
      raise
      return

  def makeCtlRow(self, passedJson, ctlRunId):
    rowArr = []
    try:

      for item in passedJson:
        if item['valType'] == 'specimenId':
          specId = item['value']
          rowArr.append(specId)
        elif item['valType'] == 'specimenLocation':
          specLoc = item['value']
          rowArr.append(blankIfNull(specLoc))
        elif item['valType'] == 'loadData':
          loadDataType = item['value']
          loadDataDefId = item['loadDataDefId']
          loadVal = getCtlLoadVal(switchboard, loadDataDefId, ctlRunId)
          rowArr.append(loadVal)
        elif item['valType'] == 'metaData':
          metaDataVal = ''
          rowArr.append(metaDataVal)

      self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'true')
      return rowArr
      
    except KeyError as e:
      self.switchboard.log("---*** KEY ERROR AT MAKECTLROW ***---")
      self.switchboard.log("ERROR MESSAGE: " + str(e.message))
      self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')
      raise
      return
    except TypeError as e:
      self.switchboard.log("---*** TYPE ERROR AT MAKECTLROW ***----")
      self.switchboard.log("ERROR MESSAGE: " + str(e.message))
      self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')
      raise
      return

  def getLoadVal(self, dataDefId, runId):
    thisResult = ''

    resultQuery = '''
      SELECT
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
          END AS "result"
      FROM analysisData ad
        INNER JOIN analysisDataRuns adr
          ON ad.analysisDataRunsId = adr.id
        INNER JOIN specimenRuns sr
          ON adr.specimenRunsId = sr.id
        INNER JOIN analysisDataDefinition addef
          ON ad.analysisDataDefinitionId = addef.id
      WHERE sr.runId = ?
        AND ad.analysisDataDefinitionId = ?
    ''' 

    try:

      loadValQuery = self.switchboard.connection.prepareStatement(resultQuery)
      loadValQuery.setString(1, runId)
      loadValQuery.setString(2, str(dataDefId))

      rawResult = loadValQuery.executeQuery()

      while rawResult.next():
        thisResult = rawResult.getString(1)

      loadValQuery.close()

      self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'true')
      return thisResult

    except SQLException as e:
      self.switchboard.log("---*** SQLException AT GETLOADVAL ***----")
      self.switchboard.log("ERROR MESSAGE: " + str(e.message))
      self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')
      raise
      return

def blankIfNull(value):
  if value == None:
    return ''
  else:
    return value
