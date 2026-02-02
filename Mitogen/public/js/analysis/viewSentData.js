$(document).ready(function() {
  $('#stepFormSubmitButton').remove();

  $('#returnToList').click(function() {
    window.open('/uniflow?stepName=' + $('#thisStep').val(), '_self');
  });


  prepAndPrintDiv('#printThis', 'printAll', 'printScreen');

  $('#sendToDI').click(function() {
    var groupContainerId = $('#groupContainerId').val();
    var loadStep = $('#thisStep').val();
    sendToDI(groupContainerId, loadStep);
  });

});