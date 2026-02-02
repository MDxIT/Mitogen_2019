package com.sunquest.mitogen.lims.dataObjects;

import java.sql.Connection;
import java.sql.Date;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.LinkedHashMap;
import java.util.LinkedList;
import java.util.List;

import com.uniconnect.uniflow.Switchboard;

public class ReportResultData {

    public ReportResultData(Switchboard sw) {
        this.sw = sw;
        this.conn = sw.connection;
    }
    public ReportResultData(Connection conn) {
        this.conn = conn;
    }

    public class AnalysisData {
        private Long id;
        private String analysisDataRunsId;
        private String analysisDataDefinitionId;
        private String analysisDataDetectorId;
        private String varcharResult;
        private String decimalResult;
        //?
        private String dateTimeResult;
        private String imageResult;
        private String eventId;
        private String referenceRange;
        private String units;
        private String calculatedInterpretation;
        private String actualInterpretation;
        private String analysisDataLimitsId;
        private String analysisDataInterpretationId;
        private String interpretationEventId;
        private String stepName;
        private LinkedHashMap<Long, AnalysisDataDefinition> analysisDataDefinition = null;
        public Long getId() {
            return this.id;
        }
        public String getAnalysisDataRunsId() {
            return this.analysisDataRunsId;
        }
        public String getAnalysisDataDefinitionId() {
            return this.analysisDataDefinitionId;
        }
        public String getAnalysisDataDetectorId() {
            return this.analysisDataDetectorId;
        }
        public String getVarcharResult() {
            return this.varcharResult;
        }
        public String getDecimalResult() {
            return this.decimalResult;
        }
        public String getDateTimeResult() {
            return this.dateTimeResult;
        }
        public String getImageResult() {
            return this.imageResult;
        }
        public String getEventId() {
            return this.eventId;
        }
        public String getReferenceRange() {
            return this.referenceRange;
        }
        public String getUnits() {
            return this.units;
        }
        public String getCalculatedInterpretation() {
            return this.calculatedInterpretation;
        }
        public String getActualInterpretation() {
            return this.actualInterpretation;
        }
        public String getAnalysisDataLimitsId() {
            return this.analysisDataLimitsId;
        }
        public String getAnalysisDataInterpretationId() {
            return this.analysisDataInterpretationId;
        }
        public String getInterpretationEventId() {
            return this.interpretationEventId;
        }
        public String getStepName() {
            return this.stepName;
        }
        public LinkedHashMap<Long, AnalysisDataDefinition> getAnalysisDataDefinition() {
            return this.analysisDataDefinition;
        }
    }
    public class AnalysisDataDefinition {
        private Long id;
        private String analysisMethodVersionsId;
        private String detectorDefinitionId;
        private String definerType;
        private String sequence;
        private String value;
        private String dataType;
        private String limitType;
        private String units;
        private String sigFig;
        private String report;
        private String eventId;
        private String resultCode;
        private String loadDataAnalysisDataDefinitionId;
        private String formInputSettingsId;
        public Long getId() {
            return this.id;
        }
        public String getAnalysisMethodVersionsId() {
            return this.analysisMethodVersionsId;
        }
        public String getDetectorDefinitionId() {
            return this.detectorDefinitionId;
        }
        public String getDefinerType() {
            return this.definerType;
        }
        public String getSequence() {
            return this.sequence;
        }
        public String getValue() {
            return this.value;
        }
        public String getDataType() {
            return this.dataType;
        }
        public String getLimitType() {
            return this.limitType;
        }
        public String getUnits() {
            return this.units;
        }
        public String getSigFig() {
            return this.sigFig;
        }
        public String getReport() {
            return this.report;
        }
        public String getEventId() {
            return this.eventId;
        }
        public String getResultCode() {
            return this.resultCode;
        }
        public String getLoadDataAnalysisDataDefinitionId() {
            return this.loadDataAnalysisDataDefinitionId;
        }
        public String getFormInputSettingsId() {
            return this.formInputSettingsId;
        }
    }
    private Long id;
    private String reportDetailsId;
    private String specimenId;
    private String panelCode;
    private String panelCodeDisplay;
    private String testCode;
    private String methodCode;
    private String analysisDataId;
    private String varcharResult;
    private String varcharReviewResult;
    private String decimalResult;
    private String decimalReviewResult;
    private String dateTimeResult;
    private String dateTimeReviewResult;
    private String imageResult;
    private String interpretation;
    private String wording;
    private Boolean isOverall;
    private Boolean isPanelOverall;
    private String limits;
    private String reportableUnits;
    private String previousReportResultDataId;
    private String lastUpdatedEventId;
    private String eventId;
    private Boolean currentResult;
    private LinkedHashMap<Long, AnalysisData> analysisData = null;
    private Events lastUpdatedEvent;
    private Events event;

    private boolean exists;
    private Switchboard sw;
    private Connection conn;

    public Long getID() {
        return this.id;
    }
    public void setID(Long id){
        this.id = id;
    }
    public String getReportDetailsId() {
        return this.reportDetailsId;
    }
    public void setReportDetailsId(String reportdetailsid){
        this.reportDetailsId = reportdetailsid;
    }
    public String getSpecimenId() {
        return this.specimenId;
    }
    public void setSpecimenId(String specimenId){
        this.specimenId = specimenId;
    }
    public String getPanelCode() {
        return this.panelCode;
    }
    public void setPanelCode(String panelCode){
        this.panelCode = panelCode;
    }
    public String getPanelCodeDisplay() {
        return this.panelCodeDisplay;
    }
    public void setPanelCodeDisplay(String panelCodeDisplay){
        this.panelCodeDisplay = panelCodeDisplay;
    }
    public String getTestCode() {
        return this.testCode;
    }
    public void setTestCode(String testCode){
        this.testCode = testCode;
    }
    public String getMethodCode() {
        return this.methodCode;
    }
    public void setMethodCode(String methodCode){
        this.methodCode = methodCode;
    }
    public String getAnalysisDataId() {
        return this.analysisDataId;
    }
    public void setAnalysisDataId(String analysisDataId){
        this.analysisDataId = analysisDataId;
    }
    public String getVarcharResult() {
        return this.varcharResult;
    }
    public void setVarcharResult(String varcharResult){
        this.varcharResult = varcharResult;
    }
    public String getVarcharReviewResult() {
        return this.varcharReviewResult;
    }
    public void setVarcharReviewResult(String varcharReviewResult) {
        this.varcharReviewResult = varcharReviewResult;
    }
    public String getDecimalResult() {
        return this.decimalResult;
    }
    public void setDecimalResult(String decimalResult){
        this.decimalResult = decimalResult;
    }
    public String getDecimalReviewResult() {
        return this.decimalReviewResult;
    }
    public void setDecimalReviewResult(String decimalReviewResult) {
        this.decimalReviewResult = decimalReviewResult;
    }
    public String getDateTimeResult() {
        return this.dateTimeResult;
    }
    public void setdateTimeResult(String dateTimeResult){
        this.dateTimeResult = dateTimeResult;
    }
    public String getDateTimeReviewResult() {
        return this.dateTimeReviewResult;
    }
    public void setDateTimeReviewResult(String dateTimeReviewResult){
        this.dateTimeReviewResult = dateTimeReviewResult;
    }
    public String getImageResult() {
        return this.imageResult;
    }
    public void setImageResult(String imageResult){
        this.imageResult = imageResult;
    }
    public String getInterpretation() {
        return this.interpretation;
    }
    public void setInterpretation(String interpretation){
        this.interpretation = interpretation;
    }
    public String getWording() {
        return this.wording;
    }
    public void setWording(String wording){
        this.wording = wording;
    }
    public Boolean getIsOverall() {
        return this.isOverall;
    }
    public void setIsOverall(Boolean isOverall){
        this.isOverall = isOverall;
    }
    public Boolean getIsPanelOverall() {
        return this.isPanelOverall;
    }
    public void setIsPanelOverall(Boolean isPanelOverall){
        this.isPanelOverall = isPanelOverall;
    }
    public String getLimits() {
        return this.limits;
    }
    public void setLimits(String limits){
        this.limits = limits;
    }
    public String getReportableUnits() {
        return this.reportableUnits;
    }
    public void setReportableUnits(String reportableUnits){
        this.reportableUnits = reportableUnits;
    }
    public String getPreviousReportResultDataId() {
        return this.previousReportResultDataId;
    }
    public void setPreviousReportResultDataId(String previousReportResultDataId){
        this.previousReportResultDataId = previousReportResultDataId;
    }
    public String getLastUpdatedEventId() {
        return this.lastUpdatedEventId;
    }
    public void setLastUpdatedEventId(String lastUpdatedEventId){
        this.lastUpdatedEventId = lastUpdatedEventId;
    }
    public String getEventId() {
        return this.eventId;
    }
    public void setEventId(String eventId){
        this.eventId = eventId;
    }
    public Boolean getCurrentResult() {
        return this.currentResult;
    }
    public void setCurrentResult(Boolean currentResult){
        this.currentResult = currentResult;
    }
    public LinkedHashMap<Long, AnalysisData> getAnalysisData() {
        return this.analysisData;
    }
    public Events getLastUpdatedEvent() {
        return this.lastUpdatedEvent;
    }
    public Events getEvent() {
        return this.event;
    }
    
    public Tests tests;

    public List<ReportResultData> SearchByReportDetailsID(String reportDetailsId) throws SQLException {
        List<ReportResultData> retVal = new LinkedList<ReportResultData>();
        //This query gets the id's of the reportresultdata entries with matching reportdetailsid values
        String sql = "SELECT r.id " +
                "FROM reportResultData r " +
                "WHERE r.reportDetailsId = ? " +
                "ORDER BY r.id";
        PreparedStatement ps = conn.prepareStatement(sql);
		ps.setString(1, reportDetailsId);
        ResultSet rs = ps.executeQuery();
        while(rs.next()){
            ReportResultData r = new ReportResultData(this.conn);
            r.id = rs.getLong(1);
            r.LoadFromDB(false);
            retVal.add(r);
        }
        return retVal;
    }
    public boolean LoadFromDB() throws SQLException {
        return LoadFromDB(true);
    }
    public boolean LoadFromDB(Boolean loadAll) throws SQLException {
        this.exists = false;
        if (this.id != null) {
            //This query gets all of the information currently available for the reportresultdata entry and
            //it uses the id value under column id
            String sql = "SELECT r.id, r.reportDetailsId, r.specimenId, r.panelCode, r.testCode, r.methodCode, r.analysisDataId, " +
                    "r.varcharResult, r.varcharReviewResult, r.decimalResult, r.decimalReviewResult, r.dateTimeResult, r.dateTimeReviewResult, r.imageResult, " +
                    "r.interpretation, r.wording, r.isOverall, r.isPanelOverall, r.limits, r.reportableUnits, r.previousReportResultDataId, " +
                    "r.lastUpdatedEventId, r.eventId, r.currentResult " +
                    "FROM reportResultData r " +
                    "WHERE r.id = ? " +
                    "ORDER BY r.id";
            PreparedStatement ps = conn.prepareStatement(sql);
            ps.setString(1, this.id.toString());
            ResultSet rs = ps.executeQuery();
            while (rs.next()) {
                this.id = rs.getLong(1);
                this.reportDetailsId = rs.getString(2);
                this.specimenId = rs.getString(3);
                this.panelCode = rs.getString(4);
                this.testCode = rs.getString(5);
                this.methodCode = rs.getString(6);
                this.analysisDataId = rs.getString(7);
                this.varcharResult = rs.getString(8);
                this.varcharReviewResult = rs.getString(9);
                this.decimalResult = rs.getString(10);
                this.decimalReviewResult = rs.getString(11);
                this.dateTimeResult = rs.getString(12);
                this.dateTimeReviewResult = rs.getString(13);
                this.imageResult = rs.getString(14);
                this.interpretation = rs.getString(15);
                this.wording = rs.getString(16);
                this.isOverall = rs.getBoolean(17);
                this.isPanelOverall = rs.getBoolean(18);
                this.limits = rs.getString(19);
                this.reportableUnits = rs.getString(20);
                this.previousReportResultDataId = rs.getString(21);
                this.lastUpdatedEventId = rs.getString(22);
                this.eventId = rs.getString(23);
                this.currentResult = rs.getBoolean(24);
                if (loadAll) {
                    Tests t = new Tests(this.conn);
                    t.LoadByTestCode(this.testCode);
                    tests = t;
                    //This query gets the display name for the panel code
                    String panelSql = "Select p.id, p.name FROM panels p WHERE p.panelCode = ?";
                    PreparedStatement panelStatement = conn.prepareStatement(panelSql);
                    panelStatement.setString(1, this.panelCode);
                    ResultSet panelResult = panelStatement.executeQuery();
                    while(panelResult.next()){
                        this.panelCodeDisplay = panelResult.getString(2);
                    }
                    //This query gets all of the information currently available for the analysisdata table and
                    //it uses the id value stored on the reportresultdata table under column analysisdataid
                    String analysisSql = "SELECT ad.id, ad.analysisDataRunsId, ad.analysisDataDefinitionId, ad.analysisDataDetectorId, " +
                                    "ad.varcharResult, ad.decimalResult, ad.dateTimeResult, ad.imageResult, ad.eventId, ad.referenceRange, " +
                                    "ad.units, ad.calculatedInterpretation, ad.actualInterpretation, ad.analysisDataLimitsId, ad.analysisDataInterpretationId, " +
                                    "ad.interpretationEventId, ad.stepName " +
                                    "FROM analysisData ad " +
                                    "WHERE ad.id = ? " +
                                    "ORDER BY ad.id";
                    PreparedStatement analysisStatement = conn.prepareStatement(analysisSql);
                    analysisStatement.setString(1, this.analysisDataId);
                    ResultSet analysisResult = analysisStatement.executeQuery();
                    this.analysisData = new LinkedHashMap<Long, AnalysisData>();
                    while (analysisResult.next()) {
                        AnalysisData ad = new AnalysisData();
                        ad.id = analysisResult.getLong(1);
                        ad.analysisDataRunsId = analysisResult.getString(2);
                        ad.analysisDataDefinitionId = analysisResult.getString(3);
                        ad.analysisDataDetectorId = analysisResult.getString(4);
                        ad.varcharResult = analysisResult.getString(5);
                        ad.decimalResult = analysisResult.getString(6);
                        ad.dateTimeResult = analysisResult.getString(7);
                        ad.imageResult = analysisResult.getString(8);
                        ad.eventId = analysisResult.getString(9);
                        ad.referenceRange = analysisResult.getString(10);
                        ad.units = analysisResult.getString(11);
                        ad.calculatedInterpretation = analysisResult.getString(12);
                        ad.actualInterpretation = analysisResult.getString(13);
                        ad.analysisDataLimitsId = analysisResult.getString(14);
                        ad.analysisDataInterpretationId = analysisResult.getString(15);
                        ad.interpretationEventId = analysisResult.getString(16);
                        ad.stepName = analysisResult.getString(17);
                        this.analysisData.put(ad.id, ad);
                        //This query gets all of the information currently available for the analysisdatadefinition table and
                        //it uses the id value stored on the analysisdata table under column analysisDataDefinitionId
                        String analysisDefinitionSql = "SELECT addef.id, addef.analysisMethodVersionsId, addef.detectorDefinitionId, addef.definerType, " +
                                    "addef.sequence, addef.value, addef.dataType, addef.limitType, addef.units, addef.sigFig, addef.report, " +
                                    "addef.eventId, addef.resultCode, addef.loadDataAnalysisDataDefinitionId, addef.formInputSettingsId " +
                                    "FROM analysisDataDefinition addef " +
                                    "WHERE addef.id = ? " +
                                    "ORDER BY addef.id";
                        PreparedStatement analysisDefinitionStatement = conn.prepareStatement(analysisDefinitionSql);
                        analysisDefinitionStatement.setString(1, ad.analysisDataDefinitionId);
                        ResultSet analysisDefinitionResult = analysisDefinitionStatement.executeQuery();
                        ad.analysisDataDefinition = new LinkedHashMap<Long, AnalysisDataDefinition>();
                        while (analysisDefinitionResult.next()) {
                            AnalysisDataDefinition add = new AnalysisDataDefinition();
                            add.id = analysisDefinitionResult.getLong(1);
                            add.analysisMethodVersionsId = analysisDefinitionResult.getString(2);
                            add.detectorDefinitionId = analysisDefinitionResult.getString(3);
                            add.definerType = analysisDefinitionResult.getString(4);
                            add.sequence = analysisDefinitionResult.getString(5);
                            add.value = analysisDefinitionResult.getString(6);
                            add.dataType = analysisDefinitionResult.getString(7);
                            add.limitType = analysisDefinitionResult.getString(8);
                            add.units = analysisDefinitionResult.getString(9);
                            add.sigFig = analysisDefinitionResult.getString(10);
                            add.report = analysisDefinitionResult.getString(11);
                            add.eventId = analysisDefinitionResult.getString(12);
                            add.resultCode = analysisDefinitionResult.getString(13);
                            add.loadDataAnalysisDataDefinitionId = analysisDefinitionResult.getString(14);
                            add.formInputSettingsId = analysisDefinitionResult.getString(15);
                            ad.analysisDataDefinition.put(add.id, add);
                        }
                        analysisDefinitionResult.close();
                        analysisDefinitionStatement.close();
                    }
                    analysisResult.close();
                    analysisStatement.close();
                    this.lastUpdatedEvent = new Events(this.lastUpdatedEventId, this.conn);
                    this.event = new Events(this.eventId, this.conn);
                }
            } 
        }
        return this.exists;
    }
}
