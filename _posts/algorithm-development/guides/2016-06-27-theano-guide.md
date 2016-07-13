---
layout: article
title:  "Hosting your Theano model"
excerpt: "Guide to hosting your theano model on Algorithmia."
date:   2016-05-26 14:28:42
permalink: /algorithm-development/guides/theano-guide
tags: [algo-model-guide]
show_related: true
author: steph_kim
image:
    teaser: /language_logos/python.png
---


Welcome to hosting your <a href="http://deeplearning.net/software/theano/">Theano</a> model on Algorithmia! This guide is designed as an introduction to hosting a theano model and publishing an algorithm even if you’ve never used Algorithmia before.


## Prerequisites
Maybe you've got a great idea or have tirelessly worked on a project in your spare time and you want it to be useful to others. Before you get started hosting your model on Algorithmia there are a few things you'll want to do first:

#### Train your model.
You have a model that labels images. You've discovered the features you want to include, you've trained your model and validated it with your validation data set. You're happy with your results and now need to pickle the trained model so you can upload it to Algorithmia.

#### Pickle your trained model.
Various programming languages have different picklers to choose from. To prepare your model for uploading via our Data API, pick a pickler and save the pickled model locally.

## Create a Data Collection
Here you'll want to create a data collection to host your pickled model.

- To use the Data API, log into your Algorithmia account and create a data collection via the <a href="https://algorithmia.com/data/hosted">Data Collections</a> page.

- Click on “Add Collection” under the “My Collections” section on your data collections page.

- After you create your collection you can set the read and write access on your data collection. For more information check out: <a href="http://developers.algorithmia.com/application-development/data-sources/hosted-data-guide/">Data Collection Types</a>


<img src="/images/post_images/model_hosting/add_collection.png" alt="Create a data collection" class="screenshot">

### Upload your Model into a Collection
Next, upload your pickled model to your newly created data collection.

- Load model by clicking box “Drop files here to upload”

- Note the path to your files: data://username/collections_name/pickled_model.pkl

<img src="/images/post_images/model_hosting/theano_update_collections.png" alt="Create a data collection" class="screenshot">

## Create your Algorithm
Creating your algorithm is easy!

- To add an algorithm, simply click “Add Algorithm” from the user profile icon.
- Name your algorithm, select the language, choose permissions and make the code either open or closed source.

**Note**: There is also a checkbox for 'Standard Execution Environment' or 'Advanced GPU'. For deep learning models you will want to check 'Advanced GPU'.

<img src="/images/post_images/model_hosting/create_new_alg.png" alt="Create your algorithm" class="screenshot">

### Set your Dependencies
Now is the time to set your dependencies that your model relies on.

- Click on the dependencies button at the top right of the UI and list your packages under the required ones already listed and click 'Save Dependencies' on the bottom right corner.

<img src="/images/post_images/model_hosting/theano_dependencies.png" alt="Set your dependencies" class="screenshot">

## Load your Model
Now you'll want to load and run your model which will be called by the apply() function.
Our recommendation is to preload your model in a separate function before apply(). The reasoning behind this is because when your model is first loaded it can take some time to load depending on the file size. However, with all subsequent calls only the apply() function gets called which will be much faster since your model is already loaded!

Here is an example for loading your model based on the <a href="http://deeplearning.net/tutorial/logreg.html">Classifying MNIST digits</a> using a <a href="http://deeplearning.net/tutorial/code/logistic_sgd.py">Logistic Regression model</a>.

{% highlight python %}
import Algorithmia
import pickle
import theano
import theano.tensor as T

client = Algorithmia.client()

def load_model():
    """Load model from user collections"""
    file_uri = 'data://user_name/theano_demo/theano_model.pkl'
    pickled_model = client.file(file_uri).getFile().name
    # Open file and load model
    with open(pickled_model, 'rb') as f:
        model = pickle.load(f)
        return model

# Function to load model gets called one time
classifier = load_model()

def predict(input):
    """
    An example of how to load a trained model and use it
    to predict labels.

    Adopted from http://deeplearning.net/tutorial/logreg.html
    """
    # compile a predictor function
    predict_model = theano.function(
        inputs=[classifier.input],
        outputs=classifier.y_pred)

    predicted_values = predict_model(input[:10])
    print("Predicted values for the first 10 examples in test set:")
    print(predicted_values)
    return predicted_values


def apply(input):
    """
    Input is an image file

    Input examples:
    Data Sources via https://algorithmia.com/data using the Data API
    or as an http request using urllib
    """
    output = predict(input)
    return output
{% endhighlight %}

## Publish your Algorithm
Last is publishing your algorithm. The best part of hosting your model on Algorithmia is that users can access it via an API that takes only a few lines of code to use! Here is what you can set when publishing your algorithm:

- Set version permissions to public or private use

- Set it to royalty free or set to per-call royalty

- Set access permissions to have full access to the internet and ability to call other algorithms

For more information and detailed steps: <a href="http://developers.algorithmia.com/basics/your_first_algo/">creating and publishing your algorithm</a>

<img src="/images/post_images/model_hosting/publish_alg.png" alt="Publish your algorithm" class="screenshot">

That's it for hosting your <a href="http://deeplearning.net/software/theano/">theano</a> model on Algorithmia!
