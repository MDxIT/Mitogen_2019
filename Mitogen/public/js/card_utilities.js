
function checkInfoNameBlockLengths(cardClass) {

           $(cardClass+ ' .infoNameBlock span').each(function(){
               var container = $(this).parent();
               var el= $(this);
               var elText = $(this).text();
               var textLength = el.text().length;

               if (el.width() > container.width()) {
                    var fontSize = parseInt(el.css('font-size'));
                    var newFontSize = fontSize - 3;
                    el.css('font-size', newFontSize+'px');
                    elNewWidth = el.width();

                    if(elNewWidth > container.width()){
                      var oneThird = parseInt(textLength/4);
                      var removeCharsIndex = parseInt(textLength - oneThird);
                      var newText = elText.substring(0,removeCharsIndex);
                      $(this).text(newText).append('<span title= "'+elText+'">&nbsp<i class="fas fa-ellipsis-h"></i></span>');
                    }
                }
          });
}

function checkInfoBlockData(cardClass, cutOffTextLength) {
        var reduced = false;
        $(cardClass + ' .blockData > span').each(function(){
               var container = $(this).parent();
               var el= $(this);
               var elText = $(this).text();
               var textLength = el.text().length;

               if (textLength >= cutOffTextLength) {
                   if (reduced != true) {
                      var fontSize = parseInt(el.css('font-size'));
                      var newFontSize = fontSize - 3;
                      $(cardClass + ' .blockData > span').css('font-size', newFontSize+'px');
                    }
                    var oneThird = parseInt(textLength/3);
                    var removeCharsIndex = parseInt(textLength - oneThird);
                    var newText = elText.substring(0,removeCharsIndex);
                    $(this).text(newText).append('<span title= "'+elText+'">&nbsp<i class="fas fa-ellipsis-h"></i></span>');
                    reduced = true;
                 }
        });
}
