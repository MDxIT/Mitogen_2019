$(document).ready(function() {
  $('.receiveMultipleControlsCopyCheckbox').change(function(){
    copyDown($(this).attr('name'),$(this).prop('checked'));
  });

  $('.receiveMultipleControlsBarcode').blur(function(){
    setTableId($(this).attr('name'));
  });

  $('.catNo').blur(function(){
    fillTable($(this).val(), $(this).attr('name'));
  });

  $('.item').blur(function(){
    fillTableByItem($(this).val(), $(this).attr('name'));
  });

  $('.receiveSingleControlType').change(function(){
    fillByItem($(this).val());
  });

  $('.receiveSingleControlCatNo').change(function(){
    fillByCatalog($(this).val());
  });

  $('.createControlName').change(function(){
    fillInvUnits($(this).val());
  });

  $('.createControlComponentResource').change(function(){
    fillUnits($(this).attr('name'), $(this).val());
  });

  $('.diluteControlResource').change(function(){
    fillUnits($(this).attr('name'), $(this).val());
  });

  $('#infoTabs').tabs();
});


function copyDown(cellName, checked) {
 var array = cellName.split("_");
 var name = array[0];
 var row = array[1];
 var nextrow = 0;
 nextrow = parseInt(parseInt(row) + 1);

 if(checked == true) {

        for(var i = 3; i < 15; i++)
        { $('[name^='+name+'_'+nextrow+'_'+i+ ']').val($('[name^='+name+'_'+row+'_' +i+ ']').val()); }

   }   
 
 if(checked == false) {

        for(var i = 3; i < 17; i++)
        {  $('[name^='+name+'_'+nextrow+'_' +i+']').val(''); } 
  }
} 


function fillTableByItem(itemName, name){

   var catNo;
   var cellName = name;
   var item = itemName;
   var category;
   var units;
   var cost;

   
   $.getJSON('/uniflow?callback=?&stepName=Ajax+Load+Inventory+Attributes+By+Item&item='+ item,{},
  function(data,status) 
  {  
       
        
     catNo = data[0].catNo;
     category = data[0].type;
     units = data[0].units; 



       $('[name^='+cellName+']').parent().siblings().children('.catNo').val(catNo);
       $('[name^='+cellName+']').parent().siblings().children('.category').val(category);
       $('[name^='+cellName+']').parent().siblings().children('.units').val(units);            

  });

   $.getJSON('/uniflow?callback=?&stepName=Ajax+Get+Cost+Per+Unit+By+Item&item='+ item,{},
  function(data,status) 
  {  
       cost = data[0].cost; 
       $('[name^='+cellName+']').parent().siblings().children('.cost').val(cost);           
  });  

}


function fillTable(catalogNo, name){

   var catNo = catalogNo;
   var cellName = name;
   var item;
   var category;
   var units;
   
   
   $.getJSON('/uniflow?callback=?&stepName=Ajax+Load+Inventory+Attributes&catNo='+ catNo,{},
  function(data,status) 
  {  
       
        
     item = data[0].item;
     category = data[0].type;
     units = data[0].units;


       $('[name^='+cellName+']').parent().siblings().children('.item').val(item);
       $('[name^='+cellName+']').parent().siblings().children('.category').val(category);    
       $('[name^='+cellName+']').parent().siblings().children('.units').val(units);                           

  });  
   $.getJSON('/uniflow?callback=?&stepName=Ajax+Get+Cost+Per+Unit&catNo='+ catNo,{},
  function(data,status) 
  {  
       cost = data[0].cost; 
       $('[name^='+cellName+']').parent().siblings().children('.cost').val(cost);           
  });          
}


function fillByCatalog(catalogNo){

   var catNo = catalogNo;
   var item;
   var vendor;
   var units;
   var cost;

   
   $.getJSON('/uniflow?callback=?&stepName=Ajax+Load+Inventory+Attributes&catNo='+ catNo,{},
  function(data,status) 
  {  
       
        
     item = data[0].item;
     vendor = data[0].vendor;
     units = data[0].units; 



       $('#type option:selected').text(item);
       $('#vendor option:selected').text(vendor);
       $('#units').val(units);             

  });

   $.getJSON('/uniflow?callback=?&stepName=Ajax+Get+Cost+Per+Unit&catNo='+ catNo,{},
  function(data,status) 
  {  
       cost = data[0].cost; 
       $('#cost').val(cost);           
  });  
}           


function fillByItem(itemName){

   var catNo;
   var item = itemName;
   var vendor;
   var units;
   var cost;

   
   $.getJSON('/uniflow?callback=?&stepName=Ajax+Load+Inventory+Attributes+By+Item&item='+ item,{},
  function(data,status) 
  {  
       
        
     catNo = data[0].catNo;
     vendor = data[0].vendor;
     units = data[0].units; 



       $('#catNo').val(catNo);
       $('#vendor option:selected').text(vendor);
       $('#units').val(units);            

  });

   $.getJSON('/uniflow?callback=?&stepName=Ajax+Get+Cost+Per+Unit+By+Item&item='+ item,{},
  function(data,status) 
  {  
       cost = data[0].cost; 
       $('#cost').val(cost);           
  });  
} 


function fillInvUnits(controlType){
   $.getJSON('/uniflow?callback=?&stepName=Ajax+Get+Control+Inventory+Units&inventoryType='+ controlType,{},
  function(data,status) 
  {  
       $('#units').val(data[0].units);          
  }); 
}


function fillUnits(cellName, controlId) {
   $.getJSON('/uniflow?callback=?&stepName=Ajax+Get+Control+Units&controlId='+ controlId,{},
  function(data,status) 
  {  
       var units = data[0].unitOfMeasure; 
       $('[name^='+cellName+']').parent().siblings().children('.units').val(units);           

  });
}


function fillUnits(cellName, controlId) {
   $.getJSON('/uniflow?callback=?&stepName=Ajax+Get+Control+Units&controlId='+ controlId,{},
  function(data,status)
  {
       var units = data[0].unitOfMeasure;
       $('[name^='+cellName+']').parent().siblings().children('.units').val(units);
  });
}         


