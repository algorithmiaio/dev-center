---
layout: article
title:  "Scikit-Learn"
excerpt: "Guide to hosting your scikit-learn model on Algorithmia."
date:   2016-05-26 14:28:42
permalink: /algorithm-development/model-guides/scikit
redirect_from:
  - /algorithm-development/guides/scikit/
tags: [algo-model-guide]
show_related: true
author: steph_kim
image:
    teaser: /language_logos/scikit.svg
---


Welcome to hosting your <a href="http://scikit-learn.org/stable/index.html">scikit-learn</a> model on Algorithmia!
This guide is designed as an introduction to hosting a scikit-learn model and publishing an algorithm even if you’ve never used Algorithmia before.


## Prerequisites
Maybe you've got a great idea or have tirelessly worked on a project in your spare time and you want it to be useful to others. Before you get started hosting your model on Algorithmia there are a few things you'll want to do first:

#### Train your model.
Say you have a regression model that is predicting the popularity of a product based on various features. You have your training data that has ratings of such products and their associated features. You also have your test data that has the products minus the ratings. You do some data preprocessing and then train your model and validate it. You're happy with your results and now need to pickle the trained model so you can upload it to Algorithmia.

#### Pickle your trained model.
Various programming languages have different picklers to choose from. To prepare your model for uploading via our Data API, pick a pickler and save the pickled model locally.

### Create a Data Collection
Now you'll want to create a data collection to host your pickled model.

- To use the Data API, log into your Algorithmia account and create a data collection via the <a href="https://algorithmia.com/data/hosted">Data Collections</a> page.

- Click on “Add Collection” under the “My Collections” section on your data collections page.

- After you create your collection you can set the read and write access on your data collection. For more information check out: <a href="http://developers.algorithmia.com/application-development/data-sources/hosted-data-guide/">Data Collection Types</a>


<img src="/images/post_images/model_hosting/add_collection.png" alt="Set your dependencies" class="screenshot">

### Upload your Model into a Collection
Next, upload your pickled model to your newly created data collection.

- Load model by clicking box “Drop files here to upload”

- Note the path to your files: data://username/collections_name/pickled_model.pkl

<img src="/images/post_images/model_hosting/add_collections_visual.png" alt="Create a data collection" class="screenshot">

### Create your Algorithm
Creating your algorithm is easy!

- To add an algorithm, simply click “Add Algorithm” from the user profile icon.
- Name your algorithm, select the language, choose permissions and make the code either open or closed source.

**Note**: There is also a checkbox for 'Standard Execution Environment' or 'Advanced GPU'. For machine learning models you will want to check 'Standard Execution Environment'.

<img src="/images/post_images/model_hosting/create_new_alg_python3.png" alt="Create your algorithm" class="screenshot">

### Load your Model
Here is where you load your pickled model that is to be called by the apply() function.
Our recommendation is to preload your model in a separate function before apply(). The reasoning behind this is because when your model is first loaded it can take some time to load depending on the file size. However, with all subsequent calls only the apply() function gets called which will be much faster since your model is already loaded!

Now to check out a code example using the <a href="http://scikit-learn.org/stable/modules/generated/sklearn.ensemble.RandomForestRegressor.html">Random Forest Regressor</a> to build a prediction model in Scikit-learn

{% highlight python %}
import sys
import pickle
import csv
import numpy as np
import Algorithmia

from sklearn.datasets import load_boston
from sklearn.ensemble import RandomForestRegressor

client = Algorithmia.client()

def load_model():
    # Get file by name
    # Open file and load model
    file_path = 'data://demo/demo/scikit-demo-boston-regression.pkl'
    model_path = client.file(file_path).getFile().name
    # Open file and load model
    with open(model_path, 'rb') as f:
        model = pickle.load(f)
        return model

# Load model outside of the apply function so it only gets loaded once
model = load_model()


def process_input(input):
    # Create numpy array from csv file passed as input in apply()
    if input.startswith('data:'):
        file_url = client.file(input).getFile().name
        try:
            np_array = np.genfromtxt(file_url, delimiter=',')
            print(np_array)
            return np_array
        except Exception as e:
            print("Could not create numpy array from data", e)
            sys.exit(0)


def apply(input):
    # Input should be a csv file - model is trained on Sklearn 
    # Boston housing dataset using RandomForestRegressor
    np_data = process_input(input)
    prediction = model.predict(np_data)
    return list(prediction)

{% endhighlight %}

**NOTE** If you are authoring an algorithm, avoid using the ‘.my’ pseudonym in the source code. When the algorithm is executed, ‘.my’ will be interpreted as the user name of the user who called the algorithm, rather than the author’s user name.

### Set your Dependencies
Now is the time to set your dependencies that your model relies on.

- Click on the dependencies button at the top right of the UI and list your packages under the required ones already listed and click 'Save Dependencies' on the bottom right corner.

<img src="/images/post_images/model_hosting/dependencies_scikit.png" alt="Set your dependencies" class="screenshot">

### Publish your Algorithm
Last is publishing your algorithm. The best part of hosting your model on Algorithmia is that users can access it via an API that takes only a few lines of code to use! Here is what you can set when publishing your algorithm:

- Set version permissions to public or private use

- Set it to royalty free or set to per-call royalty

- Set access permissions to have full access to the internet and ability to call other algorithms


For more information and detailed steps: <a href="http://developers.algorithmia.com/basics/your_first_algo/">creating and publishing your algorithm</a>

<img src="/images/post_images/model_hosting/publish_alg.png" alt="Publish your algorithm" class="screenshot">

## Working Demo
If you would like to check this demo out on the platform you can find it here: <a href="https://algorithmia.com/algorithms/stephanie/scikitlearnmodel">Scikit-Learn-demo</a>

That's it for hosting your <a href="http://scikit-learn.org/stable/index.html">scikit-learn</a> model on Algorithmia!

