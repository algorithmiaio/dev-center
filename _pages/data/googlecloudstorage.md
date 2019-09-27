---
layout: article
title:  "Google Cloud Storage"
excerpt: "How to configure your Google Cloud Storage data source and access your data via the Algorithmia Data API."
categories: working-with-data
nav_index: 2
tags: [app-data-connectors]
show_related: true
author: steph_kim
image:
    teaser: /language_logos/googlecloud_icon.svg
---

Learn how to access the data you need from your Google Cloud Storage in a few easy steps. This guide will tell you how to configure and connect to your data source and provide details about setting various permissions.

## Data Source Basics
All data sources have a protocol and a label that you will use to reference your data. For instance `Google Cloud Storage` is the protocol we'll use in this guide and the label will be automatically assigned to your data connection as a unique identifier, but you may change it later if you wish.

## Configure a New Data Connection to your Google Cloud Storage
To create a new data connection first navigate to <a href="{{site.baseurl}}/data">Algorithmia's Data Portal</a> where you'll notice there is a drop down that says 'New Data Source' where you'll see the options:

<img src="{{site.baseurl}}/images/post_images/data_connectors/create_data_connector.png" alt="Create a data connector" class="screenshot img-md">

Select **'Google Cloud Storage'** and a form will open to configure a connection. Here you will need to enter your Google Cloud Storage credentials, obtained from the [Service Accounts panel](https://console.cloud.google.com/iam-admin/serviceaccounts) of the Google Cloud Console. Copy your private_key_id, private_key, and client_email from the JSON credentials file generated when you select "create key" in your service account.  For more information, see the <a href="https://cloud.google.com/iam/docs/understanding-service-accounts#managing_service_account_keys ">Google Cloud Storage Docs</a>.

<img src="{{site.baseurl}}/images/post_images/data_connectors/google_cloud_connector.png" alt="Create a data connector in modal" class="screenshot img-sm">

**NOTE:** While an algorithm NEVER sees credentials used to access data in Google Cloud Storage, it is recommended that you provide access that:

- Can only list, get, and put objects to Google Cloud Storage (i.e. cannot perform other operations on your account)
- Can only access the paths in Google Cloud Storage that you want Algorithmia to access

### Setting Labels For Data Connections
You will need to provide a unique label for your data connector, editable in the **"Label"** field.

We require these unique labels because you may want to add multiple connections to the same Google Cloud Storage account and they will each need a unique label for later reference in your algorithm. The reason you might want to have multiple connections to the same source is so you can set different access permissions to each connection such as read from one file and write to a different folder.

**NOTE:** The unique label follows the protocol: 'gs+unique_label://restricted_path'

### Setting Path Restrictions for Google Cloud Storage Folder and File Access
The default path restrictions are set to allow access to all paths in your Google Cloud Storage account, however you may want to restrict your algorithm's access to specific folders or files:

- Access to a single file: 'Algorithmia/team.jpg'
- Access to everything in a specific folder: 'Algorithmia/*'

**NOTE:** 'Algorithmia*' might match more than you’d like, so if you want to match a directory exactly end with a '/'.

Here we are setting our path restrictions to everything in the Google Cloud Storage 'Algorithmia':

<img src="{{site.baseurl}}/images/post_images/data_connectors/google_cloud_restricted_paths.png" alt="Add path restrictions" class="screenshot img-sm">

### Setting Read and Write Access
The default access for your data source is set to read only, but you can change this to read *and* write access by checking the **'Write Access'** box.

**NOTE:** Write access also means you can ***delete*** anything in the path you've specified in the previous step so be careful that you want read-write-delete access to the path you set in 'Path Restriction'. Also, if your data source has Read/Write privileges, then an algorithm that you call also has Read/Write privileges to your data source.

## Accessing your Data
Accessing your data via the <a href="http://docs.algorithmia.com/#data-api-specification">Algorithmia Data API</a> is easy. Whether you're writing your algorithm in Rust, Ruby, Python, Scala, Java or JavaScript simply import your data with a couple lines of code. With your data connection now configured you can read and write data to and from it via <a href="http://docs.algorithmia.com/#data-api-specification">Algorithmia's Data API</a> by specifying the protocol and label as your path to your data:

- client = Algorithmia.client('YOUR_API_KEY')
- client.file('gs+unique_label://container_name/my_file.csv').getFile().name

For example, to retrieve and print a file's contents in Python:

{% highlight python %}
import Algorithmia
import csv

client = Algorithmia.client('your_api_key')

def google_cloud_data():
    # Get file from Google Cloud Storage data source
    data_file = client.file('gs+unique_label://Algorithmia/test_data.csv').get()
    # Pass in file and pass in args required from the algorithm FpGrowth
    input = [data_file, 5, 2]
    algo = client.algo('paranoia/FpGrowth/0.2.0')
    return algo.pipe(input)

google_cloud_data()

{% endhighlight %}

If you're working with an algorithm that takes a file or directory as input from the Data API, you can also provide it a file or directory from one of your data sources:

{% highlight python %}
algo.pipeJson({'inputFile':'gs+unique_label://Algorithmia/test_data.csv'})
{% endhighlight %}

**NOTE:** If you call an algorithm it can only access your data source. This means that it is NOT possible for an algorithm to read data from your Google Cloud Storage and write that data to an account controlled by an another algorithm author. Algorithms do NOT have direct access to any credentials associated with your data sources, and can only access data from a data source using the Algorithmia API.

## Data Source Routes and Data API Routes

Once a data source connection has been created and configured, all of the Algorithmia client code for interacting with the Data API for file or directory creation, deletion and listing will function identically with a data source route and a data API route except for:

- We do not support generic ACLs for data sources and the only way to update permissions for a data source is through the data portal where you created your data source connection.

If you're implementing a new client or using cURL it is preferred to use the following URL structure:

- '/v1/connector/protocol+label/path':
    - '/v1/connector/gs+unique_label/foo/bar.txt'

## Algorithm support
We have tested to ensure that data source paths function in all of our Algorithmia clients, however:

- Python support was added in version 1.0.4
- NodeJS support was added in version 0.3.5
This means that algorithms in Python or JavaScript which were last compiled prior to 5/27/2016 might not have the most recent versions of these dependencies, and we can’t guarantee this new functionality will work on algorithms older than that. A simple recompilation of the algorithm will enable support without any code changes needed.

If you have any questions about Algorithmia please <a href="mailto:support@algorithmia.com">get in touch</a>!
