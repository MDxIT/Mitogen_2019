

/*
 * Hide columns based on buildsheet configurations
*/
function hideSampleListColumns(config) {
    var $table = $(`#${config.prefix}Table`).closest('table');

    // Covert table to datatable
    // $table.addClass('stdTableBasic').DataTable();


    var $headers = $table.find('thead tr th');
    var $rows = $table.find('tbody tr');
    var columnHeaders = {'static': [], 'userDef': []};
    var requiredColumns = {'static': [], 'userDef': [], 'all': []};


    // Categorize required columns
    $('.additionalColumns').find('input').map(function(i) {
        var val = $(this).val();
        if(val.indexOf('userDef_') != -1) {
            requiredColumns.userDef.push(val);
        } else {
            requiredColumns.static.push(val);
        }
        requiredColumns.all.push(val);
    });

    // Categorize additional columns (UI)
    $headers.filter(function(i) {
        return i >= config.additionalColumnsIdx;
    }).map(function(i, elem) {
        var text = $(elem).text();
        if(text.indexOf('userDef_') != -1) {
            columnHeaders.userDef.push($(this));
        } else {
            columnHeaders.static.push($(this));
        }
    });

    // Iterate through static columns then check if the column is required
    // If it's not required, remove/hide the column
    columnHeaders.static.forEach(function(column) {
        var text = $(column).text();
        if($.inArray(text, requiredColumns.static) == -1) {
            hideSampleListColumn($rows, column);
        }

        // Merge Queued By Date to Queued By Column
        if(text == 'Queued By Date') {
            var queuedByDateIdx = $(column).index();
            columnHeaders.static.forEach(function(column2) {
                if($(column2).text() == 'Queued By') {
                    var $queuedByRows = $rows.find('td:eq(' + $(column2).index() + ')');
                    var $queuedByDateRows = $rows.find('td:eq(' + queuedByDateIdx + ')');
                    $queuedByRows.each(function(idx, elem) {
                        if($(elem).html().indexOf('<br>') === -1){
                            $(elem).append('<br>' + $($queuedByDateRows.get(idx)).html());
                        }
                    });

                }

            });
        }




    });

    // Hides/removes userDef columns that are not required
    // Filter function returns columns that are not required
    // map function hides/removes those
    columnHeaders.userDef.filter(function(column, i) {
        var text = $(column).text();
        var userDefIdx = text[text.length - 1];
        var foundColumn = false;

        // Iterates through required columns
        // Checks if column is userDef and map it to the required columns array
        // Replace header by removing the prefix
        requiredColumns.all.forEach(function(requiredColumn, j) {
            if(requiredColumn.indexOf('userDef_') != -1 && i == j) {
                foundColumn = true;
                var text = requiredColumn.replace('userDef_', '');
                text = text.charAt(0).toUpperCase() + text.slice(1);
                $(column).text(text);
            }
        });
        return !foundColumn;
    }).map(function(column) {
        hideSampleListColumn($rows, column);
    });
};


/*
 * Registers event handlers for the list table
*/
function addEvents(config) {


    if($('form').prop((`override-${config.prefix}-checkbox-click`).toString()) != 'true') {
        // Checkbox click event handler
        //  - Update for checkall cbox to uncheck in Intermediate State //
        $(`.${config.prefix}_checkbox`).click(function(){
            if($(this).is(':checked') == false){
                $('#selectAll').prop('checked', false).val('false');
            }

        });
    }

    if($('form').attr((`override-${config.prefix}-selectAll-click`).toString()) != 'true') {
        // Automatically checks or unchecks all rows in the list
        $('#selectAll').click(function() {
            if($(this).prop('checked') == true) {
                $(`.${config.prefix}Table_checkbox`)
                    .prop('checked', false)
                    .each(function() {
                        $(this).prop('checked', true).change();
                });

                // Generate IDs and insert it to scan fields
                if(config.containerIdGen == 'Auto Generated' &&
                    (config.validateOrTransfer !== 'Validate')) {
                    var $scan = $(`.${config.prefix}Table_scan`);
                    $scan.each(function() {
                        getAndPlaceNextSequence(config.sequenceName, $(this), 'sequenceValue', function() {
                           $scan.blur();
                        });
                    });
                }

            } else {
                $(`.${config.prefix}Table_checkbox`).prop('checked', false).change();
            }
        });

    }


    if($('form').prop((`override-${config.prefix}-scan-click`).toString()) != 'true') {
        // Scan field blur event handler
        //  - Enable/disables action and comment fields
        //  - Updates counter of the selected containers
        //  - Set order
        $(document).on('blur', `#${config.prefix}Table .${config.prefix}Table_scan`, function() {
            var specimenId = $(this).parent().siblings().find(`.${config.prefix}_${config.prefix}`).val();
            var $checkbox = $(this).parent().siblings().find(`.${config.prefix}Table_checkbox`);
            var value = $(this).val();

            if(value != '') {
                $checkbox.prop('checked', true).val('true');
                enableActionAndComment($checkbox, true, config);
            } else {
                $checkbox.prop('checked', false).val('false');
                $(this).parent().siblings().children(`.${config.prefix}Table_comment`).val('');
                enableActionAndComment($checkbox, false, config);
            }
            updateCounter(config);
            if(config.plateGridConfig === undefined || config.plateGridConfig === 'false') {
                orderSamples($checkbox, config);
            }

        });

    }

    if($('form').prop((`override-${config.prefix}-checkbox-change`).toString()) != 'true') {
        // Checkbox field change event handler
        //  - handleCheckbox
        //  - set order
        //  - set scan and comment to empty if unchecked
        $(`#${config.prefix}Table .${config.prefix}Table_checkbox`).change(function() {
            handleCheckbox($(this), config);
            if(config.plateGridConfig === undefined || config.plateGridConfig === 'false') {
                orderSamples($(this), config);
            }
            if($(this).prop('checked') == false) {
                $(this).parent().siblings().children(`.${config.prefix}Table_scan`).val('');
                $(this).parent().siblings().children(`.${config.prefix}Table_comment`).val('');
            }
        });
    }

};

// Initilizes list table
function init(config) {
    $('form').attr('enctype', 'multipart/form-data')
        .attr('data-parsley-validate', '');
    hideTableIfEmpty(`#${config.prefix}Table`, config.error.empty);
    // Hide reference input columns
    hideColumns(`#${config.prefix}Table`, 'hideColumn');

    $(`#${config.prefix}Counter`).val(0);
    updateCounter(config);
    $(`.${config.prefix}Table_checkbox`).attr('tabindex', '2');
    $(`.${config.prefix}Table_comment`).addClass('disabled').attr('tabindex', '2')
    $(`.${config.prefix}Table_action`).prop('disabled', true).attr('tabindex', '2')

    $(`#${config.prefix}Table .${config.prefix}Table_checkbox:checked`).each(function() {
        enableActionAndComment($(this), true, config);
    });

}


// Handle all configs - Including the configurations from the buildsheet
function checkConfig(config) {

    // Set all scan fields to required
    if(config.scanAllConfig == 'true') {
        $(`.${config.prefix}Table_scan`).attr('required', '');

    }

    // Set barcode scan to readonly if Auto Gen is enabled
    if(config.containerIdGen == 'Auto Generated') {
        $(`.${config.prefix}Table_scan`).prop('readonly', true);
    }

    // Add parsley check to scan field
    if(config.validateOrTransfer == 'Validate') {
        $(`.${config.prefix}Table_scan`).attr('data-parsley-equal-to-id', '')
        $(`.${config.prefix}Table_scan`).each(function() {
            $div = $('<div>').attr('id', $(this).attr('name') + '_error');
            $(this).attr('data-parsley-errors-container', '#' + $div.attr('id'));
            $(this).parent().append($div);

        });
        addParsleyScan(config);
    }


    // Configure counter
    if(config.counterConfig !== 'On') {
        $(`#${config.prefix}Counter`).parent().parent().hide();
    }



    // Add support for printing the barcode
    $('#printDocument').hide();

    printTableInputBarcodeByClass(`#${config.prefix}Table`, '.printButton');
    printAllBarcodesInTableInputBarcodeByClass(`#${config.prefix}Group`, `#${config.prefix}Table`, `${config.prefix}PrintAllNewBarcodes`);

    if($('#controlAddTable')){
        printAllBarcodesInTableInputBarcodeByClass(`#addControlsDiv`,`#controlAddTable`, `controlListGroupAddTablePrintAllNewBarcodes`);
    }
    if($('#controlListTable')){
        printAllBarcodesInTableInputBarcodeByClass(`#existingControlsDiv`,`#controlListTable`, `controlListGroupListTablePrintAllNewBarcodes`);
    }

    // Configure print list
    if(config.indicator.toLowerCase() == 'selected') {
        prepAndPrintDiv(`#${config.prefix}Group`, `.${config.prefix}Table_checkbox`);
        prepAndPrintDiv(`#controlListGroup`, `.controlListTable_checkbox`);
    } else {
        prepAndPrintDiv(`#${config.prefix}Group`);
        prepAndPrintDiv(`#controlListGroup`);
    }

    if( $('#controlListTable tbody tr').length == 0 && $('#controlAddTable tbody tr').length == 0){
        $('#controlListGroup_PrintThisDiv').hide();
        $('.controlListGroupPrintAllNewBarcodes').hide()
    }


}

// Hide an entire column of the sample list
function hideSampleListColumn($rows, column) {
    var idx = $(column).index();
    $rows.find('td:eq(' + idx + ')').hide();
    $(column).hide();
}


// Update counter based on the number of checked checkboxes
function updateCounter(config) {
    let numberOfControls = $('.countControl').filter(function(i, item){
        if(item.value != ""){
            return item
        }
    })
    var num = ($(`#${config.prefix}Table .${config.prefix}Table_checkbox`).filter(function() { return $(this).is(':checked') }).length) + numberOfControls.length

    $(`#${config.prefix}Counter`).val(num);
    // trigger change for batch size validations
    $(`#${config.prefix}Counter`).change();
}

// Enable/disable action and comment fields
function enableActionAndComment($elem, bool, config) {
    if(bool) {
        $elem.parent().siblings().find(`.${config.prefix}Table_action`).prop('disabled', false);
        $elem.parent().siblings().find(`.${config.prefix}Table_comment`).prop('readOnly', false).removeClass('disabled');
        $elem.parent().parent().removeClass('disabled');
    } else {
        $elem.parent().siblings().find(`.${config.prefix}Table_action`).prop('disabled', true);
        $elem.parent().siblings().find(`.${config.prefix}Table_comment`).prop('readOnly', true).addClass('disabled');
        $elem.parent().parent().addClass('disabled');
    }
}


// - Copies id to scan field if checked
// - Enables/disables action and comment field
// - Updates counter
function handleCheckbox($elem, config) {
    if($elem.is(':checked')) {
        if(config.validateOrTransfer == 'Validate') {
            var specimenId = $elem.parent().siblings().find(`.${config.prefix}Table_${config.id}`).val();
            $elem.parent().siblings().find(`.${config.prefix}Table_scan`).val(specimenId);
        } else {
            // Generate IDs and insert it to scan field
            if(config.containerIdGen == 'Auto Generated') {
                var $scan = $elem.parent().siblings().find(`.${config.prefix}Table_scan`);
                getAndPlaceNextSequence(config.sequenceName, $scan, 'sequenceValue', function() {
                   $scan.blur();
                });
            }

        }
        enableActionAndComment($elem, true, config);
    } else {
        enableActionAndComment($elem, false, config);
    }
    updateCounter(config);
}

// Add parsley validation to scan field
function addParsleyScan(config) {
    window.Parsley.addValidator('equalToId', {
        validateString: function(value, requirement, elem) {
            return value == $(elem.element).parent().siblings().find(`.${config.prefix}Table_${config.id}`).val();
        },
        messages: {
            en: config.error.equalToIdError
        }
    });
}


