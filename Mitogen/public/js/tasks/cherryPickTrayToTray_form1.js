
$(document).ready(function() {
  var sourceWellSample;
  var sourceWell;
  var destinationWellSample;
  var destinationWell;
  var originalWell

  $('#hiddenRunTableDiv').hide();
  $('#destinationTray').show();

  $(".originalWell").each(function() {
    originalWell = $(this).val();
    $('.sampleInput').each(function(){
      destinationWell = $(this).attr('name').split(":").pop();
      if( originalWell == destinationWell){
        $(this).prop('readonly', true);
        $(this).parent().addClass("cherryPickCurrentWell");
        $(this).removeClass("destinationWell");
      }
    });
  });

  $(".destinationWell").each(function() {
    if ( $(this).val() != '' ){
      $(this).parent().addClass("cherryPickCurrentWell");
    }
  });

  $(".cherryPickCurrentWell").children('.sampleInput').change(function() {
    if ( $(this).val() == '' ){
      $(this).parent().removeClass("cherryPickCurrentWell");
    }
  });

  $(".sourceWell").parent().click(function(){
    if( $(this).children().val() != '' ) {
      sourceWellSample = $(this).children().val();
      sourceWell = $(this).children().attr('name').split(":").pop();
      $('.sourceWell').parent('.cherryPickCurrentWell').children().addClass("cherryPickDone");
      $(".sourceWell").parent().removeClass("cherryPickCurrentWell");
      $(this).addClass("cherryPickCurrentWell");
    }
  });

  $("#sourceClear").click(function(){
    $(".sourceWell").parent().removeClass("cherryPickCurrentWell");
  });

  $('.destinationWell').parent().click(function(){
    destinationWell = $(this).children().attr('name').split(":").pop();
    destinationWellSample = sourceWellSample;
    $(this).children().val(sourceWellSample);
    if( $(this).children().val() != ''){
      $(this).addClass("cherryPickCurrentWell");
    }
  });

  $(".destinationWell").parent().dblclick(function() {
    $(this).children().val('');
    $(this).removeClass("cherryPickCurrentWell");
  });

  $('.destinationWell').attr('readonly', false);
  $('.destinationWell').prop('readonly', false);


  window.Parsley.on('form:submit', function() {
    let usedWells = countUsedWells()
    if(usedWells > 0){
      //this will allow submit
      return true;
    } else {
      $('#destinationTrayError').remove();
      $('#destinationTray').prepend('<span class="error" id="destinationTrayError">*At least one sample is needed in tray</span>')
      return false;
    }
  });

});


function countUsedWells() {
 var usedWell = 0
 $('#destinationTray .destinationWell').each(function(){
   if ($(this).val() != '') {
     usedWell++
   }
 });
 return usedWell;
}

