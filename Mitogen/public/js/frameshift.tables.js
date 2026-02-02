/**
 * Frameshift
 * Common Table Functions
 *
 * @requires DataTables
 * @see {@link https://datatables.net/}
 *
 * @author Harley Newton
 * @copyright 2018 Sunquest Information Systems
 * @version 1.2.20180815
 */

/**
 * Standard sorting table
 *
 * @example <caption>Auto add basic sorting</caption>
 * table
 *   class="stdTableSort"
 *
 * @example <caption>Call function</caption>
 * script
 *   stdTableSort('#myTable');
 *
 * @param {object|string} tableSelector
 * @returns {object}
 */
function stdTableSort(tableSelector) {

	$(tableSelector).addClass('display');

	var table = $(tableSelector).DataTable({
		"paging": false,
		"ordering": true,
		"searching": false,
		"info": false,
		"order": [],
		"columnDefs": [{
			"targets": '_all',
			"className": "dt-head-left dt-head-nowrap"
		}]
	});

	$('form').submit(function() {
		detachTableInputs($(this), table);
	});

	return table;
}

/**
 * Basic table
 *
 * @example <caption>Auto add basic style</caption>
 * table
 *   class="stdTableBasic"
 *
 * @example <caption>Call function</caption>
 * script
 *   stdTableBasic('#myTable');
 *
 * @param {object|string} tableSelector
 * @param {boolean} searching
 * @returns {object}
 */
function stdTableBasic(tableSelector, searching) {

	if (typeof searching == 'undefined') {
		searching = true;
	}

	$(tableSelector).addClass('display');

	var table = $(tableSelector).DataTable({
		"paging": true,
		"ordering": true,
		"searching": searching,
		"info": true,
		"order": [],
		"lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]],
		"columnDefs": [{
			"targets": '_all',
			"className": "dt-head-left dt-head-nowrap"
		}]
	});

	$('form').submit(function() {
		detachTableInputs($(this), table);
	});

	return table;
}


/**
 * Basic table with fixed columns
 *
 * DONOT USE THIS FOR INPUT TABLES WHERE THE FIXED COLUMNS NEED TO BE INPUTS THAT ARE SAVED TO THE DATABASE
 *     to make columns fixed datatables overlays a copy of the fixed copies on top of the original table so inputs that are not readonly when entered will not be part of the pieces that get saved to the database
 * @example <caption>Auto add Fixed Columns style</caption>
 * table
 *   class="stdTableFixedColumnsStart"
 *   data-fixedColumn= 2
 *
 * @example <caption>Call function</caption>
 * script
 *   stdTableFixedColumnsStart('#myTable', 2);
 *
 * @param {object|string} tableSelector
 * @param {number} numOfColumns
 * @param {boolean} searching
 * @returns {object}
 */
function stdTableFixedColumnsStart(tableSelector, numOfColumns, searching) {

	if (typeof searching == 'undefined') {
		searching = true;
	}

	$(tableSelector).addClass('display');

	var table = $(tableSelector).DataTable({
		"paging": true,
		"ordering": true,
		"searching": searching,
		"info": true,
		"order": [],
		"lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]],
		"columnDefs": [{
			"targets": '_all',
			"className": "dt-head-left dt-head-nowrap"
		}],
		"scrollX": true
	});

	if(! numOfColumns){
		numOfColumns = 1;
	}

    new $.fn.dataTable.FixedColumns(table, {
      "leftColumns": numOfColumns
    });

	$('form').submit(function() {
		detachTableInputs($(this), table);
	});

	return table;
}






/**
 * Basic table with buttons
 *
 * @example <caption>Auto add basic buttons</caption>
 * table
 *   class="stdTableButtons"
 *
 * @example <caption>Call function</caption>
 * script
 *   stdTableButtons('#myTable');
 *
 * @see getFormatExportOptions for export options
 *
 * @param {object|string} tableSelector
 * @returns {object}
 */
function stdTableButtons(tableSelector) {

	$(tableSelector).addClass('display');

	var table = $(tableSelector).DataTable({
		"paging": true,
		"ordering": true,
		"searching": true,
		"info": true,
		"order": [],
		"lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]],
		"columnDefs": [{
			"targets": '_all',
			"className": "dt-head-left dt-head-nowrap"
		}],
		"dom": 'lBfrtip',
		"buttons": [
			$.extend(true, {}, getFormatExportOptions(), {
				extend: 'excel', title: null
			}),
			$.extend(true, {}, getFormatExportOptions(), {
				extend: 'csv'
			}),
			$.extend(true, {}, getFormatExportOptions(), {
				extend: 'copy', header: true, title: null
			}),
			$.extend(true, {}, getFormatExportOptions(), {
				extend: 'pdf'
			})
		]
	});

	$('form').submit(function() {
		detachTableInputs($(this), table);
	});

	return table;
}

/**
 * Standard table with export buttons
 *
 * @example <caption>Auto add export buttons</caption>
 * table
 *   class="stdTableExport"
 *
 * @example <caption>Call function</caption>
 * script
 *   stdTableExport('#myTable');
 *
 * @see getFormatExportOptions for export options
 *
 * @param {object|string} tableSelector
 * @returns {object}
 */
function stdTableExport(tableSelector) {

	$(tableSelector).addClass('display');

	var table = $(tableSelector).DataTable({
		"paging": false,
		"ordering": false,
		"searching": false,
		"info": false,
		"order": [],
		"columnDefs": [{
			"targets": '_all',
			"className": "dt-head-left dt-head-nowrap"
		}],
		"dom": 'lBfrtip',
		"buttons": [
			$.extend(true, {}, getFormatExportOptions(), {
				extend: 'excel', title: null
			}),
			$.extend(true, {}, getFormatExportOptions(), {
				extend: 'csv'
			}),
			$.extend(true, {}, getFormatExportOptions(), {
				extend: 'copy', header: true, title: null
			})
		]
	});

	$('form').submit(function() {
		detachTableInputs($(this), table);
	});

	return table;
}

/**
 * Detach table form inputs and append back to form
 *
 * @example
 * script
 *   var table = $('#myTable').DataTable();
 *   $('form').submit(function() { detachTableInputs($(this), table) });
 *
 * @param {object} form
 * @param {object} table
 * @returns {false}
 */
function detachTableInputs(form, table) {

	if (form.is("[data-parsley-validate]")) {
		if (form.parsley().isValid()) {
			var hiddenArea = $("<div></div>").hide().appendTo(form);
			table.$('input, select, textarea').detach().appendTo(hiddenArea);
			form.unbind().submit();

			return false;
		}
	}
	else {
		var hiddenArea = $("<div></div>").hide().appendTo(form);
		table.$('input, select, textarea').detach().appendTo(hiddenArea);
		form.unbind().submit();

		return false;
	}
}

/**
 * Get format export options for table buttons
 *
 * To export data based on a select checkbox first column is assumed to
 * have an input of type 'checkbox' and a class of 'selectExport' assigned, <input type="checkbox" class="selectExport" />
 *
 * @returns {object}
 */
function getFormatExportOptions() {

	var opt = {
		exportOptions: {
			format: {
				body: function (data, row, column, node) {
					let newVal = data;

					let inputNode = $('input, select, textarea', node);
					if (inputNode.length > 0) {
						newVal = ($(inputNode).is(':hidden')) ? '' : inputNode.val();

						if ($(inputNode).is('input:checkbox')) {
							newVal = ($(inputNode).is(':checked')) ? 'true' : 'false';
						}
					}

					let textNode = $('a', node);
					if (textNode.length > 0) {
						newVal = textNode.text();
					}

					return newVal;
				}
			},
			rows: function (idx, data, node) {
				let isRowOutput = true;

				let checkedNode = $('td:first-child input.selectExport:checkbox', node);
				if (checkedNode.length > 0) {
					if (! checkedNode.is(':checked')) {
						isRowOutput = false;
					}
				}

				return isRowOutput;
			},
			columns: function (idx, data, node) {
				if (/<input*>/i.test(data)) {
					let colNode = $(data[0]);

					return (colNode.is('input.selectExport:checkbox')) ? false : true;
				}

				return true;
			}
		}
	};

	return opt;
}


/**
 * function to configure Order Review and Receiving form0 DataTables
 *  Uses stdTableBasic configurations with columnDef overrides
 *
 * @example $(function(){ configureTable('#tableId'); });
 * table
 *   id= tableId
 *
 * @param string tableSelector with '#'
 * @returns tableId.DataTable() with column 1 and 2 hidden but searchable.
 *
 */
function configureTable(tableId) {
      var table = $(tableId).DataTable( {
            "paging": true,
            "ordering": true,
            "searching": true,
            "info": true,
            "order": [],
            "lengthMenu": [[25, 50, 10, -1], [25, 50, 10, "All"]],
            "columnDefs": [
                {
                    "targets": [ 1 ],
                    "visible": false,
                    "className": "dt-head-left dt-head-nowrap"
                },
                {
                    "targets": [ 2 ],
                    "visible": false,
                    "className": "dt-head-left dt-head-nowrap"
                }
            ]
    });
      return table
  }



/**
 * function to configure searchable columns based on input field
 *
 * @example $(function(){ configureTable('#tableId'); });
 * table
 *   id= tableId
 *
 * @param string tableSelector with '#'
 * @returns tableId.DataTable() with column 1 and 2 hidden but searchable.
 *
 */

function addColumnSpecificSearch(dataTable, columnIdx, thisValue) {
  if ( dataTable.column(columnIdx).search() !== thisValue) {
      dataTable
          .column(columnIdx)
          .search( thisValue )
          .draw();
      }
}

