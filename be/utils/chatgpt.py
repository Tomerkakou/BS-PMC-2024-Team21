import time
from openai import OpenAI
from flask import current_app

assitant_ids={
    "document_summarization": "asst_5RG5BrSxt6vO2LRcKd4vTK6O",
    "question_validator":"asst_xdKR2Kk2DCZWRxU8vEVRt9aQ"
}

class Assitant:
    def __init__(self, assistant_name):
        self.assistant_name = assistant_name
        self._assistant_id = assitant_ids[assistant_name]
        self._api_key = current_app.config['OPENAI_API_KEY']
        self._client = OpenAI(api_key=self._api_key)
        self._thread=self._client.beta.threads.create()
        

    def send_question(self, input_text):
        message = self._client.beta.threads.messages.create(
            thread_id=self._thread.id,
            role="user",
            content=input_text,
        )
        run = self._client.beta.threads.runs.create(
            thread_id=self._thread.id,
            assistant_id=self._assistant_id,
        )

        while run.status == "queued" or run.status == "in_progress":
            run = self._client.beta.threads.runs.retrieve(
                thread_id=self._thread.id,
                run_id=run.id,
            )
            time.sleep(0.1)

        messages = self._client.beta.threads.messages.list(
            thread_id=self._thread.id
        )
        return messages.data[0].content[0].text.value
