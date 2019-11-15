---
exclude_from_search: true
layout: article_page
title:  "Sample apps"
categories: tutorials
show_related: false
excerpt: "All the sample apps"
image:
    teaser: /icons/sample apps.svg
redirect_from:
  - /samples/
menus:
  tutorials:
    url: /developers/tutorials/sample-apps
    title: "Sample Apps"
    weight: 3
---


<div class="syn-row">
  {% assign sorted_tiles = site.pages | where: "categories", "sample-apps" %}
  {% for post in sorted_tiles %}
  	{% include post-grid-with-excerpt.html %}
  {% endfor %}
</div>
