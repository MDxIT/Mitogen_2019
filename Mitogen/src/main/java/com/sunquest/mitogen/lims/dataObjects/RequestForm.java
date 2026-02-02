package com.sunquest.mitogen.lims.dataObjects;

import java.sql.Connection;
import java.sql.Date;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.LinkedList;
import java.util.List;

import com.uniconnect.uniflow.Switchboard;


/**
 * Object to manage the contents of the "requestForms" table
 * 
 * @author szczepam
 *
 */


public class RequestForm {

	private long id;
	private String requestId;
	private String placerOrderId;
	private String sendingApp;
	private String sendingFacility;
	private String patientId;
	private String physicianId;
	private String physicianSiteId;
	private String type;
	private String mrn;
	private String mrnType;
	private String mrnFacility;
	private String locationId;
	private String departmentId;
	private long consent;
	private String consentBy;
	private String consenteePatientRelationship;
	private long clinicalTrial;
	private long workersComp;
	private long patientSignature;
	private String patientSignatureDate;
	private long physicianSignature;
	private String physicianSignatureDate;
	private String physicianComment;
	private long priority;
	private long eventId = -1;
	private String receivedDate;
	private String externalRequestId;
	private String externalOrderId;
	private String externalSystem;
	private String accountNumber;
	private String encounterNumber;
	private String status;
	private String statusEventId;
	private String addTest;
	private String addTestParentRequestId;
	
	private String panelCode;

	private Date sqlReceivedDate;
	private boolean exists;
	private Switchboard sw;
	private Connection conn;
	
	
	/**
	 * Instantiates a RequestForm object with a request Id.
	 * Loads the object with data if it exists in the database
	 * 
	 * @param requestId
	 * @param sw
	 * @throws SQLException
	 */
	public RequestForm (String requestId, Switchboard sw) throws SQLException{
		this.sw = sw;
		this.conn = sw.connection;
		this.requestId = requestId;
		loadFromDB();
	}
	public RequestForm (Connection conn){
		this.conn = conn;
	}
	public Long getId() {
		return this.id;
	}
	public String getRequestId() {
		return this.requestId;
	}
	public String getPlacerOrderId() {
		return this.placerOrderId;
	}
	public String getSendingApp() {
		return this.sendingApp;
	}
	public String getSendingFacility() {
		return this.sendingFacility;
	}
	public String getPatientId() {
		return this.patientId;
	}
	public String getPhysicianId() {
		return this.physicianId;
	}
	public String getPhysicianSiteId() {
		return this.physicianSiteId;
	}
	public String getType() {
		return this.type;
	}
	public String getMRN() {
		return this.mrn;
	}
	public String getMRNType() {
		return this.mrnType;
	}
	public String getMRNFacility() {
		return this.mrnFacility;
	}
	public String getLocationId() {
		return this.locationId;
	}
	public String getDepartmentId() {
		return this.departmentId;
	}
	public long getConsent() {
		return this.consent;
	}
	public String getConsentBy() {
		return this.consentBy;
	}
	public String getConsenteePatientRelationship() {
		return this.consenteePatientRelationship;
	}
	public long getClinicalTrial() {
		return this.clinicalTrial;
	}
	public long getWorkersComp() {
		return this.workersComp;
	}
	public long getPatientSignature() {
		return this.patientSignature;
	}
	public String getPatientSignatureDate() {
		return this.patientSignatureDate;
	}
	public long getPhysicianSignature() {
		return this.physicianSignature;
	}
	public String getPhysicianSignatureDate() {
		return this.physicianSignatureDate;
	}
	public String getPhysicianComment() {
		return this.physicianComment;
	}
	public long getPriority() {
		return this.priority;
	}
	public long getEventId() {
		return this.eventId;
	}
	public String getReceivedDate() {
		return this.receivedDate;
	}
	public String getExternalRequestId() {
		return this.externalRequestId;
	}
	public String getExternalOrderId() {
		return this.externalOrderId;
	}
	public String getExternalSystem() {
		return this.externalSystem;
	}
	public String getAccountNumber() {
		return this.accountNumber;
	}
	public String getEncounterNumber() {
		return this.encounterNumber;
	}
	public String getStatus() {
		return this.status;
	}
	public String getStatusEventId() {
		return this.statusEventId;
	}
	public String getAddTest() {
		return this.addTest;
	}
	public String getAddTestParentRequestId() {
		return this.addTestParentRequestId;
	}

	public String getPanelCode() {
		return this.panelCode;
	}
	
	public void setRequestId(String requestId) {
		this.requestId = requestId;
	}
	
	public void setPhysicianId(String physicianId) {
		this.physicianId = physicianId;
	}
	
	public void setPhysicianSiteId(String physicianSiteId) {
		this.physicianSiteId = physicianSiteId;
	}
	
	public void setPatientId(String patientId) {
		this.patientId = patientId;
	}
	
	public void setMRN(String mrn) {
		this.mrn = mrn;
	}
	
	public void setPriority(long priority) {
		this.priority = priority;
	}
	
	public void setReceivedDate(String receivedDate) {
		this.receivedDate = receivedDate;
		
		try {
			this.sqlReceivedDate = java.sql.Date.valueOf(this.receivedDate);
		} catch (Exception ex) {
			
		}
	}
	
	public void setLocationId(String locationId) {
		this.locationId = locationId;
	}
	
	public void setDepartmentId(String departmentId) {
		this.departmentId = departmentId;
	}
	
	public void setExternalRequestId(String externalRequestId) {
		this.externalRequestId = externalRequestId;
	}
	
	public void setExternalSystem(String externalSystem) {
		this.externalSystem = externalSystem;
	}
	
	public void setType(String type) {
		this.type = type;
	}
	
	public void setConsent(long consent) {
		this.consent = consent;
	}
	
	public void setClinicalTrial(long clinicalTrial) {
		this.clinicalTrial = clinicalTrial;
	}
	
	public void setWorkersComp(long workersComp) {
		this.workersComp = workersComp;
	}
	
	public void setPatientSignature(long patientSignature) {
		this.patientSignature = patientSignature;
	}
	
	public void setPhysicianSignature(long physicianSignature) {
		this.physicianSignature = physicianSignature;
	}
	
	public void setPanelCode(String panelCode) {
		this.panelCode = panelCode;
	}
	
	public boolean recordExists() throws SQLException {
		return loadFromDB();
	}
	
	/**
	 * Saves or updates the database record
	 * 
	 * @throws SQLException
	 */
	public void save() throws SQLException{
		
		this.eventId = sw.eventId;
		loadFromDB();
		
		if (!exists) {
			
			String sql = "INSERT INTO containers (containerId, containerType, eventId) VALUE (?,?,?)";
			
			PreparedStatement ps = conn.prepareStatement(sql);
			
			ps.setString(1, this.requestId);
			ps.setString(2, "requestId");
			ps.setLong(3, this.eventId);
			
			ps.executeUpdate();
			
			sql = "INSERT INTO containerHistory (containerId, eventId) VALUE (?,?)";
			
			ps = conn.prepareStatement(sql);
			
			ps.setString(1, this.requestId);
			ps.setLong(2, this.eventId);
			
			ps.executeUpdate();
			
			sql = "INSERT INTO requestForms (requestId, physicianId, physicianSiteId, priority, receivedDate, "
					+ "locationId, departmentId, eventId, externalRequestId, externalSystem, type, consent, "
					+ " clinicalTrial, workersComp, patientSignature, physicianSignature, patientId, mrn) "
					+ "VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
			
			ps = conn.prepareStatement(sql);
			
			
			ps.setString(1, this.requestId);
			ps.setString(2, this.physicianId);
			ps.setString(3, this.physicianSiteId);
			ps.setLong(4, this.priority);
			ps.setString(5, this.receivedDate);
			ps.setString(6, this.locationId);
			ps.setString(7, this.departmentId);
			ps.setLong(8, this.eventId);
			ps.setString(9, this.externalRequestId);
			ps.setString(10, this.externalSystem);
			ps.setString(11, this.type);
			ps.setLong(12, this.consent);
			ps.setLong(13, this.clinicalTrial);
			ps.setLong(14, this.workersComp);
			ps.setLong(15, this.patientSignature);
			ps.setLong(16, this.physicianSignature);
			ps.setString(17, this.patientId);
			ps.setString(18, this.mrn);
			
			ps.executeUpdate();
			
			sql = "INSERT IGNORE INTO reqPanels (requestId, panelCode, eventId) "
					+ " VALUES (?,?,?)";
			
			ps = conn.prepareStatement(sql);
			
			ps.setString(1, this.requestId);
			ps.setString(2, this.panelCode);
			ps.setLong(3, this.eventId);
			
			ps.executeUpdate();
			
			sql = "DELETE FROM queues WHERE (step = ? AND containerId = ?)";
			
			ps = conn.prepareStatement(sql);
			
			ps.setString(1, "Order Review");
			ps.setString(2, this.requestId);
			
			ps.executeUpdate();
			
			sql = "INSERT INTO queues (containerId, step, eventId) VALUES (?,?,?) ";
			
			ps = conn.prepareStatement(sql);
			
			ps.setString(1, this.requestId);
			ps.setString(2, "Order Review");
			ps.setLong(3, this.eventId);
			
			ps.executeUpdate();
		} else {
			//TODO: Make update functionality more comprehensive
			
			String sql = "UPDATE requestForms SET physicianId = ?, physicianSiteId = ?, priority = ?, receivedDate = ?, "
					+ "locationId = ?, departmentId = ?, eventId = ?, externalRequestId = ?, externalSystem = ?, type = ?, consent = ?, "
					+ " clinicalTrial = ?, workersComp = ?, patientSignature = ?, physicianSignature = ?, patientId = ?, mrn = ? "
					+ "WHERE requestId = ?";
			
			PreparedStatement ps = conn.prepareStatement(sql);
			
			ps.setString(1, this.physicianId);
			ps.setString(2, this.physicianSiteId);
			ps.setLong(3, this.priority);
			ps.setDate(4, this.sqlReceivedDate);
			ps.setString(5, this.locationId);
			ps.setString(6, this.departmentId);
			ps.setLong(7, this.eventId);
			ps.setString(8, this.externalRequestId);
			ps.setString(9, this.externalSystem);
			ps.setString(10, this.type);
			ps.setLong(11, this.consent);
			ps.setLong(12, this.clinicalTrial);
			ps.setLong(13, this.workersComp);
			ps.setLong(14, this.patientSignature);
			ps.setLong(15, this.physicianSignature);
			ps.setString(16, this.patientId);
			ps.setString(17, this.mrn);
			ps.setString(18, this.requestId);
			
			ps.executeUpdate();
			
			sql = "INSERT INTO containerHistory (containerId, eventId) VALUE (?,?)";
			
			ps = conn.prepareStatement(sql);
			
			ps.setString(1, this.requestId);
			ps.setLong(2, this.eventId);
			
			ps.executeUpdate();
		}
	}
	
	/**
	 *Checks to see if the record exists in the database.  Loads the object with the data if it does.
	 * 
	 * @return
	 * @throws SQLException
	 */
	public boolean loadFromDB() throws SQLException{
		this.exists = false;
		
		// String sql = "SELECT r.physicianId, r.physicianSiteId, r.priority, r.receivedDate, "
		// 		+ " r.locationId,  r.departmentId,  r.eventId,  r.externalRequestId,  r.externalSystem, "
		// 		+ " r.type, r.consent, r.clinicalTrial,  r.workersComp, r.patientSignature, r.physicianSignature, p.panelCode, "
		// 		+ "r.id, r.patientId, r.mrn " 
		// 		+ " FROM requestForms r INNER JOIN reqPanels p ON r.requestId = p.requestId WHERE r.requestId = ?";
		
		String sql = "SELECT r.id, r.requestId, r.placerOrderId, r.sendingApp, r.sendingFacility, r.patientId, r.physicianId, " +
			"r.physicianSiteId, r.type, r.mrn, r.mrnType, r.mrnFacility, r.locationId, r.departmentId, r.consent, " +
			"r.consentBy, r.consenteePatientRelationship, r.clinicalTrial, r.workersComp, r.patientSignature," +
			"r.patientSignatureDate, r.physicianSignature, r.physicianSignatureDate, r.physicianComment, r.priority, " +
			"r.eventId, r.receivedDate, r.externalRequestId, r.externalOrderId, r.externalSystem, r.accountNumber, " +
			"r.encounterNumber, r.status, r.statusEventId, r.addTest, r.addTestParentRequestId, p.panelCode " +
			"FROM requestForms r INNER JOIN reqPanels p ON r.requestId = p.requestId " +
			"WHERE r.requestId = ? " +
			"ORDER BY r.id";

		PreparedStatement ps = conn.prepareStatement(sql);
		
		ps.setString(1, this.requestId);
		
		ResultSet rs = ps.executeQuery();
		
		if (rs.next()) {
			this.id = rs.getLong(1);
			this.requestId = rs.getString(2);
			this.placerOrderId = rs.getString(3);
			this.sendingApp = rs.getString(4);
			this.sendingFacility = rs.getString(5);
			this.patientId = rs.getString(6);
			this.physicianId = rs.getString(7);
			this.physicianSiteId = rs.getString(8);
			this.type = rs.getString(9);
			this.mrn = rs.getString(10);
			this.mrnType = rs.getString(11);
			this.mrnFacility = rs.getString(12);
			this.locationId = rs.getString(13);
			this.departmentId = rs.getString(14);
			this.consent = rs.getLong(15);
			this.consentBy = rs.getString(16);
			this.consenteePatientRelationship = rs.getString(17);
			this.clinicalTrial = rs.getLong(18);
			this.workersComp = rs.getLong(19);
			this.patientSignature = rs.getLong(20);
			this.patientSignatureDate = rs.getString(21);
			this.physicianSignature = rs.getLong(22);
			this.physicianSignatureDate = rs.getString(23);
			this.physicianComment = rs.getString(24);
			this.priority = rs.getLong(25);
			this.eventId = rs.getLong(26);
			setReceivedDate(rs.getString(27));
			this.externalRequestId = rs.getString(28);
			this.externalOrderId = rs.getString(29);
			this.externalSystem = rs.getString(30);
			this.accountNumber = rs.getString(31);
			this.encounterNumber = rs.getString(32);
			this.status = rs.getString(33);
			this.statusEventId = rs.getString(34);
			this.addTest = rs.getString(35);
			this.addTestParentRequestId = rs.getString(36);
			this.panelCode = rs.getString(37);
		}
		
		rs.close();
		ps.close();
		
		return this.exists;
	}
	public List<RequestForm> SearchByExternalRequestID(String externalRequestId) throws SQLException{
		List<RequestForm> retVal = new LinkedList<RequestForm>();
		String sql = "SELECT r.requestId " +
				"FROM requestForms r " +
				"WHERE r.externalRequestId = ? " +
				"ORDER BY r.id";
		PreparedStatement ps = conn.prepareStatement(sql);
		ps.setString(1, externalRequestId);
		ResultSet rs = ps.executeQuery();
		while(rs.next()){
			RequestForm rf = new RequestForm(this.conn);
			rf.setRequestId(rs.getString(1));
			rf.loadFromDB();
			retVal.add(rf);
		}
		return retVal;
	}
	public List<RequestForm> SearchByPatientId(String patientId) throws SQLException{
		List<RequestForm> retVal = new LinkedList<RequestForm>();
		String sql = "SELECT r.requestId " +
				"FROM requestForms r " +
				"WHERE r.patientId = ? " +
				"ORDER BY r.id";
		PreparedStatement ps = conn.prepareStatement(sql);
		ps.setString(1, patientId);
		ResultSet rs = ps.executeQuery();
		while(rs.next()){
			RequestForm rf = new RequestForm(this.conn);
			rf.setRequestId(rs.getString(1));
			rf.loadFromDB();
			retVal.add(rf);
		}
		return retVal;
	}
	public List<RequestForm> SearchByMRN(String mrn) throws SQLException{
		List<RequestForm> retVal = new LinkedList<RequestForm>();
		String sql = "SELECT r.requestId " +
				"FROM requestForms r " +
				"WHERE r.mrn = ? " +
				"ORDER BY r.id";
		PreparedStatement ps = conn.prepareStatement(sql);
		ps.setString(1, mrn);
		ResultSet rs = ps.executeQuery();
		while(rs.next()){
			RequestForm rf = new RequestForm(this.conn);
			rf.setRequestId(rs.getString(1));
			rf.loadFromDB();
			retVal.add(rf);
		}
		return retVal;
	}

	//reportedDetails.requestFormsId = row # for requestForms
	public List<RequestForm> SearchByRequestID(String requestId) throws SQLException{
		List<RequestForm> retVal = new LinkedList<RequestForm>();
		String sql = "SELECT r.requestId " +
				"FROM requestForms r " +
				"WHERE r.id = ? " +
				"ORDER BY r.id";
		PreparedStatement ps = conn.prepareStatement(sql);
		ps.setString(1, requestId);
		ResultSet rs = ps.executeQuery();
		while(rs.next()){
			RequestForm rf = new RequestForm(this.conn);
			rf.setRequestId(rs.getString(1));
			rf.loadFromDB();
			retVal.add(rf);
		}
		return retVal;
	}
}
