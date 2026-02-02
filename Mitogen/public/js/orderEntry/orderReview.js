$(document).ready(function(){
         convertOutputTableDateFormats('#orderReviewTable', $('#dateFormat').val());
         var thisTable = configureTable('#orderReviewTable');
         $('#stepFormSubmitButton').hide();
        // arrange new filters
        $('#orderReviewTable_filter').append($('#table_filters'));

        $('#deptFilter').change(function() {
            addColumnSpecificSearch(thisTable, 1, $(this).val());
            searchLocationsByDepartment('.location','.department');
        });

        $('#locationFilter').change(function() {
            addColumnSpecificSearch(thisTable, 2, $(this).val());
        });


});
