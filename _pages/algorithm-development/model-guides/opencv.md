---
layout: article
title:  "OpenCV"
excerpt: "Bring your OpenCV model to Algorithmia."
categories: model-guides
tags: [algo-model-guide]
show_related: true
author: besir
image:
    teaser: /language_logos/opencv.png
---

Welcome to Algorithmia! This guide is designed as an introduction to hosting your <a href="http://opencv.org/">OpenCV</a> model and publishing it as an algorithm, even if you’ve never used Algorithmia before!

## Prerequisites

### Create a Data Collection

Here you'll want to create a data collection to host your model.

- To use the Data API, log into your Algorithmia account and create a data collection via the <a href="{{ site.baseurl }}/data/hosted">Data Collections</a> page.

- Click on **“Add Collection”** under the “My Collections” section on your data collections page.

- After you create your collection you can set the read and write access on your data collection. For more information check out: <a href="{{ site.baseurl }}/data/hosted/">Data Collection Types</a>

<img src="{{ site.baseurl }}/images/post_images/model_hosting/add_collection.png" alt="Create a data collection" class="screenshot img-sm">

Let's create a data collection where we'll save our model.

### Training a model

Before we create our algorithm, let's first train our model on the handwriting digits dataset and save it to the DataAPI.

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

Creating your algorithm is easy!

- To add an algorithm, simply click **“Add Algorithm”** from the user profile icon.
- Name your algorithm, select the language, choose permissions and make the code either open or closed source.

**Note**: There is also a checkbox for 'Standard Execution Environment' or 'Advanced GPU'. For deep learning models you will want to check 'Advanced GPU'.

**Note**: Make sure that your version of python is the same between your development environment and the algorithm. There may be version conflicts otherwise.

<img src="{{ site.baseurl }}/images/post_images/model_hosting/create_new_alg_dl_python3.png" alt="Create your algorithm" class="screenshot img-sm">

### Set your dependencies

Now is the time to set the dependencies your model relies on.

- Click on the **"Dependencies"** button at the top right of the UI and add `opencv-python==3.4.1.15` under the required ones already listed and click **"Save Dependencies"** on the bottom right corner.

### Load your model

Here is where you load your model, which will be called by the `apply()` function when you pass input to the algorithm using our API.

Our recommendation is to preload your model in a separate function before the apply(). The reasoning behind this is because when your model is first loaded it can take some time to load depending on the file size. However, with all subsequent calls only the apply() function gets called which will be much faster since your model is already loaded!

Note that you always want to create valid JSON input and output in your algorithm. For example this algorithm takes a JSON blob passing in a csv file hosted on [Algorithmia, Amazon S3, or Dropbox](https://algorithmia.com/developers/data/).
{: .notice-info}

We'll deploy our newly trained model. For testing the model we have, we'll crop a single zero digit from the dataset for testing.

### Example Input:

{% highlight python %}
{
  "image": "data://opencv/dataset/zero_sample.png"
}
{% endhighlight %}

### Example Output:

{% highlight python %}
{
  "prediction": 0
}
{% endhighlight %}

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

## Publish your Algorithm

Last is publishing your algorithm. The best part of hosting your model on Algorithmia is that users can access it via an API that takes only a few lines of code to use! Here is what you can set when publishing your algorithm:

On the upper right hand side of the algorithm page you'll see a purple button "Publish" which will bring up a modal:

<img src="{{ site.baseurl }}/images/post_images/algo_dev_lang/publish_algorithm.png" alt="Publish an algorithm" class="screenshot img-sm">

In this modal, you'll see a Changes tab, a Sample I/O tab, and one called Versioning.

Changes shows you your commit history and release notes.

Sample I/O is where you'll create your sample input and output for the user to try under Try the API in the Run tab. When you add a sample input, make sure to test it out with all the inputs that you accept since users will be able to test your algorithm with their own inputs.

Under the Versioning tab, you can select whether your algorithm will be for public use or private use as well as set the royalty. The algorithm can either be royalty-free or charge per-call. If you opt to have the algorithm charge a royalty, as the author, you will earn 70% of the royalty cost.

Check out [Algorithm Pricing]({{ site.baseurl }}/pricing/) for more information on how much algorithms will cost to run.

Under Semantic Versioning you can choose which kind of release your change should fall under: Major, Minor, or Revision.

If you are satisfied with your algorithm and settings, go ahead and hit publish. Congratulations, you’re an algorithm developer!


For more information and detailed steps: <a href="{{ site.baseurl }}/algorithm-development/your-first-algo/">creating and publishing your algorithm</a>

## Credit

This guide is based on the OpenCV tutorial [here](https://docs.opencv.org/3.4.1/dd/d3b/tutorial_py_svm_opencv.html).

In the meantime check out the other model hosting guides such as <a href="{{ site.baseurl }}/algorithm-development/model-guides/scikit/">Scikit-learn</a>, <a href="{{ site.baseurl }}/algorithm-development/model-guides/keras/">Keras</a>, <a href="{{ site.baseurl }}/algorithm-development/model-guides/tensorflow/">Tensorflow</a>, <a href="{{ site.baseurl }}/algorithm-development/model-guides/caffe/">Caffe</a>, <a href="{{ site.baseurl }}/algorithm-development/model-guides/mxnet/">MXNet</a>, <a href="{{ site.baseurl }}/algorithm-development/model-guides/theano/">Theano</a>, or <a href="{{ site.baseurl }}/algorithm-development/model-guides/nltk/">NLTK</a>, and <a href="{{ site.baseurl }}/algorithm-development/model-guides/cntk/">CNTK</a>.

If you run into any trouble, please contact us at <a href="mailto:support@algorithmia.com">support@algorithmia.com</a>.
