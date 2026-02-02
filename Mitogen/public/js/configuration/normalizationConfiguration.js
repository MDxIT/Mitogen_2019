
/**
  *
  *
  *
  *
  *
**/

// Following global variables must be a stepName from protocolSteps table
var normalizationStep = 'Sample: Normalization/Normalisation'
var serialDiltionStep = 'Sample: Serial Dilution'
var seriesDilutionStep = 'Sample: Series Dilution'

$(document).ready(function() {

  //Form 0 document.ready
  if($('input[name="formNumber"]').val() === '0' ){
    $('#tabs').tabs();
    $('#stepFormSubmitButton').remove();

    $('#btnCreateNewNormalizationMethod').on('click', function(e){
      var win = window.open("/uniflow?lastForm=Y&stepName=Normalization Configuration&templateId=newMethod","_self");
    });

    $('#analysisMethodsActiveTable tbody').on('click', '.editRow',function(){
        let parent = $(this).parent().siblings().children('.templateId');
        let templateId = parent.val();
        let win = window.open("/uniflow?lastForm=Y&stepName=Normalization Configuration&templateId=" + templateId, "_self");
    });

    $('#analysisMethodsInactiveTable tbody').on('click', '.editRow',function(){
        let parent = $(this).parent().siblings().children('.templateId');
        let templateId = parent.val();
        let win = window.open("/uniflow?lastForm=Y&stepName=Normalization Configuration&templateId=" + templateId, "_self");
    });

    hideColumns('#analysisMethodsActiveTable', 'hide');
    hideTableIfEmpty('#analysisMethodsActiveTable');
    hideColumns('#analysisMethodsInactiveTable', 'hide');
    hideTableIfEmpty('#analysisMethodsInactiveTable');

    $('.methodName').parent().append('<a class="editRow" href="#" ><i class="fas fa-edit" aria-hidden="true" ></i></a>');

  } 

  //Form 1
  else {
    $('#configOptions').hide();
    $( document ).tooltip();

    $( document ).on( 'change', '.prevData_checkbox', function() {
      $('.prevData_checkbox').not(this).prop('checked', false); 
    });


    templateNumbering();

    getPanelsFromSelectedStep($('#associatedStepName').val());

    getStepName($('#associatedStepName').val());

    let templateVersion = $('#methodVersionId').val();


    // Retreive previously saved data
    getPrevData(templateVersion, 'ajaxGetPrevLoadData', '#previousLoadData');

    $('#thresholdValue').change( function() {
      if ( $(this).val() < 0 ){
        createSimpleModal('modal', 'Threshold needs to be a positive number.', 'Threshold is negative');
        $(this).val('');
      }
      if ( isNaN($(this).val()) ){
        createSimpleModal('modal', 'Threshold needs to be a number.', 'Threshold is not a number');
        $(this).val('');
      }
    });


    /* Load Data type and attribute changes after ajax table load */
    $(document).ajaxStop(function(){

      var prevLoadDataJson = createJSONObject('#previousLoadData');

      $($('.prevDataDefId').get().reverse()).each(function(){

         for(data in prevLoadDataJson){
          if($(this).val() == prevLoadDataJson[data].id){
            moveCheckedToTop($(this));
            $(this).parents().siblings().children('.prevData_checkbox').prop('checked',true);
          }
         }
      });


      hideColumns('#loadDataTable', 'hiddenColumn');


      $('#associatedStepName').on('change', function(){
        getStepName($(this).val());
      });
      $('#configOptions').show();
      $('#loadingProgress').hide();

    }); // END AJAX LOAD

    $('#templateActive').on('change', function(){
      let templateActive = $(this).val();
      templateActive.trim();

      if(templateActive == 0 && $('#associatedStepName').val() != ''){
          $('#associatedStepName').siblings(".analysisWarningMessage").remove();
          $('#associatedStepName').parent().append("<div class='analysisWarningMessage'>Associated step must be cleared when template is inactive.</div>");
      } else {
          $('#associatedStepName').siblings(".analysisWarningMessage").remove();
      }
    });

    $('#associatedStepName').on('change', function(){
      getPanelsFromSelectedStep($(this).val());
      if($('#templateActive').val() == 0 && $('#associatedStepName').val() != ''){
          $('#associatedStepName').siblings(".analysisWarningMessage").remove();
          $('#associatedStepName').parent().append("<div class='analysisWarningMessage'>Associated step must be cleared when template is inactive.</div>");
      } else {
          $('#associatedStepName').siblings(".analysisWarningMessage").remove();
          // showTables();
          getStepName($(this).val());
      }


    });

    showTables();

    $('#templateName').on('change', function(){
      let templateName = $(this).val();
      templateName.trim();

      let templateId = $('#templateNameId').val();
      templateId.trim();

      if(/'/.test(templateName) || /"/.test(templateName)){
          $('#templateName').siblings(".analysisWarningMessage").remove();
          $('#templateName').parent().append("<div class='analysisWarningMessage'>Remove special characters from template name.</div>");
      }

      let postData = {
        "templateName": templateName,
        "templateId": templateId,
        "stepName": "ajaxCheckAnalysisMethodTemplateName",
        "Submit": true,
        "formNumber": 0
      };
      $.post('/uniflow', postData).done(function (jqxhr, statusText) {
        console.log('statusText', statusText)
        let postHtml = $.parseHTML(jqxhr);
        let postError = checkPostError(postHtml);
        // give a modal saying "Template name already exists.  Choose another name."
        if (postError !== false) {
          $('#modal').html('')
          $('#modal').html('Template name already exists.  Choose another name.')
          let errorDialog = initCenterAlertModal('modal', 'Error', true, 200, 300)
          errorDialog.dialog('open');
          $('#templateName').val('');
        } else {
        }
      }).fail(function (jqxhr, textStatus, error) {
        let err = "Request Failed: " + textStatus + ", " + error;
        console.log(err);
        $('#modal').html('')
        $('#modal').html(err)
        let errorDialog = initCenterAlertModal('modal', 'Error', true, 200, 300)
        errorDialog.dialog('open');
      });
    });


    $('#stepFormSubmitButton').on('click', function(e){
      e.preventDefault();
      let form = $('[name="stepForm"]');
      let allowSubmit = true;

      if (form.parsley().isValid()) {

        let activeTemplate = $('#templateActive').val();

        let templateName = $('#templateName').val();
        templateName.trim();

        let templateDescription = $('#templateDescription').val();
        templateDescription.trim();

        if(/'/.test(templateName) || /"/.test(templateName)) {
          $('#templateName').siblings(".analysisWarningMessage").remove();
          $('#templateName').parent().append("<div class='analysisWarningMessage'>Remove special characters from template name. </div>");
          allowSubmit = false;
          return;
        } else {
          $('#templateName').siblings(".analysisWarningMessage").remove();
        }

        if(activeTemplate == 0 && $('#associatedStepName').val() != ''){
          $('#associatedStepName').siblings(".analysisWarningMessage").remove();
          $('#associatedStepName').parent().append("<div class='analysisWarningMessage'>Associated step must be cleared when template is inactive.</div>");
          allowSubmit = false;
          return;
        } else {
          $('#associatedStepName').siblings(".analysisWarningMessage").remove();
        }

        if(/'/.test(templateDescription) || /"/.test(templateDescription)) {
          $('#templateDescription').siblings(".analysisWarningMessage").remove();
          $('#templateDescription').parent().append("<div class='analysisWarningMessage'>Remove special characters from template description. </div>");
          allowSubmit = false;
          return;
        } else {
          $('#templateDescription').siblings(".analysisWarningMessage").remove();
        }

        console.log('allowSubmit', allowSubmit)

        let previousDataArr = []

        $('.prevData_checkbox').each(function(){

          if($(this).is(':checked')){
            let stepVal = $(this).parents().siblings().children('.prevDataStepName').val();
            let fieldVal = $(this).parents().siblings().children('.prevDataFieldName').val();
            // let orderVal = $(this).parents().siblings().children('.prevData_order').val();
            let prevIdVal = $(this).parents().siblings().children('.prevDataDefId').val();
            let prevDataTypeVal = $(this).parents().siblings().children('.prevDataType').val();
            //let prevDefinerType = $(this).parents().siblings().children('.prevDefinerType').val();

            previousDataArr.push({
                "step": stepVal,
                "field": fieldVal,
                "id": prevIdVal,
                "type": prevDataTypeVal
            });
          }
        });

        var prevDataJsonString = JSON.stringify(previousDataArr);
        console.log('prevDataJsonString', prevDataJsonString);

        if(allowSubmit){
          let postData = {
              "stepName": "ajaxPostSaveNormalizationConfiguration",
              "Submit": true,
              "formNumber": 0,
              "templateName": templateName,
              "associatedStepName": $('#associatedStepName').val(),
              "templateDescription": templateDescription,
              "templateVersionNumber": $('#templateVersionNumber').val(),
              "templateNameId": $('#templateNameId').val(),
              "templateActive": $('#templateActive').val(),
              "previousTemplateVersionId": $('#methodVersionId').val(),
              "associatedPanelsPerStep": $('#associatedPanelsPerStep').val(),
              "thresholdValue": $('#thresholdValue').val(),
              "loadPreviousDataJson": prevDataJsonString
          };


          console.log('postData', postData)

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
              form.submit();
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


      } else {
        form.submit();
      }
    });
  }
});


/**
 *
 *
 * @function templateNumbering
 * Separated javascript which ran to set the numbering of new vs existing
 *   template numbers for the normalization method
 */
function templateNumbering() {

  // if this is a new template default the version number to 1.00
  if($('#templateVersionNumber').val() == '' || $('#templateVersionNumber').val() == undefined){
    $('#templateVersionNumber').val('1.00');
    $('#templateVersionNumberOrig').val('1.00'); // will be used for comparision on submit
    $("#versionNumber").text( $("#templateVersionNumber").val())
    $('#templateActive').val(1);
  } else {
    $('#templateVersionNumber').val(($('#templateVersionNumber').val()*1 +1) + '.00');
    $("#versionNumber").text( $("#templateVersionNumber").val())
  }
  $('#templateVersionNumber').prop('readonly', true);

  // if this is a new template populate the hidden field with the newMethod trigger.
  if($('#templateNameId').val() === ''){
    $('#templateNameId').val('newMethod');
  }

}


function templateChange(templateNameValue) {
  let templateName = templateNameValue;
  templateName.trim();

  let templateId = $('#templateNameId').val();
  templateId.trim();

  if(/'/.test(templateName) || /"/.test(templateName)){
      $('#templateName').siblings(".analysisWarningMessage").remove();
      $('#templateName').parent().append("<div class='analysisWarningMessage'>Remove special characters from template name.</div>");
  }

  let postData = {
    "templateName": templateName,
    "templateId": templateId,
    "stepName": "ajaxCheckAnalysisMethodTemplateName",
    "Submit": true,
    "formNumber": 0
  };
  $.post('/uniflow', postData).done(function (jqxhr, statusText) {
    console.log('statusText', statusText)
    let postHtml = $.parseHTML(jqxhr);
    let postError = checkPostError(postHtml);

    if (postError !== false) {
      $('#modal').html('')
      $('#modal').html('Template name already exists.  Choose another name.')
      let errorDialog = initCenterAlertModal('modal', 'Error', true, 200, 300)
      errorDialog.dialog('open');
      $('#templateName').val('');
    } else {
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
 *
 * @function compareAnalysisMethodLists
 * @param {string} a -
 * @param {string} b -
 * @returns {number}
 */
function compareAnalysisMethodLists(a, b) {
  const idA = a.analysisMethodsId
  const idB = b.analysisMethodsId
  const versionA = a.version
  const versionB = b.version

  let comparison = 0;
  if (idA > idB) {
    comparison = 1;
  } else if (idA < idB) {
    comparison = -1;
  } else if (idA === idB){
    if(versionA < versionB){
      comparison = 1;
    } else if(versionA > versionB){
      comparison = -1;
    }
  }
  return comparison;
}


/**
  *
  * Adds required class and sets parsley attr to true for a given identifier
  *
  * @function makeRequired
  * @param{string} identifier - class, id, etc
  *
**/
function makeRequired(identifier){
  $(identifier).addClass('required');
  $(identifier).attr('data-parsley-required','true');
}

/**
 *
 *
 * @function removeRequired
 * @param {object} element -
 * @param {string} theClass -
 */
function removeRequired(element, theClass){
    $(element).closest('.dataFieldSection').find(theClass).removeClass('required');
    $(element).closest('.dataFieldSection').find(theClass).attr('data-parsley-required','false');
    $(element).closest('.dataFieldSection').find(theClass).val("");
}

/**
  *
  * Removes required class and sets parsley attr to false for a given identifier
  *
  * @function makeNotRequired
  * @param{string} identifier - class, id, etc
  *
**/
function makeNotRequired(identifier){
  $(identifier).removeClass('required');
  $(identifier).attr('data-parsley-required','false');
}




/**
  * sets #associatedPanelsPerStep value based on the currently selected step
  *
  * @function getPanelsFromSelectedStep
  * @param selectedStep
  *
**/
function getPanelsFromSelectedStep(selectedStep){
  if(selectedStep.length > 0){
    let request = {
     stepName: 'ajaxGetPanelsPerStep',
     selectedStep: selectedStep
    };

    $.getJSON('uniflow?', request).done(function (data) {
      let panelNamesArr = data[0].ReturnedPanels;
      $("#associatedPanelsPerStep").val(panelNamesArr);
    })

  } else{
    $("#associatedPanelsPerStep").val('');
  }

}

/**
  * Sets #associatedStepType value to the non-configured step name(type?) based on selected step
  *   Hides/shows add new field button and specimen/location select element
  *
  * @function getStepName
  * @param selectedStep
  *
**/
function getStepName(selectedStep){
  if(selectedStep.length > 0){
    let request = {
      stepName: 'ajaxGetStepName',
      selectedStep: selectedStep
    };
    $.getJSON('uniflow?', request).done(function (data) {
      let step = data[0].stepType;
      showTables(step);
      ifNotToFromInst();

      $('#associatedStepType').val(step);
    })
  } else{
    $('#associatedStepType').val('');
     ifNotToFromInst();
  }
}




/**
  * Shows/hides: meta/load fiels sets
  * Loads meta/load tables
  *
  * @param{string} templateVersion - Template version
  * @param{string} ajaxStep - Ajax step name where the data is coming from
  * @param{string} dataVarId - Id of hidden variable to store the data (include '#')
  *
**/
function showTables(stepType){


  if($('#associatedStepName').val() != '' ){
    $('#loadField').show();
    loadPreviousData($('#associatedStepName').val(), 'normalization');
  }else{
    $('#loadField').hide();
    $('#prevDataTable').empty()
  }
}

/**
  *
  * Loads the Load Previous Data table to #prevDataTable or hides the fieldset
  *
  * @function loadPreviousData
  * @param selectedStep
  *
**/
function loadPreviousData(selectedStep, stepType){

  if(selectedStep.length > 0){
    let request = {
     stepName: 'ajaxGetPanelsPerStep',
     selectedStep: selectedStep
    };
    $.getJSON('uniflow?', request).done(function (data) {
      let panelCodesArr = data[0].panelCodes;
      if(panelCodesArr){
        $('#prevDataTable').load('/uniflow', {stepName: 'ajaxPrevNormalizationDataTable', associatedPanels: panelCodesArr, associatedStep: selectedStep});
      }else{
        $('#loadField').hide();
        $('#prevDataTable').empty()
      }
    })
  }
}


/**
  * Retreive previously saved data into a hidden variable
  * @param{string} templateVersion - Template version
  * @param{string} ajaxStep - Ajax step name where the data is coming from
  * @param{string} dataVarId - Id of hidden variable to store the data (include '#')
**/
function getPrevData(templateVersion, ajaxStep, dataVarId){

    let request = {
      stepName: ajaxStep,
      templateVerId: templateVersion
    };

    $.getJSON('uniflow?', request).done(function (data) {
      if(data.length > 0){
        let prevData = data[0].prevData;
        $(dataVarId).val(prevData);
      }
    });

}

/**
  * Create a JSON object using data in a field
  * @param{string} dataId - id, including '#', of the object holding the data you want to turn into a JSON object
  *
**/
function createJSONObject(dataId){

  let string = $(dataId).val();
  let splitThis = string.split(',');
  let splitString = []
  splitString.push('id,order');
  for(i in splitThis){
    let thisStr = splitThis[i].split('_');
    splitString.push(thisStr);
  }

  var headers = splitString[0].split(',');
  var jsonData = [];
  for(let thisIter = 1, len = splitString.length; thisIter < len; thisIter++ ){
    var row = splitString[thisIter];
    var thisObj = {};
    for(i in row){
      thisObj[headers[i]] = row[i];
    }
    jsonData.push(thisObj);
  }
  return jsonData;
}



/**
  *
  * Move the parent row of the attribute to the top of the list
  *   NOTE: Used with a comparison
  *     ex:
  *       if( attr.val() == thisValue)
  *         moveCheckedToTop(attr)
  *
  * @function moveCheckedToTop
  * @param{string} attr
  *   attribute of the value you are comparing
  *
**/
function moveCheckedToTop(attr){
  let row = attr.closest('tr');
  row.insertBefore(row.parent().find('tr:first-child'));
}



/**
  *
  * Runs Needed configurations for non-instrument steps
  *
  * @function ifNotToFromInst
  *
**/
function ifNotToFromInst(){
  // Show
  $('#dataFieldAddButtonSection').show()
  $('.tableFieldOrder').closest('div').show()
  $('.resultCode').closest('div').show()
  $('#dataFieldSectionsArea').show()
  // Hide
  $('.fieldColumn').closest('div').hide()
  $('.toInstColumns').hide()
  // Required
  makeRequired('.tableFieldOrder')
  // Not Required
  makeNotRequired('.columnSelect')
  // Other
  $('.toInstColumns').val('')
  $('.columnSelect').attr('data-parsley-column-order','false');

}

