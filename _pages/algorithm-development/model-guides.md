---
layout: article_page
title:  Host your model
excerpt: "Guides to hosting a model using your favorite library."
date:   2016-05-26 11:46:03
permalink: /algorithm-development/model-guides/
categories: algorithm-development
nav_children: host-your-model
tags: [model-guide-overview]
show_related: false
author: steph_kim
---

Here you will find guides to hosting your machine or deep learning model. These are featured frameworks that are commonly used in machine and deep learning, however if you want to write your own model in the language of your choice using a different library, that's an option too. We currently support Java, Python, Rust, Ruby, JavaScript and Scala.

If you have any questions about Algorithmia or <a href="http://blog.algorithmia.com/2016/05/how-we-hosted-our-model-as-a-microservice/">hosting your model</a> on the Algorithmia platform please <a href="mailto:support@algorithmia.com">get in touch</a>!


### Supported frameworks
{% assign model_tags = "algo-model-guide" | split:"|" %}
<div>
  {% for post in site.posts %}
  	{% if model_tags == post.tags %}
		{% include post-grid.html %}
	{% endif %}
  {% endfor %}
</div>