# -*- coding: utf-8 -*-
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import Select
from selenium.common.exceptions import NoSuchElementException
from selenium.common.exceptions import NoAlertPresentException
import unittest, time, re

class KaryoNewReq(unittest.TestCase):
    def setUp(self):
        self.driver = webdriver.Firefox()
        self.driver.implicitly_wait(30)
        self.base_url = "https://mitogen.uniconnect.com/"
        self.verificationErrors = []
        self.accept_next_alert = True
    
    def test_karyo_new_req(self):
        driver = self.driver
        driver.get(self.base_url + "/uniflow?updateStepGroups=true&stepName=Welcome&userStepGroups=Welcome")
        driver.find_element_by_link_text("Accessioning").click()
        Select(driver.find_element_by_id("test")).select_by_visible_text("Cytogenetics")
        driver.find_element_by_id("stepFormSubmitButton").click()
        driver.find_element_by_name("firstName").clear()
        driver.find_element_by_name("firstName").send_keys("Test")
        driver.find_element_by_name("lastName").clear()
        driver.find_element_by_name("lastName").send_keys("Patient")
        driver.find_element_by_name("ssn").clear()
        driver.find_element_by_name("ssn").send_keys("999-99-7897")
        driver.find_element_by_name("dob").clear()
        driver.find_element_by_name("dob").send_keys("01/01/1991")
        Select(driver.find_element_by_name("newPatientGender")).select_by_visible_text("Female")
        Select(driver.find_element_by_id("ethnicity")).select_by_visible_text("African American")
        driver.find_element_by_name("address1").clear()
        driver.find_element_by_name("address1").send_keys("222 Address Line")
        driver.find_element_by_name("city").clear()
        driver.find_element_by_name("city").send_keys("Denver")
        Select(driver.find_element_by_name("state")).select_by_visible_text("CO")
        driver.find_element_by_name("postalCode").clear()
        driver.find_element_by_name("postalCode").send_keys("55555")
        Select(driver.find_element_by_id("orgId")).select_by_visible_text("ABC Laboratory")
        Select(driver.find_element_by_id("phyId")).select_by_visible_text("George Physician")
        # ERROR: Caught exception [ERROR: Unsupported command [getEval |  | ]]
        Select(driver.find_element_by_name("receiveSamples_0_3")).select_by_visible_text("Cultured Cells")
        driver.find_element_by_name("receiveSamples_0_4").clear()
        driver.find_element_by_name("receiveSamples_0_4").send_keys("08/16/2017")
        driver.find_element_by_name("receiveSamples_0_5").clear()
        driver.find_element_by_name("receiveSamples_0_5").send_keys("10:05")
        driver.find_element_by_name("t2_2_1").click()
        Select(driver.find_element_by_id("billTo")).select_by_visible_text("Customer")
        driver.find_element_by_id("stepFormSubmitButton").click()
    
    def is_element_present(self, how, what):
        try: self.driver.find_element(by=how, value=what)
        except NoSuchElementException as e: return False
        return True
    
    def is_alert_present(self):
        try: self.driver.switch_to_alert()
        except NoAlertPresentException as e: return False
        return True
    
    def close_alert_and_get_its_text(self):
        try:
            alert = self.driver.switch_to_alert()
            alert_text = alert.text
            if self.accept_next_alert:
                alert.accept()
            else:
                alert.dismiss()
            return alert_text
        finally: self.accept_next_alert = True
    
    def tearDown(self):
        self.driver.quit()
        self.assertEqual([], self.verificationErrors)

if __name__ == "__main__":
    unittest.main()
