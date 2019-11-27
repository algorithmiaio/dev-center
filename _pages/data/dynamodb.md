---
layout: article
title:  "DynamoDB"
excerpt: "How to call the DynamoDB algorithm to scan all items in a table in your DynamoDB"
categories: working-with-data
nav_index: 4
tags: [app-data-connectors]
show_related: true
author: steph_kim, jon_peck
image:
    teaser: /language_logos/dynamo_db_image.png
menus:
  data:
    url: /developers/data/dynamodb
    title: "DynamoDB"
    weight: 4
---

Algorithms can easily access DynamoDB using the [boto3](https://aws.amazon.com/sdk-for-python/) package and securely storing their access credentials in a data collection.

Begin by creating a [collection]({{site.url}}/data/hosted) named "DynamoDBCredentials", and uploading a file "credentials.json" with the following structure (don't forget to set [your id, secret, and region](https://console.aws.amazon.com/iam/home?#/security_credentials)):

{% highlight text %}
{
  AWS Generic: {
    key-id: "YOUR_AWS_ID",
    key-secret: "YOUR_AWS_SECRET",
    region-name: "us-east-1"
  }
}
{% endhighlight %}

Next, you can test it by calling our sample algorithm, [DynamoDB]({{site.url}}/algorithms/util/DynamoDB), which allows you to scan a table in your DynamoDB database. Give it the name of any table in your DB, and it will return a list of all the items present.

Copy the [source code]({{site.url}}/algorithms/util/DynamoDB/source) of that algorithm, and use it as a template to access DynamoDB from within your own algorithm:

{% highlight python %}
import Algorithmia
import boto3
import json
import decimal

# Get AWS creds
client = Algorithmia.client()
creds = json.loads(client.file("data://.my/DynamoDBCredentials/credentials.json").getString())

AWS_ID = creds["AWS Generic"]["key-id"]
AWS_SECRET = creds["AWS Generic"]["key-secret"]
AWS_REGION_NAME = creds["AWS Generic"]["region-name"]

# Init dynamodb
dynamodb = boto3.resource("dynamodb", region_name=AWS_REGION_NAME, aws_access_key_id=AWS_ID, aws_secret_access_key=AWS_SECRET)

def decimal_default(obj):
    # Handles decimal values only
    # TODO: test and add as necessary casting for other dynamodb data types
    if isinstance(obj, decimal.Decimal):
        return int(obj)
    raise TypeError

def apply(input):
    try:
        # Pass in table name
        table = dynamodb.Table(input)
        # Scan all tables in db
        table_scan = table.scan()
        # Pretty print for testing
        # print(json.dumps(table_scan["Items"], indent=2, default=decimal_default))
        table_as_json = json.dumps(table_scan["Items"], default=decimal_default)
        return table_as_json
    except Exception as e:
        print("ERROR in table lookup", e)

{% endhighlight %}


