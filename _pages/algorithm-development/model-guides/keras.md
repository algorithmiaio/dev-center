---
layout: article
title:  "Keras"
excerpt: "Bring your Keras model to Algorithmia."
categories: model-guides
tags: [algo-model-guide]
show_related: true
author: steph_kim
image:
    teaser: /language_logos/keras.svg
---


Welcome to hosting your <a href="https://keras.io/">Keras</a> model on Algorithmia!
This guide is designed as an introduction to hosting a Keras model and publishing an algorithm even if you’ve never used Algorithmia before.


## Prerequisites
Before you get started hosting your model on Algorithmia there are a few things you'll want to do first:

### Train and save the model file.
After training your Keras model, you'll want to save it using `model.save(filepath)` so you can upload it to Algorithmia.

Note that when developing a model with Keras, they recommend you to [save the model](https://keras.io/getting-started/faq/#how-can-i-save-a-keras-model) as an `.h5` file so do not use pickle or cPickle to save your model, but use the built in `model.save()` instead.
{: .notice-info}

### Create a Data Collection
Here you'll want to create a data collection to host your model.

- To use the Data API, log into your Algorithmia account and create a data collection via the <a href="https://algorithmia.com/data/hosted">Data Collections</a> page.

- Click on **“Add Collection”** under the “My Collections” section on your data collections page.

- After you create your collection you can set the read and write access on your data collection. For more information check out: <a href="{{ site.baseurl }}/data/hosted/">Data Collection Types</a>

<img src="{{ site.baseurl }}/images/post_images/model_hosting/add_collection.png" alt="Create a data collection" class="screenshot img-sm">

### Upload your Model into a Collection
Next, upload your pickled model to your newly created data collection.

- Load model by clicking box **“Drop files here to upload”**

- Note the path to your files: data://username/collections_name/pickled_model.pkl

<img src="{{ site.baseurl }}/images/post_images/model_hosting/keras_data_collection.png" alt="Create a data collection" class="screenshot img-md">

## Create your Algorithm
Creating your algorithm is easy!

- To add an algorithm, simply click **“Add Algorithm”** from the user profile icon.
- Name your algorithm, select the language, choose permissions and make the code either open or closed source.

**Note**: There is also a checkbox for 'Standard Execution Environment' or 'Advanced GPU'. For deep learning models you will want to check 'Advanced GPU'.

<img src="{{ site.baseurl }}/images/post_images/model_hosting/create_new_alg_dl_python3.png" alt="Create your algorithm" class="screenshot img-sm">

### Set your Dependencies
Now is the time to set your dependencies that your model relies on.

- Click on the **"Dependencies"** button at the top right of the UI and list your packages under the required ones already listed and click **"Save Dependencies"** on the bottom right corner.

<img src="{{ site.baseurl }}/images/post_images/model_hosting/keras_dependencies.png" alt="Set your dependencies" class="screenshot img-md">

## Load your Model
Here is where you load and run your model which will be called by the apply() function.
Our recommendation is to preload your model in a separate function before apply(). The reasoning behind this is because when your model is first loaded it can take some time to load depending on the file size. However, with all subsequent calls only the apply() function gets called which will be much faster since your model is already loaded!

Note that you always want to create valid JSON input and output in your algorithm. For example this algorithm takes a JSON blob passing in a csv file hosted on [Algorithmia, Amazon S3, or Dropbox](https://algorithmia.com/developers/data/). 
{: .notice-info}

### Example Input:
{% highlight python %}
{
   "test_data": "data://stephanie/keras_data/test.csv"
}
{% endhighlight %}

### Example Output:
{% highlight python %}
[2, 0, 9, 0, 3, 7, 0, 3, 0, 3]
{% endhighlight %}

### Example Hosted Model:
{% highlight python %}
"""
    An example of how to load a trained model and use it
    to predict labels for first ten images in MNIST test set.

"""

import numpy as np
from keras.models import load_model

import Algorithmia

client = Algorithmia.client()

# Set seed for reproducibility
seed = 7
np.random.seed(seed)


def load_keras_model():
    """Load model from data collection."""
    file_uri = "data://stephanie/keras_model/mnist_model.h5"
    # Retrieve file name from data collections.
    saved_model = client.file(file_uri).getFile().name
    model = load_model(saved_model)
    return model


# Function to load model gets called one time
classifier = load_keras_model()


def process_input(input):
    """Get saved data model and turn into numpy array."""
    # Create numpy array from csv file passed as input in apply()
    if "test_data" in input and input["test_data"].startswith('data:'):
        input = input["test_data"]
        file_url = client.file(input).getFile().name
        try:
            np_array = np.genfromtxt(file_url, delimiter=',', skip_header=1)
            # Predict only on the first ten images.
            return np_array[:10]
        except Exception as e:
            print("Could not create numpy array from data", e)
    else:
        url = "https://algorithmia.com/developers/data/"
        print("Incorrect url: Check how to host your data: {0}".format(url))


def predict(input):
    """Reshape numpy array and predict new data."""
    pf = process_input(input)
    # Reshape data to be [samples][pixels][width][height]
    pf = pf.reshape(pf.shape[0], 1, 28, 28).astype('float32')
    # Normalize inputs from 0-255 to 0-1
    pf = pf / 255
    pr = classifier.predict_classes(pf)
    # Cast the numpy array predicted values as a list.
    return list(map(lambda x: int(x), pr))


def apply(input):
    """Pass in a csv image file and output prediction."""
    output = predict(input)
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
If you would like to check this demo out on the platform you can find it here: <a href="https://algorithmia.com/algorithms/stephanie/keras_guide">Keras Demo</a>

That's it for hosting your <a href="https://keras.io/">Keras</a> model on Algorithmia!
