# -*- coding: utf-8 -*-
from selenium import selenium
import unittest, time, re

class micro_NormalizeExtraction(unittest.TestCase):
    def setUp(self):
        self.verificationErrors = []
        self.selenium = selenium("localhost", 4444, "*chrome", "https://frameshift.uniconnect.com/")
        self.selenium.start()
    
    def test_micro__normalize_extraction(self):
        sel = self.selenium
        sel.open("/uniflow?stepName=Microarray+-+Normalize+Extraction")
        sel.click("link=Microarray - Normalize Extraction")
        sel.wait_for_page_to_load("30000")
        sel.type("name=batchId", extractionBatchId)
        sel.click("id=stepFormSubmitButton")
        sel.wait_for_page_to_load("30000")
        sel.click("id=stepFormSubmitButton")
        sel.wait_for_page_to_load("30000")
    
    def tearDown(self):
        self.selenium.stop()
        self.assertEqual([], self.verificationErrors)

if __name__ == "__main__":
    unittest.main()
