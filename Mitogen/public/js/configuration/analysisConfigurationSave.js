/**
 * 
 * @author Wendy Goller
 * @version  3.1
 */



/**
 *
 * sets warning messages on screen and return boolean value for if submit should be allowed.
 * 
 * @function allowSubmit
 * @returns {boolean} if submit should be allowed
 */
function allowSubmit(){
    let allowSubmit = true;

    let templateName = $('#templateName').val();
    templateName.trim();

    let templateDescription = $('#templateDescription').val();
    templateDescription.trim();

    if(/'/.test(templateName) || /"/.test(templateName)) {
        $('#templateName').siblings(".analysisWarningMessage").remove();
        $('#templateName').parent().append("<div class='analysisWarningMessage'>Remove special characters from template name. </div>");
        allowSubmit = false;
    } else {
        $('#templateName').siblings(".analysisWarningMessage").remove();
    }

    if($('#templateActive').val() == 0 && $('#associatedStepName').val() != ''){
        $('#associatedStepName').siblings(".analysisWarningMessage").remove();
        $('#associatedStepName').parent().append("<div class='analysisWarningMessage'>Associated step must be cleared when template is inactive.</div>");
        allowSubmit = false;
    } else {
        $('#associatedStepName').siblings(".analysisWarningMessage").remove();
    }

    if(/'/.test(templateDescription) || /"/.test(templateDescription)) {
        $('#templateDescription').siblings(".analysisWarningMessage").remove();
        $('#templateDescription').parent().append("<div class='analysisWarningMessage'>Remove special characters from template description. </div>");
        allowSubmit = false;
    } else {
        $('#templateDescription').siblings(".analysisWarningMessage").remove();
    }

    if($('#associatedStepType').val() != uploadStep && $('#associatedStepType').val() != downloadStep && $('#associatedStepType').val() != diStep){
        $('.orderCheck').each(function(i, item){
            let dupOrder = checkFieldOrder($(item));
            if(!dupOrder){
                allowSubmit = false;
            }
        });

                            
        $('.orderModCheck').each(function(i, item){
            let dupOrder2 = checkModFieldOrder($(item));
            if(!dupOrder2){
                allowSubmit = false;
            }
        });
    }

    if($('.dataFieldSection').length > 0){
        $('.dataFieldSection').each(function () {
            let mainObj = getSaveObject($(this).attr('id'), 'data')

            // Check for range min max
            if(mainObj.limitType === 'range'){
                if((mainObj.limits.lowerLimit * 1) > (mainObj.limits.upperLimit * 1)){
                    allowSubmit = false;
                }
            }
            if(mainObj.definerType === 'detector'){
                for (var i = 0; i < mainObj.modifierList.length; i++) {
                    if(mainObj.modifierList[i].limitType === 'range'){
                        if((mainObj.modifierList[i].limits.lowerLimit * 1) > (mainObj.modifierList[i].limits.upperLimit * 1)){
                            allowSubmit = false;
                        }
                    }
                }
            }
        });
    }
    return allowSubmit;
}


/**
 *
 * gather save information and post to the Save_Analysis_Template
 * 
 * @function configurationPost
 */
function configurationPost(){
    let templateFieldsArr = getTemplateFieldsArr();
    console.log('templateFieldsArr', templateFieldsArr)
    let previousDataArr = getPreviousDataArr();
    let metaDataArr = getMetaDataArr();
    
    let toInstColumnsArr = gettoInstColumnsArr();

    let postData = {
        "stepName": "Save_Analysis_Template",
        "Submit": true,
        "formNumber": 0,
        "templateName": ($('#templateName').val()).trim(),
        "associatedStepName": $('#associatedStepName').val(),
        "templateDescription": ($('#templateDescription').val()).trim(),
        "templateVersionNumber": $('#templateVersionNumber').val(),
        "templateNameId": $('#templateNameId').val(),
        "templateActive": $('#templateActive').val(),
        "previousTemplateVersionId": $('#methodVersionId').val(),
        "templateFieldsJson": JSON.stringify(templateFieldsArr),
        "associatedPanelsPerStep": $('#associatedPanelCodes').val(),
        "loadPreviousDataJson": JSON.stringify(previousDataArr),
        "metaDataJson": JSON.stringify(metaDataArr),
        "toInstColumnsJSON": JSON.stringify(toInstColumnsArr)
    };

    $.post('/uniflow', postData).done(function (jqxhr, statusText) {
        console.log('statusText', statusText)
        let postHtml = $.parseHTML(jqxhr);
        let postError = checkPostError(postHtml);
        if (postError !== false) {
            $('#modal').html('')
            $('#modal').html(postError)
            let errorDialog = initCenterAlertModal('modal', 'Error', true, 200, 300)
            errorDialog.dialog('open');
        } else {
            $('[name="stepForm"]').trigger('submit');
        }
    }).fail(function (jqxhr, textStatus, error) {
        let err = "Request Failed: " + textStatus + ", " + error;
        console.log(err);
        $('#modal').html('')
        $('#modal').html(err)
        let errorDialog = initCenterAlertModal('modal', 'Error', true, 200, 300)
        errorDialog.dialog('open');
    });

}

/**
 *
 * if warning should be triggered then retruns true else returns false. displays and removes warning message;
 * 
 * @function setActiveTemplateWarning
 * @returns {boolean} if warning should be triggered then retruns true else returns false.
 */
function setActiveTemplateWarning(){
    if($('#templateActive').val() == 0 && $('#associatedStepName').val() != ''){
        $('#associatedStepName').siblings(".analysisWarningMessage").remove();
        $('#associatedStepName').parent().append("<div class='analysisWarningMessage'>Associated step must be cleared when template is inactive.</div>");
        return true;
    } else {
        $('#associatedStepName').siblings(".analysisWarningMessage").remove();
        return false;
    }
}

/**
 *
 * 
 * 
 * @function gettoInstColumnsArr
 * @returns {array} 
 */
function gettoInstColumnsArr(){
    var toInstColumnsArr = []
    if($('#specimenColumn').val() != '' && $('#locationColumn').val() != ''){
        toInstColumnsArr.push({
            "specimenColumn": $('#specimenColumn').val(),
            "locationColumn": $('#locationColumn').val()
        });
    }
    return toInstColumnsArr;
}

/**
 *
 * 
 * 
 * @function getTemplateFieldsArr
 * @returns {array} 
 */
function getTemplateFieldsArr(){
    let templateFieldsArr = []

    if($('.dataFieldSection').length > 0){
        $('.dataFieldSection').each(function () {
            let mainObj = getSaveObject($(this).attr('id'), 'data')
            templateFieldsArr.push(mainObj);
        });
    }
    return templateFieldsArr;
}

/**
 *
 * 
 * 
 * @function getMetaDataArr
 * @returns {array} 
 */
function getMetaDataArr(){
    var metaDataArr = [];
    $('.metaData_checkbox').each(function(){
      if($(this).is(':checked')){
        let orderVal = ($(this).parents().siblings().children('.metaData_order').val() != '') ? $(this).parents().siblings().children('.metaData_order').val(): $(this).parents().siblings().children('.columnSelect').val();
        metaDataArr.push({
            "field": $(this).parents().siblings().children('.metaDataFieldName').val(),
            "order": orderVal,
            "id": $(this).parents().siblings().children('.formInputId').val()
        });
      }
    });
    return metaDataArr

}

/**
 *
 * 
 * 
 * @function getPreviousDataArr
 * @returns {array} 
 */
function getPreviousDataArr(){                
    let previousDataArr = []

    $('.prevData_checkbox').each(function(){
        if($(this).is(':checked')){
            let orderVal = ($(this).parents().siblings().children('.prevData_order').val() != '') ? $(this).parents().siblings().children('.prevData_order').val(): $(this).parents().siblings().children('.columnSelect').val();
            previousDataArr.push({
                "step": $(this).parents().siblings().children('.prevDataStepName').val(),
                "field": $(this).parents().siblings().children('.prevDataFieldName').val(),
                "order": orderVal,
                "id": $(this).parents().siblings().children('.prevDataDefId').val(),
                "type": $(this).parents().siblings().children('.prevDataType').val()
            });
        }
    });
    return previousDataArr

}

/**
 *
 * create the base object from the data field section for the id given
 * 
 * @function getSaveObject
 * @param {string} divId -
 * @param {string} definerType -
 * @returns {object}
 */
function getSaveObject(divId, definerType){
    let mainObj = getFieldComponentsById(divId, definerType);
    let curDataType = mainObj.dataType;
    let curLimitType = mainObj.limitType;

    if(curDataType === 'decimal'){
        if (curLimitType == 'discrete') {
            mainObj.limits = getDiscreteNumById(divId);
        } else if (curLimitType == 'threshold') {
            mainObj.limits = getThresholdById(divId);

        } else if (curLimitType == 'range') {
            mainObj.limits = getRangeById(divId);
        }

    } else if(curDataType === 'varchar'){
        mainObj.limits = getTextDiscreteById(divId);
        if(mainObj.limits[1].discreteLimit != ''){
          mainObj.limitType = 'discrete'
        } else {
          mainObj.limitType = '';
        }
    } else if(curDataType === 'grouping'){
        mainObj.modifierList = getModifiersById(divId);
        //Changing dataType to varchar since it is changing context
        //Outside of this step the dataType is varchar and the definer type is used to distinguish detectors
        mainObj.dataType = 'varchar'
    } else if(curDataType === 'dateTime'){
        // this is here for later when datetime selection is implemented
    } 
    return mainObj;
}



/**
 *
 * create the array of modifier objects withing the data field section for the id given
 * 
 * @function getModifiersById
 * @param {string} divId -
 * @returns {Array of Objects}
 */
function getModifiersById(divId){
    let modifierArr = []

    let modifierChildArr = $('#' + divId).find('.hideOnLoadModifyOption').children();

    for (var i = 0; i < modifierChildArr.length; i++) {
        
        let modifierDivId = $(modifierChildArr[i]).attr('id')
        modifierArr.push(getSaveObject(modifierDivId, 'modifier'));
    }

    return modifierArr
}

/**
  *
  *
**/
function getFieldComponentsById(divId, definerType) {

    if($("#" + divId + "_dataType").val() === "grouping"){
        definerType = 'detector';
    } else if($("#" + divId + "_dataType").val() === "varchar"){

    }

    return {
        "definerType": definerType, //fieldType
        "fieldName": $("#" + divId + "_fieldName").val(),
        "tableFieldOrder": ($("#associatedStepType").val() == uploadStep) ? $("#" + divId + "_columnSelect").val():$("#" + divId + "_tableFieldOrder").val(),
        "resultCode" : $("#" + divId + "_resultCode").val(),
        "dataType": $("#" + divId + "_dataType").val(),
        "limitType": $("#" + divId + "_numberDataType").val(),
        "units": $("#" + divId + "_units").val(),
        "sigFigs": $("#" + divId + "_sigFigs").val(),
        "reportOption": $("#" + divId + "_reportOption").val(),
        "modifierList": "",
        "limits": "",
        "panels": scrubPanelArr($("#" + divId + "_panelsOption").val())
    }

}


/**
 *
 * Removes blanks from the array
 *
 * @function scrubPanelArr
 * @param {Array} panelArr
 * @returns {Array}
 */
function scrubPanelArr(panelArr) {
    return panelArr.filter(function(item){
        if(item !== ""){
            return item;
        }
    })
}

/**
 *
 * create the array of discrete objects withing the data field section for the id given
 *   position 0 of the array will always be the not equal object
 * 
 * @function getTextDiscreteById
 * @param {string} divId -
 * @returns {Array of Objects}
 */
function getTextDiscreteById(divId) {
    let discreteArr = [];
    let fieldLimitsChildArr = $('#' + divId).find('.fieldLimits').children();

    for (var i = 0; i < fieldLimitsChildArr.length; i++) {
        if(i === 0){
            discreteArr.push({
                'notEqualInterpretation': $(fieldLimitsChildArr[i]).find('.notEqualDiscreteInterpretation').val(),
                'notEqualWording': ($(fieldLimitsChildArr[i]).find('.notEqualDiscreteWording').val() === undefined) ? '' : $(fieldLimitsChildArr[i]).find('.notEqualDiscreteWording').val(),
                'notEqualCss': $(fieldLimitsChildArr[i]).find('.notEqualDiscreteCSS').val()
            })
        } else {
            discreteArr.push({
                'discreteLimit': $(fieldLimitsChildArr[i]).find('.discrete').val(),
                'equalInterpretation': $(fieldLimitsChildArr[i]).find('.equalDiscreteInterpretation').val(),
                'equalWording': ($(fieldLimitsChildArr[i]).find('.equalDiscreteWording').val() === undefined) ? '' : $(fieldLimitsChildArr[i]).find('.equalDiscreteWording').val(),
                'equalCss': $(fieldLimitsChildArr[i]).find('.equalDiscreteCSS').val()
            })
        }
    }
    return discreteArr
}


/**
 *
 * create the array of discrete objects withing the data field section for the id given
 *   position 0 of the array will always be the not equal object
 * 
 * @function getDiscreteNumById
 * @param {string} divId -
 * @returns {Array of Objects}
 */
function getDiscreteNumById(divId) {
    return [{
        'notEqualInterpretation': $('#' + divId + '_notEqualDiscreteInterpretation').val(),
        'notEqualWording': ($('#' + divId + '_notEqualDiscreteWording').val() === undefined) ? '' : $('#' + divId + '_notEqualDiscreteWording').val(),
        'notEqualCss': $('#' + divId + '_notEqualDiscreteCSS').val()
    },{
        'discreteLimit': $('#' + divId + '_discrete').val(),
        'equalInterpretation': $('#' + divId + '_equalDiscreteInterpretation').val(),
        'equalWording': ($('#' + divId + '_equalDiscreteWording').val() === undefined) ? '' : $('#' + divId + '_equalDiscreteWording').val(),
        'equalCss': $('#' + divId + '_equalDiscreteCSS').val()
    }]
}


/**
 *
 * create the object for the range for the given field id.
 * 
 * @function getRangeById
 * @param {string} divId -
 * @returns {object}
 */
function getRangeById(divId) {
    return {

        "upperLimit": $('#' + divId + '_maxLimit').val(),
        "lowerLimit": $('#' + divId + '_minLimit').val(),

        "belowLowerInterpretation": $('#' + divId + '_belowLowerResult').val(),
        "belowLowerWording" : ($('#' + divId + '_belowLowerWording').val() === undefined) ? '' : $('#' + divId + '_belowLowerWording').val(),
        "belowLowerCss": $('#' + divId + '_belowLowerCSS').val(),
        
        "equalLowerInterpretation": $('#' + divId + '_equalLowerResult').val(),
        "equalLowerWording" : ($('#' + divId + '_equalLowerWording').val() === undefined) ? '' : $('#' + divId + '_equalLowerWording').val(),
        "equalLowerCss": $('#' + divId + '_equalLowerCSS').val(),
        
        "inRangeInterpretation": $('#' + divId + '_betweenLowerUpperResult').val(),
        "inRangeWording" :  ($('#' + divId + '_betweenLowerUpperWording').val() === undefined) ? '' : $('#' + divId + '_betweenLowerUpperWording').val(),
        "inRangeCss": $('#' + divId + '_betweenLowerUpperCSS').val(),
        
        "equalUpperInterpretation": $('#' + divId + '_equalUpperResult').val(),
        "equalUpperWording" : ($('#' + divId + '_equalUpperWording').val() === undefined) ? '' : $('#' + divId + '_equalUpperWording').val(),
        "equalUpperCss": $('#' + divId + '_equalUpperCSS').val(),
        
        "aboveUpperInterpretation": $('#' + divId + '_aboveUpperResult').val(),
        "aboveUpperWording" : ($('#' + divId + '_aboveUpperWording').val() === undefined) ? '' : $('#' + divId + '_aboveUpperWording').val(),
        "aboveUpperCss": $('#' + divId + '_aboveUpperCSS').val()

    }
}



/**
 *
 * create the object for the threshold for the given field id.
 * 
 * @function getThresholdById
 * @param {string} divId -
 * @returns {object}
 */
function getThresholdById(divId){
    return {
        'thresholdLimit': $('#' + divId + '_threshold').val(),
        'belowThresholdInterpretation': $('#' + divId + '_belowThreshold').val(), 
        'equalThresholdInterpretation': $('#' + divId + '_equalThreshold').val(), 
        'aboveThresholdInterpretation': $('#' + divId + '_aboveThreshold').val(), 
        'belowThresholdWording': ($('#' + divId + '_belowThresholdWording').val() === undefined) ? '' : $('#' + divId + '_belowThresholdWording').val(),
        'equalThresholdWording': ($('#' + divId + '_equalThresholdWording').val() === undefined) ? '' : $('#' + divId + '_equalThresholdWording').val(),
        'aboveThresholdWording': ($('#' + divId + '_aboveThresholdWording').val() === undefined) ? '' : $('#' + divId + '_aboveThresholdWording').val(),
        'belowThresholdCss': $('#' + divId + '_belowThresholdCSS').val(), 
        'equalThresholdCss': $('#' + divId + '_equalThresholdCSS').val(),
        'aboveThresholdCss': $('#' + divId + '_aboveThresholdCSS').val()
    }

}



/*
 *
 * @function checkFieldOrder
 * @param {object} element -
 * @return {boolean} -
 */
function checkFieldOrder(element){
  let thisOrder = element.val();
  let thisFieldId = element.attr("id");
  let tableFieldOrderArray = $('.orderCheck');
  let duplicateOrder = false;
  if(tableFieldOrderArray.length > 0){
    $(tableFieldOrderArray).each(function(i, item){
      let itemId = item.id;
      let itemVal = item.value;
      if(thisFieldId !== itemId && itemVal === thisOrder){
        duplicateOrder = true;
      }
    });
  }
  if(duplicateOrder){
    $(element).siblings(".analysisWarningMessage").remove();
    $(element).parent().append("<div class='analysisWarningMessage'>This order number has <br/> been used for this field type, <br/>select a new order number.</div>");
    return false;
  } else {
    $(element).siblings(".analysisWarningMessage").remove();
    return true;
  }
}


function checkModFieldOrder(element){
  let thisOrder = element.val();
  let thisFieldId = element.attr("id");
  let tableFieldOrderArray = $(element).closest('.dataModifierFieldSection').parent().find('.orderModCheck');
  let duplicateOrder = false;
  if(tableFieldOrderArray.length > 0){
    $(tableFieldOrderArray).each(function(i, item){
      let itemId = item.id;
      let itemVal = item.value;
      if(thisFieldId !== itemId && itemVal === thisOrder){
        duplicateOrder = true;
      }
    });
  }
  if(duplicateOrder){
    $(element).siblings(".analysisWarningMessage").remove();
    $(element).parent().append("<div class='analysisWarningMessage'>This order number has <br/> been used for this field type, <br/>select a new order number.</div>");
    return false;
  } else {
    $(element).siblings(".analysisWarningMessage").remove();
    return true;
  }
}

