$(document).ready(function() {

  var printIndicator;
  if($('#indicator').val() == 'PRINT ALL') {
    printIndicator = undefined;
  } else {
    printIndicator = '.' + $('#indicator').val() + 'Indicator';
  }

  prepAndPrintDiv('.printMe', printIndicator);

});

