# -*- coding: utf-8 -*-
from selenium import selenium
import unittest, time, re

class QC_Req(unittest.TestCase):
    def setUp(self):
        self.verificationErrors = []
        self.selenium = selenium("localhost", 4444, "*chrome", "https://frameshift.uniconnect.com/")
        self.selenium.start()
    
    def test_q_c__req(self):
        sel = self.selenium
        sel.open("/uniflow?stepName=QC+Requisition")
        sel.click("link=QC Requisition")
        sel.wait_for_page_to_load("30000")
        specimenId = sel.get_text("//table[@id='DataTables_Table_0']/tbody/tr/td[2]")
        print(specimenId)
        sel.click("//table[@id='DataTables_Table_0']/tbody/tr/td/a")
        sel.wait_for_page_to_load("30000")
        sel.select("name=Accept", "label=Accepted")
        sel.click("id=stepFormSubmitButton")
        sel.wait_for_page_to_load("30000")
    
    def tearDown(self):
        self.selenium.stop()
        self.assertEqual([], self.verificationErrors)

if __name__ == "__main__":
    unittest.main()
