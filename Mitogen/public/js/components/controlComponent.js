
$(document).ready( function() {
  var listName = getListName();

  var config = getConfig(listName);

 if( $('#controlListTable_validateOrTransfer').val() == 'Validate' || $('#controlListTable_validateOrTransfer').val() == 'CherryValidate'){
      addParsleyCompare('.controlListTable_controlTubeId', 'Value scanned must be matched with Control Id');
    }

  if( $('#existingControls').val() === 'Yes'){
    $('#existingControlsDiv').show();
  } else {
    $('#existingControlsDiv').hide();
  }

  if( $('#addControls').val() === 'Yes'){
    $('#addControlsDiv').show();
  } else {
    $('#addControlsDiv').hide();
  }

  hidePrintColumnOnLoad();

  $('.controlAddTable_newTubeId').each(function(){
    $(this).addClass("countControl");
  });

  $('.controlListTable_comment').each(function(){
    if( $(this).val() == '') {
      $(this).prop('disabled', true);
      $(this).addClass("disabled");
    }
  });

  $('.controlAddTable_comment').each(function(){
    if( $(this).val() == '') {
      $(this).prop('disabled', true);
      $(this).addClass("disabled");
    }
  });
  

  if ( $('#controlComponentComments').val() == 'No' ) {
    $('.controlAddTable_comment, .controlListTable_comment').addClass('hideColumn');
  }

  hideColumns('#controlListTable', 'hideColumn');
  hideColumns('#controlAddTable', 'hideColumn');

  // Generate new controlTubeIds on load when configured //
  var generatedNewControls = generateControlIdsOnLoad(config);
  // if the generatedNewControls is false then the updatecounter, updateControlUsage and updateReagentUsage will be called after control is loaded 
  if(generatedNewControls){
    updateCounter(config)
    updateControlUsage();
    updateReagentUsage();
  }

  // Add support for printing the barcode
  var addControlListOfVariables = ['.controlAddTable_newTubeId']
  printTableInputBarcodeByClass('#controlAddTable', '.printControlButton', addControlListOfVariables);

  var controlListOfVariables = ['.controlListTable_scan']
  printTableInputBarcodeByClass('#controlListTable', '.printExistingControlButton', controlListOfVariables);

  hideCommentFieldsOnLoad();
  hideCommentHistoryOnLoad();

  $('#addControl').click(function(){
    inputTableAddRow('controlAddTable', true);
    correctColumnFour();
    $('#controlAddTable > tbody >tr').last().children().children('.controlAddTable_controlType').removeClass("activeControl");
    $('#controlAddTable > tbody >tr').last().children().children('.controlAddTable_newTubeId').addClass("countControl");
    $('#controlAddTable > tbody >tr').last().children().children('.controlAddTable_comment').prop('disabled', true);
    $('#controlAddTable > tbody >tr').last().children().children('.controlAddTable_comment').addClass("disabled");
    $('#controlAddTable > tbody >tr').last().find('.printBarcodeBtn').removeAttr('name').val('Print');
    updateCounter(config);
    updateControlUsage();
    updateReagentUsage();

  });


  $('.controlListTable_checkbox').change(function(){
    if( $(this).is(':checked') == true ){
      $(this).parent().siblings().children('.controlListTable_comment').prop('disabled', false);
      $(this).parent().siblings().children('.controlListTable_comment').removeClass("disabled");
      $(this).addClass("countControl");
      var controlTubeId = $(this).parent().siblings().children('.controlListTable_controlTubeId').val();

      if( $('#controlListTable_validateOrTransfer').val() == 'Validate' || $('#controlListTable_validateOrTransfer').val() == 'CherryValidate'){
        if ( $(this).parent().siblings().children('.controlListTable_scan').val() != '' &&  $(this).parent().siblings().children('.controlListTable_scan').val() != controlTubeId) {
          $(this).parent().siblings().children('.controlListTable_scan').val('');
          $(this).prop('checked', false);
          createSimpleModal('controlComponentModal', 'Incorrect barcode entered.', 'Incorrect Barcode');
        } else {
          $(this).parent().siblings().children('.controlListTable_scan').val(controlTubeId);
        }
      } else {
        generateControlIdsOnCheckbox($(this));
        if($('#controlIdGen').val() != 'Use Existing Identifier' && $('#controlIdGen').val() != 'User Generated'){
          $(this).parent().siblings().children('.controlListTable_scan').prop('readonly', true);
        } else {
          $(this).parent().siblings().children('.controlListTable_scan').prop('readonly', false);
        
        }

      }
    } else{
      var blank = '';
      $(this).parent().siblings().children('.controlListTable_scan').val(blank);
      $(this).parent().siblings().children('.controlListTable_comment').prop('disabled', true);
      $(this).parent().siblings().children('.controlListTable_comment').addClass("disabled");
      $(this).parent().siblings().children('.controlListTable_scan').prop('readonly', false);
      $(this).removeClass("countControl");
    }
    updateCounter(config);
  });

  $('.controlListTable_scan').blur(function(){
    if( $(this).val() != '' ){
      $(this).parent().siblings().children('.controlListTable_checkbox').prop('checked',true).change();
      $(this).parent().siblings().children('.controlListTable_comment').prop('disabled', false);
      $(this).parent().siblings().children('.controlListTable_comment').removeClass("disabled");

    } else{
      $(this).parent().siblings().children('.controlListTable_checkbox').prop('checked',false).change();
      $(this).parent().siblings().children('.controlListTable_comment').prop('disabled', true);
      $(this).parent().siblings().children('.controlListTable_comment').addClass("disabled");

    }
  });

  // Remove disabled from all fields
  $('form').submit(function(event) {
    event.preventDefault();
    let passValidation = passValidationCheck();
    if( passValidation ){
      $('.controlAddTable_comment').prop("disabled", false);
      $('.controlListTable_comment').prop("disabled", false);
      $('.error').remove();
      event.currentTarget.submit();
    }else{
      $('#addTableErrorMessage').html('');
      $('#addTableErrorMessage').append('<h2 class= "error"> Control Type and Tube ID fields for new controls must be filled out</h2>');
    }

  });


});

$(document).on('change', '.controlAddTable_newTubeId', function(event) {
  var listName = getListName();
  var config = getConfig(listName);
  var $aliquot = $(this);
  if( $(this).val() != '' ){
    // Check if new container
    var request = {
      stepName: 'Ajax Is Container',
      inputId: $aliquot.val()
    };
    $.getJSON('uniflow?', request).done( function(data) {
      if(data[0].isContainer == 'YES' && $('#controlIdGen').val() != 'Use Existing Identifier') {
        alert($aliquot.val() + ' already exist in the database. You must use a unique container ID for controls.');
        $aliquot.val('');
        $aliquot.focus();
      } else {
        $aliquot.parent().siblings().children('.controlAddTable_comment').prop('disabled', false);
        $aliquot.parent().siblings().children('.controlAddTable_comment').removeClass("disabled");
        $aliquot.parent().siblings().children('.controlAddTable_controlType').addClass("activeControl");
      }
    });
  } else{
    $(this).parent().siblings().children('.controlAddTable_comment').prop('disabled', true);
    $(this).parent().siblings().children('.controlAddTable_comment').addClass("disabled");
    $(this).parent().siblings().children('.controlAddTable_controlType').removeClass("activeControl");

  }
  updateCounter(config);
  updateControlUsage();
  updateReagentUsage();

});

$(document).on('change', '.controlAddTable_controlType', function(event) {
  var listName = getListName();
  var config = getConfig(listName);
  $(this).parent().siblings().children('.controlAddTable_newTubeId').addClass("countControl");
  //auto generate controlTubeIds when controlType is selected //
  generateControlIdsOnControlTypeChange($(this));
  updateCounter(config);
  updateControlUsage();
  updateReagentUsage();
});

$(document).on('click', '.controlAddTable_checkbox', function(event) {
  var listName = getListName();
  var config = getConfig(listName);
  if( $(this).is(':checked') == true ){
    var rowIndex = $(this).parent().parent().index();
    var blank = '';
    $(this).parent().siblings().children('.controlAddTable_controlType').val(blank);
    $(this).parent().siblings().children('.controlAddTable_newTubeId').val(blank);
    $(this).parent().siblings().children('.controlAddTable_comment').val(blank);
    $(this).parent().siblings().children('.controlAddTable_controlType').removeClass("activeControl");
    $(this).parent().siblings().children('.controlAddTable_comment').addClass("disabled");
    $(this).parent().siblings().children('.controlAddTable_newTubeId').removeClass("countControl");
    if( rowIndex + 1  == 1){
      $(this).prop('checked',false);
    }else{
      $(this).parent().parent().hide();
    }
  }
  updateCounter(config);
  updateControlUsage();
  updateReagentUsage();
});

function updateControlUsage() {
  $('#controlResources > tbody > tr').children().children('.controlNameForLot').each(function(){
    var controlType = $(this).val();
    var amountPerSample = $(this).parent().siblings().children('.sampleAmount').val();
    var total;
    var i = 0;
    var typeArr = []
    $('.activeControl').each(function(){
      var newControlTypeValue = $(this).val();
      typeArr.push(newControlTypeValue)
      if (newControlTypeValue == controlType) {
        i++;
      }
    });

    if( typeArr.indexOf(controlType) > -1 ){

      total = (i * amountPerSample);
    } else {
      let listName = getListName();
      let config = getConfig(listName);
      total = ($(`#${config.prefix}Counter`).val() * amountPerSample);
    }

    if(Number.isNaN(total)){
      total = 0;
    }

    $(this).parent().siblings().children('.totalAmount').val( parseFloat(total).toFixed(2) );
  });
}


function updateReagentUsage() {
  $('#reagentResources > tbody > tr').each(function(){
    var amountPerSample = $(this).find('.sampleAmount').val();
    let listName = getListName();
    let config = getConfig(listName);
    var total = ($(`#${config.prefix}Counter`).val() * amountPerSample);

    if(Number.isNaN(total)){
      total = 0;
    }

    $(this).find('.totalAmount').val( parseFloat(total).toFixed(2) );
  });
}

function correctColumnFour() {
  $('#controlAddTable > tbody > tr').each(function(){
    var rowNumber = $(this).index();
    $(this).children().children('.printControlButton').attr('name', 'controlAddTable' + '_' + rowNumber + '_' + 4);
  })
}

function passValidationCheck(){
  let passesTrue = true;
  $('#controlAddTable > tbody > tr').each(function(){
    if ( $('#addControls').val() == 'Yes'){
      if ( $(this).children().children('.controlAddTable_checkbox').is(':checked') == false && $(this).children().children('.controlAddTable_controlType').val() != '' && $(this).children().children('.controlAddTable_newTubeId').val() != '' ) {
      } else if ( $(this).children().children('.controlAddTable_checkbox').is(':checked') ) {
      } else if ( $(this).children().children('.controlAddTable_checkbox').is(':checked') == false && $(this).children().children('.controlAddTable_controlType').val() == '' && $(this).children().children('.controlAddTable_newTubeId').val() == '' ) {
      } else {
       passesTrue = false;
      }
    }
  })
  return passesTrue;
}

function generateControlIdsOnLoad(config){
  if( $('#controlIdGen').val() == 'Auto Generated'){
    $('.controlAddTable_newTubeId').each(function(){
      getAndPlaceNextSequence('controlTubeId', $(this), 'sequenceValue', function() {
        $(this).blur();
        updateCounter(config)
        updateControlUsage();
        updateReagentUsage();
      });
      $(this).parent().siblings().children('.controlAddTable_comment').prop("disabled", false);
      $(this).parent().siblings().children('.controlAddTable_comment').removeClass("disabled");
      $(this).parent().siblings().children('.controlAddTable_controlType').addClass("activeControl");
      $(this).prop('readonly', true);
    });
    return false;
  } else {
    return true;
  }
}

function generateControlIdsOnControlTypeChange(type){
  var generatedControlId = type.parent().siblings().children('.controlAddTable_newTubeId');
  if( $('#controlIdGen').val() == 'Auto Generated'){
    if( generatedControlId.val() == '' ){
      getAndPlaceNextSequence('controlTubeId', generatedControlId, 'sequenceValue', function() {
        type.blur();
      });
      type.parent().siblings().children('.controlAddTable_comment').prop("disabled", false);
      type.parent().siblings().children('.controlAddTable_comment').removeClass("disabled");
      type.parent().siblings().children('.controlAddTable_newTubeId').prop('readonly', true);
      type.addClass("activeControl");
    }
  }
}

function generateControlIdsOnCheckbox(cbox){
  var generatedControlId = cbox.parent().siblings().children('.controlListTable_scan');
  if( $('#controlIdGen').val() == 'Auto Generated'){
    if( $('#controlListTable_validateOrTransfer').val() == 'Transfer' || $('#controlListTable_validateOrTransfer').val() == 'CherryTransfer'){
      getAndPlaceNextSequence('controlTubeId', generatedControlId, 'sequenceValue', function() {
        $(this).blur();
      });
    };
  };
}

function hideCommentFieldsOnLoad() {
  if( $('#controlComponentComments').val() == 'No'){
    hideColumns('#controlListTable', 'controlListTable_comment');
    hideColumns('#controlAddTable', 'controlAddTable_printButton');
  }
}

function hidePrintColumnOnLoad() {
  if( $('#printBarcodes').val() == 'No'){
    hideColumns('#controlListTable', 'controlAddTable_printButton');
    hideColumns('#controlAddTable', 'controlAddTable_printButton');
  }
}

/*
Hide the comment history column when the configuration is set to "No"
*/
function hideCommentHistoryOnLoad() {
  if($('#controlComponentCommentHistory').val() == "No") {
    var $commentHistoryColumn = $('#controlListTable > thead > tr > th').filter(function() {
      return (this.innerHTML == "Comment History"); //Based on the column name given in taskComponents_includables.ixml
    });
    var colIndex = $commentHistoryColumn.index();
    $commentHistoryColumn.hide();
    var $rows = $('#controlListTable > tbody > tr');
    if($rows.length > 0) {
      $rows.find('td:eq(' + colIndex + ')').hide();
    }
  }
}

