/**
 * Frameshift
 * Configuration Tools
 * 
 * @requires DataTables
 * @see {@link https://datatables.net/}
 * 
 * @author Harley Newton
 * @copyright 2018 Sunquest Information Systems
 * @version 1.1.20180802
 */

/**
 * List Protocols
 * 
 * @returns {void} Table listing of the available protocols
 */
function listProtocols() {
	$(function() {
		$('#stepFormSubmitButton').prop('disabled', true).hide();
		
		var tableSelector = '#listProtocolsTable';
		var table = $(tableSelector).DataTable({
			"paging": true,
			"ordering": true,
			"searching": true,
			"info": true,
			"stateSave": true,
			"lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]],
			"data": [],
			"columns": [
	            {"title": "", "visible": false},
	            {"title": "", "width": "10px", "className": "dt-center", "orderable": false},
	            {"title": "Protocol", "className": "dt-head-left"},
	            {"title": "Type", "className": "dt-head-left"},
	        ]
		});
		
		appendProgressOverlay(tableSelector);
		
		var getData = {
			"stepName": "GET All FS Protocols"
		};
		$.getJSON('uniflow', getData)
		.done(function(data) {
			$.each(data, function(i, d) {
				var link = '<a class="view-link" href="/uniflow?' 
					+ $.param({"lastForm": "Y", "stepName": "Configure Protocols", "recId": d.id}) 
					+ '" title="View Protocol"><span class="view-icon"></span></a>';
				table.row.add([d.id, link, d.name, d.type]).draw();
			});
			
			removeProgressOverlay();
		});
	});
}

/**
 * Protocol Builder
 * Create and modify protocols from the available tasks.
 * 
 * @returns {void|false} Redirects to protocol list on save or false on error
 */
function protocolBuilder() {
	$(function() {
		var form = $('form');
		var protocolId = $('#protocolId').val();
		var protocolName = $('#pName').val();
		var protocolOptions = '#pOptions';
		setProtocolOptions();
		
		var settingsDiv = "#settingsDiv";
		var settingsArea = "#settingsArea";
		var dialog = $(settingsDiv).dialog({
			autoOpen: false,
			modal: true,
			width: 500,
			height: "auto",
			position: {
				my: "top", at: "top", of: "#mainDiv"
			},
			close: function() {
				$(settingsArea).html('');
				$(protocolOptions).val('');
				dialog.dialog("close");
			}
		});
		
		var tableSelector = '#protocolTaskTable';
		var table = $(tableSelector).DataTable({
			"paging": false,
			"searching": false,
			"info": true,
			"data": [],
	        "rowReorder": true,
	        "orderFixed": [0, 'asc'],
			"columns": [
	            {"title": "", "visible": false},
	            {"title": "", "width": "10px", "className": "reorder", "orderable": false},
	            {"title": "Task", "className": "dt-head-left", "orderable": false},
	            {"title": "", "width": "64px", "className": "dt-center", "orderable": false},
	        ]
		});
		var rowCount = 1;
		var seenTasks = {};
		
		$('.directions').click(function() {
			$('#directions').toggle();
		});
		
		// New
		if (protocolId != 'new') {
			appendProgressOverlay(tableSelector);
			
			var getData = {
				"stepName": "GET FS Protocol By Id",
				"protocolId": protocolId
			};
			
			$.getJSON('uniflow', getData)
			.done(function(data) {
				protocolName = data[0].name;
				$('#pName').val(data[0].name);
				$('#pType').val(data[0].type);
				$('#pTag').val(data[0].tag);
				$('#pNotes').val(unescapeNewlines(data[0].notes));
				
				var protocolData = JSON.parse(data[0].tasks);
				$.each(protocolData.protocol.tasks, function(k, settings) {
					var rowData = buildRowData(rowCount, settings.taskName, settings);
					table.row.add(rowData).draw();
					rowCount++;
					seenTasks[settings.taskName] = true;
				});
				
				removeProgressOverlay();
			});
		}
		
		// Check if protocol exists
		$('#pName').on('change', function() {
			var pName = $(this).val().trim();
			if (pName == protocolName || pName == '') {
				return false;
			}
			
			var getData = {
				"stepName": "GET Step Group Exists",
				"name": pName
			};
			$.getJSON('uniflow', getData)
			.done(function(data) {
				if (data.length > 0) {
					var msg = "Protocol name already exists...\nName: " + pName;
					//console.log(data[0].stepGroupName);
					
					alert(msg);
					$('#pName').val(protocolName).focus();
					
					return false;
				}
			});
		});
		
		// Refresh Protocol Tasks
		/* Not working
		 * $('#refreshProtocol.refresh-icon').on('click', function() {
			var flag = confirm("Refresh protocol tasks?");
			if (! flag) {
				return false;
			}
			appendProgressOverlay(tableSelector);
			console.log("Working...");
			
			var refreshPromise = [];
			table.rows().every(function (rowIdx, tableLoop, rowLoop) {
				var refreshJson = JSON.parse($(this.data()[3]).filter('textarea').val());
				var refreshId = refreshJson.taskId;
				delete refreshJson.taskId;
				delete refreshJson.taskName;
				
				var refreshSettingType = 'task';
				if (refreshJson.hasOwnProperty('routineId') && refreshJson.routineId) {
					refreshId = refreshJson.routineId;
					refreshSettingType = 'routine';
					
					delete refreshJson.routineName;
					delete refreshJson.routineAlias;
					delete refreshJson.routineTag;				
					delete refreshJson.routineType;				
				}			
				else {
					delete refreshJson.taskAlias;
					delete refreshJson.taskTag;				
				}
				
				var prevSettings = (refreshJson.hasOwnProperty('settings')) ? refreshJson.settings : refreshJson;
				
				if (refreshJson.hasOwnProperty('cnote')) {
					prevSettings.cnote = refreshJson.cnote;
				}
				
				var refreshXHR = setSettings(refreshId, refreshSettingType, prevSettings);
				refreshPromise.push(refreshXHR);
				$.when(refreshXHR).then(function(data, textStatus, jqXHR) {
					if (textStatus == 'success') {
						console.log(".");
						var refreshSettings = getOptionSettings();
						if (prevSettings.hasOwnProperty('cnote')) {
							refreshSettings.cnote = prevSettings.cnote;
						}
						
						var refreshData = buildRowData(rowIdx, refreshSettings.taskName, refreshSettings);
						table.row(rowIdx).data(refreshData);
					}
				});
			});
			
			if (refreshPromise) {
				$.when.apply(null, refreshPromise)
				.done(function(data, textStatus, jqXHR) {
					table.draw();
					
					removeProgressOverlay();
					console.log("REFRESHED");
				});
			}
		});*/
		
		// Delete
		$(tableSelector + ' tbody').on( 'click', 'span.delete-icon', function () {
			var delRow = $(this).parents('tr');
			var delSeenTask = table.row(delRow).data()[2];
			var delTask = table.row(delRow).data()[3];
			var isRowRemoved = removeRow(table, delRow);
			if (isRowRemoved !== false) {
				delete seenTasks[delSeenTask];
				rowCount = isRowRemoved;
				
				var delTaskSettings = JSON.parse($(delTask).filter('textarea').val());
				var delRoutineId = (delTaskSettings.hasOwnProperty('routineId')) ? delTaskSettings.routineId : 0;
				$(protocolOptions).append('<option data-task-id="' + delTaskSettings.taskId + '" data-routine-id="' + delRoutineId + '" value="' + delTaskSettings.taskName + '">' + delTaskSettings.taskName + '</option>');
			}
		});
		
		// Options
		$(protocolOptions).on('change', function() {
			var selectedOption = $("option:selected", this);
			var taskId = selectedOption.data('taskId');
			var routineId = selectedOption.data('routineId');
			var optionName = selectedOption.val();
			
			var optionId = taskId;
			var optionType = 'task';
			if (routineId != 0) {
				optionId = routineId;
				optionType = 'routine';
			}
			
			if (optionId == '' || optionName == '') { return false; }
			
			showWaitIndicator();
			setSettings(optionId, optionType);
			
			$(settingsDiv).dialog("option", "title", "Settings - " + optionName);
			$(settingsDiv).dialog("option", "position", { my: "top", at: "top", of: "#optionsDiv"});
			$(settingsDiv).dialog("option", "buttons", {
				"Cancel": function() {
					$(settingsArea).html('');
					dialog.dialog("close");
				},
				"Add Task": function () {
					var settingsJson = getOptionSettings();
					var taskOption = $(protocolOptions + ' option[value="' + settingsJson.taskName + '"]');
					var taskItems = buildRowData(rowCount, settingsJson.taskName, settingsJson);
					table.row.add(taskItems).draw();
					rowCount++;
					seenTasks[settingsJson.taskName] = true;
					taskOption.remove();
					
					dialog.dialog('close');
				}
			});
			
			dialog.dialog('open');
		});
		
		// Settings
		$(tableSelector + ' tbody').on('click', '.settings-icon', function() {
			var thisCol = $(this).parent();
			var thisRow = $(this).parent().parent();
			var thisSettingsArea = thisCol.children().filter('textarea');
			var thisJson = JSON.parse(thisSettingsArea.val());
			var thisId = thisJson.taskId;
			delete thisJson.taskId;
			var thisName = thisJson.taskName;
			delete thisJson.taskName;
			
			var thisSettingType = 'task';
			if (thisJson.hasOwnProperty('routineId') && thisJson.routineId) {
				thisId = thisJson.routineId;
				thisSettingType = 'routine';
				
				delete thisJson.routineName;
				delete thisJson.routineAlias;
				delete thisJson.routineTag;				
				delete thisJson.routineType;				
			}			
			else {
				delete thisJson.taskAlias;
				delete thisJson.taskTag;				
			}
			
			var theseSettings = (thisJson.hasOwnProperty('settings')) ? thisJson.settings : thisJson;
			
			if (thisJson.hasOwnProperty('cnote')) {
				theseSettings.cnote = thisJson.cnote;
			}
			
			showWaitIndicator();
			setSettings(thisId, thisSettingType, theseSettings);
			
			$(settingsDiv).dialog("option", "title", "Settings - " + thisName);
			$(settingsDiv).dialog("option", "position", { my: "right top", at: "left bottom", of: $(this) });
			$(settingsDiv).dialog("option", "buttons", {
				"Cancel": function() {
					$(settingsArea).html('');
					dialog.dialog("close");
				},
				"Save": function() {
					var rowData = table.row(thisRow).data();
					var newSettings = getOptionSettings();
					if (theseSettings.hasOwnProperty('cnote')) {
						newSettings.cnote = theseSettings.cnote;
					}
					
					var newRowData = buildRowData(rowData[0], newSettings.taskName, newSettings);
					table.row(thisRow).data(newRowData).draw(false);
					
					dialog.dialog("close");
					thisRow.effect("highlight");
				}
			});
			
			dialog.dialog('open');
		});
		
		// Notes
		editNote(tableSelector + ' tbody', table);
		
		// Save
		$('#stepFormSubmitButton').on('click', function(ev) {
			$('span').remove('.error');
			if (! table.data().count()) {
				$('#protocolTaskDiv').prepend('<span class="error">Task list is empty.</span>');
				
				return false;
			}
		});
		
		form.on('submit', function(ev) {
			progressIndicator('start');
			ev.preventDefault();
			
			if (! form.parsley().isValid()) {
				progressIndicator('stop');
				
				return false;
			}
			
			var pName = $('#pName').val().trim();
			var pType = $('#pType').val();
			var pTag = $('#pTag').val();
			var pNotes = $('#pNotes').val().trim();
			
			var protocolJson = {};
			protocolJson["name"] = pName;
			protocolJson["tasks"] = [];
			
			var rows = table.rows();
			rows.every(function(rowIdx, tableLoop, rowLoop) {
				var data = this.data();
				var settings = JSON.parse($(data[3]).filter('textarea').val());
				var id = parseInt(settings.taskId);
				delete settings.taskId;
				var name = settings.taskName;
				delete settings.taskName;
				
				var s = {
					"taskId": id,
					"taskName": name
				};
				if (settings.hasOwnProperty('routineId') && settings.routineId) {
					s['routineId'] = settings.routineId;
					delete settings.routineId;
					s['routineName'] = settings.routineName;
					delete settings.routineName;
					s['routineAlias'] = settings.routineAlias
					delete settings.routineAlias;
					s['routineTag'] = settings.routineTag
					delete settings.routineTag;
					s['routineType'] = settings.routineType
					delete settings.routineType;
				}
				else {
					s['taskAlias'] = settings.taskAlias
					delete settings.taskAlias;
					s['taskTag'] = settings.taskTag
					delete settings.taskTag;
				}
				
				if (settings.hasOwnProperty('cnote')) {
					if (settings.cnote != '') {
						s.cnote = settings.cnote;
					}
					delete settings.cnote;
				}
				
				if (settings.hasOwnProperty('settings')) {
					settings = settings.settings;
				}
				
				s.settings = settings;
				protocolJson["tasks"].push(s);
			});
			protocolJson = {"protocol": protocolJson};
			var protocol = JSON.stringify(protocolJson);
			
			var postData = {
				"id": protocolId,
				"name": pName,
				"type": pType,
				"tag": pTag,
				"protocol": protocol,
				"notes": pNotes,
				"stepName": "POST Save FS Protocol",
				"Submit": true,
				"formNumber": 0
			};
			$.post('/uniflow', postData)
			.done(function(data) {
				var postHtml = $.parseHTML(data);
				var postError = checkPostError(postHtml);
				if (postError !== false) {
					alert(postError);
					progressIndicator('stop');
				}
				else {
					window.location = getUrlPath() + "?stepName=" + encodeURIComponent('Configure Protocols');
				}
			})
			.fail(function(jqxhr, textStatus, error) {
				progressIndicator('stop');
				
				var err = "POST Request Failed: " + textStatus + ", " + error;
				console.log(err);
				alert(err);
			});
		});
	});
}

/**
 * List Tasks
 * 
 * @returns {void} Table listing of available tasks
 */
function listTasks() {
	$(function() {
		$('#stepFormSubmitButton').prop('disabled', true).hide();
		
		var tableSelector = '#listTasksTable';
		var table = $(tableSelector).DataTable({
			"paging": true,
			"ordering": true,
			"searching": true,
			"info": true,
			"stateSave": true,
			"lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]],
			"data": [],
			"columns": [
	            {"title": "", "visible": false},
	            {"title": "", "width": "10px", "className": "dt-center", "orderable": false},
	            {"title": "Task", "className": "dt-head-left"},
	            {"title": "Tag", "className": "dt-head-left"},
	            {"title": "Protocol", "className": "dt-head-left"},
	        ]
		});
		
		appendProgressOverlay(tableSelector);
		
		var getData = {
			"stepName": "GET All FS Tasks"
		};
		$.getJSON('uniflow', getData)
		.done(function(data) {
			$.each(data, function(i, d) {
				var link = '<a class="view-link" href="/uniflow?' 
					+ $.param({"lastForm": "Y", "stepName": "Configure Tasks", "recId": d.id}) 
					+ '" title="View Task"><span class="view-icon"></span></a>';
				table.row.add([d.id, link, d.name, d.tag, d.protocolName]).draw();
			});
			
			removeProgressOverlay();
		});
	});
}

/**
 * Task Maker
 * Create and modify tasks from the available components.
 * 
 * @returns {void|false} Redirects to task list on save or false on error
 */
function taskMaker() {
	$(function() {
		var form = $('form');
		var taskId = $('#taskId').val();
		var taskName = $('#tName').val();
		var taskAlias = $('#tAlias').val();
		var isReusable = false;
		var taskOptions = '#cOptions';
		setComponentOptions();
		
		var taskLevelSettingsDiv = "#tLevelSettingsDiv";
		var taskLevelSettingsArea = "#tLevelSettingsArea";
		var defaultTaskSettingComponent = {  
		    "component": {  
		        "name": "",
		        "alias": "",
		        "tag": "",
		        "settings": []
		    }
		};
		
		var settingsDiv = "#settingsDiv";
		var settingsArea = "#settingsArea";
		var dialog = $(settingsDiv).dialog({
			autoOpen: false,
			modal: true,
			width: 600,
			height: "auto",
			close: function() {
				$(settingsArea).html('');
				$(taskOptions + ' span.coption').removeClass('coption-selected');
				dialog.dialog("close");
			}
		});
		
		var tableSelector = '#taskOptionTable';
		var table = $(tableSelector).DataTable({
			"paging": false,
			"searching": false,
			"info": true,
			"data": [],
	        "rowReorder": true,
	        "orderFixed": [0, 'asc'],
			"columns": [
	            {"title": "", "visible": false},
	            {"title": "", "width": "10px", "className": "reorder", "orderable": false},
	            {"title": "Option", "className": "dt-head-left", "orderable": false},
	            {"title": "", "width": "108px", "className": "dt-center", "orderable": false},
	        ],
	        "createdRow": function (row, data, index) {
		        	var createdSettings = JSON.parse($(data[3]).filter('textarea').val());
		        	setRowStyle($(row), createdSettings);
	        }
		});
		var rowCount = 1;
		
		$('.directions').click(function() {
			$('#directions').toggle();
		});
		
		// New
		if (taskId != 'new') {
			appendProgressOverlay(tableSelector);
			
			var getData = {
				"stepName": "GET FS Task By Id",
				"taskId": taskId
			};
			$.getJSON('uniflow', getData)
			.done(function(data) {
				taskName = data[0].name;
				taskAlias = data[0].alias;
				$('#tName').val(data[0].name);
				$('#tAlias').val(data[0].alias);
				$('#tTag').val(data[0].tag);
				$('#tNotes').val(unescapeNewlines(data[0].notes));
				
				isReusable = (parseInt(data[0].isReusable) == 1) ? true : false;
				$('#tRoutine').prop('checked', isReusable);
				if (isReusable) { $('#tRoutineUsage').show(); }
				
				$(taskLevelSettingsArea).val(data[0].settings);
				
				var taskData = JSON.parse(data[0].instructions);
				$.each(taskData.task.instructions, function(k, settings) {
					var displayName = (settings.hasOwnProperty("componentAlias") && settings.componentAlias != '') ? settings.componentAlias : settings.componentName;
					var rowData = buildRowData(rowCount, displayName, settings, true);
					table.row.add(rowData).draw();
					rowCount++;
				});
				
				removeProgressOverlay();
			});
		}
		
		if (taskId == 'new') {
			$(taskLevelSettingsArea).val(JSON.stringify(defaultTaskSettingComponent));
		}
		
		// Check if task exists
		$('#tName').on('change', function() {
			var tName = $(this).val().trim();
			if (tName == taskName || tName == '') {
				return false;
			}
			
			var getData = {
				"stepName": "GET Step Exists",
				"name": tName
			};
			$.getJSON('uniflow', getData)
			.done(function(data) {
				if (data.length > 0) {
					var msg = "Task name already exists...\nName: " + tName;
					//console.log(data[0].stepName);
					
					alert(msg);
					$('#tName').val(taskName).focus();
					
					return false;
				}
			});
		});
		$('#tAlias').on('change', function() {
			var tName = $(this).val().trim();
			if (tName == taskAlias || tName == '') {
				return false;
			}
			
			var getData = {
				"stepName": "GET Step Exists",
				"name": tName
			};
			$.getJSON('uniflow', getData)
			.done(function(data) {
				if (data.length > 0) {
					var msg = "Task name already exists...\nName: " + tName;
					//console.log(data[0].stepName);
					
					alert(msg);
					$('#tAlias').val(taskAlias).focus();
					
					return false;
				}
			});
		});
		
		// Check routine
		$('#tRoutine').on('change', function() {
			var thisChecked = this;
			if ($(thisChecked).is(':checked')) {
				var flag = confirm("Set task reusable?");
				if (! flag) {
					$(this).prop('checked', false);
					
					return false;
				}
				
				$('#tRoutineUsage').show();
			}
			else if (isReusable && taskId != 'new') {
				$(thisChecked).prop('checked', true);
				
				var getData = {
					"stepName": "GET FS Routines By Task Id",
					"taskId": taskId
				};
				$.getJSON('uniflow', getData)
				.done(function(data) {
					if (data.length > 0) {
						var msg = "Reusable Task is in use...\nName: " + data[0].name;
						alert(msg);
						
						return false;
					}
					else {
						$(thisChecked).prop('checked', false);
						$('#tRoutineUsage').hide();
					}
				});
			}
			else {
				$('#tRoutineUsage').hide();
			}
		});
		
		$('#tRoutineUsage').on('click', function() {
			if (taskId == 'new') { return false; }
			loadReusableTasksTable(taskId, this);
		});
		
		// Task Settings
		addSetting(taskLevelSettingsDiv, taskLevelSettingsArea);
		
		$('#taskSettings.preferences-icon').on('click', function() {
			var showTaskSettings = $(taskLevelSettingsArea).val();
			
			var taskSettingsDialog = $(taskLevelSettingsDiv).dialog({
				autoOpen: false,
				modal: true,
				title: "Settings - " + $('#tName').val(),
				width: "auto",
				height: "auto",
				position: {
					my: "right top", at: "left bottom", of: "#taskSettings"
				},
				beforeClose: function() {
					var saveTaskSettings = $(taskLevelSettingsArea).val();
					if (isJSON(saveTaskSettings)) {
						$(taskLevelSettingsArea).val(JSON.stringify(JSON.parse(saveTaskSettings)));
						
						return true;
					}
					
					return false;
				},
				close: function() {
					$(this).dialog("close");
					if ($('#isEditDefaults').is(':checked')) {
						$('#isEditDefaults').trigger('click');
					}
				},
				buttons:{
					"Cancel": function() {
						$(taskLevelSettingsArea).val(showTaskSettings);
						$(this).dialog("close");
					},
					"Save": function() {
						$(this).dialog("close");
					}
				}
			});
			
			if ($(taskLevelSettingsArea).val() != '') {
				$(taskLevelSettingsArea).val(JSON.stringify(JSON.parse(showTaskSettings), null, 4));
			}
			else {
				var setDefaultTaskSettings = defaultTaskSettingComponent;
				setDefaultTaskSettings.component.name = $('#tName').val().trim();
				setDefaultTaskSettings.component.alias = $('#tAlias').val().trim();
				setDefaultTaskSettings.component.tag = $('#tTag').val();
				$(taskLevelSettingsArea).val(JSON.stringify(setDefaultTaskSettings, null, 4));
			}
			
			$('#isEditDefaults').click(function() {
				if ($(this).is(':checked')) {
					document.getElementById('newComponentSettingBtn').style.setProperty('color', 'inherit');
					$(taskLevelSettingsArea).prop('readonly', false).css({"background-color": "white"});
				}
				else {
					document.getElementById('newComponentSettingBtn').style.setProperty('color', 'white', 'important');
					$(taskLevelSettingsArea).prop('readonly', true).css({"background-color": "lightgreen"});
				}
			});
			
			$(taskLevelSettingsArea).show();
			taskSettingsDialog.dialog('open');
		});
		
		// Refresh Task Instructions
		/* Not working
		 * $('#refreshTask.refresh-icon').on('click', function() {
			var flag = confirm("Refresh task instructions?");
			if (! flag) {
				return false;
			}
			appendProgressOverlay(tableSelector);
			console.log("Working...");
			
			var refreshPromise = [];
			table.rows().every(function (rowIdx, tableLoop, rowLoop) {
				var refreshJson = JSON.parse($(this.data()[3]).filter('textarea').val());
				var refreshId = refreshJson.componentId;
				delete refreshJson.componentId;
				delete refreshJson.componentName;
				delete refreshJson.componentAlias;
				delete refreshJson.componentType;
				delete refreshJson.componentTag;
				var refreshRel = refreshJson.componentRel;
				delete refreshJson.componentRel;
				var prevSettings = (refreshJson.hasOwnProperty('settings')) ? refreshJson.settings : refreshJson;
				if (! prevSettings.hasOwnProperty('componentRel')) { prevSettings.componentRel = refreshRel; }
				
				if (refreshJson.hasOwnProperty('cnote')) {
					prevSettings.cnote = refreshJson.cnote;
				}
				
				var refreshXHR = setSettings(refreshId, 'component', prevSettings);
				refreshPromise.push(refreshXHR);
				$.when(refreshXHR).then(function(data, textStatus, jqXHR) {
					if (textStatus == 'success') {
						console.log(".");
						var refreshSettings = getOptionSettings();
						if (prevSettings.hasOwnProperty('cnote')) {
							refreshSettings.cnote = prevSettings.cnote;
						}
						
						var displayName = (refreshSettings.componentAlias != '') ? refreshSettings.componentAlias : refreshSettings.componentName;
						var refreshData = buildRowData(rowIdx, displayName, refreshSettings, true);
						table.row(rowIdx).data(refreshData);
						
						setRowStyle(table.row(rowIdx).node(), refreshSettings);
					}
				});
			});
			
			if (refreshPromise) {
				$.when.apply(null, refreshPromise)
				.done(function(data, textStatus, jqXHR) {
					table.draw();
					
					removeProgressOverlay();
					console.log("REFRESHED");
				});
			}
		});*/
		
		// Copy Task
		$('#copyTask.copy-icon-lg').on('click', function() {
			var copyTaskName = $('#tName').val();
			var flag = confirm("Copy task?\nName: " + copyTaskName);
			if (! flag) {
				return false;
			}
			
			taskId = 'new';
			taskName = '';
			isReusable = false;
			$('#taskId').val(taskId);
			$('#tName').val("Copy of " + copyTaskName).effect("highlight");
			$('#tAlias').val("");
			$('#tRoutine').prop('checked', false).trigger('change');
		});
		
		// Options
		$(taskOptions).on('click', 'span.coption', function() {
			var optionId = $(this).data('componentid');
			if (optionId == '' || optionId == null) { return false; }
			var optionName = $(this).text();
			
			showWaitIndicator();
			setSettings(optionId, 'component');
			
			$(settingsDiv).dialog("option", "title", "Settings - " + optionName);
			$(settingsDiv).dialog("option", "position", { my: "top", at: "top", of: "#optionsDiv" });
			$(settingsDiv).dialog("option", "buttons", {
				"Cancel": function() {
					$(settingsArea).html('');
					dialog.dialog("close");
				},
				"Add Option": function () {
					var settingsJson = getOptionSettings();
					var displayName = ($("#componentAlias").val() != '') ? $("#componentAlias").val() : $("#componentName").val();
					var optionItems = buildRowData(rowCount, displayName, settingsJson, true);
					table.row.add(optionItems).draw();
					rowCount++;
					dialog.dialog('close');
				}
			});
			
			dialog.dialog('open');
		});
		
		// Settings
		$(tableSelector + ' tbody').on('click', '.settings-icon', function() {
			var thisCol = $(this).parent();
			var thisRow = $(this).parent().parent();
			var thisSettingsArea = thisCol.children().filter('textarea');
			var thisJson = JSON.parse(thisSettingsArea.val());
			var thisId = thisJson.componentId;
			delete thisJson.componentId;
			var thisName = (thisJson.componentAlias != '') ? thisJson.componentAlias : thisJson.componentName;;
			delete thisJson.componentName;
			delete thisJson.componentAlias;
			delete thisJson.componentType;
			delete thisJson.componentTag;
			var thisRel = thisJson.componentRel;
			delete thisJson.componentRel;
			var theseSettings = (thisJson.hasOwnProperty('settings')) ? thisJson.settings : thisJson;
			if (! theseSettings.hasOwnProperty('componentRel')) { theseSettings.componentRel = thisRel; }
			
			if (thisJson.hasOwnProperty('cnote')) {
				theseSettings.cnote = thisJson.cnote;
			}
			
			showWaitIndicator();
			setSettings(thisId, 'component', theseSettings);
			
			$(settingsDiv).dialog("option", "title", "Settings - " + thisName);
			$(settingsDiv).dialog("option", "position", { my: "right top", at: "left bottom", of: $(this) });
			$(settingsDiv).dialog("option", "buttons", {
				"Cancel": function() {
					$(settingsArea).html('');
					dialog.dialog("close");
				},
				"Save": function() {
					var rowData = table.row(thisRow).data();
					var newSettings = getOptionSettings();					
					if (theseSettings.hasOwnProperty('cnote')) {
						newSettings.cnote = theseSettings.cnote;
					}
					
					var displayName = (newSettings.componentAlias != '') ? newSettings.componentAlias : newSettings.componentName;
					var newRowData = buildRowData(rowData[0], displayName, newSettings, true);
					table.row(thisRow).data(newRowData).draw(false);
					
					dialog.dialog("close");
					
					setRowStyle(thisRow, newSettings);
					thisRow.effect("highlight");
				}
			});
			
			dialog.dialog('open');
		});
		
		// Notes
		editNote(tableSelector + ' tbody', table);
		
		// Configuration
		viewComponentConfiguration(tableSelector + ' tbody');
		
		// Copy
		$(tableSelector + ' tbody').on('click', 'span.copy-icon', function () {
			var copyRow = $(this).parents('tr');
			var copyData = table.row(copyRow).data();
			var copyOpt = $('td:eq(1) span:first', table.row(copyRow).node()).text();
			var flag = confirm("Copy option?\n" + copyOpt);
			if (! flag) {
				return false;
			}
			
			var copyIndex = copyData[0];
			var addIndex = copyIndex + 1;
			table.rows().every(function (rowIdx, tableLoop, rowLoop) {
				var reorderData = this.data();
				if (reorderData[0] > copyIndex) {
					reorderData[0] += 1;
				}
				table.row(rowIdx).data(reorderData);
				
				var reorderSettings = JSON.parse($(reorderData[3]).filter('textarea').val());
				setRowStyle($(table.row(rowIdx).node()), reorderSettings);
			});
			
			var copyNode = table.row.add([addIndex, copyData[1], copyData[2], copyData[3]]).draw().node();
			$(copyNode).effect("highlight");
			rowCount++;
		});
		
		// Delete
		$(tableSelector + ' tbody').on('click', 'span.delete-icon', function () {
			var delRow = $(this).parents('tr');
			var isRowRemoved = removeRow(table, delRow);
			if (isRowRemoved !== false) {
				rowCount = isRowRemoved;
			}
		});
		
		// Save
		$('#stepFormSubmitButton').on('click', function(ev) {
			$('span').remove('.error');
			if (! table.data().count()) {
				$('#taskOptionDiv').prepend('<span class="error">Option list is empty.</span>');
				
				return false;
			}
		});
		
		form.on('submit', function(ev) {
			progressIndicator('start');
			ev.preventDefault();
			
			if (! form.parsley().isValid()) {
				progressIndicator('stop');
				
				return false;
			}
			
			var tId = $('#taskId').val();
			var tName = $('#tName').val().trim();
			var tAlias = $('#tAlias').val().trim();
			var tTag = $('#tTag').val();
			var tNotes = $('#tNotes').val().trim();
			var tRoutine = ($('#tRoutine').is(':checked')) ? 1 : 0;
			
			var taskSettings = '';
			var tLevelSettings = $(taskLevelSettingsArea).val();
			if (tLevelSettings != '') {
				var taskSettingJson = JSON.parse(tLevelSettings);
				taskSettingJson.component.name = tName;
				taskSettingJson.component.alias = tAlias;
				taskSettingJson.component.tag = tTag;
				taskSettings = JSON.stringify(taskSettingJson);
			}
			else {
				var setDefaultTaskSettings = defaultTaskSettingComponent;
				setDefaultTaskSettings.component.name = tName;
				setDefaultTaskSettings.component.alias = tAlias;
				setDefaultTaskSettings.component.tag = tTag;
				taskSettings = JSON.stringify(setDefaultTaskSettings);
			}
			
			var taskJson = {};
			taskJson["name"] = tName;
			taskJson["alias"] = tAlias;
			taskJson["instructions"] = [];
			
			var rows = table.rows();
			rows.every(function(rowIdx, tableLoop, rowLoop) {
				var data = this.data();
				var settings = JSON.parse($(data[3]).filter('textarea').val());
				var cId = parseInt(settings.componentId);
				delete settings.componentId;
				var cName = settings.componentName;
				delete settings.componentName;
				var cAlias = settings.componentAlias;
				delete settings.componentAlias;
				var cType = settings.componentType;
				delete settings.componentType;
				var cTag = settings.componentTag;
				delete settings.componentTag;
				var cRel = settings.componentRel;
				delete settings.componentRel;
				
				var s = {
					"componentId": cId, 
					"componentName": cName, 
					"componentAlias": cAlias, 
					"componentType": cType, 
					"componentTag": cTag, 
					"componentRel": cRel
				};
				if (settings.hasOwnProperty('cnote')) {
					if (settings.cnote != '') {
						s.cnote = settings.cnote;
					}
					delete settings.cnote;
				}
				
				if (settings.hasOwnProperty('settings')) {
					settings = settings.settings;
				}
				
				s.settings = settings;
				taskJson["instructions"].push(s);
			});
			taskJson = {"task": taskJson};
			var task = JSON.stringify(taskJson);
			
			var postData = {
				"id": taskId,
				"name": tName,
				"alias": tAlias,
				"tag": tTag,
				"reusable": tRoutine,
				"notes": tNotes,
				"task": task,
				"settings": taskSettings,
				"stepName": "POST Save FS Task",
				"Submit": true,
				"formNumber": 0
			};
			$.post('/uniflow', postData)
			.done(function(data) {
				var postHtml = $.parseHTML(data);
				var postError = checkPostError(postHtml);
				if (postError !== false) {
					alert(postError);
					progressIndicator('stop');
				}
				else {
					window.location = getUrlPath() + "?stepName=" + encodeURIComponent('Configure Tasks');
				}
			})
			.fail(function(jqxhr, textStatus, error) {
				progressIndicator('stop');
				
				var err = "POST Request Failed: " + textStatus + ", " + error;
				console.log(err);
				alert(err);
			});
		});
	});
}

/**
 * List Task Routines
 * 
 * @returns {void} Table listing of the available reusable tasks and routines
 */
function listTaskRoutines() {
	$(function() {
		$('#stepFormSubmitButton').prop('disabled', true).hide();
		
		var reusableTableEl = '#listReusableTable';
		var reusableTable = $(reusableTableEl).DataTable({
			"paging": true,
			"ordering": true,
			"searching": true,
			"info": true,
			"stateSave": true,
			"lengthMenu": [[5, 10, 25, 50, -1], [5, 10, 25, 50, "All"]],
			"data": [],
			"columns": [
	            {"title": "", "visible": false},
	            {"title": "", "width": "10px", "className": "dt-center", "orderable": false},
	            {"title": "Task", "className": "dt-head-left"},
	            {"title": "Tag", "className": "dt-head-left"},
	        ]
		});
		
		appendProgressOverlay(reusableTableEl, 'overlayReusableTable');
		
		$.getJSON('uniflow', {"stepName": "GET FS Reusable Tasks"})
		.done(function(data) {
			$.each(data, function(i, d) {
				var link = '<a class="view-link" href="/uniflow?' 
					+ $.param({"lastForm": "Y", "stepName": "Configure Routines", "id": d.id, "recId": "new"}) 
					+ '" title="Add Task Routine"><span class="add-icon add-icon-sm"></span></a>';
				reusableTable.row.add([d.id, link, d.name, d.tag]).draw();
			});
			
			removeProgressOverlay('#overlayReusableTable');
		});
		
		var routineTableEl = '#listRoutinesTable';
		var routineTable = $(routineTableEl).DataTable({
			"paging": true,
			"ordering": true,
			"searching": true,
			"info": true,
			"stateSave": true,
			"lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]],
			"data": [],
			"columns": [
	            {"title": "", "visible": false},
	            {"title": "", "width": "10px", "className": "dt-center", "orderable": false},
	            {"title": "Routine", "className": "dt-head-left"},
	            {"title": "Task", "className": "dt-head-left"},
	            {"title": "Protocol", "className": "dt-head-left"},
	            {"title": "Protocol Type", "className": "dt-head-left"},
	        ]
		});
		
		appendProgressOverlay(routineTableEl, 'overlayRoutinesTable');
		
		$.getJSON('uniflow', {"stepName": "GET All FS Routines"})
		.done(function(data) {
			$.each(data, function(i, d) {
				var link = '<a class="view-link" href="/uniflow?' 
					+ $.param({"lastForm": "Y", "stepName": "Configure Routines", "id": d.taskId, "recId": d.id}) 
					+ '" title="View Task Routine"><span class="view-icon"></span></a>';
				routineTable.row.add([d.id, link, d.name, d.taskName, d.protocolName, d.protocolType]).draw();
			});
			
			removeProgressOverlay('#overlayRoutinesTable');
		});
	});
}

/**
 * Task Routine
 * Create and modify task routine.
 * 
 * @returns {void|false} Redirects to task routines list on save or false on error
 */
function taskRoutine() {
	$(function() {
		var form = $('form');
		var routineId = $('#routineId').val();
		var routineName = $('#rName').val();
		var taskId = $('#taskId').val();
		
		// New
		if (routineId != 'new') {
			var getData = {
				"stepName": "GET FS Routine By Id",
				"routineId": routineId
			};
			$.getJSON('uniflow', getData)
			.done(function(data) {
				routineName = data[0].name;
				$('#rTaskName').text(data[0].taskName);
				$('#rProtocolName').text(data[0].protocolName);
				$('#rName').val(data[0].name);
				$('#rAlias').val(data[0].alias);
				$('#rType').val(data[0].type);
				$('#rTag').val(data[0].tag);
				$('#rNotes').val(unescapeNewlines(data[0].notes));
			});
		}
		
		// Check if task exists
		$('#rName').on('change', function() {
			var rName = $(this).val().trim();
			if (rName == routineName || rName == '') {
				return false;
			}
			
			var getData = {
				"stepName": "GET Step Exists",
				"name": rName
			};
			$.getJSON('uniflow', getData)
			.done(function(data) {
				if (data.length > 0) {
					var msg = "Task routine name already exists...\nName: " + rName;
					//console.log(data[0].stepName);
					
					alert(msg);
					$('#rName').val(routineName).focus();
					
					return false;
				}
			});
		});
		
		// Save
		form.on('submit', function(ev) {
			progressIndicator('start');
			ev.preventDefault();
			
			if (! form.parsley().isValid()) {
				progressIndicator('stop');
				
				return false;
			}
			
			var rName = $('#rName').val().trim();
			var rAlias = $('#rAlias').val().trim();
			var rType = $('#rType').val();
			var rTag = $('#rTag').val();
			var rNotes = $('#rNotes').val().trim();
			
			var routineJson = {"routine": {}};
			routineJson.routine["name"] = rName;
			routineJson.routine["alias"] = rAlias;
			routineJson.routine["type"] = rType;
			routineJson.routine["tag"] = rTag;
			routineJson.routine["taskId"] = parseInt(taskId);
			var routine = JSON.stringify(routineJson);
			
			var postData = {
				"id": routineId,
				"taskId": taskId,
				"name": rName,
				"alias": rAlias,
				"type": rType,
				"tag": rTag,
				"notes": rNotes,
				"settings": routine,
				"stepName": "POST Save FS Routine",
				"Submit": true,
				"formNumber": 0
			};
			$.post('/uniflow', postData)
			.done(function(data) {
				var postHtml = $.parseHTML(data);
				var postError = checkPostError(postHtml);
				if (postError !== false) {
					alert(postError);
					progressIndicator('stop');
				}
				else {
					window.location = getUrlPath() + "?stepName=" + encodeURIComponent('Configure Routines');
				}
			})
			.fail(function(jqxhr, textStatus, error) {
				progressIndicator('stop');
				
				var err = "POST Request Failed: " + textStatus + ", " + error;
				console.log(err);
				alert(err);
			});
		});
	});
}

/**
 * View component configuration
 * 
 * @param selector
 * @returns {void} dialog displaying component config
 */
function viewComponentConfiguration(selector) {
	
	$(selector).on('click', '.ixml-icon', function() {
		var thisCol = $(this).parent();
		var thisRow = $(this).parent().parent();
		var thisSettingsArea = thisCol.children().filter('textarea');
		var thisJson = JSON.parse(thisSettingsArea.val());
		var thisId = thisJson.componentId;
		var thisName = thisJson.componentName;

		var div = '#configurationDiv';
		var dialog = $(div).dialog({
			autoOpen: false,
			title: "Config - " + thisName,
			modal: true,
			width: 400,
			height: 200,
			position: { my: "right top", at: "left bottom", of: $(this) },
			close: function() {
				$(div).html('');
				dialog.dialog("close");
			}
		});
		
		var getData = {
			"stepName": "GET FS Component Config By Id",
			"optionId": thisId
		};
		$.getJSON('uniflow', getData)
		.done(function(data) {
			var config = unescapeNewlines(data[0].defaultConfig);
			$(div).append('<textarea style="width: 98%; height: 92%; background-color: lightgreen;">'+ config +'</textarea>');
			
			dialog.dialog("open");
		});
	});
}

/**
 * Edit component notes
 * 
 * @param {string} selector
 * @param {object} table
 * @returns {void} dialog to add/edit component notes
 */
function editNote(selector, table) {
	
	$(selector).on('click', '.note-icon', function() {
		var thisCol = $(this).parent();
		var thisRow = $(this).parent().parent();
		var thisSettingsArea = thisCol.next().children().filter('textarea');
		var thisJson = JSON.parse(thisSettingsArea.val());
		
		var thisNote = thisCol.children().filter('span.note');
		var note = (thisJson.hasOwnProperty('cnote')) ? thisJson.cnote : '';
		
		var div = '#noteDiv';
		var dialog = $(div).dialog({
			autoOpen: false,
			title: "Notes",
			modal: false,
			width: 200,
			height: 100,
			position: { my: "right top", at: "left bottom", of: $(this) },
			close: function() {
				$(div).html('');
				dialog.dialog("close");
			},
			buttons: {
				"OK": function() {
					var newNote = $(div + ' textarea.note').val();
					if (newNote != note) {
						thisJson.cnote = newNote;
						
						var displayName, action;
						if (thisJson.hasOwnProperty('taskName')) {
							displayName = thisJson.taskName;
							action = false;
						}
						else {
							displayName = (thisJson.componentAlias != '') ? thisJson.componentAlias : thisJson.componentName;
							action = true;
						}
						
						var rowData = table.row(thisRow).data();
						var newRowData = buildRowData(rowData[0], displayName, thisJson, action);
						
						thisNote.text(newNote);
						table.row(thisRow).data(newRowData).draw(false);
						setRowStyle(thisRow, thisJson);
					}
					
					dialog.dialog("close");
				}
			}
		});
		
		$(div).html('<textarea class="note">' + note + '</textarea>');
		dialog.dialog("open");
	});
}

/**
 * Sets row css style and text display by component settings
 * 
 * @param {object} row
 * @param {object} settings
 * @returns void
 */
function setRowStyle(row, settings) {
	
	var optionCol = $("td:eq(1) span:first", row);
	var optionNote = $("td:eq(1) span.note", row);
	var displayName = (settings.componentAlias != '') ? settings.componentAlias : settings.componentName;
	
	switch (settings.componentType) {
		case "form":
			optionCol.css({"background-color": "#d8ecf3"});
			
			break;
		case "attribute":
			optionCol.css({"margin-left": "30px"});
			optionNote.css({"margin-left": "30px"});
			
 			if (displayName == "Input Table Column") {
				var columnNumber = (settings.hasOwnProperty('settings')) ? settings.settings.columnNumber : settings.columnNumber;
				optionCol.append("&nbsp;&nbsp;(" + columnNumber + ")");
 			}
			break;
		case "component":
			if (settings.componentTag == 'submit') {
				optionCol.css({"background-color": "#dfecdf"});
				
				if (settings.componentRel == 'child') {
					optionCol.css({"margin-left": "30px"});
					optionNote.css({"margin-left": "30px"});
				}
			}
			else {
				optionCol.css({"margin-left": "30px"});
				optionNote.css({"margin-left": "30px"});
			}
			
			switch (displayName) {
				case "Include":
		 		case "Submit Include":
					var includeName = (settings.hasOwnProperty('settings')) ? settings.settings.includeName : settings.includeName;
					optionCol.append("&nbsp;&nbsp;(" + includeName + ")");
					break;
		 		case "Container":
		 		case "Text":
		 		case "Select":
		 		case "Hidden":
		 		case "Plate or Grid Input":
		 		case "File Import":
					var inputName = (settings.hasOwnProperty('settings')) ? settings.settings.inputName : settings.inputName;
					optionCol.append("&nbsp;&nbsp;(" + inputName + ")");
					break;
		 		case "File Upload":
					var fileName = (settings.hasOwnProperty('settings')) ? settings.settings.filesName : settings.filesName;
					optionCol.append("&nbsp;&nbsp;(" + fileName + ")");
					break;
		 		case "Fieldset":
					optionCol.css({"background-color": "#ffe6cc"});
					break;
					
				default:
					break;
			}
			break;

		default:
			break;
	}
}

/**
 * Build table row data
 * 
 * @param {number} count
 * @param {string} name
 * @param {object} settings
 * @param {boolean} copyAction
 * @access private
 * @returns {array} Row data
 */
function buildRowData(count, name, settings, copyAction) {
	
	var note = (settings.hasOwnProperty('cnote')) ? settings.cnote : '';
	
	var rowName = '<span class="task-option-col">' + name + '</span>' 
	+ '<br><span class="note">' 
	+ note 
	+'</span><span style="float: right;" class="note-icon" title="Note"></span>';
	
	var copyIcon = (copyAction) ? '<span class="ixml-icon right0_7em" title="Configuration"></span><span class="copy-icon right0_7em" title="Copy"></span>' : '';
	var actions = '<span class="settings-icon right0_7em" title="Settings"></span>'
		+ copyIcon
		+ '<span class="delete-icon" title="Delete"></span>'
		+ '<textarea style="display: none; width: 0px; height: 0px;">' 
		+ JSON.stringify(settings) 
		+ '</textarea>';
	
	return [count, '<span class="reorder-icon"></span>', rowName, actions];
}

/**
 * Remove table row
 * 
 * @param {object} table
 * @param {object} row
 * @access private
 * @returns {number} Next row count
 */
function removeRow(table, row) {
	
	$(row).effect('highlight');		
	
	var opt = $('td:eq(1) span:first', table.row(row).node()).text();
	var msg = "Remove item?\n" + opt;
	var flag = confirm(msg);
	if (! flag) {
		return false;
	}
	
	var rowCount = 1;
	
	table.row(row).remove();
	if (table.rows().count() > 0) {
		table.rows().every(function (rowIdx, tableLoop, rowLoop) {
			var reorderData = this.data();
			reorderData[0] = rowCount;
			table.row(rowIdx).data(reorderData);
			rowCount++;
			
			var reorderSettings = JSON.parse($(reorderData[3]).filter('textarea').val());
			setRowStyle($(table.row(rowIdx).node()), reorderSettings);
		});
		table.draw();
	}
	else {
		table.data([]).draw();
	}
	
	return rowCount;
}

/**
 * Protocol Writer
 * GET calls to view procotol tasks, verify running protocol
 * POST calls for loading, unloading, writing protocol config
 * 
 * @returns {void} Action icon events for viewing, loading, unloading and writing protocols
 */
function protocolWriter() {
	$(function() {
		var tableSelector = '#protocolTable';
		var table = $(tableSelector).DataTable({
			"paging": true,
			"searching": true,
			"info": true,
			"data": [],
			"columns": [
	            {"title": "", "visible": false},
	            {"title": "Name", "className": "dt-head-left"},
	            {"title": "Type", "className": "dt-head-left"},
	            {"title": "Tag", "className": "dt-head-left"},
	            {"title": "", "width": "196px", "className": "dt-center", "orderable": false}
	        ]
		});
		
		var accessLevel = $('#userAccessLevel').val();
		var writeIcon = '';
		if (accessLevel == 12) {
			writeIcon = '<span class="write-icon" title="Generate Protocol"></span>';
			$('.action-icons span.write-icon').show();
			$('.action-icons span.write-icon').next('span').show();
		}
		
		var getData = {"stepName": "GET All FS Protocols"};
		$.getJSON('uniflow', getData)
		.done(function(data) {
			$.each(data, function(i, protocol) {
				var url = '/uniflow?';
				var viewParam = url + $.param({"lastForm": "Y", "stepName": "Configure Protocols", "recId": protocol.id}) 
				var verifyParam = (protocol.active == 'Y') ? url + $.param({"userStepGroups": protocol.name, "updateStepGroups": true}) : "#";
				var actions = '<a class="view-link" href="' + viewParam + '" title="View Protocol"><span class="view-icon right1_5em"></span></a>' 
					+ '<a class="verify-link" href="' + verifyParam + '" title="Verify Protocol"><span class="verify-icon right1_5em"></span></a>'
					+ '<span class="load-icon right1_5em" title="Load Protocol into the System"></span>'
					+ '<span class="unload-icon right1_5em" title="Unload Protocol from the System"></span>'
					+ writeIcon;
				
				table.row.add([
					protocol.id, protocol.name, protocol.type, protocol.tag, actions
				]).draw();
			});
		});
		
		// Action Icon Events
		// Load
		$(tableSelector + ' tbody').on('click', 'span.load-icon', function () {
			var clicked = this;
			var loadCell = $(this).parents('td');
			var loadRow = $(this).parents('tr');
			var loadData = table.row(loadRow).data();
			var loadId = loadData[0];
			var loadName = loadData[1];
			
			$('#loadProtocolName').text(loadName);
			
			var dialog = $('#loadProtocolDialog').dialog({
				autoOpen: false,
				title: "Load Protocol",
				modal: true,
				draggable: false,
				width: 300,
				height: "auto",
				position: {
					my: "right top", at: "left bottom", of: clicked
				},
				close: function() {
					$('#loadProtocolName').text('');
					$("#loadProtocolComments").val('').removeClass('error');
					
					dialog.dialog("close");
				},
				buttons: {
					"Cancel": function() {
						dialog.dialog("close");
					},
					"Load": function() {
						console.log('Write and Load Protocol');
						
						var comments = $('#loadProtocolComments').val();
						if (comments == '') {
							$('#loadProtocolComments').addClass('error').focus();
							return false;
						}
						
						dialog.dialog("close");
						showActionOverlay(loadRow, loadId);
						
						var postData = {
							"protocolId": loadId,
							"isLoad": "true",
							"loadComments": comments,
							"stepName": "POST Write FS Protocol",
							"Submit": true,
							"formNumber": 0
						};
						$.post('/uniflow', postData)
						.done(function(data) {
							var postHtml = $.parseHTML(data);
							var postError = checkPostError(postHtml);
							if (postError !== false) {
								removeActionOverlay(loadId);
								alert(postError);
							}
							else {
								console.log("Done: " + loadName);
								removeActionOverlay(loadId);
								
								var postResponse = JSON.parse($(postHtml).find('#ajaxPostResponse').val());
								if (postResponse.status == 'success') {
									var href = 'href="' + postResponse.url + '"';
									loadData[4] = loadData[4].replace('href="#"', href);
									table.row(loadRow).data(loadData).draw(false);
									
									showActionOverlay(loadRow, loadId);
									delayActionOverlay(loadId);
								}
								else {
									alert(postResponse.status + ": " + postResponse.message);
								}
							}
						})
						.fail(function(jqxhr, textStatus, error) {
							var err = "POST Request Failed: " + textStatus + ", " + error;
							console.log(err);
							removeActionOverlay(loadId);
							alert(err);
						});
						
					}
				}
			});
			
			dialog.dialog('open');
		});
		
		// Unload
		$(tableSelector + ' tbody').on('click', 'span.unload-icon', function () {
			var clicked = this;
			var unloadCell = $(this).parents('td');
			var unloadRow = $(this).parents('tr');
			var unloadData = table.row(unloadRow).data();
			var unloadId = unloadData[0];
			var unloadName = unloadData[1];
			
			$('#loadProtocolName').text(unloadName);
			
			var dialog = $('#loadProtocolDialog').dialog({
				autoOpen: false,
				title: "Unload Protocol",
				modal: true,
				draggable: false,
				width: 300,
				height: "auto",
				position: {
					my: "right top", at: "left bottom", of: clicked
				},
				close: function() {
					$('#loadProtocolName').text('');
					$("#loadProtocolComments").val('').removeClass('error');
					
					dialog.dialog("close");
				},
				buttons: {
					"Cancel": function() {
						dialog.dialog("close");
					},
					"Unload": function() {
						console.log('Unload Protocol');
						
						var comments = $('#loadProtocolComments').val();
						if (comments == '') {
							$('#loadProtocolComments').addClass('error').focus();
							return false;
						}
						
						dialog.dialog("close");
						showActionOverlay(unloadRow, unloadId);
						
						var postData = {
							"protocolId": unloadId,
							"stepName": "POST Unload FS Protocol By Id",
							"unloadComments": comments,
							"Submit": true,
							"formNumber": 0
						};
						$.post('/uniflow', postData)
						.done(function(data) {
							var postHtml = $.parseHTML(data);
							var postError = checkPostError(postHtml);
							if (postError !== false) {
								removeActionOverlay(unloadId);
								alert(postError);
							}
							else {
								console.log('Done: ' + unloadName);
								removeActionOverlay(unloadId);
								
								var postResponse = JSON.parse($(postHtml).find('#ajaxPostResponse').val());
								if (postResponse.status == 'success') {
									unloadData[4] = unloadData[4].replace(/class="verify-link" href="(.*?)"/i, 'class="verify-link" href="#"');
									table.row(unloadRow).data(unloadData).draw(false);
									
									showActionOverlay(unloadRow, unloadId);
									delayActionOverlay(unloadId);
								}
								else {
									console.log("Could not unload... " + unloadName);
								}
							}
						})
						.fail(function(jqxhr, textStatus, error) {
							var err = "POST Request Failed: " + textStatus + ", " + error;
							console.log(err);
							removeActionOverlay(unloadId);
							alert(err);
						});
					}
				}
			});
			
			dialog.dialog('open');
		});
		
		// Write temp config
		$(tableSelector + ' tbody').on('click', 'span.write-icon', function () {
			var writeCell = $(this).parents('td');
			var writeRow = $(this).parents('tr');
			var writeData = table.row(writeRow).data();
			var writeId = writeData[0];
			var writeName = writeData[1];
			
			if (confirm("Create and download protocol?\nName: " + writeName)) {
				console.log('Write Protocol');
				showActionOverlay(writeRow, writeId);
				
				var postData = {
					"protocolId": writeId,
					"isLoad": "false",
					"loadComments": "",
					"stepName": "POST Write FS Protocol",
					"Submit": true,
					"formNumber": 0
				};
				$.post('/uniflow', postData)
				.done(function(data) {
					var postHtml = $.parseHTML(data);
					var postError = checkPostError(postHtml);
					if (postError !== false) {
						removeActionOverlay(writeId);
						alert(postError);
					}
					else {
						console.log('Done: ' + writeName);
						removeActionOverlay(writeId);
						
						var postResponse = JSON.parse($(postHtml).find('#ajaxPostResponse').val());
						window.location = getUrlPath() + "?stepName=DownloadProtocolConfig&recId=" + encodeURIComponent(postResponse.filename);
					}
				})
				.fail(function(jqxhr, textStatus, error) {
					var err = "POST Request Failed: " + textStatus + ", " + error;
					console.log(err);
					alert(err);
					removeActionOverlay(writeId);
				});
			}
			
			return false;
		});
	});
}

/**
 * Show action overlay
 * 
 * @param {object} row
 * @param {number} id
 * @access private
 */
function showActionOverlay(row, id) {
	
	var tablePos = $('#protocolTable').position();
	$('<div id="preventActionOverlay' + id + '" class="progress-overlay prevent-overlay"></div>')
	.css({
		top: tablePos.top, 
		left: tablePos.left,
		width: $('#protocolTable').width(),
		height: $('#protocolTable').height()
	})
	.appendTo('#protocolTable_wrapper');
	
	var rowPos = $(row).position();
	var rowWidth = $(row).width();
	var rowHeight = $(row).height();
	$('<div id="progressOverlay' + id + '" class="progress-overlay"><span class="progress-icon"></span></div>')
	.css({
		top: rowPos.top + rowHeight, 
		left: rowPos.left,
		width: rowWidth,
		height: rowHeight-16
	})
	.appendTo(row);
}

/**
 * Remove action overlay
 * 
 * @param {number} id
 * @access private
 */
function removeActionOverlay(id) {
	
	$('#progressOverlay' + id).remove();
	$('#preventActionOverlay' + id).remove();
}

/**
 * Delay action overlay for 10 seconds
 * 
 * @returns {void}
 */
function delayActionOverlay(id) {
	
	setTimeout(function() {
		removeActionOverlay(id);
	}, 10000);
}

/**
 * Component Settings
 * Create and modify component settings and default configuration
 * 
 * @returns {void|false} Redirects to settings list on save or false on error
 */
function componentSettings() {
	$(function() {
		$('#stepFormSubmitButton').prop('disabled', true).hide();
		$('form').submit(function(ev) {
			ev.preventDefault();
		});
		
		var dialog;
		var settingsDiv = "#settingsDiv";
		var settingsArea = "#settingsArea";
		var defaultsArea = "#editDefaultsArea";
		var editDefaultComponentName = "#defaultComponentName, #defaultComponentAlias, #defaultComponentCategory";
		var editDefaultConfigArea = "#editDefaultConfigArea";
		var editDefaultSettingsArea = "#editDefaultSettingsArea";
		
		var editEnabledCss = {"background-color": "white"};
		var editDisabledCss = {"background-color": "lightgreen"};
		
		var optionSelect = '#cOptions';
		setComponentOptions(true);
		
		function resetSettingsArea() {
			$(settingsArea).html('');
			$(defaultsArea + ' input[type="text"]').val('');
			$(defaultsArea + ' select').val('');
			$(defaultsArea + ' textarea').val('');
		}
		
		// Options
		$(optionSelect).on('click', 'span.coption', function() {
			var optionId = $(this).data('componentid');
			var optionName = $(this).text();
			
			$('#isEditDefaults').prop('checked', false).trigger('change');
			
			if (optionId == '') {
				$(settingsDiv).hide();
				$(defaultsArea).hide();
				resetSettingsArea();
			}
			else if (optionId == 'new') {
				$(settingsDiv).hide();
				$(defaultsArea).show();
				$(editDefaultComponentName).prop('readonly', false).css(editEnabledCss);
				$('#newComponentBtn').show();
				resetSettingsArea();
			}
			else {
				setSettings(optionId, 'config');
				
				$(settingsDiv).show();
				$('#newComponentBtn').hide();
			}
		});
		
		$('#viewTasks').on('click', function(ev) {
			ev.preventDefault();
			
			var coption = $('#cOptions span.coption-selected').data('componentid');
			loadTasksTable(coption);
		});
		
		// Edit defaults
		$(defaultsArea).on('change', '#isEditDefaults', function() {
			if ($(this).is(':checked')) {
				$(editDefaultComponentName).prop('readonly', false).css(editEnabledCss);
				$(editDefaultConfigArea).prop('readonly', false).css(editEnabledCss);
				$(editDefaultSettingsArea).prop('readonly', false).css(editEnabledCss);
			}
			else {
				$(editDefaultComponentName).prop('readonly', true).css(editDisabledCss);
				$(editDefaultConfigArea).prop('readonly', true).css(editDisabledCss);
				$(editDefaultSettingsArea).prop('readonly', true).css(editDisabledCss);
			}
		});
		
		// New Component
		$(defaultsArea).on('click', '#newComponentBtn', function(ev) {
			ev.preventDefault();
			
			var isNewConfig = false;
			$('#defaultComponentName, #defaultComponentType, #defaultComponentTag, #defaultComponentRel').each(function() {
				if ($(this).val() == '') {
					$(this).focus();
					isNewConfig = false;
					return false;
				}
				else { isNewConfig = true; }
			});
			if (! isNewConfig) { return false; }
			
			$('#isEditDefaults').prop('checked', true).trigger('change');
			var skeletonSettings = JSON.parse('{"component":{"name":"","alias":"","type":"","tag":"","rel":"","settings":[]}}');
			skeletonSettings.component.name = $('#defaultComponentName').val();
			skeletonSettings.component.alias = $('#defaultComponentAlias').val();
			skeletonSettings.component.type = $('#defaultComponentType').val();
			skeletonSettings.component.tag = $('#defaultComponentTag').val();
			skeletonSettings.component.rel = $('#defaultComponentRel').val();
			var newSettings = JSON.stringify(skeletonSettings, null, 4);
			$(editDefaultSettingsArea).val(newSettings);
		});
		
		// New Setting
		addSetting(defaultsArea, editDefaultSettingsArea);
		
		// Save Settings
		$('#saveSettings').on('click', function(ev) {
			var cId = $("#configId").val();
			var cName = $("#configName").val();
			var cAlias = $("#configAlias").val();
			var cType = $("#configType").val();
			var cTag = $("#configTag").val();
			var settingInputs = $(settingsArea).find('input, select, textarea');
			
			var settingsJson = [];
			$.each(settingInputs, function(k, v) {
				var id = $(v).attr('id');
				var val = $(v).val();
				switch (id) {
					case "configId":
					case "configName":
					case "configAlias":
					case "configTag":
					case "configType":
					case "componentId":
					case "componentName":
					case "componentAlias":
					case "componentTag":
					case "componentType":
						break;
					
					default:
						var values = [val]; 
						var type = $(v).attr('type');
						var tag = document.getElementById(id).tagName;
						tag = tag.toLowerCase();
						
						if (typeof type == 'undefined') {
							if (tag == 'select') {
								type = 'select';
							}
							if (tag == 'textarea') {
								type = 'textarea';
							}
						}
						
						if (type == 'checkbox') {
							values[0] = ($(v).is(':checked')) ? 'checked' : '';
						}
						if (type == 'select') {
							$("option", v).not(':selected').each(function(oi, o) {
								values.push($(o).val());
							});
						}
						if (type == 'radio') {
							if (! $(v).is(':checked')) { break; }
							id = $(v).attr('name');
							$('input[name="' + id + '"]:radio').not(':checked').each(function(ri, r) {
								values.push($(r).val());
							});
						}
						var label = $('label[for="' + id + '"]').text();
						var data = {
							"id": id,
							"type": type,
							"label": label,
							"values": values
						}
						settingsJson.push(data);
						break;
				}
			});
			
			var settings = {};
			settings['component'] = {"name": cName, "alias": cAlias, "type": cType, "tag": cTag, "settings": settingsJson};
			var newSettings = JSON.stringify(settings);
			
			var postData = {
				"componentId": cId,
				"settingsJson": newSettings,
				"stepName": "POST Save FS Component Settings",
				"Submit": true,
				"formNumber": 0
			};
			$.post('/uniflow', postData)
			.done(function(data) {
				var postHtml = $.parseHTML(data);
				var postError = checkPostError(postHtml);
				if (postError !== false) {
					alert(postError);
					progressIndicator('stop');
				}
				else {
					window.location = getUrlPath() + "?stepName=" + encodeURIComponent('Configure Components');
				}
			})
			.fail(function(jqxhr, textStatus, error) {
				var err = "POST Request Failed: " + textStatus + ", " + error;
				console.log(err);
				alert(err);
			});
		});
		
		// Save Defaults
		$('#saveDefaults').on('click', function(ev) {
			ev.preventDefault();
			if (! $('#isEditDefaults').is(':checked')) {
				return false;
			}
			
			var cId = $('#cOptions span.coption-selected').data('componentid');
			if (cId == '') { return false;}
			
			var isSaveConfig = false;
			$('#defaultComponentName, #defaultComponentType, #defaultComponentTag, #defaultComponentRel, '+editDefaultConfigArea+','+editDefaultSettingsArea)
			.each(function() {
				if ($(this).val() == '') {
					$(this).focus();
					isSaveConfig = false;
					return false;
				}
				else { isSaveConfig = true; }
			});
			if (! isSaveConfig) { return false; }
			
			var cNewName = $('#defaultComponentName').val().trim();
			var cNewAlias = $('#defaultComponentAlias').val().trim();
			var cNewCategory = $('#defaultComponentCategory').val().trim();
			var cNewType = $('#defaultComponentType').val();
			var cNewTag = $('#defaultComponentTag').val();
			var cNewRel = $('#defaultComponentRel').val();
			var newDefaultConfig = $(editDefaultConfigArea).val();
			var editDefaultSettingsValue = $(editDefaultSettingsArea).val();
			var editDefaultJson = '';
			if (editDefaultSettingsValue.trim() != '') {
				if (! isJSON(editDefaultSettingsValue)) { return false; }
				
				editDefaultJson = JSON.parse(editDefaultSettingsValue);
				editDefaultJson.component.name = cNewName;
				editDefaultJson.component.alias = cNewAlias;
				editDefaultJson.component.type = cNewType;
				editDefaultJson.component.tag = cNewTag;
				editDefaultJson.component.rel = cNewRel;
			}
			var newDefaultSettings = (editDefaultJson) ? JSON.stringify(editDefaultJson) : '';
			
			var postData = {
				"componentId": cId,
				"defaultComponentName": cNewName,
				"defaultComponentAlias": cNewAlias,
				"defaultComponentCategory": cNewCategory,
				"defaultComponentType": cNewType,
				"defaultComponentTag": cNewTag,
				"defaultComponentRel": cNewRel,
				"defaultConfig": newDefaultConfig,
				"defaultSettings": newDefaultSettings,
				"stepName": "POST Save FS Component Config",
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
					window.location = getUrlPath() + "?stepName=" + encodeURIComponent('Configure Components');
				}
			})
			.fail(function(jqxhr, textStatus, error) {
				var err = "POST Request Failed: " + textStatus + ", " + error;
				console.log(err);
				alert(err);
			});
		});
	});
}

/**
 * Set Settings
 * 
 * @param {number} optionId
 * @param {string} type
 * @param {object} settings
 * @access private
 * @returns {object}
 */
function setSettings(optionId, type, settings) {
	
	var stepName = "";
	var isRoutine = false;
	switch (type) {
		case "component":
			stepName = "GET FS Component Settings By Id";
			break;
		case "task":
			stepName = "GET FS Task Settings By Id";
			break;
		case "routine":
			stepName = "GET FS Routine Settings By Id";
			isRoutine = true;
			break;
		case "config":
			stepName = "GET FS Component Config By Id";
			break;
			
		default:
			console.log("TYPE PARAM NOT SET FOR setSettings");
			return false;
			break;
	}
	
	var settingsArea = '#settingsArea';
	
	var currentSettings = {};
	if (typeof settings != 'undefined') {
		currentSettings = settings;
	}
	
	var hiddenId = type + "Id";
	var hiddenName = type + "Name";
	var hiddenAlias = type + "Alias";
	var hiddenType = type + "Type";
	var hiddenTag = type + "Tag";
	
	var getData = {
		"stepName": stepName,
		"optionId": optionId
	};
	
	var jqxhr = $.getJSON('uniflow', getData)
	.done(function(data) {
		if (data && data != '') {
			var settingsHtml = [];
			settingsHtml.push('<input type="hidden" id="' + hiddenId + '" name="' + hiddenId + '" value="' + data[0].id + '">');
			settingsHtml.push('<input type="hidden" id="' + hiddenName + '" name="' + hiddenName + '" value="' + data[0].name + '">');
			settingsHtml.push('<input type="hidden" id="' + hiddenAlias + '" name="' + hiddenAlias + '" value="' + data[0].alias + '">');
			settingsHtml.push('<input type="hidden" id="' + hiddenTag + '" name="' + hiddenTag + '" value="' + data[0].tag + '">');
			
			if (isRoutine) {
				settingsHtml.push('<input type="hidden" id="taskId" name="taskId" value="' + data[0].taskId + '">');
				settingsHtml.push('<input type="hidden" id="taskName" name="taskName" value="' + data[0].name + '">');				
			}
			
			if (data[0].hasOwnProperty('type')) {
				settingsHtml.push('<input type="hidden" id="' + hiddenType + '" name="' + hiddenType + '" value="' + data[0].type + '">');
			}
			
			var componentTaskOptions = [];
			if (type == 'component') {
				settingsHtml.push('<span class="left"><label for="componentRel">Placement</label></span>');
				settingsHtml.push('<span class="right">');
				
				var rel = data[0].rel;
				switch (rel) {
					case 'parent-child':
						var parentChecked = 'checked';
						var childChecked = '';
						if (currentSettings.hasOwnProperty('componentRel') && currentSettings.componentRel == 'child') {
							parentChecked = '';
							childChecked = 'checked';
						}
						settingsHtml.push('<input type="radio" name="componentRel" id="componentRel-parent" value="parent" ' + parentChecked + '>');
						settingsHtml.push('<label for="componentRel-parent">Parent</label>&nbsp;');
						settingsHtml.push('<input type="radio" name="componentRel" id="componentRel-child" value="child" ' + childChecked + '>');
						settingsHtml.push('<label for="componentRel-child">Child</label>&nbsp;');
						break;
					case 'child':
						settingsHtml.push('<input type="radio" name="componentRel" id="componentRel-child" value="child" checked>');
						settingsHtml.push('<label for="componentRel-child">Child</label>&nbsp;');
						break;
	
					default:
						settingsHtml.push('<input type="radio" name="componentRel" id="componentRel-parent" value="parent" checked>');
						settingsHtml.push('<label for="componentRel-parent">Parent</label>&nbsp;');
						break;
				}
				settingsHtml.push('</span><br><br>');
				
				if ($('#tLevelSettingsArea').val() != '') {
					var taskSettings = JSON.parse($('#tLevelSettingsArea').val());
					if (taskSettings.component.settings) {
						taskSettings.component.settings.forEach(function(el) {
							componentTaskOptions.push([el.id, el.label]);
						});
					}
				}
			}
			
			var settingsJson = '';
			if (data[0].settingsJson) {
				settingsJson = JSON.parse(data[0].settingsJson);
				if (settingsJson.hasOwnProperty('component')) {
					$.each(settingsJson.component.settings, function(settingKey, setting) {
						var elementId = '';
						if (setting.hasOwnProperty('id')) {
							elementId = setting.id;
						}
						var isCurrentSet = currentSettings.hasOwnProperty(elementId);
						
						var label = '<span class="left"><label for="' + elementId + '">' + setting.label + '</label></span>';
						settingsHtml.push(label);
						
						var override = '';
						if (type == 'component') {
							var oid = elementId + 'OverrideId', ohtml = '<option value="">-- Override --</option>', ohide = '';
							if (componentTaskOptions.length == 0) { ohide = 'style="display: none;" '; }
							
							componentTaskOptions.forEach(function(el) {
								var oselected = '';
								if (currentSettings.hasOwnProperty(oid) && currentSettings[oid] == el[0]) {
									oselected = ' selected';
								}
								ohtml += '<option value="' + el[0] + '"' + oselected + '>' + el[1] + '</option>';
							});
							
							override = '<span ' + ohide + 'class="override"><select class="override" id="' + oid + '">' +  ohtml + '</select></span>';
						}
						
						switch (setting.type) {
							case 'select':
								settingsHtml.push('<span class="right"><select name="' + elementId + '" id="' + elementId + '">');
								
								$.each(setting.values, function(valueKey, value) {
									var selected = "";
									if (isCurrentSet) {
										if (currentSettings[elementId] == value) {
											selected = " selected";
										}
									}
									settingsHtml.push('<option value="' + value + '"' + selected + '>' + value + '</option>');
								});
								
								settingsHtml.push('</select></span>');
								
								settingsHtml.push(override);
								break;
							case 'text':
								var value = (setting.hasOwnProperty('values')) ? setting.values[0] : '';
								if (isCurrentSet) {
									value = currentSettings[elementId];
								}
								settingsHtml.push('<span class="right"><input type="text" id="' + elementId + '" name="' + elementId + '" value="' + value + '"></span>');
								break;
							case 'checkbox':
								var value = (setting.hasOwnProperty('values')) ? setting.values[0] : '';
								var checked = (value == 'checked' || value == 'true') ? ' checked' : '';
								if (isCurrentSet) {
									checked = (currentSettings[elementId] == 'true') ? ' checked' : '';
								}
								settingsHtml.push('<span class="right"><input type="checkbox" id="' + elementId + '" name="' + elementId + '" value="true"' + checked + '></span>');
								
								settingsHtml.push(override);
								break;
							case 'radio':
								settingsHtml.push('<span class="right">');
								$.each(setting.values, function(valueKey, value) {
									var checked = (valueKey === 0) ? ' checked' : '';
									if (isCurrentSet) {
										if (currentSettings[elementId] == value) {
											checked = ' checked';
										}
									}
									settingsHtml.push('<input type="radio" name="' + elementId + '" id="' + elementId + value + '" value="' + value + '"' + checked + '>');
									settingsHtml.push('<label for="' + elementId + value + '">' + value + '</label>&nbsp;');
								});
								settingsHtml.push('</span>');
								
								settingsHtml.push(override);
								break;
							case 'textarea':
								var value = (setting.hasOwnProperty('values')) ? setting.values[0] : '';
								if (isCurrentSet) {
									value = currentSettings[elementId];
								}
								settingsHtml.push('<span class="right"><textarea id="' + elementId + '" name="' + elementId + '">' + value + '</textarea></span>');
								break;
							
							default:
								break;
						}
						
						settingsHtml.push('<br>');
					});
				}
			}
			
			if (type == 'config') {
				$('#editDefaultsArea').show();
				
				$('#defaultComponentName').val(data[0].name);
				$('#defaultComponentAlias').val(data[0].alias);
				$('#defaultComponentCategory').val(data[0].category);
				$('#defaultComponentType').val(data[0].type);
				$('#defaultComponentTag').val(data[0].tag);
				$('#defaultComponentRel').val(data[0].rel);
				
				var dc = unescapeNewlines(data[0].defaultConfig);
				$('#editDefaultConfigArea').val(dc);
				
				var ds = (data[0].defaultSettings) ? JSON.stringify(JSON.parse(data[0].defaultSettings), null, 4) : '';
				$('#editDefaultSettingsArea').val(ds);
			}
			
			$(settingsArea).html(settingsHtml.join(''));
			
			if ($('#taskAccessSettings').length > 0) {
				taskAccessHtml = $('#taskAccessSettings').prop('innerHTML') + '<br style="clear: both;"><hr style="margin: 10px 0 15px 0;">';
				$(settingsArea).prepend(taskAccessHtml);
				$('#taskAccessLevel').val(currentSettings['taskAccessLevel']);
				$('#taskAuthorizedGroup').val(currentSettings['taskAuthorizedGroup']);
			}
		}
		else {
			$(settingsArea).html('No settings to display...');
		}
	})
	.fail(function(jqxhr, textStatus, error) {
		var err = "GET Request Failed: " + textStatus + ", " + error;
		console.log(err);
		alert(err);
	});
	
	return jqxhr;
}

/**
 * Add Setting
 * 
 * @param {string} div
 * @param {string} el
 * @returns void
 */
function addSetting(div, el) {
	$(div).on('click', '#newComponentSettingBtn', function(ev) {
		ev.preventDefault();
		if (! $('#isEditDefaults').is(':checked')) {
			return false;
		}
		
		var isNewSetting = false;
		$('#newComponentSettingType, #newComponentSettingId, #newComponentSettingLabel').each(function() {
			if ($(this).val().trim() == '') {
				$(this).val('').focus();
				isNewSetting = false;
				return false;
			}
			else { isNewSetting = true; }
		});
		if (! isNewSetting) { return false; }
		
		var currentSettingValue = $(el).val();
		var currentSettings = (currentSettingValue == '') ? '' : JSON.parse(currentSettingValue);
		if (currentSettings == '') {
			return false;
		}
		if (! currentSettings.hasOwnProperty('component')) {
			return false;
		}
		if (! currentSettings.component.hasOwnProperty('settings')) {
			return false;
		}
		
		var type = $('#newComponentSettingType').val().trim();
		var id = $('#newComponentSettingId').val().trim();
		var label = $('#newComponentSettingLabel').val().trim();
		var val = $('#newComponentSettingValue').val().trim();
		if ((type == 'select' || type == 'radio') && val != '') {
			var v = [];
			var vals = val.split(",");
			for (var i = 0; i < vals.length; i++) {
				v.push(vals[i].trim());
			}
			val = v;
		}
		else {
			val = [val];
		}
		
		var addSetting = {
			"type": type,
			"id": id,
			"values": val,
			"label": label
		};
		currentSettings.component.settings.push(addSetting);
		
		var newCurrentSettings = JSON.stringify(currentSettings, null, 4);
		$(el).val(newCurrentSettings);
		$('#newComponentSettingId, #newComponentSettingValue, #newComponentSettingLabel').val('');
		$(el).effect("highlight");
	});
}

/**
 * Get Option Settings
 * 
 * @access private
 * @returns {object}
 */
function getOptionSettings() {
	var settingInputs = $('#settingsArea').find('input, select, textarea');
	var settingsJson = {};
	$.each(settingInputs, function(k, v) {
		var id = $(v).attr('id');
		var val = $(v).val();
		settingsJson[id] = (Array.isArray(val)) ? val : val.trim();
		
		var type = $(v).attr('type');
		if (type == 'checkbox') {
			settingsJson[id] = ($(v).is(':checked')) ? 'true' : 'false';
		}
		if (type == 'radio') {
			if ($(v).is(':checked')) {
				settingsJson[$(v).attr('name')] = val;
			}
			delete settingsJson[id];
		}
	});
	
	return settingsJson;
}

/**
 * Set component options menu
 * 
 * @returns {void}
 */
function setComponentOptions(isNewOption) {
	
	var getData = {
		"stepName": "GET All FS Components"
	};
	$.getJSON('uniflow', getData)
	.done(function(data) {
		var categories = ["All"];
		var components = {"All": []};
		if (isNewOption) {
			components.All.push({"id": "new", "name": "-- New --", "alias": ""});
		}
		
		for (var i = 0; i < data.length; i++) {
			var id = data[i].id;
			var name = data[i].name;
			var alias = data[i].alias;
			var c = data[i].category.split(',').map(function(item) {
				return item.trim();
			});
			
			for (var x = 0; x < c.length; x++) {
				var cat = (c[x] == '') ? 'Misc' : c[x];
				if (! categories.includes(cat)) {
					categories.push(cat);
					components[cat] = [];
				}
				if (components.hasOwnProperty(cat)) {
					components[cat].push({"id": id, "name": name, "alias": alias});
				}
			}
			
			components.All.push({"id": id, "name": name, "alias": alias});
		}
		
		var cc = buildComponentCategories(categories.sort());
		$('#cCategory').html(cc);
		
		$('#cCategory').on('click', 'span.ccategory', function() {
			$('#cCategory span.ccategory').removeClass('ccategory-selected');
			$(this).addClass('ccategory-selected');
			
			var cat = $(this).data('ccategory');
			var co = buildComponentOptions(components[cat]);
			$('#cOptions').html(co);
		});
		
		$('#cOptions').on('click', 'span.coption', function() {
			$('#cOptions span.coption').removeClass('coption-selected');
			$(this).addClass('coption-selected');
		});
		
		$('#cCategory span.ccategory[data-ccategory="All"]').trigger('click');
	});
}

/**
 * Build component category menu items
 * 
 * @param {array} categories
 * @returns {string} html
 */
function buildComponentCategories(categories) {
	
	var html = [];
	for (var i = 0; i < categories.length; i++) {
		var cat = '<span class="ccategory" data-ccategory="' + categories[i] + '">' + categories[i] + '</span>';
		html.push(cat);
	}
	
	return html.join('<br>');
}

/**
 * Build component options menu items
 * 
 * @param {array} components
 * @returns {string} html
 */
function buildComponentOptions(components) {
	
	var html = [];
	for (var i = 0; i < components.length; i++) {
		var name = (components[i].alias == '') ? components[i].name : components[i].alias;
		var alias = (components[i].alias != '') ? components[i].name : components[i].alias;
		var comp = '<span class="coption" title="' + alias + '" data-componentid="' + components[i].id + '">' + name + '</span>';
		html.push(comp);
	}
	
	return html.join('<br>');
}

/**
 * Set protocol task drop down options
 * 
 * @returns {void}
 */
function setProtocolOptions() {
	
	$.getJSON('uniflow', {"stepName": "GET FS Protocol Tasks"})
	.done(function(data) {
		var options = ['<option value=""></option>'];
		for (var i = 0; i < data.length; i++) {
			var n = (data[i].routineName != '') ? data[i].routineName : data[i].taskName;
			var o = '<option data-task-id="' + data[i].taskId + '" data-routine-id="' + data[i].routineId + '" value="' + n + '">' + n + '</option>';
			options.push(o);
		}
		
		$('#pOptions').html(options.join(''));
	});
}

/**
 * Load and display tasks using a component
 * 
 * @param componentId
 * @returns void
 */
function loadTasksTable(componentId) {
	
	$('#loadTasks').load('/uniflow', {"stepName": "GET FS Tasks By Component Id", "componentId": componentId});
	$('#loadTasks').dialog({"height": "300", "position": {my: "top", at: "bottom", of: "#viewTasks"}});
}

/**
 * Load and display reusable task usage
 * 
 * @param taskId
 * @param clicked
 * @returns void
 */
function loadReusableTasksTable(taskId, clicked) {
	
	$('#reusableTaskUsageTable').remove();
	$('body').append('<div id="reusableTaskUsageTable" style="display: none;"></div>');
	$('#reusableTaskUsageTable').load('/uniflow', {"stepName": "GET FS Routines Table By Task Id", "taskId": taskId});
	$('#reusableTaskUsageTable').dialog({"width": "500","height": "300", "position": {my: "top", at: "bottom", of: clicked}});
}

/**
 * Show wait indicator
 * 
 * @returns void
 */
function showWaitIndicator() {
	
	var settingsArea = "#settingsArea";
	$(settingsArea).html('<p style="text-align: center;"><span class="progress-icon"></span>&nbsp;Please wait...</p>');
}

/**
 * Append progress overlay
 * 
 * @param table
 * @param id
 * @returns void
 */
function appendProgressOverlay(table, id) {
	
	var overlayId = (id !== undefined) ? id : 'progress_overlay';
	var overlay = '<div id="' + overlayId + '" class="progress-overlay"><div class="progress-label">PROCESSING...</div></div>';
	var pos = $(table).position();
	var width = $(table).width();
	var height = $(table).height();
	
	$(overlay).css({
		top: pos.top*2, 
		left: 0,
		width: width+2,
		height: height+2
	}).appendTo(table);
}

/**
 * Remove progress overlay
 * 
 * @param selector
 * @returns void
 */
function removeProgressOverlay(selector) {
	
	var el = (selector !== undefined) ? selector : '#progress_overlay';
	$(el).remove();
}
