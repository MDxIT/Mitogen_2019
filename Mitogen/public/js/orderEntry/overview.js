$(document).ready( function() {
    $('input, select').change(function() {
        var thisClass = $(this).attr('class');
        var classArray = thisClass.split(' ');
        var thisInput = '';
        if($(this).is('select')) {
            thisInput = $(this).find('option:selected').text();
        } else {
            thisInput = $(this).val();
        }
        $.each(classArray, function(index, value) {
            $('.overview_' + value).text(thisInput);
        })
    })
});
