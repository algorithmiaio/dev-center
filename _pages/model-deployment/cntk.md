---
layout: article
title:  "CNTK"
excerpt: "Deploying your CNTK model to Algorithmia."
categories: deprecated
tags: [algo-model-guide]
show_related: true
author: james_sutton
permalink: /model-deployment/cntk/
redirect_from:
  - /model-deployment/cntk/
image:
    teaser: /language_logos/python.svg
---


Welcome to Algorithmia!
This guide is designed as an introduction to deploying your <a href="https://https://www.microsoft.com/en-us/cognitive-toolkit">CNTK</a> model and publishing it as an algorithm, even if you've never used Algorithmia before!


## Prerequisites

Before you get started, you'll need to pick a [python wheel][whl] first! We support two wheel versions, [2.7][wh_27] and [3.5][wh_35]. Make sure you select the wheel that matches your algorithm version.

### Train and save your model

After your CNTK model is trained you should save the model graph with the idiomatic `model.save(filepath)`. Once that's finished saving to your local disk, you're ready to upload it to Algorithmia.

### Create a Data Collection

Here you'll want to create a data collection to host your model.

- To use the Data API, log into your Algorithmia account and create a data collection via the <a href="{{site.baseurl}}/data/hosted">Data Collections</a> page.

- Click on **“Add Collection”** under the “My Collections” section on your data collections page.

- After you create your collection you can set the read and write access on your data collection. For more information check out: <a href="{{site.baseurl}}/data/hosted">Data Collection Types</a>

<img src="{{site.baseurl}}/images/post_images/model_hosting/add_collection.png" alt="Create a data collection" class="screenshot img-sm">

### Upload your Model into a Collection

After your collection is created, you're going to want to upload your saved graph file to your newly created Data Collection.

- Load model by clicking box **“Drop files here to upload”**

- Note the path to your files: `data://username/collections_name/cntk.model`

<img src="{{site.baseurl}}/images/post_images/model_hosting/add_collection.png" alt="Create a data collection" class="screenshot img-sm">

## Create your Algorithm

Creating your algorithm is easy!

- To add an algorithm, simply click **“Add Algorithm”** from the user profile icon.
- Name your algorithm, select the language, choose permissions and make the code either open or closed source.

**Note**: There is also a checkbox for 'Standard Execution Environment' or 'Advanced GPU'. For deep learning models you will want to check 'Advanced GPU'.

**Note**: Make sure that your version of python is the same between your development environment and the algorithm. There may be version conflicts otherwise.

<img src="{{site.baseurl}}/images/post_images/model_hosting/create_new_alg_dl_python3.png" alt="Create your algorithm" class="screenshot img-sm">


### set your dependencies

Now is the time to set the depenencies your model relies on.

- Click on the **"Dependencies"** button at the top right of the UI and list your packages under the required ones already listed and click **"Save Dependencies"** on the bottom right corner.

<img src="{{site.baseurl}}/images/post_images/model_hosting/cntk_dependencies.png" alt="Set your dependencies" class="screenshot img-md">


### Load your Model

Here is where you load your model, which will be called by the `apply()` function when you pass input to the algorithm using our API.

Our recommendation is to preload your model in a separate function before the apply(). The reasoning behind this is because when your model is first loaded it can take some time to load depending on the file size. However, with all subsequent calls only the apply() function gets called which will be much faster since your model is already loaded!

Note that you always want to create valid JSON input and output in your algorithm. For example this algorithm takes a JSON blob passing in a csv file hosted on [Algorithmia, Amazon S3, or Dropbox]({{site.baseurl}}/data).
{: .notice-info}

### Example Input:

{% highlight python %}
{
   "test_data": "data://james/cntk_data/test.csv"
}
{% endhighlight %}


### Example Output:
{% highlight python %}
[2, 0, 9, 0, 3, 7, 0, 3, 0, 3]
{% endhighlight %}


## Preloading Function
Preloading your CNTK model is a great step for improving your overall performance. By downloading your CNTK model file when the container first starts, it means
that any subsequent requests to the algorithm won't have the same loading overhead!

Here's an example of what that looks like:

{% highlight python %}
def get_cntk_model():
    """Load model from data collection."""
    file_uri = "data://stephanie/keras_model/mnist_model.h5"
    # Retrieve file name from data collections.
    model_file_path = client.file(file_uri).getFile().name
    return model_file_path
{% endhighlight %}


## Full example

{% highlight python %}
"""
    An example of how to load a trained model and use it
    to predict labels from the imagenet 1k dataset.

"""

import Algorithmia
from cntk import load_model
import cntk as C
import numpy as np
import json
from scipy.misc import imread, imresize, imshow

C.cntk_py.set_fixed_random_seed(1)
SIMD_ALGO = "util/SmartImageDownloader/0.2.14"

def get_cntk_model():
    model_uri = "data://zeryx/cntk_guide/ResNet101_ImageNet_Caffe.model"
    labels_uri = "data://zeryx/cntk_guide/imagenet_labels.json"
    model_file_path = client.file(model_uri).getFile().name
    labels_file_path = client.file(labels_uri).getFile().name
return model_file_path, labels_file_path


def get_image(url):
    output_url = client.algo(SIMD_ALGO).pipe({'image': str(url)}).result['savePath'][0]
    temp_file = client.file(output_url).getFile().name
    os.rename(temp_file, temp_file + '.' + output_url.split('.')[-1])
    return temp_file + '.' + output_url.split('.')[-1]

def apply(url):
    image = get_image(url)
    my_classifier = load_model(MODEL_PATH)
    with open(LABELS_PATH) as f:
        labels = json.load(f)
    im = imread(image, mode='RGB')
    im = imresize(im, (224, 224))
    im = np.reshape(im, (1, 3, 224, 224))
    probs = my_classifier.eval(im.astype(float))[0]

    result = []
    for i in range(len(probs)):
        label = labels[i]
        probability = probs[i]
        result.append({'label': label, 'probability': probability})
    result = sorted(result, key=lambda k: k['probability'])
    return result


MODEL_PATH, LABELS_PATH = get_cntk_model()

{% endhighlight %}



## Publish your Algorithm
Last is publishing your algorithm. The best part of deploying your model on Algorithmia is that users can access it via an API that takes only a few lines of code to use! Here is what you can set when publishing your algorithm:

On the upper right hand side of the algorithm page you'll see a purple button "Publish" which will bring up a modal:

<img src="{{site.baseurl}}/images/post_images/algo_dev_lang/publish_algorithm.png" alt="Publish an algorithm" class="screenshot img-sm">

In this modal, you'll see a Changes tab, a Sample I/O tab, and one called Versioning.

Changes shows you your commit history and release notes.

Sample I/O is where you'll create your sample input and output for the user to try under Try the API in the Run tab. When you add a sample input, make sure to test it out with all the inputs that you accept since users will be able to test your algorithm with their own inputs.

Under the Versioning tab, you can select whether your algorithm will be for public use or private use as well as set the royalty. The algorithm can either be royalty-free or charge per-call. If you opt to have the algorithm charge a royalty, as the author, you will earn 70% of the royalty cost.

Check out [Algorithm Pricing]({{site.baseurl}}/pricing) for more information on how much algorithms will cost to run.

Under Semantic Versioning you can choose which kind of release your change should fall under: Major, Minor, or Revision.

If you are satisfied with your algorithm and settings, go ahead and hit publish. Congratulations, you’re an algorithm developer!


For more information and detailed steps: <a href="{{site.baseurl}}/algorithm-development/your-first-algo">creating and publishing your algorithm</a>


[whl]: https://docs.microsoft.com/en-us/cognitive-toolkit/setup-linux-python
[wh_35]: https://cntk.ai/PythonWheel/GPU/cntk-2.1-cp35-cp35m-linux_x86_64.whl
[wh_27]: https://cntk.ai/PythonWheel/GPU/cntk-2.1-cp27-cp27mu-linux_x86_64.whl
[here]: https://algorithmia.com/algorithms/zeryx/cntk_guide
