$(function() {
    $(".tabs").tabs();
    $("#stepFormSubmitButton").hide();
    stdTableSort(' .metaDataInfo');
    stdTableSort('.referenceTables');
    $(".wideInputs input, .wideInputs textarea").css("width", "400px");
    $(".metaDataSelection").attr("disabled", true);
    $(".groupSignout").attr("disabled", true);
    $(".sectionTitle").on("click", function() {
        $(this).next().toggle();
    });


});