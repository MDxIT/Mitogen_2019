$(document).ready(function() {

  $('.copyCheckbox').change(function() {
    copyDown($(this).attr('name'),$(this).prop('checked'));
  });

  $('.catNo').blur(function() {
    fillTable($(this).val(), $(this).attr('name'));
  });

  $('.item').blur(function() {
    fillTableByItem($(this).val(), $(this).attr('name'));
  });

});


function copyDown(cellName, checked) {
  var array = cellName.split("_");
  var name = array[0];
  var row = array[1];
  var nextrow = 0;
  var nexnextrow = 0;

  nextrow = parseInt(parseInt(row) + 1);
  nexnextrow = parseInt(parseInt(nextrow) + 1);

  if(checked == true) {
    for(var i = 3; i < 12; i++)
    { $('[name^='+name+'_'+nextrow+'_'+i+ ']').val($('[name^='+name+'_'+row+'_' +i+ ']').val()); }
  }

  if(checked == false) {
    for(var i = 3; i < 12; i++)
      {
          if(i == 6){
              console.log("here");
              $('[name^='+name+'_'+nextrow+'_' +i+']').val('0.00');
          }
          else if (i==8 || i == 11){
              $('[name^='+name+'_'+nextrow+'_' +i+']').val($('[name^='+name+'_'+row+'_' +i+ ']').val());
          }
          else if (i==9) {
              $('[name^='+name+'_'+nextrow+'_' +i+']').val($('[name^='+name+'_'+nexnextrow+'_' +i+ ']').val());
          }
          else {
              $('[name^='+name+'_'+nextrow+'_' +i+']').val('');
          }

      }
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
    function(data,status) {
      catNo = data[0].catNo;
      category = data[0].type;
      units = data[0].units;
      $('[name^='+cellName+']').parent().siblings().children('.catNo').val(catNo);
      $('[name^='+cellName+']').parent().siblings().children('.category').val(category);
      $('[name^='+cellName+']').parent().siblings().children('.units').val(units);
  });

  $.getJSON('/uniflow?callback=?&stepName=Ajax+Get+Cost+Per+Unit+By+Item&item='+ item,{},
    function(data,status) {
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
    function(data,status) {
      item = data[0].item;
      category = data[0].type;
      units = data[0].units;
      $('[name^='+cellName+']').parent().siblings().children('.item').val(item);
      $('[name^='+cellName+']').parent().siblings().children('.category').val(category);
      $('[name^='+cellName+']').parent().siblings().children('.units').val(units);
   });

  $.getJSON('/uniflow?callback=?&stepName=Ajax+Get+Cost+Per+Unit&catNo='+ catNo,{},
    function(data,status) {
      cost = data[0].cost;
      $('[name^='+cellName+']').parent().siblings().children('.cost').val(cost);
   });
 }