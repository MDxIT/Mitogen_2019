DROP VIEW IF EXISTS `vw_lims_reagents`;

CREATE VIEW `vw_lims_reagents` 
AS
SELECT 
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
  r.`eventId`,
  e.`eventDate`
FROM 
    `reagents` r
    INNER JOIN `events` e
    ON r.`eventId` = e.`eventId`;