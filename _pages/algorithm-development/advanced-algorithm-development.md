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
menus:
  algo_development:
    url: /developers/algorithm-development/advanced-algorithm-development
    title: "Deep Dives"
    weight: 2
---

<div>
  {% assign post_title = "Local Development" %}
  {% assign post_subtitle = "Emulating the Algorithmia execution environment." %}
  <a href="{{site.baseurl}}/algorithm-development/advanced-algorithm-development/local-development"
    title="{{ post_title }}: {{ post_subtitle }}"
    class="syn-card outlined actionable syn-link-no-decoration">
    <div class="syn-media-object">
      <div class="syn-media-object-image">
        <div class="syn-user-image syn-user-image-96 full-image">
          <img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/local_development/local_development.png" alt="icon" itemprop="image">
        </div>
      </div>
      <div class="syn-media-object-body syn-flex direction-column justify-center">
        <h4 itemprop="name" class="syn-mb-8">{{ post_title }}</h4>
        <div class="syn-body-2 syn-text-secondary syn-mb-0">{{ post_subtitle }}</div>
      </div>
    </div>
  </a>
  {% assign post_title = "Inspecting Algorithms: determining the live list of packages / dependencies" %}
  <div class="col-xs-6 col-sm-6 col-md-4" style="text-decoration: none!important;">
    <a href="{{site.baseurl}}/algorithm-development/advanced-algorithm-development/list-packages" title="{{ post_title }}" class="post-teaser lang-tile lang-tile-large" style="text-decoration: none!important;">
      <div style="min-height:60%"><img class="larger_icon" src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/list_packages/dependencies.png" alt="icon" itemprop="image"></div>
      <p itemprop="name" class="lg text-primary">{{ post_title }}</p>
    </a>
  </div>
  {% assign post_title = "Multithreading: call many Algorithms in parallel" %}
  <div class="col-xs-6 col-sm-6 col-md-4" style="text-decoration: none!important;">
    <a href="{{site.baseurl}}/algorithm-development/advanced-algorithm-development/multithreading" title="{{ post_title }}" class="post-teaser lang-tile lang-tile-large" style="text-decoration: none!important;">
      <div style="min-height:60%"><img class="larger_icon" src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/multithreading/multithreading.png" alt="icon" itemprop="image"></div>
      <p itemprop="name" class="lg text-primary">{{ post_title }}</p>
    </a>
  </div>
  {% assign post_title = "Batch Processing: efficiently run predictions on large data volumes" %}
  <div class="col-xs-6 col-sm-6 col-md-4" style="text-decoration: none!important;">
    <a href="{{site.baseurl}}/algorithm-development/advanced-algorithm-development/batch-processing" title="{{ post_title }}" class="post-teaser lang-tile lang-tile-large" style="text-decoration: none!important;">
      <div style="min-height:60%"><img class="larger_icon" src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/batch-processing/batch_processing.png" alt="icon" itemprop="image"></div>
      <p itemprop="name" class="lg text-primary">{{ post_title }}</p>
    </a>
  </div>
  {% socialcard https://blog.algorithmia.com/advanced-grammar-and-natural-language-processing-with-syntaxnet/ %}
  {% socialcard https://blog.algorithmia.com/deep-dive-into-object-detection-with-open-images-using-tensorflow/ %}
  {% socialcard https://blog.algorithmia.com/deep-dive-into-parallelized-video-processing/ %}
</div>
