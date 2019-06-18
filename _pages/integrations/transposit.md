---
layout: article
title: "Transposit"
excerpt-short: "Query across many APIs, then transform results with Algorithmia's ML"
categories: [integrations]
tags: [integrations]
show_related: true
image:
    teaser: /language_logos/transposit.png
---

Transposit enables developers to create complex SQL-like queries spanning multiple services' APIs. For example, I can pull records from Airtable create Stripe charges for each match, all in a single query:

<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/transposit/airtable_stripe.png" alt="Create Stripe charges for each record from Airtable" class="screenshot">

Now you can go even further, using Algorithmia's Machine Learning APIs to acquire data or transform results.

If you're a datascientist or developer building your own Machine Learning models, you use them as well: just [deploy your model](https://algorithmia.com/developers/algorithm-development) to Algorithmia, then mix it into a Transposit app!

The actual steps to use Algorithmia in Transposit are pretty simple... just use the [Algorithmia Connector](https://console.transposit.com/t/jpeck/algorithmiaconnector/) as a datasource inside your own Transposit App, making sure to set the Authorization to "Simple YOUR_API_KEY" when you add it (wheer YOUR_API_KEY comes from your [Algorithmia account](/user#credentials)). Then, in the WHERE clause of your query, set `algorithm` to the name of the [Algorithm](https://algorithmia.com/algorithms) you want to use, and `$body` to the JSON input you want to send. Here's a simple call to [nlp/SentimentAnalysis]](https://algorithmia.com/algorithms/nlp/SentimentAnalysis) using pre-set input:

{% highlight sql %}
SELECT result FROM algorithmiaconnector.algorithm
  WHERE algorithm='nlp/SentimentAnalysis'
  AND $body='{"document": "I really like Algorithmia!"}'
{% endhighlight %}

Of course, in a real use case you'd probably be pulling many records from another data source, such as the titles of your incoming emails or your Slack messages, then using the resultant sentiment scores to flag or forward particularly high- or low-scoring content. Transposit and Algorithmia are flexible enough to put together just about any workflow you need!

Ready to get started? Start by forking the demo application on Transposit and mix up your own solution: <a href="https://console.transposit.com/t/jpeck/algorithmiademo/" class="btn btn-default btn-primary"><i class="fa fa-code-fork" aria-hidden="true"></i> USE</a>
