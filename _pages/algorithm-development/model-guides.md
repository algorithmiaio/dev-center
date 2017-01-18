---
layout: article_page
title:  Host your model
excerpt: "Guides to hosting a model using your favorite library."
date:   2016-05-26 11:46:03
categories: algorithm-development
nav_children: model-guides
tags: [model-guide-overview]
show_related: false
author: steph_kim
---

Here you will find guides to hosting your machine or deep learning model. These are featured frameworks that are commonly used in machine and deep learning, however if you want to write your own model in the language of your choice using a different library, that's an option too. We currently support Java, Python, Rust, Ruby, JavaScript and Scala.

If you have any questions about Algorithmia or <a href="http://blog.algorithmia.com/2016/05/how-we-hosted-our-model-as-a-microservice/">hosting your model</a> on the Algorithmia platform please <a href="mailto:support@algorithmia.com">get in touch</a>!


### Supported frameworks
{% assign model_tags = "algo-model-guide" | split:"|" %}
<div>
  {% assign pages = site.pages | where: "categories", "model-guides" %}
  {% for post in pages %}
		{% include post-grid.html %}
  {% endfor %}
</div>
