---
layout: article
title:  "NLTK"
excerpt: "Hosting your nltk powered model on Algorithmia."
categories: model-guides
tags: [algo-model-guide]
show_related: true
author: steph_kim
image:
    teaser: /language_logos/python.svg
---


Welcome to hosting your <a href="http://www.nltk.org/">nltk</a> model on Algorithmia!
This guide is designed as an introduction to hosting a nltk model and publishing an algorithm even if you’ve never used Algorithmia before.


## Prerequisites
Maybe you've got a great idea or have tirelessly worked on a project in your spare time and you want it to be useful to others. Before you get started hosting your model on Algorithmia there are a few things you'll want to do first:

#### Train your model.
Say you have a model that predicts the gender of a name. You've discovered the features you want to include, you've done some data processing and have trained your model and validated it. You're happy with your results and now need to pickle the trained model so you can upload it to Algorithmia.

#### Pickle your trained model.
Various programming languages have different picklers to choose from. To prepare your model for uploading via our Data API, pick a pickler and save the pickled model locally.

## Create a Data Collection
Now you'll want to create a data collection to host your pickled model.

- To use the Data API, log into your Algorithmia account and create a data collection via the <a href="https://algorithmia.com/data/hosted">Data Collections</a> page.

- Click on **“Add Collection”** under the “My Collections” section on your data collections page.

- After you create your collection you can set the read and write access on your data collection. For more information check out: <a href="{{ site.baseurl }}/data/hosted/">Data Collection Types</a>


<img src="{{ site.baseurl }}/images/post_images/model_hosting/add_collection.png" alt="Create a data collection" class="screenshot img-sm">

### Upload your Model into a Collection
Next, upload your pickled model to your newly created data collection.

- Load model by clicking box **“Drop files here to upload”**

- Note the path to your files: data://username/collections_name/pickled_model.pkl

<img src="{{ site.baseurl }}/images/post_images/model_hosting/add_collections_visual.png" alt="Create a data collection" class="screenshot img-md">

## Create your Algorithm
Creating your algorithm is easy!

- To add an algorithm, simply click **“Add Algorithm”** from the user profile icon.
- Name your algorithm, select the language, choose permissions and make the code either open or closed source.

**Note**: There is also a checkbox for 'Standard Execution Environment' or 'Advanced GPU'. For machine learning models you will want to check 'Standard Execution Environment'.

<img src="{{ site.baseurl }}/images/post_images/model_hosting/create_new_alg_python3.png" alt="Create your algorithm" class="screenshot img-sm">

### Set your Dependencies
Now is the time to set your dependencies that your model relies on.

- Click on the **"Dependencies"** button at the top right of the UI and list your packages under the required ones already listed and click **"Save Dependencies"** on the bottom right corner.

<img src="{{ site.baseurl }}/images/post_images/model_hosting/dependencies_nltk.png" alt="Set your dependencies" class="screenshot img-md">

## Load your Model
Here is where you load your pickled model that is to be called by the apply() function.
Our recommendation is to preload your model in a separate function before apply(). The reasoning behind this is because when your model is first loaded it can take some time to load depending on the file size. However, with all subsequent calls only the apply() function gets called which will be much faster since your model is already loaded!

Here is some code that has been adapted from the NLTK online books tutorial <a href="http://www.nltk.org/book/ch06.html">Learning to Classify Text</a>

{% highlight python %}
"""
NLTK algorithm to label names female or male based on last letter of names

Input: String
Note when testing in console do not add quotations to input since
it counts the quotations as part of the input.
"""

import Algorithmia
import csv
import pickle

client = Algorithmia.client()

def load_model():
    # Get file by name
    # Open file and load model
    file_path = 'data://stephanie/demos/gender_model.pkl'
    model_path = client.file(file_path).getFile().name
    # Open file and load model
    with open(model_path, 'rb') as f:
        model = pickle.load(f)
        return model

# Load model outside of apply function
# This gets loaded once when called outside the apply function
classifier = load_model()

def gender_features(word):
    # Last letter as feature
    print("word", word[-1])
    return {'last_letter': word[-1]}

def apply(input):
    name = input
    model = classifier.classify(gender_features(name))
    output = {'gender': model}
    print(output)
    return output

{% endhighlight %}

If you are authoring an algorithm, avoid using the ‘.my’ pseudonym in the source code. When the algorithm is executed, ‘.my’ will be interpreted as the user name of the user who called the algorithm, rather than the author’s user name.
{: .notice-warning}

## Publish your Algorithm
Last is publishing your algorithm. The best part of hosting your model on Algorithmia is that users can access it via an API that takes only a few lines of code to use! Here is what you can set when publishing your algorithm:

- Set version permissions to public or private use

- Set it to royalty free or set to per-call royalty

- Set access permissions to have full access to the internet and ability to call other algorithms


For more information and detailed steps: <a href="{{ site.baseurl }}/algorithm-development/your-first-algo/">creating and publishing your algorithm</a>

<img src="{{ site.baseurl }}/images/post_images/model_hosting/publish_alg.png" alt="Publish your algorithm" class="screenshot img-sm">

## Working Demo
If you would like to check this demo out on the platform you can find it here: <a href="https://algorithmia.com/algorithms/stephanie/test">NLTK-demo</a>

That's it for hosting your <a href="http://www.nltk.org/">nltk</a> model on Algorithmia!
