package com.sunquest.mitogen.lims.hl7;

import java.util.Calendar;
import java.util.Date;

import ca.uhn.hl7v2.model.DataTypeException;
import ca.uhn.hl7v2.model.v251.segment.SPM;

public class HL7Specimen {

	public String setId;
	public String specimenId;
	public String parentSpecimenId;
	public String specimenType;
	public String collectionDate;
	public String collectionTime;
	
	public String collectionVolume;
	public String collectionUnits;
	public String receivedDate;
    public String receivedTime;	
	
	public HL7Specimen(SPM spm) {
		setId = spm.getSpm1_SetIDSPM().getValue();
		specimenId = spm.getSpm2_SpecimenID().getEip1_PlacerAssignedIdentifier().getEi1_EntityIdentifier().getValue();
		parentSpecimenId = spm.getSpm3_SpecimenParentIDs(0).getEip1_PlacerAssignedIdentifier().getEi1_EntityIdentifier().getValue();
		specimenType = spm.getSpm4_SpecimenType().getCwe1_Identifier().getValue();
		
		Date collectionDateTime = null;
		Date receivedDateTime = null;
	    try {
	        collectionDateTime = spm.getSpm17_SpecimenCollectionDateTime().getDr1_RangeStartDateTime().getTime().getValueAsDate();
	        receivedDateTime = spm.getSpm18_SpecimenReceivedDateTime().getTime().getValueAsDate();
	    } catch (DataTypeException e) {
	        // TODO Auto-generated catch block
	        e.printStackTrace();
	    }
	    	    
        Calendar calendar = Calendar.getInstance();
        if(receivedDateTime != null) {
            calendar.setTime(receivedDateTime);
            receivedDate = HL7MitoProcessingHandler.dateFormatter.format(calendar.getTime());
            receivedTime = HL7MitoProcessingHandler.timeFormatter.format(calendar.getTime());            
        }
        
        if(collectionDateTime != null) {
            calendar.setTime(collectionDateTime);            
            collectionDate = HL7MitoProcessingHandler.dateFormatter.format(calendar.getTime());
            collectionTime = HL7MitoProcessingHandler.timeFormatter.format(calendar.getTime());    
        }
        
        collectionVolume = spm.getSpm12_SpecimenCollectionAmount().getCq1_Quantity().getValue();
        collectionUnits = spm.getSpm12_SpecimenCollectionAmount().getCq2_Units().getIdentifier().getValue();
	}
	
	
}
