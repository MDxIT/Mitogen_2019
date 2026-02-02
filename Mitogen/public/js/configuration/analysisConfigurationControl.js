/**
 * When implementing controls call loadControlDataFields() in the document ready function
 * 
 * @author Wendy Goller
 * @version  3.1
 */


let numberOfDataControlFieldSections = 0;



function onloadControlEvents(){
    $('#btnCreateNewControlFieldSection').on('click', function(){
        numberOfDataControlFieldSections++;
        $('#dataControlFieldAddButtonSection').append(generateAnalysisDataFields(numberOfDataControlFieldSections, {}));

        // Once modifier and load data are added as fieldName options this line will need to be removed.
        displayFieldTypeFields($('#dataFieldSection'+ numberOfDataControlFieldSections).find('.fieldName'), numberOfDataControlFieldSections, {})

        if($('#associatedStepType').val() == uploadStep){
            ifFromInst();
        }
    });
}


function loadControlDataFields(){       
    // generate data fields if they exist based on jython data object onload
    var origConfigString = $("#fieldControlConfig").val()
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
            numberOfDataControlFieldSections++;
            $('#dataControlFieldSectionsArea').append(generateAnalysisControlDataFields(numberOfDataControlFieldSections, objItem));
            // displayFieldTypeFields($('#dataControlFieldSection' + numberOfDataControlFieldSections).find(".fieldName"), numberOfDataControlFieldSections, objItem);

            // if(objItem.definer_type === "detector"){
            //     let curModifArr = objItem.modifiers
            //     // loop through each modifier field section
                
            //     curModifArr.sort(function (a, b) {
            //       return a.field_order - b.field_order;
            //     });
            //     curModifArr.forEach(function(modifObj){
            //         addModifierSection($("#dataControlFieldSection" + numberOfDataControlFieldSections).find(".fieldName"), modifObj)
            //     })
            // }
        })
    }
}



/**
 *
 * @function generateAnalysisControlDataFields
 * @param {string} sectionNumber -
 * @param {object} dataFieldValues -
 * @returns {string}
 */
function generateAnalysisControlDataFields(sectionNumber, dataFieldValues){

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


    let dataFieldSection =  '';
    dataFieldSection += "<fieldSet id='dataControlFieldSection"+sectionNumber+"' class='dataControlFieldSection focusSection' data-sectionNumber='"+sectionNumber+"' data-originalObj='"+JSON.stringify(dataFieldValues)+"'>";
        dataFieldSection += '<div id="deleteSection'+sectionNumber+'" onclick=deleteSection("#dataControlFieldSection'+sectionNumber+'") class="deleteSectionBtnDiv button">';
            dataFieldSection +=   '<i class="far fa-times-circle"></i> Delete Field'
        dataFieldSection += '</div>';
        dataFieldSection += '<div class="alwaysShow"><span class="sectionTitle">Initialize Field Type</span><div class="horizontalFlex">';
            let fieldNameAdditonalAttributes = 'data-parsley-required="true" onBlur="checkNameUniqueNess($(this))"';
            dataFieldSection += generateFieldGroupingInput('dataControlFieldSection'+sectionNumber+'_fieldName', 'Field Name:', 'text', 'fieldName readonly', fieldNameAdditonalAttributes, getDataValueFromObj(dataFieldValues, 'field_name', ''));
            
            let tableFieldOrderAdditonalAttributes = '';
            dataFieldSection += generateFieldGroupingInput('dataControlFieldSection'+sectionNumber+'_tableFieldOrder', 'Order:', 'number', 'tableFieldOrder orderCheck readonly', tableFieldOrderAdditonalAttributes, getDataValueFromObj(dataFieldValues, 'field_order', ''));
            
            dataFieldSection += generateFieldGroupingSelectHidden(excelColumns, getDataValueFromObj(dataFieldValues, 'field_order', ''), 'columnSelect fieldColumn', 'data-parsley-required="false"', 'dataControlFieldSection'+sectionNumber+'_columnSelect', 'Column:');
            dataFieldSection += generateFieldGroupingInput('dataControlFieldSection'+sectionNumber+'_resultCode', 'Result Code', 'text', 'resultCode', '', getDataValueFromObj(dataFieldValues, 'result_code', ''));
            dataFieldSection += generateFieldGroupingSelect(reportOptions, getDataValueFromObj(dataFieldValues, 'report_option', ''), 'reportOption', 'data-parsley-required="false"', 'dataControlFieldSection'+sectionNumber+'_reportOption', 'Report:' );
        dataFieldSection += '</div></div>'; //END alwaysShow

        dataFieldSection += '<div class="hideOnLoadDataOption" style="display:none;"><span class="sectionTitle">Setup Data Type Properties</span><div class="horizontalFlex">';
            // load Data attribute
            let dataTypeAdditonalAttributes = 'data-parsley-required="true" onChange=displayDataTypeFields($(this));updateSelectValue($(this).attr("id"));';
            dataFieldSection += generateFieldGroupingSelect(fieldDataTypeArr, getDataValueFromObj(dataFieldValues, 'data_type', ''), 'dataType required', dataTypeAdditonalAttributes, 'dataControlFieldSection'+sectionNumber+'_dataType', 'Field Data Type:');

            let numberTypeAdditonalAttributes = "onChange=displayNumberTypeFields($(this));updateSelectValue($(this).attr('id'), 'dataControlFieldSection');";
            dataFieldSection += generateFieldGroupingSelect(numericTypeOptionsArr, getDataValueFromObj(dataFieldValues, 'limit_type', ''), 'numberDataType numberType', numberTypeAdditonalAttributes, 'dataControlFieldSection'+sectionNumber+'_numberDataType', 'Limit Type:');

            // For number field user can define the number of significant figures up to 6.
            dataFieldSection += generateFieldGroupingInput('dataControlFieldSection'+sectionNumber+'_sigFigs', 'Sig Figs:', 'number', 'sigFigs numberType numTypeTop', 'max="6" min="0" ', getDataValueFromObj(dataFieldValues, 'sig_figs', ''));

            // For number field user can select units.

            let analysisString = $('#analysisUnitsText').val();
            var analysisStringObj = JSON.parse(analysisString);

            dataFieldSection += generateFieldGroupingSelect(analysisStringObj, getDataValueFromObj(dataFieldValues, 'units', ''), 'units', '', 'dataControlFieldSection'+sectionNumber+'_units', 'Units:');

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

