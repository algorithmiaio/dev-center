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

<code class="syn-text-break-word">
  POST https://api.algorithmia.com/v1/algo/:owner/:algoname/[:version]
</code>

Specifying a version is recommended, but optional. If not specified, the latest publicly published version will be used.
When explicitly specifying a version, the following following formats are accepted:

<div class="syn-table-container" markdown="1">

Version         | Description
--------------  | --------------
`1.1.1`         | Fully specified version
`1.2.*`         | Specified to the minor level. Will resolve to the latest publicly published version with a minor version of 1.2
`1.*`           | Specified to a major version. Will resolve to the latest publicly published version with major version 1

</div>

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

<div code-sample-language="Node">
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
<div class="syn-caption syn-mt-4">
  Make sure to replace YOUR_NAME with your name &amp; YOUR_API_KEY with your API key.
</div>
</code-sample>

{% include aside-end.html %}

## Input/Output

{% include aside-start.html %}

Algorithmia supports calling algorithms that use any combination of text, JSON, or binary as their input and output.

Each client SDK provides idiomatic abstractions for calling algorithms
using common native types and automatic serialization and deserialization where reasonable.
See the code samples to the right for examples in the language of your choice.

#### HTTP input specification

To specify input when making a raw HTTP request, the body of the request is the input to the algorithm you are calling.
To specify the input type, set the `Content-Type` header accordingly. These are

<div class="syn-table-container" markdown="1">

Content-Type          | Description
-------------------   | --------------
`application/json`    | body specifies JSON input data (UTF-8 encoded)
`application/text`    | body specifies text input data (UTF-8 encoded)
`application/octet-stream` | body specifies binary input data (raw bytes)

</div>

#### HTTP output specification

The `metadata.content_type` specifies which type of encoding the result element is in.

<div class="syn-table-container" markdown="1">

Content-Type | Description
--------------  | --------------
void | The result element is null
text | The result element is a JSON string using UTF-8 encoding
json | The result element is any valid JSON type
binary | The result element is a Base64 encoded binary data in a JSON String

</div>

{% include aside-middle.html %}

<code-sample v-cloak title="Text Input/Output" class="syn-mb-16">
<div code-sample-language="Shell">
{% highlight bash %}
curl -X POST -H 'Authorization: Simple YOUR_API_KEY' \
    -d 'HAL 9000' -H 'Content-Type: text/plain' \
    https://api.algorithmia.com/v1/algo/demo/Hello/

-> {
    "result":"Hello HAL 9000",
    "metadata":{"content_type":"text","duration":0.034232617}
}
{% endhighlight %}
</div>

<div code-sample-language="CLI">
{% highlight bash %}
$ algo run demo/Hello/ -d 'HAL 9000'
Hello HAL 9000
{% endhighlight %}
</div>

{% highlight python %}
algo = client.algo('demo/Hello/')
print(algo.pipe("HAL 9000").result)
# -> Hello HAL 9000
{% endhighlight %}

{% highlight r %}
algo <- client$algo('demo/Hello/')
print(algo$pipe("HAL 9000")$result)
# -> Hello HAL 9000
{% endhighlight %}

{% highlight ruby %}
algo = client.algo('demo/Hello/')
puts algo.pipe('HAL 9000').result
# -> Hello HAL 900
{% endhighlight %}

{% highlight java %}
Algorithm algo = client.algo("algo://demo/Hello/");
AlgoResponse result = algo.pipe("HAL 9000");
System.out.println(result.asString());
// -> Hello HAL 9000
{% endhighlight %}

{% highlight scala %}
val algo = client.algo("algo://demo/Hello/")
val result = algo.pipe("HAL 9000")
System.out.println(result.asString)
// -> Hello HAL 9000
{% endhighlight %}

{% highlight rust %}
let algo = client.algo("algo://demo/Hello/");
let response = algo.pipe("HAL 9000").unwrap();
println!("{}", response.as_string().unwrap());
{% endhighlight %}

<div code-sample-language="JavaScript">
{% highlight javascript %}
client.algo("algo://demo/Hello/")
      .pipe("HAL 9000")
      .then(function(output) {
        console.log(output.result);
      });
// -> Hello HAL 9000
{% endhighlight %}
</div>

<div code-sample-language="Node">
{% highlight javascript %}
client.algo("algo://demo/Hello/")
      .pipe("HAL 9000")
      .then(function(response) {
        console.log(response.get());
      });
// -> Hello HAL 9000
{% endhighlight %}
</div>

{% highlight php %}
<?
$algo = $client->algo("demo/Hello/0.1.0");
echo $algo->pipe("HAL 9000")->result;
// -> Hello HAL 9000
?>
{% endhighlight %}
</code-sample>

<code-sample v-cloak title="JSON Input/Output (including serialized objects/arrays)" class="syn-mb-16">
<div code-sample-language="Shell">
{% highlight bash %}
curl -X POST -H 'Authorization: Simple YOUR_API_KEY' \
    -H 'Content-Type: application/json' \
    -d '["transformer", "terraforms", "retransform"]' \
    https://api.algorithmia.com/v1/algo/WebPredict/ListAnagrams/0.1

-> {
    "result": ["transformer","retransform"],
    "metadata":{"content_type":"json","duration":0.039351226}
}
{% endhighlight %}
</div>

<div code-sample-language="CLI">
{% highlight bash %}
# -d automatically detects if input is valid JSON
$ algo run WebPredict/ListAnagrams/0.1 \
    -d '["transformer", "terraforms", "retransform"]'
["transformer","retransform"]
{% endhighlight %}
</div>

{% highlight python %}
algo = client.algo('WebPredict/ListAnagrams/0.1.0')
result = algo.pipe(["transformer", "terraforms", "retransform"]).result
# -> ["transformer","retransform"]
{% endhighlight %}

{% highlight r %}
algo <- client$algo('WebPredict/ListAnagrams/0.1.0')
result <- algo$pipe(["transformer", "terraforms", "retransform"])$result
# Returns a list in R
[[1]]
[1] "transformer"

[[2]]
[1] "retransform"
{% endhighlight %}

{% highlight ruby %}
algo = client.algo('WebPredict/ListAnagrams/0.1.0')
result = algo.pipe(["transformer", "terraforms", "retransform"]).result
# -> ["transformer","retransform"]
{% endhighlight %}

{% highlight java %}
Algorithm algo = client.algo("algo://WebPredict/ListAnagrams/0.1.0");
List<String> words = Arrays.asList(("transformer", "terraforms", "retransform");
AlgoResponse result = algo.pipe(words);
// WebPredict/ListAnagrams returns an array of strings, so cast the result:
List<String> anagrams = result.as(new TypeToken<List<String>>(){});
// -> List("transformer", "retransform")

// Or using raw JSON
String jsonWords = "[\"transformer\", \"terraforms\", \"retransform\"]"
AlgoResponse result2 = algo.pipeJson(jsonWords);
String anagrams = result2.asJsonString();
// -> "[\"transformer\", \"retransform\"]"
{% endhighlight %}

{% highlight scala %}
val algo = client.algo("algo://WebPredict/ListAnagrams/0.1.0")
val result = algo.pipe(List("transformer", "terraforms", "retransform"))
// WebPredict/ListAnagrams returns an array of strings, so cast the result:
val anagrams = result.as(new TypeToken<List<String>>(){})
// -> List("transformer", "retransform")

// Or using raw JSON
val result2 = algo.pipeJson("""["transformer", "terraforms", "retransform"]""")
String anagrams = result.asString;
// -> "[\"transformer\", \"retransform\"]"
{% endhighlight %}

{% highlight rust %}
let algo = client.algo("algo://WebPredict/ListAnagrams/0.1.0");
let response = algo.pipe(vec!["transformer", "terraforms", "retransform"]).unwrap();
let output: Vec<String> = response.decode().unwrap();
// -> ["transformer", "retransform"] as Vec<String>

// Or working with raw JSON
let response2 = algo.pipe_json(r#"["transformer", "terraforms", "retransform"]"#).unwrap();
let output = response2.as_json().unwrap().to_string();
// -> "[\"transformer\", \"retransform\"]"
{% endhighlight %}

<div code-sample-language="JavaScript">
{% highlight javascript %}
client.algo("algo://WebPredict/ListAnagrams/0.1.0")
      .pipe(["transformer", "terraforms", "retransform"])
      .then(function(output) {
        console.log(output.result);
        // -> ["transformer","retransform"]
      });

// Or using raw JSON
client.algo("algo://WebPredict/ListAnagrams/0.1.0")
      .pipeJson('["transformer", "terraforms", "retransform"]')
      .then(function(output) {
        console.log(output.result);
        // -> ["transformer","retransform"]
      });
{% endhighlight %}
</div>

<div code-sample-language="Node">
{% highlight javascript %}
client.algo("algo://WebPredict/ListAnagrams/0.1.0")
      .pipe(["transformer", "terraforms", "retransform"])
      .then(function(response) {
        console.log(response.get());
        // -> ["transformer","retransform"]
      });

// Or using raw JSON
client.algo("algo://WebPredict/ListAnagrams/0.1.0")
      .pipeJson('["transformer", "terraforms", "retransform"]')
      .then(function(response) {
        console.log(response.get());
        // -> ["transformer","retransform"]
      });
{% endhighlight %}
</div>

{% highlight php %}
<?
$algo = $client->algo("algo://WebPredict/ListAnagrams/0.1.0");
print_r($algo->pipe(["transformer", "terraforms", "retransform"])->result);
?>
{% endhighlight %}
</code-sample>

<code-sample v-cloak title="Binary Input/Output">
<div code-sample-language="Shell">
{% highlight bash %}
# Save output to bender_thumb.png since consoles don't handle printing binary well
curl -X POST -H 'Authorization: Simple YOUR_API_KEY' \
    -H 'Content-Type: application/octet-stream' \
    --data-binary @bender.jpg \
    -o bender_thumb.png \
    https://api.algorithmia.com/v1/algo/opencv/SmartThumbnail/0.1
{% endhighlight %}
</div>

<div code-sample-language="CLI">
{% highlight bash %}
# -D reads input from a file
# -o saves output to a file since consoles don't print binary well
$ algo run opencv/SmartThumbnail/0.1 -D bender.jpg -o bender_thumb.png
Completed in 1.1 seconds
{% endhighlight %}
</div>

{% highlight python %}
input = bytearray(open("/path/to/bender.png", "rb").read())
result = client.algo("opencv/SmartThumbnail/0.1").pipe(input).result
# -> [binary byte sequence]
{% endhighlight %}

{% highlight r %}
algo <- client$algo("opencv/SmartThumbnail/0.1")
response <- algo$pipe(input)$result
# -> [raw vector]
{% endhighlight %}

{% highlight ruby %}
input = File.binread("/path/to/bender.png")
result = client.algo("opencv/SmartThumbnail/0.1").pipe(input).result
# -> [ASCII-8BIT string of binary data]
{% endhighlight %}

{% highlight java %}
byte[] input = Files.readAllBytes(new File("/path/to/bender.jpg").toPath());
AlgoResponse result = client.algo("opencv/SmartThumbnail/0.1").pipe(input);
byte[] buffer = result.as(new TypeToken<byte[]>(){});
// -> [byte array]
{% endhighlight %}

{% highlight scala %}
let input = Files.readAllBytes(new File("/path/to/bender.jpg").toPath())
let result = client.algo("opencv/SmartThumbnail/0.1").pipe(input)
let buffer = result.as(new TypeToken<byte[]>(){})
// -> [byte array]
{% endhighlight %}

{% highlight rust %}
let mut input = Vec::new();
File::open("/path/to/bender.jpg").read_to_end(&mut input);
let response = client.algo("opencv/SmartThumbnail/0.1").pipe(&input).unwrap();
let output = response.as_bytes().unwrap();
// -> Vec<u8>
{% endhighlight %}

<div code-sample-language="JavaScript">
{% highlight javascript %}
/*
  Support for binary I/O in the javascript client is planned.
  Contact us if you need this feature, and we'll prioritize it right away:
  https://algorithmia.com/contact

  Note: The NodeJS client does currently support binary I/O.
*/
{% endhighlight %}
</div>

<div code-sample-language="Node">
{% highlight javascript %}
var buffer = fs.readFileSync("/path/to/bender.jpg");
client.algo("opencv/SmartThumbnail")
    .pipe(buffer)
    .then(function(response) {
        var buffer = response.get();
        // -> Buffer(...)
    });
{% endhighlight %}
</div>

{% highlight php %}
<?
$algo = $client->algo("opencv/SmartThumbnail/0.1");
$input = new Algorithmia\ByteArray(file_get_contents("/path/to/myimage.png"));
print_r($algo->pipe($input)->result);
// -> [binary byte sequence]
?>
{% endhighlight %}
</code-sample>

{% include aside-end.html %}

## Query Parameters

{% include aside-start.html %}

The API also provides the following configurable parameters when calling an algorithm:

<div class="syn-table-container" markdown="1">

Parameter             | Description
-------------------   | --------------
timeout               | number: Specifies a timeout for the call in seconds. default=300 (5min), max=3000 (50min)
stdout                | boolean: Indicates algorithm stdout should be returned in the response metadata (ignored unless you are the algorithm owner)
output                | raw or void: Indicates the algorithm

</div>
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

{% include aside-middle.html %}
<code-sample v-cloak title="Query Parameters">
<div code-sample-language="Shell">
{% highlight bash %}
curl -X POST -H 'Authorization: Simple YOUR_API_KEY' \
    -d 'HAL 9000' -H 'Content-Type: text/plain' \
    https://api.algorithmia.com/v1/algo/demo/Hello/?timeout=10
{% endhighlight %}
</div>

<div code-sample-language="CLI">
{% highlight bash %}
# use --timeout to set the call timeout
$ algo run demo/Hello/ -d 'HAL 9000' --timeout 10

# use --debug to print STDOUT if available
$ algo run demo/Hello/ -d 'HAL 9000' --debug
{% endhighlight %}
</div>

{% highlight python %}
algo = client.algo('demo/Hello/').set_options(timeout=10, stdout=True)
result = algo.pipe("HAL 9000")

from Algorithmia.algorithm import OutputType
algo = client.algo('demo/Hello/').set_options(output=OutputType.raw)
{% endhighlight %}

{% highlight r %}
algo <- client$algo('util/echo')
algo$setOptions(timeout=40, stdout=FALSE)
result <- algo$pipe('HAL 9000')$result
{% endhighlight %}

{% highlight ruby %}
algo = client.algo('demo/Hello/').set('timeout':300)
result = algo.pipe('HAL 9000').result
{% endhighlight %}

{% highlight java %}
Algorithm algo = client.algo("algo://demo/Hello/").setTimeout(10L, TimeUnit.SECONDS);
AlgoResponse result = algo.pipe("HAL 9000");
{% endhighlight %}

{% highlight scala %}
val algo = client.algo("algo://demo/Hello/?timeout=10")
val result = algo.pipe(input)
{% endhighlight %}

{% highlight rust %}
let mut algo = client.algo("algo://demo/Hello/");
let algo = algo.timeout(10).enable_stdout();
let response = algo.pipe(input).unwrap();
if let Some(ref stdout) = response.metadata.stdout {
      println!("{}", stdout);
}
{% endhighlight %}

<div code-sample-language="JavaScript">
{% highlight javascript %}
client.algo("algo://demo/Hello/?timeout=10")
      .pipe("HAL 9000")
      .then(function(output) {
        console.log(output);
      });
{% endhighlight %}
</div>

<div code-sample-language="Node">
{% highlight javascript %}
client.algo("algo://demo/Hello/?timeout=10")
      .pipe("HAL 9000")
      .then(function(output) {
        console.log(output);
      });
{% endhighlight %}
</div>

{% highlight php %}
<?
$algo = $client->algo("demo/Hello/")->setOptions(["timeout" => 60]);
echo $algo->pipe("HAL 9000")->result;
?>
{% endhighlight %}
</code-sample>
{% include aside-end.html %}

## Error Handling

{% include aside-start.html %}

If an error occurs, an Exception will be raised/thrown (Java, Python, PHP, R, Ruby, Rust, Scala) or the response be modified (JavaScript, NodeJS) to contain the following fields:

<div class="syn-table-container" markdown="1">

Field            | Description
--------------   | --------------
error.message    | The error message
error.stacktrace | (Optional) a stacktrace if the error occurred within the algorithm (only if caller has access to algorithm source)

</div>

Each client provides a language-specific solution for error handling. The examples on the right
come from calling an algorithm that expects text input in it's implementation of the `apply` entrypoint,
but instead receives a JSON array as input.

{% include aside-middle.html %}

<code-sample v-cloak title="Error Handling">
<div code-sample-language="Shell">
{% highlight bash %}
curl -X POST -H 'Authorization: Simple YOUR_API_KEY' \
    -d '[]' -H 'Content-Type: application/json' \
    https://api.algorithmia.com/v1/algo/demo/Hello/

-> {
    "error":{
      "message":"apply() functions do not match input data",
      "stacktrace":"apply() functions do not match input data"
    },
    "metadata":{"duration":0.046542354}}
}
{% endhighlight %}
</div>

<div code-sample-language="CLI">
{% highlight bash %}
$ algo run demo/Hello/ -d '[]'
API error: apply() functions do not match input data
apply() functions do not match input data
{% endhighlight %}
</div>

{% highlight python %}
algo = client.algo('demo/Hello/')
try:
    print(algo.pipe([]).result)
except Exception as x:
    print(x)
# -> API error: apply() functions do not match input data
{% endhighlight %}

{% highlight r %}
algo <- client$algo('demo/Hello/')
tryCatch({
    algo$pipe(list())$result
}, error = function(e) {
    e
})
# -> API error: apply() functions do not match input data
{% endhighlight %}

{% highlight ruby %}
algo = client.algo('demo/Hello/')
begin
  puts puts algo.pipe([]).result
rescue Exception => x
  puts x
end
# -> API error: apply() functions do not match input data
{% endhighlight %}

{% highlight java %}
Algorithm algo = client.algo("algo://demo/Hello/");
AlgoResponse result = algo.pipe([]);
try {
  result.asString();
} catch (AlgorithmException ex) {
  System.out.println(ex.getMessage());
}
// -> API error: apply() functions do not match input data
{% endhighlight %}

{% highlight scala %}
val algo = client.algo("algo://demo/Hello/")
val result = algo.pipe("HAL 9000")
try {
  result.asString();
} catch {
  case ex: AlgorithmException => System.out.println(ex.getMessage)
}
// -> API error: apply() functions do not match input data
{% endhighlight %}

{% highlight rust %}
let algo = client.algo("algo://demo/Hello/");
match algo.pipe(&[]) {
    Ok(response) => { /* success */ },
    Err(err) => println!("error calling demo/Hello: {}", err),
}
// -> error calling demo/Hello: apply() functions do not match input data
{% endhighlight %}

<div code-sample-language="JavaScript">
{% highlight javascript %}
client.algo("algo://demo/Hello/")
      .pipe("HAL 9000")
      .then(function(output) {
        if(output.error) {
          console.log(output.error.message);
        }
      });
// -> API error: apply() functions do not match input data
{% endhighlight %}
</div>

<div code-sample-language="Node">
{% highlight javascript %}
client.algo("algo://demo/Hello/")
      .pipe("HAL 9000")
      .then(function(response) {
        if(response.error) {
          console.log(response.error.message);
        }
      });
// -> API error: apply() functions do not match input data
{% endhighlight %}
</div>

{% highlight php %}
<?
try {
  $client->algo("util/whoopsWrongAlgo")->pipe("Hello, world!");
} catch (Algorithmia\AlgoException $x) {
    echo $x;
}
// -> Algorithmia\\AlgoException: algorithm algo://util/whoopsWrongAlgo not found
?>
{% endhighlight %}
</code-sample>

{% include aside-end.html %}