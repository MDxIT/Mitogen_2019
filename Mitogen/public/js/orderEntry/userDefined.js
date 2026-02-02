$(window).on('load', function() {

    $('.panel').each(function() {
      processUserDefinedTableFor($(this).attr('section'));
    });

    applyDatePicker();

});

function userDefinedOnSubmit() {
  $('.userDefinedTable_value.datePicker').each(function() {
      $(this).parent().siblings().children('input.hideColumn.userDefinedTable_dateValue').val($(this).val());
  });

  $('.userDefinedTable_value:checkbox').each(function() {
      $(this).parent().find(':hidden')
          .val($(this).prop('checked'))
          .prop('checked', $(this).prop('checked'))
          .attr('value', $(this).prop('checked'));
  });
  return true;
}

function processUserDefinedTableFor(section) {

    var table = '#userDefinedTable_' + section;
    var $table = $(table);
    // Hide user defined table if there are no rows
    if($(table + ' tbody tr').length == 0) {
        $(table).hide();
        return;
    }



    hideColumns(table, 'hideColumn');
    $table.removeClass('stdTable').children('thead').remove();
    $table.find('tr').removeClass('r0').removeClass('r1');
    $(table + ' .userDefinedTable_label').each(function() {
        var value = $(this).hide().val();
        $(this).parent().addClass('label').prepend(value);
    });

    // Iterate through the user defined table and dynamically change
    // element to the appropriate input type
    $(table + ' .userDefinedTable_inputType').each(function() {
        var inputType = $(this).val();
        var $value = $(this).parent('td').siblings().children('.userDefinedTable_value');
        var $dateValue = $(this).parent('td').siblings().children('.userDefinedTable_dateValue');
        var $defaultValue = $(this).parent('td').siblings().children('.userDefinedTable_defaultValue');
        var defaultValue = $defaultValue.val();
        var value = $value.val();
        var dateValue = $dateValue.val();
        if(inputType === 'date' && dateValue != ''){
            $value.val(dateValue)
        }
        replaceElementWith($value, inputType, defaultValue);
       
    });


}

// Retrieve and load set name values to select box
function getAndLoadSetNameValues($element, setName, value) {
    $element.load('/uniflow',
        {
            stepName: 'Ajax Get setNames Values',
            setName: setName
        }, function(data) {

            // Add empty option if length is 0
            if(data.length == 0) {
                $(this).append('<option value=""></option>');
            }
            var children = $(this).children('option');
            var found = false;

            // Find selected value from the data we got
            for(var i = 0; i < children.length; i++) {
                var child = $(children[i]);
                if(child.val() == value) {
                    child.attr('selected', true);
                    found = true;
                    break;
                }
            }

            // Create a new option if it fails to find it
            if(! found) {
                $(this).append('<option selected value="' + value + '">' + value + "</option>");
            }


        }
    );

}

function copyAttributes($from, $to) {
    var attributes = $from.prop('attributes');
    $.each(attributes, function() {
        $to.attr(this.name, this.value);
    });
    return $to;
}

// Replaces $element input type to the type specified.
// defaultValue is used for retrieving the set name values for select boxes
function replaceElementWith($element, type, defaultValue) {
    var $newElement;
    switch (type) {
        case 'date':
            if($element.prop('readonly') == false) {
                $element.addClass('datePicker');
            }
            break;
        case 'textarea':
            $newElement = $('<textarea></textarea');
            $newElement = copyAttributes($element, $newElement);
            $element.replaceWith($newElement.val($element.val()));
            break;
        case 'checkbox':
            // NOTE: Special case for checkbox
            // Instead of changing $element type to checkbox,
            // we create a new element and turn that into checkbox.
            // There seems to be an issue where if you change $element
            // type to checkbox and go to the form and submit without checking
            // the checkbox, it would cause a request '<name>' not found.

            $newElement = $element.clone()
                .attr('type', 'checkbox')
                .attr('name', $element.attr('name') + '_copy');

            if($element.val() == 'true') {
                $newElement.prop('checked', true).val('true').attr('value', 'true');
            } else {
                $newElement.prop('checked', false).val('false').attr('value', 'false');
            }
            if($element.attr('disabled') == 'disabled') {
                $element.removeAttr('disabled');
            }
            $element.removeAttr('required');
            $element.removeAttr('data-parsley-required');
            $newElement.insertAfter($element);
            $element.hide();
            break;
        case 'setName':
        case 'selectbox':
        case 'select':
            $newElement = $('<select></select>');
            $newElement = copyAttributes($element, $newElement);
            getAndLoadSetNameValues($newElement, defaultValue, $element.val());
            $element.replaceWith($newElement);
            break;
        case 'text':
        default:
            $element.attr('type', 'text');

        if($newElement) {
            if($newElement.attr('required') ||
                $newElement.attr('data-parsley-required') == true) {
                $newElement.parsley();
            }
        }
    }

}
