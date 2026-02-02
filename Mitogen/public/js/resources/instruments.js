$(document).ready(function() {
  if($('h2.stepName').text() === 'View Instruments' | $('h2.stepName').text() === 'Lookup Tasks Due'){
    $('#stepFormSubmitButton').hide();
  };

  $('#lists').tabs();
  convertOutputTableDateFormats('.formatDateTable', $('#dateFormat').val());

  hideColumns('#service', 'hideColumn');
  hideColumns('#taskProperties', 'hideColumn');

  $('#accordion').accordion({
    collapsible: true,
    heightStyle: 'content'
  });

  $('#taskTabs').tabs();
  $('#due').tabs();
  $('#history').tabs();

  $('#viewTasksButton').click( function() {
    viewtasks();
  });

  $('.contactSelect').change( function() {
    $(this).parent('td').siblings().children('.contactValue').val($(this).val());
  });

  $('#showInstrumentsInUse').click( function() {
    showDialogTable('Ajax Show Instruments In Use');
  });

  $('.inventoryStatBlock').click( function() {
    var ajaxStep = 'Ajax_' + $(this).attr('id');
    var statusLabel = $(this).find('.statusLabel').text();
    showDialogTable(ajaxStep, statusLabel);
  });

});

function loadInstrumentsTable() {
  $('#searchTable').load('/uniflow',{stepName: 'Ajax Show Instrument Lookup Table', instrument: $('#instrumentType').val() },
         function(response, status, xhr){
              var tbody = $("#lookupTable tbody tr");
              if ( status == "error" ) {
                      var msg = "Please contact your system administrator. There has been an error.  ";
                      $( "#" + div ).empty().append( "<span>" + msg + xhr.status + " " + xhr.statusText + "</span>");
              }
              else if( tbody.length == 0)
              {
                  $("#lookupTable tbody").empty().append("<div><h4>NO SEARCH RESULTS FOUND</h4></div>");
              }
              else{
                stdTableSort('#lookupTable', false);
             }
           });
}

function showDialogTable(step, statusLabel) {
  $('#statusTable').dialog({ maxHeight: 500, minWidth: 800, title: statusLabel });
  $('#statusTable').load('/uniflow',{stepName: step},
         function(response, status, xhr){
              var tbody = $("#"+ step+" tbody tr");
              if ( status == "error" ) {
                      var msg = "Please contact your system administrator. There has been an error.  ";
                      $( "#" + div ).empty().append( "<span>" + msg + xhr.status + " " + xhr.statusText + "</span>");
              }
              else if( tbody.length == 0)
              {
                  $("#" + step).empty().append("<div><h4>NO SEARCH RESULTS FOUND</h4></div>");
              }
              else{
                stdTableSort('#' + step, false);
             }
           });
}

function viewtasks() {
  console.log('test');
  var groupArray = $('#list').val();
  var group = '';
  var today = $('#today').val();
  var later = $('#twoMonths').val();
  var tik = "'";
  var num = groupArray.length;

  for (var i = 0; i < num; i++) {
    group +=  groupArray[i]+ "','";
  }

  $('#overdueMain').load('uniflow?callback=?&stepName=Ajax+Show+Maintenance+Tasks+Overdue&Today='+today+'&Later='+later+'&Group='+group, function(){ $('#overdueMain').show(); });
  $('#maint').load('uniflow?callback=?&stepName=Ajax+Show+Maintenance+Tasks&Today='+today+'&Later='+later+'&Group='+group, function(){ $('#maint').show(); });
  $('#overdueCal').load('uniflow?callback=?&stepName=Ajax+Show+Calibration+Tasks+Overdue&Today='+today+'&Later='+later+'&Group='+group, function(){ $('#overdueCal').show(); });
  $('#cal').load('uniflow?callback=?&stepName=Ajax+Show+Calibration+Tasks&Today='+today+'&Later='+later+'&Group='+group, function(){ $('#cal').show(); });
}