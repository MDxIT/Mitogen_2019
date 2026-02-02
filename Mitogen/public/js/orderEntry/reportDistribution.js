$(document).ready( function() {

  var prefix = '#reportDistribution_';
  var formType = $('#formType').val();
  var instance = $('#instance').val();
  var workflow = $('#workflow').val();
  var section = 'reportDistribution';

  getAndProcessFormSettingsJson(formType, instance, workflow, prefix, section);

  $('#addNewRecipient').click( function() {
    inputTableAddRow('reportDistributionSelectionTable');
    $('#reportDistributionSelectionTable tbody tr:last').children('td').children().each(function() {
      $(this).val('');
    });
  });


  if ($('#reportDistribution_additionalRecipientCount').val() == 0){
    console.log('No additional recipients found');
    var tableId = 'reportDistributionSelectionTable';
    reportDistributionGenerateRow(tableId);
  }

  $('#reportDistribution_searchPhysicianButton').click( function() {
    reportDistributionSearchPhysicians();
  });

  $(document).on('click', '.reportDistribution_searchCheckbox', function() {
    var recipient = $(this).parent('td').siblings('.col1').children('a').text();
    if($('#reportDistributionSelectionTable tbody tr').length == 1 && $('.reportDistributionSelectionTable_recipient').val() == '') {
      $('.reportDistributionSelectionTable_recipient').val(recipient);
    } else {
      inputTableAddRow('reportDistributionSelectionTable');
      $('#reportDistributionSelectionTable tbody tr:last .reportDistributionSelectionTable_recipient').val(recipient);
      $('#reportDistributionSelectionTable tbody tr:last .reportDistributionSelectionTable_reportDistributionMethods').val('');
      $('#reportDistributionSelectionTable tbody tr:last .reportDistributionSelectionTable_specialHandling').val('');
      $('#reportDistributionSelectionTable tbody tr:last .reportDistributionSelectionTable_hiddenId').val('');
    }
    reportDistributionClearPhysicians();
  });

  hideColumns('#reportDistributionSelectionTable', 'hideColumn');

});


// Search function for physicians
function reportDistributionSearchPhysicians() {
  var getData = {
    "stepName": "Ajax Report Distribution Physician Search",
    "lastName": $('#reportDistribution_physicianLastNameSearch').val(),
    "firstName": $('#reportDistribution_physicianFirstNameSearch').val(),
    "type": $('#reportDistribution_physicianTypeSearch').val(),
    "organization": $('#reportDistribution_organizationSearch').val(),
    "site":$('#reportDistribution_siteSearch').val()
  }
  $('#reportDistribution_physicianCandidates').load('/uniflow', getData);
  $('#reportDistribution_physicianCandidates').css('display','block');
}

function reportDistributionClearPhysicians() {
  $('.reportDistribution_clearPhysician').val('');
  $('#reportDistribution_physicianCandidates').css('display','none');
}







