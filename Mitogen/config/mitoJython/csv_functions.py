'''
  #
  #   ######## CSV CREATION FUNCTIONS ########
  #
  #     # See groupingContainer.py for implementation
  #
'''

import json
from com.uniconnect.uniflow.exception import SystemException
from java.sql import SQLException

'''
  # Returns array of value key pairs
  # 
  # @function getJsonArray
  # @param<resultSet> rs
  # @param<int> columnNum
  # 
  # @return<array> jsonArr
  #
'''
def getJsonArray(switchboard, rs, colNum):
  # Init array
  jsonArr = []
  try:
    # Loop rows
    while rs.next():
      # Loop Columns
      for i in range(1,colNum + 1):
        # Convert result to JSON
        thisJSON = json.loads(rs.getString(i))
        # Add JSON to array
        jsonArr.append(thisJSON)

    switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'true')
    return jsonArr
  except Exception as e:
    switchboard.log("---*** EXCEPTION IN CSV_FUNCTIONS AT GETJSONARRAY ***---")
    switchboard.log("ERROR MESSAGE: " + str(e.message))
    switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')
  except SQLException as e:
    switchboard.log("---*** SQLException IN CSV_FUNCTIONS AT GETJSONARRAY ***----")
    switchboard.log(str(e.message))
    switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')
  except BaseException as e:
    switchboard.log("---*** PYTHON EXCEPTION IN CSV_FUNCTIONS AT GETJSONARRAY ***---")
    switchboard.log("ERROR MESSAGE: " + str(e.message))
    switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')
  
