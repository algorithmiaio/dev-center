---
layout: article
title:  "AWS Lambda"
permalink: clients/aws-lambda/
excerpt: "Run Algorithmia code in response to events with AWS Lambda"
excerpt-short: "Run Algorithmia code in response to events with AWS Lambda"
categories: [clients, integrations]
tags: [clients, integrations]
show_related: true
image:
    teaser: /language_logos/aws_lambda.svg
redirect_from:
  - /application-development/client-guides/aws-lambda/
  - /application-development/guides/lambda/
  - /clients/lambda/
  - /application-development/lang-guides/aws-lambda/
---

This guide currently covers NodeJS on Lambda. Until the Python Blueprint is completed, please refer to our simplified [guide to Webhooks using Python on Lambda]({{site.baseurl}}/integrations/webhooks/#python--aws-lambda-example).
{: .notice-warning}

AWS Lambda is a compute service that runs your code in response to events and automatically manages the compute resources for you,
making it easy to build applications that respond quickly to new information.

### Algorithmia + Lambda

Algorithmia provides a built-in AWS Lambda Node.js blueprint, making it easy to call the Algorithmia API in response to events from Amazon Kinesis, Amazon DynamoDB, Amazon S3, and other Amazon web services.

For example, you could combine several algorithms from Algorithmia to:

* Automatically generate smart thumbnails (using face detection to ensure every thumbnail is perfectly cropped)
* Take advantage of Algorithmia’s speech-to-text algorithm to transcribe videos uploaded to S3 on the fly
* Leverage a predictive model every time DynamoDB updates

Algorithmia and Lambda make it easy to rapidly build and deploy serverless solutions in minutes.

### Set up your Lambda function

#### Getting started

* Navigate to the [AWS Lambda console](https://console.aws.amazon.com/lambda/home)
* Select `Create function`
* Pick "Blueprints"
<!-- "Browse serverless app repository" -->
* Type `Algorithmia` into the filter
* Set an Application Name and Topic, and click "Deploy"
* Wait for AWS to deploy, then click "algorithmia" under the Resources section
* Click "Add Trigger" and configure as needed for your workflow
* Click on the Lambda icon next to "serverless-algorithmia-YourFunctionName" at the top
* Edit the code, setting `const algorithm` under `processEvent`, modifying `const inputData` to handle the triggering event's datastructure (the template assumes an S3 event), and modifying the output (in `client.algo(algorithm).pipe(inputData).then((output) =>` as needed for your workflow.
* For a simple but less secure config, you can embed your API Key directly into your code by assigning a value to `let apiKey`
* For higher security, configure your KMS Encrypted Key as shown below, and set `const kmsEncryptedApiKey` in your code
* Save and test your code

### Authentication

#### Basic authentication

Set `apiKey` to your Algorithmia API key.
Also set `kmsEncryptedApiKey` to `null`.

> Basic authentication:

{% highlight bash %}
apiKey = "YOUR_API_KEY";
kmsEncryptedApiKey =  null;
{% endhighlight %}

#### Advanced authentication (more secure)

Follow these steps to encrypt your Algorithmia API Key for use in your function.

##### 1. Create a KMS key

Follow [this AWS guide](http://docs.aws.amazon.com/kms/latest/developerguide/create-keys.html) to create your KMS key.

##### 2. Give your lAWS Lambda function execution role permission for the `kms:Decrypt` action

> Example Role:

{% highlight bash %}
{
    "Version": "2012-10-17",
    "Statement": [
    {
        "Sid": "Stmt1443036478000",
        "Effect": "Allow",
        "Action": [
            "kms:Decrypt"
        ],
        "Resource": [
            "<your KMS key ARN>"
        ]
    }
    ]
}
{% endhighlight %}

##### 3. Encrypt the event collector token using the AWS CLI

{% highlight bash %}
aws kms encrypt --key-id alias/<KMS key name> --plaintext "YOUR_API_KEY"
{% endhighlight %}

##### 4. Copy the base-64 encoded, encrypted key (CiphertextBlob) to the `kmsEncryptedApiKey` variable

{% highlight bash %}
kmsEncryptedApiKey = "<kmsEncryptedApiKey>";
{% endhighlight %}


## Additional information

See the [NodeJS guide](../node) for an introduction to using the Algorithmia NodeJS client to call algorithms and manage data.

Your account can make up to {{site.data.stats.platform.max_num_algo_requests}} Algorithmia requests at the same time (this limit <a onclick="Intercom('show')">can be raised</a> if needed).

See also the [AWS Lambda walk through on our blog](https://algorithmia.com/blog/post/133832621114/get-started-building-intelligent-serverless-apps).
