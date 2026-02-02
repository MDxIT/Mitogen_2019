$(document).ready(function() {

    // Add support for printing the barcode
    printInputBarcodeIdx('.listSampleTable', 1, '', '');

    // Stylizing with JS.. Selecting a row (using the checkbox) will convert the
    // background of the whole row normal
    // This also sets disabled for select boxes and readOnly input text boxes 
    $('.stdRow').addClass('disabled');
    $('.listSampleTable').css('border-spacing', '0px');
    $('.listSamplesTable_comment').addClass('disabled');
    $('td input:checkbox').change(function() {
        if($(this).is(':checked')) {
            $(this).parent().siblings('.col3').find('.listSamplesTable_action').prop('disabled', false);
            $(this).parent().siblings('.col5').find('.listSamplesTable_comment').prop('readOnly', false).removeClass('disabled');
            $(this).parent().parent().removeClass('disabled');
        } else {
            $(this).parent().siblings('.col3').find('.listSamplesTable_action').prop('disabled', true);
            $(this).parent().siblings('.col5').find('.listSamplesTable_comment').prop('readOnly', true).addClass('disabled');
            $(this).parent().parent().addClass('disabled');
        }

    });

    var additionalColumnsIdx = 6;
    var $table = $('.listSampleTable').closest('table');
    var $headers = $table.find('thead tr th');
    var $rows = $table.find('tbody tr');
    var additionalColumnsHeaders = {'static': [], 'userDef': []};
    var requiredColumns = {'static': [], 'userDef': [], 'all': []};

    // Categorize required columns
    $('.additionalColumns').find('input').map(function(i) {
        var val = $(this).val();  
        if(val.indexOf('userDef_') != -1) {
            requiredColumns.userDef.push(val);
        } else {
            requiredColumns.static.push(val);
        }
        requiredColumns.all.push(val);
    });

    // Categorize additional columns
    $headers.filter(function(i) {
        return i >= additionalColumnsIdx;
    }).map(function(i, elem) {
        var text = $(elem).text();
        if(text.indexOf('userDef_') != -1) {
            additionalColumnsHeaders.userDef.push($(this));
        } else {
            additionalColumnsHeaders.static.push($(this));
        }
    });

    // Iterate through static columns then check if the column is required
    // If it's not required, remove/hide the column
    additionalColumnsHeaders.static.forEach(function(column, j) {
        var text = $(column).text();

        if($.inArray(text, requiredColumns.static) == -1) {
            var idx = $(column).index();
            $rows.find('td:eq(' + idx + ')').hide();
            $(column).hide();
        }
    });

    // Hides/removes userDef columns that are not required
    // Filter function returns columns that are not required
    // map function hides/removes those
    additionalColumnsHeaders.userDef.filter(function(column, i) {
        var text = $(column).text();
        var userDefIdx = text[text.length - 1];
        var output = true;

        // Iterates through required columns 
        // Checks if column is userDef and map it to the required columns array
        // Replace header by removing the prefix
        requiredColumns.all.forEach(function(requiredColumn, j) {
            if(requiredColumn.indexOf('userDef_') != -1 && i == j) {
                $(column).text(requiredColumn.replace('userDef_', ''));
                output = false;
            }
        });

        return output;
    }).map(function(column, i) {
        var text = $(column).text();
        var idx = $(column).index();
        $rows.find('td:eq(' + idx + ')').hide();
        $(column).hide();
    });

});

