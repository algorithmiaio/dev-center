---
layout: article
title:  "Publishing Your First Algorithm"
excerpt: "Getting your algorithm on Algorithmia is easy. Find out how with this tutorial."
categories: algorithm-development
tags: [algo-dev]
show_related: true
author: liz_rush
image:
  teaser: /icons/algo.svg
---

One of the great things about Algorithmia is that the platform allows you to put your own work online and make it available to other developers through the API. This guide will show you how with a walk-through of making and publishing a classic "Hello World" algorithm in Python.

### Using the Algorithmia Editor

When you open the navigation dropdown at the top of the page, you'll find a purple button that says "Add Algorithm". Naturally, this is where we'll start!

<img src="{{ site.baseurl }}/images/post_images/algo_dev_lang/add_algorithm.png" alt="Add algorithm navigation" class="screenshot img-sm">

By clicking this button, you'll be prompted with a dialog that allows you to give your algorithm a name and set some initial properties, such as the name, language, license, and special permissions:

<img src="{{ site.baseurl }}/images/post_images/model_hosting/create_new_alg_python3.png" alt="Create your algorithm" class="screenshot img-sm">

You can learn more about these properties in the [Algorithm Profile]({{ site.baseurl }}/basics/algorithm-profiles/) article.

Now hit the "Create" button on the bottom lower right of the form and you'll see this modal:

<img src="{{ site.baseurl }}/images/post_images/algo_dev_lang/create-algo-cli.png" alt="cli info modal" class="screenshot">

You can now clone your Algorithm (via Git) and install the CLI to edit/test locally, **or** you can close the modal and continue to create your algorithm in the Web IDE.

#### Editing your algorithm locally via GIT & CLI

The preferred way to edit and test your Algorithm's code is to install the CLI on your local machine, clone your algorithm's repo via Git, and use your favorite editing tools to modify the code. This gives you the benefits of using a familiar development environment, plus an easy way to test your changes locally before committing changes back to the repo and publishing a new algorithm version.

To learn more about this process, Algorithmia's [CLI]({{ site.baseurl }}/clients/cli/) and [Git]({{ site.baseurl }}/algorithm-development/git/) guides. If you're already familiar with the CLI and Git, the basic steps you need to take are:

1. Install the CLI: `curl -sSLf https://algorithmia.com/install.sh | sh` (Windows instructions [here](https://algorithmia.com/developers/clients/cli/#installing-the-algorithmia-cli) ) 
2. Clone your algorithm: `algo clone username/algoname`
3. Use your preferred editor to modify the code
4. Test your algorithm: `cd algoname; algo runlocal -D [JSON FILE]`
5. Commit your changes: `git commit -m [commit message]; git push origin master`
6. Publish your changes: for now, you must do this via the web IDE:
    1. visit [https://algorithmia.com/user](https://algorithmia.com/user)
    2. click on your algorithm
    3. click "Edit Source"
    4. click "Compile", then "[Publish](#publish-algorithm)"

#### Editing your algorithm via the web IDE

If you prefer to continue creating your algorithm in the Web IDE, simply close the modal and you should see the algorithm description page for your newly created algorithm:

<img src="{{ site.baseurl }}/images/post_images/algo_dev_lang/generic_algorithm_description.png" alt="Algorithm descrption page" class="screenshot">

Notice the tabs: Run, Docs, Cost, Discussion, Manage, and Source.

The tab currently showing "Run" is where users can run the algorithm with the default input that you will provide during the publishing step of the algorithm or they can run their own input to test out your algorithm. Also, on this tab, you can add a short summary stating what your algorithm is and why people might be interested in it (for example how it solves a particular problem in a use case). 

"Docs" consists of the section that you will want to show how to use your algorithm including complete information about the input types allowed and what the expected outputs will be.

"Cost" will be filled out automatically once you publish your algorithm and will show if you've chosen to charge royalites or if you've decided to open source your algorithm. It will also give the estimated cost so the user consuming your algorithm can see how much it will cost.

The "Discussion" tab shows the comments and questions from users so you can keep up to date regarding user feedback. 

Under the "Manage" tab you can see how to clone your algorithm, see what items are checked off in the Algorithm Checklist and see permissions for your algorithm which were set when you created your algorithm.

Finally click on the "Source" tab which will display the UI for creating your algorithm if you prefer it over the CLI.

Algorithmia creates the skeleton for your algorithm and bring you to the Edit Algorithm page. The editor will have the "Hello world" code already filled out for you, as shown below.

<img src="{{ site.baseurl }}/images/post_images/algo_dev_lang/algorithm_console_python.png" alt="Algorithm console Python" class="screenshot">

As you can see, the algorithm takes in the input and returns the string `"Hello"` plus the input. Feel free to change this code however you like.

Once you have finished editing and want to run the Algorithm, go ahead and click the blue Compile button at the top right of the editor. This will save your algorithm by committing your code to your personal git and try to compile the code. You can even test out your complied algorithm by passing input though the console at the bottom of the screen.

## Publish your Algorithm
Last is publishing your algorithm. The best part of hosting your model on Algorithmia is that users can access it via an API that takes only a few lines of code to use! Here is what you can set when publishing your algorithm:

On the upper right hand side of the algorithm page you'll see a purple button "Publish" which will bring up a modal:

<img src="{{ site.baseurl }}/images/post_images/algo_dev_lang/publish_algorithm.png" alt="Publish an algorithm" class="screenshot img-sm">

In this modal, you'll see a Changes tab, a Sample I/O tab, and one called Versioning.

Changes shows you your commit history and release notes.

Sample I/O is where you'll create your sample input and output for the user to try under Try the API in the Run tab. When you add a sample input, make sure to test it out with all the inputs that you accept since users will be able to test your algorithm with their own inputs.

Under the Versioning tab, you can select whether your algorithm will be for public use or private use as well as set the royalty. The algorithm can either be royalty-free or charge per-call. If you opt to have the algorithm charge a royalty, as the author, you will earn 70% of the royalty cost.

Check out [Algorithm Pricing]({{ site.baseurl }}/pricing/) for more information on how much algorithms will cost to run.

Under Semantic Versioning you can choose which kind of release your change should fall under: Major, Minor, or Revision. 

If you are satisfied with your algorithm and settings, go ahead and hit publish. Congratulations, you’re an algorithm developer!

#### Editing Your Algorithm

Your published algorithm can be edited from the browser, where you can edit the source code, save your work, compile, and submit the algorithm to be available through the API.
You can also <a href="{{ site.baseurl }}/algorithm-development/git/">use Git to push directly to Algorithmia</a> from your current workflow.

#### Calling other algorithms

Because any call made from your algorithm is considered the same session as when the user calls your algorithm, you won't need to set an API key within your algorithm code. Instead of setting the API key on the client like you would when consuming an algorithm, you can call another from inside your algorithm and pass the input like so:

{% highlight python %}
if 'url' in input:
  text = Algorithmia.algo(util/Html2Text/0.1.3').pipe(input['url']).result
{% endhighlight %}

This example shows an algorithm that checks the type of input passed in, and if it is a URL, will call into the Html2Text algorithm. The original caller of your algorithm will be charged for both the first algorithm call as well as the internal algorithm call. The algorithm will automatically use the credentials of the person calling your algorithm.

#### Wrapping Up

Now that you've published your first simple algorithm on the platform, you can feel empowered to add even more algorithms. You can write them from scratch, adopt and modify open source algorithms, or even chain multiple pre-existing algorithms together to make a micro service you can call with the Algorithmia API!

