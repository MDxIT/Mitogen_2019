
$(document).ready(function() {
    convertOutputTableDateFormats('#groupingContainer_List', $('#dateFormat').val());
    if ($('#acceptQueue').val() === 'any'){
    	$('#processBatch_listDiv').hide();
    };
    
});
