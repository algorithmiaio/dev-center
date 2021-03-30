---
layout: article
title: "CURL"
excerpt: "Get going with the cURL client on Algorithmia."
categories: clients
tags: [clients]
show_related: true
image:
    teaser: /language_logos/curl.svg
redirect_from:
  - /application-development/client-guides/cURL/
  - /application-development/client-guides/curl/
  - /application-development/guides/curl/
---

{% include video-responsive.html height="560" width="315" url="https://www.youtube.com/embed/VIxCEFFmpWQ" %}

The Algorithmia API lets developers manage and call algorithms, work with data in object stores using Algorithmia Data Sources, and access other features of the Algorithmia platform. All the features of the REST interface can be accessed directly over HTTPS using cURL.

This guide will cover calling an algorithm from cURL using direct user input, calling an algorithm that accesses data through Algorithmia Data Sources, and using Algorithmia's Hosted Data service. For complete details about the Algorithmia API, please refer to the [API Docs](/developers/api/?shell).

## Calling an Algorithm

Algorithms take three basic types of input whether they are invoked directly through the API or by using a client library: strings, JSON, and binary data. In addition, individual algorithms might have their own I/O requirements, such as using different data types for input and output, or accepting multiple types of input, so consult the input and output sections of an algorithm's documentation for specifics.

To access the API you'll need an API key, which Algorithmia uses for fine-grained authentication across the platform. For this example, we'll use the `default-key` that was created along with your account, which has a broad set of permissions. Log in to Algorithmia and navigate to Home > [API Keys](/user#credentials) to find your key, or read the [API keys documentation](/developers/platform/customizing-api-keys) for more information. You'll provide your API key via an `Authorization` header with the prefix `Simple`.

The first algorithm we'll call is a demo version of the algorithm used in the Algorithm Development [Getting Started](/developers/algorithm-development/your-first-algo) guide, which is available at [demo/Hello](/algorithms/demo/Hello). Looking at the [algorithm's documentation](/algorithms/demo/Hello/docs), it takes a string as input and returns a string.

We can run the following cURL command to make the request:

{% highlight bash %}
curl https://api.algorithmia.com/v1/algo/demo/Hello \
    -X POST \
    -H 'Content-Type: application/json' \
    -H 'Authorization: Simple YOUR_API_KEY' \
    -d '"HAL 9000"'
  {% endhighlight %}

Which should print the phrase, `Hello HAL 9000`.

### Complex JSON Inputs

Let's look at an example using a more complicated JSON input: the [nlp/LDA](https://algorithmia.com/algorithms/nlp/LDA) algorithm. The [algorithm docs](https://algorithmia.com/algorithms/nlp/LDA/docs) tell us that the algorithm takes a list of documents and returns a number of topics that are relevant to those documents. The documents can be a list of strings, a Data API file path, or a URL. We'll call this algorithm using a list of strings, following the format in the algorithm documentation:

{% highlight bash %}
curl https://api.algorithmia.com/v1/algo/nlp/LDA/1.0.0 \
    -X POST \
    -H 'Content-Type: application/json' \
    -H 'Authorization: Simple YOUR_API_KEY' \
    -d '{"docsList": ["It'\''s apple picking season","The apples are ready for picking"]}'
{% endhighlight %}

The output will be similar to `[{'picking': 2}, {'apple': 1}, {'apples': 1, 'ready': 1}, {'season': 1}]`, which is the list of relevant words and the number of occurrences.

You might have noticed that in this example we included a version number when instantiating the algorithm. Pinning your code to a specific version of the algorithm can be especially important in a production environment where the underlying implementation might change from version to version.

### Request Options

The API exposes options that can configure algorithm requests. This includes support for changing the timeout or indicating that the API should include stdout in the response. From cURL, we can provide these options as URL parameters. In the following example, we set the timeout to 60 seconds and disable `stdout` in the response:

{% highlight bash %}
curl 'https://api.algorithmia.com/v1/algo/demo/Hello?timeout=60&stdout=false' \
    -X POST \
    -H 'Content-Type: application/json' \
    -H 'Authorization: Simple YOUR_API_KEY' \
    -d '"HAL 9001"'
{% endhighlight %}

You can find more details in [API Docs](/developers/api/?shell) > [Invoke an Algorithm](/developers/api/?shell#invoke-an-algorithm).

### Error Handling

To be able to better develop across languages, Algorithmia has created a set of standardized errors that can be returned by either the platform or by the algorithm being run. If an error occurs while invoking the API, the HTTP response will include an error field with more information:

{% highlight bash %}
curl https://api.algorithmia.com/v1/algo/util/whoopsWrongAlgo \
    -X POST \
    -H 'Content-Type: application/json' \
    -H 'Authorization: Simple YOUR_API_KEY' \
    -d '"Hello, world"'
{% endhighlight %}

Response: `{"error":{"message":"algorithm algo://util/whoopsWrongAlgo/ not found"}}`

You can read more about [Error Handling](/developers/algorithm-development/algorithm-errors) in the [Algorithm Development](/developers/algorithm-development) section of the dev center.

### Limits

Your account can make up to {{site.data.stats.platform.max_num_algo_requests}} Algorithmia requests at the same time (this limit <a href="mailto:support@algorithmia.com?subject=Request to raise max algorithm request limit">can be raised</a> if needed).

## Working with Algorithmia Data Sources

For some algorithms, passing input to the algorithm at request time is sufficient, while others might have larger data requirements or need to preserve state between calls. Application developers can use Algorithmia's [Hosted Data](/developers/data/hosted) to store data as text, JSON, or binary, and access it via the Algorithmia [Data API](/developers/api/?shell#data).

The Data API defines [connectors](/developers/api/?shell#connectors) to a variety of storage providers, including Algorithmia [Hosted Data](/developers/data/hosted), Amazon S3, Google Cloud Storage, Azure Storage Blobs, and Dropbox. After creating a connection in Data Sources, you can use the API to create, update, and delete directories and files and manage permissions across providers by making use of [Data URIs](/developers/api/#data-uris) in your code.

In this example, we'll upload an image to Algorithmia's [Hosted Data](/developers/data/hosted) storage provider, and use the [dlib/FaceDetection](https://algorithmia.com/algorithms/dlib/FaceDetection) algorithm to detect any faces in the image. The algorithm will create a new copy of the image with bounding boxes drawn around the detected faces, and then return a JSON object with details about the dimensions of the bounding boxes and a URI where you can download the resulting image.

### Create a Data Collection

The documentation for "Face Detection" says that it takes a URL or a Data URI of the image to be processed, and a Data URI where the algorithm can store the result. We'll create a directory to host the input image, then update its [permissions](/developers/api/#update-collection-acl) so that it's publicly accessible by issuing a `PATCH` request with the appropriate ACL:

{% highlight bash %}
curl 'https://api.algorithmia.com/v1/data/.my' \
    -X POST \
    -H 'Content-Type: application/json' \
    -H 'Authorization: Simple YOUR_API_KEY' \
    -d '{"name": "img_directory"}'
{% endhighlight %}

Response: `{"result":"data://.my/img_directory"}`

{% highlight bash %}
curl 'https://api.algorithmia.com/v1/connector/data/.my/img_directory' \
    -X PATCH \
    -H 'Content-Type: application/json' \
    -H 'Authorization: Simple YOUR_API_KEY' \
    -d '{"acl": {"read": ["user://*"]} }'
{% endhighlight %}

Instead of your username you can also use '.my' when calling algorithms. For more information about the '.my' pseudonym check out the [Hosted Data Guide]({{site.baseurl}}/data/hosted).
{: .notice-info}

### Upload Data to your Data Collection

Now we're ready to upload an image file for processing. For this example, we'll use [this photo of a group of friends](https://unsplash.com/photos/Q_Sei-TqSlc). Download the image and save it locally as `friends.jpg`. 

Then upload your local file to the data collection using the `PUT` method:

{% highlight bash %}
curl 'https://api.algorithmia.com/v1/connector/data/.my/img_directory/friends.jpg' \
    -X PUT \
    -H 'Authorization: Simple YOUR_API_KEY' \
    --data-binary @friends.jpg
{% endhighlight %}

This method call will replace a file if it already exists at the specified location. If you wish to avoid replacing a file, check if the file exists before using this method.
{: .notice-warning}

Confirm that the file was created by navigating to Algorithmia's [Hosted Data Source](/data/hosted) and finding your data collection and file.

You can also upload your data through the UI on Algorithmia's [Hosted Data Source](/data/hosted). For instructions on how to do this go to the [Hosted Data Guide]({{site.baseurl}}/data/hosted).

### Call the Algorithm

Once the file has been uploaded, you are ready to call the algorithm, providing the inputs as specified in the [FaceDetection documentation](https://algorithmia.com/algorithms/dlib/FaceDetection/docs)—an image URI (which is stored in `img_file` in the code above) and a URI for the image output:

{% highlight bash %}
curl https://api.algorithmia.com/v1/algo/dlib/FaceDetection/0.2.1 \
    -X POST \
    -H 'Content-Type: application/json' \
    -H 'Authorization: Simple YOUR_API_KEY' \
    -d '{
    "images": [
        {
            "url": "data://.my/img_directory/friends.jpg",
            "output": "data://.algo/temp/detected_faces.png"
        }
    ]
}'

{% endhighlight %}

Once the algorithm has completed, the response will contain the dimensions of the bounding boxes for any detected faces and the URI for the resulting file, which you can then download (or provide as input to another algorithm in a pipeline).

Algorithms can create and store data in folders named with the algorithm name in the Algorithm Data collection. To access this folder from within an executing algorithm, the `.algo` shortcut can be used, as in the input example above. When accessing data from a client context, the algorithm author and name can be used along with the `.algo` shortcut to download data, in the format `data://.algo/author/algoName/folder/fileName`.
{: .notice-info}

### Download the resulting file

The URI included in the algorithm output uses the `.algo` shortcut, so we'll need to modify it slightly to download the file by adding the algorithm name and author. We can then attempt to download the file and write it to disk:

{% highlight bash %}
curl -O https://api.algorithmia.com/v1/connector/data/.algo/dlib/FaceDetection/temp/detected_faces.png \
    -H 'Authorization: Simple YOUR_API_KEY'
{% endhighlight %}

## Additional Functionality

In addition to the functionality covered in this guide, the API provides a complete interface to the Algorithmia platform, including [managing algorithms](/developers/algorithm-development/algorithm-management), administering [organizations](/developers/platform/organizations), and working with [source control](/developers/algorithm-development/source-code-management). You can also visit the [API Docs](/developers/api) to view the complete API specification.

## Next Steps

If you'd like to use a particular programming language for accessing the Algorithmia platform, you can refer to the rest of our [Client Guides](https://algorithmia.com/developers/clients), or if you're a data scientist or developer who will be building and deploying new algorithms, you can move on to the [Algorithm Development > Getting Started](/developers/algorithm-development/your-first-algo/) guide.
