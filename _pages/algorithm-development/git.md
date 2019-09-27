---
layout: article
title:  "Git Versioning"
excerpt: "Learn how to use Git with Algorithmia and integrate with your current workflow."
categories: algorithm-development
tags: [algo-dev]
show_related: true
image:
    teaser: /icons/algo.svg
permalink: /algorithm-development/git/
redirect_from:
  - /algorithm-development/algorithm-basics/git/
  - /algorithm-development/git-support/
---

Every algorithm on Algorithmia has a dedicated git repository. Using this repository allows you to seamlessly integrate Algorithmia with your current workflows,
such as your code editor, IDE, or deployment pipelines. If you're unfamiliar with git we recommend <a rel="nofollow" target="_blank" href="http://rogerdudler.github.io/git-guide/">this brief guide</a>.

<img src="{{site.baseurl}}/images/post_images/legit/legit-demo.gif" alt="Demo for Git" class="screenshot">

## Accessing a repository

You can clone existing algorithms from the following endpoint:
{% highlight bash %}
    git clone https://git.algorithmia.com/git/:username/:algoname.git
{% endhighlight %}

Replace the `:username` and `:algoname` parts with the correct values, case sensitive. If you are part of an organization,
replace `:username` with the name of your org.

## Committing changes to an algorithm

First pull from origin to make sure you have the latest changes to the master branch.
{% highlight bash %}
git pull origin master
{% endhighlight %}

Then add your changes as usual.
{% highlight bash %}
git -A your_file_to_commit
git commit -m "Message about commit changes"
{% endhighlight %}

Once ready, push to Algorithmia.
{% highlight bash %}
git push origin master
{% endhighlight %}

Everything will behave as a normal git repository, with the additional post-commit hook that will compile your master branch, create a private REST API
endpoint, and print out that API endpoint to your console.

The output of git push will print a last line that looks something like this:

{% highlight bash %}
Remote: build successful for algo://:username/:algoname/:hash
{% endhighlight %}

This endpoint is private to you only (and your organization if you are part of one), and behaves just like a public/published algorithm except
for the fact that it is not listed in the marketplace and will only accept calls from your API keys. This is a great way to run regression
tests against an algorithm before making it available to others.

## Testing your changes

With the private REST API endpoint in hand, you can run your unit tests against it or manually test that algorithm from the command
line using the <a href="https://github.com/algorithmiaio/algorithmia-cli">Algorithmia CLI</a>. Testing using the CLI will be
something similar to:
{% highlight bash %}
algo run :username/:algoname/:hash -d "<JSON_INPUT>"
{% endhighlight %}

See the <a href="https://github.com/algorithmiaio/algorithmia-cli">Algorithmia CLI</a> for more options.

## Managing branches

Branches are allowed and will be accepted in pushes, however Algorithmia will not compile branches other than master.

Algorithmia will only compile the head of the master branch on each push. It will not compile intermediate commits
if they are all pushed together as a batch. Finally, Algorithmia will reject any push which contains non-fast-forward commits.
This is to prevent changing the history of an algorithm, and potentially breaking Algorithmia's versioning.

## Initializing a repository

As of today, you will need to manually create an algorithm from the web interface in order to initialize a repository. Once a
repository is initialized you can clone it as shown above. The web interface is currently necessary in order to specify name
and permissions for an algorithm.
