$(document).ready(function() {
  $('#stepFormSubmitButton').val('Save');
  hideColumns('#physicianSites', 'hideColumn')
  $('#physicianSites tfoot').append('<tr><td colspan="3">'+
                                    '<input type="button" value="Add Site" class="siteAdd" /></td>'+
                                    '<td style="text-align: center;" colspan="5"></td></tr>');
  $(document).on('change',
                  '.selectSite',
                  function() {
                    var siteId = $(this).val();
                    var siteLink = $(this).parent().siblings('.col1').children('a');
                    siteLink.attr('href', '/uniflow?lastForm=Y&stepName=Clients&recId=' + siteId);
                    siteLink.text(siteId);
                  });
  $(document).on('click',
                  '.siteAdd',
                  function() {
                    inputTableAddRow('physicianSites');
                    $('#physicianSites tbody tr').last().children('td').each(function() {
                      $(this).children().val('');
                      $(this).children('a').attr('href','');
                      $(this).children('a').text('');
                    })
                  });
});