---
layout: article_page
title:  "Recipes"
date:   2016-12-27 15:38:38
permalink: /tutorials/recipes/
categories: tutorials
show_related: false
excerpt: "All the recipes"
---

{% assign model_tags = "recipe" | split:"|" %}
<div>
  {% for post in site.posts %}
    {% if model_tags == post.tags %}
    {% include recipe-grid.html %}
  {% endif %}
  {% endfor %}
</div>