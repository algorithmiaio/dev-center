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
  - /clients/cURL/
  - /application-development/lang-guides/
---


<div class="row mb-64">
  <div class="col-md-12">
    <h3>Get Started</h3>
    <div class="dev-card">
      <img src="{{site.cdnurl}}{{site.baseurl}}/images/get_started.png" alt="Get Started" class="img-fill get-started-img">
      <img src="{{site.cdnurl}}{{site.baseurl}}/images/icons/hexicon_desktop.svg" alt="icon" class="hexicon">
      <div class="dev-card-text">
        <p class="lead">Get up to speed with the Algorithmia marketplace</p>
        <a href="{{site.baseurl}}/getting-started" class="btn btn-default btn-accent">Get Started Now</a>
      </div>
    </div>
  </div>
</div>

After you've [made your first API call](https://algorithmia.com/developers/getting-started), you can learn more about using the Algorithmia clients in the guides below. The clients can be used in your own applications to call algorithms, [access data]({{site.baseurl}}/data), or to manage the Algorithmia platform. The clients can also be used in the algorithms you write, letting you work with the [Data API](https://algorithmia.com/developers/api/#data) or call additional algorithms from your own code, letting you use utility functions and chain algorithms together. 

For a complete description of the API's functionality, you can refer to the [API docs](https://algorithmia.com/developers/api).

In addition to the client guides, you can visit our [integrations page](https://algorithmia.com/developers/integrations) for more details about integrating with other software and frameworks, such as building apps for [R Shiny]({{site.baseurl}}/tutorials/sample-apps/shiny-app), calling the API in [Spark Streaming](integrations/spark-streaming), working with [MLFlow](https://algorithmia.com/developers/clients/mlflow), visualizing data with [Tableau](https://algorithmia.com/developers/integrations/tableau), and making use of the [Algorithmia Insights](https://algorithmia.com/developers/algorithmia-enterprise/algorithmia-insights) metrics pipeline.

The guides below will take you through setting up and using the Algorithmia client libraries for our supported languages.

<div class="row lang-tile-container">
{% assign sorted_clients = site.pages | where: "categories", "clients" | sort:"title" %}
{% for post in sorted_clients %}
  {% include post-grid.html %}
{% endfor %}
</div>

