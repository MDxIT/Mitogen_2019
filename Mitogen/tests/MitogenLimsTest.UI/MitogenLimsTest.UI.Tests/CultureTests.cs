using NUnit.Framework;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Win32;
using MitogenLimsTest.UI.Library.Pages;
using SQAutomationLibrary.Selenium;

namespace MitogenLimsTest.UI
{
    [TestFixture]
    public class CultureTests
    {
        public Patient TestPatient = new Patient()
        {
            FirstName = "Test",
            LastName = "Patient",
            SSN = "999-99-7897",
            DateOfBirth = "01/01/1991",
            Gender = "Female",
            Ethnicity = "African American",
            AddressLine1 = "222 Address Line",
            City = "Denver",
            State = "CO",
            PostalCode = "55555"
        };
        [SetUp]
        public void TestInit()
        {
            Driver.Initialize(Driver.Browser.Chrome);
        }
        [Test]
        public void Culture_NewReq()
        {
            
            string user = "willb";
            LoginPage.Login(user,"$unquestDEV");
            
            Assert.IsTrue(WelcomePage.WelcomeTextEquals($"Welcome {user}"));
            NavigationMenu.GoToAccessioning();
            NewRequest.SelectTestType("Cytogenetics");
            AccessioningPage.EnterPatientInformation(TestPatient);
            AccessioningPage.EnterOrderingInfo("ABC Laboratory","Jen Johnson");
            AccessioningPage.EnterSpecimenInfo(0,"Bone Marrow", "08/16/2017","10:05",true);
            AccessioningPage.SelectTestPanel("BCR/ABL Panel");
            AccessioningPage.BillTo("Customer");
            AccessioningPage.Submit();
            Thread.Sleep(3000);

        }

        [TearDown]
        public void TestEnd()
        {
            Driver.CleanUp();
        }

    }
}
