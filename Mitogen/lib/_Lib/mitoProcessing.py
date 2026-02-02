import os
import shutil
import sys
from datetime import datetime
import mitoDB
import com.uniconnect.uniflow as uniflow
import mitoHL7
from java.sql import SQLException

class apiHL7FieldMapping(object):
  def __init__(self):
    self.segment = ""
    self.mapping = ""
    self.subMapping = {}

class apiHL7Processing(object):
  def __init__(self, uSwitchBoard, eventId, configPath):
    self.switchboard = uSwitchBoard
    self.eventId = eventId
    self.configPath = configPath
    self.nodeTree = []

  def addFieldVal(self, parent, fieldName, value):
    value = value if value is not None else ''
    parent.add(fieldName, mitoHL7.apiHL7Helper().removeEncoders(value))

  def addFields(self, parent, dataFields, fieldNames, delim='|'):
    fields = fieldNames.split(delim)
    if fields[0] != dataFields[0]:
      return

    specimenIdSuffix = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z']

    for i in range(1, len(fields)):
      if len(fields[i]) > 0:
        if len(dataFields) < i + 1:
          val = ''
        else:
          try:
            if fields[i] == 'patientDob':
              val = datetime.strptime(dataFields[i], '%Y%m%d').strftime('%Y-%m-%d')
            elif fields[i] in ['specimenDate', 'spmSpecimenCollectionDate'] and dataFields[i]:
              val = datetime.strptime(dataFields[i], '%Y%m%d%H%M%S').strftime('%Y-%m-%d')
            elif fields[i] == 'spmSpecimenId':
              sqlSelectSpecimen = "SELECT containerId FROM contents WHERE containerId LIKE ? AND attribute = ? UNION DISTINCT SELECT containerid FROM queues WHERE containerId LIKE ? AND step = ?"
              ps = self.switchboard.connection.prepareStatement(sqlSelectSpecimen)
              ps.setString(1, dataFields[i] + "%")
              ps.setString(2, "self")
              ps.setString(3, dataFields[i] + "%")
              ps.setString(4, "Receive Specimens")
              self.switchboard.resultSet = ps.executeQuery()
              while self.switchboard.resultSet.next():
                potentialSpecimens.append(self.switchboard.resultSet.getString(1))

              if dataFields[i] not in potentialSpecimens:
                val = dataFields[i]
                potentialSpecimens.append(dataFields[i])
              else:
                for sf in specimenIdSuffix:
                  s = dataFields[i] + "-" + sf
                  if s not in potentialSpecimens:
                    val = s
                    potentialSpecimens.append(s)
                    break
            else:
              val = dataFields[i]
          except Exception as e:
            val = dataFields[i]

        self.addFieldVal(parent, fields[i], val)

  def addSecondaryFields(self, parent, secondaryField, fieldNames):
    self.addFields(parent, ('placeHolder^' + secondaryField).split('^'), 'placeHolder^' + fieldNames, '^')


  def runTask(self, taskName, handlerName):
    destPath = self.configPath + "private/hl7/incoming"
    donePath = self.configPath + "private/hl7/done"

    potentialSpecimens = []

    dbQueries = mitoDB.apiDatabaseQueries(self.switchboard)
    parms = []
    rs = dbQueries.getData(dbQueries.getPendingForProcessing, parms)
    while rs.next():
      rowId = rs.getLong("id")
      actions = mitoDB.apiDatabaseActions(self.switchboard)
      qry = mitoDB.apiQueryQuickList()

      # Reads the HL7 from the file
      hl7 = rs.getString("fileName")
      nextQueue = rs.getString("nextQueue")
      orderContainerId = rs.getString("containerId")
      orderTask = rs.getString("task")
      hl7Error = False

      if os.path.exists(hl7) and orderTask == taskName:
        qry.addQuery(actions.procStartHL7Processing)
        qry.addParm("long", rowId)
        actions.executeUpdateList(qry.queryList, False)
        self.switchboard.log('**************')

        # Builds the node tree from the file based on the mapping tables
        # ------------------------------------------------------------------------------
        hl7Tree = uniflow.Node("HL7","")
        try:
          try:
            with open(hl7, 'rUb') as f:
              mtgNode = hl7Tree.add("MITOGEN","")
              mtgFields = []
              mtgFields.append("MITOGEN")
              mtgFields.append(orderContainerId)
              mtgFields.append("")
              self.addFields(mtgNode, mtgFields, 'MITOGEN|containerId|orderId')
              dbQueries2 = mitoDB.apiDatabaseQueries(self.switchboard)
              parms = []
              parms.append(mitoDB.apiSQLParm())
              parms[len(parms)-1].datatype = "string"
              parms[len(parms)-1].value = orderTask

              rs2 = dbQueries2.getData(dbQueries2.getHL7TaskMappings, parms)

              mappingMatrix = {}
              try:
                while rs2.next():
                  mappingId = rs2.getInt("id")
                  mappingSegment = rs2.getString("segment")
                  mappingMatrix[mappingSegment] = apiHL7FieldMapping()
                  mappingMatrix[mappingSegment].segment = mappingSegment
                  parms = []
                  parms.append(mitoDB.apiSQLParm())
                  parms[len(parms)-1].datatype = "long"
                  parms[len(parms)-1].value = mappingId
                  rs3 = dbQueries.getData(dbQueries.getHL7FieldMappings, parms)
                  newFields = ('|'*(rs2.getInt("fieldCount")-1)).strip().split('|')
                  while rs3.next():
                    lFieldNo = rs3.getInt("fieldNo")
                    lSubFieldNo = rs3.getInt("subFieldNo")
                    if lSubFieldNo > 0:
                      if lSubFieldNo == 1:
                        mappingMatrix[mappingSegment].subMapping[lFieldNo] = newFields[lFieldNo]
                        newFields[lFieldNo] = ""
                      mappingMatrix[mappingSegment].subMapping[lFieldNo] += "^"
                      mappingMatrix[mappingSegment].subMapping[lFieldNo] += rs3.getString("fieldName")
                    else:
                      newFields[lFieldNo] = rs3.getString("fieldName")

                  mappingMatrix[mappingSegment].mapping = '|'.join(newFields)

                for line in f:
                  fields = line.strip().split('|')
                  if fields[0] in mappingMatrix:
                    mshNode = hl7Tree.add(fields[0],"")
                    mappingSegment = fields[0]
                    self.addFields(mshNode, fields, mappingMatrix[fields[0]].mapping)
                    for key in mappingMatrix[mappingSegment].subMapping:
                      if len(fields) > (key - 1):
                        self.addSecondaryFields(mshNode, fields[key], mappingMatrix[mappingSegment].subMapping[key])

              # add the node tree to the object node property for post processing later
              # ------------------------------------------------------------------------------
                self.switchboard.log('*** SAVE THE HL7 TREE ***')
                self.switchboard.log(hl7Tree.toString())
                self.nodeTree.append(hl7Tree)
              # ------------------------------------------------------------------------------

              except Exception as e:
                self.switchboard.log(str(e.message))
                qry = mitoDB.apiQueryQuickList()
                qry.addQuery(actions.procEndHL7Processing)
                qry.addParm("string", "hl7ProcessingFailed")
                qry.addParm("long", rowId)
                actions.executeUpdateList(qry.queryList, False)
                hl7Error = True
          except Exception as e:
            self.switchboard.log(str(e.message))
            qry = mitoDB.apiQueryQuickList()
            qry.addQuery(actions.procEndHL7Processing)
            qry.addParm("string", "hl7ProcessingFailed")
            qry.addParm("long", rowId)
            actions.executeUpdateList(qry.queryList, False)
            hl7Error = True

          if self.switchboard.resultForest is not None:
            self.switchboard.resultForest = uniflow.Node("resultForest", "")

          if not hl7Error == True:
            didProcessing = False

            # This is where the response instructions are executed
            # ------------------------------------------------------------------------------
            if handlerName is not None:
              switchboard_temp = uniflow.Switchboard()
              try:
                switchboard_temp.isUpdateTransaction = True
                switchboard_temp.resultForest.add(hl7Tree)
                switchboard_temp.eventId = self.eventId
                switchboard_temp.stepName = self.switchboard.stepName
                switchboard_temp.executeInstructions(handlerName.head)
                switchboard_temp.connection.commit()
                didProcessing = True
              except uniflow.exception.SystemException as e:
                self.switchboard.log(str(e.message))
                didProcessing = False
                if switchboard_temp is not None:
                  try:
                    switchboard_temp.rollback()
                  except Exception as e:
                    pass
              except java.sql.SQLException as e:
                self.switchboard.log(str(e.message))
                didProcessing = False
                if switchboard_temp is not None:
                  try:
                    switchboard_temp.rollback()
                  except Exception as e:
                    pass
              except Exception as e:
                self.switchboard.log(str(e.message))
                didProcessing = False
                if switchboard_temp is not None:
                  try:
                    switchboard_temp.rollback()
                  except Exception as e:
                    pass
              finally:
                if switchboard_temp is not None:
                  switchboard_temp.closeDbResources()
                  switchboard_temp.connection.expireLease()
            # ------------------------------------------------------------------------------

            qry = mitoDB.apiQueryQuickList()
            if didProcessing == True:
              if nextQueue != "":
                qry.addQuery(actions.procInsertQueue)
                qry.addParm("string", orderContainerId)
                qry.addParm("string", nextQueue)
                qry.addParm("long", self.eventId)

              qry.addQuery(actions.procEndHL7Processing)
              qry.addParm("string", "C")
              qry.addParm("long", rowId)
              actions.executeUpdateList(qry.queryList, False)

              hl7Done = "%s/%s" % (donePath, os.path.basename(hl7))
              shutil.move(hl7, hl7Done)
            else:
              qry.addQuery(actions.procEndHL7Processing)
              qry.addParm("string", "errorWhileProcessing")
              qry.addParm("long", rowId)
              actions.executeUpdateList(qry.queryList, False)
        except Exception as e:
          self.switchboard.log(str(e.message))
          qry = mitoDB.apiQueryQuickList()
          qry.addQuery(actions.procEndHL7Processing)
          qry.addParm("string", "errorReadingHL7")
          qry.addParm("long", rowId)
          actions.executeUpdateList(qry.queryList, False)
      elif not os.path.exists(hl7):
        qry = mitoDB.apiQueryQuickList()
        qry.addQuery(actions.procStartHL7Processing)
        qry.addParm("long", rowId)
        qry.addQuery(actions.procEndHL7Processing)
        qry.addParm("string", "hl7FileNotFound")
        qry.addParm("long", rowId)
        actions.executeUpdateList(qry.queryList, False)

if __name__ == "__main__":
    pass