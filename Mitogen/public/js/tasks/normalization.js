$(document).ready(function() {

  hideTableIfEmpty('#normTable', 'No samples available for normalization.');

  prepAndPrintDiv('#printThis', '.barcodeBackground');

  if($('#normPrintSampleBarcode').val() == 'Yes') {
    printTableInputBarcodeByClass('#normTable', '.tubeScan');
  }


  if($('#sampleCommentHistory').val() == 'No') {
    $('#normTable .col14').hide();
    $('#normTable th:contains("Comment History")').hide();
  }

  if($('#sampleComments').val() == 'No') {
    $('.normComments').parent().hide();
    $('#normTable th:contains("Comments")').hide();
  }

  hideColumns('#normTable', 'hideColumn');

  if($('#requireTransfer').val() == 'Yes') {
    $('.tubeScan').attr('data-parsley-different-from-specimen-id', '');
    addParsleyScan();
  }

  $('.tubeScan').each(function() {
    $(this).attr('id', $(this).attr('name'));
  });


  $('.tubeScan').blur(function() {
    if($(this).val().trim().length > 0 ) {
      $(this).parent().siblings().children('.recalculate').attr('data-parsley-required', 'true');
      calculateRow($(this));
    }

  })

  $('.normLimits').change(function() {
    $('.recalculateActual').val('');
    $('.actualConcentration').val('');
    $('.normResult').val('');

    $('.initialVolume').each(function() {

      calculateRow($(this));

    });
  });

  $('.recalculate').change(function() {

    if (checkVolumeNumbers($(this))) {

      calculateRow($(this));

    }

  });

  $('.actualStockVolume').change(function() {

    if (checkVolumeNumbers($(this))) {

      var actualSampleVolume = parseFloat($(this).val());
      var actualDiluentVolume;
      var actualConcentration;
      var concentrationGoal = parseFloat( $('#finalConcentration').val() );
      var initialConcentration = parseFloat($(this).parent().siblings().children('.initialConcentration').val());

      actualDiluentVolume = ((initialConcentration*actualSampleVolume)/(concentrationGoal)) - actualSampleVolume;
      $(this).parent().siblings().children('.actualDiluentVolume').val(actualDiluentVolume.toFixed(2));
      $(this).parent().siblings().children('.actualConcentration').val(concentrationGoal);

    }
  });

  $('.actualDiluentVolume').change(function() {

    if (checkVolumeNumbers($(this))) {

      var actualDiluentVolume = parseFloat($(this).val());
      var actualSampleVolume = parseFloat($(this).parent().siblings().children('.actualStockVolume').val());
      var actualConcentration;
      var initialConcentration = parseFloat($(this).parent().siblings().children('.initialConcentration').val());

      actualConcentration = ((initialConcentration*actualSampleVolume)/(actualDiluentVolume + actualSampleVolume));
      $(this).parent().siblings().children('.actualConcentration').val(actualConcentration.toFixed(2));

    }
  });

});

function checkVolumeNumbers(thisInput) {
    if(!$.isNumeric(thisInput.val())) {

      alert('Your inputs must be numbers.');
      thisInput.val('');
      thisInput.focus();

      return false;

    } else if(parseFloat(thisInput.val()) < 0.01) {

      alert('This input has to have a value greater than or equal to 0.01');
      thisInput.val('');
      thisInput.focus();

      return false;

    } else if(parseFloat(thisInput.val()) < $('#minVolume').val()) {

      alert('Your minimum volume used must be higher then the minimum allowable pipette volume.');
      thisInput.val('');
      thisInput.focus();

      return false;

    } else if (thisInput.hasClass('recalculateActual') && parseFloat(thisInput.val()) + parseFloat(thisInput.parent().siblings().children('.recalculateActual').val()) > $('#maxVolume').val()) {

      alert('Your goal volume is larger than the maximum volume allowed. Please adjust your volumes accordingly.');
      thisInput.val('');
      thisInput.focus();

      return false;

    } else if (thisInput.hasClass('finalVolume') && thisInput.val() > $('#maxVolume').val()) {

      alert('Your goal volume is larger than the maximum volume allowed. Please adjust your volumes accordingly.');
      $(this).val('');
      $(this).focus();

      return false;

    } else {

      return true;

    }

}

function calculateRow(thisInput) {

  var row = thisInput.parent().parent('tr');

  var initialConcentration = row.children('td').children('.initialConcentration').val();
  var initialVolume = row.children('td').children('.initialVolume').val();

  var concentrationGoal =  $('#finalConcentration').val();
  var volumeGoal =   $('#finalVolume').val();

  if (initialConcentration.length != 0 &&
      initialVolume.length != 0 &&
      concentrationGoal.length != 0 &&
      volumeGoal.length != 0) {

      dilutionRowCalculations (row, 'normalization');

    }

}

function addParsleyScan() {
    window.Parsley.addValidator('differentFromSpecimenId', {
        validateString: function(value, requirement, elem) {
            return value != $(elem.element).parent().siblings().find('.sampleOnQueue').val();
        },
        messages: {
            en: 'Transfer is required.'
        }
    });
}
