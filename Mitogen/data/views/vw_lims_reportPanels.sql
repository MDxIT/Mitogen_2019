DROP VIEW IF EXISTS `vw_lims_reportPanels`;

CREATE VIEW `vw_lims_reportPanels` 
AS
SELECT 
    rdp.`reportDefinitionVersionId`,
    rdp.`panelCode`
FROM 
    `reportDefinitionPanels` rdp;





