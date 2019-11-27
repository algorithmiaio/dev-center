---
layout: article_page
title:  "Algorithm Development Overview"
nav_index: 2
excerpt: "Basic Guides for Algorithm Developers"
show_related: false
redirect_from:
  - /algorithm-development/basic-guides/
menus:
  devcenter:
    url: /developers/algorithm-development
    title: "Algorithm Development"
    weight: 7
    identifier: algo_development
  algo_development:
    url: /developers/algorithm-development
    title: Overview
    weight: 1
---

<p>Welcome to deploying your algorithms and models using Algorithmia's AI Layer. You can create algorithms using Java, Python, R, Rust, Scala, Ruby, and JavaScript by following along with one of our <a href="{{site.baseurl}}/algorithm-development/languages">Language Guides</a>.</p>


<p>If you have a trained machine or deep learning model and want to deploy it on our platform, check out the <a href="{{site.baseurl}}/model-deployment">Model Deployment Guides</a> where you'll see tutorials for popular frameworks such as <a href ="{{site.baseurl}}/model-deployment/scikit">Scikit-learn</a> (including a hands-on video), <a href ="{{site.baseurl}}/model-deployment/pytorch">PyTorch</a>, and <a href ="{{site.baseurl}}/model-deployment/tensorflow">Tensorflow</a>.</p>

<div class="row mb-64">
  <div class="col-md-12">
    <h3>Get Started</h3>
    <div class="syn-card no-padding outlined">
      <img src="{{site.cdnurl}}{{site.baseurl}}/images/get_started.png" alt="Get Started" class="syn-card-banner-image syn-mb-24">
      <h5 class="syn-mb-8 syn-mh-16">Learn how to create and publish your algorithms</h5>
      <div class="syn-card-text syn-body-2 syn-mh-16">
        <a href="{{site.baseurl}}/algorithm-development/your-first-algo" class="syn-btn text theme-primary">Get Started Now</a>
      </div>
    </div>
  </div>
</div>

<p>If you have a trained machine or deep learning model and want to deploy it on our platform, check out the <a href="{{site.baseurl}}/model-deployment">Deploy Model Guides</a> where you'll see tutorials for popular frameworks such as <a href ="{{site.baseurl}}/model-deployment/scikit">Scikit-learn</a>, <a href ="{{site.baseurl}}/model-deployment/pytorch">PyTorch</a>, and <a href ="{{site.baseurl}}/model-deployment/tensorflow">Tensorflow</a>.</p>

<div class="row overview-container">
{% assign sorted_pages = site.pages | where: "categories", "algorithm-development" | sort:"nav_index" %}
{% for post in sorted_pages %}
  <div class="col-md-12 overview-brief">
    <h3><a href="{{ post.url | relative_url }}">{{post.title}}</a></h3>
    <p class="lg">{{post.excerpt}}</p>
  </div>
{% endfor %}
</div>
