# Generator that creates project pages for jekyll sites from git repositories.
#
# When you compile your jekyll site, the plugin will download the git repository of each project
# in your _projects folder and create an index page from the README (using the specified layout).
# The goal is to automate the construction of online project pages, keep them in sync with README
# documentation.
#
# Required files :
# Your project's git repository should contain:
# - README:       The contents of this will be used as the body of your project page will be created
#                 from. Any extension other than .markdown, .textile or .html will be treated as a
#                 .textile file.
#
# Available _config.yml settings :
# - project_dir: The subfolder from which to pull project definition files (default is 'projects').
# - project_output_dir: The subfolder to which project posts are compiled (default is 'projects').
#
# Available YAML settings :
# - repository: Git repository of your project (required).
# - layout: Layout to use when creating the project page.
# - title: Project title, which can be accessed in the layout.
# - published: Project won't be published if this is false.
# - ignore_sections: lower-cased, dashified sections of the README to exclude from this documentation (e.g. build-&-test )

require 'fileutils'
require 'find'
require 'git'
require 'pathname'
require 'pp'

Jekyll::Hooks.register :posts, :pre_render do |post, payload|
  unless post.data['repository']
    next
  end

  puts "Fetching data for #{post.data['title']} post"
  repo_dir = sync_repo(post.data['repository'], payload.site['skip_readme_updates'])
  readme = get_readme_path(repo_dir)

  # Decide the extension - if it's not textile, markdown or HTML treat it as textile.
  ext = File.extname(readme) unless readme.nil?
  unless ['.textile', '.markdown', '.md', '.html'].include?(ext)
    ext = '.textile'
  end

  # Try to get the readme data for this path and strip first two lines (redundant title)
  readme_content = File.readlines(readme) unless readme.nil?

  # use the `ignore_section`
  ignore_sections = post.data['ignore_sections'] || []

  # by setting this to false, the first section will get skipped by default
  # READMEs tend to favor build status, doc links, and such in the first section
  # where the guides should provide an brief intro/overview of what the client is for
  select_state = false
  filtered_content = readme_content[2..-1].select do |line|
    # check h2 and lower headers... this also allows bash snippets to include comments
    if line.start_with?('##')
      # puts "Checking section: #{Utils.slugify(line)}"
      select_state = !ignore_sections.include?(Jekyll::Utils.slugify(line))
    end
    select_state
  end

  # Append any content from README to the end of any content in the post.
  post.content += "\n\n" + filtered_content.join

  # Replace github-style '``` lang' code markup to pygments-compatible.
  post.content = post.content.gsub(/```([ ]?[a-zA-Z0-9]+)?(.*?)```/m,
    '{% highlight \1 %} \2 {% endhighlight %}')

  # For cases of {{ }} in README, remove one { to prevent liquid from doin' its thang.
  post.content.gsub! '{{', '{'
  post.content.gsub! '}}', '}'
end


private

# Clones the project's repository to a temp folder.
# `project_name` is the name of the project to process.
# Returns String path to the cloned repository.
def sync_repo(repo, skip_readme_updates = false)
  # Make the base clone directory if necessary.
  clone_dir = File.join('/tmp/client-repos')
  unless File.directory?(clone_dir)
    p = Pathname.new(clone_dir)
    p.mkdir
  end

  project_name = Pathname(repo).basename('.git').to_s

  # Remove any old repo at this location.
  repo_dir = File.join(clone_dir, project_name)
  if File.directory?(repo_dir)
    if skip_readme_updates
      puts "Using cached #{repo}"
    else
      puts "Updating from #{repo}"
      g = Git.open(repo_dir)
      g.fetch
      g.reset_hard
    end
  else
    puts "Cloning #{repo}"
    Git.clone(repo, project_name, :path => clone_dir)
  end

  # Clone the repository.
  repo_dir
end

# Gets the path to the README file for the project.
#  `repo_dir` is the path to the directory containing the checkout-out repository.
# Returns String path to the readme file.
def get_readme_path(repo_dir)
  Find.find(repo_dir) do |file|
    if File.basename(file) =~ /^README(\.[a-z0-9\.]+)?$/i
      return file
    end
  end

  throw "No remote README file found in #{repo_dir}."
end