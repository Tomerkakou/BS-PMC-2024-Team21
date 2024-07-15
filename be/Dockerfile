FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt requirements.txt

RUN pip3 install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 6748

CMD [ "flask", "run", "--host", "0.0.0.0", "--port", "6748" ]