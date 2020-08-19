---
layout: article
title:  "XGBoost"
excerpt: "Deploy your XGBoost model to Algorithmia."
categories: model-guides
tags: [algo-model-guide]
show_related: true
author: steph_kim
permalink: /model-deployment/xgboost/
redirect_from:
  - /algorithm-development/model-guides/xgboost/
image:
    teaser: /language_logos/xgboost.png
---

Welcome to deploying your <a href="http://xgboost.readthedocs.io/en/latest/">XGBoost</a> model on Algorithmia!

There are multiple ways to deploy your models on Algorithmia, depending on your workflow. This guide first shows you how to use the web UI to create and deploy your Algorithm. If you prefer a code-only approach to deployment, you can review the sample notebook tutorial at the end, to train and deploy a model to Algorithmia from scratch.


## Table of Contents
* [Deploying through Web UI](#deploying-through-web-ui)
  * [Prerequisites](#prerequisites)
    * [Save your Pre-Trained Model](#save-your-pre-trained-model)
    * [Create a Data Collection](#create-a-data-collection)
    * [Host Your Model File](#host-your-model-file)
  * [Create your Algorithm](#create-your-algorithm)
  * [Set your Dependencies](#set-your-dependencies)
  * [Load your Model](#load-your-model)
    * [Using the SavedModel Method](#using-the-savedmodel-method)
    * [GPU memory tricks](#gpu-memory-tricks)
  * [Publish your Algorithm](#publish-your-algorithm)
* [Deploying From Within Jupyter Notebook](#deploying-from-within-jupyter-notebook)
  * [Creating an Algorithm](#creating-an-algorithm)
  * [Pushing Algorithm Files to Git](#pushing-algorithm-files-to-git)
  * [Programmatically Uploading The Model to Algorithmia](#programmatically-uploading-the-model-to-algorithmia)
  * [Testing Deployed Algorithm](#testing-deployed-algorithm)
  * [Working Model](#working-model)
  

## Deploying through Web UI

### Prerequisites
Before you get started deploying your pre-trained model on Algorithmia, there are a few things you'll want to do first:

#### Save your Pre-Trained Model
You'll want to do the training and saving of your model on your local machine, or the platform you're using for training, before you deploy it to production on the Algorithmia platform.

#### Create a Data Collection
Host your data where you want and serve it to your model with Algorithmia's <a href="http://docs.algorithmia.com/">Data API</a>.

In this guide we'll use Algorithmia's <a href="{{site.baseurl}}/data/hosted">Hosted Data Collection</a>, but you can host it in <a href="{{site.baseurl}}/data/s3">S3</a> or <a href="{{site.baseurl}}/data/dropbox">Dropbox</a> as well. Alternatively, if your data lies in a database, [check out]({{site.baseurl}}/data/dynamodb) how we connected to a DynamoDB database.

First, you'll want to create a data collection to host any data associated with your model and your XGBoost model itself.

- Log into your Algorithmia account and create a data collection via the <a href="{{site.baseurl}}/data/hosted">Data Collections</a> page.

- Click on **“Add Collection”** under the “My Collections” section.

- After you create your collection you can set the read and write access on your data collection.

<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/model_hosting/add_collection.png" alt="Create a data collection" class="screenshot img-sm">

For more information check out: <a href="{{site.baseurl}}/data/hosted">Data Collection Types</a>.

Note, that you can also use the <a href="https://docs.algorithmia.com/#data-uri">Data API</a> to create data collections and upload files.

#### Host Your Model File
Next, upload your serialized model to your newly created data collection.

- Load model by clicking box **“Drop files here to upload”**

- Note the path to your data collection and the zip folder: data://user_name/collections_name/model.zip

<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/model_hosting/XGBoost_data_collection.png" alt="Create a data collection" class="screenshot img-md">

### Create your Algorithm

Hopefully you've already followed along with the <a href="{{site.baseurl}}/algorithm-development/algorithm-basics/your-first-algo">Getting Started Guide</a> for algorithm development. If not, you might want to check it out in order to understand the various permission types, how to enable a GPU environment, and use the CLI.

Once you've gone through the <a href="{{site.baseurl}}/algorithm-development/algorithm-basics/your-first-algo">Getting Started Guide</a>, you'll notice that when you've created your algorithm, there is boilerplate code in the editor that returns "Hello" and whatever you input to the console.

The main thing to note about the algorithm is that it's wrapped in the `apply()` function.

The apply() function defines the input point of the algorithm. We use the apply() function in order to make different algorithms standardized. This makes them easily chained and helps authors think about designing their algorithms in a way that makes them easy to leverage and predictable for end users.

Go ahead and remove the boilerplate code below that's inside the `apply()` function on line 6, but leave the `apply()` function intact:

<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/algo_dev_lang/algorithm_console_python.png" alt="Algorithm console Python" class="screenshot">

#### Set your Dependencies
Now is the time to set your dependencies that your model relies on.

- Click on the **"Dependencies"** button at the top right of the UI and list your packages under the required ones already listed and click **"Save Dependencies"** on the bottom right corner.

<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/model_hosting/XGBoost_dependencies.png" alt="Set your dependencies" class="screenshot img-md">

```
numpy
xgboost
joblib
```

### Load your Model

Here is where you load and run your model which will be called by the apply() function.

When you load your model, our recommendation is to preload your model in a separate function external to the apply() function.

This is because when a model is first loaded it can take time to load depending on the file size.

Then, with all subsequent calls only the apply() function gets called which will be much faster since your model is already loaded.

If you are authoring an algorithm, avoid using the ‘.my’ pseudonym in the source code. When the algorithm is executed, ‘.my’ will be interpreted as the user name of the user who called the algorithm, rather than the author’s user name.
{: .notice-warning}

Note that you always want to create valid JSON input and output in your algorithm. For examples see the [Algorithm Development Guides]({{site.url}}{{site.baseurl}}/algorithm-development/languages/python/#io-for-your-algorithms).

#### Using the SavedModel Method

This is where we'll show how to deploy your saved model to make predictions on the sample data.

{% highlight python %}
import Algorithmia
import pickle
import numpy as np
import xgboost as xgb

client = Algorithmia.client()

def load_model():
  file_path = "data://YOUR_USERNAME/scikit_xgboost_demo/xgboost_boston_model"
  model_file = client.file(file_path).getFile().name
  with open(model_file, 'rb') as f:
      model = pickle.load(f)
      return model

model = load_model()

def process_input(input):
    # Create numpy array from csv file passed as input in apply()
    if input.startswith('data:'):
        file_url = client.file(input).getFile().name
        try:
            np_array = np.genfromtxt(file_url, delimiter=',')
            print(np_array)
            return np_array
        except Exception as e:
            print("Could not create numpy array from data", e)
            sys.exit(0)

# API calls will begin at the apply() method, with the request body passed as 'input'
# For more details, see {{site.url}}{{site.baseurl}}/algorithm-development/languages
def apply(input):
	# Expects a csv file
    np_data = process_input(input)
    prediction = model.predict(np_data)
    return "hello {}".format(prediction)

{% endhighlight %}

### Publish your Algorithm
Last is publishing your algorithm. The best part of deploying your model on Algorithmia is that users can access it via an API that takes only a few lines of code to use! Here is what you can set when publishing your algorithm:

On the upper right hand side of the algorithm page you'll see a purple button "Publish" which will bring up a modal:

<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/algo_dev_lang/publish_algorithm.png" alt="Publish an algorithm" class="screenshot img-sm">

In this modal, you'll see a Changes tab, a Sample I/O tab, and one called Versioning.

If you don't recall from the <a href="{{site.baseurl}}/algorithm-development/algorithm-basics/your-first-algo">Getting Started Guide</a> how to go through the process of publishing your model, check that out before you finish publishing.

If you want to have a better idea of what a finished XGBoost algorithm looks like loading a XGBoost model, check out: <a href="https://algorithmia.com/algorithms/demo/scikitlearnxgboostdemo">scikitlearnxgboostdemo</a>.

That's it for hosting your XGBoost model on Algorithmia!


## Deploying From Within Jupyter Notebook
This section demonstrates how you can create an algorithm on Algorithmia, push your algorithm script, your dependency file and your saved model file to Algorithmia all programmatically from within a Jupyter notebook.


If you'd like to follow along this tutorial and reproduce the steps, you can clone the example notebook under the repository at [XGBoost Jupyter Notebook Demo](https://github.com/algorithmiaio/model-deployment/tree/master/xgboost_notebook_to_algorithmia). This example contains:
- The training data 
- Python utility functions to help with our programmatic interactions with Algorithmia
- The runnable Jupyter notebook

Before you get started, you'll also want to make sure that you have the [official Algorithmia Python Client](https://pypi.python.org/pypi/algorithmia/1.0.5) installed on your development environment:
```
pip install algorithmia
```
For more information on using the Python Client you can go to the [Algorithmia API docs](http://docs.algorithmia.com/?python#).

For this example, we will also use some utility functions defined on our [Algorithmia utility script here](https://github.com/algorithmiaio/model-deployment/blob/master/xgboost_notebook_to_algorithmia/algorithmia_utils.py) This script encapsulates the related calls to Algorithmia, through its [Python API](https://algorithmia.com/developers/clients/python). 

You can import both of these packages as follows:

```python
import Algorithmia
import algorithmia_utils
```

### Creating an Algorithm

First start by providing your username and Algorithmia API key:

If you aren't logged in, make sure to replace <code>YOUR&lowbar;USERNAME</code> with your name & <code>YOUR&lowbar;API&lowbar;KEY</code> with your API key.
{: .notice-warning}

{% raw %}
<div ng-controller="GettingStartedControl" ng-init="setCardContent('YOUR_USERNAME')" class="gs-code-container">
  <div class="code-toolbar ph-16 pv-8">
    <div class="btn-group dropdown">
      <button type="button" class="btn btn-default dropdown-toggle gs-dropdown pa-0" data-toggle="dropdown">
        <div class="lang-logo white-logo mr-4" ng-class="lang"></div>
        <span ng-bind="languages[lang]" class="mr-4"></span>
        <span class="caret"></span>
      </button>
      <ul class="dropdown-menu gs-languages pv-4" role="menu">
        <li ng-repeat="(language, displayName) in languages" class="mb-0">
          <a class="caption" ng-click="setLang(language)">
            <div class="lang-logo color-logo mr-4" ng-class="language"></div>
            <span ng-bind="displayName"></span>
          </a>
        </li>
      </ul>
    </div>
    <button type="button" class="btn btn-flat text-light-primary copy-btn" ng-click="copyCode(lang)">
      <i class="fa fa-copy"></i>
    </button>
  </div>

<!-- PYTHON -->
  <div class="tab-pane code__pane gs-pane" id="python" ng-show="lang==='python'" ng-cloak><pre class="getting-started-code"><code class="demo-code-sample hljs python">username = <span class="hljs-string">"<span class="hover-info">YOUR_USERNAME<div class="hover-content card pa-16" ng-bind-html="cardContent"></div></span>"</span>
api_key = <span class="hljs-string">"<span class="hover-info">YOUR_API_KEY<div class="hover-content card pa-16" ng-bind-html="cardContent"></div></span>"</span>
</code></pre><textarea id="python-copy-text" class="copy-text">
username = "YOUR_USERNAME"
api_key = "YOUR_API_KEY"</textarea></div>
</div>
{% endraw %}


And continue with defining the name of the algorithm you want to create and your local path to clone the repository. An example definition would be:

```python
algo_name = "xgboost_basic_sentiment_analysis"
local_dir = "../algorithmia_repo"
```

Now you can use the utility functions to create the algorithm and clone it on your configured path:
```python
algo_utility = algorithmia_utils.AlgorithmiaUtils(api_key, username, algo_name, local_dir)
algo_utility.create_algorithm()
algo_utility.clone_algorithm_repo()
```

### Creating the Algorithm Script and Dependencies
The folllowing code pieces programmatically creates the algorithm script that handles our requests, and the dependency file that is used when building the container for our algorithm on the Algorithmia environment.

For this we will use the  `%%writefile` macro, but you can always use another editor to edit and save your files.


```python
%%writefile $algo_utility.algo_script_path
import Algorithmia
import joblib
import numpy as np
import pandas as pd
import xgboost

model_path = "data://asli/xgboost_demo/musicalreviews_xgb_model.pkl"
client = Algorithmia.client()
model_file = client.file(model_path).getFile().name
loaded_xgb = joblib.load(model_file)

# API calls will begin at the apply() method, with the request body passed as 'input'
# For more details, see algorithmia.com/developers/algorithm-development/languages
def apply(input):
    series_input = pd.Series([input])
    result = loaded_xgb.predict(series_input)
    # Returning the first element of the list, as we'll be taking a single input for our demo purposes
    # As you'll see while building the model: 0->negative, 1->positive
    return {"sentiment": result.tolist()[0]}
```


```python
%%writefile $algo_utility.dependency_file_path
algorithmia>=1.0.0,<2.0
scikit-learn
pandas
numpy
joblib
xgboost
```



### Pushing Algorithm Files to Git
With the following function call, you will be uploading your changes to the remote repo on Algorithmia and your algorithm will be built on the Algorithmia servers.


```python
algo_utility.push_algo_script_with_dependencies()
```


### Building the XGBoost Model
The steps to train and validate an XGBoost model are omitted here but you can check them out on [our fully working example repository.](https://github.com/algorithmiaio/model-deployment/tree/master/xgboost_notebook_to_algorithmia)



### Programmatically Uploading the Model to Algorithmia
Assuming that you have a saved model file after your training and validation steps, you can call the Algorithmia utility function to take your saved model from its local path and put it on a data container on Algorithmia.


```python
algorithmia_data_path = "data://asli/xgboost_demo"
algo_utility.upload_model_to_algorithmia(local_path, algorithmia_data_path, model_name)
```

### Testing Deployed Algorithm
Now you are up and ready with a perfectly scalable algorithm on Algorithmia, waiting for its visitors!

Below is an example call to [our sentiment analysis example algorithm](https://algorithmia.com/algorithms/asli/xgboost_basic_sentiment_analysis) algorithm, using our utility function to call its latest version.


```python
test_input = "It doesn't work quite as expected. Not worth your money!"
algo_result = algo_utility.call_latest_algo_version(pos_test_input)
print(algo_result.metadata)
print("Sentiment result: {}".format(algo_result.result["sentiment"]))
```

    Metadata(content_type='json',duration=0.020263526,stdout=None)
    Sentiment for the given text is: 0


### Working Model

You can check out the final working algorithm is in action at [Basic Sentiment Analysis with XGBoost](https://algorithmia.com/algorithms/asli/xgboost_basic_sentiment_analysis)