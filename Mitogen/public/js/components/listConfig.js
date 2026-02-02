

/* 
 * Returns the configurables for:
 *  - Sample List
 *  - Pool Tube List
*/
function getConfig(key) {

    switch(key) {
        case 'poolTubeList':
            return {
                validateOrTransfer: $('#poolTubeList_validateOrTransfer').val(),
                indicator: $('#printIndicator').val(),
                counterConfig: $('#counterConfig').val(),
                scanAllConfig: $('#scanAllConfig').val(),
                plateGridConfig: true,
                prefix: key,
                id: 'poolTubeId',
                sequenceName: 'poolTubeId',
                idIdx: 2,
                // First N columns are always required and will always be shown.
                additionalColumnsIdx: 3,
                containerIdGen: $('#containerIdGen').val(),
                error: {
                    equalToIdError: "Value scanned must be matched with Pool Tube Id",
                    empty: "No pool tubes available for processing."
                }
            };
        case 'sampleList':
        default:
            return {
                validateOrTransfer: $('#sampleList_validateOrTransfer').val(),
                indicator: $('#printIndicator').val(),
                counterConfig: $('#counterConfig').val(),
                scanAllConfig: $('#scanAllConfig').val(),
                plateGridConfig: $('#plateGridConfig').val(),
                prefix: key,
                sequenceName: 'tubeId',
                id: 'specimenId',
                idIdx: 2,
                // First N columns are always required and will always be shown.
                additionalColumnsIdx: 5,
                containerIdGen: $('#sampleIdGen').val(),
                error: {
                    equalToIdError: "Value scanned must be matched with Sample Id",
                    empty: "No samples available for processing."
                }
            };

    }

}
