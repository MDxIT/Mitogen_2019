$(document).ready(function() {
	prepAndPrintDiv('#cultureDashboardDiv');
	convertOutputTableDateFormats('#cultureDashboard', $('#dateFormat').val());
  $('th:contains("Hidden")').addClass('hide');
  $('.hideColumn').parent().addClass('hide');
  $('.hide').hide();

  $('#cultureDashboard tbody tr').each( function() {
    let cultureAvailability = $(this).find('.completionStatus').val();
    if(cultureAvailability === 'notAvailable'){
    	$(this).find('.dashboardCheckbox').hide();
    } else {
    	$(this).find('.button').hide();
    }

  })

  $('.col9 >').click(function() {
    var checkbox = $(this).parent().siblings('.col0').children().show();
    var checkboxValue = $(this).parent().siblings('.col0').children().val('true');
    checkboxValue.prop('checked', true);
  });

  $('.dashboardCheckbox').on('click', function(){
    if($(this).is(':checked')){
      $(this).val('true');
      $(this).prop('checked', true);

    }
  })

 });

