package com.sunquest.mitogen.lims.filter;

import java.io.IOException;

import javax.annotation.Priority;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.container.ContainerRequestContext;
import javax.ws.rs.container.ContainerRequestFilter;
import javax.ws.rs.container.PreMatching;
import javax.ws.rs.core.HttpHeaders;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.ResponseBuilder;
import javax.ws.rs.ext.Provider;
import javax.ws.rs.Priorities;

import org.apache.http.HttpResponse;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.jboss.resteasy.specimpl.BuiltResponse;

import ca.uhn.fhir.rest.api.server.RequestDetails;
import ca.uhn.fhir.rest.client.api.IRestfulClientFactory;

import com.uniconnect.uniflow.api.RestResponse;
import com.uniconnect.uniflow.api.auth.ApiKeyAuthentication;
import com.uniconnect.uniflow.api.auth.BasicAuthentication;
import com.uniconnect.uniflow.api.auth.LegacyJSONAuthentication;

public class AuthenticationFilter{
	
	private static final Logger logger = LogManager.getLogger();
	private String authUser = "";

	public AuthenticationFilter() {}
	
	/**
	 * @param request 	This operation takes one parameter, the ContainerRequestContext provided by
	 * 					Uniflow. This is a parameter provided by the current Filter Registration done
	 * 					for the javax.application servlets. It contains all the necessary information about
	 * 					the request and response.
	 * @return This method returns a Response set within filterRequest based off of Authentication
	 */
	public Response filterRequest(ContainerRequestContext request) throws IOException {
		Response retVal =  filterRequest(request.getHeaderString(HttpHeaders.AUTHORIZATION), request.getMediaType().toString(),
			request.getUriInfo().getPath());
		// Add user information into the headers to pass downstream for creating a properly attributed event record.
		request.getHeaders().add("uniflowUserName", authUser);
		return retVal;
	}
	/**
	 * @param request 	This operation takes one parameter, the RequestDetails provided by
	 * 					HAPI FHIR Interceptors. This is a parameter provided by the new interceptors used by
	 * 					HAPI FHIR. It contains all the necessary information about
	 * 					the request and response.
	 * @return This method returns a Response set within filterRequest based off of Authentication
	 */
    public Response filterRequest(RequestDetails request) throws IOException {
		Response retVal = filterRequest(request.getHeader(HttpHeaders.AUTHORIZATION), request.getHeader(HttpHeaders.CONTENT_TYPE), 
			request.getRequestPath());
		//TODO: RequestDetails doesn't have any good way to add headers to requests only responses. For now
		//we will just hold on this 
		return retVal;
    }
    /**
	 * @param authorization		This is the authorization header in string format
	 * @param contenType		This is the content type of the request in string format
	 * @param pathInfo			This is the path information of the request in string format
	 * @return This method returns a Response based off of Authentication
	 */
	public Response filterRequest(String authorization, String contentType, String pathInfo) throws IOException {
		boolean headerAuth = false;
		boolean jsonAuth = false;
		boolean authStatus = false;
		
		if (authorization != null && !authorization.isEmpty()) {
			headerAuth = true;
		}
		
		//Allow JSON requests to pass further down to support IM interaction
		if (!headerAuth) {
			
			String mt = contentType;
			
			if (mt.toString().startsWith(MediaType.APPLICATION_JSON.toString())) {
				jsonAuth = true;
			}
		}
		
		if (!headerAuth && !jsonAuth) {
			logger.warn(String.format("Client error %d: No Authorization provided in request", 
					Response.Status.UNAUTHORIZED.getStatusCode()));
			
			
			return Response.status(Response.Status.UNAUTHORIZED)
			.entity(RestResponse.UNAUTHORIZED).type(MediaType.APPLICATION_JSON).build();
			
		}
		//Always favor header authorization first
		if (headerAuth) {
			try {
				if (authorization.startsWith("apiKey")) {
					ApiKeyAuthentication apiAuth = new ApiKeyAuthentication();
					authStatus = apiAuth.authenticate(authorization);
					authUser = apiAuth.getUser();
					
				} else {
					BasicAuthentication basicAuth = new BasicAuthentication();
					authStatus = basicAuth.authenticate(authorization);
					authUser = basicAuth.getUser();
				}
			} catch (Exception e) {
				logger.warn("Client error: Bad authentication data: " + e.getMessage());
				logger.debug(e);
				
				
				return Response.status(Response.Status.BAD_REQUEST)
				.entity(RestResponse.BAD_AUTHENTICATION).type(MediaType.APPLICATION_JSON).build();
			}
			
		} 
		else if (jsonAuth) {
			//Check if the JSON request if directed at the legacy endpoint, only authorize it if it is
			authStatus = LegacyJSONAuthentication.authenticate(pathInfo);
			authUser = "JSON Embedded User";
		}
		
		if (!authStatus) {
			logger.warn(String.format("Client error %d: Authentication failed for %s", 
					Response.Status.UNAUTHORIZED.getStatusCode(), authUser));
			return Response.status(Response.Status.UNAUTHORIZED)
			 		.entity(RestResponse.UNAUTHORIZED).type(MediaType.APPLICATION_JSON).build();
		}

		logger.info(String.format("Authentication successful for %s", authUser));
		return Response.status(Response.Status.ACCEPTED).build();
	}
}
