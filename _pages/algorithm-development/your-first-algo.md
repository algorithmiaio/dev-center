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

One of the great things about Algorithmia is that the platform allows you to put your own work online and make it available to other developers through the API. This guide will show you how with a walk-through of making and publishing a classic "Hello World" algorithm.

This example shows how to create a Python algorithm. However, all the steps shown are the same in all languages. To see specific code examples in the languages we support, check out <a href="{{site.baseurl}}/algorithm-development/languages">Algorithm Development Languages</a>.

Note: this guide uses the web UI to create and deploy your Algorithm. If you prefer a code-only approach to deployment, see the [Algorithm Management API]({{site.baseurl}}/algorithm-development/algorithm-management-api).
{: .notice-info}

Table of Contents

* [Create your First Algorithm](#create-your-first-algorithm)
* [Editing Your Algorithm Locally via GIT and CLI](#editing-your-algorithm-locally-via-git-and-cli)
* [Editing Your Algorithm via the Web IDE](#editing-your-algorithm-via-the-web-ide)
* [Publish Your Algorithm](#publish-your-algorithm)
* [Deleting Algorithms](#delete-your-algorithm)

## Create your First Algorithm

Let's start by creating an algorithm. First navigate to [Algorithmia](/) and click the plus sign in the navbar to open the create menu, where you'll see the "Algorithm" option.

<img src="{{site.baseurl}}/images/post_images/algo_dev_lang/add_algorithm.png" alt="Add algorithm navigation" class="screenshot img-sm">

When you click the "Algorithm" link, you'll see a form for creating your algorithm that we'll fill out step by step below:

<img src="{{site.baseurl}}/images/post_images/algo_dev_lang/create_algorithm_python.png" alt="Create an algorithm in Python" class="screenshot img-sm">

**Algorithmia Account or Organization**
Note: If you don't belong to an organization, skip this step and go to the next.

If you belong to an organization then you'll see this option before Algorithmia Name. Go ahead and select which account or organization you want to create your algorithm under.

**Algorithmia Name:** The first thing you'll notice in the form is the field "Algorithm Name" which will be the name of your algorithm. You'll want to name your algorithm something descriptive based on what the algorithm does.

For example this is the beginning portion of the <a href="{{site.baseurl}}/algorithm-development/languages">Language Guides</a>  which show how to create an algorithm that splits text up into words, which is called tokenizing in natural language processing. So, this example algorithm is called "Tokenize Text", but go ahead and name your algorithm according to what your code does.

**Algorithm ID:** The unique AlgoURL path users will use to call your algorithm.

**Language:** Next you'll pick the language of your choice.

<img src="{{site.baseurl}}/images/post_images/algo_dev_lang/create_algorithm_properties.png" alt="Create an algorithm" class="screenshot img-sm">

**Source Code:** Because we want to make this algorithm open source and available for everyone to view the source code, we'll choose "Open Source".

As an incentive to promote community contributions, open source algorithms that are not charging a royalty on the Algorithmia Platform will earn 1% of the usage cost (0.01cr/sec of execution time).

**Special Permissions:** Next is the "Special Permissions" section that allows your algorithm to have access to the internet and allows it to call other algorithms. In this example we'll want access to the internet and since our final algorithm will call another algorithm we want to select "Can call other algorithms" as well.

Also under Special Permissions, you can enable "CUDA/GPU". Since our algorithm doesn't require a GPU environment, we'll leave this disabled.

You can find out more about algorithm permissions in the [Algorithm Permissions Section]({{site.baseurl}}/basics/permissions).  Also, consider whether your algorithm would benefit from using a Graphics Processing Unit to accelerate certain kinds of computation, such as image processing and deep learning. When "Advanced GPU" is selected, the algorithm will run on servers with GPU hardware, with specific drivers and frameworks to help algorithm developers take advantage of GPU computing. This includes nvidia drivers, CUDA support, and several of the most popular deep learning frameworks, including TensorFlow, Caffe, Theano, and Torch.
{: .notice-info}

Now hit the "Create" button on the bottom lower right of the form and you'll see this modal:

<img src="{{site.baseurl}}/images/post_images/algo_dev_lang/create-algo-cli.png" alt="cli info modal" class="screenshot img-md">

You can now clone your Algorithm (via Git) and install the CLI to edit/test locally, **or** you can close the modal and continue to create your algorithm in the Web IDE.

## Editing your algorithm locally via GIT and CLI

The preferred way to edit and test your Algorithm's code is to install the CLI on your local machine, clone your algorithm's repo via Git, and use your favorite editing tools to modify the code. This gives you the benefits of using a familiar development environment, plus an easy way to test your changes locally before committing changes back to the repo and publishing a new algorithm version.

To learn more about this process, Algorithmia's [CLI]({{site.baseurl}}/clients/cli) and [Git]({{site.baseurl}}/algorithm-development/git) guides. If you're already familiar with the CLI and Git, the basic steps you need to take are:

1. Install the CLI: `curl -sSLf https://algorithmia.com/install.sh | sh` (Windows instructions [here]({{site.baseurl}}/clients/cli/#installing-the-algorithmia-cli) )
2. Clone your algorithm: `algo clone username/algoname`
3. Use your preferred editor to modify the code
4. Test your algorithm: `cd algoname; algo run -D [JSON FILE]`
5. Commit your changes: `git commit -m [commit message]; git push origin master`
6. Publish your changes: you can do so using [the Algo Management API]({{site.baseurl}}/algorithm-development/algorithm-management-api) or via the web IDE:
    1. visit [https://algorithmia.com/user](/user)
    2. click on your algorithm
    3. click "Edit Source"
    4. click "Compile", then "[Publish](#publish-algorithm)"

If you're using Python, you must [set an environment variable](https://www.schrodinger.com/kb/1842): `LANGUAGE_VERSION=python2` or `LANGUAGE_VERSION=python3` before using `runlocal`
{: .notice-info}

## Editing your algorithm via the web IDE

If you prefer to continue creating your algorithm in the Web IDE, simply close the modal and you should see the algorithm description page for your newly created algorithm:

<img src="{{site.baseurl}}/images/post_images/algo_dev_lang/generic_algorithm_description.png" alt="Algorithm descrption page" class="screenshot img-md">

Notice the tabs: **Run**, **Docs**, **Cost**, **Discussion**, **Manage**, and **Source**.

The tab currently showing **Run** is where users can run the algorithm with the default input that you will provide during the publishing step of the algorithm or they can run their own input to test out your algorithm. Also, on this tab, you can add a short summary stating what your algorithm is and why people might be interested in it (for example how it solves a particular problem in a use case).

**Docs** consists of the section that you will want to show how to use your algorithm including complete information about the input types allowed and what the expected outputs will be.

**Cost** will be filled out automatically once you publish your algorithm and will show if you've chosen to charge royalites or if you've decided to open source your algorithm. It will also give the estimated cost so the user consuming your algorithm can see how much it will cost.

The **Discussion** tab shows the comments and questions from users so you can keep up to date regarding user feedback.

Under the **Manage** tab you can see how to clone your algorithm, see what items are checked off in the Algorithm Checklist, delete your algorithm and edit various settings of your algorithm even after you've created it.

Features you can edit are:
* Visibility (Open or closed source)
* Environment (CPU or GPU)
* Properties (Licensing - note that if you choose any license other than the Algorithmia Platform License, you'll need to have the visibility set to “Open Source”).
* Permissions:
	* Managing internet accesibility from your algorithm
	* Calling other algorithms from your algorithm

If you have published your algorithm and want to only make changes to the settings on the "Manage" tab, then you will still need to hit "Build" before republishing to see your new changes. Then you can hit "Publish" after your algorithm builds and go through the normal publishing workflow.
{: .notice-info}

Finally click on the **Source** tab which will display the UI for creating your algorithm if you prefer it over the CLI.

As you can see in your algorithm editor, there is a basic algorithm stub already written that takes a string as input and returns the string "Hello" followed by the user input.

The main thing to note about the algorithm is that it's wrapped in the apply() function.

The apply() function defines the input point of the algorithm. We use the apply() function in order to make different algorithms standardized. This makes them easily chained and helps authors think about designing their algorithms in a way that makes them easy to leverage and predictable for end users.

To run this algorithm first hit the "Build" button on the top right hand corner of the algorithm editor and then at the bottom of the page in the console you'll see a confirmation that it has compiled and the version number of that commit.  Until you have Published your algorithm, the version number will be a hash such as `4be0e18fba270e4aaa7cff20555268903f69a11b` - only you will be able to call this version.  After you've Published an algorithm, it will be given a `major.minor.revision` number as described in the [Versioning Documentation]({{site.baseurl}}/basics/versioning).

Compiling your algorithm will also save your work, but note that the first time you compile your algorithm it might take some time while subsequent compiles will be quicker.
{: .notice-info}

<img src="{{site.baseurl}}/images/post_images/algo_dev_lang/algorithm_console_python.png" alt="Algorithm console Python" class="screenshot">

Once you have finished editing and want to run the algorithm, click the green **Build** button at the top right of the editor. This will save your algorithm by committing your code to your personal git repository and will try to compile your code.

Once your algorithm has successfully complied, you can test it out by passing input though the console at the bottom of the screen. For instance, after compiling this algorithm, you can test the "Hello World" code by typing in "World" in the console:

<img src="{{site.baseurl}}/images/post_images/algo_dev_lang/compile_test_algorithm_python.png" alt="Run basic algorithm in console Python" class="screenshot">

## Publish your Algorithm
Last is publishing your algorithm. The best part of hosting your model on Algorithmia is that users can access it via an API that takes only a few lines of code to use! Here is what you can set when publishing your algorithm:

On the upper right hand side of the algorithm page you'll see a purple button **Publish** which will start the publish flow:

<img src="{{site.baseurl}}/images/post_images/algo_dev_lang/publish_algorithm.png" alt="Publish an algorithm" class="screenshot img-sm">

There are 3 steps to publishing an algorithm: documenting changes, adding example input and output, and configuring algorithm settings.

The **Changes** step shows you your commit history and allows you to add release notes.

The **Example I/O** step is where you'll create your sample input and output for the user to try under Try the API in the Run tab. When you add a sample input, make sure to test it out with all the inputs that you accept since users will be able to test your algorithm with their own inputs.

During the  **Settings** step you can select whether your algorithm will be for public use or private use as well as set the royalty. The algorithm can either be royalty-free or charge per-call. If you opt to have the algorithm charge a royalty, as the author, you will earn 70% of the royalty cost.

Check out [Algorithm Pricing]({{site.baseurl}}/pricing) for more information on how much algorithms will cost to run.

Under "Semantic Version" you can choose which kind of release your change should fall under: Major, Minor, or Revision.

Under "Pending Changes" you'll see any revisions you've made under the "Manage" tab.

If you are satisfied with your algorithm and settings, go ahead and hit publish. Congratulations, you’re an algorithm developer!

### Editing Your Algorithm

Your published algorithm can be edited from the browser, where you can edit the source code, save your work, compile, and submit the algorithm to be available through the API.
You can also <a href="{{site.baseurl}}/algorithm-development/git">use Git to push directly to Algorithmia</a> from your current workflow.

### Calling Other Algorithms

Because any call made from your algorithm is considered the same session as when the user calls your algorithm, you won't need to set an API key within your algorithm code. Instead of setting the API key on the client like you would when consuming an algorithm, you can call another from inside your algorithm and pass the input like so:

{% highlight python %}
if 'url' in input:
  text = Algorithmia.algo('util/Html2Text/0.1.3').pipe(input['url']).result
{% endhighlight %}

This example shows an algorithm that checks the type of input passed in, and if it is a URL, will call into the Html2Text algorithm. The original caller of your algorithm will be charged for both the first algorithm call as well as the internal algorithm call. The algorithm will automatically use the credentials of the person calling your algorithm.

## (Optional) Delete your Algorithm

If your algorithm has never been published, or has only been published for Private use, you have the option to delete it when it is no longer needed. To do so, go to your algorithm's page and click on the **Manage** tab, then find the **Delete** button at the bottom.

<img src="{{site.baseurl}}/images/post_images/algo_dev_lang/delete_algorithm.png" alt="Delete algorithm" class="screenshot img-sm">

If you have ever published your Algorithm with "Public" selected, it cannot be deleted. This is to ensure that others' code will not break if they have written algorithms or client code which depends on your algorithm.

## Wrapping Up

Now that you've published your first simple algorithm on the platform, you can feel empowered to add even more algorithms. You can write them from scratch, adopt and modify open source algorithms, or even chain multiple pre-existing algorithms together to make a micro service you can call with the Algorithmia API! Get inspired by checking out our <a href="{{site.baseurl}}/tutorials/recipes">Recipes</a>.

## Next Steps

After you've finished this tutorial, you'll probably want to check out the <a href="{{site.baseurl}}/algorithm-development/languages">Language Guides</a> for how to write algorithms in the language you prefer, such as R, Python, Rust, Ruby, Java, Scala, or JavaScript.
