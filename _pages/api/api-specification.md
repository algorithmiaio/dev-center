---
layout: api_docs_article
title:  "API Specification"
---

The Algorithmia API gives developers the ability to build applications that interact with and use all the features of Algorithmia in an automated fashion. Tasks can be generated, work can be ordered, and your application can be notified as data is processed by Algorithmia.

Requests to the API must be formatted in JSON. We follow the [JSON-RPC 2.0 spec](http://www.jsonrpc.org/specification).

A properly formatted request will always return the HTTP status code `200 OK`; with either a `result` field (which may be null in some cases) for successes or an `error` field to indicate failure.

The size limit for a request is 10MiB. Check out the [Data API]({{site.basurl}}/api/data-api-specification) for options on how to process larger files.

## Call an Algorithm

{% include aside-start.html %}

For each algorithm on the marketplace, you'll find an owner (the user who created the algorithm), an algorithm name, and a version number.
Algorithms are called using this HTTP endpoint:

`POST https://api.algorithmia.com/v1/algo/:owner/:algoname/[:version]`

Specifying a version is recommended, but optional. If not specified, the latest publicly published version will be used.
When explicitly specifying a version, the following following formats are accepted:

Version         | Description
--------------  | --------------
`1.1.1`         | Fully specified version
`1.2.*`         | Specified to the minor level. Will resolve to the latest publicly published version with a minor version of 1.2
`1.*`           | Specified to a major version. Will resolve to the latest publicly published version with major version 1

<div>
  <div class="syn-alert theme-primary syn-body-1">
    To call private versions of an algorithm you own, you must use a fully specified semantic version or a version hash
  </div>
</div>

{% include aside-middle.html %}

<code-sample v-cloak>
<div code-sample-language="Shell">
{% highlight bash %}
curl -X POST -H 'Authorization: Simple YOUR_API_KEY' \
    -d 'YOUR_NAME' -H 'Content-Type: text/plain' \
    https://api.algorithmia.com/v1/algo/demo/Hello/
{% endhighlight %}
</div>

<div code-sample-language="CLI">
{% highlight bash %}
$ algo run -d 'YOUR_NAME' demo/Hello/
Hello YOUR_NAME
{% endhighlight %}
</div>

{% highlight python %}
import Algorithmia

input = "YOUR_NAME"
client = Algorithmia.client('YOUR_API_KEY')
# Pass in the unique algoUrl path found on each algorithm description page.
algo = client.algo('demo/Hello/')
# Calls an algorithm with the input provided.
result = algo.pipe(input)

# If you are using the 1.0+ client you can access both the output and the metadata.
print(result.result)    # Hello YOUR_NAME
print(result.metadata)  # Metadata(content_type='text',duration=0.0002127)
{% endhighlight %}

{% highlight r %}
library(algorithmia)

input <- "YOUR_NAME"
client <- getAlgorithmiaClient('YOUR_API_KEY')
algo <- client$algo('demo/Hello/')
result <- algo$pipe(input)$result
print(result)
{% endhighlight %}

{% highlight ruby %}
require 'algorithmia'

client = Algorithmia.client('YOUR_API_KEY')
algo = client.algo('demo/Hello/')
response = algo.pipe('YOUR_NAME')
puts response.result
{% endhighlight %}

{% highlight java %}
import com.algorithmia.*;
import com.algorithmia.algo.*;

String input = "\"YOUR_NAME\"";
AlgorithmiaClient client = Algorithmia.client("YOUR_API_KEY");
Algorithm algo = client.algo("algo://demo/Hello/");
AlgoResponse result = algo.pipe(input);
System.out.println(result.asJsonString());
{% endhighlight %}

{% highlight scala %}
import com.algorithmia._
import com.algorithmia.algo._

val input = "YOUR_NAME"
val client = Algorithmia.client("YOUR_API_KEY")
val algo = client.algo("algo://demo/Hello/")
val result = algo.pipeJson(input)
System.out.println(result.asString)
{% endhighlight %}

{% highlight rust %}
use algorithmia::*;
use algorithmia::algo::*;

let input = "YOUR_NAME";
let client = Algorithmia::client("YOUR_API_KEY");
let algo = client.algo("algo://demo/Hello/");
{% endhighlight %}

<div code-sample-language="JavaScript">
{% highlight javascript %}
// include the algorithmia.js library
// https://algorithmia.com/v1/clients/js/algorithmia-0.2.0.js

var input = "YOUR_NAME";
Algorithmia.client("YOUR_API_KEY");

client.algo("algo://demo/Hello/")
      .pipe(input)
      .then(function(output) {
        console.log(output);
      });
{% endhighlight %}
</div>

<div code-sample-language="NodeJS">
{% highlight javascript %}
var algorithmia = require("algorithmia");

var input = "YOUR_NAME";
var client = algorithmia.client("YOUR_API_KEY");

client.algo("algo://demo/Hello/")
       .pipe(input)
       .then(function(response) {
         console.log(response.get());
       });
{% endhighlight %}
</div>

{% highlight php %}
<?
require_once "vendor/autoload.php";

$input = "YOUR_NAME";
$client = Algorithmia::client("YOUR_API_KEY");
$algo = $client->algo("demo/Hello/0.1.0");
echo $algo->pipe($input)->result;
?>
{% endhighlight %}
</code-sample>

{% include aside-end.html %}

## Input/Output

Algorithmia supports calling algorithms that use any combination of text, JSON, or binary as their input and output.

Each client SDK provides idiomatic abstractions for calling algorithms
using common native types and automatic serialization and deserialization where reasonable.
See the code samples to the right for examples in the language of your choice.

#### HTTP input specification

To specify input when making a raw HTTP request, the body of the request is the input to the algorithm you are calling.
To specify the input type, set the `Content-Type` header accordingly. These are

Content-Type          | Description
-------------------   | --------------
`application/json`    | body specifies JSON input data (UTF-8 encoded)
`application/text`    | body specifies text input data (UTF-8 encoded)
`application/octet-stream` | body specifies binary input data (raw bytes)

#### HTTP output specification

The `metadata.content_type` specifies which type of encoding the result element is in.

Content-Type | Description
--------------  | --------------
void | The result element is null
text | The result element is a JSON string using UTF-8 encoding
json | The result element is any valid JSON type
binary | The result element is a Base64 encoded binary data in a JSON String

## Query Parameters

The API also provides the following configurable parameters when calling an algorithm:

Parameter             | Description
-------------------   | --------------
timeout               | number: Specifies a timeout for the call in seconds. default=300 (5min), max=3000 (50min)
stdout                | boolean: Indicates algorithm stdout should be returned in the response metadata (ignored unless you are the algorithm owner)
output                | raw|void: Indicates the algorithm

<div class="syn-body-1" markdown="1">
* `timeout={seconds}`
  * Specifies a timeout for the call in seconds
  * The default timeout is 5 minutes
  * The maximum configurable timeout is 50 minutes
  * If the algorithm recursively calls other algorithms, these child calls use the default timeout

* `stdout=true`
  * Returns the stdout that the algorithm produced during the call
  * Will only display if the algorithm author initiates the call

* `output=raw`
  * Returns the result of the algorithm call without the JSON-RPC wrapper
  * If the algorithm returned an error then an HTTP 400 status code will be used

* `output=void`
  * Returns immediately and does not wait for the algorithm to run
  * The result of the algorithm will not be accessible; this is useful in some cases where an algorithm outputs to a `data://` file with a long running time (see [Data API]({{site.basurl}}/api/data-api-specification) for more information)
</div>

## Error Handling

If an error occurs, an Exception will be raised/thrown (Java, Python, PHP, R, Ruby, Rust, Scala) or the response be modified (JavaScript, NodeJS) to contain the following fields:

Field            | Description
--------------   | --------------
error.message    | The error message
error.stacktrace | (Optional) a stacktrace if the error occurred within the algorithm (only if caller has access to algorithm source)

Each client provides a language-specific solution for error handling. The examples on the right
come from calling an algorithm that expects text input in it's implementation of the `apply` entrypoint,
but instead receives a JSON array as input.