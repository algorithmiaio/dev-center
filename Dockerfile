
#
# Stage 1: build Synapse dist/ files
#
FROM node:10.14 as style-builder

WORKDIR /app
COPY ./synapse .

# Install dependencies
RUN npm ci

# Build files
RUN npm run build

#
# Stage 2: build API docs
#
FROM ruby:2.3 AS docs-builder

RUN apt-get update && apt-get install -y nodejs \
  && apt-get clean && rm -rf /var/lib/apt/lists/*

WORKDIR /opt/builds
COPY ./api-docs .

RUN gem install bundler && gem update --system

# Install dependencies
RUN bundle install

# Build docs
RUN rake build

#
# Stage 3: build dev center
#
FROM ubuntu:19.10 as dev-center-builder

RUN apt-get update && \
  apt-get install -y \
  openssl ruby ruby-dev git zlib1g-dev cmake build-essential g++ imagemagick

RUN gem install bundler:1.16.2 && gem update --system

WORKDIR /opt/builds

COPY . .

RUN bundle install

COPY --from=style-builder /app/dist ./synapse/dist

RUN ./build.sh

#
# Final stage: use the build artifacts from previous stages
#
FROM node:10.14-slim

WORKDIR /opt/src/app

COPY --from=dev-center-builder /opt/builds/sites ./sites
COPY --from=docs-builder /opt/builds/build ./docs

COPY server/index.js ./server/index.js
COPY server/prometheus.js ./server/prometheus.js
COPY config ./config
COPY package.json package-lock.json ./

RUN npm install --production

EXPOSE 3000
ENTRYPOINT [ "node", "server/index.js" ]
