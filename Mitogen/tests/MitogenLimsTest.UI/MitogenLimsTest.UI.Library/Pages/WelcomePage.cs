using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using OpenQA.Selenium;
using OpenQA.Selenium.Support.PageObjects;
using SQAutomationLibrary.Selenium;

namespace MitogenLimsTest.UI.Library.Pages
{
    public static class WelcomePage
    {

        //[FindsBy(How = How.LinkText, Using = "Accessioning")]
        private static IWebElement _accessioningLink => Driver.Instance.FindElement(By.LinkText("Accessioning"));

        //[FindsBy(How = How.XPath, Using = "//*[@id=\"mainDiv\"]/div/form/h2")]
        private static IWebElement _welcomeMessageText => Driver.Instance.FindElement(By.XPath("//*[@id=\"mainDiv\"]/div/form/h2"));

        public static bool WelcomeTextEquals(string s)
        {
            return (_welcomeMessageText.Text == s);
        }

        public static void GoToAccessioning()
        {
            _accessioningLink.Click();
        }

    }
}
