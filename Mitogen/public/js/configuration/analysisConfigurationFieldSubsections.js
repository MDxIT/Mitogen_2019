/**
 * 
 * @author Wendy Goller
 * @version  3.1
 */

/**
 *
 *
 * @function generateFieldGroupingSelect
 * @param {array} optionsArray -
 * @param {string} selectedValue -
 * @param {string} otherClasses -
 * @param {string} otherAttributes -
 * @param {string} fieldId -
 * @param {string} Fieldlabel -
 * @returns {string}
 */
function generateFieldGroupingSelect(optionsArray, selectedValue, otherClasses, otherAttributes, fieldId, Fieldlabel){
  let dataFieldSection =  '';
  dataFieldSection +=   '<div class="fieldGrouping verticalFlex">'
  dataFieldSection +=     '<label for="'+ fieldId +'">' + Fieldlabel + '</label>'
  dataFieldSection +=     generateSelectLists(optionsArray, selectedValue, otherClasses, otherAttributes, fieldId);
  dataFieldSection +=   '</div>';
  return dataFieldSection;
}

function generateFieldGroupingSelectHidden(optionsArray, selectedValue, otherClasses, otherAttributes, fieldId, Fieldlabel){
  let dataFieldSection =  '';
  dataFieldSection +=   '<div class="fieldGrouping verticalFlex" style="display: none;">'
  dataFieldSection +=     '<label for="'+ fieldId +'">' + Fieldlabel + '</label>'
  dataFieldSection +=     generateSelectLists(optionsArray, selectedValue, otherClasses, otherAttributes, fieldId);
  dataFieldSection +=   '</div>';
  return dataFieldSection;
}

/**
 *
 *
 * @function generateFieldGroupingMultiSelect
 * @param {array} optionsArray -
 * @param {string} selectedValue -
 * @param {string} otherClasses -
 * @param {string} otherAttributes -
 * @param {string} fieldId -
 * @param {string} Fieldlabel -
 * @returns {string}
 */
function generateFieldGroupingMultiSelect(optionsArray, selectedValue, otherClasses, otherAttributes, fieldId, Fieldlabel, fieldInstructionText){
  let dataFieldSection =  '';
  dataFieldSection +=   '<div class="fieldGrouping verticalFlex">'
  dataFieldSection +=     '<label for="'+ fieldId +'">' + Fieldlabel + '</label>'
  dataFieldSection +=     generateMultiSelectLists(optionsArray, selectedValue, otherClasses, otherAttributes, fieldId);
  dataFieldSection +=     "<span id='"+ fieldId +"_instruction'>" + fieldInstructionText + '</span>'
  dataFieldSection +=   '</div>';
  return dataFieldSection;
}


/**
 *
 *
 * @function generateFieldGroupingInput
 * @param {string} FieldId -
 * @param {string} Fieldlabel -
 * @param {string} inputType -
 * @param {string} otherClasses -
 * @param {string} otherAttributes -
 * @param {string} fieldValue -
 * @returns {string}
 */
function generateFieldGroupingInput(FieldId, Fieldlabel, inputType, otherClasses, otherAttributes, fieldValue){
    let dataFieldSection =  '';
    dataFieldSection +=   '<div class="fieldGrouping verticalFlex">'
    dataFieldSection +=     '<label for="'+FieldId+'">' + Fieldlabel + '</label>'
    dataFieldSection +=     '<input type="'+inputType+'" id="'+FieldId+'" class="'+otherClasses+'" '+otherAttributes+' value="'+fieldValue+'" tabindex="1">';
    dataFieldSection +=   '</div>';
    return dataFieldSection;
}

/**
 *
 *
 * @function generateFieldGroupingButton
 * @param {string} FieldId -
 * @param {string} parentDivClass -
 * @param {string} clickFunction -
 * @param {string} fieldValue -
 * @returns {string}
 */
function generateFieldGroupingButton(FieldId, parentDivClass, clickFunction, fieldValue){
    let dataFieldSection =  '';
    dataFieldSection += '<div id="'+FieldId+'" class="'+parentDivClass+'">';
    dataFieldSection +=   '<input class="button" type="button" onclick='+clickFunction +' value="'+fieldValue+'" tabindex="1">';
    dataFieldSection += '</div>';
    return dataFieldSection;
}

/**
 *
 *
 * @function generateFieldGroupingDivButton
 * @param {string} FieldId -
 * @param {string} parentDivClass -
 * @param {string} clickFunction -
 * @param {string} fieldValue -
 * @returns {string}
 */
function generateFieldGroupingDivButton(FieldId, parentDivClass, clickFunction, fieldValue){
    return '<div id="'+FieldId+'" class="'+parentDivClass+' button" onclick='+clickFunction +' >' + fieldValue + '</div>';
}

/**
 * generates a textarea field
 *
 * @function generateFieldGroupingTextArea
 * @param {string} FieldId - Id and name of field
 * @param {string} Fieldlabel - Label for field
 * @param {string} otherClasses - space seperated class list
 * @param {string} otherAttributes - other attributes to add to textarea
 * @param {string} fieldValue - field value used to auto fill when value exists
 * @returns {string} dataFieldSection - array containing the htlm for the designated text area
 */
function generateFieldGroupingTextArea(FieldId, Fieldlabel, otherClasses, otherAttributes, fieldValue){
    let dataFieldSection = '';
    dataFieldSection += '<div class="fieldGrouping verticalFlex">';
    dataFieldSection +=   '<label for="'+FieldId+'">' + Fieldlabel + '</label>';
    dataFieldSection +=   '<textarea name="'+ FieldId+'" id="'+FieldId+'" class="'+otherClasses+'" '+otherAttributes+' value="'+fieldValue+'" tabindex="1" autocomplete="off">';
    dataFieldSection +=     fieldValue;
    dataFieldSection +=   '</textarea>';
    dataFieldSection += '</div>';
    return dataFieldSection;
}


/**
  *
  * @function generateBlankSelectList
  * @param {object} otherAttributes -
  * @param {string} otherClasses -
  * @param {string} selectId -
  * @param {string} selectedValue -
  * @returns {string}
 */
function generateBlankSelectList(otherAttributes,otherClasses, selectId, selectedValue){
  var selectElement = '<select ' + otherAttributes + ' class="' + otherClasses + '" id="' + selectId + '" value="' + selectedValue + '" tabindex="1">' + '</select>';
  return selectElement;
}
