---
layout: article
title:  "Getting Started"
excerpt: "Getting your algorithm on Algorithmia is easy. Find out how with this tutorial."
categories: algorithm-development
tags: [algo-dev]
nav_index: 0
show_related: true
image:
  teaser: /icons/algo.svg
permalink: /algorithm-development/your-first-algo/
redirect_from:
  - /algorithm-development/algorithm-basics/your-first-algo/
  - /basics/your_first_algo/
---
In this quick-start guide, we'll walk through the process of developing a classic "Hello World" algorithm on Algorithmia. For a more detailed tutorial on algorithm development, see our [Training Center](https://training.algorithmia.com/path/enterprise-20-2-data-scientist/enterprise-20-2-developing-python-algorithms-in-the-web-ide).

In this guide, we'll develop an algorithm in Python, but all of the steps shown here are the same in all programming languages supported on the platform. To see specific code examples in the languages we support, check out <a href="{{site.baseurl}}/algorithm-development/languages">Algorithm Development Languages</a>.

Note: this guide uses Algorithmia's browser UI to create and deploy your Algorithm. If you prefer a code-only approach to development, see [Algorithm Management]({{site.baseurl}}/algorithm-development/algorithm-management).
{: .notice-info}

Table of Contents

* [Creating Your First Algorithm](#creating-your-first-algorithm)
* [Developing Your Algorithm in the Web IDE](#developing-your-algorithm-in-the-web-ide)
* [Calling Your Algorithm](#calling-your-algorithm)
* [Publishing Your Algorithm](#publishing-your-algorithm)
* [Next Steps](#next-steps)

## Creating Your First Algorithm

To get started, navigate to [Algorithmia](/), click the "Create New" button in the upper-right corner, and select the "Algorithm" option. This will navigate you to a modal, which you'll fill out step-by-step below.

<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/algo_dev_lang/add_algorithm.png" alt="Add algorithm navigation" class="screenshot img-sm">

### Algorithm Owner & Name

Select your account name as the algorithm owner, and provide a descriptive name for your algorithm. For example, in <a href="https://algorithmia.com/blog/introduction-natural-language-processing-nlp" target="_blank">natural language processing</a>, the process of splitting up text into discreet words is called tokenizing, so an algorithm that performs this function could be called "TokenizeText". Your algorithm's name will serve as its unique identifier on the platform, and it will be used to call your algorithm via the API.

<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/algo_dev_lang/create_algorithm_algo_details.png" alt="Configure your algorithm's owner and name" class="screenshot img-sm">

### Source Code

In this section, you can customize the visibility, licensing, and hosting of your algorithm's source code. For your algorithm, just leave the defaults so that the source code is hosted privately on our platform under the [Algorithmia Platform License](https://algorithmia.com/api_dev_terms). You can read more about creating algorithms with GitHub or GitHub Enterprise in our [Source Code Management](/developers/algorithm-development/source-code-management/) docs.

<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/algo_dev_lang/create_algorithm_source_code_internal.png" alt="Configure your algorithm's repository host" class="screenshot img-sm">

### Environment

In this section, you can specify your algorithm's runtime environment. For your algorithm, go ahead and select Python 3.x for the language and Python 3.7 for the environment, because your example algorithm won't require any external library dependencies.

<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/algo_dev_lang/create_algorithm_runtime_env.png" alt="Configure your algorithm's runtime settings" class="screenshot img-sm">

When you develop an algorithm on our platform, you'll need to consider what machine learning framework(s) it'll need and whether it would benefit from using a graphics processing unit (GPU) to accelerate certain kinds of computation, such as image processing and deep learning. Certain algorithm environments come pre-loaded with GPU computing capabilities and specific machine learning frameworks. This includes Nvidia drivers, CUDA support, and several of the most popular deep learning frameworks, including MXNet, Pytorch, Spacy, and TensorFlow.
{: .notice-info}

### Settings

In this section you can adjust your algorithm's access [permissions]({{site.baseurl}}/basics/permissions). Leave the defaults so that your algorithm can access the public internet as well as call other algorithms on the platform.

<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/algo_dev_lang/create_algorithm_settings.png" alt="Configure your algorithm's settings" class="screenshot img-sm">

Click the "Create New Algorithm" button at the bottom of the form and you'll see the following modal.

<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/algo_dev_lang/create-algo-cli.png" alt="cli info modal" class="screenshot img-md">

## Developing Your Algorithm In the Web IDE

To access Algorithmia's built-in Web IDE, click the "Web IDE" button in the modal, or click the **Source Code** tab from your newly created algorithm's homepage if the modal is no longer shown.

<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/algo_dev_lang/generic_algorithm_description.png" alt="Algorithm descrption page" class="screenshot img-md">

In the Web IDE, you'll see that your algorithm comes with some template code: a function called `apply()` that takes a string as input and returns "Hello" concatenated with that string.

On Algorithmia, every algorithm is required to have an `apply()` function—it defines the algorithm's entry point and serves to standardize algorithms across the platform regardless of programming language. Authors are encouraged to leverage this standardization and to design their algorithms in a way that makes them predictable for end users and that supports algorithm pipelining (chaining multiple algorithms together).

In order to run the algorithm, you'll first need to compile (build) it by clicking the "Build" button on the top-right corner of the source code editor. You'll need to complete this step even for an interpreted language such as Python, because we still need to package up all the source code into a callable algorithm instance on the back end.

At the bottom of the page in the test console you'll see a confirmation when your algorithm's been built successfully, along with the version hash. Once the build completes, you can test out your algorithm by passing it input through the test console. For example, try running the algorithm with the input "World" (make sure to include the double quotes, because algorithm input must be valid JSON).

<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/algo_dev_lang/algorithm_console_python.png" alt="Algorithm console Python" class="screenshot">

Note that the first time you run your algorithm it might take some time to return a value; subsequent runs will return much more quickly.
{: .notice-info}

If you'd like, you can edit the source code, for example by changing it to return an "Hola" instead of a "Hello". Every time you want to re-test the algorithm, you'll need to click the green **Build** button and wait for the build confirmation message.

<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/algo_dev_lang/compile_test_algorithm_python.png" alt="Run basic algorithm in console Python" class="screenshot">

## Publishing Your Algorithm

The best part of developing on Algorithmia is that you and other users can call your algorithms via an API that takes only a few lines of code to use! To enable this, you must first start the publishing flow by clicking the purple **Publish** button at the upper-right corner of the source code editor.

<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/algo_dev_lang/publish_algorithm.png" alt="Publish an algorithm" class="screenshot img-sm">

There are 3 steps to publishing an algorithm: documenting changes, adding example input and output, and configuring algorithm settings.

The **Changes** step shows you your commit history and allows you to add release notes. Go ahead and enter some example release notes like "Initial Hello World release".

The **Example Input/Output** step is where you'll enter sample input to be displayed on the algorithm's home page, where other users will be able to test out your algorithm. Go ahead and enter your name in double quotes, or another short text string, and run the algorithm to ensure that it behaves as expected.

In the **Configure Settings** step you can select whether your algorithm will be publicly callable or for private use only. Under "Semantic Version" you can choose which kind of release characterizes your changes: Major, Minor, or Revision. Finally, you can enable the collection of metrics using Algorithmia Insights by checking the "Insights" box. For your simple algorithm here, you can leave the default options selected.

If you're satisfied with your algorithm code, behavior, and settings, go ahead and hit "Publish". Congratulations, you’re an algorithm developer!

## Next Steps

Now that you've published your first simple algorithm on the platform, you're empowered to start developing much more complex and useful algorithms. You can write them from scratch, adopt and modify open-source algorithms, and even pipeline multiple algorithms together. Once published, your algorithms will become versioned API endpoints that you can consume from external applications with just a few lines of code!

## Next Steps

### Language Guides

Now that you have the basics, one potential next step would be to check out the <a href="{{site.baseurl}}/algorithm-development/languages">Language Guides</a> to learn how to write algorithms in whichever language you prefer; we support R, Python, Rust, Ruby, Java, Scala, and JavaScript.

### Connecting to Data

As you saw in this guide, you can create simple algorithms that don't read or write any data to disk. However, most algorithms you develop will need to be able to interact with some sort of data source.

As an integration-first platform, we encourage you to connect to whatever data source(s) you're already using. We also enable you to host data directly on our platform for lower-latency access, and we even have several native integrationss with cloud-hosted data platforms.

See our <a href="http://docs.algorithmia.com/#data">Data API</a> docs and our <a href="{{site.baseurl}}/data">Developer Center</a> docs to get started connecting to data sources. For a deeper dive tutorial, you can also check out our [Training Center](https://training.algorithmia.com/path/enterprise-20-2-data-scientist/enterprise-20-2-using-data-sources).
