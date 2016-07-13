---
layout: article
title:  "Hosting your Caffe model"
excerpt: "Guide to hosting your Caffe model on Algorithmia."
date:   2016-05-26 14:28:42
permalink: /algorithm-development/model-guides/caffe
tags: [algo-model-guide]
show_related: true
author: steph_kim
image:
    teaser: /language_logos/python.png
---


Welcome to hosting your <a href="http://caffe.berkeleyvision.org/">Caffe</a> model on Algorithmia!
This guide is designed as an introduction to hosting a Caffe model and publishing an algorithm even if you’ve never used Algorithmia before.


## Prerequisites
Maybe you've got a great idea or have tirelessly worked on a project in your spare time and you want it to be useful to others. Before you get started hosting your model on Algorithmia there are a few things you'll want to do first:

#### Train your model.
You have a model that labels images. You've discovered the features you want to include, you've trained your model and validated it. You're happy with your results and have saved your model files so you can upload it to Algorithmia.

## Create a Data Collection
Here you'll want to create a data collection to host your Caffe model.

- To use the Data API, log into your Algorithmia account and create a data collection via the <a href="https://algorithmia.com/data/hosted">Data Collections</a> page.

- Click on “Add Collection” under the “My Collections” section on your data collections page.

- After you create your collection you can set the read and write access on your data collection. For more information check out: <a href="http://developers.algorithmia.com/application-development/data-sources/hosted-data-guide/">Data Collection Types</a>


<img src="/images/post_images/model_hosting/add_collection.png" alt="Create a data collection" style="width: 700px;"/>

### Upload your Model into a Collection
Next, upload your model files to your newly created data collection.

- Load model by clicking box “Drop files here to upload”

- Note the path to your files: 
    - data://username/collections_name/file_name.prototxt.txt, 
    - data://username/collections_name/file_name.caffemodel

<img src="/images/post_images/model_hosting/caffe_update_collections.png" alt="Create a data collection" style="width: 700px;"/>

## Create your Algorithm
Creating your algorithm is easy!

- To add an algorithm, simply click “Add Algorithm” from the user profile icon.
- Name your algorithm, select the language, choose permissions and make the code either open or closed source.

**Note**: There is also a checkbox for 'Standard Execution Environment' or 'Advanced GPU'. For deep learning models you will want to check 'Advanced GPU'.

<img src="/images/post_images/model_hosting/create_new_alg.png" alt="Create your algorithm" style="width: 700px;"/>

### Set your Dependencies
Now is the time to set your dependencies that your model relies on.

- Click on the dependencies button at the top right of the UI and list your packages under the required ones already listed and click 'Save Dependencies' on the bottom right corner.

<img src="/images/post_images/model_hosting/caffe_dependencies.png" alt="Set your dependencies" style="width: 700px;"/>

## Load your Model
Now you'll want to run your model which will be called by the apply() function.
Our recommendation is to preload your model in a separate function before apply(). The reasoning behind this is because when your model is first loaded it can take some time to load depending on the file size. However, with all subsequent calls only the apply() function gets called which will be much faster since your model is already loaded!

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
    Data Sources via https://algorithmia.com/data using the Data API
    or as an http request using urllib
    """

    image = caffe.io.load_image(input, color=False)
    out = net.forward_all(data=np.asarray([image]))
    probability_vector = out['prob'][0].argmax(axis=0)
    print(predicted_vector)
    prediction = net.predict([resized_image])

    return prediction
{% endhighlight %}

## Publish your Algorithm
Last is publishing your algorithm. The best part of hosting your model on Algorithmia is that users can access it via an API that takes only a few lines of code to use! Here is what you can set when publishing your algorithm:

- Set version permissions to public or private use

- Set it to royalty free or set to per-call royalty

- Set access permissions to have full access to the internet and ability to call other algorithms

For more information and detailed steps: <a href="http://developers.algorithmia.com/basics/your_first_algo/">creating and publishing your algorithm</a>

<img src="/images/post_images/model_hosting/publish_alg.png" alt="Publish your algorithm" style="width: 700px"/>

That's it for hosting your <a href="http://caffe.berkeleyvision.org/">Caffe</a> model on Algorithmia!
