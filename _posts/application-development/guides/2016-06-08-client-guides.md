---
layout: article_page
title:  "Overview"
excerpt: "Guides to building an app using an algorithm from Algorithmia in: Python, R, Scala, Rust, Java, Ruby, JavaScript, Go, Swift, and Android."
date:  2016-06-08 17:01:37
permalink: /client-guides/overview
redirect_from:
  - /client-guides/overview
categories: client-guides
tags: [app-guide-overview]
show_related: false
author: steph_kim
image:
    teaser: /icons/Algorithmia_Microservices.png
---

Here you can run through a tutorial in your prefered language. The tutorial will teach you how to setup the Algorithmia client and make an API call.

### Supported languages

{% assign sorted_clients = site.categories["client-guides"] | sort:"title" %}
{% for post in sorted_clients %}
  {% include post-grid.html %}
{% endfor %}


