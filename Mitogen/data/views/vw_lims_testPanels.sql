DROP VIEW IF EXISTS `vw_lims_testPanels`;

CREATE VIEW `vw_lims_testPanels` 
AS
SELECT 
    tp.`id`,
    tp.`panelCode`,
    tp.`testCode`
FROM 
    `testPanels` tp;
