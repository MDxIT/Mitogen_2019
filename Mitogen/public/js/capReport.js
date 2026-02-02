$(document).ready(function(){
  var blank = '';
  GetCapChecklistOnLoad();
  RestProtocollistOnLoad();
  RestSteplistOnLoad();
  $('#capId').change(function(){
    if ( $(this).val() != blank ){
      $('#stepId_field').val(blank);
      $('#workflowId_field').val(blank);
      getProtocolList();
      RestSteplistOnLoad();
    }else{
      $('#workflowId_field').val(blank);
      $('#stepId_field').val(blank);
      RestProtocollistOnLoad();
      RestSteplistOnLoad();
    }
  });
  $('#workflowId').change(function(){
    if ( $(this).val() != blank ){
      $('#stepId_field').val(blank);
      getStepList();
    }else{
      $('#stepId_field').val(blank);
      RestSteplistOnLoad();
    }
  })
});
$(function() {
  $('.viewOrder').on("click", function () {
        var reqId = $(this).text();
        if(reqId != 'No Order') {
             var win = window.open("/uniflow?stepName=Order+Form&_recId="+reqId+"&nextStepInstance=View&nextStepWorkflow=", "_blank", "height=700,width=800,location=no,menubar=no,top=200,left=600,toolbar=no");
              if (win) {
                   win.focus();
                } else {
                    alert('Please allow pop-up windows for this site');
                  }
          }
  });
});
function GetCapChecklistOnLoad(){
  $('#capId').load('/uniflow',
    {stepName: 'ajaxResetCapChecklist'}
  );
}

function RestProtocollistOnLoad(){
  $('#workflowId').load('/uniflow',
    {stepName: 'ajaxResetOptions'}
  );
}

function RestSteplistOnLoad(){
  $('#stepId').load('/uniflow',
    {stepName: 'ajaxResetOptions'}
  );
}

function getProtocolList(){
  $('#workflowId').load('/uniflow',
    {stepName: 'getProtocolList', selectedCapId: $('#capId').val()}
  );
}

function getStepList(){
  $('#stepId').load('/uniflow',
    {stepName: 'getStepList', selectedCapId: $('#capId').val(), selectedProtocol: $('#workflowId').val() }
  );
}