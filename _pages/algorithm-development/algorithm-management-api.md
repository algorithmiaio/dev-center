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

Note that there are two different types of API Keys, used with different endpoints.  All Algorithm Management APIs use Simple API Keys, which can be created at {{site.url}}/user#credentials.  Ensure that the Key you are using has the checkbox "Allow this key to manage my algorithms" checked:

<img src="{{ site.cdnurl }}{{ site.baseurl }}/images/post_images/algorithm-management-api/api-key-manage-my-algorithms.png" alt="Api Keys, Manage My Algorithms" class="screenshot">


{% if site.enterprise %}
#### Enterprise Users Only: Specifying an On-Premises Endpoint
If you are running the [Algorithmia platform on-premises with Algorithmia Enterprise](https://algorithmia.com/enterprise), you must specify a different API endpoint when using these APIs. Simply replace "https://api.algorithmia.com" with the base URL of your own installation.
{% endif %}
