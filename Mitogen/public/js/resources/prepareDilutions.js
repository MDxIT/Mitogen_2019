$(document).ready( function() {
  $('.diluent').change( function() {
    fillUnits($(this).attr('name'), $(this).val());
  });
  var dateFormat = $('#dateFormat').val();
  convertOutputTableDateFormats('.formatDateTable', dateFormat);
});

function fillUnits(cellName, reagentId) {
  $.getJSON('/uniflow?callback=?&stepName=Ajax+Get+Reagent+Units&reagentId='+ reagentId,{},
    function(data,status) 
    {  
      var units = data[0].unitOfMeasure; 
      $('[name^='+cellName+']').parent().siblings().children('.units').val(units);           
    });   
} 