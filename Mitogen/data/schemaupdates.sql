
SET NAMES utf8mb4;
SET character_set_client = 'utf8mb4';
SET character_set_connection = 'utf8mb4';
SET character_set_database = 'utf8mb4';
SET character_set_results = 'utf8mb4';

DELIMITER $$

DROP PROCEDURE IF EXISTS sp_Update_Mitogen_Schema $$

CREATE PROCEDURE sp_Update_Mitogen_Schema()

BEGIN

    DROP TABLE IF EXISTS tmpUpgradeResults;

    CREATE TEMPORARY TABLE tmpUpgradeResults (
        id INT(11) UNSIGNED AUTO_INCREMENT NOT NULL,
        resultType VARCHAR(255) NOT NULL,
        result longtext NOT NULL,
        resultTimeStamp DATETIME NOT NULL DEFAULT NOW(),
        PRIMARY KEY USING BTREE (ID)
    );

    -- LIMSv3_ALPHA_001 --> LIMSv3_ALPHA_002
    IF EXISTS(SELECT 1 FROM dbSettings WHERE dbSetting =  'dbCurrentVersion' AND `value` = 'LIMSv3_ALPHA_001') THEN

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'SCHEMA VERSION LIMSv3_ALPHA_001 DETECTED');

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'UPDATING quantResults.....');

        ALTER TABLE`quantResults`
        MODIFY COLUMN `resultEventId` bigint(20) UNSIGNED NULL AFTER `result`;

        ALTER TABLE `quantResults`
        MODIFY COLUMN `dataEventId` bigint(20) UNSIGNED NOT NULL AFTER `uploaded`;

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'UPDATING quantResults..... Success');

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'UPDATING Database Version..... ');

        INSERT INTO dbVersionHistory
        (
            version,
            versionDate
        ) VALUES (
            'LIMSv3_ALPHA_002',
            NOW()
        );

        UPDATE dbSettings
        SET `value` = 'LIMSv3_ALPHA_002'
        WHERE `dbSetting` = 'dbCurrentVersion';

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'UPDATING Database Version..... Success');
    ELSE

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'SKIPPING VERSION LIMSv3_ALPHA_001 UPDATES');

    END IF;

    -- LIMSv3_ALPHA_002 --> LIMSv3_ALPHA_003
    IF EXISTS(SELECT 1 FROM dbSettings WHERE dbSetting =  'dbCurrentVersion' AND `value` = 'LIMSv3_ALPHA_002') THEN

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'SCHEMA VERSION LIMSv3_ALPHA_002 DETECTED');

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'UPDATING requestSpecimens.....');

        UPDATE requestSpecimens SET specimenQuantity = NULL WHERE specimenQuantity = '';

        ALTER TABLE `requestSpecimens`
        MODIFY COLUMN `specimenQuantity` decimal(10, 3) NULL DEFAULT NULL AFTER `receivedDate`;

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'UPDATING requestSpecimens..... Success');

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'UPDATING requestSpecimensHistory.....');

        UPDATE requestSpecimensHistory SET specimenQuantity = NULL WHERE specimenQuantity = '';

        ALTER TABLE `requestSpecimensHistory`
        CHANGE COLUMN `specimenQuantity` `specimenQuantity` DECIMAL(10,3) NULL DEFAULT NULL ;

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'UPDATING requestSpecimensHistory..... Success');


        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'UPDATING routingMatrix.....');

        ALTER TABLE `routingMatrix`
        ADD COLUMN `priority` int(11) NOT NULL DEFAULT 1 AFTER `id`;

        ALTER TABLE `routingMatrix`
        ADD COLUMN `routingType` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'run' AFTER `priority`;

        ALTER TABLE `routingMatrix`
        ADD COLUMN `routingDirection` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'OUT' AFTER `routingType`;

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'UPDATING routingMatrix..... Success');

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'UPDATING Database Version..... ');

        INSERT INTO dbVersionHistory
        (
            version,
            versionDate
        ) VALUES (
            'LIMSv3_ALPHA_003',
            NOW()
        );

        UPDATE dbSettings
        SET `value` = 'LIMSv3_ALPHA_003'
        WHERE `dbSetting` = 'dbCurrentVersion';

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'UPDATING Database Version..... Success');
     ELSE

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'SKIPPING VERSION LIMSv3_ALPHA_002 UPDATES');

     END IF;


    -- LIMSv3_ALPHA_003 --> LIMSv3_ALPHA_004
    IF EXISTS(SELECT 1 FROM dbSettings WHERE dbSetting =  'dbCurrentVersion' AND `value` = 'LIMSv3_ALPHA_003') THEN

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'SCHEMA VERSION LIMSv3_ALPHA_003 DETECTED');

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'UPDATING contents.....');


        ALTER TABLE `contents`
        ADD CONSTRAINT `fkcontentsContainer` FOREIGN KEY (`containerId`) REFERENCES `containers` (`containerId`) ON DELETE NO ACTION ON UPDATE NO ACTION,
        ADD CONSTRAINT `fkcontentsContent` FOREIGN KEY (`content`) REFERENCES `containers` (`containerId`) ON DELETE NO ACTION ON UPDATE NO ACTION;

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'UPDATING contents..... Success');

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'UPDATING Database Version..... ');

        INSERT INTO dbVersionHistory
        (
            version,
            versionDate
        ) VALUES (
            'LIMSv3_ALPHA_004',
            NOW()
        );

        UPDATE dbSettings
        SET `value` = 'LIMSv3_ALPHA_004'
        WHERE `dbSetting` = 'dbCurrentVersion';

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'UPDATING Database Version..... Success');
     ELSE

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'SKIPPING VERSION LIMSv3_ALPHA_003 UPDATES');

     END IF;

    -- LIMSv3_ALPHA_004 --> LIMSv3_ALPHA_005
    IF EXISTS(SELECT 1 FROM dbSettings WHERE dbSetting =  'dbCurrentVersion' AND `value` = 'LIMSv3_ALPHA_004') THEN

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'SCHEMA VERSION LIMSv3_ALPHA_004 DETECTED');

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'CREATING protocolLibrary.....');

        CREATE TABLE `protocolLibrary` (
          `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
          `protocolName` varchar(255) NOT NULL,
          `addMenu` bit(1) DEFAULT b'0',
          `menuGrouping` varchar(80) NOT NULL DEFAULT '',
          PRIMARY KEY (`id`) USING BTREE,
          UNIQUE KEY `idxprotocolLibraryProtocolName` (`protocolName`) USING BTREE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'CREATING protocolLibrary..... Success');

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'CREATING protocolSteps.....');

        CREATE TABLE `protocolSteps` (
          `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
          `protocolLibraryId` int(11) unsigned NOT NULL,
          `stepName` varchar(255) NOT NULL,
          `displayName` varchar(255) NOT NULL,
          `stepType` varchar(80) NOT NULL DEFAULT '',
          `nextStep` varchar(255) DEFAULT NULL,
          PRIMARY KEY (`id`) USING BTREE,
          UNIQUE KEY `idxprotocolStepsDisplayName` (`displayName`) USING BTREE,
          KEY `idxprotocolStepsProtocolId` (`protocolLibraryId`) USING BTREE,
          CONSTRAINT `fkprotocolStepsProtocolLibraryId` FOREIGN KEY (`protocolLibraryId`) REFERENCES `protocolLibrary` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'CREATING protocolSteps..... Success');

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'CREATING protocolStepParameters.....');

        CREATE TABLE `protocolStepParameters` (
          `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
          `protocolStepsId` int(11) unsigned NOT NULL,
          `parameter` varchar(255) NOT NULL,
          `value` varchar(255) DEFAULT NULL,
          PRIMARY KEY (`id`) USING BTREE,
          KEY `idxprotocolStepParametersProtocolStepId` (`protocolStepsId`) USING BTREE,
          CONSTRAINT `fkProtocolStepParametersProcolStepsId` FOREIGN KEY (`protocolStepsId`) REFERENCES `protocolSteps` (`id`)  ON DELETE NO ACTION ON UPDATE NO ACTION
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'CREATING protocolStepParameters..... Success');

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'UPDATING Database Version..... ');

        INSERT INTO dbVersionHistory
        (
            version,
            versionDate
        ) VALUES (
            'LIMSv3_ALPHA_005',
            NOW()
        );

        UPDATE dbSettings
        SET `value` = 'LIMSv3_ALPHA_005'
        WHERE `dbSetting` = 'dbCurrentVersion';

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'UPDATING Database Version..... Success');
     ELSE

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'SKIPPING VERSION LIMSv3_ALPHA_004 UPDATES');

     END IF;

    -- LIMSv3_ALPHA_005 --> LIMSv3_ALPHA_006
    IF EXISTS(SELECT 1 FROM dbSettings WHERE dbSetting =  'dbCurrentVersion' AND `value` = 'LIMSv3_ALPHA_005') THEN

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'SCHEMA VERSION LIMSv3_ALPHA_005 DETECTED');

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'CREATING specimenMethodsHistory.....');

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

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'CREATING specimenMethodsHistory..... Success');

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'MODIFYING specimenRuns.....');

        ALTER TABLE `specimenRuns`
        ADD COLUMN `lastUpdatedEventId` bigint(20) UNSIGNED NULL AFTER `modifier`,
        ADD CONSTRAINT `fkspecimenRunsLastUpdatedEventId` FOREIGN KEY (`lastUpdatedEventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION;

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'MODIFYING specimenRuns..... Success');

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'UPDATING specimenRuns.....');

        UPDATE specimenRuns set lastUpdatedEventId = CASE WHEN completedEventId IS NULL THEN eventId ELSE completedEventId END;

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'UPDATING specimenRuns..... Success');

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'MODIFYING specimenRuns....');

        ALTER TABLE `specimenRuns`
        MODIFY `lastUpdatedEventId` BIGINT(20) UNSIGNED NOT NULL;

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'MODIFYING specimenRuns..... Success');

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'CREATING specimenRunsHistory.....');

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
          KEY `idxspecimenRunsHistoryId` (`id`) USING BTREE
        ) ENGINE=InnoDB  DEFAULT CHARSET=utf8mb4;

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'CREATING specimenRunsHistory..... Success');

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'UPDATING Database Version..... ');

        INSERT INTO dbVersionHistory
        (
            version,
            versionDate
        ) VALUES (
            'LIMSv3_ALPHA_006',
            NOW()
        );

        UPDATE dbSettings
        SET `value` = 'LIMSv3_ALPHA_006'
        WHERE `dbSetting` = 'dbCurrentVersion';

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'UPDATING Database Version..... Success');
     ELSE

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'SKIPPING VERSION LIMSv3_ALPHA_005 UPDATES');

     END IF;


    -- LIMSv3_ALPHA_006 --> LIMSv3_ALPHA_007
    IF EXISTS(SELECT 1 FROM dbSettings WHERE dbSetting =  'dbCurrentVersion' AND `value` = 'LIMSv3_ALPHA_006') THEN

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'SCHEMA VERSION LIMSv3_ALPHA_006 DETECTED');

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'MODIFYING routingMatrix.....');

        ALTER TABLE `routingMatrix`
        CHANGE COLUMN `nextStep` `nextStep` TEXT NOT NULL ;

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'MODIFYING routingMatrix..... Success');

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'UPDATING Database Version..... ');

        INSERT INTO dbVersionHistory
        (
            version,
            versionDate
        ) VALUES (
            'LIMSv3_ALPHA_007',
            NOW()
        );

        UPDATE dbSettings
        SET `value` = 'LIMSv3_ALPHA_007'
        WHERE `dbSetting` = 'dbCurrentVersion';

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'UPDATING Database Version..... Success');
     ELSE

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'SKIPPING VERSION LIMSv3_ALPHA_006 UPDATES');

     END IF;

    -- LIMSv3_ALPHA_007 --> LIMSv3_ALPHA_008
    IF EXISTS(SELECT 1 FROM dbSettings WHERE dbSetting =  'dbCurrentVersion' AND `value` = 'LIMSv3_ALPHA_007') THEN

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'SCHEMA VERSION LIMSv3_ALPHA_007 DETECTED');

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'MODIFYING containerNotes.....');

        DELETE containerNotes
        FROM containerNotes
        LEFT OUTER JOIN containers
        on containerNotes.containerid = containers.containerId
        where containers.containerid is null;

        ALTER TABLE `containerNotes`
        ADD CONSTRAINT `fkcontainerNotesContainerId`
            FOREIGN KEY (`containerId`)
            REFERENCES `containers` (`containerId`)
            ON DELETE NO ACTION
            ON UPDATE NO ACTION;

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'MODIFYING containerNotes..... Success');

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'UPDATING Database Version..... ');

        INSERT INTO dbVersionHistory
        (
            version,
            versionDate
        ) VALUES (
            'LIMSv3_ALPHA_008',
            NOW()
        );

        UPDATE dbSettings
        SET `value` = 'LIMSv3_ALPHA_008'
        WHERE `dbSetting` = 'dbCurrentVersion';

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'UPDATING Database Version..... Success');
     ELSE

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'SKIPPING VERSION LIMSv3_ALPHA_007 UPDATES');

     END IF;

    -- LIMSv3_ALPHA_008 --> LIMSv3_ALPHA_009
    IF EXISTS(SELECT 1 FROM dbSettings WHERE dbSetting =  'dbCurrentVersion' AND `value` = 'LIMSv3_ALPHA_008') THEN

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'SCHEMA VERSION LIMSv3_ALPHA_008 DETECTED');

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'MODIFYING specimenRunsHistory.....');

        ALTER TABLE `specimenRunsHistory`
        ADD KEY `idxspecimenRunsHistoryRunId` (`RunId`) USING BTREE;

        ALTER TABLE `specimenRunsHistory`
        ADD KEY `idxspecimenRunsHistorySpecimenMethodsId` (`specimenMethodsId`) USING BTREE;

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'MODIFYING specimenRunsHistory..... Success');

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'UPDATING Database Version..... ');

        INSERT INTO dbVersionHistory
        (
            version,
            versionDate
        ) VALUES (
            'LIMSv3_ALPHA_009',
            NOW()
        );

        UPDATE dbSettings
        SET `value` = 'LIMSv3_ALPHA_009'
        WHERE `dbSetting` = 'dbCurrentVersion';

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'UPDATING Database Version..... Success');
     ELSE

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'SKIPPING VERSION LIMSv3_ALPHA_008 UPDATES');

     END IF;

    -- LIMSv3_ALPHA_009 --> LIMSv3_ALPHA_010
    IF EXISTS(SELECT 1 FROM dbSettings WHERE dbSetting =  'dbCurrentVersion' AND `value` = 'LIMSv3_ALPHA_009') THEN

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'SCHEMA VERSION LIMSv3_ALPHA_009 DETECTED');

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'CREATING analysisMethods.....');

        CREATE TABLE `analysisMethods`  (
          `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT,
          `methodName` VARCHAR(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
          `eventId` bigint(20) UNSIGNED NOT NULL,
          PRIMARY KEY (`id`)  USING BTREE,
          UNIQUE KEY `idxanalysisMethodsMethodName` (`methodName`)  USING BTREE,
          KEY `idxanalysisMethodsEventId` (`eventId`)  USING BTREE,
          CONSTRAINT `fkanalysisMethodsEventId` FOREIGN KEY (`eventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION
        ) ENGINE=InnoDB  DEFAULT CHARSET=utf8mb4;

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'CREATING specimenRunsHistory..... Success');

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'CREATING analysisMethodVersions.....');

        CREATE TABLE `analysisMethodVersions`  (
          `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT,
          `analysisMethodsId` int(11) UNSIGNED NOT NULL,
          `version` decimal(8,2) UNSIGNED NOT NULL,
          `active` bit(1) NOT NULL DEFAULT b'1',
          `eventId` bigint(20) UNSIGNED NOT NULL,
          PRIMARY KEY (`id`)  USING BTREE,
          UNIQUE KEY `analysisMethodsVersionsAnalsysMethodsId` (`analysisMethodsId`, `version`)  USING BTREE,
          KEY `idxanalysisMethodVersionsEventId` (`eventId`)  USING BTREE,
          CONSTRAINT `fkaanalysisMethodVersions` FOREIGN KEY (`analysisMethodsId`) REFERENCES `analysisMethods` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
          CONSTRAINT `fkanalysisMethodVersionsEventId` FOREIGN KEY (`eventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION
        ) ENGINE=InnoDB  DEFAULT CHARSET=utf8mb4;


        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'CREATING analysisMethodVersions..... Success');

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'CREATING analysisDataDefinition.....');

        CREATE TABLE `analysisDataDefinition`  (
          `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT,
          `analysisMethodVersionsId` int(11) UNSIGNED NOT NULL,
          `stepName` varchar(80) NULL,
          `definerType` varchar(80) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'data',
          `sequence` int(11) UNSIGNED NOT NULL,
          `value` varchar(80) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
          `dataType` varchar(80) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'varchar',
          `sigFig` int(11) UNSIGNED NULL,
          `eventId` bigint(20) UNSIGNED NOT NULL,
          PRIMARY KEY (`id`)  USING BTREE,
          UNIQUE KEY `idxanalysisDataDefinitionStepName` (`stepName`, `definerType`, `sequence`)  USING BTREE,
          KEY `idxanalysisDataDefinitionStepNameAnalysisMethodVersionsId` (`analysisMethodVersionsId`)  USING BTREE,
          KEY `idxanalysisDataDefinition` (`eventId`)  USING BTREE,
          CONSTRAINT `fkAnalyisisDataDefinitionanalysisMethodVersionsId` FOREIGN KEY (`analysisMethodVersionsId`) REFERENCES `analysisMethodVersions` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
          CONSTRAINT `fkAnalyisisDataDefinitionEventId` FOREIGN KEY (`eventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION
        ) ENGINE=InnoDB  DEFAULT CHARSET=utf8mb4;

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'CREATING analysisDataDefinition..... Success');

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'CREATING analysisDataRuns.....');

        CREATE TABLE `analysisDataRuns`  (
          `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT,
          `specimenRunsId` int(10) UNSIGNED NOT NULL,
          `currentContainerId` varchar(80) NOT NULL,
          `currentParentId` varchar(80) NULL,
          `currentParentPosition` varchar(20) NULL,
          `eventId` bigint(20) UNSIGNED NOT NULL,
          PRIMARY KEY (`id`),
          KEY `idxAnalysisDataRunsSpecimenRunsId` (`specimenRunsId`) USING BTREE,
          KEY `idxAnalysisDataRunsCurrentContainerId` (`currentContainerId`) USING BTREE,
          KEY `idxAnalysisDataRunsCurrentParentId` (`currentParentId`) USING BTREE,
          KEY `idxAnalysisDataRunsEventId` (`eventId`) USING BTREE,
          CONSTRAINT `fkAnalysisDataRunsSpecimenRunsId` FOREIGN KEY (`specimenRunsId`) REFERENCES `specimenRuns` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
          CONSTRAINT `fkAnalysisDataRunsCurrentContainerId` FOREIGN KEY (`currentContainerId`) REFERENCES `containers` (`containerId`) ON DELETE NO ACTION ON UPDATE NO ACTION,
          CONSTRAINT `fkAnalysisDataRunsCurrentParentId` FOREIGN KEY (`currentParentId`) REFERENCES `containers` (`containerId`) ON DELETE NO ACTION ON UPDATE NO ACTION,
          CONSTRAINT `fkAnalysisDataRunsEventId` FOREIGN KEY (`eventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION
        ) ENGINE=InnoDB  DEFAULT CHARSET=utf8mb4;

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'CREATING analysisDataDefinition..... Success');

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'CREATING analysisData.....');

        CREATE TABLE `analysisData`  (
          `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT,
          `analysisDataRunsId` int(11) UNSIGNED NOT NULL,
          `analysisDataDefinitionId` int(11) UNSIGNED NOT NULL,
          `varcharResult` varchar(80) NULL,
          `decimalResult` decimal(20, 6) NULL,
          `dateTimeResult` datetime(6) NULL,
          `eventId` bigint(20) UNSIGNED NOT NULL,
          PRIMARY KEY (`id`),
          KEY `idxAnalysisDataAnalysisDataRunsId` (`analysisDataRunsId`) USING BTREE,
          KEY `idxAnalysisDataAnalysisDataDefinitionId` (`analysisDataDefinitionId`) USING BTREE,
          KEY `idxAnalysisDataEventId` (`eventId`)  USING BTREE,
          CONSTRAINT `fkAnalysisDataAnalysisDataRunsId` FOREIGN KEY (`analysisDataRunsId`) REFERENCES `analysisDataRuns` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
          CONSTRAINT `fkAnalysisDataAnalysisDataDefinitionId` FOREIGN KEY (`analysisDataDefinitionId`) REFERENCES `analysisDataDefinition` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
          CONSTRAINT `fkAnalysisDataEventId` FOREIGN KEY (`eventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION
        ) ENGINE=InnoDB  DEFAULT CHARSET=utf8mb4;

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'CREATING analysisData..... Success');

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'CREATING analysisDataLimits.....');

        CREATE TABLE `analysisDataLimits`  (
          `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT,
          `analysisDataDefinitionId` int(20) UNSIGNED NOT NULL,
          `lowerLimit` decimal(20, 6) NULL,
          `upperLimit` decimal(20, 6) NULL,
          `discrete` varchar(80) NULL,
          `eventId` bigint(20) UNSIGNED NOT NULL,
          PRIMARY KEY (`id`) USING BTREE,
          UNIQUE INDEX `idxAnalysisDataLimitsAnalysisDataDefinitionId`(`analysisDataDefinitionId`) USING BTREE,
          KEY `idxAnalysisDataLimitsEventId` (`eventId`) USING BTREE,
          CONSTRAINT `fkAnalysisDataLimitsAnalysisDataDefinitionId` FOREIGN KEY (`analysisDataDefinitionId`) REFERENCES `analysisDataDefinition` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
          CONSTRAINT `fkAnalysisDataLimitsEventId` FOREIGN KEY (`eventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION
        ) ENGINE=InnoDB  DEFAULT CHARSET=utf8mb4;

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'CREATING analysisDataLimits..... Success');

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'CREATING analysisDataInterpretation.....');

        CREATE TABLE `analysisDataInterpretation`  (
          `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT,
          `analysisDataLimitsId` int(11) UNSIGNED NOT NULL,
          `belowLower` varchar(80) NOT NULL,
          `equalLower` varchar(80) NOT NULL,
          `betweenLowerUpper` varchar(80) NOT NULL,
          `equalUpper` varchar(80) NOT NULL,
          `aboveUpper` varchar(80) NOT NULL,
          `equalDiscrete` varchar(80) NOT NULL,
          `notEqualDiscrete` varchar(80) NOT NULL,
          `eventId` bigint(20) UNSIGNED NOT NULL,
          PRIMARY KEY (`id`) USING BTREE,
          KEY `idxAnalysisDataInterpretationAnalysisDataLimitsId` (`analysisDataLimitsId`) USING BTREE,
          KEY `idxAnalysisDataInterpretationEventId` (`eventId`) USING BTREE,
          CONSTRAINT `fkAnalysisDataInterpretationAnalysisDataLimitsId` FOREIGN KEY (`analysisDataLimitsId`) REFERENCES `analysisDataLimits` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
          CONSTRAINT `fkAnalysisDataInterpretationEventId` FOREIGN KEY (`eventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION
        ) ENGINE=InnoDB  DEFAULT CHARSET=utf8mb4;

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'CREATING analysisDataInterpretation..... Success');

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'CREATING analysisDataInterpretationCSSClass.....');

        CREATE TABLE `analysisDataInterpretationCSSClass`  (
          `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT,
          `analysisDataInterpretationId` int(11) UNSIGNED NOT NULL,
          `belowLower` varchar(20) NOT NULL,
          `equalLower` varchar(20) NOT NULL,
          `betweenLowerUpper` varchar(20) NOT NULL,
          `equalUpper` varchar(20) NOT NULL,
          `aboveUpper` varchar(20) NOT NULL,
          `equalDiscrete` varchar(20) NOT NULL,
          `notEqualDiscrete` varchar(20) NOT NULL,
          `eventId` bigint(20) UNSIGNED NOT NULL,
          PRIMARY KEY (`id`) USING BTREE,
          KEY `idxAnalysisDataInterpretationCSSClassAnalysisDataInterpretationI` (`analysisDataInterpretationId`) USING BTREE,
          KEY `idxAnalysisDataInterpretationCSSClassEventId` (`eventId`) USING BTREE,
          CONSTRAINT `fkAnalysisDataInterpretationCSSClassAnalysisDataInterpretationId` FOREIGN KEY (`analysisDataInterpretationId`) REFERENCES `analysisDataInterpretation` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
          CONSTRAINT `fkAnalysisDataInterpretationCSSClassEventId` FOREIGN KEY (`eventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION
        ) ENGINE=InnoDB  DEFAULT CHARSET=utf8mb4;

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'CREATING analysisDataInterpretationCSSClass..... Success');

        CREATE TABLE `analysisDataRunInterpretation`  (
          `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT,
          `analysisDataInterpretationId` int(11) UNSIGNED NOT NULL,
          `analysisDataId` int(11) UNSIGNED NOT NULL,
          `analysisDataRunId` int(11) UNSIGNED NOT NULL,
          `analysisDataDefinitionId` int(11) UNSIGNED NOT NULL,
          `calculatedInterpretation` varchar(80) NOT NULL,
          `actualInterpretation` varchar(80) NOT NULL,
          `eventId` bigint(20) UNSIGNED NOT NULL,
          PRIMARY KEY (`id`) USING BTREE,
          KEY `fkAnalysisDataRunInterpretationAnalysisDataInterpretationid` (`analysisDataInterpretationId`) USING BTREE,
          KEY `fkAnalysisDataRunInterpretationAnalysisDataId` (`analysisDataId`) USING BTREE,
          KEY `fkAnalysisDataRunInterpretationAnalysisDataRunId` (`analysisDataRunId`) USING BTREE,
          KEY `fkAnalysisDataRunInterpretationAnalysisDataDefinitionId` (`analysisDataDefinitionId`) USING BTREE,
          KEY `fkAnalysisDataRunInterpretationEventId` (`eventId`) USING BTREE,
          CONSTRAINT `fkAnalysisDataRunInterpretationAnalysisDataInterpretationid` FOREIGN KEY (`analysisDataInterpretationId`) REFERENCES `analysisDataInterpretation` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
          CONSTRAINT `fkAnalysisDataRunInterpretationAnalysisDataId` FOREIGN KEY (`analysisDataId`) REFERENCES `analysisData` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
          CONSTRAINT `fkAnalysisDataRunInterpretationAnalysisDataRunId` FOREIGN KEY (`analysisDataRunId`) REFERENCES `analysisDataRuns` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
          CONSTRAINT `fkAnalysisDataRunInterpretationAnalysisDataDefinitionId` FOREIGN KEY (`analysisDataDefinitionId`) REFERENCES `analysisDataDefinition` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
          CONSTRAINT `fkAnalysisDataRunInterpretationEventId` FOREIGN KEY (`eventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION
        ) ENGINE=InnoDB  DEFAULT CHARSET=utf8mb4;

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'CREATING analysisDataRunInterpretation..... Success');

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'UPDATING Database Version..... ');

        INSERT INTO dbVersionHistory
        (
            version,
            versionDate
        ) VALUES (
            'LIMSv3_ALPHA_010',
            NOW()
        );

        UPDATE dbSettings
        SET `value` = 'LIMSv3_ALPHA_010'
        WHERE `dbSetting` = 'dbCurrentVersion';

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'UPDATING Database Version..... Success');
     ELSE

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'SKIPPING VERSION LIMSv3_ALPHA_009 UPDATES');

     END IF;

    -- LIMSv3_ALPHA_010 --> LIMSv3_ALPHA_011
    IF EXISTS(SELECT 1 FROM dbSettings WHERE dbSetting =  'dbCurrentVersion' AND `value` = 'LIMSv3_ALPHA_010') THEN

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'SCHEMA VERSION LIMSv3_ALPHA_010 DETECTED');

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'CREATING countries.....');

        CREATE TABLE `countries` (
          `id` int(11) NOT NULL AUTO_INCREMENT,
          `country_code` varchar(2) NOT NULL DEFAULT '',
          `country_name` varchar(100) NOT NULL DEFAULT '',
          PRIMARY KEY (`id`),
          KEY idxCountriesCountry_Code (`country_code`),
          KEY idxCountriesCountry_Name (`country_name`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'CREATING containerNotes..... Success');

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'MODIFYING state.....');

        ALTER TABLE `state`
        DROP COLUMN `circuit_court`,
        DROP COLUMN `census_division_name`,
        DROP COLUMN `census_division`,
        DROP COLUMN `census_region_name`,
        DROP COLUMN `census_region`,
        DROP COLUMN `standard_federal_region`,
        DROP COLUMN `assoc_press`,
        DROP COLUMN `fips_state`,
        DROP COLUMN `notes`,
        DROP COLUMN `occupied`,
        DROP COLUMN `status`,
        DROP COLUMN `sort`,
        DROP COLUMN `type`,
        DROP COLUMN `country`,
        DROP COLUMN `abbreviation`,
        ADD COLUMN `code` VARCHAR(4) NOT NULL AFTER `id`,
        DROP INDEX `idxstateName` ,
        ADD UNIQUE INDEX `idxstateName` USING BTREE (`name` ASC),
        ADD INDEX `idxstateCode` (`code` ASC);

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'MODIFYING state..... Success');

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'UPDATING Database Version..... ');

        INSERT INTO dbVersionHistory
        (
            version,
            versionDate
        ) VALUES (
            'LIMSv3_ALPHA_011',
            NOW()
        );

        UPDATE dbSettings
        SET `value` = 'LIMSv3_ALPHA_011'
        WHERE `dbSetting` = 'dbCurrentVersion';

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'UPDATING Database Version..... Success');
      ELSE

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'SKIPPING VERSION LIMSv3_ALPHA_010 UPDATES');

      END IF;


    -- LIMSv3_ALPHA_011 --> LIMSv3_ALPHA_012
    IF EXISTS(SELECT 1 FROM dbSettings WHERE dbSetting =  'dbCurrentVersion' AND `value` = 'LIMSv3_ALPHA_011') THEN

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'SCHEMA VERSION LIMSv3_ALPHA_011 DETECTED');

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'MODIFYING requestForms.....');

        ALTER TABLE requestForms
        ADD COLUMN department VARCHAR(100) AFTER mrnFacility;

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'MODIFYING requestForms..... Success');

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'MODIFYING requestFormsHistory.....');

        ALTER TABLE requestFormsHistory
        ADD COLUMN department VARCHAR(100) AFTER mrnFacility;

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'MODIFYING requestFormsHistory..... Success');

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'UPDATING Database Version..... ');

        INSERT INTO dbVersionHistory
        (
            version,
            versionDate
        ) VALUES (
            'LIMSv3_ALPHA_012',
            NOW()
        );

        UPDATE dbSettings
        SET `value` = 'LIMSv3_ALPHA_012'
        WHERE `dbSetting` = 'dbCurrentVersion';

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'UPDATING Database Version..... Success');
      ELSE

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'SKIPPING VERSION LIMSv3_ALPHA_011 UPDATES');

      END IF;


    -- LIMSv3_ALPHA_012 --> LIMSv3_ALPHA_013
    IF EXISTS(SELECT 1 FROM dbSettings WHERE dbSetting =  'dbCurrentVersion' AND `value` = 'LIMSv3_ALPHA_012') THEN

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'SCHEMA VERSION LIMSv3_ALPHA_012 DETECTED');

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'MODIFYING analysisMethods.....');

        ALTER TABLE `analysisMethods`
        ADD COLUMN `methodDescription` VARCHAR(255) NULL AFTER `methodName`;

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'MODIFYING analysisMethods..... Success');

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'CREATING analysisDataModifierOptions.....');

        CREATE TABLE `analysisDataModifierOptions` (
        `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
        `analysisDataDefinitionId` int(11) unsigned NOT NULL,
        `modifierOptionName` varchar(80) DEFAULT NULL,
        `eventId` bigint(20) unsigned NOT NULL,
        PRIMARY KEY (`id`) USING BTREE,
        UNIQUE KEY `idxanalysisDataModifierOptionsAnalysisDataDefinitionId` (`analysisDataDefinitionId`, `modifierOptionName`),
        KEY `idxanalysisDataModifierOptionsModifierOptionName` (`modifierOptionName`),
        KEY `idxanalysisDataModifierOptionsEventId` (`eventId`),
        CONSTRAINT `fkanalysisDataModiferOptionsAnalysisDataDefinitionId` FOREIGN KEY (`analysisDataDefinitionId`) REFERENCES `analysisDataDefinition` (`id`),
        CONSTRAINT `fkanalysisDataModiferOptionsEventId` FOREIGN KEY (`eventId`) REFERENCES `events` (`eventId`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'CREATING analysisDataModifierOptions..... Success');

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'UPDATING Database Version..... ');

        INSERT INTO dbVersionHistory
        (
            version,
            versionDate
        ) VALUES (
            'LIMSv3_ALPHA_013',
            NOW()
        );

        UPDATE dbSettings
        SET `value` = 'LIMSv3_ALPHA_013'
        WHERE `dbSetting` = 'dbCurrentVersion';

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'UPDATING Database Version..... Success');
      ELSE

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'SKIPPING VERSION LIMSv3_ALPHA_012 UPDATES');

      END IF;


    -- LIMSv3_ALPHA_013 --> LIMSv3_ALPHA_014
    IF EXISTS(SELECT 1 FROM dbSettings WHERE dbSetting =  'dbCurrentVersion' AND `value` = 'LIMSv3_ALPHA_013') THEN

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'SCHEMA VERSION LIMSv3_ALPHA_013 DETECTED');

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'CREATING poolRuns.....');

        CREATE TABLE `poolRuns` (
          `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
          `poolRunId` varchar(80) DEFAULT NULL,
          `runType` varchar(80) NOT NULL DEFAULT 'workflow',
          `currentContainerId` varchar(80) NOT NULL,
          `currentParentId` varchar(80) DEFAULT NULL,
          `currentParentPosition` varchar(20) DEFAULT NULL,
          `completedResult` varchar(80) DEFAULT NULL,
          `completedEventId` bigint(20) unsigned DEFAULT NULL,
          `parentWorkflowPoolRunId` int(11) unsigned NOT NULL DEFAULT '0',
          `eventId` bigint(20) unsigned DEFAULT NULL,
          `modifier` varchar(80) NOT NULL DEFAULT 'self',
          `lastUpdatedEventId` bigint(20) unsigned NOT NULL,
          PRIMARY KEY (`id`) USING BTREE,
          UNIQUE KEY `idxspecimenRunsRunId` (`poolRunId`) USING BTREE,
          KEY `idxspecimenRunsCurrentContainerId` (`currentContainerId`) USING BTREE,
          KEY `idxspeciemnRunsCurrentParentId` (`currentParentId`) USING BTREE,
          KEY `idxspecimenRunsCompletedEventId` (`completedEventId`) USING BTREE,
          KEY `idxspecimenRunsEventId` (`eventId`) USING BTREE,
          KEY `idxspecimenRunsLastUpdatedEventId` (`lastUpdatedEventId`) USING BTREE,
          CONSTRAINT `fkpoolRunsCompletedEventId` FOREIGN KEY (`completedEventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION,
          CONSTRAINT `fkpoolRunsCurrentParentId` FOREIGN KEY (`currentParentId`) REFERENCES `containers` (`containerId`) ON DELETE NO ACTION ON UPDATE NO ACTION,
          CONSTRAINT `fkpoolRunsCurrentContainerId` FOREIGN KEY (`currentContainerId`) REFERENCES `containers` (`containerId`) ON DELETE NO ACTION ON UPDATE NO ACTION,
          CONSTRAINT `fkpoolRunsEventId` FOREIGN KEY (`eventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION,
          CONSTRAINT `fkpoolRunsLastUpdatedEventId` FOREIGN KEY (`lastUpdatedEventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'CREATING poolRuns..... Success');

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'CREATING poolRunsHistory.....');

        CREATE TABLE `poolRunsHistory` (
          `id` int(11) unsigned NOT NULL,
          `runId` varchar(80) DEFAULT NULL,
          `runType` varchar(80) NOT NULL,
          `currentContainerId` varchar(80) NOT NULL,
          `currentParentId` varchar(80) DEFAULT NULL,
          `currentParentPosition` varchar(20) DEFAULT NULL,
          `completedResult` varchar(80) DEFAULT NULL,
          `completedEventId` bigint(20) unsigned DEFAULT NULL,
          `parentWorkflowPoolRunId` int(11) unsigned NOT NULL,
          `eventId` bigint(20) unsigned DEFAULT NULL,
          `modifier` varchar(80) NOT NULL,
          `lastUpdatedEventId` bigint(20) unsigned NOT NULL,
          `historyStartDate` datetime DEFAULT NULL,
          `historyEndDate` datetime DEFAULT NULL,
          `historyAction` varchar(20) DEFAULT NULL,
          `historyUser` varchar(85) DEFAULT NULL,
          `historyId` int(11) unsigned NOT NULL AUTO_INCREMENT,
          PRIMARY KEY (`historyId`) USING BTREE,
          KEY `idxspecimenRunsHistoryId` (`id`) USING BTREE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'CREATING poolRunsHistory..... Success');

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'MODIFYING analysisDataRuns.....');

        ALTER TABLE `analysisDataRuns`
        DROP FOREIGN KEY `fkAnalysisDataRunsSpecimenRunsId`;

        ALTER TABLE `analysisDataRuns`
        CHANGE COLUMN `specimenRunsId` `specimenRunsId` INT(11) UNSIGNED NOT NULL ;

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'MODIFYING analysisDataRuns..... Success');

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'MODIFYING specimenRuns.....');

        ALTER TABLE `specimenRuns`
        CHANGE COLUMN `id` `id` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
        CHANGE COLUMN `parentWorkflowSpecimenRunId` `parentWorkflowSpecimenRunId` INT(11) UNSIGNED NOT NULL DEFAULT '0' ;

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'MODIFYING specimenRuns..... Success');

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'MODIFYING analysisDataRuns.....');

        ALTER TABLE `analysisDataRuns`
        ADD CONSTRAINT `fkAnalysisDataRunsSpecimenRunsId`
        FOREIGN KEY (`specimenRunsId`)
        REFERENCES `specimenRuns` (`id`)
        ON DELETE NO ACTION
        ON UPDATE NO ACTION;

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'MODIFYING analysisDataRuns..... Success');

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'MODIFYING specimenRunsHistory.....');

        ALTER TABLE `specimenRunsHistory`
        CHANGE COLUMN `id` `id` INT(11) UNSIGNED NOT NULL ,
        CHANGE COLUMN `specimenMethodsId` `specimenMethodsId` INT(11) UNSIGNED NOT NULL ,
        CHANGE COLUMN `parentWorkflowSpecimenRunId` `parentWorkflowSpecimenRunId` INT(11) UNSIGNED NOT NULL DEFAULT '0' ;

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'MODIFYING specimenRunsHistory..... Success');

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'UPDATING Database Version..... ');

        INSERT INTO dbVersionHistory
        (
            version,
            versionDate
        ) VALUES (
            'LIMSv3_ALPHA_014',
            NOW()
        );

        UPDATE dbSettings
        SET `value` = 'LIMSv3_ALPHA_014'
        WHERE `dbSetting` = 'dbCurrentVersion';

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'UPDATING Database Version..... Success');
      ELSE

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'SKIPPING VERSION LIMSv3_ALPHA_013 UPDATES');

      END IF;

    -- LIMSv3_ALPHA_014 --> LIMSv3_ALPHA_015
    IF EXISTS(SELECT 1 FROM dbSettings WHERE dbSetting =  'dbCurrentVersion' AND `value` = 'LIMSv3_ALPHA_014') THEN

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'SCHEMA VERSION LIMSv3_ALPHA_014 DETECTED');

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'MODIFYING cmaResults.....');

        ALTER TABLE cmaResults
        DROP INDEX  `idxcmaResultsRawResultId`,
        DROP FOREIGN KEY `fkcmaResultsRawResultId`,
        MODIFY COLUMN rawResultId VARCHAR(80);

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'MODIFYING cmaResults..... Success');

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'CREATING hl7Failures.....');

        CREATE TABLE `hl7Failures` (
        `id` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
        `fileName` VARCHAR(80) NOT NULL,
        `orignalPath` TEXT NOT NULL,
        `failPath` TEXT NOT NULL,
        `exceptionText` TEXT NOT NULL,
        `failTimeStamp` DATETIME NOT NULL DEFAULT NOW(),
        `failEventId` BIGINT(20) UNSIGNED NOT NULL,
        `remediationEventId` BIGINT(20) UNSIGNED NULL,
        `remediationComment` VARCHAR(45) NULL,
        `remediationPath` TEXT NULL,
        `remediated` BIT(1) NULL DEFAULT b'0',
        PRIMARY KEY (`id`),
        INDEX `idxhl7FailuresFileName` (`fileName` ASC),
        INDEX `idxhl7FailuresFailEventId` (`failEventId` ASC),
        INDEX `idxhl7FailuresRemediationEventId` (`remediationEventId` ASC)
        ) ENGINE=InnoDB  DEFAULT CHARSET=utf8mb4;

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'CREATING hl7Failures..... Success');

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'UPDATING Database Version..... ');

        INSERT INTO dbVersionHistory
        (
            version,
            versionDate
        ) VALUES (
            'LIMSv3_ALPHA_015',
            NOW()
        );

        UPDATE dbSettings
        SET `value` = 'LIMSv3_ALPHA_015'
        WHERE `dbSetting` = 'dbCurrentVersion';

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'UPDATING Database Version..... Success');
      ELSE

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'SKIPPING VERSION LIMSv3_ALPHA_014 UPDATES');

      END IF;


    -- LIMSv3_ALPHA_015 --> LIMSv3_ALPHA_016
    IF EXISTS(SELECT 1 FROM dbSettings WHERE dbSetting =  'dbCurrentVersion' AND `value` = 'LIMSv3_ALPHA_015') THEN

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'SCHEMA VERSION LIMSv3_ALPHA_015 DETECTED');

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'MODIFYING analysisDataDefinition.....');

        ALTER TABLE `analysisDataDefinition`
        DROP INDEX  `idxanalysisDataDefinitionStepNameAnalysisMethodVersionsId`,
        ADD INDEX `idxanalysisDataDefinitionStepNameAnalysisMethodVersionsId` (`analysisMethodVersionsId` ASC, `stepName` ASC);

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'MODIFYING analysisDataDefinition..... Success');

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'CREATING analysisDataModifierLinks.....');

        CREATE TABLE `analysisDataModifierLinks` (
        `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
        `modifierLinkId` int(11) UNSIGNED NOT NULL,
        `methodVersionId` int(11) UNSIGNED NOT NULL,
        `modifierOptionId` int(11) UNSIGNED NOT NULL,
        `eventId` bigint(20) UNSIGNED NOT NULL,
        PRIMARY KEY (`id`),
        KEY `idxanalysisDataModifierLinksEventId` (`eventId`) USING BTREE,
        KEY `idxanalysisDataModifierLinksModifierLinkId` (`modifierLinkId`) USING BTREE,
        KEY `idxanalysisDataModifierLinksMethodVersionId` (`methodVersionId`) USING BTREE,
        KEY `idxanalysisDataModifierLinksModifierOptionId` (`modifierOptionId`) USING BTREE,
        CONSTRAINT `fkanalysisDataModifierLinksEventId` FOREIGN KEY (`eventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION,
        CONSTRAINT `fkanalysisDataModifierMethodVersionId` FOREIGN KEY (`methodVersionId`) REFERENCES `analysisMethodVersions` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
        CONSTRAINT `fkanalysisDataModifierModifierOptionId` FOREIGN KEY (`modifierOptionId`) REFERENCES `analysisDataModifierOptions` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION

        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'CREATING analysisDataModifierLinks..... Success');

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'CREATING FISH Tables.....');

        CREATE TABLE `fishIscn` (
      `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT,
      `probe` varchar(50) NOT NULL,
      `displayValue` varchar(255) NOT NULL DEFAULT '',
      `result` varchar(255) NOT NULL DEFAULT '',
      `interpretation` varchar(1000) NOT NULL DEFAULT '',
      `iscn` varchar(1000) NOT NULL DEFAULT '',
      `comment` varchar(1000) DEFAULT NULL,
      `status` varchar(50) NOT NULL DEFAULT 'FALSE',
      `eventId` bigint(20) NOT NULL,
      PRIMARY KEY (`id`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

    CREATE TABLE `fishImages` (
      `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
      `fishCaseResultsId` int(11) DEFAULT NULL,
      `fileName` varchar(200) DEFAULT NULL,
      `location` varchar(200) DEFAULT NULL,
      `includeInReport` bit(1) DEFAULT NULL,
      `eventId` bigint(20) UNSIGNED NOT NULL,
      PRIMARY KEY (`id`),
      KEY `fishCaseResultsId` (`fishCaseResultsId`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

    CREATE TABLE `fishCaseResults` (
      `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
      `requestSpecimenId` int(11) DEFAULT NULL,
      `slideLabel` varchar(200) DEFAULT NULL,
      `slideName` varchar(200) DEFAULT NULL,
      `cellLabel` varchar(200) DEFAULT NULL,
      `region` varchar(25) DEFAULT NULL,
      `probeName` varchar(200) DEFAULT NULL,
      `className` varchar(200) DEFAULT NULL,
      `coordX` varchar(200) DEFAULT NULL,
      `coordY` varchar(200) DEFAULT NULL,
      `slideResults` varchar(1000) DEFAULT NULL,
      `region1Results` varchar(1000) DEFAULT NULL,
      `region2Results` varchar(1000) DEFAULT NULL,
      `iscn` varchar(800) DEFAULT NULL,
      `comments` varchar(1000) DEFAULT NULL,
      `eventId` bigint(20) DEFAULT NULL,
      PRIMARY KEY (`id`),
      KEY `requestSpecimenId` (`requestSpecimenId`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

    CREATE TABLE `fishCaseResultsFinal` (
      `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
      `reportId` varchar(200) DEFAULT NULL,
      `requestSpecimenId` varchar(200) DEFAULT NULL,
      `probeName` varchar(200) DEFAULT NULL,
      `probeDisplay` varchar(200) DEFAULT NULL,
      `interpretation` varchar(1000) DEFAULT NULL,
      `iscn` varchar(1000) DEFAULT NULL,
      `slideResults` varchar(1000) DEFAULT NULL,
      `result` varchar(10000) DEFAULT NULL,
      `reportOrder` varchar(11) DEFAULT NULL,
      `slideName` varchar(200) DEFAULT NULL,
      `region` varchar(200) DEFAULT NULL,
      `interpretationComments` varchar(1000) DEFAULT NULL,
      `selectedInterpretation` varchar(200) DEFAULT NULL,
      `comments` varchar(200) DEFAULT NULL,
      `fishComments` varchar(500) DEFAULT NULL,
      `eventId` bigint(20) UNSIGNED,
      PRIMARY KEY (`id`),
      KEY `reportId` (`reportId`),
      KEY `reportId_2` (`reportId`,`probeName`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

    CREATE TABLE `fishCaseResultsFinalHistory` (
      `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
      `reportId` varchar(200) DEFAULT NULL,
      `requestSpecimenId` varchar(200) DEFAULT NULL,
      `probeName` varchar(200) DEFAULT NULL,
      `probeDisplay` varchar(200) DEFAULT NULL,
      `interpretation` varchar(1000) DEFAULT NULL,
      `iscn` varchar(1000) DEFAULT NULL,
      `slideResults` varchar(1000) DEFAULT NULL,
      `result` varchar(10000) DEFAULT NULL,
      `reportOrder` varchar(11) DEFAULT NULL,
      `slideName` varchar(200) DEFAULT NULL,
      `region` varchar(200) DEFAULT NULL,
      `interpretationComments` varchar(1000) DEFAULT NULL,
      `selectedInterpretation` varchar(200) DEFAULT NULL,
      `comments` varchar(200) DEFAULT NULL,
      `fishComments` varchar(500) DEFAULT NULL,
      `eventId` bigint(20) NOT NULL,
      PRIMARY KEY (`id`),
      KEY `reportId` (`reportId`),
      KEY `reportId_2` (`reportId`,`probeName`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

    CREATE TABLE `fishProbeCutOff` (
      `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
      `probe` varchar(200) NOT NULL,
      `signalPattern01` varchar(100) DEFAULT NULL,
      `signalPattern02` varchar(100) DEFAULT NULL,
      `signalPattern03` varchar(100) DEFAULT NULL,
      `signalPattern04` varchar(100) DEFAULT NULL,
      `signalPattern05` varchar(100) DEFAULT NULL,
      `signalPattern06` varchar(100) DEFAULT NULL,
      `signalPattern07` varchar(100) DEFAULT NULL,
      `signalPattern08` varchar(100) DEFAULT NULL,
      `signalPattern09` varchar(100) DEFAULT NULL,
      `signalPattern10` varchar(100) DEFAULT NULL,
      `signalPattern11` varchar(100) DEFAULT NULL,
      `signalPattern12` varchar(100) DEFAULT NULL,
      `signalPattern13` varchar(100) DEFAULT NULL,
      `signalPattern14` varchar(100) DEFAULT NULL,
      `signalPattern15` varchar(100) DEFAULT NULL,
      `cutOffValue01` varchar(100) DEFAULT NULL,
      `cutOffValue02` varchar(100) DEFAULT NULL,
      `cutOffValue03` varchar(100) DEFAULT NULL,
      `cutOffValue04` varchar(100) DEFAULT NULL,
      `cutOffValue05` varchar(100) DEFAULT NULL,
      `cutOffValue06` varchar(100) DEFAULT NULL,
      `cutOffValue07` varchar(100) DEFAULT NULL,
      `cutOffValue08` varchar(100) DEFAULT NULL,
      `cutOffValue09` varchar(100) DEFAULT NULL,
      `cutOffValue10` varchar(100) DEFAULT NULL,
      `cutOffValue11` varchar(100) DEFAULT NULL,
      `cutOffValue12` varchar(100) DEFAULT NULL,
      `cutOffValue13` varchar(100) DEFAULT NULL,
      `cutOffValue14` varchar(100) DEFAULT NULL,
      `cutOffValue15` varchar(100) DEFAULT NULL,
      PRIMARY KEY (`id`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'CREATING FISH Tables..... SUCCESS');

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'UPDATING Database Version..... ');

        INSERT INTO dbVersionHistory
        (
            version,
            versionDate
        ) VALUES (
            'LIMSv3_ALPHA_016',
            NOW()
        );

        UPDATE dbSettings
        SET `value` = 'LIMSv3_ALPHA_016'
        WHERE `dbSetting` = 'dbCurrentVersion';

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'UPDATING Database Version..... Success');
      ELSE

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'SKIPPING VERSION LIMSv3_ALPHA_015 UPDATES');

      END IF;

    -- LIMSv3_ALPHA_016 --> LIMSv3_ALPHA_017
    IF EXISTS(SELECT 1 FROM dbSettings WHERE dbSetting =  'dbCurrentVersion' AND `value` = 'LIMSv3_ALPHA_016') THEN

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'SCHEMA VERSION LIMSv3_ALPHA_016 DETECTED');

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'MODIFYING analysisData.....');

        ALTER TABLE `analysisData`
        ADD COLUMN `analysisDataModifierLinkId` INT(11) NULL AFTER `analysisDataRunsId`;

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'MODIFYING analysisData..... Success');

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'MODIFYING analysisDataDefinition.....');

        ALTER TABLE `analysisDataDefinition`
        ADD COLUMN `report` VARCHAR(80) NULL AFTER `sigFig`;

        ALTER TABLE  `analysisDataDefinition`
         DROP INDEX idxanalysisDataDefinitionStepName;

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'MODIFYING analysisDataDefinition.....  Success');

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'MODIFYING analysisDataInterpretation.....');

        ALTER TABLE analysisDataInterpretation
        MODIFY belowLower VARCHAR(80) NULL,
        MODIFY equalLower VARCHAR(80) NULL,
        MODIFY betweenLowerUpper VARCHAR(80) NULL,
        MODIFY equalUpper VARCHAR(80) NULL,
        MODIFY aboveUpper VARCHAR(80) NULL,
        MODIFY equalDiscrete VARCHAR(80) NULL,
        MODIFY notEqualDiscrete VARCHAR(80) NULL;

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'MODIFYING analysisDataInterpretation.....  Success');

        ALTER TABLE analysisDataInterpretationCSSClass
        MODIFY belowLower VARCHAR(20) NULL,
        MODIFY equalLower VARCHAR(20) NULL,
        MODIFY betweenLowerUpper VARCHAR(20) NULL,
        MODIFY equalUpper VARCHAR(20) NULL,
        MODIFY aboveUpper VARCHAR(20) NULL,
        MODIFY equalDiscrete VARCHAR(20) NULL,
        MODIFY notEqualDiscrete VARCHAR(20) NULL;

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'MODIFYING analysisDataInterpretationCSSClass.....');

        ALTER TABLE analysisDataInterpretationCSSClass
        MODIFY belowLower VARCHAR(20) NULL,
        MODIFY equalLower VARCHAR(20) NULL,
        MODIFY betweenLowerUpper VARCHAR(20) NULL,
        MODIFY equalUpper VARCHAR(20) NULL,
        MODIFY aboveUpper VARCHAR(20) NULL,
        MODIFY equalDiscrete VARCHAR(20) NULL,
        MODIFY notEqualDiscrete VARCHAR(20) NULL;

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'MODIFYING analysisDataInterpretationCSSClass.....  Success');

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'MODIFYING analysisData.....');

        ALTER TABLE `analysisData`
        ADD COLUMN `dataLinkId` int(11) UNSIGNED NOT NULL AFTER `dateTimeResult`,
        ADD KEY idxanalysisDataDataLinkId (dataLinkId) USING BTREE;

        ALTER TABLE `analysisData`
        DROP COLUMN `analysisDataModifierLinkId`;

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'MODIFYING analysisData.....  Success');

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'UPDATING Database Version..... ');

        INSERT INTO dbVersionHistory
        (
            version,
            versionDate
        ) VALUES (
            'LIMSv3_ALPHA_017',
            NOW()
        );

        UPDATE dbSettings
        SET `value` = 'LIMSv3_ALPHA_017'
        WHERE `dbSetting` = 'dbCurrentVersion';

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'UPDATING Database Version..... Success');
      ELSE

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'SKIPPING VERSION LIMSv3_ALPHA_016 UPDATES');

      END IF;

      -- LIMSv3_ALPHA_017 --> LIMSv3_ALPHA_018
    IF EXISTS(SELECT 1 FROM dbSettings WHERE dbSetting =  'dbCurrentVersion' AND `value` = 'LIMSv3_ALPHA_017') THEN

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'SCHEMA VERSION LIMSv3_ALPHA_017 DETECTED');

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'MODIFYING cmaGeneResults.....');

        ALTER TABLE `cmaGeneResults`
        DROP FOREIGN KEY `fkcmaGeneResultsRefEventId`;

        ALTER TABLE `cmaGeneResults`
        MODIFY refEventId BIGINT(20) UNSIGNED NULL;

        ALTER TABLE `cmaGeneResults`
        ADD CONSTRAINT `fkcmaGeneResultsRefEventId` FOREIGN KEY (`refEventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION;

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'MODIFYING cmaGeneResults..... Success');

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'UPDATING Database Version..... ');

        INSERT INTO dbVersionHistory
        (
            version,
            versionDate
        ) VALUES (
            'LIMSv3_ALPHA_018',
            NOW()
        );

        UPDATE dbSettings
        SET `value` = 'LIMSv3_ALPHA_018'
        WHERE `dbSetting` = 'dbCurrentVersion';

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'UPDATING Database Version..... Success');
      ELSE

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'SKIPPING VERSION LIMSv3_ALPHA_017 UPDATES');

      END IF;

      -- LIMSv3_ALPHA_018 --> LIMSv3_ALPHA_019
    IF EXISTS(SELECT 1 FROM dbSettings WHERE dbSetting =  'dbCurrentVersion' AND `value` = 'LIMSv3_ALPHA_018') THEN

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'SCHEMA VERSION LIMSv3_ALPHA_018 DETECTED');

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'MODIFYING specimenMethods.....');

        ALTER TABLE `specimenMethods`
        ADD COLUMN `panelCode` varchar(80) NULL AFTER `requestSpecimensId`;

        ALTER TABLE `specimenMethods`
        ADD INDEX `idxspecimenMethodsPanelCode`(`panelCode`);

        ALTER TABLE `specimenMethods`
        DROP FOREIGN KEY `fkspecimenMethodsPanelCode`;

        ALTER TABLE `specimenMethods`
        ADD CONSTRAINT `fkspecimenMethodsTestCode` FOREIGN KEY (`testCode`) REFERENCES `tests` (`testCode`) ON DELETE NO ACTION ON UPDATE NO ACTION,
        ADD CONSTRAINT `fkspecimenMethodsPanelCode` FOREIGN KEY (`panelCode`) REFERENCES `panels` (`panelCode`) ON DELETE NO ACTION ON UPDATE NO ACTION;

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'MODIFYING specimenMethods..... Success');

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'MODIFYING specimenMethodsHistory.....');

        ALTER TABLE `specimenMethodsHistory`
        ADD COLUMN `panelCode` varchar(80) NULL AFTER `requestSpecimensId`;

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'MODIFYING specimenMethodsHistory..... Success');

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'MODIFYING routingMatrix.....');

        ALTER TABLE routingMatrix
        ADD COLUMN panelCode varchar(80) NULL AFTER specimenType;

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'MODIFYING routingMatrix..... Success');

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'CREATING controlRuns.....');

        CREATE TABLE `controlRuns`  (
        `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT,
        `controlRunId` varchar(80) NOT NULL,
        `runType` varchar(80) NOT NULL,
        `controlId` varchar(80) NOT NULL,
        `currentContainerId` varchar(80) NOT NULL,
        `currentParentId` varchar(80) NULL,
        `currentParentPosition` varchar(20) NULL,
        `parentWorkflowSpecimenRunId` varchar(80) NOT NULL,
        `completedResult` varchar(80) NULL,
        `completedEventId` bigint(20) UNSIGNED NULL,
        `eventId` bigInt(20) UNSIGNED NOT NULL,
        `modifier` varchar(80) NOT NULL,
        `lastUpdatedEventId` bigint(20) UNSIGNED NULL,
        PRIMARY KEY (`id`),
        CONSTRAINT `fkcontrolRunsCompletedEventId` FOREIGN KEY (`completedEventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION,
        CONSTRAINT `fkscontrolRunsCurrentParentId` FOREIGN KEY (`currentParentId`) REFERENCES `containers` (`containerId`) ON DELETE NO ACTION ON UPDATE NO ACTION,
        CONSTRAINT `fkcontrolRunsCurrentTubeId` FOREIGN KEY (`currentContainerId`) REFERENCES `containers` (`containerId`) ON DELETE NO ACTION ON UPDATE NO ACTION,
        CONSTRAINT `fkcontrolRunsEventId` FOREIGN KEY (`eventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION,
        CONSTRAINT `fkcontrolRunsLastUpdatedEventId` FOREIGN KEY (`lastUpdatedEventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION,
        CONSTRAINT `fkcontrolRunsControlRunId` FOREIGN KEY (`controlRunId`) REFERENCES `containers` (`containerId`) ON DELETE NO ACTION ON UPDATE NO ACTION,
        CONSTRAINT `fkcontrolRunsControlId` FOREIGN KEY (`controlId`) REFERENCES `controls` (`controlId`) ON DELETE NO ACTION ON UPDATE NO ACTION
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'CREATING controlRuns..... Success');

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'CREATING controlRunsHistory.....');

        CREATE TABLE `controlRunsHistory` (
        `id` int(11) unsigned NOT NULL,
        `controlRunId` varchar(80) NOT NULL,
        `runType` varchar(80) NOT NULL,
        `controlId` varchar(80) NOT NULL,
        `currentContainerId` varchar(80) NOT NULL,
        `currentParentId` varchar(80) NULL,
        `currentParentPosition` varchar(20) NULL,
        `parentWorkflowSpecimenRunId` varchar(80) NOT NULL,
        `completedResult` varchar(80) NULL,
        `completedEventId` bigint(20) UNSIGNED NULL,
        `eventId` bigInt(20) UNSIGNED NOT NULL,
        `modifier` varchar(80) NOT NULL,
        `lastUpdatedEventId` bigint(20) UNSIGNED NULL,
        `historyStartDate` datetime DEFAULT NULL,
        `historyEndDate` datetime DEFAULT NULL,
        `historyAction` varchar(20) DEFAULT NULL,
        `historyUser` varchar(85) DEFAULT NULL,
        `historyId` int(11) unsigned NOT NULL AUTO_INCREMENT,
        PRIMARY KEY (`historyId`) USING BTREE,
        KEY `idxspecimenRunsHistoryId` (`id`) USING BTREE,
        KEY `idxspecimenRunsHistoryRunId` (`controlRunId`) USING BTREE,
        KEY `idxspecimenRunsHistoryControlId` (`controlId`) USING BTREE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'CREATING controlRunsHistory..... Success');

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'CREATING specimenControlLinkage.....');

        CREATE TABLE `specimenControlLinkage`  (
        `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT,
        `specimenRunId` varchar(80) NOT NULL,
        `controlRunId` varchar(80) NOT NULL,
        `groupingContainerId` varchar(80) NOT NULL,
        `eventId` bigInt(20) UNSIGNED NOT NULL,
        PRIMARY KEY (`id`),
        CONSTRAINT `fkControlLinkSpecimenRunId` FOREIGN KEY (`specimenRunId`) REFERENCES `specimenRuns` (`runId`) ON DELETE NO ACTION ON UPDATE NO ACTION,
        CONSTRAINT `fkControlLinkControlRunId` FOREIGN KEY (`controlRunId`) REFERENCES `controlRuns` (`controlRunId`) ON DELETE NO ACTION ON UPDATE NO ACTION,
        CONSTRAINT `fkControlLinkGrouptingContainerId` FOREIGN KEY (`groupingContainerId`) REFERENCES `containers` (`containerId`) ON DELETE NO ACTION ON UPDATE NO ACTION,
        CONSTRAINT `fkControlLinkEventId` FOREIGN KEY (`eventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'CREATING specimenControlLinkage..... Success');

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'UPDATING Database Version..... ');

        INSERT INTO dbVersionHistory
        (
            version,
            versionDate
        ) VALUES (
            'LIMSv3_ALPHA_019',
            NOW()
        );

        UPDATE dbSettings
        SET `value` = 'LIMSv3_ALPHA_019'
        WHERE `dbSetting` = 'dbCurrentVersion';

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'UPDATING Database Version..... Success');
      ELSE

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'SKIPPING VERSION LIMSv3_ALPHA_018 UPDATES');

      END IF;

      -- LIMSv3_ALPHA_019 --> LIMSv3_ALPHA_020
    IF EXISTS(SELECT 1 FROM dbSettings WHERE dbSetting =  'dbCurrentVersion' AND `value` = 'LIMSv3_ALPHA_019') THEN

       INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'SCHEMA VERSION LIMSv3_ALPHA_019 DETECTED');



       INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'Modifying specimenMethods testCode column..... ');

       ALTER TABLE specimenMethods
            MODIFY COLUMN `testCode` varchar(80) DEFAULT NULL AFTER `panelCode`;

       INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'Modifying specimenMethodsHistory testCode column..... ');
       ALTER TABLE specimenMethodsHistory
            MODIFY COLUMN `testCode` varchar(80)  DEFAULT NULL AFTER `panelCode`;

       INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'UPDATING Database Version..... ');

       INSERT INTO dbVersionHistory
       (
           version,
           versionDate
       ) VALUES (
          'LIMSv3_ALPHA_020',
           NOW()
       );

       UPDATE dbSettings
       SET `value` = 'LIMSv3_ALPHA_020'
       WHERE `dbSetting` = 'dbCurrentVersion';

      INSERT INTO tmpUpgradeResults (resultType, result)
      VALUES ('INFO', 'UPDATING Database Version..... Success');
    ELSE

      INSERT INTO tmpUpgradeResults (resultType, result)
      VALUES ('INFO', 'SKIPPING VERSION LIMSv3_ALPHA_019 UPDATES');

    END IF;

      -- LIMSv3_ALPHA_020 --> LIMSv3_ALPHA_021
    IF EXISTS(SELECT 1 FROM dbSettings WHERE dbSetting =  'dbCurrentVersion' AND `value` = 'LIMSv3_ALPHA_020') THEN

       INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'SCHEMA VERSION LIMSv3_ALPHA_020 DETECTED');


       INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'Modifying organizationSites columns..... ');

       ALTER TABLE organizationSites
       ADD COLUMN parentOrganizationId INT(11) UNSIGNED AFTER orgId,
       ADD COLUMN siteCode VARCHAR(100) AFTER name,
       ADD COLUMN isSystem BIT(1) AFTER name,
       ADD COLUMN organizationType VARCHAR(100) AFTER name;


       INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'UPDATING Database Version..... ');

       INSERT INTO dbVersionHistory
       (
           version,
           versionDate
       ) VALUES (
          'LIMSv3_ALPHA_021',
           NOW()
       );

       UPDATE dbSettings
       SET `value` = 'LIMSv3_ALPHA_021'
       WHERE `dbSetting` = 'dbCurrentVersion';

      INSERT INTO tmpUpgradeResults (resultType, result)
      VALUES ('INFO', 'UPDATING Database Version..... Success');
    ELSE

      INSERT INTO tmpUpgradeResults (resultType, result)
      VALUES ('INFO', 'SKIPPING VERSION LIMSv3_ALPHA_020 UPDATES');

    END IF;


      -- LIMSv3_ALPHA_021 --> LIMSv3_ALPHA_022
    IF EXISTS(SELECT 1 FROM dbSettings WHERE dbSetting =  'dbCurrentVersion' AND `value` = 'LIMSv3_ALPHA_021') THEN

       INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'SCHEMA VERSION LIMSv3_ALPHA_021 DETECTED');


       INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'Modifying organizationSites columns..... ');

       ALTER TABLE organizationSites
       ADD COLUMN website VARCHAR(255) AFTER email;

       INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'Modifying organizationSites columns..... SUCCESS!');

       INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'UPDATING Database Version..... ');

       INSERT INTO dbVersionHistory
       (
           version,
           versionDate
       ) VALUES (
          'LIMSv3_ALPHA_022',
           NOW()
       );

       UPDATE dbSettings
       SET `value` = 'LIMSv3_ALPHA_022'
       WHERE `dbSetting` = 'dbCurrentVersion';

      INSERT INTO tmpUpgradeResults (resultType, result)
      VALUES ('INFO', 'UPDATING Database Version..... Success');
    ELSE

      INSERT INTO tmpUpgradeResults (resultType, result)
      VALUES ('INFO', 'SKIPPING VERSION LIMSv3_ALPHA_021 UPDATES');

    END IF;

       -- LIMSv3_ALPHA_022 --> LIMSv3_ALPHA_023
    IF EXISTS(SELECT 1 FROM dbSettings WHERE dbSetting =  'dbCurrentVersion' AND `value` = 'LIMSv3_ALPHA_022') THEN

       INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'SCHEMA VERSION LIMSv3_ALPHA_022 DETECTED');

       INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'Modifying reqHolds columns..... ');

        ALTER TABLE reqHolds
        ADD COLUMN active BIT(1) DEFAULT b'1' AFTER reqHoldId;

       INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'Modifying reqHolds columns..... SUCCESS!');


       INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'UPDATING Database Version..... ');

       INSERT INTO dbVersionHistory
       (
           version,
           versionDate
       ) VALUES (
          'LIMSv3_ALPHA_023',
           NOW()
       );

       UPDATE dbSettings
       SET `value` = 'LIMSv3_ALPHA_023'
       WHERE `dbSetting` = 'dbCurrentVersion';

      INSERT INTO tmpUpgradeResults (resultType, result)
      VALUES ('INFO', 'UPDATING Database Version..... Success');
    ELSE

      INSERT INTO tmpUpgradeResults (resultType, result)
      VALUES ('INFO', 'SKIPPING VERSION LIMSv3_ALPHA_022 UPDATES');

    END IF;

       -- LIMSv3_ALPHA_023 --> LIMSv3_ALPHA_024
    IF EXISTS(SELECT 1 FROM dbSettings WHERE dbSetting =  'dbCurrentVersion' AND `value` = 'LIMSv3_ALPHA_023') THEN

       INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'SCHEMA VERSION LIMSv3_ALPHA_023 DETECTED');

       INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'Modifying instrumentContacts..... ');

        ALTER TABLE `instrumentContacts`
        DROP INDEX `idxinstrumentContactsInstrumentId` ,
        ADD INDEX `idxinstrumentContactsInstrumentId` USING BTREE (`instrumentId` ASC);

       INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'Modifying instrumentContacts..... SUCCESS!');


       INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'UPDATING Database Version..... ');

       INSERT INTO dbVersionHistory
       (
           version,
           versionDate
       ) VALUES (
          'LIMSv3_ALPHA_024',
           NOW()
       );

       UPDATE dbSettings
       SET `value` = 'LIMSv3_ALPHA_024'
       WHERE `dbSetting` = 'dbCurrentVersion';

      INSERT INTO tmpUpgradeResults (resultType, result)
      VALUES ('INFO', 'UPDATING Database Version..... Success');
    ELSE

      INSERT INTO tmpUpgradeResults (resultType, result)
      VALUES ('INFO', 'SKIPPING VERSION LIMSv3_ALPHA_023 UPDATES');

    END IF;

           -- LIMSv3_ALPHA_024 --> LIMSv3_ALPHA_025
    IF EXISTS(SELECT 1 FROM dbSettings WHERE dbSetting =  'dbCurrentVersion' AND `value` = 'LIMSv3_ALPHA_024') THEN

       INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'SCHEMA VERSION LIMSv3_ALPHA_024 DETECTED');

       INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'Modifying organizationSites..... ');

        ALTER TABLE `organizationSites`
        CHANGE COLUMN `parentOrganizationId` `parentOrganizationId` VARCHAR(80) NULL DEFAULT NULL ,
        ADD INDEX `idxorganizationSitesParentOrganizationId` (`parentOrganizationId` ASC);
        ALTER TABLE `organizationSites`
        ADD CONSTRAINT `fkorganizationSitesParentOrganizationId`
          FOREIGN KEY (`orgId`)
          REFERENCES `organizations` (`orgId`)
          ON DELETE NO ACTION
          ON UPDATE NO ACTION;

       INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'Modifying organizationSites..... SUCCESS!');


       INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'UPDATING Database Version..... ');

       INSERT INTO dbVersionHistory
       (
           version,
           versionDate
       ) VALUES (
          'LIMSv3_ALPHA_025',
           NOW()
       );

       UPDATE dbSettings
       SET `value` = 'LIMSv3_ALPHA_025'
       WHERE `dbSetting` = 'dbCurrentVersion';

      INSERT INTO tmpUpgradeResults (resultType, result)
      VALUES ('INFO', 'UPDATING Database Version..... Success');
    ELSE

      INSERT INTO tmpUpgradeResults (resultType, result)
      VALUES ('INFO', 'SKIPPING VERSION LIMSv3_ALPHA_024 UPDATES');

    END IF;


           -- LIMSv3_ALPHA_025 --> LIMSv3_ALPHA_026
    IF EXISTS(SELECT 1 FROM dbSettings WHERE dbSetting =  'dbCurrentVersion' AND `value` = 'LIMSv3_ALPHA_025') THEN

       INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'SCHEMA VERSION LIMSv3_ALPHA_025 DETECTED');

       INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'Modifying analysisData..... ');

        ALTER TABLE `analysisData`
        CHANGE COLUMN `dataLinkId` `dataLinkId` INT(11) UNSIGNED NULL ;


       INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'Modifying analysisData..... SUCCESS!');


       INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'UPDATING Database Version..... ');

       INSERT INTO dbVersionHistory
       (
           version,
           versionDate
       ) VALUES (
          'LIMSv3_ALPHA_026',
           NOW()
       );

       UPDATE dbSettings
       SET `value` = 'LIMSv3_ALPHA_026'
       WHERE `dbSetting` = 'dbCurrentVersion';

      INSERT INTO tmpUpgradeResults (resultType, result)
      VALUES ('INFO', 'UPDATING Database Version..... Success');
    ELSE

      INSERT INTO tmpUpgradeResults (resultType, result)
      VALUES ('INFO', 'SKIPPING VERSION LIMSv3_ALPHA_025 UPDATES');

    END IF;

        -- LIMSv3_ALPHA_026 --> LIMSv3_ALPHA_027
    IF EXISTS(SELECT 1 FROM dbSettings WHERE dbSetting =  'dbCurrentVersion' AND `value` = 'LIMSv3_ALPHA_026') THEN

       INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'SCHEMA VERSION LIMSv3_ALPHA_026 DETECTED');

       INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'Modifying fishCaseResults..... ');

        ALTER TABLE fishCaseResults
        DROP requestSpecimenId,
        ADD COLUMN runId VARCHAR(80) AFTER id;

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'Modifying fishCaseResults..... SUCCESS!');

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'Modifying fishCaseResultsFinal..... ');

        ALTER TABLE fishCaseResultsFinal
        DROP requestSpecimenId,
        ADD COLUMN runId VARCHAR(80) AFTER id;

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'Modifying fishCaseResultsFinal..... SUCCESS!');

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'Modifying fishCaseResultsFinalHistory..... ');

        ALTER TABLE fishCaseResultsFinalHistory
        DROP requestSpecimenId,
        ADD COLUMN runId VARCHAR(80) AFTER id;

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'Modifying fishCaseResultsFinalHistory..... SUCCESS!');

       INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'Modifying analysisData..... SUCCESS!');

       INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'UPDATING Database Version..... ');

       INSERT INTO dbVersionHistory
       (
           version,
           versionDate
       ) VALUES (
          'LIMSv3_ALPHA_027',
           NOW()
       );

       UPDATE dbSettings
       SET `value` = 'LIMSv3_ALPHA_027'
       WHERE `dbSetting` = 'dbCurrentVersion';

      INSERT INTO tmpUpgradeResults (resultType, result)
      VALUES ('INFO', 'UPDATING Database Version..... Success');
    ELSE

      INSERT INTO tmpUpgradeResults (resultType, result)
      VALUES ('INFO', 'SKIPPING VERSION LIMSv3_ALPHA_026 UPDATES');

    END IF;


        -- LIMSv3_ALPHA_027 --> LIMSv3_ALPHA_028
    IF EXISTS(SELECT 1 FROM dbSettings WHERE dbSetting =  'dbCurrentVersion' AND `value` = 'LIMSv3_ALPHA_027') THEN

       INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'SCHEMA VERSION LIMSv3_ALPHA_027 DETECTED');

       INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'Modifying Report Tables..... ');

        SET FOREIGN_KEY_CHECKS=0;

        CREATE TABLE `reportDefinition`  (
          `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT,
          `reportName` varchar(80) NOT NULL,
          `eventId` bigint(20) UNSIGNED NULL,
          PRIMARY KEY (`id`),
          KEY `idxreportDefinitionReportName` (`reportName`),
          KEY `idxreportDefinitionEventId` (`eventId`),
          CONSTRAINT `fkreportDefinitionEventId` FOREIGN KEY (`eventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

        CREATE TABLE `reportDefinitionVersion`  (
          `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT,
          `reportDefinitionId` int(11) UNSIGNED NOT NULL,
          `versionNumber` decimal(8, 2) NOT NULL,
          `active` bit(1) NOT NULL,
          `eventId` bigint(20) UNSIGNED NOT NULL,
          PRIMARY KEY (`id`),
          KEY `idxreportDefinitionVersionReportDefinitionId` (`reportDefinitionId`),
          KEY `idxreportDefinitionVersionEventId` (`eventId`),
          CONSTRAINT `fkreportDefinitionVersionReportDefinitionId` FOREIGN KEY (`reportDefinitionId`) REFERENCES `reportDefinition` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
          CONSTRAINT `fkreportDefinitionVersionEventId` FOREIGN KEY (`eventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

        CREATE TABLE `reportDefinitionPanels`  (
          `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT,
          `reportDefinitionVersionId` int(11) UNSIGNED NOT NULL,
          `panelCode` varchar(80) NOT NULL,
          `eventId` bigint(20) UNSIGNED NOT NULL,
          PRIMARY KEY (`id`),
          KEY `idxreportDefinitionPanelsReportDefinitionVersionId` (`reportDefinitionVersionId`),
          KEY `idxreportDefinitionPanelsPanelCode` (`panelCode`),
          KEY `idxreportDefinitionPanelsEventId` (`eventId`),
          CONSTRAINT `fkreportDefinitionPanelsReportDefinitionVersionId` FOREIGN KEY (`reportDefinitionVersionId`) REFERENCES `reportDefinitionVersion` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
          CONSTRAINT `fkreportDefinitionPanelsPanelCode` FOREIGN KEY (`panelCode`) REFERENCES `panels` (`panelCode`) ON DELETE NO ACTION ON UPDATE NO ACTION,
          CONSTRAINT `fkreportDefinitionPanelsEventId` FOREIGN KEY (`eventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

        CREATE TABLE `reportResultFields`  (
          `id` int(11) UNSIGNED NOT NULL,
          `reportDefinitionVersionId` int(11) UNSIGNED NOT NULL,
          `analysisDataDefinitionId` int(11) UNSIGNED NOT NULL,
          `isDataReportable` bit(1) NOT NULL,
          `isLimitsReportable` bit(1) NOT NULL,
          `reportableUnits` varchar(20) NULL,
          `isInterpretationReportable` bit(1) NOT NULL,
          `eventId` bigint(20) UNSIGNED NULL,
          PRIMARY KEY (`id`),
          KEY `idxreportResultFieldsReportDefinitionVersionId` (`reportDefinitionVersionId`),
          KEY `idxreportResultFieldsAnalysisDataDefinitionId` (`analysisDataDefinitionId`),
          KEY `idxreportResultFieldsEventId` (`eventId`),
          CONSTRAINT `fkreportResultFieldsReportDefinitionVersionId` FOREIGN KEY (`reportDefinitionVersionId`) REFERENCES `reportDefinitionVersion` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
          CONSTRAINT `fkreportResultFieldsAnalysisDataDefinitionId` FOREIGN KEY (`analysisDataDefinitionId`) REFERENCES `analysisDataDefinition` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
          CONSTRAINT `fkreportResultFieldsEventId` FOREIGN KEY (`eventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

        DROP TABLE IF EXISTS reportDetails;

        CREATE TABLE `reportDetails`  (
          `id` int(11) UNSIGNED NOT NULL,
          `reportId` varchar(80) NOT NULL,
          `requestFormsId` int(11) UNSIGNED NOT NULL,
          `reportDefinitionVersionId` int(11) UNSIGNED NOT NULL,
          `eventId` bigint(20) UNSIGNED NOT NULL,
          `reportType` varchar(80) NOT NULL,
          `status` varchar(80) NOT NULL,
          `statusEventId` bigint(20) UNSIGNED NOT NULL,
          PRIMARY KEY (`id`),
          KEY `idxReportDetailsReportId` (`reportId`),
          KEY `idxReportDetailsRequestFormsId` (`requestFormsId`),
          KEY `idxReportDetailsReportDefinitionVersionId` (`reportDefinitionVersionId`),
          KEY `idxReportDetailsEventid` (`eventId`),
          KEY `idxReportDetailsStatusEventId` (`statusEventId`),
          CONSTRAINT `fkReportDetailsReportId` FOREIGN KEY (`reportId`) REFERENCES `containers` (`containerId`) ON DELETE NO ACTION ON UPDATE NO ACTION,
          CONSTRAINT `fkReportDetailsRequestFormsId` FOREIGN KEY (`requestFormsId`) REFERENCES `requestForms` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
          CONSTRAINT `fkReportDetailsReportDefinitionVersionId` FOREIGN KEY (`reportDefinitionVersionId`) REFERENCES `reportDefinitionVersion` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
          CONSTRAINT `fkReportDetailsEventid` FOREIGN KEY (`eventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION,
          CONSTRAINT `fkReportDetailsStatusEventId` FOREIGN KEY (`statusEventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

        CREATE TABLE `reportSpecimens`  (
          `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT,
          `reportDetailsId` int(11) UNSIGNED NOT NULL,
          `requestSpecimensId` int(11) UNSIGNED NOT NULL,
          `specimenMethodsId` int(11) UNSIGNED NULL,
          `eventId` bigint(20) UNSIGNED NULL,
          PRIMARY KEY (`id`),
          KEY `idxreportSpecimensReportDetailsId` (`reportDetailsId`),
          KEY `idxreportSpecimensRequestSpecimensId` (`requestSpecimensId`),
          KEY `idxreportSpecimensSpecimenMethodsId` (`specimenMethodsId`),
          KEY `idxreportSpecimensEventId` (`eventId`),
          CONSTRAINT `fkreportSpecimensReportDetailsId` FOREIGN KEY (`reportDetailsId`) REFERENCES `reportDetails` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
          CONSTRAINT `fkreportSpecimensRequestSpecimensId` FOREIGN KEY (`requestSpecimensId`) REFERENCES `requestSpecimens` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
          CONSTRAINT `fkreportSpecimensSpecimenMethodsId` FOREIGN KEY (`specimenMethodsId`) REFERENCES `specimenMethods` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
          CONSTRAINT `fkreportSpecimensEventId` FOREIGN KEY (`eventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

        CREATE TABLE `reportResultData`  (
          `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT,
          `reportDetailsId` int(11) UNSIGNED NOT NULL,
          `specimenId` varchar(80) NOT NULL,
          `panelCode` varchar(80) NOT NULL,
          `testCode` varchar(80) NULL,
          `methodCode` varchar(80) NULL,
          `reportResultFieldsId` int(11) UNSIGNED NOT NULL,
          `varcharResult` varchar(80) NULL,
          `decimalResult` decimal(20, 6) NULL,
          `dateTimeResult` datetime(0) NULL,
          `interpretation` varchar(80) NULL,
          `wording` varchar(2000) NULL,
          `eventId` bigint(20) UNSIGNED NOT NULL,
          PRIMARY KEY (`id`),
          KEY `idxReportResultDataReportDetailsId` (`reportDetailsId`),
          KEY `idxReportResultDataSpecimenId` (`specimenId`),
          KEY `idxReportResultDataPanelCode` (`panelCode`),
          KEY `idxReportResultDataTestCode` (`testCode`),
          KEY `idxReportResultDataMethodCode` (`methodCode`),
          KEY `idxReportResultDataReportResultFieldsId` (`reportResultFieldsId`),
          KEY `idxReportResultDataEventId` (`eventId`),
          CONSTRAINT `fkReportResultDataReportDetailsId` FOREIGN KEY (`reportDetailsId`) REFERENCES `reportDetails` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
          CONSTRAINT `fkReportResultDataSpecimenId` FOREIGN KEY (`specimenId`) REFERENCES `requestSpecimens` (`specimenId`) ON DELETE NO ACTION ON UPDATE NO ACTION,
          CONSTRAINT `fkReportResultDataPanelCode` FOREIGN KEY (`panelCode`) REFERENCES `panels` (`panelCode`) ON DELETE NO ACTION ON UPDATE NO ACTION,
          CONSTRAINT `fkReportResultDataTestCode` FOREIGN KEY (`testCode`) REFERENCES `tests` (`testCode`) ON DELETE NO ACTION ON UPDATE NO ACTION,
          CONSTRAINT `fkReportResultDataMethodCode` FOREIGN KEY (`methodCode`) REFERENCES `methods` (`methodCode`) ON DELETE NO ACTION ON UPDATE NO ACTION,
          CONSTRAINT `fkReportResultDataReportResultFieldsId` FOREIGN KEY (`reportResultFieldsId`) REFERENCES `reportResultFields` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
          CONSTRAINT `fkReportResultDataEventId` FOREIGN KEY (`eventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

        CREATE TABLE `reportResultImages`  (
          `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT,
          `reportDetailsId` int(11) UNSIGNED NOT NULL,
          `reportResultDataId` int(11) UNSIGNED NOT NULL,
          `containerFilesId` int(11) UNSIGNED NOT NULL,
          `eventId` bigint(20) UNSIGNED NULL,
          PRIMARY KEY (`id`),
          KEY `idxReportResultImagesReportDetailsId` (`reportDetailsId`),
          KEY `idxReportResultImagesReportResultDataId` (`reportResultDataId`),
          KEY `idxReportResultImagesContainerFilesId` (`containerFilesId`),
          KEY `idxReportResultImagesEventId` (`eventId`),
          CONSTRAINT `fkReportResultImagesReportDetailsId` FOREIGN KEY (`reportDetailsId`) REFERENCES `reportDetails` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
          CONSTRAINT `fkReportResultImagesReportResultDataId` FOREIGN KEY (`reportResultDataId`) REFERENCES `reportResultData` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
          CONSTRAINT `fkReportResultImagesContainerFilesId` FOREIGN KEY (`containerFilesId`) REFERENCES `containerFiles` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
          CONSTRAINT `fkReportResultImagesEventId` FOREIGN KEY (`eventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

        CREATE TABLE `reportInterpretation`  (
          `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT,
          `reportDetailsId` int(11) UNSIGNED NOT NULL,
          `isOverallReportResult` bit(1) NOT NULL,
          `panelCode` varchar(80) NOT NULL,
          `overallResult` varchar(80) NOT NULL,
          `overallInterpretation` varchar(2000) NULL,
          `eventId` bigint(20) UNSIGNED NULL,
          PRIMARY KEY (`id`),
          KEY `idxReportInterpretationReportDetailsId` (`reportDetailsId`),
          KEY `idxReportInterpertationEventId` (`eventId`),
          CONSTRAINT `fkReportInterpretationReportDetailsId` FOREIGN KEY (`reportDetailsId`) REFERENCES `reportDetails` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
          CONSTRAINT `fkReportInterpertationEventId` FOREIGN KEY (`eventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

        CREATE TABLE `assayWording` (
         `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
         `type` varchar(20) NOT NULL DEFAULT '',
         `codeName` varchar(80) DEFAULT NULL,
         `sectionHeader` varchar(255) DEFAULT NULL,
         `sectionContent` varchar(2000) DEFAULT NULL,
         `displayOrder` int(5) DEFAULT NULL,
         `active` bit(1) DEFAULT NULL,
         `eventId` bigint(20) UNSIGNED DEFAULT NULL,
         PRIMARY KEY (`id`),
         KEY `fkAssayWordingEventId` (`eventId`),
         CONSTRAINT `fkAssayWordingEventId` FOREIGN KEY (`eventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

        DROP TABLE IF EXISTS reportWording;

        CREATE TABLE `reportWording`  (
          `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT,
          `reportDefinitionVersionId` int(11) UNSIGNED NOT NULL,
          `assayWordingId` int(11) UNSIGNED NOT NULL,
          `sectionType` varchar(20) NOT NULL,
          `codeName` varchar(80) NOT NULL,
          `sectionHeader` varchar(255) NULL,
          `sectionContent` varchar(2000) NULL,
          `displayOrder` int(5) UNSIGNED NOT NULL,
          `eventId` bigint(20) UNSIGNED NOT NULL,
          PRIMARY KEY (`id`),
          KEY `idxReportWordingReportDefinitionVersionId` (`reportDefinitionVersionId`),
          KEY `idxReportWordingAssayWordingId`  (`assayWordingId`),
          KEY `idxReportWordingEventId` (`eventId`),
          CONSTRAINT `fkReportWordingReportDefinitionVersionId` FOREIGN KEY (`reportDefinitionVersionId`) REFERENCES `reportDefinitionVersion` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
          CONSTRAINT `fkReportWordingAssayWordingId` FOREIGN KEY (`assayWordingId`) REFERENCES `assayWording` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
          CONSTRAINT `fkReportWordingEventId` FOREIGN KEY (`eventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

        CREATE TABLE `reportResultWording`  (
          `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT,
          `reportDefinitionVersionId` int(11) UNSIGNED NOT NULL,
          `reportResultFieldsId` int(11) UNSIGNED NOT NULL,
          `belowLowerWording` varchar(2000) NULL,
          `equalLowerWording` varchar(2000) NULL,
          `betweenLowerUpperWording` varchar(2000) NULL,
          `equalUpperWording` varchar(2000) NULL,
          `aboveUpperWording` varchar(2000) NULL,
          `equalDiscreteWording` varchar(2000) NULL,
          `notEqualDiscreteWording` varchar(2000) NULL,
          `eventId` bigint(20) UNSIGNED NOT NULL,
          PRIMARY KEY (`id`),
          KEY `idxReportResultWordingreportDefinitionVersionId` (`reportDefinitionVersionId`),
          KEY `idxReportResultWordingreportResultFieldsId` (`reportResultFieldsId`),
          KEY `idxReportResultWordingEventId` (`eventId`),
          CONSTRAINT `fkReportResultWordingreportDefinitionVersionId` FOREIGN KEY (`reportDefinitionVersionId`) REFERENCES `reportDefinitionVersion` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
          CONSTRAINT `fkReportResultWordingreportResultFieldsId` FOREIGN KEY (`reportResultFieldsId`) REFERENCES `reportResultFields` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
          CONSTRAINT `fkReportResultWordingEventId` FOREIGN KEY (`eventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

        CREATE TABLE `reportInterpretationWording`  (
          `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT,
          `reportDefinitionVersionId` int(11) UNSIGNED NOT NULL,
          `isOverallReportResult` bit(1) NOT NULL,
          `panelCode` varchar(80) NULL,
          `overallResult` varchar(255) NOT NULL,
          `overalInterpretation` varchar(2000) NULL,
          `isGroupSignout` bit(1) NOT NULL,
          `eventId` bigint(20) UNSIGNED NULL,
          PRIMARY KEY (`id`),
          KEY `idxReportInterpretationWordingReportDefinitionVersionId` (`reportDefinitionVersionId`),
          KEY `idxReportInterpretationWording` (`eventId`),
          CONSTRAINT `fkReportInterpretationWordingReportDefinitionVersionId` FOREIGN KEY (`reportDefinitionVersionId`) REFERENCES `reportDefinitionVersion` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
          CONSTRAINT `fkReportInterpretationWording` FOREIGN KEY (`eventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

        CREATE TABLE `allReferences`  (
          `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT,
          `reference` varchar(500) NOT NULL,
          `url` varchar(255) NOT NULL,
          `active` bit(1) NOT NULL,
          `eventId` bigint(20) UNSIGNED NOT NULL,
          PRIMARY KEY (`id`),
          KEY `idxReferencesEventId` (`eventId`),
          CONSTRAINT `fkReferencesEventId` FOREIGN KEY (`eventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

        CREATE TABLE `assayReferences`  (
          `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT,
          `assayType` varchar(20) NOT NULL,
          `codeName` varchar(80) NOT NULL,
          `referenceId` int(11) UNSIGNED NOT NULL,
          `displayOrder` int(5) UNSIGNED NOT NULL,
          `eventId` bigint(20) UNSIGNED NOT NULL,
          PRIMARY KEY (`id`),
          KEY `idxAssayReferencesReferenceId` (`referenceId`),
          KEY `idxAssayReferencesEventId` (`eventId`),
          CONSTRAINT `fkAssayReferencesReferenceId` FOREIGN KEY (`referenceId`) REFERENCES `allReferences` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
          CONSTRAINT `fkAssayReferencesEventId` FOREIGN KEY (`eventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

        DROP TABLE IF EXISTS reportReferences;

        CREATE TABLE `reportReferences`  (
          `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT,
          `reportDefinitionVersionId` int(11) UNSIGNED NOT NULL,
          `assayType` varchar(20) NULL,
          `codeName` varchar(80) NULL,
          `referenceId` int(11) UNSIGNED NOT NULL,
          `eventId` bigint(20) UNSIGNED NOT NULL,
          PRIMARY KEY (`id`),
          KEY `idxReportReferencesReportDefinitionVersionId` (`reportDefinitionVersionId`),
          KEY `idxReportReferencesReferenceId` (`referenceId`),
          KEY `idxReportReferencesEventId` (`eventId`),
          CONSTRAINT `fkReportReferencesReportDefinitionVersionId` FOREIGN KEY (`reportDefinitionVersionId`) REFERENCES `reportDefinitionVersion` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
          CONSTRAINT `fkReportReferencesReferenceId` FOREIGN KEY (`referenceId`) REFERENCES `allReferences` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
          CONSTRAINT `fkReportReferencesEventId` FOREIGN KEY (`eventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

        DROP TABLE IF EXISTS reportSettings;

        CREATE TABLE `reportSettings`  (
          `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT,
          `reportDefinitionVersionId` int(11) UNSIGNED NOT NULL,
          `title` varchar(255) NULL,
          `reportDescription` varchar(255) NULL,
          `includeLabInfo` bit(1) NOT NULL,
          `includeSecondaryLabInfo` bit(1) NOT NULL,
          `headerLabName` bit(1) NOT NULL,
          `headerLabAddress` bit(1) NOT NULL,
          `headerReportName` bit(1) NOT NULL,
          `footerPageNumber` bit(1) NOT NULL,
          `footerDemographicInfo` bit(1) NOT NULL,
          `pageOrientation` varchar(10) NOT NULL,
          `pageSize` varchar(10) NOT NULL,
          `eventId` bigint(20) UNSIGNED NULL,
          PRIMARY KEY (`id`),
          KEY `idxReportSettingsReportDefinitionVersionId` (`reportDefinitionVersionId`),
          KEY `idxReportSettingsEventId` (`eventId`),
          CONSTRAINT `fkReportSettingsReportDefinitionVersionId` FOREIGN KEY (`reportDefinitionVersionId`) REFERENCES `reportDefinitionVersion` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
          CONSTRAINT `fkReportSettingsEventId` FOREIGN KEY (`eventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

        CREATE TABLE `reportMetadataFields`  (
          `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT,
          `reportDefinitionVersionId` int(11) UNSIGNED NULL,
          `formInputSettingsId` int(11) UNSIGNED NULL,
          `eventId` bigint(20) UNSIGNED NULL,
          PRIMARY KEY (`id`),
          KEY `idxReportMetadataFieldsReportDefinitionVersionId` (`reportDefinitionVersionId`),
          KEY `idxReportMetadataFieldsFormInputSettingsId` (`formInputSettingsId`),
          KEY `idxReportMetadataFieldsEventId` (`eventId`),
          CONSTRAINT `fkReportMetadataFieldsReportDefinitionVersionId` FOREIGN KEY (`reportDefinitionVersionId`) REFERENCES `reportDefinitionVersion` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
          CONSTRAINT `fkReportMetadataFieldsFormInputSettingsId` FOREIGN KEY (`formInputSettingsId`) REFERENCES `formInputSettings` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
          CONSTRAINT `fkReportMetadataFieldsEventId` FOREIGN KEY (`eventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


        CREATE TABLE `reportJsonFormatterVersion`  (
          `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT,
          `versionNumber` decimal(8, 2) NOT NULL,
          PRIMARY KEY (`id`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

        CREATE TABLE `reportedData`  (
          `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT,
          `reportDetailsId` int(11) UNSIGNED NOT NULL,
          `jsonData` json NOT NULL,
          `reportHTML` varchar(5000) NOT NULL,
          `formatterVersionId` int(11) UNSIGNED NOT NULL,
          `reportDefinitionVersionId` int(11) UNSIGNED NOT NULL,
          `status` varchar(80) NOT NULL,
          `active` bit(1) NOT NULL,
          `pdfFilePath` varchar(80) NOT NULL,
          `eventId` bigint(20) UNSIGNED NULL,
          PRIMARY KEY (`id`),
          KEY `idxReportedDataReportDetailsId` (`reportDetailsId`),
          KEY `idxReportedDataFormatterVersionId` (`formatterVersionId`),
          KEY `idxReportedDataReportDefinitionVersionId` (`reportDefinitionVersionId`),
          KEY `idxReportedDataEventId` (`eventId`),
          CONSTRAINT `fkReportedDataReportDetailsId` FOREIGN KEY (`reportDetailsId`) REFERENCES `reportDetails` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
          CONSTRAINT `fkReportedDataFormatterVersionId` FOREIGN KEY (`formatterVersionId`) REFERENCES `reportJsonFormatterVersion` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
          CONSTRAINT `fkReportedDataReportDefinitionVersionId` FOREIGN KEY (`reportDefinitionVersionId`) REFERENCES `reportDefinitionVersion` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
          CONSTRAINT `fkReportedDataEventId` FOREIGN KEY (`eventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

        CREATE TABLE reportDefinitionSites  (
         id int(11) UNSIGNED NOT NULL AUTO_INCREMENT,
         reportDefinitionVersionId int(11) UNSIGNED NOT NULL,
         siteId varchar(80) NOT NULL,
         departmentId varchar(80) NOT NULL,
         locationId varchar(80) NOT NULL,
         eventId bigint(20) UNSIGNED NOT NULL,
         PRIMARY KEY (id),
         KEY fkreportDefinitionSitesReportDefinitionVersionId (reportDefinitionVersionId),
         KEY fkreportDefinitionSitesEventId (eventId),
         CONSTRAINT fkreportDefinitionSitesReportDefinitionVersionId FOREIGN KEY (reportDefinitionVersionId) REFERENCES reportDefinitionVersion (id) ON DELETE NO ACTION ON UPDATE NO ACTION,
         CONSTRAINT fkreportDefinitionSitesEventId FOREIGN KEY (eventId) REFERENCES events (eventId) ON DELETE NO ACTION ON UPDATE NO ACTION
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

        SET FOREIGN_KEY_CHECKS=1;

       INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'Modifying Report Tables..... SUCCESS!');

       INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'Modifying analysisMethodPanels..... SUCCESS!');

        CREATE TABLE `analysisMethodPanels` (
        `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
        `analysisMethodId` int(11) unsigned NOT NULL,
        `panelCode` varchar(80) DEFAULT NULL,
        `eventId` BIGINT(20) UNSIGNED NOT NULL,
        PRIMARY KEY (`id`),
        KEY `idxanalysisMethodPanelsanalysisEventId` (`eventId`),
        KEY `idxanalysisMethodPanelsanalysisMethodId` (`analysisMethodId`),
        CONSTRAINT `fkanalysisMethodPanelsanalysisMethodId` FOREIGN KEY (`analysisMethodId`) REFERENCES `analysisMethods` (`id`),
        CONSTRAINT `fkanalysisMethodPanelsanalysisEventId` FOREIGN KEY (`eventId`) REFERENCES `events` (`eventId`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

       INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'Modifying analysisMethodPanels..... SUCCESS!');

       INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'Modifying controlRuns..... SUCCESS!');

        ALTER TABLE `controlRuns`
        MODIFY COLUMN `parentWorkflowSpecimenRunId` int(11) UNSIGNED NOT NULL DEFAULT 0 AFTER `currentParentPosition`,
        MODIFY COLUMN `modifier` varchar(80) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'self' AFTER `eventId`;

       INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'Modifying controlRuns..... SUCCESS!');

       INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'UPDATING Database Version..... ');

       INSERT INTO dbVersionHistory
       (
           version,
           versionDate
       ) VALUES (
          'LIMSv3_ALPHA_028',
           NOW()
       );

       UPDATE dbSettings
       SET `value` = 'LIMSv3_ALPHA_028'
       WHERE `dbSetting` = 'dbCurrentVersion';

      INSERT INTO tmpUpgradeResults (resultType, result)
      VALUES ('INFO', 'UPDATING Database Version..... Success');
    ELSE

      INSERT INTO tmpUpgradeResults (resultType, result)
      VALUES ('INFO', 'SKIPPING VERSION LIMSv3_ALPHA_027 UPDATES');

    END IF;


        -- LIMSv3_ALPHA_028 --> LIMSv3_ALPHA_029
    IF EXISTS(SELECT 1 FROM dbSettings WHERE dbSetting =  'dbCurrentVersion' AND `value` = 'LIMSv3_ALPHA_028') THEN

       INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'SCHEMA VERSION LIMSv3_ALPHA_028 DETECTED');

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'Modifying drugs..... ');

        ALTER TABLE drugs
        DROP COLUMN testId,
        CHANGE COLUMN drugId id int(11) unsigned NOT NULL AUTO_INCREMENT;

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'Modifying drugs..... SUCCESS!');

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'Creating reportDefinitionCustomers..... ');

        CREATE TABLE `reportDefinitionCustomers` (
          `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
          `reportDefinitionVersionId` int(11) UNSIGNED NOT NULL,
          `customerId` varchar(80) NOT NULL DEFAULT '',
          `eventId` bigint(20) UNSIGNED NOT NULL,
          PRIMARY KEY (`id`),
          UNIQUE KEY `idxreportDefinitionCustomersReportDefinitionVersionId` (`reportDefinitionVersionId`,`customerId`),
          KEY `idxreportDefinitionCustomersEventId` (`eventId`),
          CONSTRAINT `fkreportDefinitionCustomersReportDefinitionVersionId` FOREIGN KEY (`reportDefinitionVersionId`) REFERENCES `reportDefinitionVersion` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

        ALTER TABLE `reportDefinitionCustomers`
        ADD CONSTRAINT `fkreportDefinitionCustomersEventId`
          FOREIGN KEY (`eventId`)
          REFERENCES `events` (`eventId`)
          ON DELETE NO ACTION
          ON UPDATE NO ACTION;



        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'Creating reportDefinitionCustomers..... SUCCESS!');

       INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'UPDATING Database Version..... ');

       INSERT INTO dbVersionHistory
       (
           version,
           versionDate
       ) VALUES (
          'LIMSv3_ALPHA_029',
           NOW()
       );

       UPDATE dbSettings
       SET `value` = 'LIMSv3_ALPHA_029'
       WHERE `dbSetting` = 'dbCurrentVersion';

      INSERT INTO tmpUpgradeResults (resultType, result)
      VALUES ('INFO', 'UPDATING Platform Version..... Success');
    ELSE

      INSERT INTO tmpUpgradeResults (resultType, result)
      VALUES ('INFO', 'SKIPPING VERSION LIMSv3_ALPHA_028 UPDATES');

    END IF;

        -- LIMSv3_ALPHA_029 --> LIMSv3_ALPHA_030
    IF EXISTS(SELECT 1 FROM dbSettings WHERE dbSetting =  'dbCurrentVersion' AND `value` = 'LIMSv3_ALPHA_029') THEN

       INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'SCHEMA VERSION LIMSv3_ALPHA_029 DETECTED');

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'Modifying reportDefinitionPanels..... ');

        ALTER TABLE `reportDefinitionPanels`
        ADD UNIQUE KEY `reportDefinitionVersionId` (`reportDefinitionVersionId`,`panelCode`);

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'Modifying reportDefinitionPanels..... SUCCESS!');

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'Modifying reportSettings..... ');

        ALTER TABLE `reportSettings`
        CHANGE COLUMN `includeLabInfo` `includeLabInfo` BIT(1) NOT NULL DEFAULT b'0' ,
        CHANGE COLUMN `includeSecondaryLabInfo` `includeSecondaryLabInfo` BIT(1) NOT NULL DEFAULT b'0' ,
        CHANGE COLUMN `headerLabName` `headerLabName` BIT(1) NOT NULL DEFAULT b'0' ,
        CHANGE COLUMN `headerLabAddress` `headerLabAddress` BIT(1) NOT NULL DEFAULT b'0' ,
        CHANGE COLUMN `headerReportName` `headerReportName` BIT(1) NOT NULL DEFAULT b'0' ,
        CHANGE COLUMN `footerPageNumber` `footerPageNumber` BIT(1) NOT NULL DEFAULT b'0' ,
        CHANGE COLUMN `footerDemographicInfo` `footerDemographicInfo` BIT(1) NOT NULL DEFAULT b'0' ,
        CHANGE COLUMN `pageOrientation` `pageOrientation` VARCHAR(10) NULL DEFAULT NULL ,
        CHANGE COLUMN `pageSize` `pageSize` VARCHAR(10) NULL DEFAULT NULL ;

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'Modifying reportSettings..... SUCCESS!');

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'Modifying requestForms..... ');

        ALTER TABLE requestForms
        ADD COLUMN status VARCHAR(80),
        ADD COLUMN statusEventId BIGINT(20);

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'Modifying requestForms..... SUCCESS!');

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'Modifying requestFormsHistory..... ');

        ALTER TABLE requestFormsHistory
        ADD COLUMN status VARCHAR(80),
        ADD COLUMN statusEventId BIGINT(20);

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'Modifying requestFormsHistory..... SUCCESS!');

       INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'UPDATING Database Version..... ');

       INSERT INTO dbVersionHistory
       (
           version,
           versionDate
       ) VALUES (
          'LIMSv3_ALPHA_030',
           NOW()
       );

       UPDATE dbSettings
       SET `value` = 'LIMSv3_ALPHA_030'
       WHERE `dbSetting` = 'dbCurrentVersion';

      INSERT INTO tmpUpgradeResults (resultType, result)
      VALUES ('INFO', 'UPDATING Database Version..... Success');
    ELSE

      INSERT INTO tmpUpgradeResults (resultType, result)
      VALUES ('INFO', 'SKIPPING VERSION LIMSv3_ALPHA_029UPDATES');

    END IF;


        -- LIMSv3_ALPHA_030 --> LIMSv3_ALPHA_031
    IF EXISTS(SELECT 1 FROM dbSettings WHERE dbSetting =  'dbCurrentVersion' AND `value` = 'LIMSv3_ALPHA_030') THEN

       INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'SCHEMA VERSION LIMSv3_ALPHA_030 DETECTED');


       INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'DROPPING reportResultWording Foreign Keys');

       ALTER TABLE `reportResultWording` DROP FOREIGN KEY `fkReportResultWordingreportDefinitionVersionId`;
       ALTER TABLE `reportResultWording` DROP FOREIGN KEY `fkReportResultWordingreportResultFieldsId`;


       INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'UPDATING reportResultWording columns');
       ALTER TABLE reportResultWording
           CHANGE reportDefinitionVersionId analysisDataLimitsId int(11) unsigned,
           CHANGE reportResultFieldsId analysisDataInterpretationId int(11) unsigned;


       INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'ADDING reportResultWording Foreign Keys');
       ALTER TABLE `reportResultWording`
       ADD CONSTRAINT `fkreportResultWordingAnalysisDataLimitsId` FOREIGN KEY (`analysisDataLimitsId`) REFERENCES `analysisDataLimits` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
       ADD CONSTRAINT `fkreportResultWordingAnalysisDataInterpretationId` FOREIGN KEY (`analysisDataInterpretationId`) REFERENCES `analysisDataInterpretation` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;


       INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'UPDATING Database Version..... ');

       INSERT INTO dbVersionHistory
       (
           version,
           versionDate
       ) VALUES (
          'LIMSv3_ALPHA_031',
           NOW()
       );

       UPDATE dbSettings
       SET `value` = 'LIMSv3_ALPHA_031'
       WHERE `dbSetting` = 'dbCurrentVersion';

      INSERT INTO tmpUpgradeResults (resultType, result)
      VALUES ('INFO', 'UPDATING Database Version..... Success');
    ELSE

      INSERT INTO tmpUpgradeResults (resultType, result)
      VALUES ('INFO', 'SKIPPING VERSION LIMSv3_ALPHA_030 UPDATES');

    END IF;

        -- LIMSv3_ALPHA_031 --> LIMSv3_ALPHA_032
    IF EXISTS(SELECT 1 FROM dbSettings WHERE dbSetting =  'dbCurrentVersion' AND `value` = 'LIMSv3_ALPHA_031') THEN

       INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'SCHEMA VERSION LIMSv3_ALPHA_031 DETECTED');

       INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'UPDATING assayReferences columns');

       ALTER TABLE assayReferences
       DROP COLUMN displayOrder,
       ADD COLUMN active BIT(1) DEFAULT NULL AFTER referenceId;

       INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'UPDATING Database Version..... ');

       INSERT INTO dbVersionHistory
       (
           version,
           versionDate
       ) VALUES (
          'LIMSv3_ALPHA_032',
           NOW()
       );

       UPDATE dbSettings
       SET `value` = 'LIMSv3_ALPHA_032'
       WHERE `dbSetting` = 'dbCurrentVersion';

      INSERT INTO tmpUpgradeResults (resultType, result)
      VALUES ('INFO', 'UPDATING Database Version..... Success');
    ELSE

      INSERT INTO tmpUpgradeResults (resultType, result)
      VALUES ('INFO', 'SKIPPING VERSION LIMSv3_ALPHA_031 UPDATES');

    END IF;

        -- LIMSv3_ALPHA_032 --> LIMSv3_ALPHA_033
    IF EXISTS(SELECT 1 FROM dbSettings WHERE dbSetting =  'dbCurrentVersion' AND `value` = 'LIMSv3_ALPHA_032') THEN

       INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'SCHEMA VERSION LIMSv3_ALPHA_032 DETECTED');

       INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'CREATING reportHeaders...');

        CREATE TABLE `reportHeaders` (
          `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
          `headerName` varchar(80) NOT NULL,
          `primarySiteId` varchar(80) NOT NULL,
          `secondarySiteId` varchar(80) DEFAULT NULL,
          `primaryLogo` bit(1) DEFAULT b'0',
          `primaryAddress` bit(1) DEFAULT b'0',
          `secondaryLogo` bit(1) DEFAULT b'0',
          `secondaryAddress` bit(1) DEFAULT b'0',
          `reportDescription` bit(1) DEFAULT b'0',
          `eventId` bigint(20) UNSIGNED NOT NULL,
          PRIMARY KEY (`id`),
          KEY `fkreportHeadersPrimarySiteId` (`primarySiteId`),
          KEY `fkreportHeadersSecondarySiteId` (`secondarySiteId`),
          KEY `fkreportHeadersEventId` (`eventId`),
          CONSTRAINT `fkreportHeadersPrimarySiteId` FOREIGN KEY (`primarySiteId`) REFERENCES `organizationSites` (`siteId`) ON DELETE NO ACTION ON UPDATE NO ACTION,
          CONSTRAINT `fkreportHeadersSecondarySiteId` FOREIGN KEY (`secondarySiteId`) REFERENCES `organizationSites` (`siteId`) ON DELETE NO ACTION ON UPDATE NO ACTION,
          CONSTRAINT `fkreportHeadersEventId` FOREIGN KEY (`eventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

      INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'CREATING reportHeaders... SUCCESS');

       INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'CREATING reportPageHeaders...');

        CREATE TABLE `reportPageHeaders` (
        `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
        `pageHeaderName` varchar(80) NOT NULL,
        `title` bit(1) DEFAULT b'0',
        `labAddress` bit(1) DEFAULT b'0',
        `labName` bit(1) DEFAULT b'0',
        `patientName` bit(1) DEFAULT b'0',
        `mrn` bit(1) DEFAULT b'0',
        `dob` bit(1) DEFAULT b'0',
        `eventId` bigint(20) UNSIGNED NOT NULL,
        PRIMARY KEY (`id`),
        KEY `fkreportPageHeadersEventId` (`eventId`),
        CONSTRAINT `fkreportPageHeadersEventId` FOREIGN KEY (`eventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'CREATING reportPageHeaders... SUCCESS');

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'CREATING reportPageFooters...');

        CREATE TABLE `reportPageFooters` (
          `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
          `pageFooterName` varchar(80) NOT NULL DEFAULT '',
          `pageNumber` bit(1) DEFAULT b'0',
          `labName` bit(1) DEFAULT b'0',
          `labAddress` bit(1) DEFAULT b'0',
          `patientName` bit(1) DEFAULT b'0',
          `mrn` bit(1) DEFAULT b'0',
          `dob` bit(1) DEFAULT b'0',
          `eventId` bigint(20) UNSIGNED NOT NULL,
            PRIMARY KEY (`id`),
            KEY `fkreportPageFootersEventId` (`eventId`),
            CONSTRAINT `fkreportPageFootersEventId` FOREIGN KEY (`eventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'CREATING reportPageFooters... SUCCESS');

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'MODIFYING reportSettings...');

        ALTER TABLE `reportSettings`
        DROP COLUMN `includeLabInfo`,
        DROP COLUMN  `includeSecondaryLabInfo`,
        DROP COLUMN `headerLabName`,
        DROP COLUMN `headerLabAddress`,
        DROP COLUMN `headerReportName`,
        DROP COLUMN `footerPageNumber`,
        DROP COLUMN `footerDemographicInfo`,
        DROP COLUMN `pageOrientation`,
        DROP COLUMN `pageSize`,
        ADD COLUMN `headerId` int(11) UNSIGNED DEFAULT NULL,
        ADD COLUMN `pageHeaderId` int(11) UNSIGNED DEFAULT NULL,
        ADD COLUMN `pageFooterId` int(11) UNSIGNED DEFAULT NULL,
        ADD CONSTRAINT `fkreportSettingsHeaderId` FOREIGN KEY (`headerId`) REFERENCES `reportHeaders`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
        ADD CONSTRAINT `fkreportSettingsPageHeaderId` FOREIGN KEY (`pageHeaderId`) REFERENCES `reportPageHeaders`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
        ADD CONSTRAINT `fkreportSettingsPageFooterId` FOREIGN KEY (`pageFooterId`) REFERENCES `reportPageFooters`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'MODIFYING reportSettings... SUCCESS');

       INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'UPDATING Database Version..... ');

       INSERT INTO dbVersionHistory
       (
           version,
           versionDate
       ) VALUES (
          'LIMSv3_ALPHA_033',
           NOW()
       );

       UPDATE dbSettings
       SET `value` = 'LIMSv3_ALPHA_033'
       WHERE `dbSetting` = 'dbCurrentVersion';

      INSERT INTO tmpUpgradeResults (resultType, result)
      VALUES ('INFO', 'UPDATING Database Version..... Success');
    ELSE

      INSERT INTO tmpUpgradeResults (resultType, result)
      VALUES ('INFO', 'SKIPPING VERSION LIMSv3_ALPHA_032 UPDATES');

    END IF;


        -- LIMSv3_ALPHA_032 --> LIMSv3_ALPHA_033
    IF EXISTS(SELECT 1 FROM dbSettings WHERE dbSetting =  'dbCurrentVersion' AND `value` = 'LIMSv3_ALPHA_033') THEN

       INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'SCHEMA VERSION LIMSv3_ALPHA_033 DETECTED');

      INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'CREATING reportPageHeaderFooter...');

        CREATE TABLE `reportPageHeaderFooter` (
          `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
          `templateName` varchar(80) NOT NULL,
          `title` varchar(80) NOT NULL DEFAULT '',
          `pageNumber` varchar(80) NOT NULL DEFAULT '',
          `labAddress` varchar(80) NOT NULL DEFAULT '',
          `labName` varchar(80) NOT NULL DEFAULT '',
          `patientName` varchar(80) NOT NULL DEFAULT '',
          `mrn` varchar(80) NOT NULL DEFAULT '',
          `dob` varchar(80) NOT NULL DEFAULT '',
          `eventId` bigint(20) UNSIGNED NOT NULL,
          PRIMARY KEY (`id`),
          KEY `idxreportPageHeaderFooterEventId` (`eventId`),
          CONSTRAINT `fkreportPageHeaderFooterEventId` FOREIGN KEY (`eventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION
          ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


       INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'CREATING reportPageHeaderFooter... SUCCESS');

       INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'MODIFYING reportSettings...');

        ALTER TABLE reportSettings
        DROP FOREIGN KEY `fkreportSettingsPageHeaderId`,
        DROP FOREIGN KEY `fkreportSettingsPageFooterId`;

        ALTER TABLE reportSettings
        DROP COLUMN `pageHeaderId`,
        DROP COLUMN `pageFooterId`,
        ADD COLUMN `pageHeaderFooterId` int(11) UNSIGNED DEFAULT NULL,
        ADD CONSTRAINT `fkreportSettingsPageHeaderFooterId` FOREIGN KEY (`pageHeaderFooterId`) REFERENCES `reportPageHeaderFooter`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'MODIFYING reportSettings... SUCCESS');

       INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'DROPPING reportPageFooters...');

        DROP TABLE reportPageFooters;

       INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'DROPPING reportPageFooters... SUCCESS');

       INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'DROPPING reportPageHeaders...');

        DROP TABLE reportPageHeaders;

       INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'DROPPING reportPageHeaders... SUCCESS');


       INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'UPDATING Database Version..... ');

       INSERT INTO dbVersionHistory
       (
           version,
           versionDate
       ) VALUES (
          'LIMSv3_ALPHA_034',
           NOW()
       );

       UPDATE dbSettings
       SET `value` = 'LIMSv3_ALPHA_034'
       WHERE `dbSetting` = 'dbCurrentVersion';

      INSERT INTO tmpUpgradeResults (resultType, result)
      VALUES ('INFO', 'UPDATING Database Version..... Success');
    ELSE

      INSERT INTO tmpUpgradeResults (resultType, result)
      VALUES ('INFO', 'SKIPPING VERSION LIMSv3_ALPHA_033 UPDATES');

    END IF;

        -- LIMSv3_ALPHA_034 --> LIMSv3_ALPHA_035
    IF EXISTS(SELECT 1 FROM dbSettings WHERE dbSetting =  'dbCurrentVersion' AND `value` = 'LIMSv3_ALPHA_034') THEN

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'SCHEMA VERSION LIMSv3_ALPHA_034 DETECTED');


        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'Creating reportMetadataTemplates..... ');

        CREATE TABLE `reportMetadataTemplates` (
             `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
             `metadataName` varchar(80) NOT NULL DEFAULT '',
             `eventId` bigint(20) unsigned DEFAULT NULL,
             PRIMARY KEY (`id`),
             UNIQUE KEY `metadataName` (`metadataName`) USING BTREE,
             KEY `fkreportMetadataTemplatesEventId` (`eventId`),
             CONSTRAINT `fkreportMetadataTemplatesEventId` FOREIGN KEY (`eventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'Changing reportMetadataFields..... ');

        ALTER TABLE `reportMetadataFields`
          DROP FOREIGN KEY `fkReportMetadataFieldsFormInputSettingsId`,
          DROP FOREIGN KEY `fkReportMetadataFieldsReportDefinitionVersionId`;

        ALTER TABLE `reportMetadataFields`
          MODIFY `reportDefinitionVersionId` int(11) unsigned NOT NULL,
          MODIFY `formInputSettingsId` int(11) unsigned NOT NULL,
          ADD CONSTRAINT `fkReportMetadataFieldsFormInputSettingsId` FOREIGN KEY (`formInputSettingsId`) REFERENCES `formInputSettings` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
          ADD CONSTRAINT `fkReportMetadataFieldsReportDefinitionVersionId` FOREIGN KEY (`reportDefinitionVersionId`) REFERENCES `reportDefinitionVersion` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
          ADD COLUMN `metadataTemplateId` int(11) unsigned DEFAULT NULL,
          ADD CONSTRAINT `fkmetadataTemplateId` FOREIGN KEY (`metadataTemplateId`) REFERENCES `reportMetadataTemplates` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;


        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'Changing analysisDataDefinition..... ');

        ALTER TABLE `analysisDataDefinition`
        ADD COLUMN `resultCode` varchar(80) NULL COMMENT '',
        ADD COLUMN `loadDataAnalysisDataDefinitionId` int(11) unsigned NULL,
        ADD COLUMN `formInputSettingsId` int(11) unsigned NULL,
        ADD CONSTRAINT `fkformInputSettingsIdAnalysisDataDefinition` FOREIGN KEY (`formInputSettingsId`) REFERENCES `formInputSettings` (`id`),
        ADD CONSTRAINT `fkloadDataAnalysisDataDefinitionIdAnalysisDataDefinition` FOREIGN KEY (`loadDataAnalysisDataDefinitionId`) REFERENCES `analysisDataDefinition` (`id`);



        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'UPDATING Database Version..... ');

        INSERT INTO dbVersionHistory
        (
           version,
           versionDate
        ) VALUES (
          'LIMSv3_ALPHA_035',
           NOW()
        );

        UPDATE dbSettings
        SET `value` = 'LIMSv3_ALPHA_035'
        WHERE `dbSetting` = 'dbCurrentVersion';

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'UPDATING Database Version..... Success');
    ELSE

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'SKIPPING VERSION LIMSv3_ALPHA_034 UPDATES');

    END IF;


            -- LIMSv3_ALPHA_035 --> LIMSv3_ALPHA_036
    IF EXISTS(SELECT 1 FROM dbSettings WHERE dbSetting =  'dbCurrentVersion' AND `value` = 'LIMSv3_ALPHA_035') THEN

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'SCHEMA VERSION LIMSv3_ALPHA_035 DETECTED');


        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'MODIFYING reportInterpretationWording..... ');

        ALTER TABLE reportInterpretationWording
        CHANGE COLUMN overalInterpretation overallInterpretation varchar(2000) DEFAULT NULL AFTER overallResult;

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'MODIFYING reportInterpretationWording..... SUCCESS');

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'MODIFYING reportMetadataTemplates..... ');

        ALTER TABLE `reportMetadataTemplates`
        CHANGE COLUMN `metadataName` `metadataName` varchar(80) NOT NULL;

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'MODIFYING reportMetadataTemplates..... SUCCESS');

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'UPDATING Database Version..... ');

        INSERT INTO dbVersionHistory
        (
           version,
           versionDate
        ) VALUES (
          'LIMSv3_ALPHA_036',
           NOW()
        );

        UPDATE dbSettings
        SET `value` = 'LIMSv3_ALPHA_036'
        WHERE `dbSetting` = 'dbCurrentVersion';

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'UPDATING Database Version..... Success');
    ELSE

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'SKIPPING VERSION LIMSv3_ALPHA_035 UPDATES');

    END IF;

            -- LIMSv3_ALPHA_036 --> LIMSv3_ALPHA_037
    IF EXISTS(SELECT 1 FROM dbSettings WHERE dbSetting =  'dbCurrentVersion' AND `value` = 'LIMSv3_ALPHA_036') THEN

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'SCHEMA VERSION LIMSv3_ALPHA_036 DETECTED');


        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'CREATING analysisControlDataRuns..... ');

        CREATE TABLE `analysisControlDataRuns` (
          `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
          `controlRunsId` int(11) unsigned NOT NULL,
          `currentContainerId` varchar(80) NOT NULL,
          `currentParentId` varchar(80) DEFAULT NULL,
          `currentParentPosition` varchar(20) DEFAULT NULL,
          `eventId` bigint(20) unsigned NOT NULL,
          PRIMARY KEY (`id`),
          KEY `idxAnalysisControlDataRunsControlRunsId` (`controlRunsId`) USING BTREE,
          KEY `idxAnalysisControlDataRunsCurrentContainerId` (`currentContainerId`) USING BTREE,
          KEY `idxAnalysisControlDataRunsCurrentParentId` (`currentParentId`) USING BTREE,
          KEY `idxAnalysisControlDataRunsEventId` (`eventId`) USING BTREE,
          CONSTRAINT `fkAnalysisControlDataRunsControlRunsId` FOREIGN KEY (`controlRunsId`) REFERENCES `controlRuns` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
          CONSTRAINT `fkAnalysisControlDataRunsCurrentContainerId` FOREIGN KEY (`currentContainerId`) REFERENCES `containers` (`containerId`) ON DELETE NO ACTION ON UPDATE NO ACTION,
          CONSTRAINT `fkAnalysisControlDataRunsCurrentParentId` FOREIGN KEY (`currentParentId`) REFERENCES `containers` (`containerId`) ON DELETE NO ACTION ON UPDATE NO ACTION,
          CONSTRAINT `fkAnalysisControlDataRunsEventId` FOREIGN KEY (`eventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'CREATING analysisControlDataRuns..... SUCCESS');

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'CREATING analysisControlData..... ');

        CREATE TABLE `analysisControlData` (
          `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
          `analysisControlDataRunsId` int(11) unsigned NOT NULL,
          `analysisDataDefinitionId` int(11) unsigned NOT NULL,
          `varcharResult` varchar(80) DEFAULT NULL,
          `decimalResult` decimal(20,6) DEFAULT NULL,
          `dateTimeResult` datetime(6) DEFAULT NULL,
          `eventId` bigint(20) unsigned NOT NULL,
          PRIMARY KEY (`id`),
          KEY `idxAnalysisControlDataAnalysisControlDataRunsId` (`analysisControlDataRunsId`) USING BTREE,
          KEY `idxAnalysisDataAnalysisDataDefinitionId` (`analysisDataDefinitionId`) USING BTREE,
          KEY `idxAnalysisDataEventId` (`eventId`) USING BTREE,
          CONSTRAINT `analysiscontroldata_ibfk_1` FOREIGN KEY (`analysisDataDefinitionId`) REFERENCES `analysisDataDefinition` (`id`),
          CONSTRAINT `analysiscontroldata_ibfk_2` FOREIGN KEY (`eventId`) REFERENCES `events` (`eventId`),
          CONSTRAINT `fkAnalysisControlDataAnalysisControlDataRunsId` FOREIGN KEY (`analysisControlDataRunsId`) REFERENCES `analysisControlDataRuns` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'CREATING analysisControlData..... SUCCESS');

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'CREATING analysisControlDataRunInterpretation..... ');

        CREATE TABLE `analysisControlDataRunInterpretation` (
          `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
          `analysisDataInterpretationId` int(11) unsigned NOT NULL,
          `analysisControlDataId` int(11) unsigned NOT NULL,
          `analysisControlDataRunId` int(11) unsigned NOT NULL,
          `analysisDataDefinitionId` int(11) unsigned NOT NULL,
          `calculatedInterpretation` varchar(80) NOT NULL,
          `actualInterpretation` varchar(80) NOT NULL,
          `eventId` bigint(20) unsigned NOT NULL,
          PRIMARY KEY (`id`) USING BTREE,
          KEY `fkAnalysisControlDataRunInterpAnalysisDataInterpid` (`analysisDataInterpretationId`) USING BTREE,
          KEY `fkAnalysisControlDataRunInterpretationAnalysisControlDataId` (`analysisControlDataId`) USING BTREE,
          KEY `fkAnalysisControlDataRunInterpretationAnalysisControlDataRunId` (`analysisControlDataRunId`) USING BTREE,
          KEY `fkAnalysisControlDataRunInterpretationAnalysisDataDefinitionId` (`analysisDataDefinitionId`) USING BTREE,
          KEY `fkAnalysisControlDataRunInterpretationEventId` (`eventId`) USING BTREE,
          CONSTRAINT `fkAnalysisControlDataRunInterpAnalysisDataInterpid` FOREIGN KEY (`analysisDataInterpretationId`) REFERENCES `analysisDataInterpretation` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
          CONSTRAINT `fkAnalysisControlDataRunInterpretationAnalysisControlDataRunId` FOREIGN KEY (`analysisControlDataRunId`) REFERENCES `analysisControlDataRuns` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
          CONSTRAINT `fkAnalysisControlDataRunInterpretationAnalysisDataDefinitionId` FOREIGN KEY (`analysisDataDefinitionId`) REFERENCES `analysisDataDefinition` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
          CONSTRAINT `fkAnalysisControlDataRunInterpretationAnalysisDataId` FOREIGN KEY (`analysisControlDataId`) REFERENCES `analysisControlData` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
          CONSTRAINT `fkAnalysisControlDataRunInterpretationEventId` FOREIGN KEY (`eventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'CREATING analysisControlDataRunInterpretation..... SUCCESS');

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'UPDATING Database Version..... ');

        INSERT INTO dbVersionHistory
        (
           version,
           versionDate
        ) VALUES (
          'LIMSv3_ALPHA_037',
           NOW()
        );

        UPDATE dbSettings
        SET `value` = 'LIMSv3_ALPHA_037'
        WHERE `dbSetting` = 'dbCurrentVersion';

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'UPDATING Database Version..... Success');
    ELSE

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'SKIPPING VERSION LIMSv3_ALPHA_036 UPDATES');

    END IF;

                -- LIMSv3_ALPHA_037 --> LIMSv3_ALPHA_038
    IF EXISTS(SELECT 1 FROM dbSettings WHERE dbSetting =  'dbCurrentVersion' AND `value` = 'LIMSv3_ALPHA_037') THEN

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'SCHEMA VERSION LIMSv3_ALPHA_037 DETECTED');


        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'MODIFYING analysisData..... ');

        ALTER TABLE `analysisData`
        ADD COLUMN `referenceRange` VARCHAR(80) NULL AFTER `dateTimeResult`,
        ADD COLUMN `units` TINYTEXT NULL AFTER `referenceRange`;

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'MODIFYING analysisData..... SUCCESS');

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'UPDATING Database Version..... ');

        INSERT INTO dbVersionHistory
        (
           version,
           versionDate
        ) VALUES (
          'LIMSv3_ALPHA_038',
           NOW()
        );

        UPDATE dbSettings
        SET `value` = 'LIMSv3_ALPHA_038'
        WHERE `dbSetting` = 'dbCurrentVersion';

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'UPDATING Database Version..... Success');
    ELSE

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'SKIPPING VERSION LIMSv3_ALPHA_037 UPDATES');

    END IF;

        -- LIMSv3_ALPHA_038 --> LIMSv3_ALPHA_039
        IF EXISTS(SELECT 1 FROM dbSettings WHERE dbSetting =  'dbCurrentVersion' AND `value` = 'LIMSv3_ALPHA_038') THEN

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'SCHEMA VERSION LIMSv3_ALPHA_038 DETECTED');


        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'MODIFYING analysisData..... ');

        ALTER TABLE `analysisData`
        DROP COLUMN `dataLinkId`,
        MODIFY COLUMN `eventId` bigint(20) UNSIGNED NOT NULL AFTER `dateTimeResult`,
        ADD COLUMN `calculatedInterpretation` varchar(80) NULL AFTER `units`,
        ADD COLUMN `actualInterpretation` varchar(80) NULL AFTER `calculatedInterpretation`,
        ADD COLUMN `analysisDataLimitsId` int(11) UNSIGNED NULL AFTER `actualInterpretation`,
        ADD COLUMN `analysisDataInterpretationId` int(11) UNSIGNED NULL AFTER `analysisDataLimitsId`,
        ADD COLUMN `interpretationEventId` bigint(20) UNSIGNED NULL AFTER `analysisDataInterpretationId`;

        ALTER TABLE `analysisData`
        ADD CONSTRAINT `fkAnalysisDataAnalysisDataInterpretationId` FOREIGN KEY (`analysisDataInterpretationId`) REFERENCES `analysisDataInterpretation` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

        ALTER TABLE `analysisData`
        ADD CONSTRAINT `fkAnalysisDataAnalysisDataLimitsId` FOREIGN KEY (`analysisDataLimitsId`) REFERENCES `analysisDataLimits` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

        ALTER TABLE `analysisData`
        ADD CONSTRAINT `fkAnalysisDataInterpretationEventId2` FOREIGN KEY (`interpretationEventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION;

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'MODIFYING analysisData..... SUCCESS');

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'MODIFYING analysisDataRuns..... ');

        ALTER TABLE `analysisDataRuns`
        ADD COLUMN `analysisMethodVersionId` int(11) UNSIGNED NULL AFTER `eventId`,
        ADD COLUMN `interpretation` varchar(80) NULL AFTER `analysisMethodVersionId`,
        ADD COLUMN `interpretationEventId` bigint(20) UNSIGNED NULL AFTER `interpretation`;

        ALTER TABLE `analysisDataRuns`
        ADD CONSTRAINT `fkAnalysisDataRunsAnalysisMethodVersionsId` FOREIGN KEY (`analysisMethodVersionId`) REFERENCES `analysisMethodVersions` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

        ALTER TABLE `analysisDataRuns`
        ADD CONSTRAINT `fkAnalysisDataRunsInterpretationEventId` FOREIGN KEY (`interpretationEventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION;

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'MODIFYING analysisDataRuns..... SUCCESS');

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'MODIFYING analysisMethods..... ');

        ALTER TABLE `analysisMethods`
        ADD COLUMN `analysisStepName` varchar(80) NULL AFTER `methodDescription`;

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'MODIFYING analysisMethods..... SUCCESS');

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'MODIFYING analysisDataDefinition..... ');

        ALTER TABLE `analysisDataDefinition`
        DROP COLUMN `stepName`;

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'MODIFYING analysisDataDefinition..... SUCCESS');

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'DROPPING analysisDataRunInterpretation..... ');

        DROP TABLE IF EXISTS analysisDataRunInterpretation;

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'DROPPING analysisDataRunInterpretation..... SUCCESS');

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'UPDATING Database Version..... ');

        INSERT INTO dbVersionHistory
        (
           version,
           versionDate
        ) VALUES (
          'LIMSv3_ALPHA_039',
           NOW()
        );

        UPDATE dbSettings
        SET `value` = 'LIMSv3_ALPHA_039'
        WHERE `dbSetting` = 'dbCurrentVersion';

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'UPDATING Database Version..... Success');
    ELSE

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'SKIPPING VERSION LIMSv3_ALPHA_038 UPDATES');

    END IF;

                -- LIMSv3_ALPHA_039 --> LIMSv3_ALPHA_040
    IF EXISTS(SELECT 1 FROM dbSettings WHERE dbSetting =  'dbCurrentVersion' AND `value` = 'LIMSv3_ALPHA_039') THEN

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'SCHEMA VERSION LIMSv3_ALPHA_039 DETECTED');


        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'MODIFYING analysisDataRuns..... ');

        ALTER TABLE analysisDataRuns
        ADD COLUMN result varchar(80) NULL AFTER analysisMethodVersionId;

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'MODIFYING analysisDataRuns..... SUCCESS');

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'MODIFYING analysisDataLimits..... ');

        ALTER TABLE analysisDataLimits
        ADD COLUMN units varchar(80) NULL AFTER discrete;

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'MODIFYING analysisDataLimits..... SUCCESS');

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'MODIFYING analysisControlDataRuns..... ');

        ALTER TABLE `analysisControlDataRuns`
        ADD COLUMN `analysisMethodVersionId` int(11) UNSIGNED NULL AFTER `eventId`,
        ADD COLUMN `result` varchar(80) NULL AFTER `analysisMethodVersionId`,
        ADD COLUMN `interpretation` varchar(80) NULL AFTER `result`,
        ADD COLUMN `interpretationEventId` bigint(20) UNSIGNED NULL AFTER `interpretation`,
        ADD CONSTRAINT `fkAnalysisControlDataRunsInterpretationEventId` FOREIGN KEY (`interpretationEventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION,
        ADD CONSTRAINT `fkAnalysisControlDataRunsAnalysisMethodVersionsId` FOREIGN KEY (`analysisMethodVersionId`) REFERENCES `analysisMethodVersions` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'MODIFYING analysisControlDataRuns..... SUCCESS');

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'MODIFYING analysisControlData..... ');

        ALTER TABLE `analysisControlData`
        ADD COLUMN `referenceRange` varchar(80) NULL AFTER `eventId`,
        ADD COLUMN `units` varchar(80) NULL AFTER `referenceRange`,
        ADD COLUMN `calculatedInterpretation` varchar(80) NULL AFTER `units`,
        ADD COLUMN `actualInterpretation` varchar(80) NULL AFTER `calculatedInterpretation`,
        ADD COLUMN `analysisDataLimitsId` int(11) UNSIGNED NULL AFTER `actualInterpretation`,
        ADD COLUMN `analysisDataInterpretationId` int(11) UNSIGNED NULL AFTER `analysisDataLimitsId`,
        ADD COLUMN `interpretationEventId` bigint(20) UNSIGNED NULL AFTER `analysisDataInterpretationId`,
        ADD COLUMN `stepName` varchar(80) NULL AFTER `interpretationEventId`,
        ADD CONSTRAINT `fkAnalysisControlDataAnalysisDataInterpretationId` FOREIGN KEY (`analysisDataInterpretationId`) REFERENCES `analysisDataInterpretation` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
        ADD CONSTRAINT `fkAnalysisControlDataAnalysisDataLimitsId` FOREIGN KEY (`analysisDataLimitsId`) REFERENCES `analysisDataLimits` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
        ADD CONSTRAINT `fkAnalysisControlDataInterpretationEventId` FOREIGN KEY (`interpretationEventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION;

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'MODIFYING analysisControlData..... SUCCESS');

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'DROPPING analysisData..... ');

        DROP TABLE IF EXISTS analysisControlDataRunInterpretation;

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'DROPPING analysisData..... SUCCESS');

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'UPDATING Database Version..... ');

        INSERT INTO dbVersionHistory
        (
           version,
           versionDate
        ) VALUES (
          'LIMSv3_ALPHA_040',
           NOW()
        );

        UPDATE dbSettings
        SET `value` = 'LIMSv3_ALPHA_040'
        WHERE `dbSetting` = 'dbCurrentVersion';

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'UPDATING Database Version..... Success');
    ELSE

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'SKIPPING VERSION LIMSv3_ALPHA_039 UPDATES');

    END IF;

                -- LIMSv3_ALPHA_040 --> LIMSv3_ALPHA_041
    IF EXISTS(SELECT 1 FROM dbSettings WHERE dbSetting =  'dbCurrentVersion' AND `value` = 'LIMSv3_ALPHA_040') THEN

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'SCHEMA VERSION LIMSv3_ALPHA_040 DETECTED');


        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'MODIFYING requestForms..... ');

        ALTER TABLE requestForms
        DROP COLUMN department,
        ADD COLUMN locationId varchar(80) DEFAULT NULL AFTER mrnFacility,
        ADD COLUMN departmentId varchar(80) DEFAULT NULL AFTER locationId,
        ADD CONSTRAINT fkrequestFormsLocationId FOREIGN KEY (locationId) REFERENCES organizationSites (orgId) ON DELETE NO ACTION ON UPDATE NO ACTION,
        ADD CONSTRAINT fkrequestFormsDepartmentId FOREIGN KEY (departmentId) REFERENCES organizationSites (orgId) ON DELETE NO ACTION ON UPDATE NO ACTION;



        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'MODIFYING requestForms..... SUCCESS');

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'MODIFYING requestFormsHistory..... ');


         ALTER TABLE requestFormsHistory
         DROP COLUMN department,
         ADD COLUMN locationId varchar(80) DEFAULT NULL AFTER mrnFacility,
         ADD COLUMN departmentId varchar(80) DEFAULT NULL AFTER locationId;

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'MODIFYING requestFormsHistory..... SUCCESS');


        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'UPDATING Database Version..... ');

        INSERT INTO dbVersionHistory
        (
           version,
           versionDate
        ) VALUES (
          'LIMSv3_ALPHA_041',
           NOW()
        );

        UPDATE dbSettings
        SET `value` = 'LIMSv3_ALPHA_041'
        WHERE `dbSetting` = 'dbCurrentVersion';

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'UPDATING Database Version..... Success');
    ELSE

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'SKIPPING VERSION LIMSv3_ALPHA_040 UPDATES');

    END IF;

                -- LIMSv3_ALPHA_041 --> LIMSv3_ALPHA_042
    IF EXISTS(SELECT 1 FROM dbSettings WHERE dbSetting =  'dbCurrentVersion' AND `value` = 'LIMSv3_ALPHA_041') THEN

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'SCHEMA VERSION LIMSv3_ALPHA_041 DETECTED');

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'MODIFYING analysisData..... ');

        ALTER TABLE analysisData
        ADD COLUMN stepName varchar(80) NULL AFTER interpretationEventId;

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'MODIFYING analysisData..... SUCCESS');


        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'UPDATING Database Version..... ');

        INSERT INTO dbVersionHistory
        (
           version,
           versionDate
        ) VALUES (
          'LIMSv3_ALPHA_042',
           NOW()
        );

        UPDATE dbSettings
        SET `value` = 'LIMSv3_ALPHA_042'
        WHERE `dbSetting` = 'dbCurrentVersion';

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'UPDATING Database Version..... Success');
    ELSE

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'SKIPPING VERSION LIMSv3_ALPHA_041 UPDATES');

    END IF;    

    -- LIMSv3_ALPHA_042 --> LIMSv3_ALPHA_043
    IF EXISTS(SELECT 1 FROM dbSettings WHERE dbSetting =  'dbCurrentVersion' AND `value` = 'LIMSv3_ALPHA_042') THEN

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'SCHEMA VERSION LIMSv3_ALPHA_042 DETECTED');


        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'MODIFYING requestForms..... ');

        ALTER TABLE requestForms
        ADD COLUMN department varchar(80) DEFAULT NULL AFTER mrnFacility;

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'MODIFYING requestForms..... SUCCESS');

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'MODIFYING requestFormsHistory..... ');


         ALTER TABLE requestFormsHistory
         ADD COLUMN department varchar(80) DEFAULT NULL AFTER mrnFacility;

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'MODIFYING requestFormsHistory..... SUCCESS');


        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'UPDATING Database Version..... ');

        INSERT INTO dbVersionHistory
        (
           version,
           versionDate
        ) VALUES (
          'LIMSv3_ALPHA_043',
           NOW()
        );

        UPDATE dbSettings
        SET `value` = 'LIMSv3_ALPHA_043'
        WHERE `dbSetting` = 'dbCurrentVersion';

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'UPDATING Database Version..... Success');
    ELSE

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'SKIPPING VERSION LIMSv3_ALPHA_042 UPDATES');

    END IF;

                  -- LIMSv3_ALPHA_043 --> LIMSv3_ALPHA_044
    IF EXISTS(SELECT 1 FROM dbSettings WHERE dbSetting =  'dbCurrentVersion' AND `value` = 'LIMSv3_ALPHA_043') THEN

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'SCHEMA VERSION LIMSv3_ALPHA_043 DETECTED');


        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'MODIFYING requestForms..... ');

        ALTER TABLE requestForms
        DROP FOREIGN KEY fkrequestFormsLocationId,
        DROP FOREIGN KEY fkrequestFormsDepartmentId;

        ALTER TABLE requestForms
        ADD CONSTRAINT fkrequestFormsLocationId FOREIGN KEY (locationId) REFERENCES organizationSites (siteId) ON DELETE NO ACTION ON UPDATE NO ACTION,
        ADD CONSTRAINT fkrequestFormsDepartmentId FOREIGN KEY (departmentId) REFERENCES organizationSites (siteId) ON DELETE NO ACTION ON UPDATE NO ACTION;

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'MODIFYING requestForms..... SUCCESS');

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'MODIFYING requestFormsHistory..... ');

         ALTER TABLE organizationSites
         DROP COLUMN parentOrganizationId,
         ADD COLUMN parentSiteId varchar(80) DEFAULT NULL AFTER orgId;

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'MODIFYING requestFormsHistory..... SUCCESS');


        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'UPDATING Database Version..... ');

        INSERT INTO dbVersionHistory
        (
           version,
           versionDate
        ) VALUES (
          'LIMSv3_ALPHA_044',
           NOW()
        );

        UPDATE dbSettings
        SET `value` = 'LIMSv3_ALPHA_044'
        WHERE `dbSetting` = 'dbCurrentVersion';

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'UPDATING Database Version..... Success');
    ELSE

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'SKIPPING VERSION LIMSv3_ALPHA_043 UPDATES');

    END IF;

                  -- LIMSv3_ALPHA_044 --> LIMSv3_ALPHA_045
    IF EXISTS(SELECT 1 FROM dbSettings WHERE dbSetting =  'dbCurrentVersion' AND `value` = 'LIMSv3_ALPHA_044') THEN

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'SCHEMA VERSION LIMSv3_ALPHA_044 DETECTED');


        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'MODIFYING requestForms..... ');

        ALTER TABLE requestForms
        DROP COLUMN department;

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'MODIFYING requestForms..... SUCCESS');

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'MODIFYING requestFormsHistory..... ');

        ALTER TABLE requestFormsHistory
        DROP COLUMN department;

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'MODIFYING requestFormsHistory..... SUCCESS');

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'UPDATING Database Version..... ');

        INSERT INTO dbVersionHistory
        (
           version,
           versionDate
        ) VALUES (
          'LIMSv3_ALPHA_045',
           NOW()
        );

        UPDATE dbSettings
        SET `value` = 'LIMSv3_ALPHA_045'
        WHERE `dbSetting` = 'dbCurrentVersion';

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'UPDATING Database Version..... Success');
    ELSE

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'SKIPPING VERSION LIMSv3_ALPHA_044 UPDATES');

    END IF;

                  -- LIMSv3_ALPHA_045 --> LIMSv3_ALPHA_046
    IF EXISTS(SELECT 1 FROM dbSettings WHERE dbSetting =  'dbCurrentVersion' AND `value` = 'LIMSv3_ALPHA_045') THEN

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'SCHEMA VERSION LIMSv3_ALPHA_045 DETECTED');


        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'MODIFYING reportDetails..... ');

        SET FOREIGN_KEY_CHECKS=0;

        ALTER TABLE reportDetails
        MODIFY COLUMN id int(11) UNSIGNED NOT NULL AUTO_INCREMENT FIRST;

        SET FOREIGN_KEY_CHECKS=1;

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'MODIFYING reportDetails..... SUCCESS');

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'UPDATING Database Version..... ');

        INSERT INTO dbVersionHistory
        (
           version,
           versionDate
        ) VALUES (
          'LIMSv3_ALPHA_046',
           NOW()
        );

        UPDATE dbSettings
        SET `value` = 'LIMSv3_ALPHA_046'
        WHERE `dbSetting` = 'dbCurrentVersion';

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'UPDATING Database Version..... Success');
    ELSE

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'SKIPPING VERSION LIMSv3_ALPHA_045 UPDATES');

    END IF;

                  -- LIMSv3_ALPHA_046 --> LIMSv3_ALPHA_047
    IF EXISTS(SELECT 1 FROM dbSettings WHERE dbSetting =  'dbCurrentVersion' AND `value` = 'LIMSv3_ALPHA_046') THEN

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'SCHEMA VERSION LIMSv3_ALPHA_046 DETECTED');


        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'Removing rows..... ');

        DROP TABLE IF EXISTS `rows`;

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'UPDATING Database Version..... ');

        INSERT INTO dbVersionHistory
        (
           version,
           versionDate
        ) VALUES (
          'LIMSv3_ALPHA_047',
           NOW()
        );

        UPDATE dbSettings
        SET `value` = 'LIMSv3_ALPHA_047'
        WHERE `dbSetting` = 'dbCurrentVersion';

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'UPDATING Database Version..... Success');
    ELSE

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'SKIPPING VERSION LIMSv3_ALPHA_046 UPDATES');

    END IF;


                  -- LIMSv3_ALPHA_047 --> LIMSv3_ALPHA_048
    IF EXISTS(SELECT 1 FROM dbSettings WHERE dbSetting =  'dbCurrentVersion' AND `value` = 'LIMSv3_ALPHA_047') THEN

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'SCHEMA VERSION LIMSv3_ALPHA_047 DETECTED');


        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'Modifying routingMatrix..... ');

        ALTER TABLE `routingMatrix`
        ADD COLUMN `departmentId` VARCHAR(80) DEFAULT NULL,
        ADD COLUMN `locationId` VARCHAR(80) DEFAULT NULL;

        ALTER TABLE `routingMatrix`
        ADD CONSTRAINT `fkroutingMatrixDepartmentId` FOREIGN KEY (`departmentId`) REFERENCES `organizationSites` (`siteId`) ON DELETE NO ACTION ON UPDATE NO ACTION,
        ADD CONSTRAINT `fkroutingMatrixLocationId` FOREIGN KEY (`locationId`) REFERENCES `organizationSites` (`siteId`) ON DELETE NO ACTION ON UPDATE NO ACTION;


        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'UPDATING Database Version..... ');

        INSERT INTO dbVersionHistory
        (
           version,
           versionDate
        ) VALUES (
          'LIMSv3_ALPHA_048',
           NOW()
        );

        UPDATE dbSettings
        SET `value` = 'LIMSv3_ALPHA_048'
        WHERE `dbSetting` = 'dbCurrentVersion';

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'UPDATING Database Version..... Success');
    ELSE

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'SKIPPING VERSION LIMSv3_ALPHA_047 UPDATES');

    END IF;

                  -- LIMSv3_ALPHA_048 --> LIMSv3_ALPHA_049
    IF EXISTS(SELECT 1 FROM dbSettings WHERE dbSetting =  'dbCurrentVersion' AND `value` = 'LIMSv3_ALPHA_048') THEN

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'SCHEMA VERSION LIMSv3_ALPHA_048 DETECTED');


        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'Modifying specimenMethods..... ');

        ALTER TABLE `specimenMethods`
        ADD COLUMN `requestId` VARCHAR(80) DEFAULT NULL AFTER `id`,
        ADD KEY `idxspecimenMethodsRequestId` (`requestId`) USING BTREE,
        ADD CONSTRAINT `fkspecimenMethodsRequestId` FOREIGN KEY (`requestId`) REFERENCES `requestForms` (`requestId`) ON DELETE NO ACTION ON UPDATE NO ACTION;



        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'UPDATING Database Version..... ');

        INSERT INTO dbVersionHistory
        (
           version,
           versionDate
        ) VALUES (
          'LIMSv3_ALPHA_049',
           NOW()
        );

        UPDATE dbSettings
        SET `value` = 'LIMSv3_ALPHA_049'
        WHERE `dbSetting` = 'dbCurrentVersion';

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'UPDATING Database Version..... Success');
    ELSE

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'SKIPPING VERSION LIMSv3_ALPHA_048 UPDATES');

    END IF;

                      -- LIMSv3_ALPHA_049 --> LIMSv3_ALPHA_050
    IF EXISTS(SELECT 1 FROM dbSettings WHERE dbSetting =  'dbCurrentVersion' AND `value` = 'LIMSv3_ALPHA_049') THEN

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'SCHEMA VERSION LIMSv3_ALPHA_049 DETECTED');


        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'Modifying reportSettings..... ');

        ALTER TABLE reportSettings
        ADD COLUMN reportTemplate VARCHAR(80) AFTER pageHeaderFooterId;

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'Modifying reportSettings..... Success');


        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'UPDATING Database Version..... ');

        INSERT INTO dbVersionHistory
        (
           version,
           versionDate
        ) VALUES (
          'LIMSv3_ALPHA_050',
           NOW()
        );

        UPDATE dbSettings
        SET `value` = 'LIMSv3_ALPHA_050'
        WHERE `dbSetting` = 'dbCurrentVersion';

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'UPDATING Database Version..... Success');
    ELSE

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'SKIPPING VERSION LIMSv3_ALPHA_049 UPDATES');

    END IF;

                      -- LIMSv3_ALPHA_050 --> LIMSv3_ALPHA_051
    IF EXISTS(SELECT 1 FROM dbSettings WHERE dbSetting =  'dbCurrentVersion' AND `value` = 'LIMSv3_ALPHA_050') THEN

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'SCHEMA VERSION LIMSv3_ALPHA_050 DETECTED');


        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'Creating analysisPoolTubeDataRuns..... ');

        CREATE TABLE `analysisPoolTubeDataRuns` (
         `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
         `poolTubeRunsId` int(11) unsigned NOT NULL,
         `currentContainerId` varchar(80) NOT NULL,
         `currentParentId` varchar(80) DEFAULT NULL,
         `currentParentPosition` varchar(20) DEFAULT NULL,
         `eventId` bigint(20) unsigned NOT NULL,
         `analysisMethodVersionId` int(11) unsigned DEFAULT NULL,
         `result` varchar(80) DEFAULT NULL,
         `interpretation` varchar(80) DEFAULT NULL,
         `interpretationEventId` bigint(20) unsigned DEFAULT NULL,
         PRIMARY KEY (`id`),
         KEY `idxanalysisPoolTubeDataRunsPoolTubeRunsId` (`poolTubeRunsId`) USING BTREE,
         KEY `idxanalysisPoolTubeDataRunsCurrentContainerId` (`currentContainerId`) USING BTREE,
         KEY `idxanalysisPoolTubeDataRunsCurrentParentId` (`currentParentId`) USING BTREE,
         KEY `idxanalysisPoolTubeDataRunsEventId` (`eventId`) USING BTREE,
         KEY `idxanalysisPoolTubeDataRunsInterpretationEventId` (`interpretationEventId`),
         KEY `idxanalysisPoolTubeDataRunsAnalysisMethodVersionsId` (`analysisMethodVersionId`),
         CONSTRAINT `fkanalysisPoolTubeDataRunsAnalysisMethodVersionId` FOREIGN KEY (`analysisMethodVersionId`) REFERENCES `analysisMethodVersions` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
         CONSTRAINT `fkanalysisPoolTubeDataRunsCurrentContainerId` FOREIGN KEY (`currentContainerId`) REFERENCES `containers` (`containerId`) ON DELETE NO ACTION ON UPDATE NO ACTION,
         CONSTRAINT `fkanalysisPoolTubeDataRunsCurrentParentId` FOREIGN KEY (`currentParentId`) REFERENCES `containers` (`containerId`) ON DELETE NO ACTION ON UPDATE NO ACTION,
         CONSTRAINT `fkanalysisPoolTubeDataRunsEventId` FOREIGN KEY (`eventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION,
         CONSTRAINT `fkanalysisPoolTubeDataRunsInterpretationEventId` FOREIGN KEY (`interpretationEventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION,
         CONSTRAINT `fkanalysisPoolTubeDataRunsPoolTubeRunsId` FOREIGN KEY (`poolTubeRunsId`) REFERENCES `poolRuns` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'Creating analysisPoolTubeDataRuns..... Success');

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'Creating analysisPoolTubeData..... ');

        CREATE TABLE `analysisPoolTubeData` (
         `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
         `analysisPoolTubeDataRunsId` int(11) unsigned NOT NULL,
         `analysisDataDefinitionId` int(11) unsigned NOT NULL,
         `varcharResult` varchar(80) DEFAULT NULL,
         `decimalResult` decimal(20,6) DEFAULT NULL,
         `dateTimeResult` datetime(6) DEFAULT NULL,
         `eventId` bigint(20) unsigned NOT NULL,
         `referenceRange` varchar(80) DEFAULT NULL,
         `units` varchar(80) DEFAULT NULL,
         `calculatedInterpretation` varchar(80) DEFAULT NULL,
         `actualInterpretation` varchar(80) DEFAULT NULL,
         `analysisDataLimitsId` int(11) unsigned DEFAULT NULL,
         `analysisDataInterpretationId` int(11) unsigned DEFAULT NULL,
         `interpretationEventId` bigint(20) unsigned DEFAULT NULL,
         `stepName` varchar(80) DEFAULT NULL,
         PRIMARY KEY (`id`),
         KEY `idxanalysisPoolTubeDataAnalysisPoolTubeDataRunsId` (`analysisPoolTubeDataRunsId`) USING BTREE,
         KEY `iidxanalysisPoolTubeDataAnalysisDataDefinitionId` (`analysisDataDefinitionId`) USING BTREE,
         KEY `idxanalysisPoolTubeDataEventId` (`eventId`) USING BTREE,
         KEY `idxanalysisPoolTubeDataAnalysisDataInterpretationId` (`analysisDataInterpretationId`),
         KEY `idxanalysisPoolTubeDataAnalysisDataLimitsId` (`analysisDataLimitsId`),
         KEY `idxanalysisPoolTubeDataInterpretationEventId` (`interpretationEventId`),
         CONSTRAINT `fkanalysisPoolTubeDataAnalysisDataDefinitionId` FOREIGN KEY (`analysisDataDefinitionId`) REFERENCES `analysisDataDefinition` (`id`),
         CONSTRAINT `fkanalysisPoolTubeDataEventId` FOREIGN KEY (`eventId`) REFERENCES `events` (`eventId`),
         CONSTRAINT `fkanalysisPoolTubeDataAnalysisDataInterpretationId` FOREIGN KEY (`analysisDataInterpretationId`) REFERENCES `analysisDataInterpretation` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
         CONSTRAINT `fkanalysisPoolTubeDataAnalysisDataLimitsId` FOREIGN KEY (`analysisDataLimitsId`) REFERENCES `analysisDataLimits` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
         CONSTRAINT `fkanalysisPoolTubeDataInterpretationEventId` FOREIGN KEY (`interpretationEventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION,
         CONSTRAINT `fkanalysisPoolTubeDataAnalysisPoolTubeDataRunsId` FOREIGN KEY (`analysisPoolTubeDataRunsId`) REFERENCES `analysisPoolTubeDataRuns` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'Creating analysisPoolTubeDataRuns..... Success');

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'UPDATING Database Version..... ');

        INSERT INTO dbVersionHistory
        (
           version,
           versionDate
        ) VALUES (
          'LIMSv3_ALPHA_051',
           NOW()
        );

        UPDATE dbSettings
        SET `value` = 'LIMSv3_ALPHA_051'
        WHERE `dbSetting` = 'dbCurrentVersion';

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'UPDATING Database Version..... Success');
    ELSE

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'SKIPPING VERSION LIMSv3_ALPHA_050 UPDATES');

    END IF;


                      -- LIMSv3_ALPHA_051 --> LIMSv3_ALPHA_052
    IF EXISTS(SELECT 1 FROM dbSettings WHERE dbSetting =  'dbCurrentVersion' AND `value` = 'LIMSv3_ALPHA_051') THEN

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'SCHEMA VERSION LIMSv3_ALPHA_051 DETECTED');

        ALTER TABLE `reportResultData`
        DROP FOREIGN KEY `fkReportResultDataReportResultFieldsId`;

        ALTER TABLE `reportResultData`
        DROP COLUMN `reportResultFieldsId`;

        DROP TABLE IF EXISTS `reportResultFields`;

        ALTER TABLE `reportResultData`
        ADD COLUMN `isOverall` bit(1) DEFAULT b'0' AFTER `wording`,
        ADD COLUMN `isPanelOverall` bit(1) DEFAULT b'0' AFTER `isOverall`,
        ADD COLUMN `limits` VARCHAR(80) NOT NULL AFTER `isPanelOverall`,
        ADD COLUMN `reportableUnits` VARCHAR(80)  NOT NULL AFTER `limits`;

        ALTER TABLE reportSettings
        DROP COLUMN reportTemplate;

        ALTER TABLE reportSettings
        ADD COLUMN `reportTemplateHTML` VARCHAR(80) NOT NULL AFTER `pageHeaderFooterId`,
        ADD COLUMN `reportTemplateCSS` VARCHAR(80) NOT NULL  AFTER `reportTemplateHTML`,
        ADD COLUMN `reportTemplateJS` VARCHAR(80) NOT NULL AFTER `reportTemplateCSS`;

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'UPDATING Database Version..... ');

        INSERT INTO dbVersionHistory
        (
           version,
           versionDate
        ) VALUES (
          'LIMSv3_ALPHA_052',
           NOW()
        );

        UPDATE dbSettings
        SET `value` = 'LIMSv3_ALPHA_052'
        WHERE `dbSetting` = 'dbCurrentVersion';

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'UPDATING Database Version..... Success');
    ELSE

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'SKIPPING VERSION LIMSv3_ALPHA_051 UPDATES');

    END IF;

                -- LIMSv3_ALPHA_052 --> LIMSv3_ALPHA_053
    IF EXISTS(SELECT 1 FROM dbSettings WHERE dbSetting =  'dbCurrentVersion' AND `value` = 'LIMSv3_ALPHA_052') THEN

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'SCHEMA VERSION LIMSv3_ALPHA_052 DETECTED');

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'Updating validValuesLinks..... ');

        ALTER TABLE `validValuesLinks`
        DROP FOREIGN KEY `fkvalidValuesLinksSetName`;

        ALTER TABLE `validValuesLinks`
        DROP INDEX `idxvalidValuesLinksSetName` ;

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'UPDATING Database Version..... ');

        INSERT INTO dbVersionHistory
        (
           version,
           versionDate
        ) VALUES (
          'LIMSv3_ALPHA_053',
           NOW()
        );

        UPDATE dbSettings
        SET `value` = 'LIMSv3_ALPHA_053'
        WHERE `dbSetting` = 'dbCurrentVersion';

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'UPDATING Database Version..... Success');
    ELSE

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'SKIPPING VERSION LIMSv3_ALPHA_052 UPDATES');

    END IF;


                      -- LIMSv3_ALPHA_053 --> LIMSv3_ALPHA_054
    IF EXISTS(SELECT 1 FROM dbSettings WHERE dbSetting =  'dbCurrentVersion' AND `value` = 'LIMSv3_ALPHA_053') THEN

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'SCHEMA VERSION LIMSv3_ALPHA_053 DETECTED');

		INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'UPDATING requestForms..... ');

        ALTER TABLE requestForms
        ADD COLUMN addTest bit(1) NULL DEFAULT 0 AFTER statusEventId,
        ADD COLUMN addTestParentRequestId varchar(80) NULL DEFAULT NULL AFTER addTest;

        ALTER TABLE requestForms
        ADD CONSTRAINT `fkrequestFormsAddTestParentRequestId` FOREIGN KEY (`addTestParentRequestId`) REFERENCES `requestForms` (`requestId`) ON DELETE NO ACTION ON UPDATE NO ACTION;

		INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'Creating cultureAssignments..... ');

		CREATE TABLE `cultureAssignments` (
		  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
		  `runId` varchar(80) NOT NULL,
		  `cultureType` varchar(80) DEFAULT NULL,
		  `incubationTime` varchar(80) DEFAULT NULL,
		  `cellCount` varchar(80) DEFAULT NULL,
		  `incubationStartEventDate` datetime DEFAULT NULL,
		  `incubationStartEventId` bigint(20) unsigned DEFAULT NULL,
		  `incubationEndEventDate` datetime DEFAULT NULL,
		  `incubationEndEventId` bigint(20) unsigned DEFAULT NULL,
		  `actualIncubationTime` int(11) DEFAULT NULL,
		  PRIMARY KEY (`id`),
		  KEY `fkcultureAssignmentsIncubationStartEventId` (`incubationStartEventId`),
		  KEY `fkcultureAssignmentsIncubationEndEventId` (`incubationEndEventId`),
		  KEY `fkcultureAssignmentsRunId` (`runId`),
		  CONSTRAINT `fkcultureAssignmentsIncubationEndEventId` FOREIGN KEY (`incubationEndEventId`) REFERENCES `events` (`eventId`),
		  CONSTRAINT `fkcultureAssignmentsIncubationStartEventId` FOREIGN KEY (`incubationStartEventId`) REFERENCES `events` (`eventId`),
		  CONSTRAINT `fkcultureAssignmentsRunId` FOREIGN KEY (`runId`) REFERENCES `specimenRuns` (`runId`)
		) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

		INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'UPDATING Database Version..... ');

        INSERT INTO dbVersionHistory
        (
           version,
           versionDate
        ) VALUES (
          'LIMSv3_ALPHA_054',
           NOW()
        );

        UPDATE dbSettings
        SET `value` = 'LIMSv3_ALPHA_054'
        WHERE `dbSetting` = 'dbCurrentVersion';

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'UPDATING Database Version..... Success');
    ELSE

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'SKIPPING VERSION LIMSv3_ALPHA_053 UPDATES');

    END IF;

                      -- LIMSv3_ALPHA_054 --> LIMSv3_ALPHA_055
    IF EXISTS(SELECT 1 FROM dbSettings WHERE dbSetting =  'dbCurrentVersion' AND `value` = 'LIMSv3_ALPHA_054') THEN

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'SCHEMA VERSION LIMSv3_ALPHA_054 DETECTED');

		INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'UPDATING reportSignatures..... ');

        ALTER TABLE reportSignatures
        DROP FOREIGN KEY fkreportSignaturesMedicalDirectorId;


		INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'UPDATING storageContainerInfo..... ');

        ALTER TABLE storageContainerInfo
        ADD `layoutType` varchar(20) DEFAULT NULL AFTER description,
        ADD   `cols` INT(11) DEFAULT NULL AFTER layoutType,
        ADD   `rows` INT(11) DEFAULT NULL AFTER cols;


		INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'UPDATING storageContainerInfoHistory..... ');

        ALTER TABLE storageContainerInfoHistory
        ADD `layoutType` varchar(20) DEFAULT NULL AFTER description,
        ADD   `cols` INT(11) DEFAULT NULL AFTER layoutType,
        ADD   `rows` INT(11) DEFAULT NULL AFTER cols;


		INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'UPDATING reportResultData..... ');

        ALTER TABLE `reportResultData`
        ADD COLUMN `analysisDataId` int(11) UNSIGNED NULL AFTER `methodCode`,
        ADD CONSTRAINT `fksreportResltDataAnalysisDataId` FOREIGN KEY (`analysisDataId`) REFERENCES `analysisData` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
        ALTER TABLE `reportResultData` CHANGE `specimenId` `specimenId` varchar(80) NULL;
        ALTER TABLE `reportResultData` CHANGE `panelCode` `panelCode` varchar(80) NULL;
        ALTER TABLE `reportResultData` CHANGE `analysisDataId` `analysisDataId` int(11) unsigned NULL;
        ALTER TABLE `reportResultData` CHANGE `limits` `limits` varchar(80) NULL;
        ALTER TABLE `reportResultData` CHANGE `reportableUnits` `reportableUnits` varchar(80) NULL;

		INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'UPDATING Database Version..... ');

        INSERT INTO dbVersionHistory
        (
           version,
           versionDate
        ) VALUES (
          'LIMSv3_ALPHA_055',
           NOW()
        );

        UPDATE dbSettings
        SET `value` = 'LIMSv3_ALPHA_055'
        WHERE `dbSetting` = 'dbCurrentVersion';

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'UPDATING Database Version..... Success');
    ELSE

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'SKIPPING VERSION LIMSv3_ALPHA_054 UPDATES');

    END IF;


                      -- LIMSv3_ALPHA_055 --> LIMSv3_ALPHA_056
    IF EXISTS(SELECT 1 FROM dbSettings WHERE dbSetting =  'dbCurrentVersion' AND `value` = 'LIMSv3_ALPHA_055') THEN

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'SCHEMA VERSION LIMSv3_ALPHA_055 DETECTED');


		INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'UPDATING reportResultData..... ');

        ALTER TABLE `reportResultData`
        ADD COLUMN `lastUpdatedEventId` bigint(20) UNSIGNED NOT NULL AFTER `reportableUnits`,
        ADD CONSTRAINT `fksreportResultDataLastUpdateEventId` FOREIGN KEY (`eventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION;


		INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'UPDATING tests..... ');

        ALTER TABLE tests
        ADD COLUMN cptCode varchar(80) DEFAULT NULL AFTER `type`,
        ADD COLUMN zCode varchar(80) DEFAULT NULL AFTER `cptCode`,
        ADD COLUMN billingCode varchar(80) DEFAULT NULL AFTER `zCode`;

		INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'UPDATING Database Version..... ');


        INSERT INTO dbVersionHistory
        (
           version,
           versionDate
        ) VALUES (
          'LIMSv3_ALPHA_056',
           NOW()
        );

        UPDATE dbSettings
        SET `value` = 'LIMSv3_ALPHA_056'
        WHERE `dbSetting` = 'dbCurrentVersion';

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'UPDATING Database Version..... Success');
    ELSE

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'SKIPPING VERSION LIMSv3_ALPHA_055 UPDATES');

    END IF;

-- LIMSv3_ALPHA_056 --> LIMSv3_ALPHA_057

    IF EXISTS(SELECT 1 FROM dbSettings WHERE dbSetting =  'dbCurrentVersion' AND `value` = 'LIMSv3_ALPHA_056') THEN

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'SCHEMA VERSION LIMSv3_ALPHA_056 DETECTED');


    INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'UPDATING reportedData..... ');

        ALTER TABLE `reportedData` CHANGE `reportHTML` `reportHTML` mediumtext NOT NULL COMMENT '';

        ALTER TABLE `reportedData` DROP FOREIGN KEY `fkReportedDataFormatterVersionId`;
        ALTER TABLE `reportedData` DROP COLUMN `formatterVersionId`;

    INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'DROPPING reportJSONFormatterVersion..... ');

        DROP TABLE reportJsonFormatterVersion;

    INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'UPDATING reportResultData..... ');

        ALTER TABLE `reportResultData` DROP FOREIGN KEY `fkReportResultDataSpecimenId`;

         ALTER TABLE `reportResultData`
        ADD CONSTRAINT `fkReportResultDataSpecimenId` FOREIGN KEY (`specimenId`) REFERENCES `containers` (`containerId`) ON DELETE NO ACTION ON UPDATE NO ACTION;


        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'UPDATING Database Version.....');

        INSERT INTO dbVersionHistory
        (
           version,
           versionDate
        ) VALUES (
          'LIMSv3_ALPHA_057',
           NOW()
        );

        UPDATE dbSettings
        SET `value` = 'LIMSv3_ALPHA_057'
        WHERE `dbSetting` = 'dbCurrentVersion';

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'UPDATING Database Version..... Success');
    ELSE

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'SKIPPING VERSION LIMSv3_ALPHA_056 UPDATES');

    END IF;


-- LIMSv3_ALPHA_057 --> LIMSv3_ALPHA_058

    IF EXISTS(SELECT 1 FROM dbSettings WHERE dbSetting =  'dbCurrentVersion' AND `value` = 'LIMSv3_ALPHA_057') THEN

       INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'SCHEMA VERSION LIMSv3_ALPHA_057 DETECTED');

       INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'UPDATING reportedData');

       ALTER TABLE `reportedData`
       ADD COLUMN `lastUpdatedEventId` bigint(20) UNSIGNED NOT NULL AFTER `eventId`,
       ADD CONSTRAINT `fksreportedDataLastUpdateEventId` FOREIGN KEY (`eventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION;


       INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'UPDATING Database Version..... ');

       INSERT INTO dbVersionHistory
       (
           version,
           versionDate
       ) VALUES (
           'LIMSv3_ALPHA_058',
           NOW()
       );

       UPDATE dbSettings
       SET `value` = 'LIMSv3_ALPHA_058'
       WHERE `dbSetting` = 'dbCurrentVersion';

       INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'UPDATING Database Version..... Success');
    ELSE

       INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'SKIPPING VERSION LIMSv3_ALPHA_057 UPDATES');

    END IF;


-- LIMSv3_ALPHA_058 --> LIMSv3_ALPHA_059

    IF EXISTS(SELECT 1 FROM dbSettings WHERE dbSetting =  'dbCurrentVersion' AND `value` = 'LIMSv3_ALPHA_058') THEN

       INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'SCHEMA VERSION LIMSv3_ALPHA_058 DETECTED');

       INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'UPDATING analysisMethods');

       ALTER TABLE analysisMethods
       ADD methodType varchar(50) NOT NULL AFTER methodName;

       INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'UPDATING Database Version..... ');

       INSERT INTO dbVersionHistory
       (
           version,
           versionDate
       ) VALUES (
           'LIMSv3_ALPHA_059',
           NOW()
       );

       UPDATE dbSettings
       SET `value` = 'LIMSv3_ALPHA_059'
       WHERE `dbSetting` = 'dbCurrentVersion';

       INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'UPDATING Database Version..... Success');
    ELSE

       INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'SKIPPING VERSION LIMSv3_ALPHA_058 UPDATES');

    END IF;

-- LIMSv3_ALPHA_059 --> LIMSv3_ALPHA_060

    IF EXISTS(SELECT 1 FROM dbSettings WHERE dbSetting =  'dbCurrentVersion' AND `value` = 'LIMSv3_ALPHA_059') THEN

       INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'SCHEMA VERSION LIMSv3_ALPHA_058 DETECTED');

       INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'UPDATING reportResultData');

       ALTER TABLE `reportResultData`
       ADD COLUMN `previousReportResultDataId` int(11) UNSIGNED NULL AFTER `reportableUnits`,
       ADD COLUMN `currentResult` bit(1) NOT NULL DEFAULT b'1',
       CHANGE `interpretation` `interpretation` varchar(2000) NULL COMMENT '',
       ADD CONSTRAINT `fksreportResultDatapreviousReportResultDataId` FOREIGN KEY (`previousReportResultDataId`) REFERENCES `reportResultData` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;


       INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'UPDATING reportResultData..... Success');

       INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'CREATING reportModifications.....');

      CREATE TABLE `reportModifications` (
        `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
        `reportDetailsId` int(11) unsigned NOT NULL,
        `changeText` TEXT NOT NULL,
        `type` varchar(80) NOT NULL,
        `status` bit(1) DEFAULT b'0',
        `eventId` bigint(20) unsigned NOT NULL,
        `lastUpdatedEventId` bigint(20) unsigned NOT NULL,
        PRIMARY KEY (`id`) USING BTREE,
        CONSTRAINT `fkreportModificationsReportDetailsId` FOREIGN KEY (`reportDetailsId`) REFERENCES `reportDetails` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
        CONSTRAINT `fkreportModificationsEventId` FOREIGN KEY (`eventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION,
        CONSTRAINT `fkreportModificationsLastUpdatedEventId` FOREIGN KEY (`lastUpdatedEventId`) REFERENCES `events` (`eventId`) ON DELETE NO ACTION ON UPDATE NO ACTION
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

       INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'CREATING reportModifications..... Success');

       INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'UPDATING Database Version..... ');

       INSERT INTO dbVersionHistory
       (
           version,
           versionDate
       ) VALUES (
           'LIMSv3_ALPHA_060',
           NOW()
       );

       UPDATE dbSettings
       SET `value` = 'LIMSv3_ALPHA_060'
       WHERE `dbSetting` = 'dbCurrentVersion';

       INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'UPDATING Database Version..... Success');
    ELSE

       INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'SKIPPING VERSION LIMSv3_ALPHA_059 UPDATES');

    END IF;


-- LIMSv3_ALPHA_060 --> LIMSv3_ALPHA_061

    IF EXISTS(SELECT 1 FROM dbSettings WHERE dbSetting =  'dbCurrentVersion' AND `value` = 'LIMSv3_ALPHA_060') THEN

       INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'SCHEMA VERSION LIMSv3_ALPHA_058 DETECTED');

       INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'UPDATING reportResultData');

        ALTER TABLE storageDisplayRules MODIFY COLUMN id INT auto_increment;

       INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'UPDATING reportResultData..... Success');

       INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'UPDATING Database Version..... ');

       INSERT INTO dbVersionHistory
       (
           version,
           versionDate
       ) VALUES (
           'LIMSv3_ALPHA_061',
           NOW()
       );

       UPDATE dbSettings
       SET `value` = 'LIMSv3_ALPHA_061'
       WHERE `dbSetting` = 'dbCurrentVersion';

       INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'UPDATING Database Version..... Success');
    ELSE

       INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'SKIPPING VERSION LIMSv3_ALPHA_060 UPDATES');

    END IF;


-- LIMSv3_ALPHA_061 --> LIMSv3_ALPHA_062
    IF EXISTS(SELECT 1 FROM dbSettings WHERE dbSetting =  'dbCurrentVersion' AND `value` = 'LIMSv3_ALPHA_061') THEN

       INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'SCHEMA VERSION LIMSv3_ALPHA_061 DETECTED');

       INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'UPDATING xxxx.....');

       ALTER TABLE `reportModifications`
       CHANGE `type` `reportType` varchar(80) NOT NULL COMMENT '',
       CHANGE `status` `modStatus` bit(1) NULL DEFAULT b'1' COMMENT '';

       INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'UPDATING xxxx..... Success');

       INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'UPDATING Database Version..... ');

       INSERT INTO dbVersionHistory
       (
           version,
           versionDate
       ) VALUES (
           'LIMSv3_ALPHA_062',
           NOW()
       );

       UPDATE dbSettings
       SET `value` = 'LIMSv3_ALPHA_062'
       WHERE `dbSetting` = 'dbCurrentVersion';

       INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'UPDATING Database Version..... Success');
    ELSE

       INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'SKIPPING VERSION LIMSv3_ALPHA_062 UPDATES');
    END IF;

-- LIMSv3_ALPHA_062 --> LIMSv3_ALPHA_063
    IF EXISTS(SELECT 1 FROM dbSettings WHERE dbSetting =  'dbCurrentVersion' AND `value` = 'LIMSv3_ALPHA_062') THEN

       INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'SCHEMA VERSION LIMSv3_ALPHA_062 DETECTED');

       INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'UPDATING reportedData.....');

       ALTER TABLE `reportedData` 
       DROP FOREIGN KEY `fksreportedDataLastUpdateEventId`,
       ADD FOREIGN KEY (`lastUpdatedEventId`) REFERENCES `events` (`eventId`);

       INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'UPDATING xxxx..... Success');

       INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'UPDATING Database Version..... ');

       INSERT INTO dbVersionHistory
       (
           version,
           versionDate
       ) VALUES (
           'LIMSv3_ALPHA_063',
           NOW()
       );

       UPDATE dbSettings
       SET `value` = 'LIMSv3_ALPHA_063'
       WHERE `dbSetting` = 'dbCurrentVersion';

       INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'UPDATING Database Version..... Success');
    ELSE

       INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'SKIPPING VERSION LIMSv3_ALPHA_063 UPDATES');
    END IF;

-- LIMSv3_ALPHA_063 --> LIMSv3_ALPHA_064

    IF EXISTS(SELECT 1 FROM dbSettings WHERE dbSetting =  'dbCurrentVersion' AND `value` = 'LIMSv3_ALPHA_063') THEN

       INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'SCHEMA VERSION LIMSv3_ALPHA_063 DETECTED');

       INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'UPDATING analysisData.....');

       ALTER TABLE `analysisData`
       ADD COLUMN `imageResult` varchar(2000) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL AFTER dateTimeResult;

       INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'UPDATING analysisData..... Success');

       INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'UPDATING reportResultData.....');

       ALTER TABLE `reportResultData`
       ADD COLUMN `imageResult` varchar(2000) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL AFTER dateTimeResult;

       INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'UPDATING reportResultData..... Success');

       INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'UPDATING Database Version..... ');

       INSERT INTO dbVersionHistory
       (
           version,
           versionDate
       ) VALUES (
           'LIMSv3_ALPHA_064',
           NOW()
       );

       UPDATE dbSettings
       SET `value` = 'LIMSv3_ALPHA_064'
       WHERE `dbSetting` = 'dbCurrentVersion';

       INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'UPDATING Database Version..... Success');
    ELSE

       INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'SKIPPING VERSION LIMSv3_ALPHA_064 UPDATES');
    END IF;


-- LIMSv3_ALPHA_064 --> LIMSv3_ALPHA_065

    IF EXISTS(SELECT 1 FROM dbSettings WHERE dbSetting =  'dbCurrentVersion' AND `value` = 'LIMSv3_ALPHA_064') THEN

       INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'SCHEMA VERSION LIMSv3_ALPHA_064 DETECTED');

       INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'UPDATING analysisData.....');

       ALTER TABLE `analysisControlData`
       ADD COLUMN `imageResult` varchar(2000) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL AFTER dateTimeResult;


       INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'UPDATING Database Version..... ');

       INSERT INTO dbVersionHistory
       (
           version,
           versionDate
       ) VALUES (
           'LIMSv3_ALPHA_065',
           NOW()
       );

       UPDATE dbSettings
       SET `value` = 'LIMSv3_ALPHA_065'
       WHERE `dbSetting` = 'dbCurrentVersion';

       INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'UPDATING Database Version..... Success');
    ELSE

       INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'SKIPPING VERSION LIMSv3_ALPHA_065 UPDATES');
    END IF;
    
    
-- LIMSv3_ALPHA_065 --> LIMSv3_ALPHA_066

    IF EXISTS(SELECT 1 FROM dbSettings WHERE dbSetting =  'dbCurrentVersion' AND `value` = 'LIMSv3_ALPHA_065') THEN

       INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'SCHEMA VERSION LIMSv3_ALPHA_065 DETECTED');

       INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'UPDATING requestForms.....');

        ALTER TABLE requestForms
        ADD COLUMN externalOrderId VARCHAR(80) NULL
        AFTER externalRequestId;

       INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'UPDATING requestSpecimens.....');

        ALTER TABLE requestSpecimens
        ADD COLUMN receivedTime time DEFAULT NULL AFTER receivedDate,
        ADD COLUMN sampleContainerCategory varchar(80) DEFAULT NULL AFTER specimenSource;

       INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'UPDATING Database Version..... ');

       INSERT INTO dbVersionHistory
       (
           version,
           versionDate
       ) VALUES (
           'LIMSv3_ALPHA_066',
           NOW()
       );

       UPDATE dbSettings
       SET `value` = 'LIMSv3_ALPHA_066'
       WHERE `dbSetting` = 'dbCurrentVersion';

       INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'UPDATING Database Version..... Success');
    ELSE

       INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'SKIPPING VERSION LIMSv3_ALPHA_065 UPDATES');
    END IF;

-- LIMSv3_ALPHA_066 --> LIMSv3_ALPHA_067

    IF EXISTS(SELECT 1 FROM dbSettings WHERE dbSetting =  'dbCurrentVersion' AND `value` = 'LIMSv3_ALPHA_066') THEN

       INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'SCHEMA VERSION LIMSv3_ALPHA_066 DETECTED');

       INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'UPDATING reportedData.....');

        ALTER TABLE reportedData
        MODIFY COLUMN pdfFilePath VARCHAR(255);


       INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'UPDATING Database Version..... ');

       INSERT INTO dbVersionHistory
       (
           version,
           versionDate
       ) VALUES (
           'LIMSv3_ALPHA_067',
           NOW()
       );

       UPDATE dbSettings
       SET `value` = 'LIMSv3_ALPHA_067'
       WHERE `dbSetting` = 'dbCurrentVersion';

       INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'UPDATING Database Version..... Success');
    ELSE

       INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'SKIPPING VERSION LIMSv3_ALPHA_066 UPDATES');
    END IF;
    
-- LIMSv3_ALPHA_067 --> LIMSv3_ALPHA_068

    IF EXISTS(SELECT 1 FROM dbSettings WHERE dbSetting =  'dbCurrentVersion' AND `value` = 'LIMSv3_ALPHA_067') THEN

       INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'SCHEMA VERSION LIMSv3_ALPHA_067 DETECTED');

       INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'UPDATING allReferences.....');

        ALTER TABLE allReferences
        MODIFY COLUMN reference text;


       INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'UPDATING Database Version..... ');

       INSERT INTO dbVersionHistory
       (
           version,
           versionDate
       ) VALUES (
           'LIMSv3_ALPHA_068',
           NOW()
       );

       UPDATE dbSettings
       SET `value` = 'LIMSv3_ALPHA_068'
       WHERE `dbSetting` = 'dbCurrentVersion';

       INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'UPDATING Database Version..... Success');
    ELSE

       INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'SKIPPING VERSION LIMSv3_ALPHA_067UPDATES');
    END IF;


-- LIMSv3_ALPHA_068 --> LIMSv3_ALPHA_069

    IF EXISTS(SELECT 1 FROM dbSettings WHERE dbSetting =  'dbCurrentVersion' AND `value` = 'LIMSv3_ALPHA_068') THEN

       INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'SCHEMA VERSION LIMSv3_ALPHA_068 DETECTED');

       INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'UPDATING analysisData.....');

       ALTER TABLE `analysisData` 
       ADD COLUMN `analysisDataDetectorId` INT(11) UNSIGNED NULL AFTER `analysisDataDefinitionId`;

       ALTER TABLE `analysisData`
       ADD CONSTRAINT `fksanalysisDataDectorIdandlysisDataId` FOREIGN KEY (`analysisDataDetectorId`) REFERENCES `analysisData` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

       INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'UPDATING analysisData..... Success');


       INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'UPDATING analysisDataLimits.....');

       ALTER TABLE `analysisDataLimits` 
       DROP INDEX `idxAnalysisDataLimitsAnalysisDataDefinitionId`, 
       ADD INDEX `idxAnalysisDataLimitsAnalysisDataDefinitionId` (`analysisDataDefinitionId`) USING BTREE;

       INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'UPDATING analysisDataLimits..... Success');

       INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'UPDATING analysisDataDefinition.....');

       ALTER TABLE `analysisDataDefinition`
       ADD COLUMN `detectorDefinitionId` INT(11) UNSIGNED NULL AFTER `analysisMethodVersionsId`;

       ALTER TABLE `analysisDataDefinition`
       ADD CONSTRAINT `fksdetectorDefinitionIdanalysisDataDefinitionId` FOREIGN KEY (`detectorDefinitionId`) REFERENCES `analysisDataDefinition` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

       INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'UPDATING analysisDataDefinition..... Success');

       INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'UPDATING Database Version..... ');

       INSERT INTO dbVersionHistory
       (
           version,
           versionDate
       ) VALUES (
           'LIMSv3_ALPHA_069',
           NOW()
       );

       UPDATE dbSettings
       SET `value` = 'LIMSv3_ALPHA_069'
       WHERE `dbSetting` = 'dbCurrentVersion';

       INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'UPDATING Database Version..... Success');
    ELSE

       INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'SKIPPING VERSION LIMSv3_ALPHA_068 UPDATES');
    END IF;

-- LIMSv3_ALPHA_069 --> LIMSv3_ALPHA_070

    IF EXISTS(SELECT 1 FROM dbSettings WHERE dbSetting =  'dbCurrentVersion' AND `value` = 'LIMSv3_ALPHA_069') THEN

       INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'SCHEMA VERSION LIMSv3_ALPHA_069 DETECTED');

       INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'UPDATING analysisDataDefinition.....');
      
       ALTER TABLE analysisDataDefinition
       ADD COLUMN `limitType` varchar(20) NULL AFTER `dataType`;

       INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'UPDATING analysisDataDefinition..... Success');

       INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'UPDATING Database Version..... ');

       INSERT INTO dbVersionHistory
       (
           version,
           versionDate
       ) VALUES (
           'LIMSv3_ALPHA_070',
           NOW()
       );

       UPDATE dbSettings
       SET `value` = 'LIMSv3_ALPHA_070'
       WHERE `dbSetting` = 'dbCurrentVersion';

       INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'UPDATING Database Version..... Success');
    ELSE

       INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'SKIPPING VERSION LIMSv3_ALPHA_069 UPDATES');
    END IF;
    



    -- LIMSv3_ALPHA_070 --> LIMSv3_ALPHA_071

    IF EXISTS(SELECT 1 FROM dbSettings WHERE dbSetting =  'dbCurrentVersion' AND `value` = 'LIMSv3_ALPHA_070') THEN

       INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'SCHEMA VERSION LIMSv3_ALPHA_070 DETECTED');

       INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'UPDATING analysisDataLimits.....');

       ALTER TABLE analysisDataLimits
       DROP COLUMN `units`;

       INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'UPDATING analysisDataLimits..... Success');
       
       INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'UPDATING analysisDataDefinition.....');

       ALTER TABLE analysisDataDefinition
       ADD COLUMN `units` VARCHAR(80) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci 
       NULL AFTER `limitType`;

       INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'UPDATING analysisDataDefinition..... Success');

       INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'UPDATING Database Version..... ');

       INSERT INTO dbVersionHistory
       (
           version,
           versionDate
       ) VALUES (
           'LIMSv3_ALPHA_071',
           NOW()
       );

       UPDATE dbSettings
       SET `value` = 'LIMSv3_ALPHA_071'
       WHERE `dbSetting` = 'dbCurrentVersion';

       INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'UPDATING Database Version..... Success');
    ELSE

       INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'SKIPPING VERSION LIMSv3_ALPHA_070 UPDATES');
    END IF;    

    -- LIMSv3_ALPHA_071 --> LIMSv3_ALPHA_072

    IF EXISTS(SELECT 1 FROM dbSettings WHERE dbSetting =  'dbCurrentVersion' AND `value` = 'LIMSv3_ALPHA_071') THEN

       INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'SCHEMA VERSION LIMSv3_ALPHA_071 DETECTED');

       INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'UPDATING analysisPoolTubeData.....');
       -- Image result to pool tube table
       ALTER TABLE `analysisPoolTubeData`
       ADD COLUMN `imageResult` varchar(2000) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL AFTER dateTimeResult;

       INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'UPDATING analysisPoolTubeData..... Success');

       INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'UPDATING analysisData.....');

       -- Change max length of varchar result to text per CR
       ALTER TABLE `analysisData` MODIFY COLUMN `varcharResult` text NULL AFTER `analysisDataDetectorId`;
       
       INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'UPDATING analysisData..... Success');

       INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'UPDATING Database Version..... ');

       INSERT INTO dbVersionHistory
       (
           version,
           versionDate
       ) VALUES (
           'LIMSv3_ALPHA_072',
           NOW()
       );

       UPDATE dbSettings
       SET `value` = 'LIMSv3_ALPHA_072'
       WHERE `dbSetting` = 'dbCurrentVersion';

       INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'UPDATING Database Version..... Success');
    ELSE

       INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'SKIPPING VERSION LIMSv3_ALPHA_071 UPDATES');
    END IF;


    -- LIMSv3_ALPHA_072 --> LIMSv3_ALPHA_073

    IF EXISTS(SELECT 1 FROM dbSettings WHERE dbSetting =  'dbCurrentVersion' AND `value` = 'LIMSv3_ALPHA_072') THEN

       INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'SCHEMA VERSION LIMSv3_ALPHA_072 DETECTED');

       INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'CREATING analysisDefinitionPanels.....');

      CREATE TABLE `analysisDefinitionPanels` (
        `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
        `definitionId` int(11) unsigned NOT NULL,
        `panelCode` varchar(80) CHARACTER SET utf8mb4 DEFAULT NULL,
        `eventId` bigint(20) unsigned NOT NULL,
        PRIMARY KEY (`id`),
        KEY `fkanalysisDataDefinitionId` (`definitionId`) USING BTREE,
        KEY `idxanalysisDefinitionEventId` (`eventId`) USING BTREE,
        KEY `idxanalysisDefinitionPanelCode` (`panelCode`) USING BTREE,
        CONSTRAINT `analysisdefinitionpanels_ibfk_1` FOREIGN KEY (`definitionId`) REFERENCES `analysisDataDefinition` (`id`),
        CONSTRAINT `analysisdefinitionpanels_ibfk_2` FOREIGN KEY (`panelCode`) REFERENCES `panels` (`panelCode`),
        CONSTRAINT `analysisdefinitionpanels_ibfk_3` FOREIGN KEY (`eventId`) REFERENCES `events` (`eventId`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

       INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'CREATING analysisDefinitionPanels..... Success');

       INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'UPDATING Database Version..... ');

       INSERT INTO dbVersionHistory
       (
           version,
           versionDate
       ) VALUES (
           'LIMSv3_ALPHA_073',
           NOW()
       );

       UPDATE dbSettings
       SET `value` = 'LIMSv3_ALPHA_073'
       WHERE `dbSetting` = 'dbCurrentVersion';

       INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'UPDATING Database Version..... Success');
    ELSE

       INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'SKIPPING VERSION LIMSv3_ALPHA_072 UPDATES');
    END IF;


    -- LIMSv3_ALPHA_073 --> LIMSv3_ALPHA_074
    IF EXISTS(SELECT 1 FROM dbSettings WHERE dbSetting =  'dbCurrentVersion' AND `value` = 'LIMSv3_ALPHA_073') THEN

       INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'SCHEMA VERSION LIMSv3_ALPHA_073 DETECTED');

       INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'UPDATING reportResultData.....');

       -- Review Result to reportresultdata table
       ALTER TABLE`reportResultData`
       ADD COLUMN `varcharReviewResult` varchar(80) DEFAULT NULL AFTER `varcharResult`;

       ALTER TABLE `reportResultData`
       ADD COLUMN `decimalReviewResult` decimal(20,6) DEFAULT NULL AFTER `decimalResult`;
    
       ALTER TABLE `reportResultData`
       ADD COLUMN `dateTimeReviewResult` datetime(6) DEFAULT NULL AFTER `dateTimeResult`;

       INSERT INTO dbVersionHistory
       (
           version,
           versionDate
       ) VALUES (
           'LIMSv3_ALPHA_074',
           NOW()
       );

       UPDATE dbSettings
       SET `value` = 'LIMSv3_ALPHA_074'
       WHERE `dbSetting` = 'dbCurrentVersion';

       INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'UPDATING Database Version..... Success');
    ELSE

       INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'SKIPPING VERSION LIMSv3_ALPHA_073 UPDATES');
    END IF;

-- LIMSv3_ALPHA_074 --> LIMSv3_ALPHA_075
    IF EXISTS(SELECT 1 FROM dbSettings WHERE dbSetting =  'dbCurrentVersion' AND `value` = 'LIMSv3_ALPHA_074') THEN
    
       INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'VERSION LIMSv3_ALPHA_074 DETECTED');
    
       -- ADD SQL UPDATE --
       
        ALTER TABLE `reportResultData`
        MODIFY COLUMN `dateTimeReviewResult` datetime(0) DEFAULT NULL AFTER `dateTimeResult`; 
    
       -- END SQL UPDATE --
    
       INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'UPDATING LIMS DB Version..... ');
    
       INSERT INTO dbVersionHistory
       (
           version,
           versionDate
       ) VALUES (
          'LIMSv3_ALPHA_075',
           NOW()
       );
    
       UPDATE dbSettings
       SET `value` = 'LIMSv3_ALPHA_075'
       WHERE `dbSetting` = 'dbCurrentVersion';
    
      INSERT INTO tmpUpgradeResults (resultType, result)
      VALUES ('INFO', 'UPDATING LIMS DB Version..... Success');
    ELSE
      INSERT INTO tmpUpgradeResults (resultType, result)
      VALUES ('INFO', 'SKIPPING VERSION LIMSv3_ALPHA_074 UPDATES');
    END IF;
    
-- LIMSv3_ALPHA_075 --> LIMSv3_ALPHA_076
    IF EXISTS(SELECT 1 FROM dbSettings WHERE dbSetting =  'dbCurrentVersion' AND `value` = 'LIMSv3_ALPHA_075') THEN
    
       INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'VERSION LIMSv3_ALPHA_075 DETECTED');
    
       -- ADD SQL UPDATE --
    
       ALTER TABLE clinicalInformation 
       MODIFY COLUMN lastPSA text;
       ALTER TABLE clinicalInformation 
       MODIFY COLUMN transfusionTransplantHistory text;
    
       -- END SQL UPDATE --
    
       INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'UPDATING LIMS DB Version..... ');
    
       INSERT INTO dbVersionHistory
       (
           version,
           versionDate
       ) VALUES (
          'LIMSv3_ALPHA_076',
           NOW()
       );
    
       UPDATE dbSettings
       SET `value` = 'LIMSv3_ALPHA_076'
       WHERE `dbSetting` = 'dbCurrentVersion';
    
      INSERT INTO tmpUpgradeResults (resultType, result)
      VALUES ('INFO', 'UPDATING LIMS DB Version..... Success');
    ELSE
      INSERT INTO tmpUpgradeResults (resultType, result)
      VALUES ('INFO', 'SKIPPING VERSION LIMSv3_ALPHA_075 UPDATES');
    END IF;
    
    
    
    
-- LIMSv3_ALPHA_076 --> LIMSv3_ALPHA_077
    IF EXISTS(SELECT 1 FROM dbSettings WHERE dbSetting =  'dbCurrentVersion' AND `value` = 'LIMSv3_ALPHA_076') THEN
    
       INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'VERSION LIMSv3_ALPHA_076 DETECTED');
    
       -- ADD SQL UPDATE --
       CREATE TABLE customPgx (
            `workflow` VARCHAR(100) NOT NULL,
            `panelCode` VARCHAR(80) DEFAULT NULL,
            CONSTRAINT `fkcustomPgxPanelCode` FOREIGN KEY (`panelCode`) REFERENCES `panels` (`panelCode`) ON DELETE NO ACTION ON UPDATE NO ACTION
       ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
       -- END SQL UPDATE --
    
       INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'UPDATING LIMS DB Version..... ');
    
       INSERT INTO dbVersionHistory
       (
           version,
           versionDate
       ) VALUES (
          'LIMSv3_ALPHA_077',
           NOW()
       );
    
       UPDATE dbSettings
       SET `value` = 'LIMSv3_ALPHA_077'
       WHERE `dbSetting` = 'dbCurrentVersion';
    
      INSERT INTO tmpUpgradeResults (resultType, result)
      VALUES ('INFO', 'UPDATING LIMS DB Version..... Success');
    ELSE
      INSERT INTO tmpUpgradeResults (resultType, result)
      VALUES ('INFO', 'SKIPPING VERSION LIMSv3_ALPHA_076 UPDATES');
    END IF;
    
-- LIMSv3_ALPHA_077 --> LIMSv3_ALPHA_078
    IF EXISTS(SELECT 1 FROM dbSettings WHERE dbSetting =  'dbCurrentVersion' AND `value` = 'LIMSv3_ALPHA_077') THEN
    
       INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'VERSION LIMSv3_ALPHA_077 DETECTED');
    
       -- ADD SQL UPDATE --
       DROP TABLE IF EXISTS `customPgx`;
    
       -- END SQL UPDATE --
    
       INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'UPDATING LIMS DB Version..... ');
    
       INSERT INTO dbVersionHistory
       (
           version,
           versionDate
       ) VALUES (
          'LIMSv3_ALPHA_078',
           NOW()
       );
    
       UPDATE dbSettings
       SET `value` = 'LIMSv3_ALPHA_078'
       WHERE `dbSetting` = 'dbCurrentVersion';
    
      INSERT INTO tmpUpgradeResults (resultType, result)
      VALUES ('INFO', 'UPDATING LIMS DB Version..... Success');
    ELSE
      INSERT INTO tmpUpgradeResults (resultType, result)
      VALUES ('INFO', 'SKIPPING VERSION LIMSv3_ALPHA_077 UPDATES');
    END IF;
    
-- LIMSv3_ALPHA_078 --> LIMSv3_ALPHA_079
    IF EXISTS(SELECT 1 FROM dbSettings WHERE dbSetting =  'dbCurrentVersion' AND `value` = 'LIMSv3_ALPHA_078') THEN
    
       INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'VERSION LIMSv3_ALPHA_078 DETECTED');
    
       -- ADD SQL UPDATE --
       
        ALTER TABLE `analysisControlData` 
        ADD COLUMN `isReportable` bit(1) NOT NULL DEFAULT 1 AFTER `stepName`;
    
        ALTER TABLE `analysisPoolTubeData` 
        ADD COLUMN `isReportable` bit(1) NOT NULL DEFAULT 1 AFTER `stepName`;
    
        ALTER TABLE `analysisData` 
        ADD COLUMN `isReportable` bit(1) NOT NULL DEFAULT 1 AFTER `stepName`;
    
       -- END SQL UPDATE --
    
       INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'UPDATING LIMS DB Version..... ');
    
       INSERT INTO dbVersionHistory
       (
           version,
           versionDate
       ) VALUES (
          'LIMSv3_ALPHA_079',
           NOW()
       );
    
       UPDATE dbSettings
       SET `value` = 'LIMSv3_ALPHA_079'
       WHERE `dbSetting` = 'dbCurrentVersion';
    
      INSERT INTO tmpUpgradeResults (resultType, result)
      VALUES ('INFO', 'UPDATING LIMS DB Version..... Success');
    ELSE
      INSERT INTO tmpUpgradeResults (resultType, result)
      VALUES ('INFO', 'SKIPPING VERSION LIMSv3_ALPHA_078 UPDATES');
    END IF;
    
-- LIMSv3_ALPHA_079 --> LIMSv3_ALPHA_080
    IF EXISTS(SELECT 1 FROM dbSettings WHERE dbSetting =  'dbCurrentVersion' AND `value` = 'LIMSv3_ALPHA_079') THEN
    
       INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'VERSION LIMSv3_ALPHA_079 DETECTED');
    
       -- ADD SQL UPDATE --
    
            ALTER TABLE `patients` 
            ADD COLUMN `familyId` varchar(80) DEFAULT NULL  AFTER `userId`;
    		
    		ALTER TABLE `patientSources` 
            ADD COLUMN `familyId` varchar(80) DEFAULT NULL  AFTER `userId`;
    		
    		ALTER TABLE `patientHistory` 
            ADD COLUMN `familyId` varchar(80) DEFAULT NULL  AFTER `userId`; 
    
    		ALTER TABLE `proband` 
    		DROP COLUMN `familyId`;    
       -- END SQL UPDATE --
    
       INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'UPDATING LIMS DB Version..... ');
    
       INSERT INTO dbVersionHistory
       (
           version,
           versionDate
       ) VALUES (
          'LIMSv3_ALPHA_080',
           NOW()
       );
    
       UPDATE dbSettings
       SET `value` = 'LIMSv3_ALPHA_080'
       WHERE `dbSetting` = 'dbCurrentVersion';
    
      INSERT INTO tmpUpgradeResults (resultType, result)
      VALUES ('INFO', 'UPDATING LIMS DB Version..... Success');
    ELSE
      INSERT INTO tmpUpgradeResults (resultType, result)
      VALUES ('INFO', 'SKIPPING VERSION LIMSv3_ALPHA_079 UPDATES');
    END IF;
    
    -- ADD UPDATES HERE -- 

    -- TEMPLATE FOR NEXT VERSION UPDATES

    -- IF EXISTS(SELECT 1 FROM dbSettings WHERE dbSetting =  'dbCurrentVersion' AND `value` = 'LIMSv3_ALPHA_XXX') THEN

    --    INSERT INTO tmpUpgradeResults (resultType, result)
    --    VALUES ('INFO', 'SCHEMA VERSION LIMSv3_ALPHA_XXX DETECTED');

    --    INSERT INTO tmpUpgradeResults (resultType, result)
    --    VALUES ('INFO', 'UPDATING xxxx.....');

    --    ALTER TABLE `xxx`

    --    INSERT INTO tmpUpgradeResults (resultType, result)
    --    VALUES ('INFO', 'UPDATING xxxx..... Success');

    --    INSERT INTO tmpUpgradeResults (resultType, result)
    --    VALUES ('INFO', 'UPDATING Database Version..... ');

    --    INSERT INTO dbVersionHistory
    --    (
    --        version,
    --        versionDate
    --    ) VALUES (
    --        'LIMSv3_ALPHA_YYY',
    --        NOW()
    --    );

    --    UPDATE dbSettings
    --    SET `value` = 'LIMSv3_ALPHA_YYY'
    --    WHERE `dbSetting` = 'dbCurrentVersion';

    --    INSERT INTO tmpUpgradeResults (resultType, result)
    --    VALUES ('INFO', 'UPDATING Database Version..... Success');
    -- ELSE

    --    INSERT INTO tmpUpgradeResults (resultType, result)
    --    VALUES ('INFO', 'SKIPPING VERSION LIMSv3_ALPHA_XXX UPDATES');
    -- END IF;

    INSERT INTO tmpUpgradeResults (resultType, result)
    VALUES ('INFO', 'UPDATES COMPLETE');

    SELECT * FROM tmpUpgradeResults ORDER BY id;

    DROP TABLE IF EXISTS tmpUpgradeResults;

END $$

DELIMITER ;

CALL sp_Update_Mitogen_Schema();

-- END OF SCHEMA UPDATES

DELIMITER $$



DROP TRIGGER IF EXISTS `trgspecimenMethods_AFTER_INSERT` $$

CREATE  TRIGGER `trgspecimenMethods_AFTER_INSERT` AFTER INSERT ON `specimenMethods` FOR EACH ROW BEGIN
    DECLARE CUR_DATE DATETIME DEFAULT NOW();
    DECLARE TGR_ACTION VARCHAR(16) DEFAULT 'INSERT';
    DECLARE CUR_USER VARCHAR(255) DEFAULT SESSION_USER();
    INSERT INTO `specimenMethodsHistory`
    (
        `id`,
        `requestSpecimensId`,
        `panelCode`,
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
        NEW.panelCode,
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
END$$

DROP TRIGGER IF EXISTS `trgspecimenMethods_AFTER_UPDATE` $$

CREATE TRIGGER `trgspecimenMethods_AFTER_UPDATE` AFTER UPDATE ON `specimenMethods` FOR EACH ROW BEGIN
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
        `panelCode`,
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
        NEW.panelCode,
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

DROP TRIGGER IF EXISTS `trgconsumableHistory_AFTER_INSERT`$$

CREATE TRIGGER `trgconsumableHistory_AFTER_INSERT` AFTER INSERT ON `consumables` FOR EACH ROW
BEGIN
    DECLARE CUR_DATE DATETIME DEFAULT NOW();
    DECLARE TGR_ACTION VARCHAR(16) DEFAULT 'INSERT';
    DECLARE CUR_USER VARCHAR(255) DEFAULT SESSION_USER();

    INSERT INTO `consumablesHistory`
    (
        `id`,
        `consumableId`,
        `consumableType`,
        `catalogNo`,
        `quantity`,
        `unitOfMeasure`,
        `lotNumber`,
        `vendor`,
        `costPerUnit`,
        `receiveDate`,
        `expirationDate`,
        `status`,
        `eventId`,
        `historyStartDate`,
        `historyEndDate`,
        `historyAction`,
        `historyUser`
    )
    VALUES
    (
        NEW.id,
        NEW.consumableId,
        NEW.consumableType,
        NEW.catalogNo,
        NEW.quantity,
        NEW.unitOfMeasure,
        NEW.lotNumber,
        NEW.vendor,
        NEW.costPerUnit,
        NEW.receiveDate,
        NEW.expirationDate,
        NEW.status,
        NEW.eventId,
        CUR_DATE,
        NULL,
        TGR_ACTION,
        CUR_USER
    );
END$$

DROP TRIGGER IF EXISTS `trgconsumableHistory_AFTER_UPDATE`$$

CREATE TRIGGER `trgconsumableHistory_AFTER_UPDATE` AFTER UPDATE ON `consumables` FOR EACH ROW
BEGIN
    DECLARE CUR_DATE DATETIME DEFAULT NOW();
    DECLARE TGR_ACTION VARCHAR(16) DEFAULT 'UPDATE';
    DECLARE CUR_USER VARCHAR(255) DEFAULT SESSION_USER();

    INSERT INTO `consumablesHistory`
    (
        `id`,
        `consumableId`,
        `consumableType`,
        `catalogNo`,
        `quantity`,
        `unitOfMeasure`,
        `lotNumber`,
        `vendor`,
        `costPerUnit`,
        `receiveDate`,
        `expirationDate`,
        `status`,
        `eventId`,
        `historyStartDate`,
        `historyEndDate`,
        `historyAction`,
        `historyUser`
    )
    VALUES
    (
        NEW.id,
        NEW.consumableId,
        NEW.consumableType,
        NEW.catalogNo,
        NEW.quantity,
        NEW.unitOfMeasure,
        NEW.lotNumber,
        NEW.vendor,
        NEW.costPerUnit,
        NEW.receiveDate,
        NEW.expirationDate,
        NEW.status,
        NEW.eventId,
        CUR_DATE,
        NULL,
        TGR_ACTION,
        CUR_USER
    );
END $$

DROP TRIGGER IF EXISTS `trgconsumableHistory_AFTER_DELETE`$$

 CREATE  TRIGGER `trgconsumableHistory_AFTER_DELETE` AFTER DELETE ON `consumables` FOR EACH ROW
 BEGIN
    DECLARE CUR_DATE DATETIME DEFAULT NOW();
    DECLARE TGR_ACTION VARCHAR(16) DEFAULT 'INSERT';
    DECLARE CUR_USER VARCHAR(255) DEFAULT SESSION_USER();

    UPDATE consumablesHistory
    SET historyEndDate = CUR_DATE
    WHERE consumableId = OLD.consumableId
    AND historyEndDate IS NULL;

END $$

DROP TRIGGER IF EXISTS `trgcontrolHistory_AFTER_INSERT`$$

CREATE TRIGGER `trgcontrolHistory_AFTER_INSERT` AFTER INSERT ON `controls` FOR EACH ROW BEGIN
    DECLARE CUR_DATE DATETIME DEFAULT NOW();
    DECLARE TGR_ACTION VARCHAR(16) DEFAULT 'INSERT';
    DECLARE CUR_USER VARCHAR(255) DEFAULT SESSION_USER();

    INSERT INTO `controlHistory`
    (
        `id`,
        `controlId`,
        `controlType`,
        `catalogNo`,
        `quantity`,
        `unitOfMeasure`,
        `lotNumber`,
        `parentLot`,
        `vendor`,
        `storageId`,
        `projectType`,
        `costPerUnit`,
        `poNumber`,
        `receivedDate`,
        `expirationDate`,
        `qcStatus`,
        `status`,
        `qcType`,
        `eventId`,
        `historyStartDate`,
        `historyEndDate`,
        `historyAction`,
        `historyUser`
    )
    VALUES
    (
        NEW.id,
        NEW.controlId,
        NEW.controlType,
        NEW.catalogNo,
        NEW.quantity,
        NEW.unitOfMeasure,
        NEW.lotNumber,
        NEW.parentLot,
        NEW.vendor,
        NEW.storageId,
        NEW.projectType,
        NEW.costPerUnit,
        NEW.poNumber,
        NEW.receivedDate,
        NEW.expirationDate,
        NEW.qcStatus,
        NEW.status,
        NEW.qcType,
        NEW.eventId,
        CUR_DATE,
        NULL,
        TGR_ACTION,
        CUR_USER
    );
END $$

DROP TRIGGER IF EXISTS `trgcontrolHistory_AFTER_UPDATE`$$

CREATE TRIGGER `trgcontrolHistory_AFTER_UPDATE` AFTER UPDATE ON `controls` FOR EACH ROW BEGIN
    DECLARE CUR_DATE DATETIME DEFAULT NOW();
    DECLARE TGR_ACTION VARCHAR(16) DEFAULT 'UPDATE';
    DECLARE CUR_USER VARCHAR(255) DEFAULT SESSION_USER();

    INSERT INTO `controlHistory`
    (
        `id`,
        `controlId`,
        `controlType`,
        `catalogNo`,
        `quantity`,
        `unitOfMeasure`,
        `lotNumber`,
        `parentLot`,
        `vendor`,
        `storageId`,
        `projectType`,
        `costPerUnit`,
        `poNumber`,
        `receivedDate`,
        `expirationDate`,
        `qcStatus`,
        `status`,
        `qcType`,
        `eventId`,
        `historyStartDate`,
        `historyEndDate`,
        `historyAction`,
        `historyUser`
    )
    VALUES
    (
        NEW.id,
        NEW.controlId,
        NEW.controlType,
        NEW.catalogNo,
        NEW.quantity,
        NEW.unitOfMeasure,
        NEW.lotNumber,
        NEW.parentLot,
        NEW.vendor,
        NEW.storageId,
        NEW.projectType,
        NEW.costPerUnit,
        NEW.poNumber,
        NEW.receivedDate,
        NEW.expirationDate,
        NEW.qcStatus,
        NEW.status,
        NEW.qcType,
        NEW.eventId,
        CUR_DATE,
        NULL,
        TGR_ACTION,
        CUR_USER
    );
END $$

DROP TRIGGER IF EXISTS `trgcontrolHistory_AFTER_DELETE`$$

 CREATE  TRIGGER `trgcontrolHistory_AFTER_DELETE` AFTER DELETE ON `controls` FOR EACH ROW BEGIN
    DECLARE CUR_DATE DATETIME DEFAULT NOW();
    DECLARE TGR_ACTION VARCHAR(16) DEFAULT 'INSERT';
    DECLARE CUR_USER VARCHAR(255) DEFAULT SESSION_USER();

    UPDATE controlHistory
    SET historyEndDate = CUR_DATE
    WHERE controlId = OLD.controlId
    AND historyEndDate IS NULL;

END $$


DELIMITER ;

DROP PROCEDURE IF EXISTS sp_Update_Mitogen_Schema;
