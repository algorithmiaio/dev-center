
#
# Stage 1: build Synapse dist/ files
#
FROM node:14.15.4 as style-builder

WORKDIR /app
COPY ./synapse .

# Install dependencies
RUN npm ci

# Build files
RUN npm run build

#
# Stage 2: build API docs
#
FROM ruby:2.7.2 AS docs-builder

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
# Stage 3: build dev center
#
FROM ubuntu:20.10 as dev-center-builder

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

RUN gem install bundler:2.1.4

WORKDIR /opt/builds

COPY . .

RUN bundle install

COPY --from=style-builder /app/dist ./synapse/dist

RUN ./build.sh

#
# Final stage: use the build artifacts from previous stages
#
FROM node:14.15.4-slim

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
