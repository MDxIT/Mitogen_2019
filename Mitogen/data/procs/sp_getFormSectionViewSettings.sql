DROP PROCEDURE IF EXISTS `sp_getFormSectionViewSettings`;

DELIMITER $$
CREATE PROCEDURE `sp_getFormSectionViewSettings`(
     IN p_formType VARCHAR(255),
     IN p_formDefinitionId INT
 )
BEGIN
 SET SESSION group_concat_max_len = 1000000;

 SELECT
     GROUP_CONCAT(DISTINCT
         '''', fis.showField, ''' AS "showField_', fp.section, '"' SEPARATOR ',') as `sectionSettings`
 FROM formInputSettings fis
   INNER JOIN formConfigurableParts fp
   ON fp.id = fis.formConfigurablePartsId
 WHERE fis.formDefinitionId = p_formDefinitionId
   AND fp.inputType = 'section';

END$$
DELIMITER ;
