using OpenQA.Selenium;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using OpenQA.Selenium.Support.UI;
using SQAutomationLibrary.Selenium;

namespace MitogenLimsTest.UI.Library.Pages
{
    public static class NewRequest
    {
        private static IWebElement _testTypeList => Driver.Instance.FindElement(By.Id("test"));

        private static SelectElement _selectableTestTypeList = new SelectElement(_testTypeList);
        private static IWebElement _submitButton => Driver.Instance.FindElement(By.Id("stepFormSubmitButton"));
        public static void SelectTestType(string testType)
        {
            var wait = new WebDriverWait(Driver.Instance, TimeSpan.FromSeconds(10));
            wait.Until(ExpectedConditions.ElementIsVisible(By.Id("test")));
            _selectableTestTypeList.SelectByText(testType);
            _submitButton.Click();
        }
    }
}
