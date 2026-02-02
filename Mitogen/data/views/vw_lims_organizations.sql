DROP VIEW IF EXISTS `vw_lims_organizations`;

CREATE VIEW `vw_lims_organizations` 
AS
SELECT 
    o.`id`,
    o.`orgId`,
    o.`name`,
    o.`eventId`,
    e.`eventDate`
FROM 
    `organizations` o
    INNER JOIN `events` e
    ON o.`eventId` = e.`eventId`;
