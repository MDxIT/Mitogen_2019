# -*- coding: utf-8 -*-
from selenium import selenium
import unittest, time, re

class micro_QuantExtraction(unittest.TestCase):
    def setUp(self):
        self.verificationErrors = []
        self.selenium = selenium("localhost", 4444, "*chrome", "https://frameshift.uniconnect.com/")
        self.selenium.start()
    
    def test_micro__quant_extraction(self):
        sel = self.selenium
        sel.open("/uniflow?stepName=Microarray+-+Quantitate+Extraction")
        sel.click("link=Microarray - Quantitate Extraction")
        sel.wait_for_page_to_load("30000")
        sel.type("name=batchId", extractionBatchId)
        sel.click("id=stepFormSubmitButton")
        sel.wait_for_page_to_load("30000")
        sel.type("name=quantitate_0_6", "50")
        sel.select_window("null")
        sel.type("name=control_0_1", "NEG CTRL")
        sel.type("name=control_0_2", "0")
        sel.type("name=control_0_4", "0")
        sel.type("name=control_1_1", "POS CTRL")
        sel.type("name=control_1_4", "50")
        sel.click("id=stepFormSubmitButton")
        sel.wait_for_page_to_load("30000")
    
    def tearDown(self):
        self.selenium.stop()
        self.assertEqual([], self.verificationErrors)

if __name__ == "__main__":
    unittest.main()
