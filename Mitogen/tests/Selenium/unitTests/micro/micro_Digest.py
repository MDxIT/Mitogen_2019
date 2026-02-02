# -*- coding: utf-8 -*-
from selenium import selenium
import unittest, time, re

class micro_Digest(unittest.TestCase):
    def setUp(self):
        self.verificationErrors = []
        self.selenium = selenium("localhost", 4444, "*chrome", "https://frameshift.uniconnect.com/")
        self.selenium.start()
    
    def test_micro__digest(self):
        sel = self.selenium
        sel.open("/uniflow")
        sel.click("link=Microarray - Digest")
        sel.wait_for_page_to_load("30000")
        extractionIdRow = sel.get_element_index("//table[@id='sampleTable']//tr/td/input[@value=\"" + extractionId + "\"]/../..")
        sel.click("name=sampleTable_" + extractionIdRow + "_1")
        pcrPlateId = specimenId + "-PLT1"
        sel.type("id=pcrPlateId", specimenId + "-PLT1")
        sel.click("id=fillPlate")
        sel.click("css=#plateButton > input.button")
        sel.type("name=mmReagents_0_6", "DEMOBARCODE4")
        sel.type("name=mmReagents_1_6", "R009")
        sel.click("id=stepFormSubmitButton")
        sel.wait_for_page_to_load("30000")
    
    def tearDown(self):
        self.selenium.stop()
        self.assertEqual([], self.verificationErrors)

if __name__ == "__main__":
    unittest.main()
