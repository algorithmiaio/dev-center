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

This guide will walk you through setting up Algorithmia Event Flows using an [Amazon Simple Queue Service (SQS)](https://aws.amazon.com/sqs/) message broker. Once configured, you can create event-driven workflows in which your algorithms subscribe to an SQS queue and are automatically invoked with the contents of messages published to the queue.

To begin, let's first take a look at how Algorithmia and SQS interact.

## How messages are read from SQS

The following diagram displays the interaction between SQS and Algorithmia. When a message is published to SQS, it's sent to Algorithmia as an API call, and if Algorithmia's API server returns `200 OK`, the message is queued for processing. If the API server returns `429 Too Many Requests`, the message is requeued in SQS with a 5-minute delay.

<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/eventlisteners/workflow.png" alt="SQS and Algorithmia Workflow Diagram">

To influence how much work Algorithmia will accept, you can tune either the maximum number of workers or the user session limit.

On the SQS side, the option for **Maximum Receives** determines how many times a message will loop through the system before being delivered to the dead letter queue (DLQ). Since each loop is 5 minutes, messages will queue on the SQS side for (5 minutes) \* (Maximum Receives). The Maximum Receives value defaults to 10, but this can be increased up to 1000 to queue messages for more loops. See this [Amazon SQS – New Dead Letter Queue](https://aws.amazon.com/blogs/aws/amazon-sqs-new-dead-letter-queue/#:~:text=Maximum%20Receives%20%E2%80%93%20The%20maximum%20number,to%20the%20Dead%20Letter%20Queue.) blog post for additional details.

## Event Flow configuration overview

The process of configuring Event Flows with an SQS message broker involves several steps, some of which are to be completed in the AWS Management Console and some of which are to be completed in the Algorithmia browser user interface (UI). At a high level, the configuration steps are:

1. Gather required information from Algorithmia and define required parameters.
2. In the AWS Management Console, create a stack of resources (including an SQS queue) using a CloudFormation template or manually as the situation dictates.
3. In the Algorithmia browser UI, connect an algorithm to the SQS queue to subscribe to messages published there.

## 1. Gathering required information from Algorithmia and defining queue parameters

Contact [support@algorithmia.com](mailto:support@algorithmia.com) to obtain the following, which you'll need during CloudFormation setup:

- `client-aws-cloudformation-template.yaml` (CloudFormation template file for stack creation)
- **AlgorithmiaAccountNumber** (AWS account running Algorithmia cluster)

You'll also need to define the following parameters, which are required in the stack configuration process and which will be referenced in the descriptions below:

- **QueueName** (the name of the SQS queue)
- **QueueDLQName** (the name of the SQS DLQ)

## 2. Configuring a stack in the AWS Management Console

**NOTE:** The steps in this section are to be completed within the <a href="https://console.aws.amazon.com/" target="_blank" rel="noreferrer noopener">AWS Management Console</a>.
{: .notice-info}

### Exploring the CloudFormation template and required AWS permissions

In this section we'll walk through the key components of the `client-aws-cloudformation-template.yaml` file, which is used by AWS CloudFormation to create the resource stack that supports Algorithmia Event Flows.

#### Required permissions

Note that the template describes the creation of CloudFormation, IAM, and SQS resources, so in order to use the template you'll need to be a user (or assume a role) with the following AWS permissions:

**CloudFormation**: CreateStack and DescribeStacks (on all resources)

**IAM**: CreateRole, GetRole, and PutRolePolicy (on all resources)

**SQS**: CreateQueue, GetQueueAttributes, and SetQueueAttributes (on all resources)

#### Template components

##### Scenarios

There are two possible scenarios that describe the relationship between the AWS account that creates the SQS queue and the account running the Algorithia cluster that'll be using the queue as a message broker.

1. The SQS queue is created within the account that's running the Algorithmia cluster.
2. The SQS queue is created within a **different** account than the one running the Algorithmia cluster.

##### Scenario #1: Queue created in the same AWS account

CloudFormation configures SQS with the appropriate IAM permissions to ensure that your Algorithia cluster is able to take actions on messages from the target queue. As written, the CloudFormation template supports Scenario #1. That is to say that from within the account running Algorithia, you can use the CloudFormation template as provided to create all the resources you need, without any additional steps.

If you're in this scenario and don't need to explore the details of the resources being created, you can navigate to [Creating a stack with CloudFormation](#creating-a-stack-with-cloudformation).

##### Scenario #2: Queue created in a different AWS account

If you create an SQS queue in a different account than the one running the Algorithmia cluster, you'll need to understand a few key components of the CloudFormation template in order to appropriately configure SQS to work with Event Flows.

Let's begin by considering an AWS-hosted instance of Algorithmia Enterprise running in some AWS account called `ACCOUNT_AE`. All nodes in this instance run with the same IAM instance profile, which has a set of IAM policies attached to it.

The following diagram is a visual representation of the AWS account and associated resources, which will be explained below.

<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/eventlisteners/iam-sqs-relationships.png">

Let's also suppose that you create an SQS queue (to be used as a message broker with Event Flows) in some other AWS account called `ACCOUNT_SQS`. This account needs an IAM role and policy created that allows reading, acknowledging, and deleting messages from the SQS queue. Let's call this role `READ_SQS`. It must be created within the `ACCOUNT_SQS` account, specifying the appropriate permissions on the SQS queue **QueueName** (note that this is the name of the queue specified [above](#1-gathering-required-information-from-algorithmia-and-defining-queue-parameters)).

Here's what the `READ_SQS` permission policy looks like.

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Action": [
                "sqs:ChangeMessageVisibility",
                "sqs:DeleteMessage",
                "sqs:GetQueueAttributes",
                "sqs:ReceiveMessage",
            ],
            "Resource": "arn:aws:us-west-2:ACCOUNT_SQS:QueueName",
            "Effect": "Allow",
            "Sid": "VisualEditor0"
        }
    ]
}
```

<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/eventlisteners/aws-console-role-perms-json.png">

In order to consume messages from the queue created in `ACCOUNT_SQS`, `ACCOUNT_AE` must attach an IAM policy allowing Algorithmia's instance profile to assume the `READ_SQS` role. Let's call this policy `ASSUME_READ_SQS`; it must be created within `ACCOUNT_AE` to allow it to assume this specific role from `ACCOUNT_SQS`.

Here's what the `ASSUME_READ_SQS` permission policy looks like.

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Action": "sts:AssumeRole",
            "Resource": "arn:aws:iam::ACCOUNT_SQS:role/READ_SQS",
            "Effect": "Allow",
            "Sid": "VisualEditor0"
        }
    ]
}
```

On the `ACCOUNT_SQS` side, the `READ_SQS` role must designate `ACCOUNT_AE` as a **Trusted entity** so that the `READ_SQS` role can be assumed by roles from `ACCOUNT_AE`. The **trust relationship** can be configured under **IAM** &rarr; **Roles** &rarr; {`READ_SQS`} &rarr; **Trust relationships**. You can also access the role configuration page for the `READ_SQS` role through **CloudFormation** &rarr; **Stacks** &rarr; {**Stack name**} &rarr; **Resources** tab (the role will by **Type** `AWS::IAM::Role` in the table). Note that setting a trust relationship is only necessary in this scenario where `Account_AE` is different from `Account_SQS`.

<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/eventlisteners/aws-console-trust-relationships.png">

Note that further down in this guide when you [connect the SQS message broker](#connect-to-an-sqs-message-broker) in Algorithmia's browser UI, the **Role ARN** for this `READ_SQS` role is what you'll be entering in the **ROLE ARN** field.

### Creating a stack with CloudFormation

Open the <a href="https://console.aws.amazon.com/cloudformation/home" target="_blank" rel="noopener noreferrer">CloudFormation page</a> in the AWS console.

Click **Stacks** in the left-hand navigation menu, and then click **Create stack**.

<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/eventlisteners/aws-console-create-stack.png">

On the resulting page, in the **Specify Template** section, select **Upload a template file** and then click **Choose file**. Navigate to the `client-aws-cloudformation-template.yaml` template file provided by Algorithmia (see [step 1](#1-gathering-required-information-from-algorithmia-and-defining-queue-parameters)) and select it.

<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/eventlisteners/aws-console-specify-template.png">

Click **Next**.

On the following page, enter a **Stack name**. This should be a unique name that identifies the package of Amazon resources used for this configuration.

Under **AlgorithmiaAccountNumber**, enter Algorithmia’s AWS account number, provided to you by Algorithmia.

Under **QueueDLQName**, enter a unique name that identifies the Amazon SQS queue that'll be a holding queue for payloads that weren't accepted by the Algorithmia algorithm for _any_ reason (invalid message format, Algorithmia platform downtime, etc.).

Under **QueueName**, enter a unique name that identifies the SQS queue that'll be the source of payloads for the algorithm to run.

<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/eventlisteners/aws-console-specify-stack-details.png">

Click **Next**.

The next page allows you to **Configure stack options**. If you need to use a specific IAM role that has the permissions specified in step 2, enter that role in the **Permissions** section. Otherwise, leave it blank.

<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/eventlisteners/aws-console-iam-permissions.png">

Click **Next**.

The next page allows you to review your options. Scroll to the bottom and click the checkbox next to **I acknowledge that AWS CloudFormation might create IAM resources.**

<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/eventlisteners/aws-console-review-create-stack.png">

<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/eventlisteners/aws-console-acknowledge-resources.png">

Finally, click **Create stack**.

The next page will indicate that the stack creation is in progress.

<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/eventlisteners/aws-console-stack-create-in-progress.png">

After about 60 seconds, click the grey refresh wheel (<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/eventlisteners/image_11.png">). It should show the **Stack status** as "CREATE_COMPLETE". If not, wait another 60 seconds and click the wheel again.

Click the **Outputs** tab. Copy the **QueueURL** and **QueueConsumerARN**; you'll use them below when [connecting the SQS message broker](#connect-to-an-sqs-message-broker) to an algorithm in the Algorithmia browser UI.

<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/eventlisteners/aws-console-stack-outputs.png">

## 3. Creating an Event Flow in Algorithmia

**NOTE:** The steps in this section are to be completed within the Algorithmia browser UI.
{: .notice-info}

Note that you can set up _any_ algorithm to subscribe to an SQS message broker so that the algorithm is executed when a message is published to that specific queue. On our platform we refer to this type of event-driven configuration as an Event Flow, and the following demonstrates one possible example of how to set one up.

#### Create an algorithm

To begin, log in to the Algorithmia browser UI and create a Python 3.x algorithm with a generic Python 3.7 algorithm environment and default settings. On the newly created algorithm's profile, click the **Source** tab to access the source code in the Web IDE. If you're new to Algorithmia or need a quick refresher on how to create and modify algorithms, see our [getting started guide](/algorithm-development/your-first-algo).

In the body of your algorithm, paste the source code below, replacing the `COLLECTION_OWNER` and `COLLECTION_NAME` with your account name and the name of a data collection (which you'll create in a subsequent step), respectively. In the screenshot below the sample code, these values are `Ezra` and `TestingSQSEventFlow`, respectively.

```python
import Algorithmia

client = Algorithmia.client()

def apply(input):
    data_uri = "data://COLLECTION_OWNER/COLLECTION_NAME/" + input.get("filename")
    client.file(data_uri).put(input.get("data"))
```

<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/eventlisteners/algorithmia-web-ide-example-code.png">

Click the **Save** and **Build** buttons and then click **Publish** when the build completes.

On the newly published algorithm's profile, copy the algorithm endpoint, which will be in the form `ALGO_OWNER/ALGO_NAME/ALGO_VERSION`; in the screenshot below, this is `ezra/testSQSEventFlow/0.2.0`.

<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/eventlisteners/algorithm-profile-algorithm-endpoint.png">

#### Create a hosted data collection

You'll now create a hosted data collection to which the algorithm above will write records received from the message broker. To begin, click the **Data Sources** menu item in the left sidebar.

<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/eventlisteners/image_21.png">

Click **My Hosted Data** on the main screen.

<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/eventlisteners/image_22.png">

Click the **New Collection** button in the top-right corner.

<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/eventlisteners/image_23.png">

In the dialog box that appears, enter the `COLLECTION_NAME` value from above (in this case, `event_output_directory`) and click **Create Collection**.

<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/eventlisteners/image_24.png">

#### Connect to an SQS message broker

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

In the **Send and receive messages** page, in the **Message body** field enter the message payload to send to the algorithm you created above. For our example here, it might be formatted like this.

```
{
    "filename" : "some-new-file.txt",
    "data" : "file contents to store"
}
```

<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/eventlisteners/aws_console_sqs-message-body.png">

Click **Send Message** and the payload will be consumed by Algorithmia and sent to the configured algorithm as input for execution.

To verify, open the **Data Sources** menu item in the left sidebar and navigate to the `COLLECTION_NAME` data collection that you configured above as the destination for your algorithm to write data. Based on the payload shown above in the **Message body** section, the collection should contain the file `some-new-file`, with contents equal to `file contents to store`.

<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/eventlisteners/amazon-sqs-file-contents.png">
