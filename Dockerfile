
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
FROM ubuntu:21.04 as dev-center-builder

RUN apt-get update && \
  apt-get install -y \
  openssl=1.1.1f-1ubuntu5 \
  ruby=1:2.7+1 \
  ruby-dev=1:2.7+1 \
  git=1:2.30.0-1ubuntu1 \
  zlib1g-dev=1:1.2.11.dfsg-2ubuntu4 \
  cmake=3.18.4-1ubuntu3 \
  build-essential=12.8ubuntu3 \
  g++=4:10.2.0-1ubuntu1 \
  imagemagick=8:6.9.10.23+dfsg-2.1ubuntu16

RUN gem install bundler:2.1.4 && gem update --system

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

EXPOSE 3000
ENTRYPOINT [ "node", "server/index.js" ]
