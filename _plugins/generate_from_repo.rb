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
# - project_dir: The subfolder to compile projects to (default is 'projects').
#
# Available YAML settings :
# - repository: Git repository of your project (required).
# - layout: Layout to use when creating the project page.
# - title: Project title, which can be accessed in the layout.
# - published: Project won't be published if this is false.

require 'fileutils'
require 'find'
require 'git'

module Jekyll

  # The ProjectIndex class creates a single project post for the specified project.
  class ProjectIndex < Post

    # Initialize a new ProjectIndex.
    #  `base_dir`            is the String path to the <source>
    #  `project_dir`         is the relative path from the base directory to the project folder.
    #  `project_config_path` is the String path to the project's yaml config file.
    #  `project_name`        is the name of the project to process.
    def initialize(site, base_dir, project_dir, project_config_path, project_name)
      @site = site
      @base = base_dir 
      @dir  = project_dir 

      self.data = load_config(base_dir, project_config_path)

      puts "%%%%%%%%"   
      puts "%%%%%%%%"
      puts project_config_path
      puts "%%%%%%%%"
      puts "%%%%%%%%"

      unless self.data['published']
        return false
      end

      repo_dir = clone_repo(project_name)
      readme = get_readme_path(repo_dir)

      # Decide the extension - if it's not textile, markdown or HTML treat it as textile.
      ext = File.extname(readme)
      unless ['.textile', '.markdown', '.md', '.html'].include?(ext)
        ext = '.textile'
      end

      # Try to get the readme data for this path.
      self.content = File.read(readme)

      # Replace github-style '``` lang' code markup to pygments-compatible.
      self.content = self.content.gsub(/```([ ]?[a-z0-9]+)?(.*?)```/m, 
        '{% highlight ruby lineanchors %}\2{% endhighlight %}')
      
      link_to_repo = "<a href='#{self.data['repository']}' target='_blank'>GitHub</a>"
      self.content.prepend("Below, you'll find a guide to the #{self.data['title']}. 
        You can also find the source code directly on #{link_to_repo}.\n\n")

      puts "%%%%%%%%"   
      puts "%%%%%%%%"
      puts @dir
      puts project_config_path
      puts project_name
      puts "%%%%%%%%"
      puts "%%%%%%%%"

      super(@site, nil, @dir, project_config_path)

      puts "%%%%%%%%"
    end

    private

    # Loads the .yml config file for this project.
    #  `base_dir`            is the base path to the jekyll project.
    #  `project_config_path` is the String path to the project's yaml config file.
    # Returns Array of project config information.
    def load_config(base_dir, project_config_path)
      yaml = File.read(File.join(base_dir, project_config_path))
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

      throw "No README file found in #{repo_dir}"
    end
  end  

  class Site
    # Folder containing project .md files.
    PROJECT_FOLDER = '_posts/clients2'

    # Loops through the list of project pages and processes each one.
    def write_project_indexes
      base_dir = self.config['project_dir'] || 'projects'
      projects = self.get_project_files
      projects.each do |project_config_path|
        project_name = project_config_path.sub(/^#{PROJECT_FOLDER}\/([^\.]+)\..*/, '\1')

        puts "#" * 90
        puts project_config_path
        puts project_name
        puts "#" * 90

        self.write_project_index(File.join(base_dir, project_name), project_config_path, project_name)
      end
    end

    # Writes each project page.
    #
    #  `project_dir`         is the relative path from the base directory to the project folder.
    #  `project_config_path` is the String path to the project's yaml config file.
    #  `project_name`        is the name of the project to process.
    def write_project_index(project_dir, project_config_path, project_name)
      index = ProjectIndex.new(self, self.source, project_dir, project_config_path, project_name)

      if index.data['published']
        index.render(self.layouts, site_payload)
                puts "#" * 90
                puts index.url
                puts "#" * 90
        index.write(self.dest)
        # Record the fact that this page has been added, otherwise Site::cleanup will remove it.
        # project_index = Jekyll::Post.new(self, self.dest, project_dir, 'index.html')
        self.posts << index
        
        puts "#{self.data['repository']} README written"
      end
    end

    def get_project_files
      projects = []
      Find.find(PROJECT_FOLDER) do |file|
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
      # site.write_project_indexes
    end
  end
end