FROM node:17-alpine3.14

RUN mkdir -p /usr/local/node-sagas-cqrs && chown -R node:node /usr/local/node-sagas-cqrs

WORKDIR /usr/local/node-sagas-cqrs

COPY --chown=node:node . .

COPY package.json package-lock.json ./

USER node

EXPOSE 3002