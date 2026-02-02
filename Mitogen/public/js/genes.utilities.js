/**
 * Mitogen LIMS
 * Gene list utilities
 * 
 * @author Harley Newton
 * @author Wendy Goller
 * @copyright 2018 Sunquest Information Systems
 * @version 1.1.20180220
 */

/**
 * getter for gene disease json url
 * 
 * @returns {string} of gene url
 */
function getDiseaseURL(){
  return '/genes/gene-disease.json';
}


/**
 * getter for gene information url
 * 
 * @returns {string} of gene url
 */
function getGeneURL(){
  return '/genes/gene_info.json';
}


/**
 * getter for gene information url
 * 
 * @returns {string} of gene url
 */
function getPhenotypeURL(){
  return '/genes/gene-phenotype.json';
}


/**
 * Get gene aliases
 * 
 * @param {object} data
 * @returns {object} gene aliases with gene symbol values
 */
function getGeneAliases(data) {
  
  var alias = {};
  for (var gene in data) {
    for (var i = 0; i < data[gene].synonyms.length; i++) {
      alias[[data[gene].synonyms[i]]] = gene;
    }
  }
  
  return alias;
}


/**
 * Split genes
 * 
 * @param {string} genes, comma separated list
 * @returns {array}
 */
function splitGenes(genes) {
  
  var g = genes.split(',').map(function(item) {
    return item.trim();
  });
  
  return g;
}


/**
 * Get potential genes
 * Use comma, semicolon, space or newline as separator
 *
 * @param {object} gene_data
 * @param {string} textValue
 * @returns {object} returns object of arrays
 */
function getPotentialGenes(gene_data, textValue){

  var gene_input = textValue.trim();
  if (gene_input == '') {
    return false;
  }
  
  if (gene_input.indexOf(',') !== -1) {
    potential_genes = splitGenes(gene_input);
  }
  else if (gene_input.indexOf(' ') !== -1) {
    potential_genes = splitGenes(gene_input.replace(/\s/g, ","));
  }
  else if (gene_input.indexOf('\t') !== -1) {
    potential_genes = splitGenes(gene_input.replace(/\t/g, ","));
  }
  else if (gene_input.indexOf(';') !== -1) {
    potential_genes = splitGenes(gene_input.replace(/;/g, ","));
  }
  else {
    potential_genes = splitGenes(gene_input.replace(/\n/g, ","));
  }
      
  var genes = [];
  var aliasTemp = [];
  var not_found = [];
  for (var i = 0; i < potential_genes.length; i++) {
    if (potential_genes[i] == '') { continue; }
    
    var G = potential_genes[i].toUpperCase();
    if (gene_data.hasOwnProperty(potential_genes[i])) {
      if (! genes.includes(potential_genes[i])) { 
        genes.push(potential_genes[i]);
      }
    }
    else if (gene_data.hasOwnProperty(G)) {
      if (! genes.includes(G)) {
        genes.push(G);
      }
    }
    else {
      aliasTemp.push(potential_genes[i]);
    }
  }
  
  if (aliasTemp.length > 0) {
    var gene_alias = getGeneAliases(gene_data);
    for (var i = 0; i < aliasTemp.length; i++) {
      var A = aliasTemp[i].toUpperCase();
      
      if (gene_alias.hasOwnProperty(aliasTemp[i])) {
        if (! genes.includes(gene_alias[aliasTemp[i]])) {
          genes.push(gene_alias[aliasTemp[i]]);
        }
      }
      else if (gene_alias.hasOwnProperty(A)) {
        if (! genes.includes(gene_alias[A])) {
          genes.push(gene_alias[A]);
        }
      }
      else {
        not_found.push(aliasTemp[i]);
      }
    }
  }

  var alias = aliasTemp.filter(function(item){
    var isFound = false;
    for(var i = 0; i < not_found.length; i++){
      if(not_found[i] == item){
        isFound = true;
      }
    }
    if(!isFound){
      return item;
    }
  });

  return {'not_found': not_found, 'genes': genes, 'alias': alias}

}

/**
 * Display genes not found
 * 
 * @param {string} div on screen to display popup
 * @param {string} title of popup
 * @param {array} content to display in body of popup
 * @param {string} clicked
 * @returns {void} displays popup for genes not found
 */
function displayNotFoundPopup(div, title, bodyContent, clicked){
  if (bodyContent.length > 0) {

    var dialog = $(div).dialog({
      autoOpen: false,
      title: title,
      modal: false,
      draggable: false,
      width: 300,
      height: "auto",
      position: {
        my: "right top", at: "left bottom", of: clicked
      },
      close: function() {
        dialog.dialog("close");
      },
      buttons:{
        Close: function(){
          dialog.dialog("close");
          $(div).html('');
        }
      }
    });
    
    $(div).append('<div>' + bodyContent + '</div>');
    
    dialog.dialog('open');
  }

}
