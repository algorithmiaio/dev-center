---
layout: article
title:  "Java"
excerpt: "Build your algorithm in Java"
categories: languages
tags: [algo-guide-lang]
show_related: true
author: steph_kim
image:
    teaser: /language_logos/java.svg
---

Algorithmia supports algorithm development in Java.

This guide will take you through the steps to getting started in algorithm development and cover the basics of managing dependencies, working with various types of inputs and outputs, calling other algorithms and managing data.

By the end of the guide you will see how to develop a couple of simple algorithms and you'll be ready to start contributing to the algorithm marketplace.

Table of Contents

* [Available Libraries](#available-libraries)
* [Create an Algorithm](#create-an-algorithm)
* [Managing Dependencies](#managing-dependencies)
* [Write your First Algorithm](#write-your-first-algorithm)
* [I/O for your Algorithms](#io-for-your-algorithms)
* [Error Handling](#error-handling)
* [Algorithm Checklist](#algorithm-checklist)
* [Publish Algorithm](#publish-algorithm)
* [Conclusion and Resources](#conclusion-and-resources)

## [Available Libraries](#available-libraries)

Algorithmia makes a number of libraries available to make algorithm development easier.

The full <a href="http://docs.oracle.com/javase/8/docs/technotes/guides/language/index.html">Java 8 language and standard library</a>
is available for you to use in your algorithms.

Furthermore, algorithms can call other algorithms and manage data on the Algorithmia platform
via the <a href="{{ site.baseurl }}/clients/java/">Algorithmia Java Client</a>.

## Create an Algorithm

Let's start by creating an algorithm. First navigate to [Algorithmia](https://algorithmia.com) and by hovering over "More" you'll see a dropdown with a purple button that says "Add Algorithm". Go ahead and click that button.

<img src="{{ site.baseurl }}/images/post_images/algo_dev_lang/add_algorithm_nav.png" alt="Add algorithm navigation" class="screenshot">

When you click the "Add Algorithm" button, you'll see a form for creating your algorithm that we'll fill out step by step below:

<img src="{{ site.baseurl }}/images/post_images/algo_dev_lang/create_java_algo.png" alt="Create an algorithm in Java" class="screenshot img-sm">

**Algorithmia Name:** The first thing you'll notice in the form is the field "Algorithm Name" which will be the name of your algorithm. You'll want to name your algorithm something descriptive based on what the algorithm does.

For example this guide shows how to create an algorithm that splits text up into words which is called tokenizing in natural language processing. So, this example algorithm could be called "Tokenize Text", but go ahead and name your algorithm according to what your code does.

**Algorithm ID:** The unique AlgoURL path users will use to call your algorithm.

**Language:** Next you'll pick the language of your choice. This is the R guide so choose R as the language.

**Source Code:** Because we want to make this algorithm open source and available for everyone to view the source code, we'll choose "Open Source".

As an incentive to promote community contributions, open source algorithms on the Algorithmia Platform will earn 1% of the usage cost (0.01cr/sec of execution time).

**Special Permissions:** Next is the "Special Permissions" section that allows your algorithm to have access to the internet and allows it to call other algorithms. In this example we'll want access to the internet and since our final algorithm will call another algorithm we want to select "Can call other algorithms" as well.

Also under Special Permissions, you can select "Standard execution environment" or "Advanced GPU". Since our algorithm isn't processing large amounts of data needed to run on a GPU environment, we'll select "Standard execution environment".

You can find out more about algorithm permissions in the [Algorithm Permissions Section]({{ site.baseurl }}/basics/permissions/).  Also, consider whether your algorithm would benefit from using a Graphics Processing Unit to accelerate certain kinds of computation, such as image processing and deep learning. When "Advanced GPU" is selected, the algorithm will run on servers with GPU hardware, with specific drivers and frameworks to help algorithm developers take advantage of GPU computing. This includes nvidia drivers, CUDA support, and several of the most popular deep learning frameworks, including TensorFlow, Caffe, Theano, and Torch.
{: .notice-info}

Now hit the "Create" button on the bottom lower right of the form and you'll see this modal:

<img src="{{ site.baseurl }}/images/post_images/algo_dev_lang/create-algo-cli.png" alt="cli info modal" class="screenshot">

The above screenshot shows directions and links to documentation for continuing to create your algorithm via the [CLI]({{ site.baseurl }}/clients/cli/) and [Git]({{ site.baseurl }}/algorithm-development/git/). Or, you can close the modal and continue to create your algorithm in the UI.

If you choose to continue creating your algorithm in the UI, close the modal and you should see the algorithm console for your newly created algorithm:

<img src="{{ site.baseurl }}/images/post_images/algo_dev_lang/java_new_algorithm_console.png" alt="Algorithm console Java" class="screenshot">

## Managing Dependencies

Now that you have created your algorithm, you can add dependencies.

Algorithmia supports adding 3rd party dependencies via Maven packages. Specifically, any packages from
<a href="http://search.maven.org/">Maven Central</a> can be added to algorithms.

On the algorithm editor page there is a button on the top right that says "Dependencies". Click that button and you'll see a modal window:

<img src="{{ site.baseurl }}/images/post_images/algo_dev_lang/java_dependencies.png" alt="Java Dependency File" class="screenshot img-md">

If you have any dependencies you can add them by typing in the package name to the dependency file in the following form:

`<dependency org="{GroupID}" name="{ArtifactID}" rev="{Version}" conf="default" changing="true"/> `

For example, to make use of the Apache Commons Math version 3.4.1 library, you would include the line:

`<dependency org="org.apache.commons" name="commons-math3" rev="3.4.1" conf="default" changing="true"/>`

in the dependencies file and add the line

`import org.apache.commons.math3.*;`

in the main file.

The Algorithmia dependency is already installed for your convenience. For more information about Algorithmia's Maven package visit [Java Client Docs](https://www.javadoc.io/doc/com.algorithmia/algorithmia-client)
{: .notice-info}

This guide won't depend on any external dependencies so you can close the dependencies window.

## Write your First Algorithm

As you can see in your algorithm editor, there is a basic algorithm already written that takes a string as input and returns the string "Hello" followed by the user input.

The main thing to note about the algorithm is that it's wrapped in the apply() function.

The apply() function defines the input point of the algorithm. We use the apply() function in order to make different algorithms standardized. This makes them easily chained and helps authors think about designing their algorithms in a way that makes them easy to leverage and predictable for end users.

To run this algorithm first hit the "Compile" button on the top right hand corner of the algorithm editor and then at the bottom of the page in the console you'll see a confirmation that it has compiled and the version number of that commit.  Until you have Published your algorithm, the version number will be a hash such as `4be0e18fba270e4aaa7cff20555268903f69a11b` - only you will be able to call this version.  After you've Published an algorithm, it will be given a `major.minor.revision` number as described in the [Versioning Documentation]({{ site.baseurl }}/basics/versioning/).

Compiling your algorithm will also save your work, but note that the first time you compile your algorithm it might take some time while subsequent compiles will be quicker.
{: .notice-info}

To test the algorithm type your name or another string in the console and hit enter on your keyboard:

<img src="{{ site.baseurl }}/images/post_images/algo_dev_lang/compile_test_algo_java.png" alt="Compile algorithm" class="screenshot">

## I/O for your Algorithms

Now that you've compiled and ran a basic algorithm in the console, we'll briefly go through some of the inputs and outputs you would expect to work with when creating an algorithm.


The first algorithm that we'll create will take a JSON formatted object passed as input by the user which is deserialized into a Java object before the algorithm is called.


It will output a JSON formatted object which the user will consume with an API call to the algorithm path which is found at the bottom of the algorithm description page.

This path is based on your Algorithmia user name and the name of your algorithm, so if you are “demo” and your algorithm is “TokenizeText”, then the path for version 0.1.1 of your algorithm will be demo/TokenizeText/0.1.1

### Working with Basic Data Structures

This example shows how to get the value of the key "URL" from a Map object that the user passes in when calling the algorithm:

{% highlight java %}
package algorithmia.test_java;

import com.algorithmia.*;
import com.algorithmia.algo.*;
import com.algorithmia.data.*;
import com.google.gson.*;
import java.util.*;


public class test_java {
    // Note that you don't pass in your API key when creating an algorithm
    AlgorithmiaClient client = Algorithmia.client();
    // The input and output of apply() automatically turns into JSON
    public String apply(Map<String,String> dict) throws Exception{
        return dict.get("URL");
    }
}
{% endhighlight %}

Go ahead and type or paste the code sample above in the Algorithmia code editor after removing the "Hello World" code.

Now compile the new code sample and when that's done test the code in the console by passing in the input and hitting enter on your keyboard:

{% highlight bash %}
{"URL": "some/path/somefile.txt"}
{% endhighlight %}

You should see the value from the key returned in the console:

{% highlight bash %}
"some/path/somefile.txt"
{% endhighlight %}

### Working with Data Stored on Algorithmia

This next code snippet shows how to create an algorithm working with a data file that a user has stored using Algorithmia's [Hosted Data Source]({{ site.baseurl }}/data/hosted).

While users who consume an algorithm have access to both Dropbox and Amazon S3 connectors, algorithm developers can only use the Algorithmia [Hosted Data Source]({{ site.baseurl }}/data/hosted) to host data for algorithm development.
{: .notice-warning}

#### Prerequisites
If you wish to follow along working through the example yourself, create a text file that contains any unstructured text such as a chapter from a public domain book or article. We used a chapter from [Burning Daylight, by Jack London](https://en.wikisource.org/wiki/Burning_Daylight) which you can copy and paste into a text file. Or copy and paste it from here: <a href="{{ site.baseurl }}/data_assets/burning_daylight.txt">Chapter One Burning Daylight, by Jack London</a>. Then you will can upload it into one of your [Data Collections](https://algorithmia.com/data/hosted).

This example shows how to create an algorithm that takes a user's file which is stored in a data collection on the Algorithmia platform. It then splits up the text into sentences and then splits those sentences up into words:

{% highlight java %}
package algorithmia.test_java;

import com.algorithmia.*;
import com.algorithmia.algo.*;
import com.algorithmia.data.*;
import com.google.gson.*;
import java.util.*;

public HashMap apply(Map<String,String> dict) {
    // Take user input of URL and return text split up as words.
    // Note that you don't pass in your API key when creating an algorithm
    AlgorithmiaClient client = Algorithmia.client();
    String text_file = dict.get("URL");
    List<String> all_words = new ArrayList();
    String text = new String();
    try {
        if (client.file(text_file).exists() == true) {
            // Get the contents of the file as a string.
            text = client.file(text_file).getString();
            // Split the contents of the file by the sentences.
            String[] sentences = text.split("\\.");
            // Break down each sentence of the array.
            for( String sentence : sentences ) {
                String[] words = sentence.split("[ ]");
                all_words.add(Arrays.toString(words));
            }

        } else {
            System.out.println("Please check that your file exists");
        }
    } catch (IOException e) {
        e.printStackTrace();
    }
    HashMap<String, Object> map = new HashMap<>();
    map.put("words", all_words);
    map.put("text", text);
    System.out.println(map);
    return map;
}
{% endhighlight %}

After you paste the above code into the Algorithmia code editor you can compile and then test the example by passing in a file that you've hosted in [Data Collections](https://algorithmia.com/data/hosted).

Following the example below replace the path to your data collection with your user name (it will appear already if you are logged in), data collection name, and data file name which you can find under "My Collections" in [Data Collections](https://algorithmia.com/data/hosted):

{% highlight bash %}
{"user_file": "data://YOUR_USERNAME/data_collection_dir/data_file.txt"}
{% endhighlight %}

This guide uses a chapter from the public domain book [Burning Daylight, by Jack London](https://en.wikisource.org/wiki/Burning_Daylight), but for brevity we'll only show the first sentence in "text" and "words":

{% highlight bash %}
{"text": "It was a quiet night in the Shovel.", "words": [['It', 'was', 'a', 'quiet', 'night', 'in', 'the', 'Shovel']]}
{% endhighlight %}

When you are creating an algorithm be mindful of the data types you require from the user and the output you return to them. Our advice is to create algorithms that allow for a few different input types such as a file, a sequence or a URL.
{: .notice-info}

### Automatic JSON parsing

{% highlight java %}
package algorithmia.docs.Example;
import com.algorithmia.*;

public class Example {
    public String apply(Map<String,String> dict, String key) {
        return dict.get(key);
    }
}
{% endhighlight %}

By default, Algorithmia uses Google's <a href="https://github.com/google/gson">GSON</a> library for converting JSON to and from
native Java objects. You can specify the input and output types of your algorithm simply by setting the parameters and return type of
your `apply()` method.

This example shows a function that takes two parameters, a Map from Strings to Strings (dict) and another String (key), and returns another String.

Algorithmia can automatically parse many types of native Java objects to and from JSON: Integers, Lists, Arrays, Maps, and many others. In many cases it can also parse arbitrary user-defined Java Classes to and from JSON. See the <a href="https://sites.google.com/site/gson/gson-user-guide">Gson User Guide</a> for reference.

### Custom JSON parsing
If you want more control over parsing, then use a single apply method accepting a <code>String</code> and give it the <code>@AcceptsJson</code> annotation (from the <code>com.algorithmia.algo</code> package).

{% highlight java %}
package algorithmia.Example

import com.algorithmia.*;
import com.algorithmia.algo.*;
import com.algorithmia.data.*;

public class JavaTest {
    @AcceptsJson
    public String apply(String input) throws Exception {
        // Parse JSON here
    }
}
{% endhighlight %}

If you have more than 1 apply method, or your apply method does not take a <code>String</code> as an argument then you will receive an error message at runtime.  Also note that passing in a String <code>"foo"</code> becomes serialized to JSON like <code>"\"foo\""</code>.

On the other hand, if GSON doesn't serialize your output response to JSON correctly (or you want to do some custom serialization) you can add an <code>@ReturnsJson</code> to your apply method and return a serialized JSON String.

{% highlight java %}
package algorithmia.Example

import com.algorithmia.*;
import com.algorithmia.algo.*;
import com.algorithmia.data.*;

public class JavaTest {
    @ReturnsJson
    public String apply(String input) throws Exception {
        // Do some work
        // Return a JSON string
    }
}
{% endhighlight %}

If you use <code>@ReturnsJson</code> but don't return a valid JSON string, your algorithm will return a JSON parsing error.
{: .notice-info}

### Writing files for the user to consume

Sometimes it is more appropriate to write your output to a file than to return it directly to the caller.  In these cases, you may need to create a temporary file, then copy it to a [Data URI](http://docs.algorithmia.com/#data-api-specification) (usually one which the caller specified in their request, or a [Temporary Algorithm Collection](https://algorithmia.com/developers/data/hosted#temporary-algorithm-collections)):

{% highlight java %}
// {"target_file":"data://username/collection/filename.txt"}
String file_uri = dict.get("target_file");
File tempfile = new File("/tmp/"+UUID.randomUUID()+".tmp");
save_some_output_to(tempfile);
client.file(file_uri).putFile(tempfile);
{% endhighlight %}

### Calling Other Algorithms and Managing Data

To call other algorithms or manage data from your algorithm, use the <a href="{{ site.baseurl }}/clients/java/">Algorithmia Java Client</a> which is automatically available to any algorithm you create on the Algorithmia platform. For more detailed information on how to work with data see the [Data API docs](http://docs.algorithmia.com/) and learn about Algorithmia's [Hosted Data Source]({{ site.baseurl }}/data/).

Here is an example of creating an algorithm that relies on data from another algorithm:

You may call up to 24 other algorithms, either in parallel or recursively.

{% highlight java %}
package algorithmia.test_java;

import com.algorithmia.*;
import com.algorithmia.algo.*;
import com.algorithmia.data.*;
import com.google.gson.*;
import java.util.*;


public HashMap apply(Map<String,String> dict) {
    // Take user input of URL and return text split up as words.
    // Note that you don't pass in your API key when creating an algorithm
    AlgorithmiaClient client = Algorithmia.client();
    String input_url = dict.get("URL");
    String text = new String();
    List<String> all_words = new ArrayList();
    if (input_url.startsWith("http:") || input_url.startsWith("https:")) {
        try {
            Algorithm algo = client.algo("algo://util/Url2Text/0.1.4");
            AlgoResponse result = algo.pipe(input_url);
            text = result.asJsonString();
            // Split the contents of the file by the sentences.
            String[] sentences = text.split("\\.");
            // Break down each sentence of the array.
            for( String sentence : sentences ) {
                String[] words = sentence.split("[ ]");
                all_words.add(Arrays.toString(words));
            }

        } catch (APIException ex) {
            System.out.println("API Exception: " + ex.getMessage());
        }
        catch (AlgorithmException ex) {
            System.out.println("API Exception: " + ex.getMessage());
        }
    } else {
        System.out.println("Please pass in a valid URL");
    }
    HashMap<String, Object> map = new HashMap<>();
    map.put("result", all_words);
    System.out.println(map);
    return map;
}
{% endhighlight %}

Go ahead and try the above code sample in the Algorithmia code editor and then type the input into the console:
{% highlight bash %}
{"URL": "http://github.com"}
{% endhighlight %}

This returns a Map of an ArrayList of words:

<img src="{{ site.baseurl }}/images/post_images/algo_dev_lang/java_output_tokenize_url.png" alt="Run basic algorithm in console" class="screenshot">

As you can see from these examples, fields that are passed into your algorithm by the user such as scalar values and sequences such as lists, maps, arrays and bytearray (binary byte sequence such as an image file) can be handled as you would any Java data structure within your algorithm.

**Note:** Binary data is passed using <code>byte[]</code> and for more information check out the [API Docs](http://docs.algorithmia.com/?java#input-output).

For an example that takes and processes image data check out the [Places 365 Classifier's source code](https://algorithmia.com/algorithms/deeplearning/Places365Classifier).

Some older algorithms use our deprecated Java client. If it has an import from the <code>algorithmia</code> package instead of the <code>com.algorithmia</code> package, that means it is using the deprecated client.
{: .notice-warning}

## Error Handling

{% highlight java %}
throw new AlgorithmException("Invalid graph structure");
{% endhighlight %}

Algorithms can throw any exception, and they will be returned as an error via the Algorithmia API. If you want to throw a generic exception message, use an `AlgorithmException`.

For more details about handling errors in Java check out the full [Algorithmia Java Client API Docs](https://www.javadoc.io/doc/com.algorithmia/algorithmia-client) and the [Algorithmia API Docs](http://docs.algorithmia.com/?java#error-handling).

## Algorithm Checklist

Before you are ready to publish your algorithm it's important to go through this [Algorithm Checklist]({{ site.baseurl }}/algorithm-development/algorithm-checklist/).

It will go over important best practices such as how to create a good algorithm description, add links to external documentation and other important information.

## Publish Algorithm

Once you've developed your algorithm, you can publish it and make it available for others to use.

On the upper right hand side of the algorithm page you'll see a purple button "Publish" which will bring up a modal:

<img src="{{ site.baseurl }}/images/post_images/algo_dev_lang/publish_algorithm.png" alt="Publish an algorithm" class="screenshot img-sm">

In this dialog, you can select whether your algorithm will be for public use or private use as well as the royalty. The algorithm can either be royalty-free or charge per-call. 

If you opt to have the algorithm charge a royalty, as the author, you will earn 70% of the royalty cost.

Check out [Algorithm Pricing]({{ site.baseurl }}/pricing/) for more information on how much algorithms will cost to run.

If you are satisfied with your algorithm and settings, go ahead and hit publish. Congratulations, you’re an algorithm developer!

### Editing an Algorithm

Your published algorithm can be edited from the browser, where you can edit the source code, save your work, compile, and submit the algorithm to be available through the API. You can also use [Git to push directly to Algorithmia]({{ site.baseurl }}/algorithm-development/git/) from your current workflow.

## Conclusion and Resources

In this guide we covered how to create an algorithm, work with different types of data and learned how to publish an algorithm.

For more resources:

* [Algorithmia Java client documentation]({{ site.baseurl }}/clients/java/)
* [Algorithmia Java Client Docs](https://www.javadoc.io/doc/com.algorithmia/algorithmia-client)
* [Algorithmia API Docs](http://docs.algorithmia.com/?java#error-handling)
* [Java 8 JDK API](http://docs.oracle.com/javase/8/docs/api/)
