---
layout: article
title: "Wolfram"
excerpt-short: "Enhance your Wolfram Language code with calls to Algorithmia"
categories: [integrations]
tags: [integrations]
show_related: true
image:
    teaser: /language_logos/wolfram.png
---

The [Wolfram Language](http://www.wolfram.com/language/principles/) is quite powerful and puts a wide variety of algorithms and curated data at your fingertips.

When you're ready to extend this with any of the 8,000+ algorithms available from Algorithmia, or by hosting your own ML Model written in your [preferred language](/developers/algorithm-development/languages/), you can easily do so by calling your Algorithm directly from within Wolfram!

You can run this code sample by downloading the free [Wolfram Engine](http://www.wolfram.com/engine/) and/or [WolframScript](https://www.wolfram.com/wolframscript), or by using any product you already have which supports the Wolfram Language (such as [Wolfram One](http://www.wolfram.com/wolfram-one/)).

First, we specify the URL of the algorithm we want to run; you can get this from the Algorithm's page, such as https://algorithmia.com/algorithms/nlp/SentimentAnalysis, under the "Install and Use" -> cURL sample, but in most cases it is just "https://api.algorithmia.com/v1/algo/" followed by the algorithm and version you want to use.

{% if site.enterprise %}
Enterprise users: your URL will be custom for your domain, e.g. "https://mydomainendpoint.com/v1/algo/" followed by the algorithm.
{% endif %}


Next, we specify the input we want as escaped JSON.

Lastly, we set the Authorization and Content-Type headers (your API Key is in [your Account Page](/user#credentials)).

The rest is boilerplate -- no need to change it. We just send the HTTPRequest via URLRead:

{% highlight bash%}
algo = "https://api.algorithmia.com/v1/algo/nlp/SentimentAnalysis/1.0.5"
input = "{\"document\":\"I love Algorithmia\"}"
headers = {"Authorization" -> "Simple YOUR_API_KEY", "Content-Type" -> "application/json"}
req = HTTPRequest[algo, <|Method->"POST", "Headers"->headers,"Body"->input|>]
response = URLRead[req, {"Body"}]
{% endhighlight %}

The response variable now contains the Algorithm response, for you to use as you wish:

{% highlight json%}
{  
   "result":[  
      {  
         "document":"I love Algorithmia",
         "sentiment":0.6369
      }
   ],
   "metadata":{  
      "content_type":"json",
      "duration":0.000866891
   }
}
{% endhighlight%}
