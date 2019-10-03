---
layout: article
title: "Ruby"
excerpt: "Add machine learning to your Ruby app with Algorithmia"
categories: clients
tags: [clients]
ignore_sections: [development, contributing]
show_related: true
image:
    teaser: /language_logos/ruby.svg
repository: https://github.com/algorithmiaio/algorithmia-ruby
redirect_from:
  - /algorithm-development/client-guides/ruby/
  - /algorithm-development/guides/ruby/
  - /algorithm-development/guides/ruby-guide/
  - /application-development/client-guides/ruby/
  - /application-development/guides/ruby/
---

This guide provides a walk-through of how to use the official Algorithmia Ruby client to call algorithms and manage your data
through the Algorithmia platform.

Here you will learn how to install the Algorithmia Ruby Client, work with the Data API by uploading and downloading files, create and update directories and permission types and last, you'll learn how to call an algorithm that summarizes text files.

To follow along you can create a new Ruby script or if you'd rather, you can follow the examples in the Ruby interpreter.

For more information on the methods available using the Data API in Ruby check out the [Data API](http://docs.algorithmia.com/) or the [Algorithmia Ruby Client](https://github.com/algorithmiaio/algorithmia-ruby)


## Getting Started with Algorithmia

The Algorithmia Ruby Client is available on rubygems. Simply add gem `algorithmia` to your application’s Gemfile and run bundle install or install via:

{% highlight ruby %}
gem install algorithmia
{% endhighlight %}

## Authentication

Next, login to [Algorithmia](/) to get your [API key](/user#credentials):

Now import the Algorithmia library and create the Algorithmia client:

{% highlight ruby %}
require 'algorithmia'

# Authenticate with your API key
apiKey = "YOUR_API_KEY"
# Create the Algorithmia client object
client = Algorithmia.client(apiKey)
{% endhighlight %}

Now you’re ready to start working with Algorithmia in Ruby.

{% if site.enterprise %}
#### Enterprise Users Only: Specifying an On-Premises or Private Cloud Endpoint
If you are running [Algorithmia Enterprise](/enterprise), you can specify the API endpoint when you create the client object:

{% highlight ruby %}
client = Algorithmia.client(apiKey, "https://mylocalendpoint");
{% endhighlight %}
{% endif %}

## Working with Data Using the Data API

For application developers, [Algorithmia's Data Portal](/data) offers three different ways to store your data, all available via the [Data API](http://docs.algorithmia.com/#data-api-specification).

This guide will show you how to work with the [Hosted Data]({{site.baseurl}}/data/hosted) option on the Algorithmia platform which is available to both algorithm and application developers.

### Prerequisites
If you wish to follow along working through the example yourself, create a text file that contains any unstructured text such as a chapter from a public domain book or article. We used a chapter from [Burning Daylight, by Jack London](https://en.wikisource.org/wiki/Burning_Daylight) which you can copy and paste into a text file. Or copy and paste it from here: <a href="{{site.baseurl}}/data_assets/burning_daylight.txt">Chapter One Burning Daylight, by Jack London</a>. This will be used throughout the guide.

### Create a Data Collection

This section will show how to create a data collection which is essentially a folder of data files hosted on Algorithmia for free.

First create a data collection called nlp_directory:

{% highlight ruby %}
# Instantiate a DataDirectory object, set your data URI and call Create
nlp_directory = client.dir("data://YOUR_USERNAME/nlp_directory")
# Create your data collection if it does not exist
if (nlp_directory.exists? == FALSE)
    nlp_directory.create
    puts "Created directory"
else
    puts "Error: This directory already exists"
end
{% endhighlight %}

A Data URI uniquely identifies files and directories and contains a protocol "data://" and path "YOUR_USERNAME/data_collection". For more information on the Data URI see the [Data API Specification](http://docs.algorithmia.com/#data-api-specification).

Instead of your username you can also use '.my' when calling algorithms. For more information about the '.my' pseudonym check out the [Hosted Data Guide]({{site.baseurl}}/data/hosted).
{: .notice-info}

### Work with Directory Permissions

When we created the data collection in the previous code snippet, the default setting is `My Algorithms` which is a permission type that allows other users on the platform to interact with your data through the algorithms you create if you decide to contribute to algorithm development. This means users can call your algorithm to perform an operation on your data stored in this collection, otherwise the algorithm you created would only work for you.

In order to change your data collection permissions you can go to [Hosted Data](/data/hosted) and click on the collection you just created called **"nlp_directory"** and select from the dropdown at the top of the screen that will show three different types of permissions:

-   My Algorithms (called by any user)
-   Private (accessed only by me)
-   Public (available to anyone)

For more information about data collection permissions go to the [Hosted Data Guide]({{site.baseurl}}/data/hosted).


### Upload Data to your Data Collection

So far you've created your data collection and checked and updated directory permissions. Now you're ready to upload the text file that you created at the beginning of the guide to your data collection using the Data API.

First create a variable that holds the path to your data collection and the text file you will be uploading:

{% highlight ruby %}
text_file = "data://YOUR_USERNAME/nlp_directory/jack_london.txt"
{% endhighlight %}

Next upload your local file to the data collection using the `.put_file()` method:

{% highlight ruby %}
# Check if file exists
if (client.file(text_file).exists? == FALSE)
    # Upload local file
    nlp_directory.put_file("/your_local_path_to_file/jack_london.txt")
    puts "Uploaded local file"
else
    puts "Error: File already exists."
end
{% endhighlight %}

This endpoint will replace a file if it already exists. If you wish to avoid replacing a file, check if the file exists before using this endpoint.
{: .notice-warning}

You can confirm that the file was created by navigating to Algorithmia's [Hosted Data Source](/data/hosted) and finding your data collection and file.

You can also upload your data through the UI on Algorithmia's [Hosted Data Source](/data/hosted). For instructions on how to do this go to the [Hosted Data Guide]({{site.baseurl}}/data/hosted).

### Downloading Data from a Data Collection

Next check if the file that you just uploaded to data collections exists, and try downloading it to a (new) local file:

{% highlight ruby %}
# Download the file
if (client.file(text_file).exists? == TRUE)
    localfile = client.file(text_file).get_file
end
{% endhighlight %}

This copies the file from your data collection and saves it as a file on your local machine, storing the filename in the variable `localfile`.

Alternately, if you just need the text content of the file to be stored in a variable, you can retrieve the remote file's content without saving the actual file:

{% highlight ruby %}
# Download contents of file as a string
if (client.file(text_file).exists? == TRUE)
    input = client.file(text_file).get
end
{% endhighlight %}

This will get your file as a string, saving it to the variable `input`.

Now you've seen how to upload a local data file, check if a file exists in a data collection, and download the file contents.

For more methods on how to get a file using the Data API from a data collection go to the [API Specification](http://docs.algorithmia.com/#getting-a-file).

## Call an Algorithm

Finally we are ready to call an algorithm. In this guide we'll use the natural language processing algorithm called [Summarizer](https://algorithmia.com/algorithms/nlp/Summarizer). This algorithm results in a string that is the summary of the text content you pass in as the algorithm's input.

A single algorithm may have different input and output types, or accept multiple types of input, so consult the algorithm’s description for usage examples specific to that algorithm.
{: .notice-info}

This example shows the summary of the text file which we downloaded from our data collection and set as the variable called `input` in the previous code sample.

Create the algorithm object and pass in the variable `input` into `algo.pipe()`:

{% highlight ruby %}
# Create the algorithm object using the Summarizer algorithm
algo = client.algo('nlp/Summarizer/0.1.3')
# Pass in input required by algorithm
begin
    # Get the summary result of your file's contents
    puts algo.pipe(input).result
rescue Exception => e
    # Algorithm error if, for example, the input is not correctly formatted
    puts e
end
{% endhighlight %}

This guide used the the first chapter of [Jack London's Burning Daylight](https://en.wikisource.org/wiki/Burning_Daylight) and the Summarizer algorithm outputs:

"It was a quiet night in the Shovel. The miners were in from Moseyed Creek and the other diggings to the west, the summer washing had been good, and the men's pouches were heavy with dust and nuggets. MacDonald grinned and nodded, and opened his mouth to speak, when the front door swung wide and a man appeared in the light."

If you are interested in learning more about working with unstructured text data check out our guide [Introduction to Natural Language Processing](https://blog.algorithmia.com/introduction-natural-language-processing-nlp/).

### Limits

Your account can make up to {{site.data.stats.platform.max_num_algo_requests}} Algorithmia requests at the same time (this limit <a onclick="Intercom('show')">can be raised</a> if needed).

## Conclusion

This guide covered installing Algorithmia via rubygems, uploading and downloading data to and from a user created data collection, checking if a file exists using the Data API, calling an algorithm, and handling errors.

For more information on the methods available using the Data API in Ruby check out the [Data API](http://docs.algorithmia.com/?ruby#data-api-specification) documentation or the [Ruby Client Docs](https://github.com/algorithmiaio/algorithmia-ruby).


For convenience, here is the whole script available to run:

{% highlight ruby %}
require 'algorithmia'

# Authenticate with your API key
apiKey = "YOUR_API_KEY"
# Create the Algorithmia client object
client = Algorithmia.client(apiKey)

# Set your Data URI
nlp_directory = client.dir("data://YOUR_USERNAME/nlp_directory")
# Create your data collection if it does not exist
if (nlp_directory.exists? == FALSE)
    nlp_directory.create
    puts "Created directory"
else
    puts "Error: This directory already exists"
end

text_file = "data://YOUR_USERNAME/nlp_directory/jack_london.txt"
# Check if file exists
if (client.file(text_file).exists? == FALSE)
    # Upload local file
    nlp_directory.put_file("/your_local_path_to_file/jack_london.txt")
    puts "Uploaded local file"
else
    puts "Error: File already exists."
end

# Download contents of file as a string
if (client.file(text_file).exists? == TRUE)
    input = client.file(text_file).get
end

# Create the algorithm object using the Summarizer algorithm
algo = client.algo('nlp/Summarizer/0.1.3')
# Pass in input required by algorithm
begin
    # Get the summary result of your file's contents.
    response = algo.pipe(input).result
    puts response
rescue
    # Algorithm error if the input is not correctly formatted.
    puts algo.pipe(input).error.message
end
{% endhighlight %}
