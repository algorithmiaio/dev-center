---
layout: article
title: 'Algorithmia Insights'
excerpt: 'Sending algorithm metrics to a customer-operated metrics collection system'
categories: [monitoring-&-observability]
tags: [integrations, monitoring-observability]
show_related: false
image:
  teaser: /icons/algo.svg
permalink: /integrations/insights/
redirect_from:
  - /algorithmia-enterprise/algorithmia-insights/
nav_index: 1
---

This feature is available to [Algorithmia Enterprise](/enterprise) users only.
{: .notice-enterprise}

Algorithmia Insights is an algorithm metrics pipeline providing you access to your algorithm metrics payload for each algorithm session so you can measure, monitor, and manage your algorithms in production.

With Algorithmia Insights you'll be able to opt in to exporting your algorithm's operational metrics to external monitoring and alerting tools. This means you'll be able to monitor your algorithm's execution time as well as capture any model inference metrics you expose from your algorithm's output such as predictions or accuracy. Any metrics you opt to collect will be captured and exported in a payload and, with help from a Platform Administrator, can be connected to your external systems for monitoring and alerting.

Algorithmia Insights currently supports [Python 3.x](../clients/python#publishing-algorithmia-insights), [R](../clients/r#publishing-algorithmia-insights), and [Java](../clients/java#publishing-algorithmia-insights) algorithms and [Apache Kafka](https://kafka.apache.org/) as a destination for metrics.

### Types of Algorithmia Insights metrics

Algorithmia Insights metrics fall into two categories:

- Operational metrics
- Inference-related metrics

**Operational metrics** include (but are not limited to) execution time, request ID, algorithm owner, algorithm name, algorithm version, timestamp, etc. When Algorithmia Insights is turned on for a particular algorithm version, these are automatically collected and reported without any additional action necessary on the part of the algorithm author or manager.

**Inference-related metrics** are defined by the algorithm author in algorithm code. Each metric is defined by a title, like `cute_cats_detected`, and a numeric value, like `24`. Multiple inference-related metrics can be reported at one time, and the set of metrics reported does not need to be the same from one algorithm execution to another.

## Setting up Algorithmia Insights on your cluster

The Kafka connection required for Insights is a global configuration on your Algorithmia cluster. If Insights isn't already available on your cluster, ask your cluster admin to [configure a connection to Kafka](https://training.algorithmia.com/exploring-the-admin-panel/687275).

## Using Algorithmia Insights in an algorithm

Each algorithm in your Algorithmia cluster has independent settings for whether to collect and report Algorithmia Insights. Additionally, each published version of your algorithm can have Algorithmia Insights turned on or off.

### Creating inference-related metrics for your algorithm

Algorithmia [client libraries](../clients) are used to report inference-related metrics that you create inside of your algorithm code. Please see the "Publishing Algorithmia Insights" section of the appropriate [client library guide](../clients) for the language that you're using.

#### Restrictions

You can report up to 25 metrics in your code. The Algorithmia Platform will report additional metrics that do not count towards these 25.

Additionally, the total size of your metrics data (keys and values) must not exceed 25 kilobytes.

Finally, there are several reserved metric names that must not be used by client code, as they will conflict with automatically created metrics for each algorithm execution:

- `request_id`
- `timestamp`
- `duration_milliseconds`
- `algorithm_owner`
- `algorithm_name`
- `algorithm_version`

### Enabling Algorithmia Insights for an algorithm version

Enabling Algorithmia Insights for an algorithm version happens during [algorithm publishing](../algorithm-development/your-first-algo/#publish-your-algorithm).

When using the web UI publishing workflow, a toggle will appear to enable Algorithmia Insights for the specific algorithm version that you are publishing.

![Image of algorithm publish UI with Algorithmia Insights checkbox](/developers/images/algorithmia-enterprise/algorithmia-insights/web-ui-publish.png)

When using the HTTP API or client libraries to publish your algorithm, passing the key value pair `"insights_enabled":true` in the `settings` hash will enable Algorithmia Insights for your algorithm. For example, when using [cURL](../clients/curl):

{% highlight bash %}
curl -H 'Authorization: Simple YOUR_API_KEY' https://<algorithmia-cluster-host>/v1/algorithms/<algorithm-owner>/<algorithm-name>/version --data-binary '{"settings":{"insights_enabled":true}}'
{% endhighlight %}

Once you've published your algorithm with Algorithmia Insights enabled, all executions of that specific version of the algorithm will trigger your Algorithmia Insights to be collected and reported to the Kafka broker that your Algorithmia Platform Administrator has set up.

### Viewing Algorithmia Insights status for algorithm versions

The "Versions" tab of the algorithm page shows which published versions of that algorithm have Algorithmia Insights enabled:

![Image of algorithm versions page with Algorithmia Insights flag highlighted](/developers/images/algorithmia-enterprise/algorithmia-insights/web-ui-versions.png)

If you're new to Algorithmia and would like to learn more about our product and the Algorithmia Insights metrics pipeline, please [contact our sales team](https://info.algorithmia.com/contact-sales). We'd love to hear from you!
