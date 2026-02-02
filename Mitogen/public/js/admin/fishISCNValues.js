// Manage ISCN Values

function populateProbeOptions() {
 	$.getJSON('/uniflow?callback=?&stepName=Ajax+Get+FISH+Probes',{},function(data,status) {
  $.each(data, function(index, element) {
    elementOption = element.probe
    $('.optionSelect').append($('<option></option>')
    .attr("value",elementOption)
    .text(elementOption));
  });
});
};

$(document).ready(function() {
  populateProbeOptions();
	$('.hide').parent().addClass('hide');
	$('th:contains("Hidden")').addClass('hide');
  $('.hide').hide();

 });