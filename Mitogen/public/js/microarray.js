/**
 * Frameshift
 * JavaScript Microarray specific Functions
 *
 * @author Wendy Goller
 * @copyright 2017 Sunquest Information Systems
 * @version 1.0.20171020
 */


/**
 * Initialize dialog options
 *
 * @param {string} dialogId
 * @param {string} title
 * @param {string} clickItem
 * @param {string} dialogHeight
 * @param {string} dialogWidth
 * @param {boolean} isDraggable
 * @param {boolean} isModal
 * @param {string} positDialog
 * @param {string} positClickItem
 * @param {function} closeCallback

 * @returns {object}
 */
function initDialog(dialogId, title, clickItem, dialogHeight, dialogWidth, isDraggable, isModal, positDialog, positClickItem, closeCallback) {

  var dialog = $(dialogId).dialog({
    autoOpen: false,
    title: title,
    modal: isModal,
    draggable: isDraggable,
    width: dialogWidth,
    height: dialogHeight,
    position: {
      my: positDialog, at: positClickItem, of: clickItem
    },
    close: function() {
      closeCallback();
      dialog.dialog("close");
    }
  });

  return dialog;
}


/**
 *
 *
 * @param {string} json. Data is expectied in json structure to be gene(OMIMNUmber).
 * @param {string} checkOnload - whether the checkbox should be checked when loaded.
 * @returns {object} array of gene json objects.
 *
 */
function parseOmimGeneData(json, checkOnload) {
  var jsonData = json;
  var returnArray = [];
  var k = 0;
  while (k < jsonData.length) {
    jsonData = jsonData.replace(')', '');
      k++;
  }
  var jsonDataArray = jsonData.split(',');
  jsonDataArray.forEach(function (gene, pos) {
      var tempMim, tempSynd, mimSynArr;
      var tempArray = gene.split('(');
      var tempGene = tempArray[0].trim()
      if(tempArray[1]){
        mimSynArr = tempArray[1].split('[')
      } else {
        mimSynArr = [];
      }
      if(mimSynArr.length > 1){
        tempMim = mimSynArr[0]
        tempSynd = mimSynArr[1].replace(']','')
      } else {
        tempMim = tempArray[1]
        tempSynd = ''
      }
      var tempObj = {gene: tempGene, mim: tempMim, syndrome: tempSynd, checkedOnload: checkOnload}
      if(tempMim){
        returnArray.push(tempObj);
      }
  });
  return returnArray;
}


/**
 *
 * @param {string} geneString - string of genes to be displayed
 * @param {string} div - element
 *
 */
function getGeneHTMLLayout(geneString, div) {
  if (geneString.match("^,")) {
    geneString = geneString.replace(',', '');
  }
  $(div).html('<p>' + geneString + '</p>');
}


/**
 * getOmimHTMLLayout function
 *
 * The html layout for the Omim gene list popup. Within this popup the user can select and save the omim numbers that will be used on the CMA report.
 *
 * @param {array} geneArray
 * @param {string} div
 *
 */
function getOmimHTMLLayout(geneArray, div) {
  var generatedHtml = '<div id="dialog-form" title="OmimGenesDialog"><form><fieldset>';
  //layout of initial search to add new genes to table below.
  generatedHtml +='<div class="nclear" id="addGeneArea">To Add a missing gene to the list below enter one of the following: the gene, syndrome or mim # and click the "Add New Genes" button.';
  generatedHtml +='<div>';
  generatedHtml +='<div class="nclear" id="SelectionPopup" style="display: none;"></div>';
  generatedHtml +='<div class="nclear" id="SelectionPopup2" style="display: none;"></div>';
  generatedHtml +='<div class="nclear" id="newGeneArea"><label>Enter Search Value: </label>';
  generatedHtml +='<input type="text" id="newGene"></div>';
  generatedHtml +='<div class="nclear" id="buttonArea"><button type="button" title="Add New Gene" class="addNewGene dialogButton button">Add New Gene</button></div>';
  generatedHtml +='</div>';
  generatedHtml +='</div>';

  // table of genes and omim numbers available to select for the row of the table.
  generatedHtml +='<div class="nclear" id="checkAllArea"><input type="checkbox" class="includeOmimCkAll"><label for="includeOmimCkAll">Check All</label></div>';
  generatedHtml +='<button type="button" title="Save" class="saveButton dialogButton button">Save</button>';
  generatedHtml +='<table id="OmimGenesSelected" class="ui-widget ui-widget-content nclear">';
  generatedHtml +='<thead><tr class="ui-widget-header">';
  generatedHtml +='<th class="stdTh geneAbrev">Gene</th>';
  generatedHtml +='<th class="stdTh mimNum">MIM #</th>';
  generatedHtml +='<th class="stdTh syndrome">Syndrome</th>';
  generatedHtml +='<th class="stdTh checkboxDiv">Include</th>';
  generatedHtml +='</tr></thead><tbody>';

  geneArray.forEach(function(item, i) {
    generatedHtml +='<tr class="row'+i+'">';
    generatedHtml +='<td class="geneAbrev">'+ item.gene + '</td>';
    generatedHtml +='<td class="mimNum"><a href="https://www.omim.org/entry/'+ item.mim + '?search='+item.mim+'&highlight='+item.mim+'" target="_blank">'+item.mim+'</a></td>';
    generatedHtml +='<td class="syndrome">'+ item.syndrome + '</td>';
    if(item.checkedOnload == 'true'){
      generatedHtml +='<td class="checkboxDiv"> <input type="checkbox" class="includeOmim" checked ></td>';
    } else {
      generatedHtml +='<td class="checkboxDiv"> <input type="checkbox" class="includeOmim" ></td>';
    }
    generatedHtml +='</tr>';
  });
  generatedHtml +='</tbody></table>';
  generatedHtml +='</fieldset></form></div>';

  $(div).html(generatedHtml);

  $(div).focus();

  $('#addGeneArea').css('border-bottom', '1px solid grey')
  $('#addGeneArea').css('display', 'inline-block')
  $('.geneAbrev').css('width', '100px');
  $('.mimNum').css('width', '100px');
  $('.syndrome').css('width', '200px');


  $('.checkboxDiv').css('width', '100px');
  $('.nclear').css('clear', 'both');
  $('.nclear').css('width', '100%');
  $('.nclear').css('margin-top', '5px');
  $('.nclear').css('margin-bottom', '5px');
  $('.saveButton').css('float', 'right');
  $('#checkAllArea').css('float', 'left');
  $('#checkAllArea').css('width', '25%');

  $('.dialogButton').css('font-size', '14px !important');
  $('.dialogButton').css('border', 'none');
  $('.dialogButton').css('padding', '5px 12px');
  $('.dialogButton').css('margin', '5px');
  $('.dialogButton').css('color', '#1b93c3 !important');
  $('.dialogButton').css('background-color', '#ebebeb');
  $('.dialogButton').css('text-decoration', 'none');
  $('.dialogButton').css('text-transform', 'uppercase');
  $('.dialogButton').css('cursor', 'pointer');
  $('.dialogButton').css('-webkit-border-radius', '2px');
  $('.dialogButton').css('-moz-border-radius', '2px');
  $('.dialogButton').css('border-radius', '2px');
  $('.dialogButton').css('-webkit-box-shadow', '0px 2px 2px 0px rgba(50, 50, 50, 0.2)');
  $('.dialogButton').css('-moz-box-shadow', '0px 2px 2px 0px rgba(50, 50, 50, 0.2)');
  $('.dialogButton').css('box-shadow', '0px 2px 2px 0px rgba(50, 50, 50, 0.2)');

  $('#OmimGenesSelected tbody tr').each(function(i, item){
    if(i%2 != 0){
      $(this).addClass('stdRow odd');
    } else {
      $(this).addClass('stdRow even');
    }
  });
  $('#OmimGenesSelected').addClass('display dataTable')

  $('#OmimGenesSelected tbody').addClass('stdTbody')

}

/**
 * changeGeneSelected function
 *
 * @param {string} key
 *
 */
function changeGeneSelected(key){
  $('#addNewSelection tbody tr').each(function(){
    if($(this).find('.omim').html() == key && $(this).find('.addOmimck').prop('checked')){
      addSelectedOption(key);
    }
  });
}


/**
 * addSelectedOption function
 *
 * @param {string} key
 *
 */
function addSelectedOption(key){
  $('.addOmimck').prop('checked', false);
  $('#addNewSelection tbody tr').each(function(){
    if($(this).find('.omim').html() == key){
      $(this).find('.addOmimck').prop('checked', true);
      $('#newGeneAbrevOR').val($(this).find('.selectGene').val());
      $('#newGeneMimOR').val($(this).find('.omim').html());
      $('#newGeneSyndromeOR').val($(this).find('.syndrome').html());
    }
  });
}



/**
 * removeSelectedOption function
 *
 * @param {string} key
 *
 */
function removeSelectedOption(key){
  console.log('key', key)
  $('.addOmimck').prop('checked', false);
  $('#addNewSelection tbody tr').each(function(){
    if($(this).find('.omim').html() == key){
      $(this).find('.addOmimck').prop('checked', false);
      $('#newGeneAbrevOR').val('');
      $('#newGeneMimOR').val('');
      $('#newGeneSyndromeOR').val('');
    }
  });
}



/**
 * getOmimORHTMLLayout function
 *
 * popup displayed when the user searched for a gene, omim number or syndrome.
 *
 * @param {array} currGeneArray - array of json nodes that match search criteria
 * @param {string} div
 * @param {array} codeArr - array of all codes found
 * @param {array} diseaseArr - array of all syndromes found
 * @param {array} abrevArr - array of all abbreviations found
 *
 */
function getOmimORHTMLLayout(currGeneArray, div, codeArr, diseaseArr, abrevArr) {

  var generatedHtml = '<div id="dialog-form1" title="OmimGeneSelectionDialog"><form><fieldset>';
  var searchCode1 = '';
  var searchDisease1 = '';
  var searchAbrev1 = '';

  if(currGeneArray.length > 0){
    generatedHtml +='<p>Please select option below.</p>'

    generatedHtml +='<table id="addNewSelection" class="ui-widget ui-widget-content nclear">';
    generatedHtml +='<thead><tr class="ui-widget-header">';
    generatedHtml +='<th class="stdTh addSelectCk">Select</th>';
    generatedHtml +='<th class="stdTh omim">OMIM #</th>';
    generatedHtml +='<th class="stdTh abrev">Gene</th>';
    generatedHtml +='<th class="stdTh syndro">Syndrome</th>';
    generatedHtml +='</tr></thead><tbody>';
    currGeneArray.forEach(function(item, i) {
      if(currGeneArray.length == 1){
        generatedHtml +='<td class="checkboxDiv"> <input type="checkbox" class="addOmimck" checked></td>';
      } else {
        generatedHtml +='<td class="checkboxDiv"> <input type="checkbox" class="addOmimck" ></td>';
      }
      generatedHtml +='<td class="omim">'+ item.key +'</td>';
      if(item.geneArray.length == 1){
        generatedHtml +='<td class="omim"><input type="text" class="selectGene" value="'+ item.geneArray.toString() +'"></td>';
      } else {
        generatedHtml +='<td class="gene"><select class="selectGene" >';
        generatedHtml +='<option value=""></option>';
        $.each(item.geneArray, function(it, val) {
          generatedHtml +='<option value="'+val+'">'+val+'</option>';
        });
        generatedHtml +='</select></td>';
      }
      generatedHtml +='<td class="syndrome">'+ item.syndrome + '</td>';
      generatedHtml +='</tr>';
    });
    generatedHtml +='</tbody></table>';

    generatedHtml +='<div id="manualSection">';
    generatedHtml +='<p>The gene and/or omim number entered was not found. To add this manually complete the information below and save. If you do not want to add this manually click Cancel.</p>'

    if(codeArr.length == 1){
      searchCode1 = codeArr[0].toString();
    }
    if(abrevArr.length == 1 && abrevArr[0].length == 1){
      searchAbrev1 = abrevArr[0].toString();
    }
    if(diseaseArr.length == 1){
      searchDisease1 = diseaseArr[0].toString();
    }
  } else {
    generatedHtml +='<div id="manualSection">';
    generatedHtml +='<p>The gene and/or omim number entered was not found. To add this manually complete the information below and save. If you do not want to add this manually click Cancel.</p>'
  }

  generatedHtml +='<div class="nclear" id="newGeneArea2"><label>Enter New Gene MIM #: <input type="text" id="newGeneMimOR" value="'+ searchCode1 +'"></label></div>';
  generatedHtml +='<div class="nclear" id="newGeneArea1"><label>Enter New Gene Abbreviation: <input type="text" id="newGeneAbrevOR" value="'+ searchAbrev1 +'"></label></div>';
  generatedHtml +='<div class="nclear" id="newGeneArea3"><label>Enter New Gene Syndrome: <input type="text" id="newGeneSyndromeOR" value="'+ searchDisease1 +'"></label></div>';
  generatedHtml +='</div>';
  generatedHtml +='</fieldset></form></div>';

  $(div).html(generatedHtml);
  $(div).focus();

  $('#manualSection').hide();
  if(currGeneArray.length == 0){
    $('#manualSection').show();
  }

  $('.nclear').css('clear', 'both');
  $('.nclear').css('width', '100%');
  $('.nclear').css('margin-top', '5px');
  $('.nclear').css('margin-bottom', '5px');
  $('#newGeneMimOR').css('width', '200px');
  $('#newGeneAbrevOR').css('width', '200px');
  $('#newGeneSyndromeOR').css('width', '200px');

  $('.dialogButton').css('font-size', '14px !important');
  $('.dialogButton').css('border', 'none');
  $('.dialogButton').css('padding', '5px 12px');
  $('.dialogButton').css('margin', '5px');
  $('.dialogButton').css('color', '#1b93c3 !important');
  $('.dialogButton').css('background-color', '#ebebeb');
  $('.dialogButton').css('text-decoration', 'none');
  $('.dialogButton').css('text-transform', 'uppercase');
  $('.dialogButton').css('cursor', 'pointer');
  $('.dialogButton').css('-webkit-border-radius', '2px');
  $('.dialogButton').css('-moz-border-radius', '2px');
  $('.dialogButton').css('border-radius', '2px');
  $('.dialogButton').css('-webkit-box-shadow', '0px 2px 2px 0px rgba(50, 50, 50, 0.2)');
  $('.dialogButton').css('-moz-box-shadow', '0px 2px 2px 0px rgba(50, 50, 50, 0.2)');
  $('.dialogButton').css('box-shadow', '0px 2px 2px 0px rgba(50, 50, 50, 0.2)');


  $('#addNewSelection tbody tr').each(function(i, item){
    if(i%2 != 0){
      $(this).addClass('stdRow odd');
    } else {
      $(this).addClass('stdRow even');
    }
  });
  $('#addNewSelection').addClass('display dataTable')

  $('#addNewSelection tbody').addClass('stdTbody')

}


/**
 * searchGenesByCode function
 * This function takes the user entered search critera (Looking for the omim number) and searches the gene-disease.json file for a matching Omim number.
 * If the omim number is found and there is only one gene linked to it then it will automatically populate the list.
 * If the Omim number is found and there are multiple possible genes for the omim number an additional popup will be displayed allowing the user to select which gene they are wanting to specify.
 * If the Omim number is not found then a manual override popup is called which will allow the user manually type the gene, omim number and syndrome into text fields.
 * when the gene is saved then it will be displayed in the gene table as a checked gene-omim number pair.
 *
 * @param {string} searchItem - string to use as search parameter
 * @param {string} clicked - element
 * @param {function} Callback - function
 *
 */
function searchGenesByCode(searchItem, clicked, diseaseGeneJson, Callback) {
  var reItem = new RegExp(searchItem, "gi");
  var searchCode = '';
  var searchDisease = '';
  var geneSelected = '';
  var foundItem = diseaseGeneJson.filter(function(element){
    var cGeneArr = element.geneArray
    var cOmim = element.key
    var cSyn = element.syndrome
    if(cOmim.search(reItem) !== -1){
      return element
    } else if(cSyn.search(reItem) !== -1) {
      return element
    } else {
      for(var i = 0; i < cGeneArr.length; i++){
        if(cGeneArr[i].search(reItem) !== -1){
          return element
        }
      }
    }
  });

  if(foundItem.length == 1 && foundItem[0].geneArray.length == 1){
    searchCode = foundItem[0].key
    searchDisease = foundItem[0].syndrome
    geneSelected = foundItem[0].geneArray.toString();
    Callback({gene: geneSelected, mim: searchCode, syndrome: searchDisease, checkedOnload: "true"});

  } else {
    var mimNoArr = foundItem.map(function(element){
      return element.key
    });
    var syndArr = foundItem.map(function(element){
      return element.syndrome
    });
    var genesArr = foundItem.map(function(element){
      return element.geneArray
    });

    getOmimORHTMLLayout(foundItem, '#SelectionPopup2', mimNoArr, syndArr, genesArr);

    $('#newGeneAbrevOR').on('change', function() {
      geneSelected = this.value;
      $('#newGeneAbrevOR').val(this.value);
    });

    $('#newGeneMimOR').on('change', function() {
      overRideCode = this.value;
      $('#newGeneMimOR').val(this.value);
    });

    $('#newGeneSyndromeOR').on('change', function() {
      seachDisease = this.value;
      $('#newGeneSyndromeOR').val(this.value);
    });

    $('select.selectGene').on('change', function() {
      changeGeneSelected($(this).parent('td').siblings('td.omim').html())
    });


    $('.addOmimck').on('click', function() {
      console.log($(this).parent('td').siblings('td.omim').html())
      console.log($(this).is(':checked'))
      if($(this).is(':checked')){
        addSelectedOption($(this).parent('td').siblings('td.omim').html())
      } else {
        removeSelectedOption($(this).parent('td').siblings('td.omim').html())
      }
    });
    //Two additional functions are inline to allow for key population.

    //dialog init must be after the click functionality is declared in order to allow multiple click functionality.
    var dialogGeneOverRide = initDialog('#SelectionPopup2'
                                      , "Add Gene: "
                                      , clicked
                                      , "400"
                                      , "600"
                                      , true
                                      , false
                                      , "center top"
                                      , "center top"
                                      , function(){$('#SelectionPopup2').html('');}
                                      );

    dialogGeneOverRide.dialog("option", "buttons", {
      Cancel: function(){
        $('#SelectionPopup2').html('');
        dialogGeneOverRide.dialog("close");
        dialogGeneOverRide.dialog( "destroy" );
      },
      Save: function(){
        var SaveGeneSelected = $('#newGeneAbrevOR').val();
        var SaveOverRideCode = $('#newGeneMimOR').val();
        var SaveSearchDisease = $('#newGeneSyndromeOR').val();
        if(SaveGeneSelected != '' && SaveOverRideCode != ''){
          geneObj = {gene: SaveGeneSelected, mim: SaveOverRideCode, syndrome: SaveSearchDisease, checkedOnload: "true"};
          Callback(geneObj);
          $('#SelectionPopup2').html('');
          $('#newGeneAbrevOR').val('');
          $('#newGeneMimOR').val('');
          $('#newGeneSyndromeOR').val('');
          dialogGeneOverRide.dialog("close");
          dialogGeneOverRide.dialog( "destroy" );
        } else {
          if(SaveGeneSelected == '' && SaveOverRideCode == ''){
            alert('Both Gene and Mim number must be entered.');
          } else if(SaveGeneSelected == ''){
            alert('Gene must be entered.');
          } else if(SaveOverRideCode == ''){
            alert('Mim number must be entered.');
          }
        }
      }
    });
    dialogGeneOverRide.dialog('open');
    dialogGeneOverRide.focus();

  }
}


/**
 * getGenes function allows a url hyperlink to pull the gene list for a given row. This is the beginning of the gene popup triggers
 *
 * @param {string} url - href from element clicked.
 * @param {string} clicked - element
 *
 *  If the url contains the omim=true flag then It will pull the omim genes for the row vs the genes tested list.
 *  If omim genes are pulled a popup will be populated with the ability to select Omim mim # to be saved and displayed on the report.
 */

function getGenes(url, clicked) {
  var title;
  if(url.indexOf("omim=true") > -1){
    title = "OMIM Genes"
  } else {
    title = "Genes"
  }
  console.log('title', title);
  var urlArray = url.split('mergeId=');
  var mergeId = url.split('mergeId=')[1].split('&')[0];
  var dialog;
  if(title == "OMIM Genes"){
    dialog = $('#geneDialog').dialog({
      autoOpen: false,
      title: title,
      modal: true,
      draggable: true,
      width: "600",
      height: "500",
      position: {
        my: "right center", at: "left top", of: clicked
      },
      close: function() {
        $('#geneDialog').html('');
        dialog.dialog("close");
      },
      // leave as object and not as an array for buttons.
      buttons:{
        Cancel: function(){
          $('#geneDialog').html('');
          dialog.dialog("close");
        }
      }
    });
  } else {
    dialog = $('#geneDialog').dialog({
      autoOpen: false,
      title: title,
      modal: true,
      draggable: true,
      width: "600",
      height: "200",
      position: {
        my: "right center", at: "left top", of: clicked
      },
      close: function() {
        $('#geneDialog').html('');
        dialog.dialog("close");
      },
      // leave as object and not as an array for buttons.
      buttons:{
        Cancel: function(){
          $('#geneDialog').html('');
          dialog.dialog("close");
        }
      }
    });
  }


  $.getJSON(url).done(function(data) {
    console.log('data', data)
    var cmaResultSample = data[0].cmaResultSample
    var genesString = data[0].genes;
    var genesStringSelected = data[0].selectedGenes;
    var genesOrigString = data[0].genes;
    var geneObjArray = parseOmimGeneData(data[0].genes, 'false');
    var selectedGeneObjArray = parseOmimGeneData(data[0].selectedGenes, 'true');
    var origGeneObjArray = parseOmimGeneData(data[0].genes, 'false');

    var tempGeneArray = geneObjArray.filter(function(item){
      var removeItem = false;
      for(var i = 0; i < selectedGeneObjArray.length; i++){
        if(selectedGeneObjArray[i].mim == item.mim){
          removeItem = true;
        }
      }
      if (!removeItem){
        return item;
      }
    });

    //Create new array to be usded by the html creation that will put all selected values at the top of the list.
    var multiGeneArray = selectedGeneObjArray.concat(tempGeneArray);

    // create overall array to store values to save to the database as selected genes using this array instead of the selectedGeneObjArray allows the ability to revert to original.
    var overallGeneList = selectedGeneObjArray.filter(function(item){
      if (item.mim){
        return item;
      }
    });

    /**
     * getGenePopupHtml is a Subfunction of getGenes
     *
     *  Uses parent url variable to determine if the link clicked was for omim genes or genes tested.
     *  Uses the parent multiGeneArray variable that stores the genes that should be displayed for the row selected
     *
     *  If the url contains the omim=true flag then It will pull the omim genes for the row vs the genes tested list.
     *  If omim genes are pulled a popup will be populated with the ability to select Omim mim # to be saved and displayed on the report.
     */
    function getGenePopupHtml(){
      // If the url has omim parameter as true then call the OMIM popup otherwise call the gene list popup.
      if(title == "OMIM Genes"){

        //get the specific layout for the popup. Certain fields functionality is set below.
        getOmimHTMLLayout(multiGeneArray, '#geneDialog');

        // when the checkbox is checked in the table it will add or remove the checked item to the array that is used to hold which values are checked.
        $('.includeOmim').each(function() {
          addRemoveMim($(this).is(':checked'), $(this).parent().parent().children('td.mimNum').children('a').html());
        });


        // when the checkbox is checked in the table it will add or remove the checked item to the array that is used to hold which values are checked.
        $('.includeOmim').click(function() {
          addRemoveMim($(this).is(':checked'), $(this).parent().parent().children('td.mimNum').children('a').html());
        });

        // the checkall checkbox will check all items in the table and add them to the array that is used to hold which values are checked.
        $('.includeOmimCkAll').click(function(){
          var checkval = $(this).is(':checked');
          $('.includeOmim').each(function() {
            $(this).prop('checked',checkval);
            addRemoveMim(checkval, $(this).parent().parent().children('td.mimNum').children('a').html());
          });
        });

        // The save button will call the post to write the selected mim numbers to the database for the specific row and then will close the popup.
        $('.saveButton').click(function(){
          $.post('/uniflow',{
              stepName: 'deleteReportingOmimGenesForId'
              ,Submit:true
              ,accountId: 'UNICONNECT'
              ,userAccessLevel: 10
              ,formNumber:0
              ,sampleId: data[0].cmaResultSample
              ,rawResultId: mergeId
            }, function(){
              overallGeneList.forEach(function(item, i) {
              $.post('/uniflow',{
                stepName: 'submitReportingOmimGenes'
                ,Submit: true
                ,accountId: 'UNICONNECT'
                ,userAccessLevel: 10
                ,formNumber: 0
                ,sampleId: data[0].cmaResultSample
                ,gene: item.gene
                ,mimNo: item.mim
                ,syndromeName: item.syndrome
                ,rawResultId: mergeId
              });
              });
            });
          $('#geneDialog').html('');
          dialog.dialog("close");
          dialog.dialog( "destroy" );
        });

        // Allows the ability to add new items to the gene list via search.
        $('.addNewGene').click(function(){
          var disease_url = '/genes/gene-disease.json';
          // if the search critera is left blank force the manual entry fields to display
          if($.trim($('#newGene').val()) == ''){
            // the searchGenesByCode function is called so the override popup will be generated and displayed. It doesn't actually do a search since the contents of the array (parameter 3) are empty.
            searchGenesByCode($.trim($('#newGene').val()), $('#newGene'), [], function(newGeneObj){
              if(newGeneObj != 'false'){
                selectedGeneObjArray.push(newGeneObj);
                multiGeneArray.unshift(newGeneObj);
                getGenePopupHtml();
              }
            });
          } else{
            $.getJSON(disease_url).done(function(data) {
              var omimDiseaseGeneArray = [];
              var re = new RegExp("OMIM:", "gi");

              //Translate the data json object to be an object with a restructure of the json
              for(var item in data) {
                if ((data[item].code).search(re) != -1) {
                  omimDiseaseGeneArray.push({key: (data[item].code).substring(5), syndrome: item, geneArray:data[item].genes})
                }

              }
              searchGenesByCode($.trim($('#newGene').val()), $('#newGene'), omimDiseaseGeneArray, function(newGeneObj){
                if(newGeneObj != 'false'){
                  var isInarray = selectedGeneObjArray.filter(function(element){
                    var sGen = element.gene
                    var smim = element.mim
                    var sSynd = element.syndrome
                    if(smim.search(newGeneObj.mim) !== -1 && sGen.search(newGeneObj.gene) !== -1){
                      return element
                    }
                  });
                  if(isInarray.length > 0){
                    alert('The gene and omim number combination is already selected in the list.')
                    getGenePopupHtml();
                  } else {
                    selectedGeneObjArray.push(newGeneObj);
                    multiGeneArray.unshift(newGeneObj);
                    getGenePopupHtml();
                  }
                }
              });
            }).fail(function(jqxhr, textStatus, error) {
              var err = "Request Failed: " + textStatus + ", " + error;
              console.log(err);
              alert(err);
            });
          }
        });

      } else {
        // get the gene list popup html.
        getGeneHTMLLayout(data[0].genes, '#geneDialog');
      }
    }


    /**
     * Subfunction of getGenes. This function will add the genes to the arrays that are used to populate what should and what should not be checked.
     * These arrays are
     * @param {string} shouldInclude - string true or false
     * @param {string} currentRowMim - mim number value of object to find in multiGeneArray and overallGeneList Arrays
     *
     * function manipulates and populates the multiGeneArray and the overallGeneList variables.
     */
    function addRemoveMim(shouldInclude, currentRowMim){
      if(shouldInclude){
        for(var i = 0, l = multiGeneArray.length; i < l; i++) {
          if (multiGeneArray[i].mim == currentRowMim){
            if (overallGeneList.indexOf(multiGeneArray[i]) == -1){
              multiGeneArray[i].checkedOnload = 'true'
              overallGeneList.push(multiGeneArray[i]);
            }
          }
        }
      } else {
        for(var i = 0, l = multiGeneArray.length; i < l; i++) {
          if (multiGeneArray[i].mim == currentRowMim){
              multiGeneArray[i].checkedOnload = 'false'
          }
        }
        for(var i = 0, l = overallGeneList.length; i < l; i++) {
          var curItem = overallGeneList[i];
          if(curItem.mim == currentRowMim){
            overallGeneList.splice(i, 1);
            break;
          }
        }
      }
    }

    getGenePopupHtml();
    dialog.dialog('open');
    dialog.focus();

  }).fail(function(jqxhr, textStatus, error) {
    var err = "Request Failed: " + textStatus + ", " + error;
    console.log(err);
    alert(err);
  });
}
// END of getGenes function



/**
 * mergeTableRows function will merge selected rows if the rows have the same chromosome number and the types are the same for all rows to be merged.
 *
 * @param {string} clicked - element (typically a button) clicked
 *
 * The function will look for all rows in the the table with the id of rawResultsTable

*/
function mergeTableRows(clicked){
  var rowsArray = [];
  var mergeRowObj = {
                      row: ''
                      ,mergeRowId: ''
                      ,isChecked: 'true'
                      ,maxOverlap: ''
                      ,chromosome: ''
                      ,cytobandStart: ''
                      ,cytoBandEnd:  ''
                      ,cytoCall: ''
                      ,interpretation: ''
                      ,ctype: ''
                      ,size: ''
                      ,min: ''
                      ,microaNom: ''
                      ,max: ''
                      ,rawResultId: ''
                      ,sampleName: ''
                      ,cytoRegions: ''
                      ,cnState: ''
                      ,markerCount: ''
                      ,geneIdList:''
                      ,geneIdListCount: 0
                      ,omimGeneIdListCount: 0
                    }

  var topRowClass = '';
  var rowEO = ''
  var numChecked = $('#rawResultsTable tbody tr td input.onReport:checked').length
  if(numChecked > 1){
    var mergeUrl = 'uniflow?callback=?&stepName=AjaxGetMergeId'
    $.getJSON(mergeUrl).done(function(data) {
      mergeRowObj.mergeRowId = 'merge_'+ data[0].mergeId
      function getGeneCount(colContents){
        if (colContents != undefined && colContents.indexOf("<br>") >= 0 ){
           var tempGeneCounter = colContents.split('<br>')
          return tempGeneCounter[0]*1
        } else {
          return colContents *1;
        }
      }

      $('#rawResultsTable tbody tr').each(function(){
        if(topRowClass == ''){
          if($(this).hasClass('odd')){
            topRowClass = 'even';
            rowEO = 1;
          } else {
            topRowClass = 'odd';
            rowEO = 0;
          }
        }
        if ($(this).children('td').children('.onReport').is(':checked')){
          var tempObj = {
                          row: $(this)
                          ,isChecked: 'true'
                          ,maxOverlap: $(this).children('td').children('.maxOverlap').val()
                          ,chromosome: $(this).children('td').children('.chromosome').val()
                          ,cytobandStart: $(this).children('td').children('.cytobandStart').val().trim()
                          ,cytoBandEnd: $(this).children('td').children('.cytoBandEnd').val().trim()
                          ,cytoCall: $(this).children('td').children('.cytoCall').val().trim()
                          ,interpretation: $(this).children('td').children('.interpretation').val().trim()
                          ,ctype: $(this).children('td').children('.type').val().trim()
                          ,size: $(this).children('td').children('.size').val()
                          ,min: $(this).children('td').children('.min').val()
                          ,microaNom: $(this).children('td').children('.microaNom').val()
                          ,max: $(this).children('td').children('.max').val()
                          ,rawResultId: $(this).children('td').children('.rawResultId').val()
                          ,sampleName: $(this).children('td').children('.sampleName').val()
                          ,cytoRegions: $(this).children('td.col17').html()
                          ,cnState: $(this).children('td.col10').html()
                          ,markerCount: $(this).children('td.col14').html()
                          ,geneCount: getGeneCount($(this).children('td.col9').html())
                          ,omimGeneCount: getGeneCount($(this).children('td.col15').html())
                        }
          rowsArray.push(tempObj);
        }
      })
      var cytobandStartArray = [],
          cytobandEndArray = [],
          cytoCallArray = [],
          interpretationArray = [],
          cnStateArray = [],
          nomenEndValArray = [];

      for(var i=0; i< rowsArray.length; i++){

        // get the largest max Overlap
        if(mergeRowObj.maxOverlap == '' && rowsArray[i].maxOverlap != ''){
          mergeRowObj.maxOverlap = rowsArray[i].maxOverlap;
        } else if(rowsArray[i].maxOverlap != ''){
          mergeRowObj.maxOverlap = 1*mergeRowObj.maxOverlap + 1*rowsArray[i].maxOverlap;
        }

        // get the chromosome
        if(mergeRowObj.chromosome == ''){
          mergeRowObj.chromosome = rowsArray[i].chromosome;
        } else if(mergeRowObj.chromosome != rowsArray[i].chromosome){
          alert('The rows selected to merge must all be on the same chromosome.  Check the selection and try again.');
          return false;
        }

        // get the cytobandStart
        if(cytobandStartArray.length == 0){
          cytobandStartArray.push(rowsArray[i].cytobandStart);
        } else if(cytobandStartArray.indexOf(rowsArray[i].cytobandStart) == -1){
          cytobandStartArray.push(rowsArray[i].cytobandStart);
        }

        // get the cytoBandEnd
        if(cytobandEndArray.length == 0){
          cytobandEndArray.push(rowsArray[i].cytoBandEnd);
        } else if(cytobandEndArray.indexOf(rowsArray[i].cytoBandEnd) == -1){
          cytobandEndArray.push(rowsArray[i].cytoBandEnd);
        }

        // get the cytoCall
        if(cytoCallArray.length == 0){
          cytoCallArray.push(rowsArray[i].cytoCall);
        } else if(cytoCallArray.indexOf(rowsArray[i].cytoCall) == -1){
          cytoCallArray.push(rowsArray[i].cytoCall);
        }

        // get the interpretation
        if(interpretationArray.length == 0){
          interpretationArray.push(rowsArray[i].interpretation);
        } else if(interpretationArray.indexOf(rowsArray[i].interpretation) == -1){
          interpretationArray.push(rowsArray[i].interpretation);
        }

        // get the type
        if(mergeRowObj.ctype == ''){
          mergeRowObj.ctype = rowsArray[i].ctype;
        } else if(mergeRowObj.ctype != rowsArray[i].ctype){
          alert('The rows selected to merge must all be the same type. Please check selection and try again.');
          return false;
        }

        // get the min
        if(mergeRowObj.min == ''){
          mergeRowObj.min = rowsArray[i].min;
        } else if((rowsArray[i].min*1) < (mergeRowObj.min*1)){

          mergeRowObj.min = rowsArray[i].min;
        }

        // get the max
        if(mergeRowObj.max == ''){
          mergeRowObj.max = rowsArray[i].max;
        } else if((mergeRowObj.max*1) < (rowsArray[i].max *1)){
          mergeRowObj.max = rowsArray[i].max;
        }


        // get the cnState
        if(cnStateArray.length == 0){
          cnStateArray.push(rowsArray[i].cnState);
        } else if(cnStateArray.indexOf(rowsArray[i].cnState) == -1){
          cnStateArray.push(rowsArray[i].cnState);
        }


        var tArr = (rowsArray[i].microaNom).split('x');
        if(nomenEndValArray.length == 0){
          nomenEndValArray.push(tArr[1]);
        } else if(nomenEndValArray.indexOf(tArr[1]) == -1){
          nomenEndValArray.push(tArr[1]);
        }


        // get the cytoRegions
        if(mergeRowObj.cytoRegions == ''){
          mergeRowObj.cytoRegions = rowsArray[i].cytoRegions;
        } else if(mergeRowObj.cytoRegions != rowsArray[i].cytoRegions){
          mergeRowObj.cytoRegions =  mergeRowObj.cytoRegions + ', '+ rowsArray[i].cytoRegions;
        }

        // get the sum of markerCount
        if(mergeRowObj.markerCount == ''){
          mergeRowObj.markerCount = rowsArray[i].markerCount;
        } else {
          mergeRowObj.markerCount = 1*mergeRowObj.markerCount + 1*rowsArray[i].markerCount;
        }

        // get the rawResultIds
        if(mergeRowObj.rawResultId == ''){
          mergeRowObj.rawResultId = rowsArray[i].rawResultId;
        } else if(mergeRowObj.rawResultId != rowsArray[i].rawResultId){
          mergeRowObj.rawResultId =  mergeRowObj.rawResultId + ', '+ rowsArray[i].rawResultId;
        }

        // get the sampleName
        if(mergeRowObj.sampleName == ''){
          mergeRowObj.sampleName = rowsArray[i].sampleName;
        } else if(mergeRowObj.sampleName != rowsArray[i].sampleName){
          mergeRowObj.sampleName =  mergeRowObj.sampleName + ', '+ rowsArray[i].sampleName;
        }

        mergeRowObj.geneIdListCount = mergeRowObj.geneIdListCount + rowsArray[i].geneCount;
        mergeRowObj.omimGeneIdListCount = mergeRowObj.omimGeneIdListCount + rowsArray[i].omimGeneCount;
        // get the rawResultIds to use in urls
        if(mergeRowObj.geneIdList == ''){
          mergeRowObj.geneIdList = rowsArray[i].rawResultId;
        } else if(mergeRowObj.geneIdList != rowsArray[i].rawResultId){
          mergeRowObj.geneIdList =  mergeRowObj.geneIdList + "','"+ rowsArray[i].rawResultId;
        }

      }

      mergeRowObj.interpretation = interpretationArray.join(', ');
      mergeRowObj.cnState =  cnStateArray.join(', ');

      cytobandStartArray.sort();
      mergeRowObj.cytobandStart = cytobandStartArray[0];

      cytobandEndArray.sort();
      var cytobandEndArr2 = []
      for(var i = 0; i < cytobandEndArray.length; i++){
        if(cytobandStartArray.indexOf(cytobandEndArray[i]) == -1){
          cytobandEndArr2.push(cytobandEndArray[i])
        }
      }

      if(cytobandEndArr2.length == 0){
        mergeRowObj.cytoBandEnd = cytobandEndArray[cytobandEndArray.length - 1];
      } else {
        cytobandEndArr2.sort();
        mergeRowObj.cytoBandEnd = cytobandEndArr2[cytobandEndArr2.length - 1];
      }


      var chromosomeConcat = mergeRowObj.chromosome
      if(mergeRowObj.cytobandStart == mergeRowObj.cytoBandEnd){
        chromosomeConcat = chromosomeConcat + mergeRowObj.cytobandStart
      } else {
        chromosomeConcat = chromosomeConcat + mergeRowObj.cytobandStart + mergeRowObj.cytoBandEnd
      }


      nomenEndValArray.sort();
      var microaNomEndValue = ''
      if(mergeRowObj.ctype.toLowerCase() == 'loh'){
        microaNomEndValue = '2 hmz'
      } else {
        microaNomEndValue = nomenEndValArray[(nomenEndValArray.length-1)];
      }
      mergeRowObj.size = (mergeRowObj.max - mergeRowObj.min) / 1000;

      mergeRowObj.microaNom  = 'arr[hg19] '+ chromosomeConcat + '('+ (mergeRowObj.min * 1).toLocaleString() + '-' + (mergeRowObj.max * 1).toLocaleString() +')x'+ microaNomEndValue

      $('#rawResultsTable tbody tr').each(function(){
        if ($(this).children('td').children('.onReport').is(':checked')){
          $(this).children('td.col0').html('<input type="text" class="onReport" readonly="" data-parsley-required="false" name="rawResultsTable_0_1" value="Merged" >');
          $(this).children('td.col20').html('<input type="text" class="mergeId" readonly="" data-parsley-required="false" name="rawResultsTable_0_21" value="' +mergeRowObj.mergeRowId+'" >');
          $(this).hide();
        }
      })

      var nextRowId = $('#rawResultsTable tbody tr').length;
      var newRow = '<tr class="stdRow r' +rowEO+ ' '+topRowClass+'" role="row">'
      newRow = newRow + '<td class="stdTd col0 dt-head-left dt-head-nowrap"><input onfocus="select()" type="checkbox" class="onReport" data-parsley-required="false" name="rawResultsTable_0_1" value="true" tabindex="1" data-parsley-multiple="rawResultsTable_0_1" checked></td>'
      newRow = newRow + '<td class="stdTd col1 dt-head-left dt-head-nowrap" data-order="" data-search=""><input type="text" class="maxOverlap" readonly="" data-parsley-required="false" name="rawResultsTable_0_2" value="'+mergeRowObj.maxOverlap+'"></td>'
      newRow = newRow + '<td class="stdTd col2 dt-head-left dt-head-nowrap" data-order="'+mergeRowObj.chromosome+'" data-search="'+mergeRowObj.chromosome+'"><input type="text" class="chromosome" readonly="" data-parsley-required="false" name="rawResultsTable_0_3" value="'+mergeRowObj.chromosome+'"></td>' //chromosome
      newRow = newRow + '<td class="stdTd col3 dt-head-left dt-head-nowrap" data-order="'+mergeRowObj.cytobandStart+'" data-search="'+mergeRowObj.cytobandStart+'"><input type="text" class="cytobandStart" readonly="" data-parsley-required="false" name="rawResultsTable_0_4" value="'+mergeRowObj.cytobandStart+'"></td>' //cytobandStart
      newRow = newRow + '<td class="stdTd col4 dt-head-left dt-head-nowrap" data-order="'+mergeRowObj.cytoBandEnd+'" data-search="'+mergeRowObj.cytoBandEnd+'"><input type="text" class="cytoBandEnd" readonly="" data-parsley-required="false" name="rawResultsTable_0_5" value="'+mergeRowObj.cytoBandEnd+'"></td>' //cytoBandEnd

      // cytocall row
      newRow = newRow + '<td class="stdTd col5 dt-head-left dt-head-nowrap">'
      newRow = newRow + '<select class="cytoCall" data-parsley-required="false" name="rawResultsTable_0_6" value="'+ mergeRowObj.cytoCall+'" tabindex="1" style="width: 175px;"><option></option>'
      if(cytoCallArray.length >1){
        newRow = newRow + '<option value="Likely Pathogenic">Likely Pathogenic</option><option value="Pathogenic">Pathogenic</option><option value="Unknown Significance">Unknown Significance</option>'
        for(var g = 0; g < cytoCallArray.length; g++){
          if(cytoCallArray[g] != 'Likely Pathogenic' && cytoCallArray[g] != 'Pathogenic' && cytoCallArray[g] != 'Unknown Significance'){
            newRow = newRow + '<option value="'+cytoCallArray[g]+'">'+cytoCallArray[g]+'</option>'
          }
        }
      } else {
        mergeRowObj.cytoCall = cytoCallArray.join(', ');
        if(mergeRowObj.cytoCall != 'Pathogenic' && mergeRowObj.cytoCall != 'Likely Pathogenic' && mergeRowObj.cytoCall != 'Unknown Significance'){
          newRow = newRow + '<option value="'+mergeRowObj.cytoCall+'" selected="">'+mergeRowObj.cytoCall+'</option>'
          newRow = newRow + '<option value="Likely Pathogenic">Likely Pathogenic</option><option value="Pathogenic">Pathogenic</option><option value="Unknown Significance">Unknown Significance</option>'
        }
        if(mergeRowObj.cytoCall == 'Pathogenic'){
          newRow = newRow + '<option value="Likely Pathogenic">Likely Pathogenic</option><option value="Pathogenic" selected="">Pathogenic</option><option value="Unknown Significance">Unknown Significance</option>'
        }
        if(mergeRowObj.cytoCall == 'Likely Pathogenic'){
          newRow = newRow + '<option value="Likely Pathogenic" selected="">Likely Pathogenic</option><option value="Pathogenic">Pathogenic</option><option value="Unknown Significance">Unknown Significance</option>'
        }
        if(mergeRowObj.cytoCall == 'Unknown Significance'){
          newRow = newRow + '<option value="Likely Pathogenic">Likely Pathogenic</option><option value="Pathogenic">Pathogenic</option><option value="Unknown Significance" selected="">Unknown Significance</option>'
        }
      }
      newRow = newRow + '</select></td>'

      // end cytocall row

      newRow = newRow + '<td class="stdTd col6 dt-head-left dt-head-nowrap" data-order="'+mergeRowObj.interpretation+'" data-search="'+mergeRowObj.interpretation+'"><input type="text" class="interpretation" data-parsley-required="false" name="rawResultsTable_0_7" value="'+mergeRowObj.interpretation+'"></td>' //interpretation

      newRow = newRow + '<td class="stdTd col7 dt-head-left dt-head-nowrap" data-order="'+mergeRowObj.ctype+'" data-search="'+mergeRowObj.ctype+'"><input type="text" class="type" readonly="" data-parsley-required="false" name="rawResultsTable_0_8" value="'+mergeRowObj.ctype+'">' //type

      newRow = newRow + '<td class="stdTd col8 dt-head-left dt-head-nowrap" data-order="'+(mergeRowObj.size*1).toFixed(3)+'" data-search="'+(mergeRowObj.size*1).toFixed(3)+'"><input type="text" class="size" data-parsley-required="false" name="rawResultsTable_0_9" value="'+(mergeRowObj.size*1).toFixed(3)+'"></td>' //size

      if(mergeRowObj.geneIdListCount == '0'){
        newRow = newRow + '<td class="stdTd col9 dt-head-left dt-head-nowrap">'+mergeRowObj.geneIdListCount+'</td>' //genes

      } else {
        newRow = newRow + '<td class="stdTd col9 dt-head-left dt-head-nowrap">'+ mergeRowObj.geneIdListCount +'<br><a class="gene" href="uniflow?callback=?&stepName=AjaxGetCMAGenesById&omim=false&mergeId='+mergeRowObj.mergeRowId+'&id='+mergeRowObj.geneIdList+'">view&#160;genes</a></td>' //genes

      }
      newRow = newRow + '<td class="stdTd col10 dt-head-left dt-head-nowrap">'+mergeRowObj.cnState+'</td>' //cnState
      newRow = newRow + '<td class="stdTd col11 dt-head-left dt-head-nowrap" data-order="'+mergeRowObj.min+'" data-search="'+mergeRowObj.min+'"><input type="text" class="min" readonly="" data-parsley-required="false" name="rawResultsTable_0_12" value="'+mergeRowObj.min+'"></td>' //mim
      newRow = newRow + '<td class="stdTd col12 dt-head-left dt-head-nowrap" data-order="'+mergeRowObj.microaNom+'" data-search="'+mergeRowObj.microaNom+'"><input type="text" class="microaNom" data-parsley-required="false" name="rawResultsTable_0_13" value="'+mergeRowObj.microaNom+'" style="width: 300px;"></td>' //nomenclature
      newRow = newRow + '<td class="stdTd col13 dt-head-left dt-head-nowrap" data-order="'+mergeRowObj.max+'" data-search="'+mergeRowObj.max+'"><input type="text" class="max" readonly="" data-parsley-required="false" name="rawResultsTable_0_14" value="'+mergeRowObj.max+'"></td>' //max
      newRow = newRow + '<td class="stdTd col14 dt-head-left dt-head-nowrap">'+mergeRowObj.markerCount+'</td>' //markerCount
      if(mergeRowObj.omimGeneIdListCount == '0'){
        newRow = newRow + '<td class="stdTd col15 dt-head-left dt-head-nowrap">'+mergeRowObj.omimGeneIdListCount+'</td>' //omimgenes

      } else {
        newRow = newRow + '<td class="stdTd col15 dt-head-left dt-head-nowrap">'+ mergeRowObj.omimGeneIdListCount +'<br><a class="gene" href="uniflow?callback=?&stepName=AjaxGetCMAGenesById&omim=true&mergeId='+mergeRowObj.mergeRowId+'&id='+mergeRowObj.geneIdList+'">view&#160;genes</a></td>' //omimgenes

      }
      newRow = newRow + '<td class="stdTd col16 dt-head-left dt-head-nowrap">Merge Row</td>' //Interp by
      newRow = newRow + '<td class="stdTd col17 dt-head-left dt-head-nowrap">'+mergeRowObj.cytoRegions+'</td>' //cyto Regions
      newRow = newRow + '<td class="stdTd col18 dt-head-left dt-head-nowrap"><input type="hidden" class="rawResultId" readonly="" data-parsley-required="false" name="rawResultsTable_0_19" value="'+mergeRowObj.mergeRowId+'"></td>' //rawResultId
      newRow = newRow + '<td class="stdTd col19 dt-head-left dt-head-nowrap"><input type="hidden" class="sampleName" readonly="" data-parsley-required="false" name="rawResultsTable_0_20" value="'+mergeRowObj.sampleName+'"></td>'//SampleName
      newRow = newRow + '<td class="stdTd col20 dt-head-left dt-head-nowrap"><input type="hidden" class="mergeId" readonly="" data-parsley-required="false" name="rawResultsTable_0_21" value=""></td>'//mergeRowId
      newRow = newRow + '</tr>'

      $('input[name="rawResultsTable_numRows"]').val(nextRowId+1);
      var newHiddenField = '<input onfocus="select()" type="hidden" name="rawResultsTable_'+(nextRowId+1)+'" value="false" tabindex="1">'
      $('#rawResultsTable tbody').prepend(newRow);
      $('form').append(newHiddenField);

       //update the types and input names to be in the correct order
       var rowCount = 0;
       $('#rawResultsTable tbody tr').each(function(i){
         rowCount++;
         $(this).find('input, select, textarea').each(function(){
           if($(this).attr('name')) {
             var nameParts = $(this).attr('name').split('_');
             var name = nameParts[0]+'_'+i+'_'+nameParts[2];
             $(this).attr('name', name);
           }
         });
       });


      $('#rawResultsTable a.gene').click(function(e) {
        e.preventDefault();
        var url = $(this).attr('href');
        var rawRowId = $(this).parent().parent().children('td').children('.rawResultId').val();
        getGenes(url, $(this));
      });
      $('.interpretation').css('min-width', '250px')



    }).fail(function (jqXHR, textStatus, error) {
        console.log("Post error: " + error);
  });
  }
}


/**
 * checkAllPathOptions function will check all options with the cytocall of pathogenic.
 *
 * @param {string} clicked - checkbox clicked
 *

*/
function checkAllPathOptions(clicked){
  var startChromosomeNum = '';
  $('#rawResultsTable tbody tr').each(function(){
      var currentCytoCall = $(this).children('td').children('.cytoCall').val();
      var currentChromosome = $(this).children('td').children('.chromosome').val();
      if(currentCytoCall == 'Pathogenic'){
        $(this).children('td').children('.onReport').val(($(clicked).is(':checked')).toString());
        $(this).children('td').children('.onReport').prop('checked', $(clicked).is(':checked'));
      }
  })
}


/**
 * reloadPreviouslyMergedItems function
 *
 * The function will look for all rows in the the table with the id of rawResultsTable

*/
function reloadPreviouslyMergedItems(){
  function getGeneCount(colContents){
    if (colContents != undefined && colContents.indexOf("<br>") >= 0 ){
       var tempGeneCounter = colContents.split('<br>')
      return tempGeneCounter[0]*1
    } else {
      return colContents *1;
    }
  }
  var mergeRowsArray = [];
  var parentMergeRowsArray = [];
  $('#rawResultsTable tbody tr').each(function(){
    var currentMergeId = $(this).children('td').children('input.mergeId').val();
    var currentRawRowId = $(this).children('td').children('input.rawResultId').val();
    if(currentRawRowId.indexOf('merge') != -1){
      parentMergeRowsArray.push(currentRawRowId);
    }
    if(currentMergeId  != '' && mergeRowsArray.indexOf(currentMergeId) == -1 ){
      var currentObj = {
                mergeId: currentMergeId
                ,cytoRegions: $(this).children('td.col17').html()
                ,cnState: $(this).children('td.col10').html()
                ,markerCount: $(this).children('td.col14').html()
                ,geneCount: getGeneCount($(this).children('td.col9').html())
                ,omimGeneCount: getGeneCount($(this).children('td.col15').html())
                ,rawResultId: $(this).children('td').children('input.rawResultId').val()
                }
      mergeRowsArray.push(currentObj)
    }

  });
  var arrayOfFinalMergeObj = [];
  for(var j = 0; j < parentMergeRowsArray.length; j++){
    var mergeRowObj = {
                        mergeRowId: parentMergeRowsArray[j]
                        ,isChecked: 'true'
                        ,rawResultId: ''
                        ,sampleName: ''
                        ,cytoRegions: ''
                        ,cnState: ''
                        ,markerCount: ''
                        ,geneIdList:''
                        ,geneIdListCount: 0
                        ,omimGeneIdListCount: 0
                      }

    var cnStateArray = [];
    for(var i = 0; i < mergeRowsArray.length; i++){
      if(mergeRowsArray[i].mergeId != undefined && parentMergeRowsArray[j] == mergeRowsArray[i].mergeId){

        // get the cnState
        if(cnStateArray.length == 0){
          cnStateArray.push(mergeRowsArray[i].cnState);
        } else if(cnStateArray.indexOf(mergeRowsArray[i].cnState) == -1){
          cnStateArray.push(mergeRowsArray[i].cnState);
        }

        // get the sum of markerCount
        if(mergeRowObj.markerCount == ''){
          mergeRowObj.markerCount = mergeRowsArray[i].markerCount;
        } else {
          mergeRowObj.markerCount = 1*mergeRowObj.markerCount + 1*mergeRowsArray[i].markerCount;
        }

        mergeRowObj.geneIdListCount = mergeRowObj.geneIdListCount + mergeRowsArray[i].geneCount;
        mergeRowObj.omimGeneIdListCount = mergeRowObj.omimGeneIdListCount + mergeRowsArray[i].omimGeneCount;
        // get the rawResultIds to use in urls
        if(mergeRowObj.geneIdList == ''){
          mergeRowObj.geneIdList = mergeRowsArray[i].rawResultId;
        } else if(mergeRowObj.geneIdList != mergeRowsArray[i].rawResultId){
          mergeRowObj.geneIdList =  "'" + mergeRowObj.geneIdList + "','"+ mergeRowsArray[i].rawResultId + "'";
        }
      }
    }
    mergeRowObj.cnState = cnStateArray.join(', ')
    console.log('mergeRowObj', mergeRowObj);
    arrayOfFinalMergeObj.push(mergeRowObj);

  }
  $('#rawResultsTable tbody tr').each(function(){
    var currentMergeId = $(this).children('td').children('input.mergeId').val();
    var currentRawRowId = $(this).children('td').children('input.rawResultId').val();
    if(currentRawRowId.indexOf('merge') != -1){
      for(var k = 0; k < arrayOfFinalMergeObj.length; k++){
        if(arrayOfFinalMergeObj[k].mergeRowId == currentRawRowId){
          $(this).children('td').children('input.size').prop("readonly", false);
          $(this).children('td').children('input.microaNom').prop("readonly", false);
          $(this).children('td.col10').html(arrayOfFinalMergeObj[k].cnState);
          $(this).children('td.col14').html(arrayOfFinalMergeObj[k].markerCount);
          $(this).children('td.col16').html('Merge Row');
          $(this).children('td.col17').html('Cytoregions Not Set');

          if(arrayOfFinalMergeObj[k].geneIdListCount == '0'){
            $(this).children('td.col9').html(arrayOfFinalMergeObj[k].geneIdListCount);
          } else {
            $(this).children('td.col9').html(arrayOfFinalMergeObj[k].geneIdListCount +'<br><a class="gene" href="uniflow?callback=?&stepName=AjaxGetCMAGenesById&omim=false&mergeId='+arrayOfFinalMergeObj[k].mergeRowId+'&id='+arrayOfFinalMergeObj[k].geneIdList+'">view&#160;genes</a>');
          }

          if(arrayOfFinalMergeObj[k].omimGeneIdListCount == '0'){
            $(this).children('td.col15').html(arrayOfFinalMergeObj[k].omimGeneIdListCount);
          } else {
            $(this).children('td.col15').html(arrayOfFinalMergeObj[k].omimGeneIdListCount +'<br><a class="gene" href="uniflow?callback=?&stepName=AjaxGetCMAGenesById&omim=true&mergeId='+arrayOfFinalMergeObj[k].mergeRowId+'&id='+arrayOfFinalMergeObj[k].geneIdList+'">view&#160;genes</a>');
          }

        }
      }
    }
    if(currentMergeId != ''){
      $(this).hide();

    }
  });

}

/**
 * unmergeAllRows function will un-merge all merged rows for this sample Id.
 *
 * The function will look for all rows in the the table with the id of rawResultsTable

*/
function unmergeAllRows(){
  $('#rawResultsTable tbody tr').each(function(){
    var currentMergeId = $(this).children('td').children('input.mergeId').val();
    var currentRawRowId = $(this).children('td').children('input.rawResultId').val();
    if(currentRawRowId.indexOf('merge') != -1){
      $(this).remove();
    }
    if(currentMergeId){
      $(this).children('td').children('input.mergeId').val('');
      $(this).children('td.col0').html('<input onfocus="select()" type="checkbox" class="onReport" data-parsley-required="false" placeholder="" size="" tabindex="1" name="rawResultsTable_2_1" value="true" data-parsley-multiple="rawResultsTable_2_1">');
      $(this).show();
    }

  });

  $('input[name="rawResultsTable_numRows"]').val($('#rawResultsTable tbody tr').length);

   //update the types and input names to be in the correct order
   var rowCount = 0;
   $('#rawResultsTable tbody tr').each(function(i){
     rowCount++;
     $(this).find('input, select, textarea').each(function(){
       if($(this).attr('name')) {
         var nameParts = $(this).attr('name').split('_');
         var name = nameParts[0]+'_'+i+'_'+nameParts[2];
         $(this).attr('name', name);
       }
     });
   });

}


/**
 * initialization function for the Mircoarray Review results step.
 */
$(function() {
    $('.microaNom').css('width', '300px');
    $('.cytoCall').css('width', '175px');
    $('#notReportableResults').hide();
    $(".hide").hide();
    $('.interpretation').css('min-width', '250px');
    $('#refBox').html($('#referenceField').val());
    reloadPreviouslyMergedItems();

  $(".sectionTitle").on("click", function() {
      $(this).next().toggle();
  });

  $('#rawResultsTable a.gene').click(function(e) {
    e.preventDefault();
    var url = $(this).attr('href');
    var rawRowId = $(this).parent().parent().children('td').children('.rawResultId').val();
    getGenes(url, $(this));
  });

  $('#rawResultsTableHidden a.gene').click(function(e) {
    e.preventDefault();
    var url = $(this).attr('href');
    var rawRowId = $(this).parent().parent().children('td').children('.rawResultId').val();
    getGenes(url, $(this));
  });

  $('#mergeSelectedRows').click(function(e) {
    e.preventDefault();
    mergeTableRows($(this));
  });

  $('#unmergeSelectedRows').click(function(e) {
    e.preventDefault();
    unmergeAllRows($(this));
  });

  $('#checkallPath').click(function(e) {
    checkAllPathOptions($(this));
  });


});




