/*
 * Dependencies:
 *  listConfig.js
 *  sampleListUtils.js
*/


$(document).ready(function() {

    var config = getConfig('sampleList');

    // Initialize sample list
    init(config);

    // Check all the configurables - including the buildsheet configurations 
    checkConfig(config);

    // Add all event handlers
    addEvents(config);

    // Hide columns
    hideSampleListColumns(config); 

});


// Returns the list name - used for getConfig() to obtain the correct
// configurations for sample list
function getListName() {
    return 'sampleList';
}
