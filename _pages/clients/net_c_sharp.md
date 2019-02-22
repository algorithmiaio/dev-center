---
layout: article
title: ".NET / C#"
excerpt: "Add machine learning to your .NET / C# app with Algorithmia"
permalink: clients/c_sharp_net/
categories: clients
tags: [clients]
show_related: true
image:
    teaser: /language_logos/c_sharp_net.svg
---

We now have an early version of a native .NET client for calling algorithms and interacting with our Data APIs.  This guide will give you a walkthrough of how to use the new .NET client.  The client is open-sourced and available on [GitHub](https://github.com/algorithmiaio/algorithmia-c-sharp).

The Algorithmia .NET client supports .NET Standard 2.0 which means it can be used within apps targeting:
- .NET Core
- ASP.NET Core
- .NET Framework (> 4.6.1)
- Mono
- Xamarin.iOS
- Xamarin.Mac
- Xamarin.Android
- Universal Windows Platform Apps
- Unity

You can find out more about .NET Standard and the versions of related frameworks that are supported here: [.NET Standard - .NET Implementation Support](https://docs.microsoft.com/en-us/dotnet/standard/net-standard) and [Learn more about .NET Framework vs .NET Core](https://docs.microsoft.com/en-us/dotnet/standard/choosing-core-framework-server).

#### Getting Started with Algorithmia in .NET
The Algorithmia client is available on NuGet.org and is as easy as adding the package to your .NET project using Visual Studio or the NuGet Packet Manager.

{% highlight csharp %}
Install-Package Algorithmia.Client
{% endhighlight %}

#### Required imports
{% highlight csharp %}
using Algorithmia;
{% endhighlight %}

#### Calling your first algorithm
Calling an algorithm is extremely simple with the .NET Client.  You first create a client using your API key.  You can find your API key at https://algorithmia.com/user#credentials.

{% highlight csharp %}
var client = new Client("YOUR_API_KEY");
{% endhighlight %}

Now, you can find any algorithm in the directory at https://algorithmia.com/algorithms and call it.  In this case, we are going to call the [Hello demo algorithm](https://algorithmia.com/algorithms/demo/hello).

{% highlight csharp %}
 var algo = client.algo("algo://demo/hello");
 // The type you pass into the generic method `pipe` is the type you want to be returned as the result.
 var response = algo.pipe<string>("World");

 var textResult = response.result.ToString();
{% endhighlight %}

A single algorithm may have different input and output types, or accept multiple types of input, so consult the algorithm’s description for usage examples specific to that algorithm.
{: .notice-info}

### Limits

Your account can make up to {{ site.data.stats.platform.max_num_algo_requests }} Algorithmia requests at the same time (this limit <a onclick="Intercom('show')">can be raised</a> if needed).

### Create a Data Collection

This section will show how to create a data collection which is essentially a folder of data files hosted on Algorithmia for free.

Start with adding the required import and creating the client as we did before.

{% highlight csharp %}
using Algorithmia;
var client = new Client("YOUR_API_KEY");
{% endhighlight %}

Now create a data collection called nlp_directory:

{% highlight csharp %}
// Instantiate a DataDirectory object, set your data URI and call create
var nlp_directory = client.dir("data://YOUR_USERNAME/nlp_directory");
// Create your data collection if it does not exist
if (!nlp_directory.exists()) {
    nlp_directory.create();
}
{% endhighlight %}

A Data URI uniquely identifies files and directories and contains a protocol "data://" and path "YOUR_USERNAME/data_collection". For more information on the Data URI see the [Data API Specification](http://docs.algorithmia.com/#data-api-specification).

Instead of your username you can also use '.my' when calling algorithms. For more information about the '.my' pseudonym check out the [Hosted Data Guide]({{ site.url }}/data/hosted/).
{: .notice-info}

### Work with Directory Permissions

When we created the data collection in the previous code snippet, the default setting is `ReadDataAcl.MY_ALGOS` which is a permission type that allows other users on the platform to interact with your data through the algorithms you create if you decide to contribute to algorithm development. This means users can call your algorithm to perform an operation on your data stored in this collection, otherwise the algorithm you created would only work for you.

In order to inspect the data collection's permission type and update those permissions to private:

{% highlight csharp %}
// Create the acl object and check if it's the .MY_ALGOS default setting
var acl = nlp_directory.getPermissions();

if (acl == ReadDataAcl.MY_ALGOS) {
    Console.WriteLine("acl is the default permissions type MY_ALGOS");
}

// Update permissions to private
nlp_directory.updatePermissions(ReadDataAcl.PRIVATE);
if (nlp_directory.getPermissions() == ReadDataAcl.PRIVATE) {
    Console.WriteLine("Directory updated to PRIVATE");
}

{% endhighlight %}

Notice that we changed our data collection to private, which means that only you will be able to read and write to your data collection.

Note that read access that is set to the default `DataMyAlgorithms` allows any algorithm you call to have access to your data collection so most often, this is the setting you want when you are calling an algorithm and are an application developer.

For more information on collection-based Access Control Lists (ACLs) and other data collection permissions go to the [Hosted Data Guide]({{ site.baseurl }}/data/hosted/).

### Upload Data to your Data Collection

So far you've created your data collection and checked and updated directory permissions. Now you're ready to upload a local text file to your data collection using the Data API.

First add the necessary dependencies:

{% highlight csharp %}
using System;
using System.IO;
{% endhighlight %}

Then create a variable that holds the local path to the file you will be uploading and a DataFile object that represents the destination in the nlp_directory data collection we created earlier:

{% highlight csharp %}
var local_file_path = "local_path_to_your_file/jack_london.txt";
var destination = nlp_directory.file("jack_london.txt");
{% endhighlight %}

Next upload your local file using the `.put()` method:

{% highlight csharp %}
if (!destination.exists()) {
    destination.put(File.OpenRead(local_file_path));
}
{% endhighlight %}

This method will replace a file if it already exists. If you wish to avoid replacing a file, check if the file exists before using this.
{: .notice-warning}

You can confirm that the file was created by navigating to Algorithmia's [Hosted Data Source](https://algorithmia.com/data/hosted) and finding your data collection and file.

You can also upload your data through the UI on Algorithmia's [Hosted Data Source](https://algorithmia.com/data/hosted). For instructions on how to do this go to the [Hosted Data Guide]({{ site.baseurl }}/data/hosted/).

### Downloading Data from a Data Collection

Next check if the file that you just uploaded to data collections exists, and try downloading it to a (new) local file:

{% highlight csharp %}
// Download the file
var text_file = "data://YOUR_USERNAME/nlp_directory/jack_london.txt";
if (client.file(text_file).exists()) {
    var localfile = client.file(text_file).getFile();
} else {
    Console.WriteLine("The file does not exist");
}
{% endhighlight %}

This copies the file from your data collection and saves it as a file on your local machine, storing the filename in the variable `localfile`. 

Alternately, if you just need the text content of the file to be stored in a variable, you can retrieve the remote file's content without saving the actual file:

{% highlight csharp %}
// Download contents of file as a string
var text_file = "data://YOUR_USERNAME/nlp_directory/jack_london.txt";
if (client.file(text_file).exists()) {
    var input = client.file(text_file).getString();
} else {
    Console.WriteLine("The file does not exist");
}
{% endhighlight %}

This will get your file as a string, saving it to the variable `input`.  If the file was binary (an image, etc), you could instead use the function `.getBytes()` to retrieve the file's content as a byte array. For more image-manipulation tutorials, see the [Computer Vision Recipes]({{ site.baseurl }}/tutorials/recipes/#computer-vision).

Now you've seen how to upload a local data file, check if a file exists in a data collection, and download the file contents as a string.

For more methods on how to get a file using the Data API from a data collection go to the [API Specification](http://docs.algorithmia.com/#getting-a-file).

{% if site.enterprise %}
#### Specifying an On-Premises Algorithmia Enterprise Endpoint
This .NET Client also works for customers running [Algorithmia Enterprise](https://algorithmia.com/enterprise).  You can specify the API endpoint when you create the client object.

{% highlight csharp %}
var client = new Client("YOUR_API_KEY", "https://mylocalendpoint");
{% endhighlight %}

Alternately, you can ensure that each of your servers interacting with your Algorithmia Enterprise instance have an environment variable named `ALGORITHMIA_API` and the client will use it.  The fallback API endpoint is always the hosted Algorithmia marketplace service at [https://api.algorithmia.com/](https://api.algorithmia.com/)
{% endif %}


#### Additional information
You can find out more about the .NET Client from the [GitHub repo](https://github.com/algorithmiaio/algorithmia-c-sharp).  You can also find our [API Specification](http://docs.algorithmia.com/) available for all of the APIs that are available on the Algorithmia platform.
