---
layout: article
title:  "Ruby"
excerpt: "Build your algorithm in Ruby"
categories: languages
tags: [algo-guide-lang]
show_related: true
author: jon_peck
image:
    teaser: /language_logos/ruby.svg
---


Welcome to algorithm development in Ruby.

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

The full <a href="http://ruby-doc.org/core-2.2.0/" target="_blank">Ruby 2.2 language and standard library</a> is available for you to use in your algorithms.

Furthermore, algorithms can call other algorithms and manage data on the Algorithmia platform via the <a href="{{ site.baseurl }}/clients/ruby/">Algorithmia Ruby Client</a>.

## Create an Algorithm

Let's start by creating an algorithm. First navigate to [Algorithmia](https://algorithmia.com) and by hovering over "More" you'll see a dropdown with a purple button that says "Add Algorithm". Go ahead and click that button.

<img src="{{ site.baseurl }}/images/post_images/algo_dev_lang/add_algorithm_nav.png" alt="Add algorithm navigation" class="screenshot img-sm">

When you click the "Add Algorithm" button, you'll see a form for creating your algorithm that we'll fill out step by step below:

<img src="{{ site.baseurl }}/images/post_images/algo_dev_lang/create_algorithm_ruby.png" alt="Create an algorithm in Ruby" class="screenshot">

**Algorithmia Name:** The first thing you'll notice in the form is the field "Algorithm Name" which will be the name of your algorithm. You'll want to name your algorithm something descriptive based on what the algorithm does.

For example this guide shows how to create an algorithm that splits text up into words, which is called tokenizing in natural language processing. So, this example algorithm is called "Tokenize Text", but go ahead and name your algorithm according to what your code does.

**Algorithm ID:** The unique AlgoURL path users will use to call your algorithm.

**Language:** Next you'll pick the language of your choice. This is the Ruby guide so choose Ruby as the language.

**Source Code:** Because we want to make this algorithm open source and available for everyone to view the source code, we'll choose "Open Source".

As an incentive to promote community contributions, open source algorithms on the Algorithmia Platform will earn 1% of the usage cost (0.01cr/sec of execution time).

**Special Permissions:** Next is the "Special Permissions" section that allows your algorithm to have access to the internet and allows it to call other algorithms. In this example we'll want access to the internet and since our final algorithm will call another algorithm we want to select "Can call other algorithms" as well.

Also under Special Permissions, you can select "Standard execution environment" or "Advanced GPU". Since our algorithm isn't processing large amounts of data needed to run on a GPU environment, we'll select "Standard execution environment".

Find out more about licensing, algorithm permissions and GPU's in the [Algorithm Basics Section]({{ site.baseurl }}/basics/).
{: .notice-info}

Now hit the "Create" button on the bottom lower right of the form and you should see the algorithm console for your newly created algorithm:

<img src="{{ site.baseurl }}/images/post_images/algo_dev_lang/write_algorithm_ruby.png" alt="Algorithm console Ruby" class="screenshot">

## Managing Dependencies

The algorithm we are about to create does not have any dependencies other than `algorithmia` (which is added by default), but it is important to know how to do this - so for now we'll add `phony` just as an example.

Algorithmia supports adding 3rd party dependencies via <a href="https://rubygems.org/" target="_blank">Ruby Gems</a> using a Gemfile, but you don't need to create the Gemfile file manually.  Instead, on the algorithm editor page there is a button on the top right that says "Dependencies". Click that button and you'll see a modal window:

<img src="{{ site.baseurl }}/images/post_images/algo_dev_lang/dependencies_ruby.png" alt="Ruby Dependency File" class="screenshot img-md">

Add dependencies by adding the package name to the `Gemfile`.  For example, to make use of phony, you would include the line

`gem 'phony', '~>2.15.41'`

Now click "Save dependencies" to close the modal window.

**Note:** that you will still need to include an import statement to your algorithm file. For example, to include `phony`, add the following to your .rb file:

`require 'phony'`

## Write your First Algorithm

As you can see in your algorithm editor, there is a basic algorithm already written that takes a string as input and returns the string "Hello" followed by the user input.

The main thing to note about the algorithm is that it's wrapped in the apply() function.

The apply() function defines the input point of the algorithm. We use the apply() function in order to make different algorithms standardized. This makes them easily chained and helps authors think about designing their algorithms in a way that makes them easy to leverage and predictable for end users.

To run this algorithm first hit the "Compile" button on the top right hand corner of the algorithm editor and then at the bottom of the page in the console you'll see a confirmation that it has compiled and the version number of that commit.

If you are interested in learning more about versioning check out the [Algorithm Basics Section](/basics/).

Compiling your algorithm will also save your work, but note that the first time you compile your algorithm it might take some time while subsequent compiles will be quicker.
{: .notice-info}

To test the algorithm type your name or another string in the console and hit enter on your keyboard:

<img src="{{ site.baseurl }}/images/post_images/algo_dev_lang/compile_test_algo_ruby.png" alt="Run basic algorithm in console Ruby" class="screenshot">

## I/O for your Algorithms

Now that you've compiled and ran a basic algorithm in the console, we'll briefly go through some of the inputs and outputs you would expect to work with when creating an algorithm.

The first algorithm that we'll create will take a JSON formatted object, which has been passed as input by the user.  However, you don't need to worry about deserializing the JSON; it is done automatically before the call to `apply()`.

Your algorithm will output a JSON formatted object, which the user will consume via an API call to the algorithm path found at the bottom of the algorithm description page.  This path is based on your Algorithmia user name and the name of your algorithm, so if you are "demo" and your algorithm is "TokenizeText", then the path for version 0.1.1 of your algorithm will be `demo/TokenizeText/0.1.1`

### Working with Basic Data Structures

If the input to your algorithm is a bare string (e.g. `"world"`), then `input.instance_of? String` will be true.  However, we do not recommend accepting bare strings (JSON-encoded Objects are preferable), so we'll return an error message in that case.

Following this, you can distinguish between simple Arrays vs Objects by using `input.instance_of?(Array)`.  Here's an example that will accept either an Array, or an Object with the property "values" (which is an Array):

{% highlight ruby %}
require 'algorithmia'

def apply(input)
    if input.instance_of?(String)
        raise TypeError, 'Please provide a JSON-formatted Array or Object'
    elsif input.instance_of?(Array)
        return {
            "datatype": "Array",
            "sum": input.reduce(:+)
        }
    elsif input["values"]
        return {
            "datatype": "Object",
            "sum": input['values'].reduce(:+)
        }
    else
        raise TypeError, 'Please provide an Array of "values"'
    end
end
{% endhighlight %}

Go ahead and type or paste the code sample above in the Algorithmia code editor after removing the “Hello World” code.

Now compile the new code sample and when that’s done test the code in the console by passing in the input and hitting enter on your keyboard:

{% highlight python %}
{"values":[8,6,7,5,3,0,9]}
{% endhighlight %}

This should return:

{% highlight python %}
{"datatype":"object","sum":38}
{% endhighlight %}

Note that this returns well-formatted JSON which will be easy for the user to consume.

You'll get a similar result by passing in just `[8,6,7,5,3,0,9]`, but giving it a bare string or an Object without a "value" property will return an error message.

When you are creating an algorithm be mindful of the data types you require from the user and the output you return to them. Our advice is to create algorithms that allow for a few different input types such as a file, a sequence or a URL.
{: .notice-info}

## Working with Data Stored on Algorithmia

This next code snippet shows how to create an algorithm working with a data file that a user has stored using Algorithmia's [Hosted Data Source]({{ site.baseurl }}/data/hosted).

While users who consume an algorithm have access to both Dropbox and Amazon S3 connectors, algorithm developers can only use the Algorithmia [Hosted Data Source]({{ site.baseurl }}/data/hosted) to host data for algorithm development.
{: .notice-warning}

#### Prerequisites
If you wish to follow along working through the example yourself, create a text file that contains any unstructured text such as a chapter from a public domain book or article. We used a chapter from [Burning Daylight, by Jack London](https://en.wikisource.org/wiki/Burning_Daylight) which you can copy and paste into a text file. Or copy and paste it from here: <a href="{{ site.baseurl }}/data_assets/burning_daylight.txt">Chapter One Burning Daylight, by Jack London</a>. Then you will can upload it into one of your [Data Collections](https://algorithmia.com/data/hosted) (create a collection, drop the file into the "Drop files here" area which appears at the bottom of the page).

This example shows how to create an algorithm that takes a user's file stored in a data collection on the Algorithmia platform and splits up the text into sentences and words.  This implementation simply splits the text on any dot, then on whitespace `\s` characters, and then filters out any empty strings.  Once done, it passes back an Object containing the properties "text" (the raw text extracted from the file), and "words" (an Array of Arrays representing sentences and words) into the callback function:

{% highlight ruby %}
require 'algorithmia'

def apply(input)
    client = Algorithmia.client()
    if !input.instance_of?(String) and !input.instance_of?(Array) and input["user_file"]
        text = client.file(input["user_file"]).get
        return {
            "text": text,
            "words": text.split(".").map {
                |s| s.gsub(/\s+/m, ' ').strip.split(' ')
            }
        }
    else
        raise TypeError, 'Please provide a value for "user_file"'
    end
end
{% endhighlight %}

After you paste the above code into the Algorithmia code editor you can compile and then test the example by passing in a file that you've hosted in [Data Collections](https://algorithmia.com/data/hosted).

Following the example below, replace the path to your data collection with your user name (it will appear already if you are logged in), data collection name, and data file name which you can find under "My Collections" in [Data Collections](https://algorithmia.com/data/hosted):

{% highlight python %}
{"user_file": "data://YOUR_USERNAME/data_collection_dir/data_file.txt"}
{% endhighlight %}

You should get back an structure like this, but longer:

{% highlight python %}
{
    "text":"It was a quiet night in the Shovel...",
    "words":[["It","was","a","quiet","night","in","the","Shovel"],["At","the"...]]
}
{% endhighlight %}

### Calling Other Algorithms and Managing Data

To call other algorithms or manage data from your algorithm, use the <a href="{{ site.baseurl }}/clients/ruby/">Algorithmia Ruby Client</a> which is automatically available to any algorithm you create on the Algorithmia platform. For more detailed information on how to work with data see the [Data API docs](http://docs.algorithmia.com/) and learn about Algorithmia's [Hosted Data Source]({{ site.baseurl }}/data/).

When designing your algorithm, don't forget that there are special data directories, `.session` and `.algo`, that are available only to algorithms to help you manage data over the course of the algorithm execution.

## Error Handling

In order to provide the user with useful feedback, raise an Error with a meaningful message, so that users can receive this as an error object in the response:

{% highlight ruby %}
	begin
		x = Integer(input)
	rescue
		raise TypeError, 'Please provide a JSON-formatted Array or Object'
	end
{% endhighlight %}

## Algorithm Checklist

Before you are ready to publish your algorithm it's important to go through this [Algorithm Checklist]({{ site.baseurl }}/algorithm-development/algorithm-checklist/).

It will go over important best practices such as how to create a good algorithm description, add links to external documentation and other important information.

## Publish Algorithm

Once you've developed your algorithm, you can publish it and make it available for others to use.

On the upper right hand side of the algorithm page you'll see a purple button "Publish" which will bring up a modal:

<img src="{{ site.baseurl }}/images/post_images/algo_dev_lang/publish_algorithm.png" alt="Publish an algorithm" class="screenshot img-sm">

In this dialog, you can select whether your algorithm will be for public use or private use as well as the royalty. The algorithm can either be royalty-free or charge per-call. If you opt to have the algorithm charge a royalty, as the author, you will earn 70% of the royalty cost.

Check out [Algorithm Pricing]({{ site.baseurl }}/pricing-permissions/) for more information on how much algorithms will cost to run.

If you are satisfied with your algorithm and settings, go ahead and hit publish. Congratulations, you’re an algorithm developer!

### Editing an Algorithm

Your published algorithm can be edited from the browser, where you can edit the source code, save your work, compile, and submit the algorithm to be available through the API. You can also use [Git to push directly to Algorithmia]({{ site.baseurl }}/algorithm-development/git/) from your current workflow.

## Conclusion and Resources

In this guide we covered how to create an algorithm, work with different types of data and learned how to publish an algorithm.

For more resources:

* <a href="{{ site.baseurl }}/clients/ruby/">Algorithmia Client Ruby Docs</a>
* [Hosted Data Source]({{ site.baseurl }}/data/)
* [Algorithmia API Docs](http://docs.algorithmia.com/?ruby)
* <a href="http://ruby-doc.org/core-2.2.0/">Ruby 2.2 Docs</a>
