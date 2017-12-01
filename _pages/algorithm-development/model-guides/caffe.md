---
layout: article
title:  "Caffe"
excerpt: "Guide to hosting your Caffe deep learning model on Algorithmia."
categories: model-guides
tags: [algo-model-guide]
show_related: true
author: steph_kim
image:
    teaser: /language_logos/caffe.svg
---


Welcome to hosting your <a href="http://caffe.berkeleyvision.org/">Caffe</a> model on Algorithmia!
This guide is designed as an introduction to hosting a Caffe model and publishing an algorithm even if you’ve never used Algorithmia before.


## Prerequisites
Before you get started hosting your model on Algorithmia there are a few things you'll want to do first:

### Train and save your model.
After training your Caffe model, you'll want to save the model and weights so you can upload it to Algorithmia.

### Create a Data Collection
Here you'll want to create a data collection to host your Caffe model.

- To use the Data API, log into your Algorithmia account and create a data collection via the <a href="https://algorithmia.com/data/hosted">Data Collections</a> page.

- Click on **“Add Collection”** under the “My Collections” section on your data collections page.

- After you create your collection you can set the read and write access on your data collection. For more information check out: <a href="{{ site.baseurl }}/data/hosted/">Data Collection Types</a>


<img src="{{ site.baseurl }}/images/post_images/model_hosting/add_collection.png" alt="Create a data collection" class="screenshot img-sm">

### Upload your Model into a Collection
Next, upload your model files to your newly created data collection.

- Load model by clicking box **“Drop files here to upload”**

- Note the path to your files:
    - data://username/collections_name/file_name.prototxt.txt,
    - data://username/collections_name/file_name.caffemodel

<img src="{{ site.baseurl }}/images/post_images/model_hosting/caffe_update_collections.png" alt="Create a data collection" class="screenshot img-md">

## Create your Algorithm
Creating your algorithm is easy!

- To add an algorithm, simply click **“Add Algorithm”** from the user profile icon.
- Name your algorithm, select the language, choose permissions and make the code either open or closed source.

**Note**: There is also a checkbox for 'Standard Execution Environment' or 'Advanced GPU'. For deep learning models you will want to check 'Advanced GPU'.

<img src="{{ site.baseurl }}/images/post_images/model_hosting/create_new_alg_dl_python2.png" alt="Create your algorithm" class="screenshot img-sm">

Now hit the "Create" button on the bottom lower right of the form and you'll see this modal:

<img src="{{ site.baseurl }}/images/post_images/model_hosting/deep_learning_cli.png" alt="cli info modal" class="screenshot">

You can now clone your Algorithm (via Git) and install the CLI to edit/test locally, **or** you can close the modal and continue to create your algorithm in the Web IDE.

#### Editing your algorithm locally via GIT & CLI

The preferred way to edit and test your Algorithm's code is to install the CLI on your local machine, clone your algorithm's repo via Git, and use your favorite editing tools to modify the code. This gives you the benefits of using a familiar development environment, plus an easy way to test your changes locally before committing changes back to the repo and publishing a new algorithm version.

To learn more about this process, Algorithmia's [CLI]({{ site.baseurl }}/clients/cli/) and [Git]({{ site.baseurl }}/algorithm-development/git/) guides. If you're already familiar with the CLI and Git, the basic steps you need to take are:

1. Install the CLI: `curl -sSLf https://algorithmia.com/install.sh | sh` (Windows instructions [here](https://algorithmia.com/developers/clients/cli/#installing-the-algorithmia-cli) ) 
2. Clone your algorithm: `algo clone username/algoname`
3. Use your preferred editor to modify the code
4. Test your algorithm: `cd algoname; algo runlocal -D [JSON FILE]`
5. Commit your changes: `git commit -m [commit message]; git push origin master`
6. Publish your changes: for now, you must do this via the web IDE:
    1. visit [https://algorithmia.com/user](https://algorithmia.com/user)
    2. click on your algorithm
    3. click "Edit Source"
    4. click "Compile", then "[Publish](#publish-algorithm)"


#### Editing your algorithm via the web IDE

If you prefer to continue creating your algorithm in the Web IDE, simply close the modal and you should see the algorithm description page for your newly created algorithm:

<img src="{{ site.baseurl }}/images/post_images/model_hosting/deep_learning_algorithm_page.png" alt="Algorithm descrption page" class="screenshot">

Notice the tabs: Run, Docs, Cost, Discussion, Manage, and Source.

The tab currently showing "Run" is where users can run the algorithm with the default input that you will provide during the publishing step of the algorithm or they can run their own input to test out your algorithm. Also, on this tab, you can add a short summary stating what your algorithm is and why people might be interested in it (for example how it solves a particular problem in a use case). 

"Docs" consists of the section that you will want to show how to use your algorithm including complete information about the input types allowed and what the expected outputs will be.

"Cost" will be filled out automatically once you publish your algorithm and will show if you've chosen to charge royalites or if you've decided to open source your algorithm. It will also give the estimated cost so the user consuming your algorithm can see how much it will cost.

The "Discussion" tab shows the comments and questions from users so you can keep up to date regarding user feedback. 

Under the "Manage" tab you can see how to clone your algorithm, see what items are checked off in the Algorithm Checklist and see permissions for your algorithm which were set when you created your algorithm.

Finally click on the "Source" tab which will display the UI for creating your algorithm if you prefer it over the CLI.

Algorithmia creates the skeleton for your algorithm and bring you to the Edit Algorithm page. The editor will have the "Hello world" code already filled out for you, as shown below.

<img src="{{ site.baseurl }}/images/post_images/model_hosting/deep_learning_algorithm_console.png" alt="Algorithm console Python" class="screenshot">

### Set your Dependencies
Now is the time to set your dependencies that your model relies on.

- Click on the **"Dependencies"** button at the top right of the UI and list your packages under the required ones already listed and click **"Save Dependencies"** on the bottom right corner.

Please note that you will need to use the **protobuf==3.0.0b2.post1** package to be able to run a caffe algorithm.
{: .notice-warning}

<img src="{{ site.baseurl }}/images/post_images/model_hosting/caffe_dependencies.png" alt="Set your dependencies" class="screenshot img-md">

## Load your Model
Now you'll want to run your model which will be called by the apply() function.
Our recommendation is to preload your model in a separate function before apply(). The reasoning behind this is because when your model is first loaded it can take some time to load depending on the file size. However, with all subsequent calls only the apply() function gets called which will be much faster since your model is already loaded!

Here is an example for loading your model based on the Classifying MNIST digits based on <a href="http://caffe.berkeleyvision.org/gathered/examples/mnist.html">Caffe's tutorial</a>.

{% highlight python %}
import Algorithmia
import numpy as np
import caffe

caffe.set_mode_cpu()

client = Algorithmia.client()

def initialize_model():
    """
    Load caffe.Net model with layers
    """

    # Load model files from user collections
    model_uri = "data://user_name/caffe_demo/lenet.prototxt.txt"
    pretrained_uri = "data://user_name/caffe_demo/lenet_iter_10000.caffemodel"


    model_file = client.file(model_uri).getFile().name
    pretrained_file = client.file(pretrained_uri).getFile().name

    # Create net and load weights
    net = caffe.Net(model_file, pretrained_file, caffe.TEST, raw_scale=1, image_dims=(28, 28))

    return net

# Gets called once
net = initialize_model()

def apply(input):
    """
    Input is an image file

    Input examples:
    Data Sources via https://algorithmia.com/data, or http(s) URLs using the
    Smart Image Downloader.
    """

    client = Algorithmia.client()
    imgDataPath = client.algo("util/SmartImageDownloader").pipe(input).result["savePath"][0]
    imgAbsPath = client.file(imgDataPath).getFile().name

    image = caffe.io.load_image(imgAbsPath, color=False)
    out = net.forward_all(data=np.asarray([image]))
    probability_vector = out['prob'][0].argmax(axis=0)
    print(predicted_vector)
    prediction = net.predict([resized_image])

    return prediction
{% endhighlight %}

If you are authoring an algorithm, avoid using the ‘.my’ pseudonym in the source code. When the algorithm is executed, ‘.my’ will be interpreted as the user name of the user who called the algorithm, rather than the author’s user name.
{: .notice-warning}

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

If you want to have a better idea of how a finished caffe algorithm looks like, check out: <a href="https://algorithmia.com/algorithms/deeplearning/CaffeNet/edit">CaffeNet</a>

For more information and detailed steps: <a href="{{ site.baseurl }}/algorithm-development/your-first-algo/">creating and publishing your algorithm</a>

<img src="{{ site.baseurl }}/images/post_images/model_hosting/publish_alg.png" alt="Publish your algorithm" class="screenshot img-sm">

That's it for hosting your <a href="http://caffe.berkeleyvision.org/">Caffe</a> model on Algorithmia!
