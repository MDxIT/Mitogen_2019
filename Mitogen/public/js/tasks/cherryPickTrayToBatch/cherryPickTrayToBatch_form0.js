$(document).ready(function() {

	checkDestType();
	

	$('#destinationType').change(function(){
		checkDestType();
	});

  $('#groupingContainerId').attr('data-parsley-required','true') 

  $(document).on('click', '.containerLink', function(e) {
    e.preventDefault();
    $('#groupingContainerId').val($(this).html())                            
    $('[name="stepForm"]').submit();
  });

  $('#stepFormSubmitButton').on('click', function(e){
    e.preventDefault();
    var noValidationErrors = true;
    var form = $('[name="stepForm"]')

    if (noValidationErrors === true) {
    	form.submit();
    } else {
      
    }       
  });


});

function checkDestType(){

	if($('#destinationType').val() == 'Existing'){
		$('#existingBatch').show();
		$('.existingBatchId').attr('data-parsley-required','true');

	} else {
		$('#existingBatch').hide();
    $('.existingBatchId').attr('data-parsley-required','false');
	}

}