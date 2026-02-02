/**

* (1) Based on selected Dilution Factor, solve for sample volume, diluent volume, and final concentration PER ROW.
* (2) If the calculated Sample Volume or Diluent Volume is below the Minimum Pipette Volume, an alert will be displayed for the user.
* (3) If the calculated Sample Volume AND Diluent Volume is above the Max Container Volume, an alert will be displayed for the user.
* (4) If the calculated Sample Volume is above the Source Sample Volume, an alert will be displayed for the user.
**/
function seriesdilutionRowCalculations (DF) {
  var finalConcentration = '';
  var initialConcentration = parseFloat( $('#initialConcentration').val());
  var initialVolume = parseFloat( $('#initialVolume').val());
  var minimumPipetteVolume = parseFloat( $('#minVolume').val());
  var maxVolume = parseFloat( $('#maxVolume').val());

  // SOLVING FOR SAMPLE VOLUME PER ROW. SampleVolume = min pipette volume
  sampleVolume = minimumPipetteVolume

  // SOLVING FOR FINAL VOLUME PER ROW
  finalConcentration = initialConcentration * (DF*1);

  // SOLVING FOR DILUENT VOLUME PER ROW
  diluentVolume = ((initialConcentration * sampleVolume) / (finalConcentration) - sampleVolume);

  totalTubeVolume = sampleVolume + diluentVolume

  if(initialVolume < sampleVolume){
    alert('The Source Sample Volume must be greater than the calculated Sample Volume.');
    $('#seriesDilutionTable tbody tr:last').find('.dilutionFactorSelect').val('');
    return {'sampleVolume':'','diluentVolume':'','finalConcentration':'','initialConcentration':''}
  }
  if(maxVolume < totalTubeVolume){
    alert('The Sample Volume and Diluent Volume cannot be greater than or equal to the Max Container Volume.');
    $('#seriesDilutionTable tbody tr:last').find('.dilutionFactorSelect').val('');
    return {'sampleVolume':'','diluentVolume':'','finalConcentration':'','initialConcentration':''}
  }
  if(diluentVolume < minimumPipetteVolume){
    alert( 'The Diluent Volume must be greater than or equal to the Minimum Pipette Volume.');
    $('#seriesDilutionTable tbody tr:last').find('.dilutionFactorSelect').val('');
    return {'sampleVolume':'','diluentVolume':'','finalConcentration':'','initialConcentration':''}
  }
  else{
    return {'sampleVolume':sampleVolume,'diluentVolume':diluentVolume,'finalConcentration':finalConcentration,'initialConcentration':initialConcentration }
  }

}
