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

<img src="{{site.baseurl}}/images/face_detection.png" class="screenshot img-sm">

Each algorithm has an owner and an algorithm name; you'll need both to format your request. This information is listed under the algorithm name on the description page as well as in the format of the algorithm's URL.

For a given user and algorithm name, API calls are made to the following URL:
<div ng-controller="GettingStartedControl" ng-init="setCardContent('YOUR_USERNAME')" class="gs-code-container">
  <div class="code-toolbar ph-16 pv-8 text-right">
    <button type="button" class="btn btn-flat text-light-primary copy-btn" ng-click="copyCode('api')">
      <i class="fa fa-copy"></i>
    </button>
  </div>

  <div class="tab-pane code__pane gs-pane" ng-cloak>
  <pre class="getting-started-code"><code class="demo-code-sample hljs bash">POST https://api.algorithmia.com/v1/algo/:owner/:algoname</code></pre>

  <textarea id="api-copy-text" class="copy-text curl">POST https://api.algorithmia.com/v1/algo/:owner/:algoname</textarea>
  </div>
</div>

We recommend that you also append the algorithm version in your API call to ensure that the correct algorithm is called.

If you want a complete guide on how to navigate an algorithm's description page including how to determine the price of calling an algorithm, check out our [Algorithm Profiles]({{site.baseurl}}/basics/algorithm-profiles) guide.
{: .notice-info}

## Making your first API call

We'll make our first call with the demo algorithm ["Hello"](/algorithms/demo/Hello). This algorithm takes an input of a string (preferably your name!) and returns a greeting addressed to the input.

<div ng-controller="GettingStartedControl" ng-init="setCardContent('YOUR_USERNAME')" class="gs-code-container">
  <div class="code-toolbar ph-16 pv-8 text-right">
    <button type="button" class="btn btn-flat text-light-primary copy-btn" ng-click="copyCode('curl')">
      <i class="fa fa-copy"></i>
    </button>
  </div>

  <!-- CURL -->
  <!-- Here and below we use the markdown produced by hljs so that we can add the js/css needed for the cards that appear when hovering over username/api key -->
  <div class="tab-pane code__pane gs-pane" ng-cloak>
  <pre class="getting-started-code"><code class="demo-code-sample hljs bash">curl -X POST <span class="hljs-_">-d</span> <span class="hljs-string">'"<span class="hover-info">YOUR_USERNAME<div class="hover-content card pa-16" ng-bind-html="cardContent"></div></span>"'</span> -H <span class="hljs-string">'Content-Type: application/json'</span> -H <span class="hljs-string">'Authorization: Simple <span class="hover-info">YOUR_API_KEY<div class="hover-content card pa-16" ng-bind-html="cardContent"></div></span>'</span> https://api.algorithmia.com/v1/algo/demo/Hello/</code></pre>

  <textarea id="curl-copy-text" class="copy-text curl">curl -X POST -d '"YOUR_USERNAME"' -H 'Content-Type: application/json' -H 'Authorization: Simple YOUR_API_KEY' https://api.algorithmia.com/v1/algo/demo/Hello/</textarea>
  </div>
</div>

If you aren't logged in, make sure to replace <code>YOUR&lowbar;USERNAME</code> with your name & <code>YOUR&lowbar;API&lowbar;KEY</code> with your API key.
{: .notice-warning}

You can also use one of the clients to make your call. See below for examples or visit one of the [Client Guides]({{site.baseurl}}/clients) for details on how to call algorithms and work with data in your language of choice.

{% raw %}
<div ng-controller="GettingStartedControl" ng-init="setCardContent('YOUR_USERNAME')" class="gs-code-container">
  <div class="code-toolbar ph-16 pv-8">
    <div class="btn-group dropdown">
      <button type="button" class="btn btn-default dropdown-toggle gs-dropdown pa-0" data-toggle="dropdown">
        <div class="lang-logo white-logo mr-4" ng-class="lang"></div>
        <span ng-bind="languages[lang]" class="mr-4"></span>
        <span class="caret"></span>
      </button>
      <ul class="dropdown-menu gs-languages pv-4" role="menu">
        <li ng-repeat="(language, displayName) in languages" class="mb-0">
          <a class="caption" ng-click="setLang(language)">
            <div class="lang-logo color-logo mr-4" ng-class="language"></div>
            <span ng-bind="displayName"></span>
          </a>
        </li>
      </ul>
    </div>
    <button type="button" class="btn btn-flat text-light-primary copy-btn" ng-click="copyCode(lang)">
      <i class="fa fa-copy"></i>
    </button>
  </div>

  <!-- PYTHON -->
  <div class="tab-pane code__pane gs-pane" id="python" ng-show="lang==='python'" ng-cloak>
  <pre class="getting-started-code"><code class="demo-code-sample hljs python"><span class="hljs-keyword">import</span> Algorithmia
input = <span class="hljs-string">"<span class="hover-info">YOUR_USERNAME<div class="hover-content card pa-16" ng-bind-html="cardContent"></div></span>"</span>
client = Algorithmia.client(<span class="hljs-string">'<span class="hover-info">YOUR_API_KEY<div class="hover-content card pa-16" ng-bind-html="cardContent"></div></span>'</span>)
algo = client.algo(<span class="hljs-string">'demo/Hello/'</span>)
<span class="hljs-keyword">print</span>(algo.pipe(input))</code></pre>
  <textarea id="python-copy-text" class="copy-text">import Algorithmia

input = "YOUR_USERNAME"
client = Algorithmia.client('YOUR_API_KEY')
algo = client.algo('demo/Hello/')
print algo.pipe(input)</textarea>
  </div>

  <!-- JAVA -->
  <div class="tab-pane code__pane gs-pane" id="java" ng-show="lang==='java'" ng-cloak>
  <pre class="getting-started-code"><code class="demo-code-sample hljs java"><span class="hljs-keyword">import</span> com.algorithmia.*;
<span class="hljs-keyword">import</span> com.algorithmia.algo.*;

String input = <span class="hljs-string">"<span class="hover-info">YOUR_USERNAME<div class="hover-content card pa-16" ng-bind-html="cardContent"></div></span>"</span>
AlgorithmiaClient client = Algorithmia.client(<span class="hljs-string">"<span class="hover-info">YOUR_API_KEY<div class="hover-content card pa-16" ng-bind-html="cardContent"></div></span>"</span>);
Algorithm algo = client.algo(<span class="hljs-string">"demo/Hello/"</span>);
AlgoResponse result = algo.pipe(input);
System.out.println(result.asJsonString());</code></pre>
  <textarea class="copy-text" id="java-copy-text">import com.algorithmia.*;
import com.algorithmia.algo.*;

String input = "YOUR_USERNAME"
AlgorithmiaClient client = Algorithmia.client("YOUR_API_KEY");
Algorithm algo = client.algo("demo/Hello/");
AlgoResponse result = algo.pipe(input);
System.out.println(result.asJsonString());</textarea>
  </div>

  <!-- R LANG -->
  <div class="tab-pane code__pane gs-pane" id="rlang" ng-show="lang==='rlang'" ng-cloak>
  <pre class="getting-started-code"><code class="demo-code-sample hljs R"><span class="hljs-keyword">library</span>(algorithmia)

input &lt;- <span class="hljs-string">"<span class="hover-info">YOUR_USERNAME<div class="hover-content card pa-16" ng-bind-html="cardContent"></div></span>"</span>
client &lt;- getAlgorithmiaClient(<span class="hljs-string">"<span class="hover-info">YOUR_API_KEY<div class="hover-content card pa-16" ng-bind-html="cardContent"></div></span>"</span>)
algo &lt;- client$algo(<span class="hljs-string">"demo/Hello/"</span>)
result &lt;- algo$pipe(input)$result
print(result)</code></pre>
  <textarea class="copy-text" id="rlang-copy-text">library(algorithmia)

input <- "YOUR_USERNAME"
client <- getAlgorithmiaClient("YOUR_API_KEY")
algo <- client$algo("demo/Hello/")
result <- algo$pipe(input)$result
print(result)</textarea>
  </div>

  <!-- JAVASCRIPT -->
  <div class="tab-pane code__pane gs-pane" id="javascript" ng-show="lang==='javascript'" ng-cloak>
  <pre class="getting-started-code"><code class="demo-code-sample hljs js"><span class="hljs-keyword">var</span> input = <span class="hljs-string">"<span class="hover-info">YOUR_USERNAME<div class="hover-content card pa-16" ng-bind-html="cardContent"></div></span>"</span>;
Algorithmia.client(<span class="hljs-string">"<span class="hover-info">YOUR_API_KEY<div class="hover-content card pa-16" ng-bind-html="cardContent"></div></span>"</span>)
          .algo(<span class="hljs-string">"demo/Hello/"</span>)
          .pipe(input)
          .then(<span class="hljs-function"><span class="hljs-keyword">function</span>(<span class="hljs-params">output</span>) </span>{
            <span class="hljs-built_in">console</span>.log(output);
          });</code></pre>
  <textarea class="copy-text" id="javascript-copy-text">var input = "YOUR_USERNAME";
Algorithmia.client("YOUR_API_KEY")
          .algo("demo/Hello/")
          .pipe(input)
          .then(function(output) {
            console.log(output);
          });</textarea>
  </div>

  <!-- NODE -->
  <div class="tab-pane code__pane gs-pane" id="node" ng-show="lang==='node'" ng-cloak>
  <pre class="getting-started-code"><code class="demo-code-sample hljs js"><span class="hljs-keyword">var</span> input = <span class="hljs-string">"<span class="hover-info">YOUR_USERNAME<div class="hover-content card pa-16" ng-bind-html="cardContent"></div></span>"</span>;
Algorithmia.client(<span class="hljs-string">"<span class="hover-info">YOUR_API_KEY<div class="hover-content card pa-16" ng-bind-html="cardContent"></div></span>"</span>)
          .algo(<span class="hljs-string">"algo://demo/Hello/"</span>)
          .pipe(input)
          .then(<span class="hljs-function"><span class="hljs-keyword">function</span>(<span class="hljs-params">response</span>) </span>{
            <span class="hljs-built_in">console</span>.log(response.get());
          });</code></pre>
  <textarea class="copy-text" id="node-copy-text">var input = "YOUR_USERNAME";
Algorithmia.client("YOUR_API_KEY")
          .algo("algo://demo/Hello/")
          .pipe(input)
          .then(function(response) {
            console.log(response.get());
          });</textarea>
  </div>

  <!-- RUBY -->
  <div class="tab-pane code__pane gs-pane" id="ruby" ng-show="lang==='ruby'" ng-cloak>
  <pre class="getting-started-code"><code class="demo-code-sample hljs ruby"><span class="hljs-keyword">require</span> <span class="hljs-string">'algorithmia'</span>

input = <span class="hljs-string">"<span class="hover-info">YOUR_USERNAME<div class="hover-content card pa-16" ng-bind-html="cardContent"></div></span>"</span>
client = Algorithmia.client(<span class="hljs-string">"<span class="hover-info">YOUR_API_KEY<div class="hover-content card pa-16" ng-bind-html="cardContent"></div></span>"</span>)
algo = client.algo(<span class="hljs-string">"demo/Hello/"</span>)
response = algo.pipe(input).result
puts response</code></pre>
  <textarea class="copy-text" id="ruby-copy-text">require 'algorithmia'

input = "YOUR_USERNAME"
client = Algorithmia.client("YOUR_API_KEY")
algo = client.algo("demo/Hello/")
response = algo.pipe(input).result
puts response</textarea>
  </div>

  <!-- RUST -->
  <div class="tab-pane code__pane gs-pane" id="rust" ng-show="lang==='rust'" ng-cloak>
  <pre class="getting-started-code"><code class="demo-code-sample hljs rust"><span class="hljs-keyword">use</span> algorithmia::*;

<span class="hljs-keyword">let</span> input = <span class="hljs-string">"<span class="hover-info">YOUR_USERNAME<div class="hover-content card pa-16" ng-bind-html="cardContent"></div></span>"</span>;
<span class="hljs-keyword">let</span> client = Algorithmia::client(<span class="hljs-string">"<span class="hover-info">YOUR_API_KEY<div class="hover-content card pa-16" ng-bind-html="cardContent"></div></span>"</span>);
<span class="hljs-keyword">let</span> algo = client.algo(<span class="hljs-string">"demo/Hello/"</span>);
<span class="hljs-keyword">let</span> response = algo.pipe(input);
<span class="hljs-built_in">println!</span>(response)</code></pre>
  <textarea class="copy-text" id="rust-copy-text">use algorithmia::*;

let input = "YOUR_USERNAME";
let client = Algorithmia::client("YOUR_API_KEY");
let algo = client.algo("demo/Hello/");
let response = algo.pipe(input);
println!(response)</textarea>
  </div>

  <!-- SCALA -->
  <div class="tab-pane code__pane gs-pane" id="scala" ng-show="lang==='scala'" ng-cloak>
  <pre class="getting-started-code"><code class="demo-code-sample hljs scala"><span class="hljs-keyword">import</span> com.algorithmia._
<span class="hljs-keyword">import</span> com.algorithmia.algo._

<span class="hljs-keyword">val</span> input = <span class="hljs-string">"<span class="hover-info">YOUR_USERNAME<div class="hover-content card pa-16" ng-bind-html="cardContent"></div></span>"</span>
<span class="hljs-keyword">val</span> client = <span class="hljs-type">Algorithmia</span>.client(<span class="hljs-string">"<span class="hover-info">YOUR_API_KEY<div class="hover-content card pa-16" ng-bind-html="cardContent"></div></span>"</span>)
<span class="hljs-keyword">val</span> algo = client.algo(<span class="hljs-string">"algo://demo/Hello/"</span>)
<span class="hljs-keyword">val</span> result = algo.pipeJson(input)
<span class="hljs-type">System</span>.out.println(result.asString)</code></pre>
  <textarea class="copy-text" id="scala-copy-text">import com.algorithmia._
import com.algorithmia.algo._

val input = "YOUR_USERNAME"
val client = Algorithmia.client("YOUR_API_KEY")
val algo = client.algo("algo://demo/Hello/")
val result = algo.pipeJson(input)
System.out.println(result.asJsonString)</textarea>
  </div>

  <!-- SWIFT -->
  <div class="tab-pane code__pane gs-pane" id="swift" ng-show="lang==='swift'" ng-cloak>
  <pre class="getting-started-code"><code class="demo-code-sample hljs swift"><span class="hljs-keyword">import</span> Algorithmia

<span class="hljs-keyword">let</span> input = <span class="hljs-string">"<span class="hover-info">YOUR_USERNAME<div class="hover-content card pa-16" ng-bind-html="cardContent"></div></span>"</span>;
<span class="hljs-keyword">let</span> client = <span class="hljs-type">Algorithmia</span>.client(simpleKey: <span class="hljs-string">"<span class="hover-info">YOUR_API_KEY<div class="hover-content card pa-16" ng-bind-html="cardContent"></div></span>"</span>)
<span class="hljs-keyword">let</span> algo = client.algo(algoUri: <span class="hljs-string">"demo/Hello/"</span>) { resp, error <span class="hljs-keyword">in</span>
  <span class="hljs-built_in">print</span>(resp)
}</code></pre>
  <textarea class="copy-text" id="swift-copy-text">import Algorithmia

let input = "YOUR_USERNAME";
let client = Algorithmia.client(simpleKey: "YOUR_API_KEY")
let algo = client.algo(algoUri: "demo/Hello/") { resp, error in
  print(resp)
}</textarea>
  </div>

  <!-- CSHARP -->
  <div class="tab-pane code__pane gs-pane" id="c-sharp" ng-show="lang==='c-sharp'" ng-cloak>
  <pre class="getting-started-code"><code class="demo-code-sample hljs csharp"><span class="hljs-keyword">using</span> Algorithmia;

<span class="hljs-keyword">var</span> input = <span class="hljs-string">"<span class="hover-info">YOUR_USERNAME<div class="hover-content card pa-16" ng-bind-html="cardContent"></div></span>"</span>;
<span class="hljs-keyword">var</span> client = <span class="hljs-keyword">new</span> Client(<span class="hljs-string">"<span class="hover-info">YOUR_API_KEY<div class="hover-content card pa-16" ng-bind-html="cardContent"></div></span>"</span>);
<span class="hljs-keyword">var</span> algo = client.algo(client, <span class="hljs-string">"algo://demo/hello"</span>);
<span class="hljs-keyword">var</span> response = algo.pipe&lt;<span class="hljs-keyword">string</span>&gt;(input);
System.Console.WriteLine(response.result.ToString());</code></pre>
  <textarea class="copy-text" id="c-sharp-copy-text">using Algorithmia;

var input = "YOUR_USERNAME";
var client = new Client("YOUR_API_KEY");
var algo = client.algo(client, "algo://demo/hello");
var response = algo.pipe&lt;string&gt;(input);
System.Console.WriteLine(response.result.ToString());</textarea>
  </div>

  <!-- GO -->
  <div class="tab-pane code__pane gs-pane" id="go" ng-show="lang==='go'" ng-cloak>
  <pre class="getting-started-code"><code class="demo-code-sample hljs go"><span class="hljs-keyword">import</span> (
  algorithmia <span class="hljs-string">"github.com/algorithmiaio/algorithmia-go"</span>
)

input := <span class="hljs-string">"<span class="hover-info">YOUR_USERNAME<div class="hover-content card pa-16" ng-bind-html="cardContent"></div></span>"</span>

<span class="hljs-keyword">var</span> client = algorithmia.NewClient(<span class="hljs-string">"<span class="hover-info">YOUR_API_KEY<div class="hover-content card pa-16" ng-bind-html="cardContent"></div></span>"</span>, <span class="hljs-string">""</span>)
algo, _ := client.Algo(<span class="hljs-string">"algo://demo/Hello/"</span>)
resp, _ := algo.Pipe(input)
response := resp.(*algorithmia.AlgoResponse)
fmt.Println(response.Result)</code></pre>
  <textarea class="copy-text" id="go-copy-text">import (
  algorithmia "github.com/algorithmiaio/algorithmia-go"
)

input := "YOUR_USERNAME"

var client = algorithmia.NewClient("YOUR_API_KEY", "")
algo, _ := client.Algo("algo://demo/Hello/")
resp, _ := algo.Pipe(input)
response := resp.(*algorithmia.AlgoResponse)
fmt.Println(response.Result)</textarea>
  </div>

  <!-- PERL -->
  <div class="tab-pane code__pane gs-pane" id="perl" ng-show="lang==='perl'" ng-cloak>
  <pre class="getting-started-code"><code class="demo-code-sample hljs perl"><span class="hljs-keyword">use</span> LWP::UserAgent;

<span class="hljs-keyword">my</span> $input = <span class="hljs-string">'<span class="hover-info">YOUR_USERNAME<div class="hover-content card pa-16" ng-bind-html="cardContent"></div></span>'</span>;
<span class="hljs-keyword">my</span> $api_key = <span class="hljs-string">'<span class="hover-info">YOUR_API_KEY<div class="hover-content card pa-16" ng-bind-html="cardContent"></div></span>'</span>;
<span class="hljs-keyword">my</span> $req = HTTP::Request-&gt;new(<span class="hljs-string">POST =&gt;</span> <span class="hljs-string">'http://api.algorithmia.com/v1/algo/demo/hello'</span>);
$req-&gt;header(<span class="hljs-string">'content-type'</span> =&gt; <span class="hljs-string">'application/json'</span>);
$req-&gt;header(<span class="hljs-string">'Authorization'</span> =&gt; <span class="hljs-string">'Simple '</span>.$api_key);
$req-&gt;content($post_data);
<span class="hljs-keyword">my</span> $ua = LWP::UserAgent-&gt;new;
<span class="hljs-keyword">my</span> $resp = $ua-&gt;request($req);
<span class="hljs-keyword">if</span> ($resp-&gt;is_success) {
    <span class="hljs-keyword">print</span> $resp-&gt;decoded_content;
} <span class="hljs-keyword">else</span> {
    <span class="hljs-keyword">print</span> <span class="hljs-string">'POST error: '</span>, $resp-&gt;code, <span class="hljs-string">': '</span>, $resp-&gt;message;
}</code></pre>
  <textarea class="copy-text" id="perl-copy-text">use LWP::UserAgent;

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
}</textarea>
  </div>

  <!-- PHP -->
  <div class="tab-pane code__pane gs-pane" id="php" ng-show="lang==='php'" ng-cloak>
  <pre class="getting-started-code"><code class="demo-code-sample hljs php">$input = <span class="hljs-string">'<span class="hover-info">YOUR_USERNAME<div class="hover-content card pa-16" ng-bind-html="cardContent"></div></span>'</span>;
$api_key = <span class="hljs-string">'<span class="hover-info">YOUR_API_KEY<div class="hover-content card pa-16" ng-bind-html="cardContent"></div></span>'</span>;
$data_json = json_encode($input);
$ch = curl_init();
  curl_setopt_array($ch, <span class="hljs-keyword">array</span>(
    CURLOPT_URL =&gt; <span class="hljs-string">'https://api.algorithmia.com/v1/algo/demo/hello'</span>,
    CURLOPT_HTTPHEADER =&gt; <span class="hljs-keyword">array</span>(
      <span class="hljs-string">'Content-Type: application/json'</span>,
      <span class="hljs-string">'Authorization: Simple '</span> . $api_key,
      <span class="hljs-string">'Content-Length: '</span> . strlen($data_json)
    ),
    CURLOPT_POSTFIELDS =&gt; $data_json,
    CURLOPT_RETURNTRANSFER =&gt; <span class="hljs-keyword">true</span>,
    CURLOPT_POST =&gt; <span class="hljs-keyword">true</span>
  ));
  $response_json = curl_exec($ch);
  curl_close($ch);
  $response = json_decode($response_json);
  <span class="hljs-keyword">if</span>($response-&gt;error) {
    <span class="hljs-keyword">print</span>(<span class="hljs-string">'ERROR: '</span>);
    print_r($response-&gt;error);
  } <span class="hljs-keyword">else</span> {
    print_r($response-&gt;result);
  }</code></pre>
  <textarea class="copy-text" id="php-copy-text">$input = 'YOUR_USERNAME';
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
  }</textarea>
  </div>
</div>
{% endraw %}

## Understanding the response

Each algorithm returns a response in JSON. It will include the `"result"` as well as metadata about the API call you made. The metadata will include the `content_type` as well as a duration.

<div ng-controller="GettingStartedControl" ng-init="setCardContent('YOUR_USERNAME')" class="gs-code-container">
  <div class="code-toolbar ph-16 pv-8 text-right">
    <button type="button" class="btn btn-flat text-light-primary copy-btn" ng-click="copyCode('result')">
      <i class="fa fa-copy"></i>
    </button>
  </div>

  <!-- CURL RESULT -->
  <div class="tab-pane code__pane gs-pane" ng-cloak>
  <pre class="getting-started-code"><code class="demo-code-sample hljs bash">curl -X POST <span class="hljs-_">-d</span> <span class="hljs-string">'"<span class="hover-info">YOUR_USERNAME<div class="hover-content card pa-16" ng-bind-html="cardContent"></div></span>"'</span> -H <span class="hljs-string">'Content-Type: application/json'</span> -H <span class="hljs-string">'Authorization: Simple <span class="hover-info">YOUR_API_KEY<div class="hover-content card pa-16" ng-bind-html="cardContent"></div></span>'</span> https://api.algorithmia.com/v1/algo/demo/Hello/

{
  <span class="hljs-string">"result"</span>: <span class="hljs-string">"Hello <span class="hover-info">YOUR_USERNAME<div class="hover-content card pa-16" ng-bind-html="cardContent"></div></span>"</span>,
  <span class="hljs-string">"metadata"</span>: {
     <span class="hljs-string">"content_type"</span>: <span class="hljs-string">"text"</span>,
     <span class="hljs-string">"duration"</span>: 0.000187722
  }
}</code></pre>

  <textarea id="result-copy-text" class="copy-text curl">curl -X POST -d '"YOUR_USERNAME"' -H 'Content-Type: application/json' -H 'Authorization: Simple YOUR_API_KEY' https://api.algorithmia.com/v1/algo/demo/Hello/

{
  "result": "Hello YOUR_USERNAME",
  "metadata": {
     "content_type": "text",
     "duration": 0.000187722
  }
}</textarea>
  </div>
</div>

The duration is the compute time of the API call into the algorithm. This is the time in seconds between the start of the execution of the algorithm and when it produces a response. Because you are charged on the compute time of the API call, this information will help you optimize your use of the API.

For more thorough tutorials in the language of your choice go back to <a href="{{site.baseurl}}/clients">Client Guides</a> or if you want more information about pricing, check out our [Pricing Guide]({{site.baseurl}}/pricing).
