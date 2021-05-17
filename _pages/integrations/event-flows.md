---
layout: article
title: "Algorithmia Event Flows"
excerpt-short: "Set up message broker connections and topics that can be enabled to process algorithm data"
categories: [integrations]
tags: [integrations]
show_related: true
redirect_from:
- /integrations/message-broker/
---
Create event-driven algorithm workflows to move towards automating your machine learning deployment and monitoring pipelines. We make it easy to ensure connections from your Algorithmia Enterprise cluster to your externally hosted message brokers are secure, provide observability features for easy debugging, and provide an intuitive user interface for data scientists and application developers to create algorithm workflows that respond to events such as new messages written to a queue, or successful algorithm runs. Algorithmia Event Flows allow you to create dynamic data processing and inference pipelines with a few easy steps.

This guide will help Enterprise cluster administrators set up message broker connections, and show members of Enterprise organizations how to activate event-driven workflows for any organization-owned algorithm their cluster administrator has enabled.

This is only available for Enterprise installations of Algorithmia.
{: .notice-enterprise}

## Creating and Configuring a Broker Connection in the Algorithmia platform

Cluster administrators can set up connections to configured message brokers on external clusters that the customer owns.

Open the Algorithmia Web user interface and log in with an admin account.

Under the Admin menu, click on the "Broker Manager" menu item (under the "System Actions" category) to see a list of configured broker connections.

<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/message-broker/broker-connection-list.png" alt="A broker connection list">

To create a new broker connection, click on the "Connect Broker" button. This will bring up a form where the admin will fill in the proper configuration options. When filled in, click on the "Connect to Kafka Broker" button to make the connection. When successful, the admin will see the new connection in the list of configured brokers. 

In addition to Kafka, algorithmia supports Amazon SQS and Azure SB brokers.
{: .notice-info}

<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/message-broker/broker-connection-create.png" alt="Creating a broker connection">

Click on a configured broker connection in the list to view its details and the list of topics set up for this broker connection. This details page is where the cluster administrator will also configure the algorithms that have access to these topics. Also on this page is an action button to delete the broker connection. Clicking it will present a confirmation dialog. After confirming, the broker connection will be removed from the list and unavailable for algorithms to use.

There is no mechanism for editing a broker connection once created. It is recommended to create a new one, and delete the one that it is replacing.
{: .notice-info}

<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/message-broker/broker-connection-details.png" alt="Broker connection details">

To make topics available to specific algorithms, the admin will select a topic on the broker connection details page. A sidesheet will open on the right that will contain details about the topic, including the list of algorithms with access to the selected topic.

<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/message-broker/broker-connection-topic-details.png" alt="Broker connection topic details">

To edit the topic details, click on the "Edit" button at the top of the sidesheet. This will open a page where algorithms can be added or removed from the access list. After performing the additions or deletions of algorithms to the topic, the admin must click the "Save changes" button to submit the changes. When the changes are saved successfully, the page will return to the broker connection details.

<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/message-broker/broker-connection-topic-edit.png" alt="Editing a broker connection topic">


## Enable event-driven algorithm workflows

Once a cluster administrator sets up a broker connection and allows access to queues for a specific organization-owned algorithm, members of that organization will be able to enable those queues with a version of the specific algorithm.

Open the Algorithmia Web user interface and log in.

Click on the Algorithms menu item and select an existing algorithm that has been configured with access to topics via the broker connection configuration following the admin steps [above](#creating-and-configuring-a-broker-connection-in-the-algorithmia-platform). Click on the Queues tab to see a list of queues that the algorithm can access. There are action buttons on the right side of each listed queue. Depending on its state, the user will see an "Enable" button if the queue is disabled for the algorithm, and "Disable" and "Edit" buttons if the queue is enabled for the algorithm. 

<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/message-broker/algorithm-queue-list.png" alt="Algorithm queue list">

Clicking on the "Disable" button will present a confirmation dialog. Once confirmed, the queue will no longer process the algorithm data.

Clicking on the "Enable" or "Edit button will present a dialog to select the appropriate algorithm version. Once a version is selected, submit it with the "Enable Listener" or "Save Changes" button to allow the queue to process algorithm data. 

<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/message-broker/algorithm-queue-enable.png" alt="Algorithm queue enable">

Clicking on the "Enable Dead Letter Queue" checkbox 
will allow you to select a Dead Letter Queue topic for an algorithm. Once a Dead Letter Queue topic name has been selected, click the "Enable Listener" or "Save Changes" button to allow faulty messages to be sent to the selected Dead Letter Queue topic name.

<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/message-broker/algorithm-queue-enable-dlq.png" alt="Algorithm queue enable a Dead Letter Queue topic">
