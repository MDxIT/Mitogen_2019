package com.sunquest.mitogen.lims.im;

import java.io.BufferedWriter;
import java.io.FileWriter;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.Map;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.uniconnect.uniflow.Node;
import com.uniconnect.uniflow.Switchboard;
import com.uniconnect.uniflow.api.model.LegacyJSONOrders;
import com.uniconnect.uniflow.api.model.LegacyJSONRequest;
import com.uniconnect.uniflow.api.model.LegacyJSONResponse;

/**
 * 
 * Processes requests to IM Legacy orders endpoint
 * Endpoint has 2 modes depedning on message content, order acceptance and order detail response
 * 
 * @author szczepam
 *
 */
//TODO: Move to Mitogen LIMS package
//TODO: Use Jackson to parse request content
public class LegacyDIOrderProcessor {
	
	public static LegacyJSONResponse process(LegacyJSONRequest request, LegacyDIHandler orderSubmitHandler, LegacyDIHandler orderRequestHandler, Switchboard sw) {
		
		LegacyJSONOrders legacyOrders = new LegacyJSONOrders();
		LegacyJSONResponse response = new LegacyJSONResponse();
		
		try {
		
			for (Map.Entry<Object, Object> e : request.data.entrySet()) {
				
				String key = e.getKey().toString();
				ArrayList<Object> o = (ArrayList<Object>)e.getValue();
				switch (key) {
				case "orders":
					
					
					for (int i = 0; i < o.size(); i++) {
						LinkedHashMap<Object, Object> o2= (LinkedHashMap<Object, Object>)o.get(i);
						
						Node orderNode = new Node();
						
						String orderId = "";
						String containerId = "";
						ArrayList<String> orm = null;
						ArrayList<String> oru = null;
						
						for (Map.Entry<Object, Object> e2 : o2.entrySet()) {
							
							switch (e2.getKey().toString()) {
							
							case "type":
								orderNode.add("orderType", e2.getValue().toString());
								break;
							case "orderId":
								orderId = e2.getValue().toString();
								orderNode.add("orderId", orderId);
								break;
							case "siteId":
								orderNode.add("siteId", e2.getValue().toString());
								break;
							case "containerId":
								containerId = e2.getValue().toString();
								orderNode.add("containerId", containerId);
								break;
							case "queue":
								orderNode.add("orderQueue", e2.getValue().toString());
								break;
							case "orm":
								orm = (ArrayList<String>)e2.getValue();
								Node ormNode = orderNode.add("orm", "");
								for (int i2 = 0; i2 < orm.size(); i2++) {
									ormNode.add(String.valueOf(i2), orm.get(i2));
								}
								break;
							case "oru":
								oru = (ArrayList<String>)e2.getValue();
								Node oruNode = orderNode.add("oru", "");
								for (int i2 = 0; i2 < oru.size(); i2++) {
									oruNode.add(String.valueOf(i2), oru.get(i2));
								}
								break;
							default:
								break;
							}
						}
						
						//TODO: Call handler
						boolean handleResult = orderSubmitHandler.handle(orderNode, sw);
						
						if (handleResult) {
							response.addOrderProcessedPayload("true", orderId, containerId, "success");	
						} else {
							response.addOrderProcessedPayload("false", orderId, containerId, "failed to process order");
						}
						
					}
					break;
				case "data":
					
					for (int i = 0; i < o.size(); i++) {
						LinkedHashMap<Object, Object> o2= (LinkedHashMap<Object, Object>)o.get(i);
						
						Node orderNode = new Node();
						
						String orderFormat = "";
						String queue = "";
						String orderId = "";
						String specimenId = "";
						String containerId = "";
						String siteId = "";
						
						for (Map.Entry<Object, Object> e2 : o2.entrySet()) {
							switch (e2.getKey().toString()) {
							
							case "orderFormat":
								orderFormat = e2.getValue().toString();
								orderNode.add("orderFormat", orderFormat);
								break;
							case "orderId":
								orderId =  e2.getValue().toString();
								orderNode.add("orderId", orderId);
								break;
							case "siteId":
								orderNode.add("siteId", e2.getValue().toString());
								break;
							case "containerId":
								containerId = e2.getValue().toString();
								orderNode.add("containerId", containerId);
								containerId = e2.getValue().toString();
								break;
							case "specimenId":
								specimenId = e2.getValue().toString();
								orderNode.add("specimenId", specimenId);
								break;
							case "queue":
								orderNode.add("queue", e2.getValue().toString());
								break;
							default:
								break;
							}
						}
						
						//TODO: Call handler
						Node handlerResult = orderRequestHandler.handleOrderRequest(orderNode, sw);
						if (handlerResult.head != null) {
							for (Node n = handlerResult.head; n != null; n = n.next) {
								String status = n.getOrDefault("status", "");
								containerId  = n.getOrDefault("containerId", "");
								orderId  = n.getOrDefault("orderId", "");
								specimenId  = n.getOrDefault("specimenId", "");
								
								Node ormData = n.get("orm");
								ArrayList<String> ormArray = new ArrayList<String>();
								int i3 = 0;
								
								for (Node n2 = ormData.getOrNull(String.valueOf(i3)); n2 != null; n2 = ormData.getOrNull(String.valueOf(i3))) {
									ormArray.add(n2.value);
									i3++;
								}
								
								response.addOrderToDetailList(containerId, orderId, specimenId, status, orderFormat, ormArray);
							}
						} else {
							response.addContainerActionNoOp();
						}
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
