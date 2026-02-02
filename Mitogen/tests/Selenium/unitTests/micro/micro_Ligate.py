# -*- coding: utf-8 -*-
from selenium import selenium
import unittest, time, re

class micro_Ligate(unittest.TestCase):
    def setUp(self):
        self.verificationErrors = []
        self.selenium = selenium("localhost", 4444, "*chrome", "https://frameshift.uniconnect.com/")
        self.selenium.start()
    
    def test_micro__ligate(self):
        sel = self.selenium
        sel.open("/uniflow?stepName=Microarray+-+Ligate")
        sel.click("link=Microarray - Ligate")
        sel.wait_for_page_to_load("30000")
        sel.type("name=pcrPlateId", pcrPlateId)
        sel.click("id=stepFormSubmitButton")
        sel.wait_for_page_to_load("30000")
        sel.click("css=#plateButton > input.button")
        sel.type("name=mmReagents_0_6", "TESTBARCODE11")
        sel.type("name=mmReagents_1_6", "R006")
        sel.click("id=stepFormSubmitButton")
        sel.wait_for_page_to_load("30000")
    
    def tearDown(self):
        self.selenium.stop()
        self.assertEqual([], self.verificationErrors)

if __name__ == "__main__":
    unittest.main()
