package com.sunquest.mitogen.lims.dataObjects;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.LinkedHashMap;
import java.util.LinkedList;
import java.util.List;

import com.uniconnect.uniflow.Switchboard;

public class ReportDetails {
    public ReportDetails(Switchboard sw) {
        this.sw = sw;
        this.conn = sw.connection;
    }
    public ReportDetails(Connection conn) {
        this.conn = conn;
    }
    
    public class ReportedData {
        private Long id;
        private String reportDetailsId;
        private String jsonData;
        private String reportHTML;
        private String reportDefinitionVersionId;
        private String status;
        private String active;
        private String pdfFilePath;
        private String eventId;
        private String lastUpdatedEventId;
        public Long getId() {
            return this.id;
        }
        public String getReportDetailsId() {
            return this.reportDetailsId;
        }
        public String getJsonData() {
            return this.jsonData;
        }
        public String getReportHTML() {
            return this.reportHTML;
        }
        public String getReportDefinitionVersionId() {
            return this.reportDefinitionVersionId;
        }
        public String getStatus() {
            return this.status;
        }
        public String getActive() {
            return this.active;
        }
        public String getPDFFilePath() {
            return this.pdfFilePath;
        }
        public String getEventId() {
            return this.eventId;
        }
        public String getLastUpdatedEventId() {
            return this.lastUpdatedEventId;
        }
    }
    public class ReportSettings {
        private Long id;
        private String reportDefinitionVersionId;
        private String title;
        private String reportDescription;
        private String eventId;
        private String headerId;
        private String pageHeaderFooterId;
        private String reportTemplateHTML;
        private String reportTemplateCSS;
        private String reportTemplateJS;
        public Long getId() {
            return this.id;
        }
        public String getReportDefinitionVersionId() {
            return this.reportDefinitionVersionId;
        }
        public String getTitle() {
            return this.title;
        }
        public String getReportDescription() {
            return this.reportDescription;
        }
        public String getEventId() {
            return this.eventId;
        }
        public String getHeaderId() {
            return this.headerId;
        }
        public String getPageHeaderFooterId() {
            return this.pageHeaderFooterId;
        }
        public String getReportTemplateHTML() {
            return this.reportTemplateHTML;
        }
        public String getReportTemplateCSS() {
            return this.reportTemplateCSS;
        }
        public String getReportTemplateJS() {
            return this.reportTemplateJS;
        }
    } 

    private String id;
    private String reportId;
    private String requestFormsId;
    private String reportDefinitionVersionId;
    private String eventId;
    private String reportType;
    private String status;
    private String statusEventId;

    private boolean exists;
    private Switchboard sw;
    private Connection conn;
    
    private LinkedHashMap<Long, ReportedData> reportedData = null;
    private LinkedHashMap<Long, ReportSettings> reportSettings = null;
    private LinkedHashMap<Long, ReportResultData> reportResultData = null;
    private Events event;
    private Events statusEvent;
    
    public String getId() {
        return this.id;
    }
    public String getReportId() {
        return this.reportId;
    }
    public String getRequestFormsId() {
        return this.requestFormsId;
    }
    public String getReportDefinitionVersionId() {
        return this.reportDefinitionVersionId;
    }
    public String getEventId() {
        return this.eventId;
    }
    public String getReportType() {
        return this.reportType;
    }
    public String getStatus() {
        return this.status;
    }
    public String getStatusEventId() {
        return this.statusEventId;
    }
    public LinkedHashMap<Long, ReportedData> getReportedData() {
        return this.reportedData;
    }
    public LinkedHashMap<Long, ReportSettings> getReportSettings() {
        return this.reportSettings;
    }
    public LinkedHashMap<Long, ReportResultData> getReportResultData() {
        return this.reportResultData;
    }
    public Events getEvent() {
        return this.event;
    }
    public Events getStatusEvent() {
        return this.statusEvent;
    }

    //Load the object by providing reportId to find the primary key for the report we are looking for
    public boolean LoadByReportID(String reportId) throws SQLException {
        this.reportId = reportId;
        String sql = "SELECT r.id " +
                    "FROM reportDetails r " +
                    "WHERE r.reportId = ? " +
                    "ORDER BY r.id";
        PreparedStatement ps = conn.prepareStatement(sql);
        ps.setString(1, reportId);
        ResultSet rs = ps.executeQuery();
        this.id = "";
        while (rs.next()) {
            if (!id.isEmpty()){
                if (!this.id.equals(rs.getString(1))){
                    throw new SQLException("Multiple matching reports found");
                }
            }
            this.id = rs.getString(1);
        }
        return LoadFromDB();
    }
    //Load the object by providing the primary key for the report we are looking for
    public boolean LoadByID(String id) throws SQLException {
        this.id = id;
        return LoadFromDB();
    }
    public List<ReportDetails> SearchByRequestFormsID(String requestFormsId) throws SQLException {
        List<ReportDetails> retVal = new LinkedList<ReportDetails>();
        String sql = "SELECT r.id " +
                "FROM reportDetails r " +
                "WHERE r.requestFormsId = ? " +
                "ORDER BY r.id";
        PreparedStatement ps = conn.prepareStatement(sql);
        ps.setString(1, requestFormsId);
        ResultSet rs = ps.executeQuery();
        while (rs.next()) {
            ReportDetails rd = new ReportDetails(this.conn);
			rd.LoadByID(rs.getString(1));
			retVal.add(rd);
        }
        return retVal;
    }
    public boolean LoadFromDB() throws SQLException{
        this.exists = false;
        if (this.id != null) {
            //This sql query gets the reportdetails given a particular report ID
            String sql = "SELECT r.id, r.reportId, r.requestFormsId, r.reportDefinitionVersionId, " +
                            "r.eventId, r.reportType, r.status, r.statusEventId " +
                            "FROM reportDetails r " +
                            "WHERE r.id = ? " +
                            "ORDER BY r.id";
            PreparedStatement ps = conn.prepareStatement(sql);
            ps.setString(1, this.id);
            ResultSet rs = ps.executeQuery();
            while (rs.next()) {
                this.exists = true;
                this.id = (this.id == null ? rs.getString(1) : this.id);
                this.reportId = (this.reportId == null ? rs.getString(2) : this.reportId);
                this.requestFormsId = (this.requestFormsId == null ? rs.getString(3) : this.requestFormsId);
                this.reportDefinitionVersionId = (this.reportDefinitionVersionId == null ? rs.getString(4) : this.reportDefinitionVersionId);
                this.eventId = (this.eventId == null ? rs.getString(5) : this.eventId);
                this.reportType = (this.reportType == null ? rs.getString(6) : this.reportType);
                this.status = (this.status == null ? rs.getString(7) : this.status);
                this.statusEventId = (this.statusEventId == null ? rs.getString(8) : this.statusEventId);
            }
            rs.close();
            ps.close();
            if (this.exists) 
            {
                //This query gets all of the information currently available for the reporteddata table and
                //it uses the id value stored on the reportdetails table under column reportdetailsid
                sql = "SELECT r.id, r.reportDetailsId, r.jsonData, r.reportHTML, r.reportDefinitionVersionId, r.status, " +
                    "r.active, r.pdfFilePath, r.eventId, r.lastUpdatedEventId " +
                    "FROM reportedData r " +
                    "WHERE r.reportDetailsId = ? " +
                    "ORDER BY r.id";
                ps = conn.prepareStatement(sql);
                ps.setString(1, this.id.toString());
                rs = ps.executeQuery();
                reportedData = new LinkedHashMap<Long, ReportedData>();
                while (rs.next()) {
                    ReportedData rd = new ReportedData();
                    rd.id = rs.getLong(1);
                    rd.reportDetailsId = rs.getString(2);
                    rd.jsonData = rs.getString(3);
                    rd.reportHTML = rs.getString(4);
                    rd.reportDefinitionVersionId = rs.getString(5);
                    rd.status = rs.getString(6);
                    rd.active = rs.getString(7);
                    rd.pdfFilePath = rs.getString(8);
                    rd.eventId = rs.getString(9);
                    rd.lastUpdatedEventId = rs.getString(10);
                    reportedData.put(rd.id, rd);
                }
                //This query gets all of the information currently available for the reportsettings table and
                //it uses the reportDefinitionVersionId value stored on the reportdetails table under column
                //reportDefinitionVersionId
                sql = "SELECT r.id, r.reportDefinitionVersionId, r.title, r.reportDescription, r.eventId, r.headerId, " +
                    "r.pageHeaderFooterId, r.reportTemplateHTML, r.reportTemplateCSS, r.reportTemplateJS " +
                    "FROM reportSettings r " +
                    "WHERE r.reportDefinitionVersionId = ? " +
                    "ORDER BY r.id";
                ps = conn.prepareStatement(sql);
                ps.setString(1, this.reportDefinitionVersionId);
                rs = ps.executeQuery();
                reportSettings = new LinkedHashMap<Long, ReportSettings>();
                while (rs.next()) {
                    ReportSettings rSettings = new ReportSettings();
                    rSettings.id = rs.getLong(1);
                    rSettings.reportDefinitionVersionId = rs.getString(2);
                    rSettings.title = rs.getString(3);
                    rSettings.reportDescription = rs.getString(4);
                    rSettings.eventId = rs.getString(5);
                    rSettings.headerId = rs.getString(6);
                    rSettings.pageHeaderFooterId = rs.getString(7);
                    rSettings.reportTemplateHTML = rs.getString(8);
                    rSettings.reportTemplateCSS = rs.getString(9);
                    rSettings.reportTemplateJS = rs.getString(10);
                    reportSettings.put(rSettings.id, rSettings);
                }
                //Load a ReportResultData object and call its search method to find all ReportResultData that match the specified ReportDetailsID
                //Then load them into the hashtable for this table. This is so that ReportDetails contains a pointer to the results which it needs to
                //properly load the observations
                reportResultData = new LinkedHashMap<Long, ReportResultData>();
                ReportResultData rrd = new ReportResultData(this.conn);
                List<ReportResultData> lrrd = rrd.SearchByReportDetailsID(this.id);
                for (ReportResultData rd : lrrd){
                    reportResultData.put(rd.getID(), rd);
                }

                rs.close();
                ps.close();
                this.event = new Events(this.eventId, conn);
                this.statusEvent = new Events(this.statusEventId, conn);
            }
        }
        return this.exists;
    }
}