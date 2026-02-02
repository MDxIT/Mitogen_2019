package com.sunquest.mitogen.lims.dataObjects;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import com.uniconnect.uniflow.Switchboard;

/**
 * Class to maanage contents of the "physicianSites" table
 * 
 * @author szczepam
 *
 */

public class PhysicianSite {
	
	private long id = -1;
	private String physicianId; 
	private String siteId; 
	private String email; 
	private String phone1; 
	private String phone2; 
	private String fax1; 
	private String fax2; 
	private long active = -1;
	private long eventId;
	private Switchboard sw;
	private boolean exists = false;
	
	/**
	 * Instantiates a PhysicainSite object with a physician and site Id.
	 * Loads the object with data if it exists in the database
	 * 
	 * @param physicianId
	 * @parm siteId
	 * @param sw
	 * @throws SQLException
	 */
	public PhysicianSite(String physicianId, String siteId, Switchboard sw) throws SQLException{
		this.physicianId = physicianId;
		this.siteId = siteId;
		this.sw = sw;
		
		loadFromDB();
	}
	
	public long getId() {
		return this.id;
	}
	
	public String getPhysicianId() {
		return this.physicianId;
	}
	
	public String getSiteId() {
		return this.siteId;
	}
	
	public String getEmail() {
		return this.email;
	}
	
	public String getPhone1() {
		return this.phone1;
	}
	
	public String getPhone2() {
		return this.phone2;
	}
	
	public String getFax1() {
		return this.fax1;
	}
	
	public String getFax2() {
		return this.fax2;
	}
	
	public long getActive() {
		return this.active;
	}
	
	public long getEventId() {
		return this.eventId;
	}
	
	public void setPhysicianId(String physicianId) {
		this.physicianId = physicianId;
	}
	
	public void setSiteId(String siteId) {
		this.siteId = siteId;
	}
	
	public void setEmail(String email) {
		this.email = email;
	}
	
	public void setPhone1(String phone1) {
		this.phone1 = phone1;
	}
	
	public void setPhone2(String phone2) {
		this.phone2 = phone2;
	}
	
	public void setFax1(String fax1) {
		this.fax1 = fax1;
	}
	
	public void setFax2(String fax2) {
		this.fax2 = fax2;
	}
	
	public void setActive(long active) {
		this.active = active;
	}
	
	public boolean recordExists() throws SQLException {
		return loadFromDB();
	}
	
	/**
	 * Saves or updates the database record
	 * 
	 * @throws SQLException
	 */
	public void save() throws SQLException {
		
		loadFromDB();
		
		if (!exists) {
			String sql = "INSERT INTO physicianSites (physicianId, siteId, email, phone1, phone2, fax1, fax2, active, eventId) "
					+ "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);";
			
			this.eventId = sw.eventId;
			
			PreparedStatement ps = sw.connection.prepareStatement(sql, PreparedStatement.RETURN_GENERATED_KEYS);
			
			ps.setString(1, this.physicianId);
			ps.setString(2, this.siteId);
			ps.setString(3, this.email);
			ps.setString(4, this.phone1);
			ps.setString(5, this.phone2);
			ps.setString(6, this.fax1);
			ps.setString(7, this.fax2);
			ps.setLong(8, this.active);
			ps.setLong(9, this.eventId);
			
			ps.executeUpdate();
			
			ResultSet rs = ps.getGeneratedKeys();
			rs.next();
			this.id = rs.getLong(1);
			
			rs.close();
			
			this.exists = true;
		} else {
			String sql = "UPDATE physicianSites SET physicianId = ?, siteId = ?, email = ?, phone1 = ?, phone2 = ?, fax1 = ?, "
					+ "fax2 = ?, active = ?, eventId = ? WHERE id = ? ";
			
			this.eventId = sw.eventId;
			
			PreparedStatement ps = sw.connection.prepareStatement(sql);
			
			ps.setString(1, this.physicianId);
			ps.setString(2, this.siteId);
			ps.setString(3, this.email);
			ps.setString(4, this.phone1);
			ps.setString(5, this.phone2);
			ps.setString(6, this.fax1);
			ps.setString(7, this.fax2);
			ps.setLong(8, this.active);
			ps.setLong(9, this.eventId);
			ps.setLong(10, this.id);
			
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
	public boolean loadFromDB() throws SQLException {
		
		this.exists = false;
		
		String sql = "SELECT email, phone1, phone2, fax1, fax2, active, eventId, id "
				+ "FROM physicianSites WHERE physicianId = ? AND siteId = ? "
				+ "ORDER BY id";
		
		PreparedStatement ps = sw.connection.prepareStatement(sql);
		
		ps.setString(1, this.physicianId);
		ps.setString(2, this.siteId);
		
		ResultSet rs = ps.executeQuery();
		
		if (rs.next()) {
			this.exists = true;
			
			this.email = (this.email == null ? rs.getString(1) : this.email);
			this.phone1 = (this.phone1 == null ? rs.getString(2) : this.phone1);
			this.phone2 = (this.phone2 == null ? rs.getString(3) : this.phone2);
			this.fax1 = (this.fax1 == null ? rs.getString(4) : this.fax1);
			this.fax2 = (this.fax2 == null ? rs.getString(5) : this.fax2);
			this.active = (this.active == -1 ? rs.getLong(6) : this.active);
			this.eventId = rs.getLong(7);
			this.id = (this.id == -1 ? rs.getLong(8) : this.id);
		}
		
		rs.close();
		ps.close();
		
		return this.exists;
	}		
}