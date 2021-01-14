---
layout: article
title: "CURL"
excerpt: "Get going with the cURL client on Algorithmia."
categories: clients
tags: [clients]
show_related: true
image:
    teaser: /language_logos/curl.svg
redirect_from:
  - /application-development/client-guides/cURL/
  - /application-development/client-guides/curl/
  - /application-development/guides/curl/
---

{% include video-responsive.html height="560" width="315" url="https://www.youtube.com/embed/VIxCEFFmpWQ" %}

You can use cURL to call any algorithm on the marketplace and manage your data through Algorithmia.

## Calling an Algorithm via cURL

To call an algorithm, use cURL to POST to the API. Be sure to specify the content type and authorize by passing in your API key.

{% highlight bash %}
curl -X POST -d '"YOUR_USERNAME"' -H 'Content-Type: application/json' -H 'Authorization: Simple YOUR_API_KEY' https://api.algorithmia.com/v1/algo/demo/Hello

-> {"result": "Hello YOUR_USERNAME","metadata":{"duration":0.0001}}
{% endhighlight %}


## Working with Data via cURL

#### Specifying an On-Premises or Private Cloud Endpoint

This feature is available to [Algorithmia Enterprise](/enterprise) users only.
{: .notice-enterprise}

If you are running [Algorithmia Enterprise](/enterprise), replace `https://api.algorithmia.com/v1/data/.my` in the codesamples below with your own API endpoint URL.


#### Create a directory

You can use cURL to interact with the Data API from the command line.
To create a directory, POST the new directory name to the Data API URI.
You will get a result that returns the address of the new data collection.

{% highlight bash %}
curl -X POST -d '{"name": "newCollection"}' -H 'Content-Type: application/json' -H 'Authorization: Simple YOUR_API_KEY' https://api.algorithmia.com/v1/data/.my

-> {"result": "data://.my/newCollection"}
{% endhighlight %}

#### Upload File

To upload a file, use cURL to `PUT` the file to a directory.
Be sure to pass in your API key and the data directory URI.
The response will return a result with the location of the file.

{% highlight bash %}
curl -X PUT -F 'file=@filename.csv' -H 'Authorization: Simple YOUR_API_KEY' https://api.algorithmia.com/v1/data/.my/newCollection

-> {"result": "data://.my/newCollection/filename.csv"}
{% endhighlight %}

#### Upload data as a file

You can also use cURL to upload data to the collection as a file.
Be sure to pass in your API key and the data collection URI.
The response will return a result with the location of the file.

{% highlight bash %}
curl -X PUT -H 'Content-Type:application/json' -d '{"key1": "value1"}' -H 'Authorization: Simple YOUR_API_KEY' https://api.algorithmia.com/v1/data/YOUR_USERNAME/newCollection/myFile.json

-> {"result": "data://YOUR_USERNAME/newCollection/myFile.json"}
{% endhighlight %}

#### Retrieve a file

Use cURL to `GET` any file that YOUR_API_KEY is allowed to access:

{% highlight bash %}
curl -X GET -H 'Authorization: Simple YOUR_API_KEY' https://api.algorithmia.com/v1/data/.my/newCollection/filename.csv

{% endhighlight %}

## Additional information

See the full [API Specification](http://docs.algorithmia.com/#api-specification) for additional details
on calling algorithms and managing data with cURL.

Your account can make up to {{site.data.stats.platform.max_num_algo_requests}} Algorithmia requests at the same time (this limit <a onclick="Intercom('show')">can be raised</a> if needed).

