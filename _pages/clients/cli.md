---
categories: clients
excerpt: "Get familiar with the CLI client."
image:
    teaser: /language_logos/cli.svg
layout: article
redirect_from:
  - /application-development/client-guides/cli/
  - /application-development/guides/cli/
show_related: true
tags: [clients]
title:  "CLI"
---

Algorithmia's "algo CLI" command-line interface tool provides convenient methods for interacting with the Algorithmia API, enabling you to manage and call algorithms, work with data in object stores, and access other resources on the Algorithmia platform.

This guide will show you how to configure the algo CLI in your terminal, how to execute algorithms and pass input, and how read data from and write data to hosted storage. For complete details about the Algorithmia API, please refer to the [API Docs](/developers/api/).

## Set up the algo CLI client

### Installation

The algo CLI can be installed using the python package manager pip:

```shell
pip install algorithmia
```

If you’ll be running Python algorithms, also set the version via `export LANGUAGE_VERSION=python3`.
{: .notice-info}

See the [`algorithmia` repository on PyPI](https://pypi.org/project/algorithmia/) to view algo CLI release versions.

### Authentication and configuration

Algorithmia uses API keys to enable fine-grained access control across the platform, and you'll need one to configure a profile to access Algorithmia resource programatically through the algo CLI.

For this example, you can use the `default-key` that's created along with your account. This key is created with a broad set of permissions and will suffice for configuring a default profile. To view and manage your API keys, log in to the Algorithmia browser UI and navigate to your [account profile](/developers/platform/account-profile) and then **API Keys**. Read the docs for additional information about [customizing API keys](/developers/platform/customizing-api-keys).

Begin the configuration process by running the command `algo auth`. You'll see an interactive prompt, shown in the console output below, to guide you through setting up a default profile.

If you're an Algorithmia Enterprise customer, you'll need to replace the default (`https://api.algorithmia.com`) [base API URL](/developers/glossary/base-api-url) with your own cluster-specific value. Note that it must contain the `api` prefix after the web protocol (`https://`), so if your domain is `https://algorithmia.companyname.com`, your base API URL will be `https://api.algorithmia.companyname.com`.

You'll also need to enter a valid API key; the line to specify a CA certificate is optional and can be skipped by hitting *enter*/*return*.

```shell
$ algo auth
Configuring authentication for profile: default
enter API address [https://api.algorithmia.com]:
enter API key:
(optional) enter path to custom CA certificate:
```

To verify that the `default` profile was configured successfully, or at any later point to determine which account a profile `PROFILE_NAME` is associated with, you can run `algo ls --profile PROFILE_NAME`. This will print out the account name on the cluster.

The steps above will configure a default profile for accessing resources from one account on one [Algorithmia cluster](/developers/glossary/cluster). If you'd like to configure the algo CLI to be able to use more than one profile to access resources, for example to use multiple different accounts on a cluster or even to access multiple clusters, see [Using multiple profiles](#using-multiple-profiles), below.

## Calling an algorithm

Algorithms take three basic types of input whether they are invoked directly through the API or by using a client: strings, JSON, and binary data. In addition, individual algorithms might have their own I/O requirements, such as using different data types for input and output, or accepting multiple types of input, so consult the algorithm's documentation for specifics.

The first algorithm we'll call is a "Hello world" algorithm, which can be created as demonstrated in the algorithm development [Getting Started Guide](/developers/algorithm-development/your-first-algo). This simple algorithm takes a string as input and returns a string as output.

You can run the following command to make the request, where `ALGO_OWNER` is replaced by the name of the account owning the algorithm, and `ALGO_NAME` is replaced by the name of the algorithm.

```shell
$ algo run ALGO_OWNER/ALGO_NAME -d "HAL 9000"
```

This will print the phrase, `Hello HAL 9000`.

### Complex JSON inputs

You can provide JSON input directly to Algorithms invoked using the CLI. By default, if the data parses as JSON, the CLI will assume that it's JSON. You may also explicitly specify the input type as JSON using the `-j` flag.

Let's consider a natural language processing algorithm example algorithm that takes JSON input (this is the [nlp/LDA](https://algorithmia.com/algorithms/nlp/LDA) algorithm on Algorithmia's Marketplace cluster). The algorithm documentation tells us that the algorithm accepts a list of documents and returns a number of topics that are relevant to those documents. The documents can be a list of strings, an Algorithmia [data URI](/developers/glossary/data-uri), or a web URL. We'll call the algorithm using the first option—a list of strings.

The docs indicate that the valid input format contains the key `docsList` and at least one document (text) string.

```json
{
  "docsList": [
    "this is document 1",
    "this is document 2",
    ...
  ]
}
```

This algorithm can be called as follows; note that the entire JSON payload is double quoted, so internal double quotes (on strings) must be escaped.

```shell
$ algo run nlp/LDA/1.0.0 -j "{\"docsList\": [\"It's apple picking season\", \"The apples are ready for picking\"]}"
```

The output will be in the format `[{'picking': 2}, {'apple': 1}, {'apples': 1, 'ready': 1}, {'season': 1}]`, which is the list of relevant words and their associated topic frequencies.

You might have noticed that in this example we included a [version number](/developers/glossary/algorithm-version) when instantiating the algorithm. Calling a specific version of the algorithm can be especially important in a production environment where the underlying implementation might change from version to version.

### Request options

The Algorithmia API exposes options to configure algorithm requests. This includes support for specifying a non-default execution timeout duration as well as specifying an output file to which to write the response instead of printing to `stdout`. From the CLI, you can specify these options as arguments.

In the following example, the `timeout` is set to 60 seconds and the the `output` is written to a file instead of printed to the console.

```shell
$ algo run ALGO_OWNER/ALGO_NAME -d "HAL 9000" --timeout 60 --output results.txt
```

You can find more details about optional flags under [API Docs](/developers/api/?shell) > [Invoke an Algorithm](/developers/api/?shell#invoke-an-algorithm).

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

For some algorithms, passing input to the algorithm at request time is sufficient, while others might have larger data requirements or need to preserve state between calls. You can use Algorithmia's [hosted data](/developers/data/hosted) option to store text, JSON, and binary data and access it via Algorithmia's [data API](/developers/api/?shell#data).

The data API defines [connectors](/developers/api/?shell#connectors) to a variety of storage providers, including Algorithmia [hosted data](/developers/data/hosted), Amazon S3, Azure Blob Storage, Google Cloud Storage, and Dropbox. After configuring a connection under the Data Sources tab in the browser UI, you can use the API to manage permissions across providers and to create, update, and delete directories and files using [Data URIs](/developers/api/#data-uris).

The algo CLI supports a set of familiar shell commands such as `ls`, `rm`, and `cp` for working with the [Data API](/developers/api/?shell#data). You can find complete documentation for these commands in the [GitHub repository](https://github.com/algorithmiaio/algorithmia-python#the-algorithmia-data-api).

In the example below, you'll upload an image to Algorithmia's [hosted data](/developers/data/hosted) storage provider, and then use a face detection algorithm (located on the Public Marketplace at [dlib/FaceDetection](https://algorithmia.com/algorithms/dlib/FaceDetection)) to detect any faces in the image. The algorithm will create a new copy of the image with bounding boxes drawn around the detected faces, and then return a JSON object with details about the dimensions of the bounding boxes and a URI for downloading the resulting image.

### Create a data collection

In this example, you'll process an image that's been uploaded to a hosted data collection, so you'll need to first create a collection to host the input image.

```shell
$ algo mkdir .my/img_directory
```

Instead of your account name you can also use '.my' when calling algorithms. For more information about the '.my' pseudonym check out the [Hosted Data Guide]({{site.baseurl}}/data/hosted).
{: .notice-info}

### Upload data to the data collection

You're now ready to upload an image file for processing. For this example, you can use [this photo of a group of friends](https://unsplash.com/photos/Q_Sei-TqSlc). Download the image and save it locally as `friends.jpg`. Then, upload this local file using the `cp` command to copy the file into hosted storage.

```
$ algo cp ./friends.jpg data://.my/img_directory
```

This approach will overwrite a file with the same name if it already exists at the specified location. If you wish to avoid overwriting an existing file, check if the file exists before using this command.
{: .notice-warning}

Note that you can also upload your data directly through the browser UI by clicking the **Upload Files** button from within a data collection.

You can confirm visually that the file was uploaded to hosted storage by navigating to the collection in the browser UI under **Data Sources** > `My Hosted Data` > `img_directory`. You can also check by [listing the contents of the directory](https://algorithmia.com/developers/api/#list-directory-contents) using the data API.

### Format algorithm input

The documentation for the face detection algorithm indicates that it accepts a list of one or more URLs or data URIs for images to be processed, and optionally, associated data URI(s) where the algorithm should save the processed image(s).

```json
{
  "images": [
    {
      "url": "https://en.wikipedia.org/wiki/Barack_Obama#/media/File:DIG13623-230.jpg",
      "output": "data://.algo/temp/detected_faces.png"
    },
    ...
  ]
}
```
### Call the algorithm

Once the file has been uploaded, you're ready to call the algorithm. Use the input format shown above, remembering to escape internal double quotes.

```
$ algo run dlib/FaceDetection/0.2.1 -j "{\"images\": [{\"url\": \"data://.my/img_directory/friends.jpg\",\"output\": \"data://.algo/temp/detected_faces.png\"}]}"
```

Once algorithm execution has completed, the response will contain the dimensions of the bounding boxes for any detected faces and the data URI of the resulting processed image file, which you can then download (or provide as input to another algorithm in a pipeline) as desired.

Algorithms can create and store data in collections named with the algorithm name under **Data Sources** > `Algorithm Data`. To access this storage location from within an executing algorithm, the `.algo` shortcut can be used, as in the input example above. When accessing data from a client context, the algorithm owner and name can be used along with the `.algo` shortcut to download data, in the format `data://.algo/ALGO_OWNER/ALGO_NAME/COLLECTION_NAME/FILE_NAME`.
{: .notice-info}

### Download the resulting file

The data URI included in the algorithm output uses the `.algo` shortcut, so you'll need to modify it slightly to download the file locally, by adding the algorithm owner and name.

```
$ algo cp data://.algo/dlib/FaceDetection/temp/detected_faces.png ./detected_faces.png
```

## Using multiple profiles

### Add additional profiles

You can configure multiple custom profiles to use with the algo CLI. There are several reasons you might want to do this, for example to use different accounts on your cluster, or even to access different accounts on different clusters (for example Development and Production clusters) from the same terminal environment. To add a new profile, you'll run through the same interactive prompt as shown [above](#authentication-and-configuration), but you'll add the `profile` flag and specify the new profile name.

```shell
$ algo auth --profile second_profile
Configuring authentication for profile: second_profile
Enter API address [https://api.algorithmia.com]:
Enter API Key:
(optional) enter path to custom CA certificate:
```

### Use non-default profiles

The Algorithmia CLI will use the default profile when running commands unless another profile is explicitly specified with `--profile` flag.

```shell
$ algo run ALGO_OWNER/ALGO_NAME -d "HAL 9000" --profile second_profile
Hello HAL 9000
```

## Listing algorithm languages and environments and downloading algorithm template files

When you create an algorithm, you can choose to use a predefined [algorithm environment](/developers/algorithm-development/environments) that's been optimized for the Algorithmia platform with specific ML library dependencies baked in. You can [use the algo CLI to list the algorithm languages](/developers/algorithm-development/environments/#list-languages-and-environments-and-download-algorithm-template-files) on a specific cluster, select a language and list its corresponding algorithm environments, and then download algorithm template files if desired. The algo CLI makes this multi-step process straightforward.

## Additional functionality

In addition to the functionality covered in this guide, the API provides a complete interface to the Algorithmia platform, including [managing algorithms](/developers/algorithm-development/algorithm-management), administering [organizations](/developers/platform/organizations), and working with third-party [source code management providers](/developers/algorithm-development/source-code-management). Visit the [API Docs](/developers/api) to view the complete API specification.

## Next steps

If you'd like to access Algorithmia resources programatically from external applications or scripts, we have [Client Guides](https://algorithmia.com/developers/clients) in many popular programming languages. To learn how to develop and deploy new algorithms, see our [Getting Started Guide](/developers/algorithm-development/your-first-algo/).
