---
layout: article_page
title:  "Algorithm Development Overview"
nav_overview: "Overview"
nav_index: 0
excerpt: "Basic Guides for Algorithm Developers"
show_related: false
---

<p>Welcome to deploying your algorithms and models using Algorithmia's AI Layer. You can create algorithms using Java, Python, R, Rust, Scala, Ruby, and JavaScript by following along with one of our <a href="{{ site.baseurl }}/algorithm-development/languages/">Language Guides</a>.</p> 

<<<<<<< HEAD

<p>If you have a trained machine or deep learning model and want to deploy it on our platform, check out the <a href="{{ site.baseurl }}/algorithm-development/model-guides/">Model Deployment Guides</a> where you'll see tutorials for popular frameworks such as <a href ="{{ site.baseurl }}/algorithm-development/model-guides/scikit/">Scikit-learn</a>, <a href ="{{ site.baseurl }}/algorithm-development/model-guides/pytorch/">PyTorch</a>, and <a href ="{{ site.baseurl }}/algorithm-development/model-guides/tensorflow/">Tensorflow</a>.</p>

<div class="row mb-64">
  <div class="col-md-12">
    <h3>Get Started</h3>
    <div class="dev-card">
      <img src="{{ site.baseurl }}/images/get_started.png" alt="Get Started" class="img-fill get-started-img">
      <img src="{{ site.baseurl }}/images/icons/hexicon_desktop.svg" alt="icon" class="hexicon">
      <div class="dev-card-text">
        <p class="lead">Learn how to create and publish your algorithms</p>
        <a href="{{ site.baseurl }}/algorithm-development/algorithm-basics/your-first-algo/" class="btn btn-default btn-accent">Get Started Now</a>
      </div>
    </div>
  </div>
</div>

<p>If you have a trained machine or deep learning model and want to deploy it on our platform, check out the <a href="{{ site.baseurl }}/algorithm-development/model-guides/">Deploy Model Guides</a> where you'll see tutorials for popular frameworks such as <a href ="{{ site.baseurl }}/algorithm-development/model-guides/scikit/">Scikit-learn</a>, <a href ="{{ site.baseurl }}/algorithm-development/model-guides/pytorch/">PyTorch</a>, and <a href ="{{ site.baseurl }}/algorithm-development/model-guides/tensorflow/">Tensorflow</a>.</p>

=======
<p>If you have a trained machine or deep learning model and want to deploy it on our platform, check out the <a href="{{ site.baseurl }}/algorithm-development/model-guides/">Deploy Model Guides</a> where you'll see tutorials for popular frameworks such as <a href ="{{ site.baseurl }}/algorithm-development/model-guides/scikit/">Scikit-learn</a>, <a href ="{{ site.baseurl }}/algorithm-development/model-guides/pytorch/">PyTorch</a>, and <a href ="{{ site.baseurl }}/algorithm-development/model-guides/tensorflow/">Tensorflow</a>.</p>
>>>>>>> 07181426d9b7a96545e2cf4986b194980b6c5474

<div class="row overview-container">
{% assign pages = site.pages | where: "categories", "algorithm-development" %}
{% for post in pages %}
  <div class="col-md-12 overview-brief">
    <h3><a href="{{ post.url | relative_url }}">{{ post.title }}</a></h3>
    <p class="lg">{{ post.excerpt }}</p>
  </div>
{% endfor %}
</div>
