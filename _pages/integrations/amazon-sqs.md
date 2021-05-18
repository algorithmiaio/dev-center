---
categories: event-flows
excerpt-short: "Set up algorithm event flows using an Amazon SQS message broker"
image:
    teaser: /language_logos/amazon_sqs.png
layout: article
permalink: /integrations/amazon-sqs/
redirect_from:
  - /integrations/event_listeners/
show_related: true
tags: [integrations, event-flows]
title: "Amazon SQS Message Broker"
---

This guide will walk you through setting up an Amazon Simple Queue Service (SQS) message broker on Algorithmia. Once configured, you can create event-driven workflows in which your algorithms publish messages to and consume messages from the SQS queue.

This feature is only available for Enterprise installations of Algorithmia.
{: .notice-enterprise}

## How messages are read from SQS

The following diagram displays the interaction between SQS and Algorithmia. When a message is published to SQS, it's sent to Algorithmia as an API call. If the API server returns `200 OK`, the message is queued for processing on Algorithmia. If the API server returns `429 Too Many Requests`, the message is requeued in SQS with a 5-minute delay.

<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/eventlisteners/workflow.png" alt="SQS and Algorithmia Workflow Diagram">

To influence how much work Algorithmia will accept, you can tune either the maximum number of workers, or the user session limit. On the SQS side, the option for "Maximum Receives" determines how many times a message will loop through this system. Since each loop is 5 minutes, messages will queue on the SQS side for (5 minutes) \* (Max Receives).
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

Open the [CloudFormation page](https://console.aws.amazon.com/cloudformation/home) in the AWS console.

<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/eventlisteners/image_0.png">

Click the **Create stack** button.

On the following page, select **Upload a template file** and then click **Choose file**. Navigate to the template file provided by Algorithmia (see step 1) and select it.

<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/eventlisteners/image_1.png">

Click **Next**.

On the following page, enter the **Stack name**. This should be a unique name that identifies the package of Amazon resources used for this configuration.

Enter the **AlgorithmiaAccountNumber**. This is Algorithmia’s AWS account number, provided to you by Algorithmia.

Enter the **QueueName**. This should be a unique name that identifies the SQS queue that'll be the source of payloads for the algorithm to run.

Enter the **QueueDLQName**. This should be a unique name that identifies the Amazon SQS queue that'll be a holding queue for payloads that weren't accepted by the Algorithmia algorithm for _any_ reason (invalid message format, Algorithmia platform downtime, etc.).

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

After about 60 seconds, click the grey refresh wheel (<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/eventlisteners/image_11.png">). It should show the **Stack status** as CREATE_COMPLETE. If not, wait another 60 seconds and click the wheel again.

<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/eventlisteners/image_12.png">

Click the **Outputs** tab. Copy the **QueueURL** and **QueueConsumerARN**; you'll use them when configuring the message broker in the Algorithmia browser user interface (UI) in the next step.

<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/eventlisteners/image_13.png">

**NOTE:** Step 4 is to be completed within the **Algorithmia browser UI**.
{: .notice-info}

### 4. Creating an event configuration in Algorithmia

Note that _any_ algorithm can publish data to or subscribe to an SQS message broker. On our platform we call these pub-sub configurations "event configurations", and the following demonstrates one possible example of how to set one up.

To begin, log in to the Algorithmia browser UI and create a Python 3.x algorithm with a generic Python 3.7 algorithm environment and default settings. To learn how to complete the algorithm-creation step, see our [getting started guide](/algorithm-development/your-first-algo).

On the homepage for the newly created algorithm, click the **Source** tab to access the Web IDE.

<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/eventlisteners/image_18.png">

Replace the original source code with the following, replacing `COLLECTION_OWNER` and `COLLECTION_NAME` with your account name and the name of the output collection, respectively. In the example screenshots below the code, `COLLECTION_OWNER` is "traack" and `COLLECTION_NAME` is "event_output_directory".

{% highlight python %}
import Algorithmia

def apply(input):
    Algorithmia.client().file("data://COLLECTION_OWNER/COLLECTION_NAME/"
     + input.get("filename")).put(input.get("data"))
{% endhighlight %}

<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/eventlisteners/image_19.png">

Click the **Save** and **Build** buttons and then click **Publish** when the build completes.

On the newly published algorithm's homepage, copy the full "path" to the algorithm, which will be `ALGO_OWNER/ALGO_NAME/ALGO_VERSION`; in the screenshot below, this is `traack/EventListenerAlgo/0.1.1`.

<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/eventlisteners/image_20.png">

Click the **Data Sources** menu item in the left sidebar.

<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/eventlisteners/image_21.png">

Click **My Hosted Data** on the main screen.

<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/eventlisteners/image_22.png">

Click the **New Collection** button in the top-right corner.

<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/eventlisteners/image_23.png">

In the dialog box that appears, enter the `COLLECTION_NAME` from above (in this case, "event_output_directory") and click **Create Collection**.

<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/eventlisteners/image_24.png">

Click the **Home** button the left sidebar.

<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/eventlisteners/image_25.png">

Click on the **Create New** button and select **Event Configuration** (in Algorithmia versions prior to 25.5.53, this will be called **Event Listener**).

<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/eventlisteners/image_26.png">

Enter the QueueURL and QueueConsumerARN into the **URI** and **ROLE ARN** fields in the modal.

<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/eventlisteners/image_27.png">

Enter the full path of your algorithm from above and click **Create New Event Configuration** (in Algorithmia versions prior to 25.5.53, this will be called **Create New Event Listener**. The following page will show your  newly created event configuration.

<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/eventlisteners/image_28.png">

### 5. Sending messages to the broker

Many methods exist for sending messages to Amazon SQS queues. Here we show what it looks like in the AWS console. Open the [SQS page](https://console.aws.amazon.com/sqs/home) and click on the box to the left of the queue name that was created in step 2, above.

<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/eventlisteners/image_29.png">

Click the **Queue Actions** drop-down button and select **Send a Message**.

In the popup box, enter the message payload corresponding to the inputs for the related algorithm event configuration.

<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/eventlisteners/image_30.png">

Click **Send Message** and the payload will be consumed by Algorithmia and sent to the configured algorithm as input for execution.

To verify, open the he **Data Sources** menu item in the left sidebar and navigate to the directory `COLLECTION_NAME` that you configured above as the destination for your algorithm to write data.

<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/eventlisteners/image_31.png">

Note that the directory contains a file with the filename specified in the payload and that the contents of the file include the data from the payload.

<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/eventlisteners/image_32.png">