$(document).ready(function() {

  hideTableIfEmpty('.hideTableIfEmpty', '');
  $('.hiddenOnLoad').hide();
  $('.sampleListTable_scan').addClass('sampleInput');

  appendMasterMixesToTray();

  // load mastermixes on load
  masterMixFunction();
  $('#masterMixChangeDiv').hide();

  // Not using the master mix function so that on load, there are not empty rows for master mix
  // components. Once data is already entered into samples
  updateSampleWellTable();

  // Update master mix info on sample input change

  $('.sampleInput').blur( function() {
    masterMixFunction();
  });

  $('.stdRow').change( function() {
    masterMixFunction();
  });


  $('.deleteMasterMixFromWell').click( function() {
    removeMasterMixFromWell( $(this) );
  });

  // Leave functions at the end to ensure resource counts and volumes are calculating properly
  masterMixFunction(); // this double call is needed to load the resources correctly
  // END resource count and volume

}); // end document ready


/// MASTER MIX FUNCTIONS

/** Runs the master mix functions in the correct order for populating and creating rows
* Updates samples in table
* Removes all master mix rows, then adds master mix rows that are being used for samples
* Calculates totals from usage
* Calculates totals for master mixes
* Shows instructions and alerts user that master mixes have changed
**/
function masterMixFunction() {

  updateSampleWellTable();
  addMasterMixComponents();
  if($('#dilutionTable').length > 0 || $('#seriesDilutionTable').length > 0){
    diluentSumSet();
  } else {
    calculateUsageTotals();
  }
  calculateMasterMixVolumes();
  showInstructions();



  /** Updates the hidden rows on the bottom for resources
  * class masterMixRow is added for each additional resource row added for master mixes
  * $('input[name="' + table + '_' + removedRow + '"]') is the hidden row for the table row count
  * removes the matching hidden row
  * loops through each input starting with the tableName_
  * checks to see if it is the type of hidden
  * updates the name with correct numbering and removes the row from resources
  **/

  var addedWellsCountArr = $('#wellLayoutTable tbody tr').filter(function(i, item){
    if($(item).find('.tableHasSample').attr('value') != ''){
      return item
    }
  })

  $('.masterMixRow').each( function() {
    if(addedWellsCountArr.length === 0 ){
      var table = $(this).attr('name').split('_')[0];
      var $lastRow =  $('#' + table + ' tbody tr').last();
      var rowNumberCurrent = $lastRow.index();
      $('input[name="' + table + '_numRows"]').val(rowNumberCurrent);

      var removedRow = $(this).attr('name').split('_')[1];
      $('input[name="' + table + '_' + removedRow + '"]').remove();

      var count = 0;
      $( "input[name^='"+table+"_']" ).each( function() {
        if( $(this).attr('type') == 'hidden' ) {
          count++;
          var nameParts = $(this).attr('name').split('_');
          if ( nameParts[0] == table && nameParts[1] != 'numRows' ) {
            let row = parseInt(count)-2;
            let name = nameParts[0]+'_'+row;
            $(this).attr('name', name);
          }
        }
      });

      $(this).parent('td').parent('tr').remove();
    }
  });



}


function updateToIncludeMMAmounts(){
  $('.tableMasterMixId').each( function(i, item) {
    let masterMixId = $(item).val();
    let masterMixReagentType = $(item).parent('td').siblings().children('.masterMixReagentType').val();
    let masterMixSingleVolume = parseFloat( $(item).parent('td').siblings().children('.masterMixSingleVolumeType').val() );

    $('.resourceType').each( function(i, resourceItem) {
      if ( $(resourceItem).val() == masterMixReagentType ) {
        let originalAmount = $(resourceItem).parent('td').siblings().children('.sampleAmount').val();
        $(resourceItem).parent('td').siblings().children('.sampleAmount').val(parseFloat(originalAmount) + parseFloat(masterMixSingleVolume))
      }

    });
  });

}

/** Function to calculate master mix volume for each master mix per sample
*
* Goes through the wellLayoutTable to check for rows with a nonempty sample and master mix combination
*   Adds the master mix volume, including overage to the recalculated total volume, this is done by
*   the calculateUsageTotals function.
* This will allow to do adhoc master mix additions because calculations are not well dependent
*
* Master Mix needs to exist in the masterMixComponents, this is populated on load based on tray/transfer map
*   assigned to the step. For addition of adhoc calculations, function needs to be added to add master mix
*   components to the table.
* Master Mix resource type needs to be in the resource tables. This is populated with the addMasterMixComponents
*   function. As long as master mixes are in the masterMixComponents table, the resources will be added.
*
**/
function calculateMasterMixVolumes() {
  $('.tableMasterMixId').each( function(i, item) {
    var masterMixId = $(item).val();
    var masterMixReagentType = $(item).parent('td').siblings().children('.masterMixReagentType').val();
    var masterMixSingleVolume = parseFloat( $(item).parent('td').siblings().children('.masterMixSingleVolumeType').val() );
    var masterMixOveragePercentage = $(item).parent('td').siblings().children('.masterMixOveragePercentage').val();
    // Sets overage percentage to 0 if no overage assigned.
    if (masterMixOveragePercentage.trim() == '') {
      masterMixOveragePercentage = 0;
    }
    var masterMixUnits = $(item).parent('td').siblings().children('.masterMixUnits').val();

    //get array of only the fields that are of the correct reagent type
    var mmArrSamples = $('.tableHasSample').filter(function(i, sampleItem){
      if($(sampleItem).parent('td').siblings().children('.tableMmId').val() === masterMixId && blankIfFalsy(sampleItem.value) != ''){
        return sampleItem
      }
    });

    var countOfMasterMixSamples = mmArrSamples.length;
    $('.resourceType').each( function(i, resouceItem) {
      if ( $(resouceItem).val() == masterMixReagentType ) {
        var existingReagentVolume = parseFloat( $(resouceItem).parent('td').siblings().children('.totalAmount').val() );
        var masterMixOverage = masterMixSingleVolume * parseFloat( masterMixOveragePercentage )/100;
        var masterMixWithOverage = masterMixSingleVolume + masterMixOverage;
        var totalVolumeForReagent =  existingReagentVolume + (masterMixWithOverage * countOfMasterMixSamples);

        $(resouceItem).parent('td').siblings().children('.totalAmount').val( parseFloat( totalVolumeForReagent ).toFixed(2) );
      } // Matching master mix in resources
    });

  }); // Row mastermix table components
}

/** Calculates and populates total volumes of each resource based on the sample count
* This gives the base total volume for resources assigned at usage.
* Function will also check for if the total column exists, it is only applicable for
*   reagents and controls.
**/
function calculateUsageTotals() {
  $('.totalAmount').each( function() {
    $(this).val(0.00);
  });
  var totalVolumeForResource;
  var sampleCount = sampleInputCounter();
  var singleSampleVolume = 0;

  $('.resourceType').each( function() {
    singleSampleVolume = parseFloat( $(this).parent('td').siblings().children('.sampleAmount').val() );
    if(isNaN(singleSampleVolume)){
      singleSampleVolume = parseFloat( $(this).parent('td').siblings().children('.amount').val() );
    }
    if(isNaN(singleSampleVolume)){
      singleSampleVolume = 0;
    }
    totalVolumeForResource = singleSampleVolume * parseInt( sampleCount );

    if ( $(this).parent('td').siblings().children('.totalAmount').length ) {
      if($(this).parent().parent().parent().parent().attr('id') === 'controlResources' && typeof updateControlUsage === 'function'){
        updateControlUsage();

      } else if($(this).parent().parent().parent().parent().attr('id') === 'reagentResources' && typeof updateReagentUsage === 'function'){
        updateReagentUsage();
      } else {
        $(this).parent('td').siblings().children('.totalAmount').val( parseFloat( totalVolumeForResource ).toFixed(2) );
        $(this).parent('td').siblings().children('.totalAmount').attr('value', parseFloat( totalVolumeForResource ).toFixed(2) );
      }
    }
  });
}

/** Set reagent total to equal sum of dilution values
**/
function diluentSumSet() {
  let diluentTotalVolume = 0;
  $('.diluentVolume').each(function() {
    let containerVal = $(this).parent().parent().find('.dilutionContainer').val()
    if(!isNaN(parseFloat($(this).val())) && containerVal !== "") {
      diluentTotalVolume += parseFloat($(this).val());
    }
  });
  $('.totalAmount').val(diluentTotalVolume.toFixed(2));
}


/** Function to count non-empty sampleInput inputs
* RETURN - sampleCount
**/
function sampleInputCounter() {
  var sampleCount = 0;
  var sampList = $('#sampleListTable').length;
  var plate = $('.plate').length;
  var subsample = $('#splitSample_table').length
  var normTable = $('#normTable').length
  var poolTubeListTable = $('#poolTubeListTable').length
  // js/cherryPick/traytoSample.js adds a cherryPickTray class to .plate to signify the step is cherry picking a tray to a sample/pooltube/batch. 
  // This is used to bypass sample counting trays which would have all of the samples and not just the selected samples from the tray.
  var isCherryPick = $('.plate').hasClass('cherryPickTrayToList');

  if(subsample > 0){
    $('.splitSample_containerId').each(function(){
      if($(this).val() != ''){
        sampleCount++;
      }
    })
  } else if(normTable > 0){
    sampleCount = $('.sampleInput').filter( function(i, item) {
      if($(item).val() != ''){
        return item
      }
    }).get().length  
  } else if(poolTubeListTable > 0){
    sampleCount = $('.poolTubeListTable_scan').filter( function(i, item) {
      if($(item).val() != ''){
        return item
      }
    }).get().length
  // if there is no samplelist used on the step
  } else if(plate > 0 && isCherryPick === false){
    sampleCount = $('.sampleInput').filter( function(i, item) {
      if($(item).val() != ''){
        return item
      }
    }).get().length
  } else if(sampList === 0 && isCherryPick === false){
      $('.sampleInput').each( function() {
        if($(this).val() != ''){
          sampleCount++;
        }
      })
  } else {
    sampleCount = $('.sampleListTable_checkbox:checked').length //only count the items checked
  }
  return sampleCount;
}

/** Updates the wellLayoutTable if user scans sample into a well
*   Goes through each row in the table, gets the well and looks for the class ending in that well on the screen
*   Sets the sample value to the corresponding well value
**/
function updateSampleWellTable() {
  $('.tableWell').each( function() {
    var well = $(this).val();
    var wellContent = $('[name="destinationTray:' + well + '"]').val();
    $(this).parent('td').siblings().children('.tableHasSample').val(wellContent);
    $(this).parent('td').siblings().children('.tableHasSample').attr('value', wellContent);
  });
}

/** Function adds missing master mix component information to resources tables
* Removes previously added master mix rows based on masterMixRow class
* If resource already exists in the table, nothing happens
* For each new master mix component, checks if resource is reagent, control, consumable, or instrument
*   then adds a row to the correct table.
* Shows the corresponding resource table if a row is added
**/
function addMasterMixComponents () {
  $('.masterMixRow').each( function() {
    $(this).parent('tr').remove();
  });
  var units;
  var masterMixResourceType;
  var inventoryType;

  var existingResources = [];
  $('.resourceType').each( function() {
    existingResources.push( $(this).val() );
  });

  $('.masterMixReagentType').each( function() {

    masterMixResourceType = $(this).val();
    inventoryType = $(this).parent('td').siblings().children('.masterMixInventoryType').val();
    units = $(this).parent('td').siblings().children('.masterMixUnits').val();

    if (jQuery.inArray( $(this).val(), existingResources) !== -1 ) {
    }
    else {
      var tableName;
      if (inventoryType == 'Received Reagent' || inventoryType == 'Prepared Reagent') {
        tableName = "reagentResources";
        $('#reagentResources').show();
      }
      else if (inventoryType == 'Received Control' || inventoryType == 'Prepared Control') {
        tableName = "controlResources";
        $('#controlResources').show();
      }
      else if (inventoryType == 'Received Consumable' || inventoryType == 'Prepared Consumable' || inventoryType == 'Consumable') {
        tableName = "consumableResources";
        $('#consumableResources').show();
      }
      else if (inventoryType == 'Instrument') {
        tableName = "instrumentResources";
        $('#instrumentResources').show();
      }
      // Adds row for new reagents
      inputTableAddRow(tableName, true);
      $('#' + tableName).find("tr").last().children("td").each( function() {
        existingResources.push( masterMixResourceType );
        $(this).children('.totalAmount').addClass('masterMixRow');
        $(this).children('.resourceType').val(masterMixResourceType);
        $(this).children('.resourceType').attr('value', masterMixResourceType);
        $(this).children('.resource').val('');
        $(this).children('.resource').attr('value', '');
        $(this).children('.sampleAmount').val(0.00);
        $(this).children('.sampleAmount').attr('value', 0.00);
        $(this).children('.totalAmount').val(0.00);
        $(this).children('.totalAmount').attr('value', 0.00);
        $(this).children('.units').val(units);
        $(this).children('.units').attr('value', units);
        $(this).children('.resource').attr('data-parsley-required', true);
        $(this).children('.resource').prop('required', true);
        $(this).children('.resource').attr('required', true);
        $(this).children('.resource').addClass('required');
      });

    }
  });
}

/** Removes row from wellLayoutTable
* Parameter: thisInput - user clicks the X to remove a sample - well association
*   the id of the X is a combination of the well and the master mix id
* Calculates the master mixes again
**/
function removeMasterMixFromWell( thisInput ) {
  var idArray = thisInput.attr('id').split('_');
  var masterMixId = idArray[0];
  var well = idArray[1];

  // Removes appended master mix span
  thisInput.next('.masterMixAppend').remove();
  // Removes this X
  thisInput.remove();

  $('.tableWell').each( function() {
    // Searches for correct well
    if ( $(this).val() == well ) {
      // Gets the for each master mix associated to this well in the table
      var thisMasterMix = $(this).parent('td').siblings().children('.tableMmId').val();
      // If the masterMix removed and the master mix in the row match
      if ( thisMasterMix == masterMixId ){

        var table = 'wellLayoutTable';
        var lastRow =  $('#' + table + ' tbody tr').last();
        var rowNumberCurrent = lastRow.index();

        $('input[name="' + table + '_numRows"]').val(rowNumberCurrent);

        var removedRow = $(this).attr('name').split('_')[1];
        $('input[name="' + table + '_' + removedRow + '"]').remove();

        var count = 0;
        $( "input[name^='"+table+"']" ).each( function() {
          if( $(this).attr('type') == 'hidden' ) {
            count++;
            var nameParts = $(this).attr('name').split('_');

            if ( nameParts[0] == table && nameParts[1] != 'numRows' ) {
              var row = parseInt(count)-2;
              var name = nameParts[0]+'_'+row;
              $(this).attr('name', name);
            }
          }
        });

        $(this).parent('td').siblings().children('.tableMmId').val('');
        $(this).parent('td').siblings().children('.tableMmName').val('');

      }
    }
  });

  calculateUsageTotals();
  calculateMasterMixVolumes();
  showInstructions();

}

/** Shows the instruction div with instructions
* Will only load the ajax if the masterMixArray has at least one master mix
**/
function showInstructions() {
  var ajaxStep = "AJAX_GetMasterMixInstructions"
  var masterMixArray = [];

  // For each master mix in the wellLayoutTable, adds the master mix to the array
  $('.tableHasSample').each( function() {
    masterMixId = $(this).parent('td').siblings().children('.tableMmId').val();
    masterMixArray.push(masterMixId);
  });

  // Building string for mysql
  var masterMixList = JSON.stringify(masterMixArray)
  var num = masterMixArray.length;

  // Shows instructions and user notification if master mixes exist
  if ( num > 0) {
    var callObject = {
        stepName: "AJAX_GetMasterMixInstructions",
        masterMixList: masterMixList
    }
    $.getJSON('uniflow?', callObject).done(function (data) {
        buildMasterMixInstructionTable(data);
        masterMixInstructionVolumes();
    });

    $('.masterMixInstructions').show();
    $('#masterMixChangeDiv').show();
  }
  else {
    $('.masterMixInstructions').hide();
  }

}


function buildMasterMixInstructionTable(data){
  $("#masterMixInstructionsDiv").html("");
  $("#masterMixInstructionsDiv").append("<table id='masterMixInstructions' ></table>");

  let columnArr = [];

  columnArr.push(
    {
      "title": "Master Mix Code",
      "data": null,
      "render": function (data, type, row, meta) {
          let currentDataObj = data;
          let returnValue = currentDataObj.Master_Mix_Code;
          return returnValue;
      }
    },
    {
        "title": "Instructions",
        "data": null,
        "render": function (data, type, row, meta) {
            let currentDataObj = data;
            let returnValue = currentDataObj.Instructions;
            return returnValue;
        }
    },
    {
        "title": "Per Sample",
        "data": null,
        "render": function (data, type, row, meta) {
            let currentDataObj = data;
            let returnValue = currentDataObj.Per_Sample;
            return returnValue;
        }
    },
    {
        "title": "Total Reagent Volumes",
        "data": null,
        "render": function (data, type, row, meta) {
            let currentDataObj = data;
            let returnValue = currentDataObj.Total_Reagent_Volumes;
            return returnValue;
        }
    },
    {
        "title": "mmId",
        "data": null,
        "render": function (data, type, row, meta) {
            let currentDataObj = data;
            let returnValue = currentDataObj.mmId;
            if(type === "display"){
                return "<input type='text' readonly='' class='instructionMMId' value='"+returnValue+"' tabindex='1'>";
            }
            return returnValue;
        }
    }
  );

  var options = {};

  // create actual datatable
  var table = stdDataTableFromArray("#masterMixInstructions", columnArr, data, false, options);

  $("#masterMixInstructions_filter").hide();
  $("#masterMixInstructions_wrapper").children(".bottom").hide();
  hideColumns("#masterMixInstructions", "instructionMMId");
  
}

/** Appends span on new line to each well if the well has a master mix assigned from the tray map
* The format is X MasterMixName
* X has a class of "deleteMasterMixFromWell" and when clicked, will remove the spand and the row from the layout table
*   has an id of masterMix_well
* MasterMixName is just the master mix name
**/
function appendMasterMixesToTray() {
  $('.tableWell').each( function() {
    var well = $(this).val();
    var masterMix = $(this).parent('td').siblings().children('.tableMmName').val();
    var masterMixId = $(this).parent('td').siblings().children('.tableMmId').val();
    $('.sampleInput[class$="_' + well + '"]').parent().append('</br><span style="color:red;" class= deleteMasterMixFromWell id='+masterMixId+'_'+well+'>X</span> <span class= masterMixAppend> ' + masterMix + '</span>');
  });
}

function masterMixInstructionVolumes() {

  $('.instructionMMId').each( function() {
    var instructionMMId = $(this);
    var mmPerSample = 0;
    var reagentTotalString = '';
    var sampleCount = 0;
    var reagentVolume = 0;

    $('.tableHasSample').each( function() {
      if ( $(this).val().trim() != '' ){
        if ( $(this).parent('td').siblings().children('.tableMmId').val() == instructionMMId.val() ) {
          sampleCount++;
        }
      }

    });

    $('.tableMasterMixId').each( function() {
      var tableMasterMixId = $(this);

      if ( instructionMMId.val() == tableMasterMixId.val() ){
        mmPerSample += parseFloat( tableMasterMixId.parent('td').siblings().children('.masterMixSingleVolumeType').val() );
        reagentTotalString += tableMasterMixId.parent('td').siblings().children('.masterMixReagentType').val();
        reagentTotalString += ': ';
        reagentVolume = sampleCount * ( parseFloat( tableMasterMixId.parent('td').siblings().children('.masterMixSingleVolumeType').val() ) * (1 + ( parseFloat( tableMasterMixId.parent('td').siblings().children('.masterMixOveragePercentage').val() ) /100)) );
        reagentTotalString += reagentVolume.toFixed(2);
        reagentTotalString += '</br>';
      }
    });

    instructionMMId.parent('td').siblings('.col2').html( mmPerSample.toFixed(2) );
    instructionMMId.parent('td').siblings('.col3').html( reagentTotalString );
  });
}

