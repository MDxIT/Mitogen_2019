$(document).ready( function() {	

	$('#sampleMin').change(function() {
	    minAllowed = $(this).val();
	    if(minAllowed < 1) {
	       alert("You must have at least one sample minimum.");
	    } 
	  });

  counterUpdates()
	
});

function counterUpdates(){
  $('#sampleListCounter').change(function(){
    if($(this).val() > $('#sampleMax').val() && $('#sampleMax').val() != 5000){
      $('.counter').val($('#sampleMax').val());
      $(this).val($('#sampleMax').val())
    }else{
      $('.counter').val($(this).val());
    }
    
  })
}