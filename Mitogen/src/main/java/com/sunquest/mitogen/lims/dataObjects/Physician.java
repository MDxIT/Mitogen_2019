package com.sunquest.mitogen.lims.dataObjects;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.text.SimpleDateFormat;

import com.uniconnect.uniflow.Switchboard;


/**
 * Object to manage the contents of the "physicians" table
 * 
 * @author szczepam
 *
 */
public class Physician {
	
	private String physicianId;
	private String first_name;
	private String middle_name;
	private String last_name;
	private String title;
	private String dob;
	private String gender;
	private String providerId;
	private String providerType;
	private java.sql.Date sqlDOB;
	private long eventId;
	private Switchboard sw;
	private boolean exists = false;
	
	/**
	 * Instantiates an empty Physician object
	 * 
	 * @param sw
	 * @throws SQLException
	 */
	
	public Physician(Switchboard sw) {
		this.sw = sw;
	}
	
	/**
	 * Instantiates a Physician object with a physician Id.
	 * Loads the object with data if it exists in the database
	 * 
	 * @param physicianId
	 * @param sw
	 * @throws SQLException
	 */
	public Physician(String physicianId, Switchboard sw) throws SQLException {
		
		this.physicianId = physicianId;
		this.sw = sw;
		
		loadFromDB();
	}
	
	public String getPhysicianId() {
		return this.physicianId;
	}
	
	public String getFirstName() {
		return this.first_name;
	}
	
	public String getMiddleName() {
		return this.middle_name;
	}
	
	public String getLastName() {
		return this.last_name;
	}
	
	public String getTitle() {
		return this.title;
	}
	
	public String getDOB() {
		return this.dob;
	}
	
	public String getGender() {
		return this.gender;
	}
	
	public String getProviderId() {
		return this.providerId;
	}
	
	public String getProviderType() {
		return this.providerType;
	}
	
	public long getEventId() {
		return this.eventId;
	}
	
	public void setFirstName(String firstName) {
		this.first_name = firstName;
	}
	
	public void setMiddleName(String middleName) {
		this.middle_name = middleName;
	}
	
	public void setLastName(String lastName) {
		this.last_name = lastName;
	}
	
	public void setTitle(String title) {
		this.title = title;
	}
	
	public void setDOB(String dob) {
		this.dob = dob;

		try {
			this.sqlDOB = java.sql.Date.valueOf(this.dob);
		} catch (Exception ex) {
			
		}
	}
	
	public void setGender(String gender) {
		this.gender = gender;
	}
	
	public void setProviderId(String providerId) {
		this.providerId = providerId;
	}
	
	public void setProviderType(String providerType) {
		this.providerType = providerType;
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
			String sql = "INSERT INTO physicians (physicianId, first_name, middle_name, last_name, title, "
					+ "dob, gender, providerId, providerType, eventId)"
					+ "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);";
			
			this.physicianId = Sequences.newPhysicianId();
			this.eventId = sw.eventId;
			
			PreparedStatement ps = sw.connection.prepareStatement(sql);
			
			ps.setString(1, this.physicianId);
			ps.setString(2, this.first_name);
			ps.setString(3, this.middle_name);
			ps.setString(4, this.last_name);
			ps.setString(5, this.title);
			ps.setDate(6, this.sqlDOB);
			ps.setString(7, this.gender);
			ps.setString(8, this.providerId);
			ps.setString(9, this.providerType);
			ps.setLong(10, this.eventId);
			
			ps.executeUpdate();
			
			this.exists = true;
		} else {
			String sql = "UPDATE physicians  SET first_name = ?, middle_name = ?, last_name = ?, title = ?, "
					+ "dob = ?, gender = ?, providerId = ?, providerType = ?, eventId = ? WHERE physicianId =  = ?";
			
			this.eventId = sw.eventId;
			
			PreparedStatement ps = sw.connection.prepareStatement(sql);
			
			ps.setString(1, this.first_name);
			ps.setString(2, this.middle_name);
			ps.setString(3, this.last_name);
			ps.setString(4, this.title);
			ps.setDate(5, this.sqlDOB);
			ps.setString(6, this.gender);
			ps.setString(7, this.providerId);
			ps.setString(8, this.providerType);
			ps.setLong(9, this.eventId);
			ps.setString(10, this.physicianId);
			
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
		
		if (this.physicianId == null) {
			String sql = "SELECT first_name, middle_name, last_name, title, dob, gender, providerId, providerType, eventId "
					+ "FROM physicians WHERE physicianId = ? "
					+ "ORDER BY id";
			
			PreparedStatement ps = sw.connection.prepareStatement(sql);
			
			ps.setString(1, this.physicianId);
			
			ResultSet rs = ps.executeQuery();
			
			if (rs.next()) {
				this.exists = true;
				
				this.first_name = (this.first_name == null ? rs.getString(1) : this.first_name);
				this.middle_name = (this.middle_name == null ? rs.getString(2) : this.middle_name);
				this.last_name = (this.last_name == null ? rs.getString(3) : this.last_name);
				this.title = (this.title == null ? rs.getString(4) : this.title);
				setDOB((this.dob == null ? new SimpleDateFormat("yyyy-MM-dd").format(rs.getDate(5)) : this.dob));
				this.gender = (this.gender == null ? rs.getString(6) : this.gender);
				this.providerId = (this.providerId == null ? rs.getString(7) : this.providerId);
				this.providerType = (this.providerType == null ? rs.getString(8) : this.providerType);
				this.eventId = rs.getLong(9);
			}
			
			rs.close();
			ps.close();
		}
		
		return this.exists;
	}
}