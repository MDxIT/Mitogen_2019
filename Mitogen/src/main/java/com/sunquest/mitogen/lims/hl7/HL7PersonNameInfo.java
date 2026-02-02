package com.sunquest.mitogen.lims.hl7;

import ca.uhn.hl7v2.model.v251.datatype.XCN;

public class HL7PersonNameInfo {
	public String id;
	public String internalId;
	public String lastName;
	public String firstName;
	public String middleName;
	public String prefix;
	public String assigningAuthority;
	
	public HL7PersonNameInfo(XCN xcn) {
		id = xcn.getXcn1_IDNumber().getValue();
		internalId = null;
		lastName = xcn.getXcn2_FamilyName().getFn1_Surname().getValue();
		firstName = xcn.getXcn3_GivenName().getValue();
		middleName = xcn.getXcn4_SecondAndFurtherGivenNamesOrInitialsThereof().getValue();
		prefix = xcn.getXcn5_SuffixEgJRorIII().getValue();
		assigningAuthority = xcn.getXcn9_AssigningAuthority().getUniversalID().getValue();
		
	}
	
	
}
