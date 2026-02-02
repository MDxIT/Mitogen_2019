/**
 * 
 * @author Wendy Goller
 * @version  3.1
 */


// Following global variables must be a stepName from protocolSteps table and are used in analysisConfiguration js files
const uploadStep = 'Analysis: Manual Upload Data';
const downloadStep = 'Analysis: Manual Download Data';


/**
 * This is the table generated in form 0 for selection
 * Get the analysis method template list from database and generate and define the columns and options for the active and inactive tables.
 *
 * @function AjaxGetAnalysisMethodList
 * @returns {table} the html to display on the active and inactive tabs
 */
function AjaxGetAnalysisMethodList() {
  let request = {
    stepName: 'ajaxGetAllAnalysisMethodsList'
  };

  $.getJSON('uniflow?', request).done(function (data) {

    let dataOrigArr = data.data;

    // Sort the original data object returned by the ajax call
    dataOrigArr.sort(compareAnalysisMethodLists);

    // get an array of active objects
    //   we don't need to check the version here because active ones will always be the most current version.
    //   By design we are not letting them reacivate old versions. If they need to "activate" an old version then a new version with the old version settings will be created.
    let dataActive = dataOrigArr.filter(function(item){
      if(item.active*1 === 1){
        return item;
      }
    });

    // get an array of active method template Id's
    //   this will be used to filter out old templates for active versions.
    let filteredActiveTemplates = dataActive.map(function(item){
    return item.analysisMethodsId
    });

    // get an array of inactive objects that are also not already in the active list
    let dataInActiveSorted = dataOrigArr.filter(function(item){
      if(item.active*1 === 0 && filteredActiveTemplates.indexOf(item.analysisMethodsId*1) === -1){
        return item;
      }
    }).sort(compareAnalysisMethodLists)

    // get an array of inactive object that contain only the most current version
    let dataInActive = dataInActiveSorted.filter(function(item){
      let currentItemVersion = item.version*1
      let largestVersionNumber = 0;

      dataInActiveSorted.forEach(function(element) {
        let elementVersion = element.version*1
        if(element.analysisMethodsId === item.analysisMethodsId){
          if(largestVersionNumber < elementVersion){
            largestVersionNumber = elementVersion;
          }
        }
      })
      if(currentItemVersion ===  largestVersionNumber){
        return item;
      }
    });


    $('#analysisMethodsActive').html('')
    $('#analysisMethodsActive').append('<table id="analysisMethodsActiveTable" ></table>');

    $('#analysisMethodsInactive').html('')
    $('#analysisMethodsInactive').append('<table id="analysisMethodsInactiveTable" ></table>');

    let columns = [
      {
        "title": "Name",
        "data": null,
        "render": function (data, type, row, meta) {
          let returnValue = data.methodName;
          if(type === 'display'){
            returnValue = '<a href="#" class="editRow"><i class="fas fa-edit" aria-hidden="true" ></i></a>' + data.methodName;
          }
          return returnValue;
        }
      },
      {
        "title": "Description",
        "data": null,
        "render": function (data, type, row, meta) {
          let returnValue = data.description;
          if(type === 'display'){
            returnValue = data.description;
          }
          return returnValue;
        }
      },
      {
        "title": "Associated Step",
        "data": null,
        "render": function (data, type, row, meta) {
          let returnValue = data.stepName;
          if(type === 'display'){
            returnValue = data.stepName;
          }
          return returnValue;
        }
      }

    ];

    let options = {
        createdRow: function(row, data, dataIndex) {
            let rowObj = $(row);
            rowObj.attr('data-Id', data.versionId);
            rowObj.attr('data-active', data.active);
            rowObj.attr('data-description', '');
            rowObj.attr('data-methodName', data.methodName);
            rowObj.attr('data-analysisMethodsId', data.analysisMethodsId);
            rowObj.attr('data-version', data.version);
        }
    };

    let aMActiveTable = stdDataTableFromArray('#analysisMethodsActiveTable', columns, dataActive, true, options);

    let aMInActiveTable = stdDataTableFromArray('#analysisMethodsInactiveTable', columns, dataInActive, true, options);

    $("#analysisMethodsActiveTable").removeAttr("style")
    $("#analysisMethodsInactiveTable").removeAttr("style")

    $('#analysisMethodsActiveTable tbody').on('click', '.editRow',function(){
        let parentRow = $(this).parent().parent();
        let templateId = parentRow.attr('data-Id');
        let win = window.open("/uniflow?lastForm=Y&stepName=Analysis Method Configuration&templateId=" + templateId, "_self");
    })

    $('#analysisMethodsInactiveTable tbody').on('click', '.editRow',function(){
        let parentRow = $(this).parent().parent();
        let templateId = parentRow.attr('data-Id');
        let win = window.open("/uniflow?lastForm=Y&stepName=Analysis Method Configuration&templateId=" + templateId, "_self");
    })

  }).fail(function (jqxhr, textStatus, error) {
    let err = "Request Failed: " + textStatus + ", " + error;
    console.log(err);
    alert(err);
  });
}



/**
  * Sets #associatedStepType value to the non-configured step name(type?) based on selected step
  *   Hides/shows add new field button and specimen/location select element
  *
  * @function getStepName
  * @param selectedStep
  *
**/
function getStepName(selectedStep, onload = false){
    if(selectedStep.length > 0){
        let request = {
            stepName: 'ajaxGetStepName',
            selectedStep: selectedStep
        };
        $.getJSON('uniflow?', request).done(function (data) {
            let step = data[0].stepType;
            showTables(step, onload);
            if(step == downloadStep){
                columnOrderAttr();
                ifToInst();
            } else if(step == uploadStep){
                ifFromInst();
            } else {
                ifNotToFromInst();
            }

            $('#associatedStepType').val(step);
        })
    } else{
        $('#associatedStepType').val('');
        ifNotToFromInst();
        showTables("");
    }
}

/**
  *
  * Runs the needed configuration for to instrument steps
  *
  * @function ifToInst
  *
**/
function ifToInst(){
    // Show
    $('.toInstColumns').show()
    // Hide
    $('#dataFieldAddButtonSection').hide()
    $('#dataFieldSectionsArea').hide()
    // Required
    makeRequired('.columnSelect')
    // Other
    $('.columnSelect').attr('data-parsley-column-order','true');
    $('#dataFieldSectionsArea').empty()

}

/**
  *
  * Runs the needed configuration for from instrument steps
  *
  * @function ifFromInst
  *
**/
function ifFromInst(){
    // Show
    $('#dataFieldAddButtonSection').show()
    $('#dataFieldSectionsArea').show()
    $('.toInstColumns').show();
    $('.fieldColumn').closest('div').show()

    //Hide
    $('.tableFieldOrder').closest('div').hide()

    // Required
    makeRequired('#specimenColumn')
    makeRequired('#locationColumn')
    makeRequired('.fieldColumn')
    // Not Required
    makeNotRequired('.tableFieldOrder')

    // Other
    $('.fieldColumn').addClass('fromInst');
    $('.fieldColumn').attr('data-parsley-column-order','true');
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

/**
  * Shows/hides: meta/load fiels sets
  * Loads meta/load tables
  *
  * @param{string} templateVersion - Template version
  * @param{string} ajaxStep - Ajax step name where the data is coming from
  * @param{string} dataVarId - Id of hidden variable to store the data (include '#')
  *
**/
function showTables(stepType, onload = false){

  var isToInst = (stepType == downloadStep) ? 'toInst':'';


  if($('#associatedStepName').val() != '' && stepType != uploadStep){
    loadMetaDataTable($('#associatedStepName').val(), isToInst, onload);
    loadPreviousData($('#associatedStepName').val(), isToInst, onload);

  } else {
    $('#metaField').hide();
    $('#loadField').hide();
    $('#prevDataTable').empty()
    $('#metaDataLoad').empty()
  }

    $('#configOptions').show();
    $('#loadingProgress').hide();

}

/**
  *
  * Loads the Load Previous Data table to #prevDataTable or hides the fieldset
  *
  * @function loadPreviousData
  * @param selectedStep
  *
**/
function loadPreviousData(selectedStep, stepType, onload = false){

    // show loading bar
    let loadingdiv = $('#loadingProgress').clone()
    loadingdiv.attr("id", "loadingProgressPrevious");
    loadingdiv.css("display", "block");

    $('#prevDataTable').html(loadingdiv)
    $('#loadField').show();


  if(selectedStep.length > 0){
    let request = {
     stepName: 'ajaxGetPanelsPerStep',
     selectedStep: selectedStep
    };
    $.getJSON('uniflow?', request).done(function (data) {
        let panelCodesArr = data[0].panelCodes;
        if(panelCodesArr){
            $('#prevDataTable').load('/uniflow', {stepName: 'ajaxPrevDataTable', associatedPanels: panelCodesArr, associatedStep: selectedStep, stepType: stepType}, function(responseTxt, statusTxt, xhr){
                if(statusTxt == "success"){
                    if(onload){
                        let templateVersion = $('#methodVersionId').val();
                        // Retreive previously saved data
                        getPrevData(templateVersion, 'ajaxGetPrevLoadData', '#previousLoadData');
                              
                    }

                    hideColumns('#loadDataTable', 'hiddenColumn');
                    columnOrderAttr();
                    orderChange('prevData');
                    checkChange('prevData');

                    $('#configOptions').show();
                    $('#loadingProgress').hide();
                    $('#loadField').show();
                    addParsleyLoadFieldOrders('DUPLICATE')


                }

                if(statusTxt == "error"){
                  console.log("Error: " + xhr.status + ": " + xhr.statusText);
                }
              });


        } else{
            $('#loadField').hide();
            $('#prevDataTable').empty()
        }
    })
  }
}

/**
  *
  * Loads the Meta Data table to #metaDataLoad or hides the fieldset
  *
  * @function loadMetaDataTable
  * @param{string} selectedStep
  * @param{string} stepType
  *
**/
function loadMetaDataTable(selectedStep, stepType, onload = false){

    // show loading bar
    let loadingdiv = $('#loadingProgress').clone()
    loadingdiv.attr("id", "loadingProgressMeta");
    loadingdiv.css("display", "block");

    $('#metaDataLoad').html(loadingdiv)
    $('#metaField').show();
    let request = {
      stepName: 'ajaxGetPanelsPerStep',
      selectedStep: selectedStep
    };

    $.getJSON('uniflow?', request).done(function(data){
      let panelCodesArr = data[0].panelCodes;
      if(panelCodesArr){
        // this will replace the load icon
        $('#metaDataLoad').load('/uniflow', {stepName: 'ajaxMetaDataTable', associatedPanels: panelCodesArr, stepType: stepType}, function(responseTxt, statusTxt, xhr){
            if(statusTxt == "success"){
                if(onload){
                    let templateVersion = $('#methodVersionId').val();
                    // Retreive previously saved data
                    getPrevData(templateVersion, 'ajaxGetMetaData', '#previousMetaData');
                }

                hideColumns('#metaDataTable', 'hiddenColumn');
                columnOrderAttr();
                orderChange('metaData');
                checkChange('metaData');
                addParsleyMetaFieldOrders('DUPLICATE')

            }
            if(statusTxt == "error"){
              console.log("Error: " + xhr.status + ": " + xhr.statusText);
            }
          });


      } else{
        $('#metaField').hide();
        $('#metaDataLoad').empty()
      }
        
    });

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
        var prevDataJson = createJSONObject(dataVarId);

        let orderNumClass = '.prevData_order';
        let chkboxClass = '.prevData_checkbox';
        let defId = '.prevDataDefId'
        let tableId = '#loadDataTable'
        let tableType = 'prevData';

        if(dataVarId === '#previousMetaData'){
            orderNumClass = '.metaData_order';
            chkboxClass = '.metaData_checkbox';
            defId = '.formInputId';
            tableId = '#metaDataTable';
            tableType = 'metaData';
        }

        $($(defId).get().reverse()).each(function(){

            for(data in prevDataJson){
                if($(this).val() == prevDataJson[data].id){
                    moveCheckedToTop($(this));
                    addOrderAttr($(this));
                    $(this).parents().siblings().children(orderNumClass).val(prevDataJson[data].order);
                    $(this).parents().siblings().children(chkboxClass).prop('checked',true);
                }
            }
        });


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
  * Shows/Hides: order/select fields
  * Adds/Removes: required and parsley validation
  *
  * @function columnOrderAttr
  *
**/
function columnOrderAttr(){
    if($('.toInst').val() != undefined){
        hideColumns('#metaDataTable', 'numberField');
        hideColumns('#prevDataTable', 'numberField');
        $('.numberField').removeClass('required');
        $('.numberField').attr('data-parsley-required','false');
        $('.columnSelect').attr('data-parsley-column-order','true');
    } else if($('.fromInst').val() != undefined){
        // 
    } else {
        $('.numberField').prop('type', 'number');
        hideColumns('#metaDataTable', 'columnSelect');
        hideColumns('#prevDataTable', 'columnSelect');
        $('.columnSelect').removeClass('required');
        $('.columnSelect').attr('data-parsley-required','false');
        $('.columnSelect').attr('data-parsley-column-order','false');
    }
}

function addOrderAttr(refClass){
    refClass.parents().siblings().children('.orderClass').attr('data-parsley-required','true');
    refClass.parents().siblings().children('.orderClass').addClass('required');
}

function removeOrderAttr(refClass){
    refClass.parents().siblings().children('.orderClass').attr('data-parsley-required','false');
    refClass.parents().siblings().children('.orderClass').removeClass('required');
    refClass.parents().siblings().children('.orderClass').val('');
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
  * When the order is changed, this updates the checked field
  *
  * @function orderChange
  * @param{string} tableName
  *
**/
function orderChange(tableName){
    $('.' + tableName +'_order').on('change', function(){
        let testThis = $(this).val()
        if(testThis != ''){
            $(this).parent().siblings().children('.' + tableName + '_checkbox').prop('checked',false).change()
            $(this).val(testThis)
            $(this).parent().siblings().children('.' + tableName + '_checkbox').prop('checked',true).change()
            addOrderAttr($(this));
            columnOrderAttr();
        }else{
            $(this).parent().siblings().children('.' + tableName + '_checkbox').prop('checked',false).change()
            removeOrderAttr($(this));
        }
    });
}

/**
  *
  * When the checkbox is changed, this updates the order field
  *
  * @function orderChange
  * @param{string} tableName
  *
**/
function checkChange(tableName){
    $('.' + tableName +'_checkbox').on('change', function(){
        if($(this).is(':checked')){
            addOrderAttr($(this));
            columnOrderAttr();
        }else{
            removeOrderAttr($(this));
        }
    });
}
