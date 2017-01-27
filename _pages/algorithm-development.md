---
layout: article_page
title:  "Algorithm development"
excerpt: "Basic Guides for Algorithm Developers"
show_related: false
---

<div class="overview-container">
{% assign pages = site.pages | where: "categories", "algorithm-development" %}
{% for post in pages %}
  <div class="col-md-6 overview-brief">
    <h3><a href="{{ post.url | relative_url }}">{{ post.title }}</a></h3>
    <p class="lg">{{ post.excerpt }}</p>
  </div>
{% endfor %}
</div>
