$(function() {
          $('#pageHeaderFooterTemp').on("change", function() {

            let ajaxGetPageHeaderFooterTemplate = {
              stepName: 'ajaxGetPageHeaderFooterTemplate',
              pageHeaderFooterId: $(this).val()
            }

            $.getJSON('uniflow?', ajaxGetPageHeaderFooterTemplate).done(function (data) {

              $('#pageHeaderFooterTemp').val(data[0].id);
              $('.pageReportTitle').val(data[0].title);
              $('.pagePageNo').val(data[0].pageNumber);
              $('.pageSiteName').val(data[0].labAddress);
              $('.pageSiteAddress').val(data[0].labName);
              $('.pagePatientName').val(data[0].patientName);
              $('.pagePatientMRN').val(data[0].mrn);
              $('.pagePatientDOB').val(data[0].dob);


            }).fail(function (jqxhr, textStatus, error) {
              var err = "Request Failed: " + textStatus + ", " + error;
              console.log(err);
              alert(err);

            });
          });

          $("#saveReportPageHeaderFooter").on("click", function() {

                //ALWAYS get reportVersionId first before saving to tables - select id from reportDefinitionVersion where reportDefinitionId = recId
               //post header/footer selections to reportPageHeaderFooter
               //post pageHeaderFooterId to reportSettings
                    postObject = {
                        stepName: 'Save Report Page Header and Footer'
                        ,Submit:true
                        ,formNumber:0
                        ,pageHeaderFooterTemp: $('#pageHeaderFooterTemp').val()
                        ,pageHeaderFooterTempName: $('#pageHeaderFooterTempName').val()
                        ,pageReportTitle: $('.pageReportTitle').val()
                        ,pagePageNo: $('.pagePageNo').val()
                        ,pageSiteName: $('.pageSiteName').val()
                        ,pageSiteAddress: $('.pageSiteAddress').val()
                        ,pagePatientName: $('.pagePatientName').val()
                        ,pagePatientMRN: $('.pagePatientMRN').val()
                        ,pagePatientDOB: $('.pagePatientDOB').val()
                        ,recId: $('#recId').val()
                        // pass parameters here
                    }

                    let hasEmptyValue = 0;
                    $('.pageHeaderFooterRequired').each(function() {
                      if ($(this).val() == ''){
                        hasEmptyValue ++;
                      }
                    });

                    if ( $('#pageHeaderFooterTemp').val() == '' && $('#pageHeaderFooterTempName').val() == '' ){
                      hasEmptyValue++;
                    }

                    if ( hasEmptyValue == 0 ){

                     $.post('/uniflow', postObject)
                          .done(function(jqxhr, statusText)  {
                            console.log("statusText", statusText);
                            var postHtml = $.parseHTML(jqxhr);
                            var postError = checkPostError(postHtml);
                            console.log("postError", postError);
                            if (postError !== false) {
                              createSimpleModal('modalMessage', postError, 'Save Report Page Header and Footer Error');
                              let message = 'Save Report Page Header and Footer Error. Fill out all required fields and save again.';
                              failCallback(null, 'successDivPageHeaderFooter', message);
                            } else {  successCallback('successDivPageHeaderFooter', "** Report Page Header and Footer Successfully Saved.") }
                          })
                          .fail(function (jqxhr, textStatus, error) {
                              var err = "Request Failed: " + textStatus + ", " + error + ". Contact a system administrator.";
                              console.log(err);
                              createSimpleModal('modalMessage', err, 'Save Report Page Header and Footer Error');
                              failCallback(null, 'successDivPageHeaderFooter', err);
                          })
                          .always(function() {
                            console.log("saving report page header and footer");
                          });

                    } else {

                      createSimpleModal('pageHeaderFieldsError', 'Complete all required fields.', 'Missing Required Field');

                    }
        });

});