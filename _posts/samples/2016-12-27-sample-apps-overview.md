---
layout: article_page
title:  "Sample apps"
date:   2016-12-27 15:38:38
permalink: /tutorials/sample-apps/
categories: tutorials
show_related: false
excerpt: "All the sample apps"
image:
    teaser: /icons/sample apps.svg
---

{% assign model_tags = "sample-app" | split:"|" %}
<div>
  {% for post in site.posts %}
    {% if model_tags == post.tags %}
    {% include sample-app-grid.html %}
  {% endif %}
  {% endfor %}
</div>