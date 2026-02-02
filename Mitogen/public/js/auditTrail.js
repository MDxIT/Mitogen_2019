

$(document).ready(function() {
  convertOutputTableDateFormats('#auditTrailTable', $('#dateFormat').val() );

  // cleanup column 1
  var prevRow = '';
  var thisRow = '';
  var i = 0;
  var initialSampArray = {};

  $('.initialContainerId').each(function() {
    thisRow = $(this).text();

    if(thisRow == prevRow) {
      i = +i+1;
      initialSampArray[thisRow] = i;
    } else {
      i = 1;
      initialSampArray[thisRow] = i;
    }
    prevRow = thisRow;
  });


  i= 0;
  $.each(initialSampArray, function(key, value){
    i= i + value;
  });


});