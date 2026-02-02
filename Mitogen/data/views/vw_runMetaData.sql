DROP VIEW IF EXISTS vw_runmetadata;

CREATE VIEW vw_runmetadata
AS
select 
    `sr`.`runId` AS `runId`,
    `rf`.`requestId` AS `requestId`,
    `rf`.`externalRequestId` AS `externalRequestId`,
    `os`.`name` AS `physicianSiteId`,
    concat(`ph`.`last_name`,', ',`ph`.`first_name`) AS `physicianId`,
    `rf`.`receivedDate` AS `orderInfoReceivedDate`,
    ifnull(`priority`.`displayValue`,'') AS `priority`,
    ifnull(`extSystems`.`displayValue`,'') AS `externalSystem`,
    `dept`.`name` AS `department`,
    `loc`.`name` AS `location`,
    ifnull(group_concat(`cn`.`note` separator ','),'') AS `orderComment`,
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
    concat(`gc`.`last_name`,', ',`gc`.`first_name`) AS `geneticCounselor`,
    `ci`.`clinicalHistory` AS `clinicalHistory`,
    group_concat(distinct `currentMedications`.`name` separator ',') AS `currentMedications`,
    group_concat(distinct `problematicMedications`.`name` separator ',') AS `problematicMedications`,
    group_concat(distinct `drugAllergies`.`name` separator ',') AS `drugAllergies`,
    `ci`.`dateOfLastPSA` AS `dateOfLastPSA`,
    `ci`.`lastPSA` AS `lastPSA`,
    `ci`.`percentFreePSA` AS `percentFreePSA`,
    `ci`.`dateOfLastDRE` AS `dateOfLastDRE`,
    `ci`.`lastDREResults` AS `lastDREResults`,
    `ci`.`biopsyHistoryNumber` AS `biopsyHistoryNumber`,
    `ci`.`biopsyHistoryOther` AS `biopsyHistoryOther`,
    `ci`.`histopathologyFindings` AS `histopathologyFindings`,
    `ci`.`lastMenstrualCycle` AS `lastMenstrualCycle`,
    (case `ci`.`pregnant` when 1 then concat('Yes: ',`ci`.`pregnantComments`) else 'No' end) AS `pregnant`,
    `ci`.`lastPregnancy` AS `lastPregnancy`,
    (case `ci`.`hysterectomy` when 1 then concat('Yes: ',`ci`.`hysterectomyComments`) else 'No' end) AS `hysterectomy`,
    (case `ci`.`miscarriages` when 1 then concat('Yes: ',`ci`.`miscarriagesComments`) else 'No' end) AS `miscarriages`,
    (case `ci`.`thyroidIssues` when 1 then concat('Yes: ',`ci`.`thyroidIssuesComments`) else 'No' end) AS `thyroidIssues`,
    `ci`.`birthWeight` AS `birthWeight`,
    (case `ci`.`meconiumIleus` when 1 then concat('Yes: ',`ci`.`meconiumIleusComments`) else 'No' end) AS `meconiumIleus`,
    `ci`.`prePostTransfusion` AS `prePostTransfusion`,
    (case `ci`.`ambiguousGenitalia` when 1 then concat('Yes: ',`ci`.`ambiguousGenitaliaComments`) else 'No' end) AS `ambiguousGenitalia`,
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
    (case `ci`.`repeatSample` when 1 then 'Yes' else 'No' end) AS `repeatSample`,
    (case `ci`.`familyHistoryCF` when 1 then concat('Yes: ',`ci`.`familyHistoryCFComments`) else 'No' end) AS `familyHistoryCF`,
    `ci`.`donorOrRecipient` AS `donorOrRecipient`,
    `ci`.`transfusionHistory` AS `transfusionHistory`,
    `ci`.`bloodType` AS `bloodType`,
    `ci`.`transfusionTransplantHistory` AS `transfusionTransplantHistory`,
    `rs`.`expectedBarcode` AS `expectedBarcode`,
    `rs`.`externalIdentifier` AS `externalIdentifier`,
    `rs`.`specimenType` AS `specimenType`,
    `rs`.`collectionDate` AS `collectionDate`,
    `rs`.`collectionTime` AS `collectionTime`,
    (case `rf`.`consent` when 1 then 'Yes' else 'No' end) AS `consent`,
    (case `rf`.`patientSignature` when 1 then 'Yes' else 'No' end) AS `patientSignature`,
    `rf`.`consentBy` AS `consentBy`,
    `rf`.`consenteePatientRelationship` AS `consenteePatientRelationship`,
    `rf`.`patientSignatureDate` AS `patientSignatureDate`,
    (case `rf`.`physicianSignature` when 1 then 'Yes' else 'No' end) AS `physicianSignature`,
    `rf`.`physicianSignatureDate` AS `physicianSignatureDate`,
    `rf`.`physicianComment` AS `physicianComment` 
    from `specimenRuns` `sr` 
    inner join `contents` `c` 
        on `sr`.`runId` = `c`.`content` 
        and `c`.`attribute` = 'run' 
    join `contents` `c2` 
        on `c`.`containerId` = `c2`.`containerId` 
        and `c2`.`contentType` = 'requestId'
    join `contents` `c3` 
        on `sr`.`currentContainerId` = `c3`.`containerId` 
        and `c3`.`contentType` = 'specimenId'
    join `requestForms` `rf` 
        on `c2`.`content` = `rf`.`requestId` 
    left join `organizationSites` `dept` 
        on `rf`.`departmentId` = `dept`.`siteId` 
    left join `organizationSites` `loc` 
        on `rf`.`locationId` = `loc`.`siteId` 
    join `physicians` `ph` 
        on `rf`.`physicianId` = `ph`.`physicianId`
    join `organizationSites` `os` 
        on `rf`.`physicianSiteId` = `os`.`siteId` 
    join `patients` `pa` 
        on `rf`.`patientId` = `pa`.`patientId` 
    join `requestSpecimens` `rs` 
        on `c3`.`content` = `rs`.`specimenId` 
    join `specimenMethods` `sm` 
        on `sr`.`specimenMethodsId` = `sm`.`id` 
    left join `panels` `pan` 
        on `sm`.`panelCode` = `pan`.`panelCode` 
    left join `tests` `t` 
        on `sm`.`testCode` = `t`.`testCode` 
    left join `methods` `m` 
        on `sm`.`methodCode` = `m`.`methodCode` 
    left join `containerNotes` `cn` 
        on`rf`.`requestId` = `cn`.`containerId` 
        and `cn`.`note` is not null 
    left join `clinicalInformation` `ci` 
        on `rf`.`requestId` = `ci`.`requestId` 
    left join `physicians` `gc` 
        on `ci`.`geneticCounselor` = `gc`.`physicianId` 
        and `gc`.`providerType` = 'Genetic Counselor' 
    left join `clinicalInformationDrugs` `cidcm` 
        on `rf`.`requestId` = `cidcm`.`requestId` 
        and `cidcm`.`type` = 'currentMedications' 
    left join `drugs` `currentMedications` 
        on `cidcm`.`drugId` = `currentMedications`.`id` 
    left join `clinicalInformationDrugs` `cidpm` 
        on `rf`.`requestId` = `cidpm`.`requestId` 
        and `cidpm`.`type` = 'problematicMedications' 
    left join `drugs` `problematicMedications` 
        on `cidpm`.`drugId` = `problematicMedications`.`id`
    left join `clinicalInformationDrugs` `cidda` 
        on `rf`.`requestId` = `cidda`.`requestId` 
        and `cidda`.`type` = 'drugAllergies' 
    left join `drugs` `drugAllergies` 
        on `cidda`.`drugId` = `drugAllergies`.`id` 
    left join `containerFiles` `cf` 
        on `rf`.`requestId` = `cf`.`containerId` 
    left join `reportDistribution` `rd` 
        on `rf`.`requestId` = `rd`.`requestId` 
    left join `patientBilling` `pb` 
        on `rf`.`requestId` = `pb`.`requestId` 
    left join `validValues` `priority` 
        on `rf`.`priority` = `priority`.`value` 
        and `priority`.`setName` = 'priority' 
    left join `validValues` `extSystems` 
        on `rf`.`externalSystem` = `extSystems`.`value` 
        and `extSystems`.`setName` = 'External Systems' 
    group by `sr`.`runId` 
    order by `sr`.`id`
