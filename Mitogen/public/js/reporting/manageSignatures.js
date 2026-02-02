$(document).ready(function() {
    if($('#imageExists').val() == '' ){
        $('#signatureUpload').show();
        $('#deleteImageCheckbox').hide();
        $('#currentImage').hide();
    } else {
        $('#signatureUpload').hide();
        $('#deleteImageCheckbox').show();
        $('#currentImage').show();


    }
    $('#deleteImageCheck').change(function() {
        if (this.checked) {
        $('#signatureUpload').show();
        $('#signatureUploadFile').show();

        } else {
        $('#signatureUpload').hide();
        $('#signatureUploadFile').hide();
        }
    });
});




          