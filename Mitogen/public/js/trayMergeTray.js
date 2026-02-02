$(document).ready(function() {

	if($('#printTray').val() == 'No'){
		$('#printThisDiv').hide();
	}

	$('#validateForm0Only').hide();

	var sourceSamples = $('sourceSpecimenCount').val();
	var wells = countOpenWells();

	if(sourceSamples > wells){
		alert('Not enough wells in destination tray');
		$('#stepFormSubmitButton').hide()
	}

	prepAndPrintDiv('#printAll');

	$('.well').each(function(){
  	$(this).attr('readonly', true);
  });

}); //End doc ready

function countOpenWells() {
 var openWells = 0
 $('.well').each(function(){
   if ($(this).val() === '') {
     openWells++
   }
 });
 return openWells;
}