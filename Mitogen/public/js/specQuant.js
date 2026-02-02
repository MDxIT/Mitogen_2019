  var concResult = '';
  var purityResult = '';
$(document).ready(function() {

  hideColumns('#quantTable', 'hideColumn');

  $('.quant_conc').each(function() {
    quantResult($(this), $(this).parent().siblings().children('.quant_purity'));
  });

  $('.quant_uploaded').each(function() {
    if($(this).val() == 1) {
      $(this).parent().siblings().children('.quant_NoEditForUploaded').prop('readonly', true);
    }
  });

  $('.quant_conc').blur(function() {
    quantResult($(this), $(this).parent().siblings().children('.quant_purity'));
  });
  $('.quant_purity').blur(function() {
    quantResult($(this).parent().siblings().children('.quant_conc'), $(this));
  });

  $('.specQuant_conifguration').each(function() {
    if($(this).val() == 'No') {
      var columnClass = $(this).attr('id').replace('_include','');
      hideColumns('#quantTable', columnClass);
    }
  });

  if($('#specQuant_failCommentsRequired').val() == 'Yes') {
    $('.quant_sampleAction').change(function() {
      if($(this).val() == 'fail') {
        $(this).parent().siblings().children('.quant_sampleComment').addClass('required');
        $(this).parent().siblings().children('.quant_sampleComment').attr('data-parsley-required', 'true');
      } else {
        $(this).parent().siblings().children('.quant_sampleComment').removeClass('required');
        $(this).parent().siblings().children('.quant_sampleComment').removeAttr('data-parsley-required');
      }
    });
  }

  $('#batchId_Action').change(function() {
    $('.quant_sampleAction').val($(this).val()).change();
  });

  var batchComment = '';
  $('#batchId_Comments').focus(function() {
    batchComment = $(this).val();
  })
  $('#batchId_Comments').blur(function() {
    var newComment = $(this).val().trim();
    var comment = '';
    $('.quant_sampleComment').each(function() {
      if(batchComment != '') {
        $(this).val($(this).val().replace(batchComment, ''));
      }
      if($(this).val().trim().length > 0 && newComment.length > 0) {
        comment = $(this).val() + ' ' + newComment;
      } else if ($(this).val().trim().length > 0 && newComment.length == 0) {
        comment = $(this).val();
      } else {
        comment = newComment;
      }
      $(this).val(comment);
    })

  });

});


function validateConcentration(conc, concThresh) {

  if(conc >= concThresh) {
    concResult = 'pass'
  } else {
    concResult = 'fail'
  }
}

function validatePurity(purity, purityMin, purityMax, include) {
  if(include == 'Yes') {
    if(purity >= purityMin && purity <= purityMax) {
      purityResult = 'pass';
    } else {
      purityResult = 'fail';
    }
  } else {
    purityResult = 'pass';
  }
}

function quantResult($conc, $purity) {
  var conc = $conc.val();
  var purity = parseFloat($purity.val());
  var concThresh = parseFloat($conc.parent().siblings().children('.quant_concThresh').val());
  var purityMin = parseFloat($conc.parent().siblings().children('.quant_purityMin').val());
  var purityMax = parseFloat($conc.parent().siblings().children('.quant_purityMax').val());
  validateConcentration(conc, concThresh);
  validatePurity(purity, purityMin, purityMax, $('#specQuant_purity_include').val());
  console.log(concResult + '  ' + purityResult);
  if(concResult == 'pass' && purityResult == 'pass') {
    $conc.parent().siblings().children('.quant_sampleAction').val('pass');
    $conc.parent().siblings().children('.quant_sampleAction').css('background-color', 'white');
  } else {
    $conc.parent().siblings().children('.quant_sampleAction').val('');
    $conc.parent().siblings().children('.quant_sampleAction').css('background-color', 'Moccasin');
  }
}