# -*- coding: utf-8 -*-
from selenium import selenium
import unittest, time, re

class new_microarray_req(unittest.TestCase):
    def setUp(self):
        self.verificationErrors = []
        self.selenium = selenium("localhost", 4444, "*chrome", "https://frameshift.uniconnect.com/")
        self.selenium.start()
    
    def test_new_microarray_req(self):
        sel = self.selenium
        sel.open("/uniflow?stepName=New%20Requisition")
        sel.click("link=New Requisition")
        sel.wait_for_page_to_load("30000")
        sel.select("id=test", "label=Microarray")
        sel.click("id=stepFormSubmitButton")
        sel.wait_for_page_to_load("30000")
        sel.type("name=firstName", "Test")
        sel.type("name=lastName", "Patient")
        sel.type("name=ssn", "123-45-6789")
        sel.type("name=dob", "01/01/1987")
        sel.select("name=newPatientGender", "label=Male")
        sel.select("id=ethnicity", "label=Caucasian")
        sel.click("name=faceSheet")
        sel.type("name=address1", "123 State Street")
        sel.type("name=city", "Kennesaw")
        sel.select("name=state", "label=GA")
        sel.type("name=postalCode", "32145")
        sel.select("id=orgId", "label=ABC Laboratory")
        sel.select("id=phyId", "label=Jen Johnson")
        sel.type("name=receiveSamples_0_1", sel.get_eval("\"CBM_+\" + Math.floor(Math.random()*11111) ;"))
        sel.select("name=receiveSamples_0_3", "label=Blood")
        sel.type("name=receiveSamples_0_4", "07/05/2017")
        sel.type("name=receiveSamples_0_5", "03:05")
        sel.select("name=receiveSamples_0_6", "label=pm")
        sel.click("name=t2_0_1")
        sel.select("id=billTo", "label=Customer")
        sel.click("id=stepFormSubmitButton")
        sel.wait_for_page_to_load("30000")
    
    def tearDown(self):
        self.selenium.stop()
        self.assertEqual([], self.verificationErrors)

if __name__ == "__main__":
    unittest.main()
