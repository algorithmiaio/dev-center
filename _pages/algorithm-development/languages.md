---
layout: article_page
title:  Supported languages
excerpt: "Guides to building an algorithm in your favorite language including: Python, R, Scala, Rust, Java, Ruby and JavaScript."
categories: algorithm-development
nav_category: languages
tags: [algo-dev]
show_related: false
author: steph_kim
---

As an Algorithmia user, in addition to having access to hundreds of algorithms, you also have the ability to add your own algorithms. You can write a private algorithm for your own use, contribute an open source algorithm, or monetize an algorithm you authored. Our algorithms and platform are designed with composability in mind, so think of algorithms in the marketplace as building blocks.

If you have algorithm code you'd like to host on the Algorithmia platform in a different language, please <a href="mailto:support@algorithmia.com">get in touch</a>! We are able to host executables in some special cases.

### Currently Supported Languages

{% assign lang_tags = "algo-guide-lang" | split:"|" %}
<div class="row lang-tile-container">
  {% assign sorted_langs = site.pages | where: "categories", "languages" | sort:"title" %}
  {% for post in sorted_langs %}
    {% include post-grid.html %}
  {% endfor %}
</div>
