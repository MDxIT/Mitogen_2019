$(function() {
    $(".tabs").tabs();
    convertOutputTableDateFormats('.formatDateTable', $('#dateFormat').val());
});