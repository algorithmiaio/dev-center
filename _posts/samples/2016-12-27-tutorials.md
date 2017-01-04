---
layout: article_page
title:  "Tutorials"
date:   2016-12-27 15:38:38
permalink: /tutorials/
show_related: false
author: liz_rush
excerpt: "Tutorials. Sample apps and recipes to help you learn whats going on."
---

{% assign tutorial_tags = "tutorials" | split:"|" %}
<div class="tutorials-container">
  {% for post in site.posts %}
    {% if tutorial_tags == post.categories %}
    <div class="col-md-6 tutorials-brief">
    	<a href="{{ site.url }}{{ post.permalink }}"><img src="{{ site.url }}/images//icons/{{ post.title }}.svg" alt="" itemprop="image"></a>
		<h3><a href="{{ site.url }}{{ post.permalink }}">{{ post.title }}</a></h3>
		<p class="lg">{{ post.excerpt }}</p>
	</div>
  {% endif %}
  {% endfor %}
</div>
