#!/bin/bash

initApiDocs() {
  echo "Setting up API docs..."
  cd api-docs && rvm install 2.3.0 && gem install bundle && bundle install && cd ..
}

initSynapse() {
  echo "Setting up Synapse..."
  cd synapse && npm ci && cd ..
}

git submodule init && git submodule update && initApiDocs && initSynapse
