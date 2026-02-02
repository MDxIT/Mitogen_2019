$(document).ready(function() {
    $("th:contains('Hidden')").addClass("hide");
    hideColumns('#correctedReportsTable', 'hideColumn');



    $('.sendCorrectedReports').click(function(){
        $(this).val($(this).is(':checked'));
        checkForParsley(this, $(this).parent().parent().find('.correctedText'))
    });

});
