package com.sunquest.mitogen.lims.fhir;

import java.util.*;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.web.cors.CorsConfiguration;

import com.sunquest.mitogen.lims.fhir.interceptor.RouteRequestInterceptor;
import com.sunquest.mitogen.lims.fhir.interceptor.AuthorizationFilter;
import com.sunquest.mitogen.lims.fhir.provider.OrganizationResourceProvider;
import com.sunquest.mitogen.lims.fhir.provider.PatientResourceProvider;
import com.sunquest.mitogen.lims.fhir.provider.DiagnosticReportResourceProvider;
import com.sunquest.mitogen.lims.fhir.provider.ObservationResourceProvider;

import ca.uhn.fhir.context.FhirContext;
import ca.uhn.fhir.interceptor.api.Interceptor;
import ca.uhn.fhir.narrative.DefaultThymeleafNarrativeGenerator;
import ca.uhn.fhir.narrative.INarrativeGenerator;
import ca.uhn.fhir.rest.server.IResourceProvider;
import ca.uhn.fhir.rest.server.RestfulServer;
import ca.uhn.fhir.rest.server.interceptor.CorsInterceptor;
import ca.uhn.fhir.rest.server.interceptor.ResponseHighlighterInterceptor;
import ca.uhn.fhir.rest.server.interceptor.LoggingInterceptor;
import ca.uhn.fhir.rest.server.interceptor.ExceptionHandlingInterceptor; 

/**
 * This servlet is the actual FHIR server itself
 */
@Interceptor
public class FHIRServlet extends RestfulServer {

	private static final long serialVersionUID = 1L;

	//private final Logger fhirSvrLog = LoggerFactory.getLogger(FHIRServlet.class);
	private final Logger fhirSvrLog = LoggerFactory.getLogger(RouteRequestInterceptor.class);

	/**
	 * Constructor
	 */
	public FHIRServlet() {
		super(FhirContext.forR4()); // Support DSTU2
	}

	/**
	 * This method is called automatically when the
	 * servlet is initializing.
	 */
	@Override
	public void initialize() {
		/*
		 * Two resource providers are defined. Each one handles a specific 
		 * type of resource.
		 */
		List<IResourceProvider> providers = new ArrayList<>();
		providers.add(new PatientResourceProvider());
		providers.add(new OrganizationResourceProvider());
		providers.add(new DiagnosticReportResourceProvider());
		//providers.add(new ObservationResourceProvider());
		setResourceProviders(providers);

		/*
		 * Use a narrative generator. This is a completely optional step,
		 * but can be useful as it causes HAPI to generate narratives for
		 * resources which don't otherwise have one.
		 */
		INarrativeGenerator narrativeGen = new DefaultThymeleafNarrativeGenerator();
		getFhirContext().setNarrativeGenerator(narrativeGen);

		/*
		 * Enable CORS
		 */
		CorsConfiguration config = new CorsConfiguration();
		CorsInterceptor corsInterceptor = new CorsInterceptor(config);
		config.addAllowedHeader("Accept");
		config.addAllowedHeader("Content-Type");
		config.addAllowedOrigin("*");
		config.addExposedHeader("Location");
		config.addExposedHeader("Content-Location");
		config.setAllowedMethods(Arrays.asList("GET","POST","PUT","DELETE","OPTIONS"));
		registerInterceptor(corsInterceptor);

		/*
		 * This server interceptor causes the server to return nicely 
		 * formatter and coloured responses instead of plain JSON/XML if 
		 * the request is coming from a browser window. It is optional,
		 * but can be nice for testing.
		 */
		registerInterceptor(new ResponseHighlighterInterceptor());

		//Register the interceptor that runs all existing uniflow ContainerRequestFilters
		registerInterceptor(new RouteRequestInterceptor());
		registerInterceptor(new AuthorizationFilter());
		//registerInterceptor(new UniflowFilterInterceptor());

		ExceptionHandlingInterceptor excepInterceptor = new ExceptionHandlingInterceptor();
		registerInterceptor(excepInterceptor);
		 

		// Now register the logging interceptor
		LoggingInterceptor loggingInterceptor = new LoggingInterceptor();
		// The SLF4j logger will receive the logging events 
		 //loggingInterceptor.setLoggerName("test.accesslog");
		 loggingInterceptor.setLogger(fhirSvrLog);
		registerInterceptor(loggingInterceptor);
  
		
		
		// This is the format for each line. A number of substitution variables may
		// be used here. See the JavaDoc for LoggingInterceptor for information on
		// what is available.
		loggingInterceptor.setMessageFormat("Source[${remoteAddr}] Operation[${operationType} ${idOrResourceName}] UA[${requestHeader.user-agent}] Params[${requestParameters}]");

		/*
		 * Tells the server to return pretty-printed responses by default
		 */
		setDefaultPrettyPrint(true);
		
	}
}