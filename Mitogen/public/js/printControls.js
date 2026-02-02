var refreshLoop = false;

function printStatus(refreshData) {
  var ps = $("#printStatus");

  var refreshData = {
    "stepName": "getPrintJobStatusByTrackingId",
    "trackingId": $("#trackingId").val()
  };

  ps.load(
      "/uniflow",
      refreshData,
      function( response, status, xhr) {
        var responseJSON = JSON.parse(response);
        var tableHTML = "<table><tr><th></th><th>Printer</th><th>Document</th><th>Status</th><th>Status Date</th><th>Status Detail</th></tr>";

        for (var i = 0; i < responseJSON.length; i++){
          tableHTML += '<tr><td><input type="button" value="reprint" class="docReprintButton" onClick=reprintDoc("' + responseJSON[i].jobId + '") /></td>';
          tableHTML += "<td>" + responseJSON[i].printerName + "</td>";
          tableHTML += "<td>" + responseJSON[i].documentName + "</td>";
          tableHTML += "<td>" + responseJSON[i].status + "</td>";
          tableHTML += "<td>" + responseJSON[i].statusDate + "</td>";
          tableHTML += "<td>" + responseJSON[i].statusDetail + "</td>";
          tableHTML += "</tr>";
        }

        tableHTML += "</table>";
          ps.html(tableHTML);
      });
};

function reprintDoc(jobId) {

    var rePrintData = {
      "stepName": 'requestJobReprintById',
      "jobId": jobId,
      "Submit": true,
      "formNumber": 0
    };

    $.post('/uniflow', rePrintData).success(function(jqxhr, statusText) {
        refreshLoopManager();
        }).fail(function (jqxhr, textStatus, error) {var err = "Request Failed: " + textStatus + ", " + error; alert(err);});
}

function refreshLoopManager() {
  if(refreshLoop == false) {
    refreshLoop = true;
    printStatusRefresh();
  }
};

function printStatusRefresh() {
  printStatus();
  setTimeout(printStatusRefresh, 5000);
};

$(document).ready(function() {
  $("#printerControls").first().each(function() {
    $("#printVars").hide();

    sessionStorage.setItem("printParameters", $("#printVars").html());

    $("#printDocument").click(function() {
      var printerList = new Array($("#printerList").val());
      var printParms = JSON.parse(sessionStorage.getItem("printParameters"));
      var parmArray = [];
      for (var i = 0; i < printParms.length; i++) {
        let newItem = {name : printParms[i].name, value : $("#" + printParms[i].lookup).val()}
        parmArray.push(JSON.stringify(newItem));
      }
      var printerData = {
        "stepName": 'requestPrintJob',
        "documentName": $("#documentChooser").val(),
        "printerList": JSON.stringify(printerList),
        "trackingId":  $("#trackingId").val(),
        "variableList": "[" + parmArray.join(",") + "]",
        "Submit": true,
        "formNumber": 0
      };

      $.post('/uniflow', printerData).success(function(jqxhr, statusText) {
          refreshLoopManager();
          }).fail(function (jqxhr, textStatus, error) {var err = "Request Failed: " + textStatus + ", " + error; alert(err);});
    });
  });

  $("#rePrintDocumentTable").each(function() {
    $("#rePrintDocumentTable>thead>tr>th").first().html("");
    $("#rePrintDocumentTable>tbody>tr>.col0>input").each(function(){ $(this).val("Reprint");});

  });
});