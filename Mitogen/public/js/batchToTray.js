$(document).ready(function() {

	  var samples = countTotalSamples();
	  var wells = countOpenWells();


	  if(samples > wells){
		    alert('Not enough wells in destination tray');
		    $('#stepFormSubmitButton').hide();
	   }

    $('.sampleListTable_scan').each(function() {
        $(this).attr('required','required').parsley();
    });

    $('#trayId').on('blur', function(){
        checkIfExists();
     });

    if($('#useExisting').val() == 'Use Existing Identifier'){
        $('#trayId').attr('data-parsley-use-existing','true');
        useExistingParsley()
    }


});//end doc ready

function countTotalSamples() {
   var sampleCount = 0;
   $('.sampleListTable_specimenId').each(function(){
       if ($(this).val() !== '') {
         sampleCount++
       }
   });
   return sampleCount;
}

function countOpenWells() {
   var openWells = 0;
   $('.well').each(function(){
       if ($(this).val() === '') {
         openWells++
       }
   });
   return openWells;
}


function checkIfExists(){
    var ajaxStep = "Ajax Is Container";
    var container = $('#trayId').val();
    var getData = {
        "stepName": ajaxStep,
        "inputId": container
    };

    $.getJSON("/uniflow?callback=?", getData).done( function(data, status) {
        $('#existingVal').val(data[0].isContainer);
    });

}

function useExistingParsley() {
    window.Parsley.addValidator('useExisting', {
        validateString: function(value) {
            if($('#existingVal').val() == 'YES'){
                return true
              }else{
                 return false
              }
        },
        messages: {
            en: 'Tray must exist.'
        }
    });
}
