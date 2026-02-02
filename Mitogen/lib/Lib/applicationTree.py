

class appTree(object):

  import com.uniconnect.uniflow as uniflow
  from com.uniconnect.uniflow.exception import SystemException
  from java.sql import SQLException
  from patientNode import Patient
  from orderNode import Order
  from clinicalInfoNode import ClinicalInfo
  from specimenNode import Specimen
  from physicianSiteNode import PhysicianSite
  from physicianNode import Physician
  from billingNode import Billing
  from labProcessNode import LabProcess
  from panelsNode import Panels

  def __init__(self, switchboard, containerId, currentStep):
    self.containerId = containerId
    self.currentStep = currentStep
    self.switchboard = switchboard


  linkedNodes = {}
  appTree = uniflow.Node("applicationTree", "")

  def getLinkedNodes(self):
    query = """ SELECT
                  'SPECIMEN' AS "type",
                  rs.specimenId,
                  rf.requestId,
                  rf.patientId,
                  rf.physicianId,
                  rf.physicianSiteId,
                  sr.runId
                FROM specimenRuns sr
                INNER JOIN specimenMethods sm
                  ON sr.specimenMethodsId = sm.id
                INNER JOIN requestSpecimens rs
                  ON sm.requestSpecimensId = rs.id
                INNER JOIN requestForms rf
                  ON rs.requestId = rf.requestId
                WHERE sr.runId = '%s' 
                UNION
                SELECT
                  'CONTROL' AS "type,
                  cr.controlId,
                  '',
                  '',
                  '',
                  '',
                  cr.runId
                FROM controlRuns cr
                WHERE cr.controlRunId = '%s' """ % (self.containerId, self.containerId)


    stmt = self.switchboard.connection.createStatement()
    rs = stmt.executeQuery(query)

    while rs.next():

      if rs.getString('type') == 'SPECIMEN':

        self.linkedNodes['physicians'] = {1:{"physicianId":rs.getString('physicianId'), "requests" : [1], "physicianSites": [1], "reports": []}}
        self.linkedNodes['physicianSites'] = {1:{"physicianSiteId":rs.getString('physicianSiteId'), "physicians": [1]}}
        self.linkedNodes['patients'] = {1:{"patientId":rs.getString('patientId'), "requests" : [1], "specimens" : [1], "probands": [], "reports": []}}
        self.linkedNodes['orders'] = {1:{"requestId":rs.getString('requestId'),  "patients": 1, "physicians": 1, "physicianSites": 1, "clinicalInfo": 1, "billing": 1, "specimens" : [1],"reports": [], "panels": [1]}}
        self.linkedNodes['specimens'] = {1:{"specimenId":rs.getString('specimenId'), "requests" : [1], "runs" : [1], "reports": [], "patient": 1}}
        self.linkedNodes['runs'] = {1:{"runId":self.containerId, "request" : 1, "specimen" : 1, "panel": 1}}
        self.linkedNodes['reports'] = {1:{"reportId":"", "requests" : [1]}}
        self.linkedNodes['panels'] = {1:{"containerId": self.containerId, "runs": [1], "specimens" : [1], "requests": [1], "reports": []}}

      elif rs.getString('type') == 'CONTROL':
        self.linkedNodes['runs'] = {1:{"runId":self.containerId, "request" : 1, "specimen" : 1, "panel": 1}}
        

    rs.close()

    return self.linkedNodes


  def buildTree(self):

    self.appTree = self.uniflow.Node("applicationTree", "")

    try:

      nodeMap = self.getLinkedNodes()

      # Load physician site information

      siteBranch = self.appTree.add("sites", "")

      for key in nodeMap["physicianSites"]:

        self.switchboard.log('LOADING SITES... ')

        physicianSiteId = nodeMap['physicianSites'][key]["physicianSiteId"]
        physicians = nodeMap['physicianSites'][key]["physicians"]

        siteObj = self.PhysicianSite(self.switchboard, physicianSiteId, key)
        site_node = siteObj.buildPhysicianSiteNode(physicians)

        if site_node.tag == 'ERROR' :
          raise Exception(site_node.value)
        else:
          siteBranch.add(site_node)

      # Load physician information

      physicianBranch = self.appTree.add("physicians", "")

      for key in nodeMap["physicians"]:

        self.switchboard.log('LOADING PHYSICIAN... ')

        physicianId = nodeMap['physicians'][key]["physicianId"]
        requests = nodeMap['physicians'][key]["requests"]
        physicianSites = nodeMap['physicians'][key]["physicianSites"]
        reports = nodeMap['physicians'][key]["reports"]

        physicianObj = self.Physician(self.switchboard, physicianId, key)
        physician_node = physicianObj.buildPhysicianNode(requests, physicianSites, reports)

        if physician_node.getOrNull('ERROR') != None :
          raise Exception(physician_node.value)
        else:
          physicianBranch.add(physician_node)

      # Load patient information
      patientBranch = self.appTree.add("patients", "")

      for key in nodeMap["patients"]:

        self.switchboard.log('LOADING PATIENT... ')

        patientId = nodeMap['patients'][key]["patientId"]
        requests = nodeMap['patients'][key]["requests"]
        specimens = nodeMap['patients'][key]["specimens"]
        probands = nodeMap['patients'][key]["probands"]
        reports = nodeMap['patients'][key]["reports"]

        patientObj = self.Patient(self.switchboard, patientId, key)
        patient_node = patientObj.getPatientNode(requests, specimens, probands, reports)

        if patient_node.tag == 'ERROR' :
          raise Exception(patient_node.value)
        else:
          patientBranch.add(patient_node)

      # Load order information
      orderBranch = self.appTree.add("orders", "")

      for key in nodeMap["orders"]:

        self.switchboard.log('LOADING ORDERS... ')

        requestId = nodeMap['orders'][key]["requestId"]
        patients = nodeMap['orders'][key]["patients"]
        physicians = nodeMap['orders'][key]["physicians"]
        physicianSites = nodeMap['orders'][key]["physicianSites"]
        specimens = nodeMap['orders'][key]["specimens"]
        reports = nodeMap['orders'][key]["reports"]
        panels = nodeMap['orders'][key]["panels"]
        clinicalInfo = nodeMap['orders'][key]["clinicalInfo"]
        billing = nodeMap['orders'][key]["billing"]

        orderObj = self.Order(self.switchboard, requestId, key)
        order_node = orderObj.buildOrderNode(patients, physicians, physicianSites, clinicalInfo, billing, specimens, reports, panels)

        if order_node.tag == 'ERROR' :
          raise Exception(order_node.value)
        else:
          orderBranch.add(order_node)

      # Load clinical information
      clinicalBranch = self.appTree.add("clinicalInformation", "")

      for key in nodeMap["orders"]:

        self.switchboard.log('LOADING CLINICAL INFORMATION... ')

        requestId = nodeMap['orders'][key]["requestId"]

        clinicalObj = self.ClinicalInfo(self.switchboard, requestId, key)
        clinical_node = clinicalObj.buildClinicalNode()

        if clinical_node.tag == 'ERROR' :
          raise Exception(clinical_node.value)
        else:
          clinicalBranch.add(clinical_node)

      # Load billing information

      billingBranch = self.appTree.add("billing", "")

      for key in nodeMap["orders"]:

        self.switchboard.log('LOADING BILLING... ')

        requestId = nodeMap['orders'][key]["requestId"]

        billingObj = self.Billing(self.switchboard, requestId, key)

        billing_node = billingObj.buildBillingNode()

        if billing_node.tag == 'ERROR' :
          raise Exception(billing_node.value)
        else:
          billingBranch.add(billing_node)

      # Load specimen information

      specimenBranch = self.appTree.add("specimens", "")

      for key in nodeMap["specimens"]:

        self.switchboard.log('LOADING SPECIMEN... ')

        specimenId = nodeMap['specimens'][key]["specimenId"]
        requests = nodeMap['specimens'][key]["requests"]
        runs = nodeMap['specimens'][key]["runs"]
        reports = nodeMap['specimens'][key]["reports"]
        patient = nodeMap['specimens'][key]["patient"]

        specimenObj = self.Specimen(self.switchboard, specimenId, key)
        specimen_node = specimenObj.buildSpecimenNode(requests, runs, reports, patient)

        if specimen_node.tag == 'ERROR' :
          raise Exception(specimen_node.value)
        else:
          specimenBranch.add(specimen_node)

      # Load lab process and run information

      runBranch = self.appTree.add("labProcess", "")

      for key in nodeMap["runs"]:

        self.switchboard.log('LOADING RUN LAB PROCESS... ')

        runId = nodeMap['runs'][key]["runId"]
        specimenIndex = nodeMap['runs'][key]["specimen"]
        panelIndex = nodeMap['runs'][key]["panel"]

        runObj = self.LabProcess(self.switchboard, runId, key, self.currentStep)
        run_node = runObj.buildRunNode(specimenIndex, panelIndex)

        if run_node.tag == 'ERROR' :
          raise Exception(run_node.value)
        else:
          runBranch.add(run_node)

      # Load panels

      panelsBranch = self.appTree.add("panels", "")

      for key in nodeMap["panels"]:

        self.switchboard.log('LOADING PANELS... ')

        runs = nodeMap['panels'][key]["runs"]
        specimens = nodeMap['panels'][key]["specimens"]
        requests = nodeMap['panels'][key]["requests"]
        reports = nodeMap['panels'][key]["reports"]

        panelObj = self.Panels(self.switchboard, self.containerId, key)
        panels_node = panelObj.buildPanelNode(runs, specimens, requests, reports)

        if panels_node.tag == 'ERROR' :
          raise Exception(panels_node.value)
        else:
          panelsBranch.add(panels_node)


      self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'true')

    except Exception as e:
      self.switchboard.log("--- BUILD TREE FAILURE TO INSERT/UPDATE ANALYSIS DATA----")
      self.switchboard.log('I LOVE YOU' + str(e.message))
      self.switchboard.log('MORE COW BELL')
      self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')
      self.appTree = self.uniflow.Node("applicationTree", "")
      self.appTree.add('ERROR', str(e.args))
      return self.appTree

    except StandardError as e:
      self.switchboard.log("---*** Standard Py Error *** ")
      self.switchboard.log(str(e.message))
      self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')
      self.appTree = self.uniflow.Node("applicationTree", "")
      self.appTree.add('ERROR', '---*** Standard Py Error *** ')

    # except SystemException as e:
    #   switchboard.log("---*** UNIFlow SystemException ***----")
    #   switchboard.log(str(e.message))
    #   switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')

    # except SQLException as e:
    #   switchboard.log("---*** SQLException ***----")
    #   switchboard.log(str(e.message))
    #   switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')

    except BaseException as e:
      self.switchboard.log("---*** PyException ***----")
      self.switchboard.log(str(e.message))
      self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')
      self.appTree = self.uniflow.Node("applicationTree", "")
      self.appTree.add('ERROR', '---*** PyException ***----')

    except TypeError as e:
      self.switchboard.log("---*** TypeError ***----")
      self.switchboard.log(str(e.message))
      self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')
      self.appTree = self.uniflow.Node("applicationTree", "")
      self.appTree.add('ERROR', '---*** TypeError ***----')

    except:
      self.switchboard.log("*** Unspecified Error *****")
      # switchboard.log(str(e.message))
      self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')
      self.appTree = self.uniflow.Node("applicationTree", "")
      self.appTree.add('ERROR', "*** Unspecified Error *****")


    return self.appTree