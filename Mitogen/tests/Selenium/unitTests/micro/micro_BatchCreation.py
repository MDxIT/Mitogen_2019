# -*- coding: utf-8 -*-
from selenium import selenium
import unittest, time, re

class micro_BatchCreation(unittest.TestCase):
    def setUp(self):
        self.verificationErrors = []
        self.selenium = selenium("localhost", 4444, "*chrome", "https://frameshift.uniconnect.com/")
        self.selenium.start()
    
    def test_micro__batch_creation(self):
        sel = self.selenium
        sel.open("/uniflow?stepName=Extraction+-+Extract+DNA")
        sel.click("link=Microarray - Batch Creation")
        sel.wait_for_page_to_load("30000")
        extractionBatchId = sel.get_value("name=\"extractionBatchId\"")
        extractionId = specimenId + "-EXT1"
        batchSpecimenRow = sel.get_element_index("//table[@id='batchTable']//tr/td/input[@value=\"" + extractionId + "\"]/../..")
        sel.click("name=_" + batchSpecimenRow + "_1")
        sel.click("id=stepFormSubmitButton")
        sel.wait_for_page_to_load("30000")
    
    def tearDown(self):
        self.selenium.stop()
        self.assertEqual([], self.verificationErrors)

if __name__ == "__main__":
    unittest.main()
