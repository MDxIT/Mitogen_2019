'''
  #
  # Report Meta Data class
  #   
  #     
  #
'''

import com.uniconnect.uniflow as uniflow
from java.sql import SQLException
from orderNode import Order
from physicianSiteNode import PhysicianSite
from physicianNode import Physician
from clinicalInfoNode import ClinicalInfo
from specimenNode import Specimen
from patientNode import Patient
from buildInformationObject import *
from dateFormatter import DateFormatter
from report import Report
import re

class ReportMetaData(infoObject, Report):

  def __init__(self, switchboard, reportId):
    Report.__init__(self, switchboard, reportId)
    self.patientId = ''

  def getReportLinks(self):
    reportLinks = {}
    query = """ SELECT
                  rd.reportId,
                  rf.requestId,
                  rf.physicianSiteId,
                  rf.physicianId,
                  rf.patientId,
                  rf.sendingApp,
                  rf.sendingFacility,
                  rqs.specimenId,
                  sr.runId
                FROM reportDetails rd
                INNER JOIN requestForms rf
                  ON rd.requestFormsId = rf.Id
                LEFT JOIN reportSpecimens rs
                  ON rd.id = rs.reportDetailsId
                LEFT JOIN requestSpecimens rqs
                  ON rs.requestSpecimensId = rqs.id
                LEFT JOIN specimenMethods sm
                  ON rs.specimenMethodsId = sm.Id
                LEFT JOIN specimenRuns sr
                  ON sm.Id = sr.specimenMethodsId
                WHERE rd.reportId = ? """


    stmt = self.switchboard.connection.prepareStatement(query)
    stmt.setString(1, self.reportId)
    # print 'REPORTLINKSQUERY: ', stmt
    rs = stmt.executeQuery()

    s = 1
    r = 1

    requestId = ""
    physicianSiteId = ""
    physicianId = ""
    patientId = ""
    sendingApp = ""
    sendingFacility = ""
    specimenIndex = []

    reportLinks['specimens'] = {}
    reportLinks['runs'] = {}

    while rs.next():

      requestId = rs.getString('requestId')
      physicianSiteId = rs.getString('physicianSiteId')
      physicianId = rs.getString('physicianId')
      patientId = rs.getString('patientId')
      specimenId = rs.getString('specimenId')
      runId = rs.getString('runId')
      sendingApp = rs.getString('sendingApp')
      sendingFacility = rs.getString('sendingFacility')

      if specimenId != None:
        specimenKey = ''

        for key, specimen in reportLinks['specimens'].items():
          if specimenId == specimen['specimenId']:
            specimenKey = key
            print specimenKey
            break

        errorLocation = 'getLinkedNodes: reportId - add new specimen'
        if specimenKey == '':
          reportLinks['specimens'][s] = {"specimenId":specimenId, "requests" : [1], "reports": [1], "patient": 1}

          if runId != None:
            reportLinks['specimens'][s]['runs'] = [r]
            reportLinks['runs'][r] = {"runId":runId, "request" : 1, "specimen" : s}
            r += 1

          specimenIndex.append(s)
          s += 1

        else:

          errorLocation = 'getLinkedNodes: reportId - add runs to exisiting specimen'
          reportLinks['specimens'][specimenKey]['runs'].append(r)
          reportLinks['runs'][r] = {"runId":runId, "request" : 1, "specimen" : specimenKey}
          r += 1


    rs.close()

    reportLinks['physicians'] = {1:{"physicianId":physicianId, "requests" : [1], "physicianSites": [1], "reports": [1]}}
    reportLinks['physicianSites'] = {1:{"physicianSiteId":physicianSiteId, "physicians": [1]}}
    reportLinks['patients'] = {1:{"patientId":patientId, "requests" : [1], "specimens" : specimenIndex, "probands": [], "reports": [1]}}
    reportLinks['orders'] = {1:{"requestId":requestId,  "patients": 1, "physicians": 1, "physicianSites": 1, "clinicalInfo": 1, "billing": 1, "specimens" : specimenIndex,"reports": [1]}}
    reportLinks['reports'] = {1:{"reportId":self.reportId, "requests" : 1, "specimens" : specimenIndex, "sendingApp" : ifNull(sendingApp), "sendingFacility" : ifNull(sendingFacility)}}

    self.patientId = patientId

    return reportLinks

  def makeReportMetaDict(self):
    links = self.getReportLinks()
    reportMetaDict = {}

    for key in links["reports"]:
      orderKey = links["reports"][key]['requests']
      orderId = links["orders"][orderKey]["requestId"]
      orderObj = Order(self.switchboard, orderId, orderKey)
      reportMetaDict["orderInformation"] = orderObj.getOrder()

      physicianKey = links["orders"][key]['physicians']
      physicianId = links["physicians"][physicianKey]["physicianId"]
      physicianObj = Physician(self.switchboard, physicianId, physicianKey)
      reportMetaDict["orderInformation"]["physicianInformation"] = physicianObj.getPhysician()

      errorLocation = 'reportDictionary -- get site'
      siteKey = links["orders"][key]['physicianSites']
      siteId = links["physicianSites"][siteKey]["physicianSiteId"]
      siteObj = PhysicianSite(self.switchboard, siteId, siteKey)
      reportMetaDict["orderInformation"]["siteInformation"] = siteObj.getPhysicianSite()

      errorLocation = 'reportDictionary -- get patient'
      patientKey = links["orders"][key]['patients']
      patientId = links["patients"][patientKey]["patientId"]
      patientObj = Patient(self.switchboard, patientId, patientKey)
      reportMetaDict["patientInformation"] = patientObj.getPatient()

      errorLocation = 'reportDictionary -- get clinical info'
      clincialKey = links["orders"][key]['clinicalInfo']
      clinicalObj = ClinicalInfo(self.switchboard, orderId, clincialKey)
      reportMetaDict["clinicalInformation"] = clinicalObj.getClinicalInfo()

      errorLocation = 'reportDictionary -- get specimens '
      specimenKeys = links["reports"][key]['specimens']
      reportMetaDict["specimenInfo"] = dict()
      reportMetaDict["specimenInfo"]["label"] = "Specimen Information"
      for i in specimenKeys:

        specimenId = links["specimens"][i]["specimenId"]
        specimenObj = Specimen(self.switchboard, specimenId, i)
        reportMetaDict["specimenInfo"][specimenId] = specimenObj.getSpecimen()

    return reportMetaDict

  '''
    # Returns a dictionary of inputs with their associated screen labels based on 
    # the configuration provided by the reportDefinitionVersionId
    #
    # @return<dict> lblObj
    #
  '''
  def getLabels(self, reportVersion):

    rpVer = int(reportVersion)
    lblObj = {}

    lblQuery = '''
      SELECT fcp.inputName, fis.screenLabel
      FROM reportMetadataFields rFields
      INNER JOIN reportDefinitionVersion rVer 
        ON rVer.id = rFields.reportDefinitionVersionId 
        AND rVer.active = 1
      INNER JOIN formInputSettings fis 
        ON fis.id = rFields.formInputSettingsId
      INNER JOIN formConfigurableParts fcp 
        ON fis.formConfigurablePartsId = fcp.id
      WHERE rFields.reportDefinitionVersionId = ?
    '''

    lblStmt = self.switchboard.connection.prepareStatement(lblQuery)
    lblStmt.setInt(1, rpVer)
    lblRs = lblStmt.executeQuery()

    while lblRs.next():

      inputName = lblRs.getString(1)
      screenLabel = lblRs.getString(2)

      lblObj[inputName] = screenLabel

    lblRs.close()
    lblStmt.close()

    return lblObj

  '''
    # Applies labels based on the current report versions, returns dict of configured report meta data
    #
    # @param<string/int> reportVersion
    #
    # @return<dict> configuredData
    #
  '''
  def getMetaDataObj(self, reportVersion, formatDate=False):
    ## CREATE DICTS
    rptDict = self.makeReportMetaDict()
    lblDict = self.getLabels(reportVersion)
    ## GET KEYS
    rptKeys = rptDict.keys()
    lblKeys = lblDict.keys()

    configuredData = {}

    for key in rptKeys:
      for lbl in rptDict[key]:

        ## Apply date formatting if enabled
        if formatDate == True:
          ## Apply date format to general metadata
          if lbl not in ['additionalFields', 'mrn', 'siteInformation', 'physicianInformation', 'label'] and key != 'specimenInfo' and isDateField(lbl):
            formatted = self.changeDateFormat(rptDict[key][lbl]['value'])
            rptDict[key][lbl]['value'] = formatted
            print rptDict[key][lbl]['value']
          ## Apply date format to specimen info
          if key == 'specimenInfo':
            for spec in rptDict[key]:
              for item in rptDict[key][spec]:
                if spec != 'label' and item not in ['additionalFields'] and isDateField(item):
                  formatted = self.changeDateFormat(rptDict[key][spec][item]['value'])
                  rptDict[key][spec][item]['value'] = formatted

        ## Apply labels if they exist
        if lbl in lblKeys and lbl not in ['additionalFields', 'mrn', 'siteInformation', 'physicianInformation', 'label']:
          rptDict[key][lbl]['label'] = lblDict[lbl]
        elif lbl == 'mrn':
          patient = Patient(self.switchboard, self.patientId, '')
          mrnDict = patient.getReportMrn()
          rptDict[key][lbl] = mrnDict
        elif lbl == 'label':
          del rptDict[key][lbl]

    return rptDict

  def buildMetaDataNode(self, reportVersion, reportIndex):

    dataObject = self.getMetaDataObj(reportVersion)
    reportId = self.reportId

    metaDataNode = self.buildNode('metaData', dataObject, reportIndex, 'Reporting', '')
    return metaDataNode

  def changeDateFormat(self, dateStr):
    formatter = DateFormatter(self.switchboard, dateStr)
    try:
      return formatter.shortFormatDate()
    except:
      return dateStr

def isDateField(field):
  dre = '(d|D)ate'
  if re.search(dre, field) or field == 'dob':
    return True
  else:
    return False

def ifNull(value):
  if value == None:
    return ''
  else:
    return value



