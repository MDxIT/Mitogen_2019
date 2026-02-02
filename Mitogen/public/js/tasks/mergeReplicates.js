$(document).ready( function() {

  var sampleListLen = $('#sampleListTable').children('tbody').children('tr').length
  var sampleGeneration = $('.mergedSample_singleContainerGen').val()

  // Filter on load
  filterMergeSamples()
  // Allows for dequeueing empty trays
  allowDequeueIfEmpty(sampleListLen, sampleGeneration)
  // Filters on change of select option 
  $('#sampleFilter').change(function(){
    filterMergeSamples()
  })
  $('#selectAllDiv').hide()

});

function filterMergeSamples(){
  $('.sampleListTable_specimenId').each(function(){
    if($(this).val() == $('#sampleFilter').val()){
      $(this).parent('td').parent('tr').children('td').show()
      // Get config
      var config = getConfig('sampleList')
      // Hide columns
      hideSampleListColumns(config)
     
    }else{
      
      $(this).parent('td').parent('tr').children('td').hide()
      $('.sampleListTable_checkbox').each(function(){
        $(this).prop('checked',false).triggerHandler('click')
        $(this).change()
      })
    }
    
  })
}

function allowDequeueIfEmpty(sampleListLen, sampleGeneration){
  if(sampleListLen == 0){
    $('#sampleFilter').removeClass('required')
    $('#sampleFilter').attr('data-parsley-required', 'false')
    $('#keepOnQueue').val('No')
    $('#mergedSample').removeClass('required')
    $('#mergedSample').attr('data-parsley-required', 'false')
    
  }else if(sampleGeneration != 'Auto Generated'){
    $('#mergedSample').addClass('required')
    $('#mergedSample').attr('data-parsley-required', 'true')
  }

}