$(document).ready(function() {
  var form = $('[name="stepForm"]');

  $('#stepFormSubmitButton').hide();
  $('#hiddenSelects').hide()


  $('#submitbutton').on('click', function(e){
    e.preventDefault();
    let allowSubmit = true;
    let triggerStep = $('[name="stepName"]').val()

    let itemsToProcess = [];
    
    destroyDataTable("#exceptionHandlingTable")
    destroyDataTable("#exceptionHandlingTableGrpContainer")
    $('.eHIncludeCkbx').each(function(){
      if($(this).is(':checked')){
          $(this).val('true');
          $(this).prop('checked', true);

          $(this).parent().siblings().children('.selectAction').attr('data-parsley-required', 'true');
          $(this).parent().siblings().children('.selectAction').addClass('required');
          $(this).parent().siblings().find('.selectAction').attr('data-parsley-required','true');

          if($(this).parent().siblings().children('.selectAction').val() == 'Next Step'){
            var spanContent = $(this).parent().siblings().children('.nextStepSpan').html()
            if(spanContent === ''){
              $(this).parent().siblings().children('.nextStepSpan').parent().find('.nextStepErrors').remove()
              $(this).parent().siblings().children('.nextStepSpan').parent().append('<div class="nextStepErrors">Next Step selection is required</div>')
              allowSubmit = false;
            } else {
              $(this).parent().siblings().children('.nextStepSpan').parent().find('.nextStepErrors').remove()
            }
          }

          let containerIdVal = $(this).parent().siblings().find('.containerId').html();
          let handlingTypeVal = $(this).parent().siblings().find('.handlingType').val();
          let selectActionVal = $(this).parent().siblings().find('.selectAction').val();
          let nextStepVal = $(this).parent().siblings().find('.nextStepSpan').html();
          let queuedItemVal = $(this).parent().siblings().find('.queuedContainerId').html();
          let queuedParentVal = $(this).parent().siblings().find('.parentGroupingContainer').html();
          let noteVal = $(this).parent().siblings().find('.enteredComment').val();
          let poolRunParentVal = $(this).parent().siblings().find('.poolRunParentId').val();
          console.log(poolRunParentVal,'poolRunParentVal')
        itemsToProcess.push({
          "containerId": containerIdVal,
          "handlingType": handlingTypeVal,
          "action": selectActionVal,
          "nextStep": nextStepVal,
          "queuedItem": queuedItemVal,
          "queueParent": queuedParentVal,
          "note": noteVal,
          "currentTriggerStep": triggerStep,
          "poolRunParent": poolRunParentVal


        });
      } else {
          $(this).val('false');
          $(this).prop('checked', false);

          $(this).parent().siblings().children('.selectAction').attr('data-parsley-required', 'false');
          $(this).parent().siblings().children('.selectAction').removeClass('required');
          $(this).parent().siblings().find('.selectAction').attr('data-parsley-required','false');
          $(this).parent().siblings().children('.nextStepSpan').parent().find('.nextStepErrors').remove()

      }
    });

    if (form.parsley().isValid() && allowSubmit == true) {
      if($('input[name="formNumber"]').val() != '0' && itemsToProcess[0].handlingType == 'groupParent'){
        let queuedGroupingContainer = $("#queuedContainerId").val();
        let parentGroupingContainer = $(".parentGroupingContainer").html();
        let callObject = {
                "stepName": 'ajaxCheckParentGroupingContainer',
                "queuedGroupingContainer": queuedGroupingContainer,
                "parentGroupingContainer": parentGroupingContainer
        };
        $.getJSON('uniflow?', callObject).done(function (data) {
            if(data[0].groupingContainerDifferences != 'No'){
                $('#modal').html('');
                $('#modal').html('This parent grouping container does not have the same specimens as the queued grouping container. Do you wish to proceed? ');
                // createSimpleModal('groupingContainerParentSelectionWarning', 'This parent grouping container does not have the same specimens as the queued grouping container.', '');
                var dialog = initCenterModal('modal','', 300,400, function(){
                  console.log('itemsToProcess', itemsToProcess)
                  var itemsToProcessJson = JSON.stringify(itemsToProcess);
                  console.log('itemsToProcessJson', itemsToProcessJson)
                  let postData = {
                      "stepName": "Exception Handling Routing",
                      "Submit": true,
                      "formNumber": 0,
                      "itemsToProcessJson": itemsToProcessJson
                  };
                  console.log('postData', postData)
                  $.post('/uniflow', postData).done(function (jqxhr, statusText) {
                    console.log('statusText', statusText)
                    let postHtml = $.parseHTML(jqxhr);
                    let postError = checkPostError(postHtml);
                    if (postError !== false) {
                      console.log('error', postError)
                      $('#modal').html('')
                      $('#modal').html(postError)
                      let errorDialog = initCenterAlertModal('modal', 'Error', true, 200, 300)
                      errorDialog.dialog('open');
                    } else {
                      $('[name="stepForm"]').submit();
                    }
                  }).fail(function (jqxhr, textStatus, error) {
                    let err = "Request Failed: " + textStatus + ", " + error;
                    console.log(err);
                    $('#modal').html('')
                    $('#modal').html(err)
                    let errorDialog = initCenterAlertModal('modal', 'Error', true, 200, 300)
                    errorDialog.dialog('open');
                  });
                }, function(){
                  console.log('not submitted')
                })
              dialog.dialog('open');
            } else {
                  var itemsToProcessJson = JSON.stringify(itemsToProcess);
                  let postData = {
                      "stepName": "Exception Handling Routing",
                      "Submit": true,
                      "formNumber": 0,
                      "itemsToProcessJson": itemsToProcessJson
                  };
                  console.log('postData', postData)
                  $.post('/uniflow', postData).done(function (jqxhr, statusText) {
                    console.log('statusText', statusText)
                    let postHtml = $.parseHTML(jqxhr);
                    let postError = checkPostError(postHtml);
                    if (postError !== false) {
                      console.log('error', postError)
                      $('#modal').html('')
                      $('#modal').html(postError)
                      let errorDialog = initCenterAlertModal('modal', 'Error', true, 200, 300)
                      errorDialog.dialog('open');
                    } else {
                      $('[name="stepForm"]').submit();
                    }
                  }).fail(function (jqxhr, textStatus, error) {
                    let err = "Request Failed: " + textStatus + ", " + error;
                    console.log(err);
                    $('#modal').html('')
                    $('#modal').html(err)
                    let errorDialog = initCenterAlertModal('modal', 'Error', true, 200, 300)
                    errorDialog.dialog('open');
                  });
                }
            return true;
        });

      } else {

        // if (form.parsley().isValid() && allowSubmit == true) {
          var itemsToProcessJson = JSON.stringify(itemsToProcess);
          let postData = {
              "stepName": "Exception Handling Routing",
              "Submit": true,
              "formNumber": 0,
              "originaltingStep": triggerStep,
              "itemsToProcessJson": itemsToProcessJson
          };
          console.log('postData', postData)
          $.post('/uniflow', postData).done(function (jqxhr, statusText) {
            console.log('statusText', statusText)
            let postHtml = $.parseHTML(jqxhr);
            let postError = checkPostError(postHtml);
            if (postError !== false) {
              console.log('error', postError)
              $('#modal').html('')
              $('#modal').html(postError)
              let errorDialog = initCenterAlertModal('modal', 'Error', true, 200, 300)
              errorDialog.dialog('open');
            } else {
              if($('input[name="formNumber"]').val() === '0'){
                window.location.reload(true);
              } else {
                $('[name="stepForm"]').submit();
              }
            }
          }).fail(function (jqxhr, textStatus, error) {
            let err = "Request Failed: " + textStatus + ", " + error;
            console.log(err);
            $('#modal').html('')
            $('#modal').html(err)
            let errorDialog = initCenterAlertModal('modal', 'Error', true, 200, 300)
            errorDialog.dialog('open');
          });

        // }

      }
    }
  });


  $(".selectAction").on("change", function() {
    checkContainerOnQueue($(this));
    if($(this).val() == 'Next Step'){

      addEditNextStepOnClick($(this).parent().parent().find('.nextStep'))

    } else {
      $(this).parent().parent().find('.nextStepSpan').html('')
    }
  });

  if($('input[name="formNumber"]').val() === '0' ){

    convertOutputTableDateFormats( '#exceptionHandlingTable', $('#dateFormat').val());
    convertOutputTableDateFormats( '#exceptionHandlingTableGrpContainer', $('#dateFormat').val())

    hideColumns('#exceptionHandlingTable', 'hideColumn');
    hideColumns('#exceptionHandlingTableGrpContainer', 'hideColumn');
    // when tables are empty, Hidden Title still appears. Need the following code
    $('th:contains("Hidden")').addClass('hide');
    $('.hideColumn').parent().addClass('hide');
    $('.hide').hide();

    var groupingContainerList = $('.groupingContainer').map(function(){
      return $(this).html()
    }).get().filter(onlyUnique)
    generateSelectOptions (groupingContainerList, $('#groupingContainerFilter'))

    var panelList = $('.panels').map(function(){
      return $(this).html()
    }).get().filter(onlyUnique)
    generateSelectOptions (panelList, $('#panelFilter'))


    var stepQueuedFromList = $('.stepQueuedFrom').map(function(){
      return $(this).html()
    }).get().filter(onlyUnique)
    generateSelectOptions (stepQueuedFromList, $('#stepQueuedFromFilter'))



    // create datatable for specimen table
    var exceptionHandlingTable = stdTableBasic("#exceptionHandlingTable", true);



    // arrange new filters for specimen table
    $('#exceptionHandlingTable_filter').append($('#table_filters'));
    $('#exceptionHandlingTable_filter').append('<input type="button" value="Action" name="exceptionHandlingTable_actionMultipleBtn" class="button" id="exceptionHandlingTable_actionMultipleBtn" >');


    $('#panelFilter').change(function() {
        addColumnSpecificSearch(exceptionHandlingTable, 2, $(this).val());
    });


    $('#stepQueuedFromFilter').change(function() {
        addColumnSpecificSearch(exceptionHandlingTable, 3, $(this).val());
    });

    $('#exceptionHandlingTable').find('.nextStep').on('click', function(){
      addEditNextStepOnClick($(this))
    })

    $('#exceptionHandlingTable').find('.exceptionHandlingTableCheckAll').on('click', function(){
      console.log('overall value', $(this).is(':checked'))
      getSelectAllOptionsForTable('#exceptionHandlingTable', 'eHIncludeCkbx', $(this).is(':checked'), '#hiddenActionOptionsSamples', '#exceptionHandlingTableCheckAllAction');
    })


    $('#exceptionHandlingTable_actionMultipleBtn').on('click', function(){
      getActionOptionsForMultipleInTable('#exceptionHandlingTable', 'eHIncludeCkbx', '#hiddenActionOptionsSamples', '#exceptionHandlingTableCheckAllAction');
    })

    /** BEGIN GROUPING CONTAINER TABLE **/
    var stepQueuedFromGrpContainer = $('.stepQueuedFromGrpContainer').map(function(){
      return $(this).html()
    }).get().filter(onlyUnique)
    generateSelectOptions (stepQueuedFromGrpContainer, $('#stepQueuedFromFilterGrpContainer'))

    // create datatable groupingContainers
    var exceptionHandlingTableGrpContainer = stdTableBasic("#exceptionHandlingTableGrpContainer", true);

    // arrange new filters for groupContainers table
    $('#exceptionHandlingTableGrpContainer_filter').append($('#table_filtersGrpContainers'));
    $('#exceptionHandlingTableGrpContainer_filter').append('<input type="button" value="Action" name="exceptionHandlingTableGrpContainer_actionMultipleBtn" class="button" id="exceptionHandlingTableGrpContainer_actionMultipleBtn" >');

    $('#stepQueuedFromFilterGrpContainer').change(function() {
        addColumnSpecificSearch(exceptionHandlingTableGrpContainer, 3, $(this).val());
    });

    $('#exceptionHandlingTableGrpContainer').find('.nextStep').on('click', function(){
      addEditNextStepOnClick($(this))
    })

    $('#exceptionHandlingTableGrpContainer').find('.exceptionHandlingTableGrpContainerCheckAll').on('click', function(){
      getSelectAllOptionsForTable('#exceptionHandlingTableGrpContainer', 'eHIncludeCkbx', $(this).is(':checked'), '#hiddenActionOptionsGroup', '#exceptionHandlingTableGrpContainerCheckAllAction');
    })

    $('#exceptionHandlingTableGrpContainer_actionMultipleBtn').on('click', function(){
      getActionOptionsForMultipleInTable('#exceptionHandlingTableGrpContainer', 'eHIncludeCkbx', '#hiddenActionOptionsGroup', '#exceptionHandlingTableGrpContainerCheckAllAction');
    })


  // form 1
  } else {

    $(".expandAll").on("click", function() {
         $(".sectionContent").show();
      });

    $(".collapseAll").on("click", function() {
         $(".sectionContent").hide();
      });

    convertOutputTableDateFormats( '#individualSpecimenAction', $('#dateFormat').val());
    convertOutputTableDateFormats( '#associatedSpecimenActionAvailable', $('#dateFormat').val());
    convertOutputTableDateFormats( '#associatedSpecimensActionNotAvailable', $('#dateFormat').val());
    convertOutputTableDateFormats( '#poolSpecimens', $('#dateFormat').val());

    hideColumns('#individualSpecimenAction', 'hideColumn');
    hideColumns('#associatedSpecimenActionAvailable', 'hideColumn');
    hideColumns('#selectedGroupingContainerAction', 'hideColumn');
    hideColumns('#selectedGroupingContainerParent', 'hideColumn');

    // when tables are empty, Hidden Title still appears. Need the following code
    $('th:contains("Hidden")').addClass('hide');
    $('.hideColumn').parent().addClass('hide');
    $('.hide').hide();

    $('#individualSpecimenAction').find('.nextStep').on('click', function(){
      addEditNextStepOnClick($(this))
    })

    $('#associatedSpecimenActionAvailable').find('.nextStep').on('click', function(){
      addEditNextStepOnClick($(this))
    })


    $('#selectedGroupingContainerAction').find('.nextStep').on('click', function(){
      addEditNextStepOnClick($(this))
    })

    $('#selectedGroupingContainerParent').find('.nextStep').on('click', function(){
      addEditNextStepOnClick($(this))
    })

    // Grouping Container Tables - user can only select the parent grouping container or the queued grouping container -- Not Both
    $('.groupingContainerCheckbox').click(function() {
      if ($(this).is(':checked') ){
        if($('.groupingContainerCheckbox:checked').length > 1){
          createSimpleModal('groupingContainerErrorModal', 'You can only select the selected grouping container or the parent grouping container. Not both.', '');
          $(this).prop('checked', false);
          $(this).parent().siblings().find('.selectAction').val('');
          $(this).parent().siblings().find('.nextStepSpan').html('');
        } else {
          $(this).val('true');
          $(this).prop('checked', true);
        }
      } else {
        $(this).val('false');
      }
    });
  }

});


function getSelectAllOptionsForTable(tableId, checkboxClass, checkedValue, hiddenActionOptionsSelect, hiddenCheckAllActionId){
  checkAllCkbxForTable(tableId, checkboxClass, checkedValue);
  if(checkedValue){
    checkAllActionOption(tableId, checkboxClass, hiddenActionOptionsSelect, hiddenCheckAllActionId)
  } else {
    $(tableId).find('.nextStepSpan').html('')
    $(tableId).find('.selectAction').val('')
  }
}


function getActionOptionsForMultipleInTable(tableId, checkboxClass, hiddenActionOptionsSelect, hiddenCheckAllActionId){
  if($(tableId + ' .'+checkboxClass + ':checked')){
    checkAllActionOption(tableId, checkboxClass, hiddenActionOptionsSelect, hiddenCheckAllActionId)
  }
}



/**
 * Populates the modal div and triggers the modal for display. Allows for protocol selection and narrowing down of next step options available in the multiselect field. Polpulates the selected next step items on modal closure.
 *
 * @function addEditNextStepOnClick
 * @param {event object} eventObj - event object triggering call
 */
function checkAllActionOption(tableId, checkboxClass, hiddenActionOptionsSelect, saveField){
    var currentActionList = $(hiddenActionOptionsSelect).html();
    console.log('currentActionList', currentActionList)

    var dialog = initEmptyModal('modal','Select Action',450, 400, closeCurrentModal('modal'))

    let modalHTML = '';
    modalHTML +=   '<div id="checkAllActionSection">';
    modalHTML +=     '<select id="checkAllActionSelection" value="" tabindex="1">'
    modalHTML +=     currentActionList
    modalHTML +=     '</select>'
    modalHTML +=       '<button class="addEditNextStepDialogAccept confirmButtons" id="checkAllActionSelectionDialogAccept" type="button" title="Add">Set</button>';
    modalHTML +=     '</div>';
    modalHTML +=   '</div>';

    $('#modal').html(modalHTML);

    $('#checkAllActionSelection').val("")

    $('#checkAllActionSelectionDialogCancel').on('click', function(e) {
      e.preventDefault();
      closeCurrentModal('modal')
    })

    $('#checkAllActionSelectionDialogAccept').on('click', function(e) {
      e.preventDefault();
      var selectedActionValue = $('#checkAllActionSelection').val()
      console.log('selectedActionValue', selectedActionValue)

      $(tableId + ' tbody tr').each(function(){
        if($(this).find(' .' + checkboxClass).is(':checked')){
          $(this).find('.selectAction').val(selectedActionValue)
          $(saveField).val(selectedActionValue)
        }
      })


      closeCurrentModal('modal')
      if(selectedActionValue === 'Next Step'){
        addEditNextStepOnClick($(tableId), true)
      }
    })

    dialog.dialog('open');

}

function checkContainerOnQueue(action){
    var actionSelected = action.val()
    if(actionSelected == 'Contact Customer'){
      var specimen = action.parent().siblings().find('.containerId').html();
      let callObject = {
            "stepName": 'ajaxContainerOnQueue',
            "specimen": specimen
      };
      $.getJSON('uniflow?', callObject).done(function (data) {
          if(data[0].Queued != 'NotOnQueue'){
              createSimpleModal('modal', 'This Order is already queued to Contact Customer.', '');
              action.val('');
              return true;
          }
          return false;
      });
    }

}
