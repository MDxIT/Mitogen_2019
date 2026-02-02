from reportingJsonBuilder import ReportingBuilder
from reportMetaData import ReportMetaData
from java.sql import SQLException

class ReportData(ReportingBuilder):
    ''' Extends ReportingBuilder to make a final report object
    '''

    def __init__(self, switchboard, reportId):
        ReportingBuilder.__init__(self, switchboard, reportId)
        
    def getReportWording(self):
        ''' Gets wording for the report

        Returns:
            wordingDict: Dictionary with associated wording
        '''

        pWordingList = []
        tWordingList = []
        mWordingList = []

        wQuery = '''
            SELECT 
                sectionType,
                CASE sectionType
                    WHEN 'Panel' THEN panel.name
                    WHEN 'Test' THEN test.name
                    WHEN 'Method' THEN method.name
                END AS 'name',
                codeName, 
                sectionHeader, 
                sectionContent
            FROM reportWording rw
            LEFT JOIN panels panel 
                ON panelCode = codeName
            LEFT JOIN tests test 
                ON testCode = codeName
            LEFT JOIN methods method 
                ON methodCode = codeName
            WHERE reportDefinitionVersionId = ?
        '''

        try:
            wStmt = self.switchboard.connection.prepareStatement(wQuery)
            wStmt.setString(1, self.repDefVer)
            wRs = wStmt.executeQuery()

            while wRs.next():
                wDict = {}
                wType = wRs.getString('sectionType')
                wName = wRs.getString('name')
                wCode = wRs.getString('codeName')
                wHead = wRs.getString('sectionHeader')
                wCont = wRs.getString('sectionContent')

                wDict['type'] = wType
                wDict['name'] = wName
                wDict['code'] = wCode
                wDict['header'] = wHead
                wDict['wording'] = wCont

                if wType == 'Panel':
                    pWordingList.append(wDict)
                elif wType == 'Test':
                    tWordingList.append(wDict)
                elif wType == 'Method':
                    mWordingList.append(wDict)

            wordingDict = {'panel': pWordingList, 'test': tWordingList, 'method': mWordingList}
            wRs.close()
            wStmt.close()

            self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'true')
            return wordingDict
        
        except SQLException as e:
            self.switchboard.log("---*** SQLException AT REPORTDATA GETREPORTWORDING ***----")
            self.switchboard.log("ERROR MESSAGE: " + str(e.message))
            self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')
            raise
            return
        except KeyError as e:
            self.switchboard.log("---*** KEY ERROR AT REPORTDATA GETREPORTWORDING ***----")
            self.switchboard.log("ERROR MESSAGE: " + str(e.message))
            self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')
            raise
            return


    def getReportWordingHL7(self):
        ''' Gets wording for the report HL7

        Returns:
            wordingDict: Dictionary with associated wording
        '''

        wordingList = []

        wQuery = '''
            SELECT 
                sectionType,
                CASE sectionType
                    WHEN 'Panel' THEN panel.name
                    WHEN 'Test' THEN test.name
                    WHEN 'Method' THEN method.name
                END AS 'name',
                codeName, 
                sectionHeader, 
                sectionContent
            FROM reportWording rw
            LEFT JOIN panels panel 
                ON panelCode = codeName
            LEFT JOIN tests test 
                ON testCode = codeName
            LEFT JOIN methods method 
                ON methodCode = codeName
            WHERE reportDefinitionVersionId = ?
        '''

        try:
            wStmt = self.switchboard.connection.prepareStatement(wQuery)
            wStmt.setString(1, self.repDefVer)
            wRs = wStmt.executeQuery()

            while wRs.next():
                wDict = {}
                wType = wRs.getString('sectionType')
                wName = wRs.getString('name')
                wCode = wRs.getString('codeName')
                wHead = wRs.getString('sectionHeader')
                wCont = wRs.getString('sectionContent')

                wDict['type'] = wType
                wDict['name'] = wName
                wDict['code'] = wCode
                wDict['header'] = wHead
                wDict['wording'] = wCont

                wordingList.append({wType: wDict})

            wordingDict = {'wording': wordingList}
            wRs.close()
            wStmt.close()
            self.switchboard.log(str(wordingDict))

            self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'true')
            return wordingDict
        
        except SQLException as e:
            self.switchboard.log("---*** SQLException AT REPORTDATA GETREPORTWORDINGHL7 ***----")
            self.switchboard.log("ERROR MESSAGE: " + str(e.message))
            self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')
            raise
            return
        except KeyError as e:
            self.switchboard.log("---*** KEY ERROR AT REPORTDATA GETREPORTWORDINGHL7 ***----")
            self.switchboard.log("ERROR MESSAGE: " + str(e.message))
            self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')
            raise
            return

    '''
        #
        #
        #
    '''
    def getReportSiteInfo(self):
        ''' Gets the reporting site info

        Returns:
            siteInfoDict: Dictionary containing site info
        '''

        siteInfoDict = {}

        sQuery = '''
            SELECT 
                IFNULL(pSite.name, '') AS 'primarySiteName',
                IFNULL(pSite.address1, '') AS 'primarySiteAddress1',
                IFNULL(pSite.address2, '') AS 'primarySiteAddress2',
                IFNULL(pSite.city, '') AS 'primarySiteCity',
                IFNULL(pSite.state, '') AS 'primarySiteState',
                IFNULL(pSite.postalcode, '') AS 'primarySiteZip',
                IFNULL(pSite.phone1, '') AS 'primarySitePhone1',
                IFNULL(pSite.phone2, '') AS 'primarySitePhone2',
                IFNULL(pSite.fax1, '') AS 'primarySiteFax1',
                IFNULL(pSite.fax2, '') AS 'primarySiteFax2',
                IFNULL(dSite.name, '') AS 'departmentName',
                IFNULL(dSite.address1, '') AS 'departmentSiteAddress1',
                IFNULL(dSite.address2, '') AS 'departmentSiteAddress2',
                IFNULL(dSite.city, '') AS 'departmentSiteCity',
                IFNULL(dSite.state, '') AS 'departmentSiteState',
                IFNULL(dSite.postalcode, '') AS 'departmentSiteZip',
                IFNULL(dSite.phone1, '') AS 'departmentSitePhone1',
                IFNULL(dSite.phone2, '') AS 'departmentSitePhone2',
                IFNULL(dSite.fax1, '') AS 'departmentSiteFax1',
                IFNULL(dSite.fax2, '') AS 'departmentSiteFax2',
                IFNULL(lSite.name, '') AS 'locationName',
                IFNULL(lSite.address1, '') AS 'locationSiteAddress1',
                IFNULL(lSite.address2, '') AS 'locationSiteAddress2',
                IFNULL(lSite.city, '') AS 'locationSiteCity',
                IFNULL(lSite.state, '') AS 'locationSiteState',
                IFNULL(lSite.postalcode, '') AS 'locationSiteZip',
                IFNULL(lSite.phone1, '') AS 'locationSitePhone1',
                IFNULL(lSite.phone2, '') AS 'locationSitePhone2',
                IFNULL(lSite.fax1, '') AS 'locationSiteFax1',
                IFNULL(lSite.fax2, '') AS 'locationSiteFax2'
            FROM reportDefinitionSites rds
            INNER JOIN organizationSites pSite 
                ON pSite.siteId = rds.siteId
            LEFT JOIN organizationSites dSite 
                ON dSite.siteId = rds.departmentId
            LEFT JOIN organizationSites lSite 
                ON lSite.siteId = rds.locationId
            WHERE rds.reportDefinitionVersionId = ?
        '''
        try:
            sStmt = self.switchboard.connection.prepareStatement(sQuery)
            sStmt.setString(1, self.repDefVer)
            sRs = sStmt.executeQuery()
            sMetaData = sRs.getMetaData()
            sColCount = sMetaData.getColumnCount()
            while sRs.next():
                for col in xrange(1, sColCount + 1):
                    colName = sMetaData.getColumnLabel(col)
                    res = sRs.getString(colName)
                    siteInfoDict[colName] = res

            sRs.close()
            sStmt.close()

            self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'true')
            return siteInfoDict
        
        except SQLException as e:
            self.switchboard.log("---*** SQLException AT REPORTDATA GETREPORTWORDING ***----")
            self.switchboard.log("ERROR MESSAGE: " + str(e.message))
            self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')
            raise
            return
        except KeyError as e:
            self.switchboard.log("---*** KEY ERROR AT REPORTDATA GETREPORTWORDING ***----")
            self.switchboard.log("ERROR MESSAGE: " + str(e.message))
            self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')
            raise
            return

    def getReportReferences(self):
        ''' Gets report references

        Returns:
            refLst: List of reference objects
        '''

        refLst = []
        rQuery = '''
            SELECT
                repRef.codeName, 
                CASE repRef.assayType
                    WHEN 'panel' THEN pan.name
                    WHEN 'test' THEN test.name
                    WHEN 'method' THEN meth.name 
                END AS 'name',
                allRef.url,
                allRef.reference
            FROM reportReferences repRef
            INNER JOIN allReferences allRef 
                ON allRef.id = repRef.referenceId
            LEFT JOIN panels pan 
                ON pan.panelCode = repRef.codeName
            LEFT JOIN tests test 
                ON test.testCode = repRef.codeName
            LEFT JOIN methods meth 
                ON meth.methodCode = repRef.codeName
            WHERE repRef.reportDefinitionVersionId = ?
                AND allRef.active = 1
            ORDER BY allRef.reference
        '''
        try:
            rStmt = self.switchboard.connection.prepareStatement(rQuery)
            rStmt.setString(1, self.repDefVer)
            rRs = rStmt.executeQuery()
            rMetaData = rRs.getMetaData()
            rColCount = rMetaData.getColumnCount()

            while rRs.next():
                refDict = {}
                for col in xrange(1, rColCount + 1):
                    colName = rMetaData.getColumnLabel(col)
                    res = rRs.getString(colName)
                    refDict[colName] = res

                refLst.append(refDict)

            rRs.close()
            rStmt.close()

            self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'true')
            return refLst
        
        except SQLException as e:
            self.switchboard.log("---*** SQLException AT REPORTDATA GETREPORTWORDING ***----")
            self.switchboard.log("ERROR MESSAGE: " + str(e.message))
            self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')
            raise
            return
        except KeyError as e:
            self.switchboard.log("---*** KEY ERROR AT REPORTDATA GETREPORTWORDING ***----")
            self.switchboard.log("ERROR MESSAGE: " + str(e.message))
            self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')
            raise
            return

    def makeRejCanObject(self, reportType):
        ''' Makes rejection/cancelation data object
    
        Args:
            reportType: String report type

        Returns:
            reportDict: Dictionary of report data
        '''

        reportDict = self.createReportDict()
        if reportType == 'rejected':
            analysisRawData, nonAnalysisRawData = self.getMixedData()
            specimens = self.organizeBySpec(analysisRawData + nonAnalysisRawData)
            specimensHL7 = self.organizeBySpecHL7(analysisRawData)
        elif reportType == 'canceled':
            if self.associatedSpecimens:
                associatedRuns = self.getAssociatedRuns()
                analysisRawData = self.getAnalysisResultsByRun(associatedRuns)
                nonAnalysisRawData = self.getNonAnalysisData(associatedRuns)
                specimens = self.organizeBySpec(nonAnalysisRawData)
                specimensHL7 = self.organizeBySpecHL7(analysisRawData)
            else:
                specimens = self.createSpecimenDict('')
                specimensHL7 = {'specimen': ''}

        reportDict['report']['reportTitle'] = self.title
        reportDict['report']['reportDescription'] = self.description
        reportDict['report']['reportDetailsId'] = self.reportDetailsId
        reportDict['report']['specimens'] = specimens
        reportDict['report']['specimensHL7'] = specimensHL7

        return reportDict

    def getReportDict(self, reportType, formatDate):
        ''' Gets report data object based on treport type

        Args:
            reportType: String of report type
            formatDate: Bool

        Returns:
            data object
        '''

        if reportType in ['rejected', 'canceled']:
            return self.makeRejCanObject(reportType)
        else:
            return self.makeReportReviewObj(formatDate)

    def makeReportObj(self, formatDate=False):
        ''' Workhorse function that makes final report object
        Args:
            formatDate: Bool

        Returns:
            reportObject: Diction with final report info
        '''

        reportType = self.getReportType()
        reportMetaData = ReportMetaData(self.switchboard, self.reportId)
        reportObject = self.getReportDict(reportType, formatDate)

        reportObject['report']['reportType'] = reportType
        reportObject['report']['status'] = self.getStatus()
        reportObject['report']['siteInfo'] = self.getReportSiteInfo()
        reportObject['report']['metaData'] = reportMetaData.getMetaDataObj(self.repDefVer, formatDate)
        reportObject['report']['references'] = self.getReportReferences()
        reportObject['report']['imageResults'] = self.getReportImages()
        reportObject['report']['wording'] = self.getReportWording()
        reportObject['report']['addendedText'] = self.getModificationText('addended')
        reportObject['report']['amendedText'] = self.getModificationText('amended')
        reportObject['report']['correctedText'] = self.getModificationText('corrected')
        reportObject['report']['canceledText'] = self.getModificationText('canceled')
        reportObject['report']['rejectedText'] = self.getModificationText('rejected')
        reportObject['report']['wordingHL7'] = self.getReportWordingHL7()
        reportObject['report']['modificationTextHL7'] = self.getModificationTextHL7(reportObject['report'])

        if self.associatedSpecimens:
            specimenMapper = self.getSpecimenMapperHL7(reportObject['report']['specimensHL7'])
        else:
            specimenMapper = {'':''}
        reportObject['report']['specimensHL7Mapper'] = specimenMapper

        return reportObject

    def getSpecimenMapperHL7(self, specimenResult):
        ''' Gets parent child specimen mapping for HL7

        Args:
            specimenResult

        Returns:
            output: Dictionary with specimen mapping
        '''


        getParentSpecimenIdSql = "SELECT rs.specimenId FROM specimenRuns srh INNER JOIN " + \
                        " specimenMethods sm ON srh.specimenMethodsId = sm.id INNER JOIN " + \
                        " requestSpecimens rs ON sm.requestSpecimensId = rs.id WHERE " +\
                        " srh.currentContainerId = ? LIMIT 1"

        try:
            ps = self.switchboard.connection.prepareStatement(getParentSpecimenIdSql)
            output = {}

            for result in specimenResult:
                    specimenId = result["specimen"]["specimen"]
                    ps.setString(1, specimenId)
                    rs = ps.executeQuery()
                    if rs.next():
                            parentSpecimenId = rs.getString(1)
                            output[specimenId] = parentSpecimenId

                    rs.close()
            ps.close()

            self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'true')
            return output
        
        except SQLException as e:
            self.switchboard.log("---*** SQLException AT REPORTDATA GETSPECIMENMAPPERHL7 ***----")
            self.switchboard.log("ERROR MESSAGE: " + str(e.message))
            self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')
            raise
            return
        except KeyError as e:
            self.switchboard.log("---*** KEY ERROR AT REPORTDATA GETSPECIMENMAPPERHL7 ***----")
            self.switchboard.log("ERROR MESSAGE: " + str(e.message))
            self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')
            raise
            return

    def getReportImages(self):

        reportImageResults = []
        iQuery = '''
            SELECT 
                repRes.id AS 'reportResultDataId',
                repRes.specimenId,
                repRes.panelCode,
                pan.name AS 'panelName',
                repRes.testCode,
                IFNULL(tes.name, '') AS 'testName',
                repRes.methodCode,
                meth.name AS 'methodName',
                am.id AS 'analysisMethodId',
                am.methodName AS 'analysisMethodName',
                addef.value AS 'resultLabel',
                addef.dataType,
                repRes.imageResult AS 'result',
                IFNULL(repRes.interpretation, '') AS 'interpretation',
                IFNULL(repRes.wording, '') AS 'wording',
                repRes.isOverall,
                repRes.isPanelOverall,
                IFNULL(repRes.limits, '') AS 'limits',
                IFNULL(repRes.reportableUnits, '') AS 'reportableUnits',
                repRes.analysisDataId,
                addef.resultCode AS 'resultCode'
            FROM reportDetails rd
            INNER JOIN reportResultData repRes 
                ON repRes.reportDetailsId = rd.id
            INNER JOIN panels pan 
                ON pan.panelCode = repRes.panelCode
            INNER JOIN analysisData ad 
                ON ad.id = repRes.analysisDataId
            INNER JOIN analysisDataRuns adr 
                ON ad.analysisDataRunsId = adr.id
            INNER JOIN analysisDataDefinition addef 
                ON addef.id = ad.analysisDataDefinitionId
            INNER JOIN analysisMethodVersions amv  
                ON amv.id = addef.analysisMethodVersionsId
            INNER JOIN analysisMethods am 
                ON am.id = amv.analysisMethodsId
            LEFT JOIN tests tes 
                ON tes.testCode = repRes.testCode
            LEFT JOIN methods meth 
                ON meth.methodCode = repRes.methodCode
            WHERE rd.reportId = ?
                AND repRes.currentResult = 1
                AND addef.dataType = 'image'
        '''

        try:

            iStmt = self.switchboard.connection.prepareStatement(iQuery)
            iStmt.setString(1, self.reportId)

            iRs = iStmt.executeQuery()

            while iRs.next():

                resDict = self.createResDict()

                reportResultDataId = iRs.getString('reportResultDataId')
                specimenId = iRs.getString('specimenId')
                panelCode = iRs.getString('panelCode')
                panelName = iRs.getString('panelName')
                testCode = iRs.getString('testCode')
                testName = iRs.getString('testName')
                result = iRs.getString('result')
                resultLabel = iRs.getString('resultLabel')
                dataType = iRs.getString('dataType')
                interpretation = iRs.getString('interpretation')
                wording = iRs.getString('wording')
                resultCode = iRs.getString('resultCode')
                resType = iRs.getString('dataType')
                aMeth = iRs.getString('analysisMethodId')
                aMethName = iRs.getString('analysisMethodName')

                resDict['reportResultDataId'] = reportResultDataId
                resDict['resultLabel'] = resultLabel
                resDict['specimen'] = specimenId
                resDict['result'] = result
                resDict['dataType'] = resType
                resDict['analysisMethodId'] = aMeth
                resDict['analysisMethodName'] = aMethName
                resDict['panelCode'] = panelCode
                resDict['panelName'] = panelName
                resDict['testCode'] = testCode
                resDict['testName'] = testName
                resDict['interpretation'] = interpretation
                resDict['wording'] = wording
                resDict['imageResult'] = 'no_image_available'
                resDict['secureToken'] = self.switchboard.registerSecureFileRequest(self.switchboard.userId, result, 'image/jpg', 'img')

                reportImageResults.append(resDict)

            iStmt.close()

            self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'true')
            return reportImageResults
            
        except SQLException as e:
            self.switchboard.log("---*** SQLException AT REPORTINGJSONBUILDER GETREPORTRAWDATA ***----")
            self.switchboard.log("ERROR MESSAGE: " + str(e.message))
            self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')
            raise
            return
        except KeyError as e:
            self.switchboard.log("---*** KEY ERROR AT REPORTINGJSONBUILDER GETREPORTRAWDATA ***----")
            self.switchboard.log("ERROR MESSAGE: " + str(e.message))
            self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')
            raise
            return


























