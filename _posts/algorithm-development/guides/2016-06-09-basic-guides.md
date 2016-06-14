---
layout: article_page
title:  "Basics"
excerpt: "Basic Guides for Algorithm Developers"
date:  2016-06-09 17:01:37
categories: algorithm-development
tags: [app-guide-overview]
show_related: false
author: steph_kim
image:
    teaser: /icons/Algorithmia_Guides.png
---

<!-- create array of 'basics' tags -->
{% assign basics_tags = "getting-started|algo-dev|how-to" | split:"|" %}

<div id="basics-index">

  <section class="row">
    <div class="two-columns">
    {% for tag in site.tags %}
      {% assign t = tag | first %}
      {% assign posts = tag | last %}
      <!-- Pulls from data/tags.yml to allow for data defined name attr -->
      {% assign new_tag = site.data.tags[t] %}

      {% if basics_tags contains t %}

          <h2> {{ new_tag.name }}</h2>

          <section class="basics-posts">
          {% for post in site.categories["basics"] %}
            {% if post.tags contains t %}
              {% include post-list-with-excerpt.html %}
            {% endif %}
          {% endfor %}
          </section>
    </div> <!-- end .two-columns -->

      {% else %}
      <!-- skip tag if not in basics-tags -->
      {% continue %}
      {% endif %}

    {% endfor %}
  </section>
</div>
