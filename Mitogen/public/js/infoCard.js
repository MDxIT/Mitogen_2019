 $(function() {

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

         $('.blockData').each(function(){
               var el= $(this);
               var textLength = el.html().length;
                if (textLength > 20 && textLength < 50) {
                    el.css('font-size', '12px');
                }
                if (textLength > 50) {
                      // el.html. cutoff end and add ellipsis
                }
          });
         $('.infoNameBanner span').each(function(){
               var el= $(this);
               var textLength = el.html().length;
                if (textLength > 24) {
                    el.css('font-size', '14px');
                    console.log(el);
                    if (textLength > 34) {
                        //el.substring(0,34);
                        console.log(el);
                    }
                }
          });

});


