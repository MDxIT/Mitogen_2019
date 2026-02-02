
$(document).ready(function() {
  // preventReturnOnInput();
  // printBarcode('reqId', '#lastName, #firstName', '#mrn');

  var prefix = '.patientInfo_';
  var formType = $('#formType').val();
  var instance = $('#instance').val();
  var workflow = $('#workflow').val();
  var section = 'patientInformation';

  getAndProcessFormSettingsJson(formType, instance, workflow, prefix, section);

  $('#searchButton').click(function() {
    searchPatients();
  });
  $('#patientsCandidates').css({'max-height':'150px', 'overflow':'scroll'});


  $(".hideColumn").parent().hide();
  $('#patientsCandidates').hide();
  $('#clearPatient').click(function() {
    $('.clearPatient').val('');
    $('.clearPatientSelect').prop('checked', false);
    $('#patientsCandidates').hide();
    $('#patientsCandidates').css('display','none');
    $('#famIdUserInfo').hide();
    clearProband();
  });
  eth = $("#ethnicityList").val().split(',');
  choice = $("#ethnicity option");
  $('#ethnicity option:eq(0)').attr('selected',false);
  for ( var i = 0, l = choice.length, o; i <= l; i++ )
  {
    o = $('#ethnicity option:eq('+ i +')');
    if ( eth.indexOf(o.text()) != -1 )
    {
      $('#ethnicity option:eq(' + i + ')').attr('selected',true);
    }
  }
  $('#ethnicity option:eq(0)').attr('selected',false);
  $('#ethnicity option:eq(1)').attr('selected',false);
  $('#ethnicity option:eq(0)').prop('selected',false);
  $('#ethnicity option:eq(1)').prop('selected',false);
  $('#patientSamplesTable>tbody>tr>.col0>.text').change(function(){
    emptySampleRowtoNotHide = false;
    $('#patientSamplesTable>tbody>tr>.col0>.text').each(function(){
      if(!emptySampleRowtoNotHide && !$(this).val())
      {
        $(this).parent().parent().show();
        emptySampleRowtoNotHide = true;
      }
    });
  });

  var momentFormat = moment().toMomentFormatString($('#dateFormat').val())
  if(($(dob).val()).length != 0){
    $(dob).val(moment($(dob).val()).format(momentFormat))
  }

 // onclick="$(\'#newPatientId\').val(\'',p.patientId,'\');setPatient();"

  $(document).on('click', '.selectPatient', function() {
    var patientId = $(this).attr('patientId');
    setPatient(patientId);
    // Get Exisiting Probands
    getPatientProbands(patientId);
  });

  $('#famIdUserInfo').hide();
  $('#familyId').change(function() {
    toggleFamilyInfoMsg();
  });
});

function getPatientProbands(patientId) {
  //something should happen here evenutally
}

function searchPatients() {

  var momentFormat = moment().toMomentFormatString($('#dateFormat').val())
  // var dob = moment($('#patientDOB').val(), momentFormat).format('YYYY-MM-DD');
  var dob = moment($('#patientDOB').val()).format(momentFormat);
  $('#patientsCandidates').load('/uniflow',
    {stepName: 'Ajax Patients Search Server',
    firstName: $('#patientFirstName').val(),
    lastName: $('#patientLastName').val(),
    DOB: dob,
    GovtId: $('#patientGovtId').val(),
    geneticGender: $('#patientGeneticGender').val(),
    MRN: $('#patientMRN').val(),
    patientId: $('#txtSearchPatientId').val(),
    familyId: $('#txtSearchFamilyId').val(),
    patientSearchSelectColumns: $('#patientSearchSelectColumns').val()}
  );
  $('#patientsCandidates').show();
};

function setPatient(patientId) {
  $('.clearPatient').val('');
  $('.clearPatientSelect').prop('checked', false);
  $.getJSON('/uniflow?callback=?&stepName=Ajax+Patient+Server&patientId=' + patientId,{},
      function(data,status) {
      $('#patientsCandidates').hide();
      $('#patientInfo_patientId').val(data[0].Id);
      $('.patientInfo_firstName').val(data[0].firstName);
      $('.patientInfo_lastName').val(data[0].lastName);
      $('.patientInfo_middleName').val(data[0].middleName);
      var dateFormat = moment().toMomentFormatString($('#dateFormat').val());
      var dob = moment(data[0].dob).format(dateFormat);
      $('.patientInfo_dob').val(dob);
      $('.patientInfo_govtId').val(data[0].govtId);
      $('.patientInfo_govtIdValue').val(data[0].govtIdValue);
      $('.patientInfo_geneticGender').val(data[0].geneticGender);
      $('.patientInfo_genderId').val(data[0].genderId);
      $('.patientInfo_mrn').val(data[0].mrn);
      let familyIdValue = data[0].familyId;
      $('.patientInfo_familyId').val(familyIdValue);
      $('#familyId').attr("origValue",familyIdValue);
      $('#famIdUserInfo').hide();
      eth = data[0].ethnicity.split(',');
      choice = $("#ethnicity option");
      $('#ethnicity option:eq(0)').attr('selected',false);
      for ( var i = 0, l = choice.length, o; i <= l; i++ )
      {
        o = $('#ethnicity option:eq('+ i +')');
        if ( eth.indexOf(o.text()) != -1 )
        {
          $('#ethnicity option:eq(' + i + ')').attr('selected',true);
        }
      }
      $('#ethnicity option:eq(0)').attr('selected',false);
      $('#ethnicity option:eq(1)').attr('selected',false);
      $('#ethnicity option:eq(0)').prop('selected',false);
      $('#ethnicity option:eq(1)').prop('selected',false);
      $('.patientInfo_addressLine1').val(data[0].address1);
      $('.patientInfo_addressLine2').val(data[0].address2);
      $('.patientInfo_city').val(data[0].city);
      $('.patientInfo_state').val(data[0].state);
      $('.patientInfo_postalCode').val(data[0].postalCode);
      $('.patientInfo_country').val(data[0].country);
      $('.patientInfo_homePhoneCountryCode').val(data[0].homePhoneCountryCode);
      $('.patientInfo_homePhone').val(data[0].homePhone);
      $('.patientInfo_workPhoneCountryCode').val(data[0].workPhoneCountryCode);
      $('.patientInfo_workPhone').val(data[0].workPhone);
      $('.patientInfo_mobilePhoneCountryCode').val(data[0].mobilePhoneCountryCode);
      $('.patientInfo_mobilePhone').val(data[0].mobilePhone);
      $('.patientInfo_email').val(data[0].email);
    }
  );
}

function toggleFamilyInfoMsg()
{
  let origPatFamilyId=$('#familyId').attr("origValue");
  if (origPatFamilyId=='') {
    return; 
  }
  
  let currPatFamilyId=$('#familyId').val();
  if(origPatFamilyId != currPatFamilyId){
    $('#famIdUserInfo').show();
  } else{
    $('#famIdUserInfo').hide();
  }

}
