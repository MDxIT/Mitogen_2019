$(document).ready(function() {
  var printContainerId = '';
  $('#printDocument').hide();
  $('.printContainerBarcode').each(function() {
    printContainerId = $(this).attr('id');

    printBarcode(printContainerId);
  })
});