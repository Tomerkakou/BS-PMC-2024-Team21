# BS-PMC-2024-Team21 - LEARNIX

This project consists of a backend built with Flask and a frontend built with React. You can run both applications separately or together using Docker Compose.

## Installation FLASK
Follow these steps to get your LEARNIX backend up and running:

 ```bash
   cd be 
   pip install -r requirements.txt
   ```

## Installation REACT
Follow these steps to get your LEARNIX frontend up and running:

 ```bash
   cd fe
   npm ci
   ```

## Development

1. **Backend**
 ```bash
   cd be
   flask run
   ```
2. **Frontend**
 ```bash
   cd fe
   npm start
   ```

## Deploying
1. **Backend**
 ```bash
   cd be
   flask run
   ```
2. **Frontend**
 ```bash
   cd fe
   npm build
   npm start
   ```

## Deploying DOCKER
1. **Backend**
 ```bash
   cd be
   flask run
   ```
2. **Frontend**
 ```bash
   docker compose build
   docker compose up -d
   ```
