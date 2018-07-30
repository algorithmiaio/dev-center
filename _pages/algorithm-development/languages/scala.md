---
layout: article
title:  "Scala"
excerpt: "Build your algorithm in Scala"
categories: languages
tags: [algo-guide-lang]
show_related: true
author: steph_kim
image:
    teaser: /language_logos/scala.svg
---

Before you get started learning about Scala algorithm development, make sure you go through our <a href="{{ site.baseurl }}/algorithm-development/algorithm-basics/your-first-algo/">Getting Started Guide</a> to learn how to create your first algorithm, understand permissions available, versioning, using the CLI, and more.

#### Available APIs

Algorithmia makes a number of libraries available to make algorithm development easier.
The full <a href="http://docs.oracle.com/javase/8/docs/technotes/guides/language/index.html">Java 8 language and standard library</a>
is available for you to use in your algorithms. Furthermore, algorithms can call other algorithms and manage data on the Algorithmia platform
via the <a href="{{ site.baseurl }}/clients/scala">Algorithmia Scala Client</a>.

#### Managing Dependencies

Algorithmia supports adding 3rd party dependencies via Maven packages. Specifically, any packages from <a href="http://search.maven.org/">Maven Central</a> can be added to algorithms.
On the algorithm editor page, click Options and select Manage Dependencies.

Add dependencies by adding lines of the following form:

`libraryDependencies += GroupID % ArtifactID % Version`

For example, to add Apache Commons Math version 3.4.1:

`libraryDependencies += "org.apache.commons" % "commons-math3" % "3.4.1"`

#### Automatic JSON parsing

{% highlight scala %}
package algorithmia.Example

import com.algorithmia._
import com.algorithmia.algo._
import com.algorithmia.data._

class Example {
  def apply(dict: Map[String,String], key: String): String = {
    dict(key)
  }
}
{% endhighlight %}

By default, Algorithmia uses Google's [GSON](https://code.google.com/p/google-gson/) library for converting JSON to and from native Java objects. You can specify the input and output types of your algorithm simply by setting the parameters and return type of your `apply()` method.

GSON is a pure java library and does not support many scala native types. For example, List[Int] does not automatically parse, but Array[Int] will. This is because Array in scala is actually a Java array. Similarly, java.util.Map will parse correctly, but scala.collection.Map will not.
{: .notice-info}

This example shows a function that takes two parameters, a Map from Strings to Strings (dict) and another String (key), and returns another String.

Algorithmia can automatically parse many types of native Java objects to and from JSON: Integers, Lists, Arrays, Maps, and many others. In many cases it can also parse arbitrary user-defined Java Classes to and from JSON. See the [Gson User Guide](https://sites.google.com/site/gson/gson-user-guide) for reference.

<aside class="notice">
  Note: Binary data is passed using <code>byte[]</code>
</aside>

#### Custom JSON parsing
If you want more control over parsing, then use a single apply method accepting a <code>String</code> and give it the <code>@AcceptsJson</code> annotation (from the <code>com.algorithmia.algo</code> package).

{% highlight scala %}
package algorithmia.Example

import com.algorithmia._
import com.algorithmia.algo._
import com.algorithmia.data._

class Example {
  @AcceptsJson
  def apply(jsonString: String): String = {
    // Do JSON parsing here
  }
}
{% endhighlight %}

<aside class="class">
If you have more than 1 apply method, or your apply method does not take a <code>String</code> as an argument then you will receive an error message at runtime.  Also note that passing in a String <code>"foo"</code> becomes serialized to JSON like <code>"\"foo\""</code>.
</aside>

On the other hand, if GSON doesn't serialize your output response to JSON correctly (or you want to do some custom serialization) you can add an <code>@ReturnsJson</code> to your apply method and return a serialized JSON String.

{% highlight scala %}
package algorithmia.Example

import com.algorithmia._
import com.algorithmia.algo._
import com.algorithmia.data._

class Example {
  @ReturnsJson
  def apply(foo: String, bar: String): String = {
    // Do some work
    // Return a JSON string
  }
}
{% endhighlight %}

<aside class="notice">
If you use <code>@ReturnsJson</code> but don't return a valid JSON string, your algorithm will return a JSON parsing error.
</aside>

#### Advanced Serialization Techniques
Not every algorithm is stateless, and sometimes you need to preserve state in the data API. Ensuring that your algorithm state can be downloaded and deserialized quickly and efficiently is critical for ensuring that your algorithm executes in a reasonable time frame.

For state serialization in scala, we recommend [boopickle](https://github.com/suzaku-io/boopickle/) as it allows you to serialize and deserialize into binary faster than any equivalent json parser, and serializes to a much smaller footprint than the equivalent JSON.

#### Error Handling

{% highlight scala %}
throw new AlgorithmException("Invalid graph structure")
{% endhighlight %}

Algorithms can throw any exception, and they will be returned as an error via the Algorithmia API. If you want to throw a generic exception message, use an `AlgorithmException`.

#### Writing files for the user to consume
 
Sometimes it is more appropriate to write your output to a file than to return it directly to the caller.  In these cases, you may need to create a temporary file, then copy it to a [Data URI](http://docs.algorithmia.com/#data-api-specification) (usually one which the caller specified in their request, or a [Temporary Algorithm Collection](https://algorithmia.com/developers/data/hosted#temporary-algorithm-collections)):
 
{% highlight scala %}
val file_uri = "data://username/collection/filename.txt"
val tempfile = new File("/tmp/"+uuid()+".tmp")
save_some_output_to(tempfile)
client.file(file_uri).putFile(tempfile)
{% endhighlight %}

### Calling Other Algorithms and Managing Data

To call other algorithms or manage data from your algorithm, use the <a href="{{ site.baseurl }}/clients/scala">Algorithmia & Scala</a> which is automatically available to any algorithm you create on the Algorithmia platform. For more detailed information on how to work with data see the [Data API docs](http://docs.algorithmia.com/) and learn about Algorithmia's [Hosted Data Source](http://developers.algorithmia.com/algorithm-development/data-sources/hosted-data-guide/).

When designing your algorithm, don't forget that there are special data directories, `.session` and `.algo`, that are available only to algorithms to help you manage data over the course of the algorithm execution.

You may call up to 24 other algorithms, either in parallel or recursively.

<aside class="warning">
Some older algorithms use our deprecated Java client. If it has an import from the <code>algorithmia</code> package instead of the <code>com.algorithmia</code> package, that means it is using the deprecated client.
</aside>


#### Additional Resources

* <a href="{{ site.baseurl }}/clients/java">Algorithmia Client Java Docs <i class="fa fa-external-link"></i></a>
* <a href="http://docs.oracle.com/javase/8/docs/api/">Java 8 JDK API</a>
