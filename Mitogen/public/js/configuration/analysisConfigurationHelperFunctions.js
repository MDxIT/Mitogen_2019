/**
 * 
 * @author Wendy Goller
 * @version  3.1
 */


/**
 *
 *
 * @function compareAnalysisMethodLists
 * @param {string} a -
 * @param {string} b -
 * @returns {number}
 */
function compareAnalysisMethodLists(a, b) {
  const idA = a.analysisMethodsId
  const idB = b.analysisMethodsId
  const versionA = a.version
  const versionB = b.version

  let comparison = 0;
  if (idA > idB) {
    comparison = 1;
  } else if (idA < idB) {
    comparison = -1;
  } else if (idA === idB){
    if(versionA < versionB){
      comparison = 1;
    } else if(versionA > versionB){
      comparison = -1;
    }
  }
  return comparison;
}


/**
  *
  * @function getDataValueFromObj
  * @param {object} passedObj -
  * @param {string} propName -
  * @param {string} defaultValue -
  * @returns {string}
  *
 */
function getDataValueFromObj(passedObj, propName, defaultValue){
    if(passedObj){
        if(passedObj.hasOwnProperty(propName)){
            return passedObj[propName];
        } else{
            return defaultValue;
        }
    } else {
        return defaultValue;
    }
}



/*
 *
 *
 * @function checkMinLessMax
 * @param {object} element -
 */
function checkMinLessMax(element){
    let subSectionClass = '.dataFieldSection';
    if(element.hasClass('modifier')){
        subSectionClass = '.dataModifierFieldSection';
    }
    let min = $(element).closest(subSectionClass).find('.minLimit').val();
    let max = $(element).closest(subSectionClass).find('.maxLimit').val();
    if(min == '' || max == ''){
        return false;
    }
    min = min*1
    max = max*1
    if(min > max){
        $(element).closest(subSectionClass).find('.minLimit').siblings(".analysisWarningMessage").remove();
        $(element).closest(subSectionClass).find('.minLimit').parent().append("<div class='analysisWarningMessage'>Lower Limit can not be <br>larger than Upper Limit. </div>");
        return false;
    } else {
        $(element).closest(subSectionClass).find('.minLimit').siblings(".analysisWarningMessage").remove();
        return true;
    }
}


/*
 *
 * @function colorChange
 * @param {object} element -
 */
function colorChange(element){
  let classOptionArray = ['analysisPass', 'analysisFail', 'analysisWarning', 'analysisAlert', 'analysisIgnore'];
  var cssClass = $(element).val();
  classOptionArray.forEach(function(item){
    $(element).removeClass(item);
  })
  $(element).addClass(cssClass);
}


/*
 *
 * @function addRequired
 * @param {object} element -
 * @param {string} theClass -
 */
function addRequired(element, subSectionClass, theClass){
    $(element).closest(subSectionClass).find(theClass).addClass('required');
    $(element).closest(subSectionClass).find(theClass).attr('data-parsley-required','true');
}

/**
  *
  * Adds required class and sets parsley attr to true for a given identifier
  *
  * @function makeRequired
  * @param{string} identifier - class, id, etc
  *
**/
function makeRequired(identifier){
  $(identifier).addClass('required');
  $(identifier).attr('data-parsley-required','true');
}

/**
 *
 *
 * @function removeRequired
 * @param {object} element -
 * @param {string} theClass -
 */
function removeRequired(element, subSectionClass, theClass){
    $(element).closest(subSectionClass).find(theClass).removeClass('required');
    $(element).closest(subSectionClass).find(theClass).attr('data-parsley-required','false');
}


/**
 *
 *
 * @function clearField
 * @param {object} element -
 * @param {string} subSectionClass -
 * @param {string} theClass -
 */
function clearField(element, subSectionClass, theClass){
    $(element).closest(subSectionClass).find(theClass).val("");
}

/**
  *
  * Removes required class and sets parsley attr to false for a given identifier
  *
  * @function makeNotRequired
  * @param{string} identifier - class, id, etc
  *
**/
function makeNotRequired(identifier){
  $(identifier).removeClass('required');
  $(identifier).attr('data-parsley-required','false');
}


/*
 *
 * @function deleteSection
 */
function deleteSection(sectionId){
  $(sectionId).remove();
}



/**
 * 
 *
 * @function updateSelectValue
 * @param {string} elementId 
 */
function updateSelectValue(elementId) {
  selected = $("#" +elementId+" option:selected" ).text();
  // $('#'+elementId).text(selected);
  // $('#'+elementId).val(selected);
  // $("#" +elementId+" option:selected" ).attr("selected", true);
  //$("#"+ elementId).val( $("#" +elementId+" option:selected" ).text() );
 // console.log($(this).val());
}
