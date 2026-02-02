/** reprorting functions use for every report **/
/** functions needed for reporting workflows **/ 

function showEsigSection(){
  if($('#action').val() == 'Approved'){
    $('#esig').show();
  } else {
    $('#esig').hide();
  }
}

function saveHtml(field, step) {
  var report_HTML_Body = '';
  var report_ClientAddress = '';
  $('#fancyTextPanel1').hide();
  $('#interp1').css('border', 'none');
  $('#fancyTextPanel2').hide();
  $('#interp2').css('border', 'none');
  $('#fancyTextPanelReferences').hide();
  $('#references').css('border', 'none');
  $('#fancyTextPanelAmended1').hide();
  $('#amended1').css('border', 'none');

  if($('#fancyTextPanelResults1').length){
    $('#fancyTextPanelResults1').hide();
    $('#result1').css('border', 'none');
  }
  if($('#fancyTextPanelResults2').length){
    $('#fancyTextPanelResults2').hide();
    $('#result2').css('border', 'none');
  }
  if($('#fancyTextPanelResults3').length){
    $('#fancyTextPanelResults3').hide();
    $('#result3').css('border', 'none');
  }
  if($('#fancyTextPanelResults4').length){
    $('#fancyTextPanelResults4').hide();
    $('#result4').css('border', 'none');
  }
  if($('#fancyTextPanelResults5').length){
    $('#fancyTextPanelResults5').hide();
    $('#result5').css('border', 'none');
  }
  if($('#fancyTextPanelResults6').length){
    $('#fancyTextPanelResults6').hide();
    $('#result6').css('border', 'none');
  }
  if($('#fancyTextPanelResults7').length){
    $('#fancyTextPanelResults7').hide();
    $('#result7').css('border', 'none');
  }
  if($('#fancyTextPanelResults8').length){
    $('#fancyTextPanelResults8').hide();
    $('#result8').css('border', 'none');
  }

  $('#nowSignDateTime').val($('#signDateTime'));
  if ($(field).val() == "Create" ){
    $('#nowSignDateTime').removeAttr('Id');    
    if($('#references').html() == '<br>' || $('#references').html() == ''){
      $('.referencesSection').hide();
    }
    if($('#result1').html() == '<br>' || $('#result1').html() == ''){
      $('#section1').hide();
    }
    if($('#result2').html() == '<br>' || $('#result2').html() == ''){
      $('#section2').hide();
    }
    if($('#result3').html() == '<br>' || $('#result3').html() == ''){
      $('#section3').hide();
    }
    if($('#result4').html() == '<br>' || $('#result4').html() == ''){
      $('#section4').hide();
    }
    if($('#result5').html() == '<br>' || $('#result5').html() == ''){
      $('#section5').hide();
    }
    if($('#result6').html() == '<br>' || $('#result6').html() == ''){
      $('#section6').hide();
    }
    if($('#result7').html() == '<br>' || $('#result7').html() == ''){
      $('#section7').hide();
    }
    if($('#result8').html() == '<br>' || $('#result8').html() == ''){
      $('#result8').hide();
    }
    if($('#interp2').html() == '<br>' || $('#interp2').html() == ''){
      $('#interp2').parent().hide();
    }
    if($('#interp1').html() == '<br>' || $('#interp1').html() == ''){
      $('#interp1').parent().hide();
    }

    reportHTML = '<html><head><title>' + 'Sign Out Report ' + $('#reportId').val() + '</title>';
//     reportHTML+='<link href="page3.css" rel="stylesheet"/>';
    reportHTML+='<link href="css/reportPDFPrint.css" rel="stylesheet"/>';
    reportHTML+= '</head><body><div id="myreport" class="main_report">';
    reportHTML+= htmlEntities($('#report').clone().html()) +  '</div></body></html>';

//     $('#report_HTML').val(reportHTML.replace('Preliminary report', 'Report finalized'));
    $('#report_HTML').val(reportHTML);


    report_HTML_Body+= '<body><div id="myreport" class="main_report">';
    report_HTML_Body+= htmlEntities($('#report').clone().html()) +  '</div></body>';
    $('#report_HTML_Body').val(report_HTML_Body);


    report_ClientAddress+= htmlEntities($('#clientAddress').clone().html());
    $('#report_ClientAddress').val(report_ClientAddress);

    $(".nowSignDateTime").last().attr("Id", "nowSignDateTime");
  }
}




  


$(document).ready(function(){
  // NicEdit js file must be loaded first.
//   bkLib.onDomLoaded(function() {
    if($('#fancyTextPanel1').length){
      var microDescEditor = new nicEditor();
      microDescEditor.setPanel('fancyTextPanel1');
      microDescEditor.addInstance('interp1');
    }
    if($('#fancyTextPanel2').length){
      var microDescEditor2 = new nicEditor();
      microDescEditor2.setPanel('fancyTextPanel2');
      microDescEditor2.addInstance('interp2');
    }
    if($('#fancyTextPanelReferences').length){
      var microDescEditorReferences = new nicEditor();
      microDescEditorReferences.setPanel('fancyTextPanelReferences');
      microDescEditorReferences.addInstance('references');
    }
    if($('#fancyTextPanelAmended1').length){
      var microDescEditorReferences = new nicEditor();
      microDescEditorReferences.setPanel('fancyTextPanelAmended1');
      microDescEditorReferences.addInstance('amended1');
    }

    if($('#fancyTextPanelResults1').length){
      var microDescEditorReferences = new nicEditor();
      microDescEditorReferences.setPanel('fancyTextPanelResults1');
      microDescEditorReferences.addInstance('result1');
    }
    if($('#fancyTextPanelResults2').length){
      var microDescEditorReferences = new nicEditor();
      microDescEditorReferences.setPanel('fancyTextPanelResults2');
      microDescEditorReferences.addInstance('result2');
    }
    if($('#fancyTextPanelResults3').length){
      var microDescEditorReferences = new nicEditor();
      microDescEditorReferences.setPanel('fancyTextPanelResults3');
      microDescEditorReferences.addInstance('result3');
    }
    if($('#fancyTextPanelResults4').length){
      var microDescEditorReferences = new nicEditor();
      microDescEditorReferences.setPanel('fancyTextPanelResults4');
      microDescEditorReferences.addInstance('result4');
    }
    if($('#fancyTextPanelResults5').length){
      var microDescEditorReferences = new nicEditor();
      microDescEditorReferences.setPanel('fancyTextPanelResults5');
      microDescEditorReferences.addInstance('result5');
    }
    if($('#fancyTextPanelResults6').length){
      var microDescEditorReferences = new nicEditor();
      microDescEditorReferences.setPanel('fancyTextPanelResults6');
      microDescEditorReferences.addInstance('result6');
    }
    if($('#fancyTextPanelResults7').length){
      var microDescEditorReferences = new nicEditor();
      microDescEditorReferences.setPanel('fancyTextPanelResults7');
      microDescEditorReferences.addInstance('result7');
    }
    if($('#fancyTextPanelResults8').length){
      var microDescEditorReferences = new nicEditor();
      microDescEditorReferences.setPanel('fancyTextPanelResults8');
      microDescEditorReferences.addInstance('result8');
    }

//   });

  $(document).keypress(function(event){
    if (event.which == '13' && $(':focus').attr('id') != 'interp1' && $(':focus').attr('id') != 'interp2' && $(':focus').attr('id') != 'references' && $(':focus').attr('id') != 'result1' && $(':focus').attr('id') != 'result2' && $(':focus').attr('id') != 'result3' && $(':focus').attr('id') != 'result4' && $(':focus').attr('id') != 'result5' && $(':focus').attr('id') != 'result6' && $(':focus').attr('id') != 'result7' && $(':focus').attr('id') != 'result8') {
      event.preventDefault();
    }
  });

  if($('#reportPanel').val() === 'HER2'){
    $('h2.stepName').replaceWith('<h2 class= "stepName">Fish Her2 Report</h2>');
  } else if($('#reportPanel').val() === 'BCRABL'){
    $('h2.stepName').replaceWith('<h2 class= "stepName">BCR/ABL Report</h2>');
  } else if($('#reportPanel').val() === 'KARYO'){
    $('h2.stepName').replaceWith('<h2 class= "stepName">Karyotyping Report</h2>');
  } else if($('#reportPanel').val() === 'MCT'){
    $('h2.stepName').replaceWith('<h2 class= "stepName">Microarray Report</h2>');
  }  else {
    $('h2.stepName').replaceWith('<h2 class= "stepName">'+$('#reportPanel').val()+' Report</h2>');
  } 
  
  if($('#fancyTextPanel1').length){
    $('#interp1').css('border', '1px solid black');
    $('#interp1').focusout(function() {
      $('#fancyTextPanel1').hide();
      $('#interp1').css('border', 'none');
    });
    $('#interp1').click(function() {
      $('#fancyTextPanel1').show();
      $('#interp1').css('border', '1px solid black');
    });
  }

  if($('#fancyTextPanel2').length){
    $('#interp2').css('border', '1px solid black');
    $('#interp2').focusout(function() {
      $('#fancyTextPanel2').hide();
      $('#interp2').css('border', 'none');
    });
    $('#interp2').click(function() {
      $('#fancyTextPanel2').show();
      $('#interp2').css('border', '1px solid black');
    });
  }

  if($('#fancyTextPanelReferences').length){
    $('#references').css('border', '1px solid black');
    $('#references').focusout(function() {
      $('#fancyTextPanelReferences').hide();
      $('#references').css('border', 'none');
    });
    $('#references').click(function() {
      $('#fancyTextPanelReferences').show();
      $('#references').css('border', '1px solid black');
    });
  }

  if($('#fancyTextPanelAmended1').length){
    $('#amended1').css('border', '1px solid black');
    $('#amended1').focusout(function() {
      $('#fancyTextPanelAmended1').hide();
      $('#amended1').css('border', 'none');
    });
    $('#amended1').click(function() {
      $('#fancyTextPanelAmended1').show();
      $('#amended1').css('border', '1px solid black');
    });
  }




  // Reporting results div layout
  if($('#fancyTextPanelResults1').length){
    $('#result1').css('border', '1px solid black');
    $('#result1').focusout(function() {
      $('#fancyTextPanelResults1').hide();
      $('#result1').css('border', 'none');
    });
    $('#result1').click(function() {
      $('#fancyTextPanelResults1').show();
      $('#result1').css('border', '1px solid black');
    });
  }

  if($('#fancyTextPanelResults2').length){
    $('#result2').css('border', '1px solid black');
    $('#result2').focusout(function() {
      $('#fancyTextPanelResults2').hide();
      $('#result2').css('border', 'none');
    });
    $('#result2').click(function() {
      $('#fancyTextPanelResults2').show();
      $('#result2').css('border', '1px solid black');
    });
  }

  if($('#fancyTextPanelResults3').length){
    $('#result3').css('border', '1px solid black');
    $('#result3').focusout(function() {
      $('#fancyTextPanelResults3').hide();
      $('#result3').css('border', 'none');
    });
    $('#result3').click(function() {
      $('#fancyTextPanelResults3').show();
      $('#result3').css('border', '1px solid black');
    });
  }

  if($('#fancyTextPanelResults4').length){
    $('#result4').css('border', '1px solid black');
    $('#result4').focusout(function() {
      $('#fancyTextPanelResults4').hide();
      $('#result4').css('border', 'none');
    });
    $('#result4').click(function() {
      $('#fancyTextPanelResults4').show();
      $('#result4').css('border', '1px solid black');
    });
  }

  if($('#fancyTextPanelResults5').length){
    $('#result5').css('border', '1px solid black');
    $('#result5').focusout(function() {
      $('#fancyTextPanelResults5').hide();
      $('#result5').css('border', 'none');
    });
    $('#result5').click(function() {
      $('#fancyTextPanelResults5').show();
      $('#result5').css('border', '1px solid black');
    });
  }

  if($('#fancyTextPanelResults6').length){
    $('#result6').css('border', '1px solid black');
    $('#result6').focusout(function() {
      $('#fancyTextPanelResults6').hide();
      $('#result6').css('border', 'none');
    });
    $('#result6').click(function() {
      $('#fancyTextPanelResults6').show();
      $('#result6').css('border', '1px solid black');
    });
  }

  if($('#fancyTextPanelResults7').length){
    $('#result7').css('border', '1px solid black');
    $('#result7').focusout(function() {
      $('#fancyTextPanelResults7').hide();
      $('#result7').css('border', 'none');
    });
    $('#result7').click(function() {
      $('#fancyTextPanelResults7').show();
      $('#result7').css('border', '1px solid black');
    });
  }

  if($('#fancyTextPanelResults8').length){
    $('#result8').css('border', '1px solid black');
    $('#result8').focusout(function() {
      $('#fancyTextPanelResults8').hide();
      $('#result8').css('border', 'none');
    });
    $('#result8').click(function() {
      $('#fancyTextPanelResults8').show();
      $('#result8').css('border', '1px solid black');
    });
  }
  // END Reporting results div layout


  var report_HTML_Body = ''

  $("#action").change(function() {
    $('#userId').val('');
    $('#password').val('');
    saveHtml($('#action'));
  });

  showEsigSection();

  $('#stepFormSubmitButton').click(function(ev){
    ev.preventDefault();
    $('#nowSignDateTime').val($('#signDateTime'));
    $('#electronicSignature').show();
    $('.electronicSignature').show();
    // Make sure interpSav and interp2Save happen before saveHtml function is called.
    $('#interpSave').val($('#interp1').html());
    $('#interp2Save').val($('#interp2').html());
    $('#referencesSave').val($('#references').html());
    $('#amended1Save').val($('#amended1').html());


    if($('#fancyTextPanelResults1').length){
      $('#result1Save').val($('#result1').html());
    }
    if($('#fancyTextPanelResults2').length){
      $('#result2Save').val($('#result2').html());
    }
    if($('#fancyTextPanelResults3').length){
      $('#result3Save').val($('#result3').html());
    }
    if($('#fancyTextPanelResults4').length){
      $('#result4Save').val($('#result4').html());
    }
    if($('#fancyTextPanelResults5').length){
      $('#result5Save').val($('#result5').html());
    }
    if($('#fancyTextPanelResults6').length){
      $('#result6Save').val($('#result6').html());
    }
    if($('#fancyTextPanelResults7').length){
      $('#result7Save').val($('#result7').html());
    }
    if($('#fancyTextPanelResults8').length){
      $('#result8Save').val($('#result8').html());
    }

    saveHtml($('#action'));
    $('#fancyTextPanel1, #fancyTextPanel2', '#fancyTextPanelReferences').hide();
    
    if($('#fancyTextPanelResults1').length){
      $('#fancyTextPanelResults1').hide();
    }
    if($('#fancyTextPanelResults2').length){
      $('#fancyTextPanelResults2').hide();
    }
    if($('#fancyTextPanelResults3').length){
      $('#fancyTextPanelResults3').hide();
    }
    if($('#fancyTextPanelResults4').length){
      $('#fancyTextPanelResults4').hide();
    }
    if($('#fancyTextPanelResults5').length){
      $('#fancyTextPanelResults5').hide();
    }
    if($('#fancyTextPanelResults6').length){
      $('#fancyTextPanelResults6').hide();
    }
    if($('#fancyTextPanelResults7').length){
      $('#fancyTextPanelResults7').hide();
    }
    if($('#fancyTextPanelResults8').length){
      $('#fancyTextPanelResults8').hide();
    }
    if($('#references').html() == '<br>' || $('#references').html() == ''){
      $('.referencesSection').hide();
    }

    $('[name="stepForm"]').submit();
  });


});


