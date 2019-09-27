---
layout: article_page
title:  "Client guides"
excerpt: "Guides to building an app using an algorithm from Algorithmia in: Python, R, Scala, Rust, Java, Ruby, JavaScript, Go, Swift, and Android."
tags: [app-guide-overview]
nav_overview: "Overview"
nav_index: 0
show_related: false
author: steph_kim
redirect_from:
  - /algorithm-development/client-guides/
  - /algorithm-development/guides/
  - /application-development/client-guides/
  - /application-development/guides/
---


<div class="row mb-64">
  <div class="col-md-12">
    <h3>Get Started</h3>
    <div class="dev-card">
      <img src="{{site.baseurl}}/images/get_started.png" alt="Get Started" class="img-fill get-started-img">
      <img src="{{site.baseurl}}/images/icons/hexicon_desktop.svg" alt="icon" class="hexicon">
      <div class="dev-card-text">
        <p class="lead">Get up to speed with the Algorithmia marketplace</p>
        <a href="{{site.baseurl}}/getting-started" class="btn btn-default btn-accent">Get Started Now</a>
      </div>
    </div>
  </div>
</div>

After you learn how to call algorithms, check out our <a href="{{site.baseurl}}/data">Data Connectors</a> that we support and learn how to work with data using our <a href="http://docs.algorithmia.com/">Data API</a>.

For how to chain algorithms together to build useful pipelines or call our API from Android, iOS, or R Shiny check out our <a href="{{site.baseurl}}/tutorials">Tutorials</a>.

And if you're looking to call the API in Spark Streaming, H2O, and more check out
<a href="{{site.baseurl}}/integrations">Integrations</a>.

Also, after checking out the Getting Started Guide above, go through a more thorough tutorial in your preferred language. The guides below will take you step-by-step showing you how to work with data, call algorithms and get the response:

<div class="row lang-tile-container">
{% assign sorted_clients = site.pages | where: "categories", "clients" | sort:"title" %}
{% for post in sorted_clients %}
  {% include post-grid.html %}
{% endfor %}
</div>

