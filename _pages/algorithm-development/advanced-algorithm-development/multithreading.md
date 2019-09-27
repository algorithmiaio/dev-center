---
layout: article
title:  "Multithreading"
permalink: algorithm-development/advanced-algorithm-development/multithreading/
excerpt: "Multithreading: call many Algorithms in parallel, from a parent Algorithm or Client"
excerpt-short: "Multithreading: call many Algorithms in parallel"
categories: [algo-dev]
tags: [algo-dev]
show_related: true
author: jon_peck
image:
    teaser: /post_images/multithreading/multithreading.png
---

<img src="{{site.baseurl}}/images/post_images/multithreading/multithreading_wide.png" class="img-fill">

Algorithmia can spin up many copies of your Algorithm in parallel, allowing you to break up a large batch job into many parts and have them all run at once.

To make this happen, use whatever multithreading or multiprocessing library you prefer, and create 2-16 parallel threads, each of which will make separate algo.pipe() calls over the data they need to process. This can be done from local code, or placed into a single "master" Algorithm which manages the others.

Here's a sample Algorithm which takes a single array of inputs, then runs up to four parallel threads at once to call a simple "hello world" Algorithm, reassembling the results into a single output:

<a href="https://algorithmia.com/algorithms/jpeck/multiprocessing_hello/source/" class="btn btn-default btn-primary"><i class="fa fa-code-fork" aria-hidden="true"></i> VIEW CODESAMPLE</a>
