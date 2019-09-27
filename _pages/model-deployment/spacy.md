---
layout: article
title:  "spaCy"
excerpt: "Deploying your spaCy model to Algorithmia."
categories: model-guides
tags: [algo-model-guide]
show_related: true
author: steph_kim
permalink: /model-deployment/spacy/
redirect_from:
  - /algorithm-development/model-guides/spacy/
image:
    teaser: /language_logos/spacy.png
---

Welcome to deploying your <a href="https://spacy.io/">spaCy</a> model on Algorithmia!

This guide is designed as an introduction to deploying a spaCy model and publishing an algorithm even if you’ve never used Algorithmia before.

Note: this guide uses the web UI to create and deploy your Algorithm. If you prefer a code-only approach to deployment, review [Algorithm Management API]({{site.baseurl}}/algorithm-development/algorithm-management-api) after reading this guide.
{: .notice-info}

## Table of Contents
* [Create your Algorithm](#create-your-algorithm)
* [Set your Dependencies](#set-your-dependencies)
* [Load your Model](#load-your-model)
* [Publish your Algorithm](#publish-your-algorithm)


## Create your Algorithm
Hopefully you've already followed along with the <a href="{{site.baseurl}}/algorithm-development/algorithm-basics/your-first-algo">Getting Started Guide</a> for algorithm development. If not, you might want to check it out in order to understand the various permission types, how to enable a GPU environment, and use the CLI.

Once you've gone through the <a href="{{site.baseurl}}/algorithm-development/algorithm-basics/your-first-algo">Getting Started Guide</a>, you'll notice that when you've created your algorithm, there is boilerplate code in the editor that returns "Hello" and whatever you input to the console.

The main thing to note about the algorithm is that it's wrapped in the `apply()` function.

The apply() function defines the input point of the algorithm. We use the apply() function in order to make different algorithms standardized. This makes them easily chained and helps authors think about designing their algorithms in a way that makes them easy to leverage and predictable for end users.

Go ahead and remove the boilerplate code below that's inside the `apply()` function on line 6, but leave the `apply()` function intact:

<img src="{{site.baseurl}}/images/post_images/algo_dev_lang/algorithm_console_python.png" alt="Algorithm console Python" class="screenshot">

### Set your Dependencies
Now is the time to set your dependencies that your model relies on.

- Click on the **"Dependencies"** button at the top right of the UI and list your packages under the required ones already listed and click **"Save Dependencies"** on the bottom right corner.

<img src="{{site.baseurl}}/images/post_images/model_hosting/spacy_dependencies.png" alt="Set your dependencies" class="screenshot img-md">

For easy copy and paste:
{% highlight python %}
spacy
https://github.com/explosion/spacy-models/releases/download/en_core_web_sm-2.0.0/en_core_web_sm-2.0.0.tar.gz
{% endhighlight %}

If you need to load a trained model from spaCy, check out this <a href="https://algorithmia.com/algorithms/demo/spacydemo">example in Spacy</a>, which shows loading a trained model. Particulary check out the dependency file and the top few lines of code to see how to load it. You'll load a trained spaCy model the same way.

If you are using a library that depends on SpaCy creating symlink between `en_core_web_md` and `en`, please find an alternative as we don't support creating that symlink manually.
{: .notice-warning}

## Load your Model
Here is where you load and run your model which will be called by the apply() function.

When you load your model, our recommendation is to preload your model in a separate function external to the apply() function.

This is because when a model is first loaded it can take time to load depending on the file size.

Then, with all subsequent calls only the apply() function gets called which will be much faster since your model is already loaded.

If you are authoring an algorithm, avoid using the ‘.my’ pseudonym in the source code. When the algorithm is executed, ‘.my’ will be interpreted as the user name of the user who called the algorithm, rather than the author’s user name.
{: .notice-warning}

Note that you always want to create valid JSON input and output in your algorithm. For examples see the <a href="/algorithm-development/languages/python/#io-for-your-algorithms">Client Guides</a>.

### Example Hosted Model:

Here is some code that has been adapted from the spaCy online books tutorial <a href="http://www.spaCy.org/book/ch06.html">Learning to Classify Text</a>

{% highlight python %}
"""
Entity recognition demo from SpaCy docs
https://spacy.io/#doc-spans-ents
"""

import Algorithmia
import spacy
from spacy.lang.en.examples import sentences
import en_core_web_sm
import sys

# Load outside of the apply function so it only gets loaded once
nlp = spacy.load('en_core_web_sm')


# API calls will begin at the apply() method, with the request body passed as 'input'
# For more details, see algorithmia.com/developers/algorithm-development/languages
def apply(input):
    # Find named entities, phrases and concepts
    doc = nlp(input)
    ents = [{"text": entity.text, "entity": entity.label_} for entity in doc.ents]
    return "Entities {0}".format(ents)


{% endhighlight %}

Now when you run this code, the expected input is:
{% highlight python %}
"When Sebastian Thrun started working on self-driving cars at Google in 2007, few people outside of the company took him seriously. I can tell you very senior CEOs of major American car companies would shake my hand and turn away because I wasn’t worth talking to, said Thrun, now the co-founder and CEO of online higher education startup Udacity, in an interview with Recode earlier this week."
{% endhighlight %}

With the expected output:
{% highlight python %}
[{'entity': 'PERSON', 'text': 'Sebastian Thrun'}, {'entity': 'ORG', 'text': 'Google'}, {'entity': 'DATE', 'text': '2007'}, {'entity': 'NORP', 'text': 'American'}, {'entity': 'PERSON', 'text': 'Thrun'}, {'entity': 'ORG', 'text': 'Recode'}, {'entity': 'DATE', 'text': 'earlier this week'}]
{% endhighlight %}


## Publish your Algorithm
Last is publishing your algorithm. The best part of deploying your model on Algorithmia is that users can access it via an API that takes only a few lines of code to use! Here is what you can set when publishing your algorithm:

On the upper right hand side of the algorithm page you'll see a purple button "Publish" which will bring up a modal:

<img src="{{site.baseurl}}/images/post_images/algo_dev_lang/publish_algorithm.png" alt="Publish an algorithm" class="screenshot img-sm">

In this modal, you'll see a Changes tab, a Sample I/O tab, and one called Versioning.

If you don't recall from the <a href="{{site.baseurl}}/algorithm-development/algorithm-basics/your-first-algo">Getting Started Guide</a> how to go through the process of publishing your model, check that out before you finish publishing.

## Working Demo

Here is a working example, pay special attention to the dependencies file to download an example Spacy model:

<a href="https://algorithmia.com/algorithms/demo/spacydemo">Spacy Demo</a>

That's it for hosting your <a href="http://www.spaCy.org/">spaCy</a> model on Algorithmia!



