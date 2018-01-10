---
layout: article
title:  "TensorFlow"
excerpt: "Bring your Tensorflow graph model to Algorithmia."
categories: model-guides
tags: [algo-model-guide]
show_related: true
author: steph_kim
image:
    teaser: /language_logos/tensorflow.svg
---


Welcome to hosting your <a href="https://www.tensorflow.org/">Tensorflow</a> model on Algorithmia!
This guide is designed as an introduction to hosting a Tensorflow model and publishing an algorithm even if you’ve never used Algorithmia before.


## Prerequisites
Before you get started hosting your model on Algorithmia there are a few things you'll want to do first:

### Train and save your model.
After training your Tensorflow model, you'll want to [save your variable checkpoints](https://www.tensorflow.org/programmers_guide/variables) and the graph from your trained model so you can upload it to Algorithmia.

### Create a Data Collection
Here you'll want to create a data collection to host your graph and variable checkpoint data.

- To use the Data API, log into your Algorithmia account and create a data collection via the <a href="https://algorithmia.com/data/hosted">Data Collections</a> page.

- Click on **“Add Collection”** under the “My Collections” section on your data collections page.

- After you create your collection you can set the read and write access on your data collection. For more information check out: <a href="{{ site.baseurl }}/data/hosted/">Data Collection Types</a>


<img src="{{ site.baseurl }}/images/post_images/model_hosting/add_collection.png" alt="Create a data collection" class="screenshot img-sm">

### Upload your Model into a Collection
Next, upload your Tensorflow checkpoint and graph to your newly created data collection.

- Load model by clicking box **“Drop files here to upload”**

- Note the path to your files: data://user_name/collections_name/tensorflow.ckpt, data://user_name/collections_name/graph_model_tensorflow.pb

<img src="{{ site.baseurl }}/images/post_images/model_hosting/tensorflow_data_collection.png" alt="Create a data collection" class="screenshot img-md">

## Create your Algorithm
Creating your algorithm is easy!

- To add an algorithm, simply click **“Add Algorithm”** from the user profile icon.
- Name your algorithm, select the language, choose permissions and make the code either open or closed source.

**Note**: There is also a checkbox for 'Standard Execution Environment' or 'Advanced GPU'. For deep learning models you will want to check 'Advanced GPU'.

<img src="{{ site.baseurl }}/images/post_images/model_hosting/create_new_alg_dl_python3.png" alt="Create your algorithm" class="screenshot img-sm">

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

<img src="{{ site.baseurl }}/images/post_images/model_hosting/tensorflow_dependencies.png" alt="Set your dependencies" class="screenshot img-md">

If you plan on using tensorflow with GPU support, make sure to use the
 `tensorflow-gpu` python package instead of the `tensorflow` one, with the version number
  `1.2.0`. It can be written in the dependency file like this: `tensorflow-gpu==1.2.0`.
{: .notice-warning}

We've recently added tensorflow 1.3.0 support, however it uses custom wheels which we've built. Please replace your `tensorflow-gpu==1.2.0` line with:
* python 2 - https://s3.amazonaws.com/algorithmia-wheels/tensorflow-1.3.0-cp27-cp27mu-linux_x86_64.whl
* python 3 - https://s3.amazonaws.com/algorithmia-wheels/tensorflow-1.3.0-cp35-cp35m-linux_x86_64.whl

If you run into any issues with these wheels, please get in touch with us using intercom.
{: .notice-warning}

## Load your Model
Here is where you load your graph and run your model which will be called by the apply() function.
Our recommendation is to preload your model in a separate function before apply(). The reasoning behind this is because when your model is first loaded it can take some time to load depending on the file size. However, with all subsequent calls only the apply() function gets called which will be much faster since your model is already loaded!

Now to check out the code adapted from <a href="https://www.tensorflow.org/versions/r0.9/tutorials/mnist/beginners/index.html">MNIST for Beginners</a> tutorial from Tensorflow:

{% highlight python %}
import Algorithmia
from tensorflow.examples.tutorials.mnist import input_data
import tensorflow as tf

client = Algorithmia.client()

def load_data():
    """Retrieve variable checkpoints and graph from user collection"""
    vc_uri = 'data://user_name/data_collection/variable_checkpoint_tensorflow.ckpt'
    checkpoint_file = client.file(vc_uri).getFile().name

    graph_uri = 'data://user_name/data_collection/graph_model_tensorflow.pb'
    graph_file = client.file(graph_uri).getFile().name

    return (checkpoint_file, graph_file)
    
# Enable allow_growth if you still run into memory issues.
def generate_gpu_config(memory_fraction):
    config = tf.ConfigProto()
    # config.gpu_options.allow_growth = True
    config.gpu_options.per_process_gpu_memory_fraction = memory_fraction
    return config

# Get called once
saver = tf.train.Saver()
checkpoints, graph = load_data()

def inject_data(input):
    """
    Finds the prediction and accuracy of digit image

    Prints accuracy and predictions on user input
    """
    # Set your memory fraction equal to a value less than 1, 0.6 is a good starting point.
    # If no fraction is defined, the tensorflow algorithm may run into gpu out of memory problems.
    fraction = 0.6
    
    # Inject data into Tensor graph
    with tf.Session(graph=graph, config=generate_gpu_config(fraction)) as sess:
        # Load previously saved graph
        with tf.gfile.FastGFile(graph, 'rb') as f:
            graph_def = tf.GraphDef()
            graph_def.ParseFromString(f.read())
            tf.import_graph_def(graph_def, name='')
        # Map variables
        saver.restore(sess, checkpoints)
        y_ = sess.graph.get_tensor_by_name('Placeholder_1:0')
        y = sess.graph.get_tensor_by_name('Softmax:0')
        x = sess.graph.get_tensor_by_name('Placeholder:0')

        correct_prediction = tf.equal(tf.argmax(y, 1), tf.argmax(y_, 1))
        accuracy = tf.reduce_mean(tf.cast(correct_prediction, tf.float32))
        print(sess.run(accuracy, feed_dict={
              x: input, y_: mnist.test.labels}))
        prediction = tf.argmax(y, 1)
        print(prediction.eval(feed_dict={x: input}))

def apply(input):
    """
    Input would be an image file either from:

    data sources via https://algorithmia.com/data using the Data API
    or as an http request using urllib
    """
    output = inject_data(input)
    return output
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

If you want to have a better idea of how a finished tensorflow algorithm looks like, check out: <a href="https://algorithmia.com/algorithms/deeplearning/InceptionNet/edit">InceptionNet</a>

For more information and detailed steps: <a href="{{ site.baseurl }}/algorithm-development/your-first-algo/">creating and publishing your algorithm</a>

That's it for hosting your <a href="https://www.tensorflow.org/">tensorflow</a> model on Algorithmia!
