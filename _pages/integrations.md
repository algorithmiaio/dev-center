---
layout: article_page
title:  "Integrations"
excerpt: "Guides and Plugins to integrate Algorithmia into other services/apps"
tags: [app-guide-overview]
show_related: false
author: jon_peck
---

<div class="row lang-tile-container">
{% assign sorted_tiles = site.pages | where: "categories", "integrations" | sort:"title" %}
{% for post in sorted_tiles %}
  {% include post-grid.html %}
{% endfor %}
</div>

