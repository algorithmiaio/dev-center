---
categories: [monitoring-and-observability]
excerpt: "Sending algorithm metrics to a customer-operated metrics collection system"
layout: article
nav_index: 0
permalink: /monitoring-and-observability/insights/
redirect_from:
  - /integrations/insights/
  - /algorithmia-enterprise/algorithmia-insights/
  - /monitoring-and-observability/
show_related: false
tags: [integrations, monitoring-observability]
title: "Algorithmia Insights"
---

This feature is available to [Algorithmia Enterprise](/enterprise) users only.
{: .notice-enterprise}

Algorithmia Insights is an algorithm metrics pipelining tool that enables you to send your algorithms' operational and inference metrics to external monitoring, observability, and alerting platforms so that you can measure, monitor, and manage your algorithms in production.

Once Insights is configured on your cluster, you'll be able to opt in to the feature for each version of each algorithm, every time you go through the publishing step. When enabled, Insights will automatically stream select algorithm data to an external message broker, from which these data can be consumed by external platforms. Insights automatically sends algorithm operational data, such as algorithm execution time, and you can granularly specify any model inference metrics you'd like to send as well, from within your algorithm source code. These data can be prediction or accuracy values, or even intermediate values that aren't exposed in your algorithm's actual output payload.

Algorithmia Insights is currently supported for [Python 3.x](/developers/algorithm-development/languages/python#publishing-algorithmia-insights), [R](/developers/algorithm-development/languages/r#publishing-algorithmia-insights), and [Java](/developers/algorithm-development/languages/java#publishing-algorithmia-insights) algorithms, and you can use [Apache Kafka](https://kafka.apache.org/) or [Azure Event Hubs](https://azure.microsoft.com/services/event-hubs/) as a broker for metrics.

### Types of Algorithmia Insights metrics

Algorithmia Insights metrics fall into two categories:

- **Operational metrics** include (but are not limited to) execution time, request ID, algorithm owner, algorithm name, algorithm version, timestamp, etc. When Algorithmia Insights is enabled for a particular algorithm version, these metrics are automatically collected and reported without any additional action necessary on behalf of the algorithm developer.
- **Inference-related metrics** are defined in the algorithm source code itself. Each metric is defined by a title (e.g, `"cute_cats_detected"`) and the numeric value associated with that parameter in the code (e.g., the variable `cute_cats_detected`, which in this case hopefully evaluates to a large number like `24`). Multiple inference-related metrics can be reported at one time (see [Restrictions](#restrictions) below). Furthermore, because metrics reporting is all defined within the code itself, the exact set of metrics reported does not need to be the same from one algorithm execution to another.

## Setting up Algorithmia Insights on your cluster

The external broker connection required for Insights is a global configuration on your Algorithmia cluster. If Insights isn't already available on your cluster, ask your cluster admin to [configure a broker connection](https://training.algorithmia.com/exploring-the-admin-panel/687275).

## Using Algorithmia Insights in an algorithm

Each algorithm in your Algorithmia cluster has independent settings for whether to collect and report Algorithmia Insights. Additionally, each published version of your algorithm can have Algorithmia Insights turned on or off.

### Reporting inference-related metrics from your algorithm source code

To learn how to add Insights reporting to your algorithm source code, see the respective guide for your algorithm development language. Insights is supported for [Python 3.x](/developers/algorithm-development/languages/python#publishing-algorithmia-insights), [R](/developers/algorithm-development/languages/r#publishing-algorithmia-insights), and [Java](/developers/algorithm-development/languages/java#publishing-algorithmia-insights) algorithms.

#### Restrictions

- **Maximum count**: You can report up to 25 metrics from within an algorithm. The operational metrics that the Algorithmia platform reports automatically don't count towards these 25.
- **Maximum payload size**: The total size of your metrics payload (combined keys plus values) must not exceed 25 KB.
- **Reserved names**: You must not use the following strings to report your metrics in your algorithm code, because they'll conflict with names used by the platform itself:
  - `request_id`
  - `timestamp`
  - `duration_milliseconds`
  - `algorithm_owner`
  - `algorithm_name`
  - `algorithm_version`

### Enabling Algorithmia Insights for an algorithm version

Enabling Algorithmia Insights for an algorithm version happens during the [algorithm publishing](/developers/algorithm-development/your-first-algo/#publishing-your-algorithm) step.

When using the browser UI publishing workflow, you'll have the option to enable Algorithmia Insights for the specific algorithm version that you're publishing, as shown below.

![Image of algorithm publish UI with Algorithmia Insights checkbox](/developers/images/algorithmia-enterprise/algorithmia-insights/web-ui-publish.png)

When using the HTTP API or client libraries to publish your algorithm, passing the key-value pair `"insights_enabled": true` in the algorithm's `settings` will enable Algorithmia Insights for your algorithm, as demonstrated in the following [cURL](/developers/clients/curl) command.

```shell
$ curl https://CLUSTER_DOMAIN/v1/algorithms/ALGO_OWNER/ALGO_NAME/versions \
  -H 'Authorization: Simple STD_API_KEY' \
  -d '{"settings": {"insights_enabled": true}}'
```

Once you've published your algorithm with Algorithmia Insights enabled, all executions of that specific version of the algorithm will trigger the specified metrics to be collected and reported to the external message broker that your [Algorithmia cluster admin has configured](#setting-up-algorithmia-insights-on-your-cluster).

### Viewing Algorithmia Insights status for algorithm versions

Navigate to the **Versions** tab of an algorithm's profile page to see which published versions of that algorithm have Insights enabled.

![Image of algorithm versions page with Algorithmia Insights flag highlighted](/developers/images/algorithmia-enterprise/algorithmia-insights/web-ui-versions.png)
