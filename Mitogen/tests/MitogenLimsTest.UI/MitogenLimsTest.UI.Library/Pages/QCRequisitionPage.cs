using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using OpenQA.Selenium;
using SQAutomationLibrary.Selenium;

namespace MitogenLimsTest.UI.Library.Pages
{
    public class QCRequisitionPage
    {
        private static IWebElement _requisitionTable => Driver.Instance.FindElement(By.Id("DataTables_Table_0"));
        private static IList<IWebElement> _testRows = _requisitionTable.FindElements(By.TagName("tr"));

        public static bool IsSampleIdInQcRequisitionTable(string sampleId)
        {
            foreach (var row in _testRows)
            {
                var columns = row.FindElements(By.TagName("td"));
                if (columns.Count != 0)
                {
                    if (columns[2].Text.Equals(sampleId))
                    {
                        return true;
                    }
                }

            }
            return false;

        }
    }
}
