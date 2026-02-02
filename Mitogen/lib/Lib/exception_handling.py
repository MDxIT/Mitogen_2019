'''
  # EndRun class
  #
'''
from java.sql import SQLException

from create_run import *
from run import Run
from poolRun import PoolRun
from create_poolRun import *
from general_functions import *

def createSingleRun(switchboard, originalRun, eventId):
  try:
    ###     get new runId
    errorLocation = 'BEGIN Run Next Step get new runId'
    newRunId = getNewRunId(switchboard)
    print 'newRunId: ', newRunId

    errorLocation = 'BEGIN Run Next Step get original run Object'
    origRun = Run(switchboard, originalRun)

    errorLocation = 'BEGIN Run Next Step original getRunId'
    originalRunId = origRun.getRunId()
    print 'ORIGINAL RUN: ', originalRunId

    ## Get run variables using original run
    errorLocation = 'BEGIN Run Next Step original getMethodId'
    specimenMethodsId =  origRun.getMethodId()
    print 'ORIGINAL current methodId: ', specimenMethodsId

    errorLocation = 'BEGIN Run Next Step original getCurrentContainer'
    currentContainerId = origRun.getCurrentContainer()
    print 'original Current container: ', currentContainerId

    errorLocation = 'BEGIN Run Next Step original getCurrentParent'
    currentParentId = origRun.getCurrentParent()
    print 'ORIGINAL current Parent: ', currentParentId

    errorLocation = 'BEGIN Run Next Step original getCurrentPosition'
    currentParentPosition = origRun.getCurrentPosition()
    print 'ORIGINAL current Position: ', currentParentPosition

    errorLocation = 'BEGIN Run Next Step original getProcessRunWorkflowParentRunId'
    parentWorkflowSpecimenRunId = getProcessRunWorkflowParentRunId(switchboard, originalRunId)
    print 'ORIGINAL current parentWorkflowSpecimenRunId: ', parentWorkflowSpecimenRunId

    errorLocation = 'BEGIN Run Next Step original getRunType'
    runType = getRunType(switchboard, originalRunId)
    print 'ORIGINAL current runType: ', runType

    ###     create new run using CreateRun Class
    errorLocation = 'BEGIN Run Next Step create run object'
    ## Make run object
    newCreatedRun = CreateRun(switchboard, newRunId, specimenMethodsId, runType, currentContainerId, currentParentId, currentParentPosition, parentWorkflowSpecimenRunId, eventId, eventId)

    return newCreatedRun
  except Exception as e:
    switchboard.log("---*** EXCEPTION ***---")
    switchboard.log("ERROR LOCATION: " + errorLocation)
    switchboard.log("ERROR MESSAGE: " + str(e.message))
    switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')
    raise
    return
  except StandardError as e:
    switchboard.log("---*** STANDRAD PYTHON ERROR ***---")
    switchboard.log("ERROR LOCATION: " + errorLocation)
    switchboard.log("ERROR MESSAGE: " + str(e.message))
    switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')
    raise
    return
  except SystemException as e:
    switchboard.log("---*** UNIFlow SystemException ***----")
    switchboard.log("ERROR LOCATION: " + errorLocation)
    switchboard.log("ERROR MESSAGE: " + str(e.message))
    switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')
    raise
    return
  except SQLException as e:
    switchboard.log("---*** SQLException ***----")
    switchboard.log("ERROR LOCATION: " + errorLocation)
    switchboard.log("ERROR MESSAGE: " + str(e.message))
    switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')
    raise
    return
  except BaseException as e:
    switchboard.log("---*** PYTHON EXCEPTION ***---")
    switchboard.log("ERROR LOCATION: " + errorLocation)
    switchboard.log("ERROR MESSAGE: " + str(e.message))
    switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')
    raise
    return
  except TypeError as e:
    switchboard.log("---*** TYPE ERROR ***----")
    switchboard.log("ERROR LOCATION: " + errorLocation)
    switchboard.log("ERROR MESSAGE: " + str(e.message))
    switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')
    raise
    return
  except:
    switchboard.log("---*** UNSPECIFIED ERROR ***---")
    switchboard.log("ERROR LOCATION: " + errorLocation)
    switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')
    raise
    return



def createSinglePoolRun(switchboard, originalPoolRun, eventId):
  try:
    ###     get new poolRunId
    errorLocation = 'BEGIN PoolRun Next Step get new poolRunId'
    newPoolRunId = getNewPoolRunId(switchboard)
    print 'newPoolRunId: ', newPoolRunId

    errorLocation = 'BEGIN PoolRun Next Step get original run Object'
    origPoolRun = PoolRun(switchboard, originalPoolRun)

    errorLocation = 'BEGIN PoolRun Next Step original getRunId'
    originalPoolRunId = origPoolRun.getPoolRunId()
    print 'ORIGINAL Pool RUN: ', originalPoolRunId

    errorLocation = 'BEGIN PoolRun Next Step original getCurrentContainer'
    currentContainerId = origPoolRun.getCurrentContainer()
    print 'original Current Pool container: ', currentContainerId

    errorLocation = 'BEGIN PoolRun Next Step original getCurrentParent'
    currentParentId = origPoolRun.getCurrentParent()
    print 'ORIGINAL current Pool Parent: ', currentParentId

    errorLocation = 'BEGIN PoolRun Next Step original getCurrentPosition'
    currentParentPosition = origPoolRun.getCurrentPosition()
    print 'ORIGINAL current Pool Parent Position: ', currentParentPosition

    errorLocation = 'BEGIN PoolRun Next Step original getProcessPoolRunWorkflowParentRunId'
    parentWorkflowPoolRunId = getProcessPoolRunWorkflowParentRunId(switchboard, originalPoolRunId)
    print 'ORIGINAL current parentWorkflowPoolRunId: ', parentWorkflowPoolRunId

    errorLocation = 'BEGIN PoolRun Next Step original getRunType'
    runType = getPoolRunType(switchboard, originalPoolRunId)
    print 'ORIGINAL current runType: ', runType


    ###     create new run using CreateRun Class
    errorLocation = 'BEGIN PoolRun Next Step create PoolRun object'
    ## Make run object
    newCreatedPoolRun = CreatePoolRun(switchboard, newPoolRunId, runType, currentContainerId, currentParentId, currentParentPosition, parentWorkflowPoolRunId, originalPoolRun, eventId, eventId)
    return newCreatedPoolRun

  except Exception as e:
    switchboard.log("---*** EXCEPTION ***---")
    switchboard.log("ERROR LOCATION: " + errorLocation)
    switchboard.log("ERROR MESSAGE: " + str(e.message))
    switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')
    raise
    return
  except StandardError as e:
    switchboard.log("---*** STANDRAD PYTHON ERROR ***---")
    switchboard.log("ERROR LOCATION: " + errorLocation)
    switchboard.log("ERROR MESSAGE: " + str(e.message))
    switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')
    raise
    return
  except SystemException as e:
    switchboard.log("---*** UNIFlow SystemException ***----")
    switchboard.log("ERROR LOCATION: " + errorLocation)
    switchboard.log("ERROR MESSAGE: " + str(e.message))
    switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')
    raise
    return
  except SQLException as e:
    switchboard.log("---*** SQLException ***----")
    switchboard.log("ERROR LOCATION: " + errorLocation)
    switchboard.log("ERROR MESSAGE: " + str(e.message))
    switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')
    raise
    return
  except BaseException as e:
    switchboard.log("---*** PYTHON EXCEPTION ***---")
    switchboard.log("ERROR LOCATION: " + errorLocation)
    switchboard.log("ERROR MESSAGE: " + str(e.message))
    switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')
    raise
    return
  except TypeError as e:
    switchboard.log("---*** TYPE ERROR ***----")
    switchboard.log("ERROR LOCATION: " + errorLocation)
    switchboard.log("ERROR MESSAGE: " + str(e.message))
    switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')
    raise
    return
  except:
    switchboard.log("---*** UNSPECIFIED ERROR ***---")
    switchboard.log("ERROR LOCATION: " + errorLocation)
    switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')
    raise
    return

    
