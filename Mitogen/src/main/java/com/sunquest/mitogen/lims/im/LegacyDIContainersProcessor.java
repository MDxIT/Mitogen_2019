package com.sunquest.mitogen.lims.im;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.Map;

import java.sql.PreparedStatement;
import java.sql.SQLException;

import com.uniconnect.uniflow.Node;
import com.uniconnect.uniflow.Switchboard;
import com.uniconnect.uniflow.api.model.LegacyJSONRequest;
import com.uniconnect.uniflow.api.model.LegacyJSONResponse;
/**
 * Services requests to IM Legacy containers endpoint
 * 
 * Performs queuing and dequeuing functions as defined by request content
 * 
 * @author szczepam
 *
 */
//TODO: Move to Mitogen LIMS Project
//TODO: Use Jackson to parse request content
public class LegacyDIContainersProcessor {
	
	public static LegacyJSONResponse process(LegacyJSONRequest request, LegacyDIHandler messageHandler, Switchboard sw) {
		
		LegacyJSONResponse response = new LegacyJSONResponse();
		
		try {
			Node containerNode = new Node(); 
			Node containers = containerNode.add("containerIds", "");
			String action = "";
			String newQueue = "";
			String oldQueue = "";
			String siteId = "";
			
			for (Map.Entry<Object, Object> e : request.data.entrySet()) {
				
				String key = e.getKey().toString();
				
				switch (key) {
				case "containerIds":
					ArrayList<Object> o = (ArrayList<Object>)e.getValue();
					
					for (int i = 0; i < o.size(); i++) {
						containers.add(String.valueOf(i), o.get(i).toString());
					}
					break;
				case "action":
					action = e.getValue().toString();
					containerNode.add("action", action);
					break;
				case "parameters":
					for (Map.Entry<Object, Object> e2 : ((LinkedHashMap<Object, Object>)e.getValue()).entrySet()) {
						switch(e2.getKey().toString()) {
						case "siteId":
							siteId = e2.getValue().toString();
							break;
						case "deQueueStepName":
							oldQueue = e2.getValue().toString();
							break;
						case "newQueueStepName":
							newQueue = e2.getValue().toString();
							break;
						default:
							break;
							
						}
					}
					break;
				default:
					break;
				}
			}
			
			String insertQueueSQL = "INSERT INTO queues (containerId, step, eventId) VALUES (?, ?, ?)";
			String deleteQueueSQL = "DELETE FROM queues  WHERE containerId = ? AND step = ?";
			String containerHistory = "INSERT INTO containerHistory (containerId, eventId) VALUES (?,?)";
			PreparedStatement ps = null;
			Boolean tookContainerAction = false;
			
			for (Node n = containers.head; n != null; n = n.next) {
				
				tookContainerAction = false;
				n.add("newQueueStepName", newQueue);
				n.add("deQueueStepName", oldQueue);
				n.add("action", action);
				n.add("siteId", siteId);
				
				if (action.equals("insertQueue") || action.equals("transferQueue")) {
					ps = sw.connection.prepareStatement(insertQueueSQL);
					ps.setString(1, n.value);
					ps.setString(2, newQueue);
					ps.setLong(3, sw.eventId);
					ps.execute();
					ps.close();
					tookContainerAction = true;
				}
				if (action.equals("deQueue") || action.equals("transferQueue")) {
					ps = sw.connection.prepareStatement(deleteQueueSQL);
					ps.setString(1, n.value);
					ps.setString(2, oldQueue);
					ps.executeUpdate();
					ps.close();
					tookContainerAction = true;
				}
				
				if (tookContainerAction) {
					ps = sw.connection.prepareStatement(containerHistory);
					ps.setString(1, n.value);
					ps.setLong(2, sw.eventId);
					ps.executeUpdate();
					ps.close();
					response.addContainerActionToDetailList(n.value, "success", "true");
				} else {
					response.addContainerActionToDetailList(n.value, "Did not process container", "false");
				}
				
			}
			
			response.setResponseOK();
			
		} catch (SQLException ex) {
			throw new com.uniconnect.uniflow.exception.SystemException("Error", new Object[] {}, ex);
		} catch (Exception ex) {
			throw new com.uniconnect.uniflow.exception.SystemException("Error", new Object[] {}, ex);
		}
		
		return response;
	}
}