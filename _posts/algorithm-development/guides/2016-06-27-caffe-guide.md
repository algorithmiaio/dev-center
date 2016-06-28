---
layout: article
title:  "Hosting your Caffe model"
excerpt: "Guide to hosting your Caffe model on Algorithmia."
date:   2016-05-26 14:28:42
permalink: /algorithm-development/guides/caffe-guide
tags: [algo-model-guide]
show_related: true
author: steph_kim
image:
    teaser: /language_logos/python.png
---


Welcome to hosting your <a href="http://caffe.berkeleyvision.org/">Caffe</a> model on Algorithmia!
This guide is designed as an introduction to hosting a Caffe model and publishing an algorithm even if you’ve never used Algorithmia before.


## Prerequisites
Maybe you've got a great idea or have tirelessly worked on a project in your spare time and you want it to be useful to others. Before you get started hosting your model on Algorithmia there are a few things you'll want to do first:

#### Train your model.
You have a model that labels images. You've discovered the features you want to include, you've trained your model and validated it with your validation data set. You're happy with your results and now need to save your variable checkpoints and the graph from your trained model so you can upload it to Algorithmia.

## Create a Data Collection
Here you'll want to create a data collection to host your graph and variable checkpoint data.

- To use the Data API, log into your Algorithmia account and create a data collection via the <a href="https://algorithmia.com/data/hosted">Data Collections</a> page.

- Click on “Add Collection” under the “My Collections” section on your data collections page.

- Set the read and write access on your collection. For more information check out: <a href="http://developers.algorithmia.com/application-development/data-sources/hosted-data-guide/">Data Collection Types</a>


<img src="/images/post_images/model_hosting/caffe_add_collection.png" alt="Create a data collection" style="width: 700px;"/>

### Upload your Model into a Collection
Next, upload your pickled model to your newly created data collection.

- Load model by clicking box “Drop files here to upload”

- Note the path to your files: data://username/collections_name/pickled_model.pkl

<img src="/images/post_images/model_hosting/caffe_update_collections.png" alt="Create a data collection" style="width: 700px;"/>

## Create your Algorithm
Creating your algorithm is easy!

- To add an algorithm, simply click “Add Algorithm” from the user profile icon.
- Name your algorithm, select the language, choose permissions and make the code either open or closed source.

<img src="/images/post_images/model_hosting/create_new_alg.png" alt="Create your algorithm" style="width: 700px;"/>

### Set your Dependencies
Now is the time to set your dependencies that your model relies on.

- Click on the dependencies button at the top right of the UI and list your packages under the required ones already listed and save at the button on the bottom right corner.

<img src="/images/post_images/model_hosting/caffe_dependencies.png" alt="Set your dependencies" style="width: 700px;"/>

## Load your Model
Now you'll want to load your graph and run your model which will be called by the apply() function.
Our recommendation is to preload your model in a separate function before apply(). The reasoning behind this is because when your model is first loaded it can take some time to load depending on the file size. However, with all subsequent calls only the apply() function gets called which will be much faster since your model is already loaded!

Here is a code example taken from the begi

{% highlight python %}
import Algorithmia
import csv
from Caffe.examples.tutorials.mnist import input_data
import Caffe as tf

client = Algorithmia.client()

def variable_checkpoint():
    """Retrieve variable checkpoints from user collection"""
    file_path = 'data://user_name/Caffe_model_demo/variable_checkpoint.ckpt'
    checkpoint_path = client.file(file_path).getFile().name
    return checkpoint_path
    
def saved_graph():
    """Retrieve graph from model stored in user collection"""
    file_path = 'data://user_name/Caffe_model_demo/graph_model.pb'
    graph_path = client.file(file_path).getFile().name
    return graph_path 
 
# Get called once   
saver = tf.train.Saver()
checkpoints = variable_checkpoint()
graph = saved_graph()

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
    output = inject_data(input)
    return output
{% endhighlight %}

## Publish your Algorithm
Last is publishing your algorithm. The best part of hosting your model on Algorithmia is that users can access it via an API that takes only a few lines of code to use! Here is what you can set when publishing your algorithm:

- Set version permissions to public or private use

- Set it to royalty free or set to per-call royalty

- Set access permissions to have full access to the internet and ability to call other algorithms

For more information and detailed steps: <a href="http://developers.algorithmia.com/basics/your_first_algo/">creating and publishing your algorithm</a>

<img src="/images/post_images/model_hosting/publish_alg.png" alt="Publish your algorithm" style="width: 700px"/>

That's it for hosting your <a href="http://caffe.berkeleyvision.org/">Caffe</a> model on Algorithmia!
