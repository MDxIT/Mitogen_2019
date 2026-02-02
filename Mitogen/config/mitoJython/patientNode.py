from buildInformationObject import *
class Patient(infoObject):

  import java.sql.ResultSetMetaData

  def __init__ (self, switchboard, patientId, patientIndex):
    self.switchboard = switchboard
    self.patientId = patientId
    self.patientIndex = patientIndex

    self.query = """ SELECT
                      patientId AS "mitogenPatientId",
                      IFNULL(sqId, '') AS "sqId",
                      IFNULL(placerPatientId,'') AS "placerPatientId",
                      IFNULL(firstName, '') AS "firstName",
                      IFNULL(middleName,'') AS "middleName",
                      IFNULL(lastName,'') AS "lastName",
                      IFNULL(geneticGender, '') AS "geneticGender",
                      IFNULL(genderId,'') AS "genderId",
                      IFNULL(dob,'') AS "dob",
                      IFNULL(govtId,'') AS "govtId",
                      IFNULL(ethnicity, '') AS "ethnicity",
                      IFNULL(address1, '') AS "address1",
                      IFNULL(address2, '') AS "address2",
                      IFNULL(city,'') AS "city",
                      IFNULL(state, '') AS "state",
                      IFNULL(postalCode, '') AS "postalCode",
                      IFNULL(country, '') AS "country",
                      IFNULL(phone1CountryCode, '') AS "homeCountryCode",
                      IFNULL(phone1, '') AS "homePhone",
                      IFNULL(phone2CountryCode, '') AS "workCountryCode",
                      IFNULL(phone2, '') AS "workPhone",
                      IFNULL(phone3CountryCode,'') AS "mobileCountryCode",
                      IFNULL(phone3, '') AS "mobilePhone",
                      IFNULL(email, '') AS "email"
                    FROM patients
                    WHERE patientId = '%s' """ % self.patientId

    self.udQuery = """ SELECT
                        fcp.inputName AS "addFieldLabel",
                        cp.`value` AS "value",
                        REPLACE(cp.property, 'userDef_', '') AS "property"
                    FROM containerProperties cp
                    INNER JOIN formConfigurableParts fcp
                      ON REPLACE(cp.property, 'userDef_', '') = fcp.inputName
                    INNER JOIN requestForms rf
                      ON cp.containerId = rf.requestId
                    WHERE rf.patientId = '%s'
                      AND fcp.section = 'patientInformation'
                      AND cp.value <> ''""" % self.patientId



  def getPatient(self):

    patientObject = self.getData(self.query, self.udQuery)

    patientObject['mrn'] = self.getMrns()

    return patientObject

  def getPatientNode(self, requestsIdx, specimensIdx, probandsIdx, reportsIdx):

    dataObject = self.getData(self.query, self.udQuery)
    dataObject['mrn'] = self.getMrns()

    objectNode = self.buildNode('patient', dataObject, self.patientIndex, self.query, self.udQuery)

    for index in requestsIdx:
      objectNode.add('order_link', str(index))
    for index in specimensIdx:
      objectNode.add('specimen_link', str(index))
    for index in probandsIdx:
      objectNode.add('proband_link', str(index))
    for index in reportsIdx:
      objectNode.add('report_link', str(index))

    return objectNode


  def getReportMrn(self):

    mrn = {}

    mQuery = '''
      SELECT DISTINCT
        IFNULL(mrn, '') AS "mrn",
        IFNULL(mrnType,'') AS "mrnType",
        IFNULL(mrnFacility, '') AS "mrnFacility"
      FROM patientSources
      WHERE patientId = ? 
        AND master = 1
    '''
    mStmt = self.switchboard.connection.prepareStatement(mQuery)
    mStmt.setString(1, self.patientId)
    mRs = mStmt.executeQuery()

    while mRs.next():
      mrn = {'value': mRs.getString('mrn'), 'label':''}
    mRs.close()
    mStmt.close()
    
    return mrn

  def getMrns(self):

    mrns = {}

    mQuery = '''
      SELECT DISTINCT
        IFNULL(mrn, '') AS "mrn",
        IFNULL(mrnType,'') AS "mrnType",
        IFNULL(mrnFacility, '') AS "mrnFacility"
      FROM patientSources
      WHERE patientId = ? 
    '''
    mStmt = self.switchboard.connection.prepareStatement(mQuery)
    mStmt.setString(1, self.patientId)
    mRs = mStmt.executeQuery()

    while mRs.next():
      mrns[mRs.getString('mrn')] = {'type':mRs.getString('mrnType'), 'facility': mRs.getString('mrnFacility')}
    mRs.close()
    mStmt.close()
    
    return mrns