---
categories: algorithm-development
excerpt: "Reloading your ML Model when it changes"
image:
  teaser: /icons/algo.svg
layout: article
permalink: /algorithm-development/reloading-models/
show_related: true
tags: [algo-dev]
title:  "Reloading Models"
---

Most machine learning models will change at some point, and when they do, you want to make your retrained models available quickly and efficiently.

On Algorithmia, model files are loaded from file storage whenever a new instance of an algorithm is created. If you retrain a model and you want your algorithm to use the new model file, if it's backward-compatible with your existing algorithm code, you may choose to simply overwrite the file at the source. New instances of your algorithm will then load this new model file, because it's located at the same data path.

However, this approach doesn't force existing algorithm instances to use the new model. If multiple algorithm replicas exist, some requests may be executed on instances that have an older model, while others use the new one.

There are two ways to resolve this problem, depending on whether you want to force a version-number change for your algorithm.

### Option 1: Changing your algorithm version number while updating your model

One of the benefits of versioning your algorithm while updating your model is that users can choose which version to call, and won't be surprised by a sudden change in output.

##### 1. Upload your new model file with a new name, preferably one indicating a date or revision, e.g. "mymodel-201902".

You can upload a model to a [hosted data collection]({{site.url}}/data) manually through the Algorithmia browser UI, or via the [data API](https://docs.algorithmia.com/#upload-a-file). If you've configured a data connector for a supported cloud storage platform, you can upload a file to that platform through the API as well.

##### 2. Change your algorithm's code to use this new filename.

Either edit your Algorithm in the Web IDE, or push the modified code to your Algorithm's [Git repository]({{site.url}}{{site.baseurl}}/algorithm-development/source-code-management).

##### 3. Republish your algorithm (which forces the algorithm's version number to be incremented).

Click the **Publish** button in the Web IDE, or use the [algo.publish()](https://docs.algorithmia.com/?python#publish-an-algorithm) method (or the equivalent method for your language of choice if not Python.) in the [Algorithmia API]({{site.url}}{{site.baseurl}}/algorithm-development/algorithm-management).  


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
