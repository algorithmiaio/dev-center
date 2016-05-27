---
layout: article
title:  "Hosting your nltk model"
excerpt: "Guide to hosting your nltk model on Algorithmia."
date:   2016-05-16 14:28:42
permalink: /algorithm-development/guides/nltk-guide
tags: [algo-model-guide]
show_related: true
author: steph_kim
---


Welcome to hosting your nltk model on Algorithmia!
This guide is designed as an introduction to hosting a nltk model and publishing an algorithm even if you’ve never used Algorithmia before.

### Create a Data Collection

- To use the Data API, log into your Algorithmia account and create a data collection via the <a href="https://algorithmia.com/data">Data Collections</a> page.

- Click the “Manage Data” link from the user profile icon dropdown in the upper right-hand corner.

- Click on “Add Collection” under the “My Collections” section on your data collections page.

- Set the read and write access on your collection. For more information check out: <a href="http://docs.algorithmia.com/?shell#collection-types">Data Collection Types</a>


<img src="/images/post_images/model_hosting/add_collections_visual.png" alt="Create a data collection" style="width: 700px;"/>

### Upload your Model into a Collection

- Load model by clicking box “Drop files here to upload”

- Note the path to your files: data://username/collections_name/pickled_model.pkl

### Set your Dependencies

- Click on the dependencies button at the top right of the UI and list your packages under the required ones already listed and save at the button on the bottom right corner.

### Create your Algorithm
- To add an algorithm, simply click “Add Algortithm” from the user profile icon.
- Name, select the language, choose permissions and make the code either open or closed source.

<img src="/images/post_images/model_hosting/create_new_alg.png" alt="Create your algorithm" style="width: 700px;"/>

### Load your Model

{% highlight python %}
import pickle
import zipfile
import Algorithmia
import nltk

def loadModel():
    # Get file by name
    client = Algorithmia.client()
    # Open file and load model
    file_path = 'data://.my/colllections_name/model_file.pkl.zip'
    model_path = client.file(file_path).getFile().name
    # unzip compressed model file
    zip_ref = zipfile.Zipfile(model_path, ‘r’)
    zip_ref.extract('model_file.pkl’)
    zip_ref.close()
    # load model into memory
    model_file = open(‘model_file.pkl’, ‘rb’)
    model = pickle.load(model_file)
    model_file.close()
    return model

def apply(input):
    client = Algorithmia.client()
    model = loadModel()
    # Do something with your model and return your output for the user
    return some_data
{% endhighlight %}

### Publish your Algorithm
- Set version permissions to public or private use

- Set it to royalty free or set to per-call royalty

- Set access permissions to have full access to the internet and ability to call other algorithms

- For more information and detailed steps: <a href="http://developers.algorithmia.com/basics/your_first_algo/">creating and publishing your algorithm</a>

<img src="/images/post_images/model_hosting/publish_alg.png" alt="Publish your algorithm" style="width: 700px"/>

That's it for hosting your nltk model on Algorithmia!
