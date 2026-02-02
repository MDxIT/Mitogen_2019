$(document).ready(function() {

	// Add client side validation with updated error message
	$('.poolTubeListTable_scan').attr('data-parsley-required', 'true');
	$('.poolTubeListTable_scan').attr('data-parsley-required-message', 'At least one sample is required');
	
	$('.well').change(function(){
		if(checkForSamples()){
			$('.poolTubeListTable_scan').attr('data-parsley-required', 'false');
		}else{
			$('.poolTubeListTable_scan').attr('data-parsley-required', 'true');
		}
	});

});

/* Returns true if there is atleast one sample select
 *
 * @return {boolean} - true if there is at least one sample on the tray
 */
function checkForSamples(){
	var count = 0
	$('.well').each(function(){
		if($(this).val() != ''){
			count++
		}
	});
	return count > 0;
}


