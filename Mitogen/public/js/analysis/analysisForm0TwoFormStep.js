
$(document).ready(function() {

    $('[name="stepForm"]').parsley();

    // validating parlsey on sumbit
    $('#stepFormSubmitButton').on('click', function(e) {
        e.preventDefault();
        let form = $('[name="stepForm"]');
        if (form.parsley().isValid()) {
            form.submit();

        } else {
        	$(form).parsley().validate()
        }
    });
});