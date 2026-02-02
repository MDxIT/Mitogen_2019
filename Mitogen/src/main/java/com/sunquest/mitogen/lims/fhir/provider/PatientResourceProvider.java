package com.sunquest.mitogen.lims.fhir.provider;

import java.util.ArrayList;
import java.util.Deque;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Hashtable;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Properties;
import java.util.Set;
import java.text.ParseException;
import java.text.SimpleDateFormat;

import org.hl7.fhir.dstu2.model.HumanName;
import org.hl7.fhir.dstu2.model.Identifier;
import org.hl7.fhir.r4.model.Address;
import org.hl7.fhir.r4.model.CodeableConcept;
import org.hl7.fhir.r4.model.Coding;
import org.hl7.fhir.r4.model.ContactPoint;
import org.hl7.fhir.r4.model.IdType;
import org.hl7.fhir.r4.model.Organization;
import org.hl7.fhir.r4.model.Patient;
import org.hl7.fhir.r4.model.StringType;
import org.hl7.fhir.r4.model.Address.AddressType;
import org.hl7.fhir.r4.model.Address.AddressUse;
import org.hl7.fhir.r4.model.ContactPoint.ContactPointSystem;
import org.hl7.fhir.r4.model.ContactPoint.ContactPointUse;
import org.hl7.fhir.r4.model.Enumerations.AdministrativeGender;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

import ca.uhn.fhir.model.api.Include;
import ca.uhn.fhir.model.api.ResourceMetadataKeyEnum;
import ca.uhn.fhir.model.primitive.CodeDt;
import ca.uhn.fhir.model.primitive.StringDt;
import ca.uhn.fhir.rest.annotation.IdParam;
import ca.uhn.fhir.rest.annotation.IncludeParam;
import ca.uhn.fhir.rest.annotation.OptionalParam;
import ca.uhn.fhir.rest.annotation.Read;
import ca.uhn.fhir.rest.annotation.RequiredParam;
import ca.uhn.fhir.rest.annotation.Search;
import ca.uhn.fhir.rest.param.InternalCodingDt;
import ca.uhn.fhir.rest.param.TokenParam;
import ca.uhn.fhir.rest.server.IResourceProvider;
import ca.uhn.fhir.rest.server.exceptions.ResourceNotFoundException;

import com.uniconnect.uniflow.Switchboard;
import com.uniconnect.uniflow.JDCConnection;

/**
 * This is a resource provider which stores Patient resources in memory using a
 * HashMap. This is obviously not a production-ready solution for many reasons,
 * but it is useful to help illustrate how to build a fully-functional server.
 */
public class PatientResourceProvider implements IResourceProvider {

	//add a logger for the class
	private final Logger ourLog = LoggerFactory.getLogger(PatientResourceProvider.class);

	/**
	 * This map has a resource ID as a key, and each key maps to a Deque list
	 * containing all versions of the resource with that ID.
	 */
	private Map<Long, Deque<Patient>> myIdToPatientVersions = new HashMap<Long, Deque<Patient>>();

	/**
	 * This is used to generate new IDs
	 */
	private long myNextId = 1;

	/**
	 * Constructor, which pre-populates the provider with one resource instance.
	 */
	public PatientResourceProvider() {

		// Note: the following code will be replaced or totally
		// deleted in final implementation.
		long resourceId = myNextId++;

		Patient patient = new Patient();
		patient.setId(Long.toString(resourceId));
		patient.addIdentifier();
		patient.getIdentifier().get(0).setSystem(new String("urn:hapitest:mrns"));
		patient.getIdentifier().get(0).setValue("00002");
		patient.addName().setFamily("Test");
		patient.getName().get(0).addGiven("PatientOne");
		patient.setGender(AdministrativeGender.FEMALE);

		LinkedList<Patient> list = new LinkedList<Patient>();
		list.add(patient);

		myIdToPatientVersions.put(resourceId, list);

	}

	// /**
	// * Stores a new version of the patient in memory so that it can be retrieved
	// * later.
	// *
	// * @param thePatient The patient resource to store
	// * @param theId The ID of the patient to retrieve
	// */
	// private void addNewVersion(Patient thePatient, Long theId) {
	// InstantDt publishedDate;
	// if (!myIdToPatientVersions.containsKey(theId)) {
	// myIdToPatientVersions.put(theId, new LinkedList<Patient>());
	// publishedDate = InstantDt.withCurrentTime();
	// } else {
	// Patient currentPatitne = myIdToPatientVersions.get(theId).getLast();
	// Map<ResourceMetadataKeyEnum<?>, Object> resourceMetadata =
	// currentPatitne.getResourceMetadata();
	// publishedDate = (InstantDt)
	// resourceMetadata.get(ResourceMetadataKeyEnum.PUBLISHED);
	// }

	// // /*
	// // * PUBLISHED time will always be set to the time that the first version was
	// // * stored. UPDATED time is set to the time that the new version was stored.
	// // */
	// // thePatient.getResourceMetadata().put(ResourceMetadataKeyEnum.PUBLISHED,
	// publishedDate);
	// // thePatient.getResourceMetadata().put(ResourceMetadataKeyEnum.UPDATED,
	// InstantDt.withCurrentTime());

	// Deque<Patient> existingVersions = myIdToPatientVersions.get(theId);

	// // We just use the current number of versions as the next version number
	// String newVersion = Integer.toString(existingVersions.size());

	// // Create an ID with the new version and assign it back to the resource
	// IdDt newId = new IdDt("Patient", Long.toString(theId), newVersion);
	// thePatient.setId(newId);

	// existingVersions.add(thePatient);
	// }

	// /**
	// * The "@Create" annotation indicates that this method implements
	// "create=type",
	// * which adds a new instance of a resource to the server.
	// */
	// @Create()
	// public MethodOutcome createPatient(@ResourceParam Patient thePatient) {
	// validateResource(thePatient);

	// // Here we are just generating IDs sequentially
	// long id = myNextId++;

	// addNewVersion(thePatient, id);

	// // Let the caller know the ID of the newly created resource
	// return new MethodOutcome(new IdDt(id));
	// }
	/*
	 * //Note: Search by managingOrganization is not needed by VUE. //So commented
	 * out for now
	 * 
	 * @Search() public List<Patient> findPatient(
	 * 
	 * @RequiredParam(name = "managingOrganization." + Organization.SP_IDENTIFIER)
	 * TokenParam id,
	 * 
	 * @IncludeParam(allow = { "Organization:managingOrganization" }) Set<Include>
	 * include) { List<Patient> retVal = new ArrayList<Patient>(); try {
	 * com.sunquest.mitogen.lims.dataObjects.Patient patient = new
	 * com.sunquest.mitogen.lims.dataObjects.Patient(Switchboard.getConnection());
	 * if(id.getValue() != null ) { if (id.getSystem() == null ){
	 * patient.SearchByMRN(id.getValue()); } else {
	 * patient.SearchByMRN(id.getValue(), id.getSystem()); } } String x = ""; }
	 * catch(SQLException se) {
	 * 
	 * } return retVal;
	 * 
	 * 
	 * }
	 *///

	/**
	 * The "@Search" annotation indicates that this method supports the search
	 * operation. You may have many different method annotated with this annotation,
	 * to support many different search criteria. This example searches by family
	 * name.
	 * 
	 * @param theFamilyName This operation takes one parameter which is the search
	 *                      criteria. It is annotated with the "@Required"
	 *                      annotation. This annotation takes one argument, a string
	 *                      containing the name of the search criteria. The datatype
	 *                      here is StringDt, but there are other possible parameter
	 *                      types depending on the specific search criteria.
	 * @return This method returns a list of Patients. This list may contain
	 *         multiple matching resources, or it may also be empty.
	 */
	@Search()
	public List<Patient> findPatientByIdentifier(@RequiredParam(name = Patient.SP_IDENTIFIER) TokenParam mrn) throws SQLException {
		LinkedList<Patient> retVal = new LinkedList<Patient>();
		Switchboard switchboard = new Switchboard();
		try {
			//need to create switchboard connection so that it can be cleaned up by the reaperred
			switchboard.connection = Switchboard.getConnection();
			com.sunquest.mitogen.lims.dataObjects.Patient patient = new com.sunquest.mitogen.lims.dataObjects.Patient(switchboard.connection);
			Boolean exists = false;
			if (mrn != null && mrn.getValue() != null) {
				if (mrn.getSystem() == null) {
					exists = patient.SearchByMRN(mrn.getValue());
				} else {
					exists = patient.SearchByMRN(mrn.getValue(), mrn.getSystem());
				}
			}
			if (exists) {
				retVal.add(populateData(patient));		
			}
		}
		catch(SQLException se) {
			//Add OperationOutcome to outgoing result for exception case
			ourLog.error("Multiple matching patients: " + se.getMessage());
			try {
				switchboard.connection.close();
			} catch (SQLException e) {
				//do nothing if this fails, the connection is closed
			}
			// generate operation outcome by throw the same exception.
			throw se;
		}
		finally{

		}
		//this allows the reaper to see this connection is no longer in use and can be properly cleaned up
		((JDCConnection) switchboard.connection).expireLease();
		return retVal;
	}


	// the following two route are not needed by VUE, so comment out
	/**** 
	@Search()
	public List<Patient> findPatientsByPersonalName(@RequiredParam(name = Patient.SP_NAME) StringDt theFamilyName) {
		LinkedList<Patient> retVal = new LinkedList<Patient>();

		return retVal;
	}

	@Search
	public List<Patient> findPatientsUsingArbitraryCtriteria() {
		LinkedList<Patient> retVal = new LinkedList<Patient>();
	
		return retVal;
	}
	*////
	
	/**
	 * The getResourceType method comes from IResourceProvider, and must be overridden to indicate what type of resource this provider supplies.
	 */
	@Override
	public Class<Patient> getResourceType() {
		return Patient.class;
	}

	/**
	 * This is the "read" operation. The "@Read" annotation indicates that this method supports the read and/or vread operation.
	 * <p>
	 * Read operations take a single parameter annotated with the {@link IdParam} paramater, and should return a single resource instance.
	 * </p>
	 * 
	 * @param theId
	 *            The read operation takes one parameter, which must be of type IdDt and must be annotated with the "@Read.IdParam" annotation.
	 * @return Returns a resource matching this identifier, or null if none exists.
	 */
	@Read(version = true)
	public Patient readPatient(@IdParam IdType theId) throws SQLException{
		Patient retVal = new Patient();
		Switchboard switchboard = new Switchboard();
		try {
			//need to create switchboard connection so that it can be cleaned up by the reaperred
			switchboard.connection = Switchboard.getConnection();
			com.sunquest.mitogen.lims.dataObjects.Patient patient = new com.sunquest.mitogen.lims.dataObjects.Patient(switchboard.connection);
			patient.setPatientId(theId.getIdPart());
			if (patient.loadFromDB()){
				return populateData(patient);
			}
			else{
				//No matching ID
				throw new ResourceNotFoundException(theId);
			}
		}
		catch(SQLException se) {
			//Add OperationOutcome to outgoing result for exception case
			ourLog.error("Error loading Diagnostic report for: " + theId.getValue() + ". " + se.getMessage());
			try {
				switchboard.connection.close();
			} catch (SQLException e) {
				//do nothing if this fails, the connection is closed
			}
			// generate operation outcome by throw the same exception.
			((JDCConnection) switchboard.connection).expireLease();
			throw se;
		}
	}

	// /**
	//  * The "@Update" annotation indicates that this method supports replacing an existing 
	//  * resource (by ID) with a new instance of that resource.
	//  * 
	//  * @param theId
	//  *            This is the ID of the patient to update
	//  * @param thePatient
	//  *            This is the actual resource to save
	//  * @return This method returns a "MethodOutcome"
	//  */
	// @Update()
	// public MethodOutcome updatePatient(@IdParam IdDt theId, @ResourceParam Patient thePatient) {
	// 	validateResource(thePatient);

	// 	Long id;
	// 	try {
	// 		id = theId.getIdPartAsLong();
	// 	} catch (DataFormatException e) {
	// 		throw new InvalidRequestException("Invalid ID " + theId.getValue() + " - Must be numeric");
	// 	}

	// 	/*
	// 	 * Throw an exception (HTTP 404) if the ID is not known
	// 	 */
	// 	if (!myIdToPatientVersions.containsKey(id)) {
	// 		throw new ResourceNotFoundException(theId);
	// 	}

	// 	addNewVersion(thePatient, id);

	// 	return new MethodOutcome();
	// }

	/**
	 * This method just provides simple business validation for resources we are storing.
	 * 
	 * @param thePatient
	 *            The patient to validate
	 */
	private void validateResource(Patient thePatient) {
	}
	public Patient populateData (com.sunquest.mitogen.lims.dataObjects.Patient patient) {
			Patient retVal = new Patient();
			ResourceMetadataKeyEnum.ENTRY_SEARCH_MODE.put(retVal, "match");
			List<org.hl7.fhir.r4.model.Identifier> IdList = new ArrayList<org.hl7.fhir.r4.model.Identifier>();

			patient.patientSources.forEach((k, v) -> {

				Boolean exists = false;
				for(org.hl7.fhir.r4.model.Identifier val : IdList) {

					if (v.mrnFacility != null && !v.mrnFacility.equals(val.getSystem())){
						if (v.mrnFacility.equals(val.getSystem()) && v.mrn.equals(val.getValue())){
							exists = true;
						}
					}
					else {
						if (v.mrn.equals(val.getValue())) {
							exists = true;
						}
					}
				}
				if (!exists) {
					org.hl7.fhir.r4.model.Identifier i = new org.hl7.fhir.r4.model.Identifier();
					i.setSystem(v.mrnFacility);
					i.setValue(v.mrn);
					CodeableConcept cc = new CodeableConcept();
					Coding c = new Coding();
					c.setSystem("http://terminology.hl7.org/CodeSystem/v2-0203");
					c.setCode("MR");
					cc.addCoding(c);
					i.setType(cc);
					
					IdList.add(i);
				}
				
			});
			retVal.setIdentifier(IdList);
			retVal.setId(patient.getPatientId());

			List<org.hl7.fhir.r4.model.HumanName> hNList = new ArrayList<org.hl7.fhir.r4.model.HumanName>();
			org.hl7.fhir.r4.model.HumanName hName = new org.hl7.fhir.r4.model.HumanName();
			hName.addGiven(patient.getFirstName());
			hName.addGiven(patient.getMiddleName());
			hName.setFamily(patient.getLastName());
			hNList.add(hName);
			retVal.setName(hNList);

			List<Address> theAddress = new ArrayList<>();
			Address address = new Address();
			List<StringType> addressList = new ArrayList<>();
			StringType st = new StringType();
			st.setValue(patient.getAddress1());
			addressList.add(st);
			StringType st2 = new StringType();
			st2.setValue(patient.getAddress2());
			addressList.add(st2);
			address.setLine(addressList);
			address.setCity(patient.getCity());
			address.setState(patient.getState());
			address.setPostalCode(patient.getPostalCode());
			address.setCountry(patient.getCountry());
			theAddress.add(address);
			retVal.setAddress(theAddress);

			List<ContactPoint> theTelecom = new ArrayList<>();
			ContactPoint contact = new ContactPoint();
			contact.setSystem(ContactPointSystem.EMAIL);
			contact.setValue(patient.getEmail());
			theTelecom.add(contact);
			contact = new ContactPoint();
			contact.setSystem(ContactPointSystem.PHONE);
			// Working off the assumption that CountryCode in LIMS is an area code
			contact.setValue(Objects.toString(patient.getPhone1CountryCode(), "") + Objects.toString(patient.getPhone1(), "") );
			theTelecom.add(contact);
			contact = new ContactPoint();
			contact.setSystem(ContactPointSystem.PHONE);
			contact.setValue(Objects.toString(patient.getPhone2CountryCode(), "") + Objects.toString(patient.getPhone2(), "") );
			theTelecom.add(contact);
			contact = new ContactPoint();
			contact.setSystem(ContactPointSystem.PHONE);
			contact.setValue(Objects.toString(patient.getPhone3CountryCode(), "") + Objects.toString(patient.getPhone3(), "") );
			theTelecom.add(contact);

			retVal.setTelecom(theTelecom);

			SimpleDateFormat format1 = new SimpleDateFormat("yyyy-MM-dd");
			try {
				retVal.setBirthDate(format1.parse(patient.getDOB()));
			} catch (ParseException e) {
				retVal.setBirthDate(null);
				ourLog.error("Error parsing patientDOB: " + e.getMessage());
			}

			String limsGender = patient.getGeneticGender();
			if(limsGender.equalsIgnoreCase("Male") || limsGender.equalsIgnoreCase("M")){
				retVal.setGender(AdministrativeGender.MALE);
			}
			else if(limsGender.equalsIgnoreCase("Female") || limsGender.equalsIgnoreCase("F")){
				retVal.setGender(AdministrativeGender.FEMALE);
			}
			else if(limsGender.equalsIgnoreCase("Unknown") || limsGender.equalsIgnoreCase("U")){
				retVal.setGender(AdministrativeGender.UNKNOWN);
			}
			else{
				retVal.setGender(AdministrativeGender.OTHER);
			}
		return retVal;
	}

}