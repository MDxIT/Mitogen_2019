package com.sunquest.mitogen.lims.im;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.Map;

import com.uniconnect.uniflow.Node;
import com.uniconnect.uniflow.Switchboard;
import com.uniconnect.uniflow.api.model.LegacyJSONRequest;
import com.uniconnect.uniflow.api.model.LegacyJSONResponse;

/**
 * Processes calls to the IM Results legacy endpoint
 * Endpoint has two modes based on the data sent, results acceptance and returning results
 * @author szczepam
 *
 */

//TODO: Move to Mitogen LIMS package
//TODO: Use Jackson to parse request content
public class LegacyDIResultProcessor {
	public static LegacyJSONResponse process(LegacyJSONRequest request, String hl7Path, LegacyDIHandler resultSubmitHandler, LegacyDIHandler resultRequestHandler, Switchboard sw) {
		
		LegacyJSONResponse response = new LegacyJSONResponse();
		
		try {
			
			for (Map.Entry<Object, Object> e : request.data.entrySet()) {
				
				String key = e.getKey().toString();
				ArrayList<Object> o = (ArrayList<Object>)e.getValue();
				switch (key) {
				case "orders":
					for (int i = 0; i<o.size(); i++)
					{
						LinkedHashMap<Object, Object> o2= (LinkedHashMap<Object, Object>)o.get(i);
						
						Node orderNode = new Node();
						
						String orderId = "";
						String containerId = "";
						String specimenId = "";
						String siteId = "";
						String queue = "";
						String type = "";
						ArrayList<String> oru = null;
						
						for(Map.Entry<Object, Object> e2 : o2.entrySet()) {
							String key2 = e2.getKey().toString();
							switch (key2) {
							case "orderId":
								orderId = e2.getValue().toString();
								orderNode.add(key2, orderId);
								break;
							case "containerId":
								containerId = e2.getValue().toString();
								orderNode.add(key2, containerId);
								break;
							case "specimenId":
								specimenId = e2.getValue().toString();
								orderNode.add(key2, specimenId);
								break;
							case "siteId":
								siteId = e2.getValue().toString();
								orderNode.add(key2, siteId);
								break;
							case "queue":
								queue = e2.getValue().toString();
								orderNode.add(key2, queue);
								break;
							case "type":
								type = e2.getValue().toString();
								orderNode.add(key2, type);
								break;
							case "messages":
								oru= (ArrayList<String>)e2.getValue();
								Node oruNode = orderNode.add("oru", "");
								for (int i2 = 0; i2<oru.size(); i2++) {
									oruNode.add(String.valueOf(i2), oru.get(i2));
								}
								break;
							}
						}
						//TODO: Call handler
						boolean handleResult = resultSubmitHandler.handleResultSubmission(orderNode, hl7Path, sw);
						
						if (handleResult) {
							response.addOrderProcessedPayload("true", orderId, containerId, "success");	
						} else {
							response.addOrderProcessedPayload("false", orderId, containerId, "failed to process order");
						}
					}
					
					response.setResponseOK();
					break;
				case "getResults":
					for (int i = 0; i<o.size(); i++)
					{
						LinkedHashMap<Object, Object> o2= (LinkedHashMap<Object, Object>)o.get(i);
						
						Node orderNode = new Node();
						
						String orderId = "";
						String containerId = "";
						String specimenId = "";
						String siteId = "";
						String queue = "";
						String type = "";
						
						for(Map.Entry<Object, Object> e2 : o2.entrySet()) {
							String key2 = e2.getKey().toString();
							switch (key2) {
							case "orderId":
								orderId = e2.getValue().toString();
								orderNode.add(key2, orderId);
								break;
							case "containerId":
								containerId = e2.getValue().toString();
								orderNode.add(key2, containerId);
								break;
							case "specimenId":
								specimenId = e2.getValue().toString();
								orderNode.add(key2, specimenId);
								break;
							case "siteId":
								siteId = e2.getValue().toString();
								orderNode.add(key2, siteId);
								break;
							case "queue":
								queue = e2.getValue().toString();
								orderNode.add(key2, queue);
								break;
							case "type":
								type = e2.getValue().toString();
								orderNode.add(key2, type);
								break;
							}
							
							//TODO: Call handler, for now return results not ready
							
							String status = "not ready";
							
							ArrayList<String> oruArray = new ArrayList<String>();
							
							response.addOrderToDetailList(containerId, orderId, specimenId, status, type, oruArray);
						}
					}
					break;
				default:
					break;
				}
			}
		} catch (Exception ex) {
			
		}
		
		return response;
	}
}
