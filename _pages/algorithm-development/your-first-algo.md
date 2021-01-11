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
One of the great things about Algorithmia is that the platform allows you to make your work available to other developers online through our API. This guide will show you how with a walk-through of creating and publishing a classic "Hello World" algorithm.

This example demonstrates how to create a Python algorithm. However, all of the steps shown are the same in all programming languages supported on the platform. To see specific code examples in the languages we support, check out <a href="{{site.baseurl}}/algorithm-development/languages">Algorithm Development Languages</a>.

Note: this guide uses the web UI to create and deploy your Algorithm. If you prefer a code-only approach to deployment, see [Algorithm Management]({{site.baseurl}}/algorithm-development/algorithm-management).
{: .notice-info}

Table of Contents

* [Create Your First Algorithm](#create-your-first-algorithm)
* [Editing Your Algorithm Locally via Git and CLI](#editing-your-algorithm-locally-via-git-and-cli)
* [Editing Your Algorithm via the Web IDE](#editing-your-algorithm-via-the-web-ide)
* [Working With Data](#working-with-data)
* [Publish Your Algorithm](#publish-your-algorithm)
* [Deleting Algorithms](#delete-your-algorithm)

## Creating Your First Algorithm

Let's start by creating an algorithm. First navigate to [Algorithmia](/) and click the plus sign in the navigation bar to open the "Create New" menu, where you'll see the "Algorithm" option.

<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/algo_dev_lang/add_algorithm.png" alt="Add algorithm navigation" class="screenshot img-sm">

Clicking the "Algorithm" link will navigate you to a form for creating your algorithm, which we'll fill out step-by-step below:

### Algorithm Owner & Name

<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/algo_dev_lang/create_algorithm_algo_details.png" alt="Configure your algorithm's owner and name" class="screenshot img-sm">

**Owner (User or Organization):** (Note: If you don't belong to an organization, skip this step and go to the next.) If you belong to an organization then you'll have the option to set the owner of the algorithm. Go ahead and select which account or organization you want to own this algorithm.

**Algorithm Name:** This is the algorithm's unique identifier, which will be used to call the algorithm via the API. It should be something descriptive based on what the algorithm does. For example, in <a href="https://algorithmia.com/blog/introduction-natural-language-processing-nlp" target="_blank">natural language processing</a>, the process of splitting up text into discreet words is called tokenizing. An algorithm that performs this function could be called "TokenizeText".

### Source Code

This section allows you to customize the visibility, licensing, and hosting of your algorithm's source code.

<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/algo_dev_lang/create_algorithm_source_code_internal.png" alt="Configure your algorithm's repository host" class="screenshot img-sm">

{% if site.enterprise %}
**Repository Host:** Pick where you want to host your algorithm's source code: either within the Algorithmia platform itself, or within a GitHub instance (if your cluster administrator has enabled this feature). For this tutorial we'll choose Algorithmia; you can read more about creating algorithms with GitHub or GitHub Enterprise in our [Source Code Management](/developers/algorithm-development/source-code-management/) docs.
{% else %}
**Repository Host:** Pick where you want to host your algorithm's source code: either within the Algorithmia platform itself, or within GitHub. For this tutorial we'll choose Algorithmia; you can read more about creating algorithms with GitHub or GitHub Enterprise in our [Source Code Management](/developers/algorithm-development/source-code-management/) docs.
{% endif %}

**Source Code Visibility:** We'd like to keep the source code for this algorithm private, so we'll select "Restricted" here.

**License**: In the Settings section, you can select your algorithm's license, and customize its permissions if you need to. We're using the [Algorithmia Platform License](https://algorithmia.com/api_dev_terms).

### Environment

This section allows you to select the specific language environment within which your algorithm will run.

<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/algo_dev_lang/create_algorithm_container.png" alt="Configure your algorithm's container settings" class="screenshot img-sm">

**Language:** Select the language of your choice, including the major version if applicable. Here we'll be using the default of Python 3.

**Environment:** Here you can select the specific pre-built language environment within which your algorithm will run. We will select the generic Python 3.6 environment.

Beyond the language, you should choose the appropriate environment specific to your algorithm's needs, including the machine learning framework you will be using (if any) and whether or not the algorithm requires GPU support. 

Consider whether your algorithm would benefit from using a Graphics Processing Unit (GPU) to accelerate certain kinds of computation, such as image processing and deep learning. Certain algorithm environments come pre-loaded with GPU computing capabilities and machine learning frameworks. This includes Nvidia drivers, CUDA support, and several of the most popular deep learning frameworks, including MXNet, Pytorch, Spacy, and TensorFlow.
{: .notice-info}

### Settings

This section allows you to adjust the specific permissions your algorithm has to access the internet and other algorithms.

<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/algo_dev_lang/create_algorithm_settings.png" alt="Configure your algorithm's settings" class="screenshot img-sm">

**Internet:** In this example we'll want access to the internet, so we'll leave this enabled.

**Pipelining:** This permission sets whether an algorithm can call other Algorithmia-hosted algorithms. Our example will need this enabled.

You can find out more about algorithm permissions in the [Algorithm Permissions Section]({{site.baseurl}}/basics/permissions).
{: .notice-info}

Now hit the "Create" button at the bottom of the form and you'll see the following modal:

<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/algo_dev_lang/create-algo-cli.png" alt="cli info modal" class="screenshot img-md">

You can now clone your Algorithm (via Git) and install the CLI to edit/test locally, **or** you can close the modal and continue your algorithm development in the Web IDE.

## Developing Your Algorithm Locally Via Git and the CLI

The recommended way to edit and test your Algorithm's code is to install the CLI on your local machine, clone your algorithm's repo via Git, and use your favorite editing tools to modify the code. This gives you the benefits of using a familiar development environment, plus an easy way to test your changes locally before committing changes back to the repo and publishing a new algorithm version.

To learn more about this process, see Algorithmia's [CLI]({{site.baseurl}}/clients/cli) and [Git]({{site.baseurl}}/algorithm-development/source-code-management#editing-your-algorithm-source-locally) guides. If you're already familiar with the CLI and Git, the basic steps you need to take are:

1. Install the CLI: `curl -sSLf https://algorithmia.com/install.sh | sh` (Windows instructions [here]({{site.baseurl}}/clients/cli/#installing-the-algorithmia-cli) )
2. Clone your algorithm: `algo clone username/algoname`
3. Use your preferred editor to modify the code
4. Test your algorithm: `cd algoname; algo run -D <JSON FILE>`
5. Commit your changes: `git commit -m <commit message>; git push origin master`
6. Publish your changes: you can do so using [the Algorithmia API]({{site.baseurl}}/algorithm-development/algorithm-management) or via the Web IDE. If using the latter approach, the steps are:
    1. Visit [https://algorithmia.com/user](/user)
    2. Click on your algorithm
    3. Click "Source Code"
    4. Click "Build", then "[Publish](#publish-algorithm)" once the algorithm has built successfully

For more tips and tricks on local development, see the guide to [setting up your local environment for algorithm development]({{site.baseurl}}/algorithm-development/advanced-algorithm-development/local-development).

## Developing Your Algorithm Via the Web IDE

If you prefer to continue developing your algorithm in the Web IDE, simply close the modal and you should see the algorithm description page for your newly created algorithm:

<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/algo_dev_lang/generic_algorithm_description.png" alt="Algorithm descrption page" class="screenshot img-md">

Notice the tabs: **Overview**, **Docs**, **Discussion**, **Builds**, **Versions**, **Settings**, and **Source Code**.

The **Overview** tab displays your algorithm's basic information, statistics, and settings. You can add a short summary stating what your algorithm is and why people might be interested in it (for example how it solves a particular problem for a specific use case). On this tab, users can run your algorithm with the default input that you provide during the algorithm-publishing step (see below in this guide), or test out your algorithm with their own input. Below this on the page is information on how to call your algorithm in multiple programming languages from outside of the Algorithmia platform.

In the **Docs** tab you will want to add information to explain to users how to use your algorithm, including complete information about the input type(s) allowed and what the expected output(s) will be. The embedded README file supports Markdown syntax and should be edited and updated if the usage of the algorithm changes.

The **Discussion** tab displays any comments and questions that users have posted about your algorithm, so that you can keep up to date with user feedback and provide responses as necessary.

Under the **Builds** tab you can view release notes and permissions associated with each published version of the algorithm.

Under the **Versions** tab you can view information about all of the discreet algorithm builds that have occurred, including specific Git hashes and the version number associated with each.

Under the **Settings** tab you can view the configuration options that were selected when you created your algorithm initially. Most settings are configurable after an algorithm has been created, but some, for example the programming language, cannot be changed. 

Settings that you can edit are:
* Source Code Visibility (open or closed source)
* Environment
* Hardware (only applicable for some languages)
* License (Note: if you choose any license other than the Algorithmia Platform License, you'll need to have the visibility set to “Open Source”)
* Permissions:
	* Internet accesibility from your algorithm
	* Calling other algorithms from your algorithm

At the top of this page you can see how to clone your algorithm as well as a list of items you have checked off your Algorithm Checklist. At the bottom of the page is a button to delete your algorithm; this will only be possible if you have not published your algorithm publicly.

If you have published your algorithm and want to only make changes to the algorithm settings on the "Settings" tab, then you will still need to hit "Build" before republishing to see your new changes. After your algorithm builds, you can hit "Publish" and go through the normal publishing workflow.
{: .notice-info}

Finally, click on the **Source Code** tab to navigate to the Web IDE, which is a UI for developing your algorithm if you prefer to work on the Algorithmia platform instead of using the CLI. As you can see in the Web IDE, there is a basic algorithm stub already written that takes a string as input and returns the string "Hello" followed by the user input.

The important thing to note about the algorithm is that it's wrapped in an `apply()` function, which defines the algorithm's input point. This construct serves to standardize algorithms across the platform regardless of programming language. Authors are encouraged to leverage this standardization by designing their algorithms in a way that makes them predictable for end users and that supports algorithm chaining (pipelining).

To run this algorithm, first hit the "Build" button on the top-right corner of the algorithm editor. At the bottom of the page in the console you'll see a confirmation that it has been built (compiled) successfully, along with the commit hash. Until you've published your algorithm, the version number will be a hash such as `4be0e18fba270e4aaa7cff20555268903f69a11b`, and only you will be able to call this version. After you've published an algorithm, it will be given a `major.minor.revision` number as described in the [Versioning Documentation]({{site.baseurl}}/basics/versioning).

Compiling your algorithm will also save your work. Note that the first time you compile your algorithm it might take some time, while subsequent compiles will be quicker.
{: .notice-info}

<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/algo_dev_lang/algorithm_console_python.png" alt="Algorithm console Python" class="screenshot">

Once you have finished editing and want to run the algorithm, click the green **Build** button at the top-right corner of the editor. This will save your algorithm by committing your code to your personal git repository and will try to compile your code.

Once your algorithm has successfully compiled, you can test it out by passing input through the console at the bottom of the screen. For instance, after compiling this algorithm, you can test the "Hello World" code by typing in "World" in the console:

<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/algo_dev_lang/compile_test_algorithm_python.png" alt="Run basic algorithm in console Python" class="screenshot">

## Working With Data
Depending on your data source, you'll either want to use <a href="http://docs.algorithmia.com/#data-api-specification">Algorithmia's Data API</a> to connect to your data within your algorithm, or write a wrapper to connect to your database. 

To learn about the various data sources that Algorithmia supports natively, visit <a href="{{site.baseurl}}/data">Connecting Your Data</a> or check out our reference guide on the available methods using <a href="http://docs.algorithmia.com/#data-api-specification">Algorithmia's Data API</a>.

If you are authoring an algorithm and using the Data API, avoid using the `.my` pseudonym in the source code. When the algorithm is executed, `.my` will be interpreted as the user name of the user who called the algorithm, rather than the author’s user name.
{: .notice-warning}

## Calling Your Algorithm
To call your algorithm during development and testing, you can use the commit hash to call it locally using the language client of your choice. If you are developing within the Algorithmia Web IDE, you can use the built-in console for testing. 

To call a private version of an algorithm you own, you must use a fully specified semantic version or a version hash or you will get an error. For more information see the details in the <a href="https://algorithmia.com/developers/api/#api-specification">API Docs</a>
{: .notice-warning}

## Publishing Your Algorithm
The last step is publishing your algorithm. The best part of hosting your code on Algorithmia is that users can access it via an API that takes only a few lines of code to use! Here is what you can set when publishing your algorithm:

On the upper right-hand side of the algorithm page you'll see a purple **Publish** button, which will start the publish flow:

<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/algo_dev_lang/publish_algorithm.png" alt="Publish an algorithm" class="screenshot img-sm">

There are 3 steps to publishing an algorithm: documenting changes, adding example input and output, and configuring algorithm settings.

The **Changes** step shows you your commit history and allows you to add release notes.

The **Example Input/Output** step is where you'll enter your sample input, which will be displayed in the Overview tab on the algorithm home page, where users may test your algorithm. This is a good time to test your algorithm with all of the types of inputs that your algorithm accepts, to verify that the output is as expected, because users will be able to test your algorithm with their own inputs.

During the **Configure Settings** step you can select whether your algorithm will be publicly callable or for private use only. Under "Semantic Version" you can choose which kind of release characterizes your changes: Major, Minor, or Revision. Finally, you can enable the collection of metrics using Algorithmia Insights by checking the "Insights" box.

If you are satisfied with your algorithm code, behavior, and settings, go ahead and hit "Publish". Congratulations, you’re an algorithm developer!

### Editing Your Algorithm

Your published algorithm can be edited from the browser, where you can modify the source code, save your work, compile, and publish the algorithm to be available through the API. You can also <a href="{{site.baseurl}}/algorithm-development/source-code-management#editing-your-algorithm-source-locally">use Git to push directly to Algorithmia</a> from your current workflow.

### Calling Other Algorithms

When an algorithm is called from within another algorithm, the algorithm called internally is considered to have been made from within the same session as the first algorithm call. Because of this, you won't need to set an API key within your algorithm code. For example, instead of setting the API key on the client like you would when consuming an algorithm, you can call an algorithm internally and pass the input like so:

{% highlight python %}
if 'url' in input:
  text = Algorithmia.algo('util/Html2Text/0.1.3').pipe(input['url']).result
{% endhighlight %}

This example shows an algorithm that checks the type of input passed in, and if it is a URL, calls the Html2Text algorithm to pull down code from the webpage. Compute associated with both the original algorithm call and the internal algorithm call is tracked and attributed to the original caller's account.

## (Optional) Deleting your Algorithm

If your algorithm has never been published, or has only been published for private use, you have the option to delete it when it is no longer needed. To do so, go to your algorithm's page, click on the **Settings** tab, and find the red **Delete** button at the bottom.

<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/algo_dev_lang/delete_algorithm.png" alt="Delete algorithm" class="screenshot img-sm">

If you have ever published your Algorithm with "Public" selected, it cannot be deleted. This is to ensure that others' code will not break if they have written algorithms or client code that depends on your algorithm.

## Wrapping Up

Now that you've published your first simple algorithm on the platform, you are empowered to develop more complex and useful algorithms. You can write them from scratch, adopt and modify open-source algorithms, or even chain multiple pre-existing algorithms together to make a micro service that you can call with the Algorithmia API! Get inspired by checking out our <a href="{{site.baseurl}}/tutorials/recipes">Recipes</a>.

## Next Steps

After you've finished this tutorial, you'll probably want to check out the <a href="{{site.baseurl}}/algorithm-development/languages">Language Guides</a> for how to write algorithms in the language you prefer, such as R, Python, Rust, Ruby, Java, Scala, or JavaScript.
