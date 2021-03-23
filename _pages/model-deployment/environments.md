---
layout: article
title:  "Algorithm Environments"
excerpt: "Matrix of supported algorithm runtime environments"
categories: model-guides
tags: [algo-model-guide]
show_related: true
permalink: /model-deployment/environments/
redirect_from:
- /model-deployment/matrix/
---

## Overview
Algorithmia supports seven languages for writing algorithms: Python, R, Java, Scala, Ruby, Rust, and JavaScript. When you create an algorithm, you must select one of these languages.

For several of these languages, we've also created predefined, customized algorithm runtime environments to support various ML frameworks and hardware requirements. These environments are available to both our Enterprise and Teams customers.

An algorithm environment is similar to a virtual environment that you might create outside of Algorithmia, where you might choose a specific language version and optionally install specific library packages beyond whatever comes packaged standard in your language's base library.

## Why use a predefined environment?

In an Algorithmia algorithm, you have the ability to specify external library dependencies using whatever syntax is standard for your language (e.g., in a `requirements.txt` file for Python). Therefore, you can technically choose a generic base algorithm environment and then build a more customized ML environment on top of that. For example, you can choose a generic Python 3.7 environment and then require PyTorch as a dependency if you're using that specific framework.

However, we recommend not doing this, and instead choosing the appropriate predefined framework-specific algorithm environment from the matrix below, for the following reasons:

1. Our predefined environments have been optimized for fast algorithm builds at compile time, and for fast algorithm loads when algorithms are called cold. This enhances the performance of algorithms you create using custom environments relative to the approach of using a vanilla base environment and specifying your own dependencies.

2. Many of our predefined environments have built-in CUDA/GPU support and access to ML-optimized hardware such as Nvidia drivers. If your algorithm requires such specialized hardware, it's essential to use the correct predefined runtime environment, so that it's configured correctly from the ground up to support your model.

3. Predefined environments come with template code to make getting started easier.

The algorithm runtime environment you select should match up as closely as possible with your code dependencies, in order to provide the most streamlined development experience and the best algorithm performance. With the base environment selected, you can then add any other required dependencies in whichever way is standard for your language.

The matrix below lists the algorithm environments that are currently available on every Algorithmia installation.

<div class="syn-styles-supported">
  <div class="syn-table-container scrollable-x" markdown="1">

{:.syn-table.condensed}{}
|Environment|Language|Framework|Pinned Dependencies|CUDA/cuDNN|Base Image|
|---|---|---|---|---|---|
|python37|Python 3.7|--|--|--|algorithmiahq/ubuntu:18.04|
|python37-gpu|Python 3.7|--|--|9.0 / 7|nvidia/cuda:9.0-cudnn7-devel-ubuntu16.04|
|pytorch-1.4.x|Python 3.7.1|PyTorch 1.4|numpy==1.16.0|10.1 / 7|nvidia/cuda:10.1-cudnn7-devel-ubuntu16.04|
|pytorch-1.5.x|Python 3.7.1|PyTorch 1.5|numpy==1.16.0|10.2 / 7|nvidia/cuda:10.2-cudnn7-devel-ubuntu18.04|
|pytorch-1.6.x|Python 3.7.1|PyTorch 1.6|numpy==1.16.0|10.2 / 7|nvidia/cuda:10.2-cudnn7-devel-ubuntu18.04|
|spacy-2.0.18|Python 3.7.1|Spacy 2.0.18|--|--|ubuntu:16.04|
|tensorflow-gpu-1.14|Python 3.7|Tensorflow 1.14|keras==2.1.4|10.0 / 7|nvidia/cuda:10.0-cudnn7-devel-ubuntu16.04|
|tensorflow-gpu-2.1|Python 3.7|Tensorflow 2.1|keras==2.3.1|10.1 / 7|nvidia/cuda:10.1-cudnn7-devel-ubuntu16.04|
|tensorflow-gpu-2.3|Python 3.7|Tensorflow 2.3|--|10.1 / 7|nvidia/cuda:10.1-cudnn7-devel-ubuntu18.04|
|selenium3.141.x-python|Python 3.7.1|Selenium 3.141.0|phantomjs==2.1.1, chromedriver==2.41, geckodriver==0.26.0|--|ubuntu:16.04|
|python27|Python 2.7.15|--|--|--|ubuntu:16.04|
|python27-cuda90-cudnn7|Python 2.7.15|--|--|9.0 / 7|nvidia/cuda:9.0-cudnn7-devel-ubuntu16.04|

  </div>
</div>


We’re always adding new optimized runtime environments to support our customers using the latest language and framework versions. Therefore, in addition to those listed above, we also have the following environments available to our Enterprise customers. If there is a specific environment listed below that you'd like to use, or if you need a custom environment that isn't available, please ask your customer success manager so that we can get it built and installed on your cluster.

<div class="syn-styles-supported">
  <div class="syn-table-container scrollable-x" markdown="1">

{:.syn-table.condensed}
|Environment|Language|Framework|Pinned Dependencies|CUDA/cuDNN|Base Image|
|---|---|---|---|---|---|
|allennlp-0.8|Python 3.7|AllenNLP 0.8|spacy==2.0.18, pytorch==1.0.0||ubuntu:16.04|
|apex-0.1|Python 3.7|Apex 0.1|pytorch==1.3|10.1 / 7|nvidia/cuda:10.1-cudnn7-devel-ubuntu16.04|
|mxnet-cu90-1.3.1|Python 3.7|MXNet 1.3.1|--|9.0 / 7|nvidia/cuda:9.0-cudnn7-devel-ubuntu16.04|
|pytorch-1.0.0|Python 3.7|PyTorch 1.0.0|--|9.0 / 7|nvidia/cuda:9.0-cudnn7-devel-ubuntu16.04|
|tensorrt-6.0-cuda10.0|Python 3.7 |TensorRT 6.0.x||10.0 / 7|nvidia/cuda:10.0-cudnn7-devel-ubuntu16.04|
|python36|Python 3.6|--|--|--|algorithmiahq/ubuntu:16.04|
|python36-gpu|Python 3.6|--|--|9.0 / 7|nvidia/cuda:9.0-cudnn7-devel-ubuntu16.04|
|tensorflow-gpu-1.12|Python 3.6|TensorFlow 1.12|keras==2.1.4|9.0 / 7|nvidia/cuda:9.0-cudnn7-devel-ubuntu16.04|
|r36|R 3.6|--|--|--|algorithmiahq/ubuntu:16.04|
|scala-2-sbt-1.3.3|Scala 2.x|--|--|--|algorithmiahq/ubuntu:16.04|
|java11|Java 11.0|--|--|--|algorithmiahq/ubuntu:20.04|
|csharp-dotnet-core2|C# .NET Core 2.x|--|--|--|ubuntu:16.04|

  </div>
</div>
