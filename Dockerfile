FROM ruby:onbuild

ENTRYPOINT ["/usr/local/bin/bundle","exec","jekyll","serve"]
