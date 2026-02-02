/**
 * Frameshift
 * Samples Functions
 * 
 * @author Harley Newton
 * @author Kelli Svendsen
 * @copyright 2017 Sunquest Information Systems
 * @version 1.1.20170905
 */

/**
 * Set specimen next step select option
 * 
 * @param {string} selector - "#myTable tr.stdRow"
 * @param {string} queue
 * @param {string} fromStep
 * @returns sets next queue html select options
 */
function setNextStepOptions(selector, queue, fromStep) {
	
	var getData = {
		"stepName": "Ajax Get Next Steps By Queue",
		"queue": queue
	};
	$.getJSON('uniflow?callback=?', getData)
	.done(function(data) {
		var queuePaths = {};
		$.each(data, function(i, d) {
			if (d.specimenId in queuePaths) {
				queuePaths[d.specimenId].push(d)
			}
			else {
				queuePaths[d.specimenId] = [d];
			}
		});
		console.log(queuePaths);
		$(selector).each(function() {
			var specimenId = $('.specimenId', this).val();
			var sampleType = $('.sampleType', this).val();
			var fs = (fromStep !== undefined) ? fromStep : $('.fromStep', this).val();
			var option = '<option class="appended" value="NO QUEUE PATH" selected>NO QUEUE PATH</option>';
			
			if (specimenId in queuePaths) {
				$.each(queuePaths[specimenId], function(idx, qp){
					if (qp.sampleType.toLowerCase() == sampleType.toLowerCase() && qp.fromStep == fs) {
						option = '<option class="appended" value="' + qp.nextStep + '" selected>' + qp.nextStep + '</option>';
					}
				});
			}
			
			$('.nextStep', this).append(option);
		});
	});
}

/**
 * Set specimen panel select options
 * 
 * @param {string} selector - "#myTable tr.stdRow"
 * @param {string} queue
 * @returns sets panel html select options
 */
function setPanelOptions(selector, queue) {
	
	var getData = {
		"stepName": "Ajax Get Sample Panels By Queue",
		"queue": queue
	};
	$.getJSON('uniflow?callback=?', getData)
	.done(function(data) {
		var testPanels = {};
		$.each(data, function(i, d) {
			if (d.specimenId in testPanels) {
				testPanels[d.specimenId].push(d)
			}
			else {
				testPanels[d.specimenId] = [d];
			}
		});
		
		$(selector).each(function() {
			var specimenId = $('.specimenId', this).val();
			var options = [];
			if (specimenId in testPanels) {
				$.each(testPanels[specimenId], function(idx, tp){
					var s = (idx == 0) ? ' selected' : '';
					options.push('<option class="appended" value="' + tp.panelCode + '"' + s + '>' + tp.panelName + '</option>');
				});
			}
			
			$('.panels', this).append(options.join(''));
		});
	});
}

/**
 * Set specimen methods select options
 * 
 * @param {string} selector - "#myTable tr.stdRow"
 * @returns sets method html select option
 */
function setMethodOptions(selector) {
	
	var getData = {
		"stepName": "Ajax Load All Methods"
	};
	$.getJSON('uniflow?callback=?', getData)
	.done(function(data) {
		var methods = {};
		$.each(data, function(i, d) {
			if (d.panelCode in methods) {
				methods[d.panelCode].push(d)
			}
			else {
				methods[d.panelCode] = [d];
			}
		});
		
		$(selector).each(function() {
			var panelCode = $('.panelCode', this).val();
			var options = [];
			if (panelCode in methods) {
				$.each(methods[panelCode], function(idx, m){
					options.push('<option class="appended" value="' + m.value + '">' + m.text + '</option>');
				});
			}
			
			$('.methodList', this).append(options.join(''));
		});
	});
}
