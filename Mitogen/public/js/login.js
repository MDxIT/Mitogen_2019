/**
 * Handle login form
 */
$(function() {
	$('form').submit(function(ev) {
		if (! $(this).parsley().isValid()) {
			ev.preventDefault();
		}
	});
});
