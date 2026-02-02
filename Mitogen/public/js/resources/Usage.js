$(document).ready(function() {
  $('#addResources').tabs();
  $("#taskName_field").attr('style', 'width : 350px !important');

  $('#taskName').change(function(){
    getCurrentResources($(this).val());
  });

  $('.usageReagentsSelect').change(function(){
    fillTableByItem($(this).val(), $(this).attr('name'));
  });

  $('.usageControlsSelect').change(function(){
    fillTableByItem($(this).val(), $(this).attr('name'));
  });

  $('.usageConsumablesSelect').change(function(){
    fillTableByItem($(this).val(), $(this).attr('name'));
  });

  $('#batchSize').change(function(){
    checkQtyNeeded($(this).val());
  });

  $('.editByStepInventoryType').each(function() {
    console.log($(this).val());

    if ( $(this).val() != 'Prepared Control' && $(this).val() != 'Received Control' ) {
      $(this).parent('td').siblings().children('.controlUsageType').addClass('hideThisField');
    }

    if ( $(this).val() == 'Prepared Consumable' ) {
      $(this).parent('td').siblings().children('.amount').addClass('hideThisField');
    }
  });

  if ( $('#inventoryType').val() != 'Prepared Control' && $('#inventoryType').val() != 'Received Control' ) {
    $('.controlUsageType').addClass('hideThisColumn');
  }

  if ( $('#inventoryType').val() == 'Prepared Consumable' ) {
    $('.resourceAmount').addClass('hideThisColumn');
    $('.units').addClass('hideThisColumn');
  }

  hideColumns('#editInvStep', 'hideThisColumn');
  $('.hideThisField').hide();

  let batchSize = $('#batchSize').val();

  checkQtyNeeded(batchSize);

  let getUrlParameter = function getUrlParameter(sParam) {
    let sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
  };
  let taskName = getUrlParameter('taskName');
  $('#taskName').val(taskName);
  $('#taskName_field').val(taskName);
});

function fillTableByItem(itemName, name){

  let cellName = name;
  let item = itemName;
  let units;
  $('[name^='+cellName+']').parent().siblings().children('.units').val('');
  $('[name^='+cellName+']').parent().siblings().children('.amount').css("background-color", "transparent");

  $.getJSON('/uniflow?callback=?&stepName=Ajax+Load+Inventory+Attributes+By+Item&item='+ item,{},
  function(data,status)
  {
    units = data[0].units;

    $('[name^='+cellName+']').parent().siblings().children('.units').val(units);
    $('[name^='+cellName+']').parent().siblings().children('.amount').css("background-color", "yellow");

  });
}

function getCurrentResources(fromStep) {
  $('#currentResources').empty();
  $('#currentResources').load('/uniflow',
    {
      stepName: 'Ajax Load Current Resources Table',
      fromStep: fromStep
    }
  );
}

function checkQtyNeeded(batchSize) {
  let cellName = 'masterMix';
  // need to loop through table rows
  let usageQty = $('[name^='+cellName+']').parent().siblings().children('.mmUsageQty').val();
  let totalQty= $('[name^='+cellName+']').parent().siblings().children('.mmTotalQty').val();
  let needed = (batchSize * usageQty);

  $('[name^='+cellName+']').parent().siblings().children('.mmNeeded').val(needed);

  if(needed < totalQty) {
    $('[name^='+cellName+']').parent().siblings().children('.mmStatus').val('GOOD').css("background-color", "PaleGreen");
  } else {
    $('[name^='+cellName+']').parent().siblings().children('.mmStatus').val('BAD').css("background-color", "#F75D59");
  }
}



