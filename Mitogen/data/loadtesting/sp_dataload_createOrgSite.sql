DROP PROCEDURE IF EXISTS `sp_dataload_createOrgSite`;

DELIMITER $$

CREATE PROCEDURE `sp_dataload_createOrgSite`(IN pOrgId VARCHAR(50), OUT pSite VARCHAR(50))
BEGIN

    DECLARE pSequence VARCHAR(50) DEFAULT 'siteId';
    DECLARE pName VARCHAR(50) DEFAULT 'siteId';
    
    DECLARE sequenceHold BIGINT(20);
    DECLARE pEventId BIGINT(20) UNSIGNED;
    DECLARE pSiteName VARCHAR(255);
    
    -- GET NEXT SITE SEQUENCE
    CALL `sp_getNextSequenceNumber`(pSequence, sequenceHold);

    -- CREATE EVENT RECORD
    CALL `sp_createEventSimple`('sp_dataload_createOrgSite', 'admin', '', pEventId);
    
    -- SET INTERNAL SITE IDENTIFIER        
    SET pSiteName = CONCAT('SITE', sequenceHold);

    -- CREATE SITE RECORD
    INSERT INTO organizationSites (siteId, orgId, name, address1, address2, city, state, postalcode, country, email, phone1, phone2, fax1, fax2, eventId)
    VALUES
    (pSiteName, pOrgId, CONCAT('Client', sequenceHold), CONCAT(sequenceHold, ' Main St'), '', 'Somewhere', 'AZ', '90210', 'Merica', CONCAT(CONCAT('person@client00', sequenceHold), '.com'), CONCAT(CONCAT(CONCAT(sequenceHold,'-'), sequenceHold), '-001'), '', CONCAT(CONCAT(CONCAT(sequenceHold,'-'), sequenceHold), '-002'), '', pEventId);

    -- SET RETURN VALUE
    SET pSite = pOrgId;

END$$

DELIMITER ;