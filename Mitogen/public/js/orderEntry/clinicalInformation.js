$(document).ready( function() {
  $('.drugCombobox').combobox();

  hideColumns('#currentMedicationsTable', 'hideColumn');
  hideColumns('#problematicMedicationsTable', 'hideColumn');
  hideColumns('#drugAllergiesTable', 'hideColumn');


  $('.clinicalInformation_drugTable').each( function() {
    if($(this).children('tbody').children('tr:last').children().children('.drugId').val() == ''){
      $(this).hide();
    }

  });

  $('.drugCombobox').change( function() {
    var currentSelect = $(this).attr('id');
    var thisTable = currentSelect.replace('Select', 'Table');

    if($('#' + thisTable + ' tbody tr:last').children().children('.drugId').val() != ''){
      inputTableAddRow(thisTable);
    }
    addKeywordFunction($(this), thisTable);
    console.log(thisTable);
    $('#' + thisTable).show();
  });


  var formType = $('#formType').val();
  var instance = $('#instance').val();
  var workflow = $('#workflow').val();
  var prefix = '#'
  var section = 'clinicalInformation';

  if(instance == 'view') {
      $('#stepFormSubmitButton').hide();
  }

  getAndProcessFormSettingsJson(formType, instance, workflow, prefix, section);

  $('.hideOnReadOnly').each( function() {
    if( $(this).val() == 'true'){
      var classToHide;
      classToHide = $(this).attr('id');
      $('.'+classToHide).hide();
    }
  });
  $('.clincialCheckbox').change(function() {
    showCommentField($(this));
  });
  $('.clincialCheckbox').each(function() {
    showCommentField($(this));
  });

});

function showCommentField(checkboxClicked) {
  var thisId = checkboxClicked.attr('id');
  var commentid = thisId + 'Comments'
  if (checkboxClicked.prop('checked') == true) {
    $('#' + commentid).removeClass('hiddenOnLoad');
  } else {
    $('#' + commentid).addClass('hiddenOnLoad');
  }
}


function addKeywordFunction(keywordInput, tableId) {

  var keywordId = keywordInput.val();
  var drugName = keywordInput.children('option:selected').text();
  if (keywordId){

    $('#' + tableId + ' tbody tr:last .drugName').val(drugName);
    $('#' + tableId + ' tbody tr:last .drugId').val(keywordId);

    keywordInput.val('');
    keywordInput.focus();
  }

}

function clinicalInfoOnSubmit(){
  let allowSubmit = true;
  $('.drugSelection').each(function(i, item){
    let counter = 0;
    if($(item).hasClass("required")){
      $(item).find('.clinicalInformation_drugTable tbody tr').each(function(j, subitem){
        if($(subitem).find('[type="checkbox"]').prop("checked") === false && $(subitem).find('.drugName').val() != ""){
          counter++;
        }
      })
      if(counter < 1){
        allowSubmit = false;
        $(item).find('.drugRequiredError').remove()
        $(item).append('<li class="error drugRequiredError"> This value is required.</li>')
      } else {
        $(item).find('.drugRequiredError').remove()
      }

    }
  })
  return allowSubmit;
}


