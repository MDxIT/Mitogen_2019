$(document).ready(function() {
  $('#capId').change(function() {

    if( $('#workflowId').val() == '' && $('#stepId').val() == '' && $('#capId').val() == '') {

       $('#workflowId').load('/uniflow', 
          {
            stepName: 'ajaxResetCapWorkflow',
            currentWorkflow: $('#workflowId').val()
          });

       $('#stepId').load('/uniflow', 
          {
            stepName: 'ajaxResetCapStep',
            currentStep: $('#stepId').val()
          });

       $('#capId').load('/uniflow', 
          {
            stepName: 'ajaxResetCapChecklist',
            currentCapId: $('#capId').val()
          });

    } 
    else if ( $('#capId').val() != '') {

      if( $('#workflowId').val() == '' && $('#stepId').val() == '') {

        $('#workflowId').load('/uniflow', 
          {
            stepName: 'ajaxGetProtocolsByCapChecklist',
            selectedCapId: $('#capId').val(),
            currentWorkflow: $('#workflowId').val()
          });
        
        $('#stepId').load('/uniflow', 
          {
            stepName: 'ajaxGetStepByCapChecklist',
            selectedCapId: $('#capId').val(),
            currentStep: $('#stepId').val()
          });


      }
      else if ( $('#workflowId').val() != '' && $('#stepId').val() == '' ) {

        $('#stepId').load('/uniflow', 
          {
            stepName: 'ajaxGetStepByCapChecklistProtocol',
            selectedCapId: $('#capId').val(),
            selectedProtocol: $('#workflowId').val(),
            currentStep: $('#stepId').val()
          });

        $('#workflowId').load('/uniflow', 
          {
            stepName: 'ajaxGetProtocolsByCapChecklist',
            selectedCapId: $('#capId').val(),
            currentWorkflow: $('#workflowId').val()
          });
        
      } 
      else if ( $('#stepId').val() != '' ) {

        $('#stepId').load('/uniflow', 
          {
            stepName: 'ajaxGetStepByCapChecklist',
            selectedCapId: $('#capId').val(),
            currentStep: $('#stepId').val()
          });

        $('#workflowId').load('/uniflow', 
          {
            stepName: 'ajaxGetProtocolByStep',
            selectedStep: $('#stepId').val(),
            currentWorkflow: $('#workflowId').val()
          });

      }

    } else if($('#capId').val() == '') {
     console.log("capId: == ")

       if ($('#stepId').val() != '' && $('#workflowId').val() == ''){

         $('#capId').load('/uniflow', 
            {stepName: 'ajaxGetChecklistByStep',
            selectedStep: $('#stepId').val(),
             currentCapId: $('#capId').val()})

         $('#stepId').load('/uniflow', 
            {stepName: 'ajaxResetCapStep',
            currentStep: $('#stepId').val()})

         $('#workflowId').load('/uniflow', 
           {stepName: 'ajaxGetProtocolByStep',
            selectedStep: $('#stepId').val(),
             currentWorkflow: $('#workflowId').val()})

        }else if ($('#stepId').val() == '' && $('#workflowId').val() != ''){

           $('#capId').load('/uniflow', 
              {stepName: 'ajaxGetChecklistByProtocol',
              selectedProtocol: $('#workflowId').val(),
               currentCapId: $('#capId').val()})

           $('#workflowId').load('/uniflow', 
              {stepName: 'ajaxResetCapWorkflow',
               currentWorkflow: $('#workflowId').val()})

           $('#stepId').load('/uniflow', 
              {stepName: 'ajaxGetStepByProtocol',
               selectedProtocol: $('#workflowId').val(),
              currentStep: $('#stepId').val()})

       } else if ($('#stepId').val() != '' && $('#workflowId').val() != ''){

           $('#workflowId').load('/uniflow', 
             {stepName: 'ajaxGetProtocolByStep',
              selectedStep: $('#stepId').val(),
               currentWorkflow: $('#workflowId').val()})

           $('#stepId').load('/uniflow', 
             {stepName: 'ajaxGetStepByProtocol',
               selectedProtocol: $('#workflowId').val(),
              currentStep: $('#stepId').val()})

           $('#capId').load('/uniflow', 
              {stepName: 'ajaxGetChecklistByStep',
              selectedStep: $('#stepId').val(),
               currentCapId: $('#capId').val()})
       }
     }
   });


   $('#workflowId').change(function() {

    if( $('#workflowId').val() == '' && $('#stepId').val() == '' && $('#capId').val() == '') {

       $('#workflowId').load('/uniflow', 
           {stepName: 'ajaxResetCapWorkflow',
               currentWorkflow: $('#workflowId').val()})

      $('#stepId').load('/uniflow', 
           {stepName: 'ajaxResetCapStep',
              currentStep: $('#stepId').val()})

      $('#capId').load('/uniflow', 
           {stepName: 'ajaxResetCapChecklist',
               currentCapId: $('#capId').val()})

    }else if ($('#workflowId').val() != ''){

       if($('#stepId').val() == '' && $('#capId').val() == '') {

         $('#stepId').load('/uniflow', 
             {stepName: 'ajaxGetStepByProtocol',
               selectedProtocol: $('#workflowId').val(),
              currentStep: $('#stepId').val()})

         $('#capId').load('/uniflow', 
              {stepName: 'ajaxGetChecklistByProtocol',
              selectedProtocol: $('#workflowId').val(),
               currentCapId: $('#capId').val()})

       }else if ($('#stepId').val() == '' && $('#capId').val() != ''){

         $('#stepId').load('/uniflow', 
             {stepName: 'ajaxGetStepByCapChecklistProtocol',
              selectedCapId: $('#capId').val(),
              selectedProtocol: $('#workflowId').val(),
              currentStep: $('#stepId').val()})

         $('#capId').load('/uniflow', 
              {stepName: 'ajaxGetChecklistByProtocol',
              selectedProtocol: $('#workflowId').val(),
               currentCapId: $('#capId').val()})
        
       } else if ($('#stepId').val() != ''){

          $('#stepId').load('/uniflow', 
            {stepName: 'ajaxGetStepByCapChecklistProtocol',
             selectedCapId: $('#capId').val(),
             selectedProtocol: $('#workflowId').val(),
              currentStep: $('#stepId').val()})

           $('#capId').load('/uniflow', 
              {stepName: 'ajaxGetChecklistByStep',
              selectedStep: $('#stepId').val(),
               currentCapId: $('#capId').val()})
       }

    }else if ( $('#workflowId').val() == ''){
       if ($('#stepId').val() != '' && $('#capId').val() != ''){

          $('#workflowId').load('/uniflow', 
            {stepName: 'ajaxGetProtocolByStep',
             selectedStep: $('#stepId').val(),
               currentWorkflow: $('#workflowId').val()})
          
          $('#capId').load('/uniflow', 
             {stepName: 'ajaxGetChecklistByStep',
             selectedStep: $('#stepId').val(),
               currentCapId: $('#capId').val()})
          

          $('#stepId').load('/uniflow', 
             {stepName: 'ajaxGetStepByCapChecklist',
             selectedCapId: $('#capId').val(),
              currentStep: $('#stepId').val()})
          

       }else if ($('#stepId').val() != '' && $('#capId').val() == ''){

          $('#workflowId').load('/uniflow', 
            {stepName: 'ajaxGetProtocolByStep',
             selectedStep: $('#stepId').val(),
               currentWorkflow: $('#workflowId').val()})

          $('#capId').load('/uniflow', 
             {stepName: 'ajaxGetChecklistByStep',
             selectedStep: $('#stepId').val(),
               currentCapId: $('#capId').val()})

          $('#stepId').load('/uniflow', 
             {stepName: 'ajaxResetCapStep',
              currentStep: $('#stepId').val()})
        

       }else if ($('#stepId').val() == '' && $('#capId').val() != ''){

          $('#workflow').load('/uniflow', 
             {stepName: 'ajaxGetProtocolsByCapChecklist',
             selectedCapId: $('#capId').val(),
               currentWorkflow: $('#workflowId').val()})

          $('#stepId').load('/uniflow', 
             {stepName: 'ajaxGetStepByCapChecklist',
             selectedCapId: $('#capId').val(),
              currentStep: $('#stepId').val()})

         $('#capId').load('/uniflow', 
             {stepName: 'ajaxResetCapChecklist',
               currentCapId: $('#capId').val()})

       }
    }
   });


   $('#stepId').change(function() {

    console.log("stepId:" + $('#stepId').val())
    console.log("workflowId:" + $('#workflowId').val())
    console.log("capId:" + $('#capId').val())

    if( $('#workflowId').val() == '' && $('#stepId').val() == '' && $('#capId').val() == '') {

       $('#workflowId').load('/uniflow', 
          {stepName: 'ajaxResetCapWorkflow',
               currentWorkflow: $('#workflowId').val()})

       $('#stepId').load('/uniflow', 
          {stepName: 'ajaxResetCapStep',
              currentStep: $('#stepId').val()})

       $('#capId').load('/uniflow', 
          {stepName: 'ajaxResetCapChecklist',
               currentCapId: $('#capId').val()})

    }else if ($('#stepId').val() != ''){

          $('#capId').load('/uniflow', 
             {stepName: 'ajaxGetChecklistByStep',
             selectedStep: $('#stepId').val(),
               currentCapId: $('#capId').val()})

          $('#workflowId').load('/uniflow', 
            {stepName: 'ajaxGetProtocolByStep',
             selectedStep: $('#stepId').val(),
               currentWorkflow: $('#workflowId').val()})

     }else if ($('#stepId').val() == ''){

       if ($('#workflowId').val() != '' && $('#capId').val() == ''){

           $('#stepId').load('/uniflow', 
             {stepName: 'ajaxGetStepByProtocol',
               selectedProtocol: $('#workflowId').val(),
              currentStep: $('#stepId').val()})

           $('#capId').load('/uniflow', 
              {stepName: 'ajaxGetChecklistByProtocol',
              selectedProtocol: $('#workflowId').val(),
               currentCapId: $('#capId').val()})

           $('#workflowId').load('/uniflow', 
              {stepName: 'ajaxResetCapWorkflow',
               currentWorkflow: $('#workflowId').val()})

       } else if ($('#workflowId').val() == '' && $('#capId').val() != ''){

           $('#workflowId').load('/uniflow', 
            {stepName: 'ajaxGetProtocolsByCapChecklist',
             selectedCapId: $('#capId').val(),
               currentWorkflow: $('#workflowId').val()})

           $('#stepId').load('/uniflow', 
             {stepName: 'ajaxGetStepByCapChecklist',
             selectedCapId: $('#capId').val(),
              currentStep: $('#stepId').val()})

           $('#capId').load('/uniflow', 
             {stepName: 'ajaxResetCapChecklist',
               currentCapId: $('#capId').val()}) 

       } else if($('#workflowId').val() != '' && $('#capId').val() != ''){

          $('#capId').load('/uniflow', 
              {stepName: 'ajaxGetChecklistByProtocol',
              selectedProtocol: $('#workflowId').val(),
               currentCapId: $('#capId').val()})

          $('#workflowId').load('/uniflow', 
            {stepName: 'ajaxGetProtocolsByCapChecklist',
             selectedCapId: $('#capId').val(),
               currentWorkflow: $('#workflowId').val()})
  
          $('#stepId').load('/uniflow', 
             {stepName: 'ajaxGetStepByCapChecklistProtocol',
              selectedCapId: $('#capId').val(),
              selectedProtocol: $('#workflowId').val(),
              currentStep: $('#stepId').val()})

       }

     }
     
   });
 });