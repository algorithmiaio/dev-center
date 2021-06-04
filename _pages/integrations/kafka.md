---
layout: article
title: "Algorithmia Event Flows"
excerpt-short: "Set up message broker connections and topics that can be enabled to process algorithm data"
categories: event-flows
tags: [integrations, event-flows]
permalink: integrations/kafka
show_related: true
redirect_from:
  - /integrations/message-broker/
  - /integrations/event-flows
---

With Algorithmia Event Flows, you can create dynamic, event-driven data processing and inference pipelines in just a few easy steps, helping you toward automating ML deployment and monitoring pipelines.

Event Flows provides an easy way to establish secure connections from your Algorithmia Enterprise cluster to your externally hosted message brokers. We provide observability features for easy debugging, as well as an intuitive user interface (UI) for data scientists and application developers to create algorithm workflows that respond to events such as new messages written to a queue, or successful algorithm runs.

This is only available for Enterprise installations of Algorithmia.
{: .notice-enterprise}

## Creating and configuring a broker connection in the Algorithmia platform

In order to use Event Flows, a cluster administrator must first [connect an external message broker](https://training.algorithmia.com/exploring-the-admin-panel/807062) to the cluster.

Once at least one message broker is connected, members of Enterprise organizations can activate event-driven workflows for any organization-owned algorithm that a cluster administrator has enabled.

Note that in addition to Kafka, algorithmia supports [Amazon SQS](/developers/integrations/amazon-sqs/) and [Azure SB](/developers/integrations/azure-sb) message brokers.
{: .notice-info}

## Enabling event-driven algorithm workflows

Once a cluster administrator sets up a broker connection and allows publish or subscribe access to a specific topic for a specific organization-owned algorithm, members of that organization will be able to activate event flows for that algorithm.

To get started, log in to the Algorithmia browser UI and click on the ML service catalog menu item to view the list of available algorithms. Select an existing algorithm that's been configured with access to topics via the broker connection configuration (following the admin steps [above](#creating-and-configuring-a-broker-connection-in-the-algorithmia-platform)).

Click on the **Events** tab to see a list of broker topics that the algorithm can access. There are action buttons on the right side of each listed broker. Depending on the state of the topic, you'll see an **Enable** button if the topic is disabled for the algorithm, and **Disable** and **Edit** buttons if the topic is enabled for the algorithm.

<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/message-broker/algorithm-queue-list.png" alt="Algorithm queue list">

Clicking the **Disable** button will present a confirmation dialog. Once confirmed, the algorithm data will no longer be sent to the topic.

Clicking on the **Enable** or **Edit** button will present a dialog to select the appropriate algorithm version. Once a version is selected, submit it with the **Enable Listener** or **Save Changes** button to allow the topic to receive algorithm data.

<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/message-broker/algorithm-queue-enable.png" alt="Algorithm queue enable">

Clicking on the **Enable Dead Letter Queue** checkbox allows you to select a Dead Letter Queue topic for an algorithm. Once a Dead Letter Queue topic name has been selected, click the **Enable Listener** or **Save Changes** button to allow faulty messages to be sent to the selected Dead Letter Queue topic name.

<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/message-broker/algorithm-queue-enable-dlq.png" alt="Algorithm queue enable a Dead Letter Queue topic">
