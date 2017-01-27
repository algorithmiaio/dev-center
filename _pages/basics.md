---
layout: article_page
title:  "Basics"
show_related: false
excerpt: "Basics"
---

{% assign basics_tags = "basics" | split:"|" %}
<div class="row overview-container">
  {% for post in site.pages %}
    {% if basics_tags == post.categories %}
    <div class="col-md-12 overview-brief">
		<h3><a href="{{ post.url | relative_url }}">{{ post.title }}</a></h3>
		<p class="lg">{{ post.excerpt }}</p>
	</div>
  {% endif %}
  {% endfor %}
</div>
