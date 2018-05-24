---
layout: article_page
title:  "Client guides"
excerpt: "Guides to building an app using an algorithm from Algorithmia in: Python, R, Scala, Rust, Java, Ruby, JavaScript, Go, Swift, and Android."
tags: [app-guide-overview]
show_related: false
author: steph_kim
---


<div class="row mb-64">
  <div class="col-md-12">
    <h3>Get Started</h3>
    <div class="dev-card">
      <img src="{{ site.baseurl }}/images/get_started.png" alt="Get Started" class="img-fill get-started-img">
      <img src="{{ site.baseurl }}/images/icons/hexicon_desktop.svg" alt="icon" class="hexicon">
      <div class="dev-card-text">
        <p class="lead">Get up to speed with the Algorithmia marketplace</p>
        <a href="{{ site.baseurl }}/getting-started" class="btn btn-default btn-accent">Get Started Now</a>
      </div>
    </div>
  </div>
</div>

Run through a tutorial in your preferred language. The tutorial will teach you how to setup the Algorithmia client and make an API call.

<div class="row lang-tile-container">
{% assign sorted_clients = site.pages | where: "categories", "clients" | sort:"title" %}
{% for post in sorted_clients %}
  {% include post-grid.html %}
{% endfor %}
</div>

