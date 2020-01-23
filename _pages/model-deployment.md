---
layout: article_page
title:  Deploy Your Model
excerpt: "Guides to hosting a model using your favorite library."
nav_overview: "Supported Frameworks"
nav_index: 0
show_related: false
author: steph_kim
permalink: /model-deployment/
redirect_from:
  - /algorithm-development/model-guides/
---

Here you'll find guides for hosting your machine or deep learning model. Below you'll find featured frameworks that are commonly used in machine and deep learning, however if you want to write your own model in the language of your choice using a different library, that's an option too. We currently support Java, Python, Rust, Ruby, R, JavaScript and Scala so checkout the <a href="{{site.baseurl}}/algorithm-development">Algorithm Development Guides</a>.

If you haven't worked through our <a href="{{site.baseurl}}/clients">Client Guides</a> for how to call algorithms, be sure to go over the tutorial in the language you're working in.

After you learn how to call algorithms, check out our <a href="http://docs.algorithmia.com/">Data API</a> and the <a href="{{site.baseurl}}/data">Data Connectors</a> we support to understand how to work with data and files.

Pick any framework listed below for a customized guide, or start with our <a href="{{site.baseurl}}/model-deployment/scikit">Scikit-Learn guide</a>, which includes a hands-on video.

Also note that our [API]({{site.baseurl}}/algorithm-development/algorithm-management) can be used to deploy and redeploy your model via Python scripts, [Jupyter Notebook](https://github.com/algorithmiaio/model-deployment/), or [CI/CD such as Jenkins or GitHub Actions]({{site.baseurl}}/algorithm-development/ci-cd)).

If you have any questions about Algorithmia or <a href="https://blog.algorithmia.com/how-we-hosted-our-model-as-a-microservice/">hosting your model</a> on the Algorithmia platform please <a href="mailto:support@algorithmia.com">get in touch</a>!

### Supported Machine and Deep Learning Frameworks
{% assign model_tags = "algo-model-guide" | split:"|" %}
<div class="row lang-tile-container">
  {% assign pages = site.pages | where: "categories", "model-guides" | sort:"title" %}
  {% for post in pages %}
		{% include post-grid.html %}
  {% endfor %}
</div>
