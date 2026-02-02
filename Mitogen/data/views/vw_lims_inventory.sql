DROP VIEW IF EXISTS `vw_lims_inventory`;

CREATE VIEW `vw_lims_inventory` 
AS
SELECT 
	i.`inventoryId`,
	i.`inventoryItem`,
	i.`inventoryType`,
	i.`catalogNumber`,
	i.`vendor`,
	i.`quantity`,
	i.`units`,
	i.`threshold`,
	i.`thresholdUnits`,
	i.`eventId`,
	e.`eventDate`
FROM 
    `inventoryItems` i
    INNER JOIN `events` e
    ON i.`eventId` = e.`eventId`;