---
author: jon_peck
excerpt: "Guides and Plugins to integrate Algorithmia into other services/apps"
layout: article_page
show_related: false
tags: [app-guide-overview]
title:  "Integrations"
---

<div class="row lang-tile-container">
{% assign sorted_tiles = site.pages | where: "categories", "integrations" | sort:"title" %}
{% for post in sorted_tiles %}
  {% include post-grid-with-excerpt.html %}
{% endfor %}
</div>

