DROP PROCEDURE IF EXISTS `sp_dataload_createPatient`;

DELIMITER $$

CREATE PROCEDURE `sp_dataload_createPatient`(IN pSite VARCHAR(255), OUT pPatientId VARCHAR(50), OUT pMRN VARCHAR(50))
BEGIN

    DECLARE pSequence VARCHAR(50) DEFAULT 'patientId';
    DECLARE pName VARCHAR(50) DEFAULT 'patientId';

    DECLARE sequenceHold BIGINT(20);
    DECLARE pEventId BIGINT(20) UNSIGNED;
    DECLARE pPName VARCHAR(255);
    DECLARE pSqId VARCHAR(255);
    
    -- Get the next patient sequence number
    CALL `sp_getNextSequenceNumber`(pSequence, sequenceHold);
    
    -- Create an event associtate with the execution of this stored proc
    CALL `sp_createEventSimple`('sp_dataload_createPatient', 'admin', '', pEventId);
        
    -- Create internal patien identifier
    SET pPName = CONCAT('PA', sequenceHold);
    -- Generate a SQID for the patient
    SET pSqId = CONCAT('sqId', sequenceHold);
    -- Generate a MRN for the patient
    SET pMRN = CONCAT('mrn',sequenceHold);
        
    -- Create base patient record
    INSERT INTO 
        patients
        (
            patientID, 
            sqId, 
            firstName, 
            middleName, 
            lastName,
            status, 
            address1, 
            address2, 
            city, 
            state,
            postalCode, 
            country, 
            email, 
            phone1CountryCode, 
            phone1,
            phone2CountryCode, 
            phone2,  
            phone3CountryCode, 
            phone3, 
            dob,
            govtId, 
            geneticGender, 
            genderId, 
            ethnicity, 
            eventId
        ) VALUES (
          pPName, -- patientID
          pSqId, -- sqId
          'Some', -- firstName
          'Body', -- middleName
          sequenceHold, -- lastName
          'active', -- status
          '', -- address1 
          '', -- address2
          '', -- city
          '', -- state
          '', -- postalCode
          '', -- country
          '', -- email
          '', -- phone1CountryCode 
          '', -- phone1
          '', -- phone2CountryCode
          '', -- phone2
          '', -- phone3CountryCode
          '', -- phone3
          DATE(DATE_SUB(NOW(), INTERVAL (RAND() * 36525) DAY)), -- dob
          '', -- govtId
          '', -- geneticGender
          '', -- genderId
          '', -- ethnicity
          pEventId -- eventId
        );
        
        -- Create Patient Source Record
        INSERT INTO 
            patientSources
            (
                patientID, 
                sqId, 
                mrn, 
                master, 
                siteId,
                firstName, 
                middleName, 
                lastName, 
                status, 
                address1,
                address2, 
                city, 
                state, 
                postalCode, 
                country,
                email, 
                phone1CountryCode, 
                phone1, 
                phone2CountryCode, 
                phone2,
                phone3CountryCode, 
                phone3, 
                dob, 
                govtId, 
                geneticGender,
                genderId, 
                ethnicity, 
                eventId
            )
            SELECT
                p.patientID, 
                pSqId, 
                pMRN, 
                1, -- master 
                pSite,
                p.firstName, 
                p.middleName, 
                p.lastName, 
                p.status, 
                p.address1,
                p.address2, 
                p.city, 
                p.state, 
                p.postalCode, 
                p.country,
                p.email, 
                p.phone1CountryCode, 
                p.phone1, 
                p.phone2CountryCode, 
                p.phone2,
                p.phone3CountryCode, 
                p.phone3, 
                p.dob, 
                p.govtId, 
                p.geneticGender,
                p.genderId, 
                p.ethnicity, 
                p.eventId
            FROM 
                patients p
            WHERE 
                p.patientID = pPName;
        -- Set return value
        SET pPatientId = pPName;
END$$

DELIMITER ;