$(document).ready(function() {

  $('#stepFormSubmitButton').click(function(e){
    e.preventDefault();
    specimensOnSubmit();

    var originalPanelLen = $('[name="panels_length"]').val();
    $('[name="panels_length"]').val(-1);
    $('[name="panels_length"]').change();
    var submitOk = true;
    if(typeof fileUploadOnSubmit !== 'undefined' && $.isFunction(fileUploadOnSubmit)) {
      if(! fileUploadOnSubmit()) {
        submitOk = false;
      }
    }

    if(typeof userDefinedOnSubmit !== 'undefined' && $.isFunction(userDefinedOnSubmit)) {
      if(! userDefinedOnSubmit()) {
        submitOk = false;
      }
    }

    if(typeof specimensOnSubmit !== 'undefined' && $.isFunction(specimensOnSubmit)) {
      if(! specimensOnSubmit()) {
        submitOk = false;
      }
    }

    if(typeof billingOnSubmit !== 'undefined' && $.isFunction(billingOnSubmit)) {
      if(! billingOnSubmit()) {
        submitOk = false;
      }
    }
    
    if(typeof clinicalInfoOnSubmit !== 'undefined' && $.isFunction(clinicalInfoOnSubmit)) {
      if(! clinicalInfoOnSubmit()) {
        submitOk = false;
      }
    }

    $(".formViewAllButton").val("Collapse All");
    $(".accordionSection:not(.ui-state-active)").each(function() {
      $(this).addClass("ui-state-active");
      $(this).next().toggle();
    });

    $('.specimenError').remove();
    let containerList = [];
    let dupContainerList = [];
    //Loop through new specimens and if they don't have duplicates in the new specimen table push to containerList, otherwise display
    //error for those containers
    $('#specimenInfoTable .specimenInfo_specimenId').each(function(){
      var container = $(this).val();
      if(container.length > 0 && container != ''){
        if ($('#specimenInfoTable .specimenInfo_specimenId').filter(function() { return $(this).val() == container; }).length > 1){
          submitOk = false;
          $(this).parent().append('<ul class="parsley-errors-list filled specimenError" ><li class="parsley-required">This value is not unique.</li></ul>')
          $(this).focus();
        }
        else{
          containerList.push($(this).val())
        }
      }
    });
    //If any new specimens are left from the previous check, run a check to see if the specimen Id already exists
    if(containerList.length > 0){
      var containerRequestArray = [];
      for( con in containerList ){
        let columnRequest = {
          stepName: 'Ajax Is Container',
          inputId: containerList[con]
        };
        var containerRequest = $.getJSON('uniflow?', columnRequest);
        containerRequestArray.push(containerRequest);
        containerRequest.done(function (data) {
          //If its a container, get its containerId value and apply the error message to the new specimen that matches
          if(data[0].isContainer == 'YES'){
            $('#specimenInfoTable .specimenInfo_specimenId').each(function(){
              var container = $(this).val();
              if (container.length > 0 && container == '') return;
              if(data[0].containerId == container.toUpperCase()){
                  submitOk = false;
                  $(this).parent().append('<ul class="parsley-errors-list filled specimenError" ><li class="parsley-required">This value is not unique.</li></ul>')
                  $(this).focus();
                }
            });
          } 
        });
      }
      //Wait until all requests have completed to check validation
      $.when.apply($, containerRequestArray).done(function (){     
        $('form').parsley().validate();
        if(submitOk === true) {
          console.log('submitOk triggered')
            if($('form').parsley().isValid()) {
                $(':checkbox').removeAttr('disabled');
                $('select').removeAttr('disabled');
                $('#stepFormSubmitButton').unbind('click').click();
                return true;
            }
        } else {
          $('[name="panels_length"]').val(originalPanelLen);
          $('[name="panels_length"]').change();
        }
        return false;
      });
    } else {
      $('form').parsley().validate();
      if(submitOk === true) {
        console.log('submitOk triggered')
          if($('form').parsley().isValid()) {
              $(':checkbox').removeAttr('disabled');
              $('select').removeAttr('disabled');
              $('#stepFormSubmitButton').unbind('click').click();
              return true;
          } else {
            $('[name="panels_length"]').val(originalPanelLen);
            $('[name="panels_length"]').change();
          }
        } 
      return false;
    }
  });
  $( "#actionToolTip" ).tooltip();

});
