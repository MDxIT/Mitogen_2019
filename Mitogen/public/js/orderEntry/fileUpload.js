
$(document).ready(function() {
  $("th:contains('Hidden')").addClass("hide");
  $(".hide").hide();
  // preventReturnOnInput();
  // printBarcode('reqId', '#lastName, #firstName', '#mrn');


  var prefix = '#';
  var formType = $('#formType').val();
  var instance = $('#instance').val();
  var workflow = $('#workflow').val();
  var section = 'fileUpload';

  getAndProcessFormSettingsJson(formType, instance, workflow, prefix, section);

  // $('form #stepFormSubmitButton').click(function(event){
  //   event.preventDefault();

  //   var submitOk = true;
  //   if(typeof fileUploadOnSubmit !== 'undefined' && $.isFunction(fileUploadOnSubmit)) {
  //     if(! fileUploadOnSubmit()) {
  //       submitOk = false;
  //     }
  //   }

  //   if(submitOk == true) {
  //     $('form').submit();
  //   }

  // });

  
  convertOutputTableDateFormats('#fileUpload_previousFilesTable', $('#dateFormat').val());

  

});

function fileUploadOnSubmit() {
  var uploadedFilesArray = [];
  var uploadedDuplicates = [];
  var existingFilesArray = [];
  var duplicatesWithExisting = [];
  var missingFile;

  $('.MultiFile-title').each( function() {
    uploadedFilesArray.push(this.textContent);
  });

  $('.existingFiles').each( function() {
    existingFilesArray.push(this.textContent);
  });

  uploadedDuplicates = checkArrayForDuplicates(uploadedFilesArray);
  duplicatesWithExisting = compareArraysForDuplicates(uploadedFilesArray, existingFilesArray);


  $('.MultiFile-wrap').each( function() {
    if ( $(this).hasClass('required') ){
      if ( typeof $(this).children('.MultiFile-title').textContent == 'undefined') {
        missingFile = true;
      }
    }
  });

  if (uploadedDuplicates.length > 0) {
    alert("You have uploaded these files multiple times: " + uploadedDuplicates.toString());
    return false;
  } else if (duplicatesWithExisting.length > 0) {
    alert("These files have been previously uploaded: " + duplicatesWithExisting.toString());
    return false;
  } else if (missingFile) {
    alert("You are missing a required file.");
    return false;
  }  else {
    return true;
  }
}


