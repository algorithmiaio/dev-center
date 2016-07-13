---
layout: article
title:  "Python Algorithm Development"
excerpt: "Build your algorithm in Python"
date: 2016-05-17  09:50:46
permalink: /algorithm-development/client-guides/python
tags: [algo-guide-lang]
show_related: true
author: steph_kim
image:
    teaser: /language_logos/python.png
---

Algorithmia supports algorithm development in Python.

#### Available APIs

Algorithmia makes a number of libraries available to make algorithm development easier.
The full <a href="https://docs.python.org/2/">Python 2 language and standard library</a> and <a href="https://docs.python.org/3/">Python 3 language and standard library</a>
is available for you to use in your algorithms. Furthermore, algorithms can call other algorithms and manage data on the Algorithmia platform
via the <a href="http://developers.algorithmia.com/application-development/client-guides/python/">Algorithmia Python Client</a>.

#### Managing Dependencies

Algorithmia supports adding 3rd party dependencies via the <a href="https://pypi.python.org/pypi">Python Package Index (PyPI)</a> using a requirements.txt file. On the algorithm editor page, click Options and select Manage Dependencies.

Add dependencies by adding the package name to the `requirements.txt` file.

Note that you will still need to include an import statement to your algorithm file. For example, to make use of numpy, you would include the line

`numpy`

in the dependencies file and the line

`import numpy as np`

in the main file.

#### I/O for Your Algorithms:

Datatypes that are either sequences that you don't wish to iterate over such as strings, or inputs that are scalar in nature such as numeric data types can be accessed via input.

{% highlight python %}
import Algorithmia

def apply(input):
    assert isinstance(input, basestring)
    return input
{% endhighlight %}

A string input:

{% highlight python %}
input_string = "It's just a flesh wound."
{% endhighlight %}

Inputs that are sequences such as: lists, dictionaries, tuples and bytearrays (binary byte sequence such as an image file) can be handled as you would any Python sequence. For example:

{% highlight python %}
import Algorithmia

def apply(input):
    assert isinstance(input, list)
    return 'Hello ' + input[0]
{% endhighlight %}

Here is an example of a list input:

{% highlight python %}
input_list = ["Knights Who Say Ni", "Killer Rabbit of Caerbannog"]
{% endhighlight %}

Which will return:

`"Hello Knights Who Say Ni"`

When you are creating an algorithm that takes input from other algorithms it's important to understand the data types your algorithm ingests and be thoughtful of the data types you output that others will ingest as input.

#### Calling Other Algorithms and Managing Data

To call other algorithms or manage data from your algorithm, use the <a href="http://developers.algorithmia.com/application-development/client-guides/python/">Algorithmia Python Client</a> which is automatically available to any algorithm you create on the Algorithmia platform.

When designing your algorithm, don't forget that there are special data directories, `.session` and `.algo`, that are available only to algorithms to help you manage data over the course of the algorithm execution.

#### Error Handling

`raise NameError('Invalid graph structure')`

Exceptions will be returned as JSON, of the form:

{% highlight json %}
{
  "error": {
    "message": "Error running algorithm",
    "stacktrace": ...
  }
}
{% endhighlight %}

Algorithms can throw any exception, and they will be returned as an error via the Algorithmia API. If you want to throw a generic exception message, use an `AlgorithmException`.

#### Additional Resources

* <a href="http://developers.algorithmia.com/clients/python/">Algorithmia Client Python Docs <i class="fa fa-external-link"></i></a>
* <a href="https://docs.python.org/2.7/">Python 2.7 Docs</a>