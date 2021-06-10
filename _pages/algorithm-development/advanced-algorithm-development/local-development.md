---
author: jon_peck
categories: [algo-dev]
excerpt: "Developing your code locally for use in an algorithm"
image:
    teaser: /post_images/local_development/local_development.png
layout: article
permalink: /algorithm-development/advanced-algorithm-development/local-development/
show_related: true
tags: [algo-dev]
title:  "Setting up Your Local Environment for Algorithm Development"
---

<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/local_development/local_development_wide.png" class="img-fill">

## Why develop locally?

Algorithmia provides a handy [Web IDE](https://algorithmia.com/developers/algorithm-development/your-first-algo#editing-your-algorithm-via-the-web-ide) for quick, simple development tasks—but iterative, multi-file development can become quite tedious, as the Web IDE lacks advanced code-management features, has no debugger, and can sometimes compile slowly. Most developers prefer to [clone their algorithm repo](https://algorithmia.com/developers/algorithm-development/your-first-algo#editing-your-algorithm-locally-via-git-and-cli) to their local computer, so they can use their favorite IDE and iterate rapidly. This is generally a more productive way to code, but also means you'll need to do a little bit of setup to ensure that your local environment closely resembles the server environment in which your algorithm will run once deployed.

## Language version and dependencies

First, ensure that you are running the same major and minor version of the language you've selected for your algorithm. New versions of languages don't just add new features or syntaxes—they can also change behaviors in subtle ways, such as the [postponed evaluation of annotations](https://docs.python.org/3/whatsnew/3.7.html#whatsnew37-pep563) introduced in Python 3.7.

Also be sure to keep your dependencies identical, down to the minor (or even the patch / sub-minor) version. If possible, use a virtual environment tool such as [virtualenv](https://virtualenv.pypa.io/) to ensure that you aren't accidentally depending on globally installed packages that haven't been explicitly declared in your dependencies file. Note that Algorithmia uses PyPI, not Conda, so use `pip` to install your Python packages.

To help you identify the exact language and dependency versions, we've put together [code you can run inside your Algorithm to examine the environment and installed packages](list-packages/)—and even to [help set up your virtual environment](list-packages/#creating-a-local-python-virtualenv-to-emulate-the-algorithms-environment).

Dependencies guides: [Python]({{site.baseurl}}/algorithm-development/languages/python/#managing-dependencies), 
[R]({{site.baseurl}}/algorithm-development/languages/r/#managing-dependencies)
{: .notice-info}

## Running your algorithm locally

When running in the server environment, Algorithms begin at the `apply()` method (or `algorithm()` in R). JSON input is automatically converted into a language-native data structure. For example, `{"foo": "bar"}` becomes a dictionary in Python and a named list in R.

Developing locally, you'll need a similar way to trigger the `apply()` method. The simplest solution is often just to add a bit of code to the end of your Algorithm that accepts JSON input and calls `apply()`:


 ```python
import json

if __name__ == "__main__":
    input = '{"foo":"bar"}'
    print(apply(json.loads(input))) 
 ```
 
Now you can test your Algorithm locally by simply changing the value of `input` and running the script. This extra code won't affect how it runs on Algorithmia in any way, so you can leave it in when you commit your code.
 
 Similarly, in R you would add a wrapper function to do the same thing:
 
 ```R
 import(rjson)
 
 algorithm_local <- function(json) {
     algorithm(fromJSON(json))
 }
 ```

Now you can test locally by making a call to `algorithm_local` with any JSON input you like, such as `algorithm_local('{"foo": "bar"}')`. Again, this won't change how your Algorithm runs on Algorithmia, so you can safely leave this code in place when you commit it.
