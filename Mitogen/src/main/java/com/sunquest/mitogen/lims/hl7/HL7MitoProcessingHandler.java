package com.sunquest.mitogen.lims.hl7;

import java.io.FileOutputStream;
import java.io.IOException;
import java.sql.PreparedStatement;

import org.apache.commons.codec.binary.Base64;
import org.apache.commons.lang3.StringUtils;

import com.uniconnect.uniflow.Switchboard;
import com.uniconnect.uniflow.hl7.DataSubType;
import com.uniconnect.uniflow.hl7.HL7ProcessingHandler;

import ca.uhn.hl7v2.HL7Exception;
import ca.uhn.hl7v2.model.Message;
import ca.uhn.hl7v2.model.Structure;
import ca.uhn.hl7v2.model.Type;
import ca.uhn.hl7v2.model.Varies;
import ca.uhn.hl7v2.model.v251.datatype.ED;
import ca.uhn.hl7v2.model.v251.datatype.TX;
import ca.uhn.hl7v2.model.v251.message.ORM_O01;
import ca.uhn.hl7v2.model.v251.message.ORU_R01;
import ca.uhn.hl7v2.model.v251.segment.NTE;
import ca.uhn.hl7v2.model.v251.segment.OBX;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.nio.file.*;
import java.util.ArrayList;
import java.util.List;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.sql.Types;
import java.text.SimpleDateFormat;

/**
 * Javadocs for base hapi clases can be found at:
 * https://hapifhir.github.io/hapi-hl7v2/base/apidocs/index.html  
 * Javadocs for v251 can be found at:
 * https://hapifhir.github.io/hapi-hl7v2/v251/apidocs/index.html
 */
import ca.uhn.hl7v2.model.v251.datatype.NM;
import ca.uhn.hl7v2.model.v251.datatype.TS;
import ca.uhn.hl7v2.model.v251.datatype.XCN;
import ca.uhn.hl7v2.model.v251.group.ORM_O01_INSURANCE;
import ca.uhn.hl7v2.model.v251.group.ORM_O01_OBSERVATION;
import ca.uhn.hl7v2.model.v251.group.ORM_O01_ORDER;
import ca.uhn.hl7v2.model.v251.group.ORM_O01_ORDER_DETAIL;
import ca.uhn.hl7v2.model.v251.group.ORU_R01_OBSERVATION;
import ca.uhn.hl7v2.model.v251.group.ORU_R01_ORDER_OBSERVATION;
import ca.uhn.hl7v2.model.v251.message.ADT_A05;
import ca.uhn.hl7v2.model.v251.segment.MSH;
import ca.uhn.hl7v2.model.v251.segment.OBR;
import ca.uhn.hl7v2.model.v251.segment.ORC;
import ca.uhn.hl7v2.model.v251.segment.PV1;
import ca.uhn.hl7v2.model.v251.segment.SPM;
import ca.uhn.hl7v2.model.v251.segment.DG1;
import ca.uhn.hl7v2.model.v251.segment.IN1;


public class HL7MitoProcessingHandler extends HL7ProcessingHandler {
    
    // TODO: move this somewhere else
    public static final String DATE_SQL_FORMAT = "yyyy-MM-dd";
    public static final String TIME_SQL_FORMAT = "HH:mm:ss";
    public static final SimpleDateFormat dateFormatter = new SimpleDateFormat(DATE_SQL_FORMAT);
    public static final SimpleDateFormat timeFormatter = new SimpleDateFormat(TIME_SQL_FORMAT);  
    
    
    private final String DI_STEP_PROPERTY_STRING = "Current DI Step";   
    private final String DI_HOLD_STEP_ADD_STRING = " - HOLD";  
    private final String DI_WAITING_STEP = "Waiting for IM";
    private final String DI_RECEIVED_STEP = "IM Results Received";
    private final String HL7_USER_ID = "_timerTask";
    private final String CONTROL_RUN_PREFIX = "CONTROL";  
    
    // Maximum IN1 segments we can process.
    private final int MAX_IN1 = 2;
    

    public HL7MitoProcessingHandler(String incomingDirectory, String processingDirectory, String doneDirectory,
            String failedDirectory, String extractedFilesDirectory, String filenameRegex, String maxFileSize)
            throws IOException {
        super(incomingDirectory, processingDirectory, doneDirectory, failedDirectory, extractedFilesDirectory, filenameRegex,
                maxFileSize);
        
       logger.info("Running " + this.getClass().getName());
    }
    
    /**
     * Takes a HL7 file and inserts all the appropriate data into the database.
     * 
     *  On success, moves file to done directory, on failure, moves file to failed directory.
     * 
     * 
     * @param HL7File file to process
     */
    public void processHL7File(Path HL7File) {
        boolean success = true;
        logger.info("Processing HL7 file: \"" + HL7File + "\"");
        conn = null;
        try {
          if (conn == null) {
            getAndSetUpConnection();
            
          }
          long eventId = Switchboard.generateNextInSequence("eventId", conn); // this call explicitly commits

          // Insert eventId
          String sql = "insert into events (eventId, step, eventDate, userId, versionId) values (?,?,NOW(),?,?)";
          PreparedStatement ps = conn.prepareStatement(sql);
          ps.setLong(1, eventId);
          ps.setString(2, "Incoming HL7");
          ps.setString(3, HL7_USER_ID);
          ps.setString(4, Switchboard.configVersion);
          
          logger.info(ps.toString());
          ps.executeUpdate();
          ps.close();


          Message hapiMsg = getMessageFromFile(HL7File);

           
          if (hapiMsg == null)
            throw new Exception("Could not parse HL7 file: \"" + HL7File + "\"");
          else
            logger.info("HAPI successfully parsed file: \"" + HL7File + "\" message of type: " + hapiMsg.getName());

          if (hapiMsg instanceof ORM_O01) {
            logger.info("Beginning processing of ORM_O01 msg: " + HL7File + ".");
            ORM_O01 ormMsg = (ORM_O01) hapiMsg;

           
             
            // - Enumerate all possibly used fields
            // MSH
            String sendingApp;
            String sendingFacility;

             
            // SPM or OBR
            boolean hasSpecimenSegment = false;

 
             // - Validate that all needed fields are present, fill in variables from parsed message,
            // if any required ones are missing and cannot be inferred, error out.

            // Variable Extraction
            //// MSH Variables
            MSH msh = ormMsg.getMSH();

            sendingApp = msh.getSendingApplication().getHd1_NamespaceID().getValue();
            sendingFacility = msh.getSendingFacility().getHd1_NamespaceID().getValue();

            HL7Patient patient = new HL7Patient(ormMsg, conn);

            // Existing or newly generated ids
            String patientId = null;
            
            // DATABASE LOGIC
            //// PID DB
            if (patient.sqid != null) {
              sql = "select patientId from patients where sqid = ?";
              ps = conn.prepareStatement(sql);
              ps.setString(1, patient.sqid);
              logger.info(ps.toString());
              ResultSet rs = ps.executeQuery();
              boolean sqidExists = rs.next();
              if (sqidExists) {
                patientId = rs.getString("patientId");
                rs.close();
                ps.close();                
                sql = "update patients set placerPatientId = ?, govtId  = ?, firstName = ?, middleName = ?, lastName = ?, dob = ?, geneticGender = ?, address1 = ?, address2 = ?, city = ?, state = ?, postalCode = ?, country = ?, phone1 = ?, phone2 = ?, eventId = ?, ethnicity = ? " + 
                     "where patientId = ?";
                ps = conn.prepareStatement(sql);
                ps.setString(1, patient.placerId);
                ps.setString(2, patient.ssn);
                ps.setString(3, patient.firstName);
                ps.setString(4, patient.middleName);
                ps.setString(5, patient.lastName);
                ps.setString(6, patient.dob);
                ps.setString(7, (patient.gender.equals("") ? "U" : patient.gender));
                ps.setString(8, patient.address1);
                ps.setString(9, patient.address2);
                ps.setString(10, patient.city);
                ps.setString(11, patient.state);
                ps.setString(12, patient.postalCode);
                ps.setString(13, patient.countryCode);
                ps.setString(14, patient.phone1);
                ps.setString(15, patient.phone2);
                ps.setLong(16, eventId);
                ps.setString(17, patient.raceCSL);
                ps.setString(18, patientId);
                logger.info(ps.toString());
                ps.executeUpdate();
                ps.close();
              } else {
                // get new patient id
                patientId = Switchboard.generateNextInSequenceWPrefix("patientId");
                // insert into containers
                sql = "insert into containers (containerId, containerType, eventId) values (?, 'patientId', ?)";
                ps.close();
                ps = conn.prepareStatement(sql);
                ps.setString(1, patientId);
                ps.setLong(2, eventId);
                logger.info(ps.toString());
                ps.executeUpdate();
                ps.close();
                // insert into contents
                sql = "insert into contents (containerId, attribute, contentType, content, eventId) values (?, 'self', 'Patient', ?, ?)";
                ps.close();
                ps = conn.prepareStatement(sql);
                ps.setString(1, patientId);
                ps.setString(2, patientId);
                ps.setLong(3, eventId);
                logger.info(ps.toString());
                ps.executeUpdate();
                ps.close();
                // insert new patient
                 sql = "insert into patients (status,patientId, sqId, placerPatientId, govtId, firstName, middleName, lastName, dob, geneticGender, address1, address2, city, state, postalCode, country, phone1, phone2, eventId, ethnicity) " + 
                     "values ('active',?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
                ps.close();
                ps = conn.prepareStatement(sql);
                ps.setString(1, patientId);
                ps.setString(2, patient.sqid);
                ps.setString(3, patient.placerId);
                ps.setString(4, patient.ssn);
                ps.setString(5, patient.firstName);
                ps.setString(6, patient.middleName);
                ps.setString(7, patient.lastName);
                ps.setString(8, patient.dob);
                ps.setString(9, (patient.gender.equals("") ? "U" : patient.gender));
                ps.setString(10, patient.address1);
                ps.setString(11, patient.address2);
                ps.setString(12, patient.city);
                ps.setString(13, patient.state);
                ps.setString(14, patient.postalCode);
                ps.setString(15, patient.countryCode);
                ps.setString(16, patient.phone1);
                ps.setString(17, patient.phone2);
                ps.setLong(18, eventId);
                ps.setString(19, patient.raceCSL);
                logger.info(ps.toString());
                ps.executeUpdate();
                ps.close();
              }
            } else {
              sql = "select patientId from patients where lastName = ? and dob = ? and firstName = ? limit 1";
              ps.close();
              ps = conn.prepareStatement(sql);
              ps.setString(1, patient.lastName);
              ps.setString(2, patient.dob);
              ps.setString(3, patient.firstName);
              logger.info(ps.toString());
              ResultSet rs = ps.executeQuery();
              boolean patientExists = rs.next();
              if (patientExists) {
                patientId = rs.getString("patientId");
                rs.close();
                ps.close();
                sql = "update patients set placerPatientId = ?, govtId  = ?, geneticGender = ?, address1 = ?, address2 = ?, city = ?, state = ?, postalCode = ?, country = ?, phone1 = ?, phone2 = ?, eventId = ?, ethnicity = ? " + 
                     "where patientId = ?";
                ps = conn.prepareStatement(sql);
                ps.setString(1, patient.placerId);
                ps.setString(2, patient.ssn);
                ps.setString(3, (patient.gender.equals("") ? "U" : patient.gender));
                ps.setString(4, patient.address1);
                ps.setString(5, patient.address2);
                ps.setString(6, patient.city);
                ps.setString(7, patient.state);
                ps.setString(8, patient.postalCode);
                ps.setString(9, patient.countryCode);
                ps.setString(10, patient.phone1);
                ps.setString(11, patient.phone2);
                ps.setLong(12, eventId);
                ps.setString(13, patient.raceCSL);
                ps.setString(14, patientId);
                logger.info(ps.toString());
                ps.executeUpdate();
                ps.close();
              } else {
                // get new patient id
                patientId = Switchboard.generateNextInSequenceWPrefix("patientId");
                // insert into containers
                sql = "insert into containers (containerId, containerType, eventId) values (?, 'patientId', ?)";
                ps.close();
                ps = conn.prepareStatement(sql);
                ps.setString(1, patientId);
                ps.setLong(2, eventId);
                logger.info(ps.toString());
                ps.executeUpdate();
                ps.close();
                // insert into contents
                sql = "insert into contents (containerId, attribute, contentType, content, eventId) values (?, 'self', 'Patient', ?, ?)";
                ps = conn.prepareStatement(sql);
                ps.setString(1, patientId);
                ps.setString(2, patientId);
                ps.setLong(3, eventId);
                logger.info(ps.toString());
                ps.executeUpdate();
                ps.close();
                // insert new patient
                 sql = "insert into patients (status,patientId, placerPatientId, govtId, firstName, middleName, lastName, dob, geneticGender, address1, address2, city, state, postalCode, country, phone1, phone2, eventId, ethnicity) " + 
                     "values ('active',?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
                ps = conn.prepareStatement(sql);
                ps.setString(1, patientId);
                ps.setString(2, patient.placerId);
                ps.setString(3, patient.ssn);
                ps.setString(4, patient.firstName);
                ps.setString(5, patient.middleName);
                ps.setString(6, patient.lastName);
                ps.setString(7, patient.dob);
                ps.setString(8, (patient.gender.equals("") ? "U" : patient.gender));
                ps.setString(9, patient.address1);
                ps.setString(10, patient.address2);
                ps.setString(11, patient.city);
                ps.setString(12, patient.state);
                ps.setString(13, patient.postalCode);
                ps.setString(14, patient.countryCode);
                ps.setString(15, patient.phone1);
                ps.setString(16, patient.phone2);
                ps.setLong(17, eventId);
                ps.setString(18, patient.raceCSL);
                logger.info(ps.toString());
                ps.executeUpdate();
                ps.close();
              }
            }
            // update patientSources set master to 0
            sql = "update patientSources set master = ? where patientId = ? and master = ?";
            ps.close();
            ps = conn.prepareStatement(sql);
            ps.setInt(1, 0);
            ps.setString(2, patientId);
            ps.setInt(3, 1);
            logger.info(ps.toString());
            ps.executeUpdate();
            ps.close();
            // insert into containerHistory
            sql = "insert into containerHistory (containerId, eventId) values (?, ?)";
            ps = conn.prepareStatement(sql);
            ps.setString(1, patientId);
            ps.setLong(2, eventId);
            logger.info(ps.toString());
            ps.executeUpdate();
            ps.close();
            // insert into patientSources
             sql = "insert into patientSources (master, siteId, patientId, sqId, sqidNumberType, assigningAuthority, mrn, mrnType, mrnFacility, placerPatientId, firstName, middleName, lastName, status, address1, address2, city, state, postalCode, dob, geneticGender, govtId, ethnicity, phone1, phone2, eventId) "+
                 "values (1,?,?,?,?,?,?,?,?,?,?,?,?,'active',?,?,?,?,?,?,?,?,?,?,?,?)";            
            ps = conn.prepareStatement(sql);
            ps.setString(1, patient.siteId);
            ps.setString(2, patientId);
            ps.setString(3, patient.sqid);
            ps.setString(4, patient.sqidType);
            ps.setString(5, patient.sqidAssigningAuthority);
            ps.setString(6, patient.mrn == null ? "" : patient.mrn);
            ps.setString(7, patient.mrnType);
            ps.setString(8, patient.mrnAssigningAuthority);
            ps.setString(9, patient.placerId);
            ps.setString(10, patient.firstName);
            ps.setString(11, patient.middleName);
            ps.setString(12, patient.lastName);
            ps.setString(13, patient.address1);
            ps.setString(14, patient.address2);
            ps.setString(15, patient.city);
            ps.setString(16, patient.state);
            ps.setString(17, patient.postalCode);
            ps.setString(18, patient.dob);
            ps.setString(19, patient.gender.equals("") ? "U" : patient.gender);
            ps.setString(20, patient.ssn);
            ps.setString(21, patient.raceCSL);
            ps.setString(22, patient.phone1);
            ps.setString(23, patient.phone2);
            ps.setLong(24, eventId);
            logger.info(ps.toString());
            ps.executeUpdate();
            ps.close();
            // deal with patientEthnicities
            sql = "DELETE from patientEthnicities WHERE patientId = ?";
            ps = conn.prepareStatement(sql);
            ps.setString(1, patientId);
            logger.info(ps.toString());
            ps.executeUpdate();
            ps.close();
            if (patient.raceList.size() > 0) {
              sql = "INSERT into patientEthnicities (patientId, ethnicityName, eventId) values (?,?,?)";
              for (int i = 1; i < patient.raceList.size(); i++)
                sql += ",(?,?,?)";
              ps = conn.prepareStatement(sql);
              for (int i = 0; i < patient.raceList.size(); i++) {
                ps.setString(1 + (3 * i), patientId);
                ps.setString(2 + (3 * i), patient.raceList.get(i));
                ps.setLong(3 + (3 * i), eventId);
              }
              logger.info(ps.toString());
              ps.executeUpdate();
              ps.close();
            }

            patient.patientId = patientId;

            // Will be used to process order to db later
            // ArrayList<HL7Order> orders = new ArrayList<HL7Order>();

             
            for (ORM_O01_ORDER order : ormMsg.getORDERAll()) {
              // ORC
              ORC orc = order.getORC();
              HL7OrderProcessing hl7Order = new HL7OrderProcessing(conn, orc, sendingApp, sendingFacility, eventId);
              hl7Order.patient = patient;

              ORM_O01_ORDER_DETAIL orderDetail = order.getORDER_DETAIL();

              // OBR
              OBR obr = orderDetail.getOBR();
              HL7ObservationRequest hl7ObservationRequest = new HL7ObservationRequest(obr);
              hl7Order.observationRequest = hl7ObservationRequest;
                        

              
              // Get DG1 codes
              ArrayList<HL7DiagnosticCode> diagnosticCodes = new ArrayList<HL7DiagnosticCode>();
              for (DG1 dg1 : orderDetail.getDG1All()) {
                  diagnosticCodes.add(new HL7DiagnosticCode(dg1));
              }
              hl7Order.diagnosticCodes = diagnosticCodes;
              
              
              ArrayList<HL7Notes> notes = new ArrayList<HL7Notes>();
              for (NTE nte : orderDetail.getNTEAll()) {
                  notes.add(new HL7Notes(nte));
              }

              hl7Order.notes = notes;
                 
              // NOTE: SPM could either be under ORDER DETAIL (if OBX doesn't exists) or under
              // OBSERVATION
              Structure[] spmSegments;
              ArrayList<HL7Specimen> spmList = new ArrayList<HL7Specimen>();
              try {
                spmSegments = orderDetail.getAll("SPM");
                if (spmSegments.length > 0 && spmSegments != null) {
                  hasSpecimenSegment = true;
                  for (Structure spm : spmSegments) {
                    spmList.add(new HL7Specimen((SPM) spm));
                  }
                }

              } catch (HL7Exception exception) {
                logger.info("SPM Segment not found under orderDetail");
              }
                
              // OBX
              ArrayList<HL7Observation> observations = new ArrayList<HL7Observation>();          
              for (ORM_O01_OBSERVATION observation : orderDetail.getOBSERVATIONAll()) {
                try {
                  spmSegments = observation.getAll("SPM");
                  if (spmSegments.length > 0 && spmSegments != null) {
                    hasSpecimenSegment = true;
                    for (Structure spm : spmSegments) {
                      spmList.add(new HL7Specimen((SPM) spm));
                    }
                  }
                } catch (HL7Exception exception) {
                  logger.info("SPM Segment not found under observation");
                }
                OBX obx = observation.getOBX();
                observations.add(new HL7Observation(obx));
              }
              hl7Order.observations = observations;
              
              hl7Order.processOrderToDb();
              hl7Order.specimenList = spmList;
              hl7Order.processDiagnosticCodes();
              hl7Order.processNotes();
              hl7Order.processObservations();

              if (!hasSpecimenSegment) {
                // Use specimen Info in OBR
                logger.info("Using OBR specimenInfo");
                hl7Order.processObrSpecimenInfo();
              } else {

                // Process SPM segments
                hl7Order.processSpmSpecimenInfo(); 
              }

     
                   
              // Set up patient billing and process IN1
              List<ORM_O01_INSURANCE> insuranceList = ormMsg.getPATIENT().getINSURANCEAll();
              if (insuranceList != null) {
                int in1Count = 0;
                for (int i = 0; i < insuranceList.size(); i++) {
                  ORM_O01_INSURANCE insurance = insuranceList.get(i);
                  IN1 in1 = insurance.getIN1();
                  if (in1 != null && in1Count < MAX_IN1) {
                    HL7Insurance hl7Insurance = new HL7Insurance(insurance);
                    hl7Order.insuranceList.add(hl7Insurance);

                  }
                }
              }

              hl7Order.processInsuranceListToDb();

             };      


            // DG1

            // NTE -- there may be notes as subfields under other groupings

            // - Create new IDs: sp_getNextSequence or insert and get last

           }// A28, A31, and A05 have the same message structure, so they decided just to reuse the class. This makes branching off of the class name confusing, but whatever.
          else if (hapiMsg instanceof ADT_A05) { // We're actually after ADT_A28 or A31 'add' and 'update' use the same logic 
            logger.debug("Beginning processing of ADT_A05 msg: " + HL7File + ".");
            ADT_A05 adtMsg = (ADT_A05) hapiMsg;
            
            // - Enumerate all possibly used fields
            // MSH
            String sendingApp;
            String sendingFacility;

            // PHYSICIANS
            String npi = null;
            String physicianFirst = null;
            String physicianLast = null;
            String physicianMiddle = null;

            // Variable Extraction 
            //// MSH Variables
            MSH msh = adtMsg.getMSH();
            sendingApp = msh.getSendingApplication().getHd1_NamespaceID().getValue();
            sendingFacility = msh.getSendingFacility().getHd1_NamespaceID().getValue();

            // get all the stuff out of the message
            HL7Patient patient = new HL7Patient(adtMsg, conn);

            //// PV1 Variables
            PV1 pv1 = adtMsg.getPV1();

            // PV1.9 - Consulting Doctor
            XCN[] doctors = pv1.getPv19_ConsultingDoctor();
            if(doctors.length>0) {
              XCN doctor1 = pv1.getPv19_ConsultingDoctor()[0];
              npi = doctor1.getXcn1_IDNumber().getValue();
              physicianLast = doctor1.getXcn2_FamilyName().getFn1_Surname().getValue();
              physicianFirst = doctor1.getXcn3_GivenName().getValue();
              physicianMiddle = doctor1.getXcn4_SecondAndFurtherGivenNamesOrInitialsThereof().getValue();
            }

            // Existing or newly generated ids
            String patientId = null;
            String physicianId; // nextSequence

            // DATABASE LOGIC
            //// PID DB
            if (patient.sqid != null) {
              sql = "select patientId from patients where sqid = ?";
              ps.close();
              ps = conn.prepareStatement(sql);
              ps.setString(1, patient.sqid);
              logger.info(ps.toString());
              ResultSet rs = ps.executeQuery();
              boolean sqidExists = rs.next();
              if (sqidExists) {
                patientId = rs.getString("patientId");
                rs.close();
                ps.close();
                sql = "update patients set placerPatientId = ?, govtId  = ?, firstName = ?, middleName = ?, lastName = ?, dob = ?, geneticGender = ?, address1 = ?, address2 = ?, city = ?, state = ?, postalCode = ?, country = ?, phone1 = ?, phone2 = ?, eventId = ?, ethnicity = ? " + 
                     "where patientId = ?";
                ps = conn.prepareStatement(sql);
                ps.setString(1, patient.placerId);
                ps.setString(2, patient.ssn);
                ps.setString(3, patient.firstName);
                ps.setString(4, patient.middleName);
                ps.setString(5, patient.lastName);
                ps.setString(6, patient.dob);
                ps.setString(7, (patient.gender.equals("") ? "U" : patient.gender));
                ps.setString(8, patient.address1);
                ps.setString(9, patient.address2);
                ps.setString(10, patient.city);
                ps.setString(11, patient.state);
                ps.setString(12, patient.postalCode);
                ps.setString(13, patient.countryCode);
                ps.setString(14, patient.phone1);
                ps.setString(15, patient.phone2);
                ps.setLong(16, eventId);
                ps.setString(17, patient.raceCSL);
                ps.setString(18, patientId);
                logger.info(ps.toString());
                ps.executeUpdate();
                ps.close();
              } else {
                // get new patient id
                patientId = Switchboard.generateNextInSequenceWPrefix("patientId");
                // insert into containers
                sql = "insert into containers (containerId, containerType, eventId) values (?, 'patientId', ?)";
                ps.close();
                ps = conn.prepareStatement(sql);
                ps.setString(1, patientId);
                ps.setLong(2, eventId);
                logger.info(ps.toString());
                ps.executeUpdate();
                ps.close();
                // insert into contents
                sql = "insert into contents (containerId, attribute, contentType, content, eventId) values (?, 'self', 'Patient', ?, ?)";
                ps = conn.prepareStatement(sql);
                ps.setString(1, patientId);
                ps.setString(2, patientId);
                ps.setLong(3, eventId);
                logger.info(ps.toString());
                ps.executeUpdate();
                ps.close();
                // insert new patient
                 sql = "insert into patients (status,patientId, sqId, placerPatientId, govtId, firstName, middleName, lastName, dob, geneticGender, address1, address2, city, state, postalCode, country, phone1, phone2, eventId, ethnicity) " + 
                     "values ('active',?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
                ps = conn.prepareStatement(sql);
                ps.setString(1, patientId);
                ps.setString(2, patient.sqid);
                ps.setString(3, patient.placerId);
                ps.setString(4, patient.ssn);
                ps.setString(5, patient.firstName);
                ps.setString(6, patient.middleName);
                ps.setString(7, patient.lastName);
                ps.setString(8, patient.dob);
                ps.setString(9, (patient.gender.equals("") ? "U" : patient.gender));
                ps.setString(10, patient.address1);
                ps.setString(11, patient.address2);
                ps.setString(12, patient.city);
                ps.setString(13, patient.state);
                ps.setString(14, patient.postalCode);
                ps.setString(15, patient.countryCode);
                ps.setString(16, patient.phone1);
                ps.setString(17, patient.phone2);
                ps.setLong(18, eventId);
                ps.setString(19, patient.raceCSL);
                logger.info(ps.toString());
                ps.executeUpdate();
                ps.close();
              }
            } else {
              sql = "select patientId from patients where lastName = ? and dob = ? and firstName = ? limit 1";
              ps.close();
              ps = conn.prepareStatement(sql);
              ps.setString(1, patient.lastName);
              ps.setString(2, patient.dob);
              ps.setString(3, patient.firstName);
              logger.info(ps.toString());
              ResultSet rs = ps.executeQuery();
              boolean patientExists = rs.next();
              if (patientExists) {
                patientId = rs.getString("patientId");
                rs.close();
                ps.close();
                sql = "update patients set placerPatientId = ?, govtId  = ?, geneticGender = ?, address1 = ?, address2 = ?, city = ?, state = ?, postalCode = ?, country = ?, phone1 = ?, phone2 = ?, eventId = ?, ethnicity = ? " + 
                     "where patientId = ?";
                ps = conn.prepareStatement(sql);
                ps.setString(1, patient.placerId);
                ps.setString(2, patient.ssn);
                ps.setString(3, (patient.gender.equals("") ? "U" : patient.gender));
                ps.setString(4, patient.address1);
                ps.setString(5, patient.address2);
                ps.setString(6, patient.city);
                ps.setString(7, patient.state);
                ps.setString(8, patient.postalCode);
                ps.setString(9, patient.countryCode);
                ps.setString(10, patient.phone1);
                ps.setString(11, patient.phone2);
                ps.setLong(12, eventId);
                ps.setString(13, patient.raceCSL);
                ps.setString(14, patientId);
                logger.info(ps.toString());
                ps.executeUpdate();
                ps.close();
              } else {
                // get new patient id
                patientId = Switchboard.generateNextInSequenceWPrefix("patientId");
                // insert into containers
                sql = "insert into containers (containerId, containerType, eventId) values (?, 'patientId', ?)";
                ps.close();
                ps = conn.prepareStatement(sql);
                ps.setString(1, patientId);
                ps.setLong(2, eventId);
                logger.info(ps.toString());
                ps.executeUpdate();
                ps.close();
                // insert into contents
                sql = "insert into contents (containerId, attribute, contentType, content, eventId) values (?, 'self', 'Patient', ?, ?)";
                ps = conn.prepareStatement(sql);
                ps.setString(1, patientId);
                ps.setString(2, patientId);
                ps.setLong(3, eventId);
                logger.info(ps.toString());
                ps.executeUpdate();
                ps.close();
                // insert new patient
                 sql = "insert into patients (status, patientId, placerPatientId, govtId, firstName, middleName, lastName, dob, geneticGender, address1, address2, city, state, postalCode, country, phone1, phone2, eventId, ethnicity) " + 
                     "values ('active',?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
                ps = conn.prepareStatement(sql);
                ps.setString(1, patientId);
                ps.setString(2, patient.placerId);
                ps.setString(3, patient.ssn);
                ps.setString(4, patient.firstName);
                ps.setString(5, patient.middleName);
                ps.setString(6, patient.lastName);
                ps.setString(7, patient.dob);
                ps.setString(8, (patient.gender.equals("") ? "U" : patient.gender));
                ps.setString(9, patient.address1);
                ps.setString(10, patient.address2);
                ps.setString(11, patient.city);
                ps.setString(12, patient.state);
                ps.setString(13, patient.postalCode);
                ps.setString(14, patient.countryCode);
                ps.setString(15, patient.phone1);
                ps.setString(16, patient.phone2);
                ps.setLong(17, eventId);
                ps.setString(18, patient.raceCSL);
                logger.info(ps.toString());
                ps.executeUpdate();
                ps.close();
              }
            }
            // update patientSources set master to 0
            sql = "update patientSources set master = ? where patientId = ? and master = ?";
            ps = conn.prepareStatement(sql);
            ps.setInt(1, 0);
            ps.setString(2, patientId);
            ps.setInt(3, 1);
            logger.info(ps.toString());
            ps.executeUpdate();
            ps.close();

            // insert into containerHistory
            sql = "insert into containerHistory (containerId, eventId) values (?, ?)";
            ps = conn.prepareStatement(sql);
            ps.setString(1, patientId);
            ps.setLong(2, eventId);
            logger.info(ps.toString());
            ps.executeUpdate();
            ps.close();

            // insert into patientSources
             sql = "insert into patientSources (master, siteId, patientId, sqId, sqidNumberType, assigningAuthority, mrn, mrnType, mrnFacility, placerPatientId, firstName, middleName, lastName, status, address1, address2, city, state, postalCode, dob, geneticGender, govtId, ethnicity, phone1, phone2, eventId) "+
                 "values (1,?,?,?,?,?,?,?,?,?,?,?,?,'active',?,?,?,?,?,?,?,?,?,?,?,?)";
            ps = conn.prepareStatement(sql);
            ps.setString(1, patient.siteId);
            ps.setString(2, patientId);
            ps.setString(3, patient.sqid);
            ps.setString(4, patient.sqidType);
            ps.setString(5, patient.sqidAssigningAuthority);
            ps.setString(6, patient.mrn == null ? "" : patient.mrn);
            ps.setString(7, patient.mrnType);
            ps.setString(8, patient.mrnAssigningAuthority);
            ps.setString(9, patient.placerId);
            ps.setString(10, patient.firstName);
            ps.setString(11, patient.middleName);
            ps.setString(12, patient.lastName);
            ps.setString(13, patient.address1);
            ps.setString(14, patient.address2);
            ps.setString(15, patient.city);
            ps.setString(16, patient.state);
            ps.setString(17, patient.postalCode);
            ps.setString(18, patient.dob);
            ps.setString(19, patient.gender.equals("") ? "U" : patient.gender);
            ps.setString(20, patient.ssn);
            ps.setString(21, patient.raceCSL);
            ps.setString(22, patient.phone1);
            ps.setString(23, patient.phone2);
            ps.setLong(24, eventId);
            logger.info(ps.toString());
            ps.executeUpdate();
            ps.close();

            // deal with patientEthnicities
            sql = "DELETE from patientEthnicities WHERE patientId = ?";
            ps = conn.prepareStatement(sql);
            ps.setString(1, patientId);
            logger.info(ps.toString());
            ps.executeUpdate();
            ps.close();

            if (patient.raceList.size() > 0) {
              sql = "INSERT into patientEthnicities (patientId, ethnicityName, eventId) values (?,?,?)";
              for (int i = 1; i < patient.raceList.size(); i++)
                sql += ",(?,?,?)";
              ps = conn.prepareStatement(sql);
              for (int i = 0; i < patient.raceList.size(); i++) {
                ps.setString(1 + (3 * i), patientId);
                ps.setString(2 + (3 * i), patient.raceList.get(i));
                ps.setLong(3 + (3 * i), eventId);
              }
              logger.info(ps.toString());
              ps.executeUpdate();
              ps.close();
            }

            // PV1 DB
            if(doctors.length>0) {
              sql = "SELECT physicianId from physicians WHERE providerId = ?";
              ps = conn.prepareStatement(sql);
              ps.setString(1, npi);
              logger.info(ps.toString());
              ResultSet rs = ps.executeQuery();
              boolean physicianExists = rs.next();
              if (physicianExists) {
                physicianId = rs.getString("physicianId");
                rs.close();
                ps.close();
                // ensure physiciansite exists
                sql = "SELECT 1 from physicianSites where physicianId = ? and siteId = ? limit 1";
                ps = conn.prepareStatement(sql);
                ps.setString(1, physicianId);
                ps.setString(2, patient.siteId);
                logger.info(ps.toString());
                rs = ps.executeQuery();
                boolean siteExists = rs.next();
                rs.close();
                ps.close();
                if (!siteExists) {
                  sql = "INSERT into physicianSites (physicianId, siteId, eventId) values (?,?,?)";
                  ps = conn.prepareStatement(sql);
                  ps.setString(1, physicianId);
                  ps.setString(2, patient.siteId);
                  ps.setLong(3, eventId);
                  logger.info(ps.toString());
                  ps.executeUpdate();
                  ps.close();
                }
              } else { // create physician
                physicianId = Switchboard.generateNextInSequenceWPrefix("physicianId");
                sql = "insert into physicians (physicianId, first_name, last_name, middle_name, providerId, eventId) values (?,?,?,?,?,?)";
                ps.close();
                ps = conn.prepareStatement(sql);
                ps.setString(1, physicianId);
                ps.setString(2, physicianFirst);
                ps.setString(3, physicianLast);
                ps.setString(4, physicianMiddle);
                ps.setString(5, npi);
                ps.setLong(6, eventId);
                logger.info(ps.toString());
                ps.executeUpdate();
                ps.close();
                // create physiciansite
                sql = "INSERT into physicianSites (physicianId, siteId, eventId) values (?,?,?)";
                ps = conn.prepareStatement(sql);
                ps.setString(1, physicianId);
                ps.setString(2, patient.siteId);
                ps.setLong(3, eventId);
                logger.info(ps.toString());
                ps.executeUpdate();
                ps.close();
              }
            }
          } else if (hapiMsg instanceof ORU_R01) {

            logger.debug("Beginning processing of ORU_R01 msg: " + HL7File + ".");
            ORU_R01 oruMsg = (ORU_R01) hapiMsg;
            for (ORU_R01_ORDER_OBSERVATION orderObsrv : oruMsg.getPATIENT_RESULT().getORDER_OBSERVATIONAll()) {
              // OBR
              OBR obr = orderObsrv.getOBR();
              // TODO: need to ensure that this is where runId will live
              String runId = obr.getObr3_FillerOrderNumber().getEi1_EntityIdentifier().getValue();
              if(runId == null)
                throw new RequiredFieldNotFoundException("runId","ORB.3");
              boolean isControl = runId.startsWith(CONTROL_RUN_PREFIX);
              String step;
              String currContainerId;
              String currParentId;
              String containerId;
              String currParentPosition;
              int specimenOrControlRunsId;

              sql = "Select value from containerProperties where containerId = ? AND property='"+DI_STEP_PROPERTY_STRING+"'";
              ps = conn.prepareStatement(sql);
              ps.setString(1, runId);
              logger.info(ps.toString());
              ResultSet rs = ps.executeQuery();
              if (rs.next()) {
                step = rs.getString("value");
                rs.close();
                ps.close();
              }else {
                rs.close();
                ps.close();                
                throw new Exception("Could not find step for runId: " + runId);
              }
              
              //specimen or control runs
              String specimenOrControlRunsTableName = isControl?"controlRuns":"specimenRuns";
              String runIdColumnName = isControl?"controlRunId":"runId";          
              
              sql = "SELECT id, currentContainerId, currentParentId, currentParentPosition from "+specimenOrControlRunsTableName+" where "+runIdColumnName+" = ?";
              ps = conn.prepareStatement(sql);
              ps.setString(1, runId);
              logger.info(ps.toString());
              rs = ps.executeQuery();
              if (rs.next()) {
                specimenOrControlRunsId = rs.getInt("id");
                currContainerId = rs.getString("currentContainerId");
                currParentId = rs.getString("currentParentId");
                containerId = currParentId == null ? currContainerId : currParentId;
                currParentPosition = rs.getString("currentParentPosition");
                rs.close();
                ps.close();
              } else {
                rs.close();
                ps.close();                
                throw new Exception("Could not find specimenOrControlRun: " + runId);
              }
              
              boolean hadDefinedResults = false;
              // OBSERVATIONS
              List<ORU_R01_OBSERVATION> observations = orderObsrv.getOBSERVATIONAll();
              for (ORU_R01_OBSERVATION obsrv : observations) {
                // OBX
                OBX obx = obsrv.getOBX();
                String setId = obx.getSetIDOBX().getValue();
                String type = obx.getObx2_ValueType().getValue();
                String resultId = obx.getObx3_ObservationIdentifier().getCe1_Identifier().getValue();
                Varies[] obValues = obx.getObx5_ObservationValue();
                if(obValues.length == 0) { // skip if empty
                  logger.info(runId+": Skipping blank value for: "+resultId);
                  continue;
                }
                Type testData = obValues[0].getData();            
                String methodName = obr.getObr18_PlacerField1().getValue();
                String units = obx.getObx6_Units().getCe1_Identifier().getValue();            
                String referenceRange = obx.getObx7_ReferencesRange().getValue();
                if(referenceRange != null)
                  referenceRange = "Range: " + referenceRange;                 
                String testValueStr = null;
                BigDecimal testValueNum = null;
                Timestamp testValueDatetime = null;
                String imgResultValue = null;

                int analysisDataDefinitionId;
                DataLimitType limitType = null;
                int sigFig = 0;                
                // TODO: add modifier support
                boolean isModifier;
                // String dataType;
                // int sigFig;

                sql = "SELECT adf.id as analysisDataDefinitionId, definerType, limitType, sigFig FROM analysisDataDefinition adf"
                    + " JOIN analysisMethodVersions amv on adf.analysisMethodVersionsId = amv.id JOIN analysisMethods am on amv.analysisMethodsId=am.id"
                    + " WHERE amv.active = 1 AND am.methodName = ?"
                    + " AND am.analysisStepName = ? AND adf.resultCode = ?";
                ps = conn.prepareStatement(sql);
                ps.setString(1, methodName);
                ps.setString(2, step);
                ps.setString(3, resultId);
                logger.info(ps.toString());
                rs = ps.executeQuery();
                if (rs.next()) {
                  analysisDataDefinitionId = rs.getInt("analysisDataDefinitionId");
                  isModifier = rs.getString("definerType").equals("modifier");
                  String lt = rs.getString("limitType");
                  if(lt != null) {
                    try {
                      limitType = DataLimitType.valueOf(lt);
                    }catch(IllegalArgumentException iae) {
                      logger.info("Unsupported limit type '"+lt+"' for "+ step + ":" +methodName+":"+ resultId);                    
                    }
                  }
                  sigFig = rs.getInt("sigFig"); // if is null, should return 0                  
                  rs.close();
                  ps.close();
                  // dataType = rs.getString("dataType");
                  // sigFig = rs.getInt("sigFig");
                  hadDefinedResults = true;
                } else {
                  rs.close();
                  ps.close();                  
                  logger.info("Could not find active data definition for " + step + ":" +methodName+":"+ resultId+". Skipping.");
                  continue;
                  //throw new Exception("Could not find active data definition for " + step + ":" +methodName+":"+ resultId);
                }

                if (testData instanceof NM) { // numeric
                  testValueNum = new BigDecimal(((NM) testData).getValue());
                } else if (testData instanceof TX) { // text
                  testValueStr = ((TX) testData).getValue();
                } else if (testData instanceof TS) { // datetime
                  testValueDatetime = new Timestamp(((TS) testData).getTs1_Time().getValueAsDate().getTime());
                } else if (testData instanceof ED) {
                    ED ed = (ED) testData;
                    
                    byte[] byteData = extractEncapsulatedData(ed);
                    if(byteData != null) {
                        if(!validateFileContent(maxFileSize, byteData)) {
                            throw new Exception("File size limit exceeded. Max file size: " + String.valueOf(maxFileSize));
                        }
                        
                        String dataSubTypeRaw = ed.getEd3_DataSubtype().getValue();
                        DataSubType dataSubType = DataSubType.convertStrToDataSubType(dataSubTypeRaw);
                        String filename = String.valueOf(eventId) + "_" + setId + "." + dataSubType.toExtension();
                        imgResultValue = writeToFile(byteData, runId, filename, extractedFilesPath, eventId);
                        
                        
                    }
                } else { // assume text until more implementation known
                  testValueStr = testData.toString();
                }

                // If datetime of the OBX is needed...
                // String units = obx.getObx6_Units().getCe1_Identifier().getValue();
                // DTM obDT = obx.getObx14_DateTimeOfTheObservation().getTs1_Time();
                // Date date = obDT.getValueAsDate();
                 //String obDateTimeString = obDT.getYear()+"-"+obDT.getMonth()+"-"+obDT.getDay()+" "+obDT.getHour()+":"+obDT.getMinute()+":"+obDT.getSecond();

                // DB Inserts
                
                String dataRunsTableName = isControl?"analysisControlDataRuns":"analysisDataRuns";
                String controlOrSpecimenRunsColumnName = isControl?"controlRunsId":"specimenRunsId";
                
                sql = "INSERT INTO "+dataRunsTableName
                    + " ("+controlOrSpecimenRunsColumnName+", currentContainerId, currentParentId, currentParentPosition, eventId)"
                    + " VALUES(?,?,?,?,?)";
                ps = conn.prepareStatement(sql);
                ps.setInt(1, specimenOrControlRunsId);
                ps.setString(2, currContainerId);
                ps.setString(3, currParentId);
                ps.setString(4, currParentPosition);
                ps.setLong(5, eventId);
                logger.info(ps.toString());
                ps.executeUpdate();
                ps.close();

                int dataRunsId;
                sql = "SELECT LAST_INSERT_ID()";
                rs = conn.createStatement().executeQuery(sql);
                if (rs.next()) {                  
                  dataRunsId = rs.getInt(1);
                  rs.close();
                  ps.close();
                }else {
                  rs.close();
                  ps.close();
                  throw new Exception("Error getting analysisDataRunsId");
                }
                
                String interpretation = ((Varies)obx.getField(27,0)).getData().toString();
                
                // need to save datalimit if it doesn't come in from DI and it exists in the configuration
                if(referenceRange == null) {
                  sql = "SELECT lowerLimit, upperLimit, discrete FROM analysisDataLimits WHERE analysisDataDefinitionId = ?";
                  ps = conn.prepareStatement(sql);
                  ps.setInt(1, analysisDataDefinitionId);
                  logger.info(ps.toString());
                  rs = ps.executeQuery();
                  if(rs.isBeforeFirst()) {
                    if(limitType == null) {
                      logger.info("Limit type not set for configured data limit.");  
                    }else if(testValueNum != null) {
                      if(limitType == DataLimitType.discrete) {
                        try {
                          String targetListString = "";
                          while(rs.next()) {
                            String discLimVal = rs.getString("discrete");
                            if(discLimVal == null) {
                              logger.info("Warning: No discrete value present in configured analysisDataLimits row to compare to.");
                              continue;
                            }
                            BigDecimal bd = new BigDecimal(discLimVal).setScale(sigFig, RoundingMode.HALF_UP);
                            targetListString += " "+bd.toPlainString()+",";
                          }
                          if(!targetListString.isEmpty()) {
                            targetListString = StringUtils.chop(targetListString);
                            referenceRange = "Target:"+targetListString;
                          }
                        }catch(NumberFormatException nfe) {
                          logger.info("Could not compare incoming value to configured limit.");  
                        }                        
                      }else if(limitType == DataLimitType.threshold) {
                        rs.next();
                        BigDecimal bd = rs.getBigDecimal("upperLimit").setScale(sigFig, RoundingMode.HALF_UP);
                        if(rs.wasNull()) 
                          logger.info("Warning: No upperLimit value present in configured analysisDataLimits row to compare to.");
                        else {
                          referenceRange = "Threshold: "+bd.toPlainString();
                        }
                      }else if(limitType == DataLimitType.range) {
                        rs.next();
                        BigDecimal bdl = rs.getBigDecimal("lowerLimit").setScale(sigFig, RoundingMode.HALF_UP);
                        if(rs.wasNull())
                          logger.info("Warning: lowerLimit not set in configured analysisDataLimits row.");
                        else {
                          BigDecimal bdu = rs.getBigDecimal("upperLimit").setScale(sigFig, RoundingMode.HALF_UP);
                          if(rs.wasNull())
                            logger.info("Warning: upperLimit not set in configured analysisDataLimits row.");
                          else {
                            referenceRange = "Range: "+bdl.toPlainString()+" - "+bdu.toPlainString();
                          }
                        }
                      }else 
                        logger.info("Unimplemented limitType: "+limitType);                     
                    }else if(testValueStr != null) {                      
                      String targetListString = "";
                      while(rs.next()) {
                        String discreteValue = rs.getString("discrete");
                        if(discreteValue == null) {
                          logger.info("Warning: No discrete value present in configured analysisDataLimits row to compare to.");
                          continue;
                        }
                        targetListString += " "+discreteValue+",";
                      }
                      if(!targetListString.isEmpty()) {
                        targetListString = StringUtils.chop(targetListString);
                        referenceRange = "Target:"+targetListString;
                      }
                    }else{
                      logger.info("Data interpretation found unsupported data type: "+testData.getClass());
                    }
                  }
                  rs.close();                  
                  ps.close();
                }

                // If interpretation is null, then need to attempt to calculate an interpretation from analysisDataLimits
                //   and get the appropriate interpretation string from analysisDataIterpretation.               
                // For discrete values, there may be multiple rows in analysisDataLimits for multiple possible valid discrete values
                if(interpretation == null) {
                  sql = "SELECT lowerLimit,"
                      + "upperLimit,"
                      + "discrete,"
                      + "belowLower,"
                      + "equalLower,"
                      + "betweenLowerUpper,"
                      + "equalUpper,"
                      + "aboveUpper,"
                      + "equalDiscrete,"
                      + "notEqualDiscrete"
                      + " FROM analysisDataLimits adl"
                      + " JOIN analysisDataInterpretation adi on adi.analysisDataLimitsId = adl.id"
                      + " WHERE analysisDataDefinitionId = ?";
                  ps = conn.prepareStatement(sql);
                  ps.setInt(1, analysisDataDefinitionId); 
                  logger.info(ps.toString());
                  rs = ps.executeQuery();
                  if(rs.isBeforeFirst()) {
                    if(limitType == null) {
                      logger.info("Limit type not set for configured interpretation.");  
                    }else if(testValueNum != null) {
                      double result = testValueNum.setScale(sigFig, RoundingMode.HALF_UP).doubleValue();
                      if(limitType == DataLimitType.discrete) {
                        try {
                          boolean discreteFound = false;
                          while(rs.next()) {                       
                            String discLimVal = rs.getString("discrete");
                            if(discLimVal == null) {
                              logger.info("Warning: No discrete value present in configured analysisDataLimits row to compare to.");
                              continue;
                            }
                            BigDecimal bd = new BigDecimal(discLimVal).setScale(sigFig, RoundingMode.HALF_UP);
                            Double doubleLimVal = bd.doubleValue();
                            if(result == doubleLimVal) {
                              interpretation = rs.getString("equalDiscrete");
                              discreteFound = true;
                              break;
                            }
                          }
                          if(!discreteFound) {
                            rs.first();                            
                            interpretation = rs.getString("notEqualDiscrete");
                          }
                        }catch(NumberFormatException nfe) {
                          logger.info("Could not compare incoming value to configured limit.");  
                        }                        
                      }else if(limitType == DataLimitType.threshold) {
                        rs.next();
                        BigDecimal bd = rs.getBigDecimal("upperLimit").setScale(sigFig, RoundingMode.HALF_UP);
                        double doubleLimVal = bd.doubleValue();
                        if(rs.wasNull()) 
                          logger.info("Warning: No upperLimit value present in configured analysisDataLimits row to compare to.");
                        else {
                          if(result < doubleLimVal)
                            interpretation = rs.getString("belowLower");
                          else if(result == doubleLimVal)
                            interpretation = rs.getString("equalLower");
                          else if(result > doubleLimVal)
                            interpretation = rs.getString("aboveUpper");
                        }
                      }else if(limitType == DataLimitType.range) {
                        rs.next();
                        BigDecimal bdl = rs.getBigDecimal("lowerLimit").setScale(sigFig, RoundingMode.HALF_UP);
                        if(rs.wasNull())
                          logger.info("Warning: lowerLimit not set in configured analysisDataLimits row.");
                        else {
                          double lowerLimit = bdl.doubleValue();
                          BigDecimal bdu = rs.getBigDecimal("upperLimit").setScale(sigFig, RoundingMode.HALF_UP);
                          if(rs.wasNull())
                            logger.info("Warning: upperLimit not set in configured analysisDataLimits row.");
                          else {
                            double upperLimit = bdu.doubleValue();                        
                            if(result < lowerLimit)
                              interpretation = rs.getString("belowLower");
                            else if(result == lowerLimit)
                              interpretation = rs.getString("equalLower");
                            else if(result > lowerLimit && result < upperLimit)
                              interpretation = rs.getString("betweenLowerUpper");
                            else if(result == upperLimit)
                              interpretation = rs.getString("equalUpper");
                            else if(result > upperLimit)
                              interpretation = rs.getString("aboveUpper");
                          }
                        }
                      }else 
                        logger.info("Unimplemented limitType: "+limitType);
                      
                    }else if(testValueStr != null) {
                      boolean discreteFound = false;
                      while(rs.next()) {
                        String discreteValue = rs.getString("discrete");
                        if(discreteValue == null) {
                          logger.info("Warning: No discrete value present in configured analysisDataLimits row to compare to.");
                          continue;
                        }
                        if(rs.getString("discrete").equals(testValueStr)) {
                         interpretation = rs.getString("equalDiscrete");
                         discreteFound = true;
                         break;
                        }
                      }
                      if(!discreteFound) {
                        rs.first();
                        interpretation = rs.getString("notEqualDiscrete");
                      }
                    }else{
                      logger.info("Data interpretation found unsupported data type: "+testData.getClass());
                    }
                  }
                  rs.close();
                  ps.close();                  
                }
                
                String analysisDataTableName = isControl?"analysisControlData":"analysisData";
                String dataRunsIdColumnName = isControl?"analysisControlDataRunsId":"analysisDataRunsId";
                
                sql = "INSERT INTO "+analysisDataTableName
                    + " ("+dataRunsIdColumnName+", analysisDataDefinitionId, varcharResult,"
                    + " decimalResult, dateTimeResult, imageResult, referenceRange, units, eventId,"
                    + " calculatedInterpretation, actualInterpretation, interpretationEventId)"
                    + " VALUES(?,?,?,?,?,?,?,?,?,?,?,?)";
                ps = conn.prepareStatement(sql);
                ps.setInt(1, dataRunsId); 
                ps.setInt(2, analysisDataDefinitionId); 
                ps.setString(3, testValueStr);
                ps.setBigDecimal(4, testValueNum);
                ps.setTimestamp(5, testValueDatetime);
                ps.setString(6, imgResultValue);
                if(referenceRange != null) {
                    ps.setString(7, referenceRange);
                } else {
                    ps.setNull(7, Types.VARCHAR);
                }
                ps.setString(8, units);
                ps.setLong(9, eventId);
                ps.setString(10, interpretation);
                ps.setString(11, interpretation);              
                if(interpretation != null)
                  ps.setLong(12, eventId);
                else
                  ps.setNull(12, Types.BIGINT);
                logger.info(ps.toString());
                ps.executeUpdate();
                ps.close();

                // Move run to results received step
                sql = "UPDATE queues set step = ? where containerId = ? and step = ?";
                ps = conn.prepareStatement(sql);
                ps.setString(1, DI_RECEIVED_STEP);
                ps.setString(2, runId);
                ps.setString(3, DI_WAITING_STEP);
                logger.info(ps.toString());
                ps.executeUpdate();
                ps.close();

                // Move parent to next step on queue
                // check if all waiting specimen runs have results
                sql = "SELECT CASE EXISTS (SELECT 1 from specimenRuns LEFT OUTER JOIN queues on runId = containerId "+
                    "AND ? = step WHERE currentParentId = ? AND step IS NULL LIMIT 1) "
                    +"WHEN 0 THEN b'1' ELSE b'0' END";
                ps = conn.prepareStatement(sql);
                ps.setString(1, DI_RECEIVED_STEP);            
                ps.setString(2, currParentId);
                logger.info(ps.toString());
                rs = ps.executeQuery();
                 boolean allSpecimenResultsReceived = false;            
                if(rs.next())
                  allSpecimenResultsReceived = rs.getBoolean(1);
                rs.close();
                ps.close();
                // check if all waiting controls runs have results            
                sql = "SELECT CASE EXISTS (SELECT 1 from controlRuns LEFT OUTER JOIN queues on controlRunId = containerId "+
                    "AND ? = step WHERE currentParentId = ? AND step IS NULL LIMIT 1) "
                    +"WHEN 0 THEN b'1' ELSE b'0' END";
                ps = conn.prepareStatement(sql);
                ps.setString(1, DI_RECEIVED_STEP);            
                ps.setString(2, currParentId);
                logger.info(ps.toString());
                rs = ps.executeQuery();            
                boolean allControlResultsReceived = false;
                if(rs.next())
                  allControlResultsReceived = rs.getBoolean(1);            
                rs.close();
                ps.close();
                if(allSpecimenResultsReceived && allControlResultsReceived) {
                  String nextStep = null;
                
                  sql = "SELECT nextStep from protocolSteps where displayName = ?";
                  ps = conn.prepareStatement(sql);
                  ps.setString(1, step); // parent step, same one being used in containerProperties and analysisMethods
                  logger.info(ps.toString());              
                  rs = ps.executeQuery();
                  if(rs.next())
                    nextStep = rs.getString(1);
                  rs.close();
                  ps.close();
                  String currentParentStep = step + DI_HOLD_STEP_ADD_STRING; // this is messy, because we're hoping that this hold addition is going to not change
                  
                  sql = "UPDATE queues set step = ?, eventId = ? where containerId = ? and step = ?";
                  ps = conn.prepareStatement(sql);
                  ps.setString(1, nextStep);
                  ps.setLong(2, eventId);
                  ps.setString(3, currParentId);
                  ps.setString(4, currentParentStep);
                  logger.info(ps.toString());              
                  ps.executeUpdate();
                  ps.close();
                }
              }  
              if(!hadDefinedResults)
                throw new Exception("HL7 message contained no results defined in LIMS. Message fails.");
            }              
          } else {
            throw new Exception("Unsupported trigger event: " + ((MSH) hapiMsg.get("MSH")).getMsh9_MessageType());
          }
        } catch (Exception e) {
          logger.error("Error processing HL7 file \"" + HL7File + "\"", e);
          success = false;
          try {
            conn.rollback();
          } catch (SQLException sqle) {
            logger.error("Could not rollback HL7 queries", sqle);
          }
        }

        if (success) {
          try {
            conn.commit();
            logger.info("Sucessfully processed HL7 file: \"" + HL7File + "\"");
            Files.move(HL7File, donePath.resolve(HL7File.getFileName()), StandardCopyOption.REPLACE_EXISTING);
          } catch (SQLException sqle) {
            logger.error("Problem in HL7 while committing to the DB: \"" + HL7File + "\"", sqle);
          } catch (Exception e) {
            logger.error("Problem moving successfully processed HL7 file", e);
          }
        } else {
          try {
            Files.move(HL7File, failedPath.resolve(HL7File.getFileName()), StandardCopyOption.REPLACE_EXISTING);
          } catch (Exception e) {
            logger.error("Problem moving failed HL7 file", e);
          }
        }

        try {
          if (conn != null)
            conn.close();
        } catch (SQLException sqle) {
          logger.error("Could not close HL7 SQL connection", sqle);
        }
      }
    
    /**
     * Extracts encapsulated image data and convert it to bytes
     * @param ed
     * @return 
     * @throws Exception
     */
    
    public byte[] extractEncapsulatedData(ED ed) throws Exception {
        
        // Only supports IM
        String dataType = ed.getEd2_TypeOfData().getValue();
        String dataSubTypeRaw = ed.getEd3_DataSubtype().getValue();
        String encoding = ed.getEd4_Encoding().getValue();
        String rawData = ed.getEd5_Data().getValue();
        DataSubType dataSubType = DataSubType.convertStrToDataSubType(dataSubTypeRaw);
        
        if(dataType.equalsIgnoreCase("IM") && dataSubType != null) {
            if(encoding.equalsIgnoreCase("Base64")) {
                try {
                    return convertToByteData(encoding, rawData);
                } catch (Exception e) {
                    logger.error("Failed to decode raw data");
                }
            } else {
                throw new Exception("Unsupported Encapsulated Data Encoding");
            }
        } else {
            throw new Exception("Unsupported Encapsulated Data Type + Sub Type: " + dataType + " " + dataSubType);
        }

        return null;
    }
    
    
    
    public byte[] convertToByteData(String encoding, String rawData) {
        switch(encoding) {
            case "Base64":
                return Base64.decodeBase64(rawData);
        }
        
        return null;
        
    }
    
    

    
    /**
     * Validates file content
     * @param max
     * @param byteData
     * @return
     */
    public boolean validateFileContent(long max, byte [] byteData) {
        return byteData.length <= max || max == -1;
    }
    
    /**
     * Writes the content to a file and automatically creates directories if path does not exist
     * 
     * @param byteData
     * @param id
     * @param filename
     * @throws IOException
   * @throws SQLException 
     */
    public String writeToFile(byte [] byteData, String id, String filename, Path folder, long eventId) throws IOException, SQLException {
        String fSep = System.getProperty("file.separator");
        String dirPathStr = folder + fSep + id;
        Path dirPath = Paths.get(dirPathStr);

        if(!Files.exists(dirPath)) {
            Files.createDirectories(dirPath);
        }
        
        String filePath = dirPathStr + fSep + filename;
        if(byteData != null) {
            FileOutputStream fout = new FileOutputStream(filePath);
            fout.write(byteData);
            fout.close();
            
            
            String sql = "INSERT INTO containerFiles (containerId, fileType, fileName, location, eventId) "
                    + " VALUES(?, ?, ?, ?, ?)";
            PreparedStatement ps = conn.prepareStatement(sql);
            ps.setString(1, id);
            ps.setString(2, "HL7 File");
            ps.setString(3, filename);
            ps.setString(4, dirPathStr);
            ps.setLong(5, eventId);
            ps.execute();
            
            return filePath;
        }
        
        return null;
   
    }
    
    private enum DataLimitType{
      discrete,
      threshold,
      range         
    }

}