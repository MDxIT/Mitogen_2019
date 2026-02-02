// set global variables

/**
 * Creates save object and calls post
 *
 * @function saveAnalysisInformation
 */
function saveAnalysisInformation(){

    let parentId = ($('#curParentId').val() != undefined) ? $('#curParentId').val():null;
    let analysisControlProcessingDataJson = getDataToSave('controlTable');
    let analysisControlDataProcessingString = JSON.stringify(analysisControlProcessingDataJson);

    let analysisDataProcessingJson = getDataToSave('analysisDataTable');
    let analysisDataProcessingString = JSON.stringify(analysisDataProcessingJson);

    console.log('analysisControlProcessingDataJson', analysisControlProcessingDataJson);
    console.log('analysisDataProcessingJson', analysisDataProcessingJson);

    let callObject = {
        stepName: 'Post Analysis Data'
        ,Submit:true
        ,formNumber:0
        ,thisStep: thisStep
        ,protocolStepName: protocolStepName
        ,parentId: parentId
        ,requireCommentOnFailure: $('#requireCommentOnFailure').val()
        ,nextStepRouting: $('#nextStepRouting').val()
        ,methodVersionId: $('#methodVersionId').val()
        ,endOfWorkflow: $('#endOfWorkflow').val()
        ,analysisDataProcessingJson: analysisDataProcessingString
        ,analysisControlDataProcessingJson: analysisControlDataProcessingString
        ,parentResult: blankIfFalsy($('#curParentId_Action').val())
        ,dateFormat: $('#dateFormat').val()
    }

    $.post('/uniflow', callObject).done(function (jqxhr, statusText) {
        console.log('statusText', statusText);
        let postHtml = $.parseHTML(jqxhr);
        let postError = checkPostError(postHtml);
        console.log(postError);
        if (postError !== false) {
            $('#errorBox').html('');
            $('#errorBox').html(postError);
            console.log(postError);
        } else {
            $('form').submit();
        }

    }).fail(function (jqxhr, textStatus, error) {
        let err = "Request Failed: " + textStatus + ", " + error;
        console.log(err);
        $('#errorBox').html('');
        $('#errorBox').html(err);
    })
}

/**
 * This will be true by default. 
 *  If this is true then the column configuration will appy on if a column datapoint in the row is reportable or not.
 *  if this is false then all the datapoints for this row will be overridden and not reported even if configuration says the column is reportable. 
 *      This will apply only to the datapoint within this row.
 *
 * @function getIsReportable
 * @param {object} rowObjData row data object
 * @return {boolean}
 */
function getIsReportable(rowObjData){
    let isReportableArr = rowObjData.map(function (item, i){
        if(item.is_reportable == 0){
            return false
        } else {
            return true
        }
    })

    return !(isReportableArr.indexOf(false) > -1)

}

/**
 * Get analysis table data and metadata, trigger table creation
 *
 * @function prepFieldData
 * @param {object} dataObj row data object
 * @param {string} tableType (samples or controls)
 * @param {Array} Array of objects
 */
function prepFieldData(dataObj, tableType) {
    let completeDataArr = dataObj.map(function (item, i){
        let itemArr = item.slice();
        let firstItem = item[0];

        // Add is_reportable key to spec_info object to allow checkbox to load with the correct value
        firstItem['reportableOverRide'] = getIsReportable(item);


        itemArr.push(firstItem, firstItem, firstItem);
        if(parentType == 'tray' ){
            // Tray Location
            itemArr.splice(1, 0, firstItem);
        }

        if(tableType == 'samples'){

            //checkbox for reportable override
            itemArr.splice(1, 0, firstItem);

            let detailsCheck = $('.detailsData').filter( function(i, item) {
                if(item.value){
                    return item;
                }
            });
            if (detailsCheck.length > 0){
                // Details
                itemArr.splice(1, 0, firstItem);
            }
        } else if(tableType == 'controls'){
            //Control Type
            itemArr.splice(1, 0, firstItem);
            //Control Id
            itemArr.splice(1, 0, firstItem);
        }

        return itemArr;
    });
    return completeDataArr;
}

/**
 * merge frozen table sample id rows for rows that have the same sample id
 *
 * @function frozenMergeGridCells
 */
function frozenMergeGridCells() {
    let columnCount = $(".DTFC_Cloned tr:first th").length;
    for (var dimension_col = 0; dimension_col < columnCount; dimension_col++) {
        // first_instance holds the first instance of identical td
        let first_instance = null;
        let rowspan = 1;

        // iterate through rows
        $(".DTFC_Cloned tbody ").find("tr").each(function () {
            let dimension_td = $(this).find("td");
            if (first_instance == null) {
                // must be the first row
                first_instance = dimension_td;
            } else if (dimension_td.find(".sampleId").html() == first_instance.find(".sampleId").html()) {
                // the current td is identical to the previous

                // remove the current td
                dimension_td.find('div').html();

                // increment the rowspan attribute of the first instance
                ++rowspan;
            } else {
                // this cell is different from the last
                first_instance = dimension_td;
                rowspan = 1;
            }

            // add rowspan attribute to first td of the same identical rows
            first_instance.attr("rowspan", rowspan);
        });


        // color the table rows correctly when mergeing rows
        let previousRowClass = "odd"
        $(".DTFC_Cloned tbody tr").each(function () {
            let dimension_tr = $(this);
            let dimension_td = $(this).find('td');
            if(dimension_td.attr("rowspan") != undefined){
                $(dimension_tr).removeClass('odd');
                $(dimension_tr).removeClass('even');
                $(dimension_tr).addClass(previousRowClass);
                if(previousRowClass === "odd"){
                    previousRowClass = "even";
                } else {
                    previousRowClass = "odd";
                }

            }
        });

    }
}

/**
 * Get analysis table data and metadata, trigger table creation
 *
 * @function generateAnalysisTable
 * @param {string} tableDivId (include #)
 * @param {string} tableId (exclude #)
 * @param {object} fieldData
 * @param {string} tableType - samples/controls
 */
function generateAnalysisTable(tableDivId, tableId, tableType = "samples", fieldData, showHistory) {

    $(tableDivId).html("");
    $(tableDivId).append("<table id='" + tableId + "' ></table>");

    let columnArr = [];
    // add leading static columns
    let rowDefinitionArr = fieldData[0];

    for (var i = 0; i < rowDefinitionArr.length; i++) {
        // check if the first object in array and if so generate specimen info column
        if(i === 0){
            columnArr = columnArr.concat(getLeadStaticColumns(rowDefinitionArr[i], tableType));
        } else {
            // get dynamic table definitions for dynamic columns
            columnArr.push(getDynamicColumns(rowDefinitionArr[i]));
        }

    }

    // get ending columns for table (result, comments and comment history)
    columnArr = columnArr.concat(getEndStaticColumns(rowDefinitionArr[0], tableType, showHistory));


    // build arrays for fields shown and hidden 
    let columnArrTypes = columnArr.map(function(item, i){
        return {"definerType": item.meta.definerType, "colPosition": i}
    })

    let hideMetaArr = columnArrTypes.filter(function(item, i){
        if(item.definerType === "metaData"){
            return item
        }
    }).map(function(item, i){
        return item.colPosition
    });

    let hideLoadArr = columnArrTypes.filter(function(item, i){
        if(item.definerType === "loadData"){
            return item
        }
    }).map(function(item, i){
        return item.colPosition
    });

    let visibleMetaArr = columnArrTypes.filter(function(item, i){
        if(item.definerType != "metaData"){
            return item
        }
    }).map(function(item, i){
        return item.colPosition
    });

    let visibleLoadArr = columnArrTypes.filter(function(item, i){
        if(item.definerType != "loadData"){
            return item
        }
    }).map(function(item, i){
        return item.colPosition
    });

    // get table options to set in datatable function
    var options = {         
        "createdRow": function(row, data, dataIndex) {
            var rowObj = $(row);
            rowObj.attr("data-rowInfo", JSON.stringify(data));
        },
        "buttons": [
            {
                "extend": "colvisGroup",
                "text": "Show Load Data",
                "className": "DTColGroupBTN showLDTColGroupBTN " + tableId,
                "show": hideLoadArr
            },
            {
                "extend": "colvisGroup",
                "text": "Hide Load Data",
                "className": "DTColGroupBTN hideLDTColGroupBTN " + tableId,
                "show": visibleLoadArr,
                "hide": hideLoadArr
            },
            {
                "extend": "colvisGroup",
                "text": "Show Meta Data",
                "className": "DTColGroupBTN showMDTColGroupBTN " + tableId,
                "show": hideMetaArr
            },
            {
                "extend": "colvisGroup",
                "text": "Hide Meta Data",
                "className": "DTColGroupBTN hideMDTColGroupBTN " + tableId,
                "show": visibleMetaArr,
                "hide": hideMetaArr
            },
            {
                "extend": "colvisGroup",
                "className": "showAllBTN",
                "text": "Show all",
                "show": ":hidden"
            }
        ]
    }

    // prep data to match columns
    let completeFieldData = prepFieldData(fieldData, tableType);

    // create actual datatable
    var table = stdDataTableFromArray('#' + tableId, columnArr, completeFieldData, false, options, { "leftColumns":1 });

    // add buttons to the table container
    table.buttons( 0, null ).container().prependTo(
        table.table().container()
    );

    // apply onclick events for table buttons
    applyTableButtonFunctionality();

    applyDatePicker();

    // merge identical sample Id fields
    frozenMergeGridCells();

    hideColumns("#analysisDataTable", "hideColumn");

    setLeftWrapperStyle();

    $(".hideLDTColGroupBTN").click();
    $(".showAllBTN").click();
}

/**
 * Creates button functionality for table buttons
 *
 * @function applyTableButtonFunctionality
 */
function applyTableButtonFunctionality(){

    $(".showLDTColGroupBTN").hide();
    $(".showMDTColGroupBTN").hide();

    // onclick fixed issues with spacing due to using both fixed columns and column visibility
    $(".DTColGroupBTN").on("click", function(){
        setLeftWrapperStyle();

        // modify inline styles added by datatables when redrawing
        $("#analysisDataTable , #controlTable ").css("min-width", "100%");
        $(".dataTables_scrollHeadInner").css("min-width", "100%");
        $(".dataTables_scrollHeadInner table").css("min-width", "100%");

        if($(this).hasClass("showLDTColGroupBTN")){
            $(this).parent().children(".showLDTColGroupBTN").hide();
            $(this).parent().children(".hideLDTColGroupBTN").show();
        } else if($(this).hasClass("hideLDTColGroupBTN")){
            $(this).parent().children(".hideLDTColGroupBTN").hide();
            $(this).parent().children(".showLDTColGroupBTN").show();
        } else if($(this).hasClass("showMDTColGroupBTN")){
            $(this).parent().children(".showMDTColGroupBTN").hide();
            $(this).parent().children(".hideMDTColGroupBTN").show();
        } else if($(this).hasClass("hideMDTColGroupBTN")){
            $(this).parent().children(".hideMDTColGroupBTN").hide();
            $(this).parent().children(".showMDTColGroupBTN").show();
        }
    });

    $(".showAllBTN").on("click", function(){
        $(this).parent().children(".showLDTColGroupBTN").hide();
        $(this).parent().children(".hideLDTColGroupBTN").show();
        $(this).parent().children(".showMDTColGroupBTN").hide();
        $(this).parent().children(".hideMDTColGroupBTN").show();

        setLeftWrapperStyle();
    });
}

function setLeftWrapperStyle(){
    // remove inline styles added by datatables when redrawing
    $(".DTFC_LeftWrapper").css("height", "");
    $(".DTFC_LeftWrapper").css("border-right", "");

    // Correct width for overlay table when redrawing
    $(".DTFC_LeftWrapper table td").each(function(){
        let setwidth = ($(this).css("width").replace("px", "")*1) + 22;
        $(this).closest(".DTFC_LeftWrapper").css("width", setwidth + "px");
    })
}

/**
 * Creates static analysis columns for the first couple of columns in the table
 *
 * @function getLeadStaticColumns
 * @param {object} dataObj
 * @param {string} tableType
 */
function getLeadStaticColumns(dataObj, tableType) {
    let staticArr = [];
    // Sample Id        
    staticArr.push({
        "title": containerLabel.value,
        "data": dataObj,
        "meta": {"title":containerLabel.value, "definerType":"spec_info"},
        "render": function (data, type, row, meta) {
            let currentDataObj = data[meta.col];
            let returnValue = currentDataObj.current_container_id;
            let colClass = "sampleId";
            if(type === "display"){
                let colTitle = meta.settings.aoColumns[meta.col].title;
                if(colTitle == $("#controlLabel").val()){
                    colClass = "controlTubeId";
                }
                return "<div class='" + colClass + "' data-cell='" + JSON.stringify(currentDataObj) + "' >" + returnValue + "</div>";
            }
            return returnValue;
        }
    });

    // Checkbox override for is reportable for the datapoints in the row.
    if(tableType != "controls"){
        staticArr.push({
            // This will be true (checked) by default. If this is checked then the column configuration will appy on if a column datapoint in the row is reportable or not.
            //    if this is false then all the datapoints for this row will be overridden and not reported even if configuration says the column is reportable. 
            //      This will apply only to the datapoint within this row.
            "title": "Report Row",
            "data": dataObj,
            "meta": {"title":"Report Row", "definerType":"spec_info"},
            "render": function (data, type, row, meta) {
                let currentDataObj = data[meta.col];
                let returnValue = currentDataObj.reportableOverRide;
                if(type === "display"){
                    if(returnValue === false){
                        return "<div class='reportableOverRideDiv' data-cell='" + JSON.stringify(currentDataObj) + "' ><input type='checkbox' class='reportableOverRide' value='"+returnValue+"'/></div>";
        
                    } else {
                        return "<div class='reportableOverRideDiv' data-cell='" + JSON.stringify(currentDataObj) + "' ><input type='checkbox' class='reportableOverRide' value='"+returnValue+"' checked='checked'/></div>";
                    }        
                }
                return returnValue;
            }
        });
    }

    if(parentType == "tray"){
        // Tray Location
        staticArr.push({
            "title": "Tray Location",
            "data": dataObj,
            "meta": {"title":"Tray Location", "definerType":"spec_info"},
            "render": function (data, type, row, meta) {
                let currentDataObj = data[meta.col];
                let returnValue = currentDataObj.current_parent_pos;
                meta.definerType = "spec_info";
                if(type === "display"){
                    return "<div class='trayLocation' data-cell='" + JSON.stringify(currentDataObj) + "'>"+returnValue+"</div>";
                }
                return returnValue;
            }
        });
    }

    if(tableType === "samples"){
        let detailsCheck = $(".detailsData").filter( function(i, item) {
            if(item.value){
                return item;
            }
        });
        if (detailsCheck.length != ''){
            // Details
            staticArr.push({
                "title": "Details",
                "data": dataObj,
                "meta": {"title":"Details", "definerType":"spec_info"},
                "render": function (data, type, row, meta) {
                    let currentDataObj = data[meta.col];
                    let returnValue = currentDataObj.current_container_id;
                    if(type === "display"){
                        returnValue = getDetailsColString(currentDataObj);
                    }
                    return returnValue;
                }
            });

        }
    } else if(tableType == "controls"){
        staticArr.push({
            //Control Type
            "title": "Control Type",
            "data": dataObj,
            "meta": {"title":"Control Type", "definerType":"control_info"},
            "render": function (data, type, row, meta) {
                let currentDataObj = data[meta.col];
                let returnValue = currentDataObj.control_type;
                if(type === "display"){
                    return "<div class='controlType' data-cell='" + JSON.stringify(currentDataObj) + "'>"+returnValue+"</div>";
                }
                return returnValue;
            }
        },{
            // Control Id
            "title": "Control Id",
            "data": dataObj,
            "meta": {"title":"Control Id", "definerType":"control_info"},
            "render": function (data, type, row, meta) {
                let currentDataObj = data[meta.col];
                let returnValue = currentDataObj.run_id;
                if(type === "display"){
                    return "<div class='controlId' data-cell='" + JSON.stringify(currentDataObj) + "' >"+returnValue+"</div>";
                }
                return returnValue;
            }
        });
    }
  return staticArr;
}

/**
 * Creates string to display in details column
 *
 * @function getDetailsColString
 * @param {object} currentDataObj - 
 * @return {string} details html string
 */
function getDetailsColString(currentDataObj){

    let detailsString = "";
    let momentDateFormat = moment().toMomentFormatString( $("#dateFormat").val() );

    $(".detailsData").each( function() {
        let currentVal = $(this).val();

        if ( currentVal === "Order Priority" ){
            detailsString += "Priority: " + blankIfFalsy(currentDataObj.order_priority) + " </br> ";
        } else if ( currentVal === "Specimen Received Date" ){
            detailsString += "Specimen Received: " + blankIfFalsy(moment(currentDataObj.received_date).format(momentDateFormat)) + " </br> ";
        } else if ( currentVal === "Patient Name" ){
            detailsString += "Patient Name: " + blankIfFalsy(currentDataObj.patient_name) + " </br> ";
        } else if ( currentVal === "FacilityID-MRN" ){
            let mrn = blankIfFalsy(currentDataObj.mrn);
            let mrnFacility = blankIfFalsy(currentDataObj.mrn_facility);
            if (mrn != "" && mrnFacility != ""){
                detailsString += "FacilityID-MRN: " + mrnFacility + " - " + mrn + " </br> ";
            } else if (mrn != "" ) {
                detailsString += "MRN: " + mrn + " </br> ";
            } else if (mrnFacility != "") {
                detailsString += "Facility: " + mrnFacility + " </br> ";
            }
        } else if ( currentVal === "Family ID" ){
            detailsString += "Family ID: " + blankIfFalsy(currentDataObj.family_id) + " </br> ";
        } else if ( currentVal === "Genetic Gender" ){
            detailsString += "Genetic Gender: " + blankIfFalsy(currentDataObj.genetic_gender) + " </br> ";
        } else if ( currentVal === "Specimen Type" ){
            detailsString += "Specimen Type: " + blankIfFalsy(currentDataObj.specimen_type) + " </br> ";
        } else if ( currentVal === "DOB" ){
            detailsString += "DOB: " + blankIfFalsy(moment(currentDataObj.dob).format(momentDateFormat)) + " </br> ";
        } else if ( currentVal === "Tests And Methods" ){
            detailsString += "Tests And Methods: " + blankIfFalsy(currentDataObj.test_and_method) + " </br> ";
        } else if ( currentVal === "Batch Order" ){
            detailsString += "Batch Order: " + blankIfFalsy(currentDataObj.current_parent_pos) + " </br> ";
        } else if ( currentVal === "Queued By" ){
            detailsString += "Queued By: " + blankIfFalsy(currentDataObj.queued_by) + " </br> ";
        } else if ( currentVal === "Customer Name" ){
            detailsString += "Customer Name: " + blankIfFalsy(currentDataObj.customer_name) + " </br> ";
        }
    });
    return "<div class='details' data-cell='" + JSON.stringify(currentDataObj) + "'>"+detailsString+"</div>";
}

/**
 * Creates static analysis columns for the first couple of columns in the table
 * if a panels key is an empty array field will display if it's not empty then only display column when panel definition
 * using row[0].assoc_panel to compare specimen assigned panel to definition assigned panel 
 *
 * @function getDynamicColumns
 * @param {array} rowDefinitionArr - array of objects for row of datatable columns defined
 * @return {object} column definition object for datatable
 */
function getDynamicColumns(rowDefinitionArr){

    return {
        "title": rowDefinitionArr.field_name,
        "data": rowDefinitionArr,
        "meta": {
            "title":rowDefinitionArr.field_name, 
            "definerType":rowDefinitionArr.definer_type
        },
        "render": function (data, type, row, meta) {
            let currentDataObj = data[meta.col]
            let currentValue = blankIfFalsy(currentDataObj.value)
            let returnValue = currentDataObj.value + blankIfFalsy(currentDataObj.units)

            if(type === "display"){



                if(currentDataObj.definer_type === "metaData"){
                    
                    returnValue = "<div class='" + currentDataObj.input_name +" "+ currentDataObj.definer_type + "'>" + currentValue +"</div>";

                } else if(currentDataObj.definer_type === "loadData" || currentDataObj.definer_type === "data" || currentDataObj.definer_type === "detector"){

                    let otherAttributes = "data='"+ JSON.stringify(currentDataObj) + "' "; // set initial data attribute
                    let inputType = "text"; // set input type
                    let inputClasses = ""; // set input classes

                    if(currentDataObj.definer_type === "loadData"){
                        otherAttributes += ' readonly '; //sets readonly attribute
                        inputClasses = "readonly"; // sets readonly styling
                    }
                    if(currentDataObj.data_type === "decimal"){
                        inputType = "number";
                        let step = (currentDataObj.sig_figs > 0) ? Math.pow(10, -currentDataObj.sig_figs) : 1
                        otherAttributes += "step='" + step + "'"
                        otherAttributes += "data-parsley-excluded=true"

                    }
                    if(currentDataObj.data_type === "dateTime" && currentDataObj.definer_type != "loadData") {
                        inputClasses = "datePicker";

                    } 

                    // check if actualinterpretation is assigned and pass in the correct class for the css
                    if(currentDataObj.actual_interpretation != ""){
                        
                        let selectedInterpClass = getInterpretationStyle(currentDataObj, currentDataObj.actual_interpretation);
                        if(selectedInterpClass){
                            inputClasses += ' ' + selectedInterpClass;
                        }
                    } else if(currentDataObj.limits != "" && currentValue != ""){
                        let selectedvalClass = getInterpretationObj(currentDataObj, currentValue);
                        if(selectedvalClass.cssStyle){
                            inputClasses += ' ' + selectedvalClass.cssStyle;
                        }
                    }

                    if(currentDataObj.definer_type === "detector"){
                        // open parent div with modifier Objects
                        // console.log('currentDataObj.modifiers', currentDataObj.modifiers)
                        // override returnValue
                        returnValue = "<div class='" + currentDataObj.definer_type + " cellDiv' data-modifiers='" + JSON.stringify(currentDataObj.modifiers) + "'>";
                        returnValue += currentValue;
                        returnValue += "</div>";
                    } else {
                        // override returnValue to generate input field
                        returnValue = "<div class='" + currentDataObj.definer_type + " cellDiv'>";
                        if(row[0].hasOwnProperty('control_id')){
                            // TODO: using row[0].controlType compare to column definition type (will be added later with control update)
                            returnValue += "<input type='"+ inputType +"' " + otherAttributes + " class='text analysisDataInput "+inputClasses+"' value='"+ currentValue +"' tabindex='1'>";
                            returnValue += getShowUnits(currentDataObj.units);
                            returnValue += getShowLimits(currentDataObj);
                        } else {
                            let panelsLinked = currentDataObj.panels
                            // If panels key for column object is empty array then display associated fields,
                            // if panels is not blank and matches panel defined in specimen Info object (row[0].assoc_panel), then display associated fields
                            if(row[0].assoc_panel === "" || panelsLinked.length === 0 || panelsLinked.indexOf(row[0].assoc_panel) > -1){
                                returnValue += "<input type='"+ inputType +"' " + otherAttributes + " class='text analysisDataInput "+inputClasses+"' value='"+ currentValue +"' tabindex='1'>";
                                returnValue += getShowUnits(currentDataObj.units);
                                returnValue += getShowLimits(currentDataObj);
                            }
                        }
                        returnValue += "</div>";

                    }
                }
            }
            return returnValue;
        }
    }
}




/**
 * Creates static analysis columns for the end of the table
 *
 * @function getEndStaticColumns
 * @param {object} dataObj
 * @param {string} tableType
 */
function getEndStaticColumns(dataObj, tableType, showHistory) {
    let staticArr = [];
    staticArr.push(
        // Result      
        {
            "title": "Result",
            "data": dataObj,
            "meta": {"title":"Result", "definerType":"spec_info"},
            "render": function (data, type, row, meta) {
                let currentDataObj = data[meta.col]
                let returnValue = ""
                if(type === "display"){
                    let options = "<option></option>";
                    options = $("#overallResultOptions").clone().html();

                    returnValue += "<div class='overallResult'>";
                    returnValue +=   "<select class='text overallAnalysisResult' value='' tabindex='1'>"+ options +"</select>";
                    returnValue += "</div>";
                }
                return returnValue;
            }
        },
        // Comments
        {
            "title": "Comment",
            "data": dataObj,
            "meta": {"title":"Comment", "definerType":"spec_info"},
            "render": function (data, type, row, meta) {
                let currentDataObj = data[meta.col]
                let returnValue = ""
                if(type === "display"){
                    returnValue = "<div class='comments'>";
                    returnValue += "<textarea class='runComments' id='runComments_"+currentDataObj.run_id+"' tabindex='1'></textarea>";
                    returnValue += "</div>";

                }
                return returnValue;
            }
        }
    );
    if(showHistory === "Yes"){
        staticArr.push(
            // Comment History
            {
                "title": "Comment History",
                "data": dataObj,
                "meta": {"title":"Comment History", "definerType":"spec_info"},
                "render": function (data, type, row, meta) {
                    let currentDataObj = data[meta.col]
                    let returnValue = currentDataObj.comment_history;
                    if(type === "display"){
                        returnValue = "<div class='commentHistory'>"+returnValue+"</div>"
                    }
                    return returnValue;
                }
            }
        );
    }
  return staticArr;
}

/**
 * builds limits and limit interpretation override for field
 * 
 *
 * @function getShowLimits
 * @param {object} currentDataObj
 * @param {string} showLimits
 */
function getShowLimits(currentDataObj){
    let data_type = currentDataObj.data_type;
    let actInterp = blankIfFalsy(currentDataObj.actual_interpretation);
    let origInterp = blankIfFalsy(currentDataObj.original_interpretation);
    let overrideOptionsArr = currentDataObj.interp_list;

    overrideOptionsArr = cleanObjectArrayOfBlanks(overrideOptionsArr);

    overrideOptionsArr.unshift( { "value":"", "display": "" });

    let showLimits = "<div data-data_type='"+ data_type +"' class='interpretation'  data-origInterp='" + origInterp + "' data-actInterp='"+actInterp+"' data-interpOverride=''>";
        if(currentDataObj.limits != undefined && currentDataObj.limits != "" && currentDataObj.limits != null || currentDataObj.load_limit_override !== ""){
            if(data_type === "decimal"){
                showLimits += showLimitsDecimal(currentDataObj);
            } else {

                showLimits += "<span class='loadLimit'></span>";
            } 
        } else {
            showLimits += "<span class='loadLimit'></span>";
        }
        showLimits += "<div class='interpOverrideDiv'>";
            if(overrideOptionsArr.length > 1){
                let showLimitsAttributes = "";
                showLimits += generateSelectLists (overrideOptionsArr, actInterp, "interpOverride", showLimitsAttributes, "interpOverride");
            }
        showLimits += "</div>  ";
    showLimits += "</div>  ";
    return showLimits;
}


/**
 * Cleans extra blank object from array
 * 
 *
 * @function cleanObjectArrayOfBlanks
 * @param {array} myArray
 * @return {array} 
 */
function cleanObjectArrayOfBlanks(myArray){
    return myArray.filter(function(item, i){
        if(item.display !== "" || item.value !== ""){
            return item;
        }
    })
}

/**
 * builds decimal limits display structure
 * 
 *
 * @function showLimitsDecimal
 * @param {object} currentDataObj
 * @return {string} showLimits
 */
function showLimitsDecimal(currentDataObj){
    let showLimits = "<span class='loadLimit'>";
    if(currentDataObj.load_limit_override !== ""){
        showLimits += currentDataObj.load_limit_override;
    } else {
        let sigfigs = currentDataObj.sig_figs;
        if(currentDataObj.limit_type === "threshold"){
            showLimits += "Threshold: ";
            let thresholdVal = currentDataObj.limits.threshold_limit;
            showLimits += Number.parseFloat(thresholdVal).toFixed(sigfigs);

        } else if(currentDataObj.limit_type === 'range'){
            showLimits += "Range: ";
            let lowerRangeVal = currentDataObj.limits.lower_limit;
            let upperRangeVal = currentDataObj.limits.upper_limit;
            showLimits += Number.parseFloat(lowerRangeVal).toFixed(sigfigs);
            showLimits += " - ";
            showLimits += Number.parseFloat(upperRangeVal).toFixed(sigfigs);
        } else if(currentDataObj.limit_type === 'discrete'){
            showLimits += "Target: ";
            let discreteVal = currentDataObj.limits[1].discrete_limit;                    
            showLimits += Number.parseFloat(discreteVal).toFixed(sigfigs);
        }
    }
    showLimits += "</span>";
    return showLimits;
}



/**
 * builds units display structure
 * 
 *
 * @function getShowUnits
 * @param {object} currentDataObj
 * @return {string} showLimits
 */
function getShowUnits(units){
    units = blankIfFalsy(units);
    return "<span data-units='"+units+"' class='units'>  "+units+ "</span>";
}

/**
 * Compare entered data to set limits, set result and css class
 * triggered on analysis field input change
 *
 * @function analysisApplyInterpretation
 * @param {elem} $thisInput
 */
function analysisApplyInterpretation(thisInput) {
    let inputDataObj = JSON.parse($(thisInput).attr("data"));
    let interpretationSelected = getInterpretationObj(inputDataObj, $(thisInput).val());

    if(interpretationSelected != undefined){
        $(thisInput).parent().find(".interpOverride").val(interpretationSelected.interpretation);
        $(thisInput).parent().find(".interpretation").attr("data-actinterp", interpretationSelected.interpretation);
        $(thisInput).parent().find(".interpretation").attr("data-originterp", interpretationSelected.interpretation);

        if($(thisInput).val() === ""){
            setFieldStyle(getStyleArray(inputDataObj), thisInput, "");
        } else {

            setFieldStyle(getStyleArray(inputDataObj), thisInput, interpretationSelected.cssStyle);
        }

        inputDataObj.actual_interpretation = interpretationSelected.interpretation;
        inputDataObj.original_interpretation = interpretationSelected.interpretation;
        inputDataObj.interpretation_change = true; //set interpretation trigger for post
        inputDataObj.value = $(thisInput).val();
        $(thisInput).attr("data", JSON.stringify(inputDataObj));
    }
}

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
    if(isNaN(value) || isNaN(lowerLimit) || isNaN(upperLimit) || blankIfFalsy(fieldValue) === ""){
        return {
            "interpretation": "",
            "cssStyle": ""
        }
    } else if(value < lowerLimit ){
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
    if(isNaN(value) || isNaN(thresholdLimit) || blankIfFalsy(fieldValue) === ""){
        return {
            "interpretation": "",
            "cssStyle": ""
        }
    } else if(value < thresholdLimit){
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
 * if fieldValue is not a number or is blank than return empty style, if there is no discreteLimit than return blank.
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
    if(isNaN(value) || isNaN(discreteLimit) || blankIfFalsy(fieldValue) === ""){
        return {
            "interpretation": "",
            "cssStyle": ""
        }
    } else if(value === discreteLimit){
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
 * Compare entered data to field limits. Result comparison must be case sensitive.
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
        if(blankIfFalsy(value) === limitObj[i].discrete_limit){
            interpObj.interpretation = limitObj[i].equal_interpretation;
            interpObj.cssStyle = limitObj[i].equal_css;
            noMatch = false;
        }
    }
    if(noMatch && blankIfFalsy(value) != "" && limitObj.length > 0){            
        interpObj.interpretation = limitObj[0].not_equal_interpretation;
        interpObj.cssStyle = limitObj[0].not_equal_css;
    }
    return interpObj;
}

/**
 * updates data object and sets override attributes for cell interpretation
 *
 * @function analysisApplyInterpOverride
 * @param {object} thisObject - override select element
 */
function analysisApplyInterpOverride(thisObject) {
    let origObjStr = thisObject.parent().parent().siblings(".analysisDataInput").attr("data");
    let origObj = JSON.parse(origObjStr);

    // get style for interpretation selected
    let interpretationCSSClass = getInterpretationStyle(origObj, thisObject.val());

    // add warning language
    if( thisObject.parent().parent().attr("data-actInterp")  === ""){
        origObj.interpretation_change = "true"; //set interpretation trigger for post
    } else if( thisObject.val() != thisObject.parent().parent().attr("data-actInterp") ){
        thisObject.siblings(".interpretationChangeWarning").remove();
        thisObject.parent().append("<p class='interpretationChangeWarning'> * Interpretation changed.</p>");
        origObj.interpretation_change = "true"; //set interpretation trigger for post
    } else {
        thisObject.siblings(".interpretationChangeWarning").remove();
    }

    // set analysisDataInput field color
    setFieldStyle(getStyleArray(origObj), thisObject.parent().parent().siblings(".analysisDataInput"), interpretationCSSClass);

    // update override data attribute
    thisObject.parent().parent().attr("data-interpOverride", thisObject.val());

    // update the data object on the analysisDataInput field to include object changes
    thisObject.parent().parent().siblings(".analysisDataInput").attr("data", JSON.stringify(origObj));
}

/**
 * Gets the class value for style that matches interpretation or determines the class if interpretation doesn't match
 *
 * @function getInterpretationStyle
 * @param {object} obj - field object
 * @param {string} sValue - interpretation selected
 * @return {string} styleSelected 
 */
function getInterpretationStyle(obj, sValue){
    let limitType = obj.limit_type
    let limitObj = obj.limits
    let styleSelected = "";
    if(limitType === 'threshold' || limitType === 'range'){
        let keySelected = "";
        for (const property in limitObj) {
            if(limitObj[property] === sValue){
                keySelected = property;
            }
        }
        let stylekey = keySelected.substring(0, keySelected.lastIndexOf("_")) +"_css";
        if (stylekey === '_css'){
            if(limitType === 'threshold'){
                this_obj = compareThresholdResults(limitObj, obj.value)
            } else if(limitType === 'range'){
                this_obj = compareRangeResults(limitObj, obj.value)
            }
            styleSelected = this_obj.cssStyle
        } else {
            styleSelected = limitObj[stylekey];
        }

    } else if(limitType === 'discrete'){
        for (var i = 0; i < limitObj.length; i++) {
            if( i === 0 ){
                if(limitObj[i].not_equal_interpretation === sValue){
                    styleSelected = limitObj[i].not_equal_css;
                }
            } else {
                if(limitObj[i].equal_interpretation === sValue){
                    styleSelected = limitObj[i].equal_css;
                }
            }
        }
        if(styleSelected === ''){
            if(obj.data_type === 'decimal'){
                this_obj = compareDiscreteNumResults(limitObj, obj.value)
            } else if(obj.data_type === 'varchar'){
                this_obj = compareDiscreteTextResults(limitObj, obj.value)
            }
            styleSelected = this_obj.cssStyle
        }
    }
    return styleSelected;
}


/**
 * Gets array of all possible styles defined for the field
 *
 * @function getStyleArray
 * @param {object} origObj -
 * @return {array} cssClassArr
 */
function getStyleArray(origObj){
    let origObjLimits = origObj.limits;
    let cssClassArr = [];
    if(origObj.limit_type === 'threshold' || origObj.limit_type === 'range'){
        for (const property in origObjLimits) {
            if( property.substring(property.lastIndexOf("_")) === "_css"){
                cssClassArr.push(origObjLimits[property]);
            }
        }
    } else if(origObj.limit_type === 'discrete'){
        for (var i = 0; i < origObjLimits.length; i++) {
            for (const property in origObjLimits[i]) {
                if( property.substring(property.lastIndexOf("_")) === "_css"){
                    cssClassArr.push(origObjLimits[i][property]);
                }
            }
        }
    }
    return cssClassArr;
}

/**
 * Sets class on the input field for color display
 *
 * @function setFieldStyle
 * @param {object} origObj - 
 * @param {element} thisObject - 
 * @param {string} cssValue - 
 */
function setFieldStyle(cssClassArr, thisObject, cssValue){

    // remove previous styles from input element
    $.each(cssClassArr, function(index,value) {
        thisObject.removeClass(value);
    });

    // apply selected style to input field
    thisObject.addClass(cssValue);
}

/**
 * Makes comments required when run does not pass
 * @function setFieldStyle
 * @param {object} thisResultInput - 
 */
function runResultCommentRequirement( thisResultInput ) {
    if( thisResultInput.val() != 'pass' && thisResultInput.val() != '') {
        thisResultInput.parent().parent().parent().find('.runComments').addClass('required');
        thisResultInput.parent().parent().parent().find('.runComments').attr('data-parsley-required', 'true');
        thisResultInput.parent().parent().parent().find('.runComments').siblings('.parsley-errors-list').children('.parsley-required').show();
    } else {
        thisResultInput.parent().parent().parent().find('.runComments').removeClass('required');
        thisResultInput.parent().parent().parent().find('.runComments').removeClass('parsley-error');
        thisResultInput.parent().parent().parent().find('.runComments').siblings('.parsley-errors-list').children('.parsley-required').hide();
        thisResultInput.parent().parent().parent().find('.runComments').attr('data-parsley-required', 'false');
    }
}

/**
 * Generates an array of objects from table id specified for field load data, data and base data objects
 * 
 *
 * @function getDataToSave
 * @param {string} tableId -
 * @return array of objects - 
 */
function getDataToSave(tableId){
    let stepType = $('#stepType').val();
    let rowsArr = [];

    let theDatatable = $("#" + tableId).DataTable();

    theDatatable.rows().every( function ( rowIdx, tableLoop, rowLoop ) {

        var theRow = this.node();
        let saveDataArr = [];
        let origRowColumns = $(theRow).children();
        let isSampleStepSaveRow = true;
        let baseInfoObj = {
            "run_id":"",
            "current_parent_id":"",
            "current_parent_pos":"",
            "current_container_id":"",
            "comments":"",
            "overallResult":""
        }

        // main is_reportable value for the row based on user input checkbox
        let reportableOverRide = getIsReportableSaveVal($($(origRowColumns)).children("div.reportableOverRideDiv").find(".reportableOverRide").val());
        origRowColumns.each(function(j, curColumn){

            if($(curColumn).children().hasClass("metadata")){
                // meta data area
            } else if($(curColumn).children().hasClass("loadData")){
                let origLDObjStr = $(curColumn).children().find(".analysisDataInput").attr("data");
                if(origLDObjStr){
                    let origLDObj = JSON.parse(origLDObjStr);
                    origLDObj.is_reportable = reportableOverRide;
                    origLDObj.actual_interpretation = $(curColumn).children().find(".interpOverride").val();
                    saveDataArr.push(origLDObj);

                }
            } else if($(curColumn).children().hasClass("data")){
                let origDObjStr = $(curColumn).children().find(".analysisDataInput").attr("data");
                if(origDObjStr){
                    let origDataObj = JSON.parse(origDObjStr);

                    origDataObj.actual_interpretation = blankIfFalsy($(curColumn).children().find(".interpOverride").val());
                    origDataObj.value = $(curColumn).children().find(".analysisDataInput").val();
                    origDataObj.limit_string = $(curColumn).children().find(".loadLimit").html();
                    origDataObj.is_reportable = reportableOverRide;

                    saveDataArr.push(origDataObj);
                }
            } else {
                if($(curColumn).children().hasClass("sampleId")){ 
                    //This is for both samples and controls
                    let objCellDataStr = $(curColumn).children().attr("data-cell");
                    let objCellData = JSON.parse(objCellDataStr);

                    baseInfoObj.run_id = (objCellData.run_id === null ? "" : objCellData.run_id);
                    baseInfoObj.current_parent_id = (objCellData.current_parent_id === null ? "" : objCellData.current_parent_id);
                    baseInfoObj.current_parent_pos = (objCellData.current_parent_pos === null ? "" : objCellData.current_parent_pos);
                    baseInfoObj.current_container_id = (objCellData.current_container_id === null ? "" : objCellData.current_container_id);
                } else if($(curColumn).children().hasClass("overallResult")){
                    baseInfoObj.overallResult = $(curColumn).children().find(".overallAnalysisResult").val();
                } else if($(curColumn).children().hasClass("comments")){
                    baseInfoObj.comments = $(curColumn).children().find(".runComments").val();

                }
            }

        })

        saveDataArr.unshift(baseInfoObj);

        // for sample type steps only send rows that have a result selected
        if( stepType === "group" || ( stepType === "single" && ( baseInfoObj.overallResult ).length  > 0 ) ) {

            rowsArr.push(saveDataArr);
        }
    })
    return rowsArr;
}


function getIsReportableSaveVal(value){
    //default set to 1 for the tables that don't have a checkbox value. These should save as 1
    let bitVal = 1;
    if(value == 'false'){
        bitVal = 0;
    }

    return bitVal
}


/**
  * This function replaces the html rep of &, <, and > with it's char rep
  *
  * @function replaceSpecialChars
  * @param s - string
  * @return out - string with replaced chars
  **/
function replaceSpecialChars(s){
  let out = s.replace(/&amp;/g, '&')
      out = out.replace(/&lt;/g, '<')
      out = out.replace(/&gt;/g, '>')
  return out;
}

