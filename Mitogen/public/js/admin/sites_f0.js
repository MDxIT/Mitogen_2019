function searchSites(displayAll) {
  if(!displayAll) displayAll = 'false';
  $('#siteCandidates').hide();
  $('#siteCandidates').load('/uniflow',{
      stepName: 'Ajax Admin Site Search Server',
      siteName: $('#siteName').val(),
      organizationName: $('#organizationName').val(),
      lastName: $('#lastName').val(),
      firstName: $('#firstName').val(),
      phoneNumber: $('#phoneNumber').val(),
      email: $('#email').val(),
      displayAll: displayAll
    }, function() {
          stdTableSort("#siteCandidates table");
          $('#siteCandidates').show();
        }
  )
}

$(document).ready(function() {
  $('#stepFormSubmitButton').val('Create New');
  $('.searchSite').change(function() {
    searchSites();
  });
  $('#showAllSites').click(function() {
    searchSites('true');
  })
});