/*
 * Dependencies:
 *  listConfig.js
 *  sampleListUtils.js
 *
*/

$(document).ready(function() {

  var total;
  var maxAllowed = $('#sampleMax').val();
  var minAllowed = $('#sampleMin').val();

  valMinMax();

  $('#stepFormSubmitButton').hide();
  $('.poolTubeListTable_checkbox').on('change', function(){ 
    valMinMax();
  });


  if(maxAllowed == 5000) {
    $('#sampleMax').parent().hide();
    $('#sampleMax').parent().prev('.label').hide();
  }
  if(minAllowed == 0) {
    $('#sampleMin').hide();
    $('#sampleMin').parent().prev('.label').hide();
  }


  // Get config for pool tube list
  var config = getConfig('poolTubeList');


  $('#selectAll').click(function() {
      if($(this).prop('checked') == true) {
            
          $(`.${config.prefix}Table_checkbox`)
              .prop('checked', false)
              .each(function(i, item) {

                console.log('item', item)
                console.log('i', i)
                if(i < maxAllowed){
                  $(item).prop('checked', true).change();
                }
          });

          // Generate IDs and insert it to scan fields
          if(config.containerIdGen == 'Auto Generated' &&
              (config.validateOrTransfer !== 'Validate')) {
              var $scan = $(`.${config.prefix}Table_scan`);
              $scan.each(function(i, item) {
                if(i < maxAllowed){
                  getAndPlaceNextSequence(config.sequenceName, $(item), 'sequenceValue', function() { 
                     $scan.blur();
                  }); 
                }
              });
          }

      } else {
          $(`.${config.prefix}Table_checkbox`).prop('checked', false).change();
      }
  });



});//End Doc Ready

/*
  Validates that min is met and max is not exceeded. If either is true a message is displayed and submit button is hidden.
*/
function valMinMax() {
  var i = 0
  var minAllowed = $('#sampleMin').val();
  var maxAllowed = $('#sampleMax').val();

  $('.poolTubeListTable_checkbox').each(function(){
    if ($(this).is(':checked') === true) {
      i++
    }
  });
  total = i;  
  console.log(total + ' Total');
  $('.counter').val(total);

  if(total < parseFloat(minAllowed)){
    $('#poolTubeListMessages').children('div.minMessage').remove();
    $('#poolTubeListMessages').append('<div class="minMessage">You must select the minimum required samples for this Pool.</div>');
    $('#stepFormSubmitButton').hide();
  }else{
      $('#poolTubeListMessages').children('div.minMessage').remove();
      $('#stepFormSubmitButton').show();
  }

  if(total > parseFloat(maxAllowed)){

    $('#poolTubeListMessages').children('div.minMessage').remove();
    $('#poolTubeListMessages').children('div.maxMessage').remove();
    $('#poolTubeListMessages').append('<div class="maxMessage">Max number of samples has been exceeded.</div>');
    $('#stepFormSubmitButton').hide();

  }else {
      $('#poolTubeListMessages').children('div.maxMessage').remove();
  }

}
