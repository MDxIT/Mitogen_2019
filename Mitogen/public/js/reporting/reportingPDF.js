

$(document).ready(function() {

    $('.stepName').html('Sign Out Report');
    $('#stepFormSubmitButton').hide();

    $('[name="reportId_RunCount"]').parent().parent().hide();

    curReportType = $('#reportType').val();
    if(curReportType == 'corrected' || curReportType == 'amended' || curReportType == 'addended'|| curReportType == 'canceled' || curReportType == 'rejected'){
        generateSelectOptions (['Approve'], $('#action'));
    } else{
        generateSelectOptions (['Approve', 'Result Data Review'], $('#action'));
    }
    $('#action').val('Approve');

    if($('#autoRun').val() == 'true'){
        $('#progress_text').show();
        scriptSeparateFile();
        var refreshId = setInterval(function autoRunTimer() {
            var createPDF = $('#autoCreatePDFReady').val();
            console.log('createPDF', createPDF);
            if(createPDF == 'true'){
                reportPDFCreation();
                $('#progress_overlay').show();
                $('#theReport').hide();
                clearInterval(refreshId);
            }
        }, 2000);
    } else {
        $('#theReport').show();
        $('#progress_overlay').hide();
        $('#actionDiv').show();
        $('#containerComponent').show();
        $('#defaultTemplateMessage').show();

        $('#stepFormSubmitButton').show();
        $('#stepFormSubmitButton').click(function(e) {
            e.preventDefault();
            //        scriptSeparateFile();
            var callObject = {
                "userPinVal": $('[name="mypin"]').val(),
                "stepName": "ReportValidatePIN",
                "Submit": true,
                "formNumber": 0
            };
            var pinPromise = Promise.resolve($.post('/uniflow', callObject))
            pinPromise.then(function (response) {
                var postHtml = $.parseHTML(response);
                var postError = checkPostError(postHtml);
                if (postError !== false) {
                    $('#errorMessageArea').html('<span class="error" id="errorId"><br><span>'+postError+'<br></span></span>')
                    console.log('postError', postError.trim())
                    if(postError.trim() == '*1 Incorrect User PIN Entered'){
                        $('#pinError').remove();
                        $('[name="mypin"]').parent().append('<span id=pinError class="error">*1</span>')
                    } else if(postError.trim() == '*1 Ensure PIN is set up before attempting to Sign Out a Report'){
                        $('#pinError').remove();
                        $('[name="mypin"]').parent().append('<span id=pinError class="error">*1</span>')
                    }
                } else {
                    if($('#action').val() === 'Approve'){
                        $('#progress_overlay').show();
                        $('#stepFormSubmitButton').hide();
                        $('#theReport').hide();
                        reportPDFCreation();
                    } else {
                        //else must be here to allow previous condition to stop submit if error with reportPDFCreation function
                        $('[name="stepForm"]').submit();
                    }
                }
            })
        })
    }
});



function reportPDFCreation(){

    var  page_size = $("#pdf_arguments").data("page-size");
    var  orientation = $("#pdf_arguments").data("orientation");
    var  margin_top = $("#pdf_arguments").data("margin-top");
    var  margin_right = $("#pdf_arguments").data("margin-right");
    var  margin_bottom = $("#pdf_arguments").data("margin-bottom");
    var  margin_left = $("#pdf_arguments").data("margin-left");
    var  header_spacing = $("#pdf_arguments").data("header-spacing");
    var footer_spacing = $("#pdf_arguments").data("footer-spacing");
    var formId = '#report';
    var reportId = $('#reportId').val();
    var configPath = $("#configPath").val();
    var reportDetailsId = $("#reportDetailsId").val();
    var reportHead = htmlEntities($("#head").html());
    var reportHeader = htmlEntities($("#headerHTML").html());
    var reportBody = htmlEntities($("#contentHTML").html());
    var reportFooter = htmlEntities($("#footerHTML").html());
    var reportJSON = $("#jsonObject").val();
    var versionId = $("#versionId").val();
    var status = 'finalized';
    var reportHTML =  ('<!DOCTYPE html><html>'+$("#theReport").html()+'</html>');
    var pdfFIlePath =  (configPath+ 'private/reports/'+reportId+'.pdf ');

    var postData = {
        "reportId": reportId,
        "reportDetailsId": reportDetailsId,
        "reportHead": reportHead,
        "htmlHeader": reportHeader,
        "htmlBody": reportBody,
        "htmlFooter": reportFooter,
        "reportHTML": reportHTML,
        "jsonData": reportJSON,
        "versionId": versionId,
        "status" : status,
        "pdfFIlePath": pdfFIlePath,
        "page_size": page_size,
        "orientation": orientation,
        "margin_top": margin_top,
        "margin_right": margin_right,
        "margin_bottom": margin_bottom,
        "margin_left":  margin_left,
        "header_spacing": header_spacing,
        "footer_spacing": footer_spacing,
        "stepName": "Ajax POST Report PDF",
        "Submit": true,
        "formNumber": 0
    };

    console.log(postData);
    var posting = $.post('/uniflow', postData);
    posting.done(function(data, statusText) {

        console.log('statusText', statusText);
        var postHtml = $.parseHTML(data);
        var postError = checkPostError(postHtml);
        if (postError !== false) {
            console.log("Red Screen Error: " + postError);
            console.log(postError);
            $('#progress_overlay').hide();
            $('#stepFormSubmitButton').show();
            $('#theReport').show();
            $('#errorMessageArea').html('<span class="error" id="errorId"><br><span>'+postError+'<br></span></span>')
        } else {
            $('[name="stepForm"]').submit();
        }
    })
    .fail(function(jqxhr, textStatus, error) {
        var err = textStatus + ", " + error;
        console.log("Request Failed: " + err);
    });
}


