$(document).ready(function() {
    $('#stepFormSubmitButton').hide();
    convertOutputTableDateFormats( '#pendingTable', $('#dateFormat').val());
    // create datatable
    var pendingTable = stdTableBasic("#pendingTable", true);

    // arrange new filters
    $('#pendingTable_filter').append($('#table_filters'));

    // apply filtering functions
    $('#deptFilter').change(function() {
        addColumnSpecificSearch(pendingTable, 11, $(this).val());
        searchLocationsByDepartment('.location','.department');
        $('#locationFilter')
            .val('')
            .change();
        hideDepartmentAndLocation ('#pendingTable', 10, 11);
    });

    $('#locationFilter').change(function() {
        addColumnSpecificSearch(pendingTable, 10, $(this).val());
        hideDepartmentAndLocation ('#pendingTable', 10, 11);
    });


     hideDepartmentAndLocation ('#pendingTable', 10, 11);

    $(document).on('click', '.paginate_button', function() {
        hideDepartmentAndLocation ('#pendingTable', 10, 11);
     });

    $(document).on('click', 'thead th', function() {
        hideDepartmentAndLocation ('#pendingTable', 10, 11);
     });


    $(document).on('change', '.dataTables_length select', function() {
        hideDepartmentAndLocation ('#pendingTable', 10, 11);
     });


    $(document).on('input', 'input[type="search"]', function() {
        hideDepartmentAndLocation ('#pendingTable', 10, 11);
     });


});

