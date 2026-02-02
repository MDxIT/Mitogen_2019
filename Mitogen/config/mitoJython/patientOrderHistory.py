import com.uniconnect.uniflow as uniflow
from com.uniconnect.uniflow.exception import SystemException
from java.sql import SQLException
import json

class PatientOrderHistory:
  def __init__(self, switchboard):
    self.switchboard = switchboard

  def getPatientOrderHistory(self, patientId, requestId):
    try:
      orders = []
      resQuery = '''
      SELECT rf.requestId as orderId,
          CONCAT(ph.first_name, ' ', ph.last_name) as physician,
          date (rf.receivedDate) as reqDate,
          IFNULL(GROUP_CONCAT(DISTINCT p.name ORDER BY rp.panelCode SEPARATOR "<br>" ),'') as panels,
          IFNULL(GROUP_CONCAT(DISTINCT rs.specimenId ORDER BY rs.specimenId SEPARATOR "<br>"),'') as specimens,
          IFNULL(rf.status,'') as status
        FROM requestForms rf
        INNER JOIN physicians ph ON rf.physicianId = ph.physicianId
        INNER JOIN reqPanels rp ON rf.requestId = rp.requestId
        INNER JOIN panels p ON rp.panelCode = p.panelCode
        LEFT JOIN requestSpecimens rs ON rf.requestId = rs.requestId
        WHERE rf.patientId = ? and rf.requestId != ?
        GROUP BY rf.requestId, rp.requestId
        ORDER BY rf.receivedDate desc
        LIMIT 10
      '''
      resQueryStatement = self.switchboard.connection.prepareStatement(resQuery)
      resQueryStatement.setString(1,patientId)
      resQueryStatement.setString(2,requestId)
      resOrd = resQueryStatement.executeQuery()

      while resOrd.next():
        ordDict = {}
        ordDict['orderId'] = resOrd.getString('orderId')
        ordDict['physician'] = resOrd.getString('physician')
        ordDict['reqDate'] = resOrd.getString('reqDate')
        ordDict['panels'] = resOrd.getString('panels')
        ordDict['specimens'] = resOrd.getString('specimens')
        ordDict['status'] = resOrd.getString('status')
        orders.append(ordDict)

      self.switchboard.formResults.put('PROCESSINGSUCCESSFUL','true')
      return json.dumps(orders)

    except Exception as e:
      self.switchboard.log("---*** EXCEPTION AT GETPATIENTORDERHISTORY ***---")
      self.switchboard.log("ERROR MESSAGE: " + str(e.message))
      self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')
      raise
    except SQLException as e:
      self.switchboard.log("---*** SQLException AT GETPATIENTORDERHISTORY ***----")
      self.switchboard.log("ERROR MESSAGE: " + str(e.message))
      self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')
      raise
    except BaseException as e:
      self.switchboard.log("---*** PYTHON EXCEPTION AT GETPATIENTORDERHISTORY ***---")
      self.switchboard.log("ERROR MESSAGE: " + str(e.message))
      self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')
      raise
    finally:
      resQueryStatement.close()