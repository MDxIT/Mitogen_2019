// Retrieves and loads sub sections from the database based on the section specified.
// $elem = sub section element selector
function getSubSections($elem, section) {
    $elem.load('/uniflow',
        {stepName: 'Ajax Get subSections',
         section: section
    });
}

// Create and stores form part to the database
function createFormPart(section, subSection, inputType, inputName) {
    $.post('/uniflow',
         {
            'stepName': 'Ajax POST Create Form Part',
            'section': section,
            'inputType': inputType,
            'inputName': inputName,
            'formNumber': 0
        }
    ).done(function(data) {
        var postHtml = $.parseHTML(data)
        var postError = checkPostError(postHtml);
        $('#userDefinedFields_errorMessage').removeClass('redText').removeClass('greenText');
        if(postError !== false) {
            $('#userDefinedFields_errorMessage').html(postError).addClass('redText');
        } else {
            $('.userDefinedFields_formPart').each(function() {
                loadFormParts($(this), $(this).parent().siblings().find('.userDefinedFields_instance').val());
            });
            $('#userDefinedFields_errorMessage').html('Successfully created user defined field!').addClass('greenText');
        }
    });
}

// This is used for the user defined fields configuration table to retrieve
// and load form parts
function loadFormParts($elem, instance) {
    var value = $elem.val();
    $elem.load('/uniflow',
        {stepName: 'Ajax Get Form Parts',
         instance: instance
    }, function(data) {
        $elem.children('[value="' + value + '"]').attr('selected', true);
    });
}

// Iterates through the table to find elements with select input type to
//  to convert the defaultValue element into select box.
//  If the user changes the form part to something else, it turns it back to a text box.
//  $array = user defined table rows
function checkForSelectInputTypes($array) {
    $.get('/uniflow', {stepName: 'Ajax Get Form Parts JSON'},
         function(success) {
        $array.each(function(idx) {
            var formConfigurablePartsId = $(this).val();
            var $defaultValue = $(this).parent('td').siblings().children('.userDefinedFields_defaultValue');
            var $placeHolder = $(this).parent('td').siblings().children('.userDefinedFields_placeHolder');

            for(var i = 0; i < success.length; i++) {
                if(success[i].id == formConfigurablePartsId) {
                    if($placeHolder.siblings('span').length != 0) {
                        $placeHolder.show();
                        $placeHolder.siblings('span').remove();
                    }
                    if($defaultValue.siblings('span').length != 0) {
                        $defaultValue.show();
                        $defaultValue.siblings('span').remove();
                    }

                    if((success[i].inputType === 'userDef_select' || success[i].inputType.indexOf('userDef_check') !== -1)) {
                        $placeHolder.hide();
                        $placeHolder.val('');
                        $('<span>Placeholder not applicable.</span>').insertAfter($placeHolder);
                        if(success[i].inputType.indexOf('userDef_check') !== -1) {
                            $defaultValue.hide();
                            $defaultValue.val('');
                            $('<span>Default value not applicable.</span>').insertAfter($defaultValue);
                        }
                    }

                    if(success[i].inputType === 'userDef_select') {
                        prepareAndLoadSetNames($defaultValue, formConfigurablePartsId);
                        break;
                    } else if($defaultValue.prop('tagName').toLowerCase() == 'select'
                         && success[i].inputType !== 'userDef_select') {
                        if(success[i].inputType.indexOf('userDef_check') === -1) {
                            var defaultValue = $defaultValue.val();
                            var defaultValueName = $defaultValue.attr('name');
                            var defaultValueClass = $defaultValue.attr('class');
                            var $newElement = $('<input type="text">');
                            $newElement.attr('name', defaultValueName).attr('class', defaultValueClass);
                            $defaultValue.replaceWith($newElement);
                        }
                        break;
                    }
                }
            }
        });
    });

}

$(window).load(function() {


    hideColumns('#userDefinedFields_table', 'hideColumn');
    // Add Replicate button and apply event click handler
    $('#userDefinedFields_table .col9').append('<input value="Replicate" type="button" class="button replicateButton">');
    // Load options for select boxes
    checkForSelectInputTypes($('#userDefinedFields_table .userDefinedFields_formPart'));

    $('.userDefinedFields_instance').each(function() {
        loadFormParts($(this).parent().siblings().find('.userDefinedFields_formPart'), $(this).val());
    });

    $(document).on('change', '.userDefinedFields_instance', function() {
        loadFormParts($(this).parent().siblings().find('.userDefinedFields_formPart'), $(this).val());
    });

    // Load sub sections
    $(document).on('change', '#userDefinedFields_section', function() {
        var section = $(this).val();
        getSubSections($('#userDefinedFields_subSection'), section);
    });


    $(document).on('change', '.userDefinedFields_formPart', function() {
        checkForSelectInputTypes($(this));
    });

    // Create Form Part
    $(document).on('click', '#userDefinedFields_addFormPart', function() {
        var section = $('#userDefinedFields_section').val();
        var subSection = $('#userDefinedFields_subSection').val();
        var inputType = $('#userDefinedFields_inputType').val();
        var inputName = $('#userDefinedFields_inputName').val();

        createFormPart(section, subSection, inputType, inputName);
    });


    // Add new row to #userDefinedFields_table
    $(document).on('click', '#userDefinedFields_addRow', function() {
        inputTableAddRow('userDefinedFields_table', true);
    });


    $(document).on('click', '.replicateButton', function() {
        var $table = $('#userDefinedFields_table');
        var $tbody = $('#userDefinedFields_table tbody');
        var $thisRow = $(this).parent().parent();
        var $lastRow = $tbody.children('tr').last();
        var rowCurrent = $lastRow.index();
        var rowCount = rowCurrent + 1;
        var $clone = $thisRow.clone();
        var nextRowCount =  rowCount + 1;

        $clone.children('td').each(function() {
            var inputName = $(this).children().attr('name');
            if(inputName) {
                var info = inputName.split('_');
                $(this).children().attr('name', [info[0], rowCount, info[2]].join('_'));
            }
        });
        var $childrenTd = $clone.children('td');
        $childrenTd.find('.userDefinedFields_formInputSettingsId').val('NEW');
        $childrenTd.find('.userDefinedFields_form').val('NEW');
        $childrenTd.find('.userDefinedFields_instance').val('');
        $childrenTd.find('.userDefinedFields_formPart').val($thisRow.find('.userDefinedFields_formPart').val());
        $childrenTd.find('.userDefinedFields_defaultValue').val($thisRow.find('.userDefinedFields_defaultValue').val());
        var $lastNonEmptyRow = $tbody.children('tr').find('.userDefinedFields_formInputSettingsId')
            .filter(function() {
                return $(this).val() != 'NEW';
         }).last().parent().parent();
        $tbody.append($clone);

        // Necessary for Uniflow to process rows that were added
        $('input[name="userDefTable_numRows"]').val(rowCount+1);
        var $hiddenValueRow = $('input[name="userDefTable_' + rowCurrent + '"]');
        $('<input type="hidden" name="userDefTable_' + rowCount + '" value="NEW" tabindex="1">').insertAfter($hiddenValueRow);
    });


});
