FROM node:14.15.4-slim

COPY package.json yarn.lock ./

RUN yarn --frozen-lockfile

COPY config ./config
COPY server ./server

EXPOSE 3000

ENTRYPOINT [ "node", "./server/index.js" ]
