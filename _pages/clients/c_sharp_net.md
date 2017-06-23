---
layout: article
title: "C#/.Net"
categories: clients
tags: [clients]
show_related: true
image:
    teaser: /language_logos/c_sharp_net.svg
---

We now have an early version of a native .NET client for calling algorithms and interacting with our Data APIs.  This guide will give you a walkthrough of how to use the new .NET client.  The client is open-sourced and available on [GitHub](https://github.com/algorithmiaio/algorithmia-c-sharp).

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
To call an algorithm is extremely simple with the .NET Client.  You first create a client using your API key.  You can find your API key at https://algorithmia.com/user#credentials.

{% highlight csharp %}
var client = new Algorithmia.Client("YOUR_API_KEY");
{% endhighlight %}

Now, you can find any algorithm in the directory at https://algorithmia.com/algorithms and call it.  In this case, we are going to call the [Hello demo algorithm](https://algorithmia.com/algorithms/demo/hello).

{% highlight csharp %}
 var algo = new Algorithmia.Algorithm(client, "algo://demo/hello");
 var response = algo.pipe<string>("World");

 // Many algorithms return serialized JSON so don't forget to parse the text response
 var text = response.result.ToString();
{% endhighlight %}

A single algorithm may have different input and output types, or accept multiple types of input, so consult the algorithm’s description for usage examples specific to that algorithm.
{: .notice-info}

#### Additional information
You can find out more about the .NET Client from the [GitHub repo](https://github.com/algorithmiaio/algorithmia-c-sharp).  You can also find our [API Specification](http://docs.algorithmia.com/) available for all of the APIs that are available on the Algorithmia platform.