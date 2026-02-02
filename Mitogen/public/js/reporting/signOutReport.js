
 $(document).ready(function() {

    $('#stepFormSubmitButton').val('Sign Out');
    $(".hide").hide();

    var locationCol = 15
    var departmentCol = 16

    convertOutputTableDateFormats( '#reportingSignoutTable', $('#dateFormat').val());
    // create datatable
    var reportingSignoutTable = stdTableBasic("#reportingSignoutTable", true);

    // arrange new filters
    $('#reportingSignoutTable_filter').append($('#table_filters'));

    // apply filtering functions
    $('#deptFilter').change(function() {
        addColumnSpecificSearch(reportingSignoutTable, departmentCol, $(this).val());
        searchLocationsByDepartment('.location','.department');
        $('#locationFilter').val('').change();
        hideDepartmentAndLocation ('#reportingSignoutTable', locationCol, departmentCol);
        viewButtons();
    });

    $('#locationFilter').change(function() {
        addColumnSpecificSearch(reportingSignoutTable, locationCol, $(this).val());
        hideDepartmentAndLocation ('#reportingSignoutTable', locationCol, departmentCol);
        viewButtons();
    });

    $('#overallResultFilter').change(function() {
        addColumnSpecificSearch(reportingSignoutTable, 5, $(this).val());
        hideDepartmentAndLocation ('#reportingSignoutTable', locationCol, departmentCol);
        viewButtons();
    });

    $('#reportTypeFilter').change(function() {
        addColumnSpecificSearch(reportingSignoutTable, 2, $(this).val());
        hideDepartmentAndLocation ('#reportingSignoutTable', locationCol, departmentCol);
        viewButtons();
    });

    $('#stepFormSubmitButton').click(function() {
        $('#progress_overlay').show();
        $('#stepFormSubmitButton').hide();

    });


    function viewButtons(){

        $('.viewButton').remove();
        $('.reportId').each(function(){
            $(this).parent().append('<input type="button" value="View" data-reportId="'+$(this).val()+'" class="viewButton">');
            $(this).parent('td').css('display', 'inline-flex');
        })
        $('.viewButton').on('click',function(){
            var reportId = $(this).attr('data-reportId');
            window.open("/uniflow?stepName=GeneratePDFReport&_recId=" + reportId, "_parent");
        })

    }
    viewButtons();



    hideDepartmentAndLocation ('#reportingSignoutTable', locationCol, departmentCol);

    $(document).on('click', '.paginate_button', function() {
        hideDepartmentAndLocation ('#reportingSignoutTable', locationCol, departmentCol);
        viewButtons();
     });

    $(document).on('click', 'thead th', function() {
        hideDepartmentAndLocation ('#reportingSignoutTable', locationCol, departmentCol);
        viewButtons();
     });

    $(document).on('change', '.dataTables_length select', function() {
        hideDepartmentAndLocation ('#reportingSignoutTable', locationCol, departmentCol);
        viewButtons();
     });

    $(document).on('input', 'input[type="search"]', function() {
        hideDepartmentAndLocation ('#reportingSignoutTable', locationCol, departmentCol);
        viewButtons();
     });

    $('.reportingSignoutTableCheckAll').on('click', function(){
        console.log('overall value', $(this).is(':checked'))
        checkAllCkbxForTable('#reportingSignoutTable', 'signoutReportCkbx', $(this).is(':checked'));

    })


});


