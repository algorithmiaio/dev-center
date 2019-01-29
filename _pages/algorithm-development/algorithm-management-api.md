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

<img src="{{ site.cdnurl }}{{ site.baseurl }}/images/post_images/algorithm-management-api/api-key-manage-my-algorithms.png" alt="Api Keys, Manage My Algorithms" class="screenshot">

{% if site.enterprise %}
#### Enterprise Users Only: Specifying an On-Premises Endpoint
If you are running the [Algorithmia platform on-premises with Algorithmia Enterprise](https://algorithmia.com/enterprise), you must specify a different API endpoint when using these APIs. Simply replace "https://api.algorithmia.com" with the base URL of your own installation.
{% endif %}


#### Step-by-step: Creating and Publishing Algorithm

First, create your algorithm by POSTing to https://api.algorithmia.com/v1/algorithms/USERNAME, where `USERNAME` is your user account, and `sim******` is an API Key from that account with "Allow this key to manage my algorithm" enabled.

Note that the definition of the new Algorithm is in the payload of the POST, and the fields roughly correspond to those you'd see in the [Add Algorithm]({{site.url}}{{site.baseurl}}/algorithm-development/algorithm-basics/your-first-algo/#create-your-first-algorithm) user interface.

```python
import requests
url = 'https://api.algorithmia.com/v1/algorithms/USERNAME'
headers = {
  'Authorization': 'sim********',
  'Content-Type': 'application/json'
}
payload = '{
    "details": {
        "summary": "<string>",
        "label": "<string>",
        "tagline": "<string>"
    },
    "name": "<string>",
    "settings": {
        "license": "<string>",
        "network_access": "<string>",
        "pipeline_enabled": "<boolean>",
        "source_visibility": "<string>",
        "language": "<string>",
        "environment": "<string>",
        "package_set": "<string>",
        "royalty_microcredits": "<integer>"
    },
    "version_info": {
        "sample_input": "<string>"
    }
}'
response = requests.request('POST', url, headers = headers, data = payload)
print(response.text)
```
