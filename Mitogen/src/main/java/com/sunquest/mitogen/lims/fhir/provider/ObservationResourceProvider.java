package com.sunquest.mitogen.lims.fhir.provider;

import java.util.ArrayList;
import java.util.Date;
import java.util.Deque;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Properties;
import java.util.Set;

import com.sunquest.mitogen.lims.dataObjects.ReportResultData;
import com.sunquest.mitogen.lims.dataObjects.ReportDetails.ReportedData;
import com.uniconnect.uniflow.Switchboard;

import org.hl7.fhir.instance.model.api.IBaseResource;
import org.hl7.fhir.r4.model.Address;
import org.hl7.fhir.r4.model.Annotation;
import org.hl7.fhir.r4.model.CodeableConcept;
import org.hl7.fhir.r4.model.Coding;
import org.hl7.fhir.r4.model.IdType;
import org.hl7.fhir.r4.model.Organization;
import org.hl7.fhir.r4.model.Type;
import org.hl7.fhir.r4.model.Observation;
import org.hl7.fhir.r4.model.Enumerations.AdministrativeGender;
import org.hl7.fhir.r4.model.Observation.ObservationComponentComponent;
import org.hl7.fhir.r4.model.Observation.ObservationReferenceRangeComponent;
import org.hl7.fhir.r4.model.Observation.ObservationStatus;
import org.joda.time.DateTime;
import org.hl7.fhir.r4.model.StringType;
import org.hl7.fhir.r4.model.DateTimeType;

import com.uniconnect.uniflow.JDCConnection;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.text.ParseException;
import java.text.SimpleDateFormat;

import ca.uhn.fhir.model.api.Include;
import ca.uhn.fhir.model.api.TemporalPrecisionEnum;
//import ca.uhn.fhir.model.dstu2.resource.Observation;
import ca.uhn.fhir.model.primitive.StringDt;
import ca.uhn.fhir.rest.annotation.IdParam;
import ca.uhn.fhir.rest.annotation.IncludeParam;
import ca.uhn.fhir.rest.annotation.Read;
import ca.uhn.fhir.rest.annotation.RequiredParam;
import ca.uhn.fhir.rest.annotation.Search;
import ca.uhn.fhir.rest.param.TokenParam;
import ca.uhn.fhir.rest.server.IResourceProvider;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class ObservationResourceProvider implements IResourceProvider {

	// add a logger for the class
	private final Logger ourLog = LoggerFactory.getLogger(ObservationResourceProvider.class);

	public ObservationResourceProvider() {

	}

	@Override
	public Class<Observation> getResourceType() {
		return Observation.class;
	}

	// for route: /base/Observations/identifier
	/**
	 * This is the "read" operation. The "@Read" annotation indicates that this
	 * method supports the read and/or vread operation.
	 * <p>
	 * Read operations take a single parameter annotated with the {@link IdParam}
	 * paramater, and should return a single resource instance.
	 * </p>
	 * 
	 * @param theId The read operation takes one parameter, which must be of type
	 *              IdDt and must be annotated with the "@Read.IdParam" annotation.
	 * @return Returns a resource matching this identifier, or empty Observation if
	 *         none exists. Unknown resources and deleted resources are treated
	 *         differently on a read: a GET for a deleted resource returns a 410
	 *         status code, whereas a GET for an unknown resource returns 404
	 */
	//@Read(version = true)
	public Observation readObservation(@IdParam IdType theId) throws SQLException {
		Observation retVal = new Observation();
		ReportResultData rrd = null;
		Connection conn;
		try {
			conn = Switchboard.getConnection();
		} catch (SQLException e1) {
			// Without a connection to the database we can't proceed any further
			// Probably another operationOutcome should be returned
			//return retVal;
			throw e1;
		}
		try {
			rrd = new ReportResultData(conn);
			rrd.setID(Long.parseLong(theId.getIdPart()));
			rrd.LoadFromDB();
			retVal = populateData(retVal, rrd);
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			try {
				conn.close();
			} catch (SQLException er) {
				// do nothing if this fails, the connection is closed
			}

			throw e;
		}
		((JDCConnection) conn).expireLease();
		return retVal;
	}

	public Observation populateData(Observation observation, ReportResultData rrd) {

		// i)
		observation.setId(rrd.getID().toString());
		// ii)
		observation.setStatus(ObservationStatus.FINAL); // always Final when available

		// v) 0 = false / 1 = true
		CodeableConcept interp = new CodeableConcept();
		if (rrd.getIsOverall() && rrd.getCurrentResult()) {
			// iii)
			CodeableConcept codeConcept = new CodeableConcept();
			List<Coding> theCoding = new ArrayList<>();
			Coding code = new Coding();
			code.setCode("Overall Report Result"); // hard coded result
			code.setDisplay("Overall Report Result");
			theCoding.add(code);
			codeConcept.setCoding(theCoding);
			observation.setCode(codeConcept);

			// iv)
			try {
				observation.setIssued(
						new SimpleDateFormat("yyyy-MM-dd' 'HH:mm:ss").parse(rrd.getLastUpdatedEvent().getEventDate()));
			} catch (ParseException p) {
				ourLog.error("Unable to parse DateTime - " + p.getMessage());
			}
			// v)
			List<CodeableConcept> theInterpretation = new ArrayList<>();
			CodeableConcept cc2 = new CodeableConcept();

			// b-i)
			StringType str = new StringType();
			if (rrd.getVarcharReviewResult() != null) {
				str.setValue(rrd.getVarcharReviewResult() + " " + Objects.toString(rrd.getReportableUnits(), ""));
				observation.setValue(str);
			} 
			else if (rrd.getDecimalReviewResult() != null) { // its one or the other here
				str.setValue(rrd.getDecimalReviewResult() + " " + Objects.toString(rrd.getReportableUnits(), "") );
				observation.setValue(str);
			}
			// b-ii)
			else if (rrd.getDateTimeReviewResult() != null) {
				DateTimeType dt = new DateTimeType();
				SimpleDateFormat format1 = new SimpleDateFormat("yyyy-MM-dd' 'HH:mm:ss");
				try {
					dt.setValue(format1.parse(rrd.getDateTimeReviewResult()));
				} catch (ParseException e) {
					ourLog.error("Error parsing Analysis Date: " + e.getMessage());
				}
				observation.setValue(dt);
			} else {
				// this should never happen, unless data in not complete
				ourLog.error("No data present to populate the Observation value");
			}
			// vi)
			if (rrd.getInterpretation() != null){
				cc2.setText(rrd.getInterpretation() + " " + Objects.toString(rrd.getWording(),  "") );
				theInterpretation.add(cc2);
			}
			if (false == theInterpretation.isEmpty()) {
				observation.setInterpretation(theInterpretation);
			}
		//End if isOverall
		} else {
			// iii)
			CodeableConcept codeConcept = new CodeableConcept();
			List<Coding> theCoding = new ArrayList<>();
			Coding code = new Coding();
			code.setCode(rrd.getPanelCode());
			code.setDisplay(rrd.getPanelCodeDisplay());
			theCoding.add(code);
			codeConcept.setCoding(theCoding);
			observation.setCode(codeConcept);

			// iv)
			try {
			observation.setIssued(new SimpleDateFormat("yyyy-MM-dd' 'HH:mm:ss").parse(rrd.getLastUpdatedEvent().getEventDate()));
			}
			catch (ParseException p) {
				ourLog.error("Unable to parse DateTime - " + p.getMessage());
			}

			//new SimpleDateFormat("yyyy-MM-dd' 'HH:mm:ss").parse(rrd.getLastUpdatedEvent().getEventDate()));

			if (rrd.getIsPanelOverall() && rrd.getCurrentResult()) {
				// for bug  528449:Observation: Panel issued date/time and varcharReviewResult values not populating in resource correctly
				StringType str = new StringType();
				if (rrd.getVarcharReviewResult() != null) {
					str.setValue(rrd.getVarcharReviewResult() + " " + Objects.toString(rrd.getReportableUnits(), "" ) );
					observation.setValue(str);
				}
				//
								
				interp.setText(Objects.toString(rrd.getInterpretation(), "")  + " " + Objects.toString(rrd.getWording(), "") );
				observation.addInterpretation(interp);
			} else {
				// vi) 0 = false / 1 = true
				if (rrd.getCurrentResult()) {
					List<ObservationComponentComponent> theComponent = new ArrayList<>();
					ObservationComponentComponent comp = new ObservationComponentComponent();
					ObservationReferenceRangeComponent orr = new ObservationReferenceRangeComponent();
					List<ObservationReferenceRangeComponent> theReferenceRange = new ArrayList<>();
					List<CodeableConcept> theInterpretation = new ArrayList<>();
					CodeableConcept cc = new CodeableConcept();
					CodeableConcept cc2 = new CodeableConcept();

					rrd.getAnalysisData().forEach((key, value) -> {
						value.getAnalysisDataDefinition().forEach((k, v) -> { // should only be 1
							// a) analysisDataDefinition.id = reportResultData.analysisDataId
							if (value.getAnalysisDataDefinitionId().toString().equals(v.getId().toString())) {
								Coding c = new Coding();
								c.setCode(Objects.toString(rrd.tests.getName(), ""));
								cc.addCoding(c);
								cc.setText(Objects.toString(rrd.tests.getName(), "") + " " + Objects.toString(v.getValue(), "") );
								comp.setCode(cc);
							}
							// b-i)
							StringType str = new StringType();
							if (rrd.getVarcharReviewResult() != null) {
								str.setValue(rrd.getVarcharReviewResult() + " " + Objects.toString(rrd.getReportableUnits(), "" ) );
								comp.setValue(str);
							} else if (rrd.getDecimalReviewResult() != null) { // its one or the other here
								str.setValue(rrd.getDecimalReviewResult() + " " + Objects.toString(rrd.getReportableUnits(), "") );
								comp.setValue(str);
							}
							// b-ii)
							else if (rrd.getDateTimeReviewResult() != null) {
								DateTimeType dt = new DateTimeType();
								SimpleDateFormat format1 = new SimpleDateFormat("yyyy-MM-dd' 'HH:mm:ss");
								try {
									dt.setValue(format1.parse(rrd.getDateTimeReviewResult()));
								} catch (ParseException e) {
									ourLog.error("Error parsing Analysis Date: " + e.getMessage());
								}
								comp.setValue(dt);
							} else {
								// this should never happen
								ourLog.error("Logic Error in Observation Resource Provider");
							}
							// c)
							cc2.setText(Objects.toString(rrd.getInterpretation(), "") + " " + Objects.toString(rrd.getWording(), "") );
							theInterpretation.add(cc2);
							comp.setInterpretation(theInterpretation);
							// d)
							orr.setText(rrd.getLimits());
							theReferenceRange.add(orr);
							comp.setReferenceRange(theReferenceRange);

							theComponent.add(comp);
						});
					});
					observation.setComponent(theComponent);
				}
			}
		}
		return observation;
	}
}