// mmClick variable for ensuring user clicks master mix calculation button
	var mmClick = true;
	
$(document).ready( function() {
	columnHide();
	$('#plateMMFieldset').hide();
	$('#gridMMFieldset').hide();
	var batchId = '';
	if ($('#addMasterMix').val() == 'false') {mmClick = false;}
    var stepName = 'Ajax Get Samples From Queue';
	var queueName = $('#stepName').val();

	if ($('#selectBatch').val() == 'true'){
		$('#batchId').hide();
	}
  if ($('#tubeTransfer').val() == 'true'){
    $('#batchId').show();
  }

	if ($('#selectBatch').val() == 'false'){
		clearTblFunction('samplesTable');
		populateSamples(stepName, queueName, batchId, '');
		columnHide();
	}

	$('#batchSelect').change( function() {
		clearTblFunction('samplesTable');
		$('#prevBatchId').val($('#batchSelect').val());
		batchId = $('#batchSelect').val();
		var restrictByWorkflow = $('#restrictByWorkflowIdentifier').val();
		var workflowIdentifier = $('#workflowIdentifier').val();
		console.log('batchid: ', batchId, 'Restrict: ', restrictByWorkflow);
        if (restrictByWorkflow == 'true'){
	      if (batchId.length > 0){
	        stepName = 'Ajax Get Samples In Batch Grouped By Workflow Identifier';
			populateSamples(stepName, queueName, batchId, workflowIdentifier);
			columnHide();

			stepName = 'Ajax Get Previous Batches';
			populatePreviousBatchesTable(stepName, batchId);
		  }
		}else{
		  if (batchId.length > 0){
	        stepName = 'Ajax Get Samples In Batch';
			populateSamples(stepName, queueName, batchId, '');
			columnHide();

			stepName = 'Ajax Get Previous Batches';
			populatePreviousBatchesTable(stepName, batchId);
		  }
		}
	});

$('.sampleWell').change( function() {
	var wellName = $(this).attr('name');
	var well = wellName.replace('tray:', '');
	console.log(well + ' : ' + $(this).val());
	if ( $(this).val().length > 0){
		$('.mmTray_' + well).addClass('hasContent');
	}
	if ( $(this).val().length == 0){
		$('.mmTray_' + well).removeClass('hasContent');
	}
});
$('#masterMixButton').click(function(){
  var batchScanAlert = 'false'
  if( $('#selectBatch').val() == 'true' && $('#tubeTransfer').val() == 'true' ){
  	$('#samplesTable > tbody > tr').each(function(){
  		if( $(this).children().children('.sampleTube').val() === '') {
  			batchScanAlert = 'true'
  		};
  	});
  };
  if( $('#selectBatch').val() == 'true' && $('#tubeTransfer').val() == 'false' && $('#plateTransfer').val() == 'false'){
  	$('#samplesTable > tbody > tr').each(function(){
  		if( $(this).children().children('.sampleTube').val() === '') {
  	 		batchScanAlert = 'true'
  		};
  	});
  };
  if (batchScanAlert === 'true'){
  	alert("You must scan in all the samples for this batch!")
  };		
});
$('#fillPlate').click(function() {
	var batchScanAlert = 'false'
  $('.hasContent').removeClass('hasContent');
	$('.sampleWell').val('');
	$('.sampleWell').attr('placeholder', '');
	$('.sampleWell').readonly= false;
  if( $('#selectBatch').val() == 'true' && $('#plateTransfer').val() == 'true' ){
  	$('#samplesTable > tbody > tr').each(function(){
  		if( $(this).children().children('.sampleTube').val() === '') {
  			batchScanAlert = 'true'
  		};
  		if (batchScanAlert === 'true'){
  			alert("You must scan in all the samples for this batch!")
  		};	
  	});
  };
  $('.sampleWell').removeClass('hasContent');
	var sampleString = '';
	var sampleArray = new Array();
  
	if ($('.samplesTable').length > 0){
		$(".samplesCheckbox:checked").each(function(){
			sampleArray.push($(this).parents('td').siblings().children(".sampleTube").val());
			if (sampleString.length == 0) {
				sampleString = "'" + $(this).parents('td').siblings().children(".sampleTube").val() + "'";
			} else {
				sampleString = sampleString + ", '" + $(this).parents('td').siblings().children(".sampleTube").val() + "'";
			}
		});
	}

	var ajaxStep = "Ajax Get Containers Types and Wells 2";
	var plateMap = $("#plateMapHidden").val();
	var getData = {
		"stepName": ajaxStep,
		"plateMap": plateMap,
		"sampleString": sampleString
	};
	console.log(sampleArray);
	console.log(sampleString);
	var count = sampleArray.length;
	console.log(getData);
	$.getJSON("/uniflow?callback=?", getData)
	.done( function(data, status) { 
		console.log(data); 
		console.log(data.length);
		for(var i = 0; i < data.length; i++)
		{
			var Container = data[i].containerId;
			var Type = data[i].containerType;
			var Order = data[i].order;
			var Well = data[i].well; 
			if (Type == 'Blank'){
				$('.tray_' + Well).readonly= true;
			}
			else if (Type != 'Blank') {
				$('.tray_' + Well).val(Container);
				if (Container.length > 0) {
					$('.mmTray_' + Well).addClass('hasContent');
				}
			}
			else { 
				$('.tray_' + Well).attr('placeholder',Type);
			}
		}
	});

	$('#stepFormSubmitButton').show();
  });


	$('#stepFormSubmitButton').click(function(ev){
		ev.preventDefault();
		var missingTrayId = false;
		var missingMMReagent = false;
		$('#pcrPlateId').each(function() {
			if ( $(this).val() === '' ){
				missingTrayId = true
			};
		});
		$('.Reagent').each(function() {
			if ( $(this).val() === '' ){
				missingMMReagent = true
			};
		});
		if ( missingTrayId ) {
			alert("The Tray Id cannot be left blank!  Please add a Tray Id.");
		} else if (missingMMReagent) {
			alert("The reagents cannot be left blank!  Please scan barcodes for each reagent.");
		} else if (mmClick) {
			alert("The master mix reagents must be calculated!  Please click 'Get Instructions and Reagents'.");
		} else {
			$('[name="stepForm"]').submit();
		};
	});

});

function columnHide() {
	var columnHeader;

	for (i=3; i < 12; i++){
		columnHeader = $('#samplesTable th:nth-child(' + i + ')').text();
		if (columnHeader == 'Hidden') {
			var currColNum = i - 1;
			var currentParentCol = '.col'+currColNum;
			$(currentParentCol).children().val('Do not record');
			$(currentParentCol).hide();
			$('.hide').hide();

		}
	}
}

function checkBoxes(scanField){
	if (scanField.val().length > 0) {
		scanField.parent('td').siblings().children('.samplesCheckbox').prop('checked', true);
		scanField.parent('td').siblings().children('.samplesCheckbox').val('true');
		scanField.addClass('')
	}
	if (scanField.val().length == 0) {
		scanField.parent('td').siblings().children('.samplesCheckbox').prop('checked', false);
		scanField.parent('td').siblings().children('.samplesCheckbox').val('false');
	}
}

function validateInput(scanField){
	var scanFieldVal = scanField.val();
	var tubeTransfer = $('#tubeTransfer').val();
	var sampleVal = scanField.parent('td').siblings().children('.sample').val();

	if (tubeTransfer == 'false' && sampleVal != scanFieldVal && scanFieldVal.length > 0){
		alert('You have scanned the incorrect tube for: ' + sampleVal);
		scanField.val('');
	} else if (tubeTransfer == 'true' && sampleVal == scanFieldVal && scanFieldVal.length > 0) {
		alert('You have scanned the same tube for: ' + sampleVal);
		scanField.val('');
	}
}

function populatePreviousBatchesTable(stepName, batchId){
	var getData = {
		"stepName": stepName
		, "batchId": batchId
	};
	$('#previousBatches').load('/uniflow?callback=?', getData);
}

function populateSamples(stepName, queueName, batchId, workflowIdentifier){
  var getData = {
    "stepName": stepName
    , "queueName": queueName
    , "batchId": batchId
    , "workflowIdentifier": workflowIdentifier
  };
  $.getJSON('uniflow?callback=?', getData)
    .done(function(data) {
    	data.forEach( function(item, i) {
    		console.log(item.Sample);
  			var nextRowId = $('#samplesTable tbody tr').length;
  			var newRow = $('<tr class="stdRow r'+nextRowId+'"></tr>');

  			$('<td class="stdTd col0"><input type="checkbox" class="samplesCheckbox" name="samplesTable_'+nextRowId+'_1" value="" tabindex="1"></td>'+
					'<td class="stdTd col1"><input type="text" class="sample" readonly="true" name="samplesTable_'+nextRowId+'_2" value="'+item.Sample+'" tabindex="99999"></td>'+
					'<td class="stdTd col2"><input type="text" class="sampleTube" name="samplesTable_'+nextRowId+'_3" value tabindex="1"></td>'+
          '<td class="stdTd col3">'+item.Accession+'</td>'+
          '<td class="stdTd col4">'+item.Patient+'</td>'+
          '<td class="stdTd col5">'+item.Panel+'</td>').appendTo(newRow);

  			for (j = 7; j < 12; j++){
  				var columnHeader = $('#samplesTable th:nth-child(' + j + ')').text();
  				console.log(columnHeader);
  				var colClass = j-1;
  				if (columnHeader != 'Hidden') {
  					console.log('not hidden row creation');
  					$('<td class="stdTd col'+colClass+'"><input type="text" name="samplesTable_'+nextRowId+'_'+j+'" tabindex="99999" value></td>').appendTo(newRow);
  				}
  				if (columnHeader == 'Hidden') {
  					console.log('hidden row creation')
  					$('<td class="stdTd col'+colClass+'"><input type="text" class="hide" name="samplesTable_'+nextRowId+'_'+j+'" tabindex="99999" value></td>').appendTo(newRow);
  				}
  			}

        $('<td class="stdTd col11"><textarea name="samplesTable_'+nextRowId+'_12" tabindex="99999" value></textarea></td>').appendTo(newRow);
        if(item.Test){
        	$('<td class="stdTd col12 workflow">'+item.Test+'</td>').appendTo(newRow);
        }
        $('</tr>').appendTo(newRow);

  			newRow.appendTo('#samplesTable tbody');
  			$('input[name="samplesTable_numRows"]').val(nextRowId+1);
    
    	});

		$('.samplesCheckbox').addClass('hide');
		$('.samplesCheckbox').parent('td').addClass('hide');

		$('th:contains("Select")').addClass('hide');

		if($('.workflow').length == 0){
	      $('th:contains("Workflow")').addClass('hide');
	    }
    	columnHide();


		$('.sampleTube').on('change', function() { 
			checkBoxes($(this)); 
			validateInput($(this));
		});

  	});
}


function getInstructionsAndReagents(){
	console.log('buttonclick');
	mmClick = false;
	var masterMixArray = [];
	if($('#plateTransfer').val() == 'true'){
		masterMixArray = createArrayPlate();
	} else {
		masterMixArray = createArray();
	}
	var overage = $('#overage').val()/100;
	console.log(masterMixArray);
	clearTblFunction('mmReagents');
	arrayPostFunction(masterMixArray, overage);
	$('#MasterMixDiv').show();
	console.log('post complete');
}

function createArray() {
	var masterMixArray = [];
	var name = $('#masterMixCode').val();
	var count = 0;
	$('.sampleTube').each( function() {
		if ($(this).val().length > 0) {
			count++;
		}
	});
	var masterMixObject = {
		name: name,
		count: count
	}
	masterMixArray.push(masterMixObject);
	return masterMixArray;
}


function createArrayPlate() {
	console.log('array function');
	var masterMixArray = [];
	$('.hasContent').each( function (i, obj) {
		var count = 0;
		var inputValue = obj.value;
		console.log('inputval', inputValue);
		if (inputValue.length > 0) {
			count = nameCount(obj.value);
			var name = obj.value;
			var masterMixObject = {
				name: name,
				count: count
			}
			console.log('object');
			console.log(masterMixObject);
			if (containsObject (masterMixObject, masterMixArray)) {
 				return;
			}
			else {
				masterMixArray.push(masterMixObject);
			}
		}
	});
	return masterMixArray;
}

function nameCount(wellValue) {
	var count = 0;
	$('.hasContent').each( function(i, obj) {
		if (obj.value == wellValue) {
			count++;
		}
	});
	return count;
}

function containsObject(obj, array) {
	for (i = 0; i < array.length; i++) {
		if (array[i].name === obj.name) {
			return true;
		}
	}
	return false;
}

function arrayPostFunction(array, overage) {
	var arrayJson = JSON.stringify(array);
	$('#arrayText').val(arrayJson);
	var overageOverride = $('#overrideOverages').is(':checked');
	var postData = {
		"theData": arrayJson,
		"overage": overage,
		"overageOverride": overageOverride,
		"stepName": "Ajax POST Master Mix",
		"Submit": true,
		"formNumber": 0
	};

	$.post('/uniflow', postData)
	.done(function(data) {
		var postHtml = $.parseHTML(data);
		var postError = checkPostError(postHtml);
		if (postError !== false) {
			alert(postError);
		}
		else {
			console.log("Success!");
			$('#mmInstructionsDiv').load('/uniflow', {stepName: 'Ajax Get Master Mix Instructions and Volumes'}, function(){
			});
			var mmReagentsData = {
				"stepName": 'Ajax Get Master Mix Reagents Obj'
			}
			$.getJSON("/uniflow?callback=?", mmReagentsData)
			.done( function(data, status) { 
				console.log('generateRow start');
				console.log(data);
				for(var i = 0; i < data.length; i++){

					generateRow('mmReagents', data[i]);
				}
			});
		}
	})
	.fail(function(jqxhr, textStatus, error) {
		var err = "POST Request Failed: " + textStatus + ", " + error;
		console.log(err);
		alert(err);
	});
}

function generateRow(tableId, rowData) {
  console.log(rowData);

  var nextRowId = $('#'+tableId+' tbody tr').length;
  var newRow = $('<tr class="stdRow r'+nextRowId+'"></tr>');

  $('<td class="stdTd col0"><input type="text" readonly="true"  name="'+ tableId+'_'+nextRowId+'_1" value="'+rowData.mmCode+'" tabindex="99999"></td>'+
    '<td class="stdTd col1"><input type="text" readonly="true" name="'+ tableId+'_'+nextRowId+'_2" value="'+rowData.mm+'" tabindex="99999"></td>'+
    '<td class="stdTd col2"><input type="text" readonly="true" class="type" name="'+ tableId+'_'+nextRowId+'_3" value="'+rowData.reagentType+'" tabindex="99999"></td>'+
    '<td class="stdTd col3"><input type="number" readonly="true" class="amount" name="'+ tableId+'_'+nextRowId+'_4" value="'+rowData.amount+'" tabindex="99999"></td>'+
    '<td class="stdTd col4"><input type="text" readonly="true" name="'+ tableId+'_'+nextRowId+'_5" value="'+rowData.unit+'" tabindex="99999"></td>'+
    '<td class="stdTd col5"><input type="text" class="resources Reagent" name="'+ tableId+'_'+nextRowId+'_6" value="" tabindex="1"></td>').appendTo(newRow);
  newRow.appendTo('#'+tableId+' tbody');
     //Update the numRows so it can be processed
  $('input[name="' + tableId + '_numRows"]').val(nextRowId+1);
}

function clearTblFunction(tableId) {
  var deletedCount = 0;
  var rowCount = 0;

  $('#'+tableId+' tbody tr').each(function(i){
    deletedCount++;
    $(this).remove();
  });
  if(deletedCount > 0) {
    $('#'+tableId+' tbody tr').each(function(i){
      rowCount++;
    }); 
    $('input[name="' + tableId + '_numRows"]').val(rowCount);
  }
}











