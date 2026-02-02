 $(function() {

            $( document ).tooltip();
            $(".orderCard").focus().blur();
            checkInfoNameBlockLengths('.orderCard');
            checkInfoBlockData('.orderCard', 20);

		    // navigate to Client step from order card
		    $(".goToSites").on("click", function() {
		        var siteId = $('#siteId').val()
		        var win = window.open('/uniflow?lastForm=Y&stepName=Clients&recId=' + siteId);
		        if (win) {
		            win.focus();
		        } else {
		            alert('Please allow pop-out tabs for this website');
		          }
		    });

		    // navigate to Contact Customer step from order card
		    $(".goToContactCustomer").on("click", function() {
		        var requestId = $('#requestId').val()
		        var win = window.open('/uniflow?lastForm=Y&stepName=Contact+Customer&recId=' + requestId);
		        if (win) {
		            win.focus();
		        } else {
		            alert('Please allow pop-out tabs for this website');
		          }
		    });
		    // navigate to Edit Order Form step from order card
		    $(".goToOrderForm").on("click", function() {
		        var requestId = $('#requestId').val()
		        var win = window.open('/uniflow?lastForm=Y&stepName=Order+Form&recId=' +requestId + '&nextStepInstance=QC');
		        if (win) {
		            win.focus();
		        } else {
		            alert('Please allow pop-out tabs for this website');
		          }
		    });

  });
