---
layout: article
title:  "Getting Started"
excerpt: "Make your first API call with this quick start guide."
tags: [app-dev-getting-started]
show_related: true
author: steph_kim
image:
  teaser: /icons/hexicon_desktop_purple.svg
---

Welcome to Getting Started with the Algorithmia API. This guide will show you how to call an algorithm via our API in a few lines of code using our supported language clients.

We'll show an example in cURL, Python, Java, Rust, R, Node, Ruby, JavaScript, Scala, Go, and Swift in order to get you up and running so you can quickly develop intelligent applications in the language of your choice.

If you want more detailed tutorials on how to work with the language clients including Android, CLi and how to work with AWS Lambda, check out our [Client Guides](/developers/client-guides/).

## Finding an Algorithm

To get started, find an algorithm you'd like to call. You can do this by using the search bar or browsing the marketplace by tags & categories. Each algorithm has an owner and an algorithm name; you'll need both to format your request. This information is listed under the algorithm name on the description page as well as in the format of the algorithm's URL.

For a given user and algorithm name, API calls are made to the following URL:

{% highlight bash %}
POST https://api.algorithmia.com/v1/algo/:owner/:algoname
{% endhighlight %}

We recommend that you also append the algorithm version in your API call to ensure that the correct algorithm is called.

If you want a complete guide on how to navigate an algorithm's description page including how to determine how the price of calling an algorithm, check out our [Algorithm Profiles](/basics/algorithm-profiles/) guide.
{: .notice-info}

## Making your first API call

We'll make our first call with the demo algorithm ["Hello"](https://algorithmia.com/algorithms/demo/Hello). This algorithm takes an input of a string (preferably your name!) and returns a greeting addressed to the input.

Calling the algorithm is as simple as making a curl request. For example, to call the demo/Hello algorithm, simply run a cURL request in your terminal:

{% highlight bash lineanchors %}
curl -X POST -d '"YOUR_USERNAME"' -H 'Content-Type: application/json' -H 'Authorization: Simple YOUR_API_KEY' https://api.algorithmia.com/v1/algo/demo/Hello/0.1.1
{% endhighlight %}

If you aren't logged in, make sure to replace `YOUR_USERNAME` with your name & `YOUR_API_KEY` with your API key.
{: .notice-warning}

You can also use one of the clients to make your call. See below for examples or visit one of the [Client Guides](/developers/client-guides/) for details on how to call algorithms and work with data in your language of choice.

> Python:

{% highlight python lineanchors %}
import Algorithmia

input = "YOUR_USERNAME"
client = Algorithmia.client("YOUR_API_KEY")
algo = client.algo("demo/Hello/0.1.1")
response = algo.pipe(input)
print response
{% endhighlight %}

> Java:

{% highlight java lineanchors %}
import com.algorithmia.*;
import com.algorithmia.algo.*;

String input = "YOUR_USERNAME";
AlgorithmiaClient client = Algorithmia.client("YOUR_API_KEY");
Algorithm algo = client.algo("algo://demo/Hello/0.1.1");
AlgoResponse response = algo.pipeJson(input);
System.out.println(response.asJsonString());
{% endhighlight %}

> Node:

{% highlight javascript lineanchors %}
var algorithmia = require("algorithmia");
var client = algorithmia("YOUR_API_KEY");

var input = "YOUR_USERNAME";
Algorithmia.client("YOUR_API_KEY")
           .algo("algo://demo/Hello/0.1.1")
           .pipe(input)
           .then(function(response) {
             console.log(response.get());
           });

{% endhighlight %}

> Ruby:

{% highlight ruby lineanchors %}
require 'algorithmia'

input = "YOUR_USERNAME"
client = Algorithmia.client("YOUR_API_KEY")
algo = client.algo("demo/Hello/0.1.1")
response = algo.pipe(input).result
puts response
{% endhighlight %}

> Rust:

{% highlight rust lineanchors %}
use algorithmia::*;

let input = "YOUR_USERNAME";
let client = Algorithmia::client("YOUR_API_KEY");
let algo = client.algo("demo/Hello/0.1.1");
let response = algo.pipe(input);
println!(response)
{% endhighlight %}

> Scala:

{% highlight scala lineanchors %}
import com.algorithmia._
import com.algorithmia.algo._

val input = "YOUR_USERNAME"
val client = Algorithmia.client("YOUR_API_KEY")
val algo = client.algo("algo://demo/Hello/0.1.1")
val result = algo.pipeJson(input)
System.out.println(result.asJsonString)
{% endhighlight %}

> Swift:

{% highlight swift lineanchors %}
import Algorithmia

let input = "YOUR_USERNAME";
let client = Algorithmia.client(simpleKey: "YOUR_API_KEY")
let algo = client.algo(algoUri: "demo/Hello/0.1.1") { resp, error in
  print(resp)
}
{% endhighlight %}

> R:

{% highlight r lineanchors %}
library(algorithmia)

input <- "YOUR_USERNAME"
client <- getAlgorithmiaClient("YOUR_API_KEY")
algo <- client$algo("demo/Hello/0.1.1")
result <- algo$pipe(input)$result
print(result)
{% endhighlight %}

> Go:

{% highlight go lineanchors %}
import (
  algorithmia "github.com/algorithmiaio/algorithmia-go"
)

input := "YOUR_USERNAME"

var client = algorithmia.NewClient("YOUR_API_KEY", "")
algo, _ := client.Algo("algo://demo/Hello/0.1.1")
resp, _ := algo.Pipe(input)
response := resp.(*algorithmia.AlgoResponse)
fmt.Println(response.Result)
{% endhighlight %}

> JavaScript:

{% highlight javascript lineanchors %}
// include the algorithmia.js library
var input = "YOUR_USERNAME";
Algorithmia.client("YOUR_API_KEY")
           .algo("algo://demo/Hello/0.1.1")
           .pipe(input)
           .then(function(output) {
             console.log(output);
           });
{% endhighlight %}

## Understanding the response

Each algorithm returns a response in JSON. It will include the `"result"` as well as metadata about the API call you made. The metadata will include the `content_type` as well as a duration.

{% highlight bash lineanchors %}
curl -X POST -d '"YOUR_USERNAME"' -H 'Content-Type: application/json' -H 'Authorization: Simple API_KEY' https://api.algorithmia.com/v1/algo/demo/Hello/0.1.1


{ "result": "Hello YOUR_USERNAME",
  "metadata": {
     "content_type": "text",
     "duration": 0.000187722
  }
}
{% endhighlight%}

The duration is the compute time of the API call into the algorithm. This is the time in seconds between the start of the execution of the algorithm and when it produces a response. Because you are charged on the compute time of the API call, this information will help you optimize your use of the API.

For more information about pricing, check out our [Pricing Guide](/developers/pricing-permissions/)
