DROP VIEW IF EXISTS `vw_lims_panels`;

CREATE VIEW `vw_lims_panels` 
AS
SELECT 
    p.`id`,
    p.`panelCode`,
    p.`name`,
    p.`description`,
    p.`abbreviation`,
    p.`type`,
    p.`genes`,
    p.`isCustomGenePanel`,
    p.`disabled`
FROM 
    `panels` p;


