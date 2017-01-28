---
layout: article
title: "R"
excerpt: "Get going with the R client on Algorithmia."
categories: client-guides
tags: [clients]
show_related: true
author: steph_kim
image:
    teaser: /language_logos/r.svg
repository: https://github.com/algorithmiaio/algorithmia-r.git
---


This guide provides a walk-through of how to use the official Algorithmia R Client to call algorithms and manage data through the Algorithmia platform.

Here you will learn how to install the Algorithmia R Client, work with the Data API by uploading and downloading files, create and update directories and permission types and last, you’ll learn how to call an algorithm that summarizes text files.

To follow along you can create a new R script or if you’d rather, you can follow the examples in the R interpreter.

## Getting Started with Algorithmia

The official Algorithmia R client is available on CRAN and includes links to vignettes and the reference manual at: <a href="https://cran.r-project.org/web/packages/algorithmia/index.html">Algorithmia on CRAN</a>

Open up the R shell to install the Algorithmia R Client (or use RStudio to install):

{% highlight r %}
install.packages("algorithmia")
{% endhighlight %}

## Authentication

Next, login to [Algorithmia](https://algorithmia.com/) to get your [API key](https://algorithmia.com/user#credentials):

Now import the Algorithmia library and create the Algorithmia client:

{% highlight r %}
library(algorithmia)

# Authenticate with your API key
apiKey <- "YOUR_API_KEY"
# Create the Algorithmia Client object
client <- getAlgorithmiaClient(apiKey)
{% endhighlight %}

Now you’re ready to start working with Algorithmia in R.

## Working with Data Using the Data API

For application developers, [Algorithmia's Data Portal](/application-development/data-sources/) offers three different ways to store your data, all available via the [Data API](http://docs.algorithmia.com/).

This guide will show you how to work with the [Hosted Data](https://algorithmia.com/data/hosted) option on the Algorithmia platform which is available to both algorithm and application developers.

### Prerequisites
If you wish to follow along working through the example yourself, create a text file that contains any unstructured text such as a chapter from a public domain book or article. We used a chapter from [Burning Daylight, by Jack London](https://en.wikisource.org/wiki/Burning_Daylight) which you can copy and paste into a text file. Or copy and paste it from here: <a href="{{ site.baseurl }}/data_assets/burning_daylight.txt">Chapter One Burning Daylight, by Jack London</a>. This will be used throughout the guide.

### Create a Data Collection

This section will show how to create a data collection which is essentially a folder of data files hosted on Algorithmia for free.

First create a data collection called nlp_directory:

{% highlight r %}
# Set your Data URI
nlp_directory <- client$dir("data://YOUR_USERNAME/nlp_directory")
# Create your data collection
nlp_directory$create()
{% endhighlight %}

A Data URI uniquely identifies files and directories and contains a protocol "data://" and path "YOUR_USERNAME/data_collection". For more information on the Data URI see the [Data API Specification](http://docs.algorithmia.com/#data-api-specification).

Instead of your username you can also use '.my' when calling algorithms. For more information about the '.my' pseudonym check out the [Hosted Data Guide](/application-development/data-sources/hosted-data-guide/).
{: .notice-info}

### Work with Directory Permissions

When we created the data collection in the previous code snippet, the default setting is "ReadAcl.MY_ALGORITHMS" which is a permission type that allows other users on the platform to interact with your data through the algorithms you create if you decide to contribute to algorithm development. This means users can call your algorithm to perform an operation on your data stored in this collection, otherwise the algorithm you created would only work for you.

Next check for the data collection's permission type and update those permissions to private:

{% highlight r %}
# Create the acl object and check if it's the ReadAcl.MY_ALGORITHMS default setting
acl = nlp_directory$getPermissions()  # Acl object
acl$read_acl # Returns "MY_ALGORITHMS" Acl Type

# Update permissions to private
nlp_directory$update_permissions(ReadAcl.private)
nlp_directory$get_permissions()$read_acl # Returns "PRIVATE" Acl Type
{% endhighlight %}

Notice that we changed our data collection to private, which means that only you will be able to read and write to your data collection. Read access allows any algorithm you call to have access to your data collection so most often, this is the setting you want when you are calling an algorithm and are an application developer.

For more information on collection-based Access Control Lists (ACLs) and other data collection permissions go to the [Hosted Data Guide](/application-development/data-sources/hosted-data-guide).

### Upload Data to your Data Collection

So far you've created your data collection and checked and updated directory permissions. Now you're ready to upload the text file that you created at the beginning of the guide to your data collection using the Data API.

First create a variable that holds the path to your data collection and the text file you will be uploading:

{% highlight r %}
text_file <- "data://YOUR_USERNAME/nlp_directory/jack_london.txt"
{% endhighlight %}

Next upload your local file to the data collection using the `.putFile()` method:

{% highlight r %}
# Upload local file
client$file(text_file)$putFile("/your_local_path_to_file/jack_london.txt")
{% endhighlight %}

This endpoint will replace a file if it already exists. If you wish to avoid replacing a file, check if the file exists before using this endpoint.
{: .notice-warning}

You can confirm that the file was created by navigating to Algorithmia's [Hosted Data Source](https://algorithmia.com/data/hosted) and finding your data collection and file.

You can also upload your data through the UI on Algorithmia's [Hosted Data Source](https://algorithmia.com/data/hosted). For instructions on how to do this go to the [Hosted Data Guide](/application-development/data-sources/hosted-data-guide/).

### Downloading Data from a Data Collection

Next check if the file that you just uploaded to data collections exists and then download the contents of that file as a string:

{% highlight r %}
# Download contents of file as a string
if (client$file(text_file)$exists()) {
  input <- client$file(text_file)$getString()
}
{% endhighlight %}

This will get your file as a string, saving it to the variable `input`.

Now you've seen how to upload a local data file, check if a file exists in a data collection, and download the file contents as a string.

For more methods on how to get a file using the Data API from a data collection go to the [API Specification](http://docs.algorithmia.com/#getting-a-file).

## Call an Algorithm

Finally we are ready to call an algorithm. In this guide we'll use the natural language processing algorithm called [Summarizer](https://algorithmia.com/algorithms/nlp/Summarizer). This algorithm results in a string that is the summary of the text content you pass in as the algorithm's input.

A single algorithm may have different input and output types, or accept multiple types of input, so consult the algorithm’s description for usage examples specific to that algorithm.
{: .notice-info}

This example shows the summary of the text file which we downloaded from our data collection and set as the variable called `input` in the previous code sample.

Create the algorithm object and pass in the variable `input` into `algo$pipe()`:

{% highlight r %}
# Create the algorithm object using the Summarizer algorithm
algo <- client$algo('nlp/Summarizer/0.1.3')
# Pass in input required by algorithm

tryCatch({
    # Get the summary result of your file's contents.
	response <- algo$pipe(input)$result
	print(response)
},
error = function(e) {
    stop(e)
})
{% endhighlight %}

This guide used the the first chapter of [Jack London's Burning Daylight](https://en.wikisource.org/wiki/Burning_Daylight) and the Summarizer algorithm outputs:

"It was a quiet night in the Shovel. The miners were in from Moseyed Creek and the other diggings to the west, the summer washing had been good, and the men's pouches were heavy with dust and nuggets. MacDonald grinned and nodded, and opened his mouth to speak, when the front door swung wide and a man appeared in the light."

If you are interested in learning more about working with unstructured text data check out our guide [Introduction to Natural Language Processing](http://blog.algorithmia.com/introduction-natural-language-processing-nlp/).

## Conclusion

This guide covered installing Algorithmia via R, uploading and downloading data to and from a user created data collection, checking if a file exists using the Data API, calling an algorithm, and handling errors.

For more information on the methods available using the Data API in R check out the [Data API](http://docs.algorithmia.com/?r#data-api-specification) documentation or the [R Client Docs](https://github.com/algorithmiaio/algorithmia-r.git).

For convenience, here is the whole script available to run:

{% highlight r %}
library(algorithmia)

# Authenticate with your API key
apiKey <- "YOUR_API_KEY"
# Create the Algorithmia Client object
client <- getAlgorithmiaClient(apiKey)

# Instantiate a DataDirectory object, set your data URI and call Create
nlp_directory <- client$dir("data://YOUR_USERNAME/nlp_directory")
# Create your data collection
nlp_directory$create()

# Create the acl object and check if it's the ReadAcl.MY_ALGORITHMS default setting
acl = nlp_directory$getPermissions()  # Acl object
acl$read_acl # Returns "MY_ALGORITHMS" Acl Type

# Update permissions to private
nlp_directory$update_permissions(ReadAcl.private)
nlp_directory$get_permissions()$read_acl # Returns "PRIVATE" Acl Type

text_file <- "data://YOUR_USERNAME/nlp_directory/jack_london.txt"

# Upload local file
client$file(text_file)$putFile("/your_local_path_to_file/jack_london.txt")

# Download contents of file as a string
if (client$file(text_file)$exists()) {
  input <- client$file(text_file)$getString()
}

# Create the algorithm object using the Summarizer algorithm
algo <- client$algo('nlp/Summarizer/0.1.3')
# Pass in input required by algorithm

tryCatch({
    # Get the summary result of your file's contents.
	response <- algo$pipe(input)$result
	print(response)
},
error = function(e) {
  	# Algorithm error if the input is not correctly formatted.
    stop()
})
{% endhighlight %}
