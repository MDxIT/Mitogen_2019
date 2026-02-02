
function maxReached() {

  $('#sampleListMessages').children('div.maxMessage').remove();
  $('#sampleListMessages').append('<div class="maxMessage">Max number of samples has been selected.</div>');
  $('.sampleListTable_checkbox:not(:checked)').hide();
  $('.sampleListTable_checkbox:not(:checked)').parent().siblings().children('.sampleListTable_scan').hide();
  $('.sampleListTable_checkbox:not(:checked)').parent().siblings().children('.sampleListTable_scan').val('');
  $('#addControl').hide();
}

function canAddMore() {
  $('.sampleListTable_checkbox:not(:checked)').show();
  $('.sampleListTable_checkbox:not(:checked)').parent().siblings().children('.sampleListTable_scan').show();
  $('.sampleListTable_checkbox:not(:checked)').parent().siblings().children('.sampleListTable_scan').val('');
  $('#sampleListMessages').children('div.maxMessage').remove();
  $('#addControl').show();
}

function mustAddMore() {
  $('#sampleListMessages').children('div.minMessage').remove();
  $('#sampleListMessages').append('<div class="minMessage">You must select the minimum required samples for this batch.</div>');
}

function minReached() {
  $('#sampleListMessages').children('div.minMessage').remove();
}

function orderSamples(sampleCheckbox, config) {
  let $order = sampleCheckbox.parent().siblings().children(`.${config.prefix}Table_order`);
  let counterValue = $(`#${config.prefix}Counter`).val();
  if(sampleCheckbox.prop('checked') == true) {
    setOrder($order, counterValue);
  } else {
    let valueRemoved = $order.val();
    $(`.${config.prefix}Table_checkbox:checked`).parent().siblings().children(`.${config.prefix}Table_order`).each(function() {
      if(valueRemoved < $(this).val()){
        $(this).val($(this).val() - 1);
      }
    });

    if($($order).attr('sample_list_order')){
      setOrder($order, $($order).attr('sample_list_order'));
    } else {
      setOrder($order, '');
    }
  }
}

function setOrder($order, orderNo) {
    $order.val(orderNo);
    $order.attr('value',orderNo);
}
