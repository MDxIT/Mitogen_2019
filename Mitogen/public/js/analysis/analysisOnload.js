var thisStep;
var parentType;
var protocolStepName;

$(document).ready(function() {

    // apply parsley to form
    $('[name="stepForm"]').parsley();

    $('.hideDiv').hide();

    // set global fields
    thisStep = $('#stepName').val();
    parentType = $('#groupingContainerType').val();
    protocolStepName = $('#protocolStepName').val();
    let showHistory = $("#sampleCommentHistory").val();
    // if dataConfigured is not NO then display the tables... dataConfigured could be other falsy values and that's ok (can be undefined)
    if($('#dataConfigured').val() !== 'NO'){
        // generate data fields if they exist based on jython data object onload
        var origConfigString = $('#sampleRows').val();
        if(origConfigString != '' && origConfigString != undefined){
            var originalDataObj = JSON.parse(origConfigString);
            if(originalDataObj.length > 0){
                generateAnalysisTable('#analysisDataTableDiv', 'analysisDataTable', 'samples', originalDataObj, showHistory);
            } else {
                // needed for the steps that are single forms
                $('#analysisDataTableDiv').html("No samples available for processing.");
            }
        }

        // generate data fields if they exist based on jython data object onload
        var origControlConfigString = $('#controlRows').val();
        if( origControlConfigString != '' && origControlConfigString != undefined ){
            var originalControlDataObj = JSON.parse(origControlConfigString);
            if( originalControlDataObj.length > 0 ){
                generateAnalysisTable('#controlTableDiv', 'controlTable', 'controls', originalControlDataObj, showHistory);
            }
        }
        
        //set onchange and onclick field events
        setDocReadyEvents();

    }
});

/**
 * Set Document ready onclick and on change events
 *
 * @function setDocReadyEvents
 */
function setDocReadyEvents(){

    
    // input reportable override
    $(document).on('click', '.reportableOverRide', function() {
        $(this).val($(this).prop("checked"))
        $(this).attr("checked", $(this).prop("checked"));
    });

    // input interpretation override
    $(document).on('change', '.interpOverride', function() {
        analysisApplyInterpOverride($(this));
    });

    // input interpretation and verification against limits
    $(document).on('change', '.analysisDataInput', function() {
        analysisApplyInterpretation($(this));
    });

    // set required field for comments 
    $(document).on('change', '.overallAnalysisResult', function() {
        if ( $('#requireCommentOnFailure').val() == 'Yes' ) {
            runResultCommentRequirement( $(this) );
        }
    });

    $('#curParentId_Action').change( function() {
        let parentActionValue = $(this).val();
        $('.overallAnalysisResult').each( function() {
            $(this).val(parentActionValue);
            if ( $('#requireCommentOnFailure').val() === 'Yes' ) {
                runResultCommentRequirement( $(this) );
            }
        });
    });

    // processing on sumbit
    $('#stepFormSubmitButton').on('click', function(e) {
        e.preventDefault();

        destroyDataTable("#controlTable")
        destroyDataTable("#analysisDataTable")

        $('.showAllBTN').click();
        $('form').parsley().validate();
        if($('form').parsley().isValid()) {
            if($('#curParentId_Action').length > 0){
                let oarArrLen = $('.overallAnalysisResult').length;
                let oarArrFiltered = $('.overallAnalysisResult').filter(function(i, item){
                    if ($(item).val() === ''){
                        return item;
                    }
                })
                if(oarArrFiltered.length > 0){
                    $('#errorBox').html('');
                    $('#errorBox').html('There are empty results. Are you sure you want to continue?');
                    var confirmDialog = initCenterModal('errorBox','Empty results',300,300, function(){
                            //accept
                            saveAnalysisInformation();
                        }, function(){
                            //Cancel
                    })
                    confirmDialog.dialog('open');
                } else {
                    saveAnalysisInformation();
                }
            } else {
                saveAnalysisInformation();
            }
        }
    });
}
