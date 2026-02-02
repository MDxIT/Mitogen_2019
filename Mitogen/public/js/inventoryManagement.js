$(document).ready(function() {

  if($('h2.stepName').text() === 'List Inventory Items'){
    $('#stepFormSubmitButton').hide();
  };
// Manage Vendors //
  // Hide Columns //
  hideColumns('#vendorTable', 'hiddenColumn');

// Create Inventory Item //
  $('#item').change(function() {
    $('#itemDisplay').val($(this).val())
  })

// Edit Inventory Items //
  $('#edit').tabs();

// List Inventory Items //
  $('#list').tabs();

// Edit Inventory Items Hidden Step //
  $("#removeMe").change(function() {
    if(this.checked) {
      $('#warning').dialog();
    }
  });
});

$(function() {
  $('#accordion').accordion({
    collapsible: true,
    heightStyle: 'content'
  });
});


