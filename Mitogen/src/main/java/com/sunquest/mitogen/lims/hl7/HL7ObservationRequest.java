package com.sunquest.mitogen.lims.hl7;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import ca.uhn.hl7v2.model.DataTypeException;
import ca.uhn.hl7v2.model.v251.datatype.XCN;
import ca.uhn.hl7v2.model.v251.segment.OBR;

public class HL7ObservationRequest {
	
	public String setId;
	public String placerOrderNumber;
	public String fillerOrderNumber;
	public String panelCode;
	public String panelName;
	public String collectionDate;
	public String collectionTime;
	
	public String collectionVolume;
	public String collectionUnits;
	
	public String specimenReceivedDate;
    public String specimenReceivedTime;	
	public String specimenType;
	public HL7PersonNameInfo orderProvider;
	
	public String department;
	public String priority;
	
	public ArrayList<HL7PersonNameInfo> physiciansToCopy;

  
	
	
	HL7ObservationRequest(OBR obr) {
		
		physiciansToCopy = new ArrayList<HL7PersonNameInfo>();
		
		setId = obr.getObr1_SetIDOBR().getValue();
		placerOrderNumber = obr.getObr2_PlacerOrderNumber().getEi1_EntityIdentifier().getValue();
		fillerOrderNumber = obr.getObr3_FillerOrderNumber().getEi1_EntityIdentifier().getValue();
		panelCode = obr.getObr4_UniversalServiceIdentifier().getIdentifier().getValue();
		panelName = obr.getObr4_UniversalServiceIdentifier().getCe2_Text().getValue();


		
		Date collectionDateTime = null;
		Date specimenReceivedDateTime = null;
		try {
			collectionDateTime = obr.getObr7_ObservationDateTime().getTime().getValueAsDate();
			specimenReceivedDateTime = obr.getObr14_SpecimenReceivedDateTime().getTime().getValueAsDate();
		} catch (DataTypeException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	
		Calendar calendar = Calendar.getInstance();
		if(specimenReceivedDateTime != null) {
			calendar.setTime(specimenReceivedDateTime);
			specimenReceivedDate = HL7MitoProcessingHandler.dateFormatter.format(calendar.getTime());
            specimenReceivedTime = HL7MitoProcessingHandler.timeFormatter.format(calendar.getTime());			
		}
		
		if(collectionDateTime != null) {
			calendar.setTime(collectionDateTime);			
			collectionDate = HL7MitoProcessingHandler.dateFormatter.format(calendar.getTime());
			collectionTime = HL7MitoProcessingHandler.timeFormatter.format(calendar.getTime());
		}
		

		collectionVolume = obr.getObr9_CollectionVolume().getCq1_Quantity().getValue();
		collectionUnits = obr.getObr9_CollectionVolume().getCq2_Units().getIdentifier().getValue();
		
		specimenType = obr.getObr15_SpecimenSource().getSps1_SpecimenSourceNameOrCode().getCwe1_Identifier().getValue();

        orderProvider = new HL7PersonNameInfo(obr.getObr16_OrderingProvider(0));			
        department = obr.getObr24_DiagnosticServSectID().getValue();
        priority = obr.getObr27_QuantityTiming(0).getPriority().getValue();
        
        XCN [] resultCopiesTo = obr.getObr28_ResultCopiesTo();
        for(XCN copyTo : resultCopiesTo) {
        	physiciansToCopy.add(new HL7PersonNameInfo(copyTo));
        }
        
	}
	

}
