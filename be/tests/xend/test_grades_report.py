from selenium.webdriver.common.by import By
import time
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

def test_grades_report(driver,logined_student,_db,front_url):
    driver.get(f"{front_url}/")

    time.sleep(2)


    button = driver.find_element(By.ID, "grades-report-btn")
    button.click()

    time.sleep(1)

    button = driver.find_element(By.ID,'view-report')
    button.click()

    wait = WebDriverWait(driver, 120)  

    element = wait.until(EC.presence_of_element_located((By.XPATH, "//*[text()='Email with grades report sent successfuly!']")))

    assert element is not None

    

