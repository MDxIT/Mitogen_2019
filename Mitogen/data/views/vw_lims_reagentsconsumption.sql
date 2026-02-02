DROP VIEW IF EXISTS `vw_lims_reagentsconsumption`;

CREATE VIEW `vw_lims_reagentsconsumption` 
AS
SELECT
	r.`historyId`,
	r.`id`,
	r.`reagentId`,
	r.`reagentType`,
	r.`catalogNo`,
	r.`quantity`,
	r.`quantityInside`,
	r.`concentration`,
	r.`unitOfMeasure`,
	r.`threshold`,
	r.`thresholdUnits`,
	r.`lowerLimit`,
	r.`upperLimit`,
	r.`lotNumber`,
	r.`parentLot`,
	r.`vendor`,
	r.`storageId`,
	r.`projectType`,
	r.`costPerUnit`,
	r.`poNumber`,
	r.`receivedDate`,
	r.`expirationDate`,
	r.`openDate`,
	r.`QCDate`,
	r.`QCType`,
	r.`QCStatus`,
	r.`status`,
	r.`siteId`,
	r.`historyStartDate`,
	r.`historyEndDate`,
	r.`historyAction`,
	r.`historyUser`,
	r.`eventId`,    
	e.`eventDate`
FROM
	`reagentHistory` r
	INNER JOIN `events` e
	ON r.`eventId` = e.`eventId`