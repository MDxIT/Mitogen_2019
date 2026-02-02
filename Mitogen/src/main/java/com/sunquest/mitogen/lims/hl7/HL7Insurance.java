package com.sunquest.mitogen.lims.hl7;

import ca.uhn.hl7v2.model.v251.datatype.CX;
import ca.uhn.hl7v2.model.v251.datatype.XAD;
import ca.uhn.hl7v2.model.v251.datatype.XON;
import ca.uhn.hl7v2.model.v251.datatype.XPN;
import ca.uhn.hl7v2.model.v251.datatype.XTN;
import ca.uhn.hl7v2.model.v251.group.ORM_O01_INSURANCE;
import ca.uhn.hl7v2.model.v251.segment.IN1;

public class HL7Insurance {
    public Integer setId;
    public String companyCode;
    public String companyName;
    public String companyAddress1;
    public String companyAddress2;
    public String companyCity;
    public String companyState;
    public String companyPostalCode;
    public String companyCountry;
    public String companyPhoneNumber;  
    public String groupNumber;
    public String planType;
    public String insuredLast;
    public String insuredFirst;
    public String insuredMiddle;
    public String insuredRelationship;
    public String insuredDob;
    public String typeOfAgreementCode;
    public String policyNumber;
    public String insuredGender;
    public Integer carrierId;
  
      

	public HL7Insurance(ORM_O01_INSURANCE insurance) {
		processIN1(insurance.getIN1());
	}
	
	private void processIN1(IN1 in1Msg1) {
		  CX in1CompanyId = in1Msg1.getIn13_InsuranceCompanyID(0);
	      XON in1CompanyName = in1Msg1.getIn14_InsuranceCompanyName(0);
	      XAD in1CompanyAddress = in1Msg1.getIn15_InsuranceCompanyAddress(0);
	      XTN in1CompanyPhoneNum = in1Msg1.getIn17_InsuranceCoPhoneNumber(0);
	      XPN insured = in1Msg1.getIn116_NameOfInsured(0);
	      
	      setId = Integer.valueOf(in1Msg1.getIn11_SetIDIN1().getValue());
	      
	      // Insurance info
	      companyCode = in1CompanyId.getCx1_IDNumber().getValue();
	      companyName = in1CompanyName.getOrganizationName().getValue();
	      companyAddress1 = in1CompanyAddress.getXad1_StreetAddress().getSad1_StreetOrMailingAddress().getValue();
	      companyAddress2 = in1CompanyAddress.getXad2_OtherDesignation().getValue();
	      companyCity = in1CompanyAddress.getXad3_City().getValue();
	      companyState = in1CompanyAddress.getXad4_StateOrProvince().getValue();
	      companyPostalCode = in1CompanyAddress.getXad5_ZipOrPostalCode().getValue();
	      companyCountry = in1CompanyAddress.getXad6_Country().getValue();
	      companyPhoneNumber = in1CompanyPhoneNum.getXtn1_TelephoneNumber().getValue();
	      
	      groupNumber = in1Msg1.getIn18_GroupNumber().getValue();
	      planType = in1Msg1.getIn115_PlanType().getValue();

	      insuredLast = insured.getXpn1_FamilyName().getFn1_Surname().getValue();
	      insuredFirst = insured.getXpn2_GivenName().getValue();
	      insuredMiddle = insured.getXpn3_SecondAndFurtherGivenNamesOrInitialsThereof().getValue();
	      insuredRelationship = in1Msg1.getIn117_InsuredSRelationshipToPatient().getCe1_Identifier().getValue();
	      insuredDob = in1Msg1.getIn118_InsuredSDateOfBirth().getTime().getValue();
	      typeOfAgreementCode = in1Msg1.getIn131_TypeOfAgreementCode().getValue();
	      policyNumber = in1Msg1.getIn136_PolicyNumber().getValue();
	      insuredGender = in1Msg1.getIn143_InsuredSAdministrativeSex().getValue();
	     
	}

	
}





