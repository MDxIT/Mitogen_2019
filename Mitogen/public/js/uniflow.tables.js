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
    "paging": true,
    "ordering": true,
    "searching": true,
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

function stdTableExport(tableSelector) {

  $(tableSelector).addClass('display');

  var table = $(tableSelector).DataTable({
    "paging": true,
    "ordering": true,
    "searching": true,
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

      var hiddenArea = $("<div></div>").hide().appendTo(form);
      table.$('input, select, textarea').detach().appendTo(hiddenArea);
      form.unbind().submit();

      return false;

}