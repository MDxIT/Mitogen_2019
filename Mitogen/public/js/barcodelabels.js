$(function() {
	$('.default').click(function() {
		$('.default').not(this).prop('checked', false);
	});
});
