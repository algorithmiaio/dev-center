---
layout: article_page
title:  "Host your model in minutes"
excerpt: "Guides to hosting a model using your favorite library."
date:   2016-05-26 11:46:03
categories: algorithm-development
tags: [model-guide-overview]
show_related: false
author: steph_kim
image:
    teaser: /icons/Algorithmia_Basics.png
---

# Hosting Model Overview

Here you will find guides to hosting your machine or deep learning model. These are featured frameworks that are commonly used in machine and deep learning, however if you want to write your own model in the language of your choice using a different library, that's an option too. We currently support Java, Python, Rust, Ruby, JavaScript and Scala.

If you have any questions about Algorithmia or <a href="http://blog.algorithmia.com/2016/05/how-we-hosted-our-model-as-a-microservice/">hosting your model</a> on the Algorithmia platform please <a href="mailto:support@algorithmia.com">get in touch</a>!


### Guides to Hosting Models in Currently Supported Frameworks:
{% assign model_tags = "algo-model-guide" | split:"|" %}
<div>
  {% for post in site.posts %}
  	{% if model_tags == post.tags %}
  		<!-- 
	      	<a  href="{{ post.url }}">{{ post.title }}
	      	{% if post.image.teaser %}
	  			<img  src="{{ site.url }}/images/{{ post.image.teaser }}" alt="" itemprop="image">
			{% endif %}
			</a> -->
			{% include post-grid.html %}
	
	{% endif %}
  {% endfor %}
</div>