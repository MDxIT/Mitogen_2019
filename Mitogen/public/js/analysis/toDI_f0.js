
var thisStep;
var groupingContainerLabel;
$(document).ready(function() {

    convertOutputTableDateFormats('#groupingContainersToDI', $('#dateFormat').val());

    thisStep = $('#stepName').val();
    groupingContainerLabel = $('#groupingContainerLabel').val();

    convertOutputTableDateFormats('#groupingContainersToDI', $('#dateFormat').val());

    $('.col5').append('<input type="button" class="button displayData" value="Display Data">');
    $('.col6').append('<input type="button" class="button sendToDI" value="Send to DI">');

    $('#stepFormSubmitButton').remove();

    $('.col5 .displayData').click(function() {
      var groupContainerId = $(this).parent().siblings('.col0').text();
      displayData(groupContainerId);
    });
    $('.col6 .sendToDI').click(function() {
      var groupContainerId = $(this).parent().siblings('.col0').text();
      sendToDI(groupContainerId, thisStep);
    });

});
