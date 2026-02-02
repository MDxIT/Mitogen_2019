$(document).ready(function() {
  $('#stepFormSubmitButton').val('Create New');
  if ($('#abbreviation').val() == '') {
    $('#testName').change(function() {
      $('#abbreviation').val($('#testName').val());
    });
  }
})