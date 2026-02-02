$(document).ready(function() {
  var dateFormat = $('#dateFormat').val();
  convertOutputTableDateFormats('.formatDateTable', dateFormat);
  $('#lists').tabs();
  $('#stepFormSubmitButton').hide();

  $('.expireDate').each(function(i,item) {
    $(item).parent().append(flagExpiratedDate($(item)))
    $(item).remove()
  })


  $('.inventoryStatBlock').click( function() {
    console.log('here')
    var ajaxStep = 'Ajax_' + $(this).attr('id');
    var statusLabel = $(this).find('.statusLabel').text();
    showDialogTable(ajaxStep, statusLabel);

  });

  $('#searchList .button').click(function() {
     var ajaxStep = 'Ajax_' + $(this).attr('id');
     var loadDiv = $(this).attr('id') + '_div';
     var value = $('#' + $(this).attr('id') + '_value').val();
     loadTable(loadDiv, ajaxStep, value)
  });

  $(document).on('click', '.paginate_button', function() {
      $('.expireDate').each(function(i,item) {
        $(item).parent().append(flagExpiratedDate($(item)))
        $(item).remove()
      })
   });

  $(document).on('click', 'thead th', function() {
      $('.expireDate').each(function(i,item) {
        $(item).parent().append(flagExpiratedDate($(item)))
        $(item).remove()
      })
   });


  $(document).on('change', '.dataTables_length select', function() {
      $('.expireDate').each(function(i,item) {
        $(item).parent().append(flagExpiratedDate($(item)))
        $(item).remove()
      })
   });

});

function showDialogTable(step, statusLabel) {
     $('#statusTable').children().remove();
     $('#statusTable').dialog({ maxHeight: 500, minWidth: 1000, title: statusLabel });
     $('#statusTable').load('/uniflow',{stepName: step},
         function(response, status, xhr){
              var tbody = $("#"+ step+" tbody tr");
              if ( status == "error" ) {
                      var msg = "Please contact your system administrator. There has been an error.  ";
                      $( "#" + div ).empty().append( "<span>" + msg + xhr.status + " " + xhr.statusText + "</span>");
              }
              else if( tbody.length == 0)
              {
                  $("#" + step).empty().append("<div><h4>NO SEARCH RESULTS FOUND</h4></div>");
              }
              else{
                stdTableSort('#' + step, false);
             }
            $('.expireDate').each(function(i,item) {
              $(item).parent().append(flagExpiratedDate($(item)))
              $(item).remove()
            })
           });
}

function loadTable(div, step, value) {
  $('#' + div).load('/uniflow',{stepName: step, value: value },
         function(response, status, xhr){
              var tbody = $("#"+ step+" tbody tr");
              if ( status == "error" ) {
                      var msg = "Please contact your system administrator. There has been an error.  ";
                      $( "#" + div ).empty().append( "<span>" + msg + xhr.status + " " + xhr.statusText + "</span>");
              }
              else if( tbody.length == 0)
              {
                  $("#" + step+ " tbody").empty().append("<div><h4>NO SEARCH RESULTS FOUND</h4></div>");
              }
              else{
                stdTableSort('#' + step, false);
             }
            $('.expireDate').each(function(i,item) {
              $(item).parent().append(flagExpiratedDate($(item)))
              $(item).remove()
            })
           });

  $('#' + div).css('display', 'inline');

}

function flagExpiratedDate(expireDate) {
  var currentDate = new Date($('#currentDate').val())
  var expirationDate =  new Date(expireDate.val())
  if(expirationDate <= currentDate ){
    return "<span style=color:red>" + expireDate.val() + "</span>"
  } else {
    return expireDate.val()
  }
}




