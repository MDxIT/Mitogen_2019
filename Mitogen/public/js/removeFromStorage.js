/**
 * Routing configuration step JavaScript functionality
 * @author Wendy Goller
 * @version  1.0.0
 */


$(document).ready(function() {
  $('#hiddenSelects').hide();
  hideNextStep();
  $('.storedContainer').on('change', function(e) {
    $('.requestId').load('/uniflow',
      {stepName: 'Ajax Get RequestId By SpecimenId', specimenId: $('.storedContainer').val()
    });
  });

  $(".removeReasons").on("change", function() {
    // checkContainerOnQueue($(this));
    if($(this).val() == 'Sample Processing'){
      showNextStep();
      addEditNextStepOnClick($(this).parent().parent().find('.nextStep'))
    } else {
      hideNextStep();
      $(this).parent().parent().find('.nextStepSpan').html('')
    }
    $('#nextStepSpanHidden').val() == $(this).parent().parent().find('.nextStep')
  });

  $('#addEditNextStepDialogAccept').on('click', function(e) {
    let nextStepVal = $('.nextStepSpan').html();
    ;
  })

  $(".nextStepSpan").on('DOMSubtreeModified', function () {
    let nextStepVal = $('.nextStepSpan').html();
    $('#nextStepSpanHidden').val(nextStepVal);
  });

});

function hideNextStep() {
  $('.nextStep').parent().hide();
  $('#removeFromStorage > thead > tr > th:nth-child(3)').hide();
}

function showNextStep() {
  $('.nextStep').parent().show();
  $('#removeFromStorage > thead > tr > th:nth-child(3)').show();
}