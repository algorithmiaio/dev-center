---
categories: algorithm-development
excerpt: "Matrix of supported algorithm runtime environments"
layout: article
permalink: /algorithm-development/environments/
redirect_from:
- /model-deployment/matrix/
- /model-deployment/environments/
- /environments/
show_related: true
tags: [algo-model-guide]
title:  "Algorithm Environments"
---

**NOTE:** The list of currently available environments, previously hosted on this page, can now be found on our [Training Center](https://training.algorithmia.com/developing-python-algorithms-in-a-local-ide/906833).
{: .notice-info}

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

For a list of the algorithm environments that are currently available, see the [Currently available environments](https://training.algorithmia.com/developing-python-algorithms-in-a-local-ide/906833). To create an algorithm with a predefined environment through the API, see [Using a predefined language environment](https://training.algorithmia.com/developing-python-algorithms-in-a-local-ide/698050#predefined-environment).
