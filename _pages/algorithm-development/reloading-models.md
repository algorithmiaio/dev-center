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

On Algorithmia, model files are loaded from file storage whenever a new instance of an algorithm is created. When you retrain a model, you'll generally want your algorithm to use the new model file. If it's backward-compatible with your existing algorithm code, you may choose to simply overwrite the file at the source. New instances of your algorithm will then load this new model file, because it's located at the same data path.

However, this approach doesn't force existing algorithm instances to reload the new model file. If multiple replicas exist for the given algorithm, some requests may be executed on instances that have an older model.

There are two ways to circumvent this issue, depending on whether you want to force an algorithm version-number change.

### Option 1: Changing your algorithm version number while updating your model

One of the benefits of versioning your algorithm while updating your model is that users can choose which version to call, and won't be surprised by a sudden change in output.

##### 1. Upload your new model file with a new name, preferably one indicating a date or revision, e.g. "mymodel-201902".

You can upload a model to a [hosted data collection]({{site.url}}/data) manually through the Algorithmia browser UI, or via the [data API](https://docs.algorithmia.com/#upload-a-file). If you've configured a data connector for a supported cloud storage platform, you can upload a file to that platform through the API as well.

##### 2. Change your algorithm's code to point at this new file.

Either edit your algorithm in the Web IDE or push the modified code to your algorithm's [Git repository]({{site.url}}{{site.baseurl}}/algorithm-development/source-code-management).

##### 3. Republish your algorithm; this forces the algorithm's version number to be incremented.

Click the **Publish** button in the Web IDE, or use the [algo.publish()](https://docs.algorithmia.com/?python#publish-an-algorithm) method (or the equivalent method for your language of choice if not Python) if using the Algorithmia's API to [manage your algorithm]({{site.url}}{{site.baseurl}}/algorithm-development/algorithm-management).

### Option 2: Updating your model on the fly, without changing version numbers

If you'll be updating your model very often (e.g., via an automated process that retrains the model hourly from a live data feed), versioning your algorithm on every single model change may be impractical. In this case, you may want to add automatic model reloading into your algorithm. This requires writing some custom code.

For example, consider a simple scikit-learn algorithm that loads a model file from a hosted data collection, accepts some text as input, and returns a number.

```python
import Algorithmia
from sklearn.externals import joblib

client = Algorithmia.client()

model_file = client.file('data://ALGO_OWNER/ALGO_NAME/MODEL_FILE.pkl').getFile().name
model = joblib.load(model_file)

def apply(input):
    return int(model.predict(input))
```

Let's alter this code so that instead of only loading the model file when the algorithm instance is first spun up, it reloads the model periodically.

We can do this by explcitly adding a function `reload_model()`, and implementing some logic to determine how often the model is reloaded. First, to ensure that the model gets loaded when the algorithm first warms up, we'll call the `reload_model()` function once in the global scope.

```python
import Algorithmia
from sklearn.externals import joblib

client = Algorithmia.client()

def reload_model():
    global model
    model_file = client.file('data://ALGO_OWNER/ALGO_NAME/MODEL_FILE.pkl').getFile().name
    model = joblib.load(model_file)

def apply(input):
    return int(model.predict(input))

reload_model()
```

Next, we need a way to periodically call `reload_model()`. Once the algorithm is warmed up, on subsequent executions it only runs the code inside the scope of the `apply()` function. So, we'll add the logic to reload the model within the `apply()` function, checking against a `last_reload_time` timestamp that gets set when the model is reloaded. We'll also specify a time duration `reload_period` to specify how often we want to reload the model. The model-loading operation has latency associated with it and we don't want to incur that cost on every algorithm execution.

```python
import time

import Algorithmia
from sklearn.externals import joblib

client = Algorithmia.client()
reload_period = 3600 # 1 hour

def reload_model():
    global model, last_reload_time
    model_file = client.file('data://ALGO_OWNER/ALGO_NAME/MODEL_FILE.pkl').getFile().name
    model = joblib.load(model_file)
    last_reload_time = time.time()

def apply(input):
    if time.time() - last_reload_time > reload_period:
        reload_model()
    return int(model.predict(input))

reload_model()
```

### Alternative option: Using CI/CD for model redeployments

Alternatively, you can tackle this problem with automation beyond the actual algorithm code. If you wish to set up CI/CD, for example using a system such as GitHub Actions or Jenkins, see [Deploying Models via CI/CD]({{site.url}}{{site.baseurl}}/algorithm-development/ci-cd).
