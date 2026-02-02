/**
  *
  * panelHighlighting
  *
  * sets the test(s) needing assignment section under panels when receiving
  *
**/
function panelHighlighting() {
    // get datatable object
    let myPanelTable = $('#panels').DataTable();
    // get datatable data object
    let myPanelTableData = myPanelTable.data();

    // will hold the panel and associated code and test array
    let orderedPanelList = [];
    // combined test object array for all tests in all selected panels
    let orderPanelTests = [];
    // all assigned test(s) in panel or singled out.
    let assignedPanelTests = [];

    //loop through panels datatable object created at the beginning of document ready
    myPanelTable.rows().every( function ( rowIdx, tableLoop, rowLoop ) {
        // get rows panelCode based on row and column indexes
        let selected = $(myPanelTable.cell( rowIdx, 0 ).data()).val();
        let testObjList = [];

        if(selected === 'true'){
            let testList = $(myPanelTable.cell( rowIdx, 4 ).data()).val()

            if(testList){
                let testListArr = testList.split('|')

                $.each(testListArr, function(i, item){
                    let myItemObj = {
                        "name": item.split("^")[1], 
                        "code": item.split("^")[0] 
                    }
                    orderPanelTests.push(myItemObj)
                    testObjList.push(myItemObj)
                })
            }

            orderedPanelList.push({
                "name": myPanelTable.cell( rowIdx, 1 ).data(), 
                "code": $(myPanelTable.cell( rowIdx, 2 ).data()).val(),
                "testObjList": testObjList
            });
        }
    } );

    // get currently assigned panels and tests in the specimen info table
    $('#specimenInfoTable .specimenInfo_panelSelection').each(function() {
        let panelCode = $(this).val();
        if(panelCode.length > 0) {
            let tests = $(this).parent().siblings().children('.specimenInfo_testSelection').val();
            assignedPanelTests = getAssignedPanelTestArr(panelCode, tests, orderedPanelList, orderPanelTests, assignedPanelTests);
        }
    });

    // get currently assigned panels and tests in the specimenInfoTable_RecievedAddTest table
    $('#specimenInfoTable_RecievedAddTest .specimenInfo_panelSelection').each(function() {
        let panelCode = $(this).val();
        if(panelCode.length > 0) {
            let tests = $(this).parent().siblings().children('.specimenInfo_testSelection').val();
            assignedPanelTests = getAssignedPanelTestArr(panelCode, tests, orderedPanelList, orderPanelTests, assignedPanelTests);
        }
    });

    // get currently assigned panels and tests in the specimenInfoTable_Recieved table
    $('#specimenInfoTable_Recieved .specimenInfo_panelSelection').each(function() {
        let panelCode = $(this).val().split('|')[0];
        if(panelCode.length > 0) {
            let tests = $(this).parent().siblings().children('.specimenInfo_testSelection').val().split('|')[0];
            assignedPanelTests = getAssignedPanelTestArr(panelCode, tests, orderedPanelList, orderPanelTests, assignedPanelTests);
        }
    });

    orderPanelTests = uniqueResultsArrayOfObj (orderPanelTests, 'code')

    // set dom elements for tests needing assignment
    setTestsNeedingAssignment(orderPanelTests, assignedPanelTests)
}


/** getAssignedPanelTestArr
  *
  * gets assigned panels and tests selected
  *
  * @param panelCode - string
  * @param tests - string
  * @param orderedPanelList - object array
  * @param orderPanelTests - object array
  * @param assignedPanelTests - object array
  * @return  assignedPanelTests - object array
  *
  * sets the test(s) needing assignment section under panels when receiving
  *
**/
function getAssignedPanelTestArr(panelCode, tests, orderedPanelList, orderPanelTests, assignedPanelTests){
    if(blankIfFalsy(tests) === '') {
        $.each(orderedPanelList, function(i, panelObj){
            if(panelCode === panelObj.code){
                assignedPanelTests = assignedPanelTests.concat(panelObj.testObjList)
            }
        })
    } else {
        $.each(orderPanelTests, function(i, panTestObj){
            if(tests === panTestObj.code){
                assignedPanelTests.push(panTestObj)
            }
        })
    }
    return assignedPanelTests
}



/** setTestsNeedingAssignment
  *
  * sets the test(s) needing assignment area under panels that is displayed to the user
  *
  * @param orderedPanelList - object array
  * @param orderPanelTests - object array
  * @param assignedPanelTests - object array
  *
  * sets the test(s) needing assignment section under panels when receiving
  *
**/
function setTestsNeedingAssignment(orderPanelTests, assignedPanelTests){

    let displayList = [];
    $.each(orderPanelTests, function(index,value) {

        if($.inArray(value, assignedPanelTests) == -1) {
            displayList.push(value.name);
        }
    });

    $('#specimenInfo_TestsToBeAssigned').text('');
    $('#specimenInfo_TestsToBeAssigned').append(displayList.join(', '));

    $('#noPanelsSelectedMessage').hide();
    $('#allTestsHaveBeenAssignedMessage').hide();
    if(orderPanelTests.length === 0){
        $('#noPanelsSelectedMessage').show();
    } else if(displayList.length === 0) {
        $('#allTestsHaveBeenAssignedMessage').show();
    }
}


/** selectPanel
  *
  * 
  *
  * @param panelSelected - checkbox element
  * @param panelCode - string
  * @param panelName - string
  * @param testCode - string
  *
  * 
  *
**/
function selectPanel(panelSelected, panelCode, panelName, testCode) {
    $('#noPanelsSelectedMessage').hide();
    $('#allTestsHaveBeenAssignedMessage').hide();

    // ensure no undefined are passed to code following
    testCode = blankIfFalsy(testCode)

    // Update tests available for proband linking
    if(typeof updatePanelsForProband !== 'undefined' && $.isFunction(updatePanelsForProband)) {
        updatePanelsForProband();
    }

    // process added new panel
    if( panelSelected.is(':checked')) {
        if($('.specimenInfo_panelSelection option[value="'+panelCode+'"]').length == 0) {
            $('.specimenInfo_panelSelection').prepend('<option class="isPanel" testsInPanel="'+ testCode +'" value="'+ panelCode +'">' + panelName + '</option>');
        }
    } else {
        // process removing panel
        $('.specimenInfo_panelSelection option[value="'+panelCode+'"]').remove();
    }

    panelHighlighting() ;
}


/** panelAssigned
  *
  * 
  *
  * @param panelSelectElement - element
  * @param testCodeList - object array
  *
  * 
  *
**/
function panelAssigned(panelSelectElement, testCodeList ) {
  let panelCode = panelSelectElement.val();
  let $test = panelSelectElement.parent().siblings().children('.specimenInfo_testSelection');
  let $method = panelSelectElement.parent().siblings().children('.specimenInfo_testMethod');
  let options = '';

  let specimenId = panelSelectElement.parent().siblings().children('.specimenInfo_specimenId').val();

  if (specimenId == '') {
    specimenId = panelSelectElement.parent().siblings().children('.specimenInfo_specimenIdReference').val();
  }

  $test.children('option').remove();
  $method.children('option').remove();
  
  if(panelCode.length > 0) {

    if(testCodeList.length > 0){    
      let testCodeArray = testCodeList.split('|');

      if(testCodeArray.length >= 1) {
        $('.specimenInfo_IsAddTest[value="0"][specimen="'+ specimenId +'"]').parent().siblings().children('.specimenInfo_addTest').show();
      }

      $.each(testCodeArray, function(index,value) {
        options += '<option value="' + value.split('^')[0] + '">' + value.split('^')[1] + '</option>';
      });

      if(testCodeArray.length > 1 && $test.children('option').length == 0) {
        options = '<option value=""></option>' + options;
      }
      $test.prepend(options);
      if (testCodeArray.length == 1) {
        methodLoad($test);
      }

    }
  } else {

    $test.children().remove();
    $method.children().remove();

  }

  panelHighlighting();
}

function searchForDuplicateTests(thisRow, specimenId, testMethod) {
    testMethodCount = $('[specimen="' + specimenId + '"][testmethod="' + testMethod + '"]').length;
    if(testMethodCount > 1) {
        thisRow.children().children('.specimenInfo_testSelection').val('');
        thisRow.children().children('.specimenInfo_testSelection').focus();
        thisRow.children().children('.specimenInfo_testMethod').val('');
        thisRow.removeAttr('testmethod');
        alert('You have already selected this test and method combination for ' + specimenId + '. Please correct your selection.')
    }
}

function methodLoad(testSelection) {

    var method = testSelection.parent().siblings().children('.specimenInfo_testMethod');
    var testCode = testSelection.val();
    var thisRow = testSelection.parent().parent('tr');

    method.load('/uniflow',
      {
        stepName: 'Ajax get methods for tests',
        testCode: testCode
      }, function() {

        if(method.children('option').length > 1) {
          method.prepend('<option></option>');
          method.val('');
          method.focus();
        } else {
          var specimenId = thisRow.attr('specimen');
          var testMethod = testCode + method.val();
          thisRow.attr('testmethod', testMethod);
        }

      }
    )
}

/**
 * Copies parent elements to child row elements on change
 *
 * @function updateChildRowFields
 */
function updateChildRowFields(){
    // this is the element that is triggering this event
    let thisRow = $(this).parent('td').parent('tr');
    let thisTableTRs = $(this).parent('td').parent('tr').parent('tbody').children('tr');
    let thisRowSpecimen = thisRow.attr('specimen');
    let thisRowValues = [];

    thisRow.children('td').each(function() {
      let elementName = $(this).children('input, select, textarea').attr('name');
      let colNo = elementName.substr(elementName.lastIndexOf("_") +1);
      let fieldVal = $(this).children('input, select, textarea').val();
      thisRowValues.push({colNo,fieldVal});
    });

    $.each(thisTableTRs, function(index, row){
      let currentRow = $(row);
      if($(row).attr('specimen') === thisRowSpecimen){
        $.each(thisRowValues, function(index, data) {
          currentRow.children('td').children('[name$="'+data.colNo+'"]').not('.specimenInfo_testSelection, .specimenInfo_testMethod, .specimenInfo_panelSelection, .specimenInfo_specimenId, .specimenInfo_specimenIdReference, .specimenInfo_IsAddTest').val(data.fieldVal);
        })
      }
    })
}

/**
  *
  * Add row to input table
  *
  * @param tableId - table element id for add row functionality, do not include #
  *
**/
function specimenInputTableAddRow(table, emptyRow, defaultRow = 'noDefault') {
    // var table = tableStrRaw;
    // // #389201 Added backwards compatibility. Recent change made this function
    // // more flexible such that you can specify a class or id
    // if(table[0] != "#") {
    table = "#" + table;
    // }
    var tableBody = $(table + ' tbody');
    var firstRow =  $(table + ' tbody tr').first();
    var lastRow =  $(table + ' tbody tr').last();
    var rowNumberCurrent = lastRow.index();
    var rowNumberNext = 1 + rowNumberCurrent;
    var rowCount = rowNumberNext+1
    var newClass;
    if(lastRow.hasClass('r0')) {
        newClass = 'r1';
    } else {
        newClass= 'r0'
    }
    var inputName;
    var inputNameArray;
    var tableName;
    var lastRowClone;
    if(defaultRow != 'noDefault' && (lastRow.clone()).length == 0){
        lastRowClone = defaultRow;
    } else {
        lastRowClone = firstRow.clone();
    }

    if($(table).hasClass('stdTableBasic')) {
        $(table).DataTable().row.add(lastRowClone.addClass('newRow')).draw(false);
    } else {
        tableBody.append('<tr class="newRow">' + lastRowClone.html() + '</tr>');
    }
    $('.newRow td').each(function() {

    // EMPTY OUTPUT td CELLS
    if(emptyRow == true) {
        if($(this).children().length == 0) {
            $(this).text('');
        }
    }

    inputName = $(this).children().attr('name');
    if(inputName) {
        if(emptyRow == true) {
            $(this).children().removeAttr('value');
            $(this).children().prop('value', '');
            $(this).children().prop('checked', false);
        }
        inputNameArray = inputName.split("_");
        tableName = inputNameArray[0];
        $(this).children().attr('name', tableName + '_' + rowNumberNext + '_' + inputNameArray[2]);
    }
    });
    // console.log('TABLENAME:' + tableName);
    $('input[name="' + tableName + '_numRows"]').val(rowCount);
    var hiddenValueRow = $('input[name="' + tableName + '_' + rowNumberCurrent + '"]');
    $('<input type="hidden" name="' + tableName + '_' + rowNumberNext + '" value tabindex="1">').insertAfter(hiddenValueRow);
    $('.newRow').addClass('stdRow');
    $('.newRow').addClass(newClass);
    $('.newRow').removeClass('newRow');
}


/** selectPanelsEv
  * event for checkbox click
  *     getting the panel selected test and method list option values from the #panels table testCodes column 
  * @param ckbox from table
  *
**/
function selectPanelsEv(ckbox){
    let panelTable = $('#panels').DataTable();

    // set table value to if checked or not
    $(ckbox).val($(ckbox).is(':checked'))

    // update cached panels datatable object created at the beginning of document ready. Set draw as false to keep on the same page
    panelTable.rows().invalidate().draw(false);
   
    // get this specific row index
    let rowindex = panelTable.row( $(ckbox).parent('td') ).index();
    // get the panelCode based on this row and column index
    let panelCode = $(panelTable.cell( rowindex, 2 ).data()).val();
    // get the panelName based on this row and column index
    let panelName = panelTable.cell( rowindex, 1 ).data();
    // get the testCode based on this row and column index
    let testCode = $(panelTable.cell( rowindex, 4 ).data()).val();

    selectPanel($(ckbox), panelCode, panelName, testCode);
}

/** 
  * getPanelAssigned
  * 
  *
  * @param panelCodeElement
  *
**/
function getPanelAssigned(panelCodeElement){
    let panelTable = $('#panels').DataTable();
    let panelCodeSelected = $(panelCodeElement).val();
    let testCodeList = [];
    //loop through panels datatable object created at the beginning of document ready
    panelTable.rows().every( function ( rowIdx, tableLoop, rowLoop ) {

        // get rows panelCode based on row and column indexes
        let panelCode = $(panelTable.cell( rowIdx, 2 ).data()).val();

        if(panelCodeSelected === panelCode){
            testCodeList = $(panelTable.cell( rowIdx, 4 ).data()).val();
        }
    } );

    // generate test and method code options pased on testCodeList
    panelAssigned(panelCodeElement, testCodeList )
}

$(document).ready(function() {
    hideColumns('#panels', 'hideColumn');
    $('#allTestsHaveBeenAssignedMessage').hide();
    $('#specimenInfoTable .specimenInfo_testSelection').hide();
    $('#specimenInfoTable .specimenInfo_panelSelection').hide();
    $('.specimenInfo_testMethod').hide();
    $('#specimenInfoTable .specimenInfo_panelSelection').parent().append('<br /><button class="specimenInfo_addTest" type="button"> Add Run</button>');
    $('#specimenInfoTable .specimenInfo_addTest').hide();
    $('#specimenInfoTable_RecievedAddTest .specimenInfo_testSelection').hide();
    $('#specimenInfoTable_RecievedAddTest .specimenInfo_panelSelection').parent().append('<br /><button class="specimenInfo_addTest" type="button"> Add Run</button>');
    $('#specimenInfoTable_RecievedAddTest .specimenInfo_addTest').hide();


    // create datatable for panels
    let panelTable = stdTableBasic("#panels", true);
    $('#panels').removeAttr('style')


    // loop through panels datatable for each row and call the selectPanelsEv function
    panelTable.rows().every( function ( rowIdx, tableLoop, rowLoop ) {
        let checkbox = $(panelTable.cell( rowIdx, 0 ).data());
        if(checkbox.val() === "true"){
            let panelCode = $(panelTable.cell( rowIdx, 2 ).data()).val();
            let panelName = panelTable.cell( rowIdx, 1 ).data();
            let testCode = $(panelTable.cell( rowIdx, 4 ).data()).val();

            selectPanel($(checkbox), panelCode, panelName, testCode);
        }
    });



    $('.specimenInfo_IsAddTest').each(function() {
        let specimenVal = $(this).parent().siblings().children('.specimenInfo_specimenId').val();
        $(this).attr('specimen', specimenVal);
        if(specimenVal != '') {
            $(this).parent().siblings().children('.specimenInfo_testSelection').show();
            $(this).parent().siblings().children('.specimenInfo_testMethod').show();
        }
    });


    $('#specimenInfoTable_RecievedAddTest > tbody > tr > td').children('.specimenInfo_specimenId').each(function() {
        let originalSpecimenValue = $(this).parent().siblings().children('.specimenInfo_IsAddTest').attr('specimen');

        // manage changing specimen id after additional runs have been added
        let newSpecimenValue = $(this).val();
        if($(this).val() != '' && $(this).val() != originalSpecimenValue) {
            $('tr[specimen="'+ originalSpecimenValue +'"]:gt(0)').children('td').children('.specimenInfo_panelSelection, .specimenInfo_testSelection, .specimenInfo_testMethod').val('');
            $('tr[specimen="'+ originalSpecimenValue +'"]:gt(0)').hide();
            $('tr[specimen="'+ originalSpecimenValue +'"]').attr('specimen', newSpecimenValue);
        }

        $(this).parent().siblings().children('.specimenInfo_IsAddTest').attr('specimen', $(this).val());
        if($(this).val().length > 0) {
            $(this).parent().siblings().children('.specimenInfo_panelSelection').show();
            $(this).parent().siblings().children('.specimenInfo_panelSelection').addClass('required');
            $(this).parent().siblings().children('.required').attr('data-parsley-required', 'true');
            $(this).parent().siblings().children('.specimenInfo_testSelection').show();
            $(this).parent().siblings().children('.specimenInfo_testMethod').show();
            $(this).parent().parent('tr').attr('specimen', $(this).val());
        } else {
            $(this).parent().siblings().children('.specimenInfo_panelSelection').show();
            $(this).parent().siblings().children('.sampleReceiving.required').removeAttr('data-parsley-required');
            // $(this).parent().siblings().children('.specimenInfo_panelSelection').removeClass('required');
            $(this).parent().siblings().children('.specimenInfo_testSelection').show();
            $(this).parent().siblings().children('.specimenInfo_testMethod').show();
            $(this).parent().siblings().children('.specimenInfo_panelSelection').val('');
            $(this).parent().siblings().children('.specimenInfo_testSelection').val('');
            $(this).parent().siblings().children('.specimenInfo_testMethod').val('');
            $(this).parent().parent('tr').removeAttr('specimen');
        }
    })


    $('#specimenInfoTable_Recieved .specimenInfo_specimenId').each(function() {
        let thisRow = $(this).parent('td').parent('tr');
        let prevRow = $(this).parent('td').parent('tr').prev();
        if(prevRow) {
            if(thisRow.children('td').children('.specimenInfo_specimenId').val() == prevRow.children('td').children('.specimenInfo_specimenId').val()) {
                thisRow.children('td').children(':not(.specimenInfo_specimenId, .specimenInfo_testSelection, .specimenInfo_testMethod, .specimenInfo_panelSelection)').hide();
                thisRow.children('td').children('.specimenInfo_specimenId').css('visibility', 'hidden'); 
                thisRow.children('td').css('background-color', 'linen');
                thisRow.children('td').children('.specimenInfo_IsAddTest').val(1);
                thisRow.children('td').children('.specimenInfo_IsAddTest').attr('value', 1);
            }
        }
    });

    $('#specimenInfo_TestsToBeAssigned').css('padding-left', '100px');
    if($('#instance').val() != 'New') {
        $('#panels > tbody').css('border-left', '3px solid #f44336 !important');
    }

    $('.specimenInfo_testSelection').each(function() {
        let methodSelected = $(this).parent().siblings().children('.specimenInfo_testMethod').val();
        let method = $(this).parent().siblings().children('.specimenInfo_testMethod');
        let testCode = $(this).val();
        if(testCode != '') {

          method.parent().parent('tr').attr('testmethod', testCode + methodSelected);

          method.load('/uniflow',{
                stepName: 'Ajax get methods for tests',
                testCode: testCode
            }, function() {
                method.val(methodSelected)
            })

        } else {
           method.parent().parent('tr').removeAttr('testmethod')
        }
    });

    $('.lockReceived').each(function() {
        let testArray = $(this).val().split('|');
        $(this).val(testArray[0]);
        $(this).attr('value',testArray[0]);
        let testName = testArray[1];
        if(testName == undefined || testName == null) {
            testName = '';
        }
        $(this).parent().prepend('<input type="text" readonly="true" value="' + testName + '"/>');
        $(this).hide();
    });



    if( $('.addNewTest').val() == 'true' && $('#isReceiving').val() == 'false'){
        $('.specimenInfo_panelSelection').removeAttr('required');
        $('.specimenInfo_panelSelection').removeAttr('data-parsley-required');
        $('.specimenInfo_panelSelection').removeClass('required');
    }

    // enter specimen for receiving
    $('.specimenInfo_specimenId').change(function() {
        var originalSpecimenValue = $(this).parent().siblings().children('.specimenInfo_IsAddTest').attr('specimen');

        // manage changing specimen id after additional runs have been added
        var newSpecimenValue = $(this).val();
        if($(this).val() != '' && $(this).val() != originalSpecimenValue) {
            $('tr[specimen="'+ originalSpecimenValue +'"]:gt(0)').children('td').children('.specimenInfo_panelSelection, .specimenInfo_testSelection, .specimenInfo_testMethod').val('');
            $('tr[specimen="'+ originalSpecimenValue +'"]:gt(0)').hide(); // Not sure this should be hiding instead of removing.
            $('tr[specimen="'+ originalSpecimenValue +'"]').attr('specimen', newSpecimenValue);
        }

        $(this).parent().siblings().children('.specimenInfo_IsAddTest').attr('specimen', $(this).val());
        if($(this).val().length > 0) {
            $(this).parent().siblings().children('.specimenInfo_panelSelection').show();
            $(this).parent().siblings().children('.specimenInfo_panelSelection').addClass('required');
            $(this).parent().siblings().children('.required').attr('data-parsley-required', 'true');
            $(this).parent().siblings().children('.specimenInfo_testSelection').show();
            $(this).parent().siblings().children('.specimenInfo_testMethod').show();
            $(this).parent().parent('tr').attr('specimen', $(this).val());
        } else {
            $(this).parent().siblings().children('.specimenInfo_panelSelection').show();
            $(this).parent().siblings().children('.sampleReceiving.required').removeAttr('data-parsley-required');
            $(this).parent().siblings().children('.specimenInfo_testSelection').show();
            $(this).parent().siblings().children('.specimenInfo_testMethod').show();
            $(this).parent().siblings().children('.specimenInfo_panelSelection').val('');
            $(this).parent().siblings().children('.specimenInfo_testSelection').val('');
            $(this).parent().siblings().children('.specimenInfo_testMethod').val('');
            $(this).parent().parent('tr').removeAttr('specimen');
        }
    });


    $('.specimenInfo_addTest').click(function() {
        let thisRow = $(this).parent('td').parent('tr');
        let thisRowSpecimen = thisRow.attr('specimen');
        let thisRowPanel = thisRow.children('td').children('.specimenInfo_panelSelection').val();
        let thisRowTest = thisRow.children('td').children('.specimenInfo_testSelection').val();
        let thisTableId = thisRow.parent('tbody').parent('table').attr('id');
        let thisRowValues = [];
        let filedName;
        let colNo;
        let fieldVal;
        thisRow.children('td').each(function() {
            filedName = $(this).children('input, select, textarea').attr('name');
            colNo = filedName.substr(filedName.lastIndexOf("_") +1);
            fieldVal = $(this).children('input, select, textarea').val();
            thisRowValues.push({colNo,fieldVal});
        });
        specimenInputTableAddRow(thisTableId, true);
        let newRow = $('#'+ thisTableId +' tbody tr').last();
        newRow.children('td').css('background-color', 'linen');

        thisRow.after(newRow);

        // unbinds and then binds change event for all editable fields in parent row. (must do unbind first to prevent duplicates)
        thisRow.children('td').children(':not(.specimenInfo_specimenId .specimenInfo_testSelection, .specimenInfo_testMethod, .printBarcodeBtn, br, .specimenInfo_addTest,.specimenInfo_specimenIdReference, .specimenInfo_IsAddTest)').unbind("change", updateChildRowFields);
        thisRow.children('td').children(':not(.specimenInfo_specimenId .specimenInfo_testSelection, .specimenInfo_testMethod, .printBarcodeBtn, br, .specimenInfo_addTest, .specimenInfo_specimenIdReference, .specimenInfo_IsAddTest)').bind("change", updateChildRowFields);


        $.each(thisRowValues, function(index, data) {
            newRow.children('td').children('[name$="'+data.colNo+'"]').not('.specimenInfo_testSelection, .specimenInfo_testMethod, .specimenInfo_panelSelection').val(data.fieldVal);
        })

        newRow.children('td').children('.printBarcodeBtn').remove();
        addPrintButtonAfter(newRow.children('td').children('.specimenInfo_specimenId'));


        newRow.children('td').children('.specimenInfo_addTest').remove();
        newRow.children('td').children('input.specimenInfo_specimenIdReference').val(thisRowSpecimen);
        newRow.children('td').children('input.specimenInfo_IsAddTest').val('1');
        newRow.children('td').children('.specimenInfo_specimenId, .specimenInfo_testSelection, .specimenInfo_testMethod, .specimenInfo_panelSelection').val('');
        newRow.children('td').children(':not(.specimenInfo_testSelection, .specimenInfo_testMethod, .specimenInfo_panelSelection, .printBarcodeBtn)').hide();
        newRow.children('td').children(':not(.specimenInfo_testSelection, .specimenInfo_testMethod, .specimenInfo_panelSelection)').removeAttr('readonly');
        newRow.children('td').children('.specimenInfo_testSelection, .specimenInfo_testMethod, .specimenInfo_panelSelection').show();
        newRow.children('td').children('.specimenInfo_panelSelection').parent().append('<div class="cancelRun inline-block">X</div>');
        newRow.children('td').children('.sampleReceiving, .specimenEntry').removeAttr('data-parsley-required');
        newRow.children('td').children('.sampleReceiving, .specimenEntry').removeClass('required');
        newRow.children('td').children('.sampleReceiving, .specimenEntry').removeAttr('required');
        newRow.attr('specimen', thisRowSpecimen);


        if(newRow.children('td').children('.specimenInfo_testSelection').children('.isTest').length = 1) {
            thisRow.children('td').children('.specimenInfo_addTest').hide();
        }
        newRow.children('td').children('.specimenInfo_panelSelection').change(function() {
            getPanelAssigned($(this));
        });
        newRow.children('td').children('.specimenInfo_testSelection').change(function() {
          panelHighlighting();
        });

        let specimenIdField = newRow.children('td').children('.specimenInfo_specimenId');

        //create a deep copy
        let specimenIdClone = specimenIdField.clone(true);

        //strip copy to prevent uniflow submit errors
        specimenIdClone.val(thisRowSpecimen).removeClass().attr("name", "");

        //insert clone after original field. Do not change this or field nameing changes.
        specimenIdClone.insertBefore(specimenIdField);

        specimenIdClone.show().css('visibility', 'hidden');
    });

    $('#panels_clear').click(function() {
        // uncheck all checkboxes
        $('input.panels_selectPanel', panelTable.cells().nodes()).prop('checked',false);
        // set all unchecked checkboxes value to false
        $('input.panels_selectPanel', panelTable.cells().nodes()).val('false');
        // redraw table
        panelTable.draw();

        // loop through each checkbox and call the selectPanelsEv function (this function is called on click of the checkbox)
        // this loop will trigger the cleaning of the Test(s) needing assignment section and the panels and test options available for specimen as well as the proband test selection
        $('input.panels_selectPanel', panelTable.cells().nodes()).each(function(){
            selectPanelsEv($(this));
        })
        // remove now unlinked options for tests selection and methods
        $('.specimenInfo_testSelection').children('option[value]').remove();
        $('.specimenInfo_testMethod').children('option[value]').remove();

    });


    $('.panels_selectPanel').click(function(){
        selectPanelsEv($(this))
    });

    onClickElementArr = ['#panels_paginate .paginate_button', '#panels_paginate thead th', '#panels_paginate .dataTables_length select', '#panels_paginate input[type="search"]'];
    for (var i = 0; i < onClickElementArr.length; i++) {
        $(document).on('click', onClickElementArr, function() {
            hideColumns('#panels', 'hideColumn');
            $('.panels_selectPanel').click(function(){
                selectPanelsEv($(this))
            });
        });
    }

    // removes parsley error message once corrected
    $(document).on('change', '.specimenInfo_receivedTime', function() {
        var parsleyId = $(this).attr('data-parsley-id');
        $(this).attr('value', $(this).val());
        $('#parsley-id-'+ parsleyId).hide();
    });

    $(document).on('change', '.specimenInfo_panelSelection', function() {
        $(this).attr('value', $(this).val());
        getPanelAssigned($(this));
    });

    $(document).on('change', '.specimenInfo_testSelection', function() {
        $(this).attr('value', $(this).val());
        panelHighlighting();

        // GET METHOD OPTION

        let method = $(this).parent().siblings().children('.specimenInfo_testMethod');
        let testCode = $(this).val();
        let thisRow = $(this).parent().parent('tr');

        method.load('/uniflow',{
            stepName: 'Ajax get methods for tests',
            testCode: testCode
          }, function() {

            if(method.children('option').length > 1) {
                method.prepend('<option></option>');
                method.val('');
                method.focus();
            } else {
                var specimenId = thisRow.attr('specimen');
                var testMethod = testCode + method.val();
                thisRow.attr('testmethod', testMethod);
            }
        })
        if(testCode == '') {
            thisRow.removeAttr('testmethod');
        }
    });

    $(document).on('change', '.specimenInfo_testMethod', function() {
        $(this).attr('value', $(this).val());
        var thisRow = $(this).parent().parent('tr');
        var methodSelected = $(this).val();
        var testCode = $(this).parent().siblings().children('.specimenInfo_testSelection').val();
        var specimenId = thisRow.attr('specimen');
        if(methodSelected != '') {
            var testMethod = testCode + methodSelected
            thisRow.attr('testmethod', testMethod);
        } else {
            thisRow.removeAttr('testmethod');
        }
    });

    $(document).on('click', '.cancelRun', function() {
        var specimenId = $(this).parent().siblings().children('.specimenInfo_specimenIdReference').val();
        $(this).siblings('select').val('');
        $(this).siblings('select').attr('value', '');
        $(this).parent().siblings().children('.specimenInfo_testSelection, .specimenInfo_testMethod').val('');
        $(this).parent().siblings().children('.specimenInfo_testSelection, .specimenInfo_testMethod').attr('value','');
        panelHighlighting();
        $(this).parent().parent('tr').hide();
        $('.specimenInfo_IsAddTest[value="0"][specimen="'+ specimenId +'"]').parent().siblings().children('.specimenInfo_addTest').show();
    });
});


