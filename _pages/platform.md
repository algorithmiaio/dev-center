---
layout: article_page
title:  "Platform"
show_related: false
excerpt: "Platform"
redirect_from:
 - /basics/
 - /application-development/basic-guides/
 - /basics/algorithm_basics/
robots: noindex/nofollow
---

{% assign basics_tags = "basics" | split:"|" %}
{% assign sorted_pages = site.pages | sort:"nav_index" %}
<div class="row overview-container">
  {% for post in sorted_pages %}
    {% if basics_tags == post.categories %}
    <div class="col-md-12 overview-brief">
		<h3><a href="{{ post.url | relative_url }}">{{post.title}}</a></h3>
		<p class="lg">{{post.excerpt}}</p>
	</div>
  {% endif %}
  {% endfor %}
</div>
