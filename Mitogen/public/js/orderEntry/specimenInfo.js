$(document).ready(function() {
  hideColumns('#specimenInfoTable_Recieved', 'hiddenColumn');
  hideColumns('#specimenInfoTable', 'hiddenColumn');
  if( $('#isReceiving').val() == 'false') {
    $('#specimenInfoTable_RecievedAddTest > tbody > tr > td').children('.specimenInfo_panelSelection, .specimenInfo_testSelection, .specimenInfo_testMethod').hide()
      hideColumns('#specimenInfoTable_RecievedAddTest', 'hideReceiveDetails');
  };

  var formType = $('#formType').val();
  var instance = $('#instance').val();
  var workflow = $('#workflow').val();
  jsonSettings_specimenInfo = getFormSettingsJson(formType, instance, workflow);
  processFormSettingsJson(jsonSettings_specimenInfo, '.specimenInfo_', 'specimenInfo', '#specimenInfoTable');
  processFormSettingsJson(jsonSettings_specimenInfo, '.specimenInfo_', 'specimenInfo', '#specimenInfoTable_Recieved');
  processFormSettingsJson(jsonSettings_specimenInfo, '.specimenInfo_', 'specimenInfo', '#specimenInfoTable_RecievedAddTest');





  var receivedSpecimenCount = $('#specimenInfoTable_Recieved td').length;
  console.log('RECEIVED COUNT ' + receivedSpecimenCount);
  if (receivedSpecimenCount == 0) {
    $('#specimenInfo_previouslyReceived').hide();
  }

  // Hide Receiving if not at Order Review

  if($('#receiveAtQC').val() != 'true') {
    var index = '';
    $('.sampleReceiving').each(function() {
      index = $(this).parent().index();
      $('#specimenInfoTable tr').each(function() {
          $(this).children('th:eq(' + index + ')').hide();
          $(this).children('td:eq(' + index + ')').hide();
      });
    })

  } else {

    var formType = $('#formType').val();
    var instance = 'Receiving';
    var workflow = $('#workflow').val();
    jsonSettings_specimenInfo2 = getFormSettingsJson(formType, instance, workflow);
    processFormSettingsJson(jsonSettings_specimenInfo2, '.specimenInfo_', 'specimenInfo', '#specimenInfoTable');
    processFormSettingsJson(jsonSettings_specimenInfo2, '.specimenInfo_', 'specimenInfo', '#specimenInfoTable_Recieved');
    processFormSettingsJson(jsonSettings_specimenInfo2, '.specimenInfo_', 'specimenInfo', '#specimenInfoTable_RecievedAddTest');

  }

  hideColumns('#specimenInfoTable_Recieved', 'hideColumn');
  hideColumns('#specimenInfoTable', 'hideColumn');
  hideColumns('#specimenInfoTable_RecievedAddTest', 'hideColumn');

  $('#printDocument').hide()
 if($('#printBarcodesButton').val() == 'true' && ($('#receiveAtQC').val() == 'true' || $('#instance').val() === 'Edit')) {

    // var specimenInfoTableVariables2 = ['.specimenInfo_specimenId', '.specimenInfo_collectionDate', '.specimenInfo_specimenType']
    var specimenInfoTableVariables2 = ['.specimenInfo_specimenId']
    printTableInputBarcodeByClass('#specimenInfoTable_Recieved', '.specimenInfo_specimenId', specimenInfoTableVariables2);
    printTableInputBarcodeByClass('#specimenInfoTable', '.specimenInfo_specimenId', specimenInfoTableVariables2);
    printTableInputBarcodeByClass('#specimenInfoTable_RecievedAddTest', '.specimenInfo_specimenId', specimenInfoTableVariables2);

  } else if($('#printBarcodesButton').val() == 'true') {
    // var specimenInfoTableVariables1 = ['.specimenInfo_specimenId','.specimenInfo_collectionDate', '.specimenInfo_collectionTime']
    var specimenInfoTableVariables1 = ['.specimenInfo_specimenId']
    printTableInputBarcodeByClass('#specimenInfoTable', '.specimenInfo_specimenId', specimenInfoTableVariables1);
  }

  // Hide Empty Specimen Info Table
  if ($('#specimenInfo_EnterSamples .stdTable tbody > tr').length == 0) {
    $('#specimenInfo_EnterSamples').hide();
  }

  // Hide New Specimen Table and disable other received samples if Add Test //
  if ($('.addNewTest').val() == 'true') {
    $('#specimenInfo_EnterSamples').hide();
  }

  if( $('.addNewTest').val() == 'true' && $('#isReceiving').val() == 'false'){
    $('.specimenInfo_panelSelection').removeAttr('required');
    $('.specimenInfo_panelSelection').removeAttr('data-parsley-required');
    $('.specimenInfo_panelSelection').removeClass('required');
  }

});

function specimensOnSubmit() {
  if($('#isReceiving').val() == 'true') {
      $('.specimenInfo_specimenId').each(function() {
        if($(this).hasClass('required')) {
          var specimenEntry = 0;
          $(this).parent().siblings().children('.specimenEntry').each(function() {
            specimenEntry = specimenEntry + $(this).val().length;
          });
          if (specimenEntry != 0) {
            if($(this).parent().siblings().children('.specimenInfo_IsAddTest').val() == 0) {
              $(this).attr('required', 'required').parsley();
            }
            if($(this).val().length == 0) {
              $(this).parent().siblings().children('.sampleReceiving').removeAttr('required');
            }
          } else {
            $(this).parent().siblings().children('.sampleReceiving').removeAttr('required');
          }
        }
      });
  }
  var instance=$('#instance').val();
  //Enable Parsley Validation for required cells only for the non-empty Specimen Entries for specimenInfotable in New and QC instance
  if(instance =='New'|| (instance =='QC' && $('.stepName').text() != 'Specimen Receiving')) {
    $('#specimenInfoTable > tbody  > tr').each(function(index, tr) {
      $requiredSpecFields=$(tr).children('td').children('.specimenEntry.required');
      if ($requiredSpecFields.length > 0) {
        $requiredSpecFields.attr('data-parsley-required',true)
        var specimenEntries=0;
        $specFields=$(tr).children('td').children('.specimenEntry,.specimenInfo_specimenId');
        $specFields.each(function(index,specimenCells)  {
          specimenEntries= specimenEntries + $(specimenCells).val().length;
        });
        if(specimenEntries == 0)  {
          $requiredSpecFields.attr('data-parsley-required',false);
        }
      }
    });
  }
  // Enable Parsley Validation for required cells in Edit Instance
  else if(instance == 'Edit') {
    $('#specimenInfoTable_Recieved > tbody  > tr').each(function(index, tr) {
        $(tr).children('td').children('.specimenEntry.required').attr('data-parsley-required',true);
    });
  }

  return true;
}
