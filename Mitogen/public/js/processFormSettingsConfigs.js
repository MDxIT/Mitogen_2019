
// Retrives form input settings JSON based on formType, instance, and workflow specified
// It currently uses synchronous Ajax call to make it resuable.
// NOTE: This needs to be reworked at some point, as synchronous Ajax call has been
//      deprecated.
function getFormSettingsJson(formType, instance, workflow) {
    var json;
    var inputs = {'stepName': 'Get Form Settings JSON',
        formType: formType,
        instance: instance,
        workflow: workflow
        };

    $.ajax({
        url: '/uniflow',
        type: 'get',
        async: false,
        data: inputs,
        success: function(data) {
            json = JSON.parse(data[0].JSON);
        }
    });
    return json;
}


function getAndProcessFormSettingsJson(formType, instance, workflow,
        prefix, section, parentSelector) {
    var json = getFormSettingsJson(formType, instance, workflow);
    processFormSettingsJson(json, prefix, section, parentSelector);
}


// data = Form input settings JSON
// prefix = Specify common prefix of all selectors.
//      Example1: .orderInfo_test1 and .orderInfo_test2
//          Prefix = .orderInfo_
//      Example2: #test1 and #test2
//          Prefix = # (It does not include test because test is part of the identifier)
// section = Specify the section in order to only process configuration for that section
// parentSelector = Optional. Used for helping configure tables.
function processFormSettingsJson(data, prefix, section, parentSelector) {
    data.forEach( function( settings ) {
        var $selector;

        // Checks inputType to determine whether inputField is a
        // user defined field or not.
        if(settings.inputType.indexOf('userDef_') == -1) {
            $selector = $(prefix + settings.inputField);
        } else {
            $selector = $('.userDefinedTable_inputName')
                .filter(function() {
                    return $(this).val() === settings.inputField;
                }).parent('td').siblings().find('.userDefinedTable_value');
        }

        // Configures elements that matches with the section specified
        if(settings.section == section) {
            // Handles setting required, readonly, and placeholder
            checkRequired($selector, settings);
            checkReadOnly($selector, settings);
            if(settings.placeHolder != '') {
                $selector.attr('placeholder', settings.placeHolder);
            }


            // Setting defaultValue for user defined fields
            // This applies to everything except
            // user defined select box
            if(settings.inputType.indexOf('userDef') != -1
                && settings.inputType.indexOf('userDef_select') == -1
                && settings.defaultValue != ''
                && $selector.val() == '') {
                $selector.val(settings.defaultValue);
            }

            // Handles hiding elements
            // First case is for hiding table columns which uses parentSelector
            //      for easier access.
            if(settings.inputType.indexOf('column_') != -1) {
                var index = $selector.parent().index();
                if(settings.show == 'false') {
                    $(parentSelector + ' tr').each(function() {
                        $(this).children('th:eq(' + index + ')').hide();
                        $(this).children('td:eq(' + index + ')').hide();
                    });
                } else {
                    $(parentSelector + ' tr').each(function() {
                        $(this).children('th:eq(' + index + ')').show();
                        $(this).children('td:eq(' + index + ')').show();
                    });
                }
            } else {

                // Special case for subSection.
                // selector needs to be an id with no prefix.
                if(settings.inputType == 'subSection') {
                    $selector = $('#' + settings.subSection);
                    if(settings.show == 'false') {
                        $selector.hide();
                    } else {
                        $selector.show();
                    }
                } else {
                    if(settings.show == 'false') {
                        if($selector.is('div') || $selector.is('tr')){
                            $selector.hide();
                        } else {
                           $selector.parent('td').hide();
                           $selector.parent('td').prev('.label').hide();
                           $selector.closest('#' + settings.subSection + ' .rowGroup').hide();
                        }
                    } else {
                        if($selector.is('div') || $selector.is('tr')){
                            $selector.show();
                        } else {
                           $selector.parent('td').show();
                           $selector.parent('td').prev('.label').show();

                           // Special case for handling elements in rowGroup
                           $selector.closest('#' + settings.subSection + ' .rowGroup').show();
                        }
                    }
                }
            }

        }

    });

};


function checkRequired($selector, settings) {
    if(settings.required == 'true') {
        $selector.addClass('required');

        if(settings.inputType.indexOf('userDef_check') !== -1) {
            $selector
                .attr('data-parsley-trigger', 'click')
        }
        // Only apply this for user defined fields
        // Need to make sure that there's no side effects when applying this to static fields
        if(settings.inputType.indexOf('userDef_') !== -1) {

            $selector.attr('data-parsley-required', 'true');
        }
    } else {
        $selector.removeClass('required');

        if(settings.inputType.indexOf('userDef_') !== -1) {
            $selector.removeAttr('required');
        }

    }
}

function checkReadOnly($selector, settings) {
    if(settings.readOnly == 'true') {
        if($selector.hasClass('hasDatepicker')) {
            $selector.removeClass('datePickerNow');
            $selector.removeClass('hasDatepicker');
        }

        if(settings.inputType.indexOf('check') != -1 ||
           settings.inputType.indexOf('select') != -1 ||
           settings.inputType.indexOf('setName') != -1)  {
            $selector.attr('disabled','disabled');
        } else {
            $selector.prop('readonly', true);
        }
    }
}


