/**
 * GeneratedIDconfig.js: Sample ID configuration JavaScript functionality.
 * @author Aaron and Yin
 * @version  1.0.0
 */

 //name and displayName mapping, will eventually get the data from server.
 var dicDisplayNames = 
    {
      "department": "Department",
      "location":   "Location", 
      "test":       "Test", 
      "date":       "Date",
      "workflow":   "Workflow"
    };

    var prefixTable //variable to access prefixTable for other functions on screen.
    var prefixTableData //variable to access prefixTableData data object for other functions on screen.
    var prefixDeleteQueue  = [];  // queued IDs for deletion
    
    
    var suffixTable
    var suffixTableData
    var suffixDeleteQueue = []; // suffix table row IDs for deletion.

$(document).ready(function() { 
    var preSuffixNames = Object.keys(dicDisplayNames);  // names in database, both used for prefix and suffix as they are the same set.

    ////// this section used fake data for now, later on get from server.
     //
     prefixTableData = [
      {
        id: 1,
        prefix: "department",
        delimiter: "-"
      },
      { 
        id: 2,
        prefix: "location",
        delimiter: "-" 
      },
      {
        id: 3,
        prefix: "test",
        delimiter: "-"
      }
  
    ];

    suffixTableData =  [
      {
        id: 1,
        suffix: "department",
        delimiter: "-"
      },
      { 
        id: 2,
        suffix: "location",
        delimiter: "--" 
      },
      {
        id: 3,
        suffix: "date",
        delimiter: "-",
        dateFormat: "YY" 
      },
      {
        id: 4,
        suffix: "workflow",
        delimiter: "-"
       
      },
      {
        id: 5,
        suffix: "test",
        delimiter: "--"
       
      }

  
    ];

     ///////////////////////

    //get various height and width related values for making programmatic adjustments to the header
    var heightHeader = $('.stepName').height();                           
    var heightNavigationBar = $('#topNavigationBar').height();            
    var topStepDiv = $('.step-div').offset().top;                         
    var topPaddingStepDiv = parseInt($('.step-div').css('padding-top'));  
    var topMarginFormDiv = parseInt($('.formDiv').css('margin-top'));     

    var leftPaddingStepDiv = parseInt($('.step-div').css('padding-left'));
    var leftStepDiv = $('.step-div').offset().left;
    var widthMenuLinks = $('#menuLinks').width();

    var rightPaddingStepDiv = parseInt($('.step-div').css('padding-right'));

    //compute the header margin and paddings needed based off of the values retrieved above
    var topMarginIdTypeHeader = heightHeader + topPaddingStepDiv + topMarginFormDiv + (topStepDiv - heightNavigationBar);
    var topPaddingIdTypeHeader = topPaddingStepDiv + (topStepDiv - heightNavigationBar);
    var leftMarginIdTypeHeader = leftPaddingStepDiv + (leftStepDiv - widthMenuLinks);
    var rightMarginIdTypeHeader = rightPaddingStepDiv;

    //set the header margin and padding values
    $('#idTypeHeader').css('margin-top', '-' + topMarginIdTypeHeader + 'px');
    $('#idTypeHeader').css('padding-top', topPaddingIdTypeHeader + 'px');
    $('#idTypeHeader').css('margin-left','-' + leftMarginIdTypeHeader + 'px');
    $('#idTypeHeader').css('margin-right','-' + rightMarginIdTypeHeader + 'px');
    $('#idTypeHeader').css('padding-left', leftMarginIdTypeHeader + 'px');

    //adjust some initial visibility options for children of elements as its the most straightforward way to get the whole row
    $('#inheritParentDiv').children().children().eq(0).css('visibility','collapse');
    $('#handleInvalidIDDiv').children().children().eq(2).css('visibility','collapse');

    //run validates to have them do an initial display indicating if they are requried
    $('#handleInvalidID').parsley().validate();
    $('#handleInvalidIDAfterAttempts').parsley().validate();

    //If coming back to this screen using the browsers back button and idType was set before the idType will still be set
    //but everything else is set to empty, this will address that
    $('#idType').val('');

    /**
   * @event onChange of the handle invalid ID after attempts select list
   * adjusts visibility of text field dependent on select list answer
   */
    $('#handleInvalidIDAfterAttempts').on('change', function() {
      if ($(this).val() == "Yes") 
      {
        $('#invalidIDAttempts').attr('data-parsley-required','true');
        $('#invalidIDAttempts').parsley().validate();
        $('#handleInvalidIDDiv').children().children().eq(2).css('visibility','visible');
      }
      else 
      {
        $('#invalidIDAttempts').attr('data-parsley-required','false');
        $('#invalidIDAttempts').parsley().reset();
        $('#handleInvalidIDDiv').children().children().eq(2).css('visibility','collapse');
      }
    });

    /**
   * @event onChange of the idType select list
   * loads the data related to the selected idType
   */
    $('#idType').on('change', function(){
        //Call ajax to get json object and load data related to selected idType just placesholder stuff
        //its not accurately calling the right step at the moment.
        var request = {
            //stepName: 'AjaxGetStepsByProtocol',
            stepName: 'AjaxGetStepsByProtocol',
            idType: $(this).val()
        };
        $.getJSON('uniflow?', request).done(function (data) {
            if ($('#idType').val() != "") { 
              if ($('#idType').val() == "Specimen Receiving")
              {
                $('#inheritParentDiv').children().children().eq(0).css('visibility','collapse');
              }
              else
              {
                $('#inheritParentDiv').children().children().eq(0).css('visibility','visible');
              }
              //put the loading data from the request here
              //load the prefix data
              prefixTable = getTableSampleIdPrefixByRunProtocolAndTask(prefixTableData);
              
              adjustTableEntries('prefixTable', 'prefix');
              //load the sample ID Base data
              //load the suffix data
              suffixTable = getTableSampleIdSuffixByRunProtocolAndTask(suffixTableData);
              adjustTableEntries('suffixTable', 'suffix');
              //load the sample ID Increment data
              //load the Handle Invalid Generated Sample ID data
              $('#selectedGeneratedIDConfigurationDiv').css('visibility','visible');
              $('#stepFormSubmitButton').css('display', 'block');
            }
            else {
              //don't display the rest of the elements
              $('#inheritParentDiv').children().children().eq(0).css('visibility','collapse');
              $('#selectedGeneratedIDConfigurationDiv').css('visibility','collapse');
              $('#stepFormSubmitButton').css('display','none');
              //no need to clear values as you can't get here without idType being empty
              //which won't save, also changing it back to some other idType will cause this to run again
              //and populate the data underneath.
            }
          });
    });   
    
    /**
     * @function generatePreSuffixSelectListOptions
     * @param {array of string} optionsArray - the array of names, e.g. ["department", "test"...]
     * @param {string} selectedValue  - name selected, e.g, "test"
     * @param {string} OtherClasses  - css class name, but matches column name. e.g., prefix
     */
    function generatePreSuffixSelectListOptions(optionsArray, selectedValue, OtherClasses){

      var selectElement = '<select class="' + OtherClasses +  '" value="' + selectedValue + '" tabindex="1">'
      var optionsArr = $.map(optionsArray ,function(option) {
        if(selectedValue === option){
          return '<option value="'+ option +'" selected>' + dicDisplayNames[option] + '</option>';
        } else {
          return '<option value="'+ option +'">' + dicDisplayNames[option] + '</option>';
        }
      });
      selectElement += optionsArr.join('');
      selectElement += '</select>'
      return selectElement;
    }

    /**
     * @function rebuildSelectBody
     * @param {array of string} optionsArray - the array of names, e.g. ["department", "test"...]
     * @param {string} selectedValue  - name selected, e.g, "test"
     * @param {set of names} takenSet - the set of names already taken, because we can not have repeating names. 
     */
    function rebuildSelectBody(optionsArray, selectedValue, takenSet){
      var selectBody = '<option value="'+ selectedValue +'" selected>' + dicDisplayNames[selectedValue] + '</option>';  // the selected option must stay.
      var optionsArr = $.map(optionsArray ,function(option) {
        if (!takenSet.has(option)){
          return '<option value="'+ option +'">' + dicDisplayNames[option] + '</option>';
        }
        
      });
      selectBody += optionsArr.join('');
      return selectBody;

    }

    /**
     * @function getTableSampleIdPrefixByRunProtocolAndTask.
     * @param {array} data - the json array of data.
     * @inner {function} deletePrefixRowOnClick - delete a row without raising dialog.
     */
    function getTableSampleIdPrefixByRunProtocolAndTask(data) {

      $('#prefixTableDiv').html('')
      $('#prefixTableDiv').append('<table id="prefixTable" ></table>');
  
      var columns = [
        {
          "type": 'string',
          "title": "Prefix",
          "data": null,
          "render": function (data, type, row, meta) {
            var returnValue = data.prefix;
            if(type === 'display'){
              returnValue = generatePreSuffixSelectListOptions(preSuffixNames, data.prefix, 'prefix');
              
            } else if (type === 'filter' || type === 'sort') {
              // This needs to be here and applied along with the function dtSelectOnchange to allow input field data to be searchable
              var api = new $.fn.dataTable.Api(meta.settings); // retrieve datatable settings using the datatables api
              var td = api.cell({row: meta.row, column: meta.col}).node(); // get the specified td cell using the coordinates
              returnValue = $('select', td).val(); 
  
            }
            return returnValue;
          }
        },
        { 
          "type": 'string',
          "title": "Date <br > Format",
          "data": null,
          "render": function (data, type, row, meta) {
            var returnValue = data.dateFormat;
            if (returnValue == null){
              if(type === 'display'){
              returnValue = generateBasicSelectListOptions ($('#hiddenDateFormat option'), '', 'dateFormat');
              return returnValue;
             }
             return '';
            }
            if(type === 'display'){
              returnValue = generateBasicSelectListOptions ($('#hiddenDateFormat option'), returnValue, 'dateFormat');
            } else if (type === 'filter' || type === 'sort') {
              // This needs to be here and applied along with the function dtSelectOnchange to allow select field data to be searchable
              var api = new $.fn.dataTable.Api(meta.settings);
              var td = api.cell({row: meta.row, column: meta.col}).node();
              returnValue = $('select', td).val();
            }
            return returnValue;
          }
        },
        {
          "type": 'string',
          "title": "Delimiter",
          "data": null,
          "render": function (data, type, row, meta) {
            var returnValue = data.delimiter;
            if(type === 'display'){
              returnValue = generateBasicSelectListOptions ($('#hiddenDelimiter option'), returnValue, 'delimiter');
            } else if (type === 'filter' || type === 'sort') {
              // This needs to be here and applied along with the function dtSelectOnchange to allow select field data to be searchable
              var api = new $.fn.dataTable.Api(meta.settings);
              var td = api.cell({row: meta.row, column: meta.col}).node();
              returnValue = $('select', td).val();
            }
            return returnValue;
          }
        },
        
        {
          "data": null,
          "render": function (data, type, row, meta) {
            return '<a href="#" class="resetRow"><i class="fas fa-redo" aria-hidden="true" ></i></a>';
          }
  
        },
        {
          "data": null,
          "render": function (data, type, row, meta) {
            return '<a href="#" class="deleteRow"><i class="fa fa-times-circle fa-fw" aria-hidden="true" ></i></a>';
          }
  
        }
      ];
  
      var options = {
          createdRow: function(row, data, dataIndex) {
              var rowObj = $(row);
              rowObj.attr('data-Id', data.id);
              rowObj.attr('data-prefix', data.prefix);
              rowObj.attr('data-dateFormat', data.dateFormat);
              rowObj.attr('data-delimiter', data.delimiter);
             
          }
  
      };
  
      var theTable = stdDataTableFromArray('#prefixTable', columns, data, false, options);

      $('.prefix').change(function(){
        
        adjustTableEntries('prefixTable', 'prefix');
       });

       $('.resetRow').on('click',function(){
        resetRowOnClick($(this), 'prefix');
      });

      $('.deleteRow').on('click', function(){
        deletePrefixRowOnClick($(this));
        adjustTableEntries('prefixTable', 'prefix');
  
       });


      function deletePrefixRowOnClick(d){
        var parentRow = $(d).parent().parent();
        var matrixId = parentRow.attr('data-Id');
        if(matrixId != 'new'){
          prefixDeleteQueue.push(matrixId);
      
        }
        var row = prefixTable.row( $(parentRow) );  // utilize Datatable now-- prefixTable is a Datatable object.
        row.remove().draw('false');
      }
  
      return theTable;
  
  
    } 
  
    

  /**
   * @function getTableSampleIdSuffixByRunProtocolAndTask.
   * @param {array} data - the json array of data.
   * @inner {function} deleteSuffixRowOnClick - delete a row without raising dialog.
   */
  function getTableSampleIdSuffixByRunProtocolAndTask(data) {

    $('#suffixTableDiv').html('')
    $('#suffixTableDiv').append('<table id="suffixTable" ></table>');
  
    var columns = [
      {
        "type": 'string',
        "title": "Suffix",
        "data": null,
        "render": function (data, type, row, meta) {
          var returnValue = data.suffix;
          if(type === 'display'){
            returnValue = generatePreSuffixSelectListOptions(preSuffixNames, data.suffix, 'suffix');
          } else if (type === 'filter' || type === 'sort') {
            // This needs to be here and applied along with the function dtSelectOnchange to allow input field data to be searchable
            var api = new $.fn.dataTable.Api(meta.settings); // retrieve datatable settings using the datatables api
            var td = api.cell({row: meta.row, column: meta.col}).node(); // get the specified td cell using the coordinates
            returnValue = $('select', td).val(); 
  
          }
          return returnValue;
        }
      },
  
      { 
        "type": 'string',
        "title": "Date <br > Format",
        "data": null,
        "render": function (data, type, row, meta) {
          var returnValue = data.dateFormat;
          if (returnValue == null){
            if(type === 'display'){
            returnValue = generateBasicSelectListOptions ($('#hiddenDateFormat option'), '', 'dateFormat');
            return returnValue;
            }
           return '';
          }
          if(type === 'display'){
            returnValue = generateBasicSelectListOptions ($('#hiddenDateFormat option'), returnValue, 'dateFormat');
          } else if (type === 'filter' || type === 'sort') {
            // This needs to be here and applied along with the function dtSelectOnchange to allow select field data to be searchable
            var api = new $.fn.dataTable.Api(meta.settings);
            var td = api.cell({row: meta.row, column: meta.col}).node();
            returnValue = $('select', td).val();
          }
          return returnValue;
        }
      },
     
      {
        "type": 'string',
        "title": "Delimiter",
        "data": null,
        "render": function (data, type, row, meta) {
          var returnValue = data.delimiter;
          if(type === 'display'){
            returnValue = generateBasicSelectListOptions ($('#hiddenDelimiter option'), returnValue, 'delimiter');
          } else if (type === 'filter' || type === 'sort') {
            // This needs to be here and applied along with the function dtSelectOnchange to allow select field data to be searchable
            var api = new $.fn.dataTable.Api(meta.settings);
            var td = api.cell({row: meta.row, column: meta.col}).node();
            returnValue = $('select', td).val();
          }
          return returnValue;
        }
      },
      
      {
        "data": null,
        "render": function (data, type, row, meta) {
          return '<a href="#" class="resetRow"><i class="fas fa-redo" aria-hidden="true" ></i></a>';
        }
  
      },
      {
        "data": null,
        "render": function (data, type, row, meta) {
          return '<a href="#" class="deleteRow"><i class="fa fa-times-circle fa-fw" aria-hidden="true" ></i></a>';
        }
  
      }
    ];
  
    var options = {
        createdRow: function(row, data, dataIndex) {
            var rowObj = $(row);
            rowObj.attr('data-Id', data.id);
            rowObj.attr('data-suffix', data.suffix);
            rowObj.attr('data-dateFormat', data.dateFormat);
            rowObj.attr('data-delimiter', data.delimiter);
           
        }
  
    };
  
    var theTable = stdDataTableFromArray('#suffixTable', columns, data, false, options);

    $('.suffix').change(function(){
    
      adjustTableEntries('suffixTable', 'suffix');
     });

     $('.resetRow').on('click',function(){
      resetRowOnClick($(this), 'suffix');
     });

     $('.deleteRow').on('click', function(){
      deleteSuffixRowOnClick($(this));
      adjustTableEntries('suffixTable', 'suffix');

     });


     function deleteSuffixRowOnClick(d){
      var parentRow = $(d).parent().parent();
      var matrixId = parentRow.attr('data-Id');
      if(matrixId != 'new'){
        suffixDeleteQueue.push(matrixId);
    
      }
      var row = suffixTable.row( $(parentRow) );  // utilize Datatable now-- suffixTable is a Datatable object.
      row.remove().draw('false');
    }


    return theTable;
    
  }

  /**
   * @function adjustTableEntries - adjust the select options and hide/show the date format column.
   * @param {string} tableId - ID of the table, either 'prefixTable' or 'suffixTable'.
   * @param {*string} colClass - class name of the column, either 'prefix' or 'suffix'
   */
  function adjustTableEntries(tableId, colClass) {
    if($(`#${tableId} tbody`).length > 0){
      var usedNames = new Set();
      var show = false;
      $(`#${tableId} tbody tr`).each(function (index, row) {
        var curPrefix = $(row).find(`.${colClass}`).val();
        if (curPrefix.length > 0){
          usedNames.add(curPrefix);
        }
        if (curPrefix === 'date'){
          show = true;
         
          $(row).find('.dateFormat').show();
         
        }
        else{
          $(row).find('.dateFormat').hide();
        }
       
      });
      
      // one more loop to adjust the select option body.
      $(`#${tableId} tbody tr`).each(function (index, row) {
        var curPrefix = $(row).find(`.${colClass}`).val();
        var selectBody = rebuildSelectBody(preSuffixNames, curPrefix, usedNames);
        var prefixSelect = $(row).find(`.${colClass}`);
        prefixSelect.empty();
        prefixSelect.append(selectBody);
        
      });
      
      if (show === false){
        $(`#${tableId} td:nth-child(2)`).hide();
        $(`#${tableId} th:nth-child(2)`).hide();

      }
      else {
        $(`#${tableId} td:nth-child(2)`).show();
        $(`#${tableId} th:nth-child(2)`).show();


      }

    }
      
  }


  /**
 * Resets all fields in row to the onload default values for the table
 *
 * @function resetRowOnClick
 * @param {event object} e - event object triggering call
 * @param {string} preOrSuffixName - either 'prefix' or 'suffix', both table share the same event handler.
 */
function resetRowOnClick(e, preOrSuffixName){
  var parentRow = $(e).parent().parent();
  $(parentRow).find(`.${preOrSuffixName}`).val($(parentRow).attr(`data-${preOrSuffixName}`));
  $(parentRow).find('.dateFormat').val($(parentRow).attr('data-dateFormat'));
  $(parentRow).find('.delimiter').val($(parentRow).attr('data-delimiter'));
  $(parentRow).find(`.${preOrSuffixName}`).change();
  
}




 

 
});