function getStorageLocation(storageContainer)  {
  var getData = {
    "stepName": "Ajax Get Storage Item Details",
    "storageId": storageContainer
  };
  $.getJSON('uniflow', getData)
    .done(function(data) {
      if(data[0].storageContainerId != 'Not in storage') {
        $('#currentLocationDiv').show();
        $('#currentStorageLocation').val(data[0].storageContainerId);
        $('#currentStoragePosition').val(data[0].location);
      } else {
        $('#currentLocationDiv').hide();
        $('#currentStorageLocation').val('');
        $('#currentStoragePosition').val('');
      }
    });
}

$(document).ready(function() {
  $('#currentLocationDiv').hide();
   getStorageLocation($('#storageContainer').val());
  $('#storageContainer').change(function() {
    getStorageLocation($(this).val());
  });
})