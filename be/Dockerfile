FROM python:3.11-slim

WORKDIR /be

COPY requirements.txt requirements.txt
RUN pip3 install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 5000

CMD [ "flask", "run","--host","0.0.0.0"]