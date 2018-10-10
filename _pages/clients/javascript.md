---
layout: article
title:  "Javascript"
excerpt: "Add machine learning to your Javascript app with Algorithmia"
categories: clients
tags: [clients]
show_related: true
image:
    teaser: /language_logos/js.svg
---

We offer a vanilla JavaScript client for calling algorithms in the marketplace.

### Download

You can download our JavaScript client from:

<a href="{{ site.baseurl }}/v1/clients/js/algorithmia-0.2.0.js" download="algorithmia-0.2.0.js">https://algorithmia.com/v1/clients/js/algorithmia-0.2.0.js</a>

You can include the JavaScript file as a script tag:

{% highlight html %}
<script src="//algorithmia.com/v1/clients/js/algorithmia-0.2.0.js" type="text/javascript"></script>
{% endhighlight %}

#### Call an Algorithm

Next, login at [Algorithmia]({{ site.baseurl }}/) to get your [API key]({{ site.baseurl }}/user#credentials):

Now import the Algorithmia library and create the Algorithmia client:

{% highlight javascript %}
var client = Algorithmia.client("YOUR_API_KEY");
{% endhighlight %}

After setting your API key, you can then use the `client` variable from the above line to call algorithms.

The format for calling an algorithm is `client.algo()` with the algorithm name passed in. To pass input to the algorithm, use the `.pipe` method.

{% highlight javascript %}
client.algo("demo/Hello").pipe(input)
{% endhighlight %}

Here is an example of how to authenticate and call an algorithm in JavaScript:

{% highlight javascript %}
var input = 41;
var client = Algorithmia.client("YOUR_API_KEY");
client.algo("docs/JavaAddOne").pipe(input).then(function(output) {
  if(output.error) return console.error("error: " + output.error);
  console.log(output.result);
});
{% endhighlight %}

#### Enterprise Users Only: Specifying an On-Premises Endpoint
If you are running the [Algorithmia platform on-premises with Algorithmia Enterprise](https://algorithmia.com/enterprise), you can specify the API endpoint when you create the client object:

{% highlight javascript %}
var client = Algorithmia.client("YOUR_API_KEY", "https://mylocalendpoint");
{% endhighlight %}

### Limits

Your account can make up to {{ site.data.stats.platform.max_num_algo_requests }} Algorithmia requests at the same time (this limit <a onclick="Intercom('show')">can be raised</a> if needed).

### Note: Working with Files

Because of security concerns, the JavaScript client does not implement the [Data API](http://docs.algorithmia.com/#data-api-specification) which other clients use to move files into and out of [Data Sources](https://algorithmia.com/developers/data/). This can be a problem if you call an algorithm which writes its output to a file (instead of returning it directly).  However, there are workarounds:

For smaller files, the [util/Cat](https://algorithmia.com/algorithms/util/Cat) and [ANaimi/Base64DataConverter](https://algorithmia.com/algorithms/ANaimi/Base64DataConverter) algorithms can be used for retrieving file contents.

For larger files, you can set up an [Amazon S3 Connector]({{ site.baseurl }}/developers/data/s3/) to an S3 bucket with public read access. Then, direct the algorithms you call to write their output into that S3 connector (or use [s3utilities/UploadFiletoS3/](https://algorithmia.com/algorithms/s3utilities/UploadFiletoS3/) to move it there). Once it is in the S3 bucket, you can access the file via its publicly-readable URL.

Alternately, you could implement a small piece of backend code in [another language]({{ site.baseurl }}/developers/clients/) and use it to retrieve the file for you.
