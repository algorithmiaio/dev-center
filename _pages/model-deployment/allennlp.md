---
layout: article
title:  "AllenNLP"
excerpt: "Guide to deploying your AllenNLP model on Algorithmia."
categories: model-guides
tags: [algo-model-guide]
show_related: true
author: field_cady
permalink: /model-deployment/allennlp/
redirect_from:
  - /algorithm-development/model-guides/allennlp/
image:
    teaser: /language_logos/allennlp.png
---

Welcome to deploying your <a href="https://allennlp.org/">AllenNLP</a> model on Algorithmia!

This guide is designed as an introduction to deploying a AllenNLP model and publishing an algorithm even if you’ve never used Algorithmia before.

Note: this guide uses the web UI to create and deploy your Algorithm. If you prefer a code-only approach to deployment, review [Algorithm Management]({{site.baseurl}}/algorithm-development/algorithm-management) after reading this guide.
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
Before you get started hosting your model on Algorithmia there are a few things you'll want to do first:

### Save your Pre-Trained Model
You'll want to do the training and saving of your model on your local machine, or the platform you're using for training, before you deploy it to production on the Algorithmia platform.

After training your AllenNLP model, you'll want to save the zipped model so you can upload it to Algorithmia.

### Create a Data Collection
Host your data where you want and serve it to your model with Algorithmia's <a href="http://docs.algorithmia.com/">Data API</a>.

In this guide we'll use Algorithmia's <a href="{{site.baseurl}}/data/hosted">Hosted Data Collection</a>, but you can host it in <a href="{{site.baseurl}}/data/s3">S3</a> or <a href="{{site.baseurl}}/data/dropbox">Dropbox</a> as well. Alternatively, if your data lies in a database, [check out]({{site.baseurl}}/data/dynamodb) how we connected to a DynamoDB database.

First, you'll want to create a data collection to host your pre-trained model.

- Log into your Algorithmia account and create a data collection via the <a href="{{site.baseurl}}/data/hosted">Data Collections</a> page.

- Click on **“Add Collection”** under the “My Collections” section.

- After you create your collection you can set the read and write access on your data collection.

<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/model_hosting/add_collection.png" alt="Create a data collection" class="screenshot img-sm">

For more information check out: <a href="{{site.baseurl}}/data/hosted">Data Collection Types</a>.

Note, that you can also use the <a href="https://docs.algorithmia.com/#data-uri">Data API</a> to create data collections and upload files.

### Host Your Model File
Next, upload your pickled model to your newly created data collection.

- Load model by clicking box **“Drop files here to upload”**

- Note the path to your files: data://username/collections_name/zipped_model.tar.gz

<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/model_hosting/add_collections_visual.png" alt="Create a data collection" class="screenshot img-md">

## Create your Algorithm
Hopefully you've already followed along with the <a href="{{site.baseurl}}/algorithm-development/algorithm-basics/your-first-algo">Getting Started Guide</a> for algorithm development. If not, you might want to check it out in order to understand the various permission types, how to enable a GPU environment, and use the CLI.

Once you've gone through the <a href="{{site.baseurl}}/algorithm-development/algorithm-basics/your-first-algo">Getting Started Guide</a>, you'll notice that when you've created your algorithm, there is boilerplate code in the editor that returns "Hello" and whatever you input to the console.

The main thing to note about the algorithm is that it's wrapped in the `apply()` function.

The apply() function defines the input point of the algorithm. We use the apply() function in order to make different algorithms standardized. This makes them easily chained and helps authors think about designing their algorithms in a way that makes them easy to leverage and predictable for end users.

Go ahead and remove the boilerplate code below that's inside the `apply()` function on line 6, but leave the `apply()` function intact:

<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/algo_dev_lang/algorithm_console_python.png" alt="Algorithm console Python" class="screenshot">

### Set your Dependencies
Now is the time to set your dependencies that your model relies on.

- Click on the **"Dependencies"** button at the top right of the UI and list your packages under the required ones already listed and click **"Save Dependencies"** on the bottom right corner.

<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/model_hosting/dependencies_allennlp.png" alt="Set your dependencies" class="screenshot img-md">

If you're following along with this tutorial, go ahead and copy and paste the libraries listed into the dependency file, adding to the ones already there:

{% highlight python %}
algorithmia>=1.0.0,<2.0
six
numpy
spacy==2.0.18 # if you change this, the algorithm will take longer to run and compile
torch==1.0.0 # if you change this, the algorithm will take longer to run and compile
allennlp>=0.8,<0.9
{% endhighlight %}

The dependency file is the equivalent to a requirements.txt file which pulls the dependencies listed from PyPi.
{: .notice-info}

## Load your Model
Here is where you load and run your model which will be called by the apply() function.

When you load your model, our recommendation is to preload your model in a separate function external to the apply() function.

This is because when a model is first loaded it can take time to load depending on the file size.

Then, with all subsequent calls only the apply() function gets called which will be much faster since your model is already loaded.

If you are authoring an algorithm, avoid using the ‘.my’ pseudonym in the source code. When the algorithm is executed, ‘.my’ will be interpreted as the user name of the user who called the algorithm, rather than the author’s user name.
{: .notice-warning}

Note that you always want to create valid JSON input and output in your algorithm. For examples see the [Algorithm Development Guides]({{site.url}}{{site.baseurl}}/algorithm-development/languages/python/#io-for-your-algorithms).

Now to check out a code example using the <a href="https://allennlp.org/models">Constituency Parsing</a> model published by the AllenNLP team.

### Example Hosted Model:
{% highlight python %}
import Algorithmia
from allennlp.predictors.predictor import Predictor

TRAINED_MODEL_PATH = 'data://YOUR_USERNAME/YOUR_DATACOLLECTION/elmo-constituency-parser-2018.03.14.tar.gz'

def get_predictor():
    model_file_path = client.file(TRAINED_MODEL_PATH).getFile().name
    return Predictor.from_path(model_file_path)

client = Algorithmia.client()
pred = get_predictor()

def apply(input):
    res = pred.predict_json(input)
    if 'debug' in input and input['debug']: return res
    else: return dict(
        tokens=res['tokens'], pos_tags=res['pos_tags'],
        hierplane_tree=res['hierplane_tree'], trees=res['trees'])

{% endhighlight %}

Now when you run this code, the expected input is:
{% highlight python %}
{
  "sentence": "If I bring 10 dollars tomorrow, can you buy me lunch?"
}
{% endhighlight %}

A sample of the expected output:
{% highlight python %}
{
  "tokens": ["If", "I", "bring", "10", "dollars", "tomorrow", ",", "can", "you", "buy", "me", "lunch", "?"],
  "pos_tags": ["IN", "PRP", "VBP", "CD", "NNS", "NN", ",", "MD", "PRP", "VB", "PRP", "NN", "."],
  "trees": "(SQ (SBAR (IN If) (S (NP (PRP I)) (VP (VBP bring) (NP (CD 10) (NNS dollars)) (NP (NN tomorrow))))) (, ,) (MD can) (NP (PRP you)) (VP (VB buy) (NP (PRP me)) (NP (NN lunch))) (. ?))",
  "hierplane_tree": ...
{% endhighlight %}

## Publish your Algorithm
Last is publishing your algorithm. The best part of deploying your model on Algorithmia is that users can access it via an API that takes only a few lines of code to use! Here is what you can set when publishing your algorithm:

On the upper right hand side of the algorithm page you'll see a purple button "Publish" which will bring up a modal:

<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/algo_dev_lang/publish_algorithm.png" alt="Publish an algorithm" class="screenshot img-sm">

In this modal, you'll see a Changes tab, a Sample I/O tab, and one called Versioning.

If you don't recall from the <a href="{{site.baseurl}}/algorithm-development/algorithm-basics/your-first-algo">Getting Started Guide</a> how to go through the process of publishing your model, check that out before you finish publishing.

For more information and detailed steps: <a href="{{site.baseurl}}/algorithm-development/your-first-algo">creating and publishing your algorithm</a>

## Working Demo
If you would like to check this demo out on the platform you can find it here: <a href="https://algorithmia.com/algorithms/allenai/constituency_parsing/source">constituency_parsing</a>

That's it for hosting your <a href="https://allennlp.org/">AllenNLP</a> model on Algorithmia!
