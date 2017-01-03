---
layout: article_page
title:  "Recipes"
date:   2016-12-27 15:38:38
permalink: /tutorials/recipes/
categories: tutorials
show_related: false
excerpt: "All the recipes"
recipe_tags: ["text-analysis", "machine-learning", "computer-vision", "deep-learning"]
---

{% assign recipes = site.categories["recipes"] | sort:"title" %}
{% for tag in page.recipe_tags %}
  {% include recipe-grid.html %}
  {% unless forloop.last %}
  <hr>
  {% endunless %}
{% endfor %}
