
// form 1 of FISHAnalysis.ixml


bkLib.onDomLoaded(function() {
  let microDescEditor = new nicEditor();
  microDescEditor.setPanel('fancyTextPanel3');
  microDescEditor.addInstance('fancyFishInterp');
  microDescEditor.setPanel('fancyTextPanel4');
  microDescEditor.addInstance('fancyFishComment');
  microDescEditor.setPanel('fancyTextPanel5');
  microDescEditor.addInstance('fancyAmendCorrectComment');
  });


function getSelectedText() {
  if (window.getSelection) {
    return window.getSelection();
  } else if (document.selection) {
      return document.selection.createRange().text;
    }
  	return '';
}


$(document).ready(function() {
  if($('input[name="formNumber"]').val() === '1' ){
	 $('.stepName').hide();

  };
  $('#fancyFishInterp').attr('contenteditable', true);
  $('#fancyFishComment').attr('contenteditable', true);
  $('#fancyAmendCorrectComment').attr('contenteditable', true);
  if($('#hiddenfield').val() == ''){
    $('#hideAddress').hide()
  }
  $('.hide').parent().addClass('hide');
  $('th:contains("Hidden")').addClass('hide');
  $('.hide').hide();


  let fancyBox = $('#fancyFishInterp');
  document.getElementById('myForm').addEventListener('keydown', function(event){
  	if (event.keycode == '13' && event.target != fancyBox ) {
         event.preventDefault();
  	}
  });

  let fancyBox2 = $('#fancyFishComment');
  document.getElementById('myForm').addEventListener('keydown', function(event){
    if (event.keycode == '13' && event.target != fancyBox2 ) {
         event.preventDefault();
    }
  });

  let fancyBox3 = $('#fancyAmendCorrectComment');
  document.getElementById('myForm').addEventListener('keydown', function(event){
    if (event.keycode == '13' && event.target != fancyBox2 ) {
         event.preventDefault();
    }
  });
  let imagePath;
  let imageName;
  let reportAdd;
  let probeName;

  $('.probes').each(function() {
     probeName = $(this).val();
     $('ul#probeTabs').append('<li><a href="#'+ probeName +'Tab">'+ probeName + '</a></li>');
     $('#tabs').append('<div id="'+ probeName + 'Tab"><div style="width:1100px;" id="'+ probeName + 'Results"></div><div style="width:1100px;height:500px;overflow:scroll;" id="'+ probeName + 'Images"></div></div>');
  });

  $('.resultProbeName').each(function() {
    probeName = $(this).val();
    $('#' + probeName + 'Results').append('<table class="tablesorter"><thead>' + $('#fishTable thead').clone().html() + '</thead><tbody><tr class="r0">' + $(this).parent().parent('tr').html() + '</tr></tbody></table>');
    $(this).parent().parent('tr').remove();
    $('#' + probeName + 'Results').append($('#' + probeName + '-referenceTable').clone().html());
  });

  $('.imageLabel').each(function() {
    imagePath = $(this).parent().siblings().children('.imagePath').val();
    imageLabel = $(this).val();
    reportAdd = $(this).parent().siblings().children('.reportAdd').val();
    console.log(reportAdd,'reportAdd?')
    imageName = $(this).parent().siblings().children('.imageName').val();
    probeName = $(this).parent().siblings().children('.probeName').val();
    className = $(this).parent().siblings().children('.className').val();
    $('#' + probeName + 'Images').append('<div style="background-color:white;text-align:center;width:125px;height:125px;float:left;""><img class="imageSelect" className="' + className + '" selected="' + reportAdd + '" imageName="' + imageName + '" style="border:3px solid black;width:100px;height:100px;" src="' + imagePath + '"><br /><span style="font-size:8px;">'+imageLabel+'</span></div>');
  });


  $('.signalPattern tbody tr.r0 td').click(function() {
    let signalPattern = $(this);
    signalPattern.siblings().css('background-color','white');
    let sigPatProbe = signalPattern.parents('table').attr('id').replace('className', 'Images');
    let className = signalPattern.text();
    $('#'+ sigPatProbe).children('div').css('background-color', 'white');
    if (signalPattern.attr('signalPattern') == 'selected') {
      signalPattern.css('background-color', 'white');
      signalPattern.attr('signalPattern', '')
    } else {
      signalPattern.css('background-color', 'DeepSkyBlue');
      signalPattern.attr('signalPattern', 'selected')
      $('#'+ sigPatProbe).children('div').children('img[className="'+className+'"]').parent('div').css('background-color', 'DeepSkyBlue');
    }
   });


  $('.imageSelect').click(function() {

    reportAdd = $(this).attr('reportAdd');
    thisImage = $(this);
    imageName = $(this).attr('imageName');

    if(reportAdd === '1') {
      console.log('Here we are')
      $(this).attr('reportAdd','0');
      thisImage.css('border-color','black');
      $('#saveImages').val($('#saveImages').val().replace(',"'+imageName+'"',''));
    } else {
      $(this).attr('reportAdd','1');
      thisImage.css('border-color','red');
      $('#saveImages').val($('#saveImages').val() + ',"'+imageName+'"');
    }
  });

  $('.imageSelect[selected="1"]').each(function() {
    console.log('you made it here')
    $(this).attr('reportAdd',1);
    $(this).css('border-color','red');
    imageName = $(this).attr('imageName');
    $('#saveImages').val($('#saveImages').val() + ',"'+imageName+'"');
  });

	$('#tabs').tabs();

  $('#spinnerDiv').delay(1500).fadeOut();

  if($('#extCaseNumber').val() == '') {
    $('.external').hide();
  } else {
    $('.internal').hide();
  }


//  The functions below filter images by the score.
  $('#testclick').click(function() {
     let selectedScore = getSelectedText();
     let re = RegExp('.G.R')
     $('#testInput').val(selectedScore);
     console.log($('#testInput').val())

//    Test to make sure something is selected.
     if($('#testInput').val().length == 0) {
       alert('You must select a score to filter images.  No filtration applied');

      }
      else {
    $('img[class="imageSelect"]').parent().hide();
    $('img[classname="' + selectedScore + '"]').parent().show();
      }
  });

  $('#clearMe').click(function() {
    $('img[class="imageSelect"]').parent().show();
    });

  $('.ui-tabs-anchor').click(function() {
    $('img[class="imageSelect"]').parent().show();
  });

  $('.addComboBox').combobox();


  $('.interpChoice').change(function() {
    interpretationVal = $(this).find('option:selected').text();
    fishResultsField = $(this).parent().siblings().children('.results');
    fishInterpField = $('#fancyFishInterp');
    fishCommentField = $('#fancyFishComment');
    fishISCNField = $(this).parent().siblings().children('.iscn');

    $.getJSON('/uniflow?callback=?&stepName=Ajax+Get+Fish+Report+Values&displayValue=' + interpretationVal,{},function(data,status) {
    console.log(data)
    fishResult = data[0].fishResult
    fishInterpretation = data[0].fishInterpretation
    fishISCN = data[0].fishISCN
    fishComment = data[0].fishComment
    console.log(fishInterpField.html());
    console.log('fishComment',fishComment);
    if(fishInterpField.html() != '') {
      fishResult = fishResultsField.val() + '\n' + fishResult
      fishInterpretation = fishInterpField.html() + '<br />' + fishInterpretation
      fishISCN = fishISCNField.val() + '\n' + fishISCN
      fishComment = fishCommentField.html() + '<br />' + fishComment
    }
      fishResultsField.val(fishResult);
      fishInterpField.html(fishInterpretation);
      fishISCNField.val(fishISCN);
      fishCommentField.html(fishComment);
     });
   });

  $('.commentChoice').change(function() {
    fishCommentField = $('#fancyFishComment');
    fishComment = $(this).find('option:selected').text();
    console.log('fishComment',fishComment);
    console.log(fishCommentField.html());
    if (fishCommentField.html() != '') {
      fishComment = fishCommentField.html() + '<br />' + fishComment
    }
    fishCommentField.html(fishComment);
  });

  $('#clearISCN').click(function() {
   	$('.clearFields').val(''); $('#fancyFishInterp').html('');
  });

  $('#stepFormSubmitButton').click(function(){
    event.preventDefault();
    $('#interpretationFISH').val($('#fancyFishInterp').html());
    $('#commentFISH').val($('#fancyFishComment').html());
    $('#commentAmendCorrect').val($('#fancyAmendCorrectComment').html());
    $('[name="stepForm"]').submit();
  });

  $('#selectComment').change(function() {
    let comment = $(this).val();
    $('#fancyFishInterp').val($('#fancyFishInterp').val() + ' ' + comment);
   	});

  $('.interpChoice').focus(function() {
    console.log($(this).parent().parent().parent().find('.resultProbeDisplay').val());
    let getProbe = {stepName: 'Ajax Get Interpretations by Probes',
    selectProbe: $(this).parent().parent().parent().find('.resultProbeDisplay').val()}
        $.getJSON('uniflow?callback=?', getProbe).done(function(data) {
          console.log(data);
          $('select.interpChoice').empty()
          for (let i = 0; i < data.length; i++) {
          	let optionString = '<option>'+ data[i].displayValue +'</option>'
          	$('select.interpChoice').append(optionString);
          }
      	})
  });

  if($('#modifyType').val() != 'Correct') {
    $('.amendCorrectComments').hide();
  	} if($('#modifyType').val() != 'Amend') {
      $('.amendCorrectComments').hide();
    } else {
      $('.amendCorrectComments').show();
    }
  $('.readonlyDiv').attr("readonly", true);
 });


