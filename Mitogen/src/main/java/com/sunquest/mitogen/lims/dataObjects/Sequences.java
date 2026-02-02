package com.sunquest.mitogen.lims.dataObjects;

import com.uniconnect.uniflow.Switchboard;

/**
 * Static class for LIMS sequences
 * @author szczepam
 *
 */
public class Sequences {
	/**
	 * Sequence for new organizations with prefix
	 * 
	 * @param sw
	 * @return
	 */
	public static String newOrgId() {
		return Switchboard.generateNextInSequenceWPrefix("orgId");
	}
	
	/**
	 * Sequence for new organization sites with prefix
	 * 
	 * @param sw
	 * @return
	 */
	public static String newSiteId() {
		return Switchboard.generateNextInSequenceWPrefix("siteId");
	}
	
	/**
	 * Sequence for new physicians with prefix
	 * 
	 * @param sw
	 * @return
	 */
	public static String newPhysicianId() {
		return Switchboard.generateNextInSequenceWPrefix("physicianId");
	}
	
	/**
	 * Sequence for new patients with prefix
	 * 
	 * @param sw
	 * @return
	 */
	public static String newPatientId() {
		return Switchboard.generateNextInSequenceWPrefix("patientId");
	}
	
	/**
	 * Sequence for new requests with prefix
	 * 
	 * @param sw
	 * @return
	 */
	public static String newRequestId() {
		return Switchboard.generateNextInSequenceWPrefix("requestId");
	}
}
