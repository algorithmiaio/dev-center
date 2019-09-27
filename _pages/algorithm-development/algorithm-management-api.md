---
layout: article
title:  "Management APIs"
excerpt: "Create, Update, Publish, and Delete Algorithms via the Algorithm Management API"
categories: algorithm-development
tags: [algo-dev]
show_related: false
author: jon_peck
image:
  teaser: /icons/algo.svg
---

Using the Algorithm Management APIs, you can create, publish, update, and inspect individual algorithms. Among other things, this allows you to train and deploy your models on Algorithmia completely within your preferred development environment -- without ever interacting with Algorithmia's web-based UI.

For the full specification, see the [Python API for Algorithm Management](https://docs.algorithmia.com/?python#algorithm-management-api). For languages other than Python, an OpenAPI Specification is available via the [unofficial openapi docs](https://documenter.getpostman.com/view/6515899/S1a1aoR6?#17e2a113-e38d-4bb9-b33b-17b24285d2d0) or a [raw openapi spec (under /algorithms)](/v1/openapispec).

Note that there are two different types of API Keys, used with different endpoints.  All Algorithm Management APIs use Simple API Keys, which can be created under the [credentials tab of your user profile]({{site.url}}/user#credentials).  Ensure that the Key you are using has the option "Allow this key to manage my algorithms" selected:

<img src="{{site.baseurl}}/images/post_images/algorithm-management-api/api-key-manage-my-algorithms.png" alt="Api Keys, Manage My Algorithms" class="screenshot">

### Forward: Python Notebook or CI/CD (via Jenkins or GitHub Actions) for Publishing Algorithms

The step-by-step guide below will familiarize you with the Python and OpenAPI spec for creating Algorithms. However, a complete end-to-end Jupyter Notebook (and Google Colab Notebook) is also available. To see a working end-to-end example of training a Model, then *immediately* deploying it as an Algorithm within the same Notebook, see the [GitHub repo with working Model Deployment Notebooks](https://github.com/algorithmiaio/model-deployment)

In addition, customers using Jenkins or GitHub Actions for their CI/CD should review our [CI/CD Examples for Deploying Algorithms]({{site.baseurl}}/algorithm-development/ci-cd).

For those using another CI/CD tool, or who simply wish to deploy from a simple pure-Python script, the Python scripts used in the GitHub Actions workflow can be used in any Python-capable environment; they are not specific to GitHub Actions. Read through the [documentation](https://github.com/algorithmiaio/model-deployment/tree/master/githubactions_deploy_algorithmia#redeploying-retrained-models) to understand their use, then copy and modify the model_*.py files from that repo and modify them to point to your own Algorithm.

### Step-by-step: Creating and Publishing an Algorithm via the API, using the official Python Client (recommended)

{% if site.enterprise %}
#### Enterprise Users Only: Specifying an On-Premises or Private Cloud Endpoint
If you are running [Algorithmia Enterprise](/enterprise), remember to specify your API endpoint when creating the Python Client:

{% highlight python %}
client = Algorithmia.client('MANAGEMENT_API_KEY', 'https://mylocalendpoint')
{% endhighlight %}

{% endif %}

#### 1. Create your Algorithm

First, set up an Algorithmia client using an API Key from your account, which **must** have "Allow this key to manage my algorithm" enabled.

Then, create your Algorithm by creating a `client.algo('username/algoname)` with the name you wish it to have: 'username' here might be your own username, or thge name of an Organization to which you belong, and 'algoname' can be any Algorithm name which doesn't already exist in that userspace.

Next, we call the `.create()` method of that new Algorithm. The fields roughly correspond to those you'd see in the [Add Algorithm]({{site.url}}{{site.baseurl}}/algorithm-development/algorithm-basics/your-first-algo/#create-your-first-algorithm) user interface, butr are fully described in the [API Docs](https://docs.algorithmia.com/?python#create-an-algorithm).

{% highlight python %}
import Algorithmia
client=Algorithmia.client('MANAGEMENT_API_KEY')
algo = client.algo('demo/Hello')
algo.create(
    details = {
        "label": "Hello World",
    },
    settings = {
        "language": "python3-1",
        "source_visibility": "closed",
        "license": "apl",
        "network_access": "full",
        "pipeline_enabled": True,
        "environment": "cpu"
    }
)
{% endhighlight %}

#### 2. Edit and Build your Algorithm

Now that your Algorithm exists, you can edit the source code the Web IDE, or locally via [Git]({{site.baseurl}}/algorithm-development/algorithm-basics/git) (`git clone https://git.algorithmia.com/git/USERNAME/ALGORITHMNAME.git`) or the [CLI]({{site.baseurl}}/clients/cli) (`algo clone USERNAME/ALGORITHMNAME`).

Before attempting to publish, you must either click "Build" in the Web IDE, or `git push` your code (which implicitly triggers a build).

#### 3. Publish your Algorithm

Now you can publish your algorithm via a call to `algo.publish`

While an empty dict `{}` will work as the `version_info` parameter, you may also include any of the fields included in the [API Spec](https://docs.algorithmia.com/?python#publish-an-algorithm):

{% highlight python %}
algo.publish(
    version_info = {
        "sample_input": "world"
    }
)
{% endhighlight %}

#### 4. Getting info about your Algorithm

Your Algorithm is now published and runnable. If you wish, you make also take advantage of several other management functions:

* [Update an existing Algorithm](https://docs.algorithmia.com/?python#optional-update-an-algorithm)
* [Force a recompile of your Algorithm](https://docs.algorithmia.com/?python#optional-recompile-your-algorithm)
* [Get info, such as last published version number](https://docs.algorithmia.com/?python#get-info-about-an-an-algorithm)
* [List all versions of your Algorithm & corresponding info](https://docs.algorithmia.com/?python#list-versions-of-an-algorithm)


### ALTERNATIVE: Creating and Publishing an Algorithm via the API, using the OpenAPI Specification

{% if site.enterprise %}
#### Enterprise Users Only: Specifying an On-Premises or Private Cloud Endpoint
If you are running [Algorithmia Enterprise](/enterprise), you must specify a different API endpoint when using these APIs. Simply replace "https://api.algorithmia.com" with the base URL of your own installation.
{% endif %}

#### 1. Create your Algorithm

First, create your algorithm by POSTing to https://api.algorithmia.com/v1/algorithms/USERNAME, where `USERNAME` is your user account, and `sim******` is an API Key from that account with "Allow this key to manage my algorithm" enabled.

Note that the definition of the new Algorithm is in the payload of the request, and the fields roughly correspond to those you'd see in the [Add Algorithm]({{site.url}}{{site.baseurl}}/algorithm-development/algorithm-basics/your-first-algo/#create-your-first-algorithm) user interface:

{% highlight python %}
import requests
url = 'https://api.algorithmia.com/v1/algorithms/USERNAME'
headers = {
  'Authorization': 'sim********',
  'Content-Type': 'application/json'
}
payload = {
    "details": {
        "label": "<string>", #user-readable name of the algorithm
        "summary": "<string>", #markdown describing the Algorithm, for the "docs" tab
        "tagline": "<string>" #one-liner summarizing the Algorithm's purpose
    },
    "name": "<string>", #the short algorithm name (no spaces or special characters)
    "settings": {
        "license": "<string>", #apl, apache2, gpl3, mit
        "network_access": "<string>", #isolated, full
        "pipeline_enabled": <boolean>, #can this algo call other algos?
        "source_visibility": "<string>", #open, closed
        "language": "<string>", #java, javascript, python2-langpack, python3-1, r, ruby, rust, scala
        "environment": "<string>", #cpu, gpu
        "royalty_microcredits": <integer> #0 for none
    },
    "version_info": {
        "sample_input": "<string>" #example input visible to end-user
    }
}
response = requests.request('POST', url, headers = headers, json = payload)
print(response.text)
{% endhighlight %}

#### 2. Edit and Build your Algorithm

Now that your Algorithm exists, you can edit the source code the Web IDE, or locally via [Git]({{site.baseurl}}/algorithm-development/algorithm-basics/git) (`git clone https://git.algorithmia.com/git/USERNAME/ALGORITHMNAME.git`) or the [CLI]({{site.baseurl}}/clients/cli) (`algo clone USERNAME/ALGORITHMNAME`).

Before attempting to publish, you must either click "Build" in the Web IDE, or `git push` your code (which implicitly triggers a build).

#### 3. Publish your Algorithm

Now you can publish your algorithm via a POST to https://api.algorithmia.com/v1/algorithms/USERNAME/ALGORITHMNAME/versions

While an empty payload dict `{}` will work, you may consider including the payload fields shown below:

{% highlight python %}
import requests
url = 'https://api.algorithmia.com/v1/algorithms/USERNAME/ALGORITHMNAME/versions'
headers = {
  'Authorization': 'sim********',
  'Content-Type': 'application/json'
}
payload = {
    "settings": {
        "algorithm_callability": "<string>" #public, private
    }
    "version_info": {
        "type": "<string>", #default, major, minor, revision
        "semantic_version": "<string>", #if blank, a minor version increment will be used
        "git_hash": "<string>", #if blank, the latest git hash will be used
        "release_notes": "<string>",
        "sample_input": "<string>",
        "sample_output": "<string>"
    }
}
response = requests.request('POST', url, headers = headers, json = payload)
print(response.text)
{% endhighlight %}

You can also include any "details" or "settings" fields as shown in the "Create your Algorithm" step.
