---
layout: article
title:  "Algorithmia Insights"
excerpt: "Sending algorithm metrics to a customer-operated metrics collection system"
categories: algorithmia-enterprise
show_related: false
image:
  teaser: /icons/algo.svg
---

Algorithmia Insights is an algorithm metrics pipeline providing you access to your algorithm metrics payload for each algorithm session so you can measure, monitor, and manage your algorithms in production.

With Algorithmia Insights you'll be able to opt-in to exporting your algorithm's operational metrics to external monitoring and alerting tools. This means you'll be able to monitor your algorithm's execution time as well as capture any model inference metrics you expose from your algorithm's output such as predictions or accuracy. Any metrics you opt to collect will be captured and exported in a payload and, with help from a Platform Administrator, can be connected to your external systems for monitoring and alerting.

Algorithmia Insights currently supports [Python 3.x](../clients/python) and [R](../clients/r) algorithms and [Apache Kafka](https://kafka.apache.org/) as a destination for metrics.

### Types of Algorithmia Insights metrics

Algorithmia Insights metrics fall into two categories:
* Operational metrics
* Inference-related metrics

**Operational metrics** include (but are not limited to) execution time, request ID, algorithm owner, algorithm name, algorithm version, timestamp, etc. When Algorithmia Insights are turned on for a particular algorithm version, these are automatically collected and reported without any additional action necessary on the part of the algorithm author or manager.

**Inference-related metrics** are defined by the algorithm author in algorithm code. Each metric is defined by a title, like `cute_cats_detected`, and a numeric value, like `24`. Multiple inference-related metrics can be reported at one time, and the set of metrics reported does not need to be the same from one algorithm execution to another.

## One-time administrator setup

The first step in allowing Algorithmia Insights to be collected and reported for algorithms is to have the Algorithmia Platform Administrator connect your cluster to a Kafka broker that your organization operates to receive metrics created by the Algorithmia platform.

Navigate to the "Algorithmia Insights" administration page, which can be found under the "System Actions" section.

**Screenshot and list of credentials needed TBD pending UX completion - https://algorithmia.atlassian.net/browse/INSIGHTS-31**

From here, enter the information about your Kafka broker. This includes a URL and credentials necessary to connect. The Algorithmia platform supports [SCRAM](https://en.wikipedia.org/wiki/Salted_Challenge_Response_Authentication_Mechanism) for authentication; please see the [Kafka SCRAM setup guide](https://kafka.apache.org/documentation/#security_sasl_scram) for creating credentials that the Algorithmia platform will use to connect.

## Using Algorithmia Insights in an algorithm

Each algorithm in your Algorithmia cluster has independent settings for whether to collect and report Algorithmia Insights. Additionally, each published version of your algorithm can have Algorithmia Insights turned on or off.

### Creating inference-related metrics for your algorithm

Algorithmia [client libraries](../clients) are used to report inference-related metrics that you create inside of your algorithm code. Please see the "Publishing Algorithmia Insights" section of the appropriate [client library guide](../clients) for the language that you're using.

### Enabling Algorithmia Insights for an algorithm version

Enabling Algorithmia Insights for an algorithm version happens during [algorithm publishing](../algorithm-development/your-first-algo/#publish-your-algorithm).

When using the web UI publishing workflow, a toggle will appear to enable Algorithmia Insights for the specific algorithm version that you are publishing.

**Screenshot pending UX completion - https://algorithmia.atlassian.net/browse/INSIGHTS-31**

When using the HTTP API or client libraries to publish your algorithm, passing the key value pair `"insights_enabled":true` in the `settings` hash will enable Algorithmia Insights for your algorithm. For example, when using [cURL](../clients/curl):

{% highlight bash %}
curl -H 'Authorization: Simple YOUR_API_KEY' https://<algorithmia-cluster-host>/v1/algorithms/<algorithm-owner>/<algorithm-name>/version --data-binary '{"settings":{"insights_enabled":true}}'
{% endhighlight %}

Once you've published your algorithm with Algorithmia Insights enabled, all executions of that specific version of the algorithm will trigger your Algorithmia Insights to be collected and reported to the Kafka broker that your Algorithmia Platform Administrator has set up.

### Viewing Algorithmia Insights status for algorithm versions

The "Versions" tab of the algorithm page shows which published versions of that algorithm have Algorithmia Insights enabled:

**Screenshot pending UX completion - https://algorithmia.atlassian.net/browse/INSIGHTS-31**
