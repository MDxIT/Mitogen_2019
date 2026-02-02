$(document).ready( function() {

  $( document ).tooltip();

  $('#reagentName').change( function() {
    fillByItem($(this).val());
  });
  $('.copyCheckbox').change( function() {
    copyDown($(this).attr('name'),$(this).prop('checked'));
  });
  $('.catNo').change( function() {
    fillTable($(this).val(), $(this).attr('name'));
  });
  $('.item').change( function() {
    fillTableByItem($(this).val(), $(this).attr('name'));
  });
  $('#catNo').change( function() {
    fillByCatalog($(this).val());
  });
  var dateFormat = $('#dateFormat').val();
  convertOutputTableDateFormats('.formatDateTable', dateFormat);
});


function copyDown(cellName, checked) {
  var array = cellName.split("_");
  var name = array[0];
  var row = array[1];
  var nextrow = 0;
  nextrow = parseInt(parseInt(row) + 1);

  if(checked == true) {
         for(var i = 3; i < 17; i++)
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
        console.log(data);

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



        $('#reagentName option:selected').text(item);
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



        $('#reagentName option:selected').text(item);
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