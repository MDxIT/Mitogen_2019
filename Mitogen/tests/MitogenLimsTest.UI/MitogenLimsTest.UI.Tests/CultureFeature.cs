using SQAutomationLibrary.Selenium;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using NUnit.Framework;

namespace MitogenLimsTest.UI
{
    public partial class CultureFeature
    {
        [SetUp]
        public void TestInit()
        {
            Driver.Initialize(Driver.Browser.Chrome);
        }

        [TearDown]
        public void TestTearDown()
        {
            Driver.CleanUp();
        }
 

    }
}
