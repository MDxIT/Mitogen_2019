//This .extend below makes it so searching can be case insensitive, and fields can be matched exactly
$.extend($.expr[":"], { 
  'containsIgnoreCase': function(elem, i, match, array) { 
    return (elem.textContent || elem.innerText || "").toLowerCase().indexOf((match[3] || "").toLowerCase()) >= 0; 
  },
  'containsExact': $.expr.createPseudo ?
  $.expr.createPseudo(function(text) {
   return function(elem) {
    return $.trim(elem.innerHTML.toLowerCase()) === text.toLowerCase();
   };
  }) :
  // support: jQuery <1.8
  function(elem, i, match) {
   return $.trim(elem.innerHTML.toLowerCase()) === match[3].toLowerCase();
  }
}); 

function viewNoteHistory(noteId){
  $('#historyDialog').load('uniflow?callback=?&stepName=Notes+History+Ajax&noteId='+noteId, function(){
    $('#historyDialog').dialog({width: 500, modal: true});
  });
}

function viewTicketHistory(ticketId){
  $('#historyDialog').load('uniflow?callback=?&stepName=Ticket+History+Ajax&ticketId='+ticketId, function(){
    $('#historyDialog').dialog({width: 500, modal: true});
  });
}

function setupMilestones() {
  var lowestDate=new Date('Tue Jul 30 2450');
  var today = new Date();
  var highestDate = today;
  $('#milestonesTable tbody tr').each(function() {
    var startDate=covertSQLDateToDateObject($(this).find('td').eq(2).html());
    var endDate=covertSQLDateToDateObject($(this).find('td').eq(3).html());
    //console.log('startDate:' +startDate);
    //console.log('endDate:' +endDate);
    //alert('compate these dates'+startDate+' - '+endDate);
    if (startDate<lowestDate)
      lowestDate=startDate;
    if (endDate>highestDate)
      highestDate=endDate;
  });
  var totalSpan=getDateDiff(lowestDate,highestDate);
  var idLabelsWidth = 45;
  //setup scale 

  var todaySpan = getDateDiff(lowestDate, today);
  var todayScale = (todaySpan / totalSpan)*100;
  var temp;
  var milestoneCount = 0;
  $('#milestonesTable tbody tr').each(function() {
    milestoneCount++;
    var id = $(this).find('td').eq(0).children('a').html();
    //console.log(id);
    var description = $(this).find('td').eq(1).html();
    var startDate=covertSQLDateToDateObject($(this).find('td').eq(2).html());
    var endDate=covertSQLDateToDateObject($(this).find('td').eq(3).html());
    var span=getDateDiff(startDate,endDate);
    var milestoneWidthPercent = (span/totalSpan)*100;
    var milestoneStartPercent = (getDateDiff(lowestDate,startDate)/totalSpan)*100;
    var todayMilestonePercent = ((todayScale-milestoneStartPercent)/milestoneWidthPercent)*100;

    /*if(id == 'M7'){
      temp = milestoneStartPercent;
      //alert('getDateDiff(startDate,today): ' + getDateDiff(startDate,today) + '\nlowestDate: ' + lowestDate + '\nhighestDate: ' + highestDate + '\ntoday: ' + today + '\ntotalSpan: ' + totalSpan + '\ntodaySpan: ' + todaySpan + '\ntodayScale: ' + todayScale + '\nid: ' + id + '\ndescription: ' + description + '\nstartDate: ' + startDate + '\nendDate: ' + endDate + '\nspan: ' + span + '\ntodayMilestonePercent: ' + todayMilestonePercent + '\nmilestoneWidthPercent: ' + milestoneWidthPercent + '\nmilestoneStartPercent: ' + milestoneStartPercent);
    }*/
    $('<div id="id' + id + '" style="height: 20px;">' + id + '</div>').appendTo('#idLabels');
    
    $('<div onclick="window.location=\'uniflow?lastForm=Y&stepName=Update+Milestone&recId='+id+'\'" id="bar' + id + '" style="cursor:pointer; position:relative; left: '+ milestoneStartPercent + '%; height: 18px; width: ' + milestoneWidthPercent +'%;" title="' + description + '\n(' + formatDate(startDate) + ' - ' + formatDate(endDate) + ')"></div>').progressbar({value: todayMilestonePercent}).appendTo('#existingProgressWrapper');
  });
  if(milestoneCount != 0){
    $('#dateLabels').append('<div style="position:absolute; left:0;">'+formatDate(lowestDate)+'</div>');
    $('#existingProgressWrapper').prepend('<div style="position:absolute; left:'+todayScale+'%; margin-left:-18px; top:-17px;">Today</div>');
    $('#dateLabels').append('<div style="position:absolute; right:0;">'+formatDate(highestDate)+'</div>');
    $('#todayBar').css('width', todayScale+'%');
  }
  


  $( "#existingProgressWrapper" ).resizable({handles: 'e, w', alsoResize: '#dateLabels'});

} 

function getDateDiff(startDate,dueDate) {
  //get difference in days
  var oneDay = 1000*60*60*24
  var dif = Math.ceil((dueDate.getTime()-startDate.getTime())/oneDay)
  return dif
}

function covertSQLDateToDateObject(sqlDate) {
  // Split timestamp into [ M, D, Y]
  var t = sqlDate.split('/');
  // Apply each element to the Date function
  var dt = new Date(t[2], t[0]-1, t[1]);
  return dt
}

function formatDate(d) {
  var dd = d.getDate();
  if ( dd < 10 ) dd = '0' + dd;
  var mm = d.getMonth()+1;
  if ( mm < 10 ) mm = '0' + mm;
  var yy = d.getFullYear() % 100;
  if ( yy < 10 ) yy = '0' + yy;
  return mm+'/'+dd+'/'+yy;
}


function resetCreationDates(){
  $('#creation1, #creation2').val('');
  $('#creation1').datepicker( "option", "maxDate", null );
  $('#creation2').datepicker( "option", "minDate", null );
}

function resetMeetingDates(){
  $('#meeting1, #meeting2').val('');
  $('#meeting1').datepicker( "option", "maxDate", null );
  $('#meeting2').datepicker( "option", "minDate", null );
}

function clearFilters(){
  $('#displayDiv tbody tr').removeClass('hiddenRow');
  $('#filters input[type="text"], #filters select').val('');
  $('#creationAll, #meetingAll').attr('checked', true);
  $('#document').attr('checked', false);
  resetCreationDates();
  resetMeetingDates();
  updateCounts();
}

function containsDate(date1, date2, dateInQ){
  //alert('containsDate('+date1+', '+date2+', '+dateInQ+')');
  if(date1 == '' || date1 == '0000-00-00'){
    date1 = new Date('January 01 1970');
  } else{
    date1 = covertSQLDateToDateObject(date1);
  }
  if(date2 == '' || date2 == '0000-00-00'){
    date2 = new Date('July 30 2450');
  } else{
    date2 = covertSQLDateToDateObject(date2);
  }
  if(dateInQ == '' || dateInQ == '0000-00-00'){
    dateInQ = new Date('July 31 2450');
  } else{
    dateInQ = covertSQLDateToDateObject(dateInQ);
  }
  
  if(date1 <= dateInQ && dateInQ <= date2){
    return true;
  } else{
    return false;
  }
}

function getParameterByName(name){
  name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
  var regexS = "[\\?&]" + name + "=([^&#]*)";
  var regex = new RegExp(regexS);
  var results = regex.exec(window.location.search);
  if(results == null) return "";
  else return decodeURIComponent(results[1].replace(/\+/g, " "));
}
