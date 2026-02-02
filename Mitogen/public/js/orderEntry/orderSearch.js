$(document).ready(function() {
  $('#searchHeader').hide();
  $('#moveSubmitHere').append($('#stepFormSubmitButton'));
  $('#stepFormSubmitButton').val('Load Order')
  $('#searchOrders').click(function() {
    $('#orderSearchResults').children().remove();
    $('#searchHeader').show();
    var selectColumns = $('#selectColumns').val();
    var dob = moment($('#dob').val()) ;
    dob = moment(dob).format('YYYY-MM-DD');
    $('#orderSearchResults').load('/uniflow',
      {
        stepName: "Ajax Order Search",
        selectColumns: selectColumns,
        lastName:$('#lastName').val(),
        firstName:$('#firstName').val(),
        dob:dob,
        mrn:$('#mrn').val(),
        geneticGender:$('#geneticGender').val(),
        externalRequestId:$('#externalRequestId').val(),
        specimenId:$('#specimenId').val(),
        patientId:$('#patientId').val(),
        govtId:$('#govtId').val(),
        instance:$('#instance').val()
      }, function() {
        convertOutputTableDateFormats('#orderSearchResults', $('#dateFormat').val());
      }
    );
  });

  $('#clearSearch').click(function() {
    $('.clearSearch').val('');
    $('#orderSearchResults').children().remove();
    $('#searchHeader').hide();
  });

});