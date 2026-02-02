$(document).ready( function() {

  // This is adding a class to signify that this is a cherry pick to sample step.
    $('.plate').addClass('cherryPickTrayToList');

    $('form #stepFormSubmitButton').click(function(event) {
        event.preventDefault();
        $('form').parsley().validate();
        if($('form').parsley().isValid()) {
            var noSelected = $('#sampleListCounter').val();
            if(parseFloat(noSelected) == 0) {
                alert('Must select at least one sample.');
            } else { 
                $('[name="stepForm"]').submit();
            }
        };
    });
    
});

