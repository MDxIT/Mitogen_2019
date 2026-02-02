using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using OpenQA.Selenium;
using OpenQA.Selenium.Chrome;
using OpenQA.Selenium.Edge;
using OpenQA.Selenium.Firefox;
using OpenQA.Selenium.IE;
using OpenQA.Selenium.Safari;
using OpenQA.Selenium.Support.UI;

namespace SQAutomationLibrary.Selenium
{
    public static class Driver
    {
        public static IWebDriver Instance { get; set; }

        public static void Initialize(Browser browser)
        {
            switch (browser)
            {
                case Browser.Chrome:
                    Instance = new ChromeDriver(@"C:\Automation\SeleniumDrivers\");
                    break;
                case Browser.Firefox:
                    Instance = new FirefoxDriver();
                    break;
                case Browser.Edge:
                    Instance = new EdgeDriver();
                    break;
                case Browser.IE:
                    Instance = new InternetExplorerDriver();
                    break;
                case Browser.Safari:
                    Instance = new SafariDriver();
                    break;
                default:
                    throw new NotImplementedException();
            }
            Instance.Manage().Timeouts().ImplicitWait = TimeSpan.FromSeconds(10);
            Instance.Manage().Window.Maximize();
        }

        public static void CleanUp()
        {
            Instance.Quit();
        }

        public static void WaitForPageLoad()
        {
            new WebDriverWait(Instance, TimeSpan.FromSeconds(15)).Until(
                webDriver => ((IJavaScriptExecutor)webDriver).ExecuteScript("return document.readyState").Equals("complete"));
        }

        public enum Browser
        {
            Chrome,
            Firefox,
            Edge,
            IE,
            Safari
        }
    }
}
