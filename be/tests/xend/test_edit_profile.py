from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time


def test_profile(driver,logined_student,_db,front_url):
    driver.get(f"{front_url}/")
    time.sleep(2)
    driver.find_element(By.ID,"profile-link").click()

    time.sleep(2)

    assert driver.current_url == f"{front_url}/profile"
    assert driver.title == "Profile | LEARNIX"

    wait = WebDriverWait(driver, 10)
    edit_profile_button = wait.until(EC.visibility_of_element_located((By.ID, "edit-btn")))
    edit_profile_button.click()

    time.sleep(2)
    assert edit_profile_button is not None

    first_name_field = wait.until(EC.visibility_of_element_located((By.ID, "first-name-field")))
    last_name_field = driver.find_element(By.ID, "last-name-field")

    first_name_field.send_keys("Lior")
    last_name_field.send_keys("Gofman")

    update_btn = driver.find_element(By.ID, "update-profile-btn")
    time.sleep(2)
    update_btn.click()
    _db.session.commit()
    time.sleep(1)
    edit_profile_button = wait.until(EC.visibility_of_element_located((By.ID, "edit-btn")))
    edit_profile_button.click()
    first_name_field = wait.until(EC.visibility_of_element_located((By.ID, "first-name-field")))
    last_name_field = driver.find_element(By.ID, "last-name-field")
    test=first_name_field.get_attribute("value")
    assert test == "TestLior"




