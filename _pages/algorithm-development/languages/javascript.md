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

## [Available Libraries](#available-libraries)

Algorithmia makes a number of libraries available to make algorithm development easier.

The full <a href="https://nodejs.org/api/">Javascript Node language and standard library</a>
is available for you to use in your algorithms.

Furthermore, algorithms can call other algorithms and manage data on the Algorithmia platform
via the <a href="{{ site.baseurl }}/client-guides/node/">Algorithmia NodeJS Client</a>.

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

Algorithmia supports adding 3rd party dependencies via the <a href="https://www.npmjs.com/">NPM Javascript package manager</a>.

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

#### I/O for Your Algorithms:

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

#### Error Handling

{% highlight javascript %}
try {
	x = parseInt(input)
} catch (error) {
	// Where cb is a callback function passed into your apply method
	throw cb(error, input)
}
{% endhighlight %}

#### Calling Other Algorithms and Managing Data

To call other algorithms or manage data from your algorithm, use the <a href="{{ site.baseurl }}/client-guides/javascript/">Algorithmia Javascript Client</a> which is automatically available to any algorithm you create on the Algorithmia platform.

When designing your algorithm, don't forget that there are special data directories, `.session` and `.algo`, that are available only to algorithms to help you manage data over the course of the algorithm execution.

#### Additional Resources

* <a href="{{ site.baseurl }}/client-guides/node/">Algorithmia NodeJS Client Docs <i class="fa fa-external-link"></i></a>
* <a href="https://nodejs.org/api/">Node.js 6.0 Docs</a>

