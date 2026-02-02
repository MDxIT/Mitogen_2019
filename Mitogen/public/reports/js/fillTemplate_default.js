$(function () {
          var reportData = JSON.parse($("#jsonObject").val());
          console.log(reportData);

        var promiseArr = [Promise.resolve()]
        // This gets the 64bit images (if any) using the getSecureMedia ajax call and updates the imageResults object
          if(reportData.report.imageResults.length > 0){
            // Loop through our image objects to get actual images

            reportData.report.imageResults.forEach(function(item) {
              promiseArr.push(Promise.resolve().then(function() {
                console.log("token", item.secureToken);
                var imgData = {
                  "stepName": "getSecureMedia",
                  "token": item.secureToken
                }
                return Promise.resolve($.get("/uniflow", imgData)).then(function(imageArr) {
                  item.imageResult = '<' + imageArr[0] + ' src= "'+imageArr[1]+'" class="defaultReportImg"/>'
                });
              }))
            })
          }

      Promise.all(promiseArr).then(function(){

          // Get signature name, title, and image for use in report
          // Template should reference {{signatureText}}, {{signatureTitle}} and {{signatureImagePath}} to use
          var signatureName = $("#signatureName").val();
          var signatureTitle =$("#signatureTitle").val();
          var signatureImagePath = $("#signatureImagePath").val();

          reportData.report.signatureName = signatureName;
          reportData.report.signatureTitle = signatureTitle;
          reportData.report.signatureImagePath = signatureImagePath;

          // // reportDate
          // if(reportData.report.reportDate == "") {
          //      console.log('Date Format', dateFormat);
          //      var reportDate = $.datepicker.formatDate('mm/dd/yy', new Date());
          //      console.log("reportDate:" + reportDate);
          //      reportData.report.reportDate = reportDate;
          // }

          $("#jsonObject").val(JSON.stringify(reportData));

            //compile template
            var source = $("#template").html();
            var template = Handlebars.compile(source);

           // var template = Handlebars.templates['template1'];
            var data =  template(reportData);
          // make sure empty div of id=reportBody exists in template
            $("#reportBody").append(data);

            scriptSeparateFile();

       });

});
