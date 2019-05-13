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

Saving and loading models in Pytorch can get tedious, because it requires keeping a copy of your source class code for any models you want to load again. The team at Algorithmia created a module for Python that sidesteps this process, along with a few other optimizations. For more information, check out the GitHub repo <a href="https://github.com/algorithmiaio/pytorch-ergonomics">here</a>.

##### 1. Install and Import the Pytorch-Ergonomics Package

Install the `ergo-pytorch` package using <a href="https://pypi.org/">Pypi</a> with `pip install ergo-pytorch==1.1.1`. Import the base module with `import ergonomics`, or a specific module with `from ergonomics import model_ergonomics`.

##### 2. Save Your Model Using Our Ergonomics Package

Instead of using Pytorch’s built in `model.save()` functionality, use `ergonomics.model_ergonomics.save_portable(source_path)`. This will save your model along with the class code, so you don’t need to copy and paste that later on.

### Create a Data Collection
Host your data where you want and serve it to your model with Algorithmia's <a href="http://docs.algorithmia.com/">Data API</a>.

In this guide we'll use Algorithmia's <a href="{{site.baseurl}}/data/hosted/">Hosted Data Collection</a>, but you can host it in <a href="{{site.baseurl}}/data/s3/">S3</a> or <a href="{{site.baseurl}}/data/dropbox/">Dropbox</a> as well. Alternatively, if your data lies in a database, [check out]({{site.baseurl}}/data/dynamodb/) how we connected to a DynamoDB databasee.

First, you'll want to create a data collection to host your pre-trained model.

- Log into your Algorithmia account and create a data collection via the <a href="{{site.baseurl}}/data/hosted">Data Collections</a> page.

- Click on **“Add Collection”** under the “My Collections” section.

- After you create your collection you can set the read and write access on your data collection.

<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/model_hosting/add_collection.png" alt="Create a data collection" class="screenshot img-sm">

For more information check out: <a href="{{site.baseurl}}/data/hosted/">Data Collection Types</a>.

Note, that you can also use the <a href="https://docs.algorithmia.com/#data-uri">Data API</a> to create data collections and upload files.

### Host Your Model File
Next, upload your pickled model to your newly created data collection.

- Load model by clicking box **“Drop files here to upload”**

- Note the path to your files: data://username/collections_name/file_name.zip

<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/model_hosting/pytorch_add_collection.png" alt="Create a data collection" class="screenshot img-md">

## Create your Algorithm
Hopefully you've already followed along with the <a href="{{site.baseurl}}/algorithm-development/algorithm-basics/your-first-algo/">Getting Started Guide</a> for algorithm development. If not, you might want to check it out in order to understand the various permission types, how to enable a GPU environment, and use the CLI.

Once you've gone through the <a href="{{site.baseurl}}/algorithm-development/algorithm-basics/your-first-algo/">Getting Started Guide</a>, you'll notice that when you've created your algorithm, there is boilerplate code in the editor that returns "Hello" and whatever you input to the console.

The main thing to note about the algorithm is that it's wrapped in the `apply()` function.

The apply() function defines the input point of the algorithm. We use the apply() function in order to make different algorithms standardized. This makes them easily chained and helps authors think about designing their algorithms in a way that makes them easy to leverage and predictable for end users.

Go ahead and remove the boilerplate code below that's inside the `apply()` function on line 6, but leave the `apply()` function intact:

<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/algo_dev_lang/algorithm_console_python.png" alt="Algorithm console Python" class="screenshot">

### Set your Dependencies
Now is the time to set your dependencies that your model relies on.

- Click on the **"Dependencies"** button at the top right of the UI and list your packages under the required ones already listed and click **"Save Dependencies"** on the bottom right corner.

<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/model_hosting/pytorch_dependencies.png" alt="Set your dependencies" class="screenshot img-md">

For easy copy and paste:
{% highlight python %}
https://s3.amazonaws.com/algorithmia-wheels/torch_cpu-0.4.0a0+a3d08de-cp35-cp35m-linux_x86_64.whl
https://s3.amazonaws.com/algorithmia-wheels/torchvision-0.2.0-py2.py3-none-any.whl
ergo-pytorch==1.0.4
{% endhighlight %}

If you're using the CPU implementation of Pytorch, you can add `torch` directly to the dependencies. If you're using a GPU version, you'll need to use our customized `.whl` file. You can find it <a href="https://s3.amazonaws.com/algorithmia-wheels/torch_gpu-0.3.1b0+2b47480-cp35-cp35m-linux_x86_64.whl">here</a>, and read about it in more detail on the ergo-pytorch <a href="https://github.com/algorithmiaio/pytorch-ergonomics">repo</a>.

## Load your Model
Here is where you load and run your model which will be called by the apply() function.

When you load your model, our recommendation is to preload your model in a separate function external to the apply() function.

This is because when a model is first loaded it can take time to load depending on the file size.

Then, with all subsequent calls only the apply() function gets called which will be much faster since your model is already loaded.

If you are authoring an algorithm, avoid using the ‘.my’ pseudonym in the source code. When the algorithm is executed, ‘.my’ will be interpreted as the user name of the user who called the algorithm, rather than the author’s user name.
{: .notice-warning}

Note that you always want to create valid JSON input and output in your algorithm. For examples see the <a href="/algorithm-development/languages/python/#io-for-your-algorithms">Client Guides</a>.

### CPUs vs. GPUs on Pytorch

Pytorch offers a few different distributions for download that are split by CPU and GPU. The Pytorch files for CPU usage are normal sized, but when using the GPU packages the files can get very large.

For GPU based implementations we've created a workaround that loads the files much faster than the default. When using the workaround, the main file stays the same (see example hosted model below) but you'll need to create an extra file that executes the workaround. See the second example `implement.py` for how to do this.

### Example Hosted Model (Main):

{% highlight python %}
"""
    An example of how to load a trained model and use it
    to predict labels for labels in the CIFAR-10 dataset.

"""

import Algorithmia
from PIL import Image
import numpy as np
import torch
from torch.autograd import Variable
from torchvision import transforms
import os
import ergonomics.model_ergonomics as ergonomics

client = Algorithmia.client()

def load_model(path):
    newCNN = ergonomics.serialization.load_portable('MODEL_PATH')
    return newCNN

def preprocess(input_image):
    file_url = client.file(input_image).getFile().name
    #Normalize and resize image
    normalize = transforms.Normalize(mean=[0.5, 0.5, 0.5], std=[0.5, 0.5, 0.5])
    composed = transforms.Compose([transforms.Resize(32), transforms.ToTensor(),normalize])
    img = Image.open(file_url)
    img.load()
    output = composed(img)
    return output

def predict(input, newCNN):
    outputs = newCNN(Variable(torch.stack([input])))
    _, predicted = torch.max(outputs.data, 1)
    return int(predicted.numpy())

def apply(input):
    classes = ['plane', 'car', 'bird', 'cat', 'deer', 'dog', 'frog', 'horse', 'ship', 'truck']
    newCNN = load_portable('MODEL_PATH')
    outputs = []
    for input_url in input['urls']:
        processed = preprocess(input_url)
        output = predict(processed, newCNN)
        outputs.append(classes[output])

    return {"output" : outputs}


{% endhighlight %}

If you're using GPUs, you'll also need to create a second file to implement the workaround:

### Example Workaround File:

{% highlight python %}
"""
    An example of how to speed up execution of your main code file.
"""

import Algorithmia
from ergonomics.algorithm_ergonomics import execute_workaround

client = Algorithmia.client()

def load_pytorch_model():
    filename = 'data://gagejustins/Pytorch/simpleCNN.zip'
    model_loc = client.file(filename).getFile().name
    return model_loc

model_loc = load_pytorch_model()

def parseInputs(input):
    #Iterate through input and append urls to input_urls list
    output = {'urls': []}
    if isinstance(input, dict):
        if 'test_data' in input and isinstance(input['test_data'], str):
            output['urls'].append(input['test_data'])
        elif 'test_data' in input and isinstance(input['test_data'], list):
            output['urls'] = input['test_data']
        else:
            raise AlgorithmError("AlgoError3000: Invalid input")

    return output


def apply(input):
    #Define classes
    #Parse input into list of input_urls
    formatted = parseInputs(input)
    formatted['local_model_path'] = model_loc
    #Apply algorithm to inputs and append output to outputs list
    output = execute_workaround(formatted, "src/main.py", "execute")

    return output

{% endhighlight %}

Now when you run this code, the expected input is:
{% highlight python %}
{
   "test_data": ["data://user_name/pytorch_data/horse.jpg",
   "data://user_name/pytorch_data/frog.jpg"]
}
{% endhighlight %}

With the expected output:
{% highlight python %}
{
  "output": [
    "horse",
    "frog"
  ]
}
{% endhighlight %}

If you run into any problems or need help, don't hesitate to reach out to our team!

## Publish your Algorithm
Last is publishing your algorithm. The best part of deploying your model on Algorithmia is that users can access it via an API that takes only a few lines of code to use! Here is what you can set when publishing your algorithm:

On the upper right hand side of the algorithm page you'll see a purple button "Publish" which will bring up a modal:

<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/algo_dev_lang/publish_algorithm.png" alt="Publish an algorithm" class="screenshot img-sm">

In this modal, you'll see a Changes tab, a Sample I/O tab, and one called Versioning.

If you don't recall from the <a href="{{site.baseurl}}/algorithm-development/algorithm-basics/your-first-algo/">Getting Started Guide</a> how to go through the process of publishing your model, check that out before you finish publishing.

## Working Demo
If you would like to check this demo out on the platform you can find it here: <a href="https://algorithmia.com/algorithms/algorithmiahq/pytorchDemo">Pytorch CNN Demo.</a>

That's it for hosting your <a href="http://pytorch.org/">Pytorch</a> model on Algorithmia!
