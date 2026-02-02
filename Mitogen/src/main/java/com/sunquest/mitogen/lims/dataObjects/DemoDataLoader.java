package com.sunquest.mitogen.lims.dataObjects;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.apache.poi.ss.usermodel.DataFormatter;
import org.apache.poi.ss.usermodel.FormulaEvaluator;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import com.uniconnect.uniflow.BuildSheetData;
import com.uniconnect.uniflow.BuildSheetStepData;
import com.uniconnect.uniflow.Switchboard;
import com.uniconnect.uniflow.exception.SystemException;

/**
 * 
 * Class to import data for customer demos from a specially formatted Excel Spreadsheet
 * 
 * @author szczepam
 *
 */
public class DemoDataLoader {
	
	//TODO: Make More Configurable
	
	/**
	*Internal Variables
	*/
	private boolean processWorkSheet;
	private static final Logger logger = LogManager.getLogger();
	private XSSFWorkbook workbook = null;
	private String dataSheetFile = "";
	private ArrayList<String> physicians = new ArrayList<String>();
	private ArrayList<String> physicianSites = new ArrayList<String>();
	private ArrayList<Patient> patients = new ArrayList<Patient>();
	private ArrayList<String> orders = new ArrayList<String>();
	private ArrayList<String> orderPatient = new ArrayList<String>();
	
	/**
	 * Status Variables
	 */
	private String status;
	private int statusCode;
	private String errorVariables;
	private String missingSearchKeys;

	/**
	 * Configurable Variables
	 */
	
	/**
	 * Name of physicians worksheet
	 */
	public String physicianSheetName = "PHYSICIANS";
			
	/**
	 * Name of patients worksheet
	 */
	public String patientsSheetName = "PATIENTS";
	
	/**
	 * Name of orders worksheet
	 */
	public String ordersSheetName = "ORDERS";
	
	/**
	 * Name of specimens worksheet
	 */
	public String specimenSheetName = "SPECIMENS";
	
	private Switchboard switchboard;
	
	
	/**
	 * Reads values from potenially null cells without a risk of an Exception
	 * 
	 * @param cell
	 * @return
	 */
	private String safeCellValueReader(org.apache.poi.ss.usermodel.Cell cell) {
		if (cell != null) {
			return cell.toString().trim();
		} else {
			return "";
		}
	}
	
	/**
	 * Reads values from potentially null cells and formats the string as an integer
	 * 
	 * @param cell
	 * @return
	 */
	private String safeCellIntegerReader(org.apache.poi.ss.usermodel.Cell cell) {
		return safeCellValueReader(cell).replace(".0", "");
	}
	
	private String safeCellDateReader(org.apache.poi.ss.usermodel.Cell cell) {
		String returnValue = safeCellValueReader(cell);
		Date parseDate = null;
		try {
			 parseDate = new SimpleDateFormat("yyyy-MM-dd").parse(returnValue);
		} catch (Exception ex) {
			try {
				 parseDate = new SimpleDateFormat("MM/dd/yyyy").parse(returnValue);
			} catch (Exception ex2) {
				try {
					parseDate = new SimpleDateFormat("dd-MMM-yyyy").parse(returnValue);
				} catch (Exception ex3) {
					parseDate = null;
				}
			}
		}
		
		if (parseDate != null) {
			Calendar cl = Calendar.getInstance();
			cl.setTime(parseDate);
			
			returnValue = String.format("%s-%s-%s", cl.get(Calendar.YEAR), cl.get(Calendar.MONTH) + 1, cl.get(Calendar.DAY_OF_MONTH));

		}
		
		return returnValue;
	}
	
	/**
	 * Creates class instance
	 * 
	 * @param dataSheetFile
	 * @param sw
	 */
	public DemoDataLoader(String dataSheetFile, Switchboard sw) {
		this.dataSheetFile  = dataSheetFile;
		this.switchboard = sw;
	}
	
	/**
	 *Handles Exceptions and allows centralized messaging of exception sources in the context of build sheet processing 
	 *Also, distills disparate exception types 
	 * 
	 * @param originalException
	 * @return
	 */
	private Exception manageException(Exception originalException)
	{
		Exception r = new Exception(originalException.getMessage());
		r.setStackTrace(originalException.getStackTrace());
		r.addSuppressed(originalException);
		
		return r;
	}
	
	/**
	 * Processes the Excel file
	 * 
	 * @throws Exception
	 */
	public void processWorkbook() throws Exception 
	{
		//TODO: Break up into object specific functions
		this.status = "Initializing Spread Sheet Processor";
		File excelFile = new File(dataSheetFile);
		this.statusCode = -1;
		
		String exceptionMessage = "";
		try 
		{
			
			exceptionMessage = "Could not access workbook content";
			try 
			{
				workbook = new XSSFWorkbook(excelFile);
			}
			catch (IOException ex)
			{
				throw manageException(ex);
			}
			
			exceptionMessage = String.format("Could not access physician worksheet: %s",physicianSheetName) ;
			XSSFSheet workSheet = workbook.getSheet(physicianSheetName);
			exceptionMessage = "Could not access Physician rows";
			Iterator<Row> worksheetRows = workSheet.rowIterator();

			Row worksheetRow = null;
			exceptionMessage = "Could not create formula evalutor";
			FormulaEvaluator formulaEval = workbook.getCreationHelper().createFormulaEvaluator();
			exceptionMessage = "Could not iterate through physician rows";
			while(worksheetRows.hasNext())
			{
				exceptionMessage = "Could not access next physician row";
				
				try {
					worksheetRow = worksheetRows.next();
				} catch (Exception ex) {

				}
				
				physicianSites.add(null);
				physicians.add(null);
				if (worksheetRow.getRowNum() > 0) {
				
					Organization oz = new Organization(safeCellValueReader(worksheetRow.getCell(0)), switchboard);
					if (!oz.recordExists()) {
						oz.save();
					}
					
					OrganizationSite ozSite = new OrganizationSite(oz.getOrgId(), safeCellValueReader(worksheetRow.getCell(1)), switchboard);
					
					if(!ozSite.recordExists()) {
						ozSite.setAddress1(safeCellValueReader(worksheetRow.getCell(24)));
						ozSite.setAddress2(safeCellValueReader(worksheetRow.getCell(25)));
						ozSite.setCity(safeCellValueReader(worksheetRow.getCell(26)));
						ozSite.setCountry("USA");
						ozSite.setEmail(safeCellValueReader(worksheetRow.getCell(29)));
						ozSite.setFax1(safeCellValueReader(worksheetRow.getCell(10)));
						ozSite.setPhone1(safeCellValueReader(worksheetRow.getCell(12)));
						ozSite.setPhone2(safeCellValueReader(worksheetRow.getCell(15)));
						ozSite.setPostalcode(safeCellValueReader(worksheetRow.getCell(28)));
						ozSite.setState(safeCellValueReader(worksheetRow.getCell(27)));
						ozSite.save();
					}
					
					Physician py = new Physician(Sequences.newPhysicianId(), switchboard);
					
					py.setDOB(safeCellDateReader(worksheetRow.getCell(18)));
					py.setFirstName(safeCellValueReader(worksheetRow.getCell(6)));
					py.setGender(safeCellValueReader(worksheetRow.getCell(17)));
					py.setLastName(safeCellValueReader(worksheetRow.getCell(5)));
					py.setMiddleName(safeCellValueReader(worksheetRow.getCell(7)));
					py.setProviderId(safeCellValueReader(worksheetRow.getCell(9)));
					py.setProviderType(safeCellValueReader(worksheetRow.getCell(22)));
					py.setTitle(safeCellValueReader(worksheetRow.getCell(13)));
					
					py.save();
					
					PhysicianSite ps = new PhysicianSite(py.getPhysicianId(), ozSite.getSiteId(), switchboard);
					
					ps.setActive(1);
					ps.setEmail(ozSite.getEmail());
					ps.setFax1(ozSite.getFax1());
					ps.setPhone1(ozSite.getPhone1());
					
					ps.save();
					
					physicianSites.set(physicianSites.size() - 1, ozSite.getSiteId());
					physicians.set(physicians.size() - 1, ps.getPhysicianId());
				}
			}
			
			workSheet = workbook.getSheet(this.patientsSheetName);
			exceptionMessage = "Could not access Patient rows";
			worksheetRows = workSheet.rowIterator();
			exceptionMessage = "Could not iterate through patient rows";
			while(worksheetRows.hasNext())
			{
				exceptionMessage = "Could not access next patient row";
				
				try {
					worksheetRow = worksheetRows.next();
				} catch (Exception ex) {
				}
				
				patients.add(null);
				
				if (worksheetRow.getRowNum() > 0) {
					Patient pa = new Patient(Sequences.newPatientId(), switchboard);
					String sqId = pa.getPatientId().replace("PA", "sqId");
					
					pa.setSQID(sqId);
					
					pa.setAddress1(safeCellValueReader(worksheetRow.getCell(24)));
					pa.setAddress2(safeCellValueReader(worksheetRow.getCell(25)));
					pa.setCity(safeCellValueReader(worksheetRow.getCell(26)));
					pa.setCountry(safeCellValueReader(worksheetRow.getCell(29)));
					pa.setDOB(safeCellDateReader(worksheetRow.getCell(9)));
					pa.setEmail(safeCellValueReader(worksheetRow.getCell(0)));
					pa.setEthnicity(safeCellValueReader(worksheetRow.getCell(33)));
					pa.setFirstName(safeCellValueReader(worksheetRow.getCell(3)));
					pa.setGenderId(safeCellValueReader(worksheetRow.getCell(11)));
					pa.setGeneticGender(safeCellValueReader(worksheetRow.getCell(12)));
					pa.setGovtId(safeCellValueReader(worksheetRow.getCell(19)));
					pa.setLastName(safeCellValueReader(worksheetRow.getCell(2)));
					pa.setMiddleName(safeCellValueReader(worksheetRow.getCell(4)));
					pa.setPhone1CountryCode(safeCellIntegerReader(worksheetRow.getCell(30)));
					pa.setPhone1(String.format("(%s) %s", safeCellIntegerReader(worksheetRow.getCell(31)), 
							safeCellValueReader(worksheetRow.getCell(32))));
					pa.setPostalCode(safeCellIntegerReader(worksheetRow.getCell(28)) );
					pa.setState(safeCellValueReader(worksheetRow.getCell(27)));
					
					
					patients.set(patients.size() - 1, pa);
				}
			}
			
			workSheet = workbook.getSheet(this.ordersSheetName);
			exceptionMessage = "Could not access Order rows";
			worksheetRows = workSheet.rowIterator();
			exceptionMessage = "Could not iterate through Order rows";
			long isYes = new Long(1);
			long isNo = new Long(0);
			while(worksheetRows.hasNext())
			{
				exceptionMessage = "Could not access next Order row";
				
				try {
					worksheetRow = worksheetRows.next();
				} catch (Exception ex) {
				}
				orderPatient.add(null);
				orders.add(null);
				
				if (worksheetRow.getRowNum() > 0) {
					RequestForm rf = new RequestForm(Sequences.newRequestId(), switchboard);
					int paRow = Integer.parseInt(safeCellIntegerReader(worksheetRow.getCell(1)))-1;
					Patient pa = patients.get(paRow);
					pa.setMRN(safeCellValueReader(worksheetRow.getCell(4)));
					pa.setSiteId(physicianSites.get(Integer.parseInt(safeCellIntegerReader(worksheetRow.getCell(0)))-1));
					
					pa.save();
					
					rf.setClinicalTrial((safeCellValueReader(worksheetRow.getCell(10)).equalsIgnoreCase("Yes") ? isYes : isNo));
					rf.setConsent((safeCellValueReader(worksheetRow.getCell(7)).equalsIgnoreCase("Yes") ? isYes : isNo));
					rf.setExternalRequestId(safeCellValueReader(worksheetRow.getCell(5)));
					rf.setMRN(patients.get(paRow).getMRN());
					rf.setPanelCode(safeCellValueReader(worksheetRow.getCell(2)));
					rf.setPatientId(patients.get(paRow).getPatientId());
					rf.setPatientSignature((safeCellValueReader(worksheetRow.getCell(8)).equalsIgnoreCase("Yes") ? isYes : isNo));
					rf.setPhysicianId(physicians.get(Integer.parseInt(safeCellIntegerReader(worksheetRow.getCell(0)))-1));
					rf.setPriority(Long.parseLong(safeCellIntegerReader(worksheetRow.getCell(6))));
					rf.setType(safeCellValueReader(worksheetRow.getCell(3)));
					rf.setWorkersComp((safeCellValueReader(worksheetRow.getCell(11)).equalsIgnoreCase("Yes") ? isYes : isNo));
					
					rf.save();

					orderPatient.set(orderPatient.size() - 1, rf.getPatientId());
					orders.set(orders.size() - 1, rf.getRequestId());
				}
			}
				
			workSheet = workbook.getSheet(this.specimenSheetName);
			exceptionMessage = "Could not access Specimen rows";
			worksheetRows = workSheet.rowIterator();
			exceptionMessage = "Could not iterate through specimen rows";
			while(worksheetRows.hasNext())
			{
				exceptionMessage = "Could not access next specimen row";
				
				try {
					worksheetRow = worksheetRows.next();
				} catch (Exception ex) {
				}
				if (worksheetRow.getRowNum() > 0) {
					int orderRow = Integer.parseInt(safeCellIntegerReader(worksheetRow.getCell(0)))-1;
					RequestSpecimen rs = new RequestSpecimen(orders.get(orderRow),
							orderPatient.get(orderRow), switchboard);
					
					rs.setExternalIdentifier(safeCellValueReader(worksheetRow.getCell(2)));
					rs.setSpecimenType(safeCellValueReader(worksheetRow.getCell(3)));
					rs.setSpecimenId(safeCellValueReader(worksheetRow.getCell(1)));
					rs.setStatus("ORDER ENTERED");
					rs.setSpecimenSource("self");
					rs.setSpecimenCondition("");
					rs.setExpectedBarcode("");
					
					rs.save();
				}
			}
			
			
			status = "Workbook successfully processed";
			statusCode = 0;
		}
		catch (Exception ex)
		{
			status = exceptionMessage;
			statusCode = -1;
			logger.info(ex.getMessage());
			logger.info(ex.getStackTrace());
			throw(ex);
		}
		finally
		{
			try 
			{
				if (workbook != null)
				{
					workbook.close();
				}
				
				excelFile = null;
				
			} catch(IOException ex) {
				logger.debug("Could not close workbook reader objects");
			}
		}
	}	
}
