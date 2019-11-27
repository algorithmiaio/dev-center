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
menus:
  devcenter:
    url: /developers/clients
    title: "Client Guides"
    weight: 3
    identifier: clients
  clients:
    url: /developers/clients
    title: "Overview"
    weight: 1
---

{% include aside-start.html %}

After you learn how to call algorithms, check out our <a href="{{site.baseurl}}/data">Data Connectors</a> that we support and learn how to work with data using our <a href="http://docs.algorithmia.com/">Data API</a>.

For how to chain algorithms together to build useful pipelines or call our API from Android, iOS, or R Shiny check out our <a href="{{site.baseurl}}/tutorials">Tutorials</a>.

And if you're looking to call the API in Spark Streaming, H2O, and more check out
<a href="{{site.baseurl}}/integrations">Integrations</a>.

Also, after checking out the Getting Started Guide above, go through a more thorough tutorial in your preferred language. The guides below will take you step-by-step showing you how to work with data, call algorithms and get the response:

{% include aside-middle.html %}
<div>
  <a href="{{site.baseurl}}/getting-started" class="syn-card actionable syn-link-no-decoration">
    <div class="syn-media-object">
      <div class="syn-media-object-image">
        <div class="syn-user-image syn-user-image-56">
          <img src="{{site.cdnurl}}{{site.baseurl}}/images/icons/rocket.svg" alt="Rocket icon">
        </div>
      </div>
      <div class="syn-media-object-body">
        <h5 class="syn-mb-8">Getting Started</h5>
        <div class="syn-body-2 syn-mb-0">Get up to speed with the platform.</div>
      </div>
      <div class="syn-media-object-actions">
        <i class="material-icons">arrow_forward</i>
      </div>
    </div>
  </a>
</div>
{% include aside-end.html %}

<div>
  <div class="syn-row syn-mt-32">
  {% assign sorted_clients = site.pages | where: "categories", "clients" | sort:"title" %}
  {% for post in sorted_clients %}
    {% include post-grid.html %}
  {% endfor %}
  </div>
</div>
