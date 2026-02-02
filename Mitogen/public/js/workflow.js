/**
 * Frameshift
 * JavaScript Workflow Global Functions
 *
 * @author Wendy Goller
 * @copyright 2017 Sunquest Information Systems
 * @version 1.0.20171013
 */

/**
 * Check upper or lower bounds or check both. If field is out of bound then alert an error message.
 *
 * @param {string} currInput - input to check
 * @param {string} numberType - determine if input should be treated as integer or decimal
 * @param {string} boundType - determine wether to check upper and lower bounds or to check both.
 * @param {number} maximum - maximum bound
 * @param {number} minimum - minimun bound
 * @param {string} alertMessage - message to display to the user if the input is out of bounds

 * will be called in the mitogen tools in the bound script as follows
 *   checkBounds( $(this) , '%type%', '%boundType%', %maximum%, %minimum% , '%alertMessage%');
 */

function checkBounds(currInput, numberType, boundType, maximum, minimum, alertMessage) {
    var boundValue = currInput.val();
    var n;
    if(boundValue == ''){
      return;
    }
    if (numberType == 'Integer') {
       n = Math.floor(Number(boundValue));
    } else if (numberType == 'Decimal') {
       n = parseFloat(boundValue);
    }
    if(boundType === 'Upper'){
      if (numberType == 'Integer') {
        if (String(n) === boundValue && n <= maximum) { return; }
      } else if (numberType == 'Decimal') {
        if (n <= maximum) { return; }
      }
    } else if(boundType === 'Lower'){
      if (numberType == 'Integer') {
        if (String(n) === boundValue && n >= minimum) { return; }
      } else if (numberType == 'Decimal') {
        if (n >= minimum) { return; }
      }
    } else if(boundType === 'Both'){
      if (numberType == 'Integer') {
        if (String(n) === boundValue && n >= minimum && n <= maximum ) { return; }
      } else if (numberType == 'Decimal') {
        if (n >= minimum && n <= maximum) { return; }
      }
    }
    currInput.val('');
    alert(alertMessage);
 }



/**
 * The getPubmedRference function will make an ajax call to the pubmed api to get the information needed to create an article reference citation
 *
 * @param {string} refId - the pubmed Id of the article that citation is to be created from.
 * @param {string} clicked - element that triggers the function call

 *  getJSON call and citation structure based off an example written by Alex Hadik http://www.alexhadik.com/blog/2014/6/12/create-pubmed-citations-automatically-using-pubmed-api
 */
function getPubmedReference(clicked, refId){
  console.log(refId)
  if(refId != ''){
    $.getJSON('https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&retmode=json&id='+refId, function(data){
      var dataResultContent = data.result[refId];
      var citation = "";
      for(author in dataResultContent.authors){
          citation += dataResultContent.authors[author].name + ', ';
      }
      citation += ' \"' + dataResultContent.title + '\" <i>' + dataResultContent.fulljournalname + '</i> ' + dataResultContent.volume + '.' + dataResultContent.issue + ' (' + dataResultContent.pubdate + '): ' + dataResultContent.pages + '.';
      var newReferences = $('#refBox').html();
      if (newReferences == '' || newReferences == '<br>'){
        newReferences = citation;
      } else {
        newReferences = newReferences + '<br><br>'+ citation;
      }
      $('#refBox').html(newReferences);
      $('#pubmedReferenceId').val('');
    });
  }
}


$(function() {

  if($('#getPubmedReferencesButton').length){
    if($('script[src="js/niceedit/nicEdit.js"]').length === 0){
      $.getScript( "js/niceedit/nicEdit.js", function( data, textStatus, jqxhr ) {
        console.log( "Load was performed." );
        if($('#fancyTextPanel1').length){
          var microDescEditorReferences = new nicEditor();
          microDescEditorReferences.setPanel('fancyTextPanel1');
          microDescEditorReferences.addInstance('refBox');
        }
      });
    } else {
      bkLib.onDomLoaded(function() {
        if($('#fancyTextPanel1').length){
          var microDescEditorReferences = new nicEditor();
          microDescEditorReferences.setPanel('fancyTextPanel1');
          microDescEditorReferences.addInstance('refBox');
        }
      });
    }
    $(document).keypress(function(event){
      if (event.which == '13' && $(':focus').attr('id') != 'refBox') {
        event.preventDefault();
      }
    });
    $('#getPubmedReferencesButton').click(function(e) {
      e.preventDefault();
      var refId = $('#pubmedReferenceId').val();
      getPubmedReference($(this), refId);
    });
    $('.references').hide();
    $('#refBox').css('border', '1px solid black');
    $('#stepFormSubmitButton').click(function(ev){
      ev.preventDefault();
      // Make sure refNiceEdit content is saved to reference textarea.
      $('.references').val($('#refBox').html());
      $('[name="stepForm"]').submit();
    });
  }

});
