package com.sunquest.mitogen.lims.hl7;

import ca.uhn.hl7v2.model.v251.segment.DG1;

public class HL7DiagnosticCode {
    
    public String setId;
    public String code;
    public String codingMethod;
    
    public HL7DiagnosticCode(DG1 dg1) {
        setId = dg1.getDg11_SetIDDG1().getValue();
        codingMethod = dg1.getDg12_DiagnosisCodingMethod().getValue();
        code = dg1.getDg13_DiagnosisCodeDG1().getCe1_Identifier().getValue();
        
    }

}
