$(document).ready(function() {
  hideTableIfEmpty('.hideTableIfEmpty', '');
  $('.hiddenOnLoad').hide();

  $('#accordion').accordion({
    collapsible: true,
    heightStyle: 'content',
    active: false
  });

  // Hides empty row and makes it not required
  $('.resourceTable').each( function() {
    if ( $(this).children('tbody').children('tr:first').children().children('.resourceType').val() == '' ) {
      $(this).children('tbody').children('tr:first').hide();
      $(this).children('tbody').children('tr:first').children().children('.resource').removeAttr('required');
      $(this).children('tbody').children('tr:first').children().children('.resource').attr('data-parsley-required', 'false');
      $(this).children('tbody').children('tr:first').children().children('.resource').removeClass('required');
    }

    $(this).children('tbody').children('tr:gt(0)').show();
    $(this).children('tbody').children('tr:gt(0)').children().children('.resource').attr('data-parsley-required', 'true');
    $(this).children('tbody').children('tr:gt(0)').children().children('.resource').addClass('required');
  });

  // Check QC on load for system exceptions
    $('.reagentBarcode').each( function() {
      if ( $(this).val() != '') {
        checkReagent($(this).val(),$(this).parent().siblings().children('.type').val(), 'Reagent QC', $(this).attr('name'));
      }
    });
    $('.controlBarcode').each( function() {
      if ( $(this).val() != '') {
        checkControl($(this).val(), $(this).parent().siblings().children('.type').val(), 'Control QC', $(this).attr('name'));
      }
    });
    $('.consumableBarcode').each( function() {
      if ( $(this).val() != '') {
        checkConsumable($(this).val(),$(this).parent().siblings().children('.type').val(), $(this).attr('name'));
      }
    });
    $('.instrumentBarcode').each( function() {
      if ( $(this).val() != '') {
        checkInstrument($(this).val(),$(this).parent().siblings().children('.type').val(), $(this).attr('name') );
      }
    });

  // Check QC on change
    $(document).on('change', '.reagentBarcode', function() {
      checkReagent($(this).val(),$(this).parent().siblings().children('.type').val(), 'Reagent QC', $(this).attr('name'));
    });
    $(document).on('change', '.controlBarcode', function() {
      checkControl($(this).val(), $(this).parent().siblings().children('.type').val(), 'Control QC', $(this).attr('name'));
    });
    $(document).on('change', '.consumableBarcode', function() {
      checkConsumable($(this).val(),$(this).parent().siblings().children('.type').val(), $(this).attr('name'));
    });
    $(document).on('change', '.instrumentBarcode', function() {
      checkInstrument($(this).val(),$(this).parent().siblings().children('.type').val(), $(this).attr('name') );
    });

}); // end document ready

function checkReagent(containerId, type, qualification, name) {
  var aliquot;
  var dilution;
  var passed = 'true';

  if(containerId == '') {
    $('[name^="'+name+'"]').parent().removeClass('backgroundColorRed');
    $('[name^="'+name+'"]').parent().removeClass('backgroundColorPaleGreen');
    return 'true'
  };

  $.getJSON('/uniflow?callback=?&stepName=Ajax+Get+Reagent+Qualification&qualification='+ qualification+'&containerId=' + containerId,{},
    function(data,status){
    if (data[0].containerId.trim() == '') {
      $('[name^='+name+']').parent().addClass('backgroundColorRed');
      $('[name^="'+name+'"]').parent().removeClass('backgroundColorPaleGreen');
      $('[name^="'+name+'"]').val('');
      $('[name^="'+name+'"]').focus();
      $('#dneError').empty();
      $('#dneError').append("<p>THIS BARCODE DOES NOT EXIST IN THE SYSTEM.</p>");
      $('#dneError').dialog().show();
      passed = 'false';
    } else {
      if (data[0].qualification == qualification && data[0].type == type && data[0].expDate > data[0].todayDate){
        $('[name^="'+name+'"]').parent().addClass('backgroundColorPaleGreen');
        $('[name^="'+name+'"]').parent().removeClass('backgroundColorRed');
        }
      if (data[0].qualification != qualification) {
        $('[name^='+name+']').parent().addClass('backgroundColorRed');
        $('[name^="'+name+'"]').parent().removeClass('backgroundColorPaleGreen');
        $('[name^="'+name+'"]').val('');
        $('[name^="'+name+'"]').focus();
        $('#qualError').empty();
        $('#qualError').append(
          "<p>THIS REAGENT EITHER DOES NOT HAVE A QUALIFICATION OR THE QUALIFICATION IS EXPIRED!</p> " +
          "<p> PLEASE LOOKUP THE REAGENT UNDER THE REAGENT MANAGEMENT STEPGROUP TO SEE DETAILS.</p>");
        $('#qualError').dialog().show();
        passed = 'false';
      }
      if (data[0].type != type) {
        $('[name^='+name+']').parent().addClass('backgroundColorRed');
        $('[name^="'+name+'"]').parent().removeClass('backgroundColorPaleGreen');
        $('[name^="'+name+'"]').val('');
        $('[name^="'+name+'"]').focus();
        $('#typeError').empty();
        $('#typeError').append("<p>THE REAGENT SCANNED IS NOT " + type + ".</p><p> IT IS "+data[0].type+". </p><p>PLEASE SCAN IN THE CORRECT REAGENT TYPE</p>");
        $('#typeError').dialog().show();
        passed = 'false';
      }
      if (data[0].expDate < data[0].todayDate) {
        $('[name^='+name+']').parent().addClass('backgroundColorRed');
        $('[name^="'+name+'"]').parent().removeClass('backgroundColorPaleGreen');
        $('[name^="'+name+'"]').val('');
        $('[name^="'+name+'"]').focus();
        $('#expError').empty();
        $('#expError').append("<p>THIS REAGENT HAS EXPIRED! PLEASE DISCARD OR SEE A MANAGER.</p>");
        $('#expError').dialog().show();
        passed = 'false';
      }
    }
    return passed;
  });
}

function checkControl(containerId, type, qualification, name) {
  if(containerId == '') {
    $('[name^="'+name+'"]').parent().removeClass('backgroundColorRed');
    $('[name^="'+name+'"]').parent().removeClass('backgroundColorPaleGreen');
    return 'true'
  };
  var aliquot;
  var dilution;
  var ispassed = 'true';
  $.getJSON('/uniflow?callback=?&stepName=Ajax+Get+Control+Qualification&qualification='+ qualification+'&containerId=' + containerId,{},
    function(data,status){
      console.log(data)
      if (data[0].containerId.trim() == '') {
        $('[name^='+name+']').parent().addClass('backgroundColorRed');
        $('[name^="'+name+'"]').parent().removeClass('backgroundColorPaleGreen');
        $('[name^="'+name+'"]').val('');
        $('[name^="'+name+'"]').focus();
        $('#dneError').empty();
        $('#dneError').append("<p>THIS BARCODE DOES NOT EXIST IN THE SYSTEM.</p>");
        $('#dneError').dialog().show();
        ispassed = 'false';
      } else {
        if (data[0].qualification == qualification && data[0].type == type && data[0].expDate > data[0].todayDate) {
          $('[name^="'+name+'"]').parent().addClass('backgroundColorPaleGreen');
          $('[name^='+name+']').parent().removeClass('backgroundColorRed');
        }
        if (data[0].qualification != qualification) {
          $('[name^='+name+']').parent().addClass('backgroundColorRed');
          $('[name^="'+name+'"]').parent().removeClass('backgroundColorPaleGreen');
          $('[name^="'+name+'"]').val('');
          $('[name^="'+name+'"]').focus();
          $('#qualError').empty();
          $('#qualError').append("<p>THIS CONTROL EITHER DOES NOT HAVE A QUALIFICATION OR THE QUALIFICATION IS EXPIRED!</p> " +
            "<p> PLEASE LOOKUP THE CONTROL UNDER THE CONTROL MANAGEMENT STEPGROUP TO SEE DETAILS.</p>");
          $('#qualError').dialog().show();
          ispassed = 'false';
        }
        if (data[0].type != type) {
          $('[name^='+name+']').parent().addClass('backgroundColorRed');
          $('[name^="'+name+'"]').parent().removeClass('backgroundColorPaleGreen');
          $('[name^="'+name+'"]').val('');
          $('[name^="'+name+'"]').focus();
          $('#typeError').empty();
          $('#typeError').append("<p>THE CONTROL SCANNED IS NOT " + type + ".</p><p> IT IS "+data[0].type+". </p><p>PLEASE SCAN IN THE CORRECT CONTROL TYPE</p>");
          $('#typeError').dialog().show();
          ispassed = 'false';
        }
        if (data[0].expDate < data[0].todayDate) {
          $('[name^='+name+']').parent().addClass('backgroundColorRed');
          $('[name^="'+name+'"]').parent().removeClass('backgroundColorPaleGreen');
          $('[name^="'+name+'"]').val('');
          $('[name^="'+name+'"]').focus();
          $('#expError').empty();
          $('#expError').append("<p>THIS CONTROL HAS EXPIRED! PLEASE DISCARD OR SEE A MANAGER.</p>");
          $('#expError').dialog().show();
          ispassed = 'false';
        }
      }
      return ispassed;
  });
}

function checkInstrument(containerId, type, name) {
  if(containerId == '') {
    $('[name^="'+name+'"]').parent().removeClass('backgroundColorRed');
    $('[name^="'+name+'"]').parent().removeClass('backgroundColorPaleGreen');
    return 'true'
  };
  $.getJSON('/uniflow?callback=?&stepName=Ajax+Get+Instrument+Qualification&containerId=' + containerId,{},
    function(data,status) {
      var ispassed = 'true';
      if (data[0].containerId.trim() == '') {
        $('[name^='+name+']').parent().addClass('backgroundColorRed');
        $('[name^="'+name+'"]').parent().removeClass('backgroundColorPaleGreen');
        $('[name^="'+name+'"]').val('');
        $('[name^="'+name+'"]').focus();
        $('#dneError').empty();
        $('#dneError').append("<p>THIS BARCODE DOES NOT EXIST IN THE SYSTEM.</p>");
        $('#dneError').dialog().show();
        ispassed = 'false';
      } else {
        if (data[0].type == type && data[0].qualification == 'QUALIFIED') {
          $('[name^='+name+']').parent().addClass('backgroundColorPaleGreen');
          $('[name^='+name+']').parent().removeClass('backgroundColorRed');
        }
        if (data[0].qualification != 'QUALIFIED') {
          $('[name^='+name+']').parent().addClass('backgroundColorRed');
          $('[name^="'+name+'"]').parent().removeClass('backgroundColorPaleGreen');
          $('[name^="'+name+'"]').val('');
          $('[name^="'+name+'"]').focus();
          $('#qualError').empty();
          $('#qualError').append("<p>THIS INSTRUMENT DOES NOT HAVE A QUALIFICATION OR IS EXPIRED!</p> " +
            "<p> PLEASE LOOKUP THE INSTRUMENT UNDER THE INSTRUMENT MANAGEMENT STEPGROUP TO SEE DETAILS.</p>");
          $('#qualError').dialog().show();
          ispassed = 'false';
        }
        if (data[0].type != type) {
          $('[name^='+name+']').parent().addClass('backgroundColorRed');
          $('[name^="'+name+'"]').parent().removeClass('backgroundColorPaleGreen');
          $('[name^="'+name+'"]').val('');
          $('[name^="'+name+'"]').focus();
          $('#typeError').empty();
          $('#typeError').append("<p>THE INSTRUMENT SCANNED IS NOT " + type + ".</p>"
            + "<p> IT IS "+ data[0].type+".</p><p> PLEASE SCAN IN THE CORRECT INSTRUMENT.</p>");
          $('#typeError').dialog().show();
          ispassed = 'false';
        }
        if (data[0].status != 'In Service') {
          $('[name^='+name+']').parent().addClass('backgroundColorRed');
          $('[name^="'+name+'"]').parent().removeClass('backgroundColorPaleGreen');
          $('[name^="'+name+'"]').val('');
          $('[name^="'+name+'"]').focus();
          $('#expError').empty();
          $('#expError').append("<p>THE INSTRUMENT SCANNED IS NOT IN SERVICE.</p><p> IT IS CURRENTLY SET TO " + data[0].status + ".</p>");
          $('#expError').dialog().show();
          ispassed = 'false';
        }
      }
      console.log('validation ', ispassed)
      return ispassed;
  });
}

function checkConsumable(containerId, type, name) {
  var ispassed = 'true';
  if (containerId == '') {
    $('[name^="'+name+'"]').parent().removeClass('backgroundColorRed');
    $('[name^="'+name+'"]').parent().removeClass('backgroundColorPaleGreen');
    return ispassed
  }

  $.getJSON('/uniflow?callback=?&stepName=Ajax+Get+Consumable+Type&containerId=' + containerId,{},
    function(data,status){
      if (data[0].containerId.trim() == '') {
        $('[name^="'+name+'"]').val('');
        $('[name^="'+name+'"]').focus();
        $('[name^='+name+']').parent().addClass('backgroundColorRed');
        $('[name^="'+name+'"]').parent().removeClass('backgroundColorPaleGreen');
        $('#dneError').empty();
        $('#dneError').append("<p>THIS BARCODE DOES NOT EXIST IN THE SYSTEM.</p>");
        $('#dneError').dialog().show();
        ispassed = 'false';
      } else {
        if(data[0].type == type) {
          $('[name^='+name+']').parent().addClass('backgroundColorPaleGreen');
          $('[name^='+name+']').parent().removeClass('backgroundColorRed');
        }
        if (data[0].type != type) {
          $('[name^='+name+']').parent().addClass('backgroundColorRed');
          $('[name^="'+name+'"]').parent().removeClass('backgroundColorPaleGreen');
          $('[name^="'+name+'"]').val('');
          $('[name^="'+name+'"]').focus();
          $('#typeError').empty();
          $('#typeError').append("<p>THE CONSUMABLE SCANNED IS NOT " + type + ".</p><p> IT IS " + data[0].type + ".</p><p> PLEASE SCAN IN THE CORRECT CONSUMABLE.</p>");
          $('#typeError').dialog().show();
          ispassed = 'false';
        }
        if (data[0].expDate < data[0].todayDate) {
          $('[name^='+name+']').parent().addClass('backgroundColorRed');
          $('[name^="'+name+'"]').parent().removeClass('backgroundColorPaleGreen');
          $('[name^="'+name+'"]').val('');
          $('[name^="'+name+'"]').focus();
          $('#expError').empty();
          $('#expError').append("<p>THIS CONSUMABLE HAS EXPIRED! PLEASE DISCARD OR SEE A MANAGER.</p>");
          $('#expError').dialog().show();
          passed = 'false';
        }
      }
      return ispassed;
  });
}

function setResourceList() {
  $('#reagentResources > tbody  > tr').each( function() {
    var resource = $(this).find('.resource').val();
    var resourceName = $(this).find('.resource').attr('name');
    var type = $(this).find('.type').val();
    if (resource != '') {
      checkReagent(resource, type, 'Reagent QC', resourceName);
    }
  });
  $('#consumableResources > tbody  > tr').each( function() {
    var resource = $(this).find('.resource').val();
    var type = $(this).find('.type').val();
    var resourceName = $(this).find('.resource').attr('name');
    if (resource != '') {
      checkConsumable(resource, type, resourceName );
    }
  });
  $('#instrumentResources > tbody  > tr').each( function() {
    var resource = $(this).find('.resource').val();
    var resourceName = $(this).find('.resource').attr('name');
    var type = $(this).find('.type').val();
    if (resource != '') {
      checkInstrument(resource, type, resourceName );
    }
   });
  $('#controlResources > tbody  > tr').each( function() {
    var resource = $(this).find('.resource').val();
    var type = $(this).find('.type').val();
    var resourceName = $(this).find('.resource').attr('name');
    if (resource != '') {
      checkControl(resource, type, 'Control QC', resourceName )
    }
  });
}

