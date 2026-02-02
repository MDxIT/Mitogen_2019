function addSampleToTable(checkedBox){
  var sample = $(checkedBox).parent().siblings('td').find('.availPoolSampSampleId').val();
  var plate = $(checkedBox).parent().siblings('td').find('.availPoolSampPlateId').val();
  var well = $(checkedBox).parent().siblings('td.col3').html();
  var adaptor = $(checkedBox).parent().siblings('td.col4').html();
  var adaptor2 = $(checkedBox).parent().siblings('td.col5').html();
  var adaptorCombo = adaptor+adaptor2;
  var concentration = $(checkedBox).parent().siblings('td.col6').html();
  var tube = $(checkedBox).parent().siblings('td').find('.availPoolSampTube');
  var diluteFac = 10 * concentration;
  var volNeeded = 500/diluteFac;
  var panel = $(checkedBox).parent().siblings('td.col7').html();
  var adaptorsObj = {adaptor1:adaptor, adaptor2:adaptor2};
  var panelArray = [];
  var availPoolSampLeng = $('#availPoolSamp :checked').length;
  var adaptorArray = [];
  var combinationAdaptorArray = [];
  var nextEmptyRow = 0;
  var numEmptyRows = 0;
  var panelMisMatch = false;
  var adaptor2MisMatch = false;
  var outputTypeVal = $('#outputType').val();

  if ($(checkedBox).is(':checked') === true) {
    $('#poolSamples tbody tr').each(function( key, value ){
      if($(value).find('.poolSamplesPanel').val().length > 0){
        var myPanel = $(value).find('.poolSamplesPanel').val();
        if(myPanel != panel) {
          panelMisMatch = true;
        } 
      }
      if($(value).find('.poolSamplesAdaptor2').val().length > 0){
        var myAdaptor2 = $(value).find('.poolSamplesAdaptor2').val();
        if(myAdaptor2 != adaptor2) {
          adaptor2MisMatch = true;
        } 
      }
      if($(value).find('.poolSamplesAdaptor1').val().length > 0){
        var currentAdaptorCombo = $(value).find('.poolSamplesAdaptor1').val();
        if($(value).find('.poolSamplesAdaptor2').val().length > 0){
          currentAdaptorCombo = currentAdaptorCombo + $(value).find('.poolSamplesAdaptor2').val();
        }
        combinationAdaptorArray.push(currentAdaptorCombo);
      } else {
        numEmptyRows++;
      }
    });
    nextEmptyRow = (outputTypeVal - 1) - numEmptyRows;
    if(availPoolSampLeng > (outputTypeVal - 1)){
      alert('No more samples can be added to this pool tube. Please submit the current tube and add the samples to a new pool tube.');
        $(checkedBox).attr('checked',false);
      } 
    
    if(combinationAdaptorArray.indexOf(adaptorCombo) != -1){
      alert(adaptor + ' and '+ adaptor2 + ' adaptor combination has already been selected. Please select a different sample.');   
      $(checkedBox).attr('checked',false);
    } else if(adaptor2MisMatch){
       alert(adaptor2 + ' does not match the other adaptor 2 in this pool tube. Please select a different sample.');   
       $(checkedBox).attr('checked',false); 
/*     } else if(panelMisMatch){
       alert(panel + ' does not match other panels in this pool tube please select a different sample');   
       $(checkedBox).attr('checked',false); */
    } else {
      $('#poolSamples tbody tr').each(function( key, value ){
        if(key === nextEmptyRow){
          $(value).find('.poolSamplesSample').val(sample);
          $(value).find('.poolSamplesWell').val(well);
          $(value).find('.poolSamplesPanel').val(panel);
          $(value).find('.poolSamplesPlate').val(plate);
          $(value).find('.poolSamplesAdaptor1').val(adaptor);
          $(value).find('.poolSamplesAdaptor2').val(adaptor2);
          $(value).find('.poolSamplesConcentration').val(concentration);
          $(value).find('.poolSamplesDilutionFac').val(diluteFac);
          $(value).find('.poolSamplesVolNeeded').val(volNeeded);
          $(value).find('.poolSamplesTube').val(tube);
          adaptorArray.push({adaptor1:adaptor, adaptor2:adaptor2});
        } 
      });
    }
  } else {
    $('#poolSamples tbody tr').each(function( key, value ){
      if(sample === $(this).find('.poolSamplesSample').val() && adaptor === $(this).find('.poolSamplesAdaptor1').val() && adaptor2 === $(this).find('.poolSamplesAdaptor2').val()){

        $(this).find('.poolSamplesSample').val('');
        $(this).find('.poolSamplesWell').val('');
        $(this).find('.poolSamplesPanel').val('');
        $(this).find('.poolSamplesAdaptor1').val('');

        $(this).find('.poolSamplesAdaptor2').val('');
        $(this).find('.poolSamplesConcentration').val('');
        $(this).find('.poolSamplesDilutionFac').val('');
        $(this).find('.poolSamplesVolNeeded').val('');
        $(this).find('.poolSamplesPlate').val('');
          $(value).find('.poolSamplesTube').val('');
      } 
    });
    $('#poolSamples tbody tr').each(function( key, value ){
      if($(value).find('.poolSamplesAdaptor1').val().length > 0){
        var myObj = {};
        myObj['sample'] = $(value).find('.poolSamplesSample').val();
        myObj['well'] = $(value).find('.poolSamplesWell').val();
        myObj['panel'] = $(value).find('.poolSamplesPanel').val();
        myObj['adaptor'] = $(value).find('.poolSamplesAdaptor1').val();

        myObj['adaptor2'] = $(value).find('.poolSamplesAdaptor2').val();
        myObj['concentration'] = $(value).find('.poolSamplesConcentration').val();
        myObj['dilutFac'] = $(value).find('.poolSamplesDilutionFac').val();
        myObj['volNeed'] = $(value).find('.poolSamplesVolNeeded').val();
        myObj['plate'] = $(value).find('.poolSamplesPlate').val();
        myObj['tube'] = $(value).find('.poolSamplesTube').val();
        adaptorArray.push(myObj);
      } 
    });
    $('#poolSamples tbody tr').each(function( key2, value2 ){
      if(key2 < adaptorArray.length){
        $(this).find('.poolSamplesSample').val(adaptorArray[key2].sample);
        $(this).find('.poolSamplesWell').val(adaptorArray[key2].well);
        $(this).find('.poolSamplesPanel').val(adaptorArray[key2].panel);
        $(this).find('.poolSamplesAdaptor1').val(adaptorArray[key2].adaptor);

        $(this).find('.poolSamplesAdaptor2').val(adaptorArray[key2].adaptor2);
        $(this).find('.poolSamplesConcentration').val(adaptorArray[key2].concentration);
        $(this).find('.poolSamplesDilutionFac').val(adaptorArray[key2].dilutFac);
        $(this).find('.poolSamplesVolNeeded').val(adaptorArray[key2].volNeed);
        $(this).find('.poolSamplesPlate').val(adaptorArray[key2].plate);
        $(this).find('.poolSamplesTube').val(adaptorArray[key2].tube);

      } else {
        $(this).find('.poolSamplesAdaptor1').val('');
        $(this).find('.poolSamplesSample').val('');
        $(this).find('.poolSamplesWell').val('');
        $(this).find('.poolSamplesPanel').val('');

        $(this).find('.poolSamplesAdaptor2').val('');
        $(this).find('.poolSamplesConcentration').val('');
        $(this).find('.poolSamplesDilutionFac').val('');
        $(this).find('.poolSamplesVolNeeded').val('');
        $(this).find('.poolSamplesPlate').val('');
        $(this).find('.poolSamplesTube').val('');
      }
    });
  }
}

$(document).ready(function(){
  $('.availPoolSampCheckbox').click(function(){
     addSampleToTable(this);
  });
  $('.poolSamplesCkbox').click(function(){
     removeSample(this);
  });

});