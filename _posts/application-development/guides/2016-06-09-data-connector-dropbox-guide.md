---
layout: article_page
title:  "Dropbox Data Source"
excerpt: "How to configure your Dropbox data source and access your data via the Algorithmia Data API."
date:   2016-06-09 11:46:03
permalink: /application-development/data-connector-guides/dropbox-guide
tags: [app-data-connectors]
show_related: false
author: steph_kim
image:
    teaser: /post_images/data_connectors/dropbox.png
repository: https://github.com/algorithmiaio/algorithmia/blob/master/public/images/connectors/dropbox.png
---

# Dropbox Data Source Connection
As an application developer you can easily access the data you need from your Dropbox account. For example if you're building an application that requires a large data file that is stored in your Dropbox account you can authorize Algorithmia to have read and write access to your Dropbox account. This guide will tell you how to authorize access to your data source and what you can expect setting various permissions.

## Data Source Basics
All data sources have a protocol and a label that you will use to reference your data with. For instance S3 is the protocol we'll use in this guide and the label you will get later when you create your data connection. The label will be automatically assigned to your data connection as a unique identifier, but you may change it later if you wish.

## Configure a New Data Connection to Dropbox
To configure a new data connection you'll want to first navigate to 'https://algorithmia.com/data' where you will notice there is a panel that says 'Add Source'. Click that and it will bring up a panel that lets you chose between creating a new data source for AWS S3 or Dropbox. 

<img src="/images/post_images/data_connectors/create_data_connector.png" alt="Create a data connector" style="width: 700px;"/>

Select 'Connect to Dropbox' and you will be prompted to login to your Dropbox account. You'll be asked if you want to grant Algorithmia access to your account via OAuth authentication. Once that's done a new panel will be created which will have the Dropbox icon on it and a unique label for that Dropbox connection. 

**Note:** the unique label follows the protocol: 'dropbox+unique_connection_name://'

## Making Changes to your Data Connection
Here is where we will set our path restrictions and manage our read and write permissions by clicking the button 'Manage Dropbox' on the middle panel holding our unique data connector that we just created.

<img src="/images/post_images/data_connectors/manage_connector_all.png" alt="Manage a data connector" style="width: 700px;"/>

### Update Labels For Data Connections
If you would like to change the unique label that was automatically provided when you created the data connection, simply update it under 'Label' to a unique name. 

**Note:** We create these unique labels because if you want to add multiple connections to the same source (Dropbox account) they will each need a unique label to refer to them later in your code. The reason you might want to have multiple connections to the same source is if you want read access to one folder or file and write access to another. Which leads us to setting your path and your read/write access!

<img src="/images/post_images/data_connectors/dropbox_manage_connector_change_label.png" alt="Change a data connector's label" style="width: 700px;"/>

### Setting Restrictions for Dropbox Folder and File Access
The default path restrictions are set to allow acces to all paths in your Dropbox account, however you may want to restrict your algorithm's access to specific folders or files:

- Access to a single file: '/Algorithmia/test_data.csv'
- Access to everything in a specific folder: '/Algorithmia/*'

**Note:** '/Algorithmia*' might match more than you’d like, so if you want to match a directory exactly end with a '/'.

### Setting Read and Write Access
The default access for your data connection is set to read only, but you change this to write and read access by checking the 'Write Access' box.

**Note:** There are some important considerations with changing this. Write access also means you can ***delete*** anything in the path you've specified when setting the path restrictions in the previous step so be careful that you want read-write-delete access to the path you set in 'Path Restriction'.

<img src="/images/post_images/data_connectors/dropbox_manage_connector_access.png" alt="Manage a data connector" style="width: 700px;"/>

### Setting your Default Dropbox
There is a benefit to setting a data connection as your default Dropbox data source. When you choose 'Make Default' you can access this data source by a shortened path: 'dropbox:///' rather than 'dropbox+your_unique_label:///'. 

<img src="/images/post_images/data_connectors/dropbox_manage_connector_modal.png" alt="Manage a data connector" style="width: 700px;"/>

In our example I have set our connection with the label 'archimedes' as the default Dropbox connector, the path restriction as '/Algorithmia/\*' and can access it via 'dropbox:///Algorithmia/\*'.

## Accessing your Data from your Data Connection
Accessing your data connection via the <a href="http://docs.algorithmia.com/#data-api-specification">Algorithmia Data API</a> is easy. Whether you're writing your algorithm in Rust, Ruby, Python, Scala, Java or JavaScript simply import your data with a couple lines of code.

As long as you have your Dropbox data connection set up you can read and write data to it via <a href="http://docs.algorithmia.com/#data-api-specification">Algorithmia's Data API</a> by specifying the protocol and label as your path to your data.

For example, to retrieve and print a file's contents in Python:

- client = Algorithmia.client(“YOUR_API_KEY”)
- client.file(“dropbox:///my_restricted_path/my_file.csv").getFile().name

{% highlight python %}
import Algorithmia
import csv

client = Algorithmia.client("your_api_key")

def dropbox_data():
    # Get file from Dropbox default data connector
    data_file = client.file("dropbox:///Algorithmia/test_data.csv").get()
    # Pass in file and pass in args required from the algorithm FpGrowth
    input = [data_file, 5, 2]
    algo = client.algo('paranoia/FpGrowth/0.2.0')
    return algo.pipe(input)

dropbox_data()

{% endhighlight %}

## Details about Working with Data Sources and the Data API
If you're working with or building an algorithm that takes a file or directory as input from the Data API, you can also provide it a file or directory from one of your data connections:

{% highlight python %}
algo.pipeJson({'inputFile':'dropbox:///Algorithmia/test_data.csv'})
{% endhighlight %}

**IMPORTANT**: If your data source has Read/Write privileges, then an algorithm that you call also has Read/Write privileges to your data source.

**Note:** If you call an algorithm it can only access your data source. This means that it is NOT possible for an algorithm to read data from your Dropbox and write that data to an account controlled by an another algorithm author. Algorithms do NOT have direct access to any credentials associated with your data sources, and can only access data from a data source using the Algorithmia API.

## Differences between a Data Source Route and the Data API Route
Once a data source has been created, all of the Algorithmia client code for interacting with the Data API for file or directory creation, deletion, listing, etc will function identically with a data source route and a data API route except for:

- We do not support generic ACLs for data sources, and instead the only way to update permissions for a data source is through the data portal where you created your data source connection.
- If you're implementing a new client or using cURL it is preferred to use the following URL structure:

{% highlight python %}
# /v1/connector/<protocol>+<label>/<path>
'/v1/connector/dropbox+unique_label/restricted_path/my_pic.jpg'
{% endhighlight %}

## Algorithm support
We have tested to ensure that connector data paths function in all of our Algorithmia clients, however:

- Python support was added in version 1.0.4
- NodeJS support was added in version 0.3.5
This means that algorithms in Python or JavaScript which were last compiled prior to 5/27/2016 might not have the most recent versions of these dependencies, and we can’t guarantee this new functionality will work on algorithms older than that. A simple recompilation of the algorithm will enable support without any code changes needed.

If you have any questions about Algorithmia please <a href="mailto:support@algorithmia.com">get in touch</a>!