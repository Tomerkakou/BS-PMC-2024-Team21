FROM python:3.11-slim

WORKDIR /be

#ENV CHROME_VERSION=126.0.6478.182-1
RUN apt-get update && apt-get install curl gnupg -y \
  && curl --location --silent https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
  && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
  && apt-get update \
  && apt-get install google-chrome-stable -y --no-install-recommends \
  && rm -rf /var/lib/apt/lists/*

COPY requirements.txt requirements.txt

RUN pip3 install --no-cache-dir -r requirements.txt



COPY . .

EXPOSE 6748


CMD [ "flask", "run", "--host", "0.0.0.0", "--port", "6748" ]