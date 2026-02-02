using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using OpenQA.Selenium;
using OpenQA.Selenium.Support.UI;
using SQAutomationLibrary;
using SQAutomationLibrary.Selenium;

namespace MitogenLimsTest.UI.Library.Pages
{
    public static class AccessioningPage
    {
        private static IWebElement _patientFirstName => Driver.Instance.FindElement(By.Name("firstName"));
        private static IWebElement _patientLastName => Driver.Instance.FindElement(By.Name("lastName"));
        private static IWebElement _patientSSN => Driver.Instance.FindElement(By.Name("ssn"));
        private static IWebElement _patientDOB => Driver.Instance.FindElement(By.Name("dob"));
        private static IWebElement _patientGenderList => Driver.Instance.FindElement(By.Name("newPatientGender"));

        private static SelectElement _selectablePatientGenderList = new SelectElement(_patientGenderList);
        private static IWebElement _patientEthnicityList => Driver.Instance.FindElement(By.Id("ethnicity"));
        private static SelectElement _selectablePatientEthnicityList = new SelectElement(_patientEthnicityList);
        private static IWebElement _patientAddress1 => Driver.Instance.FindElement(By.Name("address1"));
        private static IWebElement _patientCity => Driver.Instance.FindElement(By.Name("city"));
        private static IWebElement _patientStateList => Driver.Instance.FindElement(By.Name("state"));
        private static SelectElement _selectablePatientStateList = new SelectElement(_patientStateList);
        private static IWebElement _patientPostalCode => Driver.Instance.FindElement(By.Name("postalCode"));

        private static IWebElement _orgIdList = Driver.Instance.FindElement(By.Id("orgId"));
        private static SelectElement _selectableOrgIdList = new SelectElement(_orgIdList);
        private static IWebElement _physicianIdList => Driver.Instance.FindElement(By.Id("phyId"));
        private static SelectElement _selectablePhysicianIdList = new SelectElement(_physicianIdList);

        private static IWebElement _testSelectionTable =>
            Driver.Instance.FindElement(By.Id("myTable"));

        private static IList<IWebElement> _testRows = _testSelectionTable.FindElements(By.TagName("tr"));
        private static IList<IWebElement> _column;

        private static IWebElement _billTo => Driver.Instance.FindElement(By.Id("billTo"));
        private static SelectElement _selectableBillTo = new SelectElement(_billTo);

        private static IWebElement _qcRequisitionLink => Driver.Instance.FindElement(By.LinkText("QC Requisition"));

        private static IWebElement _patientSampleSpecimenId { get; set; }
        private static IWebElement _patientSampleSpecimenType { get; set; }

        private static IWebElement _patientSampleCollectDate { get; set; }
        private static IWebElement _patientSampleCollectTime { get; set; }
        private static IWebElement _patientSampleCollectAmPm { get; set; }

        private static IWebElement _submitButton => Driver.Instance.FindElement(By.Id("stepFormSubmitButton"));

        public static void SelectTestPanel(string testPanelName)
        {
            foreach (IWebElement row in _testRows)
            {

                _column = row.FindElements(By.TagName("td"));
                if (_column.Count != 0)
                {
                    if (_column[1].Text.Equals(testPanelName))
                    {
                        _column[0].FindElement(By.ClassName("checkbox")).Click();
                        break;
                    }
                }
            }
            
        }

        private static void SetSampleGridRow(int gridRow)
        {
            _patientSampleSpecimenId = Driver.Instance.FindElement(By.Name($"receiveSamples_{gridRow}_1"));
            _patientSampleSpecimenType = Driver.Instance.FindElement(By.Name($"receiveSamples_{gridRow}_3"));
            _patientSampleCollectDate = Driver.Instance.FindElement(By.Name($"receiveSamples_{gridRow}_4"));
            _patientSampleCollectTime = Driver.Instance.FindElement(By.Name($"receiveSamples_{gridRow}_5"));
            _patientSampleCollectAmPm = Driver.Instance.FindElement(By.Name($"receiveSamples_{gridRow}_6"));
        }

        

        public static void EnterPatientInformation(Patient patient)
        {
            SetSampleGridRow(0);
            _patientFirstName.SendKeys(patient.FirstName);
            _patientLastName.SendKeys(patient.LastName);
            _patientSSN.SendKeys(patient.SSN);
            _patientDOB.SendKeys(patient.DateOfBirth);
            _selectablePatientGenderList.SelectByText(patient.Gender);
            _selectablePatientEthnicityList.SelectByText(patient.Ethnicity);
            _patientAddress1.SendKeys(patient.AddressLine1);
            _patientCity.SendKeys(patient.City);
            _selectablePatientStateList.SelectByText(patient.State);
            _patientPostalCode.SendKeys(patient.PostalCode);

        }

        public static string GetRandomSpecimenId()
        {
            Random generator = new Random();
            int r = generator.Next(100000, 1000000);
            Console.WriteLine($"Specimen ID Generated: {r}");
            return r.ToString();
        }
        public static void EnterOrderingInfo(string orgName, string physician)
        {
            _selectableOrgIdList.SelectByText(orgName);
            _selectablePhysicianIdList.SelectByText(physician);
        }

        public static string EnterSpecimenInfo(int gridRow, string specimenType, string collectDate, string collectTime,
            bool isAm)
        {
            var specimenId = GetRandomSpecimenId();
            SelectElement _patientSampleCollectAmPmList = new SelectElement(_patientSampleCollectAmPm);
            SetSampleGridRow(gridRow);
            _patientSampleSpecimenId.SendKeys(specimenId);
            _patientSampleSpecimenType.SendKeys(specimenType);
            _patientSampleCollectDate.SendKeys(collectDate);
            _patientSampleCollectTime.SendKeys(collectTime + Keys.Tab);
            if (!(isAm))
            {
                _patientSampleCollectAmPmList.SelectByText("pm");
            }
            return specimenId;

        }

        public static void BillTo(string to)
        {
            _selectableBillTo.SelectByText(to);
        }


        public static void Submit()
        {
            _submitButton.Click();
        }

        public static void GotoQCRequisition()
        {
            _qcRequisitionLink.Click();
        }
    }

    
}
