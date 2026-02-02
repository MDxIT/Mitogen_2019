
// loads Order Info table in metadata tab
function loadOrderInfo() {
    $('#orderInfoTable').html('');
    $('#orderInfoTable').load('/uniflow', { "stepName" : "ajaxLoadMetaData", "reportMetaDataVersionId" : $("#metaDataReportDefinitionVersionId").val(), "section" : "orderInformation" },
        function(response, status, xhr){
            let tbody = $("#orderInfoTable .metaDataInfo tbody tr");
            hideColumns('#orderInfoTable .metaDataInfo', 'hide');
            stdTableSort('#orderInfoTable .metaDataInfo');
            $('#orderInfoTable .metaDataInfo').removeAttr('style','width:0px');
            if(tbody.length == 0){
                $("#orderInfoTable").empty().append("<div><h4>No metadata fields have been configured.</h4></div>");
            }
            $('.inputName').each(function(){
                let inputName = $(this).val();
                // per user story requirements, requestId & physicianSiteId are always required
                if(inputName === "requestId" || inputName === "physicianSiteId"){
                    $(this).parent().siblings().find('.metaDataSelection').prop("checked", true);
                    $(this).parent().siblings().find('.metaDataSelection').attr("disabled", true);
                    $(this).parent().siblings().find('.metaDataSelection').val(true);
                }
            })
        });
}

// loads Patient Info table in metadata tab
function loadPatientInfo() {
    $('#patientInfoTable').html('');
    $('#patientInfoTable').load('/uniflow', { "stepName" : "ajaxLoadMetaData", "reportMetaDataVersionId" : $("#metaDataReportDefinitionVersionId").val(), "section" : "patientInformation" },
        function(response, status, xhr){
            let tbody = $("#patientInfoTable .metaDataInfo tbody tr");
            hideColumns('#patientInfoTable .metaDataInfo', 'hide');
            stdTableSort('#patientInfoTable .metaDataInfo');
            $('#patientInfoTable .metaDataInfo').removeAttr('style','width:0px');
            if(tbody.length == 0){
                $("#patientInfoTable").empty().append("<div><h4>No metadata fields have been configured.</h4></div>");
            }
            $('.inputName').each(function(){
                let inputName = $(this).val();
                // per user story requirements, lastName is always required
                if(inputName === "lastName"){
                    $(this).parent().siblings().find('.metaDataSelection').prop("checked", true);
                    $(this).parent().siblings().find('.metaDataSelection').attr("disabled", true);
                    $(this).parent().siblings().find('.metaDataSelection').val(true);
                }
            })
        });
}

// loads Specimen Info table in metadata tab
function loadSpecimenInfo() {
    $('#specimenInfoTable').html('');
    $('#specimenInfoTable').load('/uniflow', { "stepName" : "ajaxLoadMetaData", "reportMetaDataVersionId" : $("#metaDataReportDefinitionVersionId").val(), "section" : "specimenInfo" },
        function(response, status, xhr){
            let tbody = $("#specimenInfoTable .metaDataInfo tbody tr");
            hideColumns('#specimenInfoTable .metaDataInfo', 'hide');
            stdTableSort('#specimenInfoTable .metaDataInfo');
            $('#specimenInfoTable .metaDataInfo').removeAttr('style','width:0px');
            if(tbody.length == 0){
                $("#specimenInfoTable").empty().append("<div><h4>No metadata fields have been configured.</h4></div>");
            }
            $('.inputName').each(function(){
                let inputName = $(this).val();
                // per user story requirements, specimenId is always required
                if(inputName === "specimenId"){
                    $(this).parent().siblings().find('.metaDataSelection').prop("checked", true);
                    $(this).parent().siblings().find('.metaDataSelection').attr("disabled", true);
                    $(this).parent().siblings().find('.metaDataSelection').val(true);
                }
            })
        });
}

// loads Clinical Info table in metadata tab
function loadClinicalInfo() {
    $('#clinicalInfoTable').html('');
    $('#clinicalInfoTable').load('/uniflow', { "stepName" : "ajaxLoadMetaData", "reportMetaDataVersionId" : $("#metaDataReportDefinitionVersionId").val(), "section" : "clinicalInformation" },
        function(response, status, xhr){
            var tbody = $("#clinicalInfoTable .metaDataInfo tbody tr");
            hideColumns('#clinicalInfoTable .metaDataInfo', 'hide');
            stdTableSort('#clinicalInfoTable .metaDataInfo');
            $('#clinicalInfoTable .metaDataInfo').removeAttr('style','width:0px');
            if(tbody.length == 0){
                $("#clinicalInfoTable").empty().append("<div><h4>No metadata fields have been configured.</h4></div>");
            }
        });
}

// loads Panel Info table in metadata tab
function loadPanelInfo() {
    $('#panelInfoTable').html('');
    $('#panelInfoTable').load('/uniflow', { "stepName" : "ajaxLoadMetaData", "reportMetaDataVersionId" : $("#metaDataReportDefinitionVersionId").val(), "section" : "panelSelection" },
        function(response, status, xhr){
            let tbody = $("#panelInfoTable .metaDataInfo tbody tr");
            hideColumns('#panelInfoTable .metaDataInfo', 'hide');
            stdTableSort('#panelInfoTable .metaDataInfo');
            $('#panelInfoTable .metaDataInfo').removeAttr('style','width:0px');
            if(tbody.length == 0){
                $("#panelInfoTable").empty().append("<div><h4>No metadata fields have been configured.</h4></div>");
            }
        });
}

// loads Proband Info table in metadata tab
function loadProbandInfo() {
    $('#probandInfoTable').html('');
    $('#probandInfoTable').load('/uniflow', { "stepName" : "ajaxLoadMetaData", "reportMetaDataVersionId" : $("#metaDataReportDefinitionVersionId").val(), "section" : "proband" },
        function(response, status, xhr){
            let tbody = $("#probandInfoTable .metaDataInfo tbody tr");
            hideColumns('#probandInfoTable .metaDataInfo', 'hide');
            stdTableSort('#probandInfoTable .metaDataInfo');
            $('#probandInfoTable .metaDataInfo').removeAttr('style','width:0px');
            if(tbody.length == 0){
                $("#probandInfoTable").empty().append("<div><h4>No metadata fields have been configured.</h4></div>");
            }

        });
}

// on change of report type check uniqueness and disable all other tabs until saved
function metaDataTemplateNameCheck() {
            let newMetaDataName = $("#metadataName").val();
            let callObject = {
                    "stepName": 'ajaxCheckMetaDataTemplateName',
                    "newMetaDataName": newMetaDataName
            };
                $.getJSON('uniflow?', callObject).done(function (data) {
                    if(data[0].metadataName != 'newTemplateName'){
                        $("#metadataName").val('');
                        $("#metadataName").addClass('required');
                        createSimpleModal('warningMessage', 'This template name already exists.', '');
                        event.preventDefault()
                    }
                });
}


$(function() {

    $("#metadataTab").on("click", function() {
        let reportDefVersionId = $("#recId").val();
        let reportPanelType = {
                "stepName": 'getReportPanelType',
                "reportDefVersionId": reportDefVersionId
        };
            $.getJSON('uniflow?', reportPanelType).done(function (data) {
                let reportPanelType = data[0].panelType
                let reportVersionId = data[0].reportDefinitionVersionId
                document.getElementById("panelType").value = reportPanelType;
                document.getElementById("metaDataReportDefinitionVersionId").value = reportVersionId;
                $('#metadataTemplate').load('/uniflow', {"stepName": 'ajaxLoadMetaDataTemplates', "reportPanelType" : $("#panelType").val(), "currentTemplateName" : $("#CurrentMetaDataTemplateName").val(), "currentTemplateId" : $("#CurrentMetaDataTemplateId").val()});
                let currentTemplate = $("#CurrentMetaDataTemplateId").val();
                if(currentTemplate != ''){
                    loadOrderInfo();
                    loadPatientInfo();
                    loadSpecimenInfo();
                    loadClinicalInfo();
                    loadPanelInfo();
                    loadProbandInfo();
                }
            })

    });

    $(".expandAll").on("click", function() {
        $(".sectionContent").show();
    });

    $(".collapseAll").on("click", function() {
        $(".sectionContent").hide();
    });

    $(".sectionTitle").on("click", function() {
        $(this).next().toggle();
    });


    /// if user selects a template, pull the most recent reportDefinitonVerisonId to pass through the metadata functions.

    $("#metadataTemplate").on("change", function() {
        let metaDataTemplateId = $("#metadataTemplate").val();
        if(metaDataTemplateId != ''){
            let metaDataReportDefinitionVersionId = {
                        "stepName": 'ajaxGetMetaDataAssociatedDefinitionVersionId',
                        "metaDataTemplateId": metaDataTemplateId
            };
                $.getJSON('uniflow?', metaDataReportDefinitionVersionId).done(function (data) {
                    let reportDefinitionVersionId = data[0].reportDefinitionVersionId
                    document.getElementById("metaDataReportDefinitionVersionId").value = reportDefinitionVersionId;
                    loadOrderInfo();
                    loadPatientInfo();
                    loadSpecimenInfo();
                    loadClinicalInfo();
                    loadPanelInfo();
                    loadProbandInfo();
                })
        }

    });

    // if user is creating a new template, enter the name, then display table options
    $("#metadataName").on("change", function() {
        metaDataTemplateNameCheck();
        let metaDataName = $(this).val();
        let metaDataTemplate = $("#metadataTemplate").val();
        if(metaDataName != '' && metaDataTemplate === ''){
            loadOrderInfo();
            loadPatientInfo();
            loadSpecimenInfo();
            loadClinicalInfo();
            loadPanelInfo();
            loadProbandInfo();
        }

    });

    // LOAD DATA IN EACH SECTION BASED ON PANELS AND FORMTYPE
    $("#saveReportMetadata").on("click", function() {
        let reportVersion = $("#recId").val();
        let newTemplateName = $("#metadataName").val();
        let existingTemplateId = $("#metadataTemplate").val();
        let formInputSettingsIdData = [];
        $('.metaDataSelection').each(function(){
            if($(this).is(':checked')){
                $(this).val('true');
                $(this).prop('checked', true);
                let formInputSettingsId = $(this).parent().siblings().find('.formInputSettingsId').val();
                formInputSettingsIdData.push(formInputSettingsId);

            }
        });
        let formInputJsonString = JSON.stringify({formInputSettingsIdArr: formInputSettingsIdData});
                postObject = {
                    stepName: 'Save Report Metadata'
                    ,Submit:true
                    ,formNumber:0
                    ,reportVersion: reportVersion
                    ,newTemplateName: newTemplateName
                    ,existingTemplateId: existingTemplateId
                    ,formInputJsonString: formInputJsonString
                }

                $.post('/uniflow', postObject)
                      .done(function(jqxhr, statusText)  {
                        console.log("statusText", statusText);
                        var postHtml = $.parseHTML(jqxhr);
                        var postError = checkPostError(postHtml);
                        console.log("postError", postError);
                        if (postError !== false) {
                          createSimpleModal('modalMessage', postError, 'Save Report Metadata Error');
                          let message = 'Save Report Metadata Error. Fill out all required fields and save again.';
                          failCallback(null, 'successDivMetadata', message);
                        } else {  successCallback('successDivMetadata', "** Report Metadata Successfully Saved.") }
                      })
                      .fail(function (jqxhr, textStatus, error) {
                          var err = "Request Failed: " + textStatus + ", " + error + ". Contact a system administrator.";
                          console.log(err);
                          createSimpleModal('modalMessage', err, 'Save Report Metadata Error');
                          failCallback(null, 'successDivMetadata', err);
                      })
                      .always(function() {
                        console.log("saving report Metadata");
                      });
    });

});


