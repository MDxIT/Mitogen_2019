 $(function() {

            $( document ).tooltip();
            $(".patientCard").focus().blur();
            var patientId = $('#cardPatientId').text();

             $(".insuranceEdit").on("click", function() {
                var win = window.open('/uniflow?lastForm=Y&stepName=Patients&recId='+ patientId, '_blank');
                 if (win) {
                    //Browser has allowed it to be opened
                    win.focus();
                    //Focus on primaryInsuranceList, most browsers will ONLY focus on window and not to the insurance list, user will have to scroll down to edit insurance of patient
                    win.document.getElementById("editInsurance").show();
                    win.document.getElementById("primaryInsuranceList").focus();

                } else {
                    //Browser has blocked it
                    alert('Please allow pop-out tabs for this website');
               }
            });

            checkInfoNameBlockLengths('.patientCard');
            checkInfoBlockData('.patientCard', 18);
});

