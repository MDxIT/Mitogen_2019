$(function() {
	console.log($('input[name="formNumber"]').val())
	if($('input[name="formNumber"]').val() === '0' ){
		$('#stepFormSubmitButton').val('Create New');
	}
	if($('#abbreviation').val() == '') {
    $('#drugName').change(function() {
      $('#abbreviation').val($('#drugName').val());
    });
  }
})