---
layout: article
title: "Python"
excerpt: "Add machine learning to your Python app with Algorithmia"
categories: clients
tags: [clients]
ignore_sections: [install-from-source, upgrading-from-0-9-x, running-tests]
show_related: true
image:
    teaser: /language_logos/python.svg
repository: https://github.com/algorithmiaio/algorithmia-python
---

This guide provides a walk-through of how to use the official Algorithmia Python Client to call algorithms and manage data through the Algorithmia platform.

Here you will learn how to install the Algorithmia Python Client, work with the Data API by uploading and downloading files, create and update directories and permission types and last, you'll learn how to call an algorithm that summarizes text files.

To follow along you can create a new Python script or if you'd rather, you can follow the examples in the Python interpreter.


## Getting Started with Algorithmia

The official Algorithmia Python Client is available on [PyPi](https://pypi.python.org/pypi/algorithmia/1.0.5) and for more information on using the Python Client you can go to the [Algorithmia API docs](http://docs.algorithmia.com/?python#).

To get started, first install the Algorithmia Python Client with pip:

{% highlight python %}
pip install algorithmia
{% endhighlight %}

## Authentication

Next, login at [Algorithmia]({{ site.baseurl }}/) to get your [API key]({{ site.baseurl }}/user#credentials):

Now import the Algorithmia library and create the Algorithmia client:

{% highlight python %}
import Algorithmia

# Authenticate with your API key
apiKey = "YOUR_API_KEY"
# Create the Algorithmia client object
client = Algorithmia.client(apiKey)
{% endhighlight %}

Now you’re ready to start working with Algorithmia in Python.

#### Enterprise Users Only: Specifying an On-Premises Endpoint
If you are running the [Algorithmia platform on-premises with Algorithmia Enterprise](https://algorithmia.com/enterprise), you can specify the API endpoint when you create the client object:

{% highlight python %}
client = Algorithmia.client("YOUR_API_KEY", "https://mylocalendpoint");
{% endhighlight %}

Alternately, you can ensure that each of your servers interacting with your Algorithmia Enterprise instance have an environment variable named `ALGORITHMIA_API` and the client will use it.  The fallback API endpoint is always the hosted Algorithmia marketplace service at [https://api.algorithmia.com/](https://api.algorithmia.com/)

## Working with Data Using the Data API

For application developers, [Algorithmia's Data Portal]({{ site.baseurl }}/data) offers three different ways to store your data, all available via the [Data API](http://docs.algorithmia.com/#data-api-specification).

This guide will show you how to work with the [Hosted Data]({{ site.baseurl }}/data/hosted/) option on the Algorithmia platform which is available to both algorithm and application developers.

### Prerequisites
If you wish to follow along working through the example yourself, create a text file that contains any unstructured text such as a chapter from a public domain book or article. We used a chapter from [Burning Daylight, by Jack London](https://en.wikisource.org/wiki/Burning_Daylight) which you can copy and paste into a text file. Or copy and paste it from here: <a href="{{ site.baseurl }}/data_assets/burning_daylight.txt">Chapter One Burning Daylight, by Jack London</a>. This will be used throughout the guide.

### Create a Data Collection

This section will show how to create a data collection which is essentially a folder of data files hosted on Algorithmia for free.

First create a data collection called nlp_directory:

{% highlight python %}
# Instantiate a DataDirectory object, set your data URI and call create
nlp_directory = client.dir("data://YOUR_USERNAME/nlp_directory")
# Create your data collection if it does not exist
if nlp_directory.exists() is False:
	nlp_directory.create()
{% endhighlight %}

A Data URI uniquely identifies files and directories and contains a protocol "data://" and path "YOUR_USERNAME/data_collection". For more information on the Data URI see the [Data API Specification](http://docs.algorithmia.com/#data-api-specification).

Instead of your username you can also use '.my' when calling algorithms. For more information about the '.my' pseudonym check out the [Hosted Data Guide]({{ site.baseurl }}/data/hosted/).
{: .notice-info}

### Work with Directory Permissions

When we created the data collection in the previous code snippet, the default setting is `ReadAcl.my_algos` which is a permission type that allows other users on the platform to interact with your data through the algorithms you create if you decide to contribute to algorithm development. This means users can call your algorithm to perform an operation on your data stored in this collection, otherwise the algorithm you created would only work for you.

To begin working with data directory permissions first add these imports:

{% highlight python %}
from Algorithmia.acl import ReadAcl, AclType
{% endhighlight %}

Next check for the data collection's permission type and update those permissions to private:

{% highlight python %}
# Create the acl object and check if it's the .my_algos default setting
acl = nlp_directory.get_permissions()  # Acl object
acl.read_acl == AclType.my_algos  # True

# Update permissions to private
nlp_directory.update_permissions(ReadAcl.private)
nlp_directory.get_permissions().read_acl == AclType.private # True
{% endhighlight %}

Notice that we changed our data collection to private, which means that only you will be able to read and write to your data collection. 

Note that read access that is set to the default `DataMyAlgorithms` allows any algorithm you call to have access to your data collection so most often, this is the setting you want when you are calling an algorithm and are an application developer.

For more information on collection-based Access Control Lists (ACLs) and other data collection permissions go to the [Hosted Data Guide]({{ site.baseurl }}/data/hosted/).

### Upload Data to your Data Collection

So far you've created your data collection and checked and updated directory permissions. Now you're ready to upload the text file that you created at the beginning of the guide to your data collection using the Data API.

First create a variable that holds the path to your data collection and the text file you will be uploading:

{% highlight python %}
text_file = "data://YOUR_USERNAME/nlp_directory/jack_london.txt"
{% endhighlight %}

Next upload your local file to the data collection using the `.putFile()` method:

{% highlight python %}
if client.file(text_file).exists() is False:
	# Upload local file
	client.file(text_file).putFile("/your_local_path_to_file/jack_london.txt")
{% endhighlight %}

This endpoint will replace a file if it already exists. If you wish to avoid replacing a file, check if the file exists before using this endpoint.
{: .notice-warning}

You can confirm that the file was created by navigating to Algorithmia's [Hosted Data Source]({{ site.baseurl }}/data/hosted) and finding your data collection and file.

You can also upload your data through the UI on Algorithmia's [Hosted Data Source]({{ site.baseurl }}/data/hosted). For instructions on how to do this go to the [Hosted Data Guide]({{ site.baseurl }}/data/hosted/).

### Downloading Data from a Data Collection

Next check if the file that you just uploaded to data collections exists, and try downloading it to a (new) local file:
 
{% highlight python %}
# Download the file
if client.file(text_file).exists() is True:
	localfile = client.file(text_file).getFile()
{% endhighlight %}

This copies the file from your data collection and saves it as a file on your local machine, storing the filename in the variable `localfile`. 

Alternately, if you just need the text content of the file to be stored in a variable, you can retrieve the remote file's content without saving the actual file:

{% highlight python %}
# Download contents of file as a string
if client.file(text_file).exists() is True:
	input = client.file(text_file).getString()
{% endhighlight %}

This will get your file as a string, saving it to the variable `input`.  If the file was binary (an image, etc), you could instead use the function `.getBytes()` to retrieve the file's content as a byte array. For more image-manipulation tutorials, see the [Computer Vision Recipes]({{ site.baseurl }}/tutorials/recipes/#computer-vision).

Now you've seen how to upload a local data file, check if a file exists in a data collection, and download the file contents.

For more methods on how to get a file using the Data API from a data collection go to the [API Specification](http://docs.algorithmia.com/#getting-a-file).

## Call an Algorithm

Finally we are ready to call an algorithm. In this guide we'll use the natural language processing algorithm called [Summarizer](https://algorithmia.com/algorithms/nlp/Summarizer). This algorithm results in a string that is the summary of the text content you pass in as the algorithm's input.

A single algorithm may have different input and output types, or accept multiple types of input, so consult the algorithm’s description for usage examples specific to that algorithm.
{: .notice-info}

This example shows the summary of the text file which we downloaded from our data collection and set as the variable called `input` in the previous code sample.

Create the algorithm object and pass in the variable `input` into `algo.pipe()`:

{% highlight python %}
# Create the algorithm object using the Summarizer algorithm
algo = client.algo('nlp/Summarizer/0.1.3')
# Pass in input required by algorithm
try:
	# Get the summary result of your file's contents
	print(algo.pipe(input).result)
except Exception as error:
  # Algorithm error if, for example, the input is not correctly formatted
  print(error)
{% endhighlight %}

This guide used the the first chapter of [Jack London's Burning Daylight](https://en.wikisource.org/wiki/Burning_Daylight) and the Summarizer algorithm outputs:

"It was a quiet night in the Shovel. The miners were in from Moseyed Creek and the other diggings to the west, the summer washing had been good, and the men's pouches were heavy with dust and nuggets. MacDonald grinned and nodded, and opened his mouth to speak, when the front door swung wide and a man appeared in the light."

If you are interested in learning more about working with unstructured text data check out our guide [Introduction to Natural Language Processing](https://blog.algorithmia.com/introduction-natural-language-processing-nlp/).

### Limits

Your account can make up to {{ site.data.stats.platform.max_num_algo_requests }} Algorithmia requests at the same time (this limit <a onclick="Intercom('show')">can be raised</a> if needed).

## Conclusion

This guide covered installing Algorithmia via pip, uploading and downloading data to and from a user created data collection, checking if a file exists using the Data API, calling an algorithm, and handling errors.

For more information on the methods available using the Data API in Python check out the [Data API](http://docs.algorithmia.com/?python#data-api-specification) documentation or the [Python Client Docs](https://github.com/algorithmiaio/algorithmia-python).

For convenience, here is the whole script available to run:

{% highlight python %}
import Algorithmia
from Algorithmia.acl import ReadAcl, AclType

apiKey = "YOUR_API_KEY"
# Create the Algorithmia client
client = Algorithmia.client(apiKey)

# Set your Data URI
nlp_directory = client.dir("data://YOUR_USERNAME/nlp_directory")
# Create your data collection if it does not exist
if nlp_directory.exists() is False:
	nlp_directory.create()

# Create the acl object and check if it's the .my_algos default setting
acl = nlp_directory.get_permissions()  # Acl object
acl.read_acl == AclType.my_algos  # True

# Update permissions to private
nlp_directory.update_permissions(ReadAcl.private)
nlp_directory.get_permissions().read_acl == AclType.private # True

text_file = "data://YOUR_USERNAME/nlp_directory/jack_london.txt"

# Upload local file
if client.file(text_file).exists() is False:
	client.file(text_file).putFile("/your_local_path_to_file/jack_london.txt")

# Download contents of file as a string
if client.file(text_file).exists() is True:
	input = client.file(text_file).getString()

# Create the algorithm object using the Summarizer algorithm
algo = client.algo("nlp/Summarizer/0.1.3")
# Pass in input required by algorithm
try:
	# Get the summary result of your file's contents
	print(algo.pipe(input).result)
except Exception as error:
  # Algorithm error if, for example, the input is not correctly formatted
  print(error)
{% endhighlight %}

