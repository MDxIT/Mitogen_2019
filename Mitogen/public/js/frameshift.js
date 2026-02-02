/**
 * Frameshift
 * JavaScript Main
 *
 * @author Harley Newton
 * @copyright 2018 Sunquest Information Systems
 * @version 1.1.20180212
 */

/**
 * Main
 * Initial document load
 *
 * preventDoubleFormSubmit - Prevent double form submissions
 * preventReturnOnInput - Prevent return/enter on input, uncomment below to enable
 *
 * Set DataTables by class
 * stdTableSort
 * stdTableBasic
 * stdTableButtons
 *
 * Set common JavaScript functions by class
 * toggle - Set toggle by class. Toggles (hides/shows) next div or table.
 * datePicker - Set datepicker by class
 * datePickerDOB - Set date of birth datepicker by class
 * timePicker - Set 24 hour timepicker by class
 * timePicker12hr - Set 12 hour timepicker by class
 *
 * @see frameshift.tables.js
 * @see utilities.preventDoubleFormSubmit
 * @see utilities.preventReturnOnInput
 */
function frameshift() {
	$(function() {
		// Init top menu
		$("ul.sf-menu").superfish({
			autoArrows:  true,
			delay: 800,
			speed: 'fast',
			dropShadows: true,
			disableHI: true
		});

		// Underline current left menu item
		var stepName = document.title.replace('Mitogen - ', '');
		$(".queueStep").each(function() {
			if ($(this).text() == stepName) { $(this).css("text-decoration", "underline"); }
		});

		// Form input focus
		placeFocus();

		// Prevent double form submissions
		preventDoubleFormSubmit();

		// Prevent return/enter on input
		//preventReturnOnInput();

		// Do some page cleanup
		$('input').each(function() {
			if ($(this).prop('readonly')) {
				$(this).removeAttr('tabindex');
			}
		});

		$('.groupLabel').each(function() {
			if ($(this).text() == 'Comments') {
				$('.groupLabel').css('vertical-align', 'top');
			}
		});

		// Set sorting on queue count tables
		if (window.location.search.indexOf('stepQueue=') > -1) {
			$('table.stdTable').each(function() {
				stdTableBasic($(this), false);
			});
		}

		// Set DataTables by class
		if ($('table.stdTableSort').length > 0) {
			$('table.stdTableSort').each(function() {
				stdTableSort($(this));
			});
		}

		if ($('table.stdTableBasic').length > 0) {
			$('table.stdTableBasic').each(function() {
				stdTableBasic($(this));
			});
		}

		if ($('table.stdTableButtons').length > 0) {
			$('table.stdTableButtons').each(function() {
				stdTableButtons($(this));
			});
		}

		if ($('table.stdTableExport').length > 0) {
			$('table.stdTableExport').each(function() {
				stdTableExport($(this));
			});
		}



		if ($('table.stdTableFixedColumnsStart').length > 0) {
			$('table.stdTableFixedColumnsStart').each(function() {
				stdTableFixedColumnsStart($(this), $(this).attr('data-numberOfFixedColumns'));
			});
		}


		// Toggle next div or table
		if ($('legend.toggle').length > 0) {
			$('body').on('click', 'legend.toggle', function() {
				$(this).next('div').toggle();
				$(this).next('table').toggle();
			});
		}

        applyDatePicker();

		// Time Picker
		if ($('input[type=text].timePicker').length > 0) {
			$('input[type=text].timePicker').each(function() {
				$(this).timepicker({
					"step": 5,
					"timeFormat": "H:i",
					"scrollDefault": "now"
				});
				$(this).on('timeFormatError',function() {
					$(this).val('');
				});
			});
		}

		if ($('input[type=text].timePicker12hr').length > 0) {
			$('input[type=text].timePicker12hr').each(function() {
				$(this).timepicker({
					"step": 5,
					"timeFormat": "h:i",
					"scrollDefault": "now"
				});
				$(this).on('timeFormatError',function() {
					$(this).val('');
				});
			});
		}
	});
}
// Run
frameshift();


function applyDatePicker() {
    var momentNow = moment();
    var defaultDateFormat = 'MM/dd/yyyy';
    var dateFormat = $('#dateFormat').val();

    // Use the default date format if dateFormat is undefined
    if(dateFormat === undefined) {
        dateFormat = defaultDateFormat;
    } else {
        // Assumes dateFormat follows the java.text.SimpleDateFormat date
        // fomatting and convert it to moment date format
        dateFormat = momentNow.toMomentFormatString(dateFormat);
    }
    var momentNowString = momentNow.format(dateFormat);
    console.log(dateFormat);

    // Moment Date Picker
    // NOTE: if statements seems unnecessary
    if ($('input[type=text].datePicker').length > 0) {
        $('input[type=text].datePicker').each(function() {
            var opt = {
                format: dateFormat
            }
            $(this).datepicker(opt);
        });
    }

    if ($('input[type=text].datePickerNow').length > 0) {
        $('input[type=text].datePickerNow').each(function() {
            var nowOpt = {
                format: dateFormat,
                endDate: momentNowString
            }
            $(this).datepicker(nowOpt);
        });
    }

    if ($('input[type=text].datePickerDOB').length > 0) {
        $('input[type=text].datePickerDOB').each(function() {
            var dobOpt = {
                format: dateFormat,
                viewMode: 2
            };

            $(this).datepicker(dobOpt);
        });
    }

	if ($('input[type=text].datePickerFuture').length > 0) {
		$('input[type=text].datePickerFuture').each(function() {
		    var futureOpt = {
		        format: dateFormat,
		        startDate: momentNowString
		    };

		    $(this).datepicker(futureOpt);
		});
    }

}
