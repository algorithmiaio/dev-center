---
layout: article
title:  "Tutorials"
date:   2016-12-27 15:38:38
permalink: /tutorials/
show_related: false
author: liz_rush
excerpt: "Tutorials. Sample apps and recipes to help you learn whats going on."
---

Here you will find sample apps and recipes (which are a little bit different).

<div>
{% for post in site.categories["tutorials"] %}
  <div class="col-md-6 tutorials-brief">
    <a href="{{ site.url }}{{ post.permalink }}"><img src="{{ site.url }}{{ site.baseurl }}/images//icons/{{ post.title }}.svg" alt="" itemprop="image"></a>
    <h3><a href="{{ site.url }}{{ post.permalink }}">{{ post.title }}</a></h3>
    <p class="lg">{{ post.excerpt }}</p>
  </div>
{% endfor %}
</div>
