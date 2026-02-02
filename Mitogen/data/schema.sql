/*
 LIMS v3.0 schema
*/

SET NAMES utf8mb4;
SET character_set_client = 'utf8mb4';
SET character_set_connection = 'utf8mb4';
SET character_set_database = 'utf8mb4';
SET character_set_results = 'utf8mb4';
SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

-- ----------------------------
-- Drop tables
-- ----------------------------
DROP TABLE IF EXISTS `adapterSequences`;
DROP TABLE IF EXISTS `analysisData`;
DROP TABLE IF EXISTS `analysisDataDefinition`;
DROP TABLE IF EXISTS `analysisDataInterpretation`;
DROP TABLE IF EXISTS `analysisDataInterpretationCSSClass`;
DROP TABLE IF EXISTS `analysisDataLimits`;
DROP TABLE IF EXISTS `analysisDataModifierLinks`;
DROP TABLE IF EXISTS `analysisDataModifierOptions`;
DROP TABLE IF EXISTS `analysisDataRunInterpretation`;
DROP TABLE IF EXISTS `analysisDataRuns`;
DROP TABLE IF EXISTS `analysisMethods`;
DROP TABLE IF EXISTS `analysisMethodVersions`;
DROP TABLE IF EXISTS `analyteLinks`;
DROP TABLE IF EXISTS `analytes`;
DROP TABLE IF EXISTS `batchProcessingMMAssignment`;
DROP TABLE IF EXISTS `capChecklist`;
DROP TABLE IF EXISTS `client`;
DROP TABLE IF EXISTS `clientAddress`;
DROP TABLE IF EXISTS `clinicalInformation`;
DROP TABLE IF EXISTS `clinicalInformationDrugs`;
DROP TABLE IF EXISTS `cmaGeneResults`;
DROP TABLE IF EXISTS `cmaRawResults`;
DROP TABLE IF EXISTS `cmaRawResultsHistory`;
DROP TABLE IF EXISTS `cmaResults`;
DROP TABLE IF EXISTS `cmaResultsHistory`;
DROP TABLE IF EXISTS `consumables`;
DROP TABLE IF EXISTS `consumablesHistory`;
DROP TABLE IF EXISTS `controlHistory`;
DROP TABLE IF EXISTS `controlLimits`;
DROP TABLE IF EXISTS `controlResults`;
DROP TABLE IF EXISTS `controls`;
DROP TABLE IF EXISTS `controlsExpectedSNP`;
DROP TABLE IF EXISTS `countries`;
DROP TABLE IF EXISTS `customerCommunications`;
DROP TABLE IF EXISTS `delDupReviewResults`;
DROP TABLE IF EXISTS `deleteStorageTemp`;
DROP TABLE IF EXISTS `diagnosticCodes`;
DROP TABLE IF EXISTS `documentAssignments`;
DROP TABLE IF EXISTS `documentRecords`;
DROP TABLE IF EXISTS `documentRecordsHistory`;
DROP TABLE IF EXISTS `documentUserAssignments`;
DROP TABLE IF EXISTS `documentUserHistory`;
DROP TABLE IF EXISTS `documentVersionAssignments`;
DROP TABLE IF EXISTS `documentVersionAssignmentsHistory`;
DROP TABLE IF EXISTS `documentVersions`;
DROP TABLE IF EXISTS `documents`;
DROP TABLE IF EXISTS `drugs`;
DROP TABLE IF EXISTS `fishAnalysis`;
DROP TABLE IF EXISTS `fishCaseResults`;
DROP TABLE IF EXISTS `fishCaseResultsFinal`;
DROP TABLE IF EXISTS `fishCaseResultsFinalHistory`;
DROP TABLE IF EXISTS `fishImages`;
DROP TABLE IF EXISTS `fishIscn`;
DROP TABLE IF EXISTS `fishProbeCutOff`;
DROP TABLE IF EXISTS `fishReportData`;
DROP TABLE IF EXISTS `fishSlides`;
DROP TABLE IF EXISTS `flowData`;
DROP TABLE IF EXISTS `flowResults`;
DROP TABLE IF EXISTS `formConfigurableParts`;
DROP TABLE IF EXISTS `formDefinition`;
DROP TABLE IF EXISTS `formInputSettings`;
DROP TABLE IF EXISTS `formSettingsJSON`;
DROP TABLE IF EXISTS `fsComponentHistory`;
DROP TABLE IF EXISTS `fsComponentInTask`;
DROP TABLE IF EXISTS `fsComponents`;
DROP TABLE IF EXISTS `fsProtocolHistory`;
DROP TABLE IF EXISTS `fsProtocols`;
DROP TABLE IF EXISTS `fsRoutineHistory`;
DROP TABLE IF EXISTS `fsRoutines`;
DROP TABLE IF EXISTS `fsTaskHistory`;
DROP TABLE IF EXISTS `fsTasks`;
DROP TABLE IF EXISTS `genelist`;
DROP TABLE IF EXISTS `groups`;
DROP TABLE IF EXISTS `hl7Communication`;
DROP TABLE IF EXISTS `hl7Failures`;
DROP TABLE IF EXISTS `immunologyGelResults`;
DROP TABLE IF EXISTS `instrumentContacts`;
DROP TABLE IF EXISTS `instrumentHistory`;
DROP TABLE IF EXISTS `instrumentResults`;
DROP TABLE IF EXISTS `instrumentService`;
DROP TABLE IF EXISTS `instruments`;
DROP TABLE IF EXISTS `insuranceCarriers`;
DROP TABLE IF EXISTS `inventory`;
DROP TABLE IF EXISTS `inventoryHistory`;
DROP TABLE IF EXISTS `inventoryItems`;
DROP TABLE IF EXISTS `inventoryMMUsage`;
DROP TABLE IF EXISTS `inventoryOrders`;
DROP TABLE IF EXISTS `inventoryUsage`;
DROP TABLE IF EXISTS `inventoryVendors`;
DROP TABLE IF EXISTS `karyoSlides`;
DROP TABLE IF EXISTS `karyotypeAnalysis`;
DROP TABLE IF EXISTS `karyotypeCaseResults`;
DROP TABLE IF EXISTS `karyotypeSlideResults`;
DROP TABLE IF EXISTS `masterMixArray`;
DROP TABLE IF EXISTS `masterMixComponents`;
DROP TABLE IF EXISTS `masterMixInstructions`;
DROP TABLE IF EXISTS `masterMixInstructionsHistory`;
DROP TABLE IF EXISTS `masterMixKeywords`;
DROP TABLE IF EXISTS `masterMixes`;
DROP TABLE IF EXISTS `masterMixesHistory`;
DROP TABLE IF EXISTS `methods`;
DROP TABLE IF EXISTS `mmcodesForPanel`;
DROP TABLE IF EXISTS `normalizationTargetHistory`;
DROP TABLE IF EXISTS `normalizationTargets`;
DROP TABLE IF EXISTS `normalizeResultHistory`;
DROP TABLE IF EXISTS `normalizeResults`;
DROP TABLE IF EXISTS `orderLog`;
DROP TABLE IF EXISTS `orderLogHistory`;
DROP TABLE IF EXISTS `organizationSites`;
DROP TABLE IF EXISTS `organizations`;
DROP TABLE IF EXISTS `panels`;
DROP TABLE IF EXISTS `panelsForEntities`;
DROP TABLE IF EXISTS `patientBilling`;
DROP TABLE IF EXISTS `patientBillingDefault`;
DROP TABLE IF EXISTS `patientBillingHistory`;
DROP TABLE IF EXISTS `patientClinical`;
DROP TABLE IF EXISTS `patientClinicalHistory`;
DROP TABLE IF EXISTS `patientEthnicities`;
DROP TABLE IF EXISTS `patientHistory`;
DROP TABLE IF EXISTS `patientSources`;
DROP TABLE IF EXISTS `patients`;
DROP TABLE IF EXISTS `pcrRawResults`;
DROP TABLE IF EXISTS `pcrRawResultsHistory`;
DROP TABLE IF EXISTS `pcrResults`;
DROP TABLE IF EXISTS `pcrResultsHistory`;
DROP TABLE IF EXISTS `physicianHistory`;
DROP TABLE IF EXISTS `physicianSites`;
DROP TABLE IF EXISTS `physicians`;
DROP TABLE IF EXISTS `plateMaps`;
DROP TABLE IF EXISTS `poolRuns`;
DROP TABLE IF EXISTS `poolRunsHistory`;
DROP TABLE IF EXISTS `primerAssayLinks`;
DROP TABLE IF EXISTS `primerAssayLinksHistory`;
DROP TABLE IF EXISTS `primerOrdering`;
DROP TABLE IF EXISTS `primerOrderingHistory`;
DROP TABLE IF EXISTS `primers`;
DROP TABLE IF EXISTS `primersHistory`;
DROP TABLE IF EXISTS `proband`;
DROP TABLE IF EXISTS `probandLinks`;
DROP TABLE IF EXISTS `probesForTests`;
DROP TABLE IF EXISTS `qcMetrics`;
DROP TABLE IF EXISTS `quantRawPoolingResultHistory`;
DROP TABLE IF EXISTS `quantRawPoolingResults`;
DROP TABLE IF EXISTS `quantRawResults`;
DROP TABLE IF EXISTS `quantResultHistory`;
DROP TABLE IF EXISTS `quantResults`;
DROP TABLE IF EXISTS `quantThreshold`;
DROP TABLE IF EXISTS `quantThresholdHistory`;
DROP TABLE IF EXISTS `queuePaths`;
DROP TABLE IF EXISTS `rapidExamResults`;
DROP TABLE IF EXISTS `reagentHistory`;
DROP TABLE IF EXISTS `reagentRecipes`;
DROP TABLE IF EXISTS `reagents`;
DROP TABLE IF EXISTS `recommendations`;
DROP TABLE IF EXISTS `referenceDocuments`;
DROP TABLE IF EXISTS `reportDetails`;
DROP TABLE IF EXISTS `reportDetailsHistory`;
DROP TABLE IF EXISTS `reportDistribution`;
DROP TABLE IF EXISTS `reportDistributionPreferences`;
DROP TABLE IF EXISTS `reportHTML`;
DROP TABLE IF EXISTS `reportHTMLAddendums`;
DROP TABLE IF EXISTS `reportHTMLAddendumsHistory`;
DROP TABLE IF EXISTS `reportHTMLHistory`;
DROP TABLE IF EXISTS `reportMedListCYP`;
DROP TABLE IF EXISTS `reportPanelReferences`;
DROP TABLE IF EXISTS `reportReferences`;
DROP TABLE IF EXISTS `reportSettings`;
DROP TABLE IF EXISTS `reportSignatures`;
DROP TABLE IF EXISTS `reportStaticWording`;
DROP TABLE IF EXISTS `reportWording`;
DROP TABLE IF EXISTS `reportWordingCYP`;
DROP TABLE IF EXISTS `reportWordingHistory`;
DROP TABLE IF EXISTS `reportedDemographs`;
DROP TABLE IF EXISTS `reportedDemographsHistory`;
DROP TABLE IF EXISTS `reqCurrentMedications`;
DROP TABLE IF EXISTS `reqHoldDescriptions`;
DROP TABLE IF EXISTS `reqHolds`;
DROP TABLE IF EXISTS `reqPanels`;
DROP TABLE IF EXISTS `requestCodes`;
DROP TABLE IF EXISTS `requestCodesHistory`;
DROP TABLE IF EXISTS `requestForms`;
DROP TABLE IF EXISTS `requestFormsHistory`;
DROP TABLE IF EXISTS `requestSpecimens`;
DROP TABLE IF EXISTS `requestSpecimensHistory`;
DROP TABLE IF EXISTS `resourceHistory`;
DROP TABLE IF EXISTS `routingMatrix`;
DROP TABLE IF EXISTS `ruuResults`;
DROP TABLE IF EXISTS `ruuTranslation`;
DROP TABLE IF EXISTS `sampleFailure`;
DROP TABLE IF EXISTS `samplePanels`;
DROP TABLE IF EXISTS `sampleProcessing`;
DROP TABLE IF EXISTS `sampleProperties`;
DROP TABLE IF EXISTS `sanger`;
DROP TABLE IF EXISTS `sangerResults`;
DROP TABLE IF EXISTS `snpList`;
DROP TABLE IF EXISTS `snpResults`;
DROP TABLE IF EXISTS `snpResultsHistory`;
DROP TABLE IF EXISTS `snpReviewResults`;
DROP TABLE IF EXISTS `snpReviewResultsHistory`;
DROP TABLE IF EXISTS `specimenMethods`;
DROP TABLE IF EXISTS `specimenMethodsHistory`;
DROP TABLE IF EXISTS `specimenRuns`;
DROP TABLE IF EXISTS `specimenRunsHistory`;
DROP TABLE IF EXISTS `state`;
DROP TABLE IF EXISTS `storage`;
DROP TABLE IF EXISTS `storageContainerInfo`;
DROP TABLE IF EXISTS `storageContainerInfoHistory`;
DROP TABLE IF EXISTS `storageDataUpload`;
DROP TABLE IF EXISTS `storageDisplayRules`;
DROP TABLE IF EXISTS `storageHistory`;
DROP TABLE IF EXISTS `storagePathTemp`;
DROP TABLE IF EXISTS `storedSpecimenInfo`;
DROP TABLE IF EXISTS `storedSpecimenRelationships`;
DROP TABLE IF EXISTS `storedSpecimenTests`;
DROP TABLE IF EXISTS `testMethods`;
DROP TABLE IF EXISTS `testPanels`;
DROP TABLE IF EXISTS `testProcessingProperties`;
DROP TABLE IF EXISTS `testProcessingSettings`;
DROP TABLE IF EXISTS `testReferences`;
DROP TABLE IF EXISTS `tests`;
DROP TABLE IF EXISTS `testsForPanel`;
DROP TABLE IF EXISTS `toxConfirmationImport`;
DROP TABLE IF EXISTS `toxConfirmationResults`;
DROP TABLE IF EXISTS `toxConfirmationResultsTempReportData`;
DROP TABLE IF EXISTS `toxScreenRawResults`;
DROP TABLE IF EXISTS `toxScreenResults`;
DROP TABLE IF EXISTS `toxTecanPlateMap`;
DROP TABLE IF EXISTS `toxValidities`;
DROP TABLE IF EXISTS `transferMapMMAssignments`;
DROP TABLE IF EXISTS `transferMapPanelAssignments`;
DROP TABLE IF EXISTS `transferMapProperties`;
DROP TABLE IF EXISTS `transferMapStepAssignments`;
DROP TABLE IF EXISTS `transferMapTransferHistory`;
DROP TABLE IF EXISTS `translation`;
DROP TABLE IF EXISTS `trayMapMMAssignments`;
DROP TABLE IF EXISTS `trayMapProperties`;
DROP TABLE IF EXISTS `trayMaps`;
DROP TABLE IF EXISTS `trayMapStepAssignments`;
DROP TABLE IF EXISTS `validValuesHistory`;
DROP TABLE IF EXISTS `validValuesLinks`;
DROP TABLE IF EXISTS `vendors`;
DROP TABLE IF EXISTS `wellDesignations`;

-- ----------------------------
-- Table structure for adapterSequences
-- ----------------------------
CREATE TABLE `adapterSequences` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `indexId` varchar(50) NOT NULL,
  `indexSequence` varchar(50) DEFAULT NULL,
  `adapterType` varchar(80) DEFAULT NULL,
  `kitType` varchar(80) DEFAULT NULL,
  `eventId` bigint(20) unsigned NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `idxadapterSequencesIndexId` (`indexId`) USING BTREE,
  KEY `idxadapterSequencesKitType` (`kitType`) USING BTREE,
  KEY `idxadapterSequencesEventId` (`eventId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for analyteLinks
-- ----------------------------
CREATE TABLE `analyteLinks` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `analyteId` int(11) unsigned NOT NULL,
  `linkId` int(11) unsigned NOT NULL,
  `linkType` varchar(50) NOT NULL DEFAULT '',
  `eventId` bigint(20) unsigned NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `idxanalyteLinksAnalyteId` (`analyteId`,`linkId`,`linkType`) USING BTREE,
  KEY `idxanalyteLinksEventId` (`eventId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for analytes
-- ----------------------------
CREATE TABLE `analytes` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `analyteGroup` varchar(80) NOT NULL,
  `name` varchar(100) NOT NULL,
  `abbreviation` varchar(50) NOT NULL,
  `resultName` varchar(80) NOT NULL,
  `cutoff` int(11) DEFAULT NULL,
  `ulq` int(11) DEFAULT NULL,
  `disabled` bit(1) NOT NULL DEFAULT b'0',
  `displayOrder` smallint(5) unsigned DEFAULT NULL,
  `indent` int(11) DEFAULT '0',
  `commonDrugs` varchar(100) DEFAULT '',
  `eventId` bigint(20) unsigned NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `idxanalytesAnalyteGroup` (`analyteGroup`,`name`) USING BTREE,
  KEY `idxanalytesEventId` (`eventId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- ----------------------------
-- Table structure for batchProcessingMMAssignment
-- ----------------------------
CREATE TABLE `batchProcessingMMAssignment` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `step` varchar(100) DEFAULT NULL,
  `mmId` int(11) unsigned NOT NULL,
  `mmCode` varchar(80) DEFAULT NULL,
  `eventId` bigint(20) unsigned NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `idxbatchProcessingMMAssignmentMmId` (`mmId`) USING BTREE,
  KEY `idxbatchProcessingMMAssignmentEventId` (`eventId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- ----------------------------
-- Table structure for capChecklist
-- ----------------------------
CREATE TABLE `capChecklist` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `step` varchar(100) NOT NULL,
  `capId` varchar(100) NOT NULL,
  `eventId` bigint(20) unsigned NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `idxcapChecklistStep` (`step`,`capId`) USING BTREE,
  KEY `idxcapChecklistEventId` (`eventId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for client
-- ----------------------------
CREATE TABLE `client` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `clientId` varchar(16) NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `nameId` varchar(80) DEFAULT NULL COMMENT 'md5 of clientId',
  `siteId` varchar(80) DEFAULT NULL COMMENT 'sha2 with 256 of clientId concat with now and rand',
  `deploymentType` varchar(50) DEFAULT NULL,
  `license` varchar(50) DEFAULT NULL,
  `serviceId` varchar(50) DEFAULT NULL,
  `alertEmail` varchar(100) DEFAULT NULL,
  `systemUrl` text,
  `fastUrl` text,
  `labUrl` text,
  `giUsername` varchar(80) DEFAULT NULL,
  `giPassword` varchar(80) DEFAULT NULL,
  `billingUsername` varchar(80) NOT NULL,
  `billingPassword` varchar(80) DEFAULT NULL,
  `billingOrg` varchar(80) DEFAULT NULL,
  `labDirectorFirstName` varchar(80) DEFAULT NULL,
  `labDirectorLastName` varchar(80) DEFAULT NULL,
  `labDirectorTitle` varchar(80) DEFAULT NULL,
  `labDirectorSuffix` varchar(50) DEFAULT NULL,
  `labCliaNumber` varchar(80) DEFAULT NULL,
  `eventId` bigint(20) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `idxclientClientId` (`clientId`) USING BTREE,
  UNIQUE KEY `idxclientName` (`name`) USING BTREE,
  KEY `fkclientEventId_idx` (`eventId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for clientAddress
-- ----------------------------
CREATE TABLE `clientAddress` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `clientId` varchar(16) NOT NULL,
  `address1` varchar(100) DEFAULT NULL,
  `address2` varchar(100) DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `state` varchar(100) DEFAULT NULL,
  `postalCode` varchar(50) DEFAULT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `eventId` bigint(20) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `idxclientAddressClientId` (`clientId`) USING BTREE,
  KEY `idxclientAddressEventId` (`eventId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for clinicalInformation
-- ----------------------------
CREATE TABLE `clinicalInformation` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `requestId` varchar(80) NOT NULL,
  `ageAtInitialPresentation` varchar(5) DEFAULT NULL,
  `geneticCounselor` varchar(100) DEFAULT NULL,
  `clinicalNotes` text,
  `clinicalHistory` text,
  `dateOfLastPSA` date DEFAULT NULL,
  `lastPSA` varchar(80) DEFAULT NULL,
  `percentFreePSA` varchar(80) DEFAULT NULL,
  `dateOfLastDRE` date DEFAULT NULL,
  `lastDREResults` text,
  `biopsyHistoryNumber` varchar(80) DEFAULT NULL,
  `biopsyHistoryOther` text,
  `histopathologyFindings` text,
  `lastMenstrualCycle` date DEFAULT NULL,
  `pregnant` varchar(50) DEFAULT NULL,
  `pregnantComments` text,
  `lastPregnancy` date DEFAULT NULL,
  `miscarriages` varchar(50) DEFAULT NULL,
  `miscarriagesComments` text,
  `hysterectomy` varchar(50) DEFAULT NULL,
  `hysterectomyComments` text,
  `thyroidIssues` varchar(50) DEFAULT NULL,
  `thyroidIssuesComments` text,
  `babyIdentifyingNumber` varchar(80) DEFAULT NULL,
  `birthWeight` varchar(50) DEFAULT NULL,
  `birthTime` varchar(50) DEFAULT NULL,
  `placeOfBirth` varchar(80) DEFAULT NULL,
  `locationOfSampling` varchar(80) DEFAULT NULL,
  `referringDoctor` varchar(80) DEFAULT NULL,
  `repeatSample` varchar(50) DEFAULT NULL,
  `privatePublicPatient` varchar(80) DEFAULT NULL,
  `prePostTransfusion` varchar(80) DEFAULT NULL,
  `ambiguousGenitalia` varchar(50) DEFAULT NULL,
  `ambiguousGenitaliaComments` text,
  `clinicalHistoryOfMother` text,
  `motherFullName` text,
  `dateOfFirstMilk` date DEFAULT NULL,
  `timeOfFirstMilk` text,
  `feedingHistory` text,
  `familyHistoryCF` varchar(50) DEFAULT NULL,
  `familyHistoryCFComments` text,
  `meconiumIleus` varchar(50) DEFAULT NULL,
  `meconiumIleusComments` text,
  `donorOrRecipient` varchar(50) DEFAULT NULL,
  `transfusionHistory` text,
  `bloodType` varchar(50) DEFAULT NULL,
  `transfusionTransplantHistory` varchar(50) DEFAULT NULL,
  `eventId` bigint(20) unsigned NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `idxclinicalInformationRequestId` (`requestId`) USING BTREE,
  KEY `idxclinicalInformationEventId` (`eventId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for clinicalInformationDrugs
-- ----------------------------
CREATE TABLE `clinicalInformationDrugs` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `requestId` varchar(80) NOT NULL,
  `type` varchar(80) NOT NULL,
  `drugId` int(11) unsigned NOT NULL,
  `eventId` bigint(20) unsigned NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `idxclinicalInformationRequestIdTypeDrug` (`requestId`,`type`,`drugId`) USING BTREE,
  KEY `idxclinicalInformartionEventId` (`eventId`) USING BTREE,
  KEY `idxclinicalInformationDrugsDrugId` (`drugId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for cmaGeneResults
-- ----------------------------
CREATE TABLE `cmaGeneResults` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `rawResultId` int(11) unsigned NOT NULL,
  `sampleId` varchar(80) NOT NULL,
  `gene` varchar(255) DEFAULT NULL,
  `mimNo` varchar(80) DEFAULT NULL,
  `syndromeName` varchar(80) DEFAULT NULL,
  `selectedReferences` text,
  `refEventId` bigint(20) unsigned NOT NULL,
  `eventId` bigint(20) unsigned NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `idxcmaGeneResultsRawResultId` (`rawResultId`,`sampleId`) USING BTREE,
  KEY `idxcmaGeneResultSampleID` (`sampleId`,`gene`) USING BTREE,
  KEY `idxcmaGeneResultsGene` (`gene`,`sampleId`) USING BTREE,
  KEY `idxcmaGeneResultsEventId` (`eventId`) USING BTREE,
  KEY `idxcmaGeneResultsRefEventId` (`refEventId`) USING BTREE,
  KEY `fkcmaGeneResultsSampleId` (`sampleId`,`rawResultId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for cmaRawResults
-- ----------------------------
CREATE TABLE `cmaRawResults` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `sampleId` varchar(80) NOT NULL,
  `filename` text,
  `maxOverlap` varchar(80) DEFAULT NULL,
  `chromosome` varchar(80) DEFAULT NULL,
  `cytobandStart` varchar(80) DEFAULT NULL,
  `cytobandEnd` varchar(80) DEFAULT NULL,
  `cytoCall` varchar(80) DEFAULT NULL,
  `interpretation` varchar(80) DEFAULT NULL,
  `type` varchar(80) DEFAULT NULL,
  `size` varchar(50) DEFAULT NULL,
  `geneCount` varchar(50) DEFAULT NULL,
  `genes` text,
  `cnState` varchar(80) DEFAULT NULL,
  `min` varchar(50) DEFAULT NULL,
  `microarrayNomenclature` text,
  `max` varchar(50) DEFAULT NULL,
  `markerCount` varchar(50) DEFAULT NULL,
  `omimGeneCount` varchar(50) DEFAULT NULL,
  `omimGenes` text,
  `callInterpretationBy` varchar(80) DEFAULT NULL,
  `cytoRegions` varchar(80) DEFAULT NULL,
  `eventId` bigint(20) unsigned NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `idxcmaRawResultsSampleId` (`sampleId`) USING BTREE,
  KEY `idxcmaRawResultsEventId` (`eventId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for cmaRawResultsHistory
-- ----------------------------
CREATE TABLE `cmaRawResultsHistory` (
  `id` int(11) unsigned NOT NULL,
  `sampleId` varchar(80) NOT NULL,
  `filename` text,
  `maxOverlap` varchar(80) DEFAULT NULL,
  `chromosome` varchar(80) DEFAULT NULL,
  `cytobandStart` varchar(80) DEFAULT NULL,
  `cytobandEnd` varchar(80) DEFAULT NULL,
  `cytoCall` varchar(80) DEFAULT NULL,
  `interpretation` varchar(80) DEFAULT NULL,
  `type` varchar(80) DEFAULT NULL,
  `size` varchar(50) DEFAULT NULL,
  `geneCount` varchar(50) DEFAULT NULL,
  `genes` text,
  `cnState` varchar(80) DEFAULT NULL,
  `min` varchar(50) DEFAULT NULL,
  `microarrayNomenclature` text,
  `max` varchar(50) DEFAULT NULL,
  `markerCount` varchar(50) DEFAULT NULL,
  `omimGeneCount` varchar(50) DEFAULT NULL,
  `omimGenes` text,
  `callInterpretationBy` varchar(80) DEFAULT NULL,
  `cytoRegions` varchar(80) DEFAULT NULL,
  `eventId` bigint(20) unsigned NOT NULL,
  `historyStartDate` datetime DEFAULT NULL,
  `historyEndDate` datetime DEFAULT NULL,
  `historyAction` varchar(20) DEFAULT NULL,
  `historyUser` varchar(85) DEFAULT NULL,
  `historyId` int(11) unsigned NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`historyId`) USING BTREE,
  KEY `idxcmaRawResultsHistorySampleId` (`sampleId`) USING BTREE,
  KEY `idxcmaRawResultsHistoryId` (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for cmaResults
-- ----------------------------
CREATE TABLE `cmaResults` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `sampleId` varchar(80) NOT NULL,
  `rawResultId` int(11) unsigned NOT NULL,
  `maxOverlap` varchar(80) DEFAULT NULL,
  `chromosome` varchar(80) DEFAULT NULL,
  `cytobandStart` varchar(80) DEFAULT NULL,
  `cytobandEnd` varchar(80) DEFAULT NULL,
  `cytoCall` varchar(80) DEFAULT NULL,
  `interpretation` varchar(80) DEFAULT NULL,
  `type` varchar(80) DEFAULT NULL,
  `size` varchar(50) DEFAULT NULL,
  `min` varchar(50) DEFAULT NULL,
  `microarrayNomenclature` text,
  `max` varchar(50) DEFAULT NULL,
  `reportable` varchar(50) DEFAULT NULL,
  `AOHPercent` varchar(50) DEFAULT NULL,
  `mergeId` varchar(80) DEFAULT NULL,
  `eventId` bigint(20) unsigned NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `idxcmaResultsSampleId` (`sampleId`) USING BTREE,
  KEY `idxcmaResultsEventId` (`eventId`) USING BTREE,
  KEY `idxcmaResultsRawResultId` (`rawResultId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for cmaResultsHistory
-- ----------------------------
CREATE TABLE `cmaResultsHistory` (
  `id` int(11) unsigned NOT NULL,
  `sampleId` varchar(80) NOT NULL,
  `rawResultId` int(11) unsigned NOT NULL,
  `maxOverlap` varchar(80) DEFAULT NULL,
  `chromosome` varchar(80) DEFAULT NULL,
  `cytobandStart` varchar(80) DEFAULT NULL,
  `cytobandEnd` varchar(80) DEFAULT NULL,
  `cytoCall` varchar(80) DEFAULT NULL,
  `interpretation` varchar(80) DEFAULT NULL,
  `type` varchar(80) DEFAULT NULL,
  `size` varchar(50) DEFAULT NULL,
  `min` varchar(50) DEFAULT NULL,
  `microarrayNomenclature` text,
  `max` varchar(50) DEFAULT NULL,
  `reportable` varchar(50) DEFAULT NULL,
  `AOHPercent` varchar(50) DEFAULT NULL,
  `mergeId` varchar(80) DEFAULT NULL,
  `eventId` bigint(20) unsigned NOT NULL,
  `historyStartDate` datetime DEFAULT NULL,
  `historyEndDate` datetime DEFAULT NULL,
  `historyAction` varchar(20) DEFAULT NULL,
  `historyUser` varchar(85) DEFAULT NULL,
  `historyId` int(11) unsigned NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`historyId`) USING BTREE,
  KEY `idxcmaResultsHistorySampleId` (`sampleId`) USING BTREE,
  KEY `idxcmaResultsHistoryId` (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for consumables
-- ----------------------------
CREATE TABLE `consumables` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `consumableId` varchar(80) NOT NULL,
  `consumableType` varchar(80) NOT NULL,
  `catalogNo` varchar(80) DEFAULT NULL,
  `quantity` int(11) DEFAULT NULL,
  `quantityInside` varchar(50) DEFAULT NULL,
  `volume` decimal(10,2) DEFAULT NULL,
  `unitOfMeasure` varchar(50) DEFAULT NULL,
  `lotNumber` varchar(80) DEFAULT NULL,
  `storageId` varchar(80) DEFAULT NULL,
  `vendor` varchar(80) DEFAULT NULL,
  `projectType` varchar(50) DEFAULT NULL,
  `costPerUnit` decimal(10,2) DEFAULT NULL,
  `poNumber` varchar(80) DEFAULT NULL,
  `receiveDate` date DEFAULT NULL,
  `expirationDate` date DEFAULT NULL,
  `status` varchar(80) NOT NULL,
  `eventId` bigint(20) unsigned NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `idxconsumablesConsumableId` (`consumableId`) USING BTREE,
  KEY `idxconsumablesEventId` (`eventId`) USING BTREE,
  KEY `idxconsumablesStorageId` (`storageId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for consumablesHistory
-- ----------------------------
CREATE TABLE `consumablesHistory` (
  `id` int(11) unsigned NOT NULL,
  `consumableId` varchar(80) NOT NULL,
  `consumableType` varchar(80) NOT NULL,
  `catalogNo` varchar(80) DEFAULT NULL,
  `quantity` int(11) DEFAULT NULL,
  `quantityInside` varchar(50) DEFAULT NULL,
  `volume` decimal(10,2) DEFAULT NULL,
  `unitOfMeasure` varchar(50) DEFAULT NULL,
  `lotNumber` varchar(80) DEFAULT NULL,
  `storageId` varchar(80) DEFAULT NULL,
  `vendor` varchar(80) DEFAULT NULL,
  `projectType` varchar(50) DEFAULT NULL,
  `costPerUnit` decimal(10,2) DEFAULT NULL,
  `poNumber` varchar(80) DEFAULT NULL,
  `receiveDate` date DEFAULT NULL,
  `expirationDate` date DEFAULT NULL,
  `status` varchar(80) NOT NULL,
  `eventId` bigint(20) unsigned NOT NULL,
  `historyStartDate` datetime DEFAULT NULL,
  `historyEndDate` datetime DEFAULT NULL,
  `historyAction` varchar(20) DEFAULT NULL,
  `historyUser` varchar(85) DEFAULT NULL,
  `historyId` int(11) unsigned NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`historyId`) USING BTREE,
  KEY `idxconsumablesHistoryConsumableId` (`consumableId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for controlHistory
-- ----------------------------
CREATE TABLE `controlHistory` (
  `id` int(11) unsigned NOT NULL,
  `controlId` varchar(80) NOT NULL,
  `controlType` varchar(80) DEFAULT NULL,
  `catalogNo` varchar(80) DEFAULT NULL,
  `quantity` decimal(10,2) DEFAULT NULL,
  `quantityInside` varchar(50) DEFAULT NULL,
  `unitOfMeasure` varchar(50) DEFAULT NULL,
  `lotNumber` varchar(80) DEFAULT NULL,
  `parentLot` varchar(80) DEFAULT NULL,
  `vendor` varchar(80) DEFAULT NULL,
  `storageId` varchar(80) DEFAULT NULL,
  `projectType` varchar(50) DEFAULT NULL,
  `costPerUnit` decimal(10,2) DEFAULT NULL,
  `poNumber` varchar(80) DEFAULT NULL,
  `receivedDate` date DEFAULT NULL,
  `expirationDate` date DEFAULT NULL,
  `openDate` date DEFAULT NULL,
  `qcStatus` varchar(80) DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL,
  `qcType` varchar(80) DEFAULT NULL,
  `eventId` bigint(20) unsigned NOT NULL,
  `lastUpdateEventId` bigint(20) unsigned DEFAULT NULL,
  `historyStartDate` datetime DEFAULT NULL,
  `historyEndDate` datetime DEFAULT NULL,
  `historyAction` varchar(20) DEFAULT NULL,
  `historyUser` varchar(85) DEFAULT NULL,
  `historyId` int(11) unsigned NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`historyId`) USING BTREE,
  KEY `idxcontolsHistoryControlId` (`controlId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for controlLimits
-- ----------------------------
CREATE TABLE `controlLimits` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `panelId` int(11) unsigned DEFAULT NULL,
  `assayName` varchar(100) DEFAULT NULL,
  `controlType` varchar(80) DEFAULT NULL,
  `limitType` varchar(50) DEFAULT NULL,
  `target` decimal(10,2) DEFAULT NULL,
  `lowerLimit` decimal(10,2) DEFAULT NULL,
  `upperLimit` decimal(10,2) DEFAULT NULL,
  `eventId` bigint(20) unsigned NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `idxcontrolLimitsPanelId` (`panelId`,`controlType`) USING BTREE,
  KEY `idxcontrolLimitsAssayName` (`assayName`) USING BTREE,
  KEY `idxcontrolLimitsEventId` (`eventId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for controlResults
-- ----------------------------
CREATE TABLE `controlResults` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `assayName` varchar(100) DEFAULT NULL,
  `controlType` varchar(80) DEFAULT NULL,
  `batchId` varchar(80) DEFAULT NULL,
  `controlId` varchar(80) DEFAULT NULL,
  `instrumentId` varchar(80) DEFAULT NULL,
  `result` varchar(50) DEFAULT NULL,
  `lotNumber` varchar(80) DEFAULT NULL,
  `expDate` date DEFAULT NULL,
  `QC` varchar(100) DEFAULT NULL,
  `notes` text,
  `runDate` datetime DEFAULT NULL,
  `eventId` bigint(20) unsigned NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `idxcontrolResultsBatchId` (`batchId`) USING BTREE,
  KEY `idxcontrolResultsControlId` (`controlId`) USING BTREE,
  KEY `idxcontrolResultsInstrumentId` (`instrumentId`) USING BTREE,
  KEY `idxcontrolResultsEventId` (`eventId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for controls
-- ----------------------------
CREATE TABLE `controls` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `controlId` varchar(80) NOT NULL,
  `controlType` varchar(80) DEFAULT NULL,
  `catalogNo` varchar(80) DEFAULT NULL,
  `quantity` decimal(10,2) DEFAULT NULL,
  `quantityInside` varchar(50) DEFAULT NULL,
  `unitOfMeasure` varchar(50) DEFAULT NULL,
  `lotNumber` varchar(80) DEFAULT NULL,
  `parentLot` varchar(80) DEFAULT NULL,
  `vendor` varchar(80) DEFAULT NULL,
  `storageId` varchar(80) DEFAULT NULL,
  `projectType` varchar(45) DEFAULT NULL,
  `costPerUnit` decimal(10,2) DEFAULT NULL,
  `poNumber` varchar(80) DEFAULT NULL,
  `receivedDate` date DEFAULT NULL,
  `expirationDate` date DEFAULT NULL,
  `openDate` date DEFAULT NULL,
  `qcStatus` varchar(80) DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL,
  `qcType` varchar(80) DEFAULT NULL,
  `eventId` bigint(20) unsigned NOT NULL,
  `lastUpdateEventId` bigint(20) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `idxcontolsControlId` (`controlId`) USING BTREE,
  KEY `idxcontolsEventId` (`eventId`) USING BTREE,
  KEY `idxcontolsLastUpdateEventId` (`lastUpdateEventId`) USING BTREE,
  KEY `idxcontrolsStorageId` (`storageId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for controlsExpectedSNP
-- ----------------------------
CREATE TABLE `controlsExpectedSNP` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `assay` varchar(255) NOT NULL DEFAULT '',
  `controlId` varchar(80) NOT NULL DEFAULT '',
  `gene` varchar(255) DEFAULT NULL,
  `snp` varchar(80) NOT NULL DEFAULT '',
  `columnNo` int(11) DEFAULT NULL,
  `call1` varchar(80) DEFAULT NULL,
  `call2` varchar(80) DEFAULT NULL,
  `eventId` bigint(20) unsigned NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `idxcontrolsExpectedSNPEventId` (`eventId`) USING BTREE,
  KEY `idxcontrolsExpectedSNPControlId` (`controlId`) USING BTREE,
  KEY `idxcontrolsExpectedSNPAssay` (`assay`,`controlId`,`snp`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for customerCommunications
-- ----------------------------
CREATE TABLE `customerCommunications` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `reqId` varchar(80) NOT NULL,
  `contactDate` datetime NOT NULL,
  `employeeId` varchar(80) NOT NULL,
  `personContacted` varchar(100) NOT NULL,
  `timeToReach` varchar(100) DEFAULT NULL,
  `contactType` varchar(100) DEFAULT NULL,
  `note` text NOT NULL,
  `eventId` bigint(20) unsigned NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `idxcustomerCommunicationsReqId` (`reqId`,`id`) USING BTREE,
  KEY `idxcustomerCommunicationsEventId` (`eventId`) USING BTREE,
  KEY `idxcustomerCommunicationsEmployeeId` (`employeeId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- ----------------------------
-- Table structure for delDupReviewResults
-- ----------------------------
CREATE TABLE `delDupReviewResults` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `sampleId` varchar(80) NOT NULL,
  `resultCall` varchar(100) DEFAULT NULL,
  `eventId` bigint(20) unsigned NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `idxdelDupReviewResultsSampleId` (`sampleId`) USING BTREE,
  KEY `idxdelDupReviewResultsEventId` (`eventId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for deleteStorageTemp
-- ----------------------------
CREATE TABLE `deleteStorageTemp` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `storageChild` varchar(80) NOT NULL,
  `status` varchar(50) DEFAULT NULL,
  `eventId` bigint(20) unsigned NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `idxdeleteStorageTempEventId` (`eventId`) USING BTREE,
  KEY `idxdeleteStorageTempStorageChild` (`storageChild`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for diagnosticCodes
-- ----------------------------
CREATE TABLE `diagnosticCodes` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `diagnosticCode` varchar(80) NOT NULL,
  `type` varchar(100) NOT NULL,
  `disabled` bit(1) DEFAULT b'0',
  `description` text,
  `longDescription` text,
  `eventId` bigint(20) unsigned NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `idxdiagnosticCodeDiagnosticCode` (`diagnosticCode`,`type`) USING BTREE,
  KEY `idxdiagnosticCodesEventIdEventId` (`eventId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for documentAssignments
-- ----------------------------
CREATE TABLE `documentAssignments` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `documentId` varchar(80) NOT NULL,
  `assignmentType` varchar(50) NOT NULL,
  `userId` varchar(85) NOT NULL,
  `eventId` bigint(20) unsigned NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `idxdocumentAssignmentsIDocumentId` (`documentId`,`assignmentType`,`userId`) USING BTREE,
  KEY `idxdocumentAssignmentsUserId` (`userId`) USING BTREE,
  KEY `idxdocumentAssignmentsEventId` (`eventId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for documentRecords
-- ----------------------------
CREATE TABLE `documentRecords` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `documentVersionId` varchar(80) NOT NULL,
  `document` longblob,
  `eventId` bigint(20) unsigned NOT NULL,
  `lastUpdateEventId` bigint(20) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `idxdocumentRecordsdocumentVersionId` (`documentVersionId`) USING BTREE,
  KEY `idxdocumentRecordsEventId` (`eventId`) USING BTREE,
  KEY `idxdocumentRecordsLastUpdateEventId` (`lastUpdateEventId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for documentRecordsHistory
-- ----------------------------
CREATE TABLE `documentRecordsHistory` (
  `id` int(11) unsigned NOT NULL,
  `documentVersionId` varchar(80) NOT NULL,
  `document` longblob,
  `eventId` bigint(20) unsigned NOT NULL,
  `lastUpdateEventId` bigint(20) unsigned DEFAULT NULL,
  `historyStartDate` datetime DEFAULT NULL,
  `historyEndDate` datetime DEFAULT NULL,
  `historyAction` varchar(20) DEFAULT NULL,
  `historyUser` varchar(85) DEFAULT NULL,
  `historyId` int(11) unsigned NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`historyId`) USING BTREE,
  KEY `idxdocumentRecordsHistoryDocumentVersionId` (`documentVersionId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for documentUserAssignments
-- ----------------------------
CREATE TABLE `documentUserAssignments` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `documentId` varchar(80) NOT NULL,
  `userId` varchar(85) NOT NULL,
  `activity` varchar(50) NOT NULL DEFAULT '',
  `active` bit(1) NOT NULL DEFAULT b'1',
  `eventId` bigint(20) unsigned NOT NULL,
  `deactivateEventId` bigint(20) unsigned DEFAULT NULL,
  `intervalNumber` int(11) NOT NULL,
  `lastActivityEventId` bigint(20) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `idxdocumentUserAssignmentsUserId` (`userId`) USING BTREE,
  KEY `idxdocumentUserAssignmentsEventId` (`eventId`) USING BTREE,
  KEY `idxdocumentUserAssignmentsDeactivateEventId` (`deactivateEventId`) USING BTREE,
  KEY `idxdocumentUserAssignmentsLastActivityEventId` (`lastActivityEventId`) USING BTREE,
  KEY `idxdocumentUserAssignmentsDocumentId` (`documentId`,`userId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for documentUserHistory
-- ----------------------------
CREATE TABLE `documentUserHistory` (
  `historyId` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `documentId` varchar(80) NOT NULL,
  `userId` varchar(85) NOT NULL,
  `activity` varchar(50) NOT NULL DEFAULT '',
  `active` bit(1) NOT NULL DEFAULT b'1',
  `eventId` bigint(20) unsigned NOT NULL,
  `deactivateEventId` bigint(20) unsigned DEFAULT NULL,
  `intervalNumber` int(11) NOT NULL,
  `lastActivityEventId` bigint(20) unsigned DEFAULT NULL,
  `historyStartDate` datetime DEFAULT NULL,
  `historyEndDate` datetime DEFAULT NULL,
  `historyAction` varchar(20) DEFAULT NULL,
  `historyUser` varchar(85) DEFAULT NULL,
  PRIMARY KEY (`historyId`) USING BTREE,
  KEY `idxdocumentUserHistoryDocumentId` (`documentId`) USING BTREE,
  KEY `idxdocumentUserHistoryUserId` (`userId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for documentVersionAssignments
-- ----------------------------
CREATE TABLE `documentVersionAssignments` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `documentVersionId` varchar(80) NOT NULL,
  `assignmentType` varchar(50) NOT NULL,
  `userId` varchar(85) NOT NULL,
  `decision` varchar(100) DEFAULT NULL,
  `eventId` bigint(20) unsigned NOT NULL,
  `lastUpdateEventId` bigint(20) unsigned NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `idxdocumentVersionAssignmentsId` (`id`) USING BTREE,
  KEY `idxdocumentVersionAssignmentsEventId` (`eventId`) USING BTREE,
  KEY `idxdocumentVersionAssignmentsLastUpdateEventId` (`lastUpdateEventId`) USING BTREE,
  KEY `idxdocumentVersionAssignmentsUserId` (`userId`) USING BTREE,
  KEY `idxdocumentVersionAssignmentsDocumentVersionId` (`documentVersionId`,`userId`,`assignmentType`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for documentVersionAssignmentsHistory
-- ----------------------------
CREATE TABLE `documentVersionAssignmentsHistory` (
  `historyId` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `id` int(11) unsigned NOT NULL,
  `documentVersionId` varchar(80) NOT NULL,
  `assignmentType` varchar(50) NOT NULL,
  `userId` varchar(85) NOT NULL,
  `decision` varchar(100) DEFAULT NULL,
  `eventId` bigint(20) unsigned NOT NULL,
  `lastUpdateEventId` bigint(20) unsigned NOT NULL,
  `historyStartDate` datetime DEFAULT NULL,
  `historyEndDate` datetime DEFAULT NULL,
  `historyAction` varchar(20) NOT NULL,
  `historyUser` varchar(85) DEFAULT NULL,
  PRIMARY KEY (`historyId`) USING BTREE,
  KEY `idxdocumentVersionAssignmentsDocumentVersionId` (`documentVersionId`,`assignmentType`,`userId`) USING BTREE,
  KEY `idxdocumentVersionAssignmentsHistoryDocumentVersionId` (`documentVersionId`,`userId`,`assignmentType`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for documentVersions
-- ----------------------------
CREATE TABLE `documentVersions` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `documentVersionId` varchar(80) NOT NULL,
  `documentId` varchar(80) NOT NULL,
  `title` varchar(100) DEFAULT NULL,
  `description` text,
  `groupId` varchar(80) DEFAULT NULL,
  `revFrequency` int(11) DEFAULT '365',
  `fileName` text,
  `sourceFileName` text,
  `changes` text,
  `groupManagerApprovalEventId` bigint(20) unsigned DEFAULT NULL,
  `eventId` bigint(20) unsigned DEFAULT NULL,
  `lastUpdateEventId` bigint(20) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `idxdocumentVersionsDocumentVersionId` (`documentVersionId`) USING BTREE,
  KEY `idxdocumentVersionsDocumentId` (`documentId`,`documentVersionId`) USING BTREE,
  KEY `idxdocumentVersionsEventId` (`eventId`) USING BTREE,
  KEY `idxdocumentVersionsLastUpdateEventId` (`lastUpdateEventId`) USING BTREE,
  KEY `idxdocumentVersionsGroupManagerApprovalEventId` (`groupManagerApprovalEventId`) USING BTREE,
  KEY `idxdocumentVersionsGroupId` (`groupId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for documents
-- ----------------------------
CREATE TABLE `documents` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `documentId` varchar(80) NOT NULL,
  `title` varchar(100) NOT NULL,
  `description` text,
  `groupId` varchar(80) DEFAULT NULL,
  `currentVersionId` varchar(80) NOT NULL,
  `fileName` text,
  `step` varchar(100) DEFAULT NULL,
  `revFrequency` int(11) NOT NULL DEFAULT '365',
  `eventId` bigint(20) unsigned NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `idxdocumentsDocumentId` (`documentId`) USING BTREE,
  KEY `idxdocumentsEventId` (`eventId`) USING BTREE,
  KEY `idxdocumentsCurrentGroupId` (`groupId`) USING BTREE,
  KEY `idxdocumentsCurrentVersionId` (`currentVersionId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for drugs
-- ----------------------------
CREATE TABLE `drugs` (
  `drugId` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `testId` int(11) DEFAULT '-1',
  `name` varchar(100) NOT NULL DEFAULT '',
  `abbreviation` varchar(50) DEFAULT NULL,
  `disabled` bit(1) DEFAULT b'0',
  `eventId` bigint(20) unsigned NOT NULL,
  PRIMARY KEY (`drugId`) USING BTREE,
  KEY `ixdrugsEventId` (`eventId`) USING BTREE,
  KEY `ixdrugsName` (`name`,`drugId`) USING BTREE,
  KEY `ixdrugsAbbreviation` (`abbreviation`,`drugId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- ----------------------------
-- Table structure for fishAnalysis
-- ----------------------------
CREATE TABLE `fishAnalysis` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `slideId` varchar(80) NOT NULL,
  `techAnalyst` varchar(85) DEFAULT NULL,
  `notes` text,
  `cell` varchar(100) DEFAULT NULL,
  `eventId` bigint(20) unsigned NOT NULL,
  `overallResult` varchar(255) DEFAULT NULL,
  `column1Gene` varchar(255) DEFAULT NULL,
  `column1Result` varchar(255) DEFAULT NULL,
  `column2Gene` varchar(255) DEFAULT NULL,
  `column2Result` varchar(255) DEFAULT NULL,
  `column3Gene` varchar(255) DEFAULT NULL,
  `column3Result` varchar(255) DEFAULT NULL,
  `column4Gene` varchar(255) DEFAULT NULL,
  `column4Result` varchar(255) DEFAULT NULL,
  `column1Average` varchar(255) DEFAULT NULL,
  `column2Average` varchar(255) DEFAULT NULL,
  `column1to2Ratio` varchar(255) DEFAULT NULL,
  `pattern` varchar(255) DEFAULT NULL,
  `patternResult` varchar(255) DEFAULT NULL,
  `patternSet` text,
  `normalCount` int(11) DEFAULT NULL,
  `abnormalCount` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `idxfishAnalysisSlideId` (`slideId`) USING BTREE,
  KEY `idxfishAnalysisEventId` (`eventId`) USING BTREE,
  KEY `idxfishAnalysisTechAnalyst` (`techAnalyst`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for fishReportData
-- ----------------------------
CREATE TABLE `fishReportData` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `requestId` varchar(80) DEFAULT NULL,
  `reportId` varchar(80) NOT NULL,
  `slideId` varchar(80) DEFAULT NULL,
  `techAnalyst` varchar(85) DEFAULT NULL,
  `overallResult` varchar(255) DEFAULT NULL,
  `cellsCounted` int(11) DEFAULT NULL,
  `column1Gene` varchar(255) DEFAULT NULL,
  `column2Gene` varchar(255) DEFAULT NULL,
  `column3Gene` varchar(255) DEFAULT NULL,
  `column4Gene` varchar(255) DEFAULT NULL,
  `column1Average` varchar(255) DEFAULT NULL,
  `column2Average` varchar(255) DEFAULT NULL,
  `column1to2Ratio` varchar(255) DEFAULT NULL,
  `pattern` text,
  `patternResult` varchar(255) DEFAULT NULL,
  `patternSet` text,
  `normalCount` int(11) DEFAULT NULL,
  `abnormalCount` int(11) DEFAULT NULL,
  `eventId` bigint(20) unsigned NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `idxfishReportDataReportId` (`reportId`) USING BTREE,
  KEY `idxfishReportDataEventId` (`eventId`) USING BTREE,
  KEY `idxfishReportDataRequestId` (`requestId`) USING BTREE,
  KEY `idxfishReportTechAnalyst` (`techAnalyst`) USING BTREE,
  KEY `idxfishReportDataSlideId` (`slideId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for fishSlides
-- ----------------------------
CREATE TABLE `fishSlides` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `batchId` varchar(80) NOT NULL DEFAULT '',
  `slideId` varchar(80) NOT NULL,
  `aliquotId` varchar(80) DEFAULT NULL,
  `cultureId` varchar(80) DEFAULT NULL,
  `requestId` varchar(80) DEFAULT NULL,
  `harvestId` varchar(80) DEFAULT NULL,
  `eventId` bigint(20) unsigned NOT NULL,
  `hybridizationStartEventId` bigint(20) unsigned DEFAULT NULL,
  `hybridizationFinishEventId` bigint(20) unsigned DEFAULT NULL,
  `washMountEventId` bigint(20) unsigned DEFAULT NULL,
  `reviewSlideEventId` bigint(20) unsigned DEFAULT NULL,
  `testId` int(11) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `idxfishSlidesSlideId` (`slideId`) USING BTREE,
  KEY `idxfishSlidesBatchId` (`batchId`) USING BTREE,
  KEY `idxfishSlidesAliquotId` (`aliquotId`) USING BTREE,
  KEY `idxfishSlidesCultureId` (`cultureId`) USING BTREE,
  KEY `idxfishSlidesRequestId` (`requestId`) USING BTREE,
  KEY `idxfishSlidesHarvestId` (`harvestId`) USING BTREE,
  KEY `idxfishSlidesEventId` (`eventId`) USING BTREE,
  KEY `idxfishSlidesHybridizationStartEventId` (`hybridizationStartEventId`) USING BTREE,
  KEY `idxfishSlidesHybridizationFinishEventId` (`hybridizationFinishEventId`) USING BTREE,
  KEY `idxfishSlidesWashMountEventId` (`washMountEventId`) USING BTREE,
  KEY `idxfishSlidesReviewSlideEventId` (`reviewSlideEventId`) USING BTREE,
  KEY `idxfishSlidesTestId` (`testId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for flowData
-- ----------------------------
CREATE TABLE `flowData` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `stainTubeId` varchar(80) NOT NULL,
  `property` varchar(100) NOT NULL,
  `value` varchar(100) DEFAULT NULL,
  `colNo` int(11) DEFAULT NULL,
  `eventId` bigint(20) unsigned NOT NULL,
  `popAnalysis` text,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `idxflowDataProperty` (`property`,`stainTubeId`) USING BTREE,
  KEY `idxflowDataEventId` (`eventId`) USING BTREE,
  KEY `idxflowDataStainTubeId` (`stainTubeId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for flowResults
-- ----------------------------
CREATE TABLE `flowResults` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `reqId` varchar(80) DEFAULT NULL,
  `specimenId` varchar(80) DEFAULT NULL,
  `stainTubeId` varchar(80) DEFAULT NULL,
  `stainType` varchar(100) DEFAULT NULL,
  `population` varchar(100) DEFAULT NULL,
  `results` text,
  `resultAnalysis` text,
  `testOrdered` varchar(100) DEFAULT NULL,
  `clinicalHistory` text,
  `methodology` text,
  `antibodies` text,
  `viability` text,
  `morphology` text,
  `comments` text,
  `eventId` bigint(20) unsigned NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `idxflowResultsReqId` (`reqId`,`specimenId`) USING BTREE,
  KEY `idxflowResultsSpecimenId` (`specimenId`,`reqId`) USING BTREE,
  KEY `idxflowResultsStainTubeId` (`stainTubeId`) USING BTREE,
  KEY `idxflowResultsEventId` (`eventId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for formConfigurableParts
-- ----------------------------
CREATE TABLE `formConfigurableParts` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `formType` varchar(255) NOT NULL,
  `section` varchar(255) NOT NULL,
  `subSection` varchar(255) NOT NULL,
  `inputType` varchar(255) DEFAULT NULL,
  `inputName` varchar(255) DEFAULT NULL,
  `configSettingValue` bit(1) DEFAULT NULL,
  `required` bit(1) DEFAULT NULL,
  `screenLabel` bit(1) DEFAULT NULL,
  `placeholder` bit(1) DEFAULT NULL,
  `defaultValue` bit(1) DEFAULT b'1',
  `order` varchar(25) DEFAULT NULL,
  `eventId` bigint(20) unsigned NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `idxformConfigurablePartsEventId` (`eventId`) USING BTREE,
  KEY `idxformConfigurablePartsFormType` (`formType`,`section`,`subSection`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for formDefinition
-- ----------------------------
CREATE TABLE `formDefinition` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `formType` varchar(255) NOT NULL,
  `instance` varchar(255) NOT NULL,
  `workflow` varchar(255) NOT NULL,
  `displayStepName` varchar(255) NOT NULL,
  `eventId` bigint(20) unsigned NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `idxformDefinition` (`formType`,`instance`,`workflow`) USING BTREE,
  KEY `idxformDefinitionEventId` (`eventId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for formInputSettings
-- ----------------------------
CREATE TABLE `formInputSettings` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `formDefinitionId` int(11) unsigned NOT NULL,
  `formConfigurablePartsId` int(11) unsigned NOT NULL,
  `showField` varchar(5) NOT NULL,
  `required` varchar(5) NOT NULL,
  `readonly` varchar(5) NOT NULL,
  `screenLabel` varchar(255) NOT NULL,
  `placeHolder` varchar(255) DEFAULT NULL,
  `defaultValue` varchar(255) DEFAULT NULL,
  `eventId` bigint(20) unsigned NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `idxformInputSettingsFormDefinitionId` (`formDefinitionId`,`formConfigurablePartsId`) USING BTREE,
  KEY `idxformInputSettingsFormConfigurablePartsId` (`formConfigurablePartsId`) USING BTREE,
  KEY `idxformInputSettingsEventId` (`eventId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for formSettingsJSON
-- ----------------------------
CREATE TABLE `formSettingsJSON` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `formDefinitionId` int(11) unsigned NOT NULL,
  `jsonObject` mediumtext NOT NULL,
  `eventId` bigint(20) unsigned NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `idxformSettingsJSONFormDefinitionId` (`formDefinitionId`) USING BTREE,
  KEY `idx formSettingsJSONEventId` (`eventId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for fsComponentHistory
-- ----------------------------
CREATE TABLE `fsComponentHistory` (
  `id` int(11) unsigned NOT NULL,
  `name` varchar(255) NOT NULL,
  `alias` varchar(255) DEFAULT NULL,
  `type` varchar(255) NOT NULL,
  `tag` varchar(255) NOT NULL,
  `rel` varchar(255) NOT NULL,
  `defaultConfig` text,
  `defaultSettings` text,
  `clientSettings` text,
  `eventId` bigint(20) unsigned DEFAULT NULL,
  `category` varchar(255) DEFAULT '',
  `historyStartDate` datetime DEFAULT NULL,
  `historyEndDate` datetime DEFAULT NULL,
  `historyAction` varchar(20) DEFAULT NULL,
  `historyUser` varchar(85) DEFAULT NULL,
  `historyId` int(11) unsigned NOT NULL,
  PRIMARY KEY (`historyId`) USING BTREE,
  KEY `idxfsComponentHistoryId` (`id`) USING BTREE,
  KEY `idxfsComponentHistoryName` (`name`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for fsComponentInTask
-- ----------------------------
CREATE TABLE `fsComponentInTask` (
  `id` int(11) unsigned NOT NULL,
  `componentId` int(11) unsigned DEFAULT NULL,
  `taskId` int(11) unsigned DEFAULT NULL,
  `eventId` bigint(20) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `idxfsComponentInTaskTaskId` (`taskId`,`componentId`) USING BTREE,
  KEY `idxfsComponentInTaskComponentId` (`componentId`,`taskId`) USING BTREE,
  KEY `idx fsComponentInTaskEventId` (`eventId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for fsComponents
-- ----------------------------
CREATE TABLE `fsComponents` (
  `id` int(11) unsigned NOT NULL,
  `name` varchar(255) NOT NULL,
  `alias` varchar(255) DEFAULT NULL,
  `type` varchar(255) NOT NULL DEFAULT 'component',
  `tag` varchar(255) NOT NULL,
  `rel` varchar(255) NOT NULL DEFAULT 'parent',
  `defaultConfig` text,
  `defaultSettings` text,
  `clientSettings` text,
  `eventId` bigint(20) unsigned DEFAULT NULL,
  `category` varchar(255) DEFAULT '',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `idxfsComponentsName` (`name`) USING BTREE,
  UNIQUE KEY `idxfsComponentsTag` (`tag`) USING BTREE,
  KEY `idxfsComponentsType` (`type`) USING BTREE,
  KEY `idxfsComponentsAlias` (`alias`) USING BTREE,
  KEY `idxfsComponentsEventId` (`eventId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for fsProtocolHistory
-- ----------------------------
CREATE TABLE `fsProtocolHistory` (
  `id` int(11) unsigned NOT NULL,
  `name` varchar(255) NOT NULL,
  `alias` varchar(255) DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL,
  `tag` varchar(255) DEFAULT NULL,
  `tasks` text,
  `settings` text,
  `eventId` bigint(20) unsigned DEFAULT NULL,
  `active` char(1) DEFAULT 'N',
  `notes` text,
  `loadEventId` bigint(20) unsigned DEFAULT NULL,
  `historyStartDate` datetime DEFAULT NULL,
  `historyEndDate` datetime DEFAULT NULL,
  `historyAction` varchar(20) DEFAULT NULL,
  `historyUser` varchar(85) DEFAULT NULL,
  `historyId` int(11) unsigned NOT NULL,
  PRIMARY KEY (`historyId`) USING BTREE,
  KEY `idx fsProtocolHistoryId` (`id`) USING BTREE,
  KEY `idx fsProtocolHistoryName` (`name`) USING BTREE,
  KEY `idx fsProtocolHistoryAlias` (`alias`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for fsProtocols
-- ----------------------------
CREATE TABLE `fsProtocols` (
  `id` int(11) unsigned NOT NULL,
  `name` varchar(255) NOT NULL,
  `alias` varchar(255) DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL,
  `tag` varchar(255) DEFAULT NULL,
  `tasks` text,
  `settings` text,
  `eventId` bigint(20) unsigned NOT NULL,
  `active` char(1) DEFAULT 'N',
  `notes` text,
  `loadEventId` bigint(20) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `idxfsProtocolsName` (`name`) USING BTREE,
  UNIQUE KEY `idxfsProtocolsAlias` (`alias`) USING BTREE,
  KEY `idxfsProtocolsTag` (`tag`) USING BTREE,
  KEY `idxfsProtocolsType` (`type`) USING BTREE,
  KEY `idxProtocolsEventId` (`eventId`) USING BTREE,
  KEY `idxfsProtocolsLoadEventId` (`loadEventId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for fsRoutineHistory
-- ----------------------------
CREATE TABLE `fsRoutineHistory` (
  `id` int(11) unsigned NOT NULL,
  `name` varchar(255) NOT NULL,
  `alias` varchar(255) DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL,
  `tag` varchar(255) DEFAULT NULL,
  `settings` text,
  `eventId` bigint(20) unsigned DEFAULT NULL,
  `taskId` int(11) unsigned DEFAULT NULL,
  `protocolId` int(11) unsigned DEFAULT NULL,
  `notes` text,
  `historyStartDate` datetime DEFAULT NULL,
  `historyEndDate` datetime DEFAULT NULL,
  `historyAction` varchar(20) DEFAULT NULL,
  `historyUser` varchar(85) DEFAULT NULL,
  `historyId` int(11) unsigned NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`historyId`) USING BTREE,
  KEY `idxfsRoutineHistoryId` (`id`) USING BTREE,
  KEY `idxfsRoutineHistoryName` (`name`) USING BTREE,
  KEY `idxfsRoutineHistoryAlias` (`alias`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for fsRoutines
-- ----------------------------
CREATE TABLE `fsRoutines` (
  `id` int(11) unsigned NOT NULL,
  `name` varchar(255) NOT NULL,
  `alias` varchar(255) DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL,
  `tag` varchar(255) DEFAULT NULL,
  `settings` text,
  `eventId` bigint(20) unsigned DEFAULT NULL,
  `taskId` int(11) unsigned DEFAULT NULL,
  `protocolId` int(11) unsigned DEFAULT NULL,
  `notes` text,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `idxfsRoutineName` (`name`) USING BTREE,
  UNIQUE KEY `idxfsRoutineAlias` (`alias`) USING BTREE,
  KEY `idxfsRoutinesTaskId` (`taskId`) USING BTREE,
  KEY `idxfsRoutinesProtocolId` (`protocolId`) USING BTREE,
  KEY `idxfsRoutinesEventId` (`eventId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for fsTaskHistory
-- ----------------------------
CREATE TABLE `fsTaskHistory` (
  `id` int(11) unsigned NOT NULL,
  `name` varchar(255) NOT NULL,
  `alias` varchar(255) DEFAULT NULL,
  `tag` varchar(255) DEFAULT NULL,
  `instructions` text,
  `settings` text,
  `eventId` bigint(20) unsigned DEFAULT NULL,
  `protocolId` int(11) unsigned DEFAULT NULL,
  `notes` text,
  `isReusable` tinyint(4) DEFAULT NULL,
  `historyStartDate` datetime DEFAULT NULL,
  `historyEndDate` datetime DEFAULT NULL,
  `historyAction` varchar(20) DEFAULT NULL,
  `historyUser` varchar(85) DEFAULT NULL,
  `historyId` int(11) unsigned NOT NULL,
  PRIMARY KEY (`historyId`) USING BTREE,
  KEY `idxfsTaskHistoryId` (`id`) USING BTREE,
  KEY `idxfsTaskHistoryName` (`name`) USING BTREE,
  KEY `idxfsTaskHistoryAlias` (`alias`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for fsTasks
-- ----------------------------
CREATE TABLE `fsTasks` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `alias` varchar(255) DEFAULT NULL,
  `tag` varchar(255) DEFAULT NULL,
  `instructions` text,
  `settings` text,
  `eventId` bigint(20) unsigned NOT NULL,
  `protocolId` int(11) unsigned NOT NULL,
  `notes` text,
  `isReusable` tinyint(4) DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `idxfsTasksName` (`name`) USING BTREE,
  UNIQUE KEY `idxfsTasksAlias` (`alias`) USING BTREE,
  KEY `idxfsTasksTag` (`tag`) USING BTREE,
  KEY `idxfsTasksProtocolId` (`protocolId`) USING BTREE,
  KEY `idxfsTasksEventId` (`eventId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- ----------------------------
-- Table structure for genelist
-- ----------------------------
CREATE TABLE `genelist` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `sampleId` varchar(80) NOT NULL,
  `name` varchar(100) NOT NULL,
  `gene` varchar(255) NOT NULL,
  `alias` mediumtext,
  `predefined` mediumtext,
  `disease` mediumtext,
  `phenotype` mediumtext,
  `aoh` varchar(255) DEFAULT NULL,
  `ip` varchar(255) DEFAULT NULL,
  `list` varchar(255) DEFAULT NULL,
  `tso` varchar(255) DEFAULT NULL,
  `lc` varchar(255) DEFAULT NULL,
  `eventId` bigint(20) unsigned DEFAULT NULL,
  `final` varchar(8) DEFAULT 'false',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `idxgenelistName` (`name`,`gene`,`sampleId`) USING BTREE,
  KEY `idxgenelistGene` (`gene`) USING BTREE,
  KEY `idxgenelistSampleId` (`sampleId`) USING BTREE,
  KEY `idxgenelistEventId` (`eventId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for groups
-- ----------------------------
CREATE TABLE `groups` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `groupId` varchar(80) NOT NULL,
  `managerId` varchar(80) DEFAULT NULL,
  `description` text,
  `eventId` bigint(20) unsigned NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `idxgroupsGroupId` (`groupId`) USING BTREE,
  KEY `idxgroupsEventId` (`eventId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for hl7Communication
-- ----------------------------
CREATE TABLE `hl7Communication` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `message` text,
  `messageCode` varchar(50) DEFAULT NULL,
  `messageGUID` varchar(50) DEFAULT NULL,
  `importEventId` bigint(20) unsigned DEFAULT NULL,
  `eventId` bigint(20) unsigned NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `idxhl7CommunicationEventId` (`eventId`) USING BTREE,
  KEY `idxhl7CommunicationImportEventId` (`importEventId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for immunologyGelResults
-- ----------------------------
CREATE TABLE `immunologyGelResults` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `requestId` varchar(80) DEFAULT NULL,
  `sampleId` varchar(80) DEFAULT NULL,
  `result` varchar(255) DEFAULT NULL,
  `eventId` bigint(20) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `idximmunologyGelResultsRequestId` (`requestId`,`sampleId`) USING BTREE,
  KEY `idximmunologyGelResultsSampleId` (`sampleId`,`requestId`) USING BTREE,
  KEY `idximmunologyGelResultsEventId` (`eventId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for instrumentContacts
-- ----------------------------
CREATE TABLE `instrumentContacts` (
  `contactId` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `instrumentId` varchar(80) NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `address` varchar(100) DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `state` varchar(100) DEFAULT NULL,
  `postalCode` varchar(50) DEFAULT NULL,
  `office` varchar(50) DEFAULT NULL,
  `mobile` varchar(50) DEFAULT NULL,
  `contactType` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `eventId` bigint(20) unsigned NOT NULL,
  PRIMARY KEY (`contactId`) USING BTREE,
  UNIQUE KEY `idxinstrumentContactsInstrumentId` (`instrumentId`) USING BTREE,
  KEY `idxinstrumentContactsEventId` (`eventId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for instrumentHistory
-- ----------------------------
CREATE TABLE `instrumentHistory` (
  `id` int(11) unsigned NOT NULL,
  `instrumentId` varchar(80) NOT NULL DEFAULT '',
  `instrumentType` varchar(100) DEFAULT NULL,
  `description` text,
  `make` varchar(100) DEFAULT NULL,
  `model` varchar(100) DEFAULT NULL,
  `serialNumber` varchar(80) DEFAULT NULL,
  `manufacturer` varchar(80) DEFAULT NULL,
  `name` varchar(100) DEFAULT NULL,
  `location` varchar(100) DEFAULT NULL,
  `QCType` varchar(80) DEFAULT NULL,
  `status` varchar(80) DEFAULT NULL,
  `eventId` bigint(20) unsigned NOT NULL,
  `ipAddress` varchar(50) DEFAULT NULL,
  `port` int(11) DEFAULT NULL,
  `historyStartDate` datetime DEFAULT NULL,
  `historyEndDate` datetime DEFAULT NULL,
  `historyAction` varchar(20) DEFAULT NULL,
  `historyUser` varchar(85) DEFAULT NULL,
  `historyId` int(11) unsigned NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`historyId`) USING BTREE,
  UNIQUE KEY `idxinstrumentHistoryInstrumentId` (`instrumentId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for instrumentResults
-- ----------------------------
CREATE TABLE `instrumentResults` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `instrumentId` varchar(80) NOT NULL,
  `task` varchar(100) NOT NULL,
  `property` varchar(100) DEFAULT NULL,
  `result` varchar(50) NOT NULL,
  `units` varchar(50) DEFAULT NULL,
  `comments` text,
  `eventId` bigint(20) unsigned NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `idxinstrumentResultsInstrumentId` (`instrumentId`,`task`,`id`) USING BTREE,
  KEY `idxinstrumentResutlsEventId` (`eventId`) USING BTREE,
  KEY `idxinstrumentResultsTask` (`task`,`property`,`instrumentId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for instrumentService
-- ----------------------------
CREATE TABLE `instrumentService` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `instrumentId` varchar(80) NOT NULL,
  `contactId` int(11) unsigned NOT NULL,
  `ticketId` varchar(100) NOT NULL DEFAULT '',
  `description` text NOT NULL,
  `status` varchar(50) DEFAULT NULL,
  `eventId` bigint(20) unsigned NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `idxinstrumentServiceInstrumentId` (`instrumentId`) USING BTREE,
  KEY `idxinstrumentServiceEventId` (`eventId`) USING BTREE,
  KEY `idxinstrumentServiceContactId` (`contactId`,`instrumentId`) USING BTREE,
  KEY `idxinstrumentServiceTicketId` (`ticketId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for instruments
-- ----------------------------
CREATE TABLE `instruments` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `instrumentId` varchar(80) NOT NULL DEFAULT '',
  `instrumentType` varchar(100) DEFAULT NULL,
  `description` text,
  `make` varchar(100) DEFAULT NULL,
  `model` varchar(100) DEFAULT NULL,
  `serialNumber` varchar(80) DEFAULT NULL,
  `manufacturer` varchar(80) DEFAULT NULL,
  `name` varchar(100) DEFAULT NULL,
  `location` varchar(100) DEFAULT NULL,
  `QCType` varchar(80) DEFAULT NULL,
  `status` varchar(80) DEFAULT NULL,
  `eventId` bigint(20) unsigned NOT NULL,
  `ipAddress` varchar(50) DEFAULT NULL,
  `port` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `idxinstrumentsInstrumentId` (`instrumentId`),
  KEY `idxinstrumentsEventId` (`eventId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for insuranceCarriers
-- ----------------------------
CREATE TABLE `insuranceCarriers` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `amdCarrierCode` varchar(100) DEFAULT NULL,
  `carrierName` varchar(100) NOT NULL,
  `address1` varchar(100) DEFAULT NULL,
  `address2` varchar(100) DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `state` varchar(100) DEFAULT NULL,
  `country` varchar(100) DEFAULT NULL,
  `postalCode` varchar(50) DEFAULT NULL,
  `edicpidNumber` varchar(50) DEFAULT NULL,
  `phoneNumber` varchar(50) DEFAULT NULL,
  `active` bit(1) DEFAULT b'1',
  `eventId` bigint(20) unsigned NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `idxinsuranceCarriersCarrierName` (`carrierName`) USING BTREE,
  UNIQUE KEY `idxinsuranceCarriersAmdCarrierCode` (`amdCarrierCode`) USING BTREE,
  KEY `idxinsuranceCarriersEventId` (`eventId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- ----------------------------
-- Table structure for inventoryItems
-- ----------------------------
CREATE TABLE `inventoryItems` (
  `inventoryId` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `inventoryItem` varchar(80) NOT NULL,
  `inventoryType` varchar(50) DEFAULT NULL,
  `catalogNumber` varchar(80) DEFAULT NULL,
  `vendor` varchar(80) DEFAULT NULL,
  `quantity` decimal(10,2) DEFAULT NULL,
  `units` varchar(50) DEFAULT NULL,
  `threshold` varchar(50) DEFAULT NULL,
  `thresholdUnits` varchar(50) DEFAULT NULL,
  `eventId` bigint(20) unsigned NOT NULL,
  PRIMARY KEY (`inventoryId`) USING BTREE,
  UNIQUE KEY `idxInventoryItemsInventoryItem` (`inventoryItem`) USING BTREE,
  KEY `idxinventoryItemsEventId` (`eventId`) USING BTREE,
  KEY `idxinventoryItemsVendor` (`vendor`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for inventoryMMUsage
-- ----------------------------
CREATE TABLE `inventoryMMUsage` (
  `usageId` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `inventoryItem` varchar(80) NOT NULL,
  `step` varchar(100) DEFAULT NULL,
  `label` varchar(80) DEFAULT NULL,
  `amount` decimal(10,2) DEFAULT NULL,
  `units` varchar(50) DEFAULT NULL,
  `numSamplesAutoCalc` varchar(5) DEFAULT NULL,
  `isExtraRowForCalc` varchar(5) DEFAULT NULL,
  `numSamples` int(11) DEFAULT '1',
  `errorTolerance` int(11) DEFAULT '0',
  `eventId` bigint(20) unsigned NOT NULL,
  PRIMARY KEY (`usageId`) USING BTREE,
  KEY `idxinventoryMMUsageInventoryItem` (`inventoryItem`) USING BTREE,
  KEY `idxinventoryMMUsageEventId` (`eventId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for inventoryOrders
-- ----------------------------
CREATE TABLE `inventoryOrders` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `lotId` varchar(80) NOT NULL,
  `itemId` varchar(80) NOT NULL,
  `vendorId` varchar(80) DEFAULT NULL,
  `quantity` float DEFAULT '0',
  `quantityReceived` float DEFAULT '0',
  `quantityAvailable` float DEFAULT '0',
  `shipmentNumber` varchar(255) DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `itemCost` float DEFAULT '0',
  `taxCost` float DEFAULT '0',
  `shippingCost` float DEFAULT '0',
  `otherCosts` float DEFAULT '0',
  `storageLocation` varchar(255) DEFAULT NULL,
  `receivedEventId` bigint(20) unsigned DEFAULT NULL,
  `putAwayBy` varchar(255) DEFAULT NULL,
  `expirationDate` datetime DEFAULT NULL,
  `eventId` bigint(20) unsigned NOT NULL,
  `lastUpdateEventId` bigint(20) unsigned NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `idxinventoryOrdersId` (`itemId`) USING BTREE,
  KEY `idxinventoryOrdersLotId` (`lotId`) USING BTREE,
  KEY `idxinventoryOrdersEventId` (`eventId`) USING BTREE,
  KEY `idxinventoryOrdersLastUpdateEventId` (`lastUpdateEventId`) USING BTREE,
  KEY `idxinventoryOrdersReceivedEventId` (`receivedEventId`) USING BTREE,
  KEY `idxinventoryOrdersVendorId` (`vendorId`,`itemId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for inventoryUsage
-- ----------------------------
CREATE TABLE `inventoryUsage` (
  `usageId` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `inventoryItem` varchar(80) NOT NULL,
  `step` varchar(100) DEFAULT NULL,
  `amount` decimal(10,2) NOT NULL DEFAULT '0.00',
  `units` varchar(50) DEFAULT NULL,
  `inventoryItemUsage` varchar(100) NULL,
  `eventId` bigint(20) unsigned NOT NULL,
  PRIMARY KEY (`usageId`) USING BTREE,
  KEY `idxinventoryUsageInventoryItem` (`inventoryItem`) USING BTREE,
  KEY `idxinventoryUsageEventId` (`eventId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for inventoryVendors
-- ----------------------------
CREATE TABLE `inventoryVendors` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `itemId` varchar(80) NOT NULL DEFAULT '',
  `vendorId` varchar(80) NOT NULL DEFAULT '',
  `vendorItemId` varchar(80) DEFAULT NULL,
  `receivedEventId` bigint(20) unsigned DEFAULT NULL,
  `orderLeadTime` int(11) DEFAULT NULL,
  `cost` float DEFAULT '0',
  `status` varchar(100) DEFAULT NULL,
  `eventId` bigint(20) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `idxinventoryVendorsVendorId` (`vendorId`, `itemId`) USING BTREE,
  KEY `idxinventoryVendorsItemId` (`itemId`) USING BTREE,
  KEY `idxinventoryVendorsReceivedEventId` (`receivedEventId`) USING BTREE,
  KEY `idxinventoryVendorsEventId` (`eventId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for karyoSlides
-- ----------------------------
CREATE TABLE `karyoSlides` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `requestId` varchar(80) DEFAULT NULL,
  `batchId` varchar(80) NOT NULL,
  `slideId` varchar(80) NOT NULL,
  `slideType` varchar(100) DEFAULT NULL,
  `eventId` bigint(20) unsigned NOT NULL,
  `culturedSample` varchar(80) DEFAULT NULL,
  `cultureId` varchar(80) DEFAULT NULL,
  `harvestId` varchar(80) DEFAULT NULL,
  `reviewSlideEventId` bigint(20) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `idxkaryoSlidesSlideId` (`slideId`) USING BTREE,
  KEY `idxkaryoSlidesBatchId` (`batchId`) USING BTREE,
  KEY `idxkaryoSlidesRequestId` (`requestId`) USING BTREE,
  KEY `idxkaryoSlidesEventId` (`eventId`) USING BTREE,
  KEY `idxkaryoSlidesReviewSlideEventId` (`reviewSlideEventId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for karyotypeAnalysis
-- ----------------------------
CREATE TABLE `karyotypeAnalysis` (
  `id` int(11) unsigned NOT NULL,
  `slideId` varchar(80) NOT NULL,
  `reqId` varchar(80) DEFAULT NULL,
  `cellNum` varchar(100) DEFAULT NULL,
  `rawData` varchar(255) DEFAULT NULL,
  `tech` varchar(85) DEFAULT NULL,
  `comments` text,
  `eventId` bigint(20) unsigned NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `idxkaryotypeAnalysisSlideId` (`slideId`) USING BTREE,
  KEY `idxkaryotypeAnalysisReqId` (`reqId`) USING BTREE,
  KEY `idxkaryotypeAnalysisEventId` (`eventId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for karyotypeCaseResults
-- ----------------------------
CREATE TABLE `karyotypeCaseResults` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `requestId` varchar(80) NOT NULL,
  `totalCounts` varchar(50) DEFAULT NULL,
  `totalColonies` varchar(50) DEFAULT NULL,
  `totalAnalyzed` varchar(50) DEFAULT NULL,
  `totalKaryotyped` varchar(50) DEFAULT NULL,
  `totalScored` varchar(50) DEFAULT NULL,
  `caseResults` varchar(255) DEFAULT NULL,
  `caseFinalResults` varchar(255) DEFAULT NULL,
  `eventId` bigint(20) unsigned NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `idxkaryotypeCaseResultsrequestId` (`requestId`) USING BTREE,
  KEY `idxkaryotypeCaseResultsEventId` (`eventId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for karyotypeSlideResults
-- ----------------------------
CREATE TABLE `karyotypeSlideResults` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `requestId` varchar(80) NOT NULL,
  `slideId` varchar(80) NOT NULL,
  `slideResults` varchar(100) DEFAULT NULL,
  `imageName` varchar(255) DEFAULT NULL,
  `eventId` bigint(20) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `idxkaryotypeSlideResultsSlideId` (`slideId`) USING BTREE,
  KEY `idxkaryotypeSlideResultsRequestId` (`requestId`) USING BTREE,
  KEY `idxkaryotypeSlideResultsEventId` (`eventId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- ----------------------------
-- Table structure for masterMixArray
-- ----------------------------
CREATE TABLE `masterMixArray` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `mmCode` varchar(80) NOT NULL DEFAULT '',
  `count` int(11) DEFAULT NULL,
  `overage` varchar(100) DEFAULT NULL,
  `overageOverride` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `idxmasterMixArrayMmCode` (`mmCode`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for masterMixComponents
-- ----------------------------
CREATE TABLE `masterMixComponents` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `mmId` int(11) unsigned NOT NULL,
  `reagentType` varchar(100) DEFAULT NULL,
  `amount` decimal(10,2) DEFAULT NULL,
  `eventId` bigint(20) unsigned NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `idxmasterMixComponentsMmId` (`mmId`) USING BTREE,
  KEY `idxmasterMixComponentsEventId` (`eventId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for masterMixInstructions
-- ----------------------------
CREATE TABLE `masterMixInstructions` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `mmId` int(11) unsigned NOT NULL,
  `order` int(11) unsigned NOT NULL DEFAULT '1',
  `instruction` text NOT NULL,
  `eventId` bigint(20) unsigned NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `idxmasterMixInstructionsMmId` (`mmId`,`order`) USING BTREE,
  KEY `idxmasterMixInstructionsEventId` (`eventId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for masterMixInstructionsHistory
-- ----------------------------
CREATE TABLE `masterMixInstructionsHistory` (
  `id` int(11) unsigned NOT NULL,
  `mmId` int(11) unsigned NOT NULL,
  `order` int(11) unsigned NOT NULL,
  `instruction` text NOT NULL,
  `eventId` bigint(20) unsigned NOT NULL,
  `historyStartDate` datetime DEFAULT NULL,
  `historyEndDate` datetime DEFAULT NULL,
  `historyAction` varchar(20) DEFAULT NULL,
  `historyUser` varchar(85) DEFAULT NULL,
  `historyId` int(11) unsigned NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`historyId`) USING BTREE,
  UNIQUE KEY `idxmasterMixInstructionsHistoryMmId` (`mmId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for masterMixKeywords
-- ----------------------------
CREATE TABLE `masterMixKeywords` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `mmId` int(11) unsigned NOT NULL,
  `keyword` varchar(100) NOT NULL,
  `eventId` bigint(20) unsigned NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `idxmasterMixKeywordsMmId` (`mmId`,`keyword`) USING BTREE,
  KEY `idxmasterMixKeywordsEventId` (`eventId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for masterMixes
-- ----------------------------
CREATE TABLE `masterMixes` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `code` varchar(80) NOT NULL,
  `name` varchar(100) NOT NULL,
  `overagePercentage` int(11) unsigned NOT NULL DEFAULT '0',
  `eventId` bigint(20) unsigned NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `idxmasterMixesCode` (`code`) USING BTREE,
  KEY `idxmasterMixesEventId` (`eventId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for masterMixesHistory
-- ----------------------------
CREATE TABLE `masterMixesHistory` (
  `id` int(11) unsigned NOT NULL,
  `code` varchar(80) DEFAULT NULL,
  `name` varchar(100) NOT NULL,
  `overagePercentage` int(11) unsigned NOT NULL,
  `eventId` bigint(20) unsigned NOT NULL,
  `historyStartDate` datetime DEFAULT NULL,
  `historyEndDate` datetime DEFAULT NULL,
  `historyAction` varchar(20) DEFAULT NULL,
  `historyUser` varchar(85) DEFAULT NULL,
  `historyId` int(11) unsigned NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`historyId`) USING BTREE,
  UNIQUE KEY `idxmasterMixesHistoryId` (`id`) USING BTREE,
  KEY `idmasterMixesHistoryCode` (`code`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- ----------------------------
-- Table structure for methods
-- ----------------------------
CREATE TABLE `methods` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `methodCode` varchar(80) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text,
  `eventId` bigint(20) unsigned NOT NULL,
  `disabled` bit(1) DEFAULT b'0',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `idxmethodsName` (`name`) USING BTREE,
  UNIQUE KEY `idxMethodsMethodCode` (`methodCode`) USING BTREE,
  KEY `idxmethodsEventId` (`eventId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for mmcodesForPanel
-- ----------------------------
CREATE TABLE `mmcodesForPanel` (
  `Id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `panelId` int(11) unsigned NOT NULL,
  `mmCode` varchar(80) NOT NULL,
  `eventId` bigint(20) unsigned NOT NULL,
  PRIMARY KEY (`Id`) USING BTREE,
  UNIQUE KEY `idxmmcodesForPanelPanelId` (`panelId`,`mmCode`),
  KEY `idxmmcodesForPanelMmCode` (`mmCode`) USING BTREE,
  KEY `idxmmcodesForPanelEventId` (`eventId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for normalizationTargetHistory
-- ----------------------------
CREATE TABLE `normalizationTargetHistory` (
  `normStep` varchar(100) NOT NULL,
  `id` int(11) unsigned NOT NULL,
  `targetConcentration` float DEFAULT NULL,
  `targetVolume` float DEFAULT NULL,
  `eventId` bigint(20) unsigned NOT NULL,
  `historyStartDate` datetime DEFAULT NULL,
  `historyEndDate` datetime DEFAULT NULL,
  `historyAction` varchar(20) DEFAULT NULL,
  `historyUser` varchar(85) DEFAULT NULL,
  `historyId` int(11) unsigned NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`historyId`) USING BTREE,
  KEY `idxnormalizationTargetHistoryNormStep` (`normStep`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for normalizationTargets
-- ----------------------------
CREATE TABLE `normalizationTargets` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `normStep` varchar(100) NOT NULL,
  `targetConcentration` float DEFAULT NULL,
  `targetVolume` float DEFAULT NULL,
  `eventId` bigint(20) unsigned NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `idxnormalizationTargetsNormStep` (`normStep`),
  KEY `idxnormalizationTargetsEventId` (`eventId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for normalizeResultHistory
-- ----------------------------
CREATE TABLE `normalizeResultHistory` (
  `id` int(11) unsigned NOT NULL,
  `quantId` int(11) unsigned NOT NULL,
  `targetConcentration` float DEFAULT NULL,
  `targetVolume` float DEFAULT NULL,
  `calculatedDiluentVolume` float DEFAULT NULL,
  `calculatedSampleVolume` float DEFAULT NULL,
  `actualDiluentVolume` float DEFAULT NULL,
  `actualSampleVolume` float DEFAULT NULL,
  `calculatedFinalConcentration` float DEFAULT NULL,
  `calculatedFinalVolume` float DEFAULT NULL,
  `result` varchar(255) DEFAULT '',
  `eventId` bigint(20) unsigned NOT NULL,
  `historyStartDate` datetime DEFAULT NULL,
  `historyEndDate` datetime DEFAULT NULL,
  `historyAction` varchar(20) DEFAULT NULL,
  `historyUser` varchar(85) DEFAULT NULL,
  `historyId` int(11) unsigned NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`historyId`) USING BTREE,
  KEY `idxnormalizeResultHistoryQuantId` (`quantId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for normalizeResults
-- ----------------------------
CREATE TABLE `normalizeResults` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `quantId` int(11) unsigned NOT NULL,
  `targetConcentration` float DEFAULT NULL,
  `targetVolume` float DEFAULT NULL,
  `calculatedDiluentVolume` float DEFAULT NULL,
  `calculatedSampleVolume` float DEFAULT NULL,
  `actualDiluentVolume` float DEFAULT NULL,
  `actualSampleVolume` float DEFAULT NULL,
  `calculatedFinalConcentration` float DEFAULT NULL,
  `calculatedFinalVolume` float DEFAULT NULL,
  `result` varchar(100) DEFAULT '',
  `eventId` bigint(20) unsigned NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `idxnormalizeResultsQuantId` (`quantId`) USING BTREE,
  KEY `idxnormalizeResultsEventId` (`eventId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- ----------------------------
-- Table structure for orderLog
-- ----------------------------
CREATE TABLE `orderLog` (
  `lineItemId` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `poNumber` varchar(80) NOT NULL,
  `category` varchar(45) DEFAULT NULL,
  `inventoryItem` varchar(80) NOT NULL,
  `catalogNumber` varchar(80) DEFAULT NULL,
  `vendor` varchar(80) NOT NULL,
  `projectType` varchar(50) DEFAULT NULL,
  `quantity` decimal(10,2) DEFAULT NULL,
  `quantityReceived` decimal(10,2) DEFAULT '0.00',
  `unitOfMeasure` varchar(50) DEFAULT NULL,
  `costPerUnit` decimal(10,2) DEFAULT NULL,
  `confirmationNumber` varchar(50) DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL,
  `requestDate` date DEFAULT NULL,
  `approveDate` date DEFAULT NULL,
  `orderDate` date DEFAULT NULL,
  `receivedDate` date DEFAULT NULL,
  `comments` text,
  `eventId` bigint(20) unsigned NOT NULL,
  `lastUpdateEventId` bigint(20) unsigned DEFAULT NULL,
  PRIMARY KEY (`lineItemId`) USING BTREE,
  KEY `idxorderLogpoNumber` (`poNumber`) USING BTREE,
  KEY `idxorderLogEventId` (`eventId`) USING BTREE,
  KEY `idxorderLogLastUpdateEventId` (`lastUpdateEventId`) USING BTREE,
  KEY `idxorderLogVendor` (`vendor`) USING BTREE,
  KEY `idxorderLogInventoryItem` (`inventoryItem`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for orderLogHistory
-- ----------------------------
CREATE TABLE `orderLogHistory` (
  `lineItemId` int(11) unsigned NOT NULL,
  `poNumber` varchar(80) NOT NULL,
  `category` varchar(45) DEFAULT NULL,
  `inventoryItem` varchar(80) NOT NULL,
  `catalogNumber` varchar(80) DEFAULT NULL,
  `vendor` varchar(80) NOT NULL,
  `projectType` varchar(50) DEFAULT NULL,
  `quantity` decimal(10,2) DEFAULT NULL,
  `quantityReceived` decimal(10,2) DEFAULT '0.00',
  `unitOfMeasure` varchar(50) DEFAULT NULL,
  `costPerUnit` decimal(10,2) DEFAULT NULL,
  `confirmationNumber` varchar(50) DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL,
  `requestDate` date DEFAULT NULL,
  `approveDate` date DEFAULT NULL,
  `orderDate` date DEFAULT NULL,
  `receivedDate` date DEFAULT NULL,
  `comments` text,
  `eventId` bigint(20) unsigned NOT NULL,
  `lastUpdateEventId` bigint(20) unsigned DEFAULT NULL,
  `historyStartDate` datetime DEFAULT NULL,
  `historyEndDate` datetime DEFAULT NULL,
  `historyAction` varchar(20) DEFAULT NULL,
  `historyUser` varchar(85) DEFAULT NULL,
  `historyId` int(11) unsigned NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`historyId`) USING BTREE,
  KEY `idxorderLogHistoryPoNumber` (`poNumber`) USING BTREE,
  KEY `idxorderLogHistoryLineItemId` (`lineItemId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for organizationSites
-- ----------------------------
CREATE TABLE `organizationSites` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `siteId` varchar(80) NOT NULL,
  `orgId` varchar(80) NOT NULL,
  `name` varchar(100) NOT NULL,
  `address1` varchar(100) DEFAULT NULL,
  `address2` varchar(100) DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `state` varchar(100) DEFAULT NULL,
  `postalcode` varchar(50) DEFAULT NULL,
  `country` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `phone1` varchar(50) DEFAULT NULL,
  `phone2` varchar(50) DEFAULT NULL,
  `fax1` varchar(80) DEFAULT NULL,
  `fax2` varchar(80) DEFAULT NULL,
  `timezone` varchar(50) DEFAULT NULL,
  `dateFormat` varchar(50) DEFAULT NULL,
  `language` varchar(50) DEFAULT NULL,
  `eventId` bigint(20) unsigned NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `idxorganizationSitesSiteId` (`siteId`) USING BTREE,
  KEY `idxorganizationSitesOrgId` (`orgId`,`name`) USING BTREE,
  KEY `idxorganizationSitesName` (`name`,`orgId`) USING BTREE,
  KEY `idxorganizationSitesEventId` (`eventId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for organizations
-- ----------------------------
CREATE TABLE `organizations` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `orgId` varchar(80) NOT NULL,
  `name` varchar(100) NOT NULL,
  `eventId` bigint(20) unsigned NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `idxorganizationsOrgId` (`orgId`) USING BTREE,
  UNIQUE KEY `idxorganizationsNames` (`name`) USING BTREE,
  KEY `idxorganizationsEventId` (`eventId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for panels
-- ----------------------------
CREATE TABLE `panels` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `panelCode` varchar(80) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text NOT NULL,
  `abbreviation` varchar(50) NOT NULL,
  `type` varchar(80) NOT NULL,
  `genes` varchar(50) DEFAULT NULL,
  `isCustomGenePanel` bit(1) NOT NULL DEFAULT b'0',
  `disabled` bit(1) NOT NULL DEFAULT b'0',
  `eventId` bigint(20) unsigned NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `idxpanelsPanelCode` (`panelCode`) USING BTREE,
  UNIQUE KEY `idxpanelsName` (`name`) USING BTREE,
  UNIQUE KEY `idxpanelsAbbreviation` (`abbreviation`) USING BTREE,
  KEY `idxpanelsEventId` (`eventId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for panelsForEntities
-- ----------------------------
CREATE TABLE `panelsForEntities` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `orgId` varchar(80) NOT NULL,
  `panelId` int(11) unsigned NOT NULL,
  `eventId` bigint(20) unsigned NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `idxpanelsForEntitiesOrgId` (`orgId`,`panelId`) USING BTREE,
  KEY `idxpanelsForEntitiesEventId` (`eventId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- ----------------------------
-- Table structure for patientBilling
-- ----------------------------
CREATE TABLE `patientBilling` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `patientId` varchar(80) NOT NULL,
  `requestId` varchar(80) DEFAULT NULL,
  `billTo` varchar(100) DEFAULT NULL,
  `governmentPayment1` bit(1) DEFAULT b'0',
  `governmentPolicyNumber1` varchar(100) DEFAULT NULL,
  `governmentPayment2` bit(1) DEFAULT b'0',
  `governmentPolicyNumber2` varchar(100) DEFAULT NULL,
  `selfpay` bit(1) DEFAULT b'0',
  `privateInsurance` bit(1) DEFAULT b'0',
  `carrierId1` int(11) unsigned DEFAULT NULL,
  `policyNumber1` varchar(100) DEFAULT NULL,
  `groupNumber1` varchar(100) DEFAULT NULL,
  `policyHolder1FirstName` varchar(100) DEFAULT NULL,
  `policyHolder1LastName` varchar(100) DEFAULT NULL,
  `policyHolder1Id` varchar(100) DEFAULT NULL,
  `policyHolder1DOB` date DEFAULT NULL,
  `policyHolder1Relationship` varchar(80) DEFAULT NULL,
  `carrierId2` int(11) unsigned DEFAULT NULL,
  `policyNumber2` varchar(100) DEFAULT NULL,
  `groupNumber2` varchar(100) DEFAULT NULL,
  `policyHolder2FirstName` varchar(100) DEFAULT NULL,
  `policyHolder2LastName` varchar(100) DEFAULT NULL,
  `policyHolder2Id` varchar(100) DEFAULT NULL,
  `policyHolder2DOB` date DEFAULT NULL,
  `policyHolder2Relationship` varchar(80) DEFAULT NULL,
  `eventId` bigint(20) unsigned NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `idxpatientBillingEventId` (`eventId`) USING BTREE,
  KEY `idxpatientBillingCarrierId1` (`carrierId1`) USING BTREE,
  KEY `idxpatientBillingCarrierId2` (`carrierId2`) USING BTREE,
  KEY `idxpatientBillingPatientId` (`patientId`) USING BTREE,
  KEY `idxpatientBillingRequestId` (`requestId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for patientBillingDefault
-- ----------------------------
CREATE TABLE `patientBillingDefault` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `patientId` varchar(80) NOT NULL,
  `billTo` varchar(100) DEFAULT NULL,
  `governmentPayment1` bit(1) DEFAULT b'0',
  `governmentPolicyNumber1` varchar(100) DEFAULT NULL,
  `governmentPayment2` bit(1) DEFAULT b'0',
  `governmentPolicyNumber2` varchar(100) DEFAULT NULL,
  `selfpay` bit(1) DEFAULT b'0',
  `privateInsurance` bit(1) DEFAULT b'0',
  `carrierId1` int(11) unsigned DEFAULT NULL,
  `policyNumber1` varchar(100) DEFAULT NULL,
  `groupNumber1` varchar(100) DEFAULT NULL,
  `policyHolder1FirstName` varchar(100) DEFAULT NULL,
  `policyHolder1LastName` varchar(100) DEFAULT NULL,
  `policyHolder1Id` varchar(100) DEFAULT NULL,
  `policyHolder1DOB` date DEFAULT NULL,
  `policyHolder1Relationship` varchar(80) DEFAULT NULL,
  `carrierId2` int(11) unsigned DEFAULT NULL,
  `policyNumber2` varchar(100) DEFAULT NULL,
  `groupNumber2` varchar(100) DEFAULT NULL,
  `policyHolder2FirstName` varchar(100) DEFAULT NULL,
  `policyHolder2LastName` varchar(100) DEFAULT NULL,
  `policyHolder2Id` varchar(100) DEFAULT NULL,
  `policyHolder2DOB` date DEFAULT NULL,
  `policyHolder2Relationship` varchar(80) DEFAULT NULL,
  `eventId` bigint(20) unsigned NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `idxpatientBillingDefaultPatientId` (`patientId`) USING BTREE,
  KEY `idxpatientBillingDefaultEventId` (`eventId`) USING BTREE,
  KEY `idxpatientBillingDefaultCarrierId1` (`carrierId1`) USING BTREE,
  KEY `idxpatientBillingDefaultCarrierId2` (`carrierId2`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for patientBillingHistory
-- ----------------------------
CREATE TABLE `patientBillingHistory` (
  `id` int(11) unsigned NOT NULL,
  `patientId` varchar(80) NOT NULL,
  `requestId` varchar(80) DEFAULT NULL,
  `billTo` varchar(100) DEFAULT NULL,
  `governmentPayment1` bit(1) DEFAULT b'0',
  `governmentPolicyNumber1` varchar(100) DEFAULT NULL,
  `governmentPayment2` bit(1) DEFAULT b'0',
  `governmentPolicyNumber2` varchar(100) DEFAULT NULL,
  `selfpay` bit(1) DEFAULT b'0',
  `privateInsurance` bit(1) DEFAULT b'0',
  `carrierId1` int(11) unsigned DEFAULT NULL,
  `policyNumber1` varchar(100) DEFAULT NULL,
  `groupNumber1` varchar(100) DEFAULT NULL,
  `policyHolder1FirstName` varchar(100) DEFAULT NULL,
  `policyHolder1LastName` varchar(100) DEFAULT NULL,
  `policyHolder1Id` varchar(100) DEFAULT NULL,
  `policyHolder1DOB` date DEFAULT NULL,
  `policyHolder1Relationship` varchar(80) DEFAULT NULL,
  `carrierId2` int(11) unsigned DEFAULT NULL,
  `policyNumber2` varchar(100) DEFAULT NULL,
  `groupNumber2` varchar(100) DEFAULT NULL,
  `policyHolder2FirstName` varchar(100) DEFAULT NULL,
  `policyHolder2LastName` varchar(100) DEFAULT NULL,
  `policyHolder2Id` varchar(100) DEFAULT NULL,
  `policyHolder2DOB` date DEFAULT NULL,
  `policyHolder2Relationship` varchar(80) DEFAULT NULL,
  `eventId` bigint(20) unsigned NOT NULL,
  `historyStartDate` datetime DEFAULT NULL,
  `historyEndDate` datetime DEFAULT NULL,
  `historyAction` varchar(20) DEFAULT NULL,
  `historyUser` varchar(85) DEFAULT NULL,
  `historyId` int(11) unsigned NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`historyId`) USING BTREE,
  KEY `idxpatientBillingPatientId` (`patientId`) USING BTREE,
  KEY `idxpatientBillingRequestId` (`requestId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for patientClinical
-- ----------------------------
CREATE TABLE `patientClinical` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `patientId` varchar(80) NOT NULL,
  `diagnosis` text,
  `histoDiagnosis` text,
  `presentationAge` varchar(50) DEFAULT NULL,
  `medications` text,
  `problemMedications` text,
  `allergies` text,
  `clinicalNotes` text,
  `clinicalHIstory` text,
  `geneticCounselor` varchar(100) DEFAULT NULL,
  `subjectId` varchar(100) DEFAULT NULL,
  `eventId` bigint(20) unsigned NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `idxpatientClinicaPatientId` (`patientId`) USING BTREE,
  KEY `idxpatientClinicalEventId` (`eventId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for patientClinicalHistory
-- ----------------------------
CREATE TABLE `patientClinicalHistory` (
  `id` int(11) unsigned NOT NULL,
  `patientId` varchar(80) NOT NULL,
  `diagnosis` text,
  `histoDiagnosis` text,
  `presentationAge` varchar(50) DEFAULT NULL,
  `medications` text,
  `problemMedications` text,
  `allergies` text,
  `clinicalNotes` text,
  `clinicalHIstory` text,
  `geneticCounselor` varchar(100) DEFAULT NULL,
  `subjectId` varchar(100) DEFAULT NULL,
  `eventId` bigint(20) unsigned NOT NULL,
  `historyStartDate` datetime DEFAULT NULL,
  `historyEndDate` datetime DEFAULT NULL,
  `historyAction` varchar(20) DEFAULT NULL,
  `historyUser` varchar(85) DEFAULT NULL,
  `historyId` int(11) unsigned NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`historyId`) USING BTREE,
  KEY `idxpatientClinicalHistoryPatientId` (`patientId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for patientEthnicities
-- ----------------------------
CREATE TABLE `patientEthnicities` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `patientId` varchar(80) NOT NULL,
  `ethnicityName` varchar(50) NOT NULL,
  `eventId` bigint(20) unsigned NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `idxpatientEthnicitiesPatientId` (`patientId`) USING BTREE,
  KEY `idxpatientEthnicitiesEventId` (`eventId`) USING BTREE,
  KEY `idxpatientEthnicitiesEthnicityName` (`ethnicityName`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for patientHistory
-- ----------------------------
CREATE TABLE `patientHistory` (
  `id` int(11) unsigned NOT NULL,
  `patientId` varchar(80) NOT NULL,
  `sqId` varchar(80) DEFAULT NULL,
  `firstName` varchar(80) DEFAULT NULL,
  `middleName` varchar(80) DEFAULT NULL,
  `lastName` varchar(80) DEFAULT NULL,
  `userId` varchar(85) DEFAULT NULL,
  `status` varchar(80) DEFAULT NULL,
  `placerPatientId` varchar(80) DEFAULT NULL,
  `address1` varchar(100) DEFAULT NULL,
  `address2` varchar(100) DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `state` varchar(100) DEFAULT NULL,
  `postalCode` varchar(50) DEFAULT NULL,
  `country` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `phone1CountryCode` varchar(50) DEFAULT NULL,
  `phone1` varchar(50) DEFAULT NULL,
  `phone2CountryCode` varchar(50) DEFAULT NULL,
  `phone2` varchar(50) DEFAULT NULL,
  `phone3CountryCode` varchar(50) DEFAULT NULL,
  `phone3` varchar(50) DEFAULT NULL,
  `dob` date DEFAULT NULL,
  `govtId` varchar(80) DEFAULT NULL,
  `geneticGender` varchar(50) DEFAULT NULL,
  `genderId` varchar(50) DEFAULT NULL,
  `ethnicity` varchar(100) DEFAULT NULL,
  `eventId` bigint(20) unsigned NOT NULL,
  `historyStartDate` datetime DEFAULT NULL,
  `historyEndDate` datetime DEFAULT NULL,
  `historyAction` varchar(20) DEFAULT NULL,
  `historyUser` varchar(85) DEFAULT NULL,
  `historyId` int(11) unsigned NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`historyId`) USING BTREE,
  KEY `idxpatientHistoryPatientId` (`patientId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for patientSources
-- ----------------------------
CREATE TABLE `patientSources` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `patientId` varchar(80) NOT NULL,
  `sqId` varchar(80) DEFAULT NULL,
  `master` bit(1) NOT NULL,
  `mrn` varchar(80) NOT NULL,
  `mrnType` varchar(80) DEFAULT NULL,
  `mrnFacility` varchar(100) DEFAULT NULL,
  `assigningAuthority` varchar(100) DEFAULT NULL,
  `sqidNumberType` varchar(100) DEFAULT NULL,
  `siteId` varchar(80) NOT NULL,
  `firstName` varchar(80) DEFAULT NULL,
  `middleName` varchar(80) DEFAULT NULL,
  `lastName` varchar(80) DEFAULT NULL,
  `userId` varchar(85) DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL,
  `placerPatientId` varchar(80) DEFAULT NULL,
  `address1` varchar(100) DEFAULT NULL,
  `address2` varchar(100) DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `state` varchar(100) DEFAULT NULL,
  `postalCode` varchar(50) DEFAULT NULL,
  `country` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `phone1CountryCode` varchar(50) DEFAULT NULL,
  `phone1` varchar(50) DEFAULT NULL,
  `phone2CountryCode` varchar(50) DEFAULT NULL,
  `phone2` varchar(50) DEFAULT NULL,
  `phone3CountryCode` varchar(50) DEFAULT NULL,
  `phone3` varchar(50) DEFAULT NULL,
  `dob` date DEFAULT NULL,
  `govtId` varchar(80) DEFAULT NULL,
  `geneticGender` varchar(50) DEFAULT NULL,
  `eventId` bigint(20) unsigned NOT NULL,
  `ethnicity` varchar(100) DEFAULT NULL,
  `genderId` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `idxpatientSourcesLastName` (`lastName`) USING BTREE,
  KEY `idxpatientSourcesUserId` (`userId`) USING BTREE,
  KEY `idxpatientSourcesDOB` (`dob`) USING BTREE,
  KEY `idxpatientSourcesEmail` (`email`) USING BTREE,
  KEY `idxpatientSourcesGovtId` (`govtId`) USING BTREE,
  KEY `idxpatientSourcesEventId` (`eventId`) USING BTREE,
  KEY `idxpatientSourcesMRN` (`mrn`) USING BTREE,
  KEY `idxpatientSourcesSiteId` (`siteId`) USING BTREE,
  KEY `idxpatientSourcesPatientId` (`patientId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for patients
-- ----------------------------
CREATE TABLE `patients` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `patientId` varchar(80) NOT NULL,
  `sqId` varchar(80) DEFAULT NULL,
  `firstName` varchar(80) DEFAULT NULL,
  `middleName` varchar(80) DEFAULT NULL,
  `lastName` varchar(80) DEFAULT NULL,
  `userId` varchar(85) DEFAULT NULL,
  `status` varchar(80) DEFAULT NULL,
  `placerPatientId` varchar(80) DEFAULT NULL,
  `address1` varchar(100) DEFAULT NULL,
  `address2` varchar(100) DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `state` varchar(100) DEFAULT NULL,
  `postalCode` varchar(50) DEFAULT NULL,
  `country` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `phone1CountryCode` varchar(50) DEFAULT NULL,
  `phone1` varchar(50) DEFAULT NULL,
  `phone2CountryCode` varchar(50) DEFAULT NULL,
  `phone2` varchar(50) DEFAULT NULL,
  `phone3CountryCode` varchar(50) DEFAULT NULL,
  `phone3` varchar(50) DEFAULT NULL,
  `dob` date DEFAULT NULL,
  `govtId` varchar(80) DEFAULT NULL,
  `geneticGender` varchar(50) DEFAULT NULL,
  `genderId` varchar(50) DEFAULT NULL,
  `ethnicity` varchar(100) DEFAULT NULL,
  `eventId` bigint(20) unsigned NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `idxpatientsPatientId` (`patientId`) USING BTREE,
  UNIQUE KEY `idxpatientsSqId` (`sqId`) USING BTREE,
  KEY `idxpatientsLastName` (`lastName`) USING BTREE,
  KEY `idxpatientsUserId` (`userId`) USING BTREE,
  KEY `idxpatientsDOB` (`dob`) USING BTREE,
  KEY `idxpatientsEmail` (`email`) USING BTREE,
  KEY `idxpatientsGovtId` (`govtId`) USING BTREE,
  KEY `idxpatientsEventId` (`eventId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for pcrRawResults
-- ----------------------------
CREATE TABLE `pcrRawResults` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `trayId` varchar(80) DEFAULT NULL,
  `well` varchar(50) DEFAULT NULL,
  `detector` varchar(100) DEFAULT NULL,
  `task` varchar(100) DEFAULT NULL,
  `ct` varchar(50) DEFAULT NULL,
  `eventId` bigint(20) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `idxpcrRawResultsTrayId` (`trayId`) USING BTREE,
  KEY `idxpcrRawResultsEventId` (`eventId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for pcrRawResultsHistory
-- ----------------------------
CREATE TABLE `pcrRawResultsHistory` (
  `id` int(11) unsigned NOT NULL,
  `trayId` varchar(80) DEFAULT NULL,
  `well` varchar(50) DEFAULT NULL,
  `detector` varchar(100) DEFAULT NULL,
  `task` varchar(100) DEFAULT NULL,
  `ct` varchar(50) DEFAULT NULL,
  `eventId` bigint(20) unsigned DEFAULT NULL,
  `historyStartDate` datetime DEFAULT NULL,
  `historyEndDate` datetime DEFAULT NULL,
  `historyAction` varchar(20) DEFAULT NULL,
  `historyUser` varchar(85) DEFAULT NULL,
  `historyId` int(11) unsigned NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`historyId`) USING BTREE,
  KEY `idxpcrRawResultsHistoryTrayId` (`trayId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for pcrResults
-- ----------------------------
CREATE TABLE `pcrResults` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `sampleId` varchar(80) NOT NULL,
  `ct` varchar(50) DEFAULT NULL,
  `interpretation` varchar(80) DEFAULT NULL,
  `notes` text,
  `reportId` varchar(80) DEFAULT NULL,
  `eventId` bigint(20) unsigned NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `idxpcrResultsSampleId` (`sampleId`) USING BTREE,
  KEY `idxpcrResultsReportId` (`reportId`) USING BTREE,
  KEY `idxpcrResultsEventId` (`eventId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for pcrResultsHistory
-- ----------------------------
CREATE TABLE `pcrResultsHistory` (
  `id` int(11) unsigned NOT NULL,
  `sampleId` varchar(80) NOT NULL,
  `ct` varchar(50) DEFAULT NULL,
  `interpretation` varchar(80) DEFAULT NULL,
  `notes` text,
  `reportId` varchar(80) DEFAULT NULL,
  `eventId` bigint(20) unsigned NOT NULL,
  `historyStartDate` datetime DEFAULT NULL,
  `historyEndDate` datetime DEFAULT NULL,
  `historyAction` varchar(20) DEFAULT NULL,
  `historyUser` varchar(85) DEFAULT NULL,
  `historyId` int(11) unsigned NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`historyId`) USING BTREE,
  KEY `idxpcrResultsSampleId` (`sampleId`) USING BTREE,
  KEY `idxpcrResultsReportId` (`reportId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for physicianHistory
-- ----------------------------
CREATE TABLE `physicianHistory` (
  `id` int(11) unsigned NOT NULL,
  `physicianId` varchar(80) NOT NULL,
  `first_name` varchar(100) DEFAULT NULL,
  `middle_name` varchar(100) DEFAULT NULL,
  `last_name` varchar(100) DEFAULT NULL,
  `title` varchar(100) DEFAULT NULL,
  `dob` date DEFAULT NULL,
  `gender` varchar(50) DEFAULT NULL,
  `providerId` varchar(80) DEFAULT NULL,
  `providerType` varchar(80) DEFAULT NULL,
  `eventId` bigint(20) unsigned NOT NULL,
  `historyStartDate` datetime DEFAULT NULL,
  `historyEndDate` datetime DEFAULT NULL,
  `historyAction` varchar(20) DEFAULT NULL,
  `historyUser` varchar(85) DEFAULT NULL,
  `historyId` int(11) unsigned NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`historyId`) USING BTREE,
  KEY `idxphysicianHistoryPhysicianId` (`physicianId`) USING BTREE,
  KEY `idxphysicianHistoryProviderId` (`providerId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for physicianSites
-- ----------------------------
CREATE TABLE `physicianSites` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `physicianId` varchar(80) DEFAULT NULL,
  `siteId` varchar(80) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `phone1` varchar(50) DEFAULT NULL,
  `phone2` varchar(50) DEFAULT NULL,
  `fax1` varchar(50) DEFAULT NULL,
  `fax2` varchar(50) DEFAULT NULL,
  `active` BIT(1) NOT NULL DEFAULT b'1',
  `eventId` bigint(20) unsigned NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `idxphysicianSitesPhysicianId` (`physicianId`,`siteId`) USING BTREE,
  UNIQUE KEY `idxphysicianSitesSiteId` (`siteId`,`physicianId`) USING BTREE,
  KEY `idxphysicianSitesEventId` (`eventId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for physicians
-- ----------------------------
CREATE TABLE `physicians` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `physicianId` varchar(80) NOT NULL,
  `first_name` varchar(100) DEFAULT NULL,
  `middle_name` varchar(100) DEFAULT NULL,
  `last_name` varchar(100) DEFAULT NULL,
  `title` varchar(100) DEFAULT NULL,
  `dob` date DEFAULT NULL,
  `gender` varchar(50) DEFAULT NULL,
  `providerId` varchar(80) DEFAULT NULL,
  `providerType` varchar(80) DEFAULT NULL,
  `eventId` bigint(20) unsigned NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `idxphysiciansPhysicianId` (`physicianId`) USING BTREE,
  KEY `idxphysiciansName` (`first_name`) USING BTREE,
  KEY `idxphysiciansProivderId` (`providerId`) USING BTREE,
  KEY `idxphysiciansEventId` (`eventId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for plateMaps
-- ----------------------------
CREATE TABLE `plateMaps` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `plateMapName` varchar(50) NOT NULL,
  `well` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `idxplateMapsPlateMapName` (`plateMapName`,`well`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for primerAssayLinks
-- ----------------------------
CREATE TABLE `primerAssayLinks` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `primerId` int(11) unsigned NOT NULL,
  `assayId` int(11) unsigned NOT NULL,
  `linkId` varchar(80) NOT NULL,
  `eventId` bigint(20) unsigned NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `idxprimerAssayLinksLinkId` (`linkId`,`primerId`) USING BTREE,
  KEY `idxprimerAssayLinksAssayId` (`assayId`) USING BTREE,
  KEY `idxprimerAssayLinksPrimerId` (`primerId`) USING BTREE,
  KEY `idxprimerAssayLinksEventId` (`eventId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for primerAssayLinksHistory
-- ----------------------------
CREATE TABLE `primerAssayLinksHistory` (
  `id` int(11) unsigned NOT NULL,
  `primerId` int(11) unsigned NOT NULL,
  `assayId` int(11) unsigned NOT NULL,
  `linkId` varchar(80) NOT NULL,
  `eventId` bigint(20) unsigned NOT NULL,
  `historyStartDate` datetime DEFAULT NULL,
  `historyEndDate` datetime DEFAULT NULL,
  `historyAction` varchar(20) DEFAULT NULL,
  `historyUser` varchar(85) DEFAULT NULL,
  `historyId` int(11) unsigned NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`historyId`) USING BTREE,
  KEY `idxprimerAssayLinksHistoryLinkId` (`linkId`,`primerId`) USING BTREE,
  KEY `idxprimerAssayLinksHistoryAssayId` (`assayId`) USING BTREE,
  KEY `idxprimerAssayLinksHistoryPrimerId` (`primerId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for primerOrdering
-- ----------------------------
CREATE TABLE `primerOrdering` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `primerId` int(11) unsigned NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `sequence` varchar(50) DEFAULT NULL,
  `scale` varchar(50) DEFAULT NULL,
  `purification` varchar(50) DEFAULT NULL,
  `eventId` bigint(20) unsigned NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `idxprimerOrderingPrimerId` (`primerId`) USING BTREE,
  KEY `idxprimerEventId` (`eventId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for primerOrderingHistory
-- ----------------------------
CREATE TABLE `primerOrderingHistory` (
  `id` int(11) unsigned NOT NULL,
  `primerId` int(11) unsigned NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `sequence` varchar(50) DEFAULT NULL,
  `scale` varchar(50) DEFAULT NULL,
  `purification` varchar(50) DEFAULT NULL,
  `eventId` bigint(20) unsigned NOT NULL,
  `historyStartDate` datetime DEFAULT NULL,
  `historyEndDate` datetime DEFAULT NULL,
  `historyAction` varchar(20) DEFAULT NULL,
  `historyUser` varchar(85) DEFAULT NULL,
  `historyId` int(11) unsigned NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`historyId`) USING BTREE,
  KEY `idxprimerOrderingHistoryPrimerId` (`primerId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for primers
-- ----------------------------
CREATE TABLE `primers` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `primerId` varchar(80) NOT NULL,
  `gene` varchar(255) DEFAULT NULL,
  `geneName` varchar(80) DEFAULT NULL,
  `geneAliases` varchar(80) DEFAULT NULL,
  `geneLocation` varchar(80) DEFAULT NULL,
  `species` varchar(80) DEFAULT NULL,
  `primerLocation` varchar(80) DEFAULT NULL,
  `ampliconLength` int(11) DEFAULT NULL,
  `forwardPrimer` varchar(80) DEFAULT NULL,
  `forwardPrimerM13` varchar(80) DEFAULT NULL,
  `reversePrimer` varchar(80) DEFAULT NULL,
  `reversePrimerM13` varchar(80) DEFAULT NULL,
  `forwardLocation` varchar(80) DEFAULT NULL,
  `reverseLocation` varchar(80) DEFAULT NULL,
  `dilutionLocation` varchar(80) DEFAULT NULL,
  `eventId` bigint(20) unsigned NOT NULL,
  `updateEventId` bigint(20) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `idxprimersPrimerId` (`primerId`) USING BTREE,
  KEY `idxprimersEventId` (`eventId`) USING BTREE,
  KEY `idxprimersUpdateEventId` (`updateEventId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for primersHistory
-- ----------------------------
CREATE TABLE `primersHistory` (
  `id` int(11) unsigned NOT NULL,
  `primerId` varchar(80) NOT NULL,
  `gene` varchar(255) DEFAULT NULL,
  `geneName` varchar(80) DEFAULT NULL,
  `geneAliases` varchar(80) DEFAULT NULL,
  `geneLocation` varchar(80) DEFAULT NULL,
  `species` varchar(80) DEFAULT NULL,
  `primerLocation` varchar(80) DEFAULT NULL,
  `ampliconLength` int(11) DEFAULT NULL,
  `forwardPrimer` varchar(80) DEFAULT NULL,
  `forwardPrimerM13` varchar(80) DEFAULT NULL,
  `reversePrimer` varchar(80) DEFAULT NULL,
  `reversePrimerM13` varchar(80) DEFAULT NULL,
  `forwardLocation` varchar(80) DEFAULT NULL,
  `reverseLocation` varchar(80) DEFAULT NULL,
  `dilutionLocation` varchar(80) DEFAULT NULL,
  `eventId` bigint(20) unsigned NOT NULL,
  `updateEventId` bigint(20) unsigned DEFAULT NULL,
  `historyStartDate` datetime DEFAULT NULL,
  `historyEndDate` datetime DEFAULT NULL,
  `historyAction` varchar(20) DEFAULT NULL,
  `historyUser` varchar(85) DEFAULT NULL,
  `historyId` int(11) unsigned NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`historyId`) USING BTREE,
  KEY `idxprimersHistoryPrimerId` (`primerId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for proband
-- ----------------------------
CREATE TABLE `proband` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `patientId` varchar(80) NOT NULL,
  `testCode` varchar(80) NOT NULL,
  `familyId` varchar(80) DEFAULT NULL,
  `eventId` bigint(20) unsigned NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `fkprobandTestCode` (`testCode`) USING BTREE,
  KEY `fkprobandPatientId` (`patientId`) USING BTREE,
  KEY `fkprobandEventId` (`eventId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for probandLinks
-- ----------------------------
CREATE TABLE `probandLinks` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `probandId` int(11) unsigned NOT NULL,
  `patientId` varchar(80) NOT NULL,
  `relationship` varchar(100) NOT NULL,
  `eventId` bigint(20) unsigned NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `fkprobandLinksProbandId` (`probandId`) USING BTREE,
  KEY `fkprobandLinksPatientId` (`patientId`) USING BTREE,
  KEY `fkprobandLinksEventId` (`eventId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for probesForTests
-- ----------------------------
CREATE TABLE `probesForTests` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `testCode` int(11) unsigned NOT NULL,
  `reagentType` varchar(100) NOT NULL,
  `eventId` bigint(20) unsigned NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `idxprobesForTestsTestCode` (`testCode`,`reagentType`) USING BTREE,
  KEY `idxprobesForTestsEventId` (`eventId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- ----------------------------
-- Table structure for qcMetrics
-- ----------------------------
CREATE TABLE `qcMetrics` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `sampleId` varchar(80) NOT NULL,
  `property` varchar(100) NOT NULL,
  `value` varchar(100) DEFAULT NULL,
  `eventId` bigint(20) unsigned NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `idxqcMetricsSampleId` (`sampleId`) USING BTREE,
  KEY `idxqcMetricsProperty` (`property`) USING BTREE,
  KEY `idxqcMetricsEventId` (`eventId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for quantRawPoolingResultHistory
-- ----------------------------
CREATE TABLE `quantRawPoolingResultHistory` (
  `id` int(11) unsigned NOT NULL,
  `plateId` varchar(80) NOT NULL,
  `libraryNumber` varchar(100) DEFAULT NULL,
  `poolId` varchar(80) DEFAULT NULL,
  `aveFragmentLength` varchar(80) DEFAULT NULL,
  `averageCq` varchar(80) DEFAULT NULL,
  `libraryConcentration` varchar(80) DEFAULT NULL,
  `dilution` varchar(80) DEFAULT NULL,
  `eventId` bigint(20) unsigned NOT NULL,
  `historyStartDate` datetime DEFAULT NULL,
  `historyEndDate` datetime DEFAULT NULL,
  `historyAction` varchar(20) DEFAULT NULL,
  `historyUser` varchar(85) DEFAULT NULL,
  `historyId` int(11) unsigned NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`historyId`) USING BTREE,
  KEY `idxquantRawPoolingResultHistoryPlateId` (`plateId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for quantRawPoolingResults
-- ----------------------------
CREATE TABLE `quantRawPoolingResults` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `plateId` varchar(80) NOT NULL,
  `libraryNumber` varchar(100) DEFAULT NULL,
  `poolId` varchar(80) DEFAULT NULL,
  `aveFragmentLength` varchar(80) DEFAULT NULL,
  `averageCq` varchar(80) DEFAULT NULL,
  `libraryConcentration` varchar(80) DEFAULT NULL,
  `dilution` varchar(80) DEFAULT NULL,
  `eventId` bigint(20) unsigned NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `idxquantRawPoolingResultsId` (`plateId`) USING BTREE,
  KEY `idxquantRawPoolingResultsEventId` (`eventId`) USING BTREE,
  KEY `idxquantRawPoolingResultsPoolId` (`poolId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for quantRawResults
-- ----------------------------
CREATE TABLE `quantRawResults` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `plateId` varchar(80) NOT NULL,
  `sampleId` varchar(80) DEFAULT NULL,
  `plate` varchar(100) NOT NULL,
  `well` varchar(50) NOT NULL,
  `dilution` varchar(80) DEFAULT NULL,
  `ratio` varchar(50) DEFAULT NULL,
  `concentration` varchar(50) DEFAULT NULL,
  `concentration2` varchar(50) DEFAULT NULL,
  `eventId` bigint(20) unsigned NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `idxquantRawResultsPlateId` (`plateId`,`well`,`plate`) USING BTREE,
  KEY `idxquantRawResultsSampleId` (`sampleId`) USING BTREE,
  KEY `idxquantRawResultsPlate` (`plate`) USING BTREE,
  KEY `idxquantRawResultsEventId` (`eventId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for quantResultHistory
-- ----------------------------
CREATE TABLE `quantResultHistory` (
  `id` int(11) unsigned NOT NULL,
  `runId` varchar(80) NOT NULL,
  `od260` varchar(50) DEFAULT NULL,
  `od280` varchar(50) DEFAULT NULL,
  `concentration` varchar(50) DEFAULT NULL,
  `purityRatio` varchar(50) DEFAULT NULL,
  `uploaded` bit(1) DEFAULT NULL,
  `dataEventId` bigint(20) unsigned DEFAULT NULL,
  `result` varchar(50) DEFAULT NULL,
  `resultEventId` bigint(20) unsigned NOT NULL,
  `historyStartDate` datetime DEFAULT NULL,
  `historyEndDate` datetime DEFAULT NULL,
  `historyAction` varchar(20) DEFAULT NULL,
  `historyUser` varchar(85) DEFAULT NULL,
  `historyId` int(11) unsigned NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`historyId`) USING BTREE,
  KEY `idxquantResultHistoryRunId` (`runId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for quantResults
-- ----------------------------
CREATE TABLE `quantResults` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `runId` varchar(80) NOT NULL,
  `od260` varchar(50) DEFAULT NULL,
  `od280` varchar(50) DEFAULT NULL,
  `concentration` varchar(50) DEFAULT NULL,
  `purityRatio` varchar(50) DEFAULT NULL,
  `uploaded` bit(1) DEFAULT NULL,
  `dataEventId` bigint(20) unsigned NOT NULL,
  `result` varchar(50) DEFAULT NULL,
  `resultEventId` bigint(20) unsigned NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `idxquantResultsRunId` (`runId`) USING BTREE,
  KEY `idxquantResultsDataEventId` (`dataEventId`) USING BTREE,
  KEY `idxquantResultsDataResultEventId` (`resultEventId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- ----------------------------
-- Table structure for quantThreshold
-- ----------------------------
CREATE TABLE `quantThreshold` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `quantStep` varchar(100) NOT NULL,
  `quantThreshold` float DEFAULT NULL,
  `panelCode` varchar(80) NOT NULL,
  `eventId` bigint(20) unsigned NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `idxquantThresholdQuantStep` (`quantStep`,`panelCode`) USING BTREE,
  KEY `idxquantThresholdEventId` (`eventId`) USING BTREE,
  KEY `idxquantThresholdPanelCode` (`panelCode`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for quantThresholdHistory
-- ----------------------------
CREATE TABLE `quantThresholdHistory` (
  `id` int(11) unsigned NOT NULL,
  `quantStep` varchar(100) NOT NULL,
  `quantThreshold` float DEFAULT NULL,
  `panelCode` varchar(80) NOT NULL,
  `eventId` bigint(20) unsigned NOT NULL,
  `historyStartDate` datetime DEFAULT NULL,
  `historyEndDate` datetime DEFAULT NULL,
  `historyAction` varchar(20) DEFAULT NULL,
  `historyUser` varchar(85) DEFAULT NULL,
  `historyId` int(11) unsigned NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`historyId`) USING BTREE,
  KEY `idxquantThresholdHistoryQuantStep` (`quantStep`) USING BTREE,
  KEY `idxquantThresholdHistoryPanelCode` (`panelCode`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- ----------------------------
-- Table structure for queuePaths
-- ----------------------------
CREATE TABLE `queuePaths` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `panelCode` varchar(80) DEFAULT NULL,
  `sampleType` varchar(100) DEFAULT NULL,
  `methodCode` varchar(80) DEFAULT NULL,
  `fromStep` varchar(100) NOT NULL,
  `nextStep` varchar(100) NOT NULL,
  `eventId` bigint(20) unsigned NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `idxqueuePathsPanelCode` (`panelCode`) USING BTREE,
  KEY `idxqueuePathsFromStep` (`fromStep`) USING BTREE,
  KEY `idxqueuePathsEventId` (`eventId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- ----------------------------
-- Table structure for rapidExamResults
-- ----------------------------
CREATE TABLE `rapidExamResults` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `reqId` varchar(80) NOT NULL,
  `drugId` int(11) unsigned NOT NULL,
  `positive` varchar(255) DEFAULT NULL,
  `negative` varchar(255) DEFAULT NULL,
  `eventId` bigint(20) unsigned NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `idxrapidExamResultsReqId` (`reqId`) USING BTREE,
  KEY `idxrapidExamResultsEventId` (`eventId`) USING BTREE,
  KEY `idxrapidExamResultsDrugId` (`drugId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for reagentHistory
-- ----------------------------
CREATE TABLE `reagentHistory` (
  `id` int(11) unsigned NOT NULL,
  `reagentId` varchar(80) NOT NULL,
  `reagentType` varchar(100) DEFAULT NULL,
  `catalogNo` varchar(80) DEFAULT NULL,
  `quantity` decimal(10,2) DEFAULT NULL,
  `quantityInside` varchar(50) DEFAULT NULL,
  `concentration` varchar(50) DEFAULT NULL,
  `unitOfMeasure` varchar(50) DEFAULT NULL,
  `threshold` decimal(10,2) DEFAULT NULL,
  `thresholdUnits` varchar(50) DEFAULT NULL,
  `lowerLimit` decimal(10,4) DEFAULT NULL,
  `upperLimit` decimal(10,4) DEFAULT NULL,
  `lotNumber` varchar(80) DEFAULT NULL,
  `parentLot` varchar(80) DEFAULT NULL,
  `vendor` varchar(80) DEFAULT NULL,
  `storageId` varchar(80) DEFAULT NULL,
  `projectType` varchar(50) DEFAULT NULL,
  `costPerUnit` decimal(10,2) DEFAULT NULL,
  `poNumber` varchar(80) DEFAULT NULL,
  `receivedDate` date DEFAULT NULL,
  `expirationDate` date DEFAULT NULL,
  `openDate` date DEFAULT NULL,
  `QCDate` date DEFAULT NULL,
  `QCType` varchar(80) DEFAULT NULL,
  `QCStatus` varchar(80) DEFAULT NULL,
  `status` varchar(100) DEFAULT NULL,
  `eventId` bigint(20) unsigned NOT NULL,
  `siteId` varchar(80) DEFAULT NULL,
  `historyStartDate` datetime DEFAULT NULL,
  `historyEndDate` datetime DEFAULT NULL,
  `historyAction` varchar(20) DEFAULT NULL,
  `historyUser` varchar(85) DEFAULT NULL,
  `historyId` int(11) unsigned NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`historyId`) USING BTREE,
  KEY `idxReagentHistoryReagentId` (`reagentId`) USING BTREE,
  KEY `idxreagentHistoryStorageId` (`storageId`) USING BTREE,
  KEY `idxreagentHistorySiteId` (`siteId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for reagentRecipes
-- ----------------------------
CREATE TABLE `reagentRecipes` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `recipeName` varchar(100) NOT NULL,
  `reagentType` varchar(100) NOT NULL,
  `component` varchar(80) DEFAULT NULL,
  `quantity` decimal(10,2) DEFAULT NULL,
  `unitOfMeasure` varchar(50) DEFAULT NULL,
  `concentration` varchar(50) DEFAULT NULL,
  `volume` varchar(50) DEFAULT NULL,
  `eventId` bigint(20) unsigned NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `idxreagentRecipesRecipeName` (`recipeName`) USING BTREE,
  KEY `idxreagentRecipesEventId` (`eventId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for reagents
-- ----------------------------
CREATE TABLE `reagents` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `reagentId` varchar(80) NOT NULL,
  `reagentType` varchar(100) DEFAULT NULL,
  `catalogNo` varchar(80) DEFAULT NULL,
  `quantity` decimal(10,2) DEFAULT NULL,
  `quantityInside` varchar(50) DEFAULT NULL,
  `concentration` varchar(50) DEFAULT NULL,
  `unitOfMeasure` varchar(50) DEFAULT NULL,
  `threshold` decimal(10,2) DEFAULT NULL,
  `thresholdUnits` varchar(50) DEFAULT NULL,
  `lowerLimit` decimal(10,4) DEFAULT NULL,
  `upperLimit` decimal(10,4) DEFAULT NULL,
  `lotNumber` varchar(80) DEFAULT NULL,
  `parentLot` varchar(80) DEFAULT NULL,
  `vendor` varchar(80) DEFAULT NULL,
  `storageId` varchar(80) DEFAULT NULL,
  `projectType` varchar(50) DEFAULT NULL,
  `costPerUnit` decimal(10,2) DEFAULT NULL,
  `poNumber` varchar(80) DEFAULT NULL,
  `receivedDate` date DEFAULT NULL,
  `expirationDate` date DEFAULT NULL,
  `openDate` date DEFAULT NULL,
  `QCDate` date DEFAULT NULL,
  `QCType` varchar(80) DEFAULT NULL,
  `QCStatus` varchar(80) DEFAULT NULL,
  `status` varchar(100) DEFAULT NULL,
  `eventId` bigint(20) unsigned NOT NULL,
  `siteId` varchar(80) DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `idxreagentsReagentId` (`reagentId`) USING BTREE,
  KEY `idxreagentsStorageId` (`storageId`) USING BTREE,
  KEY `idxreagentsEventId` (`eventId`) USING BTREE,
  KEY `idxreagentsSiteId` (`siteId`) USING BTREE,
  KEY `idxreagentsReagentType` (`reagentType`,`reagentId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for recommendations
-- ----------------------------
CREATE TABLE `recommendations` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `testName1` varchar(100) NOT NULL,
  `assayName1` varchar(100) DEFAULT NULL,
  `mutation1` varchar(100) DEFAULT NULL,
  `genotype1` varchar(100) DEFAULT NULL,
  `phenotype1` varchar(100) DEFAULT NULL,
  `description1` text,
  `testName2` varchar(100) DEFAULT NULL,
  `assayName2` varchar(100) DEFAULT NULL,
  `mutation2` varchar(100) DEFAULT NULL,
  `genotype2` varchar(100) DEFAULT NULL,
  `phenotype2` varchar(100) DEFAULT NULL,
  `description2` text,
  `recommendation` text,
  `refs` text,
  `eventId` bigint(20) unsigned NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `idxrecommendationsTestName1` (`testName1`) USING BTREE,
  KEY `idxrecommendationsTestName2` (`testName2`) USING BTREE,
  KEY `idxrecommendationsEventId` (`eventId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for referenceDocuments
-- ----------------------------
CREATE TABLE `referenceDocuments` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `description` text NOT NULL,
  `url` text,
  `disabled` bit(1) NOT NULL DEFAULT b'0',
  `eventId` bigint(20) unsigned NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `idxreferenceDocumentsEventId` (`eventId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for reportDetails
-- ----------------------------
CREATE TABLE `reportDetails` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `reportId` varchar(80) NOT NULL,
  `requestId` varchar(80) NOT NULL,
  `reportType` varchar(100) DEFAULT NULL,
  `panelCode` varchar(80) DEFAULT NULL,
  `eventId` bigint(20) unsigned NOT NULL,
  `initialReleaseEventId` bigint(20) unsigned DEFAULT NULL,
  `signedEventId` bigint(20) unsigned DEFAULT NULL,
  `cancelledEventid` bigint(20) unsigned DEFAULT NULL,
  `cancelReason` varchar(100) DEFAULT NULL,
  `qnsEventId` bigint(20) unsigned DEFAULT NULL,
  `viewedEventId` bigint(20) unsigned DEFAULT NULL,
  `mailedEventId` bigint(20) unsigned DEFAULT NULL,
  `amendedEventId` bigint(20) unsigned DEFAULT NULL,
  `correctedEventId` bigint(20) unsigned DEFAULT NULL,
  `addendumEventId` bigint(20) unsigned DEFAULT NULL,
  `rejectedEventId` bigint(20) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `idxreportDetailsReportId` (`reportId`) USING BTREE,
  KEY `idxreportDetailsRequestId` (`requestId`) USING BTREE,
  KEY `idxreportDetailsPanelCode` (`panelCode`) USING BTREE,
  KEY `idxreportDetailsEventId` (`eventId`) USING BTREE,
  KEY `idxreportDetailsInitialReleaseEventId` (`initialReleaseEventId`) USING BTREE,
  KEY `idxreportDetailsSignedEventId` (`signedEventId`) USING BTREE,
  KEY `idxreportDetailsCancelledEventid` (`cancelledEventid`) USING BTREE,
  KEY `idxreportDetailsQnsEventId` (`qnsEventId`) USING BTREE,
  KEY `idxreportDetailsViewedEventId` (`viewedEventId`) USING BTREE,
  KEY `idxreportDetailsMailedEventId` (`mailedEventId`) USING BTREE,
  KEY `idxreportDetailsAmendedEventId` (`amendedEventId`) USING BTREE,
  KEY `idxreportDetailsCorrectedEventId` (`correctedEventId`) USING BTREE,
  KEY `idxreportDetailsAaddendumEventId` (`addendumEventId`) USING BTREE,
  KEY `idxreportDetailsRejectedEventId` (`rejectedEventId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for reportDetailsHistory
-- ----------------------------
CREATE TABLE `reportDetailsHistory` (
  `id` int(11) unsigned NOT NULL,
  `reportId` varchar(80) NOT NULL,
  `requestId` varchar(80) NOT NULL,
  `reportType` varchar(100) DEFAULT NULL,
  `panelCode` varchar(80) DEFAULT NULL,
  `eventId` bigint(20) unsigned NOT NULL,
  `initialReleaseEventId` bigint(20) unsigned DEFAULT NULL,
  `signedEventId` bigint(20) unsigned DEFAULT NULL,
  `cancelledEventid` bigint(20) unsigned DEFAULT NULL,
  `cancelReason` varchar(100) DEFAULT NULL,
  `qnsEventId` bigint(20) unsigned DEFAULT NULL,
  `viewedEventId` bigint(20) unsigned DEFAULT NULL,
  `mailedEventId` bigint(20) unsigned DEFAULT NULL,
  `amendedEventId` bigint(20) unsigned DEFAULT NULL,
  `correctedEventId` bigint(20) unsigned DEFAULT NULL,
  `addendumEventId` bigint(20) unsigned DEFAULT NULL,
  `rejectedEventId` bigint(20) unsigned DEFAULT NULL,
  `historyStartDate` datetime DEFAULT NULL,
  `historyEndDate` datetime DEFAULT NULL,
  `historyAction` varchar(20) DEFAULT NULL,
  `historyUser` varchar(85) DEFAULT NULL,
  `historyId` int(11) unsigned NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`historyId`) USING BTREE,
  KEY `idxreportDetailsHistoryReportId` (`reportId`) USING BTREE,
  KEY `idxreportDetailsHistoryRequestId` (`requestId`) USING BTREE,
  KEY `idxreportDetailsHistorySignedEventId` (`signedEventId`) USING BTREE,
  KEY `idxreportDetailsHistoryCancelledEventid` (`cancelledEventid`) USING BTREE,
  KEY `idxreportDetailsHistoryQnsEventId` (`qnsEventId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for reportDistribution
-- ----------------------------
CREATE TABLE `reportDistribution` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `requestId` varchar(80) NOT NULL,
  `recipientId` varchar(80) DEFAULT NULL,
  `distributionMethod` varchar(100) DEFAULT NULL,
  `specialHandling` text,
  `eventId` bigint(20) unsigned NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `idxreferenceDocumentsRequestId` (`requestId`,`recipientId`,`distributionMethod`) USING BTREE,
  KEY `idxreferenceDocumentsEventId` (`eventId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for reportDistributionPreferences
-- ----------------------------
CREATE TABLE `reportDistributionPreferences` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `recipientId` varchar(80) NOT NULL,
  `distributionMethod` varchar(100) NOT NULL,
  `specialHandling` text,
  `eventId` bigint(20) unsigned NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `idxreportDistributionPreferencesRecipientId` (`recipientId`) USING BTREE,
  KEY `idxreportDistributionPreferencesEventId` (`eventId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for reportHTML
-- ----------------------------
CREATE TABLE `reportHTML` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `reportId` varchar(80) DEFAULT NULL,
  `reqId` varchar(80) NOT NULL,
  `html` mediumtext,
  `htmlBody` mediumtext,
  `htmlClientAddress` text,
  `pdfGenerated` varchar(8) DEFAULT NULL,
  `eventId` bigint(20) unsigned NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `idxreportHTMLReqId` (`reqId`,`eventId`) USING BTREE,
  KEY `idxreportHTMLEventId` (`eventId`) USING BTREE,
  KEY `idxreportHTMLReportId` (`reportId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for reportHTMLAddendums
-- ----------------------------
CREATE TABLE `reportHTMLAddendums` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `reqId` varchar(80) NOT NULL,
  `reportId` varchar(80) NOT NULL,
  `htmlAddendum` mediumtext,
  `eventId` bigint(20) unsigned NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `idxreportHTMLAddendumsReqId` (`reqId`,`eventId`) USING BTREE,
  KEY `idxreportHTMLAddendumsReportId` (`reportId`) USING BTREE,
  KEY `idxreportHTMLAddendumsEventId` (`eventId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for reportHTMLAddendumsHistory
-- ----------------------------
CREATE TABLE `reportHTMLAddendumsHistory` (
  `id` int(11) unsigned NOT NULL,
  `reqId` varchar(80) NOT NULL,
  `reportId` varchar(80) NOT NULL,
  `htmlAddendum` mediumtext,
  `eventId` bigint(20) unsigned NOT NULL,
  `historyStartDate` datetime DEFAULT NULL,
  `historyEndDate` datetime DEFAULT NULL,
  `historyAction` varchar(20) DEFAULT NULL,
  `historyUser` varchar(85) DEFAULT NULL,
  `historyId` int(11) unsigned NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`historyId`) USING BTREE,
  KEY `idxreportHTMLAddendumsReqId` (`reqId`) USING BTREE,
  KEY `idxreportHTMLAddendumsReportId` (`reportId`) USING BTREE,
  KEY `idxreportHTMLAddendumsEventId` (`eventId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for reportHTMLHistory
-- ----------------------------
CREATE TABLE `reportHTMLHistory` (
  `id` int(11) unsigned NOT NULL,
  `reportId` varchar(80) DEFAULT NULL,
  `reqId` varchar(80) NOT NULL,
  `html` mediumtext,
  `htmlBody` mediumtext,
  `htmlClientAddress` text,
  `pdfGenerated` varchar(8) DEFAULT NULL,
  `eventId` bigint(20) unsigned NOT NULL,
  `historyStartDate` datetime DEFAULT NULL,
  `historyEndDate` datetime DEFAULT NULL,
  `historyAction` varchar(20) DEFAULT NULL,
  `historyUser` varchar(85) DEFAULT NULL,
  `historyId` int(11) unsigned NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`historyId`) USING BTREE,
  KEY `idxreportHTMLHistoryReqId` (`reqId`) USING BTREE,
  KEY `idxreportHTMLHistoryReportId` (`reportId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for reportMedListCYP
-- ----------------------------
CREATE TABLE `reportMedListCYP` (
  `Id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `gene` varchar(255) NOT NULL,
  `phenotype` varchar(50) NOT NULL,
  `medication` varchar(255) NOT NULL,
  `therapRecommend` text NOT NULL,
  `eventId` bigint(20) unsigned NOT NULL,
  PRIMARY KEY (`Id`) USING BTREE,
  KEY `idxreportMedListCYPGene` (`gene`,`phenotype`) USING BTREE,
  KEY `idxreportMedListCYPEventId` (`eventId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for reportPanelReferences
-- ----------------------------
CREATE TABLE `reportPanelReferences` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `panelCode` varchar(80) NOT NULL,
  `referenceId` int(11) unsigned NOT NULL,
  `orderNumber` int(11) DEFAULT NULL,
  `eventId` bigint(20) unsigned NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `idxreportPanelReferencesPanelCode` (`panelCode`,`referenceId`) USING BTREE,
  KEY `idxreportPanelReferencesEventId` (`eventId`) USING BTREE,
  KEY `idxreportPanelReferenceId` (`referenceId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for reportReferences
-- ----------------------------
CREATE TABLE `reportReferences` (
  `referenceId` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `referenceName` varchar(100) NOT NULL,
  `reference` text,
  `eventId` bigint(20) unsigned NOT NULL,
  PRIMARY KEY (`referenceId`) USING BTREE,
  KEY `idxreportReferencesEventId` (`eventId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for reportSettings
-- ----------------------------
CREATE TABLE `reportSettings` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `panelCode` varchar(80) NOT NULL,
  `reportName` varchar(100) DEFAULT NULL,
  `reportTitle` varchar(100) DEFAULT NULL,
  `hasImages` varchar(8) DEFAULT NULL,
  `hasResultReferences` varchar(8) DEFAULT NULL,
  `medicalDirectorId` varchar(80) DEFAULT NULL,
  `eventId` bigint(20) unsigned NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `idxreportSettingsPanelCode` (`panelCode`) USING BTREE,
  KEY `idxreportSettingsEventId` (`eventId`) USING BTREE,
  KEY `idxreportSettingsMedicalDirectorId` (`medicalDirectorId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for reportSignatures
-- ----------------------------
CREATE TABLE `reportSignatures` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `medicalDirectorId` varchar(80) NOT NULL,
  `medicalDirector` varchar(100) DEFAULT NULL,
  `medicalDirectorImage` text,
  `medicalDirectorsignatureTitle1` varchar(255) DEFAULT NULL,
  `medicalDirectorsignatureTitle2` varchar(255) DEFAULT NULL,
  `signaturePosition` varchar(255) DEFAULT NULL,
  `signatureEnabled` varchar(255) DEFAULT NULL,
  `eventId` bigint(20) unsigned NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `idxreportSignaturesMedicalDirectorId` (`medicalDirectorId`) USING BTREE,
  KEY `idxreportSignaturesEventId` (`eventId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for reportStaticWording
-- ----------------------------
CREATE TABLE `reportStaticWording` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `textType` varchar(100) NOT NULL,
  `staticArea` varchar(100) NOT NULL DEFAULT '',
  `value` text,
  `eventId` bigint(20) unsigned NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `idxreportStaticWordingEventId` (`eventId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for reportWording
-- ----------------------------
CREATE TABLE `reportWording` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `reportId` varchar(80) NOT NULL,
  `field` varchar(100) NOT NULL,
  `value` text,
  `eventId` bigint(20) unsigned NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `idxreportWordingReportId` (`reportId`,`field`) USING BTREE,
  KEY `idxreportWordingEventId` (`eventId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for reportWordingCYP
-- ----------------------------
CREATE TABLE `reportWordingCYP` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `gene` varchar(255) NOT NULL,
  `result` varchar(50) NOT NULL DEFAULT '',
  `result_Title` varchar(100) NOT NULL DEFAULT '',
  `result_Description` text NOT NULL,
  `interpretation` text NOT NULL,
  `cardiac_Wording` text NOT NULL,
  `painMgmt_Wording` text NOT NULL,
  `psych_Wording` text NOT NULL,
  `color` varchar(50) DEFAULT NULL,
  `eventId` bigint(20) unsigned NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `idxreportWordingCYPGene` (`gene`) USING BTREE,
  KEY `idxreportWordingCYPEventId` (`eventId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for reportWordingHistory
-- ----------------------------
CREATE TABLE `reportWordingHistory` (
  `id` int(11) unsigned NOT NULL,
  `reportId` varchar(80) NOT NULL,
  `field` varchar(100) NOT NULL,
  `value` text,
  `eventId` bigint(20) unsigned NOT NULL,
  `historyStartDate` datetime DEFAULT NULL,
  `historyEndDate` datetime DEFAULT NULL,
  `historyAction` varchar(20) DEFAULT NULL,
  `historyUser` varchar(85) DEFAULT NULL,
  `historyId` int(11) unsigned NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`historyId`) USING BTREE,
  KEY `idxreportWordingHistoryReportId` (`reportId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for reportedDemographs
-- ----------------------------
CREATE TABLE `reportedDemographs` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `reportId` varchar(80) NOT NULL,
  `panel` varchar(80) NOT NULL,
  `patientId` varchar(80) DEFAULT NULL,
  `patientFirst` varchar(100) DEFAULT NULL,
  `patientLast` varchar(100) DEFAULT NULL,
  `dob` date DEFAULT NULL,
  `gender` varchar(50) DEFAULT NULL,
  `specimenId` varchar(80) NOT NULL,
  `sampleType` varchar(100) DEFAULT NULL,
  `collectionDate` date DEFAULT NULL,
  `receivedDate` date DEFAULT NULL,
  `organizationId` varchar(80) DEFAULT NULL,
  `organizationFirst` varchar(100) DEFAULT NULL,
  `organizationAddress1` varchar(100) DEFAULT NULL,
  `organizationCity1` varchar(255) DEFAULT NULL,
  `organizationState1` varchar(80) DEFAULT NULL,
  `organizationZip1` varchar(50) DEFAULT NULL,
  `physicianId` varchar(80) DEFAULT NULL,
  `physicianFirst` varchar(100) DEFAULT NULL,
  `physicianLast` varchar(100) DEFAULT NULL,
  `mrn` varchar(80) DEFAULT NULL,
  `eventId` bigint(20) unsigned NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `idxreportedDemographsReportId` (`reportId`,`panel`,`specimenId`) USING BTREE,
  KEY `idxreportedDemographsPatientId` (`patientId`) USING BTREE,
  KEY `idxreportedDemographsSpecimenId` (`specimenId`) USING BTREE,
  KEY `idxreportedDemographsorganizationId` (`organizationId`) USING BTREE,
  KEY `idxreportedDemographsPhysicianId` (`physicianId`) USING BTREE,
  KEY `idxreportedDemographsEventId` (`eventId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for reportedDemographsHistory
-- ----------------------------
CREATE TABLE `reportedDemographsHistory` (
  `id` int(11) unsigned NOT NULL,
  `reportId` varchar(80) NOT NULL,
  `panel` varchar(80) NOT NULL,
  `patientId` varchar(80) DEFAULT NULL,
  `patientFirst` varchar(100) DEFAULT NULL,
  `patientLast` varchar(100) DEFAULT NULL,
  `dob` date DEFAULT NULL,
  `gender` varchar(50) DEFAULT NULL,
  `specimenId` varchar(80) NOT NULL,
  `sampleType` varchar(100) DEFAULT NULL,
  `collectionDate` date DEFAULT NULL,
  `receivedDate` date DEFAULT NULL,
  `organizationId` varchar(80) DEFAULT NULL,
  `organizationFirst` varchar(100) DEFAULT NULL,
  `organizationAddress1` varchar(100) DEFAULT NULL,
  `organizationCity1` varchar(255) DEFAULT NULL,
  `organizationState1` varchar(80) DEFAULT NULL,
  `organizationZip1` varchar(50) DEFAULT NULL,
  `physicianId` varchar(80) DEFAULT NULL,
  `physicianFirst` varchar(100) DEFAULT NULL,
  `physicianLast` varchar(100) DEFAULT NULL,
  `mrn` varchar(80) DEFAULT NULL,
  `eventId` bigint(20) unsigned NOT NULL,
  `historyStartDate` datetime DEFAULT NULL,
  `historyEndDate` datetime DEFAULT NULL,
  `historyAction` varchar(20) DEFAULT NULL,
  `historyUser` varchar(85) DEFAULT NULL,
  `historyId` int(11) unsigned NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`historyId`) USING BTREE,
  KEY `idxreportIdHistoryReportId` (`reportId`) USING BTREE,
  KEY `idxreportedDemographsHistorySpecimenId` (`specimenId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for reqCurrentMedications
-- ----------------------------
CREATE TABLE `reqCurrentMedications` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `requestId` varchar(80) NOT NULL,
  `drugId` int(11) unsigned NOT NULL,
  `orderTest` bit(4) DEFAULT b'0',
  `prescribed` bit(4) DEFAULT b'0',
  `eventId` bigint(20) unsigned NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `uqreqCurrentMedicationsreqIdDrugId` (`requestId`,`drugId`) USING BTREE,
  KEY `ixreqCurrentMedicationsRequestId` (`requestId`) USING BTREE,
  KEY `ixreqCurrentMedicationsdrugId` (`drugId`) USING BTREE,
  KEY `ixreqCurrentMedicationsEventId` (`eventId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for reqHoldDescriptions
-- ----------------------------
CREATE TABLE `reqHoldDescriptions` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `hold` varchar(100) NOT NULL,
  `controllable` varchar(100) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for reqHolds
-- ----------------------------
CREATE TABLE `reqHolds` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `reqId` varchar(80) NOT NULL,
  `reqHoldId` int(11) unsigned NOT NULL,
  `eventId` bigint(20) unsigned NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `idxreqHoldsReqId` (`reqId`) USING BTREE,
  KEY `idxreqHoldsEventId` (`eventId`) USING BTREE,
  KEY `fkreqHoldsReqHoldId` (`reqHoldId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for reqPanels
-- ----------------------------
CREATE TABLE `reqPanels` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `requestId` varchar(80) NOT NULL DEFAULT '',
  `panelCode` varchar(80) NOT NULL DEFAULT '',
  `eventid` bigint(20) unsigned NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `idxreqPanelsRequestId` (`requestId`,`panelCode`) USING BTREE,
  KEY `idxreqPanelsEventId` (`eventid`) USING BTREE,
  KEY `idxreqPanelsPanelCode` (`panelCode`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for requestCodes
-- ----------------------------
CREATE TABLE `requestCodes` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `requestId` varchar(80) NOT NULL,
  `codeId` int(11) unsigned NOT NULL,
  `eventId` bigint(20) unsigned NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `idxrequestCodesRequestId` (`requestId`,`codeId`) USING BTREE,
  KEY `idxrequestCodesEventId` (`eventId`) USING BTREE,
  KEY `idxrequestCodesCodeId` (`codeId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for requestCodesHistory
-- ----------------------------
CREATE TABLE `requestCodesHistory` (
  `id` int(11) unsigned NOT NULL,
  `requestId` varchar(80) NOT NULL,
  `codeId` int(11) unsigned NOT NULL,
  `eventId` bigint(20) unsigned NOT NULL,
  `historyStartDate` datetime DEFAULT NULL,
  `historyEndDate` datetime DEFAULT NULL,
  `historyAction` varchar(20) DEFAULT NULL,
  `historyUser` varchar(85) DEFAULT NULL,
  `historyId` int(11) unsigned NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`historyId`) USING BTREE,
  KEY `idxrequestCodesHistoryRequestId` (`requestId`,`codeId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for requestForms
-- ----------------------------
CREATE TABLE `requestForms` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `requestId` varchar(80) NOT NULL,
  `placerOrderId` varchar(100) DEFAULT NULL,
  `sendingApp` varchar(100) DEFAULT NULL,
  `sendingFacility` varchar(100) DEFAULT NULL,
  `patientId` varchar(80) DEFAULT NULL,
  `physicianId` varchar(80) DEFAULT NULL,
  `physicianSiteId` varchar(80) DEFAULT NULL,
  `type` varchar(100) DEFAULT NULL,
  `mrn` varchar(80) DEFAULT NULL,
  `mrnType` varchar(80) DEFAULT NULL,
  `mrnFacility` varchar(100) DEFAULT NULL,
  `consent` bit(1) NOT NULL,
  `consentBy` varchar(100) DEFAULT NULL,
  `consenteePatientRelationship` varchar(100) DEFAULT NULL,
  `clinicalTrial` bit(1) NOT NULL,
  `workersComp` bit(1) NOT NULL,
  `patientSignature` bit(1) NOT NULL,
  `patientSignatureDate` date DEFAULT NULL,
  `physicianSignature` bit(1) NOT NULL,
  `physicianSignatureDate` date DEFAULT NULL,
  `physicianComment` text,
  `priority` smallint(5) DEFAULT NULL,
  `eventId` bigint(20) unsigned NOT NULL,
  `receivedDate` date DEFAULT NULL,
  `externalRequestId` varchar(100) DEFAULT NULL,
  `externalSystem` varchar(100) DEFAULT NULL,
  `accountNumber` varchar(100) DEFAULT NULL,
  `encounterNumber` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `idxrequestFormsPlacerRequestId` (`requestId`) USING BTREE,
  KEY `idxrequestFormsPlacerOrderId` (`placerOrderId`) USING BTREE,
  KEY `idxrequestFormsPatientId` (`mrn`) USING BTREE,
  KEY `idxrequestFormsMrn` (`patientId`) USING BTREE,
  KEY `idxrequestFormsPhysicianId` (`physicianId`,`physicianSiteId`) USING BTREE,
  KEY `idxrequestFormsPhysicianSiteId` (`physicianSiteId`,`physicianId`) USING BTREE,
  KEY `idxrequestFormsEventId` (`eventId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for requestFormsHistory
-- ----------------------------
CREATE TABLE `requestFormsHistory` (
  `id` int(11) unsigned NOT NULL,
  `requestId` varchar(80) NOT NULL,
  `placerOrderId` varchar(100) DEFAULT NULL,
  `sendingApp` varchar(100) DEFAULT NULL,
  `sendingFacility` varchar(100) DEFAULT NULL,
  `patientId` varchar(80) DEFAULT NULL,
  `physicianId` varchar(80) DEFAULT NULL,
  `physicianSiteId` varchar(80) DEFAULT NULL,
  `type` varchar(100) DEFAULT NULL,
  `mrn` varchar(80) DEFAULT NULL,
  `mrnType` varchar(80) DEFAULT NULL,
  `mrnFacility` varchar(100) DEFAULT NULL,
  `consent` bit(1) NOT NULL,
  `consentBy` varchar(100) DEFAULT NULL,
  `consenteePatientRelationship` varchar(100) DEFAULT NULL,
  `clinicalTrial` bit(1) NOT NULL,
  `workersComp` bit(1) NOT NULL,
  `patientSignature` bit(1) NOT NULL,
  `patientSignatureDate` date DEFAULT NULL,
  `physicianSignature` bit(1) NOT NULL,
  `physicianSignatureDate` date DEFAULT NULL,
  `physicianComment` text,
  `priority` smallint(5) DEFAULT NULL,
  `eventId` bigint(20) unsigned NOT NULL,
  `receivedDate` date DEFAULT NULL,
  `externalRequestId` varchar(100) DEFAULT NULL,
  `externalSystem` varchar(100) DEFAULT NULL,
  `accountNumber` varchar(100) DEFAULT NULL,
  `encounterNumber` varchar(100) DEFAULT NULL,
  `historyStartDate` datetime DEFAULT NULL,
  `historyEndDate` datetime DEFAULT NULL,
  `historyAction` varchar(20) DEFAULT NULL,
  `historyUser` varchar(85) DEFAULT NULL,
  `historyId` int(11) unsigned NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`historyId`) USING BTREE,
  KEY `idxrequestFormsRequestId` (`requestId`) USING BTREE,
  KEY `idxrequestFormsHistoryPatientId` (`patientId`) USING BTREE,
  KEY `idxrequestFormsHistoryPhysicianId` (`physicianId`) USING BTREE,
  KEY `idxrequestFormsHistoryPhysicianSiteId` (`physicianSiteId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for requestSpecimens
-- ----------------------------
CREATE TABLE `requestSpecimens` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `requestId` varchar(80) NOT NULL,
  `patientId` varchar(80) NOT NULL,
  `expectedBarcode` varchar(80) DEFAULT NULL,
  `externalIdentifier` varchar(80) DEFAULT NULL,
  `specimenType` varchar(80) NOT NULL,
  `specimenSource` varchar(80) DEFAULT NULL,
  `collectionDate` date DEFAULT NULL,
  `collectionTime` time DEFAULT NULL,
  `specimenId` varchar(80) DEFAULT NULL,
  `receivedDate` date DEFAULT NULL,
  `specimenQuantity` decimal(10, 3) DEFAULT NULL,
  `specimenQuantityUnits` varchar(50) DEFAULT NULL,
  `collectorName` varchar(100) DEFAULT NULL,
  `specimenCondition` text,
  `status` varchar(80) DEFAULT NULL,
  `statusEventId` BIGINT(20) UNSIGNED NULL,
  `eventId` bigint(20) unsigned NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `idxrequestSpecimensSpecimenId` (`specimenId`,`requestId`,`specimenType`) USING BTREE,
  KEY `idxrequestSpecimensSampleType` (`specimenType`,`specimenId`,`requestId`) USING BTREE,
  KEY `idxrequestSpecimensEventId` (`eventId`) USING BTREE,
  KEY `idxrequestSpecimensProbandId` (`specimenId`,`specimenSource`) USING BTREE,
  KEY `idxrequestSpecimensRequestId` (`requestId`,`specimenId`,`specimenType`) USING BTREE,
  KEY `idxrequestSpecimensPatientId` (`patientId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for requestSpecimensHistory
-- ----------------------------
CREATE TABLE `requestSpecimensHistory` (
  `id` int(11) unsigned NOT NULL,
  `requestId` varchar(80) NOT NULL,
  `patientId` varchar(80) NOT NULL,
  `expectedBarcode` varchar(80) DEFAULT NULL,
  `externalIdentifier` varchar(80) DEFAULT NULL,
  `specimenType` varchar(80) NOT NULL,
  `specimenSource` varchar(80) DEFAULT NULL,
  `collectionDate` date DEFAULT NULL,
  `collectionTime` time DEFAULT NULL,
  `specimenId` varchar(80) DEFAULT NULL,
  `receivedDate` date DEFAULT NULL,
  `specimenQuantity` decimal(10, 3) DEFAULT NULL,
  `specimenQuantityUnits` varchar(50) DEFAULT NULL,
  `collectorName` varchar(100) DEFAULT NULL,
  `specimenCondition` text,
  `status` varchar(80) DEFAULT NULL,
  `eventId` bigint(20) unsigned NOT NULL,
  `historyStartDate` datetime DEFAULT NULL,
  `historyEndDate` datetime DEFAULT NULL,
  `historyAction` varchar(20) DEFAULT NULL,
  `historyUser` varchar(85) DEFAULT NULL,
  `historyId` int(11) unsigned NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`historyId`) USING BTREE,
  KEY `idxrequestSpecimensHistoryRequestId` (`requestId`) USING BTREE,
  KEY `idxrequestSpecimensHistorySpecimenType` (`specimenType`) USING BTREE,
  KEY `idxrequestSpecimensHistorySpecimenId` (`specimenId`) USING BTREE,
  KEY `idxrequestSpecimensHistoryExternalIdentifier` (`externalIdentifier`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for routingMatrix
-- ----------------------------
CREATE TABLE `routingMatrix` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `priority` int(11) NOT NULL DEFAULT 1,
  `routingType` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'run',
  `routingDirection` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'OUT',
  `orderType` varchar(80) DEFAULT NULL,
  `specimenType` varchar(80) DEFAULT NULL,
  `testCode` varchar(80) DEFAULT NULL,
  `methodCode` varchar(80) DEFAULT NULL,
  `specimenAge` int(10) unsigned DEFAULT NULL,
  `specimenQuantityQualifier` varchar(2) DEFAULT NULL,
  `specimenQuantity` varchar(50) DEFAULT NULL,
  `result` varchar(80) DEFAULT NULL,
  `runCount` int(10) unsigned DEFAULT NULL,
  `sourceStep` varchar(80) NOT NULL,
  `diagnosticCode` int(11) unsigned DEFAULT NULL,
  `nextStep` TEXT NOT NULL,
  `eventId` bigint(20) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idxroutingMatrixEventId` (`eventId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for ruuResults
-- ----------------------------
CREATE TABLE `ruuResults` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `sampleId` varchar(80) NOT NULL,
  `result` varchar(255) DEFAULT NULL,
  `eventId` bigint(20) unsigned NOT NULL,
  `sentToGIEventId` bigint(20) unsigned NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `idxruuResultsSampleId` (`sampleId`) USING BTREE,
  KEY `idxruuResultsEventId` (`eventId`) USING BTREE,
  KEY `idxruuResultsSentToGIEventId` (`sentToGIEventId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for ruuTranslation
-- ----------------------------
CREATE TABLE `ruuTranslation` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `gene` varchar(255) NOT NULL,
  `vicfam` varchar(255) NOT NULL,
  `rsNumber` varchar(255) NOT NULL,
  `location` varchar(255) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `idxruuTranslationGene` (`gene`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for sampleFailure
-- ----------------------------
CREATE TABLE `sampleFailure` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `sampleId` varchar(80) NOT NULL,
  `stepFailed` varchar(100) NOT NULL,
  `stepRequeued` varchar(100) DEFAULT NULL,
  `comment` text,
  `eventId` bigint(20) unsigned NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `idxsampleFailureSampleId` (`sampleId`) USING BTREE,
  KEY `idxsampleFailureEventId` (`eventId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for samplePanels
-- ----------------------------
CREATE TABLE `samplePanels` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `requestId` varchar(80) NOT NULL,
  `sampleId` varchar(80) NOT NULL,
  `panelCode` varchar(80) NOT NULL,
  `testCode` varchar(80) NOT NULL,
  `eventId` bigint(20) unsigned NOT NULL,
  `completedEventId` bigint(20) unsigned DEFAULT NULL,
  `cancelledEventId` bigint(20) unsigned DEFAULT NULL,
  `report` varchar(100) DEFAULT NULL,
  `sampleProcessingId` int(11) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `idxsamplePanelsSampleId` (`sampleId`,`requestId`,`panelCode`,`testCode`) USING BTREE,
  KEY `idxsamplePanelsReqId` (`requestId`) USING BTREE,
  KEY `idxsamplePanelsEventId` (`eventId`) USING BTREE,
  KEY `idxsamplePanelsCompletedEventId` (`completedEventId`) USING BTREE,
  KEY `idxsamplePanelscancelledEventId` (`cancelledEventId`) USING BTREE,
  KEY `idxsamplePanelsSampleProcessingId` (`sampleProcessingId`) USING BTREE,
  KEY `idxsamplePanelsPanelCode` (`panelCode`,`testCode`) USING BTREE,
  KEY `idxsamplePanelsTestCode` (`testCode`,`panelCode`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for sampleProcessing
-- ----------------------------
CREATE TABLE `sampleProcessing` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `sampleId` varchar(80) NOT NULL,
  `sampleType` varchar(80) DEFAULT NULL,
  `batchId` varchar(80) DEFAULT NULL,
  `batchEventId` bigint(20) unsigned DEFAULT NULL,
  `reqId` varchar(80) DEFAULT NULL,
  `panelCode` varchar(80) NOT NULL,
  `testCode` varchar(80) NOT NULL,
  `eventId` bigint(20) unsigned NOT NULL,
  `completedEventId` bigint(20) unsigned DEFAULT NULL,
  `cancelledEventId` bigint(20) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `idxsampleProcessingSampleId` (`sampleId`,`testCode`,`panelCode`,`batchId`) USING BTREE,
  KEY `idxsampleProcessingReqId` (`reqId`) USING BTREE,
  KEY `idxsampleProcessingBatchId` (`batchId`) USING BTREE,
  KEY `idxsampleProcessingEventId` (`eventId`) USING BTREE,
  KEY `idxsampleProcessingBeatchEventId` (`batchEventId`) USING BTREE,
  KEY `idxsampleProcessingCompletedEventId` (`completedEventId`) USING BTREE,
  KEY `idxsampleProcessingCancelledEventId` (`cancelledEventId`) USING BTREE,
  KEY `idxsampleProcessingTestCode` (`testCode`,`panelCode`) USING BTREE,
  KEY `idxsampleProcessingPanelCode` (`panelCode`,`testCode`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for sampleProperties
-- ----------------------------
CREATE TABLE `sampleProperties` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `sampleId` varchar(80) NOT NULL,
  `property` varchar(100) NOT NULL,
  `propertyType` varchar(100) DEFAULT NULL,
  `value` varchar(255) DEFAULT NULL,
  `dateValue` date DEFAULT NULL,
  `eventId` bigint(20) unsigned NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `idxsamplePropertiesSampleId` (`sampleId`,`property`) USING BTREE,
  KEY `idxsamplePropertiesEventId` (`eventId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for sanger
-- ----------------------------
CREATE TABLE `sanger` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `variantId` varchar(255) NOT NULL,
  `sangerId` varchar(255) NOT NULL,
  `status` varchar(255) DEFAULT NULL,
  `sampleId` varchar(80) NOT NULL,
  `gene` varchar(255) DEFAULT NULL,
  `changeType` varchar(255) DEFAULT NULL,
  `variant` varchar(255) DEFAULT NULL,
  `gr37Coordinate` varchar(255) DEFAULT NULL,
  `gr38Coordinate` varchar(255) DEFAULT NULL,
  `eventId` bigint(20) unsigned DEFAULT NULL,
  `updateEventId` bigint(20) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `idxsangerSangerId` (`sangerId`) USING BTREE,
  UNIQUE KEY `eventId_UNIQUE` (`eventId`) USING BTREE,
  KEY `idxsangerSampleId` (`sampleId`) USING BTREE,
  KEY `idxsangerEventId` (`eventId`) USING BTREE,
  KEY `idxsangerUpdateEventId` (`updateEventId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for sangerResults
-- ----------------------------
CREATE TABLE `sangerResults` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `sangerId` varchar(255) NOT NULL,
  `sampleId` varchar(80) NOT NULL,
  `variantId` varchar(255) NOT NULL,
  `forwardSeqId` varchar(255) DEFAULT NULL,
  `reverseSeqId` varchar(255) DEFAULT NULL,
  `orderNo` varchar(255) DEFAULT NULL,
  `confirmResult` varchar(255) DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `finalStatusEventId` bigint(20) unsigned DEFAULT NULL,
  `notes` text,
  `sentToGIEventId` bigint(20) unsigned DEFAULT NULL,
  `eventId` bigint(20) unsigned NOT NULL,
  `statusEventId` bigint(20) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `idxsangerResultsSangerId` (`sangerId`) USING BTREE,
  KEY `idxsangerResultsSampleId` (`sampleId`) USING BTREE,
  KEY `idxsangerResultsEventId` (`eventId`) USING BTREE,
  KEY `idxsangerResultsFinalStatusEventId` (`finalStatusEventId`) USING BTREE,
  KEY `idxsangerResultsSentToGIEventId` (`sentToGIEventId`) USING BTREE,
  KEY `idxsangerResultsStatusEventId` (`statusEventId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for snpList
-- ----------------------------
CREATE TABLE `snpList` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `assay` varchar(255) NOT NULL,
  `gene` varchar(255) DEFAULT NULL,
  `rsId` varchar(255) DEFAULT NULL,
  `allele1` varchar(50) DEFAULT NULL,
  `allele2` varchar(50) DEFAULT NULL,
  `eventId` bigint(20) unsigned NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `idxsnpListAssay` (`assay`) USING BTREE,
  KEY `idxsnpListEventId` (`eventId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for snpResults
-- ----------------------------
CREATE TABLE `snpResults` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `sampleId` varchar(80) NOT NULL,
  `plate` varchar(80) DEFAULT NULL,
  `well` varchar(50) DEFAULT NULL,
  `assay` varchar(255) NOT NULL DEFAULT '',
  `gene` varchar(255) NOT NULL DEFAULT '',
  `snp` varchar(255) NOT NULL DEFAULT '',
  `fileReferenceId` varchar(255) DEFAULT NULL,
  `resultCall` varchar(255) DEFAULT NULL,
  `allele1` varchar(20) DEFAULT NULL,
  `allele2` varchar(20) DEFAULT NULL,
  `eventId` bigint(20) unsigned NOT NULL,
  `qcResult` varchar(50) DEFAULT NULL,
  `qcEventId` bigint(20) unsigned DEFAULT NULL,
  `duplication` varchar(255) DEFAULT NULL,
  `deletion` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `idxsnpResultsSampleId` (`sampleId`) USING BTREE,
  KEY `idxsnpResultsPlate` (`plate`,`well`) USING BTREE,
  KEY `idxsnpResultsEventId` (`eventId`) USING BTREE,
  KEY `idxsnpResultsQcEventId` (`qcEventId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for snpResultsHistory
-- ----------------------------
CREATE TABLE `snpResultsHistory` (
  `id` int(11) unsigned NOT NULL,
  `sampleId` varchar(80) NOT NULL,
  `plate` varchar(80) DEFAULT NULL,
  `well` varchar(50) DEFAULT NULL,
  `assay` varchar(255) NOT NULL DEFAULT '',
  `gene` varchar(255) NOT NULL DEFAULT '',
  `snp` varchar(255) NOT NULL DEFAULT '',
  `fileReferenceId` varchar(255) DEFAULT NULL,
  `resultCall` varchar(255) DEFAULT NULL,
  `allele1` varchar(20) DEFAULT NULL,
  `allele2` varchar(20) DEFAULT NULL,
  `eventId` bigint(20) unsigned NOT NULL,
  `qcResult` varchar(50) DEFAULT NULL,
  `qcEventId` bigint(20) unsigned DEFAULT NULL,
  `duplication` varchar(255) DEFAULT NULL,
  `deletion` varchar(255) DEFAULT NULL,
  `historyStartDate` datetime DEFAULT NULL,
  `historyEndDate` datetime DEFAULT NULL,
  `historyAction` varchar(20) DEFAULT NULL,
  `historyUser` varchar(85) DEFAULT NULL,
  `historyId` int(11) unsigned NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`historyId`) USING BTREE,
  KEY `idxsnpResultsHistorySampleId` (`sampleId`) USING BTREE,
  KEY `idxsnpResultsHistoryPlate` (`plate`,`well`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for snpReviewResults
-- ----------------------------
CREATE TABLE `snpReviewResults` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `requestId` varchar(80) NOT NULL,
  `reportId` varchar(80) NOT NULL,
  `specimenId` varchar(80) DEFAULT NULL,
  `snpResultsId` int(11) unsigned NOT NULL,
  `sampleId` varchar(80) NOT NULL,
  `assay` varchar(255) NOT NULL DEFAULT '',
  `gene` varchar(255) NOT NULL DEFAULT '',
  `snp` varchar(255) NOT NULL DEFAULT '',
  `resultCall` varchar(255) DEFAULT NULL,
  `allele1` varchar(20) DEFAULT NULL,
  `allele2` varchar(20) DEFAULT NULL,
  `reportable` varchar(50) DEFAULT NULL,
  `allele1Phenotype` varchar(255) DEFAULT NULL,
  `allele2Phenotype` varchar(255) DEFAULT NULL,
  `resultCallPhenotype` varchar(255) DEFAULT NULL,
  `eventId` bigint(20) unsigned NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `idxsnpReviewResultsSnpResultsId` (`snpResultsId`) USING BTREE,
  KEY `idxsnpReviewResultsRequestId` (`requestId`) USING BTREE,
  KEY `idxsnpReviewResultsSampleId` (`sampleId`) USING BTREE,
  KEY `idxsnpReviewResultsReportId` (`reportId`) USING BTREE,
  KEY `idxsnpReviewResultsEventId` (`eventId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for snpReviewResultsHistory
-- ----------------------------
CREATE TABLE `snpReviewResultsHistory` (
  `id` int(11) unsigned NOT NULL,
  `requestId` varchar(80) NOT NULL,
  `reportId` varchar(80) NOT NULL,
  `specimenId` varchar(80) DEFAULT NULL,
  `snpResultsId` int(11) unsigned NOT NULL,
  `sampleId` varchar(80) NOT NULL,
  `assay` varchar(255) NOT NULL DEFAULT '',
  `gene` varchar(255) NOT NULL DEFAULT '',
  `snp` varchar(255) NOT NULL DEFAULT '',
  `resultCall` varchar(255) DEFAULT NULL,
  `allele1` varchar(20) DEFAULT NULL,
  `allele2` varchar(20) DEFAULT NULL,
  `reportable` varchar(50) DEFAULT NULL,
  `allele1Phenotype` varchar(255) DEFAULT NULL,
  `allele2Phenotype` varchar(255) DEFAULT NULL,
  `resultCallPhenotype` varchar(255) DEFAULT NULL,
  `eventId` bigint(20) unsigned NOT NULL,
  `historyStartDate` datetime DEFAULT NULL,
  `historyEndDate` datetime DEFAULT NULL,
  `historyAction` varchar(20) DEFAULT NULL,
  `historyUser` varchar(85) DEFAULT NULL,
  `historyId` int(11) unsigned NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`historyId`) USING BTREE,
  KEY `idxsnpReviewResultsHistorysnpResultsId` (`snpResultsId`) USING BTREE,
  KEY `idxsnpReviewResultsHistoryRequestId` (`requestId`) USING BTREE,
  KEY `idxsnpReviewResultsHistoryReportId` (`reportId`) USING BTREE,
  KEY `idxsnpReviewResultsHistorySpecimenId` (`specimenId`) USING BTREE,
  KEY `idxsnpReviewResultsHistorySampleId` (`sampleId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for specimenMethods
-- ----------------------------
CREATE TABLE `specimenMethods` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `requestSpecimensId` int(11) unsigned NOT NULL,
  `testCode` varchar(80) NOT NULL,
  `methodCode` varchar(80) DEFAULT NULL,
  `runCount` int(5) unsigned DEFAULT '1',
  `status` varchar(80) DEFAULT NULL,
  `statusEventId` bigint(20) unsigned DEFAULT NULL,
  `eventId` bigint(20) unsigned NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `idxspecimenMethodsRequestSpecimensId` (`requestSpecimensId`) USING BTREE,
  KEY `idxspecimenMethodsEventId` (`eventId`) USING BTREE,
  KEY `idxspecimenMethodsTestCode` (`testCode`) USING BTREE,
  KEY `idxspecimenMethodsStatus` (`status`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for specimenMethodsHistory
-- ----------------------------
CREATE TABLE `specimenMethodsHistory` (
  `id` int(11) unsigned NOT NULL,
  `requestSpecimensId` int(11) unsigned NOT NULL,
  `testCode` varchar(80) NOT NULL,
  `methodCode` varchar(80) DEFAULT NULL,
  `runCount` int(5) unsigned DEFAULT '1',
  `status` varchar(80) DEFAULT NULL,
  `statusEventId` bigint(20) unsigned DEFAULT NULL,
  `eventId` bigint(20) unsigned NOT NULL,
  `historyStartDate` datetime DEFAULT NULL,
  `historyEndDate` datetime DEFAULT NULL,
  `historyAction` varchar(20) DEFAULT NULL,
  `historyUser` varchar(85) DEFAULT NULL,
  `historyId` int(11) unsigned NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`historyId`) USING BTREE,
  KEY `idxspecimenMethodsHistoryRequestSpecimensId` (`requestSpecimensId`) USING BTREE,
  KEY `idxspecimenMethodsHistoryId` (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for specimenRuns
-- ----------------------------
CREATE TABLE `specimenRuns` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `runId` varchar(80) DEFAULT NULL,
  `specimenMethodsId` int(10) unsigned NOT NULL,
  `runType` varchar(80) NOT NULL DEFAULT 'workflow',
  `currentContainerId` varchar(80) NOT NULL,
  `currentParentId` varchar(80) DEFAULT NULL,
  `currentParentPosition` varchar(20) DEFAULT NULL,
  `completedResult` varchar(80) DEFAULT NULL,
  `completedEventId` bigint(20) unsigned DEFAULT NULL,
  `parentWorkflowSpecimenRunId` int(10) unsigned NOT NULL DEFAULT '0',
  `eventId` bigint(20) unsigned DEFAULT NULL,
  `modifier` varchar(80) NOT NULL DEFAULT 'self',
  `lastUpdatedEventId` bigint(20) UNSIGNED NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idxspecimenRunsRunId` (`runId`) USING BTREE,
  KEY `idxspecimenRunsSpecimensMethodsId` (`specimenMethodsId`) USING BTREE,
  KEY `idxspecimenRunsLastUpdatedEventId` (`lastUpdatedEventId`) USING BTREE,
  KEY `idxspecimenRunsCurrentTubeId` (`currentContainerId`) USING BTREE,
  KEY `idxspeciemnRunsCurrentParrentId` (`currentParentId`) USING BTREE,
  KEY `fkspecimenRunsCompletedEventId` (`completedEventId`),
  KEY `fkspecimenRunsEventId` (`eventId`))
  ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for specimenRunsHistory
-- ----------------------------
CREATE TABLE `specimenRunsHistory` (
  `id` int(10) unsigned NOT NULL,
  `runId` varchar(80) DEFAULT NULL,
  `specimenMethodsId` int(10) unsigned NOT NULL,
  `runType` varchar(80) NOT NULL DEFAULT 'workflow',
  `currentContainerId` varchar(80) NOT NULL,
  `currentParentId` varchar(80) DEFAULT NULL,
  `currentParentPosition` varchar(20) DEFAULT NULL,
  `completedResult` varchar(80) DEFAULT NULL,
  `completedEventId` bigint(20) unsigned DEFAULT NULL,
  `parentWorkflowSpecimenRunId` int(10) unsigned NOT NULL DEFAULT '0',
  `eventId` bigint(20) unsigned DEFAULT NULL,
  `modifier` varchar(80) NOT NULL DEFAULT 'self',
  `lastUpdatedEventId` BIGINT(20) UNSIGNED NOT NULL,
  `historyStartDate` datetime DEFAULT NULL,
  `historyEndDate` datetime DEFAULT NULL,
  `historyAction` varchar(20) DEFAULT NULL,
  `historyUser` varchar(85) DEFAULT NULL,
  `historyId` int(11) unsigned NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`historyId`),
  KEY `idxspecimenRunsHistoryId` (`id`) USING BTREE,
  KEY `idxspecimenRunsHistoryRunId` (`RunId`) USING BTREE,
  KEY `idxspecimenRunsHistorySpecimenMethodsId` (`specimenMethodsId`) USING BTREE
) ENGINE=InnoDB  DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for state
-- ----------------------------
CREATE TABLE `state` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `abbreviation` varchar(255) DEFAULT NULL,
  `country` varchar(100) DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL,
  `sort` int(11) DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `occupied` varchar(255) DEFAULT NULL,
  `notes` text,
  `fips_state` varchar(255) DEFAULT NULL,
  `assoc_press` varchar(255) DEFAULT NULL,
  `standard_federal_region` varchar(255) DEFAULT NULL,
  `census_region` varchar(255) DEFAULT NULL,
  `census_region_name` varchar(255) DEFAULT NULL,
  `census_division` varchar(255) DEFAULT NULL,
  `census_division_name` varchar(255) DEFAULT NULL,
  `circuit_court` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `idxstateName` (`name`,`country`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- ----------------------------
-- Table structure for storage
-- ----------------------------
CREATE TABLE `storage` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `storageContainerId` varchar(80) NOT NULL,
  `location` varchar(255) NOT NULL DEFAULT '',
  `contentType` varchar(80) NOT NULL,
  `content` varchar(80) NOT NULL,
  `storagePath` mediumtext,
  `eventId` bigint(20) unsigned NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `idxstorageStorageContainerId` (`storageContainerId`,`content`) USING BTREE,
  KEY `idxstorageContent` (`content`,`contentType`) USING BTREE,
  KEY `idxstorageEventId` (`eventId`) USING BTREE,
  KEY `idxstorageStorageContent` (`contentType`,`content`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for storageContainerInfo
-- ----------------------------
CREATE TABLE `storageContainerInfo` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `storageContainerId` varchar(80) NOT NULL,
  `type` varchar(255) DEFAULT NULL,
  `model` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `eventId` bigint(20) unsigned NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `idxstorageContainerInfoStorageContainerId` (`storageContainerId`) USING BTREE,
  KEY `idxStorageContainerInfoEventId` (`eventId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for storageContainerInfoHistory
-- ----------------------------
CREATE TABLE `storageContainerInfoHistory` (
  `id` int(11) unsigned NOT NULL,
  `newStorageContainerId` varchar(80) NOT NULL,
  `storageContainerId` varchar(80) NOT NULL,
  `type` varchar(255) DEFAULT NULL,
  `model` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `eventId` bigint(20) unsigned NOT NULL,
  `historyStartDate` datetime DEFAULT NULL,
  `historyEndDate` datetime DEFAULT NULL,
  `historyAction` varchar(20) DEFAULT NULL,
  `historyUser` varchar(85) DEFAULT NULL,
  `historyId` int(11) unsigned NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`historyId`) USING BTREE,
  KEY `idxstorageContainerInfoHistoryStorageContainerId` (`storageContainerId`) USING BTREE,
  KEY `idxstorageContainerInfoHistoryNewStorageContainerId` (`newStorageContainerId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for storageDataUpload
-- ----------------------------
CREATE TABLE `storageDataUpload` (
  `id` int(11) NOT NULL,
  `practiceId` varchar(255) DEFAULT NULL,
  `physicianId` varchar(255) DEFAULT NULL,
  `aliquotId` varchar(255) DEFAULT NULL,
  `sampleType` varchar(255) DEFAULT NULL,
  `collectionDate` varchar(255) DEFAULT NULL,
  `storageBox` varchar(255) DEFAULT NULL,
  `storageWell` varchar(255) DEFAULT NULL,
  `subjectId` varchar(255) DEFAULT NULL,
  `firstName` varchar(255) DEFAULT NULL,
  `middleName` varchar(255) DEFAULT NULL,
  `lastName` varchar(255) DEFAULT NULL,
  `age` varchar(255) DEFAULT NULL,
  `dob` varchar(255) DEFAULT NULL,
  `gender` varchar(255) DEFAULT NULL,
  `ethnicity` varchar(255) DEFAULT NULL,
  `mrn` varchar(255) DEFAULT NULL,
  `property1` text,
  `value1` text,
  `property2` text,
  `value2` text,
  `property3` text,
  `value3` text,
  `property4` text,
  `value4` text,
  `property5` text,
  `value5` text,
  `property6` text,
  `value6` text,
  `property7` text,
  `value7` text,
  `property8` text,
  `value8` text,
  `property9` text,
  `value9` text,
  `property10` text,
  `value10` text,
  `comments` text,
  `eventId` bigint(20) unsigned DEFAULT NULL,
  `patientId` varchar(255) DEFAULT NULL,
  `specimenId` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for storageDisplayRules
-- ----------------------------
CREATE TABLE `storageDisplayRules` (
  `id` int(11) unsigned NOT NULL,
  `storageType` varchar(255) DEFAULT NULL,
  `sizeCategory` int(11) DEFAULT NULL,
  `color` varchar(50) DEFAULT NULL,
  `eventId` bigint(20) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for storageHistory
-- ----------------------------
CREATE TABLE `storageHistory` (
  `id` int(11) unsigned NOT NULL,
  `storageContainerId` varchar(80) NOT NULL,
  `location` varchar(255) NOT NULL DEFAULT '',
  `contentType` varchar(80) NOT NULL,
  `content` varchar(80) NOT NULL,
  `storagePath` mediumtext,
  `eventId` bigint(20) unsigned NOT NULL,
  `recordEventId` bigint(20) unsigned NOT NULL,
  `removeDate` datetime NOT NULL,
  `historyStartDate` datetime DEFAULT NULL,
  `historyEndDate` datetime DEFAULT NULL,
  `historyAction` varchar(20) DEFAULT NULL,
  `historyUser` varchar(85) DEFAULT NULL,
  `historyId` int(11) unsigned NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`historyId`) USING BTREE,
  UNIQUE KEY `idxstorageHistoryStorageContainerId` (`storageContainerId`) USING BTREE,
  KEY `idxstorageHistoryContent` (`content`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for storagePathTemp
-- ----------------------------
CREATE TABLE `storagePathTemp` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `children` varchar(255) DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL,
  `path` text,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for storedSpecimenInfo
-- ----------------------------
CREATE TABLE `storedSpecimenInfo` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `specimenId` varchar(80) NOT NULL DEFAULT '',
  `collectionDate` date DEFAULT NULL,
  `collectionTime` varchar(50) DEFAULT NULL,
  `collectionType` varchar(100) DEFAULT NULL,
  `collectionVolume` decimal(5,2) DEFAULT NULL,
  `specimenType` varchar(90) DEFAULT NULL,
  `receiveDate` date DEFAULT NULL,
  `shippingCondition` varchar(255) DEFAULT NULL,
  `sampleCondition` varchar(255) DEFAULT NULL,
  `comments` text,
  `eventId` bigint(20) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `idxstoredSpecimenInfoSpecimenId` (`specimenId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for storedSpecimenRelationships
-- ----------------------------
CREATE TABLE `storedSpecimenRelationships` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `specimenId` varchar(80) DEFAULT NULL,
  `entityId` varchar(255) DEFAULT NULL,
  `entityType` varchar(255) DEFAULT NULL,
  `eventId` bigint(20) unsigned NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `idxstoredSpecimenRelationshipsSpecimenId` (`specimenId`,`entityId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for storedSpecimenTests
-- ----------------------------
CREATE TABLE `storedSpecimenTests` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `specimenId` varchar(80) DEFAULT NULL,
  `testType` varchar(255) DEFAULT NULL,
  `testResult` varchar(255) DEFAULT NULL,
  `testDate` date DEFAULT NULL,
  `eventId` bigint(20) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- ----------------------------
-- Table structure for testMethods
-- ----------------------------
CREATE TABLE `testMethods` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `methodCode` varchar(80) NOT NULL,
  `testCode` varchar(80) NOT NULL,
  `eventId` bigint(20) unsigned NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `idxtestMethodsCode` (`methodCode`,`testCode`) USING BTREE,
  KEY `idxtestMethodsEventId` (`eventId`) USING BTREE,
  KEY `idxtestMethodsTestCode` (`testCode`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for testPanels
-- ----------------------------
CREATE TABLE `testPanels` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `panelCode` varchar(80) NOT NULL,
  `testCode` varchar(80) NOT NULL,
  `eventId` bigint(20) unsigned NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `idxtestPanelsPanelCode` (`panelCode`,`testCode`) USING BTREE,
  KEY `idxtestPanelsTestCode` (`testCode`,`panelCode`) USING BTREE,
  KEY `idxtestPanelsEventId` (`eventId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for testProcessingProperties
-- ----------------------------
CREATE TABLE `testProcessingProperties` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `sampleId` varchar(80) NOT NULL,
  `batchId` varchar(80) DEFAULT NULL,
  `panelCode` varchar(80) DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL,
  `i7Index` varchar(255) DEFAULT NULL,
  `i7IndexAdaptor` varchar(255) DEFAULT NULL,
  `i5Index` varchar(255) DEFAULT NULL,
  `i5IndexAdaptor` varchar(255) DEFAULT NULL,
  `manifestA` varchar(255) DEFAULT NULL,
  `manifestB` varchar(255) DEFAULT NULL,
  `manifestC` varchar(255) DEFAULT NULL,
  `Sample_Name` varchar(255) DEFAULT NULL,
  `GroupSampleName` varchar(255) DEFAULT NULL,
  `GenomeFolder` varchar(255) DEFAULT NULL,
  `Contaminants` varchar(255) DEFAULT NULL,
  `miRNA` varchar(255) DEFAULT NULL,
  `RNA` varchar(255) DEFAULT NULL,
  `eventId` bigint(20) unsigned NOT NULL,
  `poolTube` varchar(80) DEFAULT NULL,
  `plateId` varchar(80) DEFAULT NULL,
  `well` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `idxtestProcessingPropertiesSampleId` (`sampleId`) USING BTREE,
  KEY `idxtestProcessingPropertiesBatchId` (`batchId`) USING BTREE,
  KEY `idxtestProcessingPropertiesEventId` (`eventId`) USING BTREE,
  KEY `idxtestProcessingPropertiesPlateId` (`plateId`,`well`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for testProcessingSettings
-- ----------------------------
CREATE TABLE `testProcessingSettings` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `batchId` varchar(80) NOT NULL,
  `panelCode` varchar(80) DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL,
  `investigatorName` varchar(255) DEFAULT NULL,
  `projectName` varchar(255) DEFAULT NULL,
  `headerDate` varchar(255) DEFAULT NULL,
  `workflow` varchar(255) DEFAULT NULL,
  `assay` varchar(255) DEFAULT NULL,
  `chemistry` varchar(255) DEFAULT NULL,
  `manifestA` varchar(255) DEFAULT NULL,
  `manifestB` varchar(255) DEFAULT NULL,
  `manifestC` varchar(255) DEFAULT NULL,
  `read1` int(11) DEFAULT NULL,
  `read2` int(11) DEFAULT NULL,
  `adaptorType` varchar(255) DEFAULT NULL,
  `adapter1` varchar(255) DEFAULT NULL,
  `adapter2` varchar(255) DEFAULT NULL,
  `aligner` varchar(255) DEFAULT NULL,
  `picardHSmetrics` varchar(255) DEFAULT NULL,
  `baitManifestFileName` varchar(255) DEFAULT NULL,
  `customAmpliconAlignerMaxIndelSize` varchar(255) DEFAULT NULL,
  `enrichmentMaxRegionStatisticsCount` varchar(255) DEFAULT NULL,
  `excludeRegionsManifestA` varchar(255) DEFAULT NULL,
  `flagPCRDuplicates` varchar(255) DEFAULT NULL,
  `kmer` varchar(255) DEFAULT NULL,
  `outputGenomeVCF` varchar(255) DEFAULT NULL,
  `qualityScoreTrim` varchar(255) DEFAULT NULL,
  `reverseComplement` varchar(255) DEFAULT NULL,
  `stitchReads` varchar(255) DEFAULT NULL,
  `taxonomyFile` varchar(255) DEFAULT NULL,
  `variantCaller` varchar(255) DEFAULT NULL,
  `filterOutSingleStrandVariants` varchar(255) DEFAULT NULL,
  `minimumCoverageDepth` varchar(255) DEFAULT NULL,
  `strandBiasFilter` varchar(255) DEFAULT NULL,
  `indelRepeatFilterCutoff` varchar(255) DEFAULT NULL,
  `minQScore` varchar(255) DEFAULT NULL,
  `variantFrequencyEmitCutoff` varchar(255) DEFAULT NULL,
  `variantFrequencyFilterCutoff` varchar(255) DEFAULT NULL,
  `variantMinimumGQCutoff` varchar(255) DEFAULT NULL,
  `variantMinimumQualCutoff` varchar(255) DEFAULT NULL,
  `eventId` bigint(20) unsigned NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `idxtestProcessingSettingsBatchId` (`batchId`) USING BTREE,
  KEY `idxtestProcessingSettingsEventId` (`eventId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for testReferences
-- ----------------------------
CREATE TABLE `testReferences` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `testCode` varchar(80) NOT NULL,
  `refId` int(11) unsigned NOT NULL,
  `eventId` bigint(20) unsigned NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `idxtestReferencesTestCode` (`testCode`,`refId`) USING BTREE,
  KEY `idxtestReferencesEventId` (`eventId`) USING BTREE,
  KEY `idxtestReferencesRefId` (`refId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for tests
-- ----------------------------
CREATE TABLE `tests` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `testCode` varchar(80) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text NOT NULL,
  `abbreviation` varchar(50) NOT NULL,
  `type` varchar(100) NOT NULL,
  `disabled` bit(1) NOT NULL DEFAULT b'0',
  `eventId` bigint(20) unsigned NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `idxtestsTestCode` (`testCode`) USING BTREE,
  UNIQUE KEY `idxtestsName` (`name`) USING BTREE,
  UNIQUE KEY `idxtestsAbbreviation` (`abbreviation`) USING BTREE,
  KEY `idxtestsEventId` (`eventId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for testsForPanel
-- ----------------------------
CREATE TABLE `testsForPanel` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `panelCode` varchar(80) NOT NULL,
  `testCode` varchar(80) NOT NULL,
  `eventId` bigint(20) unsigned NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `idxtestsForPanelPanelCode` (`panelCode`,`testCode`) USING BTREE,
  KEY `idxtestsForPanelTestCode` (`testCode`) USING BTREE,
  KEY `idxtestsForPanelEventId` (`eventId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for toxConfirmationImport
-- ----------------------------
CREATE TABLE `toxConfirmationImport` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `fileName` text,
  `aliquotId` varchar(80) NOT NULL,
  `instrumentUsed` varchar(80) DEFAULT NULL,
  `batchId` varchar(80) DEFAULT NULL,
  `sampleType` varchar(100) DEFAULT NULL,
  `compound` varchar(100) NOT NULL,
  `concentration` varchar(50) DEFAULT NULL,
  `resultStatus` varchar(100) DEFAULT NULL,
  `resultStatusEventId` bigint(20) unsigned DEFAULT NULL,
  `userId` varchar(80) DEFAULT NULL,
  `comments` text,
  `eventId` bigint(20) unsigned NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `idxtoxConfirmationImportAliquotId` (`aliquotId`,`compound`) USING BTREE,
  KEY `idxtoxConfirmationImportResultStatusEventId` (`resultStatusEventId`) USING BTREE,
  KEY `idxtoxConfirmationImportInstrumentUsed` (`instrumentUsed`) USING BTREE,
  KEY `idxtoxConfirmationImportBatchId` (`batchId`) USING BTREE,
  KEY `idxtoxConfirmationImportEventId` (`eventId`) USING BTREE,
  KEY `idxtoxConfirmationImportUserId` (`userId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for toxConfirmationResults
-- ----------------------------
CREATE TABLE `toxConfirmationResults` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `fileName` text,
  `aliquotId` varchar(80) NOT NULL,
  `instrumentUsed` varchar(80) DEFAULT NULL,
  `batchId` varchar(80) DEFAULT NULL,
  `sampleType` varchar(100) DEFAULT NULL,
  `compound` varchar(100) NOT NULL,
  `concentration` varchar(50) DEFAULT NULL,
  `resultStatus` varchar(100) DEFAULT NULL,
  `resultStatusEventId` bigint(20) unsigned DEFAULT NULL,
  `userId` varchar(85) NOT NULL,
  `comments` text,
  `eventId` bigint(20) unsigned NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `idxtoxConfirmationResultsAliquotId` (`aliquotId`,`compound`) USING BTREE,
  KEY `idxtoxConfirmationResultsResultStatusEventId` (`resultStatusEventId`) USING BTREE,
  KEY `idxtoxConfirmationResultsInstrumentUsed` (`instrumentUsed`) USING BTREE,
  KEY `idxtoxConfirmationResultsBatchId` (`batchId`) USING BTREE,
  KEY `idxtoxConfirmationResultsEventId` (`eventId`) USING BTREE,
  KEY `idxtoxConfirmationResultsUserId` (`userId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for toxConfirmationResultsTempReportData
-- ----------------------------
CREATE TABLE `toxConfirmationResultsTempReportData` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `eventId` bigint(20) unsigned NOT NULL,
  `test` varchar(255) NOT NULL,
  `result` varchar(255) DEFAULT NULL,
  `concentration` varchar(50) DEFAULT NULL,
  `cutOff` varchar(100) DEFAULT NULL,
  `medicationCompliance` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `idxtoxConfirmationResultsTempReportDataTest` (`test`) USING BTREE,
  KEY `idxtoxConfirmationResultsTempReportDataEventId` (`eventId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for toxScreenRawResults
-- ----------------------------
CREATE TABLE `toxScreenRawResults` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `runId` varchar(80) NOT NULL,
  `aliquotId` varchar(80) NOT NULL,
  `testCode` varchar(80) NOT NULL,
  `interpretation` varchar(80) DEFAULT NULL,
  `concentration` varchar(50) DEFAULT NULL,
  `cutOff` varchar(100) DEFAULT NULL,
  `comments` text,
  `eventId` bigint(20) unsigned NOT NULL,
  `acceptStatus` varchar(10) DEFAULT NULL,
  `acceptStatusEventId` bigint(20) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `idxtoxScreenRawResultsAliquotId` (`aliquotId`,`runId`) USING BTREE,
  KEY `idxtoxScreenRawResultsRunId` (`runId`) USING BTREE,
  KEY `idxtoxScreenRawResultsEventId` (`eventId`) USING BTREE,
  KEY `idxtoxScreenRawResultsAcceptStatusEventId` (`acceptStatusEventId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for toxScreenResults
-- ----------------------------
CREATE TABLE `toxScreenResults` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `aliquotId` varchar(80) NOT NULL,
  `testCode` varchar(80) DEFAULT NULL,
  `interpretation` varchar(80) DEFAULT NULL,
  `concentration` varchar(50) DEFAULT NULL,
  `cutOff` varchar(100) DEFAULT NULL,
  `comments` text,
  `eventId` bigint(20) unsigned NOT NULL,
  `screenStatus` varchar(10) DEFAULT NULL,
  `screenStatusEventId` bigint(20) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `idxtoxScreenResultsAliquotId` (`aliquotId`) USING BTREE,
  KEY `idxtoxScreenResultsEventId` (`eventId`) USING BTREE,
  KEY `idxtoxScreenResultsAcceptStatusEventId` (`screenStatusEventId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for toxTecanPlateMap
-- ----------------------------
CREATE TABLE `toxTecanPlateMap` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `fileName` text,
  `plateId` varchar(80) DEFAULT NULL,
  `aliquotId` varchar(80) NOT NULL,
  `well` varchar(50) DEFAULT NULL,
  `plateStatus` int(11) DEFAULT NULL,
  `plateEventId` bigint(20) unsigned DEFAULT NULL,
  `eventId` bigint(20) unsigned NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `idxtoxTecanPlateMapAliquotId` (`aliquotId`) USING BTREE,
  KEY `idxtoxTecanPlateMapPlateId` (`plateId`,`well`) USING BTREE,
  KEY `idxtoxTecanPlateMapPlateEventId` (`plateEventId`) USING BTREE,
  KEY `idxtoxTecanPlateMapEventId` (`eventId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for toxValidities
-- ----------------------------
CREATE TABLE `toxValidities` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `aliquotId` varchar(80) NOT NULL,
  `validityName` varchar(100) DEFAULT NULL,
  `results` varchar(100) DEFAULT NULL,
  `quantification` varchar(100) DEFAULT NULL,
  `normalRange` varchar(100) DEFAULT NULL,
  `comments` text,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `idtoxValiditiesAliquotId` (`aliquotId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for transferMapMMAssignments
-- ----------------------------
CREATE TABLE `transferMapMMAssignments` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `transferMapStepId` int(11) unsigned NOT NULL,
  `destinationAttribute` varchar(100) DEFAULT NULL,
  `mmId` int(11) unsigned NOT NULL,
  `eventId` bigint(20) unsigned NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `idxtransferMapMMAssignmentsTransferMapStepID` (`transferMapStepId`) USING BTREE,
  KEY `idxtransferMapMMAssignmentsMmId` (`mmId`) USING BTREE,
  KEY `idx transferMapMMAssignmentsEventId` (`eventId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for transferMapPanelAssignments
-- ----------------------------
CREATE TABLE `transferMapPanelAssignments` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `transferMapStepID` int(11) unsigned NOT NULL,
  `destinationAttribute` varchar(100) DEFAULT NULL,
  `panelCode` varchar(80) NOT NULL,
  `eventId` bigint(20) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `idxtransferMapPanelAssignmentsTransferMapStepID` (`transferMapStepID`) USING BTREE,
  KEY `idxtransferMapPanelAssignmentsPanelCode` (`panelCode`) USING BTREE,
  KEY `idxtransferMapPanelAssignmentsEventId` (`eventId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for transferMapProperties
-- ----------------------------
CREATE TABLE `transferMapProperties` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `sourceType` varchar(100) DEFAULT NULL,
  `sourceRows` int(11) DEFAULT NULL,
  `sourceColumns` int(11) DEFAULT NULL,
  `destinationType` varchar(100) DEFAULT '',
  `destinationRows` int(11) DEFAULT NULL,
  `destinationColumns` int(11) DEFAULT NULL,
  `eventid` bigint(20) unsigned NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `idxtransferMapPropertiesEventId` (`eventid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for transferMapStepAssignments
-- ----------------------------
CREATE TABLE `transferMapStepAssignments` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `transferMapId` int(11) unsigned NOT NULL,
  `step` varchar(100) NOT NULL DEFAULT '',
  `displayOrder` int(11) unsigned NOT NULL,
  `eventid` bigint(20) unsigned NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `idxtransferMapsAssignmentsTransferMapId` (`transferMapId`) USING BTREE,
  KEY `idxtransferMapsAssignmentsEventId` (`eventid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for transferMapTransferHistory
-- ----------------------------
CREATE TABLE `transferMapTransferHistory` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `source` varchar(80) NOT NULL,
  `destination` varchar(80) NOT NULL,
  `status` varchar(255) NOT NULL,
  `eventID` bigint(20) unsigned NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `idxtransferMapTransferHistorySource` (`source`,`destination`) USING BTREE,
  KEY `idxtransferMapTransferHistoryEventId` (`eventID`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- ----------------------------
-- Table structure for translation
-- ----------------------------
CREATE TABLE `translation` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `fromLexicon` varchar(255) NOT NULL,
  `fromLabel` varchar(255) NOT NULL,
  `toLexicon` varchar(255) DEFAULT NULL,
  `toLabel` varchar(255) DEFAULT NULL,
  `eventId` bigint(20) unsigned NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `idxtranslationFromLexicon` (`fromLexicon`,`fromLabel`) USING BTREE,
  KEY `idxtranslationEventId` (`eventId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for trayMapStepAssignments
-- ----------------------------
CREATE TABLE `trayMapStepAssignments` (
  `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  `trayMapId` int(11) UNSIGNED NOT NULL,
  `step` varchar(100) NOT NULL DEFAULT '',
  `eventId` bigint(20) UNSIGNED NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idxtrayMapStepAssignmentsTrayMapId` (`trayMapId`),
  KEY `idxtrayMapStepAssignmentsTrayEventId` (`eventId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for trayMapMMAssignments
-- ----------------------------
CREATE TABLE `trayMapMMAssignments` (
  `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  `trayMapStepId` int(11)  UNSIGNED NOT NULL,
  `well` varchar(50) DEFAULT NULL,
  `mmId` int(11) UNSIGNED NOT NULL,
  `eventID` bigint(20) UNSIGNED DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idxtrayMapMMAssignmentsMmId` (`mmId`),
  KEY `idxtrayMapMMAssignmentsTrayMapStepID` (`trayMapStepID`),
  KEY `idxtrayMapMMAssignmentsTrayMapEventId` (`eventId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for trayMapProperties
-- ----------------------------
CREATE TABLE `trayMapProperties` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `trayMapName` varchar(100) NOT NULL,
  `trayType` varchar(80) DEFAULT NULL,
  `trayRows` int(2) DEFAULT NULL,
  `trayColumns` int(2) DEFAULT NULL,
  `eventId` bigint(20) unsigned NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `idxtrayMapPropertiesTrayMapName` (`trayMapName`) USING BTREE,
  KEY `idxtrayMapPropertiesEventId` (`eventId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for trayMaps
-- ----------------------------
CREATE TABLE `trayMaps` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `trayMapId` int(11) unsigned NOT NULL,
  `well` varchar(50) DEFAULT NULL,
  `wellOrder` int(11) DEFAULT NULL,
  `containerType` varchar(80) DEFAULT NULL,
  `eventId` bigint(20) unsigned NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idxtrayMapsTrayMapId` USING BTREE (`trayMapId` ASC),
  KEY `idxtrayMapsEventId` (`eventId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- ----------------------------
-- Table structure for validValuesHistory
-- ----------------------------
CREATE TABLE `validValuesHistory` (
  `id` int(11) unsigned NOT NULL,
  `setName` varchar(100) NOT NULL,
  `displayValue` varchar(255) NOT NULL,
  `value` varchar(255) NOT NULL,
  `displayOrder` int(11) unsigned NOT NULL,
  `eventId` bigint(20) unsigned NOT NULL,
  `systemManaged` bit(1) DEFAULT b'0',
  `historyStartDate` datetime DEFAULT NULL,
  `historyEndDate` datetime DEFAULT NULL,
  `historyAction` varchar(20) DEFAULT NULL,
  `historyUser` varchar(85) DEFAULT NULL,
  `historyId` int(11) unsigned NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`historyId`) USING BTREE,
  KEY `idxvalidValuesSetName` (`setName`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for validValuesLinks
-- ----------------------------
CREATE TABLE `validValuesLinks` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `formConfigurablePartsId` int(11) unsigned NOT NULL,
  `setName` varchar(100) NOT NULL,
  `eventId` bigint(20) unsigned NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `idxvalidValuesLinksFormConfigurablePartsId` (`formConfigurablePartsId`,`setName`) USING BTREE,
  KEY `idxvalidValuesLinksEventId` (`eventId`) USING BTREE,
  KEY `idxvalidValuesLinksSetName` (`setName`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for vendors
-- ----------------------------
CREATE TABLE `vendors` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `vendorId` varchar(80) NOT NULL,
  `vendor` varchar(80) NOT NULL,
  `accountNumber` varchar(100) DEFAULT NULL,
  `eventId` bigint(20) unsigned NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `idxvendorsVendorId` (`vendorId`) USING BTREE,
  KEY `idxvendorsVendor` (`vendor`) USING BTREE,
  KEY `idxvendorsEventId` (`eventId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for wellDesignations
-- ----------------------------
CREATE TABLE `wellDesignations` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `step` varchar(100) NOT NULL,
  `well` varchar(50) NOT NULL,
  `descriptor1` varchar(255) DEFAULT NULL,
  `descriptor2` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `idxwellDesignationsStep` (`step`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Add foreign keys
-- ----------------------------
ALTER TABLE `adapterSequences` ADD CONSTRAINT `fkadapterSequencesEventId` FOREIGN KEY (`eventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `analyteLinks` ADD CONSTRAINT `fkanalyteLinksAnalyteId` FOREIGN KEY (`analyteId`) REFERENCES `analytes` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `analyteLinks` ADD CONSTRAINT `fkanalyteLinksEventId` FOREIGN KEY (`eventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `analytes` ADD CONSTRAINT `fkanalytesEventId` FOREIGN KEY (`eventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `batchProcessingMMAssignment` ADD CONSTRAINT `fkbatchProcessingMMAssignmentEventId` FOREIGN KEY (`eventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `batchProcessingMMAssignment` ADD CONSTRAINT `fkbatchProcessingMMAssignmentMmId` FOREIGN KEY (`mmId`) REFERENCES `masterMixes` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `capChecklist` ADD CONSTRAINT `fkcapChecklistEventId` FOREIGN KEY (`eventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `client` ADD CONSTRAINT `fkclientEventId` FOREIGN KEY (`eventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `clientAddress` ADD CONSTRAINT `idxclientAddressClientId` FOREIGN KEY (`clientId`) REFERENCES `client` (`clientId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `clientAddress` ADD CONSTRAINT `idxclientAddressEventId` FOREIGN KEY (`eventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `clinicalInformation` ADD CONSTRAINT `fkclinicalInformationEventId` FOREIGN KEY (`eventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `clinicalInformation` ADD CONSTRAINT `fkclinicalInformationRequestId` FOREIGN KEY (`requestId`) REFERENCES `requestForms` (`requestId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `clinicalInformationDrugs` ADD CONSTRAINT `fkclinicalInformationDrugsDrugId` FOREIGN KEY (`drugId`) REFERENCES `drugs` (`drugId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `clinicalInformationDrugs` ADD CONSTRAINT `fkclinicalInformationDrugsEventId` FOREIGN KEY (`eventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `clinicalInformationDrugs` ADD CONSTRAINT `fkclinicalInformationDrugsRequestId` FOREIGN KEY (`requestId`) REFERENCES `requestForms` (`requestId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `cmaGeneResults` ADD CONSTRAINT `fkcmaGeneResultsEventId` FOREIGN KEY (`eventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `cmaGeneResults` ADD CONSTRAINT `fkcmaGeneResultsRefEventId` FOREIGN KEY (`refEventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `cmaGeneResults` ADD CONSTRAINT `fkcmaGeneResultsSampleId` FOREIGN KEY (`sampleId`, `rawResultId`) REFERENCES `cmaRawResults` (`sampleId`, `id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `cmaRawResults` ADD CONSTRAINT `fkcmaRawResultsEventId` FOREIGN KEY (`eventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `cmaRawResultsHistory` ADD CONSTRAINT `fkcmaRawResultsHistoryId` FOREIGN KEY (`id`) REFERENCES `cmaRawResults` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `cmaResults` ADD CONSTRAINT `fkcmaResultsEventId` FOREIGN KEY (`eventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `cmaResults` ADD CONSTRAINT `fkcmaResultsRawResultId` FOREIGN KEY (`rawResultId`) REFERENCES `cmaRawResults` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `cmaResultsHistory` ADD CONSTRAINT `fkcmaResultsHistoryId` FOREIGN KEY (`id`) REFERENCES `cmaResults` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `consumables` ADD CONSTRAINT `fkconsumablesEventId` FOREIGN KEY (`eventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `consumables` ADD CONSTRAINT `fkconsumablesStorageId` FOREIGN KEY (`storageId`) REFERENCES `storageContainerInfo` (`storageContainerId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `controlLimits` ADD CONSTRAINT `fkcontrolLimitsEventId` FOREIGN KEY (`eventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `controlLimits` ADD CONSTRAINT `fkcontrolLimitsPanelId` FOREIGN KEY (`panelId`) REFERENCES `testPanels` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `controlResults` ADD CONSTRAINT `fkcontrolResultsControlId` FOREIGN KEY (`controlId`) REFERENCES `controls` (`controlId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `controlResults` ADD CONSTRAINT `fkcontrolResultsEventId` FOREIGN KEY (`eventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `controlResults` ADD CONSTRAINT `fkcontrolResultsInstrumentId` FOREIGN KEY (`instrumentId`) REFERENCES `instruments` (`instrumentId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `controlResults` ADD CONSTRAINT `fkcontrolResultsPanelId` FOREIGN KEY (`batchId`) REFERENCES `batches` (`batchId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `controls` ADD CONSTRAINT `fkcontrolsEventId` FOREIGN KEY (`eventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `controls` ADD CONSTRAINT `fkcontrolsLastUpdateEventId` FOREIGN KEY (`lastUpdateEventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `controlsExpectedSNP` ADD CONSTRAINT `fkccontrolsExpectedSNPEventId` FOREIGN KEY (`eventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `customerCommunications` ADD CONSTRAINT `fkcustomerCommunicationsEmployeeId` FOREIGN KEY (`employeeId`) REFERENCES `userInfo` (`userId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `customerCommunications` ADD CONSTRAINT `fkcustomerCommunicationsEventId` FOREIGN KEY (`eventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `customerCommunications` ADD CONSTRAINT `fkcustomerCommunicationsReqId` FOREIGN KEY (`reqId`) REFERENCES `requestForms` (`requestId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `delDupReviewResults` ADD CONSTRAINT `fkdelDupReviewResultsEventId` FOREIGN KEY (`eventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `delDupReviewResults` ADD CONSTRAINT `fkdelDupReviewResultsSampleId` FOREIGN KEY (`sampleId`) REFERENCES `requestSpecimens` (`specimenId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `deleteStorageTemp` ADD CONSTRAINT `fkdeleteStorageTempEventId` FOREIGN KEY (`eventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `diagnosticCodes` ADD CONSTRAINT `fkdiagnosticCodesEventId` FOREIGN KEY (`eventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `documentAssignments` ADD CONSTRAINT `fkdocumentAssignmentsEventId` FOREIGN KEY (`eventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `documentRecords` ADD CONSTRAINT `fkdocumentRecordsEventId` FOREIGN KEY (`eventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `documentRecords` ADD CONSTRAINT `fkdocumentRecordsLastUpdateEventId` FOREIGN KEY (`lastUpdateEventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `documentUserAssignments` ADD CONSTRAINT `fkdocumentUserAssignmentsDeactivateEventId` FOREIGN KEY (`deactivateEventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `documentUserAssignments` ADD CONSTRAINT `fkdocumentUserAssignmentsEventId` FOREIGN KEY (`eventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `documentUserAssignments` ADD CONSTRAINT `fkdocumentUserAssignmentsLastActivityEventId` FOREIGN KEY (`lastActivityEventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `documentVersionAssignments` ADD CONSTRAINT `fkdocumentVersionAssignmentsEventId` FOREIGN KEY (`eventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `documentVersionAssignments` ADD CONSTRAINT `fkdocumentVersionAssignmentsLastUpdateEventId` FOREIGN KEY (`lastUpdateEventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `documentVersions` ADD CONSTRAINT `fkdocumentVersionsEventId` FOREIGN KEY (`eventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `documentVersions` ADD CONSTRAINT `fkdocumentVersionsGroupManagerApprovalEventId` FOREIGN KEY (`groupManagerApprovalEventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `documentVersions` ADD CONSTRAINT `fkdocumentVersionsLastUpdateEventId` FOREIGN KEY (`lastUpdateEventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `documents` ADD CONSTRAINT `fkdocumentsEventId` FOREIGN KEY (`eventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `drugs` ADD CONSTRAINT `fkdrugsEventId` FOREIGN KEY (`eventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `fishAnalysis` ADD CONSTRAINT `fkfishAnalysisEventId` FOREIGN KEY (`eventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `fishAnalysis` ADD CONSTRAINT `fkfishAnalysisTechAnalyst` FOREIGN KEY (`techAnalyst`) REFERENCES `userInfo` (`userId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `fishReportData` ADD CONSTRAINT `fkfishReportDataEventId` FOREIGN KEY (`eventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `fishReportData` ADD CONSTRAINT `fkfishReportDataTechAnalyst` FOREIGN KEY (`techAnalyst`) REFERENCES `userInfo` (`userId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `fishSlides` ADD CONSTRAINT `fkfishSlidesAliquotId` FOREIGN KEY (`aliquotId`) REFERENCES `containers` (`containerId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `fishSlides` ADD CONSTRAINT `fkfishSlidesBatchId` FOREIGN KEY (`batchId`) REFERENCES `containers` (`containerId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `fishSlides` ADD CONSTRAINT `fkfishSlidesEventId` FOREIGN KEY (`eventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `fishSlides` ADD CONSTRAINT `fkfishSlidesHybridizationFinishEventId` FOREIGN KEY (`hybridizationFinishEventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `fishSlides` ADD CONSTRAINT `fkfishSlidesHybridizationStartEventId` FOREIGN KEY (`hybridizationStartEventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `fishSlides` ADD CONSTRAINT `fkfishSlidesReviewSlideEventId` FOREIGN KEY (`reviewSlideEventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `fishSlides` ADD CONSTRAINT `fkfishSlidesSlideId` FOREIGN KEY (`slideId`) REFERENCES `containers` (`containerId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `fishSlides` ADD CONSTRAINT `fkfishSlidesWashMountEventId` FOREIGN KEY (`washMountEventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `flowData` ADD CONSTRAINT `fkflowDataEventId` FOREIGN KEY (`eventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `flowResults` ADD CONSTRAINT `fkfflowResultsEventId` FOREIGN KEY (`eventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `flowResults` ADD CONSTRAINT `fkfflowResultsReqId` FOREIGN KEY (`reqId`) REFERENCES `requestForms` (`requestId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `formConfigurableParts` ADD CONSTRAINT `fkformConfigurablePartsEventId` FOREIGN KEY (`eventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `formDefinition` ADD CONSTRAINT `fkformDefinitionEventId` FOREIGN KEY (`eventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `formInputSettings` ADD CONSTRAINT `fkformInputSettingsEventId` FOREIGN KEY (`eventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `formInputSettings` ADD CONSTRAINT `fkformInputSettingsFormConfigurablePartsId` FOREIGN KEY (`formConfigurablePartsId`) REFERENCES `formConfigurableParts` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `formInputSettings` ADD CONSTRAINT `fkformInputSettingsFormDefinitionId` FOREIGN KEY (`formDefinitionId`) REFERENCES `formDefinition` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `formSettingsJSON` ADD CONSTRAINT `fkformSettingsJSONEventId` FOREIGN KEY (`eventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `formSettingsJSON` ADD CONSTRAINT `fkformSettingsJSONformDefinitionId` FOREIGN KEY (`formDefinitionId`) REFERENCES `formDefinition` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `fsComponentInTask` ADD CONSTRAINT `fk fsComponentInTaskEventId` FOREIGN KEY (`eventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `fsComponentInTask` ADD CONSTRAINT `fsComponentInTaskComponentId` FOREIGN KEY (`componentId`) REFERENCES `fsComponents` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `fsComponentInTask` ADD CONSTRAINT `fsComponentInTaskTaskId` FOREIGN KEY (`taskId`) REFERENCES `fsTasks` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `fsComponents` ADD CONSTRAINT `fkfsComponentsEventId` FOREIGN KEY (`eventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `fsProtocols` ADD CONSTRAINT `fk fsProtocolsLoadEventId` FOREIGN KEY (`loadEventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `fsProtocols` ADD CONSTRAINT `fkfsProtocolsEventId` FOREIGN KEY (`eventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `fsRoutines` ADD CONSTRAINT `fkfsRoutinesEventId` FOREIGN KEY (`eventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `fsRoutines` ADD CONSTRAINT `fkfsRoutinesProtocolId` FOREIGN KEY (`protocolId`) REFERENCES `fsProtocols` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `fsRoutines` ADD CONSTRAINT `fkfsRoutinesTaskId` FOREIGN KEY (`taskId`) REFERENCES `fsTasks` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `fsTasks` ADD CONSTRAINT `fkfsTasksEventId` FOREIGN KEY (`eventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `fsTasks` ADD CONSTRAINT `fkfsTasksProtocolId` FOREIGN KEY (`protocolId`) REFERENCES `fsProtocols` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `genelist` ADD CONSTRAINT `fkgenelistEventId` FOREIGN KEY (`eventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `genelist` ADD CONSTRAINT `fkgenelistSampleId` FOREIGN KEY (`sampleId`) REFERENCES `requestSpecimens` (`specimenId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `groups` ADD CONSTRAINT `fkgroupsEventId` FOREIGN KEY (`eventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `hl7Communication` ADD CONSTRAINT `fkhl7CommunicationEventId` FOREIGN KEY (`eventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `hl7Communication` ADD CONSTRAINT `fkhl7CommunicationImportEventId` FOREIGN KEY (`importEventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `immunologyGelResults` ADD CONSTRAINT `fkimmunologyGelResultsEventId` FOREIGN KEY (`eventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `immunologyGelResults` ADD CONSTRAINT `fkimmunologyGelResultsRequestId` FOREIGN KEY (`requestId`) REFERENCES `requestForms` (`requestId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `instrumentContacts` ADD CONSTRAINT `fkinstrumentContactsEventId` FOREIGN KEY (`eventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `instrumentResults` ADD CONSTRAINT `fkinstrumentResultsEventId` FOREIGN KEY (`eventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `instrumentResults` ADD CONSTRAINT `fkinstrumentResultsInstrumentId` FOREIGN KEY (`instrumentId`) REFERENCES `instruments` (`instrumentId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `instrumentService` ADD CONSTRAINT `fkinstrumentServiceContactId` FOREIGN KEY (`contactId`) REFERENCES `instrumentContacts` (`contactId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `instrumentService` ADD CONSTRAINT `fkinstrumentServiceEventId` FOREIGN KEY (`eventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `instrumentService` ADD CONSTRAINT `fkinstrumentServiceInstrumentId` FOREIGN KEY (`instrumentId`) REFERENCES `instruments` (`instrumentId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `instruments` ADD CONSTRAINT `fkinstrumentsEventId` FOREIGN KEY (`eventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `insuranceCarriers` ADD CONSTRAINT `fkinsuranceCarriersEventId` FOREIGN KEY (`eventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `inventoryItems` ADD CONSTRAINT `fkinvcentoryItemsVendor` FOREIGN KEY (`vendor`) REFERENCES `vendors` (`vendorId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `inventoryItems` ADD CONSTRAINT `fkinventoryEventId` FOREIGN KEY (`eventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `inventoryMMUsage` ADD CONSTRAINT `fkinventoryMMUsageEventId` FOREIGN KEY (`eventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `inventoryMMUsage` ADD CONSTRAINT `fkinventoryMMUsageinventoryItem` FOREIGN KEY (`inventoryItem`) REFERENCES `inventoryItems` (`inventoryItem`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `inventoryOrders` ADD CONSTRAINT `fkinventoryOrdersEventId` FOREIGN KEY (`eventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `inventoryOrders` ADD CONSTRAINT `fkinventoryOrdersItemId` FOREIGN KEY (`itemId`) REFERENCES `inventoryItems` (`inventoryItem`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `inventoryOrders` ADD CONSTRAINT `fkinventoryOrdersLastUpdateEventId` FOREIGN KEY (`lastUpdateEventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `inventoryOrders` ADD CONSTRAINT `fkinventoryOrdersReceivedEventId` FOREIGN KEY (`receivedEventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `inventoryOrders` ADD CONSTRAINT `fkinventoryOrdersVendorId` FOREIGN KEY (`vendorId`) REFERENCES `vendors` (`vendorId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `inventoryUsage` ADD CONSTRAINT `fkinventoryUsageEventId` FOREIGN KEY (`eventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `inventoryUsage` ADD CONSTRAINT `fkinventoryUsageItemId` FOREIGN KEY (`inventoryItem`) REFERENCES `inventoryItems` (`inventoryItem`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `inventoryVendors` ADD CONSTRAINT `fkinventoryVendorsEventId` FOREIGN KEY (`eventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `inventoryVendors` ADD CONSTRAINT `fkinventoryVendorsItemId` FOREIGN KEY (`itemId`) REFERENCES `inventoryItems` (`inventoryItem`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `inventoryVendors` ADD CONSTRAINT `fkinventoryVendorsReceivedEventId` FOREIGN KEY (`receivedEventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `inventoryVendors` ADD CONSTRAINT `fkinventoryVendorsVendorId` FOREIGN KEY (`vendorId`) REFERENCES `vendors` (`vendorId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `karyoSlides` ADD CONSTRAINT `fkkaryoSlidessEventId` FOREIGN KEY (`eventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `karyoSlides` ADD CONSTRAINT `fkkaryoSlidessReviewRequestId` FOREIGN KEY (`requestId`) REFERENCES `requestForms` (`requestId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `karyoSlides` ADD CONSTRAINT `fkkaryoSlidessReviewSlideEventId` FOREIGN KEY (`reviewSlideEventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `karyotypeAnalysis` ADD CONSTRAINT `fkkaryotypeAnalysisEventId` FOREIGN KEY (`eventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `karyotypeAnalysis` ADD CONSTRAINT `fkkaryotypeAnalysisReqId` FOREIGN KEY (`reqId`) REFERENCES `requestForms` (`requestId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `karyotypeAnalysis` ADD CONSTRAINT `fkkaryotypeAnalysisSlideId` FOREIGN KEY (`slideId`) REFERENCES `karyoSlides` (`slideId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `karyotypeCaseResults` ADD CONSTRAINT `fk karyotypeCaseResultsEventId` FOREIGN KEY (`eventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `karyotypeCaseResults` ADD CONSTRAINT `fkkaryotypeCaseResultsRequestId` FOREIGN KEY (`requestId`) REFERENCES `requestForms` (`requestId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `karyotypeSlideResults` ADD CONSTRAINT `fkkaryotypeSlideResultsEventId` FOREIGN KEY (`eventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `karyotypeSlideResults` ADD CONSTRAINT `fkkaryotypeSlideResultsRequestId` FOREIGN KEY (`requestId`) REFERENCES `requestForms` (`requestId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `karyotypeSlideResults` ADD CONSTRAINT `fkkaryotypeSlideResultsSlideId` FOREIGN KEY (`slideId`) REFERENCES `karyoSlides` (`slideId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `masterMixComponents` ADD CONSTRAINT `fkmmComponentsEventId` FOREIGN KEY (`eventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `masterMixComponents` ADD CONSTRAINT `fkmmComponentsMmId` FOREIGN KEY (`mmId`) REFERENCES `masterMixes` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `masterMixInstructions` ADD CONSTRAINT `fkmasterMixInstructionsEventId` FOREIGN KEY (`eventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `masterMixInstructions` ADD CONSTRAINT `fkmasterMixInstructionsMmId` FOREIGN KEY (`mmId`) REFERENCES `masterMixes` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `masterMixKeywords` ADD CONSTRAINT `fkmasterMixKeywordsEventId` FOREIGN KEY (`eventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `masterMixKeywords` ADD CONSTRAINT `fkmasterMixKeywordsMmId` FOREIGN KEY (`mmId`) REFERENCES `masterMixes` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `masterMixes` ADD CONSTRAINT `fkmasterMixesEventId` FOREIGN KEY (`eventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `methods` ADD CONSTRAINT `fkmethodsEventId` FOREIGN KEY (`eventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `mmcodesForPanel` ADD CONSTRAINT `fkmmcodesForPanelEventId` FOREIGN KEY (`eventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `mmcodesForPanel` ADD CONSTRAINT `fkmmcodesForPanelMmCode` FOREIGN KEY (`mmCode`) REFERENCES `masterMixes` (`code`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `normalizationTargets` ADD CONSTRAINT `fknormalizationTargetsEventId` FOREIGN KEY (`eventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `normalizeResults` ADD CONSTRAINT `fknormalizeResultsEventId` FOREIGN KEY (`eventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `normalizeResults` ADD CONSTRAINT `fknormalizeResultsQuantId` FOREIGN KEY (`quantId`) REFERENCES `quantResults` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `orderLog` ADD CONSTRAINT `fknorderLogEventId` FOREIGN KEY (`eventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `orderLog` ADD CONSTRAINT `fknorderLogInventoryItem` FOREIGN KEY (`inventoryItem`) REFERENCES `inventoryItems` (`inventoryItem`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `orderLog` ADD CONSTRAINT `fknorderLogLastUpdateEventId` FOREIGN KEY (`lastUpdateEventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `orderLog` ADD CONSTRAINT `fknorderLogVendor` FOREIGN KEY (`vendor`) REFERENCES `vendors` (`vendor`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `organizationSites` ADD CONSTRAINT `fkorganizationSitesEventId` FOREIGN KEY (`eventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `organizationSites` ADD CONSTRAINT `fkorganizationSitesOrgId` FOREIGN KEY (`orgId`) REFERENCES `organizations` (`orgId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `organizations` ADD CONSTRAINT `fkorganizationsEventId` FOREIGN KEY (`eventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `panels` ADD CONSTRAINT `fkpanelsEventId` FOREIGN KEY (`eventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `panelsForEntities` ADD CONSTRAINT `fkpanelsForEntitiesEventId` FOREIGN KEY (`eventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `panelsForEntities` ADD CONSTRAINT `fkpanelsForEntitiesOrgId` FOREIGN KEY (`orgId`) REFERENCES `organizations` (`orgId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `patientBilling` ADD CONSTRAINT `fkpatientBillingCarrierId1` FOREIGN KEY (`carrierId1`) REFERENCES `insuranceCarriers` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `patientBilling` ADD CONSTRAINT `fkpatientBillingCarrierId2` FOREIGN KEY (`carrierId2`) REFERENCES `insuranceCarriers` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `patientBilling` ADD CONSTRAINT `fkpatientBillingEventId` FOREIGN KEY (`eventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `patientBilling` ADD CONSTRAINT `fkpatientBillingPatientId` FOREIGN KEY (`patientId`) REFERENCES `patients` (`patientId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `patientBilling` ADD CONSTRAINT `fkpatientBillingRequestId` FOREIGN KEY (`requestId`) REFERENCES `requestForms` (`requestId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `patientBillingDefault` ADD CONSTRAINT `fkpatientBillingDefaultCarrierId1` FOREIGN KEY (`carrierId1`) REFERENCES `insuranceCarriers` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `patientBillingDefault` ADD CONSTRAINT `fkpatientBillingDefaultCarrierId2` FOREIGN KEY (`carrierId2`) REFERENCES `insuranceCarriers` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `patientBillingDefault` ADD CONSTRAINT `fkpatientBillingDefaultEventId` FOREIGN KEY (`eventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `patientBillingDefault` ADD CONSTRAINT `fkpatientBillingDefaultPatientId` FOREIGN KEY (`patientId`) REFERENCES `patients` (`patientId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `patientClinical` ADD CONSTRAINT `fkpatientClinicalEvents` FOREIGN KEY (`eventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `patientClinical` ADD CONSTRAINT `fkpatientClinicalPatientId` FOREIGN KEY (`patientId`) REFERENCES `patients` (`patientId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `patientEthnicities` ADD CONSTRAINT `fkpatientEthnicitiesEventId` FOREIGN KEY (`eventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `patientEthnicities` ADD CONSTRAINT `fkpatientEthnicitiesPatientId` FOREIGN KEY (`patientId`) REFERENCES `patients` (`patientId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `patientSources` ADD CONSTRAINT `fkpatientSourcesEventId` FOREIGN KEY (`eventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `patientSources` ADD CONSTRAINT `fkpatientSourcesSiteId` FOREIGN KEY (`siteId`) REFERENCES `organizationSites` (`siteId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `patients` ADD CONSTRAINT `fkpatientsEventId` FOREIGN KEY (`eventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `pcrRawResults` ADD CONSTRAINT `fkpcrRawResultsEventId` FOREIGN KEY (`eventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `pcrRawResults` ADD CONSTRAINT `fkpcrRawResultsTrayId` FOREIGN KEY (`trayId`) REFERENCES `containers` (`containerId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `pcrResults` ADD CONSTRAINT `fkpcrResultsEventId` FOREIGN KEY (`eventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `pcrResults` ADD CONSTRAINT `fkpcrResultsReportId` FOREIGN KEY (`reportId`) REFERENCES `reportDetails` (`reportId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `pcrResults` ADD CONSTRAINT `fkpcrResultsSampleId` FOREIGN KEY (`sampleId`) REFERENCES `requestSpecimens` (`specimenId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `physicianSites` ADD CONSTRAINT `fkphysicianSitesEventId` FOREIGN KEY (`eventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `physicianSites` ADD CONSTRAINT `fkphysicianSitesPhysicianId` FOREIGN KEY (`physicianId`) REFERENCES `physicians` (`physicianId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `physicianSites` ADD CONSTRAINT `fkphysicianSitesSiteId` FOREIGN KEY (`siteId`) REFERENCES `organizationSites` (`siteId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `physicians` ADD CONSTRAINT `fkphysiciansEventId` FOREIGN KEY (`eventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `primerAssayLinks` ADD CONSTRAINT `fkprimerAssayLinksAssayId` FOREIGN KEY (`assayId`) REFERENCES `testPanels` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `primerAssayLinks` ADD CONSTRAINT `fkprimerAssayLinksEventId` FOREIGN KEY (`eventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `primerAssayLinks` ADD CONSTRAINT `fkprimerAssayLinksPrimerId` FOREIGN KEY (`primerId`) REFERENCES `primers` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `primerOrdering` ADD CONSTRAINT `fkprimerOrderingEventId` FOREIGN KEY (`eventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `primerOrdering` ADD CONSTRAINT `fkprimerOrderingPrimerId` FOREIGN KEY (`primerId`) REFERENCES `primers` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `primers` ADD CONSTRAINT `fkprimersEventId` FOREIGN KEY (`eventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `primers` ADD CONSTRAINT `fkprimersUpdateEventId` FOREIGN KEY (`updateEventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `proband` ADD CONSTRAINT `fkprobandEventId` FOREIGN KEY (`eventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `proband` ADD CONSTRAINT `fkprobandPatientId` FOREIGN KEY (`patientId`) REFERENCES `patients` (`patientId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `proband` ADD CONSTRAINT `fkprobandTestCode` FOREIGN KEY (`testCode`) REFERENCES `tests` (`testCode`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `probandLinks` ADD CONSTRAINT `fkprobandLinksEventId` FOREIGN KEY (`eventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `probandLinks` ADD CONSTRAINT `fkprobandLinksPatientId` FOREIGN KEY (`patientId`) REFERENCES `patients` (`patientId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `probandLinks` ADD CONSTRAINT `fkprobandLinksProbandId` FOREIGN KEY (`probandId`) REFERENCES `proband` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `probesForTests` ADD CONSTRAINT `fkprobesForTestsEventId` FOREIGN KEY (`eventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `qcMetrics` ADD CONSTRAINT `fkqcMetricsEventId` FOREIGN KEY (`eventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `qcMetrics` ADD CONSTRAINT `fkqcMetricsSampleId` FOREIGN KEY (`sampleId`) REFERENCES `requestSpecimens` (`specimenId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `quantRawPoolingResults` ADD CONSTRAINT `fkquantRawPoolingResultsEventId` FOREIGN KEY (`eventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `quantRawPoolingResults` ADD CONSTRAINT `fkquantRawPoolingResultsPlateId` FOREIGN KEY (`plateId`) REFERENCES `containers` (`containerId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `quantRawResults` ADD CONSTRAINT `fkqquantRawResultsEventId` FOREIGN KEY (`eventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `quantResults` ADD CONSTRAINT `fkquantResultsDataEventId` FOREIGN KEY (`dataEventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `quantResults` ADD CONSTRAINT `fkquantResultsResultEventId` FOREIGN KEY (`resultEventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `quantResults` ADD CONSTRAINT `fkquantResultsRunId` FOREIGN KEY (`runId`) REFERENCES `specimenRuns` (`runId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `quantThreshold` ADD CONSTRAINT `fkquantThresholdEventId` FOREIGN KEY (`eventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `quantThreshold` ADD CONSTRAINT `fkquantThresholdPanelCode` FOREIGN KEY (`panelCode`) REFERENCES `panels` (`panelCode`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `queuePaths` ADD CONSTRAINT `fkqueuePathsEventId` FOREIGN KEY (`eventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `queuePaths` ADD CONSTRAINT `fkqueuePathsPanelCode` FOREIGN KEY (`panelCode`) REFERENCES `panels` (`panelCode`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `rapidExamResults` ADD CONSTRAINT `fkrapidExamResultsDrugId` FOREIGN KEY (`drugId`) REFERENCES `drugs` (`drugId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `rapidExamResults` ADD CONSTRAINT `fkrapidExamResultsEventId` FOREIGN KEY (`eventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `rapidExamResults` ADD CONSTRAINT `fkrapidExamResultsReqId` FOREIGN KEY (`reqId`) REFERENCES `requestForms` (`requestId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `reagentRecipes` ADD CONSTRAINT `fkreagentRecipesEventId` FOREIGN KEY (`eventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `reagents` ADD CONSTRAINT `fkrreagentsEventId` FOREIGN KEY (`eventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `reagents` ADD CONSTRAINT `fkrreagentsReagentId` FOREIGN KEY (`reagentId`) REFERENCES `containers` (`containerId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `reagents` ADD CONSTRAINT `fkrreagentsSiteId` FOREIGN KEY (`siteId`) REFERENCES `organizationSites` (`siteId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `reagents` ADD CONSTRAINT `fkrreagentsStorageId` FOREIGN KEY (`storageId`) REFERENCES `storageContainerInfo` (`storageContainerId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `recommendations` ADD CONSTRAINT `fkrecommendationsEventId` FOREIGN KEY (`eventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `referenceDocuments` ADD CONSTRAINT `fkreferenceDocumentsEventId` FOREIGN KEY (`eventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `reportDetails` ADD CONSTRAINT `fkreportDetailsAaddendumEventId` FOREIGN KEY (`addendumEventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `reportDetails` ADD CONSTRAINT `fkreportDetailsAmendedEventId` FOREIGN KEY (`amendedEventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `reportDetails` ADD CONSTRAINT `fkreportDetailsCancelledEventid` FOREIGN KEY (`cancelledEventid`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `reportDetails` ADD CONSTRAINT `fkreportDetailsCorrectedEventId` FOREIGN KEY (`correctedEventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `reportDetails` ADD CONSTRAINT `fkreportDetailsEventId` FOREIGN KEY (`eventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `reportDetails` ADD CONSTRAINT `fkreportDetailsInitialReleaseEventId` FOREIGN KEY (`initialReleaseEventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `reportDetails` ADD CONSTRAINT `fkreportDetailsMailedEventId` FOREIGN KEY (`mailedEventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `reportDetails` ADD CONSTRAINT `fkreportDetailsPanelCode` FOREIGN KEY (`panelCode`) REFERENCES `panels` (`panelCode`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `reportDetails` ADD CONSTRAINT `fkreportDetailsQnsEventId` FOREIGN KEY (`qnsEventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `reportDetails` ADD CONSTRAINT `fkreportDetailsRejectedEventId` FOREIGN KEY (`rejectedEventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `reportDetails` ADD CONSTRAINT `fkreportDetailsReportId` FOREIGN KEY (`reportId`) REFERENCES `containers` (`containerId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `reportDetails` ADD CONSTRAINT `fkreportDetailsRequestId` FOREIGN KEY (`requestId`) REFERENCES `requestForms` (`requestId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `reportDetails` ADD CONSTRAINT `fkreportDetailsSignedEventId` FOREIGN KEY (`signedEventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `reportDetails` ADD CONSTRAINT `fkreportDetailsViewedEventId` FOREIGN KEY (`viewedEventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `reportDistribution` ADD CONSTRAINT `fkreportDistributionEventId` FOREIGN KEY (`eventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `reportDistribution` ADD CONSTRAINT `fkreportDistributionrequestId` FOREIGN KEY (`requestId`) REFERENCES `requestForms` (`requestId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `reportDistributionPreferences` ADD CONSTRAINT `fkreportDistributionPreferencesEventId` FOREIGN KEY (`eventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `reportHTML` ADD CONSTRAINT `fkreportHTMLEventId` FOREIGN KEY (`eventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `reportHTML` ADD CONSTRAINT `fkreportHTMLReportId` FOREIGN KEY (`reportId`) REFERENCES `reportDetails` (`reportId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `reportHTML` ADD CONSTRAINT `fkreportHTMLReqId` FOREIGN KEY (`reqId`) REFERENCES `requestForms` (`requestId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `reportHTMLAddendums` ADD CONSTRAINT `fkreportHTMLAddendumsEventId` FOREIGN KEY (`eventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `reportHTMLAddendums` ADD CONSTRAINT `fkreportHTMLAddendumsReportId` FOREIGN KEY (`reportId`) REFERENCES `reportDetails` (`reportId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `reportHTMLAddendums` ADD CONSTRAINT `fkreportHTMLAddendumsReqId` FOREIGN KEY (`reqId`) REFERENCES `requestForms` (`requestId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `reportMedListCYP` ADD CONSTRAINT `fkreportMedListCYPEventId` FOREIGN KEY (`eventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `reportPanelReferences` ADD CONSTRAINT `fkreportPanelReferenceId` FOREIGN KEY (`referenceId`) REFERENCES `reportReferences` (`referenceId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `reportPanelReferences` ADD CONSTRAINT `fkreportPanelReferencesEventId` FOREIGN KEY (`eventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `reportReferences` ADD CONSTRAINT `fkreportReferencesEventId` FOREIGN KEY (`eventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `reportSettings` ADD CONSTRAINT `fkreportSettingsEventId` FOREIGN KEY (`eventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `reportSettings` ADD CONSTRAINT `fkreportSettingsMedicalDirectorId` FOREIGN KEY (`medicalDirectorId`) REFERENCES `physicians` (`physicianId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `reportSignatures` ADD CONSTRAINT `fkreportSignaturesEventId` FOREIGN KEY (`eventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `reportSignatures` ADD CONSTRAINT `fkreportSignaturesMedicalDirectorId` FOREIGN KEY (`medicalDirectorId`) REFERENCES `physicians` (`physicianId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `reportStaticWording` ADD CONSTRAINT `fkreportStaticWordingEventId` FOREIGN KEY (`eventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `reportWording` ADD CONSTRAINT `fkreportWordingEventId` FOREIGN KEY (`eventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `reportWording` ADD CONSTRAINT `fkreportWordingReportId` FOREIGN KEY (`reportId`) REFERENCES `reportDetails` (`reportId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `reportWordingCYP` ADD CONSTRAINT `fkreportWordingCYPEventId` FOREIGN KEY (`eventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `reportedDemographs` ADD CONSTRAINT `fkreportedDemographsEventId` FOREIGN KEY (`eventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `reportedDemographs` ADD CONSTRAINT `fkreportedDemographsOrganizationId` FOREIGN KEY (`organizationId`) REFERENCES `organizations` (`orgId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `reportedDemographs` ADD CONSTRAINT `fkreportedDemographsPatientId` FOREIGN KEY (`patientId`) REFERENCES `patients` (`patientId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `reportedDemographs` ADD CONSTRAINT `fkreportedDemographsPhysicianId` FOREIGN KEY (`physicianId`) REFERENCES `physicians` (`physicianId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `reportedDemographs` ADD CONSTRAINT `fkreportedDemographsReportId` FOREIGN KEY (`reportId`) REFERENCES `reportDetails` (`reportId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `reportedDemographs` ADD CONSTRAINT `fkreportedDemographsSpecimenId` FOREIGN KEY (`specimenId`) REFERENCES `requestSpecimens` (`specimenId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `reqCurrentMedications` ADD CONSTRAINT `fkreqCurrentMedicationsDrugId` FOREIGN KEY (`drugId`) REFERENCES `drugs` (`drugId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `reqCurrentMedications` ADD CONSTRAINT `fkreqCurrentMedicationsEventId` FOREIGN KEY (`eventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `reqCurrentMedications` ADD CONSTRAINT `fkreqCurrentMedicationsRequestId` FOREIGN KEY (`requestId`) REFERENCES `requestForms` (`requestId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `reqHolds` ADD CONSTRAINT `fkreqHoldsEventId` FOREIGN KEY (`eventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `reqHolds` ADD CONSTRAINT `fkreqHoldsReqHoldId` FOREIGN KEY (`reqHoldId`) REFERENCES `reqHoldDescriptions` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `reqHolds` ADD CONSTRAINT `fkreqHoldsReqId` FOREIGN KEY (`eventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `reqPanels` ADD CONSTRAINT `fkreqPanelsEventId` FOREIGN KEY (`eventid`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `reqPanels` ADD CONSTRAINT `fkreqPanelsPanelCode` FOREIGN KEY (`panelCode`) REFERENCES `panels` (`panelCode`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `reqPanels` ADD CONSTRAINT `fkreqPanelsRequestId` FOREIGN KEY (`requestId`) REFERENCES `requestForms` (`requestId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `requestCodes` ADD CONSTRAINT `fkrequestCodesCode` FOREIGN KEY (`codeId`) REFERENCES `diagnosticCodes` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `requestCodes` ADD CONSTRAINT `fkrequestCodesEventId` FOREIGN KEY (`eventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `requestCodes` ADD CONSTRAINT `fkrequestCodesRequestId` FOREIGN KEY (`requestId`) REFERENCES `requestForms` (`requestId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `requestForms` ADD CONSTRAINT `fkrequestFormsEventId` FOREIGN KEY (`eventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `requestForms` ADD CONSTRAINT `fkrequestFormsPatientId` FOREIGN KEY (`patientId`) REFERENCES `patients` (`patientId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `requestForms` ADD CONSTRAINT `fkrequestFormsPhysicianId` FOREIGN KEY (`physicianId`) REFERENCES `physicians` (`physicianId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `requestForms` ADD CONSTRAINT `fkrequestFormsPhysicianSiteId` FOREIGN KEY (`physicianSiteId`) REFERENCES `physicianSites` (`siteId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `requestSpecimens` ADD CONSTRAINT `fkrequestSpecimensEventId` FOREIGN KEY (`eventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `requestSpecimens` ADD CONSTRAINT `fkrequestSpecimensStatusEventId` FOREIGN KEY (`statusEventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `requestSpecimens` ADD CONSTRAINT `fkrequestSpecimensRequestId` FOREIGN KEY (`requestId`) REFERENCES `requestForms` (`requestId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `requestSpecimens` ADD CONSTRAINT `fkrequestSpecimensSpecimenId` FOREIGN KEY (`specimenId`) REFERENCES `containers` (`containerId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `routingMatrix` ADD CONSTRAINT `fkroutingMatrixEventId` FOREIGN KEY (`eventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `ruuResults` ADD CONSTRAINT `fkruuResultsEventId` FOREIGN KEY (`eventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `ruuResults` ADD CONSTRAINT `fkruuResultsSampleId` FOREIGN KEY (`sampleId`) REFERENCES `requestSpecimens` (`specimenId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `ruuResults` ADD CONSTRAINT `fkruuResultsSentToGIEventId` FOREIGN KEY (`sentToGIEventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `sampleFailure` ADD CONSTRAINT `fksampleFailureEventId` FOREIGN KEY (`eventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `sampleFailure` ADD CONSTRAINT `fksampleFailureSampleId` FOREIGN KEY (`sampleId`) REFERENCES `requestSpecimens` (`specimenId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `samplePanels` ADD CONSTRAINT `fksamplePanelsCancelledEventId` FOREIGN KEY (`cancelledEventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `samplePanels` ADD CONSTRAINT `fksamplePanelsCompletedEventId` FOREIGN KEY (`completedEventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `samplePanels` ADD CONSTRAINT `fksamplePanelsEventId` FOREIGN KEY (`eventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `samplePanels` ADD CONSTRAINT `fksamplePanelsPanelCode` FOREIGN KEY (`panelCode`) REFERENCES `panels` (`panelCode`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `samplePanels` ADD CONSTRAINT `fksamplePanelsReqId` FOREIGN KEY (`requestId`) REFERENCES `requestForms` (`requestId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `samplePanels` ADD CONSTRAINT `fksamplePanelsSampleId` FOREIGN KEY (`sampleId`) REFERENCES `containers` (`containerId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `samplePanels` ADD CONSTRAINT `fksamplePanelsTestCode` FOREIGN KEY (`testCode`) REFERENCES `tests` (`testCode`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `sampleProcessing` ADD CONSTRAINT `fksampleProcessingBatchEventId` FOREIGN KEY (`batchEventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `sampleProcessing` ADD CONSTRAINT `fksampleProcessingBatchId` FOREIGN KEY (`batchId`) REFERENCES `containers` (`containerId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `sampleProcessing` ADD CONSTRAINT `fksampleProcessingCancelledEventId` FOREIGN KEY (`cancelledEventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `sampleProcessing` ADD CONSTRAINT `fksampleProcessingCompletedEventId` FOREIGN KEY (`completedEventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `sampleProcessing` ADD CONSTRAINT `fksampleProcessingEventId` FOREIGN KEY (`eventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `sampleProcessing` ADD CONSTRAINT `fksampleProcessingPanelCode` FOREIGN KEY (`panelCode`) REFERENCES `panels` (`panelCode`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `sampleProcessing` ADD CONSTRAINT `fksampleProcessingReqId` FOREIGN KEY (`reqId`) REFERENCES `requestForms` (`requestId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `sampleProcessing` ADD CONSTRAINT `fksampleProcessingSampleId` FOREIGN KEY (`sampleId`) REFERENCES `containers` (`containerId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `sampleProcessing` ADD CONSTRAINT `fksampleProcessingTestCode` FOREIGN KEY (`testCode`) REFERENCES `tests` (`testCode`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `sampleProperties` ADD CONSTRAINT `fksamplePropertiesEventId` FOREIGN KEY (`eventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `sampleProperties` ADD CONSTRAINT `fksamplePropertiesSampleId` FOREIGN KEY (`sampleId`) REFERENCES `requestSpecimens` (`specimenId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `sanger` ADD CONSTRAINT `fksangerEventId` FOREIGN KEY (`eventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `sanger` ADD CONSTRAINT `fksangerSampleId` FOREIGN KEY (`sampleId`) REFERENCES `requestSpecimens` (`specimenId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `sanger` ADD CONSTRAINT `fksangerUpdateEventId` FOREIGN KEY (`updateEventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `sangerResults` ADD CONSTRAINT `fksangerResultsEventId` FOREIGN KEY (`eventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `sangerResults` ADD CONSTRAINT `fksangerResultsFinalStatusEventId` FOREIGN KEY (`finalStatusEventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `sangerResults` ADD CONSTRAINT `fksangerResultsSampleId` FOREIGN KEY (`sampleId`) REFERENCES `requestSpecimens` (`specimenId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `sangerResults` ADD CONSTRAINT `fksangerResultsSentToGIEventId` FOREIGN KEY (`sentToGIEventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `sangerResults` ADD CONSTRAINT `fksangerResultsStatusEventId` FOREIGN KEY (`statusEventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `serviceConfiguration` ADD CONSTRAINT `fktblServiceConfigurationEventId` FOREIGN KEY (`eventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `snpList` ADD CONSTRAINT `fksnpListEventId` FOREIGN KEY (`eventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `snpResults` ADD CONSTRAINT `fksnpResultsEventId` FOREIGN KEY (`eventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `snpResults` ADD CONSTRAINT `fksnpResultsPlate` FOREIGN KEY (`plate`) REFERENCES `containers` (`containerId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `snpResults` ADD CONSTRAINT `fksnpResultsQcEventId` FOREIGN KEY (`qcEventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `snpResults` ADD CONSTRAINT `fksnpResultsSampleId` FOREIGN KEY (`sampleId`) REFERENCES `requestSpecimens` (`specimenId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `snpReviewResults` ADD CONSTRAINT `fksnpReviewResultsEventId` FOREIGN KEY (`eventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `snpReviewResults` ADD CONSTRAINT `fksnpReviewResultsReportId` FOREIGN KEY (`reportId`) REFERENCES `reportDetails` (`reportId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `snpReviewResults` ADD CONSTRAINT `fksnpReviewResultsRequestId` FOREIGN KEY (`requestId`) REFERENCES `requestForms` (`requestId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `snpReviewResults` ADD CONSTRAINT `fksnpReviewResultsSnpResultsId` FOREIGN KEY (`snpResultsId`) REFERENCES `snpResults` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `specimenMethods` ADD CONSTRAINT `fkspecimenMethodsEventId` FOREIGN KEY (`eventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `specimenMethods` ADD CONSTRAINT `fkspecimenMethodsStatusEventId` FOREIGN KEY (`statusEventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `specimenMethods` ADD CONSTRAINT `fkspecimenMethodsPanelCode` FOREIGN KEY (`testCode`) REFERENCES `tests` (`testCode`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `specimenMethods` ADD CONSTRAINT `fkspecimenMethodsRequestSpecimensId` FOREIGN KEY (`requestSpecimensId`) REFERENCES `requestSpecimens` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `specimenRuns` ADD CONSTRAINT `fkspecimenRunsCompletedEventId` FOREIGN KEY (`completedEventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `specimenRuns` ADD CONSTRAINT `fkspecimenRunsCurrentParentId` FOREIGN KEY (`currentParentId`) REFERENCES `containers` (`containerId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `specimenRuns` ADD CONSTRAINT `fkspecimenRunsCurrentTubeId` FOREIGN KEY (`currentContainerId`) REFERENCES `containers` (`containerId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `specimenRuns` ADD CONSTRAINT `fkspecimenRunsEventId` FOREIGN KEY (`eventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `specimenRuns` ADD CONSTRAINT `fkspecimenRunsSpecimenMethodsId` FOREIGN KEY (`specimenMethodsId`) REFERENCES `specimenMethods` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `specimenRuns` ADD CONSTRAINT `fkspecimenRunsLastUpdatedEventId` FOREIGN KEY (`lastUpdatedEventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `storage` ADD CONSTRAINT `fkstorageEventId` FOREIGN KEY (`eventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `storage` ADD CONSTRAINT `fkstorageStorageContainerId` FOREIGN KEY (`storageContainerId`) REFERENCES `storageContainerInfo` (`storageContainerId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `storage` ADD CONSTRAINT `fkstorageStorageContent` FOREIGN KEY (`contentType`, `content`) REFERENCES `containers` (`containerType`, `containerId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `storageContainerInfo` ADD CONSTRAINT `fkstorageContainerInfoEventId` FOREIGN KEY (`eventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `storageContainerInfo` ADD CONSTRAINT `fkstorageContainerInfoStorageContainerId` FOREIGN KEY (`storageContainerId`) REFERENCES `containers` (`containerId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `testMethods` ADD CONSTRAINT `fktestMethodsEventId` FOREIGN KEY (`eventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `testPanels` ADD CONSTRAINT `fktestPanelsEventId` FOREIGN KEY (`eventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `testProcessingProperties` ADD CONSTRAINT `fktestProcessingPropertiesEventId` FOREIGN KEY (`eventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `testProcessingSettings` ADD CONSTRAINT `fktestProcessingSettingsEventId` FOREIGN KEY (`eventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `testReferences` ADD CONSTRAINT `fktestReferencesEventId` FOREIGN KEY (`eventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `testReferences` ADD CONSTRAINT `fktestReferencesRefId` FOREIGN KEY (`refId`) REFERENCES `referenceDocuments` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `testReferences` ADD CONSTRAINT `fktestReferencesTestId` FOREIGN KEY (`testCode`) REFERENCES `tests` (`testCode`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `tests` ADD CONSTRAINT `fktestsEventId` FOREIGN KEY (`eventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `testsForPanel` ADD CONSTRAINT `fktestsForPanelEventId` FOREIGN KEY (`eventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `testsForPanel` ADD CONSTRAINT `fktestsForPanelPanelCode` FOREIGN KEY (`panelCode`) REFERENCES `panels` (`panelCode`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `testsForPanel` ADD CONSTRAINT `fktestsForPanelTestCode` FOREIGN KEY (`testCode`) REFERENCES `tests` (`testCode`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `toxConfirmationImport` ADD CONSTRAINT `fktoxConfirmationImportAliquotId` FOREIGN KEY (`aliquotId`) REFERENCES `containers` (`containerId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `toxConfirmationImport` ADD CONSTRAINT `fktoxConfirmationImportBatchId` FOREIGN KEY (`batchId`) REFERENCES `containers` (`containerId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `toxConfirmationImport` ADD CONSTRAINT `fktoxConfirmationImportEventId` FOREIGN KEY (`eventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `toxConfirmationImport` ADD CONSTRAINT `fktoxConfirmationImportInstrumentUsed` FOREIGN KEY (`instrumentUsed`) REFERENCES `instruments` (`instrumentId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `toxConfirmationImport` ADD CONSTRAINT `fktoxConfirmationImportResultStatusEventId` FOREIGN KEY (`resultStatusEventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `toxConfirmationImport` ADD CONSTRAINT `fktoxConfirmationImportUserId` FOREIGN KEY (`userId`) REFERENCES `userInfo` (`userId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `toxConfirmationResults` ADD CONSTRAINT `fktoxConfirmationResultsAliquotId` FOREIGN KEY (`aliquotId`) REFERENCES `containers` (`containerId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `toxConfirmationResults` ADD CONSTRAINT `fktoxConfirmationResultsBatchId` FOREIGN KEY (`batchId`) REFERENCES `containers` (`containerId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `toxConfirmationResults` ADD CONSTRAINT `fktoxConfirmationResultsEventId` FOREIGN KEY (`eventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `toxConfirmationResults` ADD CONSTRAINT `fktoxConfirmationResultsInstrumentUsed` FOREIGN KEY (`instrumentUsed`) REFERENCES `instruments` (`instrumentId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `toxConfirmationResults` ADD CONSTRAINT `fktoxConfirmationResultsResultStatusEventId` FOREIGN KEY (`resultStatusEventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `toxConfirmationResults` ADD CONSTRAINT `fktoxConfirmationResultsUserId` FOREIGN KEY (`userId`) REFERENCES `userInfo` (`userId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `toxConfirmationResultsTempReportData` ADD CONSTRAINT `fktoxConfirmationResultsTempReportDataEventId` FOREIGN KEY (`eventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `toxScreenRawResults` ADD CONSTRAINT `fktoxScreenRawResultsAcceptStatusEventId` FOREIGN KEY (`acceptStatusEventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `toxScreenRawResults` ADD CONSTRAINT `fktoxScreenRawResultsAliquotId` FOREIGN KEY (`aliquotId`) REFERENCES `containers` (`containerId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `toxScreenRawResults` ADD CONSTRAINT `fktoxScreenRawResultsEventId` FOREIGN KEY (`eventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `toxScreenResults` ADD CONSTRAINT `fktoxScreenResultsAcceptScreenStatusEventId` FOREIGN KEY (`screenStatusEventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `toxScreenResults` ADD CONSTRAINT `fktoxScreenResultsAliquotId` FOREIGN KEY (`aliquotId`) REFERENCES `containers` (`containerId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `toxScreenResults` ADD CONSTRAINT `fktoxScreenResultsEventId` FOREIGN KEY (`eventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `toxTecanPlateMap` ADD CONSTRAINT `fktoxTecanPlateMapAliquotId` FOREIGN KEY (`aliquotId`) REFERENCES `containers` (`containerId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `toxTecanPlateMap` ADD CONSTRAINT `fktoxTecanPlateMapEventId` FOREIGN KEY (`eventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `toxTecanPlateMap` ADD CONSTRAINT `fktoxTecanPlateMapPlateEventId` FOREIGN KEY (`plateEventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `toxTecanPlateMap` ADD CONSTRAINT `fktoxTecanPlateMapPlateId` FOREIGN KEY (`plateId`) REFERENCES `containers` (`containerId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `toxValidities` ADD CONSTRAINT `fktoxValiditiesAliquotId` FOREIGN KEY (`aliquotId`) REFERENCES `containers` (`containerId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `transferMapMMAssignments` ADD CONSTRAINT `fktransferMapMMAssignmentsEventId` FOREIGN KEY (`eventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `transferMapMMAssignments` ADD CONSTRAINT `fktransferMapMMAssignmentsMmId` FOREIGN KEY (`mmId`) REFERENCES `masterMixes` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `transferMapMMAssignments` ADD CONSTRAINT `fktransferMapMMAssignmentsTransferMapStepID` FOREIGN KEY (`transferMapStepId`) REFERENCES `transferMapStepAssignments` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `transferMapPanelAssignments` ADD CONSTRAINT `fktransferMapPanelAssignmentsTransferEventId` FOREIGN KEY (`eventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `transferMapPanelAssignments` ADD CONSTRAINT `fktransferMapPanelAssignmentsTransferMapStepID` FOREIGN KEY (`transferMapStepID`) REFERENCES `transferMapStepAssignments` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `transferMapProperties` ADD CONSTRAINT `fktransferMapPropertiesEventId` FOREIGN KEY (`eventid`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `transferMapStepAssignments` ADD CONSTRAINT `fktransferMapStepAssignmentsEventId` FOREIGN KEY (`eventid`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `transferMapStepAssignments` ADD CONSTRAINT `fktransferMapStepAssignmentstTransferMapId` FOREIGN KEY (`transferMapId`) REFERENCES `transferMapProperties` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `transferMapTransferHistory` ADD CONSTRAINT `fktransferMapTransferHistoryEventId` FOREIGN KEY (`eventID`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `translation` ADD CONSTRAINT `fktranslationEventId` FOREIGN KEY (`eventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `trayMapMMAssignments` ADD CONSTRAINT `fktrayMapMMAssignmentsEventId` FOREIGN KEY (`eventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `trayMapMMAssignments` ADD CONSTRAINT `fktrayMapMMAssignmentsMmId` FOREIGN KEY (`mmId`) REFERENCES `masterMixes` (`Id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `trayMapMMAssignments` ADD CONSTRAINT `fktrayMapMMAssignmentsTrayMapStepID` FOREIGN KEY (`trayMapStepId`) REFERENCES `trayMapStepAssignments` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `trayMapStepAssignments` ADD CONSTRAINT `fktrayMapStepAssignmentstrayEventId` FOREIGN KEY (`eventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `trayMapStepAssignments` ADD CONSTRAINT `fktrayMapStepAssignmentstrayMapId` FOREIGN KEY (`trayMapId`) REFERENCES `trayMapProperties` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `trayMapProperties` ADD CONSTRAINT `fktrayMapPropertiesEventId` FOREIGN KEY (`eventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `trayMaps` ADD CONSTRAINT `fktrayMapsEventId` FOREIGN KEY (`eventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `trayMaps` ADD CONSTRAINT `fktrayMapsTrayMapId` FOREIGN KEY (`trayMapId`) REFERENCES `trayMapProperties` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `validValuesLinks` ADD CONSTRAINT `fkvalidValuesLinksEventId` FOREIGN KEY (`eventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `validValuesLinks` ADD CONSTRAINT `fkvalidValuesLinksFormConfigurablePartsId` FOREIGN KEY (`formConfigurablePartsId`) REFERENCES `formConfigurableParts` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `validValuesLinks` ADD CONSTRAINT `fkvalidValuesLinksSetName` FOREIGN KEY (`setName`) REFERENCES `validValues` (`setName`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `vendors` ADD CONSTRAINT `fkvendorEventId` FOREIGN KEY (`eventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION;

DROP TRIGGER IF EXISTS `trgreagents_AFTER_UPDATE`;

DELIMITER $$

DROP TRIGGER IF EXISTS `trgreagents_AFTER_UPDATE`$$

CREATE DEFINER = CURRENT_USER TRIGGER `trgreagents_AFTER_UPDATE` AFTER UPDATE ON `reagents` FOR EACH ROW
BEGIN
    DECLARE CUR_DATE DATETIME DEFAULT NOW();
    DECLARE TGR_ACTION VARCHAR(16) DEFAULT 'INSERT';
    DECLARE CUR_USER VARCHAR(255) DEFAULT SESSION_USER();

    UPDATE reagentHistory
    SET historyEndDate = CUR_DATE
    WHERE reagentId = OLD.reagentId
    AND historyEndDate IS NULL;

    INSERT INTO `reagentHistory`
    (
        `id`,
        `reagentId`,
        `reagentType`,
        `catalogNo`,
        `quantity`,
        `quantityInside`,
        `concentration`,
        `unitOfMeasure`,
        `threshold`,
        `thresholdUnits`,
        `lowerLimit`,
        `upperLimit`,
        `lotNumber`,
        `parentLot`,
        `vendor`,
        `storageId`,
        `projectType`,
        `costPerUnit`,
        `poNumber`,
        `receivedDate`,
        `expirationDate`,
        `openDate`,
        `QCDate`,
        `QCType`,
        `QCStatus`,
        `status`,
        `eventId`,
        `siteId`,
        `historyStartDate`,
        `historyEndDate`,
        `historyAction`,
        `historyUser`
    )
    VALUES
    (
        NEW.id,
        NEW.reagentId,
    NEW.reagentType,
    NEW.catalogNo,
    NEW.quantity,
    NEW.quantityInside,
    NEW.concentration,
    NEW.unitOfMeasure,
    NEW.threshold,
    NEW.thresholdUnits,
    NEW.lowerLimit,
    NEW.upperLimit,
    NEW.lotNumber,
    NEW.parentLot,
    NEW.vendor,
    NEW.storageId,
    NEW.projectType,
    NEW.costPerUnit,
    NEW.poNumber,
    NEW.receivedDate,
    NEW.expirationDate,
    NEW.openDate,
    NEW.QCDate,
    NEW.QCType,
    NEW.QCStatus,
    NEW.status,
    NEW.eventId,
    NEW.siteId,
        CUR_DATE,
        NULL,
        TGR_ACTION,
        CUR_USER
    );
END$$

DROP TRIGGER IF EXISTS `trgreagents_AFTER_INSERT`$$

CREATE DEFINER = CURRENT_USER TRIGGER `trgreagents_AFTER_INSERT` AFTER INSERT ON `reagents` FOR EACH ROW
BEGIN
    DECLARE CUR_DATE DATETIME DEFAULT NOW();
    DECLARE TGR_ACTION VARCHAR(16) DEFAULT 'INSERT';
    DECLARE CUR_USER VARCHAR(255) DEFAULT SESSION_USER();

    INSERT INTO `reagentHistory`
    (
        `id`,
        `reagentId`,
        `reagentType`,
        `catalogNo`,
        `quantity`,
        `quantityInside`,
        `concentration`,
        `unitOfMeasure`,
        `threshold`,
        `thresholdUnits`,
        `lowerLimit`,
        `upperLimit`,
        `lotNumber`,
        `parentLot`,
        `vendor`,
        `storageId`,
        `projectType`,
        `costPerUnit`,
        `poNumber`,
        `receivedDate`,
        `expirationDate`,
        `openDate`,
        `QCDate`,
        `QCType`,
        `QCStatus`,
        `status`,
        `eventId`,
        `siteId`,
        `historyStartDate`,
        `historyEndDate`,
        `historyAction`,
        `historyUser`
    )
    VALUES
    (
        NEW.id,
        NEW.reagentId,
    NEW.reagentType,
    NEW.catalogNo,
    NEW.quantity,
    NEW.quantityInside,
    NEW.concentration,
    NEW.unitOfMeasure,
    NEW.threshold,
    NEW.thresholdUnits,
    NEW.lowerLimit,
    NEW.upperLimit,
    NEW.lotNumber,
    NEW.parentLot,
    NEW.vendor,
    NEW.storageId,
    NEW.projectType,
    NEW.costPerUnit,
    NEW.poNumber,
    NEW.receivedDate,
    NEW.expirationDate,
    NEW.openDate,
    NEW.QCDate,
    NEW.QCType,
    NEW.QCStatus,
    NEW.status,
    NEW.eventId,
    NEW.siteId,
        CUR_DATE,
        NULL,
        TGR_ACTION,
        CUR_USER
    );
END$$

DROP TRIGGER IF EXISTS `trgreagents_AFTER_DELETE`$$

CREATE DEFINER = CURRENT_USER TRIGGER `trgreagents_AFTER_DELETE` AFTER DELETE ON `reagents` FOR EACH ROW
BEGIN

    DECLARE CUR_DATE DATETIME DEFAULT NOW();
    DECLARE TGR_ACTION VARCHAR(16) DEFAULT 'INSERT';
    DECLARE CUR_USER VARCHAR(255) DEFAULT SESSION_USER();

    UPDATE reagentHistory
    SET historyEndDate = CUR_DATE
    WHERE reagentId = OLD.reagentId
    AND historyEndDate IS NULL;

END$$

DROP TRIGGER IF EXISTS `trgspecimenMethods_AFTER_INSERT` $$

CREATE TRIGGER `trgspecimenMethods_AFTER_INSERT` AFTER INSERT ON `specimenMethods` FOR EACH ROW
BEGIN
    DECLARE CUR_DATE DATETIME DEFAULT NOW();
    DECLARE TGR_ACTION VARCHAR(16) DEFAULT 'INSERT';
    DECLARE CUR_USER VARCHAR(255) DEFAULT SESSION_USER();

    INSERT INTO `specimenMethodsHistory`
    (
        `id`,
        `requestSpecimensId`,
        `testCode`,
        `methodCode`,
        `runCount`,
        `status`,
        `statusEventId`,
        `eventId`,
        `historyStartDate`,
        `historyEndDate`,
        `historyAction`,
        `historyUser`
    )
    VALUES
    (
        NEW.id,
        NEW.requestSpecimensId,
        NEW.testCode,
        NEW.methodCode,
        NEW.runCount,
        NEW.status,
        NEW.statusEventId,
        NEW.eventId,
        CUR_DATE,
        NULL,
        TGR_ACTION,
        CUR_USER
    );
END $$

DROP TRIGGER IF EXISTS `trgspecimenMethods_AFTER_UPDATE` $$

CREATE TRIGGER `trgspecimenMethods_AFTER_UPDATE` AFTER UPDATE ON `specimenMethods` FOR EACH ROW
BEGIN
    DECLARE CUR_DATE DATETIME DEFAULT NOW();
    DECLARE TGR_ACTION VARCHAR(16) DEFAULT 'UPDATE';
    DECLARE CUR_USER VARCHAR(255) DEFAULT SESSION_USER();

    UPDATE specimenMethodsHistory
    SET historyEndDate = CUR_DATE
    WHERE id = OLD.id
    AND historyEndDate IS NULL;

    INSERT INTO `specimenMethodsHistory`
    (
        `id`,
        `requestSpecimensId`,
        `testCode`,
        `methodCode`,
        `runCount`,
        `status`,
        `statusEventId`,
        `eventId`,
        `historyStartDate`,
        `historyEndDate`,
        `historyAction`,
        `historyUser`
    )
    VALUES
    (
        NEW.id,
        NEW.requestSpecimensId,
        NEW.testCode,
        NEW.methodCode,
        NEW.runCount,
        NEW.status,
        NEW.statusEventId,
        NEW.eventId,
        CUR_DATE,
        NULL,
        TGR_ACTION,
        CUR_USER
    );
END $$

DROP TRIGGER IF EXISTS `trgspecimenMethods_AFTER_DELETE` $$

CREATE TRIGGER `trgspecimenMethods_AFTER_DELETE` AFTER DELETE ON `specimenMethods` FOR EACH ROW
BEGIN

    DECLARE CUR_DATE DATETIME DEFAULT NOW();
    DECLARE TGR_ACTION VARCHAR(16) DEFAULT 'SESSION_USER';
    DECLARE CUR_USER VARCHAR(255) DEFAULT SESSION_USER();

    UPDATE specimenMethodsHistory
    SET historyEndDate = CUR_DATE
    WHERE id = OLD.id
    AND historyEndDate IS NULL;

END $$

DROP TRIGGER IF EXISTS `trgspecimenRuns_AFTER_INSERT` $$

CREATE TRIGGER `trgspecimenRuns_AFTER_INSERT` AFTER INSERT ON `specimenRuns` FOR EACH ROW
BEGIN
    DECLARE CUR_DATE DATETIME DEFAULT NOW();
    DECLARE TGR_ACTION VARCHAR(16) DEFAULT 'INSERT';
    DECLARE CUR_USER VARCHAR(255) DEFAULT SESSION_USER();

    INSERT INTO `specimenRunsHistory`
    (
        `id`,
        `runId`,
        `specimenMethodsId`,
        `runType`,
        `currentContainerId`,
        `currentParentId`,
        `currentParentPosition`,
        `completedResult`,
        `completedEventId`,
        `parentWorkflowSpecimenRunId`,
        `eventId`,
        `modifier`,
    `lastUpdatedEventId`,
        `historyStartDate`,
        `historyEndDate`,
        `historyAction`,
        `historyUser`
    )
    VALUES
    (
        NEW.id,
        NEW.runId,
        NEW.specimenMethodsId,
        NEW.runType,
        NEW.currentContainerId,
        NEW.currentParentId,
        NEW.currentParentPosition,
        NEW.completedResult,
        NEW.completedEventId,
        NEW.parentWorkflowSpecimenRunId,
        NEW.eventId,
        NEW.modifier,
    NEW.lastUpdatedEventId,
        CUR_DATE,
        NULL,
        TGR_ACTION,
        CUR_USER
    );
END $$

DROP TRIGGER IF EXISTS `trgspecimenRuns_AFTER_UPDATE` $$

CREATE TRIGGER `trgspecimenRuns_AFTER_UPDATE` AFTER UPDATE ON `specimenRuns` FOR EACH ROW
BEGIN
    DECLARE CUR_DATE DATETIME DEFAULT NOW();
    DECLARE TGR_ACTION VARCHAR(16) DEFAULT 'UPDATE';
    DECLARE CUR_USER VARCHAR(255) DEFAULT SESSION_USER();

    UPDATE specimenRunsHistory
    SET historyEndDate = CUR_DATE
    WHERE id = OLD.id
    AND historyEndDate IS NULL;

    INSERT INTO `specimenRunsHistory`
    (
        `id`,
        `runId`,
        `specimenMethodsId`,
        `runType`,
        `currentContainerId`,
        `currentParentId`,
        `currentParentPosition`,
        `completedResult`,
        `completedEventId`,
        `parentWorkflowSpecimenRunId`,
        `eventId`,
        `modifier`,
    `lastUpdatedEventId`,
        `historyStartDate`,
        `historyEndDate`,
        `historyAction`,
        `historyUser`
    )
    VALUES
    (
        NEW.id,
        NEW.runId,
        NEW.specimenMethodsId,
        NEW.runType,
        NEW.currentContainerId,
        NEW.currentParentId,
        NEW.currentParentPosition,
        NEW.completedResult,
        NEW.completedEventId,
        NEW.parentWorkflowSpecimenRunId,
        NEW.eventId,
        NEW.modifier,
    NEW.lastUpdatedEventId,
        CUR_DATE,
        NULL,
        TGR_ACTION,
        CUR_USER
    );
END $$

DROP TRIGGER IF EXISTS `trgspecimenRuns_AFTER_DELETE` $$

CREATE TRIGGER `trgspecimenRuns_AFTER_DELETE` AFTER DELETE ON `specimenRuns` FOR EACH ROW
BEGIN

    DECLARE CUR_DATE DATETIME DEFAULT NOW();
    DECLARE TGR_ACTION VARCHAR(16) DEFAULT 'DELETE';
    DECLARE CUR_USER VARCHAR(255) DEFAULT SESSION_USER();

    UPDATE specimenRunsHistory
    SET historyEndDate = CUR_DATE
    WHERE id = OLD.id
    AND historyEndDate IS NULL;

END $$

DROP TRIGGER IF EXISTS `trgreagents_AFTER_UPDATE`$$

CREATE TRIGGER `trgreagents_AFTER_UPDATE` AFTER UPDATE ON `reagents` FOR EACH ROW
BEGIN
    DECLARE CUR_DATE DATETIME DEFAULT NOW();
    DECLARE TGR_ACTION VARCHAR(16) DEFAULT 'INSERT';
    DECLARE CUR_USER VARCHAR(255) DEFAULT SESSION_USER();

    UPDATE reagentHistory
    SET historyEndDate = CUR_DATE
    WHERE reagentId = OLD.reagentId
    AND historyEndDate IS NULL;

    INSERT INTO `reagentHistory`
    (
        `id`,
        `reagentId`,
        `reagentType`,
        `catalogNo`,
        `quantity`,
        `quantityInside`,
        `concentration`,
        `unitOfMeasure`,
        `threshold`,
        `thresholdUnits`,
        `lowerLimit`,
        `upperLimit`,
        `lotNumber`,
        `parentLot`,
        `vendor`,
        `storageId`,
        `projectType`,
        `costPerUnit`,
        `poNumber`,
        `receivedDate`,
        `expirationDate`,
        `openDate`,
        `QCDate`,
        `QCType`,
        `QCStatus`,
        `status`,
        `eventId`,
        `siteId`,
        `historyStartDate`,
        `historyEndDate`,
        `historyAction`,
        `historyUser`
    )
    VALUES
    (
        NEW.id,
        NEW.reagentId,
    NEW.reagentType,
    NEW.catalogNo,
    NEW.quantity,
    NEW.quantityInside,
    NEW.concentration,
    NEW.unitOfMeasure,
    NEW.threshold,
    NEW.thresholdUnits,
    NEW.lowerLimit,
    NEW.upperLimit,
    NEW.lotNumber,
    NEW.parentLot,
    NEW.vendor,
    NEW.storageId,
    NEW.projectType,
    NEW.costPerUnit,
    NEW.poNumber,
    NEW.receivedDate,
    NEW.expirationDate,
    NEW.openDate,
    NEW.QCDate,
    NEW.QCType,
    NEW.QCStatus,
    NEW.status,
    NEW.eventId,
    NEW.siteId,
        CUR_DATE,
        NULL,
        TGR_ACTION,
        CUR_USER
    );
END$$

DROP TRIGGER IF EXISTS `trgreagents_AFTER_INSERT`$$

CREATE TRIGGER `trgreagents_AFTER_INSERT` AFTER INSERT ON `reagents` FOR EACH ROW
BEGIN
    DECLARE CUR_DATE DATETIME DEFAULT NOW();
    DECLARE TGR_ACTION VARCHAR(16) DEFAULT 'INSERT';
    DECLARE CUR_USER VARCHAR(255) DEFAULT SESSION_USER();

    INSERT INTO `reagentHistory`
    (
        `id`,
        `reagentId`,
        `reagentType`,
        `catalogNo`,
        `quantity`,
        `quantityInside`,
        `concentration`,
        `unitOfMeasure`,
        `threshold`,
        `thresholdUnits`,
        `lowerLimit`,
        `upperLimit`,
        `lotNumber`,
        `parentLot`,
        `vendor`,
        `storageId`,
        `projectType`,
        `costPerUnit`,
        `poNumber`,
        `receivedDate`,
        `expirationDate`,
        `openDate`,
        `QCDate`,
        `QCType`,
        `QCStatus`,
        `status`,
        `eventId`,
        `siteId`,
        `historyStartDate`,
        `historyEndDate`,
        `historyAction`,
        `historyUser`
    )
    VALUES
    (
        NEW.id,
        NEW.reagentId,
    NEW.reagentType,
    NEW.catalogNo,
    NEW.quantity,
    NEW.quantityInside,
    NEW.concentration,
    NEW.unitOfMeasure,
    NEW.threshold,
    NEW.thresholdUnits,
    NEW.lowerLimit,
    NEW.upperLimit,
    NEW.lotNumber,
    NEW.parentLot,
    NEW.vendor,
    NEW.storageId,
    NEW.projectType,
    NEW.costPerUnit,
    NEW.poNumber,
    NEW.receivedDate,
    NEW.expirationDate,
    NEW.openDate,
    NEW.QCDate,
    NEW.QCType,
    NEW.QCStatus,
    NEW.status,
    NEW.eventId,
    NEW.siteId,
        CUR_DATE,
        NULL,
        TGR_ACTION,
        CUR_USER
    );
END$$

DROP TRIGGER IF EXISTS `trgreagents_AFTER_DELETE`$$

CREATE TRIGGER `trgreagents_AFTER_DELETE` AFTER DELETE ON `reagents` FOR EACH ROW
BEGIN

    DECLARE CUR_DATE DATETIME DEFAULT NOW();
    DECLARE TGR_ACTION VARCHAR(16) DEFAULT 'INSERT';
    DECLARE CUR_USER VARCHAR(255) DEFAULT SESSION_USER();

    UPDATE reagentHistory
    SET historyEndDate = CUR_DATE
    WHERE reagentId = OLD.reagentId
    AND historyEndDate IS NULL;

END$$

DELIMITER ;

INSERT INTO dbVersionHistory
    (
        version,
        versionDate
    ) VALUES (
        'LIMSv3_ALPHA_009',
        NOW()
    );

INSERT INTO dbSettings
    (
        dbSetting,
        `value`
    ) VALUES (
        'dbCurrentVersion',
        'LIMSv3_ALPHA_009'
    );

INSERT INTO dbSettings
    (
        dbSetting,
        `value`
    ) VALUES (
        'dbCurrentDataVersion',
        'LIMSv3_ALPHADATA_000'
    );

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
