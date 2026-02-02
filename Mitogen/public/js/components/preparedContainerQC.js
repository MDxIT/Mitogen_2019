
$(document).ready(function() {


  $(document).on('change', '.listTable_scan, .controlListTable_scan, .preparedContainer_scan, .splitSample_containerId', function() {
    let generationId = '';
    let currentStepName = $("input[name=stepName]").val();

    if ($(this).hasClass('listTable_scan')){
      generationId = '#sampleIdGen'
    }
    if ($(this).hasClass('splitSample_containerId')){
      generationId = '#sampleIdGen'
    }
    if ($(this).hasClass('controlListTable_scan')){
      generationId = '#controlIdGen'
    }
    if ($(this).hasClass('preparedContainer_scan')){
      generationId = '.' + $(this).attr('name') + '_singleContainerGen'
    }
    if ( $(generationId).val() == 'Use Existing Identifier' ){

      let barcodeValue = $(this).val();
      if ( $(this).val() != '' ){
        checkPreparedContainer($(this), currentStepName)

      } // if not blank
      else {
        $(this).parent().removeClass("backgroundColorPaleGreen");
        $(this).parent().removeClass("backgroundColorRed");
        let consumableType = $(this).attr('preparedContainerType');
        $(this).removeAttr("preparedContainerType");
        preparedContainerCount(consumableType);
      } //if blank

    }

  }); //scan change

  $(document).on('change', '.controlAddTable_checkbox', function() {
    let consumableType = $(this).parent('td').siblings().children('.controlListTable_scan').attr('preparedContainerType');
    preparedContainerCount(consumableType);
  });

}); //document ready


function checkPreparedContainer(scanField, currentStepName) {

  let containerId = scanField.val();
  let getPreparedContainerData = {
    stepName: 'Ajax Get Prepared Container Data',
    containerId: containerId,
    currentStepName: currentStepName
  }
  let containerExists;
  let consumableType;
  let typeMatch = 0;
  let expirationDate;
  let hasContent;


  $.getJSON('uniflow?', getPreparedContainerData).done(function (data) {

    containerExists = data[0].containerId;
    consumableType = data[0].type;
    typeMatch = data[0].typeMatch;
    expirationDate = data[0].expirationDate;
    hasContent = data[0].hasContent;

    if (containerExists.trim() == '') {
      scanField.parent().addClass("backgroundColorRed");
      scanField.parent().removeClass("backgroundColorPaleGreen");
      scanField.val('');
      scanField.focus();
      scanField.removeAttr("preparedContainerType");
      createSimpleModal('preparedContainerError', 'This barcode does not exist in the system.', 'Does Not Exist');
    } 
    else if ( typeMatch.trim() == 'fail' ) {
      scanField.parent().addClass("backgroundColorRed");
      scanField.parent().removeClass("backgroundColorPaleGreen");
      scanField.val('');
      scanField.focus();
      scanField.removeAttr("preparedContainerType");
      createSimpleModal('preparedContainerError', 'This prepared container type is not assigned to this step.', 'Wrong Container Type');
    } 
    else if ( hasContent.trim() == 'fail' ) {
      scanField.parent().addClass("backgroundColorRed");
      scanField.parent().removeClass("backgroundColorPaleGreen");
      scanField.val('');
      scanField.focus();
      scanField.removeAttr("preparedContainerType");
      createSimpleModal('preparedContainerError', 'This prepared container already has a sample.', 'Container Has Content');
    }
    else if ( expirationDate == 'fail' ) {
      scanField.parent().addClass("backgroundColorRed");
      scanField.parent().removeClass("backgroundColorPaleGreen");
      scanField.val('');
      scanField.focus();
      scanField.removeAttr("preparedContainerType");
      createSimpleModal('preparedContainerError', 'This prepared container is expired.', 'Container Expired');
    } 
    else if ( containerId.trim() == ''){
      scanField.parent().removeClass("backgroundColorRed");
      scanField.parent().removeClass("backgroundColorPaleGreen");
      scanField.removeAttr("preparedContainerType");
    }
    else if ( expirationDate == 'pass' ) {
      scanField.parent().addClass("backgroundColorPaleGreen");
      scanField.parent().removeClass("backgroundColorRed");
      scanField.attr("preparedContainerType", consumableType);
    } 

    let distinctCount = 0;
    $('.listTable_scan, .controlListTable_scan, .preparedContainer_scan').each( function() {
    if ( $(this).val() == scanField.val() && scanField.val().trim() != ''){
      distinctCount++;
    }

    if (distinctCount > 1) {
      scanField.val('');
      scanField.focus();
      scanField.removeAttr("preparedContainerType");
      scanField.parent().removeClass("backgroundColorPaleGreen");
      createSimpleModal('preparedContainerError', 'This prepared container is scanned in multiple locations.', 'Container Duplicate');
    }
  });

    preparedContainerCount(consumableType);


  }).fail(function (jqxhr, textStatus, error) {
    var err = "Request Failed: " + textStatus + ", " + error;
    console.log(err);
    alert(err);
  });

}

function preparedContainerCount(containerType) {
  let count = 0;
  $('.listTable_scan, .controlListTable_scan, .preparedContainer_scan, .splitSample_containerId').each( function() {
    if ( $(this).attr('preparedContainerType') == containerType && $(this).val().trim() != ''){
      count++;
    }
  });
  $('.preparedConsumable').each( function() {
    if ($(this).val() == containerType){
      $(this).parent('td').siblings().children('.amount').val( count );
    }
  });
}

