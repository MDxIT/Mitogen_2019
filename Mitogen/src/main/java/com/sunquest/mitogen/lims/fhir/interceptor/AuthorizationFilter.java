package com.sunquest.mitogen.lims.fhir.interceptor;

import ca.uhn.fhir.interceptor.api.Hook;
import ca.uhn.fhir.interceptor.api.Interceptor;
import ca.uhn.fhir.interceptor.api.Pointcut;
import ca.uhn.fhir.rest.api.server.RequestDetails;
import ca.uhn.fhir.rest.server.exceptions.AuthenticationException;
import ca.uhn.fhir.rest.server.interceptor.auth.AuthorizationInterceptor;
import ca.uhn.fhir.rest.server.interceptor.auth.IAuthRule;
import ca.uhn.fhir.rest.server.interceptor.auth.RuleBuilder;
import ca.uhn.fhir.rest.server.interceptor.InterceptorAdapter;

import java.io.IOException;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.core.Response;

import com.sunquest.mitogen.lims.filter.AuthenticationFilter;

import org.hl7.fhir.r5.model.IdType;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Interceptor
public class AuthorizationFilter extends AuthorizationInterceptor{

   private final Logger ourLog = LoggerFactory.getLogger(RouteRequestInterceptor.class);
   
    @Hook(Pointcut.SERVER_INCOMING_REQUEST_PRE_HANDLED)
    public void AuthorizationInterceptor(RequestDetails theRequest) {
    }
    /**
     * This method uses an annotation to register this method as a specific type of request as defined
     * in AuthorizationInterceptor.
     * @param theRequest 	This operation takes one parameter, the RequestDetails provided by
     * 					    FHIR Interceptors. This is a parameter provided by the current Filter Registration done
     * 					    for the javax.application servlets. It contains all the necessary information about
     * 					    the request and response.
     * @return              This method throws an exception if Authentication fails
     */
    @Override
    public List<IAuthRule> buildRuleList(RequestDetails theRequest) {
        try {
            AuthenticationFilter af = new AuthenticationFilter();
            Response r = af.filterRequest(theRequest);
            if (r.hasEntity()) {
                throw new AuthenticationException(r.getEntity().toString());
            }
        }
        catch (IOException e) {
            throw new AuthenticationException(e.getMessage());
        }
        return new RuleBuilder()
            .allowAll()
            .build();
    }
}