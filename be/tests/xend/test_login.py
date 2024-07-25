from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time



def test_login(driver,admin,_db,front_url):

    driver.get(f"{front_url}/auth/login")
    time.sleep(2)
    assert driver.title == "Login | LEARNIX"
    wait = WebDriverWait(driver, 10)
    email_field = wait.until(EC.visibility_of_element_located((By.ID, "email-login")))
    password_field = driver.find_element(By.ID, "password-login")
    
    email_field.send_keys(admin.email)
    password_field.send_keys(admin.password)
    admin.hashPassword()
    admin.verifiedEmail=True
    admin.active=True
    _db.session.commit()
    login_button = driver.find_element(By.ID, "btn-login")
    login_button.click()
    
    time.sleep(2)
    assert f"{front_url}/" == driver.current_url
    assert "Dashboard | LEARNIX" == driver.title


def test_logout(driver,front_url):
    driver.get(front_url)
    time.sleep(2)
    assert f"{front_url}/" == driver.current_url 
    assert "Dashboard | LEARNIX" == driver.title
    popperBtn=driver.find_element(By.ID, "account-popover")
    popperBtn.click()
    logoutBtn=driver.find_element(By.ID, "btn-logout")
    logoutBtn.click()

    time.sleep(2)

    assert driver.current_url == f"{front_url}/auth/login"
    assert driver.title == "Login | LEARNIX"

    driver.get(front_url)
    time.sleep(2)
    assert driver.current_url == f"{front_url}/auth/login"


