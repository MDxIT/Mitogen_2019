$(document).ready( function() {
    $('.specimenInfo_specimenId').change(function() {
        actionOptions();
    });
    if($("#instance").val() === 'QC' && $("#isReceiving").val() === 'true'){
        actionOptions();
    }
});


function actionOptions(){
    let receivingData = false;
    if ($("#instance").val() === 'QC' && $("#isReceiving").val() === 'true'){
        $('.specimenInfo_specimenId').each(function(){
            if(($(this).val()).trim().length > 0){
                receivingData = true;
            }
        });
    }
    if (receivingData === true){
        $("#orderFormRoutingOptions").children(":nth-child(2)").hide();
        $("#orderFormRoutingOptions").children(":nth-child(3)").show();
    }else{
        $("#orderFormRoutingOptions").children(":nth-child(2)").show();
        $("#orderFormRoutingOptions").children(":nth-child(3)").hide();
    }

}

