$(document).ready( function() {
  $('.GRCh38Coordinate').each(function(){
    $(this).parent().append('<input type="button" value="Find Primers" onclick="findPrimers($(this))"/>');
  });
  $('.GRCh38Coordinate').change(function(){
    var grch38Input = $(this);
    console.log(grch38Input);
    console.log(grch38Input.val());
    grch38Validate(grch38Input);
  })
});

function radioFunction(checkbox){
  console.log(checkbox);
  $('.checkboxDivCheckbox').prop("checked",false);
  checkbox.prop("checked",true);
}

function grch38Validate(grch38Input){
  var grch38 = grch38Input.val();
  var grch37 = grch38Input.parents().siblings().children('.GRCh37Coordinate').val();
  console.log('validate' + grch37 + ' : ' + grch38);

  var chromosome38 = String(grch38.split(":", 1));
  var coordinateSet38 = grch38.substr(grch38.indexOf(":") + 1);
  var coordinate138 = parseInt(coordinateSet38.split("-", 1));
  console.log(coordinate138);
  var coordinate238 = parseInt(coordinateSet38.substr(coordinateSet38.indexOf("-") + 1));
  console.log(coordinate238);
  var coordinateDifference38 = coordinate238-coordinate138;
  console.log(coordinateDifference38);

  var chromosome37 = String(grch37.split(":", 1));
  var coordinateSet37 = grch37.substr(grch37.indexOf(":") + 1);
  var coordinate137 = parseInt(coordinateSet37.split("-", 1));
  var coordinate237 = parseInt(coordinateSet37.substr(coordinateSet37.indexOf("-") + 1));
  var coordinateDifference37 = coordinate237-coordinate137;
  console.log(coordinateDifference37);

  if (chromosome37 != chromosome38){
    alert('The GRCh38 primer coordinate must be for the same chromosome as the GRCh37 coordinate: ' + chromosome37);
    grch38Input.val('');
  }

  if (coordinateDifference38 != coordinateDifference37){
    alert('The GRCh38 primer coordinate must have the same base pair coverage as the GRCh37 coordinate: ' + coordinateDifference37);
    grch38Input.val('');
  }


}

function findPrimers(button){
  //Getting chromosome and coordinate data
  var grch38 = button.prev().val();
  console.log(grch38);
  var sampleId = button.parents().siblings().children('.sampleId').val();
  var gene = button.parents().siblings().children('.gene').val();
  var variant = button.parents().siblings().children('.variant').val();
  var chromosome = String(grch38.split(":", 1));
  var coordinateSet = grch38.substr(grch38.indexOf(":") + 1);
  var coordinate1 = parseInt(coordinateSet.split("-", 1));
  var coordinate2 = parseInt(coordinateSet.substr(coordinateSet.indexOf("-") + 1));
    console.log("chromosome: " + chromosome);
    console.log("coordinateSet: " + coordinateSet);
    console.log("coords:" + coordinate1 + " and " + coordinate2);

  var getData = {
    "stepName": "Ajax Get Matching Primer Table",
    "chromosome": chromosome,
    "coordinate1": coordinate1,
    "coordinate2": coordinate2
  };

  var primerData;
  var primerIdSelect;
  var primerInfoSelect;
  var title = "Primers for " + grch38;
  var generatedHtml = '<div id="dialog-form1"><form><fieldset>';
  if(grch38 == '') {
    alert('You must enter a coordinate for GRCh38.');
  } else {
    $.getJSON('uniflow?callback=?', getData)
    .done(function(data) {
      primerData = data;
      console.log(primerData);

      //Sample Info
      generatedHtml +='<div id="sampleInfo">Sample: ' + sampleId + '<br>Gene: ' + gene + '<br>Variant: ' + variant;

      if (data.length == 1){
        generatedHtml += '<p style="color:red">There are no matching primers in inventory.</p>'
      }
      // table of primers available to select for the row of the table.
      // Headers
      generatedHtml +='<table id="primerSelectTable" class="ui-widget ui-widget-content ">';
      generatedHtml +='<thead><tr class="ui-widget-header">';
      generatedHtml +='<th class="stdTh select">Select</th>';
      generatedHtml +='<th class="stdTh primer">Primer</th>';
      generatedHtml +='<th class="stdTh gene">Gene</th>';
      generatedHtml +='<th class="stdTh geneName">Gene Name</th>';
      generatedHtml +='<th class="stdTh primerInfo">Primer Info</th>';
      generatedHtml +='</tr></thead><tbody>';

      //Body

      primerData.forEach(function(item, i) {
        generatedHtml +='<tr class="row'+i+'">';
        generatedHtml +='<td class="checkboxDiv"> <input type="checkbox" class="checkboxDivCheckbox" onclick="radioFunction($(this))"></td>';
        generatedHtml +='<td class="primerIdSelect">'+ item.primer + '</td>';
        generatedHtml +='<td class="geneSelect">'+ item.gene + '</td>';
        generatedHtml +='<td class="geneNameSelect">'+ item.geneName + '</td>';
        generatedHtml +='<td class="primerInfoSelect">'+ item.primerInfo + '</td>';
        generatedHtml +='</tr>';
      });

      generatedHtml +='</tbody></table>';
      generatedHtml +='</fieldset></form></div>';

      $('#primerDialog').html(generatedHtml);

      var dialog = $('#primerDialog').dialog({
        autoOpen: false,
        title: title,
        modal: true,
        draggable: true,
        width: "920"
      });

      dialog.dialog("option", "buttons", {     
        Cancel: function(){
          $('#primerDialog').html('');
          dialog.dialog("close");
        },
        Ok: function(){

          var checkbox = $('.checkboxDivCheckbox:checkbox:checked');

          primerInfoSelect = checkbox.parent().siblings('.primerInfoSelect').html();
          primerIdSelect = checkbox.parent().siblings('.primerIdSelect').text();

          console.log(primerIdSelect);
          console.log(primerInfoSelect);

          console.log('button');
          console.log(button);

          button.parent().siblings('.col9').html(primerInfoSelect);
          button.parent().siblings().children('.primerId').val(primerIdSelect);
          button.parent().siblings().children('.primerId').text(primerIdSelect);
          button.parent().siblings().children('.primerId').html(primerIdSelect);

          $('#primerDialog').html('');
          dialog.dialog("close");

        } //Ok
      });

      dialog.dialog("open");

    });
  }



}