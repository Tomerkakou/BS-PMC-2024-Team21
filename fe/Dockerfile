FROM node:16.17.1-alpine3.16 as build

ARG API_BASE_URL=http://localhost:6748/api
ARG PUBLIC_URL=http://localhost:6749
ARG SOCKET_URL=http://localhost:6748

WORKDIR /app
COPY . .

ENV REACT_APP_API_BASE_URL=$API_BASE_URL
ENV REACT_APP_PUBLIC_URL=$PUBLIC_URL
ENV REACT_APP_SOCKET_URL=$SOCKET_URL

RUN npm ci

RUN npm run build 

EXPOSE 6749

CMD ["npm","run", "start-jenkins"]