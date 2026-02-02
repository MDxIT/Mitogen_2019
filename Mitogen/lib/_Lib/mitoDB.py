#------------------------------------------------------------------------#
#                            UNIconnect LC                               #
#                 UNIFLOW Demonstration Process Definition               #
#                       CONFIDENTIAL INFORMATION                         #
#        Copyright (C) 2001-2016 UNIConnect LC.  All rights reserved.    #
#------------------------------------------------------------------------#

class apiSQLParm(object):
  def __init__(self, datatype="", value=""):
    self.datatype = type
    self.value = value

class apiSQLBundle(object):
  def __init__(self):
    self.query = ""
    self.parms = []

class apiQueryQuickList(object):
  def __init__(self):
    self.queryList = []

  def addQuery(self, query):
    self.queryList.append(apiSQLBundle())
    self.queryList[len(self.queryList)-1].query = query

  def addParm(self, datatype, value):
    self.queryList[len(self.queryList)-1].parms.append(apiSQLParm())
    self.queryList[len(self.queryList)-1].parms[len(self.queryList[len(self.queryList)-1].parms)-1].datatype = datatype
    self.queryList[len(self.queryList)-1].parms[len(self.queryList[len(self.queryList)-1].parms)-1].value = value

class apiSQLBundleResult(object):
  def __init__(self):
    self.hadFailure = False
    self.results = []

class apiDatabaseQueries:
  def __init__(self, sw):
    self.checkProcessingQueueForOrder = "select containerId from apiProcessingQueue WHERE orderId = ? and (result != 'fail' or result is null) ORDER BY eventId, id"
    self.checkRequisitionForOrder = "select id, requestId from requestForms where requestId = ?"
    self.checkForContainer = "select containerId, containerType, coalesce(projectId, '') as projectId from containers WHERE containerId = ? and (projectId like ?  or  (? = '%' and projectId IS NULL ))"
    self.checkForContainerOnQueue = "select q.containerId, c.containerType from queues q inner join containers c on q.containerId = c.containerId where c.containerId = ? and step = ? and (projectId like ?  or  (? = '%' and projectId IS NULL ))"
    self.getContainersForQueue = "select q.containerId, c.containerType from queues q inner join containers c on q.containerId = c.containerId where step = ? and (projectId like ?  or  (? = '%' and projectId IS NULL ))"
    self.getPendingForProcessing = "select id, containerId, orderId, task, coalesce(nextQueue, '') as nextQueue, processingStart, processingEnd, result, assignedThread, eventId, fileName from apiProcessingQueue where processingStart is null order by task"
    self.getHL7TaskMappings = "select id, segment, fieldCount from apiHL7TaskMapping where task = ?"
    self.getHL7FieldMappings = "select fieldNo, subFieldNo, fieldName from apiHL7TaskFieldMapping where apiHL7TaskId = ? order by fieldNo, subFieldNo"
    self.getRequestIdFromSpecimenId = "select requestId from requestSpecimens where specimenId = ?"
    self.getRequestIdFromCustomerSpecimenId = "select requestId from requestSpecimens where externalIdentifier = ?"
    self.getRequestIdFromSpecimenId = "select requestId from requestSpecimens where specimenId = ?"
    self.getSpecimen = "SELECT containerId FROM contents WHERE containerId LIKE ? AND attribute = ? UNION DISTINCT SELECT containerid FROM queues WHERE containerId LIKE ? AND step = ?"
    self.getQueueContainers = "SELECT containerId FROM queues WHERE step = ?"
    self.switchboard = sw
    self.connection = self.switchboard.connection

  def getData(self, query, parms):
    try:
      apiQuery = self.connection.prepareStatement(query)

      parmNumber = 0
      self.switchboard.log(query)

      for parm in parms:
        parmNumber += 1
        self.switchboard.log(parm.datatype)
        self.switchboard.log(str(parm.value))
        if parm.datatype == "string":
          apiQuery.setString(parmNumber, parm.value)
        elif parm.datatype == "long":
          apiQuery.setLong(parmNumber, parm.value)
        elif parm.datatype == "boolean":
          apiQuery.setBoolean(parmNumber, parm.value)
        elif parm.datatype == "date":
          apiQuery.setDate(parmNumber, parm.value)
        else:
          apiQuery.setObject(parmNumber, parm.value)

      return apiQuery.executeQuery()

    except Exception as e:
      self.switchboard.log(e.message)
      return None

class apiDatabaseActions:
  def __init__(self, sw):
    self.procQueueOrderFile = "insert into apiProcessingQueue (containerId, orderId, task, nextQueue, eventId, fileName) values (?,?,?,?,?,?)"
    self.procDeQueue = "delete from queues where containerId = ? and step like ?"
    self.procInsertQueue = "insert into queues (containerId, step, eventId) values (?,?,?)"
    self.procStartHL7Processing = "update apiProcessingQueue set processingStart = NOW() where id = ?"
    self.procEndHL7Processing = "update apiProcessingQueue set processingEnd = NOW(), result = ? where id = ?"
    self.procSaveLogEntry = "insert into apiLogging (logName, logMessageType, logMessageSource, logTime, logMessage, eventId) values (?, ?, ?, NOW(), ?, ?)"
    self.procCreateContainer = "insert into containers (containerId, containerType, projectId, eventId) values (?,?,?,?)"
    self.procCreateContainerHistory = "insert into containerHistory (containerId, eventId) values (?,?)"
    self.procLogAPIResponse = "insert into apiCommunicationHistory (CommDate, CommData, endpoint, resultData) values (now(),?,?,?)"
    self.switchboard = sw
    self.connection = self.switchboard.connection

  def executeUpdateList (self, queries, cpRollback):
    bundleResult = apiSQLBundleResult()
    sp = self.connection.setSavepoint()
    self.switchboard.log("Query Bundle Size: " + `len(queries)`)

    try:
      for queryBundle in queries:
        self.switchboard.log("Processing Query Bundle")
        self.switchboard.log(str(queryBundle.query))
        if bundleResult.hadFailure:
          bundleResult.results.append(False)
        else:

          if self.executeUpdate(queryBundle.query, queryBundle.parms):
            self.switchboard.log("query successful")
            bundleResult.results.append(True)
          else:
            self.switchboard.log("query failure")
            bundleResult.results.append(False)
            bundleResult.hadFailure = True
            if cpRollback:
              self.connection.rollback(sp)

      if bundleResult.hadFailure == False:
        self.connection.releaseSavepoint(sp)

      return bundleResult

    except Exception as e:
      if cpRollback:
        self.connection.rollback(sp)
      bundleResult.hadFailure = True
      self.switchboard.log(e.message)
      return bundleResult

  def executeUpdate (self, query, parms):
    try:
      sqlAction = self.connection.prepareStatement(query)

      parmNumber = 0
      self.switchboard.log(query)

      for parm in parms:
        parmNumber += 1
        didSomething = False
        self.switchboard.log(parm.datatype)
        self.switchboard.log(str(parm.value))
        if parm.datatype == "string":
          sqlAction.setString(parmNumber, parm.value)
          didSomething = True
        if parm.datatype == "long":
          sqlAction.setLong(parmNumber, parm.value)
          didSomething = True
        if parm.datatype == "boolean":
          sqlAction.setBoolean(parmNumber, parm.value)
          didSomething = True
        if parm.datatype == "date":
          sqlAction.setDate(parmNumber, parm.value)
          didSomething = True
        if parm.datatype == "decimal":
          sqlAction.setBigDecimal(parmNumber, parm.value)
          didSomething = True
        if didSomething == False:
          sqlAction.setObject(parmNumber, parm.value)

      sqlAction.executeUpdate()
      return True

    except Exception as e:
      self.switchboard.log(e.message)
      return False

if __name__ == "__main__":
    pass