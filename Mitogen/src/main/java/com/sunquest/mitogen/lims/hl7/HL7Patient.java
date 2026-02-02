package com.sunquest.mitogen.lims.hl7;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import com.sunquest.mitogen.lims.hl7.RequiredFieldNotFoundException;

import ca.uhn.hl7v2.model.v251.datatype.CE;
import ca.uhn.hl7v2.model.v251.datatype.CX;
import ca.uhn.hl7v2.model.v251.datatype.PL;
import ca.uhn.hl7v2.model.v251.datatype.XAD;
import ca.uhn.hl7v2.model.v251.datatype.XPN;
import ca.uhn.hl7v2.model.v251.message.ADT_A05;
import ca.uhn.hl7v2.model.v251.message.ORM_O01;
import ca.uhn.hl7v2.model.v251.segment.PID;
import ca.uhn.hl7v2.model.v251.segment.PV1;

public class HL7Patient {
  private static final Logger logger = LogManager.getLogger();
  
  // PATIENTS
  public String placerId;
  public String ssn;
  public String sqid = null;
  public String firstName;
  public String middleName;
  public String lastName;
  public String dob;
  public ArrayList<String> raceList = new ArrayList<String>();
  public String raceCSL = "";
  public String gender;
  public String address1;
  public String address2;
  public String city;
  public String state;
  public String postalCode;
  public String countryCode;
  public String phone1;
  public String phone2;
  public String accountNumber;
  
  //PATIENT SOURCES
  public String siteId; // ORC is a required section in ORM for us, PV1 is required in ADT, this variable needs to be set for insertion into patientSources
  public String sqidType = null;
  public String sqidAssigningAuthority = null;
  public String mrn = null;
  public String mrnType = null;
  public String mrnAssigningAuthority = null;
  public String orderFacilityCode;
  
  public String patientId = "";
  
  private Connection conn;
  
  public HL7Patient(ADT_A05 adtMessage, Connection conn) throws Exception{
    this.conn=conn;
    processPID(adtMessage.getPID());
    processPV1(adtMessage.getPV1());
  }
  
  public HL7Patient(ORM_O01 ormMessage, Connection conn) throws Exception{
    this.conn=conn;
    processPID(ormMessage.getPATIENT().getPID());
    //orderFacilityCode = ormMessage.getORDER().getORC().getOrc21_OrderingFacilityName(0).getXon1_OrganizationName().getValue();
    processPV1(ormMessage.getPATIENT().getPATIENT_VISIT().getPV1());
  }
  
  private void processPV1(PV1 pv1) throws Exception {
    // PV1.3 - Location
    PL patientLoc = pv1.getPv13_AssignedPatientLocation();
    orderFacilityCode = patientLoc.getPl1_PointOfCare().getValue();
    if (orderFacilityCode == null) {
      throw new RequiredFieldNotFoundException("Ordering Facility Code","PV1.3.1");
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
  
  private void processPID(PID pid) {
    placerId = pid.getPid2_PatientID().getCx1_IDNumber().getValue();
    CX[] idList = pid.getPid3_PatientIdentifierList();
    for(CX cx: idList) {
      String type = cx.getCx5_IdentifierTypeCode().getValue(); // mrntype or sqidtype
      if(type != null && type.toUpperCase().contains("SQID")) {
        // sqid^^^sqidAssigningAuthority^sqidType^             
        sqidType = type;
        sqid = cx.getCx1_IDNumber().getValue();             
        sqidAssigningAuthority = cx.getCx4_AssigningAuthority().getHd1_NamespaceID().getValue();
      }else { // may need to check for MRN in string. Right now we're assuming an ID is an MRN if not otherwise specified.
        // mrn^^^mrnAssigningAuthority^mrnType^mrnFacility
        mrnType = type;
        mrn = cx.getCx1_IDNumber().getValue();             
        mrnAssigningAuthority = cx.getCx6_AssigningFacility().getHd1_NamespaceID().getValue();
      }
    }
    // pid.5: patientLast^patientFirst^patientMiddle^patient4^patient5         
    XPN pName = pid.getPid5_PatientName(0);
    firstName = pName.getXpn2_GivenName().getValue();
    middleName = pName.getXpn3_SecondAndFurtherGivenNamesOrInitialsThereof().getValue();
    lastName = pName.getXpn1_FamilyName().getFn1_Surname().getValue();
    
    dob = pid.getPid7_DateTimeOfBirth().getTime().getValue();
    gender = pid.getPid8_AdministrativeSex().getValue();
    CE[] races = pid.getPid10_Race();
    for(int i=0; i<races.length; i++) {
      String raceString = races[i].getCe1_Identifier().getValue(); 
      raceList.add(raceString);
      if(i>0)
        raceCSL += ",";
      raceCSL += raceString;                       
    }
    // pid.11: address1^address2^city^state^postalCode
    XAD pAddress = pid.getPid11_PatientAddress(0);         
    address1 = pAddress.getXad1_StreetAddress().getSad1_StreetOrMailingAddress().getValue();
    address2 = pAddress.getXad2_OtherDesignation().getValue();
    city = pAddress.getXad3_City().getValue();
    state = pAddress.getXad4_StateOrProvince().getValue();
    postalCode = pAddress.getXad5_ZipOrPostalCode().getValue();         
    countryCode = pid.getPid12_CountyCode().getValue();         
    phone1 = pid.getPid13_PhoneNumberHome(0).getXtn1_TelephoneNumber().getValue();
    phone2 = pid.getPid14_PhoneNumberBusiness(0).getXtn1_TelephoneNumber().getValue();
    accountNumber = pid.getPid18_PatientAccountNumber().getCx1_IDNumber().getValue();
    ssn = pid.getPid19_SSNNumberPatient().getValue();    
  }
  
}
