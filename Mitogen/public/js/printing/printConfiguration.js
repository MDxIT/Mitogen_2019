
let printVariableGlobalObjArrOrig = [];
let printVariableGlobalObjArr = [];
let numberOfFieldSections = 0;

$(document).ready(function() {

  if($('input[name="formNumber"]').val() === '0' ){
    $('#stepFormSubmitButton').val('Create New');
  } else {
    console.log('docId',  $('#documentNameId').val())
    if(!$('#documentNameId').val()){
      $('#documentNameId').val('newDocument')
    }

    console.log('docId',  $('#documentNameId').val())
    let request = {
      stepName: 'ajaxGetDefinedPrintVariablesList',
      documentId: $('#documentNameId').val()
    };



    $.getJSON('uniflow?', request).done(function (data) {
      $('#printVariablesSection').html("");
      let dataActive = data.data;
      console.log("data", data);
      console.log("dataActive", dataActive);
      console.log("dataActive length", dataActive.length);


      printVariableGlobalObjArr = dataActive.slice(0);
      console.log('printVariableGlobalObjArr', printVariableGlobalObjArr)
      numberOfFieldSections = printVariableGlobalObjArr.length;

      for (let i = 0; i < printVariableGlobalObjArr.length; i++) {
        $('#printVariablesSection').append(generatePrintDataFields(i+1, printVariableGlobalObjArr[i]));
      }

    }).fail(function (jqxhr, textStatus, error) {
      let err = "Request Failed: " + textStatus + ", " + error;
      console.log(err);
      alert(err);
    });

    $('#addNewPrintTableRow').on('click', function(){
      numberOfFieldSections++;
      let newRowDefaults = {
        fieldSequence: numberOfFieldSections.toString(),
        fieldType: "Variable",
        fieldData: ""
      };
      printVariableGlobalObjArr.push(newRowDefaults)

      $('#printVariablesSection').append(generatePrintDataFields(numberOfFieldSections, newRowDefaults));

    });

    $('#stepFormSubmitButton').on('click', function(e){
      e.preventDefault();
      let form = $('[name="stepForm"]');
      let allowSubmit = true;

      let documentName = $('#documentName').val();
      documentName.trim();

      let printLanguage = $('#printLanguage').val();

      // if(/'/.test(templateName) || /"/.test(templateName)) {
      //   $('#templateName').siblings(".analysisWarningMessage").remove();
      //   $('#templateName').parent().append("<div class='analysisWarningMessage'>Remove special characters from template name. </div>");
      //   allowSubmit = false;
      //   return;
      // } else {
      //   $('#templateName').siblings(".analysisWarningMessage").remove();
      // }

      // if(activeTemplate == 0 && $('#associatedStepName').val() != ''){
      //   $('#associatedStepName').siblings(".analysisWarningMessage").remove();
      //   $('#associatedStepName').parent().append("<div class='analysisWarningMessage'>Associated step must be cleared when template is inactive.</div>");          
      //   allowSubmit = false;
      //   return;
      // } else {
      //   $('#associatedStepName').siblings(".analysisWarningMessage").remove();
      // }


      // $('.tableFieldOrder').each(function(i, item){
      //     let dupOrder = checkFieldOrder($(item));
      //    if(!dupOrder){
      //     allowSubmit = false;
      //     return;
      //    }
      // });


      let templateFieldsArr = []

      if($('.dataFieldSection').length > 0){

        $('.dataFieldSection').each(function () {
          let fieldSequence = $(this).find('.printFieldSequence').val();
          let fieldType = $(this).find('.fieldType').val();
          let fieldData = $(this).find('.fieldData').val();

          templateFieldsArr.push({
                "fieldSequence": fieldSequence,
                "fieldType": fieldType,
                "fieldData": fieldData
          });
        });
      }

      var documentFieldsJsonString = JSON.stringify(templateFieldsArr);
      console.log('allowSubmit', allowSubmit)

      if(allowSubmit){
        let postData = {
            "stepName": "ajaxPostSavePrintVariablesDefined",
            "Submit": true,
            "formNumber": 0,
            "documentNameId": $('#documentNameId').val(),
            "documentName": documentName,
            "documentIsEnabled": $('#documentIsEnabled').prop("checked"),
            "printerLanguage": printLanguage,
            "documentFieldsJson": documentFieldsJsonString
        };


        console.log('postData', postData)

        $.post('/uniflow', postData).done(function (jqxhr, statusText) {
          console.log('statusText', statusText)
          let postHtml = $.parseHTML(jqxhr);
          let postError = checkPostError(postHtml);
          if (postError !== false) {
            $('#modal').html('')
            $('#modal').html(postError)
            $('#modal').show();
            // let errorDialog = initCenterAlertModal('modal', 'Error', true, 200, 300)
            // errorDialog.dialog('open');
          } else {
            form.submit();
          }
        }).fail(function (jqxhr, textStatus, error) {
          let err = "Request Failed: " + textStatus + ", " + error;
          console.log(err);
          $('#modal').html('')
          $('#modal').html(err)
          $('#modal').show();
          // let errorDialog = initCenterAlertModal('modal', 'Error', true, 200, 300)
          // errorDialog.dialog('open');
        });
      }
    });
  }

});



/*
 *
 * @function deleteSection
 */
function deleteSection(sectionId){
  $(sectionId).remove();
  for (let i = 0; i < printVariableGlobalObjArr.length; i++) {
    console.log('sectionId', sectionId)
    console.log('printVariableGlobalObjArr[i].sequenceNumber', printVariableGlobalObjArr[i].fieldSequence)
    if(("#dataFieldSection" + printVariableGlobalObjArr[i].fieldSequence) === sectionId){
      printVariableGlobalObjArr.splice(i, 1);
    }
  }
  numberOfFieldSections--;
  // Sort the original data object returned by the ajax call
  printVariableGlobalObjArr.sort(compareSequenceValue);


  console.log('printVariableGlobalObjArr', printVariableGlobalObjArr)
  for (let i = 0; i < printVariableGlobalObjArr.length; i++) {
    let fieldSequenceOrig = printVariableGlobalObjArr[i].fieldSequence; 
    printVariableGlobalObjArr[i].fieldSequence = (i + 1).toString();
  }

  $('#printVariablesSection').html("");

  for (let i = 0; i < printVariableGlobalObjArr.length; i++) {
    $('#printVariablesSection').append(generatePrintDataFields(i+1, printVariableGlobalObjArr[i]));
  }

  console.log('printVariableGlobalObjArr', printVariableGlobalObjArr)
}


/*
 *
 * @function deleteSection
 */
function updateGlobalArray(element){
  console.log("element", element)
  let fieldType = $(element).parent().parent().find('.fieldType').val();
  let fieldData = $(element).parent().parent().find('.fieldData').val();
  let sequenceNumber = $(element).parent().parent().attr('data-origfieldsequence')
  for (let i = 0; i < printVariableGlobalObjArr.length; i++) {
    if(printVariableGlobalObjArr[i].fieldSequence === sequenceNumber){
      printVariableGlobalObjArr[i].fieldType = fieldType;
      printVariableGlobalObjArr[i].fieldData = fieldData;
    }
  }
}


/**
 * used for sorting sequence positions
 *
 * @function compareSequenceValue
 * @param {string} a -
 * @param {string} b -
 * @returns {number}
 */
function compareSequenceValue(a, b) {
  const idA = a.fieldSequence*1
  const idB = b.fieldSequence*1

  let comparison = 0;
  if (idA > idB) {
    comparison = 1;
  } else if (idA < idB) {
    comparison = -1;
  } 
  return comparison;
}




function generatePrintDataFields(sectionNumber, dataFieldValues){
    let fieldData = dataFieldValues.fieldData;
    let fieldType = dataFieldValues.fieldType;
    console.log('fieldData', fieldData)
    console.log('fieldType', fieldType)
    let sequenceNumber = dataFieldValues.fieldSequence;
    console.log('dataFieldValues', dataFieldValues);
    let dataFieldSection = '<div id="dataFieldSection'+sectionNumber+'" class="dataFieldSection" data-origFieldSequence="'+sequenceNumber+'" data-origFieldType="'+fieldType+'" data-origFieldData="'+ fieldData+'">';

    // let sequenceNumberAdditonalAttributes = 'onChange="updateGlobalArray($(this))"';
    let sequenceNumberAdditonalAttributes = 'readonly';
    dataFieldSection += generateFieldGroupingInput('dataFieldSection'+sectionNumber+'_printFieldSequence', 'Field Sequence:', 'text', 'printFieldSequence', sequenceNumberAdditonalAttributes, sequenceNumber);
  
    // dataFieldSection += '</div>'

    let fieldTypeAdditonalAttributes = 'onChange="updateGlobalArray($(this))"';
    dataFieldSection +=    generateFieldGroupingSelect(["Variable","Code"], fieldType, 'fieldType', fieldTypeAdditonalAttributes, 'dataFieldSection'+sectionNumber+'_fieldType', 'Field Type:');
  
    let fieldDataAdditonalAttributes = 'onBlur="updateGlobalArray($(this))"';
    dataFieldSection +=    generateFieldGroupingTextArea('dataFieldSection'+sectionNumber+'_fieldData', 'Field Data:', 'text', 'fieldData', fieldDataAdditonalAttributes, fieldData);
  
    dataFieldSection += '<div id="deleteSection'+sectionNumber+'" class="deleteSectionBtnDiv printFieldGrouping">';
    dataFieldSection += '<label class="deletePrintButtonLabel" for="">  </label>'
    dataFieldSection += '<input class="button deletePrintButton" type="button" onClick=deleteSection("#dataFieldSection'+sectionNumber+'") value="Delete Row" tabindex="1">'
    dataFieldSection += '</div>'

    dataFieldSection += '</div>';
    return dataFieldSection;
}




