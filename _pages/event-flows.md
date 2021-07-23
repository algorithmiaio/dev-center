---
excerpt-short: "Level up your ML pipeline automation with event-driven workflows."
layout: article
nav_overview: "Overview"
nav_index: 0
redirect_from: /integrations/event-flows/
show_related: true
tags: [event-flows-overview, integrations]
title: "Algorithmia Event Flows"
---

This feature is only available in Algorithia Enterprise installations.
{: .notice-enterprise}

With Algorithmia Event Flows, you can create dynamic, event-driven data processing and inference pipelines in just a few easy steps, helping you automate ML deployment workflows.

Event Flows provides an easy way to establish secure connections from your Algorithmia Enterprise cluster to your externally hosted message brokers. With the simple user interface, you can then efficiently create algorithm workflows that respond to events such as new records written to a queue, or to successful algorithm executions.

**NOTE**: Although Algorithmia Event Flows and Algorithmia Insights may both be used with Apache Kafka, the two features are distinct with respect to both configuration and intended usage. Event Flows is built to support event-driven workflows, where publisher algorithms send their output (return) values to a topic or queue on a broker, and subscriber algorithms read records from a topic or queue on a broker. In contrast, Insights is built to enable algorithms to emit operational and inference metrics from the body of the algorithm during execution, for consumption by an external monitoring service.
{: .notice-info}

## Supported message brokers

We currently support the following two "flavors" of message broker:

1. Apache Kafka (available on all Enterprise clusters)
2. One of the following two queueing services, depending on your Algorithmia installation:
    - Amazon Simple Queue Service (SQS)
    - Azure Service Bus (SB)

These message brokers are categorized separately because their configuration and capabilities differ.

In the Kafka workflow, a connection to an externally managed Kafka broker is configured at the cluster level and an algorithm is then associated with a topic on that broker. The connection must then be enabled at the algorithm level for the Event Flow to function. As an Event Flows message broker, Kafka supports both publisher and subscriber algorithm configurations.

In the SQS/SB workflow, no cluster-level configuration is required; the broker connection occurs only at the algorithm level. Event flows using these message brokers currently only support a subscription-based workflow (i.e., algorithms cannot publish records to these brokers).

These configuration differences are summarized below. For details on how to configure Event Flows using each specific message broker, see the corresponding linked documentation.

### Apache Kafka

Algorithmia doesn't come provisioned with its own Kafka broker, so to [use Kafka with Event Flows](/developers/event-flows/apache-kafka), you must have access to an externally managed Kafka broker. This can be an existing broker that's already configured in your IT environment, or a broker that you set up specifically for use with the Algorithmia platform. The following three steps are required:

1. A cluster admin must [create a broker connection](https://training.algorithmia.com/exploring-the-admin-panel/807062) to an existing external Kafka broker. Note that with Event Flows, you can establish connections to multiple Kafka brokers from the same Algorithia cluster.
2. A cluster admin must "add" a specific algorithm to a specific topic on a connected broker to allow that algorithm to access that topic. Existing topics on connected brokers are listed automatically in the admin panel within the Algorithmia browser UI. Specifically, to enable algorithm access, the cluster admin must:
    1. Add the algorithm of interest to the desired topic.
    2. Select whether the algorithm of interest will publish messages to, or subscribe to messages from, the topic.
3. In the algorithm profile's **Events** tab, a user must then **Enable** the connection for the algorithm and specify which version of the algorithm to use in the Event Flow.

### Amazon SQS / Azure SB

To use [Amazon SQS](/developers/event-flows/amazon-sqs/) or [Azure SB](/developers/event-flows/azure-sb/) as a message broker, simply connect the message broker under an algorithm profile's **Events** tab, specifying the relevant resource URIs and optionally a timeout duration.

## FAQs

**Q**: How are the various message broker connections scoped? At the cluster level? At the account level? At the algorithm level?<br/>
**A**: [Amazon SQS](/developers/event-flows/amazon-sqs/) and [Azure SB](/developers/event-flows/azure-sb/) broker connections are scoped at the algorithm level. They're configured through the **Events** tab on each algorithm's profile, and require no configuration on the side of the cluster admin. In contrast, [Apache Kafka](/developers/event-flows/apache-kafka) broker connections are created at the cluster level, but algorithms must still be granted access to publish or subscribe to broker topics at the individual algorithm level. Note that Kafka-based Event Flows must still be enabled at the algorithm level in the algorithm profile's **Events** tab, but the broker connection itself is scoped to the cluster.

---

**Q**: Can my algorithms subscribe to messages from Azure Event Hubs?<br/>
**A**: Yes. Although Algorithmia doesn't currently have a native integration with Azure Event Hubs, you can use one of Microsoft's official SDKs, for example the `azure-eventhub` [Python package](https://docs.microsoft.com/en-us/azure/event-hubs/event-hubs-python-get-started-send) or the `azure-messaging-eventhubs` [Java client library](https://docs.microsoft.com/en-us/azure/event-hubs/event-hubs-java-get-started-send) to send and receive messages from within your algorithms.

---

**Q**: What sort of administrative controls do I have over the SQS queues being used with Event Flows?<br/>
**A**: There are no administrative controls within the Algorithmia platform itself that enable you to to explicitly prohibit algorithms from subcribing to SQS queues. However, the configuration on the AWS side will dictate which SQS queues are reachable from algorithms on your cluster. Specific AWS-side configurations must be completed if SQS queues are created in AWS accounts other than the AWS account running the Algorithia instance, so this provides a level of control in that algorithms can't connect to SQS queues in arbitrary AWS accounts. For a deep dive into understanding the various IAM configuration scenarios you might encounter when setting up Event Flows with SQS, see the [Amazon SQS message broker docs](/developers/event-flows/amazon-sqs#scenarios).

---

**Q**: Is there a way to get an overview of all the Event Flows that I've configured?<br/>
**A**: Yes. The `users` API provides functionality for listing all Event Flows configured for algorithms owned by a specific acount. To list the Event Flows, you'll first need to get the value of your user ID. With this ID, you can then query the `event-listeners` endpoint to list your configured Event Flows. A cURL command to get the user ID is shown below. Note that this endpoint requires an [admin API key](/developers/glossary/#admin-api-key) `ADMIN_API_KEY` and you'll need to replace `CLUSTER_DOMAIN` and `ACCOUNT_NAME` with your [cluster domain](/developers/glossary/#cluster-domain) and your [account](/developers/glossary/#account) name, respectively.

###### Request
```shell
curl -X GET https://api.CLUSTER_DOMAIN/v1/users/ACCOUNT_NAME -H 'Authorization: Simple ADMIN_API_KEY'
```
###### Response
```json
{
  "id": "08d3d78a-012e-41d2-813e-670066c153be",
  "username": "ezra",
  "email": "ecitron@algorithmia.io",
  "fullname": "Ezra Citron",
  "company_role": "engineer",
  "self_link": "https://api.algorithmia.com/v1/users/ezra",
  "resource_type": "user"
}
```

You can now use this `id` value to replace `USER_ID` in the code below. Note that you'll now need to provide a standard (non-admin) [API key](/developers/glossary/#api-key).

###### Request
```shell
curl -X GET https://api.CLUSTER_DOMAIN/v1/users/USER_ID/event-listeners -H 'Authorization: Simple API_KEY'
```
###### Response
```json
[
  {
    "id": "08d3d78a-012e-41d2-813e-670066c153be",
    "sourceType": "AmazonSQS",
    "sourceURI": "https://sqs.us-west-2.amazonaws.com/749083412891/demo-queue",
    "algoName": "testSQSEventFlow",
    "algoOwner": "ezra",
    "listenerOwner": "ezra",
    "credentials": "arn:aws:iam::749083412891:role/demo-sqs-event-flow-algoqueuerole-C4YFWYBAH69Q"
  }
]
```

---

**Q**: Is there a way to list all Event Flows that've been configured on the cluster as a whole?<br/>
**A**: There's not currently an API endpoint or UI feature to list all Event Flows configured on the cluster. Event Flows can be listed at the account level only, as described above.

---

**Q**: In the current implementation of Kafka Event Flows, as a cluster admin I can only add published algorithms to a broker topic. If a user would like to test an algorithm build with a specific broker topic before publishing it, is there a way to enable that?<br/>
**A**: There isn't currently a way to add unpublished algorithms to a topic for use with Event Flows. If you need to test a new algorithm build with Event Flows, we recommend publishing a new minor version for testing.