package com.sunquest.mitogen.lims.fhir.provider;

import ca.uhn.fhir.rest.server.exceptions.AuthenticationException;
import ca.uhn.fhir.rest.server.interceptor.InterceptorAdapter;
import ca.uhn.fhir.rest.server.interceptor.auth.AuthorizationInterceptor;
//import ca.uhn.fhir.jpa.model.interceptor.api.Hook;
//import ca.uhn.fhir.jpa.model.interceptor.api.Pointcut;
import ca.uhn.fhir.rest.api.server.RequestDetails;

import java.io.IOException;

import javax.inject.Provider;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.container.ContainerRequestContext;
import javax.ws.rs.container.ContainerRequestFilter;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.Response;

import com.uniconnect.uniflow.api.auth.AuthenticationFilter;
import com.uniconnect.uniflow.api.exception.ApiExceptionMapper;
import com.uniconnect.uniflow.api.exception.ConstraintViolationExceptionMapper;
import com.uniconnect.uniflow.api.exception.NotFoundExceptionMapper;
import com.uniconnect.uniflow.api.logging.Logged;
import com.uniconnect.uniflow.api.logging.LoggingFilter;

import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.util.EntityUtils;

public class UniflowFilterInterceptor extends AuthorizationInterceptor{

    /**
     * Constructor
     */
    public UniflowFilterInterceptor() {
        super();
    }

    
    public boolean incomingRequestPreProcessed(HttpServletRequest theRequest, HttpServletResponse theResponse) {
        // try {
        //     //Response r = AuthenticationFilter.filterRequest(theRequest, theResponse);
        //     // if (r.hasEntity())
        //     // {
        //     //     throw new AuthenticationException(r.getEntity().toString());
        //     // }
        // } 
        // catch (IOException e) 
        // {
        //     // TODO Auto-generated catch block
        //     throw new AuthenticationException(e.getMessage());
        // }
        return true;
    }
}