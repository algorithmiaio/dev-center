---
layout: article
title: "Event Listeners via Amazon SQS"
excerpt-short: "Set up an Event Listener to run an Algorithm with inputs from an Amazon SQS Queue"
categories: [integrations]
tags: [integrations]
show_related: true
image:
    teaser: /language_logos/amazon_sqs.png
---

These directions will help you to set up an Algorithmia Event Listener, which will run an algorithm with input payloads provided in an Amazon SQS Queue

This is only available for Enterprise installations of Algorithmia.

## 1. Obtain a template file and account info from Algorithmia

Contact [support@algorithmia.com](mailto:support@algorithmia.com) to obtain the following, which you will need during CloudFormation setup:

<div class="syn-body-1" markdown="1">

* the CloudFormation template file, `client-aws-cloudformation-template.yaml`
* AlgorithmiaAccountNumber
* QueueName
* QueueDLQName

</div>

## 2. Set AWS user permissions

You will need to have a user (or role that your user can assume) with the following AWS permissions:

**Cloud Formation**: CreateStack and DescribeStacks (on all resources)

**IAM**: CreateRole, GetRole, and PutRolePolicy (on all resources)

**SQS**: CreateQueue, GetQueueAttributes, and SetQueueAttributes (on all resources)

## 3. Creating Event Listener resources in AWS

Open the [CloudFormation page](https://console.aws.amazon.com/cloudformation/home) in the AWS console.

<images-section>
  <image-popout>
    <img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/eventlisteners/image_0.png">
  </image-popout>
</images-section>

Click the **Create stack** button.

On the following page, select **Upload a template file**, then click **Choose file**. Navigate to the Event Listener template file provided by Algorithmia and select it.

<images-section>
  <image-popout>
    <img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/eventlisteners/image_1.png">
  </image-popout>
</images-section>

Click **Next**.

On the following page, enter the **Stack name**. This should be a unique name that identifies the package of Amazon resources used for your event listener.

Enter the **AlgorithmiaAccountNumber**. This is Algorithmia’s AWS account number, provided to you by Algorithmia.

Enter the **QueueName**. This should be a unique name that identifies the Amazon SQS queue that will be the source of payloads for the algorithm to run.

Enter the **QueueDLQName**. This should be a unique name that identifies the Amazon SQS queue that will be a holding queue for payloads that were not accepted by the algorithmia algorithm for *any* reason (invalid message format, Algorithmia platform downtime, etc)

<images-section>
  <image-popout>
    <img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/eventlisteners/image_2.png">
  </image-popout>
</images-section>

Click **Next**.

The next page allows you to **Configure stack options**. If you need to use a specific IAM role which has the permissions specified in section 1), enter that role in the **Permissions** section, otherwise, leave it blank.

<images-section>
  <image-popout>
    <img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/eventlisteners/image_3.png">
  </image-popout>
</images-section>

<images-section>
  <image-popout>
    <img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/eventlisteners/image_4.png">
  </image-popout>
</images-section>

<images-section>
  <image-popout>
    <img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/eventlisteners/image_5.png" class="syn-image-responsive">
    <img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/eventlisteners/image_6.png" class="syn-image-responsive">
  </image-popout>
</images-section>

Click **Next**.

The next page allows you to review your options. Scroll to the bottom and click the checkbox next to **I acknowledge that AWS CloudFormation might create IAM resources.**

<images-section>
  <image-popout>
    <img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/eventlisteners/image_7.png">
  </image-popout>
</images-section>

<images-section>
  <image-popout>
    <img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/eventlisteners/image_8.png">
  </image-popout>
</images-section>

Finally, click **Create stack**.

The next page will indicate that the stack creation is in progress.

<images-section>
  <image-popout>
    <img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/eventlisteners/image_9.png">
  </image-popout>
</images-section>

Click the **Stack info** tab.

<images-section>
  <image-popout>
    <img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/eventlisteners/image_10.png">
  </image-popout>
</images-section>

After about 60 seconds, click the grey refresh wheel (<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/eventlisteners/image_11.png">) . It should show the Stack status as CREATE_COMPLETE . If not, wait another 60 seconds and click the wheel again.

<images-section>
  <image-popout>
    <img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/eventlisteners/image_12.png">
  </image-popout>
</images-section>

Click the **Outputs** tab. Copy the **QueueURL** and **QueueConsumerARN**; you will use them when creating your Event Listener in the Algorithmia web user interface next.

<images-section>
  <image-popout>
    <img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/eventlisteners/image_13.png">
  </image-popout>
</images-section>

## 4. Creating an Event Listener in the Algorithmia platform

*Any* algorithm can be used with an Event Listener. This tutorial shows one possible sample algorithm.

Open the Algorithmia Web user interface and log in.

<images-section>
  <image-popout>
    <img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/eventlisteners/image_14.png">
  </image-popout>
</images-section>

Click the **Create New button** and select **Algorithm**.

<images-section>
  <image-popout>
    <img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/eventlisteners/image_15.png">
  </image-popout>
</images-section>

Scroll down and select "Python 3.x"

<images-section>
  <image-popout>
    <img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/eventlisteners/image_16.png">
  </image-popout>
</images-section>

Scroll down and click **Create New Algorithm**.

<images-section>
  <image-popout>
    <img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/eventlisteners/image_17.png">
  </image-popout>
</images-section>

On the following page, click the **Source** tab for the newly created algorithm.

<images-section>
  <image-popout>
    <img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/eventlisteners/image_18.png">
  </image-popout>
</images-section>

Replace the original source with the following:

{% highlight python %}
import Algorithmia

def apply(input):
    Algorithmia.client().file("data://traack/event_output_directory/" + input.get("filename")).put(input.get("data"))

{% endhighlight %}

<images-section>
  <image-popout>
    <img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/eventlisteners/image_19.png">
  </image-popout>
</images-section>

Click the **Save**, the **Build**, then **Publish** buttons.

On the Algorithm page, copy the full "path" to the algorithm, in this case, **traack/EventListenerAlgo/0.1.1**.

<images-section>
  <image-popout>
    <img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/eventlisteners/image_20.png">
  </image-popout>
</images-section>

Click the **Data Sources** button in the left sidebar.

<images-section>
  <image-popout>
    <img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/eventlisteners/image_21.png">
  </image-popout>
</images-section>

Click **My Hosted Data** on the main screen.

<images-section>
  <image-popout>
    <img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/eventlisteners/image_22.png">
  </image-popout>
</images-section>

Click the **New Collection** button in the top right corner.

<images-section>
  <image-popout>
    <img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/eventlisteners/image_23.png">
  </image-popout>
</images-section>

In the dialog box that appears, enter event_output_directory as the collection name, then click **Create Collection**.

<images-section>
  <image-popout>
    <img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/eventlisteners/image_24.png">
  </image-popout>
</images-section>

Click the **Home** button the left sidebar.

<images-section>
  <image-popout>
    <img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/eventlisteners/image_25.png">
  </image-popout>
</images-section>

Click on the **Create New** button and select **Event Listener**.

<images-section>
  <image-popout>
    <img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/eventlisteners/image_26.png">
  </image-popout>
</images-section>

Enter the **QueueURL** and **QueueConsumerARN** into the URI and ROLE ARN fields on the following page, then scroll down.

<images-section>
  <image-popout>
    <img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/eventlisteners/image_27.png">
  </image-popout>
</images-section>

Enter the full path of your algorithm published earlier and click **Create New Event Listener**. The following page will show your Event Listener configuration.

<images-section>
  <image-popout>
    <img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/eventlisteners/image_28.png">
  </image-popout>
</images-section>

## 5. Triggering the Event Listener

Many methods exist for sending messages to AWS SQS queues. Here is one method using the AWS SQS queue web user interface.

Open the [SQS page](https://console.aws.amazon.com/sqs/home) in the AWS console. Click on the box to the left of the queue name that was created in step 2.

<images-section>
  <image-popout>
    <img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/eventlisteners/image_29.png">
  </image-popout>
</images-section>

Click the **Queue Actions** menu, and click **Send a Message**.

In the popup box, enter the message payload corresponding to the Algorithm inputs to which the Event Listener is linked:

<images-section>
  <image-popout>
    <img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/eventlisteners/image_30.png">
  </image-popout>
</images-section>

Click **Send Message**.

At this point, the message should be immediately consumed by the Event Listener and sent to the algorithm for execution.

Open the Algorithmia Data API page for the directory to be written to in your algorithm.

<images-section>
  <image-popout>
    <img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/eventlisteners/image_31.png">
  </image-popout>
</images-section>

Note that the directory contains a file with the filename specified in the payload and that the contents of the file include the data from the payload.

<images-section>
  <image-popout>
    <img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/eventlisteners/image_32.png">
  </image-popout>
</images-section>
