---
layout: article
title: "Node"
excerpt: "Add machine learning to your NodeJS app with Algorithmia"
categories: clients
tags: [clients]
ignore_sections: [building-the-client]
show_related: true
image:
    teaser: /language_logos/node.svg
repository: https://github.com/algorithmiaio/algorithmia-nodejs
redirect_from:
  - /application-development/client-guides/node/
  - /application-development/guides/node/
  - /node/
  - /application-development/lang-guides/node/
---

The Algorithmia Node.js client provides a native Node.js interface to the Algorithmia API, letting developers manage and call algorithms, work with data in object stores using Algorithmia Data Sources, and access other features of the Algorithmia platform.

This guide will cover setting up the client, calling an algorithm using direct user input, calling an algorithm that accesses data through Algorithmia Data Sources, and using Algorithmia's Hosted Data service. For complete details about the Algorithmia API, please refer to the [API Docs](/developers/api).

## Set Up the Client

The official Algorithmia Node.js Client is available on NPM. Install it for your project by adding algorithmia to your package.json:

{% highlight bash %}
$ npm install --save algorithmia
{% endhighlight %}

To use the client you'll need an API key, which Algorithmia uses for fine-grained authentication across the platform. For this example, we'll use the `default-key` that was created along with your account, which has a broad set of permissions. Log in to Algorithmia and navigate to Home > [API Keys](/user#credentials) to find your key, or read the [API keys](/developers/platform/customizing-api-keys) documentation for more information.

Once the client is installed, you can import it into your code and instantiate the client object:

{% highlight js %}
const algorithmia = require('algorithmia');

const apiKey = "YOUR_API_KEY";

const client = algorithmia.client(apiKey);
{% endhighlight %}

#### Specifying an On-Premises or Private Cloud Endpoint

This feature is available to [Algorithmia Enterprise](/enterprise) users only.
{: .notice-enterprise}

If you are running [Algorithmia Enterprise](/enterprise), you can specify the API endpoint when you create the client object:

{% highlight js %}
const client = algorithmia.client("YOUR_API_KEY", "https://mylocalendpoint");
{% endhighlight %}

Alternately, you can ensure that each of your servers interacting with your Algorithmia Enterprise instance have an environment variable named `ALGORITHMIA_API` and the client will use it.  The fallback API endpoint is always the hosted Algorithmia marketplace service at [https://api.algorithmia.com/](https://api.algorithmia.com)

## Calling an Algorithm

Algorithms take three basic types of input whether they are invoked directly through the API or by using a client library: strings, JSON, and binary data. In addition, individual algorithms might have their own I/O requirements, such as using different data types for input and output, or accepting multiple types of input, so consult the input and output sections of an algorithm's documentation for specifics.

The first algorithm we'll call is a demo version of the algorithm used in the Algorithm Development [Getting Started](/developers/algorithm-development/your-first-algo) guide, which is available at [demo/Hello](/algorithms/demo/Hello). Looking at the [algorithm's documentation](/algorithms/demo/Hello/docs), it takes a string as input and returns a string.

We'll need to create an algorithm object, then use the `.pipe()` method to call the algorithm. We'll provide our input as the argument to the function. Next, we call the `.then()` method and log the response to the console using the `.get()` method of the response object: 

{% highlight js %}
client.algo("demo/Hello")
    .pipe("HAL 9000")
    .then(function(response) {
        console.log(response.get());
    });
{% endhighlight %}

This should print the phrase `Hello Mr. Bond` to the console.

### JSON and JavaScript

The JavaScript client provides some ease-of-use abstractions for working with algorithms with JSON inputs and outputs. When passing a native JavaScript type such as an object or array into the `.pipe()` function, the library will automatically serialize it to JSON. Algorithms will return a JSON type and the `result` field of the response will contain an appropriate JavaScript type.

Let's look at an example using JSON and the [nlp/LDA](https://algorithmia.com/algorithms/nlp/LDA) algorithm. The [algorithm docs](https://algorithmia.com/algorithms/nlp/LDA/docs) tell us that the algorithm takes a list of documents and returns a number of topics that are relevant to those documents. The documents can be a list of strings, a Data API file path, or a URL. We'll call this algorithm using a list of strings, following the format in the algorithm documentation:

{% highlight js %}
const jsonInput = {
    "docsList": [
        "It's apple picking season",
        "The apples are ready for picking"
    ]
}

algoJSON = client.algo("nlp/LDA/1.0.0");

algoJSON.pipe(jsonInput)
    .then(function(response) {
        console.log(response.get());
    });
{% endhighlight %}

The output will be similar to `[{'picking': 2}, {'apple': 1}, {'apples': 1, 'ready': 1}, {'season': 1}]`, which is the list of relevant words and the number of occurrences.

You might have noticed that in this example we included a version number when instantiating the algorithm. Pinning your code to a specific version of the algorithm can be especially important in a production environment where the underlying implementation might change from version to version.

### Request Options

The Algorithmia API exposes options that can configure algorithm requests. This includes support for changing the timeout or indicating that the API should include stdout in the response. In the following example, we set the timeout to 60 seconds and disable `stdout` in the response:

{% highlight js %}
client.algo("demo/Hello?timeout=60&stdout=false");
{% endhighlight %}

You can find more details in [API Docs](/developers/api) > [Invoke an Algorithm](/developers/api/#invoke-an-algorithm).

### Error Handling

To be able to better develop across languages, Algorithmia has created a set of standardized errors that can be returned by either the platform or by the algorithm being run. In JavaScript, if an error occurs while calling an algorithm, the response will include an error field which you can check:

{% highlight js %}
client.algo("util/WhoopsWrongAlgo")
    .pipe("Hello World")
    .then(function(response) {
        console.log(response.error);
    });
{% endhighlight %}

The above code will output `{ message: 'algorithm algo://util/WhoopsWrongAlgo/ not found' }`.

You can read more about [Error Handling](/developers/algorithm-development/algorithm-errors) in the [Algorithm Development](/developers/algorithm-development) section of the dev center.

### Limits

Your account can make up to {{site.data.stats.platform.max_num_algo_requests}} Algorithmia requests at the same time (this limit <a onclick="Intercom('show')">can be raised</a> if needed).

## Working with Algorithmia Data Sources

For some algorithms, passing input to the algorithm at request time is sufficient, while others might have larger data requirements or need to preserve state between calls. Application developers can use Algorithmia's [Hosted Data](/developers/data/hosted) to store data as text, JSON, or binary, and access it via the Algorithmia [Data API](/developers/api/#data).

The Data API defines [connectors](/developers/api/#connectors) to a variety of storage providers, including Algorithmia [Hosted Data](/developers/data/hosted), Amazon S3, Google Cloud Storage, Azure Storage Blobs, and Dropbox. After creating a connection in Data Sources, you can use the API to create, update, and delete directories and files and manage permissions across providers by making use of [Data URIs](/developers/api/#data-uris) in your code.

In this example, we'll upload an image to Algorithmia's [Hosted Data](/developers/data/hosted) storage provider, and use the [dlib/FaceDetection](https://algorithmia.com/algorithms/dlib/FaceDetection) algorithm to detect any faces in the image. The algorithm will create a new copy of the image with bounding boxes drawn around the detected faces, and then return a JSON object with details about the dimensions of the bounding boxes and a URI where you can download the resulting image.

### Create a Data Collection

The documentation for "Face Detection" says that it takes a URL or a Data URI of the image to be processed, and a Data URI where the algorithm can store the result. Create a directory to host the input image:

{% highlight js %}
const img_directory = client.dir('data://YOUR_USERNAME/img_directory');

img_directory.exists(function(exists) {
    if (exists) {
        console.log("Directory already exists");
    } else {
        img_directory.create();
    }
});
{% endhighlight %}

Instead of your username you can also use '.my' when calling algorithms. For more information about the '.my' pseudonym check out the [Hosted Data Guide]({{site.baseurl}}/data/hosted).
{: .notice-info}

We'll also need to update the directory's [permissions](/developers/api/#update-collection-acl) so that it's publicly accessible. In order to change your data collection permissions you can go to [Hosted Data](/data/hosted) and click on the collection you just created called `img_directory` and select from the dropdown at the top of the screen that will show three different types of permissions:

-   My Algorithms (called by any user)
-   Private (accessed only by me)
-   Public (available to anyone)

Set the permissions to `Public` before moving to the next section.

### Upload Data to your Data Collection

Now we're ready to upload an image file for processing. For this example, we'll use [this photo of a group of friends](https://unsplash.com/photos/Q_Sei-TqSlc). Download the image and save it locally as `friends.jpg`. 

Next, create a variable that holds the location where you would like to upload the image as a URI:

{% highlight js %}
const img_file = "data://.my/img_directory/friends.jpg";
{% endhighlight %}

Then upload your local file to the data collection using the `.putFile()` method:

{% highlight js %}
client.file(img_file).exists(function(exists) {
    // Check if file exists, if it doesn't create it
    if (exists) {
        console.log("File already exists.")
    } else {
        img_directory.putFile("data/friends.jpg");
    }
});
{% endhighlight %}

This method call will replace a file if it already exists at the specified location. If you wish to avoid replacing a file, check if the file exists before using this method.
{: .notice-warning}

Confirm that the file was created by navigating to Algorithmia's [Hosted Data Source](/data/hosted) and finding your data collection and file.

You can also upload your data through the UI on Algorithmia's [Hosted Data Source](/data/hosted). For instructions on how to do this go to the [Hosted Data Guide]({{site.baseurl}}/data/hosted).

### Call the Algorithm

Once the file has been uploaded, you are ready to call the algorithm. Create the algorithm object, then pass the required inputs—an image URI (which is stored in `img_file` in the code above) and a URI for the image output—to `pipe()`:

{% highlight js %}
algoCV = client.algo('dlib/FaceDetection/0.2.1')

const input = {
    "images": [
        {
            "url": "data://.my/img_directory/friends.jpg",
            "output": "data://.algo/temp/detected_faces.png"
        }
    ]
}

algoCV.pipe(input)
    .then(function(response) {
        if (response.error) {
            console.log(response.error);
        } else {
            console.log(response.get());
        }
    });
{% endhighlight %}

Once the algorithm has completed, `response.result` will contain the dimensions of the bounding boxes for any detected faces and the URI for the resulting file, which you can then download (or provide as input to another algorithm in a pipeline).

Algorithms can create and store data in folders named with the algorithm name in the Algorithm Data collection. To access this folder from within an executing algorithm, the `.algo` shortcut can be used, as in the input example above. When accessing data from a client context, the algorithm author and name can be used along with the `.algo` shortcut to download data, in the format `data://.algo/author/algoName/folder/fileName`.
{: .notice-info}

### Download the resulting file

The URI included in the algorithm output uses the `.algo` shortcut, so we'll need to modify it slightly to download the file by adding the algorithm name and author:

{% highlight js %}
const download_uri = "data://.algo/dlib/FaceDetection/temp/detected_faces.png";
{% endhighlight %}

Verify that the file that you want to download exists, and try downloading the data and writing it to `data/detected_faces.png`:

{% highlight js %}
client.file(download_uri).exists(function(exists) {
    if (exists == true) {
        client.file(download_uri).get(function(err, data) {
            if (err) {
                console.log("Failed to download file.");
                console.log(err);
            } else {
                fs.writeFileSync("data/detected_faces.png", data);
                console.log("Successfully downloaded data.")
            }
        });
    }
});
{% endhighlight %}

Alternately, you can work directly with the binary content of the file instead of using `fs` to write it to disk.

If the file was text or JSON you could instead use `.getString()` or `.getJSON()`, respectively, to retrieve the file's contents. For more methods on how to get a file from a data collection using the Data API go to the [API Specification](/developers/api/#get-a-file-or-directory).x

## Additional Functionality

In addition to the functionality covered in this guide, the Python Client Library provides a complete interface to the Algorithmia platform, including [managing algorithms](/developers/algorithm-development/algorithm-management), administering [organizations](/developers/platform/organizations), and working with [source control](/developers/algorithm-development/source-code-management). You can also visit the [API Docs](/developers/api) to view the complete API specification.

## Next Steps

If you're a data scientist or developer who will be building and deploying new algorithms, you can move on to the [Algorithm Development > Getting Started](/developers/algorithm-development/your-first-algo) guide.
