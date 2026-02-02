package com.sunquest.mitogen.lims.dataObjects;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import com.uniconnect.uniflow.Switchboard;

public class Tests {
    public Tests(Connection conn){
        this.conn = conn;
    }
    public Tests(Switchboard sw){
        this.sw = sw;
        this.conn = sw.connection;
    }
    private Connection conn;
    private Switchboard sw;
    private Boolean exists = false;

    private String id;
    private String testCode;
    private String name;
    private String description;
    private String abbreviation;
    private String type;
    private String cptCode;
    private String zCode;
    private String billingCode;
    private String disabled;
    private String eventId;
    public String getId(){
        return this.id;
    }
    public String getTestCode(){
        return this.testCode;
    }
    public void setTestCode(String testCode){
        this.testCode = testCode;
    }
    public String getName(){
        return this.name;
    }
    public String getDescription(){
        return this.description;
    }
    public String getAbbreviation(){
        return this.abbreviation;
    }
    public String getType(){
        return this.type;
    }
    public String getCptCode(){
        return this.cptCode;
    }
    public String getZCode(){
        return this.zCode;
    }
    public String getBillingCode(){
        return this.billingCode;
    }
    public String getDisabled(){
        return this.disabled;
    }
    public String getEventId(){
        return this.eventId;
    }

    public Boolean LoadByTestCode(String tc) throws SQLException{
        String sql = "SELECT id "
                    + "FROM tests "
                    + "WHERE testCode = ? "
                    + "ORDER BY id";
        PreparedStatement ps = conn.prepareStatement(sql);
        ps.setString(1, tc);
        ResultSet rs = ps.executeQuery();
        if (rs.next()) {
            this.id = rs.getString(1);
        }
        return LoadFromDB();
    }
    public Boolean LoadFromDB() throws SQLException{
        this.exists = false;
        if (this.id != null){
            String sql = "SELECT t.testCode, t.name, t.description, t.abbreviation, t.type, t.cptCode, t.zCode, t.billingCode, t.disabled, t.eventId "
                    + "FROM tests t "
                    + "WHERE t.id = ? "
                    + "ORDER BY t.id";
            PreparedStatement ps = conn.prepareStatement(sql);
            ps.setString(1, this.id);
            ResultSet rs = ps.executeQuery();
            if (rs.next()) {
                this.testCode = rs.getString(1);
                this.name = rs.getString(2);
                this.description = rs.getString(3);
                this.abbreviation = rs.getString(4);
                this.type = rs.getString(5);
                this.cptCode = rs.getString(6);
                this.zCode = rs.getString(7);
                this.billingCode = rs.getString(8);
                this.disabled = rs.getString(9);
                this.eventId = rs.getString(10);
            }
        }
        return this.exists;
    }
}