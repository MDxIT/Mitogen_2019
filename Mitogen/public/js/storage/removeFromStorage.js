

function getStorageInfo(storedContent)  {
  var getData = {
    "stepName": "Ajax Get Storage Item Details",
    "storageId": storedContent
  };
  $.getJSON('uniflow', getData)
    .done(function(data) {
      var isStorage = data[0].isStorage;
      var storageLocation = data[0].location;
      $('#removeItemList tr').last().children('td').children('.removeItem').val(storedContent);
      $('#removeItemList tr').last().children('td').children('.isStorage').val(isStorage);
      $('#removeItemList tr').last().children('td').children('.storageLocation').val(data[0].storageContainerId);
      if(storageLocation != 'storage') {
        $('#removeItemList tr').last().children('td').children('.storagePosition').val(data[0].location);
      }
      inputTableAddRow('removeItemList');
      $('#removeItemList tbody tr').last().hide();
    });
}

function removeRow(inputObject) {
  var inputName = inputObject.attr('name');
  var inputNameArray = inputName.split("_");
  var tableName = inputNameArray[0];
  var rowNumber = inputNameArray[1];
  var tableId = inputObject.parents('table').attr('id');
  var thisRow = inputObject.parents('tr');
  var thisColNameArray;
  var thisColNo;
  thisRow.nextAll().each(function() {
    console.log('i = ' +  rowNumber);
    $(this).children('td').each(function() {
      thisColNameArray = $(this).children().attr('name').split('_');
      thisColNo = thisColNameArray[2];
      console.log(thisColNo);
      console.log(tableName + '_' + rowNumber + '_' + thisColNo);
      $(this).children().attr('name', tableName + '_' + rowNumber + '_' + thisColNo);
    });
    rowNumber++;
  })
  inputObject.parent().css('background-color','teal');
}


$(document).ready(function() {
  hideColumns('#removeItemList', 'isStorage');
  $('#removeItemList tbody tr').last().hide();
  $('#removeItemList thead').hide();
  $('#storedContent').change(function() {

    $('#removeItemList thead').show();
    $('#removeItemList tbody tr').last().show();
    getStorageInfo($(this).val());
    $(this).val('');
    $(this).select();
    $(this).focus();

  });
  $('.deleteRow').click(function() {
    removeRow($(this));
  })
})