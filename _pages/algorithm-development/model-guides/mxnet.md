---
layout: article
title:  "MXNet"
excerpt: "Bring your MXNet model to Algorithmia."
categories: model-guides
tags: [algo-model-guide]
show_related: true
author: besir_kurtulmus
<!-- image:
    teaser: /language_logos/mxnet.svg -->
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

Please note that you will need to use the **protobuf==3.0.0b2.post1** package to be able to run a caffe algorithm.
{: .notice-warning}

<img src="{{ site.baseurl }}/images/post_images/model_hosting/caffe_dependencies.png" alt="Set your dependencies" class="screenshot img-md">
