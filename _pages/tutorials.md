---
exclude_from_search: true
layout: article_page
title:  "Tutorials"
show_related: false
excerpt: "Tutorials. Sample apps and recipes to help you learn whats going on."
menus:
  devcenter:
    url: /developers/tutorials
    title: Tutorials
    weight: 6
    identifier: tutorials
  tutorials:
    url: /developers/tutorials
    title: Overview
    weight: 1
---

Here you will find sample apps and recipes (which are a little bit different).

<div>
{% assign pages = site.pages | where: "categories", "tutorials" %}
{% for post in pages %}
  <a href="{{ post.url | relative_url}}" class="syn-card outlined actionable syn-link-no-decoration syn-mb-32">
    <h3>{{post.title}}</h3>
    <div class="syn-body-1 syn-text-secondary syn-mb-32">
      {{post.excerpt}}
    </div>
    <div class="syn-h6 syn-mb-4 syn-text-blue syn-flex align-center">
      View {{post.title}}
      <i class="material-icons syn-ml-8">arrow_forward</i>
    </div>
  </a>
{% endfor %}
</div>
