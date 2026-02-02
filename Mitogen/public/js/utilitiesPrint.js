$(document).ready(function() {
    $('#documentChooser').parent().parent().find('.label').html('Select Template  ')
});





/**
 * Prepare div content to print and launch browser print features.
 * Whatever needs to be printed, needs to be put into a div for printing.
 *
 * @param {string} printable div id format: #id
 * @param {string} column class to indicate row inclusion. only applicable to input tables leave blank otherwise format: .class
 * @param {string} include id of button you want to use for printing instead of the function generated Print This button
 *
 */


function prepAndPrintDiv(divId, includeOnlyClass, buttonId) {
    var printLabel = 'Print Area';
    let areaLabel = ''; // leave blank for plate or grid
    if(divId.indexOf('List') !== -1){
        printLabel = 'Print List';
        areaLabel = 'Sample List';
    } 
    if(buttonId == undefined) {
        // set up print area and print button
        var buttonId = divId.replace('#','') + '_PrintThisDiv';
        $(divId).prepend('<input type="button" class="printListBtn" id="'+buttonId+'" value="'+printLabel+'">');
    }
    // $(divId).css({'border':'1px dashed lightgray', 'padding':'10px',});
    $(divId).prepend('<div style="display:none;" id="printMeClone"></div>');


    // on click prepare print clone.
    $(document).on('click', '#'+buttonId, function() {

        // prepare input text and checkbox values for clone
        $(divId).find('input').each(function() {
            if($(this).attr('type') == 'text') {
                $(this).attr('value', $(this).val());
            }
            if($(this).attr('type') == 'checkbox') {
                $(this).attr('value', $(this).prop('checked'));
                $(this).attr('checked', $(this).prop('checked'));
                $(this).prop('checked', $(this).prop('checked'));
            }
        });

        // prepare textareas for clone
        $(divId).find('textarea').each(function() {
            $(this).attr('value',$(this).val());
        });

        // prepare selects for clone
        $(divId).find('select').each(function() {
            $(this).attr('value', $(this).children('option:selected').text());
        });

        // create on screen hidden clone

        var pageInstructions = $('.instructionsTable').clone();
        var masterMixInstructions = $('#masterMixInstructions').clone();

        $(masterMixInstructions).css('width', 'auto');

        let shouldPageBeak = 'auto';

        if($(pageInstructions).children('tbody').children('tr').length > 0){
            let pageInstructionArea = '<fieldset id="pageInst"><legend>Instructions</legend>';
            pageInstructionArea += pageInstructions[0].outerHTML;
            pageInstructionArea += '</fieldset>';
            $('#printMeClone').append(pageInstructionArea);
            
            shouldPageBeak = 'always';

        }

        if(masterMixInstructions.length > 0){
            let mmsection = '<fieldset id="mmi"><legend>Master Mix Instructions</legend>';
            mmsection += masterMixInstructions[0].outerHTML;
            mmsection += '</fieldset>';
            $('#printMeClone').append(mmsection);

            shouldPageBeak = 'always';

        } 


        var thisDiv = $(divId).clone().html();

        let listArea = '<fieldset style="page-break-inside:avoid"><legend>' + areaLabel + '</legend>';
        listArea += thisDiv;
        thisDiv = listArea + '</fieldset>';

        $('#printMeClone').append(thisDiv);


        $('#printMeClone #printThisDiv').remove();
        $('#printMeClone > #printMeClone').remove();
        $('#printMeClone [type="hidden"]').remove();
        $('#printMeClone .printAllBtn').remove();
        $('#printMeClone .printListBtn').remove();

        // limit row print. - for input tables only
        if(includeOnlyClass != undefined) {
            var indicatorType = $(includeOnlyClass).attr('type');
            if(indicatorType == 'checkbox') {
                $('#printMeClone ' + includeOnlyClass + ':not(:checked)').parent().parent('tr').remove();
            } else if (indicatorType = 'text') {
                $('#printMeClone ' + includeOnlyClass + '[value=""]').parent().parent('tr').remove();
            }
        }

        // convert inputs to readonly/spans for printing
        $('#printMeClone').find('select, input:not(:checkbox), textarea').each(function() {
            var thisValue = $(this).attr('value');
            $(this).replaceWith(thisValue);
        });
        $('#printMeClone').find('input:checkbox').each(function() {
            $(this).attr('disabled','disabled');
        });

        // create clone window for printing
        var cloneForPrintWindow = $('#printMeClone').clone().html();
        $('#printMeClone').children().remove();
        var printContnetHTML = '<html><head><link rel="stylesheet" type="text/css" href="page3.css"></head><body window.onload = function() { window.print(); }> <div id="myPrintWindow">' + cloneForPrintWindow + '</div></body></html>';
        var printDivWindow = window.open("", "Print", "toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=780,height=600,top="+(screen.height-100)+",left="+(screen.width-840));
        printDivWindow.document.write(printContnetHTML);
        printDivWindow.document.close();
        printDivWindow.focus();
        printDivWindow.print();
        printDivWindow.close();
        setTimeout(function(){printDivWindow.close();},1000);
    });

}


function setupPrintTableInputBarcodeByClass(table, printButtonClass) {

    $(printButtonClass).each(function() {
            if($(this).parent().find('.printBarcodeBtn').length == 0){
                //$('<input class="button printBarcodeBtn" type="button" value="Print" tabindex="1">').insertAfter(this);
                addPrintButtonAfter(this);
            }
    });

};


function addPrintButtonAfter(elem) {
        $('<input class="button printBarcodeBtn" type="button" value="Print" tabindex="1">').insertAfter(elem);
}

/**
 * Print barcode from input table
 * Specify column class for barcode id
 *
 * @param {string} table The table selector
 * @param {string} class for the print button for the row
 * @param {string} barcode The columnn selector class for the barcode column
 * @returns void
 */
function printTableInputBarcodeByClass(table, printButtonClass) {

    setupPrintTableInputBarcodeByClass(table, printButtonClass);
    getTablePrintVariablesRowData($(table), $(table), '.printBarcodeBtn'); 

}

function setupPrintAllBarcodesInTableInputBarcodeByClass(divId, printButtonClass) {
    $(divId).prepend('<input class="button printAllBtn '+printButtonClass+'" type="button" value="Print All Barcodes" tabindex="1">');
}

/**
 * Print barcode from input table
 * Specify column class for barcode id
 *
 * @param {string} table The table selector
 * @param {string} class for the print button for the row
 * @param {string} barcode The columnn selector class for the barcode column
 * @returns void
 */
function printAllBarcodesInTableInputBarcodeByClass(divId, table, printButtonClass) {

    setupPrintAllBarcodesInTableInputBarcodeByClass(divId, printButtonClass);
    getTablePrintVariablesData($(table), $(divId), '.' + printButtonClass); 

}



/**
 * Print barcode
 *
 * @param {Array} array object holding a variable list array [{"name":"variableName1", "value":"value1"}, {"name":"variableName2", "value":"value2"} ...]
 * @returns void
 */
function printBarcodeVariable(variableListArray, fieldData){

    var variables = [];
    var missingFields = [];

    variableListArray = variableListArray.map(function(item) {
        variables.push(item['name']);
        return JSON.stringify(item);
    });

    fieldData.map(function(item) {
        if($.inArray(item['fieldData'], variables) === -1) {
                missingFields.push(item['fieldData']);
        }
    });

    missingFields = $.unique(missingFields); 

    if(missingFields.length) {
        return missingFields;
    }

    var printerData = {
        "stepName": 'requestPrintJobTrackingEventId',
        "documentName": $("#documentChooser").val(),
        "printerList": JSON.stringify(new Array($("#printerList").val())),
        "variableList": "[" + variableListArray.join(",") + "]",
        "Submit": true,
        "formNumber": 0
    };


    $.post('/uniflow', printerData).success(function(jqxhr, statusText) {
        console.log('Print success')
    }).fail(function (jqxhr, textStatus, error) {
        var err = "Request Failed: " + textStatus + ", " + error; 
        alert(err);
    });

    return null;
}

/**
 * Print barcode list in order shown on page
 *
 * @param {Array} 
        {
        "1":[{"name":"barcode", "value":"S123"}, {"name":"patienName", "value":"John"}],
        "2":[{"name":"barcode", "value":"S124"}, {"name":"patienName", "value":"Joe"}],
        "3":[{"name":"barcode", "value":"S125"}, {"name":"patienName", "value":"Jane"}]
        }
 * @returns void
 */
function printBarcodeVariableList(variableListArray){


        let variableListPlus = {
                "documentName": $("#documentChooser").val(),
                "printer": $("#printerList").val(),
                "variableLists": variableListArray
        }

        let printerData = {
                "stepName": 'requestPrintJobBatchTrackingEventId',
                "batchData": JSON.stringify(variableListPlus),
                "variableList": JSON.stringify(variableListPlus),
                "Submit": true,
                "formNumber": 0
        };

        return $.post('/uniflow', printerData).success(function(jqxhr, statusText) {
                console.log('Print success')
        }).fail(function (jqxhr, textStatus, error) {
                var err = "Request Failed: " + textStatus + ", " + error; 
                alert(err);
        });

}

function printBarcode(id) {

    var el = '#' + id;
    var printId = id + "Print";

    $('<input id="' + printId + '" class="button print" type="button" value="Print" tabindex="1">').insertAfter(el);

    $('#' + printId).on('click', function() {
        if($("#printerList").val() === "" || $('#documentChooser').val() === "") {
            alert("Printer and template must be selected to print");
        }
         

        $.getJSON('uniflow?', {
                stepName: 'ajaxGetLabelTypeVariables',
                documentName: $('.documentChooser').val()
        }).done(function(data) {
                var variableListArray = [];
                data.map(function(item) {
                        var $elem = $('#mainDiv').find("[name='" + item['fieldData'] + "']");
                        if($elem.length) {
                                $elem = $($elem[0]);
                                var tagName = $elem.prop('tagName').toLowerCase();
                                var value = "";

                                if(tagName == 'input') {
                                        value = $elem.val();
                                } else if(tagName == 'select') {
                                        value = $elem.find('option:selected').text();
                                } else {
                                        value = $elem.text();
                                }

                                let newItem  = {name : item['fieldData'], value : value.trim()}
                                variableListArray.push(newItem);
                        }

                });

                var missingFields = printBarcodeVariable(variableListArray, data);
                if(missingFields != null) {
                        alert("Selected template has missing fields: " + missingFields.join(', '));
                }
        });
    });
};


function getTablePrintVariablesData($table, $onElem, printClass) {

        $onElem.on('click', printClass, function() {
                if($("#printerList").val() === "" || $('#documentChooser').val() === "") {
                        alert("Printer and template must be selected to print");
                        return;
                }

                var missingFieldsArr = [];
                $.getJSON('uniflow?', {
                        stepName: 'ajaxGetLabelTypeVariables',
                        documentName: $('.documentChooser').val()
                }).done(function(data) {

                        var variableList = getVariableListObject($table, data);

                        var missingFields = checkMissingFields(variableList, data);

                        if(missingFields.length > 0) {
                            alert("Selected template has missing fields: " + missingFields.join(', '));
                        } else {
                            printBarcodeVariableList(variableList, data);
                        }

                });

        });
}


/**
 * Creates and returns objects of barcodes
 *
 * @param $table
 * @param data  
 * @returns 
        {
        "1":[{"name":"barcode", "value":"S123"}, {"name":"patienName", "value":"John"}],
        "2":[{"name":"barcode", "value":"S124"}, {"name":"patienName", "value":"Joe"}],
        "3":[{"name":"barcode", "value":"S125"}, {"name":"patienName", "value":"Jane"}]
        }
 */
function getVariableListObject($table, data) {

        var $headers = $table.find('thead tr th'); 
        var headers = [];
        $headers.each(function() {
                headers.push($(this).text());
        });

        var variableList = {};
        var counter = 1;
        $table.find('tbody tr').each(function() {
                var variables = [];
                var $row = $(this);
                data.map(function(item) {
                        // Find data based on headers
                        var idx = headers.indexOf(item['fieldData']);
                        variables.push(getVariable(idx, item, $row));
                        
                });
                variableList[counter.toString()] = variables;
                counter++;
        });

        return variableList;

}


/**
 * Checks for and returns an array of unique fields with missing data.
 *
 * @param variableListObject
        {
        "1":[{"name":"barcode", "value":"S123"}, {"name":"patientName", "value":""}],
        "2":[{"name":"barcode", "value":"S124"}, {"name":"patientName", "value":""}],
        "3":[{"name":"barcode", "value":"S125"}, {"name":"patientName", "value":""}]
        }
 * @returns 
        ["patientName"]
 */
function checkMissingFields(variableListObject, fieldData) {
        let variablesList = [];
        let combinedMissingFields = [];

        for (item in variableListObject) {
                let variables = variableListObject[item].map(function(subItem) {
                        return subItem['name'];
                 });
                variablesList = $.unique(variablesList.concat(variables));
        } 

        fieldData.map(function(item) {
                if($.inArray(item['fieldData'], variablesList) === -1) {
                        combinedMissingFields.push(item['fieldData']);
                }
        });

        return combinedMissingFields;
}



function getTablePrintVariablesRowData($table, $onElem, printClass) {

        $onElem.on('click', printClass, function() {
                var $thisElem = $(this);
                if($("#printerList").val() === "" || $('#documentChooser').val() === "") {
                    alert("Printer and template must be selected to print");
                    return;
                }

                $.getJSON('uniflow?', {
                        stepName: 'ajaxGetLabelTypeVariables',
                        documentName: $('.documentChooser').val()
                }).done(function(data) {
                        var $headers = $table.find('thead tr th'); 
                        var headers = [];
                        $headers.each(function() {
                                headers.push($(this).text());
                        });

                        var variables = [];
                        data.map(function(item) {
                                // Find data based on headers
                                var idx = headers.indexOf(item['fieldData']);
                                var $row = $thisElem.parent().parent();
                                variables.push(getVariable(idx, item, $row));
                        });

                        var missingFieldsArr = printBarcodeVariable(variables, data);
                        if(missingFieldsArr != null) {
                                missingFieldsArr = $.unique(missingFieldsArr);
                                if(missingFieldsArr.length > 0) {
                                        alert("Selected template has missing fields: " + missingFieldsArr.join(', '));
                                }
                        }

                });
        });


}

function getVariable(idx, item, $row) {
        var $tds = $row.find('td');
        var classAttr = "";
        var $selector = undefined;
        if(idx >= 0 && idx <= $tds.length - 1) {
                var $td = $($tds[idx]);
                var $elem = undefined;
                var isSelectBox = false;
                if($td.find('input').length) {
                        $elem = $td.find('input');
                } else if($td.find('a').length) {
                        var $anchors = $td.find('a');
                        var length = $anchors.length;
                        $selector = $($anchors[length-1]);
                        $elem = $selector;
                } else if($td.find('select').length) {
                        $elem = $td.find('select option:selected');
                        isSelectBox = true;
                } else if($td.children().length) {
                     $elem = $td.children().first(); 
                } else {
                        $elem = $td;
                        //classAttr = $selector.attr('class').split(' ').map(function(item) {
                        //       return  '.' + item; 
                        //}).join('');
                        //$elem = $row.find(classAttr);
                }
                var val = $elem.val();
                if(val == '' || isSelectBox == true) {
                        val = $elem.text();
                }
                return {'value': val, 'name': item['fieldData']};
        }

        return '';
}
