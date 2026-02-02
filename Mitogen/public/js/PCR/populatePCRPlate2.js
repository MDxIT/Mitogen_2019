 $(document).ready(function() {   

  var step = 'Create Resplex Batch and Traymap';
  var batchSize = $('#batchSize').val(); 
  var plateMap = $('#plateMap').val(); 

     // get containers to populate plate 
     $.getJSON('/uniflow?callback=?&stepName=Ajax+Get+Batch+List+for+PlateMap&step='+ step + '&batchSize=' + batchSize,{},
    function(data,status) 
    {  
          // get wells in specific order 
           $.getJSON('/uniflow?callback=?&stepName=Ajax+Get+Wells+From+PlateMap&plateMap=' + plateMap, {}, 
           function(data1, status) {  
              var count = data.length; 
              for(var i = 0; i<data.length; i++)
              {   
                        
                     console.log(data[i].container);
                     var well = data1[i].well; 
  //-                     console.log(data1[i].well);
                    // Name of class will depend on what you name your plate
                     $('.ResplexPlate_'+well).val(data[i].container); 
                    // This adds a span under the td that displays the patient name 
                     $('.ResplexPlate_'+well).parent().append('<p></p><span style=color:white;>'+ data[i].name +'</span>');  
                     
              }
            
              var j = count; var m = count + 1; 
    //adding the controls at the end of the plate 
              $('.ResplexPlate_'+data1[j].well).val('IDS Control');
              $('.ResplexPlate_'+data1[m].well).val('Internal Control'); 
     
      });  
    }); 
  });         
 function printDiv(divId){
  $('.hidePrint').hide();
    reportHTML = '<html><head><title>' + 'Print The List ' + '</title>'       
    reportHTML+='<link href="page3.css" rel="stylesheet"/>'
    reportHTML+= '</head><body><div id="myreport" class="main_report" style="background-color:white">';
    reportHTML+= $('#'+divId).clone().html() +  '</div></body></html>';
  $('.page').css('border', 'none');
    var win=window.open('url', 'Report', 'width=800,height=800,scrollbars=yes');
    win.document.open();
    win.document.write(reportHTML);
    win.document.close();
    $('.hidePrint').show(); 
    return false;
  } 