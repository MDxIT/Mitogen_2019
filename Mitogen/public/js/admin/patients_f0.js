
$(function() {
   $("th:contains('Hidden')").addClass("hide");
   $(".hide").hide();
   $("#searchButton").on("click", function(){ searchPatients() });
   $("#clearButton").on("click", function() {
        $(".searchInput").val("");
        $(".searchSelect").val("");
        $("#patientsCandidates").empty();
    });
 });

 function searchPatients() {
      var ajaxParams = { "stepName" : "Ajax Admin Patients Search Server",
                                     "firstName" : $("#patientFirstName").val(),
                                     "lastName" :  $("#patientLastName").val(),
                                     "MRN" : $("#patientMRN").val(),
                                     "DOB" : $("#patientDOB").val(),
                                     "gender": $("#patientType").val()
                                   };
       console.log(ajaxParams);
       $('#patientsCandidates').load('/uniflow', ajaxParams,
          function(response, status, xhr){
              var tbody = $("#patientSearchTable tbody tr");
              if ( status == "error" ) {
                      var msg = "Please contact your system administrator. There has been an error.  ";
                      $( "#patientsCandidates" ).empty().append( "<span>" + msg + xhr.status + " " + xhr.statusText + "</span>");
              }
              else if( tbody.length == 0)
              {
                  $("#patientsCandidates").empty().append("<div><h4>NO SEARCH RESULTS FOUND</h4></div>");
              }
              else{
               $('th:contains("Hidden")').addClass('hide');
               $('td.col0').addClass('hide');
               $('.hide').hide();
                stdTableBasic('#patientSearchTable', false);
             }
           });
}
