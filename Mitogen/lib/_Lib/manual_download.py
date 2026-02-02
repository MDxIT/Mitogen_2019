from com.uniconnect.uniflow.exception import SystemException
from java.sql import SQLException
from containers import GroupingContainer
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
          metaDataVal = self.getRunMetaData(metaDataField, runId)
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


  def getRunMetaData(self, fieldName, runId):

    metaDataVal = ''

    mQuery = '''
      SELECT 
          `sr`.`runId` AS `runId`,
          `rf`.`requestId` AS `requestId`,
          `rf`.`externalRequestId` AS `externalRequestId`,
          `os`.`name` AS `physicianSiteId`,
          CONCAT(`ph`.`last_name`,', ',`ph`.`first_name`) AS `physicianId`,
          `rf`.`receivedDate` AS `orderInfoReceivedDate`,
          IFNULL(`priority`.`displayValue`,'') AS `priority`,
          IFNULL(`extSystems`.`displayValue`,'') AS `externalSystem`,
          `dept`.`name` AS `department`,
          `loc`.`name` AS `location`,
          IFNULL(GROUP_CONCAT(`cn`.`note` separator ','),'') AS `orderComment`,
          `pa`.`firstName` AS `firstName`,
          `pa`.`middleName` AS `middleName`,
          `pa`.`lastName` AS `lastName`,
          `pa`.`dob` AS `dob`,
          `rf`.`mrn` AS `mrn`,
          `pa`.`govtId` AS `govtId`,
          `pa`.`geneticGender` AS `geneticGender`,
          `pa`.`genderId` AS `genderId`,
          `pa`.`ethnicity` AS `ethnicity`,
          `pa`.`address1` AS `addressLine1`,
          `pa`.`address2` AS `addressLine2`,
          `pa`.`city` AS `city`,
          `pa`.`state` AS `state`,
          `pa`.`postalCode` AS `postalCode`,
          `pa`.`country` AS `country`,
          `pa`.`phone1CountryCode` AS `homePhoneCountryCode`,
          `pa`.`phone1` AS `homePhone`,
          `pa`.`phone2CountryCode` AS `workPhoneCountryCode`,
          `pa`.`phone2` AS `workPhone`,
          `pa`.`phone3CountryCode` AS `mobilePhoneCountryCode`,
          `pa`.`phone3` AS `mobilePhone`,
          `pa`.`email` AS `email`,
          `ci`.`ageAtInitialPresentation` AS `ageAtInitialPresentation`,
          `ci`.`clinicalNotes` AS `clinicalNotes`,
          CONCAT(`gc`.`last_name`,', ',`gc`.`first_name`) AS `geneticCounselor`,
          `ci`.`clinicalHistory` AS `clinicalHistory`,
          GROUP_CONCAT(distinct `currentMedications`.`name` separator ',') AS `currentMedications`,
          GROUP_CONCAT(distinct `problematicMedications`.`name` separator ',') AS `problematicMedications`,
          GROUP_CONCAT(distinct `drugAllergies`.`name` separator ',') AS `drugAllergies`,
          `ci`.`dateOfLastPSA` AS `dateOfLastPSA`,
          `ci`.`lastPSA` AS `lastPSA`,
          `ci`.`percentFreePSA` AS `percentFreePSA`,
          `ci`.`dateOfLastDRE` AS `dateOfLastDRE`,
          `ci`.`lastDREResults` AS `lastDREResults`,
          `ci`.`biopsyHistoryNumber` AS `biopsyHistoryNumber`,
          `ci`.`biopsyHistoryOther` AS `biopsyHistoryOther`,
          `ci`.`histopathologyFindings` AS `histopathologyFindings`,
          `ci`.`lastMenstrualCycle` AS `lastMenstrualCycle`,
          (CASE `ci`.`pregnant` when 1 then CONCAT('Yes: ',`ci`.`pregnantComments`) else 'No' end) AS `pregnant`,
          `ci`.`lastPregnancy` AS `lastPregnancy`,
          (CASE `ci`.`hysterectomy` when 1 then CONCAT('Yes: ',`ci`.`hysterectomyComments`) else 'No' end) AS `hysterectomy`,
          (CASE `ci`.`miscarriages` when 1 then CONCAT('Yes: ',`ci`.`miscarriagesComments`) else 'No' end) AS `miscarriages`,
          (CASE `ci`.`thyroidIssues` when 1 then CONCAT('Yes: ',`ci`.`thyroidIssuesComments`) else 'No' end) AS `thyroidIssues`,
          `ci`.`birthWeight` AS `birthWeight`,
          (CASE `ci`.`meconiumIleus` when 1 then CONCAT('Yes: ',`ci`.`meconiumIleusComments`) else 'No' end) AS `meconiumIleus`,
          `ci`.`prePostTransfusion` AS `prePostTransfusion`,
          (CASE `ci`.`ambiguousGenitalia` when 1 then CONCAT('Yes: ',`ci`.`ambiguousGenitaliaComments`) else 'No' end) AS `ambiguousGenitalia`,
          `ci`.`motherFullName` AS `motherFullName`,
          `ci`.`dateOfFirstMilk` AS `dateOfFirstMilk`,
          `ci`.`timeOfFirstMilk` AS `timeOfFirstMilk`,
          `ci`.`feedingHistory` AS `feedingHistory`,
          `ci`.`clinicalHistoryOfMother` AS `clinicalHistoryOfMother`,
          `ci`.`placeOfBirth` AS `placeOfBirth`,
          `ci`.`birthTime` AS `birthTime`,
          `ci`.`locationOfSampling` AS `locationOfSampling`,
          `ci`.`babyIdentifyingNumber` AS `babyIdentifyingNumber`,
          `ci`.`privatePublicPatient` AS `privatePublicPatient`,
          `ci`.`referringDoctor` AS `referringDoctor`,
          (CASE `ci`.`repeatSample` when 1 then 'Yes' else 'No' end) AS `repeatSample`,
          (CASE `ci`.`familyHistoryCF` when 1 then CONCAT('Yes: ',`ci`.`familyHistoryCFComments`) else 'No' end) AS `familyHistoryCF`,
          `ci`.`donorOrRecipient` AS `donorOrRecipient`,
          `ci`.`transfusionHistory` AS `transfusionHistory`,
          `ci`.`bloodType` AS `bloodType`,
          `ci`.`transfusionTransplantHistory` AS `transfusionTransplantHistory`,
          `rs`.`expectedBarcode` AS `expectedBarcode`,
          `rs`.`externalIdentifier` AS `externalIdentifier`,
          `rs`.`specimenType` AS `specimenType`,
          `rs`.`collectionDate` AS `collectionDate`,
          `rs`.`collectionTime` AS `collectionTime`,
          (CASE `rf`.`consent` when 1 then 'Yes' else 'No' end) AS `consent`,
          (CASE `rf`.`patientSignature` when 1 then 'Yes' else 'No' end) AS `patientSignature`,
          `rf`.`consentBy` AS `consentBy`,
          `rf`.`consenteePatientRelationship` AS `consenteePatientRelationship`,
          `rf`.`patientSignatureDate` AS `patientSignatureDate`,
          (CASE `rf`.`physicianSignature` when 1 then 'Yes' else 'No' end) AS `physicianSignature`,
          `rf`.`physicianSignatureDate` AS `physicianSignatureDate`,
          `rf`.`physicianComment` AS `physicianComment` 
          FROM `specimenRuns` `sr` 
          INNER JOIN `contents` `c` 
              ON `sr`.`runId` = `c`.`content` 
              AND `c`.`attribute` = 'run' 
          JOIN `contents` `c2` 
              ON `c`.`containerId` = `c2`.`containerId` 
              AND `c2`.`contentType` = 'requestId'
          JOIN `contents` `c3` 
              ON `sr`.`currentContainerId` = `c3`.`containerId` 
              AND `c3`.`contentType` = 'specimenId'
          JOIN `requestForms` `rf` 
              ON `c2`.`content` = `rf`.`requestId` 
          LEFT JOIN `organizationSites` `dept` 
              ON `rf`.`departmentId` = `dept`.`siteId` 
          LEFT JOIN `organizationSites` `loc` 
              ON `rf`.`locationId` = `loc`.`siteId` 
          JOIN `physicians` `ph` 
              ON `rf`.`physicianId` = `ph`.`physicianId`
          JOIN `organizationSites` `os` 
              ON `rf`.`physicianSiteId` = `os`.`siteId` 
          JOIN `patients` `pa` 
              ON `rf`.`patientId` = `pa`.`patientId` 
          JOIN `requestSpecimens` `rs` 
              ON `c3`.`content` = `rs`.`specimenId` 
          JOIN `specimenMethods` `sm` 
              ON `sr`.`specimenMethodsId` = `sm`.`id` 
          LEFT JOIN `panels` `pan` 
              ON `sm`.`panelCode` = `pan`.`panelCode` 
          LEFT JOIN `tests` `t` 
              ON `sm`.`testCode` = `t`.`testCode` 
          LEFT JOIN `methods` `m` 
              ON `sm`.`methodCode` = `m`.`methodCode` 
          LEFT JOIN `containerNotes` `cn` 
              ON`rf`.`requestId` = `cn`.`containerId` 
              AND `cn`.`note` is not null 
          LEFT JOIN `clinicalInformation` `ci` 
              ON `rf`.`requestId` = `ci`.`requestId` 
          LEFT JOIN `physicians` `gc` 
              ON `ci`.`geneticCounselor` = `gc`.`physicianId` 
              AND `gc`.`providerType` = 'Genetic Counselor' 
          LEFT JOIN `clinicalInformationDrugs` `cidcm` 
              ON `rf`.`requestId` = `cidcm`.`requestId` 
              AND `cidcm`.`type` = 'currentMedications' 
          LEFT JOIN `drugs` `currentMedications` 
              ON `cidcm`.`drugId` = `currentMedications`.`id` 
          LEFT JOIN `clinicalInformationDrugs` `cidpm` 
              ON `rf`.`requestId` = `cidpm`.`requestId` 
              AND `cidpm`.`type` = 'problematicMedications' 
          LEFT JOIN `drugs` `problematicMedications` 
              ON `cidpm`.`drugId` = `problematicMedications`.`id`
          LEFT JOIN `clinicalInformationDrugs` `cidda` 
              ON `rf`.`requestId` = `cidda`.`requestId` 
              AND `cidda`.`type` = 'drugAllergies' 
          LEFT JOIN `drugs` `drugAllergies` 
              ON `cidda`.`drugId` = `drugAllergies`.`id` 
          LEFT JOIN `containerFiles` `cf` 
              ON `rf`.`requestId` = `cf`.`containerId` 
          LEFT JOIN `reportDistribution` `rd` 
              ON `rf`.`requestId` = `rd`.`requestId` 
          LEFT JOIN `patientBilling` `pb` 
              ON `rf`.`requestId` = `pb`.`requestId` 
          LEFT JOIN `validValues` `priority` 
              ON `rf`.`priority` = `priority`.`value` 
              AND `priority`.`setName` = 'priority' 
          LEFT JOIN `validValues` `extSystems` 
              ON `rf`.`externalSystem` = `extSystems`.`value` 
              AND `extSystems`.`setName` = 'External Systems' 
          WHERE sr.runId = ?
    '''
    try:
      mStmt = self.switchboard.connection.prepareStatement(mQuery)
      mStmt.setString(1, runId)
      mRs = mStmt.executeQuery()

      while mRs.next():
        metaDataVal = mRs.getString(fieldName)

      mStmt.close()

      self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'true')
      return metaDataVal

    except SQLException as e:
      self.switchboard.log("---*** SQLException AT GETRUNMETADATA ***----")
      self.switchboard.log("ERROR MESSAGE: " + str(e.message))
      self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')
      raise
      return

def blankIfNull(value):
  if value == None:
    return ''
  else:
    return value
