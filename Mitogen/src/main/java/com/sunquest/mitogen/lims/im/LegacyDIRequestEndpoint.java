package com.sunquest.mitogen.lims.im;

import com.uniconnect.uniflow.JDCConnection;
import com.uniconnect.uniflow.Switchboard;
import com.uniconnect.uniflow.api.model.GenericJSONRequest;
import com.uniconnect.uniflow.api.model.GenericJSONResponse;
import com.uniconnect.uniflow.api.model.LegacyJSONRequest;
import com.uniconnect.uniflow.api.model.LegacyJSONResponse;
import com.uniconnect.uniflow.services.endpoints.Endpoint;

/**
 * Endpoint for processing Original JSON based web service requests
 * @author szczepam
 *
 */

//TODO Move to Mitogen LIMS packaage
public class LegacyDIRequestEndpoint implements Endpoint{

	private String endPointMode = "";
	private String ormPath = "";
	private String oruPath = "";
	private LegacyDIHandler SubmitHandler;
	private LegacyDIHandler RequestHandler;
	
	public void start() {
		
	}
	
	public void stop() {
		
	}
	
	public LegacyDIRequestEndpoint(String endPointMode, LegacyDIHandler SubmitHandler, LegacyDIHandler RequestHandler) {
		this.endPointMode = endPointMode;
		this.RequestHandler = RequestHandler;
		this.SubmitHandler = SubmitHandler;
	}
	
	public LegacyDIRequestEndpoint(String endPointMode, String hl7Path, LegacyDIHandler SubmitHandler, LegacyDIHandler RequestHandler) {
		this.endPointMode = endPointMode;
		this.RequestHandler = RequestHandler;
		this.SubmitHandler = SubmitHandler;
		this.oruPath = hl7Path;
	}
	
	public LegacyDIRequestEndpoint(String endPointMode, LegacyDIHandler SubmitHandler) {
		this.endPointMode = endPointMode;
		this.SubmitHandler = SubmitHandler;
	}
	
	public LegacyJSONResponse processLegacyJSONRequest(Object requestData) {
		
		return process((LegacyJSONRequest)requestData);
	}
	
	/**
	 * Process the request with a unique switchboard instance to mimic standard step execution
	 * 
	 * 
	 * @param requestData
	 * @return
	 */
	private LegacyJSONResponse process(LegacyJSONRequest requestData) {
		
		LegacyJSONResponse response = new LegacyJSONResponse();
		Switchboard sw = new Switchboard();
		sw.isUpdateTransaction = true;
		sw.stepName = "Endpoint: " + requestData.stepName;
		sw.eventId = sw.getNextEventId();
		sw.userId = requestData.userId;
		sw.recordHistory();
		try {
			switch (this.endPointMode) {
			case "orders":
				response = LegacyDIOrderProcessor.process(requestData, SubmitHandler, RequestHandler, sw);
				break;
			case "results":
				response = LegacyDIResultProcessor.process(requestData, oruPath, SubmitHandler, RequestHandler, sw);
				break;
			case "logging":
				response = LegacyDILoggingProcessor.process(requestData, SubmitHandler, sw);
				break;
			case "containers":
				response = LegacyDIContainersProcessor.process(requestData, SubmitHandler, sw);
			default:
				break;
			}
			
			sw.commitOrRollback();
			sw.connection.close();
			
		} catch (Exception ex) {
			try {
				sw.rollback();
				sw.connection.close();
			} catch (Exception ex2) {
				
			}
		}
		
		((JDCConnection) sw.connection).expireLease();

		sw = null;
		
		return response;
	}

	@Override
	public GenericJSONResponse processGenericJSONRequest(String userId, GenericJSONRequest request) {
		// TODO Auto-generated method stub
		return null;
	}
	
}
