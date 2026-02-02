package com.sunquest.mitogen.lims.hl7;

import ca.uhn.hl7v2.model.Type;
import ca.uhn.hl7v2.model.Varies;
import ca.uhn.hl7v2.model.v251.segment.OBX;

public class HL7Observation {

  public String identifier;
  public Type[] values;
    
  public HL7Observation(OBX obx) {
    identifier = obx.getObx3_ObservationIdentifier().getCe1_Identifier().getValue();
    Varies[] obsVals = obx.getObx5_ObservationValue();
    values = new Type[obsVals.length];
    for(int i=0; i<obsVals.length; i++) {
      values[i] = obsVals[i].getData();
    }
  }
}
