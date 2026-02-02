
function displayData(groupContainerId) {
  window.open("/uniflow?stepName=View%20Sent%20Data&recId=" + groupContainerId + "&thisStep2=" + thisStep + "&groupingContainerLabel=" + groupingContainerLabel, "_self")
}

function sendToDI(groupContainerId, loadStep) {

    // Check if on queue
    var request = {
      stepName: 'Ajax Is On Queue',
      inputId: groupContainerId,
      thisStep: loadStep
    };

    $.getJSON('uniflow?', request).done( function(data) {

      if(data[0].onQueue == 'YES') {
        $('#errorMessage').children().remove();

        let postObject = {
          stepName: 'Ajax Post Send to DI'
          ,Submit:true
          ,formNumber:0
          ,groupContainerId: groupContainerId
          ,thisStep: loadStep
        }

        postSendToDI(postObject);
      } else {
        $('#errorMessage').children().remove();
        $('#errorMessage').append('<h3 class="errMsg">' + groupContainerId + ' container is not queued for this step.</h3>');
      }
    });
}

function postSendToDI(postObject) {

  let returnValue = 'false';
  $.post('/uniflow', postObject).done(function (jqxhr, statusText) {
    console.log('statusText', statusText);
    let postHtml = $.parseHTML(jqxhr);
    let postError = checkPostError(postHtml);
    console.log(postError);
    if (postError !== false) {
      $('#errorMessage').html('');
      $('#errorMessage').html(postError);
      console.log(postError);
      submitOk = false;
    } else {
      submitOk = true;
    }

  }).fail(function (jqxhr, textStatus, error) {
    let err = "Request Failed: " + textStatus + ", " + error;
    console.log(err);
    $('#errorMessage').html('');
    $('#errorMessage').html(err);
    submitOk = false;
  }).always(function(){submitForm(submitOk)});

}

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