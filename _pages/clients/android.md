---
layout: article
title: "Android"
excerpt: "Get going with the Android client on Algorithmia."
categories: clients
tags: [clients]
ignore_sections: [install-from-source, upgrading-from-0-9-x, running-tests]
show_related: true
image:
    teaser: /language_logos/android.svg
repository: https://github.com/algorithmiaio/algorithmia-android
---

This guide provides a walk-through of how to use the official Algorithmia Android Client to call algorithms and manage your data through the Algorithmia platform.

Here you will learn how to install the Android Client, work with the Data API by uploading and downloading files, create and update directories and permission types and last, you'll learn how to call an algorithm that summarizes text files.

To follow along you can create a new project in Android Studio or your IDE of choice.

## Getting Started with Algorithmia

The Algorithmia Android Client is published to Maven Central and can be added as a dependency in Android Studio in your Gradle file. Additional reference documentation can be found at [Android Client Docs](https://github.com/algorithmiaio/algorithmia-android) and for API documentation see the [Algorithmia API docs](http://docs.algorithmia.com/?java#).

**Note:** Because our Java Client depends on Apache HTTP Client, it is not compatible with the Android Runtime. In early versions of Android, a legacy version of apache http client came pre-bundled, but was not updated over time. In recent Android versions (6.0+) it was removed entirely. See Android docs [here](https://developer.android.com/about/versions/marshmallow/android-6.0-changes.html#behavior-apache-http-client). The algorithmia-android client uses native HttpURLConnection as its underlying client, as recommended by the Android documentation.

To install the Algorithmia Android Client, add the following line to your `app/build.gradle` file:

{% highlight java %}
"com.algorithmia:algorithmia-android:1.0.1"
{% endhighlight %}

## Authentication

Next, login to [Algorithmia](https://algorithmia.com/) to get your [API key](https://algorithmia.com/user#credentials):

Now import the Algorithmia library and create the Algorithmia client:

{% highlight java %}
import com.algorithmia.Algorithmia;
import com.algorithmia.AlgorithmiaClient;
import com.algorithmia.algo.Algorithm;

AlgorithmiaClient Client = Algorithmia.client("YOUR_API_KEY");
{% endhighlight %}

Now you’re ready to start working with Algorithmia for Android development.

## Working with Data Using the Data API

For application developers, [Algorithmia's Data Portal](https://algorithmia.com/data) offers three different ways to store your data, all available via the [Data API](http://docs.algorithmia.com/#data-api-specification).

This guide will show you how to work with the [Hosted Data]({{ site.baseurl }}/data/hosted/) option on the Algorithmia platform which is available to both algorithm and application developers.

### Prerequisites
If you wish to follow along working through the example yourself, create a text file that contains any unstructured text such as a chapter from a public domain book or article. We used a chapter from [Burning Daylight, by Jack London](https://en.wikisource.org/wiki/Burning_Daylight) which you can copy and paste into a text file. Or copy and paste it from here: <a href="{{ site.baseurl }}/data_assets/burning_daylight.txt">Chapter One Burning Daylight, by Jack London</a>. This will be used throughout the guide.

If you want to check out how to build a simple Android app from start to finish using Algorithmia check out this [Android Sample App](https://github.com/algorithmiaio/sample-apps/tree/master/android/basic_integration).
{: .notice-info}

#### Android Threads

It is necessary to perform network operations (such as calling Algorithmia) on a background thread in Android, to avoid impacting UI performance. The standard way to acheive this in Android is to use an AsyncTask.

See Android documentation about UI vs. Background threads: [Processes and Threads](https://developer.android.com/guide/components/processes-and-threads.html)

{% highlight java %}
/**
 * AsyncTask helper to make it easy to call Algorithmia in the background
 * @param <T> the type of the input to send to the algorithm
 */
public abstract class AlgorithmiaTask<T> extends AsyncTask<T, Void, AlgoResponse> {
    private static final String TAG = "AlgorithmiaTask";

    private String algoUrl;
    private AlgorithmiaClient client;
    private Algorithm algo;

    public AlgorithmiaTask(String api_key, String algoUrl) {
        super();

        this.algoUrl = algoUrl;
        this.client = Algorithmia.client(api_key);
        this.algo = client.algo(algoUrl);
    }

    @Override
    protected AlgoResponse doInBackground(T... inputs) {
        if(inputs.length == 1) {
            T input = inputs[0];
            // Call algorithmia
            try {
                AlgoResponse response = algo.pipe(input);
                return response;
            } catch(APIException e) {
                // Connection error
                Log.e(TAG, "Algorithmia API Exception", e);
                return null;
            }
        } else {
            // Too many inputs
            return null;
        }
    }
}
{% endhighlight %}

### Create a Data Collection

This section will show how to create a data collection which is essentially a folder of data files hosted on Algorithmia for free.

Import the DataDirectory object to work with data collections:

{% highlight java %}
import com.algorithmia.data.DataDirectory;
{% endhighlight %}

Now create a data collection called nlp_directory:

{% highlight java %}
// Instantiate a DataDirectory object, set your data URI and call create
DataDirectory nlp_directory = Client.dir("data://YOUR_USERNAME/nlp_directory");
// Create your data collection if it does not exist
if (nlp_directory.exists() == false) {
    nlp_directory.create();
    System.out.println("Successfully created nlp_directory");
}

{% endhighlight %}

A Data URI uniquely identifies files and directories and contains a protocol "data://" and path "YOUR_USERNAME/data_collection". For more information on the Data URI see the [Data API Specification](http://docs.algorithmia.com/#data-api-specification).

Instead of your username you can also use '.my' when calling algorithms. For more information about the '.my' pseudonym check out the [Hosted Data Guide]({{ site.baseurl }}/data/hosted/).
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
    System.out.println("acl is the default permissions type My_ALGOS");
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

For more information on collection-based Access Control Lists (ACLs) and other data collection permissions go to the [Hosted Data Guide]({{ site.baseurl }}/data/hosted/).

### Upload Data to your Data Collection

So far you've created your data collection and checked and updated directory permissions. Now you're ready to upload the text file that you created at the beginning of the guide to your data collection using the Data API.

**Note:** If you want to follow along and don't wish to upload the file programatically you can upload <a href="{{ site.baseurl }}/data_assets/burning_daylight.txt">Chapter One Burning Daylight, by Jack London</a> file to your data collection by navigating to your [Hosted Data](https://algorithmia.com/data/hosted) and dragging and dropping the file into `nlp_directory`.

First create a variable that holds the path to your data collection and the text file you will be uploading:

{% highlight java %}
String local_file = "local_path_to_your_file/jack_london.txt";
{% endhighlight %}

Next upload your local file to the data collection using the `.putFile()` method:

{% highlight java %}
import com.algorithmia.data.DataFile;
// Upload local file - for example this path and file could be from a sdcard.
nlp_directory.putFile(new File(local_file));
{% endhighlight %}

This endpoint will replace a file if it already exists. If you wish to avoid replacing a file, check if the file exists before using this endpoint.
{: .notice-warning}

You can confirm that the file was created by navigating to Algorithmia's [Hosted Data Source](https://algorithmia.com/data/hosted) and finding your data collection and file.

### Downloading Data from a Data Collection

Next check if the file that you just uploaded to data collections exists, and try downloading it to a (new) local file:

{% highlight java %}
// Download the file
String text_file = "data://YOUR_USERNAME/nlp_directory/jack_london.txt";
try {
	if (Client.file(text_file).exists() == true) {
	    File localfile = Client.file(text_file).getFile();
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
	if (Client.file(text_file).exists() == true) {
	    String input = Client.file(text_file).getString();
	} else {
	    System.out.println("Please check that your file exists");
	}
} catch (IOException e) {
    e.printStackTrace();
}
{% endhighlight %}

This will get your file as a string, saving it to the variable `input`.  If the file was binary (an image, etc), you could instead use the function `.getBytes()` to retrieve the file's content as a byte array. For more image-manipulation tutorials, see the [Computer Vision Recipes]({{ site.baseurl }}/tutorials/recipes/#computer-vision).

Now you've seen how to upload a local data file, check if a file exists in a data collection, and download the file contents.

For more methods on how to get a file using the Data API from a data collection go to the [API Specification](http://docs.algorithmia.com/#getting-a-file).

## Call an Algorithm

Finally we are ready to call an algorithm. In this guide we'll use the natural language processing algorithm called [Summarizer](https://algorithmia.com/algorithms/nlp/Summarizer). This algorithm results in a string that is the summary of the text content you pass in as the algorithm's input.

A single algorithm may have different input and output types, or accept multiple types of input, so consult the algorithm’s description for usage examples specific to that algorithm.
{: .notice-info}

This example shows the summary of the text file which we downloaded from our data collection and set as the variable called `input` in the previous code sample.

Create the algorithm object and pass in the variable `input` into `algo.pipe()`:

{% highlight java %}
// Create the algorithm object using the Summarizer algorithm
Algorithm algo = client.algo("nlp/Summarizer/0.1.3")
// Pass in input required by algorithm adding to the code snippet in the last step
try {
    if (Client.file(text_file).exists() == true) {
        String input = Client.file(text_file).getString();
        // Add the below code to call the algorithm in this step
        String result = Client.algo("nlp/Summarizer/0.1.3").pipe(input).asString();
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

If you are interested in learning more about working with unstructured text data check out our guide [Introduction to Natural Language Processing](https://blog.algorithmia.com/introduction-natural-language-processing-nlp/).

### Limits

Your account can make up to 80 Algorithmia requests at the same time (this limit <a onclick="Intercom('show')">can be raised</a> if needed).

## Conclusion

This guide covered installing Algorithmia via a Gradle dependencies file, uploading and downloading data to and from a user created data collection, checking if a file exists using the Data API, calling an algorithm, and handling errors.

For more information on the methods available using the Data API in Java check out the [Data API](http://docs.algorithmia.com/?java#data-api-specification) documentation. For all available methods and versions go to the [Algorithmia Android Client API Docs](https://www.javadoc.io/doc/com.algorithmia/algorithmia-android) or view the [Android Client Source Code](https://github.com/algorithmiaio/algorithmia-android).

{% highlight java %}
import java.io.IOException;

import com.algorithmia
import com.algorithmia.APIException;
import com.algorithmia.AlgorithmException;
import com.algorithmia.data.DataDirectory;
import com.algorithmia.AlgorithmiaClient;
import com.algorithmia.data.DataFile;
import com.algorithmia.data.DataAcl;
import com.algorithmia.data.DataAclType;



AlgorithmiaClient Client = Algorithmia.client("YOUR_API_KEY");

// Instantiate a DataDirectory object, set your data URI and call create
DataDirectory nlp_directory = Client.dir("data://YOUR_USERNAME/nlp_directory");
// Create your data collection if it does not exist
if (nlp_directory.exists() == false) {
    nlp_directory.create();
    System.out.println("Successfully created nlp_directory");
}

// Create the acl object and check if it's the .MY_ALGOS default setting
DataAcl acl = nlp_directory.getPermissions();

if (acl.getReadPermissions() == DataAclType.MY_ALGOS) {
    System.out.println("acl is the default permissions type My_ALGOS");
}

// Update permissions to private
try {
    nlp_directory.updatePermissions(DataAcl.PRIVATE);
    if (acl.getReadPermissions() == DataAclType.MY_ALGOS) {
        System.out.println("Directory updated to PRIVATE");
    }
} catch (APIException e) {
    e.printStackTrace();
}

String local_file = "local_path_to_your_file/jack_london.txt";

// Upload local file - for example this path and file could be from sdcard, but remove if using the UI to upload your file.
nlp_directory.putFile(new File(local_file));

// Download contents of file as a string
String text_file = "data://YOUR_USERNAME/nlp_directory/jack_london.txt";

// Create the algorithm object using the Summarizer algorithm
Algorithm algo = client.algo("nlp/Summarizer/0.1.3")
// Pass in input required by algorithm
try {
    // Check if file exists
    if (Client.file(text_file).exists() == true) {
        String input = Client.file(text_file).getString();
        String result = Client.algo("nlp/Summarizer/0.1.3").pipe(input).asString();
    } else {
        System.out.println("Please check that your file exists");
    }
} catch (IOException e) {
    e.printStackTrace();
} catch (AlgorithmException e) {
    e.printStackTrace();
}
{% endhighlight %}
