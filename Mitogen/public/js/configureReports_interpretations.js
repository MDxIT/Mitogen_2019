$(function() {

         $("#interpretationsTab").on("click", function() {

              $(document).off("click");
              $(document).off("mousedown");

              getOverallInterpretationsTable();
              getPanelInterpretationsTable();

         });


          $("#savePanelInterpretation").on("click", function() {
                  postClearPanelInterpretations();
                  postClearOverallInterpretations();
            });
});

    // builds the overall results table
    function getOverallInterpretationsTable() {
        var definitionId = $("#recId").val();
        var callObject = {
            "stepName": 'ajaxGetOverallInterpretations',
            "definitionId": definitionId
          };
        $.getJSON('uniflow?', callObject).done(function (data) {
            $("#loadOverallInterpretations").empty();
            $("#loadOverallInterpretations").append('<table id="overallInterpretationsTable" ></table>');

            var columns = [
            {
              "title": "Report Name",
              "data": "ReportName",
              "render": function (data, type, row, meta) {
                return '<span class="reportName">'+data+'</span>'
              }
            },
            {
              "title": "Overall Result",
              "data": "Result",
              "render": function (data, type, row, meta) {
                return '<input type="text" class="resultText" value="'+data+'" tabindex="1">'
              }
            },
            {
              "title": "Interpretation Wording",
              "data": "Interpretation",
              "render": function (data, type, row, meta) {
                return '<textarea class="interpretationText" value="'+data+'" tabindex="1">'+data+'</textarea>'
              }
            },
            // {
            //   "title": "Group Signout",
            //   "data": "GroupSignout",
            //   "render": function (data, type, row, meta) {
            //       if(data === "false") {
            //           return '<input type="checkbox" name="GroupSignout" class="checkbox groupSignout" value="'+data+'" tabindex="1">'
            //       } else if(data === "true") {
            //          return '<input type="checkbox" name="GroupSignout" class="checkbox groupSignout" checked value="'+data+'" tabindex="1">'
            //       } else {
            //          return '<input type="checkbox" name="GroupSignout" class="checkbox groupSignout" value="false" tabindex="1">'
            //       }

            //   }
            // },
            {
              "title": "",
              "data": null,
              "render": function (data, type, row, meta) {
                return '<span class="cancelResult" onclick="deleteResultRow($(this))"><i class="far fa-window-close fa-2x"></i></span>'
              }
            },
            {
              "title": "",
              "data": null,
              "render": function (data, type, row, meta) {
                return '<input class="button addNewResult" type="button" onClick="addOverallResultRow($(this))" name="" value="Add Result" tabindex="1">'
              }
            }
            ];
          var options = {

          };

            stdDataTableFromArray('#overallInterpretationsTable', columns, data, false, options);
            $("#overallInterpretationsTable_filter > label > input[type=search]").hide();

            //attempting to turn off nicedit event listeners for js error
            $(".bodyClass").off("mousedown", ".cancleResult");
            $(".cancleResult, .interpretationText, .resultText").unbind("mousedown");
            $(".cancleResult, .interpretationText, .resultText").unbind("click");

        });

    }

    // builds the panel interpretations table
    function getPanelInterpretationsTable() {
        var definitionId = $("#recId").val();
        var callObject = {
            "stepName": 'ajaxGetPanelInterpretations',
            "definitionId": definitionId
          };
        $.getJSON('uniflow?', callObject).done(function (data) {
            $("#loadPanelInterpretations").empty();
            $('#loadPanelInterpretations').append('<table id="panelInterpretationsTable" ></table>');

            var columns = [
            {
              "title": "Panel",
              "data": "Panel",
              "render": function (data, type, row, meta) {
                return '<span class="panelName">'+data+'</span>'
              }
            },
            {
              "title": "Overall Result",
              "data": "Result",
              "render": function (data, type, row, meta) {
                return '<input type="text" class="resultText" value="'+data+'" tabindex="1">'
              }
            },
            {
              "title": "Interpretation Wording",
              "data": "Interpretation",
              "render": function (data, type, row, meta) {
                return '<textarea class="interpretationText" value="'+data+'" tabindex="1">'+data+'</textarea>'
              }
            },
            {
              "title": "",
              "data": null,
              "render": function (data, type, row, meta) {
                return '<span class="cancelResult" onclick="deleteResultRow($(this))"><i class="far fa-window-close fa-2x"></i></span>'
              }
            },
            {
              "title": "",
              "data": "PanelCode",
              "render": function (data, type, row, meta) {
                return '<input type="text" style= "display:none" class="panelCode" value="'+data+'" tabindex="1">'
              }
            },
            {
              "title": "",
              "data": null,
              "render": function (data, type, row, meta) {
                return '<input class="button addNewPanelResult" type="button" onClick="addResultRow($(this))" name="" value="Add Result" tabindex="1">'
              }
            }
            ];
          var options = {

          };

            stdDataTableFromArray('#panelInterpretationsTable', columns, data, false, options);
            $("#panelInterpretationsTable_filter > label > input[type=search]").hide();

            //attempting to turn off nicedit event listeners for js error
            $(".bodyClass").off("mousedown", ".cancleResult");
            $(".cancleResult, .interpretationText, .resultText").unbind("mousedown");
            $(".cancleResult, .interpretationText, .resultText").unbind("click");
            addTextareaCounter('.interpretationText', 2000);


          });

    }
    // adds new row to panel results table
    function addResultRow(buttonInput) {
         var panelId = buttonInput.parent().siblings().children('.panelName').text();
         var panelCode = buttonInput.parent().siblings().children('.panelCode').val();
         buttonInput.parent().parent().after('<tr class= "appended" role="row">'
            + '<td class="col0"><span class="panelName">'+ panelId+'</span></td>'
            + '<td class="col1"><input type="text" class="resultText" value="" tabindex="1"></td>'
            + '<td class="col2"><textarea class="interpretationText" value="" tabindex="1"></textarea></td>'
            + '<td class="col3"><span class="cancelResult" onclick="deleteResultRow($(this))"><i class="far fa-window-close fa-2x"></i></span></td>'
            + '<td class="col4"><input type="text" style="display:none" class="panelCode" value="'+panelCode+'" tabindex="1"></td>'
            + '<td class="col5"><input class="button addNewPanelResult" type="button" onClick="addResultRow($(this))" name="" value="Add Result" tabindex="1"></td></tr>');
         $(".bodyClass").off("mousedown", ".cancleResult");
        addTextareaCounter('.interpretationText', 2000);
    }
    // deletes appended row and clears non-appended rows
    function deleteResultRow(cancelRow) {
       if(cancelRow.parent().parent('.appended').length) {
            cancelRow.parent().parent().remove();
       } else{
          cancelRow.parent().siblings().children('.resultText').val("");
          cancelRow.parent().siblings().children('.interpretationText').val("");
       }
    }
    // adds new row to overall result table
    function addOverallResultRow(buttonInput) {
       var reportNameText = buttonInput.parent().siblings().children('.reportName').text();
       buttonInput.parent().parent().after('<tr class= "appended" role="row">'
          + '<td class="col0"><span class="reportName">'+ reportNameText+'</span></td>'
          + '<td class="col1"><input type="text" class="resultText" value="" tabindex="1"></td>'
          + '<td class="col2"><textarea class="interpretationText" value="" tabindex="1"></textarea></td>'
          // + '<td class="col3"><input type="checkbox" name="GroupSignout" class="checkbox groupSignout" value="false" tabindex="1"></td>'
          + '<td class="col4"><span class="cancelResult" onclick="deleteResultRow($(this))"><i class="far fa-window-close fa-2x"></i></span></td>'
          + '<td class="col5"><input class="button addNewResult" type="button" onClick="addOverallResultRow($(this))" name="" value="Add Result" tabindex="1"></td></tr>');
       $(".bodyClass").off("mousedown", ".cancleResult");
      addTextareaCounter('.interpretationText', 2000);

    }
    // Clears the panel Interpretations so there are no duplicates
    function postClearPanelInterpretations(){

       var definitionId = $('#recId').val();

       postObject = {
          stepName: 'Clear Panel Interpretations For Version'
          ,Submit:true
          ,formNumber:0
          ,definitionId: definitionId
       }
         $.post('/uniflow', postObject)
              .done(function(jqxhr, statusText)  {
                console.log("statusText", statusText);
                var postHtml = $.parseHTML(jqxhr);
                var postError = checkPostError(postHtml);
                console.log("postError", postError);
                if (postError !== false) {
                  createSimpleModal('modalMessage', postError, 'Clear Report Panel Interpretations Error');
                  let message = 'Clear Current Report Panel Interpretations Error. Fill out all required fields and save again.';
                  failCallback(null, 'successDivPanelInterpretation', message);
                } else {  successCallback('successDivPanelInterpretation', "** Report Panel Interpretations Successfully Cleared.",  postPanelInterpretations() ) }
              })
              .fail(function (jqxhr, textStatus, error) {
                  var err = "Request Failed: " + textStatus + ", " + error + ". Contact a system administrator.";
                  console.log(err);
                  createSimpleModal('modalMessage', err, 'Clear Report Panel Interpretations Error');
                  failCallback(null, 'successDivPanelInterpretation', err);
              })
              .always(function() {
                console.log("clearing report panel interpretations");
              });
    }

    //Clears the Overall Interpretations so there are no duplicates
    function postClearOverallInterpretations(){

      var definitionId = $('#recId').val();

      postObject = {
          stepName: 'Clear Overall Interpretations For Version'
          ,Submit:true
          ,formNumber:0
          ,definitionId: definitionId
       }
         $.post('/uniflow', postObject)
              .done(function(jqxhr, statusText)  {
                console.log("statusText", statusText);
                var postHtml = $.parseHTML(jqxhr);
                var postError = checkPostError(postHtml);
                console.log("postError", postError);
                if (postError !== false) {
                  createSimpleModal('modalMessage', postError, 'Clear Overall Report Interpretations Error');
                  let message = 'Clear Overall Report Interpretations Error. Fill out all required fields and save again.';
                  failCallback(null, 'successDivOverallInterpretation', message);
                } else {  successCallback('successDivOverallInterpretation', "** Report Overall Interpretations Successfully Cleared.",  postOverallInterpretations() ) }
              })
              .fail(function (jqxhr, textStatus, error) {
                  var err = "Request Failed: " + textStatus + ", " + error + ". Contact a system administrator.";
                  console.log(err);
                  createSimpleModal('modalMessage', err, 'Clear Overall Report Interpretations Error');
                  failCallback(null, 'successDivOverallInterpretation', err);
              })
              .always(function() {
                console.log("clearing current report overall interpretations");
              });
    }

    // POSTS the panel results and interpretations
    function postPanelInterpretations() {
        var definitionId = $('#recId').val();
        $("#panelInterpretationsTable tr").each(function (i, row) {
            var resultText =  $(this).find('td .resultText').val();
            var resultInterpretation = $(this).find('td .interpretationText').val();
            var panelCode =  $(this).find('td .panelCode').val();
            postObject = {
                  stepName: 'Save Report Panel Interpretations'
                  ,Submit:true
                  ,formNumber:0
                  ,definitionId: definitionId
                  ,resultText: resultText
                  ,resultInterpretation: resultInterpretation
                  ,panelCode: panelCode
              }

            if(resultText != '' && resultText != undefined) {
             $.post('/uniflow', postObject)
                  .done(function(jqxhr, statusText)  {
                    console.log("statusText", statusText);
                    var postHtml = $.parseHTML(jqxhr);
                    var postError = checkPostError(postHtml);
                    console.log("postError", postError);
                    if (postError !== false) {
                      createSimpleModal('modalMessage', postError, 'Save Report Panel Interpretations Error');
                      let message = 'Save Report Panel Interpretations Error. Fill out all required fields and save again.';
                      failCallback(null, 'successDivPanelInterpretation', message);
                    } else {  successCallback('successDivPanelInterpretation', "** Report Panel Interpretations Successfully Saved." ) }
                  })
                  .fail(function (jqxhr, textStatus, error) {
                      var err = "Request Failed: " + textStatus + ", " + error + ". Contact a system administrator.";
                      console.log(err);
                      createSimpleModal('modalMessage', err, 'Save Report Panel Interpretations Error');
                      failCallback(null, 'successDivPanelInterpretation', err);
                  })
                  .always(function() {
                    console.log("saving report panel interpretations");
                  });
            }

        });

    }
    // POSTS the Overall Results and Interpretations
    function postOverallInterpretations() {
        var definitionId = $('#recId').val();
        // var groupSignoutCheck = "";
        var resultText = "";
        var resultInterpretation = "";
        // var groupSignout;

        $("#overallInterpretationsTable tr").each(function (i, row) {
            resultText =  $(this).find('td .resultText').val();
            resultInterpretation = $(this).find('td .interpretationText').val();
            // groupSignoutCheck = $(this).find('td .groupSignout').prop('checked');
            // if (groupSignoutCheck == true) {
            //     groupSignout = 1;
            //  } else {
            //     groupSignout = 0;
            //  }

            postObject = {
                stepName: 'Save Report Overall Interpretations'
                ,Submit:true
                ,formNumber:0
                ,definitionId: definitionId
                ,resultText: resultText
                ,resultInterpretation: resultInterpretation
                // ,groupSignout: groupSignout

              }

            if(resultText != '' && resultText != undefined) {
             $.post('/uniflow', postObject)
                  .done(function(jqxhr, statusText)  {
                    console.log("statusText", statusText);
                    var postHtml = $.parseHTML(jqxhr);
                    var postError = checkPostError(postHtml);
                    console.log("postError", postError);
                    if (postError !== false) {
                      createSimpleModal('modalMessage', postError, 'Save Report Overall Interpretations Error');
                      let message = 'Save Report Overall Interpretations Error. Fill out all required fields and save again.';
                      failCallback(null, 'successDivOverallInterpretation', message);
                    } else {  successCallback('successDivOverallInterpretation', "** Report Overall Interpretations Successfully Saved." ) }
                  })
                  .fail(function (jqxhr, textStatus, error) {
                      var err = "Request Failed: " + textStatus + ", " + error + ". Contact a system administrator.";
                      console.log(err);
                      createSimpleModal('modalMessage', err, 'Save Overall Panel Interpretations Error');
                      failCallback(null, 'successDivOverallInterpretation', err);
                  })
                  .always(function() {
                    console.log("saving report overall interpretations");
                  });
            }

        });

    }



