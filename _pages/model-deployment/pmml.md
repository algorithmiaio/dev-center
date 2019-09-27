---
layout: article
title:  "PMML"
excerpt: "Deploy your PMML model to Algorithmia."
categories: model-guides
tags: [algo-model-guide, pmml-model]
show_related: true
author: steph_kim
image:
    teaser: /language_logos/algo_icon.svg
---


Welcome to deploying your <a href="http://dmg.org/pmml/v4-3/GeneralStructure.html">PMML</a> model on Algorithmia!

Whether you have an older model exported to PMML structure, or have just trained a model using Spark ML which exports to PMML, you can easily deploy your model on Algorithmia.

Note: this guide uses the web UI to create and deploy your Algorithm. If you prefer a code-only approach to deployment, review [Algorithm Management API]({{site.baseurl}}/algorithm-development/algorithm-management-api) after reading this guide.
{: .notice-info}

## Table of Contents
* [Prerequisites](#prerequisites)
  * [Save your Pre-Trained Model](#save-your-pre-trained-model)
  * [Create a Data Collection](#create-a-data-collection)
  * [Host Your Model File](#host-your-model-file)
* [Create your Algorithm](#create-your-algorithm)
* [Set your Dependencies](#set-your-dependencies)
* [Load your Model](#load-your-model)
  * [Using the SavedModel Method](#using-the-savedmodel-method)
  * [GPU memory tricks](#gpu-memory-tricks)
* [Publish your Algorithm](#publish-your-algorithm)


## Prerequisites
Before you get started deploying your pre-trained model on Algorithmia, there are a few things you'll want to do first:

### Save your Pre-Trained Model
You'll want to do the training and saving of your model on your local machine, or the platform you're using for training, before you deploy it to production on the Algorithmia platform.

### Create a Data Collection
Host your data where you want and serve it to your model with Algorithmia's <a href="http://docs.algorithmia.com/">Data API</a>.

In this guide we'll use Algorithmia's <a href="{{site.baseurl}}/data/hosted">Hosted Data Collection</a>, but you can host it in <a href="{{site.baseurl}}/data/s3">S3</a> or <a href="{{site.baseurl}}/data/dropbox">Dropbox</a> as well. Alternatively, if your data lies in a database, [check out]({{site.baseurl}}/data/dynamodb) how we connected to a DynamoDB database.

First, you'll want to create a data collection to host any data associated with your model and your PMML model itself.

- Log into your Algorithmia account and create a data collection via the <a href="{{site.baseurl}}/data/hosted">Data Collections</a> page.

- Click on **“Add Collection”** under the “My Collections” section.

- After you create your collection you can set the read and write access on your data collection.

<img src="{{site.baseurl}}/images/post_images/model_hosting/add_collection.png" alt="Create a data collection" class="screenshot img-sm">

For more information check out: <a href="{{site.baseurl}}/data/hosted">Data Collection Types</a>.

Note, that you can also use the <a href="https://docs.algorithmia.com/#data-uri">Data API</a> to create data collections and upload files.

### Host Your Model File
Next, upload your serialized model to your newly created data collection.

- Load model by clicking box **“Drop files here to upload”**

- Note the path to your data collection and the zip folder: data://user_name/collections_name/model.zip

<img src="{{site.baseurl}}/images/post_images/model_hosting/pmml_data_collection.png" alt="Create a data collection" class="screenshot img-md">

## Create your Algorithm

Hopefully you've already followed along with the <a href="{{site.baseurl}}/algorithm-development/algorithm-basics/your-first-algo">Getting Started Guide</a> for algorithm development. If not, you might want to check it out in order to understand the various permission types, how to enable a GPU environment, and use the CLI.

Once you've gone through the <a href="{{site.baseurl}}/algorithm-development/algorithm-basics/your-first-algo">Getting Started Guide</a>, you'll notice that when you've created your algorithm, there is boilerplate code in the editor that returns "Hello" and whatever you input to the console.

The main thing to note about the algorithm is that it's wrapped in the `apply()` function.

The apply() function defines the input point of the algorithm. We use the apply() function in order to make different algorithms standardized. This makes them easily chained and helps authors think about designing their algorithms in a way that makes them easy to leverage and predictable for end users.

Go ahead and remove the boilerplate code below that's inside the `apply()` function on line 6, but leave the `apply()` function intact:

<img src="{{site.baseurl}}/images/post_images/model_hosting/scala_console.png" alt="Algorithm console Scala" class="screenshot">

### Set your Dependencies
Now is the time to set your dependencies that your model relies on.

- Click on the **"Dependencies"** button at the top right of the UI and list your packages under the required ones already listed and click **"Save Dependencies"** on the bottom right corner.

<img src="{{site.baseurl}}/images/post_images/model_hosting/scala_pmml_dependencies.png" alt="Set your dependencies" class="screenshot img-md">

## Load your Model

Here is where you load and run your model which will be called by the apply() function.

When you load your model, our recommendation is to preload your model in a separate function external to the apply() function.

This is because when a model is first loaded it can take time to load depending on the file size.

Then, with all subsequent calls only the apply() function gets called which will be much faster since your model is already loaded.

If you are authoring an algorithm, avoid using the ‘.my’ pseudonym in the source code. When the algorithm is executed, ‘.my’ will be interpreted as the user name of the user who called the algorithm, rather than the author’s user name.
{: .notice-warning}

Note that you always want to create valid JSON input and output in your algorithm. For examples see the <a href="/algorithm-development/languages/java/#io-for-your-algorithms">Client Guides</a>.

### Using the SavedModel Method

This is where we'll show how to deploy your saved model to make predictions on the sample data.

{% highlight scala %}
package algorithmia.LoadPmmlKmeans

import com.algorithmia._
import com.algorithmia.algo._
import com.algorithmia.data._
import com.google.gson._

import java.io.File
import java.io.FileInputStream
import org.xml.sax.InputSource
import org.dmg.pmml.{FieldName, PMML}
import org.jpmml.evaluator.{Evaluator, FieldValue, ModelEvaluatorFactory}
import org.jpmml.model.JAXBUtil
import org.jpmml.model.filters.ImportFilter
import scala.collection.mutable
import scala.collection.JavaConversions._

object LoadPmmlKmeans{
  val client = Algorithmia.client()

  val model = loadModel()

  def loadModel(): Evaluator = {
    // Download the file
    val XMLFilePath = "data://YOUR_USERNAME/YOUR_DATACOLLECTION/kmeans.xml"
    val xmlFile = client.file(XMLFilePath).getFile.getAbsolutePath
    // PMML Evaluator
    val evaluator = prepModelEvaluator(readPMML(xmlFile))
    evaluator
  }

  def getResults(evaluator: Evaluator, input: String): String = {
    val inputFields = evaluator.getInputFields
    val arguments = mutable.LinkedHashMap.empty[FieldName,FieldValue]
    for (inputField <- inputFields) {
      val inputFieldName = inputField.getName
      val inputFieldValue = inputField.prepare(input)
      arguments.put(inputFieldName, inputFieldValue)
    }
    val results = evaluator.evaluate(arguments).get(null)
    println(results)
    results.toString
  }


  // Reads the PMML File and returns a PMML object
  def readPMML(filename: String): PMML = {
    val kmeans_file = new FileInputStream(new File(filename))
    try {
      val source = ImportFilter.apply(new InputSource(kmeans_file))
      return JAXBUtil.unmarshalPMML(source)
    } finally {
      kmeans_file.close();
    }
  }

  // Prepares the model evaluator
  def prepModelEvaluator(pmml: PMML): Evaluator = {
    ModelEvaluatorFactory.newInstance().newModelEvaluator(pmml)
  }
}


class LoadPmmlKmeans {
  def apply(input: String): String = {
    var model = LoadPmmlKmeans.model
    var result = LoadPmmlKmeans.getResults(model, input)
    result
  }
}

{% endhighlight %}

## Publish your Algorithm
Last is publishing your algorithm. The best part of hosting your model on Algorithmia is that users can access it via an API that takes only a few lines of code to use! Here is what you can set when publishing your algorithm:

On the upper right hand side of the algorithm page you'll see a purple button "Publish" which will bring up a modal:

<img src="{{site.baseurl}}/images/post_images/algo_dev_lang/publish_algorithm.png" alt="Publish an algorithm" class="screenshot img-sm">

In this modal, you'll see a Changes tab, a Sample I/O tab, and one called Versioning.

If you don't recall from the <a href="{{site.baseurl}}/algorithm-development/algorithm-basics/your-first-algo">Getting Started Guide</a> how to go through the process of publishing your model, check that out before you finish publishing.

If you want to have a better idea of what a finished Scala algorithm looks like loading a PMML model saved from Spark ML, check out: <a href="https://algorithmia.com/algorithms/stephanie/LoadPmmlKmeans">LoadPmmlKmeans</a>.

That's it for hosting your PMML model on Algorithmia!
