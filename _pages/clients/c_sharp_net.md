---
layout: article
title: "C#/.Net"
categories: clients
tags: [clients]
show_related: true
image:
    teaser: /language_logos/c_sharp_net.svg
---

The C#/.Net client is still in development.  For now, you can use cURL inside your C#/.Net code to call any algorithm:

#### Required imports
{% highlight csharp %}
using System;
using System.Collections.Generic;
using System.Net;
using System.IO;
{% endhighlight %}

#### Calling an algorithm via cURL in C#/.Net

{% highlight csharp %}
// find your API key at http://algorithmia.com/user#credentials
var apiKey = "_YOUR_API_KEY_";

// pick an algorithm from https://algorithmia.com/algorithms
var algo = "demo/Hello";

// prepare a POST with JSON content
var request = WebRequest.Create("https://api.algorithmia.com/v1/algo/" + algo); 
request.ContentType = "application/json";
request.Method = "POST";
request.Headers.Add("Authorization", apiKey);

using (StreamWriter streamWriter = new StreamWriter(request.GetRequestStream()))
{
    // input should be a string (usually serialized JSON)
    streamWriter.Write(input);
}

WebResponse response = request.GetResponse();

String text = null;
using (StreamReader streamReader = new StreamReader(response.GetResponseStream()))
{
    text = streamReader.ReadToEnd();
    // many algorithms return serialized JSON; don't forget to parse the text
}

{% endhighlight %}

#### Additional information

See the full [cURL Client Guide]({{ site.baseurl }}/clients/curl) and [API Specification](http://docs.algorithmia.com/#api-specification) for additional details
on calling algorithms and managing data with cURL.
