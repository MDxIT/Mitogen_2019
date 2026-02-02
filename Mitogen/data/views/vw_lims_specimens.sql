DROP VIEW IF EXISTS `vw_lims_specimens`;

CREATE VIEW `vw_lims_specimens` 
AS
SELECT 
    rs.`id`,
    rs.`requestId`,
    rs.`patientId`,
    rs.`expectedBarcode`,
    rs.`externalIdentifier`,
    rs.`specimenType`,
    rs.`specimenSource`,
    rs.`collectionDate`,
    rs.`collectionTime`,
    rs.`specimenId`,
    rs.`receivedDate`,
    rs.`specimenQuantity`,
    rs.`specimenQuantityUnits`,
    rs.`collectorName`,
    rs.`specimenCondition`,
    rs.`status`,
    rs.`statusEventId`,
    e1.`eventDate` as statusDate,
    rs.`eventId`,
    e2.eventDate
FROM 
    `requestSpecimens` rs
    INNER JOIN `events` e1
    ON rs.`eventId` = e1.`eventId`
    INNER JOIN `events` e2
    ON rs.`eventId` = e2.`eventId`; 
