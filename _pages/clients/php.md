---
layout: article
title: "PHP"
excerpt: "Get going with the PHP client on Algorithmia."
categories: clients
tags: [clients]
show_related: true
image:
    teaser: /language_logos/php.svg
repository: https://github.com/algorithmiaio/algorithmia-php
---

This guide provides a walk-through of how to use the official Algorithmia PHP Client to call algorithms and manage data through the Algorithmia platform.

Here you will learn how to install the Algorithmia PHP Client, run machine learning algorithms directly from PHP, and work with the Data API by uploading and downloading files.

## Getting Started with Algorithmia

The official Algorithmia PHP Client is available on [GitHub](https://github.com/algorithmiaio/algorithmia-php), and for more information and examples using the PHP Client you can check out the [PHP Client README](https://github.com/algorithmiaio/algorithmia-php/blob/master/README.md).

To get started, first [download the Algorithmia PHP Client](https://github.com/algorithmiaio/algorithmia-php) and copy the Algorithmia folder into your project. Then, run `composer update` to get the packages the client needs (if you don't have Composer already, get it [here](https://getcomposer.org/)).

## Authentication

Next, login to [Algorithmia](https://algorithmia.com/) to get your [API key](https://algorithmia.com/user#credentials):

Now, inside yourPHP script, import the Algorithmia library via Composer's `autoload`, and create the Algorithmia client:

{% highlight php %}
require_once "vendor/autoload.php";

$client = Algorithmia::client("YOUR_API_KEY");
{% endhighlight %}

Now you’re ready to start working with Algorithmia in PHP. As a simple test, call the Hello World API:

{% highlight php %}
$algo = $client->algo("demo/Hello/0.1.0");
echo $algo->pipe("World")->result;
{% endhighlight %}

#### Note
If you prefer not to have your API Key in the actual PHP files, you can set a system variable instead:

{% highlight bash %}
php -dALGORITHMIA_API_KEY="YOUR_API_KEY" myAI.php
{% endhighlight %}

...then omit the Key in your PHP files:
{% highlight php %}
$client = Algorithmia::client();
{% endhighlight %}

## Working with Data Using the Data API

For application developers, [Algorithmia's Data Portal](https://algorithmia.com/data) offers three different ways to store your data, all available via the [Data API](http://docs.algorithmia.com/#data-api-specification).

This guide will show you how to work with the [Hosted Data]({{ site.baseurl }}/data/hosted/) option on the Algorithmia platform which is available to both algorithm and application developers.

### Prerequisites
If you wish to follow along working through the example yourself, create a text file that contains any unstructured text such as a chapter from a public domain book or article. We used a chapter from [Burning Daylight, by Jack London](https://en.wikisource.org/wiki/Burning_Daylight) which you can copy and paste into a text file. Or copy and paste it from here: <a href="{{ site.baseurl }}/data_assets/burning_daylight.txt">Chapter One Burning Daylight, by Jack London</a>. This will be used throughout the guide.

### Create a Data Collection

This section will show how to create a data collection which is essentially a folder of data files hosted on Algorithmia for free.

First create a data collection called nlp_directory:

{% highlight php %}
$nlp_directory->dir("data://YOUR_USERNAME/nlp_directory");
if(!$nlp_directory->exists()) {
    $nlp_directory->create();
}
{% endhighlight %}

A Data URI uniquely identifies files and directories and contains a protocol "data://" and path "YOUR_USERNAME/data_collection". For more information on the Data URI see the [Data API Specification](http://docs.algorithmia.com/#data-api-specification).

Instead of your username you can also use '.my' when calling algorithms. For more information about the '.my' pseudonym check out the [Hosted Data Guide]({{ site.baseurl }}/data/hosted/).
{: .notice-info}

### Work with Directory Permissions

When we created the data collection in the previous code snippet, the default setting is `ACL::MY_ALGORITHMS`, which is a permission type that allows other users on the platform to interact with your data through the algorithms you create if you decide to contribute to algorithm development. This means users can call your algorithm to perform an operation on your data stored in this collection, otherwise the algorithm you created would only work for you.

If we instead wanted the folder to be completely private (only you can access it) we would have run:

{% highlight php %}
//Create a directory which only you can read:
$newdir = $client->dir("data://.my/mynewfolder")->create(ACL::FULLY_PRIVATE); 
//check the permission on a folder like so:
echo $newdir->getReadAcl();
{% endhighlight %}

For more information on collection-based Access Control Lists (ACLs) and other data collection permissions go to the [Hosted Data Guide]({{ site.baseurl }}/data/hosted/).

### Upload Data to your Data Collection

So far you've created your data collection and checked and updated directory permissions. Now you're ready to upload the text file that you created at the beginning of the guide to your data collection using the Data API.

First, we'll check to see if the file already exists in the data collection.  If not, we'll upload your local file:

{% highlight php %}
$remote_file = $nlp_directory->file("jack_london.txt");
if(!$remote_file->exists()) {
  $remote_file->putFile("/your_local_path_to_file/jack_london.txt");
}
{% endhighlight %}

This endpoint will replace a file if it already exists. If you wish to avoid replacing a file, check if the file exists before using this endpoint.
{: .notice-warning}

You can confirm that the file was created by navigating to Algorithmia's [Hosted Data Source](https://algorithmia.com/data/hosted) and finding your data collection and file.

You can also upload your data through the UI on Algorithmia's [Hosted Data Source](https://algorithmia.com/data/hosted). For instructions on how to do this go to the [Hosted Data Guide]({{ site.baseurl }}/data/hosted/).

### Downloading Data from a Data Collection

Next check if the file that you just uploaded to data collections exists, and try downloading it to a local temp file:
 
{% highlight php %}
//download the file
if(!$remote_file->exists()) {
  $temp_file = $remote_file->getFile();
}
{% endhighlight %}

This copies the file from your data collection and saves it as a file on your local machine, storing the filename in the variable `$temp_file`. 

Alternately, if you just need the text content of the file to be stored in a variable, you can retrieve the remote file's content without saving the actual file:

{% highlight php %}
//download contents of file as a string
if(!$remote_file->exists()) {
  $file_contents = $remote_file->getString();
}
{% endhighlight %}

This will get your file as a string, saving it to the variable `$file_contents`.  If the file was binary (an image, etc), you could instead use the function `getBytes()` to retrieve the file's content as a byte array. For more image-manipulation tutorials, see the [Computer Vision Recipes]({{ site.baseurl }}/tutorials/recipes/#computer-vision).

Now you've seen how to upload a local data file, check if a file exists in a data collection, and download the file contents.

For more methods on how to get a file using the Data API from a data collection go to the [API Specification](http://docs.algorithmia.com/#getting-a-file).

## Call an Algorithm

Finally we are ready to call an algorithm. In this guide we'll use the natural language processing algorithm called [Summarizer](https://algorithmia.com/algorithms/nlp/Summarizer). This algorithm results in a string that is the summary of the text content you pass in as the algorithm's input.

A single algorithm may have different input and output types, or accept multiple types of input, so consult the algorithm’s description for usage examples specific to that algorithm.
{: .notice-info}

This example shows the summary of the text file which we downloaded from our data collection and set as the variable called `input` in the previous code sample.

Create the algorithm object and pass in the variable `input` into `algo.pipe()`:

{% highlight php %}
//create the algorithm object using the Summarizer algorithm
$algo = $client->algo('nlp/Summarizer/0.1.3');
//pass in input required by algorithm
echo $algo->pipe(input)->result;
{% endhighlight %}

This guide used the the first chapter of [Jack London's Burning Daylight](https://en.wikisource.org/wiki/Burning_Daylight) and the Summarizer algorithm outputs:

"It was a quiet night in the Shovel. The miners were in from Moseyed Creek and the other diggings to the west, the summer washing had been good, and the men's pouches were heavy with dust and nuggets. MacDonald grinned and nodded, and opened his mouth to speak, when the front door swung wide and a man appeared in the light."

If you are interested in learning more about working with unstructured text data check out our guide [Introduction to Natural Language Processing](https://blog.algorithmia.com/introduction-natural-language-processing-nlp/).

### Limits

Your account can make up to 80 Algorithmia requests at the same time (this limit <a onclick="Intercom('show')">can be raised</a> if needed).

## Conclusion

This guide covered installing Algorithmia via pip, uploading and downloading data to and from a user created data collection, checking if a file exists using the Data API, calling an algorithm, and handling errors.

For more information on the methods available using the Data API in PHP check out the [Data API](http://docs.algorithmia.com/?php#data-api-specification) documentation or the [PHP Client Docs](https://github.com/algorithmiaio/algorithmia-php).

For convenience, here is the whole script available to run:

{% highlight php %}
require_once "vendor/autoload.php";

//create the Algorithmia client
$client = Algorithmia::client('YOUR_API_KEY');

//create your data collection if it does not exist
$nlp_directory->dir("data://YOUR_USERNAME/nlp_directory");
if(!$nlp_directory->exists()) {
    $nlp_directory->create();
}

//upload local file
$remote_file = $nlp_directory->file("jack_london.txt")
if(!$remote_file->exists()) {
  $remote_file->putFile("/your_local_path_to_file/jack_london.txt");
}

//download contents of file as a string
if(!$remote_file->exists()) {
  $file_contents = $remote_file->getString();
}

//create the algorithm object using the Summarizer algorithm
$algo = $client->algo('nlp/Summarizer/0.1.3');
//pass in input required by algorithm
echo $algo->pipe(input)->result;
{% endhighlight %}

