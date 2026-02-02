package com.sunquest.mitogen.lims.dataObjects;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.LinkedHashMap;

import com.uniconnect.uniflow.Switchboard;


/**
 * Object to manage the contents of the "patients" and "patientSources" table
 * 
 * @author szczepam
 *
 */
public class Patient {
	
	public class PatientSource {
		public String patientId; 
		public String sqId; 
		public String firstName; 
		public String middleName; 
		public String lastName; 
		public String status; 
		public String address1; 
		public String address2; 
		public String city; 
		public String state; 
		public String postalCode; 
		public String country; 
		public String email; 
		public String phone1CountryCode; 
		public String phone1; 
		public String phone2CountryCode; 
		public String phone2; 
		public String phone3CountryCode; 
		public String phone3; 
		public String dob; 
		public String govtId; 
		public String geneticGender; 
		public String genderId; 
		public String mrn;
		public String mrnType;
		public String mrnFacility;
		public String siteId;
		public String ethnicity;
		public long eventId = -1;
		public long master = -1;
	}
	
	private String patientId; 
	private String sqId; 
	private String firstName; 
	private String middleName; 
	private String lastName; 
	private String status; 
	private String address1; 
	private String address2; 
	private String city; 
	private String state; 
	private String postalCode; 
	private String country; 
	private String email; 
	private String phone1CountryCode; 
	private String phone1; 
	private String phone2CountryCode; 
	private String phone2; 
	private String phone3CountryCode; 
	private String phone3; 
	private String dob; 
	private java.sql.Date sqlDOB;
	private String govtId; 
	private String geneticGender; 
	private String genderId; 
	private String ethnicity;
	private String mrn;
	private String siteId;
	private long eventId = -1;
	private Switchboard sw;
	private Connection conn;
	public LinkedHashMap<Long, PatientSource> patientSources = null;
	private boolean exists = false;
	
	/**
	 * Instantiates a Patient object with a patient Id.
	 * Loads the object with data if it exists in the database
	 * 
	 * @param patientId
	 * @param sw
	 * @throws SQLException
	 */
	public Patient(String patientId, Switchboard sw) throws SQLException {
	
		this.patientId = patientId;
		this.sw = sw;
		this.conn = sw.connection;
		this.status = "active";
	
		loadFromDB();
	}

	
	public Patient(Connection conn ) {
		
		this.conn = conn;
	}
	
	/**
	 * Instantiates an empty Patient object 
	 * 
	 * @param patientId
	 * @param sw
	 * @throws SQLException
	 */
	public Patient(Switchboard sw) {
		this.sw = sw;
		this.conn = sw.connection;
	}
	
    public String getPatientId() {
    	return this.patientId;
    } 
    
    public String getMRN() {
    	return this.mrn;
    } 
    
    public String getSiteId() {
    	return this.siteId;
    } 
    
    public String getSQID() {
    	return this.sqId;
    } 
    
    public String getFirstName() {
    	return this.firstName;
    } 
    
    public String getMiddleName() {
    	return this.middleName;
    } 
    
    public String getLastName() {
    	return this.lastName;
    } 
    
    public String getStatus() {
    	return this.status;
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
    
    public String getPostalCode() {
    	return this.postalCode;
    } 
    
    public String getCountry() {
    	return this.country;
    } 
    
    public String getEmail() {
    	return this.email;
    } 
    
    public String getPhone1CountryCode() {
    	return this.phone1CountryCode;
    } 
    
    public String getPhone1() {
    	return this.phone1;
    } 
    
    public String getPhone2CountryCode() {
    	return this.phone2CountryCode;
    } 
    
    public String getPhone2() {
    	return this.phone2;
    } 
    
    public String getPhone3CountryCode() {
    	return this.phone3CountryCode;
    } 
    
    public String getPhone3() {
    	return this.phone3;
    } 
    
    public String getDOB() {
    	return this.dob;
    } 
    
    public String getGovtId() {
    	return this.govtId;
    } 
    
    public String getGeneticGender() {
    	return this.geneticGender;
    } 
    
    public String getGenderId() {
    	return this.genderId;
    } 
    
    public String getEthnicity() {
    	return this.ethnicity;
    } 
    
    public long getEventId() {
    	return this.eventId;
    } 
	
    public void setPatientId(String patientID) {
    	this.patientId = patientID;
    } 
    
    public void setMRN(String mrn) {
    	this.mrn = mrn;
    } 
    public void setSiteId(String siteId) {
    	this.siteId = siteId;
    } 
    
    public void setSQID(String sqId) {
    	this.sqId = sqId;
    } 
    
    public void setFirstName(String firstName) {
    	this.firstName = firstName;
    } 
    
    public void setMiddleName(String middleName) {
    	this.middleName = middleName;
    } 
    
    public void setLastName(String lastName) {
    	this.lastName = lastName;
    } 
    
    public void setStatus(String status) {
    	this.status = status;
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
    
    public void setPostalCode(String postalCode) {
    	this.postalCode = postalCode;
    } 
    
    public void setCountry(String country) {
    	this.country = country;
    } 
    
    public void setEmail(String email) {
    	this.email = email;
    } 
    
    public void setPhone1CountryCode(String phone1CountryCode) {
    	this.phone1CountryCode = phone1CountryCode;
    } 
    
    public void setPhone1(String phone1) {
    	this.phone1 = phone1;
    } 
    
    public void setPhone2CountryCode(String phone2CountryCode) {
    	this.phone2CountryCode = phone2CountryCode;
    } 
    
    public void setPhone2(String phone2) {
    	this.phone2 = phone2;
    } 
    
    public void setPhone3CountryCode(String phone3CountryCode) {
    	this.phone3CountryCode = phone3CountryCode;
    } 
    
    public void setPhone3(String phone3) {
    	this.phone3 = phone3;
    } 
    
	public void setDOB(String dob) {
		this.dob = dob;

		try {
			this.sqlDOB = java.sql.Date.valueOf(this.dob);
		} catch (Exception ex) {
			
		}
	}
    
    public void setGovtId(String govtId) {
    	this.govtId = govtId;
    } 
    
    public void setGeneticGender(String geneticGender) {
    	this.geneticGender = geneticGender;
    } 
    
    public void setGenderId(String genderId) {
    	this.genderId = genderId;
    } 
    
    public void setEthnicity(String ethnicity) {
    	this.ethnicity = ethnicity;
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
		
		String sql = "";
		
		PreparedStatement ps = null;
		
		if (!loadFromDB()) {
		
			sql = "INSERT INTO patients (patientId, sqId, firstName, middleName, lastName, status, address1, address2, city, state, " 
					+ "postalCode, country, email, phone1CountryCode, phone1, phone2CountryCode, phone2,  phone3CountryCode, "
					+ " phone3, dob, govtId, geneticGender, genderId, ethnicity, eventId) "
					+ "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);";
			
			this.eventId = sw.eventId;
			
			ps = conn.prepareStatement(sql);
			
			ps.setString(1, this.patientId);
			ps.setString(2, this.sqId);
			ps.setString(3, this.firstName);
			ps.setString(4, this.middleName);
			ps.setString(5, this.lastName);
			ps.setString(6, this.status);
			ps.setString(7, this.address1);
			ps.setString(8, this.address2);
			ps.setString(9, this.city);
			ps.setString(10, this.state);
			ps.setString(11, this.postalCode);
			ps.setString(12, this.country);
			ps.setString(13, this.email);
			ps.setString(14, this.phone1CountryCode);
			ps.setString(15, this.phone1);
			ps.setString(16, this.phone2CountryCode);
			ps.setString(17, this.phone2);
			ps.setString(18, this.phone3CountryCode);
			ps.setString(19, this.phone3);
			ps.setDate(20, this.sqlDOB);
			ps.setString(21, this.govtId);
			ps.setString(22, this.geneticGender);
			ps.setString(23, this.genderId);
			ps.setString(24, this.ethnicity);
			ps.setLong(25, this.eventId);
			
			ps.executeUpdate();
		} else {
			sql = "UPDATE patients SET sqId = ?, firstName = ?, middleName = ?, lastName = ?, status = ?, address1 = ?, address2 = ?, city = ?, state = ?, " 
					+ "postalCode = ?, country = ?, email = ?, phone1CountryCode = ?, phone1 = ?, phone2CountryCode = ?, phone2 = ?,  phone3CountryCode = ?, "
					+ " phone3 = ?, dob = ?, govtId = ?, geneticGender = ?, genderId = ?, ethnicity = ?, eventId = ? "
					+ " WHERE patientId = ?";
			
			this.eventId = sw.eventId;
			
			ps = conn.prepareStatement(sql);
			
			ps.setString(1, this.sqId);
			ps.setString(2, this.firstName);
			ps.setString(3, this.middleName);
			ps.setString(4, this.lastName);
			ps.setString(5, this.status);
			ps.setString(6, this.address1);
			ps.setString(7, this.address2);
			ps.setString(8, this.city);
			ps.setString(9, this.state);
			ps.setString(10, this.postalCode);
			ps.setString(11, this.country);
			ps.setString(12, this.email);
			ps.setString(13, this.phone1CountryCode);
			ps.setString(14, this.phone1);
			ps.setString(15, this.phone2CountryCode);
			ps.setString(16, this.phone2);
			ps.setString(17, this.phone3CountryCode);
			ps.setString(18, this.phone3);
			ps.setDate(19, this.sqlDOB);
			ps.setString(20, this.govtId);
			ps.setString(21, this.geneticGender);
			ps.setString(22, this.genderId);
			ps.setString(23, this.ethnicity);
			ps.setLong(24, this.eventId);
			ps.setString(25, this.patientId);
			
			ps.executeUpdate();
		}
		
		sql = "UPDATE patientSources SET master = 0 WHERE patientId = ?";
		
		ps = conn.prepareStatement(sql);
		
		ps.setString(1, this.patientId);
		
		ps.executeUpdate();
		
		sql = "INSERT INTO patientSources (patientId, sqId, firstName, middleName, lastName, status, address1, address2, city, state, " 
				+ "postalCode, country, email, phone1CountryCode, phone1, phone2CountryCode, phone2,  phone3CountryCode, "
				+ " phone3, dob, govtId, geneticGender, genderId, ethnicity, eventId, master, mrn, siteId) "
				+ "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);";
		
		ps = conn.prepareStatement(sql, PreparedStatement.RETURN_GENERATED_KEYS);
		
		ps.setString(1, this.patientId);
		ps.setString(2, this.sqId);
		ps.setString(3, this.firstName);
		ps.setString(4, this.middleName);
		ps.setString(5, this.lastName);
		ps.setString(6, this.status);
		ps.setString(7, this.address1);
		ps.setString(8, this.address2);
		ps.setString(9, this.city);
		ps.setString(10, this.state);
		ps.setString(11, this.postalCode);
		ps.setString(12, this.country);
		ps.setString(13, this.email);
		ps.setString(14, this.phone1CountryCode);
		ps.setString(15, this.phone1);
		ps.setString(16, this.phone2CountryCode);
		ps.setString(17, this.phone2);
		ps.setString(18, this.phone3CountryCode);
		ps.setString(19, this.phone3);
		ps.setDate(20, this.sqlDOB);
		ps.setString(21, this.govtId);
		ps.setString(22, this.geneticGender);
		ps.setString(23, this.genderId);
		ps.setString(24, this.ethnicity);
		ps.setLong(25, this.eventId);
		ps.setLong(26, 1);
		ps.setString(27, this.mrn);
		ps.setString(28, this.siteId);
		
		ps.executeUpdate();
		
		PatientSource psrc = new PatientSource();
		
		psrc.patientId = this.patientId;
		psrc.sqId = this.sqId;
		psrc.firstName = this.firstName;
		psrc.middleName = this.middleName;
		psrc.lastName = this.lastName;
		psrc.status = this.status;
		psrc.address1 = this.address1;
		psrc.address2 = this.address2;
		psrc.state = this.state;
		psrc.state = this.state;
		psrc.postalCode = this.postalCode;
		psrc.country = this.country;
		psrc.email = this.email;
		psrc.phone1CountryCode = this.phone1CountryCode;
		psrc.phone1 = this.phone1;
		psrc.phone2CountryCode = this.phone2CountryCode;
		psrc.phone2 = this.phone2;
		psrc.phone3CountryCode = this.phone3CountryCode;
		psrc.phone3 = this.phone3;
		psrc.dob = this.dob;
		psrc.govtId = this.govtId;
		psrc.geneticGender = this.geneticGender;
		psrc.genderId = this.genderId;
		psrc.ethnicity = this.ethnicity;
		psrc.eventId = this.eventId;
		psrc.mrn = this.mrn;
		psrc.siteId = this.siteId;
		
		ResultSet rs = ps.getGeneratedKeys();
		
		rs.next();
		
		patientSources.put(rs.getLong(1), psrc);
		
		loadFromDB();
	}
	
	/**
	 *Checks to see if the record exists in the database.  Loads the object with the data if it does.
	 * 
	 * @return
	 * @throws SQLException
	 */
	public boolean loadFromDB() throws SQLException {
		
		this.exists = false;
		
		if (this.patientId != null) {
			String sql = "SELECT sqId, firstName, middleName, lastName, status, address1, address2, city, state, " 
					+ "postalCode, country, email, phone1CountryCode, phone1, phone2CountryCode, phone2,  phone3CountryCode, "
					+ " phone3, dob, govtId, geneticGender, genderId, ethnicity, eventId "
					+ "FROM patients WHERE patientID = ? "
					+ "ORDER BY id";
			
			PreparedStatement ps = conn.prepareStatement(sql);
			
			ps.setString(1, this.patientId);
			
			ResultSet rs = ps.executeQuery();
			
			if (rs.next()) {
				this.exists = true;
				
				this.sqId = (this.sqId == null ? rs.getString(1) : this.sqId);
				this.firstName = (this.firstName == null ? rs.getString(2) : this.firstName);
				this.middleName = (this.middleName == null ? rs.getString(3) : this.middleName);
				this.lastName = (this.lastName == null ? rs.getString(4) : this.lastName);
				this.status = (this.status == null ? rs.getString(5) : this.status);
				this.address1 = (this.address1 == null ? rs.getString(6) : this.address1);
				this.address2 = (this.address2 == null ? rs.getString(7) : this.address2);
				this.city = (this.city == null ? rs.getString(8) : this.city);
				this.state = (this.state == null ? rs.getString(9) : this.state);
				this.postalCode = (this.postalCode == null ? rs.getString(10) : this.postalCode);
				this.country = (this.country == null ? rs.getString(11) : this.country);
				this.email = (this.email == null ? rs.getString(12) : this.email);
				this.phone1CountryCode = (this.phone1CountryCode == null ? rs.getString(13) : this.phone1CountryCode);
				this.phone1 = (this.phone1 == null ? rs.getString(14) : this.phone1);
				this.phone2CountryCode = (this.phone2CountryCode == null ? rs.getString(15) : this.phone2CountryCode);
				this.phone2 = (this.phone2 == null ? rs.getString(16) : this.phone2);
				this.phone3CountryCode = (this.phone3CountryCode == null ? rs.getString(17) : this.phone3CountryCode);
				this.phone3 = (this.phone3 == null ? rs.getString(18) : this.phone3);
				setDOB((this.dob == null ? new SimpleDateFormat("yyyy-MM-dd").format(rs.getDate(19)) : this.dob));
				this.govtId = (this.govtId == null ? rs.getString(20) : this.govtId);
				this.geneticGender = (this.geneticGender == null ? rs.getString(21) : this.geneticGender);
				this.genderId = (this.genderId == null ? rs.getString(22) : this.genderId);
				this.ethnicity = (this.ethnicity == null ? rs.getString(23) : this.ethnicity);
				this.eventId = rs.getLong(24);
			}
			
			rs.close();
			ps.close();
			
			sql = "SELECT sqId, firstName, middleName, lastName, status, address1, address2, city, state, " 
					+ "postalCode, country, email, phone1CountryCode, phone1, phone2CountryCode, phone2,  phone3CountryCode, "
					+ " phone3, dob, govtId, geneticGender, genderId, ethnicity, eventId, master, id, siteId, mrn, mrnType, mrnFacility "
					+ "FROM patientSources WHERE patientID = ? "
					+ "ORDER BY id";
			
			ps = conn.prepareStatement(sql);
			
			ps.setString(1, this.patientId);
			
			rs = ps.executeQuery();
			this.patientSources = new LinkedHashMap<Long, PatientSource>();
			
			while (rs.next()) {
				
				PatientSource pSrc = new PatientSource();
				
				pSrc.sqId = rs.getString(1);
				pSrc.firstName = rs.getString(2);
				pSrc.middleName = rs.getString(3);
				pSrc.lastName = rs.getString(4);
				pSrc.status = rs.getString(5);
				pSrc.address1 = rs.getString(6);
				pSrc.address2 = rs.getString(7);
				pSrc.city = rs.getString(8);
				pSrc.state =  rs.getString(9);
				pSrc.postalCode = rs.getString(10);
				pSrc.country = rs.getString(11);
				pSrc.email = rs.getString(12);
				pSrc.phone1CountryCode = rs.getString(13);
				pSrc.phone1 = rs.getString(14);
				pSrc.phone2CountryCode = rs.getString(15);
				pSrc.phone2 = rs.getString(16);
				pSrc.phone3CountryCode = rs.getString(17);
				pSrc.phone3 = rs.getString(18);
				pSrc.dob = rs.getString(19);
				pSrc.govtId = rs.getString(20);
				pSrc.geneticGender = rs.getString(21);
				pSrc.genderId = rs.getString(22);
				pSrc.ethnicity = rs.getString(23);
				pSrc.eventId = rs.getLong(24);
				pSrc.master = rs.getLong(25);
				long id = rs.getLong(26);
				pSrc.siteId = rs.getString(27);
				pSrc.mrn = rs.getString(28);
				pSrc.mrnType = rs.getString(29);
				pSrc.mrnFacility = rs.getString(30);
				
				this.patientSources.put(id, pSrc);
			}
			
			rs.close();
			ps.close();
		}
		
		return this.exists;
	}	
	public boolean SearchByMRN(String mrn, String facility) throws SQLException{

		String sql = "SELECT p.patientId, ps.assigningAuthority, ps.mrnFacility "
					+ "FROM patients p INNER JOIN patientSources ps ON p.patientId = ps.patientId WHERE ps.mrn = ?";
		if (!facility.isEmpty()){
			sql = sql + " AND ps.mrnFacility = ?";
		}
		sql += " ORDER BY p.id";
		PreparedStatement ps = conn.prepareStatement(sql);
		ps.setString(1, mrn);
		if (!facility.isEmpty()){
			ps.setString(2, facility);
		}
		ResultSet rs = ps.executeQuery();

		this.patientId = "";
		while (rs.next()){
			if (!patientId.isEmpty()){
				if (!this.patientId.equals(rs.getString(1))){
					//bad, nonunique patient
					throw new SQLException("Multiple matching patients");
				}
			}
			this.patientId = rs.getString(1);
		}
		//found patient now we can load the patient normally
		loadFromDB();

		return this.exists;
	}
	public boolean SearchByMRN(String mrn) throws SQLException{
		SearchByMRN(mrn, "");
		return this.exists;
	}
}
