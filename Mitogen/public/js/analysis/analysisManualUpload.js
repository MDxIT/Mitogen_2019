$(document).ready( function() {

  convertOutputTableDateFormats('#processBatch', $('#dateFormat').val());
// Makes checkboxes act like radio buttons
  $('.uploadBatchCheck').click( function() {
    var $this = $(this);

    $('.uploadBatchCheck').each( function() {
      $(this).prop('checked', false);
    });

    $this.prop('checked', true);
  });

});