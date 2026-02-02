from buildInformationObject import *
class Billing(infoObject):
  # import com.uniconnect.uniflow.Node as Node

  def __init__ (self, switchboard, orderId, orderIndex):
    self.switchboard = switchboard
    self.orderId = orderId
    self.orderIndex = orderIndex

    self.query =  """ SELECT
                    IFNULL(pb.billTo, '') AS "billTo",
                    IFNULL(pb.governmentPolicyNumber1, '') AS "governmentPolicyNumber1",
                    IFNULL(pb.governmentPolicyNumber2, '') AS "governmentPolicyNumber2",
                    IFNULL(pb.selfPay, '') AS "selfPay",
                    IFNULL(pb.privateInsurance, '') AS "privateInsurance",
                    IFNULL(GROUP_CONCAT(IFNULL(dc.diagnosticCode, '') SEPARATOR ', '), '') AS "diagnosticCodesList",
                    IFNULL(ic.carrierName, '') AS "primary_CarrierName",
                    IFNULL(ic.address1, '') AS "primary_Address1",
                    IFNULL(ic.address2, '') AS "primary_Address2",
                    IFNULL(ic.city, '') AS "primary_City",
                    IFNULL(ic.state, '') AS "primary_State",
                    IFNULL(ic.postalCode, '') AS "primary_PostalCode",
                    IFNULL(ic.country, '') AS "primary_country",                    
                    IFNULL(ic.amdCarrierCode, '') AS "primary_carrierCode",
                    IFNULL(ic.edicpidNumber, '') AS "primary_edicpidNumber",
                    IFNULL(ic.phoneNumber, '') AS "primary_phoneNumber",
                    IFNULL(pb.policyNumber1, '') AS "primary_policyNumber",
                    IFNULL(pb.groupNumber1, '') AS "primary_groupNumber",
                    IFNULL(pb.policyHolder1FirstName, '') AS "primary_holderFirstName",
                    IFNULL(pb.policyHolder1LastName, '') AS "primary_holderLastName",
                    IFNULL(pb.policyHolder1Id, '') AS "primary_holderGovernmentId",
                    IFNULL(pb.policyHolder1DOB, '') AS "primary_holderDOB",
                    IFNULL(pb.policyHolder1Relationship, '') AS "primary_holderRelationship",
                    IFNULL(ic2.carrierName, '') AS "secondary_CarrierName",
                    IFNULL(ic2.address1, '') AS "secondary_Address1",
                    IFNULL(ic2.address2, '') AS "secondary_Address2",
                    IFNULL(ic2.city, '') AS "secondary_City",
                    IFNULL(ic2.state, '') AS "secondary_State",
                    IFNULL(ic2.postalCode, '') AS "secondary_PostalCode",
                    IFNULL(ic2.country, '') AS "secondary_country",                                        
                    IFNULL(ic2.amdCarrierCode, '') AS "secondary_carrierCode",
                    IFNULL(ic2.edicpidNumber, '') AS "secondary_edicpidNumber",
                    IFNULL(ic2.phoneNumber, '') AS "secondary_phoneNumber",
                    IFNULL(pb.policyNumber2, '') AS "secondary_policyNumber",
                    IFNULL(pb.groupNumber2, '') AS "secondary_groupNumber",
                    IFNULL(pb.policyHolder2FirstName, '') AS "secondary_holderFirstName",
                    IFNULL(pb.policyHolder2LastName, '') AS "secondary_holderLastName",
                    IFNULL(pb.policyHolder2Id, '') AS "secondary_holderGovernmentId",
                    IFNULL(pb.policyHolder2DOB, '') AS "secondary_holderDOB",
                    IFNULL(pb.policyHolder2Relationship, '') AS "secondary_holderRelationship"
                FROM patientBilling pb
                LEFT JOIN (
                    SELECT dc.diagnosticCode, rc.requestId
                    FROM requestCodes rc
                    INNER JOIN diagnosticCodes dc
                    ON rc.codeId = dc.id ) dc
                    ON pb.requestId = dc.requestId
                LEFT JOIN insuranceCarriers ic
                    ON pb.carrierId1 = ic.id
                LEFT JOIN insuranceCarriers ic2
                    ON pb.carrierId2 = ic2.id
                WHERE pb.requestId = '%s' """ % self.orderId

    self.udQuery = """ SELECT
                    fcp.inputName AS "addFieldLabel",
                    cp.`value` AS "value"
                FROM containerProperties cp
                INNER JOIN formConfigurableParts fcp
                    ON REPLACE(cp.property, 'userDef_', '') = fcp.inputName
                WHERE containerId = '%s'
                    AND fcp.section = 'billing'
                    AND cp.value <> '' """ % self.orderId

  def getBilling(self):

    billingObject = self.getData(self.query, self.udQuery)
    billingObject['codes'] = self.getDiagnosticCodes()
    billingObject['testCode'] = self.getBillCodes()

    return billingObject

  def buildBillingNode(self):

    dataObject = self.getData(self.query, self.udQuery)
    dataObject['codes'] = self.getDiagnosticCodes()
    dataObject['testCode'] = self.getBillCodes()
    objectNode = self.buildNode('billing', dataObject, self.orderIndex, self.query, self.udQuery)
    objectNode.add('order_link', str(self.orderIndex))

    return objectNode


  def getDiagnosticCodes(self):

    codes = []
    query = """ SELECT dc.diagnosticCode
                FROM requestCodes rc
                INNER JOIN diagnosticCodes dc
                  ON rc.codeId = dc.id
                WHERE rc.requestId = '%s' """ % self.orderId

    stmt = self.switchboard.connection.createStatement()
    rs = stmt.executeQuery(query)
    while rs.next():

      codes.append(rs.getString('diagnosticCode'))

    rs.close()

    return codes

  def getBillCodes(self):

    tests = {}
    query = """ SELECT DISTINCT t.testCode AS "testCode"
                , IFNULL(t.cptCode, '') AS "cptCode"
                , IFNULL(t.billingCode, '') AS "billingCode"
                , IFNULL(t.zCode , '') AS "zCode"
                FROM tests t
                LEFT JOIN specimenMethods sm ON sm.testCode = t.testCode
                LEFT JOIN requestSpecimens rs ON rs.Id = sm.requestSpecimensId
                WHERE rs.requestId = '%s' """ % self.orderId

    stmt = self.switchboard.connection.createStatement()
    rs = stmt.executeQuery(query)
    while rs.next():

      #tests.append(rs.getString('testCode'))
      tests[rs.getString('testCode')] = {'cptCode':rs.getString('cptCode'), 'billingCode': rs.getString('billingCode'), 'zCode': rs.getString('zCode')}

    rs.close()
    return tests

