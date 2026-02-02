$(document).ready(function(){

  configureTable('#receivingTable');
  $('#stepFormSubmitButton').hide();

  $( "#deptFilter", this ).on( 'change', function () {
              searchLocationsByDepartment('.location','.department');
              var table = $('#receivingTable').DataTable();
              if ( table.column(1).search() !== this.value ) {
                  table
                      .column(1)
                      .search( this.value )
                      .draw();
                  }
  });

  $( "#locationFilter", this ).on( 'change', function () {
              var table = $('#receivingTable').DataTable();
              if ( table.column(2).search() !== this.value ) {
                  table
                      .column(2)
                      .search( this.value )
                      .draw();
                  }
  });

});
