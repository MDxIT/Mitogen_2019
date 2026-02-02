$(document).ready( function() {
  $('.component').change( function() {
    fillUnits( $(this), $(this).val() );
  });
  $('#reagentName').change( function() {
    fillInvUnits($(this).val());
  });
  if ($('#hasRecipe').val() == 'hide'){
    $('#saveRecipeDiv').hide();
  }
  var dateFormat = $('#dateFormat').val();
  convertOutputTableDateFormats('.formatDateTable', dateFormat);
});


$(function() { 
  //printBarcode('reagent', ['#reagentName', '#expDate']);
  $('#printDocument').hide();
  printBarcode('reagent');
});

function fillInvUnits(reagentType){
    $.getJSON('/uniflow?callback=?&stepName=Ajax+Get+Reagent+Inventory+Units&inventoryType='+ reagentType,{},
   function(data,status) 
   {  
        $('#units').val(data[0].units);          
   }); 
}
function fillUnits(cell, reagentId) {
    $.getJSON('/uniflow?callback=?&stepName=Ajax+Get+Reagent+Units&reagentId='+ reagentId,{},
   function(data,status) 
   {  
        var units = data[0].unitOfMeasure; 
        cell.parent().siblings().children('.units').val(units);           
   });   
 }  
