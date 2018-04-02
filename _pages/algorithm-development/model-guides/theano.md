---
layout: article
title:  "Theano"
excerpt: "Host your Theano deep learning model on Algorithmia."
categories: model-guides
tags: [algo-model-guide]
show_related: true
author: steph_kim
image:
    teaser: /language_logos/theano.svg
---


Welcome to hosting your <a href="http://deeplearning.net/software/theano/">Theano</a> model on Algorithmia! This guide is designed as an introduction to hosting a theano model and publishing an algorithm even if you’ve never used Algorithmia before.


## Prerequisites
Before you get started hosting your model on Algorithmia there are a few things you'll want to do first:

### Train and pickle your model.
After training your Theano model, you'll want to save the pickled model using either [pickle or cPickle](http://deeplearning.net/software/theano/tutorial/loading_and_saving.html) so you can upload it to Algorithmia.

### Create a Data Collection
Here you'll want to create a data collection to host your pickled model.

- To use the Data API, log into your Algorithmia account and create a data collection via the <a href="{{ site.baseurl }}/data/hosted">Data Collections</a> page.

- Click on **“Add Collection”** under the “My Collections” section on your data collections page.

- After you create your collection you can set the read and write access on your data collection. For more information check out: <a href="{{ site.baseurl }}/data/hosted/">Data Collection Types</a>


<img src="{{ site.baseurl }}/images/post_images/model_hosting/add_collection.png" alt="Create a data collection" class="screenshot img-sm">

### Upload your Model into a Collection
Next, upload your pickled model to your newly created data collection.

- Load model by clicking box **“Drop files here to upload”**

- Note the path to your files: data://username/collections_name/pickled_model.pkl

<img src="{{ site.baseurl }}/images/post_images/model_hosting/theano_update_collections.png" alt="Create a data collection" class="screenshot img-md">

## Create your Algorithm
Creating your algorithm is easy!

- To add an algorithm, simply click **“Add Algorithm”** from the user profile icon.
- Name your algorithm, select the language, choose permissions and make the code either open or closed source.

**Note**: There is also a checkbox for 'Standard Execution Environment' or 'Advanced GPU'. For deep learning models you will want to check 'Advanced GPU'.

<img src="{{ site.baseurl }}/images/post_images/model_hosting/create_new_alg_dl_python3.png" alt="Create your algorithm" class="screenshot img-sm">

### Set your Dependencies
Now is the time to set your dependencies that your model relies on.

- Click on the **"Dependencies"** button at the top right of the UI and list your packages under the required ones already listed and click **"Save Dependencies"** on the bottom right corner.

<img src="{{ site.baseurl }}/images/post_images/model_hosting/theano_dependencies.png" alt="Set your dependencies" class="screenshot img-md">

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

If you are authoring an algorithm, avoid using the ‘.my’ pseudonym in the source code. When the algorithm is executed, ‘.my’ will be interpreted as the user name of the user who called the algorithm, rather than the author’s user name.
{: .notice-warning}

## Publish your Algorithm
Last is publishing your algorithm. The best part of hosting your model on Algorithmia is that users can access it via an API that takes only a few lines of code to use! Here is what you can set when publishing your algorithm:

On the upper right hand side of the algorithm page you'll see a purple button "Publish" which will bring up a modal:

<img src="{{ site.baseurl }}/images/post_images/algo_dev_lang/publish_algorithm.png" alt="Publish an algorithm" class="screenshot img-sm">

In this modal, you'll see a Changes tab, a Sample I/O tab, and one called Versioning.

Changes shows you your commit history and release notes.

Sample I/O is where you'll create your sample input and output for the user to try under Try the API in the Run tab. When you add a sample input, make sure to test it out with all the inputs that you accept since users will be able to test your algorithm with their own inputs.

Under the Versioning tab, you can select whether your algorithm will be for public use or private use as well as set the royalty. The algorithm can either be royalty-free or charge per-call. If you opt to have the algorithm charge a royalty, as the author, you will earn 70% of the royalty cost.

Check out [Algorithm Pricing]({{ site.baseurl }}/pricing/) for more information on how much algorithms will cost to run.

Under Semantic Versioning you can choose which kind of release your change should fall under: Major, Minor, or Revision. 

If you are satisfied with your algorithm and settings, go ahead and hit publish. Congratulations, you’re an algorithm developer!

If you want to have a better idea of how a finished theano algorithm looks like, check out: <a href=" https://algorithmia.com/algorithms/deeplearning/ArtsyNetworks">ArtsyNetworks</a>

For more information and detailed steps: <a href="{{ site.baseurl }}/algorithm-development/your-first-algo/">creating and publishing your algorithm</a>

That's it for hosting your <a href="http://deeplearning.net/software/theano/">theano</a> model on Algorithmia!
