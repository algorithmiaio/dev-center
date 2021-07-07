---
categories: clients
excerpt: "Add machine learning to your Python app with Algorithmia"
ignore_sections: [install-from-source, upgrading-from-0-9-x, running-tests]
image:
    teaser: /language_logos/python.svg
layout: article
redirect_from:
  - /algorithm-development/client-guides/python/
  - /algorithm-development/guides/python/
  - /algorithm-development/guides/python-guide/
  - /application-development/client-guides/python/
  - /application-development/guides/python/
repository: https://github.com/algorithmiaio/algorithmia-python
show_related: true
tags: [clients]
title: "Python"
---

{% include video-responsive.html height="560" width="315" url="https://www.youtube.com/embed/bZB2vu0v6A0" %}

The Algorithmia Python client provides a native Python interface to the Algorithmia API, letting developers manage and call algorithms, work with data in object stores using Algorithmia Data Sources, and access other features of the Algorithmia platform.

This guide will cover setting up the client, calling an algorithm using direct user input, calling an algorithm that accesses data through Algorithmia Data Sources, and using Algorithmia's Hosted Data service. For complete details about the Algorithmia API, please refer to the [API Docs](/developers/api/?python).

The code in this guide can be run directly in a Python interpreter or used in your own scripts.

## Set up the client

The official client is available on [PyPI](https://pypi.python.org/pypi/algorithmia/) and can be installed with pip:

{% highlight bash %}
$ pip3 install algorithmia
{% endhighlight %}

If you need to install the client from source, please see the additional installation instructions in the client [README](https://github.com/algorithmiaio/algorithmia-python#install-from-source).

To use the client you'll need an API key, which Algorithmia uses for fine-grained authentication across the platform. For this example, we'll use the `default-key` that was created along with your account, which has a broad set of permissions. Log in to Algorithmia and navigate to Home > [API Keys](/user#credentials) to find your key, or read the [API keys documentation](/developers/platform/customizing-api-keys) for more information.

Once the client is installed, you can import it into your code and instantiate the client object:

{% highlight python %}
import Algorithmia

# Authenticate with your API key
apiKey = "YOUR_API_KEY"
# Create the Algorithmia client object
client = Algorithmia.client(apiKey)
{% endhighlight %}

#### Specifying an on-premises or private cloud endpoint

This feature is available to [Algorithmia Enterprise](/enterprise) users only.
{: .notice-enterprise}

If you are running [Algorithmia Enterprise](/enterprise), you can specify the API endpoint when you create the client object:

{% highlight python %}
client = Algorithmia.client("YOUR_API_KEY", "https://mylocalendpoint")
{% endhighlight %}

Alternately, you can ensure that each of your servers interacting with your Algorithmia Enterprise instance have an environment variable named `ALGORITHMIA_API` and the client will use it.  The fallback API endpoint is always the hosted Algorithmia marketplace service at [https://api.algorithmia.com/](https://api.algorithmia.com/)

## Calling an algorithm

Algorithms take three basic types of input whether they are invoked directly through the API or by using a client library: strings, JSON, and binary data. In addition, individual algorithms might have their own I/O requirements, such as using different data types for input and output, or accepting multiple types of input, so consult the input and output sections of an algorithm's documentation for specifics.

The first algorithm we'll call is a demo version of the algorithm used in the Algorithm Development [Getting Started](/developers/algorithm-development/your-first-algo) guide, which is available at [demo/Hello](/algorithms/demo/Hello). Looking at the [algorithm's documentation](/algorithms/demo/Hello/docs), it takes a string as input and returns a string.

In order to call an Algorithm from Python, we need to first create an algorithm object. With the client already instantiated, we can run the following code to create an object:

{% highlight python %}
algo = client.algo("demo/Hello")
{% endhighlight %}

Then, we can use the `.pipe()` method to call the algorithm. We'll provide our input as the argument to the function, and then print the output using the `result` attribute:

{% highlight python %}
response = algo.pipe("Mr. Bond")
print(response.result)
{% endhighlight %}

Which should print the phrase, `Hello Mr. Bond`.

### JSON and Python

The Python client provides some ease-of-use abstractions for working with algorithms with JSON inputs and outputs. When passing a Python array or dict into the `.pipe()` function, the library will automatically serialize it to JSON. Algorithms will return a JSON type and the `result` field of the response will contain an array or dict, as appropriate.

Let's look at an example using JSON and the [nlp/LDA](https://algorithmia.com/algorithms/nlp/LDA) algorithm. The [algorithm docs](https://algorithmia.com/algorithms/nlp/LDA/docs) tell us that the algorithm takes a list of documents and returns a number of topics that are relevant to those documents. The documents can be a list of strings, a Data API file path, or a URL. We'll call this algorithm using a list of strings, following the format in the algorithm documentation:

{% highlight python %}
algoJSON = client.algo('nlp/LDA/1.0.0')
input = {
    "docsList": [
        "It's apple picking season",
        "The apples are ready for picking"
    ]
}
response = algoJSON.pipe(input)
print(response.result)
{% endhighlight %}

The output will be `[{'picking': 2}, {'apple': 1}, {'apples': 1, 'ready': 1}, {'season': 1}]`, which is the list of relevant words and the number of occurrences.

You might have noticed that in this example we included a version number when instantiating the algorithm. Pinning your code to a specific version of the algorithm can be especially important in a production environment where the underlying implementation might change from version to version.

### Request options

The client exposes options that can configure algorithm requests. This includes support for changing the timeout or indicating that the API should include stdout in the response. In the following example, we set the timeout to 60 seconds and disable `stdout` in the response:

{% highlight python %}
algo.set_options(timeout=60, stdout=False)
{% endhighlight %}

You can find more details in [API Docs](/developers/api/?python) > [Invoke an Algorithm](/developers/api/?python#invoke-an-algorithm).

### Error handling

To be able to better develop across languages, Algorithmia has created a set of standardized errors that can be returned by either the platform or by the algorithm being run. In Python, API errors and Algorithm exceptions will result in calls to `.pipe()` throwing an `AlgoException`:

{% highlight python %}
client.algo('util/whoopsWrongAlgo').pipe('Hello, world!')
# Algorithmia.algo_response.AlgoException: algorithm algo://util/whoopsWrongAlgo not found
{% endhighlight %}

You can read more about [Error Handling](/developers/algorithm-development/algorithm-errors) in the [Algorithm Development](/developers/algorithm-development) section of the dev center.

### Limits

Your account can make up to {{site.data.stats.platform.max_num_algo_requests}} Algorithmia requests at the same time (this limit <a onclick="Intercom('show')">can be raised</a> if needed).

Algorithm requests have a payload size limit of 10MB for input and 15MB for output. If you need to work with larger amounts of data, you can make use of the Algorithmia [Data API](/developers/api/?python#data).

## Working with Algorithmia data sources

For some algorithms, passing input to the algorithm at request time is sufficient, while others might have larger data requirements or need to preserve state between calls. Application developers can use Algorithmia's [Hosted Data](/developers/data/hosted) to store data as text, JSON, or binary, and access it via the Algorithmia [Data API](/developers/api/?python#data).

The Data API defines [connectors](/developers/api/?python#connectors) to a variety of storage providers, including Algorithmia [Hosted Data](/developers/data/hosted), Amazon S3, Google Cloud Storage, Azure Storage Blobs, and Dropbox. After creating a connection in Data Sources, you can use the API to create, update, and delete directories and files and manage permissions across providers by making use of [Data URIs](/developers/api/#data-uris) in your code.

In this example, we'll upload an image to Algorithmia's [Hosted Data](/developers/data/hosted) storage provider, and use the [dlib/FaceDetection](https://algorithmia.com/algorithms/dlib/FaceDetection) algorithm to detect any faces in the image. The algorithm will create a new copy of the image with bounding boxes drawn around the detected faces, and then return a JSON object with details about the dimensions of the bounding boxes and a URI where you can download the resulting image.

### Create a data collection

The documentation for "Face Detection" says that it takes a URL or a Data URI of the image to be processed, and a Data URI where the algorithm can store the result. We'll create a directory to host the input image, then update its [permissions](/developers/api/#update-collection-acl) so that it's publicly accessible:

{% highlight python %}
from Algorithmia.acl import ReadAcl, AclType
# Instantiate a DataDirectory object, set your data URI and call create
img_directory = client.dir("data://YOUR_USERNAME/img_directory")
# Create your data collection if it does not exist
if not img_directory.exists():
    img_directory.create()
# Change permissions on your data collection to public
img_directory.update_permissions(ReadAcl.public)
{% endhighlight %}

Instead of your username you can also use '.my' when calling algorithms. For more information about the '.my' pseudonym check out the [Hosted Data Guide]({{site.baseurl}}/data/hosted).
{: .notice-info}

### Upload data to a data collection

Now we're ready to upload an image file for processing. For this example, we'll use [this photo of a group of friends](https://unsplash.com/photos/Q_Sei-TqSlc). Download the image and save it locally as `friends.jpg`.

Next, create a variable that holds the location where you would like to upload the image as a URI:

{% highlight python %}
img_file = "data://.my/img_directory/friends.jpg"
{% endhighlight %}

Then upload your local file to the data collection using the `.putFile()` method:

{% highlight python %}
if not client.file(img_file).exists():
    # Upload local file
    client.file(img_file).putFile("/your_local_path_to_file/friends.jpg")
{% endhighlight %}

This method call will replace a file if it already exists at the specified location. If you wish to avoid replacing a file, check if the file exists before using this method.
{: .notice-warning}

Confirm that the file was created by navigating to Algorithmia's [Hosted Data Source](/data/hosted) and finding your data collection and file.

You can also upload your data through the UI on Algorithmia's [Hosted Data Source](/data/hosted). For instructions on how to do this go to the [Hosted Data Guide]({{site.baseurl}}/data/hosted).

### Call the algorithm

Once the file has been uploaded, you are ready to call the algorithm. Create the algorithm object, then pass the required inputs—an image URI (which is stored in `img_file` in the code above) and a URI for the image output—to `algo.pipe()`:

{% highlight python %}
# Create the algorithm object
algoCV = client.algo('dlib/FaceDetection/0.2.1')

input = {
    "images": [
        {
            "url": "data://.my/img_directory/friends.jpg",
            "output": "data://.algo/temp/detected_faces.png"
        }
    ]
}

# Invoke algorithm with error handling
try:
    # Get the summary result of your file's contents
    response = algoCV.pipe(input)
except Exception as error:
    # Algorithm error if, for example, the input is not correctly formatted
    print(error)
{% endhighlight %}

Once the algorithm has completed, `response.result` will contain the dimensions of the bounding boxes for any detected faces and the URI for the resulting file, which you can then download (or provide as input to another algorithm in a pipeline).

Algorithms can create and store data in folders named with the algorithm name in the Algorithm Data collection. To access this folder from within an executing algorithm, the `.algo` shortcut can be used, as in the input example above. When accessing data from a client context, the algorithm author and name can be used along with the `.algo` shortcut to download data, in the format `data://.algo/author/algoName/folder/fileName`.
{: .notice-info}

### Download the resulting file

The URI included in the algorithm output uses the `.algo` shortcut, so we'll need to modify it slightly to download the file by adding the algorithm name and author:

{% highlight python %}
download_uri = "data://.algo/dlib/FaceDetection/temp/detected_faces.png"
{% endhighlight %}

Verify that the file that you want to download exists, and try downloading it to a new local file location:

{% highlight python %}
# Download the file
if client.file(download_uri).exists():
    local_file = client.file(download_uri).getFile()
{% endhighlight %}

This copies the file from your data collection and saves it as a file on your local machine, storing the filename in the variable `local_file`.

Alternately, if you just need the binary content of the file to be stored in a variable, you can retrieve the remote file's content without saving the actual file:

{% highlight python %}
# Download contents of file as bytes
if client.file(download_uri).exists():
    image_data = client.file(download_uri).getBytes()
{% endhighlight %}

This will get the image as binary data, saving it to the variable `image_data`, which might be useful when writing algorithms that are part of an image processing pipeline.

If the file was text (an image, etc.), you could instead use the function `.getString()` to retrieve the file's content as a string. For more methods on how to get a file from a data collection using the Data API go to the [API Specification](/developers/api/#get-a-file-or-directory).

## Publishing Algorithmia Insights

This feature is available to [Algorithmia Enterprise](/enterprise) users only.
{: .notice-enterprise}

Inference-related metrics (a feature of [Algorithmia Insights](../algorithmia-enterprise/algorithmia-insights)) can be reported via using the `report_insights` method of the Algorithmia client.

Depending on your algorithm, you might want to report on the algorithm payload for each API call (such as the features or number of features), the output of the algorithm to monitor data distributions of predictions, or probability of each inference.

In the case of an example credit scoring model, shown in this demo for <a href="https://www.youtube.com/watch?v=pdKwtp-_n2M">Algorithmia Insights</a>, reported metrics include the algorithm predictions:

{% highlight python %}
# Report Algorithmia Insights
client.report_insights({"risk_score": risk_score, "approved": approved})
{% endhighlight %}

{% highlight python %}
# Sample model output that is pushed to Insights
{
  "approved": 1,
  "risk_score": 0.08
}
{% endhighlight %}

## Additional functionality

In addition to the functionality covered in this guide, the Python Client Library provides a complete interface to the Algorithmia platform, including [managing algorithms](/developers/algorithm-development/algorithm-management), administering [organizations](/developers/platform/organizations), and working with [source control](/developers/algorithm-development/source-code-management). You can also visit the [API Docs](/developers/api) to view the complete API specification.

## Next steps

If you're a data scientist or developer who will be building and deploying new algorithms, you can move on to the [Algorithm Development > Getting Started](/developers/algorithm-development/your-first-algo/) guide.
