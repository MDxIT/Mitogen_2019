SET character_set_client = 'utf8mb4';
SET character_set_connection = 'utf8mb4';
SET character_set_database = 'utf8mb4';
SET character_set_results = 'utf8mb4';
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;

    -- **** IMPORTANT!!
    -- Use this template when adding new seed data.
    -- PURPOSE: To be able to seemlessly add new seed data. This is mainly used
    --  when releasing build/installer..
    --
    -- UPGRADE FLOW:
    --      IF current version is v1:
    --          Add data and upgrade to v2
    --      ELSE:
    --          Skip updates
    --      IF current version is v2:
    --          Add data and upgrade to v3
    --      ELSE:
    --          Skip updates
    --      ...
    --      ...
    --      IF current version is XXX
    --          Add data and upgrade to YYY
    --      ELSE:
    --          Skip upgrades

    --  HOW TO TEST OR VERIFY YOUR CHANGES WORK:
    --      1.) Create an empty database locally for testing
    --      2.) Run schema.sql
    --      3.) Run schemaupdates.sql
    --      4.) Run this seed data script
    --      5.) Verify the current version in dbSettings


    --  Every release, we'll add a new version update
    --  HOW TO ADD NEW VERSION:
    --      1.) Copy template below
    --      2.) Find the end of the procedure call
    --      3.) Right after the last IF EXISTS statement,
    --          paste the template and uncomment everything except
    --          -- LIMSv3_ALPHADATA_XXX --> LIMSv3_ALPHADATA_YYY
    --      4.) Make sure the identation is consistent with the other
    --          IF EXISTS statements
    --      5.) Replace '** Insert data and logs here **' with the seed
    --          data and logs you want to add
    --      6.) Replace XXX with the current version
    --          You should be able to know the current version by
    --          checking the previous IF EXISTS statement.
    --      7.) Replace YYY with the next version


    -- ****TEMPLATE for setting up the next version. Do not delete
    -- **** START of template
    -- LIMSv3_ALPHADATA_XXX --> LIMSv3_ALPHADATA_YYY
    -- IF EXISTS(SELECT 1 FROM dbSettings WHERE dbSetting =  'dbCurrentDataVersion' AND `value` = 'LIMSv3_ALPHADATA_XXX') THEN
    --    ** Insert data and logs here**
    --    INSERT INTO tmpUpgradeResults (resultType, result)
    --    VALUES ('INFO', 'UPDATING Seed Data Version..... ');

    --    INSERT INTO dbVersionHistory
    --    (
    --       version,
    --        versionDate
    --    ) VALUES (
    --        'LIMSv3_ALPHADATA_YYY',
    --         NOW()
    --    );
    --    UPDATE dbSettings
    --    SET `value` = 'LIMSv3_ALPHADATA_YYY'
    --    WHERE `dbSetting` = 'dbCurrentDataVersion';

    --   INSERT INTO tmpUpgradeResults (resultType, result)
    --   VALUES ('INFO', 'UPDATING Seed Data Version..... Success');
    --   ELSE
    --     INSERT INTO tmpUpgradeResults (resultType, result)
    --     VALUES ('INFO', 'SKIPPING VERSION LIMSv3_ALPHADATA_XXX UPDATES');
    -- END IF;
    -- **** END OF TEMPLATE


DELIMITER $$

DROP PROCEDURE IF EXISTS sp_Update_Mitogen_SeedData $$

CREATE PROCEDURE sp_Update_Mitogen_SeedData()

BEGIN
    DROP TABLE IF EXISTS tmpUpgradeResults;

    CREATE TEMPORARY TABLE tmpUpgradeResults (
        id INT(11) UNSIGNED AUTO_INCREMENT NOT NULL,
        resultType VARCHAR(255) NOT NULL,
        result longtext NOT NULL,
        resultTimeStamp DATETIME NOT NULL DEFAULT NOW(),
        PRIMARY KEY USING BTREE (ID)
    );

    IF EXISTS(SELECT 1 FROM dbSettings WHERE dbSetting =  'dbCurrentDataVersion' AND `value` = 'LIMSv3_ALPHADATA_000') THEN

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'SCHEMA VERSION LIMSv3_ALPHADATA_000 DETECTED');

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'Adding containers data');

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'Adding sequences data');

        INSERT INTO `sequences`(`sequenceName`, `lastNumber`, `prefixSQL`, `prefixValue`) VALUES
        ('requestId', 0, NULL, 'R'),
        ('patientId', 0, NULL, 'PA'),
        ('sqId', 0, NULL, 'SQID'),
        ('panels', 0, NULL, 'Panel_'),
        ('tests', 0, NULL, 'Test_'),
        ('methods', 0, NULL, 'Mthd_'),
        ('siteId', 0, NULL, 'SITE'),
        ('orgId', 0, NULL, 'ORG'),
        ('physicianId', 0, NULL, 'PH'),
        ('runId', 0, NULL, 'RUN'),
        ('insuranceCarrier', 0, NULL, 'IC'),
        ('preparedLotId', 0, NULL, 'LOT'),
        ('vendorId', 0, NULL, 'V'),
        ('batchId', 0, NULL, 'B'),
        ('tubeId', 0, NULL, 'T'),
        ('trayId', 0, NULL, 'TRAY'),
        ('documentId', 0, NULL, 'DOC'),
        ('serviceTicketId', 0, NULL, 'SRVC'),
        ('poolTubeId', 0, NULL, 'POOL'),
        ('poolRunId', 0, NULL, 'POOLRUN'),
        ('mergeId', 1, NULL, '');


        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'Adding validValues data');

        -- Valid Values
        INSERT IGNORE INTO `validValues`(`setName`, `displayValue`, `value`, `displayOrder`, `eventId`, `systemManaged`)
        VALUES
        ('status', 'enabled', '0', 1, 0, b'1'),
        ('status', 'disabled', '1', 2, 0, b'1'),

        ('yesno', 'Yes', 'Yes', 1, 0, b'1'),
        ('yesno', 'No', 'No', 2, 0, b'1'),

        ('passfail', 'pass', 'pass', 1, 0, b'1'),
        ('passfail', 'fail', 'fail', 2, 0, b'1'),
        ('passfail', 'Exception Handling', 'exceptionHandling', 3, 0, b'1'),

        ('exceptionHandling', 'Next Step', 'Next Step', 1, 0, b'1'),
        ('exceptionHandling', 'End Processing Send to Storage', 'End Processing Send to Storage', 2, 0, b'1'),
        ('exceptionHandling', 'End Processing Discard', 'End Processing Discard', 3, 0, b'1'),
        ('exceptionHandling', 'Send to contact customer', 'Contact Customer', 4, 0, b'1'),

        ('exceptionHandlingGroup', 'Next Step', 'Next Step', 1, 0, b'1'),
        ('exceptionHandlingGroup', 'End Processing Send to Storage', 'End Processing Send to Storage', 2, 0, b'1'),
        ('exceptionHandlingGroup', 'End Processing Discard', 'End Processing Discard', 3, 0, b'1'),
        ('exceptionHandlingParentGroup', 'Next Step', 'Next Step', 1, 0, b'1'),

        ('instances', 'Order Entry', 'New', 1, 0, b'1'),
        ('instances', 'Order Review', 'QC', 2, 0, b'1'),
        ('instances', 'Edit Order', 'Edit', 3, 0, b'1'),
        ('instances', 'View Order', 'View', 4, 0, b'1'),
        ('instances', 'Specimen Receiving', 'Receiving', 5, 0, b'1'),

        -- Bill To
        ('billTo', 'Customer', 'Customer', 1, 0, b'1'),
        ('billTo', 'Patient', 'Patient', 2, 0, b'1'),
        ('billTo', 'No Charge', 'No Charge', 3, 0, b'1'),
        ('billTo', 'Other', 'Other', 4, 0, b'1'),

        -- user defined fields
        ('accessioningUserDefinedFields_InputTypes', 'Text', 'userDef_text', 1, 0, b'1'),
        ('accessioningUserDefinedFields_InputTypes', 'Select', 'userDef_select', 1, 0, b'1'),
        ('accessioningUserDefinedFields_InputTypes', 'Checkbox', 'userDef_checkbox', 1, 0, b'1'),
        ('accessioningUserDefinedFields_InputTypes', 'TextArea', 'userDef_textarea', 1, 0, b'1'),
        ('accessioningUserDefinedFields_InputTypes', 'Date', 'userDef_date', 1, 0, b'1'),

        -- sample list componenet
        ('sampleListOptions', 'Customer Name', 'Customer Name', 0, 0, b'1'),
        ('sampleListOptions', 'DOB', 'DOB', 0, 0, b'1'),
        ('sampleListOptions', 'FacilityID-MRN', 'FacilityID-MRN', 0, 0, b'1'),
        ('sampleListOptions', 'Patient Name', 'Patient Name', 0, 0, b'1'),
        ('sampleListOptions', 'Priority', 'Priority', 0, 0, b'1'),
        ('sampleListOptions', 'Queued By', 'Queued By', 0, 0, b'1'),
        ('sampleListOptions', 'Received Date', 'Received Date', 0, 0, b'1'),
        ('sampleListOptions', 'Specimen Type', 'Specimen Type', 0, 0, b'1'),
        ('sampleListOptions', 'Storage Location', 'Storage Location', 0, 0, b'1'),
        ('sampleListOptions', 'Tests', 'Tests', 0, 0, b'1'),

        -- Control Processing
        ('Control Processing Type', 'Run Control', 'Run Control', 1, 0, b'1'),
        ('Control Processing Type', 'Batch Control', 'Batch Control', 1, 0, b'1'),

        -- Hardcoded, user configurable
        -- Report Distribution
        ('reportDistributionMethods', 'EMR', 'EMR', 1, 0, b'0'),
        ('reportDistributionMethods', 'Fax', 'Fax', 2, 0, b'0'),

        -- billing payor relationship
        ('relationship', 'Self', 'Self', 1, 0, b'0'),
        ('relationship', 'Spouse', 'Spouse', 2, 0, b'0'),
        ('relationship', 'Child', 'Child', 3, 0, b'0'),
        ('relationship', 'Other', 'Other', 4, 0, b'0'),

        ('controlAdminUnits', 'uL', 'uL', 1, 0, b'0'),
        ('controlAdminUnits', 'mL', 'mL', 2, 0, b'0'),
        ('controlAdminUnits', 'L', 'L', 3, 0, b'0'),

        ('Provider Gender', 'Male', 'Male', 1, 0, b'0'),
        ('Provider Gender', 'Female', 'Female', 2, 0, b'0'),
        ('Provider Gender', 'Unknown', 'Unknown', 3, 0, b'0'),

        ('Provider Title', 'MD', 'MD', 1, 0, b'0'),
        ('Provider Title', 'MD–PhD', 'MD–PhD', 2, 0, b'0'),
        ('Provider Title', 'NP', 'NP', 3, 0, b'0'),
        ('Provider Title', 'RN', 'RN', 4, 0, b'0'),

        ('Provider Type', 'General Practitioner', 'General Practitioner', 1, 0, b'0'),
        ('Provider Type', 'Pathologist', 'Pathologist', 2, 0, b'0'),
        ('Provider Type', 'Urologist', 'Urologist', 3, 0, b'0'),
        ('Provider Type', 'Family Physician', 'Family Physician', 4, 0, b'0'),
        ('Provider Type', 'Internal Medicine Physician', 'Internal Medicine Physician', 5, 0, b'0'),
        ('Provider Type', 'Genetic Counselor', 'Genetic Counselor', 6, 0, b'0'),

        ('Proband Relationship', 'Brother', 'Brother', 1, 0, b'0'),
        ('Proband Relationship', 'Sister', 'Sister', 2, 0, b'0'),
        ('Proband Relationship', 'Father', 'Father', 3, 0, b'0'),
        ('Proband Relationship', 'Mother', 'Mother', 4, 0, b'0'),
        ('Proband Relationship', 'Child', 'Child', 5, 0, b'0'),
        ('Proband Relationship', 'Grand Child', 'Grand Child', 6, 0, b'0'),
        ('Proband Relationship', 'Great Grand Child', 'Great Grand Child', 7, 0, b'0'),
        ('Proband Relationship', 'Paternal Grand Father', 'Paternal Grand Father', 8, 0, b'0'),
        ('Proband Relationship', 'Paternal Grand Mother', 'Paternal Grand Mother', 9, 0, b'0'),
        ('Proband Relationship', 'Paternal Great Grand Father', 'Paternal Great Grand Father', 10, 0, b'0'),
        ('Proband Relationship', 'Paternal Great Grand Mother', 'Paternal Great Grand Mother', 11, 0, b'0'),
        ('Proband Relationship', 'Maternal Grand Father', 'Maternal Grand Father', 12, 0, b'0'),
        ('Proband Relationship', 'Maternal Grand Mother', 'Maternal Grand Mother', 13, 0, b'0'),
        ('Proband Relationship', 'Maternal Great Grand Father', 'Maternal Great Grand Father', 14, 0, b'0'),
        ('Proband Relationship', 'Maternal Great Grand Mother', 'Maternal Great Grand Mother', 15, 0, b'0'),
        ('Proband Relationship', 'self', 'self', 16, 0, b'0'),

        ('diagnosticCodeTypes', 'ICD10', 'ICD10', 1, 0, b'0'),

        ('workflows', 'General', 'General', 1, 0, b'0'),

        -- Defaults, user configurable

        ('Gender', 'Male', 'Male', 1, 0, b'0'),
        ('Gender', 'Female', 'Female', 2, 0, b'0'),
        ('Gender', 'Unknown', 'Unknown', 3, 0, b'0'),

        ('Priority', 'normal', '2', 1, 0, b'0'),
        ('Priority', 'STAT', '1', 2, 0, b'0'),

        ('Ethnicity', 'Caucasian', 'Caucasian', 1, 0, b'0'),
        ('Ethnicity', 'African American', 'African American', 2, 0, b'0'),
        ('Ethnicity', 'Asian', 'Asian', 3, 0, b'0'),
        ('Ethnicity', 'Native American', 'Native American', 4, 0, b'0'),
        ('Ethnicity', 'Hispanic', 'Hispanic', 5, 0, b'0'),
        ('Ethnicity', 'Pacific Islander', 'Pacific Islander', 5, 0, b'0'),
        ('Ethnicity', 'Unknown', 'Unknown', 6, 0, b'0'),

        ('External Systems', 'Xifin', 'Xifin', 1, 0, b'0'),
        ('External Systems', 'CCE', 'CCE', 2, 0, b'0'),
        ('External Systems', 'Other', 'Other', 3, 0, b'0'),



        ('Blood Type', 'A+', 'A+', 1, 0, b'0'),
        ('Blood Type', 'O+', 'O+', 2, 0, b'0'),
        ('Blood Type', 'B+', 'B+', 3, 0, b'0'),
        ('Blood Type', 'AB+', 'AB+', 4, 0, b'0'),
        ('Blood Type', 'A-', 'A-', 5, 0, b'0'),
        ('Blood Type', 'O-', 'O-', 6, 0, b'0'),
        ('Blood Type', 'B-', 'B-', 7, 0, b'0'),
        ('Blood Type', 'AB-', 'AB-', 8, 0, b'0'),

        ('Tissue Donor Relationship', 'Donor', 'Donor', 1, 0, b'0'),
        ('Tissue Donor Relationship', 'Recipient', 'Recipient', 2, 0, b'0'),

        ('Transfusion Status', 'Pre-transfusion', 'Pre-transfusion', 1, 0, b'0'),
        ('Transfusion Status', 'Post-transfusion', 'Post-transfusion', 2, 0, b'0'),


        ('Specimen Type', 'Blood', 'Blood', 1, 0, b'0'),
        ('Specimen Type', 'Bone Core', 'Bone Core', 2, 0, b'0'),
        ('Specimen Type', 'Bone Marrow', 'Bone Marrow', 3, 0, b'0'),
        ('Specimen Type', 'Buccal Swab', 'Buccal Swab', 4, 0, b'0'),
        ('Specimen Type', 'FFPE Block', 'FFPE Block', 5, 0, b'0'),
        ('Specimen Type', 'FFPE Slide', 'FFPE Slide', 6, 0, b'0'),
        ('Specimen Type', 'Serum', 'Serum', 7, 0, b'0'),
        ('Specimen Type', 'Sputum', 'Sputum', 8, 0, b'0'),

        ('Liquid Units', 'uL', 'uL', 1, 0, b'0'),
        ('Liquid Units', 'mL', 'mL', 2, 0, b'0'),

        ('Solid Units', 'mg', 'mg', 1, 0, b'0'),
        ('Solid Units', 'g', 'g', 2, 0, b'0'),
        ('Solid Units', 'count', 'count', 3, 0, b'0'),

        ('Patient Type', 'Public', 'Public', 1, 0, b'0'),
        ('Patient Type', 'Private', 'Private', 2, 0, b'0'),

        ('Specimen Condition', 'Acceptable', 'Acceptable', 1, 0, b'0'),
        ('Specimen Condition', 'Unacceptable', 'Unacceptable', 2, 0, b'0'),

        ('mapType', 'Transfer Map', 'Transfer Map', 1, 0, b'0'),
        ('mapType', 'Tray Map', 'Tray Map', 1, 0, b'0'),

        ('TrayType', 'Plate', 'Plate', 1, 0, b'0'),
        ('TrayType', 'Grid', 'Grid', 1, 0, b'0'),

        ('instrumentQCFrequencies', 'Daily', 'Daily', 1, 0, b'0'),
        ('instrumentQCFrequencies', 'Weekly', 'Weekly', 2, 0, b'0'),
        ('instrumentQCFrequencies', 'Monthly', 'Monthly', 3, 0, b'0'),
        ('instrumentQCFrequencies', 'Quarterly', 'Quarterly', 4, 0, b'0'),
        ('instrumentQCFrequencies', 'Semi-Annually', 'Semi-Annually', 5, 0, b'0'),
        ('instrumentQCFrequencies', 'Annually', 'Annually', 6, 0, b'0'),
        ('instrumentQCFrequencies', '10 Days', '10 Days', 7, 0, b'0'),

        ('Calibration Task', 'Calibration Task 1', 'Calibration Task 1', 1, 0, b'0'),
        ('Maintenance Task', 'Maintenance Task 1', 'Maintenance Task 1', 1, 0, b'0'),

        ('taskResultUnits', 'g/L', 'g/L', 1, 0, b'0'),
        ('taskResultUnits', 'ng/mL', 'ng/mL', 2, 0, b'0'),
        ('taskResultUnits', 'ng/nL', 'ng/nL', 3, 0, b'0'),
        ('taskResultUnits', 'uL', 'uL', 4, 0, b'0'),

        ('controlAdminUnits', 'L', 'L', 3, 0, b'0'),
        ('controlAdminUnits', 'mL', 'mL', 3, 0, b'0'),
        ('controlAdminUnits', 'uL', 'uL', 3, 0, b'0'),

        ('inventoryUnits', 'L', 'L', 3, 0, b'0'),
        ('inventoryUnits', 'mL', 'mL', 3, 0, b'0'),
        ('inventoryUnits', 'uL', 'uL', 3, 0, b'0'),

        ('normResult', 'Dilute', 'dilute', 1, 0, b'1'),
        ('normResult', 'Concentrate', 'concentrate', 2, 0, b'1'),
        ('normResult', 'Serial Dilute', 'serial dilute', 3, 0, b'1'),
        ('normResult', 'Manual Dilution', 'manual dilute', 4, 0, b'1'),

        ('Fraction', '1/2', '1/2', 1, 0, b'0'),
        ('Fraction', '1/3', '1/3', 3, 0, b'0'),
        ('Fraction', '1/4', '1/4', 2, 0, b'0'),
        ('Fraction', '1/8', '1/8', 4, 0, b'0'),
        ('Mass', 'g', 'g', 1, 0, b'0'),
        ('Mass', 'lb', 'lb', 2, 0, b'0'),
        ('Mass', 'mg', 'mg', 4, 0, b'0'),
        ('Mass', 'oz', 'oz', 3, 0, b'0'),
        ('Piece(s)', 'Boxes', 'Boxes', 2, 0, b'0'),
        ('Piece(s)', 'Things', 'Things', 3, 0, b'0'),
        ('Piece(s)', 'Tubes', 'Tubes', 1, 0, b'0'),
        ('Volume', 'cc', 'cc', 4, 0, b'0'),
        ('Volume', 'L', 'L', 3, 0, b'0'),
        ('Volume', 'mL', 'mL', 1, 0, b'0'),
        ('Volume', 'uL', 'uL', 2, 0, b'0'),


        ('MicroarrayCallOptions', 'Likely Pathogenic', 'Likely Pathogenic', 6, 0, b'1'),
        ('MicroarrayCallOptions', 'Pathogenic', 'Pathogenic', 6, 0, b'1'),
        ('MicroarrayCallOptions', 'Unknown Significance', 'Unknown Significance', 6, 0, b'1');


        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'Adding vendors data');
        -- No Vendor
        INSERT INTO `vendors` (`vendorId`, `vendor`, `accountNumber`, `eventId`)
        VALUES ('0', 'No Vendor', NULL, 0);

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'Adding protocolLibrary data');

        -- Static steps for PDR
        INSERT INTO `protocolLibrary` (`protocolName`, `addMenu`, `menuGrouping`)
        VALUES ('Orders', 1, '');

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'Adding protocolSteps data');

        INSERT INTO `protocolSteps` (`protocolLibraryId`, `stepName`, `displayName`, `stepType`)
        VALUES
          ( 1, 'Order Form', 'Order Form', ''),
          ( 1, 'Specimen Receiving', 'Specimen Receiving', '');

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'Adding numbers data');

        INSERT INTO `numbers` (`no`)
        VALUES (1), (2), (3), (4), (5), (6), (7), (8), (9), (10), (11), (12), (13), (14), (15), (16), (17), (18), (19), (20),
        (21), (22), (23), (24), (25), (26), (27), (28), (29), (30), (31), (32), (33), (34), (35), (36), (37), (38), (39), (40),
        (41), (42), (43), (44), (45), (46), (47), (48), (49), (50), (51), (52), (53), (54), (55), (56), (57), (58), (59), (60),
        (61), (62), (63), (64), (65), (66), (67), (68), (69), (70), (71), (72), (73), (74), (75), (76), (77), (78), (79), (80),
        (81), (82), (83), (84), (85), (86), (87), (88), (89), (90), (91), (92), (93), (94), (95), (96), (97), (98), (99), (100);


        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'Adding formConfigurableParts data');

        -- ConfigParts
        INSERT INTO `formConfigurableParts`(`formType`, `section`, `subSection`, `inputType`, `inputName`, `configSettingValue`, `required`, `screenLabel`, `placeholder`, `defaultValue`, `order`, `eventId`) VALUES
        -- ORDER INFO

        ('Accessioning', 'orderInformation', 'orderInformation', 'section', 'Order Information', NULL, b'1', b'1', b'0', b'1', '1-0-0', 0),
        ('Accessioning', 'orderInformation', 'orderInformation', 'container', 'requestId', NULL, b'1', b'1', b'0', b'0', '1-0-1', 0),
        ('Accessioning', 'orderInformation', 'orderInformation', 'text', 'externalRequestId', NULL, b'0', b'1', b'1', b'0', '1-0-2', 0),
        ('Accessioning', 'orderInformation', 'orderInformation', 'select', 'physicianSiteId', NULL, b'1', b'1', b'0', b'0', '1-0-3', 0),
        ('Accessioning', 'orderInformation', 'orderInformation', 'select', 'physicianId', NULL, b'1', b'1', b'0', b'0', '1-0-4', 0),
        ('Accessioning', 'orderInformation', 'orderInformation', 'date', 'orderInfoReceivedDate', NULL, b'1', b'1', b'1', b'0', '1-0-5', 0),
        ('Accessioning', 'orderInformation', 'orderInformation', 'setName', 'priority', NULL, b'0', b'1', b'0', b'1', '1-0-6', 0),
        ('Accessioning', 'orderInformation', 'orderInformation', 'setName', 'externalSystem', NULL, b'0', b'1', b'0', b'1', '1-0-7', 0),
        ('Accessioning', 'orderInformation', 'orderInformation', 'textArea', 'orderComment', NULL, b'0', b'1', b'1', b'0', '1-0-10', 0),

        -- PATIENT INFO
        ('Accessioning', 'patientInformation', 'patientInformation', 'section', 'Patient Information', NULL, b'1', b'1', b'0', b'1', '2-0-0', 0),
        -- patient search
        ('Accessioning', 'patientInformation', 'patientSearch', 'subSection', 'Patient Search', NULL, b'0', b'1', b'1', b'1', '2-1-0', 0),
        -- patient id
        ('Accessioning', 'patientInformation', 'patientIdentification', 'subSection', 'Patient Identification', NULL, b'1', b'1', b'0', b'1', '2-2-0', 0),
        ('Accessioning', 'patientInformation', 'patientIdentification', 'text', 'firstName', NULL, b'0', b'1', b'1', b'0', '2-2-1', 0),
        ('Accessioning', 'patientInformation', 'patientIdentification', 'text', 'middleName', NULL, b'0', b'1', b'1', b'0', '2-2-2', 0),
        ('Accessioning', 'patientInformation', 'patientIdentification', 'text', 'lastName', NULL, b'1', b'1', b'1', b'0', '2-2-3', 0),
        ('Accessioning', 'patientInformation', 'patientIdentification', 'text', 'dob', NULL, b'0', b'1', b'1', b'0', '2-2-4', 0),
        ('Accessioning', 'patientInformation', 'patientIdentification', 'text', 'mrn', NULL, b'0', b'1', b'1', b'0', '2-2-5', 0),
        ('Accessioning', 'patientInformation', 'patientIdentification', 'text', 'govtId', NULL, b'0', b'1', b'1', b'0', '2-2-6', 0),
        ('Accessioning', 'patientInformation', 'patientIdentification', 'setName', 'geneticGender', NULL, b'0', b'1', b'0', b'1', '2-2-7', 0),
        ('Accessioning', 'patientInformation', 'patientIdentification', 'setName', 'genderId', NULL, b'0', b'1', b'0', b'1', '2-2-8', 0),
        ('Accessioning', 'patientInformation', 'patientIdentification', 'setName', 'ethnicity', NULL, b'0', b'1', b'0', b'1', '2-2-9', 0),
        -- patient contact
        ('Accessioning', 'patientInformation', 'patientContact', 'subSection', 'Patient Contact Information', NULL, b'0', b'1', b'1', b'1', '2-3-0', 0),
        ('Accessioning', 'patientInformation', 'patientContact', 'text', 'addressLine1', NULL, b'0', b'1', b'1', b'0', '2-3-1', 0),
        ('Accessioning', 'patientInformation', 'patientContact', 'text', 'addressLine2', NULL, b'0', b'1', b'1', b'0', '2-3-2', 0),
        ('Accessioning', 'patientInformation', 'patientContact', 'text', 'city', NULL, b'0', b'1', b'1', b'0', '2-3-3', 0),
        ('Accessioning', 'patientInformation', 'patientContact', 'text', 'state', NULL, b'0', b'1', b'1', b'0', '2-3-4', 0),
        ('Accessioning', 'patientInformation', 'patientContact', 'text', 'postalCode', NULL, b'0', b'1', b'1', b'0', '2-3-5', 0),
        ('Accessioning', 'patientInformation', 'patientContact', 'text', 'country', NULL, b'0', b'1', b'1', b'0', '2-3-6', 0),
        ('Accessioning', 'patientInformation', 'patientContact', 'text', 'homePhoneCountryCode', NULL, b'0', b'1', b'1', b'0', '2-3-7', 0),
        ('Accessioning', 'patientInformation', 'patientContact', 'text', 'homePhone', NULL, b'0', b'1', b'1', b'0', '2-3-8', 0),
        ('Accessioning', 'patientInformation', 'patientContact', 'text', 'workPhoneCountryCode', NULL, b'0', b'1', b'1', b'0', '2-3-9', 0),
        ('Accessioning', 'patientInformation', 'patientContact', 'text', 'workPhone', NULL, b'0', b'1', b'1', b'0', '2-3-10', 0),
        ('Accessioning', 'patientInformation', 'patientContact', 'text', 'mobilePhoneCountryCode', NULL, b'0', b'1', b'1', b'0', '2-3-11', 0),
        ('Accessioning', 'patientInformation', 'patientContact', 'text', 'mobilePhone', NULL, b'0', b'1', b'1', b'0', '2-3-12', 0),
        ('Accessioning', 'patientInformation', 'patientContact', 'text', 'email', NULL, b'0', b'1', b'1', b'0', '2-3-13', 0),

        -- CLINICAL INFO
        -- basic clinical info
        ('Accessioning', 'clinicalInformation', 'clinicalInformation', 'section', 'Clinical Information', NULL, b'0', b'0', b'0', b'0', '3-0-0', 0),
        ('Accessioning', 'clinicalInformation', 'clinicalInformationBasic', 'subSection', 'Base Clinical Information', NULL, b'0', b'0', b'0', b'0', '3-1-0', 0),
        ('Accessioning', 'clinicalInformation', 'clinicalInformationBasic', 'text', 'ageAtInitialPresentation', NULL, b'0', b'1', b'1', b'0', '3-1-1', 0),
        ('Accessioning', 'clinicalInformation', 'clinicalInformationBasic', 'textarea', 'clinicalNotes', NULL, b'0', b'1', b'1', b'0', '3-1-2', 0),
        ('Accessioning', 'clinicalInformation', 'clinicalInformationBasic', 'select', 'geneticCounselor', NULL, b'0', b'1', b'0', b'0', '3-1-3', 0),
        ('Accessioning', 'clinicalInformation', 'clinicalInformationBasic', 'textarea', 'clinicalHistory', NULL, b'0', b'1', b'1', b'0', '3-1-4', 0),
        ('Accessioning', 'clinicalInformation', 'clinicalInformationBasic', 'select', 'currentMedications', NULL, b'0', b'1', b'0', b'0', '3-1-5', 0),
        ('Accessioning', 'clinicalInformation', 'clinicalInformationBasic', 'select', 'problematicMedications', NULL, b'0', b'1', b'0', b'0', '3-1-6', 0),
        ('Accessioning', 'clinicalInformation', 'clinicalInformationBasic', 'select', 'drugAllergies', NULL, b'0', b'1', b'0', b'0', '3-1-7', 0),
        -- psa info
        ('Accessioning', 'clinicalInformation', 'PSA', 'subSection', 'PSA', NULL, b'0', b'0', b'0', b'0', '3-2-0', 0),
        ('Accessioning', 'clinicalInformation', 'PSA', 'date', 'dateOfLastPSA', NULL, b'0', b'1', b'1', b'0', '3-2-1', 0),
        ('Accessioning', 'clinicalInformation', 'PSA', 'date', 'lastPSA', NULL, b'0', b'1', b'1', b'0', '3-2-2', 0),
        ('Accessioning', 'clinicalInformation', 'PSA', 'text', 'percentFreePSA', NULL, b'0', b'1', b'1', b'0', '3-2-3', 0),
        -- dre info
        ('Accessioning', 'clinicalInformation', 'DRE', 'subSection', 'DRE', NULL, b'0', b'0', b'0', b'0', '3-3-0', 0),
        ('Accessioning', 'clinicalInformation', 'DRE', 'date', 'dateOfLastDRE', NULL, b'0', b'1', b'1', b'0', '3-3-1', 0),
        ('Accessioning', 'clinicalInformation', 'DRE', 'textarea', 'lastDREResults', NULL, b'0', b'1', b'1', b'0', '3-3-2', 0),
        -- biopsy info
        ('Accessioning', 'clinicalInformation', 'biopsy', 'subSection', 'Biopsy', NULL, b'0', b'0', b'0', b'0', '3-4-0', 0),
        ('Accessioning', 'clinicalInformation', 'biopsy', 'text', 'biopsyHistoryNumber', NULL, b'0', b'1', b'1', b'0', '3-4-1', 0),
        ('Accessioning', 'clinicalInformation', 'biopsy', 'textarea', 'biopsyHistoryOther', NULL, b'0', b'1', b'1', b'0', '3-4-2', 0),
        ('Accessioning', 'clinicalInformation', 'biopsy', 'textarea', 'histopathologyFindings', NULL, b'0', b'1', b'1', b'0', '3-4-3', 0),
        -- women's health
        ('Accessioning', 'clinicalInformation', 'womensHealth', 'subSection', 'Womens Health', NULL, b'0', b'0', b'0', b'0', '3-5-0', 0),
        ('Accessioning', 'clinicalInformation', 'womensHealth', 'date', 'lastMenstrualCycle', NULL, b'0', b'1', b'1', b'0', '3-5-1', 0),
        ('Accessioning', 'clinicalInformation', 'womensHealth', 'checkbox', 'pregnant', NULL, b'0', b'1', b'0', b'0', '3-5-2', 0),
        ('Accessioning', 'clinicalInformation', 'womensHealth', 'date', 'lastPregnancy', NULL, b'0', b'1', b'1', b'0', '3-5-3', 0),
        ('Accessioning', 'clinicalInformation', 'womensHealth', 'checkbox', 'hysterectomy', NULL, b'0', b'1', b'0', b'0', '3-5-4', 0),
        ('Accessioning', 'clinicalInformation', 'womensHealth', 'checkbox', 'miscarriages', NULL, b'0', b'1', b'0', b'0', '3-5-5', 0),
        ('Accessioning', 'clinicalInformation', 'womensHealth', 'checkbox', 'thyroidIssues', NULL, b'0', b'1', b'0', b'0', '3-5-6', 0),
        -- newbord screening
        ('Accessioning', 'clinicalInformation', 'newbornScreening', 'subSection', 'Newborn Screening', NULL, b'0', b'0', b'0', b'0', '3-6-0', 0),
        ('Accessioning', 'clinicalInformation', 'newbornScreening', 'text', 'birthWeight', NULL, b'0', b'1', b'1', b'0', '3-6-1', 0),
        ('Accessioning', 'clinicalInformation', 'newbornScreening', 'text', 'placeOfBirth', NULL, b'0', b'1', b'1', b'0', '3-6-2', 0),
        ('Accessioning', 'clinicalInformation', 'newbornScreening', 'text', 'birthTime', NULL, b'0', b'1', b'1', b'0', '3-6-3', 0),
        ('Accessioning', 'clinicalInformation', 'newbornScreening', 'text', 'locationOfSampling', NULL, b'0', b'1', b'1', b'0', '3-6-4', 0),
        ('Accessioning', 'clinicalInformation', 'newbornScreening', 'text', 'babyIdentifyingNumber', NULL, b'0', b'1', b'1', b'0', '3-6-5', 0),
        ('Accessioning', 'clinicalInformation', 'newbornScreening', 'setName', 'privatePublicPatient', NULL, b'0', b'1', b'0', b'1', '3-6-6', 0),
        ('Accessioning', 'clinicalInformation', 'newbornScreening', 'text', 'referringDoctor', NULL, b'0', b'1', b'1', b'0', '3-6-7', 0),
        ('Accessioning', 'clinicalInformation', 'newbornScreening', 'checkbox', 'repeatSample', NULL, b'0', b'1', b'0', b'0', '3-6-8', 0),
        ('Accessioning', 'clinicalInformation', 'newbornScreening', 'checkbox', 'familyHistoryCF', NULL, b'0', b'1', b'0', b'0', '3-6-9', 0),
        ('Accessioning', 'clinicalInformation', 'newbornScreening', 'checkbox', 'meconiumIleus', NULL, b'0', b'1', b'0', b'0', '3-6-10', 0),
        ('Accessioning', 'clinicalInformation', 'newbornScreening', 'setName', 'prePostTransfusion', NULL, b'0', b'1', b'0', b'1', '3-6-11', 0),
        ('Accessioning', 'clinicalInformation', 'newbornScreening', 'checkbox', 'ambiguousGenitalia', NULL, b'0', b'1', b'0', b'0', '3-6-12', 0),
        ('Accessioning', 'clinicalInformation', 'newbornScreening', 'text', 'motherFullName', NULL, b'0', b'1', b'1', b'0', '3-6-13', 0),
        ('Accessioning', 'clinicalInformation', 'newbornScreening', 'date', 'dateOfFirstMilk', NULL, b'0', b'1', b'1', b'0', '3-6-14', 0),
        ('Accessioning', 'clinicalInformation', 'newbornScreening', 'text', 'timeOfFirstMilk', NULL, b'0', b'1', b'1', b'0', '3-6-15', 0),
        ('Accessioning', 'clinicalInformation', 'newbornScreening', 'textArea', 'feedingHistory', NULL, b'0', b'1', b'1', b'0', '3-6-16', 0),
        ('Accessioning', 'clinicalInformation', 'newbornScreening', 'text', 'clinicalHistoryOfMother', NULL, b'0', b'1', b'1', b'0', '3-6-17', 0),
        -- Tissue Donor
        ('Accessioning', 'clinicalInformation', 'tissueDonors', 'subSection', 'Tissue Donors', NULL, b'0', b'0', b'0', b'0', '3-7-0', 0),
        ('Accessioning', 'clinicalInformation', 'tissueDonors', 'setName', 'donorOrRecipient', NULL, b'0', b'1', b'0', b'1', '3-7-1', 0),
        ('Accessioning', 'clinicalInformation', 'tissueDonors', 'textArea', 'transfusionHistory', NULL, b'0', b'1', b'1', b'0', '3-7-2', 0),
        ('Accessioning', 'clinicalInformation', 'tissueDonors', 'setName', 'bloodType', NULL, b'0', b'1', b'0', b'1', '3-7-3', 0),
        -- HIV Info
        ('Accessioning', 'clinicalInformation', 'hivInformation', 'subSection', 'HIV Information', NULL, b'0', b'0', b'0', b'0', '3-8-0', 0),
        ('Accessioning', 'clinicalInformation', 'hivInformation', 'textArea', 'transfusionTransplantHistory', NULL, b'0', b'1', b'1', b'0', '3-8-1', 0),

        -- PANELS
        ('Accessioning', 'panelSelection', 'panelSelection', 'section', 'Panel Selection', NULL, b'1', b'1', b'0', b'1', '4-0-0', 0),


        -- SPECIMEN INFO
        ('Accessioning', 'specimenInfo', 'specimenInfo', 'section', 'Specimen Information', NULL, b'1', b'1', b'0', b'1', '5-0-0', 0),
        ('Accessioning', 'specimenInfo', 'specimenInfo', 'queryValue_limit', 'specimenOrderMax', 1, b'1', b'1', b'0', b'1', '5-0-1', 0),
        -- specimen collection info
        ('Accessioning', 'specimenInfo', 'specimenEntry', 'subSection', 'Specimen Collection', NULL, b'1', b'1', b'0', b'1', '5-1-0', 0),
        ('Accessioning', 'specimenInfo', 'specimenEntry', 'column_text', 'expectedBarcode', NULL, b'0', b'1', b'1', b'0', '5-1-1', 0),
        ('Accessioning', 'specimenInfo', 'specimenEntry', 'column_text', 'externalIdentifier', NULL, b'0', b'1', b'1', b'0', '5-1-2', 0),
        ('Accessioning', 'specimenInfo', 'specimenEntry', 'column_setName', 'specimenType', NULL, b'1', b'1', b'0', b'1', '5-1-3', 0),
        ('Accessioning', 'specimenInfo', 'specimenEntry', 'column_date', 'collectionDate', NULL, b'0', b'1', b'1', b'0', '5-1-4', 0),
        ('Accessioning', 'specimenInfo', 'specimenEntry', 'column_time', 'collectionTime', NULL, b'0', b'1', b'1', b'0', '5-1-5', 0),

        -- PROBAND
        ('Accessioning', 'proband', 'proband', 'section', 'Proband', NULL, b'0', b'1', b'0', b'1', '6-0-0', 0),

        -- REPORT DISTRIBUTION
        ('Accessioning', 'reportDistribution', 'reportDistribution', 'section', 'Report Distribution', NULL, b'0', b'1', b'0', b'1', '7-0-0', 0),
        ('Accessioning', 'reportDistribution', 'additionalRecipients', 'subSection', 'Additional Recipients', NULL, b'0', b'1', b'0', b'1', '7-1-0', 0),
        ('Accessioning', 'reportDistribution', 'additionalRecipientSearch', 'subSection', 'Additional Recipient Search', NULL, b'0', b'1', b'0', b'1', '7-2-0', 0),

        -- BILLING
        ('Accessioning', 'billing', 'billing', 'section', 'Billing Section', NULL, b'0', b'1', b'0', b'1', '8-0-0', 0),
        ('Accessioning', 'billing', 'diagnosticCodes', 'subSection', 'Medical Codes', NULL, b'0', b'1', b'1', b'1', '8-1-0', 0),
        ('Accessioning', 'billing', 'billing', 'text', 'governmentPolicyNumber1', NULL, b'0', b'1', b'1', b'0', '8-0-1', 0),
        ('Accessioning', 'billing', 'billing', 'text', 'governmentPolicyNumber2', NULL, b'0', b'1', b'1', b'0', '8-0-2', 0),
        ('Accessioning', 'billing', 'billing', 'text', 'policyHolder1Id', NULL, b'0', b'1', b'1', b'0', '8-0-3', 0),
        ('Accessioning', 'billing', 'billing', 'text', 'policyHolder2Id', NULL, b'0', b'1', b'1', b'0', '8-0-4', 0),

        -- CONSENT/AUTH
        ('Accessioning', 'consentForm', 'consentForm', 'section', 'Consent Form', NULL, b'0', b'1', b'0', b'1', '9-0-0', 0),
        -- patient consent
        ('Accessioning', 'consentForm', 'patientConsent', 'subSection', 'Patient Consent', NULL, b'0', b'1', b'0', b'1', '9-1-0', 0),
        ('Accessioning', 'consentForm', 'patientConsent', 'check', 'consent', NULL, b'0', b'1', b'0', b'0', '9-1-1', 0),
        ('Accessioning', 'consentForm', 'patientConsent', 'check', 'patientSignature', NULL, b'0', b'1', b'0', b'0', '9-1-2', 0),
        ('Accessioning', 'consentForm', 'patientConsent', 'text', 'consentBy', NULL, b'0', b'1', b'1', b'0', '9-1-3', 0),
        ('Accessioning', 'consentForm', 'patientConsent', 'setName', 'consenteePatientRelationship', NULL, b'0', b'1', b'0', b'1', '9-1-4', 0),
        ('Accessioning', 'consentForm', 'patientConsent', 'date', 'patientSignatureDate', NULL, b'0', b'1', b'1', b'0', '9-1-5', 0),
        -- physician authorization
        ('Accessioning', 'consentForm', 'physicianAuthorization', 'subSection', 'Physician Authorization', NULL, b'0', b'1', b'0', b'1', '9-2-0', 0),
        ('Accessioning', 'consentForm', 'physicianAuthorization', 'check', 'physicianSignature', NULL, b'0', b'1', b'0', b'0', '9-2-1', 0),
        ('Accessioning', 'consentForm', 'physicianAuthorization', 'date', 'physicianSignatureDate', NULL, b'0', b'1', b'1', b'0', '9-2-2', 0),
        ('Accessioning', 'consentForm', 'physicianAuthorization', 'textarea', 'physicianComment', NULL, b'0', b'1', b'1', b'0', '9-2-3', 0),

        -- FILE UPLOAD
        ('Accessioning', 'fileUpload', 'fileUpload', 'section', 'File Upload', NULL, b'0', b'1', b'0', b'0', '10-0-0', 0),
        ('Accessioning', 'fileUpload', 'fileUpload', 'file', 'fileUpload_requisitionForm', NULL, b'0', b'1', b'0', b'0', '10-0-1', 0),
        ('Accessioning', 'fileUpload', 'fileUpload', 'file', 'fileUpload_specimenProcurement', NULL, b'0', b'1', b'0', b'0', '10-0-2', 0),
        ('Accessioning', 'fileUpload', 'fileUpload', 'file', 'fileUpload_insuranceInformation', NULL, b'0', b'1', b'0', b'0', '10-0-3', 0),
        ('Accessioning', 'fileUpload', 'fileUpload', 'file', 'fileUpload_emrSummarySheet', NULL, b'0', b'1', b'0', b'0', '10-0-4', 0),
        ('Accessioning', 'fileUpload', 'fileUpload', 'file', 'fileUpload_clinicalReport', NULL, b'0', b'1', b'0', b'0', '10-0-5', 0),
        ('Accessioning', 'fileUpload', 'fileUpload', 'file', 'fileUpload_other', NULL, b'0', b'1', b'0', b'0', '10-0-6', 0),

        -- specimen receiving
        ('Receiving', 'specimenInfo', 'specimenInfo', 'section', 'Receiving Information', NULL, b'1', b'1', b'0', b'1', '11-0-0', 0),
        ('Receiving', 'specimenInfo', 'specimenInfo', 'checkbox', 'printBarcodesButton', b'1', b'0', b'0', b'0', b'0', '11-0-1', 0),
        ('Receiving', 'specimenInfo', 'specimenInfo', 'checkbox', 'receiveAtOrderReview', b'1', b'0', b'0', b'0', b'0', '11-0-2', 0),
        ('Receiving', 'specimenInfo', 'receivingInfo', 'subSection', 'Specimen Information', NULL, b'1', b'1', b'0', b'0', '11-1-0', 0),
        ('Receiving', 'specimenInfo', 'receivingInfo', 'column_container', 'specimenId', NULL, b'1', b'1', b'1', b'0', '11-1-1', 0),
        ('Receiving', 'specimenInfo', 'receivingInfo', 'column_date', 'receivedDate', NULL, b'1', b'1', b'1', b'0', '11-1-2', 0),
        ('Receiving', 'specimenInfo', 'receivingInfo', 'column_select', 'tests', NULL, b'1', b'1', b'0', b'0', '11-1-3', 0),
        ('Receiving', 'specimenInfo', 'receivingInfo', 'column_select', 'method', b'0', b'0', b'1', b'1', b'0', '11-1-4', 0),
        ('Receiving', 'specimenInfo', 'receivingInfo', 'column_text', 'specimenQuantity', NULL, b'0', b'1', b'1', b'0', '11-1-5', 0),
        ('Receiving', 'specimenInfo', 'receivingInfo', 'column_setName', 'specimenUnits', NULL, b'0', b'1', b'0', b'1', '11-1-6', 0),
        ('Receiving', 'specimenInfo', 'receivingInfo', 'column_setName', 'specimenCondition', NULL, b'1', b'1', b'0', b'1', '11-1-7', 0),
        ('Receiving', 'specimenInfo', 'receivingInfo', 'column_textArea', 'specimenComments', NULL, b'0', b'1', b'0', b'1', '11-1-8', 0),
        ('Accessioning', 'orderInformation', 'orderInformation', 'text', 'department', NULL, b'0', b'1', b'0', b'0', '1-0-8', 0),
        ('Accessioning', 'orderInformation', 'orderInformation', 'text', 'location', NULL, b'0', b'1', b'0', b'0', '1-0-9', 0);


        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'Adding validValuesLinks data');
        -- Create settings for General Order Entry

        INSERT INTO `validValuesLinks`(`formConfigurablePartsId`, `setName`, `eventId`) VALUES
        (7, 'Priority', 0),
        (84, 'Blood Type', 0),
        (111, 'relationship', 0),
        (82, 'Tissue Donor Relationship', 0),
        (21, 'Ethnicity', 0),
        (8, 'External Systems', 0),
        (20, 'Gender', 0),
        (19, 'Gender', 0),
        (74, 'Transfusion Status', 0),
        (93, 'Specimen Type', 0),
        (133, 'Liquid Units', 0),
        (133, 'Solid Units', 0),
        (69, 'Patient Type', 0),
        (134, 'Specimen Condition', 0);


        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'Adding formDefinition data');

        ALTER TABLE `formDefinition` DISABLE KEYS;
        INSERT INTO `formDefinition`(`id`, `formType`, `instance`, `workflow`, `displayStepName`, `eventId`) VALUES
        (6, 'Accessioning', 'Edit', 'General', '', 0),
        (7, 'Accessioning', 'New', 'General', '', 0),
        (8, 'Accessioning', 'QC', 'General', '', 0),
        (9, 'Accessioning', 'Receiving', 'General', '', 0),
        (10, 'Accessioning', 'View', 'General', '', 0);
        ALTER TABLE `formDefinition` ENABLE KEYS;


        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'Adding formInputSettings data');

        ALTER TABLE `formInputSettings` DISABLE KEYS;
        INSERT INTO `formInputSettings`(`id`, `formDefinitionId`, `formConfigurablePartsId`, `showField`, `required`, `readonly`, `screenLabel`, `placeHolder`, `defaultValue`, `eventId`) VALUES
        (2, 9, 125, 'true', 'false', 'false', 'printBarcodesButton', '', '', 0),
        (3, 9, 126, 'false', 'false', 'false', 'receiveAtOrderReview', '', '', 0),
        (4, 9, 128, 'true', 'true', 'false', 'Specimen ID', '', '', 0),
        (5, 9, 129, 'true', 'true', 'false', 'Received Date', '', '', 0),
        (6, 9, 130, 'true', 'true', 'false', 'Test', '', '', 0),
        (7, 9, 131, 'true', 'false', 'false', 'Method', '', '', 0),
        (8, 9, 132, 'true', 'false', 'false', 'Specimen Quantity', '', '', 0),
        (9, 9, 133, 'true', 'false', 'false', 'Units', '', 'Liquid Units', 0),
        (10, 9, 134, 'true', 'true', 'false', 'Specimen Condition', '', 'Specimen Condition', 0),
        (11, 9, 135, 'true', 'false', 'false', 'Comments', '', '', 0),
        (12, 6, 1, 'true', 'false', 'false', 'Order Information', '', '', 0),
        (13, 6, 117, 'true', 'false', 'false', 'File Upload', '', '', 0),
        (14, 6, 10, 'true', 'false', 'false', 'Patient Information', '', '', 0),
        (15, 6, 36, 'true', 'false', 'false', 'Clinical Information', '', '', 0),
        (16, 6, 87, 'true', 'false', 'false', 'Panel Selection', '', '', 0),
        (17, 6, 88, 'true', 'false', 'false', 'Specimen Information', '', '', 0),
        (18, 6, 96, 'false', 'false', 'false', 'Proband', '', '', 0),
        (19, 6, 97, 'false', 'false', 'false', 'Report Distribution', '', '', 0),
        (20, 6, 100, 'true', 'false', 'false', 'Billing Section', '', '', 0),
        (21, 6, 106, 'true', 'false', 'false', 'Consent Form', '', '', 0),
        (22, 7, 1, 'true', 'false', 'false', 'Order Information', '', '', 0),
        (23, 7, 117, 'true', 'false', 'false', 'File Upload', '', '', 0),
        (24, 7, 10, 'true', 'false', 'false', 'Patient Information', '', '', 0),
        (25, 7, 36, 'true', 'false', 'false', 'Clinical Information', '', '', 0),
        (26, 7, 87, 'true', 'false', 'false', 'Panel Selection', '', '', 0),
        (27, 7, 88, 'true', 'false', 'false', 'Specimen Information', '', '', 0),
        (28, 7, 96, 'false', 'false', 'false', 'Proband', '', '', 0),
        (29, 7, 97, 'false', 'false', 'false', 'Report Distribution', '', '', 0),
        (30, 7, 100, 'true', 'false', 'false', 'Billing Section', '', '', 0),
        (31, 7, 106, 'true', 'false', 'false', 'Consent Form', '', '', 0),
        (32, 8, 1, 'true', 'false', 'false', 'Order Information', '', '', 0),
        (33, 8, 117, 'true', 'false', 'false', 'File Upload', '', '', 0),
        (34, 8, 10, 'true', 'false', 'false', 'Patient Information', '', '', 0),
        (35, 8, 36, 'true', 'false', 'false', 'Clinical Information', '', '', 0),
        (36, 8, 87, 'true', 'false', 'false', 'Panel Selection', '', '', 0),
        (37, 8, 88, 'true', 'false', 'false', 'Specimen Information', '', '', 0),
        (38, 8, 96, 'false', 'false', 'false', 'Proband', '', '', 0),
        (39, 8, 97, 'false', 'false', 'false', 'Report Distribution', '', '', 0),
        (40, 8, 100, 'true', 'false', 'false', 'Billing Section', '', '', 0),
        (41, 8, 106, 'true', 'false', 'false', 'Consent Form', '', '', 0),
        (42, 9, 124, 'true', 'false', 'false', 'Receiving Information', '', '', 0),
        (43, 10, 1, 'true', 'false', 'true', 'Order Information', '', '', 0),
        (44, 10, 117, 'true', 'false', 'true', 'File Upload', '', '', 0),
        (45, 10, 10, 'true', 'false', 'true', 'Patient Information', '', '', 0),
        (46, 10, 36, 'true', 'false', 'true', 'Clinical Information', '', '', 0),
        (47, 10, 87, 'true', 'false', 'true', 'Panel Selection', '', '', 0),
        (48, 10, 88, 'true', 'false', 'true', 'Specimen Information', '', '', 0),
        (49, 10, 96, 'false', 'false', 'true', 'Proband', '', '', 0),
        (50, 10, 97, 'false', 'false', 'true', 'Report Distribution', '', '', 0),
        (51, 10, 100, 'true', 'false', 'true', 'Billing Section', '', '', 0),
        (52, 10, 106, 'true', 'false', 'true', 'Consent Form', '', '', 0),
        (53, 6, 11, 'true', 'false', 'false', 'Patient Search', '', '', 0),
        (54, 6, 12, 'true', 'false', 'false', 'Patient Identification', '', '', 0),
        (55, 6, 22, 'true', 'false', 'false', 'Patient Contact Information', '', '', 0),
        (56, 6, 37, 'true', 'false', 'false', 'Base Clinical Information', '', '', 0),
        (57, 6, 45, 'false', 'false', 'false', 'PSA', '', '', 0),
        (58, 6, 49, 'false', 'false', 'false', 'DRE', '', '', 0),
        (59, 6, 52, 'false', 'false', 'false', 'Biopsy', '', '', 0),
        (60, 6, 56, 'false', 'false', 'false', 'Womens Health', '', '', 0),
        (61, 6, 63, 'false', 'false', 'false', 'Newborn Screening', '', '', 0),
        (62, 6, 81, 'false', 'false', 'false', 'Tissue Donors', '', '', 0),
        (63, 6, 85, 'false', 'false', 'false', 'HIV Information', '', '', 0),
        (64, 6, 90, 'true', 'false', 'false', 'Specimen Collection', '', '', 0),
        (65, 6, 98, 'false', 'false', 'false', 'Additional Recipients', '', '', 0),
        (66, 6, 99, 'false', 'false', 'false', 'Additional Recipient Search', '', '', 0),
        (67, 6, 101, 'true', 'false', 'false', 'Medical Codes', '', '', 0),
        (68, 6, 107, 'false', 'false', 'false', 'Patient Consent', '', '', 0),
        (69, 6, 113, 'true', 'false', 'false', 'Physician Authorization', '', '', 0),
        (70, 7, 11, 'true', 'false', 'false', 'Patient Search', '', '', 0),
        (71, 7, 12, 'true', 'false', 'false', 'Patient Identification', '', '', 0),
        (72, 7, 22, 'true', 'false', 'false', 'Patient Contact Information', '', '', 0),
        (73, 7, 37, 'true', 'false', 'false', 'Base Clinical Information', '', '', 0),
        (74, 7, 45, 'false', 'false', 'false', 'PSA', '', '', 0),
        (75, 7, 49, 'false', 'false', 'false', 'DRE', '', '', 0),
        (76, 7, 52, 'false', 'false', 'false', 'Biopsy', '', '', 0),
        (77, 7, 56, 'false', 'false', 'false', 'Womens Health', '', '', 0),
        (78, 7, 63, 'false', 'false', 'false', 'Newborn Screening', '', '', 0),
        (79, 7, 81, 'false', 'false', 'false', 'Tissue Donors', '', '', 0),
        (80, 7, 85, 'false', 'false', 'false', 'HIV Information', '', '', 0),
        (81, 7, 90, 'true', 'false', 'false', 'Specimen Collection', '', '', 0),
        (82, 7, 98, 'false', 'false', 'false', 'Additional Recipients', '', '', 0),
        (83, 7, 99, 'false', 'false', 'false', 'Additional Recipient Search', '', '', 0),
        (84, 7, 101, 'true', 'false', 'false', 'Medical Codes', '', '', 0),
        (85, 7, 107, 'false', 'false', 'false', 'Patient Consent', '', '', 0),
        (86, 7, 113, 'true', 'false', 'false', 'Physician Authorization', '', '', 0),
        (87, 8, 11, 'true', 'false', 'false', 'Patient Search', '', '', 0),
        (88, 8, 12, 'true', 'false', 'false', 'Patient Identification', '', '', 0),
        (89, 8, 22, 'true', 'false', 'false', 'Patient Contact Information', '', '', 0),
        (90, 8, 37, 'true', 'false', 'false', 'Base Clinical Information', '', '', 0),
        (91, 8, 45, 'false', 'false', 'false', 'PSA', '', '', 0),
        (92, 8, 49, 'false', 'false', 'false', 'DRE', '', '', 0),
        (93, 8, 52, 'false', 'false', 'false', 'Biopsy', '', '', 0),
        (94, 8, 56, 'false', 'false', 'false', 'Womens Health', '', '', 0),
        (95, 8, 63, 'false', 'false', 'false', 'Newborn Screening', '', '', 0),
        (96, 8, 81, 'false', 'false', 'false', 'Tissue Donors', '', '', 0),
        (97, 8, 85, 'false', 'false', 'false', 'HIV Information', '', '', 0),
        (98, 8, 90, 'true', 'false', 'false', 'Specimen Collection', '', '', 0),
        (99, 8, 98, 'false', 'false', 'false', 'Additional Recipients', '', '', 0),
        (100, 8, 99, 'false', 'false', 'false', 'Additional Recipient Search', '', '', 0),
        (101, 8, 101, 'true', 'false', 'false', 'Medical Codes', '', '', 0),
        (102, 8, 107, 'false', 'false', 'false', 'Patient Consent', '', '', 0),
        (103, 8, 113, 'true', 'false', 'false', 'Physician Authorization', '', '', 0),
        (104, 9, 127, 'true', 'false', 'false', 'Specimen Information', '', '', 0),
        (105, 10, 11, 'true', 'false', 'true', 'Patient Search', '', '', 0),
        (106, 10, 12, 'true', 'false', 'true', 'Patient Identification', '', '', 0),
        (107, 10, 22, 'true', 'false', 'true', 'Patient Contact Information', '', '', 0),
        (108, 10, 37, 'true', 'false', 'true', 'Base Clinical Information', '', '', 0),
        (109, 10, 45, 'false', 'false', 'true', 'PSA', '', '', 0),
        (110, 10, 49, 'false', 'false', 'true', 'DRE', '', '', 0),
        (111, 10, 52, 'false', 'false', 'true', 'Biopsy', '', '', 0),
        (112, 10, 56, 'false', 'false', 'true', 'Womens Health', '', '', 0),
        (113, 10, 63, 'false', 'false', 'true', 'Newborn Screening', '', '', 0),
        (114, 10, 81, 'false', 'false', 'true', 'Tissue Donors', '', '', 0),
        (115, 10, 85, 'false', 'false', 'true', 'HIV Information', '', '', 0),
        (116, 10, 90, 'true', 'false', 'true', 'Specimen Collection', '', '', 0),
        (117, 10, 98, 'false', 'false', 'true', 'Additional Recipients', '', '', 0),
        (118, 10, 99, 'false', 'false', 'true', 'Additional Recipient Search', '', '', 0),
        (119, 10, 101, 'true', 'false', 'true', 'Medical Codes', '', '', 0),
        (120, 10, 107, 'false', 'false', 'true', 'Patient Consent', '', '', 0),
        (121, 10, 113, 'true', 'false', 'true', 'Physician Authorization', '', '', 0),
        (122, 6, 2, 'false', 'false', 'false', 'Order ID', '', '', 0),
        (123, 6, 3, 'false', 'false', 'false', 'External Order ID', '', '', 0),
        (124, 6, 4, 'true', 'true', 'false', 'Site ID', '', '', 0),
        (125, 6, 5, 'true', 'true', 'false', 'Physician', '', '', 0),
        (126, 6, 6, 'true', 'false', 'false', 'Order Received Date', '', '', 0),
        (127, 6, 7, 'true', 'false', 'false', 'Priority', '', 'Priority', 0),
        (128, 6, 8, 'false', 'false', 'false', 'External System', '', 'External Systems', 0),
        (129, 6, 9, 'true', 'false', 'false', 'Order Comments', '', '', 0),
        (130, 6, 118, 'true', 'false', 'false', 'Requisition Form', '', '', 0),
        (131, 6, 119, 'false', 'false', 'false', 'Specimen Procurement', '', '', 0),
        (132, 6, 120, 'true', 'false', 'false', 'Insurance Card', '', '', 0),
        (133, 6, 121, 'false', 'false', 'false', 'EMR Summary Sheet', '', '', 0),
        (134, 6, 122, 'false', 'false', 'false', 'Clinical Report', '', '', 0),
        (135, 6, 123, 'true', 'false', 'false', 'Other', '', '', 0),
        (136, 6, 13, 'true', 'true', 'false', 'First Name', '', '', 0),
        (137, 6, 14, 'true', 'false', 'false', 'Middle Name', '', '', 0),
        (138, 6, 15, 'true', 'true', 'false', 'Last Name', '', '', 0),
        (139, 6, 16, 'true', 'true', 'false', 'DOB', '', '', 0),
        (140, 6, 17, 'true', 'true', 'false', 'MRN', '', '', 0),
        (141, 6, 18, 'false', 'false', 'false', 'Government Id', '', '', 0),
        (142, 6, 19, 'true', 'false', 'false', 'Gender', '', 'Gender', 0),
        (143, 6, 20, 'false', 'false', 'false', 'Gender ID', '', 'Gender', 0),
        (144, 6, 21, 'true', 'false', 'false', 'Ethnicity', '', 'Ethnicity', 0),
        (145, 6, 23, 'true', 'false', 'false', 'Address 1', '', '', 0),
        (146, 6, 32, 'true', 'false', 'false', 'Work Phone', '', '', 0),
        (147, 6, 33, 'false', 'false', 'false', 'mobilePhoneCountryCode', '', '', 0),
        (148, 6, 34, 'true', 'false', 'false', 'Mobile Phone', '', '', 0),
        (149, 6, 35, 'true', 'false', 'false', 'Email', '', '', 0),
        (150, 6, 24, 'true', 'false', 'false', 'Address 2', '', '', 0),
        (151, 6, 25, 'true', 'false', 'false', 'City', '', '', 0),
        (152, 6, 26, 'true', 'false', 'false', 'State', '', '', 0),
        (153, 6, 27, 'true', 'false', 'false', 'Zip', '', '', 0),
        (154, 6, 28, 'false', 'false', 'false', 'Country', '', '', 0),
        (155, 6, 29, 'false', 'false', 'false', 'homePhoneCountryCode', '', '', 0),
        (156, 6, 30, 'true', 'false', 'false', 'Home Phone', '', '', 0),
        (157, 6, 31, 'false', 'false', 'false', 'workPhoneCountryCode', '', '', 0),
        (158, 6, 38, 'false', 'false', 'false', 'Age at Presentation', '', '', 0),
        (159, 6, 39, 'false', 'false', 'false', 'Clinical Notes', '', '', 0),
        (160, 6, 40, 'false', 'false', 'false', 'Genetic Counselor', '', '', 0),
        (161, 6, 41, 'true', 'false', 'false', 'Clinical History', '', '', 0),
        (162, 6, 42, 'true', 'false', 'false', 'Current Medication', '', '', 0),
        (163, 6, 43, 'true', 'false', 'false', 'Problematic Medication', '', '', 0),
        (164, 6, 44, 'true', 'false', 'false', 'Drug Allergies', '', '', 0),
        (165, 6, 46, 'false', 'false', 'false', 'dateOfLastPSA', '', '', 0),
        (166, 6, 47, 'false', 'false', 'false', 'lastPSA', '', '', 0),
        (167, 6, 48, 'false', 'false', 'false', 'percentFreePSA', '', '', 0),
        (168, 6, 50, 'false', 'false', 'false', 'dateOfLastDRE', '', '', 0),
        (169, 6, 51, 'false', 'false', 'false', 'lastDREResults', '', '', 0),
        (170, 6, 53, 'false', 'false', 'false', 'biopsyHistoryNumber', '', '', 0),
        (171, 6, 54, 'false', 'false', 'false', 'biopsyHistoryOther', '', '', 0),
        (172, 6, 55, 'false', 'false', 'false', 'histopathologyFindings', '', '', 0),
        (173, 6, 57, 'false', 'false', 'false', 'lastMenstrualCycle', '', '', 0),
        (174, 6, 58, 'false', 'false', 'false', 'pregnant', '', '', 0),
        (175, 6, 59, 'false', 'false', 'false', 'lastPregnancy', '', '', 0),
        (176, 6, 60, 'false', 'false', 'false', 'hysterectomy', '', '', 0),
        (177, 6, 61, 'false', 'false', 'false', 'miscarriages', '', '', 0),
        (178, 6, 62, 'false', 'false', 'false', 'thyroidIssues', '', '', 0),
        (179, 6, 64, 'false', 'false', 'false', 'birthWeight', '', '', 0),
        (180, 6, 73, 'false', 'false', 'false', 'meconiumIleus', '', '', 0),
        (181, 6, 74, 'false', 'false', 'false', 'prePostTransfusion', '', 'Transfusion Status', 0),
        (182, 6, 75, 'false', 'false', 'false', 'ambiguousGenitalia', '', '', 0),
        (183, 6, 76, 'false', 'false', 'false', 'motherFullName', '', '', 0),
        (184, 6, 77, 'false', 'false', 'false', 'dateOfFirstMilk', '', '', 0),
        (185, 6, 78, 'false', 'false', 'false', 'timeOfFirstMilk', '', '', 0),
        (186, 6, 79, 'false', 'false', 'false', 'FeedingHistory', '', '', 0),
        (187, 6, 80, 'false', 'false', 'false', 'clinicalHistoryOfMother', '', '', 0),
        (188, 6, 65, 'false', 'false', 'false', 'placeOfBirth', '', '', 0),
        (189, 6, 66, 'false', 'false', 'false', 'birthTime', '', '', 0),
        (190, 6, 67, 'false', 'false', 'false', 'locationOfSampling', '', '', 0),
        (191, 6, 68, 'false', 'false', 'false', 'babyIdentifyingNumber', '', '', 0),
        (192, 6, 69, 'false', 'false', 'false', 'privatePublicPatient', '', 'Patient Type', 0),
        (193, 6, 70, 'false', 'false', 'false', 'referringDoctor', '', '', 0),
        (194, 6, 71, 'false', 'false', 'false', 'repeatSample', '', '', 0),
        (195, 6, 72, 'false', 'false', 'false', 'familyHistoryCF', '', '', 0),
        (196, 6, 82, 'false', 'false', 'false', 'donorOrRecipient', '', 'Tissue Donor Relationship', 0),
        (197, 6, 83, 'false', 'false', 'false', 'transfusionHistory', '', '', 0),
        (198, 6, 84, 'false', 'false', 'false', 'bloodType', '', 'Blood Type', 0),
        (199, 6, 86, 'false', 'false', 'false', 'transfusionTransplantHistory', '', '', 0),
        (200, 6, 89, 'true', 'false', 'false', 'specimenOrderMax', '', '1', 0),
        (201, 6, 91, 'false', 'false', 'false', 'Expected Barcode', '', '', 0),
        (202, 6, 92, 'true', 'false', 'false', 'External ID', '', '', 0),
        (203, 6, 93, 'true', 'false', 'false', 'Specimen Type', '', 'Specimen Type', 0),
        (204, 6, 94, 'true', 'false', 'false', 'Collection Date', '', '', 0),
        (205, 6, 95, 'true', 'false', 'false', 'Collection Time', '', '', 0),
        (206, 6, 102, 'true', 'true', 'false', 'Medicare', '', '', 0),
        (207, 6, 103, 'true', 'true', 'false', 'Medicaid', '', '', 0),
        (208, 6, 104, 'true', 'false', 'false', 'Policy Holder ID', '', '', 0),
        (209, 6, 105, 'true', 'false', 'false', 'Policy Holder ID', '', '', 0),
        (210, 6, 108, 'false', 'false', 'false', 'consent', '', '', 0),
        (211, 6, 109, 'false', 'false', 'false', 'patientSignature', '', '', 0),
        (212, 6, 110, 'false', 'false', 'false', 'consentBy', '', '', 0),
        (213, 6, 111, 'false', 'false', 'false', 'consenteePatientRelationship', '', 'relationship', 0),
        (214, 6, 112, 'false', 'false', 'false', 'patientSignatureDate', '', '', 0),
        (215, 6, 114, 'true', 'false', 'false', 'Physician Signature', '', '', 0),
        (216, 6, 115, 'true', 'false', 'false', 'Physician Signature Date', '', '', 0),
        (217, 6, 116, 'true', 'false', 'false', 'Physician Comments', '', '', 0),
        (218, 7, 2, 'false', 'false', 'false', 'Order ID', '', '', 0),
        (219, 7, 3, 'false', 'false', 'false', 'External Order ID', '', '', 0),
        (220, 7, 4, 'true', 'true', 'false', 'Site ID', '', '', 0),
        (221, 7, 5, 'true', 'true', 'false', 'Physician', '', '', 0),
        (222, 7, 6, 'true', 'false', 'false', 'Order Received Date', '', '', 0),
        (223, 7, 7, 'true', 'false', 'false', 'Priority', '', 'Priority', 0),
        (224, 7, 8, 'false', 'false', 'false', 'External System', '', 'External Systems', 0),
        (225, 7, 9, 'true', 'false', 'false', 'Order Comments', '', '', 0),
        (226, 7, 118, 'true', 'false', 'false', 'Requisition Form', '', '', 0),
        (227, 7, 119, 'false', 'false', 'false', 'Specimen Procurement', '', '', 0),
        (228, 7, 120, 'true', 'false', 'false', 'Insurance Card', '', '', 0),
        (229, 7, 121, 'false', 'false', 'false', 'EMR Summary Sheet', '', '', 0),
        (230, 7, 122, 'false', 'false', 'false', 'Clinical Report', '', '', 0),
        (231, 7, 123, 'true', 'false', 'false', 'Other', '', '', 0),
        (232, 7, 13, 'true', 'true', 'false', 'First Name', '', '', 0),
        (233, 7, 14, 'true', 'false', 'false', 'Middle Name', '', '', 0),
        (234, 7, 15, 'true', 'true', 'false', 'Last Name', '', '', 0),
        (235, 7, 16, 'true', 'true', 'false', 'DOB', '', '', 0),
        (236, 7, 17, 'true', 'true', 'false', 'MRN', '', '', 0),
        (237, 7, 18, 'false', 'false', 'false', 'Government Id', '', '', 0),
        (238, 7, 19, 'true', 'false', 'false', 'Gender', '', 'Gender', 0),
        (239, 7, 20, 'false', 'false', 'false', 'Gender ID', '', 'Gender', 0),
        (240, 7, 21, 'true', 'false', 'false', 'Ethnicity', '', 'Ethnicity', 0),
        (241, 7, 23, 'true', 'false', 'false', 'Address 1', '', '', 0),
        (242, 7, 32, 'true', 'false', 'false', 'Work Phone', '', '', 0),
        (243, 7, 33, 'false', 'false', 'false', 'mobilePhoneCountryCode', '', '', 0),
        (244, 7, 34, 'true', 'false', 'false', 'Mobile Phone', '', '', 0),
        (245, 7, 35, 'true', 'false', 'false', 'Email', '', '', 0),
        (246, 7, 24, 'true', 'false', 'false', 'Address 2', '', '', 0),
        (247, 7, 25, 'true', 'false', 'false', 'City', '', '', 0),
        (248, 7, 26, 'true', 'false', 'false', 'State', '', '', 0),
        (249, 7, 27, 'true', 'false', 'false', 'Zip', '', '', 0),
        (250, 7, 28, 'false', 'false', 'false', 'Country', '', '', 0),
        (251, 7, 29, 'false', 'false', 'false', 'homePhoneCountryCode', '', '', 0),
        (252, 7, 30, 'true', 'false', 'false', 'Home Phone', '', '', 0),
        (253, 7, 31, 'false', 'false', 'false', 'workPhoneCountryCode', '', '', 0),
        (254, 7, 38, 'false', 'false', 'false', 'Age at Presentation', '', '', 0),
        (255, 7, 39, 'false', 'false', 'false', 'Clinical Notes', '', '', 0),
        (256, 7, 40, 'false', 'false', 'false', 'Genetic Counselor', '', '', 0),
        (257, 7, 41, 'true', 'false', 'false', 'Clinical History', '', '', 0),
        (258, 7, 42, 'true', 'false', 'false', 'Current Medication', '', '', 0),
        (259, 7, 43, 'true', 'false', 'false', 'Problematic Medication', '', '', 0),
        (260, 7, 44, 'true', 'false', 'false', 'Drug Allergies', '', '', 0),
        (261, 7, 46, 'false', 'false', 'false', 'dateOfLastPSA', '', '', 0),
        (262, 7, 47, 'false', 'false', 'false', 'lastPSA', '', '', 0),
        (263, 7, 48, 'false', 'false', 'false', 'percentFreePSA', '', '', 0),
        (264, 7, 50, 'false', 'false', 'false', 'dateOfLastDRE', '', '', 0),
        (265, 7, 51, 'false', 'false', 'false', 'lastDREResults', '', '', 0),
        (266, 7, 53, 'false', 'false', 'false', 'biopsyHistoryNumber', '', '', 0),
        (267, 7, 54, 'false', 'false', 'false', 'biopsyHistoryOther', '', '', 0),
        (268, 7, 55, 'false', 'false', 'false', 'histopathologyFindings', '', '', 0),
        (269, 7, 57, 'false', 'false', 'false', 'lastMenstrualCycle', '', '', 0),
        (270, 7, 58, 'false', 'false', 'false', 'pregnant', '', '', 0),
        (271, 7, 59, 'false', 'false', 'false', 'lastPregnancy', '', '', 0),
        (272, 7, 60, 'false', 'false', 'false', 'hysterectomy', '', '', 0),
        (273, 7, 61, 'false', 'false', 'false', 'miscarriages', '', '', 0),
        (274, 7, 62, 'false', 'false', 'false', 'thyroidIssues', '', '', 0),
        (275, 7, 64, 'false', 'false', 'false', 'birthWeight', '', '', 0),
        (276, 7, 73, 'false', 'false', 'false', 'meconiumIleus', '', '', 0),
        (277, 7, 74, 'false', 'false', 'false', 'prePostTransfusion', '', 'Transfusion Status', 0),
        (278, 7, 75, 'false', 'false', 'false', 'ambiguousGenitalia', '', '', 0),
        (279, 7, 76, 'false', 'false', 'false', 'motherFullName', '', '', 0),
        (280, 7, 77, 'false', 'false', 'false', 'dateOfFirstMilk', '', '', 0),
        (281, 7, 78, 'false', 'false', 'false', 'timeOfFirstMilk', '', '', 0),
        (282, 7, 79, 'false', 'false', 'false', 'FeedingHistory', '', '', 0),
        (283, 7, 80, 'false', 'false', 'false', 'clinicalHistoryOfMother', '', '', 0),
        (284, 7, 65, 'false', 'false', 'false', 'placeOfBirth', '', '', 0),
        (285, 7, 66, 'false', 'false', 'false', 'birthTime', '', '', 0),
        (286, 7, 67, 'false', 'false', 'false', 'locationOfSampling', '', '', 0),
        (287, 7, 68, 'false', 'false', 'false', 'babyIdentifyingNumber', '', '', 0),
        (288, 7, 69, 'false', 'false', 'false', 'privatePublicPatient', '', 'Patient Type', 0),
        (289, 7, 70, 'false', 'false', 'false', 'referringDoctor', '', '', 0),
        (290, 7, 71, 'false', 'false', 'false', 'repeatSample', '', '', 0),
        (291, 7, 72, 'false', 'false', 'false', 'familyHistoryCF', '', '', 0),
        (292, 7, 82, 'false', 'false', 'false', 'donorOrRecipient', '', 'Tissue Donor Relationship', 0),
        (293, 7, 83, 'false', 'false', 'false', 'transfusionHistory', '', '', 0),
        (294, 7, 84, 'false', 'false', 'false', 'bloodType', '', 'Blood Type', 0),
        (295, 7, 86, 'false', 'false', 'false', 'transfusionTransplantHistory', '', '', 0),
        (296, 7, 89, 'true', 'false', 'false', 'specimenOrderMax', '', '5', 0),
        (297, 7, 91, 'false', 'false', 'false', 'Expected Barcode', '', '', 0),
        (298, 7, 92, 'true', 'false', 'false', 'External ID', '', '', 0),
        (299, 7, 93, 'true', 'false', 'false', 'Specimen Type', '', 'Specimen Type', 0),
        (300, 7, 94, 'true', 'false', 'false', 'Collection Date', '', '', 0),
        (301, 7, 95, 'true', 'false', 'false', 'Collection Time', '', '', 0),
        (302, 7, 102, 'true', 'true', 'false', 'Medicare', '', '', 0),
        (303, 7, 103, 'true', 'true', 'false', 'Medicaid', '', '', 0),
        (304, 7, 104, 'true', 'false', 'false', 'Policy Holder ID', '', '', 0),
        (305, 7, 105, 'true', 'false', 'false', 'Policy Holder ID', '', '', 0),
        (306, 7, 108, 'false', 'false', 'false', 'consent', '', '', 0),
        (307, 7, 109, 'false', 'false', 'false', 'patientSignature', '', '', 0),
        (308, 7, 110, 'false', 'false', 'false', 'consentBy', '', '', 0),
        (309, 7, 111, 'false', 'false', 'false', 'consenteePatientRelationship', '', 'relationship', 0),
        (310, 7, 112, 'false', 'false', 'false', 'patientSignatureDate', '', '', 0),
        (311, 7, 114, 'true', 'false', 'false', 'Physician Signature', '', '', 0),
        (312, 7, 115, 'true', 'false', 'false', 'Physician Signature Date', '', '', 0),
        (313, 7, 116, 'true', 'false', 'false', 'Physician Comments', '', '', 0),
        (314, 8, 2, 'false', 'false', 'false', 'Order ID', '', '', 0),
        (315, 8, 3, 'false', 'false', 'false', 'External Order ID', '', '', 0),
        (316, 8, 4, 'true', 'true', 'false', 'Site ID', '', '', 0),
        (317, 8, 5, 'true', 'true', 'false', 'Physician', '', '', 0),
        (318, 8, 6, 'true', 'false', 'false', 'Order Received Date', '', '', 0),
        (319, 8, 7, 'true', 'false', 'false', 'Priority', '', 'Priority', 0),
        (320, 8, 8, 'false', 'false', 'false', 'External System', '', 'External Systems', 0),
        (321, 8, 9, 'true', 'false', 'false', 'Order Comments', '', '', 0),
        (322, 8, 118, 'true', 'false', 'false', 'Requisition Form', '', '', 0),
        (323, 8, 119, 'false', 'false', 'false', 'Specimen Procurement', '', '', 0),
        (324, 8, 120, 'true', 'false', 'false', 'Insurance Card', '', '', 0),
        (325, 8, 121, 'false', 'false', 'false', 'EMR Summary Sheet', '', '', 0),
        (326, 8, 122, 'false', 'false', 'false', 'Clinical Report', '', '', 0),
        (327, 8, 123, 'true', 'false', 'false', 'Other', '', '', 0),
        (328, 8, 13, 'true', 'true', 'false', 'First Name', '', '', 0),
        (329, 8, 14, 'true', 'false', 'false', 'Middle Name', '', '', 0),
        (330, 8, 15, 'true', 'true', 'false', 'Last Name', '', '', 0),
        (331, 8, 16, 'true', 'true', 'false', 'DOB', '', '', 0),
        (332, 8, 17, 'true', 'true', 'false', 'MRN', '', '', 0),
        (333, 8, 18, 'false', 'false', 'false', 'Government Id', '', '', 0),
        (334, 8, 19, 'true', 'false', 'false', 'Gender', '', 'Gender', 0),
        (335, 8, 20, 'false', 'false', 'false', 'Gender ID', '', 'Gender', 0),
        (336, 8, 21, 'true', 'false', 'false', 'Ethnicity', '', 'Ethnicity', 0),
        (337, 8, 23, 'true', 'false', 'false', 'Address 1', '', '', 0),
        (338, 8, 32, 'true', 'false', 'false', 'Work Phone', '', '', 0),
        (339, 8, 33, 'false', 'false', 'false', 'mobilePhoneCountryCode', '', '', 0),
        (340, 8, 34, 'true', 'false', 'false', 'Mobile Phone', '', '', 0),
        (341, 8, 35, 'true', 'false', 'false', 'Email', '', '', 0),
        (342, 8, 24, 'true', 'false', 'false', 'Address 2', '', '', 0),
        (343, 8, 25, 'true', 'false', 'false', 'City', '', '', 0),
        (344, 8, 26, 'true', 'false', 'false', 'State', '', '', 0),
        (345, 8, 27, 'true', 'false', 'false', 'Zip', '', '', 0),
        (346, 8, 28, 'false', 'false', 'false', 'Country', '', '', 0),
        (347, 8, 29, 'false', 'false', 'false', 'homePhoneCountryCode', '', '', 0),
        (348, 8, 30, 'true', 'false', 'false', 'Home Phone', '', '', 0),
        (349, 8, 31, 'false', 'false', 'false', 'workPhoneCountryCode', '', '', 0),
        (350, 8, 38, 'false', 'false', 'false', 'Age at Presentation', '', '', 0),
        (351, 8, 39, 'false', 'false', 'false', 'Clinical Notes', '', '', 0),
        (352, 8, 40, 'false', 'false', 'false', 'Genetic Counselor', '', '', 0),
        (353, 8, 41, 'true', 'false', 'false', 'Clinical History', '', '', 0),
        (354, 8, 42, 'true', 'false', 'false', 'Current Medication', '', '', 0),
        (355, 8, 43, 'true', 'false', 'false', 'Problematic Medication', '', '', 0),
        (356, 8, 44, 'true', 'false', 'false', 'Drug Allergies', '', '', 0),
        (357, 8, 46, 'false', 'false', 'false', 'dateOfLastPSA', '', '', 0),
        (358, 8, 47, 'false', 'false', 'false', 'lastPSA', '', '', 0),
        (359, 8, 48, 'false', 'false', 'false', 'percentFreePSA', '', '', 0),
        (360, 8, 50, 'false', 'false', 'false', 'dateOfLastDRE', '', '', 0),
        (361, 8, 51, 'false', 'false', 'false', 'lastDREResults', '', '', 0),
        (362, 8, 53, 'false', 'false', 'false', 'biopsyHistoryNumber', '', '', 0),
        (363, 8, 54, 'false', 'false', 'false', 'biopsyHistoryOther', '', '', 0),
        (364, 8, 55, 'false', 'false', 'false', 'histopathologyFindings', '', '', 0),
        (365, 8, 57, 'false', 'false', 'false', 'lastMenstrualCycle', '', '', 0),
        (366, 8, 58, 'false', 'false', 'false', 'pregnant', '', '', 0),
        (367, 8, 59, 'false', 'false', 'false', 'lastPregnancy', '', '', 0),
        (368, 8, 60, 'false', 'false', 'false', 'hysterectomy', '', '', 0),
        (369, 8, 61, 'false', 'false', 'false', 'miscarriages', '', '', 0),
        (370, 8, 62, 'false', 'false', 'false', 'thyroidIssues', '', '', 0),
        (371, 8, 64, 'false', 'false', 'false', 'birthWeight', '', '', 0),
        (372, 8, 73, 'false', 'false', 'false', 'meconiumIleus', '', '', 0),
        (373, 8, 74, 'false', 'false', 'false', 'prePostTransfusion', '', 'Transfusion Status', 0),
        (374, 8, 75, 'false', 'false', 'false', 'ambiguousGenitalia', '', '', 0),
        (375, 8, 76, 'false', 'false', 'false', 'motherFullName', '', '', 0),
        (376, 8, 77, 'false', 'false', 'false', 'dateOfFirstMilk', '', '', 0),
        (377, 8, 78, 'false', 'false', 'false', 'timeOfFirstMilk', '', '', 0),
        (378, 8, 79, 'false', 'false', 'false', 'FeedingHistory', '', '', 0),
        (379, 8, 80, 'false', 'false', 'false', 'clinicalHistoryOfMother', '', '', 0),
        (380, 8, 65, 'false', 'false', 'false', 'placeOfBirth', '', '', 0),
        (381, 8, 66, 'false', 'false', 'false', 'birthTime', '', '', 0),
        (382, 8, 67, 'false', 'false', 'false', 'locationOfSampling', '', '', 0),
        (383, 8, 68, 'false', 'false', 'false', 'babyIdentifyingNumber', '', '', 0),
        (384, 8, 69, 'false', 'false', 'false', 'privatePublicPatient', '', 'Patient Type', 0),
        (385, 8, 70, 'false', 'false', 'false', 'referringDoctor', '', '', 0),
        (386, 8, 71, 'false', 'false', 'false', 'repeatSample', '', '', 0),
        (387, 8, 72, 'false', 'false', 'false', 'familyHistoryCF', '', '', 0),
        (388, 8, 82, 'false', 'false', 'false', 'donorOrRecipient', '', 'Tissue Donor Relationship', 0),
        (389, 8, 83, 'false', 'false', 'false', 'transfusionHistory', '', '', 0),
        (390, 8, 84, 'false', 'false', 'false', 'bloodType', '', 'Blood Type', 0),
        (391, 8, 86, 'false', 'false', 'false', 'transfusionTransplantHistory', '', '', 0),
        (392, 8, 89, 'true', 'false', 'false', 'specimenOrderMax', '', '5', 0),
        (393, 8, 91, 'false', 'false', 'false', 'Expected Barcode', '', '', 0),
        (394, 8, 92, 'true', 'false', 'false', 'External ID', '', '', 0),
        (395, 8, 93, 'true', 'true', 'false', 'Specimen Type', '', 'Specimen Type', 0),
        (396, 8, 94, 'true', 'false', 'false', 'Collection Date', '', '', 0),
        (397, 8, 95, 'true', 'false', 'false', 'Collection Time', '', '', 0),
        (398, 8, 102, 'true', 'true', 'false', 'Medicare', '', '', 0),
        (399, 8, 103, 'true', 'true', 'false', 'Medicaid', '', '', 0),
        (400, 8, 104, 'true', 'false', 'false', 'Policy Holder ID', '', '', 0),
        (401, 8, 105, 'true', 'false', 'false', 'Policy Holder ID', '', '', 0),
        (402, 8, 108, 'false', 'false', 'false', 'consent', '', '', 0),
        (403, 8, 109, 'false', 'false', 'false', 'patientSignature', '', '', 0),
        (404, 8, 110, 'false', 'false', 'false', 'consentBy', '', '', 0),
        (405, 8, 111, 'false', 'false', 'false', 'consenteePatientRelationship', '', 'relationship', 0),
        (406, 8, 112, 'false', 'false', 'false', 'patientSignatureDate', '', '', 0),
        (407, 8, 114, 'true', 'false', 'false', 'Physician Signature', '', '', 0),
        (408, 8, 115, 'true', 'false', 'false', 'Physician Signature Date', '', '', 0),
        (409, 8, 116, 'true', 'false', 'false', 'Physician Comments', '', '', 0),
        (410, 10, 2, 'false', 'false', 'true', 'Order ID', '', '', 0),
        (411, 10, 3, 'false', 'false', 'true', 'External Order ID', '', '', 0),
        (412, 10, 4, 'true', 'false', 'true', 'Site ID', '', '', 0),
        (413, 10, 5, 'true', 'false', 'true', 'Physician', '', '', 0),
        (414, 10, 6, 'true', 'false', 'true', 'Order Received Date', '', '', 0),
        (415, 10, 7, 'true', 'false', 'true', 'Priority', '', 'Priority', 0),
        (416, 10, 8, 'false', 'false', 'true', 'External System', '', 'External Systems', 0),
        (417, 10, 9, 'true', 'false', 'true', 'Order Comments', '', '', 0),
        (418, 10, 118, 'true', 'false', 'true', 'Requisition Form', '', '', 0),
        (419, 10, 119, 'false', 'false', 'true', 'Specimen Procurement', '', '', 0),
        (420, 10, 120, 'true', 'false', 'true', 'Insurance Card', '', '', 0),
        (421, 10, 121, 'false', 'false', 'true', 'EMR Summary Sheet', '', '', 0),
        (422, 10, 122, 'false', 'false', 'true', 'Clinical Report', '', '', 0),
        (423, 10, 123, 'true', 'false', 'true', 'Other', '', '', 0),
        (424, 10, 13, 'true', 'false', 'true', 'First Name', '', '', 0),
        (425, 10, 14, 'true', 'false', 'true', 'Middle Name', '', '', 0),
        (426, 10, 15, 'true', 'false', 'true', 'Last Name', '', '', 0),
        (427, 10, 16, 'true', 'false', 'true', 'DOB', '', '', 0),
        (428, 10, 17, 'true', 'false', 'true', 'MRN', '', '', 0),
        (429, 10, 18, 'false', 'false', 'true', 'Government Id', '', '', 0),
        (430, 10, 19, 'true', 'false', 'true', 'Gender', '', 'Gender', 0),
        (431, 10, 20, 'false', 'false', 'true', 'Gender ID', '', 'Gender', 0),
        (432, 10, 21, 'true', 'false', 'true', 'Ethnicity', '', 'Ethnicity', 0),
        (433, 10, 23, 'true', 'false', 'true', 'Address 1', '', '', 0),
        (434, 10, 32, 'true', 'false', 'true', 'Work Phone', '', '', 0),
        (435, 10, 33, 'false', 'false', 'true', 'mobilePhoneCountryCode', '', '', 0),
        (436, 10, 34, 'true', 'false', 'true', 'Mobile Phone', '', '', 0),
        (437, 10, 35, 'true', 'false', 'true', 'Email', '', '', 0),
        (438, 10, 24, 'true', 'false', 'true', 'Address 2', '', '', 0),
        (439, 10, 25, 'true', 'false', 'true', 'City', '', '', 0),
        (440, 10, 26, 'true', 'false', 'true', 'State', '', '', 0),
        (441, 10, 27, 'true', 'false', 'true', 'Zip', '', '', 0),
        (442, 10, 28, 'false', 'false', 'true', 'Country', '', '', 0),
        (443, 10, 29, 'false', 'false', 'true', 'homePhoneCountryCode', '', '', 0),
        (444, 10, 30, 'true', 'false', 'true', 'Home Phone', '', '', 0),
        (445, 10, 31, 'false', 'false', 'true', 'workPhoneCountryCode', '', '', 0),
        (446, 10, 38, 'false', 'false', 'true', 'Age at Presentation', '', '', 0),
        (447, 10, 39, 'false', 'false', 'true', 'Clinical Notes', '', '', 0),
        (448, 10, 40, 'false', 'false', 'true', 'Genetic Counselor', '', '', 0),
        (449, 10, 41, 'true', 'false', 'true', 'Clinical History', '', '', 0),
        (450, 10, 42, 'true', 'false', 'true', 'Current Medication', '', '', 0),
        (451, 10, 43, 'true', 'false', 'true', 'Problematic Medication', '', '', 0),
        (452, 10, 44, 'true', 'false', 'true', 'Drug Allergies', '', '', 0),
        (453, 10, 46, 'false', 'false', 'true', 'dateOfLastPSA', '', '', 0),
        (454, 10, 47, 'false', 'false', 'true', 'lastPSA', '', '', 0),
        (455, 10, 48, 'false', 'false', 'true', 'percentFreePSA', '', '', 0),
        (456, 10, 50, 'false', 'false', 'true', 'dateOfLastDRE', '', '', 0),
        (457, 10, 51, 'false', 'false', 'true', 'lastDREResults', '', '', 0),
        (458, 10, 53, 'false', 'false', 'true', 'biopsyHistoryNumber', '', '', 0),
        (459, 10, 54, 'false', 'false', 'true', 'biopsyHistoryOther', '', '', 0),
        (460, 10, 55, 'false', 'false', 'true', 'histopathologyFindings', '', '', 0),
        (461, 10, 57, 'false', 'false', 'true', 'lastMenstrualCycle', '', '', 0),
        (462, 10, 58, 'false', 'false', 'true', 'pregnant', '', '', 0),
        (463, 10, 59, 'false', 'false', 'true', 'lastPregnancy', '', '', 0),
        (464, 10, 60, 'false', 'false', 'true', 'hysterectomy', '', '', 0),
        (465, 10, 61, 'false', 'false', 'true', 'miscarriages', '', '', 0),
        (466, 10, 62, 'false', 'false', 'true', 'thyroidIssues', '', '', 0),
        (467, 10, 64, 'false', 'false', 'true', 'birthWeight', '', '', 0),
        (468, 10, 73, 'false', 'false', 'true', 'meconiumIleus', '', '', 0),
        (469, 10, 74, 'false', 'false', 'true', 'prePostTransfusion', '', 'Transfusion Status', 0),
        (470, 10, 75, 'false', 'false', 'true', 'ambiguousGenitalia', '', '', 0),
        (471, 10, 76, 'false', 'false', 'true', 'motherFullName', '', '', 0),
        (472, 10, 77, 'false', 'false', 'true', 'dateOfFirstMilk', '', '', 0),
        (473, 10, 78, 'false', 'false', 'true', 'timeOfFirstMilk', '', '', 0),
        (474, 10, 79, 'false', 'false', 'true', 'FeedingHistory', '', '', 0),
        (475, 10, 80, 'false', 'false', 'true', 'clinicalHistoryOfMother', '', '', 0),
        (476, 10, 65, 'false', 'false', 'true', 'placeOfBirth', '', '', 0),
        (477, 10, 66, 'false', 'false', 'true', 'birthTime', '', '', 0),
        (478, 10, 67, 'false', 'false', 'true', 'locationOfSampling', '', '', 0),
        (479, 10, 68, 'false', 'false', 'true', 'babyIdentifyingNumber', '', '', 0),
        (480, 10, 69, 'false', 'false', 'true', 'privatePublicPatient', '', 'Patient Type', 0),
        (481, 10, 70, 'false', 'false', 'true', 'referringDoctor', '', '', 0),
        (482, 10, 71, 'false', 'false', 'true', 'repeatSample', '', '', 0),
        (483, 10, 72, 'false', 'false', 'true', 'familyHistoryCF', '', '', 0),
        (484, 10, 82, 'false', 'false', 'true', 'donorOrRecipient', '', 'Tissue Donor Relationship', 0),
        (485, 10, 83, 'false', 'false', 'true', 'transfusionHistory', '', '', 0),
        (486, 10, 84, 'false', 'false', 'true', 'bloodType', '', 'Blood Type', 0),
        (487, 10, 86, 'false', 'false', 'true', 'transfusionTransplantHistory', '', '', 0),
        (488, 10, 89, 'true', 'false', 'true', 'specimenOrderMax', '', '', 0),
        (489, 10, 91, 'false', 'false', 'true', 'Expected Barcode', '', '', 0),
        (490, 10, 92, 'true', 'false', 'true', 'External ID', '', '', 0),
        (491, 10, 93, 'true', 'false', 'true', 'Specimen Type', '', 'Specimen Type', 0),
        (492, 10, 94, 'true', 'false', 'true', 'Collection Date', '', '', 0),
        (493, 10, 95, 'true', 'false', 'true', 'Collection Time', '', '', 0),
        (494, 10, 102, 'true', 'false', 'true', 'Medicare', '', '', 0),
        (495, 10, 103, 'true', 'false', 'true', 'Medicaid', '', '', 0),
        (496, 10, 104, 'true', 'false', 'true', 'Policy Holder ID', '', '', 0),
        (497, 10, 105, 'true', 'false', 'true', 'Policy Holder ID', '', '', 0),
        (498, 10, 108, 'false', 'false', 'true', 'consent', '', '', 0),
        (499, 10, 109, 'false', 'false', 'true', 'patientSignature', '', '', 0),
        (500, 10, 110, 'false', 'false', 'true', 'consentBy', '', '', 0),
        (501, 10, 111, 'false', 'false', 'true', 'consenteePatientRelationship', '', 'relationship', 0),
        (502, 10, 112, 'false', 'false', 'true', 'patientSignatureDate', '', '', 0),
        (503, 10, 114, 'true', 'false', 'true', 'Physician Signature', '', '', 0),
        (504, 10, 115, 'true', 'false', 'true', 'Physician Signature Date', '', '', 0),
        (505, 10, 116, 'true', 'false', 'true', 'Physician Comments', '', '', 0),

        (506, 6, 136, 'true', 'false', 'false', 'Department', '', '', 0),
        (507, 6, 137, 'true', 'false', 'false', 'Location', '', '', 0),
        (508, 7, 136, 'true', 'false', 'false', 'Department', '', '', 0),
        (509, 7, 137, 'true', 'false', 'false', 'Location', '', '', 0),
        (510, 8, 136, 'true', 'false', 'false', 'Department', '', '', 0),
        (511, 8, 137, 'true', 'false', 'false', 'Location', '', '', 0),
        (512, 10, 136, 'true', 'false', 'true', 'Department', '', '', 0),
        (513, 10, 137, 'true', 'false', 'true', 'Location', '', '', 0);




        ALTER TABLE `formInputSettings` ENABLE KEYS;

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'Adding formSettingsJSON data');

        ALTER TABLE `formSettingsJSON` DISABLE KEYS;
        INSERT INTO `formSettingsJSON`(`id`, `formDefinitionId`, `jsonObject`, `eventId`) VALUES
        (8, 6, '[{"inputType": "section", "show": "true", "readOnly": "false", "required": "false", "inputField": "Order Information", "placeHolder": "", "screenLabel": "Order Information", "defaultValue": "", "section": "orderInformation", "subSection": "orderInformation" },{"inputType": "section", "show": "true", "readOnly": "false", "required": "false", "inputField": "File Upload", "placeHolder": "", "screenLabel": "File Upload", "defaultValue": "", "section": "fileUpload", "subSection": "fileUpload" },{"inputType": "section", "show": "true", "readOnly": "false", "required": "false", "inputField": "Patient Information", "placeHolder": "", "screenLabel": "Patient Information", "defaultValue": "", "section": "patientInformation", "subSection": "patientInformation" },{"inputType": "section", "show": "true", "readOnly": "false", "required": "false", "inputField": "Clinical Information", "placeHolder": "", "screenLabel": "Clinical Information", "defaultValue": "", "section": "clinicalInformation", "subSection": "clinicalInformation" },{"inputType": "section", "show": "true", "readOnly": "false", "required": "false", "inputField": "Panel Selection", "placeHolder": "", "screenLabel": "Panel Selection", "defaultValue": "", "section": "panelSelection", "subSection": "panelSelection" },{"inputType": "section", "show": "true", "readOnly": "false", "required": "false", "inputField": "Specimen Information", "placeHolder": "", "screenLabel": "Specimen Information", "defaultValue": "", "section": "specimenInfo", "subSection": "specimenInfo" },{"inputType": "section", "show": "false", "readOnly": "false", "required": "false", "inputField": "Proband", "placeHolder": "", "screenLabel": "Proband", "defaultValue": "", "section": "proband", "subSection": "proband" },{"inputType": "section", "show": "false", "readOnly": "false", "required": "false", "inputField": "Report Distribution", "placeHolder": "", "screenLabel": "Report Distribution", "defaultValue": "", "section": "reportDistribution", "subSection": "reportDistribution" },{"inputType": "section", "show": "true", "readOnly": "false", "required": "false", "inputField": "Billing Section", "placeHolder": "", "screenLabel": "Billing Section", "defaultValue": "", "section": "billing", "subSection": "billing" },{"inputType": "section", "show": "true", "readOnly": "false", "required": "false", "inputField": "Consent Form", "placeHolder": "", "screenLabel": "Consent Form", "defaultValue": "", "section": "consentForm", "subSection": "consentForm" },{"inputType": "subSection", "show": "true", "readOnly": "false", "required": "false", "inputField": "Patient Search", "placeHolder": "", "screenLabel": "Patient Search", "defaultValue": "", "section": "patientInformation", "subSection": "patientSearch" },{"inputType": "subSection", "show": "true", "readOnly": "false", "required": "false", "inputField": "Patient Identification", "placeHolder": "", "screenLabel": "Patient Identification", "defaultValue": "", "section": "patientInformation", "subSection": "patientIdentification" },{"inputType": "subSection", "show": "true", "readOnly": "false", "required": "false", "inputField": "Patient Contact Information", "placeHolder": "", "screenLabel": "Patient Contact Information", "defaultValue": "", "section": "patientInformation", "subSection": "patientContact" },{"inputType": "subSection", "show": "true", "readOnly": "false", "required": "false", "inputField": "Base Clinical Information", "placeHolder": "", "screenLabel": "Base Clinical Information", "defaultValue": "", "section": "clinicalInformation", "subSection": "clinicalInformationBasic" },{"inputType": "subSection", "show": "false", "readOnly": "false", "required": "false", "inputField": "PSA", "placeHolder": "", "screenLabel": "PSA", "defaultValue": "", "section": "clinicalInformation", "subSection": "PSA" },{"inputType": "subSection", "show": "false", "readOnly": "false", "required": "false", "inputField": "DRE", "placeHolder": "", "screenLabel": "DRE", "defaultValue": "", "section": "clinicalInformation", "subSection": "DRE" },{"inputType": "subSection", "show": "false", "readOnly": "false", "required": "false", "inputField": "Biopsy", "placeHolder": "", "screenLabel": "Biopsy", "defaultValue": "", "section": "clinicalInformation", "subSection": "biopsy" },{"inputType": "subSection", "show": "false", "readOnly": "false", "required": "false", "inputField": "Womens Health", "placeHolder": "", "screenLabel": "Womens Health", "defaultValue": "", "section": "clinicalInformation", "subSection": "womensHealth" },{"inputType": "subSection", "show": "false", "readOnly": "false", "required": "false", "inputField": "Newborn Screening", "placeHolder": "", "screenLabel": "Newborn Screening", "defaultValue": "", "section": "clinicalInformation", "subSection": "newbornScreening" },{"inputType": "subSection", "show": "false", "readOnly": "false", "required": "false", "inputField": "Tissue Donors", "placeHolder": "", "screenLabel": "Tissue Donors", "defaultValue": "", "section": "clinicalInformation", "subSection": "tissueDonors" },{"inputType": "subSection", "show": "false", "readOnly": "false", "required": "false", "inputField": "HIV Information", "placeHolder": "", "screenLabel": "HIV Information", "defaultValue": "", "section": "clinicalInformation", "subSection": "hivInformation" },{"inputType": "subSection", "show": "true", "readOnly": "false", "required": "false", "inputField": "Specimen Collection", "placeHolder": "", "screenLabel": "Specimen Collection", "defaultValue": "", "section": "specimenInfo", "subSection": "specimenEntry" },{"inputType": "subSection", "show": "false", "readOnly": "false", "required": "false", "inputField": "Additional Recipients", "placeHolder": "", "screenLabel": "Additional Recipients", "defaultValue": "", "section": "reportDistribution", "subSection": "additionalRecipients" },{"inputType": "subSection", "show": "false", "readOnly": "false", "required": "false", "inputField": "Additional Recipient Search", "placeHolder": "", "screenLabel": "Additional Recipient Search", "defaultValue": "", "section": "reportDistribution", "subSection": "additionalRecipientSearch" },{"inputType": "subSection", "show": "true", "readOnly": "false", "required": "false", "inputField": "Medical Codes", "placeHolder": "", "screenLabel": "Medical Codes", "defaultValue": "", "section": "billing", "subSection": "diagnosticCodes" },{"inputType": "subSection", "show": "false", "readOnly": "false", "required": "false", "inputField": "Patient Consent", "placeHolder": "", "screenLabel": "Patient Consent", "defaultValue": "", "section": "consentForm", "subSection": "patientConsent" },{"inputType": "subSection", "show": "true", "readOnly": "false", "required": "false", "inputField": "Physician Authorization", "placeHolder": "", "screenLabel": "Physician Authorization", "defaultValue": "", "section": "consentForm", "subSection": "physicianAuthorization" },{"inputType": "container", "show": "false", "readOnly": "false", "required": "false", "inputField": "requestId", "placeHolder": "", "screenLabel": "Order ID", "defaultValue": "", "section": "orderInformation", "subSection": "orderInformation" },{"inputType": "text", "show": "false", "readOnly": "false", "required": "false", "inputField": "externalRequestId", "placeHolder": "", "screenLabel": "External Order ID", "defaultValue": "", "section": "orderInformation", "subSection": "orderInformation" },{"inputType": "select", "show": "true", "readOnly": "false", "required": "true", "inputField": "physicianSiteId", "placeHolder": "", "screenLabel": "Site ID", "defaultValue": "", "section": "orderInformation", "subSection": "orderInformation" },{"inputType": "select", "show": "true", "readOnly": "false", "required": "true", "inputField": "physicianId", "placeHolder": "", "screenLabel": "Physician", "defaultValue": "", "section": "orderInformation", "subSection": "orderInformation" },{"inputType": "date", "show": "true", "readOnly": "false", "required": "false", "inputField": "orderInfoReceivedDate", "placeHolder": "", "screenLabel": "Order Received Date", "defaultValue": "", "section": "orderInformation", "subSection": "orderInformation" },{"inputType": "setName", "show": "true", "readOnly": "false", "required": "false", "inputField": "priority", "placeHolder": "", "screenLabel": "Priority", "defaultValue": "Priority", "section": "orderInformation", "subSection": "orderInformation" },{"inputType": "setName", "show": "false", "readOnly": "false", "required": "false", "inputField": "externalSystem", "placeHolder": "", "screenLabel": "External System", "defaultValue": "External Systems", "section": "orderInformation", "subSection": "orderInformation" },{"inputType": "textArea", "show": "true", "readOnly": "false", "required": "false", "inputField": "orderComment", "placeHolder": "", "screenLabel": "Order Comments", "defaultValue": "", "section": "orderInformation", "subSection": "orderInformation" },{"inputType": "file", "show": "true", "readOnly": "false", "required": "false", "inputField": "fileUpload_requisitionForm", "placeHolder": "", "screenLabel": "Requisition Form", "defaultValue": "", "section": "fileUpload", "subSection": "fileUpload" },{"inputType": "file", "show": "false", "readOnly": "false", "required": "false", "inputField": "fileUpload_specimenProcurement", "placeHolder": "", "screenLabel": "Specimen Procurement", "defaultValue": "", "section": "fileUpload", "subSection": "fileUpload" },{"inputType": "file", "show": "true", "readOnly": "false", "required": "false", "inputField": "fileUpload_insuranceInformation", "placeHolder": "", "screenLabel": "Insurance Card", "defaultValue": "", "section": "fileUpload", "subSection": "fileUpload" },{"inputType": "file", "show": "false", "readOnly": "false", "required": "false", "inputField": "fileUpload_emrSummarySheet", "placeHolder": "", "screenLabel": "EMR Summary Sheet", "defaultValue": "", "section": "fileUpload", "subSection": "fileUpload" },{"inputType": "file", "show": "false", "readOnly": "false", "required": "false", "inputField": "fileUpload_clinicalReport", "placeHolder": "", "screenLabel": "Clinical Report", "defaultValue": "", "section": "fileUpload", "subSection": "fileUpload" },{"inputType": "file", "show": "true", "readOnly": "false", "required": "false", "inputField": "fileUpload_other", "placeHolder": "", "screenLabel": "Other", "defaultValue": "", "section": "fileUpload", "subSection": "fileUpload" },{"inputType": "text", "show": "true", "readOnly": "false", "required": "true", "inputField": "firstName", "placeHolder": "", "screenLabel": "First Name", "defaultValue": "", "section": "patientInformation", "subSection": "patientIdentification" },{"inputType": "text", "show": "true", "readOnly": "false", "required": "false", "inputField": "middleName", "placeHolder": "", "screenLabel": "Middle Name", "defaultValue": "", "section": "patientInformation", "subSection": "patientIdentification" },{"inputType": "text", "show": "true", "readOnly": "false", "required": "true", "inputField": "lastName", "placeHolder": "", "screenLabel": "Last Name", "defaultValue": "", "section": "patientInformation", "subSection": "patientIdentification" },{"inputType": "text", "show": "true", "readOnly": "false", "required": "true", "inputField": "dob", "placeHolder": "", "screenLabel": "DOB", "defaultValue": "", "section": "patientInformation", "subSection": "patientIdentification" },{"inputType": "text", "show": "true", "readOnly": "false", "required": "true", "inputField": "mrn", "placeHolder": "", "screenLabel": "MRN", "defaultValue": "", "section": "patientInformation", "subSection": "patientIdentification" },{"inputType": "text", "show": "false", "readOnly": "false", "required": "false", "inputField": "govtId", "placeHolder": "", "screenLabel": "Government Id", "defaultValue": "", "section": "patientInformation", "subSection": "patientIdentification" },{"inputType": "setName", "show": "true", "readOnly": "false", "required": "false", "inputField": "geneticGender", "placeHolder": "", "screenLabel": "Gender", "defaultValue": "Gender", "section": "patientInformation", "subSection": "patientIdentification" },{"inputType": "setName", "show": "false", "readOnly": "false", "required": "false", "inputField": "genderId", "placeHolder": "", "screenLabel": "Gender ID", "defaultValue": "Gender", "section": "patientInformation", "subSection": "patientIdentification" },{"inputType": "setName", "show": "true", "readOnly": "false", "required": "false", "inputField": "ethnicity", "placeHolder": "", "screenLabel": "Ethnicity", "defaultValue": "Ethnicity", "section": "patientInformation", "subSection": "patientIdentification" },{"inputType": "text", "show": "true", "readOnly": "false", "required": "false", "inputField": "addressLine1", "placeHolder": "", "screenLabel": "Address 1", "defaultValue": "", "section": "patientInformation", "subSection": "patientContact" },{"inputType": "text", "show": "true", "readOnly": "false", "required": "false", "inputField": "workPhone", "placeHolder": "", "screenLabel": "Work Phone", "defaultValue": "", "section": "patientInformation", "subSection": "patientContact" },{"inputType": "text", "show": "false", "readOnly": "false", "required": "false", "inputField": "mobilePhoneCountryCode", "placeHolder": "", "screenLabel": "mobilePhoneCountryCode", "defaultValue": "", "section": "patientInformation", "subSection": "patientContact" },{"inputType": "text", "show": "true", "readOnly": "false", "required": "false", "inputField": "mobilePhone", "placeHolder": "", "screenLabel": "Mobile Phone", "defaultValue": "", "section": "patientInformation", "subSection": "patientContact" },{"inputType": "text", "show": "true", "readOnly": "false", "required": "false", "inputField": "email", "placeHolder": "", "screenLabel": "Email", "defaultValue": "", "section": "patientInformation", "subSection": "patientContact" },{"inputType": "text", "show": "true", "readOnly": "false", "required": "false", "inputField": "addressLine2", "placeHolder": "", "screenLabel": "Address 2", "defaultValue": "", "section": "patientInformation", "subSection": "patientContact" },{"inputType": "text", "show": "true", "readOnly": "false", "required": "false", "inputField": "city", "placeHolder": "", "screenLabel": "City", "defaultValue": "", "section": "patientInformation", "subSection": "patientContact" },{"inputType": "text", "show": "true", "readOnly": "false", "required": "false", "inputField": "state", "placeHolder": "", "screenLabel": "State", "defaultValue": "", "section": "patientInformation", "subSection": "patientContact" },{"inputType": "text", "show": "true", "readOnly": "false", "required": "false", "inputField": "postalCode", "placeHolder": "", "screenLabel": "Zip", "defaultValue": "", "section": "patientInformation", "subSection": "patientContact" },{"inputType": "text", "show": "false", "readOnly": "false", "required": "false", "inputField": "country", "placeHolder": "", "screenLabel": "Country", "defaultValue": "", "section": "patientInformation", "subSection": "patientContact" },{"inputType": "text", "show": "false", "readOnly": "false", "required": "false", "inputField": "homePhoneCountryCode", "placeHolder": "", "screenLabel": "homePhoneCountryCode", "defaultValue": "", "section": "patientInformation", "subSection": "patientContact" },{"inputType": "text", "show": "true", "readOnly": "false", "required": "false", "inputField": "homePhone", "placeHolder": "", "screenLabel": "Home Phone", "defaultValue": "", "section": "patientInformation", "subSection": "patientContact" },{"inputType": "text", "show": "false", "readOnly": "false", "required": "false", "inputField": "workPhoneCountryCode", "placeHolder": "", "screenLabel": "workPhoneCountryCode", "defaultValue": "", "section": "patientInformation", "subSection": "patientContact" },{"inputType": "text", "show": "false", "readOnly": "false", "required": "false", "inputField": "ageAtInitialPresentation", "placeHolder": "", "screenLabel": "Age at Presentation", "defaultValue": "", "section": "clinicalInformation", "subSection": "clinicalInformationBasic" },{"inputType": "textarea", "show": "false", "readOnly": "false", "required": "false", "inputField": "clinicalNotes", "placeHolder": "", "screenLabel": "Clinical Notes", "defaultValue": "", "section": "clinicalInformation", "subSection": "clinicalInformationBasic" },{"inputType": "select", "show": "false", "readOnly": "false", "required": "false", "inputField": "geneticCounselor", "placeHolder": "", "screenLabel": "Genetic Counselor", "defaultValue": "", "section": "clinicalInformation", "subSection": "clinicalInformationBasic" },{"inputType": "textarea", "show": "true", "readOnly": "false", "required": "false", "inputField": "clinicalHistory", "placeHolder": "", "screenLabel": "Clinical History", "defaultValue": "", "section": "clinicalInformation", "subSection": "clinicalInformationBasic" },{"inputType": "select", "show": "true", "readOnly": "false", "required": "false", "inputField": "currentMedications", "placeHolder": "", "screenLabel": "Current Medication", "defaultValue": "", "section": "clinicalInformation", "subSection": "clinicalInformationBasic" },{"inputType": "select", "show": "true", "readOnly": "false", "required": "false", "inputField": "problematicMedications", "placeHolder": "", "screenLabel": "Problematic Medication", "defaultValue": "", "section": "clinicalInformation", "subSection": "clinicalInformationBasic" },{"inputType": "select", "show": "true", "readOnly": "false", "required": "false", "inputField": "drugAllergies", "placeHolder": "", "screenLabel": "Drug Allergies", "defaultValue": "", "section": "clinicalInformation", "subSection": "clinicalInformationBasic" },{"inputType": "date", "show": "false", "readOnly": "false", "required": "false", "inputField": "dateOfLastPSA", "placeHolder": "", "screenLabel": "dateOfLastPSA", "defaultValue": "", "section": "clinicalInformation", "subSection": "PSA" },{"inputType": "date", "show": "false", "readOnly": "false", "required": "false", "inputField": "lastPSA", "placeHolder": "", "screenLabel": "lastPSA", "defaultValue": "", "section": "clinicalInformation", "subSection": "PSA" },{"inputType": "text", "show": "false", "readOnly": "false", "required": "false", "inputField": "percentFreePSA", "placeHolder": "", "screenLabel": "percentFreePSA", "defaultValue": "", "section": "clinicalInformation", "subSection": "PSA" },{"inputType": "date", "show": "false", "readOnly": "false", "required": "false", "inputField": "dateOfLastDRE", "placeHolder": "", "screenLabel": "dateOfLastDRE", "defaultValue": "", "section": "clinicalInformation", "subSection": "DRE" },{"inputType": "textarea", "show": "false", "readOnly": "false", "required": "false", "inputField": "lastDREResults", "placeHolder": "", "screenLabel": "lastDREResults", "defaultValue": "", "section": "clinicalInformation", "subSection": "DRE" },{"inputType": "text", "show": "false", "readOnly": "false", "required": "false", "inputField": "biopsyHistoryNumber", "placeHolder": "", "screenLabel": "biopsyHistoryNumber", "defaultValue": "", "section": "clinicalInformation", "subSection": "biopsy" },{"inputType": "textarea", "show": "false", "readOnly": "false", "required": "false", "inputField": "biopsyHistoryOther", "placeHolder": "", "screenLabel": "biopsyHistoryOther", "defaultValue": "", "section": "clinicalInformation", "subSection": "biopsy" },{"inputType": "textarea", "show": "false", "readOnly": "false", "required": "false", "inputField": "histopathologyFindings", "placeHolder": "", "screenLabel": "histopathologyFindings", "defaultValue": "", "section": "clinicalInformation", "subSection": "biopsy" },{"inputType": "date", "show": "false", "readOnly": "false", "required": "false", "inputField": "lastMenstrualCycle", "placeHolder": "", "screenLabel": "lastMenstrualCycle", "defaultValue": "", "section": "clinicalInformation", "subSection": "womensHealth" },{"inputType": "checkbox", "show": "false", "readOnly": "false", "required": "false", "inputField": "pregnant", "placeHolder": "", "screenLabel": "pregnant", "defaultValue": "", "section": "clinicalInformation", "subSection": "womensHealth" },{"inputType": "date", "show": "false", "readOnly": "false", "required": "false", "inputField": "lastPregnancy", "placeHolder": "", "screenLabel": "lastPregnancy", "defaultValue": "", "section": "clinicalInformation", "subSection": "womensHealth" },{"inputType": "checkbox", "show": "false", "readOnly": "false", "required": "false", "inputField": "hysterectomy", "placeHolder": "", "screenLabel": "hysterectomy", "defaultValue": "", "section": "clinicalInformation", "subSection": "womensHealth" },{"inputType": "checkbox", "show": "false", "readOnly": "false", "required": "false", "inputField": "miscarriages", "placeHolder": "", "screenLabel": "miscarriages", "defaultValue": "", "section": "clinicalInformation", "subSection": "womensHealth" },{"inputType": "checkbox", "show": "false", "readOnly": "false", "required": "false", "inputField": "thyroidIssues", "placeHolder": "", "screenLabel": "thyroidIssues", "defaultValue": "", "section": "clinicalInformation", "subSection": "womensHealth" },{"inputType": "text", "show": "false", "readOnly": "false", "required": "false", "inputField": "birthWeight", "placeHolder": "", "screenLabel": "birthWeight", "defaultValue": "", "section": "clinicalInformation", "subSection": "newbornScreening" },{"inputType": "checkbox", "show": "false", "readOnly": "false", "required": "false", "inputField": "meconiumIleus", "placeHolder": "", "screenLabel": "meconiumIleus", "defaultValue": "", "section": "clinicalInformation", "subSection": "newbornScreening" },{"inputType": "setName", "show": "false", "readOnly": "false", "required": "false", "inputField": "prePostTransfusion", "placeHolder": "", "screenLabel": "prePostTransfusion", "defaultValue": "Transfusion Status", "section": "clinicalInformation", "subSection": "newbornScreening" },{"inputType": "checkbox", "show": "false", "readOnly": "false", "required": "false", "inputField": "ambiguousGenitalia", "placeHolder": "", "screenLabel": "ambiguousGenitalia", "defaultValue": "", "section": "clinicalInformation", "subSection": "newbornScreening" },{"inputType": "text", "show": "false", "readOnly": "false", "required": "false", "inputField": "motherFullName", "placeHolder": "", "screenLabel": "motherFullName", "defaultValue": "", "section": "clinicalInformation", "subSection": "newbornScreening" },{"inputType": "date", "show": "false", "readOnly": "false", "required": "false", "inputField": "dateOfFirstMilk", "placeHolder": "", "screenLabel": "dateOfFirstMilk", "defaultValue": "", "section": "clinicalInformation", "subSection": "newbornScreening" },{"inputType": "text", "show": "false", "readOnly": "false", "required": "false", "inputField": "timeOfFirstMilk", "placeHolder": "", "screenLabel": "timeOfFirstMilk", "defaultValue": "", "section": "clinicalInformation", "subSection": "newbornScreening" },{"inputType": "textArea", "show": "false", "readOnly": "false", "required": "false", "inputField": "FeedingHistory", "placeHolder": "", "screenLabel": "FeedingHistory", "defaultValue": "", "section": "clinicalInformation", "subSection": "newbornScreening" },{"inputType": "text", "show": "false", "readOnly": "false", "required": "false", "inputField": "clinicalHistoryOfMother", "placeHolder": "", "screenLabel": "clinicalHistoryOfMother", "defaultValue": "", "section": "clinicalInformation", "subSection": "newbornScreening" },{"inputType": "text", "show": "false", "readOnly": "false", "required": "false", "inputField": "placeOfBirth", "placeHolder": "", "screenLabel": "placeOfBirth", "defaultValue": "", "section": "clinicalInformation", "subSection": "newbornScreening" },{"inputType": "text", "show": "false", "readOnly": "false", "required": "false", "inputField": "birthTime", "placeHolder": "", "screenLabel": "birthTime", "defaultValue": "", "section": "clinicalInformation", "subSection": "newbornScreening" },{"inputType": "text", "show": "false", "readOnly": "false", "required": "false", "inputField": "locationOfSampling", "placeHolder": "", "screenLabel": "locationOfSampling", "defaultValue": "", "section": "clinicalInformation", "subSection": "newbornScreening" },{"inputType": "text", "show": "false", "readOnly": "false", "required": "false", "inputField": "babyIdentifyingNumber", "placeHolder": "", "screenLabel": "babyIdentifyingNumber", "defaultValue": "", "section": "clinicalInformation", "subSection": "newbornScreening" },{"inputType": "setName", "show": "false", "readOnly": "false", "required": "false", "inputField": "privatePublicPatient", "placeHolder": "", "screenLabel": "privatePublicPatient", "defaultValue": "Patient Type", "section": "clinicalInformation", "subSection": "newbornScreening" },{"inputType": "text", "show": "false", "readOnly": "false", "required": "false", "inputField": "referringDoctor", "placeHolder": "", "screenLabel": "referringDoctor", "defaultValue": "", "section": "clinicalInformation", "subSection": "newbornScreening" },{"inputType": "checkbox", "show": "false", "readOnly": "false", "required": "false", "inputField": "repeatSample", "placeHolder": "", "screenLabel": "repeatSample", "defaultValue": "", "section": "clinicalInformation", "subSection": "newbornScreening" },{"inputType": "checkbox", "show": "false", "readOnly": "false", "required": "false", "inputField": "familyHistoryCF", "placeHolder": "", "screenLabel": "familyHistoryCF", "defaultValue": "", "section": "clinicalInformation", "subSection": "newbornScreening" },{"inputType": "setName", "show": "false", "readOnly": "false", "required": "false", "inputField": "donorOrRecipient", "placeHolder": "", "screenLabel": "donorOrRecipient", "defaultValue": "Tissue Donor Relationship", "section": "clinicalInformation", "subSection": "tissueDonors" },{"inputType": "textArea", "show": "false", "readOnly": "false", "required": "false", "inputField": "transfusionHistory", "placeHolder": "", "screenLabel": "transfusionHistory", "defaultValue": "", "section": "clinicalInformation", "subSection": "tissueDonors" },{"inputType": "setName", "show": "false", "readOnly": "false", "required": "false", "inputField": "bloodType", "placeHolder": "", "screenLabel": "bloodType", "defaultValue": "Blood Type", "section": "clinicalInformation", "subSection": "tissueDonors" },{"inputType": "textArea", "show": "false", "readOnly": "false", "required": "false", "inputField": "transfusionTransplantHistory", "placeHolder": "", "screenLabel": "transfusionTransplantHistory", "defaultValue": "", "section": "clinicalInformation", "subSection": "hivInformation" },{"inputType": "queryValue_limit", "show": "true", "readOnly": "false", "required": "false", "inputField": "specimenOrderMax", "placeHolder": "", "screenLabel": "specimenOrderMax", "defaultValue": "5", "section": "specimenInfo", "subSection": "specimenInfo" },{"inputType": "column_text", "show": "false", "readOnly": "false", "required": "false", "inputField": "expectedBarcode", "placeHolder": "", "screenLabel": "Expected Barcode", "defaultValue": "", "section": "specimenInfo", "subSection": "specimenEntry" },{"inputType": "column_text", "show": "true", "readOnly": "false", "required": "false", "inputField": "externalIdentifier", "placeHolder": "", "screenLabel": "External ID", "defaultValue": "", "section": "specimenInfo", "subSection": "specimenEntry" },{"inputType": "column_setName", "show": "true", "readOnly": "false", "required": "false", "inputField": "specimenType", "placeHolder": "", "screenLabel": "Specimen Type", "defaultValue": "Specimen Type", "section": "specimenInfo", "subSection": "specimenEntry" },{"inputType": "column_date", "show": "true", "readOnly": "false", "required": "false", "inputField": "collectionDate", "placeHolder": "", "screenLabel": "Collection Date", "defaultValue": "", "section": "specimenInfo", "subSection": "specimenEntry" },{"inputType": "column_time", "show": "true", "readOnly": "false", "required": "false", "inputField": "collectionTime", "placeHolder": "", "screenLabel": "Collection Time", "defaultValue": "", "section": "specimenInfo", "subSection": "specimenEntry" },{"inputType": "text", "show": "true", "readOnly": "false", "required": "true", "inputField": "governmentPolicyNumber1", "placeHolder": "", "screenLabel": "Medicare", "defaultValue": "", "section": "billing", "subSection": "billing" },{"inputType": "text", "show": "true", "readOnly": "false", "required": "true", "inputField": "governmentPolicyNumber2", "placeHolder": "", "screenLabel": "Medicaid", "defaultValue": "", "section": "billing", "subSection": "billing" },{"inputType": "text", "show": "true", "readOnly": "false", "required": "false", "inputField": "policyHolder1Id", "placeHolder": "", "screenLabel": "Policy Holder ID", "defaultValue": "", "section": "billing", "subSection": "billing" },{"inputType": "text", "show": "true", "readOnly": "false", "required": "false", "inputField": "policyHolder2Id", "placeHolder": "", "screenLabel": "Policy Holder ID", "defaultValue": "", "section": "billing", "subSection": "billing" },{"inputType": "check", "show": "false", "readOnly": "false", "required": "false", "inputField": "consent", "placeHolder": "", "screenLabel": "consent", "defaultValue": "", "section": "consentForm", "subSection": "patientConsent" },{"inputType": "check", "show": "false", "readOnly": "false", "required": "false", "inputField": "patientSignature", "placeHolder": "", "screenLabel": "patientSignature", "defaultValue": "", "section": "consentForm", "subSection": "patientConsent" },{"inputType": "text", "show": "false", "readOnly": "false", "required": "false", "inputField": "consentBy", "placeHolder": "", "screenLabel": "consentBy", "defaultValue": "", "section": "consentForm", "subSection": "patientConsent" },{"inputType": "setName", "show": "false", "readOnly": "false", "required": "false", "inputField": "consenteePatientRelationship", "placeHolder": "", "screenLabel": "consenteePatientRelationship", "defaultValue": "relationship", "section": "consentForm", "subSection": "patientConsent" },{"inputType": "date", "show": "false", "readOnly": "false", "required": "false", "inputField": "patientSignatureDate", "placeHolder": "", "screenLabel": "patientSignatureDate", "defaultValue": "", "section": "consentForm", "subSection": "patientConsent" },{"inputType": "check", "show": "true", "readOnly": "false", "required": "false", "inputField": "physicianSignature", "placeHolder": "", "screenLabel": "Physician Signature", "defaultValue": "", "section": "consentForm", "subSection": "physicianAuthorization" },{"inputType": "date", "show": "true", "readOnly": "false", "required": "false", "inputField": "physicianSignatureDate", "placeHolder": "", "screenLabel": "Physician Signature Date", "defaultValue": "", "section": "consentForm", "subSection": "physicianAuthorization" },{"inputType": "textarea", "show": "true", "readOnly": "false", "required": "false", "inputField": "physicianComment", "placeHolder": "", "screenLabel": "Physician Comments", "defaultValue": "", "section": "consentForm", "subSection": "physicianAuthorization" }]',0),
        (9, 7, '[{"inputType": "section", "show": "true", "readOnly": "false", "required": "false", "inputField": "Order Information", "placeHolder": "", "screenLabel": "Order Information", "defaultValue": "", "section": "orderInformation", "subSection": "orderInformation" },{"inputType": "section", "show": "true", "readOnly": "false", "required": "false", "inputField": "File Upload", "placeHolder": "", "screenLabel": "File Upload", "defaultValue": "", "section": "fileUpload", "subSection": "fileUpload" },{"inputType": "section", "show": "true", "readOnly": "false", "required": "false", "inputField": "Patient Information", "placeHolder": "", "screenLabel": "Patient Information", "defaultValue": "", "section": "patientInformation", "subSection": "patientInformation" },{"inputType": "section", "show": "true", "readOnly": "false", "required": "false", "inputField": "Clinical Information", "placeHolder": "", "screenLabel": "Clinical Information", "defaultValue": "", "section": "clinicalInformation", "subSection": "clinicalInformation" },{"inputType": "section", "show": "true", "readOnly": "false", "required": "false", "inputField": "Panel Selection", "placeHolder": "", "screenLabel": "Panel Selection", "defaultValue": "", "section": "panelSelection", "subSection": "panelSelection" },{"inputType": "section", "show": "true", "readOnly": "false", "required": "false", "inputField": "Specimen Information", "placeHolder": "", "screenLabel": "Specimen Information", "defaultValue": "", "section": "specimenInfo", "subSection": "specimenInfo" },{"inputType": "section", "show": "false", "readOnly": "false", "required": "false", "inputField": "Proband", "placeHolder": "", "screenLabel": "Proband", "defaultValue": "", "section": "proband", "subSection": "proband" },{"inputType": "section", "show": "false", "readOnly": "false", "required": "false", "inputField": "Report Distribution", "placeHolder": "", "screenLabel": "Report Distribution", "defaultValue": "", "section": "reportDistribution", "subSection": "reportDistribution" },{"inputType": "section", "show": "true", "readOnly": "false", "required": "false", "inputField": "Billing Section", "placeHolder": "", "screenLabel": "Billing Section", "defaultValue": "", "section": "billing", "subSection": "billing" },{"inputType": "section", "show": "true", "readOnly": "false", "required": "false", "inputField": "Consent Form", "placeHolder": "", "screenLabel": "Consent Form", "defaultValue": "", "section": "consentForm", "subSection": "consentForm" },{"inputType": "subSection", "show": "true", "readOnly": "false", "required": "false", "inputField": "Patient Search", "placeHolder": "", "screenLabel": "Patient Search", "defaultValue": "", "section": "patientInformation", "subSection": "patientSearch" },{"inputType": "subSection", "show": "true", "readOnly": "false", "required": "false", "inputField": "Patient Identification", "placeHolder": "", "screenLabel": "Patient Identification", "defaultValue": "", "section": "patientInformation", "subSection": "patientIdentification" },{"inputType": "subSection", "show": "true", "readOnly": "false", "required": "false", "inputField": "Patient Contact Information", "placeHolder": "", "screenLabel": "Patient Contact Information", "defaultValue": "", "section": "patientInformation", "subSection": "patientContact" },{"inputType": "subSection", "show": "true", "readOnly": "false", "required": "false", "inputField": "Base Clinical Information", "placeHolder": "", "screenLabel": "Base Clinical Information", "defaultValue": "", "section": "clinicalInformation", "subSection": "clinicalInformationBasic" },{"inputType": "subSection", "show": "false", "readOnly": "false", "required": "false", "inputField": "PSA", "placeHolder": "", "screenLabel": "PSA", "defaultValue": "", "section": "clinicalInformation", "subSection": "PSA" },{"inputType": "subSection", "show": "false", "readOnly": "false", "required": "false", "inputField": "DRE", "placeHolder": "", "screenLabel": "DRE", "defaultValue": "", "section": "clinicalInformation", "subSection": "DRE" },{"inputType": "subSection", "show": "false", "readOnly": "false", "required": "false", "inputField": "Biopsy", "placeHolder": "", "screenLabel": "Biopsy", "defaultValue": "", "section": "clinicalInformation", "subSection": "biopsy" },{"inputType": "subSection", "show": "false", "readOnly": "false", "required": "false", "inputField": "Womens Health", "placeHolder": "", "screenLabel": "Womens Health", "defaultValue": "", "section": "clinicalInformation", "subSection": "womensHealth" },{"inputType": "subSection", "show": "false", "readOnly": "false", "required": "false", "inputField": "Newborn Screening", "placeHolder": "", "screenLabel": "Newborn Screening", "defaultValue": "", "section": "clinicalInformation", "subSection": "newbornScreening" },{"inputType": "subSection", "show": "false", "readOnly": "false", "required": "false", "inputField": "Tissue Donors", "placeHolder": "", "screenLabel": "Tissue Donors", "defaultValue": "", "section": "clinicalInformation", "subSection": "tissueDonors" },{"inputType": "subSection", "show": "false", "readOnly": "false", "required": "false", "inputField": "HIV Information", "placeHolder": "", "screenLabel": "HIV Information", "defaultValue": "", "section": "clinicalInformation", "subSection": "hivInformation" },{"inputType": "subSection", "show": "true", "readOnly": "false", "required": "false", "inputField": "Specimen Collection", "placeHolder": "", "screenLabel": "Specimen Collection", "defaultValue": "", "section": "specimenInfo", "subSection": "specimenEntry" },{"inputType": "subSection", "show": "false", "readOnly": "false", "required": "false", "inputField": "Additional Recipients", "placeHolder": "", "screenLabel": "Additional Recipients", "defaultValue": "", "section": "reportDistribution", "subSection": "additionalRecipients" },{"inputType": "subSection", "show": "false", "readOnly": "false", "required": "false", "inputField": "Additional Recipient Search", "placeHolder": "", "screenLabel": "Additional Recipient Search", "defaultValue": "", "section": "reportDistribution", "subSection": "additionalRecipientSearch" },{"inputType": "subSection", "show": "true", "readOnly": "false", "required": "false", "inputField": "Medical Codes", "placeHolder": "", "screenLabel": "Medical Codes", "defaultValue": "", "section": "billing", "subSection": "diagnosticCodes" },{"inputType": "subSection", "show": "false", "readOnly": "false", "required": "false", "inputField": "Patient Consent", "placeHolder": "", "screenLabel": "Patient Consent", "defaultValue": "", "section": "consentForm", "subSection": "patientConsent" },{"inputType": "subSection", "show": "true", "readOnly": "false", "required": "false", "inputField": "Physician Authorization", "placeHolder": "", "screenLabel": "Physician Authorization", "defaultValue": "", "section": "consentForm", "subSection": "physicianAuthorization" },{"inputType": "container", "show": "false", "readOnly": "false", "required": "false", "inputField": "requestId", "placeHolder": "", "screenLabel": "Order ID", "defaultValue": "", "section": "orderInformation", "subSection": "orderInformation" },{"inputType": "text", "show": "false", "readOnly": "false", "required": "false", "inputField": "externalRequestId", "placeHolder": "", "screenLabel": "External Order ID", "defaultValue": "", "section": "orderInformation", "subSection": "orderInformation" },{"inputType": "select", "show": "true", "readOnly": "false", "required": "true", "inputField": "physicianSiteId", "placeHolder": "", "screenLabel": "Site ID", "defaultValue": "", "section": "orderInformation", "subSection": "orderInformation" },{"inputType": "select", "show": "true", "readOnly": "false", "required": "true", "inputField": "physicianId", "placeHolder": "", "screenLabel": "Physician", "defaultValue": "", "section": "orderInformation", "subSection": "orderInformation" },{"inputType": "date", "show": "true", "readOnly": "false", "required": "false", "inputField": "orderInfoReceivedDate", "placeHolder": "", "screenLabel": "Order Received Date", "defaultValue": "", "section": "orderInformation", "subSection": "orderInformation" },{"inputType": "setName", "show": "true", "readOnly": "false", "required": "false", "inputField": "priority", "placeHolder": "", "screenLabel": "Priority", "defaultValue": "Priority", "section": "orderInformation", "subSection": "orderInformation" },{"inputType": "setName", "show": "false", "readOnly": "false", "required": "false", "inputField": "externalSystem", "placeHolder": "", "screenLabel": "External System", "defaultValue": "External Systems", "section": "orderInformation", "subSection": "orderInformation" },{"inputType": "textArea", "show": "true", "readOnly": "false", "required": "false", "inputField": "orderComment", "placeHolder": "", "screenLabel": "Order Comments", "defaultValue": "", "section": "orderInformation", "subSection": "orderInformation" },{"inputType": "file", "show": "true", "readOnly": "false", "required": "false", "inputField": "fileUpload_requisitionForm", "placeHolder": "", "screenLabel": "Requisition Form", "defaultValue": "", "section": "fileUpload", "subSection": "fileUpload" },{"inputType": "file", "show": "false", "readOnly": "false", "required": "false", "inputField": "fileUpload_specimenProcurement", "placeHolder": "", "screenLabel": "Specimen Procurement", "defaultValue": "", "section": "fileUpload", "subSection": "fileUpload" },{"inputType": "file", "show": "true", "readOnly": "false", "required": "false", "inputField": "fileUpload_insuranceInformation", "placeHolder": "", "screenLabel": "Insurance Card", "defaultValue": "", "section": "fileUpload", "subSection": "fileUpload" },{"inputType": "file", "show": "false", "readOnly": "false", "required": "false", "inputField": "fileUpload_emrSummarySheet", "placeHolder": "", "screenLabel": "EMR Summary Sheet", "defaultValue": "", "section": "fileUpload", "subSection": "fileUpload" },{"inputType": "file", "show": "false", "readOnly": "false", "required": "false", "inputField": "fileUpload_clinicalReport", "placeHolder": "", "screenLabel": "Clinical Report", "defaultValue": "", "section": "fileUpload", "subSection": "fileUpload" },{"inputType": "file", "show": "true", "readOnly": "false", "required": "false", "inputField": "fileUpload_other", "placeHolder": "", "screenLabel": "Other", "defaultValue": "", "section": "fileUpload", "subSection": "fileUpload" },{"inputType": "text", "show": "true", "readOnly": "false", "required": "true", "inputField": "firstName", "placeHolder": "", "screenLabel": "First Name", "defaultValue": "", "section": "patientInformation", "subSection": "patientIdentification" },{"inputType": "text", "show": "true", "readOnly": "false", "required": "false", "inputField": "middleName", "placeHolder": "", "screenLabel": "Middle Name", "defaultValue": "", "section": "patientInformation", "subSection": "patientIdentification" },{"inputType": "text", "show": "true", "readOnly": "false", "required": "true", "inputField": "lastName", "placeHolder": "", "screenLabel": "Last Name", "defaultValue": "", "section": "patientInformation", "subSection": "patientIdentification" },{"inputType": "text", "show": "true", "readOnly": "false", "required": "true", "inputField": "dob", "placeHolder": "", "screenLabel": "DOB", "defaultValue": "", "section": "patientInformation", "subSection": "patientIdentification" },{"inputType": "text", "show": "true", "readOnly": "false", "required": "true", "inputField": "mrn", "placeHolder": "", "screenLabel": "MRN", "defaultValue": "", "section": "patientInformation", "subSection": "patientIdentification" },{"inputType": "text", "show": "false", "readOnly": "false", "required": "false", "inputField": "govtId", "placeHolder": "", "screenLabel": "Government Id", "defaultValue": "", "section": "patientInformation", "subSection": "patientIdentification" },{"inputType": "setName", "show": "true", "readOnly": "false", "required": "false", "inputField": "geneticGender", "placeHolder": "", "screenLabel": "Gender", "defaultValue": "Gender", "section": "patientInformation", "subSection": "patientIdentification" },{"inputType": "setName", "show": "false", "readOnly": "false", "required": "false", "inputField": "genderId", "placeHolder": "", "screenLabel": "Gender ID", "defaultValue": "Gender", "section": "patientInformation", "subSection": "patientIdentification" },{"inputType": "setName", "show": "true", "readOnly": "false", "required": "false", "inputField": "ethnicity", "placeHolder": "", "screenLabel": "Ethnicity", "defaultValue": "Ethnicity", "section": "patientInformation", "subSection": "patientIdentification" },{"inputType": "text", "show": "true", "readOnly": "false", "required": "false", "inputField": "addressLine1", "placeHolder": "", "screenLabel": "Address 1", "defaultValue": "", "section": "patientInformation", "subSection": "patientContact" },{"inputType": "text", "show": "true", "readOnly": "false", "required": "false", "inputField": "workPhone", "placeHolder": "", "screenLabel": "Work Phone", "defaultValue": "", "section": "patientInformation", "subSection": "patientContact" },{"inputType": "text", "show": "false", "readOnly": "false", "required": "false", "inputField": "mobilePhoneCountryCode", "placeHolder": "", "screenLabel": "mobilePhoneCountryCode", "defaultValue": "", "section": "patientInformation", "subSection": "patientContact" },{"inputType": "text", "show": "true", "readOnly": "false", "required": "false", "inputField": "mobilePhone", "placeHolder": "", "screenLabel": "Mobile Phone", "defaultValue": "", "section": "patientInformation", "subSection": "patientContact" },{"inputType": "text", "show": "true", "readOnly": "false", "required": "false", "inputField": "email", "placeHolder": "", "screenLabel": "Email", "defaultValue": "", "section": "patientInformation", "subSection": "patientContact" },{"inputType": "text", "show": "true", "readOnly": "false", "required": "false", "inputField": "addressLine2", "placeHolder": "", "screenLabel": "Address 2", "defaultValue": "", "section": "patientInformation", "subSection": "patientContact" },{"inputType": "text", "show": "true", "readOnly": "false", "required": "false", "inputField": "city", "placeHolder": "", "screenLabel": "City", "defaultValue": "", "section": "patientInformation", "subSection": "patientContact" },{"inputType": "text", "show": "true", "readOnly": "false", "required": "false", "inputField": "state", "placeHolder": "", "screenLabel": "State", "defaultValue": "", "section": "patientInformation", "subSection": "patientContact" },{"inputType": "text", "show": "true", "readOnly": "false", "required": "false", "inputField": "postalCode", "placeHolder": "", "screenLabel": "Zip", "defaultValue": "", "section": "patientInformation", "subSection": "patientContact" },{"inputType": "text", "show": "false", "readOnly": "false", "required": "false", "inputField": "country", "placeHolder": "", "screenLabel": "Country", "defaultValue": "", "section": "patientInformation", "subSection": "patientContact" },{"inputType": "text", "show": "false", "readOnly": "false", "required": "false", "inputField": "homePhoneCountryCode", "placeHolder": "", "screenLabel": "homePhoneCountryCode", "defaultValue": "", "section": "patientInformation", "subSection": "patientContact" },{"inputType": "text", "show": "true", "readOnly": "false", "required": "false", "inputField": "homePhone", "placeHolder": "", "screenLabel": "Home Phone", "defaultValue": "", "section": "patientInformation", "subSection": "patientContact" },{"inputType": "text", "show": "false", "readOnly": "false", "required": "false", "inputField": "workPhoneCountryCode", "placeHolder": "", "screenLabel": "workPhoneCountryCode", "defaultValue": "", "section": "patientInformation", "subSection": "patientContact" },{"inputType": "text", "show": "false", "readOnly": "false", "required": "false", "inputField": "ageAtInitialPresentation", "placeHolder": "", "screenLabel": "Age at Presentation", "defaultValue": "", "section": "clinicalInformation", "subSection": "clinicalInformationBasic" },{"inputType": "textarea", "show": "false", "readOnly": "false", "required": "false", "inputField": "clinicalNotes", "placeHolder": "", "screenLabel": "Clinical Notes", "defaultValue": "", "section": "clinicalInformation", "subSection": "clinicalInformationBasic" },{"inputType": "select", "show": "false", "readOnly": "false", "required": "false", "inputField": "geneticCounselor", "placeHolder": "", "screenLabel": "Genetic Counselor", "defaultValue": "", "section": "clinicalInformation", "subSection": "clinicalInformationBasic" },{"inputType": "textarea", "show": "true", "readOnly": "false", "required": "false", "inputField": "clinicalHistory", "placeHolder": "", "screenLabel": "Clinical History", "defaultValue": "", "section": "clinicalInformation", "subSection": "clinicalInformationBasic" },{"inputType": "select", "show": "true", "readOnly": "false", "required": "false", "inputField": "currentMedications", "placeHolder": "", "screenLabel": "Current Medication", "defaultValue": "", "section": "clinicalInformation", "subSection": "clinicalInformationBasic" },{"inputType": "select", "show": "true", "readOnly": "false", "required": "false", "inputField": "problematicMedications", "placeHolder": "", "screenLabel": "Problematic Medication", "defaultValue": "", "section": "clinicalInformation", "subSection": "clinicalInformationBasic" },{"inputType": "select", "show": "true", "readOnly": "false", "required": "false", "inputField": "drugAllergies", "placeHolder": "", "screenLabel": "Drug Allergies", "defaultValue": "", "section": "clinicalInformation", "subSection": "clinicalInformationBasic" },{"inputType": "date", "show": "false", "readOnly": "false", "required": "false", "inputField": "dateOfLastPSA", "placeHolder": "", "screenLabel": "dateOfLastPSA", "defaultValue": "", "section": "clinicalInformation", "subSection": "PSA" },{"inputType": "date", "show": "false", "readOnly": "false", "required": "false", "inputField": "lastPSA", "placeHolder": "", "screenLabel": "lastPSA", "defaultValue": "", "section": "clinicalInformation", "subSection": "PSA" },{"inputType": "text", "show": "false", "readOnly": "false", "required": "false", "inputField": "percentFreePSA", "placeHolder": "", "screenLabel": "percentFreePSA", "defaultValue": "", "section": "clinicalInformation", "subSection": "PSA" },{"inputType": "date", "show": "false", "readOnly": "false", "required": "false", "inputField": "dateOfLastDRE", "placeHolder": "", "screenLabel": "dateOfLastDRE", "defaultValue": "", "section": "clinicalInformation", "subSection": "DRE" },{"inputType": "textarea", "show": "false", "readOnly": "false", "required": "false", "inputField": "lastDREResults", "placeHolder": "", "screenLabel": "lastDREResults", "defaultValue": "", "section": "clinicalInformation", "subSection": "DRE" },{"inputType": "text", "show": "false", "readOnly": "false", "required": "false", "inputField": "biopsyHistoryNumber", "placeHolder": "", "screenLabel": "biopsyHistoryNumber", "defaultValue": "", "section": "clinicalInformation", "subSection": "biopsy" },{"inputType": "textarea", "show": "false", "readOnly": "false", "required": "false", "inputField": "biopsyHistoryOther", "placeHolder": "", "screenLabel": "biopsyHistoryOther", "defaultValue": "", "section": "clinicalInformation", "subSection": "biopsy" },{"inputType": "textarea", "show": "false", "readOnly": "false", "required": "false", "inputField": "histopathologyFindings", "placeHolder": "", "screenLabel": "histopathologyFindings", "defaultValue": "", "section": "clinicalInformation", "subSection": "biopsy" },{"inputType": "date", "show": "false", "readOnly": "false", "required": "false", "inputField": "lastMenstrualCycle", "placeHolder": "", "screenLabel": "lastMenstrualCycle", "defaultValue": "", "section": "clinicalInformation", "subSection": "womensHealth" },{"inputType": "checkbox", "show": "false", "readOnly": "false", "required": "false", "inputField": "pregnant", "placeHolder": "", "screenLabel": "pregnant", "defaultValue": "", "section": "clinicalInformation", "subSection": "womensHealth" },{"inputType": "date", "show": "false", "readOnly": "false", "required": "false", "inputField": "lastPregnancy", "placeHolder": "", "screenLabel": "lastPregnancy", "defaultValue": "", "section": "clinicalInformation", "subSection": "womensHealth" },{"inputType": "checkbox", "show": "false", "readOnly": "false", "required": "false", "inputField": "hysterectomy", "placeHolder": "", "screenLabel": "hysterectomy", "defaultValue": "", "section": "clinicalInformation", "subSection": "womensHealth" },{"inputType": "checkbox", "show": "false", "readOnly": "false", "required": "false", "inputField": "miscarriages", "placeHolder": "", "screenLabel": "miscarriages", "defaultValue": "", "section": "clinicalInformation", "subSection": "womensHealth" },{"inputType": "checkbox", "show": "false", "readOnly": "false", "required": "false", "inputField": "thyroidIssues", "placeHolder": "", "screenLabel": "thyroidIssues", "defaultValue": "", "section": "clinicalInformation", "subSection": "womensHealth" },{"inputType": "text", "show": "false", "readOnly": "false", "required": "false", "inputField": "birthWeight", "placeHolder": "", "screenLabel": "birthWeight", "defaultValue": "", "section": "clinicalInformation", "subSection": "newbornScreening" },{"inputType": "checkbox", "show": "false", "readOnly": "false", "required": "false", "inputField": "meconiumIleus", "placeHolder": "", "screenLabel": "meconiumIleus", "defaultValue": "", "section": "clinicalInformation", "subSection": "newbornScreening" },{"inputType": "setName", "show": "false", "readOnly": "false", "required": "false", "inputField": "prePostTransfusion", "placeHolder": "", "screenLabel": "prePostTransfusion", "defaultValue": "Transfusion Status", "section": "clinicalInformation", "subSection": "newbornScreening" },{"inputType": "checkbox", "show": "false", "readOnly": "false", "required": "false", "inputField": "ambiguousGenitalia", "placeHolder": "", "screenLabel": "ambiguousGenitalia", "defaultValue": "", "section": "clinicalInformation", "subSection": "newbornScreening" },{"inputType": "text", "show": "false", "readOnly": "false", "required": "false", "inputField": "motherFullName", "placeHolder": "", "screenLabel": "motherFullName", "defaultValue": "", "section": "clinicalInformation", "subSection": "newbornScreening" },{"inputType": "date", "show": "false", "readOnly": "false", "required": "false", "inputField": "dateOfFirstMilk", "placeHolder": "", "screenLabel": "dateOfFirstMilk", "defaultValue": "", "section": "clinicalInformation", "subSection": "newbornScreening" },{"inputType": "text", "show": "false", "readOnly": "false", "required": "false", "inputField": "timeOfFirstMilk", "placeHolder": "", "screenLabel": "timeOfFirstMilk", "defaultValue": "", "section": "clinicalInformation", "subSection": "newbornScreening" },{"inputType": "textArea", "show": "false", "readOnly": "false", "required": "false", "inputField": "FeedingHistory", "placeHolder": "", "screenLabel": "FeedingHistory", "defaultValue": "", "section": "clinicalInformation", "subSection": "newbornScreening" },{"inputType": "text", "show": "false", "readOnly": "false", "required": "false", "inputField": "clinicalHistoryOfMother", "placeHolder": "", "screenLabel": "clinicalHistoryOfMother", "defaultValue": "", "section": "clinicalInformation", "subSection": "newbornScreening" },{"inputType": "text", "show": "false", "readOnly": "false", "required": "false", "inputField": "placeOfBirth", "placeHolder": "", "screenLabel": "placeOfBirth", "defaultValue": "", "section": "clinicalInformation", "subSection": "newbornScreening" },{"inputType": "text", "show": "false", "readOnly": "false", "required": "false", "inputField": "birthTime", "placeHolder": "", "screenLabel": "birthTime", "defaultValue": "", "section": "clinicalInformation", "subSection": "newbornScreening" },{"inputType": "text", "show": "false", "readOnly": "false", "required": "false", "inputField": "locationOfSampling", "placeHolder": "", "screenLabel": "locationOfSampling", "defaultValue": "", "section": "clinicalInformation", "subSection": "newbornScreening" },{"inputType": "text", "show": "false", "readOnly": "false", "required": "false", "inputField": "babyIdentifyingNumber", "placeHolder": "", "screenLabel": "babyIdentifyingNumber", "defaultValue": "", "section": "clinicalInformation", "subSection": "newbornScreening" },{"inputType": "setName", "show": "false", "readOnly": "false", "required": "false", "inputField": "privatePublicPatient", "placeHolder": "", "screenLabel": "privatePublicPatient", "defaultValue": "Patient Type", "section": "clinicalInformation", "subSection": "newbornScreening" },{"inputType": "text", "show": "false", "readOnly": "false", "required": "false", "inputField": "referringDoctor", "placeHolder": "", "screenLabel": "referringDoctor", "defaultValue": "", "section": "clinicalInformation", "subSection": "newbornScreening" },{"inputType": "checkbox", "show": "false", "readOnly": "false", "required": "false", "inputField": "repeatSample", "placeHolder": "", "screenLabel": "repeatSample", "defaultValue": "", "section": "clinicalInformation", "subSection": "newbornScreening" },{"inputType": "checkbox", "show": "false", "readOnly": "false", "required": "false", "inputField": "familyHistoryCF", "placeHolder": "", "screenLabel": "familyHistoryCF", "defaultValue": "", "section": "clinicalInformation", "subSection": "newbornScreening" },{"inputType": "setName", "show": "false", "readOnly": "false", "required": "false", "inputField": "donorOrRecipient", "placeHolder": "", "screenLabel": "donorOrRecipient", "defaultValue": "Tissue Donor Relationship", "section": "clinicalInformation", "subSection": "tissueDonors" },{"inputType": "textArea", "show": "false", "readOnly": "false", "required": "false", "inputField": "transfusionHistory", "placeHolder": "", "screenLabel": "transfusionHistory", "defaultValue": "", "section": "clinicalInformation", "subSection": "tissueDonors" },{"inputType": "setName", "show": "false", "readOnly": "false", "required": "false", "inputField": "bloodType", "placeHolder": "", "screenLabel": "bloodType", "defaultValue": "Blood Type", "section": "clinicalInformation", "subSection": "tissueDonors" },{"inputType": "textArea", "show": "false", "readOnly": "false", "required": "false", "inputField": "transfusionTransplantHistory", "placeHolder": "", "screenLabel": "transfusionTransplantHistory", "defaultValue": "", "section": "clinicalInformation", "subSection": "hivInformation" },{"inputType": "queryValue_limit", "show": "true", "readOnly": "false", "required": "false", "inputField": "specimenOrderMax", "placeHolder": "", "screenLabel": "specimenOrderMax", "defaultValue": "5", "section": "specimenInfo", "subSection": "specimenInfo" },{"inputType": "column_text", "show": "false", "readOnly": "false", "required": "false", "inputField": "expectedBarcode", "placeHolder": "", "screenLabel": "Expected Barcode", "defaultValue": "", "section": "specimenInfo", "subSection": "specimenEntry" },{"inputType": "column_text", "show": "true", "readOnly": "false", "required": "false", "inputField": "externalIdentifier", "placeHolder": "", "screenLabel": "External ID", "defaultValue": "", "section": "specimenInfo", "subSection": "specimenEntry" },{"inputType": "column_setName", "show": "true", "readOnly": "false", "required": "false", "inputField": "specimenType", "placeHolder": "", "screenLabel": "Specimen Type", "defaultValue": "Specimen Type", "section": "specimenInfo", "subSection": "specimenEntry" },{"inputType": "column_date", "show": "true", "readOnly": "false", "required": "false", "inputField": "collectionDate", "placeHolder": "", "screenLabel": "Collection Date", "defaultValue": "", "section": "specimenInfo", "subSection": "specimenEntry" },{"inputType": "column_time", "show": "true", "readOnly": "false", "required": "false", "inputField": "collectionTime", "placeHolder": "", "screenLabel": "Collection Time", "defaultValue": "", "section": "specimenInfo", "subSection": "specimenEntry" },{"inputType": "text", "show": "true", "readOnly": "false", "required": "true", "inputField": "governmentPolicyNumber1", "placeHolder": "", "screenLabel": "Medicare", "defaultValue": "", "section": "billing", "subSection": "billing" },{"inputType": "text", "show": "true", "readOnly": "false", "required": "true", "inputField": "governmentPolicyNumber2", "placeHolder": "", "screenLabel": "Medicaid", "defaultValue": "", "section": "billing", "subSection": "billing" },{"inputType": "text", "show": "true", "readOnly": "false", "required": "false", "inputField": "policyHolder1Id", "placeHolder": "", "screenLabel": "Policy Holder ID", "defaultValue": "", "section": "billing", "subSection": "billing" },{"inputType": "text", "show": "true", "readOnly": "false", "required": "false", "inputField": "policyHolder2Id", "placeHolder": "", "screenLabel": "Policy Holder ID", "defaultValue": "", "section": "billing", "subSection": "billing" },{"inputType": "check", "show": "false", "readOnly": "false", "required": "false", "inputField": "consent", "placeHolder": "", "screenLabel": "consent", "defaultValue": "", "section": "consentForm", "subSection": "patientConsent" },{"inputType": "check", "show": "false", "readOnly": "false", "required": "false", "inputField": "patientSignature", "placeHolder": "", "screenLabel": "patientSignature", "defaultValue": "", "section": "consentForm", "subSection": "patientConsent" },{"inputType": "text", "show": "false", "readOnly": "false", "required": "false", "inputField": "consentBy", "placeHolder": "", "screenLabel": "consentBy", "defaultValue": "", "section": "consentForm", "subSection": "patientConsent" },{"inputType": "setName", "show": "false", "readOnly": "false", "required": "false", "inputField": "consenteePatientRelationship", "placeHolder": "", "screenLabel": "consenteePatientRelationship", "defaultValue": "relationship", "section": "consentForm", "subSection": "patientConsent" },{"inputType": "date", "show": "false", "readOnly": "false", "required": "false", "inputField": "patientSignatureDate", "placeHolder": "", "screenLabel": "patientSignatureDate", "defaultValue": "", "section": "consentForm", "subSection": "patientConsent" },{"inputType": "check", "show": "true", "readOnly": "false", "required": "false", "inputField": "physicianSignature", "placeHolder": "", "screenLabel": "Physician Signature", "defaultValue": "", "section": "consentForm", "subSection": "physicianAuthorization" },{"inputType": "date", "show": "true", "readOnly": "false", "required": "false", "inputField": "physicianSignatureDate", "placeHolder": "", "screenLabel": "Physician Signature Date", "defaultValue": "", "section": "consentForm", "subSection": "physicianAuthorization" },{"inputType": "textarea", "show": "true", "readOnly": "false", "required": "false", "inputField": "physicianComment", "placeHolder": "", "screenLabel": "Physician Comments", "defaultValue": "", "section": "consentForm", "subSection": "physicianAuthorization"}]',0),
        (10, 8, '[{"inputType": "section", "show": "true", "readOnly": "false", "required": "false", "inputField": "Order Information", "placeHolder": "", "screenLabel": "Order Information", "defaultValue": "", "section": "orderInformation", "subSection": "orderInformation" },{"inputType": "section", "show": "true", "readOnly": "false", "required": "false", "inputField": "File Upload", "placeHolder": "", "screenLabel": "File Upload", "defaultValue": "", "section": "fileUpload", "subSection": "fileUpload" },{"inputType": "section", "show": "true", "readOnly": "false", "required": "false", "inputField": "Patient Information", "placeHolder": "", "screenLabel": "Patient Information", "defaultValue": "", "section": "patientInformation", "subSection": "patientInformation" },{"inputType": "section", "show": "true", "readOnly": "false", "required": "false", "inputField": "Clinical Information", "placeHolder": "", "screenLabel": "Clinical Information", "defaultValue": "", "section": "clinicalInformation", "subSection": "clinicalInformation" },{"inputType": "section", "show": "true", "readOnly": "false", "required": "false", "inputField": "Panel Selection", "placeHolder": "", "screenLabel": "Panel Selection", "defaultValue": "", "section": "panelSelection", "subSection": "panelSelection" },{"inputType": "section", "show": "true", "readOnly": "false", "required": "false", "inputField": "Specimen Information", "placeHolder": "", "screenLabel": "Specimen Information", "defaultValue": "", "section": "specimenInfo", "subSection": "specimenInfo" },{"inputType": "section", "show": "false", "readOnly": "false", "required": "false", "inputField": "Proband", "placeHolder": "", "screenLabel": "Proband", "defaultValue": "", "section": "proband", "subSection": "proband" },{"inputType": "section", "show": "false", "readOnly": "false", "required": "false", "inputField": "Report Distribution", "placeHolder": "", "screenLabel": "Report Distribution", "defaultValue": "", "section": "reportDistribution", "subSection": "reportDistribution" },{"inputType": "section", "show": "true", "readOnly": "false", "required": "false", "inputField": "Billing Section", "placeHolder": "", "screenLabel": "Billing Section", "defaultValue": "", "section": "billing", "subSection": "billing" },{"inputType": "section", "show": "true", "readOnly": "false", "required": "false", "inputField": "Consent Form", "placeHolder": "", "screenLabel": "Consent Form", "defaultValue": "", "section": "consentForm", "subSection": "consentForm" },{"inputType": "subSection", "show": "true", "readOnly": "false", "required": "false", "inputField": "Patient Search", "placeHolder": "", "screenLabel": "Patient Search", "defaultValue": "", "section": "patientInformation", "subSection": "patientSearch" },{"inputType": "subSection", "show": "true", "readOnly": "false", "required": "false", "inputField": "Patient Identification", "placeHolder": "", "screenLabel": "Patient Identification", "defaultValue": "", "section": "patientInformation", "subSection": "patientIdentification" },{"inputType": "subSection", "show": "true", "readOnly": "false", "required": "false", "inputField": "Patient Contact Information", "placeHolder": "", "screenLabel": "Patient Contact Information", "defaultValue": "", "section": "patientInformation", "subSection": "patientContact" },{"inputType": "subSection", "show": "true", "readOnly": "false", "required": "false", "inputField": "Base Clinical Information", "placeHolder": "", "screenLabel": "Base Clinical Information", "defaultValue": "", "section": "clinicalInformation", "subSection": "clinicalInformationBasic" },{"inputType": "subSection", "show": "false", "readOnly": "false", "required": "false", "inputField": "PSA", "placeHolder": "", "screenLabel": "PSA", "defaultValue": "", "section": "clinicalInformation", "subSection": "PSA" },{"inputType": "subSection", "show": "false", "readOnly": "false", "required": "false", "inputField": "DRE", "placeHolder": "", "screenLabel": "DRE", "defaultValue": "", "section": "clinicalInformation", "subSection": "DRE" },{"inputType": "subSection", "show": "false", "readOnly": "false", "required": "false", "inputField": "Biopsy", "placeHolder": "", "screenLabel": "Biopsy", "defaultValue": "", "section": "clinicalInformation", "subSection": "biopsy" },{"inputType": "subSection", "show": "false", "readOnly": "false", "required": "false", "inputField": "Womens Health", "placeHolder": "", "screenLabel": "Womens Health", "defaultValue": "", "section": "clinicalInformation", "subSection": "womensHealth" },{"inputType": "subSection", "show": "false", "readOnly": "false", "required": "false", "inputField": "Newborn Screening", "placeHolder": "", "screenLabel": "Newborn Screening", "defaultValue": "", "section": "clinicalInformation", "subSection": "newbornScreening" },{"inputType": "subSection", "show": "false", "readOnly": "false", "required": "false", "inputField": "Tissue Donors", "placeHolder": "", "screenLabel": "Tissue Donors", "defaultValue": "", "section": "clinicalInformation", "subSection": "tissueDonors" },{"inputType": "subSection", "show": "false", "readOnly": "false", "required": "false", "inputField": "HIV Information", "placeHolder": "", "screenLabel": "HIV Information", "defaultValue": "", "section": "clinicalInformation", "subSection": "hivInformation" },{"inputType": "subSection", "show": "true", "readOnly": "false", "required": "false", "inputField": "Specimen Collection", "placeHolder": "", "screenLabel": "Specimen Collection", "defaultValue": "", "section": "specimenInfo", "subSection": "specimenEntry" },{"inputType": "subSection", "show": "false", "readOnly": "false", "required": "false", "inputField": "Additional Recipients", "placeHolder": "", "screenLabel": "Additional Recipients", "defaultValue": "", "section": "reportDistribution", "subSection": "additionalRecipients" },{"inputType": "subSection", "show": "false", "readOnly": "false", "required": "false", "inputField": "Additional Recipient Search", "placeHolder": "", "screenLabel": "Additional Recipient Search", "defaultValue": "", "section": "reportDistribution", "subSection": "additionalRecipientSearch" },{"inputType": "subSection", "show": "true", "readOnly": "false", "required": "false", "inputField": "Medical Codes", "placeHolder": "", "screenLabel": "Medical Codes", "defaultValue": "", "section": "billing", "subSection": "diagnosticCodes" },{"inputType": "subSection", "show": "false", "readOnly": "false", "required": "false", "inputField": "Patient Consent", "placeHolder": "", "screenLabel": "Patient Consent", "defaultValue": "", "section": "consentForm", "subSection": "patientConsent" },{"inputType": "subSection", "show": "true", "readOnly": "false", "required": "false", "inputField": "Physician Authorization", "placeHolder": "", "screenLabel": "Physician Authorization", "defaultValue": "", "section": "consentForm", "subSection": "physicianAuthorization" },{"inputType": "container", "show": "false", "readOnly": "false", "required": "false", "inputField": "requestId", "placeHolder": "", "screenLabel": "Order ID", "defaultValue": "", "section": "orderInformation", "subSection": "orderInformation" },{"inputType": "text", "show": "false", "readOnly": "false", "required": "false", "inputField": "externalRequestId", "placeHolder": "", "screenLabel": "External Order ID", "defaultValue": "", "section": "orderInformation", "subSection": "orderInformation" },{"inputType": "select", "show": "true", "readOnly": "false", "required": "true", "inputField": "physicianSiteId", "placeHolder": "", "screenLabel": "Site ID", "defaultValue": "", "section": "orderInformation", "subSection": "orderInformation" },{"inputType": "select", "show": "true", "readOnly": "false", "required": "true", "inputField": "physicianId", "placeHolder": "", "screenLabel": "Physician", "defaultValue": "", "section": "orderInformation", "subSection": "orderInformation" },{"inputType": "date", "show": "true", "readOnly": "false", "required": "false", "inputField": "orderInfoReceivedDate", "placeHolder": "", "screenLabel": "Order Received Date", "defaultValue": "", "section": "orderInformation", "subSection": "orderInformation" },{"inputType": "setName", "show": "true", "readOnly": "false", "required": "false", "inputField": "priority", "placeHolder": "", "screenLabel": "Priority", "defaultValue": "Priority", "section": "orderInformation", "subSection": "orderInformation" },{"inputType": "setName", "show": "false", "readOnly": "false", "required": "false", "inputField": "externalSystem", "placeHolder": "", "screenLabel": "External System", "defaultValue": "External Systems", "section": "orderInformation", "subSection": "orderInformation" },{"inputType": "textArea", "show": "true", "readOnly": "false", "required": "false", "inputField": "orderComment", "placeHolder": "", "screenLabel": "Order Comments", "defaultValue": "", "section": "orderInformation", "subSection": "orderInformation" },{"inputType": "file", "show": "true", "readOnly": "false", "required": "false", "inputField": "fileUpload_requisitionForm", "placeHolder": "", "screenLabel": "Requisition Form", "defaultValue": "", "section": "fileUpload", "subSection": "fileUpload" },{"inputType": "file", "show": "false", "readOnly": "false", "required": "false", "inputField": "fileUpload_specimenProcurement", "placeHolder": "", "screenLabel": "Specimen Procurement", "defaultValue": "", "section": "fileUpload", "subSection": "fileUpload" },{"inputType": "file", "show": "true", "readOnly": "false", "required": "false", "inputField": "fileUpload_insuranceInformation", "placeHolder": "", "screenLabel": "Insurance Card", "defaultValue": "", "section": "fileUpload", "subSection": "fileUpload" },{"inputType": "file", "show": "false", "readOnly": "false", "required": "false", "inputField": "fileUpload_emrSummarySheet", "placeHolder": "", "screenLabel": "EMR Summary Sheet", "defaultValue": "", "section": "fileUpload", "subSection": "fileUpload" },{"inputType": "file", "show": "false", "readOnly": "false", "required": "false", "inputField": "fileUpload_clinicalReport", "placeHolder": "", "screenLabel": "Clinical Report", "defaultValue": "", "section": "fileUpload", "subSection": "fileUpload" },{"inputType": "file", "show": "true", "readOnly": "false", "required": "false", "inputField": "fileUpload_other", "placeHolder": "", "screenLabel": "Other", "defaultValue": "", "section": "fileUpload", "subSection": "fileUpload" },{"inputType": "text", "show": "true", "readOnly": "false", "required": "true", "inputField": "firstName", "placeHolder": "", "screenLabel": "First Name", "defaultValue": "", "section": "patientInformation", "subSection": "patientIdentification" },{"inputType": "text", "show": "true", "readOnly": "false", "required": "false", "inputField": "middleName", "placeHolder": "", "screenLabel": "Middle Name", "defaultValue": "", "section": "patientInformation", "subSection": "patientIdentification" },{"inputType": "text", "show": "true", "readOnly": "false", "required": "true", "inputField": "lastName", "placeHolder": "", "screenLabel": "Last Name", "defaultValue": "", "section": "patientInformation", "subSection": "patientIdentification" },{"inputType": "text", "show": "true", "readOnly": "false", "required": "true", "inputField": "dob", "placeHolder": "", "screenLabel": "DOB", "defaultValue": "", "section": "patientInformation", "subSection": "patientIdentification" },{"inputType": "text", "show": "true", "readOnly": "false", "required": "true", "inputField": "mrn", "placeHolder": "", "screenLabel": "MRN", "defaultValue": "", "section": "patientInformation", "subSection": "patientIdentification" },{"inputType": "text", "show": "false", "readOnly": "false", "required": "false", "inputField": "govtId", "placeHolder": "", "screenLabel": "Government Id", "defaultValue": "", "section": "patientInformation", "subSection": "patientIdentification" },{"inputType": "setName", "show": "true", "readOnly": "false", "required": "false", "inputField": "geneticGender", "placeHolder": "", "screenLabel": "Gender", "defaultValue": "Gender", "section": "patientInformation", "subSection": "patientIdentification" },{"inputType": "setName", "show": "false", "readOnly": "false", "required": "false", "inputField": "genderId", "placeHolder": "", "screenLabel": "Gender ID", "defaultValue": "Gender", "section": "patientInformation", "subSection": "patientIdentification" },{"inputType": "setName", "show": "true", "readOnly": "false", "required": "false", "inputField": "ethnicity", "placeHolder": "", "screenLabel": "Ethnicity", "defaultValue": "Ethnicity", "section": "patientInformation", "subSection": "patientIdentification" },{"inputType": "text", "show": "true", "readOnly": "false", "required": "false", "inputField": "addressLine1", "placeHolder": "", "screenLabel": "Address 1", "defaultValue": "", "section": "patientInformation", "subSection": "patientContact" },{"inputType": "text", "show": "true", "readOnly": "false", "required": "false", "inputField": "workPhone", "placeHolder": "", "screenLabel": "Work Phone", "defaultValue": "", "section": "patientInformation", "subSection": "patientContact" },{"inputType": "text", "show": "false", "readOnly": "false", "required": "false", "inputField": "mobilePhoneCountryCode", "placeHolder": "", "screenLabel": "mobilePhoneCountryCode", "defaultValue": "", "section": "patientInformation", "subSection": "patientContact" },{"inputType": "text", "show": "true", "readOnly": "false", "required": "false", "inputField": "mobilePhone", "placeHolder": "", "screenLabel": "Mobile Phone", "defaultValue": "", "section": "patientInformation", "subSection": "patientContact" },{"inputType": "text", "show": "true", "readOnly": "false", "required": "false", "inputField": "email", "placeHolder": "", "screenLabel": "Email", "defaultValue": "", "section": "patientInformation", "subSection": "patientContact" },{"inputType": "text", "show": "true", "readOnly": "false", "required": "false", "inputField": "addressLine2", "placeHolder": "", "screenLabel": "Address 2", "defaultValue": "", "section": "patientInformation", "subSection": "patientContact" },{"inputType": "text", "show": "true", "readOnly": "false", "required": "false", "inputField": "city", "placeHolder": "", "screenLabel": "City", "defaultValue": "", "section": "patientInformation", "subSection": "patientContact" },{"inputType": "text", "show": "true", "readOnly": "false", "required": "false", "inputField": "state", "placeHolder": "", "screenLabel": "State", "defaultValue": "", "section": "patientInformation", "subSection": "patientContact" },{"inputType": "text", "show": "true", "readOnly": "false", "required": "false", "inputField": "postalCode", "placeHolder": "", "screenLabel": "Zip", "defaultValue": "", "section": "patientInformation", "subSection": "patientContact" },{"inputType": "text", "show": "false", "readOnly": "false", "required": "false", "inputField": "country", "placeHolder": "", "screenLabel": "Country", "defaultValue": "", "section": "patientInformation", "subSection": "patientContact" },{"inputType": "text", "show": "false", "readOnly": "false", "required": "false", "inputField": "homePhoneCountryCode", "placeHolder": "", "screenLabel": "homePhoneCountryCode", "defaultValue": "", "section": "patientInformation", "subSection": "patientContact" },{"inputType": "text", "show": "true", "readOnly": "false", "required": "false", "inputField": "homePhone", "placeHolder": "", "screenLabel": "Home Phone", "defaultValue": "", "section": "patientInformation", "subSection": "patientContact" },{"inputType": "text", "show": "false", "readOnly": "false", "required": "false", "inputField": "workPhoneCountryCode", "placeHolder": "", "screenLabel": "workPhoneCountryCode", "defaultValue": "", "section": "patientInformation", "subSection": "patientContact" },{"inputType": "text", "show": "false", "readOnly": "false", "required": "false", "inputField": "ageAtInitialPresentation", "placeHolder": "", "screenLabel": "Age at Presentation", "defaultValue": "", "section": "clinicalInformation", "subSection": "clinicalInformationBasic" },{"inputType": "textarea", "show": "false", "readOnly": "false", "required": "false", "inputField": "clinicalNotes", "placeHolder": "", "screenLabel": "Clinical Notes", "defaultValue": "", "section": "clinicalInformation", "subSection": "clinicalInformationBasic" },{"inputType": "select", "show": "false", "readOnly": "false", "required": "false", "inputField": "geneticCounselor", "placeHolder": "", "screenLabel": "Genetic Counselor", "defaultValue": "", "section": "clinicalInformation", "subSection": "clinicalInformationBasic" },{"inputType": "textarea", "show": "true", "readOnly": "false", "required": "false", "inputField": "clinicalHistory", "placeHolder": "", "screenLabel": "Clinical History", "defaultValue": "", "section": "clinicalInformation", "subSection": "clinicalInformationBasic" },{"inputType": "select", "show": "true", "readOnly": "false", "required": "false", "inputField": "currentMedications", "placeHolder": "", "screenLabel": "Current Medication", "defaultValue": "", "section": "clinicalInformation", "subSection": "clinicalInformationBasic" },{"inputType": "select", "show": "true", "readOnly": "false", "required": "false", "inputField": "problematicMedications", "placeHolder": "", "screenLabel": "Problematic Medication", "defaultValue": "", "section": "clinicalInformation", "subSection": "clinicalInformationBasic" },{"inputType": "select", "show": "true", "readOnly": "false", "required": "false", "inputField": "drugAllergies", "placeHolder": "", "screenLabel": "Drug Allergies", "defaultValue": "", "section": "clinicalInformation", "subSection": "clinicalInformationBasic" },{"inputType": "date", "show": "false", "readOnly": "false", "required": "false", "inputField": "dateOfLastPSA", "placeHolder": "", "screenLabel": "dateOfLastPSA", "defaultValue": "", "section": "clinicalInformation", "subSection": "PSA" },{"inputType": "date", "show": "false", "readOnly": "false", "required": "false", "inputField": "lastPSA", "placeHolder": "", "screenLabel": "lastPSA", "defaultValue": "", "section": "clinicalInformation", "subSection": "PSA" },{"inputType": "text", "show": "false", "readOnly": "false", "required": "false", "inputField": "percentFreePSA", "placeHolder": "", "screenLabel": "percentFreePSA", "defaultValue": "", "section": "clinicalInformation", "subSection": "PSA" },{"inputType": "date", "show": "false", "readOnly": "false", "required": "false", "inputField": "dateOfLastDRE", "placeHolder": "", "screenLabel": "dateOfLastDRE", "defaultValue": "", "section": "clinicalInformation", "subSection": "DRE" },{"inputType": "textarea", "show": "false", "readOnly": "false", "required": "false", "inputField": "lastDREResults", "placeHolder": "", "screenLabel": "lastDREResults", "defaultValue": "", "section": "clinicalInformation", "subSection": "DRE" },{"inputType": "text", "show": "false", "readOnly": "false", "required": "false", "inputField": "biopsyHistoryNumber", "placeHolder": "", "screenLabel": "biopsyHistoryNumber", "defaultValue": "", "section": "clinicalInformation", "subSection": "biopsy" },{"inputType": "textarea", "show": "false", "readOnly": "false", "required": "false", "inputField": "biopsyHistoryOther", "placeHolder": "", "screenLabel": "biopsyHistoryOther", "defaultValue": "", "section": "clinicalInformation", "subSection": "biopsy" },{"inputType": "textarea", "show": "false", "readOnly": "false", "required": "false", "inputField": "histopathologyFindings", "placeHolder": "", "screenLabel": "histopathologyFindings", "defaultValue": "", "section": "clinicalInformation", "subSection": "biopsy" },{"inputType": "date", "show": "false", "readOnly": "false", "required": "false", "inputField": "lastMenstrualCycle", "placeHolder": "", "screenLabel": "lastMenstrualCycle", "defaultValue": "", "section": "clinicalInformation", "subSection": "womensHealth" },{"inputType": "checkbox", "show": "false", "readOnly": "false", "required": "false", "inputField": "pregnant", "placeHolder": "", "screenLabel": "pregnant", "defaultValue": "", "section": "clinicalInformation", "subSection": "womensHealth" },{"inputType": "date", "show": "false", "readOnly": "false", "required": "false", "inputField": "lastPregnancy", "placeHolder": "", "screenLabel": "lastPregnancy", "defaultValue": "", "section": "clinicalInformation", "subSection": "womensHealth" },{"inputType": "checkbox", "show": "false", "readOnly": "false", "required": "false", "inputField": "hysterectomy", "placeHolder": "", "screenLabel": "hysterectomy", "defaultValue": "", "section": "clinicalInformation", "subSection": "womensHealth" },{"inputType": "checkbox", "show": "false", "readOnly": "false", "required": "false", "inputField": "miscarriages", "placeHolder": "", "screenLabel": "miscarriages", "defaultValue": "", "section": "clinicalInformation", "subSection": "womensHealth" },{"inputType": "checkbox", "show": "false", "readOnly": "false", "required": "false", "inputField": "thyroidIssues", "placeHolder": "", "screenLabel": "thyroidIssues", "defaultValue": "", "section": "clinicalInformation", "subSection": "womensHealth" },{"inputType": "text", "show": "false", "readOnly": "false", "required": "false", "inputField": "birthWeight", "placeHolder": "", "screenLabel": "birthWeight", "defaultValue": "", "section": "clinicalInformation", "subSection": "newbornScreening" },{"inputType": "checkbox", "show": "false", "readOnly": "false", "required": "false", "inputField": "meconiumIleus", "placeHolder": "", "screenLabel": "meconiumIleus", "defaultValue": "", "section": "clinicalInformation", "subSection": "newbornScreening" },{"inputType": "setName", "show": "false", "readOnly": "false", "required": "false", "inputField": "prePostTransfusion", "placeHolder": "", "screenLabel": "prePostTransfusion", "defaultValue": "Transfusion Status", "section": "clinicalInformation", "subSection": "newbornScreening" },{"inputType": "checkbox", "show": "false", "readOnly": "false", "required": "false", "inputField": "ambiguousGenitalia", "placeHolder": "", "screenLabel": "ambiguousGenitalia", "defaultValue": "", "section": "clinicalInformation", "subSection": "newbornScreening" },{"inputType": "text", "show": "false", "readOnly": "false", "required": "false", "inputField": "motherFullName", "placeHolder": "", "screenLabel": "motherFullName", "defaultValue": "", "section": "clinicalInformation", "subSection": "newbornScreening" },{"inputType": "date", "show": "false", "readOnly": "false", "required": "false", "inputField": "dateOfFirstMilk", "placeHolder": "", "screenLabel": "dateOfFirstMilk", "defaultValue": "", "section": "clinicalInformation", "subSection": "newbornScreening" },{"inputType": "text", "show": "false", "readOnly": "false", "required": "false", "inputField": "timeOfFirstMilk", "placeHolder": "", "screenLabel": "timeOfFirstMilk", "defaultValue": "", "section": "clinicalInformation", "subSection": "newbornScreening" },{"inputType": "textArea", "show": "false", "readOnly": "false", "required": "false", "inputField": "FeedingHistory", "placeHolder": "", "screenLabel": "FeedingHistory", "defaultValue": "", "section": "clinicalInformation", "subSection": "newbornScreening" },{"inputType": "text", "show": "false", "readOnly": "false", "required": "false", "inputField": "clinicalHistoryOfMother", "placeHolder": "", "screenLabel": "clinicalHistoryOfMother", "defaultValue": "", "section": "clinicalInformation", "subSection": "newbornScreening" },{"inputType": "text", "show": "false", "readOnly": "false", "required": "false", "inputField": "placeOfBirth", "placeHolder": "", "screenLabel": "placeOfBirth", "defaultValue": "", "section": "clinicalInformation", "subSection": "newbornScreening" },{"inputType": "text", "show": "false", "readOnly": "false", "required": "false", "inputField": "birthTime", "placeHolder": "", "screenLabel": "birthTime", "defaultValue": "", "section": "clinicalInformation", "subSection": "newbornScreening" },{"inputType": "text", "show": "false", "readOnly": "false", "required": "false", "inputField": "locationOfSampling", "placeHolder": "", "screenLabel": "locationOfSampling", "defaultValue": "", "section": "clinicalInformation", "subSection": "newbornScreening" },{"inputType": "text", "show": "false", "readOnly": "false", "required": "false", "inputField": "babyIdentifyingNumber", "placeHolder": "", "screenLabel": "babyIdentifyingNumber", "defaultValue": "", "section": "clinicalInformation", "subSection": "newbornScreening" },{"inputType": "setName", "show": "false", "readOnly": "false", "required": "false", "inputField": "privatePublicPatient", "placeHolder": "", "screenLabel": "privatePublicPatient", "defaultValue": "Patient Type", "section": "clinicalInformation", "subSection": "newbornScreening" },{"inputType": "text", "show": "false", "readOnly": "false", "required": "false", "inputField": "referringDoctor", "placeHolder": "", "screenLabel": "referringDoctor", "defaultValue": "", "section": "clinicalInformation", "subSection": "newbornScreening" },{"inputType": "checkbox", "show": "false", "readOnly": "false", "required": "false", "inputField": "repeatSample", "placeHolder": "", "screenLabel": "repeatSample", "defaultValue": "", "section": "clinicalInformation", "subSection": "newbornScreening" },{"inputType": "checkbox", "show": "false", "readOnly": "false", "required": "false", "inputField": "familyHistoryCF", "placeHolder": "", "screenLabel": "familyHistoryCF", "defaultValue": "", "section": "clinicalInformation", "subSection": "newbornScreening" },{"inputType": "setName", "show": "false", "readOnly": "false", "required": "false", "inputField": "donorOrRecipient", "placeHolder": "", "screenLabel": "donorOrRecipient", "defaultValue": "Tissue Donor Relationship", "section": "clinicalInformation", "subSection": "tissueDonors" },{"inputType": "textArea", "show": "false", "readOnly": "false", "required": "false", "inputField": "transfusionHistory", "placeHolder": "", "screenLabel": "transfusionHistory", "defaultValue": "", "section": "clinicalInformation", "subSection": "tissueDonors" },{"inputType": "setName", "show": "false", "readOnly": "false", "required": "false", "inputField": "bloodType", "placeHolder": "", "screenLabel": "bloodType", "defaultValue": "Blood Type", "section": "clinicalInformation", "subSection": "tissueDonors" },{"inputType": "textArea", "show": "false", "readOnly": "false", "required": "false", "inputField": "transfusionTransplantHistory", "placeHolder": "", "screenLabel": "transfusionTransplantHistory", "defaultValue": "", "section": "clinicalInformation", "subSection": "hivInformation" },{"inputType": "queryValue_limit", "show": "true", "readOnly": "false", "required": "false", "inputField": "specimenOrderMax", "placeHolder": "", "screenLabel": "specimenOrderMax", "defaultValue": "5", "section": "specimenInfo", "subSection": "specimenInfo" },{"inputType": "column_text", "show": "false", "readOnly": "false", "required": "false", "inputField": "expectedBarcode", "placeHolder": "", "screenLabel": "Expected Barcode", "defaultValue": "", "section": "specimenInfo", "subSection": "specimenEntry" },{"inputType": "column_text", "show": "true", "readOnly": "false", "required": "false", "inputField": "externalIdentifier", "placeHolder": "", "screenLabel": "External ID", "defaultValue": "", "section": "specimenInfo", "subSection": "specimenEntry" },{"inputType": "column_setName", "show": "true", "readOnly": "false", "required": "true", "inputField": "specimenType", "placeHolder": "", "screenLabel": "Specimen Type", "defaultValue": "Specimen Type", "section": "specimenInfo", "subSection": "specimenEntry" },{"inputType": "column_date", "show": "true", "readOnly": "false", "required": "false", "inputField": "collectionDate", "placeHolder": "", "screenLabel": "Collection Date", "defaultValue": "", "section": "specimenInfo", "subSection": "specimenEntry" },{"inputType": "column_time", "show": "true", "readOnly": "false", "required": "false", "inputField": "collectionTime", "placeHolder": "", "screenLabel": "Collection Time", "defaultValue": "", "section": "specimenInfo", "subSection": "specimenEntry" },{"inputType": "text", "show": "true", "readOnly": "false", "required": "true", "inputField": "governmentPolicyNumber1", "placeHolder": "", "screenLabel": "Medicare", "defaultValue": "", "section": "billing", "subSection": "billing" },{"inputType": "text", "show": "true", "readOnly": "false", "required": "true", "inputField": "governmentPolicyNumber2", "placeHolder": "", "screenLabel": "Medicaid", "defaultValue": "", "section": "billing", "subSection": "billing" },{"inputType": "text", "show": "true", "readOnly": "false", "required": "false", "inputField": "policyHolder1Id", "placeHolder": "", "screenLabel": "Policy Holder ID", "defaultValue": "", "section": "billing", "subSection": "billing" },{"inputType": "text", "show": "true", "readOnly": "false", "required": "false", "inputField": "policyHolder2Id", "placeHolder": "", "screenLabel": "Policy Holder ID", "defaultValue": "", "section": "billing", "subSection": "billing" },{"inputType": "check", "show": "false", "readOnly": "false", "required": "false", "inputField": "consent", "placeHolder": "", "screenLabel": "consent", "defaultValue": "", "section": "consentForm", "subSection": "patientConsent" },{"inputType": "check", "show": "false", "readOnly": "false", "required": "false", "inputField": "patientSignature", "placeHolder": "", "screenLabel": "patientSignature", "defaultValue": "", "section": "consentForm", "subSection": "patientConsent" },{"inputType": "text", "show": "false", "readOnly": "false", "required": "false", "inputField": "consentBy", "placeHolder": "", "screenLabel": "consentBy", "defaultValue": "", "section": "consentForm", "subSection": "patientConsent" },{"inputType": "setName", "show": "false", "readOnly": "false", "required": "false", "inputField": "consenteePatientRelationship", "placeHolder": "", "screenLabel": "consenteePatientRelationship", "defaultValue": "relationship", "section": "consentForm", "subSection": "patientConsent" },{"inputType": "date", "show": "false", "readOnly": "false", "required": "false", "inputField": "patientSignatureDate", "placeHolder": "", "screenLabel": "patientSignatureDate", "defaultValue": "", "section": "consentForm", "subSection": "patientConsent" },{"inputType": "check", "show": "true", "readOnly": "false", "required": "false", "inputField": "physicianSignature", "placeHolder": "", "screenLabel": "Physician Signature", "defaultValue": "", "section": "consentForm", "subSection": "physicianAuthorization" },{"inputType": "date", "show": "true", "readOnly": "false", "required": "false", "inputField": "physicianSignatureDate", "placeHolder": "", "screenLabel": "Physician Signature Date", "defaultValue": "", "section": "consentForm", "subSection": "physicianAuthorization" },{"inputType": "textarea", "show": "true", "readOnly": "false", "required": "false", "inputField": "physicianComment", "placeHolder": "", "screenLabel": "Physician Comments", "defaultValue": "", "section": "consentForm", "subSection": "physicianAuthorization"}]',0),
        (11, 9, '[{"inputType": "checkbox", "show": "true", "readOnly": "false", "required": "false", "inputField": "printBarcodesButton", "placeHolder": "", "screenLabel": "printBarcodesButton", "defaultValue": "", "section": "specimenInfo", "subSection": "specimenInfo" },{"inputType": "checkbox", "show": "false", "readOnly": "false", "required": "false", "inputField": "receiveAtOrderReview", "placeHolder": "", "screenLabel": "receiveAtOrderReview", "defaultValue": "", "section": "specimenInfo", "subSection": "specimenInfo" },{"inputType": "column_container", "show": "true", "readOnly": "false", "required": "true", "inputField": "specimenId", "placeHolder": "", "screenLabel": "Specimen ID", "defaultValue": "", "section": "specimenInfo", "subSection": "receivingInfo" },{"inputType": "column_date", "show": "true", "readOnly": "false", "required": "true", "inputField": "receivedDate", "placeHolder": "", "screenLabel": "Received Date", "defaultValue": "", "section": "specimenInfo", "subSection": "receivingInfo" },{"inputType": "column_select", "show": "true", "readOnly": "false", "required": "true", "inputField": "tests", "placeHolder": "", "screenLabel": "Test", "defaultValue": "", "section": "specimenInfo", "subSection": "receivingInfo" },{"inputType": "column_select", "show": "true", "readOnly": "false", "required": "false", "inputField": "method", "placeHolder": "", "screenLabel": "Method", "defaultValue": "", "section": "specimenInfo", "subSection": "receivingInfo" },{"inputType": "column_text", "show": "true", "readOnly": "false", "required": "false", "inputField": "specimenQuantity", "placeHolder": "", "screenLabel": "Specimen Quantity", "defaultValue": "", "section": "specimenInfo", "subSection": "receivingInfo" },{"inputType": "column_setName", "show": "true", "readOnly": "false", "required": "false", "inputField": "specimenUnits", "placeHolder": "", "screenLabel": "Units", "defaultValue": "Liquid Units", "section": "specimenInfo", "subSection": "receivingInfo" },{"inputType": "column_setName", "show": "true", "readOnly": "false", "required": "true", "inputField": "specimenCondition", "placeHolder": "", "screenLabel": "Specimen Condition", "defaultValue": "Specimen Condition", "section": "specimenInfo", "subSection": "receivingInfo" },{"inputType": "column_textArea", "show": "true", "readOnly": "false", "required": "false", "inputField": "specimenComments", "placeHolder": "", "screenLabel": "Comments", "defaultValue": "", "section": "specimenInfo", "subSection": "receivingInfo" },{"inputType": "section", "show": "true", "readOnly": "false", "required": "false", "inputField": "Receiving Information", "placeHolder": "", "screenLabel": "Receiving Information", "defaultValue": "", "section": "specimenInfo", "subSection": "specimenInfo" },{"inputType": "subSection", "show": "true", "readOnly": "false", "required": "false", "inputField": "Specimen Information", "placeHolder": "", "screenLabel": "Specimen Information", "defaultValue": "", "section": "specimenInfo", "subSection": "receivingInfo" }]',0),
        (12, 10, '[{"inputType": "section", "show": "true", "readOnly": "true", "required": "false", "inputField": "Order Information", "placeHolder": "", "screenLabel": "Order Information", "defaultValue": "", "section": "orderInformation", "subSection": "orderInformation" },{"inputType": "section", "show": "true", "readOnly": "true", "required": "false", "inputField": "File Upload", "placeHolder": "", "screenLabel": "File Upload", "defaultValue": "", "section": "fileUpload", "subSection": "fileUpload" },{"inputType": "section", "show": "true", "readOnly": "true", "required": "false", "inputField": "Patient Information", "placeHolder": "", "screenLabel": "Patient Information", "defaultValue": "", "section": "patientInformation", "subSection": "patientInformation" },{"inputType": "section", "show": "true", "readOnly": "true", "required": "false", "inputField": "Clinical Information", "placeHolder": "", "screenLabel": "Clinical Information", "defaultValue": "", "section": "clinicalInformation", "subSection": "clinicalInformation" },{"inputType": "section", "show": "true", "readOnly": "true", "required": "false", "inputField": "Panel Selection", "placeHolder": "", "screenLabel": "Panel Selection", "defaultValue": "", "section": "panelSelection", "subSection": "panelSelection" },{"inputType": "section", "show": "true", "readOnly": "true", "required": "false", "inputField": "Specimen Information", "placeHolder": "", "screenLabel": "Specimen Information", "defaultValue": "", "section": "specimenInfo", "subSection": "specimenInfo" },{"inputType": "section", "show": "false", "readOnly": "true", "required": "false", "inputField": "Proband", "placeHolder": "", "screenLabel": "Proband", "defaultValue": "", "section": "proband", "subSection": "proband" },{"inputType": "section", "show": "false", "readOnly": "true", "required": "false", "inputField": "Report Distribution", "placeHolder": "", "screenLabel": "Report Distribution", "defaultValue": "", "section": "reportDistribution", "subSection": "reportDistribution" },{"inputType": "section", "show": "true", "readOnly": "true", "required": "false", "inputField": "Billing Section", "placeHolder": "", "screenLabel": "Billing Section", "defaultValue": "", "section": "billing", "subSection": "billing" },{"inputType": "section", "show": "true", "readOnly": "true", "required": "false", "inputField": "Consent Form", "placeHolder": "", "screenLabel": "Consent Form", "defaultValue": "", "section": "consentForm", "subSection": "consentForm" },{"inputType": "subSection", "show": "true", "readOnly": "true", "required": "false", "inputField": "Patient Search", "placeHolder": "", "screenLabel": "Patient Search", "defaultValue": "", "section": "patientInformation", "subSection": "patientSearch" },{"inputType": "subSection", "show": "true", "readOnly": "true", "required": "false", "inputField": "Patient Identification", "placeHolder": "", "screenLabel": "Patient Identification", "defaultValue": "", "section": "patientInformation", "subSection": "patientIdentification" },{"inputType": "subSection", "show": "true", "readOnly": "true", "required": "false", "inputField": "Patient Contact Information", "placeHolder": "", "screenLabel": "Patient Contact Information", "defaultValue": "", "section": "patientInformation", "subSection": "patientContact" },{"inputType": "subSection", "show": "true", "readOnly": "true", "required": "false", "inputField": "Base Clinical Information", "placeHolder": "", "screenLabel": "Base Clinical Information", "defaultValue": "", "section": "clinicalInformation", "subSection": "clinicalInformationBasic" },{"inputType": "subSection", "show": "false", "readOnly": "true", "required": "false", "inputField": "PSA", "placeHolder": "", "screenLabel": "PSA", "defaultValue": "", "section": "clinicalInformation", "subSection": "PSA" },{"inputType": "subSection", "show": "false", "readOnly": "true", "required": "false", "inputField": "DRE", "placeHolder": "", "screenLabel": "DRE", "defaultValue": "", "section": "clinicalInformation", "subSection": "DRE" },{"inputType": "subSection", "show": "false", "readOnly": "true", "required": "false", "inputField": "Biopsy", "placeHolder": "", "screenLabel": "Biopsy", "defaultValue": "", "section": "clinicalInformation", "subSection": "biopsy" },{"inputType": "subSection", "show": "false", "readOnly": "true", "required": "false", "inputField": "Womens Health", "placeHolder": "", "screenLabel": "Womens Health", "defaultValue": "", "section": "clinicalInformation", "subSection": "womensHealth" },{"inputType": "subSection", "show": "false", "readOnly": "true", "required": "false", "inputField": "Newborn Screening", "placeHolder": "", "screenLabel": "Newborn Screening", "defaultValue": "", "section": "clinicalInformation", "subSection": "newbornScreening" },{"inputType": "subSection", "show": "false", "readOnly": "true", "required": "false", "inputField": "Tissue Donors", "placeHolder": "", "screenLabel": "Tissue Donors", "defaultValue": "", "section": "clinicalInformation", "subSection": "tissueDonors" },{"inputType": "subSection", "show": "false", "readOnly": "true", "required": "false", "inputField": "HIV Information", "placeHolder": "", "screenLabel": "HIV Information", "defaultValue": "", "section": "clinicalInformation", "subSection": "hivInformation" },{"inputType": "subSection", "show": "true", "readOnly": "true", "required": "false", "inputField": "Specimen Collection", "placeHolder": "", "screenLabel": "Specimen Collection", "defaultValue": "", "section": "specimenInfo", "subSection": "specimenEntry" },{"inputType": "subSection", "show": "false", "readOnly": "true", "required": "false", "inputField": "Additional Recipients", "placeHolder": "", "screenLabel": "Additional Recipients", "defaultValue": "", "section": "reportDistribution", "subSection": "additionalRecipients" },{"inputType": "subSection", "show": "false", "readOnly": "true", "required": "false", "inputField": "Additional Recipient Search", "placeHolder": "", "screenLabel": "Additional Recipient Search", "defaultValue": "", "section": "reportDistribution", "subSection": "additionalRecipientSearch" },{"inputType": "subSection", "show": "true", "readOnly": "true", "required": "false", "inputField": "Medical Codes", "placeHolder": "", "screenLabel": "Medical Codes", "defaultValue": "", "section": "billing", "subSection": "diagnosticCodes" },{"inputType": "subSection", "show": "false", "readOnly": "true", "required": "false", "inputField": "Patient Consent", "placeHolder": "", "screenLabel": "Patient Consent", "defaultValue": "", "section": "consentForm", "subSection": "patientConsent" },{"inputType": "subSection", "show": "true", "readOnly": "true", "required": "false", "inputField": "Physician Authorization", "placeHolder": "", "screenLabel": "Physician Authorization", "defaultValue": "", "section": "consentForm", "subSection": "physicianAuthorization" },{"inputType": "container", "show": "false", "readOnly": "true", "required": "false", "inputField": "requestId", "placeHolder": "", "screenLabel": "Order ID", "defaultValue": "", "section": "orderInformation", "subSection": "orderInformation" },{"inputType": "text", "show": "false", "readOnly": "true", "required": "false", "inputField": "externalRequestId", "placeHolder": "", "screenLabel": "External Order ID", "defaultValue": "", "section": "orderInformation", "subSection": "orderInformation" },{"inputType": "select", "show": "true", "readOnly": "true", "required": "false", "inputField": "physicianSiteId", "placeHolder": "", "screenLabel": "Site ID", "defaultValue": "", "section": "orderInformation", "subSection": "orderInformation" },{"inputType": "select", "show": "true", "readOnly": "true", "required": "false", "inputField": "physicianId", "placeHolder": "", "screenLabel": "Physician", "defaultValue": "", "section": "orderInformation", "subSection": "orderInformation" },{"inputType": "date", "show": "true", "readOnly": "true", "required": "false", "inputField": "orderInfoReceivedDate", "placeHolder": "", "screenLabel": "Order Received Date", "defaultValue": "", "section": "orderInformation", "subSection": "orderInformation" },{"inputType": "setName", "show": "true", "readOnly": "true", "required": "false", "inputField": "priority", "placeHolder": "", "screenLabel": "Priority", "defaultValue": "Priority", "section": "orderInformation", "subSection": "orderInformation" },{"inputType": "setName", "show": "false", "readOnly": "true", "required": "false", "inputField": "externalSystem", "placeHolder": "", "screenLabel": "External System", "defaultValue": "External Systems", "section": "orderInformation", "subSection": "orderInformation" },{"inputType": "textArea", "show": "true", "readOnly": "true", "required": "false", "inputField": "orderComment", "placeHolder": "", "screenLabel": "Order Comments", "defaultValue": "", "section": "orderInformation", "subSection": "orderInformation" },{"inputType": "file", "show": "true", "readOnly": "true", "required": "false", "inputField": "fileUpload_requisitionForm", "placeHolder": "", "screenLabel": "Requisition Form", "defaultValue": "", "section": "fileUpload", "subSection": "fileUpload" },{"inputType": "file", "show": "false", "readOnly": "true", "required": "false", "inputField": "fileUpload_specimenProcurement", "placeHolder": "", "screenLabel": "Specimen Procurement", "defaultValue": "", "section": "fileUpload", "subSection": "fileUpload" },{"inputType": "file", "show": "true", "readOnly": "true", "required": "false", "inputField": "fileUpload_insuranceInformation", "placeHolder": "", "screenLabel": "Insurance Card", "defaultValue": "", "section": "fileUpload", "subSection": "fileUpload" },{"inputType": "file", "show": "false", "readOnly": "true", "required": "false", "inputField": "fileUpload_emrSummarySheet", "placeHolder": "", "screenLabel": "EMR Summary Sheet", "defaultValue": "", "section": "fileUpload", "subSection": "fileUpload" },{"inputType": "file", "show": "false", "readOnly": "true", "required": "false", "inputField": "fileUpload_clinicalReport", "placeHolder": "", "screenLabel": "Clinical Report", "defaultValue": "", "section": "fileUpload", "subSection": "fileUpload" },{"inputType": "file", "show": "true", "readOnly": "true", "required": "false", "inputField": "fileUpload_other", "placeHolder": "", "screenLabel": "Other", "defaultValue": "", "section": "fileUpload", "subSection": "fileUpload" },{"inputType": "text", "show": "true", "readOnly": "true", "required": "false", "inputField": "firstName", "placeHolder": "", "screenLabel": "First Name", "defaultValue": "", "section": "patientInformation", "subSection": "patientIdentification" },{"inputType": "text", "show": "true", "readOnly": "true", "required": "false", "inputField": "middleName", "placeHolder": "", "screenLabel": "Middle Name", "defaultValue": "", "section": "patientInformation", "subSection": "patientIdentification" },{"inputType": "text", "show": "true", "readOnly": "true", "required": "false", "inputField": "lastName", "placeHolder": "", "screenLabel": "Last Name", "defaultValue": "", "section": "patientInformation", "subSection": "patientIdentification" },{"inputType": "text", "show": "true", "readOnly": "true", "required": "false", "inputField": "dob", "placeHolder": "", "screenLabel": "DOB", "defaultValue": "", "section": "patientInformation", "subSection": "patientIdentification" },{"inputType": "text", "show": "true", "readOnly": "true", "required": "false", "inputField": "mrn", "placeHolder": "", "screenLabel": "MRN", "defaultValue": "", "section": "patientInformation", "subSection": "patientIdentification" },{"inputType": "text", "show": "false", "readOnly": "true", "required": "false", "inputField": "govtId", "placeHolder": "", "screenLabel": "Government Id", "defaultValue": "", "section": "patientInformation", "subSection": "patientIdentification" },{"inputType": "setName", "show": "true", "readOnly": "true", "required": "false", "inputField": "geneticGender", "placeHolder": "", "screenLabel": "Gender", "defaultValue": "Gender", "section": "patientInformation", "subSection": "patientIdentification" },{"inputType": "setName", "show": "false", "readOnly": "true", "required": "false", "inputField": "genderId", "placeHolder": "", "screenLabel": "Gender ID", "defaultValue": "Gender", "section": "patientInformation", "subSection": "patientIdentification" },{"inputType": "setName", "show": "true", "readOnly": "true", "required": "false", "inputField": "ethnicity", "placeHolder": "", "screenLabel": "Ethnicity", "defaultValue": "Ethnicity", "section": "patientInformation", "subSection": "patientIdentification" },{"inputType": "text", "show": "true", "readOnly": "true", "required": "false", "inputField": "addressLine1", "placeHolder": "", "screenLabel": "Address 1", "defaultValue": "", "section": "patientInformation", "subSection": "patientContact" },{"inputType": "text", "show": "true", "readOnly": "true", "required": "false", "inputField": "workPhone", "placeHolder": "", "screenLabel": "Work Phone", "defaultValue": "", "section": "patientInformation", "subSection": "patientContact" },{"inputType": "text", "show": "false", "readOnly": "true", "required": "false", "inputField": "mobilePhoneCountryCode", "placeHolder": "", "screenLabel": "mobilePhoneCountryCode", "defaultValue": "", "section": "patientInformation", "subSection": "patientContact" },{"inputType": "text", "show": "true", "readOnly": "true", "required": "false", "inputField": "mobilePhone", "placeHolder": "", "screenLabel": "Mobile Phone", "defaultValue": "", "section": "patientInformation", "subSection": "patientContact" },{"inputType": "text", "show": "true", "readOnly": "true", "required": "false", "inputField": "email", "placeHolder": "", "screenLabel": "Email", "defaultValue": "", "section": "patientInformation", "subSection": "patientContact" },{"inputType": "text", "show": "true", "readOnly": "true", "required": "false", "inputField": "addressLine2", "placeHolder": "", "screenLabel": "Address 2", "defaultValue": "", "section": "patientInformation", "subSection": "patientContact" },{"inputType": "text", "show": "true", "readOnly": "true", "required": "false", "inputField": "city", "placeHolder": "", "screenLabel": "City", "defaultValue": "", "section": "patientInformation", "subSection": "patientContact" },{"inputType": "text", "show": "true", "readOnly": "true", "required": "false", "inputField": "state", "placeHolder": "", "screenLabel": "State", "defaultValue": "", "section": "patientInformation", "subSection": "patientContact" },{"inputType": "text", "show": "true", "readOnly": "true", "required": "false", "inputField": "postalCode", "placeHolder": "", "screenLabel": "Zip", "defaultValue": "", "section": "patientInformation", "subSection": "patientContact" },{"inputType": "text", "show": "false", "readOnly": "true", "required": "false", "inputField": "country", "placeHolder": "", "screenLabel": "Country", "defaultValue": "", "section": "patientInformation", "subSection": "patientContact" },{"inputType": "text", "show": "false", "readOnly": "true", "required": "false", "inputField": "homePhoneCountryCode", "placeHolder": "", "screenLabel": "homePhoneCountryCode", "defaultValue": "", "section": "patientInformation", "subSection": "patientContact" },{"inputType": "text", "show": "true", "readOnly": "true", "required": "false", "inputField": "homePhone", "placeHolder": "", "screenLabel": "Home Phone", "defaultValue": "", "section": "patientInformation", "subSection": "patientContact" },{"inputType": "text", "show": "false", "readOnly": "true", "required": "false", "inputField": "workPhoneCountryCode", "placeHolder": "", "screenLabel": "workPhoneCountryCode", "defaultValue": "", "section": "patientInformation", "subSection": "patientContact" },{"inputType": "text", "show": "false", "readOnly": "true", "required": "false", "inputField": "ageAtInitialPresentation", "placeHolder": "", "screenLabel": "Age at Presentation", "defaultValue": "", "section": "clinicalInformation", "subSection": "clinicalInformationBasic" },{"inputType": "textarea", "show": "false", "readOnly": "true", "required": "false", "inputField": "clinicalNotes", "placeHolder": "", "screenLabel": "Clinical Notes", "defaultValue": "", "section": "clinicalInformation", "subSection": "clinicalInformationBasic" },{"inputType": "select", "show": "false", "readOnly": "true", "required": "false", "inputField": "geneticCounselor", "placeHolder": "", "screenLabel": "Genetic Counselor", "defaultValue": "", "section": "clinicalInformation", "subSection": "clinicalInformationBasic" },{"inputType": "textarea", "show": "true", "readOnly": "true", "required": "false", "inputField": "clinicalHistory", "placeHolder": "", "screenLabel": "Clinical History", "defaultValue": "", "section": "clinicalInformation", "subSection": "clinicalInformationBasic" },{"inputType": "select", "show": "true", "readOnly": "true", "required": "false", "inputField": "currentMedications", "placeHolder": "", "screenLabel": "Current Medication", "defaultValue": "", "section": "clinicalInformation", "subSection": "clinicalInformationBasic" },{"inputType": "select", "show": "true", "readOnly": "true", "required": "false", "inputField": "problematicMedications", "placeHolder": "", "screenLabel": "Problematic Medication", "defaultValue": "", "section": "clinicalInformation", "subSection": "clinicalInformationBasic" },{"inputType": "select", "show": "true", "readOnly": "true", "required": "false", "inputField": "drugAllergies", "placeHolder": "", "screenLabel": "Drug Allergies", "defaultValue": "", "section": "clinicalInformation", "subSection": "clinicalInformationBasic" },{"inputType": "date", "show": "false", "readOnly": "true", "required": "false", "inputField": "dateOfLastPSA", "placeHolder": "", "screenLabel": "dateOfLastPSA", "defaultValue": "", "section": "clinicalInformation", "subSection": "PSA" },{"inputType": "date", "show": "false", "readOnly": "true", "required": "false", "inputField": "lastPSA", "placeHolder": "", "screenLabel": "lastPSA", "defaultValue": "", "section": "clinicalInformation", "subSection": "PSA" },{"inputType": "text", "show": "false", "readOnly": "true", "required": "false", "inputField": "percentFreePSA", "placeHolder": "", "screenLabel": "percentFreePSA", "defaultValue": "", "section": "clinicalInformation", "subSection": "PSA" },{"inputType": "date", "show": "false", "readOnly": "true", "required": "false", "inputField": "dateOfLastDRE", "placeHolder": "", "screenLabel": "dateOfLastDRE", "defaultValue": "", "section": "clinicalInformation", "subSection": "DRE" },{"inputType": "textarea", "show": "false", "readOnly": "true", "required": "false", "inputField": "lastDREResults", "placeHolder": "", "screenLabel": "lastDREResults", "defaultValue": "", "section": "clinicalInformation", "subSection": "DRE" },{"inputType": "text", "show": "false", "readOnly": "true", "required": "false", "inputField": "biopsyHistoryNumber", "placeHolder": "", "screenLabel": "biopsyHistoryNumber", "defaultValue": "", "section": "clinicalInformation", "subSection": "biopsy" },{"inputType": "textarea", "show": "false", "readOnly": "true", "required": "false", "inputField": "biopsyHistoryOther", "placeHolder": "", "screenLabel": "biopsyHistoryOther", "defaultValue": "", "section": "clinicalInformation", "subSection": "biopsy" },{"inputType": "textarea", "show": "false", "readOnly": "true", "required": "false", "inputField": "histopathologyFindings", "placeHolder": "", "screenLabel": "histopathologyFindings", "defaultValue": "", "section": "clinicalInformation", "subSection": "biopsy" },{"inputType": "date", "show": "false", "readOnly": "true", "required": "false", "inputField": "lastMenstrualCycle", "placeHolder": "", "screenLabel": "lastMenstrualCycle", "defaultValue": "", "section": "clinicalInformation", "subSection": "womensHealth" },{"inputType": "checkbox", "show": "false", "readOnly": "true", "required": "false", "inputField": "pregnant", "placeHolder": "", "screenLabel": "pregnant", "defaultValue": "", "section": "clinicalInformation", "subSection": "womensHealth" },{"inputType": "date", "show": "false", "readOnly": "true", "required": "false", "inputField": "lastPregnancy", "placeHolder": "", "screenLabel": "lastPregnancy", "defaultValue": "", "section": "clinicalInformation", "subSection": "womensHealth" },{"inputType": "checkbox", "show": "false", "readOnly": "true", "required": "false", "inputField": "hysterectomy", "placeHolder": "", "screenLabel": "hysterectomy", "defaultValue": "", "section": "clinicalInformation", "subSection": "womensHealth" },{"inputType": "checkbox", "show": "false", "readOnly": "true", "required": "false", "inputField": "miscarriages", "placeHolder": "", "screenLabel": "miscarriages", "defaultValue": "", "section": "clinicalInformation", "subSection": "womensHealth" },{"inputType": "checkbox", "show": "false", "readOnly": "true", "required": "false", "inputField": "thyroidIssues", "placeHolder": "", "screenLabel": "thyroidIssues", "defaultValue": "", "section": "clinicalInformation", "subSection": "womensHealth" },{"inputType": "text", "show": "false", "readOnly": "true", "required": "false", "inputField": "birthWeight", "placeHolder": "", "screenLabel": "birthWeight", "defaultValue": "", "section": "clinicalInformation", "subSection": "newbornScreening" },{"inputType": "checkbox", "show": "false", "readOnly": "true", "required": "false", "inputField": "meconiumIleus", "placeHolder": "", "screenLabel": "meconiumIleus", "defaultValue": "", "section": "clinicalInformation", "subSection": "newbornScreening" },{"inputType": "setName", "show": "false", "readOnly": "true", "required": "false", "inputField": "prePostTransfusion", "placeHolder": "", "screenLabel": "prePostTransfusion", "defaultValue": "Transfusion Status", "section": "clinicalInformation", "subSection": "newbornScreening" },{"inputType": "checkbox", "show": "false", "readOnly": "true", "required": "false", "inputField": "ambiguousGenitalia", "placeHolder": "", "screenLabel": "ambiguousGenitalia", "defaultValue": "", "section": "clinicalInformation", "subSection": "newbornScreening" },{"inputType": "text", "show": "false", "readOnly": "true", "required": "false", "inputField": "motherFullName", "placeHolder": "", "screenLabel": "motherFullName", "defaultValue": "", "section": "clinicalInformation", "subSection": "newbornScreening" },{"inputType": "date", "show": "false", "readOnly": "true", "required": "false", "inputField": "dateOfFirstMilk", "placeHolder": "", "screenLabel": "dateOfFirstMilk", "defaultValue": "", "section": "clinicalInformation", "subSection": "newbornScreening" },{"inputType": "text", "show": "false", "readOnly": "true", "required": "false", "inputField": "timeOfFirstMilk", "placeHolder": "", "screenLabel": "timeOfFirstMilk", "defaultValue": "", "section": "clinicalInformation", "subSection": "newbornScreening" },{"inputType": "textArea", "show": "false", "readOnly": "true", "required": "false", "inputField": "FeedingHistory", "placeHolder": "", "screenLabel": "FeedingHistory", "defaultValue": "", "section": "clinicalInformation", "subSection": "newbornScreening" },{"inputType": "text", "show": "false", "readOnly": "true", "required": "false", "inputField": "clinicalHistoryOfMother", "placeHolder": "", "screenLabel": "clinicalHistoryOfMother", "defaultValue": "", "section": "clinicalInformation", "subSection": "newbornScreening" },{"inputType": "text", "show": "false", "readOnly": "true", "required": "false", "inputField": "placeOfBirth", "placeHolder": "", "screenLabel": "placeOfBirth", "defaultValue": "", "section": "clinicalInformation", "subSection": "newbornScreening" },{"inputType": "text", "show": "false", "readOnly": "true", "required": "false", "inputField": "birthTime", "placeHolder": "", "screenLabel": "birthTime", "defaultValue": "", "section": "clinicalInformation", "subSection": "newbornScreening" },{"inputType": "text", "show": "false", "readOnly": "true", "required": "false", "inputField": "locationOfSampling", "placeHolder": "", "screenLabel": "locationOfSampling", "defaultValue": "", "section": "clinicalInformation", "subSection": "newbornScreening" },{"inputType": "text", "show": "false", "readOnly": "true", "required": "false", "inputField": "babyIdentifyingNumber", "placeHolder": "", "screenLabel": "babyIdentifyingNumber", "defaultValue": "", "section": "clinicalInformation", "subSection": "newbornScreening" },{"inputType": "setName", "show": "false", "readOnly": "true", "required": "false", "inputField": "privatePublicPatient", "placeHolder": "", "screenLabel": "privatePublicPatient", "defaultValue": "Patient Type", "section": "clinicalInformation", "subSection": "newbornScreening" },{"inputType": "text", "show": "false", "readOnly": "true", "required": "false", "inputField": "referringDoctor", "placeHolder": "", "screenLabel": "referringDoctor", "defaultValue": "", "section": "clinicalInformation", "subSection": "newbornScreening" },{"inputType": "checkbox", "show": "false", "readOnly": "true", "required": "false", "inputField": "repeatSample", "placeHolder": "", "screenLabel": "repeatSample", "defaultValue": "", "section": "clinicalInformation", "subSection": "newbornScreening" },{"inputType": "checkbox", "show": "false", "readOnly": "true", "required": "false", "inputField": "familyHistoryCF", "placeHolder": "", "screenLabel": "familyHistoryCF", "defaultValue": "", "section": "clinicalInformation", "subSection": "newbornScreening" },{"inputType": "setName", "show": "false", "readOnly": "true", "required": "false", "inputField": "donorOrRecipient", "placeHolder": "", "screenLabel": "donorOrRecipient", "defaultValue": "Tissue Donor Relationship", "section": "clinicalInformation", "subSection": "tissueDonors" },{"inputType": "textArea", "show": "false", "readOnly": "true", "required": "false", "inputField": "transfusionHistory", "placeHolder": "", "screenLabel": "transfusionHistory", "defaultValue": "", "section": "clinicalInformation", "subSection": "tissueDonors" },{"inputType": "setName", "show": "false", "readOnly": "true", "required": "false", "inputField": "bloodType", "placeHolder": "", "screenLabel": "bloodType", "defaultValue": "Blood Type", "section": "clinicalInformation", "subSection": "tissueDonors" },{"inputType": "textArea", "show": "false", "readOnly": "true", "required": "false", "inputField": "transfusionTransplantHistory", "placeHolder": "", "screenLabel": "transfusionTransplantHistory", "defaultValue": "", "section": "clinicalInformation", "subSection": "hivInformation" },{"inputType": "queryValue_limit", "show": "true", "readOnly": "true", "required": "false", "inputField": "specimenOrderMax", "placeHolder": "", "screenLabel": "specimenOrderMax", "defaultValue": "", "section": "specimenInfo", "subSection": "specimenInfo" },{"inputType": "column_text", "show": "false", "readOnly": "true", "required": "false", "inputField": "expectedBarcode", "placeHolder": "", "screenLabel": "Expected Barcode", "defaultValue": "", "section": "specimenInfo", "subSection": "specimenEntry" },{"inputType": "column_text", "show": "true", "readOnly": "true", "required": "false", "inputField": "externalIdentifier", "placeHolder": "", "screenLabel": "External ID", "defaultValue": "", "section": "specimenInfo", "subSection": "specimenEntry" },{"inputType": "column_setName", "show": "true", "readOnly": "true", "required": "false", "inputField": "specimenType", "placeHolder": "", "screenLabel": "Specimen Type", "defaultValue": "Specimen Type", "section": "specimenInfo", "subSection": "specimenEntry" },{"inputType": "column_date", "show": "true", "readOnly": "true", "required": "false", "inputField": "collectionDate", "placeHolder": "", "screenLabel": "Collection Date", "defaultValue": "", "section": "specimenInfo", "subSection": "specimenEntry" },{"inputType": "column_time", "show": "true", "readOnly": "true", "required": "false", "inputField": "collectionTime", "placeHolder": "", "screenLabel": "Collection Time", "defaultValue": "", "section": "specimenInfo", "subSection": "specimenEntry" },{"inputType": "text", "show": "true", "readOnly": "true", "required": "false", "inputField": "governmentPolicyNumber1", "placeHolder": "", "screenLabel": "Medicare", "defaultValue": "", "section": "billing", "subSection": "billing" },{"inputType": "text", "show": "true", "readOnly": "true", "required": "false", "inputField": "governmentPolicyNumber2", "placeHolder": "", "screenLabel": "Medicaid", "defaultValue": "", "section": "billing", "subSection": "billing" },{"inputType": "text", "show": "true", "readOnly": "true", "required": "false", "inputField": "policyHolder1Id", "placeHolder": "", "screenLabel": "Policy Holder ID", "defaultValue": "", "section": "billing", "subSection": "billing" },{"inputType": "text", "show": "true", "readOnly": "true", "required": "false", "inputField": "policyHolder2Id", "placeHolder": "", "screenLabel": "Policy Holder ID", "defaultValue": "", "section": "billing", "subSection": "billing" },{"inputType": "check", "show": "false", "readOnly": "true", "required": "false", "inputField": "consent", "placeHolder": "", "screenLabel": "consent", "defaultValue": "", "section": "consentForm", "subSection": "patientConsent" },{"inputType": "check", "show": "false", "readOnly": "true", "required": "false", "inputField": "patientSignature", "placeHolder": "", "screenLabel": "patientSignature", "defaultValue": "", "section": "consentForm", "subSection": "patientConsent" },{"inputType": "text", "show": "false", "readOnly": "true", "required": "false", "inputField": "consentBy", "placeHolder": "", "screenLabel": "consentBy", "defaultValue": "", "section": "consentForm", "subSection": "patientConsent" },{"inputType": "setName", "show": "false", "readOnly": "true", "required": "false", "inputField": "consenteePatientRelationship", "placeHolder": "", "screenLabel": "consenteePatientRelationship", "defaultValue": "relationship", "section": "consentForm", "subSection": "patientConsent" },{"inputType": "date", "show": "false", "readOnly": "true", "required": "false", "inputField": "patientSignatureDate", "placeHolder": "", "screenLabel": "patientSignatureDate", "defaultValue": "", "section": "consentForm", "subSection": "patientConsent" },{"inputType": "check", "show": "true", "readOnly": "true", "required": "false", "inputField": "physicianSignature", "placeHolder": "", "screenLabel": "Physician Signature", "defaultValue": "", "section": "consentForm", "subSection": "physicianAuthorization" },{"inputType": "date", "show": "true", "readOnly": "true", "required": "false", "inputField": "physicianSignatureDate", "placeHolder": "", "screenLabel": "Physician Signature Date", "defaultValue": "", "section": "consentForm", "subSection": "physicianAuthorization" },{"inputType": "textarea", "show": "true", "readOnly": "true", "required": "false", "inputField": "physicianComment", "placeHolder": "", "screenLabel": "Physician Comments", "defaultValue": "", "section": "consentForm", "subSection": "physicianAuthorization" }]',0);
        ALTER TABLE `formSettingsJSON` ENABLE KEYS;


        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'Adding fishProbeCutOff data');

        INSERT INTO `fishProbeCutOff` ( `probe`, `signalPattern01`, `signalPattern02`, `signalPattern03`, `signalPattern04`, `signalPattern05`, `signalPattern06`, `signalPattern07`, `signalPattern08`, `signalPattern09`, `signalPattern10`, `signalPattern11`, `signalPattern12`, `signalPattern13`, `signalPattern14`, `signalPattern15`, `cutOffValue01`, `cutOffValue02`, `cutOffValue03`, `cutOffValue04`, `cutOffValue05`, `cutOffValue06`, `cutOffValue07`, `cutOffValue08`, `cutOffValue09`, `cutOffValue10`, `cutOffValue11`, `cutOffValue12`, `cutOffValue13`, `cutOffValue14`, `cutOffValue15`)
        VALUES
            ('NEW', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);


        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'UPDATING Seed Data Version..... ');

        INSERT INTO dbVersionHistory
        (
            version,
            versionDate
        ) VALUES (
            'LIMSv3_ALPHADATA_001',
            NOW()
        );

        UPDATE dbSettings
        SET `value` = 'LIMSv3_ALPHADATA_001'
        WHERE `dbSetting` = 'dbCurrentDataVersion';

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'UPDATING Seed Data Version..... Success');

    ELSE

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'SKIPPING VERSION LIMSv3_ALPHADATA_000 UPDATES');

    END IF;
    -- LIMSv3_ALPHADATA_001 --> LIMSv3_ALPHADATA_002
    IF EXISTS(SELECT 1 FROM dbSettings WHERE dbSetting =  'dbCurrentDataVersion' AND `value` = 'LIMSv3_ALPHADATA_001') THEN

       INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'Updating validValues ');

       -- Valid Values
       INSERT IGNORE INTO `validValues`(`setName`, `displayValue`, `value`, `displayOrder`, `eventId`, `systemManaged`)
       VALUES
       ('Aliquot Actions', 'Send to Storage', 'sendToStorage', 2, 0, b'1'),
       ('Aliquot Actions', 'Discard', 'discardContainer', 3, 0, b'1'),
       ('Aliquot Actions', 'Route to Workflow', 'route', 1, 0, b'1'),

       ('analysisResults', 'Pass', 'pass', 1, 0, 0),
       ('analysisResults', 'Fail', 'fail', 2, 0, 1),
       ('analysisResults', 'Rework', 'rework', 3, 0, 1),
       ('analysisResults', 'Cancel', 'cancel', 4, 0, 1);

       INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'UPDATING Seed Data Version..... ');

       INSERT INTO dbVersionHistory
       (
          version,
           versionDate
       ) VALUES (
           'LIMSv3_ALPHADATA_002',
            NOW()
       );
       UPDATE dbSettings
       SET `value` = 'LIMSv3_ALPHADATA_002'
       WHERE `dbSetting` = 'dbCurrentDataVersion';

       INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'UPDATING Seed Data Version..... Success');
    ELSE
       INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'SKIPPING VERSION LIMSv3_ALPHADATA_001 UPDATES');
    END IF;

    -- LIMSv3_ALPHADATA_002 --> LIMSv3_ALPHADATA_003
    -- Update: 3.0.1-foxtrot seed data
    IF EXISTS(SELECT 1 FROM dbSettings WHERE dbSetting =  'dbCurrentDataVersion' AND `value` = 'LIMSv3_ALPHADATA_002') THEN

       INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'Updating validValues ');

       -- Valid Values
       INSERT IGNORE INTO `validValues`(`setName`, `displayValue`, `value`, `displayOrder`, `eventId`, `systemManaged`)
       VALUES
       ('nextStep', 'Next Step', 'Next Step', 1, 0, b'1'),
       ('nextStep', 'Storage', 'Storage', 2, 0, b'1'),
       ('dilutionFactorForDilutionSeries', '1:2', '0.5', 1, 0, b'1'),
       ('dilutionFactorForDilutionSeries', '1:5', '0.2', 2, 0, b'1'),
       ('dilutionFactorForDilutionSeries', '1:10', '0.1', 3, 0, b'1'),
       ('dilutionFactorForDilutionSeries', '1:20', '0.05', 4, 0, b'1'),
       ('dilutionFactorForDilutionSeries', '1:50', '0.02', 5,  0, b'1'),
       ('dilutionFactorForDilutionSeries', '1:100', '0.01', 6, 0, b'1');

       INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'UPDATING Seed Data Version..... ');

       INSERT INTO dbVersionHistory
       (
          version,
           versionDate
       ) VALUES (
           'LIMSv3_ALPHADATA_003',
            NOW()
       );
       UPDATE dbSettings
       SET `value` = 'LIMSv3_ALPHADATA_003'
       WHERE `dbSetting` = 'dbCurrentDataVersion';

       INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'UPDATING Seed Data Version..... Success');
    ELSE
       INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'SKIPPING VERSION LIMSv3_ALPHADATA_002 UPDATES');
    END IF;

    -- LIMSv3_ALPHADATA_003 --> LIMSv3_ALPHADATA_004
    -- Update: 3.0.2-foxtrot
    IF EXISTS(SELECT 1 FROM dbSettings WHERE dbSetting =  'dbCurrentDataVersion' AND `value` = 'LIMSv3_ALPHADATA_003') THEN


       -- Seed Data
       INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'UPDATING Seed Data Version..... ');

       INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'Updating validValues ');

       -- Valid Values
       INSERT IGNORE INTO `validValues`(`setName`, `displayValue`, `value`, `displayOrder`, `eventId`, `systemManaged`)
       VALUES
       ('inventoryUsageType', 'Run Control', 'Run Control', 1, 0, b'0'),
       ('inventoryUsageType', 'Batch Control', 'Batch Control', 2, 0, b'0');


       INSERT INTO `sequences`(`sequenceName`, `lastNumber`, `prefixSQL`, `prefixValue`)
       VALUES
       ('controlRunId', 0, NULL, 'CONTROLRUN'),
       ('controlTubeId', 0, NULL, 'CONTROL'),
       ('preparedContainerId', 0, NULL, 'PC');

       -- END Seed data

       -- Version upgrade
       INSERT INTO dbVersionHistory
       (
          version,
          versionDate
       ) VALUES (
          'LIMSv3_ALPHADATA_004',
           NOW()
       );
       UPDATE dbSettings
       SET `value` = 'LIMSv3_ALPHADATA_004'
       WHERE `dbSetting` = 'dbCurrentDataVersion';

       INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'UPDATING Seed Data Version..... Success');
    ELSE
        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'SKIPPING VERSION LIMSv3_ALPHADATA_003 UPDATES');
    END IF;

    -- LIMSv3_ALPHADATA_004 --> LIMSv3_ALPHADATA_005
    -- Update: 3.0.0-Hotel
    IF EXISTS(SELECT 1 FROM dbSettings WHERE dbSetting =  'dbCurrentDataVersion' AND `value` = 'LIMSv3_ALPHADATA_004') THEN


       -- Seed Data
       INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'UPDATING Seed Data Version..... ');

       INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'Updating validValues ');

       -- Valid Values
       INSERT INTO `validValues` (`setName`, `displayValue`, `value`, `displayOrder`, `eventId`, `systemManaged`)
       VALUES
	   ('instrumentTimeUnits', 'Hour(s)', 'hr', 2, 0, 0),
	   ('instrumentTimeUnits', 'Minute(s)', 'min', 1, 0, 0),
	   ('pageHeaderFooter', 'Header', 'Header', 1, 0,  b'1'),
	   ('pageHeaderFooter', 'Footer', 'Footer', 1, 0,  b'1'),
	   ('pageHeaderFooter', 'Both', 'Both', 3, 0,  b'1'),
	   ('pageHeaderFooter', 'None', 'None', 4, 0,  b'1');


       -- END Seed data

       -- Version upgrade
       INSERT INTO dbVersionHistory
       (
          version,
          versionDate
       ) VALUES (
          'LIMSv3_ALPHADATA_005',
           NOW()
       );
       UPDATE dbSettings
       SET `value` = 'LIMSv3_ALPHADATA_005'
       WHERE `dbSetting` = 'dbCurrentDataVersion';

       INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'UPDATING Seed Data Version..... Success');
    ELSE
        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'SKIPPING VERSION LIMSv3_ALPHADATA_004 UPDATES');
    END IF;

    -- LIMSv3_ALPHADATA_005 --> LIMSv3_ALPHADATA_006
    -- Update: 3.0.1-Hotel
    IF EXISTS(SELECT 1 FROM dbSettings WHERE dbSetting =  'dbCurrentDataVersion' AND `value` = 'LIMSv3_ALPHADATA_005') THEN


       -- Seed Data
       INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'UPDATING Seed Data Version..... ');

       INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'Adding reqHoldDescriptions ');

       INSERT INTO `reqHoldDescriptions`(`hold`, `controllable`) VALUES
       ('QNS', ''),
       ('Rejected', ''),
       ('Recollect', ''),
       ('Billing', '');


       -- Valid Values
       INSERT INTO `validValues` (`setName`, `displayValue`, `value`, `displayOrder`, `eventId`, `systemManaged`)
       VALUES
       ('destinationType', 'New', 'New', 1, 0, b'0'),
       ('destinationType', 'Existing', 'Existing', 2, 0, b'0');

       INSERT INTO `sequences`(`sequenceName`, `lastNumber`, `prefixSQL`, `prefixValue`)
       VALUES
       ('reportId', 0, NULL, 'RPT');


       -- END Seed data

       -- Version upgrade
       INSERT INTO dbVersionHistory
       (
          version,
          versionDate
       ) VALUES (
          'LIMSv3_ALPHADATA_006',
           NOW()
       );
       UPDATE dbSettings
       SET `value` = 'LIMSv3_ALPHADATA_006'
       WHERE `dbSetting` = 'dbCurrentDataVersion';

       INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'UPDATING Seed Data Version..... Success');
    ELSE
        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'SKIPPING VERSION LIMSv3_ALPHADATA_005 UPDATES');
    END IF;

    -- LIMSv3_ALPHADATA_006 --> LIMSv3_ALPHADATA_007
    IF EXISTS(SELECT 1 FROM dbSettings WHERE dbSetting =  'dbCurrentDataVersion' AND `value` = 'LIMSv3_ALPHADATA_006') THEN


       -- Seed Data
       INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'UPDATING Seed Data Version..... ');

       INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'Updating SetName');


       UPDATE validValues
       SET `setName` = 'ethnicity'
       WHERE `setName` = 'Ethinicity';

       INSERT INTO `validValues` (`setName`, `displayValue`, `value`, `displayOrder`, `eventId`, `systemManaged`)
       VALUES
       ('excelColumns', 'A', '1', '1', '0', b'1'),
       ('excelColumns', 'B', '2', '2', '0', b'1'),
       ('excelColumns', 'C', '3', '3', '0', b'1'),
       ('excelColumns', 'D', '4', '4', '0', b'1'),
       ('excelColumns', 'E', '5', '5', '0', b'1'),
       ('excelColumns', 'F', '6', '6', '0', b'1'),
       ('excelColumns', 'G', '7', '7', '0', b'1'),
       ('excelColumns', 'H', '8', '8', '0', b'1'),
       ('excelColumns', 'I', '9', '9', '0', b'1'),
       ('excelColumns', 'J', '10', '10', '0', b'1'),
       ('excelColumns', 'K', '11', '11', '0', b'1'),
       ('excelColumns', 'L', '12', '12', '0', b'1'),
       ('excelColumns', 'M', '13', '13', '0', b'1'),
       ('excelColumns', 'N', '14', '14', '0', b'1'),
       ('excelColumns', 'O', '15', '15', '0', b'1'),
       ('excelColumns', 'P', '16', '16', '0', b'1'),
       ('excelColumns', 'Q', '17', '17', '0', b'1'),
       ('excelColumns', 'R', '18', '18', '0', b'1'),
       ('excelColumns', 'S', '19', '19', '0', b'1'),
       ('excelColumns', 'T', '20', '20', '0', b'1'),
       ('excelColumns', 'U', '21', '21', '0', b'1'),
       ('excelColumns', 'V', '22', '22', '0', b'1'),
       ('excelColumns', 'W', '23', '23', '0', b'1'),
       ('excelColumns', 'X', '24', '24', '0', b'1'),
       ('excelColumns', 'Y', '25', '25', '0', b'1'),
       ('excelColumns', 'Z', '26', '26', '0', b'1'),
       ('excelColumns', 'AA', '27', '27', '0', b'1'),
       ('excelColumns', 'AB', '28', '28', '0', b'1'),
       ('excelColumns', 'AC', '29', '29', '0', b'1'),
       ('excelColumns', 'AD', '30', '30', '0', b'1'),
       ('excelColumns', 'AE', '31', '31', '0', b'1'),
       ('excelColumns', 'AF', '32', '32', '0', b'1'),
       ('excelColumns', 'AG', '33', '33', '0', b'1'),
       ('excelColumns', 'AH', '34', '34', '0', b'1'),
       ('excelColumns', 'AI', '35', '35', '0', b'1'),
       ('excelColumns', 'AJ', '36', '36', '0', b'1'),
       ('excelColumns', 'AK', '37', '37', '0', b'1'),
       ('excelColumns', 'AL', '38', '38', '0', b'1'),
       ('excelColumns', 'AM', '39', '39', '0', b'1'),
       ('excelColumns', 'AN', '40', '40', '0', b'1'),
       ('excelColumns', 'AO', '41', '41', '0', b'1'),
       ('excelColumns', 'AP', '42', '42', '0', b'1'),
       ('excelColumns', 'AQ', '43', '43', '0', b'1'),
       ('excelColumns', 'AR', '44', '44', '0', b'1'),
       ('excelColumns', 'AS', '45', '45', '0', b'1'),
       ('excelColumns', 'AT', '46', '46', '0', b'1'),
       ('excelColumns', 'AU', '47', '47', '0', b'1'),
       ('excelColumns', 'AV', '48', '48', '0', b'1'),
       ('excelColumns', 'AW', '49', '49', '0', b'1'),
       ('excelColumns', 'AX', '50', '50', '0', b'1'),
       ('excelColumns', 'AY', '51', '51', '0', b'1'),
       ('excelColumns', 'AZ', '52', '52', '0', b'1');



        -- Valid Values
        INSERT IGNORE INTO `validValues`(`setName`, `displayValue`, `value`, `displayOrder`, `eventId`, `systemManaged`)
        VALUES
        ('passfail', 'Exception Handling', 'exceptionHandling', 3, 0, b'1'),

        ('exceptionHandling', 'Next Step', 'Next Step', 1, 0, b'1'),
        ('exceptionHandling', 'End Processing Send to Storage', 'End Processing Send to Storage', 2, 0, b'1'),
        ('exceptionHandling', 'End Processing Discard', 'End Processing Discard', 3, 0, b'1'),
        ('exceptionHandling', 'Send to contact customer', 'Contact Customer', 4, 0, b'1'),

        ('exceptionHandlingGroup', 'Next Step', 'Next Step', 1, 0, b'1'),
        ('exceptionHandlingGroup', 'End Processing Send to Storage', 'End Processing Send to Storage', 2, 0, b'1'),
        ('exceptionHandlingGroup', 'End Processing Discard', 'End Processing Discard', 3, 0, b'1'),
        ('exceptionHandlingParentGroup', 'Next Step', 'Next Step', 1, 0, b'1');

        INSERT INTO `containers`(`containerId`, `containerType`, `accountId`, `manufacturerBarcode`, `expirationDate`, `priority`, `siteId`, `eventId`, `userId`, `projectId`, `experimentId`)
        VALUES ('htmlTemplate', 'htmlReportFile', NULL, NULL, NULL, 6, NULL, 0, NULL, NULL, NULL),
        ('jsTemplate', 'jsReportFile', NULL, NULL, NULL, 6, NULL, 0, NULL, NULL, NULL),
        ('cssTemplate', 'cssReportFile', NULL, NULL, NULL, 6, NULL, 0, NULL, NULL, NULL);
       -- END Seed data

        INSERT IGNORE INTO `validValues` (`setName`, `displayValue`, `value`, `displayOrder`, `eventId`, `systemManaged`)
        VALUES
        ('incubationTime', '0', '0', 1, 0, b'1'),
        ('incubationTime', '12', '12', 2, 0, b'1'),
        ('incubationTime', '36', '36', 3, 0, b'1'),
        ('incubationTime', '60', '60', 4, 0, b'1'),
        ('incubationTime', '82', '82', 5, 0, b'1'),
        ('incubationTime', '96', '96', 6, 0, b'1'),
        ('cultureType', 'General Purpose Media', 'General Purpose Media', 0, 0, b'0'),
        ('cultureType', 'Selective Media', 'Selective Media', 0, 0, b'0'),
        ('cultureType', 'Enrichment Culture Media', 'Enrichment Culture Media', 0, 0, b'0'),
        ('cultureType', 'Differential Media', 'Differential Media', 0, 0, b'0'),
        ('storageLocation', 'Storage Box', 'Storage Box', 6, 0, 0),
        ('storageLocation', 'Storage Rack', 'Storage Rack', 5, 0, 0),
        ('storageLocation', 'Shelf', 'Shelf', 4, 0, 0),
        ('storageLocation', 'Fridge', 'Fridge', 3, 0, 0),
        ('storageLocation', 'Freezer', 'Freezer', 2, 0, 0),
        ('storageLocation', 'Other', 'Other', 7, 0, 0),
        ('storageLocation', 'Room', 'Room', 1, 0, 0),
        ('storageLocation', 'Laboratory', 'Laboratory', 0, 0, 0),
        ('removeReasons', 'Sample Processing', 'Sample Processing', 1, 0, b'1'),
        ('removeReasons', 'Discard', 'Discard', 2, 0, b'1'),
        ('removeReasons', 'Dropped', 'Dropped', 3, 0, b'1'),
        ('removeReasons', 'Expire', 'Expire', 4, 0, b'1'),
        ('removeReasons', 'Compromised', 'Compromised', 5, 0, b'1');

        INSERT INTO `storageContainerInfo` (`storageContainerId`, `type`, `model`, `description`, `eventId`)
        VALUES
        ('Archive System', 'Archive System', 'Mitogen', 'Archive System', 0);

        INSERT INTO `storageDisplayRules` (`storageType`, `sizeCategory`, `color`, `eventId`)
        VALUES
            ('Archive System', 1000, '#97d700', 1),
            ('Laboratory', 500, '#7B7B7B', 1),
            ('Room', 250, '#97d700', 1),
            ('Freezer', 100, '#7B7B7B', 1),
            ('Fridge', 100, '#97d700', 1),
            ('Cabinet', 100, '#7B7B7B', 1),
            ('Drawer', 50, '#97d700', 1),
            ('Shelf', 50, '#7B7B7B', 1),
            ('Rack', 25, '#97d700', 1),
            ('Bin', 25, '#7B7B7B', 1),
            ('Storage Box', 15, '#97d700', 1),
            ('SpecimenId', 5, '#7B7B7B', 1),
            ('aliquotId', 5, '#97d700', 1),
            ('Storage Rack', 25, '#7B7B7B', 1);

        INSERT INTO `analysisMethods` (`methodName`, `methodType`, `methodDescription`, `analysisStepName`, `eventId`)
        VALUES
            ('NormalizationOptions', 'normalizationData', 'Normalization data for default normalization columns', NULL, 0);

        SET @analysisMethodsId = LAST_INSERT_ID();

        INSERT INTO `analysisMethodVersions` (`analysisMethodsId`, `version`, `active`, `eventId`)
        VALUES
            (@analysisMethodsId, 0.00, 1, 0);

        SET @analysisVersionId = LAST_INSERT_ID();

        INSERT INTO `analysisDataDefinition` (`analysisMethodVersionsId`, `definerType`, `sequence`, `value`, `dataType`, `sigFig`, `report`, `eventId`, `resultCode`, `loadDataAnalysisDataDefinitionId`, `formInputSettingsId`)
        VALUES
            (@analysisVersionId, 'data', 0, 'Calculated Final Concentration', 'decimal', NULL, NULL, 0, NULL, NULL, NULL),
            (@analysisVersionId, 'data', 0, 'Calculated Sample Volume', 'decimal', NULL, NULL, 0, NULL, NULL, NULL),
            (@analysisVersionId, 'data', 0, 'Calculated Diluent Volume', 'decimal', NULL, NULL, 0, NULL, NULL, NULL),
            (@analysisVersionId, 'data', 0, 'Actual Sample Volume', 'decimal', NULL, NULL, 0, NULL, NULL, NULL),
            (@analysisVersionId, 'data', 0, 'Actual Final Concentration', 'decimal', NULL, NULL, 0, NULL, NULL, NULL),
            (@analysisVersionId, 'data', 0, 'Actual Diluent Volume', 'decimal', NULL, NULL, 0, NULL, NULL, NULL),
            (@analysisVersionId, 'data', 0, 'Target Concentration', 'decimal', NULL, NULL, 0, NULL, NULL, NULL),
            (@analysisVersionId, 'data', 0, 'Target Volume', 'decimal', NULL, NULL, 0, NULL, NULL, NULL);

       -- Version upgrade
       INSERT INTO dbVersionHistory
       (
          version,
          versionDate
       ) VALUES (
          'LIMSv3_ALPHADATA_007',
           NOW()
       );
       UPDATE dbSettings
       SET `value` = 'LIMSv3_ALPHADATA_007'
       WHERE `dbSetting` = 'dbCurrentDataVersion';

       INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'UPDATING Seed Data Version..... Success');
    ELSE
        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'SKIPPING VERSION LIMSv3_ALPHADATA_006 UPDATES');
    END IF;

    -- LIMSv3_ALPHADATA_007 --> LIMSv3_ALPHADATA_008
    IF EXISTS(SELECT 1 FROM dbSettings WHERE dbSetting =  'dbCurrentDataVersion' AND `value` = 'LIMSv3_ALPHADATA_007') THEN




       -- Seed Data
       INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'UPDATING Seed Data Version..... ');

        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'Adding formConfigurableParts data');

        -- ConfigParts
        INSERT INTO `formConfigurableParts`(`formType`, `section`, `subSection`, `inputType`, `inputName`, `configSettingValue`, `required`, `screenLabel`, `placeholder`, `defaultValue`, `order`, `eventId`) VALUES
        -- ORDER INFO
        ('Accessioning', 'orderInformation', 'orderInformation', 'text', 'externalOrderId', NULL, b'0', b'1', b'1', b'0', '1-0-11', 0),
        ('Accessioning', 'orderInformation', 'orderInformation', 'text', 'encounterNumber', NULL, b'0', b'1', b'1', b'0', '1-0-12', 0),
        ('Accessioning', 'specimenInfo', 'specimenEntry', 'column_setName', 'containerType', NULL, b'0', b'1', b'0', b'1', '5-1-7', 0),
        ('Accessioning', 'specimenInfo', 'specimenEntry', 'column_setName', 'specimenSource', NULL, b'0', b'1', b'0', b'1', '5-1-8', 0),
        ('Receiving', 'specimenInfo', 'receivingInfo', 'column_time', 'receivedTime', NULL, b'1', b'1', b'0', b'0', '11-1-9', 0);

        INSERT INTO `formInputSettings`(`formDefinitionId`, `formConfigurablePartsId`, `showField`, `required`, `readonly`, `screenLabel`, `placeHolder`, `defaultValue`, `eventId`)
        SELECT 6, id, 'false', 'false', 'false', 'encounterNumber', '', '', 0 FROM formConfigurableParts WHERE formType = 'Accessioning' AND section = 'orderInformation' AND subSection = 'orderInformation' AND inputName = 'encounterNumber'
        UNION
        SELECT 7, id, 'false', 'false', 'false', 'encounterNumber', '', '', 0 FROM formConfigurableParts WHERE formType = 'Accessioning' AND section = 'orderInformation' AND subSection = 'orderInformation' AND inputName = 'encounterNumber'
        UNION
        SELECT 8, id, 'false', 'false', 'false', 'encounterNumber', '', '', 0 FROM formConfigurableParts WHERE formType = 'Accessioning' AND section = 'orderInformation' AND subSection = 'orderInformation' AND inputName = 'encounterNumber'
        UNION
        SELECT 10, id, 'false', 'false', 'false', 'encounterNumber', '', '', 0 FROM formConfigurableParts WHERE formType = 'Accessioning' AND section = 'orderInformation' AND subSection = 'orderInformation' AND inputName = 'encounterNumber';

        INSERT INTO `formInputSettings`(`formDefinitionId`, `formConfigurablePartsId`, `showField`, `required`, `readonly`, `screenLabel`, `placeHolder`, `defaultValue`, `eventId`)
        SELECT  6, id, 'false', 'false', 'false', 'specimenSource', '', 'Specimen Source', 0 FROM formConfigurableParts WHERE formType = 'Accessioning' AND section = 'specimenInfo' AND subSection = 'specimenEntry' AND inputName = 'specimenSource'
        UNION
        SELECT  7, id, 'false', 'false', 'false', 'specimenSource', '', 'Specimen Source', 0 FROM formConfigurableParts WHERE formType = 'Accessioning' AND section = 'specimenInfo' AND subSection = 'specimenEntry' AND inputName = 'specimenSource'
        UNION
        SELECT  8, id, 'true', 'false', 'false', 'specimenSource', '', 'Specimen Source', 0 FROM formConfigurableParts WHERE formType = 'Accessioning' AND section = 'specimenInfo' AND subSection = 'specimenEntry' AND inputName = 'specimenSource'
        UNION
        SELECT  10, id, 'false', 'false', 'true', 'specimenSource', '', 'Specimen Source', 0 FROM formConfigurableParts WHERE formType = 'Accessioning' AND section = 'specimenInfo' AND subSection = 'specimenEntry' AND inputName = 'specimenSource';

        INSERT INTO `formInputSettings`(`formDefinitionId`, `formConfigurablePartsId`, `showField`, `required`, `readonly`, `screenLabel`, `placeHolder`, `defaultValue`, `eventId`)
        SELECT 6, id, 'false', 'false', 'false', 'externalOrderId', '', '', 0 FROM formConfigurableParts WHERE formType = 'Accessioning' AND section = 'orderInformation' AND subSection = 'orderInformation' AND inputName = 'externalOrderId'
        UNION
        SELECT 7, id, 'false', 'false', 'false', 'externalOrderId', '', '', 0 FROM formConfigurableParts WHERE formType = 'Accessioning' AND section = 'orderInformation' AND subSection = 'orderInformation' AND inputName = 'externalOrderId'
        UNION
        SELECT 8, id, 'false', 'false', 'false', 'externalOrderId', '', '', 0 FROM formConfigurableParts WHERE formType = 'Accessioning' AND section = 'orderInformation' AND subSection = 'orderInformation' AND inputName = 'externalOrderId'
        UNION
        SELECT 10, id, 'false', 'false', 'false', 'externalOrderId', '', '', 0 FROM formConfigurableParts WHERE formType = 'Accessioning' AND section = 'orderInformation' AND subSection = 'orderInformation' AND inputName = 'externalOrderId';

        INSERT INTO `formInputSettings`(`formDefinitionId`, `formConfigurablePartsId`, `showField`, `required`, `readonly`, `screenLabel`, `placeHolder`, `defaultValue`, `eventId`)
        SELECT  6, id, 'false', 'false', 'false', 'containerType', '', 'Sample Container Category', 0 FROM formConfigurableParts WHERE formType = 'Accessioning' AND section = 'specimenInfo' AND subSection = 'specimenEntry' AND inputName = 'containerType'
        UNION
        SELECT  7, id, 'false', 'false', 'false', 'containerType', '', 'Sample Container Category', 0 FROM formConfigurableParts WHERE formType = 'Accessioning' AND section = 'specimenInfo' AND subSection = 'specimenEntry' AND inputName = 'containerType'
        UNION
        SELECT  8, id, 'true', 'false', 'false', 'containerType', '', 'Sample Container Category', 0 FROM formConfigurableParts WHERE formType = 'Accessioning' AND section = 'specimenInfo' AND subSection = 'specimenEntry' AND inputName = 'containerType'
        UNION
        SELECT  10, id, 'false', 'false', 'true', 'containerType', '', 'Sample Container Category', 0 FROM formConfigurableParts WHERE formType = 'Accessioning' AND section = 'specimenInfo' AND subSection = 'specimenEntry' AND inputName = 'containerType';


        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'Adding validValues data');

        -- Valid Values
        INSERT IGNORE INTO `validValues`(`setName`, `displayValue`, `value`, `displayOrder`, `eventId`, `systemManaged`)
        VALUES
        ('Sample Container Category', 'Urine Cup', 'Urine Cup', 1, 0, b'0'),
        ('Sample Container Category', 'SST', 'SST', 2, 0, b'0'),
        ('Sample Container Category', 'Red Top', 'Red Top', 3, 0, b'0'),
        ('Sample Container Category', 'Blue Top', 'Blue Top', 4, 0, b'0'),
        ('Specimen Source', 'Left', 'Left', 1, 0, b'0'),
        ('Specimen Source', 'Right', 'Right', 2, 0, b'0');


       -- Version upgrade
       INSERT INTO dbVersionHistory
       (
          version,
          versionDate
       ) VALUES (
          'LIMSv3_ALPHADATA_008',
           NOW()
       );
       UPDATE dbSettings
       SET `value` = 'LIMSv3_ALPHADATA_008'
       WHERE `dbSetting` = 'dbCurrentDataVersion';

       INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'UPDATING Seed Data Version..... Success');
    ELSE
        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'SKIPPING VERSION LIMSv3_ALPHADATA_007 UPDATES');
    END IF;

        -- LIMSv3_ALPHADATA_008 --> LIMSv3_ALPHADATA_009
    IF EXISTS(SELECT 1 FROM dbSettings WHERE dbSetting =  'dbCurrentDataVersion' AND `value` = 'LIMSv3_ALPHADATA_008') THEN


        DELETE fis FROM `formInputSettings` fis INNER JOIN `formConfigurableParts` fcp ON fcp.id = fis.formConfigurablePartsId
        WHERE
        (fcp.formType = 'Accessioning' AND fcp.section = 'orderInformation' AND fcp.subSection = 'orderInformation' AND fcp.inputName = 'externalOrderId') OR
        (fcp.formType = 'Accessioning' AND fcp.section = 'orderInformation' AND fcp.subSection = 'orderInformation' AND fcp.inputName = 'encounterNumber') OR
        (fcp.formType = 'Accessioning' AND fcp.section = 'specimenInfo' AND fcp.subSection = 'specimenEntry' AND fcp.inputName = 'containerType') OR
        (fcp.formType = 'Accessioning' AND fcp.section = 'specimenInfo' AND fcp.subSection = 'specimenEntry' AND fcp.inputName = 'specimenSource') OR
        (fcp.formType = 'Receiving' AND fcp.section = 'specimenInfo' AND fcp.subSection = 'receivingInfo' AND fcp.inputName = 'receivedTime');

        INSERT INTO `formInputSettings`(`formDefinitionId`, `formConfigurablePartsId`, `showField`, `required`, `readonly`, `screenLabel`, `placeHolder`, `defaultValue`, `eventId`)
        SELECT fd.id, fcp.id, 'false', 'false', 'false', fcp.inputName, '', '', 0 FROM formConfigurableParts fcp join formDefinition fd WHERE fcp.formType = 'Accessioning' AND fcp.section = 'orderInformation' AND fcp.subSection = 'orderInformation' AND fcp.inputName = 'externalOrderId' AND (fd.instance = 'New' OR fd.instance = 'Edit' OR fd.instance = 'QC' OR fd.instance = 'View')
        UNION
        SELECT fd.id, fcp.id, 'false', 'false', 'false', fcp.inputName, '', '', 0 FROM formConfigurableParts fcp join formDefinition fd WHERE fcp.formType = 'Accessioning' AND fcp.section = 'orderInformation' AND fcp.subSection = 'orderInformation' AND fcp.inputName = 'encounterNumber' AND (fd.instance = 'New' OR fd.instance = 'Edit' OR fd.instance = 'QC' OR fd.instance = 'View')
        UNION
        SELECT fd.id, fcp.id, 'false', 'false', 'false', fcp.inputName, '', '', 0 FROM formConfigurableParts fcp join formDefinition fd WHERE fcp.formType = 'Accessioning' AND fcp.section = 'specimenInfo' AND fcp.subSection = 'specimenEntry' AND fcp.inputName = 'containerType' AND (fd.instance = 'New' OR fd.instance = 'Edit' OR fd.instance = 'QC' OR fd.instance = 'View')
        UNION
        SELECT fd.id, fcp.id, 'false', 'false', 'false', fcp.inputName, '', '', 0 FROM formConfigurableParts fcp join formDefinition fd WHERE fcp.formType = 'Accessioning' AND fcp.section = 'specimenInfo' AND fcp.subSection = 'specimenEntry' AND fcp.inputName = 'specimenSource' AND (fd.instance = 'New' OR fd.instance = 'Edit' OR fd.instance = 'QC' OR fd.instance = 'View')
        UNION
        SELECT fd.id, fcp.id, 'false', 'false', 'false', fcp.inputName, '', '', 0 FROM formConfigurableParts fcp join formDefinition fd WHERE fcp.formType = 'Receiving' AND fcp.section = 'specimenInfo' AND fcp.subSection = 'receivingInfo' AND fcp.inputName = 'receivedTime' AND (fd.instance = 'Receiving');



        -- Version upgrade
       INSERT INTO dbVersionHistory
       (
          version,
          versionDate
       ) VALUES (
          'LIMSv3_ALPHADATA_009',
           NOW()
       );
       UPDATE dbSettings
       SET `value` = 'LIMSv3_ALPHADATA_009'
       WHERE `dbSetting` = 'dbCurrentDataVersion';

       INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'UPDATING Seed Data Version..... Success');
    ELSE
        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'SKIPPING VERSION LIMSv3_ALPHADATA_008 UPDATES');
    END IF;


        -- LIMSv3_ALPHADATA_009 --> LIMSv3_ALPHADATA_010
    IF EXISTS(SELECT 1 FROM dbSettings WHERE dbSetting =  'dbCurrentDataVersion' AND `value` = 'LIMSv3_ALPHADATA_009') THEN


       INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'Adding DIUser to userInfo');

       INSERT INTO `userInfo` (`userId`, `password`, `name`, `accessLevel`, `accountId`, `email`, `userProfile`, `phone`, `active`, `eventId`, `passwordUpdateEventId`, `failedLoginAttempts`) SELECT 'DIUser', 'Mg0GxHSb7VcQE3U8xVAlP4ZKhHg=', 'DI user', '12', 'MITOGEN', '', 'userProfile\n  webApps \n    webapp /uniflow\n      userStepGroups \n        stepGroup Print Server Configuration\n', '', 'true', '0', '0', '0' WHERE NOT EXISTS (SELECT userId FROM userInfo WHERE userId = 'DIUser');
        -- Version upgrade
       INSERT INTO dbVersionHistory
       (
          version,
          versionDate
       ) VALUES (
          'LIMSv3_ALPHADATA_010',
           NOW()
       );
       UPDATE dbSettings
       SET `value` = 'LIMSv3_ALPHADATA_010'
       WHERE `dbSetting` = 'dbCurrentDataVersion';

       INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'UPDATING Seed Data Version..... Success');
    ELSE
        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'SKIPPING VERSION LIMSv3_ALPHADATA_009 UPDATES');
    END IF;

        -- LIMSv3_ALPHADATA_010 --> LIMSv3_ALPHADATA_011
    IF EXISTS(SELECT 1 FROM dbSettings WHERE dbSetting =  'dbCurrentDataVersion' AND `value` = 'LIMSv3_ALPHADATA_010') THEN


       INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'Updating validValues');

       DELETE FROM `validValues` WHERE `setName` = 'analysisResults' AND `value` = 'rework';
       DELETE FROM `validValues` WHERE `setName` = 'analysisResults' AND `value` = 'cancel';
       UPDATE `validValues` SET `systemManaged` = b'1' WHERE `setName` = 'analysisResults' AND `value` = 'pass';

       -- Version upgrade
       INSERT INTO dbVersionHistory
       (
          version,
          versionDate
       ) VALUES (
          'LIMSv3_ALPHADATA_011',
           NOW()
       );
       UPDATE dbSettings
       SET `value` = 'LIMSv3_ALPHADATA_011'
       WHERE `dbSetting` = 'dbCurrentDataVersion';

       INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'UPDATING Seed Data Version..... Success');
    ELSE
        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'SKIPPING VERSION LIMSv3_ALPHADATA_010 UPDATES');
    END IF;


        -- LIMSv3_ALPHADATA_011 --> LIMSv3_ALPHADATA_012
    IF EXISTS(SELECT 1 FROM dbSettings WHERE dbSetting =  'dbCurrentDataVersion' AND `value` = 'LIMSv3_ALPHADATA_011') THEN


       INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'Updating analysisMethods');

       UPDATE `analysisMethods` SET `methodType` = 'Analysis' WHERE `methodType` = '' OR `methodType` IS NULL;

       -- Version upgrade
       INSERT INTO dbVersionHistory
       (
          version,
          versionDate
       ) VALUES (
          'LIMSv3_ALPHADATA_012',
           NOW()
       );
       UPDATE dbSettings
       SET `value` = 'LIMSv3_ALPHADATA_012'
       WHERE `dbSetting` = 'dbCurrentDataVersion';

       INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'UPDATING Seed Data Version..... Success');
    ELSE
        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'SKIPPING VERSION LIMSv3_ALPHADATA_011 UPDATES');
    END IF;


        -- LIMSv3_ALPHADATA_012 --> LIMSv3_ALPHADATA_013
    IF EXISTS(SELECT 1 FROM dbSettings WHERE dbSetting =  'dbCurrentDataVersion' AND `value` = 'LIMSv3_ALPHADATA_012') THEN


       INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'Updating validValues');

       INSERT INTO `validValues` (`setName`, `displayValue`, `value`, `displayOrder`, `eventId`, `systemManaged`)
       VALUES
       ('analysisUnits', 'g', 'g', 4, 0, 0),
       ('analysisUnits', 'L', 'L', 2, 0, 0),
       ('analysisUnits', 'mg', 'mg', 3, 0, 0),
       ('analysisUnits', 'mL', 'mL', 1, 0, 0),
       ('analysisUnits', 'uL', 'uL', 0, 0, 0);

       -- Version upgrade
       INSERT INTO dbVersionHistory
       (
          version,
          versionDate
       ) VALUES (
          'LIMSv3_ALPHADATA_013',
           NOW()
       );
       UPDATE dbSettings
       SET `value` = 'LIMSv3_ALPHADATA_013'
       WHERE `dbSetting` = 'dbCurrentDataVersion';

       INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'UPDATING Seed Data Version..... Success');
    ELSE
        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'SKIPPING VERSION LIMSv3_ALPHADATA_012 UPDATES');
    END IF;

    -- LIMSv3_ALPHADATA_013 --> LIMSv3.1_DATA_001
    IF EXISTS(SELECT 1 FROM dbSettings WHERE dbSetting =  'dbCurrentDataVersion' AND `value` = 'LIMSv3_ALPHADATA_013') THEN


       INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'Updating reportResultData');


        UPDATE reportResultData 
           SET varcharReviewResult = varcharResult , decimalReviewResult = decimalResult, dateTimeReviewResult =  dateTimeResult;

       -- Version upgrade
       INSERT INTO dbVersionHistory
       (
          version,
          versionDate
       ) VALUES (
          'LIMSv3.1_DATA_001',
           NOW()
       );
       UPDATE dbSettings
       SET `value` = 'LIMSv3.1_DATA_001'
       WHERE `dbSetting` = 'dbCurrentDataVersion';

       INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'UPDATING Seed Data Version..... Success');
    ELSE
        INSERT INTO tmpUpgradeResults (resultType, result)
        VALUES ('INFO', 'SKIPPING VERSION LIMSv3_ALPHADATA_013 UPDATES');
    END IF;
    
-- LIMSv3.1_DATA_001 --> LIMSv3.1_DATA_002
    IF EXISTS(SELECT 1 FROM dbSettings WHERE dbSetting =  'dbCurrentDataVersion' AND `value` = 'LIMSv3.1_DATA_001') THEN
    
       INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'VERSION LIMSv3.1_DATA_001 DETECTED');
    
       -- ADD SQL UPDATE --
       INSERT IGNORE INTO dbSettings (dbSetting, `value`) VALUES ('dbCurrentPlatformDataVersion', 'PlatformV6_ALPHADATA_001');
       -- END SQL UPDATE --
    
       INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'UPDATING LIMS db Version..... ');
    
       INSERT INTO dbVersionHistory
       (
           version,
           versionDate
       ) VALUES (
          'LIMSv3.1_DATA_002',
           NOW()
       );
    
       UPDATE dbSettings
       SET `value` = 'LIMSv3.1_DATA_002'
       WHERE `dbSetting` = 'dbCurrentDataVersion';
    
      INSERT INTO tmpUpgradeResults (resultType, result)
      VALUES ('INFO', 'UPDATING LIMS db Version..... Success');
    ELSE
      INSERT INTO tmpUpgradeResults (resultType, result)
      VALUES ('INFO', 'SKIPPING VERSION LIMSv3.1_DATA_001 UPDATES');
    END IF;
    
-- LIMSv3.1_DATA_002 --> LIMSv3.1_DATA_003
    IF EXISTS(SELECT 1 FROM dbSettings WHERE dbSetting =  'dbCurrentDataVersion' AND `value` = 'LIMSv3.1_DATA_002') THEN
    
       INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'VERSION LIMSv3.1_DATA_002 DETECTED');
    
       -- ADD SQL UPDATE --
    
        UPDATE formConfigurableParts
        SET inputType = 'column_setName'
        WHERE formType = 'Accessioning'
        AND section = 'specimenInfo'
        AND subsection = 'specimenEntry'
        AND inputName = 'specimenSource';
    
       -- END SQL UPDATE --
    
       INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'UPDATING LIMS DB Version..... ');
    
       INSERT INTO dbVersionHistory
       (
           version,
           versionDate
       ) VALUES (
          'LIMSv3.1_DATA_003',
           NOW()
       );
    
       UPDATE dbSettings
       SET `value` = 'LIMSv3.1_DATA_003'
       WHERE `dbSetting` = 'dbCurrentDataVersion';
    
      INSERT INTO tmpUpgradeResults (resultType, result)
      VALUES ('INFO', 'UPDATING LIMS DB Version..... Success');
    ELSE
      INSERT INTO tmpUpgradeResults (resultType, result)
      VALUES ('INFO', 'SKIPPING VERSION LIMSv3.1_DATA_002 UPDATES');
    END IF;
    
-- LIMSv3.1_DATA_003 --> LIMSv3.2_DATA_001
    IF EXISTS(SELECT 1 FROM dbSettings WHERE dbSetting =  'dbCurrentDataVersion' AND `value` = 'LIMSv3.1_DATA_003') THEN
    
       INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'VERSION LIMSv3.1_DATA_003 DETECTED');
    
       -- ADD SQL UPDATE --
		INSERT INTO `formConfigurableParts`(`formType`, `section`, `subSection`, `inputType`, `inputName`, `configSettingValue`, `required`, `screenLabel`, `placeholder`, `defaultValue`, `order`, `eventId`) VALUES
		('Accessioning', 'patientInformation', 'patientIdentification', 'text', 'familyId', NULL, b'0', b'1', b'0', b'0', '2-2-6', 0);

		UPDATE `formConfigurableParts` SET `order`='2-2-7' WHERE (`formType`='Accessioning' AND `section`='patientInformation' AND `subSection`='patientIdentification' AND `inputType`='text' AND `inputName`='govtId');
		UPDATE `formConfigurableParts` SET `order`='2-2-8' WHERE (`formType`='Accessioning' AND `section`='patientInformation' AND `subSection`='patientIdentification' AND `inputType`='setName' AND `inputName`='geneticGender');
		UPDATE `formConfigurableParts` SET `order`='2-2-9' WHERE (`formType`='Accessioning' AND `section`='patientInformation' AND `subSection`='patientIdentification' AND `inputType`='setName' AND `inputName`='genderId');
		UPDATE `formConfigurableParts` SET `order`='2-2-10' WHERE (`formType`='Accessioning' AND `section`='patientInformation' AND `subSection`='patientIdentification' AND `inputType`='setName' AND `inputName`='ethnicity');

		INSERT INTO `formInputSettings`(`formDefinitionId`, `formConfigurablePartsId`, `showField`, `required`, `readonly`, `screenLabel`, `placeHolder`, `defaultValue`, `eventId`)
		SELECT  6, id, 'true', 'false', 'false', 'Family ID', '', '', 0 FROM formConfigurableParts WHERE formType = 'Accessioning' AND section = 'patientInformation' AND subSection = 'patientIdentification' AND inputName = 'familyId'
		UNION
		SELECT  7, id, 'true', 'false', 'false', 'Family ID', '', '', 0 FROM formConfigurableParts WHERE formType = 'Accessioning' AND section = 'patientInformation' AND subSection = 'patientIdentification' AND inputName = 'familyId'
		UNION
		SELECT  8, id, 'true', 'false', 'false', 'Family ID', '', '', 0 FROM formConfigurableParts WHERE formType = 'Accessioning' AND section = 'patientInformation' AND subSection = 'patientIdentification' AND inputName = 'familyId'
		UNION
		SELECT  10, id, 'true', 'false', 'true', 'Family ID', '', '', 0 FROM formConfigurableParts WHERE formType = 'Accessioning' AND section = 'patientInformation' AND subSection = 'patientIdentification' AND inputName = 'familyId';

       -- END SQL UPDATE --
    
       INSERT INTO tmpUpgradeResults (resultType, result)
       VALUES ('INFO', 'UPDATING LIMS DB Version..... ');
    
       INSERT INTO dbVersionHistory
       (
           version,
           versionDate
       ) VALUES (
          'LIMSv3.2_DATA_001',
           NOW()
       );
    
       UPDATE dbSettings
       SET `value` = 'LIMSv3.2_DATA_001'
       WHERE `dbSetting` = 'dbCurrentDataVersion';
    
      INSERT INTO tmpUpgradeResults (resultType, result)
      VALUES ('INFO', 'UPDATING LIMS DB Version..... Success');
    ELSE
      INSERT INTO tmpUpgradeResults (resultType, result)
      VALUES ('INFO', 'SKIPPING VERSION LIMSv3.1_DATA_003 UPDATES');
    END IF;
    
    -- ADD UPDATES HERE --
END $$

DELIMITER ;
CALL sp_Update_Mitogen_SeedData();
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;

DROP PROCEDURE IF EXISTS sp_Update_Mitogen_SeedData;


