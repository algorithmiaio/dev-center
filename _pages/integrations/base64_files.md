---
layout: article
title: "Base64 File Encoding"
excerpt-short: "Send a base64-encoded file to an Algorithm"
categories: [integrations]
tags: [integrations]
show_related: true
image:
    teaser: /language_logos/US_64.svg
---

For managing files, Algorithmia recommends using [Hosted Data and Data Connectors]({{site.baseurl}}/data) to store files, and the [Data API](https://docs.algorithmia.com#data-api-specification) to manage them, as with our [Multipart Forms Example](./multipartforms).

However, there are times when you must directly transfer a file right from the user to the Algorithm; in these cases, you'll need an Algorithm which accepts base64-encoded files.

### Writing Algorithms which accept base64-encoded files

Some algorithms in our [directory](/algorithms) already accept base64-encoded files, such as [pdf64 to text](https://algorithmia.com/algorithms/jpeck/pdf64_to_text). However, if you are writing your own, it is not difficult to make it base64-encoding capable.

In Python, simply change your `apply(input)` method to add the line:

{% highlight python %}
bytes = base64.decodestring(bytearray(input,'utf8'))
{% endhighlight %}

This reads the input as base64, and turns it into a byte-array representing the file. Inspect the [source code of pdf64_to_text](https://algorithmia.com/algorithms/jpeck/pdf64_to_text/source) to see this in action.

### Calling base64-capable Algorithms directly from cURL

To send a file directly to a base64-capable Algorithm, you must first encode it as base64 locally. This can be done inline to a cURL command as follows:

{% highlight bash %}
cat minimal.pdf | base64 | curl --data @- -X POST -H 'Content-Type: text/plain' -H 'Authorization: Simple YOUR_API_KEY' https://api.algorithmia.com/v1/algo/jpeck/pdf64_to_text/0.1.0?timeout=300
{% endhighlight %}

To test this out, download [minimal.pdf]({{site.baseurl}}/images/language_logos/minimal.pdf) and run the line above on a linux or OSX machine, or replace **minimal.pdf** in the codesample with any PDF file you have locally. If you're on Windows, you'll need to install [base64.exe](https://www.proxoft.com/base64.aspx) and [curl](https://curl.haxx.se/windows/) since these functions are not built-in.

### Calling base64-capable Algorithms with Javascript

You can easily connect a standalone HTML form to a base64-capable Algorithm by using a small piece of vanilla Javascript to convert the selected file to base64:

{% highlight html %}
<form>
  <input type="file" id="file" onchange="loadfile()">
  <pre id="results"></pre>
</form>

<script src="https://algorithmia.com/v1/clients/js/algorithmia-0.2.1.js" type="text/javascript"></script>

<script>

// set up file reader
var reader = new FileReader();
reader.onload = callalgorithm

// get file from file selector and convert to base64
function loadfile() {
  var file = document.querySelector('#file').files[0];
  reader.readAsDataURL(file);
}

// get converted file and send to Algorithm
function callalgorithm() {
  input = reader.result.substr(reader.result.indexOf(',')+1);
  document.querySelector("#results").innerText = "Loading...";
  Algorithmia.client("YOUR_API_KEY")
  .algo("jpeck/pdf64_to_text/0.1.0?timeout=300")
  .pipe(input)
  .then(function(response) {
    var output = response.error? response.error.message:response.result
    document.querySelector("#results").innerText = output;
  });
}

</script>
{% endhighlight %}
