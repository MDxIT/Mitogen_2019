
$(document).ready( function() {

	$('#sampleListTable tbody tr').each(function(){
		$(this).find('.sampleInput').removeClass("sampleInput");
	})

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
 $('.well').each(function(){
   if ($(this).val() != '') {
     usedWell++
   }
 });
 return usedWell;
}