---
layout: article
title:  "Javascript"
categories: clients
tags: [clients]
show_related: true
image:
    teaser: /language_logos/js.svg
---

We offer a vanilla JavaScript client for calling algorithms in the marketplace.

### Download

You can download our JavaScript client from:

<a href="https://algorithmia.com/v1/clients/js/algorithmia-0.2.0.js" download="algorithmia-0.2.0.js">https://algorithmia.com/v1/clients/js/algorithmia-0.2.0.js</a>

You can include the JavaScript file as a script tag:

{% highlight html %}
<script src="//algorithmia.com/v1/clients/js/algorithmia-0.2.0.js" type="text/javascript"></script>
{% endhighlight %}

#### Call an Algorithm

Next, login to [Algorithmia](https://algorithmia.com/) to get your [API key](https://algorithmia.com/user#credentials):

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

Your account can make up to 80 Algorithmia requests at the same time (this limit <a onclick="Intercom('show')">can be raised</a> if needed).
