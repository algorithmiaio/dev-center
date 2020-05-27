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
robots: none
---

This guide provides a walk-through of how to use the official Algorithmia Node.js Client to call algorithms and manage data through the Algorithmia platform.

Here you will learn how to install the Algorithmia Node Client, work with the Data API by uploading and downloading files, create and update directories and permission types and last, you'll learn how to call an algorithm that summarizes text files.

To follow along you can create a new Node script or if you'd rather, you can follow the examples in the Node interpreter.

## Getting Started with Algorithmia

The official Algorithmia Node.js Client is available on NPM. Install it for your project by adding algorithmia to your package.json:

{% highlight js %}
npm install --save algorithmia
{% endhighlight %}

## Authentication

Next, login to [Algorithmia](/) to get your [API key](/user#credentials):

Now import the Algorithmia library and create the Algorithmia client:

{% highlight js %}
var algorithmia = require("algorithmia");

var client = algorithmia("YOUR_API_KEY");
{% endhighlight %}

Now you’re ready to start working with Algorithmia in Node.

{% if site.enterprise %}
#### Enterprise Users Only: Specifying an On-Premises or Private Cloud Endpoint
If you are running [Algorithmia Enterprise](/enterprise), you can specify the API endpoint when you create the client object:

{% highlight js %}
var client = algorithmia("YOUR_API_KEY", "https://mylocalendpoint");
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

{% highlight js %}
// Instantiate a DataDirectory object, set your data URI and call Create
var nlp_directory = client.dir("data://YOUR_USERNAME/nlp_directory")
// Create your data collection if it does not exist
nlp_directory.exists(function(exists) {
    if (exists == false) {
        nlp_directory.create(function(response) {
            if (response.error) {
                return console.log("Failed to create dir: " + response.error.message);
            } else {
              console.log("Created directory: " + nlp_directory.data_path);
            }
        });
    } else {
        console.log("Your directory already exists.")
    }
});
{% endhighlight %}

A Data URI uniquely identifies files and directories and contains a protocol "data://" and path "YOUR_USERNAME/data_collection". For more information on the Data URI see the [Data API Specification](http://docs.algorithmia.com/#data-api-specification).

Instead of your username you can also use '.my' when calling algorithms. For more information about the '.my' pseudonym check out the [Hosted Data Guide]({{site.baseurl}}/data/hosted).
{: .notice-info}

### Work with Directory Permissions

When we created the data collection in the previous code snippet, the default setting is "My Algorithms" which is a permission type that allows other users on the platform to interact with your data through the algorithms you create if you decide to contribute to algorithm development. This means users can call your algorithm to perform an operation on your data stored in this collection, otherwise the algorithm you created would only work for you.

In order to change your data collection permissions you can go to [Hosted Data](/data/hosted) and click on the collection you just created called **"nlp_directory"** and select from the dropdown at the top of the screen that will show three different types of permissions:

-	My Algorithms (called by any user)
-	Private (accessed only by me)
-	Public (available to anyone)

For more information about data collection permissions go to the [Hosted Data Guide]({{site.baseurl}}/data/hosted).

### Upload Data to your Data Collection

So far you've created your data collection and checked and updated directory permissions. Now you're ready to upload the text file that you created at the beginning of the guide to your data collection using the Data API.

First create a variable that holds the path to your data collection and the text file you will be uploading:

{% highlight js %}
var local_file = "local_path_to_your_file/jack_london.txt"
{% endhighlight %}

Next upload your local file to the data collection using the `.putFile()` method:

{% highlight js %}
var text_file = "data://YOUR_USERNAME/nlp_directory/jack_london.txt"

client.file(text_file).exists(function(exists) {
    // Check if file exists, if it doesn't create it
    if (exists == false) {
        nlp_directory.putFile(local_file, function(response) {
            if (response.error) {
                return console.log("Failed to upload file: " + response.error.message);
            } else {
              console.log("File uploaded.");
            }
        });
    } else {
        console.log("Your file already exists.")
    }
});
{% endhighlight %}

This endpoint will replace a file if it already exists. If you wish to avoid replacing a file, check if the file exists before using this endpoint.
{: .notice-warning}

You can confirm that the file was created by navigating to Algorithmia's [Hosted Data Source](/data/hosted) and finding your data collection and file.

You can also upload your data through the UI on Algorithmia's [Hosted Data Source](/data/hosted). For instructions on how to do this go to the [Hosted Data Guide]({{site.baseurl}}/data/hosted).

### Downloading Data from a Data Collection

Next check if the file that you just uploaded to data collections exists and then download the contents of that file as a string:

{% highlight js %}
client.file(text_file).exists(function(exists) {
    if (exists == true) {
        // Download contents of file as a string
        client.file(text_file).get(function(err, data) {
            if (err) {
                console.log("Failed to download file.");
                console.log(err);
            } else {
                console.log("Successfully downloaded data.")
            }
            var input = data;
        });
    }
});
{% endhighlight %}

This will get your file as a string, saving it to the variable `input`. If you wanted to sve it to a local file instead, you'd simply `fs.writeFileSync("/path/to/save/localfile.ext", data);` in the callback.

Now you've seen how to upload a local data file, check if a file exists in a data collection, and download the file contents.

For more methods on how to get a file using the Data API from a data collection go to the [API Specification](http://docs.algorithmia.com/#getting-a-file).

## Call an Algorithm

Finally we are ready to call an algorithm. In this guide we'll use the natural language processing algorithm called [Summarizer](https://algorithmia.com/algorithms/nlp/Summarizer). This algorithm results in a string that is the summary of the text content you pass in as the algorithm's input.

A single algorithm may have different input and output types, or accept multiple types of input, so consult the algorithm’s description for usage examples specific to that algorithm.
{: .notice-info}

This example shows the summary of the text file which we downloaded from our data collection and set as the variable called `input` in the previous code sample.

Create the algorithm object and pass in the variable `input` into `algo.pipe()`:

{% highlight js %}
client.file(text_file).exists(function(exists) {
    if (exists == true) {
        // Download contents of file as a string
        client.file(text_file).get(function(err, data) {
            if (err) {
                console.log("Failed to download file.");
                console.log(err);
            } else {
                console.log("Successfully downloaded data.")
            }
            var input = data;

            // Call an algorithm with text input by passing a string into the pipe method. The returned promise will be called with the response with the Algorithm completes (or when an error occurs). If the algorithm output is text, then the get() method on the response will return a string.

            client.algo("algo://nlp/Summarizer/0.1.3")
                .pipe(input)
                .then(function(response) {
                    console.log(response.get());
                });
        });
    }
});
{% endhighlight %}

This guide used the the first chapter of [Jack London's Burning Daylight](https://en.wikisource.org/wiki/Burning_Daylight) and the Summarizer algorithm outputs:

"It was a quiet night in the Shovel. The miners were in from Moseyed Creek and the other diggings to the west, the summer washing had been good, and the men's pouches were heavy with dust and nuggets. MacDonald grinned and nodded, and opened his mouth to speak, when the front door swung wide and a man appeared in the light."

If you are interested in learning more about working with unstructured text data check out our guide [Introduction to Natural Language Processing](https://blog.algorithmia.com/introduction-natural-language-processing-nlp/).

### Limits

Your account can make up to {{site.data.stats.platform.max_num_algo_requests}} Algorithmia requests at the same time (this limit <a onclick="Intercom('show')">can be raised</a> if needed).

## Conclusion:

This guide covered installing Algorithmia via npm, uploading and downloading data to and from a user created data collection, checking if a file exists using the Data API, calling an algorithm, and handling errors.

For more information on the methods available using the Data API in Node check out the [Data API](http://docs.algorithmia.com/?node#data-api-specification) or the [Algorithmia Node.js Client](https://github.com/algorithmiaio/algorithmia-nodejs)

For convenience, here is the whole script available to run:

{% highlight js %}
var algorithmia = require("algorithmia");

var client = algorithmia("YOUR_API_KEY");

// Set your Data URI
var nlp_directory = client.dir("data://YOUR_USERNAME/nlp_directory")
// Create your data collection if it does not exist
nlp_directory.exists(function(exists) {
    if (exists == false) {
        nlp_directory.create(function(response) {
            if (response.error) {
                return console.log("Failed to create dir: " + response.error.message);
            }
            console.log("Created directory: " + nlp_directory.data_path);
        });
    } else {
        console.log("Your directory already exists.")
    }
});

var local_file = "local_path_to_your_file/jack_london.txt"

var text_file = "data://YOUR_USERNAME/nlp_directory/jack_london.txt"

client.file(text_file).exists(function(exists) {
    // Check if file exists, if it doesn't create it
    if (exists == false) {
        nlp_directory.putFile(local_file, function(response) {
            if (response.error) {
                return console.log("Failed to upload file: " + response.error.message);
            }
            console.log("File uploaded.");
        });
    } else {
        console.log("Your file already exists.")
    }
});

client.file(text_file).exists(function(exists) {
    // Download contents of file as a string if it exists
    client.file(text_file).get(function(err, data) {
        if (err) {
            console.log("Failed to download file.");
            console.log(err);
        } else {
            console.log("Successfully downloaded data.")
        }
        var input = data;

        // Call an algorithm with text input by passing a string into the pipe method. The returned promise will be called with the response with the Algorithm completes (or when an error occurs). If the algorithm output is text, then the get() method on the response will return a string.

        client.algo("algo://nlp/Summarizer/0.1.3")
            .pipe(input)
            .then(function(response) {
                console.log(response.get());
            });
    });
});

{% endhighlight %}
