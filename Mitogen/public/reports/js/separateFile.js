function scriptSeparateFile() {

    var reportId = $("#reportId").val();
    var cssFile = $("#templateCSSFile").val();
    var configPath = $("#configPath").val();
    console.log(cssFile);

    var substitutionScript = "<script>function substitute() {var vars = {};var x = window.location.search.substring(1).split('&');for (var i in x) {var z = x[i].split('=',2);vars[z[0]] = unescape(z[1]);}var subst = ['page', 'frompage', 'topage', 'webpage','section', 'subsection', 'date', 'isodate', 'time','title', 'doctitle', 'sitepage', 'sitepages'];for (var i in subst) {var y = document.getElementsByClassName(subst[i]);var c = y.length;for (var j = 0; j < c; ++j) {y[j].textContent = vars[subst[i]];}}}</script>";

    //build header piece to include css to ALL piecs for wkhtmltopdf
    var header = '<html><head><title>' + reportId  + '</title>';
          header+='<link href="'+configPath+'public/reports/css/'+cssFile+'" rel="stylesheet" type="text/css"/>'+ substitutionScript +' </head></html>';
    //prepend header piece to different report sections
    var reportHeader= '<body onload="substitute();">'+$('#reportHeader').clone().html() +  '</body></html>';
    var reportBody =  header+ '<body><div id="report_content" class="main_report">' + $('#reportContent').html() +  '</div></body></html>';
    var reportFooter = '<html><body onload="substitute();">'+$('#reportFooter').clone().html() +  '</body></html>';
    //prepend configPath to final report html so the signature can display in PDF
    var currentImgSource = $(".signatureImage").attr("src");
    var serverImgPath = configPath+'public/'+currentImgSource;
    var currentLogoSource = $("#primarySiteLogo").attr("src");
    var serverLogoPath = configPath+'public/'+currentLogoSource;

    var headerHTML = htmlEntities(header);
    var reportHeaderHTML= htmlEntities(reportHeader);
    var reportBodyHTML = htmlEntities(reportBody);
    var reportFooterHTML = htmlEntities(reportFooter);

    // put sections of report html into inputs to feed wkhtmltopdf
    $('#head').html( headerHTML );
    $("#headerHTML").html( reportHeaderHTML);
    $("#contentHTML").html( reportBodyHTML );
    $("#footerHTML").html( reportFooterHTML);
    //update signature image path in the HTML used to build the PDF
    $("#footerHTML .signatureImage").attr("src", serverImgPath);
    $("#contentHTML .signatureImage").attr("src", serverImgPath);
    $("#contentHTML #primarySiteLogo").attr("src", serverLogoPath);
    $('#autoCreatePDFReady').val('true');


}