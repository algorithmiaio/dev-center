---
layout: article
title:  "Backblaze B2"
excerpt: "Put and get files from Backblaze B2"
categories: other-data-sources
nav_index: 4
tags: [other-data-sources]
show_related: true
author: jon_peck
image:
    teaser: /language_logos/filefolder.svg 
redirect_from:
  - /data/otherfiles/
---

Algorithms can easily access files stored in Backblaze B2 by using the [b2blaze](https://pypi.org/project/b2blaze/) library for Python.

### Step 1: store your credentials in a secure location

Create a folder within your [Data Portal]({{site.baseurl}}/data) and set its read access to "Private".

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

### Step 3: import dependencies and write code to manipulate your files

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

This example grabs the file "somecollection/somefile.png" from our [Hosted Data]({{site.baseurl}}/data/hosted), and uploads it to the bucket "some_bucket_name" as "remotefolder/remotefile.png".  We could use other functions of the b2blaze library to perform other operations instead, such as downloading a file from Backblaze and examining its contents, or creating and deleting folders or even entire buckets.

Your algorithm can contain abstract code, so feel free to experiment and use whichever public libraries fit your needs for connecting to the storage provider of your choice -- but do check our list of [Data Connectors](../) first to see if we already have a built-in connector ready for you to use.

For a complete implementation example using Backblaze, check the "docs" and "source" tabs of the [BackblazeConfig]({{site.url}}/algorithms/util/BackblazeConfig), [BackblazeUpload]({{site.url}}/algorithms/util/BackblazeUpload), and [BackblazeDownload]({{site.url}}/algorithms/util/BackblazeDownload) algorithms.   
