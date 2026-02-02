$(document).ready(function(){
  $('.hiddenOnLoad').hide();

  if($("#mmId").val() != '_NEW'){
    $("#newCode").prop("readonly", true);
    $('#newCode').removeClass('required');

  } else {
    $('#duplicateVertical').hide();
  }

  // handles user ability to change MM Code
   $("#duplicate").on("click", function() {
      if( $("#duplicate").is(':checked') ) {
          $("#newCode").prop("readonly", false);
          $('#newCode').addClass('required');
          }
          else {
            $("#newCode").prop("readonly", true);
            $("#newCode").val($("#oldCode").val());
            $('#newCode').removeClass('required');
          }
   });

  //Adding rows to instructions, reagents and controls
    //Duplicated code because buttons don't allow for class assignments
    $('#reagents').click( function() {
      var tableName = $(this).attr('id') + 'Table';
      inputTableAddRow(tableName, true);
      $('.resourceSelect').on("change", function(){
        console.log('change');
        fillThisUnit( $(this) );
  });
    });
    $('#controls').click( function() {
      var tableName = $(this).attr('id') + 'Table';
      inputTableAddRow(tableName, true);
      $('.resourceSelect').on("change", function(){
        console.log('change');
        fillThisUnit( $(this) );
      });
    });
    $('#instructions').click( function() {
      var tableName = $(this).attr('id') + 'Table';
      inputTableAddRow(tableName, true);
    });

  $('.resourceSelect').on("change", function(){
    console.log('change');
    fillThisUnit( $(this) );
  });

  $('#keywordCombobox').combobox();
  $('#addKeywordToTableButton').click( function() {
   addKeywordFunction($('#keywordCombobox').val());
  });
  $('#deleteKeywords').click( function() {
   deleteRow('keywords');
  });

});

 function fillThisUnit(input) {
   var value = input.val();
   console.log(value);
   var inputElem = input.parent().find('input[autocomplete]');
   var getData = {
     "stepName": "Ajax Get Unit For Reagent",
     "reagentType": value
   };
   inputElem.css('border-color', 'initial');
   if(value == '') {
     alert('The reagent you have entered does not exist.'+
       '\nSelect an existing reagent or add a new reagent using the Reagents module.');
   } else {
     inputElem.css('border-color', 'initial');

     $.getJSON('/uniflow?callback=?', getData)
     .done(function(data) {
       console.log(data[0].unit);
       input.parents('td').siblings('.col3').children('.units').val(data[0].unit);
     });
   }
 }

 function deleteRow(tableId) {
   var deletedCount = 0;
   $('#'+tableId+' input[type=checkbox]').each(function(){
     if (this.checked) {
       deletedCount++;
       $(this).parent().parent().remove();
     } console.log(deletedCount);
   });
   if(deletedCount > 0) {
     //update the types and input names to be in the correct order
     var rowCount = 0;
     $('#'+tableId+' tbody tr').each(function(i){
       rowCount++;
       $(this).find('input').each(function(){
         if($(this).attr('name')) {
           var nameParts = $(this).attr('name').split('_');
           var name = nameParts[0]+'_'+i+'_'+nameParts[2];
           $(this).attr('name', name);
         }
       });
     }); console.log(rowCount); console.log(tableId);
     $('input[name="' + tableId + '_numRows"]').val(rowCount);
   }
 }

 function addKeywordFunction(keyword) {
   if (keyword){
     console.log('keyword: '+ keyword);
     var nextRowId = $('#keywords tbody tr').length;
     var newRow = $('<tr class="stdRow r'+nextRowId+'"></tr>');
     $('<td class="stdTd col0"><input onfocus="select()" type="checkbox" name="keywords_'
       +nextRowId+'_1" class="keywordCheckbox" value="false" tabindex="1"></td>' +
       '<td class="stdTd col1"><input type="text" name="keywords_'+nextRowId+'_2" style="border:none; background-color:transparent;" value="'+ keyword +'" readonly></td>').appendTo(newRow);
     newRow.appendTo('#keywords tbody');
     //Update the numRows so it can be processed
     $('input[name="keywords_numRows"]').val(nextRowId+1);

     $('.keywordCombobox').val('');
     $('.keywordCombobox').focus();
   }
 }