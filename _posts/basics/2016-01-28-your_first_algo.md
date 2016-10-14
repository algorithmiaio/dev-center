---
layout: article
title:  "Publishing Your First Algorithm"
excerpt: "Getting your algorithm on Algorithmia is easy. Find out how with this tutorial."
date:   2016-01-28 03:19:38
categories: basics 
tags: [algo-dev]
show_related: true
author: liz_rush
image:
  teaser: /icons/fa-bolt.png
---

One of the great things about Algorithmia is that the platform allows you to put your own work online and make it available to other developers through the API. This guide will show you how with a walk-through of making and publishing a classic "Hello World" algorithm in Python.

### Using the Algorithmia Editor

When you open the navigation dropdown at the top of the page, you'll find a purple button that says "Add Algorithm". Naturally, this is where we'll start! 

![Add Algorithm button](/images/post_images/your_first_algo/add_algorithm.png)

By clicking this button, you'll be prompted with a dialog that allows you to give your algorithm a name and set some initial properties, such as the name, language, license, and special permissions:

<br>
<img src="/images/post_images/model_hosting/create_new_alg_python3.png" alt="Create your algorithm" class="screenshot">

You can learn more about these properties in the [Algorithm Basics](http://developers.algorithmia.com/basics/algorithm_basics/) article.

Algorithmia will now create the skeleton for your algorithm and bring you to the Edit Algorithm page. The editor will have the "Hello world" code already filled out for you, as shown below.

![New Algorithm editor](/images/post_images/your_first_algo/algo_editor.png)

As you can see, the algorithm takes in the input and returns the string `"Hello"` plus the input. Feel free to change this code however you like.

Once you have finished editing and want to run the Algorithm, go ahead and click the blue Compile button at the top right of the editor. This will save your algorithm by committing your code to your personal git and try to compile the code. You can even test out your complied algorithm by passing input though the console at the bottom of the screen. 

After a successful compilation, click the purple "Publish" button. Select "Publish a new revision" for your algorithm. You'll then see the following dialog:

![Publish Algorithm dialog](/images/post_images/your_first_algo/publish_dialog.png)

In this dialog, you can select whether your algorithm will be for public use or private use as well as the royalty. The algorithm can either be royalty-free or charge per-call. If you opt to have the algorithm charge a royalty, as the author, you will earn 70% of the royalty cost.

If you are satisfied with your algorithm and settings, go ahead and hit publish. Congratulations, you're an algorithm developer! :tada:

#### Editing Your Algorithm

Your published algorithm can be edited from the browser, where you can edit the source code, save your work, compile, and submit the algorithm to be available through the API.
You can also <a href="/algorithm-development/git-support/">use Git to push directly to Algorithmia</a> from your current workflow.

#### Calling other algorithms

Because any call made from your algorithm is considered the same session as when the user calls your algorithm, you won't need to set an API key within your algorithm code. Instead of setting the API key on the client like you would when consuming an algorithm, you can call another from inside your algorithm and pass the input like so:

{% highlight python %}
if 'url' in input:      
  text = Algorithmia.algo(util/Html2Text/0.1.3').pipe(input['url']).result
{% endhighlight %}

This example shows an algorithm that checks the type of input passed in, and if it is a URL, will call into the Html2Text algorithm. The original caller of your algorithm will be charged for both the first algorithm call as well as the internal algorithm call. The algorithm will automatically use the credentials of the person calling your algorithm.

#### Wrapping Up

Now that you've published your first simple algorithm on the platform, you can feel empowered to add even more algorithms. You can write them from scratch, adopt and modify open source algorithms, or even chain multiple pre-existing algorithms together to make a micro service you can call with the Algorithmia API! 

