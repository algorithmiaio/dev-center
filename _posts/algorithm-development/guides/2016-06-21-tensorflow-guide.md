---
layout: article
title:  "Tensorflow"
excerpt: "Bring your Tensorflow graph model to Algorithmia."
date:   2016-05-26 14:28:42
permalink: /algorithm-development/model-guides/tensorflow
tags: [algo-model-guide]
show_related: true
author: steph_kim
image:
    teaser: /language_logos/python.png
---


Welcome to hosting your <a href="https://www.tensorflow.org/">Tensorflow</a> model on Algorithmia!
This guide is designed as an introduction to hosting a Tensorflow model and publishing an algorithm even if you’ve never used Algorithmia before.


## Prerequisites
Maybe you've got a great idea or have tirelessly worked on a project in your spare time and you want it to be useful to others. Before you get started hosting your model on Algorithmia there are a few things you'll want to do first:

#### Train your model.
You have a model that labels images. You've discovered the features you want to include, you've trained your model and validated it with your validation data set. You're happy with your results and now need to save your variable checkpoints and the graph from your trained model so you can upload it to Algorithmia.

## Create a Data Collection
Here you'll want to create a data collection to host your graph and variable checkpoint data.

- To use the Data API, log into your Algorithmia account and create a data collection via the <a href="https://algorithmia.com/data/hosted">Data Collections</a> page.

- Click on “Add Collection” under the “My Collections” section on your data collections page.

- After you create your collection you can set the read and write access on your data collection. For more information check out: <a href="http://developers.algorithmia.com/application-development/data-sources/hosted-data-guide/">Data Collection Types</a>


<img src="/images/post_images/model_hosting/add_collection.png" alt="Create a data collection" class="screenshot">

### Upload your Model into a Collection
Next, upload your pickled model to your newly created data collection.

- Load model by clicking box “Drop files here to upload”

- Note the path to your files: data://username/collections_name/pickled_model.pkl

<img src="/images/post_images/model_hosting/tensorflow_update_collections.png" alt="Create a data collection" class="screenshot">

## Create your Algorithm
Creating your algorithm is easy!

- To add an algorithm, simply click “Add Algorithm” from the user profile icon.
- Name your algorithm, select the language, choose permissions and make the code either open or closed source.

**Note**: There is also a checkbox for 'Standard Execution Environment' or 'Advanced GPU'. For deep learning models you will want to check 'Advanced GPU'.

<img src="/images/post_images/model_hosting/create_new_alg_dl_python3.png" alt="Create your algorithm" class="screenshot">

### Set your Dependencies
Now is the time to set your dependencies that your model relies on.

- Click on the dependencies button at the top right of the UI and list your packages under the required ones already listed and click 'Save Dependencies' on the bottom right corner.

<img src="/images/post_images/model_hosting/tensorflow_dependencies.png" alt="Set your dependencies" class="screenshot">

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
    vc_uri = 'data://user_name/demos/variable_checkpoint_tensorflow.ckpt'
    checkpoint_file = client.file(vc_uri).getFile().name

    graph_uri = 'data://user_name/models/graph_model_tensorflow.pb'
    graph_file = client.file(graph_uri).getFile().name

    return (checkpoint_file, graph_file)

 
# Get called once   
saver = tf.train.Saver()
checkpoints, graph = load_data()

def inject_data(input):
    """
    Finds the prediction and accuracy of digit image

    Prints accuracy and predictions on user input
    """
    # Inject data into Tensor graph
    with tf.Session() as sess:
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

## Publish your Algorithm
Last is publishing your algorithm. The best part of hosting your model on Algorithmia is that users can access it via an API that takes only a few lines of code to use! Here is what you can set when publishing your algorithm:

- Set version permissions to public or private use

- Set it to royalty free or set to per-call royalty

- Set access permissions to have full access to the internet and ability to call other algorithms

For more information and detailed steps: <a href="http://developers.algorithmia.com/basics/your_first_algo/">creating and publishing your algorithm</a>

<img src="/images/post_images/model_hosting/publish_alg.png" alt="Publish your algorithm" class="screenshot">

That's it for hosting your <a href="https://www.tensorflow.org/">tensorflow</a> model on Algorithmia!
