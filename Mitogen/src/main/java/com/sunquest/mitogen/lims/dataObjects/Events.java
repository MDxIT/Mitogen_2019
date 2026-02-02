package com.sunquest.mitogen.lims.dataObjects;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;

import com.uniconnect.uniflow.Switchboard;

public class Events {
    public Events(Connection conn) {
        this.conn = conn;
    }
    public Events(Switchboard sw) {
        this.sw = sw;
        this.conn = sw.connection;
    }
    public Events(String id, Connection conn) throws SQLException {
        this.conn = conn;
        this.eventId = id;
        LoadFromDB();
    }
    public Events(String id, Switchboard sw) throws SQLException {
        this.sw = sw;
        this.conn = sw.connection;
        this.eventId = id;
        LoadFromDB();
    }

    private Connection conn;
    private Switchboard sw;
    private Boolean exists = false;

    private String eventId;
    private String step;
    private String eventDate;
    private String userId;
    private String station;
    private String comments;
    private String overrideUserId;
    private String versionId;
    private String sopVersion;
    private String request;
    private String response;

    public String getEventId(){
        return this.eventId;
    }
    public String getStep(){
        return this.step;
    }
    public String getEventDate(){
        return this.eventDate;
    }
    public String getUserId(){
        return this.userId;
    }
    public String getStation(){
        return this.station;
    }
    public String getComments(){
        return this.comments;
    }
    public String getOverrideUserId(){
        return this.overrideUserId;
    }
    public String getVersionId(){
        return this.versionId;
    }
    public String getSOPVersion(){
        return this.sopVersion;
    }
    public String getRequest(){
        return this.request;
    }
    public String getResponse(){
        return this.response;
    }

    public boolean LoadFromDB() throws SQLException {
        this.exists = false;
        if (this.eventId != null){
            String sql = "SELECT e.eventId, e.step, e.eventDate, e.userId, e.station, e.comments, e.overrideUserId, e.versionId, e.sopVersion, e.request, e.response " +
                        "FROM events e " +
                        "WHERE e.eventId = ? " +
                        "ORDER BY e.eventId";
            PreparedStatement ps = conn.prepareStatement(sql);
            ps.setString(1, this.eventId);
            ResultSet rs = ps.executeQuery();
            if (rs.next()) {
                this.exists = true;

                this.eventId = rs.getString(1);
                this.step = rs.getString(2);
                this.eventDate = rs.getString(3);
                this.userId = rs.getString(4);
                this.station = rs.getString(5);
                this.comments = rs.getString(6);
                this.overrideUserId = rs.getString(7);
                this.versionId = rs.getString(8);
                this.sopVersion = rs.getString(9);
                this.request = rs.getString(10);
                this.response = rs.getString(11);
            }
        }
        return this.exists;
    }
}