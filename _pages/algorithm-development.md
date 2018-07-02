---
layout: article_page
title:  "Algorithm Development"
excerpt: "Basic Guides for Algorithm Developers"
show_related: false
---

<p>Welcome to deploying your algorithms and models using Algorithmia's AI Layer. You can create algorithms using Java, Python, R, Rust, Scala, Ruby, and JavaScript by following along with one of our <a href="{{ site.baseurl }}/algorithm-development/languages/">Language Guides</a>.</p> 

<p>If you have a trained machine or deep learning model and want to deploy it on our platform, check out the <a href="{{ site.baseurl }}/algorithm-development/model-guides/">Deploy Model Guides</a> where you'll see tutorials for popular frameworks such as <a href ="{{ site.baseurl }}/algorithm-development/model-guides/scikit/">Scikit-learn</a>, <a href ="{{ site.baseurl }}/algorithm-development/model-guides/pytorch/">PyTorch</a>, and <a href ="{{ site.baseurl }}/algorithm-development/model-guides/tensorflow/">Tensorflow</a>.</p>

<div class="row overview-container">
{% assign pages = site.pages | where: "categories", "algorithm-development" %}
{% for post in pages %}
  <div class="col-md-12 overview-brief">
    <h3><a href="{{ post.url | relative_url }}">{{ post.title }}</a></h3>
    <p class="lg">{{ post.excerpt }}</p>
  </div>
{% endfor %}
</div>
