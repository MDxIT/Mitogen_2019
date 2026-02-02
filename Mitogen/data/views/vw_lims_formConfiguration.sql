DROP VIEW IF EXISTS `vw_lims_formConfiguration`;

CREATE VIEW `vw_lims_formConfiguration` 
AS
SELECT 
    fcp.`id`, 
    fd.`workflow`,
    fd.`instance`,
    fd.`formType`,
    fcp.`section`,
    fcp.`subSection`,
    fcp.`inputName`,
    fis.`screenLabel`,
    fis.`placeHolder`,
    fis.`defaultValue`,
    fis.`showField`,
    fis.`required`,
    fis.`readonly`
FROM 
    `formConfigurableParts` fcp
    INNER JOIN `formInputSettings` fis
    ON fcp.`id` = fis.`formConfigurablePartsId`
    INNER JOIN `formDefinition` fd
    ON fd.`id` = fis.`formDefinitionId`;


