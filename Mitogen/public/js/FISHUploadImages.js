$(document).ready(function() {
  $('#keepOnQueue').on('change', function(){
    // In utilities
    checkForParsley($(this), '#selectedProbe');
    checkForParsley($(this), '#slideNameSlideLabel');
  })

  $('#selectedProbe').on('change', function(){
    var selectedProbe = $(this).val();
    var request = {
      stepName: 'ajaxGetSlideNameCellLabelbyProbes',
      selectedProbe: selectedProbe,
      runId: $('#runId').val()
  };

  $.getJSON('uniflow?', request).done(function (data) {
      var optionsArr = $.map(data ,function(option) {
        return '<option value="'+ option.fishCaseResultsId +'">' + option.slideNameSlideLabel + '</option>';
      });
      $('#slideNameSlideLabel').empty();
      $('#slideNameSlideLabel').append('<option value=""></option>');
      $('#slideNameSlideLabel').append(optionsArr.join(','));
      $('#slideNameSlideLabel').val('<option value=""></option>');
    });
  });

 });