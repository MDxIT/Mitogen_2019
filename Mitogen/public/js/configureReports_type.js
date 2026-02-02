$(document).ready(function() {
    $('#stepFormSubmitButton').hide();

    // if the definitionId is new then disable all tabs except "type"
    var repDefId = $("#recId").val();
    // $(".tabs").tabs({disabled: [ 1, 2,3,4,5,6 ]});
    $(".tabs").tabs({disabled: [ 1, 2,3 ]});
    if(repDefId === 'new') {
        $("#messageDiv").empty().append("<span>Complete and Save the report definitions in the Type tab to unlock the other configurations.</span>");
    }else {
           $("#messageDiv").empty().append("<p>Confirm or correct report definitions in the Type tab to unlock the other configurations and start a new report version.</p>");
           $("#saveReportType").val("Confirm or Correct");
        }
    var htmlReportTemplate = $("#htmlReportTemplate").val();
    // if (htmlReportTemplate.length > 0 )
    // {
    //   $("#reportTemplate_list").append('<div class="MultiFile-label"><a class="MultiFile-remove" href="#reportTemplate">x</a> <span><span class="MultiFile-label" title="File selected: testTemplate.html"><span class="MultiFile-title">'+htmlReportTemplate+'</span></span></span></div>');
    //   $(".MultiFile-remove").on("click", function() {
    //         $(this).parent().remove();
    //   });
    // }
    $(document).tooltip();

     // if there are tabs disabled, on click of the tabs a message appears to the user explaining they must save the report type tab to unlock the others
    $(".ui-tabs-nav").on("click", function() {
          if($("ul.ui-tabs-nav").children("li.ui-state-disabled").length > 0) {
                 createSimpleModal('modalMessage', "Please save the report configuration TYPE tab to unlock the other configuration tabs.", "Save Report Type");
          }
      });

    // get all customer siteIds and push into array
    var customerList = $("#customerIds").val();
    if(customerList != '' && customerList != undefined){
        var customerArr = customerList.split(',');
        $.each( customerArr, function( i, value ) {
            $("#customers option").filter(function() {
                      return $(this).val() == value;
              }).prop("selected", true);
          });
     }

      // on change of report type check uniqueness and disable all other tabs until saved
      $("#reportType1, #reportTitle, .selectedPanel").on("change", function() {
             $(".warning").empty();
             // $(".tabs").tabs({disabled: [ 1, 2,3,4,5,6 ]});
             $(".tabs").tabs({disabled: [ 1, 2,3]});
              reportId = $("#recId").val();
              reportType = $(this).val();
                  var callObject = {
                        "stepName": 'ajaxCheckName',
                        "reportId": reportId,
                         "reportType": reportType
                      };
              $.getJSON('uniflow?', callObject).done(function (data) {
                  if(data[0].reportName != 'DoesNotExist')
                  {
                       $("#reportType1").parent().prepend("<span class=warning>** This report type already exists.</span>")
                  }
              });
      });

      // on change of department load associated locations
      $("#department").on("change", function() {
          console.log($(this).val());

          $('#location').load('/uniflow',
            {   stepName: 'ajaxGetLocations',
              departmentSiteId: $(this).val(),
            });
          });

      // on click of save button, save report type configurations
      $("#saveReportType").on("click", function() {
           postReportDefinitionJSONArrays();
      });

      addTextareaCounter('#description', 255);

});

    /**
     * Saves the report type configuration
     *
     * @function postReportDefinitionJSONArrays
     * @param NO PARAMS
     *
     */
    function postReportDefinitionJSONArrays() {
        // get definition data into object
        var reportId = $("#recId").val();
        var reportType=  $("#reportType1").val();
        var reportTitle = $("#reportTitle").val();
        var reportDescription = $("#description").val();
        var versionNumber = $("#versionNumber").val();
        var reportTemplate = $("#reportTemplate").val();
        var reportTemplateCSS = ($("#reportTemplateCss").val()).join('');
        var reportTemplateJS = ($("#reportTemplateJs").val()).join('');

        if (reportTemplate == "" || reportTemplate == null) {
          reportTemplate = "defaultReportTemplate.html";
        }
        if (reportTemplateCSS == ""|| reportTemplateCSS == null) {
          reportTemplateCSS = "defaultReportStyle.css";
        }
        var definitionData = {"reportId": reportId, "reportType": reportType, "reportTitle": reportTitle, "reportDescription": reportDescription, "versionNumber": versionNumber, "reportTemplate": reportTemplate, "reportTemplateCSS": reportTemplateCSS, "reportTemplateJS": reportTemplateJS};
        //definitionData.push(objData);
        console.log(definitionData);
        var panelCodesData =[];

        $("#panelCodeTable tr").each(function (i, row) {
            $(this).find('td input:checked').each(function() {
                var panelCode = $(this).parent().siblings().find('.panelCode').val();
                panelCodesData.push( panelCode);
             });
          });
          console.log(panelCodesData);

          var globalSite = $("#globalSiteID").val();
          var department = $("#department").val();
          var location = $("#location").val();
          var sitesData = {"globalSite":globalSite, "department":department, "location": location};
          console.log(sitesData);


          var customersData = [];
          var customers = $("#customers").val();
              for( i=0; i< customers.length; i++) {
                var customer = customers[i];
                customersData.push(customer);
              }
          console.log(customersData);

          var definitionDataJSONString = JSON.stringify(definitionData);
          var panelCodesJSONString = JSON.stringify({panelCodesArr: panelCodesData});
          var sitesDataJSONString = JSON.stringify({sites:sitesData});
          var customersDataJSONString = JSON.stringify({customersArr: customersData});

          console.log('definitionDataJSONString', definitionDataJSONString);
          console.log('panelCodesJSONString', panelCodesJSONString);
          console.log('sitesDataJSONString', sitesDataJSONString);
          console.log('customersDataJSONString', customersDataJSONString);

          var callObject = {
              stepName: 'Save Report Definition'
              ,Submit:true
              ,formNumber:0
              ,definitionData:definitionDataJSONString
              ,panelCodesData: panelCodesJSONString
              ,sitesData:sitesDataJSONString
              ,customersData:customersDataJSONString
          }

           $.post('/uniflow', callObject)
                .done(function(jqxhr, statusText)  {
                  console.log("statusText", statusText);
                  var postHtml = $.parseHTML(jqxhr);
                  var postError = checkPostError(postHtml);
                  console.log("postError", postError);
                  if (postError !== false) {
                    createSimpleModal('modalMessage', postError, 'Save Report Type Error');
                    let message = 'Save Report Type Error. Fill out all required fields and save again.';
                    failCallback(null, 'successDiv', message);
                  } else {  successCallback('successDiv', "** Report Definition Successfully Saved.", loadDefinitionId()) }
                })
                .fail(function (jqxhr, textStatus, error) {
                    var err = "Request Failed: " + textStatus + ", " + error + ". Contact a system administrator.";
                    console.log(err);
                    createSimpleModal('modalMessage', err, 'Save Report Type Error');
                    failCallback(null, 'successDiv', err);
                })
                .always(function() {
                  console.log("saving report type");
                });

      }

    /**
     * Shows a success message to the user & enables tabs
     *
     * @function successCallback
     * @param {string} successDiv - div where success message is displayed
     * @param {string} message - message displayed
     * @param {function} option function to call
     *
     */
    function successCallback(successDiv, message, functionName ){
        $("#"+ successDiv).empty().append("<span>"+message+"</span>");
        $("#messageDiv").empty();
        $("#saveReportType").val("Save Report Type");
        $( ".tabs" ).tabs( "enable" );
        functionName;
      }
  /**
   * Log a failure of POST
   *
   * @function failCallback
   * @param {function} option function to call
   *
   */
    function failCallback(functionName, messageDiv, message){
        console.log("Failure");
        $("#"+ messageDiv).empty().addClass('redText').append("<span>"+message+"</span>");
        functionName;

    }

    /**
     * Gets the reportDefinitionId and saves value in $("#recId")
     *
     * @function getDefinitionId
     * @param {string} - saved report type
     *
     */
    function getDefinitionId(repType) {
        console.log("In Get Def ID");
        var callObject = {
            stepName: 'ajaxGetDefinitionId'
            ,reportType: repType
        }
        $.getJSON('uniflow?', callObject).done(function (data) {
          console.log(data)
          if(data.length > 0){
              var definitionId = data[0].reportDefId;
              var versionId = data[0].versionId;
              console.log(definitionId);
              $("#recId").val(definitionId);
              $("#versionId").val(versionId);
          }
        });
    }

    function loadDefinitionId() {
        var repType=  $("#reportType1").val();
        getDefinitionId(repType);
    }

