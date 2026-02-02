  function referenceCheck() {
      let assayReference = $("#assayReferencesSave").val();
      let codeName = $("#codeName").val();
      let assayReferenceId = $("#assayReferenceId").val();
          let callObject = {
                  "stepName": 'ajaxCheckCurrentAssayReferences',
                  "assayReference": assayReference,
                  "codeName": codeName,
                  "assayReferenceId": assayReferenceId
                  };
          $.getJSON('uniflow?', callObject).done(function (data) {
              if(data[0].reference != 'newReference'){
                createSimpleModal('duplicateError', 'This reference already exists', '');
                $('#assayReferencesSave').val('');
                $('#referenceBox').empty();
                event.preventDefault();
              }
          });
  };

$(function() {
  hideColumns('#assayReferencesTable', 'hideColumn');
  hideTableIfEmpty('#assayReferencesTable', 'No references have been added.');

  $('.hide').hide();

  if( $('#fancyTextPanelAR').length ){
    var microDescEditor = new nicEditor();
    microDescEditor.setPanel('fancyTextPanelAR');
    microDescEditor.addInstance('referenceBox');
  }

  //SAVING TO TEXT AREA
  $('#referenceBox').on('blur', function(e) {
  	$('#assayReferencesSave').val( $('#referenceBox').html() );
    referenceCheck();
    $('#assayReferencesSave').val( $('#assayReferencesSave').val().replace(/\x{2029}/g,'') );

	});

  $(document).keypress(function(event){
    if (event.which == '13' && $(':focus').attr('id') != 'referenceBox' ) {
      event.preventDefault();
    }
  });

  // on change of report type check uniqueness and disable all other tabs until saved


  // user can only update 1 record per submit
  $('.referenceUpdate').click(function() {
    if ( $(this).is(':checked') ){
      if($('.referenceUpdate:checked').length > 1){
        createSimpleModal('referenceUpdateErrorModal', 'You can only update one record at a time.', '');
        $(this).prop('checked', false);
      } else {
        $(this).val('true');
        $(this).prop('checked', true);
        $(this).parent('td').siblings().children('.referenceDelete').prop('checked', false)
        $('#assayReferencesSave').val( $(this).parent('td').siblings().children('.assayReferences').val() );
        $('#referenceBox').html( $(this).parent('td').siblings().children('.assayReferences').val() );
        $('#assayReferenceId').val( $(this).parent('td').siblings().children('.assayReferenceId').val() );
      }
    } else {
      $('#assayReferencesSave').val('');
      $('#referenceBox').html('');
      $(this).val('false');

    }
  });

  // either the update checkbox or delete checkbox can be checked per row
  $('.referenceDelete').click(function() {
    if ( $(this).is(':checked') ){
        $(this).val('true');
        $(this).prop('checked', true);
        $(this).parent('td').siblings().children('.referenceUpdate').prop('checked', false)
        $('#assayReferencesSave').val('');
        $('#referenceBox').html('');
    }
  });



});