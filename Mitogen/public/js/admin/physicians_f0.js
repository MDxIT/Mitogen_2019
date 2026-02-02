function searchPhysicians(displayAll) {
  if(!displayAll) displayAll = 'false';
  $('#physicianCandidates').hide();
  $('#physicianCandidates').load('/uniflow',{
      stepName: 'Ajax Admin Person Search Server',
      physicianLastName: $('#physicianLastName').val(),
      physicianFirstName: $('#physicianFirstName').val(),
      customer: $('#customerSearch').val(),
      phoneNumber: $('#phoneNumber').val(),
      email: $('#email').val(),
      displayAll: displayAll
    }, function() {
          stdTableSort("#physicianCandidates table");
          $('#physicianCandidates').show();
        }
  )
}

$(document).ready(function() {
  $('#stepFormSubmitButton').val('Create New');
  $('.physicanSearch').change(function() {
    searchPhysicians();
  });
  $('#showAllPhysicians').click(function() {
    searchPhysicians('true');
  })
});