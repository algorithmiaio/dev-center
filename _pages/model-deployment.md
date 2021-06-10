---
author: steph_kim
excerpt: "Guides to hosting a model using your favorite library."
layout: article_page
nav_overview: "Supported Frameworks"
nav_index: 0
permalink: /model-deployment/
redirect_from:
  - /algorithm-development/model-guides/
show_related: false
title:  Deploy Your Model
---

Here you'll find guides for hosting your machine or deep learning model. The frameworks featured below are all commonly used in machine and deep learning, but they aren't meant to constrain you; if you want to write your own model in the language of your choice using a framework that isn't listed, that's an option as well. We currently support algorithms written in Java, Python, Rust, Ruby, R, JavaScript, and Scala—check out our <a href="{{site.baseurl}}/algorithm-development">Algorithm Development Guides</a> to learn more.

You can also consume algorithms in external applications using one of our clients, which are available in over 15 languages. If you haven't yet visited any of our <a href="{{site.baseurl}}/clients">Client Guides</a>, be sure to go over the tutorial in whatever language you're working.

After you learn how to call algorithms, check out our <a href="http://docs.algorithmia.com/">Data API</a> and the <a href="{{site.baseurl}}/data">Data Connectors</a> we support to understand how to work with data and files.

Pick any framework listed below for a customized guide, or start with our <a href="{{site.baseurl}}/model-deployment/scikit">Scikit-Learn guide</a>, which includes a hands-on video.

Also note that our [API]({{site.baseurl}}/algorithm-development/algorithm-management) can be used to deploy and redeploy your model via Python scripts, [Jupyter Notebooks](https://github.com/algorithmiaio/model-deployment/), or [CI/CD tools such as Jenkins or GitHub Actions]({{site.baseurl}}/algorithm-development/ci-cd)).

If you have any questions about Algorithmia or <a href="https://algorithmia.com/blog/how-we-hosted-our-model-as-a-microservice">hosting your model</a> on the Algorithmia platform please <a href="mailto:support@algorithmia.com">get in touch</a>!

### Supported Machine and Deep Learning Frameworks
{% assign model_tags = "algo-model-guide" | split:"|" %}
<div class="row lang-tile-container">
  {% assign pages = site.pages | where: "categories", "model-guides" | sort:"title" %}
  {% for post in pages %}
		{% include post-grid.html %}
  {% endfor %}
</div>

To see the dependencies included in each environment, see the matrix in [Environments]({{ site.baseurl }}/model-deployment/environments/).
