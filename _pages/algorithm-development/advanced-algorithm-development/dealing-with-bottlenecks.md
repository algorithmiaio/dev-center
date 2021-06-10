---
author: james_sutton
categories: [algo-dev]
excerpt: "Examples on how to remove performance bottlenecks, from bandwidth to compute"
image:
    teaser: /post_images/dealing_with_bottlenecks/dealing_with_bottlenecks.png
layout: article
permalink: /algorithm-development/advanced-algorithm-development/dealing-with-bottlenecks/
show_related: true
tags: [algo-dev]
title: "Algorithm Bottlenecks: How to get the most out of your algorithms"
---

# Removing algorithm performance bottlenecks in algorithm development

This tutorial is primarily targeted at an advanced audience looking for solutions to improve runtime performance of already existing algorithms by removing bottlenecks.
 If you'd like to find the introductory tutorials please check [this page]({{site.baseurl}}/algorithm-development/advanced-algorithm-development) first.


So at this point you've probably got some experience making algorithms, 
however as you explore deeper into what Algorithmia has to offer it's possible that you may have hit one or more performance bottlenecks that can affect performance.

In this tutorial we'll talk about `bandwidth` and `compute` bottlenecks, and how we can overcome those issues with more advanced techniques.

## Example code
If you just want to see example code, and work through these ideas yourself here are some gists:
- [original algorithm](https://gist.github.com/zeryx/9b5ffb814e8629b6a9eb3b4c41dbee72)
- [async example](https://gist.github.com/zeryx/88aad1f558cc23e438876091d2c626c3)
- [recursion example](https://gist.github.com/zeryx/5068fc21fb5385d3428c49879910aca3)
- [orchestration example](https://gist.github.com/zeryx/bccffe585ed677a0f32a57b97e1d997e)



# Basic Algorithm
Below is an example image classifier using Tensorflow, it returns a list of classes based off of [ImageNet](http://www.image-net.org/). We'll be modifying this example as we continue with this tutorial.

[example algorithm here](https://algorithmia.com/algorithms/zeryx/basic_image_algorithm)

```
import Algorithmia
import tensorflow as tf
import os
from .auxillary import load_model, id_to_string
import numpy as np

client = Algorithmia.client()
graph, label_index = load_model(client)

# API calls will begin at the apply() method, with the request body passed as 'input'
# For more details, see algorithmia.com/developers/algorithm-development/languages
    
def get_image(url):
    """Uses the Smart Image Downloader algorithm to format and download images from the web or other places."""
    input = {'image': str(url)}
    output_url = client.algo("util/SmartImageDownloader/0.2.x").pipe(input).result['savePath'][0]
    temp_file = client.file(output_url).getFile().name
    os.rename(temp_file, temp_file + '.' + output_url.split('.')[-1])
    return temp_file + '.' + output_url.split('.')[-1]


def do_work(image):
    """Does some computer vision work and needs a numpy array to function"""
    image_data = tf.gfile.FastGFile(image, 'rb').read()
    with tf.Session(graph=graph) as sess:
        softmax_tensor = sess.graph.get_tensor_by_name('softmax:0')
        predictions = sess.run(softmax_tensor,
                               {'DecodeJpeg/contents:0': image_data})
        predictions = np.squeeze(predictions)
        tags = []
        top_k = predictions.argsort()[-5:][::-1]

        for node_id in top_k:
            human_string = id_to_string(label_index, node_id)
            score = predictions[node_id]
            result = {}
            result['class'] = human_string
            result['confidence'] = score.item()
            tags.append(result)
        results = {}
        results['tags'] = tags
        return results

def apply(input):
    image_data = get_image(input)
    results = do_work(image_data)
    return results

```

This is works perfectly for situations where you just want to get image support to an algorithm that needs to do serial processing and then do some monolithic processing using a gpu or other resources to get a final result, one image at a time.
However, if you're dealing with a production system, you're most likely going to be using more than 1 downstream algorithm and you'll also want to improve performance as much as possible, especially in batch. In that case, you're in luck! This tutorial will go over the different mechanisms you can use both inside of your algorithm, and outside to get the results you're looking for.

# Bandwidth Bottlenecks

## Async and Futures
Your algorithm above works great, but now you need to improve performance and enable batch processing. 
Your algorithm executes code very quickly (which is great!) but the http requests to actually download images or some other web resource take a variable amount of time, and are eating up a huge chunk of the total compute time.
Well we're in luck having multiple threads open trying to access http/https resources don't consume precious cpu clock cycles due to the [DMA](https://en.wikipedia.org/wiki/Direct_memory_access) controllers built into all modern CPUs.
This is when using an `async` function may be of value (and Futures). This structure allows you to make a series of requests in parallel, and just wait for them all to finish while not stealing resources from the image classification subroutine.

[example algorithm here](https://algorithmia.com/algorithms/zeryx/async_image_algorithm)
```
...
...
import asyncio
...
...

# We've added a processor function that gets and processes an image, but is prefixed with an  'async'
# We did this, as when dealing with batch for image processing algorithms, it's common that bottleneck is http and getting
# the images from a remote resource into your system.


# You can read more about 'asyncio' here: https://docs.python.org/3/library/asyncio.html
# Bare in mind that if you're using a version of python < 3.5, you'll need to import it as a pypi package.

async def process_url(url):
    image_data = get_image(url)
    result = do_work(image_data)
    return result



def apply(input):
    loop = asyncio.get_event_loop()
    # We have a list of inputs that we're going to want to loop over
    if isinstance(input, list):
        future_images = []
        for url in input:
            async_image = asyncio.ensure_future(process_url(url))
            future_images.append(async_image)
        # Now we have a list of promises, let's loop through them until there's nothing left
        results = loop.run_until_complete(asyncio.gather(*future_images))
        return  results
    elif isinstance(input, str):
        # And if we are only processing one image at a time, lets keep the old functionality as well
        image_data = get_image(input)
        result = do_work(image_data)
        return result
    else:
        raise Exception("Invalid input, expecting a list of Urls or a single URL string.")

```


This structure can be used in many languages, including [Scala](https://docs.scala-lang.org/overviews/core/futures.html), [Java](https://www.baeldung.com/java-future) and [Rust](https://docs.rs/futures/0.1.29/futures/).

# Compute Bottlenecks

Now imagine instead of a bandwidth problem, we have a compute problem. The algorithm takes time to compute a result, sometimes upwards of 10-30 seconds, this is not unrealistic for larger models that use Deep Learning.
Now, you're tasked again with turning this into a high performance pipeline that could process many requests per second, such as a streaming pipeline, how would we go about doing that?

These next examples will help you grasp this and give you the tools you need to build the right algorithm.
## Algorithm Orchestration
In this example, we create a dedicated algorithm to process requests for potentially a number of algorithms as a batch, we call this an `Orchestrator` and is the simplest solution as it doesn't require any modifications to the algorithm code we wrote above.
[example algorithm here](https://algorithmia.com/algorithms/algorithmiahq/Algorithm_Orchestration_Example)

```
...
...
from multiprocessing import Manager, Pool

# API calls will begin at the apply() method, with the request body passed as 'input'
# For more details, see algorithmia.com/developers/algorithm-development/languages

ALGO_1 = "algorithmiahq/DeepFashion/1.3.0"
ALGO_2 = "algorithmiahq/multistageclassifierpetsdemo/0.1.0"
ALGO_3 = "character_recognition/tesseract/0.3.0"
# This threadpool is shared between all 3 algorithm requests, this keeps the number of active children restricted and easily controlled
# If desired, we could split this up into a dedicated threadpool for each child algorithm
THREADPOOL_SIZE = 5

client = Algorithmia.client()


def call_ALGO_1(image, errorQ):
    try:
        if errorQ.empty():
            input = {"image": image, "model": "small", "tags_only": True}
            print("running algo 1 with: {} ...".format(image))
            result = client.algo(ALGO_1).pipe(input).result
            print("finished algo 1 with: {}...".format(image))
            return {"image": image, "result": result}
        else:
            return None
    except Exception as e:
        errorQ.put(e)


def call_ALGO_2(image, errorQ):
    try:
        if errorQ.empty():
            input = image
            print("running algo 2 with: {} ...".format(image))
            result = client.algo(ALGO_2).pipe(input).result
            print("finished algo 2 with: {}...".format(image))
            return {"image": image, "result": result}
        else:
            return None
    except Exception as e:
        errorQ.put(e)


def call_ALGO_3(image, errorQ):
    try:
        if errorQ.empty():
            input = {"image": image, "language": "eng"}
            print("running algo 3 with: ...".format(image))
            result = client.algo(ALGO_3).pipe(input).result
            print("finished algo 3 with: {}...".format(image))
            return {"image": image, "result": result}
        else:
            return None
    except Exception as e:
        errorQ.put(e)


def apply(input):
    if isinstance(input, list):
        process_pool = Pool(THREADPOOL_SIZE)
        manager = Manager()
        errorQ = manager.Queue()
        threadable_inputs = [(image, errorQ) for image in input]
        algo1_c = process_pool.starmap_async(call_ALGO_1, threadable_inputs)
        algo2_c = process_pool.starmap_async(call_ALGO_2, threadable_inputs)
        algo3_c = process_pool.starmap_async(call_ALGO_3, threadable_inputs)
        algo1_results = algo1_c.get()
        algo2_results = algo2_c.get()
        algo3_results = algo3_c.get()
        if errorQ.empty():
            return {"algo_1": algo1_results, "algo_2": algo2_results, "algo_3": algo3_results}
        else:
            raise errorQ.get()
    else:
        raise Exception("Input must be a list of image urls")
```

The pros for this approach is that it allows you to run algorithms in batch without modification, along with making it easy to read and understand what's going on.

The problem however, is that unless this orchestrator has some necessary work it needs to perform it'll be sitting idle most of the time as it waits for work to complete.
 In most circumstances this is perfectly fine, however for some more advanced uses where ultra high response times are required. You may need something else.

## Algorithm Recursion
If optimal batch performance is required, algorithm recursion might make sense. But keep in mind, _here be dragons!_
Creating an algorithm that calls itself is fine once published, but during development it can be tricky - be sure to capture the build hash when you compile a working version.
When we refer to [recursion](https://en.wikipedia.org/wiki/Recursion#In_computer_science) we're talking about writing algorithm code in such a way that if 
an excess of requests is discovered, the algorithm will make child/pipeline requests a new instance of itself, while still processing some work itself.
[example algorithm here](https://algorithmia.com/algorithms/zeryx/recursive_image_example)

```
...
...
from multiprocessing import Manager, Pool
...
...

# In this example we look at solving batch processing problems with algorithm recursion and pipelining.

client = Algorithmia.client()
graph, label_index = load_model(client)

#-- IMPORANT --# be aware of the algorithm version you're calling, as this is self-referential while you're doing development you may need to replace this variable with a version hash.
THIS_ALGO = "zeryx/recursive_image_example/0.1.x"
# The number of recursive requests that will be open at any time, this keeps us from overwelming the development environment by constraining our resources to some reasonable maximum.
NUM_PARALLEL_REQUESTS = 10
# The maximum amount of work each algorithm will request will handle before recursing
MAX_WORK_PER_REQUEST = 8

...
...


def algorithm_recursion_(input, errorQ):
    """This function will create a threadpool and make parallel calls to _algo, and return a callback.
    As you can see, we limit the pool size by some value to ensure we don't overload anthing.
    Besides that, we also blend the errorQ object into each chunk of data that we're passing into _algo.

    If desired, a pool.starmap() can simplify this process."""
    pool = Pool(NUM_PARALLEL_REQUESTS)
    chunks = _chunks(input, MAX_WORK_PER_REQUEST)
    process_data = [(chunk, errorQ) for chunk in chunks]
    async_ops = pool.starmap_async(_algo, process_data)
    return async_ops


def _chunks(l, n):
    """Yield successive n-sized chunks from l."""
    for i in range(0, len(l), n):
        yield l[i:i + n]


def _algo(algo_data, errorQ):
    """The primary working algorithm for our parallel threads, makes parallel requests and checks if errors exist"""
    try:
        if errorQ.empty():
            print("processing chunk..")
            response = client.algo(THIS_ALGO).pipe(algo_data).result
            print("finished chunk..")
            return response
        else:
            return None

    except Exception as e:
        errorQ.put(e)


def batch_apply(input):
    """Simple sequential small batch processing, can be made parallel if necessary"""
    results = []
    for image in input:
        results.append(apply(image))
    return results


def apply(input):
    if isinstance(input, str):
        image = get_image(input)
        results = {"image": input, "results": do_work(image)}
    elif isinstance(input, dict) and "image" in input:
        image = get_image(input['image'])
        results = {"image": input['image'], "results": do_work(image)}
    elif isinstance(input, list):
        # If we do have a small list, it doesn't make sense to send off each request to a different machine,
        # it might just be easier to process it here.
        if len(input) < MAX_WORK_PER_REQUEST:
            results = batch_apply(input)
        else:
            # Lets take some work for this algorithm to work on, before we pass the remainder to our recursively
            # called algorithms
            input_for_this_worker = input[:MAX_WORK_PER_REQUEST]
            remaining_work = input[MAX_WORK_PER_REQUEST:]
            # This object allows us to pass error messages and exceptions between threads, which can be very useful
            # when things don't go as planned
            manager = Manager()
            errorQ = manager.Queue()
            # We spin off the recursive / threading components of the algorithm to a separate thread so that we can
            # process this algorithm's batch of work concurrently
            eventual_remote_results = algorithm_recursion_(remaining_work, errorQ)
            local_results = batch_apply(input_for_this_worker)
            concurrent_results = eventual_remote_results.get()
            # Make sure to check your error Q before returning a result, if it has errors we should return them as
            # something went wrong
            if errorQ.empty():
                results = local_results + concurrent_results
            else:
                raise errorQ.get()
    else:
        raise Exception("Input format invalid")
    return results

```

As you can imagine, you can mix/match those techniques as necessary to optimize your pipeline the one additional recommendation we have is when you're building your own parallel pipelines, 
to try and experiement with small # of parallelism first (1-2 threads) and ensure that works before scaling up.

Other than that, if you have any questions or comments around any of these examples please feel free to reach out.
