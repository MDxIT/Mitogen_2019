/**
 * 
 * @author Wendy Goller
 * @version  3.1
 */


//TODO: ADD info tooltip for panel fields

const diStep = 'Analysis: To/From Instrument (Data Innovations)';

// Following global variables are lists needed in various functions for html select list generation
const numericTypeOptionsArr = [ {'value':'', 'display': ''}
                                ,{'value':'discrete', 'display':'Discrete'}
                                ,{'value':'threshold', 'display':'Threshold'}
                                ,{'value':'range', 'display':'Range'}
                              ];

const excelColumns = [ {'value':'', 'display': ''},{"value":"1", "display":"A"},{"value":"2", "display":"B"},{"value":"3", "display":"C"}
                    ,{"value":"4", "display":"D"},{"value":"5", "display":"E"},{"value":"6", "display":"F"},{"value":"7", "display":"G"}
                    ,{"value":"8", "display":"H"},{"value":"9", "display":"I"},{"value":"10", "display":"J"},{"value":"11", "display":"K"}
                    ,{"value":"12", "display":"L"},{"value":"13", "display":"M"},{"value":"14", "display":"N"},{"value":"15", "display":"O"}
                    ,{"value":"16", "display":"P"},{"value":"17", "display":"Q"},{"value":"18", "display":"R"},{"value":"19", "display":"S"}
                    ,{"value":"20", "display":"T"},{"value":"21", "display":"U"},{"value":"22", "display":"V"},{"value":"23", "display":"W"}
                    ,{"value":"24", "display":"X"},{"value":"25", "display":"Y"},{"value":"26", "display":"Z"},{"value":"27", "display":"AA"}
                    ,{"value":"28", "display":"AB"},{"value":"29", "display":"AC"},{"value":"30", "display":"AD"},{"value":"31", "display":"AE"}
                    ,{"value":"32", "display":"AF"},{"value":"33", "display":"AG"},{"value":"34", "display":"AH"},{"value":"35", "display":"AI"}
                    ,{"value":"36", "display":"AJ"},{"value":"37", "display":"AK"},{"value":"38", "display":"AL"},{"value":"39", "display":"AM"}
                    ,{"value":"40", "display":"AN"},{"value":"41", "display":"AO"},{"value":"42", "display":"AP"},{"value":"43", "display":"AQ"}
                    ,{"value":"44", "display":"AR"},{"value":"45", "display":"AS"},{"value":"46", "display":"AT"},{"value":"47", "display":"AU"}
                    ,{"value":"48", "display":"AV"},{"value":"49", "display":"AW"},{"value":"50", "display":"AX"},{"value":"51", "display":"AY"}
                    ,{"value":"52", "display":"AZ"}
                    ];

const cssValuesOptions =  [{'value':'', 'display': ''}
                            ,{'value':"analysisPass", 'display': 'Pass - Green Border'}
                            ,{'value':"analysisFail", 'display': "Fail - Red Border"}
                            ,{'value':"analysisWarning", 'display': "Warning - Orange Border"}
                            , {'value':"analysisAlert", 'display': 'Alert - Yellow Border'}
                            ,{'value':"analysisIgnore", 'display':'Ignore - Gray Border'}
                        ];

const dateTimeFormatArr = ['', 'yyyy-mm-dd hh:mm:ss', 'mm-dd-yyyy hh:mm:ss', 'dd-mm-yyyy hh:mm:ss', 'mm/dd/yyyy hh:mm:ss', 'dd/mm/yyyy hh:mm:ss'];

const reportOptions = [{'value':'doNotReport', 'display':'Do Not Report'}
                        ,{'value':'report', 'display':'Report'}
                        ,{'value':'reviewOnly', 'display':'Result Review Only'}
                    ];


let panelSelectArr = [{'value':'', 'display': ''}]


let numberOfDataFieldSections = 0


function onloadDataFieldEvents(){
    
    $('#btnCreateNewFieldSection').on('click', function(){
        numberOfDataFieldSections++;
        $('#dataFieldSectionsArea').append(generateAnalysisDataFields(numberOfDataFieldSections, {}));

        // Once modifier and load data are added as fieldName options this line will need to be removed.
        displayFieldTypeFields($('#dataFieldSection'+ numberOfDataFieldSections).find('.fieldName'), numberOfDataFieldSections, {})

        if($('#associatedStepType').val() == uploadStep){
            ifFromInst();
        }

    });


    $(document).on('mousedown', '.panelsOption option', function(e){
        var $this = $(this),
            that = this,
            scroll = that.parentElement.scrollTop;

        if (e.shiftKey) {
            return;
        }

        e.preventDefault();
        $this.prop('selected', !$this.prop('selected'));

        setTimeout(function() {
            that.parentElement.scrollTop = scroll;
        }, 0);
        this.dispatchEvent(new Event("change"));
    })
}


/**
 * panel multiselect list populated by the panels options in the object returned.
 * input column type:
 *    data → select data type (string, number, date, grouping)
 *         → string  allow discrete value
 *                → allow for multiple discrete positive values
 *         → date -no limits options available
 *         → number allow lower vs higher values OR discrete
 *                → for range: need lower and upper, discrete left NULL
 *                             Validate that Minimum value is less than Maximum value (this will happen on submit)
 *                → for threshold: need lower and upper value to be equal, discrete left NULL (on submit the threshold field will populate the min and max value fields in the db.)
 *                → for target: need discrete value, lower and upper left NULL
 *         → grouping allows the addition of linked subfields
 *
 * The dataType field has a selection of the following types:  Number (decimal 20,6), Text (varchar 80), Date Time (dateTime).
 * For number field user can define the number of significant figures up to 6.
 * @function generateAnalysisDataFields
 * @param {array} sectionNumber -
 * @param {string} dataFieldValues -
 * @returns {string}
 */
function generateAnalysisDataFields(sectionNumber, dataFieldValues){
    let fieldDataTypeArr = [
                         {'value':'', 'display': ''}
                        ,{'value':'decimal', 'display': 'Numeric'}
                        ,{'value':'varchar', 'display': 'Text'}
                        ,{'value':'dateTime', 'display': 'Date Time'}
                        ,{'value':'image', 'display': 'Image'}
                        // ,{'value':'grouping', 'display': 'Grouping'}
                    ];

    if($('#associatedStepType').val() != diStep){
        fieldDataTypeArr = fieldDataTypeArr.filter(function( obj ) {
            return obj.value !== 'image';
        });
    }
    let sectionId = "dataFieldSection"+sectionNumber;
    let dataFieldSection =  '';
    dataFieldSection += "<fieldSet id='"+sectionId+"' class='dataFieldSection focusSection' data-sectionNumber='"+sectionNumber+"' data-originalObj='"+JSON.stringify(dataFieldValues)+"'>";
        dataFieldSection += '<div id="deleteSection'+sectionNumber+'" onclick=deleteSection("#'+sectionId+'") class="deleteSectionBtnDiv button">';
            dataFieldSection +=   '<i class="far fa-times-circle"></i> Delete Field'
        dataFieldSection += '</div>';
        dataFieldSection += '<div class="alwaysShow"><span class="sectionTitle">Initialize Field Type</span><div class="horizontalFlex">';
            let fieldNameAdditonalAttributes = 'data-parsley-required="true" onBlur="checkNameUniqueNess($(this))"';
            dataFieldSection += generateFieldGroupingInput(sectionId+'_fieldName', 'Field Name:', 'text', 'fieldName required', fieldNameAdditonalAttributes, getDataValueFromObj(dataFieldValues, 'field_name', ''));
            
            let tableFieldOrderAdditonalAttributes = 'data-parsley-required="true" data-parsley-unique-value="true" onBlur="checkFieldOrder($(this))"';
            dataFieldSection += generateFieldGroupingInput(sectionId+'_tableFieldOrder', 'Order:', 'number', 'tableFieldOrder orderCheck required', tableFieldOrderAdditonalAttributes, getDataValueFromObj(dataFieldValues, 'field_order', ''));
            
            dataFieldSection += generateFieldGroupingSelectHidden(excelColumns, getDataValueFromObj(dataFieldValues, 'field_order', ''), 'columnSelect fieldColumn', 'data-parsley-required="false"', sectionId+'_columnSelect', 'Column:');
            dataFieldSection += generateFieldGroupingInput(sectionId+'_resultCode', 'Result Code', 'text', 'resultCode', '', getDataValueFromObj(dataFieldValues, 'result_code', ''));
            dataFieldSection += generateFieldGroupingSelect(reportOptions, getDataValueFromObj(dataFieldValues, 'report_option', ''), 'reportOption', 'data-parsley-required="false"', sectionId+'_reportOption', 'Report:' );
            dataFieldSection += generateFieldGroupingMultiSelect(panelSelectArr, getDataValueFromObj(dataFieldValues, 'panels', ''), 'panelsOption', 'data-parsley-required="false"', sectionId+'_panelsOption', 'Panel(s):', "To Select all panels leave panel selection blank." );
        dataFieldSection += '</div></div>'; //END alwaysShow

        dataFieldSection += '<div class="hideOnLoadDataOption" style="display:none;"><span class="sectionTitle">Setup Data Type Properties</span><div class="horizontalFlex">';
            // load Data attribute
            let dataTypeAdditonalAttributes = 'data-parsley-required="true" onChange=displayDataTypeFields($(this));updateSelectValue($(this).attr("id"));';
            dataFieldSection += generateFieldGroupingSelect(fieldDataTypeArr, getDataValueFromObj(dataFieldValues, 'data_type', ''), 'dataType required', dataTypeAdditonalAttributes, sectionId+'_dataType', 'Field Data Type:');

            let numberTypeAdditonalAttributes = 'onChange=displayNumberTypeFields($(this));updateSelectValue($(this).attr("id"));';
            dataFieldSection += generateFieldGroupingSelect(numericTypeOptionsArr, getDataValueFromObj(dataFieldValues, 'limit_type', ''), 'numberDataType numberType', numberTypeAdditonalAttributes, sectionId+'_numberDataType', 'Limit Type:');

            // For number field user can define the number of significant figures up to 6.
            dataFieldSection += generateFieldGroupingInput(sectionId+'_sigFigs', 'Sig Figs:', 'number', 'sigFigs numberType numTypeTop', 'max="6" min="0" ', getDataValueFromObj(dataFieldValues, 'sig_figs', ''));

            // For number field user can select units.

            let analysisString = $('#analysisUnitsText').val();
            var analysisStringObj = JSON.parse(analysisString);

            dataFieldSection += generateFieldGroupingSelect(analysisStringObj, getDataValueFromObj(dataFieldValues, 'units', ''), 'units', '', sectionId+'_units', 'Units:');

            dataFieldSection += generateFieldGroupingDivButton('discreteAddSection'+sectionNumber, 'discreteAddSectionBtnDiv', 'addDiscreteEqualSection($(this))', '<i class="fas fa-plus-circle"></i> Add Value');

            dataFieldSection += '<div id="ModifierCounter'+sectionNumber+'" class="modifierCounterDiv">';
                dataFieldSection += 'Modifier Count: <span class="modifierCounter"></span>';
            dataFieldSection += '</div>';

        dataFieldSection += '</div></div>';//END hideOnLoadDataOption
        dataFieldSection += '<div class="hideOnLoadModifyOption"><div class="horizontalFlex">';
        dataFieldSection += '</div></div>'; //END hideOnLoadModifyOption
        dataFieldSection += generateFieldGroupingDivButton('addModifierSection'+sectionNumber, 'addModifierSectionBtnDiv', 'addModifierSection($(this))', '<i class="fas fa-plus-circle"></i> Add Modifier');
        dataFieldSection += '<div class="hideOnLoadLimitOption"><div class="horizontalFlex">';
        dataFieldSection += '</div></div>'; //END hideOnLoadLimitOption


    dataFieldSection += '</fieldSet>';

    return dataFieldSection;
}

/**
 *
 * input column type:
 *    discrete 
 *           section for non equal values
 *           section for equal values
 *    
 *
 * @function generateNumberDiscreteLimitInfoHTML
 * @param {array} sectionNumber -
 * @param {string} dataFieldValues -
 * @param {string} subSectionId -
 * @returns {string}
 */
function generateNumberDiscreteLimitInfoHTML(sectionNumber, dataFieldValues, subSectionId){
    //defaults must be defined for when the object is passed empty
    let nonEqual = {}
    let equal = {}
    let limits = dataFieldValues.limits
    if(limits != undefined && limits != '' && limits != null && dataFieldValues.data_type === 'decimal'){
        nonEqual = limits[0]
        equal = limits[1]
    }
    dataFieldSection = '<div class="numberFieldLimits">'
        dataFieldSection = '<div class="horizontalFlex">'
            dataFieldSection += '<div class="verticalFlex focusSubsection fieldSpace">'
                dataFieldSection += generateFieldGroupingInput( subSectionId+'_notEqualDiscreteInterpretation', 'Not Equal Interpretation:', 'text', 'notEqualDiscreteInterpretation', '', getDataValueFromObj(nonEqual, 'not_equal_interpretation', ''));
                // dataFieldSection += generateFieldGroupingTextArea(subSectionId+'_notEqualDiscreteWording', 'Not Equal Report Wording', 'reportWording notEqualDiscreteWording', '', unescapeNewlines(getDataValueFromObj(nonEqual, 'not_equal_wording', '')));
                dataFieldSection += generateFieldGroupingSelect(cssValuesOptions, getDataValueFromObj(nonEqual, 'not_equal_css', ''), 'notEqualDiscreteCSS', 'onChange="colorChange($(this))"', subSectionId+'_notEqualDiscreteCSS', 'Not Equal Style:');
            dataFieldSection += '</div>' 
            dataFieldSection += '<div class="verticalFlex focusSubsection">'        
                dataFieldSection += generateFieldGroupingInput(subSectionId+'_discrete', 'Equal Value:', 'number', 'discrete required', 'data-parsley-required="true" step="any" ', getDataValueFromObj(equal, 'discrete_limit', ''))
                dataFieldSection += generateFieldGroupingInput( subSectionId+'_equalDiscreteInterpretation', 'Equal Interpretation:', 'text', 'equalDiscreteInterpretation', '', getDataValueFromObj(equal, 'equal_interpretation', ''));
                // dataFieldSection += generateFieldGroupingTextArea(subSectionId+'_equalDiscreteWording', 'Equal Report Wording', 'reportWording equalDiscreteWording', '', unescapeNewlines(getDataValueFromObj(equal, 'equal_wording', '')));
                dataFieldSection += generateFieldGroupingSelect(cssValuesOptions, getDataValueFromObj(equal, 'equal_css', ''), 'equalDiscreteCSS', 'onChange="colorChange($(this))"', subSectionId+'_equalDiscreteCSS', 'Equal Style:');
            dataFieldSection += '</div>' 
        dataFieldSection += '</div>'
    dataFieldSection += '</div>'
    return dataFieldSection;
}

/**
 *
 * input column type:
 *    Define threshold (need lower and upper value to be equal, discrete left NULL (on submit the threshold field will populate the min and max value fields in the db.))
 *    
 *
 * @function generateNumberThresholdLimitInfoHTML
 * @param {array} sectionNumber -
 * @param {string} dataFieldValues -
 * @param {string} subSectionId -
 * @returns {string}
 */
function generateNumberThresholdLimitInfoHTML(sectionNumber, dataFieldValues, subSectionId){
    dataFieldSection = '<div class="numberFieldLimits">';
        dataFieldSection += '<div class="verticalFlex">';
            dataFieldSection += generateFieldGroupingInput(subSectionId+'_threshold', 'Threshold:', 'number', 'threshold required numberType', 'data-parsley-required="true" step="any" ', getDataValueFromObj(dataFieldValues.limits, 'threshold_limit', ''));
        dataFieldSection += '</div>'

        dataFieldSection += '<div class="horizontalFlex">';
            dataFieldSection += '<div class="verticalFlex focusSubsection">';
                dataFieldSection += generateFieldGroupingInput( subSectionId+'_belowThreshold', 'Below Threshold Interpretation:', 'text', 'belowThreshold', '', getDataValueFromObj(dataFieldValues.limits, 'below_threshold_interpretation', ''));
                // dataFieldSection += generateFieldGroupingTextArea(subSectionId+'_belowThresholdWording', 'Below Threshold Report Wording', 'reportWording belowThresholdWording', '', unescapeNewlines(getDataValueFromObj(dataFieldValues.limits, 'below_threshold_wording', '')));
                dataFieldSection += generateFieldGroupingSelect(cssValuesOptions, getDataValueFromObj(dataFieldValues.limits, 'below_threshold_css', ''), 'belowThresholdCSS', 'onChange="colorChange($(this))"', subSectionId+'_belowThresholdCSS', 'Below Threshold Style:');
            dataFieldSection += '</div>'
            dataFieldSection += '<div class="verticalFlex focusSubsection">';
                dataFieldSection += generateFieldGroupingInput( subSectionId+'_equalThreshold', 'Equal Threshold Interpretation:', 'text', 'equalThreshold', '', getDataValueFromObj(dataFieldValues.limits, 'equal_threshold_interpretation', ''));
                // dataFieldSection += generateFieldGroupingTextArea(subSectionId+'_equalThresholdWording', 'Equal Threshold Report Wording', 'reportWording equalThresholdWording', '', unescapeNewlines(getDataValueFromObj(dataFieldValues.limits, 'equal_threshold_wording', '')));
                dataFieldSection += generateFieldGroupingSelect(cssValuesOptions, getDataValueFromObj(dataFieldValues.limits, 'equal_threshold_css', ''), 'equalThresholdCSS', 'onChange="colorChange($(this))"', subSectionId+'_equalThresholdCSS', 'Equal Threshold Style:');
            dataFieldSection += '</div>'
            dataFieldSection += '<div class="verticalFlex focusSubsection">';
                dataFieldSection += generateFieldGroupingInput( subSectionId+'_aboveThreshold', 'Above Threshold Interpretation:', 'text', 'aboveThreshold', '', getDataValueFromObj(dataFieldValues.limits, 'above_threshold_interpretation', '') );
                // dataFieldSection += generateFieldGroupingTextArea(subSectionId+'_aboveThresholdWording', 'Above Threshold Report Wording', 'reportWording aboveThresholdWording', '', unescapeNewlines(getDataValueFromObj(dataFieldValues.limits, 'above_threshold_wording', '')));
                dataFieldSection += generateFieldGroupingSelect(cssValuesOptions, getDataValueFromObj(dataFieldValues.limits, 'above_threshold_css', ''), 'aboveThresholdCSS', 'onChange="colorChange($(this))"', subSectionId+'_aboveThresholdCSS', 'Above Threshold Style:');
            dataFieldSection += '</div>'        
        dataFieldSection += '</div>'
    dataFieldSection += '</div>' 

    return dataFieldSection;
}

/**
 *
 * input column type:
 *  Range: need lower and upper, discrete left NULL
 *                             Validate that Minimum value is less than Maximum value (this will happen on submit)
 *               
 *
 * @function generateNumberRangeLimitInfoHTML
 * @param {array} sectionNumber -
 * @param {string} dataFieldValues -
 * @param {string} subSectionId -
 * @returns {string}
 */
function generateNumberRangeLimitInfoHTML(sectionNumber, dataFieldValues, subSectionId){
    dataFieldSection = '<div class="numberFieldLimits">';
        dataFieldSection += '<div class="verticalFlex">';
            dataFieldSection += '<div class="horizontalFlex">';
                dataFieldSection += generateFieldGroupingInput(subSectionId+'_minLimit', 'Lower Limit:', 'number', 'minLimit required numberType', 'data-parsley-required="true" onBlur="checkMinLessMax($(this))"  step="any"', getDataValueFromObj(dataFieldValues.limits, 'lower_limit', ''));
                dataFieldSection += generateFieldGroupingInput(subSectionId+'_maxLimit', 'Upper Limit:', 'number', 'maxLimit required numberType', 'data-parsley-required="true" onBlur="checkMinLessMax($(this))" step="any"', getDataValueFromObj(dataFieldValues.limits, 'upper_limit', ''));

            dataFieldSection += '</div>'
            dataFieldSection += '<div class="horizontalFlex">';
                dataFieldSection += '<div class="verticalFlex focusSubsection">';
                    dataFieldSection += generateFieldGroupingInput( subSectionId+'_belowLowerResult', 'Below Lower Interpretation:', 'text',  'belowLowerResult', '', getDataValueFromObj(dataFieldValues.limits, 'below_lower_interpretation', ''));
                    // dataFieldSection += generateFieldGroupingTextArea(subSectionId+'_belowLowerWording', 'Below Lower Report Wording', 'reportWording belowLowerWording', '', unescapeNewlines(getDataValueFromObj(dataFieldValues.limits, 'below_lower_wording', '')));
                    dataFieldSection += generateFieldGroupingSelect(cssValuesOptions, getDataValueFromObj(dataFieldValues.limits, 'below_lower_css', ''), 'belowLowerCSS', 'onChange="colorChange($(this))"', subSectionId+'_belowLowerCSS', 'Below Lower Style:');
                dataFieldSection += '</div>'
                dataFieldSection += '<div class="verticalFlex focusSubsection">';
                    dataFieldSection += generateFieldGroupingInput( subSectionId+'_equalLowerResult', 'Equal Lower Interpretation:', 'text', 'equalLowerResult', '', getDataValueFromObj(dataFieldValues.limits, 'equal_lower_interpretation', '') );
                    // dataFieldSection += generateFieldGroupingTextArea(subSectionId+'_equalLowerWording', 'Equal Lower Report Wording', 'reportWording equalLowerWording', '', unescapeNewlines(getDataValueFromObj(dataFieldValues.limits, 'equal_lower_wording', '')));
                    dataFieldSection += generateFieldGroupingSelect(cssValuesOptions, getDataValueFromObj(dataFieldValues.limits, 'equal_lower_css', ''), 'equalLowerCSS', 'onChange="colorChange($(this))"', subSectionId+'_equalLowerCSS', 'Equal Lower Style:');
                dataFieldSection += '</div>'
                dataFieldSection += '<div class="verticalFlex focusSubsection">';
                    dataFieldSection += generateFieldGroupingInput( subSectionId+'_betweenLowerUpperResult','In Range Interpretation:', 'text', 'betweenLowerUpperResult', '', getDataValueFromObj(dataFieldValues.limits, 'in_range_interpretation', '') );
                    // dataFieldSection += generateFieldGroupingTextArea(subSectionId+'_betweenLowerUpperWording', 'In Range Wording', 'reportWording betweenLowerUpperWording', '', unescapeNewlines(getDataValueFromObj(dataFieldValues.limits, 'in_range_wording', '')));
                    dataFieldSection += generateFieldGroupingSelect(cssValuesOptions, getDataValueFromObj(dataFieldValues.limits, 'in_range_css', ''), 'betweenLowerUpperCSS', 'onChange="colorChange($(this))"', subSectionId+'_betweenLowerUpperCSS', 'In Range Style');
                dataFieldSection += '</div>'
                dataFieldSection += '<div class="verticalFlex focusSubsection">';
                    dataFieldSection += generateFieldGroupingInput( subSectionId+'_equalUpperResult', 'Equal Upper Interpretation:', 'text', 'equalUpperResult', '', getDataValueFromObj(dataFieldValues.limits, 'equal_upper_interpretation', '') );
                    // dataFieldSection += generateFieldGroupingTextArea(subSectionId+'_equalUpperWording', 'Equal Upper Report Wording', 'reportWording equalUpperWording', '', unescapeNewlines(getDataValueFromObj(dataFieldValues.limits, 'equal_upper_wording', '')));
                    dataFieldSection += generateFieldGroupingSelect(cssValuesOptions, getDataValueFromObj(dataFieldValues.limits, 'equal_upper_css', ''), 'equalUpperCSS', 'onChange="colorChange($(this))"', subSectionId+'_equalUpperCSS', 'Equal Upper Style:');
                dataFieldSection += '</div>'
                dataFieldSection += '<div class="verticalFlex focusSubsection">';
                    dataFieldSection += generateFieldGroupingInput( subSectionId+'_aboveUpperResult', 'Above Upper Interpretation:', 'text', 'aboveUpperResult', '', getDataValueFromObj(dataFieldValues.limits, 'above_upper_interpretation', '') );
                    // dataFieldSection += generateFieldGroupingTextArea(subSectionId+'_aboveUpperWording', 'Above Upper Report Wording', 'reportWording aboveUpperWording', '', unescapeNewlines(getDataValueFromObj(dataFieldValues.limits, 'above_upper_wording', '')));
                    dataFieldSection += generateFieldGroupingSelect(cssValuesOptions, getDataValueFromObj(dataFieldValues.limits, 'above_upper_css', ''), 'aboveUpperCSS', 'onChange="colorChange($(this))"', subSectionId+'_aboveUpperCSS', 'Above Upper Style:');
                dataFieldSection += '</div>'
            dataFieldSection += '</div>'
        dataFieldSection += '</div>'
    dataFieldSection += '</div>' //END number 

    return dataFieldSection;
}

/**
 *
 * input column type:
 *    discrete text field: 
 *    generate fields dynamically for all items in obj
 *
 * @function generateFieldLimitsDiscrete
 * @param {array} sectionNumber -
 * @param {string} dataFieldValues -
 * @param {string} subSectionId -
 * @returns {string}
 */
function generateFieldLimitsDiscrete(sectionNumber, dataFieldValues, subSectionId){
    // defaults must be defined for when the object is passed empty
    let nonEqual = {}
    let equalArr = [{}]

    if(dataFieldValues.limits != undefined && dataFieldValues.limits != '' && dataFieldValues.limits != null && dataFieldValues.data_type === 'varchar'){
        nonEqual = dataFieldValues.limits[0]
        equalArr = (dataFieldValues.limits).filter(function(item, i){
            if(i != 0){
                return item
            }
        })
    }
    dataFieldSection = '<div class="fieldLimits horizontalFlex" >';
        // dataFieldSection = '<div class= horizontalFlex>';

        // pass in the first element in the limits array
        dataFieldSection += generateNotEqualLimitHTML(sectionNumber, nonEqual, subSectionId);
        
        // loop through the rest of the array and generate the equal limit fields
        equalArr.forEach(function(item, i){
            dataFieldSection += generateEqualLimitHTML(sectionNumber, i + 1, item, subSectionId);
        })

        // dataFieldSection += '</div>';
    dataFieldSection += '</div>';
    return dataFieldSection;
}

/**
 *
 * input column type:
 *    discrete text field: 
 *        generate fields dynamically for not equal field information
 *
 * @function generateNotEqualLimitHTML
 * @param {array} sectionNumber -
 * @param {string} dataFieldValues -
 * @param {string} subSectionId -
 * @returns {string}
 */
function generateNotEqualLimitHTML(sectionNumber, dataFieldValues, subSectionId){
    dataFieldSection = '<div class="verticalFlex focusSubsection fieldSpace">';
        dataFieldSection += generateFieldGroupingInput( subSectionId+'_notEqualDiscreteInterpretation', 'Not Equal Interpretation:', 'text', 'notEqualDiscreteInterpretation inputCheck', 'oninput="isDiscreteRequired($(this))"', getDataValueFromObj(dataFieldValues, 'not_equal_interpretation', ''));
        // dataFieldSection += generateFieldGroupingTextArea(subSectionId+'_notEqualDiscreteWording', 'Not Equal Report Wording', 'reportWording notEqualDiscreteWording inputCheck', 'oninput="isDiscreteRequired($(this))"', unescapeNewlines(getDataValueFromObj(dataFieldValues, 'not_equal_wording', '')));
        dataFieldSection += generateFieldGroupingSelect(cssValuesOptions, getDataValueFromObj(dataFieldValues, 'not_equal_css', ''), 'notEqualDiscreteCSS inputCheck', 'onChange="colorChange($(this))" oninput="isDiscreteRequired($(this))"', subSectionId+'_notEqualDiscreteCSS', 'Not Equal Style:');
    dataFieldSection += '</div>';

    return dataFieldSection;
}

/**
 *
 * input column type:
 *    discrete text field: 
 *        generate fields dynamically for equal limits field information
 *
 * @function generateEqualLimitHTML
 * @param {array} sectionNumber -
 * @param {string} dataFieldValues -
 * @param {string} subSectionId -
 * @returns {string}
 */
function generateEqualLimitHTML(sectionNumber, counter, dataFieldValues, subSectionId){
    additonalAttributes = '';
    if(counter === 1){
        additonalAttributes = 'oninput="isDiscreteRequired($(this))"'
    }

    dataFieldSection = '<div class="discreteEqual focusSubsection verticalFlex" data-equalCounter='+counter+' >';
        dataFieldSection += generateFieldGroupingInput(subSectionId+'_discrete_'+counter, 'Equal Value:', 'text', 'discrete', '', getDataValueFromObj(dataFieldValues, 'discrete_limit', ''))
        dataFieldSection += generateFieldGroupingInput( subSectionId+'_equalDiscreteInterpretation_'+counter, 'Equal Interpretation:', 'text', 'equalDiscreteInterpretation inputCheck', additonalAttributes, getDataValueFromObj(dataFieldValues, 'equal_interpretation', ''));
        // dataFieldSection += generateFieldGroupingTextArea(subSectionId+'_equalDiscreteWording_'+counter, 'Equal Report Wording', 'reportWording equalDiscreteWording inputCheck', additonalAttributes, unescapeNewlines(getDataValueFromObj(dataFieldValues, 'equal_wording', '')));
        dataFieldSection += generateFieldGroupingSelect(cssValuesOptions, getDataValueFromObj(dataFieldValues, 'equal_css', ''), 'equalDiscreteCSS inputCheck', 'onChange="colorChange($(this))"' + additonalAttributes, subSectionId+'_equalDiscreteCSS_'+counter, 'Equal Style:');
        if(counter > 1){
            dataFieldSection += '<div id="'+subSectionId+'_deleteSection_discrete_'+counter+'" class="deleteDiscreteSectionBtnDiv button" onclick="deleteDiscreteSection($(this))">';
                dataFieldSection += '<i class="far fa-times-circle"></i> Remove'
            dataFieldSection += '</div>'
        }
    dataFieldSection += '</div>';


    return dataFieldSection;
}

/**
 *
 * input column type:
 *    datetime: 
 *        not currently used but will be needed later
 *
 * @function generateDateSubsectionInput
 * @param {array} sectionNumber -
 * @param {string} dataFieldValues -
 * @param {string} subSectionId -
 * @returns {string}
 */
function generateDateSubsectionInput(sectionNumber, dataFieldValues, subSectionId){
    let selectTypeAdditonalAttributes = '';
    let dataFieldSection = generateFieldGroupingSelect(dateTimeFormatArr, getDataValueFromObj(dataFieldValues, 'dateTimeFormat', ''), 'dateTimeFormat', selectTypeAdditonalAttributes, subSectionId+'_dateTimeFormat', 'Date Time Format:')
    return dataFieldSection;
}


/**
 * 
 * input column type:
 *
 * Generates individual subsection fields within the modifier section 
 * @function generateModifierFieldsHTML
 * @param {array} sectionNumber -
 * @param {string} dataFieldValues -
 * @returns {string}
 */
function generateModifierFieldsHTML(sectionNumber, modifierNumber, dataFieldValues = {}){

    //TODO: Add panel multiselect list populated by the panel_List options in the object returned.
    //TODO: Create new field grouping function for multiSelect

    let fieldDataTypeArr = [
                         {'value':'', 'display': ''}
                        ,{'value':'decimal', 'display': 'Numeric'}
                        ,{'value':'varchar', 'display': 'Text'}
                        ,{'value':'dateTime', 'display': 'Date Time'}
                        ,{'value':'image', 'display': 'Image'}
                    ];

                    
    if($('#associatedStepType').val() != diStep){
        fieldDataTypeArr = fieldDataTypeArr.filter(function( obj ) {
            return obj.value !== 'image';
        });
    }

    let modifierNumId = 'dataFieldSection'+sectionNumber+'_modifier'+modifierNumber;

    dataFieldSection = "<div id='"+modifierNumId+"' class='dataModifierFieldSection' data-sectionNumber='"+sectionNumber+"' data-modifierNumber='"+modifierNumber+"' data-originalObj='"+JSON.stringify(dataFieldValues)+"'>";
        dataFieldSection += '<div id="'+modifierNumId+'_deleteSection" class="deleteSectionBtnDiv button" onclick="deleteModifierSection($(this))"">';
            dataFieldSection += '<i class="far fa-times-circle"></i> Delete'
        dataFieldSection += '</div>'
        dataFieldSection += '<div class="alwaysShow"><span class="sectionTitle">Initialize Modifier Field Type</span><div class="horizontalFlex">'
            let fieldNameAdditonalAttributes = 'data-parsley-required="true" onBlur="checkNameUniqueNess($(this))"';
            dataFieldSection +=    generateFieldGroupingInput(modifierNumId+'_fieldName', 'Field Name:', 'text', 'fieldName required modifier', fieldNameAdditonalAttributes, getDataValueFromObj(dataFieldValues, 'field_name', ''));
            
            let tableFieldOrderAdditonalAttributes = 'data-parsley-required="true"  data-parsley-unique-mod-value="true" onBlur="checkModFieldOrder($(this))"';
            dataFieldSection +=    generateFieldGroupingInput(modifierNumId+'_tableFieldOrder', 'Order:', 'number', 'tableFieldOrder orderModCheck required modifier', tableFieldOrderAdditonalAttributes, getDataValueFromObj(dataFieldValues, 'field_order', ''));
            
            dataFieldSection +=    generateFieldGroupingSelectHidden(excelColumns, getDataValueFromObj(dataFieldValues, 'field_order', ''), 'columnSelect fieldColumn modifier', 'data-parsley-required="false"', modifierNumId+'_columnSelect', 'Column:');
            dataFieldSection +=    generateFieldGroupingInput(modifierNumId+'_resultCode', 'Result Code', 'text', 'resultCode modifier', '', getDataValueFromObj(dataFieldValues, 'result_code', ''));
            dataFieldSection += generateFieldGroupingSelect(reportOptions, getDataValueFromObj(dataFieldValues, 'report_option', ''), 'reportOption modifier', 'data-parsley-required="false"', modifierNumId+'_reportOption', 'Report:' );
        dataFieldSection += '</div></div>' //END alwaysShow

        dataFieldSection += '<div class="hideOnLoadDataOption modifier" style="display:none;"><span class="sectionTitle">Setup Data Type Properties</span><div class="horizontalFlex">'
            // load Data attribute
            let dataTypeAdditonalAttributes = 'data-parsley-required="true" onChange=displayDataTypeFields($(this));updateSelectValue($(this).attr("id"));';
            dataFieldSection +=    generateFieldGroupingSelect(fieldDataTypeArr, getDataValueFromObj(dataFieldValues, 'data_type', ''), 'dataType required modifier', dataTypeAdditonalAttributes, modifierNumId+'_dataType', 'Field Data Type:');

            let numberTypeAdditonalAttributes = 'onChange=displayNumberTypeFields($(this));updateSelectValue($(this).attr("id"));';
            dataFieldSection +=    generateFieldGroupingSelect(numericTypeOptionsArr, getDataValueFromObj(dataFieldValues, 'limit_type', ''), 'numberDataType numberType modifier', numberTypeAdditonalAttributes, modifierNumId+'_numberDataType', 'Limit Type:');

            // For number field user can define the number of significant figures up to 6.
            dataFieldSection +=    generateFieldGroupingInput(modifierNumId+'_sigFigs', 'Sig Figs:', 'number', 'sigFigs numberType numTypeTop modifier', 'max="6" min="0" ', getDataValueFromObj(dataFieldValues, 'sig_figs', ''));

            // For number field user can select units.
            let analysisString = $('#analysisUnitsText').val();
            var analysisStringObj = JSON.parse(analysisString);
            dataFieldSection +=    generateFieldGroupingSelect(analysisStringObj, getDataValueFromObj(dataFieldValues, 'units', ''), 'units modifier', '', modifierNumId+'_units', 'Units:');

            dataFieldSection += generateFieldGroupingDivButton('discreteAddSection'+sectionNumber, 'discreteAddSectionBtnDiv modifier', 'addDiscreteEqualSection($(this))', '<i class="fas fa-plus-circle"></i> Add Value');

        dataFieldSection += '</div></div>'//END hideOnLoadDataOption

        dataFieldSection += '<div class="hideOnLoadLimitOption modifier"><div class="horizontalFle">'
        dataFieldSection += '</div></div>' //END hideOnLoadLimitOption


    dataFieldSection += '</div>';

    // getStepName($('#associatedStepName').val());
    return dataFieldSection;
}


/*  This function will call displayDataTypeFields which itself will call displayNumberTypeFields
 *
 * @function displayFieldTypeFields
 * @param {object} element -
 */
function displayFieldTypeFields(element){

    $(element).closest('.dataFieldSection').find('.hideOnLoadDataOption').show();
    $(element).closest('.dataFieldSection').find('.dataType').closest('.fieldGrouping').show();
    displayDataTypeFields($(element).closest('.dataFieldSection').find('.dataType'))
}

function getSubSectionClass(element){
    let subSectionClass = '.dataFieldSection';

    if(element.hasClass('modifier')){
        subSectionClass = '.dataModifierFieldSection';
    }

    return subSectionClass
}

/*
 *  'decimal','text', 'dateTime'
 * This function will call displayNumberTypeFields
 *
 * @function displayDataTypeFields
 * @param {object} element -
 */
function displayDataTypeFields(element){
    let fieldTypeArrAll = ['.numberType','.units','.sigFigs'];
    let subSectionClass = getSubSectionClass(element);

    fieldTypeArrAll.forEach(function(item){
        $(element).closest(subSectionClass).find(item).closest('.fieldGrouping').hide();
    });

    $(element).closest(subSectionClass).find('.discreteAddSectionBtnDiv').hide();
    $(element).closest(subSectionClass).find('.addModifierSectionBtnDiv').hide();
    $(element).closest(subSectionClass).find('.modifierCounterDiv').hide();

    $(element).closest(subSectionClass).find('.reportOption').parent().show();
    $(element).closest(subSectionClass).find('.hideOnLoadModifyOption').html('');

    if($(element).val() === 'decimal'){
        $(element).closest(subSectionClass).find('.numberType').closest('.fieldGrouping').show();
        $(element).closest(subSectionClass).find('.units').closest('.fieldGrouping').show();
        addRequired(element, subSectionClass,'.sigFigs');

    } else if($(element).val() === 'varchar'){

        removeRequired(element, subSectionClass,'.numberDataType');
        removeRequired(element, subSectionClass,'.sigFigs');

        clearField(element, subSectionClass,'.numberDataType');
        clearField(element, subSectionClass,'.sigFigs');

        $(element).closest(subSectionClass).find('.units').closest('.fieldGrouping').show();
        $(element).closest(subSectionClass).find('.discreteAddSectionBtnDiv').show();

        let fieldTypeArrAll = ['.numberType','.sigFigs'];
        fieldTypeArrAll.forEach(function(item){
            $(element).closest(subSectionClass).find(item).closest('.fieldGrouping').hide();
        });

    } else if($(element).val() === 'dateTime'){

        removeRequired(element, subSectionClass, '.numberDataType');
        removeRequired(element, subSectionClass, '.sigFigs');

        clearField(element, subSectionClass,'.numberDataType');
        clearField(element, subSectionClass,'.sigFigs');


    }  else if($(element).val() === 'image'){

        removeRequired(element, subSectionClass, '.numberDataType');
        removeRequired(element, subSectionClass, '.sigFigs');

        clearField(element, subSectionClass,'.numberDataType');
        clearField(element, subSectionClass,'.sigFigs');


        $(element).closest(subSectionClass).find('.reportOption').val('report');
        $(element).closest(subSectionClass).find('.reportOption').parent().hide();

    } else if($(element).val() === 'grouping'){

        removeRequired(element, subSectionClass, '.numberDataType');
        removeRequired(element, subSectionClass, '.sigFigs');

        clearField(element, subSectionClass,'.numberDataType');
        clearField(element, subSectionClass,'.sigFigs');

        $(element).closest(subSectionClass).find('.addModifierSectionBtnDiv').show();

        let modifierCount = $(element).closest('.dataFieldSection').find('.hideOnLoadModifyOption').children().length
        $(element).closest('.dataFieldSection').find('.modifierCounter').html(modifierCount)

        $(element).closest(subSectionClass).find('.modifierCounterDiv').show();


    }   else {
        removeRequired(element, subSectionClass, '.numberDataType');
        removeRequired(element, subSectionClass, '.sigFigs');

        clearField(element, subSectionClass,'.numberDataType');
        clearField(element, subSectionClass,'.sigFigs');

    }

    displayNumberTypeFields($(element).closest(subSectionClass).find('.numberDataType'));
}


/**
 * 
 *
 * Range', 'Threshold', 'Discrete
 *
 * @function displayNumberTypeFields
 * @param {object} element -
 */
function displayNumberTypeFields(element){
    let subSectionClass = '.dataFieldSection';

    if(element.hasClass('modifier')){
        subSectionClass = '.dataModifierFieldSection';
    }

    let subSectionId = $(element).closest(subSectionClass).attr('id');
    let dataOrigObjStr = $(element).closest(subSectionClass).attr('data-originalObj');
    let dataOrigObj = JSON.parse(dataOrigObjStr);
    let currSectionNumber = $(element).closest(subSectionClass).attr('data-sectionNumber');
    let currentElementVal = $(element).val();
    let dataTypeElement = $(element).closest(subSectionClass).find('.dataType');
    let dataTypeElementSelected = $(dataTypeElement).val()

    if($(element).val() === 'range'){

        $(element).closest(subSectionClass).find('.hideOnLoadLimitOption').html('');
        $(element).closest(subSectionClass).find('.hideOnLoadLimitOption').html(generateNumberRangeLimitInfoHTML(currSectionNumber, dataOrigObj, subSectionId));

    } else if($(element).val() === 'threshold'){

        $(element).closest(subSectionClass).find('.hideOnLoadLimitOption').html('');
        $(element).closest(subSectionClass).find('.hideOnLoadLimitOption').html(generateNumberThresholdLimitInfoHTML(currSectionNumber, dataOrigObj, subSectionId));

    } else if($(element).val() === 'discrete'){

        $(element).closest(subSectionClass).find('.hideOnLoadLimitOption').html('');
        $(element).closest(subSectionClass).find('.hideOnLoadLimitOption').html(generateNumberDiscreteLimitInfoHTML(currSectionNumber, dataOrigObj, subSectionId));
        $(element).closest(subSectionClass).find('.discrete').attr('data-parsley-type','number');

    } else if($(dataTypeElement).val() === 'varchar'){

        $(element).closest(subSectionClass).find('.hideOnLoadLimitOption').html('');
        $(element).closest(subSectionClass).find('.hideOnLoadLimitOption').html(generateFieldLimitsDiscrete(currSectionNumber, dataOrigObj, subSectionId));


        $(element).closest(subSectionClass).find('.fieldLimits').attr('data-nextCounter', $(element).closest('.dataFieldSection').find('.fieldLimits').children().length)

        
        addRequired(element, subSectionClass, '.discrete');
        let discretEqualFields = $(element).closest(subSectionClass).find('.fieldLimits').find('.inputCheck')
        isDiscreteRequired(discretEqualFields);

    } else {
        $(element).closest(subSectionClass).find('.hideOnLoadLimitOption').html('');
    }

    let colorChangeArr = ['.equalDiscreteCSS','.notEqualDiscreteCSS','.belowLowerCSS','.equalLowerCSS','.betweenLowerUpperCSS','.equalUpperCSS','.aboveUpperCSS','.aboveThresholdCSS','.belowThresholdCSS','.equalThresholdCSS'];
    colorChangeArr.forEach(function(item){
        if($(item).length === 1){
            colorChange($(item));
        } else if($(item).length > 1){
            for(let i = 0; i < $(item).length; i++){
                colorChange($(item)[i])
            }
        }
    });

}

function loadSampleDataFields(){        
    // generate data fields if they exist based on jython data object onload
    var origConfigString = $("#fieldConfig").val()
    if(origConfigString != ""){
        var originalDataObj = JSON.parse(origConfigString);
        // loop through each field section to populate fields
        originalDataObj.sort(function (a, b) {
          return a.field_order - b.field_order;
        });
        originalDataObj.forEach(function(objItem){
            //Updating data_type to grouping for the context of this step
            //Needs to be varchar elsewhere for ease of data entry/retrieval
            if(objItem.definer_type === "detector"){
                objItem.data_type = "grouping"
            }
            numberOfDataFieldSections++;
            $("#dataFieldSectionsArea").append(generateAnalysisDataFields(numberOfDataFieldSections, objItem));
            displayFieldTypeFields($("#dataFieldSection" + numberOfDataFieldSections).find(".fieldName"),numberOfDataFieldSections, objItem);

            if(objItem.definer_type === "detector"){
                let curModifArr = objItem.modifiers
                // loop through each modifier field section
                
                curModifArr.sort(function (a, b) {
                  return a.field_order - b.field_order;
                });
                curModifArr.forEach(function(modifObj){
                    addModifierSection($("#dataFieldSection" + numberOfDataFieldSections).find(".fieldName"), modifObj)
                })
            }
        })
    }
}


/**
  * shows/hides panels field section 
  * @function showhidePanelField
 */
function showhidePanelField(){
    if($('#associatedStepType').val() != diStep){
        $('.dataFieldSection').find('.panelsOption').closest('.fieldGrouping').hide();
    } else {
        $('.dataFieldSection').find('.panelsOption').closest('.fieldGrouping').show();
    }
}


/**
  *
  * @function resetPanelSelect
  * @param {string} panelOptionClass
 */
function resetPanelSelect(panelOptionClass){
    let optionsArr = $.map(panelSelectArr ,function(option) {
        return '<option value="'+ option.value +'">' + option.display + '</option>';
    });
    $(panelOptionClass).empty();
    $(panelOptionClass).append(optionsArr.join(''));
}

/**
  * sets #associatedPanelsPerStep value based on the currently selected step
  *
  * @function getPanelsFromSelectedStep
  * @param selectedStep
  * @return ajax datastep
  *
**/
function getPanelsFromSelectedStep(selectedStep){
    let request = {
        stepName: "ajaxGetPanelsPerStep",
        selectedStep: selectedStep
    };

    return $.getJSON("uniflow?", request).done(function (data) {
        let panelNamesArr = data[0].ReturnedPanels;
        $("#associatedPanelsPerStep").val(panelNamesArr);
        $("#associatedPanelCodes").val(data[0].panelCodeList);
        setPanelSelectArr(data[0].panelList);

    })
}

/**
  * sets panelSelectArr 
  *
  * @function setPanelSelectArr
  * @param list
  *
**/
function setPanelSelectArr(list){
    let panelArr = [{'value':'', 'display': ''}]
    let listjson = list.replace(/{/g, "").replace(/"/g, "").split("},")
    if(listjson.length > 0){
        listjson.forEach( function(item, i) {
            let itemArr = item.replace(/{/g, "").replace(/}/g, "").split(",");
            let optionObj = {"value":"", "display": ""};
            itemArr.forEach( function(subItem, j) {
                let subItemArr = subItem.split(":");
                if(subItemArr[0].trim() === "value"){
                    optionObj.value = subItemArr[1].trim();
                } else if(subItemArr[0].trim() === "display"){
                    optionObj.display = subItemArr[1].trim();
                }
            })
            panelArr.push(optionObj)
        })
    }
    panelSelectArr = panelArr;
}


/**
 * takes object and passes data to generate the fields for the discrete equal section
 *
 * @function addDiscreteEqualSection
 * @param {object} element -
 */
function addDiscreteEqualSection(element) {
    let subSectionClass = '.dataFieldSection';
    if(element.hasClass('modifier')){
        subSectionClass = '.dataModifierFieldSection';
    }
    let sectionNum = $(element).closest(subSectionClass).attr('data-sectionNumber');
    let subSectionId = $(element).closest(subSectionClass).attr('id')
    let subSectionLen = parseInt($(element).closest(subSectionClass).find('.fieldLimits').attr('data-nextCounter'));
    $(element).closest(subSectionClass).find('.fieldLimits').append(generateEqualLimitHTML(sectionNum, subSectionLen, {}, subSectionId));
    addRequired(element, subSectionClass, '.discrete');
    $(element).closest(subSectionClass).find('.fieldLimits').attr('data-nextCounter', subSectionLen + 1);

}

/**
 * takes object and passes data to generate the fields for the modifier sub sections
 *
 * @function addModifierSection
 * @param {object} element -
 */
function addModifierSection(element, dataFieldValues = {}){
    let sectionNum = $(element).closest('.dataFieldSection').attr('data-sectionNumber');
    let modifierNumber = $(element).closest('.dataFieldSection').find('.hideOnLoadModifyOption').attr('data-modifierNumber');

    if(modifierNumber != undefined){
        modifierNumber = parseInt(modifierNumber);
    } else {
        modifierNumber = 1;
    }

    $(element).closest('.dataFieldSection').find('.hideOnLoadModifyOption').append(generateModifierFieldsHTML(sectionNum, modifierNumber, dataFieldValues));
    $(element).closest('.dataFieldSection').find('.hideOnLoadModifyOption').attr('data-modifierNumber', modifierNumber + 1);

    let modifierCount = $(element).closest('.dataFieldSection').find('.hideOnLoadModifyOption').children().length
    $(element).closest('.dataFieldSection').find('.modifierCounter').html(modifierCount)

    let newDataType = $('#dataFieldSection'+sectionNum+'_modifier'+modifierNumber).find('.dataType');
    $(newDataType).closest('.dataModifierFieldSection').find('.hideOnLoadDataOption').show();
    $(newDataType).closest('.dataModifierFieldSection').find('.dataType').closest('.fieldGrouping').show();
    makeRequired(newDataType);
    displayDataTypeFields($(newDataType));
}


/*
 *
 * @function deleteDiscreteSection
 */
function deleteDiscreteSection(element){
    // get first field element in the fieldLimits section to use to check if the discrete value should stay required or not.
    let notDiscreteItem = $(element).closest('.fieldLimits').children().first().find('.inputCheck')
    $(element).closest('.discreteEqual').remove();
    // call the discrete required check after field removal so the check can validate it should remove the required on the discrete field.
    isDiscreteRequired(notDiscreteItem);

}

/*
 *
 * @function deleteModifierSection
 */
function deleteModifierSection(element){
    let modifierCounter = $(element).closest('.dataFieldSection').find('.modifierCounter')
    let modifierArr = $(element).closest('.dataFieldSection').find('.hideOnLoadModifyOption')

  $(element).closest('.dataModifierFieldSection').remove();

    $(modifierCounter).html($(modifierArr).children().length)
}

/**
 *
 *
 * @function isDiscreteRequired
 * @param {object} element -
 */
function isDiscreteRequired(element){
    let modCheck = $(element).closest('.hideOnLoadLimitOption')
    let subSectionClass = '.dataFieldSection';
    if(modCheck.hasClass('modifier')){
        subSectionClass = '.dataModifierFieldSection';
    }

    let shouldRequire = false;
    let limitFieldsChildren = $(element).closest('.fieldLimits').children().first().find('.inputCheck');
    let discreteSection = $(element).closest('.fieldLimits').children().eq(1).find('.inputCheck');
    let combo = $.merge(limitFieldsChildren, discreteSection)

    for (var i = 0; i < combo.length; i++) {
        if(combo[i].value != ''){
            shouldRequire = true;
        }
    }
    if(shouldRequire){
        makeRequired($(element).closest('.fieldLimits').children().eq(1).find('.discrete'))
    } else if($(element).closest('.fieldLimits').children().length === 2){
        makeNotRequired($(element).closest('.fieldLimits').children().eq(1).find('.discrete'))
    }

}



/*
 *
 * @function checkNameUniqueNess
 * @param {object} element -
 */
function checkNameUniqueNess(element){
   var thisName = element.val();
   nameArray = []
   $(".fieldName").each(function(index) {
        nameArray.push($(this).val());
   });
   nameArray.splice($.inArray(element.val(), nameArray),1);
   if ($.inArray(thisName, nameArray) != -1) {
       element.siblings(".analysisWarningMessage").remove();
       element.parent().append("<div class='analysisWarningMessage'>That field name already exists.  Choose another name. </div>");
   }
   else { element.siblings(".analysisWarningMessage").remove(); }
}

