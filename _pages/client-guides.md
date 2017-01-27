---
layout: article_page
title:  "Client guides"
excerpt: "Guides to building an app using an algorithm from Algorithmia in: Python, R, Scala, Rust, Java, Ruby, JavaScript, Go, Swift, and Android."
tags: [app-guide-overview]
show_related: false
author: steph_kim
---

Run through a tutorial in your preferred language. The tutorial will teach you how to setup the Algorithmia client and make an API call.

<div class="lang-tile-container">
{% assign sorted_clients = site.pages | where: "categories", "client-guides" | sort:"title" %}
{% for post in sorted_clients %}
  {% include post-grid.html %}
{% endfor %}
</div>

