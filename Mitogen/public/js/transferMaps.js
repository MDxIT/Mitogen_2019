/**
 * Frameshift
 * JavaScript Microarray specific Functions
 * 
 * @copyright 2018 Sunquest Information Systems
 * @version 1.0.20180216
 */
$(document).ready(function() { 
  plateTypeView(); 
  $('#validateForm0Only').hide(); 
  $('.viewSource').hide();
  $('#viewSource').click( function () {     
    $('.viewSource').toggle();
  });   
  $('#stepFormSubmitButton').click(function(ev){       
    var readyToSubmit = true;       
    ev.preventDefault();          
    if( $('#newPlate').val() === '' ) {         
      alert("A new plate name is required!  Please add a new plate name!");         
      readyToSubmit = false;        
    };           
    if (readyToSubmit === true) {        
      $('[name="stepForm"]').submit();      
    };   
  }); 
  prepAndPrintDiv('#printMe');
});

function plateTypeView() {
  if( $('#destinationType').val() === 'Plate' ){
    $('#destinationGrid').hide();
  }else{ 
    $('#destinationPlate').hide();
  }
}
function viewMasterMix() {
  $(".viewMasterMixTable").hide();
  $("#viewMasterMix").click(function(){
    $(".viewMasterMixTable").toggle()   
  }); 
}
function hideExcludedWells(){
  var excludedWells = $('#excludedWells').val();
  if( excludedWells !== ''){
    var excludedWellsArray = new Array()
    excludedWellsArray = excludedWells.split(',');
    console.log(excludedWellsArray);
    for (var i = 0; i < excludedWellsArray.length; i++) {
      $('.well').each(function() {
        if ($(this).attr('class').indexOf(excludedWellsArray[i]) > -1 ) {
          $(this).val('');
        }
      })
    }
  }  
}
function inputPlateMMData(currentStep,currentLoop) {
  console.log('currentStep: ', currentStep, 'currentLoop: ', currentLoop)
  var getData = {
    "stepName": 'AjaxGetTransferMapMMInfo',
    "currentStep": currentStep,
    "currentLoop": currentLoop
    };
  $.getJSON('uniflow?callback=?', getData).done(function(data) { 
     console.log(data);  
       var count = data.length;
       data.forEach(function (item, i) {
          var currentItem = item.position;
          var plateType = $('#destinationType').val()
          var plateName = $('.addMasterMix').parent().parent().parent().siblings('caption').html().replace(/\s/g, '')
          console.log($('.newPlate_' + currentItem))
          if (plateType === 'Plate'){
            if($('.addMasterMix[class*=' + currentItem + ']').val() !== ''){
              $('.addMasterMix[class*=' + currentItem + ']').parent().append('</br><span>' + item.mastermix + '</span>');
            }
          } else if (plateType === 'Grid') {
            if($('.' + plateName+ '_' + currentItem).val() !== ''){
              $('.' + plateName+ '_' + currentItem).parent().append('</br><span>' + item.mastermix + '</span>');
            }
          }
       });
  }).fail(function(jqxhr, textStatus, error) {
    var err = 'Request Failed: ' + textStatus + ', ' + error;
    console.log(err);
    alert(err);
  });
}


/**
 * 
 * 
 * @param {string} transferMap - desired transfer map to display
 * @param {string} clicked - element clicked
 * @param {boolean} useModal - wether to use the modal dialog or not.
 *  
 */
function viewMap(transferMap, clicked, useModal, currentStep, sourcePlate) {
  var runContent = 1;
  if(currentStep == 'Assign Transfer Maps'){
    runContent = 0;
  }
  var getData = {
    "stepName": 'AjaxGetTransferMapByName',
    "transferMap": transferMap,
    "sourcePlate": sourcePlate,
    "runContent": runContent
    };
  $.getJSON('uniflow?callback=?', getData).done(function(data) { 
  console.log(data);  
  var dialog = $('#mapPopUp').dialog({
    autoOpen: false,
    title: "View Map",
    modal: useModal,
    draggable: true,
    position: {
      my: "top top", at: "center bottom", of: clicked
    },
    close: function() {
      $('#mapPopUp').html('');
      dialog.dialog("close");
    }
    }); 

    var columns = [];
    var rows = [];
    var dataArray = [];
    var cType = data[0].type;
    data.forEach(function (item, i) {
      var currentItem = item.attribute;
      var cletters = currentItem.substring(0,currentItem.search(/\d/));
      var cnumbers = currentItem.substring(currentItem.search(/\d/));
      var cObject = {col: cnumbers, row: cletters, icontent: item.content, origAttribute: currentItem}
      if(rows.indexOf(cletters) == -1){
        rows.push(cletters);
      }
      if(columns.indexOf(cnumbers) == -1){
        columns.push(cnumbers);
      }
      dataArray.push(cObject);
    });

    columns.sort();
    rows.sort();

    function compare(a,b) {
      if (a.origAttribute < b.origAttribute ){
          return -1;
      }
      if (a.origAttribute > b.origAttribute ){
          return 1;
      }
      return 0;
    }

    dataArray.sort(compare);

    var generatedHtml = '<div id="dialog-form" title="View Transfer Map"><form style="margin-right: 20px;"><fieldset>';
    generatedHtml += '<table class="stdTable">';
    
    if(cType == 'Plate'){
      generatedHtml +='<thead><tr></th>';
      columns.forEach(function(item, i) {
        generatedHtml +='<th style="text-align: center;"">'+item+'</th>';
      });
      generatedHtml +='</tr></thead>';
    }
    generatedHtml +='<tbody>';
    rows.forEach(function(rowItem, i) {
      generatedHtml +='<tr style="background: rgb(236, 236, 236);">';
      if(cType == 'Plate'){
        generatedHtml +='<td style="border-right: 1px solid #d5d5d5; background: #ffffff">'+rowItem+'</td>';
      } 
      dataArray.forEach(function(rowItem1, j) {
        if((rowItem == rowItem1.row)){
          generatedHtml += '<td style="padding: 10px; border-right: 1px solid #d5d5d5;">'
//           <input type="text" readonly="" style="text-align: center; margin-left: auto; padding-left: 5px; padding-right: 5px;" value="';
          generatedHtml += rowItem1.icontent+ '</td>';
        }
      });
      generatedHtml +='</tr>';
    });
    generatedHtml +='</tbody></table></fieldset></form></div>';

    $('#mapPopUp').html(generatedHtml);
    $('#mapPopUp').focus();
    dialog.dialog('open');
    dialog.focus();
    $('.ui-dialog').css('width', 'auto');
  }).fail(function(jqxhr, textStatus, error) {
    var err = 'Request Failed: ' + textStatus + ', ' + error;
    console.log(err);
    alert(err);
  });
}

