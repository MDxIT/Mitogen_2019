DROP VIEW IF EXISTS `vw_lims_organizationSites`;

CREATE VIEW `vw_lims_organizationSites` 
AS
SELECT 
    os.`id`,
    os.`siteId`,
    os.`orgId`,
    os.`parentSiteId`,
    os.`name`,
    os.`organizationType`,
    os.`isSystem`,
    os.`siteCode`,
    os.`address1`,
    os.`address2`,
    os.`city`,
    os.`state`,
    os.`postalcode`,
    os.`country`,
    os.`email`,
    os.`website`,
    os.`phone1`,
    os.`phone2`,
    os.`fax1`,
    os.`fax2`,
    os.`timezone`,
    os.`dateFormat`,
    os.`language`,
    os.`eventId`,
     e.`eventDate`
FROM
    `organizationSites` os
    INNER JOIN `events` e
    ON os.`eventId` = e.`eventId`;

