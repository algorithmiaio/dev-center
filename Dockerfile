
#
# Stage 1: build API docs
#
FROM ruby:3.0.2 AS docs-builder

RUN apt-get update && apt-get install -y nodejs \
  && apt-get clean && rm -rf /var/lib/apt/lists/*

WORKDIR /opt/builds
COPY ./api-docs .

RUN gem install bundler && gem update --system

# Install dependencies
RUN bundle install

# Autoprefixer gem requires recent version of Node.
RUN apt-get update -yq \
    && apt-get install curl gnupg -yq \
    && curl -sL https://deb.nodesource.com/setup_12.x | bash \
    && apt-get install nodejs -yq

# Build docs
RUN bundle exec middleman build --clean

#
# Stage 2: build dev center
#
FROM ubuntu:20.04 as dev-center-builder

# Prevent below apt-get line from requiring user interaction
ARG DEBIAN_FRONTEND=noninteractive
RUN apt-get update && \
  apt-get install -y \
  openssl \
  ruby \
  ruby-dev \
  git \
  zlib1g-dev \
  cmake \
  build-essential \
  g++ \
  libffi-dev

RUN gem install bundler:2.2.14

WORKDIR /opt/builds

COPY . .

RUN bundle install

RUN ./build.sh

#
# Final stage: use the build artifacts from previous stages
#
FROM node:14.17-buster-slim

WORKDIR /opt/src/app

COPY --from=dev-center-builder /opt/builds/sites ./sites
COPY --from=docs-builder /opt/builds/build ./docs

COPY server/index.js ./server/index.js
COPY server/prometheus.js ./server/prometheus.js
COPY config ./config
COPY package.json yarn.lock ./

RUN yarn --frozen-lockfile --production

# Add deployment artifacts to the image.
ADD deploy /opt/algorithmia/service/deploy

# Add algo user with appropriate UID
RUN adduser --uid 1001 algo

USER algo

EXPOSE 3000
ENTRYPOINT [ "node", "server/index.js" ]
