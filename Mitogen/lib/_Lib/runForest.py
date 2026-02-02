class AppTree(object):

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
  from reportMetaData import ReportMetaData

  errorLocation = ""

  def __init__(self, switchboard, containerId, currentStep):
    self.containerId = containerId
    self.currentStep = currentStep
    self.switchboard = switchboard
    self.linkedNodes = {}
    self.containerType = ""
    self.appTree = self.uniflow.Node("applicationTree", "")

  


  def reconcileContainer(self):

    query= """ SELECT containerType
                FROM containers
                WHERE containerId = '%s' """ % self.containerId

    stmt = self.switchboard.connection.createStatement()
    rs = stmt.executeQuery(query)
    while rs.next():

      containerType = rs.getString('containerType')

    rs.close()

    return containerType

  def getLinkedNodes(self):

    try:
      errorLocation = 'getLinkedNodes - get containerType'

      self.containerType = self.reconcileContainer()

      if self.containerType == 'runId':

        errorLocation = 'getLinkedNodes: runId - create query'
        query = """ SELECT
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
                    WHERE sr.runId = ? """

        stmt = self.switchboard.connection.prepareStatement(query)
        stmt.setString(1, self.containerId)
        rs = stmt.executeQuery()

        while rs.next():

          self.linkedNodes['physicians'] = {1:{"physicianId":rs.getString('physicianId'), "requests" : [1], "physicianSites": [1], "reports": []}}
          self.linkedNodes['physicianSites'] = {1:{"physicianSiteId":rs.getString('physicianSiteId'), "physicians": [1]}}
          self.linkedNodes['patients'] = {1:{"patientId":rs.getString('patientId'), "requests" : [1], "specimens" : [1], "probands": [], "reports": []}}
          self.linkedNodes['orders'] = {1:{"requestId":rs.getString('requestId'),  "patients": 1, "physicians": 1, "physicianSites": 1, "clinicalInfo": 1, "billing": 1, "specimens" : [1],"reports": []}}
          self.linkedNodes['specimens'] = {1:{"specimenId":rs.getString('specimenId'), "requests" : [1], "runs" : [1], "reports": [], "patient": 1}}
          self.linkedNodes['runs'] = {1:{"runId":self.containerId, "request" : 1, "specimen" : 1}}
          self.linkedNodes['reports'] = {1:{"reportId":"", "requests" : 1, "specimens" : [1]}}

        rs.close()

      elif self.containerType == 'controlRunId':

        errorLocation = 'getLinkedNodes: controlRunId - create query'
        self.linkedNodes['physicians'] = {}
        self.linkedNodes['physicianSites'] = {}
        self.linkedNodes['patients'] = {}
        self.linkedNodes['orders'] = {}
        self.linkedNodes['specimens'] = {}
        self.linkedNodes['reports'] = {}
        self.linkedNodes['runs'] = {1:{"runId":self.containerId, "request" : 1, "specimen" : 1}}

      elif self.containerType == 'reportId':

        errorLocation = 'getLinkedNodes: reportId - create query'
        query = """ SELECT
                      rd.reportId,
                      rf.requestId,
                      rf.physicianSiteId,
                      rf.physicianId,
                      rf.patientId,
                      rqs.specimenId,
                      sr.runId
                    FROM reportDetails rd
                    INNER JOIN requestForms rf
                      ON rd.requestFormsId = rf.Id
                    INNER JOIN reportSpecimens rs
                      ON rd.id = rs.reportDetailsId
                    INNER JOIN requestSpecimens rqs
                      ON rs.requestSpecimensId = rqs.id
                    INNER JOIN specimenMethods sm
                      ON rs.specimenMethodsId = sm.Id
                    INNER JOIN specimenRuns sr
                      ON sm.Id = sr.specimenMethodsId
                    WHERE rd.reportId = ? """

        errorLocation = 'getLinkedNodes: reportId - execute query'
        stmt = self.switchboard.connection.prepareStatement(query)
        stmt.setString(1, self.containerId)
        rs = stmt.executeQuery()

        s = 1
        r = 1

        requestId = ""
        physicianSiteId = ""
        physicianId = ""
        patientId = ""
        specimenIndex = []

        self.linkedNodes['specimens'] = {}
        self.linkedNodes['runs'] = {}

        errorLocation = 'getLinkedNodes: reportId - start while'
        while rs.next():

          errorLocation = 'getLinkedNodes: reportId - set variables'

          requestId = rs.getString('requestId')
          physicianSiteId = rs.getString('physicianSiteId')
          physicianId = rs.getString('physicianId')
          patientId = rs.getString('patientId')
          specimenId = rs.getString('specimenId')
          runId = rs.getString('runId')

          if specimenId != None:
            specimenKey = ''

            errorLocation = 'getLinkedNodes: reportId - find exisiting specimen'
            for key, specimen in self.linkedNodes['specimens'].items():
              if specimenId == specimen['specimenId']:
                specimenKey = key
                break

            errorLocation = 'getLinkedNodes: reportId - add new specimen'
            if specimenKey == '':
              self.linkedNodes['specimens'][s] = {"specimenId":specimenId, "requests" : [1], "reports": [1], "patient": 1}

              errorLocation = 'getLinkedNodes: reportId - add run for new specimen'
              if runId != None:
                errorLocation = 'tacos1'
                self.linkedNodes['specimens'][s]['runs'] = [r]
                errorLocation = 'tacos2'
                self.linkedNodes['runs'][r] = {"runId":runId, "request" : 1, "specimen" : s}
                r += 1

              errorLocation = 'getLinkedNodes: reportId - specimen index list'
              specimenIndex.append(s)
              s += 1

            else:

              errorLocation = 'getLinkedNodes: reportId - add runs to exisiting specimen'
              self.linkedNodes['specimens'][specimenKey]['runs'].append(r)
              self.linkedNodes['runs'][r] = {"runId":runId, "request" : 1, "specimen" : specimenKey}
              r += 1


        errorLocation = 'getLinkedNodes: reportId - exit while'
        rs.close()

        errorLocation = 'getLinkedNodes: reportId - complete node tree'

        self.linkedNodes['physicians'] = {1:{"physicianId":physicianId, "requests" : [1], "physicianSites": [1], "reports": [1]}}
        self.linkedNodes['physicianSites'] = {1:{"physicianSiteId":physicianSiteId, "physicians": [1]}}
        self.linkedNodes['patients'] = {1:{"patientId":patientId, "requests" : [1], "specimens" : specimenIndex, "probands": [], "reports": [1]}}
        self.linkedNodes['orders'] = {1:{"requestId":requestId,  "patients": 1, "physicians": 1, "physicianSites": 1, "clinicalInfo": 1, "billing": 1, "specimens" : specimenIndex,"reports": [1]}}
        self.linkedNodes['reports'] = {1:{"reportId":self.containerId, "requests" : 1, "specimens" : specimenIndex}}

      self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'true')

    except Exception as e:
      self.switchboard.log("---*** EXCEPTION ***---")
      self.switchboard.log("ERROR LOCATION: " + errorLocation)
      self.switchboard.log("ERROR MESSAGE: " + str(e.message))
      self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')

    except StandardError as e:
      self.switchboard.log("---*** STANDRAD PYTHON ERROR ***---")
      self.switchboard.log("ERROR LOCATION: " + errorLocation)
      self.switchboard.log("ERROR MESSAGE: " + str(e.message))
      self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')

    # except SystemException as e:
    #   switchboard.log("---*** UNIFlow SystemException ***----")
    #   switchboard.log(str(e.message))
    #   switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')

    # except SQLException as e:
    #   switchboard.log("---*** SQLException ***----")
    #   switchboard.log(str(e.message))
    #   switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')

    except BaseException as e:
      self.switchboard.log("---*** PYTHON EXCEPTION ***---")
      self.switchboard.log("ERROR LOCATION: " + errorLocation)
      self.switchboard.log("ERROR MESSAGE: " + str(e.message))
      self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')
      # analysisMethodTree = self.uniflow.Node("ERROR", '---*** PYTHON EXCEPTION ***---')

    except TypeError as e:
      self.switchboard.log("---*** TYPE ERROR ***----")
      self.switchboard.log("ERROR LOCATION: " + errorLocation)
      self.switchboard.log("ERROR MESSAGE: " + str(e.message))
      self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')
      # analysisMethodTree = self.uniflow.Node("ERROR", '---*** TYPE ERROR ***----')

    except:
      self.switchboard.log("---*** UNSPECIFIED ERROR ***---")
      self.switchboard.log("ERROR LOCATION: " + errorLocation)
      self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')
      # analysisMethodTree = self.uniflow.Node("ERROR", "---*** UNSPECIFIED ERRROR ***---")

    return self.linkedNodes

  def buildTree(self, configVersion = None):

    errorLocation = 'buildTree -- start'

    try:

      nodeMap = self.getLinkedNodes()

      # print 'NODEMAP: ', nodeMap

      # Load physician site information

      siteBranch = self.appTree.add("sites", "")

      for key in nodeMap["physicianSites"]:

        self.switchboard.log('LOADING SITES... ')

        physicianSiteId = nodeMap['physicianSites'][key]["physicianSiteId"]
        physicians = nodeMap['physicianSites'][key]["physicians"]

        siteObj = self.PhysicianSite(self.switchboard, physicianSiteId, key)
        site_node = siteObj.buildPhysicianSiteNode(physicians)
        # print 'SITENODE: ', site_node

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
        # print 'PHYSICIANNODE: ', physician_node

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
        # print 'PATIENTNODE: ', patient_node

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
        clinicalInfo = nodeMap['orders'][key]["clinicalInfo"]
        billing = nodeMap['orders'][key]["billing"]

        orderObj = self.Order(self.switchboard, requestId, key)
        order_node = orderObj.buildOrderNode(patients, physicians, physicianSites, clinicalInfo, billing, specimens, reports)
        # print 'ORDERNODE: ', order_node

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
        # print 'SPECIMENNODE: ', specimen_node

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

        runObj = self.LabProcess(self.switchboard, runId, key, self.currentStep)
        run_node = runObj.buildRunNode(specimenIndex)
        # print 'RUNNODE: ', run_node

        if run_node.tag == 'ERROR' :
          raise Exception(run_node.value)
        else:
          runBranch.add(run_node)

      # reportBranch = self.appTree.add("reports", "")
      # for key in nodeMap["reports"]:

      #   self.switchboard.log('LOADING REPORT...')

      #   ## PLACE HOLDER FOR FULL REPORT
      #   reportBranch.add("report", str(key))

      #   thisReportNode = reportBranch.getByTagAndValue('report', str(key))

      #   reportId = nodeMap['reports'][key]['reportId']
      #   print 'REPORTID: ', reportId

      #   reportObj = self.ReportMetaData(self.switchboard, reportId)
      #   # if configVersion != None:
      #   report_node = reportObj.buildMetaDataNode(key)

      #   if report_node.tag == 'ERROR':
      #     raise Exception(report_node.value)
      #   else:
      #     # reportBranch.add(report_node)
      #     thisReportNode.add('reportId', reportId)
      #     thisReportNode.add(report_node)




      self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'true')

    except Exception as e:
      self.switchboard.log("---*** EXCEPTION ***--")
      self.switchboard.log("ERROR LOCATION: " + errorLocation)
      self.switchboard.log("ERROR MESSAGE: " + str(e.message))
      self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')
      self.appTree = self.uniflow.Node("applicationTree", "")

    except StandardError as e:
      self.switchboard.log("---*** STANDRAD PYTHON ERROR ***---")
      self.switchboard.log("ERROR LOCATION: " + errorLocation)
      self.switchboard.log("ERROR MESSAGE: " + str(e.message))
      self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')
      self.appTree = self.uniflow.Node("applicationTree", "")
      self.appTree.add('ERROR', '---*** Standard Py Error *** ')

    except SystemException as e:
      self.switchboard.log("---*** UNIFlow SystemException ***---")
      self.switchboard.log("ERROR LOCATION: " + errorLocation)
      self.switchboard.log("ERROR MESSAGE: " + str(e.message))
      self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')

    except SQLException as e:
      self.switchboard.log("---*** SQLException ***----")
      self.switchboard.log("ERROR LOCATION: " + errorLocation)
      self.switchboard.log("ERROR MESSAGE: " + str(e.message))
      self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')

    except BaseException as e:
      self.switchboard.log("---*** PYTHON EXCEPTION ***---")
      self.switchboard.log("ERROR LOCATION: " + errorLocation)
      self.switchboard.log("ERROR MESSAGE: " + str(e.message))
      self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')
      self.appTree = self.uniflow.Node("applicationTree", "")
      self.appTree.add('ERROR', '---*** PyException ***----')

    except TypeError as e:
      self.switchboard.log("---*** TYPE ERROR ***---")
      self.switchboard.log("ERROR LOCATION: " + errorLocation)
      self.switchboard.log("ERROR MESSAGE: " + str(e.message))
      self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')
      self.appTree = self.uniflow.Node("applicationTree", "")
      self.appTree.add('ERROR', '---*** TypeError ***----')

    except:
      self.switchboard.log("---*** UNSPECIFIED ERROR ***---")
      self.switchboard.log("ERROR LOCATION: " + errorLocation)
      self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')
      self.appTree = self.uniflow.Node("applicationTree", "")
      self.appTree.add('ERROR', "*** Unspecified Error *****")

    return self.appTree