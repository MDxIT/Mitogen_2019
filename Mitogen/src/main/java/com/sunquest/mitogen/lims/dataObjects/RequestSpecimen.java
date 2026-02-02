package com.sunquest.mitogen.lims.dataObjects;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import com.uniconnect.uniflow.Switchboard;

/**
 * Class to manage specimens across the related tables
 * 
 * @author szczepam
 *
 */
public class RequestSpecimen {
		private String requestId;
		private String patientId;
		private String expectedBarcode;
		private String externalIdentifier;
		private String specimenType;
		private String specimenSource;
		private String collectionDate;
		private String collectionTime;
		private String specimenId;
		private String receivedDate;
		private String specimenQuantity;
		private String specimenQuantityUnits;
		private String specimenCondition;
		private String status;
		private long id = -1;
		private long eventId = -1;
		private boolean exists;
		private Switchboard sw;
		
		/**
		 * Instantiates a RequestSpecimen object with a request and patient Id.
		 * Loads the object with data if it exists in the database
		 * 
		 * @param patientId
		 * @param sw
		 * @throws SQLException
		 */
		public RequestSpecimen(String requestId, String patientId, Switchboard sw) {
			this.requestId = requestId;
			this.patientId = patientId;
			this.sw = sw;
		}
		
		//TODO: Add instantiation and loading from a specimenId
		
		public String getRequestId() {
			return this.requestId;
		}
		
		public String getPatientId() {
			return this.patientId;
		}
		
		public String getExpectedBarcode() {
			return this.expectedBarcode;
		}
		
		public String getExternalIdentifier() {
			return this.externalIdentifier;
		}
		
		public String getSpecimenType() {
			return this.specimenType;
		}
		
		public String getSpecimenSource() {
			return this.specimenSource;
		}
		
		public String getCollectionDate() {
			return this.collectionDate;
		}
		
		public String getCollectionTime() {
			return this.collectionTime;
		}
		
		public String getSpecimenId() {
			return this.specimenId;
		}
		
		public String getReceivedDate() {
			return this.receivedDate;
		}
		
		public String getSpecimenQuantity() {
			return this.specimenQuantity;
		}
		
		public String getSpecimenQuantityUnits() {
			return this.specimenQuantityUnits;
		}
		
		public String getSpecimenCondition() {
			return this.specimenCondition;
		}
		
		public String getStatus() {
			return this.status;
		}
		
		public long getEventId() {
			return this.eventId;
		}
		
		public void setRequestId(String requestId) {
			this.requestId = requestId;
		}
		
		public void setPatientId(String patientId) {
			this.patientId = patientId;
		}
		
		public void setExpectedBarcode(String expectedBarcode) {
			this.expectedBarcode = expectedBarcode;
		}
		
		public void setExternalIdentifier(String externalIdentifier) {
			this.externalIdentifier = externalIdentifier;
		}
		
		public void setSpecimenType(String specimenType) {
			this.specimenType = specimenType;
		}
		
		public void setSpecimenSource(String specimenSource) {
			this.specimenSource = specimenSource;
		}
		
		public void setCollectionDate(String collectionDate) {
			this.collectionDate = collectionDate;
		}
		
		public void setCollectionTime(String collectionTime) {
			this.collectionTime = collectionTime;
		}
		
		public void setSpecimenId(String specimenId) {
			this.specimenId = specimenId;
		}
		
		public void setReceivedDate(String receivedDate) {
			this.receivedDate = receivedDate;
		}
		
		public void setSpecimenQuantity(String specimenQuantity) {
			this.specimenQuantity = specimenQuantity;
		}
		
		public void setSpecimenQuantityUnits(String specimenQuantityUnits) {
			this.requestId = specimenQuantityUnits;
		}
		
		public void setSpecimenCondition(String specimenCondition) {
			this.specimenCondition = specimenCondition;
		}
		
		public void setStatus(String status) {
			this.status = status;
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
			String sql;
			PreparedStatement ps = null;
			
			if (this.specimenId != null && !this.specimenId.isEmpty()) {
				
				sql = "INSERT IGNORE INTO containers (containerId, containerType, accountId, priority, eventId) "
						+ "VALUES (?, 'specimenId', 'MITOGEN', 6, ?)";
				
				 ps = sw.connection.prepareStatement(sql);
				
				ps.setString(1, this.specimenId);
				ps.setLong(2, sw.eventId);
				
				ps.executeUpdate();
				
				if (ps.getUpdateCount() > 0) {
				
					sql = "INSERT INTO contents (containerId, attribute, contentType, content, eventId) "
							+ "VALUES (?, ?, ?, ?, ?)";
					
					ps = sw.connection.prepareStatement(sql);
					
					ps.setString(1,  this.specimenId);
					ps.setString(2, "self");
					ps.setString(3,  "requestId");
					ps.setString(4, this.requestId);
					ps.setLong(5, sw.eventId);
					
					ps.executeUpdate();
					
					ps = sw.connection.prepareStatement(sql);
					
					ps.setString(1,  this.specimenId);
					ps.setString(2, "self");
					ps.setString(3,  "specimenId");
					ps.setString(4, this.specimenId);
					ps.setLong(5, sw.eventId);
					
					ps.executeUpdate();
				}
				
				sql = "INSERT INTO containerHistory (containerId, eventId) "
						+ "VALUES (?, ?)";
				
				ps = sw.connection.prepareStatement(sql);
				
				ps.setString(1,  this.specimenId);
				ps.setLong(2, sw.eventId);
				
				ps.executeUpdate();
			
			}
			
			
			if (id == -1) {
				
				this.eventId = sw.eventId;
				
				sql = "INSERT INTO requestSpecimens (requestId, patientId, expectedBarcode, externalIdentifier, specimenType, "
						+ " specimenSource, collectionDate, collectionTime, specimenId, receivedDate, specimenQuantity, " 
						+ " specimenQuantityUnits, specimenCondition, status, eventId) "
						+ "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);";
				
				ps = sw.connection.prepareStatement(sql, PreparedStatement.RETURN_GENERATED_KEYS);
				
				ps.setString(1, this.requestId);
				ps.setString(2, this.patientId);
				ps.setString(3, this.expectedBarcode);
				ps.setString(4, this.externalIdentifier);
				ps.setString(5, this.specimenType);
				ps.setString(6, this.specimenSource);
				ps.setString(7, this.collectionDate);
				ps.setString(8, this.collectionTime);
				ps.setString(9, this.specimenId);
				ps.setString(10, this.receivedDate);
				ps.setString(11, this.specimenQuantity);
				ps.setString(12, this.specimenQuantityUnits);
				ps.setString(13, this.specimenCondition);
				ps.setString(14, this.status);
				ps.setLong(15, this.eventId);
				
				ps.executeUpdate();
				
				ResultSet rs = ps.getGeneratedKeys();
				
				rs.next();
				
				this.id = rs.getLong(1);
				
				rs.close();
				
				this.exists = true;
			} else {
				sql = "UPDATE requestSpecimens SET requestId = ? AND patientId = ? AND expectedBarcode = ?, externalIdentifier = ?, "
						+ "specimenType = ?, specimenSource = ?, collectionDate = ?, collectionTime = ?, specimenId = ?, " 
						+ "receivedDate = ?, specimenQuantity = ?,  specimenQuantityUnits = ?, specimenCondition = ?, status = ?, eventId = ? "
						+ "WHERE  id = ?";
				
				this.eventId = sw.eventId;
				
				ps = sw.connection.prepareStatement(sql);
				
				ps.setString(1, this.requestId);
				ps.setString(2, this.patientId);
				ps.setString(3, this.expectedBarcode);
				ps.setString(4, this.externalIdentifier);
				ps.setString(5, this.specimenType);
				ps.setString(6, this.specimenSource);
				ps.setString(7, this.collectionDate);
				ps.setString(8, this.collectionTime);
				ps.setString(9, this.specimenId);
				ps.setString(10, this.receivedDate);
				ps.setString(11, this.specimenQuantity);
				ps.setString(12, this.specimenQuantityUnits);
				ps.setString(13, this.specimenCondition);
				ps.setString(14, this.status);
				ps.setLong(15, this.eventId);
				ps.setLong(16,  this.id);
				
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
			String sql = "SELECT externalIdentifier, specimenType, specimenSource, collectionDate, collectionTime, "
					+ "specimenId, receivedDate, specimenQuantity, specimenQuantityUnits, specimenCondition, status, eventId, "
					+ "id, requestId, patientId, expectedBarcode ";
			
			if (this.id == -1) {
				sql += "FROM requestSpecimens WHERE requestId = ? AND patientId = ? ";
				if (this.specimenId != null) {
					sql += "AND specimenId = ?";
				}
				if (this.expectedBarcode != null) {
					sql += "AND expectedBarcode = ?";
				}
			} else {
				sql += "FROM requestSpecimens WHERE id = ?";
			}
			sql += " ORDER BY id";
			
			PreparedStatement ps = sw.connection.prepareStatement(sql);
			
			if (this.id == -1) {
				ps.setString(1, this.requestId);
				ps.setString(2, this.patientId);
				if (this.specimenId != null) {
					ps.setString(3, this.specimenId);
				}
				if (this.expectedBarcode != null) {
					ps.setString(ps.getParameterMetaData().getParameterCount(), this.expectedBarcode);
				}
			} else {
				ps.setString(1, this.patientId);
			}
			
			
			ResultSet rs = ps.executeQuery();
			
			if (rs.next()) {
				this.exists = true;
				
				this.externalIdentifier = (this.externalIdentifier == null ? rs.getString(1) : this.externalIdentifier);
				this.specimenType = (this.specimenType == null ? rs.getString(2) : this.specimenType);
				this.specimenSource = (this.specimenSource == null ? rs.getString(3) : this.specimenSource);
				this.collectionDate = (this.collectionDate == null ? rs.getString(4) : this.collectionDate);
				this.collectionTime = (this.collectionTime == null ? rs.getString(5) : this.collectionTime);
				this.specimenId = (this.specimenId == null ? rs.getString(6) : this.specimenId);
				this.receivedDate = (this.receivedDate == null ? rs.getString(7) : this.receivedDate);
				this.specimenQuantity = (this.specimenQuantity == null ? rs.getString(8) : this.specimenQuantity);
				this.specimenQuantityUnits = (this.specimenQuantityUnits == null ? rs.getString(9) : this.specimenQuantityUnits);
				this.specimenCondition = (this.specimenCondition == null ? rs.getString(10) : this.specimenCondition);
				this.status = (this.status == null ? rs.getString(11) : this.status);
				this.eventId = rs.getLong(12);
				this.id = rs.getLong(13);
			}
			
			rs.close();
			ps.close();
			
			return this.exists;
		}
	}
