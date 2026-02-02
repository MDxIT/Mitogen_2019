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
    public static class LoginPage
    {
        [FindsBy(How = How.Id, Using = "userId")]
        private static IWebElement _usernameField => Driver.Instance.FindElement(By.Id("userId"));

        [FindsBy(How = How.Name, Using = "password")]
        private static IWebElement _passwordField => Driver.Instance.FindElement(By.Name("password"));

        [FindsBy(How = How.Id, Using = "loginSubmit")]
        private static IWebElement _submitButton => Driver.Instance.FindElement(By.Id("loginSubmit"));

        public static void Login(string username, string password)
        {
            Driver.Instance.Navigate().GoToUrl(@"https://mitogen.uniconnect.com/uniflow");
            _usernameField.Clear();
            _usernameField.SendKeys(username);
            _passwordField.Clear();
            _passwordField.SendKeys(password);
            _submitButton.Click();
        }

    }
}
