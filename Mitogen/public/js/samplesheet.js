// function addSampleToTable(checkedBox){   
//   var poolTube = $(checkedBox).parent().siblings('td.col1').html(); 
//   var tablelength = $('#swData tbody tr').length;
//   var numberOfRowsUsed = $('#swData td.col0').filter(function(){ 
//                             return $(this).find('input').val();
//                           }).length;  
//   var nextEmptyRow = numberOfRowsUsed;

//   if ($(checkedBox).is(':checked') === true) {    
//     $.getJSON('/uniflow?callback=?&stepName=AjaxGetSampleSheetInfo&poolTube=' + poolTube,{},function(data,status) {
//       if (data) {
//         for(var j = 0; j < data.length; j++) {
//           $('#swData input[name="swData_'+ nextEmptyRow +'_1"]').val(data[j].SampleId);
//           $('#swData input[name="swData_'+ nextEmptyRow +'_3"]').val(data[j].Plate_Id);
//           $('#swData input[name="swData_'+ nextEmptyRow +'_4"]').val(data[j].Well);

//           $('#swData select[name="swData_'+ nextEmptyRow +'_5"]').val(data[j].I7IndexID);
//           $('#swData input[name="swData_'+ nextEmptyRow +'_6"]').val(data[j].index1);
//           $('#swData select[name="swData_'+ nextEmptyRow +'_7"]').val(data[j].I5IndexID);
//           $('#swData input[name="swData_'+ nextEmptyRow +'_8"]').val(data[j].index2);

//           $('#swData input[name="swData_'+ nextEmptyRow +'_15"]').val(data[j].pool_tube);
//           $('#swData input[name="swData_'+ nextEmptyRow +'_16"]').val(data[j].batchId);

//           nextEmptyRow++;
//         }
//       }
//     });
//   } else {
//     $('#swData tbody tr').each(function( key, value ){  
//       if($(value).find('.poolTubeId').val() == poolTube){
// //         console.log($(value).children('.col0').find('input').val());
//         $('#swData input[name="swData_'+ key +'_1"]').val('');
//         $('#swData input[name="swData_'+ key +'_2"]').val('');
//         $('#swData input[name="swData_'+ key +'_3"]').val('');
//         $('#swData input[name="swData_'+ key +'_4"]').val('');
//         $('#swData select[name="swData_'+ key +'_5"]').val('');
//         $('#swData input[name="swData_'+ key +'_6"]').val('');
//         $('#swData select[name="swData_'+ key +'_7"]').val('');
//         $('#swData input[name="swData_'+ key +'_8"]').val('');
//         $('#swData input[name="swData_'+ key +'_9"]').val('');
//         $('#swData input[name="swData_'+ key +'_10"]').val('');
//         $('#swData input[name="swData_'+ key +'_11"]').val('');
//         $('#swData input[name="swData_'+ key +'_12"]').val('');
//         $('#swData input[name="swData_'+ key +'_13"]').val('');
//         $('#swData input[name="swData_'+ key +'_14"]').val('');
//         $('#swData input[name="swData_'+ key +'_15"]').val('');
//         $('#swData input[name="swData_'+ key +'_16"]').val('');
//       }
//     });   
//   }  
// }

function getWorkflowOptions(workflowField){
  var workflow = $(workflowField).val();   
  //console.log('workflowfunction triggered. Value = ', workflow);  
  $('#chemistry').val(' ');   
  $('#chemistry').attr('disabled', true);   
  $('.settingsItem').closest('table').hide();   
//   $('#QualityScoreTrim').closest('table').show();    
  $('#vcAdvancedSettings').hide();

  $('#swData th:contains(Sample Name)').hide();
  $('#swData').find('.groupSampleName').parent('td').hide();

  $('#swData th:contains(GenomeFolder)').hide();
  $('#swData').find('.GenomeFolder').parent('td').hide();

  $('#swData th:contains(Manifest)').hide();
  $('#swData').find('.Manifest').parent('td').hide();

  $('#swData th:contains(Contaminants)').hide();
  $('#swData th:contains(miRNA)').hide();
  $('#swData th:contains(RNA)').hide();

  $('#swData th:contains(poolTube)').hide();
  $('#swData').find('.poolTubeId').parent('td').hide();
  $('#swData th:contains(batchId)').hide();
  $('#swData').find('.batchId').parent('td').hide();

  $('#swData').find('.smallRNA').parent('td').hide();
  $('#swData').find('.groupSampleName').attr('data-parsley-required',false);
  $('#swData').find('.GenomeFolder').attr('data-parsley-required',false);
  $('#swData').find('.Manifest').attr('data-parsley-required',false);
  $('#swData').find('.smallRNA').attr('data-parsley-required',false);

  if(workflow == 'Amplicon - DS'){     
//     $('.ampliconDS').closest('table').show();  
    $('#swData th:contains(Sample Name)').show();
    $('#swData').find('.groupSampleName').parent('td').show();
    $('#swData th:contains(GenomeFolder)').show();
    $('#swData').find('.GenomeFolder').parent('td').show();
    $('#swData th:contains(Manifest)').show();
    $('#swData').find('.Manifest').parent('td').show();
    $('#swData tbody tr').each(function(){
      if($(this).find('.tableSampleId').val() != ''){
        $(this).find('.GenomeFolder').attr('data-parsley-required',true);
        $(this).find('.Manifest').attr('data-parsley-required',true);
        $(this).find('.groupSampleName').attr('data-parsley-required',true);
      } 
    });

  } else if(workflow == 'Assembly'){     
//     $('.assembly').closest('table').show(); 
    $('#swData th:contains(GenomeFolder)').show();
    $('#swData').find('.GenomeFolder').parent('td').show();

  } else if(workflow == 'Enrichment'){     
//     $('.enrichment').closest('table').show();
    $('#swData th:contains(GenomeFolder)').show();
    $('#swData').find('.GenomeFolder').parent('td').show();
    $('#swData th:contains(Manifest)').show();
    $('#swData').find('.Manifest').parent('td').show();
//     $('#vcAdvancedSettings').show();
    $('#swData tbody tr').each(function(){
      if($(this).find('.tableSampleId').val() != ''){
        $(this).find('.GenomeFolder').attr('data-parsley-required',true);
        $(this).find('.Manifest').attr('data-parsley-required',true);
      } 
    });

  } else if(workflow == 'Generate FASTQ'){     
//     $('.fastq').closest('table').show();      

  } else if(workflow == 'LibraryQC'){     
//     $('.libraryQC').closest('table').show();  
    $('#swData th:contains(GenomeFolder)').show();
    $('#swData').find('.GenomeFolder').parent('td').show();  
    $('#swData tbody tr').each(function(){
      if($(this).find('.tableSampleId').val() != ''){
        $(this).find('.GenomeFolder').attr('data-parsley-required',true);
      }
    });

  } else if(workflow == 'Metagenomics'){     
//     $('.metagenomics').closest('table').show();      

  } else if(workflow == 'PCR Amplicon'){     
//     $('.pcrAmplicon').closest('table').show();     
    $('#chemistry').val('amplicon');     
    $('#swData th:contains(GenomeFolder)').show();
    $('#swData').find('.GenomeFolder').parent('td').show();
    $('#swData th:contains(Manifest)').show();
    $('#swData').find('.Manifest').parent('td').show();
    $('#swData tbody tr').each(function(){
      if($(this).find('.tableSampleId').val() != ''){
        $(this).find('.GenomeFolder').attr('data-parsley-required',true);
        $(this).find('.Manifest').attr('data-parsley-required',true);
      }
    });

  } else if(workflow == 'Resequencing'){     
//     $('.resequencing').closest('table').show(); 
    $('#swData th:contains(GenomeFolder)').show();
    $('#swData').find('.GenomeFolder').parent('td').show();
//     $('#vcAdvancedSettings').show();
    $('#swData tbody tr').each(function(){
      if($(this).find('.tableSampleId').val() != ''){
        $(this).find('.GenomeFolder').attr('data-parsley-required',true);
      }
    });

  } else if(workflow == 'Small RNA'){     
    $('#swData').find('.GenomeFolder').parent('td').show();
    $('#swData').find('.smallRNA').parent('td').show();
    $('#swData th:contains(Contaminants)').show();
    $('#swData th:contains(miRNA)').show();
    $('#swData th:contains(RNA)').show();
    $('#swData th:contains(GenomeFolder)').show();
    $('#swData tbody tr').each(function(){
      if($(this).find('.tableSampleId').val() != ''){
        $(this).find('.GenomeFolder').attr('data-parsley-required',true);
      } 
    });

  } else if(workflow == 'Targeted RNA'){   
    $('#swData th:contains(GenomeFolder)').show();
    $('#swData').find('.GenomeFolder').parent('td').show();
    $('#swData th:contains(Manifest)').show();
    $('#swData').find('.Manifest').parent('td').show();
    $('#swData tbody tr').each(function(){
      if($(this).find('.tableSampleId').val() != ''){
        $(this).find('.GenomeFolder').attr('data-parsley-required',true);
        $(this).find('.Manifest').attr('data-parsley-required',true);
      } 
    });

  } else if(workflow == 'TruSeq Amplicon'){     
//     $('.truseq').closest('table').show();
    $('#chemistry').val('amplicon');      
    $('#swData th:contains(GenomeFolder)').show();
    $('#swData').find('.GenomeFolder').parent('td').show();
    $('#swData th:contains(Manifest)').show();
    $('#swData').find('.Manifest').parent('td').show();
//     $('#vcAdvancedSettings').show();
    $('#swData tbody tr').each(function(){
      if($(this).find('.tableSampleId').val() != ''){
        $(this).find('.GenomeFolder').attr('data-parsley-required',true);
        $(this).find('.Manifest').attr('data-parsley-required',true);
      } 
    });
  } 
}

function showBaitManifestField(picardField){
  var picardVal = $(picardField).val();
  if(picardVal == 1){
    $('#BaitManifestFileName').closest('table').show();
  } else { 
    $('#BaitManifestFileName').closest('table').hide();
  }
}

function setVariantCallingSettings(VariantCallerField){ 
  var variantCallingVal = $(VariantCallerField).val();

  if(variantCallingVal == 'GATK'){
    $('#FilterOutSingleStrandVariants').val('0');
    if($('#workflow').val() == 'Enrichment'){
      $('#minimumCoverageDepth').val('20');
      $('#strandBiasFilter').val('-10');
    } else {
      $('#minimumCoverageDepth').val('0');
      $('#strandBiasFilter').val('');
    }
    
    $('#IndelRepeatFilterCutoff').val('8');
    $('#minQScore').val('');
    $('#variantFrequencyEmitCutoff').val('');
    $('#variantFrequencyFilterCutoff').val('0.20');
    $('#variantMinimumGQCutoff').val('30');
    $('#variantMinimumQualCutoff').val('30');

  } else if(variantCallingVal == 'Somatic'){
    if($('#workflow').val() == 'TruSeq Amplicon'){
      $('#FilterOutSingleStrandVariants').val('0');
    } else {
      $('#FilterOutSingleStrandVariants').val('1');
    }
    if($('#workflow').val() == 'Enrichment'){
      $('#strandBiasFilter').val('0.5');
    } else {
      $('#strandBiasFilter').val('');
    }
    $('#minimumCoverageDepth').val('0');
    $('#IndelRepeatFilterCutoff').val('8');
    $('#minQScore').val('20');
    $('#variantFrequencyEmitCutoff').val('0.01');
    $('#variantFrequencyFilterCutoff').val('0.01');
    $('#variantMinimumGQCutoff').val('30');
    $('#variantMinimumQualCutoff').val('30');

  } else if(variantCallingVal == 'Starling'){
    $('#FilterOutSingleStrandVariants').val('0');
    $('#minimumCoverageDepth').val('0');
    $('#strandBiasFilter').val('');
    $('#IndelRepeatFilterCutoff').val('8');
    $('#minQScore').val('0');
    $('#variantFrequencyEmitCutoff').val('');
    $('#variantFrequencyFilterCutoff').val('0.20');
    $('#variantMinimumGQCutoff').val('20');
    $('#variantMinimumQualCutoff').val('20');

  } else if(variantCallingVal == 'None'){
    $('#FilterOutSingleStrandVariants').val('0');
    $('#minimumCoverageDepth').val('0');
    $('#strandBiasFilter').val('');
    $('#IndelRepeatFilterCutoff').val('');
    $('#minQScore').val('');
    $('#variantFrequencyEmitCutoff').val('');
    $('#variantFrequencyFilterCutoff').val('');
    $('#variantMinimumGQCutoff').val('');
    $('#variantMinimumQualCutoff').val('');
  }
}

function setAdapter(adapterField){ 
  var adapter = $(adapterField).val();
  if(adapter == 'TruSeq'){
    $('#adapter1').closest('table').show(); 
    $('#adapter2').closest('table').show();
    $('#adapter1').val('AGATCGGAAGAGCACACGTCTGAACTCCAGTCA'); 
    $('#adapter2').val('AGATCGGAAGAGCGTCGTGTAGGGAAAGAGTGT');

  } else if(adapter == 'Small RNA'){
    $('#adapter1').closest('table').show();
    $('#adapter2').closest('table').hide();
    $('#adapter1').val('TGGAATTCTCGGGTGCCAAGGC'); 
    $('#adapter2').val('');
  
  } else if(adapter == 'Nextera'){
    $('#adapter1').closest('table').show();
    $('#adapter2').closest('table').hide();
    $('#adapter1').val('CTGTCTCTTATACACATCT'); 
    $('#adapter2').val('');
  
  } else if(adapter == 'Nextera Mate Pair'){
    $('#adapter1').closest('table').show();
    $('#adapter2').closest('table').show();
    $('#adapter1').val('CTGTCTCTTATACACATCT'); 
    $('#adapter2').val('AGATGTGTATAAGAGACAG');
    $('#ReverseComplement').val('1');
  }
}

function getIndexAdaptor(indexAdaptor, indexType, kitType){
  var adaptorIndex = $(indexAdaptor).val();
  $.getJSON('/uniflow?callback=?&stepName=AjaxGetAdaptorSequence&indexAdaptor=' + adaptorIndex + '&indexType=' + indexType,{}, function(data,status) {
    if(indexType == 'i7'){
      $(indexAdaptor).parent().siblings('td').find('.i7Sequence').val(data[0].indexSequence)
    }
    if(indexType == 'i5'){
      $(indexAdaptor).parent().siblings('td').find('.i5Sequence').val(data[0].indexSequence)
    }
  });
}


$(document).ready(function(){
  $('.poolTableOptionCkbox').click(function(){
    addSampleToTable(this);
  });

  $('.settingsItem').closest('table').hide();
  $('#vcAdvancedSettings').hide();
  $('#swData th:contains(Sample Name)').hide();
  $('#swData').find('.groupSampleName').parent('td').hide();
  $('#swData th:contains(GenomeFolder)').hide();
  $('#swData').find('.GenomeFolder').parent('td').hide();
  $('#swData th:contains(Manifest)').hide();
  $('#swData').find('.Manifest').parent('td').hide();
  $('#swData th:contains(Contaminants)').hide();
  $('#swData th:contains(miRNA)').hide();
  $('#swData th:contains(RNA)').hide();
  $('#swData').find('.smallRNA').parent('td').hide();

  $('#swData th:contains(pool tube)').hide();
  $('#swData').find('.poolTubeId').parent('td').hide();
  $('#swData th:contains(batchId)').hide();
  $('#swData').find('.libraryTubeId').parent('td').hide();

  $('.wide300').css('width', '300px');

  setVariantCallingSettings($('#VariantCaller'));

  $('#workflow').change(function(){
    getWorkflowOptions(this);
  });

  $('#adaptorType').change(function(){
    setAdapter(this);
  });

  $('#PicardHSmetrics').change(function(){
    showBaitManifestField(this);
  });

  $('#VariantCaller').change(function(){
    setVariantCallingSettings(this);
  });

  $('.i7Index').change(function(){
    getIndexAdaptor(this, 'i7');
  });

  $('.i5Index').change(function(){
    getIndexAdaptor(this, 'i5');
  });

  sampleSheetDefaultName = $('#PoolTubeId').val();

  if( $('#libraryBatchId').val() != '' ){
    sampleSheetDefaultName = $('#libraryBatchId').val();
  }

  $('#samplesheetName').val(sampleSheetDefaultName);

//   if ($('#poolTableOptions tbody').children().length == 0) {
//     $('#AdditionalPoolTubes').hide();
//   } else {
//     $('#AdditionalPoolTubes').show();
//   }

});



