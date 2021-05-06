FROM ubuntu:20.04

# Prevent below apt-get line from requiring user interaction
ARG DEBIAN_FRONTEND=noninteractive
# hadolint ignore=DL3008
RUN apt-get update && \
  apt-get install -y --no-install-recommends \
  openssl \
  ruby \
  ruby-dev \
  git \
  zlib1g-dev \
  cmake \
  build-essential \
  g++ \
  libffi-dev \
  && apt-get clean \
  && rm -rf /var/lib/apt/lists/*

RUN gem install bundler:2.2.14

WORKDIR /jekyll
VOLUME  /jekyll

EXPOSE 4001

CMD ["bundle", "exec jekyll serve --config _config.yml,_config-dev.yml --port 4001 --host 0.0.0.0 --incremental --verbose"]
