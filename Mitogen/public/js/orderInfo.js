$(document).ready( function() {
    var prefix = '.orderInfo_'
    var formType = $('#formType').val();
    var instance = $('#instance').val();
    var workflow = $('#workflow').val();
    var section = $('#section').val();

    if(instance == 'view') {
        $('#stepFormSubmitButton').hide();
    }

    $(prefix + 'physicianSiteId').change( function() {
        searchPatientsByOrganization(prefix + 'physicianId', prefix + 'physicianSiteId');
    });

    getAndProcessFormSettingsJson(formType, instance, workflow, prefix, section);

    if($('#orderEntryCommentHistoryTable tbody tr').length == 0) {
        $('#orderEntryCommentHistory').hide();
    }

});




function searchPatientsByOrganization(phyId, phySiteId) {
    $(phyId).load('/uniflow',
           {stepName: 'Ajax Physicians By Organization Search Server', organizationId: $(phySiteId).val()
    });

};
