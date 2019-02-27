---
layout: article
title:  "Algorithm Management APIs"
excerpt: "Create, Update, Publish, and Delete Algorithms via the Algorithm Management API"
categories: algorithm-development
tags: [algo-dev]
show_related: false
author: jon_peck
image:
  teaser: /icons/algo.svg
---

Using the Algorithm Management APIs, you can create, publish, update, and inspect individual algorithms.

For the full specification, see the [Algorithm Management API doc](https://documenter.getpostman.com/view/6515899/Rztiuqao) or the "algorithms" section of the official [OpenAPI Spec](https://algorithmia.com/v1/openapispec)

Note that there are two different types of API Keys, used with different endpoints.  All Algorithm Management APIs use Simple API Keys, which can be created under the [credentials tab of your user profile]({{site.url}}/user#credentials).  Ensure that the Key you are using has the option "Allow this key to manage my algorithms" selected:

<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/algorithm-management-api/api-key-manage-my-algorithms.png" alt="Api Keys, Manage My Algorithms" class="screenshot">

{% if site.enterprise %}
#### Enterprise Users Only: Specifying an On-Premises or Private Cloud Endpoint
If you are running [Algorithmia Enterprise](https://algorithmia.com/enterprise), you must specify a different API endpoint when using these APIs. Simply replace "https://api.algorithmia.com" with the base URL of your own installation.
{% endif %}


### Step-by-step: Creating and Publishing an Algorithm via the API

#### 1. Create your Algorithm

First, create your algorithm by POSTing to https://api.algorithmia.com/v1/algorithms/USERNAME, where `USERNAME` is your user account, and `sim******` is an API Key from that account with "Allow this key to manage my algorithm" enabled.

Note that the definition of the new Algorithm is in the payload of the request, and the fields roughly correspond to those you'd see in the [Add Algorithm]({{site.url}}{{site.baseurl}}/algorithm-development/algorithm-basics/your-first-algo/#create-your-first-algorithm) user interface:

```python
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
```

#### 2. Edit and Build your Algorithm

Now that your Algorithm exists, you can edit the source code the Web IDE, or locally via [Git]({{site.cdnurl}}{{site.baseurl}}/algorithm-development/algorithm-basics/git/) (`git clone https://git.algorithmia.com/git/USERNAME/ALGORITHMNAME.git`) or the [CLI]({{site.cdnurl}}{{site.baseurl}}/clients/cli/) (`algo clone USERNAME/ALGORITHMNAME`).

Before attempting to publish, you must either click "Build" in the Web IDE, or `git push` your code (which implicitly triggers a build).

#### 3. Publish your Algorithm

Now you can publish your algorithm via a POST to https://api.algorithmia.com/v1/algorithms/USERNAME/ALGORITHMNAME/versions

While an empty payload dict `{}` will work, you may consider including the payload fields shown below:

```python
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
```

You can also include any "details" or "settings" fields as shown in the "Create your Algorithm" step.
