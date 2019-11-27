---
layout: article
title:  "Getting Started"
excerpt: "Make your first API call with this quick start guide."
tags: [app-dev-getting-started]
show_related: true
author: steph_kim
image:
  teaser: /icons/hexicon_desktop_purple.svg
redirect_from:
  - /basics/getting-started/
---

Welcome to Getting Started with the Algorithmia API. This guide will show you how to call an algorithm via our API in a few lines of code using our supported language clients.

We'll show an example in cURL, Python, Java, Rust, R, Node, Ruby, JavaScript, Scala, Go, and Swift in order to get you up and running quickly.

## Finding an Algorithm

To get started, find an algorithm you'd like to call. You can do this by using the search bar or browsing the marketplace by tags & categories:

<img src="{{site.cdnurl}}{{site.baseurl}}/images/face_detection.png" class="syn-image-responsive">

Each algorithm has an owner and an algorithm name; you'll need both to format your request. This information is listed under the algorithm name on the description page as well as in the format of the algorithm's URL.

For a given user and algorithm name, API calls are made to the following URL:

<code-sample>
  {% highlight bash %}POST https://api.algorithmia.com/v1/algo/:owner/:algoname{% endhighlight %}
</code-sample>

We recommend that you also append the algorithm version in your API call to ensure that the correct algorithm is called.

<div markdown="1">

If you want a complete guide on how to navigate an algorithm's description page including how to determine the price of calling an algorithm, check out our [Algorithm Profiles]({{site.baseurl}}/basics/algorithm-profiles) guide.
{: .syn-alert.theme-primary}

</div>

## Making your first API call

We'll make our first call with the demo algorithm ["Hello"](/algorithms/demo/Hello). This algorithm takes an input of a string (preferably your name!) and returns a greeting addressed to the input.

<code-sample>
  {% highlight bash %}curl -X POST -d '"YOUR_USERNAME"' -H 'Content-Type: application/json' -H 'Authorization: Simple YOUR_API_KEY' https://api.algorithmia.com/v1/algo/demo/Hello/{% endhighlight %}
</code-sample>

If you aren't logged in, make sure to replace <code>YOUR&lowbar;USERNAME</code> with your name & <code>YOUR&lowbar;API&lowbar;KEY</code> with your API key.
{: .notice-warning}

You can also use one of the clients to make your call. See below for examples or visit one of the [Client Guides]({{site.baseurl}}/clients) for details on how to call algorithms and work with data in your language of choice.

<code-sample v-cloak class="syn-mb-16">
<!-- PYTHON -->
{% highlight python %}import Algorithmia

input = "YOUR_USERNAME"
client = Algorithmia.client('YOUR_API_KEY')
algo = client.algo('demo/Hello/')
print algo.pipe(input){% endhighlight %}

<!-- JAVA -->
{% highlight java %}import com.algorithmia.*;
import com.algorithmia.algo.*;

String input = "YOUR_USERNAME"
AlgorithmiaClient client = Algorithmia.client("YOUR_API_KEY");
Algorithm algo = client.algo("demo/Hello/");
AlgoResponse result = algo.pipe(input);
System.out.println(result.asJsonString());{% endhighlight %}

<!-- R -->
{% highlight r %}library(algorithmia)

input <- "YOUR_USERNAME"
client <- getAlgorithmiaClient("YOUR_API_KEY")
algo <- client$algo("demo/Hello/")
result <- algo$pipe(input)$result
print(result){% endhighlight %}

<!-- JAVASCRIPT -->
<div code-sample-language="JavaScript">
{% highlight javascript %}var input = "YOUR_USERNAME";
Algorithmia.client("YOUR_API_KEY")
          .algo("demo/Hello/")
          .pipe(input)
          .then(function(output) {
            console.log(output);
          });{% endhighlight %}
</div>

<!-- NODEJS -->
<div code-sample-language="Node">
{% highlight javascript %}var input = "YOUR_USERNAME";
Algorithmia.client("YOUR_API_KEY")
          .algo("algo://demo/Hello/")
          .pipe(input)
          .then(function(response) {
            console.log(response.get());
          });{% endhighlight %}
</div>

<!-- RUBY -->
{% highlight ruby %}require 'algorithmia'

input = "YOUR_USERNAME"
client = Algorithmia.client("YOUR_API_KEY")
algo = client.algo("demo/Hello/")
response = algo.pipe(input).result
puts response{% endhighlight %}

<!-- RUST -->
{% highlight rust %}use algorithmia::*;

let input = "YOUR_USERNAME";
let client = Algorithmia::client("YOUR_API_KEY");
let algo = client.algo("demo/Hello/");
let response = algo.pipe(input);
println!(response){% endhighlight %}

<!-- SCALA -->
{% highlight scala %}import com.algorithmia._
import com.algorithmia.algo._

val input = "YOUR_USERNAME"
val client = Algorithmia.client("YOUR_API_KEY")
val algo = client.algo("algo://demo/Hello/")
val result = algo.pipeJson(input)
System.out.println(result.asJsonString){% endhighlight %}

<!-- SWIFT -->
{% highlight swift %}import Algorithmia

let input = "YOUR_USERNAME";
let client = Algorithmia.client(simpleKey: "YOUR_API_KEY")
let algo = client.algo(algoUri: "demo/Hello/") { resp, error in
  print(resp)
}{% endhighlight %}

<!-- C-SHARP -->
<div code-sample-language=".NET/C#">
{% highlight csharp %}using Algorithmia;

var input = "YOUR_USERNAME";
var client = new Client("YOUR_API_KEY");
var algo = client.algo(client, "algo://demo/hello");
var response = algo.pipe&lt;string&gt;(input);
System.Console.WriteLine(response.result.ToString());{% endhighlight %}
</div>

<!-- GO -->
{% highlight go %}import (
  algorithmia "github.com/algorithmiaio/algorithmia-go"
)

input := "YOUR_USERNAME"

var client = algorithmia.NewClient("YOUR_API_KEY", "")
algo, _ := client.Algo("algo://demo/Hello/")
resp, _ := algo.Pipe(input)
response := resp.(*algorithmia.AlgoResponse)
fmt.Println(response.Result){% endhighlight %}

<!-- PERL -->
{% highlight perl %}use LWP::UserAgent;

my $input = 'YOUR_USERNAME';
my $api_key = 'YOUR_API_KEY';
my $req = HTTP::Request->new(POST => 'http://api.algorithmia.com/v1/algo/demo/hello');
$req->header('content-type' => 'application/json');
$req->header('Authorization' => 'Simple '.$api_key);
$req->content($post_data);
my $ua = LWP::UserAgent->new;
my $resp = $ua->request($req);
if ($resp->is_success) {
    print $resp->decoded_content;
} else {
    print 'POST error: ', $resp->code, ': ', $resp->message;
}{% endhighlight %}

<!-- PHP -->
<div code-sample-language="PHP">
{% highlight php %}$input = 'YOUR_USERNAME';
$api_key = 'YOUR_API_KEY';
$data_json = json_encode($input);
$ch = curl_init();
  curl_setopt_array($ch, array(
    CURLOPT_URL => 'https://api.algorithmia.com/v1/algo/demo/hello',
    CURLOPT_HTTPHEADER => array(
      'Content-Type: application/json',
      'Authorization: Simple ' . $api_key,
      'Content-Length: ' . strlen($data_json)
    ),
    CURLOPT_POSTFIELDS => $data_json,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST => true
  ));
  $response_json = curl_exec($ch);
  curl_close($ch);
  $response = json_decode($response_json);
  if($response->error) {
    print('ERROR: ');
    print_r($response->error);
  } else {
    print_r($response->result);
  }{% endhighlight %}
</div>
</code-sample>

## Understanding the response

Each algorithm returns a response in JSON. It will include the `"result"` as well as metadata about the API call you made. The metadata will include the `content_type` as well as a duration.

<code-sample>
{% highlight bash %}curl -X POST -d '"YOUR_USERNAME"' -H 'Content-Type: application/json' -H 'Authorization: Simple YOUR_API_KEY' https://api.algorithmia.com/v1/algo/demo/Hello/

{
  "result": "Hello YOUR_USERNAME",
  "metadata": {
     "content_type": "text",
     "duration": 0.000187722
  }
}{% endhighlight %}
</code-sample>

The duration is the compute time of the API call into the algorithm. This is the time in seconds between the start of the execution of the algorithm and when it produces a response. Because you are charged on the compute time of the API call, this information will help you optimize your use of the API.

For more thorough tutorials in the language of your choice go back to <a href="{{site.baseurl}}/clients">Client Guides</a> or if you want more information about pricing, check out our [Pricing Guide]({{site.baseurl}}/pricing).
