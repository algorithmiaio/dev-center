module Jekyll
  module TrailingSlash
    def trailing_slash(input)
      input.chomp('/') + '/'
    end
  end
end

Liquid::Template.register_filter(Jekyll::TrailingSlash)