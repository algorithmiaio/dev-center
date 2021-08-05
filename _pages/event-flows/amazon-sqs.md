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
title: "Amazon SQS"
---

This feature is only available in Algorithmia Enterprise installations.
{: .notice-enterprise}

This guide will walk you through setting up Algorithmia Event Flows using an [Amazon Simple Queue Service (SQS)](https://aws.amazon.com/sqs/) message broker. Once configured, you can create event-driven workflows in which your algorithms subscribe to an SQS queue and are automatically invoked with the contents of messages published to the queue.

## Event Flow configuration overview

The process of configuring Event Flows with an SQS message broker involves multiple steps, some of which are to be completed on the AWS side and some of which are to be completed on the Algorithmia side. At a high level, the configuration steps are:

1. [Gather required information from Algorithmia](#1-gathering-required-information-from-algorithmia).
2. [On AWS, create a stack of resources](#2-configuring-resources-in-the-aws-management-console) (including an SQS queue) using a CloudFormation template or manually as the situation dictates.
3. [On Algorithmia create an algorithm and connect it to the SQS queue](#3-creating-an-event-flow-in-algorithmia) to subscribe to messages published there.
4. [Test the connection by sending messages](#4-sending-messages-to-the-broker) to the SQS queue to be consumed by the subscriber algorithm.

## How messages are read from SQS

To begin, let's first expore the following diagram, which displays the interaction between SQS and Algorithmia. When a message is published to SQS, it's sent to Algorithmia as an API call, and if Algorithmia's API server returns `200 OK`, the message is queued for processing. If the API server returns `429 Too Many Requests`, the message is requeued in SQS with a 5-minute delay.

<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/eventlisteners/workflow.png" alt="SQS and Algorithmia Workflow Diagram">

To influence how much work Algorithmia will accept, you can tune either the maximum number of workers or the user session limit.

On the SQS side, the option for **Maximum Receives** determines how many times a message will loop through the system before being delivered to the dead letter queue (DLQ). Since each loop is 5 minutes, messages will queue on the SQS side for (5 minutes) \* (Maximum Receives). The Maximum Receives value defaults to 10, but this can be increased up to 1000 to queue messages for more loops. See this [Amazon SQS – New Dead Letter Queue](https://aws.amazon.com/blogs/aws/amazon-sqs-new-dead-letter-queue/#:~:text=Maximum%20Receives%20%E2%80%93%20The%20maximum%20number,to%20the%20Dead%20Letter%20Queue.) blog post for additional details.

## 1. Gathering required information from Algorithmia

Contact [support@algorithmia.com](mailto:support@algorithmia.com) to obtain the account number of the AWS account running your Algorithmia cluster. This number references below as **AlgorithmiaAccountNumber**.

## 2. Configuring resources in the AWS Management Console

**NOTE:** The steps in this section are to be completed within the <a href="https://console.aws.amazon.com/" target="_blank" rel="noreferrer noopener">AWS Management Console</a>.
{: .notice-info}

### Exploring the CloudFormation template and required AWS permissions

In this section we'll walk through the key components of the CloudFormation template file that we'll be supplying to AWS CloudFormation to create the stack of resources that support Algorithmia Event Flows.

To begin, save the following YAML stack-creation template as a local file `client-aws-cloudformation-template.yaml`.

```yaml
AWSTemplateFormatVersion: 2010-09-09
Resources:
  algoqueuedlq:
    Type: 'AWS::SQS::Queue'
    Properties:
      QueueName: !Ref QueueDLQName
      MessageRetentionPeriod: '1209600'
  algoqueue:
    Type: 'AWS::SQS::Queue'
    Properties:
      MessageRetentionPeriod: '1209600'
      QueueName: !Ref QueueName
      RedrivePolicy:
        maxReceiveCount: 10
        deadLetterTargetArn: !GetAtt
          - algoqueuedlq
          - Arn
    DependsOn:
      - algoqueuedlq
  algoqueuepolicy:
    Type: 'AWS::IAM::Policy'
    Properties:
      PolicyName: eventlistenerpolicy
      PolicyDocument:
        Version: 2012-10-17
        Statement:
          - Sid: VisualEditor0
            Effect: Allow
            Action:
              - 'sqs:ChangeMessageVisibility'
              - 'sqs:DeleteMessage'
              - 'sqs:GetQueueAttributes'
              - 'sqs:ReceiveMessage'
            Resource:
              - !GetAtt
                - algoqueue
                - Arn
      Roles:
        - !Ref algoqueuerole
  algoqueuerole:
    Type: 'AWS::IAM::Role'
    Properties:
      AssumeRolePolicyDocument:
        Version: 2012-10-17
        Statement:
          - Effect: Allow
            Principal:
              AWS: !Sub
                - 'arn:aws:iam::${AlgorithmiaAccountNumber}:root'
                - AlgorithmiaAccountNumber: !Ref AlgorithmiaAccountNumber
            Action: 'sts:AssumeRole'
            Condition: {}
Parameters:
  AlgorithmiaAccountNumber:
    Description: Algorithmia's AWS account number
    Type: Number
  QueueName:
    Description: The name of the algorithm payload queue
    Type: String
    AllowedPattern: '[a-zA-Z][a-zA-Z0-9-]*'
    ConstraintDescription: must start with a letter and contain only alphanumeric characters or hyphens
  QueueDLQName:
    Description: The name of the queue which stores payloads which could not run by Event Listener
    Type: String
    AllowedPattern: '[a-zA-Z][a-zA-Z0-9-]*'
    ConstraintDescription: must start with a letter and contain only alphanumeric characters or hyphens
Outputs:
  QueueURL:
    Description: URL of SQS Queue used to create Event Flow in Algorithmia Platform
    Value: !Ref algoqueue
  QueueConsumerARN:
    Description: ARN of role used to create Event Flow in Algorithmia Platform
    Value: !GetAtt
      - algoqueuerole
      - Arn
```

#### Required permissions

Note that the template above describes the creation of CloudFormation, IAM, and SQS resources, so in order to use the template you'll need to be a user (or assume a role) with the following AWS permissions:

**CloudFormation**: CreateStack and DescribeStacks (on all resources)

**IAM**: CreateRole, GetRole, and PutRolePolicy (on all resources)

**SQS**: CreateQueue, GetQueueAttributes, and SetQueueAttributes (on all resources)

#### Template components

##### Scenarios

There are two possible scenarios that describe the relationship between the AWS account that creates the SQS queue and the account running the Algorithmia cluster that'll be using the queue as a message broker.

1. The SQS queue is created within the account that's running the Algorithmia cluster.
2. The SQS queue is created within a **different** account than the one running the Algorithmia cluster.

##### Scenario #1: Queue created in the same AWS account

CloudFormation configures SQS with the appropriate IAM permissions to ensure that your Algorithmia cluster is able to take actions on messages from the target queue. As written, the CloudFormation template supports Scenario #1. That is to say that from within the account running Algorithmia, you can use the CloudFormation template as provided to create all the resources you need, without any additional steps.

If you're in this scenario and don't need to explore the details of the resources being created, you can skip ahead to [Creating a stack with CloudFormation](#creating-a-stack-with-cloudformation).

##### Scenario #2: Queue created in a different AWS account

If you create an SQS queue in a different account than the one running the Algorithmia cluster, you'll need to understand a few key components of the CloudFormation template in order to appropriately configure SQS to work with Event Flows.

Let's begin by considering an AWS-hosted instance of Algorithmia Enterprise running in some AWS account called `ACCOUNT_AE`. All nodes in this Algorithmia instance run with the same IAM instance profile, which has a set of IAM policies attached to it.

The following diagram is a visual representation of the AWS account and associated resources, which will be explained below.

<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/eventlisteners/iam-sqs-relationships.png" alt="SQS and Algorithmia permission diagram">

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

<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/eventlisteners/aws-console-role-perms-json.png" alt="Role READ_SQS permission policy">

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

On the `ACCOUNT_SQS` side, the `READ_SQS` role must designate `ACCOUNT_AE` as a **Trusted entity** so that the `READ_SQS` role can be assumed by roles from `ACCOUNT_AE`. The **trust relationship** can be configured under **IAM** &rarr; **Roles** &rarr; {`READ_SQS`} &rarr; **Trust relationships**. You can also access the role-configuration page for the `READ_SQS` role through **CloudFormation** &rarr; **Stacks** &rarr; {**Stack name**} &rarr; **Resources** (the role will by **Type** `AWS::IAM::Role` in the table under this tab). Note that setting a trust relationship is only necessary in this scenario where `Account_AE` is different from `Account_SQS`.

<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/eventlisteners/aws-console-trust-relationships.png" alt="Trust relationships trusted entities">

Further down in this guide when you [connect the SQS message broker](#connect-to-an-sqs-message-broker) in Algorithmia's browser UI, the **Role ARN** for this `READ_SQS` role is what you'll be entering in the **ROLE ARN** field.

### Creating a stack with CloudFormation in the AWS Console

Open the <a href="https://console.aws.amazon.com/cloudformation/home" target="_blank" rel="noopener noreferrer">CloudFormation</a> page in the AWS console.

Click **Stacks** in the left-hand navigation menu, and then click **Create stack**.

<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/eventlisteners/aws-console-create-stack.png" alt="CloudFormation create stack">

On the resulting page, in the **Specify Template** section, select **Upload a template file** and then click **Choose file**. Navigate to the `client-aws-cloudformation-template.yaml` template file that you saved [above](#exploring-the-cloudformation-template-and-required-aws-permissions) and select it for upload.

<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/eventlisteners/aws-console-specify-template.png" alt="CloudFormation upload template file">

Click **Next**.

On the following page, enter a **Stack name**. This should be a unique name that identifies the bundle of Amazon resources used for this configuration.

Under **AlgorithmiaAccountNumber**, enter Algorithmia’s AWS account number, [provided to you by Algorithmia](#1-gathering-required-information-from-algorithmia).

Under **QueueDLQName**, enter a unique name that identifies the Amazon SQS queue that'll be a holding queue for payloads that weren't accepted by the Algorithmia algorithm for _any_ reason (invalid message format, Algorithmia platform downtime, etc.).

Under **QueueName**, enter a unique name that identifies the SQS queue that'll be the source of payloads for the algorithm to run.

<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/eventlisteners/aws-console-specify-stack-details.png" alt="CloudFormation specify stack details">

Click **Next**.

The next page allows you to **Configure stack options**. If you need to use a specific IAM role that has the permissions specified above in [Required Permissions](#required-permissions), enter that role in the **Permissions** section. Otherwise, leave it blank.

<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/eventlisteners/aws-console-iam-permissions.png" alt="CloudFormation configure stack options">

Click **Next**.

The next page allows you to review your options. Scroll to the bottom and click the checkbox next to **I acknowledge that AWS CloudFormation might create IAM resources.**

<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/eventlisteners/aws-console-review-create-stack.png" alt="CloudFormation review stack configuration">

<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/eventlisteners/aws-console-acknowledge-resources.png" alt="CloudFormation acknowledge IAM resource creation">

Finally, click **Create stack**.

The next page will indicate that the stack creation is in progress.

<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/eventlisteners/aws-console-stack-create-in-progress.png" alt="CloudFormation stack creation in progress">

After about 60 seconds, click the gray refresh wheel (<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/eventlisteners/image_11.png" alt="refresh icon">). It should show the **Stack status** as "CREATE_COMPLETE". If not, wait another 60 seconds and click the wheel again.

Click the **Outputs** tab. Copy the **QueueURL** and **QueueConsumerARN**; you'll use them below when [connecting the SQS message broker](#connect-to-an-sqs-message-broker) to an algorithm in the Algorithmia browser UI.

<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/eventlisteners/aws-console-stack-outputs.png" alt="CloudFormation stack output">

## 3. Creating an Event Flow in Algorithmia

**NOTE:** The steps in this section are to be completed on Algorithmia, from within the browser user interface (UI) or through the API. In this guide, we'll demonstrate what the workflow looks like in the UI.
{: .notice-info}

Note that you can set up _any_ algorithm to subscribe to an SQS message broker so that the algorithm is executed when a message is published to that specific queue. On our platform we refer to this type of event-driven configuration as an Event Flow, and the following demonstrates one possible example of how to set one up.

### Create an algorithm

Create a Python 3.x algorithm with a generic Python 3.7 algorithm environment and default settings. If you're new to Algorithmia or need a quick refresher on how to create and modify algorithms, see our [Getting Started Guide](/algorithm-development/your-first-algo).

On the newly created algorithm's profile, click the **Source** tab to access the source code in the Web IDE.

In the body of your algorithm, paste the source code below, replacing the `COLLECTION_OWNER` and `COLLECTION_NAME` with your Algorithmia account name and the name of a data collection (which you'll create in a subsequent step), respectively. In the screenshot below the sample code, these values are `Ezra` and `TestingSQSEventFlow`, respectively.

```python
import Algorithmia

client = Algorithmia.client()

def apply(input):
    data_uri = "data://COLLECTION_OWNER/COLLECTION_NAME/" + input.get("filename")
    client.file(data_uri).put(input.get("data"))
```

<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/eventlisteners/algorithmia-web-ide-example-code.png" alt="create algorithm Web IDE">

Click the **Save** and **Build** buttons and then click **Publish** when the build completes.

On the newly published algorithm's profile, copy the algorithm endpoint, which will be in the form `ALGO_OWNER/ALGO_NAME/ALGO_VERSION`; in the screenshot below, this is `ezra/testSQSEventFlow/0.2.0`.

<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/eventlisteners/algorithm-profile-algorithm-endpoint-sqs-subscriber.png" alt="algorithm profile algorithm endpoint">

### Create a hosted data collection

Now create a hosted data collection to which the algorithm above will write the records read from the message broker. To begin, click the **Data Sources** menu item in the left-hand navigation bar. Click **New Data Source** and then **Hosted Data Collection**.

<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/eventlisteners/create-hosted-data-collection.png" alt="Create Algorithmia hosted data collection">

In the dialog box that appears, enter the `COLLECTION_NAME` value from above (in this case, `TestingSQSEventFlow`) and click **Create Collection**.

<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/eventlisteners/new-collection-sqs-event-flow.png" alt="New hosted data collection dialog">

### Connect to an SQS message broker

This section documents the workflow in Algorithmia versions >=20.5.53. See the section [below](#create-an-event-listener) for the previous event listeners-based workflow.
{: .notice-info}

Navigate to your new algorithm's profile and click the **Events** tab and then the **Connect broker** button.

<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/eventlisteners/connect_sqs_broker_button.png">

In the modal, enter the **QueueURL** and **QueueConsumerARN** values from [step 3](#3-creating-resources-in-aws) for the **URI** and **ROLE ARN** fields, respectively.

The **Algorithm** endpoint field is auto-populated, and the full algorithm path is shown below the text input field. The version number is optional.

Optionally, enter a value for **Algorithm timeout in seconds**.

<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/eventlisteners/connect_sqs_broker_modal.png">

Click **Connect to Amazon SQS broker**. The **Events** tab on the algorithm profile will now list your newly created connection.

<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/eventlisteners/connect_sqs_broker_events_tab.png">

Click [here](#4-sending-messages-to-the-broker) to skip to the next step to learn how to send messages to the newly connected broker.

### Create an Event Listener

This section documents the workflow in Algorithmia versions <20.5.53, where Event Flows were called event listeners.
{: .notice-info}

Navigate to the **Home** tab on the left-hand navigation menu. Click on the **Create New** button and select **Event Listener**. Select **Amazon SQS** from the dropdown.

<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/eventlisteners/image_26.png">

In the modal, enter the **QueueURL** and **QueueConsumerARN** into the **URI** and **ROLE ARN** fields, respectively.

<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/eventlisteners/image_27.png">

Enter the full path to the algorithm you created above and click **Create New Event Listener**. The **Listeners** tab on the algorithm profile will now list your newly created event listener.

<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/eventlisteners/image_28.png">

## 4. Sending messages to the broker

Many methods exist for sending messages to Amazon SQS queues. For the purposes of this demonstration, here we show how to do it in the AWS console.

Open the <a href="https://console.aws.amazon.com/sqs/home" target="_blank" rel="noopener noreferrer">SQS</a> page in the AWS console. Click on the name of the queue (**QueueName**) that was created [above](#creating-a-stack-with-cloudformation-in-the-aws-console), and click the **Send and receive messages** button.

<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/eventlisteners/aws_console_send_messages.png">

In the **Send and receive messages** page, in the **Message body** field enter the message payload to send to the algorithm you created above. For our example here, it might be formatted like this.

```json
{
    "filename": "some-new-file.txt",
    "data": "file contents to store"
}
```

<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/eventlisteners/aws_console_sqs-message-body.png">

Click **Send Message** and the payload will be consumed by Algorithmia and sent to the configured algorithm as input for execution.

To verify, open the **Data Sources** menu item in the left sidebar and navigate to the `COLLECTION_NAME` data collection that you configured above as the destination for your algorithm to write data. Based on the payload shown above in the **Message body** section, the collection should contain the file `some-new-file`, with contents equal to the string `file contents to store`.

<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/eventlisteners/amazon-sqs-file-contents.png">
