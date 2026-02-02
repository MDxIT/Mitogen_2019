$(document).ready(function() {
  var listName = getListName();
  var config = getConfig(listName);
  var maxAllowed = $('#sampleMax').val();
  var minAllowed = $('#sampleMin').val();
  var noSelected = $('#sampleListCounter').val();
  $('form').prop(`override-${listName}-selectAll-click`, 'true');
  $('#selectAll').unbind('click'); // unbinding click in order to override

  if(minAllowed - maxAllowed >= 0) {
    setMinMaxToDefault();
  }

  console.log(minAllowed, maxAllowed);

  // Setup parsley min and max
  $('#sampleMax').attr('required', 'required').attr('data-parsley-pattern', '\\d+');
  $('#sampleMin').attr('required', 'required').attr('data-parsley-pattern', '\\d+');

  if(maxAllowed == 5000) {
    $('#sampleMax').parent().hide();
    $('#sampleMax').parent().prev('.label').hide();
  }
  if(minAllowed == 0) {
    $('#sampleMin').hide();
    $('#sampleMin').parent().prev('.label').hide();
  }

  // MANAGE SAMPLE MAX
  $('#sampleMax').change(function() {
    maxAllowed = $(this).val();
    noSelected = $("#sampleListCounter").val();
    if((parseFloat(minAllowed) - parseFloat(maxAllowed)) >= 0) {
      alert('Batch Maximum must be greater than or equal to Batch Minimum. Setting values to default.');
      setMinMaxToDefault();
    } else if(parseFloat(maxAllowed) < parseFloat(noSelected)) {
      $(this).val(noSelected);
      maxReached();
      alert('Please deselect the appropriate number of samples before changing the maximum number of samples.');
    } else if (parseFloat(maxAllowed) > parseFloat(noSelected)) {
      canAddMore();
    } else {
      maxReached();
    }
  })

  // MANAGE SAMPLE MIN
  if((parseFloat(minAllowed) > parseFloat(noSelected) || parseFloat(noSelected) == 0) && parseFloat(minAllowed) != 0) {
     mustAddMore();
  }
  $('#sampleMin').change(function() {
    minAllowed = $(this).val();
    if ((parseFloat(minAllowed) - parseFloat(maxAllowed)) >= 0) {
      alert('Batch Minimum must be less than or equal to Batch Maximum. Setting values to default.');
      setMinMaxToDefault();
    } else if(parseFloat(minAllowed) > parseFloat(noSelected) || parseFloat(noSelected) == 0) {
       mustAddMore();
    } else if (parseFloat(noSelected) > parseFloat(minAllowed)) {
      minReached();
    }
  });

  $('#sampleListCounter').change(function() {
    noSelected = $(this).val();
    if(parseFloat(noSelected) == parseFloat(maxAllowed)) {
      maxReached();
    } else if (parseFloat(noSelected) < parseFloat(maxAllowed)) {
      canAddMore();
    }
    if(parseFloat(noSelected) < parseFloat(minAllowed)) {
      mustAddMore();
    } else {
      minReached();
    }
  })

  $('#selectAll').click(function() {
    maxAllowed = parseFloat($('#sampleMax').val());
    let curControl = parseFloat($('.countControl').length);
    let numToSelect = maxAllowed - curControl;
    if($(this).prop('checked') == true) {
      canAddMore();
      $('.sampleListTable_checkbox').prop('checked',false);
      $('#sampleListTable tbody tr:lt(' +  numToSelect + ')').each(function() {
        $(this).children().children('.sampleListTable_checkbox').prop('checked',true);
        $(this).children().children('.sampleListTable_checkbox').change();
      });
      maxReached();
      minReached()
    } else {
      $('.sampleListTable_checkbox').prop('checked',false);
      $('.sampleListTable_checkbox').change();
       canAddMore();
       mustAddMore();
    }

    updateCounter(config);
  })

  $('form #stepFormSubmitButton').click(function(event) {
    event.preventDefault();
    $('form').parsley().validate();
    if($('form').parsley().isValid()) {
        var noSelected = $('#sampleListCounter').val();
        /* 
         * CASE 1: no samples selected
         * CASE 2: less than minAllowed
         * CASE 3: noSelected >= minAllowed and <= maxAllowed
        */
        if(parseFloat(noSelected) == 0) {
            alert('Unable to create a batch with no samples.');
        } else if(parseFloat(noSelected) < parseFloat(minAllowed)) {
            alert('You must select the minimum required samples for this batch.');
        } else if(parseFloat(noSelected) >= parseFloat(minAllowed) && parseFloat(noSelected) <= parseFloat(maxAllowed)) {
            $('[name="stepForm"]').submit();
        }
    };
  });

  function setMinMaxToDefault() {
    $('#sampleMin').val(1);
    $('#sampleMax').val(10);
    minAllowed = $('#sampleMin').val();
    maxAllowed = $('#sampleMax').val();
    $('form').parsley().validate();
  }
});

