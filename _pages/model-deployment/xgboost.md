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

There are multiple ways to deploy your models on Algorithmia, depending on your workflow. This guide first shows you how to use the web UI to create and deploy your Algorithm If you prefer a code-only approach to deployment, you can review the sample notebook tutorial at the end, to train and deploy a model to Algorithmia from scratch.


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
  * [Cloning the Working Repo](#cloning-the-working-repo)
  * [Building the XGBoost model](#building-the-xgboost-model)
  * [Programmatically Uploading Your Model to Algorithmia](#programmatically-uploading-your-model-to-algorithmia)
  * [Testing your deployment](#testing-your-model)
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

#API calls will begin at the apply() method, with the request body passed as 'input'
#For more details, see {{site.url}}{{site.baseurl}}/algorithm-development/languages
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
In this section, we will use a Jupyter notebook to create and train an XGBoost model step by step. Once our model is ready, we will then programmatically upload it to Algorithmia along with the algorithm code that loads the saved model into memory and serves our predictions upon incoming requests.

As an example, we will build a simple sentiment classification model trained on [Amazon's Musical Instrument Reviews dataset](https://www.kaggle.com/eswarchandt/amazon-music-reviews?select=Musical_instruments_reviews.csv). Once our algorithm is deployed on Algorithmia, we will be able to send some text input to it and get the model's sentiment prediction of this input. 

So let's get started!

### Cloning the working repo

If you'd like to follow along this tutorial and reproduce the steps of this notebook, you can clone the example notebook under the repository at [XGBoost Jupyter Notebook Demo](https://github.com/algorithmiaio/model-deployment/tree/master/xgboost_notebook_to_algorithmia). This example contains:
- The training data 
- Python utility functions to help with our programmatic interactions with Algorithmia
- The runnable Jupyter notebook

Before you get started, you'll also want to make sure that you have all the imported Python packages on your development environment.


### Create your algorithm

Let's first create an algorithm on Algorithmia and then build on it step by step.
After importing the necessary packages, we'll define the variables to use across many of our calls to Algorithmia, through its [Python API](https://algorithmia.com/developers/clients/python).


```python
import Algorithmia
import algorithmia_utils
```


```python
api_key = "YOUR_API_KEY"
username = "YOUR_USERNAME"
algo_name = "xgboost_basic_sentiment_analysis"
local_dir = "../algorithmia_repo"

algo_utility = algorithmia_utils.AlgorithmiaUtils(api_key, username, algo_name, local_dir)
```

#### Creating the algorithm and cloning its repo
You would only need to do this step once, because you only need one algorithm and cloning it once on your local environment is enough.

For these operations, we will use the utility functions defined on our imported [Algorithmia utility script](https://github.com/algorithmiaio/model-deployment/blob/master/xgboost_notebook_to_algorithmia/algorithmia_utils.py)


```python
# You would need to call these two functions only once
algo_utility.create_algorithm()
algo_utility.clone_algorithm_repo()
```

#### Adding the algorithm script and the dependencies
Let's create the algorithm script that will run when we make our requests and the dependency file that will be used when building the container for our algorithm on the Algorithmia environment.

We will be creating these two files programmatically with the `%%writefile` macro, but you can always use another editor to edit and save them later when you need.


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


#### Adding these files to Git, commiting and pushing
Now we're ready to upload our changes to our remote repo on Algorithmia and our algorithm will be built on the Algorithmia servers and get ready to accept our requests.


```python
algo_utility.push_algo_script_with_dependencies()
```


### Building the XGBoost model
Now it's time to build our model!


```python
from sklearn.model_selection import train_test_split, RandomizedSearchCV
from sklearn.preprocessing import StandardScaler  # for scaling
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import accuracy_score
from sklearn.feature_extraction.text import CountVectorizer, TfidfTransformer
from sklearn.pipeline import Pipeline

from string import punctuation
from nltk.corpus import stopwords

from scipy.stats import uniform

from xgboost import XGBClassifier
import pandas as pd
import numpy as np
import joblib
```

#### Load the training data
Let's load our training data, take a look at a few rows and one of the review texts in detail.


```python
data = pd.read_csv("./data/amazon_musical_reviews/Musical_instruments_reviews.csv")
data.head()
```




<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>reviewerID</th>
      <th>asin</th>
      <th>reviewerName</th>
      <th>helpful</th>
      <th>reviewText</th>
      <th>overall</th>
      <th>summary</th>
      <th>unixReviewTime</th>
      <th>reviewTime</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>A2IBPI20UZIR0U</td>
      <td>1384719342</td>
      <td>cassandra tu "Yeah, well, that's just like, u...</td>
      <td>[0, 0]</td>
      <td>Not much to write about here, but it does exac...</td>
      <td>5.0</td>
      <td>good</td>
      <td>1393545600</td>
      <td>02 28, 2014</td>
    </tr>
    <tr>
      <th>1</th>
      <td>A14VAT5EAX3D9S</td>
      <td>1384719342</td>
      <td>Jake</td>
      <td>[13, 14]</td>
      <td>The product does exactly as it should and is q...</td>
      <td>5.0</td>
      <td>Jake</td>
      <td>1363392000</td>
      <td>03 16, 2013</td>
    </tr>
    <tr>
      <th>2</th>
      <td>A195EZSQDW3E21</td>
      <td>1384719342</td>
      <td>Rick Bennette "Rick Bennette"</td>
      <td>[1, 1]</td>
      <td>The primary job of this device is to block the...</td>
      <td>5.0</td>
      <td>It Does The Job Well</td>
      <td>1377648000</td>
      <td>08 28, 2013</td>
    </tr>
    <tr>
      <th>3</th>
      <td>A2C00NNG1ZQQG2</td>
      <td>1384719342</td>
      <td>RustyBill "Sunday Rocker"</td>
      <td>[0, 0]</td>
      <td>Nice windscreen protects my MXL mic and preven...</td>
      <td>5.0</td>
      <td>GOOD WINDSCREEN FOR THE MONEY</td>
      <td>1392336000</td>
      <td>02 14, 2014</td>
    </tr>
    <tr>
      <th>4</th>
      <td>A94QU4C90B1AX</td>
      <td>1384719342</td>
      <td>SEAN MASLANKA</td>
      <td>[0, 0]</td>
      <td>This pop filter is great. It looks and perform...</td>
      <td>5.0</td>
      <td>No more pops when I record my vocals.</td>
      <td>1392940800</td>
      <td>02 21, 2014</td>
    </tr>
  </tbody>
</table>
</div>




```python
data["reviewText"].iloc[1]
```




    "The product does exactly as it should and is quite affordable.I did not realized it was double screened until it arrived, so it was even better than I had expected.As an added bonus, one of the screens carries a small hint of the smell of an old grape candy I used to buy, so for reminiscent's sake, I cannot stop putting the pop filter next to my nose and smelling it after recording. :DIf you needed a pop filter, this will work just as well as the expensive ones, and it may even come with a pleasing aroma like mine did!Buy this product! :]"



#### Preprocessing
Time to pre-process our texts! Basically, we'll:
- Remove the English stopwords
- Remove punctuations
- Drop unused columns


```python
def threshold_ratings(data):
    def threshold_overall_rating(rating):
        return 0 if int(rating)<=3 else 1
    data["overall"] = data["overall"].apply(threshold_overall_rating)

def remove_stopwords_punctuation(data):
    data["review"] = data["reviewText"] + data["summary"]

    puncs = list(punctuation)
    stops = stopwords.words("english")

    def remove_stopwords_in_str(input_str):
        filtered = [char for char in str(input_str).split() if char not in stops]
        return ' '.join(filtered)

    def remove_punc_in_str(input_str):
        filtered = [char for char in input_str if char not in puncs]
        return ''.join(filtered)

    def remove_stopwords_in_series(input_series):
        text_clean = []
        for i in range(len(input_series)):
            text_clean.append(remove_stopwords_in_str(input_series[i]))
        return text_clean

    def remove_punc_in_series(input_series):
        text_clean = []
        for i in range(len(input_series)):
            text_clean.append(remove_punc_in_str(input_series[i]))
        return text_clean

    data["review"] = remove_stopwords_in_series(data["review"].str.lower())
    data["review"] = remove_punc_in_series(data["review"].str.lower())

def drop_unused_colums(data):
    data.drop(['reviewerID', 'asin', 'reviewerName', 'helpful', 'unixReviewTime', 'reviewTime', "reviewText", "summary"], axis=1, inplace=True)

def preprocess_reviews(data):
    remove_stopwords_punctuation(data)
    threshold_ratings(data)
    drop_unused_colums(data)
```


```python
preprocess_reviews(data)
data.head()
```




<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>overall</th>
      <th>review</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>1</td>
      <td>much write here exactly supposed to filters po...</td>
    </tr>
    <tr>
      <th>1</th>
      <td>1</td>
      <td>product exactly quite affordablei realized dou...</td>
    </tr>
    <tr>
      <th>2</th>
      <td>1</td>
      <td>primary job device block breath would otherwis...</td>
    </tr>
    <tr>
      <th>3</th>
      <td>1</td>
      <td>nice windscreen protects mxl mic prevents pops...</td>
    </tr>
    <tr>
      <th>4</th>
      <td>1</td>
      <td>pop filter great looks performs like studio fi...</td>
    </tr>
  </tbody>
</table>
</div>



#### Split our training and test sets


```python
rand_seed = 42
X = data["review"]
y = data["overall"]
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=rand_seed)
```

#### Mini randomized search
Let's set up a very basic cross-validated randomized search over parameter settings.


```python
params = {"max_depth": range(9,12), "min_child_weight": range(5,8)}
rand_search_cv = RandomizedSearchCV(XGBClassifier(), param_distributions=params, n_iter=5)
```

#### Pipeline to vectorize, transform and fit
Time to vectorize our data, transform it and then fit our model to it.
To be able to feed the text data as numeric values to our model, we will first convert our texts into a matrix of token counts using a CountVectorizer. Then we will convert the count matrix to a normalized tf-idf (term-frequency times inverse document-frequency) representation. Using this transformer, we will be scaling down the impact of tokens that occur very frequently, because they convey less information to us. On the contrary, we will be scaling up the impact of the tokens that occur in a small fraction of the training data because they are more informative to us.


```python
model  = Pipeline([
    ('vect', CountVectorizer()),
    ('tfidf', TfidfTransformer()),
    ('model', rand_search_cv)
])
model.fit(X_train, y_train)
```




    Pipeline(steps=[('vect', CountVectorizer()), ('tfidf', TfidfTransformer()),
                    ('model',
                     RandomizedSearchCV(estimator=XGBClassifier(base_score=None,
                                                                booster=None,
                                                                colsample_bylevel=None,
                                                                colsample_bynode=None,
                                                                colsample_bytree=None,
                                                                gamma=None,
                                                                gpu_id=None,
                                                                importance_type='gain',
                                                                interaction_constraints=None,
                                                                learning_rate=None,
                                                                max_delta_step=None,
                                                                max_depth=None,
                                                                min_child_weight=None,
                                                                missing=nan,
                                                                monotone_constraints=None,
                                                                n_estimators=100,
                                                                n_jobs=None,
                                                                num_parallel_tree=None,
                                                                random_state=None,
                                                                reg_alpha=None,
                                                                reg_lambda=None,
                                                                scale_pos_weight=None,
                                                                subsample=None,
                                                                tree_method=None,
                                                                validate_parameters=None,
                                                                verbosity=None),
                                        n_iter=5,
                                        param_distributions={'max_depth': range(9, 12),
                                                             'min_child_weight': range(5, 8)}))])



#### Predict and calculate accuracy


```python
predictions = model.predict(X_test)
acc = accuracy_score(y_test, predictions)
print(f"Model Accuracy: {round(acc * 100, 2)}")
```

    Model Accuracy: 89.14


#### Save the model
Once we're happy with our model's accuracy, let's save it locally first and then take it from there and upload to Algorithmia.
For the Algorithmia upload, we will use our previously defined function.


```python
model_name = "musicalreviews_xgb_model.pkl"
local_path = f"model/{model_name}"
```


```python
joblib.dump(model, local_path, compress=True)
```

### Programmatically uploading your model to Algorithmia
Now let's call the Algorithmia utility function to take our saved model from its local path and put it on a data container on Algorithmia. As you'll remember, our algorithm script will be looking for the model to load at this data path.

We will call this function once we're happy with our model, that we'll develop soon.


```python
algorithmia_data_path = "data://asli/xgboost_demo"
algo_utility.upload_model_to_algorithmia(local_path, algorithmia_data_path, model_name)
```

### Testing your deployment
Now we are up and ready and we have a perfectly scalable algorithm on Algorithmia, waiting for its visitors! Let's test it with one positive and one negative text and see how well it does. 
To send the request to our algorithm, we will use the algorithm calling function defined in the Algorithmia utility script, and we'll give it a string input.


```python
pos_test_input = "It doesn't work quite as expected. Not worth your money!"
algo_result = algo_utility.call_latest_algo_version(pos_test_input)
print(algo_result.metadata)
print("Sentiment for the given text is: {}".format(algo_result.result["sentiment"]))
```

    Metadata(content_type='json',duration=0.020263526,stdout=None)
    Sentiment for the given text is: 0



```python
neg_test_input = "I am glad that I bought this. It works great!"
algo_result = algo_utility.call_latest_algo_version(neg_test_input)
print(algo_result.metadata)
print("Sentiment for the given text is: {}".format(algo_result.result["sentiment"]))
```

    Metadata(content_type='json',duration=0.018224132,stdout=None)
    Sentiment for the given text is: 1


### Working Model

The final working algorithm is in action at [Basic Sentiment Analysis with XGBoost](https://algorithmia.com/algorithms/asli/xgboost_basic_sentiment_analysis)