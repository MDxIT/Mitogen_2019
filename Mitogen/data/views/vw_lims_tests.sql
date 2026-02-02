DROP VIEW IF EXISTS `vw_lims_tests`;

CREATE VIEW `vw_lims_tests` 
AS
SELECT 
    t.`id`,
    t.`testCode`,
    t.`name`,
    t.`description`,
    t.`abbreviation`,
    t.`type`,
    t.`disabled`, 
    t.`cptCode`, 
    t.`zCode`, 
    t.`billingCode`
FROM 
    `tests` t;


