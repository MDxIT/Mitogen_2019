package com.sunquest.mitogen.lims.im;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.Map;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.uniconnect.uniflow.Node;
import com.uniconnect.uniflow.Switchboard;
import com.uniconnect.uniflow.api.model.LegacyJSONRequest;
import com.uniconnect.uniflow.api.model.LegacyJSONResponse;

/**
 * Services requests to the IM Legacy logging endpoint
 * Passes request contents to a handler reference for processing
 * 
 * @author szczepam
 *
 */
//TODO: Move to Mitogen LIMS package
//TODO: Use Jackson to parse request content
public class LegacyDILoggingProcessor {
	
	public static LegacyJSONResponse process(LegacyJSONRequest request, LegacyDIHandler messageHandler, Switchboard sw) {
		
		LegacyJSONResponse response = new LegacyJSONResponse();
		
		try {
		
			for (Map.Entry<Object, Object> e : request.data.entrySet()) {
				int messageCounter = 0;
				String key = e.getKey().toString();
				ArrayList<Object> o = (ArrayList<Object>)e.getValue();
				switch (key) {
				case "messages":
					
					
					for (int i = 0; i < o.size(); i++) {
						LinkedHashMap<Object, Object> o2= (LinkedHashMap<Object, Object>)o.get(i);
						
						Node messageNode = new Node();
						
						for (Map.Entry<Object, Object> e2 : o2.entrySet()) {
							switch (e2.getKey().toString()) {
							
							case "log":
								messageNode.add("log", e2.getValue().toString());
								break;
							case "messageType":
								messageNode.add("messageType", e2.getValue().toString());
								break;
							case "messageSource":
								messageNode.add("messageSource", e2.getValue().toString());
								break;
							case "messageData":
								ArrayList<Object> o3 = (ArrayList<Object>)e2.getValue();
								Node messageData = messageNode.add("messageData", "");
								for (int i2 = 0; i < o3.size(); i++) {
									messageData.add(String.valueOf(i2), o3.get(i).toString());
								}
								break;
							default:
								break;
							}
						}
						
						boolean handleResult = messageHandler.handle(messageNode, sw);
						
						if (handleResult) {
							response.addLoggingActionToDetailList(String.valueOf(messageCounter), "true", "success", "0");	
						} else {
							response.addLoggingErrorToDetailList("400", "user error", String.valueOf(messageCounter), "An error occurred", "error");
						}
						
						messageCounter++;
					}
					break;
				default:
					break;
					
				}
			}
			
			response.setResponseOK();
		
		
		} catch (Exception ex) {
			throw new com.uniconnect.uniflow.exception.SystemException("Error", new Object[] {}, ex);
		}
		
		return response;
	}
}