$(document).ready(function() {


  var formType = $('#formType').val();
  var instance = $('#instance').val();
  var workflow = $('#workflow').val();
  var prefix = '#'
  var section = 'proband';

  getAndProcessFormSettingsJson(formType, instance, workflow, prefix, section);


  // Disable functionality for view order
  if($('#instance').val() == 'View') {
    $('#probandSearchSection').hide();
    $('#makePatientProband').hide();
  }

  $('#noResultsMessage').hide();
  hideColumns('#proband', 'hideColumn');

  $('.proband_relationship').each(function() {
    makeTestsRequired($(this));
  });

  // DELETE ROW
  $(document).on('click', '.proband_deleteProbandLink', function() {
    deleteProband($(this));
  });

  // Get initial relationship, before change
  var relationshipInitial = '';
  $(document).on('click', '.proband_relationship', function() {
    relationshipInitial = $(this).val()
  });

  $(document).on('change', '.proband_relationship', function() {
    var $relationship = $(this);
    var relationship = $(this).val();
    var $relationshipSiblings = $(this).parent().siblings();
    var $thisRow = $(this).parent().parent('tr');

    if(relationship == 'self') {
      makeSelfProband($relationship);
      $relationship.removeAttr('patient');
      $relationshipSiblings.children('.proband_deleteProbandLink').prop('checked', false);
      manageTestForProband($thisRow, relationship, '', '');
    } else {
      $relationshipSiblings.children('.proband_deleteProbandLink').prop('checked', false);
      if(relationshipInitial == 'self') {
        // when changing from self, clear all fields & remove required test
        $relationshipSiblings.children('.proband_clear').val('');
        $relationship.parent().siblings('td:gt(3)').text('');
        $relationshipSiblings.children('.proband_deleteProbandLink').prop('checked', true);
        deleteProband($relationshipSiblings.children('.proband_deleteProbandLink'));
        manageTestForProband($thisRow, relationship, '', '');
        if(relationship != '') {
          $relationship.val('');
          alert('Please use the search to find a proband before assigning the relationship');
        }
      }
      if(relationship == ''){
        $relationship.removeAttr('patient');
        // manageTestForProband($thisRow, relationship, '', '');
      }
      // manage relationships for same proband
      if(relationship != ''){
        var patientId = $relationship.parent('td').siblings().last().text();
        $relationship.attr('patient', patientId);
      }
      if($('[patient = "' + patientId +'"]').length > 1) {
        var relationshipMissmatch = 'NO';
        $('[patient = "' + patientId +'"]').each(function() {
          if($(this).val() != relationship) {
            relationshipMissmatch = 'YES'
          }
        });
        if(relationshipMissmatch == 'YES') {
          $relationship.val('');
          alert('Same proband cannot have different relationships to patient.');
          $relationship.removeAttr('patient');
        }
      }
    }

  });
  // search probands

  $('#searchProbandButton').click(function() {
    searchProbands();
  });

  $('#clearProbandSearch').click(function() {
    $('.clearProband').val('');
    $('#probandCandidates').children().remove();
    $('#probandCandidates').hide();
    $('#noResultsMessage').hide();
  });

  $('#makePatientProband').click(function() {
    if($('#proband tbody tr:last').children().children('.proband_relationship').val() != '' || $('#proband tbody tr:last').children().children('.proband_id').val() != '') {
      inputTableAddRow('proband', true);
    }
    $('#proband tbody tr:last').children().children('.proband_relationship').val('self');
    var relationship = $('#proband tbody tr:last').children().children('.proband_relationship');
    makeSelfProband(relationship);
    manageTestForProband($('#proband tbody tr:last'), relationship.val(), '', '');
  });

  $(document).on('change', '.proband_tests', function() {
    var thisTest = $(this).val();
    var thisTestCount = $('.proband_tests option[value="'+thisTest+'"]:selected').length;
    if(thisTestCount > 1) {
      alert('You have already selected a proband for this test.');
      $(this).val('');
    }
  });

  $(document).on('click', '.selectProband', function() {
    var probandInfoArray = [];
    $(this).parent('td').siblings('td').each(function() {
      probandInfoArray.push($(this).text());
    });

    var thisTest = probandInfoArray[1];
    var thisTestCount = $('.proband_tests option[value="'+thisTest+'"]:selected').length;
    if(thisTestCount > 0) {
      alert('You have already selected a proband for this test.');
      $(this).prop('checked', false);
    } else {
      $(this).hide();
      if($('#proband tbody tr:last').children().children('.proband_relationship').val() != '' || $('#proband tbody tr:last').children().children('.proband_id').val() != '') {
        inputTableAddRow('proband', true);
      }
      var $lastRow = $('#proband tbody tr:last');
      $lastRow.children('.col3').children('ul').remove();
      $lastRow.children().children('.proband_relationship').attr('required', 'required').parsley();
      $lastRow.children().children('.proband_relationship').addClass('required');
      $lastRow.children().children('.proband_deleteProbandLink').prop('checked',false);
      var i = 3;
      $('#proband tbody tr:last').children('td:gt(4)').each(function() {
        $(this).text(probandInfoArray[i]);
        i++;
      });
       manageTestForProband($lastRow, '', probandInfoArray[1], probandInfoArray[0]);
       $lastRow.children().children('.proband_id').val(probandInfoArray[2]);
       $lastRow.children().children('.proband_relationship').focus();
      }
  });


  convertOutputTableDateFormats('#proband', $('#dateFormat').val());

});

function searchProbands() {
  var momentFormat = moment().toMomentFormatString($('#dateFormat').val())
  var dob = moment($('#probandDOB').val(), momentFormat).format('YYYY-MM-DD');
  $('#probandCandidates').load('/uniflow',
    {
      stepName: 'Ajax Proband Search Server',
      probandSelectColumns: $('#probandSelectColumns').val(),
      currentPatientId: $('#patientInfo_patientId').val(),
      lastName: $('#probandLastName').val(),
      firstName: $('#probandFirstName').val(),
      DOB: dob,
      MRN: $('#probandMRN').val(),
      geneticGender: $('#probandGeneticGender').val(),
      patientId: $('#probandPatientId').val(),
      testCode: $('#probandTests').val()
      }, function() {
        convertOutputTableDateFormats('#probandSearchResults', $('#dateFormat').val());
        $('#probandSearchResults tr').each(function() {
          $(this).children('th:eq(2)').hide();
          $(this).children('th:eq(3)').hide();
          $(this).children('td:eq(2)').hide();
          $(this).children('td:eq(3)').hide();
        });
        if($('#probandSearchResults tbody tr').length == 0) {
          $('#noResultsMessage').show();
          $('#probandCandidates').hide();
        } else {
          $('#probandCandidates').show();
          $('#noResultsMessage').hide();
        }
      }
  );
};

function makeSelfProband(relationship) {
  var probandInfoArray = [];
  probandInfoArray.push($('#lastName').val());
  if($('#show_firstName').val() == 'true') {
    probandInfoArray.push($('#firstName').val());
  }
  if($('#show_dob').val() == 'true') {
    probandInfoArray.push($('#dob').val());
  }
  if($('#show_mrn').val() == 'true') {
    probandInfoArray.push($('#mrn').val());
  }
  if($('#show_geneticGender').val() == 'true') {
    probandInfoArray.push($('#geneticGender').val());
  }
  probandInfoArray.push($('#patientInfo_patientId').val());

  var i = 0;
  relationship.parent().siblings('td:gt(3)').each(function() {
    $(this).text(probandInfoArray[i]);
    i++;
  });
  relationship.parent().siblings().children('.proband_id').val('');
}

function makeTestsRequired(relationship) {
  if(relationship.val() != '') {
    relationship.parent().siblings().children('.proband_tests').addClass('required');
    relationship.parent().siblings().children('.proband_tests').attr('required','required').parsley();
  } else {
    relationship.parent().siblings().children('.proband_tests').removeClass('required');
    relationship.parent().siblings().children('.proband_tests').removeAttr('required');
  }
}

function updatePanelsForProband() {
    // get datatable object
    let panelsTable = $('#panels').DataTable();
    let testCounter = 1
    let testCodeArray = [];
    panelsTable.rows().every( function ( rowIdx, tableLoop, rowLoop ) {
        let checkbox = $(panelsTable.cell( rowIdx, 0 ).data());
        if(checkbox.val() === "true"){
            let testCode = $(panelsTable.cell( rowIdx, 4 ).data()).val();
            testCodeArray = testCodeArray.concat(testCode.split('|'));
        }
    });
    let optionsStringArr = testCodeArray.map(function(optionPair){
      return {
        "name": optionPair.split('^')[1],
        "code": optionPair.split('^')[0]
      };
    }).filter(function(item, index, array){
      return array.map(function (mapItem) {
        return mapItem["code"];
      }).indexOf(item["code"]) === index;
    }).map(function(value, index) {
      return '<option testcount="' + ( index + 1 ) + '" value="' + value.code + '">' + value.name + '</option>';
    });

    $('.probandTestsAvailable').each(function(){
      let origVal = $(this).val()
      $(this).children('option').remove();
      $(this).append('<option value=""></option>');
      $(this).append(optionsStringArr.join(''))
      $(this).val(origVal)
    })
}

function getPatientProbands(patientId) {
  var getData =  {
    "stepName": 'Ajax Search Patient Probands',
    "patientId": patientId
  };
  var lastRow;
  clearProband();
  $.getJSON("/uniflow?callback=?", getData)
    .done( function(data, status) {

      // get variable column order
      var variableColumnArray = $('#probandVariableColumnOrder').val().split('|');
      var variableColumnArray = variableColumnArray.filter(function(v){return v!==''});
      
      for(var i = 0; i < data.length; i++)
      {
        if($('#proband tbody tr:last').children().children('.proband_relationship').val() != '') {
          inputTableAddRow('proband', true);
        }
        lastRow = $('#proband tbody tr:last');
        lastRow.show();
        // set proband values for static column
        lastRow.children('td:eq(1)').children().val(data[i].relationship);
        lastRow.children('td:eq(2)').children().val(data[i].probandLinkId);
        if(lastRow.children('td:eq(3)').children().children('[value="' + data[i].testCode + '"]').length == 0) {
          $('.probandTestsAvailable').append('<option removeAfterLoad="YES" testcount="1" value="' + data[i].testCode + '">' + data[i].name + '</option>');
        }
        lastRow.children('td:eq(3)').children().val(data[i].testCode);
        lastRow.children('td:eq(4)').children().val(data[i].probandId);
        lastRow.children('td:eq(5)').text(data[i].lastName);

        var ii;
        var n;
        for(ii=0; ii < variableColumnArray.length; ++ii ) {
          n = +ii + 6;
          if(variableColumnArray[ii] == 'firstName') {
            lastRow.children('td:eq('+ n +')').text(data[i].firstname);
          }
          if(variableColumnArray[ii] == 'dob') {
            lastRow.children('td:eq('+ n +')').text(data[i].dob);
          }
          if(variableColumnArray[ii] == 'mrn') {
            lastRow.children('td:eq('+ n +')').text(data[i].mrn);
          }
          if(variableColumnArray[ii] == 'geneticGender') {
            lastRow.children('td:eq('+ n +')').text(data[i].geneticGender);
          }
        }
        n = +1+n;
        lastRow.children('td:eq('+ n +')').text(data[i].patientId);
      }

      convertOutputTableDateFormats('#proband', $('#dateFormat').val());
    }
  );
}

function clearProband() {
  // CLEAR PREVIOUSLY LINKED PROBANDS
  $('#proband .proband_relationship').val('');
  $('#proband .proband_tests').val('');
  $('#proband .proband_tests').siblings('span').remove();
  $('#proband .proband_relationship').removeAttr('required');
  $('#proband .proband_relationship').removeClass('required');
  $('#proband .proband_tests').removeAttr('required');
  $('#proband .proband_tests').removeClass('required');
  $('#proband .proband_deleteProbandLink').prop('checked', false);
  $('#proband tbody tr').hide();
  inputTableAddRow('proband', true);
  $('#proband tbody tr:last').show();
}

function manageTestForProband(row, relationship, testValue, testName) {

  row.children().children('.proband_tests').val(testValue);
  row.children().children('.proband_tests').parent().children('span').remove();
  //SELF
  if(relationship == 'self') {
    row.children().children('.proband_tests').show();
    row.children().children('.proband_tests').attr('required', 'required');
    row.children().children('.proband_tests').addClass('required');
  //NOT SELF
  } else {
    row.children().children('.proband_tests').hide();
    row.children().children('.proband_tests').parent().prepend('<span>' + testName + '</span>');
    row.children().children('.proband_tests').removeAttr('required');
    row.children().children('.proband_tests').removeClass('required');
  }
}

function deleteProband($deleteBox) {
  if($deleteBox.prop('checked') == true) {
    $deleteBox.parent().siblings().children('.proband_relationship, .proband_id').val('');
    $deleteBox.parent().siblings().children('.proband_relationship').removeAttr('required');
    $deleteBox.parent().siblings().children('.proband_relationship').removeClass('required');
    $deleteBox.parent().siblings().children('.proband_relationship').removeClass('patient');
    $deleteBox.parent().siblings().children('.proband_tests').hide();
    $deleteBox.parent().siblings().children('.proband_tests').val('');
    $deleteBox.parent().siblings().children('.proband_tests').removeAttr('required');
    $deleteBox.parent().siblings().children('.proband_tests').removeClass('required');
    if( $('#proband >tbody > tr:visible').length == 1) {
      $deleteBox.prop('checked', false);
      $deleteBox.parent().siblings().children('.proband_tests').show();
      $deleteBox.parent().siblings('.col5, .col6, .col7, .col8, .col9, .col10').html('');
    } else {
      $deleteBox.parent().parent().hide();
    }
  }
}