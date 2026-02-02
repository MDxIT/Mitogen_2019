/**
* Calculates (C1)(V1) = (C2)(V2) concentrations and volumes of sample to use and diluent to use for the last
*   row of the table.
* (1) Checks to see if concentration can be reached with a final volume greater than minimum required final
*     volume, but still less than the maximum allowed volume.
* (2) Checks to
**/
function dilutionRowCalculations (lastRow, normType) {

  var initialConcentration = parseFloat( lastRow.children('td').children('.initialConcentration').val() );
  var initialVolume = parseFloat( lastRow.children('td').children('.initialVolume').val() );

  var concentrationGoal = parseFloat( $('#finalConcentration').val() );
  var volumeGoal = parseFloat( $('#finalVolume').val() );


  var maxVolume = parseFloat( $('#maxVolume').val() );
  var minVolume = parseFloat( $('#minVolume').val() );

  var finalConcentration = concentrationGoal; //for use in row
  var finalVolume = volumeGoal; //for use in row

  var sampleVolume = initialVolume;
  var diluentVolume = finalVolume - sampleVolume;

  console.log(initialConcentration + ' -- ' + initialVolume + ' -- ' +  concentrationGoal + ' -- ' + volumeGoal);

  var valueToReturn = 'false';

  var requiredTransfer = $('#requireTransfer').val()


  // SOLVING FOR V2
  if(requiredTransfer == 'No') {

    finalVolume = initialConcentration * initialVolume / concentrationGoal;

    // Dilution needed?

    if(initialConcentration >= concentrationGoal) {

      /** Check for final volume using total sample volume
      * v2 = c1 * v1 / c2
      * final volume must be greater than or equal to the volume goal
      * final volume must be less than or equal to the maximum volume
      **/
      if ( finalVolume >= volumeGoal && finalVolume <= maxVolume ) {

        valueToReturn = 'true'; //success
        lastRow.children('td').children('.dilutionContainer').addClass('destinationContainer');

      } else {

        finalVolume = volumeGoal;

        /** Check for sample volume
        * v1 = c2 * v2 / c1
        * initial volume must be greater than or equal to the minimum volume
        * initial volume must be less than or equal to the initial volume
        **/
        sampleVolume = concentrationGoal * finalVolume / initialConcentration;

        if ( sampleVolume >= minVolume && sampleVolume <= initialVolume ) {

          valueToReturn = 'true'; //success
          lastRow.children('td').children('.dilutionContainer').addClass('destinationContainer');

        } else {

          sampleVolume = minVolume;

          /** Check for final volume using minimum sample volume
          * v2 = c1 * minVolume / c2
          * final volume must be greater than or equal to the volume goal
          * final volume must be less than or equal to the maximum volume
          **/
          finalVolume = initialConcentration * sampleVolume / concentrationGoal;

          if ( finalVolume >= volumeGoal && finalVolume <= maxVolume ) {

            valueToReturn = 'true'; //success
            lastRow.children('td').children('.dilutionContainer').addClass('destinationContainer');

          } else {

            finalVolume = maxVolume;

            /** Check for v1 using the maximum volume
            * v1 = c2 * maxVolume / c1
            * sample volume must be greater than or equal to the minimum volume
            * sample volume must be less or equal to the initial volume
            **/
            sampleVolume = concentrationGoal * finalVolume / initialConcentration;

            if ( sampleVolume >= minVolume && sampleVolume <= initialVolume ) {

              valueToReturn = 'true'; //success
              lastRow.children('td').children('.dilutionContainer').addClass('destinationContainer');

            } else {

              sampleVolume = initialVolume;

              /** Check for c2 with maximum volume as the final volume
              * c2 = c1 * v1 / maxVolume
              * final concentration equals the concentration goal
              **/
              finalConcentration = initialConcentration * initialVolume / finalVolume;

              if ( finalConcentration == concentrationGoal ) {

                valueToReturn = 'true'; //success
                lastRow.children('td').children('.dilutionContainer').addClass('destinationContainer');

              } else {

                sampleVolume = minVolume;
                finalVolume = volumeGoal;

                /** Check for c2 with sample volume as minimum volume
                * c2 = c1 * minVolume / v2
                * final concentration equals the concentration goal
                **/
                finalConcentration = initialConcentration * sampleVolume / finalVolume;

                if ( finalConcentration == concentrationGoal ) {

                  valueToReturn = 'true'; //success
                  lastRow.children('td').children('.dilutionContainer').addClass('destinationContainer');

                } else {

                  finalVolume = maxVolume;

                  /** Get the concentration with the minimum volume as the sample volume
                  * and the maximum volume as the final volume
                  * c2 = c1 * minVolume / maxVolume
                  * finalConcentration must be greater than the concentration Goal
                  **/
                  finalConcentration = initialConcentration * sampleVolume / finalVolume;

                  if ( finalConcentration < concentrationGoal ) {
                    valueToReturn = 'notPossible';
                  }

                } // c2 = c1 * minVolume / v2 FAIL

              } // c2 = c1 * v1 / maxVolume FAIL

            }// v1 = c2 * maxVolume / c1 FAIL

          } //v2 = c1 * minVolume / c2 FAIL

        } // v1 = c2 * v2 / c1 FAIL

      } // v2 = c1 * v1 / c2 FAIL

    } // concentration FAIL

  
  } else { // Solve for V1

    sampleVolume = (finalConcentration * finalVolume) / initialConcentration ;

    // Concentration needed?

    if(initialConcentration >= concentrationGoal) {

      /** Check for final volume using total sample volume
      * v2 = c1 * v1 / c2
      * final volume must be greater than or equal to the volume goal
      * final volume must be less than or equal to the maximum volume
      **/
      if ( finalVolume <= maxVolume && diluentVolume <= maxVolume && finalVolume >= minVolume && diluentVolume >= minVolume ) {

        valueToReturn = 'true'; //success
        lastRow.children('td').children('.dilutionContainer').addClass('destinationContainer');


      } // v1 = c2 * v2 / c1 FAIL

    } // concentration FAIL

  }

  if (valueToReturn != 'notPossible'){
    // Populate current row values
    lastRow.children('td').children('.finalConcentration').val( finalConcentration.toFixed(2) );
    lastRow.children('td').children('.finalVolume').val( finalVolume.toFixed(2) );
    lastRow.children('td').children('.sampleVolume').val( sampleVolume.toFixed(2) );
    diluentVolume = finalVolume - sampleVolume;
    lastRow.children('td').children('.diluentVolume').val( diluentVolume.toFixed(2) );
  }

  if(normType == 'normalization') {
    lastRow.children('td').children('.normResult').val('dilute');
  }


  if (valueToReturn == 'false') {
    if(normType == 'serialDilution') {
      inputTableAddRow('dilutionTable', true);
      // Populate new row intial values
      $('#dilutionTable tbody tr:last').children('td').children('.printBarcodeBtn').val( 'Print' );
      $('#dilutionTable tbody tr:last').children('td').children('.initialConcentration').val( finalConcentration.toFixed(2) );
      $('#dilutionTable tbody tr:last').children('td').children('.initialVolume').val( finalVolume.toFixed(2) );
      $('#dilutionTable tbody tr:last').children('td').children('.dilutionContainer').attr('id', $('#dilutionTable tbody tr:last').children('td').children('.dilutionContainer').attr('name'));
    }
    if(normType == 'normalization') {
      if (concentrationGoal > initialConcentration) {
        lastRow.children('td').children('.normResult').val('concentrate');
        lastRow.children('td').children('.sampleVolume').val(initialVolume);
        lastRow.children('td').children('.diluentVolume').val('0')
      } else {
        lastRow.children('td').children('.normResult').val('serial dilute');
      }
    }
  }

  return valueToReturn;

}
