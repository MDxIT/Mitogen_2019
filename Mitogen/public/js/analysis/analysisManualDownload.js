$(document).ready( function() {
	
	$('#stepFormSubmitButton').remove();

  convertOutputTableDateFormats('#processBatch', $('#dateFormat').val());
// Makes checkboxes act like radio buttons
  $('.downloadBatchCheck').click( function() {
    var $this = $(this);

    $('.downloadBatchCheck').each( function() {
      $(this).prop('checked', false);
    });

    $this.prop('checked', true);
    $('#selectedContainer').val( $this.parents('td').siblings().children('.downloadBatchId').val() );
  });

/**
*  Stub for button which replaces submit, this is where the post will go once download functionality is added
**/
  $('#downloadBatch').click( function() {
    if (  $('#selectedContainer').val().trim() == '' ){
      createSimpleModal('modal', 'No ' + $('#screenLabel').val() + ' has been selected', 'No Selection');
    }

    else if (  $('#methodVerForTest').val().trim() == '' ){
      createSimpleModal('modal', 'No download template has been associated with this step.', 'No Template');
    }
    else {
      downloadFile( $('#selectedContainer').val(), $('#methodVerForTest').val() );
    }

  });


});

/**
 * Triggers form submit when true
 *
 * @function submitForm
 * @param {bool} submitOk
 */
function submitForm(submitOk) {
  if(submitOk) {
    $('form').off('submit');
    $('form').submit();
  }
}





function downloadFile(groupContainer, methodVerForTest) {

  let postObject = {
    stepName: 'Ajax Create Analysis File'
    ,Submit:true
    ,formNumber:0
    ,groupContainerString: groupContainer
    ,methodVersion: methodVerForTest
  }

  let returnValue = 'false';

  $.post('/uniflow', postObject)
  .done(function (jqxhr, statusText) {
    console.log('statusText', statusText);
    let postHtml = $.parseHTML(jqxhr);
    let postError = checkPostError(postHtml);
    if (postError !== false) {
      $('#errorMessage').html('');
      $('#errorMessage').html(postError);
      console.log(postError);
      submitOk = false;

    } else {

      let downloadURL = "/uniflow?stepName=Ajax Download Analysis File&groupContainerString="+groupContainer;

      var link = document.createElement('a');
      link.href = downloadURL;
      document.body.appendChild(link);
      link.click();

      setTimeout(function(){
        submitOk = true;
        submitForm(submitOk);
      }, 1000);

    }

  }).fail(function (jqxhr, textStatus, error) {
    let err = "Request Failed: " + textStatus + ", " + error;
    console.log(err);
    $('#errorMessage').html('');
    $('#errorMessage').html(err);
    submitOk = false;
  });

}
