$(document).ready(function() {
  $('#stepFormSubmitButton').val('Save');
  $(".tabs").tabs();
  $(".content").css("padding", "20px");
  var tableId = '';
  var step = $('#step').val();
  var buttonValue = '';
  var lookupStep = '';
  if (step == 'Physicians') {
    tableId = 'addNew';
    buttonValue = 'Add Client';
    lookupStep = 'Clients';
  } else if (step == 'Clients') {
    tableId = 'linkedPhysicians';
    buttonValue = 'Add Physician';
    lookupStep = 'Physicians';

  // reorganize details table
  $('#siteDetailsMainTable').hide();
  $('#siteDetailsMainTable tbody tr').each(function() {
    var thisDetail = $(this).children('td').first().text();
    if(thisDetail == 'Client Name' ||
       thisDetail == 'Timezone' ||
       thisDetail == 'Date Format' ||
       thisDetail == 'Language') {
      $('#siteGeneral').append('<tr>' + $(this).clone().html() + '</tr>');
      $(this).remove();
    } else if (thisDetail == 'Address 1' ||
       thisDetail == 'Address 2' ||
       thisDetail == 'State' ||
       thisDetail == 'City' ||
       thisDetail == 'Postal Code' ||
       thisDetail == 'Country') {
      $('#siteAddress').append('<tr>' + $(this).clone().html() + '</tr>');
      $(this).remove();
    } else {
      $('#siteNumbers').append('<tr>' + $(this).clone().html() + '</tr>');
      $(this).remove();
    }
  });
  }
  hideColumns('#' + tableId, 'hideColumn');
  hideColumns('#physicianSites', 'hideColumn');
  hideColumns('#inactiveSitesTable', 'hideColumn');
  $('#' + tableId + ' tfoot').append('<tr><td colspan="3">'+
                                    '<input type="button" value="'+ buttonValue +'" class="addRow" /></td>'+
                                    '<td style="text-align: center;" colspan="5"></td></tr>');


  $('#newOrganization').parent().hide();
  $('#organization').change(function() {
    if($(this).val() == 'Add New') {
      $('#newOrganization').parent().show();
      $('#newOrganization').select();
      $('#newOrganization').focus();
    } else {
      $('#newOrganization').parent().hide();
    }
  });

  $(document).on('change',
                  '.selectNew',
                  function() {
                    var currentLink = $(this);
                    var siteId = $(this).val();
                    var siteLink = $(this).parent().siblings().children('a');
                    siteLink.attr('href', '/uniflow?lastForm=Y&stepName='+ lookupStep +'&recId=' + siteId);
                    siteLink.text(siteId);
                    $(this).addClass('current');

                    // prevent duplicate selection
                    $('.selectNew:not(.current)').each(function() {
                      if($(this).val() == siteId) {
                        alert('This physician - site link has already been created.');
                        currentLink.val('');
                        currentLink.parent().siblings().children('a').attr('href','');
                        currentLink.parent().siblings().children('a').text('');;
                      }
                     });
                    $(this).removeClass('current');
                  });

  $(document).on('click',
                  '.addRow',
                  function() {
                    inputTableAddRow(tableId);
                    $('#' + tableId + ' tbody tr').last().children('td').each(function() {
                      $(this).children().val('');
                      $(this).children('a').attr('href','');
                      $(this).children('a').text('');
                      $(this).children().removeClass('current');
                    })
                  });
});
