FROM node:16.17.1-alpine3.16 as build

ARG API_BASE_URL=http://localhost:5000/api
ARG PUBLIC_URL=http://localhost:3000


WORKDIR /fe
COPY . /fe

ENV REACT_APP_API_BASE_URL=$EXCEL_TO_JSON_URL
ENV REACT_APP_PUBLIC_URL=$API_URL

RUN npm ci

RUN npm run build 

EXPOSE 3000

CMD ["npm", "start","--prefix","./fe"]