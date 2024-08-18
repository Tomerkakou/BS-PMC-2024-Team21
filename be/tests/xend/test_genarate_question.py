from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
import time


def test_genarate_question(driver,logined_lecturer,_db,front_url):
    driver.get(f"{front_url}/new-question")
    time.sleep(2)

    assert driver.current_url == f"{front_url}/new-question"

    driver.find_element(By.ID, "generate-btn").click()

    time.sleep(6)

    step1=driver.find_element(By.ID, "next-step-btn")
    step1.click()

    time.sleep(1)

    save_question = driver.find_element(By.ID, "save-question-btn")
    save_question.click()

    time.sleep(6)

    assert len(logined_lecturer.questions) == 1






