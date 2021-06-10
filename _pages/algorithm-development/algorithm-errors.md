---
author: besir
categories: algorithm-development
excerpt: "How to handle errors between algorithms."
image:
  teaser: /icons/algo.svg
layout: article
permalink: /algorithm-development/algorithm-errors/
redirect_from:
  - /algorithm-development/algorithm-basics/algorithm-errors/
show_related: true
tags: [algo-dev]
title:  "Error Handling"
---

On Algorithmia you can develop in several different programming languages. This flexibility enables you to leverage your capabilities in the language(s) that you are most comfortable using, while also leveraging whichever libraries and functions best meet the needs of your specific use case. For example, you can call a NodeJS library from inside of a Python algorithm; all you have to do is to write a wrapper algorithm for that library.

There is a problem with this language-agnostic approach, though: not all programming languages are designed in the same way. This is especially true with regard to error and exception handling. Errors are often cryptic and there isn't a standard way to understand what they actually mean.

As an example, let's say you are calling a <a href="https://algorithmia.com/blog/introduction-to-computer-vision" target="_blank">computer vision</a> algorithm from a Java library and you get an error. If you are lucky, the author of that algorithm will have included a descriptive error message. However, depending on the message, you still might need to have a relatively strong grasp on Java programming, the Java compiler, and/or Java error types in order to understand what the error actually means, let alone to determine how to fix the issue in your code.

### Algorithm Error Codes

To be able to better support algorithm development and use across languages, we decided to create a predefined, standardized list of error types. This list is reflective of the types of algorithms that are most commonly published on the Algorithmia platform.


 <style>
   th,td{
     padding: 5px;
     border-bottom: 1px solid #ddd;
   }
 </style>
<table>
  <tr>
    <th>Error Code</th>
    <th>Error Use Cases</th> 
    <th>When To Raise</th>
  </tr>
  <tr>
    <td>InputError</td>
    <td>Invalid Input/Image/URL/Settings/JSON </td> 
    <td>Input, image, URL, settings, etc., provided is invalid/incomplete.</td>
  </tr>
  <tr>
    <td>UnsupportedError </td>
    <td>Unsupported file/image, URL/Website, etc.</td> 
    <td>Image or other file format is not supported, or scraper/parser algorithm does not explicitly support website.</td>
  </tr>
  <tr>
    <td>InitializationError</td>
    <td>(Model) Initialization Failed</td> 
    <td>Algorithm fails to load/initialize (ML/DL model).</td>
  </tr>
  <tr>
    <td>OutOfMemoryError</td>
    <td>Out of Memory</td> 
    <td>Algorithm cannot access any/additional RAM memory.</td>
  </tr>
  <tr>
    <td>OutOfGpuMemoryError</td>
    <td>Out of GPU Memory</td> 
    <td>Algorithm cannot access any/additional GPU memory.</td>
  </tr>
  <tr>
    <td>LanguageError</td>
    <td>Human Language Not Supported</td> 
    <td>Language is not supported in NLP model.</td>
  </tr>
  <tr>
    <td>TooLargeError</td>
    <td>File/Image Size Is Too Large</td> 
    <td>File or image size is too large or small.</td>
  </tr>
  <tr>
    <td>ParsingError</td>
    <td>Scraping/Parsing Failed, and JSON (de)serialization failed</td> 
    <td>Scraping/parsing fails due to changing website layout, or getting blacklisted, etc., or JSON (de)serialization failed.</td>
  </tr>
  <tr>
    <td>EntityNotFoundError</td>
    <td>Word/entry not found in dictionary/DB</td> 
    <td>Entry not found in DB, memory, list, file, or any other data source.</td>
  </tr>
  <tr>
    <td>ThirdPartyCredentialError</td>
    <td>When credentials for a 3rd party service doesn't authenticate anymore</td> 
    <td>3rd party API key fails to authenticate, or hit usage limit.</td>
  </tr>
  <tr>
    <td>AlgorithmError</td>
    <td>When no error code has been specified, and general algorithm error class</td> 
    <td>A general error class; returns for all other exception cases.</td>
  </tr>
</table>

Additionally, there are error codes that can only be generated on the back end. You'll receive the following error codes if the corresponding error case ever happens:

<table>
  <tr>
    <th>Error Code</th>
    <th>Error Use Cases</th> 
    <th>When To Raise</th>
  </tr>
  <tr>
    <td>TimeoutError</td>
    <td>When a child algorithm times out in a parent algorithm</td> 
    <td>Child algorithm run fails due to timeout.</td>
  </tr>
  <tr>
    <td>PaymentRequiredError</td>
    <td>When a user runs out of credits for a child algorithm call mid-parent algorithm run</td> 
    <td>Child algorithm run fails due to lack of credits.</td>
  </tr>
</table>




### Programming Language Support

Currently only the Python Algorithmia client natively supports these error codes. Support for other clients will be added soon.


### Python

Make sure that your algorithmia client version is: `>1.1.2`

The Python client returns a new AlgorithmException object that has the following attributes:

* `AlgorithmException.error_type`: This is the error code.
* `AlgorithmException.message`: This is the custom error message for the error code.

#### Example 1: Raising an error code with a custom message

Even though we have to conform to the predefined list of error codes, we can still specify a custom message with every error.

**Algorithm A:**

```
import Algorithmia
from Algorithmia.errors import AlgorithmException

def apply(input):
    if input["type"] == "image":
        return("Image processed!")
    elif input["type"] == "video":
        return("Video processed!")
    else:
        raise AlgorithmException("Type of media is not supported!", "UnsupportedError")

```

**Algorithm A Sample input:**

```
{"type": "audio"}
```

**Algorithm A Sample Output:**

```
Error: 'Type of media is not supported!'
Traceback (most recent call last):
  File "/opt/algorithm/bin/pipe.py", line 45, in get_response
    result = call_algorithm(request)
  File "/opt/algorithm/bin/pipe.py", line 93, in call_algorithm
    return algorithm.apply(data)
  File "/opt/algorithm/src/BE_test1.py", line 10, in apply
    raise AlgorithmException("Type of media is not supported!", "UnsupportedError")
AlgorithmException: 'Type of media is not supported!'
```

#### Example 2: Propagating a valid error from algorithm to algorithm

Here is an example when we raise a valid error in one Python algorithm, and catch it in another.

**Algorithm A:**

```
import Algorithmia
from Algorithmia.errors import AlgorithmException

def apply(input):
    if input["type"] == "image":
        return("Image processed!")
    elif input["type"] == "video":
        return("Video processed!")
    else:
        raise AlgorithmException("Type of media is not supported!", "UnsupportedError")

```

**Algorithm B:**

```
import Algorithmia
from Algorithmia.errors import AlgorithmException

def apply(input):
    client = Algorithmia.client()

    try:
        client.algo("username_Algorithm_A").pipe(input)
        return("Our call went through")
    except AlgorithmException as e:
        if e.error_type == "UnsupportedError":
            return("Looks like our call is unsupported")

```

**Algorithm B Sample Input:**

```
{"type": "audio"}
```

**Algorithm B Sample Output:**

```
"Looks like our call is unsupported"
```

#### Example 3: Propagating an invalid error from algorithm to algorithm

When we pass an invalid error code from one algorithm to the other, it automatically gets converted into a simple `AlgorithmError` error code.

**Algorithm A:**

```
import Algorithmia
from Algorithmia.errors import AlgorithmException

def apply(input):
    raise AlgorithmException("This is an invalid error code!", "BlablaException")

```

**Algorithm B:**

```
import Algorithmia
from Algorithmia.errors import AlgorithmException

def apply(input):
    client = Algorithmia.client()

    try:
        client.algo("username_Algorithm_A").pipe(input)
        return("Our call went through")
    except AlgorithmError as e:
        if e.error_type == "BlablaException":
            return("Our invalid error code was passed through.")
        elif e.error_type == "AlgorithmException":
            return("Our invalid error code was changed to the default.")
```

**Algorithm B Sample Input:**

```
"Some string."
```

**Algorithm B Sample Output:**

```
"Our invalid error code was changed to the default."
```
