/**
 * Routing configuration step JavaScript functionality
 * @author Wendy Goller
 * @version  1.0.0
 */


var runRoutingTable //variable to access runRoutingTable for other functions on screen.
var runRoutingTableData //variable to access runRoutingTable data object for other functions on screen.

var batchRoutingTable //variable to access batchRoutingTable for other functions on screen.
var batchRoutingTableData //variable to access runRoutingTable data object for other functions on screen.

$(document).ready(function() {

  /**
   *
   *
   * @event onChange of the protocolSelected select list
   */
  $('#protocolSelected').on('change', function(){
    var request = {
      stepName: 'AjaxGetStepsByProtocol',
      protocolName: $(this).val()
    };
    $.getJSON('uniflow?', request).done(function (data) {
      var optionsArr = $.map(data ,function(option) {
        return '<option value="'+ option.displayName +'">' + option.displayName + '</option>';
      });
      $('#sourceStep').empty();
      $('#sourceStep').append('<option value=""></option>');
      $('#sourceStep').append(optionsArr.join(','));
      $('#routingConfigurationDiv').html('');
      $('#routingConfigurationBatchTrayDiv').html('')
    });
  });

  /**
   *
   *
   * @event onChange of the sourceStep select list
   */
  $('#sourceStep').on('change', function(){

    var request = {
      stepName: 'AjaxGetRoutingByRunProtocolAndTask',
      protocol: $('#protocolSelected').val(),
      selectedSourceStep: $(this).val()
    };

    // Calls the getTableRoutingByRunProtocolAndTask step via data passed by ajax request to get the data needed to trigger and populate the sample Routing datatable using the defined columns and options.
    $.getJSON('uniflow?', request).done(function (data) {
      runRoutingTableData = data;
      runRoutingTable = getTableRoutingByRunProtocolAndTask(runRoutingTableData);

    }).fail(function (jqxhr, textStatus, error) {
      var err = "Request Failed: " + textStatus + ", " + error;
      console.log(err);
      alert(err);
    });

    
    var request = {
      stepName: 'AjaxGetBatchTryRoutingByProtocolAndTask',
      protocol: $('#protocolSelected').val(),
      selectedSourceStep: $(this).val()
    };

    $.getJSON('uniflow?', request).done(function (data) {
      batchRoutingTableData = data;
      batchRoutingTable = getBatchTrayRoutingByProtocolAndTask(batchRoutingTableData)
    }).fail(function (jqxhr, textStatus, error) {
      var err = "Request Failed: " + textStatus + ", " + error;
      console.log(err);
      alert(err);
    });
  });



  /**
   *
   *
   * @event onClick of the stepFormSubmitButton button
   */
  $('#stepFormSubmitButton').on('click', function(e){
    e.preventDefault();
    var curfromStep = $('#sourceStep').val();
    var matrixJson = [];
    var batchTrayMatrixJson = [];
    var noValidationErrors = true;
    var form = $('[name="stepForm"]')


    $('.nextStepSpan').each(function(){
      var spanContent = $(this).html()
      if(spanContent === ''){
        $(this).parent().find('.nextStepErrors').remove()
        $(this).parent().append('<div class="nextStepErrors">Next Step selection is required</div>')
      } else {
        $(this).parent().find('.nextStepErrors').remove()
      }
    })

    if (form.parsley().isValid()) {
      destroyDataTable('#routingConfiguration');
      if($('#routingConfiguration tbody').length > 0){
        $('#routingConfiguration tbody tr').each(function (index, row) {
          var origPriority = $(row).attr('data-priority')
          var curPriority = $(row).find('.priority').val()
          var origRoutingDirection = $(row).attr('data-routingDirection')
          var curRoutingDirection = $(row).find('.routingDirection').val()
          var origDepartmentId = $(row).attr('data-departmentid')
          var curDepartmentId = $(row).find('.department').val()
          var origLocationId = $(row).attr('data-locationid')
          var curLocationId = $(row).find('.location').val()
          var origOrderType = $(row).attr('data-orderType')
          var curOrderType = $(row).find('.orderType').val()
          var origSpecimenType = $(row).attr('data-specimenType')
          var curSpecimenType = $(row).find('.specimenType').val()
          var origPanelCode = $(row).attr('data-panelCode')
          var curPanelCode = $(row).find('.panelCode').val()
          var origTestCode = $(row).attr('data-testCode')
          var curTestCode = $(row).find('.testCode').val()
          var origMethodCode = $(row).attr('data-methodCode')
          var curMethodCode = $(row).find('.methodCode').val()
          var origSpecimenAge = $(row).attr('data-specimenAge')
          var curSpecimenAge = $(row).find('.specimenAge').val()
          var origQuantityQualifier = $(row).attr('data-specimenQuantityQualifier')
          var curQuantityQualifier = $(row).find('.quantityQualifier').val()
          var origQuantThreshold = $(row).attr('data-specimenQuantity')
          var curQuantThreshold = $(row).find('.quantThreshold').val()
          var origContainerResult = $(row).attr('data-result')
          var curContainerResult = $(row).find('.containerResult').val()
          var origRunCount = $(row).attr('data-runCount')
          var curRunCount = $(row).find('.runCount').val()
          var origDiagnosticCode = $(row).attr('data-diagnosticCode')
          var curDiagnosticCode = $(row).find('.diagnosticCode').val()
          var origNextStep = $(row).attr('data-nextStep')

          var curNextStep = ($(row).find('.nextStepSpan').html())
          if(curNextStep){
            curNextStep = curNextStep.split('<br>').join('|')
            if(curNextStep.length === 0 || curNextStep === ''){
              noValidationErrors = false;
            }
          } else {
            if(curNextStep !== undefined){
              noValidationErrors = false;
            }
          }

          if(origNextStep != curNextStep || origPriority != curPriority || origRoutingDirection != curRoutingDirection || origOrderType != curOrderType || origSpecimenType != curSpecimenType || origPanelCode != curPanelCode || origTestCode != curTestCode || origMethodCode != curMethodCode || origSpecimenAge != curSpecimenAge || origQuantityQualifier != curQuantityQualifier || origQuantThreshold != curQuantThreshold || origContainerResult != curContainerResult || origRunCount != curRunCount || origDiagnosticCode != curDiagnosticCode || origDepartmentId != curDepartmentId || origLocationId != curLocationId){
            matrixJson.push({
                "id": $(row).attr('data-id'),
                "fromStep": curfromStep,
                "priority": curPriority,
                "routingDirection": curRoutingDirection,
                "orderType": curOrderType,
                "departmentId": curDepartmentId,
                "locationId": curLocationId,
                "specimenType": curSpecimenType,
                "panelCode": curPanelCode,
                "testCode": curTestCode,
                "methodCode": curMethodCode,
                "specimenAge": curSpecimenAge,
                "specimenQuantityQualifier": curQuantityQualifier,
                "specimenQuantity": curQuantThreshold,
                "result": curContainerResult,
                "runCount": curRunCount,
                "diagnosticCode": curDiagnosticCode,
                "nextStep": curNextStep
            });
          }
        });
      }


      destroyDataTable('#routingConfigurationBatchTray');
      if($('#routingConfigurationBatchTray tbody').length > 0){
        $('#routingConfigurationBatchTray tbody tr').each(function (index, row) {
          var origPriorityBT = $(row).attr('data-priority')
          var curPriorityBT = $(row).find('.priority').val()
          var origRoutingDirectionBT = $(row).attr('data-routingDirection')
          var curRoutingDirectionBT = $(row).find('.routingDirection').val()
          var origOrderTypeBT = $(row).attr('data-orderType')
          var curOrderTypeBT = $(row).find('.orderType').val()
          var origContainerResultBT = $(row).attr('data-result')
          var curContainerResultBT = $(row).find('.containerResult').val()
          var origRunCountBT = $(row).attr('data-runCount')
          var curRunCountBT = $(row).find('.runCount').val()
          var origNextStepBT = $(row).attr('data-nextStep')
          var curNextStepBT = ($(row).find('.nextStepSpan').html())

          if(curNextStepBT){
            curNextStepBT = curNextStepBT.split('<br>').join('|')
            if(curNextStepBT.length === 0 || curNextStepBT === ''){
              noValidationErrors = false;
            }
          } else {
            if(curNextStepBT !== undefined){
              noValidationErrors = false;
            }
          }

          if(origPriorityBT != curPriorityBT || origRoutingDirectionBT != curRoutingDirectionBT || origOrderTypeBT != curOrderTypeBT || origContainerResultBT != curContainerResultBT || origRunCountBT != curRunCountBT  || origNextStepBT != curNextStepBT){
            batchTrayMatrixJson.push({
                "id": $(row).attr('data-id'),
                "fromStep": curfromStep,
                "priority": curPriorityBT,
                "routingDirection": curRoutingDirectionBT,
                "orderType": curOrderTypeBT,
                "result": curContainerResultBT,
                "runCount": curRunCountBT,
                "nextStep": curNextStepBT
            });
          }
        });
      }
      if(noValidationErrors){

        var routingMatrixJson = JSON.stringify(matrixJson);
        var batchTrayRoutingMatrixJson = JSON.stringify(batchTrayMatrixJson);

        var postData = {
            "routingMatrixJson": routingMatrixJson,
            "batchTrayRoutingMatrixJson": batchTrayRoutingMatrixJson,
            "stepName": "AjaxPostRoutingByProtocolAndTask",
            "Submit": true,
            "formNumber": 0
        };
        $.post('/uniflow', postData).done(function (jqxhr, statusText) {
          var postHtml = $.parseHTML(jqxhr);
          var postError = checkPostError(postHtml);
          if (postError !== false) {
            $('#errorBox').html('')
            $('#errorBox').html(postError)
            var errorDialog = initCenterAlertModal('errorBox', 'Error', true, 200, 300)
            errorDialog.dialog('open');
          } else {
            $('#sourceStep').val('');
            $('#sourceStep').empty();
            $('#protocolSelected').val('');
            $('#routingConfigurationDiv').html('');
            $('#routingConfigurationBatchTrayDiv').html('');
          }
        }).fail(function (jqxhr, textStatus, error) {
          var err = "Request Failed: " + textStatus + ", " + error;
          console.log(err);
          $('#errorBox').html('')
          $('#errorBox').html(err)
          var errorDialog = initCenterAlertModal('errorBox', 'Error', true, 200, 300)
          errorDialog.dialog('open');
        });
      }
    } else {
      form.submit();
    }

  });


});



/**
 *
 * @function getTableRoutingByRunProtocolAndTask
 * @param {string} protocolName - procolol name value selected
 * @param {string} sourceStep - source step value selected
 * @returns {table} the html to display inside the modal window
 * @inner {function} addNewRowPDR -  generates new row and adds it to the end of the datatable with default values specified.
 * @inner {function} deleteRowOnClick -  removes the selected row from datatable onscreen and from the database. calling AjaxPostDeleteRoutingMatrixRecord step via ajax post call
 * @event onchange for orderType select - triggers the orderTypeOnChange function
 * @event onchange for testCode select - triggers the testCodeOnChange function
 * @event onClick for resetRow select - triggers the resetRowOnClick function
 * @event onClick for deleteRow select - triggers the deleteRowOnClick function
 * @event onClick for nextStep select - triggers the addEditNextStepOnClick function
 */
function getTableRoutingByRunProtocolAndTask(data) {

    $('#routingConfigurationDiv').html('')
    $('#routingConfigurationDiv').append('<table id="routingConfiguration" ></table>');

    var columns = [
      {
        "title": "Routing <br> Priority",
        "data": null,
        "render": function (data, type, row, meta) {
          var returnValue = data.priority;
          if(type === 'display'){
            returnValue = generateNumericField('priority', data.priority, 1, undefined)
          } else if (type === 'filter' || type === 'sort') {
            // This needs to be here and applied along with the function dtSelectOnchange to allow input field data to be searchable
            var api = new $.fn.dataTable.Api(meta.settings); // retrieve datatable settings using the datatables api
            var td = api.cell({row: meta.row, column: meta.col}).node(); // get the specified td cell using the coordinates
            returnValue = $('input[type="number"]', td).val(); // this is datatable jquery, NOT normal JQeury

          }
          return returnValue
        }
      },
      { 
        "type": 'string',
        "title": "Container <br > Routing <br> Direction",
        "data": null,
        "render": function (data, type, row, meta) {
          var returnValue = data.routingDirection;
          if(type === 'display'){
            returnValue = generateBasicSelectListOptions ($('#hiddenRouteDirection option'), data.routingDirection, 'routingDirection');
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
        "title": "Order <br > Type",
        "data": "orderType",
        "render": function (data, type, row, meta) {
          var returnValue = data;
          if(type === 'display'){
            var selectElement = '<select class="orderType" value="' + data + '" tabindex="1">'
            var optionsArr = $.map($('#hiddenOrderTypes option') ,function(option) {
              if(data === option.value){
                return '<option selected value="'+ option.value +'">' + option.text + '</option>';
              } else {
                return '<option value="'+ option.value +'">' + option.text + '</option>';
              }
            });
            optionsArr.forEach(function(item){
              selectElement += item
            });
            selectElement += '</select>'
            returnValue = selectElement;
          } else if (type === 'filter' || type === 'sort') {
            // make sure column type is 'string' otherwise select list return value will not search or sort
            var api = new $.fn.dataTable.Api(meta.settings);
            var td = api.cell({row: meta.row, column: meta.col}).node();
            returnValue = $('select', td).children('[value="'+ $('select', td).val() +'"]').html(); //set search to be the displayName insteaad of the value 
          }
          return returnValue;
        }
      },
      {
        "type": 'string',
        "title": "Department",
        "data": null,
        "render": function (data, type, full, meta) {
          var returnValue = (data.departmentId) ? data.departmentId:'';
          if(type === 'display'){
            returnValue = generateCustomSelectListOptionsDep ($('#hiddenDepartment option'), returnValue, 'department');
          } else if (type === 'filter' || type === 'sort') {
            var api = new $.fn.dataTable.Api(meta.settings);
            var td = api.cell({row: meta.row, column: meta.col}).node();
            returnValue = $('select', td).children('[value="'+ $('select', td).val() +'"]').html();
          }

          return returnValue;
        }
      },
      {
        "type": 'string',
        "title": "Location",
        "data": null,
        "render": function (data, type, row, meta) {
          var returnValue = data.locationId;
          if(returnValue === null || returnValue === undefined){
            returnValue = ''
          }
          var departmentIdValue = data.departmentId;
          if(departmentIdValue === null || departmentIdValue === undefined){
            departmentIdValue = ''
          }
          if(type === 'display'){
            returnValue = generateCustomSelectListOptions ($('#hiddenLocation option'), returnValue, departmentIdValue, 'location');
          } else if (type === 'filter' || type === 'sort') {
            var api = new $.fn.dataTable.Api(meta.settings);
            var td = api.cell({row: meta.row, column: meta.col}).node();
            returnValue = $('select', td).children('[value="'+ $('select', td).val() +'"]').html();
          }
          return returnValue;
        }
      },
      {
        "type": 'string',
        "title": "Specimen Type",
        "data": null,
        "render": function (data, type, row, meta) {
          var returnValue = data.specimenType;
          if(type === 'display'){
            returnValue = generateCustomSelectListOptions ($('#hiddenSpecimenType option'), data.specimenType, data.orderType, 'specimenType')
          } else if (type === 'filter' || type === 'sort') {
            var api = new $.fn.dataTable.Api(meta.settings);
            var td = api.cell({row: meta.row, column: meta.col}).node();
            returnValue = $('select', td).children('[value="'+ $('select', td).val() +'"]').html();
          }
          return returnValue;
        }
      },
      {
        "type": 'string',
        "title": "Panel Code",
        "data": null,
        "render": function (data, type, row, meta) {
          var returnValue = data.panelCode;
          if(type === 'display'){
            returnValue = generateCustomSelectListOptions ($('#hiddenPanelCode option'), data.panelCode, data.orderType, 'panelCode')
          } else if (type === 'filter' || type === 'sort') {
            var api = new $.fn.dataTable.Api(meta.settings);
            var td = api.cell({row: meta.row, column: meta.col}).node();
            returnValue = $('select', td).children('[value="'+ $('select', td).val() +'"]').html();
          }
          return returnValue;

        }
      },
      {
        "type": 'string',
        "title": "Test Code",
        "data": null,
        "render": function (data, type, row, meta) {
          var returnValue = data.testCode;
          if(returnValue === null || returnValue === undefined){
            returnValue = ''
          }

          var panelCodeValue = data.panelCode;
          if(panelCodeValue === null || panelCodeValue === undefined){
            panelCodeValue = ''
          }

          if(type === 'display'){
            returnValue = generateCustomSelectListOptions ($('#hiddenTestCode option'), returnValue, data.panelCode, 'testCode')
          } else if (type === 'filter' || type === 'sort') {
            var api = new $.fn.dataTable.Api(meta.settings);
            var td = api.cell({row: meta.row, column: meta.col}).node();
            if($('select', td).val() === null || $('select', td).val() === undefined){
              returnValue = ""
            } else {
              returnValue = $('select', td).children('[value="'+ $('select', td).val() +'"]').html();
            }
          }
          return returnValue;

        }
      },
      {
        "type": 'string',
        "title": "Method Code",
        "data": null,
        "render": function (data, type, row, meta) {
          var returnValue = data.methodCode;
          if(returnValue === null || returnValue === undefined){
            returnValue = ''
          }

          var testCodeValue = data.testCode;
          if(testCodeValue === null || testCodeValue === undefined){
            testCodeValue = ''
          }

          if(type === 'display'){
            var filteredOptionList = $('#hiddenMethodCode option').filter(function(x, option) {
              var optionPieces = option.value.split('|');
              if(optionPieces[0] === testCodeValue){
                return optionPieces[1] + '|' + optionPieces[2];
              }
            })
            returnValue = generateCustomSelectListOptions (filteredOptionList, returnValue, testCodeValue, 'methodCode')
          } else if (type === 'filter' || type === 'sort') {
            var api = new $.fn.dataTable.Api(meta.settings);
            var td = api.cell({row: meta.row, column: meta.col}).node();         
            if($('select', td).val() === null || $('select', td).val() === undefined){
              returnValue = ""
            } else {
              returnValue = $('select', td).children('[value="'+ $('select', td).val() +'"]').html();
            }
          }
          return returnValue;

        }
      },
      {
        "title": "Specimen Age <br > (based on  <br > collection date)",
        "data": null,
        "render": function (data, type, row, meta) {
          var returnValue = data.specimenAge;
          if(type === 'display'){
            returnValue = generateNumericField('specimenAge', data.specimenAge, '', 99999);
          } else if (type === 'filter' || type === 'sort') {
            var api = new $.fn.dataTable.Api(meta.settings);
            var td = api.cell({row: meta.row, column: meta.col}).node();
            returnValue = $('input[type="number"]', td).val();
          }
          return returnValue;
        }
      },
      {
        "type": 'string',
        "title": "Quantity  <br> (Qualifier, Threshold)",
        "data": null,
        "render": function (data, type, row, meta) {
          var returnValue = data.specimenQuantityQualifier +' '+ data.specimenQuantity;
          if(type === 'display'){
            returnValue = generateBasicSelectListOptions ($('#hiddenQuantityQualifier option'), data.specimenQuantityQualifier, 'quantityQualifier') + generateNumericField('quantThreshold', data.specimenQuantity, '', undefined);
          } else if (type === 'filter' || type === 'sort') {
            var api = new $.fn.dataTable.Api(meta.settings);
            var td = api.cell({row: meta.row, column: meta.col}).node();
            returnValue = $('select', td).children('[value="'+ $('select', td).val() +'"]').html();
          }
          return returnValue;
        }
      },
      {
        "type": 'string',
        "title": "Container  <br > Action/Result",
        "data": null,
        "render": function (data, type, row, meta) {
          var returnValue = data.result;

          if(type === 'display'){
            if($('#sourceStep').val() === 'Specimen Receiving' || $('#sourceStep').val() === 'Order Form'){
              if(data.result === ''){
                var selectElement = '<select class="containerResult" value="' + data.result + '" tabindex="1">'
                var optionsArr = $.map($('#hiddenResultDefaultSpecimenCondition option') ,function(option) {
                  if(data.result === option.value){
                    return '<option selected value="'+ option.value +'">' + option.text + '</option>';
                  } else {
                    return '<option value="'+ option.value +'">' + option.text + '</option>';
                  }
                });
                optionsArr.forEach(function(item){
                  selectElement += item
                });
                selectElement += '</select>'
                returnValue = selectElement;
              } else {
                returnValue = generateCustomSelectListOptions ($('#hiddenResult option'), data.result, data.orderType, 'containerResult');
              }
            } else {
              var selectElement = '<select class="containerResult" value="' + data.result + '" tabindex="1">'
              var optionsArr = $.map($('#hiddenResultPassFail option') ,function(option) {
                if(data.result === option.value){
                  return '<option selected value="'+ option.value +'">' + option.text + '</option>';
                } else {
                  return '<option value="'+ option.value +'">' + option.text + '</option>';
                }
              });
              optionsArr.forEach(function(item){
                selectElement += item
              });
              selectElement += '</select>'
              returnValue = selectElement;
            }
          } else if (type === 'filter' || type === 'sort') {
            var api = new $.fn.dataTable.Api(meta.settings);
            var td = api.cell({row: meta.row, column: meta.col}).node();
            returnValue = $('select', td).children('[value="'+ $('select', td).val() +'"]').html();
          }
          return returnValue;
        }
      },
      {
        "title": "Run Count",
        "data": null,
        "render": function (data, type, row, meta) {
          var returnValue = data.runCount;
          if(type === 'display'){
            returnValue = generateNumericField('runCount', data.runCount, 0, undefined);
          } else if (type === 'filter' || type === 'sort') {
            var api = new $.fn.dataTable.Api(meta.settings);
            var td = api.cell({row: meta.row, column: meta.col}).node();
            returnValue = $('input[type="number"]', td).val();
          }
          return returnValue;
        }
      },
      {
        "title": "Diagnostics  <br > Code",
        "data": null,
        "render": function (data, type, row, meta) {
          var returnValue = data.diagnosticCode;
          if(type === 'display'){
            returnValue = generateNumericField('diagnosticCode', data.diagnosticCode, 0, undefined);
          } else if (type === 'filter' || type === 'sort') {
            var api = new $.fn.dataTable.Api(meta.settings);
            var td = api.cell({row: meta.row, column: meta.col}).node();
            returnValue = $('input[type="number"]', td).val();
          }
          return returnValue;
        }
      },
      {
        "title": "Send to Next Step",
        "data": "nextStep",
        "render": function (data, type, row, meta) {
          var returnValue = data;
          if(type === 'display'){
            returnValue = generateNextStepSection(returnValue);
          } else if (type === 'filter' || type === 'sort') {
            var api = new $.fn.dataTable.Api(meta.settings);
            var td = api.cell({row: meta.row, column: meta.col}).node();
            returnValue = $('.nextStepSpan', td).html();
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
            rowObj.attr('data-fromStep', data.sourceStep);
            rowObj.attr('data-nextStep', data.nextStep);
            rowObj.attr('data-diagnosticCode', data.diagnosticCode);
            rowObj.attr('data-runCount', data.runCount);
            rowObj.attr('data-result', data.result);
            rowObj.attr('data-specimenQuantity', data.specimenQuantity);
            rowObj.attr('data-specimenQuantityQualifier',data.specimenQuantityQualifier);
            rowObj.attr('data-specimenAge', data.specimenAge);
            rowObj.attr('data-methodCode', data.methodCode);
            rowObj.attr('data-testCode', data.testCode);
            rowObj.attr('data-panelCode', data.panelCode);
            rowObj.attr('data-specimenType', data.specimenType);
            rowObj.attr('data-orderType', data.orderType);
            rowObj.attr('data-routingDirection', data.routingDirection);
            rowObj.attr('data-priority', data.priority);
            rowObj.attr('data-department', data.departmentId);
            rowObj.attr('data-location', data.locationId);
        }

    };

    var routingTable = stdDataTableFromArray('#routingConfiguration', columns, data, false, options);


    function addNewRowPDR() {
      var fromStep = $('#sourceStep').val();

      // add new row to the datatable
      var newRow = routingTable.row.add({
        diagnosticCode: "0",
        id: "new",
        methodCode: "",
        nextStep: "",
        orderType: "",
        priority: "1",
        result: "",
        routingDirection: "OUT",
        runCount: "0",
        sourceStep: fromStep,
        specimenAge: "",
        specimenQuantity: "",
        specimenQuantityQualifier: "",
        specimenType: "",
        testCode: "",
        panelCode: "",
        locationId: "",
        departmentId: ""
      }).draw().node();

      $(newRow).find('.orderType').change(function(){
        orderTypeOnChange($(this));
      })

      $(newRow).find('.department').change(function(){
        departmentOnChange($(this))
      })

      $(newRow).find('.panelCode').change(function(){
        panelCodeOnChange($(this))    
      })

      $(newRow).find('.testCode').change(function(){
        testCodeOnChange($(this));
      })

      $(newRow).find('.resetRow').on('click',function(){
        resetRowOnClick($(this))
      })

      $(newRow).find('.deleteRow').on('click', function(){
        deleteRowOnClick($(this))
      })

      $(newRow).find('.nextStep').on('click', function(){
        addEditNextStepOnClick($(this))
      })


      $(newRow).find('.diagnosticCode').on('input', function(){
        dtSelectOnchange($(this), 'diagnosticCode', 'diagnosticCode');
      })    
      $(newRow).find('.runCount').on('input', function(){
        dtSelectOnchange($(this), 'runCount', 'runCount');
      })

      $(newRow).find('.priority').on('input', function(){
        dtSelectOnchange($(this), 'priority', 'priority');
      })    
      $(newRow).find('.specimenAge').on('input', function(){
        dtSelectOnchange($(this), 'specimenAge', 'specimenAge');
      })

      $(newRow).find('.quantThreshold').on('input', function(){
        dtSelectOnchange($(this), 'quantThreshold', 'specimenQuantity');
      })

      $(newRow).find('.routingDirection').change(function(){
        dtSelectOnchange($(this), 'routingDirection', 'routingDirection');
      })

      $(newRow).find('.location').change(function(){
        dtSelectOnchange($(this), 'location', 'locationId');
      })

      $(newRow).find('.specimenType').change(function(){
        dtSelectOnchange($(this), 'specimenType', 'specimenType');
      })

      $(newRow).find('.methodCode').change(function(){
        dtSelectOnchange($(this), 'methodCode', 'methodCode');
      })

      $(newRow).find('.quantityQualifier').change(function(){
        dtSelectOnchange($(this), 'quantityQualifier', 'specimenQuantityQualifier');
      })

      $(newRow).find('.containerResult').change(function(){
        dtSelectOnchange($(this), 'containerResult', 'result');
      })

      $(newRow).find('.nextStepSpan').bind('DOMNodeInserted DOMNodeRemoved', function(event) {
        if (event.type == 'DOMNodeInserted') {
          var selVal = $(this).html();
          routingTable.cell($(this).closest('td')).data(selVal).draw();

          $(newRow).find('.nextStepSpan').bind('DOMNodeInserted DOMNodeRemoved', function(event) {
            if (event.type == 'DOMNodeInserted') {
              var selVal = $(this).html();
              routingTable.cell($(this).closest('td')).data(selVal).draw();
            }
          });

          $(newRow).find('.nextStep').on('click', function(){
            addEditNextStepOnClick($(this))
          })
        }
      });

      addRequiredFields(['.priority', '.routingDirection', '.orderType']);

    }

    function deleteRowOnClick(d){
        var parentRow = $(d).parent().parent();
        var matrixId = parentRow.attr('data-Id');
        var dialog = initEmptyModal('modal','Confirm Delete',450, 300, closeCurrentModal('modal'))

        $('#modal').html('');
        $('#modal').append(confirmDialogFromModalHTML('Are you sure you want to delete this row? This action can not be undone.'))

        $('#confirmDialogCancel').on('click', function(e) {
          e.preventDefault();
          closeCurrentModal('modal')
        })

        $('#confirmDialogAccept').on('click', function(e) {
          e.preventDefault();
          var row = routingTable.row( $(parentRow) );
          var rowNode = row.node();
          if(matrixId === 'new'){
            row.remove().draw('false');
            closeCurrentModal('modal');
          } else {
            var callObject = {
                stepName: 'AjaxPostDeleteRoutingMatrixRecord'
                ,Submit:true
                ,formNumber:0
                ,matrixId: matrixId
            }
            ajaxPostCall(callObject, 'errorBox', function(){
                //This is the success callback
                routingTable.row( $(parentRow) ).remove().draw();
                $(parentRow).remove();
                closeCurrentModal('modal');
            }, function(){
              //This is the fail callback
            })
          }
        })
        dialog.dialog('open');
    }


    $('.diagnosticCode').on('input', function(){
      dtSelectOnchange($(this), 'diagnosticCode', 'diagnosticCode');
    })    
    $('.runCount').on('input', function(){
      dtSelectOnchange($(this), 'runCount', 'runCount');
    })

    $('.priority').on('input', function(){
      dtSelectOnchange($(this), 'priority', 'priority');
    })    
    $('.specimenAge').on('input', function(){
      dtSelectOnchange($(this), 'specimenAge', 'specimenAge');
    })

    $('.quantThreshold').on('input', function(){
      dtSelectOnchange($(this), 'quantThreshold', 'specimenQuantity');
    })

    $('.routingDirection').change(function(){
      dtSelectOnchange($(this), 'routingDirection', 'routingDirection');
    })

    $('.location').change(function(){
      dtSelectOnchange($(this), 'location', 'locationId');
    })

    $('.specimenType').change(function(){
      dtSelectOnchange($(this), 'specimenType', 'specimenType');
    })

    $('.methodCode').change(function(){
      dtSelectOnchange($(this), 'methodCode', 'methodCode');
    })

    $('.quantityQualifier').change(function(){
      dtSelectOnchange($(this), 'quantityQualifier', 'specimenQuantityQualifier');
    })

    $('.containerResult').change(function(){
      dtSelectOnchange($(this), 'containerResult', 'result');
    })

    $('.orderType').change(function(){
      orderTypeOnChange($(this));
    })

    $('.panelCode').change(function(){
      panelCodeOnChange($(this));
    })

    $('.testCode').change(function(){
      testCodeOnChange($(this));
    })

    $('.department').change(function(){
      departmentOnChange($(this));
    })

    $('#routingConfiguration .resetRow').on('click',function(){
      resetRowOnClick($(this));
    })

    $('#routingConfiguration .deleteRow').on('click', function(){
      deleteRowOnClick($(this));
    })

    $('#routingConfiguration .nextStep').on('click', function(){
      addEditNextStepOnClick($(this));
    })

    $('#routingConfiguration .nextStepSpan').bind('DOMNodeInserted DOMNodeRemoved', function(event) {
      if (event.type == 'DOMNodeInserted') {
        var selVal = $(this).html();
        routingTable.cell($(this).closest('td')).data(selVal).draw();

        $('#routingConfiguration .nextStepSpan').bind('DOMNodeInserted DOMNodeRemoved', function(event) {
          if (event.type == 'DOMNodeInserted') {
            var selVal = $(this).html();
            routingTable.cell($(this).closest('td')).data(selVal).draw();
          }
        });

        $('#routingConfiguration .nextStep').on('click', function(){
          addEditNextStepOnClick($(this));
        })
      }
    });


    addRequiredFields(['.priority', '.routingDirection', '.orderType']);

    //When you want to ensure it won't happen twice...
    $('#addNewPath').unbind("click", addNewRowPDR);
    $('#addNewPath').bind("click", addNewRowPDR);

    return routingTable

}


// update input values and trigger update for td data table cell to allow for searching of items selected
function dtSelectOnchange(e, dataClass, dataAttrName){
  var dataVal = $(e).val();
  $(e).val(dataVal);
  $(e).attr('value', dataVal);
  $($(e).children('[value="'+ dataVal +'"]')).attr('selected', true);
  $($(e).children('[value="'+ dataVal +'"]')).prop('selected', true);

  // get the datatable td data object
  var dataObj = runRoutingTable.cell($(e).closest('td')).data();
  // set datVal to blank if it is undefined or you will get data table generation error
  if(dataVal === null || dataVal === undefined){
    dataVal = '';
  }
  // update datatable td object to be the newly selected value
  dataObj[dataAttrName] = dataVal;

  // add the object back to the td with the new values and then redraw the table cell. 
  // (the redraw of the table invalidates the previous cached data so the new value can be searched)
  runRoutingTable.cell($(e).closest('td')).data( dataObj ).draw();

  // reapply on change events as they are cleared when redrawing 
  $(e).find('.'+dataClass).change(function(){
    dtSelectOnchange($(this), dataClass, dataAttrName);
  })

  // reapply required fields as they are cleared when redrawing 
  addRequiredFields(['.priority', '.routingDirection', '.orderType']);

}



/**
 * Sets the selected fields identified to be required.
 *
 * @function addRequiredFields
 * @param {array[]} arrayOfIdentifiers - an array of class or id jquery selectors
 */
function addRequiredFields(arrayOfIdentifiers){
  $.each(arrayOfIdentifiers, function(i,e){
    $(e).prop("required", true);
    $(e).addClass("required");
    $(e).attr("data-parsley-required", "true");
    $(e).attr("data-parsley-error-message", "This field is required");

  });
}

/**
 * Populates the specimen Type select, the test code select and empties the method code select fields for the row specified.
 *
 * @function orderTypeOnChange
 * @param {event object} e - event object triggering call
 */
function orderTypeOnChange(e){

  var orderTypeSelection = $(e).val();
  var specimenTypeSelect = $(e).parent().parent().find('.specimenType');
  var origValuesSpecimenType = '#hiddenSpecimenType';
  var testCodeTypeSelect = $(e).parent().parent().find('.testCode');
  var origValuesTestCode = '#hiddenTestCode';
  var methodCodeTypeSelect = $(e).parent().parent().find('.methodCode');
  var origValuesPanelCode = '#hiddenPanelCode';
  var panelCodeTypeSelect = $(e).parent().parent().find('.panelCode');

  specimenTypeSelect.empty();
  testCodeTypeSelect.empty();
  methodCodeTypeSelect.empty();
  panelCodeTypeSelect.empty();
  if(orderTypeSelection !== ''){
    resetBasicSelectListOptions(orderTypeSelection, specimenTypeSelect, origValuesSpecimenType);
    resetBasicSelectListOptions(orderTypeSelection, panelCodeTypeSelect, origValuesPanelCode);
  }

  $(e).val(orderTypeSelection);
  $(e).attr('value', orderTypeSelection);
  $($(e).children('[value="'+ orderTypeSelection +'"]')).attr('selected', true);
  $($(e).children('[value="'+ orderTypeSelection +'"]')).prop('selected', true);
  
  //set the string value for orderType as the table definition data is set to 'orderType'
  runRoutingTable.cell($(e).closest('td')).data( orderTypeSelection ).draw(); 
  $(e).find('.orderType').change(function(){
    orderTypeOnChange($(this));
  })

  addRequiredFields(['.priority', '.routingDirection', '.orderType']);

}

/**
 * Populates the test code select field for the row based on the panel code selected.
 *
 * @function panelCodeOnChange
 * @param {event object} e - event object triggering call
 */
function panelCodeOnChange(e){

  var panelCodeSelection = $(e).val();
  var methodCodeTypeSelect = $(e).parent().parent().find('.methodCode');
  var testCodeTypeSelect = $(e).parent().parent().find('.testCode');

  var panelCodeValue = $(e).parent().parent().find('.panelCode').val();

  methodCodeTypeSelect.empty();
  testCodeTypeSelect.empty();

  var filteredOptionList = $('#hiddenTestCode option').filter(function(x, option) {
    var optionPieces = option.value.split('|');
    if(optionPieces[0] === panelCodeValue) {
      return optionPieces[1] + '|' + optionPieces[2];

    }
  })
  var optionsArr = $.map(filteredOptionList ,function(option) {
    var optionElementsArr = option.value.split('|');
    return '<option value="'+optionElementsArr[2]+'">' + optionElementsArr[1] + '</option>';
  });

  testCodeTypeSelect.append('<option value=""></option>' + optionsArr.join(''));

  $(e).val(panelCodeSelection);
  $(e).attr('value', panelCodeSelection);
  $(e).children('[value="'+ panelCodeSelection +'"]').attr('selected', true);
  $(e).children('[value="'+ panelCodeSelection +'"]').prop('selected', true);

  var dataObj = runRoutingTable.cell($(e).closest('td')).data()
  dataObj['panelCode'] = panelCodeValue;
  runRoutingTable.cell($(e).closest('td')).data( dataObj ).draw();

  $('.panelCode').change(function(){
    panelCodeOnChange($(this));
  })

}

/**
 * Populates the method code select field for the row based on the order type and the test code selected.
 *
 * @function testCodeOnChange
 * @param {event object} e - event object triggering call
 */
function testCodeOnChange(e){

  var methodCodeTypeSelect = $(e).parent().parent().find('.methodCode');

  var testCodeValue = $(e).parent().parent().find('.testCode').val();

  methodCodeTypeSelect.empty();

  var filteredOptionList = $('#hiddenMethodCode option').filter(function(x, option) {
    var optionPieces = option.value.split('|');
    if(optionPieces[0] === testCodeValue){
      return optionPieces[1] + '|' + optionPieces[2];

    }
  })
  var optionsArr = $.map(filteredOptionList ,function(option) {
    var optionElementsArr = option.value.split('|');
    return '<option value="'+optionElementsArr[2]+'">' + optionElementsArr[1] + '</option>';
  });

  methodCodeTypeSelect.append('<option value=""></option>' + optionsArr.join(''));


  $(e).val(testCodeValue);
  $(e).attr('value', testCodeValue);
  $(e).children('[value="'+ testCodeValue +'"]').attr('selected', true);
  $(e).children('[value="'+ testCodeValue +'"]').prop('selected', true);
  var dataObj = runRoutingTable.cell($(e).closest('td')).data()
  if(testCodeValue === null || testCodeValue === undefined){
    testCodeValue = '';
  }
  dataObj['testCode'] = testCodeValue;
  runRoutingTable.cell($(e).closest('td')).data( dataObj ).draw();
  
  $('.testCode').change(function(){
    testCodeOnChange($(this));
  });
}

/**
 * Populates the location code select field for the row based on the department selected.
 *
 * @function departmentOnChange
 * @param {event object} e - event object triggering call
 */
function departmentOnChange(e){
  var departmentValue = $(e).val();
  var locationSelect = $(e).parent().parent().find('.location');
  locationSelect.empty();

  var filteredOptionList = $('#hiddenLocation option').filter(function(x, option) {
    var optionPieces = option.value.split('|');
    if(optionPieces[0] === departmentValue){
      return optionPieces[1] + '|' + optionPieces[2];
    }
  })

  var optionsArr = $.map(filteredOptionList ,function(option) {
    var optionElementsArr = option.value.split('|');
    var displayVal = optionElementsArr[1] ? optionElementsArr[1]:'';
    return '<option value="'+optionElementsArr[2]+'">' + displayVal + '</option>';
  });

  locationSelect.append('<option value=""></option>' + optionsArr.join(''));

  $(e).val(departmentValue);
  $(e).attr('value', departmentValue);
  $(e).children('[value="'+ departmentValue +'"]').attr('selected', true);
  $(e).children('[value="'+ departmentValue +'"]').prop('selected', true);
  var dataObj = runRoutingTable.cell($(e).closest('td')).data();
  dataObj['departmentId'] = departmentValue;

  //set the data object as the table definition data is set to 'null' and the data object is passed to the render function
  runRoutingTable.cell($(e).closest('td')).data( dataObj ).draw(); 

  $('.department').change(function(){
    departmentOnChange($(this));
  });

}


/**
 * Resets all fields in row to the onload default values for the sample routing table
 *
 * @function resetRowOnClick
 * @param {event object} e - event object triggering call
 */
function resetRowOnClick(e){
  var parentRow = $(e).parent().parent();
  $(parentRow).find('.priority').val($(parentRow).attr('data-priority'));
  $(parentRow).find('.routingDirection').val($(parentRow).attr('data-routingDirection'));
  $(parentRow).find('.orderType').val($(parentRow).attr('data-orderType'));
  $(parentRow).find('.orderType').change();
  $(parentRow).find('.specimenType').val($(parentRow).attr('data-specimenType'));
  $(parentRow).find('.panelCode').val($(parentRow).attr('data-panelCode'));
  $(parentRow).find('.panelCode').change();
  $(parentRow).find('.testCode').val($(parentRow).attr('data-testCode'));
  $(parentRow).find('.testCode').change();
  $(parentRow).find('.methodCode').val($(parentRow).attr('data-methodCode'));
  $(parentRow).find('.specimenAge').val($(parentRow).attr('data-specimenAge'));
  $(parentRow).find('.quantityQualifier').val($(parentRow).attr('data-specimenQuantityQualifier'));
  $(parentRow).find('.quantThreshold').val($(parentRow).attr('data-specimenQuantity'));
  $(parentRow).find('.containerResult').val($(parentRow).attr('data-result'));
  $(parentRow).find('.runCount').val($(parentRow).attr('data-runCount'));
  $(parentRow).find('.diagnosticCode').val($(parentRow).attr('data-diagnosticCode'));
  $(parentRow).find('.nextStepSpan').html(($(parentRow).attr('data-nextStep')).split('|').join('<br>'));
  $(parentRow).find('.department').val($(parentRow).attr('data-department'));
  $(parentRow).find('.department').change();
  $(parentRow).find('.location').val($(parentRow).attr('data-location'));
}

/**
 * Resets all fields in row to the onload default values for the batch/tray routing table
 *
 * @function resetRowBatchTrayOnClick
 * @param {event object} e - event object triggering call
 */
function resetRowBatchTrayOnClick(e){
  var parentRow = $(e).parent().parent();
  $(parentRow).find('.priority').val($(parentRow).attr('data-priority'));
  $(parentRow).find('.routingDirection').val($(parentRow).attr('data-routingDirection'));
  $(parentRow).find('.orderType').val($(parentRow).attr('data-orderType'));
  $(parentRow).find('.containerResult').val($(parentRow).attr('data-result'));
  $(parentRow).find('.runCount').val($(parentRow).attr('data-runCount'));
  $(parentRow).find('.diagnosticCode').val($(parentRow).attr('data-diagnosticCode'));
  $(parentRow).find('.nextStepSpan').html(($(parentRow).attr('data-nextStep')).split('|').join('<br/>'));
}


/**
 * resets the select list with the original populated items and selects the value specified. used in orderTypeOnChange function
 *
 * @function resetBasicSelectListOptions
 * @param {object} orderTypeSelection - select field value of selected option
 * @param {object} targetSelect - select field object to update
 * @param {object[]} origValuesHiddenSelect - original select list options
 */
function resetBasicSelectListOptions(orderTypeSelection, targetSelect, origValuesHiddenSelect){
    targetSelect.empty();

    var filteredOptionsArray = $(origValuesHiddenSelect + ' option').filter(function(x, option) {
      var optionPieces = option.value.split('|');
      if(optionPieces[0] === orderTypeSelection) {
        return optionPieces[1] + '|' + optionPieces[2];
      }
    })

    var optionsArr = $.map(filteredOptionsArray ,function(option) {
      var optionElementsArr = option.value.split('|');
      return '<option value="'+optionElementsArr[2]+'">' + optionElementsArr[1] + '</option>';
    });

    targetSelect.append('<option value=""></option>' + optionsArr.join(''));
}


/**
 * creates the html for the numeric input field.
 *
 * @function generateNumericField
 * @param {string} otherClasses - space separated class list to add to the class of the imput
 * @param {string} value - value to set on field creation
 * @param {number} min - min value parameter
 * @param {number} max - max value parameter
 * @returns {string} the html for input number field
 */
function generateNumericField(otherClasses, value, min, max){
  if((min === 0 || min) && max){
    return '<input type="number" class="number '+ otherClasses + '" min='+min+' max='+max+' value="' + value + '" step="any" tabindex="1">';
  } else if(min === 0 || min){
    return '<input type="number" class="number '+ otherClasses + '" min='+min+' value="' + value + '" step="any" tabindex="1">';
  } else if(max){
    return '<input type="number" class="number  '+ otherClasses + '" max='+max+' value="' + value + '" step="any" tabindex="1">';
  } else {
    return '<input type="number" class="number ' + otherClasses + '" value="' + value + '" step="any" tabindex="1">';
  }
}

/**
 * Populates the select field based on the options obtained from a setName select list.
 *
 * @function generateCustomSelectListOptionsFromSetName
 * @param {string} optionsArray - array of select list option value pairs
 * @param {string} currentSelection - value to marke as selected on element creation
 * @param {string} orderType - order type field value
 * @param {string} OtherClasses - space separated class list to add to the class of the imput
 * @returns {string} the html select element
 */
function generateCustomSelectListOptionsFromSetName (optionsArray, currentSelection, orderType, OtherClasses){
  var filteredOptionsArray = optionsArray.filter(function(x, option) {
    var optionPieces = option.value.split('|');
    if(optionPieces[0] === orderType){
      return optionPieces[1] + '|' + optionPieces[2];

    }
  });
  var selectElement = '<select class="' + OtherClasses + '" value="' + currentSelection + '" tabindex="1">'
  var optionsArr = $.map(filteredOptionsArray ,function(option) {
    var optionElementsArr = option.value.split('|');
    if(currentSelection === optionElementsArr[2]){
      return '<option selected value="'+optionElementsArr[2]+'">' + optionElementsArr[1] + '</option>';
    } else {
      return '<option value="'+optionElementsArr[2]+'">' + optionElementsArr[1] + '</option>';
    }
  });
  selectElement += optionsArr.join('');
  selectElement += '</select>';
  return selectElement;
}

/**
 * Populates the select field based on the options obtained from a json pipe separated name value pair select list.
 *
 * @function generateCustomSelectListOptions
 * @param {string} optionsArray - array of select list option value pairs
 * @param {string} currentSelection - value to marke as selected on element creation
 * @param {string} orderType - order type field value
 * @param {string} OtherClasses - space separated class list to add to the class of the imput
 * @returns {string} the html select element
 */
function generateCustomSelectListOptions (optionsArray, currentSelection, orderType, OtherClasses){

  var filteredOptionsArray = optionsArray.filter(function(x, option) {
    var optionPieces = option.value.split('|');
    if(optionPieces[0] === orderType){
      return optionPieces[1] + '|' + optionPieces[2];

    }
  });

  var selectElement = '<select class="' + OtherClasses + '" value="' + currentSelection + '" tabindex="1">';  
  if(currentSelection === ''){
    selectElement += '<option selected value=""></option>';
  } else {
    selectElement += '<option value=""></option>';
  }
  var optionsArr = $.map(filteredOptionsArray ,function(option) {
    if(option.value === ''){}
    var optionElementsArr = option.value.split('|');
    var displayVal = optionElementsArr[1] ? optionElementsArr[1]: '';
    if(currentSelection === optionElementsArr[2]){
      return '<option selected value="'+optionElementsArr[2]+'">' + displayVal + '</option>';
    } else {
      return '<option value="'+optionElementsArr[2]+'">' + displayVal + '</option>';
    }
  });
  selectElement += optionsArr.join('');
  selectElement += '</select>';
  return selectElement;
}

/**
  * Populates the select field based on a pipe seperated name value pair select list
  *
  * @function generateCustomSelectListOptions
  * @param {string} optionsArray - array of select list option value pairs
  * @param {string} currentSelection - value to marke as selected on element creation
  * @param {string} OtherClasses - space separated class list to add to the class of the imput
  * @returns {string} the html select element
 */
function generateCustomSelectListOptionsDep (optionsArray, currentSelection, OtherClasses){


  var filteredOptionsArray = optionsArray.filter(function(x, option) {
    var optionPieces = option.value.split('|');
      return optionPieces[0] + '|' + optionPieces[1];
  });

  var selectElement = '<select class="' + OtherClasses + '" value="' + currentSelection + '" tabindex="1">';
  if(currentSelection === ''){
    selectElement += '<option selected value=""></option>';
  } else {
    selectElement += '<option value=""></option>';
  }
  var optionsArr = $.map(filteredOptionsArray ,function(option) {
    if(option.value === ''){}
    var optionElementsArr = option.value.split('|');
    if(optionElementsArr[1] != undefined){
      if(currentSelection === optionElementsArr[0]){
        return '<option selected value="'+optionElementsArr[0]+'">' + optionElementsArr[1] + '</option>';
      } else {
        return '<option value="'+optionElementsArr[0]+'">' + optionElementsArr[1] + '</option>';
      }
    } 
  });
  selectElement += optionsArr.join('');
  selectElement += '</select>';
  return selectElement;
}





/**
 * Calls the AjaxGetBatchTryRoutingByProtocolAndTask step via ajax request to get the data needed to trigger and populate the sample Routing datatable using the defined columns and options.
 *
 * @function AjaxGetRoutingByRunProtocolAndTask
 * @param {string} protocolName - procolol name value selected
 * @param {string} sourceStep - source step value selected
 * @returns {table} the html to display inside the modal window
 * @inner {function} addNewRowPDRBatchTRay -  generates new row and adds it to the end of the datatable with default values specified.
 * @inner {function} deleteRowBatchTrayOnClick -  removes the selected row from datatable onscreen and from the database. calling AjaxPostDeleteRoutingMatrixRecord step via ajax post call
 * @event onClick for resetRow select - triggers the resetRowBatchTrayOnClick function
 * @event onClick for deleteRow select - triggers the deleteRowBatchTrayOnClick function
 * @event onClick for nextStep select - triggers the addEditNextStepOnClick function
 */
function getBatchTrayRoutingByProtocolAndTask(data) {

    $('#routingConfigurationBatchTrayDiv').html('')
    $('#routingConfigurationBatchTrayDiv').append('<table id="routingConfigurationBatchTray" ></table>');

    var columns = [
      {
        "title": "Routing <br> Priority",
        "data": null,
        "render": function (data, type, row, meta) {
          var returnValue = data;
          if(type === 'display'){
            returnValue = generateNumericField('priority', data.priority, 1, undefined)
          } else if (type === 'filter' || type === 'sort') {
            var api = new $.fn.dataTable.Api(meta.settings);
            var td = api.cell({row: meta.row, column: meta.col}).node();
            returnValue = $('input[type="number"]', td).val();
          }
          return returnValue
        }
      },
      {
        "type": 'string',
        "title": "Container <br > Routing <br> Direction",
        "data": null,
        "render": function (data, type, row, meta) {
          var returnValue = data.routingDirection;
          if(type === 'display'){
            returnValue = generateBasicSelectListOptions ($('#hiddenRouteDirection option'), data.routingDirection, 'routingDirection');
          } else if (type === 'filter' || type === 'sort') {
            var api = new $.fn.dataTable.Api(meta.settings);
            var td = api.cell({row: meta.row, column: meta.col}).node();
            returnValue = $('select', td).children('[value="'+ $('select', td).val() +'"]').html();
          }
          return returnValue;
        }
      },
      {
        "type": 'string',
        "title": "Workflow <br > Type",
        "data": null,
        "render": function (data, type, row, meta) {
          var returnValue = data.orderType;
          if(type === 'display'){
            var selectElement = '<select class="orderType" value="' + returnValue + '" tabindex="1">'
            var optionsArr = $.map($('#hiddenOrderTypes option') ,function(option) {
              if(returnValue === option.value){
                return '<option selected value="'+ option.value +'">' + option.text + '</option>';
              } else {
                return '<option value="'+ option.value +'">' + option.text + '</option>';
              }
            });
            optionsArr.forEach(function(item){
              selectElement += item
            });
            selectElement += '</select>'
            returnValue = selectElement;
          } else if (type === 'filter' || type === 'sort') {
            var api = new $.fn.dataTable.Api(meta.settings);
            var td = api.cell({row: meta.row, column: meta.col}).node();
            returnValue = $('select', td).children('[value="'+ $('select', td).val() +'"]').html();
          }
          return returnValue;
        }
      },
      {
        "type": 'string',
        "title": "Container  <br > Action/Result",
        "data": null,
        "render": function (data, type, row, meta) {
          var returnValue = data.result;

          if(type === 'display'){
            if($('#sourceStep').val() === 'Specimen Receiving' || $('#sourceStep').val() === 'Order Form'){
              if(data.result === ''){
                var selectElement = '<select class="containerResult" value="' + data.result + '" tabindex="1">'
                var optionsArr = $.map($('#hiddenResultDefaultSpecimenCondition option') ,function(option) {
                  if(data.result === option.value){
                    return '<option selected value="'+ option.value +'">' + option.value + '</option>';
                  } else {
                    return '<option value="'+ option.value +'">' + option.value + '</option>';
                  }
                });
                selectElement += optionsArr.join(',');
                selectElement += '</select>'
                returnValue = selectElement;
              } else {
                returnValue = generateCustomSelectListOptions ($('#hiddenResult option'), data.result, data.orderType, 'containerResult');
              }
            } else {
              var selectElement = '<select class="containerResult" value="' + data.result + '" tabindex="1">'
              var optionsArr = $.map($('#hiddenResultPassFail option') ,function(option) {
                if(data.result === option.value){
                  return '<option selected value="'+ option.value +'">' + option.value + '</option>';
                } else {
                  return '<option value="'+ option.value +'">' + option.value + '</option>';
                }
              });
              selectElement += optionsArr.join(',');
              selectElement += '</select>'
              returnValue = selectElement;
            }
          } else if (type === 'filter' || type === 'sort') {
            var api = new $.fn.dataTable.Api(meta.settings);
            var td = api.cell({row: meta.row, column: meta.col}).node();
            returnValue = $('select', td).children('[value="'+ $('select', td).val() +'"]').html();
          }
          return returnValue;
        }
      },
      {
        "title": "Run Count",
        "data": null,
        "render": function (data, type, row, meta) {
          var returnValue = data.runCount;
          if(type === 'display'){
            returnValue = generateNumericField('runCount', data.runCount, 0, undefined);
          } else if (type === 'filter' || type === 'sort') {
            var api = new $.fn.dataTable.Api(meta.settings);
            var td = api.cell({row: meta.row, column: meta.col}).node();
            returnValue = $('input[type="number"]', td).val();
          }
          return returnValue;
        }
      },
      {
        "title": "Send to Next Step",
        "data": "nextStep",
        "render": function (data, type, row, meta) {
          var returnValue = data;
          if(type === 'display'){
            returnValue = generateNextStepSection(returnValue);
          } else if (type === 'filter' || type === 'sort') {
            var api = new $.fn.dataTable.Api(meta.settings);
            var td = api.cell({row: meta.row, column: meta.col}).node();
            returnValue = $('.nextStepSpan', td).html();
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
            rowObj.attr('data-fromStep', data.sourceStep);
            rowObj.attr('data-nextStep', data.nextStep);
            rowObj.attr('data-runCount', data.runCount);
            rowObj.attr('data-result', data.result);
            rowObj.attr('data-orderType', data.orderType);
            rowObj.attr('data-routingDirection', data.routingDirection);
            rowObj.attr('data-priority', data.priority);
        }

    };

    var routingBatchTrayTable = stdDataTableFromArray('#routingConfigurationBatchTray', columns, data, false, options);

    function addNewRowPDRBatchTRay() {
      var fromStep = $('#sourceStep').val();
      var newRow = routingBatchTrayTable.row.add({
        id: "new",
        nextStep: "",
        orderType: "",
        priority: "1",
        result: "",
        routingDirection: "OUT",
        runCount: "0",
        sourceStep: fromStep
      }).draw().node();

      $($(newRow).children()).each(function(){
        $(this).attr('class', $(this).attr('class').trim());
      })

      $(newRow).find('.priority').on('input', function(){
        dtSelectOnchangeBatch($(this), 'priority', 'priority');
      })    

      $(newRow).find('.routingDirection').change(function(){
        dtSelectOnchangeBatch($(this), 'routingDirection', 'routingDirection');
      })

      $(newRow).find('.orderType').change(function(){
        dtSelectOnchangeBatch($(this), 'orderType', 'orderType');
      })

      $(newRow).find('.containerResult').change(function(){
        dtSelectOnchangeBatch($(this), 'containerResult', 'result');
      })

      $(newRow).find('.runCount').on('input', function(){
        dtSelectOnchangeBatch($(this), 'runCount', 'runCount');
      })

      $(newRow).find('.resetRow').on('click',function(){
        resetRowBatchTrayOnClick($(this));
      })

      $(newRow).find('.deleteRow').on('click', function(){
        deleteRowBatchTrayOnClick($(this));
      })

      $(newRow).find('.nextStep').on('click', function(){
        addEditNextStepOnClick($(this));
      })

      $(newRow).find('.nextStepSpan').bind('DOMNodeInserted DOMNodeRemoved', function(event) {
        if (event.type == 'DOMNodeInserted') {
          var selVal = $(this).html();
          routingBatchTrayTable.cell($(this).closest('td')).data(selVal).draw();

          $(newRow).find('.nextStepSpan').bind('DOMNodeInserted DOMNodeRemoved', function(event) {
            if (event.type == 'DOMNodeInserted') {
              var selVal = $(this).html();
              routingBatchTrayTable.cell($(this).closest('td')).data(selVal).draw();
            }
          });

          $(newRow).find('.nextStep').on('click', function(){
            addEditNextStepOnClick($(this));
          })
        }
      });

      addRequiredFields(['.priority', '.routingDirection', '.orderType']);
    }

    function deleteRowBatchTrayOnClick(d){
        var parentRow = $(d).parent().parent();
        var matrixId = parentRow.attr('data-Id');
        var dialog = initEmptyModal('modal','Confirm Delete',450, 300, closeCurrentModal('modal'));

        $('#modal').html('');
        $('#modal').append(confirmDialogFromModalHTML('Are you sure you want to delete this row? This action can not be undone!'));

        $('#confirmDialogCancel').on('click', function(e) {
          e.preventDefault();
          closeCurrentModal('modal');
        })

        $('#confirmDialogAccept').on('click', function(e) {
          e.preventDefault();
          var row = routingBatchTrayTable.row( $(parentRow) );
          var rowNode = row.node();
          if(matrixId === 'new'){
            row.remove().draw('false');
            closeCurrentModal('modal');
          } else {
            var callObject = {
                stepName: 'AjaxPostDeleteRoutingMatrixRecord'
                ,Submit:true
                ,formNumber:0
                ,matrixId: matrixId
            }
            ajaxPostCall(callObject, 'errorBox', function(){
                //This is the success callback
                routingBatchTrayTable.row( $(parentRow) ).remove().draw();
                $(parentRow).remove();
                closeCurrentModal('modal');
            }, function(){
              //This is the fail callback
            })
          }
        })
        dialog.dialog('open');
    }

    function dtSelectOnchangeBatch(e, dataClass, dataAttrName){
      var dataVal = $(e).val();
      $(e).val(dataVal);
      $(e).attr('value', dataVal);
      $($(e).children('[value="'+ dataVal +'"]')).attr('selected', true);
      $($(e).children('[value="'+ dataVal +'"]')).prop('selected', true);

      var dataObj = routingBatchTrayTable.cell($(e).closest('td')).data();
      if(dataVal === null || dataVal === undefined){
        dataVal = '';
      }

      dataObj[dataAttrName] = dataVal;
      routingBatchTrayTable.cell($(e).closest('td')).data( dataObj ).draw();

      $(e).find('.'+dataClass).change(function(){
        dtSelectOnchangeBatch($(this), dataClass, dataAttrName);
      })

      addRequiredFields(['.priority', '.routingDirection', '.orderType']);
    }

    function dtInputChangeBatch(e, dataClass, dataAttrName){
      var dataVal = $(e).val();
      $(e).attr('value', dataVal);

      var dataObj = routingBatchTrayTable.cell($(e).closest('td')).data();
      if(dataVal === null || dataVal === undefined){
        dataVal = '';
      }
      dataObj[dataAttrName] = dataVal
      routingBatchTrayTable.cell($(e).closest('td')).data( dataObj ).draw();

      $(e).find('.'+dataClass).change(function(){
        dtInputChangeBatch($(this), dataClass, dataAttrName);
      })

      addRequiredFields(['.priority', '.routingDirection', '.orderType']);
    }

    $('#routingConfigurationBatchTray .priority').on('input', function(){
      dtInputChangeBatch($(this), 'priority', 'priority');
    })    

    $('#routingConfigurationBatchTray .routingDirection').change(function(){
      dtSelectOnchangeBatch($(this), 'routingDirection', 'routingDirection');
    })

    $('#routingConfigurationBatchTray .orderType').change(function(){
      dtSelectOnchangeBatch($(this));
    })

    $('#routingConfigurationBatchTray .containerResult').change(function(){
      dtSelectOnchangeBatch($(this), 'containerResult', 'result');
    })

    $('#routingConfigurationBatchTray .runCount').on('input', function(){
      dtInputChangeBatch($(this), 'runCount', 'runCount');
    })

    $('#routingConfigurationBatchTray .resetRow').on('click',function(){
      resetRowBatchTrayOnClick($(this));
    })

    $('#routingConfigurationBatchTray .deleteRow').on('click', function(){
      deleteRowBatchTrayOnClick($(this));
    })

    $('#routingConfigurationBatchTray .nextStep').on('click', function(){
      addEditNextStepOnClick($(this));
    })

    $('#routingConfigurationBatchTray .nextStepSpan').bind('DOMNodeInserted DOMNodeRemoved', function(event) {
      if (event.type == 'DOMNodeInserted') {
        var selVal = $(this).html();
        routingBatchTrayTable.cell($(this).closest('td')).data(selVal).draw();

        $('#routingConfigurationBatchTray .nextStepSpan').bind('DOMNodeInserted DOMNodeRemoved', function(event) {
          if (event.type == 'DOMNodeInserted') {
            var selVal = $(this).html();
            routingBatchTrayTable.cell($(this).closest('td')).data(selVal).draw();
          }
        });

        $('#routingConfigurationBatchTray .nextStep').on('click', function(){
          addEditNextStepOnClick($(this));
        })
      }
    });


    addRequiredFields(['.priority', '.routingDirection', '.orderType']);

    //When you want to ensure it won't happen twice...
    $('#addNewPath2').unbind("click", addNewRowPDRBatchTRay);
    $('#addNewPath2').bind("click", addNewRowPDRBatchTRay);

  return routingBatchTrayTable;

}

