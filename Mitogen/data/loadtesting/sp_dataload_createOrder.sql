DROP PROCEDURE IF EXISTS `sp_dataload_createOrder`;

DELIMITER $$

CREATE PROCEDURE `sp_dataload_createOrder`(IN pWorkflow VARCHAR(255), OUT pOrderId VARCHAR(50))
BEGIN

    DECLARE pSequenceOrder VARCHAR(50) DEFAULT 'requestId';

    DECLARE sequenceHoldOrder BIGINT(20);
    DECLARE pEventId BIGINT(20) UNSIGNED;
    DECLARE pPName VARCHAR(255);
    DECLARE pPhyId VARCHAR(255);
    DECLARE pSiteId VARCHAR(255);
    DECLARE pPatientId VARCHAR(255);
    
    -- GET NEXT ORDER SEQUENCE
    CALL `sp_getNextSequenceNumber`(pSequenceOrder, sequenceHoldOrder);

    -- CREATE EVENT RECORD    
    CALL `sp_createEventSimple`('sp_dataload_createOrder', 'admin', '', pEventId);
        
    -- CREATE INTERNAL ORDER IDENTIFIER
    SET pPName = CONCAT('R', sequenceHoldOrder);
        
    -- GRAB ID OF A RANDOM PHYSICIAN    
    SELECT id INTO @phyRecord FROM physicianSites ORDER BY RAND() LIMIT 1;
        
    -- GET PHYSICIAN ID AND SITE
    SELECT physicianId INTO pPhyId FROM physicianSites WHERE id = @phyRecord;
    SELECT siteId INTO pSiteId FROM physicianSites WHERE id = @phyRecord;
    
    -- CREATE CONTAINER RECORD OF THE ORDER
    INSERT INTO containers
    (
      containerId,
      containerType,
      eventId
    )
    VALUES
    (
      pPName,
      'requestId',
      pEventId
    );

    -- CREATE CONTAINER HISTORY FOR ORDER CONTAINER
    INSERT INTO containerHistory
    (
      containerId,
      eventId
    )
    VALUES
    (
      pPName,
      pEventId
    );

    -- CREATE BASE ORDER RECORD

        INSERT INTO 
            requestForms
            (
                requestId,
                physicianId,
                physicianSiteId,
                priority,
                receivedDate,
                locationId,
                departmentId,
                eventId,
                externalRequestId,
                externalSystem,
                type,
                consent,
                clinicalTrial,
                workersComp,
                patientSignature,
                physicianSignature
            ) VALUES (
                pPName, -- requestId
                pPhyId, -- physicianId
                pSiteId, -- physicianSiteId
                0, -- priority
                NOW(), -- receivedDate
                null, -- locationId
                null, -- departmentId
                pEventId, -- eventId
                '', -- externalRequestId
                '', -- externalSystem
                pWorkflow, -- type
                0, -- consent
                0, -- clinicalTrial
                0, -- workersComp
                0, -- patientSignature
                0 -- physicianSignature
            );
        
        -- CREATE ASSOCIATED PATIENT
        CALL sp_dataload_createPatient(pSiteId, @MyPA, @MyMRN); 

        -- ASSOCIATE PATIENT WITH ORDER
        UPDATE 
            requestForms
        SET 
            patientId = @MyPA,
            mrn = @MyMRN
        WHERE 
            requestId = pPName;

        DELETE FROM patientEthnicities
        WHERE patientId = @MyPA;

        -- ASSOCIATE RANDOM PANEL WITH ORDER
        INSERT IGNORE INTO 
            reqPanels 
            (
                requestId, 
                panelCode, 
                eventId
            )
            (
                SELECT 
                    pPName, 
                    panelCode, 
                    pEventId 
                FROM 
                    panels 
                WHERE 
                    type = pWorkflow 
                ORDER BY 
                    RAND() 
                LIMIT 
                    1
            );
    
        -- CREATE SPECIMEN FOR ORDER
        INSERT INTO 
            requestSpecimens 
            (
                requestId,
                patientId,
                expectedBarcode,
                externalIdentifier,
                specimenType,
                specimenSource,
                collectionDate,
                collectionTime,
                specimenId,
                receivedDate,
                specimenQuantity,
                specimenQuantityUnits,
                specimenCondition,
                status,
                eventId
            ) VALUES (
                pPName, -- requestId
                @MyPA, -- patientId
                '', -- expectedBarcode
                '', -- externalIdentifier
                'Buccal Swab', -- specimenType
                'self', -- specimenSource
                NULL, -- collectionDate
                NULL, -- collectionTime
                NULL, -- specimenId
                NULL, -- receivedDate
                NULL, -- specimenQuantity,
                NULL, -- specimenQuantityUnits,
                '', -- specimenCondition
                'ORDER ENTERED',  -- status
                pEventId -- eventId
            );

        -- CLEAN UP QUEUES
        DELETE FROM queues
        WHERE step = 'Order Review'
        AND containerId = pPName;
            
        DELETE FROM queues
        WHERE eventId = pEventId;

        INSERT INTO queues (containerId, step, eventId)
        VALUES (pPName, 'Order Review', pEventId);
        
        -- SET RETURN VALUE
        SET pOrderId = pPName;
END$$

DELIMITER ;