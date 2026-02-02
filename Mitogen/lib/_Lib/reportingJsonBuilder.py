from reportJsonBuilder import ReportBuilder
from dateFormatter import DateFormatter
from java.sql import SQLException
import json

class ReportingBuilder(ReportBuilder):
    ''' Extends ReportBuilder to use report table

    Attributes:
        overAllResult: Dictionary of overall result, interpretation, wording, and reportResultDataId
        overallPanelResults: List of panel result objects
    '''

    def __init__(self, switchboard, reportId):
        ReportBuilder.__init__(self, switchboard, reportId)
        self.overAllResult = {'overallResult': '', 'overallInterpretation': '', 'overallWording': '', 'reportResultDataId': ''}
        self.overallPanelResults = []

    def getOverallPanelJson(self):
        return json.dumps(self.overallPanelResults)


    def getOverallResult(self):
        ''' Gets overall result/interpretion/wording for report

        Returns:
            oDict: Dictionary that contains result/interpretion/wording
        '''

        self.switchboard.log('<<<<<< GETTING OVERALLRESULT FOR: ' + self.reportId + '>>>>>>')
        oDict = self.overAllResult
        try:
            oQuery = '''
                SELECT 
                    IFNULL(varcharResult, '') AS 'varcharResult',
                    IFNULL(interpretation, '') AS 'interpretation',
                    IFNULL(wording, '') AS 'wording',
                    id AS 'reportResultDataId'
                FROM reportResultData
                WHERE reportDetailsId = ?
                    AND isOverall = 1
                    AND currentResult = 1
            '''
            oStmt = self.switchboard.connection.prepareStatement(oQuery)
            oStmt.setString(1, self.reportDetailsId)
            oRs = oStmt.executeQuery()

            while oRs.next():
                res = oRs.getString('varcharResult')
                interp = oRs.getString('interpretation')
                wording = oRs.getString('wording')
                repResId = oRs.getString('reportResultDataId')

                oDict = {'overallResult': res, 'overallInterpretation': interp, 'overallWording': wording, 'reportResultDataId': repResId}

            oRs.close()
            oStmt.close()

            self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'true')
            return oDict
        
        except SQLException as e:
            self.switchboard.log("---*** SQLException AT REPORTINGJSONBUILDER GETOVERALLRESULT ***----")
            self.switchboard.log("ERROR MESSAGE: " + str(e.message))
            self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')
            raise
            return
        except KeyError as e:
            self.switchboard.log("---*** KEY ERROR AT REPORTINGJSONBUILDER GETOVERALLRESULT ***----")
            self.switchboard.log("ERROR MESSAGE: " + str(e.message))
            self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')

    def getOverallPanelResults(self):
        ''' Gets overall panel result/interpretion/wording for report

        Returns:
            oDict: List that contains result/interpretion/wording objects 
        '''
        pList = []

        self.switchboard.log('<<<<<< GETTING OVERALL PANEL RESULTS >>>>>>')
        try:
            pQuery = '''
                SELECT
                    IFNULL(rrd.varcharResult, '') AS 'varcharResult',
                    IFNULL(rrd.interpretation, '') AS 'interpretation',
                    IFNULL(rrd.panelCode, '') AS 'panelCode',
                    IFNULL(p.name, '') AS 'name',
                    IFNULL(rrd.wording, '') AS 'wording',
                    rrd.id AS 'reportResultDataId'
                FROM reportResultData rrd
                INNER JOIN panels p 
                    ON p.panelCode = rrd.panelCode
                WHERE reportDetailsId = ?
                    AND isPanelOverall = 1
            '''
            pStmt = self.switchboard.connection.prepareStatement(pQuery)
            pStmt.setString(1, self.reportDetailsId)
            pRs = pStmt.executeQuery()

            while pRs.next():
                pCode = pRs.getString('panelCode')
                pName = pRs.getString('name')
                res = pRs.getString('varcharResult')
                interp = pRs.getString('interpretation')
                wording = pRs.getString('wording')
                repResId = pRs.getString('reportResultDataId')

                pDict = self.createPanelInfoDict(pCode, pName, res, interp, wording)
                pDict['reportResultDataId'] = repResId

                pList.append(pDict)
            pRs.close()
            pStmt.close()

            self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'true')
            return pList
        

        except SQLException as e:
            self.switchboard.log("---*** SQLException AT REPORTINGJSONBUILDER GETOVERALLPANELRESULTS ***----")
            self.switchboard.log("ERROR MESSAGE: " + str(e.message))
            self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')
            raise
            return
        except KeyError as e:
            self.switchboard.log("---*** KEY ERROR AT REPORTINGJSONBUILDER GETOVERALLPANELRESULTS ***----")
            self.switchboard.log("ERROR MESSAGE: " + str(e.message))
            self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')
            raise
            return

    def getNonAnalysisData(self, runList):
        ''' Gets non analysis data for runs

        Used for canceled/rejected report

        Args:
            runList: List of runIds

        Returns:
            resList: List of result objects
        '''
        
        resList = []

        cQuery = '''
            SELECT 
                sr.currentContainerId AS 'specimen',
                IFNULL(sm.panelCode, '') AS 'panelCode',
                IFNULL(pan.name, '') AS 'panelName',
                IFNULL(sm.testCode, '') AS 'testCode',
                IFNULL(test.name, '') AS 'testName',
                IFNULL(sm.methodCode, '') AS 'methodCode',
                IFNULL(meth.name, '') AS 'methodName'
            FROM specimenRuns sr
            INNER JOIN specimenMethods sm
                ON sm.id = sr.specimenMethodsId
            INNER JOIN panels pan 
                ON pan.panelCode = sm.panelCode
            LEFT JOIN tests test 
                ON test.testCode = sm.testCode
            LEFT JOIN methods meth 
                ON meth.methodCode = sm.methodCode
            WHERE runId = ?
        '''
        try:
            cStmt = self.switchboard.connection.prepareStatement(cQuery)
            for run in runList:
                resDict = self.createResDict()
                cStmt.setString(1, run)
                cRs = cStmt.executeQuery()

                while cRs.next():
                    specimen = cRs.getString('specimen')
                    panelCode = cRs.getString('panelCode')
                    self.associatedPanels.add(panelCode)
                    panelName = cRs.getString('panelName')
                    testCode = cRs.getString('testCode')
                    self.associatedTests.add(testCode)
                    testName = cRs.getString('testName')
                    methodCode = cRs.getString('methodCode')
                    self.associatedMethods.add(methodCode)
                    methodName = cRs.getString('methodName')
                    
                    resDict['specimen'] = specimen
                    resDict['panelCode'] = panelCode
                    resDict['panelName'] = panelName
                    resDict['testCode'] = testCode
                    resDict['testName'] = testName
                    resDict['methodCode'] = methodCode
                    resDict['methodName'] = methodName

                resList.append(resDict)
            
            self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'true')
            return resList

        except SQLException as e:
            self.switchboard.log("---*** SQLException AT REPORTINGJSONBUILDER GETOVERALLPANELRESULTS ***----")
            self.switchboard.log("ERROR MESSAGE: " + str(e.message))
            self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')
            raise
            return
        except KeyError as e:
            self.switchboard.log("---*** KEY ERROR AT REPORTINGJSONBUILDER GETOVERALLPANELRESULTS ***----")
            self.switchboard.log("ERROR MESSAGE: " + str(e.message))
            self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')
            raise
            return

    def getMixedData(self):
        ''' Gets a list of results

        Gets a list of results for both reported/analyzed/non-analyzed samples

        Returns:
            finalResList: List of results
        '''

        runs = self.getAssociatedRuns()
        runs = self.getAllRuns(runs)

        aRuns = []
        naRuns = []
        aRunRes = []
        naRunRes = []
        finalResList = []
        try: 
            rQuery = '''
                SELECT 
                    CASE 
                        WHEN COUNT(1) > 0 THEN 1 
                        ELSE 0 
                    END
                FROM analysisDataRuns adr
                INNER JOIN specimenRuns sr
                    ON sr.id = adr.specimenRunsId
                WHERE runId = ?
            '''
            rStmt = self.switchboard.connection.prepareStatement(rQuery)
            for run in runs:
                rStmt.setString(1, run)
                rRs = rStmt.executeQuery()
                while rRs.next():
                    res = rRs.getInt(1)
                    if res == 1:
                        aRuns.append(run)
                    else:
                        naRuns.append(run)
                rRs.close()
            rStmt.close()

            aRunRes = self.getAnalysisResultsByRun(aRuns)
            naRunRes = self.getNonAnalysisData(naRuns)

            self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'true')
            return aRunRes, naRunRes

        except SQLException as e:
            self.switchboard.log("---*** SQL EXCEPTION AT REPORTINGJSONBUILDER GETMIXEDDATA ***----")
            self.switchboard.log("ERROR MESSAGE: " + str(e.message))
            self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')
            raise

        return None, None


    def getReportRawData(self, formatDate=False):
        ''' Gets results from reporting table

        Args:
            formatDate: Bool to determine if the data should be formatted

        Returns:
            rawResults: List of result objects
        '''

        rawResults = []

        self.switchboard.log('<<<<<< GETTING REPORT RESULT DATA FOR: ' + self.reportId + ' >>>>>>')
        try:
            rQuery = '''
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
                    CASE
                        WHEN repRes.varcharResult IS NOT NULL THEN repRes.varcharResult
                        WHEN repRes.decimalResult IS NOT NULL THEN 
                            CASE addef.sigFig
                                WHEN 0 THEN ROUND(repRes.decimalResult, 0)
                                WHEN 1 THEN ROUND(repRes.decimalResult, 1)
                                WHEN 2 THEN ROUND(repRes.decimalResult, 2)
                                WHEN 3 THEN ROUND(repRes.decimalResult, 3)
                                WHEN 4 THEN ROUND(repRes.decimalResult, 4)
                                WHEN 5 THEN ROUND(repRes.decimalResult, 5)
                                WHEN 6 THEN ROUND(repRes.decimalResult, 6)
                            END
                        WHEN repRes.dateTimeResult IS NOT NULL THEN repRes.dateTimeResult
                    END AS 'result',
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
                    AND addef.dataType <> 'image'
            '''
            rStmt = self.switchboard.connection.prepareStatement(rQuery)
            rStmt.setString(1, self.reportId)
            rRs = rStmt.executeQuery()

            while rRs.next():

                resDict = {}

                reportResultDataId = rRs.getInt('reportResultDataId')
                specimen = rRs.getString('specimenId')
                if specimen not in self.associatedSpecimens:
                    self.associatedSpecimens.append(specimen)
                panelCode = rRs.getString('panelCode')
                self.associatedPanels.add(panelCode)
                panelName = rRs.getString('panelName')
                testCode = rRs.getString('testCode')
                self.associatedTests.add(testCode)
                testName = rRs.getString('testName')
                methodCode = rRs.getString('methodCode')
                if methodCode != None:
                    self.associatedMethods.add(methodCode)
                methodName = rRs.getString('methodName')
                analysisMethodId = rRs.getString('analysisMethodId')
                analysisMethodName = rRs.getString('analysisMethodName')
                resultLabel = rRs.getString('resultLabel')
                dataType = rRs.getString('dataType')
                result = rRs.getString('result')
                interpretation = rRs.getString('interpretation')
                wording = rRs.getString('wording')
                isOverall = rRs.getInt('isOverall')
                isPanelOverall = rRs.getInt('isPanelOverall')
                if dataType != 'dateTime':
                    limits = rRs.getString('limits')
                    try:
                        limits = limits.rsplit(':')[1]
                    except IndexError:
                        limits = limits
                else: 
                    limits = ''
                    if formatDate == True:
                        formatObj = DateFormatter(self.switchboard, result)
                        result = formatObj.shortFormatDate()


                units = rRs.getString('reportableUnits')
                analysisDataId = rRs.getString('analysisDataId')
                resultCode = rRs.getString('resultCode')

                resDict['reportResultDataId'] = reportResultDataId
                resDict['specimen'] = specimen                  
                resDict['panelCode'] = panelCode                 
                resDict['panelName'] = panelName                 
                resDict['testCode'] = testCode                  
                resDict['testName'] = testName                  
                resDict['methodCode'] = methodCode              
                resDict['methodName'] = methodName              
                resDict['analysisMethodId'] = analysisMethodId  
                resDict['analysisMethodName'] = analysisMethodName
                resDict['resultLabel'] = resultLabel                
                resDict['dataType'] = dataType                  
                resDict['result'] = result                      
                resDict['interpretation'] = interpretation      
                resDict['wording'] = wording                     
                resDict['isOverall']= isOverall                 
                resDict['isPanelOverall'] = isPanelOverall
                resDict['referenceRange'] = limits                      
                resDict['units'] = units
                resDict['limitUnits'] = units       
                resDict['analysisDataId'] = analysisDataId
                resDict['reportable'] = 'Reportable'
                resDict['resultCode'] = resultCode

                rawResults.append(resDict)

            rRs.close()
            rStmt.close()

            self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'true')
            return rawResults

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


    def makeReportReviewObj(self, formatDate=False):
        ''' Makes a report object with data from reporting tables

        Args:
            formatDate: Bool

        Returns:
            reportDict: Dictionary of the report information
        '''

        reportDict = self.createReportDict()
        rawData = self.getReportRawData(formatDate)
        self.overAllResult = self.getOverallResult()
        overallDict = self.overAllResult

        self.switchboard.log('<<<<<< MAKING REPORT REVIEW OBJECT >>>>>>')
        try:

            reportDict['report']['overallResult'] = overallDict['overallResult']
            reportDict['report']['overallInterpretation'] = overallDict['overallInterpretation']
            reportDict['report']['overallWording'] = overallDict['overallWording']
            reportDict['report']['reportResultDataId'] = overallDict['reportResultDataId']
            reportDict['report']['reportTitle'] = self.title
            reportDict['report']['reportDescription'] = self.description
            reportDict['report']['reportDate'] = ''
            reportDict['report']['reportDetailsId'] = self.reportDetailsId
            reportDict['report']['specimens'] = self.organizeBySpec(rawData)
            reportDict['report']['specimensHL7'] = self.organizeBySpecHL7(rawData)
            overallPanelResults = self.getTestNamesByPanel(self.getOverallPanelResults())
            reportDict['report']['overallPanelResults'] = overallPanelResults
            self.overallPanelResults = overallPanelResults

            # Add overallPanelResults to specimensHL7 panel results
            specimensHL7 = reportDict['report']['specimensHL7']
            for specimen in specimensHL7:
                specimenPanels = specimen['specimen']['panels']
                for specimenPanel in specimenPanels:
                    panel = specimenPanel['panel']
                    for overallPanelResult in overallPanelResults:
                        if panel['code'] == overallPanelResult['panelCode']:
                            panel['overallInterpretation'] = overallPanelResult['overallInterpretation']
                            panel['overallWording'] = overallPanelResult['overallWording']
                            panel['overallResult'] = overallPanelResult['overallResult'] 
                    


            self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'true')
            return reportDict
        
        except KeyError as e:
            self.switchboard.log("---*** KEY ERROR AT REPORTINGJSONBUILDER MAKEREPORTREVIEWOBJ ***----")
            self.switchboard.log("ERROR MESSAGE: " + str(e.message))
            self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')
            raise
            return

    def getTestNamesByPanel(self, pnlLst):
        ''' Gets panel test names

        Args:
            pnlList: List of panel object

        Returns:
            pnlList: List of panel object with associated test names
        '''

        try:
            for pnl in pnlLst:
                testLst = []
                pnlCode = pnl['panelCode']
                tQuery = '''
                    SELECT t.name
                    FROM testPanels tp
                    INNER JOIN tests t
                    ON t.testCode = tp.testCode
                    WHERE tp.panelCode = ?
                '''
                tStmt = self.switchboard.connection.prepareStatement(tQuery)
                tStmt.setString(1, pnlCode)
                tRs = tStmt.executeQuery()

                while tRs.next():
                    tName = tRs.getString('name')
                    testLst.append(tName)

                pnl['testNames'] = testLst

                tRs.close()
                tStmt.close()

            self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'true')
            return pnlLst

        except SQLException as e:
            self.switchboard.log("---*** SQLException AT REPORTINGJSONBUILDER GETTESTNAMESBYPANEL ***----")
            self.switchboard.log("ERROR MESSAGE: " + str(e.message))
            self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')
            raise
            return
        except KeyError as e:
            self.switchboard.log("---*** KEY ERROR AT REPORTINGJSONBUILDER GETTESTNAMESBYPANEL ***----")
            self.switchboard.log("ERROR MESSAGE: " + str(e.message))
            self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')
            raise
            return

    def getTestNamesByPanelList(self, pnlLst):
        ''' Gets test association for panels

        Args:
            pnlList: List of panel codes (string)

        Returns:
            pnlList: List with panel and test associations
        '''


        pnlList = []

        try:
            for pnl in pnlLst:
                testLst = []
                tQuery = '''
                    SELECT 
                        t.name AS 'testName', 
                        p.name AS 'panelName'
                    FROM testPanels tp
                    INNER JOIN tests t
                    ON t.testCode = tp.testCode
                    INNER JOIN panels p 
                    ON p.panelCode = tp.panelCode
                    WHERE tp.panelCode = ?
                '''
                tStmt = self.switchboard.connection.prepareStatement(tQuery)
                tStmt.setString(1, pnl)
                tRs = tStmt.executeQuery()

                while tRs.next():
                    tName = tRs.getString('testName')
                    pName = tRs.getString('panelName')
                    testLst.append(tName)

                pnlDict = self.createPanelInfoDict(pnl, pName, '', '', '')
                pnlDict['testNames'] = testLst
                pnlList.append(pnlDict)

                tRs.close()
                tStmt.close()

            self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'true')
            return pnlList 
        
        except SQLException as e:
            self.switchboard.log("---*** SQLException AT REPORTINGJSONBUILDER GETTESTNAMESBYPANELLIST ***----")
            self.switchboard.log("ERROR MESSAGE: " + str(e.message))
            self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')
            raise
            return
        except KeyError as e:
            self.switchboard.log("---*** KEY ERROR AT REPORTINGJSONBUILDER GETTESTNAMESBYPANELLIST ***----")
            self.switchboard.log("ERROR MESSAGE: " + str(e.message))
            self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')
            raise
            return

    def createPanelInfoDict(self, pnlCode, pnlName, result, interp, wording):
        panelInfoObj = {}
        panelInfoObj['panelCode'] = pnlCode
        panelInfoObj['panelName'] = pnlName
        panelInfoObj['overallResult'] = result
        panelInfoObj['overallInterpretation'] = interp
        panelInfoObj['overallWording'] = wording

        return panelInfoObj

    def getDataReviewObj(self):
        ''' Gets object based on status

        Used in result data review
        '''
        currentStatus = self.status

        if currentStatus == 'data ready':
            return self.createAnalysisObj()
        else:
            return self.makeReportReviewObj()


    def getReportReviewJson(self, pretty=False):
        reportReviewObject = self.makeReportReviewObj()
        if reportReviewObject:
            return self.toJson(reportReviewObject, pretty)

    def getDataReviewJson(self, pretty=False):
        ''' Gets JSON object based on status

        Used in result data review
        '''
        currentStatus = self.status 
        if currentStatus == 'data ready':
            return self.getAnalysisReviewJson(pretty)
        else:
            return self.getReportReviewJson(pretty)

    def getDataReviewRows(self, thisReportObj):
        ''' Gets data in the form of rows

        Used at result data review

        Args:
            thisReportObj: Dictionary of report information

        Returns:
            rowList: List of rows in JSON format
        '''

        thisRepSpecimens = thisReportObj['report']['specimens']
        rowList = []

        try:
            for spec in thisRepSpecimens:
                specId = spec['specimen']
                panels = spec['panels']
                for panel in panels:
                    panelName = panel['name']
                    panelCode = panel['code']
                    tests = panel['tests']
                    for test in tests:
                        testName = test['name']
                        testCode = test['code']
                        results = test['results']
                        for result in results:
                            rowDict = result
                            rowDict['specimen'] = specId
                            rowDict['panelName'] = panelName
                            rowDict['panelCode'] = panelCode
                            rowDict['testName'] = testName
                            rowDict['testCode'] = testCode
                            rowList.append(rowDict)

            self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'true')
            return self.toJson(rowList)
        
        except KeyError as e:
            self.switchboard.log("---*** KEY ERROR AT REPORTINGJSONBUILDER GETDATAREVIEWROWS ***----")
            self.switchboard.log("ERROR MESSAGE: " + str(e.message))
            self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')
            raise
            return

    def getReviewImages(self):
        ''' Gets image info objects for result data review

        Args:
            self

        Returns:
            imageListJson: list of json objects that holds the needed image result information
                unique to images: isSelect (bool) and secureToken(string for rendering image from private folder)
    
        '''

        imageList = []
        resQuery = '''
            SELECT
                sr.currentContainerId,
                sr.runId,
                addef.value AS 'resultLabel',
                ad.imageResult AS "result",
                addef.dataType AS 'type',
                ad.id AS 'analysisDataId',
                amv.analysisMethodsId,
                am.methodName AS 'analysisMethodName',
                sm.panelCode,
                sm.methodCode AS 'specMethCode',
                pan.name AS 'panelName',
                sm.testCode,
                IFNULL(tes.name, '') AS 'testName',
                addef.report AS 'reportable',
                IFNULL(rrd.id, '') AS 'reportResultDataId',
                IFNULL(rrd.previousReportResultDataId, '') AS 'previousReportResultDataId',
                IFNULL(rrd.interpretation, '') AS 'interpretation',
                IFNULL(rrd.wording, '') AS 'wording'
            FROM analysisData ad
                INNER JOIN analysisDataRuns adr
                    ON ad.analysisDataRunsId = adr.id
                INNER JOIN specimenRuns sr
                    ON adr.specimenRunsId = sr.id
                INNER JOIN specimenMethods sm 
                    ON sm.id = sr.specimenMethodsId
                INNER JOIN panels pan 
                    ON pan.panelCode = sm.panelCode
                LEFT JOIN tests tes
                    ON tes.testCode = sm.testCode
                INNER JOIN analysisDataDefinition addef
                    ON ad.analysisDataDefinitionId = addef.id
                INNER JOIN analysisMethodVersions amv
                    ON addef.analysisMethodVersionsId = amv.id
                INNER JOIN analysisMethods am 
                    ON am.id = amv.analysisMethodsId
                LEFT JOIN analysisDataLimits adl 
                    ON adl.analysisDataDefinitionId = addef.id
                LEFT JOIN reportResultWording rrw 
                    ON rrw.analysisDataLimitsId = adl.id
                LEFT JOIN analysisDataInterpretation adi 
                    ON adi.analysisDataLimitsId = adl.id
                LEFT JOIN reportResultData rrd 
                    ON rrd.analysisDataId = ad.id
                    AND rrd.currentResult = 1
            WHERE sr.runId = ?
            AND addef.definerType = 'data'
            AND addef.dataType = 'image'
        '''
        try:
            resStmt = self.switchboard.connection.prepareStatement(resQuery)

            Runs = self.associatedRuns
            Runs = self.getAllRuns(Runs)

            for run in Runs:
                resStmt.setString(1, run)

                resRs = resStmt.executeQuery()

                while resRs.next():
                    resDict = self.createResDict()

                    runId = resRs.getString('runId')
                    reportResultDataId = resRs.getString('reportResultDataId')
                    panelCode =  resRs.getString('panelCode')
                    testCode = resRs.getString('testCode')
                    specMethCode = resRs.getString('specMethCode')
                    curCont = resRs.getString('currentContainerId')
                    resultLabel = resRs.getString('resultLabel')
                    result = resRs.getString('result')
                    resType =  resRs.getString('type')
                    aMeth = resRs.getString('analysisMethodsId')
                    aMethName = resRs.getString('analysisMethodName')
                    reportable = resRs.getString('reportable')
                    panelName = resRs.getString('panelName')
                    testName = resRs.getString('testName')
                    analysisDataId = resRs.getString('analysisDataId')
                    previousReportResultDataId = resRs.getString('previousReportResultDataId')
                    interpretation = resRs.getString('interpretation')
                    wording = resRs.getString('wording')


                    resDict['reportResultDataId'] = reportResultDataId
                    resDict['resultLabel'] = resultLabel
                    resDict['runId'] = runId
                    resDict['specimen'] = curCont
                    resDict['result'] = result
                    resDict['dataType'] = resType
                    resDict['analysisMethodId'] = aMeth
                    resDict['analysisMethodName'] = aMethName
                    resDict['methodCode'] = specMethCode
                    resDict['panelCode'] = panelCode
                    resDict['panelName'] = panelName
                    resDict['testCode'] = testCode
                    resDict['testName'] = testName
                    resDict['analysisDataId'] = analysisDataId
                    resDict['previousReportResultDataId'] = previousReportResultDataId
                    resDict['interpretation'] = interpretation
                    resDict['wording'] = wording
                    resDict['imageResult'] = 'no_image_available'
                    resDict['secureToken'] = self.switchboard.registerSecureFileRequest(self.switchboard.userId, result, 'image/jpg', 'img')
                    if reportResultDataId != '':
                        resDict['isSelected'] = True
                    else:
                        resDict['isSelected'] = False

                    imageList.append(resDict)

            resStmt.close()
            imageListJson = json.dumps(imageList)

            self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'true')
            return imageListJson

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


