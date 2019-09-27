---
layout: article
title:  "Theano"
excerpt: "Deploying your Theano deep learning model on Algorithmia."
categories: model-guides
tags: [algo-model-guide]
show_related: true
author: steph_kim
permalink: /model-deployment/theano/
redirect_from:
  - /algorithm-development/model-guides/theano/
image:
    teaser: /language_logos/theano.svg
---


Welcome to deploying your <a href="http://deeplearning.net/software/theano/">Theano</a> model on Algorithmia! This guide is designed as an introduction to deploying a theano model and publishing an algorithm even if you’ve never used Algorithmia before.

Note: this guide uses the web UI to create and deploy your Algorithm. If you prefer a code-only approach to deployment, review [Algorithm Management API]({{site.baseurl}}/algorithm-development/algorithm-management-api) after reading this guide.
{: .notice-info}

## Table of Contents
* [Prerequisites](#prerequisites)
  * [Save your Pre-Trained Model](#save-your-pre-trained-model)
  * [Create a Data Collection](#create-a-data-collection)
  * [Host Your Model File](#host-your-model-file)
* [Create your Algorithm](#create-your-algorithm)
* [Set your Dependencies](#set-your-dependencies)
* [Load your Model](#load-your-model)
* [Publish your Algorithm](#publish-your-algorithm)

## Prerequisites
Before you get started hosting your model on Algorithmia there are a few things you'll want to do first:

### Save your Pre-Trained Model
You'll want to do the training and saving of your model on your local machine, or the platform you're using for training, before you deploy it to production on the Algorithmia platform.

After training your Theano model, you'll want to save the pickled model using either [pickle or cPickle](http://deeplearning.net/software/theano/tutorial/loading_and_saving.html) so you can upload it to Algorithmia.

### Create a Data Collection
Host your data where you want and serve it to your model with Algorithmia's <a href="http://docs.algorithmia.com/">Data API</a>.

In this guide we'll use Algorithmia's <a href="{{site.baseurl}}/data/hosted">Hosted Data Collection</a>, but you can host it in <a href="{{site.baseurl}}/data/s3">S3</a> or <a href="{{site.baseurl}}/data/dropbox">Dropbox</a> as well. Alternatively, if your data lies in a database, [check out]({{site.baseurl}}/data/dynamodb) how we connected to a DynamoDB database.

First, you'll want to create a data collection to host your pre-trained model.

- Log into your Algorithmia account and create a data collection via the <a href="{{site.baseurl}}/data/hosted">Data Collections</a> page.

- Click on **“Add Collection”** under the “My Collections” section.

- After you create your collection you can set the read and write access on your data collection.

<img src="{{site.baseurl}}/images/post_images/model_hosting/add_collection.png" alt="Create a data collection" class="screenshot img-sm">

For more information check out: <a href="{{site.baseurl}}/data/hosted">Data Collection Types</a>.

Note, that you can also use the <a href="https://docs.algorithmia.com/#data-uri">Data API</a> to create data collections and upload files.

### Host Your Model File
Next, upload your pickled model to your newly created data collection.

- Load model by clicking box **“Drop files here to upload”**

- Note the path to your files: data://username/collections_name/pickled_model.pkl

<img src="{{site.baseurl}}/images/post_images/model_hosting/theano_update_collections.png" alt="Create a data collection" class="screenshot img-md">

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

<img src="{{site.baseurl}}/images/post_images/model_hosting/theano_dependencies.png" alt="Set your dependencies" class="screenshot img-md">

For easy copy and paste:
{% highlight python %}
Theano
{% endhighlight %}

## Load your Model
Here is where you load and run your model which will be called by the apply() function.

When you load your model, our recommendation is to preload your model in a separate function external to the apply() function.

This is because when a model is first loaded it can take time to load depending on the file size.

Then, with all subsequent calls only the apply() function gets called which will be much faster since your model is already loaded.

If you are authoring an algorithm, avoid using the ‘.my’ pseudonym in the source code. When the algorithm is executed, ‘.my’ will be interpreted as the user name of the user who called the algorithm, rather than the author’s user name.
{: .notice-warning}

Note that you always want to create valid JSON input and output in your algorithm. For examples see the <a href="/algorithm-development/languages/python/#io-for-your-algorithms">Client Guides</a>.

Here is an example for loading your model based on the <a href="http://deeplearning.net/tutorial/logreg.html">Classifying MNIST digits</a> using a <a href="http://deeplearning.net/tutorial/code/logistic_sgd.py">Logistic Regression model</a>.

### Example Hosted Model:
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
Last is publishing your algorithm. The best part of deploying your model on Algorithmia is that users can access it via an API that takes only a few lines of code to use! Here is what you can set when publishing your algorithm:

On the upper right hand side of the algorithm page you'll see a purple button "Publish" which will bring up a modal:

<img src="{{site.baseurl}}/images/post_images/algo_dev_lang/publish_algorithm.png" alt="Publish an algorithm" class="screenshot img-sm">

In this modal, you'll see a Changes tab, a Sample I/O tab, and one called Versioning.

If you don't recall from the <a href="{{site.baseurl}}/algorithm-development/algorithm-basics/your-first-algo">Getting Started Guide</a> how to go through the process of publishing your model, check that out before you finish publishing.

If you want to have a better idea of what a finished theano algorithm looks like, check out: <a href=" https://algorithmia.com/algorithms/deeplearning/ArtsyNetworks">ArtsyNetworks</a>

For more information and detailed steps: <a href="{{site.baseurl}}/algorithm-development/your-first-algo">creating and publishing your algorithm</a>

That's it for hosting your <a href="http://deeplearning.net/software/theano/">theano</a> model on Algorithmia!
