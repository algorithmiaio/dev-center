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
    teaser: /icons/Algorithmia_Sample_Apps.png
---

# Hosting Model Overview

Here you will find guides to hosting your model in the library of your choice.

If you have any questions about Algorithmia or <a href="http://blog.algorithmia.com/2016/05/how-we-hosted-our-model-as-a-microservice/">hosting your model</a> on the Algorithmia platform please <a href="mailto:support@algorithmia.com">get in touch</a>!


### Guides to Currently Supported Frameworks:
{% assign model_tags = "algo-model-guide" | split:"|" %}
<div>
  {% for post in site.posts %}
  	{% if model_tags == post.tags %}
  		<div class="tile-guides">
	      	<a  href="{{ post.url }}">{{ post.title }}
	      	{% if post.image.teaser %}
	  			<img  src="{{ site.url }}/images/{{ post.image.teaser }}" alt="" itemprop="image">
			{% endif %}
			</a>
		</div>
	{% endif %}
  {% endfor %}
</div>