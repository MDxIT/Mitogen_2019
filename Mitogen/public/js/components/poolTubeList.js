/*
 * Dependencies:
 *  listConfig.js
 *  sampleListUtils.js
 *
*/

$(document).ready(function() {

    // Get config for pool tube list
    var config = getConfig('poolTubeList');

    // Initialize pool tube list
    init(config);

    // Check all the configurables
    checkConfig(config);

    // Add all event handlers
    addEvents(config);


    // Hide columns
    hideSampleListColumns(config); 

});

// Returns the list name - used for getConfig() to obtain the correct
// configurations for pool tube list
function getListName() {
    return "poolTubeList"
}
