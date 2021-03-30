---
layout: article
title:  "Javascript"
excerpt: "Add machine learning to your Javascript app with Algorithmia"
categories: clients
tags: [clients]
show_related: true
image:
    teaser: /language_logos/js.svg
redirect_from:
  - /algorithm-development/client-guides/javascript/
  - /algorithm-development/guides/javascript/
  - /algorithm-development/guides/javascript-guide/
  - /application-development/client-guides/javascript/
  - /application-development/guides/javascript/
  - /application-development/lang-guides/javascript/
---

{% include video-responsive.html height="560" width="315" url="https://www.youtube.com/embed/HF04Ge-3XdE" %}

The Algorithmia JavaScript client provides a native interface for calling algorithms using the Algorithmia API. 

This guide will cover setting up the client, calling an algorithm using direct user input, and calling an algorithm that uses JSON as input. For complete details about the Algorithmia API, please refer to the [API Docs](/developers/api/).

The code in this guide can be run from the JavaScript console in your browser or used in your own scripts.

## Set Up the Client

The JavaScript client can be downloaded from [https://algorithmia.com/v1/clients/js/algorithmia-0.2.1.js](https://algorithmia.com/v1/clients/js/algorithmia-0.2.1.js) and the JavaScript file can be included as a script tag:

{% highlight html %}
<script src="//algorithmia.com/v1/clients/js/algorithmia-0.2.1.js" type="text/javascript"></script>
{% endhighlight %}

To use the client you'll need an API key, which Algorithmia uses for fine-grained authentication across the platform. For this example, we'll use the `default-key` that was created along with your account, which has a broad set of permissions. Log in to Algorithmia and navigate to [Home](/user) > [API Keys](/user#credentials) to find your key, or read the [API keys documentation](/developers/platform/customizing-api-keys) for more information.

Once the client is included, you can instantiate the client object:

{% highlight javascript %}
var client = Algorithmia.client("YOUR_API_KEY");
{% endhighlight %}

#### Specifying an On-Premises or Private Cloud Endpoint

This feature is available to [Algorithmia Enterprise](/enterprise) users only.
{: .notice-enterprise}

If you are running [Algorithmia Enterprise](/enterprise), you can specify the API endpoint when you create the client object:

{% highlight javascript %}
var client = Algorithmia.client("YOUR_API_KEY", "https://mylocalendpoint/v1/web/algo");
{% endhighlight %}

## Calling an Algorithm

Algorithms take three basic types of input whether they are invoked directly through the API or by using a client library: strings, JSON, and binary data. In addition, individual algorithms might have their own I/O requirements, such as using different data types for input and output, or accepting multiple types of input, so consult the input and output sections of an algorithm's documentation for specifics.

The first algorithm we'll call is a demo version of the algorithm used in the Algorithm Development [Getting Started](/developers/algorithm-development/your-first-algo) guide, which is available at [demo/Hello](/algorithms/demo/Hello). Looking at the [algorithm's documentation](/algorithms/demo/Hello/docs), it takes a string as input and returns a string.

In order to call an Algorithm from JavaScript, we need to first create an algorithm object. With the client already instantiated, we can run the following code to create an object:

{% highlight javascript %}
var algo = client.algo("demo/Hello");
{% endhighlight %}

Then, we can use the `.pipe()` method to call the algorithm, and provide our input as the argument to the function. The JavaScript client returns a promise, so we can use `.then()` to handle the result and any errors.

{% highlight javascript %}
algo.pipe("HAL 9000").then(function (output)
    {
        if(output.error) return console.error("error: " + output.error.message);
        console.log(output.result);
    });
{% endhighlight %}

Which should print the phrase `Hello HAL 9000` to the console.

### JSON Inputs

Let's look at an example using JSON and the [nlp/LDA](https://algorithmia.com/algorithms/nlp/LDA) algorithm. The [algorithm docs](https://algorithmia.com/algorithms/nlp/LDA/docs) tell us that the algorithm takes a list of documents and returns a number of topics that are relevant to those documents. The documents can be a list of strings, a Data API file path, or a URL. We'll call this algorithm using a JSON object as our input, following the format in the algorithm documentation:

{% highlight javascript %}
input = {
    "docsList": 
        [
            "It's apple picking season",
            "The apples are ready for picking"
        ]
};

const algoJSON = client.algo("nlp/LDA/1.0.0");
algoJSON.pipe(input).then(function (output)
    {
        if(output.error) return console.error("error: " + output.error.message);
        console.log(output.result);
    }
);
{% endhighlight %}

The output will be a JSON object which includes an array of topics which include relevant words and the number of occurrences.

{% highlight javascript %}
[
    {ready: 1},
    {apple: 1, season: 1},
    {picking: 2},
    {apples: 1}
]
{% endhighlight %}

You might have noticed that in this example we included a version number when instantiating the algorithm. Pinning your code to a specific version of the algorithm can be especially important in a production environment where the underlying implementation might change from version to version.

### Error Handling

To be able to better develop across languages, Algorithmia has created a set of standardized errors that can be returned by either the platform or by the algorithm being run. In JavaScript, API errors and Algorithm exceptions will result in calls to `.pipe()` returning an error object in their output.

{% highlight javascript %}
client.algo("util/whoopsWrongAlgo").pipe("").then(function (output)
    {
        if(output.error) return console.error("error: " + output.error.message);
        console.log(output.result);
    }
)
//[Error] error: algorithm algo://util/whoopsWrongAlgo/ not found
{% endhighlight %}

You can read more about [Error Handling](/developers/algorithm-development/algorithm-errors) in the [Algorithm Development](/developers/algorithm-development) section of the dev center.

### Limits

Your account can make up to {{site.data.stats.platform.max_num_algo_requests}} Algorithmia requests at the same time (this limit <a onclick="Intercom('show')">can be raised</a> if needed).

Algorithm requests have a payload size limit of 10MB for input and 15MB for output. If you need to work with larger amounts of data, you can make use of the Algorithmia [Data API](/developers/api/#data).

### Note: Working with Files

Because of security concerns, the JavaScript client does not implement the [Data API](http://docs.algorithmia.com/#data-api-specification) which other clients use to move files into and out of [Data Sources]({{site.baseurl}}/data). This can be a problem if you call an algorithm which writes its output to a file (instead of returning it directly).  However, there are workarounds:

For smaller files, the [util/Cat]({{site.url}}/algorithms/util/Cat) and [ANaimi/Base64DataConverter](https://algorithmia.com/algorithms/ANaimi/Base64DataConverter) algorithms can be used for retrieving file contents.

For larger files, you can set up an [Amazon S3 Connector]({{site.baseurl}}/data/s3) to an S3 bucket with public read access. Then, direct the algorithms you call to write their output into that S3 connector (or use [s3utilities/UploadFiletoS3/](https://algorithmia.com/algorithms/s3utilities/UploadFiletoS3/) to move it there). Once it is in the S3 bucket, you can access the file via its publicly-readable URL.

Alternately, you could implement a small piece of backend code in [another language]({{site.baseurl}}/clients) and use it to retrieve the file for you.
