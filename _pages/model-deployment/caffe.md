---
layout: article
title:  "Caffe"
excerpt: "Guide to deploying your Caffe deep learning model on Algorithmia."
categories: model-guides
tags: [algo-model-guide]
show_related: true
author: steph_kim
permalink: /model-deployment/caffe/
redirect_from:
  - /algorithm-development/model-guides/caffe/
image:
    teaser: /language_logos/caffe.png
---


Welcome to deploying your <a href="http://caffe.berkeleyvision.org/">Caffe</a> model on Algorithmia!

This guide is designed as an introduction to deploying a Caffe model and publishing an algorithm even if you’ve never used Algorithmia before.

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
Before you get started deploying your model on Algorithmia there are a few things you'll want to do first:

### Save your Pre-Trained Model
You'll want to do the training and saving of your model on your local machine, or the platform you're using for training, before you deploy it to production on the Algorithmia platform.

After training your Caffe model, you'll want to save the model and weights so you can upload it to Algorithmia.

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
Next, upload your model files to your newly created data collection.

- Load model by clicking box **“Drop files here to upload”**

- Note the path to your files:
    - data://username/collections_name/file_name.prototxt.txt,
    - data://username/collections_name/file_name.caffemodel

<img src="{{site.baseurl}}/images/post_images/model_hosting/caffe_update_collections.png" alt="Create a data collection" class="screenshot img-md">

## Create your Algorithm
Hopefully you've already followed along with the <a href="{{site.baseurl}}/algorithm-development/algorithm-basics/your-first-algo">Getting Started Guide</a> for algorithm development. If not, you might want to check it out in order to understand the various permission types, how to enable a GPU environment, and use the CLI.

Once you've gone through the <a href="{{site.baseurl}}/algorithm-development/algorithm-basics/your-first-algo">Getting Started Guide</a>, you'll notice that when you've created your algorithm, there is boilerplate code in the editor that returns "Hello" and whatever you input to the console.

The main thing to note about the algorithm is that it's wrapped in the `apply()` function.

The apply() function defines the input point of the algorithm. We use the apply() function in order to make different algorithms standardized. This makes them easily chained and helps authors think about designing their algorithms in a way that makes them easy to leverage and predictable for end users.

Go ahead and remove the boilerplate code below that's inside the `apply()` function on line 6, but leave the `apply()` function intact:

<img src="{{site.baseurl}}/images/post_images/model_hosting/deep_learning_algorithm_console.png" alt="Algorithm console Python" class="screenshot">

### Set your Dependencies
Now is the time to set your dependencies that your model relies on.

Here are some Caffe wheels for different versions as well as CPU and GPU wheels:

-   **Caffe 0.1 (CPU)**: https://s3.amazonaws.com/algorithmia-wheels/caffe-0.1.0_cpu-py2-none-any.whl
-   **Caffe 0.1 (GPU)**: https://s3.amazonaws.com/algorithmia-wheels/caffe-0.1.0_gpu-py2-none-any.whl
-   **Caffe 1.05 (CPU)**: https://s3.amazonaws.com/algorithmia-wheels/caffe-01.05.16_b86b0aea60a_cpu-py2-none-any.whl
-   **Caffe 1.05 (GPU)**: https://s3.amazonaws.com/algorithmia-wheels/caffe-01.05.16_b86b0aea60a_gpu-py2-none-any.whl
-   **Caffe build tag 99466 (GPU)**: https://s3.amazonaws.com/algorithmia-wheels/caffe-27.11.17_99466_gpu-py2-none-any.whl


Click on the **"Dependencies"** button at the top right of the UI and list your packages under the required ones already listed and click **"Save Dependencies"** on the bottom right corner.

Please note that you will need to use the **protobuf==3.0.0b2.post1** package to be able to run a caffe algorithm.
{: .notice-warning}

<img src="{{site.baseurl}}/images/post_images/model_hosting/caffe_dependencies.png" alt="Set your dependencies" class="screenshot img-md">

## Load your Model
Here is where you load and run your model which will be called by the apply() function.

When you load your model, our recommendation is to preload your model in a separate function external to the apply() function.

This is because when a model is first loaded it can take time to load depending on the file size.

Then, with all subsequent calls only the apply() function gets called which will be much faster since your model is already loaded.

If you are authoring an algorithm, avoid using the ‘.my’ pseudonym in the source code. When the algorithm is executed, ‘.my’ will be interpreted as the user name of the user who called the algorithm, rather than the author’s user name.
{: .notice-warning}

Note that you always want to create valid JSON input and output in your algorithm. For examples see the <a href="/algorithm-development/languages/python/#io-for-your-algorithms">Client Guides</a>.

Here is an example for loading your model based on the Classifying MNIST digits based on <a href="http://caffe.berkeleyvision.org/gathered/examples/mnist.html">Caffe's tutorial</a>.

{% highlight python %}
import Algorithmia
import numpy as np
import caffe

caffe.set_mode_cpu()

client = Algorithmia.client()

def initialize_model():
    """
    Load caffe.Net model with layers
    """

    # Load model files from user collections
    model_uri = "data://user_name/caffe_demo/lenet.prototxt.txt"
    pretrained_uri = "data://user_name/caffe_demo/lenet_iter_10000.caffemodel"


    model_file = client.file(model_uri).getFile().name
    pretrained_file = client.file(pretrained_uri).getFile().name

    # Create net and load weights
    net = caffe.Net(model_file, pretrained_file, caffe.TEST, raw_scale=1, image_dims=(28, 28))

    return net

# Gets called once
net = initialize_model()

def apply(input):
    """
    Input is an image file

    Input examples:
    Data Sources via https://algorithmia.com/data, or http(s) URLs using the
    Smart Image Downloader.
    """

    client = Algorithmia.client()
    imgDataPath = client.algo("util/SmartImageDownloader").pipe(input).result["savePath"][0]
    imgAbsPath = client.file(imgDataPath).getFile().name

    image = caffe.io.load_image(imgAbsPath, color=False)
    out = net.forward_all(data=np.asarray([image]))
    probability_vector = out['prob'][0].argmax(axis=0)
    print(predicted_vector)
    prediction = net.predict([resized_image])

    return prediction
{% endhighlight %}

## Publish your Algorithm
Last is publishing your algorithm. The best part of deploying your model on Algorithmia is that users can access it via an API that takes only a few lines of code to use! Here is what you can set when publishing your algorithm:

On the upper right hand side of the algorithm page you'll see a purple button "Publish" which will bring up a modal:

<img src="{{site.baseurl}}/images/post_images/algo_dev_lang/publish_algorithm.png" alt="Publish an algorithm" class="screenshot img-sm">

In this modal, you'll see a Changes tab, a Sample I/O tab, and one called Versioning.

If you don't recall from the <a href="{{site.baseurl}}/algorithm-development/algorithm-basics/your-first-algo">Getting Started Guide</a> how to go through the process of publishing your model, check that out before you finish publishing.

If you want to have a better idea of what a finished caffe algorithm looks like, check out: <a href=" https://algorithmia.com/algorithms/deeplearning/CaffeNet/">CaffeNet</a>

For more information and detailed steps: <a href="{{site.baseurl}}/algorithm-development/your-first-algo">creating and publishing your algorithm</a>

That's it for hosting your <a href="http://caffe.berkeleyvision.org/">Caffe</a> model on Algorithmia!
