---
layout: article
title: "Rust"
excerpt: "Add machine learning to your Rust app with Algorithmia"
categories: clients
tags: [clients]
ignore_sections: [build-test]
show_related: true
image:
    teaser: /language_logos/rust.svg
repository: https://github.com/algorithmiaio/algorithmia-rust
redirect_from:
  - /algorithm-development/client-guides/rust/
  - /algorithm-development/guides/rust/
  - /algorithm-development/guides/rust-guide/
  - /application-development/client-guides/rust/
  - /application-development/guides/rust/
  - /application-development/lang-guides/rust/examples/
menus:
  clients:
    url: /developers/clients/rust
    title: "Rust"
    weight: 13
---

This guide provides a walk-through of how to use the official Algorithmia Rust Client to call algorithms and manage your data
through the Algorithmia platform.

Here you will learn how to install the Algorithmia Rust Client, work with the Data API by uploading and downloading files, create and update directories and permission types and last, you'll learn how to call an algorithm that summarizes text files.

To follow along you can create a new project with `cargo new <PROJECT>`

## Getting Started with Algorithmia

The official Algorithmia Rust Client is published to [crates.io](https://crates.io/crates/algorithmia) and additional reference documentation can be found in the cargo-generated [Algorithmia Client Documentation](http://algorithmiaio.github.io/algorithmia-rust/algorithmia/) and the [Algorithmia API docs](http://docs.algorithmia.com/?rust#).

To get started, first install the Algorithmia Rust Client by adding `algorithmia = "2.0.0"` to the dependencies in your `Cargo.toml`.

Then build the cargo file to download and install the client:

{% highlight rust %}
cargo build
{% endhighlight %}

## Authentication

Next, login to [Algorithmia](/) to get your [API key](/user#credentials):

Now import the Algorithmia library and create the Algorithmia client:

{% highlight rust %}
use algorithmia::*;
// Instantiate an Algorithmia client using your API key
let client = Algorithmia::client("YOUR_API_KEY");
{% endhighlight %}

Now you’re ready to start working with Algorithmia in Rust.

{% if site.enterprise %}
#### Enterprise Users Only: Specifying an On-Premises or Private Cloud Endpoint
If you are running [Algorithmia Enterprise](/enterprise), you can specify the API endpoint when you create the client object:

{% highlight rust %}
let client = Algorithmia::client("YOUR_API_KEY", "https://mylocalendpoint");
{% endhighlight %}
{% endif %}

## Working with Data Using the Data API

For application developers, [Algorithmia's Data Portal](/data) offers three different ways to store your data, all available via the [Data API](http://docs.algorithmia.com/#data-api-specification).

This guide will show you how to work with the [Hosted Data]({{site.baseurl}}/data/hosted) option on the Algorithmia platform which is available to both algorithm and application developers.

### Prerequisites
If you wish to follow along working through the example yourself, create a text file that contains any unstructured text such as a chapter from a public domain book or article. We used a chapter from [Burning Daylight, by Jack London](https://en.wikisource.org/wiki/Burning_Daylight) which you can copy and paste into a text file. Or copy and paste it from here: <a href="{{site.baseurl}}/data_assets/burning_daylight.txt">Chapter One Burning Daylight, by Jack London</a>. This will be used throughout the guide.

### Create a Data Collection

This section will show how to create a data collection which is essentially a folder of data files hosted on Algorithmia for free.

To begin working with data directories in Rust, first add these imports:

{% highlight rust %}
use algorithmia::data::*;
use std::io::Read;
{% endhighlight %}

Now create a data collection called nlp_directory:

{% highlight rust %}
// Instantiate a DataDirectory object, set your data URI and call create
let nlp_directory = client.dir("data://YOUR_USERNAME/nlp_directory");

if nlp_directory.exists().unwrap() == false{
    nlp_directory.create(DataAcl::default());
}
{% endhighlight %}

A Data URI uniquely identifies files and directories and contains a protocol "data://" and path "YOUR_USERNAME/data_collection". For more information on the Data URI see the [Data API Specification](http://docs.algorithmia.com/#data-api-specification).

Instead of your username you can also use '.my' when calling algorithms. For more information about the '.my' pseudonym check out the [Hosted Data Guide]({{site.baseurl}}/data/hosted).
{: .notice-info}

### Work with Directory Permissions

When we created the data collection in the previous code snippet, we set it to the default setting "MyAlgorithms" via `DataAcl::default()`, which is a permission type that allows other users on the platform to interact with your data through the algorithms you create if you decide to contribute to algorithm development. This means users can call your algorithm to perform an operation on your data stored in this collection, otherwise the algorithm you created would only work for you.

In order to change your data collection permissions you can go to [Hosted Data](/data/hosted) and click on the collection you just created called **"nlp_directory"** and select from the dropdown at the top of the screen that will show three different types of permissions:

<div class="syn-body-1" markdown="1">

-   My Algorithms (called by any user)
-   Private (accessed only by me)
-   Public (available to anyone)

</div>

For more information about data collection permissions go to the [Hosted Data Guide]({{site.baseurl}}/data/hosted).

### Upload Data to your Data Collection

So far you've created your data collection and checked and updated directory permissions. Now you're ready to upload the text file that you created at the beginning of the guide to your data collection using the Data API.

First create a variable that holds the path to your data collection and the text file you will be uploading:

{% highlight rust %}
let text_file = "data://YOUR_USERNAME/nlp_directory/jack_london.txt";
{% endhighlight %}

Next upload your local file to the data collection using the .put_file() method:

{% highlight rust %}
// Check if file exists
if client.file(text_file).exists().unwrap() == false{
	// Upload local file
	nlp_directory.put_file("/your_local_path_to_file/jack_london.txt");
}
{% endhighlight %}

This endpoint will replace a file if it already exists. If you wish to avoid replacing a file, check if the file exists before using this endpoint.
{: .notice-warning}

You can confirm that the file was created by navigating to Algorithmia's [Hosted Data Source](/data/hosted) and finding your data collection and file.

You can also upload your data through the UI on Algorithmia's [Hosted Data Source](/data/hosted). For instructions on how to do this go to the [Hosted Data Guide]({{site.baseurl}}/data/hosted).

### Downloading Data from a Data Collection

Next check if the file that you just uploaded to data collections exists, and try downloading it to a (new) local file:

{% highlight rust %}
// Download the file
if client.file(text_file).exists().unwrap() {
	let mut file_reader = client.file(text_file).get().unwrap();
	let mut localfile = File::create("/path/to/save/localfile.png").unwrap();
	std::io::copy(&mut file_reader, &mut localfile);
}
{% endhighlight %}

This copies the file from your data collection and saves it as a file on your local machine, storing the filename in the variable `localfile`.

Alternately, if you just need the text content of the file to be stored in a variable, you can retrieve the remote file's content without saving the actual file:

{% highlight rust %}
// Download contents of file as a string
if client.file(text_file).exists().unwrap() {
	let mut text_reader = client.file(text_file).get().unwrap();
	let mut jack_london_text = String::new();
	let _ = text_reader.read_to_string(&mut jack_london_text);
}
{% endhighlight %}

This will get your file as a string, saving it to the variable `input`.  If the file was binary (an image, etc), you could instead use the function `.getBytes()` to retrieve the file's content as a byte array. For more image-manipulation tutorials, see the [Computer Vision Recipes]({{site.baseurl}}/tutorials/recipes/#computer-vision).

Now you've seen how to upload a local data file, check if a file exists in a data collection, and download the file contents.

For more methods on how to get a file using the Data API from a data collection go to the [API Specification](http://docs.algorithmia.com/#getting-a-file).

## Call an Algorithm

Finally we are ready to call an algorithm. In this guide we'll use the natural language processing algorithm called [Summarizer](https://algorithmia.com/algorithms/nlp/Summarizer). This algorithm results in a string that is the summary of the text content you pass in as the algorithm's input.

A single algorithm may have different input and output types, or accept multiple types of input, so consult the algorithm’s description for usage examples specific to that algorithm.
{: .notice-info}

This example shows the summary of the text file which we downloaded from our data collection and set as the variable called "input" in the previous code sample.

Create the algorithm object and pass in the variable "input" into algo.pipe:

{% highlight rust %}
// Download contents of file as a string
if client.file(text_file).exists().unwrap() {
	let mut text_reader = client.file(text_file).get().unwrap();
	let mut jack_london_text = String::new();
	let _ = text_reader.read_to_string(&mut jack_london_text);

	// Call Summarizer algorithm.
	let algo = client.algo("nlp/Summarizer/0.1.3");
	match algo.pipe(& jack_london_text) {
	    Ok(response) => {
	    	response.as_string().unwrap();
	    },
	    Err(err) => println!("error calling Summarizer algo: {}", err),
	};
}
{% endhighlight %}

This guide used the the first chapter of [Jack London's Burning Daylight](https://en.wikisource.org/wiki/Burning_Daylight) and the Summarizer algorithm outputs:

"It was a quiet night in the Shovel. The miners were in from Moseyed Creek and the other diggings to the west, the summer washing had been good, and the men's pouches were heavy with dust and nuggets. MacDonald grinned and nodded, and opened his mouth to speak, when the front door swung wide and a man appeared in the light."

If you are interested in learning more about working with unstructured text data check out our guide [Introduction to Natural Language Processing](https://blog.algorithmia.com/introduction-natural-language-processing-nlp/).

### Limits

Your account can make up to {{site.data.stats.platform.max_num_algo_requests}} Algorithmia requests at the same time (this limit <a onclick="Intercom('show')">can be raised</a> if needed).

## Conclusion

This guide covered installing the Algorithmia Rust Client, uploading and downloading data to and from a user created data collection, checking if a file exists using the Data API, calling an algorithm, and handling errors.

For more information on the methods available using the Data API in Rust check out the [Data API](http://docs.algorithmia.com/?rust#data-api-specification) documentation, the [Rust Client Docs](https://github.com/algorithmiaio/algorithmia-rust) and the [Rust Language Docs] (https://crates.io/crates/algorithmia)

For convenience, here is the whole code snippet available to run:

{% highlight rust %}
extern crate algorithmia;
use algorithmia::*;
use algorithmia::data::*;

use std::io::Read;

fn main() {
	// Instantiate an Algorithmia client using your API key
	let client = Algorithmia::client("YOUR_API_KEY");

	// Instantiate a DataDirectory object, set your data URI and call create
	let nlp_directory = client.dir("data://YOUR_USERNAME/nlp_directory");

	if nlp_directory.exists().unwrap() == false{
	    nlp_directory.create(DataAcl::default());
	}

	let text_file = "data://YOUR_USERNAME/nlp_directory/jack_london.txt";

	// Check if file exists
	if client.file(text_file).exists().unwrap() == false{
		// Upload local file
		nlp_directory.put_file("/your_local_path_to_file/jack_london.txt");
	}

	// Download contents of file as a string
	if client.file(text_file).exists().unwrap() {
		let mut text_reader = client.file(text_file).get().unwrap();
		let mut jack_london_text = String::new();
		let _ = text_reader.read_to_string(&mut jack_london_text);

		// Call Summarizer algorithm.
		let algo = client.algo("nlp/Summarizer/0.1.3");
		match algo.pipe(& jack_london_text) {
		    Ok(response) => {
		    	response.as_string().unwrap();
		    },
		    Err(err) => println!("error calling Summarizer algo: {}", err),
		};
	}
}
{% endhighlight %}
