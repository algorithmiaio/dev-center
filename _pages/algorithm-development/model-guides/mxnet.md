---
layout: article
title:  "MXNet"
excerpt: "Bring your MXNet model to Algorithmia."
categories: model-guides
tags: [algo-model-guide]
show_related: true
author: besir_kurtulmus
image:
    teaser: /language_logos/algo_icon.svg
---

Welcome to hosting your <a href="https://mxnet.incubator.apache.org/">MXNet</a> model on Algorithmia!

This guide is designed as an introduction to hosting a MXNet model and publishing an algorithm even if you’ve never used Algorithmia before.

## Prerequisites
Before you get started hosting your model on Algorithmia there are a few things you'll want to do first:

### Train and save your model.
After training your MXNet model, you'll want to save the model and weights so you can upload it to Algorithmia.

### Create a Data Collection
Here you'll want to create a data collection to host your MXNet model.

- To use the Data API, log into your Algorithmia account and create a data collection via the <a href="https://algorithmia.com/data/hosted">Data Collections</a> page.

- Click on **“Add Collection”** under the “My Collections” section on your data collections page.

- After you create your collection you can set the read and write access on your data collection. For more information check out: <a href="{{ site.baseurl }}/data/hosted/">Data Collection Types</a>


<img src="{{ site.baseurl }}/images/post_images/model_hosting/add_collection_v2.png" alt="Create a data collection" class="screenshot img-sm">

### Upload your Model into a Collection
Next, upload your model files to your newly created data collection.

- Load model by clicking box **“Drop files here to upload”**

- Note the path to your files:
    - data://username/collections_name/resnet-152-0000.params,
    - data://username/collections_name/resnet-152-symbol.json,
    - data://username/collections_name/synset.txt

<img src="{{ site.baseurl }}/images/post_images/model_hosting/mxnet_update_collections.png" alt="Create a data collection" class="screenshot img-md">

## Create your Algorithm
Creating your algorithm is easy!

- To add an algorithm, simply click **“Add Algorithm”** from the user profile icon.
- Name your algorithm, select the language, choose permissions and make the code either open or closed source.

**Note**: There is also a checkbox for 'Standard Execution Environment' or 'Advanced GPU'. For deep learning models you will want to check 'Advanced GPU'.

<img src="{{ site.baseurl }}/images/post_images/model_hosting/create_new_alg_dl_python2_v2.png" alt="Create your algorithm" class="screenshot img-sm">

### Set your Dependencies
Now is the time to set your dependencies that your model relies on.

- Click on the **"Dependencies"** button at the top right of the UI and list your packages under the required ones already listed and click **"Save Dependencies"** on the bottom right corner.

Please note that you will need to use the **mxnet-cu80==0.11.0** package to be able to run a caffe algorithm.
{: .notice-warning}

Also please add the following code snippet to the top of your python script to use the latest MXNet library:

{% highlight python %}
import sys
# Don't use anaconda2 version of MXNet, it's too old
sys.path.remove("/opt/anaconda2/lib/python2.7/site-packages/mxnet-0.9.4-py2.7-linux-x86_64.egg")
{% endhighlight %}

<img src="{{ site.baseurl }}/images/post_images/model_hosting/mxnet_dependencies.png" alt="Set your dependencies" class="screenshot img-md">

## Load your Model
Now you'll want to run your model which will be called by the apply() function.
Our recommendation is to preload your model in a separate function before apply(). The reasoning behind this is because when your model is first loaded it can take some time to load depending on the file size. However, with all subsequent calls only the apply() function gets called which will be much faster since your model is already loaded!

Here is an example for loading your model based on the Predict with pre-trained models based on <a href="https://mxnet.incubator.apache.org/tutorials/python/predict_image.html">MXNet's official tutorial</a>.

{% highlight python %}
import sys
# Don't use anaconda2 version of MXNet, it's too old
sys.path.remove("/opt/anaconda2/lib/python2.7/site-packages/mxnet-0.9.4-py2.7-linux-x86_64.egg")
import Algorithmia
import mxnet as mx
import os
import cv2
import numpy as np
from collections import namedtuple
Batch = namedtuple('Batch', ['data'])

class AlgorithmError(Exception):
     def __init__(self, value):
         self.value = value
     def __str__(self):
         return repr(self.value)

client = Algorithmia.client()

def download_model_files():
    params = "data://deeplearning/mxnet_demo/resnet-152-0000.params"
    symbol = "data://deeplearning/mxnet_demo/resnet-152-symbol.json"
    synset = "data://deeplearning/mxnet_demo/synset.txt"

    params_path = "/tmp/resnet-152-0000.params"
    symbol_path = "/tmp/resnet-152-symbol.json"
    synset_path = "/tmp/synset.txt"

    params_temp_path = client.file(params).getFile().name
    symbol_temp_path = client.file(symbol).getFile().name
    synset_temp_path = client.file(synset).getFile().name

    os.rename(params_temp_path, params_path)
    os.rename(symbol_temp_path, symbol_path)
    os.rename(synset_temp_path, synset_path)

    return {"params": params_path, "symbol": symbol_path, "synset": synset_path}

def init_model(params_path, symbol_path, synset_path):
    sym, arg_params, aux_params = mx.model.load_checkpoint("/tmp/resnet-152", 0)
    mod = mx.mod.Module(symbol=sym, context=mx.cpu(), label_names=None)
    mod.bind(for_training=False, data_shapes=[("data", (1,3,224,224))],
             label_shapes=mod._label_shapes)
    mod.set_params(arg_params, aux_params, allow_missing=True)
    with open(synset_path, 'r') as f:
        labels = [l.rstrip() for l in f]

    return {"sym": sym, "arg_params": arg_params, "aux_params": aux_params, "model": mod, "labels": labels}

files = download_model_files()
model_stuff = init_model(files["params"], files["symbol"], files["synset"])

def predict(imageData):
    img = get_image(imageData, show=True)
    # compute the predict probabilities
    model_stuff["model"].forward(Batch([mx.nd.array(img)]))
    prob = model_stuff["model"].get_outputs()[0].asnumpy()
    # print the top-5
    prob = np.squeeze(prob)
    a = np.argsort(prob)[::-1]
    for i in a[0:5]:
        return {"probability": float(prob[i]), "label": str(model_stuff["labels"][i])}

def get_image(url, show=False):
    # download and show the image
    # fname = mx.test_utils.download(url)
    data_path = client.algo("util/SmartImageDownloader/0.2.16").pipe(url).result["savePath"][0]
    fname = client.file(data_path).getFile().name
    img = cv2.cvtColor(cv2.imread(fname), cv2.COLOR_BGR2RGB)
    if img is None:
         return None
    # convert into format (batch, RGB, width, height)
    img = cv2.resize(img, (224, 224))
    img = np.swapaxes(img, 0, 2)
    img = np.swapaxes(img, 1, 2)
    img = img[np.newaxis, :]
    return img

def apply(input):
    if not isinstance(input, dict):
        raise AlgorithmError("Please provide a valid input.")
    else:
        if "image" not in input:
            raise AlgorithmError("Please provide and image in input.")

    return predict(input["image"])

{% endhighlight %}

If you are authoring an algorithm, avoid using the ‘.my’ pseudonym in the source code. When the algorithm is executed, ‘.my’ will be interpreted as the user name of the user who called the algorithm, rather than the author’s user name.
{: .notice-warning}

## Publish your Algorithm
Last is publishing your algorithm. The best part of hosting your model on Algorithmia is that users can access it via an API that takes only a few lines of code to use! Here is what you can set when publishing your algorithm:

- Set version permissions to public or private use

- Set it to royalty free or set to per-call royalty

- Set access permissions to have full access to the internet and ability to call other algorithms

If you want to have a better idea of how a finished MXNet algorithm looks like, check out: <a href="https://algorithmia.com/algorithms/deeplearning/MXNetResnet152/edit">MXNet Resnet 152</a>

For more information and detailed steps: <a href="{{ site.baseurl }}/algorithm-development/your-first-algo/">creating and publishing your algorithm</a>

<img src="{{ site.baseurl }}/images/post_images/model_hosting/publish_alg.png" alt="Publish your algorithm" class="screenshot img-sm">

That's it for hosting your <a href="https://mxnet.incubator.apache.org/">MXNet</a> model on Algorithmia!
