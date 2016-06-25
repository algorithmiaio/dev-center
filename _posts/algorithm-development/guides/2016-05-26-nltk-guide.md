---
layout: article
title:  "Hosting your nltk model"
excerpt: "Guide to hosting your nltk model on Algorithmia."
date:   2016-05-26 14:28:42
permalink: /algorithm-development/guides/nltk-guide
tags: [algo-model-guide]
show_related: true
author: steph_kim
image:
    teaser: /language_logos/python.png
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

- Click on “Add Collection” under the “My Collections” section on your data collections page.

- Set the read and write access on your collection. For more information check out: <a href="http://developers.algorithmia.com/application-development/data-sources/hosted-data-guide/">Data Collection Types</a>


<img src="/images/post_images/model_hosting/add_collections.png" alt="Create a data collection" style="width: 700px;"/>

### Upload your Model into a Collection
Next, upload your pickled model to your newly created data collection.

- Load model by clicking box “Drop files here to upload”

- Note the path to your files: data://username/collections_name/pickled_model.pkl

<img src="/images/post_images/model_hosting/add_collections_visual.png" alt="Create a data collection" style="width: 700px;"/>

## Create your Algorithm
Creating your algorithm is easy!

- To add an algorithm, simply click “Add Algorithm” from the user profile icon.
- Name, select the language, choose permissions and make the code either open or closed source.

<img src="/images/post_images/model_hosting/create_new_alg.png" alt="Create your algorithm" style="width: 700px;"/>

## Load your Model
Here is where you load your pickled model that is to be called by the apply() function.
Our recommendation is to preload your model in a separate function before apply(). The reasoning behind this is because when your model is first loaded it can take some time to load depending on the file size. However, with all subsequent calls only the apply() function gets called which will be much faster since your model is already loaded!

{% highlight python %}
"""
Algorithm to label names female or male
Test set must be a list of features: [({'last_letter': 'e'}, 'female'), 
({'last_letter': 'e'}, 'male'), ({'last_letter': 'e'}, 'female'), 
({'last_letter': 'w'}, 'male'), ({'last_letter': 'a'}, 'female')]
"""

import Algorithmia
import csv
import pickle
from nltk.classify import accuracy

client = Algorithmia.client()


def load_model():
    # Get file by name
    # Open file and load model
    file_path = 'data://.my/demos/gender_model.pkl'
    model_path = client.file(file_path).getFile().name
    # Open file and load model
    with open(model_path, 'rb') as f:
        model = pickle.load(f)
        return model

classifier = load_model()


def gender_features(word):
    # Last letter as feature.
    return {'last_letter': word[-1]}

def test_data():
    test_file = client.file('data://.my/demos/gender_test_data.csv').getFile().name
    with open(test_file, 'rb') as f:
        test_data = csv.reader(f, delimiter=',')
        data = [row for row in test_data]
        return data

def apply(input):
    name = input
    informative_features = classifier.show_most_informative_features(5)
    test_set = test_data()
    output = {'gender': classifier.classify(gender_features(
        name)), 'accuracy': accuracy(classifier, test_set),
        'informative_features': informative_features}
    return output

{% endhighlight %}

### Set your Dependencies
Now is the time to set your dependencies that your model relies on.

- Click on the dependencies button at the top right of the UI and list your packages under the required ones already listed and save at the button on the bottom right corner.

<img src="/images/post_images/model_hosting/dependencies_nltk.png" alt="Set your dependencies" style="width: 700px;"/>

## Publish your Algorithm
Last is publishing your algorithm. The best part of hosting your model on Algorithmia is that users can access it via an API that takes only a few lines of code to use!

- Set version permissions to public or private use

- Set it to royalty free or set to per-call royalty

- Set access permissions to have full access to the internet and ability to call other algorithms

- For more information and detailed steps: <a href="http://developers.algorithmia.com/basics/your_first_algo/">creating and publishing your algorithm</a>

<img src="/images/post_images/model_hosting/publish_alg.png" alt="Publish your algorithm" style="width: 700px"/>

That's it for hosting your <a href="http://scikit-learn.org/stable/index.html">nltk</a> model on Algorithmia!
