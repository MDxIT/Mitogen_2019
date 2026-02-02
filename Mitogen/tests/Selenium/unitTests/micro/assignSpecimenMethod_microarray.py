# -*- coding: utf-8 -*-
from selenium import selenium
import unittest, time, re

class AssignSpecimenMethod_microarray(unittest.TestCase):
    def setUp(self):
        self.verificationErrors = []
        self.selenium = selenium("localhost", 4444, "*chrome", "https://frameshift.uniconnect.com/")
        self.selenium.start()
    
    def test_assign_specimen_method_microarray(self):
        sel = self.selenium
        sel.open("/uniflow?stepName=Assign+Specimen+Methods")
        sel.click("link=Assign Specimen Methods")
        sel.wait_for_page_to_load("30000")
        sampleRow = sel.get_element_index("//table[@id='selectMethods']//tr/td/input[@value=\"" + specimenId + "\"]/../..")
        print(sampleRow)
        sel.select("name=methods_" + sampleRow + "_4", "label=MICROARRAY AFFY")
        sel.click("id=stepFormSubmitButton")
        sel.wait_for_page_to_load("30000")
    
    def tearDown(self):
        self.selenium.stop()
        self.assertEqual([], self.verificationErrors)

if __name__ == "__main__":
    unittest.main()
