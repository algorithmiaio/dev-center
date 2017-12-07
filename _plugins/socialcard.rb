require 'metainspector'
require 'open-uri'
require 'mini_magick'

module Jekyll
  class SocialCardTag < Liquid::Tag

    def initialize(tag_name, text, options)
      super
      @card_url = text
    end

    def render(context)
      site = context.registers[:site]
      baseurl = site.baseurl

      @@properties ||= {}
      @@properties[@card_url] ||= get_properties(@card_url)
      properties = @@properties[@card_url]

      title = properties['og:title'].first
      image_url = properties['og:image'].first
      published_at = properties['article:published_time'].first
      published_at = Date.parse(published_at).strftime('%B %d, %Y')

      # We need to download the image, so we can serve it directly
      #   to avoid mixed-mode SSL warnings. Also, cache it for jekyll perf
      filename = "#{File.basename(image_url, File.extname(image_url))}.jpg"
      image_dir = "images/blog"
      image_path = "#{image_dir}/#{filename}"
      output_dir = "_tmp/#{image_dir}"
      output_path = "#{output_dir}/#{filename}"
      unless File.exist?(output_path)
        FileUtils.mkdir_p(output_dir) unless Dir.exist?(output_dir)
        download_file(image_url, output_path)
      end
      site.static_files << Jekyll::StaticFile.new(site, '_tmp', image_dir, filename)

      <<-HEREDOC
        <div class="blog-card">
          <img src="#{baseurl}/#{image_path}" class="img-fill">
          <div class="dev-card-text">
            <p class="secondary">#{published_at}</p>
            <p class="lg">
              <a href="#{@card_url}">#{title}</a>
            </p>
          </div>
        </div>
      HEREDOC
    end

    def get_properties(url)
        page = MetaInspector.new(url)
        page.meta_tags['property']
    end

    def download_file(url, path)
        stream = open(url.sub(/^\/\//, 'https://'))
        image = MiniMagick::Image.read(stream)
        image.format "jpg"
        image.resize "768x768>"
        image.write path
    end
  end
end

Liquid::Template.register_tag('socialcard', Jekyll::SocialCardTag)

