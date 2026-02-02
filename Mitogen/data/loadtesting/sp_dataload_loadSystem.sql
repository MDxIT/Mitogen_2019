DROP PROCEDURE IF EXISTS `sp_dataload_loadSystem`;

DELIMITER $$

CREATE PROCEDURE `sp_dataload_loadSystem`(IN pNewSites INT, IN pNewPhysicians INT, IN pOrderWorkflow VARCHAR(255), IN pNewOrders INT)
BEGIN

    DECLARE p1 INT;
    
    -- Site Creation Loop
    SET p1 = 0;
    SET pNewSites = IFNULL(pNewSites, 0);
    NEWSITES: LOOP
        IF pNewSites > 0 THEN 
            CALL sp_dataload_createOrg(@myOrg);
            CALL sp_dataload_createOrgSite(@myOrg, @MySite);
        END IF;
        SET p1 = p1 + 1;
        IF p1 < pNewSites THEN
          ITERATE NEWSITES;
        END IF;
        LEAVE NEWSITES;
    END LOOP NEWSITES;
    
    -- Physician Creation Loop
    SET p1 = 0;
    SET pNewPhysicians = IFNULL(pNewPhysicians, 0);
    NEWDOCS: LOOP
        IF pNewPhysicians > 0 THEN 
            CALL sp_dataload_createPhysician(@MyPhy);
        END IF;
        SET p1 = p1 + 1;
        IF p1 < pNewPhysicians THEN
          ITERATE NEWDOCS;
        END IF;
        LEAVE NEWDOCS;
    END LOOP NEWDOCS;   

    -- Order Creation Loop
    SET p1 = 0;
    SET pNewOrders = IFNULL(pNewOrders, 0);
    NEWORDERS: LOOP
        IF pNewOrders > 0 THEN 
            CALL sp_dataload_createOrder(pOrderWorkflow, @MyOrder);
        END IF;
        SET p1 = p1 + 1;
        IF p1 < pNewOrders THEN
          ITERATE NEWORDERS;
        END IF;
        LEAVE NEWORDERS;
    END LOOP NEWORDERS;  

END$$

DELIMITER ;