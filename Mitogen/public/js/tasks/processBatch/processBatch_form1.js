$(document).ready(function() {
    
     
    $('#selectAll').click(function() {

        if($(this).prop('checked') == true) {
            $('.sampleListTable_checkbox')
                .prop('checked', false)
                .each(function() {
                $(this).prop('checked', true).change();
            });
        } else {
            $('.sampleListTable_checkbox').prop('checked', false).change();
        }
    });


});
