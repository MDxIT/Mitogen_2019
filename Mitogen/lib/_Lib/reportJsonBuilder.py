import json
from operator import itemgetter
from java.sql import SQLException
from com.uniconnect.uniflow.exception import SystemException
from report import Report
from result_organizer import ResultOrganizer


class ReportBuilder(Report, ResultOrganizer):
    ''' Builds basic report data structure from analysis data

    This is the first class used in building a report. It contains the query for retreiving analysis data and overall results
    Contains the basic report dictionary in createReportDict()

    Inheritence: 
        Report
        ResultOrganizer
            Most dictionaries and the organizeBy logic live here

    Attributes:
        associatedPanels: Set of associated panels
        associatedTests: Set of associated tests
        associatedMethods: Set of associated methods

    '''
    def __init__(self, switchboard, reportId):
        Report.__init__(self, switchboard, reportId)
        self.associatedPanels = set()
        self.associatedTests = set()
        self.associatedMethods = set()

    def getAssociatedPanels(self):
        return list(self.associatedPanels)

    def getAssociatedTests(self):
        return list(self.associatedTests)

    def getAssocaitedMethods(self):
        return list(self.associatedMethods)

    def getAssociatedRunsJson(self):
        return self.toJson(self.associatedRuns)

    def getAssociatedPanelsJson(self):
        return self.toJson(list(self.associatedPanels))

    def getAssociatedTestsJson(self):
        return self.toJson(list(self.associatedTests))

    def getAssociatedMethodsJson(self):
        return self.toJson(list(self.associatedMethods))

    def getOverallResultObjs(self):
        ''' Gets JSON objects for possible overall results

        Used in result data review

        Returns:
            overAllResultLst: JSON list of overall results
        '''

        overAllResultLst = []
        self.switchboard.log('<<<<<< GETTING OVERALL RESULT OBJECTS FOR VERSION: ' + self.repDefVer + ' >>>>>>')
        try:

            oQuery = '''
                SELECT 
                    JSON_OBJECT('overallResult',overallResult, 'overallInterpretation', overallInterpretation) AS 'jsonObj'
                FROM reportInterpretationWording
                WHERE reportDefinitionVersionId = ? 
                    AND isOverallReportResult = 1
            '''
            oStmt = self.switchboard.connection.prepareStatement(oQuery)
            oStmt.setString(1, self.repDefVer)
            oRs = oStmt.executeQuery()

            while oRs.next():
                resultOption = json.loads(oRs.getString('jsonObj'))
                overAllResultLst.append(resultOption)
            oRs.close()
            oStmt.close()

            self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'true')
            return self.toJson(overAllResultLst)

        except SQLException as e:
            self.switchboard.log("---*** SQLException AT REPORTJSONBUILDER GETOVERALLRESULTOBJS ***----")
            self.switchboard.log("ERROR MESSAGE: " + str(e.message))
            self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')
            raise
            return

    def organizePanelResultLst(self, resultLst):
        '''Organizes a list of objects that contain a panel code, result, and interpretation by panel

        In list: [{'panelCode':'value', overallPanelResult':'value', 'overallPanelInterpretation':'value'}, ...]
        Out object: {panelCode:[{'overallPanelResult':'value', 'overallpanelInterpretation':'value'}, ...], ...}

        Args:
            resultList: List of panel results

        Returns:
            panelMap: Dictionary with panelCode as key and a lit of result objects

        '''

        panelMap = self.panelMap()

        for result in resultLst:
            panel = result.get('panelCode')
            try:
                panelMap[panel].append(result)
            except KeyError:
                self.switchboard.log('<<<<<< PANEL: ' + panel + ' IS NOT IN PANEL MAP >>>>>>')

        return panelMap


    def getPanelOverallResultObjs(self):
        ''' Gets JSON objects for possible panel overall results

        Used in result data review

        Returns:
            overAllResultLst: JSON list of panel overall results
        '''
        self.switchboard.log('<<<<<< GETTING OVERALL PANEL RESULTS >>>>>>')

        panelOverallResultLst = []
        try:
            pQuery = '''
                SELECT JSON_OBJECT('panelCode', panelCode, 'overallPanelResult',overallResult, 'overallPanelInterpretation', overallInterpretation) AS 'jsonObj'
                FROM reportInterpretationWording
                WHERE reportDefinitionVersionId = ? 
                    AND isOverallReportResult = 0
            '''
            pStmt = self.switchboard.connection.prepareStatement(pQuery)
            pStmt.setString(1, self.repDefVer)
            pRs = pStmt.executeQuery()

            while pRs.next():
                panelOption = json.loads(pRs.getString('jsonObj'))
                panelOverallResultLst.append(panelOption)

            panelOverallResults = self.organizePanelResultLst(panelOverallResultLst)
            pRs.close()
            pStmt.close()

            self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'true')
            return self.toJson(panelOverallResults)
        
        except SQLException as e:
            self.switchboard.log("---*** SQLException ***----")
            self.switchboard.log("ERROR MESSAGE: " + str(e.message))
            self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')
            raise
            return

    def getLimitType(self, low, up, dis):
        if dis:
            return 'TARGET'
        elif low and up:
            if low == up:
                return 'THRESHOLD'
            elif low != up:
                return 'RANGE'
        else:
            return ''

    def getWording(self, referenceRange, result, limits, wording, resType):
        # DEPRECATED 
        ''' Assigns wording based on result/limits

        Args:
            referenceRange: String of test's reference range
            result: String of result
            limits: Dictionary of limits
            wording: Dictionary of associated wording

        Returns:
            wording: String of wording based on the results relation to the limits
        '''

        self.switchboard.log('<<<<<< GETTING WORDING BASED ON REF RANGE: ' + referenceRange + '>>>>>>')

        # refType = referenceRange.rsplit(':')[0].upper()
        discreteLimit = limits['discreteLimit']
        lowLimit = limits['lowerLimit']
        upLimit = limits['upperLimit']
        refType = self.getLimitType(lowLimit, upLimit, discreteLimit)

        try:

            self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'true')

            if refType == 'TARGET':
                if result == discreteLimit:
                    self.switchboard.log('<<<<<< RESULT IS EQUAL TO TARGET >>>>>>') 
                    return wording['equalDiscreteWording']
                else:
                    self.switchboard.log('<<<<<< RESULT IS NOT EQUAL TO TARGET >>>>>>')
                    return wording['notEqualDiscreteWording']

            elif refType in ['RANGE', 'THRESHOLD'] and resType != 'varchar':
                result = float(result)
                if result < float(lowLimit):
                    self.switchboard.log('<<<<<< RESULT IS BELOW LOWER >>>>>>')
                    return wording['belowLowerWording']
                elif result == float(lowLimit):
                    self.switchboard.log('<<<<<< RESULT IS EQUAL LOWER >>>>>>')
                    return wording['equalLowerWording']
                elif result > float(lowLimit) and result < float(upLimit):
                    self.switchboard.log('<<<<<< RESULT IS BETWEEN LOWER AND UPPER >>>>>>')
                    return wording['betweenLowerUpperWording']
                elif result == float(upLimit):
                    self.switchboard.log('<<<<<< RESULT IS EQUAL UPPER >>>>>>')
                    return wording['equalUpperWording']
                elif result > float(upLimit):
                    self.switchboard.log('<<<<<< RESULT IS ABOVE UPPER >>>>>>')
                    return wording['aboveUpperWording']

            else:
                return ''
        

        except KeyError as e:
            self.switchboard.log("---*** KEY ERROR AT REPORTJSONBUILDER GETWORDING ***---")
            self.switchboard.log("ERROR MESSAGE: " + str(e.message))
            self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')
            raise
            return
        except TypeError as e:
            self.switchboard.log("---*** TYPE ERROR AT REPORTJSONBUILDER GETWORDING ***----")
            self.switchboard.log("ERROR MESSAGE: " + str(e.message))
            self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')
            raise
            return

    ### SET MAPPERS

    def methMap(self):
        ''' Maps methods to blank lists

            DEPRECATED???

        '''

        methDict = {}

        for meth in self.associatedMethods:
            methDict[meth] = []

        return methDict


    ### DICTIONARY DEFINITION

    def createReportDict(self):
        ''' Base report dictionary

        Returns:
            report: Dictionary
        '''
        report = {}
        report['report'] = {}
        report['report']['reportId'] = self.reportId
        report['report']['reportType'] = ''
        report['report']['status'] = ''
        report['report']['reportDate'] = ''
        report['report']['reportDetailsId'] = ''
        report['report']['overallResult'] = ''
        report['report']['overallInterpretation'] = ''
        report['report']['overallWording'] = ''
        report['report']['specimens'] = []
        report['report']['siteInfo'] = ''
        report['report']['metaData'] = ''
        report['report']['references'] = ''
        report['report']['addendedText'] =''
        report['report']['amendedText'] = ''
        report['report']['correctedText'] = ''
        report['report']['canceledText'] = ''
        report['report']['rejectedText'] = ''
        report['report']['specimensHL7'] = ''
        report['report']['specimensHL7Mapper'] = ''
        report['report']['imageResults'] = ''

        return report


    def getAnalysisResultsByRun(self, runList, reportable=True):
        '''  Retreives raw result set by run, creates the panel/test/method sets

            Leaving the section of the query that pulls limits commented out for possible future use

        Args:
            runList: List of runIds
            reportable: Bool to determine where you want reportable or non-reportable results

        Returns:
            resultList: List of raw result objects
        '''

        runResult = ''
        resDict = {}
        resultList = []

        if reportable == True:
            thisVar = 'NOT'
        else:
            thisVar = ''

        resQuery = '''
            SELECT
                sr.currentContainerId,
                addef.value AS 'resultLabel',
                CASE addef.dataType
                    WHEN 'decimal' THEN
                        CASE addef.sigFig
                            WHEN 0 THEN ROUND(IFNULL(ad.decimalResult, ''), 0)
                            WHEN 1 THEN ROUND(IFNULL(ad.decimalResult, ''), 1)
                            WHEN 2 THEN ROUND(IFNULL(ad.decimalResult, ''), 2)
                            WHEN 3 THEN ROUND(IFNULL(ad.decimalResult, ''), 3)
                            WHEN 4 THEN ROUND(IFNULL(ad.decimalResult, ''), 4)
                            WHEN 5 THEN ROUND(IFNULL(ad.decimalResult, ''), 5)
                            WHEN 6 THEN ROUND(IFNULL(ad.decimalResult, ''), 6)
                        END
                    WHEN 'varchar' THEN IFNULL(ad.varcharResult, '')
                    WHEN 'dateTime' THEN IFNULL(ad.dateTimeResult, '')
                END AS "result",
                addef.dataType AS 'type',
                IFNULL(ad.referenceRange, '') AS 'referenceRange',
                IFNULL(ad.calculatedInterpretation, '') AS 'calculatedInterpretation',
                IFNULL(ad.actualInterpretation, '') AS 'actualInterpretation',
                ad.id AS 'analysisDataId',
                adr.interpretation,
                IFNULL(ad.units, IFNULL(addef.units, '')) AS 'units',
                amv.analysisMethodsId,
                am.methodName AS 'analysisMethodName',
                sm.panelCode,
                sm.methodCode AS 'specMethCode',
                pan.name AS 'panelName',
                sm.testCode,
                IFNULL(tes.name, '') AS 'testName',
                addef.report AS 'reportable',
                -- adl.discrete,
                -- adl.upperLimit,
                -- adl.lowerLimit,
                IFNULL(addef.units, '') AS 'limitUnits'
                -- IFNULL(rrw.equalDiscreteWording, '') AS 'equalDiscreteWording',
                -- IFNULL(rrw.notEqualDiscreteWording, '') AS 'notEqualDiscreteWording',
                -- IFNULL(rrw.belowLowerWording, '') AS 'belowLowerWording',
                -- IFNULL(rrw.equalLowerWording, '') AS 'equalLowerWording',
                -- IFNULL(rrw.betweenLowerUpperWording, '') AS 'betweenLowerUpperWording',
                -- IFNULL(rrw.equalUpperWording, '') AS 'equalUpperWording',
                -- IFNULL(rrw.aboveUpperWording, '') AS 'aboveUpperWording'
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
                -- LEFT JOIN analysisDataLimits adl 
                --   ON adl.analysisDataDefinitionId = addef.id
                -- LEFT JOIN reportResultWording rrw 
                --   ON rrw.analysisDataLimitsId = adl.id
                -- LEFT JOIN analysisDataInterpretation adi 
                --   ON adi.analysisDataLimitsId = adl.id
            WHERE sr.runId = ?
            AND addef.definerType = 'data'
            AND addef.dataType <> 'image'
            AND addef.report %s IN ('doNotReport', 'reviewOnly')
            AND sr.completedResult NOT IN ('rework', 'Discarded')
        ''' % thisVar
        try:
            resStmt = self.switchboard.connection.prepareStatement(resQuery)

            for runId in runList:
                resStmt.setString(1, runId)
                self.switchboard.log(str(resStmt))
                resRs = resStmt.executeQuery()

                while resRs.next():

                    resDict = {}

                    ### SETS
                    panelCode =  resRs.getString('panelCode')
                    self.associatedPanels.add(panelCode)
                    testCode = resRs.getString('testCode')
                    self.associatedTests.add(testCode)
                    specMethCode = resRs.getString('specMethCode')
                    self.associatedMethods.add(specMethCode)

                    # VARS FOR OBJECT
                    curCont = resRs.getString('currentContainerId')
                    if curCont not in self.associatedSpecimens:
                        self.associatedSpecimens.append(curCont)
                    resultLabel = resRs.getString('resultLabel')
                    result = resRs.getString('result')
                    resType =  resRs.getString('type')
                    aMeth = resRs.getString('analysisMethodsId')
                    aMethName = resRs.getString('analysisMethodName')
                    refRange = resRs.getString('referenceRange')
                    calcInterp = resRs.getString('calculatedInterpretation')
                    actlInterp = resRs.getString('actualInterpretation')
                    interpretation = resRs.getString('interpretation')
                    units = resRs.getString('units')
                    reportable = resRs.getString('reportable')
                    limitUnits = resRs.getString('limitUnits')
                    panelName = resRs.getString('panelName')
                    testName = resRs.getString('testName')
                    analysisDataId = resRs.getString('analysisDataId')

                    #### CREATE RESULT OBJECT
                    resDict['reportResultDataId'] = ''
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
                    resDict['referenceRange'] = refRange
                    resDict['calculatedInterpretation'] = calcInterp
                    resDict['interpretation'] = actlInterp
                    resDict['units'] = units
                    resDict['reportable'] = reportable
                    resDict['discreteLimit'] = ''
                    resDict['upperLimit'] = ''
                    resDict['lowerLimit'] = ''
                    resDict['limitUnits'] = units
                    resDict['runInterpretation'] = interpretation
                    resDict['wording'] = ''
                    resDict['analysisDataId'] = analysisDataId
                    resultList.append(resDict)
                resRs.close()
            resStmt.close()

            self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'true')
            return resultList

        except SQLException as e:
            self.switchboard.log("---*** SQLException AT REPORTJSONBUILDER GETANALYSISRESULTSBYRUN ***----")
            self.switchboard.log("ERROR MESSAGE: " + str(e.message))
            self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')
            raise
            return
        except KeyError as e:
            self.switchboard.log("---*** KEY ERROR AT REPORTJSONBUILDER GETANALYSISRESULTSBYRUN ***---")
            self.switchboard.log("ERROR MESSAGE: " + str(e.message))
            self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')
            raise
            return

    def createAnalysisObj(self, reportable=True):
        ''' Makes a report object from analysis results

        Used when status of data ready in result data review

        Args:
            reportable: Bool to determine whether the return object contains reportabl or non-reportable results

        Returns:
            analysisObj: Dictionary with report data
        '''

        runList = self.associatedRuns
        runList = self.getAllRuns(runList)
        rawList = self.getAnalysisResultsByRun(runList, reportable)
        analysisObj = self.createReportDict()

        analysisObj['report']['reportDescription'] = self.description
        analysisObj['report']['reportDetailsId'] = self.reportDetailsId
        analysisObj['report']['specimens'] = self.organizeBySpec(rawList)

        return analysisObj

    def toJson(self, obj, pretty=False):
        '''Converts a dict to json

        Args:
            pretty: Bool to determine if pretty print or not
        '''

        if pretty == True:
            return json.dumps(obj, indent=2)
        else:
            return json.dumps(obj)





