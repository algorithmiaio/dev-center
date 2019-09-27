---
layout: faq
title:  "Can I use external libraries with my algorithms?"
categories: faqs
tags: [algo-dev-faq]
show_related: true
image:
  teaser: /icons/fa-bolt.png
---

Of course! Dependencies are added to the algorithm through the Dependencies dialog inside the algorithm editor.

In the action bar at the top of the editor, you will see the gray button labeled “Dependencies” in between the Summary button and the Save button:

<img src="{{site.baseurl}}/images/post_images/faqs/faq_dependencies.png" alt="Dependencies Button" class="screenshot img-md">

When you click the Dependencies button, you will see a pop-up dialog that allows you to list any external libraries that you want to import into your algorithm. This allows you to customize your algorithm as you see fit and ensures that every time the algorithm is called, all necessary libraries will be included:

<img src="{{site.baseurl}}/images/post_images/algo_dev_lang/dependencies_python.png" alt="Python Dependency File" class="screenshot img-md">

Use this dialog the same way you would specific the dependencies of any other project of the same language. For example, you would format your dependencies for a Python algorithm in the same manner as you would in a `requirements.txt` file.

You can explore an open source algorithm: [LDA](https://algorithmia.com/algorithms/kenny/LDA/edit) by opening up the Dependencies dialog to see an example of the dependencies specified in Java.

For learning how to add dependencies in the language of your choice check out the [Algorithm Development]({{site.baseurl}}/algorithm-development/languages) section.

### Adding dependencies through Git

If you are writing an algorithm in Python and would like to include a project by cloning over git, add it to your dependencies like you would in a `requirements.txt` file:

{% highlight python %}
git+git://git.myproject.org/MyProject#egg=MyProject
{% endhighlight %}

