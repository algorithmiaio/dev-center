---
layout: article
title: "Swift"
excerpt: "Add machine learning to your iOS / Swift app with Algorithmia"
categories: clients
tags: [clients]
show_related: true
image:
    teaser: /language_logos/swift.svg
repository: https://github.com/algorithmiaio/algorithmia-swift
redirect_from:
  - /application-development/client-guides/swift/
  - /lang/swift/
---

This guide provides a walk-through of how to use the official Algorithmia Swift Client to call algorithms and manage your data through the Algorithmia platform.

Here you will learn how to install the Algorithmia Swift Client, work with the Data API by uploading and downloading files, create and update directories and permission types and last, you'll learn how to call an algorithm that summarizes text files.

To follow along you can create a new Swift script or if you'd rather, you can follow the examples in the Swift REPL.


## Getting Started with Algorithmia

The official Algorithmia Swift Client is published via CocoaPods and additional reference documentation can be found in the [Algorithmia Client CocoaDocs](http://cocoadocs.org/docsets/algorithmia).

You can install via CocoaPods by adding it to your Podfile:

{% highlight bash %}
use_frameworks!

source 'https://github.com/CocoaPods/Specs.git'
platform :ios, '10.0'

pod 'algorithmia'
{% endhighlight %}

And then run `pod install`

## Authentication

Next, login to [Algorithmia](/) to get your [API key](/user#credentials):

Now import the Algorithmia library and create the Algorithmia client:

{% highlight swift %}
import algorithmia

# Create the Algorithmia client object
let client = Algorithmia.client(simpleKey: "YOUR_API_KEY")
{% endhighlight %}

Now you’re ready to start working with Algorithmia in Swift.

## Working with Data Using the Data API

For application developers, [Algorithmia's Data Portal](/data) offers three different ways to store your data, all available via the [Data API](http://docs.algorithmia.com/#data-api-specification).

This guide will show you how to work with the [Hosted Data]({{site.baseurl}}/data/hosted) option on the Algorithmia platform which is available to both algorithm and application developers.

### Prerequisites
If you wish to follow along working through the example yourself, create a text file that contains any unstructured text such as a chapter from a public domain book or article. We used a chapter from [Burning Daylight, by Jack London](https://en.wikisource.org/wiki/Burning_Daylight) which you can copy and paste into a text file. Or copy and paste it from here: <a href="{{site.baseurl}}/data_assets/burning_daylight.txt">Chapter One Burning Daylight, by Jack London</a>. This will be used throughout the guide.

### Create a Data Collection

This section will show how to create a data collection which is essentially a folder of data files hosted on Algorithmia for free.

First create a data collection called nlp_directory, note that `YOUR_USERNAME` will automatically fill in your Algorithmia username for you:

{% highlight swift %}
// Instantiate a DataDirectory object, set your data URI and call create
let nlp_directory = client.dir("data://YOUR_USERNAME/nlp_directory");

nlp_directory.exists() { exists, error in
    if (error == nil){
        if (exists == false) {
            nlp_directory.create(readACL:.MY_ALGORITHMS) { _, error in
                if (error == nil) {
                	print("Folder created")
            	} else {
            		print(error)
            	}
            }
        }
    }
}
{% endhighlight %}

A Data URI uniquely identifies files and directories and contains a protocol "data://" and path "YOUR_USERNAME/data_collection". For more information on the Data URI see the [Data API Specification](http://docs.algorithmia.com/#data-api-specification).

Instead of your username you can also use '.my' when calling algorithms. For more information about the '.my' pseudonym check out the [Hosted Data Guide]({{site.baseurl}}/data/hosted).
{: .notice-info}

### Work with Directory Permissions

When we created the data collection in the previous code snippet, the default setting is `ReadAcl:.MY_ALGORITHMS` which is a permission type that allows other users on the platform to interact with your data through the algorithms you create if you decide to contribute to algorithm development. This means users can call your algorithm to perform an operation on your data stored in this collection, otherwise the algorithm you created would only work for you.

#### Update Permissions to Private

{% highlight swift %}
// Update a directory to be private
nlp_directory.update(readACL:.PRIVATE) { _, error in
    print(error)
}
{% endhighlight %}

Notice that we changed our data collection to private, which means that only you will be able to read and write to your data collection.

Note that read access that is set to the default `DataMyAlgorithms` allows any algorithm you call to have access to your data collection so most often, this is the setting you want when you are calling an algorithm and are an application developer.

For more information on collection-based Access Control Lists (ACLs) and other data collection permissions such as `readACL:.PUBLIC` go to the [Hosted Data Guide]({{site.baseurl}}/data/hosted).

### Upload Data to your Data Collection

So far you've created your data collection and checked and updated directory permissions. Now you're ready to upload the text file that you created at the beginning of the guide to your data collection using the Data API.

First create a variable that holds the path to your data collection and the text file you will be uploading:

{% highlight swift %}
let text_file = "data://YOUR_USERNAME/nlp_directory/jack_london.txt"
{% endhighlight %}

Next upload your local file to the data collection using the `.putFile()` method:

{% highlight swift %}
nlp_directory.file(name: text_file).exists() { exists, error in
    if (error == nil) {
        // Check if file exists
        let local_file = URL(string: "/your_local_path_to_file/jack_london.txt")
        if (exists == false) {
            nlp_directory.put(file: local_file!) { _, error in
                if (error == nil){
                    print("File Uploaded Succesfully")
                } else {
                    print(error)
                }
            }
        }
    }
}
{% endhighlight %}

This endpoint will replace a file if it already exists. If you wish to avoid replacing a file, check if the file exists before using this endpoint.
{: .notice-warning}

You can confirm that the file was created by navigating to Algorithmia's [Hosted Data Source](/data/hosted) and finding your data collection and file.

You can also upload your data through the UI on Algorithmia's [Hosted Data Source](/data/hosted). For instructions on how to do this go to the [Hosted Data Guide]({{site.baseurl}}/data/hosted).

### Downloading Data from a Data Collection

Now download the file by adding the else statement to the code we wrote above:

{% highlight swift %}
nlp_directory.file(name: text_file).exists() { exists, error in
    if (error == nil) {
        // Check if file exists
        let local_file = URL(string: "/your_local_path_to_file/jack_london.txt")
        if (exists == false) {
            nlp_directory.put(file: local_file!) { _, error in
                if (error == nil){
                    print("File Uploaded Succesfully")
                } else {
                    print(error)
                }
            }
        }
		// Add this to download contents of file
        else {
            // Download contents of file as a string
            nlp_directory.file(name: text_file).getString { text, error in
                if (error == nil) {
                    let input = text
                } else {
                    print(error)
                }
            }
        }
    }
}
{% endhighlight %}

This will get your file as a string, saving it to the variable `input`.  If we were dealing with binary data and wanted the raw bytes, we'd use `getData`; to get the actual file, `getFile`.

Now you've seen how to upload a local data file, check if a file exists in a data collection, and download the file contents.

For more methods on how to get a file using the Data API from a data collection go to the [API Specification](http://docs.algorithmia.com/#getting-a-file).

## Call an Algorithm

Finally we are ready to call an algorithm. In this guide we'll use the <a href="https://algorithmia.com/blog/introduction-natural-language-processing-nlp" target="_blank">natural language processing</a> algorithm called [Summarizer](https://algorithmia.com/algorithms/nlp/Summarizer). This algorithm results in a string that is the summary of the text content you pass in as the algorithm's input.

A single algorithm may have different input and output types, or accept multiple types of input, so consult the algorithm’s description for usage examples specific to that algorithm.
{: .notice-info}

This example shows the summary of the text file which we downloaded from our data collection and set as the variable called `input` in the previous code sample.

Create the algorithm object and pass in the variable `input` into `algo.pipe()` under code where we initialized our input variable:

{% highlight swift %}
nlp_directory.file(name: text_file).exists() { exists, error in
    if (error == nil) {
        // Check if file exists
        let local_file = URL(string: "/your_local_path_to_file/jack_london.txt")
        if (exists == false) {
            nlp_directory.put(file: local_file!) { _, error in
                if (error == nil){
                    print("File Uploaded Succesfully")
                } else {
                    print(error)
                }
            }
        }
		// Add this to download contents of file
        else {
            // Download contents of file as a string
            nlp_directory.file(name: text_file).getString { text, error in
                if (error == nil) {
                    let input = text
                    // Add the call to the Summarizer algorithm
                    let summarizer = client.algo(algoUri: "nlp/Summarizer/0.1.3")
                    summarizer.pipe(text: input) { resp, error in
                        if (error == nil) {
                            print(resp.getText())
                        } else {
                            print(error)
                        }
                    }
                } else {
                    print(error)
                }
            }
        }
    }
}
{% endhighlight %}

When you pass in strings as input to an algorithm it expects JSON syntax so it would be double quotes rather than single quotes.
{: .notice-info}

This guide used the the first chapter of [Jack London's Burning Daylight](https://en.wikisource.org/wiki/Burning_Daylight) and the Summarizer algorithm outputs:

"It was a quiet night in the Shovel. The miners were in from Moseyed Creek and the other diggings to the west, the summer washing had been good, and the men's pouches were heavy with dust and nuggets. MacDonald grinned and nodded, and opened his mouth to speak, when the front door swung wide and a man appeared in the light."

If you are interested in learning more about working with unstructured text data check out our guide [Introduction to Natural Language Processing](https://algorithmia.com/blog/introduction-natural-language-processing-nlp).

### Limits

Your account can make up to {{site.data.stats.platform.max_num_algo_requests}} Algorithmia requests at the same time (this limit <a onclick="Intercom('show')">can be raised</a> if needed).

## Conclusion

This guide covered installing the Algorithmia Swift Client, uploading and downloading data to and from a user created data collection, checking if a file exists using the Data API, calling an algorithm, and handling errors.

For more information on the methods available using the Data API using Swift check out the [Swift Client Language CocoaDocs](http://cocoadocs.org/docsets/algorithmia) and for examples of executing common tasks with Algorithmia go to the [Swift Client Docs](https://github.com/algorithmiaio/algorithmia-swift).

For convenience, here is the whole script available to run:

{% highlight swift %}
import algorithmia

# Create the Algorithmia client object
let client = Algorithmia.client(simpleKey: "YOUR_API_KEY")

// Instantiate a DataDirectory object, set your data URI and call create
let nlp_directory = client.dir("data://YOUR_USERNAME/nlp_directory");

nlp_directory.exists() { exists, error in
    if (error == nil){
        if (exists == false) {
            nlp_directory.create(readACL:.MY_ALGORITHMS) { _, error in
                if (error == nil) {
                	print("Folder created")
            	} else {
            		print(error)
            	}
            }
        }
    }
}

let text_file = "jack_london.txt"

nlp_directory.file(name: text_file).exists() { exists, error in
    if (error == nil) {
        // Check if file exists
        let local_file = URL(string: "/your_local_path_to_file/jack_london.txt")
        if (exists == false) {
            nlp_directory.put(file: local_file!) { _, error in
                if (error == nil){
                    print("File Uploaded Succesfully")
                } else {
                    print(error)
                }
            }
        }
		// Add this to download contents of file
        else {
            // Download contents of file as a string
            nlp_directory.file(name: text_file).getString { text, error in
                if (error == nil) {
                    let input = text
                    // Add the call to the Summarizer algorithm
                    let summarizer = client.algo(algoUri: "nlp/Summarizer/0.1.3")
                    summarizer.pipe(text: input) { resp, error in
                        if (error == nil) {
                            print(resp.getText())
                        } else {
                            print(error)
                        }
                    }
                } else {
                    print(error)
                }
            }
        }
    }
}
{% endhighlight %}
