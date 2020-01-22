require 'uri'

module Jekyll
  module TrailingSlashFilter
    def no_trailing_slash(url)
      uri = URI(url)
      uri.path = uri.path.chomp('/')
      uri.to_s
    end
  end
end

Liquid::Template.register_filter(Jekyll::TrailingSlashFilter)
