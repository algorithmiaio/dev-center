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

Before you get started learning about Rust algorithm development, make sure you go through our <a href="{{site.baseurl}}/algorithm-development/algorithm-basics/your-first-algo">Getting Started Guide</a> to learn how to create your first algorithm, understand permissions available, versioning, using the CLI, and more.

Table of Contents

* [Available Libraries](#available-libraries)
* [Write your First Algorithm](#write-your-first-algorithm)
* [Managing Dependencies](#managing-dependencies)
* [I/O for your Algorithms](#io-for-your-algorithms)
* [Error Handling](#error-handling)
* [Algorithm Checklist](#algorithm-checklist)
* [Publish Algorithm](#publish-algorithm)
* [Conclusion and Resources](#conclusion-and-resources)

## Available Libraries

Algorithmia makes a number of libraries available to make algorithm development easier.

The full <a href="https://www.rust-lang.org/" target="_blank">Rust 1.15 language and standard library</a> is available for you to use in your algorithms.

Furthermore, algorithms can call other algorithms and manage data on the Algorithmia platform via the <a href="{{site.baseurl}}/clients/rust">Algorithmia Rust Client</a>.


## Write your First Algorithm

If you've followed the <a href="{{site.baseurl}}/algorithm-development/algorithm-basics/your-first-algo">Getting Started Guide</a>, you'll notice in your algorithm editor, there is boilerplate code that returns "Hello" and whatever you input to the console.

The main thing to note about the algorithm is that it's wrapped in the apply() function.

The apply() function defines the input point of the algorithm. We use the apply() function in order to make different algorithms standardized. This makes them easily chained and helps authors think about designing their algorithms in a way that makes them easy to leverage and predictable for end users.
{: .notice-info}

Go ahead and remove the boilerplate code below that's inside the apply() function because we'll be writing a different algorithm in this tutorial:

<img src="{{site.baseurl}}/images/post_images/algo_dev_lang/algorithm_console_rust.png" alt="Algorithm console Rust" class="screenshot">

## Managing Dependencies

Algorithmia supports adding 3rd party dependencies via Cargo. Cargo dependencies typically come from <a href="https://crates.io/" target="_blank">Crates.io</a> (though it is also possible to specify dependencies from a git URL). If working locally, you can edit `Cargo.toml` and run `cargo install` to update your lockfile. Alternatively, from the web IDE, there is a button on the top right that says "Dependencies". Click that button and you'll see a modal window:

<img src="{{site.baseurl}}/images/post_images/algo_dev_lang/dependencies_rust.png" alt="Rust Dependency File" class="screenshot img-md">

Add dependencies at the end of the file, under the `[dependencies]` section (for details on versioning and on git-based dependencies, see the <a href="http://doc.crates.io/specifying-dependencies.html" target="_blank">cargo documentation</a>).  Then click "Save dependencies" to close the modal window.

**Note:** Editing the `[bin]` and `[lib]` sections may break compilation, either immediately or during future platform maintenance. If you believe your scenario requires such changes, contact us as we'd love to learn more about your usage scenario to better support it.

## I/O for your Algorithms

Now let's get started on the hands-on portion of the guide:

The first algorithm that we'll create will take a JSON formatted object, which has been passed as input by the user.  However, you don't need to worry about deserializing the JSON; it is done automatically before the call to `apply()`.

Your algorithm will output a JSON formatted object, which the user will consume via an API call to the algorithm path found at the bottom of the algorithm description page.  This path is based on your Algorithmia user name and the name of your algorithm, so if you are "demo" and your algorithm is "TokenizeText", then the path for version 0.1.1 of your algorithm will be `demo/TokenizeText/0.1.1`

### Working with Basic Data Structures

Below is a code sample showing how to create an algorithm working with basic user input.

You'll also see some error handling within the algorithm, but we recommend that you take a look at our <a href="{{site.baseurl}}/algorithm-development/algorithm-basics/algorithm-errors">Better Error Handling Guide</a> for more information.

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

Algorithmia's Rust compiler is highly optimized, so builds can take several minutes (this will get faster as caching improves in future versions of Rust).  For now, we highly recommend developing most of your code locally, then doing a final compile in the Algorithmia console.  To do so, simply <a href="{{site.baseurl}}/algorithm-development/git" target="_blank">clone your project</a>, <a href="https://www.rust-lang.org/install.html" target="_blank">install rust</a>, then run `cargo build` in your project directory.
{: .notice-info}

## Working with Data Stored on Algorithmia

This next code snippet shows how to create an algorithm working with a data file that a user has stored using Algorithmia's [Hosted Data Source]({{site.baseurl}}/data/hosted).

While users who consume an algorithm have access to both Dropbox and Amazon S3 connectors, algorithm developers can only use the Algorithmia [Hosted Data Source]({{site.baseurl}}/data/hosted) to host data for algorithm development.
{: .notice-warning}

#### Prerequisites
If you wish to follow along working through the example yourself, create a text file that contains any unstructured text such as a chapter from a public domain book or article. We used a chapter from [Burning Daylight, by Jack London](https://en.wikisource.org/wiki/Burning_Daylight) which you can copy and paste into a text file. Or copy and paste it from here: <a href="{{site.baseurl}}/data_assets/burning_daylight.txt">Chapter One Burning Daylight, by Jack London</a>. Then you will can upload it into one of your [Data Collections](/data/hosted) (create a collection, drop the file into the "Drop files here" area which appears at the bottom of the page).

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

After you paste the above code into the Algorithmia code editor, you can compile and then test the example by passing in a file that you've hosted in [Data Collections](/data/hosted).

Following the example below, replace the path to your data collection with your user name (it will appear already if you are logged in), data collection name, and data file name which you can find under "My Collections" in [Data Collections](/data/hosted):

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

### Writing files for the user to consume

Sometimes it is more appropriate to write your output to a file than to return it directly to the caller.  In these cases, you may need to create a temporary file, then copy it to a [Data URI](http://docs.algorithmia.com/#data-api-specification) (usually one which the caller specified in their request, or a [Temporary Algorithm Collection]({{site.baseurl}}/data/hosted#temporary-algorithm-collections)):

{% highlight rust %}
let mut file_uri = "data://username/collection/filename.txt"
let mut temp_file = tempfile().expect("failed to create temporary file");
save_some_output(&mut temp_file);
temp_file.seek(SeekFrom::Start(0))
client.file(file_uri).putFile(temp_file)
{% endhighlight %}

However, actually using a temporary file is often unnecessary, and can be better accomplished with an in-memory buffer:

{% highlight rust %}
let mut file_uri = "data://username/collection/filename.txt"
let mut data = Vec::new();
save_some_output(&mut data);
client.file(file_uri).putFile(data)
{% endhighlight %}


### Calling Other Algorithms and Managing Data

To call other algorithms or manage data from your algorithm, use the <a href="{{site.baseurl}}/clients/rust">Algorithmia Rust Client</a> which is automatically available to any algorithm you create on the Algorithmia platform. For more detailed information on how to work with data see the [Data API docs](http://docs.algorithmia.com/?rust) and learn about Algorithmia's [Hosted Data Source]({{site.baseurl}}/data).

When designing your algorithm, don't forget that there are special data directories, `.session` and `.algo`, that are available only to algorithms to help you manage data over the course of the algorithm execution.

You may call up to {{site.data.stats.platform.max_num_parallel_algo_requests}} other algorithms, either in parallel or recursively.

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

For more information on error handling see the <a href="{{site.baseurl}}/algorithm-development/algorithm-basics/algorithm-errors">Better Error Handling Guide</a>.

## Algorithm Checklist

Before you are ready to publish your algorithm it's important to go through this [Algorithm Checklist]({{site.baseurl}}/algorithm-development/algorithm-checklist) and check out this blog post for <a href="https://blog.algorithmia.com/advanced-algorithm-design/">Advanced Algorithm Development <i class="fa fa-external-link"></i></a>.

Both links will go over important best practices such as how to create a good algorithm description, add links to external documentation and other important information.

## Publish Algorithm

Once you've developed your algorithm, you can publish it and make it available for others to use.

On the upper right hand side of the algorithm page you'll see a purple button "Publish" which will bring up a modal:

<img src="{{site.baseurl}}/images/post_images/algo_dev_lang/publish_algorithm.png" alt="Publish an algorithm" class="screenshot img-sm">

In this modal, you'll see a Changes tab, a Sample I/O tab, and one called Versioning.

Changes shows you your commit history and release notes.

Sample I/O is where you'll create your sample input and output for the user to try under Try the API in the Run tab. When you add a sample input, make sure to test it out with all the inputs that you accept since users will be able to test your algorithm with their own inputs.

Under the Versioning tab, you can select whether your algorithm will be for public use or private use as well as set the royalty. The algorithm can either be royalty-free or charge per-call. If you opt to have the algorithm charge a royalty, as the author, you will earn 70% of the royalty cost.

Check out [Algorithm Pricing]({{site.baseurl}}/pricing) for more information on how much algorithms will cost to run.

Under Semantic Versioning you can choose which kind of release your change should fall under: Major, Minor, or Revision.

If you are satisfied with your algorithm and settings, go ahead and hit publish. Congratulations, you’re an algorithm developer!

## Conclusion and Resources

In this guide we covered how to create an algorithm, work with different types of data and learned how to publish an algorithm.

For more resources:

* <a href="{{site.baseurl}}/clients/rust">Algorithmia Client Rust Docs</a>
* [Hosted Data Source]({{site.baseurl}}/data)
* [Algorithmia API Docs](http://docs.algorithmia.com/?rust)
* <a href="https://www.rust-lang.org/documentation.html" target="_blank">Rust 1.5 Docs</a>
* <a href="https://doc.rust-lang.org/std/" target="_blank">Rust standard library</a>
* <a href="https://crates.io/" target="_blank">Crates.io</a>
