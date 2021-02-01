---
layout: article_page
title:  "Other Data Sources"
nav_overview: "Overview"
nav_index: 0
excerpt: ""
tags: [other-data-sources-overview]
show_related: false
author: noah_crowley
---

If your algorithm needs to read or write data files from a data source for which there is no [Data Connector]({{site.baseurl}}/data/), you can connect directly to that provider from within your algorithm using an API or client library for that data source, while storing credentials outside of your algorithm source by using [Hosted Data]({{site.baseurl}}/data/hosted) and the Algorithmia [Data API]({{site.baseurl}}/developers/api/#data).

### Other Data Sources
{% assign other_data_sources_tags = "other-data-sources" | split:"|" %}
<div class="row data-connectors">
  {% assign sorted_pages = site.pages | sort:"nav_index" %}
  {% for post in sorted_pages %}
    {% if other_data_sources_tags == post.tags %}
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