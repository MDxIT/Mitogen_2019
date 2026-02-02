$(document).ready( function() {

	if ( $('#initialConcentration').val() == 'N/A') {
    alert('This sample does not have a verified concentration!');
  }

  hideColumns('#dilutionTable', 'hideColumn');
  hideColumns('#reagentResources', 'sampleAmount');

  $('.dilutionContainer').each( function() {
    $(this).attr('id', $(this).attr('name'));
  });

  if($("#serialDilutionPrintSampleBarcode").val() == "Print") {
    printTableInputBarcodeByClass('#dilutionTable', '.dilutionContainer');
  }

  $('.initialInput').change( function() {
    dilutionLoopCheck( $(this).attr('id') );
  });


  $('#finalConcentration').change( function() {
    if ( parseFloat($(this).val()) < 0.01 ) {
      createSimpleModal('modal', "This input has to have a value greater than or equal to 0.01.", "Concentration Error");
      $(this).val('');
      $(this).focus();
      return;
    }
    else if ( !$.isNumeric( $(this).val() ) ) {
      createSimpleModal('modal', "Value must be a number.", "Numeric Error");
      $(this).val('');
      $(this).focus();
      return;
    }
    else if ( parseFloat($(this).val()) > parseFloat($('#initialConcentration').val()) ) {
      createSimpleModal('modal', "Target concentration must be less than the source sample concentration.", "Concentration Error");
      $(this).val('');
      $(this).focus();
      return;
    }
    else {
      dilutionLoopCheck();
    }
  });

  // Updates single ID and last row container to be the same value
  $(document).on('change', '.destinationContainer', function() {
    var containerVal = $(this).val();
    $('.destinationContainer').each( function() {
      $(this).val(containerVal);
    });
  });

});

/**
*
**/
function dilutionLoopCheck( inputId ) {

  // For each initial input
  $('.initialInput').each( function() {
    // console.log($(this).attr('id'));
    // If this is not blank
    if ( $(this).val().trim() != '' ) {
      // Needs to be a number
      if ( !$.isNumeric( $(this).val() ) ) {
        createSimpleModal('modal', "Value must be a number.", "Numeric Error");
        $(this).val('');
        $(this).focus();
        return;
      }
      // Needs to be greater than 0.01
      else if ( parseFloat($(this).val()) < 0.01 ) {
        createSimpleModal('modal', "This input has to have a value greater than or equal to 0.01.", "Numeric Error");
        $(this).val('');
        $(this).focus();
        return;
      }

    }

    // excluding the final concentration
    if ( inputId != 'finalConcentration') {
      //Populate first row
      $('#dilutionTable tbody tr:first').children('td').children('.' + inputId).val( $('#'+ inputId).val() );
    }

  });

  // Final concentration specific checks
  if ( inputId == 'initialVolume' ) {
    // Final concentration must be less than the initial concentration
    if ( parseFloat( $('#minVolume').val() ) > parseFloat( $('#initialVolume').val() ) ) {
      createSimpleModal('modal', "Sample volume must be greater than minumum pipette volume.", "Volume Error");
      $('#' + inputId).val('');
      $('#' + inputId).focus();
      return;
    }
  }

  // Minimum volume specific checks
  if ( inputId == 'minVolume' ) {
    // Minimum volume must be less than the maximum volume
    if ( parseFloat( $('#minVolume').val() ) >= parseFloat( $('#maxVolume').val() ) ) {
      createSimpleModal('modal', "Minimum pipette volume must be less than the maximum destination volume.", "Volume Error");
      $('#' + inputId).val('');
      $('#' + inputId).focus();
      return;
    }
  }

  // Maximum volume specific checks
  if ( inputId == 'maxVolume' ) {
    // Maximum volume must be greater than the minimum volume
    if ( parseFloat( $('#minVolume').val() ) >= parseFloat( $('#maxVolume').val() ) ) {
      createSimpleModal('modal', "Maximum destination volume must be greater than the minimum pipette volume.", "Volume Error");
      $('#' + inputId).val('');
      $('#' + inputId).focus();
      return;
    }
    // Maximum volume must be greater than the final volume
    if ( parseFloat( $('#finalVolume').val() ) >= parseFloat( $('#maxVolume').val() ) ) {
      createSimpleModal('modal', "Maximum destinaton volume must be greater than the target volume.", "Volume Error");
      $('#' + inputId).val('');
      $('#' + inputId).focus();
      return;
    }
  }

  // Final volume specific checks
  if ( inputId == 'finalVolume' ) {
    // Maximum volume must be greater than the final volume
    if ( parseFloat( $('#finalVolume').val() ) >= parseFloat( $('#maxVolume').val() ) ) {
      createSimpleModal('modal', "Maximum destination volume must be greater than the target volume.", "Volume Error");
      $('#' + inputId).val('');
      $('#' + inputId).focus();
      return;
    }
  }

  // Final concentration specific checks
  if ( inputId == 'finalConcentration' ) {
    // Final concentration must be less than the initial concentration
    if ( parseFloat( $('#finalConcentration').val() ) >= parseFloat( $('#initialConcentration').val() ) ) {
      createSimpleModal('modal', "Target concentration must be less than the source sample concentration.", "Concentration Error");
      $('#' + inputId).val('');
      $('#' + inputId).focus();
      return;
    }
  }

  // Check for blank inputs which are required, run dilution loop if all fields are populated
  var missingInput = 0;
  $('.initialInput').each( function() {
    if ( $(this).val().trim() == '' ){
      missingInput++;
    }
  });
  // console.log('missingInput', missingInput);
  if ( missingInput == 0 ){
    if ( $('#finalConcentration').val().trim() != ''){
      dilutionLoop();
    }
  }

}

function dilutionLoop() {
	var complete = 'false';

  // Clears table except for first row for new calculations
  $('#dilutionTable tbody tr:gt(0)').remove();
  $('#dilutionTable tbody tr:eq(0)').children('td').children('.destinationContainer').removeClass('destinationContainer');

  removeHiddenRows();

	while (complete == 'false') {
    // Gets the last row of the table
    var $lastRow = $('#dilutionTable tbody tr:last');

    // Skips over calculations if the initial concentration equals the final concentration
    if ( $('#initialConcentration').val() == $('#finalConcentration').val() ) {
      $lastRow.children('td').children('.finalConcentration').val( $('#initialConcentration').val() );
      $lastRow.children('td').children('.finalVolume').val( $('#initialVolume').val() );
      $lastRow.children('td').children('.dilutionContainer').addClass('destinationContainer');
      complete = 'true';
    }
    // If the current sample concentration is not equal to the concentration goal, do the math and the magic
    else if ( $('#finalConcentration').val() != $lastRow.children('td').children('.finalConcentration').val() ) {
      complete = dilutionRowCalculations($lastRow, 'serialDilution');
    }
    // ELSE get out of the loop
    else {
      complete = 'true';
    }

    if (complete == 'notPossible') {
      impossibleDilution();
    }
	}  // While concentrations don't match

  if ( $('#generateIntermediateSequences').val() == 'Yes' &&  complete != 'notPossible') {

    intermediateTubeGeneration( 
      function(){ 
        var finalBarcode = $('#dilutionTable tbody tr:last').find('.destinationContainer');
        $('#tubeId').val( $(finalBarcode).val() );
        $('#tubeId').attr("value", $(finalBarcode).val() );

        if(typeof diluentSumSet === 'function'){
          diluentSumSet();
        }
      } 
    );
    
  }
  if(typeof diluentSumSet === 'function'){
    diluentSumSet();
  }

}

/** function to remove rows of hidden table at the end
* for the submit to work.
* Uses table name dilutionTable
* for all rows greater than 0
**/
function removeHiddenRows () {

  $('input[name="dilutionTable_numRows"]').val(1);

  $('input[type="hidden"]').each(function(i){
    if( $(this).attr('name') ) {

      var nameParts = $(this).attr('name').split('_');

      var tableName = nameParts[0];
      var rowNumber = nameParts[1];

      if (tableName == 'dilutionTable' && rowNumber > 0) {
        $(this).remove();
      }
    }
  });

}


/** Using getAndPlaceNextSequence function to populate intermediate tubeIds
* @param callback - function passed into getAndPlaceNextSequence to run function on .done 
**/
function intermediateTubeGeneration( callback ) {
  
    $('.dilutionContainer').each( function() {
      getAndPlaceNextSequence('tubeId', $(this), 'sequenceValue', callback);
    });
  
}


/** Function for when dilution is not possible for various reason. Ex. Not enough sample volume to dilute into a larger target volume.
  * this function shows an alert, and internally makes a sad face for the user.
**/
function impossibleDilution() {
  createSimpleModal('modal', "This dilution is not possible with the current sample and target configurations.", "Calculation Error");
  // :C
}
