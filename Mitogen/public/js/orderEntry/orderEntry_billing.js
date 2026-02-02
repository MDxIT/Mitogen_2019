$(document).ready(function() {

    var formType = $('#formType').val();
    var workflow = $('#workflow').val();
    var instance = $('#instance').val();
    getAndProcessFormSettingsJson(formType, instance, workflow, '.', 'billing');


    $('#governmentPolicyNumber1').hide();
    $('#governmentPolicyNumber2').hide();

  // Hide Columns //
    hideColumns('#diagnosticCodesSelectionTable', 'hiddenColumn');
    $('#diagnosticCodesSelectionTable > tbody > tr > td:last').hide();
    $('#diagnosticCodesSelectionTable > thead > tr > th:last').hide();

  // Show/hide government health section //
    showGovtHealthSection();
    $('.governmentPayment1, .governmentPayment2').click(function(){
      showGovtHealthSection();
    });

  // Show/hide government health section //
    showPrivateInsuranceSection();
    $('.privateInsurance').change(function(){
      showPrivateInsuranceSection();
    });

  // Get Updated Insurance Carrier List //
    updateInsuranceCarrierList();
    $('#insuranceCarrier,#insuranceRecord,#paymentOption_Insurance').focus(function() {
      updateInsuranceCarrierList();
    });

  // Link to Create/Edit New Insurance Providers //
    $('#insuranceRecord').click(function(){
      window.open("/uniflow?stepName=Insurance+Providers", "_blank", "height=700,width=600,location=no,menubar=no,top=200,left=600,toolbar=no");
    });

  // ICD10Codes //
    $('.icd10code').change(function(){
      showIcd10Description($(this).val());
    });

  // Set Insurance Carrier Information //
    $('.button[name="asPrimary"], .button[name="asSecondary"]').addClass('setInsuranceCarrier');
    $('.setInsuranceCarrier').click(function(){
      insType= $(this).attr('insuranceType');
      setInsuranceCarrier(insType);
    });

  // Show billing parts //
    showBillingParts()
    $('#billTo').change(function(){
      showBillingParts();
    });

  // Clear Insurance Information //
    $('#clearInsuranceRecord').click(function(){
      clearInsuranceInfo();
    });

  // $('#addNewRecipient').click( function() {
  // reportDistributionGenerateRow('reportDistributionSelectionTable');
  // })

  // if ($('#reportDistribution_additionalRecipientCount').val() == 0){
  //   console.log('No additional recipients found');
  //   var tableId = 'reportDistributionSelectionTable';
  //   reportDistributionGenerateRow(tableId);
  // }

  $('#diagnosticCodes_clearSearchButton').click( function() {
    clearCodeSearch();
  });

  $('#searchCodeButton').click( function() {
    // clearCodeSearch();
    searchMedicalCodes();
  });

  // $('.diagnosticCodesSelectionTable_deleteCheckbox').on("click", function() {
  //   var tableId = "diagnosticCodesSelectionTable";
  //   disableRows(tableId);
  // });
});

function showGovtHealthSection(){

  if ($('.governmentPayment1').is(':checked') === true){
    $('#governmentPolicyNumber1').show();
  } else {
    $('#governmentPolicyNumber1').hide();
    $('.governmentPolicyNumber1Value').val('');
  }

  if ($('.governmentPayment2').is(':checked') === true){
    $('#governmentPolicyNumber2').show();
  } else {
    $('#governmentPolicyNumber2').hide();
    $('.governmentPolicyNumber2Value').val('');
  }
};

function showPrivateInsuranceSection(){
  if ($('.privateInsurance').is(':checked') === true){
    $('#privateInsurance').show();
  } else {
    $('#privateInsurance').hide();
    // clearInsuranceInfo();
  }
};

function showIcd10Description(icdCode) {
  $('#icd10Description').load('/uniflow', {stepName: 'Ajax ICD10 Description',
    icd10Code: icdCode
  });
  $('#icd10Description').dialog({ minWidth: 300 });
};

function showBillingParts() {
  if ($('#billTo').val() == 'Patient' || $('#billTo').val() == 'Other' ) {
    $('#billing').show();
  } else {
    $('#billing').hide();
  }
};

function setInsuranceCarrier(insType) {
  $.getJSON('/uniflow?callback=?&stepName=Ajax+Get+Insurance+Carrier&id=' + $('#insuranceCarrier').val(),{},
    function(data,status) {
      $('#carrierName' + insType).css('baclground-color', 'green');
      $('#carrierId' + insType).val(data[0].id);
      $('#carrierName' + insType).val(data[0].carrierName);
      $('#carrierAddress1' + insType).val(data[0].address1);
      $('#carrierAddress2' + insType).val(data[0].address2);
      $('#carrierCityStateZip' + insType).val(data[0].city + ', ' + data[0].state + ' ' + data[0].postalCode);
      $('#carrierCountry' + insType).val(data[0].country);
      $('#carrierPhone' + insType).val(data[0].phoneNumber);
    }
  );
};

function updateInsuranceCarrierList() {
  $('#insuranceCarrier').load('/uniflow',
    {
      stepName: 'Ajax Get Insurance Carrier List'
    }
  )
};

function onlyDigits(phoneNumber, inputId) {
  phoneNumber = phoneNumber.replace(/\D/g,'');
  $('#'+inputId).val(phoneNumber);
};


function clearInsuranceInfo() {
  var clearInsurance = ''
  $('.clearInsurance').val(clearInsurance);
}

// Function to create row, phsycianId and physicianName are options
function diagnosticCodesSelectionGenerateRow(tableId, codeType, code, description, id) {
  repeatedCodeCheck(code, codeType);
  searchMedicalCodes();
  console.log(code);
  if (typeof code === 'undefined') {code = ''};
  console.log(code);
  console.log(codeType);
  console.log(description);
  if (typeof codeType === 'undefined') {codeType = ''};
  if (typeof description === 'undefined') {description = ''};
  var nextRowId = $('#'+tableId+' tbody tr').length;
  var newRow = $('<tr class="stdRow r'+nextRowId+'"></tr>');
  $('<td class="stdTd col0"><input type="checkbox" name="'+tableId+'_'+nextRowId+'_1" class="diagnosticCodesSelectionTable_deleteCheckbox" value="false" tabindex="1"></td>').appendTo(newRow);

  if(tableId == 'diagnosticCodesSelectionTable') {
    $('<td class="stdTd col1"><input type="text" name="'+ tableId+'_'+nextRowId+'_2" readonly="true" class="diagnosticCodesSelectionTable_code" text="'+code+'" value="'+code+'" tabindex="1"></td>'+
      '<td class="stdTd col2"><input type="text" name="'+ tableId+'_'+nextRowId+'_3" readonly="true" class="diagnosticCodesSelectionTable_codeType" text="'+codeType+'" value="'+codeType+'" tabindex="1"></td>'+
      '<td class="stdTd col3"><textarea type="textArea" value="" readonly="true" class="diagnosticCodesSelectionTable_codeDescription" value="'+description+'" name="'+ tableId+'_'+nextRowId+'_4" /></td>'+
      '<td class="stdTd col4 "><input type="text" name="'+ tableId+'_'+nextRowId+'_5" readonly="true" class="diagnosticCodesSelectionTable_codeType hiddenColumn" text="'+id+'" value="'+id+'" tabindex="1"></td>').appendTo(newRow);
  }

  newRow.appendTo('#'+tableId+' tbody');
  //Update the numRows so it can be processed
  $('input[name="' + tableId + '_numRows"]').val(nextRowId+1);
  //sets value and display value of physician
  console.log(document.getElementsByName(""+tableId+"_"+nextRowId+"_2"));
  console.log(code);
  console.log(codeType);
  console.log(description);
  console.log(id);
  $("#diagnosticCodesSelectionTable > tbody > tr:last").children().children('.diagnosticCodesSelectionTable_codeDescription').val(description);
  $('#diagnosticCodesSelectionTable > tbody > tr > td:last').hide();
  $('#diagnosticCodesSelectionTable > thead > tr > th:last').hide();

}

// Checks Linked Diagnostic Code Table for Repeats //
function repeatedCodeCheck(code, codeType){
  $('#diagnosticCodesSelectionTable > tbody > tr').each( function() {
    var linkedCode= $(this).children().children('.diagnosticCodesSelectionTable_code').val()
    var linkedCodeType= $(this).children().children('.diagnosticCodesSelectionTable_codeType').val()
    if (code == linkedCode && codeType == linkedCodeType){
      $('#codeCandidates').find('input:checkbox').prop('checked', false);
      throw "exit";
    }
  });
}

// Search function for physicians
function searchMedicalCodes() {
  var getData = {
    "stepName": "Ajax Medical Code Search",
    "code": $('#searchCode').val(),
    "keyword": $('#codeKeywords').val()
  }
  $('#codeCandidates').load('/uniflow', getData);
  $('#codeCandidates').css('display','block');
  $('#codeCandidates').css({'overflow': 'scroll', 'max-height': '300px'});
}

function clearCodeSearch() {
  $('.clearCodeSearch').val('');
  $('#codeCandidates').css('display','none');
}

function billingOnSubmit() {
  if($('div#billing').is(':visible')) {
    if($('.governmentPolicyNumber1Value').hasClass('required') && $('.governmentPayment1').prop('checked') == true) {
      $('.governmentPolicyNumber1Value').attr('required','required').parsley();
    }
    if($('.governmentPolicyNumber2Value').hasClass('required') && $('.governmentPayment2').prop('checked') == true) {
      $('.governmentPolicyNumber2Value').attr('required','required').parsley();
    }
    if($('.policyHolder1Id').hasClass('required')) {
      if($('#carrierIdP').val().length != 0) {
        $('.policyHolder1Id').attr('required','required').parsley();
      } else {
        $('.policyHolder1Id').removeAttr('required');
      }
    }
    if($('.policyHolder2Id').hasClass('required')) {
      if($('#carrierIdS').val().length != 0) {
        $('.policyHolder2Id').attr('required','required').parsley();
      } else {
        $('.policyHolder2Id').removeAttr('required');
      }
    }
  } else {
    $('.governmentPayment1').removeAttr('required');
    $('.governmentPolicyNumber1Value').removeAttr('required');
    $('.governmentPayment2').removeAttr('required');
    $('.governmentPolicyNumber2Value').removeAttr('required');
    $('.policyHolder1Id').removeAttr('required');
    $('.policyHolder2Id').removeAttr('required');
  }
  return true;
}
