
// loads first table in reference tab
function loadReportReferences() {
    $('#reportReferencesAjax').html('');
    $('#reportReferencesAjax').load('/uniflow', { "stepName" : "ajaxGetReportReferences", "reportVersion" : $("#recId").val() },
            function(response, status, xhr){
                let tbody = $("#assayReferencesIncludedTable tbody tr");
                if(status == "error" ) {
                    let msg = "Please contact your system administrator. There has been an error.  ";
                    $("#reportReferencesAjax" ).empty().append( "<span>" + msg + xhr.status + " " + xhr.statusText + "</span>");
                }
                else if( tbody.length == 0){
                    $("#reportReferencesAjax").empty().append("<div><h4>Select one or more references.</h4></div>");
                }else{
                    hideColumns('#assayReferencesIncludedTable', 'hide');
                    stdTableBasic('#assayReferencesIncludedTable');
                    $('#assayReferencesIncludedTable').removeAttr('style','width:0px');
                }
           });
}
// loads second table in reference tab
function loadAllReferences() {
    $('#allReferencesAjax').html('');
    $('#allReferencesAjax').load('/uniflow', { "stepName" : "ajaxGetAllReferences", "reportVersion" : $("#recId").val() },
        function(response, status, xhr){
            let tbody = $("#allReferencesTable tbody tr");
            if(status == "error" ) {
                let msg = "Please contact your system administrator. There has been an error.  ";
                $( "#allReferencesAjax" ).empty().append( "<span>" + msg + xhr.status + " " + xhr.statusText + "</span>");
              }
            else if( tbody.length == 0){
                $("#allReferencesAjax").empty().append("<div><h4>No references have been added to the system.</h4></div>");
            }else{
                hideColumns('#allReferencesTable', 'hide');
                stdTableBasic('#allReferencesTable');
                $('#allReferencesTable').removeAttr('style','width:0px');
            }
        });
}

// removes references from first table when checked
function removeReportReferences(checkbox) {
    let reportVersion = $("#recId").val()
    let reportReferenceId = checkbox.parent().siblings().find('.reportReferenceId').val();
            postObject = {
                stepName: 'Remove Report References'
                ,Submit:true
                ,formNumber:0
                ,reportVersion: reportVersion
                ,reportReferenceId: reportReferenceId
            }

        $.post('/uniflow', postObject)
            .done(function(jqxhr, statusText)  {
              console.log("statusText", statusText);
              var postHtml = $.parseHTML(jqxhr);
              var postError = checkPostError(postHtml);
              console.log("postError", postError);
              if (postError !== false) {
                createSimpleModal('modalMessage', postError, 'Save Report References Error');
                let message = 'Save Report References Error. Fill out all required fields and save again.';
                failCallback(null, 'successDivReportReferences', message);
              } else {  successCallback('successDivReportReferences', "** Report References Successfully Saved.",  loadReportReferences(),loadAllReferences() ) }
            })
            .fail(function (jqxhr, textStatus, error) {
                var err = "Request Failed: " + textStatus + ", " + error + ". Contact a system administrator.";
                console.log(err);
                createSimpleModal('modalMessage', err, 'Save Report References Error');
                failCallback(null, 'successDivReportReferences', err);
            })
            .always(function() {
              console.log("removing report References");
            });
}
// adds references to first table when checked
function includeAssayReferences(checkbox) {
    let reportVersion = $("#recId").val()
    let assayReferenceId = checkbox.parent().siblings().find('.assayReferenceId').val();
            postObject = {
                stepName: 'Save Report References'
                ,Submit:true
                ,formNumber:0
                ,reportVersion: reportVersion
                ,assayReferenceId: assayReferenceId
            }

        $.post('/uniflow', postObject)
            .done(function(jqxhr, statusText)  {
              console.log("statusText", statusText);
              var postHtml = $.parseHTML(jqxhr);
              var postError = checkPostError(postHtml);
              console.log("postError", postError);
              if (postError !== false) {
                createSimpleModal('modalMessage', postError, 'Save Report References Error');
                let message = 'Save Report References Error. Fill out all required fields and save again.';
                failCallback(null, 'successDivAllReferences', message);
              } else {  successCallback('successDivAllReferences', "** Report References Successfully Saved.",  loadReportReferences(),loadAllReferences() ) }
            })
            .fail(function (jqxhr, textStatus, error) {
                var err = "Request Failed: " + textStatus + ", " + error + ". Contact a system administrator.";
                console.log(err);
                createSimpleModal('modalMessage', err, 'Save Report References Error');
                failCallback(null, 'successDivAllReferences', err);
            })
            .always(function() {
              console.log("saving report References");
            });
}


// on change of report type check uniqueness and disable all other tabs until saved
function referenceCheck() {
    let reportReferences = $("#reportReferencesSave").val();
    let associatedPanelReference = $("#panelReferenceSelection").val();
            let callObject = {
                    "stepName": 'ajaxCheckCurrentReferences',
                    "reportReferences": reportReferences,
                    "associatedPanelReference": associatedPanelReference
            };
                $.getJSON('uniflow?', callObject).done(function (data) {
                    if(data[0].reference != 'newReference'){
                        createSimpleModal('warningMessage', 'This reference already exists.', '');
                        event.preventDefault()
                    }
                });
}

$(function() {
    $("#referencesTab").on("click", function() {
        loadReportReferences();
        loadAllReferences();
        // POPULATES SELECT PANELS DROPDOWN WITH PANELS ASSIGNED TO THE REPORT
        $('#panelReferenceSelection').find('option').remove();
        $('#panelReferenceSelection').load('/uniflow', {"stepName": 'ajaxGetReportPanels', "reportVersion" : $("#recId").val()});
    });


    $('.hide').hide();

    // SELECTED REPORT REFERENCES, REMOVES REFERENCE ASSOCIATION
    $(document).on("click", ".referenceExclude", function() {
        removeReportReferences($(this));
    });

    // AVAILABLE REFERENCES, ADDS REFERENCES TO REPORT REFERENCES TABLE
    $(document).on("click", ".referenceInclude", function() {
        includeAssayReferences($(this));
    });

    // CREATE NEW REFERENCES
    if($('#fancyTextPanelReferences').length ){
        let microDescEditor = new nicEditor();
        microDescEditor.setPanel('fancyTextPanelReferences');
        microDescEditor.addInstance('reportReferenceBox');
    }


    addDivCounter('#reportReferenceBox', 500);

    //SAVING TO TEXT AREA
    $('#reportReferenceBox').on('blur', function(e) {
        $('#reportReferencesSave').val( $('#reportReferenceBox').html() );
        $('#reportReferencesSave').val( $('#reportReferencesSave').val().replace(/\x{2029}/g,'') );
    });

    $(document).keypress(function(event){
        if (event.which == '13' && $(':focus').attr('id') != 'reportReferenceBox' ) {
          event.preventDefault();
        }
    });

    // CLICK SAVE REFERENCES BUTTON
    $("#saveReportReferences").on("click", function() {
        let reportVersion = $("#recId").val();
        let reportReferences = $("#reportReferencesSave").val();
        let associatedPanelReference = $("#panelReferenceSelection").val();
            if(reportReferences != '' && associatedPanelReference === ''|| reportReferences === '' && associatedPanelReference != ''){
                createSimpleModal('warningMessage', 'Fields marked with a red left edge are required. Enter text in all required fields.', '');
            }
            if(reportReferences != '' && associatedPanelReference != ''){
                referenceCheck();
                postObject = {
                    stepName: 'Save New References'
                    ,Submit:true
                    ,formNumber:0
                    ,reportVersion: reportVersion
                    ,reportReferences: reportReferences
                    ,associatedPanelReference: associatedPanelReference
                }

                $.post('/uniflow', postObject)
                    .done(function(jqxhr, statusText)  {
                      console.log("statusText", statusText);
                      var postHtml = $.parseHTML(jqxhr);
                      var postError = checkPostError(postHtml);
                      console.log("postError", postError);
                      if (postError !== false) {
                        createSimpleModal('modalMessage', postError, 'Save New Report References Error');
                        let message = 'Save New Report References Error. Fill out all required fields and save again.';
                        failCallback(null, 'successDivReferences', message);
                      } else {  successCallback('successDivReferences', "** New Report References Successfully Saved.",  loadReportReferences(),loadAllReferences() ) }
                    })
                    .fail(function (jqxhr, textStatus, error) {
                        var err = "Request Failed: " + textStatus + ", " + error + ". Contact a system administrator.";
                        console.log(err);
                        createSimpleModal('modalMessage', err, 'Save New Report References Error');
                        failCallback(null, 'successDivReferences', err);
                    })
                    .always(function() {
                      console.log("saving new report References");
                    });
            }

            $('#panelReferenceSelection').val('');
            $('#reportReferencesSave').val('');
            $('#reportReferenceBox').empty();

        });

});



