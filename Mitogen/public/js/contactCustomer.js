

$(document).ready(function() {

     $( "#contactCustomerForm1" ).tooltip();
   //expand and collapse of sections
    $(".expandAll").on("click", function() {
         $(".sectionContent").show();
      });
    $(".collapseAll").on("click", function() {
         $(".sectionContent").hide();
      });
    $(".sectionTitle").on("click", function() {
           $(this).next().toggle();
    });
    hideColumns('#activeHolds', 'hideColumn');

});