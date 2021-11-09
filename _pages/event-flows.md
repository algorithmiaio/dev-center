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

Some components of this feature are only available in Algorithmia Enterprise installations.
{: .notice-enterprise}

With Algorithmia Event Flows, you can create dynamic, event-driven data processing and inference pipelines in just a few easy steps, helping you automate ML deployment workflows.

Event Flows provides an easy way to establish secure connections from your Algorithmia Enterprise* cluster to your externally hosted message brokers. With the simple user interface, you can then efficiently create algorithm workflows that respond to events such as new records written to a queue, or to successful algorithm executions. (*Messaging through external SDKs from within the body of an algorithm is supported for all customers as long as internet access is enabled in an algorithm's settings.)

**NOTE**: Although Algorithmia's **Event Flows** and **Insights** features may both be used with event-streaming platforms (i.e., Apache Kafka, Azure Event Hubs, etc.), the two features are distinct with respect to both configuration and intended usage.<br/><br/>**Event Flows** is built to support event-driven workflows, where publisher algorithms send their output (return) values to a topic or queue on a broker, and subscriber algorithms read records from a topic or queue on a broker. For Event Flows, connections can be established to multiple message brokers from one Algorithmia cluster.<br/><br/>**Insights** is built to enable algorithms to emit operational and inference metrics from the body of an algorithm during execution, for consumption by an external monitoring service. The current implementation of Insights only supports one Algorithmia &harr; external message broker connection.
{: .notice-info}

## Supported message brokers

The following message brokers are currently supported natively:

- [Apache Kafka](/developers/event-flows/apache-kafka) (available on all Enterprise clusters)
- [Amazon Simple Queue Service (SQS)](/developers/event-flows/amazon-sqs/) (available on AWS-hosted Enterprise clusters)
- [Azure Service Bus (SB)](/developers/event-flows/azure-sb/) (available on Azure-hosted Enterprise clusters)

As an integration-first platform, we also encourage the use of other messaging services that you may be using. Such services include but are not limited to:

- [Azure Event Hubs (EH)](/developers/event-flows/azure-eh/) (available on all clusters via SDK)

These message brokers are categorized separately because their configuration and capabilities differ in Algorithmia's current implementation.

In the Kafka workflow, a connection to an externally managed Kafka broker is configured at the cluster level and an algorithm is then associated with a topic on that broker. The connection must then be enabled at the algorithm level for the Event Flow to function. In the Amazon SQS / Azure SB workflow, no cluster-level configuration is required; the broker connection occurs only at the level of an individual algorithm. In the Azure EH workflow, the message broker connection is established via external SDK from within an algorithm's code, so it is scoped to the individual algorithm as well.

**NOTE**: With a Kafka message broker, the Event Flows feature supports both publisher and subscriber algorithms. With SQS and SB message brokers, the native integration currently only supports subscription-based workflows, but the respective SDKs can be used to extend this functionality.
{: .notice-info}

These configuration differences are summarized visually below. For details on how to configure Event Flows using each specific message broker, see the corresponding linked documentation in the following section.

<div class="syn-styles-supported">
  <div class="syn-table-container scrollable-x" markdown="1">

{:.syn-table.condensed}
| Broker       | Publish  | Subscribe |
| :--          | :--:     | :--:      |
| Apache Kafka | Native   | Native    |
| Amazon SQS   | [SDK][1] | Native    |
| Azure SB     | [SDK][2] | Native    |
| Azure EH     | [SDK][3] | [SDK][4]  |

  </div>
</div>

[1]: https://boto3.amazonaws.com/v1/documentation/api/latest/guide/sqs-example-sending-receiving-msgs.html
[2]: https://docs.microsoft.com/en-us/azure/service-bus-messaging/service-bus-python-how-to-use-queues
[3]: https://docs.microsoft.com/en-us/azure/event-hubs/event-hubs-python-get-started-send#send-events
[4]: https://docs.microsoft.com/en-us/azure/event-hubs/event-hubs-python-get-started-send#receive-events

### Apache Kafka

Algorithmia doesn't come provisioned with its own Kafka broker, so to [use Kafka with Event Flows](/developers/event-flows/apache-kafka), you must have access to a Kafka broker managed externally to the Algorithmia platform. This can be an existing broker that you're already using with other services, or a broker that you set up specifically for use with Algorithmia. Additionally, you may choose to configure the broker within your IT environment or externally, for example using a fully managed Kafka service.

Regardless of your exact Kafka configuration, the following three steps are required:

1. A cluster admin must [create a broker connection](/developers/administration/admin-panel/broker-manager#creating-broker-connections) to an existing external Kafka broker. Note that with Event Flows, you can establish connections to multiple Kafka brokers from the same Algorithmia cluster.
2. A cluster admin must "add" a specific algorithm to a specific topic on a connected broker to allow that algorithm to access that topic. Existing topics on connected brokers are listed automatically in the admin panel within the Algorithmia browser UI. Specifically, to enable algorithm access, the cluster admin must:
    1. Add the algorithm of interest to the desired topic.
    2. Select whether the algorithm of interest will publish messages to, or subscribe to messages from, the topic.
3. In the algorithm profile's **Events** tab, a user must then **Enable** the connection for the algorithm and specify which version of the algorithm to use in the Event Flow.

### Amazon SQS / Azure SB

To use [Amazon SQS](/developers/event-flows/amazon-sqs/) or [Azure SB](/developers/event-flows/azure-sb/) as a message broker to which algorithms will subscribe, simply connect the message broker under an algorithm profile's **Events** tab, specifying the relevant resource URIs and optionally a timeout duration. On the publisher side, you can use the corresponding SDK (linked in the table above) from within your algorithm source code.

### Azure EH

To use [Azure EH](/developers/event-flows/azure-eh/) as a message broker, you can use the official Event Hubs SDK (linked in the table above) from within your algorithm source code.

## FAQs

**Q**: <em>How are the various message broker connections scoped? At the cluster level? At the account level? At the algorithm level?</em><br/>
**A**: [Amazon SQS](/developers/event-flows/amazon-sqs/) and [Azure SB](/developers/event-flows/azure-sb/) broker connections are scoped at the algorithm level. They're configured through the **Events** tab on each algorithm's profile, and require no additional configuration on the part of the cluster admin. In contrast, [Apache Kafka](/developers/event-flows/apache-kafka) broker connections are created at the cluster level, but algorithms must still be granted access to publish or subscribe to broker topics at the individual algorithm level. Note that Kafka-based Event Flows must still be enabled at the algorithm level in the algorithm profile's **Events** tab, but the broker connection itself is scoped to the cluster. [Azure EH](/developers/event-flows/azure-eh/) broker connections are scoped at the algorithm level; beyond internet access, these connections require no additional configuration within the Algorithmia platform.

---

**Q**: <em>What sort of administrative controls do I have over the SQS queues being used with Event Flows?</em><br/>
**A**: There are no administrative controls within the Algorithmia platform itself that enable you to to explicitly prohibit algorithms from subcribing to SQS queues. However, the configuration on the AWS side will dictate which SQS queues are reachable from algorithms on your cluster. If SQS queues are created in AWS accounts other than the AWS account running the Algorithmia instance, specific AWS-side configuration steps must be completed, meaning that algorithms can't connect to SQS queues in arbitrary AWS accounts. For a deep dive into understanding the various IAM configuration scenarios you might encounter when setting up Event Flows with SQS, see the [Amazon SQS message broker docs](/developers/event-flows/amazon-sqs#scenarios).

---

**Q**: <em>In the current implementation of Kafka Event Flows, as a cluster admin I can only add published algorithms to a broker topic. If a user would like to test an algorithm build with a specific broker topic before publishing it, is there a way to enable that?</em><br/>
**A**: There isn't currently a way to add unpublished algorithms to a topic for use with Event Flows. If you need to test a new algorithm build with Event Flows, we recommend publishing a new minor version for testing.

---

**Q**: <em>Is there a way to list all the Event Flows that I've configured?</em><br/>
**A**: Yes. The `users` API provides functionality for listing all Event Flows configured for algorithms owned by a specific acount. To list the Event Flows, you'll first need to get the value of your user ID. With this ID, you can then query the `event-listeners` endpoint to list your configured Event Flows.

Note that the Algorithmia platform is only aware of native Event Flow configurations, so any message broker connections that are established via external SDKs from within an algorithm's source code won't be listed.

You can use the first command below to get your user ID. Note that this endpoint requires an [admin API key](/developers/glossary/#admin-api-key) `ADMIN_API_KEY` and you'll need to replace `CLUSTER_DOMAIN` and `ACCOUNT_NAME` with your [cluster domain](/developers/glossary/#cluster-domain) and your [account](/developers/glossary/#account) name, respectively.

###### Request
```shell
curl -X GET https://api.CLUSTER_DOMAIN/v1/users/ACCOUNT_NAME -H 'Authorization: Simple ADMIN_API_KEY'
```
###### Response
```json
{
  "id": "08d3d78a-012e-41d2-813e-670066c153be",
  "username": "ACCOUNT_NAME",
  "email": "demo_account@algorithmia.com",
  "fullname": "Demo Account",
  "company_role": "engineer",
  "self_link": "https://api.algorithmia.com/v1/users/ACCOUNT_NAME",
  "resource_type": "user"
}
```

You can use th `id` value from the response to replace `USER_ID` in the code below. Note that the command below requires a [standard (non-admin) API key](/developers/glossary/#standard-api-key).

###### Request
```shell
curl -X GET https://api.CLUSTER_DOMAIN/v1/users/USER_ID/event-listeners -H 'Authorization: Simple STD_API_KEY'
```
###### Response
```json
[
  {
    "id": "08d3d78a-012e-41d2-813e-670066c153be",
    "sourceType": "AmazonSQS",
    "sourceURI": "https://sqs.us-west-2.amazonaws.com/783449028191/demo-queue",
    "algoName": "testSQSEventFlow",
    "algoOwner": "ACCOUNT_NAME",
    "listenerOwner": "ACCOUNT_NAME",
    "credentials": "arn:aws:iam::783449028191:role/demo-sqs-event-flow-algoqueuerole-C4YBAFWYH69Q"
  }
]
```

---

**Q**: <em>Is there a way to list all Event Flows that've been configured on the cluster?</em><br/>
**A**: There's not currently an API endpoint or UI feature to list all Event Flows configured on the cluster. Event Flows can be listed at the account level only, as described above.
