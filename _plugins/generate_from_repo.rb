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

module Jekyll

  # The ProjectIndex class creates a single project post for the specified project.
  class ProjectIndex < Post

    # Initialize a new ProjectIndex.
    #  `base_dir`         is the String path to the <source>
    #  `output_dir`       is the relative path from the base directory to the project folder.
    #  `project_md_path`  is the String path to the project's yaml config file.
    #  `post_name`        is the name of the project to process.

    def initialize(site, output_dir, base_dir, project_md_path, post_name)
      super(site, site.source, '', File.join(base_dir, post_name))
      self.data = load_config(project_md_path)
      puts "Fetching data for #{self.data['title']} post"

      unless self.data['repository']
        return false
      end

      repo_dir = clone_repo(post_name)
      readme = get_readme_path(repo_dir)

      # Decide the extension - if it's not textile, markdown or HTML treat it as textile.
      ext = File.extname(readme) unless readme.nil?
      unless ['.textile', '.markdown', '.md', '.html'].include?(ext)
        ext = '.textile'
      end

      # Try to get the readme data for this path and strip first two lines (redundant title)
      readme_content = File.readlines(readme) unless readme.nil?

      # use the `ignore_section`
      ignore_sections = self.data['ignore_sections'] || []

      # by setting this to false, the first section will get skipped by default
      # READMEs tend to favor build status, doc links, and such in the first section
      # where the guides should provide an brief intro/overview of what the client is for
      select_state = false
      filtered_content = readme_content[2..-1].select do |line|
        # check h2 and lower headers... this also allows bash snippets to include comments
        if line.start_with?('##')
          # puts "Checking section: #{Utils.slugify(line)}"
          select_state = !ignore_sections.include?(Utils.slugify(line))
        end
        select_state
      end

      # Append any content from README to the end of any content in the post.
      self.content += "\n\n" + filtered_content.join

      # Replace github-style '``` lang' code markup to pygments-compatible.
      self.content = self.content.gsub(/```([ ]?[a-zA-Z0-9]+)?(.*?)```/m,
        '{% highlight \1 %} \2 {% endhighlight %}')

      # For cases of {{ }} in README, remove one { to prevent liquid from doin' its thang.
      self.content.gsub! '{{', '{'
      self.content.gsub! '}}', '}'
    end

    private

    # Loads the .md config file for this project.
    #  `base_dir`            is the base path to the jekyll project.
    #  `project_md_path` is the String path to the project's md config file.
    # Returns Array of project config information.
    def load_config(project_md_path)
      yaml = File.read(project_md_path)
      YAML.load(yaml)
    end

    # Clones the project's repository to a temp folder.
    # `project_name` is the name of the project to process.
    # Returns String path to the cloned repository.
    def clone_repo(project_name)
      # Make the base clone directory if necessary.
      clone_dir = File.join(Dir.tmpdir(), 'checkout')
      unless File.directory?(clone_dir)
        p = Pathname.new(clone_dir)
        p.mkdir
      end

      # Remove any old repo at this location.
      repo_dir = File.join(clone_dir, project_name)
      if File.directory?(repo_dir)
        FileUtils.remove_dir(repo_dir)
      end

      # Clone the repository.
      puts "Cloning #{self.data['repository']}"
      Git.clone(self.data['repository'], project_name, :path => clone_dir)
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
  end

  class Site


    # Loops through the list of project pages and processes each one.
    def write_project_indexes
      # Folder containing project .md files.
      project_folder = self.config['project_dir'] || 'projects'
      base_dir = self.config['project_output_dir'] || 'projects'

      projects = self.get_project_files(project_folder)
      projects.each do |project_md_path|
        post_name = project_md_path.sub(/^#{project_folder}\/([^\.]+\..*)/, '\1')

        self.write_project_index(File.join(base_dir, post_name), base_dir, project_md_path, post_name)
      end
    end

    # Writes each project page.
    #
    #  `output_dir`       is the relative path from the base directory to the output folder.
    #  `project_md_path`  is the String path to the project's yaml config file.
    #  `post_name`        is the name of the project to process.
    def write_project_index(output_dir, base_dir, project_md_path, post_name)

      index = ProjectIndex.new(self, output_dir, base_dir, project_md_path, post_name)

      index.render(self.layouts, site_payload)
      index.write(self.dest)

      # Remove Jekyll generated post
      self.posts.delete_if {|post| post.inspect == index.inspect }
      # Add our new post with README
      self.posts << index

      puts "#{index.data['title']} successfully written\n\n"
    end

    def get_project_files(project_folder)
      projects = []
      Find.find(project_folder) do |file|
        if file=~/.md$/
          projects << file
        end
      end

      projects
    end
  end

  class GenerateProjects < Generator
    safe true
    priority :high

    def generate(site)
      unless site.config['generate_projects']
        return false
      end

      site.write_project_indexes
    end
  end
end
