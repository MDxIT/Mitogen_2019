package com.sunquest.mitogen.lims.fhir.provider;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
import java.util.Deque;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Properties;
import java.util.Set;
import java.util.TreeMap;

import org.apache.batik.dom.util.HashTable;
import org.apache.commons.codec.binary.Base64;
import org.apache.commons.io.FileUtils;
import org.hl7.fhir.instance.model.api.IBaseResource;
import org.hl7.fhir.r4.model.Address;
import org.hl7.fhir.r4.model.Attachment;
import org.hl7.fhir.r4.model.CodeableConcept;
import org.hl7.fhir.r4.model.Coding;
import org.hl7.fhir.r4.model.IdType;
import org.hl7.fhir.r4.model.Identifier;
import org.hl7.fhir.r4.model.Organization;
import org.hl7.fhir.r4.model.Observation;
import org.hl7.fhir.r4.model.DiagnosticReport;
import org.hl7.fhir.r4.model.Patient;
import org.hl7.fhir.r4.model.Reference;
import org.hl7.fhir.r4.model.DiagnosticReport.DiagnosticReportStatus;
import org.hl7.fhir.r4.model.Enumerations.AdministrativeGender;
import org.hl7.fhir.r4.model.Observation.ObservationComponentComponent;
import org.joda.time.DateTime;

import java.io.File;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.attribute.BasicFileAttributes;
import java.nio.file.attribute.FileTime;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.text.ParseException;

import ca.uhn.fhir.model.api.Include;
import ca.uhn.fhir.model.api.ResourceMetadataKeyEnum;
//import ca.uhn.fhir.model.dstu2.resource.Observation;
import ca.uhn.fhir.model.primitive.StringDt;
import ca.uhn.fhir.rest.annotation.IdParam;
import ca.uhn.fhir.rest.annotation.Operation;
import ca.uhn.fhir.rest.annotation.IncludeParam;
import ca.uhn.fhir.rest.annotation.Read;
import ca.uhn.fhir.rest.annotation.RequiredParam;
import ca.uhn.fhir.rest.annotation.ResourceParam;
import ca.uhn.fhir.rest.annotation.Search;
import ca.uhn.fhir.rest.param.TokenParam;
import ca.uhn.fhir.rest.server.IResourceProvider;
import ca.uhn.fhir.rest.server.exceptions.ResourceNotFoundException;

import com.ibm.icu.text.SimpleDateFormat;
import com.sunquest.mitogen.lims.dataObjects.ReportDetails;
import com.sunquest.mitogen.lims.dataObjects.RequestForm;
import com.sunquest.mitogen.lims.fhir.FHIRServlet;
import com.uniconnect.uniflow.Switchboard;
import com.uniconnect.uniflow.JDCConnection;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class DiagnosticReportResourceProvider implements IResourceProvider {

  // add a logger for the class
  private final Logger ourLog = LoggerFactory.getLogger(DiagnosticReportResourceProvider.class);
  
  public DiagnosticReportResourceProvider() {

  }

  @Override
  public Class<DiagnosticReport> getResourceType() {
    return DiagnosticReport.class;
  }

  /**
   * Get a specific diagnosticReport based on its identifier. Example calls:
   * /base/DiagnosticReport/1234
   * 
   * @param theId The report identifier.
   * @return Returns the full diagnosticReport resource matching this identifier,
   *         or null if none exists.
   */
  // /base/DiagnosticReport/1234
  @Read(version = false)
  public DiagnosticReport readDiagnosticReport(@IdParam IdType theId) throws SQLException{
    DiagnosticReport retVal = new DiagnosticReport();
    Connection conn;
    try {
			conn = Switchboard.getConnection();
		} catch (SQLException e1) {
			// Without a connection to the database we can't proceed any further
			// TODO: Probably another operationOutcome should be returned
      //return retVal;
      throw e1;
    }
    try {
      ReportDetails rd = new ReportDetails(conn);
      if (rd.LoadByID(theId.getIdPart())) {
        HashMap<String, String> includeHash = new HashMap<String, String>();
        retVal = populateData(rd, retVal, conn, includeHash);
      }
      else{
        //No matching ID
        throw new ResourceNotFoundException(theId);
      }
    }
    catch (SQLException e) {
      //TODO: Add OperationOutcome to outgoing result for exception case
      ourLog.error("Error loading Diagnostic report for: " + theId.getValue() + ". " + e.getMessage());
      try {
        conn.close();
        } catch (SQLException er) {
        // do nothing if this fails, the connection is closed
      }
      throw e;
    }
    return retVal;
  }

  // /base/DiagnosticReport?patient=76131
  /**
   * Get a list of diagnosticReport summary based on a specific patient. Example
   * calls: /base/DiagnosticReport?patient=76131
   * 
   * @param patientId The patient identifier (MRN).
   * @return List of diagnosticReport summary.
   */
  @Search
  public List<DiagnosticReport> findReportsByPatient(
      @RequiredParam(name = DiagnosticReport.SP_PATIENT) TokenParam patientId) throws SQLException {

    List<DiagnosticReport> retVal = new ArrayList<DiagnosticReport>(); // populate this
    Connection conn;
    try {
			conn = Switchboard.getConnection();
		} catch (SQLException e1) {
			// Without a connection to the database we can't proceed any further
			// TODO: Probably another operationOutcome should be returned
      //return retVal;
      throw e1;
		}
    try {
      RequestForm rf = new RequestForm(conn);
      ReportDetails rd = new ReportDetails(conn);
      List<ReportDetails> lrd = new LinkedList<ReportDetails>();
      List<RequestForm> lrf = rf.SearchByPatientId(patientId.getValue());
      for (RequestForm requestForm : lrf) {
        lrd.addAll(rd.SearchByRequestFormsID(requestForm.getId().toString()));
      }
      HashMap<String, String> includeHash = new HashMap<String, String>();
      for (ReportDetails rdDetails : lrd) {
        DiagnosticReport dr = new DiagnosticReport();
        retVal.add(populateData(rdDetails, dr, conn, includeHash));
      }
    } 
    catch (SQLException e) {
      //TODO: Add OperationOutcome to outgoing result for exception case
      ourLog.error("Error loading Diagnostic report for: " + patientId.getValue() + ". " + e.getMessage());
      try {
        conn.close();
        } catch (SQLException er) {
        // do nothing if this fails, the connection is closed
      }
      throw e;
    }
    return retVal;

  }

  // /base/DiagnosticReport?encounter.identifier=http://example.com/FHIR/uri/case_number|TS-19-00001
  /**
   * Get a list of diagnosticReport summary based on case number. Example calls:
   * /base/DiagnosticReport?encounter.identifier=http://example.com/FHIR/uri/case_number|TS-19-00001
   * 
   * @param caseNumber The case number, which is a token parameter (which has a
   *                   system URI, as well as the actual case number.)
   * @return List of diagnosticReport summary.
   */
  @Search
  public List<DiagnosticReport> findReportsByCaseNumber(
    @IncludeParam(allow = { "DiagnosticReport:subject", "DiagnosticReport:result" }) Set<Include> theIncludes,
    @RequiredParam(name = DiagnosticReport.SP_ENCOUNTER + '.' + DiagnosticReport.SP_IDENTIFIER) TokenParam caseNumber) throws SQLException {

    List<DiagnosticReport> retVal = new ArrayList<DiagnosticReport>(); // populate this
    Connection conn;
    try {
			conn = Switchboard.getConnection();
		} catch (SQLException e1) {
			// Without a connection to the database we can't proceed any further
			// TODO: Probably another operationOutcome should be returned
      //return retVal;
      throw e1;
		}
    try {
      RequestForm rf = new RequestForm(conn);
      ReportDetails rd = new ReportDetails(conn);
      List<ReportDetails> lrd = new LinkedList<ReportDetails>();
      List<RequestForm> lrf = rf.SearchByExternalRequestID(caseNumber.getValue());
      for (RequestForm requestForm : lrf) {
        lrd.addAll(rd.SearchByRequestFormsID(requestForm.getId().toString()));
      }
      HashMap<String, String> includeHash = new HashMap<String, String>();
      for(Include s: theIncludes){
        includeHash.put(s.getParamName(), s.getValue());
      }
      for (ReportDetails rdDetails : lrd) {
        DiagnosticReport dr = new DiagnosticReport();
        retVal.add(populateData(rdDetails, dr, conn, includeHash));
      }
    } catch (SQLException e) {
      //TODO: Add OperationOutcome to outgoing result for exception case
      ourLog.error("Error loading Diagnostic report for: " + caseNumber.getValue() + ". " + e.getMessage());
      try {
        conn.close();
        } catch (SQLException er) {
        // do nothing if this fails, the connection is closed
      }
      throw e;
    }
    ((JDCConnection) conn).expireLease();
    return retVal;
  }

  // for route: /base/DiagnosticReport/1234/$Observations
  // this is an Instance-Level Operations.

  @Operation(name = "Observations", idempotent = true)
  public List<Observation> getAllObservationsForReport(@IdParam IdType reportId) {
    // not formally implemented

    return new LinkedList<Observation>();

  }

  // Note: the following route is a bad one. can't do read with _include
  // for route: /base/DiagnosticReport/1234?_include:DiagnosticReport.result
  /*
   * @Read(version = true) public List<Observation> getObservations(@IdParam
   * IdType reportId,
   * 
   * @IncludeParam(allow= {"DiagnosticReport:result"}) Set<Include> theIncludes )
   * { // not formally implemented
   * 
   * return new LinkedList<Observation>();
   * 
   * }
   ***/

  /******************************************
   * DiagnosticReport?_include=DiagnosticReport:subject&identifier=<AP Case
   * Number>
   * 
   * /DiagnosticReport?_include=DiagnosticReport:subject&identifier=<system
   * Identifier for AP case number used by LIMS>|<AP Case Number>
   */
  // @Search()
  // public List<DiagnosticReport> getDiagnosticReportByCaseNumber(
  //     @RequiredParam(name = DiagnosticReport.SP_IDENTIFIER) TokenParam caseNumber,

  //     @IncludeParam(allow = { "DiagnosticReport:subject" }) Set<Include> theIncludes) {

  //   List<DiagnosticReport> retVal = new ArrayList<DiagnosticReport>();
  //   try {
  //     RequestForm rf = new RequestForm(Switchboard.getConnection());
  //     ReportDetails rd = new ReportDetails(Switchboard.getConnection());
  //     List<ReportDetails> lrd = new LinkedList<ReportDetails>();
  //     List<RequestForm> lrf = rf.SearchByExternalRequestID(caseNumber.getValue());
  //     for (RequestForm requestForm : lrf) {
  //       lrd.addAll(rd.SearchByRequestFormsID(requestForm.getId().toString()));
  //     }
  //   } catch (SQLException e) {
  //   }
  //   return retVal;
  // }

  /******************************
   * DiagnosticReport?_include=DiagnosticReport:subject&subject.identifier=<mrn
   * assigning auth>|<patient MRN> -- calls the patient provider to get the
   * patient
   * 
   * /DiagnosticReport?_include=DiagnosticReport:subject&subject.identifier=<patient
   * MRN> -- calls the patient provider to get the patient
   */
  @Search()
  public List<DiagnosticReport> getDiagnosticReportBySubjectMrn(
      @IncludeParam(allow = { "DiagnosticReport:subject", "DiagnosticReport:result" }) Set<Include> theIncludes,
      @RequiredParam(name = DiagnosticReport.SP_SUBJECT + '.' + DiagnosticReport.SP_IDENTIFIER) TokenParam theMrn) throws SQLException {

    List<DiagnosticReport> retVal = new ArrayList<DiagnosticReport>();
    Connection conn;
    try {
			conn = Switchboard.getConnection();
		} catch (SQLException e1) {
			// Without a connection to the database we can't proceed any further
			// TODO: Probably another operationOutcome should be returned
      //return retVal;
      throw e1;
		}
    try {
      RequestForm rf = new RequestForm(conn);
      ReportDetails rd = new ReportDetails(conn);
      List<ReportDetails> lrd = new LinkedList<ReportDetails>();
      List<RequestForm> lrf = rf.SearchByMRN(theMrn.getValue());
      for (RequestForm requestForm : lrf) {
        lrd.addAll(rd.SearchByRequestFormsID(requestForm.getId().toString()));
      }
      HashMap<String, String> includeHash = new HashMap<String, String>();
      for(Include s: theIncludes){
        includeHash.put(s.getParamName(), s.getValue());
      }
      for (ReportDetails rdDetails : lrd) {
        DiagnosticReport dr = new DiagnosticReport();
        retVal.add(populateData(rdDetails, dr, conn, includeHash));
      }
      
    } catch (SQLException e) {
      //TODO: Add OperationOutcome to outgoing result for exception case
      ourLog.error("Error loading Diagnostic report for: " + theMrn.getValue() + ". " + e.getMessage());
      try {
				conn.close();
			  } catch (SQLException er) {
				// do nothing if this fails, the connection is closed
      }
      throw e;
    }
    ((JDCConnection) conn).expireLease();
    return retVal;
  }

  /******************************************
   * /DiagnosticReport?_include=DiagnosticReport:subject&_include=DiagnosticReport:result&_id=<DiagnosticReport.id>
   */

  @Search()
  public List<DiagnosticReport> getDiagnosticReportByReportId(
      @IncludeParam(allow = { "DiagnosticReport:subject", "DiagnosticReport:result" }) Set<Include> theIncludes,
      @RequiredParam(name = DiagnosticReport.SP_RES_ID) TokenParam reportId) throws SQLException{

    List<DiagnosticReport> retVal = new ArrayList<DiagnosticReport>();
    Connection conn;
    try {
			conn = Switchboard.getConnection();
		} catch (SQLException e1) {
			// Without a connection to the database we can't proceed any further
      // TODO: Probably another operationOutcome should be returned
      throw e1;
			//return retVal;
		}
    try {
      ReportDetails rd = new ReportDetails(conn);
      if (rd.LoadByID(reportId.getValue())) {
        DiagnosticReport dr = new DiagnosticReport();
        HashMap<String, String> includeHash = new HashMap<String, String>();
        for(Include s: theIncludes){
          includeHash.put(s.getParamName(), s.getValue());
        }
        retVal.add(populateData(rd, dr, conn, includeHash));
      }
    } 
    catch (SQLException e) {
      //TODO: Add OperationOutcome to outgoing result for exception case
      ourLog.error("Error loading Diagnostic report for: " + reportId.getValue() + ". " + e.getMessage());
      try {
				conn.close();
			  } catch (SQLException er) {
				// do nothing if this fails, the connection is closed
      }
      throw e;
    }
    ((JDCConnection) conn).expireLease();
    return retVal;
  }

  // for route:
  // /base/DiagnosticReport?identifier=1234&_include=DiagnosticReport:subject&_include=DiagnosticReport:result
  @Search()
  public List<DiagnosticReport> getDiagnosticReportByReportID(
      @RequiredParam(name = DiagnosticReport.SP_IDENTIFIER) TokenParam theIdentifier,

      @IncludeParam(allow = { "DiagnosticReport:subject", "DiagnosticReport:result" }) Set<Include> theIncludes) throws SQLException {

    List<DiagnosticReport> retVal = new ArrayList<DiagnosticReport>();
    Connection conn;
    try {
			conn = Switchboard.getConnection();
		} catch (SQLException e1) {
			// Without a connection to the database we can't proceed any further
			// TODO: Probably another operationOutcome should be returned
      //return retVal;
      throw e1;
		}
    try {
      com.sunquest.mitogen.lims.dataObjects.ReportDetails report = new ReportDetails(conn);
      if (report.LoadByReportID(theIdentifier.getValue())) {
        DiagnosticReport dr = new DiagnosticReport();
        HashMap<String, String> includeHash = new HashMap<String, String>();
        for(Include s: theIncludes){
          includeHash.put(s.getParamName(), s.getValue());
        }
        retVal.add(populateData(report, dr, conn, includeHash));
      }
    } catch (SQLException e) {
      //TODO: Add OperationOutcome to outgoing result for exception case
      ourLog.error("Error loading Diagnostic report for: " + theIdentifier.getValue() + ". " + e.getMessage());
      try {
        conn.close();
      } catch (SQLException er) {
        // do nothing if this fails, the connection is closed
      }
      throw e;
    }
    // this allows the reaper to see this connection is no longer in use and can be
    // properly cleaned up
    ((JDCConnection) conn).expireLease();
    return retVal;
  }

  // User Story 510215
  public DiagnosticReport populateData(com.sunquest.mitogen.lims.dataObjects.ReportDetails report, DiagnosticReport dr,
      Connection conn, HashMap<String, String> includeHash) {

    // i)
    dr.setId(report.getId());
    ResourceMetadataKeyEnum.ENTRY_SEARCH_MODE.put(dr, "match");
    // iii)
    RequestForm rf = new RequestForm(conn);
    try {
      List<RequestForm> rfList = new ArrayList<>();
      rfList = rf.SearchByRequestID(report.getRequestFormsId());
      if (rfList.size() == 0) {
        // if it returned empty, break out...
        return null;
      }
      // ii) -----
      List<Identifier> idList = new ArrayList<Identifier>();
      Identifier identifier = new Identifier();
      identifier.setValue(rfList.get(0).getExternalRequestId());
      identifier.setSystem("https://www.sunquestinfo.com/docs/lims/fhir/code-systems/external-order-number");
      idList.add(identifier);
      dr.setIdentifier(idList);
      // -------
      PatientResourceProvider prp = new PatientResourceProvider();
      IdType theId = new IdType();
      theId.setValue(rfList.get(0).getPatientId());
      Patient p = prp.readPatient(theId);
      if (includeHash.containsKey("subject")) {
        dr.getSubject().setResource(p);
      } else {
        dr.getSubject().setReference("Patient/" + p.getId());
      }
    } catch (SQLException e) {
      ourLog.error("Error finding patient/requestForm for report: " + report.getId() + ". " + e.getMessage());
    }

    // iv)
    if (report.getReportType() != null) {
      DiagnosticReportStatus drs;
      String limsStatus = report.getStatus().toLowerCase();
      if(limsStatus.equals("released")){
        switch (report.getReportType().toLowerCase()) {
          case "addended":
            drs = DiagnosticReportStatus.APPENDED;
            break;
          case "amended":  
            drs = DiagnosticReportStatus.AMENDED;
            break;
          case "corrected":
            drs = DiagnosticReportStatus.CORRECTED;
            break;
          case "final":
            drs = DiagnosticReportStatus.FINAL;
            break; 
          case "canceled":
          case "qns":
          case "rejected":
            drs = DiagnosticReportStatus.CANCELLED;
            break;
          case "new":
            drs = DiagnosticReportStatus.REGISTERED;
            break;
          default:
            drs = null;
        }
      }
      else{ //anything not released
        switch (report.getReportType().toLowerCase()) {          
          case "addended":
          case "amended":  
          case "corrected":
          case "final":
          case "interim":
            drs = DiagnosticReportStatus.PARTIAL;
            break;
          case "canceled":
          case "qns":
          case "rejected":
            drs = DiagnosticReportStatus.CANCELLED;
            break;
          case "new":
            drs = DiagnosticReportStatus.REGISTERED;
            break;          
          default:
            drs = null;
        }
      }
      dr.setStatus(drs);
    }

    // v)
    CodeableConcept codeConcept = new CodeableConcept();
    Long k = report.getReportSettings().keySet().iterator().next();
    // This gets the first if multiple are present.
    codeConcept.setText(report.getReportSettings().get(k).getTitle());
    dr.setCode(codeConcept);
    

    report.getReportedData().forEach((key, v) -> {
      if(v.getActive().equals("1")){
        String pdfFilePath = v.getPDFFilePath();
        File file = new File(pdfFilePath);
        BasicFileAttributes attrs;
        FileTime time = null;
        try {
          attrs = Files.readAttributes(file.toPath(), BasicFileAttributes.class);
          time = attrs.creationTime();
          // viii) -----
          byte[] encoded = FileUtils.readFileToByteArray(file);
          Attachment attach = new Attachment();
          attach.setContentType("application/pdf");
          attach.setData(encoded);
          // ix)
          attach.setCreation(new Date(time.toMillis()));
          dr.addPresentedForm(attach);
          // -----------
        } catch (IOException e) {
          ourLog.error("Error reading/encoding pdf in file path (" + pdfFilePath + ") Error message: " + e.getMessage());
        }
      }
    });
    

    // vi)
    try{
      dr.setIssued(new SimpleDateFormat("yyyy-MM-dd' 'HH:mm:ss").parse(report.getStatusEvent().getEventDate()));
    }
    catch(ParseException p){
      ourLog.error("Unable to parse DateTime - " + p.getMessage());
    }
    catch(Exception e){
      ourLog.error("Failure to get StatusEvent - " + e.getMessage());
    }

    // vii)
    ObservationResourceProvider orp = new ObservationResourceProvider();
    HashMap<String, Observation> masterList = new HashMap<>();
    List<Observation> compList = new ArrayList<>();
    report.getReportResultData().forEach((key, v) -> {
      if (true == v.getCurrentResult()){
        
      
        IdType theObservationId = new IdType();
        theObservationId.setValue(key.toString());
        try {
          Observation toCopy = orp.readObservation(theObservationId);
          if(v.getIsOverall()){ // if its an overall, directly add it. 
            if (includeHash.containsKey("result")) {
              Reference r = new Reference();
              r.setResource(toCopy);
              dr.getResult().add(r);
            } else {
              Reference r = new Reference();
              r.setReference("Observation/" + toCopy.getId());
              dr.getResult().add(r);
            }
          }
          else if(v.getIsPanelOverall()){
            String code = toCopy.getCode().getCoding().get(0).getCode();
            masterList.put(code, toCopy);
          }
          else{
            compList.add(toCopy);
          }
          
        }catch (Exception e) {
          if (e.getMessage().contains("404")) {
            // TODO
          }
          // TODO update when readObservation is done
        }
      }
    });

    for(Observation obs : compList){
      masterList.get(obs.getCode().getCoding().get(0).getCode()).getComponent().addAll(obs.getComponent());
    }
    
    masterList.forEach((code, obs) -> {
      List<String> list = new LinkedList<String>();
      obs.getComponent().forEach((z) -> {
        if (z.getCode().getCoding().size() != 0)
          list.add(z.getCode().getCoding().get(0).getCode());
      });
      Comparator<ObservationComponentComponent> compareByValue = 
						(ObservationComponentComponent o1, ObservationComponentComponent o2) -> {
              return list.indexOf(o1.getCode().getCoding().get(0).getCode())*100 
                      + o1.getCode().getText().compareToIgnoreCase(o2.getCode().getText()) 
                      - list.indexOf(o2.getCode().getCoding().get(0).getCode())*100;
      };
      obs.getComponent().sort(compareByValue);
      if (includeHash.containsKey("result")) {
        Reference r = new Reference();
        r.setResource(obs);
        dr.getResult().add(r);
      } else {
        Reference r = new Reference();
        r.setReference("Observation/" + obs.getId());
        dr.getResult().add(r);
      }
    });
    return dr;
  }
}