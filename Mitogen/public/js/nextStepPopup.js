
/**
 * generates the next step selection list so it displays correctly onscreen.
 *
 * @function generateNextStepSection
 * @param {event object} e - event object triggering call
 * @returns {string} the html to display in the td for the table
 */
function generateNextStepSection(returnValue){
    var multNextSteps = '';
    if(returnValue.indexOf('|') != -1){
      multNextSteps += '<span class="nextStepSpan required">' + returnValue.split('|').join('<br>') + '</span>'
    } else {
      multNextSteps += '<span class="nextStepSpan required">' + returnValue + '</span>'
    }

    return multNextSteps + '<div class="nextStep"><i class="fa fa-edit fa-fw" aria-hidden="true" ></i></span></div>';
}



/**
 * Builds the html for the next step add and edit modal.
 *
 * @function addEditNextStepDialogFromModalHTML
 * @returns {string} the html to display inside the modal window
 */
function addEditNextStepDialogFromModalHTML(){
  let modalHTML = '';
  modalHTML +=   '<div id="addEditNextStepModalSection">';

  modalHTML +=   '<div class="nextstepProtocolSection">'

  console.log($('#protocolSelected').html())
  modalHTML +=     '<label class="onOwnLine" for="nexStepProtocolSelection">Select Next Step Protocol:</label>'
  modalHTML +=     '<select class="onOwnLine" id="nexStepProtocolSelection" value="" tabindex="1">'
  modalHTML +=      $('#protocolSelected').html();
  modalHTML +=     '</select>'


  // modalHTML +=     '<br/>'
  modalHTML +=     '<label class="onOwnLine" for="nextStepSelect">Select Next Steps:</label>'
  modalHTML +=     '<select multiple class="onOwnLine" id="nextStepSelect" value="" tabindex="1"></select>'

  modalHTML +=   '</div>'
  modalHTML +=     '<div class="addEditNextStepButtonsSections">';
  modalHTML +=       '<button class="addEditNextStepDialogCancel confirmButtons" id="addEditNextStepDialogCancel" type="button" title="Cancel">Cancel</button>';
  modalHTML +=       '<button class="addEditNextStepDialogAccept confirmButtons" id="addEditNextStepDialogAccept" type="button" title="Add">Add</button>';
  modalHTML +=     '</div>';
  modalHTML +=   '</div>';
  return modalHTML;
}


/**
 * Populates the modal div and triggers the modal for display. Allows for protocol selection and narrowing down of next step options available in the multiselect field. Polpulates the selected next step items on modal closure.
 *
 * @function addEditNextStepOnClick
 * @param {event object} eventObj - event object triggering call
 */
function addEditNextStepOnClick(eventObj, filterPopulation = false){
    var currentTD = $(eventObj).parent();
    var currentNList = $(eventObj).parent().find('.nextStepSpan').html();

    var dialog = initEmptyModal('modal','Select Next Steps',450, 400, closeCurrentModal('modal'))

    $('#modal').html('');
    $('#modal').append(addEditNextStepDialogFromModalHTML())

    $('#nexStepProtocolSelection').val("")

    $('#nexStepProtocolSelection').on('change', function(e) {
      var request = {
        stepName: 'AjaxGetStepsByProtocol',
        protocolName: $(this).val()
      };
      $.getJSON('uniflow?', request).done(function (data) {
        var optionsArr = $.map(data ,function(option) {
          return '<option value="'+ option.displayName +'">' + option.displayName + '</option>';
        });
        $('#nextStepSelect').empty();
        $('#nextStepSelect').append('<option value=""></option>');
        $('#nextStepSelect').append(optionsArr.join(','));

        if(currentNList){
          $.each(currentNList.split("<br>"), function(i,e){
              $("#nextStepSelect option[value='" + e + "']").prop("selected", true);
          });
        }
      });
    });



    $('#addEditNextStepDialogCancel').on('click', function(e) {
      e.preventDefault();
      closeCurrentModal('modal')
    })

    $('#addEditNextStepDialogAccept').on('click', function(e) {
      e.preventDefault();
      console.log($('#nextStepSelect').val());
      if(filterPopulation){
        $(currentTD).find('table tbody tr').each(function(){
          console.log('row', $(this).find('[type="checkbox"]').is(':checked'))
          if($(this).find('[type="checkbox"]').is(':checked')){
            $(this).find('.nextStepSpan').html(($('#nextStepSelect').val()).join('<br/>'))
          }
        })
      } else {
        $(currentTD).find('.nextStepSpan').html(($('#nextStepSelect').val()).join('<br/>'))
      }
      closeCurrentModal('modal')


    })

    dialog.dialog('open');

}