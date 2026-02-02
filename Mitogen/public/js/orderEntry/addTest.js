$(function() {
  var submitName = 'Add Test'
  $("#stepFormSubmitButton").val(submitName).hide();
  $('.selectOrder').on('change', function() {
  	var checked = 'false'
    $('.selectOrder').not(this).prop('checked', false); 
    $('.selectOrder').each(function(){
      if( $(this).prop("checked") == true){
      	checked = 'true'     	
      }	
    })
    if ( checked === 'true'){
		$("#stepFormSubmitButton").show();
    } else {
    	$("#stepFormSubmitButton").hide();
    }

  }); 
  hideColumns('#orderTable', 'hideColumn');

  $('#stepFormSubmitButton').click(function(e){
    e.preventDefault();
    var submitOk = true;
    if(submitOk === true) {
        console.log('submitOk triggered')
          $('form').parsley().validate();
          if($('form').parsley().isValid()) {
              $(':checkbox').removeAttr('disabled');
              $('select').removeAttr('disabled');
              $('#stepFormSubmitButton').unbind('click').click();
              return true;
          }
      }

  });
});
