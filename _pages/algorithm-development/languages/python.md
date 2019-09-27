---
layout: article
title:  "Python"
excerpt: "Build your algorithm in Python"
categories: languages
tags: [algo-guide-lang]
show_related: true
author: steph_kim
image:
    teaser: /language_logos/python.svg
---

Before you get started learning about Python algorithm development, make sure you go through our <a href="{{site.baseurl}}/algorithm-development/algorithm-basics/your-first-algo">Getting Started Guide</a> to learn how to create your first algorithm, understand permissions available, versioning, using the CLI, and more.

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

Algorithmia makes a number of libraries available to make algorithm development easier.  We support four Python versions, with more to come:

1. <a href="https://docs.python.org/2/">Python 2.7.13 language and standard library</a>, for both CPU and GPU algorithms
2. <a href="https://docs.python.org/3/">Python 3.5.3 language and standard library</a>, CPU and GPU
3. Python 3.6.8, CPU and GPU, plus a preinstalled TensorFlow 1.12 option (found under the `Python 3.x - Beta` Language selection)
4. Python 3.7.1, CPU and GPU (found under the `Python 3.x - Beta` Language selection)

We'll continue to add variants as needed, and broaden GPU support.

You can utilize common Python libraries such as <a href ="{{site.baseurl}}/model-deployment/scikit/">Scikit-learn</a>, <a href ="{{site.baseurl}}/model-deployment/tensorflow/">Tensorflow</a>, Numpy and many others by adding them as a dependency in your algorithm.

Also, algorithms can call other algorithms and manage data on the Algorithmia platform. To find out more
via the <a href="{{site.baseurl}}/clients/python">Algorithmia Python Client</a>.

## Write your First Algorithm

If you've followed the <a href="{{site.baseurl}}/algorithm-development/algorithm-basics/your-first-algo">Getting Started Guide</a>, you'll notice in your algorithm editor, there is boilerplate code that returns "Hello" and whatever you input to the console.

The main thing to note about the algorithm is that it's wrapped in the apply() function.

The apply() function defines the input point of the algorithm. We use the apply() function in order to make different algorithms standardized. This makes them easily chained and helps authors think about designing their algorithms in a way that makes them easy to leverage and predictable for end users.
{: .notice-info}

Go ahead and remove the boilerplate code below that's inside the apply() function because we'll be writing a different algorithm in this tutorial:

<img src="{{site.baseurl}}/images/post_images/algo_dev_lang/algorithm_console_python.png" alt="Algorithm console Python" class="screenshot">


## Managing Dependencies

Algorithmia supports adding 3rd party dependencies via the <a href="https://pypi.python.org/pypi">Python Package Index (PyPI)</a> using a requirements.txt file.

On the algorithm editor page there is a button on the top right that says "Dependencies". Click that button and you'll see a modal window:

<img src="{{site.baseurl}}/images/post_images/algo_dev_lang/dependencies_python.png" alt="Python Dependency File" class="screenshot img-md">

If you have any dependencies you can add them by typing in the package name to the `requirements.txt` file.

This guide won't depend on any external dependencies so you can close the dependencies window.

If you do add dependencies, you will still need to import those packages via the import statement to your algorithm file as you would do for any Python script.
{: .notice-info}

For example, to make use of numpy, you would include the line:

`numpy`

in the dependencies file and the line

`import numpy as np`

in the main file.

If you're using Python 3, the syntax has changed for imports. You'll need to use:
`from .somefile import *` instead of in Python 2 where it's `from file import *`.
{: .notice-warning}

## I/O for your Algorithms

Now let's get started on the hands-on portion of the guide:

The first algorithm that we'll create will take a JSON formatted object passed as input by the user which is deserialized into a Python dictionary before the algorithm is called.

It will output a JSON formatted object which the user will consume with an API call to the algorithm path.

This path is based on your Algorithmia user name and the name of your algorithm, so if you are “AdaDeveloper” and your algorithm is “TokenizeText”, then the path for version 0.1.1 of your algorithm will be AdaDeveloper/TokenizeText/0.1.1

### Working with Basic Data Structures

Below is a code sample showing how to create an algorithm working with basic user input.

You'll also see some error handling within the algorithm, but we recommend that you take a look at our <a href="{{site.baseurl}}/algorithm-development/algorithm-basics/algorithm-errors">Better Error Handling Guide</a> for more information.

{% highlight python %}
import Algorithmia

# Note that you don't pass in your API key when creating an algorithm
client = Algorithmia.client()


class AlgorithmError(Exception):
    """Define error handling class."""

    def __init__(self, value):
        self.value = value

    def __str__(self):
        return repr(self.value).replace("\\n", "\n")


def apply(input):
    """Finds the minimum and maximum numbers in a list."""

    # Check for numbers field and make sure it contains a list.
    if "numbers" in input and isinstance(input["numbers"], list):
        # Get the value of the field "numbers"
        user_list = input.get("numbers")
        try:
            user_max = max(user_list)
            user_min = min(user_list)
            return {"min_num": user_min, "max_num": user_max}
        except TypeError as e:
            print("Please use numeric data types in your list: ", e)
    else:
        # Raise helpful error message
        raise AlgorithmError(
            "Please provide a valid input that includes an array of numbers in the field 'numbers'")

{% endhighlight %}

Go ahead and type or paste the code sample above in the Algorithmia code editor after removing the "Hello World" code.

Now compile the new code sample and when that's done test the code in the console by passing in the input and hitting enter on your keyboard:

{% highlight python %}
{"numbers": [1, 4, 2, 6, 3]}
{% endhighlight %}

You should see the minimum and maximum of the numbers in the list returned in the console:
{% highlight python %}
{"max_num":6, "min_num":1}
{% endhighlight %}

### Working with Data Stored on Algorithmia

This next code snippet shows how to create an algorithm working with a data file that a user has stored using Algorithmia's [Hosted Data Source]({{site.baseurl}}/data/hosted).

While users who consume an algorithm have access to both Dropbox and Amazon S3 connectors, algorithm developers can only use the Algorithmia [Hosted Data Source]({{site.baseurl}}/data/hosted) to host data for algorithm development.
{: .notice-warning}

#### Prerequisites
If you wish to follow along working through the example yourself, create a text file that contains any unstructured text such as a chapter from a public domain book or article. We used a chapter from [Burning Daylight, by Jack London](https://en.wikisource.org/wiki/Burning_Daylight) which you can copy and paste into a text file. Or copy and paste it from here: <a href="{{site.baseurl}}/data_assets/burning_daylight.txt">Chapter One Burning Daylight, by Jack London</a>. Then you will can upload it into one of your [Data Collections](/data/hosted).

This example shows how to create an algorithm that takes a user's file which is stored in a data collection on the Algorithmia platform. It then splits up the text into sentences and then splits those sentences up into words:

{% highlight python %}
import Algorithmia

# Note that you don't pass in your API key when creating an algorithm
client = Algorithmia.client()

class AlgorithmError(Exception):
  """Define error handling class."""

    def __init__(self, value):
        self.value = value

    def __str__(self):
        return repr(self.value).replace("\\n", "\n")

def apply(input):
    """Take a user file holding text content and returns text split into words."""

    # Check if the file exists in the user specified data collection.
    if "user_file" in input and client.file(input["user_file"]).exists():
        user_file = input["user_file"]
        # Get the contents of the file as a string.
        text = client.file(user_file).getString()
        # Split text into lists of sentences
        sentences = text.split(".")
        # Split up each sentence into words.
        words = [item.split(" ") for item in sentences if len(item) > 0]
        # Return dictionary of original text and the sentences broken up into their separate words.
        return {"text": text, "words": words}
    else:
      # Raise helpful error message
      raise AlgorithmError("Please provide a valid input")
{% endhighlight %}

After you paste the above code into the Algorithmia code editor you can compile and then test the example by passing in a file that you've hosted in [Data Collections](/data/hosted).

Following the example below replace the path to your data collection with your user name (it will appear already if you are logged in), data collection name, and data file name which you can find under "My Collections" in [Data Collections](/data/hosted):

{% highlight python %}
{"user_file": "data://YOUR_USERNAME/data_collection_dir/data_file.txt"}
{% endhighlight %}

The code above with return both the original text and the list of each sentence split up into words.

This guide uses a chapter from the public domain book [Burning Daylight, by Jack London](https://en.wikisource.org/wiki/Burning_Daylight), but for brevity we'll only show the first sentence in "text" and "words":

{% highlight python %}
{"text": "It was a quiet night in the Shovel.", "words": [['It', 'was', 'a', 'quiet', 'night', 'in', 'the', 'Shovel']]}
{% endhighlight %}

When you are creating an algorithm be mindful of the data types you require from the user and the output you return to them. Our advice is to create algorithms that allow for a few different input types such as a file, a sequence or a URL.
{: .notice-info}

### Writing files for the user to consume

Sometimes it is more appropriate to write your output to a file than to return it directly to the caller.  In these cases, you may need to create a temporary file, then copy it to a [Data URI](http://docs.algorithmia.com/#data-api-specification) (usually one which the caller specified in their request, or a [Temporary Algorithm Collection]({{site.baseurl}}/data/hosted#temporary-algorithm-collections)):

{% highlight python %}
# {"target_file":"data://username/collection/filename.txt"}
file_uri = input["target_file"]
tempfile = "/tmp/"+uuid.uuid4()+".tmp"
save_some_output_to(tempfile)
client.file(file_uri).putFile(tempfile)
{% endhighlight %}

### Calling Other Algorithms and Managing Data

To call other algorithms or manage data from your algorithm, use the <a href="{{site.baseurl}}/clients/python">Algorithmia Python Client</a> which is automatically available to any algorithm you create on the Algorithmia platform. For more detailed information on how to work with data see the [Data API docs](http://docs.algorithmia.com/).

You may call up to {{site.data.stats.platform.max_num_parallel_algo_requests}} other algorithms, either in parallel or recursively.

Here is an example of creating an algorithm that relies on data from another algorithm:

{% highlight python %}
import Algorithmia

# Note that you don't pass in your API key when creating an algorithm
client = Algorithmia.client()


class AlgorithmError(Exception):
    """Define error handling class."""

    def __init__(self, value):
        self.value = value

    def __str__(self):
        return repr(self.value).replace("\\n", "\n")


def scrape_web(input):
    """Call algorithm that returns main text content from a URL."""

    algo = client.algo("util/Url2Text/0.1.4")
    if "URL" in input and input["URL"].startswith("http://") or input["URL"].startswith("https://"):
        response = algo.pipe(input["URL"]).result
        return response
    else:
        # Raise helpful error message
        raise AlgorithmError("Please provide a valid URL")

def apply(input):
    """Take user input of URL and return text split up as words."""

    text = scrape_web(input)
    # Split text into lists of sentences
    sentences = text.split(".")
    # Split up each sentence into words.
    words = [item.split(" ") for item in sentences if len(item) > 0]
    return words
{% endhighlight %}

Go ahead and try the above code sample in the Algorithmia code editor and then type the input into the console:
{% highlight python %}
{"URL": "http://github.com"}
{% endhighlight %}

This returns a list of words:

<img src="{{site.baseurl}}/images/post_images/algo_dev_lang/tokenize_url.png" alt="Run basic algorithm in console" class="screenshot">

As you can see from these examples, fields that are passed into your algorithm by the user such as scalar values and sequences such as lists, dictionaries, tuples and bytearrays (binary byte sequence such as an image file) can be handled as you would any Python data structure within your algorithm.

For an example that takes and processes image data check out the [Places 365 Classifier's source code](https://algorithmia.com/algorithms/deeplearning/Places365Classifier).

## Error Handling

In the above code examples we showed how to create an AlgorithmError class which you should use for handling errors within your algorithm. This way the user can tell the difference between a standard Python library error and an error thrown by your algorithm:

{% highlight python %}
class AlgorithmError(Exception):
  """Define error handling class."""

    def __init__(self, value):
        self.value = value

    def __str__(self):
        return repr(self.value).replace("\\n", "\n")
{% endhighlight %}

And then raise the error with a helpful error message:

{% highlight python %}
raise AlgorithmError("Please provide a valid URL")
{% endhighlight %}

If you are creating an algorithm that relies on calling another algorithm you may use Algorithmia error messages for catching errors thrown by that algorithm:

{% highlight python %}
import Algorithmia

client = Algorithmia.client()
# An algorithm that takes a URL
algo = client.algo("util/Url2Text/0.1.4")

try:
  	print(algo.pipe(input).result)
except Exception as error:
    print(error)
{% endhighlight %}

For more information on error handling see the <a href="{{site.baseurl}}/algorithm-development/algorithm-basics/algorithm-errors">Better Error Handling Guide</a>.

## Algorithm Checklist

Before you are ready to publish your algorithm it's important to go through this [Algorithm Checklist]({{site.baseurl}}/algorithm-development/algorithm-checklist) and check out this blog post for <a href="https://blog.algorithmia.com/advanced-algorithm-design/">Advanced Algorithm Development <i class="fa fa-external-link"></i></a>.

Both links will go over important best practices such as how to create a good algorithm description, add links to external documentation and other important information.

## Publish Algorithm

Once you've developed your algorithm, you can publish it and make it available for others to use.

To learn how to publish your algorithm: <a href="{{site.baseurl}}/algorithm-development/your-first-algo">creating and publishing your algorithm</a>

## Caveats
#### Algorithms with multiple files
Putting everything in one source file sometimes doesn't make sense and makes stuff hard to maintain, many times you'll want to break your code into multiple source files.

Importing your secondary files contains some ceavats when
executing your algorithm on Algorithmia, in particular the import paths you use locally may vary from ours.

This means that if your project looks like this:
```
/
 requirements.txt
 algorithmia.conf
 src /
      __init__.py
      main_file.py
      secondary_file.py
      sub_module /
                  __init__.py
                  special_stuff.py

```
with main_file being your main python module, your import code might look something like this:
```python
import Algorithmia
import os
from secondary_file import auxillary_func, some_other_func
from sub_module.special_stuff import special_stuff
```
This will work fine for Python 2.  However, for Python 3, you need to use the [dot-prefix notation](https://docs.python.org/3/reference/import.html#submodules) for local files:

```python
import Algorithmia
import os
from .secondary_file import auxillary_func, some_other_func
from .sub_module.special_stuff import special_stuff
```


## Conclusion and Resources

In this guide we covered how to create an algorithm, work with different types of data and learned how to publish an algorithm.

For more resources:

* <a href="{{site.baseurl}}/clients/python">Algorithmia Client Python Docs</a>
* [Hosted Data Source]({{site.baseurl}}/data)
* [Algorithmia API Docs](http://docs.algorithmia.com/?python)
* <a href="https://docs.python.org/2.7/">Python 2.7 Docs <i class="fa fa-external-link"></i></a>
* <a href="https://docs.python.org/3/">Python 3 Docs <i class="fa fa-external-link"></i></a>
