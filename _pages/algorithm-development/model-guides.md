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

Here you will find guides to hosting your machine or deep learning model. These are featured frameworks that are commonly used in machine and deep learning, however if you want to write your own model in the language of your choice using a different library, that's an option too. We currently support Java, Python, Rust, Ruby, R, JavaScript and Scala.

If you have any questions about Algorithmia or <a href="https://blog.algorithmia.com/how-we-hosted-our-model-as-a-microservice/">hosting your model</a> on the Algorithmia platform please <a href="mailto:support@algorithmia.com">get in touch</a>!


### Supported frameworks
{% assign model_tags = "algo-model-guide" | split:"|" %}
<div class="row lang-tile-container">
  {% assign pages = site.pages | where: "categories", "model-guides" %}
  {% for post in pages %}
		{% include post-grid.html %}
  {% endfor %}
</div>
