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
  - /application-development/lang-guides/rust/
---

The Algorithmia Rust client provides a native Rust interface to the Algorithmia API, letting developers manage and call algorithms, work with data in object stores using Algorithmia Data Sources, and access other features of the Algorithmia platform.

This guide will cover setting up the client, calling an algorithm using direct user input, calling an algorithm that accesses data through Algorithmia Data Sources, and using Algorithmia's Hosted Data service. For complete details about the Algorithmia API, please refer to the [API Docs](/developers/api/).

Create a new Rust project to follow along.

## Set Up the Client

The official Algorithmia Rust Client is published to [crates.io](https://crates.io/crates/algorithmia) and additional reference documentation can be found in the cargo-generated [Algorithmia Rust Client Documentation](http://algorithmiaio.github.io/algorithmia-rust/algorithmia/) and the [Algorithmia API docs](http://docs.algorithmia.com/).

To get started, first install the Algorithmia Rust Client by adding `algorithmia = "2.1.3"` to the dependencies in your `Cargo.toml`.

Then build the cargo file to download and install the client:

{% highlight rust %}
cargo build
{% endhighlight %}

To use the client you'll need an API key, which Algorithmia uses for fine-grained authentication across the platform. For this example, we'll use the `default-key` that was created along with your account, which has a broad set of permissions. Log in to Algorithmia and navigate to Home > [API Keys](/user#credentials) to find your key, or read the [API keys](/developers/platform/customizing-api-keys) documentation for more information.

Once the client is installed, you can import it into your code and instantiate the client object:

{% highlight rust %}
use algorithmia::Algorithmia;

// Authenticate with your API key
let api_key = "YOUR_API_KEY"
// Create the Algorithmia client object
let client = Algorithmia::client("api_key").unwrap();
{% endhighlight %}

#### Specifying an On-Premises or Private Cloud Endpoint

This feature is available to [Algorithmia Enterprise](/enterprise) users only.
{: .notice-enterprise}

If you are running [Algorithmia Enterprise](/enterprise), you can specify the API endpoint when you create the client object:

{% highlight rust %}
let client = Algorithmia::client("YOUR_API_KEY", "https://mylocalendpoint");
{% endhighlight %}

Alternately, you can ensure that each of your servers interacting with your Algorithmia Enterprise instance have an environment variable named `ALGORITHMIA_API` and the client will use it.  The fallback API endpoint is always the hosted Algorithmia marketplace service at [https://api.algorithmia.com/](https://api.algorithmia.com/)

## Calling an Algorithm

Algorithms take three basic types of input whether they are invoked directly through the API or by using a client library: strings, JSON, and binary data. In addition, individual algorithms might have their own I/O requirements, such as using different data types for input and output, or accepting multiple types of input, so consult the input and output sections of an algorithm's documentation for specifics.

The first algorithm we'll call is a demo version of the algorithm used in the Algorithm Development [Getting Started](/developers/algorithm-development/your-first-algo) guide, which is available at [demo/Hello](/algorithms/demo/Hello). Looking at the [algorithm's documentation](/algorithms/demo/Hello/docs), it takes a string as input and returns a string.

In order to call an Algorithm from Rust, we need to first create an algorithm object. With the client already instantiated, we can run the following code to create an object:

{% highlight rust %}
let algo = client.algo("demo/Hello");
{% endhighlight %}

Then, we can use the `pipe` method to call the algorithm. We'll provide our input as the argument to the function, and store the result in the `response` variable. We can then print the output using the `as_string` method:

{% highlight rust %}
let response = algo.pipe("HAL 9000").unwrap();
println!("{}", response.as_string().unwrap());
{% endhighlight %}

Which should print the phrase, `Hello HAL 9000`.

### JSON and Rust

The Rust client integrates with the `serde` framework and allows you to call an algorithm with JSON input by calling `pipe` with a reference to a type that implements `serde::Serialize`. If the algorithm output is JSON, you can call decode to deserialize the resonse into a type that implements `serde::Deserialize`.

Additionally, with `serde_json`, you can use the `json!` macro or implement custom serialization/deserialization. See [serde.rs](https://serde.rs/) for more details on using serde.

Let's look at an example using JSON and the [nlp/LDA](https://algorithmia.com/algorithms/nlp/LDA) algorithm. The [algorithm docs](https://algorithmia.com/algorithms/nlp/LDA/docs) tell us that the algorithm takes a list of documents and returns a number of topics that are relevant to those documents. The documents can be a list of strings, a Data API file path, or a URL. We'll construct our input using `serde_json` following the format in the algorithm documentation:

{% highlight rust %}
let algo_json = client.algo("nlp/LDA/1.0.0");
let input = json!({
    "docsList": [
        "The apples are ready for picking",
        "It's apple picking season"
    ]
});
let response_json = algo_json.pipe(input);
let output = response_json.unwrap();
println!("{}", output.to_json().unwrap());
{% endhighlight %}

The output will be `[{'picking': 2}, {'apple': 1}, {'apples': 1, 'ready': 1}, {'season': 1}]`, which is the list of relevant words and the number of occurrences.

You might have noticed that in this example we included a version number when instantiating the algorithm. Pinning your code to a specific version of the algorithm can be especially important in a production environment where the underlying implementation might change from version to version.

### Request Options

The client exposes options that can configure algorithm requests via a builder pattern. This includes support for changing the timeout or indicating that the API should include stdout in the response. In the following example, we set the timeout to 60 seconds and disable `stdout` in the response:

{% highlight rust %}
let mut algo = client.algo("demo/Hello");
let algo = algo.timeout(10).stdout(false);
let response = algo.pipe("HAL 9001").unwrap();
println!("{}", response.as_string().unwrap());
{% endhighlight %}

You can find more details in [API Docs](/developers/api/) > [Invoke an Algorithm](/developers/api/#invoke-an-algorithm).

### Error Handling

To be able to better develop across languages, Algorithmia has created a set of standardized errors that can be returned by either the platform or by the algorithm being run. True to the nature of explicit error handling in rust, the pipe and response parsing methods all return Result-wrapped types:

{% highlight rust %}
let algo = client.algo("util/WhoopsWrongAlgo");
match algo.pipe("Hello, world!") {
    Ok(_response) => { /* success */ },
    Err(err) => println!("error calling algorithm: {}", err),
}
{% endhighlight %}

You can read more about [Error Handling](/developers/algorithm-development/algorithm-errors) in the [Algorithm Development](/developers/algorithm-development) section of the dev center.

### Limits

Your account can make up to {{site.data.stats.platform.max_num_algo_requests}} Algorithmia requests at the same time (this limit <a onclick="Intercom('show')">can be raised</a> if needed).

## Working with Algorithmia Data Sources

For some algorithms, passing input to the algorithm at request time is sufficient, while others might have larger data requirements or need to preserve state between calls. Application developers can use Algorithmia's [Hosted Data](/developers/data/hosted) to store data as text, JSON, or binary, and access it via the Algorithmia [Data API](/developers/api/#data).

The Data API defines [connectors](/developers/api/#connectors) to a variety of storage providers, including Algorithmia [Hosted Data](/developers/data/hosted), Amazon S3, Google Cloud Storage, Azure Storage Blobs, and Dropbox. After creating a connection in Data Sources, you can use the API to create, update, and delete directories and files and manage permissions across providers by making use of [Data URIs](/developers/api/#data-uris) in your code.

In this example, we'll upload an image to Algorithmia's [Hosted Data](/developers/data/hosted) storage provider, and use the [dlib/FaceDetection](https://algorithmia.com/algorithms/dlib/FaceDetection) algorithm to detect any faces in the image. The algorithm will create a new copy of the image with bounding boxes drawn around the detected faces, and then return a JSON object with details about the dimensions of the bounding boxes and a URI where you can download the resulting image.

### Create a Data Collection

The documentation for "Face Detection" says that it takes a URL or a Data URI of the image to be processed, and a Data URI where the algorithm can store the result. We'll create a directory to host the input image and set its [permissions](/developers/api/#update-collection-acl) to make it publicly accessible by creating a DataAcl with `DataAcl::from(ReadAcl::Public)` and passing it to the `create` method.

{% highlight rust %}
let img_directory = client.dir("data://YOUR_USERNAME/img_directory");
if img_directory.exists().unwrap() == false {
    img_directory.create(DataAcl::from(ReadAcl::Public)).unwrap();
} else {
    println!("img_directory exists");
}
{% endhighlight %}

Instead of your username you can also use '.my' when calling algorithms. For more information about the '.my' pseudonym check out the [Hosted Data Guide]({{site.baseurl}}/data/hosted).
{: .notice-info}

If you need to update an existing directory's permissions so that it's publicly accessible, you can go to [Hosted Data](/data/hosted) and click on the collection you just created called **"img_directory"** and select from the dropdown at the top of the screen that shows three different types of permissions:

-   My Algorithms (called by any user)
-   Private (accessed only by me)
-   Public (available to anyone)

### Upload Data to your Data Collection

Now we're ready to upload an image file for processing. For this example, we'll use [this photo of a group of friends](https://unsplash.com/photos/Q_Sei-TqSlc). Download the image and save it locally as `friends.jpg`. 

Next, create a variable that holds the location where you would like to upload the image as a URI:

{% highlight rust %}
let img_file = "data://.my/img_directory/friends.jpg";
{% endhighlight %}

Then upload your local file to the data collection using the `put_file` method:

{% highlight rust %}
if client.file(img_file).exists().unwrap() == false {
    img_directory.put_file("../data/friends.jpg").unwrap();
} else {
    println!{"file exists"};
}
{% endhighlight %}

This method call will replace a file if it already exists at the specified location. If you wish to avoid replacing a file, check if the file exists before using this method.
{: .notice-warning}

Confirm that the file was created by navigating to Algorithmia's [Hosted Data Source](/data/hosted) and finding your data collection and file.

You can also upload your data through the UI on Algorithmia's [Hosted Data Source](/data/hosted). For instructions on how to do this go to the [Hosted Data Guide]({{site.baseurl}}/data/hosted).

### Call the Algorithm

Once the file has been uploaded, you are ready to call the algorithm. Create the algorithm object, then pass the required inputs—an image URI (which is stored in `img_file` in the code above) and a URI for the image output—to `pipe`:

{% highlight rust %}
let algo_cv = client.algo("dlib/FaceDetection/0.2.1");
let input_cv = json!({
    "images": [
        {
            "url": "data://.my/img_directory/friends.jpg",
            "output": "data://.algo/temp/detected_faces.png"
        }
    ]
});

match algo_cv.pipe(input_cv) {
    Ok(response) => println!("{}", response.to_json().unwrap()),
    Err(err) => println!("error calling FaceDetection algo: {}", err)
};
{% endhighlight %}

Once the algorithm has completed, `response` will contain the dimensions of the bounding boxes for any detected faces and the URI for the resulting file, which you can then download (or provide as input to another algorithm in a pipeline).

Algorithms can create and store data in folders named with the algorithm name in the Algorithm Data collection. To access this folder from within an executing algorithm, the `.algo` shortcut can be used, as in the input example above. When accessing data from a client context, the algorithm author and name can be used along with the `.algo` shortcut to download data, in the format `data://.algo/author/algoName/folder/fileName`.
{: .notice-info}

### Download the resulting file

The URI included in the algorithm output uses the `.algo` shortcut, so we'll need to modify it slighly to download the file by adding the algorithm name and author:

{% highlight rust %}
let download_uri = "data://.algo/dlib/FaceDetection/temp/detected_faces.png";
{% endhighlight %}

Verify that the file that you want to download exists, and try downloading it to a new local file location. The Rust client allows you to download files by calling `get` on a `DataFile` object, which returns a `Result`-wrapped `DataResponse` that implements `Read`. You can then write the file locally using `std::fs:File` and `std::io:copy`:

{% highlight rust %}
if client.file(download_uri).exists().unwrap() {
    let mut png_reader = client.file(download_uri).get().unwrap();
    let mut png = std::fs::File::create("../data/detected_faces.png").unwrap();
    std::io::copy(&mut png_reader, &mut png).unwrap();
};
{% endhighlight %}

Alternately, if you just need the binary content of the file to be stored in a variable, you could store the results in a byte array:

{% highlight rust %}
let mut png_reader = client.file(download_uri).get().unwrap();;
let mut png = Vec::new();
png_reader.read_to_end(&mut t800_bytes);
{% endhighlight %}

If the file was text (an image, etc.), you can use `read_to_string` on the response. The [API Specification](/developers/api/#get-a-file-or-directory) has more details on how to get files from a data collection using the Data API.

## Additional Functionality

In addition to the functionality covered in this guide, the Rust Client Library provides a complete interface to the Algorithmia platform, including [managing algorithms](/developers/algorithm-development/algorithm-management), administering [organizations](/developers/platform/organizations), and working with [source control](/developers/algorithm-development/source-code-management). You can also visit the [API Docs](/developers/api) to view the complete API specification.

## Next Steps

If you're a data scientist or developer who will be building and deploying new algorithms, you can move on to the [Algorithm Development > Getting Started](/developers/algorithm-development/your-first-algo) guide.
