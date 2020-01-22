# Generator that creates project pages for jekyll sites from remote files.
#
# When you compile your jekyll site, the plugin will download the remote file to generate a page
# The goal is to automate the construction of online project pages, keep them in sync with external documentation.
#
# Available YAML settings :
# - generate_from: URL of the page to use for generating a new page (required).
# - ignore_sections: lower-cased, dashified sections of the README to exclude from this documentation (e.g. build-&-test )

require 'fileutils'
require 'find'
require 'git'
require 'pathname'
require 'pp'

Jekyll::Hooks.register :pages, :pre_render do |page, payload|
  unless page.data['generate_from']
    next
  end

  puts "Generating externally-sourced page: #{page.data['title']}"
  src_url = URI(page.data['generate_from'])
  cache_path = File.join('/tmp/devcenter-cache', src_url.host, src_url.path)
  download_file(src_url, cache_path)

  # Decide the extension - if it's not textile, markdown or HTML treat it as textile.
  ext = File.extname(cache_path)
  unless ['.textile', '.markdown', '.md', '.html'].include?(ext)
    ext = '.textile'
  end

  # Try to get the readme data for this path and strip first two lines (redundant title)
  readme_content = File.readlines(cache_path, :encoding => 'UTF-8')

  # use the `ignore_section`
  ignore_sections = page.data['ignore_sections'] || []

  # by setting this to false, the first section will get skipped by default
  # READMEs tend to favor build status, doc links, and such in the first section
  # where the guides should provide an brief intro/overview of what the client is for
  select_state = !ignore_sections.include?("intro")
  filtered_content = readme_content[2..-1].select do |line|
    # check h2 and lower headers... this also allows bash snippets to include comments
    if line.start_with?('##')
      # puts "Checking section: #{Utils.slugify(line)}"
      select_state = !ignore_sections.include?(Jekyll::Utils.slugify(line))
    end
    select_state
  end

  # Append any content from README to the end of any content in the page.
  page.content += "\n\n" + filtered_content.join

  # Replace github-style '``` lang' code markup to pygments-compatible.
  page.content = page.content
    .gsub(/```([ ]?[a-zA-Z0-9]+)(.*?)```/m, '{% highlight \1 %} \2 {% endhighlight %}')
    .gsub(/```(.*?)```/m, '{% highlight shell %} \1 {% endhighlight %}')

  # For cases of {{ }} in README, remove one { to prevent liquid from doin' its thang.
  page.content.gsub! '{{', '{'
  page.content.gsub! '}}', '}'
end


private

def download_file(url, path)
  p = Pathname.new(path)
  unless File.directory?(p.dirname)
    FileUtils.mkdir_p p.dirname
  end

  begin
    download = open(url)
    IO.copy_stream(download, path)
  rescue => e
    puts "Failed to download #{url}"
    raise e
  end
end
