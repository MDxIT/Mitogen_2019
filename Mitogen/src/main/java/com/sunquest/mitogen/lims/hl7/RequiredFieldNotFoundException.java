package com.sunquest.mitogen.lims.hl7;

/**
 * Class for throwing a standard formatted exception when a required field is missing.
 * 
 * @author oliverd
 *
 */
public class RequiredFieldNotFoundException extends Exception{
  private String _field;
  private String _fieldLocation;
  /**
   * A handy class for throwing a standard formatted exception for a missing required field.
   * 
   * @param fieldName Name of the required field
   * @param fieldLocation Location within the HL7 message (ex. "OBR.3")
   */
  public RequiredFieldNotFoundException(String fieldName, String fieldLocation) {
    super("Required Field \""+fieldName+"\" ("+fieldLocation+") not found.");
    _field = fieldName;
    _fieldLocation = fieldLocation;       
  }
  public String getFieldName() {
    return _field;
  }
  public String getFieldLocation() {
    return _fieldLocation;
  }
}