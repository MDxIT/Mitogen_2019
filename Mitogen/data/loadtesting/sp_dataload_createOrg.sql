DROP PROCEDURE IF EXISTS `sp_dataload_createOrg`;

DELIMITER $$

CREATE PROCEDURE `sp_dataload_createOrg`(OUT pOrg VARCHAR(50))
BEGIN

    DECLARE pSequence VARCHAR(50) DEFAULT 'orgId';
    DECLARE pName VARCHAR(50);

    DECLARE sequenceHold BIGINT(20);
    DECLARE pEventId BIGINT(20) UNSIGNED;
    DECLARE pOrgName VARCHAR(255);
    
    -- GET NEXT ORGANIZATION SEQUENCE VALUE
    CALL `sp_getNextSequenceNumber`(pSequence, sequenceHold);

    -- CREATE EVENT RECORD
    CALL `sp_createEventSimple`('sp_dataload_createOrg', 'admin', '', pEventId);
        
    -- SET INTERNAL ORGANIZATION IDENTIFIER
    SET pName = CONCAT('ORG', sequenceHold);
    SET pOrgName = CONCAT('Organization0', sequenceHold);

    -- CREATE ORGANIZATION RECORD
    INSERT INTO organizations (orgId, name, eventId)
    VALUES (pName,pOrgName ,pEventId);
    
    -- SET RETURN VALUE
    SET pOrg = pName;
END$$

DELIMITER ;