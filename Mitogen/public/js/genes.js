/**
 * Mitogen LIMS
 * Gene list filter
 * 
 * @requires genes.utilities.js
 * 
 * @author Harley Newton
 * @author Wendy Goller
 * @copyright 2018 Sunquest Information Systems
 * @version 1.1.20180220
 */


/**
 * Init genes
 */
function initGenes() {
  
  $('#hiddenSelectOptions').hide();
  $('#stepFormSubmitButton').hide();
  $('form').on('submit', function(e) { e.preventDefault(); });
  preventReturnOnInput();
  
  //   var gene_url = '/genes/gene_info.json';
  $.getJSON(getGeneURL()).done(function(data) {
    var table = initGeneTable();
    appendProgressOverlay();
    
    var gene_list_id = $('#geneListId').val();
    var get_data = {"stepName": "GET Gene List By Name", "gid" : gene_list_id};
    var ip_items = ['','AD','AR','XD','XR'];

    $.getJSON('uniflow?callback=?', get_data).done(function(data) {
      if (! data.length) {
        removeProgressOverlay();
        return false;
      }
      
      var predefined_items = [];
      var disease_items = [];
      var phenotype_items = [];
      var aoh_items = [];
      var overallArray_items = [];
      var predefObjectArr = [];
      var disObjectArr = [];
      var phenObjectArr = [];
      var aohObjectArr = [];
      
      for (var i = 0; i < data.length; i++) {
        table.row.add([
          data[i].gene, 
          data[i].alias, 
          data[i].predefined, 
          data[i].disease, 
          data[i].phenotype, 
          data[i].aoh, 
          data[i].ip, 
          data[i].list, 
          data[i].tso, 
          data[i].lc,
          '<span class="delete-icon-sm delete-gene"></span>'
        ]);
        
        if (data[i].predefined != '') {
          predefined_items = predefined_items.concat(data[i].predefined.split('<br>'));   
          predefObjectArr = createUniqueArrOfObj(predefined_items, 2); 
        }

        if (data[i].disease != '') {
          disease_items = disease_items.concat(data[i].disease.split('<br>'));   
          disObjectArr = createUniqueArrOfObj(disease_items, 3); 
        }
        
        if (data[i].phenotype != '') {
          phenotype_items = phenotype_items.concat(data[i].phenotype.split('<br>'));
          phenObjectArr = createUniqueArrOfObj(phenotype_items, 4);
        }
        
        if (data[i].aoh != '') {
          aoh_items = aoh_items.concat(data[i].aoh.split('<br>'));   
          aohObjectArr = createUniqueArrOfObj(aoh_items, 5);
        }

      }
      table.draw();
      table.column(0).order('asc').draw();

      overallArray_items = predefObjectArr.concat(disObjectArr, phenObjectArr, aohObjectArr);
      
      var status = (data[0].final == 'true') ? 'Final' : 'Draft';
      $('#status').text(status);
      setGeneCounts(table);
      
      addOptionItems('#selectIP', ip_items);

      addOptionItems('#selectOptions1', overallArray_items);
      addOptionItems('#selectOptions2', overallArray_items);
      removeProgressOverlay();
    });
    
    // Search, input genes
    searchGenesByPredefinedList(data);
    searchGenesByDisease(data);
    searchGenesByPhenotype(data);
    searchGenesByCMAResults(data);
    $('#cmafile').on('change', function(e) {
      loadCMAFile(e, data);
    });
    addGenesFromInput(data);
    $("#filterAll").prop("checked", true);

    addOptionItems('#IPOptions', ip_items);
    
    // Filter options
    $('input[name="filterAll"]').on('change', function(e) {
      var typeSelected = $(this).val();  
      $('#selectOptions1').hide();
      $('#selectOptions2').hide(); 

      if(typeSelected == 'grouping'){
        $('#selectOptions1').show();
        $('#selectOptions2').show();
      } else {
        $('#selectOptions1').show();
      }
      
    });

    $('#filterbyIp').on('click', function(e) {

      if($(this).is(":checked")){
        $('#IPOptions').show();
      } else {
        $('#IPOptions').hide();
      }
      
    });
  
    $('#applyFilter').on('click', function(e) {
      filterGenes();
    });
    
    // Remove gene from list
    $('#gene_list_table tbody').on('click', '.delete-gene', function() {
      var col = $(this).parent();
      var row = $(this).parent().parent();
      
      table.row(row).remove().draw();
      setGeneCounts(table);
    });
    
    // Remove all genes from list
    $('#gene_list_table thead').on('click', '.delete-all-genes', function() {
      if (! confirm("Remove all genes from list?")) {
        return false;
      }

      table.clear().draw();

      $('#selectOptions1').empty();
      $('#selectOptions2').empty();
      overallArray_items = [];

      $('#totalGeneCount, #tsoGeneCount, #nontsoGeneCount, #lcGeneCount').text('0');
    });
  }).fail(function(jqxhr, textStatus, error) {
    var err = "Request Failed: " + textStatus + ", " + error;
    console.log(err);
    alert(err);
  });

}

/**
 * Init gene table
 * 
 * @returns {object} gene list datatable object
 */
function initGeneTable() {
  
  var table;
  var table_id = '#gene_list_table';
  if ($.fn.DataTable.isDataTable(table_id)) {
    table = $(table_id).DataTable();
  }
  else {
    table = $(table_id).DataTable({
      "paging": true,
      "lengthMenu": [[50, 100, -1], [50, 100, "All"]],
      "ordering": true,
      "searching": true,
      "info": true,
      "data": [],
      "columns": [
        {"title": "Gene", "className": "dt-head-left"},
        {"title": "Alias", "className": "dt-head-left", "width": "200px", "orderable": false},
        {"title": "Predefined", "className": "dt-head-left"},
        {"title": "Disease", "className": "dt-head-left"},
        {"title": "Phenotype", "className": "dt-head-left"},
        {"title": "AOH", "className": "dt-head-left"},
        {"title": "IP", "className": "dt-head-left"},
        {"title": "List", "className": "dt-head-left"},
        {"title": "TSO", "className": "dt-head-left"},
        {"title": "LC", "className": "dt-head-left"},
        {"title": "<span class=\"delete-icon-sm delete-all-genes hdr-options-icon\" title=\"Remove all genes\"></span>", "orderable": false, "width": "10px"}
      ],
      "dom": 'lBfrtip',
      "buttons": [
        {
          text: 'Save',
          className: "save-list",
          action: function (e, dt, node, config) {
            if (! dt.data().count()) {
              alert("No genes in list...");
              return false;
            }
            
            var sampleId = $('#sampleId').val();
            var geneListId = $('#geneListId').val();
            if (sampleId == '') {
              alert("Save not allowed, no sample id provided...");
              return false;
            }
            
            var dt_json = getTableDataAsJSON(dt);
            var status = ($('#status').text() == 'Final') ? 'true': 'false';
                
            var postData = {
              "sampleId": sampleId,
              "name": geneListId,
              "final": status,
              "data": JSON.stringify(dt_json),
              "stepName": "POST Save Gene List",
              "Submit": true,
              "formNumber": 0
            };
            $.post('/uniflow', postData).done(function(data) {
              var postHtml = $.parseHTML(data);
              var postError = checkPostError(postHtml);
              if (postError !== false) {
                alert(postError);
              }
              else {
                if (status == 'false') { $('#status').text('Draft'); }
                alert("Saved successfully!");
              }
            }).fail(function(jqxhr, textStatus, error) {
              var err = "Request Failed: " + textStatus + ", " + error;
              console.log(err);
              alert(err);
            });
          }
        },
        {
          extend: 'excel',
          title: null
        },
        {
          extend: 'copyHtml5',
          text: 'Copy All',
          header: false,
          title: null,
          className: 'copy-all',
          exportOptions: {
            columns: [0]
          }
        },
        {
          extend: 'copyHtml5',
          text: 'Copy TSO',
          header: false,
          title: null,
          className: 'copy-tso',
          newline: ', ',
          exportOptions: {
            rows: function (idx, data, node) {
              return (data[8] == 'Yes') ? true : false;
            },
            columns: [0]
          }
        },
        {
          extend: 'copyHtml5',
          text: 'Copy Non TSO',
          header: false,
          title: null,
          className: 'copy-nontso',
          newline: ', ',
          exportOptions: {
            rows: function (idx, data, node) {
              return (data[8] == 'No') ? true : false;
            },
            columns: [0]
          }
        },
        {
          extend: 'copyHtml5',
          text: 'Copy Low Cov',
          header: false,
          title: null,
          className: 'copy-lc',
          newline: ', ',
          exportOptions: {
            rows: function (idx, data, node) {
              return (data[9] == 'Yes') ? true : false;
            },
            columns: [0]
          }
        },
        {
          text: 'Create Target Region',
          action: function (e, dt, node, config) {
            if (! dt.data().count()) {
              alert("No genes in list...");
              return false;
            }
            
            var sampleId = $('#sampleId').val();
            var geneListId = $('#geneListId').val();
            if (sampleId == '') {
              alert("Cannot create region, no sample id provided...");
              return false;
            }
            
            var dt_json = getTableDataAsJSON(dt);
                  
            var postData = {
              "sampleId": sampleId,
              "name": geneListId,
              "final": 'true',
              "data": JSON.stringify(dt_json),
              "stepName": "POST Save Gene List",
              "Submit": true,
              "formNumber": 0
            };
            $.post('/uniflow', postData).done(function(data) {
              var postHtml = $.parseHTML(data);
              var postError = checkPostError(postHtml);
              if (postError !== false) {
                alert(postError);
              }
              else {
                $('#status').text('Final');
              }
            }).fail(function(jqxhr, textStatus, error) {
              var err = "Request Failed: " + textStatus + ", " + error;
              console.log(err);
              alert(err);
            });
            
            var fastUrl = $('#fastUrl').val();
            var wor = window.open(fastUrl + '/fast/index.html#/createTargetRegion?name=' + geneListId);
          }
        }
      ]
    });
  }
  
  return table;
}

/**
 * Filter genes by
 * 
 * @param {string} type
 * @param {int} col
 * @param {string} filterBy
 * @returns {void} filtered genes
 */

function filterGenes() {
  var table = initGeneTable();
  var filterBy = $('input[name="filterAll"]:checked').val();
  var removeRows = [];
  var keepRows = [];

  var remove = [];
  var objArrSelected1 = [];
  $('#selectOptions1').each(function(i, v) {
    $("option:selected", this).each(function(i, v) {
      remove.push($(v).val());
      objArrSelected1.push({'itemName': $(v).data('itemName'), columnVal: 1*($(v).data('columnVal')), itemType: $(v).data('itemType')});
    });
  });

  var remove2 = [];
  var objArrSelected2 = [];
  $('#selectOptions2').each(function(i, v) {
    $("option:selected", this).each(function(i, v) {
      remove2.push($(v).val());
      objArrSelected2.push({'itemName': $(v).data('itemName'), columnVal: 1*($(v).data('columnVal')), itemType: $(v).data('itemType')});
    });
  });
  
  var remove3 = [];
  $('#IPOptions').each(function(i, v) {
    $("option:selected", this).each(function(i, v) {
      remove3.push($(v).val());
    });
  });

  if($('#filterbyIp').is(":checked")){
    var KeepList1 = [];
    for (var i = 0; i < remove3.length; i++) {
      table.rows().every(function (rowIdx, tableLoop, rowLoop) {
        if (remove3[i] == '' && this.data()[6] == '') {
          KeepList1.push(rowIdx);
        }
        if (remove3[i] != '' && this.data()[6].indexOf(remove3[i]) > -1) {
          KeepList1.push(rowIdx);
        }
      });
    }
    table.rows().every(function (rowIdx, tableLoop, rowLoop) {
      if(KeepList1.indexOf(rowIdx) == -1){
        removeRows.push(rowIdx);
      }
    });
    table.rows(removeRows).remove().draw();
  }

  if (filterBy == 'grouping') {
    var keepTempRows = [];
    table.rows().every(function (rowIdx, tableLoop, rowLoop) {
      var keepOuter = [];
      if(objArrSelected1.length == 0){
        keepOuter.push(rowIdx);
      }
      for(var i = 0; i < objArrSelected1.length; i++){
        var itemName = objArrSelected1[i].itemName;
        var col = objArrSelected1[i].columnVal;
        var dataArray = this.data()[col].split('<br>');
        if(dataArray.indexOf(itemName) > -1){
          keepOuter.push(rowIdx) 
          if(objArrSelected2.length > 0){
            var keepInner = [];
            for(var x = 0; x < objArrSelected2.length; x++){
              var itemName2 = objArrSelected2[x].itemName;
              var col2 = objArrSelected2[x].columnVal;
              var dataArray2 = this.data()[col2].split('<br>');
              if(dataArray2.indexOf(itemName2) > -1){
                keepInner.push(rowIdx);
              } 
            }
            if(keepInner.length == 0){
              removeRows.push(rowIdx);
            } 
          }

        } 
      }
      if(keepOuter.length == 0){
        removeRows.push(rowIdx);
      } 
    });

    table.rows(removeRows).remove().draw();

  } else if (filterBy == 'non-overlap') {  
    for(var i = 0; i < objArrSelected1.length; i++){
      var itemName = objArrSelected1[i].itemName;
      var col = objArrSelected1[i].columnVal;
      table.rows().every(function (rowIdx, tableLoop, rowLoop) {
        if (this.data()[col].split('<br>').indexOf(itemName) != -1) {
          keepRows.push(rowIdx);
        } else {
          removeRows.push(rowIdx);
        }
      });
      table.rows(removeRows).remove().draw();
    }
  } else if (filterBy == 'All') {  
    for(var i = 0; i < objArrSelected1.length; i++){
      var itemName = objArrSelected1[i].itemName;
      var col = objArrSelected1[i].columnVal;
      var type = objArrSelected1[i].itemType;
      table.rows().every(function (rowIdx, tableLoop, rowLoop) {
        if (itemName == '' && this.data()[col] == '') {
          removeRows.push(rowIdx);
        }
        if (itemName != '' && this.data()[col].indexOf(itemName) > -1) {
          removeRows.push(rowIdx);
        }
      });
    }
    table.rows(removeRows).remove().draw();
            
    for(var i = 0; i < objArrSelected1.length; i++){
      var citemName = objArrSelected1[i].itemName;
      var ccol = objArrSelected1[i].columnVal;
      var ctype = objArrSelected1[i].itemType;
      if (citemName == '') { continue; }
      $("#selectOptions1 option[value='" + citemName + "']").remove();
      $("#selectOptions2 option[value='" + citemName + "']").remove();
      $("#select" + ctype + " option[value='" + citemName + "']").remove();
    }
  }

  table.column(0).order('asc').draw();
  setGeneCounts(table);
}

/**
 * Returns Array of objects with column type attached.
 *
 * @param {array} childArray
 * @param {int} columnNum
 * @returns {array}
 * 
 */
function createUniqueArrOfObj(childArray, columnNum) {
  
  if (0 === childArray.length) {
    return false;
  }
  var filterType = getFilterType(columnNum);

  var uniquePhen = [];
  for (var i = 0; i < childArray.length; i++) {
    if(uniquePhen.indexOf(childArray[i]) === -1){
      uniquePhen.push(childArray[i]);
    }
  };
  return newObjectArr = uniquePhen.slice(0).map(function(item){
    return {'itemName': item, 'columnVal': columnNum, 'itemType': filterType};
  });
}

/**
 * Returns the string type
 *
 * @param {int} col
 * @returns {string}
 * 
 */
function getFilterType(col) {
  var type = '';
  switch (col*1) {
    case 2:
      type = 'predefined'
      break;
    case 3:
      type = 'disease'
      break;
    case 4:
      type = 'phenotype'
      break;
    case 5:
      type = 'aoh'
      break;
    case 7:
      type = 'list'
      break;
    default:
      return false;
      break;
  }
  return type;
}

/**
 * Search genes by disease
 * 
 * @param {object} gene_data
 * @returns {void} sets autocomplete
 */
function searchGenesByDisease(gene_data) {
  
  var search_el = "#disease_search";
  
  $(search_el).autocomplete({
    minLength: 3,
    source: function(request, response) {
      $.getJSON(getDiseaseURL()).done(function(data) {
        var results = [];
        
        for (var disease in data) {
          var re = new RegExp(request.term, "gi");
          if (disease.search(re) !== -1) {
            var ip = data[disease].hasOwnProperty("ip") ? data[disease].ip : [];
            var code = data[disease].hasOwnProperty("code") ? data[disease].code : '';
            var name = (code == '') ? disease : disease + " (" + code + ")";
            results.push({"name": name, "genes": data[disease].genes, "ip" : ip, "code" : code});
          }
        }
        
        response(results);
      });
    },
    select: function(event, ui) {
      appendProgressOverlay();
      
      $.getJSON(getDiseaseURL()).done(function(data) {
        var gene_ip = getGeneIP(data);
        addGenesToList('disease', ui.item, gene_data, gene_ip);
        
        removeProgressOverlay();
        return false;
      });
    }
  }).autocomplete("instance")._renderItem = function(ul, item) {
    return $("<li>")
    .append("<div>" + item.name + " [" + item.genes.length  + "]</div>")
    .appendTo(ul);
  };
}

/**
 * Search genes by phenotype
 * 
 * @param {object} gene_data
 * @returns {void} sets autocomplete
 */
function searchGenesByPhenotype(gene_data) {
  
  var phenotype_url = '/genes/gene-phenotype.json';
  var search_el = "#phenotype_search";
  
  $(search_el).autocomplete({
    minLength: 3,
    source: function(request, response) {
      $.getJSON(phenotype_url).done(function(data) {
        var results = [];
        
        for (var phenotype in data) {
          var re = new RegExp(request.term, "gi");
          if (phenotype.search(re) !== -1) {
            var code = data[phenotype].hasOwnProperty("code") ? data[phenotype].code : '';
            var name = (code == '') ? phenotype : phenotype + " (" + code + ")";
            results.push({"name": name, "genes": data[phenotype].genes, "code" : code});
          }
        }
        
        response(results);
      });
    },
    select: function(event, ui) {
      appendProgressOverlay();
      
      $.getJSON(getDiseaseURL()).done(function(data) {
        var gene_ip = getGeneIP(data);
        addGenesToList('phenotype', ui.item, gene_data, gene_ip);
        
        removeProgressOverlay();
        return false;
      });
    }
  }).autocomplete("instance")._renderItem = function(ul, item) {
    return $("<li>")
    .append("<div>" + item.name + " [" + item.genes.length  + "]</div>")
    .appendTo(ul);
  };
}

/**
 * Search genes by predefined list
 * 
 * @param {object} gene_data
 * @returns {void} sets autocomplete
 */
function searchGenesByPredefinedList(gene_data) {
  
  var predefined_url = 'uniflow?callback=?&stepName=GET+Predefined+Genes';
  var search_el = "#predefined_search";
  
  $(search_el).autocomplete({
    minLength: 1,
    source: predefined_url,
    select: function(event, ui) {
      appendProgressOverlay();
      
      $.getJSON(getDiseaseURL()).done(function(data) {
        var gene_ip = getGeneIP(data);
        ui.item.genes = splitGenes(ui.item.genes);
        addGenesToList('predefined', ui.item, gene_data, gene_ip);
        removeProgressOverlay();
        return false;
      }); 
    }
  }).autocomplete("instance")._renderItem = function(ul, item) {
    var g = splitGenes(item.genes);
    
    return $("<li>")
    .append("<div>" + item.name + " [" + g.length  + "]</div>")
    .appendTo(ul);
  };
}

/**
 * Search genes by CMA results (High Percent AOH)
 * 
 * @param {object} gene_data
 * @returns {void} sets autocomplete
 */
function searchGenesByCMAResults(gene_data) {
  
  var aoh_url = 'uniflow?callback=?&stepName=GET+CMA+AOH+Genes';
  var search_el = "#aoh_search";
  
  $(search_el).autocomplete({
    minLength: 1,
    source: aoh_url,
    select: function(event, ui) {
      appendProgressOverlay();
      
      $.getJSON(getDiseaseURL()).done(function(data) {
        var gene_ip = getGeneIP(data);
        ui.item.genes = splitGenes(ui.item.genes);
        addGenesToList('aoh', ui.item, gene_data, gene_ip);
        
        removeProgressOverlay();
        return false;
      });
    }
  })
  .autocomplete("instance")._renderItem = function(ul, item) {
    var g = splitGenes(item.genes);
    
    return $("<li>")
    .append("<div>" + item.name + " [" + g.length  + "]</div>")
    .appendTo(ul);
  };
}

/**
 * Add genes from input
 * Use comma or space or newline as separator
 * 
 * @param {object} gene_data
 * @returns {void} appends valid genes to search list on input change
 */
function addGenesFromInput(gene_data) {
  
  $('#gene_search').on('change', function() {
    var gene_search = $(this);
    appendProgressOverlay();
    
    $.getJSON(getDiseaseURL()).done(function(data) {
      var gene_ip = getGeneIP(data);
      var potential_genes = getPotentialGenes(gene_data, gene_search.val());
      
      addGenesToList('list', {"name": "Yes", "genes": potential_genes.genes}, gene_data, gene_ip);
      
      gene_search.val('');
      removeProgressOverlay();
      
      displayNotFoundPopup("#notFoundDialog", "Genes Not Found", potential_genes.not_found.join(', '), '#gene_search');
    });   
  });
}

/**
 * Add genes to list
 * 
 * @param {string} type
 * @param {object} item
 * @param {object} gene_data
 * @returns {void} adds genes to table
 */
function addGenesToList(type, item, gene_data, ip_data, ) {
  
  var col_index;
  var col_text = ['','','','','','','','','',''];

  var filterType = $('#filter1Type').val();

  switch (type) {
    case 'predefined':
      col_index = 2;
      col_text[col_index] = item.name;
      appendOptionItem('#selectOptions1', {'itemName': item.name, 'columnVal': 2, 'itemType': 'predefined'});
      appendOptionItem('#selectOptions2', {'itemName': item.name, 'columnVal': 2, 'itemType': 'predefined'});
      break;
    case 'disease':
      col_index = 3;
      col_text[col_index] = item.name;
      appendOptionItem('#selectOptions1', {'itemName': item.name, 'columnVal': 3, 'itemType': 'disease'});
      appendOptionItem('#selectOptions2', {'itemName': item.name, 'columnVal': 3, 'itemType': 'disease'});
      break;
    case 'phenotype':
      col_index = 4;
      col_text[col_index] = item.name;
      appendOptionItem('#selectOptions1', {'itemName': item.name, 'columnVal': 4, 'itemType': 'phenotype'});
      appendOptionItem('#selectOptions2', {'itemName': item.name, 'columnVal': 4, 'itemType': 'phenotype'});
      break;
    case 'aoh':
      col_index = 5;
      col_text[col_index] = item.name;
      appendOptionItem('#selectOptions1', {'itemName': item.name, 'columnVal': 5, 'itemType': 'aoh'});
      appendOptionItem('#selectOptions2', {'itemName': item.name, 'columnVal': 5, 'itemType': 'aoh'});
      break;
    case 'list':
      col_index = 7;
      col_text[col_index] = item.name;
      break;
  
    default:
      return false;
      break;
  }
  
  var table = initGeneTable();
  var current_genes = getCurrentGenes(table);
  var ip_index = 6;
  
  for (var i = 0; i < item.genes.length; i++) {
    var gene = item.genes[i];
    
    if (type == 'aoh') {
      // format: GENE (OMIM)
      gene = gene.replace('(', '').replace(')', '').split(' ')[0];
    }
    
    if (gene_data.hasOwnProperty(gene)) {
      var alias = gene_data[gene].synonyms.join(', ');
      var inheritance = (ip_data.hasOwnProperty(gene)) ? ip_data[gene].join(', ') : '';     
      var tso = (gene_data[gene].is_tso) ? "Yes" : "No";
      var low = (gene_data[gene].is_low_cov_tso) ? "Yes" : "No";
      
      if (current_genes.hasOwnProperty(gene)) {
        var row_index = current_genes[gene];
        var current_data = table.row(row_index).data();
        if (current_data[col_index].includes(item.name)) {
          return false;
        }
        current_data[col_index] = (current_data[col_index] == '') ? item.name : current_data[col_index] + "<br>" + item.name;
        current_data[ip_index] = inheritance;
        
        table.row(row_index).data(current_data).draw();
      }
      else {
        table.row.add([
          gene, 
          alias, 
          col_text[2], 
          col_text[3], 
          col_text[4], 
          col_text[5], 
          inheritance, 
          col_text[7], 
          tso, 
          low, 
          '<span class="delete-icon-sm delete-gene"></span>'
        ]).draw();
      }
    }
  }
  
  setGeneCounts(table);

}

/**
 * Get current genes
 * 
 * @param {object} table
 * @returns {array}
 */
function getCurrentGenes(table) {
  
  var current_genes = {};
  table.rows().every(function (rowIdx, tableLoop, rowLoop) {
    var row_data = this.data();
    current_genes[row_data[0]] = rowIdx;
  });
  
  return current_genes;
}


/**
 * Get gene inheritance pattern from disease data
 * 
 * @param {object} data
 * @returns {object} genes with ip values
 */
function getGeneIP(data) {
  
  var gene_ip = {};
  for (var disease in data) {
    if (data[disease].hasOwnProperty("ip")) {
      for (var i = 0; i < data[disease].genes.length; i++) {
        gene_ip[[data[disease].genes[i]]] = data[disease].ip;
      }
    }
  }
  
  return gene_ip;
}

/**
 * Set gene counts
 * 
 * @param {object} table
 * @returns {void}
 */
function setGeneCounts(table) {
  
  var total_count = table.rows().count();
  $('#totalGeneCount').text(total_count);
  
  var tso_count = 0;
  table.rows().every(function (rowIdx, tableLoop, rowLoop) {
    if (this.data()[8] == 'Yes') { tso_count++; }
  });
  $('#tsoGeneCount').text(tso_count);
  $('#nontsoGeneCount').text(total_count - tso_count);
  
  var lc_count = 0;
  table.rows().every(function (rowIdx, tableLoop, rowLoop) {
    if (this.data()[9] == 'Yes') { lc_count++; }
  });
  $('#lcGeneCount').text(lc_count);
}

/**
 * Append progress overlay
 * 
 * @param {string} el
 * @returns {void}
 */
function appendProgressOverlay() {
  
  var el = '#gene_list_table';
  var overlay = '<div id="progress_overlay" class="progress-overlay"><div class="progress-label">PROCESSING...</div></div>';
  var pos = $(el).position();
  var width = $(el).width();
  var height = $(el).height();
  
  $(overlay).css({
    top: pos.top, 
    left: 0,
    width: width+2,
    height: height+(height/2)
  }).appendTo(el);
}

/**
 * Remove progress overlay
 * 
 * @returns {void}
 */
function removeProgressOverlay() {
  
  $('#progress_overlay').remove();
}

/**
 * Append selected option
 * 
 * @param {string} el
 * @param {string or object} val
 * @returns {void} sets select option
 */
function appendOptionItem(el, val) {
  var newOption = '';
  if(typeof val == 'string'){
    if ($(el + " option[value='" + val + "']").length > 0) {
      return false;
    }
    newOption = "<option value='" + val + "'>" + val + "</option>";
  } else {
    var cName = val.itemName;
    var cNum = val.columnVal;
    var cType = val.itemType;
    if ($(el + " option[value='" + cName + "']").length > 0) {
      return false;
    }
    newOption = "<option value='" + cName + "'  data-item-name='" + cName + "'  data-column-val='" + cNum + "'  data-item-type='" + cType + "'>" + cName + "</option>";

  }
  
  $(el).append(newOption);
}


/**
 * Add select options
 * 
 * @param {string} el
 * @param {array} items
 * @returns {void}
 */
function addOptionItems(el, items) {
  
  var options = items.filter(function(item, pos){
    return items.indexOf(item) == pos; 
  });
  for (var i = 0; i < options.length; i++) {
    appendOptionItem(el, options[i]);
  }
}

/**
 * Load CMA AOH genes from file
 * 
 * @param {object} event
 * @param {object} gene_data
 * @returns {void}
 */
function loadCMAFile(event, gene_data) {
  
  var files = event.target.files;
  var file = files[0];
  if (file === undefined) { return false; }
  
  var reader = new FileReader();
  reader.onload = function(e) {
    
    $.getJSON(getDiseaseURL())
    .done(function(data) {
      appendProgressOverlay();
      
      setTimeout(function() {
        var gene_ip = getGeneIP(data);
        
        var genes = [];
        var results = e.target.result.split('\n');
        var fields = results.shift();
        for (var i = 0; i < results.length; i++) {
          var r = results[i].split('\t');
          if (r[5] == 'High Percent AOH' && r[7] == 'LOH') {
            genes.push(r[17]);
          }
        }
        
        var g = splitGenes(genes.join(','));
        var n = $('#cmafile').val().replace('C:\\fakepath\\','');
        addGenesToList('aoh', {"name": n, "genes": g}, gene_data, gene_ip);
        
        $('#cmafile').val('');
        removeProgressOverlay();
        return false;
      }, 100);
    });
  }
  
  reader.readAsText(file)
 }

/**
 * Returns TRUE if the first specified array contains all elements
 * from the second one. FALSE otherwise.
 *
 * @param {array} superset
 * @param {array} subset
 * @returns {boolean}
 * 
 * @see https://github.com/lodash/lodash/issues/1743
 */
function arrayContainsArray(superset, subset) {
  
  if (0 === subset.length) {
    return false;
  }
  return subset.every(function (value) {
    return (superset.indexOf(value) >= 0);
  });
}

/**
 * Get table data as JSON
 * 
 * @param {object} table
 * @returns {object} json
 */
function getTableDataAsJSON(table) {
  
  var fields = [], json = [];
  table.settings().columns()[0].forEach(function(index) {
    fields.push($(table.column(index).header()).text());
  });
  
  table.rows().data().toArray().forEach(function(row) {
    var item = {};
    row.forEach(function(content, index) {
      item[fields[index]] = content;
    });
    json.push(item);
  });
  
  return json;
}
