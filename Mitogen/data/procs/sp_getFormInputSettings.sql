DROP PROCEDURE IF EXISTS `sp_getFormInputSettings`;

DELIMITER $$
CREATE PROCEDURE `sp_getFormInputSettings`(
    IN p_section VARCHAR(255),
    IN p_formType VARCHAR(255),
    IN p_formDefinitionId INT
    )

BEGIN
SET SESSION group_concat_max_len = 1000000;

SELECT
    GROUP_CONCAT(DISTINCT
        '''', fp.inputName, ''' AS "inputName_', fp.inputName, '", ',
        '''', fis.showField, ''' AS "showField_', fp.inputName, '", ',
        '''', fis.required, ''' AS "required_', fp.inputName, '", ',
        '''', fis.readOnly, ''' AS "readOnly_', fp.inputName, '", ',
        '''', fis.screenLabel, ''' AS "screenLabel_', fp.inputName, '", ',
        '''', fis.defaultValue, ''' AS "defaultValue_', fp.inputName, '", ',
        '''', fis.placeHolder,  ''' AS "placeHolder_', fp.inputName, '"' SEPARATOR ',') as `inputSettings`
FROM
    formInputSettings fis
    INNER JOIN formConfigurableParts fp
    ON fp.id = fis.formConfigurablePartsId
WHERE
    fis.formDefinitionId = p_formDefinitionId
    AND fp.section = p_section
    AND fp.formType = p_formType
    AND fp.inputType <> 'section'
    AND fp.inputType <> 'subSection';


END$$
DELIMITER ;

