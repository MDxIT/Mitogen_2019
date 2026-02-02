// $(function() { $('#stepFormSubmitButton').hide(); });

$(document).ready(function() {
	var stepName = $('[name="stepName"]').val();
	var formNumber = $('[name="formNumber"]').val();

	if(stepName === 'View Task Instructions' || (stepName === 'Manage Task Instructions' && formNumber == 0)){
		$('#stepFormSubmitButton').hide();

	} else if(stepName === 'Manage Task Instructions' && formNumber == 1){
		$('.updateInstruction').change(function() {
		var row = $(this).closest('tr');
		var inst = $('td:eq(2)', row).children().filter('textarea');
		var displayOrder = $('td:eq(3)', row).children().filter('select');
		var formNum = $('td:eq(4)', row).children().filter('select');
		var remove = $('td:eq(6)', row).children().filter('input');

		if ($(this).prop('checked')) {
		  inst.prop('readonly',false);
		  remove.prop('checked',false);
		  displayOrder.prev('span').hide();
		  displayOrder.show();
		  formNum.prev('span').hide();
		  formNum.show();
		}
		else {
		  inst.prop('readonly',true);
		  
		  displayOrder.hide();
		  if (displayOrder.prev('span').length > 0) {
		    displayOrder.prev('span').show();
		  }
		  else {
		    displayOrder.before('<span>' + displayOrder.val() + '</span>');
		    displayOrder.parent().attr("data-order", displayOrder.val());
		  }
		  
		  formNum.hide();
		  if (formNum.prev('span').length > 0) {
		    formNum.prev('span').show();
		  }
		  else {
		    formNum.before('<span>' + formNum.val() + '</span>');
		    formNum.parent().attr("data-order", formNum.val());
		  }
		}
		}).trigger('change');

		$('.removeInstruction').change(function() {
		var row = $(this).closest('tr');
		var update = $('td:eq(0)', row).children().filter('input');

		if ($(this).prop('checked')) {
		  update.prop('checked',false).trigger('change');
		}
		});

		stdTableSort('#instructionsTable');

	} else if(stepName === 'Add Task Instructions'){
		preventReturnOnInput();
	}
});