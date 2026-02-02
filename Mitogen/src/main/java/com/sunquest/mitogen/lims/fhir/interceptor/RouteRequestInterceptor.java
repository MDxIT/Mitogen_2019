package com.sunquest.mitogen.lims.fhir.interceptor;

import ca.uhn.fhir.interceptor.api.Hook;
import ca.uhn.fhir.interceptor.api.Interceptor;
import ca.uhn.fhir.interceptor.api.Pointcut;
import ca.uhn.fhir.rest.api.server.RequestDetails;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


@Interceptor
public class RouteRequestInterceptor {

   private final Logger ourLog = LoggerFactory.getLogger(RouteRequestInterceptor.class);

   //Interceptor for Api Exception Mapping
   @Hook(Pointcut.SERVER_INCOMING_REQUEST_PRE_HANDLED)
   public void ApiExceptionMapperInterceptor(RequestDetails theRequest) {
      ourLog.info("API Exception Mapper Interceptor: Request of type {} with request ID: {} and request path {}", theRequest.getOperation(), theRequest.getRequestId(), theRequest.getRequestPath());
   }

   //Interceptor for Not Found Exception Mapping
   @Hook(Pointcut.SERVER_INCOMING_REQUEST_PRE_HANDLED)
   public void NotFoundExceptionMapperInterceptor(RequestDetails theRequest) {
      ourLog.info("Not Found Exception Mapper Interceptor: Request of type {} with request ID: {} and request path {}", theRequest.getOperation(), theRequest.getRequestId(), theRequest.getRequestPath());
   }

   //Interceptor for Constraint Violation Exception Mapping
   @Hook(Pointcut.SERVER_INCOMING_REQUEST_PRE_HANDLED)
   public void ConstraintViolationExceptionMapperInterceptor(RequestDetails theRequest) {
      ourLog.info("Constraint Violation Exception Mapper Interceptor: Request of type {} with request ID: {} and request path {}", theRequest.getOperation(), theRequest.getRequestId(), theRequest.getRequestPath());
   }

   //Interceptor for Logged
   @Hook(Pointcut.SERVER_INCOMING_REQUEST_PRE_HANDLED)
   public void LoggedInterceptor(RequestDetails theRequest) {
      ourLog.info("Logged Interceptor: Request of type {} with request ID: {} and request path {}", theRequest.getOperation(), theRequest.getRequestId(), theRequest.getRequestPath());
   }

   //Interceptor for Logging Filter
   @Hook(Pointcut.SERVER_INCOMING_REQUEST_PRE_HANDLED)
   public void LoggingFilterInterceptor(RequestDetails theRequest) {
      ourLog.info("Logging Filter Interceptor: Request of type {} with request ID: {} and request path {}", theRequest.getOperation(), theRequest.getRequestId(), theRequest.getRequestPath());
   }

}