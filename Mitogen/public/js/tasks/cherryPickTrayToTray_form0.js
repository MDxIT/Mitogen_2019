$(document).ready( function() {
  var blank = '';
  $('.scanDestination').val(blank);
  $('#groupingContainerId').attr('data-parsley-required','true') 
  $('.hideTrayOptions').hide();
  $('.destinationType').val(blank);
  $('.destinationType').change(function() {
    if( $('.destinationType').val() == '' ){
      $('.hideTrayOptions').hide();
      $('.trayOption').val('');
    }else if( $('.destinationType').val() == 'Existing' ){
      $('#existingTray').show();
      $('.existingTrayOption').attr('data-parsley-required','true');
    }else{
      $('#existingTray').hide();
      $('.existingTrayOption').val('');
      $('.existingTrayOption').attr('data-parsley-required','false');
    }  
  });

  $(document).on('click', '.containerLink', function(e) {
    e.preventDefault();   
    $('#groupingContainerId').val($(this).html())  
    if($('.destinationType').val() === 'Existing'){
      submit_existing();
    } else{
      $('[name="stepForm"]').submit();
    }  
  });

  $('#stepFormSubmitButton').on('click', function(e){
    e.preventDefault();
    if($('.destinationType').val() === 'Existing'){
      submit_existing();
    } else{
      $('[name="stepForm"]').submit();
    }         
  });
});

function submit_existing(){
  return totalCells($('.scanDestination').val()).then(function(data){
    filledCells($('.scanDestination').val()).then(function(data){
      $('[name="stepForm"]').submit();
    });
  }, function(reason){
    console.log('ERROR: ', reason)
  });
}

function filledCells(destinationTray){
  return $.getJSON('/uniflow?callback=?&stepName=Ajax+Get+Filled+Cells&destinationTray=' + destinationTray,{},
    function(data,status) {
      $('#filledCells').val(data[0].filledCells);
    }
  );
}

function totalCells(destinationTray){
  return $.getJSON('/uniflow?callback=?&stepName=Ajax+Get+Total+Wells&destination=' + destinationTray,{},
    function(data,status){
      $('#cellNumber').val(data[0].totalWells);
    }
  );
}

