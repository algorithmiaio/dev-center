require "rubygems"
require "tmpdir"
require "bundler/setup"
require "jekyll"
require 's3'
require 'digest/md5'
require 'mime/types'
require 'parallel'

GITHUB_REPONAME = "algorithmiaio/dev-center"
AWS_BUCKET_PUBLIC = "algorithmia-devcenter-public"
AWS_BUCKET_ENTERPRISE = "algorithmia-devcenter-enterprise"
AWS_BUCKET_LEGACY = "algorithmia-devcenter"
PREFIX = "developers/"

desc "Generate blog files"
task :generate do
  puts "== Generating \"_site\""
  Jekyll::Site.new(Jekyll.configuration({
    "source"      => ".",
    "destination" => "_site"
  })).process
  puts "== Generating \"_siteent\""
  Jekyll::Site.new(Jekyll.configuration({
    "source"      => ".",
    "destination" => "_siteent",
    "enterprise"  => true
  })).process
end


desc "Generate and publish blog to S3"
task :publish => [:generate] do
  started = Time.now

  s3_service = S3::Service.new(
    :access_key_id => ENV['AWS_ACCESS_KEY_ID'],
    :secret_access_key => ENV['AWS_SECRET_ACCESS_KEY'])

  ## Needed to show progress
  STDOUT.sync = true

  pwd = Dir.pwd

  for bucket_name in [AWS_BUCKET_PUBLIC, AWS_BUCKET_ENTERPRISE] #, AWS_BUCKET_LEGACY]

    site = bucket_name == AWS_BUCKET_PUBLIC ? "_site" : "_siteent"
    bucket = s3_service.buckets.find(bucket_name)

    puts "== Publishing #{site} to S3 buckets: #{bucket_name}"

    Dir.mktmpdir do |tmp|

      puts "== site: #{site}"

      puts "== tmp: #{tmp}"

      cp_r site, tmp

      Dir.chdir tmp

      ## Find all files (recursively) in ./public and process them.
      Parallel.map(Dir.glob(site+"/**/*"), in_threads: 10) do |file|

        ## Only upload files, we're not interested in directories
        if File.file?(file)

          ## Slash 'public/' from the filename for use on S3
          remote_file = file.gsub(site+"/", PREFIX)

          ## Try to find the remote_file, an error is thrown when no
          ## such file can be found, that's okay.
          begin
            obj = bucket.objects.find_first(remote_file)
          rescue
            obj = nil
          end

          puts "== examining: #{remote_file}"

          ## If the object does not exist, or if the MD5 Hash / etag of the
          ## file has changed, upload it.
          if !obj || (obj.etag != Digest::MD5.hexdigest(File.read(file)))
            print "U"
            puts "== writing: #{remote_file}"

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
        objects = bucket.objects(:prefix => PREFIX, :marker => marker)
        break if objects.empty?

        Parallel.map(objects, in_threads: 10) do |object|
          key = object.key

          local_file = key.gsub(PREFIX, site+"/")
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
