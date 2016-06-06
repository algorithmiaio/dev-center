---
layout: article_page
title:  "Guide to Data Connectors"
excerpt: "How to get your data in and out of the Data API"
date:   2016-05-26 11:46:03
categories: algorithm-development
tags: [data-connectors-overview]
show_related: false
author: steph_kim
image:
    teaser: /post_images/data_connectors/connectors.png
repository: https://github.com/algorithmiaio/algorithmia/blob/master/public/images/connectors/connectors.png
---

# Data Connectors
- Algorithmia supports reading and writing data to the Algorithmia Data API, S3, and Dropbox
- Why would you want to do this???
- By creating an Algorithmia account you automatically have access to the Data API, and can store data or algorithm outputs there
- If you have a Dropbox account or S3 account, you can create a data connector to permit Algorithmia to read and write files on your behalf

If you have any questions about Algorithmia please <a href="mailto:support@algorithmia.com">get in touch</a>!

### Guides to Currently Supported Frameworks:
{% assign data_connector_tags = "data-connectors" | split:"|" %}
<div class="data-connectors">
  {% for post in site.posts %}
  	{% if data_connector_tags == post.tags %}
  		<div class="tile-guides">
	      	<a  href="{{ post.url }}">{{ post.title }}
	      	{% if post.image.teaser %}
	  			<img  src="{{ site.url }}/images/{{ post.image.teaser }}" alt="" itemprop="image">
			{% endif %}
			</a>
		</div>
	{% endif %}
  {% endfor %}
</div>
