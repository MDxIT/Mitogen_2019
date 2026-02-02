package com.sunquest.mitogen.lims.im;

import java.io.BufferedWriter;
import java.io.FileWriter;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Date;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import com.uniconnect.uniflow.Node;
import com.uniconnect.uniflow.Switchboard;
import com.uniconnect.uniflow.node.jython;


/**
 * TEMPORARY handler substitute to process interactions with IM
 * 
 * @author szczepam
 *
 */
//TODO Make this go away and replace with mappers and hanlders
public class LegacyDIHandler {

	private Node handlerInstructions = null;
	private static final Logger logger = LogManager.getLogger();
	
	public LegacyDIHandler() {
		
	}
	
	public LegacyDIHandler(Node handlerInstructions) {
	
		this.handlerInstructions = handlerInstructions;
	}
	
	//Default no-op handler
	public boolean handle(Node valuesToHandle, Switchboard sw) {
		return true;
	}
	/**
	 * Handles result submission requests, writes message content out to the HL7 processing folder
	 * 
	 * @param valuesToHandle
	 * @param hl7Path
	 * @param sw
	 * @return
	 */
	public boolean handleResultSubmission(Node valuesToHandle, String hl7Path, Switchboard sw) {
		String hl7Payload = "";
		String fileName =  hl7Path + (hl7Path.endsWith("/") ? "" : "/") + DateTimeFormatter.ofPattern("yyyyMMddHHmmssSSS").format(LocalDateTime.now()) + String.valueOf(sw.eventId) + "_oru.hl7";
		boolean result = false;
		Node oruNode = valuesToHandle.getOrNull("oru");
		
		if (oruNode != null) {
			for(Node n = oruNode.head; n != null; n = n.next) {
				
				hl7Payload += n.value;
				hl7Payload += "\r";
			}
		}
		
		if (hl7Payload.length() > 0) {
			BufferedWriter writer = null;
			try {
				writer = new BufferedWriter(new FileWriter(fileName));
				writer.write(hl7Payload);
				result = true;
			} catch (Exception ex) {
				Switchboard.log(String.format("Unable to write Legacy JSON HL7 result file: %s", fileName)); 
				Switchboard.log(ex.getMessage());
			} finally {
				try {
				writer.close();
				} catch (Exception ex) {

				}
			}
			writer = null;
		}
		
		return result;
	}
	
	
	/**
	 * Processes requests for orders from IM.  IM requests orders by queue name.  Only runIds queued will be processed.
	 * 
	 * @param valuesToHandle
	 * @param sw
	 * @return
	 */
	public Node handleOrderRequest(Node valuesToHandle, Switchboard sw) {
		Node r = new Node("orders");
		
		String queueName = valuesToHandle.getOrDefault("queue", "");
		
		if (queueName.length() > 0) {
			try {
				PreparedStatement ps = sw.connection.prepareStatement("SELECT q.containerId, cp.value AS fromStep FROM queues q INNER JOIN containerProperties cp ON q.containerId = cp.containerId INNER JOIN containers c ON q.containerId = c.containerId WHERE q.step = ? AND cp.property = ? AND (c.containerType = ? OR c.containerType = ?)");
				ps.setString(1, queueName);
				ps.setString(2, "Current DI Step");
				ps.setString(3, "runId");
                ps.setString(4, "controlRunId");				
				ResultSet rs = ps.executeQuery();
				
				while (rs.next()) {
					
					String runId = rs.getString(1);
					String fromStep = rs.getString(2);
					
					//Execute the enchanted forest builder and put the results in the current switchboard resultForest
					Node instructionNode = new Node("responseInstructions", "getDIData");
					Node jythonNode = instructionNode.add(new jython());
					jythonNode.add("from", "runForest import *");
					jythonNode.add("resultNode = AppTree(switchboard, '" + runId + "', '" + fromStep +"').buildTree()", "");
					jythonNode.add("switchboard.resultForest.add(resultNode.makeClone())", "");
					jythonNode.add(new Node(""));
					
					sw.executeInstructions(instructionNode.head);
					
					Node newResult = new Node("order");
					
					newResult.add("containerId", runId);
					newResult.add("orderId", sw.resultForest.head.getOrDefault("orders.order.requestId", ""));
					newResult.add("specimenId", sw.resultForest.head.getOrDefault("specimens.specimen.specimenId", ""));
					newResult.add("status", "complete");
					newResult.add("type", "hl7");
					Node orm = newResult.add("orm", "");
					
					//Create node pointers to speed up lookups.
					Node patient = sw.resultForest.head.getOrDefaultNode("patients.patient", "patient", "1");
					Node order = sw.resultForest.head.getOrDefaultNode("orders.order", "order", "1");
					Node specimen = sw.resultForest.head.getOrDefaultNode("specimens.specimen", "specimen", "1");
					String panelCode = order.getOrDefault("panels.panelCode", ""); // This isn't following convention
					Node physician = sw.resultForest.head.getOrDefaultNode("physicians.physician", "physician", "1");
					Node site = sw.resultForest.head.getOrDefaultNode("sites.site", "site", "1");
					Node run = sw.resultForest.head.getOrDefaultNode("labProcess.run", "run", "1");
					Node runData = run.getOrDefaultNode("runData", "runData", "");
					
					int obrCounter = 1;
					String messageStamp = new SimpleDateFormat("yyyyMMddHHmmss").format(new Date());
					
					//TODO: Make message builder better.  
					orm.add("0", "MSH|^~\\&|SQLAB|" + order.getOrDefault("externalSystem", "") + "|MITOGEN||"+messageStamp+"||ORM^O01|"+messageStamp+"|D|2.3"); 
					orm.add("1", "PID||||" + patient.getOrDefault("mrns.mrn", "") + "|"+ patient.getOrDefault("lastName", "") + "^" + patient.getOrDefault("firstName", "") + "^" + patient.getOrDefault("middleName", "") + "||" + patient.getOrDefault("dob", "").replaceAll("-", "") + "|"+ patient.getOrDefault("geneticGender", "") + "||"+ patient.getOrDefault("ethnicity", "")+ "|"+ patient.getOrDefault("address1", "")+ "^"+ patient.getOrDefault("address2", "")+ "^"+ patient.getOrDefault("city", "")+ "^"+ patient.getOrDefault("state", "")+ "^"+ patient.getOrDefault("postalCode", "")+ "^"+ patient.getOrDefault("country", "")+ "||"+ patient.getOrDefault("homePhone", "")+ "|"+ patient.getOrDefault("workPhone", "")+ "|||||" + patient.getOrDefault("governmentId", "") + "|||");
					orm.add("2", "ORC|NW|" + specimen.getOrDefault("specimenId", "") + "|" + order.getOrDefault("externalRequestId", "") + "|||||^^^^^" + order.getOrDefault("priority", "") + "|" + order.getOrDefault("receivedDate", "").replaceAll("-", "") + "|||" + order.getOrDefault("physicianId", "") + "^" + physician.getOrDefault("lastName", "") + "^" + physician.getOrDefault("firstName", "") + "^" + physician.getOrDefault("middleName", "") + "^^^|||||||||" + site.getOrDefault("mitogenSiteId", "") + "^" + site.getOrDefault("siteName", "") );
					for (Node n = runData.head; n != null; n = n.next) {
						if (n.tag.equals("analysisMethod")) {
							Node n2 = n.getOrNull("resultData");
							if (n2 != null) {
								for (Node n3 = n2.head; n3 != null; n3 = n3.next) {
									if (n3.tag.equals("resultDatum")) {
										Node n4 = n3.getOrNull("resultCode");
										if (n4 != null) {
											orm.add(String.valueOf(2+obrCounter), "OBR|" +  String.valueOf(obrCounter) +"|" + run.getOrDefault("currentContainerId", "") + "|" + run.getOrDefault("runId", "") + "|" + n4.value + "|||" + specimen.getOrDefault("collectionDate", "").replaceAll("-", "") + specimen.getOrDefault("collectionTime", "").replaceAll(":", "") +"|" + specimen.getOrDefault("receivedDate", "").replaceAll("-", "") + "|" + specimen.getOrDefault("receivedQuantity", "") + "^" + specimen.getOrDefault("receivedQuantityUnits", "") + "||||||" + specimen.getOrDefault("specimenType", "") + "|||" + n.value + "|"+run.getOrDefault("currentParentId", "")+"|"+run.getOrDefault("currentParentPosition", "")+"|" + order.getOrDefault("requestId", "") + "|||||||||||||||");
											obrCounter++;
										}
									}
								}
							}
						}
					}
					r.add(newResult.makeClone());
					
					//reset the resultForest for the next pass
					sw.resultForest = new Node("resultForest", "");
				}
				
				rs.close();
				ps.close();
				rs = null;
				ps = null;
			} catch (Exception ex) {
				Switchboard.log(ex.getMessage());
			
			}
		}

		return r;
	}
}