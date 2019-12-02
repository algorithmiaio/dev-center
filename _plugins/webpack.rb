require 'json'

# Add all JS output filenames processed by Webpack to the site variable.
# This allows us to dynamically render them in our templates with chunkhashes.
Jekyll::Hooks.register :site, :after_init do |site|
  path = File.expand_path('../../dist/manifest.json', __FILE__)
  file = File.read(path)
  manifest = JSON.parse(file)

  site.config['webpack_scripts'] = manifest.values.select do |asset|
    asset.end_with?('.js')
  end
end
