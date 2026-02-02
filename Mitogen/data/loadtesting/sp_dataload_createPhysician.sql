DROP PROCEDURE IF EXISTS `sp_dataload_createPhysician`;

DELIMITER $$

CREATE PROCEDURE `sp_dataload_createPhysician`(OUT pPhyId VARCHAR(50))
BEGIN

    DECLARE pSequence VARCHAR(50) DEFAULT 'physicianId';
    DECLARE pName VARCHAR(50) DEFAULT 'physicianId';

	DECLARE sequenceHold BIGINT(20);
    DECLARE pEventId BIGINT(20) UNSIGNED;
    DECLARE pPName VARCHAR(255);
    DECLARE pSiteId VARCHAR(255);
    
    -- GET NEXT PHYSICIAN SEQUENCE VALUE
    CALL `sp_getNextSequenceNumber`(pSequence, sequenceHold);
       
    -- CREATE EVENT RECORD
    CALL `sp_createEventSimple`('sp_dataload_createPhysician', 'admin', '', pEventId);
        
    -- SET INTERNAL PHYSICIAN IDENTIFIER
    SET pPName = CONCAT('PH0', sequenceHold);
        
    -- SELECT A RANDOM SITE TO ASSOCIATE THE PHYSICIAN WITH
    SELECT siteId INTO pSiteId FROM organizationSites ORDER BY RAND() LIMIT 1;
        
    -- CREATE BASE PHYSICIAN RECORD
    INSERT INTO physicians (physicianId, first_name, middle_name, last_name, title, dob, gender, providerId, providerType, eventId)
    VALUES (pPName,'Doc','tor',sequenceHold,'MD', NULL,'Male',CONCAT('Prov', sequenceHold),'General Practitioner', pEventId);

    -- ASSOCIATE PHYSICIAN WITH A SITE
    INSERT INTO physicianSites (physicianId, siteId, email, phone1, phone2, fax1, fax2, active, eventId)
    VALUES (pPName, pSiteId, CONCAT(CONCAT(CONCAT(pPName, '@'), psiteId), '.com'), CONCAT(sequenceHold, CONCAT('-', CONCAT(sequenceHold, '-0003'))),'',CONCAT(sequenceHold, CONCAT('-', CONCAT(sequenceHold, '-0004'))),'', 1, pEventId);
    
    -- SET RETURN VALUE
    SET pPhyId = pPName;

END$$

DELIMITER ;