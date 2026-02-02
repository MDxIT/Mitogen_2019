DROP VIEW IF EXISTS `vw_lims_orderUserDefFields`;

CREATE VIEW `vw_lims_orderUserDefFields` 
AS
SELECT 
    q.`containerId` AS requestId, 
    q2.`inputName`, 
    q.`value`, 
    q.`eventId`, 
    q.`eventDate`
FROM 
    (
    SELECT 
        cp.`containerId`, 
        cp.`property`, 
        cp.`value`, 
        cp.`eventId`,
         e.`eventDate`
    FROM 
        `containerProperties` cp 
        INNER JOIN `requestForms` rf 
        ON cp.`containerId` = rf.`requestId`
        INNER JOIN `events` e
        ON cp.`eventId` = e.`eventId`
    UNION
    SELECT 
        cd.`containerId`, 
        cd.`property`, 
        cd.`value`, 
        cd.`eventId`,
         e.`eventDate` 
    FROM 
        `containerDates` cd 
        INNER JOIN `requestForms` rf 
        ON cd.`containerId` = rf.`requestId`
        INNER JOIN `events` e
        ON cd.`eventId` = e.`eventId`) q 
    INNER JOIN 
        (
        SELECT 
            `id`, 
            fcp.`inputName`, 
            concat('userDef_', fcp.`inputName`) AS userInputName 
        FROM 
            `formConfigurableParts` fcp
        ) q2
    ON q.`property` = q2.`userInputName`
    