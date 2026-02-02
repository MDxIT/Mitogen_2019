
// loads first table in wording tab
function loadReportWording() {
    $('#reportWordingAjax').html('');
    $('#reportWordingAjax').load('/uniflow', { "stepName" : "ajaxGetReportWording", "reportVersion" : $("#recId").val() },
        function(response, status, xhr){
            let tbody = $("#reportWordingIncludedTable tbody tr");
            if(status == "error" ) {
                let msg = "Please contact your system administrator. There has been an error.  ";
                $( "#reportWordingAjax" ).empty().append( "<span>" + msg + xhr.status + " " + xhr.statusText + "</span>");
            }
            else if(tbody.length == 0){
                $("#reportWordingAjax").empty().append("<div><h4>Select wording from available wording.</h4></div>");
            }else{
            hideColumns('#reportWordingIncludedTable', 'hide');
            stdTableBasic('#reportWordingIncludedTable');
            $('#reportWordingIncludedTable').removeAttr('style','width:0px');
            }
        });
}

// loads second table in wording tab
function loadAllAssayWording() {
    $('#allWordingAjax').html('');
    $('#allWordingAjax').load('/uniflow', { "stepName" : "ajaxGetAllWording", "reportVersion" : $("#versionId").val() },
        function(response, status, xhr){
            let tbody = $("#allWordingTable tbody tr");
            if(status == "error" ) {
              let msg = "Please contact your system administrator. There has been an error.  ";
              $( "#allWordingAjax" ).empty().append( "<span>" + msg + xhr.status + " " + xhr.statusText + "</span>");
            }
            else if( tbody.length == 0){
                $("#allWordingAjax").empty().append("<div><h4>No other report wording has been added to the system for the panels associated with this report.</h4></div>");
            }else{
            hideColumns('#allWordingTable', 'hide');
            stdTableBasic('#allWordingTable');
            $('#allWordingTable').removeAttr('style','width:0px');
            }
        });
}

// adds wording to first table when checked
function includeAssayWording(checkbox) {
    let reportVersion = $("#recId").val()
    let assayWordingId = checkbox.parent().siblings().find('.assayWordingId').val();
        postObject = {
              stepName: 'Save Report Wording'
              ,Submit:true
              ,formNumber:0
              ,reportVersion: reportVersion
              ,assayWordingId: assayWordingId
        }
        $.post('/uniflow', postObject, function() {successCallback('successDivReportWording', "** Report Wording Successfully Saved.", loadReportWording(),loadAllAssayWording())} )
}


function removeReportWording(checkbox) {
    let reportVersion = $("#recId").val()
    let reportWordingId = checkbox.parent().siblings().find('.reportWordingId').val();
        postObject = {
            stepName: 'Remove Report Wording'
            ,Submit:true
            ,formNumber:0
            ,reportVersion: reportVersion
            ,reportWordingId: reportWordingId
        }
        $.post('/uniflow', postObject, function() {successCallback('successDivReportWording', "** Report Wording Successfully Saved.", loadReportWording(),loadAllAssayWording())} )
}

// on change of report type check uniqueness and disable all other tabs until saved
function wordingCheck() {
    let reportWording = $("#reportWordingContentSave").val();
    let selectedPanelWording = $("#panelWordingSelection").val();
    let reportWordingOrder = $("#reportWordingOrder").val();
    let reportWordingHeader = $("#reportWordingHeader").val();
    let callObject = {
                "stepName": 'ajaxCheckCurrentWording',
                "reportWording": reportWording,
                "selectedPanelWording": selectedPanelWording,
                "reportWordingOrder":reportWordingOrder,
                "reportWordingHeader":reportWordingHeader
                };
        $.getJSON('uniflow?', callObject).done(function (data) {
            if(data[0].wording != 'newWording'){
                createSimpleModal('warningMessage', 'This wording already exists.', '');
                event.preventDefault()
            }
        });
}

function reportHeaderCheck(){
    let assaySelection = $('#panelWordingSelection').val();
    let header = $('#reportWordingHeader').val();
    let callObject = {
                "stepName": 'ajaxCheckCurrentHeader',
                "assaySelection": assaySelection,
                "header": header
    };
        $.getJSON('uniflow?', callObject).done(function (data) {
            if(data[0].sectionHeader != 'newHeader') {
                createSimpleModal('warningMessage', 'Section header must be unique.', '');
                $('#reportWordingHeader').val('')
                event.preventDefault()
            }
        });
}

function reportOrderCheck(){
    let assaySelection = $('#panelWordingSelection').val();
    let order = $('#reportWordingOrder').val();
    let callObject = {
                "stepName": 'ajaxCheckCurrentOrdering',
                "assaySelection": assaySelection,
                "order": order
    };
        $.getJSON('uniflow?', callObject).done(function (data) {
            if(data[0].displayOrder != 'newOrder') {
                createSimpleModal('warningMessage', 'Section order must be unique.', '');
                $('#reportWordingOrder').val('')
                event.preventDefault()
            }
        });
}


$(function() {
    $("#wordingTab").on("click", function() {
        loadReportWording();
        loadAllAssayWording();
        $('#panelWordingSelection').load('/uniflow', {"stepName": 'ajaxGetReportPanels', "reportVersion" : $("#recId").val()});
    });
    // SELECTED REPORT WORDING, REMOVES WORDING ASSOCIATION
    $(document).on("click", ".assayExclude", function() {
        removeReportWording($(this));
    });
    // AVAILABLE WORDING, ADDS WORDING TO REPORT WORDING TABLE
    $(document).on("click", ".wordingInclude", function() {
        includeAssayWording($(this));
    });

    // CREATE NEW WORDING
    if( $('#fancyTextPanelWording').length ){
        let microDescEditor = new nicEditor();
        microDescEditor.setPanel('fancyTextPanelWording');
        microDescEditor.addInstance('reportWordingBox');
    }


    addDivCounter('#reportWordingBox', 2000);

    //SAVING TO TEXT AREA
    $('#reportWordingBox').on('blur', function(e) {
        $('#reportWordingContentSave').val( $('#reportWordingBox').html() );
        $('#reportWordingContentSave').val( $('#reportWordingContentSave').val().replace(/\x{2029}/g,'') );
    });

     $(document).keypress(function(event){
        if (event.which == '13' && $(':focus').attr('id') != 'reportWordingBox' ) {
          event.preventDefault();
        }
    });

     // ENSURE HEADER IS UNIQUE PER PANEL
    $('#reportWordingHeader').change(function() {
        reportHeaderCheck();
    });

     // ENSURE ORDER IS UNIQUE PER PANEL
    $('#reportWordingOrder').change(function() {
        reportOrderCheck();
    });
     // CLICK SAVE NEW WORDING BUTTON
    $("#saveReportWording").on("click", function() {
        let reportVersion = $("#recId").val();
        let reportWording = $("#reportWordingContentSave").val();
        let selectedPanelWording = $("#panelWordingSelection").val();
        let reportWordingOrder = $("#reportWordingOrder").val();
        let reportWordingHeader = $("#reportWordingHeader").val();
        if(reportWording != '' && selectedPanelWording === '' && reportWordingOrder === '' && reportWordingHeader === ''
            || reportWording === '' && selectedPanelWording != '' && reportWordingOrder === '' && reportWordingHeader === ''
            || reportWording === '' && selectedPanelWording === '' && reportWordingOrder != '' && reportWordingHeader === ''
            || reportWording === '' && selectedPanelWording === '' && reportWordingOrder === '' && reportWordingHeader != ''  ){
            createSimpleModal('wordingWarningMessage', 'Fields marked with a red left edge are required. Enter text in all required fields.', '');
        }
            if(reportWording != '' && selectedPanelWording != '' && reportWordingOrder != '' && reportWordingHeader != ''){
                wordingCheck();
                postObject = {
                    stepName: 'Save New Report Wording'
                    ,Submit:true
                    ,formNumber:0
                    ,reportVersion: reportVersion
                    ,reportWording: reportWording
                    ,selectedPanelWording: selectedPanelWording
                    ,reportWordingOrder: reportWordingOrder
                    ,reportWordingHeader: reportWordingHeader
                }

           $.post('/uniflow', postObject)
                .done(function(jqxhr, statusText)  {
                  console.log("statusText", statusText);
                  var postHtml = $.parseHTML(jqxhr);
                  var postError = checkPostError(postHtml);
                  console.log("postError", postError);
                  if (postError !== false) {
                    createSimpleModal('modalMessage', postError, 'Save Report Wording Error');
                    let message = 'Save Report Wording Error. Fill out all required fields and save again.';
                    failCallback(null, 'successDivWording', message);
                  } else {  successCallback('successDivWording', "** Report Wording Successfully Saved.",  loadReportWording(),loadAllAssayWording() ) }
                })
                .fail(function (jqxhr, textStatus, error) {
                    var err = "Request Failed: " + textStatus + ", " + error + ". Contact a system administrator.";
                    console.log(err);
                    createSimpleModal('modalMessage', err, 'Save Report Wording Error');
                    failCallback(null, 'successDivWording', err);
                })
                .always(function() {
                  console.log("saving report Wording");
                });
          }
        $('#reportWordingContentSave').val('');
        $("#panelWordingSelection").val('');
        $("#reportWordingOrder").val('');
        $("#reportWordingHeader").val('');
        $('#reportWordingBox').empty();

    });

});
