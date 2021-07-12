---
categories: clients
excerpt: "Get familiar with the CLI client."
image:
    teaser: /language_logos/cli.svg
layout: article
redirect_from:
  - /application-development/client-guides/cli/
  - /application-development/guides/cli/
show_related: true
tags: [clients]
title:  "CLI"
---

The Algorithmia CLI provides a command-line interface to the Algorithmia API, letting developers manage and call algorithms, work with data in object stores using Algorithmia Data Sources, and access other features of the Algorithmia platform.

This guide will cover calling an algorithm using direct input, calling an algorithm that accesses data through Algorithmia Data Sources, and using Algorithmia's Hosted Data service. For complete details about the Algorithmia API, please refer to the [API Docs](/developers/api/).

## Set Up the Client

### Installation

The latest releases & changelog can be found [here](https://pypi.org/project/algorithmia/).

The CLI can be installed from the python package manager pip:

{% highlight bash %}
pip install algorithmia
{% endhighlight %}

If you’ll be running Python algorithms, also set the version via export LANGUAGE_VERSION=python2 or export LANGUAGE_VERSION=python3
{: .notice-info}

### Authentication

To access the API you'll need an API key, which Algorithmia uses for fine-grained authentication across the platform. For this example, we'll use the `default-key` that was created along with your account, which has a broad set of permissions. Log in to Algorithmia and navigate to Home > [API Keys](/user#credentials) to find your key, or read the [API keys documentation](/developers/platform/customizing-api-keys) for more information.

Begin the configuration process by running the command `algo auth`. You will see an interactive prompt to guide you through setting up a default profile:

{% highlight bash %}
$ algo auth
Configuring authentication for profile: default
enter API address [https://api.algorithmia.com]: 
enter API key:
(optional) enter path to custom CA certificate: 
usage: algo [-h] [--profile PROFILE] {auth,clone,run,ls,rm,mkdir,rmdir,cp,cat,help} ...
{% endhighlight %}

See [Using multiple profiles](#using-multiple-profiles) for instructions on how to set authenticate and use more than one profile with the Algorithmia CLI tool.

#### Specifying an On-Premises or Private Cloud Endpoint

This feature is available to [Algorithmia Enterprise](/enterprise) users only.
{: .notice-enterprise}

If you are running [Algorithmia Enterprise](/enterprise), replace the default API Endpoint (`https://api.algorithmia.com`) with your own API endpoint URL. Note that it must contain the `api` prefix, so if your domain is ` https://algorithmia.companyname.com ` then your API Endpoint should be `https://api.algorithmia.companyname.com`

## Calling an Algorithm

Algorithms take three basic types of input whether they are invoked directly through the API or by using a client: strings, JSON, and binary data. In addition, individual algorithms might have their own I/O requirements, such as using different data types for input and output, or accepting multiple types of input, so consult the input and output sections of an algorithm's documentation for specifics.

The first algorithm we'll call is a demo version of the algorithm used in the Algorithm Development [Getting Started](/developers/algorithm-development/your-first-algo) guide, which is available at [demo/Hello](/algorithms/demo/Hello). Looking at the [algorithm's documentation](/algorithms/demo/Hello/docs), it takes a string as input and returns a string.

We can run the following command to make the request:

{% highlight bash %}
algo run demo/Hello -d "HAL 9000"
{% endhighlight %}

Which should print the phrase, `Hello HAL 9000`.

### Complex JSON Inputs

We can provide JSON input directly to Algorithms invoked using the CLI. By default, if the data parses as JSON, the CLI will assume that it is JSON. You may also explicitly specify the input type as JSON using the `-j` flag.

Let's look at an example using a JSON input: the [nlp/LDA](https://algorithmia.com/algorithms/nlp/LDA) algorithm. The [algorithm docs](https://algorithmia.com/algorithms/nlp/LDA/docs) tell us that the algorithm takes a list of documents and returns a number of topics that are relevant to those documents. The documents can be a list of strings, a Data API file path, or a URL. We'll call this algorithm using a list of strings, following the format in the algorithm documentation:

{% highlight bash %}
algo run nlp/LDA/1.0.0 -j "{\"docsList\": [\"It's apple picking season\", \"The apples are ready for picking\"]}"
{% endhighlight %}

The output will be similar to `[{'picking': 2}, {'apple': 1}, {'apples': 1, 'ready': 1}, {'season': 1}]`, which is the list of relevant words and the number of occurrences.

You might have noticed that in this example we included a version number when instantiating the algorithm. Pinning your code to a specific version of the algorithm can be especially important in a production environment where the underlying implementation might change from version to version.

### Request Options

The API exposes options that can configure algorithm requests. This includes support for changing the timeout or indicating that the API should include stdout in the response. From the CLI, we can provide these options as arguments. The CLI also lets us specify whether the output should be written to `stdout` or to a file. In the following example, we set the timeout to 60 seconds and disable `stdout` in the response, and write the results to a file called results.txt:

{% highlight bash %}
algo run demo/Hello -d "HAL 9000" --debug --timeout 60 --output results.txt
{% endhighlight %}

You can find more details in [API Docs](/developers/api/?shell) > [Invoke an Algorithm](/developers/api/?shell#invoke-an-algorithm).

### Limits

Your account can make up to {{site.data.stats.platform.max_num_algo_requests}} Algorithmia requests at the same time (this limit <a onclick="Intercom('show')">can be raised</a> if needed).

Requests are limited to a payload size of 10MB for input and 15MB for output. If you need to work with larger amounts of data, you can make use of the Algorithmia [Data API](/developers/api/#data).

## Working with Algorithmia Data Sources

For some algorithms, passing input to the algorithm at request time is sufficient, while others might have larger data requirements or need to preserve state between calls. Application developers can use Algorithmia's [Hosted Data](/developers/data/hosted) to store data as text, JSON, or binary, and access it via the Algorithmia [Data API](/developers/api/?shell#data).

The Data API defines [connectors](/developers/api/?shell#connectors) to a variety of storage providers, including Algorithmia [Hosted Data](/developers/data/hosted), Amazon S3, Google Cloud Storage, Azure Storage Blobs, and Dropbox. After creating a connection in Data Sources, you can use the API to create, update, and delete directories and files and manage permissions across providers by making use of [Data URIs](/developers/api/#data-uris) in your code.

The CLI provides a set of familiar commands such as `ls`, `rm`, and `cp` for working with the [Data API](/developers/api/?shell#data). You can find complete documentation for these commands [here](https://github.com/algorithmiaio/algorithmia-python#the-algorithmia-data-api).

In this example, we'll upload an image to Algorithmia's [Hosted Data](/developers/data/hosted) storage provider, and use the [dlib/FaceDetection](https://algorithmia.com/algorithms/dlib/FaceDetection) algorithm to detect any faces in the image. The algorithm will create a new copy of the image with bounding boxes drawn around the detected faces, and then return a JSON object with details about the dimensions of the bounding boxes and a URI where you can download the resulting image.

### Create a Data Collection

The documentation for "Face Detection" says that it takes a URL or a Data URI of the image to be processed, and a Data URI where the algorithm can store the result. First, we'll create a directory to host the input image:

{% highlight bash %}
algo mkdir .my/img_directory
{% endhighlight %}

Instead of your username you can also use '.my' when calling algorithms. For more information about the '.my' pseudonym check out the [Hosted Data Guide]({{site.baseurl}}/data/hosted).
{: .notice-info}

We'll also need to update the directory's [permissions](/developers/api/#update-collection-acl) so that it's publicly accessible. In order to change your data collection permissions you can go to [Hosted Data](/data/hosted) and click on the collection you just created called **"img_directory"** and select from the dropdown at the top of the screen that will show three different types of permissions:

-   My Algorithms (called by any user)
-   Private (accessed only by me)
-   Public (available to anyone)

### Upload Data to your Data Collection

Now we're ready to upload an image file for processing. For this example, we'll use [this photo of a group of friends](https://unsplash.com/photos/Q_Sei-TqSlc). Download the image and save it locally as `friends.jpg`. 

Then upload your local file to the data collection using the `cp` command to copy the file into Hosted Data:

{% highlight bash %}
algo cp ./friends.jpg data://.my/img_directory
{% endhighlight %}

This method call will replace a file if it already exists at the specified location. If you wish to avoid replacing a file, check if the file exists before using this method.
{: .notice-warning}

Confirm that the file was created by navigating to Algorithmia's [Hosted Data Source](/data/hosted) and finding your data collection and file.

You can also upload your data through the UI on Algorithmia's [Hosted Data Source](/data/hosted). For instructions on how to do this go to the [Hosted Data Guide]({{site.baseurl}}/data/hosted).

### Call the Algorithm

Once the file has been uploaded, you are ready to call the algorithm, providing the inputs as specified in the [FaceDetection documentation](https://algorithmia.com/algorithms/dlib/FaceDetection/docs)—an image URI (which is stored in `img_file` in the code above) and a URI for the image output:

{% highlight bash %}
algo run dlib/FaceDetection/0.2.1 -j "{\"images\": [{\"url\": \"data://.my/img_directory/friends.jpg\",\"output\": \"data://.algo/temp/detected_faces.png\"}]}"
{% endhighlight %}

Once the algorithm has completed, the response will contain the dimensions of the bounding boxes for any detected faces and the URI for the resulting file, which you can then download (or provide as input to another algorithm in a pipeline).

Algorithms can create and store data in folders named with the algorithm name in the Algorithm Data collection. To access this folder from within an executing algorithm, the `.algo` shortcut can be used, as in the input example above. When accessing data from a client context, the algorithm author and name can be used along with the `.algo` shortcut to download data, in the format `data://.algo/author/algoName/folder/fileName`.
{: .notice-info}

### Download the resulting file

The URI included in the algorithm output uses the `.algo` shortcut, so we'll need to modify it slightly to download the file by adding the algorithm name and author. We can then download the file:

{% highlight bash %}
algo cp data://.algo/dlib/FaceDetection/temp/detected_faces.png ./detected_faces.png
{% endhighlight %}

## Using multiple profiles

### Add additional profiles

With the Algorithmia CLI, you can configure multiple custom profiles to use. To add a new profile, you will run through the same interactive prompt—simply add a profile name to the command to add a new profile.

{% highlight text %}
$ algo auth --profile second_user
Configuring authentication for profile: 'second_user'
Enter API Endpoint [https://api.algorithmia.com]:
Enter API Key:
(optional) enter path to custom CA certificate: 

Profile is ready to use. Test with 'algo ls --profile second_user'
{% endhighlight %}

Now you may use `algo ls --profile second_user` to list files in your `second_user` account. For more information, see the auth command help with `algo auth --help`.

### Using profiles in commands

When running commands, the Algorithmia CLI will use the default profile unless otherwise specified with the `--profile <profile>` option. See the following example:

{% highlight text %}
$ algo run demo/Hello -d "HAL 9000" --profile second_user
[Hello HAL 9000]
{% endhighlight %}

## Additional Functionality

In addition to the functionality covered in this guide, the API provides a complete interface to the Algorithmia platform, including [managing algorithms](/developers/algorithm-development/algorithm-management), administering [organizations](/developers/platform/organizations), and working with [source control](/developers/algorithm-development/source-code-management). You can also visit the [API Docs](/developers/api) to view the complete API specification.

## Next Steps

If you'd like to use a particular programming language for accessing the Algorithmia platform, you can refer to the rest of our [Client Guides](https://algorithmia.com/developers/clients), or if you're a data scientist or developer who will be building and deploying new algorithms, you can move on to the [Algorithm Development > Getting Started](/developers/algorithm-development/your-first-algo/) guide.