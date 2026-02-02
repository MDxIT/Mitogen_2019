using System;
using System.Collections.Generic;
using MitogenLimsTest.UI.Library.Pages;
using NUnit.Framework;
using TechTalk.SpecFlow;
using TechTalk.SpecFlow.Assist;

namespace MitogenLimsTest.UI
{
    [Binding]
    public class CultureSteps
    {
        private Patient _patient;
        private string _sampleId;

        [Given(@"I login to Mitogen as ""(.*)"" with password ""(.*)""")]
        public void GivenILoginToMitogenAsWithPassword(string p0, string p1)
        {
            LoginPage.Login(p0, p1);
        }
        [Given(@"I create a Patient with demographics:")]
        public void GivenICreateAPatientWithDemographics(Table table)
        {
            _patient = table.CreateInstance<Patient>();
        }

        [When(@"I go to ""(.*)""")]
        public void WhenIGoTo(string p0)
        {
            NavigationMenu.GoToAccessioning();
        }
        
        [When(@"I create a new ""(.*)"" request")]
        public void WhenICreateANewRequest(string p0)
        {
            NewRequest.SelectTestType(p0);
        }

        [When(@"I enter patient information")]
        public void WhenIEnterPatientInformation()
        {
            AccessioningPage.EnterPatientInformation(_patient);
        }

        [When(@"I enter ordering facility ""(.*)"" and physician ""(.*)""")]
        public void WhenIEnterOrderingFacilityAndPhysicial(string p0, string p1)
        {
           AccessioningPage.EnterOrderingInfo(p0,p1);
        }


        [When(@"I enter specimen info")]
        public void WhenIEnterSpecimenInfo()
        {
            _sampleId = AccessioningPage.EnterSpecimenInfo(0, "Bone Marrow", "08/16/2017", "10:05", true);

        }
        
        [When(@"I select test panel ""(.*)""")]
        public void WhenISelectTestPanel(string p0)
        {
            AccessioningPage.SelectTestPanel(p0);
        }
        
        [When(@"I bill to ""(.*)""")]
        public void WhenIBillTo(string p0)
        {
            AccessioningPage.BillTo(p0);
        }
        
        [When(@"I submit the new requisition")]
        public void WhenISubmitTheNewRequisition()
        {
            AccessioningPage.Submit();
        }
        
        [Then(@"the requisition is ready for QC requisition")]
        public void ThenTheRequisitionIsReadyForQCRequisition()
        {
            AccessioningPage.GotoQCRequisition();
            Assert.IsTrue(QCRequisitionPage.IsSampleIdInQcRequisitionTable(_sampleId));
                
        }
        
    }
}
