---
layout: article
title:  "Dropbox"
excerpt: "How to configure your Dropbox data source and access your data via the Algorithmia Data API."
categories: working-with-data
nav_index: 3
tags: [app-data-connectors]
show_related: true
author: steph_kim
image:
    teaser: /language_logos/dropbox.svg
redirect_from:
  - /application-development/data-connectors/dropbox-guide/
  - /application-development/data-sources/dropbox-guide/
---

Here you'll learn how to connect and access your Dropbox account in a few easy steps. This guide will tell you how to configure and connect to your data source and provide details about setting various permissions.

## Data Source Basics
All data sources have a protocol and a label that you will use to reference your data. For instance Dropbox is the protocol we'll use in this guide and the label will be automatically assigned to your data connection as a unique identifier, but you may change it later if you wish.

## Create a New Data Connection to Dropbox
To create a new data connection first navigate to <a href="{{site.baseurl}}/data">Algorithmia's Data Portal</a> where you'll notice there is a drop down that says 'New Data Source' where you'll see the options:

<img src="{{site.baseurl}}/images/post_images/data_connectors/create_data_connector.png" alt="Create a data connector" class="screenshot img-md">

Select **'Dropbox'** and you will be prompted to login to your Dropbox account. You'll be asked if you want to grant Algorithmia access to your account via OAuth authentication. Once that's done a new panel will be created which will have the Dropbox icon on it and a unique label for that Dropbox connection.

## Configure a Data Source
Set path restrictions and manage the read and write permissions by clicking the label of the data connector that was just created.

<img src="{{site.baseurl}}/images/post_images/data_connectors/manage_connector_all.png" alt="Manage a data connector" class="screenshot img-md">

**NOTE:** the unique label on your new Dropbox connection follows the protocol: 'dropbox+unique_connection_name://*' that defaults to allowing everything to be accessible in your Dropbox path.

### Update Labels For Data Connections
If you would like to change the unique label that was automatically provided when you created the data connection, simply update it under **'Label'** and give it a unique name:

<img src="{{site.baseurl}}/images/post_images/data_connectors/dropbox_manage_connector_change_label.png" alt="Change a data connector's label" class="screenshot img-sm">

**Note** We create these unique labels because you may want to add multiple connections to the same Dropbox account and they will each need a unique label for later reference in your algorithm. The reason you might want to have multiple connections to the same source is so you can set different access permissions to each connection such as read from one file and write to a different folder.

### Setting Path Restrictions for Dropbox Folder and File Access
The default path restrictions are set to allow access to all paths in your Dropbox account, however you may want to restrict your application's access to specific folders or files:

- Access to a single file: 'Algorithmia/test_data.csv'
- Access to everything in a specific folder: 'Algorithmia/*'

Here we are setting our path restrictions to everything in the Dropbox folder 'Algorithmia':

<img src="{{site.baseurl}}/images/post_images/data_connectors/dropbox_path_restrictions.png" alt="Change a data connector's label" class="screenshot img-sm">

**NOTE:** 'Algorithmia*' might match more than you’d like, so if you want to match a directory exactly end with a '/'.

### Setting Read and Write Access
The default access for your data source is set to read only, but you can change this to read *and* write access by checking the **'Write Access'** box.

**NOTE:** Write access also means you can ***delete*** anything in the path you've specified in the previous step so be careful that you want read-write-delete access to the path you set in 'Path Restriction'. Also, if your data source has Read/Write privileges, then an algorithm that you call also has Read/Write privileges to your data source.

<img src="{{site.baseurl}}/images/post_images/data_connectors/dropbox_manage_connector_access.png" alt="Manage a data connector" class="screenshot img-sm">

### Setting your Default Dropbox
The benefit to setting a data connection as your default Dropbox data source is when you choose **'Make Default'** you can access this data source by a shortened path: 'dropbox://' rather than: 'dropbox+your_unique_label://'.

In the example below, 'archimedes' is the default Dropbox data source's unique label, the path restriction is set as 'Algorithmia/\*' to access all files in the 'Algorithmia' folder and it can be accessed via the path: 'dropbox://Algorithmia/\*'.

<img src="{{site.baseurl}}/images/post_images/data_connectors/dropbox_manage_connector_modal.png" alt="Manage a data connector" class="screenshot img-sm">

## Accessing your Data
Accessing your Dropbox data via the <a href="http://docs.algorithmia.com/#data-api-specification">Algorithmia Data API</a> is easy. Whether you're writing your application in Rust, Ruby, Python, Scala, Java or JavaScript simply import your data with a couple lines of code. With your Dropbox data connection now configured you can read and write data to and from it via <a href="http://docs.algorithmia.com/#data-api-specification">Algorithmia's Data API</a> by specifying the protocol and label as your path to your data:

- client = Algorithmia.client('YOUR_API_KEY')
- client.file('dropbox://my_restricted_path/my_file.csv').getFile().name

For example, to retrieve and print a file's contents in Python:

{% highlight python %}
import Algorithmia
import csv

client = Algorithmia.client("your_api_key")

def dropbox_data():
    # Get file from Dropbox default data connector
    data_file = client.file("dropbox://Algorithmia/test_data.csv").get()
    # Pass in file and pass in args required from the algorithm FpGrowth
    input = [data_file, 5, 2]
    algo = client.algo('paranoia/FpGrowth/0.2.0')
    return algo.pipe(input)

dropbox_data()

{% endhighlight %}

If you're working with an algorithm that takes a file or directory as input from the Data API, you can also provide it a file or directory from one of your data sources:

{% highlight python %}
algo.pipeJson({'inputFile':'dropbox://Algorithmia/test_data.csv'})
{% endhighlight %}

**NOTE:** If you call an algorithm it can only access your data source. This means that it is NOT possible for an algorithm to read data from your Dropbox and write that data to an account controlled by an another algorithm author. Algorithms do NOT have direct access to any credentials associated with your data sources, and can only access data from a data source using the Algorithmia API.

## Data Source Routes and Data API Routes

Once a data source connection has been created and configured, all of the Algorithmia client code for interacting with the Data API for file or directory creation, deletion and listing will function identically with a data source route and a data API route except for:

- We do not support generic ACLs for data sources and the only way to update permissions for a data source is through the data portal where you created your data source connection.

If you're implementing a new client or using cURL it is preferred to use the following URL structure:

- '/v1/connector/protocol+label/path':
    - ' /v1/connector/Dropbox+archimedes/Algorithmia/foo.txt'

## Algorithm support
We have tested to ensure that data source paths function in all of our Algorithmia clients, however:

- Python support was added in version 1.0.4
- NodeJS support was added in version 0.3.5
This means that algorithms in Python or JavaScript which were last compiled prior to 5/27/2016 might not have the most recent versions of these dependencies, and we can’t guarantee this new functionality will work on algorithms older than that. A simple recompilation of the algorithm will enable support without any code changes needed.

If you have any questions about Algorithmia please <a href="mailto:support@algorithmia.com">get in touch</a>!
