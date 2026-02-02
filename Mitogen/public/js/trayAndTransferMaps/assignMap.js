$(document).ready(function() {
  var mm;
  PlateFormat();

  $('#viewTranferContents').hide();

  $('#selectMM').change(function() {
    mm = $(this).val();
  });

  $(".viewButton").parent().addClass("viewButtonParent");

  $(".well").each(function(){
    if($(this).val() !== ''){
      $(this).css({'background': '#5BE5DA'}) 
    }else{
      $(this).css({'background': 'transparent'})
    } 
  })

  $(".well").click(function() {
    if (mm !== '') {
      $(this).val(mm);
      $(this).css({'background': '#5BE5DA'})
    }  
  });

  $("#addToAll").click(function() {
    if (mm !== '') {
      $('.well').val(mm);
      $('.well').css({'background': '#5BE5DA'})
    }  
  });

  $(".well").dblclick(function() {
    $(this).val('');
    $(this).css({'background': 'transparent'})
  });

  $("#destinationClear").click(function() {
    $(".well").val('');
    $(".well").css({'background': 'transparent'})
  });

  $("#viewContent").click(function() {
    $('#viewTranferContents').toggle();
  });

});

function PlateFormat () {  
  $(".sourceWell").parent().parent().parent().parent().addClass("table-plate");
  $(".sourceWell, .well").parent().addClass("wellParent");
  $(".sourceWell, .well").parent().parent(':nth-child(even)').css({
    'background': '#ececec',  
  })
  $(".well").each(function() {
    if( $(this).val() !== ''){
      $(this).css({
        'background': '#5BE5DA'
      });  
    }
  });
  if ($('#PlateType').val() === 'Grid') {
    $('.well').parent().parent().each(function (){
      $(this).children().first().hide()
    })  
  }
}





