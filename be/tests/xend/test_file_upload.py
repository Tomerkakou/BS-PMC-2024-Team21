from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time
import os

from be.models.PdfDocument import PdfDocument


def test_file_upalod(driver,logined_lecturer,_db,front_url):
    driver.get(f"{front_url}/documents")
    time.sleep(2)

    assert driver.current_url == f"{front_url}/documents"

    driver.find_element(By.ID, "new-document-btn").click()

    time.sleep(1)

    name=driver.find_element(By.ID, "new-doc-name")
    name.send_keys("Test_Document.pdf")
    subject=driver.find_element(By.ID, "new-doc-subject")
    subject.send_keys("C#")
    subject.send_keys(Keys.ARROW_DOWN,Keys.ENTER)
    file=driver.find_element(By.CSS_SELECTOR, 'input[type="file"]')
    current_dir = os.path.dirname(os.path.abspath(__file__))
    test_file = os.path.join(current_dir, 'test-file.pdf')
    file.send_keys(test_file)

    time.sleep(1)

    driver.find_element(By.ID, "new-doc-submit").click()
    wait = WebDriverWait(driver, 120)  

    element = wait.until(EC.presence_of_element_located((By.XPATH, "//*[text()='Document summarized successfully']")))


    pdf=PdfDocument.query.filter_by(docName="Test_Document.pdf").first()
    assert pdf is not None
    assert pdf.subject.value=="C#"
    assert pdf.lecturer_id==logined_lecturer.id
    assert pdf.pages==2
    assert len(pdf.pagesSummarize)==2

    for summary in pdf.pagesSummarize:
        assert summary.summary is not None and summary.summary!=""
        assert summary.page in [1,2]





