/***common function used for reporting***/


function PhenotypeLookup (fld) {
  var $e = fld;
  var genotype = $e.val().toUpperCase();
  var assay = $("input[type='text']",$e.parent().parent()).attr('value').toUpperCase();
  if (assay == 'TRT-MTHFR') {
    assay+= ' ' + genotype;
  }
  /* do the ajax call here */
 $.getJSON('/uniflow?callback=?&stepName=Ajax+Phenotype+For+Genotype'
    ,{ assay: assay, genotype: genotype}
   ,function(data, status) {
     var content = '<div class="report_spacer"></div><span style="display:inline" class="report_section_header">Manual Addition  - copy desired information to appropiate fields</span><table class="stdTableSort">';
     content+= '<thead><th>Assay</th><th>Genotype</th><th>mutation Status</th><th>Phenotype</th>'
     content+= '<th>Results Interpretation</th><th>Dosage Recommendation</th><th>References</td></thead>';
     for (i = 0; i < data.length; i++) {
       if (data[i].assay)
          content+='<tr><td>'+data[i].assay+'</td>'
          content+='<td>'+data[i].genotype+'</td>'
          content+='<td>'+data[i].mutation+'</td>'
          content+='<td>'+data[i].phenotype+'</td>'
          content+='<td>'+data[i].results+'</td>'
          content+='<td>'+data[i].recommendation+'</td>'
          content+='<td>'+data[i].refs+'</td></tr>'
     }
     content+='</table>'
     $('#manualAdds').html(content);
     $('#manualAdds').css('display','inline');

   });
}

function copyrowdata (rowid) {
  var ar = [];
  var ar1 = [];

  /* CDx fields */
  if ($('#testType').val() == 'CDx') {
    /* alert("In CDx"); */
    ar.push('<h4 class="report_section_header">RESULTS INTERPRETATION:</h4>'); ar.push($('#'+rowid+'_3').html());
    ar.push('<h4 class="report_section_header">CLINICAL SIGNIFICANCE:</h4>'); ar.push($('#'+rowid+'_4').html());
    ar.push('<h4 class="report_section_header">REFERENCES:</h4>'); ar.push($('#referencesForTestsRequested').html());
    ar.push('<h4 class="report_section_header">ASSAY DESCRIPTION AND METHODOLOGY:</h4>'); ar.push($('#'+rowid+'_2').html());
    ar.push('<h4 class="report_section_header">INTENDED USE:</h4>'); ar.push($('#'+rowid+'_6').html());
  }

  /* Vir fields */
  if ($('#testType').val() == 'Viro') {
      ar.push('<h4 class="report_section_header">ASSAY DESCRIPTION AND METHODOLOGY:</h4>'); ar.push($('#'+rowid+'_2').html());
  
    /* alert("In Virus"); */
    
 /*   ar1.push('<h4>PATIENT HISTORY:</h4>');
    ar1.push($('#edit_patientHistory').val());
    ar1.push('<h4>THERAPEUTIC/DOSE COMMENTS AND RECOMMENDATIONS:</H4>');
    ar1.push($('#frecommendations').val());
    ar1.push($('#'+rowid+'_5').html());
    ar1.push('<h4>REFERENCES:</h4>'); ar1.push($('#referencesForTestsRequested').html());

    ar.push('<h4>CO-ADMINISTRATION OF OTHER DRUGS:</h4>'); ar.push($('#'+rowid+'_9').html());
    ar.push('<h4>CLINICAL INDICATION FOR TESTING:</h4>'); ar.push($('#'+rowid+'_7').html());
    ar.push('<h4>ASSAY DESCRIPTION AND METHODOLOGY:</h4>'); ar.push($('#'+rowid+'_2').html());
    ar.push('<h4>ADDITIONAL INFORMATION:</h4>'); ar.push($('#'+rowid+'_8').html());*/
  }  

  /* PGx fields */
  if ($('#testType').val() == 'PGx') { 
    /* alert("In PGx"); */
    ar1.push('<h4>PATIENT HISTORY:</h4>');
    ar1.push($('#edit_patientHistory').val());
    ar1.push('<h4>THERAPEUTIC/DOSE COMMENTS AND RECOMMENDATIONS:</H4>');
    ar1.push($('#frecommendations').val());
    ar1.push($('#'+rowid+'_5').html());
    ar1.push('<h4>REFERENCES:</h4>'); ar1.push($('#referencesForTestsRequested').html());

    ar.push('<h4>CO-ADMINISTRATION OF OTHER DRUGS:</h4>'); ar.push($('#'+rowid+'_9').html());
    ar.push('<h4>CLINICAL INDICATION FOR TESTING:</h4>'); ar.push($('#'+rowid+'_7').html());
    ar.push('<h4>ASSAY DESCRIPTION AND METHODOLOGY:</h4>'); ar.push($('#'+rowid+'_2').html());
    ar.push('<h4>ADDITIONAL INFORMATION:</h4>'); ar.push($('#'+rowid+'_8').html());
  }

  /* fields for both*/

  /*ar.push('<h4>DISCLAIMER:</H4>'); ar.push($('#edit_disclaimer').html());*/

  myField.setHtml(false, ar.join(''));
  patientHistoryField.setHtml(false, ar1.join(''));

}

/***
function copyrowdata_OLD_REMOVEME (rowid) {
  $('#view_description').html($('#'+rowid+'_2').html())
  $('#edit_description').html($('#'+rowid+'_2').html())
  $('#view_interpretation').html($('#'+rowid+'_3').html())
  $('#edit_interpretation').html($('#'+rowid+'_3').html())
  $('#view_significance').html($('#'+rowid+'_4').html())
  $('#edit_significance').html($('#'+rowid+'_4').html())
  $('#view_dosageRecommendation').html('initial' + $('#frecommendations').val()+'\r\n'+$('#'+rowid+'_5').html())
  $('#edit_dosageRecommendation').html('editinitial' + $('#frecommendations').val()+'\r\n'+$('#'+rowid+'_5').html())
  uniflow.editorField.setHtml(false, $('#frecommendations').val()+'\r\n'+$('#'+rowid+'_5').html());
  $('#view_intendedUse').html($('#'+rowid+'_6').html())
  $('#edit_intendedUse').html($('#'+rowid+'_6').html())
  $('#view_indication').html($('#'+rowid+'_7').html())
  $('#edit_indication').html($('#'+rowid+'_7').html())
  $('#view_addtionInformation').html($('#'+rowid+'_8').html())
  $('#edit_addtionInformation').html($('#'+rowid+'_8').html())
  $('#view_medicinesAffected').html($('#'+rowid+'_9').html())
  $('#edit_medicinesAffected').html($('#'+rowid+'_9').html())
}
***/

function findTestPanelsForRequest() {
  $.getJSON('/uniflow?callback=?&stepName=Ajax+TestsPanels+For+Request'
    ,{ requestId: $('#requestId').val()}
    ,function(data, status) {
      //alert(data[0].panelCode);
      //var content = 'new stuff';
      var content = '<div class="report_spacer"></div><span class="report_section_header">REQUESTED PANELS</span><table class="stdTableSort">';
      content+= '<thead><th>copy</th><th>panelCode</th><th>description</th><th>interpretation</th><th>significance</th>'
      content+= '<th>dosageRecommendation</th><th>intendedUse</th><th>indication</td><th>prevalence</td><th>coAdminDrugs</td></thead>';
      for (i = 0; i < data.length; i++) {
        content+='<tr id="'+data[i].panelCode+'">'
        content+='<td><input type="checkbox" onClick="copyrowdata('+data[i].panelCode+')"></td>'
        content+='<td id="'+data[i].panelCode+'_1">'+data[i].panelCode+'</td>'
        content+='<td id="'+data[i].panelCode+'_2">'+data[i].description+'</td>'
        content+='<td id="'+data[i].panelCode+'_3">'+data[i].interpretation+'</td>'
        content+='<td id="'+data[i].panelCode+'_4">'+data[i].significance+'</td>'
        content+='<td id="'+data[i].panelCode+'_5">'+data[i].dosageRecommendation+'</td>'
        content+='<td id="'+data[i].panelCode+'_6">'+data[i].intendedUse+'</td>'
        content+='<td id="'+data[i].panelCode+'_7">'+data[i].indication+'</td>'
        content+='<td id="'+data[i].panelCode+'_8">'+data[i].prevalence+'</td>'
        content+='<td id="'+data[i].panelCode+'_9">'+data[i].coAdminDrugs+'</td>'
        content+='</tr>'
      }
      content+='</table>'
      $('#testpanelssrequested').html(content);
      //$('#testpanelssrequested').css('display','inline');

    });
}

function finalReportPatientHistory() {
  $.getJSON('/uniflow?callback=?&stepName=Ajax+Final+Report+Patient+History'
    ,{ reportId: $('#reportId').val()}
    ,function(data, status) {
      var content = '';
      for (i = 0; i < data.length; i++) {

        /*content += '<div class="report_spacer"></div><span class="report_section_header">PATIENT HISTORY:</span>' */
        content += '<p>'+data[i].patientHistory+'</p>';
      }
      if ($('#testType').val() == 'PGx') {
        $('#patientHistory').html(content);
      }
    });
};

function finalReportResults() {
  $.getJSON('/uniflow?callback=?&stepName=Ajax+Final+Report+Results'
    ,{ reportId: $('#reportId').val()}
    ,function(data, status) {

      var content = '<div class="report_spacer"></div><span class="report_section_header">LABORATORY TEST RESULTS:</span><table class="stdTableSort">';
      content+= '<thead><th>Genetic Test</th><th>Genotype</th><th>Phenotype</th><th>Result Interpretation</th></thead>';
      //testname=data[1].testName
      for (i = 0; i < data.length; i++) {
         content+='<tr><td><nobr>'+data[i].assay+'</nobr></td><td>'+data[i].mutation+'</td><td>'+data[i].result+'</td><td>'+data[i].description+'</td></tr>'
      }
      content+='</table>'
      $('#testresults').html(content);
      //$('#testresults').css('display','inline');
    });
}

function finalReportTestData() {
  $.getJSON('/uniflow?callback=?&stepName=Ajax+Final+Report+Test+Data'
    ,{ reportId: $('#reportId').val()}
    ,function(data, status) {
      var content = '';
      for (i = 0; i < data.length; i++) {

        content += '<p>'+data[i].dosageRecommendation+'</p>';
        $('#dosageRecommendation').html(content);
/***
        if ($('#testType').val() == 'CDx') {
          content = '<div class="report_spacer"></div><span class="report_section_header">RESULTS INTERPRETATION:</span>'
          content += '<p>'+data[i].interpretation+'</p>';
          $('#interpretation').html(content);
        }
        if ($('#testType').val() == 'CDx') {
          content = '<div class="report_spacer"></div><span class="report_section_header">CLINICAL SIGNIFICANCE:</span>'
          content += '<p>'+data[i].significance+'</p>';
          $('#significance').html(content);
        }
        if ($('#testType').val() == 'PGx') {
          content = '<div class="report_spacer"></div><span class="report_section_header">PATIENT HISTORY:</span>'
          content += '<p>'+data[i].patientHistory+'</p>';
          $('#patientHistory').html(content);
        }
        if ($('#testType').val() == 'PGx') {
          content = '<div class="report_spacer"></div><span class="report_section_header">THERAPEUTIC/DOSE COMMENTS AND RECOMMENDATIONS:</span>'
          content += '<p>'+data[i].dosageRecommendation+'</p>';
          $('#dosageRecommendation').html(content);
        }
        if ($('#testType').val() == 'PGx') {
          content = '<div class="report_spacer"></div><span class="report_section_header">CO-ADMINISTRATION OF OTHER DRUGS:</span>'
          content += '<p>'+data[i].medicinesAffected+'</p>';
          $('#medicinesAffected').html(content);

        }
        if ($('#testType').val() == 'PGx') {
          content = '<div class="report_spacer"></div><span class="report_section_header">CLINICAL INDICATION FOR TESTING:</span>'
          content += '<p>'+data[i].indication+'</p>';
          $('#indication').html(content);
        }
        content = '<div class="report_spacer"></div><span class="report_section_header">ASSAY DESCRIPTION AND METHODOLOGY:</span>'
        content += '<p>'+data[i].description+'</p>';
        $('#description').html(content);
        if ($('#testType').val() == 'CDx') {
          content = '<div class="report_spacer"></div><span class="report_section_header">INTENDED USE:</span>'
          content += '<p>'+data[i].intendedUse+'</p>';
          $('#intendedUse').html(content);
        }
        if ($('#testType').val() == 'PGx') {
          content = '<div class="report_spacer"></div><span class="report_section_header">ADDITIONAL INFORMATION:</span>'
          content += '<p>'+data[i].additionalInformation+'</p>';
          $('#additionalInformation').html(content);
        }
        content = '<div class="report_spacer"></div><span class="report_section_header">DISCLAIMER:</span>'
        content += '<p>'+data[i].disclaimer+'</p>';
        $('#disclaimer').html(content);
***/

      }
      $('#testsrequested').html(content);
    });
};


function searchTestsForRequest() {
  $.getJSON('/uniflow?callback=?&stepName=Ajax+Tests+Search'
    ,{ requestId: $('#requestId').val()}
    ,function(data, status) {
      var content = '';
      for (i = 0; i < data.length; i++) {
        content += '<span class="report_section_header">RESULTS INTERPRETATION:</span>'
        content += '<p>'+data[i].interpretation+'</p></fieldset>';
        content += '<span class="report_section_header">CLINICAL SIGNIFICANCE:</span>'
        content += '<p>'+data[i].significance+'</p></fieldset>';
        content += '<span class="report_section_header">ASSAY DESCRIPTION AND METHODOLOGY:</span>'
        content += '<p>'+data[i].description+'</p></fieldset>';
        if (data[i].dosageRecommendation) {
          content += '<span class="report_section_header">DOSAGE RECOMMENDATION:</span>'
          content += '<p>'+data[i].dosageRecommendation+'</p></fieldset>';
        }
        content += '<span class="report_section_header">INTENDED USE:</span>'
        content += '<p>'+data[i].intendedUse+'</p></fieldset>';
      }
      $('#testsrequested').html(content);
    });
};

function extrationResults() {
  $.getJSON('/uniflow?callback=?&stepName=Ajax+ExtractionResults+pcrImports'
    ,{ requestId: $('#requestId').val()}
    ,function(data, status) {
      var dataCount=0
      if (dataCount=0) {
        $('#testresults').html('NO RESULTS');
      }

      var content = '<span class="report_section_header">LABORATORY TEST RESULTS</span><table class="stdTableSort">';
      content+= '<thead><th>assay</th><th>Mutation Detected</th><th>Mutation Test Result</th></thead>';
      //testname=data[1].testName
      for (i = 0; i < data.length; i++) {
        if (data[i].mutationStatus == 'ND') {
          content+='<tr ><td style="color:blue">'+data[i].assay+'</td><td style="color:blue">'+data[i].test+'</td><td style="color:blue">'+data[i].mutationStatus+'</td></tr>'
        } else if (data[i].mutationStatus == 'WT') {
          content+='<tr><td>'+data[i].assay+'</td><td>'+data[i].test+'</td><td style="color:#990000">'+data[i].mutationStatus+'</td></tr>'
        } else {
          content+='<tr><td>'+data[i].assay+'</td><td>'+data[i].test+'</td><td>'+data[i].mutationStatus+'</td></tr>'
        }
      }
      content+='</table>'
      $('#testresults').html(content);
      //$('#testresults').css('display','inline');
    });
    $.getJSON('/uniflow?callback=?&stepName=Ajax+ExtractionResults+genMark'
    ,{ requestId: $('#requestId').val()}
    ,function(data, status) {
      if (data.length>0) {
        var content = '<span class="report_section_header">GENMARK RESULTS</span><table class="stdTableSort">';
        content+= '<thead><th>test</th><th>Mutation Detected</th><th>Result</th></thead>';
        for (i = 0; i < data.length; i++) {
          if (data[i].Mutation == 'ND') {
            content+='<tr ><td style="color:blue">'+data[i].containerId+'</td><td style="color:blue">'+data[i].test+'</td><td style="color:blue">'+data[i].Mutation+'</td></tr>'
          } else if (data[i].Mutation == 'WT') {
            content+='<tr ><td style="color:blue">'+data[i].containerId+'</td><td style="color:blue">'+data[i].test+'</td><td style="color:blue">'+data[i].Mutation+'</td></tr>'
          } else {
            content+='<tr ><td style="color:blue">'+data[i].containerId+'</td><td style="color:blue">'+data[i].test+'</td><td style="color:blue">'+data[i].Mutation+'</td></tr>'
          }
        }
        content+='</table>'
        $('#testresults').html(content);
        //$('#testresults').css('display','inline');
      }
    });
};

function loadMedicines() {
  $.getJSON('/uniflow?callback=?&stepName=AJax+Medicines+For+Request'
    ,{ reportId: $('#reportId').val()}
    ,function(data, status) {
      var content = '<span class="report_section_header">PREVALENCE AND SUBSTRATES</span><table class="stdTableSort">';
      content+= '<thead><th>name</th><th>Medicines Affected</th><th>Patients With Variants</th></thead>';
      for (i = 0; i < data.length; i++) {
        if (data[i].medicinesAffected)
          content+='<tr><td>'+data[i].name+'</td><td>'+data[i].medicinesAffected+'</td><td>'+data[i].patientsWithVariants+'</td></tr>'
        else
          content='';
      }
      if (content.length > 1) {
        content+='</table>'
        if (data.length < 1) {
          content='';
        }
        $('#medicines').html(content);
        $('#medicines').css('display','inline');
      }
    });
};

function createFields(label,value) {
  var content='';
    content+='<td class="patientInfoHeader" >'+label+'</td>'
    content+='<td>'+value+'</td>'
    return content;
};

function loadRequestInfo() {
  $.getJSON('/uniflow?callback=?&stepName=Ajax+Load+Request+Info'
  ,{ reportId: $('#reportId').val()}
  ,function(data, status) {
    var content = '<div class="report_spacer"></div><span class="report_section_header">PATIENT AND ORDER INFORMATION:</span>';
    for (i = 0; i < data.length; i++) {
      content+='<table class="patientInfo"><tr>'
      content+=createFields('Patient Last Name',data[i].lastName);
      content+=createFields('Order ID',data[i].reqId);
      content+=createFields('Sample Type',data[i].sampleType);
      content+='</tr><tr>'
      content+=createFields('Patient First Name',data[i].firstName);
      content+=createFields('MRN',data[i].MRN);
      content+=createFields('Date Received',data[i].eventDate);
      content+='</tr><tr>'
      content+=createFields('DOB',data[i].dob);
      content+=createFields('Lab Name',data[i].organizationName);
      content+=createFields('Pathology Report #',$('#reportId').val());
      content+='</tr><tr>'
      content+=createFields('Gender: M/F',data[i].gender);
      content+=createFields('Specimen ID',data[i].specimentId);
      content+=createFields('Additional Physician',data[i].additionalPhysicianName);
      content+='</tr><tr>'
      content+=createFields('Physician',data[i].physicianName);
      content+=createFields('Collection Date',data[i].collectionDate);
      content+=createFields('OncoDx ID',data[i].OncoDxId);
      content+='</tr>'
      content+='</table>'
    }
    $('#patientInfo').html(content);
  });
};

/***
function searchReferencesForRequest_OLD() {
  $.getJSON('/uniflow?callback=?&stepName=Ajax+ReferencesForRequest+Search'
      ,{ requestId: $('#requestId').val()}
    ,function(data, status) {
      var content = '<div class="report_spacer"></div><span class="report_section_header">REFERENCES:</span><table class="stdTableSort" style="font-size:8pt">';
      content+= '';
      for (i = 0; i < data.length; i++) {
        content+='<tr><td style="width:600px">'+data[i].description+'</td></tr>'
      }
      if (data.length < 2) {
        content='';
      }
      content+='</table>'
      $('#referencesForTestsRequested').html(content);
      $('#referencesForTestsRequested').css('display','inline');
    });
};
***/

function searchReferencesForRequest() {
  $.getJSON('/uniflow?callback=?&stepName=Ajax+ReferencesForRequest+Search'
      ,{ requestId: $('#requestId').val()}
    ,function(data, status) {
      var content = '';
      for (i = 0; i < data.length; i++) {
        /**** commented out reference url for the current per Prem
        content+=data[i].description+' ->  '+data[i].ref+'\r\n';
        ***/
        content+=data[i].description + '\r\n';
      }
      if (data.length < 2) {
        content='';
      }
      $('#referencesForTestsRequested').html(content);
      /*$('#referencesForTestsRequested').css('display','inline');*/
    });
};

function LoadLaserMicroDissectionImages() {
  $.getJSON('/uniflow?callback=?&stepName=Ajax+LoadLaserMicroDissectionImages'
    ,{ requestId: $('#requestId').val()}
    ,function(data, status) {
      var content = '<div class="report_spacer"></div><fieldset><legend class="report_section_header">Laser Micro Dissection Slides Images</legend>'
      for (i = 0; i < data.length; i++) {
        content += '<img src="documents/'+data[i].preCutImage+'"/>'
        content += '<img src="documents/'+data[i].postCutImage+'"/>'
      }
      content += '</fieldset>'
      if (data.length < 2) {
        content='';
      }
      $('#laserMicroDissectionImages').html(content);
    });
};
