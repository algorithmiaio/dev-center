---
layout: article
title:  "PyTorch"
excerpt: "Deploying your PyTorch model to Algorithmia."
categories: model-guides
tags: [algo-model-guide]
show_related: true
permalink: /model-deployment/pytorch/
redirect_from:
  - /algorithm-development/model-guides/pytorch/
image:
    teaser: /language_logos/pytorch.png
---

Welcome to deploying your <a href="http://pytorch.org/">PyTorch</a> model on Algorithmia!

This guide is designed as an introduction to deploying a PyTorch model and publishing an algorithm even if you’ve never used Algorithmia before.

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
Before you get started deploying your Pytorch model on Algorithmia there are a few things you'll want to do first:

### Save your Pre-Trained Model

You'll want to do the training and saving of your model on your local machine, or the platform you're using for training, before you deploy it to production on the Algorithmia platform.

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

- Note the path to your files: data://username/collections_name/file_name.zip

<img src="{{site.baseurl}}/images/post_images/model_hosting/pytorch_add_collection.png" alt="Create a data collection" class="screenshot img-md">

## Create your Algorithm
Hopefully you've already followed along with the <a href="{{site.baseurl}}/algorithm-development/algorithm-basics/your-first-algo">Getting Started Guide</a> for algorithm development. If not, you might want to check it out in order to understand the various permission types, how to enable a GPU environment, and use the CLI.

Once you've gone through the <a href="{{site.baseurl}}/algorithm-development/algorithm-basics/your-first-algo">Getting Started Guide</a>, you'll notice that when you've created your algorithm, there is boilerplate code in the editor. If you've chosen the Python 3.X beta PyTorch version when you created your algorithm, then you'll see more verbose boilerplate code. Otherwise it will be a simple "Hello World" algorithm.

The main thing to note about the algorithm is that it's wrapped in the `apply()` function.

The apply() function defines the input point of the algorithm. We use the apply() function in order to make different algorithms standardized. This makes them easily chained and helps authors think about designing their algorithms in a way that makes them easy to leverage and predictable for end users.

Go ahead and remove the boilerplate code below that's inside the `apply()` function at bottom of page, but leave the `apply()` function intact:

<img src="{{site.baseurl}}/images/post_images/model_hosting/algorithm_console_pytorch.png" alt="Algorithm console Python" class="screenshot">

### Set your Dependencies
Now is the time to set your dependencies that your model relies on.

- Click on the **"Dependencies"** button at the top right of the UI and list your packages under the required ones already listed and click **"Save Dependencies"** on the bottom right corner.

<img src="{{site.baseurl}}/images/post_images/model_hosting/pytorch_dependencies.png" alt="Set your dependencies" class="screenshot img-md">

## Load your Model
Here is where you load and run your model which will be called by the apply() function.

When you load your model, our recommendation is to preload your model in a separate function external to the apply() function.

This is because when a model is first loaded it can take time to load depending on the file size.

Then, with all subsequent calls only the apply() function gets called which will be much faster since your model is already loaded.

If you are authoring an algorithm, avoid using the ‘.my’ pseudonym in the source code. When the algorithm is executed, ‘.my’ will be interpreted as the user name of the user who called the algorithm, rather than the author’s user name.
{: .notice-warning}

Note that you always want to create valid JSON input and output in your algorithm. For examples see the <a href="/algorithm-development/languages/python/#io-for-your-algorithms">Client Guides</a>.

### Example Hosted Model (Main):

{% highlight python %}
"""
    An example of how to load a trained model and use it
    to predict labels for labels in the CIFAR-10 dataset.

"""

import Algorithmia
from PIL import Image
import torch
import torchvision
import torchvision.transforms as transforms

client = Algorithmia.client()
classes = ('plane', 'car', 'bird', 'cat',
           'deer', 'dog', 'frog', 'horse', 'ship', 'truck')

def preprocessing(image_path):
    image_file = client.file(image_path).getFile().name
    # Normalize and resize image
    normalize = transforms.Normalize(mean=[0.5, 0.5, 0.5], std=[0.5, 0.5, 0.5])
    preprocess = transforms.Compose(
        [transforms.Resize((32, 32)),
         transforms.ToTensor(), normalize])
    img = Image.open(image_file)
    img.load()
    output = preprocess(img)
    return(output)

def load_model():
    file_path = "data://YOUR_USERNAME/YOUR_DATACOLLECTION/demo_model.t7"
    model_file = client.file(file_path).getFile().name
    return torch.jit.load(model_file).cuda()

model = load_model()

def predict(image):
    image_tensor = image.unsqueeze_(0).float().cuda()
    # Predict the class of the image
    outputs = model(image_tensor)
    _, predicted = torch.max(outputs, 1)
    return predicted

# API calls will begin at the apply() method, with the request body passed as 'input'
# For more details, see algorithmia.com/developers/algorithm-development/languages
def apply(input):
    # data://YOUR_USERNAME/YOUR_DATACOLLECTION/sample_animal1.jpg
    processed_data = preprocessing(input)
    prediction = predict(processed_data)
    predictions = [classes[prediction[j]] for j in range(1)]
    return "Predicted class is:  {0}".format(predictions)

{% endhighlight %}

Where it return the predicted class of the image such as: "Plane"

If you run into any problems or need help, don't hesitate to reach out to our team!

## Publish your Algorithm
Last is publishing your algorithm. The best part of deploying your model on Algorithmia is that users can access it via an API that takes only a few lines of code to use! Here is what you can set when publishing your algorithm:

On the upper right hand side of the algorithm page you'll see a purple button "Publish" which will bring up a modal:

<img src="{{site.baseurl}}/images/post_images/algo_dev_lang/publish_algorithm.png" alt="Publish an algorithm" class="screenshot img-sm">

In this modal, you'll see a Changes tab, a Sample I/O tab, and one called Versioning.

If you don't recall from the <a href="{{site.baseurl}}/algorithm-development/algorithm-basics/your-first-algo">Getting Started Guide</a> how to go through the process of publishing your model, check that out before you finish publishing.

## Working Demo
If you would like to check a demo out on the platform you can find it here: <a href="https://algorithmia.com/algorithms/stephanie/pytorchjitgpu">PyTorchJitGPU</a>

That's it for hosting your <a href="http://pytorch.org/">Pytorch</a> model on Algorithmia!
