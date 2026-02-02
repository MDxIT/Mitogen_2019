$(document).ready(function() {

  $(".hide").hide();
  $('#stepFormSubmitButton').val('Ready for Sign Out');



  var departmentCol, locationCol, tableIdentifier, originalStep;
  var originalStep = $('input[name="stepName"]').val();
  if( originalStep === 'Addend Report'){
    departmentCol = 15;
    locationCol = 14;
    tableIdentifier = '.reportsTable'
  } else if( originalStep === 'Cancel Report'){
    departmentCol = 12;
    locationCol = 11;
    tableIdentifier = '.reportsTable'
  } else if( originalStep === 'Reject Report'){
    departmentCol = 12;
    locationCol = 11;
    tableIdentifier = '.reportsTable'
  }  else if( originalStep === 'Correct Report'){
    departmentCol = 17;
    locationCol = 16;
    tableIdentifier = '.reportsTable'
  } else if( originalStep === 'Amend Report'){
    departmentCol = 15;
    locationCol = 14;
    tableIdentifier = '.reportsTable'
  } 


  // begin form 0
  // create datatable
  var reportsTable = stdTableBasic(tableIdentifier, true);

  // arrange new filters
  $('.reportsTable_filter').append($('#table_filters'));

  convertOutputTableDateFormats( tableIdentifier, $('#dateFormat').val());

  // apply filtering functions
  $('#deptFilter').change(function() {
    addColumnSpecificSearch(reportsTable, departmentCol, $(this).val());
    searchLocationsByDepartment('.location','.department');
    $('#locationFilter')
        .val('')
        .change();
    hideDepartmentAndLocation (tableIdentifier, locationCol, departmentCol);
  });

  $('#locationFilter').change(function() {
    addColumnSpecificSearch(reportsTable, locationCol, $(this).val());
    hideDepartmentAndLocation (tableIdentifier, locationCol, departmentCol);
  });

  hideDepartmentAndLocation (tableIdentifier, locationCol, departmentCol);

  onClickElementArr = ['.paginate_button', 'thead th', '.dataTables_length select', 'input[type="search"]'];
  for (var i = 0; i < onClickElementArr.length; i++) {
    $(document).on('click', onClickElementArr, function() {
      hideDepartmentAndLocation (tableIdentifier, locationCol, departmentCol);
    });
  }
  // end form 0

  // begin form 1
  // change Text area
  if( $('#fancyTextModText').length ){
    var modTextEditor = new nicEditor();
    modTextEditor.setPanel('fancyTextModText');
    modTextEditor.addInstance('modTextBox');
  }

  $('#modTextBox').on('blur', function(e) {
    console.log(e);
    var modTextEntered = $('#modTextBox').html()
    console.log('modTextEntered', modTextEntered);
    if($('#modTextBox').html() == '<br>'){
      modTextEntered = ''
    }
    $('#modTextWordingSave').val( modTextEntered );
    $('#modTextBoxWordingSave').val( $('#modTextWordingSave').val().replace(/\x{2029}/g,'') );
  });

  addDivCounter('#modTextBox', 5000);
  // end change text area




  if($('input[name="formNumber"]').val() === '0' ){
    $('#stepFormSubmitButton').hide();
  }

  // Other step specific js events 
    // this is on all form0 for modify reporting
  $(document).on('click', '.viewOrder', function() {
    var reqId = $(this).text();
    if(reqId != '') {
      var win = window.open("/uniflow?stepName=Order+Form&_recId="+reqId+"&nextStepInstance=View&nextStepWorkflow=", "_blank", "height=700,width=800,location=no,menubar=no,top=200,left=600,toolbar=no");
      if (win) {
        win.focus();
      } else {
        alert('Please allow pop-up windows for this site');
      }
    }
  });



  if(originalStep != 'Correct Report' && originalStep != 'Amend Report'){
    $('#stepFormSubmitButton').click(function(e) {
        e.preventDefault();
        var modText = $('#modTextWordingSave').val()
        console.log('modText', modText)
        if(modText === ''){
          $('#errorMessageArea').html('<span class="error" id="errorId"><br><span>Modification text is required<br></span></span>');
          $('#modTextBox').css('border', 'solid 1px red');
        } else {
          $('[name="stepForm"]').submit();
        }
    })

  }


  if(originalStep === 'Addend Report'){
    $('.reviewResultButton').on("click", function () {
      var reportId = $("#reportId").val();
      if(reportId != '') {
        var win = window.open("/uniflow?lastForm=Y&stepName=Result+Data+Review&reportRecId="+reportId+"&reviewInstance=View&nextStepWorkflow=", "_blank", "height=700,width=800,location=no,menubar=no,top=200,left=600,toolbar=no");
            win.focus();
        } else {
            alert('Please allow pop-up windows for this site');
      }
    });
    $('.reviewResultLink').on("click", function () {
      var reportId = $(this).parent().siblings('.col0').text();
      if(reportId != '') {
          var win = window.open("/uniflow?lastForm=Y&stepName=Result+Data+Review&reportRecId="+reportId+"&reviewInstance=View&nextStepWorkflow=", "_blank", "height=700,width=800,location=no,menubar=no,top=200,left=600,toolbar=no");
            win.focus();
      } else {
          alert('Please allow pop-up windows for this site');
      }
    });
  } else if(originalStep === 'Amend Report'){
    $('.editReqLink').on("click", function () {
      var reqId = $(this).parent().siblings('.col1').text();
      if(reqId != '') {
          var win = window.open("/uniflow?stepName=Order+Form&_recId="+reqId+"&nextStepInstance=Edit&nextStepWorkflow=", "_blank", "height=700,width=800,location=no,menubar=no,top=200,left=600,toolbar=no");
          if (win) {
              win.focus();
          } else {
              alert('Please allow pop-up windows for this site');
          }
        }
    });
    // this is a diferent url than the amend url
    $('.reviewResultLink').on("click", function () {
      var reportId = $(this).parent().siblings('.col0').text();
      if(reportId != '') {
        var win = window.open(" /uniflow?lastForm=Y&stepName=Result+Data+Review&reportRecId="+reportId, "_blank", "height=700,width=800,location=no,menubar=no,top=200,left=600,toolbar=no");
            win.focus();
      } else {
          alert('Please allow pop-up windows for this site');
      }
    });
  } else if(originalStep === 'Correct Report'){
    $('#stepFormSubmitButton').show();
    $('.editReqLink').on("click", function () {
      var reqId = $(this).parent().siblings('.col2').text();
      if(reqId != '') {
        var win = window.open("/uniflow?stepName=Order+Form&_recId="+reqId+"&nextStepInstance=Edit&nextStepWorkflow=", "_blank", "height=700,width=800,location=no,menubar=no,top=200,left=600,toolbar=no");
        if (win) {
            win.focus();
        } else {
            alert('Please allow pop-up windows for this site');
        }
      }
    });
  } else if(originalStep === 'Cancel Report' || originalStep === 'Reject Report'){
    $('#reportId_Action').empty();
  }

  // leave this after the if conditions to allow removal of options where needed.
  generateSelectOptions (['Save and Approve'], $('#reportId_Action'))
  $('#reportId_Action').val('Save and Approve')

});






