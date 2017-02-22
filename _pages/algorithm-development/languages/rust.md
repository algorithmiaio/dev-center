---
layout: article
title:  "Rust"
excerpt: "Build your algorithm in Rust"
categories: languages
tags: [algo-guide-lang]
show_related: true
author: jon_peck
image:
    teaser: /language_logos/rust.svg
---

Welcome to algorithm development in Rust.

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

The full <a href="https://www.rust-lang.org/" target="_blank">Rust 1.15 language and standard library</a> is available for you to use in your algorithms.

Furthermore, algorithms can call other algorithms and manage data on the Algorithmia platform via the <a href="{{ site.baseurl }}/clients/rust/">Algorithmia Rust Client</a>.


## Create an Algorithm

Let's start by creating an algorithm. First navigate to [Algorithmia](https://algorithmia.com) and by hovering over "More" you'll see a dropdown with a purple button that says "Add Algorithm". Go ahead and click that button.

<img src="{{ site.baseurl }}/images/post_images/algo_dev_lang/add_algorithm_nav.png" alt="Add algorithm navigation" class="screenshot">

When you click the "Add Algorithm" button, you'll see a form for creating your algorithm that we'll fill out step by step below:

<img src="{{ site.baseurl }}/images/post_images/algo_dev_lang/create_algorithm_rust.png" alt="Create an algorithm in Rust" class="screenshot img-sm">

**Algorithmia Name:** The first thing you'll notice in the form is the field "Algorithm Name" which will be the name of your algorithm. You'll want to name your algorithm something descriptive based on what the algorithm does.

For example this guide shows how to create an algorithm that splits text up into words, which is called tokenizing in natural language processing. So, this example algorithm is called "Tokenize Text", but go ahead and name your algorithm according to what your code does.

**Algorithm ID:** The unique AlgoURL path users will use to call your algorithm.

**Language:** Next you'll pick the language of your choice. This is the Rust guide so choose Rust as the language.

**Source Code:** Because we want to make this algorithm open source and available for everyone to view the source code, we'll choose "Open Source".

As an incentive to promote community contributions, open source algorithms on the Algorithmia Platform will earn 1% of the usage cost (0.01cr/sec of execution time).

**Special Permissions:** Next is the "Special Permissions" section that allows your algorithm to have access to the internet and allows it to call other algorithms. In this example we'll want access to the internet and since our final algorithm will call another algorithm we want to select "Can call other algorithms" as well.

Also under Special Permissions, you can select "Standard execution environment" or "Advanced GPU". Since our algorithm isn't processing large amounts of data needed to run on a GPU environment, we'll select "Standard execution environment".

You can find out more about algorithm permissions in the [Algorithm Permissions Section]({{ site.baseurl }}/basics/permissions/).  Also, consider whether your algorithm would benefit from using a Graphics Processing Unit to accelerate certain kinds of computation, such as image processing and deep learning. When "Advanced GPU" is selected, the algorithm will run on servers with GPU hardware, with specific drivers and frameworks to help algorithm developers take advantage of GPU computing. This includes nvidia drivers, CUDA support, and several of the most popular deep learning frameworks, including TensorFlow, Caffe, Theano, and Torch.
{: .notice-info}

Now hit the "Create" button on the bottom lower right of the form and you should see the algorithm console for your newly created algorithm:

<img src="{{ site.baseurl }}/images/post_images/algo_dev_lang/write_algorithm_rust.png" alt="Algorithm console Rust" class="screenshot">

## Managing Dependencies

Algorithmia supports adding 3rd party dependencies via Cargo. Cargo dependencies typically come from <a href="https://crates.io/" target="_blank">Crates.io</a> (though it is also possible to specify dependencies from a git URL).  Do not try to manually create the `Cargo.toml` file.  Instead, on the algorithm editor page there is a button on the top right that says "Dependencies". Click that button and you'll see a modal window:

<img src="{{ site.baseurl }}/images/post_images/algo_dev_lang/dependencies_rust.png" alt="Rust Dependency File" class="screenshot img-md">

Add dependencies at the end of the file, under the `[dependencies]` section (for details on versioning and on git-based dependencies, see the <a href="http://doc.crates.io/specifying-dependencies.html" target="_blank">cargo documentation</a>).  Then click "Save dependencies" to close the modal window.

**Note:** Editing the `[bin]` and `[lib]` sections may break compilation, either immediately or during future platform maintenance. If you believe your scenario requires such changes, contact us as we'd love to learn more about your usage scenario to better support it.

## Write your First Algorithm

As you can see in your algorithm editor, there is a basic algorithm already written that takes a string as input and returns the string "Hello" followed by the user input.

The main thing to note about the algorithm is that it's wrapped in the apply() function.

The apply() function defines the input point of the algorithm. We use the apply() function in order to make different algorithms standardized. This makes them easily chained and helps authors think about designing their algorithms in a way that makes them easy to leverage and predictable for end users.

Take note of the `algo_entrypoint!` macro which precedes the `apply` function, which itself returns a `Result<T, E>` for some type `T` that can be converted into [AlgoOutput](https://docs.rs/algorithmia/2/algorithmia/algo/enum.AlgoOutput.html) and some type `E` can be converted into a boxed `Error`.  The [algo_entrypoint!](https://docs.rs/algorithmia/2/algorithmia/macro.algo_entrypoint.html) documentation covers this in more detail, but this guide will cover several common usages. 

To run this algorithm first hit the "Compile" button on the top right hand corner of the algorithm editor and then at the bottom of the page in the console you'll see a confirmation that it has compiled and the version number of that commit.  Until you have Published your algorithm, the version number will be a hash such as `4be0e18fba270e4aaa7cff20555268903f69a11b` - only you will be able to call this version.  After you've Published an algorithm, it will be given a `major.minor.revision` number as described in the [Versioning Documentation]({{ site.baseurl }}/basics/versioning/).

To test the algorithm, type your name or another string in the console and hit enter on your keyboard:

<img src="{{ site.baseurl }}/images/post_images/algo_dev_lang/compile_test_algo_rust.png" alt="Run basic algorithm in console Rust" class="screenshot">

## I/O for your Algorithms

Now that you've compiled and ran a basic algorithm in the console, we'll briefly go through some of the inputs and outputs you would expect to work with when creating an algorithm.

The first algorithm that we'll create will take a JSON formatted object, which has been passed as input by the user.  However, you don't need to worry about deserializing the JSON; it is done automatically before the call to `apply()`.

Your algorithm will output a JSON formatted object, which the user will consume via an API call to the algorithm path found at the bottom of the algorithm description page.  This path is based on your Algorithmia user name and the name of your algorithm, so if you are "demo" and your algorithm is "TokenizeText", then the path for version 0.1.1 of your algorithm will be `demo/TokenizeText/0.1.1`

### Working with Basic Data Structures

Use the `algo_entrypoint!` macro to declare the data type you wish to handle in your entry point.  We recommend accepting JSON-encoded Objects, and the easiest way to work with them is to derive an automatic deserialization from a wrapper type.  So, if I was expecting to receive a JSON Object containing "name" (a string) and "values" (a list of numbers), I might write:

{% highlight rust %}
use algorithmia::prelude::*;

#[macro_use] extern crate algorithmia;
#[macro_use] extern crate serde_derive;
#[macro_use] extern crate serde_json;

#[derive(Deserialize)]
pub struct Input {
    name: String,
    values: Vec<u32>,
}

algo_entrypoint!(Input);
fn apply(input: Input) -> Result<JsonValue, Box<std::error::Error>> {
    let sum: u32 = input.values.iter().sum();
    Ok(json!({ "name": input.name, "sum": sum }))
}
{% endhighlight %}

Go ahead and type or paste the code sample above in the Algorithmia code editor after removing the “Hello World” code.

Now compile the new code sample and when that’s done test the code in the console by passing in the input and hitting enter on your keyboard:

{% highlight json %}
{"name": "ages", "values": [8,6,7,5,3,0,9]}
{% endhighlight %}

This should return:

{% highlight json %}
{"name": "ages", "sum": 38}
{% endhighlight %}

Note that this returns well-formatted JSON which will be easy for the user to consume.

To change the exact structure of the JSON which you wish to *accept*, simply change the struct `Input`.  The derive macro will do its best to automatically convert incoming JSON into a compatible struct.  For specialized cases such as accepting raw binary input (such as encoded files), see  the [algo_entrypoint](https://docs.rs/algorithmia/2/algorithmia/macro.algo_entrypoint.html) documentation.

Algorithmia's Rust compiler is highly optimized, so builds can take several minutes (this will get faster as caching improves in future versions of Rust).  For now, we highly recommend developing most of your code locally, then doing a final compile in the Algorithmia console.  To do so, simply <a href="https://algorithmia.com/developers/algorithm-development/git/" target="_blank">clone your project</a>, <a href="https://www.rust-lang.org/install.html" target="_blank">install rust</a>, then run `cargo build` in your project directory.
{: .notice-info}

## Working with Data Stored on Algorithmia

This next code snippet shows how to create an algorithm working with a data file that a user has stored using Algorithmia's [Hosted Data Source]({{ site.baseurl }}/data/hosted).

While users who consume an algorithm have access to both Dropbox and Amazon S3 connectors, algorithm developers can only use the Algorithmia [Hosted Data Source]({{ site.baseurl }}/data/hosted) to host data for algorithm development.
{: .notice-warning}

#### Prerequisites
If you wish to follow along working through the example yourself, create a text file that contains any unstructured text such as a chapter from a public domain book or article. We used a chapter from [Burning Daylight, by Jack London](https://en.wikisource.org/wiki/Burning_Daylight) which you can copy and paste into a text file. Or copy and paste it from here: <a href="{{ site.baseurl }}/data_assets/burning_daylight.txt">Chapter One Burning Daylight, by Jack London</a>. Then you will can upload it into one of your [Data Collections](https://algorithmia.com/data/hosted) (create a collection, drop the file into the "Drop files here" area which appears at the bottom of the page).

This example shows how to create an algorithm that takes a user's file stored in a data collection on the Algorithmia platform and read it into a local String.  Next, it splits the text on any dot, then on whitespace characters.  Once done, it passes back an Object containing the properties "text" (the raw text extracted from the file), and "words" (a Vector of Vectors representing sentences and words):

{% highlight rust %}
use algorithmia::prelude::*;
use std::io::Read;

#[macro_use] extern crate algorithmia;
#[macro_use] extern crate serde_derive;
#[macro_use] extern crate serde_json;

#[derive(Deserialize)]
pub struct Input {
    user_file: String
}

algo_entrypoint!(Input);
fn apply(input: Input) -> Result<JsonValue, Box<std::error::Error>> {
    let client = Algorithmia::default();
    let mut text_reader = client.file(&input.user_file).get()?;
    let mut text = String::new();
    text_reader.read_to_string(&mut text)?;
    let words: Vec<Vec<_>> = text.split(".")
        .map(|sentence| sentence.split_whitespace().collect())
        .collect();
    Ok(json!({ "text": text, "words": words }))
}
{% endhighlight %}

After you paste the above code into the Algorithmia code editor, you can compile and then test the example by passing in a file that you've hosted in [Data Collections](https://algorithmia.com/data/hosted).

Following the example below, replace the path to your data collection with your user name (it will appear already if you are logged in), data collection name, and data file name which you can find under "My Collections" in [Data Collections](https://algorithmia.com/data/hosted):

{% highlight json %}
{"user_file": "data://YOUR_USERNAME/data_collection_dir/data_file.txt"}
{% endhighlight %}

You should get back an structure like this, but longer:

{% highlight json %}
{
    "text": "It was a quiet night in the Shovel...",
    "words": [["It","was","a","quiet","night","in","the","Shovel"],["At","the"...]]
}
{% endhighlight %}

### Calling Other Algorithms and Managing Data

To call other algorithms or manage data from your algorithm, use the <a href="{{ site.baseurl }}/clients/rust/">Algorithmia Rust Client</a> which is automatically available to any algorithm you create on the Algorithmia platform. For more detailed information on how to work with data see the [Data API docs](http://docs.algorithmia.com/?rust) and learn about Algorithmia's [Hosted Data Source]({{ site.baseurl }}/data/).

When designing your algorithm, don't forget that there are special data directories, `.session` and `.algo`, that are available only to algorithms to help you manage data over the course of the algorithm execution.

## Error Handling

The example above uses `Box<std::errror::Error>`, which is quite convenient, as you can append the `?` operator to any potentialy problematic line and the Error will get returned to the caller as a JSON String.

However, you may also choose to use your own `Error` type, which will allow you to return more useful, customized error messages to the caller. The [error-chain](https://crates.io/crates/error-chain) crate provides a great way to generate helpful errors with minimal boilerplate:

{% highlight rust %}
#[macro_use] extern crate error_chain;

error_chain! { }

algo_entrypoint!(&str);
fn apply(input: &str) -> Result<String> {
    let f = File::open(input).chain_err(|| "Failed to open input file")?;
    /* ... */
}
{% endhighlight %}

If the `File::open` fails, the API response's error message will look something like this:

<pre>
Failed to open input file
caused by: No such file or directory (os error 2)
</pre>

In addition, `error-chain` provides a `bail!` macro which you can use to return a custom error message at any time.

As with most Rust code, you should avoid panicking in your algorithm. API callers will not have access to the panic backtrace, and panicking will impact the latency of back-to-back requests from the same user.
{: .notice-warning}

## Algorithm Checklist

Before you are ready to publish your algorithm it's important to go through this [Algorithm Checklist]({{ site.baseurl }}/algorithm-development/algorithm-checklist/).

It will go over important best practices such as how to create a good algorithm description, add links to external documentation and other important information.

## Publish Algorithm

Once you've developed your algorithm, you can publish it and make it available for others to use.

On the upper right hand side of the algorithm page you'll see a purple button "Publish" which will bring up a modal:

<img src="{{ site.baseurl }}/images/post_images/algo_dev_lang/publish_algorithm.png" alt="Publish an algorithm" class="screenshot img-sm">

In this dialog, you can select whether your algorithm will be for public use or private use as well as the royalty. The algorithm can either be royalty-free or charge per-call. If you opt to have the algorithm charge a royalty, as the author, you will earn 70% of the royalty cost.

Check out [Algorithm Pricing]({{ site.baseurl }}/pricing/) for more information on how much algorithms will cost to run.

If you are satisfied with your algorithm and settings, go ahead and hit publish. Congratulations, you’re an algorithm developer!

### Editing an Algorithm

Your published algorithm can be edited from the browser, where you can edit the source code, save your work, compile, and submit the algorithm to be available through the API. You can also use [Git to push directly to Algorithmia]({{ site.baseurl }}/algorithm-development/git/) from your current workflow.

## Conclusion and Resources

In this guide we covered how to create an algorithm, work with different types of data and learned how to publish an algorithm.

For more resources:

* <a href="{{ site.baseurl }}/clients/rust/">Algorithmia Client Rust Docs</a>
* [Hosted Data Source]({{ site.baseurl }}/data/)
* [Algorithmia API Docs](http://docs.algorithmia.com/?rust)
* <a href="https://www.rust-lang.org/documentation.html" target="_blank">Rust 1.5 Docs</a>
* <a href="https://doc.rust-lang.org/std/" target="_blank">Rust standard library</a>
* <a href="https://crates.io/" target="_blank">Crates.io</a>
