
// function to deduct the calculated sample volume from the Source Sample Volume

function sampleVolumeDeduction() {
  var initialVolume = parseFloat( $('#initialVolume').val());
  var recalculation = $('#recalculateSourceSampleVolume').val();
  $('#seriesDilutionTable tbody tr').each(function(){
    var deductionAmount = parseFloat($(this).find('.sampleVolume').val());
    $('#deductionValue').val(deductionAmount)
    if(recalculation === 'Yes'){
      var recalculateSourceSampleVolume = (initialVolume + deductionAmount) - deductionAmount
      var updateSourceVolume = recalculateSourceSampleVolume
    } else {
      var updateSourceVolume = initialVolume - deductionAmount
      }
      $('#initialVolume').val(updateSourceVolume);
      $('#recalculateSourceSampleVolume').val('Yes');
      if(initialVolume <= 0 || isNaN(deductionAmount)){
        $('#initialVolume').val(initialVolume);
      }
      return;
  })
};

// function to generate barcodes
function seriesDilutionTubeGeneration() {
  if($('#generateIntermediateSequences').val() == 'Yes') {
    $('.dilutionContainer').each( function() {
      if($(this).val() == '') {
        if(typeof diluentSumSet === 'function'){
          getAndPlaceNextSequence('tubeId', $(this), 'sequenceValue', diluentSumSet);
        } else{
          getAndPlaceNextSequence('tubeId', $(this), 'sequenceValue');
        }
        
      }
    })
  } else {
    if(typeof diluentSumSet === 'function'){
      diluentSumSet();
    }
  }
}

// function to delete rows from table
function deleterow() {
    var table = document.getElementById("seriesDilutionTable");
    var rowCount = table.rows.length -1;
    var newRowCount = rowCount -1
    if(rowCount === 1){
      alert('The first row of table cannot be deleted.')
    }else{
      $('#configuredRows').val(newRowCount);
      $('#seriesDilutionTable tbody tr:last').remove();
      $('input[name="seriesDilutionTable_numRows"]').val(newRowCount);
      $('input[name="seriesDilutionTable_'+ newRowCount +'"]').remove(); // using newRowCount because hidden table values are zero based.
      $('#seriesDilutionTable tbody tr:last').find('.dilutionFactorSelect').attr("disabled", false);
    }
    var correctVolumeTotal = parseFloat($('#orginalSampleVolume').val());
    console.log(correctVolumeTotal,'correctVolumeTotal')
    $('#seriesDilutionTable tbody tr').each(function(){
      var sampleVolumes = $(this).find('.sampleVolume').val()
      if(sampleVolumes === ''){
        sampleVolumes = 0
      }
      correctVolumeTotal = correctVolumeTotal - parseFloat(sampleVolumes)
      $('#initialVolume').val(correctVolumeTotal);
    })

}





$(document).ready( function() {
  $('.dilutionContainer').each( function() {
    $(this).attr('id', $(this).attr('name'));
  });


  hideColumns('#reagentResources', 'sampleAmount');


  // Add support for printing the barcode
  // printInputBarcodeIdx('#seriesDilutionTable', 5, '', '');

  var listVariables = ['.dilutionContainer']
  printTableInputBarcodeByClass('#seriesDilutionTable', '.printBarcode', listVariables);
  $('#printDocument').hide()


  // if specimen has a sample volume in the db, turn the value to readonly and remove required class
  if($('#sampleVolumeKnown').val() == 'YES') {
    $('#initialVolume').attr("readonly", true);
    $('#initialVolume').removeClass('required');
	}

  // if the user configures the step to generate barcodes, then turn field into readonly
  if($('#generateIntermediateSequences').val() == 'Yes') {
    $('.dilutionContainer').attr("readonly", true);
  } else {
    if(typeof diluentSumSet === 'function'){
      $(document).on('change','.dilutionContainer', diluentSumSet);
    } 
  }



  // Checks the values entered by the user to make sure they are valid numbers
  $(document).on('change','.initialInput',
                  function() {
                    var numberCheck = parseInt($(this).val());
                    if(numberCheck < 0 || isNaN(numberCheck)) {
                      alert('The value entered is not a valid number. Please re-enter.');
                      $(this).val('')
                    }
                });

  // if user manually sets initialVolume, then the orginal volume must also be set to the same value for calculation purposes.
  $(document).on('change','#initialVolume',
                  function() {
                    var initialVolume = parseFloat( $('#initialVolume').val());
                    var setOrginalSampleVolume = $('#orginalSampleVolume').val();
                    if(setOrginalSampleVolume == '' && initialVolume != '') {
                      $('#orginalSampleVolume').val(initialVolume)
                    }
                });

  // calculate the sample volume, dilutent volume, final concentration for each row
	$(document).on('change','.dilutionFactorSelect',
                  function() {
                    var DF = parseFloat($(this).val());
                    var initialVolume = parseFloat( $('#initialVolume').val());
                    var calculationObject = seriesdilutionRowCalculations(DF);
                    if($('#initialConcentration').val() != '' && $('#minVolume').val() != '' && $('#initialVolume').val() != '' && $('#maxVolume').val() != ''){

                      $('.initialInput').attr("readonly", true);
                      $('.initialInput').removeClass('required');
                      $(this).parent().parent().find('.sampleVolume').val(calculationObject['sampleVolume']);
                      $(this).parent().parent().find('.diluentVolume').val(calculationObject['diluentVolume']);
                      $(this).parent().parent().find('.finalConcentration').val(calculationObject['finalConcentration']);
                      $(this).parent().parent().find('.initialConcentration').val(calculationObject['initialConcentration']);
                      sampleVolumeDeduction();
                      seriesDilutionTubeGeneration('seriesDilutionTable', true);

                    } else {
                      $('#seriesDilutionTable tbody tr:last').find('.dilutionFactorSelect').val('');
                      alert('Source Sample Concentration, Source Sample Volume, Minimum Pipette Volume and Max Container Volume must be entered before starting the series dilutions.');}

                  });

  // user can only add one row at a time
  $(document).on('click','#addNewSerialDilutionRow',
                  function() {
                    var DF = $('#seriesDilutionTable tbody tr:last').find('.dilutionFactorSelect').val();
                    var table = document.getElementById("seriesDilutionTable");
                    var rowCount = table.rows.length;
                    if(DF != '' ){
                      $('#configuredRows').val(rowCount);
                      $('#recalculateSourceSampleVolume').val('No');
                      inputTableAddRow('seriesDilutionTable', true);
                      $('#seriesDilutionTable tbody tr').prev().find('.dilutionFactorSelect').attr("disabled", true);
                      $('#seriesDilutionTable tbody tr').last().find('.printBarcodeBtn').removeAttr('name').val('Print');
                    }else{
                      alert('A dilution factor must be selected before adding additional rows.');
                    }
                  })

  // user can delete the last row
  $(document).on('click','#removeLastSerialDilutionRow',
                  function() {
                    deleterow();
                  })

  // reloads the page when clicked
  $('#resetButton').click( function() {
    location.reload();
  });


$('#stepFormSubmitButton').on('click', function(e){
    e.preventDefault();
    let allowSubmit = true;
    var form = $('[name="stepForm"]');
    var dilutionArray = $('.dilutionContainer').map(function(){
      return $(this).val();
    }).get();

    var dilutionArrayLength = dilutionArray.length
    var filteredArray = dilutionArray.filter(function(item, pos){
      return dilutionArray.indexOf(item)== pos;
    });
    var filteredArrayLength = filteredArray.length
    var allowApproval = false;

    if(filteredArrayLength === dilutionArrayLength){
      allowApproval = true
    }
    // checking for duplicate containers
    if(form.parsley().isValid()){
        var postItemArray = []
        for (var i = 0; i < dilutionArray.length; i++) {
          postItemArray.push(dilutionArray[i])
        }
        var postItemString = postItemArray.join()
        var postData = {
            "thisContainer": postItemString,
            "stepName": "Ajax Series Dilution Error Check",
            "Submit": true,
            "formNumber": 0
          };
          var postItem = $.post('/uniflow', postData).done(function(data) {
              var postHtml = $.parseHTML(data);
              var postError = checkPostError(postHtml);
              if (postError !== false) {
                $('#errorMessageArea').html('<span class="error" id="errorId"><br><span>'+postError+'<br></span></span>')
                console.log('postError', postError.trim())
              }
              else {
                console.log("success");
                $('[name="stepForm"]').submit();
              }
          }).fail(function(jqxhr, textStatus, error) {
              var err = "Request Failed: " + textStatus + ", " + error;
              console.log(err);
              alert(err);
          });
      } else if(allowApproval == false){
        var postError = 'Duplicate new Containers. Remove duplicates and try again.'
        $('#errorMessageArea').html('<span class="error" id="errorId"><br><span>'+postError+'<br></span></span>')
      }
  });

});


