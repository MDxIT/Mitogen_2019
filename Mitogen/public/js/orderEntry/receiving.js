$(document).ready(function() {
  var orderId = $('#requestId').val();
  $('#viewOrder').click(function () {
    window.open("/uniflow?stepName=Order+Form&_recId="+orderId+"&nextStepInstance=View&nextStepWorkflow=", "_blank", "height=700,width=600,location=no,menubar=no,top=200,left=600,toolbar=no");
  });
  $('.specimenInfo_specimenId').change(function(){
  	$(this).parent().find('.specimenError').remove();
  })
  convertOutputTableDateFormats('#specimenInfoTable_Recieved', $('#dateFormat').val());
  convertOutputTableDateFormats('#specimenInfoTable', $('#dateFormat').val());
  hideColumns('#specimenInfoTable_Recieved', 'hiddenColumn');
  hideColumns('#specimenInfoTable', 'hiddenColumn');
});