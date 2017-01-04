---
layout: article_page
title:  "Bounties"
date:   2017-01-04 14:34:38
permalink: /bounties/
show_related: false
excerpt: "Bounties"
---

{% assign bounties_tags = "bounties" | split:"|" %}
<div class="tutorials-container">
  {% for post in site.posts %}
    {% if bounties_tags == post.categories %}
    <div class="col-md-6 tutorials-brief">
		<h3><a href="{{ site.url }}{{ post.permalink }}">{{ post.title }}</a></h3>
		<p class="lg">{{ post.excerpt }}</p>
	</div>
  {% endif %}
  {% endfor %}
</div>