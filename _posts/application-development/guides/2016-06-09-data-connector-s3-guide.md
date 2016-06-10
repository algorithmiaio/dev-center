---
layout: article_page
title:  "AWS S3 Data Source"
excerpt: "How to configure your AWS S3 data source and access your data via the Algorithmia Data API."
date:   2016-06-06 11:46:03
permalink: /application-development/data-connector-guides/s3-guide
tags: [app-data-connectors]
show_related: false
author: steph_kim
image:
    teaser: /post_images/data_connectors/s3.png
repository: https://github.com/algorithmiaio/algorithmia/blob/master/public/images/connectors/s3.png
---


# Amazon's AWS Data Source Connection
As an application developer you can easily access the data you need from your S3 account. For example if you're building an application that requires a large data file that is stored in your S3 account you can authorize Algorithmia to have read and write access to your S3 account. This guide will tell you how to authorize acess to your data source and what you can expect setting various permissions.

## Data Source Basics
All data sources have a protocol and a label that you will use to reference your data with. For instance S3 is the protocol we'll use in this guide and the label you will get later when you create your data connection. The label will be automatically assigned to your data connection as a unique identifier, but you may change it later if you wish.

## Configure a New Data Connection to S3
To configure a new data connection you'll want to first navigate to 'https://algorithmia.com/data' where you will notice there is a panel that says 'Add Source'. Click that and it will bring up a panel that lets you chose between configuring a new data source for AWS S3 or Dropbox. 

<img src="/images/post_images/data_connectors/create_data_connector.png" alt="Create a data connector" style="width: 700px;"/>

Select 'Connect to S3' and a modal window will open to configure an S3 connection where you will need to enter your credentials.

<img src="/images/post_images/data_connectors/s3_create_data_connector.png" alt="Create a data connector in modal" style="width: 700px;"/>

S3 authorization is done adding your AWS Access Key ID and AWS Secret Access Key. AWS supports setting restrictions on access tokens by service and operation. 

**Note:** While an algorithm NEVER sees credentials used to access data in S3, it is recommended that you provide an access key that:

- Can only list, get, and put objects to S3 (i.e. cannot perform other operations on your account)
- Can only access the paths in S3 that you want Algorithmia to access

### Update Labels For Data Connections
If you would like to change the unique label that was automatically provided when you created the data connection, simply update it under 'Label' to a unique name. 

**Note:** We create these unique labels because if you want to add multiple connectors to the same source (S3 account) they will each need a unique label to refer to them later in your code. The reason you might want to have multiple connections to the same source is if you want read access to one folder or file and write access to another. Which leads us to setting your path and your read/write access!

<img src="/images/post_images/data_connectors/S3_manage_connector_change_label.png" alt="Change a data connector's label" style="width: 700px;"/>

**Note:** The unique label follows the protocol: '+unique_label://restricted_path'

### Setting Restrictions for S3 Folder and File Access
The default path restrictions are set to allow acces to all paths in your S3 account, however you may want to restrict your algorithm's access to specific folders or files:

- Access to a single file: 'Algorithmia/team.jpg'
- Access to everything in a specific folder: 'Algorithmia/*'

**Note:** 'Algorithmia*' might match more than you’d like, so if you want to match a directory exactly end with a '/'.

<img src="/images/post_images/data_connectors/s3_restricted_paths.png" alt="Add path restrictions" style="width: 700px;"/>

### Setting Read and Write Access
The default access for your data connection is set to read only, but you change this to write and read access by checking the 'Write Access' box.

**Note:** There are some important considerations with changing this. Write access also means you can ***delete*** anything in the path you've specified when setting the path restrictions in the previous step so be careful that you want read-write-delete access to the path you set in 'Path Restriction'.

<img src="/images/post_images/data_connectors/s3_write_access.png" alt="Manage a data connector" style="width: 700px;"/>

## Accessing your Data from your Data Source
Accessing your S3 data via the <a href="http://docs.algorithmia.com/#data-api-specification">Algorithmia Data API</a> is easy. Whether you're writing your algorithm in Rust, Ruby, Python, Scala, Java or JavaScript simply import your data with a couple lines of code.

As long as you have your S3 data connection set up you can read and write data to and from it via <a href="http://docs.algorithmia.com/#data-api-specification">Algorithmia's Data API</a> by specifying the protocol and label as your path to your data.

For example, to retrieve and print a file's contents in Python:

- client = Algorithmia.client(“YOUR_API_KEY”)
- client.file(“s3+unique_label://my_bucket/my_file.csv").getFile().name

{% highlight python %}
import Algorithmia
import csv

client = Algorithmia.client("your_api_key")

def dropbox_data():
    # Get file from Dropbox default data source
    data_file = client.file("s3+saha://Algorithmia/test_data.csv").get()
    # Pass in file and pass in args required from the algorithm FpGrowth
    input = [data_file, 5, 2]
    algo = client.algo('paranoia/FpGrowth/0.2.0')
    return algo.pipe(input)

dropbox_data()

{% endhighlight %}

## Details about Working with Data Sources and the Data API
If you're working with or building an algorithm that takes a file or directory as input from the Data API, you can also provide it a file or directory from one of your data connections:

{% highlight python %}
algo.pipeJson({'inputFile':'s3+saha://Algorithmia/test_data.csv'})
{% endhighlight %}

**IMPORTANT**: If your data source has Read/Write privileges, then an algorithm that you call also has Read/Write privileges to your data source.

**Note:** If you call an algorithm it can only access your data source. This means that it is NOT possible for an algorithm to read data from your Dropbox and write that data to an account controlled by an another algorithm author. Algorithms do NOT have direct access to any credentials associated with your data sources, and can only access data from a data source using the Algorithmia API.

## Differences between a Data Source Route and the Data API Route
Once a data source has been created, all of the Algorithmia client code for interacting with the Data API for file or directory creation, deletion, listing, etc will function identically with a data source route and a data API route except for:

- We do not support generic ACLs for data sources, and instead the only way to update permissions for a data source is through the data portal where you created your data source connection.
- If you're implementing a new client or using cURL it is preferred to use the following URL structure:

{% highlight python %}
#/v1/connector/<protocol>+<label>/<path>
'/v1/connector/s3+unique_label/my_bucket/foo.txt'
{% endhighlight %}

## Algorithm support
We have tested to ensure that connector data paths function in all of our Algorithmia clients, however:

- Python support was added in version 1.0.4
- NodeJS support was added in version 0.3.5
This means that algorithms in Python or JavaScript which were last compiled prior to 5/27/2016 might not have the most recent versions of these dependencies, and we can’t guarantee this new functionality will work on algorithms older than that. A simple recompilation of the algorithm will enable support without any code changes needed.

If you have any questions about Algorithmia please <a href="mailto:support@algorithmia.com">get in touch</a>!