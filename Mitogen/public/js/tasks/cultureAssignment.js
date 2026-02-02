
$(document).ready(function() {

  let comments = $('#commentFields').val();
  let commentHistory = $('#commentHistory').val();
  let cultureTypeColumn = $('#cultureType').val();

  if(comments != 'Comments'){
    hideColumns('#cultureAssignment', 'commentDisplay');
  }
  if(commentHistory != 'Comment History'){
    hideColumns('#cultureAssignment', 'commentHistoryDisplay');
  }
  if(cultureTypeColumn != 'Culture Type'){
    hideColumns('#cultureAssignment', 'cultureType');
  }
  $('th:contains("Hidden")').addClass('hide');
  $('.hideColumn').parent().addClass('hide');
  $('.hide').hide();

  hideTableIfEmpty('#cultureAssignment', 'No specimens available for Culture Assignment.');
  hideColumns('#cultureAssignment', 'hideColumn');

  $('#selectAll').click(function() {
        if($(this).prop('checked') == true) {
          $('.cultureCheckbox').prop('checked', true).each(function() {
            checkboxesValidate($(this));
            $(this).prop('checked', true).change();
          });
        } else {
          $('.cultureCheckbox').prop('checked', false).each(function() {
            $(this).prop('checked', false).change();
            checkboxesValidate($(this));
          });
        }
    });

  $('.cultureCheckbox').on('click', function(){
    checkboxesValidate($(this));
  });

  $('#cultureAssignment tbody tr').each( function() {
    let detailsColumn = generateColumn($(this))
    $(this).find('.details').append(detailsColumn)

  })

})

function checkboxesValidate(cbox) {
  if($(cbox).is(':checked')){
      $(cbox).val('true');
      $(cbox).prop('checked', true);
      $(cbox).parent().siblings().children('.incubationTime').addClass('required');
      $(cbox).parent().siblings().find('.incubationTime').attr('data-parsley-required','true');
    } else{
      $(cbox).val('false');
      $(cbox).prop('checked', false);
      $(cbox).parent().siblings().children('.incubationTime').removeClass('required');
      $(cbox).parent().siblings().find('.incubationTime').attr('data-parsley-required','false');
    }

}

function generateColumn(data) {
    let returnValue;
    let detailsString = '';
    let momentDateFormat = moment().toMomentFormatString( $('#dateFormat').val() );
    let orderPriority = $(data).find('.orderPriority').html();
    let specimenReceiveDate = $(data).find('.receivedDate').html();
    let patientName = $(data).find('.patientName').html();
    let facility = $(data).find('.mrnFacility').html();
    let specimenType = $(data).find('.specimenType').html();
    let dob = $(data).find('.dob').html();
    let testAndMethod = $(data).find('.testAndMethod').html();
    let queuedBy = $(data).find('.queuedBy').html();
    let customerName = $(data).find('.storageLocation').html();
    let storageLocation = $(data).find('.clientName').html();

    $('.additionalColumns').each( function() {
      // console.log($(this).val())

      if ( $(this).val() === 'Order Priority' ){
        detailsString += 'Priority: ' + orderPriority + ' </br> ';
      }
      else if ( $(this).val() === 'Specimen Received Date' && specimenReceiveDate !== '' ){
        detailsString += 'Specimen Received: ' + moment(specimenReceiveDate).format(momentDateFormat) + ' </br> ';
      }
      else if ( $(this).val() === 'Patient Name' ){
        detailsString += 'Patient Name: ' + patientName + ' </br> ';
      }
      else if ( $(this).val() === 'FacilityID-MRN' ){
        detailsString += facility + ' </br> ';
      }
      else if ( $(this).val() === 'Specimen Type' ){
        detailsString += 'Specimen Type: ' + specimenType + ' </br> ';
      }
      else if ( $(this).val() === 'DOB' && dob !== '' ){
        detailsString += 'DOB: ' + moment(dob).format(momentDateFormat) + ' </br> ';
      }
      else if ( $(this).val() === 'Tests' ){
        detailsString += 'Tests And Methods: ' + testAndMethod + ' </br> ';
      }
      else if ( $(this).val() === 'Queued By' ){
        detailsString += 'Queued By: ' + queuedBy + ' </br> ';
      }
      else if ( $(this).val() === 'Storage Location' ){
        detailsString += 'Storage Location: ' + storageLocation + ' </br> ';
      }
      else if ( $(this).val() === 'Customer Name' ){
        detailsString += 'Customer Name: ' + customerName + ' </br> ';
      }
    });

    console.log('detailsString',detailsString)
    return detailsString

  }