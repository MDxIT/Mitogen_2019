/**
 * UNIFlow Platform
 * JavaScript Main
 *
 * system exception handling
 *
 * @author Harley Newton
 * @copyright 2017 Sunquest Information Systems
 * @version 0.1.20170519
 */

/**
 * Handle Forgot Password Form
 */
function forgotPasswordForm() {
	$('#forgotPasswordLink').click(function(ev) {
		ev.preventDefault();
		$('#isForgotPassword').val('forgot-password');

		var logoutUrl = "/uniflow?logout=logout";
		var dialog = $('#forgotPasswordDiv').dialog({
			"title": "Forgot Password",
			"modal": true,
			"width": 600,
			"height": 'auto',
			"buttons": {
				"Cancel": function() {
					$('#isForgotPassword').val('');
					dialog.dialog("close");
				},
				"Submit": function() {
					var username = $('#username').val().trim();
					var emailAddress = $('#emailAddress').val().trim();

					if (username == '') {
						$('#username').css({"border": "1px solid red"}).focus();
						return false;
					}
					if (emailAddress == '') {
						$('#emailAddress').css({"border": "1px solid red"}).focus();
						return false;
					}

					var tmppw = createRandomId(12);
					var postData = {
						"stepName": 'POST Forgot Password',
						"userId": "4bc24939ff98dbb663",
						"password": "fb53c3ee81650efb1e",
						"txt_password": tmppw,
						"New Password": tmppw,
						"Submit": true,
						"formNumber": 0,
						"User Id": username,
						"emailAddress": emailAddress
					};
					$.post('/uniflow', postData)
					.done(function(data) {
						var postHtml = $.parseHTML(data);
						var postError = checkPostError(postHtml);
						if (postError !== false) {
							$('#errMsg').css({"color": "red"}).text(postError).show();
							return false;
						}
						else {
							window.location = logoutUrl;
						}
					})
					.fail(function(jqxhr, textStatus, error) {
						var err = "POST Request Failed: " + textStatus + ", " + error;
						console.log(err);
						window.location = logoutUrl;
					});
				}
			}
		});
	});

	$('#loginForm').submit(function(ev) {
		if ($('#isForgotPassword').val() == 'forgot-password') {
			ev.preventDefault();
		}
	});
}

/**
 * Handle System Exception Form
 */
function systemExceptionForm() {
	$(function() {
		$('#systemExceptionForm').submit(function(ev) {
			ev.preventDefault();
		});

		var url = window.location;
		$('#exceptionText').val($('#exceptionMessage').text().trim());
		$('#system').val(url);

		var errorStepName = $('#errorStepName').val();
		var errorUrl = $('#errorUrl').val();
		var backUrl = '/uniflow?stepName=' + encodeURIComponent(errorStepName);
		$('#stepName').val(errorStepName);

		$('#goBack').click(function() {
			window.location = backUrl;
		});

		$('#sendEmail').click(function(ev) {
			var time = $('#time').val();
			var exceptionText = $('#exceptionText').val();
			var system = $('#system').val();
			var errorUserName = $('#errorUserName').val();
			var userEmail = $('#userEmail').val();

			var postData = {
				"stepName": 'Send Error Notification',
				"Submit": true,
				"formNumber": 0,
				"system": system,
				"exceptionText": exceptionText,
				"errorStepName": errorStepName,
				"time": time,
				"errorUserName": errorUserName,
				"userEmail": userEmail
			};
			$.post('/uniflow', postData)
			.done(function(data) {
				var postHtml = $.parseHTML(data);
				var postError = checkPostError(postHtml);
				if (postError !== false) {
					alert(postError);
				}
				else {
					window.location = backUrl;
				}
			})
			.fail(function(jqxhr, textStatus, error) {
				var err = "POST Request Failed: " + textStatus + ", " + error;
				console.log(err);
				alert(err);
			});
		});
	});
}

$(document).ready(function() {
	$('.queueCount').removeAttr('href');
})
