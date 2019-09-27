---
layout: article
title:  "Batch Processing"
permalink: algorithm-development/advanced-algorithm-development/batch-processing/
excerpt: "Batch Processing: efficiently run predictions on large data volumes"
categories: [algo-dev]
tags: [algo-dev]
show_related: true
author: jon_peck
image:
    teaser: /post_images/batch-processing/batch_processing.png
---

<img src="{{site.baseurl}}/images/post_images/batch-processing/batch_processing_wide.png" class="img-fill">

Many Machine Learning models are initially coded to accept a single input and return a single prediction. In batch processing (aka batch prediction), we wish to send a large volume of inputs -- possibly millions. Then, the model should score each input and aggregate the results into a file, datastore, or queue.

Some systems enforce a rigid separation between single and batch prediction mode. Algorithmia does not; instead, it provides a flexible system in which you can perform individual, serial-batch, or parallel-batch prediction using the same model.

## Single Predictions   

This is the default mode for Algorithmia: your model is hosted as a web endpoint (an "Algorithm"), which accepts an API call containing some data it should run a prediction against, and it returns the result as a JSON payload. In some cases, the Algorithm developer may chose to write the results to a file or datastore instead of (or in addition to) returning them as JSON; this is up to the individual Algorithm developer to decide.

## Batch Predictions using Spark

Apache spark is a map-reduce system, which automatically knows how to pull the data from distributed sources, and map them to computation resources elsewhere. If you already have Spark in your ecosystem, or wish to add it, it can be easily configured to use Algorithmia to run batch predictions without making any changes to your Algorithm code.

<a href="{{site.baseurl}}/integrations/spark-streaming" class="btn btn-default btn-primary"><i class="fa fa-cog" aria-hidden="true"></i> CONFIGURE SPARK</a>

## Batch Predictions using an external Message Queue

If you are already using a Message Queue such as Amazon SQS to process batch data, it can be pointed at your Algorithm to score each piece of data. However, since most message Queues do not listen for a response, you'll want to ensure that the Algorithm's response payload is captured in a datastore or log. The best way to do this is to alter the Algorithm's code to always send results to a storage target (or optionally do so if a flag is provided in the input payload). If the Algorithm cannot be altered, you can instead add a wrapper Algorithm to capture the output, and call this wrapper from your Message Queue; for example, if we wished to call nlp/SentimentAnalysis/1.0.5 and capture the results in a file, we would write a wrapper Algorithm as follows:

```python
# this code would be its own Algorithm such as SentimentAnalysisLogged
import Algorithmia

client = Algorithmia.client()
algo = client.algo('nlp/SentimentAnalysis/1.0.5')

def apply(input):
    results = algo.pipe(input_single)
    # then write "results" to a logfile or datastore
    return results
```

<a href="{{site.baseurl}}/integrations/event_listeners" class="btn btn-default btn-primary"><i class="fa fa-cog" aria-hidden="true"></i> CONFIGURE AMAZON SQS</a>

## Serial Batch Predictions via wrapper code

If you are not using Spark or a Message Queue, you can write a simple wrapper to serially call an Algorithm for each prediction in your batch, e.g.:

```python
# this code runs from a desktop or separate server
client = Algorithmia.client("YOUR_API_KEY")
algo = client.algo('nlp/SentimentAnalysis/1.0.5')
results = []

for single in batch:
    results.append(algo.pipe(single).result)
# then write "results" to a logfile or datastore
```

When run from a separate server, this can incur significant overhead, because each `algo.pipe()` call is a separate REST API call over the network. To abate this, a better approach can be to create a wrapper Algorithm which does the same thing:

```python
# this code would be its own Algorithm such as SentimentAnalysisBatch, and expects a list as input
client = Algorithmia.client()
algo = client.algo('nlp/SentimentAnalysis/1.0.5')

def apply(input):
    results = []
    for single in input:
        results.append(algo.pipe(single).result)
    # optional: write "results" to a logfile or datastore
    return results
``` 

Then, your external server can make a single call to the batch wrapper Algorithm, passing all inputs in a single network call, thus reducing the impact of network overhead on overall throughput.

If possible, it is even better to alter the original Algorithm so that it can accept **either** a single input or batch inputs; this eliminates the need for a wrapper Algorithm which consumes extra resources.

For example, if the original Algorithm contained:

```python
def apply(input):
    return someCalculation(input)
``` 

Then it could be easily altered to check for an `input` of type list:

```python
def apply(input):
    if isinstance(input, list):
        results = []
        for single in input:
            results.append(someCalculation(single))
        return results
    else:
        return someCalculation(input)
```

Whether using a wrapper function or altering the original Algorithm, remember that the maximum runtime for an Algorithm is 50 minutes, and you must specify this longer timeout in the call to the Algorithm via the [timeout parameter](https://algorithmia.com/developers/api/#query-parameters). If 50 minutes will not be sufficient for the entire batch to complete, break the batch up into smaller chunks, and call each chunk serially from a loop on your external server.

Similarly, there is a 10MB maximum on the total data sent in or returned on a single call, so consider breaking up batches into smaller chunks, or using sideband data loading (from files or a datastore) if this becomes a limiting factor.

## Parallel Batch Predictions via wrapper code

The advantage of using **serial** batch predictions is that you won't create significant load on Algorithmia: because each prediction is called immediately after the prior, a single endpoint instance will handle all the calls.

However, if overall speed is more important than limiting the load, make **parallel** calls to your Algorithm instead. This will cause multiple copies of the endpoint to spin up simultaneously, creating more server load, but improving throughput.

We can use the same basic approach as outlined in the Serial Batch Predictions approach, but instead of using loops around the `algo.pipe()` calls, we use multithreading to parallelize these calls.

<a href="{{site.baseurl}}/algorithm-development/advanced-algorithm-development/multithreading" class="btn btn-default btn-primary"><i class="fa fa-book" aria-hidden="true"></i> EXPLORE MULTITHREADING</a>
