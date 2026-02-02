$(document).ready(function() {

     // get and post Objects
       var callObject1= {
          "stepName": 'Ajax Get Table Example',
          "containerId": $("#hiddenContainerId").val()
        };

       var callObject2= {
          "stepName": 'Ajax Get JSON Example',
          "containerId": $("#hiddenContainerId").val()
        };

        postObject = {
            stepName: 'Ajax Post Example'
            ,Submit:true
            ,formNumber:0
            ,myPlate: $("#hiddenContainerId").val()
            ,myStatus: $("#plateStatus").val()
        }

       //gets the full table and returns to the form
        $("#getTable").on("click", function() {

                $('#myTable').load('/uniflow', callObject1 );

        });
        //gets the same table data as above but returns it in JSON format
        $('#getJSON').on("click", function() {

            $.getJSON('uniflow?', callObject2).done(function (data) {

                  $("#myJSON").html(JSON.stringify(data));

            });
        });
        //posts data from the form to the database and returns status message to user
       $("#postData").on("click", function() {

           $.post('/uniflow', postObject)
                .done(function(jqxhr, statusText)  {
                    $("#postStatus").html("<p>Post Status:" + statusText + " See containerProperties table.</p>");
                });

         });




});