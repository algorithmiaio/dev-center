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


{% assign basics_tags = "algo-dev-basics" | split:"|" %}
<div class="row lang-tile-container">
  {% assign pages = site.pages | where: "categories", algorithm-bassics" %}
  {% for post in pages %}
		{% include post-grid.html %}
  {% endfor %}
</div>

