---
layout: article
title:  "Deep Dives"
excerpt: "Best Practices and Deep Dives for Algorithm Development and Model Deployment"
categories: algorithm-development
tags: [algo-dev]
show_related: false
author: steph_kim
image:
  teaser: /icons/algo.svg
---

<div class="row lang-tile-container">
  {% assign post_title = "Multithreading: call many Algorithms in parallel" %}
  <div class="col-xs-6 col-sm-6 col-md-4" style="text-decoration: none!important;">
    <a href="{{site.baseurl}}/algorithm-development/advanced-algorithm-development/multithreading" title="{{ post_title }}" class="post-teaser lang-tile lang-tile-large" style="text-decoration: none!important;">
      <div style="min-height:60%"><img class="larger_icon" src="{{site.baseurl}}/images/post_images/multithreading/multithreading.png" alt="icon" itemprop="image"></div>
      <p itemprop="name" class="lg text-primary">{{ post_title }}</p>
    </a>
  </div>
  {% assign post_title = "Batch Processing: efficiently run predictions on large data volumes" %}
  <div class="col-xs-6 col-sm-6 col-md-4" style="text-decoration: none!important;">
    <a href="{{site.baseurl}}/algorithm-development/advanced-algorithm-development/batch-processing" title="{{ post_title }}" class="post-teaser lang-tile lang-tile-large" style="text-decoration: none!important;">
      <div style="min-height:60%"><img class="larger_icon" src="{{site.baseurl}}/images/post_images/batch-processing/batch_processing.png" alt="icon" itemprop="image"></div>
      <p itemprop="name" class="lg text-primary">{{ post_title }}</p>
    </a>
  </div>
  {% socialcard https://blog.algorithmia.com/advanced-grammar-and-natural-language-processing-with-syntaxnet/ %}
  {% socialcard https://blog.algorithmia.com/deep-dive-into-object-detection-with-open-images-using-tensorflow/ %}
  {% socialcard https://blog.algorithmia.com/deep-dive-into-parallelized-video-processing/ %}
</div>
