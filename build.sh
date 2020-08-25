#!/bin/bash

rm -rf sites && mkdir sites && \
  bundle exec jekyll build -d sites/public/developers -c _config.yml && \
  bundle exec jekyll build -d sites/enterprise/developers -c _config.yml,_config-enterprise.yml
