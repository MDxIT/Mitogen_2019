from com.uniconnect.uniflow.exception import SystemException
from java.sql import SQLException
import json
import re


def getRunMetaData(switchboard, fieldName, runId):

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
            `rs`.`specimenSource` AS `specimenSource`,
            `rs`.`sampleContainerCategory` AS `containerType`,
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
        mStmt = switchboard.connection.prepareStatement(mQuery)
        mStmt.setString(1, runId)
        switchboard.log(str(mStmt))
        mRs = mStmt.executeQuery()

        while mRs.next():
            metaDataVal = mRs.getString(fieldName)

        mStmt.close()

        switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'true')
        return metaDataVal

    except SQLException as e:
        switchboard.log("---*** SQLException AT GETRUNMETADATA ***----")
        switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')
        if re.search('^Column.* not found.', str(e.message)):
            switchboard.log("META DATA FIELD MISSING FROM QUERY: " + str(e.message))
        else:
            raise
            return
