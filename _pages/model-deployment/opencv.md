---
layout: article
title:  "OpenCV"
excerpt: "Deploying your OpenCV model to Algorithmia."
categories: model-guides
tags: [algo-model-guide]
show_related: true
author: besir
permalink: /model-deployment/opencv/
redirect_from:
  - /algorithm-development/model-guides/opencv/
image:
    teaser: /language_logos/opencv.png
---

Welcome to Algorithmia! This guide is designed as an introduction to deploying your <a href="http://opencv.org/">OpenCV</a> model and publishing it as an algorithm, even if you’ve never used Algorithmia before!

Note: this guide uses the web UI to create and deploy your Algorithm. If you prefer a code-only approach to deployment, review [Algorithm Management API]({{site.baseurl}}/algorithm-development/algorithm-management-api) after reading this guide.
{: .notice-info}

## Table of Contents
* [Prerequisites](#prerequisites)
  * [Create a Data Collection](#create-a-data-collection)
  * [Save your Pre-Trained Model](#save-your-pre-trained-model)
* [Create your Algorithm](#create-your-algorithm)
* [Set your Dependencies](#set-your-dependencies)
* [Load your Model](#load-your-model)
* [Publish your Algorithm](#publish-your-algorithm)

## Prerequisites
Before you get started hosting your model on Algorithmia there are a few things you'll want to do first:

### Create a Data Collection

Host your data where you want and serve it to your model with Algorithmia's <a href="http://docs.algorithmia.com/">Data API</a>.

In this guide we'll use Algorithmia's <a href="{{site.baseurl}}/data/hosted">Hosted Data Collection</a>, but you can host it in <a href="{{site.baseurl}}/data/s3">S3</a> or <a href="{{site.baseurl}}/data/dropbox">Dropbox</a> as well. Alternatively, if your data lies in a database, [check out]({{site.baseurl}}/data/dynamodb) how we connected to a DynamoDB database.

First, you'll want to create a data collection to host your graph and variables.

- Log into your Algorithmia account and create a data collection via the <a href="{{site.baseurl}}/data/hosted">Data Collections</a> page.

- Click on **“Add Collection”** under the “My Collections” section.

- After you create your collection you can set the read and write access on your data collection.

<img src="{{site.baseurl}}/images/post_images/model_hosting/add_collection.png" alt="Create a data collection" class="screenshot img-sm">

For more information check out: <a href="{{site.baseurl}}/data/hosted">Data Collection Types</a>.

Note, that you can also use the <a href="https://docs.algorithmia.com/#data-uri">Data API</a> to create data collections and upload files.

### Save your Pre-Trained Model
You'll want to do the training and saving of your model on your local machine, or the platform you're using for training, before you deploy it to production on the Algorithmia platform.

After training your OpenCV model, can save it as a `.dat` binary file. In this example we use the `SVM.save()` method.

Because we'll be saving the model to a data collection, let's create that directory right now.

Before we create our algorithm, let's first train our model on our local machine on the handwriting digits dataset and save it to the DataAPI.

This requires version `3.4.1.15` of `opencv-python`.

{% highlight python %}
import Algorithmia
import cv2 as cv
import numpy as np
import os

SZ=20
bin_n = 16 # Number of bins
affine_flags = cv.WARP_INVERSE_MAP|cv.INTER_LINEAR

# Define your custom model path here
model_file_save_data_path = "data://<username>/<collection>/svm_data.dat"

client = Algorithmia.client(<YOUR_API_KEY>)

def deskew(img):
    m = cv.moments(img)
    if abs(m['mu02']) < 1e-2:
        return img.copy()
    skew = m['mu11']/m['mu02']
    M = np.float32([[1, skew, -0.5*SZ*skew], [0, 1, 0]])
    img = cv.warpAffine(img,M,(SZ, SZ),flags=affine_flags)
    return img
def hog(img):
    gx = cv.Sobel(img, cv.CV_32F, 1, 0)
    gy = cv.Sobel(img, cv.CV_32F, 0, 1)
    mag, ang = cv.cartToPolar(gx, gy)
    bins = np.int32(bin_n*ang/(2*np.pi))    # quantizing binvalues in (0...16)
    bin_cells = bins[:10,:10], bins[10:,:10], bins[:10,10:], bins[10:,10:]
    mag_cells = mag[:10,:10], mag[10:,:10], mag[:10,10:], mag[10:,10:]
    hists = [np.bincount(b.ravel(), m.ravel(), bin_n) for b, m in zip(bin_cells, mag_cells)]
    hist = np.hstack(hists)     # hist is a 64 bit vector
    return hist

digits_data_url = "data://opencv/dataset/digits.png"
digits_path = "./digits.png"
digits_abs_path = client.file(digits_data_url).getFile().name
os.rename(digits_abs_path, digits_path)

img = cv.imread(digits_path,0)
cells = [np.hsplit(row,100) for row in np.vsplit(img,50)]
train_cells = [ i[:50] for i in cells ]
test_cells = [ i[50:] for i in cells]
deskewed = [list(map(deskew,row)) for row in train_cells]
hogdata = [list(map(hog,row)) for row in deskewed]
trainData = np.float32(hogdata).reshape(-1,64)
responses = np.repeat(np.arange(10),250)[:,np.newaxis]

svm = cv.ml.SVM_create()
svm.setKernel(cv.ml.SVM_LINEAR)
svm.setType(cv.ml.SVM_C_SVC)
svm.setC(2.67)
svm.setGamma(5.383)
svm.train(trainData, cv.ml.ROW_SAMPLE, responses)
svm.save("svm_data.dat")

client.file(model_file_save_data_path).putFile("svm_data.dat")
{% endhighlight %}

The last line will save your model to the data collection you've created.

## Create your Algorithm

Hopefully you've already followed along with the <a href="{{site.baseurl}}/algorithm-development/algorithm-basics/your-first-algo">Getting Started Guide</a> for algorithm development. If not, you might want to check it out in order to understand the various permission types, how to enable a GPU environment, and use the CLI.

Once you've gone through the <a href="{{site.baseurl}}/algorithm-development/algorithm-basics/your-first-algo">Getting Started Guide</a>, you'll notice that when you've created your algorithm, there is boilerplate code in the editor that returns "Hello" and whatever you input to the console.

The main thing to note about the algorithm is that it's wrapped in the `apply()` function.

The apply() function defines the input point of the algorithm. We use the apply() function in order to make different algorithms standardized. This makes them easily chained and helps authors think about designing their algorithms in a way that makes them easy to leverage and predictable for end users.

Go ahead and remove the boilerplate code below that's inside the `apply()` function on line 6, but leave the `apply()` function intact:

<img src="{{site.baseurl}}/images/post_images/algo_dev_lang/algorithm_console_python.png" alt="Algorithm console Python" class="screenshot">

**Note**: Make sure that your version of python is the same between your development environment and the algorithm. There may be version conflicts otherwise.

### Set your Dependencies

Now is the time to set the dependencies your model relies on.

- Click on the **"Dependencies"** button at the top right of the UI and add `opencv-python==3.4.1.15` under the required ones already listed and click **"Save Dependencies"** on the bottom right corner.

## Load your model
Here is where you load and run your model which will be called by the apply() function.

When you load your model, our recommendation is to preload your model in a separate function external to the apply() function.

This is because when a model is first loaded it can take time to load depending on the file size.

Then, with all subsequent calls only the apply() function gets called which will be much faster since your model is already loaded.

If you are authoring an algorithm, avoid using the ‘.my’ pseudonym in the source code. When the algorithm is executed, ‘.my’ will be interpreted as the user name of the user who called the algorithm, rather than the author’s user name.
{: .notice-warning}

Note that you always want to create valid JSON input and output in your algorithm. For examples see the <a href="/algorithm-development/languages/python/#io-for-your-algorithms">Client Guides</a>.

Now, we'll deploy our newly trained model. For testing the model we have, we'll crop a single zero digit from the dataset for testing.

### Preloading function

Preloading your OpenCV model is a great step for improving your overall performance. By downloading your OpenCV model file when the container first starts, it means that any subsequent requests to the algorithm won’t have the same loading overhead!

Here’s an example of what that looks like:

{% highlight python %}
import cv2 as cv

def init_model():
    model_abs_path = client.file("data://<username>/<collection>/svm_data.dat").getFile().name
    model = cv.ml.SVM_load(model_abs_path)
    return model

model = init_model()
{% endhighlight %}

### Image pre-processing functions

Before we can pass the image to the model, we need to pre-process the user provided image.

The first function deskews the image, and the second function finds the [HOG](https://en.wikipedia.org/wiki/Histogram_of_oriented_gradients) descriptor of the image.

{% highlight python %}
import cv2 as cv
import numpy as np

SZ=20
bin_n = 16 # Number of bins
affine_flags = cv.WARP_INVERSE_MAP|cv.INTER_LINEAR

def deskew(img):
    m = cv.moments(img)
    if abs(m['mu02']) < 1e-2:
        return img.copy()
    skew = m['mu11']/m['mu02']
    M = np.float32([[1, skew, -0.5*SZ*skew], [0, 1, 0]])
    img = cv.warpAffine(img,M,(SZ, SZ),flags=affine_flags)
    return img
def hog(img):
    gx = cv.Sobel(img, cv.CV_32F, 1, 0)
    gy = cv.Sobel(img, cv.CV_32F, 0, 1)
    mag, ang = cv.cartToPolar(gx, gy)
    bins = np.int32(bin_n*ang/(2*np.pi))    # quantizing binvalues in (0...16)
    bin_cells = bins[:10,:10], bins[10:,:10], bins[:10,10:], bins[10:,10:]
    mag_cells = mag[:10,:10], mag[10:,:10], mag[:10,10:], mag[10:,10:]
    hists = [np.bincount(b.ravel(), m.ravel(), bin_n) for b, m in zip(bin_cells, mag_cells)]
    hist = np.hstack(hists)     # hist is a 64 bit vector
    return hist
{% endhighlight %}

### Full Example

{% highlight python %}
import Algorithmia
import cv2 as cv
import numpy as np
import os

SZ=20
bin_n = 16 # Number of bins
affine_flags = cv.WARP_INVERSE_MAP|cv.INTER_LINEAR

model_file_path = "data://<username>/<collection>/svm_data.dat"

def deskew(img):
    m = cv.moments(img)
    if abs(m['mu02']) < 1e-2:
        return img.copy()
    skew = m['mu11']/m['mu02']
    M = np.float32([[1, skew, -0.5*SZ*skew], [0, 1, 0]])
    img = cv.warpAffine(img,M,(SZ, SZ),flags=affine_flags)
    return img
def hog(img):
    gx = cv.Sobel(img, cv.CV_32F, 1, 0)
    gy = cv.Sobel(img, cv.CV_32F, 0, 1)
    mag, ang = cv.cartToPolar(gx, gy)
    bins = np.int32(bin_n*ang/(2*np.pi))    # quantizing binvalues in (0...16)
    bin_cells = bins[:10,:10], bins[10:,:10], bins[:10,10:], bins[10:,10:]
    mag_cells = mag[:10,:10], mag[10:,:10], mag[:10,10:], mag[10:,10:]
    hists = [np.bincount(b.ravel(), m.ravel(), bin_n) for b, m in zip(bin_cells, mag_cells)]
    hist = np.hstack(hists)     # hist is a 64 bit vector
    return hist

client = Algorithmia.client()

def init_model():
    model_abs_path = client.file(model_file_path).getFile().name
    model = cv.ml.SVM_load(model_abs_path)
    return model

model = init_model()

def apply(input):
    img_path = "./img_path.png"
    img_abs_path = client.file(input["image"]).getFile().name
    os.rename(img_abs_path, img_path)
    img = cv.imread(img_path,0)
    deskewed = deskew(img)
    hogged = hog(deskewed)
    testData = np.float32([hogged]).reshape(-1,bin_n*4)
    pred = float(model.predict(np.float32([hogged]).reshape(-1,bin_n*4))[1])
    return {"prediction": pred}
{% endhighlight %}

Now when you run this code, the expected input is:

{% highlight python %}
{
  "image": "data://opencv/dataset/zero_sample.png"
}
{% endhighlight %}

With the expected output:

{% highlight python %}
{
  "prediction": 0
}
{% endhighlight %}

## Publish your Algorithm
Last is publishing your algorithm. The best part of deploying your model on Algorithmia is that users can access it via an API that takes only a few lines of code to use! Here is what you can set when publishing your algorithm:

On the upper right hand side of the algorithm page you'll see a purple button "Publish" which will bring up a modal:

<img src="{{site.baseurl}}/images/post_images/algo_dev_lang/publish_algorithm.png" alt="Publish an algorithm" class="screenshot img-sm">

In this modal, you'll see a Changes tab, a Sample I/O tab, and one called Versioning.

If you don't recall from the <a href="{{site.baseurl}}/algorithm-development/algorithm-basics/your-first-algo">Getting Started Guide</a> how to go through the process of publishing your model, check that out before you finish publishing.

## Credit

This guide is based on the OpenCV tutorial [here](https://docs.opencv.org/3.4.1/dd/d3b/tutorial_py_svm_opencv.html).

If you run into any trouble, please contact us at <a href="mailto:support@algorithmia.com">support@algorithmia.com</a>.
