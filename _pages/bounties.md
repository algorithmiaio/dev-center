---
layout: article_page
title:  "Bounties"
show_related: false
excerpt: "Bounties"
---

{% assign bounties_tags = "bounties" | split:"|" %}
<div class="row overview-container">
  {% for post in site.pages %}
    {% if bounties_tags == post.categories %}
    <div class="col-md-12 overview-brief">
		<h3><a href="{{ post.url | relative_url }}">{{ post.title }}</a></h3>
		<p class="lg">{{ post.excerpt }}</p>
	</div>
  {% endif %}
  {% endfor %}
</div>
