/**
 * Frameshift
 * JavaScript Luminex specific Functions
 * 
 * @author Wendy Goller
 * @copyright 2017 Sunquest Information Systems
 * @version 1.0.20180308
 */



function getSNPResultsBySample(trigger) {
  var sampleSelectedId = trigger.val();
  if (sampleSelectedId == '') {
    $('#selectedSampleId').val('');
    $('#selectedSampleName').val('');
    $('#reportSelectTable .geneCall').val('');
    $('#reportSelectTable .sampleId').val('');
    return false;
  }

  //table row to object functionality from : https://stackoverflow.com/questions/42790612/convert-html-table-to-array-javascript*/
  var rows = [].slice.call($('#rawResults')[0].rows);
  var keys = [].map.call(rows.shift().cells, function(e) {
    return e.textContent.replace(/\s/g, '');
  });

  // returns an array of objects built from the table
  var snpRawResObjArr = rows.map(function(row) {
    return [].reduce.call(row.cells, function(o, e, i) {
      o[keys[i]] = e.textContent;
      return o;
    }, {})
  });

  // loop through each object in the array
  $.each( snpRawResObjArr, function( key, value ) {
    console.log('myVal', value.specimenId)
    //If the specimenId in the object of the array equals the trigger field Id
    if(value.specimenId == sampleSelectedId){
      // loop through the bottom table 
      $('#reportSelectTable tbody tr').each(function(){
        console.log('row:', $(this).children().find('.gene').val());
        // if the gene column matches the the geneotype in the top table then add the correct values to the row
        if($(this).children().find('.gene').val() == value.Geneotype){
          $(this).children().find('.geneCall').val(value.Call);
          $(this).children().find('.phenotype').val(''); // clear the phenotype field to prevent old phenotype from displaying when specimenId is selected. 
          $(this).children().find('.snpRawResultId').val(value.snpRowId);
          $(this).children().find('.sampleId').val(value.SampleName);
        }
      });
    }
  });

}