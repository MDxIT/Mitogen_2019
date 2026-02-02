# -*- coding: utf-8 -*-
from selenium import selenium
import unittest, time, re

class Extraction_extractDNA(unittest.TestCase):
    def setUp(self):
        self.verificationErrors = []
        self.selenium = selenium("localhost", 4444, "*chrome", "https://frameshift.uniconnect.com/")
        self.selenium.start()
    
    def test_extraction_extract_d_n_a(self):
        sel = self.selenium
        sel.open("/uniflow?stepName=New+Requisition&updateStepGroups=true&userStepGroups=Accessioning&userStepGroups=Receiving")
        sel.click("link=Microarray")
        sel.wait_for_page_to_load("30000")
        sel.click("link=Extraction - Extract DNA")
        sel.wait_for_page_to_load("30000")
        extractSpecimenRow = sel.get_element_index("//table[@id='extraction']//tr/td/input[@value=\"" + specimenId + "\"]/../..")
        sel.click("name=extraction_" + extractSpecimenRow + "_1")
        sel.click("id=stepFormSubmitButton")
        sel.wait_for_page_to_load("30000")
    
    def tearDown(self):
        self.selenium.stop()
        self.assertEqual([], self.verificationErrors)

if __name__ == "__main__":
    unittest.main()
