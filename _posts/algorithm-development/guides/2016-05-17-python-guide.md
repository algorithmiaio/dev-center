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

Welcome to algorithm development in Python.

This guide will take you through the steps to getting started in algorithm development and cover the basics of managing dependencies, working with various types of inputs and outputs, calling other algorithms and managing data.

By the end of the guide you will see how to develop a couple of simple algorithms and you'll be ready to start contributing to the algorithm marketplace.

## Available Libraries

Algorithmia makes a number of libraries available to make algorithm development easier.

The full <a href="https://docs.python.org/2/">Python 2 language and standard library</a> and <a href="https://docs.python.org/3/">Python 3 language and standard library</a>
is available for you to use in your algorithms.

Also, you can utilize common Python libraries such as Scikit-Learn, Tensorflow, Numpy and many others by adding them as a dependency in your algorithm.

Furthermore, algorithms can call other algorithms and manage data on the Algorithmia platform
via the <a href="http://developers.algorithmia.com/application-development/client-guides/python/">Algorithmia Python Client</a>.

## Create an Algorithm

Let's start by creating an algorithm. First navigate to [Algorithmia](https://algorithmia.com) and by hovering over "More" you'll see a dropdown with a purple button that says "Add Algorithm". Go ahead and click that button.

<img src="/images/post_images/algo_dev_lang/add_algorithm_nav.png" alt="Add algorithm navigation" class="screenshot">

Now you'll see a form to fill out to create your algorithm which we'll go through step by step below:

<img src="/images/post_images/algo_dev_lang/create_algorithm_python.png" alt="Create an algorithm in Python" class="screenshot">

**Algorithmia Name:** The first thing you'll notice in the form is the field "Algorithm Name" which will be the name of your algorithm. You'll want to name your algorithm something descriptive based on what the algorithm does.

For example this guide shows how to create an algorithm that splits text up into words which is called tokenizing in natural language processing. So, this example algorithm is called "Tokenize Text", but go ahead and name your algorithm according to what your code does.

**Algorithm ID:** The unique AlgoURL path users will use to call your algorithm.

**Language:** Next you'll pick the language of your choice. This is the Python guide and this algorithm uses Python 3.

**Source Code:** Because we want to make this algorithm open source and available for everyone to view the source code, we'll choose "Open Source".

**Special Permissions:** Next is the "Special Permissions" section that allows your algorithm to have access to the internet and allows it to call other algorithms. In this example we'll want access to the internet and since our final algorithm will call another algorithm we want to select "Can call other algorithms" as well.

Also under Special Permissions, you can select "Standard execution environment" or "Advanced GPU". Since our algorithm isn't processing large amounts of data needed to run on a GPU environment, we'll select "Standard execution environment".

**Note:** You can find out more about licensing, algorithm permissions and GPU's check out the [Algorithm Basics Section](http://developers.algorithmia.com/basics/algorithm_basics/).

Now hit the "Create" button on the bottom lower right of the form and you should see the algorithm console for your newly created algorithm:

<img src="/images/post_images/algo_dev_lang/algorithm_console_python.png" alt="Algorithm console Python" class="screenshot">

## Managing Dependencies

Now that you have created your algorithm, you can add dependencies.

Algorithmia supports adding 3rd party dependencies via the <a href="https://pypi.python.org/pypi">Python Package Index (PyPI)</a> using a requirements.txt file. 

On the algorithm editor page there is a button on the top right that says "Dependencies". Click that button and you'll see a modal window:

<img src="/images/post_images/algo_dev_lang/dependencies_python.png" alt="Algorithm console Python" class="screenshot">

If you have any dependencies you can add them by typing in the package name to the `requirements.txt` file.

This guide won't depend on any external dependencies so you can close the dependencies window.

**Note:** If you did add any dependencies, you would still need to include an import statement to your algorithm file as you would do for any Python script. 

For example, to make use of numpy, you would include the line:

`numpy`

in the dependencies file and the line

`import numpy as np`

in the main file.

## Write your First Algorithm

As you can see in your algorithm editor, there is a basic algorithm already written that takes a string as input and returns the string "Hello" followed by the user input.

To run this algorithm first hit the "Compile" button on the top right hand corner of the algorithm editor and then at the bottom of the page in the console you'll see a confirmation that it has compiled and the will say the version number.

Now to test it out, in the console type your name or another string and hit enter on your keyboard:


<img src="/images/post_images/algo_dev_lang/run_default_algo.png" alt="Run basic algorithm in console Python" class="screenshot">


**Note:** If you are interested in learning more about versioning check out the [Algorithm Basics Section](http://developers.algorithmia.com/basics/algorithm_basics/).


## I/O for Your Algorithms

Now that you've compiled and ran a basic algorithm in the console, we'll briefly go through some of the basic inputs and outputs you would expect to work with when creating an algorithm.

This section will show how to create an algorithm that takes a Python dictionary. The user will pass in a JSON formatted object which is deserialized into a Python dictionary before your algorithm is called.

This example shows how to find the minimum and maximum of a list of numbers that the user passes in when calling your algorithm:

{% highlight python %}
import Algorithmia

# Note that you don't pass in your API key when creating an algorithm
client = Algorithmia.client()

def apply(input):
  """Finds the minimum and maximum numbers in a list."""

  # Check for numbers field and make sure it contains a list.
  if "numbers" in input and isinstance(input['numbers'], list):
    # Get the value of the field "numbers"
    user_list = input.get("numbers")
    user_max = max(user_list)
    user_min = min(user_list)
    return {"min_num": user_min, "max_num": user_max}
  else:
    # Raise helpful error message
    raise AlgorithmError("Please provide a valid input that includes an array of numbers in the field 'numbers'")

{% endhighlight %}

You can try this example in your algorithm editor for fun, compile it and test it:

<img src="/images/post_images/algo_dev_lang/min_max_algorithm.png" alt="Run min_max algorithm in console" class="screenshot">

**Note:** Fields that are passed into your algorithm by the user such as scalar values and sequences such as lists, dictionaries, tuples and bytearrays (binary byte sequence such as an image file) can be handled as you would any Python data structure within your algorithm.

For an example that takes and processes image data check out the [Places 365 Classifier's source code](https://algorithmia.com/algorithms/deeplearning/Places365Classifier).

This next algorithm shows how to create an algorithm working with a data file that a user has stored using the [Data Portal](https://algorithmia.com/data). 

**Note:** While users who consume an algorithm have access to both Dropbox and Amazon S3 connectors, algorithm developers can only use the Algorithmia [Hosted Data Source](http://developers.algorithmia.com/algorithm-development/data-sources/hosted-data-guide/) to host data for algorithm development.

This example shows how to create an algorithm that takes a users file stored in a data collection on the Algorithmia platform and tokenizes the text:

{% highlight python %}
import Algorithmia

# Note that you don't pass in your API key when creating an algorithm
client = Algorithmia.client()

def apply(input):
    """Take a user file holding text content and return tokenized text."""

    # Check if the file exists in the user specified data collection.
    if "user_file" in input and client.file(input["user_file"]).exists():
        user_file = input["user_file"]
        # Get the contents of the file as a string.
        corpus = client.file(user_file).getString()
        # Split text into lists of sentences
        sentences = corpus.split(".")
        # Tokenize each sentence
        tokens = [item.split(" ") for item in sentences if len(item) > 0]
        # Return dictionary of original text and the tokenized text.
        return {"corpus": corpus, tokens": tokens}
    else:
      # Raise helpful error message
      raise AlgorithmError("Please provide a valid input")
{% endhighlight %}

A user would access the algorithm passing in this as input:
{% highlight python %}
{"user_file": "data://user_name/data_collection_dir/data_file.txt"}
{% endhighlight %}

**NOTE:** When you are creating an algorithm be mindful of the data types you require from the user and the output you return to them. Our advice is to create algorithms that allow for a few different input types such as a file, a sequence or a URL.

## Calling Other Algorithms and Managing Data

To call other algorithms or manage data from your algorithm, use the <a href="http://developers.algorithmia.com/application-development/client-guides/python/">Algorithmia Python Client</a> which is automatically available to any algorithm you create on the Algorithmia platform. For more detailed information on how to work with data see the [Data API docs](http://docs.algorithmia.com/) and learn about Algorithmia's [Hosted Data Source](http://developers.algorithmia.com/algorithm-development/data-sources/hosted-data-guide/).

Here is an example of creating an algorithm that relies on data from another algorithm:

{% highlight python %}
import Algorithmia

# Note that you don't pass in your API key when creating an algorithm
client = Algorithmia.client()

def scrape_web(input):
    """Call algorithm that returns main text content from a URL."""
    algo = client.algo("util/Url2Text/0.1.4")
    if "URL" in input and input["URL"].startswith("http://) or input["URL"].startswith("https://):
      response = algo.pipe(input).result
      return response
    else:
      # Raise helpful error message
      raise AlgorithmError("Please provide a valid URL")


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
{"URL": http://github.com"}
{% endhighlight %}

**NOTE:** When designing your algorithm, don't forget that there are special data directories, `.session` and `.algo`, that are available only to algorithms to help you manage data over the course of the algorithm execution. 

## Error Handling

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

## Additional Resources

* <a href="http://developers.algorithmia.com/clients/python/">Algorithmia Client Python Docs <i class="fa fa-external-link"></i></a>
* <a href="https://docs.python.org/2.7/">Python 2.7 Docs</a>