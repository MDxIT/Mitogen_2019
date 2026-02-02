$(document).ready(function() {
            var currentStepName = $("input[name=stepName]").val();
            var editDestinationTray = $("#editDestinationTray").val();

            // adjust samplelist readonly attribute
            if($('#scanReadOnly').val() == 'Yes'){
                    $('.sampleListTable_scan').attr('readonly', true);
                    $('.poolTubeListTable_scan').attr('readonly', true);
            }else if ($('#scanReadOnly').val() == 'No'){
                    $('.sampleListTable_scan').attr('readonly', false);
                    $('.poolTubeListTable_scan').attr('readonly', false);
             }

             // adjust batch control list readonly attribute
            if($('#controlIdGen').val() != 'Use Existing Identifier' && $('#controlIdGen').val() != 'User Generated'){
                    $('.controlListTable_scan').attr('readonly', true);
            } else {
                    $('.controlListTable_scan').attr('readonly', false);
            }

            //If batch then remove sample list order, else hide column
            if($('#isBatch').val() == 'Yes') {
                    $('.sampleListTable_order').removeClass('sampleListTable_order');
            } else if ($('#isBatch').val() == 'No'){
                    hideColumns('#sampleListTable', 'sampleListTable_order');
            }

            //Add parsely validation for duplicate entries
            if( $('#allowDuplicates').val() === 'No'){
                    $('.checkForDuplicates').attr('data-parsley-duplicate-sample-check', '');
                    addParsleyDup();
            }

            //run functions
            scanItems();
            prepAndPrintDiv('#printAll');

            //set wells with values to readonly, else not readonly
            if(editDestinationTray === undefined || editDestinationTray !== "Yes") {
                    $('.well').each(function(){
                            if( $(this).val() != ''){
                                    $(this).prop('readonly', true);
                             }
                            $(this).css('width', 'auto');
                });
            }
});

function scanItems(){

    //Get initial well value
    $('.well').focusin(function() {
            $(this).data('val', $(this).val());
    });

    // Classes for sample vs pool tube list
    if($('#sampleListTable').length > 0) {
            var specimenId = '.sampleListTable_specimenId';
            var checkbox = '.sampleListTable_checkbox';
    } else if ($('#poolTubeListTable').length > 0) {
            var specimenId = '.poolTubeListTable_poolTubeId';
            var checkbox = '.poolTubeListTable_checkbox';
    }
    //set classes for controls
    if($('#controlListTable').length > 0) {
        var controlId = '.controlListTable_controlTubeId'
        var controlCheckbox = '.controlListTable_checkbox'
    }
    if($("#controlResources > tbody > tr").length > 0) {
            var resourceControlId = '.controlBarcode'
    }

    // Handling for Sample & Control List //
    $('.well').change(function(){
        // getting well value
        $(this).attr('value', $(this).val());
        let thisData = $(this).data('val');
        let barcode = $(this).val();
        //get sample list row and data
        let sampleRow = $(specimenId + '[value="'+ barcode +'"]');
        let sampleRowData = $(specimenId + '[value="'+ thisData +'"]');
        //get batch control list row and data
        let controlRow = $(controlId + '[value="'+ barcode +'"]');
        let controlRowData = $(controlId + '[value="'+ thisData +'"]');

        //get qc resources, scanned controls
        let resourceControls = [];

        $('#controlResources > tbody  > tr').each( function() {
            let resource = $(this).find('.resource').val();
            resourceControls.push(resource);
        });

        // validations of what is scanned into well
        if(sampleRow.length > 0 || sampleRowData.length > 0) {
            if(!sampleRow.parent('td').siblings().children(checkbox).is(':checked')) {
                sampleRow.parent('td').siblings().children(checkbox).prop('checked',true).change();
            }

            if (barcode != '' ) {

                let countData = $('.well[value="'+ thisData  +'"]').length;
                console.log('SAMPLE ON PLATE COUNT FOR ' + barcode + '   ' + countData);

                if(countData == 0 ) {
                    sampleRowData.parent('td').siblings().children(checkbox).prop('checked',false).change();
                }

            } else if(barcode != thisData) {                        
                let scannedItems = $(".well").map(function(){return $(this).val();}).get();
                if (scannedItems.includes(thisData) == false ){
                    sampleRowData.parent('td').siblings().children(checkbox).prop('checked',false).change();
                }

            }

        } else if (controlRow.length > 0 || controlRowData.length > 0){
            if(!controlRow.parent('td').siblings().children(controlCheckbox).is(':checked')) {
                controlRow.parent('td').siblings().children(controlCheckbox).prop('checked',true).change();
            }
            if (barcode === '' || thisData !== barcode) {
                let countData = $('.well[value="'+ barcode  +'"]').length;
                console.log('SAMPLE ON PLATE COUNT FOR ' + barcode + '   ' + countData);

                if(countData == 0 ) {
                    controlRowData.parent('td').siblings().children(controlCheckbox).prop('checked',false).change();
                }
                if (barcode == ''){
                    let scannedItems = $(".well").map(function(){return $(this).val();}).get();
                    if (scannedItems.includes(thisData) == false ){
                        controlRowData.parent('td').siblings().children(controlCheckbox).prop('checked',false).change();
                    }
                }
            }
        } else if (resourceControls.length > 0 && $.inArray(barcode, resourceControls) != -1) {

            let countData = $('.well[value="'+ barcode  +'"]').length;
            console.log('NEW CONTROL ON PLATE COUNT FOR ' + barcode + '   ' + countData);

        } else if ( barcode != '' ){

            console.log("unknown barcode ");
            alert(barcode + ' is not queued for this step and cannot be added to this tray.');
            $(this).val('');
            $(this).focus();
        } else {
            if (barcode == '' ) {
                let countData = $('.well[value="'+ barcode  +'"]').length;
                console.log('SAMPLE ON PLATE COUNT FOR ' + barcode + '   ' + countData);
                if(countData == 0 ) {
                    sampleRowData.parent('td').siblings().children(checkbox).prop('checked',false).change();
                }
            } else {
                alert(barcode + ' is not queued for this step and cannot be added to this tray.');
                $(this).val('');
                $(this).focus();
            }
        }
    });
}

function addParsleyDup() {
    window.Parsley.addValidator('duplicateSampleCheck', {
        validateString: function(value) {
            var sampleArr = [];
            var currentSampleCount = 0;
            $('.checkForDuplicates').each(function(){
                if( $(this).val() != ''){
                    sampleArr.push($(this).val())
                }
             });
            for(var i = 0; i < sampleArr.length; ++i){
                if(sampleArr[i] == value){
                    currentSampleCount++;
                }
            }
            return currentSampleCount == 1;
        },
        messages: {
            en: 'Duplicate Container'
        }

    });
}

