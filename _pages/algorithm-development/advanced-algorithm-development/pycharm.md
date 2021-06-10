---
author: kenny_daniel
categories: [algo-dev]
excerpt: "Developing your code locally using PyCharm as your IDE. Execute and test your algorithm."
image:
    teaser: /post_images/local_development/local_development.png
layout: article
permalink: /algorithm-development/advanced-algorithm-development/pycharm/
show_related: true
tags: [algo-dev]
title: "Setting up PyCharm for local algorithm development"
---

# Algorithmia and PyCharm

PyCharm is a Python-focused IDE from JetBrains, and is a great tool for local development of Python algorithms. To use PyCharm effectively with Algorithmia, here are the recommended configuration steps:

1. Create a Python algorithm on Algorithmia.
2. Install PyCharm.
3. From the “Open project” dialog (for Linux install) or “Check out from version control” (for Mac install), select git clone (or open already cloned project).
    a. Note: if you haven’t yet authenticated for your SCM (such as GitHub) within PyCharm, you’ll be prompted to pass in your credentials.

## Gitignore

PyCharm will prompt “Externally added files can be added to git”. This message is because PyCharm generates project files that are not checked into git. It is recommended to add “.idea” to a `.gitignore` file.


## Python interpreter

<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/advanced_algorithm_development/pycharm_use_interpreter.png" alt="PyCharm - No Python interpreter configured for the project" class="img-fill">

Configure the “python interpreter” if not already configured.

Add a Python interpreter if needed. Virtualenv environments are a good way to manage dependencies. We recommend that you emulate the algorithm environment on Algorithmia as closely as possible to help you debug your algorithm locally. 

<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/advanced_algorithm_development/pycharm_add_python_interpreter.png" alt="PyCharm - Add Python Interpreter dialog" class="img-fill">

Install package requirements (open requirements.txt file if this does not prompt automatically)

<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/advanced_algorithm_development/pycharm_package_reqs.png" alt="PyCharm - Package requirement not satisfied" class="img-fill">

## Run tests locally

By default PyCharm does not know how to run the project locally. To do so, click “Add Configuration…”. Then click the “+” button to create a new configuration and select Python tests > pytest. 

You might have to run `pip install pytest` in the virtual env you created.

You should now be able to run unit tests locally using the “Run” button.

## Run algorithm locally

When running an algorithm inside Algorithmia, your apply() function is the main entry point of your algorithm. The Algorithmia platform binds the input/output of your apply function to a REST API. To run locally you need to define a local entry point such as:

```python
if __name__ == '__main__':
    print(apply("Ava"))
```

By default PyCharm does not know how to run the project locally. To do so, click “Add Configuration…”. Then click the “+” button to create a new configuration and select “Python”. Configure the “python interpreter” if needed.

You need to specify a “Script path” for the main entry point of your algorithm to be the one you just defined.

<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/advanced_algorithm_development/pycharm_add_config.png" alt="PyCharm - Add run/debug configurations" class="img-fill">

You should now be able to run your algorithm locally using the “Run” button.

<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/advanced_algorithm_development/pycharm_run.png" alt="PyCharm - Run algorithm successful" class="img-fill">
