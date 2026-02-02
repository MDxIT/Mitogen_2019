$(document).ready(function() {
    $(".tabs").tabs();
    hideColumns('#activeReportTable', 'hideColumn');
    hideColumns('#inactiveReportTable', 'hideColumn');
    $("#createNew").on("click", function() {

     var win = window.open('/uniflow?stepName=Configure%20Report&recId=new', '_blank');
          if (win) {
                //Browser has allowed it to be opened
                win.focus();
            } else {
                //Browser has blocked it
                alert('Please allow pop-out tabs for this website');
              }
    });

    $(".checkedRow").on("click", function() {
         console.log("inside");

          if($(this).prop('checked') == true) {
              console.log("checked");
              $(this).parent().parent().addClass("selectedRow");
          } else {
             console.log("unchecked");
              $(this).parent().parent().removeClass("selectedRow");
          }
    });
});