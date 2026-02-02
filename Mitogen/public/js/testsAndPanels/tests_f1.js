$(document).ready(function() {
  $('#tests_inPanels').hide();
  $('#stepFormSubmitButton').val('Create New');
  if ($('#tests_abbreviation').val() == '') {
    $('#tests_name').change(function() {
      $('#tests_abbreviation').val($('#tests_name').val());
    });
  }
  getNextSequence('#tests_makeSystemId', '#tests_sequenceName', '#tests_testCode', '#tests_name');
  getNextSequence('#panel_makeSystemId', '#panel_sequenceName', '#panel_code', '#panel_name');

  if($('#tests_isNew').val() != 'NEW') {
    $('#tests_makeSystemId').remove();
    $('#tests_testCode').attr('readonly', 'true');
    $('#tests_name').focus();
    $('#tests_name').select();
    $('#tests_inPanels').show();
    $('#stepFormSubmitButton').val('Update');

    $('#singleTestPanel').hide();
    $('#checkCreateSingleTestPanel').parent().siblings().hide();
    $('#checkCreateSingleTestPanel').hide();
  } else {
    $('#singleTestPanel').toggle(this.checked);

  }


  $('#checkCreateSingleTestPanel').click(function() {
    $('#singleTestPanel').toggle(this.checked);
  });
})

function getNextSequence(button, sequenceName, code, name) {
    $(button).click(function() {
        getAndPlaceNextSequence($(sequenceName).val(), $(code), 'sequenceValue');
        $(name).focus();
        $(name).select();
    });

}
