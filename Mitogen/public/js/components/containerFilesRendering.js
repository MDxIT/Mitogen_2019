$(document).ready(function() {
    $(document).on("click", ".existingFiles", function() {
        let fileURL = $(this).attr('data-url').toString().trim();
        let hrefVal = $(this).attr('href').toString().trim();
        if(hrefVal === '#'){
            getSecureImageByURL(fileURL);
        } 
    });

    if($('#docHere').val() === 'true'){
        $("th:contains('Remove')").addClass("hide");
        $(".hide").hide();
        $('.removeImage').parent().hide();
    }

});



function getSecureImageByURL(fileURL){
    var imgData = {
      "stepName": "getSecureMediaToken",
      "fileURL": fileURL
    };

    let fileName = fileURL.replace(/^.*[\\\/]/, '');
    let lastFourDig = fileName.slice(-4);

    return Promise.resolve($.getJSON("/uniflow", imgData)).then(function(data,status){

        let imgDataToken = {
          "stepName": "getSecureMedia",
          "token": data[0].secureToken
        };

        let imageResult = "";
        return Promise.resolve($.get("/uniflow", imgDataToken)).then(function(imageArr) {
            let numberImageViews = $('.imageVeiw').length;

            if(lastFourDig === '.pdf'){
                imageResult = "<" + imageArr[0] + " style='min-width:675px; min-height:700px;' src= '"+imageArr[1]+"'/>";
            } else {
                imageResult = "<" + imageArr[0] + " src= '"+imageArr[1]+"'/>";
            }

            let divText = "<div id='imageVeiw' class='imageVeiw'>" + imageResult + "</div>";

            let params = 'width=' + 685;
                params += ', height=' + (screen.height * 0.8);
                params += ', top=25, left=300, bottom=25';
                params += ', location=no,menubar=no,toolbar=no';
            let myWindow = window.open('','',params);
            let doc = myWindow.document;
            doc.open();
            doc.write(divText);
            doc.close();
            $('.imageVeiw').children('embed').css({
                'width': '1000px',
                'height': '1000px'
            });
        });

    });
    
}


