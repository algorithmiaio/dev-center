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

With Algorithmia Insights you'll be able to opt in to exporting your algorithm's operational metrics to external monitoring and alerting tools. This means you'll be able to monitor your algorithm's execution time as well as capture any model inference metrics you expose from your algorithm's output such as predictions or accuracy. Any metrics you opt to collect will be captured and exported in a payload and, with help from a Platform Administrator, can be connected to your external systems for monitoring and alerting.

Algorithmia Insights currently supports [Python 3.x](../clients/python#publishing-algorithmia-insights), [R](../clients/r#publishing-algorithmia-insights), and [Java](../clients/java#publishing-algorithmia-insights) algorithms and [Apache Kafka](https://kafka.apache.org/) as a destination for metrics.

### Types of Algorithmia Insights metrics

Algorithmia Insights metrics fall into two categories:
* Operational metrics
* Inference-related metrics

**Operational metrics** include (but are not limited to) execution time, request ID, algorithm owner, algorithm name, algorithm version, timestamp, etc. When Algorithmia Insights is turned on for a particular algorithm version, these are automatically collected and reported without any additional action necessary on the part of the algorithm author or manager.

**Inference-related metrics** are defined by the algorithm author in algorithm code. Each metric is defined by a title, like `cute_cats_detected`, and a numeric value, like `24`. Multiple inference-related metrics can be reported at one time, and the set of metrics reported does not need to be the same from one algorithm execution to another.

## One-time administrator setup

The first step in allowing Algorithmia Insights to be collected and reported for algorithms is to have the Algorithmia Platform Administrator connect your cluster to a Kafka broker / cluster to which metrics will be sent.

The Algorithmia platform supports two Kafka connection configurations:

* [SCRAM](https://en.wikipedia.org/wiki/Salted_Challenge_Response_Authentication_Mechanism) (Salted Challenge Response Authentication Mechanism) over [TLS](https://en.wikipedia.org/wiki/Transport_Layer_Security). Provides encrypted communications, authentication credential database breach protection, [man-in-the-middle](https://en.wikipedia.org/wiki/Man-in-the-middle_attack) attack protection, and internationalization support. Please see the [Kafka SCRAM setup guide](https://kafka.apache.org/documentation/#security_sasl_scram) for configuring a Kafka broker / cluster to support this configuration.
* Unencrypted / plaintext. Provides all of the features of Algorithmia Insights for use without encryption or authentication safeguards; allows for testing / prototyping as well as use in networks with existing robust protection against attacks.

The first step to configuring your cluster for Algorithmia Insights is to navigate to the "Algorithmia Insights" administration page, which can be found under the "System Actions" section.

From here, enter the information about your Kafka broker. The following information is needed for any connection type:

* **Kafka URL** - a list of comma-separated [Kafka bootstrap servers](https://kafka.apache.org/documentation/#bootstrap.servers) used to establish the initial connection to the Kafka cluster. Algorithmia will make use of all servers irrespective of which servers are specified here for bootstrapping—this list only impacts the initial hosts used to discover the full set of servers. This list should be in the form `host1:port1,host2:port2,...` Since these servers are just used for the initial connection to discover the full cluster membership (which may change dynamically), this list need not contain the full set of servers (you may want more than one, though, in case a server is down).
* **Topic Name** - the name of the [Kafka topic](https://kafka.apache.org/documentation/#intro_concepts_and_terms) to which Algorithmia Insights will be published.

It is the Algorithmia Platform Administrator's responsibility to ensure that Kafka traffic (which operates over TCP) routes successfully from the Algorithmia Platform to all of the Kafka bootstrap servers in the **Kafka URL** list (on their specified ports) *and* to all of the Kafka cluster members reported by those bootstrap servers (on their specified ports).

For each execution of algorithms for which Algorithmia Insights is turned on, the Algorithmia Platform will perform multiple data send attempts to the Kafka broker / cluster over the course of four minutes. If, after that time, the data cannot be sent to the Kafka broker / cluster for _any_ reason (Kafka server offline, failed authenticated, network disconnections, etc), the data for that specific execution will be permanently lost.

### Unencrypted / plaintext

Unencrypted, plaintext connections do not require any additional configuration information.

![Image of Kafka connection UI for unencrypted, plaintext connections](/developers/images/algorithmia-enterprise/algorithmia-insights/web-ui-kafka-connection-unencrypted-plaintext.png)

### SCRAM / TLS

Encrypted, SCRAM-authenticated connections also require:

* **Username** - the username used to authenticate to the Kafka cluster
* **Password** - the password used to authenticate to the Kafka cluster
* **CA Certificate** - the Certificate Authority certificate used to sign the TLS certificates that the Kafka servers use for communication

![Image of Kafka connection UI for encrypted, SCRAM connections](/developers/images/algorithmia-enterprise/algorithmia-insights/web-ui-kafka-connection-sasl-scram.png)
 
## Using Algorithmia Insights in an algorithm

Each algorithm in your Algorithmia cluster has independent settings for whether to collect and report Algorithmia Insights. Additionally, each published version of your algorithm can have Algorithmia Insights turned on or off.

### Creating inference-related metrics for your algorithm

Algorithmia [client libraries](../clients) are used to report inference-related metrics that you create inside of your algorithm code. Please see the "Publishing Algorithmia Insights" section of the appropriate [client library guide](../clients) for the language that you're using.

#### Restrictions

You can report up to 25 metrics in your code. The Algorithmia Platform will report additional metrics that do not count towards these 25.

Additionally, the total size of your metrics data (keys and values) must not exceed 25 kilobytes.

Finally, there are several reserved metric names that must not be used by client code, as they will conflict with automatically created metrics for each algorithm execution:

* `request_id`
* `timestamp`
* `duration_milliseconds`
* `algorithm_owner`
* `algorithm_name`
* `algorithm_version`

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
