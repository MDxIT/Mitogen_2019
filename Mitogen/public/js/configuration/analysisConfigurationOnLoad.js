/**
 * 
 * @author Wendy Goller
 * @version  3.1
 */



$(document).ready(function() {
    $('[name="stepForm"]').parsley();

    //Form 0 document.ready
    if($('input[name="formNumber"]').val() === '0' ){
        AjaxGetAnalysisMethodList()
        $('#tabs').tabs();
        $('#stepFormSubmitButton').remove();

        $('#btnCreateNewAnalysisMethod').on('click', function(e){
            var win = window.open("/uniflow?lastForm=Y&stepName=Analysis Method Configuration&templateId=newMethod","_self");
        })

    } else {
        $('#configOptions').hide();
        $( document ).tooltip();

        let templateVId = $('#methodVersionId').val();

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

        if(($('#associatedStepName').val()).length > 0){
            let promise = getPanelsFromSelectedStep($('#associatedStepName').val()).then(function(data){
                loadSampleDataFields();
                getStepName($('#associatedStepName').val(), true); // leave within promise callback
            }, function(reason){
                 console.log("error in processing your request", reason);
            });

        } else {
            $("#associatedPanelsPerStep").val('');
            $("#associatedPanelCodes").val('');
            loadSampleDataFields();
            getStepName($('#associatedStepName').val(), true);
        }


        if($('#associatedStepType').val() === downloadStep || $('#associatedStepType').val() === uploadStep){
            addParsleyColumnOrder('DUPLICATE');
        }

        addParsleyTableFieldOrder('DUPLICATE');
        addParsleyModifierOrder('DUPLICATE')

        onLoadEvents();
        onloadDataFieldEvents();

    }
});


function onLoadEvents(){
    $('#templateActive').on('change', function(){
        setActiveTemplateWarning();
    });

    $('#associatedStepName').on('change', function(){
        if($(this).val().length > 0){
            let promise = getPanelsFromSelectedStep($(this).val()).then(function(data){
                // trigger function to clean and repopulate panel multi-select list options
                resetPanelSelect('.panelsOption');

            }, function(reason){
                 console.log("error in processing your request", reason);
            });
        } else{
            $("#associatedPanelsPerStep").val('');
            $("#associatedPanelCodes").val('');
        }
        if(setActiveTemplateWarning() === false){
            getStepName($(this).val(), false);
        }
    });

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


    // submit functionality is in the analysisConfigurationSave.js file
    $('#stepFormSubmitButton').on('click', function(e){
        e.preventDefault();
        let form = $('[name="stepForm"]');
        //allowSubmit function is where all the additional submit validations live
        if (form.parsley().isValid() && allowSubmit()) {
            configurationPost();
        } else {
            $(form).parsley().validate();
        }
    });
}


/**
  *
  *
**/
function addParsleyColumnOrder(errorMessage) {
    window.Parsley.addValidator('columnOrder', {
        validateString: function(value) {
          let orderArr = [];
          let currentOrderCount = 0;
          $('.columnSelect').each(function(){
            if( $(this).val() != ''){
              orderArr.push($(this).val())
            }
          });
          for(let i = 0; i < orderArr.length; ++i){
            if(orderArr[i] == value){
              currentOrderCount++;
            }
          }
          return currentOrderCount == 1;
        },
        messages: {
            en: errorMessage
        }
    });
}

/**
  *
  *
**/
function addParsleyLoadFieldOrders(errorMessage) {
    window.Parsley.addValidator('uniqueValueLoad', {
        // string | number | integer | date | regexp | boolean
        requirementType: 'integer',

        // validateString | validateDate | validateMultiple
        validateNumber (value, requirement) {
            let orderArr = [];
            let currentOrderCount = 0;
            $('#loadDataTable .numberField').each(function(){
                if( $(this).val() != ''){
                    orderArr.push($(this).val())
                }
            });
            for(let i = 0; i < orderArr.length; ++i){
                if(orderArr[i] == value){
                    currentOrderCount++;
                }
            }
            return currentOrderCount == 1;
        },

        messages: {
          en: errorMessage
        }
    })
}

function addParsleyMetaFieldOrders(errorMessage) {
    window.Parsley.addValidator('uniqueValueMeta', {
        // string | number | integer | date | regexp | boolean
        requirementType: 'integer',

        // validateString | validateDate | validateMultiple
        validateNumber (value, requirement) {
            let orderArr = [];
            let currentOrderCount = 0;
            $('#metaDataTable .numberField').each(function(){
                if( $(this).val() != ''){
                    orderArr.push($(this).val())
                }
            });
            for(let i = 0; i < orderArr.length; ++i){
                if(orderArr[i] == value){
                    currentOrderCount++;
                }
            }
            return currentOrderCount == 1;
        },

        messages: {
          en: errorMessage
        }
    })
}

/**
  *
  *
**/
function addParsleyTableFieldOrder(errorMessage) {
    window.Parsley.addValidator('uniqueValue', {
        // string | number | integer | date | regexp | boolean
        requirementType: 'integer',

        // validateString | validateDate | validateMultiple
        validateNumber (value, requirement) {
            var orderArr = [];
            var currentOrderCount = 0;
            $('.orderCheck').each(function(){
                if( $(this).val() != ''){
                    orderArr.push($(this).val())
                }
            });
            for(var i = 0; i < orderArr.length; ++i){
                if(orderArr[i] == value){
                    currentOrderCount++;
                }
            }
            return currentOrderCount == 1;
        },

        messages: {
          en: errorMessage
        }
    })
}

function addParsleyModifierOrder(errorMessage) {
    window.Parsley.addValidator('uniqueModValue', {
        // string | number | integer | date | regexp | boolean
        requirementType: 'integer',

        // validateString | validateDate | validateMultiple
        validateNumber (value, requirement) {
            var element = arguments[2].$element.closest('.dataModifierFieldSection').parent().find;
            var orderModCheckList = arguments[2].$element.closest('.dataModifierFieldSection').parent().find('.orderModCheck');
            var orderArr = orderModCheckList.map(function(){
                return this.value
            });

            var currentOrderCount = 0;
            for(var i = 0; i < orderArr.length; ++i){
                if(orderArr[i] == value){
                    currentOrderCount++;
                }
            }
            return currentOrderCount == 1;
        },

        messages: {
          en: errorMessage
        }
    })
}


