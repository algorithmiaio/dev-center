---
layout: article
title:  "Keras"
excerpt: "Bring your Keras model to Algorithmia."
categories: model-guides
tags: [algo-model-guide]
show_related: true
author: steph_kim
permalink: /model-deployment/keras/
redirect_from:
  - /algorithm-development/model-guides/keras/
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

- To use the Data API, log into your Algorithmia account and create a data collection via the <a href="{{ site.baseurl }}/data/hosted">Data Collections</a> page.

- Click on **“Add Collection”** under the “My Collections” section on your data collections page.

- After you create your collection you can set the read and write access on your data collection. For more information check out: <a href="{{ site.baseurl }}/data/hosted/">Data Collection Types</a>

<img src="{{ site.baseurl }}/images/post_images/model_hosting/add_collection.png" alt="Create a data collection" class="screenshot img-sm">

### Upload your Model into a Collection
Next, upload your pickled model to your newly created data collection.

- Load model by clicking box **“Drop files here to upload”**

- Note the path to your files: data://username/collections_name/mnist_model.h5

<img src="{{ site.baseurl }}/images/post_images/model_hosting/keras_data_collection.png" alt="Create a data collection" class="screenshot img-md">

## Create your Algorithm
Creating your algorithm is easy!

- To add an algorithm, simply click **“Add Algorithm”** from the user profile icon.
- Name your algorithm, select the language, choose permissions and make the code either open or closed source.

**Note**: There is also a checkbox for 'Standard Execution Environment' or 'Advanced GPU'. For deep learning models you will want to check 'Advanced GPU'.

<img src="{{ site.baseurl }}/images/post_images/model_hosting/create_new_alg_dl_python3.png" alt="Create your algorithm" class="screenshot img-sm">

Now hit the "Create" button on the bottom lower right of the form and you'll see this modal:

<img src="{{ site.baseurl }}/images/post_images/model_hosting/deep_learning_cli.png" alt="cli info modal" class="screenshot">

You can now clone your Algorithm (via Git) and install the CLI to edit/test locally, **or** you can close the modal and continue to create your algorithm in the Web IDE.

#### Editing your algorithm locally via GIT & CLI

The preferred way to edit and test your Algorithm's code is to install the CLI on your local machine, clone your algorithm's repo via Git, and use your favorite editing tools to modify the code. This gives you the benefits of using a familiar development environment, plus an easy way to test your changes locally before committing changes back to the repo and publishing a new algorithm version.

To learn more about this process, Algorithmia's [CLI]({{ site.baseurl }}/clients/cli/) and [Git]({{ site.baseurl }}/algorithm-development/git/) guides. If you're already familiar with the CLI and Git, the basic steps you need to take are:

1. Install the CLI: `curl -sSLf https://algorithmia.com/install.sh | sh` (Windows instructions [here](https://algorithmia.com/developers/clients/cli/#installing-the-algorithmia-cli) ) 
2. Clone your algorithm: `algo clone username/algoname`
3. Use your preferred editor to modify the code
4. Test your algorithm: `cd algoname; algo runlocal -D [JSON FILE]`
5. Commit your changes: `git commit -m [commit message]; git push origin master`
6. Publish your changes: for now, you must do this via the web IDE:
    1. visit [https://algorithmia.com/user](https://algorithmia.com/user)
    2. click on your algorithm
    3. click "Edit Source"
    4. click "Compile", then "[Publish](#publish-algorithm)"

#### Editing your algorithm via the web IDE

If you prefer to continue creating your algorithm in the Web IDE, simply close the modal and you should see the algorithm description page for your newly created algorithm:

<img src="{{ site.baseurl }}/images/post_images/model_hosting/deep_learning_algorithm_page.png" alt="Algorithm descrption page" class="screenshot">

Notice the tabs: Run, Docs, Cost, Discussion, Manage, and Source.

The tab currently showing "Run" is where users can run the algorithm with the default input that you will provide during the publishing step of the algorithm or they can run their own input to test out your algorithm. Also, on this tab, you can add a short summary stating what your algorithm is and why people might be interested in it (for example how it solves a particular problem in a use case). 

"Docs" consists of the section that you will want to show how to use your algorithm including complete information about the input types allowed and what the expected outputs will be.

"Cost" will be filled out automatically once you publish your algorithm and will show if you've chosen to charge royalites or if you've decided to open source your algorithm. It will also give the estimated cost so the user consuming your algorithm can see how much it will cost.

The "Discussion" tab shows the comments and questions from users so you can keep up to date regarding user feedback. 

Under the "Manage" tab you can see how to clone your algorithm, see what items are checked off in the Algorithm Checklist and see permissions for your algorithm which were set when you created your algorithm.

Finally click on the "Source" tab which will display the UI for creating your algorithm if you prefer it over the CLI.

Algorithmia creates the skeleton for your algorithm and bring you to the Edit Algorithm page. The editor will have the "Hello world" code already filled out for you, as shown below.

<img src="{{ site.baseurl }}/images/post_images/model_hosting/deep_learning_algorithm_console.png" alt="Algorithm console Python" class="screenshot">

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
   "test_data": "data://user_name/keras_data/test.csv"
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
    file_uri = "data://user_name/keras_model/mnist_model.h5"
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

On the upper right hand side of the algorithm page you'll see a purple button "Publish" which will bring up a modal:

<img src="{{ site.baseurl }}/images/post_images/algo_dev_lang/publish_algorithm.png" alt="Publish an algorithm" class="screenshot img-sm">

In this modal, you'll see a Changes tab, a Sample I/O tab, and one called Versioning.

Changes shows you your commit history and release notes.

Sample I/O is where you'll create your sample input and output for the user to try under Try the API in the Run tab. When you add a sample input, make sure to test it out with all the inputs that you accept since users will be able to test your algorithm with their own inputs.

Under the Versioning tab, you can select whether your algorithm will be for public use or private use as well as set the royalty. The algorithm can either be royalty-free or charge per-call. If you opt to have the algorithm charge a royalty, as the author, you will earn 70% of the royalty cost.

Check out [Algorithm Pricing]({{ site.baseurl }}/pricing/) for more information on how much algorithms will cost to run.

Under Semantic Versioning you can choose which kind of release your change should fall under: Major, Minor, or Revision. 

If you are satisfied with your algorithm and settings, go ahead and hit publish. Congratulations, you’re an algorithm developer!

## Working Demo
If you would like to check this demo out on the platform you can find it here: <a href="https://algorithmia.com/algorithms/stephanie/keras_guide">Keras Demo</a>

That's it for hosting your <a href="https://keras.io/">Keras</a> model on Algorithmia!
