# -*- coding: utf-8 -*-
from selenium import selenium
import unittest, time, re

class processSpecimens(unittest.TestCase):
    def setUp(self):
        self.verificationErrors = []
        self.selenium = selenium("localhost", 4444, "*chrome", "https://frameshift.uniconnect.com/")
        self.selenium.start()
    
    def test_process_specimens(self):
        sel = self.selenium
        sel.open("/uniflow?stepName=Process+Specimens")
        sel.click("link=Process Specimens")
        sel.wait_for_page_to_load("30000")
        specimenRow = sel.get_element_index("//table[@id='specimenDetails']//tr/td/input[@value=\"" + specimenId + "\"]/../..")
        print(specimenRow)
        sel.click("name=sampleDetails_" + specimenRow + "_1")
        sel.type("name=sampleDetails_" + specimenRow + "_6", "5")
        sel.click("id=stepFormSubmitButton")
        sel.wait_for_page_to_load("30000")
    
    def tearDown(self):
        self.selenium.stop()
        self.assertEqual([], self.verificationErrors)

if __name__ == "__main__":
    unittest.main()
