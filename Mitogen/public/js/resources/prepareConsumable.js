$(document).ready(function(){
  $('.hiddenOnLoad').hide();

  var reagentsDefaultRow =  $('#reagentsTable tbody tr');
  var controlDefaultRow =  $('#controlsTable tbody tr');

  $('#reagents').click( function() {
    var tableName = 'reagentsTable';
    inputTableAddRow(tableName, true, reagentsDefaultRow);
  });
  $('#controls').click( function() {
    var tableName = 'controlsTable';
    inputTableAddRow(tableName, true, controlDefaultRow);
  });

  $(document).on('change', '.resourceSelect', function(){
    setBarcodeRequired( $(this) );
    fillThisUnit( $(this) );
  });

  $('#deleteSelectedReagents').click( function() {
    deleteRow('reagentsTable');
  });
  $('#deleteSelectedControls').click( function() {
    deleteRow('controlsTable');
  });

  $('#expirationDate').change(function() {
    $('.expirationDate').val( $(this).val() );
  });

  $('#generateIds').click(function() {
    generateSequences('newContainer');
  });

  $(document).on('blur', '.duplicateCheckInput', function() {

    if ( $(this).val() != '' ) {
      let $thisInput = $(this);

      var className = '';

      if ( $(this).hasClass('newContainer') ) {
        className = 'newContainer';
      }
      if ( $(this).hasClass('reagentBarcode') ) {
        className = 'reagentBarcode';
      }
      if ( $(this).hasClass('controlBarcode') ) {
        className = 'controlBarcode';
      }

      let duplicateContainerIdCount = preparedContainerDuplicateIdCount(className);
      if ( duplicateContainerIdCount > 0 ) {
        createSimpleModal('requiredError', "Duplicate barcode has been entered.", "Duplicate Id");
        $thisInput.val('');
        $thisInput.parent().addClass('backgroundColorRed');
        $thisInput.parent().removeClass('backgroundColorPaleGreen');
        return;
      } 

    }
  });

  $('.newContainer').blur(function() {
    let $thisInput = $(this);
    if ( $(this).val() != '') {

      let uniqueIdData = {
        "stepName": 'AjaxCheckUniqueContainerId',
        "containerId": $(this).val()
      }
      $.getJSON('/uniflow?callback=?', uniqueIdData)
        .done(function(data) {
          if ( data[0] ){
            if ( data[0].uniqueCheck == 1 ) {
              createSimpleModal('requiredError', "Container id already exists.", "Duplicate Id");
              $thisInput.val('');
              $thisInput.parent().addClass('backgroundColorRed');
              $thisInput.parent().removeClass('backgroundColorPaleGreen');
              return;
            }
          }
       });

    }
  });

  // Add support for printing the barcode
  printTableInputBarcodeByClass('#containerTable', '.printButton');

  $('#printDocument').hide();

  //setupPrintAllBarcodesInTableInputBarcodeByClass(`#printAllDiv`, `printAllNewBarcodes`);
  //getTablePrintVariablesData($('#containerTable'), $('#printAllDiv'), $('#printAllNewBarcodes'));
  printAllBarcodesInTableInputBarcodeByClass('#printAllDiv', '#containerTable', 'printAllNewBarcodes');
  

  $('#stepFormSubmitButton').click(function(ev){  
    ev.preventDefault();
    let resourceCount = preparedContainerResourceCount();
    let duplicateContainerIdCount = preparedContainerDuplicateIdCount();

    if( resourceCount == 0 ) {
      createSimpleModal('requiredError', "At least once resource must be assigned to the prepared container.", "Missing Resources");
      return;
    } 
    else if ( duplicateContainerIdCount > 0 ) {
      createSimpleModal('requiredError', "Duplicate container ids have been entered.", "Duplicate Ids");
      return;
    } 
    else {
      $('[name="stepForm"]').submit();
    }
  });

});

function fillThisUnit(input) {
  var value = input.val();
  var inputElem = input.parent().find('input[autocomplete]');
  var getData = {
    "stepName": "Ajax Get Unit For Reagent",
    "reagentType": value
  };
  inputElem.css('border-color', 'initial');
  if(value == '') {
    input.parents('td').siblings().children('.units').val('');
  } else {
    inputElem.css('border-color', 'initial');

    $.getJSON('/uniflow?callback=?', getData)
    .done(function(data) {
      input.parents('td').siblings().children('.units').val(data[0].unit);
   });
  }
}

function deleteRow(tableId) {
  var deletedCount = 0;
  $('#'+tableId+' input[type=checkbox]').each(function(){
    if (this.checked) {
      deletedCount++;
      $(this).parent().parent().remove();
    } 
  });
  if(deletedCount > 0) {
    //update the types and input names to be in the correct order
    var rowCount = 0;
    $('#'+tableId+' tbody tr').each(function(i){
      rowCount++;
      $(this).find('input').each(function(){
        if($(this).attr('name')) {
          var nameParts = $(this).attr('name').split('_');
          var name = nameParts[0]+'_'+i+'_'+nameParts[2];
          $(this).attr('name', name);
        }
      });
    }); 
    $('input[name="' + tableId + '_numRows"]').val(rowCount);
  }
}

function generateSequences(barcodeClass) {
  $('.' + barcodeClass).each(function() {
    getAndPlaceNextSequence('preparedContainerId', $(this), 'sequenceValue');
  })
}

function setBarcodeRequired(reagent) {
  if (reagent.val() != ''){
    reagent.parent().siblings().children('.resource').attr('data-parsley-required', 'true');
    reagent.parent().siblings().children('.resource').addClass('required');
    reagent.parent().siblings().children('.amount').attr('data-parsley-required', 'true');
    reagent.parent().siblings().children('.amount').addClass('required');
  } else {
    reagent.parent().siblings().children('.resource').attr('data-parsley-required', 'false');
    reagent.parent().siblings().children('.resource').removeClass('required');
    reagent.parent().siblings().children('.amount').attr('data-parsley-required', 'false');
    reagent.parent().siblings().children('.amount').removeClass('required');
  }
}

function preparedContainerResourceCount() {
  let resourceCount = 0;
  $('.resource').each(function()  {
    if ( $(this).val() != '' ) {
      resourceCount++;
    }
  });
  return resourceCount;
}

function preparedContainerDuplicateIdCount(className) {
  let containerIdArray = [];
  $('.' + className).each( function() {
    if ($(this).val() != '' ) {
      containerIdArray.push( $(this).val().toUpperCase() );
    }
  });

  let duplicateCheckArray = checkArrayForDuplicates(containerIdArray);

  return duplicateCheckArray.length;
}
