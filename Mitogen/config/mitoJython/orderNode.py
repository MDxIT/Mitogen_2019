from buildInformationObject import *
class Order(infoObject):

  import java.sql.ResultSetMetaData

  def __init__ (self, switchboard, orderId, orderIndex):
    self.switchboard = switchboard
    self.orderId = orderId
    self.orderIndex = orderIndex

    self.query = """  SELECT DISTINCT
                    rf.requestId,
                    IFNULL(rf.placerOrderId, '') AS "placerOrderId",
                    IFNULL(rf.sendingApp, '') AS "sendingApp",
                    IFNULL(rf.sendingFacility, '') AS "sendingFacility",
                    IFNULL(rf.type, '') AS "type",
                    IFNULL(rf.mrn, '') AS "orderMrn",
                    IFNULL(rf.mrnType, '') AS "mrnType",
                    IFNULL(rf.mrnFacility, '') AS "mrnFacility",
                    IFNULL(rf.consent, '') AS "consent",
                    IFNULL(rf.consentBy, '') AS "consentBy",
                    IFNULL(rf.consenteePatientRelationship, '') AS "consenteePatientRelationship",
                    IFNULL(rf.clinicalTrial, '') AS "clinicalTrial",
                    IFNULL(rf.workersComp, '') AS "workersComp",
                    IFNULL(rf.patientSignature, '') AS "patientSignature",
                    IFNULL(rf.patientSignatureDate, '') AS "patientSignatureDate",
                    IFNULL(rf.physicianSignature, '') AS "physicianSignature",
                    IFNULL(rf.physicianSignatureDate, '') AS "physicianSignatureDate",
                    IFNULL(rf.physicianComment, '') AS "physicianComment",
                    IFNULL(rf.priority, '') AS "priority",
                    IFNULL(vv.displayValue, '') AS "uxPriority",
                    IFNULL(rf.receivedDate, '') AS "receivedDate",
                    IFNULL(rf.externalRequestId, '') AS "externalRequestId",
                    IFNULL(rf.externalSystem, '') AS "externalSystem",
                    IFNULL(rf.accountNumber, '') AS "accountNumber",
                    IFNULL(rf.encounterNumber, '') AS "encounterNumber",
                    IFNULL(rf.status, '') AS "status",
                    IFNULL(e.eventDate, '') AS "statusDate",
                    GROUP_CONCAT(CONCAT(p.panelCode, '^', p.name) SEPARATOR '|') AS "panels"
                  FROM
                      requestForms rf
                  LEFT JOIN validValues vv
                      ON rf.priority = vv.value
                      AND vv.setName = 'Priority'
                  INNER JOIN reqPanels rp
                      ON rf.requestId = rp.requestId
                  INNER JOIN panels p
                      ON rp.panelCode = p.panelCode
                  LEFT JOIN events e
                      ON rf.statusEventId = e.eventId
                  WHERE
                      rf.requestId = '%s'
                  GROUP BY
                      rf.requestId """ % self.orderId

    self.udQuery = """ SELECT
                  fcp.inputName AS "addFieldLabel",
                  cp.`value` AS "value",
                  REPLACE(cp.property, 'userDef_', '') AS "property"
                FROM containerProperties cp
                INNER JOIN formConfigurableParts fcp
                  ON REPLACE(cp.property, 'userDef_', '') = fcp.inputName
                WHERE containerId = '%s'
                  AND fcp.section = 'orderInformation'
                  AND cp.value <> '' """ % self.orderId

  def getOrder(self):

    orderObject = self.getData(self.query, self.udQuery)
    return orderObject



  def buildOrderNode(self, patientIdx, physicianIdx, siteIdx, clinicalIdx, billingIdx, specimensIdx, reportsIdx):

    dataObject = self.getData(self.query, self.udQuery)
    objectNode = self.buildNode('order', dataObject, self.orderIndex, self.query, self.udQuery)
    objectNode.add('patient_link', str(patientIdx))
    objectNode.add('physician_link', str(physicianIdx))
    objectNode.add('site_link', str(siteIdx))
    objectNode.add('clinicalInfo_link', str(clinicalIdx))
    objectNode.add('billing_link', str(billingIdx))
    for index in reportsIdx:
      objectNode.add('report_link', str(index))

    return objectNode

