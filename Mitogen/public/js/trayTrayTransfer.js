$(document).ready(function() {
  //on load, occupied wells will be readonly.
  $('.well').each(function() {
    if( $(this).val() != ''){
      $(this).prop('readonly', true);
    } else {
      $(this).prop('readonly', false);
    }
  });
  //check to make sure newly scanned item is a control assigned to the step
  $('.well').change(function(){
    var barcode = $(this).val();
    console.log("Barcode: "+barcode);
    var resourceControls = [];
    $('#controlResources > tbody  > tr').each( function() {
        let resource = $(this).find('.resource').val();
        console.log("Found Control: " + resource);
        resourceControls.push(resource);
     });
    console.log(resourceControls);

    if ($.inArray(barcode, resourceControls) != -1) {
          var countData = $('.well[value="'+ barcode  +'"]').length;
          console.log('NEW CONTROL ON PLATE COUNT FOR ' + barcode + '   ' + countData);
    } else {
        alert(barcode + ' is not validated under QC Resources -> Controls.');
        $(this).val('');
        $(this).focus();
    }

  });
});


