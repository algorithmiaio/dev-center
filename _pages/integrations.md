---
layout: article_page
title:  "Integrations"
excerpt: "Guides and Plugins to integrate Algorithmia into other services/apps"
tags: [app-guide-overview]
show_related: false
author: jon_peck
menus:
  devcenter:
    url: /developers/integrations
    title: Integrations
    weight: 5
---

<div class="syn-row">
{% assign sorted_tiles = site.pages | where: "categories", "integrations" | sort:"title" %}
{% for post in sorted_tiles %}
  {% include post-grid-with-excerpt.html %}
{% endfor %}
</div>

