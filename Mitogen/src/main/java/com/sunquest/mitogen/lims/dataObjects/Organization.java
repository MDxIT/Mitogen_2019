package com.sunquest.mitogen.lims.dataObjects;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import com.uniconnect.uniflow.Switchboard;


/**
 * Class for content of the organizations table
 * 
 * @author szczepam
 *
 */
public class Organization {
	
	private String name;
	private String orgId;
	private long eventId;
	private Switchboard sw;
	private boolean exists = false;
	
	
	/**
	 * Instansiates an organization, loads from the database if a record with the name already exists
	 * 
	 * @param name
	 * @param sw
	 * @throws SQLException
	 */
	public Organization(String name, Switchboard sw) throws SQLException{
		
		this.name = name;
		this.sw = sw;
		
		loadFromDB();
	}
	
	public void setName(String name) {
		this.name = name;
	}
	
	public String getName() {
		return this.name;
	}
	
	public String getOrgId() {
		return this.orgId;
	}
	
	public long getEventId() {
		return this.eventId;
	}
	
	public boolean recordExists() throws SQLException{
		
		return loadFromDB();
	}
	
	/**
	 * Saves or updates the database record
	 * 
	 * @throws SQLException
	 */
	public void save () throws SQLException {
		
		loadFromDB();
		
		if (!exists) {
			String sql = "INSERT INTO organizations (orgId, name, eventId) VALUES (?, ?, ?);";
			
			this.orgId = Sequences.newOrgId();
			this.eventId = sw.eventId;
			
			PreparedStatement ps = sw.connection.prepareStatement(sql);
			
			ps.setString(1, this.orgId);
			ps.setString(2, this.name);
			ps.setLong(3, this.eventId);
			
			ps.executeUpdate();
			
			this.exists = true;
		} else {
			String sql = "UPDATE organizations SET name = ?, eventId = ? WHERE orgId = ?;";
			
			PreparedStatement ps = sw.connection.prepareStatement(sql);
			
			this.eventId = sw.eventId;
			
			ps.setString(1, this.name);
			ps.setLong(2, this.eventId);
			ps.setString(3, this.orgId);
			
			ps.executeUpdate();
			
			this.exists = true;
		}
	}
	
	/**
	 *Checks to see if the record exists in the database.  Loads the object with the data if it does.
	 * 
	 * @return
	 * @throws SQLException
	 */
	private boolean loadFromDB() throws SQLException {
		
		this.exists = false;
		String sql = "";
		
		if (this.orgId == null) {
			sql = "SELECT orgId, eventId FROM organizations WHERE name = ?";
		} else {
			sql = "SELECT name, eventId FROM organizations WHERE orgId = ?";
		}
		
		PreparedStatement ps = sw.connection.prepareStatement(sql);
		
		if (this.orgId == null) {
			ps.setString(1, this.name);
		} else {
			ps.setString(1, this.orgId);
		}
		
		ResultSet rs = ps.executeQuery();
		
		if (rs.next()) {
			this.exists = true;
			
			if (this.orgId == null) {
				this.orgId = rs.getString(1);
			} else {
				this.setName(this.name == null ? rs.getString(1) : this.name);
			}
			
			this.eventId = rs.getLong(2);
		}
		
		rs.close();
		ps.close();
		
		return this.exists;
	}
}