---
excerpt: "Learn how to administer an Algorithmia cluster."
layout: article_page
redirect_from:
 - /admin/
 - /administration/
show_related: false
title: "Platform Administration"
---

{% assign admin_tags = "admin" | split:"|" %}
{% assign sorted_pages = site.pages | sort:"nav_index" %}
<div class="row overview-container">
  {% for post in sorted_pages %}
    {% if admin_tags == post.categories %}
    <div class="col-md-12 overview-brief">
		<h3><a href="{{ post.url | relative_url }}">{{post.title}}</a></h3>
		<p class="lg">{{post.excerpt}}</p>
	</div>
  {% endif %}
  {% endfor %}
</div>
