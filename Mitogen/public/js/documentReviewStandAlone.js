
$(document).ready(function() {
  $("th:contains('Hidden')").addClass("hide");
  $(".hide").hide();
	if($('#docHere').val() === 'true'){
		$('#stepFormSubmitButton').remove();
	    $('#topNavigationBar').remove();
	    $('#menuLinks').remove();
	    $('.stepName').remove();
	    $('.step-div').css({
	    	'position':'relative',
			'top':'0px',
			'left':'0px'
		});
	    $('#instructionsDiv').next().remove();
	}
});
$(window).load(function(){

    convertOutputTableDateFormats( '#currentList', $('#dateFormat').val());

	if($('#sampleOrGroupContainerType').val() === 'Sample'){
		$('#containerId').parent().hide();
		$('[name = "containerId_RunCount"]').parent().hide();
		$('#containerId').val($('#currentRunId').val());
	} else if($('#currentContentType').val() === 'poolRunId'){
		$('#containerId').hide();
		$('#containerId').parent().append('<input type="text" name="containerIdDisplay" id="containerIdcontainerIdDisplay" readonly="" value="'+$('#currentContainerId').val()+'">');
		$('[name = "containerId_RunCount"]').parent().hide();
		$('#containerId').val($('#currentRunId').val());

	}
    
});