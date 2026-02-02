/**
 * Mitogen
 * JavaScript Normalize specific Functions
 * 
 * @author Wendy Goller
 * @copyright 2018 Sunquest Information Systems
 * @version 1.0.20180424
 */


/**
 * 
 * @param {string} tableName
 * @returns {boolean}
 */
function needCommentsHeader(tableName){
  var areDifferencesArray = $(tableName + ' tbody tr').map(function(){
    var tcalcSampleVol = $(this).children().children('.calcSampleVol').val();
    var tcalcDiluentVol = $(this).children().children('.calcDiluentVol').val();
    var tactSampleVol = $(this).children().children('.actSampleVol').val();
    var tactDiluentVol = $(this).children().children('.actDiluentVol').val();
    if(tcalcSampleVol != tactSampleVol || tcalcDiluentVol != tactDiluentVol){
      return 'Yes';
    } else {
      return 'No';
    }
  }).get();

  if(areDifferencesArray.indexOf('Yes') > -1){
    return true;
  } else {
    return false;
  }
}



/**
 * 
 * @param {string} theField
 * @param {string} tableName
 * 
 */
function displayCommentsCol(theField, tableName){
  var areDifferencesArray = needCommentsHeader(tableName);
  var calcSampleVol = $(theField).parent().parent().children().children('.calcSampleVol').val();
  var calcDiluentVol = $(theField).parent().parent().children().children('.calcDiluentVol').val();
  var actSampleVol = $(theField).parent().parent().children().children('.actSampleVol').val();
  var actDiluentVol = $(theField).parent().parent().children().children('.actDiluentVol').val();
  console.log('calcSampleVol != actSampleVol', calcSampleVol != actSampleVol)
  console.log('calcDiluentVol != actDiluentVol', calcDiluentVol != actDiluentVol)
  if(calcSampleVol != actSampleVol || calcDiluentVol != actDiluentVol){
     $(theField).parent().parent().children().children('.actComment').parent().show();
     $(theField).parent().parent().children().children('.actComment').attr('data-parsley-required', 'true');
     $('th:contains("Comment")').show();
  } else {
    if(areDifferencesArray){
        $('th:contains("Comment")').show();
    } else {
        $('th:contains("Comment")').hide();
    }
      $(theField).parent().parent().children().children('.actComment').hide();
      $(theField).parent().parent().children().children('.actComment').attr('data-parsley-required', 'false');

   }
}

/**
 * 
 * @param {string} theField
 * @param {string} tableName
 * 
 */
function displayFinalCalculations(theField, tableName){
  var areDifferencesArray = needCommentsHeader(tableName);
  var stockCon = $(theField).parent().parent().children().children('.stockCon').val();
  var calcSampleVol = $(theField).parent().parent().children().children('.calcSampleVol').val();
  var calcDiluentVol = $(theField).parent().parent().children().children('.calcDiluentVol').val();
  var actSampleVol = $(theField).parent().parent().children().children('.actSampleVol').val();
  var actDiluentVol = $(theField).parent().parent().children().children('.actDiluentVol').val();
  var calcFinalConcentration = $(theField).parent().parent().children().children('.calcFinalConcentration');
  var calcFinalVolume = $(theField).parent().parent().children().children('.calcFinalVolume');

  $(calcFinalConcentration).val(getFinalConcentration(stockCon, actSampleVol, actDiluentVol));
  $(calcFinalVolume).val(getFinalVolume(actSampleVol, actDiluentVol));

  if(calcSampleVol != actSampleVol || calcDiluentVol != actDiluentVol){
     $(theField).parent().parent().children().children('.calcFinalConcentration').parent().show();
     $(theField).parent().parent().children().children('.calcFinalVolume').parent().show();
     $('th:contains("Final")').show();

  } else {
    if(areDifferencesArray){
        $('th:contains("Final")').show();
    } else {
        $('th:contains("Final")').hide();
    }
     $(theField).parent().parent().children().children('.calcFinalConcentration').parent().hide();
     $(theField).parent().parent().children().children('.calcFinalVolume').parent().hide();

   }
}

/**
 * 
 * @param {string} theField
 * @param {string} tableName
 * @return {float}
 * 
 */
function getFinalConcentration(stock, stockVol, diluteVol){
  var combinedVol = getFinalVolume(stockVol,diluteVol);
  var newConcentration = Math.round( (stock * stockVol/combinedVol) * 10 ) / 10;
  return newConcentration;
}

/**
 * 
 * @param {float} theField
 * @param {float} tableName
 * @return {float}
 * 
 */
function getFinalVolume(vol1,vol2){
  return Math.round( (vol1*1 + vol2*1) * 10 ) / 10;
}

/**
 * 
 * 
 */
function noConcentrationCalulation(tableName){
  $(tableName + ' tbody tr').each(function(){
    var stockCon = parseFloat($(this).children().children('.stockCon').val());
    var targetCon = parseFloat($(this).children().children('.targetCon').val());
    var targetVol = parseFloat($(this).children().children('.targetVol').val());
    var calcSampleVol = $(this).children().children('.calcSampleVol');
    var calcDiluentVol = $(this).children().children('.calcDiluentVol');
    var actSampleVol = $(this).children().children('.actSampleVol');
    var actDiluentVol = $(this).children().children('.actDiluentVol');
    var calcFinalConcentration = $(this).children().children('.calcFinalConcentration');
    var calcFinalVolume = $(this).children().children('.calcFinalVolume');
    var newCalcSampleVol, newCalcDiluentVol;

    if(stockCon <= targetCon){
      
      $(calcSampleVol).val(targetVol);
      $(calcDiluentVol).val(0);
      $(actSampleVol).val(targetVol);
      $(actDiluentVol).val(0);
      $(calcFinalConcentration).val(getFinalConcentration(stockCon, targetVol, 0));
      $(calcFinalVolume).val(getFinalVolume(targetVol, 0));

    } else if(stockCon > targetCon){

      newCalcDiluentVol = Math.round( (targetVol - ((targetVol*targetCon)/stockCon)) * 10 ) / 10;
      newCalcSampleVol = Math.round( ((targetVol*targetCon)/stockCon) * 10 ) / 10;

      $(calcSampleVol).val(newCalcSampleVol);
      $(calcDiluentVol).val(newCalcDiluentVol);
      $(actSampleVol).val(newCalcSampleVol);
      $(actDiluentVol).val(newCalcDiluentVol);
      $(calcFinalConcentration).val(getFinalConcentration(stockCon, newCalcSampleVol, newCalcDiluentVol));
      $(calcFinalVolume).val(getFinalVolume(newCalcSampleVol, newCalcDiluentVol));
    }
  });
}

