/**
 * Handle welcome page
 */
$(function() {
	$('#stepFormSubmitButton').prop('disabled', true).hide();
	
	if ($('#requirePasswordChange').val().indexOf('chpwd') !== -1) {
		var chpwdURL = getUrlPath() 
			+ "?stepName=" + encodeURIComponent('Change Your Password') 
			+ "&userStepGroups=" + encodeURIComponent('Users')
			+ "&updateStepGroups=" + encodeURIComponent('true');
		
		window.location.replace(chpwdURL);
	}
});
