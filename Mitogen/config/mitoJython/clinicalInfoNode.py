from buildInformationObject import *
class ClinicalInfo(infoObject):
  import java.sql.ResultSetMetaData

  def __init__ (self, switchboard, orderId, orderIndex):
    self.switchboard = switchboard
    self.orderId = orderId
    self.orderIndex = orderIndex

    self.query =  """ SELECT
                        IFNULL(ageAtInitialPresentation, '') AS "ageAtInitialPresentation",
                        IFNULL(geneticCounselor, '') AS "geneticCounselor",
                        IFNULL(clinicalNotes, '') AS "clinicalNotes",
                        IFNULL(clinicalHistory, '') AS "clinicalHistory",
                        IFNULL(GROUP_CONCAT(DISTINCT d1.name ORDER BY d1.name SEPARATOR ', '), '') AS "currentMedicationsList",
                        IFNULL(GROUP_CONCAT(DISTINCT d2.name ORDER BY d2.name SEPARATOR ', '), '') AS "problematicMedicationsList",
                        IFNULL(GROUP_CONCAT(DISTINCT d3.name ORDER BY d3.name SEPARATOR ', '), '') AS "drugAllergiesList",
                        IFNULL(dateOfLastPSA, '') AS "dateOfLastPSA",
                        IFNULL(lastPSA, '') AS "lastPSA",
                        IFNULL(percentFreePSA, '') AS "percentFreePSA",
                        IFNULL(dateOfLastDRE, '') AS "dateOfLastDRE",
                        IFNULL(lastDREResults, '') AS "lastDREResults",
                        IFNULL(biopsyHistoryNumber, '') AS "biopsyHistoryNumber",
                        IFNULL(biopsyHistoryOther, '') AS "biopsyHistoryOther",
                        IFNULL(histopathologyFindings, '') AS "histopathologyFindings",
                        IFNULL(lastMenstrualCycle, '') AS "lastMenstrualCycle",
                        IFNULL(pregnant, '') AS "pregnant",
                        IFNULL(pregnantComments, '') AS "pregnantComments",
                        IFNULL(lastPregnancy, '') AS "lastPregnancy",
                        IFNULL(miscarriages, '') AS "miscarriages",
                        IFNULL(miscarriagesComments, '') AS "miscarriagesComments",
                        IFNULL(hysterectomy, '') AS "hysterectomy",
                        IFNULL(hysterectomyComments, '') AS "hysterectomyComments",
                        IFNULL(thyroidIssues, '') AS "thyroidIssues",
                        IFNULL(thyroidIssuesComments, '') AS "thyroidIssuesComments",
                        IFNULL(babyIdentifyingNumber, '') AS "babyIdentifyingNumber",
                        IFNULL(birthWeight, '') AS "birthWeight",
                        IFNULL(birthTime, '') AS "birthTime",
                        IFNULL(placeOfBirth, '') AS "placeOfBirth",
                        IFNULL(locationOfSampling, '') AS "locationOfSampling",
                        IFNULL(referringDoctor, '') AS "referringDoctor",
                        IFNULL(repeatSample, '') AS "repeatSample",
                        IFNULL(privatePublicPatient, '') AS "privatePublicPatient",
                        IFNULL(prePostTransfusion, '') AS "prePostTransfusion",
                        IFNULL(ambiguousGenitalia, '') AS "ambiguousGenitalia",
                        IFNULL(ambiguousGenitaliaComments, '') AS "ambiguousGenitaliaComments",
                        IFNULL(familyHistoryCF, '') AS "familyHistoryCF",
                        IFNULL(familyHistoryCFComments, '') AS "familyHistoryCFComments",
                        IFNULL(meconiumIleus, '') AS "meconiumIleus",
                        IFNULL(meconiumIleusComments, '') AS "meconiumIleusComments",
                        IFNULL(clinicalHistoryOfMother, '') AS "clinicalHistoryOfMother",
                        IFNULL(motherFullName, '') AS "motherFullName",
                        IFNULL(dateOfFirstMilk, '') AS "dateOfFirstMilk",
                        IFNULL(timeOfFirstMilk, '') AS "timeOfFirstMilk",
                        IFNULL(feedingHistory, '') AS "feedingHistory",
                        IFNULL(donorOrRecipient, '') AS "donorOrRecipient",
                        IFNULL(transfusionHistory, '') AS "transfusionHistory",
                        IFNULL(bloodType, '') AS "bloodType",
                        IFNULL(transfusionTransplantHistory, '') AS "transfusionTransplantHistory"
                      FROM clinicalInformation ci
                      LEFT JOIN (
                        SELECT
                          d.name,
                          cid.requestId
                        FROM clinicalInformationDrugs cid
                        INNER JOIN drugs d
                          ON cid.drugId = d.id
                        WHERE cid.type = 'currentMedications') d1
                        ON ci.requestId = d1.requestId
                      LEFT JOIN (
                        SELECT
                          d.name,
                          cid.requestId
                        FROM clinicalInformationDrugs cid
                        INNER JOIN drugs d
                          ON cid.drugId = d.id
                        WHERE cid.type = 'problematicMedications') d2
                        ON ci.requestId = d2.requestId
                      LEFT JOIN (
                        SELECT
                          d.name,
                          cid.requestId
                        FROM clinicalInformationDrugs cid
                        INNER JOIN drugs d
                          ON cid.drugId = d.id
                        WHERE cid.type = 'drugAllergies') d3
                        ON ci.requestId = d3.requestId
                      WHERE ci.requestId = '%s' """ % self.orderId

    self.udQuery = """ SELECT
                  IFNULL(fcp.inputName,'') AS "addFieldLabel",
                  IFNULL(cp.`value`,'') AS "value",
                  REPLACE(cp.property, 'userDef_', '') AS "property"
                FROM containerProperties cp
                INNER JOIN formConfigurableParts fcp
                  ON REPLACE(cp.property, 'userDef_', '') = fcp.inputName
                WHERE containerId = '%s'
                  AND fcp.section = 'clinicalInformation'
                  AND cp.value <> '' """ % self.orderId


  def getClinicalInfo(self):

    clinicalObject = self.getData(self.query, self.udQuery)
    return clinicalObject

  def buildClinicalNode(self):

    dataObject = self.getClinicalInfo()
    objectNode = self.buildNode('clinicalInformation', dataObject, self.orderIndex, self.query, self.udQuery)
    objectNode.add('order_link', str(self.orderIndex))

    return objectNode

