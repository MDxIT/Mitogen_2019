 function populatePlate(plateId) {
     $.getJSON('/uniflow?callback=?&stepName=Ajax+Get+Plate+Containers+and+Wells&plateId='+ plateId,{},
    function(data,status) 
    {  
              for(var i = 0; i<data.length; i++)
              {   
                        
                     console.log(data[i].container);
                     var well = data[i].well; 
 //-                     console.log(data1[i].well);
                    // Name of class will depend on what you name your plate in the form 
                     $('.ResplexPlate_'+well).val(data[i].container);   
                     
              }
            
     
    }); 
  } 
 $(document).ready(function () {
    populatePlate( $('#plateId').val() );
  }); 