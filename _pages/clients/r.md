---
author: steph_kim
categories: clients
excerpt: "Add machine learning to your R scripts with Algorithmia"
image:
    teaser: /language_logos/r.svg
layout: article
redirect_from:
  - /algorithm-development/client-guides/r/
  - /application-development/client-guides/r/
repository: https://github.com/algorithmiaio/algorithmia-r
show_related: true
tags: [clients]
title: "R"
---

The Algorithmia R client provides a native R interface to the Algorithmia API, letting developers manage and call algorithms, work with data in object stores using Algorithmia Data Sources, and access other features of the Algorithmia platform.

This guide will cover setting up the client, calling an algorithm using direct user input, calling an algorithm that accesses data through Algorithmia Data Sources, and using Algorithmia's Hosted Data service. For complete details about the Algorithmia API, please refer to the [API Docs](/developers/api/).

The code in this guide can be run directly in an R interpreter or used in your own scripts.

## Set up the client

The official Algorithmia R client is available on CRAN and includes links to vignettes and the reference manual at: <a href="https://cran.r-project.org/web/packages/algorithmia/index.html">Algorithmia on CRAN</a>

Open up the R shell to install the Algorithmia R Client (or use RStudio to install):

{% highlight r %}
install.packages("algorithmia")
{% endhighlight %}

You can find the [source code for the client on GitHub](https://github.com/algorithmiaio/algorithmia-r).

To use the client you'll need an API key, which Algorithmia uses for fine-grained authentication across the platform. For this example, we'll use the `default-key` that was created along with your account, which has a broad set of permissions. Log in to Algorithmia and navigate to Home > [API Keys](/user#credentials) to find your key, or read the [API keys documentation](/developers/platform/customizing-api-keys) for more information.

Once the client is installed, you can import it into your code and instantiate the client object:

{% highlight r %}
library(algorithmia)

# Authenticate with your API key
apiKey <- "YOUR_API_KEY"
# Create the Algorithmia client object
client <- getAlgorithmiaClient(apiKey)
{% endhighlight %}

#### Specifying an on-premises or private cloud endpoint

This feature is available to [Algorithmia Enterprise](/enterprise) users only.
{: .notice-enterprise}

If you are running [Algorithmia Enterprise](/enterprise), you can specify the API endpoint when you create the client object:

{% highlight r %}
client <- getAlgorithmiaClient("YOUR_API_KEY", "https://mylocalendpoint");
{% endhighlight %}

Alternately, you can ensure that each of your servers interacting with your Algorithmia Enterprise instance have an environment variable named `ALGORITHMIA_API` and the client will use it.  The fallback API endpoint is always the hosted Algorithmia marketplace service at [https://api.algorithmia.com/](https://api.algorithmia.com/)

## Calling an algorithm

Algorithms take three basic types of input whether they are invoked directly through the API or by using a client library: strings, JSON, and binary data. In addition, individual algorithms might have their own I/O requirements, such as using different data types for input and output, or accepting multiple types of input, so consult the input and output sections of an algorithm's documentation for specifics.

The first algorithm we'll call is a demo version of the algorithm used in the Algorithm Development [Getting Started](/developers/algorithm-development/your-first-algo) guide, which is available at [demo/Hello](/algorithms/demo/Hello). Looking at the [algorithm's documentation](/algorithms/demo/Hello/docs), it takes a string as input and returns a string.

In order to call an Algorithm from R, we need to first create an algorithm object. With the client already instantiated, we can run the following code to create an object:

{% highlight r %}
algo <- client$algo('demo/Hello')
{% endhighlight %}

Then, we can use the `$pipe()` method to call the algorithm. We'll provide our input as the argument to the function, and then print the output using the `result` attribute:

{% highlight r %}
response <- algo$pipe("World")
print(reponse$result)
{% endhighlight %}

Which should print the phrase, "Hello World"

### JSON and R

The R client provides some ease of use abstractions for working with algorithms that have JSON inputs and outputs. When passing a R list or vector into an algorithm using the  `$pipe()` function, the library will automatically serialize it to JSON. Algorithms will return a JSON object where the `result` field of the response contains a list or vector, as appropriate.

Let's look at an example using JSON and the [nlp/LDA](https://algorithmia.com/algorithms/nlp/LDA) algorithm. The [algorithm docs](https://algorithmia.com/algorithms/nlp/LDA/docs) tell us that the algorithm takes a group of documents and returns a number of topics which are relevant to those documents. The documents can be a JSON object with the key `docsList` and a list of strings as the value, a Data API file path, or a URL. We'll provide a named list with an element `docsList` that contains a vector of strings to be processed, which will be serialized into the appropriate JSON object before being passed to the algorithm.

{% highlight r %}
algoJSON <- client$algo('nlp/LDA/1.0.0')
input = list(
    docsList = c(
        "It is apple picking season",
        "The apples are ready for picking"
    )
)
response <- algoJSON$pipe(input)
print(reponse$result)
{% endhighlight %}

The output will be a list with named elements for each relevant word, and the number of occurrances:

{% highlight r %}
[[1]]
[[1]]$ready
[1] 1


[[2]]
[[2]]$apples
[1] 1


[[3]]
[[3]]$season
[1] 1


[[4]]
[[4]]$apple
[1] 1

[[4]]$picking
[1] 2
{% endhighlight %}

You might have noticed that in this example we included a version number when instantiating the algorithm. Pinning your code to a specific version of the algorithm can be especially important in a production environment where the underlying implementation might change from version to version.

### Request options

The client exposes options that can configure algorithm requests. This includes support for changing the timeout or indicating that the API should include `stdout` in the response. In the following example, we set the timeout to 60 seconds and disabling `stdout` in the response:

{% highlight r %}
algo$setOptions(timeout=60, stdout=FALSE)
{% endhighlight %}

You can find more details in [API Docs](/developers/api/) > [Invoke an Algorithm](/developers/api/#invoke-an-algorithm).

### Error handling

To be able to better develop across languages, Algorithmia has created a set of standardized errors that can be returned by either the platform or by the algorithm being run. We can then catch these errors as follows:

{% highlight r %}
tryCatch({
    # Run your code
    client$algo('util/whoopsWrongAlgo')$pipe('Hello, world!')
  }, error = function(e) {
    stop(e))
})

Error in getResponse(client$postJsonHelper(algoUrl, input, queryParameters)) :
  Algorithm error: algorithm algo://util/whoopsWrongAlgo/ not found
{% endhighlight %}

You can read more about error handling in the [Developer Center](https://algorithmia.com/developers) under [Error Handling](/developers/algorithm-development/algorithm-errors) and in the [R Algorithm Development](https://algorithmia.com/developers/algorithm-development/languages/r#error-handling) guide.

### Limits

Your account can make up to {{site.data.stats.platform.max_num_algo_requests}} Algorithmia requests at the same time (this limit <a onclick="Intercom('show')">can be raised</a> if needed).

Algorithm requests have a payload size limit of 10MB for input and 15MB for output. If you need to work with larger amounts of data, you can make use of the Algorithmia [Data API](/developers/api/#data).

## Working with Algorithmia data sources

For some algorithms, passing input to the algorithm at request time is sufficient, while others might have larger data requirements or need to preserve state between calls. Application developers can use Algorithmia's [Hosted Data](/developers/data/hosted) to store data as text, JSON, or binary, and access it via the Algorithmia [Data API](/developers/api/#data).

The Data API defines [connectors](/developers/api/#connectors) to a variety of storage providers, including Algorithmia [Hosted Data](/developers/data/hosted), Amazon S3, Google Cloud Storage, Azure Storage Blobs, and Dropbox. After creating a connection in Data Sources, you can use the API to create, update, and delete directories and files and manage permissions across providers by making use of [Data URIs](/developers/api/#data-uris) in your code.

In this example, we'll upload a text document to Algorithmia's [Hosted Data](/developers/data/hosted) storage provider, and use the [nlp/CleanDocuments](https://algorithmia.com/algorithms/nlp/CleanDocuments/) algorithm to pre-process the document for use in other algorithms. "Clean Documents" will remove HTML tags, emojis and other utf-8 encodings, along with all non-punctuation symbols and symoblics, then return a JSON object with a URI where you can download the resulting document.

### Create a data collection

The [documentation for nlp/CleanDocuments](https://algorithmia.com/algorithms/nlp/CleanDocuments/docs) says that it takes a URL or a Data URI of the documents to be processed, and returns a Data URI where the result can be downloaded. We'll create a directory to host the input documents, then update its [permissions](/developers/api/#update-collection-acl) so that it's publicly accessible:

{% highlight r %}
# Instantiate a Data Directory object
nlp_directory = client$dir("data://YOUR_USERNAME/nlp_directory")
# Create your data collection if it does not exist
if(nlp_directory.exists() == FALSE) {
    nlp_directory.create()
}
# Change permissions on your data collection to public
nlp_directory$update_permissions(ReadAcl.PUBLIC)
{% endhighlight %}

Instead of your username you can also use '.my' when calling algorithms. For more information about the '.my' pseudonym check out the [Hosted Data Guide]({{site.baseurl}}/data/hosted).
{: .notice-info}

### Upload data to your data collection

Now we're ready to upload an text document for processing. For this example, we'll use the first chapter of Jack London's [Burning Daylight](https://en.wikisource.org/wiki/Burning_Daylight). Since the "Clean Documents" algorithm can process multiple documents in the same text file, it requires each document to be separated by the delimiter `"""`. The algorithm will throw an error if the delimiter isn't present. You can download the first chapter with the delimiter already added here: [Chapter One Burning Daylight, by Jack London](/data_assets/burning_daylight_delimiter.txt).

Next, create a variable that holds the URI location where you would like to upload the document:

{% highlight r %}
nlp_file <- "data://.my/nlp_directory/burning_daylight.txt"
{% endhighlight %}

Then upload your local file to the data collection using the `$putFile()` method:

{% highlight r %}
if (client$file(nlp_file)$exists() == FALSE) {
    # Upload local file
    client$file(nlp_file)$putFile("/your_local_path_to_file/burning_daylight_delimiter.txt")
}
{% endhighlight %}

This function call will replace a file if it already exists at the specified location. If you wish to avoid replacing a file, check if the file exists before using this function.
{: .notice-warning}

Confirm that the file was created by navigating to Algorithmia's [Hosted Data Source](/data/hosted) and finding your data collection and file.

You can also upload your data through the UI on Algorithmia's "Hosted Data Source". For instructions on how to do this go to the [Hosted Data Guide]({{site.baseurl}}/data/hosted).

### Call the algorithm

Once the file has been uploaded, you are ready to call the algorithm. Instantiate the algorithm, then pass the URI for the file you want to process as the input:

{% highlight r %}
# Create the algorithm object
algoNLP <- client$algo('nlp/CleanDocuments')
# Invoke algorithm
response <- algoNLP$pipe("data://.my/nlp_directory/burning_daylight.txt")
{% endhighlight %}

Once the algorithm has completed, `response$result` will contain a URI for the processed file, which you can then download (or provide as input to another algorithm in a pipeline).

Algorithms can create and store data in folders named with the algorithm name in the Algorithm Data collection. To access this folder from within an executing algorithm, the `.algo` shortcut can be used, as in the input example above. When accessing data from a client context, the algorithm author and name can be used along with the `.algo` shortcut to download data, in the format `data://.algo/author/algoName/folder/fileName`.
{: .notice-info}

### Download the resulting file

We can download the resulting file using the URI returned in the algorithm output. First, verify that the file that you want to download exists, and download it to a new local file:

{% highlight r %}
# Download the file
if (client$file(response$result).exists()) {
    local_file <- client$file(response$result)$getFile()
}
{% endhighlight %}

This copies the file from your data collection and saves it as a file on your local machine, storing the filename in the variable `local_file`.

Alternately, if you just need the JSON content of the processed file to be stored in a variable, you can retrieve the remote file's content without saving the actual file:

{% highlight r %}
# Download contents of file as JSON
if client$file(response$result)$exists()) {
    processed_text <- client$file(download_uri).getJson()
}

{% endhighlight %}

This will get the file as a JSON object, saving it to the variable `processed_text`, which might be useful when writing algorithms that are part of a text processing pipeline.

If the file was an image or some other binary data type, you could instead use the function `.getRaw()` to retrieve the file's content as raw bytes. For more methods on how to get a file using the Data API from a data collection refer to the [API Specification](/developers/api/#get-a-file-or-directory).

## Additional functionality

In addition to the functionality covered in this guide, the R Client Library provides a complete interface to the Algorithmia platform, including [managing algorithms](/developers/algorithm-development/algorithm-management), administering [organizations](/developers/platform/organizations), and working with [source control](/developers/algorithm-development/source-code-management). You can also visit the [API Docs](/developers/api) to view the complete API specification.

## Next steps

If you're a data scientist or developer who will be building and deploying new algorithms, you can move on to the [Algorithm Development > Getting Started](/developers/algorithm-development/your-first-algo/) guide.
