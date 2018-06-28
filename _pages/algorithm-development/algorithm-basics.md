---
layout: article_page
title:  Algorithm Basics
categories: algorithm-development
tags: [algo-dev]
nav_category: algorithm-basics
show_related: false
author: steph_kim
---

{% assign basics_tags = "algo-dev-basics" | split:"|" %}
<div class="row lang-tile-container">
  {% assign pages = site.pages | where: "categories", algorithm-basics" %}
  {% for post in pages %}
		{% include post-grid.html %}
  {% endfor %}
</div>