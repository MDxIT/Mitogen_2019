$(document).ready(function() {

    $("#imageExpand").hide()
    //Class added to change bottom margin based on the presence of actions section pinned at the bottom
    $('.big-div').addClass('editInstance');
    var instance = $("#instance").val();
    var reportStatus = $('#reportStatus').val();

    //disable preview button if reportStatus is data ready
    if(reportStatus === "data ready") {
        $('#previewBtn').prop('disabled', true);
    }
    
    if(instance === "View" ){
        viewForm();
    }

    //Form 0 document.ready
    if($("input[name='formNumber']").val() === "0" ){

        convertOutputTableDateFormats( "#reportsTable", $("#dateFormat").val());

        // create datatable
        var reportsTable = stdTableBasic("#reportsTable", true);

        // arrange new filters
        $('#reportsTable_filter').append($("#table_filters"));

        hideDepartmentAndLocation ("#reportsTable", 12, 13);

        setDocReadyEventsForm0(reportsTable);

    } else {

        $("#hiddenFields").hide();
        var mainResultDataObj = JSON.parse($("#dataJson").val());

        var report = mainResultDataObj.report
 
        var overallResultsOptObj = JSON.parse($("#overallResults").val());
        var OverallReportOptionsArr = overallResultsOptObj.map(function(item, i){
            return item.overallResult
        })
        
        $("#reportId_Action").empty();

        generateSelectOptions (OverallReportOptionsArr, $("#mainOverallResult"))

        $("#overallReportInterpretation").val(report.overallInterpretation)
        $("#overallReportInterpretationOnload").val(report.overallInterpretation)
        $("#overallReportWording").val(report.overallWording)
        $("#overallReportWordingOnload").val(report.overallWording)

        $("#mainOverallResult").val(report.overallResult)
        $("#mainOverallResultOnload").val(report.overallResult)
                
        setDocReadyEventsForm1(overallResultsOptObj, report);

        var overallPanelResultListObj = JSON.parse($("#overallPanelResultListJSON").val());
        console.log('overallPanelResultListObj', overallPanelResultListObj)
        generateOverAllPanelDatatable(overallPanelResultListObj);

        // get data for non reportable rows
        var nonRptresultDataObj = JSON.parse($("#rowListNonReportable").val());
        var nonRptresultDataObjLen = nonRptresultDataObj.length;

        if(nonRptresultDataObjLen > 0){
            var nonReportable = generateNonRptResultDatatable(nonRptresultDataObj);
        } else {
            $("#nonReportingTableHeader").hide()
        }

        // get data for reportable rows
        var resultDataObj = JSON.parse($("#rowList").val());

        var resultsTable;
        if(instance === "Amend"){
            veiwAmend();
            resultsTable = generateAmendResultDatatable(resultDataObj);
        } else {
            resultsTable = generateResultDatatable(resultDataObj);
        }

        if($("#resultDataTable tbody").length == 0){
            $("#reportingTableHeader").hide()
        }

        //image table data
        var resultDataImageObj = JSON.parse($("#imageList").val());
        var resultDataImageObjLen = resultDataImageObj.length;

        if(resultDataImageObjLen > 0){
            // Loop through our image objects to get actual images
            var promiseArr = []
            resultDataImageObj.forEach(function(item) {
                promiseArr.push(Promise.resolve().then(function() {
                    var imgData = {
                        "stepName": "getSecureMedia",
                        "token": item.secureToken
                    }
                    return Promise.resolve($.get("/uniflow", imgData)).then(function(imageArr) {
                        item.imageResult = "<" + imageArr[0] + " src= '"+imageArr[1]+"' class='thumbnail'/>"
                    });
                }))
            })

            // Wait for all promises to resolve then call to generate data tabel
            Promise.all(promiseArr).then(function(){
                var resultsImageTable = generateResultImagesDatatable(resultDataImageObj);
                setImageTableEvents();
            })

        } else {
             // if image table is empty hide image table header
            $("#resultDataImageTableHeader").hide()
        }

        $("#stepFormSubmitButton").hide();
        $(".goToOrderForm").addClass("goToOrderFormView");
        $(".goToOrderFormView").removeClass("goToOrderForm");

    }

});

/**
 * Modifications and hiding pieces for the Amend version of the page
 *
 * @function veiwAmend
 */
function veiwAmend(){
    $(".stepName").html("Amend Report");
    $("#saveBtn").hide();
    $("#reworkBtn").hide();
    $("#stepFormSubmitButton").hide();
    $("input[name='reportId_RunCount']").parent().parent().hide();
    $('#previewBtn').hide();
}

/**
 * Modifications and hiding pieces for the View version of the page
 * 
 *
 * @function viewForm
 */
function viewForm(){
    $("#mainOverallResult").prop("disabled", true);
    $('.big-div').removeClass('editInstance');
    $('#actionBar').hide();
    $("#overallReportInterpretation").prop("readonly", true);
    $("#reportId_Comments").hide();
    $("#overallReportWording").prop("readonly", true);
    $("#reportId_Comments").parent("td").hide();
}

/**
 * sets events for form 0 on load
 *
 * @function setDocReadyEventsForm0
 */
function setDocReadyEventsForm0(reportsTable){        
    // apply filtering functions
    $("#deptFilter").change(function() {
        addColumnSpecificSearch(reportsTable, 13, $(this).val());
        searchLocationsByDepartment(".location",".department");
        $("#locationFilter").val("").change();
        hideDepartmentAndLocation ("#reportsTable", 12, 13);
    });

    $("#locationFilter").change(function() {
        addColumnSpecificSearch(reportsTable, 12, $(this).val());
        hideDepartmentAndLocation ("#reportsTable", 12, 13);
    });

    $(document).on("click", ".paginate_button", function() {
        hideDepartmentAndLocation ("#reportsTable", 12, 13);
    });

    $(document).on("click", "thead th", function() {
        hideDepartmentAndLocation ("#reportsTable", 12, 13);
    });

    $(document).on("change", ".dataTables_length select", function() {
        hideDepartmentAndLocation ("#reportsTable", 12, 13);
    });

    $(document).on("input", "input[type='search']", function() {
        hideDepartmentAndLocation ("#reportsTable", 12, 13);
    });
}

/**
 * sets events for form 1 on load
 *
 * @function setDocReadyEventsForm1
 */
function setDocReadyEventsForm1(overallResultsOptObj, report){
    $("#mainOverallResult").change(function() {
        for(var i = 0; i < overallResultsOptObj.length; i++){
            if(overallResultsOptObj[i].overallResult === $(this).val()){
                $("#overallReportInterpretation").val(overallResultsOptObj[i].overallInterpretation)
            } else if($(this).val() === ''){
                $("#overallReportInterpretation").val($("#overallReportInterpretationOnload").val())
            }
        }
    });

    $(document).on('change', '.newResult', function() {
        analysisApplyInterpretation($(this), report.reportDataInterpretation);
    });

    $("#approveBtn").click(function() {
        submitForm("Save and Approve");
    });    

    $("#previewBtn").click(function() {
        previewPdf();
    });

    $("#saveBtn").click(function() {
        submitForm("Save");
    });

    $("#reworkBtn").click(function() {
        if(confirm("Are you sure you want to queue the report to the Exception Handling step?")) {
            submitForm("Exception Handling");
        }
    });

    // navigate to Edit Order Form step from order card
    $(".goToOrderFormView").on("click", function() {
        let requestId = $("#requestId").val()
        let win = window.open("/uniflow?stepName=Order+Form&_recId="+requestId+"&nextStepInstance=View&nextStepWorkflow=", "_blank", "height=700,width=800,location=no,menubar=no,top=200,left=600,toolbar=no");
        if (win) {
            win.focus();
        } else {
            alert("Please allow pop-out tabs for this website");
        }
    });
}

/**
 * On change of result, calculates the new interpretation value and apply it.
 *
 * @function analysisApplyInterpretation
 * @param {element} thisInput - The new result field with updated value
 * @param {Object[]} reportInterps - List of Report interpretations for the current report
*/
function analysisApplyInterpretation(thisInput, reportInterps) {
    const resultId = $(thisInput).attr('id');
    const resultValue = $(thisInput).val();
    const idParts = resultId.split("-"); // result id is of format "res-{analysisDataId}-{analysisDataDefinitionId}"
    const reportInterp = findReportInterp(reportInterps, idParts[2].toString());

    if(reportInterp && reportInterp.data_type  !== "dateTime") {
        const interpObj= getInterpretationObj(reportInterp, resultValue);
        $('#interp-' + +idParts[1]).siblings(".interpretationChanged").remove(); // Removing the interpretation changed element if present initially
        $('#interp-'+idParts[1]).val(interpObj.interpretation); //Matching format of corresponding interpretation id, it is of the format "interp-{analysisDataId}"
        $('#interp-'+idParts[1]).removeClass(); //remove existing classes
        if($('#interp-'+idParts[1]).attr('data') === interpObj.interpretation) { // If the data attribute value matches the interpretation i.e. no change with original value
            $('#interp-'+idParts[1]).addClass('interpretation'); //apply the default class
        } else {
            $('#interp-'+idParts[1]).addClass('interpretation').addClass(interpObj.cssStyle); //apply the default class and the new class
            $('#interp-'+idParts[1]).parent().append("<p class='interpretationChanged'> * Interpretation changed.</p>"); // Add the interpretation changed prompt
        }
    }
}

/**
 * Search and return the interpretation definition matched for the new result
 *
 * @function findReportInterp
 * @param {element} reportInterpretations - List of Report interpretations for the current report
 * @param {string} analysisDataDefinitionId - Data definition id for the result
 * @return {Object} reportInterpretation
*/
function findReportInterp(reportInterpretations, analysisDataDefinitionId) {
    for(let i=0; i<reportInterpretations.length; i++) {
        if(reportInterpretations[i].analysisDataDefinitionId == analysisDataDefinitionId) {
            return reportInterpretations[i];
        }
    }
    return null;
}


/**
 * Opens the preview of the report in a new window
 *
 * @function previewPdf
 */
function previewPdf() {
    var reportId = $('#reportId').val();
    params = 'width=' + 685;
    params += ', height=' + (screen.height * 0.8);
    params += ', top=25, left=300, bottom=25'
    params += ', location=no,menubar=no,toolbar=no';
    let win = window.open("/uniflow?stepName=GeneratePreviewReport&_recId=" + reportId, "_blank", params);
    if (win) {
        win.focus();
    } else {
        alert("Please allow pop-out tabs for this website");
    }
}

/**
 * sets events for the image table
 *
 * @function setImageTableEvents
 */
function setImageTableEvents(){                
    // onClick of image expand to image original size
    $(".resultImage > img").on("click", function() {
        var dialog = initEmptyModal("imageExpand","title","auto", "auto", closeCurrentModal("imageExpand"));
        $("#imageExpand").html("");
        $("#imageExpand").append($($(this).clone()).removeClass("thumbnail"));
        dialog.dialog("open");
        $(".ui-dialog").css("top","100px");
    });

    // onClick of image report checkbox save checkbox value
    $(".isSelected").on("click", function() {
        $(this).val($(this).prop("checked"));
    });
}


/**
 * creates and displays the panel datatable 
 *
 * @function generateOverAllPanelDatatable
 */
function generateOverAllPanelDatatable(data) {
    var instance = $("#instance").val();

    $("#overallReportPanelTableDiv").html("")
    $("#overallReportPanelTableDiv").append("<table id='overallReportPanelsTable' ></table>");

    var columns = [
        {
            "title": "Panel/s",
            "data": null,
            "render": function (data, type, row, meta) {
                var returnValue = data.panelName;
                if(type === "display"){
                    returnValue = getDisplayString(returnValue, "panelName");
                }
                return returnValue
            }
        },
        {
            "title": "Test/s Complete in Panel",
            "data": null,
            "render": function (data, type, row, meta) {

                var returnValue = data.testNames;
                if(returnValue && returnValue.length > 0){
                        returnValue = returnValue.join(", ");
                } else {
                    returnValue = "";
                }
                if(type === "display"){
                    returnValue = getDisplayString(returnValue, "testNames");
                }
                return returnValue
            }
        },
        {
            "title": "Overall Panel Result",
            "data": null,
            "render": function (data, type, row, meta) {
                var returnValue = data.overallResult;
                if(type === "display"){
                    if (instance === "View"){
                        returnValue = returnValue;
                    } else {
                        let optionsObj = createOptionsForPanelCode(data.panelCode);
                        returnValue = generateBasicSelectListOptions (optionsObj, returnValue, "overallResult");
                    }
                }
                return returnValue;
            }
        },
        {
            "title": "Overall Panel Interpretation",
            "data": null,
            "render": function (data, type, row, meta) {
                var returnValue = data.overallInterpretation;
                if(returnValue == "null"|| returnValue == null){
                    returnValue = "";
                }
                if(type === "display"){
                    if(instance === "View"){
                        returnValue = returnValue
                    } else {
                        returnValue = "<textArea class='panelReportInterpretation'>" +returnValue+ "</textArea>"
                    }
                }
                return returnValue;
            }
        },
        {
            "title": "Overall Panel Report Wording",
            "data": null,
            "render": function (data, type, row, meta) {
                var returnValue = data.overallWording;
                if(returnValue == "null"|| returnValue == null){
                    returnValue = '';
                }
                if(type === "display"){
                    if(instance === "View"){
                        returnValue = returnValue
                    } else {
                        returnValue = "<textArea class='panelReportWording'>" +returnValue+ "</textArea>";
                    }
                }
                return returnValue;
            }
        }
    ];

    var options = {
            createdRow: function(row, data, dataIndex) {
                    var rowObj = $(row);
                    rowObj.attr("data-overallResult", data.overallResult);
                    rowObj.attr("data-overallInterpretation", data.overallInterpretation);
                    rowObj.attr("data-overallWording", data.overallWording);
                    rowObj.attr("data-panelcode", data.panelCode);
                    rowObj.attr("data-reportResultDataId", data.reportResultDataId);
            }

    };

    var routingTable = stdDataTableFromArray("#overallReportPanelsTable", columns, data, false, options);

    overAllPanelDatatableEvents();
}

/**
 * sets events for table items
 *
 * @function overAllPanelDatatableEvents
 */
function overAllPanelDatatableEvents(){
    $(".overallResult").change(function() {
        let overallPanelObj = JSON.parse($("#overallPanel").val());
        let rowPanelCode = $(this).parent().parent().attr("data-panelcode");
        let rowOverallInterpreation = $(this).parent().parent().attr("data-overallInterpreation");

        for (let key in overallPanelObj) {
            if(key === rowPanelCode){
                for (var i = 0; i < overallPanelObj[key].length; i++) {
                    if((overallPanelObj[key][i]).overallPanelResult === $(this).val()){
                        $(this).parent().parent().find(".panelReportInterpretation").val((overallPanelObj[key][i]).overallPanelInterpretation);
                    } else if($(this).val() === ""){
                        $(this).parent().parent().find(".panelReportInterpretation").val(rowOverallInterpreation);
                    }
                }
            }
        }
    });
}

/**
 * Returns the options array for the overallResult for the panel code table
 *
 * @function createOptionsForPanelCode
 * @param {string} panelCode
 * @return {Array of Objects} optionsObj
 */
function createOptionsForPanelCode(panelCode){
    let overallPanelObj = JSON.parse($("#overallPanel").val());
    let optionsObj = [{"value":""}];
    for (let key in overallPanelObj) {
        if(key === panelCode){
            let value = overallPanelObj[key];
            for (var i = 0; i < value.length; i++) {
                optionsObj.push({"value":value[i].overallPanelResult})
            }
        }
    }
    return optionsObj;
}

/**
 * applies row attributes for the rows in the results tables
 *
 * @function applyResultRowAttributes
 */
function applyResultRowAttributes(rowObj, data, tableType){
    rowObj.attr("data-testCode", data.testCode);
    rowObj.attr("data-dataType", data.dataType);
    rowObj.attr("data-panelCode", data.panelCode);
    rowObj.attr("data-methodCode", data.methodCode);
    rowObj.attr("data-analysisDataId", data.analysisDataId);
    rowObj.attr("data-specimen", data.specimen);
    rowObj.attr("data-result", data.result);
    rowObj.attr("data-result-original", data.originalResult);
    rowObj.attr("data-resultLabel", data.resultLabel);
    rowObj.attr("data-interpretation", data.interpretation);
    rowObj.attr("data-wording", data.wording);
    rowObj.attr("data-reportResultDataId", data.reportResultDataId);

    if(tableType === "nonReportable"){
        rowObj.attr("data-reportable", false);
    } else if(tableType === "reportable"){
        rowObj.attr("data-reportable", true);
    } else if(tableType === "amend"){
        rowObj.attr("data-reportable", true);
    } else if(tableType === "image"){
        rowObj.attr("data-reportable", data.isSelected);
    }
}

/**
 * html string for readonly data
 *
 * @function getDisplayString
 */
function getDisplayString(returnValue, classValue){
    return "<span class='"+classValue+"'>" + returnValue + "</span>";
}


// Begin Result Tables column definitions
/**
 *  first common static columns in the report results tables
 *
 * @function defineLeadStaticColumns
 */
function defineLeadStaticColumns(data){
    let columns = [
        {
            "title": "Specimens",
            "data": null,
            "render": function (data, type, row, meta) {
                var returnValue = data.specimen;
                if(type === "display"){
                    returnValue = getDisplayString(returnValue, "specimen");
                }
                return returnValue;
            }
        },
        {
            "title": "Panel",
            "data": null,
            "render": function (data, type, row, meta) {
                var returnValue = data.panelName;
                if(type === "display"){
                    returnValue = getDisplayString(returnValue, "panelName");
                }
                return returnValue;
            }
        },
        {
            "title": "Test",
            "data": null,
            "render": function (data, type, row, meta) {
                var returnValue = data.testName;
                if(type === "display"){
                    returnValue = getDisplayString(returnValue, "testName");
                }
                return returnValue;
            }
        },
        {
            "title": "Result Name",
            "data": null,
            "render": function (data, type, row, meta) {
                var returnValue = data.resultLabel;
                if(type === "display"){
                    returnValue = getDisplayString(returnValue, "resultLabel");
                }
                return returnValue;
            }
        }
    ]
    return columns;
}

/**
 * Result column for the results tables
 *
 * @function defineResultColumn
 */
function defineResultColumn(data, tableType){
    let resultObj = {
        "title": "Result",
        "data": null,
        "render": function (data, type, row, meta) {
            let returnValue = data.result;
            if(data.dataType == "dateTime"){
                returnValue = getDateTimeFormat(returnValue);
            }
            if(type === "display"){
                // TODO: for editable results add if condition and check if table is reportable or not.
                if(tableType === "reportable"){
                    returnValue = getDisplayString(returnValue, "result");
                    if(data.result){
                        returnValue += "<span class='units'>  " + data.units + "</span>";
                    }
                } else {
                    returnValue = getDisplayString(returnValue, "result");
                    if(data.result){
                        returnValue += "<span class='units'>  " + data.units + "</span>";
                    }
                }
            }
            return returnValue;
        }
    }
    return resultObj
}

function defineOriginalResultColumn(data, tableType){
    let resultObj = {
        "title": "Original Result",
        "data": null,
        "render": function (data, type, row, meta) {
            let returnValue = data.originalResult;
            if(data.dataType == "dateTime"){
                returnValue = getDateTimeFormat(returnValue);
            }
            if(type === 'display'){
                returnValue = getDisplayString(returnValue, 'originalResult');
                if(data.originalResult){
                    returnValue += "<span class='units'>  " + data.units + "</span>";
                }
            }
            return returnValue;
        }
    }
    return resultObj
}

function defineNewResultColumn(data, tableType){
    let resultObj = {
        "title": "New Result",
        "data": null,
        "render": function (data, type, row, meta) {
            let returnValue = data.result;
            let inputClasses = "";
            let otherAttributes = "";
            let originalResultValue =  data.originalResult 
            if(data.dataType == "dateTime"){
                returnValue = getDateTimeFormat(returnValue);
            }
            if(type === 'display'){
                let instance = $("#instance").val();
                if(instance === 'View'){
                    returnValue = returnValue;  
                } else{
                    let inputType = "text";
                    if (instance === 'Edit'){                      
                        if (originalResultValue !='') {
                            otherAttributes += 'data-parsley-required="true"';
                            inputClasses = 'required';
                        }
                        inputClasses += ' ' + 'editNewResult';
                        if(data.dataType == "decimal"){
                            inputType = "number";
                            otherAttributes += 'step="any"';                        
                        } else if( data.dataType == "dateTime"){
                            inputClasses += ' ' + 'datePicker';
                        }
                    }
                    //Each input is given unique id of the format - res-{analysisDataId}-{analysisDataDefinitionId}
                    returnValue = "<input type='"+ inputType + "' " + otherAttributes + " class='newResult " + inputClasses + "' value='"+ returnValue + "' id='res-"+ data.analysisDataId + "-" + data.analysisDataDefinitionId +"' />";
                    applyDatePicker();             
                }
                if(instance != 'Edit') {
                    returnValue += "<span class='units'>  " + data.units + "</span>";
                }
            }
        return returnValue;
        }
    }
    return resultObj
}

function defineUnitsColumn(data, tableType){
    let resultObj = {
        "title": "",
        "data": null,
        "render": function (data, type, row, meta) {
            var returnValue = data.units;
            if(type === "display"){
                if(data.result) {
                    returnValue = getDisplayString(returnValue, "units");
                }
            }
            return returnValue;
        }   
    }
    return resultObj
}

/**
 * formats the date time if it is a valid date time
 *
 * @function getDateTimeFormat
 */
function getDateTimeFormat(returnValue){
    if(returnValue){
        let t = returnValue.split(/[ ]/);
        let colValue = moment(t[0], "YYYY-MM-DD", true);
        let momentDateFormat = moment().toMomentFormatString($("#dateFormat").val());
        if(colValue.isValid()) {
            returnValue = moment(colValue).format(momentDateFormat);
        }
    }
    return returnValue
}

/**
 * returns limit and ranges column 
 *
 * @function defineLimitColumn
 */
function defineLimitColumn(data){
    let column = {
        "title": "Limit/Ranges ",
        "data": null,
        "render": function (data, type, row, meta) {
            var returnValue = data.limit;
            if(type === "display"){
                returnValue = getDisplayString(returnValue, "limit");
            }
            return returnValue;
        }
    }
    return column;
}

/**
 * Interpretation column for the results tables
 *
 * @function defineInterpretationColumn
 */
function defineInterpretationColumn(data){
    let columns = {
            "title": "Interpretation",
            "data": null,
            "render": function (data, type, row, meta) {
                var returnValue = data.interpretation;
                if(returnValue == "null"|| returnValue == null){
                    returnValue = "";
                }
                if(type === "display"){
                    if($("#instance").val() === 'View'){
                        returnValue = returnValue;
                    } else {
                        returnValue = "<textarea class='interpretation' value='"+returnValue+"' data='"+returnValue+"' tabindex='1' id='interp-"+data.analysisDataId+"'>"+returnValue+"</textarea>";
                    }            
                }
                return returnValue;
            }
        }
    return columns;
}

/**
 * combination of limit/range and interpretation columns
 *
 * @function defineEndStaticColumns
 */
function defineEndStaticColumns(data){
    let columns = []
    columns.push(defineLimitColumn(data))
    columns.push(defineInterpretationColumn(data))
    return columns;
}
// END Result Tables column definitions

/**
 * Generates and displays the non reportable results table
 *
 * @function generateNonRptResultDatatable
 */
function generateNonRptResultDatatable(data) {
    $('#nonReportedResultDataTableDiv').html('')
    $('#nonReportedResultDataTableDiv').append('<table id="resultDataTableNonRpt" ></table>');

    let columns = defineLeadStaticColumns(data);
    columns.push(defineResultColumn(data, 'nonReportable'));
    columns.push(defineLimitColumn(data));

    let options = {
        createdRow: function(row, data, dataIndex) {
            let rowObj = $(row);
            applyResultRowAttributes(rowObj, data, 'nonReportable');
        }
    };

    let resultDataTableNonRpt = stdDataTableFromArray('#resultDataTableNonRpt', columns, data, false, options);
    return resultDataTableNonRpt;

}

/**
 * 
 * Generates and displays the reportable results table
 *
 * @function generateResultDatatable
 */
function generateResultDatatable(data) {
    $('#resultDataTableDiv').html('')
    $('#resultDataTableDiv').append('<table id="resultDataTable" ></table>');

    let columns = defineLeadStaticColumns(data);
    columns.push(defineOriginalResultColumn(data));
    columns.push(defineNewResultColumn(data));
    if($("#instance").val() === 'Edit') {
        columns.push(defineUnitsColumn(data));
    }
    columns = columns.concat(defineEndStaticColumns(data));

    let options = {
        createdRow: function(row, data, dataIndex) {
            let rowObj = $(row);
            applyResultRowAttributes(rowObj, data, 'reportable');
        }
    };

    let resultTable = stdDataTableFromArray('#resultDataTable', columns, data, false, options);
    return resultTable;
}

/**
 * 
 * Generates and displays the Amend reportable results table
 *
 * @function generateAmendResultDatatable
 */
function generateAmendResultDatatable(data) {
    $('#resultDataTableDiv').html('')
    $('#resultDataTableDiv').append('<table id="resultDataTable" ></table>');
    let columns = defineLeadStaticColumns(data);

    columns.push(defineOriginalResultColumn(data));

    columns.push({
      "title": "Review Result",
      "data": null,
      "render": function (data, type, row, meta) {
          var returnValue = data.result;
          if(data.dataType == 'dateTime'){
              returnValue = getDateTimeFormat(returnValue);
          }
          if(type === 'display'){
              returnValue = getDisplayString(returnValue, 'reviewResult');
              if(data.result)   {
                returnValue += "<span class='units'>  " + data.units + "</span>";
              }
          }
          return returnValue;
      }
    })

    columns.push(defineNewResultColumn(data));

    columns = columns.concat(defineEndStaticColumns(data));

    let options = {
        createdRow: function(row, data, dataIndex) {
            let rowObj = $(row);
            applyResultRowAttributes(rowObj, data, 'amend');
        }

    };

    let resultTable = stdDataTableFromArray('#resultDataTable', columns, data, false, options);
    return resultTable
}

/**
 * 
 * Generates and displays the Image results table
 *
 * @function generateResultImagesDatatable
 */
function generateResultImagesDatatable(data) {
    $('#resultDataImageTableDiv').html('')
    $('#resultDataImageTableDiv').append('<table id="resultDataImageTable" ></table>');

    let columns = defineLeadStaticColumns(data);

    columns.push(
        {
            "title": "Result",
            "data": null,
            "render": function (data, type, row, meta) {
                var returnValue = data.result;
                var returnImage = data.imageResult
                if(type === "display"){
                    returnValue = "<div class='resultImage' data-url='"+ returnValue+"'>" + returnImage + "</div>"; 
                }
                return returnValue;
            }
        },
        {
            "title": "Report",
            "data": null,
            "render": function (data, type, row, meta) {
                var returnValue = data.isSelected;
                if(type === "display"){
                    let instance = $("#instance").val();
                    if(returnValue){
                        if(instance === "View"){
                            returnValue = "<input type='checkbox' class='isSelected' value='"+returnValue+"' checked disabled />";
                        } else {
                            returnValue = "<input type='checkbox' class='isSelected' value='"+returnValue+"' checked />";
                        }
                    } else {
                        if(instance === "View"){
                            returnValue = "<input type='checkbox' class='isSelected' value='"+returnValue+"' disabled />";
                        } else {
                            returnValue = "<input type='checkbox' class='isSelected' value='"+returnValue+"' />";
                        }
                    }

                }
                return returnValue;
            }
        })

    columns = columns.concat(defineInterpretationColumn(data));

    let options = {
        createdRow: function(row, data, dataIndex) {
            let rowObj = $(row);
            applyResultRowAttributes(rowObj, data, "image");
        }

    };

    let resultTable = stdDataTableFromArray("#resultDataImageTable", columns, data, false, options);
    return resultTable;
}

/**
 * gets Overall Main object 
 *
 * @function getSaveMainObject
 * @return {object} mainObject
*/
function getSaveMainObject(){
    let mainOverallResult = $('#mainOverallResult').val();
    let overallReportInterpretation = $('#overallReportInterpretation').val();
    let overallReportWording = $('#overallReportWording').val();

    if($("#instance").val() === 'Amend'){ 
        mainOverallResult = blankIfFalsy(mainOverallResult);
        overallReportInterpretation = blankIfFalsy(overallReportInterpretation);
        overallReportWording = blankIfFalsy(overallReportWording);
    }
    let mainObject = {
                "specimenId": '',
                "panelName": '',
                "testName": '',
                "resultLabel": '',
                "result": mainOverallResult,
                "limit": '',
                "units": '',
                "reportable": '',
                "interpretation": overallReportInterpretation,
                "wording" : overallReportWording,
                "testCode": '',
                "dataType": 'varchar',
                "panelCode": '',
                "methodCode": '',
                "analysisDataId": '',
                "isOverall": 1,
                "isPanelOverall": 0,
                "reportDetailsId": $('#reportDetailsId').val(),
                "reportResultDataId": $('#reportResultDataId').val()
    }
    return mainObject
}

/**
 * gets panel object for row element
 *
 * @function getSavePanelObject
 * @param {element} row
 * @return {object} panelObject
*/
function getSavePanelObject(row){
    let panResult = $(row).find('.overallResult').val();
    let panInterpretation = $(row).find('.panelReportInterpretation').val();
    let panWording = $(row).find('.panelReportWording').val();

    if($("#instance").val() === 'Amend'){
        panResult = blankIfFalsy(panResult);
        panInterpretation = blankIfFalsy(panInterpretation);
        panWording = blankIfFalsy(panWording);
    }
    let panelObject = {
        "specimenId": '',
        "panelName": $(row).find('.panelName').html(),
        "testName": '',
        "resultLabel": '',
        "result": panResult,
        "limit": '',
        "units": '',
        "reportable": '',
        "interpretation": panInterpretation,
        "wording" : panWording,
        "testCode": '',
        "dataType": 'varchar',
        "panelCode": $(row).attr('data-panelcode'),
        "methodCode": '',
        "analysisDataId": '',
        "isOverall": 0,
        "isPanelOverall": 1,
        "reportDetailsId": $('#reportDetailsId').val(),
        "reportResultDataId": $(row).attr('data-reportresultdataid')
    }
    return panelObject;
}

/**
 * gets result object for row element
 *
 * @function getResultObject
 * @param {element} row
 * @return {object} resultObject
*/
function getResultObject(row, isImageTable = false){
    let curResult = blankIfFalsy($(row).find('.newResult').val());
    let originalResult = $(row).attr('data-result-original');
    let curInterpretation = $(row).find('.interpretation').val();

    if($("#instance").val() === 'Amend' && isImageTable === false){
        curInterpretation = blankIfFalsy(curInterpretation);
    }

    if(isImageTable){
        curResult = $(row).attr('data-result');
        originalResult = $(row).attr('data-result');
    }
    let resultObject = {
        "specimenId": $(row).find('.specimen').html(),
        "panelName": $(row).find('.panelName').html(),
        "testName": $(row).find('.testName').html(),
        "resultLabel": $(row).find('.resultLabel').html(),
        "result": curResult,
        "originalResult": originalResult,
        "limit": $(row).find('.limit').html(),
        "units": $(row).find('.units').html(),
        "reportable": $(row).attr('data-reportable'),
        "interpretation": curInterpretation,
        "wording" : "",
        "testCode": $(row).attr('data-testCode'),
        "dataType": $(row).attr('data-dataType'),
        "panelCode": $(row).attr('data-panelcode'),
        "methodCode": $(row).attr('data-methodCode'),
        "analysisDataId": $(row).attr('data-analysisDataId'),
        "isOverall": 0,
        "isPanelOverall": 0,
        "reportDetailsId": $('#reportDetailsId').val(),
        "reportResultDataId": $(row).attr('data-reportResultDataId')
    }

    return resultObject;
}

/**
 *
 * @function savePostCall
 * @param {object} postData
*/
function savePostCall(postData){
    $.post('/uniflow', postData).done(function (jqxhr, statusText) {
        console.log('statusText', statusText);
        var postHtml = $.parseHTML(jqxhr);
        var postError = checkPostError(postHtml);
        if (postError !== false) {
            $('#errorBox').html('');
            $('#errorBox').html(postError);
            var errorDialog = initCenterAlertModal('errorBox', 'Error', true, 200, 300);
            errorDialog.dialog('open');
        } else {
            $('[name="stepForm"]').submit();
        }
    }).fail(function (jqxhr, textStatus, error) {
        var err = "Request Failed: " + textStatus + ", " + error;
        console.log(err);
        $('#errorBox').html('');
        $('#errorBox').html(err);
        var errorDialog = initCenterAlertModal('errorBox', 'Error', true, 200, 300);
        errorDialog.dialog('open');
    });
}


/**
* Submits the form data based on the action chosen 
* Action's could be "Save", "Save and Approve"(Approve Button) and "Exception handling"(Rework Button)
* @param {string} actionType Action Type for the submit funtionality
*/
function submitForm(actionType) {
    var reportDetailsId = $('#reportDetailsId').val();
    var resultDataArr = [];
    var removedResultImgArr = [];

    // get Data json to get report Id for post
    let mainResultDataObj = JSON.parse($("#dataJson").val());
    let report = mainResultDataObj.report;
    let reportId = report.reportId;
    let instance = $("#instance").val();

    if(instance === 'Amend'){ 
        mainOverallResult = $('#mainOverallResult').val();
        mainOverallResultOnload = $('#mainOverallResultOnload').val();
        overallReportInterpretation = $('#overallReportInterpretation').val();
        overallReportInterpretationOnload = $('#overallReportInterpretationOnload').val();
        overallReportWording = $('#overallReportWording').val();
        overallReportWordingOnload = $('#overallReportWordingOnload').val();

        if(mainOverallResult != mainOverallResultOnload || overallReportInterpretation != overallReportInterpretationOnload || overallReportWording != overallReportWordingOnload){
            resultDataArr.push(getSaveMainObject());
        }
    } else {
        resultDataArr.push(getSaveMainObject());
    }


    destroyDataTable("#overallReportPanelsTable")
    if($('#overallReportPanelsTable tbody').length > 0){
        $('#overallReportPanelsTable tbody tr').each(function (index, row) {
            let panPanelName = $(row).find('.panelName').html();
            let panResult = $(row).find('.overallResult').val();
            let panInterpretation = $(row).find('.panelReportInterpretation').val();
            let panWording = $(row).find('.panelReportWording').val();
            let panPanelCode = $(row).attr('data-panelcode');
            let panReportResultDataId = $(row).attr('data-reportresultdataid');

            if(instance === 'Amend'){
                let panOrigResult = $(row).attr('data-overallresult');
                let panOrigInterp = $(row).attr('data-overallInterpretation');
                let panOrigWording = $(row).attr('data-overallwording');
                if(panResult != panOrigResult || panOrigInterp != panInterpretation || panWording != panOrigWording){
                    resultDataArr.push(getSavePanelObject(row));
                }
            } else {
                resultDataArr.push(getSavePanelObject(row));
            }
        });
    }

    destroyDataTable("#resultDataTable")
    if($('#resultDataTable tbody').length > 0){
        $('#resultDataTable tbody tr').each(function (index, row) {
            if(instance === 'Amend'){
                let curResult = $(row).find('.newResult').val();
                let curInterpretation = $(row).find('.interpretation').val();
                let curOrigResult = $(row).find('.originalResult').html();
                let curOrigInterp = $(row).attr('data-interpretation');
                if(curResult != curOrigResult || curOrigInterp != curInterpretation){
                    resultDataArr.push(getResultObject(row, false));
                }
            } else {
                resultDataArr.push(getResultObject(row, false));
            }
        });
    }

    destroyDataTable("#resultDataImageTable")
    if($('#resultDataImageTable tbody').length > 0){
        $('#resultDataImageTable tbody tr').each(function (index, row) {
            let curReportable = $(row).find('.isSelected').prop("checked");
            let origReportable = $(row).attr('data-reportable');

            if(origReportable.toString() === 'true' && curReportable.toString() === 'false'){
                removedResultImgArr.push($(row).attr('data-reportResultDataId'));
            }

            if(curReportable === true){
                resultDataArr.push(getResultObject(row, true));
            }
        });
    }

    var resultDataArrJson = JSON.stringify(resultDataArr);
    var removedResultImgJson = JSON.stringify(removedResultImgArr);

    console.log('resultDataArr', resultDataArr)
    console.log('removedResultImgArr', removedResultImgArr)

    let form = $('[name="stepForm"]');

    if(instance === 'Amend'){       
        $('#amendText').attr('data-parsley-required', 'true');

        if (form.parsley().isValid()) {
            var postData = {
                    "stepName": "Save Amend Report",
                    "Submit": true,
                    "formNumber": 0,
                    "resultDataArrJson": resultDataArrJson,
                    "removedResultImgJson": removedResultImgJson,
                    "actionVal": actionType,
                    "associatedRuns": $('#associatedRunsList').val(),
                    "reportId": reportId,
                    "reportStatus": $('#reportStatus').val(),
                    "amendText": $('#amendText').val(),
                    "reportDetailsIdOverall": $('#reportDetailsId').val()
            };

            savePostCall(postData);

        } else {
            $('.nextStepErrors').remove()
            $('#amendText').parent().append('<div class="nextStepErrors error">*Amend explanation required</div>')
        }

    } else{
        $(form).parsley().validate();
        if($(form).parsley().isValid()) {
            var postData = {
                    "stepName": "Save Result Data Review",
                    "Submit": true,
                    "formNumber": 0,
                    "resultDataArrJson": resultDataArrJson,
                    "removedResultImgJson": removedResultImgJson,
                    "actionVal": actionType,
                    "associatedRuns": $('#associatedRunsList').val(),
                    "reportId": reportId,
                    "reportStatus": $('#reportStatus').val()
            };

        savePostCall(postData);
        }
    }
}


// TODO: MOVE THIS CALCULATION LOGIC SECTION TO A COMMON UTILITY, THIS WILL BE USED BY BOTH ANALYSIS AND RESULT DATA REVIEW SCREEN
//#region Interpretation calculation section 

/**
 * Compare data type and call correct function based on limit type and returns object
 *
 * @function getInterpretationObj
 * @param {object} inputDataObj
 * @param {string} value
 * @return {object} limits object {
 *           "interpretation": "",
 *           "cssStyle": ""
 *       }
 */
function getInterpretationObj(inputDataObj, value){
    let interpretationSelected;
    if(inputDataObj.data_type === "decimal"){
        if(inputDataObj.limit_type === "threshold"){
            interpretationSelected = compareThresholdResults(inputDataObj.limits, value);
        } else if(inputDataObj.limit_type === "range"){
            interpretationSelected = compareRangeResults(inputDataObj.limits, value);
        } else if(inputDataObj.limit_type === "discrete"){
            interpretationSelected = compareDiscreteNumResults(inputDataObj.limits, value);
        }
    } else if(inputDataObj.data_type === "varchar"){
        interpretationSelected = compareDiscreteTextResults(inputDataObj.limits, value);
    } else {
        // pass empty object if its not a datatype of decimal or varchar
        interpretationSelected = {
            "interpretation": "",
            "cssStyle": ""
        }
    }
    return interpretationSelected;
}

/**
 * Compare entered data to field limits
 *  
 *
 * @function compareRangeResults
 * @param {obj} limitObj
 * @param {string} fieldValue
 * @return {obj} inperpretation and style
 */
function compareRangeResults(limitObj, fieldValue){
    let value = Number(fieldValue);
    let lowerLimit = Number(limitObj.lower_limit);
    let upperLimit = Number(limitObj.upper_limit);
    if(value === NaN || lowerLimit === NaN || upperLimit === NaN){
        return {
            "interpretation": "",
            "cssStyle": ""
        }
    }

    if(value < lowerLimit ){
        return {
            "interpretation": limitObj.below_lower_interpretation,
            "cssStyle": limitObj.below_lower_css
        }
    } else if(value === lowerLimit){
        return {
            "interpretation": limitObj.equal_lower_interpretation,
            "cssStyle": limitObj.equal_lower_css
        }
    } else if(value > lowerLimit && value < upperLimit){
        return {
            "interpretation": limitObj.in_range_interpretation,
            "cssStyle": limitObj.in_range_css
        }
    } else if(value === upperLimit){
        return {
            "interpretation": limitObj.equal_upper_interpretation,
            "cssStyle": limitObj.equal_upper_css
        }
    } else if(value > upperLimit){
        return {
            "interpretation": limitObj.above_upper_interpretation,
            "cssStyle": limitObj.above_upper_css
        }
    }
}

/**
 * Compare entered data to field limits
 *  
 *
 * @function compareThresholdResults
 * @param {obj} limitObj
 * @param {string} fieldValue
 * @return {obj} inperpretation and style
 */
function compareThresholdResults(limitObj, fieldValue){
    let value = Number(fieldValue);
    let thresholdLimit = Number(limitObj.threshold_limit);
    if(value === NaN || thresholdLimit === NaN){
        return {
            "interpretation": "",
            "cssStyle": ""
        }
    }

    if(value < thresholdLimit){
        return {
            "interpretation": limitObj.below_threshold_interpretation,
            "cssStyle": limitObj.below_threshold_css
        }
    } else if(value === thresholdLimit){
        return {
            "interpretation": limitObj.equal_threshold_interpretation,
            "cssStyle": limitObj.equal_threshold_css
        }
    } else if(value > thresholdLimit){
        return {
            "interpretation": limitObj.above_threshold_interpretation,
            "cssStyle": limitObj.above_threshold_css
        }
    }
}

/**
 * Compare entered data to field limits
 *  
 *
 * @function compareDiscreteNumResults
 * @param {obj} limitObj
 * @param {string} fieldValue
 * @return {obj} inperpretation and style
 */
function compareDiscreteNumResults(limitObj, fieldValue){
    let value = Number(fieldValue);
    let discreteLimit = Number(limitObj[1].discrete_limit);
    if(value === NaN || discreteLimit === NaN){
        return {
            "interpretation": "",
            "cssStyle": ""
        }
    }

    if(value === discreteLimit){
        return {
            "interpretation": limitObj[1].equal_interpretation,
            "cssStyle": limitObj[1].equal_css
        }
    } else {
        return {
            "interpretation": limitObj[0].not_equal_interpretation,
            "cssStyle": limitObj[0].not_equal_css
        }
    }
}

/**
 * Compare entered data to field limits
 *  
 *
 * @function compareDiscreteTextResults
 * @param {obj} limitObj
 * @param {string} fieldValue
 * @return {obj} inperpretation and style
 */
function compareDiscreteTextResults(limitObj, value){
    // skip the first limit object as it is expected to always be the negative option
    let interpObj = {
                    "interpretation": "",
                    "cssStyle": ""
                }
    let noMatch = true;
    for (var i = 1; i < limitObj.length; i++) {
        if(value.toLowerCase() === (limitObj[i].discrete_limit).toLowerCase()){
            interpObj.interpretation = limitObj[i].equal_interpretation;
            interpObj.cssStyle = limitObj[i].equal_css;
            noMatch = false;
        }
    }
    if(noMatch && value != "" && limitObj.length > 0){            
        interpObj.interpretation = limitObj[0].not_equal_interpretation;
        interpObj.cssStyle = limitObj[0].not_equal_css;
    }
    return interpObj;
}
//#endregion
