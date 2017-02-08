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
* [Create an Algorithm](#create-algorithm)
* [Managing Dependencies](#managing-dependencies)
* [Write your First Algorithm](#write-your-first-algorithm)
* [I/O for your Algorithms](#io-algorithms)
* [Error Handling](#error-handling)
* [Algorithm Checklist](#algorithm-checklist)
* [Publish Algorithm](#publish-algorithm)
* [Conclusion and Resources](#conclusion-resources)

## [Available Libraries](#available-libraries)

Algorithmia makes a number of libraries available to make algorithm development easier.

The full <a href="https://nodejs.org/api/">Javascript Node language and standard library</a>
is available for you to use in your algorithms.

Furthermore, algorithms can call other algorithms and manage data on the Algorithmia platform
via the <a href="{{ site.baseurl }}/application-development/client-guides/javascript/">Algorithmia Javascript Client</a>.

## <a id="create-algorithm">Create an Algorithm</a>

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

## <a id="managing-dependencies">Managing Dependencies</a>

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

## <a id="write-your-first-algorithm">Write your First Algorithm</a>

As you can see in your algorithm editor, there is a basic algorithm already written that takes a string as input and returns the string "Hello" followed by the user input.

To run this algorithm first hit the "Compile" button on the top right hand corner of the algorithm editor and then at the bottom of the page in the console you'll see a confirmation that it has compiled and the version number of that commit.

If you are interested in learning more about versioning check out the [Algorithm Basics Section](/basics/).

Compiling your algorithm will also save your work, but note that the first time you compile your algorithm it might take some time while subsequent compiles will be quicker.
{: .notice-info}

To test the algorithm type your name or another string in the console and hit enter on your keyboard:

<img src="{{ site.baseurl }}/images/post_images/algo_dev_lang/compile_test_algo_javascript.png" alt="Run basic algorithm in console JavaScript" class="screenshot">

## <a id="io-algorithms">I/O for your Algorithms</a>

Datatypes that are either sequences that you don't wish to iterate over such as strings, or inputs that are scalar in nature such as numeric data types can be accessed via input, however you will probably want to check for the data type you are expecting to receive.

{% highlight javascript %}
exports.apply = function(input, cb) {
	if (typeof input == String){
    	cb(null, input);
    }
};
{% endhighlight %}

A string input:

{% highlight javascript %}
input_string = "~3.14159"
{% endhighlight %}

Inputs that are sequences such as: arrays, objects and buffers (binary buffer sequence such as an image file) can be handled as you would any JavaScript sequence. For example:

{% highlight javascript %}
exports.apply = function(input, cb) {
	if (typeof input == Array){
	    cb(null, "A few of the most starred node.js packages: " + input[0] + ", " + input[1] + ", " + input[2]);
	}
};
{% endhighlight %}

Here is an example of an array input:

{% highlight javascript %}
input_array = ["express", "gulp", "async"]
{% endhighlight %}

Which will return:

`"A few of the most starred node.js packages: express, gulp, async"`

When you are creating an algorithm be mindful of the data types you require from the user and the output you return to them. Our advice is to create algorithms that allow a few options for input such as a file or a sequence.

### Calling Other Algorithms and Managing Data

To call other algorithms or manage data from your algorithm, use the <a href="{{ site.baseurl }}/client-guides/javascript/">Algorithmia Javascript Client</a> which is automatically available to any algorithm you create on the Algorithmia platform.  For more detailed information on how to work with data see the <a href="http://docs.algorithmia.com/?nodejs">Data API docs</a>.

When designing your algorithm, don't forget that there are special data directories, `.session` and `.algo`, that are available only to algorithms to help you manage data over the course of the algorithm execution.

## <a id="error-handling">Error Handling</a>

{% highlight javascript %}
try {
	x = parseInt(input)
} catch (error) {
	// Where cb is a callback function passed into your apply method
	throw cb(error, input)
}
{% endhighlight %}

## <a id="algorithm-checklist">Algorithm Checklist</a>

Before you are ready to publish your algorithm it's important to go through this [Algorithm Checklist]({{ site.baseurl }}/algorithm-development/algorithm-checklist/).

It will go over important best practices such as how to create a good algorithm description, add links to external documentation and other important information.

## <a id="publish-algorithm">Publish an Algorithm</a>

Once you've developed your algorithm, you can publish it and make it available for others to use.

On the upper right hand side of the algorithm page you'll see a purple button "Publish" which will bring up a modal:

<img src="{{ site.baseurl }}/images/post_images/algo_dev_lang/publish_algorithm.png" alt="Publish an algorithm" class="screenshot">

In this dialog, you can select whether your algorithm will be for public use or private use as well as the royalty. The algorithm can either be royalty-free or charge per-call. If you opt to have the algorithm charge a royalty, as the author, you will earn 70% of the royalty cost.

Check out [Algorithm Pricing]({{ site.baseurl }}/pricing-permissions/) for more information on how much algorithms will cost to run.

If you are satisfied with your algorithm and settings, go ahead and hit publish. Congratulations, you’re an algorithm developer!

### Editing an Algorithm

Your published algorithm can be edited from the browser, where you can edit the source code, save your work, compile, and submit the algorithm to be available through the API. You can also use [Git to push directly to Algorithmia]({{ site.baseurl }}/algorithm-development/git/) from your current workflow.

## <a id="conclusion-resources">Conclusion and Resources</a>

In this guide we covered how to create an algorithm, work with different types of data and learned how to publish an algorithm.

For more resources:

* <a href="{{ site.baseurl }}/clients/javascript/">Algorithmia Client Javascript Docs</a>
* [Hosted Data Source](/developers/data/)
* [Algorithmia API Docs](http://docs.algorithmia.com/?nodejs)
* <a href="https://nodejs.org/dist/latest-v6.x/docs/api/" target="_blank">Node.js 6.5 Docs <i class="fa fa-external-link"></i></a>

