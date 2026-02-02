DROP VIEW IF EXISTS `vw_lims_physicians`;

CREATE VIEW `vw_lims_physicians` 
AS
SELECT 
    p.`id`,
    p.`physicianId`,
    p.`first_name`,
    p.`middle_name`,
    p.`last_name`,
    p.`title`,
    p.`dob`,
    p.`gender`,
    p.`providerId`,
    p.`providerType`,
    p.`eventId`,
    e.`eventDate`
FROM 
    `physicians` p
    INNER JOIN `events` e
    ON p.`eventId` = e.`eventId`;

