$(document).ready(function() {

  $('#tabs').tabs();

  hideColumns('#assayWordingTable', 'hideThis');
  hideTableIfEmpty('#assayWordingTable', 'No wording sections have been added.');

  $('.hide').hide();

  $('#assayWordingAddRow').click( function(){
    inputTableAddRow('assayWordingTable', true);
  });

  if( $('#fancyTextPanel1').length ){
    var microDescEditor = new nicEditor();
    microDescEditor.setPanel('fancyTextPanel1');
    microDescEditor.addInstance('refBox');
  }

  //SAVING TO TEXT AREA
  $('#refBox').on('blur', function(e) {
  	console.log(e);
  	$('#assayWordingContentSave').val( $('#refBox').html() );
    $('#assayWordingContentSave').val( $('#assayWordingContentSave').val().replace(/\x{2029}/g,'') );
	});

  $(document).keypress(function(event){
    if (event.which == '13' && $(':focus').attr('id') != 'refBox' ) {
      event.preventDefault();
    }
  });

  $('#assayWordingHeader').change(function() {
    let newHeader = $(this).val();
    $('.assayWordingHeader').each(function() {
      if ( newHeader == $(this).val() ){
        createSimpleModal('duplicateHeader', 'Section header must be unique.', 'Duplicate Section Header');
        $('#assayWordingHeader').val('');
      }
    });
  });

  $('#assayWordingOrder').change(function() {
    let newHeader = $(this).val();
    $('.assayWordingOrder').each(function() {
      if ( newHeader == $(this).val() ){
        createSimpleModal('duplicateOrder', 'Section order must be unique.', 'Duplicate Section Order');
        $('#assayWordingOrder').val('');
      }
    });
  });

  $('.assayWordingUpdate').click(function() {
    if ( $(this).prop('checked') ){
      $('.assayWordingUpdate').prop('checked', false);
      $(this).prop('checked', true);
      $('#assayWordingHeader').val( $(this).parent('td').siblings().children('.assayWordingHeader').val() );
      console.log($(this).parent('td').siblings().children('.assayWordingOrder').val());
      $('#assayWordingOrder').val( $(this).parent('td').siblings().children('.assayWordingOrder').val() );
      $('#assayWordingContentSave').val( $(this).parent('td').siblings().children('.assayWordingContent').val() );
      $('#refBox').html( $(this).parent('td').siblings().children('.assayWordingContent').val() );
    } else {
      $('#assayWordingHeader').val('');
      $('#assayWordingOrder').val('');
      $('#assayWordingContentSave').val('');
      $('#refBox').html('');
    }
  });
});