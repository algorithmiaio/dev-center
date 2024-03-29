---
categories: clients
excerpt: "Get going with the cURL client on Algorithmia."
image:
    teaser: /language_logos/curl.svg
layout: article
tags: [clients]
title: "cURL"
redirect_from:
  - /application-development/client-guides/cURL/
  - /application-development/client-guides/curl/
  - /application-development/guides/curl/
show_related: true
---

{% include video-responsive.html height="560" width="315" url="https://www.youtube.com/embed/VIxCEFFmpWQ" %}

The Algorithmia API lets developers manage and call algorithms, work with data in object stores using Algorithmia data sources, and access and manage numerous other features of the Algorithmia platform. You can use cURL, an open source command-line tool, to access all features of our REST interface directly over HTTPS.

This guide will cover calling an algorithm using cURL with direct user input, calling an algorithm that accesses data through Algorithmia's data API, and using Algorithmia's hosted data capabilities. For a comprehensive listing of the endpoints available through Algorithmia's API, please refer to our [API Docs](/developers/api/?shell).

## Calling an algorithm

Regardless of whether they're invoked directly through the API or through a client library, algorithms take three basic types of input: strings, JSON blobs, and binary data. Within these constraints, individual algorithms may have more specific I/O requirements as well—they may only accepting specific data types for input, or they may accept multiple input types but then use internal logic to handle those different types. Consult the **Input** and **Output** sections of an algorithm's documentation for specifics.

To access the API, you'll need an [API key](/developers/glossary#api-key), which Algorithmia uses for authentication and fine-grained resource access across the platform. Log in to Algorithmia's browser UI and navigate to **Home** &rarr; **API Keys** to locate your API key. For the examples in this guide, you can use the `default-key` that's created along with your account. This is a [standard API key](/developers/glossary#standard-api-key) with a broad set of permissions.

As shown in the code sample below, you'll provide your API key via an `Authorization` header, replacing `STD_API_KEY` with your key and using the `Simple` prefix to specify the [authentication token](/developers/glossary#authentication-token) type. For more information on how to work with API keys, see the [API keys documentation](/developers/platform/customizing-api-keys).

The first algorithm you'll call in this guide is the boilerplate [hello world](https://algorithmia.com/algorithms/demo/hello) algorithm used in the algorithm development [Getting Started](/developers/algorithm-development/your-first-algo#creating-your-first-algorithm) guide. This algorithm takes a string as input and returns a string as output. You can use the cURL command below to make the request.

Note that if you're working with a private Algorithmia Enterprise cluster, you'll need to replace `algorithmia.com` with your [cluster-specific domain name](/developers/glossary#cluster-domain) and the algorithm endopint will need to be changed to `/v1/algo/ALGO_OWNER/ALGO_NAME`, where `ALGO_OWNER` is the [name of your account](/developers/glossary#algorithm-owner)) and `ALGO_NAME` is the [name of your algorithm](/developers/glossary#algorithm).

```shell
$ curl https://api.algorithmia.com/v1/algo/demo/hello \
    -X POST \
    -H 'Content-Type: application/json' \
    -H 'Authorization: Simple STD_API_KEY' \
    -d '"HAL 9000"'
```

When executed with a valid API key, this will print the phrase `Hello HAL 9000` in your terminal.

### Complex JSON inputs

Let's explore an example using the more complicated JSON input associated with a [natural language processing (NLP)](https://algorithmia.com/algorithms/nlp/LDA) algorithm. This algorithm takes a list of documents and returns a number of topics that are relevant to those documents. The documents can be a list of strings, a [data URI](/developers/glossary#data-uri), or a URL. Suppose you want to call this algorithm using a list of strings; you could achieve this with the cURL command below.

```shell
$ curl https://api.CLUSTER_DOMAIN/v1/algo/nlp/LDA/1.0.0 \
    -X POST \
    -H 'Content-Type: application/json' \
    -H 'Authorization: Simple STD_API_KEY' \
    -d '{
      "docsList": [
        "It is apple picking season",
        "The apples are ready for picking"
      ]
    }'
```

The output is in the format `[{'picking': 2}, {'apple': 1}, {'apples': 1, 'ready': 1}, {'season': 1}]`, which is the list of relevant words and the number of occurrences of each.

Notice that in the command above, the API endpoint includes a version number `ALGO_VERSION`. We recommend providing a [fully specified semantic version](/developers/platform/versioning#fully-specified-semantic-version) to indicate exactly which version of algorithm you're requesting. This becomes particularly important in production environments to ensure that the correct version is being executed, as the underlying implementation might change between versions.

### Request options

The API exposes options for configuring algorithm requests. This includes support for changing the execution timeout or indicating that the API should include `stdout` in the response. With cURL, you can provide these options as URL parameters. The example below shows how to set the timeout to 60 seconds and disable `stdout` in the response for the hello world algorithm from above.

```shell
$ curl 'https://api.algorithmia.com/v1/algo/demo/hello?timeout=60&stdout=false' \
    -X POST \
    -H 'Content-Type: application/json' \
    -H 'Authorization: Simple STD_API_KEY' \
    -d '"HAL 9001"'
```

You can find more details under [API Docs](/developers/api/?shell) &rarr; [Invoke an Algorithm](/developers/api/?shell#invoke-an-algorithm).

### Error handling

To be able to better develop across languages, we've created a set of standardized error classes that can be returned by either the platform itself or by the individual algorithm being run. If an error occurs while invoking the API, the HTTP response will include an `error` field with error information.

```shell
$ curl https://api.algorithmia.com/v1/algo/ALGO_OWNER/DOES_NOT_EXIST \
    -X POST \
    -H 'Content-Type: application/json' \
    -H 'Authorization: Simple STD_API_KEY' \
    -d '"Hello, world"'
```

When this hypothetical `DOES_NOT_EXIST` algorithm is called, it returns the response `{"error": {"message": "algorithm algo://ALGO_OWNER/DOES_NOT_EXIST not found"}}`, indicating that the platform couldn't locate the algorithm resource.

To learn how to handle errors elagantly and expressively in your own algorithms, see [Error Handling](/developers/algorithm-development/algorithm-errors).

### Limits

By default, one account can make up to {{site.data.stats.platform.max_num_algo_requests}} concurrent [algorithm execution requests](/developers/glossary#algorithm-execution-request) (this limit can be increased if needed).

Algorithmia has a 10-MB maximum input data payload limit and a 15-MB maximum output data payload limit. Therefore, to transfer large image files into and out of your algorithm, you may need to upload your data (JSON, JPEG, etc.) to a hosted data collection, passing the data URI to the algorithm as input instead of passing the data itself, and then reading the data from within the algorithm. See Algorithmia's [data API docs](/developers/api/#data) for sample code.

Note that these limits are actually slightly nuanced. When you send an input payload to an algorithm, that data is base64-encoded by the Algorithmia API client. So, for example, a 5-MB sequence of the letter "a" actually ends up as 6 MB of data transferred. You can verify this in a Python shell as shown below.

```python
>>> import base64
>>> len(base64.standard_b64encode(b"a"*1024*1024*5))/1024/1024
6.666667938232422
```

If your payload has unicode characters, they occupy several bytes each. When these characters are encoded, the discrepancy in payload size will be even larger than that shown above. Therefore, if sending and receiving large payloads, you might run up against these limits, even if the file size itself is not greater than the exact input or output limits.

## Working with Algorithmia data sources

For some algorithms, passing input data at request time is sufficient. However, for algorithms with larger data payload requirements, and for those that require preservation of state between calls, it may be convenient or necessary to use Algorithmia's various [data sources](/developers/glossary#data-source) to store text, JSON, or binary data and then access it via the Algorithmia's [data API](/developers/api/?shell#data) at run time.

The data API defines [connectors](/developers/api/?shell#connectors) to a variety of storage providers, including Algorithmia [hosted data](/developers/data/hosted), Amazon S3, Azure Blob Storage, Google Cloud Storage, and Dropbox. After creating a connection in the browser UI under **Data Sources** or through the data API, you can use the API to create, update, and delete directories and files and manage permissions across storage providers.

In this example, you'll upload an image to Algorithmia's [hosted data](/developers/data/hosted) storage provider and then use a [face detection](https://algorithmia.com/algorithms/dlib/FaceDetection) algorithm to detect any faces in the image. According to the algorithm's [documentation](https://algorithmia.com/algorithms/dlib/FaceDetection/docs), the algorithm creates a new copy of the image with bounding boxes drawn around the detected faces, and then returns a JSON object with a `detected_faces` property listing the coordinates of the bounding boxes where faces were found, as well as a `url` field listing a data URI where the resulting image can be downloaded.

### Create a data collection

The [documentation](https://algorithmia.com/algorithms/dlib/FaceDetection/docs) for the face detection algorithm says that as input it takes a URL or a data URI of the image to be processed, and a data URI where the algorithm can store the result. We'll first execute a `POST` request to create a directory to host the input image. Then, we'll execute a `PATCH` request with the appropriate ACL to update the directory's [permissions](/developers/api/#update-collection-acl) so that it's publicly accessible.

```shell
$ curl 'https://api.algorithmia.com/v1/data/.my' \
    -X POST \
    -H 'Content-Type: application/json' \
    -H 'Authorization: Simple STD_API_KEY' \
    -d '{"name": "img_directory"}'
```

The response indicates the URI of the new collection: `{"result": "data://.my/img_directory"}`

```shell
$ curl 'https://api.algorithmia.com/v1/connector/data/.my/img_directory' \
    -X PATCH \
    -H 'Content-Type: application/json' \
    -H 'Authorization: Simple STD_API_KEY' \
    -d '{"acl": {"read": ["user://*"]} }'
```

Note that, as demonstrated above, instead of your account name you can also use `.my` when calling algorithms. For more information about the `.my` pseudonym, see the [hosted data docs]({{site.baseurl}}/data/hosted).
{: .notice-info}

### Upload data to your data collection

Now you're ready to upload an image file for processing. For this example, you can use [this photo of a group of friends](https://unsplash.com/photos/Q_Sei-TqSlc). Download the image and save it locally as `friends.jpg`, and then upload the local file to the data collection using the following `PUT` command.

```shell
$ curl 'https://api.algorithmia.com/v1/connector/data/.my/img_directory/friends.jpg' \
    -X PUT \
    -H 'Authorization: Simple STD_API_KEY' \
    --data-binary @PATH/TO/LOCAL_DIRECTORY/friends.jpg
```

**NOTE**: This method call will replace a file if it already exists at the specified location. If you wish to avoid replacing a file, check if the file exists before using this method.
{: .notice-warning}

Confirm that the file was created by navigating to **Data Sources** in the browser UI and finding the data collection and file.

You can also upload your data through the Algorithmia's browser UI; see the [hosted data docs](/developers/data/hosted) for details.

### Call the algorithm

Once the file has been uploaded, you are ready to call the algorithm, providing the inputs as specified in the [FaceDetection documentation](https://algorithmia.com/algorithms/dlib/FaceDetection/docs)—an image URI (which is stored in `img_file` in the code above) and a URI for the image output:

```shell
$ curl https://api.algorithmia.com/v1/algo/dlib/FaceDetection/0.2.1 \
    -X POST \
    -H 'Content-Type: application/json' \
    -H 'Authorization: Simple STD_API_KEY' \
    -d '{
      "images": [
        {
            "url": "data://.my/img_directory/friends.jpg",
            "output": "data://.algo/temp/detected_faces.png"
        }
      ]
    }'
```

Once the algorithm execution completes, the response will contain the dimensions of the bounding boxes for any detected faces and the URI for the resulting file, which you can then download (or provide as input to another algorithm in a pipeline).

Algorithms can create and store data in folders named with the algorithm name in the algorithm data collection. To access files in this location from within an executing algorithm, the `.algo` shortcut can be used, as in the input example above. When accessing data from a client context, the algorithm owner and name can be used along with the `.algo` shortcut to download data, in the format `data://.algo/ALGO_OWNER/ALGO_NAME/COLLECTION_NAME/FILE_NAME`.
{: .notice-info}

### Download the resulting file

The URI included in the algorithm output uses the `.algo` shortcut, so we'll need to modify it slightly to download the file by adding the algorithm name and author. We can then attempt to download the file and write it to disk:

```shell
$ curl https://api.algorithmia.com/v1/connector/data/.algo/dlib/FaceDetection/temp/detected_faces.png \
    -H 'Authorization: Simple STD_API_KEY' \
    -O # save image locally with remote file name
```

## Additional Functionality

In addition to the functionality covered in this guide, the API provides a complete interface to the Algorithmia platform, including [managing algorithms](/developers/algorithm-development/algorithm-management), administering [organizations](/developers/platform/organizations), and working with external [source code management](/developers/algorithm-development/source-code-management) providers. You can also visit the [API Docs](/developers/api) to view the complete API specification.

## Next Steps

If you'd like to use a particular programming language for accessing the Algorithmia platform, you can refer to the rest of our [Client Guides](https://algorithmia.com/developers/clients). If you'll be building and deploying new algorithms on the platform, , you can move on to the [Algorithm Development > Getting Started](/developers/algorithm-development/your-first-algo/) guide.
