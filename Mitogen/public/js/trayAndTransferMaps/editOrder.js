$(document).ready(function() {
  hideColumns('#orderTable', 'hiddenColumn');

  $('.Order').change(function(){
    checkForDuplicates($(this))
  });

  // $('#stepFormSubmitButton').click(function(ev){       
  //   var readyToSubmit = true;       
  //   ev.preventDefault(); 
  //   checkForAscendingOrder();                  
  //   if (readyToSubmit === true) {        
  //     $('[name="stepForm"]').submit();      
  //   } else {
  //     alert("The order column is missing numbers in the numerical order");
  //   }   
  // }); 
});

function checkForDuplicates(orderClass){
  currentOrderChangedOrder = orderClass.val()
  currentOrderChangedOrderClass = orderClass
  orderArray = []
  var count = 0
  $('.Order').each(function(){
    orderArray.push($(this).val());
  });
  orderArray.forEach(function(element){
    if( currentOrderChangedOrder === element){
      count++
    }
  });

  if(count > 1 ){
    alert("The same order cannot be duplicated.");
    currentOrderChangedOrderClass.val('').focus;
  };
}

// function checkForAscendingOrder(){
//   orderArray = [];
//   orderArraylength = ''
//   var count = 0
//   countArray = [];
//   var i = 0;
//   $('.Order').each(function(){
//     orderArray.push($(this).val());
//   });
//   orderArraylength = orderArray.length;
//   orderArray.forEach(function(element){
//       count++;
//       countArray.push(count);
//   });
//   $('.Order').each(function(){
//     if( i <= (parseInt(orderArraylength)-1)){
//       if( countArray.indexOf(orderArray[i]) === -1) {
//         readyToSubmit = false;
//       } else{
//         i++;
//       }
//     }
//   });
// }






