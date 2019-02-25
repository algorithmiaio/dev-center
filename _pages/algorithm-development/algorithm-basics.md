---
layout: article_page
title:  Algorithm Basics
excerpt: "Learn how to get started contributing your work and learn tips working with git, markdown, and better error handling on Algorithmia."
categories: algorithm-development
tags: [algo-dev]
nav_category: algorithm-basics
nav_overview: "Overview"
nav_index: 0
show_related: false
author: steph_kim
---

Welcome to algorithm development basics, where you'll find information on how to get started, what you should include in your algorithms, create better error handling, and more.

{% assign basics_tags = "algorithm-basics" | split:"|" %}
{% assign sorted_pages = site.pages | sort:"nav_index" %}
<div class="row overview-container">
  {% for post in sorted_pages %}
    {% if basics_tags == post.categories %}
    <div class="col-md-12 overview-brief">
		<h3><a href="{{ post.url | relative_url }}">{{ post.title }}</a></h3>
		<p class="lg">{{ post.excerpt }}</p>
	</div>
  {% endif %}
  {% endfor %}
</div>

