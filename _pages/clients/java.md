---
layout: article
title: "Java"
excerpt: "Working in Java? Check out this Algorithmia Java client."
categories: clients
tags: [clients]
show_related: true
image:
    teaser: /language_logos/java.svg
repository: https://github.com/algorithmiaio/algorithmia-java
redirect_from:
  - /algorithm-development/client-guides/java/
  - /algorithm-development/guides/java/
  - /algorithm-development/guides/java-guide/
  - /application-development/client-guides/java/
  - /application-development/guides/java/
  - /application-development/lang-guides/java/
---

This guide provides a walk-through of how to use the official Algorithmia Java Client to call algorithms and manage data through the Algorithmia platform.

Here you will learn how to install the Algorithmia Java Client, work with the Data API by uploading and downloading files, create and update directories and permission types and last, you'll learn how to call an algorithm that summarizes text files.

To follow along you can create a new Java file in the IDE of your choice.



## Getting Started with Algorithmia

The Algorithmia Java Client is published to Maven central and additional reference documentation can be found in the [Algorithmia Client JavaDocs](https://www.javadoc.io/doc/com.algorithmia/algorithmia-client) and the [Algorithmia API docs](http://docs.algorithmia.com/?java#).

To get started, the Algorithmia Java Client can be added as a library through Maven using your IDE of choice or you can [download the JAR file](https://mvnrepository.com/artifact/com.algorithmia/algorithmia-client) and add it as a dependency in your POM file:

{% highlight java %}
<dependency>
  <groupId>com.algorithmia</groupId>
  <artifactId>algorithmia-client</artifactId>
  <version>[,1.1.0)</version>
</dependency>
{% endhighlight %}

Using version range [,1.1.0) is recommended as it implies using the latest backward-compatible bugfixes.
{: .notice-info}

## Authentication

Next, login to [Algorithmia](/) to get your [API key](/user#credentials):

Now import the Algorithmia library and create the Algorithmia client:

{% highlight java %}
import com.algorithmia.*;
AlgorithmiaClient client = Algorithmia.client("YOUR_API_KEY");
{% endhighlight %}

Now you’re ready to start working with Algorithmia in Java.

{% if site.enterprise %}
#### Enterprise Users Only: Specifying an On-Premises or Private Cloud Endpoint
If you are running [Algorithmia Enterprise](/enterprise), you can specify the API endpoint when you create the client object:

{% highlight java %}
AlgorithmiaClient client = Algorithmia.client("YOUR_API_KEY", "https://mylocalendpoint");
{% endhighlight %}

Alternately, you can ensure that each of your servers interacting with your Algorithmia Enterprise instance have an environment variable named `ALGORITHMIA_API` and the client will use it.  The fallback API endpoint is always the hosted Algorithmia marketplace service at [https://api.algorithmia.com/](https://api.algorithmia.com/)
{% endif %}

## Working with Data Using the Data API

For application developers, [Algorithmia's Data Portal](/data) offers three different ways to store your data, all available via the [Data API](http://docs.algorithmia.com/#data-api-specification).

This guide will show you how to work with the [Hosted Data]({{site.baseurl}}/data/hosted) option on the Algorithmia platform which is available to both algorithm and application developers.

### Prerequisites
If you wish to follow along working through the example yourself, create a text file that contains any unstructured text such as a chapter from a public domain book or article. We used a chapter from [Burning Daylight, by Jack London](https://en.wikisource.org/wiki/Burning_Daylight) which you can copy and paste into a text file. Or copy and paste it from here: <a href="{{site.baseurl}}/data_assets/burning_daylight.txt">Chapter One Burning Daylight, by Jack London</a>. This will be used throughout the guide.

### Create a Data Collection

This section will show how to create a data collection which is essentially a folder of data files hosted on Algorithmia for free.

Import the DataDirectory object to work with data collections:

{% highlight java %}
import com.algorithmia.data.DataDirectory;
{% endhighlight %}

Now create a data collection called nlp_directory:

{% highlight java %}
// Instantiate a DataDirectory object, set your data URI and call create
DataDirectory nlp_directory = client.dir("data://YOUR_USERNAME/nlp_directory");
// Create your data collection if it does not exist
try {
    if (!nlp_directory.exists()) {
        nlp_directory.create();
    }
} catch (APIException e) {
    e.printStackTrace();
}
{% endhighlight %}

A Data URI uniquely identifies files and directories and contains a protocol "data://" and path "YOUR_USERNAME/data_collection". For more information on the Data URI see the [Data API Specification](http://docs.algorithmia.com/#data-api-specification).

Instead of your username you can also use '.my' when calling algorithms. For more information about the '.my' pseudonym check out the [Hosted Data Guide]({{site.baseurl}}/data/hosted).
{: .notice-info}

### Work with Directory Permissions

When we created the data collection in the previous code snippet, the default setting is `DataAclType.MY_ALGOS` which is a permission type that allows other users on the platform to interact with your data through the algorithms you create if you decide to contribute to algorithm development. This means users can call your algorithm to perform an operation on your data stored in this collection, otherwise the algorithm you created would only work for you.

To begin working with data directory permissions first add these imports:

{% highlight java %}
import java.io.IOException;

import com.algorithmia.APIException;
import com.algorithmia.AlgorithmException;
import com.algorithmia.data.DataAcl;
import com.algorithmia.data.DataAclType;
{% endhighlight %}

Next check for the data collection's permission type and update those permissions to private:

{% highlight java %}
// Create the acl object and check if it's the .MY_ALGOS default setting
DataAcl acl = nlp_directory.getPermissions();

if (acl.getReadPermissions() == DataAclType.MY_ALGOS) {
    System.out.println("acl is the default permissions type MY_ALGOS");
}

// Update permissions to private
try {
    nlp_directory.updatePermissions(DataAcl.PRIVATE);
    if (acl.getReadPermissions() == DataAclType.PRIVATE) {
        System.out.println("Directory updated to PRIVATE");
    }
} catch (APIException e) {
    e.printStackTrace();
}
{% endhighlight %}

Notice that we changed our data collection to private, which means that only you will be able to read and write to your data collection.

Note that read access that is set to the default `DataMyAlgorithms` allows any algorithm you call to have access to your data collection so most often, this is the setting you want when you are calling an algorithm and are an application developer.

For more information on collection-based Access Control Lists (ACLs) and other data collection permissions go to the [Hosted Data Guide]({{site.baseurl}}/data/hosted).

### Upload Data to your Data Collection

So far you've created your data collection and checked and updated directory permissions. Now you're ready to upload the text file that you created at the beginning of the guide to your data collection using the Data API.

First add the necessary dependencies:

{% highlight java %}
import java.io.File;
import java.io.FileNotFoundException;
{% endhighlight %}

Then upload your local file to the data collection using the `.putFile()` method:

{% highlight java %}
try {
    String local_file = "local_path_to_your_file/jack_london.txt";
    nlp_directory.putFile(new File(local_file));
} catch (FileNotFoundException e) {
    e.printStackTrace();
}
{% endhighlight %}

This endpoint will replace a file if it already exists. If you wish to avoid replacing a file, check if the file exists before using this endpoint.
{: .notice-warning}

You can confirm that the file was created by navigating to Algorithmia's [Hosted Data Source](/data/hosted) and finding your data collection and file.

You can also upload your data through the UI on Algorithmia's [Hosted Data Source](/data). For instructions on how to do this go to the [Hosted Data Guide]({{site.baseurl}}/data/hosted).

### Downloading Data from a Data Collection

Next check if the file that you just uploaded to data collections exists, and try downloading it to a (new) local file:

{% highlight java %}
// Download the file
String text_file = "data://YOUR_USERNAME/nlp_directory/jack_london.txt";
try {
    if (client.file(text_file).exists()) {
        File localfile = client.file(text_file).getFile();
    } else {
        System.out.println("Please check that your file exists");
    }
} catch (IOException e) {
    e.printStackTrace();
}
{% endhighlight %}

This copies the file from your data collection and saves it as a file on your local machine, storing the filename in the variable `localfile`.

Alternately, if you just need the text content of the file to be stored in a variable, you can retrieve the remote file's content without saving the actual file:

{% highlight java %}
// Download contents of file as a string
String text_file = "data://YOUR_USERNAME/nlp_directory/jack_london.txt";
try {
    if (client.file(text_file).exists()) {
        String input = client.file(text_file).getString();
    } else {
        System.out.println("Please check that your file exists");
    }
} catch (IOException e) {
    e.printStackTrace();
}
{% endhighlight %}

This will get your file as a string, saving it to the variable `input`.  If the file was binary (an image, etc), you could instead use the function `.getBytes()` to retrieve the file's content as a byte array.

Now you've seen how to upload a local data file, check if a file exists in a data collection, and download the file contents.

For more methods on how to get a file using the Data API from a data collection go to the [API Specification](http://docs.algorithmia.com/#getting-a-file).

## Call an Algorithm

Finally we are ready to call an algorithm. In this guide we'll use the natural language processing algorithm called [Summarizer](https://algorithmia.com/algorithms/nlp/Summarizer). This algorithm results in a string that is the summary of the text content you pass in as the algorithm's input.

A single algorithm may have different input and output types, or accept multiple types of input, so consult the algorithm’s description for usage examples specific to that algorithm.
{: .notice-info}

This example shows the summary of the text file which we downloaded from our data collection and set as the variable called `input` in the previous code sample.

Add this import to call algorithms:

{% highlight java %}
import com.algorithmia.algo.*;
{% endhighlight %}

Create the algorithm object and pass in the variable `input` into `algo.pipe()`:

{% highlight java %}
// Create the algorithm object using the Summarizer algorithm
Algorithm algo = client.algo("nlp/Summarizer/0.1.3")
// Pass in input required by algorithm adding to the code snippet in the last step
try {
    if (client.file(text_file).exists()) {
        String input = client.file(text_file).getString();
        Algorithm summarizer_algo = client.algo("nlp/Summarizer/0.1.3");
        String result = summarizer_algo.pipe(input).asString();
        System.out.println(result);
    } else {
        System.out.println("Please check that your file exists");
    }
} catch (IOException e) {
    e.printStackTrace();
} catch (AlgorithmException e) {
    e.printStackTrace();
}
{% endhighlight %}

This guide used the the first chapter of [Jack London's Burning Daylight](https://en.wikisource.org/wiki/Burning_Daylight) and the Summarizer algorithm outputs:

"It was a quiet night in the Shovel. The miners were in from Moseyed Creek and the other diggings to the west, the summer washing had been good, and the men's pouches were heavy with dust and nuggets. MacDonald grinned and nodded, and opened his mouth to speak, when the front door swung wide and a man appeared in the light."

If you are interested in learning more about working with unstructured text data check out our guide [Introduction to Natural Language Processing](https://algorithmia.com/blog/introduction-natural-language-processing-nlp).

{% if site.enterprise %}
## Publishing Algorithmia Insights

Inference-related metrics (a feature of [Algorithmia Insights](../algorithmia-enterprise/algorithmia-insights)) can be reported via using the `reportInsights` method of the Algorithmia client.

{% highlight java %}
// Report Algorithmia Insights
client.reportInsights(new HashMap<String,Object>() { {
    put("cats_in_image", 4);
    put("dogs_in_image", true);
} });
{% endhighlight %}

{% endif %}

## Limits

Your account can make up to {{site.data.stats.platform.max_num_algo_requests}} Algorithmia requests at the same time (this limit <a onclick="Intercom('show')">can be raised</a> if needed).

## Conclusion

This guide covered installing Algorithmia via a POM file, uploading and downloading data to and from a user created data collection, checking if a file exists using the Data API, calling an algorithm, and handling errors.

For more information on the methods available using the Data API in Java check out the [Data API](http://docs.algorithmia.com/?java#data-api-specification) documentation or go to the [Java Client Docs](https://github.com/algorithmiaio/algorithmia-java) for examples of executing common tasks with Algorithmia. For all available methods and versions go to the [Algorithmia Java Language Docs](https://www.javadoc.io/doc/com.algorithmia/algorithmia-client).

For convenience, here is the whole script available to run:

{% highlight java %}
package com.company;
import com.algorithmia.*;
import com.algorithmia.algo.*;
import com.algorithmia.data.DataAcl;
import com.algorithmia.data.DataAclType;
import com.algorithmia.data.DataDirectory;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;

public class Main {

    public static void main(String[] args) throws APIException {
	// write your code here
        AlgorithmiaClient client = Algorithmia.client("YOUR_API_KEY");
        // Set your Data URI
 		DataDirectory nlp_directory = client.dir("data://YOUR_USERNAME/nlp_directory");
        // Create your data collection if it does not exist
        try {
            if (!nlp_directory.exists()) {
                nlp_directory.create();
            }
        } catch (APIException e) {
            e.printStackTrace();
        }
        // Create the acl object and check if it's the .MY_ALGOS default setting
        DataAcl acl = nlp_directory.getPermissions();

        if (acl.getReadPermissions() == DataAclType.MY_ALGOS) {
            System.out.println("acl is the default permissions type MY_ALGOS");
        }

        // Update permissions to private
        try {
            nlp_directory.updatePermissions(DataAcl.PRIVATE);
            if (acl.getReadPermissions() == DataAclType.MY_ALGOS) {
                System.out.println("acl is the default permissions type MY_ALGOS");
            }
        } catch (APIException e) {
            e.printStackTrace();
        }

        String local_file = "local_path_to_your_file/jack_london.txt"
        try {
            nlp_directory.putFile(new File(local_file));
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        }
        String text_file = "data://YOUR_USERNAME/nlp_directory/jack_london.txt";
        try {
            if (client.file(text_file).exists()) {
                String input = client.file(text_file).getString();
                Algorithm summarizer_algo = client.algo("nlp/Summarizer/0.1.3");
                String result = summarizer_algo.pipe(input).asString();
                System.out.println(result);
            } else {
                System.out.println("Please check that your file exists");
            }
        } catch (IOException e) {
            e.printStackTrace();
        } catch (AlgorithmException e) {
            e.printStackTrace();
        }
    }
}
{% endhighlight %}
