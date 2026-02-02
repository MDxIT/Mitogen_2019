$(document).ready(function() {

  let instance= $('#instance').val();
  if(instance=='QC' || instance =='Edit'){

    let patientId = $('#hdnPatientId').val();
    let patOrdHist = JSON.parse($("#patOrdHist").val());
    let queryParam='lastForm=Y&stepName=Patients&recId=' + patientId;
    let patInfoLinkHTML='<span id="patientInfoLink" class="patientInfoLink">Show more details on ' +
                        '<a href=# id="viewPatInfoLink" onclick="openWin(\'' + queryParam + '\')"  >' + patientId + '</a></span>';

    if(patOrdHist.length > 0){
      let ordHist= generatePatientOrderHistoryTable(patOrdHist);
      convertOutputTableDateFormats( '#patientOrderHistoryTable', $('#dateFormat').val());
    } else{
      $('#patientOrderHistory').prepend('<div id="patientOrderHistoryTable" class="patientInfoLink emptyPatientHist">No Historical Orders to display</div>');
    }

    
    $(patInfoLinkHTML).insertAfter("#patientOrderHistoryTable");
    

  }

});

  function generatePatientOrderHistoryTable(data) {

    $('#patientOrderHistory').prepend('<table id="patientOrderHistoryTable"></table>');
    let columns = [
    {
      "title": "OrderID",
      "data": null,
      "render": function (data, type, row, meta) {
        let orderId = data.orderId;
        let queryParam='stepName=Order+Form&_recId=' + orderId + '&nextStepInstance=View&nextStepWorkflow='
        let returnValue='<a href="#" onclick="openWin(\'' + queryParam + '\')" id="viewOrder">' + orderId + '</a>';
        return returnValue;
      }
    },
    {
      "title": "Physician",
      "data": null,
      "render": function (data, type, row, meta) {
        var  returnValue = getDisplayString(data.physician, "physician");
        return returnValue;
      }
    },
    {
      "title": "Req Date",
      "data": null,
      "render": function (data, type, row, meta) {
        var  returnValue = getDisplayString(data.reqDate, "reqDate");
        return returnValue;
      }
    },
    {
      "title": "Panel(s)",
      "data": null,
      "render": function (data, type, row, meta) {
        var  returnValue = getDisplayString(data.panels, "panels");
        return returnValue;
      }
    },
    {
      "title": "Specimen(s)",
      "data": null,
      "render": function (data, type, row, meta) {
        var  returnValue = getDisplayString(data.specimens, "specimens");
        return returnValue;
      }
    },
    {
      "title": "Status",
      "data": null,
      "render": function (data, type, row, meta) {
        var  returnValue = getDisplayString(data.status, "status");
        return returnValue;
      }
    }
  ]; 
  
  let ordHist = stdPatientHistoryTable('#patientOrderHistoryTable', columns, data);
  return ordHist;
  }

  function stdPatientHistoryTable(tableSelector, columns, data){
    var configOverride = {
      "destroy": true,
      "searching": false,
      "autoWidth":false,
      "info": false,
      "order": [],
      "dom": '<"top"fB>rt<"bottom"lip><"clear">',
      "language": { "search": "", "searchPlaceholder": "Filter" },
      "columnDefs": [{
        "targets": '_all',
        "className": "dt-head-left dt-head-nowrap"
      }],
      "tableClasses": 'stdTable display dataTable no-footer',
      "paging": false,
      "data": data,
      "columns": columns,
      "colReorder": false,
      "buttons": []
    };
  
    for (var i = 0; i < columns.length; i++) {
      configOverride.columns[i].className = "col" + i;
    }    
    
    var table = constructDataTable(tableSelector, configOverride);

    return table;
  }


function getDisplayString(returnValue, classValue){
    return "<span class='" + classValue + "'>" + returnValue + "</span>";
}

function openWin(queryParam) {
  var win = window.open('/uniflow?' + queryParam, '_blank', "height=700,width=800,location=no,menubar=no,top=200,left=600,toolbar=no");
  if (win) {
    win.focus();
  } else {
      alert('Please allow pop-up windows for this site');
    }
}