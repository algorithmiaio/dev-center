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
    class="syn-card outlined actionable syn-link-no-decoration syn-mb-32">
    <div class="syn-media-object">
      <div class="syn-media-object-image">
        <div class="syn-width-capped-160">
          <img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/local_development/local_development.png" alt="icon" itemprop="image" class="syn-image-responsive">
        </div>
      </div>
      <div class="syn-media-object-body syn-flex direction-column justify-center">
        <h4 itemprop="name" class="syn-mb-8">{{ post_title }}</h4>
        <div class="syn-body-2 syn-text-secondary syn-mb-0">{{ post_subtitle }}</div>
      </div>
    </div>
  </a>
  {% assign post_title = "Inspecting Algorithms" %}
  {% assign post_subtitle = "Determining the live list of packages / dependencies." %}
  <a href="{{site.baseurl}}/algorithm-development/advanced-algorithm-development/list-packages"
    title="{{ post_title }}: {{ post_subtitle }}"
    class="syn-card outlined actionable syn-link-no-decoration syn-mb-32">
    <div class="syn-media-object">
      <div class="syn-media-object-image">
        <div class="syn-width-capped-160">
          <img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/list_packages/dependencies.png" alt="icon" itemprop="image" class="syn-image-responsive">
        </div>
      </div>
      <div class="syn-media-object-body syn-flex direction-column justify-center">
        <h4 itemprop="name" class="syn-mb-8">{{ post_title }}</h4>
        <div class="syn-body-2 syn-text-secondary syn-mb-0">{{ post_subtitle }}</div>
      </div>
    </div>
  </a>
  {% assign post_title = "Multithreading" %}
  {% assign post_subtitle = "Call many Algorithms in parallel." %}
  <a href="{{site.baseurl}}/algorithm-development/advanced-algorithm-development/multithreading"
    title="{{ post_title }}: {{ post_subtitle }}"
    class="syn-card outlined actionable syn-link-no-decoration syn-mb-32">
    <div class="syn-media-object">
      <div class="syn-media-object-image">
        <div class="syn-width-capped-160">
          <img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/multithreading/multithreading.png" alt="icon" itemprop="image" class="syn-image-responsive">
        </div>
      </div>
      <div class="syn-media-object-body syn-flex direction-column justify-center">
        <h4 itemprop="name" class="syn-mb-8">{{ post_title }}</h4>
        <div class="syn-body-2 syn-text-secondary syn-mb-0">{{ post_subtitle }}</div>
      </div>
    </div>
  </a>
  {% assign post_title = "Batch Processing" %}
  {% assign post_subtitle = "Efficiently run predictions on large data volumes." %}
  <a href="{{site.baseurl}}/algorithm-development/advanced-algorithm-development/batch-processing"
    title="{{ post_title }}: {{ post_subtitle }}"
    class="syn-card outlined actionable syn-link-no-decoration syn-mb-32">
    <div class="syn-media-object">
      <div class="syn-media-object-image">
        <div class="syn-width-capped-160">
          <img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/batch-processing/batch_processing.png" alt="icon" itemprop="image" class="syn-image-responsive">
        </div>
      </div>
      <div class="syn-media-object-body syn-flex direction-column justify-center">
        <h4 itemprop="name" class="syn-mb-8">{{ post_title }}</h4>
        <div class="syn-body-2 syn-text-secondary syn-mb-0">{{ post_subtitle }}</div>
      </div>
    </div>
  </a>
  {% assign post_title = "Syntaxnet" %}
  {% assign post_subtitle = "Advanced grammar and natural language processing" %}
  <a href="https://blog.algorithmia.com/advanced-grammar-and-natural-language-processing-with-syntaxnet/"
    title="{{ post_title }}: {{ post_subtitle }}"
    class="syn-card outlined actionable syn-link-no-decoration syn-mb-32">
    <div class="syn-media-object">
      <div class="syn-media-object-image">
        <div class="syn-width-capped-160">
          <img src="{{site.baseurl}}/images/post_images/syntaxnet/syntaxnet.png" alt="icon" itemprop="image" class="syn-image-responsive">
        </div>
      </div>
      <div class="syn-media-object-body syn-flex direction-column justify-center">
        <h4 itemprop="name" class="syn-mb-8">{{ post_title }}</h4>
        <div class="syn-body-2 syn-text-secondary syn-mb-0">{{ post_subtitle }}</div>
      </div>
    </div>
  </a>
  {% assign post_title = "Tensorflow" %}
  {% assign post_subtitle = "Deep dive into object detection with Open Images" %}
  <a href="https://blog.algorithmia.com/deep-dive-into-object-detection-with-open-images-using-tensorflow/"
    title="{{ post_title }}: {{ post_subtitle }}"
    class="syn-card outlined actionable syn-link-no-decoration syn-mb-32">
    <div class="syn-media-object">
      <div class="syn-media-object-image">
        <div class="syn-width-capped-160">
          <img src="{{site.baseurl}}/images/post_images/tensorflow/open-images.png" alt="icon" itemprop="image" class="syn-image-responsive">
        </div>
      </div>
      <div class="syn-media-object-body syn-flex direction-column justify-center">
        <h4 itemprop="name" class="syn-mb-8">{{ post_title }}</h4>
        <div class="syn-body-2 syn-text-secondary syn-mb-0">{{ post_subtitle }}</div>
      </div>
    </div>
  </a>
  {% assign post_title = "Parallelized Video Processing" %}
  {% assign post_subtitle = "Connecting several algorithms in a video processing pipeline" %}
  <a href="https://blog.algorithmia.com/deep-dive-into-parallelized-video-processing/"
    title="{{ post_title }}: {{ post_subtitle }}"
    class="syn-card outlined actionable syn-link-no-decoration syn-mb-32">
    <div class="syn-media-object">
      <div class="syn-media-object-image">
        <div class="syn-width-capped-160">
          <img src="{{site.baseurl}}/images/post_images/video_processing/parallel-video-processing.png" alt="icon" itemprop="image" class="syn-image-responsive">
        </div>
      </div>
      <div class="syn-media-object-body syn-flex direction-column justify-center">
        <h4 itemprop="name" class="syn-mb-8">{{ post_title }}</h4>
        <div class="syn-body-2 syn-text-secondary syn-mb-0">{{ post_subtitle }}</div>
      </div>
    </div>
  </a>
</div>
