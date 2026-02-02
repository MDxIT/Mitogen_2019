from com.uniconnect.uniflow.exception import SystemException
from java.sql import SQLException

def determine_interpretation(result, limits_interpretation):
  ''' Returns interpretation based on the result and configured limits

    Args:
      result: string
      limits_interpretation: dictionary

    Returns:
      interpretation: string
    
  '''

  try:

    limits_dict = limits_interpretation['limits']
    interp_dict = limits_interpretation['interpretation']

    limit_type = limits_dict['limit_type']

    discrete = limits_dict['discrete_limit']

    if limit_type == 'TARGET':
      if result == discrete:
        return interp_dict['equal_discrete']
      else:
        return interp_dict['not_equal_discrete']

    elif limit_type in ['THRESHOLD', 'RANGE']:

      result = float(result)
      lower = float(limits_dict['lower_limit'])
      upper = float(limits_dict['upper_limit'])

      if result < lower:
        return interp_dict['below_lower']
      elif result == lower:
        return interp_dict['equal_lower']
      elif result > lower and result < upper:
        return interp_dict['between_lower_upper']
      elif result == upper:
        return interp_dict['equal_upper']
      elif result > upper:
        return interp_dict['above_upper']
      else:
        return ''

  except KeyError as e:
    self.switchboard.log("---*** KEY ERROR AT MANUAL_UPLOAD ***----")
    self.switchboard.log("ERROR MESSAGE: " + str(e.message))
    self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')
    raise
    return


def getLimitType(low, up, dis):
  '''Determines the limit type
  '''
  if dis:
    return 'TARGET'
  elif low and up:
    if low == up:
      return 'THRESHOLD'
    elif low != up:
      return 'RANGE'
  else:
    return ''

def getLimits(switchboard, analysisDataDefinitionId):
  ''' Gets the data needed to determine the correct interpretation

    Args:
      swithcboard: object
      analysisDataDefinitionId: string

    Returns:
      limits_interpretation: dictionary
        Contains limits and interpreation data
  '''

  limits_interpretation = 'no_limits'

  rQuery = '''   
    SELECT 
      adl.lowerLimit,
      adl.upperLimit,
      adl.discrete,
      adi.belowLower,
      adi.equalLower,
      adi.betweenLowerUpper,
      adi.equalUpper,
      adi.aboveUpper,
      adi.equalDiscrete,
      adi.notEqualDiscrete
    FROM analysisDataLimits adl
    INNER JOIN analysisDataInterpretation adi
      ON adi.analysisDataLimitsId = adl.id
    WHERE adl.analysisDataDefinitionId = ?
  '''
  try:
    rStmt = switchboard.connection.prepareStatement(rQuery)
    rStmt.setString(1, analysisDataDefinitionId)
    rRs = rStmt.executeQuery()

    if rRs.next():
      lower_limit = rRs.getString('lowerLimit')
      upper_limit = rRs.getString('upperLimit')
      discrete_limit = rRs.getString('discrete')

      limit_type = getLimitType(lower_limit, upper_limit, discrete_limit)
      limits = {
            'limit_type': limit_type, 
            'lower_limit': lower_limit, 
            'upper_limit': upper_limit,
            'discrete_limit': discrete_limit
      }


      below_lower = rRs.getString('belowLower')
      equal_lower = rRs.getString('equalLower')
      between_lower_upper = rRs.getString('betweenLowerUpper')
      equal_upper = rRs.getString('equalUpper')
      above_upper = rRs.getString('aboveUpper')
      equal_discrete = rRs.getString('equalDiscrete')
      not_equal_discrete = rRs.getString('notEqualDiscrete')


      interpretation = {
              'below_lower': below_lower, 
              'equal_lower': equal_lower, 
              'between_lower_upper': between_lower_upper, 
              'equal_upper': equal_upper, 
              'above_upper': above_upper, 
              'equal_discrete': equal_discrete,
              'not_equal_discrete': not_equal_discrete
      }

      limits_interpretation = {'limits': limits, 'interpretation': interpretation}

    return limits_interpretation

  except SQLException as e:
    switchboard.log("---*** SQLException AT MANUAL_UPLOAD ***----")
    switchboard.log("ERROR MESSAGE: " + str(e.message))
    switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')
    raise
    return
  except KeyError as e:
    switchboard.log("---*** KEY ERROR AT MANUAL_UPLOAD ***----")
    switchboard.log("ERROR MESSAGE: " + str(e.message))
    switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')
    raise
    return
