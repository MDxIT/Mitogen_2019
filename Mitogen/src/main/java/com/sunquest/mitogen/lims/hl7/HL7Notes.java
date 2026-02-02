package com.sunquest.mitogen.lims.hl7;

import ca.uhn.hl7v2.model.v251.segment.NTE;

public class HL7Notes {
    
    public String setId;
    public String [] notes;
    
    public HL7Notes(NTE nte) {
        setId = nte.getNte1_SetIDNTE().getValue();
        int length = nte.getNte3_Comment().length;
        notes = new String[length];
        for(int i = 0; i < length; i++) {
            notes[i] = nte.getComment(i).getValue();
        }
    }

}
