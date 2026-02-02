from buildInformationObject import *
class Specimen(infoObject):
  import java.sql.ResultSetMetaData

  def __init__(self, switchboard, specimenId, specimenIndex):
    self.switchboard = switchboard
    self.specimenId = specimenId
    self.specimenIndex = specimenIndex

    self.query =  """ SELECT
                        rs.specimenId,
                        IFNULL(rs.externalIdentifier,'') AS "externalSpecimenId",
                        IFNULL(rs.expectedBarcode,'') AS "expectedBarcode",
                        IFNULL(rs.specimenType,'') AS "specimenType",
                        IFNULL(rs.collectionDate,'') AS "collectionDate",
                        IFNULL(rs.collectionTime,'') AS "collectionTime",
                        IFNULL(rs.receivedDate,'') AS "receivedDate",
                        IFNULL(rs.specimenQuantity,'') AS "receivedQuantity",
                        IFNULL(rs.specimenQuantityUnits,'') AS "receivedQuantityUnits",
                        IFNULL(cp.value,'') AS "currentQuantity",
                        IFNULL(cp2.value,'') AS "currentQuantityUnits",
                        IFNULL(rs.specimenCondition,'') AS "receivedCondition",
                        IFNULL(cn.note,'') AS "receivedComments"
                    FROM requestSpecimens rs
                    LEFT JOIN containerProperties cp
                        ON rs.specimenId = cp.containerId
                        AND cp.property = 'Sample Quantity'
                    LEFT JOIN containerProperties cp2
                        ON rs.specimenId = cp2.containerId
                        AND cp2.property = 'Sample Quantity Units'
                    LEFT JOIN containerNotes cn
                        ON rs.specimenId = cn.containerId
                        AND cn.noteType = 'Specimen Receiving Comment'
                    WHERE rs.specimenId = '%s' """ % self.specimenId

    self.udQuery = """ SELECT
                  fcp.inputName AS "addFieldLabel",
                  cp.`value` AS "value",
                  REPLACE(cp.property, 'userDef_', '') AS "property"
                FROM requestSpecimens rs
                INNER JOIN containerProperties cp
                    ON rs.requestId = cp.containerId
                INNER JOIN formConfigurableParts fcp
                    ON REPLACE(cp.property, 'userDef_', '') = fcp.inputName
                WHERE rs.specimenId = '%s'
                    AND fcp.section = 'specimenInfo'
                    AND cp.value <> '' """ % self.specimenId


  def getSpecimen(self):

    specimenObject = self.getData(self.query, self.udQuery)
    return specimenObject

  def buildSpecimenNode(self, requestsIdx, runsIdx, reportsIdx, patientIdx):

    dataObject = self.getData(self.query, self.udQuery)
    objectNode = self.buildNode('specimen', dataObject, self.specimenIndex, self.query, self.udQuery)
    objectNode.add('patient_link', str(patientIdx))
    for index in requestsIdx:
      objectNode.add('order_link', str(index))
    for index in runsIdx:
      objectNode.add('labProcess_link', str(index))
    for index in reportsIdx:
      objectNode.add('report_link', str(index))

    return objectNode
