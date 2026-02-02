
/**
 * gererates the select field based on the options array.
 *
 * @function generateSelectLists
 * @param {string} optionsArray - array of select list option value pairs or an array of options.
 * @param {string} selectedValue - value to marke as selected on element creation
 * @param {string} otherClasses - space separated class list to add to the class of the imput
 * @param {string} otherAttributes - string of other attributes to add to the select
 * @returns {string} the html select element
 */
function generateSelectLists (optionsArray, selectedValue, otherClasses, otherAttributes, selectId){

  var selectElement = '<select ' + otherAttributes + ' class="' + otherClasses + '" id="' + selectId + '" value="' + selectedValue + '" tabindex="1">'
  var optionsArr = $.map(optionsArray ,function(option) {
    if(typeof(option) === 'object'){
      if(selectedValue === option.value){
        return '<option value="'+ option.value +'" selected>' + option.display + '</option>';
      } else {
        return '<option value="'+ option.value +'">' + option.display + '</option>';
      }
    } else {
      if(selectedValue === option){
        return '<option value="'+ option +'" selected>' + option + '</option>';
      } else {
        return '<option value="'+ option +'">' + option + '</option>';
      }
    }
  });
  selectElement += optionsArr.join('');
  selectElement += '</select>'
  return selectElement;
}


/**
 * gererates the select field based on the options array.
 *
 * @function generateSelectLists
 * @param {string} optionsArray - array of select list option value pairs or an array of options.
 * @param {string} selectedValue - value to marke as selected on element creation
 * @param {string} otherClasses - space separated class list to add to the class of the imput
 * @param {string} otherAttributes - string of other attributes to add to the select
 * @returns {string} the html select element
 */
function generateMultiSelectLists (optionsArray, selectedValue, otherClasses, otherAttributes, selectId){
    
    console.log('selectedValue', selectedValue)
    var selectElement = '<select name="'+selectId+'" ' + otherAttributes + ' class="' + otherClasses + '" id="' + selectId + '" tabindex="1" multiple="" data-parsley-required="false" data-parsley-multiple="'+selectId+'">'
    var optionsArr = $.map(optionsArray ,function(option) {
        if(typeof(option) === 'object'){
            if(selectedValue.indexOf(option.value) > -1){
                return '<option value="'+ option.value +'" selected>' + option.display + '</option>';
            } else {
                return '<option value="'+ option.value +'">' + option.display + '</option>';
            }
        } else {
            if(selectedValue === option){
                return '<option value="'+ option +'" selected>' + option + '</option>';
            } else {
                return '<option value="'+ option +'">' + option + '</option>';
            }
        }
    });
    selectElement += optionsArr.join('');
    selectElement += '</select>'
    return selectElement;
}



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
  dataFieldSection +=   '<div class="printFieldGrouping">'
  dataFieldSection +=     '<label for="'+ fieldId +'">' + Fieldlabel + '</label>'
  dataFieldSection +=     generateSelectLists(optionsArray, selectedValue, otherClasses, otherAttributes, fieldId);
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
  dataFieldSection +=   '<div class="printFieldGrouping">'
  dataFieldSection +=     '<label for="'+FieldId+'">' + Fieldlabel + '</label>'
  dataFieldSection +=     '<input type="'+inputType+'" id="'+FieldId+'" class="'+otherClasses+'" '+otherAttributes+' value="'+fieldValue+'" tabindex="1">';
  dataFieldSection +=   '</div>';
  return dataFieldSection;
}



/**
 *
 *
 * @function generateFieldGroupingTextArea
 * @param {string} FieldId -
 * @param {string} Fieldlabel -
 * @param {string} inputType -
 * @param {string} otherClasses -
 * @param {string} otherAttributes -
 * @param {string} fieldValue -
 * @returns {string}
 */
function generateFieldGroupingTextArea(FieldId, Fieldlabel, inputType, otherClasses, otherAttributes, fieldValue){
  let dataFieldSection =  '';
  dataFieldSection +=   '<div class="printFieldGrouping">'
  dataFieldSection +=     '<label for="'+FieldId+'">' + Fieldlabel + '</label>'
  dataFieldSection +=     '<textArea type="'+inputType+'" id="'+FieldId+'" class="'+otherClasses+'" '+otherAttributes+' value="'+fieldValue+'" tabindex="1">'+fieldValue+'</textArea>';
  dataFieldSection +=   '</div>';
  return dataFieldSection;
}


/**
 * Check for ajax POST form errors
 *
 * @param {object} html - the parsed html object from ajax post $.parseHTML()
 * @returns {string|false} error message or false if no error
 */
function checkPostError(html) {

  if ($(html).find('#systemExceptionForm').length > 0) {
    return $(html).find('#exceptionMessage').text();
  }

  if ($(html).find('#systemException').length > 0) {
    return $(html).find('#systemException').text();
  }

  if ($(html).find('#errorId').length > 0) {
    return $(html).find('#errorId').text();
  }

  if ($(html).find('#execerror').length > 0) {
    return $(html).find('#execerror').text();
  }

  return false;
}
