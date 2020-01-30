# Replaces multiple newlines and whitespace
# between them with one newline 
# This fixes the insertion of multiple newlines
# and whitespace by jekyll in for loops, for example

module Jekyll
  class StripTag < Liquid::Block

    def render(context)
      super.gsub /(?<=\s)\n\s*\n(?![^<>]*<\/pre>)/, "\n"
    end

  end
end

Liquid::Template.register_tag('strip', Jekyll::StripTag)