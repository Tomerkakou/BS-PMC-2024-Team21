from selenium import webdriver
from selenium.webdriver.common.by import By
import time

def test_grades_report(driver,logined_student,_db,front_url):
    driver.get(f"{front_url}/")

    time.sleep(2)

    button = driver.find_element(By.ID, "nav-btn")
    if(button is not None):
        button.click()
        time.sleep(1)


    button = driver.find_element(By.ID, "grades-report-btn")
    button.click()

    time.sleep(2)  # Adjust the sleep time as needed

    handles = driver.window_handles
    driver.switch_to.window(handles[1])

    assert driver.current_url.startswith("blob") == True