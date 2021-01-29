---
layout: article_page
title:  "SQL Database Patterns"
nav_overview: "Overview"
nav_index: 0
excerpt: ""
tags: [sql-patterns-overview]
show_related: false
author: noah_crowley
---

We recommend two main patterns when working with SQL databases. You can make your database connection directly from within your own code, storing credentials outside of your source using [Hosted Data]({{site.baseurl}}/data/hosted) and the Algorithmia [Data API]({{site.baseurl}}/developers/api/#data). Or, for supported databases like [MySQL]({{site.baseurl}}/sql-patterns/mysql/), [PostgreSQL]({{site.baseurl}}/sql-patterns/postgresql), and [MS SQL Server]({{site.baseurl}}/sql-patterns/mssqlserver), you can make use of our helper algorithms to automatically store per-user credentials and make queries while keeping database connection code outside of your algorithm.

### SQL Database Patterns
{% assign sql_patterns_tags = "sql-patterns" | split:"|" %}
<div class="row data-connectors">
  {% assign sorted_pages = site.pages | sort:"nav_index" %}
  {% for post in sorted_pages %}
    {% if sql_patterns_tags == post.tags %}
      <div class="col-xs-4 col-sm-4 col-md-3">
        <a  href="{{ post.url | relative_url }}" class="lang-tile">
          {% if post.image.teaser %}
            <img  src="{{site.cdnurl}}{{ post.image.teaser | prepend:'/images' | relative_url }}" alt="" itemprop="image" class="lang-icon">
          {% endif %}
          {{post.title}}
        </a>
      </div>
    {% endif %}
  {% endfor %}
</div>
