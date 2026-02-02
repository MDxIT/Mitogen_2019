function manageBox(boxId) {

  var getData = {
    "stepName": "Ajax Get Storage Item Details",
    "storageId": boxId
  };
  $.getJSON('uniflow', getData)
    .done(function(data) {
      $('#boxType').val(data[0].layoutType);
      $('#noRows').val(data[0].rows);
      $('#noCols').val(data[0].cols);
      $('#newBox').val(data[0].status);
      if(boxId != '') {
        if(data[0].status == 'true') {
          $('#createNewBox').show();
          $('#boxInfoDiv').hide();
        } else {
          $('#createNewBox').hide();
          $('#newBox').val('false');
          $('#boxInfoDiv').show();
          $('#dimensions').val( data[0].rows + 'x' + data[0].rows);
          $('#boxName').val(data[0].name);
          $('#boxDesc').val(data[0].description);
          console.log (data[0].storageContainerId);
          if(data[0].storageContainerId.length > 0) {
            $('#currentStorageLocation').val(data[0].storageContainerId);
            $('#currentStorageLocation').parent('td').parent('tr').show();
          }
        }
        if(keypress == '13') {
          $('form').submit();
        }
      } else {
        $('#createNewBox').hide();
        $('#boxInfoDiv').hide();
      }
    });
}

var keypress;
$(document).ready(function() {
  $('#createNewBox').hide();
  $('#boxInfoDiv').hide();
  $('.hide').hide();
  if ($('#boxId').val()) {
    manageBox($('#boxId').val());
  } else {
    lockNonEmptyInputs('storeInBox_position');
  }
  $('#boxId').change(function(event) {
    manageBox($(this).val());
  });
  if($('#currentStorageLocation').val().length > 0) {
    $('#storeHere').parent('td').parent('tr').hide();
    $('#currentStorageLocation').parent('td').parent('tr').show();
  } else {
    $('#storeHere').parent('td').parent('tr').show();
    $('#currentStorageLocation').parent('td').parent('tr').hide();

  }
  $(document).keypress(function(event) {
    keypress = event.which;
    if(keypress  == '13') {
      $('#boxId').unbind('change');
      manageBox($('#boxId').val());
      $('#stepFormSubmitButton').select();
      event.preventDefault();
    }
  })
});