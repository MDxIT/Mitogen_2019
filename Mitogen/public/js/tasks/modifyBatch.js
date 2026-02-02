var total;
$(document).ready(function() {
  var min = $('.minSamples').val();
  var max = $('.maxSamples').val();
  hideColumns('#batchSampleTable', 'hideColumnRunId');
  hideColumns('#batchSampleTable', 'includeCommentsNo');
  hideColumns('#batchSampleTable', 'includeRemoveNo');

  if( $('#Sample_Counter').val() == 'Off'){
    $('#counter_div').hide();
  }

  if($('#incComHist').val() == 'No'){
    $( "th:contains('Comment History')" ).hide();
    $('.col10').hide();
  }

  countTotal();

  $('.minSamples, .maxSamples').change(function(){
    min = $('.minSamples').val();
    max = $('.maxSamples').val();
    if (parseFloat(max) < parseFloat(min)) {
      createSimpleModal('messageId', 'Maximum number of samples must be larger than the minimum number', 'Max Value');
      $(this).focus();
      $(this).select();
    }
    if(parseFloat(max) < parseFloat($('.counter').val())) {
      createSimpleModal('messageId', 'Maximum value can not be less than the number of samples in batch', 'Max Value');
      $(this).focus();
      $(this).select();
    }
  });

  $(document).on("click",'.batchSampleTable_checkbox',function(){
    countTotal();
    countValidations($(this), min, max);
  });
  $('.addNewSample').blur(function(){
    if( $(this).val() != ''){
      var batchSamples = []
      $('.batchSampleTable_specimenId').each(function(){
        batchSamples.push($(this).val());
      });

      if(batchSamples.indexOf($(this).val()) == -1){

        if(+1+total <= $('.maxSamples').val()){
          inputTableAddRow('batchSampleTable', true);
          setTubeInfo();
        }else{
          createSimpleModal('messageId', 'The maximum number of samples allowed has been reached.', 'Max Samples');
        }

      } else {
        createSimpleModal('messageId', 'This sample has already been added to batch.', 'Already Assigned');
        $(this).val('')
      }
    }
  });
});

function countTotal() {
  var i = 0
  $('.batchSampleTable_checkbox').each(function(){
    if ($(this).is(':checked') === false) {
      i++
    }
  });
  total = i;
  $('.counter').val(total);
}

function countValidations(currentCheckbox, min, max) {
  if( parseFloat(total) < parseFloat(min) ){
    createSimpleModal('messageId', 'The minimum number of samples allowed has not been reached.', 'Minimum');
    currentCheckbox.prop('checked', false);
    currentCheckbox.attr('checked', false);
    countTotal();
  };
  if( parseFloat(total) > parseFloat(max) ){
    createSimpleModal('messageId', 'The maximum number of samples allowed has been reached.', 'Maximum');
    currentCheckbox.prop('checked', true);
    currentCheckbox.attr('checked', true);
    countTotal();
  };
}

function setTubeInfo() {
  var tubeId = $('.addNewSample').val();
  var lastRowChild;
  var sampleComments;
  $.getJSON('/uniflow?callback=?&stepName=getBatchSampleData&tubeId=' + tubeId,{},
    function(data,status) {

      if(data.length > 0) {
        lastRow = $("#batchSampleTable > tbody > tr:eq(-1)");
        lastRowChild = $("#batchSampleTable > tbody > tr:eq(-1)").children();
        // Update new row data
        lastRowChild.children('.batchSampleTable_order').val(getNextOrder());
        lastRow.children('.col2').html(data[0].orderPriority);
        lastRowChild.children('.batchSampleTable_specimenId').val(data[0].sampleId);
        lastRowChild.children('.batchSampleTable_patientName').val(data[0].patientName);
        lastRowChild.children('.batchSampleTable_MRN').val(data[0].MRN);
        lastRowChild.children('.batchSampleTable_specimenType').val(data[0].specimenType);
        lastRowChild.children('.batchSampleTable_tests').val(data[0].tests);
        lastRowChild.children('.batchSampleTable_tests').attr('value', data[0].tests);
        lastRowChild.children('.batchSampleTable_customer').val(data[0].customerName);
        lastRowChild.children('.batchSampleTable_customer').attr('value', data[0].customerName);
        lastRow.children('.col10').html(data[0].commentHistory);
        lastRowChild.children('.hideColumnRunId').val(data[0].runId);
        lastRowChild.children('.hideColumnRunId').attr('value',data[0].runId);
        if($('#removeSamples') == 'Yes'){
          $('#batchSampleTable  .col0').show();
          $('#batchSampleTable th:first').show();
        }
        lastRowChild.children('.batchSampleTable_checkbox').show();
        countTotal();

      } else {
        $("#batchSampleTable > tbody > tr:eq(-1)").remove()
        createSimpleModal('messageId', 'Barcode information not found.', 'Sample Not Found')
        $('.addNewSample').focus();
        $('.counter').val(total-1);
      }
    }
  );
  countTotal();
  newRowCountValidations($('.addNewSample'), $('.minSamples').val(), $('.maxSamples').val())
  $('.addNewSample').val('');
}

function newRowCountValidations(currentCheckbox, min, max) {
  if( parseFloat(total) > parseFloat(max) ){
    createSimpleModal('messageId', 'The maximum number of samples allowed has been reached.', 'Maximum');
    countTotal();
  };
}

function getNextOrder(){

  var orderArr = []
  var curMaxOrder
  var nextOrder

  $('.batchSampleTable_order').each(function(){
    orderArr.push($(this).val()) 
  })

  curMaxOrder = orderArr.reduce(function(a, b) {
    return Math.max(a, b)
  });

  nextOrder = curMaxOrder + 1

  return nextOrder
}