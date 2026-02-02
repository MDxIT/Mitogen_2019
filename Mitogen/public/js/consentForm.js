$(document).ready( function() {
    var prefix = '.consentForm_';
    var formType = $('#formType').val();
    var instance = $('#instance').val();
    var workflow = $('#workflow').val();
    var section = $('#section').val();
    var step = $('h2.stepName').text();

    getAndProcessFormSettingsJson(formType, instance, workflow, prefix, section);

});
