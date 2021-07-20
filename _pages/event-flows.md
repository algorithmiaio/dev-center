---
categories: event-flows
excerpt-short: "Level up your ML pipeline automation with event-driven workflows."
layout: article
nav_overview: "Overview"
nav_index: 0
redirect_from: /integrations/event-flows/
show_related: true
tags: [event-flows, integrations]
title: "Algorithmia Event Flows"
---

This feature is only available in Algorithia Enterprise installations.
{: .notice-enterprise}

With Algorithmia Event Flows, you can create dynamic, event-driven data processing and inference pipelines in just a few easy steps, helping you automate ML deployment workflows.

Event Flows provides an easy way to establish secure connections from your Algorithmia Enterprise cluster to your externally hosted message brokers. With the simple user interface, you can then efficiently create algorithm workflows that respond to events such as new records written to a queue, or to successful algorithm executions.

Although Algorithmia Event Flows and Algorithmia Insights may both be used with Apache Kafka, the two features are distinct with respect to both configuration and intended usage. Event Flows is built to support event-driven workflows, where publisher algorithms send their output (return) values to a topic on a Kafka broker, and subscriber algorithms read records from a topic on a Kafka broker. In contrast, Insights is built to enable algorithms to emit operational and inference metrics from the body of the function during execution, for consumption by an external monitoring service.
{: .notice-info}

## Supported message brokers

We currently support the following two "flavors" of message broker:

1. Apache Kafka (available on all Enterprise clusters)
2. One of the following two queueing services, depending on your Algorithmia installation:
    - Amazon Simple Queue Service (SQS)
    - Azure Service Bus (SB)

These message brokers are categorized separately because their configuration and capabilities differ.

In the Kafka workflow, a connection to a Kafka broker is configured at the cluster level and an algorithm is then associated with a topic on that broker. The connection then must be enabled at the algorithm level. As an Event Flows message broker, Kafka supports both publisher and subscriber algorithm configurations.

In the SQS/SB workflow, no cluster-level configuration is required. The broker connection occurs only at the algorithm level. Event flows using these message brokers currently only support a subscription-based workflow (i.e., algorithms cannot publish records to these brokers).

The configuration differences are summarized below. For details on how to configure Event Flows using each specific message broker, see the corresponding linked documentation.

### Apache Kafka

To [use Kafka as a message broker](/developers/integrations/apache-kafka), the following three steps are required:

1. A cluster administrator must [create a broker connection](https://training.algorithmia.com/exploring-the-admin-panel/807062) to an existing external Kafka broker. Note that with Event Flows, you can establish connections to multiple Kafka brokers from the same Algorithia cluster.
2. A cluster administrator must "add" specific algorithms to specific topics on a connected broker to allow them to access these topics. Existing topics on connected brokers are listed automatically in the admin panel within the Algorithmia browser UI. Specifically, to enable algorithm access, the cluster administrator must:
    1. Add the algorithm of interest to the desired topic.
    2. Select whether the algorithm of interest will publish messages to, or subscribe to messages from, the topic.
3. In an algorithm profile's **Events** tab, a user must then **Enable** the connection for the algorithm and specify which version of the algorithm to use.

### Amazon SQS / Azure SB

To use [Amazon SQS](/developers/integrations/amazon-sqs/) or [Azure SB](/developers/integrations/azure-sb/) as a message broker, simply connect the message broker under the algorithm profile's **Events** tab by specifying the relevant resource URIs.