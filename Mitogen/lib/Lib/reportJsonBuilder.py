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
            thisVar2 = 1
            thisVar3 = 'NOT'
            thisVar4 = ''
        else:
            thisVar = ''
            thisVar2 = 0
            thisVar3 = ''
            thisVar4 = 'report'

        resQuery = '''
            SELECT
                sr.currentContainerId,
                addef.value AS 'resultLabel',
                CASE addef.dataType
                    WHEN 'decimal' THEN
                        CASE addef.sigFig
                            WHEN 0 THEN IFNULL(ROUND(ad.decimalResult, 0), '')
                            WHEN 1 THEN IFNULL(ROUND(ad.decimalResult, 1), '')
                            WHEN 2 THEN IFNULL(ROUND(ad.decimalResult, 2), '')
                            WHEN 3 THEN IFNULL(ROUND(ad.decimalResult, 3), '')
                            WHEN 4 THEN IFNULL(ROUND(ad.decimalResult, 4), '')
                            WHEN 5 THEN IFNULL(ROUND(ad.decimalResult, 5), '')
                            WHEN 6 THEN IFNULL(ROUND(ad.decimalResult, 6), '')
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
                addef.id AS 'analysisDataDefinitionId',
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
            AND sr.completedResult NOT IN ('rework', 'Discarded')
            AND (
                (ad.isReportable = 1 AND addef.report %s IN ('doNotReport', 'reviewOnly'))
                OR 
                (ad.isReportable = %d AND addef.report %s IN ('doNotReport', 'reviewOnly','%s'))
            );
            
        ''' % (thisVar, thisVar2, thisVar3, thisVar4)
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
                    analysisDataDefinitionId = resRs.getString('analysisDataDefinitionId')

                    #### CREATE RESULT OBJECT
                    resDict['reportResultDataId'] = ''
                    resDict['resultLabel'] = resultLabel
                    resDict['runId'] = runId
                    resDict['specimen'] = curCont
                    resDict['result'] = result
                    resDict['originalResult'] = result
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
                    resDict['analysisDataDefinitionId'] = analysisDataDefinitionId
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
        analysisObj['report']['reportDataInterpretation'] = self.getAnalysisDataInterpretation(runList)

        return analysisObj

    def getAnalysisDataInterpretation(self, runList):
        
        interpQuery = '''
            SELECT 
				 addef.id AS "analysisDataDefinitionId",
                 addef.dataType AS "dataType",
                 addef.limitType AS "limitType"
				FROM analysisData ad
                INNER JOIN analysisDataRuns adr  ON ad.analysisDataRunsId = adr.id
                INNER JOIN specimenRuns sr 		 ON adr.specimenRunsId = sr.id                
                INNER JOIN analysisDataDefinition addef ON ad.analysisDataDefinitionId = addef.id
				LEFT JOIN analysisDataLimits adl ON addef.id = adl.analysisDataDefinitionId         
				LEFT JOIN analysisDataInterpretation adi ON  adi.analysisDataLimitsId = adl.id
				LEFT JOIN analysisDataInterpretationCSSClass adicssc ON  adicssc.analysisDataInterpretationId = adi.id  
				
				WHERE sr.runId IN (##RUNLIST##) 
					AND addef.definerType = 'data'
					AND addef.dataType <> 'image'					
					AND sr.completedResult NOT IN ('rework', 'Discarded')				
				GROUP BY adl.analysisDataDefinitionId, addef.VALUE				
        '''

        try:
            runListString = ','.join("'"+ runId +"'" for runId in runList)
            interpQuery = interpQuery.replace("##RUNLIST##", runListString)
            interpStmt = self.switchboard.connection.prepareStatement(interpQuery)
            #interpStmt.setString(1, runList)  ## IN CLAUSE IS NOT WORKING AS EXPECTED WITH QUERY PARAMETER
            self.switchboard.log(str(interpStmt))
            interpRs = interpStmt.executeQuery()
            interpLst = []
            
            while interpRs.next():
                interpObj = {}
                definition_id = interpRs.getString('analysisDataDefinitionId')
                limit_type= interpRs.getString('limitType')                
                limits = self.get_field_limits(definition_id, limit_type)
                interp_list = self.get_field_interp_list(limits, limit_type)                
                interpObj['analysisDataDefinitionId'] = definition_id                
                interpObj['limit_type'] = limit_type
                interpObj['limits'] = limits
                interpObj['interp_list'] = interp_list
                interpObj['data_type'] = interpRs.getString('dataType')
                
                
                interpLst.append(interpObj)
            
            interpRs.close()
            interpStmt.close()
            
            return interpLst

        except SQLException as e:
            self.switchboard.log("---*** SQLException AT REPORTJSONBUILDER GETANALYSISDATAINTERPRETATION ***----")
            self.switchboard.log("ERROR MESSAGE: " + str(e.message))
            self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')
            raise
            return

        except KeyError as e:
            self.switchboard.log("---*** KEY ERROR AT REPORTJSONBUILDER GETANALYSISDATAINTERPRETATION ***----")
            self.switchboard.log("ERROR MESSAGE: " + str(e.message))
            self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')
            raise
            return

    def toJson(self, obj, pretty=False):
        '''Converts a dict to json

        Args:
            pretty: Bool to determine if pretty print or not
        '''

        if pretty == True:
            return json.dumps(obj, indent=2)
        else:
            return json.dumps(obj)

    
    def get_field_limits(self, analysis_data_definition_id, limit_type):
        """Gets the limits, interpretation, css class for the field

            Wording are hard coded to blank since they are not currentyl being used. They are not being removed
            as to not disrupt front end behaviour and to easily add back in if needed.

        Args:
            analysis_data_definition_id: defintion id of the field
            limit_type: pre-defined limit type (discrete/threshold/range)

        Returns:
            If discrete limit type:
                List of objects containing the interpreation, class, and discrete value
            If range or threshold:
                Object containing the interpreation, and class for each case (below/equal/above/etc.)
        """

        limits = []
        limits_query = '''
            SELECT
                IFNULL(limits.discrete, '') AS 'discrete',
                IFNULL(limits.lowerLimit, '') AS 'lowerLimit',
                IFNULL(limits.upperLimit, '') AS 'upperLimit',
                IFNULL(interpretations.equalDiscrete, '') AS 'equalDiscrete',
                IFNULL(interpretations.notEqualDiscrete, '') AS 'notEqualDiscrete',
                IFNULL(interpretations.belowLower, '') AS 'belowLower',
                IFNULL(interpretations.equalLower, '') AS 'equalLower',
                IFNULL(interpretations.betweenLowerUpper, '') AS 'betweenLowerUpper',
                IFNULL(interpretations.equalUpper, '') AS 'equalUpper',
                IFNULL(interpretations.aboveUpper, '') AS 'aboveUpper',
                IFNULL(css.equalDiscrete, '') AS 'equal_css',
                IFNULL(css.notEqualDiscrete, '') AS 'not_equal_css',
                IFNULL(css.belowLower, '') AS 'below_lower_css',
                IFNULL(css.equalLower, '') AS 'equal_lower_css',
                IFNULL(css.betweenLowerUpper, '') AS 'in_range_css',
                IFNULL(css.equalUpper, '') AS 'equal_upper_css',
                IFNULL(css.aboveUpper, '') AS 'above_upper_css'
            FROM analysisDataLimits limits
            INNER JOIN analysisDataInterpretation interpretations
                ON interpretations.analysisDataLimitsId = limits.id
            INNER JOIN analysisDataInterpretationCSSClass css
                ON css.analysisDataInterpretationId = interpretations.id
            WHERE limits.analysisDataDefinitionId = ?
        '''
        try:
            limits_stmt = self.switchboard.connection.prepareStatement(limits_query)
            limits_stmt.setString(1, analysis_data_definition_id)
            self.switchboard.log(str(limits_stmt))
            limits_rs = limits_stmt.executeQuery()
            
            if limit_type == 'discrete':
                while limits_rs.next():
                    eq_discrete = {
                        'discrete_limit': limits_rs.getString('discrete'),
                        'equal_interpretation': limits_rs.getString('equalDiscrete'),
                        'equal_wording': '',
                        'equal_css': limits_rs.getString('equal_css'),
                    } 
                    limits.append(eq_discrete)
                    not_eq_discrete = {
                        'not_equal_interpretation': limits_rs.getString('notEqualDiscrete'),
                        'not_equal_wording': '',
                        'not_equal_css': limits_rs.getString('not_equal_css'),
                    }

                try:
                    limits.insert(0, not_eq_discrete)
                except ValueError:
                    self.switchboard.log('---*** NO not_eq_discrete OBJECT FOUND ***---')
                
                self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'true')
                return limits
                            
            elif limit_type == 'range':
                while limits_rs.next():
                    range_object = {
                        'lower_limit': limits_rs.getString('lowerLimit'),
                        'upper_limit': limits_rs.getString('upperLimit'),
                        'below_lower_interpretation': limits_rs.getString('belowLower'),
                        'equal_lower_interpretation': limits_rs.getString('equalLower'),
                        'in_range_interpretation': limits_rs.getString('betweenLowerUpper'),
                        'equal_upper_interpretation': limits_rs.getString('equalUpper'),
                        'above_upper_interpretation': limits_rs.getString('aboveUpper'),
                        'below_lower_wording': '',
                        'equal_lower_wording': '',
                        'in_range_wording': '',
                        'equal_upper_wording': '',
                        'above_upper_wording': '',
                        'below_lower_css': limits_rs.getString('below_lower_css'),
                        'equal_lower_css': limits_rs.getString('equal_lower_css'),
                        'in_range_css': limits_rs.getString('in_range_css'),
                        'equal_upper_css': limits_rs.getString('equal_upper_css'),
                        'above_upper_css': limits_rs.getString('above_upper_css'),
                    }
                self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'true')
                return range_object
                            
            elif limit_type == 'threshold':
                while limits_rs.next():
                    threshold_object = {
                        'threshold_limit': limits_rs.getString('upperLimit'),
                        'below_threshold_interpretation': limits_rs.getString('belowLower'),
                        'equal_threshold_interpretation': limits_rs.getString('equalLower'),
                        'above_threshold_interpretation': limits_rs.getString('aboveUpper'),
                        'below_threshold_wording': '',
                        'equal_threshold_wording': '',
                        'above_threshold_wording': '',
                        'below_threshold_css': limits_rs.getString('below_lower_css'),
                        'equal_threshold_css': limits_rs.getString('equal_lower_css'),
                        'above_threshold_css': limits_rs.getString('above_upper_css'),
                    }
                self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'true')
                return threshold_object

            else:
                self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'true')
                return []

        except SQLException as e:
            self.switchboard.log("---*** SQLEXCEPTION AT GET_FIELD_LIMITS THRESHOLD ***----")
            self.switchboard.log("ERROR MESSAGE: " + str(e.message))
            self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')
        except BaseException as e:
            self.switchboard.log("---*** BASE EXCEPTION AT GET_FIELD_LIMITS THRESHOLD ***----")
            self.switchboard.log("ERROR MESSAGE: " + str(e.message))
            self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')
            raise
            return
        finally:
            limits_stmt.close()
			
			
			

    def get_field_interp_list(self, limits, limit_type):
        """Returns a list of the interpretations used for the select list on the front end
        """
        interp_list = []
        try:
            if limit_type == 'discrete':
                not_eq_interp = {
                        'display': limits[0].get('not_equal_interpretation', ''), 
                        'value':limits[0].get('not_equal_interpretation', ''),
                }
                interp_list.append(not_eq_interp)

                for lim in limits[1:]:
                    eq_interp = {
                        'display': lim.get('equal_interpretation', ''),
                        'value': lim.get('equal_interpretation', ''),
                    }
                    interp_list.append(eq_interp)
                return interp_list
        
            elif limit_type == 'threshold':

                b_interp = {
                    'display': limits.get('below_threshold_interpretation', ''),
                    'value': limits.get('below_threshold_interpretation', ''),
                }
                e_interp = {
                    'display': limits.get('equal_threshold_interpretation', ''),
                    'value': limits.get('equal_threshold_interpretation', ''),
                }
                a_interp = {
                    'display': limits.get('above_threshold_interpretation', ''),
                    'value': limits.get('above_threshold_interpretation', ''),
                }
                interp_list = [b_interp, e_interp, a_interp]
                return interp_list

            elif limit_type == 'range':

                bl_interp = {
                    'display': limits.get('below_lower_interpretation', ''),
                    'value': limits.get('below_lower_interpretation', ''),
                }
                el_interp = {
                    'display': limits.get('equal_lower_interpretation', ''),
                    'value': limits.get('equal_lower_interpretation', ''),
                }
                ir_interp = {
                    'display': limits.get('in_range_interpretation', ''),
                    'value': limits.get('in_range_interpretation', ''),
                }
                eu_interp = {
                    'display': limits.get('equal_upper_interpretation', ''),
                    'value': limits.get('equal_upper_interpretation', ''),
                }
                au_interp = {
                    'display': limits.get('above_upper_interpretation', ''),
                    'value': limits.get('above_upper_interpretation', ''),
                }
                interp_list = [bl_interp, el_interp, ir_interp, eu_interp, au_interp]
                return interp_list
            else:
                return []
        
        except BaseException as e:
            self.switchboard.log("---*** PYTHON EXCEPTION AT GET_FIELD_INTERP_LIST ***---")
            self.switchboard.log("ERROR MESSAGE: " + str(e.message))
            self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')
            raise
            return





