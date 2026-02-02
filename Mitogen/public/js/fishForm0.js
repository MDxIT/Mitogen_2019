$(document).ready(function() {
	convertOutputTableDateFormats('.formatDateTable', $('#dateFormat').val());
   	stdTableBasic('.formatDateTable',true);
   	$('#stepFormSubmitButton').hide();
});