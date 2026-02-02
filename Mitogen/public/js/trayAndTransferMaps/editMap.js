var selectedWells = [];
var i = 0
$(document).ready(function() {
  var control = 'Control'  
  var blank = 'Blank' 
  var standard = 'Standard' 
  var sample = 'Sample' 
  var $trayMap = $('#trayMapSection');
  var $transferMap = $('#transferMapSection');

  $('#viewAssignedSteps').hide();

  $("#viewStepAssignments").click(function() {
    $('#viewAssignedSteps').toggle();
  });
  
  $('#mapType').on('change', function() {
    var mapType = $(this).val();
    if(mapType == 'Tray Map') {
      $trayMap.show();
      $('.traymapOptions').val('');
      $('.transfermapOptions').val('');
      $transferMap.hide();
    } else if(mapType == 'Transfer Map') {
      $trayMap.hide();
      $('.transfermapOptions').val('');
      $('.traymapOptions').val('');
      $transferMap.show();
    } else {
      $trayMap.hide();
      $transferMap.hide();
      $('.transfermapOptions').val('');
      $('.traymapOptions').val('');
    }
  }).trigger('change');
//   $('.wellOptionButton').attr("readonly", true);

  PlateFormat();

  $(".wellType").click(function(){
    var well = $(this).val();
    selectedWells = [];
    $(".wellType").css({'background': 'white'});
    $(".sourceWell").css({'color': '#212121'});
    i = 0
    if(selectedWells.indexOf(well) === -1 ) {  
      $(this).css({'background': '#e6f7ff'});
      selectedWells.push(well)
    } else {
      $(".wellType").css({'background': 'white'});
      selectedWells = [];
    }
  });

  $(".sourceWell").click(function() {
    $(".wellType").css({'background': 'white'});
    var indexControl = selectedWells.indexOf(control);
    var indexStandard = selectedWells.indexOf(standard);
    var indexBlank = selectedWells.indexOf(blank);
    var indexSample = selectedWells.indexOf(sample);

    if (selectedWells.indexOf(control) != -1 ) {
      selectedWells.splice(indexControl, 1);
    }

    if (selectedWells.indexOf(standard) != -1 ){
      selectedWells.splice(indexStandard, 1);
    }

    if (selectedWells.indexOf(blank) != -1 ) {
      selectedWells.splice(indexBlank, 1);
    }

    if (selectedWells.indexOf(sample) != -1 ) {
      selectedWells.splice(indexSample, 1);
    }

    var well = $(this).text();

    if(selectedWells.indexOf(well) === -1 ) {  
      $(this).css({'color': '#ff000d'});
      selectedWells.push(well)
    }
  });

  $(".destinationWell").click(function() {
    if (selectedWells.length !== 0){  
      var inputWell = selectedWells[i];
      console.log(inputWell)
      $(this).val(inputWell);
      $(this).css({'background': '#5BE5DA'});
      if ( (i + 1) === selectedWells.length) {
        i = 0  
      } else {
        i++
      } 
    }
  });

  $(".destinationWell").change(function () {
    if( $(this).val() !== ''){
      $(this).css({'background': '#5BE5DA'})
    }
  })

  $(".destinationWell").dblclick(function() {
    $(this).val('');
    $(this).css({'background': 'white'})
    i = 0
  });

  $("#destinationClear").click(function() {
    $(".destinationWell").val('');
    $(".destinationWell").css({'background': 'white'})
  });

  $("#sourceClear").click(function() { 
    selectedWells = [];
    $(".sourceWell").css({'color': '#212121'});
    $(".wellType").css({'background': 'white'});
    i = 0
  });

  $("#deleteMap").click(function() { 
    if ($(this).is(':checked')) {
      alert("You have selected to delete this map!  Once deleted, all step and master mix assignments associated with this map will also be deleted!")
    }
  });

});

function PlateFormat () {  
  $(".sourceWell").parent().parent().parent().parent().addClass("table-plate");

  $(".sourceWell, .destinationWell").parent().addClass("wellParent");

  $(".wellOptionButton").parent().addClass("wellOptionButtonParent");

  $(".sourceWell, .destinationWell").parent().parent(':nth-child(even)').css({
    'background': '#ececec',  
  });

  if ($('#sourceType').val() === 'Grid') {
    $('.sourceWell').parent().parent().each(function (){
      $(this).children().first().hide()
    })  
  }

  if ($('#destinationType').val() === 'Grid') {
    $('.destinationWell').parent().parent().each(function (){
      $(this).children().first().hide()
    })  
  }

  $(".sourceWell").each(function () {
    if ($('#sourceType').val() === 'Grid') {
      var well = $(this)[0].getAttribute("name");
      well = well.replace('Source Grid:','');  
      $(this).val(well);
      $(this).text(well);
    }  else {
      var well = $(this)[0].getAttribute("name");
      well = well.replace('Source Plate:','');  
      $(this).val(well);
      $(this).text(well);
    }
  });

  $(".destinationWell").each(function () {
    if( $(this).val() !== ''){
      $(this).css({'background': '#5BE5DA'});
    }
  });
}





