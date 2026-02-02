package com.sunquest.mitogen.lims.dataObjects;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import com.uniconnect.uniflow.Switchboard;

/**
 * Class for content of the "organizationSites" table
 * 
 * @author szczepam
 *
 */
public class OrganizationSite {
	
	private String name;
	private String siteId;
	private String orgId;
	private String address1;
	private String address2;
	private String city;
	private String state;
	private String postalcode;
	private String country;
	private String email;
	private String phone1;
	private String phone2;
	private String fax1;
	private String fax2;
	private long eventId;
	private Switchboard sw;
	private boolean exists = false;
	
	
	/**
	 * Instantiates the object using an organization id and the site name.  
	 * If the site exists, loads the object with data
	 * 
	 * @param orgId
	 * @param name
	 * @param sw
	 * @throws SQLException
	 */
	public OrganizationSite(String orgId, String name, Switchboard sw) throws SQLException{
		
		this.name = name;
		this.orgId = orgId;
		this.sw = sw;
		
		loadFromDB();
	}
	
	/**
	 * Instantiates the object using an site id.  
	 * If the site exists, loads the object with data
	 * 
	 * @param siteId
	 * @param sw
	 * @throws SQLException
	 */
	public OrganizationSite(String siteId, Switchboard sw) throws SQLException{
		
		this.siteId = siteId;
		this.sw = sw;
		
		loadFromDB();
	}
	
	public String getName() {
		return this.name;
	}
	
	public String getSiteId() {
		return this.siteId;
	}
	
	public long getEventId() {
		return this.eventId;
	}
	
	public String getOrgId() {
		return this.orgId;
	}
	
	public String getAddress1() {
		return this.address1;
	}
	
	public String getAddress2() {
		return this.address2;
	}
	
	public String getCity() {
		return this.city;
	}
	
	public String getState() {
		return this.state;
	}
	
	public String getPostalcode() {
		return this.postalcode;
	}
	
	public String getCountry() {
		return this.country;
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
	
	public void setName(String name) {
		this.name = name;
	}
	
	public void setOrgId(String orgId) {
		this.orgId = orgId; 
	}
	
	public void setAddress1(String address1) {
		this.address1 = address1;
	}
	
	public void setAddress2(String address2) {
		this.address2 = address2;
	}
	
	public void setCity(String city) {
		this.city = city;
	}
	
	public void setState(String state) {
		this.state = state;
	}
	
	public void setPostalcode(String postalCode) {
		this.postalcode = postalCode;
	}
	
	public void setCountry(String country) {
		this.country = country;
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
	
	public boolean recordExists() throws SQLException{
		
		return loadFromDB();
	}
	
	public void save () throws SQLException {
		
		loadFromDB();
		if (!exists) {
			String sql = "INSERT INTO organizationSites (siteId, orgId, name, address1, address2, "
					+ "city, state, postalcode, country, email, phone1, phone2, fax1, fax2, eventId) "
					+ "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);";
			
			this.siteId = Sequences.newSiteId();
			this.eventId = sw.eventId;
			
			PreparedStatement ps = sw.connection.prepareStatement(sql);
			
			ps.setString(1, this.siteId);
			ps.setString(2, this.orgId);
			ps.setString(3, this.name);
			ps.setString(4, this.address1);
			ps.setString(5, this.address2);
			ps.setString(6, this.city);
			ps.setString(7, this.state);
			ps.setString(8, this.postalcode);
			ps.setString(9, this.country);
			ps.setString(10, this.email);
			ps.setString(11, this.phone1);
			ps.setString(12, this.phone2);
			ps.setString(13, this.fax1);
			ps.setString(14, this.fax2);
			ps.setLong(15, this.eventId);
			
			ps.executeUpdate();
			
			this.exists = true;
		} else {
			String sql = "UPDATE organizationSites SET orgId = ?, name = ?, address1 = ?, address2 = ?, "
					+ "city = ?, state = ?, postalcode = ?, country = ?, email = ?, phone1 = ?, phone2 + ?, fax1 = ?, fax2 = ?, eventId = ?) ";
			
			this.eventId = sw.eventId;
			
			PreparedStatement ps = sw.connection.prepareStatement(sql);
			
			ps.setString(1, this.orgId);
			ps.setString(2, this.name);
			ps.setString(3, this.address1);
			ps.setString(4, this.address2);
			ps.setString(5, this.city);
			ps.setString(6, this.state);
			ps.setString(7, this.postalcode);
			ps.setString(8, this.country);
			ps.setString(9, this.email);
			ps.setString(10, this.phone1);
			ps.setString(11, this.phone2);
			ps.setString(12, this.fax1);
			ps.setString(13, this.fax2);
			ps.setLong(14, this.eventId);
			
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
		String sql = "";
		
		if (this.siteId == null) {
			sql = "SELECT siteId, address1, address2, city, state, postalcode, country, email, phone1, phone2, fax1, fax2, eventId " +
				"FROM organizationSites WHERE name = ? AND orgId = ? " +
				"ORDER BY id";
		} else {
			sql = "SELECT name, orgId, address1, address2, city, state, postalcode, country, email, phone1, phone2, fax1, fax2, eventId " +
					"FROM organizationSites WHERE siteId = ? " +
					"ORDER BY id";
		}
		
		PreparedStatement ps = sw.connection.prepareStatement(sql);
		
		if (this.siteId == null) {
			ps.setString(1, this.name);
			ps.setString(2,  this.orgId);
		} else {
			ps.setString(1, this.siteId);
		}
		
		ResultSet rs = ps.executeQuery();
		
		if (rs.next()) {
			this.exists = true;
			
			if (this.orgId != null) {
				this.siteId = (this.siteId == null ? rs.getString(1) : this.siteId);
				this.address1 = (this.address1 == null ? rs.getString(2) : this.address1);
				this.address2 = (this.address2 == null ? rs.getString(3) : this.address2);
				this.city = (this.city == null ? rs.getString(4) : this.city);
				this.state = (this.state == null ? rs.getString(5) : this.state);
				this.postalcode = (this.postalcode == null ? rs.getString(6) : this.postalcode);
				this.country = (this.country == null ? rs.getString(7) : this.country);
				this.email = (this.email == null ? rs.getString(8) : this.email);
				this.phone1 = (this.phone1 == null ? rs.getString(9) : this.phone1);
				this.phone2 = (this.phone2 == null ? rs.getString(10) : this.phone2);
				this.fax1 = (this.fax1 == null ? rs.getString(11) : this.fax1);
				this.fax2 = (this.fax2 == null ? rs.getString(12) : this.fax2);
				this.eventId = rs.getLong(13);
			} else {
				this.name = (this.name == null ? rs.getString(1) : this.name);
				this.orgId = (this.orgId == null ? rs.getString(2) : this.orgId);
				this.address1 = (this.address1 == null ? rs.getString(3) : this.address1);
				this.address2 = (this.address2 == null ? rs.getString(4) : this.address2);
				this.city = (this.city == null ? rs.getString(5) : this.city);
				this.state = (this.state == null ? rs.getString(6) : this.state);
				this.postalcode = (this.postalcode == null ? rs.getString(7) : this.postalcode);
				this.country = (this.country == null ? rs.getString(8) : this.country);
				this.email = (this.email == null ? rs.getString(9) : this.email);
				this.phone1 = (this.phone1 == null ? rs.getString(10) : this.phone1);
				this.phone2 = (this.phone2 == null ? rs.getString(11) : this.phone2);
				this.fax1 = (this.fax1 == null ? rs.getString(12) : this.fax1);
				this.fax2 = (this.fax2 == null ? rs.getString(13) : this.fax2);
				this.eventId = rs.getLong(14);
			}
		}
		
		rs.close();
		ps.close();
		
		return this.exists;
	}
	
}