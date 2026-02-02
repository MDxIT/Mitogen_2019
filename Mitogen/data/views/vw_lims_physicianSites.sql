DROP VIEW IF EXISTS `vw_lims_physicianSites`;

CREATE VIEW `vw_lims_physicianSites` 
AS
SELECT 
    ps.`id`,
    ps.`physicianId`,
    ps.`siteId`,
    ps.`email`,
    ps.`phone1`,
    ps.`phone2`,
    ps.`fax1`,
    ps.`fax2`,
    ps.`active`,
    ps.`eventId`,
     e.`eventDate`
FROM 
    `physicianSites` ps
    INNER JOIN `events` e
    ON ps.`eventId` = e.`eventId`;


