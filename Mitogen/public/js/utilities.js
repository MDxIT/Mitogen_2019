/**
 * Frameshift
 * JavaScript Utilities
 *
 * @author Harley Newton
 * @copyright 2017 Sunquest Information Systems
 * @version 1.1.20171016
 */

/**
 * Select checkbox if input is found in table
 *
 * @param {string} table_el
 * @param {string} input_el - input to search for
 * @param {string} search_el - element(s) to search over
 */
function selectFoundInputCheckbox(table_el, input_el, search_el) {
  $(input_el).on('change input', function() {
    var input_value = $(this).val().trim();

    if (input_value == '') { return false; }

    if ($.fn.DataTable.isDataTable(table_el)) {
      var table = $(table_el).DataTable();
      table.rows().every(function (rowIdx, tableLoop, rowLoop) {
        var node = this.node();
          $(search_el, node).each(function(i, v) {
            var column_index = table.column(this).index();
            var search_value = $(v).val() || $(v).text();
            if (search_value == input_value) {
              $('input[name$="_1"]', node).prop('checked', true);
              table.page.jumpToData(search_value, column_index);
            }
          });
      });
    }
    else {
      $(search_el).each(function(i, v) {
        var search_value = $(v).val() || $(v).text();
        if (search_value == input_value) {
          $(v).closest('tr').find('input[name$="_1"]').prop('checked', true);
        }
      });
    }

    setTimeout(function() {
      $(input_el).val('');
      $(input_el).focus();
    }, 500);

    return false;
  });
}

/**
 * Legacy functions
 * @todo Update
 */
/**
 * Fix date
 *
 * @param {string} elem
 * @returns sets value to MM/DD/YYYY
 */
function fixDate(elem) {
   var date = elem.val();
   var month = 0;
   var day = 0;
   var year = 0;
   if(date != ''){
     //All is well, move on...
     if(/^(\d|\d\d)\/(\d|\d\d)\/\d\d\d\d$/.test(date)){
       return true;
     }
     if(date.indexOf('/') == -1) {
       month = date.substr(0,2);
       day = date.substr(2,2);
       year = date.substr(4);
     } else if(/^(\d|\d\d)\/(\d|\d\d)\/\d\d$/.test(date)){
       var dateParts = date.split('/');
       month = dateParts[0];
       day = dateParts[1];
       year = dateParts[2];
       console.log(year);
     } else if(/^(\d|\d\d)\/(\d|\d\d)$/.test(date)){
       var dateParts = date.split('/');
       month = dateParts[0];
       day = dateParts[1];
       year = '';
     } else {
       alert('Date format is incorrect. Please change.');
       elem.focus();
       elem.select();
       return false;
     }
     var thisYear = new Date().getFullYear();
     if(year == '' || year == null) year = thisYear;
     if(String(thisYear) != year) {
       year = parseInt(year, 10);
       var thisCentury = parseInt(String(thisYear).slice(0, 2)+'00', 10);
       var lastCentury = thisCentury-100;
       if(year+thisCentury > thisYear){
         year = year+lastCentury;
       } else if(year+lastCentury - (thisYear-90) < 0){
         year = year+thisCentury;
       } else{
         year = year+lastCentury;
       }
     }
     elem.val(month+'/'+day+'/'+year);
   }
 }

/**
 * Is date
 *
 * @param {string} date
 */
function isDate(date) {

  $.getJSON('/uniflow?callback=?&stepName=isDate&date=' + date.val(),{},
    function(data,status) {
    if (data[0].isDate == 'NOT A DATE') {
      alert(date.val() + ' is not a valid date. Please change.');
          date.focus();
          date.select();
          date.val('');
    }
  });
}
// End Legacy functions


/**
 * Prevent carriage return on text input
 * (e.g. input scanned in from barcode scanner suffixed with a return)
 */
function preventReturnOnInput() {
  $('body').on('keyup keypress', 'input[type="text"]', function(e) {
    var code = e.keyCode || e.which;
    if (code == 13) {
      e.preventDefault();
      return false;
    }
  });
}

/**
 * Prevent double form submissions
 */
function preventDoubleFormSubmit() {
  $('form').on('submit', function() {
    $('input[type="submit"]').on('click', function() {
      return false
    });

    $(this).submit(function() {
      return false;
    });

    return true;
  });
}

/**
 * Place focus on first input field
 *
 * @param {string} focusTypes
 */
function placeFocus(focusTypes) {
  var defualtFocusTypes = 'input[type="text"], textarea, select';
  var focusTypes = (typeof focusTypes == "undefined") ? defualtFocusTypes : focusTypes;
  $('form').find(focusTypes).not('[readonly]').filter(':visible:first').focus();
}

/**
 * Progress indicator for form submissions
 *
 * @param {string} cmd - start, stop
 * @param {string} submitButton
 */
function progressIndicator(cmd, submitButton) {

  var html = '<p id="processingSubmit">&nbsp;&nbsp;&nbsp;<span class="progress-icon"></span>&nbsp;Processing...</p>';
  var btn = (typeof submitButton == 'undefined') ? '#stepFormSubmitButton' : submitButton;

  switch (cmd) {
    case 'start':
      $(btn).after(html);
      $(btn).prop('disabled', true).addClass('disabled-button');
      $(btn).addClass('disabled-button');
      break;
    case 'stop':
      $(btn).prop('disabled', false).removeClass('disabled-button');
      $('#processingSubmit').remove();
      break;

    default:
      console.log('Foobar!');
      break;
  }
}

/**
 * HTML Entities
 * Convert special characters to HTML entities.
 *
 * @example
 * htmlEntities($(selector).prop('outerHTML'))
 * htmlEntities(document.getElementById("id").outerHTML)
 *
 * script
 *   - var html = htmlEntities($(selector).prop('outerHTML'));
 *   -
 *
 * @see http://stackoverflow.com/a/8519356
 * @see http://stackoverflow.com/questions/18749591/encode-html-entities-in-javascript
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/charCodeAt
 *
 * @param {string} html
 * @returns {string} Encoded HTML
 */
function htmlEntities(html) {

  var encodedHtml = html.replace(/[\u00A0-\u9999]/g, function(match) {
    return "&#" + match.charCodeAt(0) + ";";
  });

  return encodedHtml;
}

/**
 * Unescape carriage returns and newlines
 *
 * @param {string} str
 * @returns {string}
 */
function unescapeNewlines(str) {

  return str.replace(/(\\r)|(\\n)/g,"\n");
}

/**
 * Escape carriage returns and newlines
 *
 * @param {string} str
 * @returns {string}
 */
function escapeNewlines(str) {

  var s = str.replace(/(\r)/g,"\\r");
  return s.replace(/(\n)/g,"\\n");
}

/**
 * Newlines to br
 *
 * @param {string} str
 * @returns {string}
 */
function nl2br(str) {

  return str.replace(/(\n)/g,"<br>");
}

/**
 * Get URL path
 *
 * @returns {string}
 */
function getUrlPath() {

  return location.protocol + "//" + location.host + location.pathname;
}

/**
 * Check for ajax POST form errors
 *
 * @param {object} html - the parsed html object from ajax post $.parseHTML()
 * @returns {string|false} error message or false if no error
 */
function checkPostError(html) {

  if ($(html).find('#systemExceptionForm').length > 0) {
    return $(html).find('#exceptionMessage').text();
  }

  if ($(html).find('#systemException').length > 0) {
    return $(html).find('#systemException').text();
  }

  if ($(html).find('#errorId').length > 0) {
    return $(html).find('#errorId').text();
  }

  if ($(html).find('#execerror').length > 0) {
    return $(html).find('#execerror').text();
  }

  return false;
}

/**
 * Set form input file name to hidden field on change
 *
 * @param {string} inputFile
 * @param {string} fileName
 */
function setInputFileName(inputFile, fileName) {
  $(inputFile).change(function() {
      var inputFileName = $(this).val();
        $(fileName).val(inputFileName.replace("C:\\fakepath\\", ""));
    });
}

/**
 * Set select options
 *
 * @param {string} el
 * @param {string} step
 */

function setSelectOptions(el, step) {

  var getData = {
    "stepName": step
  };

  $.getJSON('uniflow?callback=?', getData)
  .done(function(data) {
    if (data && data != '') {
      var selectOptions = [];
      $.each(data, function(key, val) {
        selectOptions.push("<option value='" + val.value + "'>" + val.display + "</option>");
      });
    }

    $(el).html(selectOptions.join(''));
  })
  .fail(function(jqxhr, textStatus, error) {
    var err = textStatus + ", " + error;
    console.log("Request Failed: " + err);
  });
}

/**
 * Create random id
 *
 * @param {int} len
 * @return {string}
 */
function createRandomId(len) {

  var id_length = (typeof len == "undefined") ? 8 : len;

  var id = "";
    var chars = "abcdefghijklmnpqrstuvwxyz123456789";

    for (var i=1; i < id_length; i++ ) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  id += Math.floor(Math.random() * (9 - 1) + 1);

    return id;
}

/**
 * Get URL Parameters
 *
 * @returns {object}
 * @see http://stackoverflow.com/a/2880929/7311141
 */
function getUrlParams() {

  var urlParams;
  (window.onpopstate = function () {
    var match,
    pl = /\+/g, // Regex for replacing addition symbol with a space
    search = /([^&=]+)=?([^&]*)/g,
    decode = function (s) {
      return decodeURIComponent(s.replace(pl, " "));
    },
    query = window.location.search.substring(1);

    urlParams = {};
    while (match = search.exec(query)) {
      urlParams[decode(match[1])] = decode(match[2]);
    }
  })();

  return urlParams;
}

/**
 * Check if valid JSON
 *
 * @param str
 * @returns boolean
 * @see http://stackoverflow.com/a/20392392
 */
function isJSON(str) {

  try {
    var o = JSON.parse(str);
    if (o && typeof o === "object") {
      return true;
    }
  }
  catch (e) {
    console.log(str);
    console.log(e);
    alert("Invalid JSON...");
  }

  return false;
}


/**
 * Hide Columns in Input table
 *
 * @param tableId - id of table to hide columns, include #
 * @param hideClass - class of column input in column to be hidden, no .
 *
 */

function hideColumns(tableId, hideClass) {
  $(tableId + ' tr:eq(1) .'+hideClass).each(function() {
    var columnIndex = $(this).parent('td').index();
    $(tableId +' tr').each(function() {
      $(this).children('th:eq('+ columnIndex +')').hide();
      $(this).children('td:eq('+ columnIndex +')').hide();
    });
  });
}

/**
 * Set to read only inputs with values.
 *
 * @param inputClass - class of inputs to set to read only when not blank
 *
 */

function lockNonEmptyInputs(inputClass) {
  $('.' + inputClass).each(function() {
    console.log();
    if ($(this).val().length > 0) {
        $(this).css('background-image', 'none');
        $(this).attr('tabindex', 999999);
      if($(this).is('input')) {
        $(this).prop('readonly', 'true');
      } else if ($(this).is('select')) {
        $(this).prop('disabled', 'true');
      }
      }
  });
}



/**
  *
  * Get Sequence and populate value on screen
  *
  * @param sequence - sequence name to match a sequence value in the sequenceName column of sequences table
  * @param destination - input object of which value can be set to the result seqeunce
  * @param callbackFunction - optional function to run on .done
  *
**/

function getAndPlaceNextSequence (sequence, destination, outputVariable, callbackFunction) {
  var getData = {
      "stepName": 'Ajax Get Next Sequence',
      "sequence": sequence,
      "outputVariable": outputVariable
    };
  $.getJSON("/uniflow?callback=?", getData)
    .done( function(data, status) {
    destination.val(data[0].sequenceValue);
    destination.attr("value", data[0].sequenceValue);

    if (typeof callbackFunction === 'function') {
      callbackFunction();
    }

  });
}

/**
  *
  * Remove row of input table
  *
  * @param tableName and row passed from select of 'x' created in inputTableAddRowWithRemove
  *
**/
function removeRow(tableName, thisElement) {
      var tableId = thisElement.siblings().parent().parent().parent().attr("id");
      var curRowCount = $('input[name="' + tableName + '_numRows"]').val();
      var newRowCount = curRowCount -1;
      thisElement.siblings().parent().remove();

      var inRow = 0;
      $('#'+tableId + ' tbody tr').each(function() {
          if(inRow % 2 == 0)
          {
             $(this).attr('class', "stdRow r0");
          }
          else
          {
            $(this).attr('class', "stdRow r1");
          }
          var inCol = 1;
        $(this).children('td').each(function() {
          if($(this).find("input[name^='"+tableName+"']")) {
              var tdInput = $(this).find("[name^='"+tableName+"']");
              tdInput.attr('name', tableName+'_'+inRow+'_'+inCol);
          }
          inCol += 1;
        });
          inRow += 1;
      });
      $('input[name="' + tableName + '_numRows"]').val(newRowCount);
      $('input[type=hidden][name="'+tableName+'_'+newRowCount+'"]').remove();

}

/**
  *
  * Add row to input table with remove option
  *
  * @param tableId - table element id for add row functionality, do not include #
  *
**/

function inputTableAddRowWithRemove(table, emptyRow, defaultRow = 'noDefault') {
  // var table = tableStrRaw;
  // // #389201 Added backwards compatibility. Recent change made this function
  // // more flexible such that you can specify a class or id
  // if(table[0] != "#") {
    table = "#" + table;
  // }
  var tableBody = $(table + ' tbody');
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
    //remove anything with class ignore (the remove row 'X')
    lastRowClone.find('.ignore').remove();
  } else {
    lastRowClone = lastRow.clone();
    //remove anything with class ignore (the remove row 'X')
    lastRowClone.find('.ignore').remove();
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
  console.log('TABLENAME:' + tableName);
  $('input[name="' + tableName + '_numRows"]').val(rowCount);
  var hiddenValueRow = $('input[name="' + tableName + '_' + rowNumberCurrent + '"]');
  $('<input type="hidden" name="' + tableName + '_' + rowNumberNext + '" value tabindex="1">').insertAfter(hiddenValueRow);
  $('.newRow').addClass('stdRow');
  $('.newRow').addClass(newClass);
  $('.newRow').append('<td class="removeRow ignore" onClick=removeRow("splitSamples",$(this)) >X</td>');
  $('.newRow').removeClass('newRow');

}




/**
  *
  * Add row to input table
  *
  * @param tableId - table element id for add row functionality, do not include #
  *
**/

function inputTableAddRow(table, emptyRow, defaultRow = 'noDefault') {
  // var table = tableStrRaw;
  // // #389201 Added backwards compatibility. Recent change made this function
  // // more flexible such that you can specify a class or id
  // if(table[0] != "#") {
    table = "#" + table;
  // }
  var tableBody = $(table + ' tbody');
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
    lastRowClone = lastRow.clone();
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
  console.log('TABLENAME:' + tableName);
  $('input[name="' + tableName + '_numRows"]').val(rowCount);
  var hiddenValueRow = $('input[name="' + tableName + '_' + rowNumberCurrent + '"]');
  $('<input type="hidden" name="' + tableName + '_' + rowNumberNext + '" value tabindex="1">').insertAfter(hiddenValueRow);
  $('.newRow').addClass('stdRow');
  $('.newRow').addClass(newClass);
  $('.newRow').removeClass('newRow');
}


/**
  *
  * Disable checked rows
  *
  * @param tableId - table element id for add row functionality
  *
**/
function disableRows(tableId){
  $('#'+tableId+' input[type=checkbox]').each(function(){
    if (this.checked) {
      $(this).parent('td').siblings().children().addClass(tableId+"_disabled");
      $(this).parent('td').siblings().children().addClass("disabled");
      $("."+tableId+"_disabled").prop({disabled:true});

    } else {
      $("."+tableId+"_disabled").prop({disabled:false});
      $(this).parent('td').siblings().children().removeClass(tableId+"_disabled");
      $(this).parent('td').siblings().children().removeClass("disabled");
    }
  });
}


/**
  *
  * Sets disabled prop to false for items with paramete class
  *
  * @param {string} class to be enabled.
  *
**/
function enableDisabledByClass(string){
    $("'." + string + "'").prop({disabled:false});
}


function uniqueResultsArrayOfObj (arrayOfObj, key) {
  return arrayOfObj.filter(function (item, index, array) {
    return array.map(function (mapItem) {
      return mapItem[key];
    }).indexOf(item[key]) === index;
  });
}


/**
 * Returns array of all duplicated values in the array.
 *
 * @param {array} array to check for duplicates
 * @returns {array} unique duplicates
 *
 */
function checkArrayForDuplicates(array){
  var sortedArray = array.slice().sort();
  var duplicates = [];

  for ( i = 0; i < sortedArray.length - 1; i++){
    if (sortedArray[i] == sortedArray[i+1]){
      duplicates.push(sortedArray[i]);
    }
  }

  return duplicates.filter( onlyUnique )

}

/**
 * Returns array of all duplicated values in the array.
 *
 * @param {array} array to check for duplicates
 * @returns {array} unique duplicates
 *
 */
function checkArrayForDuplicatesCaseInsensitive(array){
  var sortedArray = array.slice().sort();
  var duplicates = [];
  for ( i = 0; i < sortedArray.length - 1; i++){
    sortedArray[i].toUpperCase();
  }

  for ( i = 0; i < sortedArray.length - 1; i++){
    if (sortedArray[i] == sortedArray[i+1]){
      duplicates.push(sortedArray[i]);
    }
  }

  return duplicates.filter( onlyUnique )

}


/**
 * Returns array of all values duplicated between two arrays.
 *
 * @param {array} array
 * @param {array} array to check for duplicates
 * @returns {array} unique duplicates
 *
 */
function compareArraysForDuplicates(array1, array2) {

  var array1Filtered = array1.filter( onlyUnique );
  var array2Filtered = array2.filter( onlyUnique );

  var combinedArray = array1Filtered.concat(array2Filtered);

  var duplicates = checkArrayForDuplicates(combinedArray);

  return duplicates;

}

function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}

function checkAllCkbxForTable(tableId, checkboxClass, checkedValue){
  $(tableId + ' .' + checkboxClass).val(checkedValue);
  $(tableId + ' .' + checkboxClass).prop('checked', checkedValue);
}



function fixLabel() {
  $('td.label, td.newLabel').each(function() {
    var siblingInput = $(this).next();
    siblingInput.prepend($(this));
  });
}

function hideTableIfEmpty(table, msg) {
  $(table).each( function() {
    if($(this).children('tbody').children('tr').length == 0) {
      $(this).hide();
      if(msg !== undefined) {
        $(this).before('<p>' + msg + '</p>');
      }
    }
  });
}



/**
 * Loops through each td in output table, checks for db date format YYYY-MM-DD and converts to specified _dateFormat
 *
 * @param {table} class or id of table to update
 *
 */
function convertOutputTableDateFormats(table, dateFormat) {
  $(table + ' td').each(function() {
    var colValue = moment($(this).text(), 'YYYY-MM-DD', true);
    var momentDateFormat = moment().toMomentFormatString(dateFormat);
    if(colValue.isValid()) {
      $(this).text(moment(colValue).format(momentDateFormat));
    }
  });
}


function convertValueDateFormat(value, dateFormat) {
    var momentValue = moment(value, 'YYYY-MM-DD', true);
    if(momentValue.isValid()) {
        var momentDateFormat = moment().toMomentFormatString(dateFormat);
        return moment(momentValue).format(momentDateFormat);
    }
    return undefined;
}



function hideColumnByName(table, columnName, removeBool) {
    var $table = $(table).closest('table');
    $table.find('thead tr th').filter(function() {
        return $(this).text() === columnName;
    }).each(function() {
        var idx = $(this).index();
        var $column = $table.find('td:eq(' + idx + '),th:eq(' + idx + ')');
        if(removeBool === true) {
            $column.remove();
        } else {
            $column.hide();
        }
    });
};


function hideColumnBasedOnConfig(table, configId, header, removeBool) {
    if($(configId).val() == 'No') {
        hideColumnByName(table, header, removeBool);
    }
}


/**
 * Creates and displays an empty modal with upper close button.
 *
 * @function initEmptyModal
 * @requires jquery
 * @param {string} modalId - Id for div modal will populate
 * @param {string} title - modal title
 * @param {number} width - width for the modal
 * @param {number} height - height for the modal
 * @param {function} callbackfunction - function to call on modal close
 * @returns {object} the initialized dialog object.
 */
function initEmptyModal(modalId,title,width, height, callbackfunction){
  var dialog = $( "#"+modalId ).dialog({
    resizable: true,
    autoOpen: false,
    height: height,
    width: width,
    modal: true,
    closeOnEscape: true,
    title: title,
    buttons: {},
    close: function() {
      $('#'+modalId).html('');
      $('#'+modalId).dialog("close");
      if(typeof callbackfunction === 'function'){
        callbackfunction();
      }
    }
  });
  return dialog;
}



/**
 * Builds the html for the confirmation modal.
 *
 * @function confirmDialogFromModalHTML
 * @param {string} confirmText - text to display in a confirmation modal
 * @returns {string} the html to display inside the modal window
 */
function confirmDialogFromModalHTML(confirmText){
  let modalHTML = '';
  modalHTML +=   '<div id="confrmationModalSection">'
  modalHTML +=   '<div class="boldText">'+confirmText+'</div>'
  modalHTML +=   '<div class="confirmButtonsSections">'
  modalHTML +=     '<button class="confirmDialogCancel confirmButtons" id="confirmDialogCancel" type="button" title="Cancel">Cancel</button>';
  modalHTML +=     '<button class="confirmDialogAccept confirmButtons" id="confirmDialogAccept" type="button" title="Confirm">Confirm</button>';
  modalHTML +=   '</div>';
  modalHTML +=   '</div>';
  return modalHTML;
}




/**
 * Checks to see if the modal is open and if it is it closes the modal specified
 *
 * @function closeCurrentModal
 * @param {string} modalId - Id for div modal
 */
function closeCurrentModal(modalId){
  if($('#'+modalId).hasClass('ui-dialog-content')){
    if($('#'+modalId).dialog('isOpen')){
      $('#'+modalId).html('');
      $('#'+modalId).dialog("close");
    }
  }
}



/**
 * Creates and displays a modal on the center of the screen.
 *
 * @function initCenterModal
 * @requires jquery
 * @param {string} modalId - Id for div modal will populate
 * @param {string} title - modal title
 * @param {number} height - height for the modal
 * @param {number} width - width for the modal
 * @param {function} callbackfunction - function to call when Ok button is clicked.
 * @returns {object} the initialized dialog object.
 */
function initCenterModal(modalId,title,height,width, callbackfunction, failCallbackFunction){
  var menuRightHeight = $('.sf-menu-right').height();
  var dialog = $( "#"+modalId ).dialog({
    resizable: true,
    autoOpen: false,
    height: height,
    width: width,
    modal: true,
    closeOnEscape: true,
    title: title,
    buttons: {

      "Cancel": function() {
        $('#'+modalId).html('');
        $('#'+modalId).dialog("close");
        if(typeof failCallbackFunction === 'function'){
          failCallbackFunction();
        }
        return false;
      },
      "Ok": function() {
        console.log('Save Button');
        $('#'+modalId).html('');
        $('#'+modalId).dialog("close");
        if(typeof callbackfunction === 'function'){
          callbackfunction();
        }
      }
    }
  });
  return dialog;
}

/**
 * Creates and displays an alert modal on the center of the screen.
 *
 * @function initCenterAlertModal
 * @requires jquery
 * @param {string} modalId - Id for div modal will populate
 * @param {string} title - modal title
 * @param {number} height - height for the modal
 * @param {number} width - width for the modal
 * @returns {object} the initialized dialog object.
 */
function initCenterAlertModal(modalId,title,ismodal,height,width, callbackfunction){
  if(ismodal == undefined){
    ismodal = true;
  }
  var menuRightHeight = $('.sf-menu-right').height();
  var dialog = $( "#"+modalId ).dialog({
    resizable: true,
    autoOpen: false,
    height: height,
    width: width,
    modal: ismodal,
    closeOnEscape: true,
    title: title,
    buttons: {

      "OK": function() {
        $('#'+modalId).html('');
        $('#'+modalId).dialog("close");
        if(typeof callbackfunction === 'function'){
          callbackfunction();
        }
        return false;
      }
    },
    close: function() {
      $('#'+modalId).html('');
      $('#'+modalId).dialog("close");
    }
  });
  return dialog;
}


/**
 * Passes needed configuations to datatable creation functions using json data to populate table
 *
 * @function stdDataTableFromArray
 * @param {string} tableSelector - tableId for data table creation
 * @param {object[]} columns - array of defined columns
 * @param {json} data - event object triggering call
 * @param {object[]} options - other defined options specified for datatable

 * @param {object} useFixedColumns - specified object to set fixed colunms for the table. (optional variable) with the properties of leftColumns = #of columns from the left to freeze and rightColumns = # of columns to freeze from the right.

 * @returns {table} returns datatable object
 */
function stdDataTableFromArray(tableSelector, columns, data, paging, options, useFixedColumns) {
  var configOverride = {
    "destroy": true,
    "searching": true,
    "info": true,
    "order": [],
    "language": { "search": "", "searchPlaceholder": "Filter" },
    "dom": '<"top"fB>rt<"bottom"lip><"clear">',
    "columnDefs": [{
      "targets": '_all',
      "className": "dt-head-left dt-head-nowrap"
    }],
    "tableClasses": 'stdTable stdTableButtons display',
    "paging": paging,
    "data": data,
    "columns": columns,
    "colReorder": false,
    "buttons": []
  };

  if (options != null) {


    // merge all remaining properties of options into configOverride, but don't overwrite anything created from the above code with the exception of buttons
    for (let prop in options) {
      if (!configOverride.hasOwnProperty(prop)) {
        configOverride[prop] = options[prop];
      } else if (configOverride.hasOwnProperty(prop) && prop == 'buttons') {
        configOverride[prop] = options[prop];
      }
    }
  }

  for (var i = 0; i < columns.length; i++) {
    configOverride.columns[i].className = "col" + i;
  }


  var fixedColumnsObj; //object is defined here as to allow to pass a undefined if nothing exists

  // following if condition takes the possible options given and depending on the input type
  if (useFixedColumns && useFixedColumns != '' ) {

    // scroll option must exist and be on for fixedColumns to work
    if (!configOverride.hasOwnProperty("scrollX")) {
      configOverride["scrollX"] = true;
    }

    if (typeof useFixedColumns === 'object') {
      fixedColumnsObj = useFixedColumns;
      if(!fixedColumnsObj.hasOwnProperty("leftColumns")){
        fixedColumnsObj["leftColumns"] = 0;
      }
    } else if ((typeof useFixedColumns === 'string' && useFixedColumns == 'true') || (typeof useFixedColumns === 'boolean' && useFixedColumns == true)) {
      fixedColumnsObj = {
        "leftColumns":1
      }
    }

  }


  var table = constructDataTable(tableSelector, configOverride, fixedColumnsObj);

  return table;
}

/**
 * Constructs datatable for given table selector based on specified datatable configuration.
 *
 * @function constructDataTable
 * @param {string} tableSelector - table selector for datatable creation
 * @param {object} dataTableConfig - specified datatable configuration specifications.
 * @param {object} useFixedColumns - specified object to set fixed colunms for the table. (optional variable)
 * @returns {object} returns datatable object
 */
function constructDataTable(tableSelector, dataTableConfig, useFixedColumns) {
  var table;
  if ($.fn.dataTable.isDataTable(tableSelector)) {
    table = $(tableSelector).DataTable();
    table.destroy();
  }

  if (dataTableConfig.tableClasses) {
    $(tableSelector).addClass(dataTableConfig.tableClasses);
  }

  table = $(tableSelector).DataTable(dataTableConfig);

  if(useFixedColumns){
    new $.fn.dataTable.FixedColumns(table, {
      leftColumns: useFixedColumns.leftColumns
    });
  }

  $(tableSelector + " > tbody > tr > td").each(function(){
    $(this).prop('className', $(this).prop('className').trim());
  })

  $(tableSelector + " > thead > tr").addClass('thRow');
  $(tableSelector + " th").addClass('stdTh');
  $(tableSelector + " > tbody").addClass('stdTbody');
  $(tableSelector + " > tbody > tr").addClass('stdRow');
  $(tableSelector + " .odd").addClass('r0');
  $(tableSelector + " .even").addClass('r1');

  return table;
}


function destroyDataTable(tableSelector) {
  var table;
  if ($.fn.dataTable.isDataTable(tableSelector)) {
    table = $(tableSelector).DataTable();
    table.destroy();
  }
}

/**
 * basic ajax post call with success and fail callback functionality
 *
 * @function ajaxPostCall
 * @param {object} callObject - object of values to pass in to the call
 * @param {string} errorDivId - Id for modal error display
 * @param {function} callbackFunctionSuccess - a function triggered when ajax call is successful
 * @param {function} callbackFunctionFail - a function triggered when ajax call fails
 */
function ajaxPostCall(callObject, errorDivId, callbackFunctionSuccess, callbackFunctionFail) {

  $.post('/uniflow', callObject).done(function (jqxhr, statusText) {
    console.log('statusText', statusText)
    var postHtml = $.parseHTML(jqxhr);
    var postError = checkPostError(postHtml);
    if (postError !== false) {
      $('#' + errorDivId).html('')
      $('#' + errorDivId).html(postError)
      var errorDialog = initCenterAlertModal(errorDivId, 'Error', true, 200, 300)
      errorDialog.dialog('open');
      if (typeof callbackFunctionFail === 'function') {
        callbackFunctionFail();
      }
    } else {
      if (typeof callbackFunctionSuccess === 'function') {
        callbackFunctionSuccess();
      }
    }
  }).fail(function (jqxhr, textStatus, error) {
    var err = "Request Failed: " + textStatus + ", " + error;
    console.log(err);
    $('#' + errorDivId).html('')
    $('#' + errorDivId).html(err)
    var errorDialog = initCenterAlertModal(errorDivId, 'Error', true, 200, 300)
    errorDialog.dialog('open');
  });

}

/**
 * Creates a simple modal
 *
 * @function createSimpleModal
 * @param {string} modalId - Id for modal error display
 * @param {string} modalMessage - Display message for modal
 * @param {string} modalName - Name of modal displayed to user
 *
 */
function createSimpleModal(modalId, modalMessage, modalName){
  $('#' + modalId).html('');
  $('#' + modalId).html(modalMessage);
  var dialog = initCenterAlertModal(modalId,modalName,true,200,300);
  dialog.dialog('open');
}



function searchLocationsByDepartment(locationId,deptId){
    $(locationId).load('/uniflow',
           {stepName: 'ajaxGetLocations', departmentSiteId: $(deptId).val()
    });
}


/**
 *
 *
 * @function addTextareaCounter
 * @param {string} inputToAddEventTo - field to attach event to - Defaults to textarea if nothing is specified
 * @param {number} specifiedMaxLength - maximum number of characters
 *
 */
function addTextareaCounter(inputToAddEventTo = 'textarea', specifiedMaxLength = 1000) {

  // using the input event will allow for it to work with copy and pasted text as well.
  $(inputToAddEventTo).unbind("input.countLengthFunction").bind("input.countLengthFunction", function() {
      if(! $(this).attr("maxlength")){
        $(this).attr("maxlength", specifiedMaxLength);
      }

      $(this).parent().find('.maxlengthDisplay').remove();
      let maxlength = $(this).attr("maxlength");
      let currentLength = $(this).val().length;
      let message = '';

      if(Number.isNaN(maxlength)){
        maxlength = 1000;
      }
      if( currentLength >= maxlength ){
        message = "You have reached the maximum number of characters."
      } else {
        message = maxlength - currentLength + " out of " + maxlength + " chars left"
      }
      $(this).after('<div class="maxlengthDisplay" >'+message+'</div>');
  });

}




/**
 * Use this function on the div's used with the nicedit functionality
 *
 * @function addDivCounter
 * @param {string} divToAddEventTo - div to attach event to
 * @param {number} specifiedMaxLength - maximum number of characters
 *
 */
function addDivCounter(divToAddEventTo, specifiedMaxLength = 1000) {

  // using the input event will allow for it to work with copy and pasted text as well.
  $(divToAddEventTo).bind("input", function() {

      $(this).parent().find('.maxlengthDisplay').remove();
      let maxlength = specifiedMaxLength;
      let currentLength = $(this).text().length;
      let message = '';

      if(Number.isNaN(maxlength)){
        maxlength = 1000;
      }
      if( currentLength >= maxlength ){
        message = "You have reached the maximum number of characters."
        $(this).text( $(this).text().substring(0, maxlength)); //remove extra characters
      } else {
        message = maxlength - currentLength + " out of " + maxlength + " chars left"
      }

      $(this).after('<div class="maxlengthDisplay" >'+message+'</div>');
  });

  //binding keydown event on the contenteditable div
  $(divToAddEventTo).keydown(function keyEventsFunction(e){
    var allowedKeys = [8,35,36,37,38,39,40,46] // 8-BACKSPACE 35-END 36-HOME 37-LEFT 38-UP 39-RIGHT 40-DOWN 46-DEL
    if(allowedKeys.indexOf(e.which) == -1 && $(divToAddEventTo).text().length >= specifiedMaxLength){
       e.preventDefault();
    }
  });

}

/**
 * Adds parsley validation to an HTML element if the checkbox is checked
 *
 * @function checkForParsley
 * @param {string} checkBoxId - Id for checkbox
 * @param {string} elementId - Id for element you wish to apply parsley required to
 *
 */
function checkForParsley(checkBoxId, elementId){
  if($(checkBoxId).is(':checked')){
      $(elementId).attr('data-parsley-required', 'true');
  }else{
      $(elementId).attr('data-parsley-required', 'false');
  }
}

/**
 * Parsley validator that compares the value it's applied to to the value at the passed element
 * NOTE: data-parsley-value-compare= attribute must be added to element
 *
 * @function addParsleyCompare
 * @param {string} elementToCompare - html element that has a .val() to compare to for validation
 * @param {string} errorMessage - Error message to be displayed to user when validation is triggered
 *
 */
function addParsleyCompare(elementToCompare, errorMessage) {
    window.Parsley.addValidator('valueCompare', {
        validateString: function(value, requirement, elem) {
            return value == $(elem.element).parent().siblings().find(elementToCompare).val();
        },
        messages: {
            en: errorMessage
        }
    });
}


/**
 * function to hide the department and location within datatables. This can be called when triggering button events, sorting, etc
 *
 * @function hideDepartmentAndLocation
 * @param {string} table - table Id
 * @param {int} departmentColumnNumber - department column number
 * @param {int} locationColumnNumber - location column number
 *
 */
function hideDepartmentAndLocation (table, departmentColumnNumber, locationColumnNumber){
    // hide header
    $(table + ' th:eq(' +departmentColumnNumber +')').hide();
    $(table + ' th:eq(' +locationColumnNumber +')').hide();
    // hide column
    $(table + ' .col' +departmentColumnNumber).hide();
    $(table + ' .col' +locationColumnNumber).hide();
}

/**
 * Populates the select field based on the options obtained from an original select list options.
 *
 * @function generateBasicSelectListOptions
 * @param {string} optionsArray - array of select list option value pairs
 * @param {string} selectedValue - value to marke as selected on element creation
 * @param {string} OtherClasses - space separated class list to add to the class of the imput
 * @returns {string} the html select element
 */
function generateBasicSelectListOptions (optionsArray, selectedValue, OtherClasses){

  var selectElement = '<select class="' + OtherClasses + '" value="' + selectedValue + '" tabindex="1">'
  var optionsArr = $.map(optionsArray ,function(option) {
    if(selectedValue === option.value){
      return '<option value="'+ option.value +'" selected>' + option.value + '</option>';
    } else {
      return '<option value="'+ option.value +'">' + option.value + '</option>';
    }
  });
  selectElement += optionsArr.join('');
  selectElement += '</select>'
  return selectElement;
}



/**
 * Populates the select field based on the options obtained from an original select list options.
 *
 * @function generateSelectOptions
 * @param {string} optionsArray - array of select list option value pairs
 * @param {string} selectedValue - value to marke as selected on element creation
 * @param {string} OtherClasses - space separated class list to add to the class of the imput
 * @returns {string} the html select element
 */
function generateSelectOptions (optionsArray, selectElement){
  var optionsArr = $.map(optionsArray ,function(option) {
    return '<option value="'+ option +'">' + option + '</option>';
  });
  $(selectElement).append(optionsArr.join(''))
}


/**
 * 
 * 
 *
 * @function blankIfFalsy
 * @param {string} value
 * @return {string} value
 */
function blankIfFalsy(value){    
    if(value === null || value === undefined || value === "null"){
        value = "";
    }
    return value;
}



/**
 * Opens the preview of the document review in a new window
 *
 * @function previewDocuments
 */
function previewDocuments(containerId) {
    params = 'width=' + 685;
    params += ', height=' + (screen.height * 0.8);
    params += ', top=25, left=300, bottom=25'
    params += ', location=no,menubar=no,toolbar=no';
    let win = window.open("/uniflow?stepName=Document%20Review&lastForm=Y&theContainerId="+containerId+"&docHere=true&_recId=" + containerId, "_blank", params);
    if (win) {
        win.focus();
    } else {
        alert("Please allow pop-out tabs for this website");
    }

}
