---
layout: article
title:  "JavaScript"
excerpt: "Build your algorithm in JavaScript"
categories: languages
tags: [algo-guide-lang]
show_related: true
author: steph_kim
image:
    teaser: /language_logos/js.svg
---

Welcome to algorithm development in JavaScript.

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

## Available Libraries

Algorithmia makes a number of libraries available to make algorithm development easier.

The full <a href="https://nodejs.org/dist/latest-v6.x/docs/api/">Javascript Node 6.9 language and standard library</a>
is available for you to use in your algorithms.

Furthermore, algorithms can call other algorithms and manage data on the Algorithmia platform
via the <a href="{{ site.baseurl }}/clients/node/">Algorithmia NodeJS Client</a>.

## Create an Algorithm

Let's start by creating an algorithm. First navigate to [Algorithmia](https://algorithmia.com) and by hovering over "More" you'll see a dropdown with a purple button that says "Add Algorithm". Go ahead and click that button.

<img src="{{ site.baseurl }}/images/post_images/algo_dev_lang/add_algorithm_nav.png" alt="Add algorithm navigation" class="screenshot">

When you click the "Add Algorithm" button, you'll see a form for creating your algorithm that we'll fill out step by step below:

<img src="{{ site.baseurl }}/images/post_images/algo_dev_lang/create_algorithm_javascript.png" alt="Create an algorithm in JavaScript" class="screenshot">

**Algorithmia Name:** The first thing you'll notice in the form is the field "Algorithm Name" which will be the name of your algorithm. You'll want to name your algorithm something descriptive based on what the algorithm does.

For example this guide shows how to create an algorithm that splits text up into words, which is called tokenizing in natural language processing. So, this example algorithm is called "Tokenize Text", but go ahead and name your algorithm according to what your code does.

**Algorithm ID:** The unique AlgoURL path users will use to call your algorithm.

**Language:** Next you'll pick the language of your choice. This is the JavaScript guide so choose JavaScript as the language.

**Source Code:** Because we want to make this algorithm open source and available for everyone to view the source code, we'll choose "Open Source".

**Special Permissions:** Next is the "Special Permissions" section that allows your algorithm to have access to the internet and allows it to call other algorithms. In this example we'll want access to the internet and since our final algorithm will call another algorithm we want to select "Can call other algorithms" as well.

Also under Special Permissions, you can select "Standard execution environment" or "Advanced GPU". Since our algorithm isn't processing large amounts of data needed to run on a GPU environment, we'll select "Standard execution environment".

Find out more about licensing, algorithm permissions and GPU's in the [Algorithm Basics Section]({{ site.baseurl }}/basics/).
{: .notice-info}

Now hit the "Create" button on the bottom lower right of the form and you should see the algorithm console for your newly created algorithm:

<img src="{{ site.baseurl }}/images/post_images/algo_dev_lang/write_algorithm_javascript.png" alt="Algorithm console JavaScript" class="screenshot">

## Managing Dependencies

Now that you have created your algorithm, you can add dependencies.

Algorithmia supports adding 3rd party dependencies via the <a href="https://www.npmjs.com/" target="_blank">NPM Javascript package manager <i class="fa fa-external-link"></i></a>.

You don't need to create the package.json file manually.  instead, on the algorithm editor page there is a button on the top right that says "Dependencies". Click that button and you'll see a modal window:

<img src="{{ site.baseurl }}/images/post_images/algo_dev_lang/dependencies_javascript.png" alt="JavaSCript Dependency File" class="screenshot">

Add dependencies by including the package name and version inside the `dependencies` section.  For example, to add `lodash` version 4.17.4, edit that section as follows:


```
"dependencies": {
	"algorithmia": "0.3.x",
 	"lodash": "4.17.4"
 }
 ```

Now click "Save dependencies" to close the modal window.

**Note:** that you will still need to import your package to your algorithm file. For example, to include your package 'lodash' add the following to your .js file:

`lodash = require("lodash")();`

## Write your First Algorithm

As you can see in your algorithm editor, there is a basic algorithm already written that takes a string as input and returns the string "Hello" followed by the user input.

To run this algorithm first hit the "Compile" button on the top right hand corner of the algorithm editor and then at the bottom of the page in the console you'll see a confirmation that it has compiled and the version number of that commit.

If you are interested in learning more about versioning check out the [Algorithm Basics Section](/basics/).

Compiling your algorithm will also save your work, but note that the first time you compile your algorithm it might take some time while subsequent compiles will be quicker.
{: .notice-info}

To test the algorithm type your name or another string in the console and hit enter on your keyboard:

<img src="{{ site.baseurl }}/images/post_images/algo_dev_lang/compile_test_algo_javascript.png" alt="Run basic algorithm in console JavaScript" class="screenshot">

## I/O for your Algorithms

Now that you've compiled and ran a basic algorithm in the console, we'll briefly go through some of the inputs and outputs you would expect to work with when creating an algorithm.

The first algorithm that we'll create will take a JSON formatted object, which has been passed as input by the user.  However, you don't need to worry about deserializing the JSON; it done automatically before the call to `apply()`.

Your algorithm will output a JSON formatted object, returned via the callback function `cb`, which the user will consume via an API call to the algorithm path found at the bottom of the algorithm description page.  This path is based on your Algorithmia user name and the name of your algorithm, so if you are "demo" and your algorithm is "TokenizeText", then the path for version 0.1.1 of your algorithm will be `demo/TokenizeText/0.1.1`

### Working with Basic Data Structures

If the input to your algorithm is a single string (e.g. `"world"`), then `typeof input` will be 'string'.  Otherwise, you are dealing with an Array or other Object: an easy way to differentiate is to use `Array.isArray`:

{% highlight javascript %}
exports.apply = function(input, cb) {
  if (typeof input == 'string'){
    	cb(null, "It's a String!");
  } else if (Array.isArray(input)) {
    	cb(null, "It's an Array!");
  } else {
    	cb(null, "It's an Object!");
  }
};
{% endhighlight %}

Go ahead and type or paste the code sample above in the Algorithmia code editor after removing the “Hello World” code.

Now compile the new code sample and when that’s done test the code in the console by passing in the input and hitting enter on your keyboard:

{% highlight javascript %}
"foo"
{% endhighlight %}

This should return:

{% highlight javascript %}
"It's a String!"
{% endhighlight %}

Try this again with the inputs `["foo","bar"]` and `{"foo":"bar"}`, to get back `It's an Array!` and `It's an Object` respectively.

### Working with Data Stored on Algorithmia

This next code snippet shows how to create an algorithm working with a data file that a user has stored using Algorithmia's [Hosted Data Source]({{ site.baseurl }}/data/hosted).

While users who consume an algorithm have access to both Dropbox and Amazon S3 connectors, algorithm developers can only use the Algorithmia [Hosted Data Source]({{ site.baseurl }}/data/hosted) to host data for algorithm development.
{: .notice-warning}

#### Prerequisites
If you wish to follow along working through the example yourself, create a text file that contains any unstructured text such as a chapter from a public domain book or article. We used a chapter from [Burning Daylight, by Jack London](https://en.wikisource.org/wiki/Burning_Daylight) which you can copy and paste into a text file. Or copy and paste it from here: <a href="{{ site.baseurl }}/data_assets/burning_daylight.txt">Chapter One Burning Daylight, by Jack London</a>. Then you will can upload it into one of your [Data Collections](https://algorithmia.com/data/hosted) (create a collection, drop the file into the "Drop files here" area which appears at the bottom of the page).

This example shows how to create an algorithm that takes a user's file stored in a data collection on the Algorithmia platform and splits up the text into words.  This is a relatively naive implementation, and simply uses a regular expression to split on any dot or whitespace `\s` character, then filters out any empty strings.  Once done, it passes back the struct `{"words":words}` into the callback function, which returns it to the user via JSON:

{% highlight javascript %}
Algorithmia = require("algorithmia");

// Note that you don't pass in your API key when creating an algorithm
client = Algorithmia.client()

exports.apply = function(input, cb) {
    if (typeof input != "string" && input["user_file"]) {
        client.file(input["user_file"]).get(function(err, data) {
            if(err) {
                cb(null, err.message);
            } else {
                var words = data.split(/[\.\s]/);
                words = words.filter(function(word) {return word!="";});
                cb(null, {"words":words});
            }
        });
    } else {
        cb(null, "Please provide a value for 'user_file'");
    }
};
{% endhighlight %}

Paste the above code into the Algorithmia code editor, and compile.  Then test the example by entering giving it input such as:

{% highlight python %}
{"user_file": "data://YOUR_USERNAME/data_collection_dir/data_file.txt"}
{% endhighlight %}

...where `data://YOUR_USERNAME/data_collection_dir/data_file.txt` is the Data URI of your file.  This can be found in [Data Collections](https://algorithmia.com/data/hosted) by clicking on your collection, directly below the name of the file you're interested in.  Note that it is composed of the "data://" prefix, followed by your user name, the name of the data collection, and the data file name.

You should get back an structure like this, but longer:

{% highlight python %}
{"words": ['It', 'was', 'a', 'quiet', 'night', 'in', 'the', 'Shovel']}
{% endhighlight %}

When you are creating an algorithm be mindful of the data types you require from the user and the output you return to them. Our advice is to create algorithms that allow for a few different input types such as a file, a sequence or a URL.
{: .notice-info}

### Calling Other Algorithms and Managing Data

To call other algorithms or manage data from your algorithm, use the <a href="{{ site.baseurl }}/clients/node/">Algorithmia NodeJS Client</a> which is automatically available to any algorithm you create on the Algorithmia platform.  For more detailed information on how to work with data see the <a href="http://docs.algorithmia.com/?nodejs">Data API docs</a>.

When designing your algorithm, don't forget that there are special data directories, `.session` and `.algo`, that are available only to algorithms to help you manage data over the course of the algorithm execution.

## Error Handling

In order to provide the user with useful feedback, wrap error-prone actions in a try-catch block, and pass the error back as the *first* parameter to the callback function:

{% highlight javascript %}
try {
	x = parseInt(input)
} catch (error) {
	throw cb(error, input)
}
{% endhighlight %}

## Algorithm Checklist

Before you are ready to publish your algorithm it's important to go through this [Algorithm Checklist]({{ site.baseurl }}/algorithm-development/algorithm-checklist/).

It will go over important best practices such as how to create a good algorithm description, add links to external documentation and other important information.

## Publish Algorithm

Once you've developed your algorithm, you can publish it and make it available for others to use.

On the upper right hand side of the algorithm page you'll see a purple button "Publish" which will bring up a modal:

<img src="{{ site.baseurl }}/images/post_images/algo_dev_lang/publish_algorithm.png" alt="Publish an algorithm" class="screenshot">

In this dialog, you can select whether your algorithm will be for public use or private use as well as the royalty. The algorithm can either be royalty-free or charge per-call. If you opt to have the algorithm charge a royalty, as the author, you will earn 70% of the royalty cost.

Check out [Algorithm Pricing]({{ site.baseurl }}/pricing-permissions/) for more information on how much algorithms will cost to run.

If you are satisfied with your algorithm and settings, go ahead and hit publish. Congratulations, you’re an algorithm developer!

### Editing an Algorithm

Your published algorithm can be edited from the browser, where you can edit the source code, save your work, compile, and submit the algorithm to be available through the API. You can also use [Git to push directly to Algorithmia]({{ site.baseurl }}/algorithm-development/git/) from your current workflow.

## Conclusion and Resources

In this guide we covered how to create an algorithm, work with different types of data and learned how to publish an algorithm.

For more resources:

* <a href="{{ site.baseurl }}/clients/node/">Algorithmia Client NodeJS Docs</a>
* [Hosted Data Source](/developers/data/)
* [Algorithmia API Docs](http://docs.algorithmia.com/?nodejs)
* <a href="https://nodejs.org/dist/latest-v6.x/docs/api/" target="_blank">Node.js 6.5 Docs <i class="fa fa-external-link"></i></a>

