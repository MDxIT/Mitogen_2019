using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using System.Drawing;
using System.Runtime.InteropServices.WindowsRuntime;
using System.Windows.Forms;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace SQAutomationLibrary
{
    public class Utils
    {
        public static TestContext TestContext { get; set; }

        public Utils(TestContext context)
        {
            TestContext = context;
        }

        public static void LogScreenShot()
        {
            var filePath = $"{TestContext.ResultsDirectory}/{TestContext.TestName}_{GetTimeStamp()}.png";
            //$"{TestContext.CurrentContext.TestDirectory}/{TestContext.CurrentContext.Test.FullName}_{GetTimeStamp()}.png";
            var screenLeft = SystemInformation.VirtualScreen.Left;
            var screenTop = SystemInformation.VirtualScreen.Top;
            var screenWidth = SystemInformation.VirtualScreen.Width;
            var screenHeight = SystemInformation.VirtualScreen.Height;

            using (var bmp = new Bitmap(screenWidth, screenHeight))
            {
                using (var g = Graphics.FromImage(bmp))
                {
                    g.CopyFromScreen(screenLeft,screenTop,0,0,bmp.Size);
                }
                Image screenImage = bmp;
                screenImage.Save(filePath,System.Drawing.Imaging.ImageFormat.Png);
                TestContext.AddResultFile(filePath);
            }
        }

        private static string GetTimeStamp()
        {
            return DateTime.Now.ToString("MM-dd-yyyy_HHmm");
        }
    }
}
