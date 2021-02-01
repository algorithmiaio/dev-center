---
layout: article
title: "Scala"
excerpt: "Add machine learning to your Scala app with Algorithmia"
categories: clients
tags: [clients]
show_related: true
image:
    teaser: /language_logos/scala.svg
repository: https://github.com/algorithmiaio/algorithmia-scala
redirect_from:
  - /algorithm-development/client-guides/scala/
  - /algorithm-development/guides/scala/
  - /algorithm-development/guides/scala-guide/
  - /application-development/client-guides/scala/
  - /application-development/guides/scala/
  - /application-development/lang-guides/scala/
---

The Algorithmia Scala client provides a native Scala interface to the Algorithmia API, letting developers manage and call algorithms, work with data in object stores using Algorithmia Data Sources, and access other features of the Algorithmia platform.

This guide will cover setting up the client, calling an algorithm using direct user input, calling an algorithm that accesses data through Algorithmia Data Sources, and using Algorithmia's Hosted Data service. For complete details about the Algorithmia API, please refer to the [API Docs](/developers/api/). Reference documentation for the Scala Client can be found in the [Algorithmia Scala Client Docs](https://www.javadoc.io/doc/com.algorithmia/algorithmia-scala_2.11).

To follow along you can create a new Scala project in the IDE of your choice.

## Set Up the Client

The Algorithmia Scala Client is published to Maven central. To get started, the Algorithmia Scala Client can be added as a dependency in your `build.sbt` file:

{% highlight scala %}
libraryDependencies += "com.algorithmia" %% "algorithmia-scala" % "1.0.1"
{% endhighlight %}

You can also [download the JAR](https://mvnrepository.com/artifact/com.algorithmia/algorithmia-scala) or include the library using your IDE of choice.

To use the client you'll need an API key, which Algorithmia uses for fine-grained authentication across the platform. For this example, we'll use the `default-key` that was created along with your account, which has a broad set of permissions. Log in to Algorithmia and navigate to Home > [API Keys](/user#credentials) to find your key, or read the [API keys documentation](/developers/platform/customizing-api-keys) for more information.

Once the client is installed, you can import it into your code and instantiate the client object:

{% highlight scala %}
import com.algorithmia.{Algorithmia, AlgorithmiaClient}
val client = Algorithmia.client("YOUR_API_KEY")
{% endhighlight %}

#### Specifying an On-Premises or Private Cloud Endpoint

This feature is available to [Algorithmia Enterprise](/enterprise) users only.
{: .notice-enterprise}

If you are running [Algorithmia Enterprise](/enterprise), you can specify the API endpoint when you create the client object:

{% highlight scala %}
val client = Algorithmia.client("YOUR_API_KEY", "https://mylocalendpoint")
{% endhighlight %}

Alternately, you can ensure that each of your servers interacting with your Algorithmia Enterprise instance have an environment variable named `ALGORITHMIA_API` and the client will use it.  The fallback API endpoint is always the hosted Algorithmia marketplace service at [https://api.algorithmia.com/](https://api.algorithmia.com/)

## Calling an Algorithm

Algorithms take three basic types of input whether they are invoked directly through the API or by using a client library: strings, JSON, and binary data. In addition, individual algorithms might have their own I/O requirements, such as using different data types for input and output, or accepting multiple types of input, so consult the input and output sections of an algorithm's documentation for specifics.

The first algorithm we'll call is a demo version of the algorithm used in the Algorithm Development [Getting Started](/developers/algorithm-development/your-first-algo) guide, which is available at [demo/Hello](/algorithms/demo/Hello). Looking at the [algorithm's documentation](/algorithms/demo/Hello/docs), it takes a string as input and returns a string.

In order to call an Algorithm from Scala, we need to first create an algorithm object. With the client already instantiated, we can run the following code to create an object:

{% highlight scala %}
val algo = client.algo("demo/Hello")
{% endhighlight %}

Then, we can use the `pipe()` method to call the algorithm. We'll provide our input as the argument to the function, and then print the output using the `result` attribute and the `asString()` method:

{% highlight scala %}
val result = algo.pipe("HAL 9000")
println(result.asString)
{% endhighlight %}

Which should print the phrase, `Hello HAL 9000`.

### JSON and Scala

The Scala client provides some ease-of-use abstractions for working with algorithms with JSON inputs and outputs. Call an algorithm with JSON input by passing in a type that can be serialized to JSON, including most plain old java objects, Scala classes, and collection types. If the algorithm output is JSON, call the `as` method on the response with the type that it should be deserialized into.

Let's look at an example using JSON and the [nlp/LDA](https://algorithmia.com/algorithms/nlp/LDA) algorithm. The [algorithm docs](https://algorithmia.com/algorithms/nlp/LDA/docs) tell us that the algorithm takes a list of documents and returns a number of topics that are relevant to those documents. The documents can be a list of strings, a Data API file path, or a URL. We'll first create a variable called `inputJson` with a HashMap that contains a single entry with a key of `docsList`, and the documents to be analyzed as an array of strings. We can then call the algorithm by passing `input` to `pipe()`.

{% highlight scala %}
val algoJson = client.algo("nlp/LDA/1.0.0")
var input = HashMap("docsList"->Array("It's apple picking season","The apples are ready for picking"))
val resultJson = algoJson.pipe(input)
println(resultJson.asString)
{% endhighlight %}

The output will be a list of relevant topics and their number of occurrences, which will look something like: `[{"picking":1},{"apple":1,"ready":1},{"season":1},{"apples":1,"picking":1}]`.

You might have noticed that in this example we included a version number when instantiating the algorithm. Pinning your code to a specific version of the algorithm can be especially important in a production environment where the underlying implementation might change from version to version.

### Request Options

The client exposes options that can configure algorithm requests. This includes support for changing the timeout or indicating that the API should include stdout in the response. In the following example, we set the timeout to 60 seconds and disable `stdout` in the response:

{% highlight scala %}
algo.withTimeout(Duration(1, MINUTES))
algo.withStdout(false)
{% endhighlight %}

You can find more details in [API Docs](/developers/api/) > [Invoke an Algorithm](/developers/api/#invoke-an-algorithm).

### Error Handling

To be able to better develop across languages, Algorithmia has created a set of standardized errors that can be returned by either the platform or by the algorithm being run. In Scala, Errors that occur durring algorithm execution will result in `AlgorithmException` when attempting to read the response, while API errors exceptions will result in calls to `pipe` throwing `APIException`:

{% highlight scala %}
val algoError = client.algo("util/whoopsWrongAlgo")
try {
  val result = algoError.pipe("Hello, world!")
  val output = result.asString
} catch {
  case e: Exception => println("API Exception: " + e.getMessage)
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

The documentation for "Face Detection" says that it takes a URL or a Data URI of the image to be processed, and a Data URI where the algorithm can store the result. First, import the requirements for working with data:

{% highlight scala %}
import com.algorithmia.data._
{% endhighlight %}

We'll create a directory to host the input image, then update its [permissions](/developers/api/#update-collection-acl) so that its publicly accessible:

{% highlight scala %}
val imgDirectory = client.dir("data://YOUR_USERNAME/img_directory")
if (imgDirectory.exists == false) {
  imgDirectory.create()
  imgDirectory.updatePermissions(DataAcl(read = DataPublic))
} else {
  println("Directory already exists")
}
{% endhighlight %}

Instead of your username you can also use '.my' when calling algorithms. For more information about the '.my' pseudonym check out the [Hosted Data Guide]({{site.baseurl}}/data/hosted).
{: .notice-info}

### Upload Data to your Data Collection

Now we're ready to upload an image file for processing. For this example, we'll use [this photo of a group of friends](https://unsplash.com/photos/Q_Sei-TqSlc). Download the image and save it locally as `friends.jpg`. 

Next, create a variable that holds the location where you would like to upload the image as a URI:

{% highlight scala %}
val imgFile = "data://.my/img_directory/friends.jpg";
{% endhighlight %}

Then upload your local file to the data collection using the `put()` method:

{% highlight scala %}
try {
  if (client.file(imgFile).exists() == false) {
    client.file(imgFile).put(new File("/your_local_path_to_file/friends.jpg"));
  }
} catch (APIException e) {
  System.out.println("API Exception: " + e.getMessage());
} catch (FileNotFoundException e) {
  e.printStackTrace();
}
{% endhighlight %}

This method call will replace a file if it already exists at the specified location. If you wish to avoid replacing a file, check if the file exists before using this method.
{: .notice-warning}

Confirm that the file was created by navigating to Algorithmia's [Hosted Data Source](/data/hosted) and finding your data collection and file.

You can also upload your data through the UI on Algorithmia's [Hosted Data Source](/data/hosted). For instructions on how to do this go to the [Hosted Data Guide]({{site.baseurl}}/data/hosted).

### Call the Algorithm

Once the file has been uploaded, you are ready to call the algorithm. Create the algorithm object and the input object based on the algorithm documentation, including the location of the image file and a location to store the algorithm output image, and then call the algorithm:

{% highlight scala %}
val algoCv = client.algo("dlib/FaceDetection/0.2.1");
var inputCv = HashMap("images"->
  Array(
    HashMap("url"->"data://.my/img_directory/friends.jpg","output"->"data://.algo/temp/detected_faces.png")
  )
)
try {
  val result = algoCv.pipe(inputCv)
  println(result)
} catch {
  case e: Exception => println("API Exception: " + e.getMessage)
}
{% endhighlight %}

Once the algorithm has completed, `result` will contain the dimensions of the bounding boxes for any detected faces and the URI for the resulting file, which you can then download (or provide as input to another algorithm in a pipeline).

Algorithms can create and store data in folders named with the algorithm name in the Algorithm Data collection. To access this folder from within an executing algorithm, the `.algo` shortcut can be used, as in the input example above. When accessing data from a client context, the algorithm author and name can be used along with the `.algo` shortcut to download data, in the format `data://.algo/author/algoName/folder/fileName`.
{: .notice-info}

### Download the resulting file

The URI included in the algorithm output uses the `.algo` shortcut, so we'll need to modify it slightly to download the file by adding the algorithm name and author.

{% highlight scala %}
val downloadUri = "data://.algo/dlib/FaceDetection/temp/detected_faces.png"
{% endhighlight %}

Verify that the file exists, and try downloading it to a new local file location useing `getFile`:

{% highlight scala %}
try {
if (client.file(downloadUri).exists) {
  val localFile = client.file(downloadUri).getFile
  println("File downloaded to: " + localFile)
} else {
  System.out.println("Please check that your file exists.")
}
} catch {
  case e: Exception => println("Could not download file locally: " + e.getMessage)
}
  println("...done.\n")
{% endhighlight %}

This copies the file from your data collection and saves it as a file on your local machine, with details about the file in the variable `localFile`.

Alternately, if you just need the binary content of the file to be stored in a variable, you can retrieve the remote file's content without saving the actual file:

{% highlight scala %}
try {
  if (client.file(downloadUri).exists) {
    val imageData = client.file(downloadUri).getBytes
    println("File downloaded to: " + localFile)
  } else {
    System.out.println("Please check that your file exists.")
  }
} catch {
  case e: Exception => println("Could not download file locally: " + e.getMessage)
}
println("...done.\n")
{% endhighlight %}

This will get the image as binary data, saving it to the variable `imageData`, which might be useful when writing algorithms that are part of an image processing pipeline.

If the file was text (an image, etc.), you could instead use the function `getString` to retrieve the file's content as a string. For more methods on how to get a file from a data collection using the Data API go to the [API Specification](/developers/api/#get-a-file-or-directory).

## Additional Functionality

In addition to the functionality covered in this guide, the Java Client Library provides a complete interface to the Algorithmia platform, including [managing algorithms](/developers/algorithm-development/algorithm-management), administering [organizations](/developers/platform/organizations), and working with [source control](/developers/algorithm-development/source-code-management). You can also visit the [API Docs](/developers/api) to view the complete API specification.

## Next Steps

If you're a data scientist or developer who will be building and deploying new algorithms, you can move on to the [Algorithm Development > Getting Started](/developers/algorithm-development/your-first-algo/) guide.
