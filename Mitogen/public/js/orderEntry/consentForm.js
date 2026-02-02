$(document).ready( function() {
    var prefix = '.consentForm_';
    var formType = $('#formType').val();
    var instance = $('#instance').val();
    var workflow = $('#workflow').val();
    var section = 'consentForm';

    getAndProcessFormSettingsJson(formType, instance, workflow, prefix, section);

});
