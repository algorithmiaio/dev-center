---
layout: article
title:  "Python Algorithm Development"
excerpt: "Build your algorithm in Python"
date: 2016-05-17  09:50:46
permalink: /algorithm-development/client-guides/python
redirect_from:
  - /algorithm-development/guides/python/
  - /algorithm-development/guides/python-guide/
tags: [algo-guide-lang]
show_related: true
author: steph_kim
image:
    teaser: /language_logos/python.png
---

Algorithmia supports algorithm development in Python.

### Available APIs

Algorithmia makes a number of libraries available to make algorithm development easier.
The full <a href="https://docs.python.org/2/">Python 2 language and standard library</a> and <a href="https://docs.python.org/3/">Python 3 language and standard library</a>
is available for you to use in your algorithms. Furthermore, algorithms can call other algorithms and manage data on the Algorithmia platform
via the <a href="http://developers.algorithmia.com/application-development/client-guides/python/">Algorithmia Python Client</a>.

### Managing Dependencies

Algorithmia supports adding 3rd party dependencies via the <a href="https://pypi.python.org/pypi">Python Package Index (PyPI)</a> using a requirements.txt file. On the algorithm editor page, click Options and select Manage Dependencies.

Add dependencies by adding the package name to the `requirements.txt` file.

Note that you will still need to include an import statement to your algorithm file. For example, to make use of numpy, you would include the line

`numpy`

in the dependencies file and the line

`import numpy as np`

in the main file.

### I/O for Your Algorithms:

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


Here is a more complete example of creating an algorithm working with a data file that a user has stored using the [Data Portal](https://algorithmia.com/data). While users who consume an algorithm have access to both Dropbox and Amazon S3 connectors, algorithm developers can only use the Algorithmia [Hosted Data Source](http://developers.algorithmia.com/algorithm-development/data-sources/hosted-data-guide/) to host data for algorithm development:

{% highlight python %}
import Algorithmia

# Note that you don't pass in your API key when creating an algorithm
client = Algorithmia.client()

def apply(input):
    """ Take user input text file and return tokenized text"""
    # Check if file exists and get the contents as a string
    if client.file(input).exists():
        corpus = client.file(input).getString()
        # Split text into lists of sentences
        sentences = corpus.split(".")
        # Tokenize each sentence
        tokens = [item.split(" ") for item in sentences if len(item) > 0]
        return tokens
{% endhighlight %}

A user would call this algorithm like this:
{% highlight python %}
apply("data://user_name/data_collection_dir/data_file.txt")
{% endhighlight %}


**NOTE:** When you are creating an algorithm be mindful of the data types you require from the user and the output you return to them. Our advice is to create algorithms that allow for a few different input types such as a file, a sequence or a URL.

### Calling Other Algorithms and Managing Data

To call other algorithms or manage data from your algorithm, use the <a href="http://developers.algorithmia.com/application-development/client-guides/python/">Algorithmia Python Client</a> which is automatically available to any algorithm you create on the Algorithmia platform. For more detailed information on how to work with data see the [Data API docs](http://docs.algorithmia.com/) and learn about Algorithmia's [Hosted Data Source](http://developers.algorithmia.com/algorithm-development/data-sources/hosted-data-guide/).

Here is an example of creating an algorithm that relies on data from another algorithm:
{% highlight python %}
import Algorithmia

# Note that you don't pass in your API key when creating an algorithm
client = Algorithmia.client()

def scrape_web(input):
    """Call algorithm that returns main text content from a URL."""
    algo = client.algo("util/Url2Text/0.1.4")
    response = algo.pipe(input).result
    return response


def apply(input):
    """Take user input of URL and return text as tokens."""
    corpus = scrape_web(input)
    # Split text into lists of sentences
    sentences = corpus.split(".")
    # Tokenize each sentence
    tokens = [item.split(" ") for item in sentences if len(item) > 0]
    return tokens
{% endhighlight %}

The user would call the algorithm like this:
{% highlight python %}
apply("http://github.com")
{% endhighlight %}

**NOTE:** When designing your algorithm, don't forget that there are special data directories, `.session` and `.algo`, that are available only to algorithms to help you manage data over the course of the algorithm execution.

### Error Handling

Here is an example of a simple error handling message:

{% highlight python %}
while True:
    try:
        x = int(input)
        break
    except ValueError as e:
     	print('Invalid input, please enter a number', e)
{% endhighlight %}

If you are creating an algorithm that relies on calling another algorithm you may use Algorithmia error messages:

{% highlight python %}
import Algorithmia

client = Algorithmia.client()
# An algorithm that takes a URL
algo = client.algo("util/Url2Text/0.1.4")

try:
    response = algo.pipe(input).result
    print(response)
except:
    print(algo.pipe(input).error.message)
{% endhighlight %}

For more information on error handling see the [API Docs](http://docs.algorithmia.com/?python#error-handling).

### Additional Resources

* <a href="http://developers.algorithmia.com/clients/python/">Algorithmia Client Python Docs <i class="fa fa-external-link"></i></a>
* <a href="https://docs.python.org/2.7/">Python 2.7 Docs</a>