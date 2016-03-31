require "octopress-escape-code/version"
require 'octopress-hooks'

module Octopress
  module EscapeCode

    class EscapePage < Octopress::Hooks::Page
      priority :lowest

      def pre_render(page)
        if Octopress::EscapeCode.escape_enabled?(page)
          page.content = Octopress::EscapeCode.escape(page)
        end
      end

      def post_render(page)
        Octopress::EscapeCode.unescape_brackets(page.output)
      end
    end

    class EscapePost < Octopress::Hooks::Post
      priority :lowest

      def pre_render(page)
        if Octopress::EscapeCode.escape_enabled?(page)
          page.content = Octopress::EscapeCode.escape(page)
        end
      end

      def post_render(page)
        Octopress::EscapeCode.unescape_brackets(page.output)
      end
    end

    def self.escape_enabled?(page)
      get_config(page, 'escape_code', false)
    end

    def self.get_config(page, config, default)
      site_config = page.site.config[config]
      site_config = default if site_config.nil?

      page_config = page.data[config]
      page_config = site_config if page_config.nil?

      page_config
    end

    def self.escape_brackets(content)
      content.gsub(/{/,'&#x7b;').gsub(/}/, '&#x7d;')
    end

    def self.unescape_brackets(content)
      content.gsub!(/&(amp;)?#x7b;/, '{')
      content.gsub!(/&(amp;)?#x7d;/, '}')
      content
    end

    def self.escape(page)
      ext = page.ext.downcase
      content = page.content.encode!("UTF-8")
      md_ext = %w{.markdown .mdown .mkdn .md .mkd .mdwn .mdtxt .mdtext}

      # Escape markdown style code blocks
      if md_ext.include?(ext)

        # Escape four tab or space indented code blocks
        content = content.gsub /^((\t| {4})[^\n].+?)\n($|\S)/m do
          "#{escape_brackets $1}\n#{$3}"
        end

        # Escape in-line code backticks
        content = content.gsub /(`[^`\n]+?`)/ do
          "#{escape_brackets $1}"
        end

        # Escape in-line code double backticks
        content = content.gsub /(``[^\n]+?``)/ do
          escape_brackets $1
        end

      end

      # Escape highlight and codeblock tag contents
      content = content.gsub /^({%\s*(codeblock|highlight).+?%})(.+?){%\s*end(codeblock|highlight)\s*%}/m do
        "#{$1}{% raw %}#{unescape_brackets $3}{% endraw %}{% end#{$4} %}"
      end

      # Escape codefenced codeblocks
      content = content.gsub /^(`{3}.+?`{3})/m do
        
        # Replace any raw/endraw tags inside of codefence block
        # as some of the regex above may have escaped contents
        # of the codefence block
        #
        code = unescape_brackets($1).gsub(/{% (end)?raw %}/, '')

        # Wrap codefence content in raw tags
        "{% raw %}\n#{code}\n{% endraw %}"
      end

      content
    end
  end
end

# Add documentation for this plugin
if defined? Octopress::Docs
  Octopress::Docs.add({
    name:        "Octopress Escape Code",
    gem:         "octopress-escape-code",
    version:     Octopress::EscapeCode::VERSION,
    description: "Automatically escape code with {% raw %} blocks, preventing internal Liquid processing.",
    source_url:  "https://github.com/octopress/escape-code",
    path:         File.expand_path(File.join(File.dirname(__FILE__), "../"))
  })
end
