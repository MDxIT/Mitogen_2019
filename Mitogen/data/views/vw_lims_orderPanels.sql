DROP VIEW IF EXISTS `vw_lims_orderPanels`;

CREATE VIEW `vw_lims_orderPanels` 
AS
SELECT 
    rp.`id`,
    rp.`requestId`,
    rp.`panelCode`,
    rp.`eventid`,
     e.`eventDate`
FROM 
    `reqPanels` rp
    INNER JOIN `events` e
    ON rp.`eventId` = e.`eventId`;


