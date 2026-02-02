package com.sunquest.mitogen.lims.hl7;

import java.sql.Date;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Hashtable;

import org.apache.commons.lang3.StringUtils;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import com.uniconnect.uniflow.Switchboard;


import java.sql.Connection;

import ca.uhn.hl7v2.model.DataTypeException;
import ca.uhn.hl7v2.model.Type;
import ca.uhn.hl7v2.model.v251.datatype.NM;
import ca.uhn.hl7v2.model.v251.datatype.ST;
import ca.uhn.hl7v2.model.v251.datatype.TS;
import ca.uhn.hl7v2.model.v251.datatype.TX;
import ca.uhn.hl7v2.model.v251.segment.ORC;

public class HL7OrderProcessing {
	private static final Logger logger = LogManager.getLogger();
	
	public HL7OrderControlTypes orderControl;
	public String sendingApp;
	public String sendingFacility;
	public String placerOrderNumber;
	public String fillerOrderNumber;
	public String placerGroupNumber;
	public Date dateTimeTransaction;

	public HL7PersonNameInfo orderProvider;
	public String siteId;
	public String orderFacilityCode;

	public String requestId;
	public HL7Patient patient;
	public HL7ObservationRequest observationRequest;
	public ArrayList<HL7Insurance> insuranceList;
	public ArrayList<HL7Specimen> specimenList;
	public ArrayList<HL7DiagnosticCode> diagnosticCodes;
	public ArrayList<HL7Observation> observations;
	public ArrayList<HL7Notes> notes;
	
	private Connection conn;
	public long eventId;
	
	private static final String ORDER_REVIEW_QUEUE_STEP = "Order Review";
	private static final String NOTE_TYPE = "HL7 Order Comment";
	private static final String USER_DEF_PREFIX = "userDef_";
	
	public HL7OrderProcessing(Connection conn, ORC orc, String sendingApp, String sendingFacility, long eventId) throws Exception{
		patient = null;
		observationRequest = null;
		this.eventId = eventId;
		this.conn = conn;
		this.sendingApp = sendingApp;
		this.sendingFacility = sendingFacility;
		insuranceList = new ArrayList<HL7Insurance>();
		requestId = null;
        String orderControlRaw = orc.getOrc1_OrderControl().getValue();
        orderControl = null;
  
        for(HL7OrderControlTypes controlType: HL7OrderControlTypes.values()) {
        	if(controlType.name().equals(orderControlRaw)) {
        		orderControl = controlType;
        		break;
        	}
        }
        
        // Mitogen externalRequestId
        placerOrderNumber = orc.getOrc2_PlacerOrderNumber().getEi1_EntityIdentifier().getValue();
        
        fillerOrderNumber = orc.getOrc3_FillerOrderNumber().getEi1_EntityIdentifier().getValue();
        
        // Mitogen placerOrderId
        placerGroupNumber = orc.getOrc4_PlacerGroupNumber().getEi1_EntityIdentifier().getValue();
        
        try {
            String dateTimeTransactionStr = orc.getOrc9_DateTimeOfTransaction().getTime().getValue();
            if(dateTimeTransactionStr != null && !dateTimeTransactionStr.isEmpty()) {
                dateTimeTransaction = new Date(orc.getOrc9_DateTimeOfTransaction().getTime().getValueAsDate().getTime());
            }
		} catch (DataTypeException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
        
        
        // NOTE: Use OBR16 if it exists.
        orderProvider = new HL7PersonNameInfo(orc.getOrc12_OrderingProvider(0));
        orderFacilityCode = orc.getOrc21_OrderingFacilityName(0).getXon1_OrganizationName().getValue();
        if (orderFacilityCode == null) {
          throw new RequiredFieldNotFoundException("Ordering Facility Code","ORC.21.1");
        }
        
        String sql = "select siteId from organizationSites where siteCode = ?";
        PreparedStatement ps = conn.prepareStatement(sql);
        ps.setString(1, orderFacilityCode);
        logger.info(ps.toString());
        ResultSet rs = ps.executeQuery();
        if(rs.next()) {
          siteId = rs.getString(1);
          rs.close();
          ps.close();          
        }else
          throw new Exception("Could not find siteCode: "+orderFacilityCode);         
	}
	
	
	/**
	 * Process HL7Order to database.
	 * 	Inserts or updates requestForm, physician, physicianSites.
	 *  Adds panel to requestForm and sets up patient billing.
	 * @throws Exception
	 */
	public void processOrderToDb() throws Exception {
        String sql;
        PreparedStatement ps;
        ResultSet rs;
        
        // Get orderProvider data from OBR first then ORC
        HL7PersonNameInfo orderProvider = this.orderProvider;
        if(observationRequest.orderProvider.id != null && observationRequest != null) {
        	logger.info("Using OBR order provider info");
        	orderProvider = observationRequest.orderProvider;
        }
        
    	processOrderProviderToDb(orderProvider);
    	
    	
    	logger.info("Order control type: " + orderControl);
        switch(orderControl) {
        	// New Order
        	case NW:
	            // Get RequestId and add it to containers
	            requestId = Switchboard.generateNextInSequenceWPrefix("requestId");
	            setupContainerId(requestId, "requestId");

	            sql = "INSERT INTO requestForms (type, consent, clinicalTrial, workersComp, patientSignature, "
	            		+ "physicianSignature, requestId, patientId, physicianId, physicianSiteId, receivedDate, eventId, "
	            		+ "sendingApp, sendingFacility, placerOrderId, externalRequestId, mrn, mrnType, mrnFacility, accountNumber) "
	            		+ "VALUES ((SELECT type FROM panels WHERE panelCode = ? LIMIT 1), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
	            ps = conn.prepareStatement(sql);
	            ps.setString(1, observationRequest.panelCode);
	            ps.setInt(2, 0);
	            ps.setInt(3, 0);
	            ps.setInt(4, 0);
	            ps.setInt(5, 0);
	            ps.setInt(6, 0);
	            ps.setString(7, requestId);
	            ps.setString(8, patient.patientId);
	            ps.setString(9, orderProvider.internalId);
	            ps.setString(10, siteId);
	            ps.setDate(11, dateTimeTransaction);
	            ps.setLong(12, eventId);
	            ps.setString(13, sendingApp);
	            ps.setString(14, sendingFacility);
	            ps.setString(15, placerGroupNumber);
	            ps.setString(16, placerOrderNumber);
	            ps.setString(17, patient.mrn);
	            ps.setString(18, patient.mrnType);
	            ps.setString(19, patient.mrnAssigningAuthority);
	            ps.setString(20, patient.accountNumber);
	            logger.info(ps.toString());
	            ps.executeUpdate();
	            ps.close();
	            break;
	            
	        // Status Update
        	case SC:
        		
        		// Find internal requestId
        		sql = "SELECT requestId FROM requestForms WHERE externalRequestId = ?";
        	
        		ps = conn.prepareStatement(sql);
        		ps.setString(1, placerOrderNumber);
        		logger.info(ps.toString());
        		rs = ps.executeQuery();
        	
        		if(rs.next()) {
        			requestId = rs.getString(1);
        		} else {
        			throw new Exception("Cannot find requestId for " + placerOrderNumber);
        		}
               
        		sql = "UPDATE requestForms SET "
            		+ "type = (SELECT type FROM panels WHERE panelCode = ? LIMIT 1), "
               		+ "patientId = ?, physicianId = ?, physicianSiteId = ?, sendingApp = ?, "
               		+ "sendingFacility = ?, placerOrderId = ?, mrn = ?, "
               		+ "mrnType = ?, mrnFacility = ?, receivedDate = ?, accountNumber = ?, eventId = ? "
               		+ "WHERE requestId = ? AND externalRequestId = ?";
               	
        		ps = conn.prepareStatement(sql);
        		ps.setString(1, observationRequest.panelCode);
        		ps.setString(2, patient.patientId);
        		ps.setString(3, orderProvider.internalId);
        		ps.setString(4, siteId);
        		ps.setString(5, sendingApp);
        		ps.setString(6, sendingFacility);
        		ps.setString(7, placerGroupNumber);
        		ps.setString(8, patient.mrn);
        		ps.setString(9, patient.mrnType);
        		ps.setString(10, patient.mrnAssigningAuthority);
        		ps.setDate(11, dateTimeTransaction);
        		ps.setString(12, patient.accountNumber);
        		ps.setLong(13, eventId);
        		ps.setString(14, requestId);
        		ps.setString(15, placerOrderNumber);
        		logger.info(ps.toString());
        		ps.executeUpdate();
        		ps.close();
                     		
        		break;
        		
        	case CA:
        		break;
        	default:
   	    	  throw new Exception("Order Control Type not supported: " + orderControl.name());
        		
        }
        
        logger.info("RequestId: " + requestId);
        if(!observationRequest.panelCode.isEmpty() && observationRequest.panelCode != null) {
	        // Add panel to requestForm
	        sql = "INSERT INTO reqPanels (requestId, panelCode, eventId) VALUES (?, ?, ?) "
	        		+ " ON DUPLICATE KEY UPDATE eventId = ?";
	        ps = conn.prepareStatement(sql);
	        ps.setString(1, requestId);
	        ps.setString(2, observationRequest.panelCode);
	        ps.setLong(3, eventId);
	        ps.setLong(4, eventId);
            logger.info(ps.toString());
	        ps.execute();
	        ps.close();
        } 
        
        addToQueue(requestId, ORDER_REVIEW_QUEUE_STEP);
        // Setup patient billing information
        setupPatientBilling();
	}
	
        
	  /**
	   * Setup container by inserting into containers, contents, and containerHistory
	   * @param containerId
	   * @param eventId
	   * @throws SQLException
	   */
	private void setupContainerId(String containerId, String containerType) throws SQLException {
		addToContainers(containerId, containerType);
		addToContents(containerId, "self", containerType, containerId);
	    addToContainerHistory(containerId);  
	      
	}
	
	
	private void addToContainerHistory(String containerId) throws SQLException {
	    String sql = "INSERT INTO containerHistory (containerId, eventId) VALUES (?, ?)";
	    PreparedStatement ps = conn.prepareStatement(sql);
	    ps.setString(1, containerId);
	    ps.setLong(2, eventId);
	    ps.executeUpdate();
	    ps.close();	
	}
	
	private void addToContainers(String containerId, String containerType) throws SQLException
	{
		String sql = "INSERT INTO containers (containerId, containerType, eventId) VALUES (?, ?, ?)";
	    PreparedStatement ps = conn.prepareStatement(sql);
	    ps.setString(1, containerId);
	    ps.setString(2, containerType);
	    ps.setLong(3, eventId);
	    ps.executeUpdate();
	    ps.close();
	}
	
	private void addToContents(String containerId, String attribute, String contentType, String content) throws SQLException {
	    // Insert requestId to contents
	    String sql = "INSERT INTO contents (containerId, attribute, contentType, content, eventId) "
	    		+ " VALUES(?, ?, ?, ?, ?)";
	    PreparedStatement ps = conn.prepareStatement(sql);
	    ps.setString(1, containerId);
	    ps.setString(2, attribute);
	    ps.setString(3, contentType);
	    ps.setString(4, content);
	    ps.setLong(5, eventId);
	    ps.executeUpdate();
	    ps.close();
	}
	  
	  
	  
	  /**
	   * Setup patient billing info
	   *   - Inserts new patientBilling
	   *   - Inserts or updates patientBillingDefault
	   * @param conn
	   * @param requestId
	   * @param patientId
	   * @param eventId
	   * @throws SQLException
	   */
	private void setupPatientBilling() throws SQLException {
		  
		// Patient billing is now per request, so it's created after request creation process
		String sql = "INSERT INTO patientBilling (patientId, requestId, billto, eventId) "
				+ "VALUES(?, ?, 'Customer', ?)";
		PreparedStatement ps = conn.prepareStatement(sql);
		ps.setString(1, patient.patientId);
		ps.setString(2, requestId);
		ps.setLong(3, eventId);
		logger.info(ps.toString());
		ps.executeUpdate();
		ps.close();
	      
		// Check if patientBillingDefault already exists
		sql = "SELECT id FROM patientBillingDefault WHERE patientId = ? LIMIT 1";
		ps = conn.prepareStatement(sql);
		ps.setString(1, patient.patientId);
		logger.info(ps.toString());
		ps.executeQuery();
		        
		ResultSet rs = ps.executeQuery();
		boolean patientBillingDefaultExists = rs.next();
		ps.close();
		    
		// Create empty patientBillingDefault row if it doesn't exist
		if(!patientBillingDefaultExists) {
			sql = "INSERT INTO patientBillingDefault (patientId, eventId) VALUES (?, ?)";
			ps = conn.prepareStatement(sql);
			ps.setString(1, patient.patientId);
			ps.setLong(2, eventId);
			logger.info(ps.toString());
			ps.executeUpdate();
			ps.close();
		    	
		}
	}
	
	/**
	 * Iterates through insuranceList and process each one to the db
	 * @throws Exception
	 */
	public void processInsuranceListToDb() throws Exception {
		for(HL7Insurance insurance : insuranceList) {
			processInsuranceToDb(insurance);
		}
	}
	  
	/**
	 * Inserts insuranceCarrier information and patient billing
	 * 	LIMS current support up to two insurance information.
	 * @param insurance
	 * @throws Exception
	 */
	public void processInsuranceToDb(HL7Insurance insurance) throws Exception {

		try {
			ResultSet rs;
			String sql;
			PreparedStatement ps;
			Integer carrierId = null;
              
			// Check required fields
			if(insurance.companyCode == null) {
				throw new Exception("Missing required field: Company Code - IN1.3.1");
			} else if(insurance.companyName == null) {
				throw new Exception("Missing required field Company Name - IN1.4.1");
			}
             
			// Check if insurance carrier info already exists.
			sql = "SELECT id FROM insuranceCarriers WHERE carrierName = ? AND amdCarrierCode = ?";
			ps = conn.prepareStatement(sql);
			ps.setString(1, insurance.companyName);
			ps.setString(2, insurance.companyCode);
        
			rs = ps.executeQuery();
			boolean carrierExists = rs.next();
			if(carrierExists) {
				carrierId = rs.getInt(1);
			}
			ps.close();
              
			// Insert insurance information if it doesn't exist. Otherwise, update info
			if(!carrierExists) {
				sql = "INSERT INTO insuranceCarriers (amdCarrierCode, carrierName, address1, "
						+ "address2, city, state, country, postalCode, phoneNumber, eventId) "
						+ "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
				 ps = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
				 ps.setString(1, insurance.companyCode);
				 ps.setString(2, insurance.companyName);
				 ps.setString(3, insurance.companyAddress1);
				 ps.setString(4, insurance.companyAddress2);
				 ps.setString(5, insurance.companyCity);
				 ps.setString(6, insurance.companyState);
				 ps.setString(7, insurance.companyCountry);
				 ps.setString(8, insurance.companyPostalCode);
				 ps.setString(9, insurance.companyPhoneNumber);
				 ps.setLong(10, eventId);
				 ps.executeUpdate();
                
				 ResultSet keys = ps.getGeneratedKeys();
				 keys.next();
                  
				 // Get carrierId
				 carrierId = keys.getInt(1);
				 ps.close();
                
			} else {
				sql = "UPDATE insuranceCarriers SET "
						+ "address1 = ?, address2 = ?, city = ?, state = ?, "
						+ "country = ?, postalCode = ?, phoneNumber = ?, eventId = ? "
						+ "WHERE amdCarrierCode = ? AND carrierName = ?";
				ps = conn.prepareStatement(sql);
				ps.setString(1, insurance.companyAddress1);
				ps.setString(2, insurance.companyAddress2);
				ps.setString(3, insurance.companyCity);
				ps.setString(4, insurance.companyState);
				ps.setString(5, insurance.companyCountry);
				ps.setString(6, insurance.companyPostalCode);
				ps.setString(7, insurance.companyPhoneNumber);
				ps.setLong(8, eventId);
				ps.setString(9, insurance.companyCode);
				ps.setString(10, insurance.companyName);
				ps.executeUpdate();    
				ps.close();
			}
            
			insurance.carrierId = carrierId;
            
			// Process Patient Billing info
			// NOTE: We currently support up to 2 insurance information per order
			if(!insurance.companyName.isEmpty()) {
				if(insurance.setId > 0 && insurance.setId <= 2) {
					processPatientBillingToDb(insurance);
				}
			}
                  

            
            
		} catch (SQLException e) {
		    logger.error(e);
		}
	}
      
      
      
      
      /**
       * Updates patientBilling and patientBillingDefault info.
       * 
       * We currently only support up to two insurance information.
       * @param conn
       * @param insurance
       * @param placement
       * @param eventId
       * @param patientId
       * @param requestId
       * @throws SQLException
       */
    private void processPatientBillingToDb(HL7Insurance insurance) throws SQLException {
          
    	// Placement means whether we put the insurance information in carrierId1 or carrierId2
    	String placement = String.valueOf(insurance.setId);
        String sql = String.format("UPDATE patientBilling SET billTo = 'Patient', "
                + "policyHolder%sFirstName = ?, policyHolder%sLastName = ?, "
                + "policyHolder%sRelationship = ?, carrierId%s = ?, "
                + "policyNumber%s = ?, groupNumber%s = ?, "
                + "policyHolder%sDOB = CASE WHEN ? = '' THEN NULL ELSE ? END, "
                + "eventId = ? "
                + "WHERE patientId = ? AND requestId = ?", placement, placement, placement, placement, placement, placement, placement);
        PreparedStatement ps = conn.prepareStatement(sql);
        ps.setString(1, insurance.insuredFirst);
        ps.setString(2, insurance.insuredLast);
        ps.setString(3, insurance.insuredRelationship);
        ps.setInt(4, insurance.carrierId);
        ps.setString(5, insurance.policyNumber);
        ps.setString(6, insurance.groupNumber);
        ps.setString(7, insurance.insuredDob);
        ps.setString(8, insurance.insuredDob);
        ps.setLong(9, eventId);
        ps.setString(10, patient.patientId);
        ps.setString(11, requestId);
        ps.executeUpdate();
        ps.close();
            
        sql = String.format("SELECT 1 FROM patientBillingDefault WHERE patientId = ? AND carrierId%s = NULL LIMIT 1", placement);
        ps = conn.prepareStatement(sql);
        ps.setString(1, patient.patientId);
        ResultSet rs = ps.executeQuery();
        boolean patientBillingDefaultCarrierExists = rs.next();
        ps.close();
        
        if(!patientBillingDefaultCarrierExists) {
            sql = String.format("UPDATE patientBillingDefault SET billTo = 'Patient', "
                    + "policyHolder%sFirstName = ?, policyHolder%sLastName = ?, "
                    + "policyHolder%sRelationship = ?, carrierId%s = ?, "
                    + "policyNumber%s = ?, groupNumber%s = ?, "
                    + "policyHolder%sDOB = CASE WHEN ? = '' THEN NULL ELSE ? END, "
                    + "eventId = ? "
                    + "WHERE patientId = ?", placement, placement, placement, placement, placement, placement, placement);
            ps = conn.prepareStatement(sql);
            ps.setString(1, insurance.insuredFirst);
            ps.setString(2, insurance.insuredLast);
            ps.setString(3, insurance.insuredRelationship);
            ps.setInt(4, insurance.carrierId);
            ps.setString(5, insurance.policyNumber);
            ps.setString(6, insurance.groupNumber);
            ps.setString(7, insurance.insuredDob);
            ps.setString(8, insurance.insuredDob);
            ps.setLong(9, eventId);
            ps.setString(10, patient.patientId);
            ps.executeUpdate();
            ps.close();
        }       
    }
    
    public void addToQueue(String containerId, String step) throws SQLException {
    	String sql = "INSERT INTO queues (containerId, step, eventId) VALUES (?, ?, ?)";
    	PreparedStatement ps = conn.prepareStatement(sql);
    	ps.setString(1, containerId);
    	ps.setString(2, step);
    	ps.setLong(3, eventId);
    	logger.info(ps.toString());
    	ps.execute();
    	ps.close();
    	
    }
    
    public void processObrSpecimenInfo() throws Exception {
    		
    	try {
    		if(observationRequest.placerOrderNumber == null || observationRequest.specimenType == null) {
    			throw new Exception("Missing either placerOrderNumber or specimenType when processing specimenInfo in OBR segment");
    		}
    		
    		String sql = "SELECT 1 FROM requestSpecimens WHERE requestId = ? AND externalIdentifier = ? AND patientId = ?";
    		PreparedStatement ps = conn.prepareStatement(sql);
    		ps.setString(1, requestId);
    		ps.setString(2, observationRequest.placerOrderNumber);
    		ps.setString(3, patient.patientId);
    		logger.info(ps.toString());
    		ResultSet rs = ps.executeQuery();
    		boolean requestSpecimenExists = rs.next();
    		
    		if(!requestSpecimenExists) {
				
				sql = "INSERT INTO requestSpecimens (requestId, patientId,"
						+ "externalIdentifier, specimenSource, specimenType, collectionDate, "
						+ "collectionTime, receivedDate, receivedTime, status, specimenQuantity, specimenQuantityUnits, eventId) "
						+ "VALUES (?, ?, ?, 'self', ?, ?, ?, ?, ?, 'ORDER ENTERED', ?, ?, ?)";
	
				ps = conn.prepareStatement(sql);
				ps.setString(1, requestId);
				ps.setString(2, patient.patientId);
				ps.setString(3, observationRequest.placerOrderNumber);
				ps.setString(4, observationRequest.specimenType);
				ps.setString(5, observationRequest.collectionDate);
				ps.setString(6, observationRequest.collectionTime);
				ps.setString(7, observationRequest.specimenReceivedDate);
                ps.setString(8, observationRequest.specimenReceivedTime);				
				ps.setString(9, observationRequest.collectionVolume);
				ps.setString(10, observationRequest.collectionUnits);
				ps.setLong(11, eventId);
				ps.execute();
				logger.info(ps.toString());
				
    		} else {
    			sql = "UPDATE requestSpecimens SET specimenType = ?, "
    					+ "collectionDate = ?, collectionTime = ?, receivedDate = ?, receivedTime = ?,"
    					+ "specimenQuantity = ?, specimenQuantityUnits = ?, eventId = ? "
    					+ " WHERE requestId = ? AND externalIdentifier = ? AND patientId = ?";
    			ps = conn.prepareStatement(sql);
    			ps.setString(1, observationRequest.specimenType);
    			ps.setString(2, observationRequest.collectionDate);
    			ps.setString(3, observationRequest.collectionTime);
    			ps.setString(4, observationRequest.specimenReceivedDate);
                ps.setString(5, observationRequest.specimenReceivedTime);    			
    			ps.setString(6, observationRequest.collectionVolume);
    			ps.setString(7, observationRequest.collectionUnits);
    			ps.setLong(8, eventId);
    			ps.setString(9, requestId);
    			ps.setString(10, observationRequest.placerOrderNumber);
    			ps.setString(11, patient.patientId);
    			ps.execute();
    			logger.info(ps.toString());
    		}
    		
    		ps.close();
			
		} catch (SQLException e) {
		    logger.error(e);
		}
    		
    }
    
    public void processSpmSpecimenInfo() throws Exception {
        try {
            for(HL7Specimen specimen : specimenList) {
                if(specimen.specimenId == null || specimen.specimenType == null) {
                    throw new Exception("Missing either specimenId or specimenType when processing specimenInfo in SPM segment");
                }
                
                String sql = "SELECT 1 FROM requestSpecimens WHERE requestId = ? AND externalIdentifier = ? AND patientId = ?";
                PreparedStatement ps = conn.prepareStatement(sql);
                ps.setString(1, requestId);
                ps.setString(2, specimen.specimenId);
                ps.setString(3, patient.patientId);
                logger.info(ps.toString());
                ResultSet rs = ps.executeQuery();
                boolean requestSpecimenExists = rs.next();
                
                if(!requestSpecimenExists) {
                    
                    sql = "INSERT INTO requestSpecimens (requestId, patientId,"
                            + "externalIdentifier, specimenSource, specimenType, collectionDate, "
                            + "collectionTime, receivedDate, receivedTime, status, specimenQuantity, specimenQuantityUnits, eventId) "
                            + "VALUES (?, ?, ?, 'self', ?, ?, ?, ?, ?, 'ORDER ENTERED', ?, ?, ?)";
        
                    ps = conn.prepareStatement(sql);
                    ps.setString(1, requestId);
                    ps.setString(2, patient.patientId);
                    ps.setString(3, specimen.specimenId);
                    ps.setString(4, specimen.specimenType);
                    ps.setString(5, specimen.collectionDate);
                    ps.setString(6, specimen.collectionTime);
                    ps.setString(7, specimen.receivedDate);
                    ps.setString(8, specimen.receivedTime);                    
                    ps.setString(9, specimen.collectionVolume);
                    ps.setString(10, specimen.collectionUnits);
                    ps.setLong(11, eventId);
                    ps.execute();
                    logger.info(ps.toString());
                    
                } else {
                    sql = "UPDATE requestSpecimens SET specimenType = ?, "
                            + "collectionDate = ?, collectionTime = ?, receivedDate = ?, receivedTime = ?,"
                            + "specimenQuantity = ?, specimenQuantityUnits = ?, eventId = ? "
                            + " WHERE requestId = ? AND externalIdentifier = ? AND patientId = ?";
                    ps = conn.prepareStatement(sql);
                    ps.setString(1, specimen.specimenType);
                    ps.setString(2, specimen.collectionDate);
                    ps.setString(3, specimen.collectionTime);
                    ps.setString(4, specimen.receivedDate);
                    ps.setString(5, specimen.receivedTime);                    
                    ps.setString(6, specimen.collectionVolume);
                    ps.setString(7, specimen.collectionUnits);
                    ps.setLong(8, eventId);
                    ps.setString(9, requestId);
                    ps.setString(10, specimen.specimenId);
                    ps.setString(11, patient.patientId);
                    ps.execute();
                    logger.info(ps.toString());
                }
                
                ps.close();
            }
            
        } catch (SQLException e) {
            logger.error(e);
        }       
    }

    
    /**
     * Insert orderProvider data to physicians and physicianSites
     * @param orderProvider
     * @throws Exception
     */
	public void processOrderProviderToDb(HL7PersonNameInfo orderProvider) throws Exception {
		try {
			ResultSet rs;
			String sql = "SELECT physicianId FROM physicians WHERE providerId = ? LIMIT 1";
		    PreparedStatement ps;
		    String physicianId = null;
		    
		    ps = conn.prepareStatement(sql);
		    
		    ps.setString(1, orderProvider.id);
		    rs = ps.executeQuery();
		    boolean physicianExists = rs.next();
		    
		    // Check if physician already exists
		    if(!physicianExists) {
		    		    	
		    	// Check required information
		    	if(orderProvider.firstName != null && orderProvider.lastName != null) {
			    	physicianId = Switchboard.generateNextInSequenceWPrefix("physicianId");
			    	sql = "INSERT INTO physicians (physicianId, first_name, last_name, "
			    			+ " middle_name, providerId, eventId) "
			    			+ "VALUES (?, ?, ?, ?, ?, ?)";
			    	ps = conn.prepareStatement(sql);
			    	ps.setString(1, physicianId);
			    	ps.setString(2, orderProvider.firstName);
			    	ps.setString(3, orderProvider.lastName);
			    	ps.setString(4, orderProvider.middleName);
			    	ps.setString(5, orderProvider.id);
			    	ps.setLong(6, eventId);
		            logger.info(ps.toString());
		            ps.execute();
			    	ps.close();
			    	
			    	sql = "INSERT INTO physicianSites (physicianId, siteId, eventId)"
			    			+ " VALUES (?, ?, ?)";
			    	
			    	ps = conn.prepareStatement(sql);
			    	ps.setString(1, physicianId);
			    	ps.setString(2, patient.siteId);
			    	ps.setLong(3, eventId);
		            logger.info(ps.toString());
			    	ps.execute();
			    	ps.close();
		    	} else {
		    		throw new Exception("Failed to insert physician info. Missing either first or last name");
		    	}
		    	
		    	
		    } else {
		    	physicianId = rs.getString(1);
		    	
		    	// Only do update if firstName and lastName are not null
		    	if(orderProvider.firstName != null && orderProvider.lastName != null) {
			    	sql = "UPDATE physicians SET first_name = ?, last_name = ?, middle_name = ?, eventId = ? "
			    			+ "WHERE physicianId = ?";
			    	ps = conn.prepareStatement(sql);
			    	ps.setString(1, orderProvider.firstName);
			    	ps.setString(2, orderProvider.lastName);
			    	ps.setString(3, orderProvider.middleName);
			    	ps.setLong(4, eventId);
			    	ps.setString(5, physicianId);
		            logger.info(ps.toString());
			    	ps.execute();
			    	ps.close();	
			    	
		    	} else {
		    		logger.info("Failed to update physician info. Missing either first or last name");
		    	}
		    	
		    	sql = "SELECT 1 FROM physicianSites WHERE physicianId = ? AND siteId = ? LIMIT 1";
		    	ps = conn.prepareStatement(sql);
		    	ps.setString(1, physicianId);
		    	ps.setString(2, patient.siteId);
	            logger.info(ps.toString());
		    	rs = ps.executeQuery();
		    	
		    	
		    	boolean physicianSitesExist = rs.next();
				if(!physicianSitesExist) {
			    	sql = "INSERT INTO physicianSites (physicianId, siteId, eventId)"
			    			+ " VALUES (?, ?, ?)";
			    	
			    	ps = conn.prepareStatement(sql);
			    	ps.setString(1, physicianId);
			    	ps.setString(2, patient.siteId);
			    	ps.setLong(3, eventId);
		            logger.info(ps.toString());
			    	ps.execute();
			    	ps.close();
				}
				ps.close();
		    }
		    
		    // Link physicianId to orderProvider
		    orderProvider.internalId = physicianId;
		    
		
		} catch (SQLException e) {
		    logger.error(e);
		}
	}
	
	public void processNotes() {
	    String sql = "INSERT INTO containerNotes (containerId, noteType, note, eventId) "
	            + " VALUES(?, ?, ?, ?)";
	    PreparedStatement ps;
	    try {
            ps = conn.prepareStatement(sql);
            
            for(HL7Notes n1 : this.notes) {
                for(String notes : n1.notes) {
                    ps.setString(1, requestId);
                    ps.setString(2, NOTE_TYPE);
                    ps.setString(3, notes);
                    ps.setLong(4, eventId);
                    logger.info(ps.toString());
                    ps.execute();
                }         
            }
            
            ps.close();
        } catch (SQLException e) {
           logger.error(e);
        }

	}
	
	/**
	 * Insert the incoming order observations into the database
	 */
	public void processObservations() {
	  
	  if(observations.isEmpty())
	    return;
	  
	  String sql = "SELECT inputName FROM formConfigurableParts WHERE inputName IN(";	  
	  Hashtable<String, Type[]> obValues = new Hashtable<String, Type[]>();
	  for(HL7Observation ob: observations) {
	    obValues.put(ob.identifier, ob.values);
	    sql += "?,";
	  }
	  sql = StringUtils.chop(sql)+")";
	  
	  PreparedStatement ps;
	  ResultSet rs;
	  
	  try {
	    ps = conn.prepareStatement(sql);
	    int psCount = 0;
	    for(String s: obValues.keySet()) {
	      ps.setString(++psCount, s);
	    }
        logger.info(ps.toString());	    
	    rs = ps.executeQuery();
   	    
	    if(rs.isBeforeFirst()) {
    	    sql = "INSERT INTO containerProperties(containerId, property, value, eventId) VALUES";
    	    ArrayList<String> psStringList = new ArrayList<String>(psCount*3);
    	    while(rs.next()) {
    	      String userDefField = rs.getString(1);
    	      for(Type t: obValues.get(userDefField)) {
    	        sql += "(?,?,?,"+eventId+"),";
    	        String stringVal;
                if (t instanceof NM) { // numeric
                  stringVal = ((NM) t).getValue();
                } else if (t instanceof TX) { // text
                  stringVal = ((TX) t).getValue();
                } else if (t instanceof ST) { // string
                  stringVal = ((ST) t).getValue();
                } else if (t instanceof TS) { // datetime
                  stringVal = new Timestamp(((TS) t).getTs1_Time().getValueAsDate().getTime()).toString();
                } else {
                  stringVal = t.toString();
                }
                psStringList.add(requestId);
                psStringList.add(USER_DEF_PREFIX + userDefField);
                psStringList.add(stringVal);
    	      }
    	    }
            rs.close();
            ps.close();
    	    sql = StringUtils.chop(sql);
    	    ps = conn.prepareStatement(sql);
    	    psCount = 0;
    	    for(String s: psStringList) 
    	      ps.setString(++psCount, s);
            logger.info(ps.toString());    	    
    	    ps.executeUpdate();
    	    ps.close();
	    }
	  } catch (Exception e) {
	    logger.error(e);
      }
	}
	
	public void processDiagnosticCodes() {
	    String insertSql = "INSERT INTO requestCodes (requestId, codeId, eventId) "
	            + "VALUES (?, (SELECT id FROM diagnosticCodes WHERE diagnosticCode = ?), ?)";
	    String checkSql = "SELECT 1 FROM requestCodes rc INNER JOIN diagnosticCodes dc " 
	            + " ON rc.codeId = dc.id WHERE dc.diagnosticCode = ? AND rc.requestId = ?";
	    PreparedStatement ps;
	    ResultSet rs;
	    
	    try {
    	    for(HL7DiagnosticCode diagnosticCode : diagnosticCodes) {
    	        if(!diagnosticCode.code.isEmpty()) {
    	            ps = conn.prepareStatement(checkSql);
    	            ps.setString(1, diagnosticCode.code);
    	            ps.setString(2, requestId);
    	            rs = ps.executeQuery();
    	            logger.info(ps.toString());
    	            boolean diagnosticCodeExist = rs.next();
    	            
    	            ps.close();
    	            
    	            if(!diagnosticCodeExist) {
    	                ps = conn.prepareStatement(insertSql);
    	                ps.setString(1, requestId);
                        ps.setString(2, diagnosticCode.code);
    	                ps.setLong(3, eventId);
    	                logger.info(ps.toString());
    	                ps.execute();
    	                ps.close();
    	            }
    	        }
    	    }
	    
	    } catch (Exception e) {
	        logger.error(e);
	    }
	    
	}

}
