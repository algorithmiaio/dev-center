#
# Stage 1: build dev center
#
FROM ubuntu:20.04 as dev-center-builder

# Prevent below apt-get line from requiring user interaction
ARG DEBIAN_FRONTEND=noninteractive
RUN apt-get update && \
  apt-get upgrade -y && \
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
FROM node:17.3-buster-slim

WORKDIR /opt/src/app

COPY --from=dev-center-builder /opt/builds/sites ./sites

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
