

$(document).ready(function() {

  $('#panels_genes').change(function(){
    var genelist = $(this).val().trim();
    validateGenes(genelist);
  });

  showGenesDiv($('#panels_isCustomGenePanel'));
  $('#panels_isCustomGenePanel').change(function() {
     showGenesDiv($(this));
  });


});

function showGenesDiv(isCustomGenePanel) {
     if(isCustomGenePanel.is(':checked')) {
          $('#panels_genesDiv').hide();
          $('#panels_genesDiv').val('');
     } else {
          $('#panels_genesDiv').show();
     }
}

function validateGenes(genelist){

  if(genelist == ''){
    return false;
  }

  if(genelist != ''){
    $.getJSON(getGeneURL()).done(function(data) {

      var itemsInList = getPotentialGenes(data, genelist);
      var genes = itemsInList.genes;
      var alias = itemsInList.alias;
      var notFound = itemsInList.not_found;
      var popupBodyText = '<div><h3>Invalid GENELIST items</h3>';

      if(alias.length > 0){
        popupBodyText += '<p style="word-wrap: break-word">Aliases: '+ alias + '</p>';
      }
      if(notFound.length > 0){
        popupBodyText += '<p style="word-wrap: break-word">Items not found: '+ notFound + '</p>';
      }
      popupBodyText += '</div>';
      if(notFound.length > 0 || alias.length > 0){
        displayNotFoundPopup("#itemsNotFoundDialog", 'Invalid Gene List items', popupBodyText, '#interpretation')
        $('#genelistPass').val('false');
      } else {
        $('#genelistPass').val('true');
      }
    });
  }
}