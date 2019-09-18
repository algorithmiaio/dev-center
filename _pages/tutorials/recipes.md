---
exclude_from_search: false
layout: article_page
title:  "Recipes"
categories: tutorials
show_related: false
excerpt: "All the recipes"
image:
  teaser: /icons/recipes.svg
tags: ["text-analysis", "machine-learning", "computer-vision", "utilities"]
redirect_from:
  - /guides/
---

{% assign recipes = site.pages | where: "categories", "recipes" | sort:"title" %}
{% include recipe-grid.html %}

