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

We'll show an example in cURL, Python, Java, Rust, R, Node, Ruby, JavaScript, Scala, Go, and Swift in order to get you up and running quickly.

## Finding an Algorithm

To get started, find an algorithm you'd like to call. You can do this by using the search bar or browsing the marketplace by tags & categories:

<img src="{{ site.baseurl }}/images/face_detection.jpg" class="screenshot img-sm">

Each algorithm has an owner and an algorithm name; you'll need both to format your request. This information is listed under the algorithm name on the description page as well as in the format of the algorithm's URL.

For a given user and algorithm name, API calls are made to the following URL:

{% highlight bash %}
POST https://api.algorithmia.com/v1/algo/:owner/:algoname
{% endhighlight %}

We recommend that you also append the algorithm version in your API call to ensure that the correct algorithm is called.

If you want a complete guide on how to navigate an algorithm's description page including how to determine the price of calling an algorithm, check out our [Algorithm Profiles]({{ site.baseurl }}/basics/algorithm-profiles/) guide.
{: .notice-info}

## Making your first API call

We'll make our first call with the demo algorithm ["Hello"](https://algorithmia.com/algorithms/demo/Hello). This algorithm takes an input of a string (preferably your name!) and returns a greeting addressed to the input.

Calling the algorithm is as simple as making a curl request. For example, to call the demo/Hello algorithm, simply run a cURL request in your terminal:

{% highlight bash lineanchors %}
curl -X POST -d '"YOUR_USERNAME"' -H 'Content-Type: application/json' -H 'Authorization: Simple YOUR_API_KEY' https://api.algorithmia.com/v1/algo/demo/Hello/
{% endhighlight %}

If you aren't logged in, make sure to replace <code>YOUR&lowbar;USERNAME</code> with your name & <code>YOUR&lowbar;API&lowbar;KEY</code> with your API key.
{: .notice-warning}

You can also use one of the clients to make your call. See below for examples or visit one of the [Client Guides]({{ site.baseurl }}/clients/) for details on how to call algorithms and work with data in your language of choice.

{% raw %}
<br/>
<div ng-controller="GettingStartedControl" class="gs-code-container">
  <div class="code-toolbar ph-16 pv-8">
    <div class="btn-group dropdown">
      <button type="button" class="btn btn-default dropdown-toggle gs-dropdown pa-0" data-toggle="dropdown">
        <div class="lang-logo white-logo mr-4" ng-class="{
          'python': lang === 'Python',
          'java': lang === 'Java',
          'rlang': lang === 'R',
          'javascript': lang === 'JavaScript',
          'node': lang === 'Node',
          'ruby': lang === 'Ruby',
          'rust': lang === 'Rust',
          'scala': lang === 'Scala',
          'swift': lang === 'Swift',
          'go': lang === 'Go',
          'c-sharp': lang === '.Net/C#',
          'perl': lang === 'Perl',
          'php': lang === 'PHP',
        }"></div>
        <span ng-bind="lang" class="mr-4"></span>
        <span class="caret"></span>
      </button>
      <ul class="dropdown-menu gs-languages pt-0" role="menu">
        <li class="mb-0">
          <a class="caption" ng-click="lang='Python'">
            <div class="lang-logo color-logo mr-4 python"></div>
            <span>Python</span>
          </a>
        </li>
        <li class="mb-0">
          <a class="caption" ng-click="lang='Java'">
            <div class="lang-logo color-logo mr-4 java"></div>
            <span>Java</span>
          </a>
        </li>
        <li class="mb-0">
          <a class="caption" ng-click="lang='R'">
            <div class="lang-logo color-logo mr-4 rlang"></div>
            <span>R</span>
          </a>
        </li>
        <li class="mb-0">
          <a class="caption" ng-click="lang='JavaScript'">
            <div class="lang-logo color-logo mr-4 javascript"></div>
            <span>JavaScript</span>
          </a>
        </li>
        <li class="mb-0">
          <a class="caption" ng-click="lang='Node'">
            <div class="lang-logo color-logo mr-4 node"></div>
            <span>Node</span>
          </a>
        </li>
        <li class="mb-0">
          <a class="caption" ng-click="lang='Ruby'">
            <div class="lang-logo color-logo mr-4 ruby"></div>
            <span>Ruby</span>
          </a>
        </li>
        <li class="mb-0">
          <a class="caption" ng-click="lang='Rust'">
            <div class="lang-logo color-logo mr-4 rust"></div>
            <span>Rust</span>
          </a>
        </li>
        <li class="mb-0">
          <a class="caption" ng-click="lang='Scala'">
            <div class="lang-logo color-logo mr-4 scala"></div>
            <span>Scala</span>
          </a>
        </li>
        <li class="mb-0">
          <a class="caption" ng-click="lang='Swift'">
            <div class="lang-logo color-logo mr-4 swift"></div>
            <span>Swift</span>
          </a>
        </li>
        <li class="mb-0">
          <a class="caption" ng-click="lang='Go'">
            <div class="lang-logo color-logo mr-4 go"></div>
            <span>Go</span>
          </a>
        </li>
        <li class="mb-0">
          <a class="caption" ng-click="lang='.Net/C#'">
            <div class="lang-logo color-logo mr-4 c-sharp"></div>
            <span>.Net/C#</span>
          </a>
        </li>
        <li class="mb-0">
          <a class="caption" ng-click="lang='Perl'">
            <div class="lang-logo color-logo mr-4 perl"></div>
            <span>Perl</span>
          </a>
        </li>
        <li class="mb-0">
          <a class="caption" ng-click="lang='PHP'">
            <div class="lang-logo color-logo mr-4 php"></div>
            <span>PHP</span>
          </a>
        </li>
      </ul>
    </div>
    <button id="copy-btn" type="button" class="btn btn-flat text-light-primary copy-btn" ng-click="copyCode()">
      <i class="fa fa-copy"></i>
    </button>
  </div>

  <!-- PYTHON -->
  <div class="tab-pane code__pane gs-pane" id="python" ng-show="lang==='Python'" ng-cloak>
  <pre class="getting-started-code"><code hlcode="python" class="demo-code-sample">import Algorithmia

input = "YOUR_USERNAME"
client = Algorithmia.client('YOUR_API_KEY')
algo = client.algo('demo/Hello/')
print algo.pipe(input)
  </code></pre>
  <textarea class="copy-text" ng-class="{'code-to-copy': lang === 'Python'}">import Algorithmia

input = "YOUR_USERNAME"
client = Algorithmia.client('YOUR_API_KEY')
algo = client.algo('demo/Hello/')
print algo.pipe(input)
  </textarea>
  </div>

  <!-- JAVA -->
  <div class="tab-pane code__pane gs-pane" id="java" ng-show="lang==='Java'" ng-cloak>
  <pre class="getting-started-code"><code hlcode="java" class="demo-code-sample">import com.algorithmia.*;
import com.algorithmia.algo.*;

String input = "YOUR_USERNAME"
AlgorithmiaClient client = Algorithmia.client("YOUR_API_KEY");
Algorithm algo = client.algo("demo/Hello/");
AlgoResponse result = algo.pipe(input);
System.out.println(result.asJsonString());
  </code></pre>
  <textarea class="copy-text" ng-class="{'code-to-copy': lang === 'Java'}">import com.algorithmia.*;
import com.algorithmia.algo.*;

String input = "YOUR_USERNAME"
AlgorithmiaClient client = Algorithmia.client("YOUR_API_KEY");
Algorithm algo = client.algo("demo/Hello/");
AlgoResponse result = algo.pipe(input);
System.out.println(result.asJsonString());
  </textarea>
  </div>

  <!-- R LANG -->
  <div class="tab-pane code__pane gs-pane" id="rlang" ng-show="lang==='R'" ng-cloak>
  <pre class="getting-started-code"><code hlcode="R" class="demo-code-sample">library(algorithmia)

input <- "YOUR_USERNAME"
client <- getAlgorithmiaClient("YOUR_API_KEY")
algo <- client$algo("demo/Hello/")
result <- algo$pipe(input)$result
print(result)
  </code></pre>
  <textarea class="copy-text" ng-class="{'code-to-copy': lang === 'R'}">library(algorithmia)

input <- "YOUR_USERNAME"
client <- getAlgorithmiaClient("YOUR_API_KEY")
algo <- client$algo("demo/Hello/")
result <- algo$pipe(input)$result
print(result)
  </textarea>
  </div>

  <!-- JAVASCRIPT -->
  <div class="tab-pane code__pane gs-pane" id="javascript" ng-show="lang==='JavaScript'" ng-cloak>
  <pre class="getting-started-code"><code hlcode="js" class="demo-code-sample">var input = "YOUR_USERNAME";
Algorithmia.client("YOUR_API_KEY")
          .algo("demo/Hello/")
          .pipe(input)
          .then(function(output) {
            console.log(output);
          });
  </code></pre>
  <textarea class="copy-text" ng-class="{'code-to-copy': lang === 'JavaScript'}">var input = "YOUR_USERNAME";
Algorithmia.client("YOUR_API_KEY")
          .algo("demo/Hello/")
          .pipe(input)
          .then(function(output) {
            console.log(output);
          });
  </textarea>
  </div>

  <!-- NODE -->
  <div class="tab-pane code__pane gs-pane" id="node" ng-show="lang==='Node'" ng-cloak>
  <pre class="getting-started-code"><code hlcode="js" class="demo-code-sample">var input = "YOUR_USERNAME";
Algorithmia.client("YOUR_API_KEY")
          .algo("algo://demo/Hello/")
          .pipe(input)
          .then(function(response) {
            console.log(response.get());
          });
  </code></pre>
  <textarea class="copy-text" ng-class="{'code-to-copy': lang === 'Node'}">var input = "YOUR_USERNAME";
Algorithmia.client("YOUR_API_KEY")
          .algo("algo://demo/Hello/")
          .pipe(input)
          .then(function(response) {
            console.log(response.get());
          });
  </textarea>
  </div>

  <!-- RUBY -->
  <div class="tab-pane code__pane gs-pane" id="ruby" ng-show="lang==='Ruby'" ng-cloak>
  <pre class="getting-started-code"><code hlcode="ruby" class="demo-code-sample">require 'algorithmia'

input = "YOUR_USERNAME"
client = Algorithmia.client("YOUR_API_KEY")
algo = client.algo("demo/Hello/")
response = algo.pipe(input).result
puts response
  </code></pre>
  <textarea class="copy-text" ng-class="{'code-to-copy': lang === 'Ruby'}">require 'algorithmia'

input = "YOUR_USERNAME"
client = Algorithmia.client("YOUR_API_KEY")
algo = client.algo("demo/Hello/")
response = algo.pipe(input).result
puts response
  </textarea>
  </div>

  <!-- RUST -->
  <div class="tab-pane code__pane gs-pane" id="rust" ng-show="lang==='Rust'" ng-cloak>
  <pre class="getting-started-code"><code hlcode="rust" class="demo-code-sample">use algorithmia::*;

let input = "YOUR_USERNAME";
let client = Algorithmia::client("YOUR_API_KEY");
let algo = client.algo("demo/Hello/");
let response = algo.pipe(input);
println!(response)
  </code></pre>
  <textarea class="copy-text" ng-class="{'code-to-copy': lang === 'Rust'}">use algorithmia::*;

let input = "YOUR_USERNAME";
let client = Algorithmia::client("YOUR_API_KEY");
let algo = client.algo("demo/Hello/");
let response = algo.pipe(input);
println!(response)
  </textarea>
  </div>

  <!-- SCALA -->
  <div class="tab-pane code__pane gs-pane" id="scala" ng-show="lang==='Scala'" ng-cloak>
  <pre class="getting-started-code"><code hlcode="scala" class="demo-code-sample">import com.algorithmia._
import com.algorithmia.algo._

val input = "YOUR_USERNAME"
val client = Algorithmia.client("YOUR_API_KEY")
val algo = client.algo("algo://demo/Hello/")
val result = algo.pipeJson(input)
System.out.println(result.asJsonString)
  </code></pre>
  <textarea class="copy-text" ng-class="{'code-to-copy': lang === 'Scala'}">import com.algorithmia._
import com.algorithmia.algo._

val input = "YOUR_USERNAME"
val client = Algorithmia.client("YOUR_API_KEY")
val algo = client.algo("algo://demo/Hello/")
val result = algo.pipeJson(input)
System.out.println(result.asJsonString)
  </textarea>
  </div>

  <!-- SWIFT -->
  <div class="tab-pane code__pane gs-pane" id="swift" ng-show="lang==='Swift'" ng-cloak>
  <pre class="getting-started-code"><code hlcode="swift" class="demo-code-sample">import Algorithmia

let input = "YOUR_USERNAME";
let client = Algorithmia.client(simpleKey: "YOUR_API_KEY")
let algo = client.algo(algoUri: "demo/Hello/") { resp, error in
  print(resp)
}
  </code></pre>
  <textarea class="copy-text" ng-class="{'code-to-copy': lang === 'Swift'}">import Algorithmia

let input = "YOUR_USERNAME";
let client = Algorithmia.client(simpleKey: "YOUR_API_KEY")
let algo = client.algo(algoUri: "demo/Hello/") { resp, error in
  print(resp)
}
  </textarea>
  </div>

  <!-- CSHARP -->
  <div class="tab-pane code__pane gs-pane" id="csharp" ng-show="lang==='.Net/C#'" ng-cloak>
  <pre class="getting-started-code"><code hlcode="csharp" class="demo-code-sample">using Algorithmia;

var input = "YOUR_USERNAME";
var client = new Client("YOUR_API_KEY");
var algo = client.algo(client, "algo://demo/hello");
var response = algo.pipe&lt;string&gt;(input);
System.Console.WriteLine(response.result.ToString());
  </code></pre>
  <textarea class="copy-text" ng-class="{'code-to-copy': lang === '.Net/C#'}">using Algorithmia;

var input = "YOUR_USERNAME";
var client = new Client("YOUR_API_KEY");
var algo = client.algo(client, "algo://demo/hello");
var response = algo.pipe&lt;string&gt;(input);
System.Console.WriteLine(response.result.ToString());
  </textarea>
  </div>

  <!-- GO -->
  <div class="tab-pane code__pane gs-pane" id="go" ng-show="lang==='Go'" ng-cloak>
  <pre class="getting-started-code"><code hlcode="go" class="demo-code-sample">import (
  algorithmia "github.com/algorithmiaio/algorithmia-go"
)

input := "YOUR_USERNAME"

var client = algorithmia.NewClient("YOUR_API_KEY", "")
algo, _ := client.Algo("algo://demo/Hello/")
resp, _ := algo.Pipe(input)
response := resp.(*algorithmia.AlgoResponse)
fmt.Println(response.Result)
  </code></pre>
  <textarea class="copy-text" ng-class="{'code-to-copy': lang === 'Go'}">import (
  algorithmia "github.com/algorithmiaio/algorithmia-go"
)

input := "YOUR_USERNAME"

var client = algorithmia.NewClient("YOUR_API_KEY", "")
algo, _ := client.Algo("algo://demo/Hello/")
resp, _ := algo.Pipe(input)
response := resp.(*algorithmia.AlgoResponse)
fmt.Println(response.Result)
  </textarea>
  </div>

  <!-- PERL -->
  <div class="tab-pane code__pane gs-pane" id="perl" ng-show="lang==='Perl'" ng-cloak>
  <pre class="getting-started-code"><code hlcode="perl" class="demo-code-sample">use LWP::UserAgent;

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
}
  </code></pre>
  <textarea class="copy-text" ng-class="{'code-to-copy': lang === 'Perl'}">use LWP::UserAgent;

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
}
  </textarea>
  </div>

  <!-- PHP -->
  <div class="tab-pane code__pane gs-pane" id="php" ng-show="lang==='PHP'" ng-cloak>
  <pre class="getting-started-code"><code hlcode="php" class="demo-code-sample">$input = 'YOUR_USERNAME';
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
  }
  </code></pre>
  <textarea class="copy-text" ng-class="{'code-to-copy': lang === 'PHP'}">$input = 'YOUR_USERNAME';
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
  }
  </textarea>
  </div>
</div>
{% endraw %}

## Understanding the response

Each algorithm returns a response in JSON. It will include the `"result"` as well as metadata about the API call you made. The metadata will include the `content_type` as well as a duration.

{% highlight bash lineanchors %}
curl -X POST -d '"YOUR_USERNAME"' -H 'Content-Type: application/json' -H 'Authorization: Simple YOUR_API_KEY' https://api.algorithmia.com/v1/algo/demo/Hello/


{ "result": "Hello YOUR_USERNAME",
  "metadata": {
     "content_type": "text",
     "duration": 0.000187722
  }
}
{% endhighlight%}

The duration is the compute time of the API call into the algorithm. This is the time in seconds between the start of the execution of the algorithm and when it produces a response. Because you are charged on the compute time of the API call, this information will help you optimize your use of the API.

For more thorough tutorials in the language of your choice go back to <a href="{{ site.baseurl }}/clients">Client Guides</a> or if you want more information about pricing, check out our [Pricing Guide]({{ site.baseurl }}/pricing/).
