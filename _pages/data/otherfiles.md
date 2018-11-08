---
layout: article
title:  "Other File Stores"
excerpt: "Put and get files from other file storage systems"
categories: working-with-data
nav_index: 4
tags: [app-data-connectors]
show_related: true
author: jon_peck
image:
    teaser: /language_logos/filefolder.svg 
---

If your algorithm needs to read or write data files from a data source for which there is no [Data Connector](../), you can connect directly to that provider from within your algorithm.

Begin by finding an API or client library for that data source.  In this example, we'll use the Python module [b2blaze](https://pypi.org/project/b2blaze/) to demonstrate connecting to Backblaze file buckets.

### Step 1: store your credentials in a secure location

Create a folder within your [Data Portal]({{ site.baseurl }}/developers/data/) and set its read access to "Private".

Inside this folder, create a `.json` file containing your connection credentials. Backblaze uses ["key_id" and "application_key"](https://www.backblaze.com/blog/b2-application-keys), so the contents of the file will look like:

```
{
  "key_id": "000af74d6bf3db30000000001",
  "application_key": "K000c1ab70e8f7c67cf9d59128e3a3c"
}
```

### Step 2: load your credentials from within your algorithm

Once the credentials have been stored in a safe place (for example a file called "credentials.json" inside a Private folder called "BackblazeCredentials"), I'll need to load them from within my algorithm:

```
import Algorithmia
from Algorithmia.errors import AlgorithmException

client = Algorithmia.client()

def apply(input):
    #load Backblaze credentials
    try:
        creds = client.file('data://.my/BackblazeCredentials/credentials.json').getJson()
        assert {'key_id','application_key'}.issubset(creds)
    except:
        raise AlgorithmException('Please configure your credentials')
```

### Step 3: import dependencies and write code to manupulate your files

[b2blaze](https://pypi.org/project/b2blaze/) is a module which allows for the uploading and downloading of files to/from a Backblaze bucket, so we'll add `b2blaze` to our Dependencies within our algorithm, then add a bit of code to upload a file:

```
import Algorithmia
from Algorithmia.errors import AlgorithmException
from b2blaze import B2

client = Algorithmia.client()

def apply(input):
    #load Backblaze credentials
    try:
        creds = client.file('data://.my/BackblazeCredentials/credentials.json').getJson()
        assert {'key_id','application_key'}.issubset(creds)
    except:
        raise AlgorithmException('Please configure your credentials')
    #connect to Backblaze and select bucket
    bucket = 'some_bucket_name'
    datafile = 'data://.my/somecollection/somefile.png'
    remotefile = 'remotefolder/remotefile.png'
    b2 = B2(creds['key_id'],creds['application_key'])
    bucket = b2.buckets.get(bucket)
    if bucket is None:
      raise AlgorithmException('Invalid or inaccessible bucket')
    #upload file and return new file's url
    tempfile = client.file(datafile).getFile().name
    contents = open(tempfile,'rb')
    new_file = bucket.files.upload(contents,remotefile)
    return new_file.url
```

This example grabs a the file "somecollection/somefile.png" from our [Hosted Data]({{ site.baseurl }}/developers/data/hosted/), and uploads it to the bucket "some_bucket_name" as "remotefolder/remotefile.png".  I could use other functions of the b2blaze library to perform other operations instead, such as downloading a file from Backblaze and examining its contents, or creating and deleting folders or even entire buckets.

Your algorithm can contain abstract code, so feel free to experiment and use whichever public libraries fit your needs for connecting to the storage provider of your choice -- but do check our list of [Data Connectors](../) first to see if we already have a built-in connector ready for you to use.

For a complete implementation example using Backblaze, check the "docs" and "source" tabs of the [BackblazeConfig]({{ site.baseurl }}/algorithms/util/BackblazeConfig), [BackblazeUpload]({{ site.baseurl }}/algorithms/util/BackblazeUpload), and [BackblazeDownload]({{ site.baseurl }}/algorithms/util/BackblazeDownload) algorithms.   
