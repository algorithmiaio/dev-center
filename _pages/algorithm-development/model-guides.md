---
layout: article_page
title:  Deploy Your Model
excerpt: "Guides to hosting a model using your favorite library."
categories: algorithm-development
nav_overview: "Overview"
nav_category: model-guides
tags: [model-guide-overview]
show_related: false
author: steph_kim
---

Here you'll find guides for hosting your machine or deep learning model. Below you'll find featured frameworks that are commonly used in machine and deep learning, however if you want to write your own model in the language of your choice using a different library, that's an option too. We currently support Java, Python, Rust, Ruby, R, JavaScript and Scala so checkout the <a href="{{ site.baseurl }}/algorithm-development/">Algorithm Development Guides</a>.

If you haven't worked through our <a href="{{ site.baseurl }}/clients/">Client Guides</a> for how to call algorithms, be sure to go over the tutorial in the language you're working in.


After you learn how to call algorithms, check out our <a href="http://docs.algorithmia.com/">Data API</a> and the <a href="{{ site.baseurl }}/data/">Data Connectors</a> we support to understand how to work with data and files.


If you have any questions about Algorithmia or <a href="https://blog.algorithmia.com/how-we-hosted-our-model-as-a-microservice/">hosting your model</a> on the Algorithmia platform please <a href="mailto:support@algorithmia.com">get in touch</a>!


### Supported Machine and Deep Learning Frameworks
{% assign model_tags = "algo-model-guide" | split:"|" %}
<div class="row lang-tile-container">
  {% assign pages = site.pages | where: "categories", "model-guides" %}
  {% for post in pages %}
		{% include post-grid.html %}
  {% endfor %}
</div>
