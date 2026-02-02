$(document).ready(function(){

    $('#stepFormSubmitButton').hide();
    $("th:contains('Hidden')").addClass("hide");
    $(".hide").hide();

    $("#searchButton").on("click", function(){
    $('#stepFormSubmitButton').show();
    searchReports()
    });

    $("#clearButton").on("click", function() {
    $(".searchInput").val("");
    $("#reportResults").empty();
    $('#stepFormSubmitButton').hide();
    });

    postReports();

});

function searchReports() {
    $('#reportResults').hide();
    $('#reportResults').load('/uniflow', {stepName: 'AjaxGetFinalReportSearch',
        patientFirstName: $('#patientFirstName').val(),
        patientLastName: $('#patientLastName').val(),
        patientDOB: $('#patientDOB').val(),
        patientMRN: $('#patientMRN').val(),
        reportType: $('#reportType').val(),
        reportID: $('#reportID').val(),
        externalRequestID: $('#externalRequestID').val(),
        requestID: $('#requestID').val(),
        startDate: $('#startDate').val(),
        endDate: $('#endDate').val()
    }, function(){
        stdTableSort("#reportResults table");
        $('#reportResults').show();
        $('td.col0').addClass('hide');
        $("th:contains('Hidden')").addClass("hide");
        $(".hide").hide();
   });
 }

function postReports() {
    $('#stepFormSubmitButton').click(function(e) {
        e.preventDefault();
        if($('#reportSearchTable tbody').length > 0){
            $('#reportSearchTable tbody tr').each(function(index, row) {
                var finalData = [];
                var reportID = $(row).find('.reportID').val()
                var reportModify = $(row).find('.reportModify').val()
                var reportComment = $(row).find('.reportComment').val()
                if (reportModify || reportComment) {
                    var data = $(this).data();
                    data['ReportID'] = reportID;
                    data['Modify'] = reportModify;
                    data['Comments'] = reportComment;
                    finalData.push({"ReportID": data['ReportID'], "Modify": data['Modify'], "Comments": data['Comments']});
                }

                if (finalData.length) {
                    jsonData = JSON.stringify(finalData);
                    console.log(jsonData);

                    var postData = {
                        "jsonData": jsonData,
                        "stepName": "Post Final Report Modifications",
                        "Submit": true,
                        "formNumber": 0
                    };
                    $.post('/uniflow', postData).done(function(data) {
                        var postHtml = $.parseHTML(data);
                        var postError = checkPostError(postHtml);
                        if (postError !== false) {
                          $('#errorMessageArea').html('<span class="error" id="errorId"><br><span>'+postError+'<br></span></span>')
                          console.log('postError', postError.trim())
                          return false;
                        }
                        else {
                          console.log("success");
                          // $("#reportResults").empty();
                          // $(".searchInput").val("");
                          $('[name="stepForm"]').submit();
                        }
                    }).fail(function(jqxhr, textStatus, error) {
                        var err = "Request Failed: " + textStatus + ", " + error;
                        console.log(err);
                        alert(err);

                        return false;
                    });
                }
            });
        }
    })
}