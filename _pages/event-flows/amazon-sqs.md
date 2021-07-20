---
categories: event-flows
excerpt-short: "Set up algorithm Event Flows using an Amazon SQS message broker"
image:
    teaser: /language_logos/amazon_sqs.png
layout: article
permalink: /event-flows/amazon-sqs/
redirect_from:
 - /integrations/event_listeners/
 - /integrations/amazon-sqs/
show_related: true
tags: [integrations, event-flows]
title: "Amazon SQS Message Broker"
---

This feature is only available in Enterprise installations of Algorithmia.
{: .notice-enterprise}

This guide will walk you through setting up Algorithmia Event Flows using an [Amazon Simple Queue Service (SQS)](https://aws.amazon.com/sqs/) message broker. Once configured, you can create event-driven workflows in which your algorithms subscribe to the SQS queue, consuming its messages as algorithm input.

## How messages are read from SQS

The following diagram displays the interaction between SQS and Algorithmia. When a message is published to SQS, it's sent to Algorithmia as an API call, and if Algorithmia's API server returns `200 OK`, the message is queued for processing. If the API server returns `429 Too Many Requests`, the message is requeued in SQS with a 5-minute delay.

<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/eventlisteners/workflow.png" alt="SQS and Algorithmia Workflow Diagram">

To influence how much work Algorithmia will accept, you can tune either the maximum number of workers or the user session limit. On the SQS side, the option for "Maximum Receives" determines how many times a message will loop through this system. Since each loop is 5 minutes, messages will queue on the SQS side for (5 minutes) \* (Max Receives).
The [AWS documentation](https://aws.amazon.com/blogs/aws/amazon-sqs-new-dead-letter-queue/#:~:text=Maximum%20Receives%20%E2%80%93%20The%20maximum%20number,to%20the%20Dead%20Letter%20Queue.) specifies the Max Receives value as 10, but this can be increased up to 1000 to queue messages for more loops. When the Max Receives limit is hit, the message is delivered to the SQS Dead Letter Queue (DLQ).

## Setting up an Amazon SQS message broker

**NOTE:** Steps 1-3 are to be completed within the **AWS console**.
{: .notice-info}

### 1. Obtaining a template file and account info from Algorithmia

Contact [support@algorithmia.com](mailto:support@algorithmia.com) to obtain the following, which you'll need during CloudFormation setup:

- CloudFormation template file, `client-aws-cloudformation-template.yaml`
- AlgorithmiaAccountNumber
- QueueName
- QueueDLQName

### 2. Setting AWS user permissions

You'll need to have a user (or role that your user can assume) with the following AWS permissions:

**CloudFormation**: CreateStack and DescribeStacks (on all resources)

**IAM**: CreateRole, GetRole, and PutRolePolicy (on all resources)

**SQS**: CreateQueue, GetQueueAttributes, and SetQueueAttributes (on all resources)

### 3. Creating resources in AWS

Open the <a href="https://console.aws.amazon.com/cloudformation/home" target="_blank" rel="noopener noreferrer">CloudFormation page</a> in the AWS console.

<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/eventlisteners/image_0.png">

Click **Stacks** in the left-hand navigation menu, and then click **Create stack**.

On the resulting page, in the **Specify Template** section, select **Upload a template file** and then click **Choose file**. Navigate to the template file provided by Algorithmia (see [step 1](#1-obtaining-a-template-file-and-account-info-from-algorithmia)) and select it.

<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/eventlisteners/image_1.png">

Click **Next**.

On the following page, enter a **Stack name**. This should be a unique name that identifies the package of Amazon resources used for this configuration.

Under **AlgorithmiaAccountNumber**, enter Algorithmia’s AWS account number, provided to you by Algorithmia.

Under **QueueDLQName**, enter a unique name that identifies the Amazon SQS queue that'll be a holding queue for payloads that weren't accepted by the Algorithmia algorithm for _any_ reason (invalid message format, Algorithmia platform downtime, etc.).

Under **QueueName**, enter a unique name that identifies the SQS queue that'll be the source of payloads for the algorithm to run.

<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/eventlisteners/image_2.png">

Click **Next**.

The next page allows you to **Configure stack options**. If you need to use a specific IAM role that has the permissions specified in step 2, enter that role in the **Permissions** section. Otherwise, leave it blank.

<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/eventlisteners/image_3.png">

<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/eventlisteners/image_4.png">

<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/eventlisteners/image_5.png"><img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/eventlisteners/image_6.png">

Click **Next**.

The next page allows you to review your options. Scroll to the bottom and click the checkbox next to **I acknowledge that AWS CloudFormation might create IAM resources.**

<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/eventlisteners/image_7.png">

<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/eventlisteners/image_8.png">

Finally, click **Create stack**.

The next page will indicate that the stack creation is in progress.

<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/eventlisteners/image_9.png">

Click the **Stack info** tab.

<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/eventlisteners/image_10.png">

After about 60 seconds, click the grey refresh wheel (<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/eventlisteners/image_11.png">). It should show the **Stack status** as "CREATE_COMPLETE". If not, wait another 60 seconds and click the wheel again.

<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/eventlisteners/image_12.png">

Click the **Outputs** tab. Copy the **QueueURL** and **QueueConsumerARN**; you'll use them when connecting the message broker in the Algorithmia browser user interface (UI) in the [next step].

<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/eventlisteners/image_13.png">

**NOTE:** Step 4 is to be completed within the **Algorithmia browser UI**.
{: .notice-info}

### 4. Creating an Event Flow in Algorithmia

Note that _any_ algorithm can publish data to or subscribe to an SQS message broker. On our platform we call these pub-sub configurations "Event Flows", and the following demonstrates one possible example of how to set one up.

#### Create an algorithm

To begin, log in to the Algorithmia browser UI and create a Python 3.x algorithm with a generic Python 3.7 algorithm environment and default settings. If you need a quick guide for creating an algorithm, see our [getting started guide](/algorithm-development/your-first-algo).

On the newly created algorithm's profile, click the **Source** tab to access the Web IDE.

<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/eventlisteners/image_18.png">

In the source code below, replace the `COLLECTION_OWNER` and `COLLECTION_NAME` with your account name and the name of a data collection (which you'll create in the steps below), respectively. In the example screenshots below the code, `COLLECTION_OWNER` is `traack` and `COLLECTION_NAME` is `event_output_directory`.

```python
import Algorithmia

client = Algorithmia.client()

def apply(input):
    data_uri = "data://COLLECTION_OWNER/COLLECTION_NAME/" + input.get("filename")
    client.file(data_uri).put(input.get("data"))
```

<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/eventlisteners/image_19.png">

Click the **Save** and **Build** buttons and then click **Publish** when the build completes.

On the newly published algorithm's profile, copy the algorithm endpoint, which will be in the form `ALGO_OWNER/ALGO_NAME/ALGO_VERSION`; in the screenshot below, this is `traack/EventListenerAlgo/0.1.1`.

<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/eventlisteners/image_20.png">

#### Create a hosted data collection
Click the **Data Sources** menu item in the left sidebar.

<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/eventlisteners/image_21.png">

Click **My Hosted Data** on the main screen.

<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/eventlisteners/image_22.png">

Click the **New Collection** button in the top-right corner.

<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/eventlisteners/image_23.png">

In the dialog box that appears, enter the `COLLECTION_NAME` value from above (in this case, `event_output_directory`) and click **Create Collection**.

<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/eventlisteners/image_24.png">

#### Connect to SQS broker

This section documents the workflow in Algorithmia versions >=25.5.53. See the section [below](#create-an-event-listener) for the previous event listeners-based workflow.
{: .notice-info}

Navigate to your new algorithm's profile and click the **Events** tab and then the **Connect broker** button.

<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/eventlisteners/connect_sqs_broker_button.png">

In the modal, enter the **QueueURL** and **QueueConsumerARN** values from [step 3](#3-creating-resources-in-aws) for the **URI** and **ROLE ARN** fields, respectively.

The **Algorithm** endpoint field is auto-populated, and the full algorithm path is shown below the text input field. The version number is optional.

Optionally, enter a value for **Algorithm timeout in seconds**.

<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/eventlisteners/connect_sqs_broker_modal.png">

Click **Connect to Amazon SQS broker**. The **Events** tab on the algorithm profile will now list your newly created connection.

<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/eventlisteners/connect_sqs_broker_events_tab.png">

Click [here](#5-sending-messages-to-the-broker) to proceed to the next step to learn how to send messages to the newly connected broker.

#### Create an Event Listener

This section documents the workflow in Algorithmia versions <25.5.53, where Event Flows were called event listeners.
{: .notice-info}

Navigate to the **Home** tab on the left-hand navigation panel. Click on the **Create New** button and select **Event Listener**.

<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/eventlisteners/image_26.png">

In the modal, enter the **QueueURL** and **QueueConsumerARN** into the **URI** and **ROLE ARN** fields, respectively.

<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/eventlisteners/image_27.png">

Enter the full path to the algorithm you created above and click **Create New Event Listener**. The **Listeners** tab on the algorithm profile will now list your newly created event listener.

<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/eventlisteners/image_28.png">

### 5. Sending messages to the broker

Many methods exist for sending messages to Amazon SQS queues. Here we show what it looks like in the AWS console.

Open the <a href="https://console.aws.amazon.com/sqs/home" target="_blank" rel="noopener noreferrer">SQS</a> page in the AWS console. Click on the name of the queue (**QueueName**) that was created above in [step 3](#3-creating-resources-in-aws), and click the **Send and receive messages** button.

<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/eventlisteners/aws_console_send_messages.png">

In the **Send and receive messages** page, in the **Message body** field, enter the message payload to send to the algorithm you created above. In this case, it might be formatted like this.

```
{
    "filename" : "some-new-file",
    "data" : "file contents to store"
}
```

<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/eventlisteners/aws_console_sqs-message-body.png">

Click **Send Message** and the payload will be consumed by Algorithmia and sent to the configured algorithm as input for execution.

To verify, open the he **Data Sources** menu item in the left sidebar and navigate to the directory `COLLECTION_NAME` that you configured above as the destination for your algorithm to write data.

<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/eventlisteners/image_31.png">

Note that the directory contains a file with the filename specified in the payload and that the contents of the file include the data from the payload.

<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/eventlisteners/image_32.png">