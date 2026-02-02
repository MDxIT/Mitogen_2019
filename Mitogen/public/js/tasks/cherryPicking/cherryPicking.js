$(document).ready( function() {

  $('#destinationTray').hide();
  $('#viewSource').click( function () {    
      $('#destinationTray').toggle(); 
  });   

  clearHighlighting();
  grayProcessed();

  /**
  *  Highlighting samples current selection
  **/
  $('.sampleListTable_specimenId').parent('td').parent('tr').children('td').on( "click", function() {
    highlightSelected($(this).parent('tr').children('td').children('.sampleListTable_order').parent('td').data('order').toString());
  });


  $('.well').parent('td').on( "click", function() {
    if ( $(this).children('.well').val().length > 0 ) {
      highlightSelected( $(this).children('.well').attr('data-well') );
    }
  });


  $('.well').each( function() {
    var wellLocation = (($(this).attr('name')).split(':'))[1];
    $(this).attr('data-well', wellLocation.toString())
  });

  $('#selectAll').on( "change", function() {        
    clearHighlighting();
    grayProcessed();
  });

  $('.controlListTable_scan').removeClass('required');


});


/**
* Function to highlight well and matching sample list row to standard blue with border
* @param sampleId - sample id to search across tray and sample list
**/
function highlightSelected( wellLocation ) {

  clearHighlighting();
  grayProcessed();

  $('.well').each( function() {
    if ( $(this).attr('data-well') == wellLocation ) {
      $(this).parent().addClass('cherryPickCurrentWell');
    }
  });

  $('.sampleListTable_order').each( function() {
    console.log("$(this).parent('td').data('order') ", $(this).parent('td').data('order') )
    if ( $(this).parent('td').data('order').toString() === wellLocation ) {
      $(this).parent('td').parent('tr').children('td').addClass('cherryPickCurrentRow');
      $(this).parent('td').parent('tr').find("td:visible:first").addClass('cherryPickCurrentRowFirst');
      $(this).parent('td').parent('tr').find("td:visible:last").addClass('cherryPickCurrentRowLast');
    }
  });

}

/**
* Function to gray out well and matching sample list row to standard gray when checkbox checked
**/
function grayProcessed() {

  var processedSampleIdMap = $('#sampleListTable .sampleListTable_checkbox:checked').map( function() {
    $(this).parent('td').parent('tr').children('td').removeClass('cherryPickCurrentRow cherryPickCurrentRowFirst cherryPickCurrentRowLast');
    $(this).parent('td').parent('tr').children('td').addClass('cherryPickDone');
    return $(this).parent().parent().find('.sampleListTable_order').parent('td').data('order').toString();
  }).get();

  $('.well').each( function() {
    if ( processedSampleIdMap.indexOf( $(this).attr('data-well')  ) != -1 ) {
      $(this).parent().removeClass('cherryPickCurrentWell'); 
      $(this).parent().addClass('cherryPickDone'); 
    }
  });

}

/**
* Function to clear highlighted of sample list rows and wells when unchecked
**/
function clearHighlighting() {

  var processedSampleIdMap = $('#sampleListTable .sampleListTable_checkbox:not(:checked)').map( function() {
    $(this).parent('td').parent('tr').children('td').removeClass('cherryPickCurrentRow cherryPickCurrentRowFirst cherryPickCurrentRowLast cherryPickDone');
    return $(this).parent().parent().find('.sampleListTable_order').parent('td').data('order').toString();
  }).get();

  $('.well').each( function() {
    if ( processedSampleIdMap.indexOf( $(this).attr('data-well') ) != -1 ) {
      $(this).parent().removeClass('cherryPickCurrentWell cherryPickDone'); 
    }
  });

}





