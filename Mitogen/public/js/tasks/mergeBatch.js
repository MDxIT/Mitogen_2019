
$(document).ready(function() {
  
  $('#destinationBatchId').empty(); //This empties the destination batch list which otherwise is populated by container component as select
  populateBatchList(); // This runs on load in case of validation error and because .empty() runs on load

   $('.selectBatch').click(function(){
      populateBatchList();
      countSamples();
  });

  if ( $('#sampleCounter').val() == 'Off') {
    $('#sampleCounterDiv').hide();
  } else {
    $('#sampleCounterDiv').show();
  }

  displayMinMax();

 }); //End of Document Ready!!

/** Populates the destination batch container with list of batch Ids.
* Empties the current destination batch list
* Appends an empty option
* Populates list with selected batches from batch table.
**/
function populateBatchList() {
  var checkboxChecked;
  var batchId;

  $('#destinationBatchId').empty();
  $('#destinationBatchId').append( '<option value=""></option>' );

  $('.selectBatch').each( function() {
    checkboxChecked = $(this).is(':checked');
    batchId = $(this).parent('td').siblings().children('.batchId').val();
      
    if( checkboxChecked ) {
      $('#destinationBatchId').append( '<option value="'+batchId+'">'+batchId+'</option>' );
    }

  });
}

/**
*
**/
function countSamples() {
  var maxAllowed = $('#sampleMax').val();
  var minAllowed = $('#sampleMin').val();
  var batchCount;
  var total = 0;

  $('.count').each(function() {
    if ( $(this).parent().siblings().children('.selectBatch').is(':checked') ) {
      batchCount = $(this).val();
      total = parseInt(total) + parseInt(batchCount);
    }

    $('#sampleListCounter').val(total);

    if (total > maxAllowed){
      alert('Sample count is more than maximum number of samples.');
      $(this).parent().siblings().children('.selectBatch').prop('checked',false);
      $(this).parent().siblings().children('.selectBatch').attr('checked',false);
      countSamples();
    }
  });
  
  if (total < minAllowed) {
    alert('Sample count is less than minimum number of samples.');
  }
  $('#sampleListCounter').trigger("change");
}

/*
  Hides min/max if build sheet defines them as Not Applicable
*/
function displayMinMax(){

    var maxAllowed = $('#sampleMax').val();
    var minAllowed = $('#sampleMin').val();

    if(maxAllowed == 5000) {
        $('#sampleMax').parent().hide();
        $('#sampleMax').parent().prev('.label').hide();
    }
    if(minAllowed == 0) {
        $('#sampleMin').hide();
        $('#sampleMin').parent().prev('.label').hide();
    }

}



