---
layout: article
title:  "New Relic"
permalink: integrations/newrelic/
excerpt: "Monitor model performance metrics with New Relic"
excerpt-short: "Monitor model performance metrics with New Relic"
categories: [integrations]
tags: [integrations]
show_related: false
image:
    teaser: /language_logos/newrelic.svg
---

This feature is available to [Algorithmia Enterprise](/enterprise) users only.
{: .notice-enterprise}

[Algorithmia Insights](https://algorithmia.com/blog/how-to-use-algorithmia-insights-for-machine-learning-model-performance-monitoring) is a feature of Algorithmia Enterprise that provides a metrics pipeline to instrument, measure, and monitor your machine learning models by integrating with popular observability platforms such as New Relic. If you're new to Insights, you can check out our [documentation](https://algorithmia.com/developers/algorithmia-enterprise/algorithmia-insights/) and learn how to configure it for your organization.

[New Relic](https://newrelic.com/) is a cloud-based observability platform that helps you instrument, analyze, troubleshoot, and optimize your entire software stack. You can send your model performance metrics from Algorithmia Insights to New Relic as time-series data and have real-time monitoring for your algorithms.

With your dashboards, monitors, and alerts on New Relic you can analyze your model performance metrics in production systems across your entire model catalog.

<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/newrelic/dashboard1.png" alt="Architecture of NewRelic-Algorithmia integration for model performance metrics" class="screenshot">


<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/newrelic/dashboard2.png" alt="Architecture of NewRelic-Algorithmia integration for model performance metrics" class="screenshot">


# How the Algorithmia-New Relic integration works

<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/newrelic/architecture.png" alt="Architecture of NewRelic-Algorithmia integration for model performance metrics" class="screenshot">

In this workflow, your algorithm’s metrics are streamed using Algorithmia Insights to a Kafka topic. You have another algorithm - the New Relic connector - that can transform and send any Insights payload to New Relic Metrics for the configured account. Using [Algorithmia Event Flows](https://algorithmia.com/developers/integrations/message-broker/), your New Relic connector algorithm is configured to get called when a new message is sent to your Kafka topic collecting Insights. 

With this event flow, when your Insights enabled algorithms are run, the New Relic connector algorithm gets called with your algorithms’ Insights payload. The connector algorithm then transforms your Insights metrics and sends them to your New Relic account.

## Setup
To set up this integration, you will need to: 
1. Create an account on New Relic and retrieve your API key. See [Get your API key](#get-your-api-key) section below for details.
2. [Create your default Algorithmia dashboard](#create-your-default-algorithm-dashboard) on New Relic. You can import our default dashboard and start observing your algorithm duration and throughput right away.
3. [Configure Algorithmia to send Insights](https://algorithmia.com/developers/algorithmia-enterprise/algorithmia-insights) to a Kafka broker and topic. 
4. [Create the New Relic connector algorithm](#create-new-relic-connector-algorithm), and add your New Relic API key to your algorithm's Secrets.
5. [Set up Algorithmia Event Flows](https://algorithmia.com/developers/integrations/message-broker/) for your New Relic connector algorithm

For any published algorithm on your cluster that has Insights enabled, once the algorithm's API endpoint is called, your New Relic connector algorithm will in turn be called through the Algorithmia Event Flows trigger. The connector algorithm will then push your Insights metrics to your New Relic Account.

As you call your Insights enabled algorithms, you can then verify that your metrics appear in New Relic as `algorithmia.<METRIC-NAME>`, and your data points are plotted on your New Relic dashboard’s charts.


## Monitored Metrics
The metrics payload from Algorithmia Insights contains both operational and inference metrics. Operational metrics include the algorithm name, version, owner, duration, session ID, and request ID. Inference metrics include user-defined metrics that are specified by data scientists depending on the particular algorithm and use case.

When this integration is used, all of the operational metrics related to the algorithm name, version, owner, request ID, and session ID will be included with each data point as [attributes](https://docs.newrelic.com/docs/using-new-relic/welcome-new-relic/get-started/glossary/#attribute) in New Relic. These attributes (dimensions) can then be used to filter and group model performance metrics in dashboards.


# Configuration Details
## New Relic
### Get your API key
After logging in to your [New Relic](https://one.newrelic.com/) account, go to your profile and select API keys. 
Create a key with “User” as the “key type” and note it down for later reference for your Algorithmia side configuration.

<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/newrelic/apikey.png" alt="Architecture of NewRelic-Algorithmia integration for model performance metrics" class="screenshot">

### Create your default Algorithm dashboard
From your New Relic One main page, go to your main Dashboards page. From here you can either create a dashboard from scratch or start with Algorithmia’s default metrics dashboard. 

To get started with the Algorithmia template, click on the “Import dashboard” button from the menu icons on the right. 

<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/newrelic/import_dashboard_1.png" alt="Architecture of NewRelic-Algorithmia integration for model performance metrics" class="screenshot">

On the pop up page, paste the following JSON. Remember to update the fields that say "accountId": YOUR_ACCOUNT_ID with your own New Relic Account ID. 

```json
{
  "name": "Algorithmia Dashboard for Default Metrics",
  "description": null,
  "permissions": "PUBLIC_READ_WRITE",
  "pages": [
    {
      "name": "Algorithmia Dashboard for Default Metrics",
      "description": null,
      "widgets": [
        {
          "visualization": {
            "id": "viz.line"
          },
          "layout": {
            "column": 1,
            "row": 1,
            "height": 3,
            "width": 4
          },
          "title": "Runtime Duration by Algorithm",
          "rawConfiguration": {
            "legend": {
              "enabled": true
            },
            "nrqlQueries": [
              {
                "accountId": YOUR_ACCOUNT_ID,
                "query": "SELECT average(algorithmia.duration_milliseconds) FROM Metric TIMESERIES FACET `algorithm_name` LIMIT 10 SINCE 1800 seconds ago"
              }
            ],
            "yAxisLeft": {
              "zero": true
            }
          },
          "linkedEntityGuids": null
        },
        {
          "visualization": {
            "id": "viz.line"
          },
          "layout": {
            "column": 5,
            "row": 1,
            "height": 3,
            "width": 4
          },
          "title": "Throughput by Algorithm",
          "rawConfiguration": {
            "legend": {
              "enabled": true
            },
            "nrqlQueries": [
              {
                "accountId": YOUR_ACCOUNT_ID,
                "query": "SELECT count(algorithmia.duration_milliseconds) FROM Metric TIMESERIES FACET `algorithm_name` LIMIT 10 SINCE 1800 seconds ago"
              }
            ],
            "yAxisLeft": {
              "zero": true
            }
          },
          "linkedEntityGuids": null
        }
      ]
    }
  ]
}
```

Click on “Import dashboard” and get ready to observe your Algorithmia Insights metrics on these widgets.

<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/newrelic/import_dashboard_2.png" alt="Architecture of NewRelic-Algorithmia integration for model performance metrics" class="screenshot">

## Algorithmia
### Configure Insights

To start using Insights, your Algorithmia Platform Administrator connects your cluster to a Kafka broker to which metrics will be sent. Once this one time administrator setup is done, you can start using Algorithmia Insights in an algorithm. Detailed instructions on how to configure these are in our [Insights documentation](https://algorithmia.com/developers/algorithmia-enterprise/algorithmia-insights) here.

### Create New Relic Connector Algorithm
Create a new algorithm on Python (3.7 and up) environment with the following source code and dependencies. If you’re new to creating algorithms, you can start from our [Getting Started guide](https://algorithmia.com/developers/algorithm-development/your-first-algo).


#### Add New Relic API key to Algorithm Secrets
Go to Algorithm Settings and add your New Relic API key to your algorithm’s secret store. For more instructions on how to use Secrets, you can refer to our [documentation](https://algorithmia.com/developers/platform/algorithm-secrets).

<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/newrelic/create_secret.png" alt="Architecture of NewRelic-Algorithmia integration for model performance metrics" class="screenshot">

After creating the secret, you can view it under your Algorithm Settings. 
<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/newrelic/view_secret.png" alt="Architecture of NewRelic-Algorithmia integration for model performance metrics" class="screenshot">


#### Build New Relic Connector Algorithm

Build your algorithm with the following source code and dependencies:

##### Source Code
```python
import Algorithmia
import json
import os
import datetime
import dateutil.parser as dp
from newrelic_telemetry_sdk import GaugeMetric, MetricClient

client = Algorithmia.client()
newrelic_api_key = os.getenv("api_key")
metric_client = MetricClient(newrelic_api_key)

def convert_str_timestamp_to_epoch(str_time):
    parsed_t = dp.parse(str_time)
    return parsed_t.timestamp()

def get_operational_metrics(payload):
    ALGORITHM_TAGS = {
    "algorithm_version",
    "request_id",
    "time",
    "algorithm_name",
    "session_id",
    "algorithm_owner"
    }
    inference_metrics = {
        key: payload[key] for key in payload.keys() ^ ALGORITHM_TAGS
    }
    return inference_metrics

def send_to_newrelic(inference_metrics, insights_payload):
    newrelic_metrics = []
    for key, value in inference_metrics.items():
        name = "algorithmia." + key
        epoch_time = convert_str_timestamp_to_epoch(insights_payload["time"])
        tags = {
            "algorithm_name": insights_payload["algorithm_name"],
            "algorithm_version": insights_payload["algorithm_version"],
            "algorithm_owner": insights_payload["algorithm_owner"],
            "request_id": insights_payload["request_id"],
            "session_id": insights_payload["session_id"],
        }

        newrelic_metrics.append(GaugeMetric(
            name=name, value=value, tags=tags, end_time_ms=epoch_time
        ))

    response = metric_client.send_batch(newrelic_metrics)
    response.raise_for_status()


def apply(input):
    insights_payload = input
    inference_metrics = get_operational_metrics(insights_payload)
    send_to_newrelic(inference_metrics, insights_payload)
    return "200"
```

##### Dependencies
```
algorithmia>=1.0.0,<2.0
newrelic_telemetry_sdk==0.4.2
```

If you’re using the Web IDE to create these, click on Save and Build and compile your algorithm. If you’re developing your algorithm locally, push your algorithm repository as you’d normally do to build an algorithm version. Once your build finishes, you can test it with this sample payload and make sure it runs successfully. This test input is how your Insights payload will look like. 
```json
{
  "risk_score": 0.2,
  "duration_milliseconds": 8,
  "algorithm_version": "1.0.6",
  "session_id": "rses-f28bb94a-5556-4aeb-a6d2-89493626bf4f",
  "time": "2021-02-20T00:21:54.867231",
  "algorithm_name": "credit_card_approval",
  "request_id": "req-9f5345b4-a1cd-431c-a43a-bd2a06f4a6f4",
  "algorithm_owner": "asli"
}
```

### Configure Algorithmia Event Flows
Once your New Relic connector algorithm is published, configure it to get triggered whenever a Kafka topic receives a message. This Kafka topic will be the same as your Algorithmia Insights topic. This way, when an algorithm that has Insights enabled gets called and emits its metrics, the metrics payload will be used to call your New Relic connector algorithm.
Detailed instructions on how to configure this event based flow are in our Algorithmia Event Flows [documentation](https://algorithmia.com/developers/integrations/message-broker/).

Here’s how your configuration will look after you configure Algorithmia Insights and the New Relic connector algorithm for the same Kafka topic.

<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/newrelic/insights.png" alt="Architecture of NewRelic-Algorithmia integration for model performance metrics" class="screenshot">
You will have your Algorithm Insights collected in the configured broker’s topic.


<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/newrelic/brokers.png" alt="Architecture of NewRelic-Algorithmia integration for model performance metrics" class="screenshot">
You will have the same Kafka broker configured in your Broker Manager panel.


<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/newrelic/queue_algo_connection.png" alt="Architecture of NewRelic-Algorithmia integration for model performance metrics" class="screenshot">
You will add the New Relic connector algorithm as a Subscriber for the same topic used for Insights.


<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/newrelic/newrelic_queue.png" alt="Architecture of NewRelic-Algorithmia integration for model performance metrics" class="screenshot">
You will enable the New Relic algorithm’s specific version to consume from this queue.