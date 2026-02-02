function searchSampleId() {
    var searchCriteria = { "stepName" : "Ajax Specimen Search Server",
                                    "firstName" : $("#patientFirstName").val(),
                                    "lastName" :  $("#patientLastName").val(),
                                    "MRN" : $("#patientMRN").val(),
                                    "DOB" : $("#patientDOB").val(),
                                    "gender": $("#patientType").val()
    };
     $('#sampleIdCandidates').load('/uniflow', searchCriteria,
        function(response, status, xhr){
            var tbody = $("#sampleSearchTable tbody tr");
            if ( status == "error" ) {
                    var msg = "Please contact your system administrator. There has been an error.  ";
                    $( "#sampleIdCandidates" ).empty().append( "<span>" + msg + xhr.status + " " + xhr.statusText + "</span>");
            }
            else if( tbody.length == 0)
            {
                $("#sampleIdCandidates").empty().append("<div><h4>NO SEARCH RESULTS FOUND</h4></div>");
            }
            else{
             $('th:contains("Hidden")').addClass('hide');
             $('td.col0').addClass('hide');
             $('.hide').hide();
              stdTableBasic('#sampleSearchTable', false);
           }
         });
}


$(document).ready(function() {
  if($('input[name="formNumber"]').val() === '1' ){
      $('.stepName').hide();
      $('#stepFormSubmitButton').hide();

  }

  $("#searchButton").on("click", function(){
    searchSampleId()
  });
  $('#clearButton').click(function() {
      $('.clearPatient').val('');
      $('#sampleId').val(-1);
      $("#sampleIdCandidates").empty();
  });
});