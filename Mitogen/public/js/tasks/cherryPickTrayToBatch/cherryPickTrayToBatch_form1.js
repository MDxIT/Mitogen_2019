$(document).ready(function() {

    /*
      Inital count and display of min/max
    */
    countTotal();
    displayMinMax();
    /*
      Set batch Id to required
    */
    $('#batchId').addClass('required');
    $('#batchId').attr('data-parsley-required','true') 


}); //End Doc Ready

$(window).load(function() {
  let listName = getListName();
  let config = getConfig(listName);

  $('input#selectAll.selectAll').unbind( "click" );


  $('#selectAll').click(function() {
    console.log(this)
    if($(this).prop('checked') == true) {
      $(`.${config.prefix}Table_checkbox`).each(function(i, item) {
        console.log('i', i);
        console.log('item', item);
        let itemChecked = $(item).prop('checked')
        console.log('itemChecked', itemChecked);
        let currItemOrder = $(item).parent().siblings().children(`.${config.prefix}Table_order`)

        console.log('currItemOrder',currItemOrder)
        if(itemChecked === false){

          console.log($('#destType').val())
          let counterValue = $(`#${config.prefix}Counter`).val();
          if(! ($('#destType').val() === 'New' && ((counterValue*1) +1) > $('.maxSamples').val())){
            $(item).prop('checked', true);
            $(`#${config.prefix}Counter`).val((counterValue*1) + 1);
            orderSamples($(item), config);

            if(config.validateOrTransfer == 'Validate') {
                var specimenId = $elem.parent().siblings().find(`.${config.prefix}Table_${config.id}`).val();
                $(item).parent().siblings().find(`.${config.prefix}Table_scan`).val(specimenId);
            } else {
                // Generate IDs and insert it to scan field
                if(config.containerIdGen == 'Auto Generated') {
                    var $scan = $(item).parent().siblings().find(`.${config.prefix}Table_scan`);
                    getAndPlaceNextSequence(config.sequenceName, $scan, 'sequenceValue', function() {
                      enableActionAndComment($(item), true, config);
                    });
                }

            }

          }

        }

      });

      updateCounter(config)

    } else {
      $(`.${config.prefix}Table_checkbox`).prop('checked', false).change();
    }

  })

});

// Override function for one defined in sampleListUtils.js
function updateCounter(config) {
    let numberOfControls = $('.countControl').filter(function(i, item){
        if(item.value != ""){
            return item
        }
    })
    var num = ($(`#${config.prefix}Table .${config.prefix}Table_checkbox`).filter(function() { return $(this).is(':checked') }).length) + (numberOfControls.length) + ($('#previousBatchTable tbody tr').length);


    $(`#${config.prefix}Counter`).val(num);
    // trigger change for batch size validations
    $(`#${config.prefix}Counter`).change();

    $('.counter').val(num); // add the count for the batchcount match how many are in the batch
}

function countTotal() {
  var sampleNum = 0
  console.log('initial sampnum = ' + sampleNum);
  $('.sampleListTable_scan').each(function(){
    if ($(this).val() != '') {
      sampleNum++
      console.log('Number of samples ' + sampleNum);
    }
  });

  $('.counter').val(sampleNum);
}


function checkMax(currentElement){
    var max = $('.maxSamples').val();
    var total = $('.counter').val();

        console.log('Total: ' + total);
        console.log('Max: ' + max);

    if(parseFloat(total) > parseFloat(max)){

        $('#modalId').html('');
        $('#modalId').html('Maximum number of samples exceeded');
        var dialog = initCenterAlertModal('modalId','Maximum Alert',true,200,300, clearLast(currentElement));
        dialog.dialog('open');

    }

}

/*
  Hides min/max if build sheet defines them as Not Applicable
*/
function displayMinMax(){

    var maxAllowed = $('#sampleMax').val();
    var minAllowed = $('#sampleMin').val();

    if(maxAllowed == 5000) {
        $('#sampleMax').parent().hide();
        $('#sampleMax').parent().prev('.label').hide();
    }
    if(minAllowed == 0) {
        $('#sampleMin').hide();
        $('#sampleMin').parent().prev('.label').hide();
    }

}
/*
  Clears and focuses on element
*/
function clearLast(currentElement){

    $(currentElement).val('');
    $(currentElement).focus();
  $(currentElement).select();

}
/*
  Focuses on element
*/
function focusLast(currentElement){

    $(currentElement).focus();
  $(currentElement).select();

}


