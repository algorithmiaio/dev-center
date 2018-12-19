require "rubygems"
require "tmpdir"
require "bundler/setup"
require "jekyll"
require 's3'
require 'digest/md5'
require 'mime/types'
require 'parallel'

AWS_BUCKET = "algorithmia-devcenter"
GITHUB_REPONAME = "algorithmiaio/dev-center"
PREFIX_PUBLIC = "developers-public/"
PREFIX_ENTERPRISE = "developers/"

desc "Generate blog files"
task :generate do
  Jekyll::Site.new(Jekyll.configuration({
    "source"      => ".",
    "destination" => "_site"
  })).process
  Jekyll::Site.new(Jekyll.configuration({
    "source"      => ".",
    "destination" => "_siteent",
    "enterprise"  => true
  })).process
end


desc "Generate and publish blog to S3"
task :publish => [:generate] do
  started = Time.now

  puts "== Publishing to S3 bucket: #{AWS_BUCKET}"
  service = S3::Service.new(
    :access_key_id => ENV['AWS_ACCESS_KEY_ID'],
    :secret_access_key => ENV['AWS_SECRET_ACCESS_KEY'])
  bucket = service.buckets.find(AWS_BUCKET)

  ## Needed to show progress
  STDOUT.sync = true

  pwd = Dir.pwd

  for prefix in [PREFIX_PUBLIC, PREFIX_ENTERPRISE]

    site = prefix == PREFIX_PUBLIC ? "_site" : "_siteent"

    Dir.mktmpdir do |tmp|

      puts "== site: #{site}"

      puts "== tmp: #{tmp}"

      cp_r site, tmp

      Dir.chdir tmp

      ## Find all files (recursively) in ./public and process them.
      Parallel.map(Dir.glob(site+".**/*"), in_threads: 10) do |file|

        ## Only upload files, we're not interested in directories
        if File.file?(file)

          ## Slash 'public/' from the filename for use on S3
          remote_file = file.gsub(site+"/", prefix)

          ## Try to find the remote_file, an error is thrown when no
          ## such file can be found, that's okay.
          begin
            obj = bucket.objects.find_first(remote_file)
          rescue
            obj = nil
          end

          ## If the object does not exist, or if the MD5 Hash / etag of the
          ## file has changed, upload it.
          if !obj || (obj.etag != Digest::MD5.hexdigest(File.read(file)))
            print "U"

            ## Simply create a new object, write the content and set the proper
            ## mime-type. `obj.save` will upload and store the file to S3.
            obj = bucket.objects.build(remote_file)
            obj.content = open(file)
            obj.content_type = MIME::Types.type_for(file).map(&:to_s).join(',')
            obj.save
          else
            print "."
          end
        end
      end

      # Now iterate through and delete files that exist in the bucket but not locally
      marker = nil
      while true do
        # get the next group of objects in the source bucket
        objects = bucket.objects(:prefix => prefix, :marker => marker)
        break if objects.empty?

        Parallel.map(objects, in_threads: 10) do |object|
          key = object.key

          local_file = key.gsub(prefix, site+"/")
          unless File.exist?(local_file)
            object.destroy
            print "D"
          end

        end
        # set marker so next iteration knows where to start
        marker = objects.last.key
      end

    end

  Dir.chdir pwd

  end

  elapsed = ((Time.now - started) / 60 * 100).to_i.to_f / 100
  STDOUT.sync = false # Done with progress output.
  puts
  puts "== Done publishing (#{elapsed} minutes)"

end
