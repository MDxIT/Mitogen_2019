package com.sunquest.mitogen.lims.im;

import com.uniconnect.uniflow.Node;
import com.uniconnect.uniflow.services.endpoints.Endpoint;
import com.uniconnect.uniflow.services.endpoints.EndpointLoader;


public class LegacyDIEndpoint implements EndpointLoader {

	@Override
	public Endpoint getEndpoint(Node configNode) {
		
		
		Node parmNode = configNode.getOrNull("parameters");
		if (parmNode == null) {
			parmNode = configNode;
		}
      	String endpointMode = parmNode.get("mode").value;
      	Endpoint ret = null;
      	
      	switch (endpointMode) {
      	case "orders":
        	ret = new LegacyDIRequestEndpoint(endpointMode, new LegacyDIHandler(), new LegacyDIHandler());
      		break;
      	case "results":
        	ret = new LegacyDIRequestEndpoint(endpointMode, parmNode.get("hl7Path").value, new LegacyDIHandler(), new LegacyDIHandler());
      		break;
      	case "logging":
        	ret = new LegacyDIRequestEndpoint(endpointMode, new LegacyDIHandler());
      		break;
      	case "containers":
        	ret = new LegacyDIRequestEndpoint(endpointMode, new LegacyDIHandler());
      		break;
      	default:
      		break;
      	}
		return ret;
	}
	
}
