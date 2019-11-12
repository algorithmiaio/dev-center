---
layout: api_docs_article
title:  "Algorithm Management API"
---

Using the Algorithm Management APIs, you can create, publish, update, and inspect individual algorithms. At present, these are only available in Python.

To try out a complete training-to-deployment pipeline, get the [runnable Jupyter Notebook](https://github.com/algorithmiaio/model-deployment).

IMPORTANT:

<div class="syn-body-1" markdown="1">

1. Before using these functions, update to the latest Python client: `pip install -U Algorithmia`

2. Create a *NEW* API Key at https://algorithmia.com/user#credentials or in your own Algorithmia cluster, with the option "Allow this key to manage my algorithms" turned on. Do not use this key for other purposes.

</div>