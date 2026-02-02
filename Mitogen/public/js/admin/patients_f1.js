
$(function() {
    console.log('hi')
    convertOutputTableDateFormats( '.formatDateTable', $('#dateFormat').val());
    hideColumns('#unmergeTable', 'hideColumn');
    hideColumns('#unmergeTableInactive', 'hideColumn');
    $('input').blur();
    $(".patientNameBanner").focus().blur();
    $( "#patientForm1" ).tooltip();
    $(".combobox").combobox();
    $(".tabs").tabs();

     if ( $("#medicaidCheck").val() == "true") {
          $("#medicaidNumber").show();
          $('#medicaidCheck').prop('checked', true);
          }
          else {
              $("#medicaidNumber").hide();
              $("#medicaidCheck").val("false");
              $('#medicaidCheck').prop('checked', false);
          }
      if ( $("#medicareCheck").val() == "true" ) {
          $("#medicareNumber").show();
          $('#medicareCheck').prop('checked', true);
          }
          else {
              $("#medicareNumber").hide();
              $("#medicareCheck").val("false");
              $('#medicareCheck').prop('checked', false);
          }

      var ethnicityList = $("#ethnicityList").val();
      if(ethnicityList != ''){
          var ethnicityArr = ethnicityList.split(',');
          $.each( ethnicityArr, function( i, value ) {
              $("#patientEthnicity option").filter(function() {
                    return $(this).text() == value;
                }).prop("selected", true);
            });
      }

    $(".expandAll").on("click", function() {
         $(".sectionContent").show();
      });

    $(".collapseAll").on("click", function() {
         $(".sectionContent").hide();
      });

    $(".expandRequests").on("click", function() {
         $("#newSqidRequests").show();
         $(".collapseRequests").show();
         $(".expandRequests").hide();
      });

    $(".collapseRequests").on("click", function() {
         $("#newSqidRequests").hide();
         $(".expandRequests").show();
         $(".collapseRequests").hide();
      });

    $(".sectionTitle").on("click", function() {
           $(this).next().toggle();
    });

    if ($("#govtIdAccess").val() == "NoAccess")
    {
        $("#govtId").hide();
        $("#govtId").prev().hide();
    }

    $(".insuranceEdit").on("click", function() {
           $("#editInsurance").show();
           $("#primaryInsuranceList").focus();
    });

    $(".insuranceCarrierEdit").on("click", function() {
            var win = window.open('/uniflow?stepName=Insurance%20Providers', '_blank');
            if (win) {
                //Browser has allowed it to be opened
                win.focus();
            } else {
                //Browser has blocked it
                alert('Please allow pop-out tabs for this website');
              }
    });

  var scroll_height = $("#mrn").get(0).scrollHeight;
  $("#mrn").css('height', scroll_height + 'px !important');

   $("#medicareCheck").on('click', function(){
          if ( $("#medicareCheck").is(':checked') ) {
          $("#medicareNumber").show();
          $("#medicareCheck").val("true");
          $('#medicareCheck').prop('checked', true);
          }
          else {
              $("#medicareNumber").hide();
              $("#medicareCheck").val("false");
              $('#medicareCheck').prop('checked', false);
          }
      });
   $("#medicaidCheck").on('click', function(){
          if ( $("#medicaidCheck").is(':checked') ) {
          $("#medicaidNumber").show();
          $("#medicaidCheck").val("true");
          $('#medicaidCheck').prop('checked', true);
          }
          else {
              $("#medicaidNumber").hide();
              $("#medicaidCheck").val("false");
              $('#medicaidCheck').prop('checked', false);
          }
      });

  $(".unmergeCheckbox").on("change",  function() {

       var thisCheckbox = $(this);
       $("#unmergeDetails").show();
       var $checkboxes = $('.unmergeCheckbox');
      // var countCheckedCheckboxes = $checkboxes.filter(':checked').length;

     if(thisCheckbox.is(':checked')) {

          $checkboxes.addClass("notChecked");
          thisCheckbox.removeClass("notChecked");
          $(".notChecked").prop('disabled', true);
          thisCheckbox.parent().parent().css({"borderColor": "yellow", "borderWidth": "3px"});
          extractUnmergeDetails(thisCheckbox);

     }
     else {
         $checkboxes.removeClass("notChecked");
         $checkboxes.prop('disabled', false);
         $("#psRowId").val("");
         $("#selectedMRN").val("");
         $("#selectedSqid").val("");
         $("#unmergeDetails").hide();
     }

  });
  $('.viewOrder').on("click", function () {
        var reqId = $(this).text();
        if(reqId != 'No Order') {
             var win = window.open("/uniflow?stepName=Order+Form&_recId="+reqId+"&nextStepInstance=View&nextStepWorkflow=", "_blank", "height=700,width=800,location=no,menubar=no,top=200,left=600,toolbar=no");
              if (win) {
                   win.focus();
                } else {
                    alert('Please allow pop-up windows for this site');
                  }
          }
  });
  $('.viewSite').on("click", function () {
             var siteId = $(this).text();
             var win = window.open(" /uniflow?lastForm=Y&stepName=Clients&recId="+siteId, "_blank", "height=700,width=800,location=no,menubar=no,top=200,left=600,toolbar=no");
              if (win) {
                   win.focus();
                } else {
                    alert('Please allow pop-up windows for this site');
                  }
  });

  $("#patientSqid").on("change", function() {
          validateSqid($(this).val());
          $("#patientSqid").focus();
  });

  $('#famIdUserInfo').hide();
  $('#familyId').change(function() {
    toggleFamilyInfoMsg();
  });

});
  //Get mrn, sqId, and patient sources rowId from table
  function extractUnmergeDetails(thisCheckbox){
          var sqId =thisCheckbox.parent().siblings().children('.patientSqidCol').val();
          var this_mrn =thisCheckbox.parent().next().next().text();
          var rowId = thisCheckbox.parent().siblings().children('.psId').val();
          var patientId = $("#patientId").val();
          $("#selectedSqid").val(sqId);
          $("#selectedMRN").val(this_mrn);
          $("#psRowId").val(rowId);
          console.log(sqId, this_mrn, rowId);
          $("#unmergeHeader").empty().append("Enter a SQ ID for Unmerge of MRN: "+this_mrn);
          searchRequisitions(patientId, this_mrn);
    }
   // Get existing requisitions, if any for the patinet/mrn combo
   function searchRequisitions(patientId, mrn) {
      var ajaxParams = { "stepName" : "Ajax Patient Search Requests By MRN and PatientId",
                                     "patientId" : patientId,
                                     "mrn" :  mrn
                                   };
       console.log(ajaxParams);
       $('#currentRequests').load('/uniflow', ajaxParams,
          function(response, status, xhr){
              var tbody = $("#currentMRNRequests tbody tr");
              if ( status == "error" ) {
                      var msg = "Please contact your system administrator. There has been an error.  ";
                      $( "#currentMRNRequests" ).empty().append( "<span>" + msg + xhr.status + " " + xhr.statusText + "</span>");
              }
              else if( tbody.length == 0)
              {
                  $("#currentRequests").empty().append("<div><span>No Existing Requests For Patient: "+patientId+" MRN: "+mrn +"</span></div>");
                  $("#oldPatientStatus").prop("disabled", true);
              }
              else{
                stdTableSort('#currentMRNRequests', false);
                $("#oldPatientStatus").prop("disabled", false);
                //pop out window for reqId
                  $('.viewOrder').on("click", function () {
                         var reqId = $(this).text();
                         window.open("/uniflow?stepName=Order+Form&_recId="+reqId+"&nextStepInstance=View&nextStepWorkflow=", "_blank", "height=700,width=600,location=no,menubar=no,top=200,left=600,toolbar=no");

                    });
                  // check if all or some are checked in table
                    $(".unmergeRequestsCheckbox").on("click", function() {
                            console.log($(this));
                            createUnmergeRequestsList($(this));
                    });
             }
           });
    }
    // Check if Sqid is new or existing
  function validateSqid(sqid){
      if(sqid != $("#selectedSqid").val()) {

          var request1 = { "stepName" : "Ajax Validate Squid",
                                             "sqid" : sqid
                                    };
          $.getJSON('uniflow?', request1).done(function (data) {

                var checkValue = data[0].sqidCheck;
                var checkPatientId = data[0].patientId;
                if(checkValue === 'New')
                {
                    $("#newSqidDetails").hide();
                    $("#validSqid").val("new");
                    $("#newSqidRequests").empty().append("<div><span id= noExist>This SQ ID is new. A new patient will be created. </span></div>").show();
                    $("#noExist").focus().blur();
                }

                else {
                    $("#validSqid").val("exists");
                    $("#sqIdPatientId").val(checkPatientId);
                    $("#sqidName").focus().blur();
                    getSquidDetails(sqid);
                }
          });
      }
      else {
        $("#newSqidDetails").hide();
         $("#newSqidRequests").empty().append("<div><span> This SQ ID matches the SQ ID of the current patient. <br> Please enter a different squid.</span></div>").show();
      }
}

      //Get sqid patient details
  function getSquidDetails(sqid) {
      var request1 = { "stepName" : "Ajax Get Patient Details by Sqid",
                                         "sqid" : sqid
                                };
          $.getJSON('uniflow?', request1).done(function (data) {
                 if(data[0].firstName != '') {
                     $("#newSqidDetails").show();
                     $("#sqidName").empty().append(data[0].lastName + ", " + data[0].firstName + " " + data[0].middleName);
                     $("#sqidDOB").empty().append(data[0].dob);
                     $("#sqidGender").empty().append(data[0].geneticGender);
                 }
          });

    //Get Sqid Requests
      var request2 = { "stepName" : "Ajax Patient Search Requests By Sqid",
                                         "sqid" : sqid
                                };
       console.log(request2);
       $('#newSqidRequests').load('/uniflow', request2,
          function(response, status, xhr){
              var tbody = $("#sqidRequestsTable tbody tr");
              if ( status === "error" ) {
                            var msg = "Please contact your system administrator. There has been an error.  ";
                            $( "#newSqidRequests" ).empty().append( "<span>" + msg + xhr.status + " " + xhr.statusText + "</span>");
              }
              else if( tbody.length === 0)
              {
                          $("#newSqidRequests").empty().append("<div><span>New SQ ID. No Existing Requests For This SQ ID</span></div>");
              }
              else{
                          stdTableSort('#sqidRequestsTable', false);
                          $("#newSqidRequests").hide();
                          $(".expandRequests").show();
                          $(".collapseRequests").hide();
                          $('.viewOrder').on("click", function () {
                                var reqId = $(this).text();
                                 window.open("/uniflow?stepName=Order+Form&_recId="+reqId+"&nextStepInstance=View&nextStepWorkflow=", "_blank", "height=700,width=600,location=no,menubar=no,top=200,left=600,toolbar=no");
                            });
             }
           });
  }

  function createUnmergeRequestsList(thisCheckbox) {

              //disable status select list if all are checked, keep enabled if only some are checked
                var $requestCheckboxes = $(".unmergeRequestsCheckbox");
                var countCheckedCheckboxes = $requestCheckboxes.filter(':checked').length;

                if($requestCheckboxes.length === countCheckedCheckboxes) {
                             $("#oldPatientStatus").val("inactive").prop("disabled", true);
                }
                else {
                              $("#oldPatientStatus").val("inactive").prop("disabled", false);
                }

                // create list of requisitions to update with new patientId/squid and mrn
                var this_reqId =thisCheckbox.parent().next().text();
                var current_list = $("#reqList").val();

                console.log(this_reqId);
                console.log(current_list);

                 if(thisCheckbox.is(':checked')){
                              if(current_list === '') {
                                  var reqId_listform = ("'"+this_reqId+"'");
                                  $("#reqList").val(current_list + reqId_listform);
                              }
                              else {
                                          var reqId_listform = (",'"+this_reqId+"'");
                                          $("#reqList").val(current_list + reqId_listform);
                              }

                             console.log("checked");
                 }
                 else {

                             $("#reqList").val(current_list.replace(reqId_listform, ""));
                             console.log("unchecked");
                 }
  }

  function toggleFamilyInfoMsg()
  {
    let origPatFamilyId=$('#familyId').attr("origValue");
    if (origPatFamilyId=='') {
      return; 
    }
    
    let currPatFamilyId=$('#familyId').val();
    if(origPatFamilyId != currPatFamilyId){
      $('#famIdUserInfo').show();
    } else{
      $('#famIdUserInfo').hide();
    }
  }
