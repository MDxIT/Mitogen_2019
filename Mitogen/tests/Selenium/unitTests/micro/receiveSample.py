# -*- coding: utf-8 -*-
from selenium import selenium
import unittest, time, re

class ReceiveSample(unittest.TestCase):
    def setUp(self):
        self.verificationErrors = []
        self.selenium = selenium("localhost", 4444, "*chrome", "https://frameshift.uniconnect.com/")
        self.selenium.start()
    
    def test_receive_sample(self):
        sel = self.selenium
        sel.open("/uniflow?stepName=Receive+Specimens")
        sel.click("link=Receive Specimens")
        sel.wait_for_page_to_load("30000")
        sel.click("name=receiveSamples_0_1")
        sel.type("name=receiveSamples_0_9", "Receipt Comments")
        sel.type("name=receiveSamples_0_10", "3")
        sel.select("name=receiveSamples_0_11", "mL")
        sel.click("id=stepFormSubmitButton")
        sel.wait_for_page_to_load("30000")
    
    def tearDown(self):
        self.selenium.stop()
        self.assertEqual([], self.verificationErrors)

if __name__ == "__main__":
    unittest.main()
