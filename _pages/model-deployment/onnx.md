---
layout: article
title:  "ONNX Runtime"
excerpt: "Deploying your ONNX model to Algorithmia."
categories: model-guides
tags: [algo-model-guide]
show_related: true
author: steph_kim
image:
    teaser: /language_logos/mlogo.png
---

Welcome to deploying your <a href="https://github.com/onnx/tutorials#converting-to-onnx-format">ONNX</a> model via <a href="https://microsoft.github.io/onnxruntime/">ONNX Runtime</a> on Algorithmia!

This guide is designed as an introduction to deploying an ONNX model and publishing an algorithm even if you’ve never used Algorithmia before.

Note: this guide uses the web UI to create and deploy your Algorithm. If you prefer a code-only approach to deployment, review [Algorithm Management]({{site.baseurl}}/algorithm-development/algorithm-management) after reading this guide.
{: .notice-info}

## Table of Contents
* [Create your Algorithm](#create-your-algorithm)
* [Set your Dependencies](#set-your-dependencies)
* [Load your Model](#load-your-model)
* [Publish your Algorithm](#publish-your-algorithm)


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

<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/model_hosting/onnx_dependencies.png" alt="Set your dependencies" class="screenshot img-md">

For easy copy and paste:
{% highlight python %}
onnxruntime-gpu==1.0.0
numpy
pillow
{% endhighlight %}

The numpy and pillow libraries are for the following code example. Also note that you'll only need to add the -gpu suffix to your onnxruntime dependency if your algorithm requires a GPU environment.
{: .notice-info}

## Load your Model
Here is where you load and run your model which will be called by the apply() function.

When you load your model, our recommendation is to preload your model in a separate function external to the apply() function.

This is because when a model is first loaded it can take time to load depending on the file size.

Then, with all subsequent calls only the apply() function gets called which will be much faster since your model is already loaded.

If you are authoring an algorithm, avoid using the ‘.my’ pseudonym in the source code. When the algorithm is executed, ‘.my’ will be interpreted as the user name of the user who called the algorithm, rather than the author’s user name.
{: .notice-warning}

Note that you always want to create valid JSON input and output in your algorithm. For examples see the [Algorithm Development Guides]({{site.url}}{{site.baseurl}}/algorithm-development/languages/python/#io-for-your-algorithms).

### Example Hosted Model:

{% highlight python %}
import Algorithmia
import numpy as np
import os
from PIL import Image
import onnxruntime

# API calls will begin at the apply() method, with the request body passed as 'input'
# For more details, see algorithmia.com/developers/algorithm-development/languages

SIMD_ALGO = "util/SmartImageDownloader/0.2.14"

def load():
    local_path = client.file("data://zeryx/collection/mobilenetv2-1.0.onnx").getFile().name
    return onnxruntime.InferenceSession(local_path)

client = Algorithmia.client()
MODEL_SESSION = load()


def preprocess(image_path):
    image = Image.open(image_path)
    image_data = np.array(image).transpose(2, 0, 1)
    # convert the input data into the float32 input
    img_data = image_data.astype('float32')
    img_data = img_data.reshape(1, 3, 224, 224)

    #normalize
    mean_vec = np.array([0.485, 0.456, 0.406])
    stddev_vec = np.array([0.229, 0.224, 0.225])
    norm_img_data = np.zeros(img_data.shape).astype('float32')
    for i in range(img_data.shape[0]):
        norm_img_data[i,:,:] = (img_data[i,:,:]/255 - mean_vec[i]) / stddev_vec[i]
    return norm_img_data

def softmax(x):
    x = x.reshape(-1)
    e_x = np.exp(x - np.max(x))
    return e_x / e_x.sum(axis=0)

def postprocess(result):
    return softmax(np.array(result)).tolist()


def get_image(url, shape):
    output_url = client.algo(SIMD_ALGO).pipe({'image': str(url), "resize": shape}).result['savePath'][0]
    temp_file = client.file(output_url).getFile().name
    os.rename(temp_file, temp_file + '.' + output_url.split('.')[-1])
    local_file = temp_file + '.' + output_url.split('.')[-1]
    return local_file

def apply(input):
    image = get_image(input, {"height": 224, "width": 224})
    image_data = preprocess(image)
    raw_result = MODEL_SESSION.run([], {"data": image_data})
    res = postprocess(raw_result)
    return res

{% endhighlight %}

## Publish your Algorithm
Last is publishing your algorithm. The best part of deploying your model on Algorithmia is that users can access it via an API that takes only a few lines of code to use! Here is what you can set when publishing your algorithm:

On the upper right hand side of the algorithm page you'll see a purple button "Publish" which will bring up a modal:

<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/algo_dev_lang/publish_algorithm.png" alt="Publish an algorithm" class="screenshot img-sm">

In this modal, you'll see a Changes tab, a Sample I/O tab, and one called Versioning.

If you don't recall from the <a href="{{site.baseurl}}/algorithm-development/algorithm-basics/your-first-algo">Getting Started Guide</a> how to go through the process of publishing your model, check that out before you finish publishing.

## Working Demo

Here's the <a href="https://algorithmia.com/algorithms/zeryx/onnx_test">working demo</a> for the above code example to see the expected input and output.

That's it for hosting your <a href="https://github.com/onnx">ONNX</a> model using <a href="https://microsoft.github.io/onnxruntime/">ONNX Runtime</a> on Algorithmia!



