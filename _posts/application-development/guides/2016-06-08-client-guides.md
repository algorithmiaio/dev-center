---
layout: article_page
title:  "Client Guides"
excerpt: "Guides to building an app using an algorithm from Algorithmia in: Python, Scala, Rust, Java, Ruby and JavaScript."
date:  2016-06-08 17:01:37
categories: application-development
tags: [app-guide-overview]
show_related: false
author: steph_kim
image:
    teaser: /icons/Algorithmia_Microservices.png
---

### Guides to Currently Supported Languages:
<div id="page-wrapper">

  <div class="tiles">
    {% assign sorted_clients = site.categories["clients"] | sort:"title" %}
    {% for post in sorted_clients %}
      {% include post-grid.html %}
    {% endfor %}
  </div><!-- /.tiles -->

</div>
