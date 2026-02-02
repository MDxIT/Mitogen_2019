$(function() {
     var definitionId = $("#recId").val();

     // Keep track of the header and updates the header table
     $("#headerNameSelect").on("change", function() {
        $(this).data("headerName", $(this).val());
        $("#headerName").val("");
        updateHeaderTable();
     });

     // Check if headerName exists
     // Set headerNameSelect value to ""
     $("#headerName").on("change", function() {
        headerName = $(this).val();
        $("#headerNameSelect").val("");
        $("#headerNameSelect").data("headerName", "");
            var callObject = {
                  "stepName": 'ajaxCheckHeaderName',
                  "headerName": headerName
                };
        $.getJSON('uniflow?', callObject).done(function (data) {
            $("#headerName").parent().find("span.warning").remove();
            if(data[0].headerName != 'DoesNotExist')
            {
                 $("#headerName").parent().prepend("<span class=warning>** This header name already exists.</span>")
            }
        });
     });

     // Update Header Table if headerTable is clicked
     $("#headerTab").on("click", function() {
        updateHeaderTable();
     });


     // Save or Update Report Header
      $("#saveReportHeader").on("click", function() {

        var arr = $('select.logoSelect').map(function(){
              return this.value
        }).get();
       console.log(arr);
        var definitionId = $("#recId").val();
        var headerName = $("#headerName").val();
        var primarySiteId = $("#primarySiteId").val();
        var primaryLogo = $("#primaryLogoVal").val();
        var primaryAddress = $("#primaryAddressVal").val();
        var secondarySiteId = $("#secondarySiteId").val();
        if (secondarySiteId == 'null') {
          secondarySiteId = ''
        }
        var secondaryLogo = $("#secondaryLogoVal").val();
        var secondaryAddress = $("#secondaryAddressVal").val();
        var reportDescription = $("#includeDescriptionInHeader").prop('checked');
        if (reportDescription == true) {
          reportDescription = 1
        } else {
          reportDescription = 0
        }
        var headerId = $("#headerNameSelect").val();

        var saveNew = true;
        if(headerId == null || headerId == '') {
            headerId = "";
        } else {
            saveNew = false;
        }

        if($.inArray("", arr) != -1) {
         createSimpleModal('modalMessage', "Show on Report is a required field. Select an option for each site.", "Required Field");
        }
        else if(headerName === '' && headerId == ""){
          createSimpleModal('modalMessage', "Header Name is a required field.  Please enter a name to save.", "Required Field");
        }
        else {

            postObject = {
                stepName: 'Save Report Header'
                ,Submit:true
                ,formNumber:0
                ,definitionId: definitionId
                ,headerName: headerName
                ,headerId: headerId
                ,saveNewHeader: saveNew
                ,primarySiteId: primarySiteId
                ,primaryLogo: primaryLogo
                ,primaryAddress: primaryAddress
                ,secondarySiteId: secondarySiteId
                ,secondaryLogo: secondaryLogo
                ,secondaryAddress: secondaryAddress
                ,reportDescription: reportDescription
            }

           $.post('/uniflow', postObject)
                .done(function(jqxhr, statusText)  {
                  console.log("statusText", statusText);
                  var postHtml = $.parseHTML(jqxhr);
                  var postError = checkPostError(postHtml);
                  console.log("postError", postError);
                  if (postError !== false) {
                    createSimpleModal('modalMessage', postError, 'Save Report Header Error');
                    let message = 'Save Report Header Error. Fill out all required fields and save again.';
                    failCallback(null, 'successDivHeader', message);
                  } else {  successCallback('successDivHeader', "** Report Header Successfully Saved.",  loadHeaderTemplateSelect() ) }
                })
                .fail(function (jqxhr, textStatus, error) {
                    var err = "Request Failed: " + textStatus + ", " + error + ". Contact a system administrator.";
                    console.log(err);
                    createSimpleModal('modalMessage', err, 'Save Report Header Error');
                    failCallback(null, 'successDivHeader', err);
                })
                .always(function() {
                  console.log("saving report header");
                });

        }
    });

});

// Load Header Template Select box
// Select box should only show relevant header templates
function loadHeaderTemplateSelect() {
    var sites = [];
    $(".logoSelectSiteId").each(function() {
        if($.inArray($(this).val(), sites) === -1) {
            sites.push($(this).val());
        }
    });

    var ajaxParams = {"stepName": "ajaxLoadHeaderTemplates", site1: sites[0], site2: sites[1], site3: sites[2]};
    $("#headerNameSelect").load("/uniflow", ajaxParams, function() {
        if( $("#headerNameSelect").data("headerName") != null) {
            $("#headerNameSelect").val($(this).data("headerName"));
        }
    });

}

// Check Logo Selectbox and reassign values
function checkLogoSelect(elem) {
    var selectedValue = $(elem).find('option:selected').val();
    var selectedSite = $(elem).parent().siblings().children('.logoSelectSiteId').val();
    var arr = $('select.logoSelect').map(function(){
          return this.value
    }).get();

    if(selectedValue.includes('primary')){
        $(".primaryLogo").prop("disabled", true);
        if($.inArray('secondaryLogoandAddress', arr) === -1 && $.inArray('secondaryLogoOnly', arr) === -1) {
          $(".secondaryLogo").prop("disabled", false);
        }
        $("#primarySiteId").val(selectedSite);
        $("#primaryLogoVal").val("1");
        if(selectedValue === 'primaryLogoandAddress') {
          $("#primaryAddressVal").val("1");
        }
    } else if(selectedValue.includes('secondary')){
        $(".secondaryLogo").prop("disabled", true);
        if($.inArray('primaryLogoandAddress', arr) === -1 && $.inArray('primaryLogoOnly', arr) === -1) {
          $(".primaryLogo").prop("disabled", false);
        }
        $("#secondarySiteId").val(selectedSite);
        $("#secondaryLogoVal").val("1");
        if(selectedValue === 'secondaryLogoandAddress') {
          $("#secondaryAddressVal").val("1");
        }
    } else if(selectedValue === 'none' || selectedValue === "") {
        if($.inArray('secondaryLogoandAddress', arr) === -1 && $.inArray('secondaryLogoOnly', arr) === -1) {
          $(".secondaryLogo").prop("disabled", false);
        }
        if($.inArray('primaryLogoandAddress', arr) === -1 && $.inArray('primaryLogoOnly', arr) === -1) {
          $(".primaryLogo").prop("disabled", false);
        }
    }
}


// Reset values and check logoSelect selectboxes to reassign/recheck values
function checkHeaderTables() {
    $("#primaryLogoVal").val("0");
    $("#primaryAddressVal").val("0");
    $("#secondaryLogoVal").val("0");
    $("#secondaryAddressVal").val("0");

    $("select.logoSelect").each(function() {
        checkLogoSelect(this);
    });
}

// Get Header Template Info
function getHeaderTemplate() {
    var definitionId = $("#recId").val();
    var ajaxParams = { "stepName": "ajaxGetHeaderSettings",
            "definitionId" : definitionId,
            "getLatestTemplate": true,
            "headerId": "" };
    if($("#headerNameSelect").val() != "" && $("#headerNameSelect").val() != null) {
        ajaxParams["getLatestTemplate"] = false;
        ajaxParams["headerId"] = $("#headerNameSelect").val();
    }

    $.get("/uniflow", ajaxParams, function(response) {
        var data = response[0];
        if(data !== undefined) {
            if(data.reportDescription == "1") {
                $("#includeDescriptionInHeader").val(true).prop("checked", true);
            } else {
                $("#includeDescriptionInHeader").val(false).prop("checked", false);
            }
            $("#headerNameSelect").val(data.id);
        }
    });
}

// Updates entire Header Table. It either uses the latest header template or assigned template
function updateHeaderTable() {
    var repTitle = $("#reportTitle").val();
    var repDescription = $("#description").val();
    var definitionId = $("#recId").val();
    $("#reportTitleHeader").text(repTitle);
    $("#reportDescriptionHeader").text(repDescription);
    var ajaxParams = { "stepName" : "Load Logos and Addresses",
                                      "definitionId" : definitionId,
                                      "getLatestTemplate": true,
                                      "headerId": ""};

    if($("#headerNameSelect").val() != "" && $("#headerNameSelect").val() != null) {
        ajaxParams["getLatestTemplate"] = false;
        ajaxParams["headerId"] = $("#headerNameSelect").val();
    }

   $('#loadLogoTable').load('/uniflow', ajaxParams,
      function(response, status, xhr){
          var tbody = $("#logosAndAddresses tbody tr");
          if ( status == "error" ) {
                  var msg = "Please contact your system administrator. There has been an error.  ";
                  $( "#loadLogoTable" ).empty().append( "<span>" + msg + xhr.status + " " + xhr.statusText + "</span>");
          }
          else if( tbody.length == 0)
          {
                $("#loadLogoTable").empty().append("<div><h4>NO SITE LOGOS FOUND. PLEASE CONFIGURE IN SITE CONFIGURATIONS.</h4></div>");
          }
          else{
              console.log("loaded");
              hideColumns('#logosAndAddresses', 'hideColumn');

              $(".logoSelect").on("change", function() {
                  checkHeaderTables();
              });
              loadHeaderTemplateSelect();
              getHeaderTemplate();
              checkHeaderTables();
         }
   });
}
