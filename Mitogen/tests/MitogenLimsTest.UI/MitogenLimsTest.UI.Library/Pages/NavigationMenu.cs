using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using OpenQA.Selenium;
using OpenQA.Selenium.Interactions;
using OpenQA.Selenium.Support.UI;
using SQAutomationLibrary.Selenium;

namespace MitogenLimsTest.UI.Library.Pages
{
    public static class NavigationMenu
    {

        private static IWebElement _dashboardsMenu => 
            Driver.Instance.FindElement(By.CssSelector("#sample-menu-1 > li:nth-child(1) > a:nth-child(1)"));
        private static IWebElement _diagnosticsMenu => Driver.Instance.FindElement(By.CssSelector("#sample-menu-1 > li:nth-child(2) > a:nth-child(1)"));

        private static IWebElement _dashboardsUser => 
            Driver.Instance.FindElement(By.CssSelector("#sample-menu-1 > li:nth-child(1) > ul:nth-child(2) > li:nth-child(1) > a:nth-child(1)"));
                                                        
        
        private static IWebElement _diagnosticsSamples => Driver.Instance.FindElement(By.CssSelector("#sample-menu-1 > li:nth-child(2) > ul:nth-child(2) > li:nth-child(1) > a:nth-child(1)"));

        private static IWebElement _diagnosticsSamplesAccessioning => Driver.Instance.FindElement(
            By.CssSelector("#sample-menu-1 > li:nth-child(2) > ul:nth-child(2) > li:nth-child(1) > ul:nth-child(2) > li:nth-child(1) > a:nth-child(1)"));


        public static void GoToUserDashboard()
        {
            Actions action = new Actions(Driver.Instance);
            action.MoveToElement(_dashboardsMenu).MoveToElement(_dashboardsUser).Click().Build().Perform();
        }

        public static void GoToAccessioning()
        {
            Actions action = new Actions(Driver.Instance);
            action.MoveToElement(_diagnosticsMenu).MoveToElement(_diagnosticsSamples).MoveToElement(_diagnosticsSamplesAccessioning).Build().Perform();         
            _diagnosticsSamplesAccessioning.Click();
        }


    }
}


