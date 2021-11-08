---
categories: admin-panel
layout: article
title: Broker Manager
---

Beginning in Algorithmia version 20.5.51, the Broker Manager page contains functionality for cluster admins to configure connections to Kafka message brokers that are managed externally from the Algorithmia platform, for use with [Algorithmia Event Flows](https://algorithmia.com/developers/integrations/event-flows). Once these broker connections are configured, non-admin cluster users can [leverage them to architect event-driven workflows](https://algorithmia.com/developers/integrations/kafka).

## Creating broker connections

The Broker Manager page displays a list of configured broker connections.

![A broker connection list](https://cdn.algorithmia.com/developers/images/post_images/message-broker/broker-connection-list.png)

To **create a new broker connection**, click on the **Connect Broker** button. In the modal, shown below, fill in the appropriate configuration options and click the **Connect to Kafka Broker** button to make the connection. When successful, the new connection will appear in the list of configured brokers.

Note that in addition to Kafka, Algorithmia supports [Amazon SQS](https://algorithmia.com/developers/integrations/amazon-sqs/) and [Azure SB](https://algorithmia.com/developers/integrations/azure-sb) message brokers.

![Creating a broker connection](https://cdn.algorithmia.com/developers/images/post_images/message-broker/broker-connection-create.png)

Click on a configured broker connection in the list to view its details and the list of topics set up for this broker connection. This details page is where the cluster admin will also configure the algorithms that have access to these topics.

## Deleting broker connections

To **delete a broker connection**, click the corresponding row in the table and click the delete (trash can) icon. When you click the confirmation dialog to confirm deletion, the broker connection is removed from the list and unavailable for algorithms to use. Note that there's no mechanism for editing a broker connection once created. Instead, we recommend you create a new broker connection with the desired configuration and delete the one that it's replacing.

![Broker connection details](https://cdn.algorithmia.com/developers/images/post_images/message-broker/broker-connection-details.png)

## Configuring broker topics

To make topics available to specific algorithms, the cluster admin will select a topic on the broker connection details page. A side sheet will open on the right that will contain details about the topic, including the list of algorithms with access to the selected topic.

![Broker connection topic details](https://cdn.algorithmia.com/developers/images/post_images/message-broker/broker-connection-topic-details.png)

To edit the topic details, click on the **Edit** button at the top of the side sheet. This will open a page where algorithms can be added or removed from the access list. After performing the additions or deletions of algorithms to the topic, the click the **Save changes** button to submit the changes. When the changes are saved successfully, the page will return to the broker connection details.

![]({{site.url}}/developers/images/post_images/algo-images-admin/algo-1626809842938.png)

## Enable event-driven algorithm workflows

Once you've set up a broker connection and allowed access to queues for a specific organization-owned algorithm, members of that organization will be able to enable those queues with a version of that specific algorithm. To learn about how to enable event flows, see our [Event Flows docs](https://algorithmia.com/developers/integrations/message-broker). For troub<span style="font-family: inherit; font-size: 1em;">leshooting, see the</span> [Logs](./687279#viewing-event-listener-logs) <span style="font-family: inherit; font-size: 1em;">page.</span>