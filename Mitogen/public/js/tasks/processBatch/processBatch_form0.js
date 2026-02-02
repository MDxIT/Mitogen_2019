
$(document).ready(function() {
    convertOutputTableDateFormats('#processBatch_list', $('#dateFormat').val());
    if ($('#acceptQueue').val() === 'any'){
    	$('#processBatch_listDiv').hide();
    };
});
