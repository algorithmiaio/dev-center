---
layout: article
title:  "Reloading Models"
excerpt: "Reloading your ML Model when it changes"
categories: algorithm-development
tags: [algo-dev]
show_related: true
author: jpeck
image:
  teaser: /icons/algo.svg
permalink: /algorithm-development/reloading-models/
menus:
  algo_development:
    url: /developers/algorithm-development/reloading-models
    title: "Reloading Models"
    weight: 11
---

Most Machine Learning Models will change at some point, and when they do, you want to make your retrained model available quickly and efficiently.

On Algorithmia, model files are pulled from file storage whenever a new instance of an Algorithm is warmed up. If your predictive code has not changed, and the new model file is backward-compatible, you can choose to simply replace the file. Newly warmed-up copies of your Algorithm will automatically utilize the new model file, returning new predictive values.

However, this does not force old copies of your Algorithm to unload... so, for a time, some predictions might use your old model, while others use the new one.

There are two ways to resolve this problem, depending on whether you want to force a version-number change on your Algorithm.

### Option 1: Changing your Algorithm Version Number while Updating your Model

One of the benefits of versioning your Algorithm while updating your model is that users can choose which version to call, and won't be surprised by a sudden change in result values.

##### 1. Upload your new model file with a new name, preferably one indicating a date or revision, e.g. "mymodel-201902".

This can be done manually in [Hosted Data]({{site.url}}/data), or via the [File API](https://docs.algorithmia.com/#upload-a-file), or externally in your preferred cloud storage system if you have previously set up a [Data Connector]({{site.url}}{{site.baseurl}}/data/hosted).

##### 2. Change your Algorithm's code to use this new filename.

Either edit your Algorithm in the Web IDE, or push the modified code to your Algorithm's [git repo]({{site.url}}{{site.baseurl}}/algorithm-development/git).

##### 3. Republish your Algorithm (which causes the version number of the Algorithm to change).

Click the "Publish" button in the Web IDE, or use the [algo.publish()](https://docs.algorithmia.com/?python#publish-an-algorithm) in the [Algorithm Management API]({{site.url}}{{site.baseurl}}/algorithm-development/algorithm-management-api).


### Option 2: Updating your Model immediately, without changing Version Numbers

If you'll be updating your model very often (e.g. via an automated process that retrains the model hourly from a live data feed), versioning your Algorithm on every single model change can be impractical. In this case, you may want to add automatic model reloading into your Algorithm. This requires writing some custom code.

For example, consider a simple scikit-learn Algorithm which loads a model file from Hosted Data, accepts some text as input, and returns a number:

{% highlight python %}
import Algorithmia
from sklearn.externals import joblib

client = Algorithmia.client()

modelFile = client.file('data://username/demo/mymodel.pkl').getFile().name
model = joblib.load(modelFile)

def apply(text):
    return int(model.predict(text))
{% endhighlight %}

We need to alter this code so that instead of only loading the model file once on warm-up, it reloads the model periodically.

We do so by adding a function to reload the model. We'll call this function once, in the outer scope, to make sure it gets loaded at warm-up:

{% highlight python %}
import Algorithmia
from sklearn.externals import joblib

client = Algorithmia.client()

def reload_model():
    modelFile = client.file('data://username/demo/mymodel.pkl').getFile().name
    model = joblib.load(modelFile)

def apply(text):
    return int(model.predict(text))

reload_model()
{% endhighlight %}

Next, we need a way to periodically call **reload_model()**. Since the algorithm only runs code when it is actively called, we'll attach this to the **apply()** function, checking against a **last_reload_time**:

{% highlight python %}
import Algorithmia
from sklearn.externals import joblib
import time

client = Algorithmia.client()
model = None
last_reload_time = None
reload_period = 3600 # 1 hour

def reload_model():
    modelFile = client.file('data://username/demo/mymodel.pkl').getFile().name
    model = joblib.load(modelFile)
    reload_period = time.time()

def apply(text):
    if (time.time() - last_reload_time > reload_period):
        reload_model()
    return int(model.predict(text))

reload_model()
{% endhighlight %}


### Alternative: use CI/CD for model redeployments

If you wish to set up Continuous Integration/Deployment in a system such as Jenkins, see [Deploying Models via CI/CD]({{site.url}}{{site.baseurl}}/algorithm-development/ci-cd).
